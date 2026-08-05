import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const themeSchema = z.object({
  botId: z.string().min(1),
  theme: z.enum(["black", "white"]),
});

export async function PATCH(request: Request) {
  try {
    // auth check
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const result = themeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid theme data" },
        { status: 400 }
      );
    }

    const { botId, theme } = result.data;

    // Find user's company
    const company = await prisma.company.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Ownership check
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: botId,
        companyId: company.id,
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        { error: "Chatbot not found" },
        { status: 404 }
      );
    }

    // update theme
    const updatedChatbot = await prisma.chatbot.update({
      where: {
        id: botId,
      },
      data: {
        theme,
      },
      select: {
        id: true,
        theme: true,
      },
    });

    return NextResponse.json({
      success: true,
      chatbot: updatedChatbot,
    });
  } catch (error) {
    console.error("Theme update error:", error);

    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}