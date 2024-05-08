import socketAuth from '../middlewares/socketauth.js';

export function setupSocket(io){
  io.use(socketAuth)
io.on('connection', (socket) => {
    console.log(`A user connected with socket ID: ${socket.id}`);
  
        // Listen for "chat message" events from clients
        socket.on('message', (msg) => {
          console.log('Received message:', msg);
          // You could broadcast to all other clients except the sender
          socket.broadcast.emit('message', msg);
      });
    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}