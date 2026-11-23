# Local verification

Reference for the local verification flow in `AGENTS.md` → Verification
defaults. Why agents sign in with a password locally: vault
`ADR-0004 Agents sign in locally with email and password`.

## Where things run

`npm run agent:up` works out the ports and database from the checkout folder:

| Checkout | Frontend | Backend | Database |
|---|---|---|---|
| main checkout | `localhost:5173` | `localhost:3000` | `spend_trend` |
| `.claude/worktrees/w-NNNN` | `localhost:20000+N` | `localhost:30000+N` | `spend_trend_wNNNN` |

Server pids and logs are in `.agent-env/` (`backend.log`, `frontend.log`).
Read them when a request fails. `agent:up` is safe to rerun: it says so when the
servers are already up, and restarts both if one died.

The local user is `agent@spendtrend.local` (fixed in
`packages/backend/src/scripts/localUser.ts`). `agent:up` creates it with the
default expense categories. The session files from `local:signin` are in
`packages/backend/.agent-auth/`. Rerun `local:signin` after the DB is recreated.

## Browser: an ad-hoc Playwright script

Write the script in `.agent-scratch/` at the worktree root and run it with
`node` from the worktree root. It has to live inside the worktree so that
`@playwright/test` resolves from `node_modules`; a script in `/tmp` can't import
it. `.agent-scratch/` is gitignored, so scripts and screenshots stay out of
commits.

```js
// .agent-scratch/check-dashboard.mjs   run: node .agent-scratch/check-dashboard.mjs
import { chromium } from '@playwright/test'

const FRONTEND_URL = 'http://localhost:20091' // the Frontend line agent:up printed

const browser = await chromium.launch()
const context = await browser.newContext({
  storageState: 'packages/backend/.agent-auth/storage-state.json',
})
const page = await context.newPage()
await page.goto(FRONTEND_URL)
await page.getByRole('button', { name: 'Close' }).click() // the Release Notes modal
await page.getByRole('link', { name: 'Expenses', exact: true }).click()
console.log(await page.getByRole('columnheader').allInnerTexts())
await page.screenshot({ path: '.agent-scratch/expenses.png' })
await browser.close()
```

Locate elements by role, label and text, the same way the unit tests do. Look at
the screenshots with your image-reading tool when layout matters.

## API: curl with the cookie jar

Use the Backend URL `agent:up` printed (`30091` is worktree w-0091's).

```sh
curl -b packages/backend/.agent-auth/cookies.txt http://localhost:30091/api/auth/get-session
curl -b packages/backend/.agent-auth/cookies.txt -H 'Content-Type: application/json' \
  -d '{"...": "..."}' http://localhost:30091/<route>
```

## Gotchas

- **Use `localhost`, not `127.0.0.1`.** The session cookie is set for
  `localhost` and marked Secure, so curl and the browser only send it to
  `localhost`.
- **One storage state per worktree.** Browsers share `localhost` cookies across
  ports, so a shared browser profile mixes up worktrees' sessions. Start each
  script from its own worktree's `storage-state.json`.
- **Release Notes modal blocks clicks.** The storage state carries cookies but
  no localStorage, so every new browser context opens the Release Notes modal
  and its overlay swallows clicks. Close it first.
- **Chromium missing**: run `npx playwright install chromium` once.
- **Frontend type errors about contracts** in a fresh worktree: run
  `npx tsc -b ./contracts`.
- **Sign-in fails with 4xx**: the backend isn't running with `NODE_ENV=local`
  (use `agent:up`, not `npm run dev` against another checkout's DB), or the user
  is missing (`agent:up` creates it).

## The "Verified locally" PR section

Add it after the summary. One line per flow clicked or endpoint called, with
what you checked and the result. No screenshots.

```md
## Verified locally
- Expenses page: added an expense with a subcategory; it appears in the table and the month total updates. ✅
- `POST /createexpensecategory` with a new name: 200, and the category shows on Manage Categories. ✅
```

If local verification found a bug you fixed, say so on that line. If it was
skipped because the work item says not to run the app, say that instead.

## Cleaning up

- After the PR merges, from the main checkout:
  `npm run worktree:remove -- NNNN` stops the servers, removes the worktree and
  drops its DB. It keeps the DB when git refuses to remove a dirty worktree.
- `npm run db:prune` drops any `spend_trend_w*` DB whose worktree folder is gone.
