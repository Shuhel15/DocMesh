import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check if the email exists and is verified
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json({ exists: false, verified: false });
    }

    //Find the user by email and check if emailVerified is true 
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ exists: false, verified: false });
    }

    return NextResponse.json({
      exists: true,
      verified: Boolean(user.emailVerified),
    });
  } catch (error) {
    console.error("CHECK VERIFICATION ERROR:", error);
    return NextResponse.json({ exists: false, verified: false });
  }
}
