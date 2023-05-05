const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
const PORT = 5000;

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected with id: ' + socket.id);
});

server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});