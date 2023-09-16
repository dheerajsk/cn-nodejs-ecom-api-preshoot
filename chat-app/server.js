import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

// Use cors middleware and specify the allowed origins
app.use(cors({
    origin: '*'
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('new_message', (message) => {
        // Broadcast the message to all connected clients, excluding the sender
        socket.broadcast.emit('broadcast_message', message);

        // If you also want to broadcast back to the sender, use the line below
        // io.emit('broadcast_message', message);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
