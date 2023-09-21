import { useContext, useEffect, useState } from 'react'
import Row from './components/Row'
import { SocketContext } from './data/socketContent';
import { useNavigate, useParams } from 'react-router-dom';

function Leaderboard() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const {code} = useParams();

    const [playerList, setPlayerList] = useState([])
    const [hostId, setHostId] = useState("");

    useEffect(() => {
        if(!socket){
              navigate('./multiplayer')
              return;
            }
    
            socket.emit('connected');
            socket.emit('request-players', {code: code});
            socket.emit('request-hostId', {code: code});

            socket.on('room-closed', () => {
              navigate("../choice")
            });

            socket.on('player-list', (data) => {
              data.sort((a, b) => b.score - a.score);
              setPlayerList(data);
            });

            socket.on('host-id', (data) => {
              setHostId(data);
            })

            return () => {
              socket.off('room-closed')
              socket.off('player-list')
              socket.off('host-id')
            }
    }, []);

    function goHome(){
      if (socket.id === hostId){
        socket.emit('close-room', {code: code})
      }
      else {
        socket.emit('leave-room', {code: code, id: socket.id});
        navigate('../choice')
      }
    }

  return (
    <div>
        <h1>Leaderboard</h1>
        <button style={{marginBottom: '40px'}} onClick={goHome}>Home</button>
        <div className='row' style={{ border: '1px solid white', padding: '5px' }}>
            <Row index="Rank" name="Name" score="Score"/>
          
            <div>
              {playerList.map((player, index) => {
                return <Row key={index} index={index + 1} name={player.name} score={player.score}/>
              })}
            </div>
          </div>
    </div>
  )
}

export default Leaderboard