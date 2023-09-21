import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SocketContext } from './data/socketContent'
import ScrollableList from './components/PlayerList';

function HostLobby() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const {code} = useParams();

  const [playerList, setPlayerList] = useState([]);
  const [isNotReady, setIsNotReady] = useState(true);
  const [readyMessage, setReadyMessage] = useState("Waiting for players to join...");

  useEffect(() => {
      if(!socket){
        navigate('./multiplayer')
        return;
      }

      socket.emit('connected', "Success")
      socket.emit('join-room', {code: code, isHost: true, id: socket.id})
  
      socket.on('quiz-start', (data) => {
        navigate(`../host-quiz/${data.code}`)
      })
  
      socket.on('room-closed', () => {
        navigate("../choice")
      })
  
      socket.on('update-players', (data) => {
        setPlayerList(data)
  
        if(data.length > 0){
          setIsNotReady(false)
          setReadyMessage("Click 'Start game' to begin the quiz!")
        }
        else{
          setIsNotReady(true)
          setReadyMessage("Waiting for players to join...")
        }
      })

      return () => {
        socket.off('room-joined')
        socket.off('quiz-start')
        socket.off('update-players')
      }
  });

  function startQuiz(){
    socket.emit('start-quiz', {code: code})
  }

  function closeRoom(){
    socket.emit('close-room', {code: code})
  }

  return (
    <div>
        <h2>Host Lobby</h2>
        <div className='container'>
          <div className='row' style={{ margin: '1px', border: '5px solid white', padding: '5px' }}>
            <h2 style={{ margin: '0px'}}><u>CODE</u></h2>
            <h1 value={code}>{code}</h1>
          </div>

          <h3 style={{ marginTop: '50px' }}>{readyMessage}</h3>

          <div className="row" style={{ margin: '20px' }}>
            <button onClick={startQuiz} disabled={isNotReady} style={{marginInlineEnd: '20px'}}>Start Game</button>
            <button onClick={closeRoom}>Close Room</button>
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
    </div>
  )
}

export default HostLobby