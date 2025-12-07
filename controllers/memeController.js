const memeService = require('../services/memeService');
const newsService = require('../services/newsService');
const aiService = require('../services/aiService');
exports.fetchMeme = async (req, res) => {
    try {
        const response = await memeService.getMemeUrlByTitle(req.body.title || 'funny');
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};

exports.fetchAiMeme = async (req, res) => {
    try {
        const news = await newsService.getCryptoPanicPosts();
        const prompt = await memeService.getMemePrompt(req.body, news);
        let aiPromptAnswer = await aiService.askAi(prompt);
        const response = await memeService.getMemeUrlByTitle(aiPromptAnswer || 'stocks');
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};
