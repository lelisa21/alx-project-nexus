#  Pollify - Real-time Polling Platform 
<hr>

A modern, real-time polling application built with Next.js 16, featuring live results, beautiful visualizations, and seamless user experience.

##  Live Demo

[**Live Demo**](https://pollify-online-polling-system.vercel.app) | [**Design**](https://docs.pollify.vercel.app](https://www.figma.com/design/fdcgMcCddi8pONvskEimRD/NEXUS-PROJECT?node-id=5-3&p=f&t=o4FTTFNwS0xWLVvA-0))

##  Features

###  Core Features
- **Real-time Polling** - Live updates as votes come in
- **Beautiful Charts** - Interactive data visualizations
- **Anonymous & User Polls** - Create polls with or without accounts
- **Advanced Settings** - Customize poll behavior and privacy
- **Responsive Design** - Works perfectly on all devices

###  Advanced Features
- **Socket.io Integration** - Instant real-time updates
- **Dark/Light Mode** - Full theme support
- **Progress Tracking** - Visual creation progress
- **Quick Templates** - Pre-built poll templates
- **Social Sharing** - Easy poll distribution
- **Vote Analytics** - Detailed insights and statistics

##  Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js 14** | React Framework
| **TypeScript** | Type Safety
| **Tailwind CSS** | Styling 
| **React Hook Form** | Form Management 
| **Lucide React** | Icons 

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Serverless API
| **Prisma** | Database ORM 
| **MongoDB** | Database 
| **Socket.io** | Real-time Communication
| **NextAuth.js** | Authentication

### State Management & Utilities
| Technology | Purpose |
|------------|---------|
| **Redux Toolkit** | Global State Management |
| **React Query** | Server State Management |
| **Zod** | Schema Validation |
| **Date-fns** | Date Utilities |
| **Chart.js** | Data Visualization |

### Deployment
| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting & Deployment |
| **GitHub Actions** | CI/CD Pipeline |
| **MongoDB Atlas** | Cloud Database |


##  Project Structure

```
pollify/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication API
│   │   ├── polls/         # Polls API
│   │   └── socket/        # Socket.io API
│   ├── dashboard/         # User dashboard
│   ├── polls/             # Poll management
│   │   ├── create/        # Create poll page
│   │   ├── edit/[id]/     # Edit poll page
│   │   └── [id]/          # Poll detail page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Auth/                # Base UI components
│   ├── polls/             # Poll-specific components
│   └── ui/            # Data visualization
├── features/              # Feature-based modules
│   ├── auth/              # Authentication slice
│   ├── polls/             # Polls slice
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── db.ts             # Database configuration
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
├── store/                # Redux store configuration
├── interfaces/           # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lelisa21/alx-project-nexus
   cd alx-project-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables:
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/pollify"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Optional: OAuth providers
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 🗃 Database Schema

### Core Models
```prisma
model User {
  id        String   @id @default(auto()) @map("_id")
  email     String   @unique
  name      String?
  polls     Poll[]
  votes     Vote[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Poll {
  id          String   @id @default(auto()) @map("_id")
  question    String
  description String?
  isActive    Boolean  @default(true)
  totalVotes  Int      @default(0)
  views       Int      @default(0)
  userId      String?  // Author reference
  options     Option[]
  settings    PollSettings?
  votes       Vote[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Option {
  id     String @id @default(auto()) @map("_id")
  text   String
  votes  Int    @default(0)
  pollId String
  poll   Poll   @relation(fields: [pollId], references: [id], onDelete: Cascade)
}
```

## 🔌 API Endpoints

### Polls API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/polls` | Get all polls |
| `POST` | `/api/polls` | Create new poll |
| `GET` | `/api/polls/[id]` | Get specific poll |
| `PUT` | `/api/polls/[id]` | Update poll |
| `POST` | `/api/polls/[id]/vote` | Submit vote |

### Authentication API
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/[...nextauth]` | NextAuth endpoints |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |

##  UI Components

### Core Components
- **Button** - Customizable button with variants
- **Card** - Content container with header/body/footer
- **Input** - Form input with validation
- **Badge** - Status and category indicators
- **Toggle** - Switch controls
- **LoadingSpinner** - Loading states

### Poll Components
- **PollCard** - Poll preview card
- **PollChart** - Data visualization
- **VoteButton** - Voting interface
- **ProgressTracker** - Creation progress

##  Authentication Flow
```typescript
// Protected API routes
export const GET = withAuth(async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Handle request
});

// Protected pages
export default function Page() {
  const { data: session } = useSession();
  if (!session) return <div>Please sign in</div>;
  return <Dashboard />;
}
```

##  Real-time Features

### Socket.io Implementation
```typescript
// Client-side socket connection
const socket = useSocket();
socket.emit('vote', { pollId, optionId });
socket.on('voteUpdate', (data) => {
  // Update UI in real-time
});

// Server-side socket handling
io.on('connection', (socket) => {
  socket.on('vote', handleVote);
  socket.on('joinPoll', handleJoinPoll);
});
```

##  Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Environment Variables for Production
```env
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_URL="https://yourdomain.vercel.app"
NEXTAUTH_SECRET="production-secret"
```

##  Performance

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1

### Optimization Features
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Dynamic imports
- **Bundle Analysis** - Webpack bundle analyzer
- **CDN** - Vercel edge network

##  Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

**ALX and Their Community** - for preparing this amazing Learning Platform and Project
- **Next.js Team** - Amazing React framework
- **Vercel** - Incredible hosting platform
- **Prisma** - Excellent database toolkit
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io** - Real-time communication library



---

<div align="center">

**Built with ❤️ using Next.js 16 and modern web technologies**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>
