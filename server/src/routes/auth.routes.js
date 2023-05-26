const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

let refreshTokens = []

router.post("/guestlogin", (req, res) => {
    //req.session.authenticated = true;
    //req.session.user = { name: req.body.name, role: 'guest' }
    const user = { id: uuidv4(), name: req.body.name, role: 'guest' };
    //console.log(user);
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.NODE_APP_REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    //req.session.save();
    res.status(200).json({ auth: true, accessToken: accessToken, refreshToken: refreshToken });
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.status(401).json({ auth: false, message: 'Refresh token doesnt exist' });
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ auth: false, message: 'Refresh token doesnt exist' });
    jwt.verify(refreshToken, process.env.NODE_APP_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ auth: false, message: 'Refresh token not verified' });
        const accessToken = generateAccessToken({ id: user.id, name: user.name, role: user.role })
        res.json({ auth: true, accessToken: accessToken })
    })
})

router.get("/session", authenticateToken, (req, res) => {
    res.status(200).json({ auth: true, message: 'Session Exists', username: req.user.name });
})

router.post("/logout", (req, res) => {
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
        //console.log(user);
        req.user = user
        next()
    })
}

module.exports = {
    router,
    authenticateToken
};