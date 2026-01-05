# Stats Backend (Free Plan Friendly)

This backend implements the stats API expected by the Jarrows frontend.

- **Local dev**: stores data in `mock_backend/data.json`
- **Production on free tier**: deploy to a free host (Render) and store data in **Firestore** (Firebase Spark plan)

## What it provides

- `POST /v1/submit` — accepts **anonymous** stats submissions
- `GET /v1/stats/:level` — returns aggregated stats for one level (median + p25/p75)
- `GET /v1/stats/all` — returns aggregated stats for all seen levels
- `POST /v1/admin/reset` — clears stored submissions (**disabled by default**)

## Storage modes

- **File mode (default)**: uses `mock_backend/data.json`
- **Firestore mode**: set `STATS_STORAGE=firestore` and provide Firebase credentials via env vars.

Firestore mode is designed specifically for staying on the **Firebase free (Spark) plan** (no Cloud Functions).

## Run (local)

1. Install deps:

```bash
npm install
```

2. Start the mock backend:

```bash
npm run stats:mock
```

It will print something like:

- `http://localhost:8787/v1`

### If you see `EADDRINUSE`

That means something is already listening on port `8787` (often: you already started the mock backend in another terminal).

Run on another port:

- PowerShell:

```bash
$env:PORT=8788; npm run stats:mock
```

- cmd.exe:

```bash
set PORT=8788 && npm run stats:mock
```

## Point the frontend to it

Create `.env.local` (not committed) with:

```bash
VITE_STATS_API_URL=http://localhost:8787/v1
```

Then run:

```bash
npm run dev
```

## Offline behavior

- If the browser is offline (or the API request fails), the frontend queues submissions in **IndexedDB** and syncs them later.
- Community stats are cached in IndexedDB for 1 hour; when offline, cached stats are shown if available.

## Deploy (Render free plan + Firestore / Spark plan)

1. Ensure Firestore exists (Firebase Console → Build → Firestore Database → Create).
2. In Render, create a **Web Service** from this repo.
   - Root Directory: `mock_backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Add Render environment variables:
   - `STATS_BASE_PATH=/v1`
   - `STATS_STORAGE=firestore`
   - `FIREBASE_PROJECT_ID=jarrows-443ec` (your Firebase Project ID, lowercase)
   - `FIREBASE_SERVICE_ACCOUNT=<paste full JSON>` (same JSON you generated in Firebase Console)
   - `CORS_ORIGIN=https://ozlphrt.github.io` (or `*` while testing)
4. Deploy, then set the frontend:
   - `VITE_STATS_API_URL=https://<your-render-service>.onrender.com/v1`

Notes:
- `POST /v1/admin/reset` is disabled unless `ALLOW_ADMIN_RESET=true` is set in env.

