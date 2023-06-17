import Piece from '../piece';
import Promotion from '../promotion';
import './chessboard-styles.css'
import { createBoard } from '../../function/create-board';
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js'
import { socket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from '../../function/fetch';

//const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export default function Chessboard({ game, user, setGame }) {
    const { current: chess } = useRef(new Chess());
    const [fen, setFen] = useState(() => {
        chess.loadPgn(game.pgn);
        return chess.fen();
    });
    const [pov, setPov] = useState(() => {
        if (game.black && game.black?.id === user.id) {
            return 'black';
        } else if (game.white && game.white?.id === user.id) {
            return 'white';
        } else {
            return 'white';
        }
    });
    const [board, setBoard] = useState(createBoard(fen, pov))
    const [promotionPromise, setPromotionPromise] = useState();
    const [promotionHidden, setPromotionHidden] = useState(true);
    const [promotionColor, setPromotionColor] = useState();
    const navigate = useNavigate();
    const countConnections = useRef(0);
    const [possibleMoves, setPossibleMoves] = useState([]);
    useEffect(() => {
        chess.loadPgn(game.pgn);
        setFen(chess.fen());
    }, [game, chess])
    useEffect(() => {
        setBoard(createBoard(fen, pov));
    }, [fen, pov])
    const boardElm = useRef();
    useEffect(() => {
        //console.log(name, gameID);
        socket.connect();
        socket.on("connect", connect);
        //socket.emit('joinLobby', game.code);
        //console.log(user);

        function connect() {
            socket.emit('joinLobby', game.code);
            //console.log('join');
        }
        function receivedLatestGame(game) {
            console.log(game);
            setGame(game);
            //chess.loadPgn(game.pgn);
            //setFen(chess.fen());
        }
        function userJoinedAsPlayer({ name, side }) {
            console.log({ name, side });
        }
        function receivedMove({ from, to, promotion }) {
            chess.move({ from, to, promotion });
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
            socket.off("connect", connect);
            socket.off('receivedLatestGame', receivedLatestGame);
            socket.off('userJoinedAsPlayer', userJoinedAsPlayer);
            socket.off('receivedMove', receivedMove);
            socket.off('message', message);
            socket.off('connect_error', connectError);
            socket.disconnect();
            //console.log('disconnect');
        };
    }, [chess, game.code, navigate, setGame]);

    async function makeMove(from, to, piece, pieceElm) {
        console.log(from, to, chess.moves({ square: from, verbose: true }).filter(x => x.to === to).length > 0, chess.turn());
        let promotion;
        try {
            const prevTurn = chess.turn();
            if (
                (prevTurn === "b" && user.id !== game.black?.id) ||
                (prevTurn === "w" && user.id !== game.white?.id)
            ) {
                throw new Error("not turn to move");
            }
            if (piece.piece === 'wp' && to[1] === '8' && chess.moves({ square: from, verbose: true }).filter(x => x.to === to).length > 0) {
                //console.log('white promotion');
                setPromotionColor('white');
                setPromotionHidden(false);
                promotion = await promotionPromise;
                setPromotionHidden(true);
                console.log(promotion);
                chess.move({ from, to, promotion });
            } else if (piece.piece === 'bp' && to[1] === '1' && chess.moves({ square: from, verbose: true }).filter(x => x.to === to).length > 0) {
                //console.log('black promotion');
                setPromotionColor('black');
                setPromotionHidden(false);
                promotion = await promotionPromise;
                setPromotionHidden(true);
                console.log(promotion);
                chess.move({ from, to, promotion });
            } else {
                chess.move({ from, to });
            }
            //chess.move({ from, to, promotion });
        } catch (error) {
            pieceElm.removeAttribute("style");
            return;
        }
        setFen(chess.fen());
        socket.emit('sendMove', { from, to, promotion });
        return 'success';
    }

    function calculatePossibleMoves(from) {
        let pm = chess.moves({ square: from, verbose: true }).map(x => x.to);
        pm = [...new Set(pm)];
        let yAxis = Array.from({ length: 8 }, (_, i) => (i + 1));
        let xAxis = Array.from('abcdefgh');
        if (pov === 'black') {
            yAxis = yAxis.reverse();
            xAxis = xAxis.reverse();
        }
        for (let i = 0; i < pm.length; i++) {
            let x = xAxis.indexOf(pm[i][0]) + 1;
            let y = yAxis.indexOf(parseInt(pm[i][1])) + 1;
            pm[i] = 'square-' + x + y;
        }
        setPossibleMoves(pm);
        console.log(pm);
    }

    return (
        <div className='chessboard-layout'>
            <div className="chessboard" ref={boardElm}>
                <Promotion promotionHidden={promotionHidden} setPromotionPromise={setPromotionPromise} promotionColor={promotionColor} ></Promotion>
                {board
                    .filter((piece) => (piece.piece !== ''))
                    .map((piece) => (<Piece key={piece.pos} piece={piece} parent={boardElm} pov={pov} makeMove={makeMove} calculatePossibleMoves={calculatePossibleMoves}></Piece>))
                }
                {possibleMoves.map(pm => (<div className={pm+" hint"}></div>))}
            </div>
            <div className='chessboard-sidebar'>
                <button className='pov-button' onClick={() => pov === 'white' ? setPov('black') : setPov('white')}>Pov</button>
            </div>
        </div>
    );
}