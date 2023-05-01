import { useRef } from 'react';
import './piece-styles.css'

export default function Piece({ piece, parent, pov, makeMove }) {
    const pieceElm = useRef();

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        const elmnt = pieceElm.current;
        let bounds = parent.current.getBoundingClientRect();
        let elmntDim = elmnt.getBoundingClientRect();
        let x = e.clientX - bounds.left - (elmntDim.width / 2);
        let y = e.clientY - bounds.top - (elmntDim.height / 2);
        elmnt.style.transform = 'none';
        elmnt.style.left = x + 'px';
        elmnt.style.top = y + 'px';
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        const elmnt = pieceElm.current;
        let bounds = parent.current.getBoundingClientRect();
        let elmntDim = elmnt.getBoundingClientRect();
        let x = e.clientX - bounds.left - (elmntDim.width / 2);
        let y = e.clientY - bounds.top - (elmntDim.height / 2);
        let xPer = (e.clientX - bounds.left) / bounds.width;
        let yPer = (e.clientY - bounds.top) / bounds.height;
        if (xPer <= 0) x = - (elmntDim.width / 2);
        if (xPer >= 1) x = bounds.width - (elmntDim.width / 2);
        if (yPer <= 0) y = - (elmntDim.height / 2);
        if (yPer >= 1) y = bounds.height - (elmntDim.height / 2);
        elmnt.style.zIndex = 1;
        elmnt.style.transform = 'none';
        elmnt.style.left = x + 'px';
        elmnt.style.top = y + 'px';
    }

    function closeDragElement(e) {
        let bounds = parent.current.getBoundingClientRect();
        let x = (e.clientX - bounds.left) / bounds.width;
        let y = (e.clientY - bounds.top) / bounds.height;
        if (x <= 0) x = 0;
        if (x >= 1) x = 1;
        if (y <= 0) y = 0;
        if (y >= 1) y = 1;
        let indexY = 0;
        for (let i = 1; i <= 8; i++) {
            if (y <= i / 8 && y >= (i - 1) / 8) {
                indexY = i;
            }
        }
        indexY = Array.from({ length: 8 }, (_, i) => (i + 1)).reverse()[indexY - 1];
        let indexX = 0;
        for (let i = 1; i <= 8; i++) {
            if (x <= i / 8 && x >= (i - 1) / 8) {
                indexX = i;
            }
        }

        document.onmouseup = null;
        document.onmousemove = null;

        calculateMove(indexX, indexY);
        //pieceElm.current.removeAttribute("style");
    }

    function calculateMove(x, y) {
        let yAxis = Array.from({ length: 8 }, (_, i) => (i + 1));
        let xAxis = Array.from('abcdefgh');
        if (pov === 'black') {
            yAxis = yAxis.reverse();
            xAxis = xAxis.reverse();
        }
        let xPrev = parseInt(Array.from(piece.pos)[0]);
        let yPrev = parseInt(Array.from(piece.pos)[1]);
        let from = xAxis[xPrev - 1] + yAxis[yPrev - 1];
        let to = xAxis[x - 1] + yAxis[y - 1];
        let status = makeMove(from, to);
        if (status === 'error') {
            pieceElm.current.removeAttribute("style");
        }
        //console.log(from, to, pov);
    }

    return (
        <div className={`piece ${piece.piece} square-${piece.pos}`} ref={pieceElm} onMouseDown={dragMouseDown}>

        </div>
    );
}