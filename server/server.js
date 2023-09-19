const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const shortid = require('shortid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    }
});

app.use(cors());

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

let roomSettings = [];
let playerList = [];
let playerIndex = 0;

io.on('connection', (socket) => {
    socket.on('connected', (data) => {
        console.log('Connection: ', data);
        console.log('socket: ', socket.id);

    });

    // TODO Make api call to get question list.
    socket.on('room-created', (data) => {
        console.log('Room Created! Room info: ', data);

        const settings = {
            code: shortid.generate(),
            category: data.category,
            difficulty: data.difficulty,
            numberOfQuestions: data.numberOfQuestions,
            timePerQuestion: data.timePerQuestion
        }
        
        roomSettings.push(settings)
        socket.emit('room-code', settings.code)
    });

    socket.on('join-room', (data) => {
        console.log('Joining room: ', data);

        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                socket.join(data.code);
                io.to(data.code).emit('room-joined', `Joined room ${data.code}`)
                
                if (!data.isHost){
                    console.log('player joined')
                    playerIndex++
                    const player = { name: data.name, index: playerIndex};
                    playerList.push(player)
                    io.to(data.code).emit('update-players', playerList)
                }
                return;
            }
        }  

        console.log('failed to join')
        io.to(data.code).emit('room-joined', 'Failed to join room')
      });

    socket.on('close-room', (code) => {
        console.log(`room ${code} closing...`)

        io.to(code).emit('room-closed', {
            message: "Room closed by Host",
            code: code
        })
        playerList = []
        socket.leave(code)

        console.log(`Room ${code} closed.`);
    });

    socket.on('leave-room', (code) => {
        socket.leave(code)
    })

    socket.on('start-quiz', (code) => {
        console.log(`room ${code} starting...`)
        io.to(code).emit('quiz-start', "Quiz started by Host")
    });
});