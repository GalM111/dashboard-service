// sockets/priceSocket.js
const { getCryptoPriceByIds } = require('../services/cryptoService');

const INTERVAL_MS = 10_000;
const DEFAULT_IDS = 'bitcoin,ethereum';

function registerPriceSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        let cryptoIds = DEFAULT_IDS;

        const sendPrices = async () => {
            try {
                const data = await getCryptoPriceByIds(cryptoIds);
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

        socket.on('set_crypto_ids', (ids) => {
            const normalizedIds = normalizeIds(ids);
            if (!normalizedIds) {
                socket.emit('prices_error', { message: 'Invalid crypto ids supplied' });
                return;
            }

            cryptoIds = normalizedIds;
            sendPrices();
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            clearInterval(intervalId); // prevent memory leaks
        });
    });
}

function normalizeIds(ids) {
    if (!ids) {
        return null;
    }

    if (Array.isArray(ids)) {
        const cleaned = ids
            .map((entry) => String(entry).trim())
            .filter(Boolean);
        return cleaned.length ? cleaned.join(',') : null;
    }

    if (typeof ids === 'string') {
        const cleaned = ids
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean);
        return cleaned.length ? cleaned.join(',') : null;
    }

    return null;
}

module.exports = {
    registerPriceSocket,
};
