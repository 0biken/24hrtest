const express = require("express");
const { analyzeTestFailure } = require("./ai");

function setupJenkinsRoutes(app, bot) {
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    app.post("/api/build-result", express.json({ limit: "50mb" }), async (req, res) => {
        try {
            const { status, jobName, buildNumber, duration, buildUrl, logs } = req.body;

            let message = "";
            let aiAnalysis = "";

            if (status === "SUCCESS") {
                message = `
✅ *PASSED* — 24HR Regression
*Job:* ${jobName} #${buildNumber}
*Duration:* ${duration}
[View Report](${buildUrl})
                `.trim();

                await bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
            } else if (status === "FAILURE") {

                // Trigger Gemini to analyze the failure immediately
                message = `
❌ *FAILED* — 24HR Regression
*Job:* ${jobName} #${buildNumber}
*Duration:* ${duration}
[View Details](${buildUrl})

⏳ *AI is analyzing the failure logs...*
                `.trim();

                const sentMsg = await bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });

                // Run the AI analysis
                const analysis = await analyzeTestFailure(logs);

                // Edit the message with the AI analysis
                const finalMessage = `
❌ *FAILED* — 24HR Regression
*Job:* ${jobName} #${buildNumber}
*Duration:* ${duration}
[View Details](${buildUrl})

${analysis}
                `.trim();

                await bot.editMessageText(finalMessage, {
                    chat_id: CHAT_ID,
                    message_id: sentMsg.message_id,
                    parse_mode: "Markdown"
                });
            }

            res.status(200).json({ success: true, message: "Notification sent." });

        } catch (error) {
            console.error("Webhook Error:", error);
            res.status(500).json({ success: false, error: "Failed to process webhook" });
        }
    });
}

module.exports = { setupJenkinsRoutes };
