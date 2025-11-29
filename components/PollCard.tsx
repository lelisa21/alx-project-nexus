import { Poll } from "@/interface";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "./ui/Button";
interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{poll.question}</h2>
      <p className="text-gray-500">{poll.description}</p>
      <p className="text-sm text-gray-400">
        Created by {poll.createdByUser?.name ?? "Unknown"}
      </p>
      <Link
        href={`/polls/${poll.id}`}
        className="text-blue-500 mt-2 inline-block"
      >
        View Poll
      </Link>
      {user && poll.createdBy === user.id && (
        <Link href={`/polls/edit/${poll.id}`}>
          <Button variant="outline" size="sm" icon={Edit}>
            Edit Your Poll
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PollCard;
