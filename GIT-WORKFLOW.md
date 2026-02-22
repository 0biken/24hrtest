# 🔀 Git Workflow Guide — 24Hr QA Project

Quick reference for managing your three repositories.

---

## 📁 Your Repository Setup

```
C:\Users\USER\24hr QA\
├── 24hourservice-Backend\     ← Collaborator access (read/pull only)
├── 24hr-New-UI\               ← Collaborator access (read/pull only)
└── automated-tests\           ← YOUR repository (full control)
```

---

## 🎯 Repository Roles

### automated-tests (YOUR REPO)

**Purpose:** Your QA test suite, Jenkins pipeline, test documentation

**Access:** Full control — you own this

**Workflow:**
- ✅ Create feature branches
- ✅ Commit and push changes
- ✅ Open Pull Requests
- ✅ Merge to main
- ✅ Jenkins watches this repo

**What Lives Here:**
- Jenkinsfile
- Playwright tests
- Test plans and documentation
- Test data and fixtures
- CI/CD configuration

---

### 24hourservice-Backend (COLLABORATOR)

**Purpose:** Backend API you're testing against

**Access:** Collaborator (read/pull, possibly raise PRs)

**Workflow:**
- ✅ Pull updates regularly
- ✅ Read code to understand APIs
- ✅ Raise GitHub Issues for bugs
- ❌ Don't push test files here
- ❌ Don't commit directly to main/dev

**What You Do:**
- Pull latest changes to test against
- Review code to write better tests
- Report bugs via GitHub Issues
- Review PRs if asked

---

### 24hr-New-UI (COLLABORATOR)

**Purpose:** Frontend application you're testing

**Access:** Collaborator (read/pull, possibly raise PRs)

**Workflow:**
- ✅ Pull updates regularly
- ✅ Read code to understand UI flows
- ✅ Raise GitHub Issues for bugs
- ❌ Don't push test files here
- ❌ Don't commit directly to main/dev

**What You Do:**
- Pull latest changes to test against
- Review components to write better tests
- Report bugs via GitHub Issues
- Review PRs if asked

---

## 🚀 Daily Workflow

### Morning Routine

```bash
# 1. Update all repos
cd "C:\Users\USER\24hr QA\24hourservice-Backend"
git pull origin dev

cd "C:\Users\USER\24hr QA\24hr-New-UI"
git pull origin dev

cd "C:\Users\USER\24hr QA\automated-tests"
git pull origin main

# 2. Check for any breaking changes
# 3. Run smoke tests locally if needed
npm run test:smoke
```

---

## 📝 Working on Tests (automated-tests)

### Creating a New Feature

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# 1. Make sure you're on main and up to date
git checkout main
git pull origin main

# 2. Create a feature branch
git checkout -b feat/add-service-provider-tests

# 3. Make your changes
# - Add new test files
# - Update Jenkinsfile if needed
# - Update documentation

# 4. Check what changed
git status
git diff

# 5. Stage and commit
git add .
git commit -m "feat: add service provider CRUD tests"

# 6. Push to GitHub
git push origin feat/add-service-provider-tests

# 7. Open Pull Request on GitHub
# - Go to https://github.com/YOUR_USERNAME/automated-tests
# - Click "Compare & pull request"
# - Add description
# - Request review if needed
# - Merge when ready
```

---

## 🐛 Bug Fix Workflow

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# 1. Create a fix branch
git checkout main
git pull origin main
git checkout -b fix/flaky-auth-test

# 2. Fix the issue
# - Update test code
# - Add better waits/assertions
# - Test locally

# 3. Commit and push
git add .
git commit -m "fix: stabilize auth test with explicit waits"
git push origin fix/flaky-auth-test

# 4. Open PR and merge
```

---

## 🔄 Keeping Repos in Sync

### Update Backend/Frontend Repos

```bash
# Backend
cd "C:\Users\USER\24hr QA\24hourservice-Backend"
git fetch origin
git pull origin dev

# Frontend
cd "C:\Users\USER\24hr QA\24hr-New-UI"
git fetch origin
git pull origin dev
```

**When to do this:**
- Every morning before testing
- Before writing new tests
- When devs announce new features
- When tests start failing unexpectedly

---

## 🚨 Reporting Bugs

### Option 1: GitHub Issues (Preferred)

If you have Issues access on their repos:

1. **Go to the repo** (Backend or Frontend)
2. **Click Issues → New Issue**
3. **Fill in details:**

```markdown
## Bug Description
Login fails with valid credentials on Firefox

## Steps to Reproduce
1. Navigate to /auth/signin
2. Enter valid email: test@example.com
3. Enter valid password
4. Click "Sign In"

## Expected Behavior
User should be logged in and redirected to dashboard

## Actual Behavior
Error message: "Invalid credentials"

## Environment
- Browser: Firefox 120
- OS: Windows 11
- Test Run: Jenkins #42
- Date: 2024-01-15

## Evidence
- Screenshot: [attach]
- Jenkins Build: http://jenkins-url/job/24hr-automated-tests/42/
- Playwright Trace: [attach trace.zip]

## Test Case
- File: tests/e2e/auth.spec.ts
- Test: "should login with valid credentials"
```

