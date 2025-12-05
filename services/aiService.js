const { GoogleGenAI } = require('@google/genai');
const { models } = require('mongoose');
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
async function askAi(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.log(error);
    }

}

function parseUserDataPrompt(userData, news) {

    if (userData != undefined) {
        let prompt = `You are a crypto trading assistant. The user’s profile, including coins held, position sizes, risk tolerance, time horizon, trading style, and goals is: ${(JSON.stringify(userData)).replace(/[^a-zA-Z0-9 ]/g, " ")}. Today’s key market and news data is: ${(JSON.stringify(news)).replace(/[^a-zA-Z0-9 ]/g, " ")}. First, concisely explain today’s market context most relevant to this user. Then give coin-specific insights, opportunities, and risks, explicitly linking them to his profile. Finally, provide clear, practical tips for today’s trading and risk management. Respond in short, direct sentences.`;
        return prompt
    }
    throw new Error("No User Data Provided");

}


module.exports = {
    askAi, parseUserDataPrompt,
};  