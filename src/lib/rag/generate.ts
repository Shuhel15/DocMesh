import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const GENERATION_MODEL = "gemini-3.5-flash-lite";

const FALLBACK_MESSAGE = "Sorry, I don't have information about that.";

export type GenerationContext = {
  content: string;
  documentName: string;
  chunkIndex: number;
};

export async function generateAnswer(
  question: string,
  chunks: GenerationContext[],
): Promise<string> {
  if (!question.trim()) {
    throw new Error("Question cannot be empty");
  }

  // check if chunks is not empty
  if (chunks.length === 0) {
    return FALLBACK_MESSAGE;
  }

  // giving the context to the model in a structured way
  const context = chunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}]
Document: ${chunk.documentName}
Chunk: ${chunk.chunkIndex}
${chunk.content}`,
    ).join("\n\n---\n\n");

  const prompt = `
You are a knowledge-base chatbot.

Your job is to answer the user's question ONLY using the provided knowledge base context.

STRICT RULES:
- Anser the question ONLY using the provided knowledge base context.
- Do not give answers for those questions that are not in the context.
- If the answer is not in the context, respond with "Sorry , I don't have information about that."
- If the answer is in the context, provide a concise and accurate answer.
- If someone says Hello or Hii, respond with "Hello! How can I assist you today?"

KNOWLEDGE BASE CONTEXT:
${context}

USER QUESTION:
${question}

ANSWER:
`;

// generate the answer using the google genAi model
  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: prompt,
  });

  const answer = response.text?.trim()

  if (!answer) {
    return FALLBACK_MESSAGE;
  }

  return answer;
}
