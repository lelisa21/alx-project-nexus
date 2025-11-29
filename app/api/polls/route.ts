// app/api/polls/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          orderBy: { votes: "desc" },
          // Remove any poll relation includes here
        },
        settings: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Add votes count if needed, but be careful with relations
        votes: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to avoid circular references
    const safePolls = polls.map(poll => ({
      ...poll,
      options: poll.options.map(option => ({
        ...option,
        // Ensure no circular references
      })),
    }));

    return NextResponse.json(safePolls);
  } catch (error: any) {
    console.error("GET /api/polls Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.question?.trim()) {
      return NextResponse.json(
        { error: "Poll question is required" },
        { status: 400 }
      );
    }

    if (!body.options || !Array.isArray(body.options) || body.options.length < 2) {
      return NextResponse.json(
        { error: "At least 2 options are required" },
        { status: 400 }
      );
    }

    // Process options
    const validOptions = body.options
      .filter((opt: any) => opt?.text?.trim())
      .slice(0, 8)
      .map((opt: any) => ({
        text: opt.text.trim(),
        votes: 0,
      }));

    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid options are required" },
        { status: 400 }
      );
    }

    // Build the data object
    const pollData: any = {
      question: body.question.trim(),
      description: body.description?.trim() || "",
      isAnonymous: !body.createdBy,
      options: {
        create: validOptions,
      },
    };

    // Handle user connection if provided
    if (body.createdBy) {
      const user = await prisma.user.findUnique({
        where: { id: body.createdBy },
      });

      if (user) {
        pollData.user = {
          connect: { id: body.createdBy },
        };
        pollData.isAnonymous = false;
        pollData.createdBy = body.createdBy;
      }
    }

    // Handle settings
    if (body.settings) {
      pollData.settings = {
        create: {
          isPublic: Boolean(body.settings.isPublic),
          allowMultipleVotes: Boolean(body.settings.allowMultipleVotes),
          requireEmail: Boolean(body.settings.requireEmail),
          showResults: Boolean(body.settings.showResults),
          endDate: body.settings.endDate ? new Date(body.settings.endDate) : null,
        },
      };
    }

    // Create the poll
    const newPoll = await prisma.poll.create({
      data: pollData,
      include: {
        options: {
          orderBy: { votes: "desc" },
        },
        settings: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newPoll, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/polls Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create poll",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
