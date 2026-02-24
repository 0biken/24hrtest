# 🚀 How to Run Auth Tests — Quick Guide

## ⚡ Quick Start (2 minutes)

```bash
cd "C:\Users\USER\24hr QA\automated-tests"
npm run test:auth
```

That's it! Tests will run and results appear in your terminal.

---

## 📊 View Results

### Option 1: HTML Report (Best)

```bash
npm run report
```

Opens interactive HTML report in your browser showing:
- ✅ Passed tests
- ❌ Failed tests
- 📸 Screenshots
- 🎬 Videos
- 📋 Traces

### Option 2: Terminal Output

```bash
npm run test:auth
```

Shows real-time output:
```
✓ TC-AUTH-001: Login page loads with correct elements (2.3s)
✓ TC-AUTH-002: Valid admin login redirects to /tickets (5.1s)
✓ TC-AUTH-003: Invalid password shows error toast (3.2s)
...
8 passed (15.2s)
```

### Option 3: JSON Results

```bash
cat test-results/results.json
```

Machine-readable test data for CI/CD integration.

---

## 🎯 Run Specific Tests

### Run Only Smoke Tests

```bash
npm run test:smoke
```

Runs only critical path tests (marked with `@smoke`).

### Run Only Auth Tests

```bash
npm run test:auth
```

Runs only authentication tests (marked with `@auth`).

### Run Single Test

```bash
npx playwright test tests/e2e/auth.spec.ts -g "Valid admin login"
```

Runs only the test matching "Valid admin login".

---

## 🔍 Debug Mode

### Run with Browser Visible

```bash
npm run test:headed
```

Watch tests run in real-time in a browser window.

### Run with Debugger

```bash
npm run test:debug
```

Opens Playwright Inspector:
- Step through tests
- Inspect elements
- Run commands in console

### Run with Traces

```bash
npx playwright test tests/e2e/auth.spec.ts --trace on
```

After failure, view trace:
```bash
npx playwright show-trace trace.zip
```

---

## 📋 Test Scripts Available

| Command | What It Does |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:headed` | Watch tests run in browser |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:auth` | Auth tests only |
| `npm run test:tickets` | Ticket tests only |
| `npm run test:dashboard` | Dashboard tests only |
| `npm run test:smoke` | Critical path tests |
| `npm run test:regression` | Full regression suite |
| `npm run test:api` | API tests only |
| `npm run test:ci` | CI mode (Chromium only) |
| `npm run report` | View HTML report |
| `npm run codegen` | Record new tests |

---

## 🔧 Troubleshooting

### Tests Fail: "Cannot find element"

**Solution:** Update selectors in `tests/pages/login.page.ts`

```bash
# 1. Run with headed mode to see what's happening
npm run test:headed

# 2. Or use codegen to record correct selectors
npm run codegen
```

### Tests Timeout

**Solution:** Increase timeout in `playwright.config.ts`

```typescript
timeout: 60000,  // 60 seconds
```

### 2FA Blocking Tests

**Solution:** Tests handle 2FA automatically, but if it fails:

```typescript
// In auth.spec.ts, the code already handles this:
if (went2FA) {
    const codeInput = page.locator('input[type="text"], input[type="number"]').first();
    await codeInput.fill(process.env.TEST_2FA_CODE || "123456");
    await page.getByRole("button", { name: /verify|submit|confirm/i }).click();
}
```

### Credentials Not Working

**Solution:** Check `.env` file

```bash
# Verify credentials are set
cat .env | grep ADMIN_EMAIL
cat .env | grep ADMIN_PASSWORD

# Should output:
# ADMIN_EMAIL=lordsond2+5@gmail.com
# ADMIN_PASSWORD={:2)]tR!
```

---

## 📊 Understanding Results

### Passed Test

```
✓ TC-AUTH-002: Valid admin login redirects to /tickets (5.1s)
```

- ✓ = Test passed
- Time = How long it took

### Failed Test

```
✗ TC-AUTH-003: Invalid password shows error toast (3.2s)
  Error: Timeout waiting for element
  Location: tests/e2e/auth.spec.ts:65
```

- ✗ = Test failed
- Error message = What went wrong
- Location = Where in the code

### Skipped Test

```
⊘ TC-AUTH-004: Empty submit triggers validation
  Reason: @skip tag
```

- ⊘ = Test skipped
- Reason = Why it was skipped

---

## 🔄 CI/CD Integration

### Jenkins Auto-Runs Tests

When you push to GitHub:

```bash
git push origin main
```

Jenkins automatically:
1. Clones your repo
2. Installs dependencies
3. Runs: `npx playwright test tests/e2e/auth.spec.ts`
4. Publishes HTML report
5. Sends Telegram notification

### View Jenkins Results

1. Go to Jenkins dashboard
2. Click on `24hr-automated-tests` job
3. Click on latest build number
4. Click **Playwright Report** link

---

## 📈 Test Metrics

After running tests, you'll see:

```
8 passed, 0 failed, 0 skipped
Pass Rate: 100%
Duration: 15.2s
```

### Track Over Time

Jenkins shows test trends:
- Pass rate graph
- Duration graph
- Failure history

---

## 🎯 Common Workflows

### Workflow 1: Quick Local Test

```bash
npm run test:auth
npm run report
```

### Workflow 2: Debug Failing Test

```bash
npm run test:headed
# Watch test run, see what fails
# Update selectors if needed
npm run test:auth
```

### Workflow 3: Full Regression Before Push

```bash
npm run test:regression
npm run report
# Review results
git push origin main
```

### Workflow 4: CI/CD Pipeline

```bash
git push origin main
# Jenkins auto-runs
# Check Telegram for notification
# View report in Jenkins
```

---

## 📝 Example: Running Auth Tests Step-by-Step

```bash
# 1. Navigate to project
cd "C:\Users\USER\24hr QA\automated-tests"

# 2. Run auth tests
npm run test:auth

# Output:
# ✓ TC-AUTH-001: Login page loads with correct elements (2.3s)
# ✓ TC-AUTH-002: Valid admin login redirects to /tickets (5.1s)
# ✓ TC-AUTH-003: Invalid password shows error toast (3.2s)
# ✓ TC-AUTH-004: Empty submit triggers validation (2.1s)
# ✓ TC-AUTH-005: Forgot password navigates to /auth/forgot-password (1.8s)
# ✓ TC-AUTH-006: Sign up link navigates to /auth/signup (1.9s)
# ✓ TC-AUTH-007: Unauthenticated access to /tickets redirects to login (3.2s)
# ✓ TC-AUTH-008: Password visibility toggle works (2.1s)
#
# 8 passed (22.3s)

# 3. View detailed report
npm run report

# 4. If all pass, push to GitHub
git add .
git commit -m "test: auth phase 1 complete - all tests passing"
git push origin main

# 5. Jenkins auto-runs and sends Telegram notification
```

---

## ✅ Success Checklist

- [ ] Ran `npm run test:auth`
- [ ] All 8 tests passed
- [ ] Viewed HTML report
- [ ] Pushed to GitHub
- [ ] Received Telegram notification
- [ ] Checked Jenkins build

---

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Tests won't run | Check Node.js installed: `node --version` |
| Dependencies missing | Run: `npm ci` |
| Selectors wrong | Run: `npm run test:headed` to see what's happening |
| 2FA blocking | Check `.env` has `TEST_2FA_CODE=123456` |
| Credentials wrong | Verify `.env` file has correct emails/passwords |
| Jenkins not running | Check Jenkins is started: `http://localhost:8080` |

---

**Ready to run tests? Start with:**

```bash
npm run test:auth
```

🚀
