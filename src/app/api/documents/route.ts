import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { extractText } from "@/lib/documents/extract-text";
import { chunkText } from "@/lib/rag/chunk";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { Prisma } from "@/generated/prisma/client";

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

    //File upload
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

      // extract text from the uploaded file
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

      // save document in the db
      const document = await prisma.document.create({
        data: {
          name: file.name,
          type: extension,
          content,
          chatbotId: chatbot.id,
        },
      });

      //chunk the content
      const chunks = chunkText(content);

      // Generate embeddings and store all chunks
      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = chunks[i];

        // Generate embedding for current chunk
        const embedding = await generateEmbedding(chunkContent);

        // Convert embedding array to PostgreSQL vector format
        const embeddingString = `[${embedding.join(",")}]`;

        // Store chunk + embedding in PostgreSQL
        await prisma.$queryRaw(
          Prisma.sql`
      INSERT INTO "DocumentChunk"
        ("id", "content", "chunkIndex", "documentId", "chatbotId", "embedding")
      VALUES
        (
          ${crypto.randomUUID()},
          ${chunkContent},
          ${i},
          ${document.id},
          ${chatbot.id},
          ${embeddingString}::vector
        )
    `,
        );
      }

      console.log("ALL CHUNKS EMBEDDING + STORAGE DONE");

      return NextResponse.json(
        {
          message: "Document uploaded successfully!",
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

      //chunk the manual content typed by user
      const chunks = chunkText(manualContent.trim());

      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = chunks[i];

        // Generate embedding
        const embedding = await generateEmbedding(chunkContent);

        // Convert embedding to PostgreSQL vector format
        const embeddingString = `[${embedding.join(",")}]`;

        // Store chunk + embedding
        await prisma.$queryRaw(
          Prisma.sql`
      INSERT INTO "DocumentChunk"
        ("id", "content", "chunkIndex", "documentId", "chatbotId", "embedding")
      VALUES
        (
          ${crypto.randomUUID()},
          ${chunkContent},
          ${i},
          ${document.id},
          ${chatbot.id},
          ${embeddingString}::vector
        )
    `,
        );
      }

      console.log("ALL MANUAL CHUNKS EMBEDDING + STORAGE DONE");

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
    console.error("DOCUMENT API ERROR:", error);

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

//Delete function for documents. This will also delete all related chunks in the DocumentChunk table
export async function DELETE(request: Request) {
  try {
    // Check authentication
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

    // Get document ID and chatbot ID
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");
    const chatbotId = searchParams.get("chatbotId");

    if (!documentId || !chatbotId) {
      return NextResponse.json(
        {
          error: "Document ID and chatbot ID are required",
        },
        {
          status: 400,
        },
      );
    }

    // Find document and verify:
    // 1. Document belongs to requested chatbot
    // 2. Chatbot belongs to logged-in user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        chatbotId,
        chatbot: {
          company: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found or access denied",
        },
        {
          status: 403,
        },
      );
    }

    // Delete related chunks first
    await prisma.documentChunk.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    // Delete document
    await prisma.document.delete({
      where: {
        id: document.id,
      },
    });

    return NextResponse.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("DOCUMENT DELETE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete document",
      },
      {
        status: 500,
      },
    );
  }
}

// Edit manula text content of a document. This will also update the chunks in the DocumentChunk table
export async function PUT(request: Request) {
  try {
    // Check authentication
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

    const body = await request.json();
    const documentId = body.documentId;
    const chatbotId = body.chatbotId;
    const title = body.title;
    const content = body.content;

    // Validate ids
    if (typeof documentId !== "string" || typeof chatbotId !== "string") {
      return NextResponse.json(
        {
          error: "Document ID and chatbot ID are required",
        },
        {
          status: 400,
        },
      );
    }

    // Validate title and content
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        {
          error: "Title is required",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        {
          error: "Content is required",
        },
        {
          status: 400,
        },
      );
    }

    // Find document and verify ownership
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        chatbotId,
        type: "text",
        chatbot: {
          company: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          error: "Document not found or access denied",
        },
        {
          status: 403,
        },
      );
    }

    // Delete old chunks
    await prisma.documentChunk.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    // Update document
    const updatedDocument = await prisma.document.update({
      where: {
        id: document.id,
      },
      data: {
        name: title.trim(),
        content: content.trim(),
      },
    });

    // Create new chunks
    const chunks = chunkText(content.trim());

    // Generate embeddings and save new chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunkContent = chunks[i];

      const embedding = await generateEmbedding(chunkContent);

      const embeddingString = `[${embedding.join(",")}]`;

      await prisma.$queryRaw(
        Prisma.sql`
          INSERT INTO "DocumentChunk"
            ("id", "content", "chunkIndex", "documentId", "chatbotId", "embedding")
          VALUES
            (
              ${crypto.randomUUID()},
              ${chunkContent},
              ${i},
              ${document.id},
              ${chatbotId},
              ${embeddingString}::vector
            )
        `,
      );
    }

    return NextResponse.json({
      message: "Manual knowledge updated successfully",
      document: {
        id: updatedDocument.id,
        name: updatedDocument.name,
        type: updatedDocument.type,
        createdAt: updatedDocument.createdAt,
      },
    });
  } catch (error) {
    console.error("DOCUMENT UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update document",
      },
      {
        status: 500,
      },
    );
  }
}
