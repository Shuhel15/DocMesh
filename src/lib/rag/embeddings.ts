import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//using gemini-embedding-001 model for generating embeddings
const EMBEDDING_MODEL = "gemini-embedding-001";

export async function generateEmbedding(text: string): Promise<number[]> {
  //check if text is empty
  if (!text.trim()) {
    throw new Error("Text cannot be empty");
  }

  //generate embedding using gemini-embedding-001 model
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: 3072,
    },
  });
//extract the embedding from the response and storing it in embedding variable
  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Failed to generate embedding");
  }

  return embedding;
}