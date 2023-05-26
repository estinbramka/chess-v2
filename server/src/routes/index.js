const express = require('express');
const router = express.Router();

const { router: auth } = require('./auth.routes');
const games = require('./games.routes');

router.use("/auth", auth);
router.use("/games", games);

module.exports = router;