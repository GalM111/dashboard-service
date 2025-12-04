const UserData = require('../models/UserData');
const { GoogleGenAI } = require('@google/genai');
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const aiService = require('../services/aiService');
exports.generateContent = async (req, res) => {
    try {
        const response = await aiService.askAi(req.body.prompt);
        res.status(200).json({ message: 'Content generated successfully', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};  