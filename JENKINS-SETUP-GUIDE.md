# 🚀 Jenkins CI/CD Setup Guide — 24Hr Service Tests

Complete guide to integrate this automated test suite with Jenkins, GitHub, Slack, and Telegram.

---

## 📋 Prerequisites

- Jenkins installed and running (local or server)
- GitHub account with access to this repo
- Slack workspace (optional)
- Telegram bot (optional)

---

## 🔧 Part 1: Jenkins Configuration

### Step 1: Install Required Plugins

Go to **Manage Jenkins → Plugins → Available Plugins** and install:

| Plugin | Purpose |
|--------|---------|
| **NodeJS Plugin** | Run npm commands |
| **Git Plugin** | Clone repositories |
| **GitHub Plugin** | GitHub webhook integration |
| **HTML Publisher Plugin** | Publish Playwright reports |
| **Slack Notification Plugin** | Send Slack alerts |
| **JUnit Plugin** | Test result trends |

After installation, restart Jenkins.

---

### Step 2: Configure NodeJS

1. Go to **Manage Jenkins → Tools**
2. Scroll to **NodeJS installations**
3. Click **Add NodeJS**
4. Configure:
   - **Name:** `Node18`
   - **Version:** Select Node.js 18.x or higher
   - Check **Install automatically**
5. Click **Save**

---

### Step 3: Add Credentials

Go to **Manage Jenkins → Credentials → System → Global credentials → Add Credentials**

Add the following credentials (one by one):

#### Test Account Credentials

| ID | Type | Username/Value | Description |
|----|------|----------------|-------------|
| `admin-email` | Secret text | `admin@example.com` | Admin test account email |
| `admin-password` | Secret text | `your_password` | Admin test account password |
| `dispatcher-email` | Secret text | `dispatcher@example.com` | Dispatcher test account |
| `dispatcher-password` | Secret text | `your_password` | Dispatcher password |
| `client-email` | Secret text | `client@example.com` | Client test account |
| `client-password` | Secret text | `your_password` | Client password |
| `viewer-email` | Secret text | `viewer@example.com` | View-only test account |
| `viewer-password` | Secret text | `your_password` | Viewer password |
| `test-2fa-code` | Secret text | `123456` | Test 2FA code (dev only) |

#### Notification Credentials

| ID | Type | Value | Description |
|----|------|-------|-------------|
| `telegram-token` | Secret text | `123456:ABC-DEF...` | Telegram bot token |
| `telegram-chat-id` | Secret text | `-1001234567890` | Telegram group chat ID |

#### GitHub Credentials (for webhook)

| ID | Type | Value | Description |
|----|------|-------|-------------|
| `github-pat` | Secret text | `ghp_xxxxx...` | GitHub Personal Access Token |

---

## 🤖 Part 2: Telegram Bot Setup

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow prompts to name your bot (e.g., "24Hr QA Bot")
4. Copy the **bot token** (looks like `123456:ABC-DEF...`)
5. Add this token to Jenkins credentials as `telegram-token`

### Step 2: Get Chat ID

1. Create a Telegram group for QA alerts
2. Add your bot to the group
3. Send a test message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Find `"chat":{"id":-1001234567890}` in the response
6. Copy the chat ID (including the minus sign)
7. Add this to Jenkins credentials as `telegram-chat-id`

---

## 💬 Part 3: Slack Integration (Optional)

### Step 1: Create Slack App

1. Go to https://api.slack.com/apps
2. Click **Create New App → From scratch**
3. Name it "Jenkins QA Bot"
4. Select your workspace

### Step 2: Configure Bot Permissions

1. Go to **OAuth & Permissions**
2. Add these scopes:
   - `chat:write`
   - `chat:write.public`
3. Click **Install to Workspace**
4. Copy the **Bot User OAuth Token**

### Step 3: Configure Jenkins

