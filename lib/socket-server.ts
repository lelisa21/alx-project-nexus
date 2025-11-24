/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';

const ioHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');
    
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id);

      socket.on('join:poll', (pollId: string) => {
        socket.join(pollId);
        console.log(`🔗 Socket ${socket.id} joined poll room: ${pollId}`);
      });

      socket.on('leave:poll', (pollId: string) => {
        socket.leave(pollId);
        console.log(`🚪 Socket ${socket.id} left poll room: ${pollId}`);
      });

      socket.on('poll:vote', (data: { pollId: string; optionId: string }) => {
        console.log('🗳️ Vote received:', data);
        
        // Broadcast to all clients in the poll room
        socket.to(data.pollId).emit('poll:vote', data);
        
        // Simulate updated poll data (in real app, this would come from your database)
        const updatedPoll = {
          id: data.pollId,
          options: [
            { id: '1', text: 'React', votes: 46 },
            { id: '2', text: 'Vue', votes: 30 },
            { id: '3', text: 'Angular', votes: 25 },
          ],
          totalVotes: 101,
          updatedAt: new Date().toISOString(),
        };
        
        // Broadcast updated poll to all clients in the room
        io.to(data.pollId).emit('poll:updated', updatedPoll);
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.io already running');
  }
  res.end();
};

export default ioHandler;
