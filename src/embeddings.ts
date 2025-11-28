import axios from "axios";

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const provider = process.env.EMBEDDING_PROVIDER || "mistral";
  if (provider !== "mistral") {
    throw new Error(`Unsupported embedding provider: ${provider}`);
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not defined in the environment variables.");
  }

  const baseUrl = process.env.MISTRAL_API_BASE_URL || "https://api.mistral.ai";
  const model = process.env.EMBEDDING_MODEL || "mistral-embed";

  try {
    const response = await axios.post(
      `${baseUrl}/v1/embeddings`,
      {
        model,
        input: texts,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Mistral returns { data: [{ embedding: number[] }, ...] }
    const embeddings = response.data.data.map((item: { embedding: number[] }) => item.embedding);
    return embeddings;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
}
