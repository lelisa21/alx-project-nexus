'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setPolls } from '@/features/polls/pollsSlice';
import { Plus, Search, Filter, Users, Clock, BarChart3 } from 'lucide-react';
import { useSockets } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import  PollCard  from '@/components/PollCard';

export default function AllPolls() {
  const { polls } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
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

  // Filter and search polls
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && poll.isActive) ||
                         (filter === 'closed' && !poll.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: polls.length,
    active: polls.filter(poll => poll.isActive).length,
    closed: polls.filter(poll => !poll.isActive).length,
    totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Polls</h1>
          <p className="text-gray-600">Manage and view all your created polls</p>
        </div>
        <Link href="/dashboard/polls/create" className="mt-4 sm:mt-0">
          <Button icon={Plus}>
            New Poll
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Polls</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.closed}</p>
              <p className="text-sm text-gray-600">Closed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-800">{stats.totalVotes}</p>
              <p className="text-sm text-gray-600">Total Votes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'secondary'}
                onClick={() => setFilter('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={filter === 'closed' ? 'primary' : 'secondary'}
                onClick={() => setFilter('closed')}
                size="sm"
              >
                Closed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Polls Grid */}
      {filteredPolls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {searchTerm || filter !== 'all' ? 'No matching polls' : 'No polls yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Get started by creating your first poll to gather insights from your audience.'
              }
            </p>
            {(searchTerm || filter !== 'all') ? (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                variant="outline"
                className="mt-4"
              >
                Clear filters
              </Button>
            ) : (
              <Link href="/dashboard/polls/create" className="mt-6 inline-block">
                <Button icon={Plus}>
                  Create Your First Poll
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
