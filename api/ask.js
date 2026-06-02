export default async function handler(req, res) {
    // Set CORS headers to allow your specific domain
    res.setHeader('Access-Control-Allow-Origin', 'https://rajeshresume.link');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight (OPTIONS request)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ answer: "Method not allowed" });
    }

    try {
        const { question } = req.body;
        const API_KEY = process.env.GEMINI_KEY;
        
        // Ensure you are using 1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ answer: "Google API Error: " + JSON.stringify(data.error.message) });
        }

        const answer = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ answer });
        
    } catch (error) {
        return res.status(500).json({ answer: "Server Error: " + error.message });
    }
}