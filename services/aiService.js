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

module.exports = {
    askAi,
};  