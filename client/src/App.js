import { Route, Routes } from 'react-router-dom'
//import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  return (
    <Routes>
      <Route path='/:code?' element={<Game></Game>} />
      <Route path='/login' element={<Login></Login>} />
      <Route path='/home' element={<Home></Home>} />
    </Routes>
  );
}

export default App;
