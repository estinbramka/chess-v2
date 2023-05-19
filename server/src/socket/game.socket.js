const { io } = require('../server');
const { addPlayer, game, removePlayer } = require('./handleGames');

function joinLobby({ gameID }, callback) {
    let name = this.user.name;
    const { error, player, opponent } = addPlayer({
        name,
        playerID: this.id,
        gameID,
    });
    if (error) {
        return callback({ error });
    }
    this.join(gameID);
    callback({ color: player.color });

    //send welcome message to player1, and also send the opponent player's data
    this.emit('welcome', {
        message: `Hello ${player.name}, Welcome to the game`,
        opponent,
    });

    // Tell player2 that player1 has joined the game.
    this.broadcast.to(player.gameID).emit('opponentJoin', {
        message: `${player.name} has joined the game. `,
        opponent: player,
    });

    if (game(gameID).length >= 2) {
        const white = game(gameID).find((player) => player.color === 'w');
        io.to(gameID).emit('message', {
            message: `Let's start the game. White (${white.name}) goes first`,
        });
    }
}

function sendMove({ from, to, gameID }) {
    this.broadcast.to(gameID).emit('opponentMove', { from, to });
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