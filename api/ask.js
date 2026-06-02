import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { question } = req.body;
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        
        // Use the model string exactly like this
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(question);
        return res.status(200).json({ answer: result.response.text() });
    } catch (error) {
        console.error("API Error Details:", error);
        return res.status(500).json({ answer: "Error: " + error.message });
    }
}