import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean),
  }),
);
app.use(express.json({ limit: '32kb' }));

const PORT = Number(process.env.PORT || 8787);
const BASE_PATH = process.env.STATS_BASE_PATH || '/v1';
const STORAGE = (process.env.STATS_STORAGE || (process.env.FIREBASE_SERVICE_ACCOUNT ? 'firestore' : 'file')).toLowerCase();

const DATA_FILE = process.env.STATS_DATA_FILE
  ? path.resolve(process.env.STATS_DATA_FILE)
  : path.resolve('mock_backend', 'data.json');

const FIRESTORE_SUBMISSIONS_COLLECTION = process.env.FIRESTORE_SUBMISSIONS_COLLECTION || 'submissions';
const STATS_MAX_SUBMISSIONS_PER_LEVEL = Number(process.env.STATS_MAX_SUBMISSIONS_PER_LEVEL || 5000);
const STATS_MAX_TOTAL_SUBMISSIONS = Number(process.env.STATS_MAX_TOTAL_SUBMISSIONS || 20000);
const ALLOW_ADMIN_RESET = String(process.env.ALLOW_ADMIN_RESET || '').toLowerCase() === 'true';

function initFirestoreIfNeeded() {
  if (STORAGE !== 'firestore') return null;

  // This backend is meant to run on a free host (Render/etc.) while keeping Firebase on Spark plan.
  // Auth is via a Firebase service-account JSON placed in env var FIREBASE_SERVICE_ACCOUNT.
  // The Admin SDK bypasses Firestore rules (rules still protect direct client access).
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('STATS_STORAGE=firestore requires FIREBASE_SERVICE_ACCOUNT env var (full JSON).');
  }
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('STATS_STORAGE=firestore requires FIREBASE_PROJECT_ID env var (lowercase project id).');
  }

  if (admin.apps.length === 0) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  return admin.firestore();
}

const firestore = initFirestoreIfNeeded();

/**
 * Anonymous submission shape (no user identifiers):
 * { level:number, time:number, moves:number, spins:number, blocksRemoved:number }
 */

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { submissions: [] };
    if (!Array.isArray(parsed.submissions)) parsed.submissions = [];
    return parsed;
  } catch (e) {
    if (e && e.code === 'ENOENT') return { submissions: [] };
    throw e;
  }
}

async function writeData(data) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function listSubmissionsAll() {
  if (firestore) {
    const snap = await firestore
      .collection(FIRESTORE_SUBMISSIONS_COLLECTION)
      .orderBy('timestamp', 'desc')
      .limit(STATS_MAX_TOTAL_SUBMISSIONS)
      .get();
    return snap.docs.map((d) => d.data());
  }

  const data = await readData();
  return data.submissions;
}

async function listSubmissionsForLevel(level) {
  if (firestore) {
    const snap = await firestore
      .collection(FIRESTORE_SUBMISSIONS_COLLECTION)
      .where('level', '==', level)
      .orderBy('timestamp', 'desc')
      .limit(STATS_MAX_SUBMISSIONS_PER_LEVEL)
      .get();
    return snap.docs.map((d) => d.data());
  }

  const data = await readData();
  return data.submissions.filter((s) => s.level === level);
}

async function addSubmission(submission) {
  if (firestore) {
    await firestore.collection(FIRESTORE_SUBMISSIONS_COLLECTION).add(submission);
    return;
  }

  const data = await readData();
  data.submissions.push(submission);
  await writeData(data);
}

async function resetAllSubmissions() {
  if (firestore) {
    // Basic batch delete, bounded by STATS_MAX_TOTAL_SUBMISSIONS to avoid runaway deletes in free-tier.
    const snap = await firestore.collection(FIRESTORE_SUBMISSIONS_COLLECTION).limit(STATS_MAX_TOTAL_SUBMISSIONS).get();
    const batch = firestore.batch();
    for (const doc of snap.docs) batch.delete(doc.ref);
    await batch.commit();
    return;
  }

  await writeData({ submissions: [] });
}

