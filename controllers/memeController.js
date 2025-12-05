const memeService = require('../services/memeService');
const newsService = require('../services/newsService');
const aiService = require('../services/aiService');
exports.fetchMeme = async (req, res) => {
    try {
        // console.log(req);
        const response = await memeService.getMemeUrlByTitle(req.body.title || 'funny');
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};

exports.fetchAiMeme = async (req, res) => {
    console.log("AI MEME REQ");
    console.log(req.body);

    try {
        // console.log(req);
        const news = await newsService.getCryptoPanicPosts();
        // console.log(news);

        const prompt = memeService.getMemePrompt(req.body, news);
        // console.log(prompt);

        let aiPromptAnswer = await aiService.askAi(prompt);
        console.log(aiPromptAnswer);


        // if (!memeService.isPromptValid(aiPromptAnswer)) {
        //     for (let i = 0; i < 5; i++) {
        //         aiPromptAnswer = await aiService.askAi(aiPromptAnswer);
        //         if (memeService.isPromptValid(aiPromptAnswer)) {
        //             break;
        //         }
        //     }
        //     res.status(500).json({ message: 'Retry limit exceeded. Could not generate a valid meme prompt from AI', error: err.message });
        //     throw new Error('Retry limit exceeded. Could not generate a valid meme prompt from AI');
        // }

        const response = await memeService.getMemeUrlByTitle(aiPromptAnswer || 'funny');
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};
