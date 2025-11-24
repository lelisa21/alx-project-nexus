import React from "react";
import { Poll } from "@/interface";
import Link from "next/link";

interface Props {
  poll: Poll;
}

const PollCard: React.FC<Props> = ({ poll }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{poll.question}</h2>
      <p className="text-gray-500">{poll.description}</p>
      <p className="text-sm text-gray-400">Created by {poll.createdByUser?.name ?? "Unknown"}</p>
      <Link
        href={`/polls/${poll.id}`}
        className="text-blue-500 mt-2 inline-block"
      >
        View Poll
      </Link>
    </div>
  );
};

export default PollCard;
