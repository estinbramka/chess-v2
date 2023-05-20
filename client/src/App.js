import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
//import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  const [gameID, setGameID] = useState('20');
  return (
    <Routes>
      <Route path='/' element={<Game gameID={gameID}></Game>} />
      <Route path='/login' element={<Login></Login>} />
      <Route path='/home' element={<Home gameID={gameID} setGameID={setGameID}></Home>} />
    </Routes>
  );
}

export default App;
