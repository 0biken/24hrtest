# 🤖 Telegram Bot Setup — Complete Guide

Your Telegram bot is created! Here's everything you need to set it up.

---

## ✅ Bot Information

**Bot Name:** TwentyFourHrTests_bot  
**Bot Username:** @TwentyFourHrTests_bot  
**Bot Token:** `<YOUR_BOT_TOKEN>`  
**Bot URL:** https://t.me/TwentyFourHrTests_bot

---

## 🎯 Step 1: Get Chat ID

### Option A: Create a Group (Recommended)

1. **Create a new Telegram group** for QA alerts
   - Name: "24HR QA Alerts" or similar
   - Add your bot to the group
   - Send a test message in the group

2. **Get the Chat ID:**
   ```bash
   # Use this command to get updates
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

3. **Look for the chat ID in the response:**
   ```json
   {
     "ok": true,
     "result": [
       {
         "update_id": 123456789,
         "message": {
           "message_id": 1,
           "from": {...},
           "chat": {
             "id": -1001234567890,  // ← THIS IS YOUR CHAT ID
             "title": "24HR QA Alerts",
             "type": "supergroup"
           },
           "date": 1234567890,
           "text": "Hello"
         }
       }
     ]
   }
   ```

**Note:** Group chat IDs start with `-100`. Keep this number.

### Option B: Use Your Personal Chat

1. **Message your bot directly** (@TwentyFourHrTests_bot)
2. **Send a message** like "Hello"
3. **Get the Chat ID** using the same curl command above
4. **Look for** `"chat":{"id":123456789}` (positive number, no minus sign)

---

## 🛠️ Step 2: Test Your Bot

### Test Bot is Working

```bash
# Test bot connection
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe

# Should return:
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "TwentyFourHrTests_bot",
    "username": "TwentyFourHrTests_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false
  }
}
```

### Test Sending a Message

```bash
# Replace CHAT_ID with your actual chat ID
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -d chat_id=CHAT_ID \
  -d text="✅ Test message from Jenkins CI/CD"
```

---

## 🔧 Step 3: Add to Jenkins

### Add Credentials in Jenkins

1. Go to **Manage Jenkins → Credentials → System → Global credentials**
2. Click **Add Credentials**

#### Credential 1: Bot Token
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `<YOUR_BOT_TOKEN>`
- **ID:** `telegram-token`
- **Description:** Telegram bot token for QA notifications

#### Credential 2: Chat ID
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `-1001234567890` (your actual chat ID)
- **ID:** `telegram-chat-id`
- **Description:** Telegram group chat ID for QA alerts

---

## 📝 Step 4: Configure Jenkinsfile

Your Jenkinsfile already has Telegram integration. It uses:

```groovy
environment {
    TELEGRAM_TOKEN = credentials('telegram-token')
    TELEGRAM_CHAT_ID = credentials('telegram-chat-id')
}
```

And sends notifications:

```groovy
script {
    def message = """✅ *PASSED* — 24HR Regression
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}
[View Report](${env.BUILD_URL})"""
    
    bat """curl -s -X POST https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage -d chat_id=${TELEGRAM_CHAT_ID} -d parse_mode=Markdown -d text="${message.replaceAll('\n', '%0A')}" """
}
```

---

## 🎨 Step 5: Customize Your Bot (Optional)

### Add Bot Description

```bash
# Set bot description
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setMyDescription \
  -d description="🤖 24HR Service QA Bot - Sends Jenkins build notifications"
```

### Add Bot Commands

```bash
# Set bot commands
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setMyCommands \
  -d commands='[{"command":"status","description":"Get Jenkins build status"},{"command":"help","description":"Show help"}]'
```

### Set Bot Profile Picture

```bash
# Upload a profile picture (replace with actual image URL)
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setChatPhoto \
  -F chat_id=@TwentyFourHrTests_bot \
  -F photo=@/path/to/photo.jpg
