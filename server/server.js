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
let isStarted = false
let interval

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
                hostId: "",
                isStarted: isStarted,
                category: data.category,
                difficulty: data.difficulty,
                numberOfQuestions: data.numberOfQuestions,
                timePerQuestion: data.timePerQuestion,
                playerList: playerList,
                questions: questions
            }
            
            roomSettings.push(settings)
            socket.emit('room-code', settings.code)

        })
    });

    socket.on('join-room', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code && !settings.isStarted) {
                socket.join(data.code);
                io.to(data.code).emit('room-joined', `Joined room ${data.code}. Waiting for host to start the quiz!`)
                
                if (!data.isHost){
                    const player = { 
                        id: data.id, 
                        name: data.name,
                        score: data.score
                    };
                    settings.playerList.push(player)
                    io.to(data.code).emit('update-players', settings.playerList)
                }
                else if (data.isHost){
                    settings.hostId = data.id
                }
                return;
            }
        }

        socket.emit('room-joined', 'Failed to join room')
    });

    socket.on('close-room', (data) => {
        io.to(data.code).emit('room-closed')
        
        const index = roomSettings.findIndex((settings) => settings.code === data.code);

        if (index !== -1) {
            roomSettings.splice(index, 1);
        }
    
        socket.leave(data.code);
    });

    socket.on('leave-room', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                const index = settings.playerList.findIndex((player) => player.id === data.id);

                if (index !== -1) {
                    settings.playerList.splice(index, 1);
                    io.to(data.code).emit('update-players', settings.playerList);
                    socket.leave(data.code)
                }
                return;
            }
        }
    });

    socket.on('start-quiz', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                settings.isStarted = true
                io.to(data.code).emit('quiz-start', {
                    message: "Quiz started by Host",
                    code: data.code
                })
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
                    playerCount: settings.playerList.length
                })
                return;
            }
        }  
    })

    socket.on('player-answered', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                io.to(data.code).emit('update-answered')
                return;
            }
        }  
    })

    socket.on('start-timer', (data) => {
        clearInterval(interval)
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                countdown(settings.timePerQuestion, data.code)
                return;
            }
        }
    })

    socket.on('start-next-question', (data) => {
        io.to(data.code).emit('next-question')
    })

    socket.on('quiz-finished', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                io.to(data.code).emit('nav-leaderboard')
                return;
            }
        }
    })

    socket.on('request-players', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                io.to(data.code).emit('player-list', settings.playerList)
                return;
            }
        }  
    })

    socket.on('request-hostId', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                io.to(data.code).emit('host-id', settings.hostId)
                return;
            }
        } 
    })

    socket.on('score-increase', (data) => {
        for (const settings of roomSettings) {
            if (settings.code === data.code) {
                const index = settings.playerList.findIndex((player) => player.id === data.id);

                if (index !== -1) {
                    settings.playerList[index].score++;
                }
                return;
            }
        }
    })
});

function countdown(timeLeft, code) {
    interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        io.to(code).emit('time-up');
      } else {
        timeLeft--;
      }
    }, 1000);
  }