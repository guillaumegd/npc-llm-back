import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";
const qdrantApiKey = process.env.QDRANT_API_KEY || "";
export const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || "npc_rag";

export const qdrant = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey || undefined,
});

export async function ensureCollection() {
  const vectorSize = Number(process.env.EMBEDDING_VECTOR_SIZE || 1536);
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections?.some((c: any) => c.name === QDRANT_COLLECTION);
    if (!exists) {
      await qdrant.createCollection(QDRANT_COLLECTION, {
        vectors: { size: vectorSize, distance: "Cosine" },
      });
      console.log(`Created qdrant collection ${QDRANT_COLLECTION}`);
    } else {
      console.log(`Qdrant collection ${QDRANT_COLLECTION} already exists`);
    }
  } catch (err) {
    console.error("Error ensuring qdrant collection:", err);
    throw err;
  }
}
