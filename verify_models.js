const fs = require('fs');
const https = require('https');

// Read .env manually since we can't depend on dotenv being installed (safest)
const envContent = fs.readFileSync('.env', 'utf8');
const keyMatch = envContent.match(/REACT_APP_GEMINI_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : null;

if (!apiKey) {
    console.error("No API Key found in .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error("API Error:", response.error);
            } else {
                console.log("Available Models:");
                response.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Network Error:", e);
});
