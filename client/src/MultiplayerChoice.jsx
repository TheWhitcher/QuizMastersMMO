import React, { useContext, useEffect } from 'react'
import { SocketConext } from './data/socketContent'
import { Navigate, useNavigate } from 'react-router-dom'

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
            navigate('/multiplayer')
            console.log("No socket found")
        }
    },[])

    return (
        <div>
            <button>Host</button>
            <button>Join</button>
        </div>
    )
}

export default MultiplayerChoice