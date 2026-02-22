# 🧪 Regression Test Plan — 24HR Truck Fix

> Scope: `24hr-New-UI` + `24hourservice-Backend`

---

## 1. Repositories In Scope

| Repo | Type | Stack | Local URL |
|------|------|-------|-----------|
| `24hr-New-UI` | Frontend | Next.js 15, React 19, TypeScript | `http://localhost:4000` |
| `24hourservice-Backend` | Backend API | Node.js, Express, MongoDB | `http://localhost:3000` |

---

## 2. Modules & Coverage

### Frontend (24hr-New-UI) — E2E Tests

| Module | Routes Tested | Test File | Tests |
|--------|--------------|-----------|-------|
| **Auth** | `/auth/signin`, `/auth/signup`, `/auth/forgot-password`, `/otp-validation`, `/auth/reset-password` | `auth.spec.ts` | 9 |
| **Tickets** | `/tickets`, `/tickets/:id` | `tickets.spec.ts` | 6 |
| **Dashboard** | `/clients`, `/service-providers`, `/analytics`, `/settings`, `/documents`, `/chat` | `dashboard.spec.ts` | 8 |

### Backend (24hourservice-Backend) — API Tests

| Module | Endpoints Tested | Tests |
|--------|-----------------|-------|
| **Health** | `GET /health` | 1 |
| **Auth** | `POST /api/v1/loginUser`, `GET /api/v1/profile` | 4 |
| **Users** | `GET /api/v1/users` | 1 |
| **Tickets** | `GET /api/v1/tickets` | 2 |
| **Organization** | `GET /api/v1/organizations` | 1 |
| **Service Providers** | `GET /api/v1/service-providers` | 1 |
| **Drivers** | `GET /api/v1/drivers` | 1 |
| **Policies** | `GET /api/v1/policies` | 1 |

> **Additional backend routes available** for future tests: invoices, billing, documents, contracts, campaigns, dispatch-teams, agents, chat, KB items, tasks

---

## 3. Test Summary — 36 Tests

| Suite | File | Tests | Tags |
|-------|------|-------|------|
| Auth | `auth.spec.ts` | 9 | `@auth @smoke @regression` |
| Tickets | `tickets.spec.ts` | 6 | `@tickets @regression` |
| Dashboard | `dashboard.spec.ts` | 8 | `@dashboard @regression` |
| API | `api.spec.ts` | 13 | `@api` |
| **Total** | | **36** | |

---

## 4. How To Run

```bash
# 1. Start both local servers
cd "24hr QA/24hourservice-Backend" && node app.js
cd "24hr QA/24hr-New-UI" && npm run dev

# 2. Run tests
cd "24hr QA/automated-tests"
npm test                  # all 36 tests
npm run test:smoke        # critical paths only
npm run test:regression   # full regression
npm run test:api          # backend only (no browser)
npm run test:auth         # auth flows
npm run test:tickets      # ticket CRUD
npm run test:dashboard    # navigation
```

---

## 5. CI/CD Pipeline — Jenkins

The project uses a declarative `Jenkinsfile` to automate test execution.

### Pipeline Stages

| Stage | Action | Reporter |
|-------|--------|----------|
| Install Dependencies | `npm ci` + Chromium install | — |
| Smoke Tests | `@smoke` tagged tests | list, junit |
| E2E Tests | Full Playwright suite (Chromium) | html, json, junit |
| API Tests | `@api` tagged tests | list, junit |

### GitHub Integration

To auto-trigger on push/PR:

1. Install **GitHub plugin** in Jenkins
2. Add a **GitHub PAT** as a Jenkins credential (ID: `github-pat`, scopes: `repo` + `admin:repo_hook`)
3. Set Pipeline source to **Git** → test repo URL → Script path: `Jenkinsfile`
4. Enable **"GitHub hook trigger for GITScm polling"**
5. Add **webhooks** on both GitHub repos:
   - `https://github.com/absswanii/24hourservice-Backend` → Settings → Webhooks
   - `https://github.com/absswanii/24hr-New-UI` → Settings → Webhooks
   - Payload URL: `http://<jenkins-url>/github-webhook/`

---

## 6. Execution Phases

| Phase | Activity | Status |
|-------|----------|--------|
| ✅ Phase 1 | Framework setup, Playwright installed, test structure created | Done |
| ⬜ Phase 2 | Fill `.env` with real credentials from Prisca | **Blocked** |
| ⬜ Phase 3 | Run smoke tests, adjust locators with `npx playwright codegen` | Waiting |
| ⬜ Phase 4 | Full regression run + bug reporting | Waiting |
| ⬜ Phase 5 | Expand to more modules (invoices, billing, campaigns, etc.) | Future |
| ✅ Phase 6 | Jenkins CI pipeline configured + GitHub integration documented | Done |
