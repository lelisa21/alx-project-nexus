// app/api/polls/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const pollData = await request.json();
    console.log('📝 Creating new poll:', pollData);

    // Validate required fields
    if (!pollData.question?.trim() || !pollData.options || pollData.options.length < 2) {
      return NextResponse.json(
        { error: 'Question and at least 2 options are required' },
        { status: 400 }
      );
    }

    // Build the data object dynamically
    const createData: any = {
      question: pollData.question.trim(),
      description: pollData.description?.trim() || '',
      options: {
        create: pollData.options.map((option: any) => ({
          text: option.text.trim(),
          votes: 0
        }))
      },
      settings: {
        create: {
          isPublic: pollData.settings?.isPublic ?? true,
          allowMultipleVotes: pollData.settings?.allowMultipleVotes ?? false,
          requireEmail: pollData.settings?.requireEmail ?? false,
          showResults: pollData.settings?.showResults ?? true,
          endDate: pollData.settings?.endDate ? new Date(pollData.settings.endDate) : null
        }
      }
    };

    // Only connect user if createdBy is provided and valid
    if (pollData.createdBy) {
      createData.user = {
        connect: {
          id: pollData.createdBy
        }
      };
    }

    console.log('🚀 Creating poll with data:', createData);

    // Create poll in database
    const newPoll = await prisma.poll.create({
      data: createData,
      include: {
        options: true,
        settings: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Poll created successfully with ID:', newPoll.id);
    return NextResponse.json(newPoll, { status: 201 });
  } catch (error: any) {
    console.error('❌ POST /api/polls Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return NextResponse.json(
      { 
        error: 'Failed to create poll: ' + error.message,
        details: error.meta || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
