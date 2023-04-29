import Piece from '../piece';
import './chessboard-styles.css'
import { createBoard } from '../../function/create-board';
import { useRef } from 'react';

export default function Chessboard() {
    let activepiece;
    const boardelm = useRef();
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        const elmnt = e.target;
        if (!elmnt.classList.contains('piece')) {
            return;
        }
        let bounds = boardelm.current.getBoundingClientRect();
        let elmntDim = elmnt.getBoundingClientRect();
        let x = e.clientX - bounds.left - (elmntDim.width / 2);
        let y = e.clientY - bounds.top - (elmntDim.height / 2);
        elmnt.style.transform = 'none';
        elmnt.style.left = x + 'px';
        elmnt.style.top = y + 'px';
        activepiece = elmnt;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        const elmnt = activepiece;
        if (!elmnt.classList.contains('piece')) {
            return;
        }
        let bounds = boardelm.current.getBoundingClientRect();
        let elmntDim = elmnt.getBoundingClientRect();
        let x = e.clientX - bounds.left - (elmntDim.width / 2);
        let y = e.clientY - bounds.top - (elmntDim.height / 2);
        elmnt.style.transform = 'none';
        elmnt.style.left = x + 'px';
        elmnt.style.top = y + 'px';
    }

    function closeDragElement(e) {
        let bounds = boardelm.current.getBoundingClientRect();
        let x = (e.clientX - bounds.left) / bounds.height;
        let y = (e.clientY - bounds.top) / bounds.height;
        let indexY = 0;
        for (let i = 1; i <= 8; i++) {
            if (y < i / 8 && y > (i - 1) / 8) {
                indexY = i;
            }
        }
        indexY = Array.from({ length: 8 }, (_, i) => (i + 1)).reverse()[indexY-1];
        let indexX = 0;
        for (let i = 1; i <= 8; i++) {
            if (x < i / 8 && x > (i - 1) / 8) {
                indexX = i;
            }
        }
        activepiece.removeAttribute("style");
        var el = activepiece;
        for (let i = el.classList.length - 1; i >= 0; i--) {
            const className = el.classList[i];
            if (className.startsWith('square-')) {
                el.classList.remove(className);
                el.classList.add(`square-${indexX}${indexY}`);
            }
        }

        console.log(indexX, indexY);
        document.onmouseup = null;
        document.onmousemove = null;
    }
    let board = createBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'white');
    return (
        <div className="chessboard" ref={boardelm} onMouseDown={dragMouseDown}>
            {board
                .filter((piece) => (piece.piece !== ''))
                .map((piece) => (
                    <Piece key={piece.pos} piece={piece}></Piece>
                ))}
        </div>
    );
}