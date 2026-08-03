import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractText } from "@/lib/documents/extract-text";
import { chunkText } from "@/lib/rag/chunk";

const ALLOWED_FILE_TYPES = ["pdf", "txt", "doc", "docx"];

export async function POST(request: Request) {
  try {
    //check authentication
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    //read form data
    const formData = await request.formData();

    const chatbotId = formData.get("chatbotId");
    const file = formData.get("file");
    const title = formData.get("title");
    const manualContent = formData.get("content");

    //validate chatbotId
    if (!chatbotId || typeof chatbotId !== "string") {
      return NextResponse.json(
        {
          error: "Chatbot ID is required",
        },
        {
          status: 400,
        },
      );
    }

    //check chatbot ownership so that user can only upload documents to their own chatbots
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: chatbotId,
        company: {
          userId: session.user.id,
        },
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        {
          error: "Chatbot not found or access denied",
        },
        {
          status: 403,
        },
      );
    }

    //file upload

    if (file instanceof File) {
      //validate file extension
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (!extension || !ALLOWED_FILE_TYPES.includes(extension)) {
        return NextResponse.json(
          {
            error: "Only PDF, TXT, DOC, and DOCX files are supported",
          },
          {
            status: 400,
          },
        );
      }

      // extract text
      const content = await extractText(file);

      if (!content.trim()) {
        return NextResponse.json(
          {
            error: "No readable text found in the document",
          },
          {
            status: 400,
          },
        );
      }

      // save document
      const document = await prisma.document.create({
        data: {
          name: file.name,
          type: extension,
          content,
          chatbotId: chatbot.id,
        },
      });

      //temporary for testing chunking
      const chunks = chunkText(content);

      console.log("CHUNK TEST");
      console.log("Total chunks:", chunks.length);
      console.log("First chunk:", chunks[0]);
      console.log("Last chunk:", chunks[chunks.length - 1]);
      

      return NextResponse.json(
        {
          message: "Document uploaded successfully",
          document: {
            id: document.id,
            name: document.name,
            type: document.type,
            createdAt: document.createdAt,
          },
        },
        {
          status: 201,
        },
      );
    }

    //manual content upload
    if (typeof title === "string" && typeof manualContent === "string") {
      if (!title.trim()) {
        return NextResponse.json(
          {
            error: "Title is required",
          },
          {
            status: 400,
          },
        );
      }

      if (!manualContent.trim()) {
        return NextResponse.json(
          {
            error: "Content is required",
          },
          {
            status: 400,
          },
        );
      }

      // save manual knowledge
      const document = await prisma.document.create({
        data: {
          name: title.trim(),
          type: "text",
          content: manualContent.trim(),
          chatbotId: chatbot.id,
        },
      });


      //temporary for testing chunking
      const chunks = chunkText(manualContent.trim());

      console.log("MANUAL CHUNK TEST");
      console.log("Total chunks:", chunks.length);
      console.log("First chunk:", chunks[0]);
      console.log("Last chunk:", chunks[chunks.length - 1]);

      return NextResponse.json(
        {
          message: "Knowledge added successfully",
          document: {
            id: document.id,
            name: document.name,
            type: document.type,
            createdAt: document.createdAt,
          },
        },
        {
          status: 201,
        },
      );
    }

    // neither file or manual content
    return NextResponse.json(
      {
        error: "File or manual content is required",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error("DOCUMENT_API_ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to process document",
      },
      {
        status: 500,
      },
    );
  }
}
