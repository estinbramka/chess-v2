const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { authenticateToken } = require('./auth.routes');
const { activeGames } = require('../db/models/game.model');

router.post("/", authenticateToken, (req, res) => {
    //console.log('create game',nanoid());
    const side = req.body.startingSide;
    //console.log(req.user);
    const user = {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role,
        connected: false
    };
    const game = {
        code: nanoid(6),
        host: user,
        pgn: ""
    };
    if (side === "white") {
        game.white = user;
    } else if (side === "black") {
        game.black = user;
    } else {
        // random
        if (Math.floor(Math.random() * 2) === 0) {
            game.white = user;
        } else {
            game.black = user;
        }
    }

    activeGames.push(game);

    res.status(201).json({ code: game.code });
});

router.get("/:code", authenticateToken, (req, res) => {
    try {
        if (!req.params || !req.params.code) {
            res.status(200).json({ message: "Game Not Found" });
            return;
        }

        const game = activeGames.find((g) => g.code === req.params.code);

        if (!game) {
            res.status(200).json({ message: "Game Not Found" });
        } else {
            res.status(200).json(game);
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({ message: "Game Not Found" });
    }
});

module.exports = router;