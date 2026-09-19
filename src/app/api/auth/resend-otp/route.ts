import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";
import { generateOTP } from "@/lib/utils";
import { sendOTPEmail } from "@/lib/email";
import { z } from "zod";

const resendOTPSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
})

export async function POST(req: Request) {
  try{
    const body = await req.json()

    const result = resendOTPSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email"
        },
        { status: 400 },
      );
    }

    const {email} = result.data;

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

    const otp = generateOTP();

    await redis.set(`otp:${email}`, otp, "EX", 600); // Store OTP in Redis with a 10-minute expiration
    await sendOTPEmail(email, otp); // For sending OTP to the user email for verification

    return NextResponse.json(
      {
        success: true,
        message: "OTP resent successfully",
      },
      { status: 200 },
    );
  }catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
