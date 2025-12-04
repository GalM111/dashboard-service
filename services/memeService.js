const axios = require('axios');
const apiKey = process.env.MEME_API_KEY;
async function getMemeUrlByTitle(title) {

    if (!apiKey) {
        throw new Error('apiKey is required');
    }

    const response = await axios.get(process.env.MEME_API_BASE_URL, {
        params: {
            query: title,
            number: 1,
        },
        headers: {
            'x-api-key': apiKey,
        },
    });

    return response.data.images[0].url;
}

module.exports = {
    getMemeUrlByTitle,
};