1. Go to **Manage Jenkins → System**
2. Scroll to **Slack** section
3. Configure:
   - **Workspace:** Your workspace name
   - **Credential:** Add the Bot OAuth Token
   - **Default channel:** `#qa-alerts`
4. Click **Test Connection**
5. Save

### Step 4: Create Slack Channel

1. In Slack, create a channel: `#qa-alerts`
2. Invite the Jenkins bot to the channel

---

## 🔗 Part 4: GitHub Integration

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Select scopes:
   - ✅ `repo` (all)
   - ✅ `admin:repo_hook` (all)
4. Generate and copy the token
5. Add to Jenkins credentials as `github-pat`

### Step 2: Create Jenkins Pipeline Job

1. In Jenkins, click **New Item**
2. Enter name: `24hr-automated-tests`
3. Select **Pipeline**
4. Click **OK**

Configure the job:

#### General Section
- ✅ Check **GitHub project**
- **Project url:** `https://github.com/YOUR_USERNAME/automated-tests/`

#### Build Triggers
- ✅ Check **GitHub hook trigger for GITScm polling**

#### Pipeline Section
- **Definition:** Pipeline script from SCM
- **SCM:** Git
- **Repository URL:** `https://github.com/YOUR_USERNAME/automated-tests.git`
- **Credentials:** Select `github-pat`
- **Branch Specifier:** `*/main` (or `*/dev` if that's your default)
- **Script Path:** `Jenkinsfile`

Click **Save**

### Step 3: Add GitHub Webhook

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/automated-tests`
2. Click **Settings → Webhooks → Add webhook**
3. Configure:
   - **Payload URL:** `http://YOUR_JENKINS_URL/github-webhook/`
   - **Content type:** `application/json`
   - **Which events:** Select "Just the push event" and "Pull requests"
   - ✅ Check **Active**
4. Click **Add webhook**

---

## 🧪 Part 5: Test the Setup

### Manual Test Run

1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the console output
4. Check for:
   - ✅ Dependencies installed
   - ✅ Tests executed
   - ✅ Reports published
   - ✅ Notifications sent

### Automatic Trigger Test

```bash
# In your local automated-tests repo
git checkout -b test/jenkins-trigger
echo "# Test" >> README.md
git add .
git commit -m "test: trigger Jenkins build"
git push origin test/jenkins-trigger
```

Check Jenkins — a new build should start automatically!

---

## 📊 Part 6: View Results

### Jenkins Dashboard

After a build completes, you'll see:

1. **Build Status** — Green (pass) or Red (fail)
2. **Test Results** — Click on build number → **Test Result**
3. **Playwright Report** — Click **Playwright Report** link
4. **Trends** — Test result graphs over time

### Slack Notifications

You'll receive messages in `#qa-alerts`:

```
✅ PASSED — 24HR Truck Services Regression
Job: 24hr-automated-tests #42
Branch: main
Duration: 3 min 24 sec
🔗 View Build
📊 Test Report
```

### Telegram Notifications

Your Telegram group will receive:

```
✅ PASSED — 24HR Regression
Job: 24hr-automated-tests #42
Duration: 3 min 24 sec
[View Report](http://jenkins-url/job/...)
```

---

## 🔄 Part 7: Your Git Workflow

### For automated-tests Repo (Your Repo)

```bash
# Always work on feature branches
cd automated-tests
git checkout main
git pull origin main
git checkout -b feat/add-new-tests

# Make changes, add tests
git add .
git commit -m "feat: add service provider tests"
git push origin feat/add-new-tests

# Open Pull Request on GitHub
# After review, merge to main
# Jenkins automatically runs tests on main branch
```

### For Backend/Frontend Repos (Collaborator Access)

```bash
# Pull updates regularly
cd 24hourservice-Backend
git pull origin dev

cd 24hr-New-UI
git pull origin dev

# Don't push test files here
# Only raise Issues when you find bugs
```

---

## 🐛 Part 8: Bug Reporting Workflow

When tests find a bug:

1. **Capture Evidence**
   - Screenshot from Playwright report
   - Test trace file
   - Jenkins build link

2. **Document in Your Test Log**
   - Test case ID
   - Expected vs Actual
   - Steps to reproduce

3. **Report to Dev Team**
   - Option A: Create GitHub Issue on their repo (if you have access)
   - Option B: Share via Slack/email with evidence
   - Option C: Add to shared bug tracking tool

4. **Link Jenkins Build**
   - Include Jenkins build URL in bug report
   - Attach Playwright trace file

---

## 📁 Part 9: Project Structure

Your local setup should look like:

```
C:\Users\USER\24hr QA\
├── 24hourservice-Backend\     ← Pull only, don't push tests here
├── 24hr-New-UI\               ← Pull only, don't push tests here
└── automated-tests\           ← YOUR repo, push here
    ├── Jenkinsfile            ← Jenkins pipeline definition
    ├── playwright.config.ts   ← Test configuration
    ├── tests\
    │   ├── e2e\               ← UI tests
    │   ├── api\               ← API tests
    │   ├── pages\             ← Page objects
    │   └── helpers\           ← Test utilities
    ├── .env                   ← Local test credentials
    └── README.md
```

---

## ✅ Checklist

Use this to verify your setup:

### Jenkins Setup
- [ ] NodeJS plugin installed
- [ ] Node18 configured in Tools
- [ ] All 10 credentials added
- [ ] Pipeline job created
- [ ] Job points to your GitHub repo
- [ ] GitHub webhook trigger enabled

### GitHub Setup
- [ ] Personal Access Token created
- [ ] Token added to Jenkins
- [ ] Webhook added to repo
- [ ] Webhook shows green checkmark

### Telegram Setup
- [ ] Bot created via @BotFather
- [ ] Bot token added to Jenkins
- [ ] Group created and bot added
- [ ] Chat ID obtained and added to Jenkins

### Slack Setup (Optional)
- [ ] Slack app created
- [ ] Bot token added to Jenkins
- [ ] #qa-alerts channel created
- [ ] Bot invited to channel
- [ ] Test connection successful

### Test Run
- [ ] Manual build triggered successfully
- [ ] Tests executed
- [ ] Reports published
- [ ] Notifications received
- [ ] Automatic trigger works on push

---

## 🆘 Troubleshooting

### Build Fails: "nodejs: command not found"

**Solution:** Configure NodeJS in Jenkins Tools with name `Node18`

### Build Fails: "Credentials not found"

**Solution:** Check credential IDs match exactly (case-sensitive)

### No GitHub Webhook Trigger

**Solution:** 
1. Check webhook URL ends with `/github-webhook/`
2. Verify webhook shows recent deliveries
3. Check Jenkins job has "GitHub hook trigger" enabled

### Slack Notifications Not Sending

**Solution:**
1. Test connection in Jenkins → Manage Jenkins → System → Slack
2. Verify bot is in #qa-alerts channel
3. Check bot has `chat:write` permission

### Telegram Notifications Not Sending

**Solution:**
1. Verify bot token is correct
2. Check chat ID includes minus sign if it's a group
3. Test manually: `curl https://api.telegram.org/bot<TOKEN>/getMe`

### Tests Fail: "baseURL not set"

**Solution:** Environment variables not loaded. Check:
1. Credentials are added in Jenkins
2. Jenkinsfile references them correctly
3. playwright.config.ts reads from `process.env`

---

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Slack API](https://api.slack.com/)

---

## 🎯 Next Steps

1. Complete the checklist above
2. Run a test build manually
3. Push a commit to trigger automatic build
4. Verify notifications in Slack/Telegram
5. Add more test cases as needed
6. Monitor test trends in Jenkins dashboard

---

**Questions?** Check the troubleshooting section or review Jenkins console logs for detailed error messages.
