import { useRef } from 'react';
import './piece-styles.css'
import { setPiecePos, calculateMove } from '../../function/calculate-position';

export default function Piece({ piece, parent, pov, makeMove }) {
    const pieceElm = useRef();

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

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