function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
}

function clampInt(n, min, max) {
  const v = Math.trunc(n);
  return Math.max(min, Math.min(max, v));
}

function quantile(sortedAsc, q) {
  if (!sortedAsc.length) return null;
  if (sortedAsc.length === 1) return sortedAsc[0];
  const pos = (sortedAsc.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const a = sortedAsc[base];
  const b = sortedAsc[Math.min(base + 1, sortedAsc.length - 1)];
  return a + (b - a) * rest;
}

function median(sortedAsc) {
  return quantile(sortedAsc, 0.5);
}

function computeAggregatesForLevel(level, submissions) {
  const levelSubs = submissions.filter((s) => s.level === level);
  if (!levelSubs.length) return null;

  const times = levelSubs.map((s) => s.time).filter(isFiniteNumber).sort((a, b) => a - b);
  const moves = levelSubs.map((s) => s.moves).filter(isFiniteNumber).sort((a, b) => a - b);
  const spins = levelSubs.map((s) => s.spins).filter(isFiniteNumber).sort((a, b) => a - b);
  const blocksRemoved = levelSubs.map((s) => s.blocksRemoved).filter(isFiniteNumber).sort((a, b) => a - b);

  const medianTime = median(times);
  const medianMoves = median(moves);
  const medianSpins = median(spins);
  const medianBlocksRemoved = median(blocksRemoved);

  // Efficiency metrics
  const movesPerBlockArr = levelSubs
    .map((s) => (s.blocksRemoved > 0 ? s.moves / s.blocksRemoved : s.moves))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);
  const timePerMoveArr = levelSubs
    .map((s) => (s.moves > 0 ? s.time / s.moves : s.time))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);
  // Blocks per spin: higher is better. If spins==0, treat as blocksRemoved (\"no spins\" is great, but bounded).
  const blocksPerSpinArr = levelSubs
    .map((s) => (s.spins > 0 ? s.blocksRemoved / s.spins : s.blocksRemoved))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);

  const avgMovesPerBlock = movesPerBlockArr.reduce((acc, v) => acc + v, 0) / (movesPerBlockArr.length || 1);
  const avgTimePerMove = timePerMoveArr.reduce((acc, v) => acc + v, 0) / (timePerMoveArr.length || 1);
  const avgBlocksPerSpin = blocksPerSpinArr.reduce((acc, v) => acc + v, 0) / (blocksPerSpinArr.length || 1);

  // Spin usage distribution (0..3, clamped)
  const spinUsageDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const s of levelSubs) {
    const k = clampInt(s.spins ?? 0, 0, 3);
    spinUsageDistribution[k] = (spinUsageDistribution[k] || 0) + 1;
  }

  return {
    level,
    medianTime,
    medianMoves,
    medianSpins,
    medianBlocksRemoved,
    p25Time: quantile(times, 0.25),
    p75Time: quantile(times, 0.75),
    p25Moves: quantile(moves, 0.25),
    p75Moves: quantile(moves, 0.75),
    completionRate: 1, // mock backend only records completions
    totalAttempts: levelSubs.length,
    lastUpdated: Date.now(),
    // Efficiency (lower is better except blocksPerSpin)
    avgMovesPerBlock,
    avgTimePerMove,
    avgBlocksPerSpin,
    medianMovesPerBlock: median(movesPerBlockArr),
    p25MovesPerBlock: quantile(movesPerBlockArr, 0.25),
    p75MovesPerBlock: quantile(movesPerBlockArr, 0.75),
    medianTimePerMove: median(timePerMoveArr),
    p25TimePerMove: quantile(timePerMoveArr, 0.25),
    p75TimePerMove: quantile(timePerMoveArr, 0.75),
    medianBlocksPerSpin: median(blocksPerSpinArr),
    p25BlocksPerSpin: quantile(blocksPerSpinArr, 0.25),
    p75BlocksPerSpin: quantile(blocksPerSpinArr, 0.75),
    spinUsageDistribution,
  };
}

