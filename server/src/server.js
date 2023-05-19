const dotenv = require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.NODE_APP_URI_PRODUCTION : process.env.NODE_APP_URI_DEVELOPMENT;
const io = new Server(server, {
    cors: {
        origin: BASE_URL,
    }
});
exports.io = io;
const PORT = process.env.NODE_APP_PORT;
const { initSocket } = require('./socket/index');
const routes = require('./routes/index');
app.use(cors({ origin: BASE_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token == null) return next(new Error("unauthorized"));

    jwt.verify(token, process.env.NODE_APP_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(new Error("unauthorized"));
        socket.user = user
        next();
    })
});

initSocket(); 

server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});