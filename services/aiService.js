const { GoogleGenAI } = require('@google/genai');
const { models } = require('mongoose');
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });
async function askAi(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: process.env.AI_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.log(error);
    }

}

// function pasreUserDataToPrompt(userdata) {
//     let parseedUserData = userdata.toObject();
//     const { email, name, createdAt, ...rest } = parseedUserData;

//     const resultStr = Object.entries(rest)
//         .map(([key, value]) => {
//             if (Array.isArray(value)) {
//                 return `${key}: ${value.join(", ")}`;
//             }
//             return `${key}: ${value}`;
//         })
//         .join(", ");

//     return resultStr;
// }


module.exports = {
    askAi,
};  