import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Prisma, Poll, PollSettings, User, Option, Vote } from "@prisma/client";

type IncomingPollOption = {
  text?: string;
};

type PollSettingsInput = {
  isPublic?: boolean;
  allowMultipleVotes?: boolean;
  requireEmail?: boolean;
  showResults?: boolean;
  endDate?: string | null;
};

type CreatePollBody = {
  question?: string;
  description?: string;
  options?: IncomingPollOption[];
  createdBy?: string | null;
  settings?: PollSettingsInput;
};

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

type PollWithRelations = Poll & {
  options: Option[];
  settings: PollSettings | null;
  user: Pick<User, "id" | "name" | "email"> | null;
  votes?: Pick<Vote, "id">[];
};

function serializePoll(poll: PollWithRelations) {
  const { user, userId, ...pollData } = poll;

  return {
    ...pollData,
    userId,
    createdBy: userId,
    createdByUser: user,
  };
}

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
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

    return NextResponse.json(polls.map(serializePoll));
  } catch (error) {
    console.error("GET /api/polls Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePollBody;

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
      .filter((opt): opt is { text: string } => Boolean(opt?.text?.trim()))
      .slice(0, 8)
      .map((opt) => ({
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
    const pollData: Prisma.PollCreateInput = {
      question: body.question.trim(),
      description: body.description?.trim() || "",
      isAnonymous: !body.createdBy,
      options: {
        create: validOptions,
      },
    };

    // Handle user connection if provided
    if (body.createdBy) {
      try {
        if (isValidUuid(body.createdBy)) {
          const user = await prisma.user.findUnique({
            where: { id: body.createdBy },
          });

          if (user) {
            pollData.user = {
              connect: { id: body.createdBy },
            };
            pollData.isAnonymous = false;
          }
        } else {
          console.log('⚠️ Invalid user ID format, creating anonymous poll');
        }
      } catch (error) {
        console.error('Error connecting user to poll:', error);
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

    return NextResponse.json(serializePoll(newPoll), { status: 201 });
  } catch (error) {
    console.error("POST /api/polls Error:", error);
    const errorMessage = getErrorMessage(error);
    return NextResponse.json(
      {
        error: "Failed to create poll",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
