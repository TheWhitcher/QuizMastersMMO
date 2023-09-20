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
      console.log("No socket found")
      return;
    }

    socket.emit('connected', "Success")

    socket.on('room-closed', (data) => {
      socket.emit('leave-room', data.code)
      setMessage("Enter the code and your name to join a room!");
      //alert(data.message);
    });

    socket.on('room-joined', (data) => {
      setMessage(data);
      setIsInRoom(true)
      setLeaveButton('Leave');
    })

    socket.on('quiz-start', (data) => {
      //alert(data.message);
      navigate(`../player-quiz/${data.code}`)
    });

    socket.on('update-players', (data) => {
      setPlayerList(data)
      console.log(data)
    })

    return () => {
      socket.off('room-closed')
      socket.off('room-joined')
      socket.off('quiz-start')
      socket.off('update-players')
      console.log("Dismounted Player Lobby");
    }
  },[])

  const handleCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  function joinRoom() {
      // Get the room code and player name from the input fields
      let playerName = document.getElementById("PlayerName").value;
      console.log('playerName: ', playerName);
      
      if (!roomCode || !playerName) {
        //alert("Please enter both the Room Code and Player Name.");
        return; // Exit the function without creating a WebSocket connection
      }
      
      const playerInfo = {
      code: roomCode,
      name: playerName,
      score: 0
    }
    
    socket.emit('join-room', playerInfo)
    
    //Handle connection errors
    socket.onerror = function (error) {
      console.error("WebSocket Error: ", error);
      //alert("Failed to connect to the room. Please check the room code and try again.");
    };
  }
  
  function leaveRoom() {
    
    if (isInRoom){
      //Close the socket connection
      socket.emit('leave-room', {code: roomCode});
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