import Piece from '../piece';
import './chessboard-styles.css'
import { createBoard } from '../../function/create-board';
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js'
import { socket } from '../../socket';

const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export default function Chessboard({ name, gameID }) {
    const [fen, setFen] = useState(FEN);
    const { current: chess } = useRef(new Chess(fen));
    const [pov, setPov] = useState('white');
    const [board, setBoard] = useState(createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', pov))
    useEffect(() => {
        setBoard(createBoard(fen, pov));
    }, [fen, pov])
    const boardElm = useRef();
    useEffect(() => {
        console.log(name, gameID);
        socket.emit('join', { name: name, gameID: gameID }, ({ error, color }) => {
            console.log({ color, error });
        });

        function welcome({ message, opponent }) {
            console.log({ message, opponent });
        }
        function opponentJoin({ message, opponent }) {
            console.log({ message, opponent });
        }
        function opponentMove({ from, to }) {
            chess.move({ from, to });
            setFen(chess.fen());
        }
        function message({ message }) {
            console.log({ message });
        }
        function connectError(message) {
            console.log(message);
        }

        socket.on('welcome', welcome);
        socket.on('opponentJoin', opponentJoin);
        socket.on('opponentMove', opponentMove);
        socket.on('message', message);
        socket.on('connect_error', connectError);

        return () => {
            socket.off('welcome', welcome);
            socket.off('opponentJoin', opponentJoin);
            socket.off('opponentMove', opponentMove);
            socket.off('message', message);
            socket.off('connect_error', connectError);
        };
    }, [chess, name, gameID]);

    function makeMove(from, to) {
        console.log(from, to);
        try {
            chess.move({ from, to });
        } catch (error) {
            //console.log(error);
            return 'error';
        }
        socket.emit('move', { gameID: gameID, from, to });
        setFen(chess.fen());
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