import fs from "fs";
import path from "path";
import { embedTexts } from "./embeddings";
import { qdrant, QDRANT_COLLECTION, ensureCollection } from "./qdrantClient";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = Number(process.env.EMBEDDING_CHUNK_SIZE || 500);
const TOP_K = Number(process.env.EMBEDDING_TOP_K || 3);

interface Document {
  content: string;
  source: string;
}

interface Chunk {
  id: string;
  text: string;
  source: string;
}

/**
 * Interface for search result payload
 */
interface SearchResultPayload {
  text: string;
  source: string;
}

/**
 * Splits text into chunks by sentences or paragraphs with overlap for better retrieval quality.
 * Attempts to break at sentence boundaries to avoid splitting words mid-way.
 */
function chunkText(text: string, source: string): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Split by paragraphs first (double newlines)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  let currentChunk = "";
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph exceeds chunk size and we have content, save current chunk
    if (currentChunk.length > 0 && currentChunk.length + paragraph.length + 2 > CHUNK_SIZE) {
      chunks.push({
        id: uuidv4(),
        text: currentChunk.trim(),
        source,
      });
      currentChunk = "";
    }
    
    // If paragraph itself is larger than chunk size, split by sentences
    if (paragraph.length > CHUNK_SIZE) {
      // Split by sentence-ending punctuation followed by space or newline
      const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      
      for (const sentence of sentences) {
        if (currentChunk.length > 0 && currentChunk.length + sentence.length + 1 > CHUNK_SIZE) {
          chunks.push({
            id: uuidv4(),
            text: currentChunk.trim(),
            source,
          });
          currentChunk = "";
        }
        
        // If single sentence is still too large, split by words as fallback
        if (sentence.length > CHUNK_SIZE) {
          const words = sentence.split(/\s+/);
          for (const word of words) {
            if (currentChunk.length > 0 && currentChunk.length + word.length + 1 > CHUNK_SIZE) {
              chunks.push({
                id: uuidv4(),
                text: currentChunk.trim(),
                source,
              });
              currentChunk = "";
            }
            currentChunk += (currentChunk.length > 0 ? " " : "") + word;
          }
        } else {
          currentChunk += (currentChunk.length > 0 ? " " : "") + sentence;
        }
      }
    } else {
      currentChunk += (currentChunk.length > 0 ? "\n\n" : "") + paragraph;
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: uuidv4(),
      text: currentChunk.trim(),
      source,
    });
  }
  
  return chunks;
}

/**
 * Gathers static documents from data/*.json, data/*.txt, and README.md
 */
function gatherDocuments(): Document[] {
  const documents: Document[] = [];
  const dataDir = path.join(__dirname, "../data");
  const rootDir = path.join(__dirname, "..");

  // Read data directory files
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (ext === ".json" || ext === ".txt") {
          try {
            const content = fs.readFileSync(filePath, "utf-8");
            documents.push({
              content,
              source: `data/${file}`,
            });
          } catch (err) {
            console.warn(`Failed to read ${filePath}:`, err);
          }
        }
      }
    }
  }

  // Read README.md
  const readmePath = path.join(rootDir, "README.md");
  if (fs.existsSync(readmePath)) {
    try {
      const content = fs.readFileSync(readmePath, "utf-8");
      documents.push({
        content,
        source: "README.md",
      });
    } catch (err) {
      console.warn(`Failed to read README.md:`, err);
    }
  }

  return documents;
}

/**
 * Indexes all static documents into Qdrant
 */
export async function indexAll(): Promise<{ indexed: number }> {
  await ensureCollection();

  const documents = gatherDocuments();
  const allChunks: Chunk[] = [];

  for (const doc of documents) {
    const chunks = chunkText(doc.content, doc.source);
    allChunks.push(...chunks);
  }

  if (allChunks.length === 0) {
    console.log("No documents to index.");
    return { indexed: 0 };
  }

  // Batch upserts to avoid oversized requests (batch size of 100)
  const BATCH_SIZE = 100;
  let indexed = 0;

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.text);

    try {
      const embeddings = await embedTexts(texts);

      const points = batch.map((chunk, idx) => ({
        id: chunk.id,
        vector: embeddings[idx],
        payload: {
          text: chunk.text,
          source: chunk.source,
        },
      }));

      await qdrant.upsert(QDRANT_COLLECTION, {
        wait: true,
        points,
      });

      indexed += batch.length;
      console.log(`Indexed ${indexed}/${allChunks.length} chunks`);
    } catch (err) {
      console.error(`Error indexing batch starting at ${i}:`, err);
      throw err;
    }
  }

  console.log(`Indexing complete: ${indexed} chunks indexed.`);
  return { indexed };
}

/**
 * Searches for relevant snippets given a query
 */
export async function search(query: string): Promise<string[]> {
  try {
    const [queryEmbedding] = await embedTexts([query]);

    const results = await qdrant.search(QDRANT_COLLECTION, {
      vector: queryEmbedding,
      limit: TOP_K,
      with_payload: true,
    });

    const snippets = results
      .filter((r) => {
        const payload = r.payload as unknown as SearchResultPayload | null | undefined;
        return payload?.text;
      })
      .map((r) => {
        const payload = r.payload as unknown as SearchResultPayload;
        return payload.text;
      });

    return snippets;
  } catch (err) {
    console.warn("RAG search failed, returning empty context:", err);
    return [];
  }
}

/**
 * Gets the status of the RAG knowledge base
 */
export async function getStatus(): Promise<{ collection: string; pointsCount: number | null; status: string }> {
  try {
    const info = await qdrant.getCollection(QDRANT_COLLECTION);
    return {
      collection: QDRANT_COLLECTION,
      pointsCount: info.points_count ?? null,
      status: info.status ?? "unknown",
    };
  } catch (err) {
    console.warn("Failed to get KB status:", err);
    return {
      collection: QDRANT_COLLECTION,
      pointsCount: null,
      status: "error",
    };
  }
}