function validateSubmission(body) {
  const level = Number(body?.level);
  const time = Number(body?.time);
  const moves = Number(body?.moves);
  const spins = Number(body?.spins);
  const blocksRemoved = Number(body?.blocksRemoved);

  if (!Number.isInteger(level) || level < 0) return { ok: false, error: 'Invalid level' };
  if (!isFiniteNumber(time) || time < 0 || time > 60 * 60) return { ok: false, error: 'Invalid time' };
  if (!Number.isInteger(moves) || moves < 0 || moves > 100000) return { ok: false, error: 'Invalid moves' };
  if (!Number.isInteger(spins) || spins < 0 || spins > 1000) return { ok: false, error: 'Invalid spins' };
  if (!Number.isInteger(blocksRemoved) || blocksRemoved < 0 || blocksRemoved > 100000) return { ok: false, error: 'Invalid blocksRemoved' };

  return {
    ok: true,
    submission: {
      level,
      time,
      moves,
      spins,
      blocksRemoved,
      timestamp: Date.now(),
    },
  };
}

app.get(`${BASE_PATH}/health`, (_req, res) => {
  res.json({
    ok: true,
    service: 'jarrows-stats',
    version: 2,
    storage: firestore ? 'firestore' : 'file',
  });
});

app.post(`${BASE_PATH}/submit`, async (req, res) => {
  try {
    const v = validateSubmission(req.body);
    if (!v.ok) return res.status(400).json({ success: false, error: v.error });

    await addSubmission(v.submission);

    res.json({ success: true });
  } catch (e) {
    console.error('submit error', e);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
});

app.get(`${BASE_PATH}/stats/:level`, async (req, res) => {
  try {
    const level = Number(req.params.level);
    if (!Number.isInteger(level) || level < 0) return res.status(400).json({ error: 'Invalid level' });

    const subs = await listSubmissionsForLevel(level);
    const stats = computeAggregatesForLevel(level, subs);
    // For local dev, prefer a non-error response when a level has no submissions yet.
    // This avoids scary 404s in the browser console while you're still populating data.
    if (!stats) {
      return res.json({
        level,
        totalAttempts: 0,
        completionRate: 0,
        lastUpdated: Date.now(),
      });
    }
    res.json(stats);
  } catch (e) {
    console.error('stats/:level error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get(`${BASE_PATH}/stats/all`, async (_req, res) => {
  try {
    const subs = await listSubmissionsAll();
    const levels = Array.from(new Set(subs.map((s) => s.level))).sort((a, b) => a - b);
    const all = levels.map((lvl) => computeAggregatesForLevel(lvl, subs)).filter(Boolean);
    res.json(all);
  } catch (e) {
    console.error('stats/all error', e);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Dev-only helper: reset all stored submissions
app.post(`${BASE_PATH}/admin/reset`, async (_req, res) => {
  try {
    if (!ALLOW_ADMIN_RESET) {
      return res.status(403).json({ success: false, error: 'admin/reset disabled' });
    }
    await resetAllSubmissions();
    res.json({ success: true });
  } catch (e) {
    console.error('admin/reset error', e);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`[jarrows-mock-stats] listening on http://localhost:${PORT}${BASE_PATH}`);
  console.log(`[jarrows-mock-stats] storage: ${firestore ? 'firestore' : 'file'}`);
  if (!firestore) console.log(`[jarrows-mock-stats] data file: ${DATA_FILE}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`[jarrows-mock-stats] ERROR: port ${PORT} is already in use.`);
    console.error(`[jarrows-mock-stats] If you already have the mock backend running, don't start it again.`);
    console.error(`[jarrows-mock-stats] To run on a different port:`);
    console.error(`  PowerShell: $env:PORT=8788; npm run stats:mock`);
    console.error(`  cmd.exe:    set PORT=8788 && npm run stats:mock`);
    process.exit(1);
  }
  console.error('[jarrows-mock-stats] server error', err);
  process.exit(1);
});


