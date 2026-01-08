# Firebase Backend (Competitive Stats)

This folder contains a Firebase (Firestore + Cloud Functions) backend for Jarrows competitive stats.

## What it provides

HTTP API (Cloud Functions):

- `POST /v1/submit` — accept anonymous stats submission
- `GET /v1/stats/:level` — aggregated stats for one level (median + p25/p75 + efficiency)
- `GET /v1/stats/all` — aggregated stats for all levels
- `GET /v1/health` — health probe

Scheduled job:

- Periodically recomputes aggregates per level into Firestore `level_stats/{level}`

## Privacy

- No user IDs are accepted or stored.
- Only anonymous gameplay metrics are stored.

## Setup & Deploy

See `FIREBASE_SETUP.md` at repo root.



