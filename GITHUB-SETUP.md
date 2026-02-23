# 🔗 GitHub Repository Setup

Your local `automated-tests` repo needs to be connected to GitHub. Follow these steps:

---

## Option 1: Create New GitHub Repository (Recommended)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `24hr-automated-tests`
   - **Description:** `Automated E2E and API tests for 24Hr Service platform`
   - **Visibility:** Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
3. Click **Create repository**

### Step 2: Connect Your Local Repo

GitHub will show you commands. Use these:

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# Add the remote
git remote add origin https://github.com/YOUR_USERNAME/24hr-automated-tests.git

# Verify it was added
git remote -v

# Push your branch
git push -u origin feat/jenkins-ci-setup

# Also push master branch
git checkout master
git push -u origin master
```

### Step 3: Set Default Branch (Optional)

If you want `main` instead of `master`:

```bash
# Rename local branch
git branch -m master main

# Push to GitHub
git push -u origin main

# On GitHub: Settings → Branches → Default branch → Change to main
```

---

## Option 2: Use Existing Organization Repo

If the organization already has an `automated-tests` repo:

### Step 1: Check Your Access

1. Go to the repo URL (ask your team lead)
2. Check if you can see it
3. Verify you have Write access

### Step 2: Connect to Existing Repo

```bash
cd "C:\Users\USER\24hr QA\automated-tests"

# Add the remote (replace ORG_NAME with actual organization)
git remote add origin https://github.com/ORG_NAME/automated-tests.git

# Fetch existing branches
git fetch origin

# Check what branches exist
git branch -r

# If main/dev exists, merge or rebase
git checkout master
git pull origin main --allow-unrelated-histories

# Push your feature branch
git push -u origin feat/jenkins-ci-setup
```

---

## Verify Connection

After adding the remote:

```bash
# Check remote is configured
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/24hr-automated-tests.git (fetch)
# origin  https://github.com/YOUR_USERNAME/24hr-automated-tests.git (push)

# Test connection
git fetch origin

# Push your branch
git push -u origin feat/jenkins-ci-setup
```

---

## Next Steps After Push

1. **Go to GitHub** → Your repo
2. **Click "Compare & pull request"**
3. **Add PR description:**

```markdown
## 🚀 Jenkins CI/CD Integration

This PR adds complete Jenkins CI/CD pipeline with notifications.

### Changes
- ✅ Enhanced Jenkinsfile with multi-stage test execution
- ✅ Slack and Telegram notification integration
- ✅ Updated playwright.config.ts for CI environment
- ✅ Comprehensive setup guides and documentation

### New Files
- `JENKINS-SETUP-GUIDE.md` — Complete Jenkins setup instructions
- `GIT-WORKFLOW.md` — Git workflow for 3-repo structure
- `INTEGRATION-SUMMARY.md` — Summary and next steps

### Testing Checklist
- [ ] Manual Jenkins build successful
- [ ] Automatic webhook trigger works
- [ ] Slack notifications received
- [ ] Telegram notifications received
- [ ] HTML reports published
- [ ] Test trends visible in Jenkins

### Documentation
All setup instructions are in `JENKINS-SETUP-GUIDE.md`
```

4. **Merge the PR** (or request review if needed)

---

## Setting Up GitHub Webhook

After your repo is on GitHub:

1. Go to **Settings → Webhooks → Add webhook**
2. Configure:
   - **Payload URL:** `http://YOUR_JENKINS_URL/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Push events + Pull requests
   - ✅ **Active**
3. Click **Add webhook**

---

## Authentication Options

### HTTPS (Easier)

```bash
git remote add origin https://github.com/YOUR_USERNAME/24hr-automated-tests.git
```

When you push, you'll be prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Personal Access Token (NOT your GitHub password)

**Create PAT:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (all)
4. Copy the token
5. Use it as password when pushing

### SSH (More Secure)

```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Use SSH remote
git remote add origin git@github.com:YOUR_USERNAME/24hr-automated-tests.git
```

---

## Troubleshooting

### "fatal: remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/24hr-automated-tests.git
```

### "Authentication failed"

For HTTPS, you need a Personal Access Token, not your password:
1. Create PAT on GitHub (Settings → Developer settings)
2. Use PAT as password when pushing

### "Permission denied (publickey)"

For SSH:
1. Check SSH key is added: `ssh -T git@github.com`
2. Add key to GitHub if not already done
3. Verify SSH agent has the key: `ssh-add -l`

---

## Quick Commands Reference

```bash
# Check current remote
git remote -v

# Add remote
git remote add origin <URL>

# Change remote URL
git remote set-url origin <NEW_URL>

# Remove remote
git remote remove origin

# Test connection
git fetch origin

# Push branch
git push -u origin feat/jenkins-ci-setup

# Push all branches
git push --all origin
```

---

## What Happens After Push?

1. **GitHub receives your code**
2. **Webhook triggers Jenkins** (after you set it up)
3. **Jenkins runs tests automatically**
4. **Notifications sent to Slack/Telegram**
5. **Reports published in Jenkins**

---

## Summary

**Right now, you need to:**

1. ✅ Create GitHub repo (or get URL of existing one)
2. ✅ Add remote: `git remote add origin <URL>`
3. ✅ Push branch: `git push -u origin feat/jenkins-ci-setup`
4. ✅ Open Pull Request on GitHub
5. ✅ Merge to main/master
6. ✅ Follow JENKINS-SETUP-GUIDE.md for Jenkins configuration

**Your changes are committed locally and ready to push!**

---

Need help? Check which option applies to you:
- **New to this project?** → Use Option 1 (create new repo)
- **Organization has existing repo?** → Use Option 2 (connect to existing)
- **Not sure?** → Ask your team lead for the repo URL
