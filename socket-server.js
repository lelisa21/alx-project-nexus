const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = 3001;

// Create HTTP server
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Socket.io server is running' }));
});

// Create Socket.io server with proper WebSocket config
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  // Add these for better WebSocket handling
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

console.log('🚀 Starting Socket.io server...');

// Store active polls and votes
const pollData = new Map();

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id, 'Transport:', socket.conn.transport.name);

  // Listen for transport upgrades
  socket.conn.on("upgrade", (transport) => {
    console.log(`Socket ${socket.id} upgraded to:`, transport.name);
  });

  socket.on('join:poll', (pollId) => {
    socket.join(pollId);
    console.log(`Socket ${socket.id} joined poll room: ${pollId}`);
    if (pollData.has(pollId)) {
      socket.emit('poll:updated', pollData.get(pollId));
      console.log(`📤 Sent existing data for poll: ${pollId}`);
    } else {
      const defaultPoll = {
        id: pollId,
        question: `Poll ${pollId}`,
        description: 'A real-time poll',
        options: [
          { id: 'opt1', text: 'Option 1', votes: 10 },
          { id: 'opt2', text: 'Option 2', votes: 5 },
          { id: 'opt3', text: 'Option 3', votes: 3 },
        ],
        totalVotes: 18,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      pollData.set(pollId, defaultPoll);
      socket.emit('poll:updated', defaultPoll);
      console.log(`📤 Created and sent new data for poll: ${pollId}`);
    }
  });

  socket.on('leave:poll', (pollId) => {
    socket.leave(pollId);
    console.log(`🚪 Socket ${socket.id} left poll room: ${pollId}`);
  });

  socket.on('poll:vote', (data) => {
    const { pollId, optionId } = data;
    console.log('🗳️ Vote received:', data);

    if (!pollData.has(pollId)) {
      console.log(`Poll ${pollId} not found`);
      return;
    }

    const poll = pollData.get(pollId);
    const option = poll.options.find(opt => opt.id === optionId);
    
    if (option) {
      option.votes += 1;
      poll.totalVotes += 1;
      poll.updatedAt = new Date().toISOString();
      
      console.log(`Updated poll ${pollId}:`, {
        option: option.text,
        votes: option.votes,
        totalVotes: poll.totalVotes
      });
      
      // Broadcast updated poll to ALL clients in the room
      io.to(pollId).emit('poll:updated', poll);
      console.log(`Broadcast update to ${io.sockets.adapter.rooms.get(pollId)?.size || 0} clients in room ${pollId}`);
    } else {
      console.log(`Option ${optionId} not found in poll ${pollId}`);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

httpServer.on('error', (error) => {
  console.error('🚨 Server error:', error);
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`=================================`);
  console.log(` Socket.io Server Started!`);
  console.log(` Port: ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Ready for connections from: http://localhost:3000`);
  console.log(` Transports: websocket, polling`);
  console.log(`=================================`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n Shutting down Socket.io server...');
  io.close(() => {
    console.log(' Socket.io server closed');
    process.exit(0);
  });
});
