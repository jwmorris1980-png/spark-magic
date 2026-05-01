const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function generateWeeklyAds() {
    console.log("🚀 Generating Spark Magic Weekly Marketing Pack...");

    if (!GOOGLE_API_KEY) {
        console.error("❌ GOOGLE_API_KEY not found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
        // Using the exact model name from server.cjs
        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest", 
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `You are a high-end Marketing Director for "Spark Magic," an AI intelligence suite for kids.
Generate a 7-day social media marketing plan. 
For each day, provide:
- day (integer 1-7)
- twitter (string)
- reddit_title (string)
- reddit_body (string)
- instagram_caption (string)

TONE: Premium, safe, magical, and empowering for parents. Focus on "Safe AI Exploration" and "Creativity."
Return ONLY a JSON array of objects.`;

        const result = await model.generateContent(prompt);
        const content = result.response.text();
        
        const filePath = path.join(__dirname, 'weekly_plan.json');
        fs.writeFileSync(filePath, content);
        
        console.log("✅ Weekly Marketing Plan generated: marketing/weekly_plan.json");
        
        const plan = JSON.parse(content);
        console.log("\nSample for Day 1:");
        console.log(plan[0]);

    } catch (err) {
        console.error("❌ Failed to generate ads:", err.message);
    }
}

generateWeeklyAds();
