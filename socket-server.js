const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  const pollData = new Map();

  io.on('connection', (socket) => {
    socket.on('join:poll', (pollId) => {
      socket.join(pollId);
      if (pollData.has(pollId)) {
        socket.emit('poll:updated', pollData.get(pollId));
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
      }
    });

    socket.on('leave:poll', (pollId) => {
      socket.leave(pollId);
    });

    socket.on('poll:vote', (data) => {
      const { pollId, optionId } = data;

      if (!pollData.has(pollId)) return;

      const poll = pollData.get(pollId);
      const option = poll.options.find(opt => opt.id === optionId);
      
      if (option) {
        option.votes += 1;
        poll.totalVotes += 1;
        poll.updatedAt = new Date().toISOString();
        
        io.to(pollId).emit('poll:updated', poll);
      }
    });
  });

  httpServer.listen(PORT, "0.0.0.0");
});

process.on('SIGINT', () => {
  process.exit(0);
});
