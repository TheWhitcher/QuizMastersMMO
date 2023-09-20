import React from 'react'
import { useContext } from 'react'
import { SocketContext } from './data/socketContent';


function ClientLobby() {
  let inRoom = false;
  const socket = useContext(SocketContext)

  function btnClick() {

    // Get the room code and player name from the input fields
    let roomCode = document.getElementById("RoomCode").value;
    console.log('roomCode: ', roomCode);
    let playerName = document.getElementById("PlayerName").value;
    console.log('playerName: ', playerName);
    console.log('inRoom: ', inRoom);

    if (!roomCode || !playerName) {
      alert("Please enter both the Room Code and Player Name.");
      return; // Exit the function without creating a WebSocket connection
    }

    const playerInfo = {
      code: roomCode,
      name: playerName,
      score: 0
    }

    socket.emit('join-room', playerInfo)

    socket.on('room-closed', (data) => {
      socket.emit('leave-room', data.code)
      alert(data.message);
    })
    
    //Change once sockets works
    inRoom = true;
    //var socket = new WebSocket('../player-lobby?code=' + roomCode);

    // Handle connection open event
    socket.onopen = function (event) {
         //Add the player name to the list
        let playerList = document.getElementById("PlayerList");
        let listItem = document.createElement("li");
        inRoom = true;
        listItem.textContent = playerName;
        playerList.appendChild(listItem);
    };

     //Handle connection errors
    socket.onerror = function (error) {
        console.error("WebSocket Error: ", error);
        alert("Failed to connect to the room. Please check the room code and try again.");
    };
  }

  function btnLeave() {

    if (inRoom === true){
      inRoom = false;
      //Close the socket connection
      socket.close();
    }else{
      alert("You are not in a room");
    }
  }

  return (
    <div><h1>ClientLobby</h1>
      <div className= "row">
                {/* Text imput for the room code */}
        <input type='text' placeholder='Code' id='RoomCode'></input>
      </div>

      <div className= "row">
                {/* Text imput for the player name */}
        <input type='text' placeholder='Name' id='PlayerName'></input>
      </div>

      <div className= "row">
                {/* Button to join the room */}
        <button id='JoinButton' onClick={btnClick}>Join</button>
                {/* Button to leave the room*/}
      <button id='LeaveButton' onClick={btnLeave}>Leave</button>
      </div>

      <div className= "row">
                {/* Unordered list of the player in the room */}
        <ul id='PlayerList'>
                  {/* List item for each player in the room */}
        </ul>
      </div>
    </div>
  )
}
export default ClientLobby