import React from 'react'

function btnClick() {
  document.getElementById("JoinButton").addEventListener("click", function () {
    // Get the room code and player name from the input fields
    var roomCode = document.getElementById("RoomCode").value;
    console.log('roomCode: ', roomCode);
    var playerName = document.getElementById("PlayerName").value;
    console.log('playerName: ', playerName);

    // Create a WebSocket connection
    var socket = new WebSocket("ws://your-websocket-server-url/" + roomCode);

    // Handle connection open event
    socket.onopen = function (event) {
         //Add the player name to the list
        var playerList = document.getElementById("PlayerList");
        var listItem = document.createElement("li");
        listItem.textContent = playerName;
        playerList.appendChild(listItem);
    };

     //Handle connection errors
    socket.onerror = function (error) {
        console.error("WebSocket Error: ", error);
        alert("Failed to connect to the room. Please check the room code and try again.");
    };
});
}

function ClientLobby() {
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