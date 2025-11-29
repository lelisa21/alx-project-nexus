// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  console.log('✅ User created:', user.email);

  // Clear existing data (optional - for development)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.vote.deleteMany();
    await prisma.option.deleteMany();
    await prisma.pollSettings.deleteMany();
    await prisma.poll.deleteMany();
  }

  // Create sample polls - using CORRECT fields from your schema
  const poll1 = await prisma.poll.create({
    data: {
      question: "What's your favorite frontend framework?",
      description: "Help us understand developer preferences in 2024",
      userId: user.id, // Use userId instead of createdBy
      isAnonymous: false,
      options: {
        create: [
          { text: "React", votes: 45 },
          { text: "Vue", votes: 30 },
          { text: "Angular", votes: 25 },
          { text: "Svelte", votes: 15 }
        ]
      },
      settings: {
        create: {
          isPublic: true,
          allowMultipleVotes: false,
          requireEmail: false,
          showResults: true
        }
      },
      totalVotes: 115,
      views: 250
    }
  });

  const poll2 = await prisma.poll.create({
    data: {
      question: "Which feature do you use most in Pollify?",
      description: "We want to improve our most used features",
      userId: user.id, // Use userId instead of createdBy
      isAnonymous: false,
      options: {
        create: [
          { text: "Real-time results", votes: 60 },
          { text: "Chart visualizations", votes: 45 },
          { text: "Poll sharing", votes: 30 },
          { text: "Multiple options", votes: 20 }
        ]
      },
      settings: {
        create: {
          isPublic: true,
          allowMultipleVotes: false,
          requireEmail: false,
          showResults: true
        }
      },
      totalVotes: 155,
      views: 320
    }
  });

  console.log('✅ Polls created:', [poll1.id, poll2.id]);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
