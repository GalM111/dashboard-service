const axios = require('axios');
const authToken = process.env.CRYPTOPANIC_API_KEY;

async function getCryptoPanicPosts() {
    if (!authToken) {
        throw new Error('authToken is required');
    }
    try {

        const response = await axios.get(process.env.CRYPTOPANIC_BASE_URL, {
            params: {
                auth_token: authToken,
                filter: 'news',
                kind: 'news',
            },
        });

        const results = response.data?.results || [];

        const normalizedPosts = results.map((item) => {
            return {
                title: item.title,
                description: item.description || item.body || item.text || item.title,
                published_at: item.published_at,
            };
        });

        return normalizedPosts;

    } catch (error) {
        throw new Error(`Error fetching posts: ${error.message}`);
    }

}


// async function getCryptoPanicPosts() { //this is mock data!!
//     const mockCryptoPanicPosts = [
//         {
//             title: "Bitcoin breaks above $100K for the first time",
//             description: "Bitcoin surged past the $100,000 mark amid renewed institutional interest and ETF inflows.",
//             published_at: "2025-12-01T09:15:00Z",
//         },
//         {
//             title: "Ethereum gas fees hit 6-month low",
//             description: "Network activity on Ethereum has cooled, bringing gas fees down to levels not seen since early 2025.",
//             published_at: "2025-12-01T11:30:00Z",
//         },
//         {
//             title: "Solana ecosystem sees record DeFi volume",
//             description: "DeFi protocols on Solana recorded all-time-high daily volume, driven by new yield strategies.",
//             published_at: "2025-12-01T13:45:00Z",
//         },
//         {
//             title: "SEC approves new spot crypto index fund",
//             description: "Regulators approved a diversified spot crypto index fund, broadening access for traditional investors.",
//             published_at: "2025-12-01T15:10:00Z",
//         },
//         {
//             title: "Major exchange halts withdrawals amid maintenance",
//             description: "A top-5 centralized exchange temporarily paused withdrawals citing emergency system maintenance.",
//             published_at: "2025-12-01T16:05:00Z",
//         },
//         {
//             title: "Layer-2 adoption grows as users seek cheaper fees",
//             description: "More users are moving to Layer-2 networks to avoid high mainnet fees and congestion.",
//             published_at: "2025-12-01T17:20:00Z",
//         },
//         {
//             title: "Stablecoin market cap reaches new all-time high",
//             description: "Dollar-pegged stablecoins saw a surge in demand from both retail and institutional traders.",
//             published_at: "2025-12-01T18:40:00Z",
//         },
//         {
//             title: "On-chain data shows long-term BTC holders accumulating",
//             description: "Analytics firms report that long-term holders are steadily increasing their BTC balances.",
//             published_at: "2025-12-01T20:00:00Z",
//         },
//         {
//             title: "DeFi protocol launches new staking rewards program",
//             description: "A popular DeFi protocol announced revamped staking rewards to incentivize liquidity providers.",
//             published_at: "2025-12-01T21:10:00Z",
//         },
//         {
//             title: "NFT trading volume rebounds after prolonged slump",
//             description: "Blue-chip NFT collections led a broad recovery in the digital collectibles market.",
//             published_at: "2025-12-01T22:25:00Z",
//         },
//         {
//             title: "Regulator issues guidance on crypto tax reporting",
//             description: "New guidelines clarify how individuals and businesses should report crypto transactions for taxes.",
//             published_at: "2025-12-02T07:00:00Z",
//         },
//         {
//             title: "Leading wallet provider adds support for new L2",
//             description: "A widely used crypto wallet integrated a fast-growing Layer-2 network to improve user experience.",
//             published_at: "2025-12-02T08:15:00Z",
//         },
//         {
//             title: "Institutional fund allocates 5% of portfolio to crypto",
//             description: "A major asset manager revealed it has allocated part of its portfolio to digital assets.",
//             published_at: "2025-12-02T09:30:00Z",
//         },
//         {
//             title: "Bitcoin mining difficulty hits another record high",
//             description: "The Bitcoin network’s mining difficulty rose again, signaling strong miner participation.",
//             published_at: "2025-12-02T10:45:00Z",
//         },
//         {
//             title: "Cross-chain bridge announces bug bounty program",
//             description: "Developers launched a bug bounty to improve security and attract white-hat hackers.",
//             published_at: "2025-12-02T12:00:00Z",
//         },
//         {
//             title: "Metaverse project partners with global brand",
//             description: "A leading metaverse platform announced a collaboration with a major consumer brand for virtual events.",
//             published_at: "2025-12-02T13:20:00Z",
//         },
//         {
//             title: "Privacy coin sees spike in trading volume",
//             description: "Heightened interest in financial privacy drove a sharp increase in trading volume for a top privacy coin.",
//             published_at: "2025-12-02T14:35:00Z",
//         },
//         {
//             title: "DAO votes to upgrade governance framework",
//             description: "Token holders in a major DAO approved a proposal to enhance its voting and proposal process.",
//             published_at: "2025-12-02T15:50:00Z",
//         },
//         {
//             title: "Crypto exchange lists new meme coin after community demand",
//             description: "Following strong community interest, an exchange listed a trending meme coin, boosting its liquidity.",
//             published_at: "2025-12-02T17:05:00Z",
//         },
//     ];
//     return mockCryptoPanicPosts;



// }

module.exports = { getCryptoPanicPosts };
