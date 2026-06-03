import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = verifySessionToken(cookieStore.get("pollify_session")?.value);

    if (!session) {
      return NextResponse.json(null);
    }

    if (session.isDemo) {
      return NextResponse.json({
        id: session.userId,
        email: session.email,
        name: session.name || "Pollify Demo",
        isDemo: true,
        createdAt: new Date().toISOString(),
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(null);
  }
}
