import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Multiplayer from './Multiplayer.jsx'
import MultiplayerChoice from './MultiplayerChoice.jsx'
import CreateRoom from './CreateRoom.jsx'
import HostLobby from './HostLobby.jsx'
import PlayerLobby from './PlayerLobby.jsx'
import HostQuiz from './HostQuiz.jsx'
import Leaderboard from './Leaderboard.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App/>}/>
      <Route path='multiplayer' element={<Multiplayer/>}>
          <Route path='choice' element={<MultiplayerChoice/>}/>
            <Route path='host' element={<MultiplayerChoice/>}/>
            <Route path='join' element={<MultiplayerChoice/>}/>
          <Route path='create-room' element={<CreateRoom/>}/>
            <Route path='host-lobby/:code' element={<HostLobby/>}/>
            <Route path='host-quiz/:code' element={<HostQuiz/>}/>
          <Route path='player-lobby' element={<PlayerLobby/>}/>
            {/* TODO: create player-quiz/:code path*/}
          <Route path='leaderboard/:code' element={<Leaderboard/>}/>
      </Route>
    </Routes>
    </BrowserRouter>,
)
