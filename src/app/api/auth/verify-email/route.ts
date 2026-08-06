import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // check if the token is present in the query parameters
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

    // check if the token is valid and not expired
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
    //find the user associated with the verification token
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
    // update the user's emailVerified field to the current date
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });
    // delete the verification token after successful verification
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
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
