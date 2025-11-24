import { NextResponse } from 'next/server';

// Mock polls data (same as above)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  },
  {
    id: '2',
    question: 'Which feature do you use most in Pollify?',
    description: 'We want to improve our most used features',
    options: [
      { id: '1', text: 'Real-time results', votes: 60 },
      { id: '2', text: 'Chart visualizations', votes: 45 },
      { id: '3', text: 'Poll sharing', votes: 30 },
      { id: '4', text: 'Multiple options', votes: 20 }
    ],
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    totalVotes: 155
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;
    console.log('📡 Fetching poll by ID:', pollId);
    
    const poll = polls.find(p => p.id === pollId);
    
    if (!poll) {
      console.log('❌ Poll not found:', pollId);
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Poll found:', pollId);
    return NextResponse.json(poll);
  } catch (error) {
    console.error('❌ Failed to fetch poll:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}
