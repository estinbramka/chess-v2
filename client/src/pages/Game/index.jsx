import Chessboard from '../../components/chessboard'
import Navbar from '../../components/navbar';
import './Game-styles.css';

export default function Game({ gameID }) {

    return (
        <div className='game'>
            <Navbar></Navbar>
            <div className="main-layout">
                <Chessboard gameID={gameID}></Chessboard>
                <div className="main-sidebar">to do chat and move history</div>
            </div>
        </div>
    );
}