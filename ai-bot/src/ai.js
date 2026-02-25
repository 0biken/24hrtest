const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "../.env" }); // Load from parent dir

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeTestFailure(logs) {
    if (!process.env.GEMINI_API_KEY) {
        return "⚠️ Gemini API key missing. Cannot analyze logs.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
You are an expert QA Automation Engineer interacting with a team on Telegram.
Analyze the following Playwright test failure logs. 

Provide a summary in this EXACT format (use Markdown):
🚨 **AI Failure Analysis**
**Issue:** [1 sentence explaining what broke in plain English]
**Likely Cause:** [1-2 sentences on why it happened based on the logs]
**Suggested Fix:** [1-2 sentences on what to check or change to fix it]

Logs:
${logs.substring(0, 3000)}
`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "⚠️ Failed to analyze logs with AI.";
    }
}

async function generateChatResponse(messageHistory) {
    if (!process.env.GEMINI_API_KEY) {
        return "I'm sorry, my AI brain is disconnected (missing Gemini API Key).";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Convert Telegram message format to Gemini format
        const chat = model.startChat({
            history: messageHistory.map(msg => ({
                role: msg.role === 'bot' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })).slice(0, -1), // Everything except the last message
            systemInstruction: "You are a helpful, concise QA assistant named TwentyFourHrTests_bot in a Telegram group. You help the team understand automated test runs and write Playwright code. Keep responses short and conversational. Use appropriate emojis."
        });

        const lastMessage = messageHistory[messageHistory.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I'm having trouble thinking right now. Please try again later.";
    }
}

module.exports = {
    analyzeTestFailure,
    generateChatResponse
};
