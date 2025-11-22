import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '@/store/hooks';
import { updatePoll } from '@/features/polls/pollsSlice';
import { Poll } from '@/interface';

export const useSockets = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  interface SocketEvents {
  'poll:updated': (poll: Poll) => void;
  'poll:created': (poll: Poll) => void;
  'poll:vote': (data: { pollId: string; optionId: string }) => void;
}
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('poll:updated', (poll: Poll) => {
      dispatch(updatePoll(poll));
    });

    socket.on('poll:created', (poll: Poll) => {
      // Handle new poll creation if needed
    });
socket.on('poll:vote', (data: { pollId: string; optionId: string }) => {
  // Handle individual votes if needed
});
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const joinPollRoom = (pollId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join:poll', pollId);
    }
  };

  const leavePollRoom = (pollId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave:poll', pollId);
    }
  };

  const voteInPoll = (pollId: string, optionId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('poll:vote', { pollId, optionId });
    }
  };

  return {
    joinPollRoom,
    leavePollRoom,
    voteInPoll,
  };
};
