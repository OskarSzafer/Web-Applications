const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Socket.IO server is running');
});

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join', (nickname) => {
    users[socket.id] = nickname;
    io.emit('message', `${nickname} joined the chat!`);
    io.emit('userList', Object.values(users));
  });

  socket.on('message', ({ nickname, message }) => {
    io.emit('message', `${nickname}: ${message}`);
  });

  socket.on('disconnect', () => {
    const nickname = users[socket.id];
    delete users[socket.id];
    io.emit('message', `${nickname} left the chat.`);
    io.emit('userList', Object.values(users));
  });
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
