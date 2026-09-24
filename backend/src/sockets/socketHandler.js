const { Server } = require('socket.io');

let io = null;

const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join organization specific room
    socket.on('join_org', (organizationId) => {
      if (organizationId) {
        const room = `org_${organizationId}`;
        socket.join(room);
        console.log(`[Socket.IO] Socket ${socket.id} joined room ${room}`);
      }
    });

    socket.on('leave_org', (organizationId) => {
      if (organizationId) {
        const room = `org_${organizationId}`;
        socket.leave(room);
        console.log(`[Socket.IO] Socket ${socket.id} left room ${room}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = { initSocket, getIO };
