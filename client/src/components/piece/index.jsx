import { useRef } from 'react';
import './piece-styles.css'
import { setPiecePos, calculateMove } from '../../function/calculate-position';

export default function Piece({ piece, parent, pov, makeMove, calculatePossibleMoves }) {
    const pieceElm = useRef();

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        let yAxis = Array.from({ length: 8 }, (_, i) => (i + 1));
        let xAxis = Array.from('abcdefgh');
        if (pov === 'black') {
            yAxis = yAxis.reverse();
            xAxis = xAxis.reverse();
        }
        let xPrev = parseInt(Array.from(piece.pos)[0]);
        let yPrev = parseInt(Array.from(piece.pos)[1]);
        let from = xAxis[xPrev - 1] + yAxis[yPrev - 1];
        calculatePossibleMoves(from);
        setPiecePos(pieceElm.current, parent.current, e.clientX, e.clientY);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        setPiecePos(pieceElm.current, parent.current, e.clientX, e.clientY);
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;
        calculateMove(pieceElm.current, piece, parent.current, e.clientX, e.clientY, pov, makeMove);
    }

    return (
        <div className={`piece ${piece.piece} square-${piece.pos}`} ref={pieceElm} onMouseDown={dragMouseDown}>

        </div>
    );
}