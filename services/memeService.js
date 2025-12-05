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

function isPromptValid(prompt) {
    const str = prompt.trim();
    if (str.length > 2 || str[0].length < 2)
        return false;
    return true;
}

function getMemePrompt(userData, news) {
    console.log("HERE");

    if (userData != undefined) {
        let prompt = `based on ${(JSON.stringify(news)).replace(/[^a-zA-Z0-9 ]/g, " ")}, give me a name of gif  meme that is related to the new and to the user data: ${(JSON.stringify(userData)).replace(/[^a-zA-Z0-9 ]/g, " ")}, make it in one or two words only`;
        // prompt.replace(/[^a-zA-Z0-9 ]/g, " ");
        // console.log(prompt);
        return prompt
    }
    throw new Error("No User Data Provided");
}

module.exports = {
    getMemeUrlByTitle, isPromptValid, getMemePrompt
};