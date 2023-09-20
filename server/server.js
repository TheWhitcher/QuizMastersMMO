const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const shortid = require('shortid');
const { default: axios } = require('axios');


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

let questions = [];
let roomSettings = [];
let playerList = [];
let playerIndex = 0;
let isStarted = false
const API_URL = "https://opentdb.com/api.php"

io.on('connection', (socket) => {
    socket.on('connected', () => {
        console.log('socket: ', socket.id);
    });

    socket.on('room-created', (data) => {
        const url = `${API_URL}?amount=${data.numberOfQuestions}&category=${data.category}&difficulty=${data.difficulty}`

        axios.get(url).then(function (response) {
            questions = response.data.results
            
            const settings = {
                code: shortid.generate(),
                isStarted: isStarted,
                category: data.category,
                difficulty: data.difficulty,
                numberOfQuestions: data.numberOfQuestions,
                timePerQuestion: data.timePerQuestion,
                playerList: playerList,
                playerIndex: playerIndex,
                questions: questions
            }
            
            roomSettings.push(settings)
            socket.emit('room-code', settings.code)
            console.log(roomSettings)

        })
    });

    socket.on('join-room', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code && !settings.isStarted) {
                socket.join(data.code);
                io.to(data.code).emit('room-joined', `Joined room ${data.code}`)
                
                if (!data.isHost){
                    console.log('player joined')
                    settings.playerIndex++
                    const player = { name: data.name, index: settings.playerIndex};
                    settings.playerList.push(player)
                    io.to(data.code).emit('update-players', playerList)
                }
                return;
            }
        }

        socket.emit('room-joined', 'Failed to join room')
    });

    socket.on('close-room', (code) => {
        io.to(code).emit('room-closed', {
            message: "Room closed by Host",
            code: code
        })
        
        socket.leave(code)
        for (const settings of roomSettings) {
            if (settings.code === code) {
                roomSettings.splice(settings)
                return;
            }
        }
    });

    socket.on('leave-room', (code) => {
        socket.leave(code)
    });

    socket.on('start-quiz', (code) => {
        for (const settings of roomSettings) {
            if (settings.code === code) {
                settings.isStarted = true
                io.to(code).emit('quiz-start', "Quiz started by Host")
            }
            return;
        }
    });

    socket.on('request-questions', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                io.to(data.code).emit('quiz-questions', {
                    questions: settings.questions,
                    numberOfQuestions: settings.numberOfQuestions,
                    timePerQuestion: settings.timePerQuestion,
                    playerCount: playerList.length
                })
                return;
            }
        }  
    })

    socket.on('player-answered', (data) => {
        // TODO:
    })

    socket.on('start-timer', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                countdown(settings.timePerQuestion, data.code)
                return;
            }
        }
    })
});

function countdown(timeLeft, code) {
    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        io.to(code).emit('time-up'); // Emit signal to clients in the room when time runs out
      } else {
        timeLeft--;
      }
    }, 1000);
  }