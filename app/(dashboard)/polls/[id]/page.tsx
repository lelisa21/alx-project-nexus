"use client";

import { Button } from "@/components/ui/Button";
import { setCurrentPoll, updatePoll } from "@/features/polls/pollsSlice";
import { Poll } from "@/interface";
import { audienceSegments, deviceSegments, engagementTimeline, recentActivity } from "@/lib/productDemo";
import { calculatePercentage } from "@/lib/utils";
import { useSockets } from "@/hooks/useSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Globe2,
  MessageSquareText,
  Radio,
  RefreshCw,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface PollApiOption {
  id?: string;
  text?: string;
  votes?: number;
  voted?: boolean;
}

interface PollApiResponse {
  id?: string;
  question?: string;
  description?: string;
  options?: PollApiOption[];
  totalVotes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  hasVoted?: boolean;
  views?: number;
  user?: {
    name?: string;
  };
}

const adaptPollData = (pollData: PollApiResponse, pollId: string): Poll => ({
  id: pollData.id || pollId,
  question: pollData.question || "Untitled Poll",
  description: pollData.description || "",
  options: pollData.options?.map((opt, index) => ({
    id: opt.id || `opt-${index}`,
    text: opt.text || `Option ${index + 1}`,
    votes: typeof opt.votes === "number" ? opt.votes : 0,
    voted: opt.voted || false,
  })) || [],
  totalVotes: typeof pollData.totalVotes === "number" ? pollData.totalVotes : 0,
  isActive: pollData.isActive !== false,
  createdAt: pollData.createdAt || new Date().toISOString(),
  updatedAt: pollData.updatedAt || new Date().toISOString(),
  createdBy: pollData.user?.name || pollData.createdBy || "Pollify workspace",
  hasVoted: pollData.hasVoted || false,
  views: pollData.views || 0,
});

