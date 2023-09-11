import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Multiplayer from './Multiplayer.jsx'
import MultiplayerChoice from './MultiplayerChoice.jsx'
import CreateRoom from './CreateRoom.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route index element={<App/>}/>
        <Route path='multiplayer' element={<Multiplayer/>}>
            <Route path='choice' element={<MultiplayerChoice/>}/>
              <Route path='host' element={<MultiplayerChoice/>}/>
              <Route path='join' element={<MultiplayerChoice/>}/>
            <Route path='create-room' element={<CreateRoom/>}/>
        </Route>
      </Routes>
    </BrowserRouter>,
)
