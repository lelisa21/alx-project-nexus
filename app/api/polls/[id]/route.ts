// app/api/polls/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Your actual poll data
const mockPolls = {
  '1764087589202': {
    id: '1764087589202',
    question: "What's the main part of computer?",
    description: "awaeaeaeaesda",
    options: [
      { id: "opt-1764087589202-0", text: "CPU", votes: 0, voted: false },
      { id: "opt-1764087589202-1", text: "Disk", votes: 0, voted: false },
      { id: "opt-1764087589202-2", text: "Main Memory", votes: 0, voted: false },
      { id: "opt-1764087589202-3", text: "RAM", votes: 0, voted: false },
      { id: "opt-1764087589202-4", text: "Computer", votes: 0, voted: false }
    ],
    settings: {
      isPublic: true,
      allowMultipleVotes: true,
      requireEmail: true,
      showResults: true,
      endDate: ""
    },
    totalVotes: 0,
    isActive: true,
    createdAt: "2025-11-25T16:19:49.202Z",
    views: 0,
    createdBy: "1",
    updatedAt: "2025-11-25T16:19:49.202Z",
    hasVoted: false
  },
  '1': {
    id: '1',
    question: "What's your favorite frontend framework?",
    description: "Help us understand developer preferences in 2024",
    options: [
      { id: "1", text: "React", votes: 45, voted: false },
      { id: "2", text: "Vue", votes: 30, voted: false },
      { id: "3", text: "Angular", votes: 25, voted: false },
      { id: "4", text: "Svelte", votes: 15, voted: false }
    ],
    createdBy: "1",
    createdAt: "2025-11-25T15:45:26.935Z",
    updatedAt: "2025-11-25T15:45:26.935Z",
    isActive: true,
    totalVotes: 115,
    views: 250,
    hasVoted: false
  },
  '2': {
    id: '2',
    question: "Which feature do you use most in Pollify?",
    description: "We want to improve our most used features",
    options: [
      { id: "1", text: "Real-time results", votes: 60, voted: false },
      { id: "2", text: "Chart visualizations", votes: 45, voted: false },
      { id: "3", text: "Poll sharing", votes: 30, voted: false },
      { id: "4", text: "Multiple options", votes: 20, voted: false }
    ],
    createdBy: "1",
    createdAt: "2025-11-25T15:45:26.935Z",
    updatedAt: "2025-11-25T15:45:26.935Z",
    isActive: true,
    totalVotes: 155,
    views: 320,
    hasVoted: false
  }
};

// FIXED: Next.js 14+ requires awaiting params
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // AWAIT the params - this is the key fix!
    const { id } = await params;
    console.log('🔍 API GET - Poll ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Poll ID is required' },
        { status: 400 }
      );
    }

    // Check if poll exists
    const poll = (mockPolls as any)[id];
    
    if (poll) {
      console.log('✅ Poll found:', poll.question);
      return NextResponse.json(poll);
    } else {
      console.log('❌ Poll not found. Available polls:', Object.keys(mockPolls));
      return NextResponse.json(
        { 
          error: `Poll with ID "${id}" not found`,
          availablePolls: Object.keys(mockPolls),
          requestedId: id
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('❌ API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// FIXED: Also await params in POST
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // AWAIT the params
    const { id } = await params;
    const { optionId } = await request.json();

    console.log('🗳️ API POST - Voting on poll:', id, 'option:', optionId);

    const poll = (mockPolls as any)[id];
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    // Update vote count
    const option = poll.options.find((opt: any) => opt.id === optionId);
    if (option) {
      option.votes += 1;
      poll.totalVotes += 1;
      poll.updatedAt = new Date().toISOString();
      
      // Mark this option as voted (for UI)
      option.voted = true;
      poll.hasVoted = true;
    }

    return NextResponse.json({
      success: true,
      poll: poll,
      votedOption: optionId
    });

  } catch (error) {
    console.error('❌ API POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}
