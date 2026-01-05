# Firebase Setup (Competitive Stats Backend)

## Acceptance Criteria

- API endpoints exist and match the frontend contract:
  - `POST /v1/submit`
  - `GET /v1/stats/:level`
  - `GET /v1/stats/all`
- Submissions are **anonymous** (no user IDs stored).
- Works with offline queue: the frontend can post later and still get comparisons.
- Aggregates (median/p25/p75 + efficiency) are available via reads from `level_stats`.

## Prereqs

- Firebase CLI installed: `npm i -g firebase-tools`
- A Firebase project created in the Firebase Console

## No local CLI option (Firebase Console + GitHub Actions)

If you don't want to run the CLI locally, you can still deploy using GitHub Actions.

## Spark (Free Plan) note — recommended setup

Firebase Spark (free) cannot deploy Cloud Functions. For a free-plan setup:

- Use Firebase **Firestore** as the database (Spark plan)
- Deploy the stats API (`mock_backend/`) to a free host (Render)
- (Optional) Deploy Firestore rules only via GitHub Actions

See `mock_backend/README.md` for the Render + Firestore configuration.

### 1) Create Firebase project + enable Firestore (Console)

- Firebase Console → create/select your project
- Build → Firestore Database → Create database (Production mode is fine)

### 2) Billing note (important)

To run the scheduled aggregation (`aggregateStats`) you typically need:
- Firebase plan **Blaze (pay-as-you-go)** (billing)

If deploy later complains about billing/scheduler, upgrade the project to Blaze in Firebase Console → Project Settings → Usage and billing.

### 3) Create a service account key (Console)

- Firebase Console → Project Settings (gear) → **Service accounts**
- Click **Generate new private key**
- Copy the entire JSON (keep it secret)

### 4) Add GitHub Secrets (GitHub UI)

GitHub repo → Settings → Secrets and variables → Actions → New repository secret

- `FIREBASE_PROJECT_ID` = your Firebase project id
- `FIREBASE_SERVICE_ACCOUNT` = paste the full JSON key content

### 5) Deploy from GitHub Actions (GitHub UI)

This repo includes a manual workflow:
- `.github/workflows/firebase_deploy.yml`

Run it:
- GitHub repo → Actions → **Deploy Firebase Stats Backend** → Run workflow

After it completes, find the function URL in Firebase Console → Build → Functions → `api`.

## Initialize

From repo root:

```bash
cd firebase_backend
firebase login
firebase use --add
```

Choose your Firebase project and give it an alias (e.g. `prod`).

## Firestore Rules

Rules are in `firebase_backend/firestore.rules`:

- Public read: `level_stats/*`
- No direct read/write: `submissions/*` (server-only via Admin SDK)

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## Deploy Functions

Install function deps:

```bash
cd firebase_backend/functions
npm install
```

Deploy:

```bash
cd ../
firebase deploy --only functions
```

After deploy, Firebase will print a function URL for `api`.

## Frontend Configuration

Set `.env.local` in repo root:

```bash
VITE_STATS_API_URL=<YOUR_FUNCTION_URL>/v1
```

Example:

```bash
VITE_STATS_API_URL=https://us-central1-your-project.cloudfunctions.net/api/v1
```

Then run the game:

```bash
npm run dev
```

## Emulators (optional)

You can run emulators for local dev if you want (not required for the deployed setup).

```bash
cd firebase_backend
firebase emulators:start
```

## Notes / Scaling

The scheduled aggregation job currently reads all submissions each run (simple + correct for early scale).
For high scale, we should move to windowed aggregation or approximate quantiles (histograms / t-digest).


