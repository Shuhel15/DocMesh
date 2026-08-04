import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { retrieveRelevantChunks } from "@/lib/rag/retrieve";
import { generateAnswer } from "@/lib/rag/generate";

export async function POST(request: Request) {
  try {
    // Authentication is optional .dashboard users will have a session .external visitors will not.

    const session = await auth();

    // Reading request body
    const body = await request.json();

    const chatbotId =
      typeof body.chatbotId === "string" ? body.chatbotId.trim() : "";

    const question =
      typeof body.question === "string" ? body.question.trim() : "";

    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId.trim() : "";

    // Validation
    if (!chatbotId || !question) {
      return NextResponse.json(
        {
          error: "Chatbot ID and question cannot be empty",
        },
        {
          status: 400,
        },
      );
    }

    // Check if chatbot exists
    const chatbot = await prisma.chatbot.findUnique({
      where: {
        id: chatbotId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        {
          error: "Chatbot not found",
        },
        {
          status: 404,
        },
      );
    }

    // Create or get conversation
    let conversation;

    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          chatbotId,
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          chatbotId,
          userId: session?.user?.id ?? null,
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        role: "user",
        content: question,
        conversationId: conversation.id,
      },
    });

    // Retrieve relevant chunks
    const chunks = await retrieveRelevantChunks(question, chatbotId, 5);

    // Generate answer
    const answer = await generateAnswer(question, chunks);

    // Save assistant message
    await prisma.message.create({
      data: {
        role: "assistant",
        content: answer,
        conversationId: conversation.id,
      },
    });

    // Prepare sources
    const sources = chunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
    }));

    // Return response
    return NextResponse.json({
      conversationId: conversation.id,
      answer,
      sources,
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while processing the question",
      },
      {
        status: 500,
      },
    );
  }
}
