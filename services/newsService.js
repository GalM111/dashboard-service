const axios = require('axios');
const authToken = process.env.CRYPTOPANIC_API_KEY;
async function getCryptoPanicPosts() {

    if (!authToken) {
        throw new Error('authToken is required');
    }

    const response = await axios.get(process.env.CRYPTOPANIC_BASE_URL, {
        params: {
            auth_token: authToken,
        },
    });

    return response.data;
}

module.exports = {
    getCryptoPanicPosts,
};