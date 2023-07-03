const { io } = require('../server');
const { joinLobby, sendMove, leaveLobby, chat } = require('./game.socket');

function socketConnect(socket) {
    //console.log(socket.user);
    socket.on('joinLobby', joinLobby);

    socket.on('sendMove', sendMove);

    socket.on('disconnect', leaveLobby);

    socket.on("chat", chat);
};

function initSocket() {
    io.on("connection", socketConnect);
};

module.exports = {
    initSocket
};