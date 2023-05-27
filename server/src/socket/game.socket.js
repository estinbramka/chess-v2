const { io } = require('../server');
const { addPlayer, game, removePlayer } = require('./handleGames');
const { activeGames } = require('../db/models/game.model');
const { Chess } = require('chess.js');

async function joinLobby(gameCode) {
    let name = this.user.name;
    const game = activeGames.find((g) => g.code === gameCode);
    if (!game) return;

    if (game.host && game.host?.id === this.user.id) {
        game.host.connected = true;
        if (game.host.name !== this.user.name) {
            game.host.name = this.user.name;
        }
    }
    if (game.white && game.white?.id === this.user.id) {
        game.white.connected = true;
        game.white.disconnectedOn = undefined;
        if (game.white.name !== this.user.name) {
            game.white.name = this.user.name;
        }
    } else if (game.black && game.black?.id === this.user.id) {
        game.black.connected = true;
        game.black.disconnectedOn = undefined;
        if (game.black.name !== this.user.name) {
            game.black.name = this.user.name;
        }
    } else {
        if (game.observers === undefined) game.observers = [];
        const user = {
            id: this.user.id,
            name: this.user.name
        };
        if (game.observers.find((o) => o.id === this.user.id) === undefined) {
            game.observers?.push(user);
        }
    }

    if (this.rooms.size >= 2) {
        await leaveLobby.call(this);
    }

    if (game.timeout) {
        clearTimeout(game.timeout);
        game.timeout = undefined;
    }

    await this.join(gameCode);
    io.to(game.code).emit("receivedLatestGame", game);

    //from observer join as player
    joinAsPlayer.bind(this)();
    //send welcome message to player1, and also send the opponent player's data
    io.to(game.code).emit('message', {
        message: `Hello ${this.user.name}, Welcome to the game`,
    });

    // Tell player2 that player1 has joined the game.
    /*this.broadcast.to(gameCode).emit('opponentJoin', {
        message: `${game} has joined the game. `,
        game,
    });*/

    /*if (game(gameID).length >= 2) {
        const white = game(gameID).find((player) => player.color === 'w');
        io.to(gameID).emit('message', {
            message: `Let's start the game. White (${white.name}) goes first`,
        });
    }*/
}

async function joinAsPlayer() {
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (!game) return;
    const user = game.observers?.find((o) => o.id === this.user.id);
    if (!user) return;
    if (!game.white) {
        const sessionUser = {
            id: this.user.id,
            name: this.user.name,
            role: this.user.role,
            connected: true
        };
        game.white = sessionUser;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code).emit("userJoinedAsPlayer", {
            name: this.user.name,
            side: "white"
        });
        game.startedAt = Date.now();
    } else if (!game.black) {
        const sessionUser = {
            id: this.user.id,
            name: this.user.name,
            role: this.user.role,
            connected: true
        };
        game.black = sessionUser;
        if (user) game.observers?.splice(game.observers?.indexOf(user), 1);
        io.to(game.code).emit("userJoinedAsPlayer", {
            name: this.user.name,
            side: "black"
        });
        game.startedAt = Date.now();
    } else {
        console.log("joinAsPlayer: attempted to join a game with already 2 players");
    }
    io.to(game.code).emit("receivedLatestGame", game);
}

async function sendMove(m) {
    //console.log(m);
    const game = activeGames.find((g) => g.code === Array.from(this.rooms)[1]);
    if (!game || game.endReason || game.winner) return;
    const chess = new Chess();
    if (game.pgn) {
        chess.loadPgn(game.pgn);
    }

    try {
        const prevTurn = chess.turn();

        if (
            (prevTurn === "b" && this.user.id !== game.black?.id) ||
            (prevTurn === "w" && this.user.id !== game.white?.id)
        ) {
            throw new Error("not turn to move");
        }

        const newMove = chess.move(m);

        if (newMove) {
            game.pgn = chess.pgn();
            this.to(game.code).emit("receivedMove", m);
            if (chess.isGameOver()) {
                let reason;
                if (chess.isCheckmate()) reason = "checkmate";
                else if (chess.isStalemate()) reason = "stalemate";
                else if (chess.isThreefoldRepetition()) reason = "repetition";
                else if (chess.isInsufficientMaterial()) reason = "insufficient";
                else if (chess.isDraw()) reason = "draw";

                const winnerSide =
                    reason === "checkmate" ? (prevTurn === "w" ? "white" : "black") : undefined;
                const winnerName =
                    reason === "checkmate"
                        ? winnerSide === "white"
                            ? game.white?.name
                            : game.black?.name
                        : undefined;
                if (reason === "checkmate") {
                    game.winner = winnerSide;
                } else {
                    game.winner = "draw";
                }
                game.endReason = reason;

                //const { id } = (await GameModel.save(game)); // save game to db
                game.id = id;
                io.to(game.code).emit("gameOver", { reason, winnerName, winnerSide, id });

                if (game.timeout) clearTimeout(game.timeout);
                activeGames.splice(activeGames.indexOf(game), 1);
            }
        } else {
            throw new Error("invalid move");
        }
    } catch (e) {
        console.log("sendMove error: " + e);
        this.emit("receivedLatestGame", game);
    }
}

function leaveLobby() {
    const player = removePlayer(this.id);

    if (player) {
        io.to(player.gameID).emit('message', {
            message: `${player.name} has left the game.`,
        });
        //this.broadcast.to(player.gameID).emit('opponentLeft');
        console.log(`${player.name} has left the game ${player.gameID} sessionID ${this.id}`);
    }
}

module.exports = {
    joinLobby,
    sendMove,
    leaveLobby
};