import corsLib from 'cors';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import admin from 'firebase-admin';

// Global defaults (region can be changed later)
setGlobalOptions({ region: 'us-central1' });

admin.initializeApp();
const db = admin.firestore();

const cors = corsLib({ origin: true });

const BASE_PATH = '/v1';

function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
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

function clampInt(n, min, max) {
  const v = Math.trunc(n);
  return Math.max(min, Math.min(max, v));
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
    submission: { level, time, moves, spins, blocksRemoved },
  };
}

async function computeAggregatesForLevel(level, docs) {
  const rows = docs.filter((d) => d.level === level);
  if (!rows.length) return null;

  const times = rows.map((s) => s.time).filter(isFiniteNumber).sort((a, b) => a - b);
  const moves = rows.map((s) => s.moves).filter(isFiniteNumber).sort((a, b) => a - b);
  const spins = rows.map((s) => s.spins).filter(isFiniteNumber).sort((a, b) => a - b);
  const blocksRemoved = rows.map((s) => s.blocksRemoved).filter(isFiniteNumber).sort((a, b) => a - b);

  const movesPerBlockArr = rows
    .map((s) => (s.blocksRemoved > 0 ? s.moves / s.blocksRemoved : s.moves))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);
  const timePerMoveArr = rows
    .map((s) => (s.moves > 0 ? s.time / s.moves : s.time))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);
  const blocksPerSpinArr = rows
    .map((s) => (s.spins > 0 ? s.blocksRemoved / s.spins : s.blocksRemoved))
    .filter(isFiniteNumber)
    .sort((a, b) => a - b);

  const avg = (arr) => (arr.length ? arr.reduce((a, v) => a + v, 0) / arr.length : null);

  // Spin usage distribution (0..3, clamped)
  const spinUsageDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const s of rows) {
    const k = clampInt(s.spins ?? 0, 0, 3);
    spinUsageDistribution[k] = (spinUsageDistribution[k] || 0) + 1;
  }

  return {
    level,
    medianTime: median(times),
    medianMoves: median(moves),
    medianSpins: median(spins),
    medianBlocksRemoved: median(blocksRemoved),
    p25Time: quantile(times, 0.25),
    p75Time: quantile(times, 0.75),
    p25Moves: quantile(moves, 0.25),
    p75Moves: quantile(moves, 0.75),
    completionRate: 1, // submissions are only from completed levels
    totalAttempts: rows.length,
    lastUpdated: Date.now(),
    // Efficiency
    avgMovesPerBlock: avg(movesPerBlockArr),
    avgTimePerMove: avg(timePerMoveArr),
    avgBlocksPerSpin: avg(blocksPerSpinArr),
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

async function loadAllSubmissionsForAggregation() {
  // NOTE: For early scale this is fine. For very large datasets, move to windowed
  // aggregation or pre-aggregated histograms.
  const snap = await db.collection('submissions').select('level', 'time', 'moves', 'spins', 'blocksRemoved').get();
  return snap.docs.map((d) => d.data());
}

export const api = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname || '';

      if (pathname === `${BASE_PATH}/health`) {
        return res.json({ ok: true, service: 'jarrows-firebase-stats', version: 1 });
      }

      if (pathname === `${BASE_PATH}/submit` && req.method === 'POST') {
        const v = validateSubmission(req.body);
        if (!v.ok) return res.status(400).json({ success: false, error: v.error });

        // Store anonymous submission (no user ID). Server timestamp used for ordering.
        await db.collection('submissions').add({
          ...v.submission,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.json({ success: true });
      }

      const levelMatch = pathname.match(new RegExp(`^${BASE_PATH}/stats/(\\d+)$`));
      if (levelMatch && req.method === 'GET') {
        const level = Number(levelMatch[1]);
        const doc = await db.collection('level_stats').doc(String(level)).get();
        if (!doc.exists) {
          // Return empty stats (not 404) to avoid noisy console errors in the client.
          return res.json({ level, totalAttempts: 0, completionRate: 0, lastUpdated: Date.now() });
        }
        return res.json(doc.data());
      }

      if (pathname === `${BASE_PATH}/stats/all` && req.method === 'GET') {
        const snap = await db.collection('level_stats').get();
        const all = snap.docs.map((d) => d.data()).filter(Boolean);
        // sort by level numeric
        all.sort((a, b) => Number(a.level) - Number(b.level));
        return res.json(all);
      }

      return res.status(404).json({ error: 'Not found' });
    } catch (e) {
      console.error('api error', e);
      return res.status(500).json({ error: 'Internal error' });
    }
  });
});

export const aggregateStats = onSchedule('every 15 minutes', async () => {
  try {
    const docs = await loadAllSubmissionsForAggregation();
    const levels = Array.from(new Set(docs.map((d) => d.level))).sort((a, b) => a - b);

    const batch = db.batch();
    let writes = 0;
    for (const level of levels) {
      const agg = await computeAggregatesForLevel(level, docs);
      if (!agg) continue;
      const ref = db.collection('level_stats').doc(String(level));
      batch.set(ref, agg, { merge: true });
      writes++;
      // Firestore batch limit is 500; keep safe.
      if (writes >= 450) {
        await batch.commit();
        writes = 0;
      }
    }
    if (writes > 0) {
      await batch.commit();
    }
  } catch (e) {
    console.error('aggregateStats error', e);
  }
});



