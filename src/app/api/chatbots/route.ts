import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    // 1.Check logged-in user
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

    // 2.Find user
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

    // 3.Find user's company
    const company = await prisma.company.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!company) {
      return NextResponse.json({
        success: true,
        chatbots: [],
      });
    }

    // 4.Get company's chatbots
    const chatbots = await prisma.chatbot.findMany({
      where: {
        companyId: company.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 5.Return chatbots
    return NextResponse.json({
      success: true,
      chatbots,
    });
  } catch (error) {
    console.error("GET CHATBOTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching chatbots",
      },
      { status: 500 },
    );
  }
}


export async function POST(req: Request) {
  try {
    // check logged-in user
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

    // get request body
    const body = await req.json();
    const { name } = body;

    // validate chatbot name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Chatbot name is required",
        },
        { status: 400 },
      );
    }

    // find logged-in user
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

    // find user's company if ther is no company create a new one
    const company = await prisma.company.findFirst({
      where: {
        userId: user.id,
      },
    });

    let userCompany = company;

    if (!userCompany) {
      userCompany = await prisma.company.create({
        data: {
          name: user.name ? `${user.name}'s Company` : "My Company",
          userId: user.id,
        },
      });
    }

    //create chatbot
    const chatbot = await prisma.chatbot.create({
      data: {
        name: name.trim(),
        companyId: userCompany.id,
      },
    });

    // return created chatbot
    return NextResponse.json(
      {
        success: true,
        message: "Chatbot created successfully",
        chatbot,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE CHATBOT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating chatbot",
      },
      { status: 500 },
    );
  }
}
