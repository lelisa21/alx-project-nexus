'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Share2, 
  Copy,
  BarChart3,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentPoll, updatePoll } from '@/features/polls/pollsSlice';
import { useSockets } from '@/hooks/useSocket';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PollChart } from '@/components/polls/PollChart';
import { calculatePercentage, getRandomColor } from '@/lib/utils';

export default function PollDetail() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  
  const { currentPoll, loading } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { joinPollRoom, leavePollRoom, voteInPoll } = useSockets();
  
  const [copied, setCopied] = useState(false);
  const [voteLoading, setVoteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`);
        if (response.ok) {
          const poll = await response.json();
          dispatch(setCurrentPoll(poll));
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        router.push('/dashboard');
      }
    };

    fetchPoll();
    joinPollRoom(pollId);

    return () => {
      leavePollRoom(pollId);
      dispatch(setCurrentPoll(null));
    };
  }, [pollId, dispatch, router, joinPollRoom, leavePollRoom]);

  const handleVote = async (optionId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setVoteLoading(optionId);
    try {
      voteInPoll(pollId, optionId);
      
      // Optimistic update
      if (currentPoll) {
        const updatedPoll = {
          ...currentPoll,
          options: currentPoll.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, votes: opt.votes + 1, voted: true }
              : opt
          ),
          totalVotes: currentPoll.totalVotes + 1,
          hasVoted: true,
        };
        dispatch(updatePoll(updatedPoll));
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setVoteLoading(null);
    }
  };

  const copyToClipboard = () => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !currentPoll) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasVoted = currentPoll.hasVoted || currentPoll.options.some(opt => opt.voted);
  const isOwner = currentPoll.createdBy === user?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentPoll.question}</h1>
            {currentPoll.isActive ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="warning">Closed</Badge>
            )}
            {isOwner && <Badge variant="info">Your Poll</Badge>}
          </div>
          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {currentPoll.totalVotes} votes
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Created {new Date(currentPoll.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <Button
          onClick={copyToClipboard}
          variant="outline"
          icon={copied ? Copy : Share2}
          className="mt-4 sm:mt-0"
        >
          {copied ? 'Copied!' : 'Share'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voting Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                {hasVoted ? 'Poll Results' : 'Cast Your Vote'}
              </CardTitle>
              <CardDescription>
                {hasVoted 
                  ? 'Thank you for voting! Here are the current results.'
                  : 'Select your preferred option below.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentPoll.options.map((option, index) => {
                  const percentage = calculatePercentage(option.votes, currentPoll.totalVotes);
                  const isLeading = option.votes === Math.max(...currentPoll.options.map(o => o.votes));
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-xl p-4 transition-all duration-200 ${
                        hasVoted
                          ? option.voted
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-gray-200'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                      } ${isLeading && hasVoted ? 'ring-2 ring-indigo-200' : ''}`}
                      onClick={() => !hasVoted && handleVote(option.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              hasVoted
                                ? option.voted
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium text-gray-900">{option.text}</span>
                        </div>
                        {hasVoted && (
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {option.votes} votes
                            </div>
                            <div className="text-sm text-gray-600">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {hasVoted && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              getRandomColor(index)
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}

                      {!hasVoted && voteLoading === option.id && (
                        <div className="flex justify-center mt-2">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasVoted && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Results update in real-time as people vote
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Results</CardTitle>
              <CardDescription>
                Real-time visualization of poll results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PollChart poll={currentPoll} />
            </CardContent>
          </Card>

          {/* Poll Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Poll Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Votes</span>
                <span className="font-semibold text-gray-900">{currentPoll.totalVotes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Options</span>
                <span className="font-semibold text-gray-900">{currentPoll.options.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={currentPoll.isActive ? 'success' : 'warning'}>
                  {currentPoll.isActive ? 'Active' : 'Closed'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {new Date(currentPoll.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
