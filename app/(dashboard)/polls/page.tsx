"use client";

import PollCard from "@/components/PollCard";
import { Button } from "@/components/ui/Button";
import { setPolls } from "@/features/polls/pollsSlice";
import { pollTemplates } from "@/lib/productDemo";
import { useSockets } from "@/hooks/useSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Archive,
  BarChart3,
  Filter,
  FolderKanban,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AllPolls() {
  const { polls } = useAppSelector((state) => state.polls);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const { joinPollRoom, leavePollRoom } = useSockets();

  const fetchPolls = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/polls");
      if (!response.ok) throw new Error(`Could not load polls (${response.status})`);
      dispatch(setPolls(await response.json()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
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

  const filteredPolls = useMemo(() => {
    return polls.filter((poll) => {
      const matchesSearch =
        poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && poll.isActive) ||
        (filter === "closed" && !poll.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [filter, polls, searchTerm]);

  const stats = {
    total: polls.length,
    active: polls.filter((poll) => poll.isActive).length,
    closed: polls.filter((poll) => !poll.isActive).length,
    votes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
  };

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-lg bg-slate-950 p-6 text-white lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold text-emerald-300">Poll Library</p>
          <h1 className="mt-3 text-4xl font-bold">Manage every audience touchpoint.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Search live sessions, archived polls, shared templates, and team-owned research collections.
          </p>
        </div>
        <Link href="/polls/create">
          <Button icon={Plus} className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">New poll</Button>
        </Link>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
          <button onClick={fetchPolls} className="ml-3 underline">Retry</button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total polls", value: stats.total, icon: BarChart3 },
          { label: "Active sessions", value: stats.active, icon: Users },
          { label: "Archived", value: stats.closed, icon: Archive },
          { label: "Total votes", value: stats.votes, icon: FolderKanban },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <item.icon className="h-5 w-5 text-emerald-700" />
            <p className="mt-4 text-3xl font-bold">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="flex items-center rounded-lg border border-slate-200 px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Search by question, description, collection, or owner..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "closed"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${
                  filter === item ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
            <button className="rounded-lg border border-slate-200 bg-white p-2" aria-label="Advanced filters">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Showing {filteredPolls.length} of {polls.length} polls
            </p>
            <Button onClick={fetchPolls} variant="outline" size="sm" icon={RefreshCw}>Refresh</Button>
          </div>
          {filteredPolls.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredPolls.map((poll) => <PollCard key={poll.id} poll={poll} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <Filter className="mx-auto h-8 w-8 text-emerald-700" />
              <h2 className="mt-4 text-xl font-bold">No matching polls</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Clear the filters or create a new session from a template to start building your library.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Collections</h2>
            <div className="mt-4 space-y-2 text-sm font-semibold">
              {["Executive updates", "Customer research", "Training sessions", "Archived events"].map((collection, index) => (
                <div key={collection} className="flex items-center justify-between rounded-lg bg-[#f7f8f3] px-3 py-2">
                  <span>{collection}</span>
                  <span className="text-slate-400">{[6, 4, 8, 3][index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Recommended templates</h2>
            <div className="mt-4 space-y-3">
              {pollTemplates.slice(0, 3).map((template) => (
                <Link key={template.name} href="/polls/create" className="block rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <template.icon className="h-4 w-4 text-emerald-700" />
                  <p className="mt-2 text-sm font-bold">{template.name}</p>
                  <p className="text-xs text-slate-500">{template.type}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
