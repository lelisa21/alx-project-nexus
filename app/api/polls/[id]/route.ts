import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper to extract params
async function getParams(params: Promise<{ id: string }>) {
  return await params;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid poll ID format" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.findUnique({
      where: { id },
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

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Increment views
    await prisma.poll.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(poll);
  } catch (error: any) {
    console.error("GET /api/polls/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    const body = await request.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid poll ID format" },
        { status: 400 }
      );
    }

    // Verify poll exists
    const existingPoll = await prisma.poll.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!existingPoll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Build update data
    const updateData: any = {
      question: body.question,
      description: body.description,
      updatedAt: new Date(),
    };

    // Handle settings
    if (body.settings) {
      updateData.settings = {
        upsert: {
          create: {
            isPublic: Boolean(body.settings.isPublic),
            allowMultipleVotes: Boolean(body.settings.allowMultipleVotes),
            requireEmail: Boolean(body.settings.requireEmail),
            showResults: Boolean(body.settings.showResults),
            endDate: body.settings.endDate ? new Date(body.settings.endDate) : null,
          },
          update: {
            isPublic: Boolean(body.settings.isPublic),
            allowMultipleVotes: Boolean(body.settings.allowMultipleVotes),
            requireEmail: Boolean(body.settings.requireEmail),
            showResults: Boolean(body.settings.showResults),
            endDate: body.settings.endDate ? new Date(body.settings.endDate) : null,
          },
        },
      };
    }

    // Handle options update
    if (body.options && Array.isArray(body.options)) {
      // Delete existing options
      await prisma.option.deleteMany({
        where: { pollId: id },
      });

      // Create new options
      updateData.options = {
        create: body.options.map((opt: any) => ({
          text: opt.text,
          votes: opt.votes || 0,
        })),
      };
    }

    // Update the poll
    const updatedPoll = await prisma.poll.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedPoll);
  } catch (error: any) {
    console.error("PUT /api/polls/[id] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update poll: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    const { optionId, voterId } = await request.json();

    if (!isValidObjectId(id) || !isValidObjectId(optionId)) {
      return NextResponse.json(
        { error: "Invalid poll or option ID" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        settings: true,
        options: {
          where: { id: optionId },
        },
      },
    });

    if (!poll || poll.options.length === 0) {
      return NextResponse.json(
        { error: "Poll or option not found" },
        { status: 404 }
      );
    }

    // Check for existing vote
    if (voterId && !poll.settings?.allowMultipleVotes) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          pollId: id,
          voterId: voterId,
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { error: "You have already voted on this poll" },
          { status: 400 }
        );
      }
    }

    // Update votes
    await prisma.option.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    });

    await prisma.poll.update({
      where: { id },
      data: { totalVotes: { increment: 1 } },
    });

    // Record vote
    if (voterId) {
      await prisma.vote.create({
        data: {
          optionId,
          pollId: id,
          voterId,
        },
      });
    }

    const updatedPoll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { votes: "desc" },
        },
        settings: true,
      },
    });

    return NextResponse.json({
      success: true,
      poll: updatedPoll,
      votedOption: optionId,
    });
  } catch (error: any) {
    console.error("POST /api/polls/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit vote: " + error.message },
      { status: 500 }
    );
  }
}
