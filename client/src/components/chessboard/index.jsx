import Piece from '../piece';
import './chessboard-styles.css'
import { createBoard } from '../../function/create-board';
import { useEffect, useRef, useState } from 'react';

export default function Chessboard() {
    const [pov, setPov] = useState('black');
    const [board, setBoard] = useState(createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', pov))
    useEffect(() => {
        setBoard(createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', pov))
    }, [pov])
    const boardElm = useRef();
    return (
        <div className='chessboard-layout'>
            <div className="chessboard" ref={boardElm}>
                {board
                    .filter((piece) => (piece.piece !== ''))
                    .map((piece) => (
                        <Piece key={piece.pos} piece={piece} parent={boardElm} pov={pov}></Piece>
                    ))}
            </div>
            <div className='chessboard-sidebar'>
                <button className='pov-button' onClick={() => pov === 'white' ? setPov('black') : setPov('white')}>Pov</button>
            </div>
        </div>
    );
}