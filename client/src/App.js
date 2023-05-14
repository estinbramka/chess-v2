import { Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import './App.css';
import Chessboard from './components/chessboard';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/navbar';

function App() {
  const [gameID, setGameID] = useState('20');
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<div className='App'><Chessboard gameID={gameID}></Chessboard></div>} />
        <Route path='/login' element={<Login></Login>} />
        <Route path='/home' element={<Home gameID={gameID} setGameID={setGameID}></Home>} />
      </Routes>
    </>
  );
}

export default App;
