'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setPolls } from '@/features/polls/pollsSlice';
import { Plus, Search, Filter, Users, Clock, BarChart3, RefreshCw } from 'lucide-react';
import { useSockets } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import PollCard from '@/components/PollCard';

export default function AllPolls() {
  const { polls } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const { joinPollRoom, leavePollRoom } = useSockets();

  const fetchPolls = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔄 Fetching polls from API...');
      
      const response = await fetch('/api/polls');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const pollsData = await response.json();
      console.log('Polls fetched successfully:', pollsData.length, 'polls');
      dispatch(setPolls(pollsData));
    } catch (error) {
      console.error('Failed to fetch polls:', error);
      setError(error instanceof Error ? error.message : 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useEffect(() => {
    polls.forEach(poll => {
      joinPollRoom(poll.id);
    });

    return () => {
      polls.forEach(poll => {
        leavePollRoom(poll.id);
      });
    };
  }, [polls, joinPollRoom, leavePollRoom]);
  const userPolls = user ? polls.filter(poll => poll.id === user.id) : polls;
  
  const filteredPolls = userPolls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && poll.isActive) ||
                         (filter === 'closed' && !poll.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: userPolls.length,
    active: userPolls.filter(poll => poll.isActive).length,
    closed: userPolls.filter(poll => !poll.isActive).length,
    totalVotes: userPolls.reduce((sum, poll) => sum + poll.totalVotes, 0),
    userParticipation: user ? userPolls.length : 0,
  };

  // Calculate average votes per poll
  const avgVotesPerPoll = stats.total > 0 ? Math.round(stats.totalVotes / stats.total) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Polls</h1>
            <CardDescription>
              {user ? `Manage your ${stats.total} polls` : 'Browse all available polls'}
            </CardDescription>
          </div>
          {user && (
            <Link href="/polls/create" className="mt-4 sm:mt-0">
              <Button icon={Plus}>
                New Poll
              </Button>
            </Link>
          )}
        </div>

        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Failed to Load Polls
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchPolls} icon={RefreshCw} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? 'My Polls' : 'All Polls'}
          </h1>
          <CardDescription>
            {user 
              ? `Manage and view all your ${stats.total} created polls` 
              : `Browse ${stats.total} available polls`
            }
          </CardDescription>
        </div>
        {user && (
          <Link href="/polls/create" className="mt-4 sm:mt-0">
            <Button icon={Plus}>
              New Poll
            </Button>
          </Link>
        )}
      </div>

      {/* Enhanced Stats with more metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900 ">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Polls</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.closed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="relative">
              <Users className="h-6 w-6 text-purple-600" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-purple-600">
                {avgVotesPerPoll}
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalVotes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder="Search by question or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setFilter('all')}
                size="sm"
                icon={BarChart3}
              >
                All
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'secondary'}
                onClick={() => setFilter('active')}
                size="sm"
                icon={Users}
              >
                Active
              </Button>
              <Button
                variant={filter === 'closed' ? 'primary' : 'secondary'}
                onClick={() => setFilter('closed')}
                size="sm"
                icon={Clock}
              >
                Closed
              </Button>
            </div>
          </div>
          {(searchTerm || filter !== 'all') && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPolls.length} of {userPolls.length} polls
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                variant="ghost"
                size="sm"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polls Grid */}
      {filteredPolls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              {searchTerm || filter !== 'all' ? 'No matching polls' : 'No polls yet'}
            </h3>
            <CardDescription className="mt-2 max-w-sm mx-auto">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : user
                  ? 'Get started by creating your first poll to gather insights from your audience.'
                  : 'There are no polls available at the moment.'
              }
            </CardDescription>
            {(searchTerm || filter !== 'all') ? (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                variant="outline"
                className="mt-4"
                icon={Filter}
              >
                Clear filters
              </Button>
            ) : (
              user && (
                <Link href="/polls/create" className="mt-6 inline-block">
                  <Button icon={Plus}>
                    Create Your First Poll
                  </Button>
                </Link>
              )
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredPolls.length} poll{filteredPolls.length !== 1 ? 's' : ''}
            </p>
            <Button
              onClick={fetchPolls}
              variant="outline"
              size="sm"
              icon={RefreshCw}
            >
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
