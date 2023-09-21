import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContext } from './data/socketContent';

const SERVER_HOST = "http://localhost:5000";

function Multiplayer() {
    const socket = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        // On Load
        socket.current = io(SERVER_HOST);
        navigate('choice');
    }, []);

  return (
    <SocketContext.Provider value={socket.current}>
        <Outlet/>
    </SocketContext.Provider>
  )
}

export default Multiplayer;