const { getCryptoPriceByIds } = require('../services/cryptoService');

const INTERVAL_MS = 120_000;

function registerPriceSocket(io) {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        let cryptoIds = null;
        let intervalId = null;

        const sendPrices = async () => {
            if (!cryptoIds) return;

            try {
                const data = await getCryptoPriceByIds(cryptoIds);
                socket.emit('prices', data);
            } catch (err) {
                console.error('Error fetching prices:', err.message);
                socket.emit('prices_error', { message: 'Failed to load prices' });
            }
        };

        socket.on('set_crypto_ids', (ids) => {
            const normalizedIds = normalizeIds(ids);
            if (!normalizedIds) {
                socket.emit('prices_error', { message: 'Invalid crypto ids supplied' });
                return;
            }

            cryptoIds = normalizedIds;

            // start interval the first time we get valid IDs
            if (!intervalId) {
                intervalId = setInterval(sendPrices, INTERVAL_MS);
            }

            sendPrices();
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            if (intervalId) {
                clearInterval(intervalId);
            }
        });
    });
}

function normalizeIds(ids) {
    if (!ids) return null;

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
