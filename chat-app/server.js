import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Chat } from './chat.scehma.js';
import { connect } from './mongodb.js';

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

    socket.on('join', (userName) => {
        socket.userName = userName;
        Chat.find({}).sort({timestamp: 1}).limit(50)
            .then(messages=>{
                console.log(messages)
                socket.emit('load_previous_messages', messages);
            })
            .catch(err=> console.log(err))
    });

    socket.on('new_message', (message) => {
        let userMessage = {
            userName: socket.userName, // Attach the stored username to the message
            message: message
        };
        const chatMessage = new Chat({
            username: socket.userName,
            message: message,
            timestamp: new Date()
        });
        chatMessage.save();
        // Broadcast the message to all connected clients, excluding the sender
        socket.broadcast.emit('broadcast_message', userMessage);

    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
    connect();
});
