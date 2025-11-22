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

export async function GET() {
  console.log('Fetching all polls');
  return NextResponse.json(polls);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Creating poll:', data);
    
    const newPoll = {
      id: Date.now().toString(),
      ...data,
      createdBy: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      totalVotes: 0,
      options: data.options.map((opt: any, index: number) => ({
        id: `opt-${Date.now()}-${index}`,
        ...opt,
        votes: 0,
      })),
    };
    
    polls.unshift(newPoll);
    
    console.log('Poll created successfully:', newPoll);
    
    return NextResponse.json(newPoll);
  } catch (error) {
    console.error('Failed to create poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
