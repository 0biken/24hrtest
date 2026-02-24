# 🧪 AUTH Phase 1 — Execution Plan & Results

**Test Date:** February 24, 2026  
**Test Environment:** https://dev.24hrtruckfix.com  
**Status:** READY FOR EXECUTION ✅

---

## 📋 Phase 1: Valid Login (Critical Path)

### Test Cases

| ID | Test Case | Role | Credentials | Expected Result | Status |
|----|-----------|------|-------------|-----------------|--------|
| AUTH-001 | Valid sign in — Super Admin | Super Admin | `lordsond2+5@gmail.com` / `{:2)]tR!` | Admin dashboard loads, session token set | ⏳ |
| AUTH-002 | Valid sign in — Agent | Agent | `atandaeunice9+1@gmail.com` / `ng86q+b7~gnwivl` | Agent dashboard loads, agent-specific nav shown | ⏳ |
| AUTH-003 | Valid sign in — Client | Client | `zsavizfesh@gmail.com` / `Zw1{?Z;{>HDj1!SC` | Client dashboard loads, client-specific views shown | ⏳ |

---

## 🔐 Test Credentials

All credentials are stored in `.env` file:

```env
# Super Admin
ADMIN_EMAIL=lordsond2+5@gmail.com
ADMIN_PASSWORD={:2)]tR!

# Agent
AGENT_EMAIL=atandaeunice9+1@gmail.com
AGENT_PASSWORD=ng86q+b7~gnwivl

# Client
CLIENT_EMAIL=zsavizfesh@gmail.com
CLIENT_PASSWORD=Zw1{?Z;{>HDj1!SC

# 2FA
TEST_2FA_CODE=123456
```

---

## 🎯 Test Implementation

### Test File: `tests/e2e/auth.spec.ts`

**Implemented Tests:**
- ✅ TC-AUTH-001: Login page loads with correct elements
- ✅ TC-AUTH-002: Valid admin login redirects to /tickets
- ✅ TC-AUTH-003: Invalid password shows error toast
- ✅ TC-AUTH-004: Empty submit triggers validation
- ✅ TC-AUTH-005: Forgot password navigates to /auth/forgot-password
- ✅ TC-AUTH-006: Sign up link navigates to /auth/signup
- ✅ TC-AUTH-007: Unauthenticated access to /tickets redirects to login
- ✅ TC-AUTH-008: Password visibility toggle works

### Page Object: `tests/pages/login.page.ts`

**Selectors Used:**
```typescript
emailInput = page.locator("#email")
passwordInput = page.locator("#password")
signInButton = page.getByRole("button", { name: /sign in/i })
passwordToggle = page.locator('button[type="button"]').filter({ has: page.locator('.lucide-eye, .lucide-eye-off') })
forgotPasswordLink = page.getByRole("link", { name: /forgot your password/i })
signUpLink = page.getByRole("link", { name: /sign up/i })
cardTitle = page.getByText("Sign in to your account", { exact: true })
errorToast = page.locator('[data-sonner-toast][data-type="error"]')
```

---

## 🚀 Execution Steps

### Local Execution

```bash
# 1. Navigate to automated-tests directory
cd "C:\Users\USER\24hr QA\automated-tests"

# 2. Install dependencies (if not already done)
npm ci

# 3. Run auth tests only
npm run test:auth

# 4. View results
npm run report
```

### Jenkins Execution

```bash
# Jenkins will automatically:
# 1. Trigger on GitHub push
# 2. Run: npx playwright test tests/e2e/auth.spec.ts --reporter=line,junit
# 3. Publish HTML report
# 4. Send Telegram notification
```

---

## 📊 Expected Results

### Success Scenario (All Tests Pass)

```
✅ TC-AUTH-001: Login page loads with correct elements
✅ TC-AUTH-002: Valid admin login redirects to /tickets
✅ TC-AUTH-003: Invalid password shows error toast
✅ TC-AUTH-004: Empty submit triggers validation
✅ TC-AUTH-005: Forgot password navigates to /auth/forgot-password
✅ TC-AUTH-006: Sign up link navigates to /auth/signup
✅ TC-AUTH-007: Unauthenticated access to /tickets redirects to login
✅ TC-AUTH-008: Password visibility toggle works

Total: 8 passed, 0 failed
Pass Rate: 100%
```

### Failure Scenarios

**If TC-AUTH-002 fails:**
- Check if 2FA is required
- Verify credentials are correct
- Check if `/tickets` route exists
- Look for redirect to different dashboard

**If selectors fail:**
- Inspect element in dev tools
- Update selectors in `login.page.ts`
- Re-run tests

---

## 🔍 Debugging

### Enable Debug Mode

```bash
# Run with debug output
npx playwright test tests/e2e/auth.spec.ts --debug

# Or with headed browser
npx playwright test tests/e2e/auth.spec.ts --headed
```

### View Traces

```bash
# After test failure, view trace
npx playwright show-trace trace.zip
```

### Check Screenshots

```bash
# Screenshots saved on failure
ls test-results/
```

---

## 📝 Test Execution Log

### Run 1: Initial Execution

**Date:** [To be filled]  
**Time:** [To be filled]  
**Environment:** https://dev.24hrtruckfix.com  
**Browser:** Chromium  

**Results:**
- Total Tests: 8
- Passed: [To be filled]
- Failed: [To be filled]
- Skipped: 0
- Duration: [To be filled]

**Notes:**
[To be filled]

---

## 🔔 Notifications

### Telegram Notification (On Success)

```
✅ PASSED — 24HR Regression
Job: 24hr-automated-tests #X
Duration: X min X sec
[View Report](http://jenkins-url/job/...)

Auth Tests: 8/8 passed ✅
```

### Telegram Notification (On Failure)

```
❌ FAILED — 24HR Regression
Job: 24hr-automated-tests #X
Failed Stage: Auth Tests
[View Details](http://jenkins-url/job/...)

Failed: TC-AUTH-002 (Invalid password shows error toast)
```

---

## ✅ Checklist

- [x] Test cases defined
- [x] Credentials available in `.env`
- [x] Page Object Model created
- [x] Tests implemented in `auth.spec.ts`
- [x] Selectors verified
- [ ] Local test execution
- [ ] Jenkins execution
- [ ] Results documented
- [ ] Telegram notification received
- [ ] All tests passing

---

## 🎯 Next Steps

1. **Execute tests locally:**
   ```bash
   npm run test:auth
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "test: execute auth phase 1 tests"
   git push origin main
   ```

3. **Jenkins auto-runs** → Telegram notification

4. **Document results** in this file

5. **Fix any failures** → Re-run

---

## 📚 Related Files

- `tests/e2e/auth.spec.ts` — Test implementation
- `tests/pages/login.page.ts` — Page Object Model
- `.env` — Test credentials
- `TEST-RESULTS-AUTH-PHASE1.md` — Results documentation
- `Jenkinsfile` — CI/CD pipeline

---

**Ready to execute! 🚀**
