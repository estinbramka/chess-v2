import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import './App.css';
import Chessboard from './components/chessboard';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const [name, setName] = useState('user');
  const [gameID, setGameID] = useState('20');
  return (
    <Routes>
      <Route path='/' element={<div className='App'><Chessboard name={name} gameID={gameID}></Chessboard></div>} />
      <Route path='/login' element={<Login name={name} setName={setName}></Login>} />
      <Route path='/home' element={<Home name={name} gameID={gameID} setGameID={setGameID}></Home>} />
    </Routes>
  );
}

export default App;
