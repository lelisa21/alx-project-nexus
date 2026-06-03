import { Poll } from "@/interface";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { BarChart3, Edit, Eye, Users } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <Badge variant={poll.isActive ? "success" : "default"}>
            {poll.isActive ? "Live" : "Closed"}
          </Badge>
          <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-gray-950 dark:text-white">
            {poll.question}
          </h2>
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>
      {poll.description && (
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {poll.description}
        </p>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="h-4 w-4" />
            Votes
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-white">
            {poll.totalVotes}
          </p>
        </div>
        <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-gray-500">
            <Eye className="h-4 w-4" />
            Views
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-950 dark:text-white">
            {poll.views ?? 0}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Created by {poll.createdByUser?.name ?? "Anonymous"}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link href={`/polls/${poll.id}`}>
          <Button size="sm">View Poll</Button>
        </Link>
      {user && poll.createdBy === user.id && (
        <Link href={`/polls/edit/${poll.id}`}>
          <Button variant="outline" size="sm" icon={Edit}>
            Edit
          </Button>
        </Link>
      )}
      </div>
    </div>
  );
};

export default PollCard;
