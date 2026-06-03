"use client";

import { Poll } from "@/interface";
import { useAppSelector } from "@/store/hooks";
import { BarChart3, Edit, Eye, MessageSquareText, Radio, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { user } = useAppSelector((state) => state.auth);
  const leadingOption = [...(poll.options || [])].sort((a, b) => b.votes - a.votes)[0];
  const engagement = poll.views ? Math.min(100, Math.round((poll.totalVotes / poll.views) * 100)) : Math.min(92, 42 + poll.totalVotes);

  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${poll.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          <span className={poll.isActive ? "live-dot mr-2" : "mr-2 h-2 w-2 rounded-full bg-slate-400"} />
          {poll.isActive ? "Live" : "Closed"}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {engagement}% engaged
        </span>
      </div>

      <h2 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-slate-950">{poll.question}</h2>
      {poll.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{poll.description}</p>}

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-[#f7f8f3] p-3">
          <Users className="h-4 w-4 text-emerald-700" />
          <p className="mt-2 text-lg font-bold">{poll.totalVotes}</p>
          <p className="text-[11px] font-semibold text-slate-500">votes</p>
        </div>
        <div className="rounded-lg bg-[#f7f8f3] p-3">
          <Eye className="h-4 w-4 text-emerald-700" />
          <p className="mt-2 text-lg font-bold">{poll.views || poll.totalVotes * 3}</p>
          <p className="text-[11px] font-semibold text-slate-500">views</p>
        </div>
        <div className="rounded-lg bg-[#f7f8f3] p-3">
          <MessageSquareText className="h-4 w-4 text-emerald-700" />
          <p className="mt-2 text-lg font-bold">{Math.max(3, Math.round(poll.totalVotes / 6))}</p>
          <p className="text-[11px] font-semibold text-slate-500">signals</p>
        </div>
      </div>

      {leadingOption && (
        <div className="mt-5">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Leading response</span>
            <span>{leadingOption.votes} votes</span>
          </div>
          <div className="mt-2 rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-700" />
              <p className="line-clamp-1 text-sm font-bold">{leadingOption.text}</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${poll.totalVotes ? Math.round((leadingOption.votes / poll.totalVotes) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link href={`/polls/${poll.id}`} className="flex-1">
          <Button className="w-full" icon={BarChart3}>Analyze</Button>
        </Link>
        {user && poll.createdBy === user.id && (
          <Link href={`/polls/edit/${poll.id}`}>
            <Button variant="outline" size="sm" icon={Edit}>Edit</Button>
          </Link>
        )}
      </div>
    </article>
  );
};

export default PollCard;
