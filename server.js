// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const userDataRoutes = require('./routes/userDataRoutes');
const { registerPriceSocket } = require('./sockets/cryptoSocket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // change to your frontend URL in prod
    },
});

// Allow Angular (or any origin) to hit REST endpoints
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

// REST routes
app.use('/api', userDataRoutes);

// Simple health check
app.get('/', (req, res) => {
    res.send('Crypto price API & WebSocket server running');
});

// WebSocket setup
registerPriceSocket(io);

// Basic error handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {

    console.log(process.env.PORT);
    console.log(`Server listening on port ${PORT}`);
});
