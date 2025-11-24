'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { BarChart3, Users, Zap, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const features = [
    {
      icon: BarChart3,
      title: 'Live Results',
      description: 'Watch poll results update in real-time with beautiful, interactive charts'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Create polls for your community, team, or audience with ease'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant updates using WebSocket technology - no page refresh needed'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Prevent duplicate votes and ensure the integrity of your polls'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Polls Created' },
    { value: '500K+', label: 'Votes Cast' },
    { value: '90.9%', label: 'Uptime' },
    { value: '1s', label: 'Real-time Updates' }
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <div className='app-background w-full'>
      <nav className=" backdrop-blur-md  border-gray-200 sticky top-3 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Image src="/logo.png" alt="logo" width={150} height={60} priority />
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                  <Link href="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-white/65 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Polls That
              <span className="block bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Live & Breathe
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build engaging, real-time polls with beautiful charts and instant updates. 
              Perfect for teams, communities, events, and gathering instant feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard/polls/create"
                  className="btn-primary text-lg px-8 py-4 flex items-center group"
                >
                  Create Your First Poll
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="btn-primary text-lg px-8 py-4 flex items-center group"
                >
                  Start Polling Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="/dashboard"
                className="btn-secondary text-lg px-8 py-4"
              >
                View Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
  </div>
      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Amazing Polls
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make polling simple, engaging, and effective
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center group hover:scale-105 transition-transform duration-200 animate-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500/80 to-black rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-400/10 to-emerald-300/15">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Ready to Start Polling?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating engaging, real-time polls today. No credit card required.
          </p>
          <Link
            href={isAuthenticated ? "/dashboard" : "/register"}
            className="bg-white text-indigo-600/80 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center group"
          >
            {isAuthenticated ? "Go to Dashboard" : "Create Your Account"}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
         <Image src="/logo.png" alt="logo" width={150} height={60} priority />
          <p className="text-gray-400 mb-4">
            Making polling simple, beautiful, and real-time
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Pollify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
