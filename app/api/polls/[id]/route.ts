/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

// Mock polls data (same as above)
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
  // ... other polls
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const pollId = params.id;
  console.log('Fetching poll:', pollId);
  
  const poll = polls.find(p => p.id === pollId);
  
  if (!poll) {
    return NextResponse.json(
      { error: 'Poll not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(poll);
}
