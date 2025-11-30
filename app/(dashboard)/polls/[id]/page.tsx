"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Clock,
  Share2,
  Copy,
  BarChart3,
  Eye,
  Edit,
  CheckCircle,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setCurrentPoll, updatePoll } from "@/features/polls/pollsSlice";
import { useSockets } from "@/hooks/useSocket";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PollChart } from "@/components/polls/PollChart";
import { calculatePercentage } from "@/lib/utils";

import type { Poll } from "@/interface";
const adaptPollData = (pollData: any, pollId: string): Poll => {
  return {
    id: pollData.id || pollId,
    question: pollData.question || "Untitled Poll",
    description: pollData.description || "",
    options:
      pollData.options?.map((opt: any, index: number) => ({
        id: opt.id || `opt-${index}`,
        text: opt.text || `Option ${index + 1}`,
        votes: typeof opt.votes === "number" ? opt.votes : 0,
        voted: opt.voted || false,
      })) || [],
    totalVotes:
      typeof pollData.totalVotes === "number" ? pollData.totalVotes : 0,
    isActive: pollData.isActive !== false,
    createdAt: pollData.createdAt || new Date().toISOString(),
    updatedAt: pollData.updatedAt || new Date().toISOString(),
    createdBy: pollData.createdBy || "unknown-user",
    hasVoted: pollData.hasVoted || false,
    views: pollData.views || 0,
  };
};

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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setError("");
        setSuccess("");

        const response = await fetch(`/api/polls/${pollId}`);

        if (response.ok) {
          const pollData = await response.json();
          const adaptedPoll = adaptPollData(pollData, pollId);
          dispatch(setCurrentPoll(adaptedPoll));
          setSuccess("Poll loaded successfully!");
          setTimeout(() => setSuccess(""), 2000);
        } else {
          const errorData = await response.json();
          console.error(
            "PollDetail: Failed to fetch poll:",
            response.status,
            errorData
          );

          if (response.status === 404) {
            setError(
              `Poll not found. The poll "${pollId}" doesn't exist or may have been deleted.`
            );
          } else if (response.status === 400) {
            setError("Invalid poll ID.");
          } else {
            setError(
              `Failed to load poll (Error ${response.status}). Please try again.`
            );
          }
        }
      } catch (error) {
        console.error("PollDetail: Network error:", error);
        setError("Network error. Please check your connection and try again.");
      }
    };
    if (pollId && pollId !== "undefined") {
      fetchPoll();
      joinPollRoom(pollId);
    } else {
      setError("Invalid poll ID in URL.");
    }

    return () => {
      if (pollId) {
        leavePollRoom(pollId);
      }
      dispatch(setCurrentPoll(null));
    };
  }, [pollId, dispatch, router, joinPollRoom, leavePollRoom]);

  // Handle voting
  const handleVote = async (optionId: string) => {
    if (!user) {
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (!currentPoll) return;

    // Check if user already voted
    if (currentPoll.hasVoted) {
      setError("You have already voted on this poll.");
      return;
    }

    setVoteLoading(optionId);
    setError("");

    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update via socket
        voteInPoll(pollId, optionId);

        // Update Redux store
        const updatedPoll = adaptPollData(result.poll, pollId);
        dispatch(updatePoll(updatedPoll));

        setSuccess("Your vote has been recorded!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit vote. Please try again.");
      }
    } catch (error) {
      console.error("PollDetail: Vote submission error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setVoteLoading(null);
    }
  };

  // Copy poll URL to clipboard
  const copyToClipboard = () => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setSuccess("Poll link copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Share on social media
  const shareOnTwitter = () => {
    const text = `Vote on this poll: ${currentPoll?.question}`;
    const url = `${window.location.origin}/poll/${pollId}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };
  useEffect(() => {
    console.log("PollDetail State:", {
      pollId,
      currentPoll: currentPoll
        ? {
            id: currentPoll.id,
            question: currentPoll.question,
            options: currentPoll.options?.length,
            totalVotes: currentPoll.totalVotes,
          }
        : null,
      loading,
      error,
      user: user ? "Logged in" : "Not logged in",
    });
  }, [currentPoll, loading, error, pollId, user]);
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Poll
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching poll data...
          </p>
          <div className="mt-4 text-sm text-gray-500">Poll ID: {pollId}</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="text-6xl mb-4">😕</div>
            <CardTitle className="text-2xl">Poll Not Found</CardTitle>
            <CardDescription className="text-lg mt-2">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Requested Poll ID:</strong>
                <br />
                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  {pollId}
                </code>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentPoll) {
    return null;
  }

  const hasVoted =
    currentPoll.hasVoted || currentPoll.options.some((opt) => opt.voted);
  const hasOptions = currentPoll.options && currentPoll.options.length > 0;
  const leadingVotes = Math.max(...currentPoll.options.map((opt) => opt.votes));
  const leadingOptions = currentPoll.options.filter(
    (opt) => opt.votes === leadingVotes && opt.votes > 0
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 group dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to dashboard
            </Link>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentPoll.question}
                    </h1>
                    {currentPoll.isActive ? (
                      <Badge variant="success" className="text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Live
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-sm">
                        Closed
                      </Badge>
                    )}
                  </div>

                  {currentPoll.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                      {currentPoll.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-semibold">
                        {currentPoll.totalVotes}
                      </span>{" "}
                      votes
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="font-semibold">
                        {currentPoll.views}
                      </span>{" "}
                      views
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Created{" "}
                      {new Date(currentPoll.createdAt).toLocaleDateString()}
                    </div>
                    {currentPoll.createdBy &&
                      currentPoll.createdBy !== "unknown-user" && (
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          By {currentPoll.createdBy}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              icon={copied ? CheckCircle : Copy}
              className="whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              onClick={shareOnTwitter}
              variant="outline"
              icon={Share2}
              className="whitespace-nowrap"
            >
              Share
            </Button>
            {/* {user && currentPoll?.createdBy === user.id && ( */}
            <Link href={`/polls/edit/${pollId}`}>
              <Button variant="outline" icon={Edit}>
                Edit Poll
              </Button>
            </Link>
            {/* )} */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voting Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center text-2xl">
                  <BarChart3 className="h-6 w-6 mr-3 text-indigo-600" />
                  {hasVoted ? "Poll Results" : "Cast Your Vote"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {hasVoted
                    ? "Thank you for voting! Here are the current results."
                    : "Select your preferred option below. Your vote is anonymous."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!hasOptions ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-600 dark:text-gray-400">
                      No voting options available.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPoll.options.map((option, index) => {
                      const percentage = calculatePercentage(
                        option.votes,
                        currentPoll.totalVotes
                      );
                      const isLeading =
                        option.votes === leadingVotes && leadingVotes > 0;
                      const isVoted = option.voted;

                      return (
                        <div
                          key={option.id}
                          className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                            hasVoted
                              ? isVoted
                                ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20"
                                : "border-gray-200 dark:border-gray-600"
                              : "border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 cursor-pointer transform hover:scale-[1.02]"
                          } ${
                            isLeading
                              ? "ring-2 ring-indigo-200 dark:ring-indigo-400"
                              : ""
                          }`}
                          onClick={() =>
                            !hasVoted && !voteLoading && handleVote(option.id)
                          }
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                                  hasVoted
                                    ? isVoted
                                      ? "bg-indigo-600 text-white shadow-lg"
                                      : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                                }`}
                              >
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white text-lg flex-1">
                                {option.text}
                              </span>
                            </div>
                            {hasVoted && (
                              <div className="text-right ml-4">
                                <div className="font-bold text-gray-900 dark:text-white text-lg">
                                  {option.votes}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            )}
                          </div>

                          {hasVoted && (
                            <div className="space-y-2">
                              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden">
                                <div
                                  className="h-3 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              {isLeading && (
                                <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Leading
                                </div>
                              )}
                            </div>
                          )}

                          {!hasVoted && voteLoading === option.id && (
                            <div className="flex justify-center mt-2">
                              <LoadingSpinner size="sm" />
                              <span className="ml-2 text-sm text-gray-600">
                                Recording vote...
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {hasVoted && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <Eye className="h-4 w-4 mr-2" />
                      Results update in real-time as people vote
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Charts and Stats */}
          <div className="space-y-6">
            {/* Live Results Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Live Results
                </CardTitle>
                <CardDescription>Real-time visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PollChart poll={currentPoll} type="bar" />
                </div>
              </CardContent>
            </Card>

            {/* Distribution Chart */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Distribution</CardTitle>
                <CardDescription>Percentage breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PollChart poll={currentPoll} type="doughnut" />
                </div>
              </CardContent>
            </Card>

            {/* Poll Statistics */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Poll Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Votes
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {currentPoll.totalVotes}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Options
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {currentPoll.options.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <Badge variant={currentPoll.isActive ? "success" : "warning"}>
                    {currentPoll.isActive ? "Active" : "Closed"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Your Vote
                  </span>
                  <Badge variant={hasVoted ? "success" : "default"}>
                    {hasVoted ? "Voted" : "Not Voted"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Created
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {new Date(currentPoll.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {new Date(currentPoll.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
