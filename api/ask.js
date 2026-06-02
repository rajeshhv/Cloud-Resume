export default async function handler(req, res) {
    // This allows any website to call your API (needed for S3/Vercel cross-origin)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // This is the "Preflight" handler that was causing your 403 error
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ answer: "Method not allowed" });
    }

    try {
        const { question } = req.body;
        const API_KEY = process.env.GEMINI_KEY;
        
        // Ensure you are using 1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Google API Error:", JSON.stringify(data));
            return res.status(500).json({ answer: "Google API Error. Check logs." });
        }

        const answer = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ answer });
        
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ answer: "Server Error: " + error.message });
    }
}