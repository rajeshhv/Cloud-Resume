export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { question } = req.body;
    const API_KEY = process.env.GEMINI_KEY;

    // Use the raw REST API URL instead of the SDK
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        const data = await response.json();

        // Check if the API returned an error
        if (!response.ok) {
            console.error("Google API Error:", data);
            return res.status(500).json({ answer: "Google API Error: " + JSON.stringify(data.error.message) });
        }

        const answer = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ answer });
    } catch (error) {
        return res.status(500).json({ answer: "Server Error: " + error.message });
    }
}