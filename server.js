const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const users = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('setUsername', (username) => {
    users.set(socket.id, username);
    console.log(`User ${username} joined`);
    io.emit('userJoined', `${username} has joined the chat`);
  });

  socket.on('sendMessage', (message) => {
    const username = users.get(socket.id);
    if (username) {
      io.emit('message', {
        username: username,
        text: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      io.emit('userLeft', `${username} has left the chat`);
      users.delete(socket.id);
      console.log(`User ${username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});