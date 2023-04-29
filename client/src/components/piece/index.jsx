import './piece-styles.css'

export default function Piece({ piece }) {
    return (
        <div className={`piece ${piece.piece} square-${piece.pos}`}></div>
    );
}