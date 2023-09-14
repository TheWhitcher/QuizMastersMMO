import React, { useContext, useEffect } from 'react'
import { SocketConext } from './data/socketContent';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
    const socket = useContext(SocketConext)
    const navigate = useNavigate();

    useEffect(() => {
        //On Load

    },[]);

    function roomCreation(){
        socket.emit('room-created', {
            genre: "todo",
            difficulty: "todo",
            numberOfQuestions: "todo",
            timerPerQuestion: "todo",
        })
        navigate('../host-lobby')
    }

    return (
        <div>
        <h1>Create Room</h1>
            <button onClick={roomCreation}>Create Room</button>
        </div>
    )
}

export default CreateRoom