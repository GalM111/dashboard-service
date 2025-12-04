require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userDataRoutes = require('./routes/userDataRoutes');


// const { OpenRouter } = require('@openrouter/sdk');
// const openRouter = new OpenRouter({
//     apiKey: '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',
//     // defaultHeaders: {
//     //     'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
//     //     'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
//     // },
// });



const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Basic Hello World Route
app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Hello World from dashboard Service!' + process.env.TEST + process.env.TEST_2,
    });
});

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// UserData Routes
app.use('/api', userDataRoutes);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
