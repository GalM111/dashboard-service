const axios = require('axios');

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cachedPosts = null;
let cacheTimestamp = 0;

const mockCryptoPanicPosts = [
    {
        title: "Bitcoin slips below $90K as sell-off deepens",
        description: "Bitcoin extended its December correction as traders rotated out of risk assets.",
        published_at: "2025-12-05T08:10:00Z",
    },
    {
        title: "Altcoins follow BTC lower in volatile session",
        description: "Major altcoins saw sharp intraday swings as market liquidity thinned out.",
        published_at: "2025-12-05T09:25:00Z",
    },
    {
        title: "Ethereum gas fees stay low despite market turbulence",
        description: "On-chain activity remains subdued, keeping average gas fees near recent lows.",
        published_at: "2025-12-05T10:40:00Z",
    },
    {
        title: "Solana DeFi volume cools after record week",
        description: "DeFi protocols on Solana saw a modest pullback in volume after setting fresh highs.",
        published_at: "2025-12-05T12:05:00Z",
    },
    {
        title: "Regulators float draft rules for global stablecoin oversight",
        description: "A new consultation paper proposes coordinated standards for fiat-backed stablecoins.",
        published_at: "2025-12-05T13:30:00Z",
    },
    {
        title: "Major banks explore euro stablecoin pilot",
        description: "A consortium of European banks announced plans to test a euro-denominated stablecoin for payments.",
        published_at: "2025-12-05T14:45:00Z",
    },
    {
        title: "Top exchange appoints new co-CEO amid expansion push",
        description: "One of the largest crypto exchanges reshuffled leadership as it targets its next growth phase.",
        published_at: "2025-12-05T16:00:00Z",
    },
    {
        title: "Stablecoin market cap holds near record highs",
        description: "Demand for dollar-pegged assets remains strong despite heightened market volatility.",
        published_at: "2025-12-05T17:20:00Z",
    },
    {
        title: "On-chain data shows whales accumulating BTC on dips",
        description: "Analytics platforms report large inflows to long-term holder wallets during the recent sell-off.",
        published_at: "2025-12-05T18:45:00Z",
    },
    {
        title: "Layer-2 networks see surge in daily active users",
        description: "Cheaper transaction fees on L2 chains continue to attract traders and DeFi users.",
        published_at: "2025-12-05T20:10:00Z",
    },
    {
        title: "Government crypto reserve proposal sparks policy debate",
        description: "Lawmakers clashed over a plan to hold digital assets as part of national reserves.",
        published_at: "2025-12-06T07:15:00Z",
    },
    {
        title: "National watchdog launches review of retail crypto risks",
        description: "A financial regulator announced an in-depth study into how crypto products are sold to consumers.",
        published_at: "2025-12-06T08:30:00Z",
    },
    {
        title: "DeFi total value locked dips as yields compress",
        description: "Lower returns and risk-off sentiment pushed capital out of several major DeFi protocols.",
        published_at: "2025-12-06T09:55:00Z",
    },
    {
        title: "NFT trading volume edges higher from yearly lows",
        description: "Blue-chip collections led a modest rebound after months of subdued activity.",
        published_at: "2025-12-06T11:10:00Z",
    },
    {
        title: "Cross-chain bridge boosts bug bounty after security scare",
        description: "Developers expanded rewards for white-hat hackers to harden bridge infrastructure.",
        published_at: "2025-12-06T12:25:00Z",
    },
    {
        title: "DAO community approves new treasury diversification plan",
        description: "Token holders voted to allocate part of the DAO’s reserves into low-volatility assets.",
        published_at: "2025-12-06T13:50:00Z",
    },
    {
        title: "Privacy-focused coin sees spike in transactions",
        description: "Heightened interest in financial privacy drove a jump in on-chain activity.",
        published_at: "2025-12-06T15:05:00Z",
    },
    {
        title: "Institutional desk reports renewed interest in ETH options",
        description: "Volatility in the broader market has revived demand for hedging and directional plays.",
        published_at: "2025-12-06T16:20:00Z",
    },
    {
        title: "New spot crypto index fund records strong first-week inflows",
        description: "A diversified spot crypto product attracted both retail and advisory capital.",
        published_at: "2025-12-06T18:00:00Z",
    },
    {
        title: "Exchange lists new meme coin after viral community campaign",
        description: "A trending meme token gained liquidity after landing on a top-tier trading venue.",
        published_at: "2025-12-06T19:45:00Z",
    },
];

const normalizePosts = (results = []) => results.map((item) => ({
    title: item.title,
    description: item.description || item.body || item.text || item.title,
    published_at: item.published_at,
}));

const getCache = () => {
    const isFresh = cachedPosts && Date.now() - cacheTimestamp < CACHE_TTL_MS;
    return isFresh ? cachedPosts : null;
};

async function getCryptoPanicPosts() {
    const cached = getCache();
    if (cached) {
        return cached;
    }

    const authToken = process.env.CRYPTOPANIC_API_KEY;
    const baseUrl = process.env.CRYPTOPANIC_BASE_URL;

    if (!authToken || !baseUrl) {
        console.warn('CryptoPanic configuration missing. Returning mock posts.');
        return mockCryptoPanicPosts;
    }

    try {
        const response = await axios.get(baseUrl, {
            params: {
                auth_token: authToken,
                filter: 'news',
                kind: 'news',
            },
        });

        const normalized = normalizePosts(response.data?.results || []);
        cachedPosts = normalized;
        cacheTimestamp = Date.now();
        return normalized;
    } catch (error) {
        if (cachedPosts) {
            console.warn('Failed to refresh CryptoPanic posts. Returning stale cache.');
            return cachedPosts;
        }

        if (error.response?.status === 429) {
            console.warn('CryptoPanic rate limit hit. Falling back to mock posts.');
            return mockCryptoPanicPosts;
        }

        throw new Error(`Error fetching posts: ${error.message}`);
    }
}

module.exports = { getCryptoPanicPosts };
