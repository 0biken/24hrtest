require("dotenv").config({ path: "../.env" }); // Load from parent directory
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const { setupJenkinsRoutes } = require("./jenkins");
const { generateChatResponse } = require("./ai");

// Validate environment
if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("FATAL ERROR: TELEGRAM_BOT_TOKEN is missing in .env");
    process.exit(1);
}

// 1. Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Listen for any kind of message in the group
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    // If the bot is mentioned or replied to, use Gemini to answer
    const botMention = "@TwentyFourHrTests_bot";
    const isReplyToBot = msg.reply_to_message && msg.reply_to_message.from.username === "TwentyFourHrTests_bot";

    // Check if the user is explicitly talking to the bot
    if (text.includes(botMention) || text.toLowerCase().includes("hey bot") || isReplyToBot) {

        // Show typing indicator
        bot.sendChatAction(chatId, "typing");

        try {
            // Very simple message history for this proof-of-concept
            const history = [
                { role: "user", content: text.replace(botMention, "").trim() }
            ];

            const reply = await generateChatResponse(history);
            bot.sendMessage(chatId, reply, { reply_to_message_id: msg.message_id });
        } catch (error) {
            console.error("Chat Error:", error);
            bot.sendMessage(chatId, "Oops, I ran into an error processing that.", { reply_to_message_id: msg.message_id });
        }
    }
});

console.log("🤖 AI Telegram Bot is running and polling for messages...");

// 2. Initialize Express Server for Jenkins Webhooks
const app = express();
app.use(express.json({ limit: "50mb" })); // Increase limit for potentially large logs

setupJenkinsRoutes(app, bot);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Jenkins Webhook listener running on http://localhost:${PORT}`);
});
