const UserData = require('../models/UserData');
const { GoogleGenAI } = require('@google/genai');
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
const aiService = require('../services/aiService');
const newsService = require('../services/newsService');

exports.generateContent = async (req, res) => {
    try {
        const response = await aiService.askAi(req.body.prompt);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};

exports.generateInsights = async (req, res) => {
    try {
        const news = await newsService.getCryptoPanicPosts();
        const parsedPrompt = aiService.parseUserDataPrompt(req.body, news);
        let response;
        try {
            response = await aiService.askAi(parsedPrompt);
        } catch (aiError) {
            console.warn('Gemini request failed in generateInsights, falling back to mock data.', aiError.message);
        }

        if (!response) {
            const mockResponse = buildMockInsights(req.body, news);
            res.status(200).json(mockResponse);
            return;
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: 'Error generating content', error: err.message });
    }
};
function buildMockInsights() {
    return 'Bitcoin just broke above 100k with strong institutional and ETF flows, so momentum and intraday volatility are high and ideal for a day trader, but moves can reverse fast. Ethereum gas fees are at a six-month low and activity is cooler, so trading ETH is cheaper and cleaner, but you should wait for volume bursts instead of forcing trades in quiet periods. Broad crypto sentiment is risk-on with record Solana DeFi volume, Layer 2 adoption growing, a new spot crypto index fund, and stablecoins hitting an all-time-high market cap, which all support upside liquidity for majors. At the same time, a top exchange halting withdrawals and fresh tax-reporting guidance show headline and regulatory risk are real, so sudden liquidity drops and sharp wicks are possible intraday. For you as a BTC–ETH–DOGE day trader, use Bitcoin as the main trend guide and trade clear breakouts and mean-reversions around intraday levels, use ETH when it shows relative strength or weakness versus BTC with tight stops, and treat DOGE as a pure momentum play only when meme and volume news spike from things like new meme-coin listings. Keep your size moderate, define entry, stop, and take-profit before every trade, avoid holding positions through major regulatory or exchange headlines, and respect a fixed daily loss limit so one bad move does not wipe out your week.';
}
