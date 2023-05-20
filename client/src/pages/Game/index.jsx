import Chessboard from '../../components/chessboard'
import Navbar from '../../components/navbar';
import './Game-styles.css';

export default function Game({ gameID }) {

    return (
        <div className='game'>
            <Navbar></Navbar>
            <Chessboard gameID={gameID}></Chessboard>
        </div>
    );
}