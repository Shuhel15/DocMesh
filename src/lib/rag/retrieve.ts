import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/rag/embeddings";

//type for the retrieved chunk
export type RetrievedChunk = {
  id: string;
  content: string;
  chunkIndex: number;
  documentId: string;
  documentName: string;
  distance: number;
};

export async function retrieveRelevantChunks(
  question: string,
  chatbotId: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  //check if question and chatbotId are not empty
  if (!question.trim()) {
    throw new Error("Question cannot be empty");
  }

  if (!chatbotId.trim()) {
    throw new Error("Chatbot ID cannot be empty");
  }

  // generate embedding for the user's question
  const questionEmbedding = await generateEmbedding(question);

  // convert embedding array to pgvector format
  const vector = `[${questionEmbedding.join(",")}]`;

  // Search only inside the current chatbot's knowledge base
  const results = await prisma.$queryRaw<RetrievedChunk[]>`
    SELECT
      dc.id,
      dc.content,
      dc."chunkIndex",
      dc."documentId",
      d.name AS "documentName",
      dc.embedding <=> ${vector}::vector AS distance

    FROM "DocumentChunk" dc

    INNER JOIN "Document" d
      ON d.id = dc."documentId"

    WHERE
      dc."chatbotId" = ${chatbotId}
      AND dc.embedding IS NOT NULL

    ORDER BY dc.embedding <=> ${vector}::vector

    LIMIT ${topK}
  `;

  return results;
}