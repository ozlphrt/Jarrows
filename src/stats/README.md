# Stats System Documentation

## Overview

The competitive stats system tracks player performance and compares it against aggregated community data. It's designed to work completely offline, with automatic syncing when connectivity is restored.

## Architecture

### Modules

1. **stats.js** - Main tracking module
   - Tracks current level stats (time, moves, spins, blocks)
   - Handles level completion and submission
   - Manages community stats loading

2. **statsOffline.js** - Offline queue management
   - Uses IndexedDB to queue submissions when offline
   - Caches community stats locally
   - Handles sync when coming online

3. **statsAPI.js** - API communication
   - Submits stats to backend
   - Fetches community stats
   - Handles retries with exponential backoff

4. **statsComparison.js** - Comparison calculations
   - Calculates percentiles
   - Compares user stats vs community medians
   - Generates overall ratings

5. **statsUI.js** - UI components
   - Updates level complete modal with comparisons
   - Shows offline indicator
   - Displays percentile badges

## Integration Points

### Game Hooks

- **Level Start**: `startLevelStats(level)` - Called when a new level begins
- **Move Tracking**: `trackMove()` - Called on each block move
- **Spin Tracking**: `trackSpin()` - Called when spin button is used
- **Block Removal**: `trackBlockRemoved()` - Called when a block is removed
- **Level Complete**: `completeLevel(time)` - Called when level is finished

### UI Integration

- Level complete modal automatically shows comparison stats
- Offline indicator appears when network is unavailable
- Stats are queued and synced automatically

## Backend Requirements

### API Endpoints

The system expects the following endpoints:

1. **POST /api/submit**
   ```json
   {
     "level": 5,
     "time": 145.5,
     "moves": 42,
     "spins": 1,
     "blocksRemoved": 20
   }
   ```
   Response: `{ "success": true }`

2. **GET /api/stats/:level**
   Response:
   ```json
   {
     "level": 5,
     "medianTime": 180.5,
     "medianMoves": 48,
     "medianSpins": 2,
     "medianBlocksRemoved": 20,
     "p25Time": 150.0,
     "p75Time": 220.0,
     "p25Moves": 40,
     "p75Moves": 55,
     "completionRate": 0.87,
     "totalAttempts": 1234,
     "lastUpdated": 1234567890
   }
   ```

3. **GET /api/stats/all**
   Response: Array of level stats objects

### Configuration

Set the API base URL via environment variable:
```bash
VITE_STATS_API_URL=https://your-api.com/v1
```

### Strict local-only mode

To disable all network calls for stats (no submit, no fetch, no sync):

```bash
VITE_STATS_MODE=local
```

Or update `src/stats/statsAPI.js`:
```javascript
const API_BASE_URL = 'https://your-api.com/v1';
```

## Privacy

- **No user IDs**: Submissions are completely anonymous
- **No IP tracking**: Backend should not log IPs
- **No fingerprinting**: No device/browser fingerprinting
- **Aggregation only**: Only aggregate stats are stored/returned

## Offline Behavior

1. **Submissions**: Queued in IndexedDB when offline
2. **Stats Fetching**: Uses cached stats if available
3. **Sync**: Automatically syncs when coming online
4. **UI**: Shows "Offline" indicator, but game continues normally

## Testing

### Test Offline Mode

1. Open browser DevTools → Network tab
2. Set to "Offline"
3. Complete a level
4. Verify stats are queued (check IndexedDB in DevTools)
5. Go online
6. Verify stats are submitted

### Test Online Mode

1. Ensure backend is running
2. Complete a level
3. Verify stats are submitted immediately
4. Verify comparison stats appear in modal

## Future Enhancements

- Real-time badges during gameplay
- Achievement system
- Progress visualization charts
- Streak tracking
- Smart comparisons (skill-based, recent)

