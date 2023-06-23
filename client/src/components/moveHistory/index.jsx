import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import './moveHistory-styles.css'

export default function MoveHistory({ game, historyIndex, setHistoryIndex }) {
    const { current: chess } = useRef(new Chess());
    const [history, setHistory] = useState([])
    useEffect(() => {
        chess.loadPgn(game.pgn);
        setHistory(chess.history());
        if (chess.history().length !== 0) {
            setHistoryIndex(chess.history().length - 1);
        }
    }, [game, chess, setHistoryIndex])
    const listHistory = []
    for (let i = 0; i < history.length; i += 2) {
        const move1 = history[i];
        const move2 = history[i + 1]
        listHistory.push(
            <div key={(i + 2) / 2} className="whole-move">
                {(i + 2) / 2}.
                <div onClick={() => setHistoryIndex(i)} className={`move ${i === historyIndex ? 'selected' : ''}`}>{move1}</div>
                <div onClick={() => setHistoryIndex(i + 1)} className={`move ${(i + 1) === historyIndex ? 'selected' : ''}`}>{move2}</div>
            </div>
        )
    }

    return (
        <>
            <div className="history-moves">{listHistory}</div>
            <div className="history-buttons">
                <button onClick={() => setHistoryIndex(0)} disabled={historyIndex <= 0} className="history-button">⇤</button>
                <button onClick={() => setHistoryIndex(historyIndex - 1)} disabled={historyIndex <= 0} className="history-button">←</button>
                <button onClick={() => setHistoryIndex(historyIndex + 1)} disabled={historyIndex >= history.length - 1} className="history-button">→</button>
                <button onClick={() => setHistoryIndex(history.length - 1)} disabled={historyIndex >= history.length - 1} className="history-button">⇥</button>
            </div>
        </>
    );
}