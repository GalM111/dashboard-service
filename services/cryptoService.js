const axios = require('axios');
const apiKey = process.env.COINGECKO_API_KEY;
async function getCryptoPriceByIds(ids) {
    if (!apiKey) {
        throw new Error('apiKey is required');
    }

    const normalizedIds = normalizeIds(ids);

    const response = await axios.get(process.env.COINGECKO_API_BASE_URL, {
        params: {
            vs_currencies: 'usd',
            ids: normalizedIds,
            include_24hr_change: 'true',
        },
        // headers: {
        //     'x-cg-api-key': apiKey,
        // },
    });

    return response.data;
}

function normalizeIds(ids) {
    if (!ids) {
        return 'bitcoin,ethereum';
    }

    if (Array.isArray(ids)) {
        const cleaned = ids
            .map((entry) => String(entry).trim())
            .filter(Boolean);
        return cleaned.length ? cleaned.join(',') : 'bitcoin,ethereum';
    }

    if (typeof ids === 'string') {
        const cleaned = ids
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean);
        return cleaned.length ? cleaned.join(',') : 'bitcoin,ethereum';
    }

    return 'bitcoin,ethereum';
}

module.exports = {
    getCryptoPriceByIds,
};
