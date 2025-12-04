const memeService = require('../services/memeService');

exports.fetchMeme = async (req, res) => {
    try {
        console.log(req.params);
        const response = await memeService.getMemeUrlByTitle(req.body.title || 'funny');
        res.status(200).json({ message: 'Content generated successfully', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};
