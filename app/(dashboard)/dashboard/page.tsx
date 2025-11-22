'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPolls } from '@/features/polls/pollsSlice';
import { RootState } from '@/store/store';
import PollCard from '@/components/PollCard';
import {apiClient} from '@/lib/axios';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const polls = useSelector((state: RootState) => state.polls.polls);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await apiClient.get('/polls');
        dispatch(setPolls(res.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolls();
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {polls.map(poll => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
