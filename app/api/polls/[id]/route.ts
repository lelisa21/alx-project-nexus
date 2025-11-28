import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🔍 Fetching poll:', id);

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid poll ID format' },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { votes: 'desc' }
        },
        settings: true
      }
    });

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.poll.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json(poll);
  } catch (error: any) {
    console.error('GET /api/polls/[id] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { optionId, voterId } = await request.json();

    console.log('🗳️ Voting on poll:', id, 'option:', optionId);

    if (!isValidObjectId(id) || !isValidObjectId(optionId)) {
      return NextResponse.json(
        { error: 'Invalid poll or option ID' },
        { status: 400 }
      );
    }

    // Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: { 
        settings: true,
        options: {
          where: { id: optionId }
        }
      }
    });

    if (!poll || poll.options.length === 0) {
      return NextResponse.json(
        { error: 'Poll or option not found' },
        { status: 404 }
      );
    }

    // Check for existing vote
    if (voterId && !poll.settings?.allowMultipleVotes) {
      const existingVote = await prisma.vote.findFirst({
        where: {
          pollId: id,
          voterId: voterId
        }
      });

      if (existingVote) {
        return NextResponse.json(
          { error: 'You have already voted on this poll' },
          { status: 400 }
        );
      }
    }

    // Update votes
    await prisma.option.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } }
    });

    await prisma.poll.update({
      where: { id },
      data: { totalVotes: { increment: 1 } }
    });

    // Record vote
    if (voterId) {
      await prisma.vote.create({
        data: {
          optionId,
          pollId: id,
          voterId
        }
      });
    }

    // Get updated poll
    const updatedPoll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { votes: 'desc' }
        },
        settings: true
      }
    });

    return NextResponse.json({
      success: true,
      poll: updatedPoll,
      votedOption: optionId
    });

  } catch (error: any) {
    console.error('POST /api/polls/[id] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote: ' + error.message },
      { status: 500 }
    );
  }
}
