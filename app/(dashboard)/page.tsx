'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setPolls } from '@/features/polls/pollsSlice';
import { Plus, Users, BarChart3, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useSockets } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import  PollCard  from '@/components/PollCard';
import { Badge } from '@/components/ui/Badge';

export default function Dashboard() {
  const { polls } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { joinPollRoom, leavePollRoom } = useSockets();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls');
        if (response.ok) {
          const pollsData = await response.json();
          dispatch(setPolls(pollsData));
        }
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();

    // Join rooms for real-time updates
    polls.forEach(poll => {
      joinPollRoom(poll.id);
    });

    return () => {
      // Leave rooms when component unmounts
      polls.forEach(poll => {
        leavePollRoom(poll.id);
      });
    };
  }, [dispatch, joinPollRoom, leavePollRoom, polls.length]);

  // Calculate dashboard stats
  const stats = {
    totalPolls: polls.length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
    activePolls: polls.filter(poll => poll.isActive).length,
    averageVotes: polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length) : 0,
  };

  const recentPolls = polls.slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your polls.</p>
        </div>
        <Link
          href="/dashboard/polls/create"
          className="mt-4 sm:mt-0"
        >
          <Button icon={Plus}>
            New Poll
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Polls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPolls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePolls}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Votes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Polls */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Polls</h2>
          <Link
            href="/dashboard/polls"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
          >
            View all polls
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {recentPolls.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No polls yet</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Get started by creating your first poll to gather insights from your audience.
              </p>
              <Link
                href="/dashboard/polls/create"
                className="mt-6 inline-block"
              >
                <Button icon={Plus}>
                  Create Your First Poll
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/dashboard/polls/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Create Poll</p>
                  <p className="text-sm text-gray-600">Start a new poll</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/polls">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">View All Polls</p>
                  <p className="text-sm text-gray-600">Manage your polls</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/profile">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Profile</p>
                  <p className="text-sm text-gray-600">View your stats</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
