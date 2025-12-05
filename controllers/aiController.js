const UserData = require('../models/UserData');
const { GoogleGenAI } = require('@google/genai');
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const aiService = require('../services/aiService');
const newsService = require('../services/newsService');
exports.generateContent = async (req, res) => {
    try {
        console.log(req.body);
        const response = await aiService.askAi(req.body.prompt);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};

exports.generateInsights = async (req, res) => {
    try {
        console.log(req.body);
        const news = await newsService.getCryptoPanicPosts();
        const parsedPrompt = aiService.parseUserDataPrompt(req.body, news);
        console.log(parsedPrompt);
        const response = await aiService.askAi(parsedPrompt);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};  