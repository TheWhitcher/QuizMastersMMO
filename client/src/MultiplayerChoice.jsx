import React, { useContext, useEffect } from 'react'
import { SocketConext } from './data/socketContent'
import { useNavigate } from 'react-router-dom'

function MultiplayerChoice() {

    // Use this on every component that emits/listens to WS events
    const socket = useContext(SocketConext)
    const navigate = useNavigate();

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

    function navigateCreate(){
        navigate('../create-room')
    }

    function navigateJoin(){
        navigate('../player-lobby')
    }

    return (
        <div>
            <div className='contianer'>
                <div className='row'>
                    <h1 style={{margin: '0px'}}>Join The Room Game!<br/>WOOOOOOOOOAAAAAHHHHH</h1>
                    <h5>Made By: Christophe Landry & Zacharyah Whitcher</h5>
                </div>

                <div className='row'>
                    <button onClick={navigateCreate} style={{marginInlineEnd: '20px'}}>Host</button>
                    <button onClick={navigateJoin}>Join</button>
                </div>
            </div>
        </div>
    )
}

export default MultiplayerChoice