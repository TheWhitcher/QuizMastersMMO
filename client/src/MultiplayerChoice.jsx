import React, { useContext, useEffect } from 'react'
import { SocketConext } from './data/socketContent'
import { useNavigate } from 'react-router-dom'

function MultiplayerChoice() {

    // Use this on every component that emits/listens to WS events
    const socket = useContext(SocketConext)
    const navigate = useNavigate();

    useEffect(() => {
        //On Load
        if(socket){
            socket.emit('reach10', {count: 20})
        }
        else{
            navigate('./multiplayer')
            console.log("No socket found")
        }
    },[])

    function navigateCreate(){
        navigate('../create-room')
    }

    function navigateJoin(){
        navigate('../player-lobby')
    }

    return (
        <div>
        <h1>QUIZ MASTERS MMO!!!!!!!!!</h1>
            <button onClick={navigateCreate}>Host</button>
            <button onClick={navigateCreate}>Join</button>
        </div>
    )
}

export default MultiplayerChoice