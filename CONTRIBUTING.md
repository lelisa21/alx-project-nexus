#  Pollify - Real-time Polling Platform
A modern, real-time polling application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Create engaging polls with live results, beautiful charts, and instant updates.


## Features

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/me
├ ƒ /api/auth/register
├ ƒ /api/polls
├ ƒ /api/polls/[id]
├ ○ /dashboard
├ ○ /login
├ ○ /polls
├ ƒ /polls/[id]
├ ○ /polls/create
├ ƒ /polls/edit/[id]
├ ○ /profile
└ ○ /register

###  Core Features


- **Real-time Polling** - Live updates with Socket.io
- **Beautiful Charts** - Interactive visualizations with Chart.js
- **User Authentication** - Secure login/register with OAuth ready
- **Poll Management** - Create, view, and manage your polls
- **Responsive Design** - Works perfectly on all devices


###  Advanced Features


- **Live Results** - Watch votes come in real-time
- **Shareable Polls** - Public links for anyone to vote
- **Poll Analytics** - Detailed statistics and insights
- **Multiple Chart Types** - Bar charts, doughnut charts, and more
- **Form Validation** - Robust validation with React Hook Form + Zod


## 🛠️ Tech Stack


### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons
### Backend Ready


- **API Routes** - Ready for Django/Node.js backend
- **Socket.io** - Real-time communication
- **Chart.js** - Data visualization
- **Zod** - Schema validation


## 🎨 UI/UX Figma


### Design System
- **Figma Designed** - Cool designed by figma
- **Smooth Animations** - CSS transitions and hover effects
- **Responsive Layout** - Mobile-first approach
- **Accessibility** - WCAG compliant components


### Components
- **Reusable UI Kit** - Button, Card, Input, Badge components
- **Loading States** - Elegant loading spinners and skeletons
- **Error Handling** - User-friendly error messages
- **Empty States** - Beautiful placeholder content


## 📸 Demo


### 🏠 Homepage
![Homepage]()


### 📊 Dashboard
![Dashboard]()


### 🗳️ Poll Creation
![Create Poll]()


### 📈 Live Results
![Live Results]()


##  Quick Start


### Prerequisites
- Node.js 18+
- npm or yarn


### Installation


1. **Clone the repository**
```bash
git clone https://github.com/your-username/pollify.git
cd pollify
```


2. **Install dependencies**
```bash
npm install
```


3. **Set up environment variables**
```bash
cp .env.example .env.local
```


4. **Run the development server**
```bash
npm run dev
```


5. **Open your browser**
```
http://localhost:3000
```


### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: Any password works for demo


## 📁 Project Structure


```
pollify/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── poll/              # Public poll pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── auth/              # Authentication components
│   └── polls/             # Poll-specific components
├── store/                 # Redux store configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configs
└── types/                 # TypeScript type definitions
```


## 🔧 Key Components


### UI Components
- `Button` - Versatile button with multiple variants
- `Card` - Flexible card container
- `Input` - Form input with validation
- `Badge` - Status and category badges
- `LoadingSpinner` - Elegant loading indicators


### Poll Components
- `PollCard` - Poll preview cards
- `PollChart` - Data visualization charts
- `CreatePollForm` - Poll creation with validation


### Authentication
- `ProtectedRoute` - Route protection
- `AuthProvider` - Authentication context


## 🎯 Usage Examples


### Creating a Poll
1. Navigate to Dashboard
2. Click "Create Poll"
3. Add question and options
4. Share the poll link
5. Watch real-time results
6. Edit Your Poll everywhere


### Voting on a Poll
1. Open poll link (no login required)
2. Select your preferred option
3. See instant results and charts


### Managing Polls
1. View all polls in dashboard
2. Filter by status (active/closed)
3. Search through your polls
4. View detailed analytics


## 🔌 API Integration Ready


The application is designed to work with any backend. Current mock APIs can be easily replaced:


```typescript
// Example API integration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


// Replace mock endpoints with real backend
export const createPoll = async (data: CreatePollInput) => {
  return apiClient.post('/polls', data);
};
```


## 🎨 Customization


### Theming
Modify the color scheme in `tailwind.config.js`:


```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-dark-color',
      }
    }
  }
}
```


### Adding New Chart Types
Extend the `PollChart` component:


```typescript
<PollChart poll={poll} type="line" />
```


## 🤝 Contributing


We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.


### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 📄 License


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🚧 Roadmap


### Upcoming Features
- [ ] **OAuth Integration** - Google, GitHub authentication
- [ ] **Advanced Analytics** - Poll insights and trends
- [ ] **Poll Templates** - Pre-designed poll templates
- [ ] **Team Collaboration** - Share polls with team members
- [ ] **Export Results** - CSV/PDF export functionality
- [ ] **Mobile App** - React Native companion app


### In Progress
- [x] **Core Polling Features**
- [x] **Real-time Updates**
- [x] **Beautiful UI/UX**
- [x] **TypeScript Implementation**
- [ ] **Backend Integration** (Django/Node.js)


## 🆘 Support


- **Documentation**: [Docs](https://docs.pollify.app)
- **Issues**: [GitHub Issues](https://github.com/your-username/pollify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pollify/discussions)
- **Email**: support@pollify.app


## 🙏 Acknowledgments


- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icons
- **Chart.js** - Data visualization library
- **Redux Team** - State management solution


---


<div align="center">


**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**


[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/redux-B232AC?style=for-the-badge&logo=redux)](https://redux.com/)


</div>


---


**⭐ Star this repo if you find it helpful!**




