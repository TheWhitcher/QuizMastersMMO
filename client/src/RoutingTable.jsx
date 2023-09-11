

<BrowserRouter>
      <Routes>
        <Route index element={<Welcome />}/>
        <Route path='multiplayer' element={<Multiplayer/>}>
            <Route path='choice' element={<MultiplayerChoice/>}/>
        </Route>
 
      </Routes>
    </BrowserRouter>