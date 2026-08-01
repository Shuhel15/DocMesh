import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token is missing",
        },
        { status: 400 },
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification token",
        },
        { status: 400 },
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          token,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Verification token has expired",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
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

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying your email",
      },
      { status: 500 },
    );
  }
}
