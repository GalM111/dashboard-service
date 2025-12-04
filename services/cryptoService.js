const axios = require('axios');
const apiKey = process.env.COINGECKO_API_KEY;
async function getCryptoPriceByIds(ids) {

    if (!apiKey) {
        throw new Error('apiKey is required');
    }

    const response = await axios.get(process.env.COINGECKO_API_BASE_URL, {
        params: {
            vs_currencies: 'usd',
            ids: 'bitcoin,ethereum',
            include_24hr_change: 'true',
        },
        // headers: {
        //     'x-cg-api-key': apiKey,
        // },
    });

    console.log(response);

    return response.data;
}

module.exports = {
    getCryptoPriceByIds,
};