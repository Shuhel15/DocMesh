import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import redis from "@/lib/redis";
import { generateOTP } from "@/lib/utils";
import { sendOTPEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must be less than 50 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify input format
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, emailVerified: null },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    try {
      const otp = generateOTP();

      await redis.set(`otp:${email}`, otp, "EX", 600); // Store OTP in Redis with a 10-minute expiration
      await sendOTPEmail(email, otp); // For sending OTP to the user email for verification
    } catch (error) {
      await redis.del(`otp:${email}`);
      await prisma.user.delete({ where: { id: user.id } });
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registation successful. Please check your email for the OTP to verify your account.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 },
    );
  }
}

