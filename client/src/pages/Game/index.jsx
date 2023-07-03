import { useNavigate, useParams } from 'react-router-dom';
import Chessboard from '../../components/chessboard'
import Navbar from '../../components/navbar';
import { fetchGet } from '../../function/fetch';
import './Game-styles.css';
import { useEffect, useState } from 'react';
import MoveHistory from '../../components/moveHistory';
import ChessHeader from '../../components/chessHeader';
import Chat from '../../components/chat';

export default function Game() {
    const navigate = useNavigate();
    const [game, setGame] = useState();
    const [user, setUser] = useState();
    const [historyIndex, setHistoryIndex] = useState(null);
    const { code } = useParams();
    useEffect(() => {
        function handlePopstate() {
            console.log('url changed');
            window.location.reload();
        }

        window.addEventListener("popstate", handlePopstate);

        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, []);
    useEffect(() => {
        if (code === undefined) {
            navigate('/home');
        }
        async function fetchData() {
            const game = await fetchGet(`/games/${code}`);
            const user = await fetchGet('/auth/session');
            if (game.auth === false || user.auth === false) {
                navigate('/home');
            }
            setHistoryIndex(null);
            setGame(game);
            setUser(user.user);
        }
        fetchData();
    }, [code, navigate])

    return (
        <>
            {game &&
                <div className='game'>
                    <Navbar></Navbar>
                    {game.message === undefined ?
                        <div className="main-layout">
                            <Chessboard game={game} user={user} setGame={setGame} historyIndex={historyIndex}></Chessboard>
                            <div className="main-sidebar">
                                <ChessHeader game={game}></ChessHeader>
                                <MoveHistory game={game} historyIndex={historyIndex} setHistoryIndex={setHistoryIndex}></MoveHistory>
                                <Chat user={user}></Chat>
                            </div>
                        </div>
                        :
                        <div className='message'>
                            {game.message}
                        </div>
                    }
                </div>
            }
        </>
    );
}