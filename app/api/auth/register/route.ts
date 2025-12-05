import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    console.log("Registration attempt:", { name, email });

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check duplicate
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    // Don't log sensitive data in production
    console.log("User created successfully:", { id: newUser.id, email: newUser.email });

    return NextResponse.json(
      { 
        message: "User registered successfully. Please log in.",
        user: { id: newUser.id, email: newUser.email }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    
    // Check for Prisma errors
    if (err instanceof Error && err.message.includes('Prisma')) {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
