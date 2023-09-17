import React, { useContext, useEffect, useState } from 'react'
import { SocketConext } from './data/socketContent';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
    const socket = useContext(SocketConext)
    const navigate = useNavigate();

    const [quizDifficulty, setDifficulty] = useState('Easy');
    const [catagory, setCatagory] = useState('Yes');
    const [numberOfQuestions, setNumberOfQuestion] = useState(1);
    const [timerPerQuestion, setTimePerQuestion] = useState(15);

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleCatagoryChange = (event) => {
        setCatagory(event.target.value);
    }

    const handleNumberChange = (event) => {
        const id = event.target.id
        const min = event.target.min
        const max = event.target.max
        var value = parseInt(event.target.value)
        
        if (value < min || isNaN(value)) {
            value = min
        }
        else if (value > max) {
            value = max
        }
        
        if (id === "quizSize"){
            setNumberOfQuestion(value)
            return
        }
        else if (id === "questionTime"){
            setTimePerQuestion(value)
            return
        }
    }

    useEffect(() => {
        //On Load

    },[]);

    function roomCreation(){
        const roomSettings = {
            catagory: catagory,
            difficulty: quizDifficulty,
            numberOfQuestions: numberOfQuestions,
            timerPerQuestion: timerPerQuestion,
        }

        console.log(roomSettings)
        socket.emit('room-created', roomSettings)
        socket.on('room-code', roomCode => {
            console.log('Received room code: ', roomCode)
            
            socket.emit('join-room', roomCode)
            socket.on(roomCode, data => {
                console.log(data)
            })
            navigate(`../host-lobby?code=${roomCode}`);
        })
    }

    return (
        <div>
            <h1>Create Room</h1>
            <div className="container">
                <div className='row' style={{ margin: '10px' }}>
                <label>Catagory: </label>
                <select defaultValue="Maybe" name="catagory" id="catagory" onChange={handleCatagoryChange}>
                    <option id='Yes'>Yes</option>
                    <option id='No'>No</option>
                    <option id='Maybe'>Maybe</option>
                </select>
                </div>
                
                <div className="row" style={{ margin: '10px' }}>
                    <label>Difficulty: </label>
                    <input type="radio" id="easy" value="Easy" checked={quizDifficulty === 'Easy'} onChange={handleDifficultyChange}/>
                    <label htmlFor="html">Easy</label>
                    <input type="radio" id="medium" value="Medium" checked={quizDifficulty === 'Medium'} onChange={handleDifficultyChange}/>
                    <label htmlFor="hard">Medium</label>
                    <input type="radio" id="hard" value="Hard" checked={quizDifficulty === 'Hard'} onChange={handleDifficultyChange}/>
                    <label >Hard</label>
                </div>

                <div className="row" style={{ margin: '10px' }}>
                    <label>Number of Questions: </label>
                    <input type="number" id="quizSize" defaultValue={1} min={1} max={99} onChange={handleNumberChange}></input>
                </div>

                <div className="row" style={{ margin: '10px' }}>
                    <label>Timer per Question (seconds): </label>
                    <input type="number" id="questionTime" defaultValue={15} step={15} min={15} max={999} onChange={handleNumberChange}></input>
                </div>

                <div className="row" style={{ margin: '20px' }}>
                    <button onClick={roomCreation}>Create Room</button>
                </div>
            </div>
        </div>
    )
}

export default CreateRoom