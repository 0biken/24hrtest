# 🧪 24Hr Service — Automated Test Suite

Playwright E2E and API tests for **24hr-New-UI** + **24hourservice-Backend**.

---

## 📁 Project Structure

```
automated-tests/
├── Jenkinsfile                   # CI/CD pipeline definition
├── playwright.config.ts          # Multi-browser config
├── .env                          # Local URLs + credentials
├── REGRESSION-TEST-PLAN.md       # Scoped regression plan
│
└── tests/
    ├── global.setup.ts           # One-time auth (handles 2FA)
    ├── pages/                    # Page Object Models
    │   ├── login.page.ts
    │   ├── dashboard.page.ts
    │   └── tickets.page.ts
    ├── helpers/test-helpers.ts   # API calls, screenshots, utils
    ├── e2e/                      # UI Tests
    │   ├── auth.spec.ts          # 9 auth tests
    │   ├── tickets.spec.ts       # 6 ticket tests
    │   └── dashboard.spec.ts     # 8 navigation tests
    └── api/
        └── api.spec.ts           # 13 API endpoint tests
```

---

## 🚀 Quick Start

```bash
# 1. Start both local servers (in separate terminals)
cd "24hr QA/24hourservice-Backend" && node app.js     # port 3000
cd "24hr QA/24hr-New-UI" && npm run dev               # port 4000

# 2. Configure
cd "24hr QA/automated-tests"
# Edit .env — fill in your test credentials

# 3. Run
npm test                    # all 36 tests
npm run test:smoke          # critical paths
npm run test:regression     # full suite
npm run test:api            # backend only (no browser)
npm run test:ui             # interactive mode
npm run test:headed         # watch tests run
```

---

## 🏷️ Run By Module

| Command | What Runs |
|---------|-----------|
| `npm run test:auth` | Login, signup, access control |
| `npm run test:tickets` | Ticket list, detail, search |
| `npm run test:dashboard` | Sidebar navigation, layout |
| `npm run test:api` | Backend endpoint validation |
| `npm run test:smoke` | All P0 critical paths |
| `npm run test:regression` | Everything tagged @regression |
| `npm run test:ci` | Full suite — Chromium only + JUnit (for Jenkins) |

---

## 🔐 Auth Strategy

Global setup logs in once → saves state → all tests reuse the session.  
Tests needing a fresh context (like "unauthenticated redirect") create their own.

---

## ➕ Adding New Tests

1. Create a Page Object in `tests/pages/` if needed
2. Create a spec in `tests/e2e/` or `tests/api/`
3. Tag with `@smoke` / `@regression` / custom tag
4. Add a script to `package.json` if desired

Use `npx playwright codegen http://localhost:4000` to record tests visually.

---

## 📊 Reports

| Artifact | Location |
|----------|----------|
| HTML Report | `playwright-report/index.html` |
| JSON Results | `test-results/results.json` |
| Screenshots | Auto on failure |
| Videos | Auto on failure |
| Traces | On first retry (`npx playwright show-trace`) |

---

## 🔄 CI/CD — Jenkins Pipeline

The project includes a `Jenkinsfile` that runs the full test suite automatically.

### Pipeline Stages

| Stage | What Happens |
|-------|-------------|
| **Install** | `npm ci` + installs Chromium browser |
| **Smoke Tests** | Runs `@smoke` tests as a fast quality gate |
| **E2E Tests** | Full Playwright suite (Chromium only) |
| **API Tests** | Backend endpoint validation |

Post-build: archives Playwright HTML report, JUnit results for trend graphs.

### Start Jenkins Locally

```powershell
java -jar C:\Jenkins\jenkins.war --httpPort=8080
# Open http://localhost:8080
```

### GitHub Integration

To trigger Jenkins builds on every push/PR to the app repos:

1. **Install the GitHub plugin** in Jenkins (Manage Jenkins → Plugins → Available → "GitHub")
2. **Create a GitHub Personal Access Token** at https://github.com/settings/tokens with `repo` and `admin:repo_hook` scopes
3. **Add the token to Jenkins** (Manage Jenkins → Credentials → Add → Secret text, ID: `github-pat`)
4. **Configure the Pipeline job**:
   - Source: Git → `https://github.com/absswanii/24hourservice-Backend.git` or `https://github.com/absswanii/24hr-New-UI.git`
   - Build Triggers: ✅ "GitHub hook trigger for GITScm polling"
5. **Add webhooks on GitHub** for both repos:
   - https://github.com/absswanii/24hourservice-Backend/settings/hooks
   - https://github.com/absswanii/24hr-New-UI/settings/hooks
   - Payload URL: `http://<your-jenkins-url>/github-webhook/`
   - Content type: `application/json`
   - Events: Push + Pull Requests
