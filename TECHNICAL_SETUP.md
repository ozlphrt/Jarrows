# Technical Setup

## Requirements

- Node.js (recommend LTS)
- npm

## Install

```bash
npm install
```

## Run (frontend)

```bash
npm run dev
```

## Run (mock competitive stats backend)

This repo includes a local mock backend that implements the stats API expected by the game:

- `POST /v1/submit`
- `GET /v1/stats/:level`
- `GET /v1/stats/all`

Start it with:

```bash
npm run stats:mock
```

It listens on:

- `http://localhost:8787/v1`

### If the port is already in use

If you see `EADDRINUSE`, another process is already listening on `8787`.

Run the mock backend on a different port:

PowerShell:

```bash
$env:PORT=8788; npm run stats:mock
```

cmd.exe:

```bash
set PORT=8788 && npm run stats:mock
```

Then update `.env.local` accordingly, e.g.:

```bash
VITE_STATS_API_URL=http://localhost:8788/v1
```

## Point the frontend to the mock backend

Create a local environment file **(not committed)**:

```bash
.env.local
```

And set:

```bash
VITE_STATS_API_URL=http://localhost:8787/v1
```

Then run:

```bash
npm run dev
```

## Offline behavior (stats)

- When offline (or when the stats API fails), the game queues submissions in **IndexedDB** and retries automatically when online.
- Community stats responses are cached (1 hour TTL); when offline, cached stats are used if available.

## Strict local-only stats (no network calls)

If you want **zero** network calls for stats (no submit, no community fetch, no sync), set:

```bash
VITE_STATS_MODE=local
```

When `VITE_STATS_MODE=local`:
- No requests are sent to `VITE_STATS_API_URL`
- The offline/sync banner becomes a **local-only** banner
- Community comparison is disabled (user stats still record locally)


