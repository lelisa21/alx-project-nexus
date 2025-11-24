'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Poll } from '@/interface';
import { PollChart } from '@/components/polls/PollChart';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Users, Clock, BarChart3, LogIn, Home } from 'lucide-react';
import { useSockets } from '@/hooks/useSocket';
import { calculatePercentage } from '@/lib/utils';

export default function PublicPoll() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState<string | null>(null);
  const { joinPollRoom, leavePollRoom, voteInPoll } = useSockets();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`);
        if (response.ok) {
          const pollData = await response.json();
          setPoll(pollData);
        } else {
          console.error('Poll not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPoll();
      joinPollRoom(pollId);
    }

    return () => {
      if (pollId) {
        leavePollRoom(pollId);
      }
    };
  }, [pollId, router, joinPollRoom, leavePollRoom]);

  const handleVote = async (optionId: string) => {
    setVoteLoading(optionId);
    try {
      // Use socket for real-time voting
      voteInPoll(pollId, optionId);
      
      // Optimistic update
      if (poll) {
        const updatedPoll = {
          ...poll,
          options: poll.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, votes: opt.votes + 1, voted: true }
              : opt
          ),
          totalVotes: poll.totalVotes + 1,
          hasVoted: true,
        };
        setPoll(updatedPoll);
      }
      
      // Also update via API for persistence
      await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });
      
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setVoteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Poll Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The poll you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/')} className="w-full" icon={Home}>
                Go Home
              </Button>
              <Button 
                onClick={() => router.push('/login')} 
                variant="outline" 
                className="w-full" 
                icon={LogIn}
              >
                Create Your Own Poll
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasVoted = poll.hasVoted || poll.options.some(opt => opt.voted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            icon={Home}
            className="mb-4"
          >
            Pollify Home
          </Button>
          
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-gray-900 dark:text-white">
                {poll.question}
              </CardTitle>
              {poll.description && (
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                  {poll.description}
                </CardDescription>
              )}
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {poll.totalVotes} votes
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Created {new Date(poll.createdAt).toLocaleDateString()}
                </span>
                <Badge variant={poll.isActive ? 'success' : 'warning'}>
                  {poll.isActive ? 'Active' : 'Closed'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voting Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                {hasVoted ? 'Poll Results' : 'Vote Now'}
              </CardTitle>
              <CardDescription>
                {hasVoted 
                  ? 'Thank you for voting! See the results below.'
                  : 'Select your preferred option (no registration required).'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {poll.options.map((option, index) => {
                  const percentage = calculatePercentage(option.votes, poll.totalVotes);
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 transition-all ${
                        hasVoted
                          ? option.voted
                            ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                          : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 cursor-pointer'
                      }`}
                      onClick={() => !hasVoted && handleVote(option.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            hasVoted && option.voted 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{option.text}</span>
                        </div>
                        {hasVoted && (
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      {hasVoted && (
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-indigo-600 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                      {!hasVoted && voteLoading === option.id && (
                        <div className="flex justify-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasVoted && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                    Click on an option to vote. No registration required!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Results</CardTitle>
                <CardDescription>
                  Real-time visualization of poll results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PollChart poll={poll} type="bar" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Results Distribution</CardTitle>
                <CardDescription>
                  Percentage breakdown of votes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PollChart poll={poll} type="doughnut" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        {!hasVoted && (
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                Want to create your own polls like this one?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/register')} 
                  size="lg"
                  icon={LogIn}
                >
                  Create Free Account
                </Button>
                <Button 
                  onClick={() => router.push('/')} 
                  variant="outline" 
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Pollify</span> - Real-time Polling Platform
          </p>
        </div>
      </div>
    </div>
  );
}
