// api/ask.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 2. Initialize with your hidden API Key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    
    // 3. HARDCODED: This forces the use of Flash 1.5 only
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are Rajesh's AI assistant. Answer questions based on his professional experience. Be friendly and concise."
    });

    try {
        const { question } = req.body;
        const result = await model.generateContent(question);
        const response = await result.response;
        
        return res.status(200).json({ answer: response.text() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ answer: "I'm having trouble connecting to the AI." });
    }
}