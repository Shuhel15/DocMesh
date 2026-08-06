import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check logged-in user
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // Get chatbot id from URL params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "This chatbot does not exist",
        },
        { status: 400 },
      );
    }

    // Find logged-in user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Find user's company
    const company = await prisma.company.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          message: "Company not found",
        },
        { status: 404 },
      );
    }

    // Check chatbot belongs to user's company
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id,
        companyId: company.id,
      },
    });

    if (!chatbot) {
      return NextResponse.json(
        {
          success: false,
          message: "Chatbot not found",
        },
        { status: 404 },
      );
    }

    // Delete chatbot
    await prisma.chatbot.delete({
      where: {
        id,
      },
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: "Chatbot deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CHATBOT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting your chatbot",
      },
      { status: 500 },
    );
  }
}

