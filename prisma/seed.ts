import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoUserId = "11111111-1111-4111-8111-111111111111";

async function main() {
  console.log("Starting Pollify demo seed...");

  if (process.env.NODE_ENV !== "production") {
    await prisma.vote.deleteMany();
    await prisma.option.deleteMany();
    await prisma.pollSettings.deleteMany();
    await prisma.poll.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["demo@example.com", "test@pollify.com"],
        },
      },
    });
  }

  const demoPassword = await bcrypt.hash("demo123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      id: demoUserId,
      name: "Pollify Demo",
      password: demoPassword,
    },
    create: {
      id: demoUserId,
      email: "demo@example.com",
      name: "Pollify Demo",
      password: demoPassword,
    },
  });

  const polls = [
    {
      question: "Which product feature should Pollify prioritize next?",
      description:
        "A product roadmap poll for a live SaaS audience intelligence demo.",
      totalVotes: 182,
      views: 641,
      options: [
        { text: "AI-generated poll suggestions", votes: 64 },
        { text: "Live Q&A and upvoting", votes: 52 },
        { text: "Team workspaces", votes: 38 },
        { text: "Advanced exports", votes: 28 },
      ],
    },
    {
      question: "How confident are you in today's launch readiness?",
      description:
        "Pulse check used during a product standup with real-time visibility.",
      totalVotes: 96,
      views: 288,
      options: [
        { text: "Very confident", votes: 34 },
        { text: "Mostly confident", votes: 41 },
        { text: "Needs follow-up", votes: 17 },
        { text: "Blocked", votes: 4 },
      ],
    },
    {
      question: "What type of session creates the most audience engagement?",
      description:
        "Event analytics sample for facilitators and conference organizers.",
      totalVotes: 214,
      views: 812,
      options: [
        { text: "Interactive workshops", votes: 77 },
        { text: "Live Q&A", votes: 58 },
        { text: "Lightning talks", votes: 33 },
        { text: "Panel discussions", votes: 46 },
      ],
    },
  ];

  const createdPolls = await Promise.all(
    polls.map((poll) =>
      prisma.poll.create({
        data: {
          question: poll.question,
          description: poll.description,
          userId: user.id,
          isAnonymous: false,
          totalVotes: poll.totalVotes,
          views: poll.views,
          options: {
            create: poll.options,
          },
          settings: {
            create: {
              isPublic: true,
              allowMultipleVotes: false,
              requireEmail: false,
              showResults: true,
            },
          },
        },
      })
    )
  );

  console.log(
    `Seeded ${createdPolls.length} demo polls for ${user.email}. Demo password: demo123`
  );
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
