const UserData = require('../models/UserData');
const axios = require('axios');
const CRYPTOPANIC_BASE_URL = process.env.CRYPTOPANIC_BASE_URL;
const newsService = require('../services/newsService');

exports.fetchNews = async (req, res) => {
    console.log("new news!");
    // log(req.body);

    try {
        const newsArr = await newsService.getCryptoPanicPosts();
        console.log(newsArr);

        res.status(200).json(newsArr);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};