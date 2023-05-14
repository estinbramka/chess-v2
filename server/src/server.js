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
const PORT = process.env.NODE_APP_PORT;
const { addPlayer, game, removePlayer } = require('./handleGames');
app.use(cors({ origin: BASE_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let refreshTokens = []

app.post("/login", (req, res) => {
    //req.session.authenticated = true;
    //req.session.user = { name: req.body.name, role: 'guest' }
    const user = { name: req.body.name, role: 'guest' };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.NODE_APP_REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    //req.session.save();
    res.status(200).json({ auth: true, accessToken: accessToken, refreshToken: refreshToken });
});

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.status(401).json({ auth: false, message: 'Refresh token doesnt exist' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ auth: false, message: 'Refresh token doesnt exist' });
    jwt.verify(refreshToken, process.env.NODE_APP_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ auth: false, message: 'Refresh token not verified' });
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ auth: true, accessToken: accessToken })
    })
})

app.get("/session", authenticateToken, (req, res) => {
    res.status(200).json({ auth: true, message: 'Session Exists', username: req.user.name });
})

app.post("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.status(200).json({ auth: false, message: 'Session Deleted' });
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.NODE_APP_ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({ auth: false, message: 'Token not found' })

    jwt.verify(token, process.env.NODE_APP_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ auth: false, message: 'Verification Error' })
        req.user = user
        next()
    })
}

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token == null) return next(new Error("unauthorized"));

    jwt.verify(token, process.env.NODE_APP_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(new Error("unauthorized"));
        socket.user = user
        next();
    })
});

io.on('connection', (socket) => {
    //console.log(socket.user);
    socket.on('join', ({ gameID }, callback) => {
        let name = socket.user.name;
        const { error, player, opponent } = addPlayer({
            name,
            playerID: socket.id,
            gameID,
        });
        if (error) {
            return callback({ error });
        }
        socket.join(gameID);
        callback({ color: player.color });

        //send welcome message to player1, and also send the opponent player's data
        socket.emit('welcome', {
            message: `Hello ${player.name}, Welcome to the game`,
            opponent,
        });

        // Tell player2 that player1 has joined the game.
        socket.broadcast.to(player.gameID).emit('opponentJoin', {
            message: `${player.name} has joined the game. `,
            opponent: player,
        });

        if (game(gameID).length >= 2) {
            const white = game(gameID).find((player) => player.color === 'w');
            io.to(gameID).emit('message', {
                message: `Let's start the game. White (${white.name}) goes first`,
            });
        }
    });

    socket.on('move', ({ from, to, gameID }) => {
        socket.broadcast.to(gameID).emit('opponentMove', { from, to });
    });

    socket.on('disconnect', () => {
        const player = removePlayer(socket.id);

        if (player) {
            io.to(player.gameID).emit('message', {
                message: `${player.name} has left the game.`,
            });
            //socket.broadcast.to(player.gameID).emit('opponentLeft');
            console.log(`${player.name} has left the game ${player.gameID} sessionID ${socket.id}`);
        }
    });
});

server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});