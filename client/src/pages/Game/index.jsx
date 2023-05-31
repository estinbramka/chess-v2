import { useNavigate, useParams } from 'react-router-dom';
import Chessboard from '../../components/chessboard'
import Navbar from '../../components/navbar';
import { fetchGet } from '../../function/fetch';
import './Game-styles.css';
import { useEffect, useState } from 'react';

export default function Game() {
    const navigate = useNavigate();
    const [game, setGame] = useState();
    const [user, setUser] = useState();
    const { code } = useParams();
    //const game = await fetchGet(`/games/${code}`);
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
            setGame(game)
            setUser(user.user)
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
                            <Chessboard game={game} user={user} setGame={setGame}></Chessboard>
                            <div className="main-sidebar">to do chat and move history</div>
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