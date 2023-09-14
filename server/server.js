const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    }
});

app.use(cors());

// Set up your other Express middleware and routes here
app.get('/', (req, res) => {
    io.emit('message', 'Hello World!');
    res.send("Ok!");
})

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('socket: ', socket.id);

    socket.on('reach10', data => {
        console.log('data: ', data);
    })

    socket.on('room-created', data => {
        console.log('room info: ', data);
    })
})