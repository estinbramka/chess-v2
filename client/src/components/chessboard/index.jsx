import Piece from '../piece';
import './chessboard-styles.css'
import { createBoard } from '../../function/create-board';
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js'
import { socket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from '../../function/fetch';

const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export default function Chessboard({ game }) {
    const [fen, setFen] = useState(FEN);
    const { current: chess } = useRef(new Chess(fen));
    const [pov, setPov] = useState('white');
    const [board, setBoard] = useState(createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', pov))
    const navigate = useNavigate();
    const countConnections = useRef(0);
    useEffect(() => {
        setBoard(createBoard(fen, pov));
    }, [fen, pov])
    const boardElm = useRef();
    useEffect(() => {
        //console.log(name, gameID);
        socket.connect();
        socket.emit('joinLobby', game.code);
        console.log('join');

        function receivedLatestGame(game) {
            console.log(game);
            chess.loadPgn(game.pgn);
            setFen(chess.fen());
        }
        function userJoinedAsPlayer({ name, side }) {
            console.log({ name, side });
        }
        function receivedMove({ from, to }) {
            chess.move({ from, to });
            setFen(chess.fen());
        }
        function message({ message }) {
            console.log(message);
        }
        async function connectError(message) {
            //setTimeout(async () => {
            countConnections.current++;
            if (countConnections.current > 2) {
                countConnections.current = 0;
                navigate('/home');
            } else {
                let RTresult = await refreshToken()
                if (RTresult.auth) {
                    window.localStorage.setItem('Token', RTresult.accessToken);
                }
                socket.auth.token = window.localStorage.getItem('Token');
                socket.connect();
                console.log('try to connect');
            }
            //}, 100);
        }

        socket.on('receivedLatestGame', receivedLatestGame);
        socket.on('userJoinedAsPlayer', userJoinedAsPlayer);
        socket.on('receivedMove', receivedMove);
        socket.on('message', message);
        socket.on('connect_error', connectError);

        return () => {
            socket.off('receivedLatestGame', receivedLatestGame);
            socket.off('userJoinedAsPlayer', userJoinedAsPlayer);
            socket.off('receivedMove', receivedMove);
            socket.off('message', message);
            socket.off('connect_error', connectError);
            socket.disconnect();
            console.log('disconect');
        };
    }, [chess, game.code, navigate]);

    function makeMove(from, to, promotion) {
        console.log(from, to);
        try {
            chess.move({ from, to });
        } catch (error) {
            //console.log(error);
            return 'error';
        }
        setFen(chess.fen());
        socket.emit('sendMove', { from, to, promotion });
        return 'success';
    }

    return (
        <div className='chessboard-layout'>
            <div className="chessboard" ref={boardElm}>
                {board
                    .filter((piece) => (piece.piece !== ''))
                    .map((piece) => (<Piece key={piece.pos} piece={piece} parent={boardElm} pov={pov} makeMove={makeMove}></Piece>))
                }
            </div>
            <div className='chessboard-sidebar'>
                <button className='pov-button' onClick={() => pov === 'white' ? setPov('black') : setPov('white')}>Pov</button>
            </div>
        </div>
    );
}