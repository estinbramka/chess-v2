const { io } = require('../server');
const { joinLobby, sendMove, leaveLobby } = require('./game.socket');

function socketConnect(socket) {
    //console.log(socket.user);
    socket.on('join', joinLobby);

    socket.on('move', sendMove);

    socket.on('disconnect', leaveLobby);
};

function initSocket() {
    io.on("connection", socketConnect);
};

module.exports = {
    initSocket
};