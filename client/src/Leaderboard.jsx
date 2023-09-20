import { useContext, useEffect, useState } from 'react'
import Row from './components/Row'
import { SocketContext } from './data/socketContent';
import { useNavigate, useParams } from 'react-router-dom';

function Leaderboard() {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const {code} = useParams();

    const [playerList, setPlayerList] = useState([])

    useEffect(() => {
        if(!socket){
                navigate('./multiplayer')
                console.log("No socket found")
                return;
            }
    
            socket.emit('connected');
            socket.emit('request-players', {code: code});

            socket.on('room-closed', (data) => {
                alert(data.message)
                navigate("../choice")
            });

            socket.on('player-list', (data => {
                // TODO: add logic to sort the list from highest/lowest player scores
                setPlayerList(data);
            }));

            // return () => {
            //     socket.off('room-closed')
            //     socket.off('player-list')
            //     console.log("Dismounted");
            // }
    }, []);

    function goHome(){
        // TODO: add logic to close the room is host leaves, or leaves room if player leaves
        navigate('multiplayer')
    }

  return (
    <div>
        <h1>Leaderboard</h1>
        <button style={{marginBottom: '40px'}} onClick={goHome}>Home</button>
        <div className='row' style={{ border: '1px solid white', padding: '5px' }}>
            <Row index="Rank" name="Name" score="Score"/>
          
            <div>
              {playerList.map((player, index) => {
                return <Row key={index} index={player.index} name={player.name} score={player.score}/>
              })}
            </div>
          </div>
    </div>
  )
}

export default Leaderboard