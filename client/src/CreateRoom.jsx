import React, { useContext, useEffect, useState } from 'react'
import { SocketConext } from './data/socketContent';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
    const socket = useContext(SocketConext);
    const navigate = useNavigate();

    const [quizDifficulty, setDifficulty] = useState('Easy');
    const [catagory, setCatagory] = useState('Yes');
    const [numberOfQuestions, setNumberOfQuestion] = useState(1);
    const [timerPerQuestion, setTimePerQuestion] = useState(15);

    //On Load
    useEffect(() => {
        if(socket){
            socket.emit('connected', "Success")
        }
        else{
            navigate('./multiplayer')
            console.log("No socket found")
        }
    },[])

    // On Socket change
    useEffect(() => {
        socket.on('room-code', roomCode => {            
            alert("Room created moving to lobby")
            navigate(`../host-lobby/${roomCode}`);
        })
    }, [socket]);

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleCatagoryChange = (event) => {
        setCatagory(event.target.value);
    }

    const handleNumberChange = (event) => {
        const id = event.target.id;
        const min = event.target.min;
        const max = event.target.max;
        let value = parseInt(event.target.value);
        
        if (value < min || isNaN(value)) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        
        if (id === "quizSize"){
            setNumberOfQuestion(value);
            return;
        }
        else if (id === "questionTime"){
            setTimePerQuestion(value);
            return;
        }
    }

    function returnHome(){
        navigate("../choice");
    }

    function roomCreation(){
        const roomSettings = {
            catagory: catagory,
            difficulty: quizDifficulty,
            numberOfQuestions: numberOfQuestions,
            timerPerQuestion: timerPerQuestion,
        }

        socket.emit('room-created', roomSettings)
    }

    return (
        <div>
            <h1>Create Room</h1>
            <div className="container">
                <div className='row' style={{ margin: '10px' }}>
                <label>Catagory: </label>
                <select defaultValue="31" name="catagory" id="catagory" onChange={handleCatagoryChange}>
                    <option id='anime-and-manga' value='31'>Anime & Manga</option>
                    <option id='video-games' value='15'>Video Games</option>
                    <option id='music' value='12'>Music</option>
                    <option id='science-and-computers' value='18'>Science and Computers</option>
                    <option id='animals' value='27'>Animals</option>
                </select>
                </div>
                
                <div className="row" style={{ margin: '10px' }}>
                    <label>Difficulty: </label>

                    <input type="radio" id="easy" value="Easy" checked={quizDifficulty === 'Easy'} onChange={handleDifficultyChange}/>
                    <label htmlFor="easy" style={{marginInlineEnd: '10px'}}>Easy</label>

                    <input type="radio" id="medium" value="Medium" checked={quizDifficulty === 'Medium'} onChange={handleDifficultyChange}/>
                    <label htmlFor="medium" style={{marginInlineEnd: '10px'}}>Medium</label>

                    <input type="radio" id="hard" value="Hard" checked={quizDifficulty === 'Hard'} onChange={handleDifficultyChange}/>
                    <label htmlFor="hard" style={{marginInlineEnd: '10px'}}>Hard</label>
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
                    <button onClick={roomCreation} style={{marginInlineEnd: '20px'}}>Create Room</button>
                    <button onClick={returnHome}>Return</button>
                </div>
            </div>
        </div>
    )
}

export default CreateRoom