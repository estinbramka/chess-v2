import { useRef, useState } from 'react';
import './piece-styles.css'
import { setPiecePos, calculateMove, getIndexPos } from '../../function/calculate-position';

export default function Piece({ piece, parent, pov, makeMove, chess, user, game }) {
    const pieceElm = useRef();
    const [activePiece, setActivePiece] = useState(false);
    const [possibleMoves, setPossibleMoves] = useState([]);

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        pieceElm.current.focus();
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

        let pos = getIndexPos(parent.current, e.clientX, e.clientY);
        //console.log(pos, pieceElm.current.className.split(' ').includes('square-' + pos.x + pos.y));
        if (pieceElm.current.className.split(' ').includes('square-' + pos.x + pos.y) && pieceElm.current === document.activeElement && activePiece) {
            pieceElm.current.blur();
            setActivePiece(true);
        }
        if (pieceElm.current.className.split(' ').includes('square-' + pos.x + pos.y)) {
            setActivePiece((activePiece) => !activePiece);
        } else {
            setActivePiece(true);
        }

        calculateMove(pieceElm.current, piece, parent.current, e.clientX, e.clientY, pov, makeMove);
    }

    function focusActiveElement(e) {
        const prevTurn = chess.turn();
        if (
            (prevTurn === "b" && user.id !== game.black?.id) ||
            (prevTurn === "w" && user.id !== game.white?.id)
        ) {
            setPossibleMoves([]);
            return;
        }
        let yAxis = Array.from({ length: 8 }, (_, i) => (i + 1));
        let xAxis = Array.from('abcdefgh');
        if (pov === 'black') {
            yAxis = yAxis.reverse();
            xAxis = xAxis.reverse();
        }
        let xPrev = parseInt(Array.from(piece.pos)[0]);
        let yPrev = parseInt(Array.from(piece.pos)[1]);
        let from = xAxis[xPrev - 1] + yAxis[yPrev - 1];

        //let pm = chess.moves({ square: from, verbose: true }).map(x => x.to);
        let moves = chess.moves({ square: from, verbose: true });
        const key = 'to';
        const arrayUniqueByKey = [...new Map(moves.map(item => [item[key], item])).values()];
        let pm = arrayUniqueByKey.map(x => x.to);
        let capture = arrayUniqueByKey.map(x => x.captured !== undefined);
        //console.log(pm, capture, arrayUniqueByKey);
        //pm = [...new Set(pm)];
        for (let i = 0; i < pm.length; i++) {
            let x = xAxis.indexOf(pm[i][0]) + 1;
            let y = yAxis.indexOf(parseInt(pm[i][1])) + 1;
            pm[i] = { move: '' + x + y, captured: capture[i] };
        }
        setPossibleMoves(pm);
        //console.log(pm);
    }

    function blurActiveElement(e) {
        setActivePiece(false);
        setPossibleMoves([]);
    }

    function clickPossibleMove(pm) {
        //console.log('click')
        let x = pm.move[0];
        let y = pm.move[1];
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
        makeMove(from, to, piece, pieceElm.current);
    }

    return (
        <>
            {activePiece &&
                <div className={`highlight square-${piece.pos}`}></div>
            }
            <div tabIndex={0} className={`piece ${piece.piece} square-${piece.pos}`} ref={pieceElm}
                onMouseDown={dragMouseDown}
                onFocus={focusActiveElement} onBlur={blurActiveElement}>
            </div>
            {possibleMoves.map(pm => (<div key={"hint-" + pm.move} className={"square-" + pm.move + `${pm.captured ? " capture-hint" : " hint"}`} onMouseDown={() => clickPossibleMove(pm)}></div>))}
        </>
    );
}