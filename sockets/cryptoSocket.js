// sockets/priceSocket.js
const { getCryptoPriceByIds } = require('../services/cryptoService');

const INTERVAL_MS = 10_000;

function registerPriceSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        const sendPrices = async () => {
            try {
                const data = await getCryptoPriceByIds('bitcoin,ethereum');
                socket.emit('prices', data);
            } catch (err) {
                console.error('Error fetching prices:', err.message);
                socket.emit('prices_error', { message: 'Failed to load prices' });
            }
        };

        // send once immediately
        sendPrices();

        // then every INTERVAL_MS
        const intervalId = setInterval(sendPrices, INTERVAL_MS);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            clearInterval(intervalId); // prevent memory leaks
        });
    });
}

module.exports = {
    registerPriceSocket,
};
