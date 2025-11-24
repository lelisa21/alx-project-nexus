/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

// Mock polls data
const polls: any[] = [
  {
    id: '1',
    question: 'What\'s your favorite frontend framework?',
    description: 'Help us understand developer preferences in 2024',
    options: [
      { id: '1', text: 'React', votes: 45 },
      { id: '2', text: 'Vue', votes: 30 },
      { id: '3', text: 'Angular', votes: 25 },
      { id: '4', text: 'Svelte', votes: 15 }
    ],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    totalVotes: 115
  }
];

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    const { optionId } = await request.json();

    console.log('🗳️ API Vote received:', { pollId, optionId });

    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
      console.log('❌ Poll not found for voting:', pollId);
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const option = poll.options.find((opt: any) => opt.id === optionId);
    if (!option) {
      console.log('❌ Option not found:', optionId);
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    // Update vote count
    option.votes += 1;
    poll.totalVotes += 1;
    poll.updatedAt = new Date().toISOString();

    console.log('✅ Vote recorded:', { option: option.text, votes: option.votes, totalVotes: poll.totalVotes });

    return NextResponse.json(poll);
  } catch (error) {
    console.error('❌ Vote API error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
