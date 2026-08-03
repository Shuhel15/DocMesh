import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { retrieveRelevantChunks } from "@/lib/rag/retrieve";
import { generateAnswer } from "@/lib/rag/generate";

export async function POST(request: Request) {
  try {
    // checking if the user is authenticated or not
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // reading request body
    const body = await request.json();

    const chatbotId =
      typeof body.chatbotId === "string"
        ? body.chatbotId.trim()
        : "";

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId.trim()
        : "";


    // validation
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


    // checking chatbot ownership
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: chatbotId,
        company: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });


    if (!chatbot) {
      return NextResponse.json(
        {
          error: "Chatbot not found or does not belong to the user",
        },
        {
          status: 404,
        },
      );
    }


    // create or get conversation
    let conversation;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });
    }


    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          chatbotId,
          userId: session.user.id,
        },
      });
    }


    // save user message
    await prisma.message.create({
      data: {
        role: "user",
        content: question,
        conversationId: conversation.id,
      },
    });


    // retrieve relevant chunks
    const chunks = await retrieveRelevantChunks(
      question,
      chatbotId,
      5,
    );


    // generate answer
    const answer = await generateAnswer(
      question,
      chunks,
    );


    // save assistant message
    await prisma.message.create({
      data: {
        role: "assistant",
        content: answer,
        conversationId: conversation.id,
      },
    });


    // prepare sources
    const sources = chunks.map((chunk) => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
    }));


    // return response
    return NextResponse.json({
      conversationId: conversation.id,
      answer,
      sources,
    });


  } catch (error) {
    console.error("CHAT_API_ERROR:", error);

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