```

---

## 🧪 Step 6: Test Jenkins Integration

### Manual Test

1. **Run a Jenkins build manually**
2. **Check Telegram group** for notification
3. **Should see:**

```
✅ PASSED — 24HR Regression
Job: 24hr-automated-tests #1
Duration: 2 min 15 sec
[View Report](http://jenkins-url/job/...)
```

### Automatic Test

1. **Push a commit to GitHub**
2. **Jenkins should trigger automatically**
3. **Telegram should receive notification**

---

## 🔍 Step 7: Troubleshooting

### Bot Not Sending Messages

**Check 1: Bot is in the group**
- Open Telegram group
- Check bot is a member
- Bot needs to be added as an admin to send messages

**Check 2: Chat ID is correct**
- Use `getUpdates` to verify chat ID
- Group IDs start with `-100`
- Personal chat IDs are positive numbers

**Check 3: Token is correct**
- Test with: `curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe`
- Should return bot info

**Check 4: Jenkins credentials**
- Verify credentials IDs: `telegram-token` and `telegram-chat-id`
- Check they're added to the correct scope (Global)

### Messages Not Formatted

**Markdown formatting issues:**
- Use `parse_mode=Markdown` in curl command
- Escape special characters: `*` `_` `` ` `` `[` `]` `(` `)` `~` `` ` `` `>` `#` `+` `-` `=` `|` `{` `}` `.` `!`
- Jenkinsfile already handles this with `.replaceAll('\n', '%0A')`

### Bot Not Responding to Commands

**If you added commands:**
- Restart Telegram app
- Type `/` to see available commands
- Commands only work in private chat with bot

---

## 🔒 Step 8: Security Notes

### Keep Token Secure
- ✅ Token is in Jenkins credentials (encrypted)
- ❌ Don't commit token to GitHub
- ❌ Don't share token in chat
- ✅ Token can be revoked if compromised

### Revoke Token if Needed
If token is compromised:
1. Message @BotFather
2. Send `/revoke`
3. Select your bot
4. Get new token
5. Update Jenkins credentials

### Bot Permissions
- Your bot can only send messages to chats it's in
- It can't read messages unless given permission
- It can't access user data

---

## 📊 Step 9: Message Examples

### Success Message
```
✅ PASSED — 24HR Regression
Job: 24hr-automated-tests #42
Duration: 3 min 24 sec
[View Report](http://jenkins-url/job/24hr-automated-tests/42/)
```

### Failure Message
```
❌ FAILED — 24HR Regression
Job: 24hr-automated-tests #43
Failed Stage: Auth Tests
[View Details](http://jenkins-url/job/24hr-automated-tests/43/)
```

### Unstable Message
```
⚠️ UNSTABLE — 24HR Regression
Job: 24hr-automated-tests #44
Some tests failed. [View Details](http://jenkins-url/job/24hr-automated-tests/44/)
```

---

## 🚀 Step 10: Advanced Features

### Add Inline Keyboard (Optional)

```bash
# Send message with buttons
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -d chat_id=CHAT_ID \
  -d text="Build completed. What would you like to do?" \
  -d reply_markup='{"inline_keyboard":[[{"text":"View Report","url":"http://jenkins-url/report"},{"text":"Rerun Tests","callback_data":"rerun"}]]}'
```

### Send Build Logs (Optional)

```bash
# Send last 10 lines of build log
LOG=$(tail -10 /path/to/build.log)
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -d chat_id=CHAT_ID \
  -d text="Last 10 lines of build log:\n\`\`\`\n$LOG\n\`\`\`" \
  -d parse_mode=Markdown
```

---

## ✅ Checklist

- [ ] Bot created: @TwentyFourHrTests_bot
- [ ] Group created and bot added
- [ ] Chat ID obtained (starts with -100)
- [ ] Bot token saved: `<YOUR_BOT_TOKEN>`
- [ ] Jenkins credentials added:
  - [ ] `telegram-token` with bot token
  - [ ] `telegram-chat-id` with chat ID
- [ ] Test message sent successfully
- [ ] Jenkins build triggers Telegram notification
- [ ] Messages formatted correctly with Markdown

---

## 📞 Support

### Telegram Bot Issues
- **Bot not working:** Message @BotFather
- **Token issues:** Use `/revoke` then `/newbot`
- **API questions:** https://core.telegram.org/bots/api

### Jenkins Integration Issues
- Check Jenkins console logs
- Verify credentials are correct
- Test curl command manually

### General Questions
- Check this guide first
- Test each step individually
- Use `curl` commands to debug

---

## 🎉 Done!

Your Telegram bot is ready to send Jenkins notifications. Next:

1. **Set up Jenkins** (follow JENKINS-SETUP-GUIDE.md)
2. **Add Telegram credentials** to Jenkins
3. **Test the integration** with a manual build
4. **Enjoy automated notifications!** 🚀

---

**Bot Token:** `<YOUR_BOT_TOKEN>`  
**Bot URL:** https://t.me/TwentyFourHrTests_bot  
**Keep this token secure!**