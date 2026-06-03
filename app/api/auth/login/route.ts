import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/session";

// Demo user credentials (for testing without database)
const DEMO_USER = {
  email: "demo@example.com",
  password: "demo123", // Plain text for demo
  name: "Pollify Demo",
  id: "11111111-1111-4111-8111-111111111111",
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt:", { email });

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Check for demo user
    if (email === DEMO_USER.email) {
      // For demo user, check password
      if (password === DEMO_USER.password) {
        console.log("Demo login successful");
        const response = NextResponse.json({
          user: {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
            name: DEMO_USER.name,
            isDemo: true,
            createdAt: new Date().toISOString(),
          },
          message: "Demo login successful",
        });
        response.cookies.set("pollify_session", createSessionToken({
          userId: DEMO_USER.id,
          email: DEMO_USER.email,
          name: DEMO_USER.name,
          isDemo: true,
        }), {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      } else {
        return NextResponse.json(
          { error: "Invalid password for demo account." },
          { status: 401 }
        );
      }
    }

    // For real users, check database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 401 }
      );
    }

    // Check if password is set (for OAuth users)
    if (!user.password) {
      return NextResponse.json(
        { error: "Please sign in with your OAuth provider." },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log("Login successful for:", user.email);

    const response = NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    });
    response.cookies.set("pollify_session", createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
