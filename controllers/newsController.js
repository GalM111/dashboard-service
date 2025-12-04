const UserData = require('../models/UserData');
const axios = require('axios');
const CRYPTOPANIC_BASE_URL = process.env.CRYPTOPANIC_BASE_URL;
const newsService = require('../services/newsService');

exports.fetchNews = async (req, res) => {
    try {
        const response = await newsService.getCryptoPanicPosts();
        res.status(200).json({ message: 'Content generated successfully', data: response });
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};