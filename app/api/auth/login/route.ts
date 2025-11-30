import { NextResponse } from "next/server";

// Use the same users array
const users: any[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    createdAt: new Date().toISOString(),
  },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt:", { email });

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    let user = users.find((user) => user.email === email);

    if (!user) {
      // Auto-create user for demo
      user = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      console.log("Auto-created user:", user);
    }

    console.log("Login successful:", user);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
