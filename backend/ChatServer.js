
// chatServer.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust for your frontend origin
  }
});

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);  // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