export default function PollDetail() {
  const params = useParams();
  const pollId = params.id as string;
  const dispatch = useAppDispatch();
  const { currentPoll } = useAppSelector((state) => state.polls);
  const { joinPollRoom, leavePollRoom, voteInPoll, isConnected } = useSockets();
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/polls/${pollId}`);
        if (!response.ok) throw new Error(response.status === 404 ? "Poll not found" : "Failed to load poll");
        dispatch(setCurrentPoll(adaptPollData(await response.json(), pollId)));
        joinPollRoom(pollId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    if (pollId) fetchPoll();
    return () => {
      if (pollId) leavePollRoom(pollId);
      dispatch(setCurrentPoll(null));
    };
  }, [dispatch, joinPollRoom, leavePollRoom, pollId]);

  const voterId = useMemo(() => {
    if (typeof window === "undefined") return "";
    const existing = localStorage.getItem("pollify_voter_id");
    if (existing) return existing;
    const next = crypto.randomUUID();
    localStorage.setItem("pollify_voter_id", next);
    return next;
  }, []);

  const handleVote = async (optionId: string) => {
    setVoteLoading(optionId);
    setError("");
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, voterId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit vote");
      voteInPoll(pollId, optionId);
      dispatch(updatePoll(adaptPollData(result.poll, pollId)));
      setSuccess("Vote recorded. Results updated live.");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote");
    } finally {
      setVoteLoading(null);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (error && !currentPoll) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-red-900">{error}</h1>
        <Link href="/polls" className="mt-5 inline-flex">
          <Button>Back to library</Button>
        </Link>
      </div>
    );
  }

  if (!currentPoll) return null;

  const leadingVotes = Math.max(0, ...currentPoll.options.map((option) => option.votes));
  const leadingOption = currentPoll.options.find((option) => option.votes === leadingVotes);
  const maxTimeline = Math.max(...engagementTimeline.map((item) => item.votes));
  const participation = currentPoll.views ? Math.round((currentPoll.totalVotes / currentPoll.views) * 100) : 72;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <Link href="/polls" className="mb-4 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to poll library
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${currentPoll.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              <span className={currentPoll.isActive ? "live-dot mr-2" : "mr-2 h-2 w-2 rounded-full bg-slate-400"} />
              {currentPoll.isActive ? "Live poll" : "Closed"}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
              {isConnected ? "Realtime connected" : "Realtime reconnecting"}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight">{currentPoll.question}</h1>
          {currentPoll.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{currentPoll.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" icon={copied ? CheckCircle2 : Copy} onClick={copyToClipboard}>{copied ? "Copied" : "Copy link"}</Button>
          <Button variant="outline" icon={Share2}>Share</Button>
          <Button icon={Download}>Export</Button>
        </div>
      </div>

      {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{success}</div>}
      {error && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Votes", value: currentPoll.totalVotes, icon: Users },
          { label: "Views", value: currentPoll.views || currentPoll.totalVotes * 3, icon: Eye },
          { label: "Participation", value: `${participation}%`, icon: TrendingUp },
          { label: "Responses", value: currentPoll.options.length, icon: Radio },
          { label: "AI signals", value: Math.max(4, Math.round(currentPoll.totalVotes / 7)), icon: Sparkles },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <metric.icon className="h-5 w-5 text-emerald-700" />
            <p className="mt-4 text-3xl font-bold">{metric.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center text-xl font-bold">
            <Zap className="mr-2 h-5 w-5 text-emerald-700" />
            Cast a vote
          </h2>
          <div className="mt-5 space-y-3">
            {currentPoll.options.map((option, index) => {
              const percentage = calculatePercentage(option.votes, currentPoll.totalVotes);
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={Boolean(voteLoading)}
                  className="w-full rounded-lg border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-bold">{option.text}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-500">{voteLoading === option.id ? "Saving..." : `${percentage.toFixed(1)}%`}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${percentage}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-bold">
              <BarChart3 className="mr-2 h-5 w-5 text-emerald-700" />
              Live result dashboard
            </h2>
            <span className="text-sm font-bold text-emerald-700">Top: {leadingOption?.text || "No votes yet"}</span>
          </div>
          <div className="mt-6 space-y-4">
            {currentPoll.options.map((option) => {
              const percentage = calculatePercentage(option.votes, currentPoll.totalVotes);
              return (
                <div key={option.id}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{option.text}</span>
                    <span>{option.votes} votes</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-slate-950 transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center text-xl font-bold">
            <TrendingUp className="mr-2 h-5 w-5 text-emerald-700" />
            Vote timeline
          </h2>
          <div className="mt-6 grid grid-cols-6 items-end gap-3 rounded-lg bg-[#f7f8f3] p-4">
            {engagementTimeline.map((item) => (
              <div key={item.time} className="flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-emerald-500" style={{ height: `${Math.max(28, (item.votes / maxTimeline) * 170)}px` }} />
                <span className="text-[11px] font-semibold text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center text-xl font-bold">
              <Globe2 className="mr-2 h-5 w-5 text-emerald-700" />
              Geography
            </h2>
            <div className="mt-5 space-y-4">
              {audienceSegments.map((segment) => (
                <SegmentBar key={segment.label} label={segment.label} value={segment.value} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Devices</h2>
            <div className="mt-5 space-y-4">
              {deviceSegments.map((segment) => (
                <SegmentBar key={segment.label} label={segment.label} value={segment.value} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center text-xl font-bold">
            <Sparkles className="mr-2 h-5 w-5 text-emerald-700" />
            AI result summary
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The leading answer is gaining momentum, but the second option is close enough to merit a
            follow-up question. Participation is healthy for a live room, with mobile users driving most late responses.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center text-xl font-bold">
            <MessageSquareText className="mr-2 h-5 w-5 text-emerald-700" />
            Discussion signals
          </h2>
          <div className="mt-4 space-y-3">
            {recentActivity.slice(0, 3).map((activity) => (
              <div key={activity} className="rounded-lg bg-[#f7f8f3] p-3 text-sm font-semibold text-slate-600">{activity}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SegmentBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
