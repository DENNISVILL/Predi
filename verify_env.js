const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    if (!fs.existsSync(envPath)) {
        console.log("❌ ERROR: File .env NOT FOUND in " + __dirname);
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    console.log("✅ .env file found. Analyzing...");

    const lines = content.split('\n');
    let foundKey = false;
    let validFormat = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('REACT_APP_GEMINI_API_KEY')) {
            foundKey = true;
            console.log("Found variable: REACT_APP_GEMINI_API_KEY");

            const parts = trimmed.split('=');
            if (parts.length < 2) {
                console.log("❌ ERROR: No value assigned (missing '=')");
            } else {
                const val = parts[1].trim();
                if (val.length < 10) {
                    console.log("⚠️ WARNING: Value seems too short.");
                } else if (val.includes('pon-aqui-tu-api-key')) {
                    console.log("❌ ERROR: Placeholder text detected. You need to replace it with your REAL key.");
                } else {
                    validFormat = true;
                    console.log("✅ Variable format looks correct (starts with '" + val.substring(0, 4) + "...')");
                }
            }
        }
    });

    if (!foundKey) {
        console.log("❌ ERROR: REACT_APP_GEMINI_API_KEY not found in file.");
    } else if (validFormat) {
        console.log("🎉 SUCCESS: .env file looks GOOD!");
    }

} catch (err) {
    console.error("Error reading file:", err);
}
