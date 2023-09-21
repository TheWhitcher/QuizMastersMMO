import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { SocketContext } from './data/socketContent';
import ScrollableList from './components/PlayerList';
import { useNavigate } from 'react-router-dom';


function ClientLobby() {
  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  
  const [playerList, setPlayerList] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("Enter the code and your name to join a room!");
  const [isInRoom, setIsInRoom] = useState(false);
  const [leaveButton, setLeaveButton] = useState('Return');

  useEffect(() => {
    if(!socket){
      navigate('./multiplayer')
      return;
    }

    socket.emit('connected', "Success")

    socket.on('room-closed', () => {
      socket.emit('leave-room', {code: roomCode, id: socket.id});
      setPlayerList([])
      setIsInRoom(false);
      setLeaveButton('Return')
      setMessage("Enter the code and your name to join a room!");
    });

    socket.on('room-joined', (data) => {
      setMessage(data);
      setIsInRoom(true)
      setLeaveButton('Leave');
    })

    socket.on('quiz-start', (data) => {
      navigate(`../player-quiz/${data.code}`)
    });

    socket.on('update-players', (data) => {
      setPlayerList(data)
    })

    return () => {
      socket.off('room-closed')
      socket.off('room-joined')
      socket.off('quiz-start')
      socket.off('update-players')
    }
  },[])

  const handleCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  function joinRoom() {
      // Get the room code and player name from the input fields
      let playerName = document.getElementById("PlayerName").value;
      
      if (!roomCode || !playerName) {
        //alert("Please enter both the Room Code and Player Name.");
        return; // Exit the function without creating a WebSocket connection
      }
      
      const playerInfo = {
      code: roomCode,
      name: playerName,
      id: socket.id,
      score: 0,
      isHost: false
    }
    
    socket.emit('join-room', playerInfo)
  }
  
  function leaveRoom() {
    
    if (isInRoom){
      //Close the socket connection
      socket.emit('leave-room', {code: roomCode, id: socket.id});
      setMessage("Enter the code and your name to join a room!");
      setPlayerList([]);
      setIsInRoom(false);
      setLeaveButton('Return')
    }else{
      navigate('../choice')
    }
  }

  return (
  <div>
    <h1>Quiz Lobby</h1>
    <h4 style={{margin: '0px'}}>{message}</h4>
    <div className= "row">
      {/* Text imput for the room code */}
      <input type='text' placeholder='Code' id='RoomCode' onChange={handleCodeChange} style={{marginBlock: '10px'}}></input>
    </div>

    <div className= "row">
      {/* Text imput for the player name */}
      <input type='text' placeholder='Name' id='PlayerName'></input>
    </div>

    <div className= "row" style={{marginBlock: '20px'}}>
      {/* Button to join the room */}
      <button id='JoinButton' onClick={joinRoom} disabled={isInRoom} style={{marginInlineEnd: '20px'}}>Join</button>
      {/* Button to leave the room*/}
      <button id='LeaveButton' onClick={leaveRoom}>{leaveButton}</button>
    </div>

    <div className='row' style={{ border: '1px solid white', padding: '5px' }}>
        <h3 style={{ margin: '0px'}}><u>PLAYERS</u></h3>
        
        <div>
          {playerList.map((player, index) => {
            return <ScrollableList key={index} value={player.index} name={player.name}/>
          })}
        </div>
      </div>
    </div>
  )
}
export default ClientLobby