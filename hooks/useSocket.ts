"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '@/store/hooks';
import { updatePoll } from '@/features/polls/pollsSlice';
import { Poll } from '@/interface';

export const useSockets = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (socketRef.current?.connected) {
      return;
    }

    console.log('🔌 Attempting to connect to Socket.io server...');
    
    try {
      const socket = io('', {
        transports: ['websocket', 'polling'],
        timeout: 50000,
        autoConnect: true,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 2000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Successfully connected to Socket.io server:', socket.id);
        setIsConnected(true);
        setConnectionError(null);
      });

      socket.on('poll:updated', (updatedPoll: Poll) => {
        dispatch(updatePoll(updatedPoll));
      });

      socket.on('disconnect', (reason) => {
        setIsConnected(false);
        
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error.message);
        setIsConnected(false);
        setConnectionError(error.message);
        
        setTimeout(() => {
          if (!socket.connected) {
            socket.connect();
          }
        }, 2000);
      });

      socket.on('reconnect_attempt', (attempt) => {
        console.log(`Reconnection attempt ${attempt}`);
      });

      socket.on('reconnect', (attempt) => {
        console.log(`Reconnected after ${attempt} attempts`);
        setIsConnected(true);
        setConnectionError(null);
      });

      socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
      });

      socket.on('reconnect_failed', () => {
        console.error('Failed to reconnect after all attempts');
        setConnectionError('Failed to establish connection with server');
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
      setConnectionError('Failed to initialize socket connection');
    }

    return () => {
      console.log('Cleaning up socket connection');
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);

  const joinPollRoom = useCallback((pollId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join:poll', pollId);
      console.log(`Joined real poll room: ${pollId}`);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  }, []);

  const leavePollRoom = useCallback((pollId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave:poll', pollId);
      console.log(`Left real poll room: ${pollId}`);
    }
  }, []);

  const voteInPoll = useCallback((pollId: string, optionId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('poll:vote', { pollId, optionId });
      console.log(`Real vote emitted: poll=${pollId}, option=${optionId}`);
    } else {
      console.error('Socket not connected, vote not sent');
      fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      }).catch(error => {
        console.error('API vote also failed:', error);
      });
    }
  }, []);

  return {
    joinPollRoom,
    leavePollRoom,
    voteInPoll,
    isConnected,
    connectionError,
    socketId: socketRef.current?.id,
  };
};
