"use client";

import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/Button";
import { setPolls } from "@/features/polls/pollsSlice";
import {
  audienceSegments,
  demoMetrics,
  deviceSegments,
  engagementTimeline,
  enterpriseSignals,
  recentActivity,
} from "@/lib/productDemo";
import { useSockets } from "@/hooks/useSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Download,
  MessageSquareText,
  Plus,
  Radio,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const { polls } = useAppSelector((state) => state.polls);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { joinPollRoom, leavePollRoom, isConnected, connectionError } = useSockets();

  const fetchPolls = useCallback(async () => {
    try {
      const response = await fetch("/api/polls");
      if (response.ok) {
        dispatch(setPolls(await response.json()));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useEffect(() => {
    polls.forEach((poll) => joinPollRoom(poll.id));
    return () => polls.forEach((poll) => leavePollRoom(poll.id));
  }, [polls, joinPollRoom, leavePollRoom]);

  const stats = useMemo(() => {
    const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
    const views = polls.reduce((sum, poll) => sum + (poll.views || 0), 0);
    return {
      totalPolls: polls.length,
      totalVotes,
      activePolls: polls.filter((poll) => poll.isActive).length,
      participationRate: views ? Math.round((totalVotes / views) * 100) : 68,
    };
  }, [polls]);

  const topPolls = [...polls].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 4);
  const maxTimeline = Math.max(...engagementTimeline.map((item) => item.votes));

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
          <p className="mt-3 text-sm font-semibold text-slate-600">Loading audience intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                Command Center
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-white/60">
                <span className={isConnected ? "live-dot" : "h-2 w-2 rounded-full bg-amber-400"} />
                {isConnected ? "Realtime connected" : connectionError ? "Realtime degraded" : "Realtime warming up"}
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight">
              Good evening, {user?.name || "Pollify builder"}. Your audience is giving you a signal.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              Monitor live sessions, compare engagement, invite collaborators, and turn raw votes into
              product-ready decisions from one workspace.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/polls/create">
                <Button icon={Sparkles} className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                  Create with AI
                </Button>
              </Link>
              <Link href="/polls">
                <Button variant="secondary" icon={BarChart3}>Open poll library</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Live event room</p>
              <Radio className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/8 p-3">
                <p className="text-2xl font-bold">284</p>
                <p className="text-xs text-white/55">participants</p>
              </div>
              <div className="rounded-lg bg-white/8 p-3">
                <p className="text-2xl font-bold">58</p>
                <p className="text-xs text-white/55">comments</p>
              </div>
              <div className="rounded-lg bg-white/8 p-3">
                <p className="text-2xl font-bold">97%</p>
                <p className="text-xs text-white/55">sync health</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-6 items-end gap-2">
              {engagementTimeline.map((item) => (
                <div key={item.time} className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-emerald-300" style={{ height: `${Math.max(22, (item.votes / maxTimeline) * 108)}px` }} />
                  <span className="text-[10px] text-white/45">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Polls", value: stats.totalPolls || demoMetrics[3].value, delta: "library depth", icon: BarChart3 },
          { label: "Total votes", value: stats.totalVotes || "1,428", delta: "+18% this week", icon: Users },
          { label: "Active rooms", value: stats.activePolls || "6", delta: "2 live now", icon: Zap },
          { label: "Participation", value: `${stats.participationRate}%`, delta: "healthy", icon: TrendingUp },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <metric.icon className="h-5 w-5 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-700">{metric.delta}</span>
            </div>
            <p className="mt-5 text-3xl font-bold">{metric.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Performance intelligence</h2>
              <p className="text-sm text-slate-500">Timeline, geography, device mix, and engagement signals.</p>
            </div>
            <button className="btn-secondary inline-flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              Export report
            </button>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid grid-cols-6 items-end gap-3 rounded-lg bg-[#f7f8f3] p-4">
              {engagementTimeline.map((item) => (
                <div key={item.time} className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-slate-950" style={{ height: `${Math.max(32, (item.votes / maxTimeline) * 170)}px` }} />
                  <span className="text-[11px] font-semibold text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              {[...audienceSegments, ...deviceSegments.slice(0, 2)].map((segment) => (
                <div key={segment.label}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{segment.label}</span>
                    <span>{segment.value}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${segment.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Activity stream</h2>
          <div className="mt-5 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-sm leading-6 text-slate-600">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Workspace readiness</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {enterpriseSignals.map((signal) => (
              <div key={signal.label} className="rounded-lg border border-slate-200 bg-[#fbfbf7] p-3">
                <signal.icon className="h-4 w-4 text-emerald-700" />
                <p className="mt-3 text-sm font-bold">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Trending polls</h2>
              <p className="text-sm text-slate-500">Top sessions by participation and recency.</p>
            </div>
            <Link href="/polls" className="inline-flex items-center text-sm font-bold text-slate-700">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {topPolls.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {topPolls.map((poll) => <PollCard key={poll.id} poll={poll} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-emerald-700" />
              <h3 className="mt-4 text-lg font-bold">Your demo workspace is ready</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Seed demo data or create a first poll to activate live trends, historical comparisons, and AI summaries.
              </p>
              <Link href="/polls/create" className="mt-5 inline-flex">
                <Button icon={Plus}>Create first poll</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-5 w-5 text-emerald-700" />
          <h2 className="text-xl font-bold">Live Q&A and reactions</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {["Upvote roadmap concerns", "Capture live sentiment", "Turn comments into follow-up polls"].map((item) => (
            <div key={item} className="rounded-lg bg-[#f7f8f3] p-4 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