4. **Assign labels:** `bug`, `qa-found`, `priority-high`
5. **Assign to dev** if you know who owns it

---

### Option 2: Direct Communication

If no Issues access:

1. **Capture evidence** (same as above)
2. **Share via Slack/Email:**

```
🐛 Bug Found: Login fails on Firefox

Test: tests/e2e/auth.spec.ts - "should login with valid credentials"
Jenkins Build: http://jenkins-url/job/24hr-automated-tests/42/
Environment: Firefox 120, Windows 11

Steps to reproduce:
1. Go to /auth/signin
2. Enter test@example.com / password
3. Click Sign In
4. ❌ Error: "Invalid credentials"

Expected: Should login successfully
Actual: Login fails

Evidence attached:
- screenshot.png
- trace.zip
```

---

## 🔍 Checking Your Git Status

### Quick Status Check

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# What branch am I on?
git branch

# What changed?
git status

# What's different from main?
git diff main

# What commits are on my branch?
git log main..HEAD --oneline
```

---

## 🧹 Cleaning Up Branches

### After PR is Merged

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# 1. Switch to main
git checkout main

# 2. Pull latest (includes your merged PR)
git pull origin main

# 3. Delete local feature branch
git branch -d feat/add-service-provider-tests

# 4. Delete remote branch (if not auto-deleted)
git push origin --delete feat/add-service-provider-tests
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Push tests to Backend/Frontend repos

```bash
# WRONG - Don't do this
cd "C:\Users\USER\24hr QA\24hourservice-Backend"
mkdir tests
# ... add Playwright tests
git add tests/
git commit -m "add tests"
git push origin main  # ❌ WRONG!
```

**Why:** Test code belongs in `automated-tests`, not in the app repos.

---

### ❌ DON'T: Commit directly to main

```bash
# WRONG - Don't do this
cd "C:\Users\USER\24hr QA\automated-tests"
git checkout main
# ... make changes
git add .
git commit -m "add tests"
git push origin main  # ❌ WRONG!
```

**Why:** Always use feature branches and PRs for code review.

---

### ❌ DON'T: Forget to pull before creating a branch

```bash
# WRONG - Don't do this
cd "C:\Users\USER\24hr QA\automated-tests"
git checkout -b feat/new-tests  # ❌ Might be outdated!
```

**Right way:**
```bash
git checkout main
git pull origin main  # ✅ Get latest first
git checkout -b feat/new-tests
```

---

## 🎯 Branch Naming Convention

Use clear, descriptive branch names:

| Type | Format | Example |
|------|--------|---------|
| New feature | `feat/<description>` | `feat/add-billing-tests` |
| Bug fix | `fix/<description>` | `fix/flaky-login-test` |
| Documentation | `docs/<description>` | `docs/update-readme` |
| Refactor | `refactor/<description>` | `refactor/page-objects` |
| Chore | `chore/<description>` | `chore/update-dependencies` |

---

## 📊 Checking Jenkins Integration

### After Pushing to GitHub

1. **Check GitHub webhook:**
   - Go to repo Settings → Webhooks
   - Click on your webhook
   - Check "Recent Deliveries"
   - Should show green checkmark

2. **Check Jenkins:**
   - Go to Jenkins dashboard
   - Your job should show "Building" or completed
   - Click on build number to see logs

3. **Check notifications:**
   - Slack #qa-alerts channel
   - Telegram group
   - Should receive build status

---

## 🆘 Troubleshooting

### "Your branch is behind 'origin/main'"

```bash
git pull origin main
# If conflicts, resolve them, then:
git add .
git commit -m "merge: resolve conflicts"
```

---

### "Failed to push - rejected"

```bash
# Someone else pushed to main
git pull origin main --rebase
git push origin main
```

---

### "Accidentally committed to main"

```bash
# Move your commit to a new branch
git branch feat/my-changes
git reset --hard origin/main
git checkout feat/my-changes
git push origin feat/my-changes
```

---

### "Need to undo last commit"

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes, undo commit
git reset --hard HEAD~1
```

---

## 📚 Quick Reference

### Essential Commands

```bash
# Status
git status                    # What changed?
git branch                    # What branch am I on?
git log --oneline -5          # Recent commits

# Branching
git checkout -b feat/name     # Create and switch to branch
git checkout main             # Switch to main
git branch -d feat/name       # Delete local branch

# Syncing
git pull origin main          # Get latest from GitHub
git push origin feat/name     # Push branch to GitHub

# Committing
git add .                     # Stage all changes
git commit -m "message"       # Commit with message
git push                      # Push to current branch

# Viewing
git diff                      # See unstaged changes
git diff --staged             # See staged changes
git log                       # See commit history
```

---

## ✅ Daily Checklist

- [ ] Pull latest from all 3 repos
- [ ] Check Jenkins for overnight builds
- [ ] Review any failed tests
- [ ] Create feature branch for new work
- [ ] Commit and push regularly
- [ ] Open PR when feature is complete
- [ ] Clean up merged branches

---

**Remember:** Your `automated-tests` repo is your workspace. The other two repos are reference material. Keep them separate!
