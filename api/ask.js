const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    // 1. Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or replace * with your S3 URL
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Handle the Preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { question } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

        const result = await model.generateContent(question);
        return res.status(200).json({ answer: result.response.text() });
    } catch (error) {
        console.error("API Error:", error); // Check Vercel logs to see the real error!
        return res.status(500).json({ answer: "Error: " + error.message });
    }
}