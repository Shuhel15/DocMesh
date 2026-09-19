import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = verifyEmailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or OTP",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { otp } = result.data;
    const email = result.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
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
    if (user?.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already verified",
        },
        { status: 400 },
      );
    }

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired or invalid . Please request a new one.",
        },
        { status: 400 },
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await redis.del(`otp:${email}`);

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while verifying your email. Please try again.",
      },
      { status: 500 },
    );
  }
}
