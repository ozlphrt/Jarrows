# Competitive Stats System - Task List

**Version:** 1.0  
**Status:** In Progress  
**Last Updated:** 2026-01-05

---

## Overview

Implement a comprehensive competitive stats system that compares player performance against aggregated community data. All features must work gracefully when offline, with data syncing when connectivity is restored.

---

## Core Principles

1. **Privacy-First**: No user IDs, IPs, or personal data stored
2. **Offline-First**: All features work offline; sync when online
3. **Anonymous Aggregation**: Only aggregate stats, never individual records
4. **Graceful Degradation**: Show local stats when offline, community stats when available

---

## Phase 1: Foundation & MVP

### 1.1 Backend Infrastructure Setup

- [ ] **1.1.1** Choose backend solution
  - Option A: Firebase/Supabase (recommended for quick setup)
  - Option B: Custom REST API (more control)
  - Option C: GitHub Pages + GitHub API (free, but limited)
  - Decision: _______________

- [ ] **1.1.2** Design database schema
  ```javascript
  // Anonymous submissions (no user tracking)
  submissions: {
    level: number,
    time: number,        // seconds
    moves: number,
    spins: number,
    blocksRemoved: number,
    timestamp: number,   // server timestamp
    // NO user ID, IP, or fingerprint
  }
  
  // Aggregated stats (computed periodically)
  levelStats: {
    level: number,
    medianTime: number,
    medianMoves: number,
    medianSpins: number,
    medianBlocksRemoved: number,
    p25Time: number,     // 25th percentile
    p75Time: number,     // 75th percentile
    p25Moves: number,
    p75Moves: number,
    completionRate: number,  // % of attempts that complete
    totalAttempts: number,
    lastUpdated: number,
    // Efficiency metrics
    avgMovesPerBlock: number,
    avgTimePerMove: number,
    spinUsageDistribution: { 0: number, 1: number, 2: number, 3: number }
  }
  ```

- [ ] **1.1.3** Set up API endpoints
  - `POST /api/submit` - Submit anonymous stats (returns success/fail)
  - `GET /api/stats/:level` - Get aggregated stats for a level
  - `GET /api/stats/all` - Get all level stats (for preloading)
  - Rate limiting: Max 10 submissions per minute per IP (prevent abuse)

- [ ] **1.1.4** Implement aggregation service
  - Cron job or serverless function to compute medians/percentiles
  - Run every 15 minutes or when new submissions threshold reached
  - Store aggregated results (don't recompute on every request)

### 1.2 Client-Side Stats Tracking

- [ ] **1.2.1** Create stats tracking module (`src/stats.js`)
  ```javascript
  // Track current level stats
  let currentLevelStats = {
    level: 0,
    startTime: null,
    moves: 0,
    spins: 0,
    blocksRemoved: 0,
    undos: 0  // if we want to track this
  }
  
  // Track all completed levels
  let completedLevels = [] // stored in localStorage
  ```

- [ ] **1.2.2** Integrate with existing game systems
  - Hook into `recordMoveState()` to track moves
  - Hook into timer system to track time
  - Hook into spin button to track spins
  - Hook into block removal to track blocks cleared
  - Hook into level completion to capture final stats

- [ ] **1.2.3** Create stats submission function
  - Queue submissions in IndexedDB (offline support)
  - Retry failed submissions when online
  - Batch multiple submissions if offline for extended period

### 1.3 Offline Support Infrastructure

- [ ] **1.3.1** Set up IndexedDB for offline queue
  ```javascript
  // Database: 'jarrows_stats'
  // Store: 'pending_submissions'
  // Store: 'local_stats_cache' (cached community stats)
  ```

- [ ] **1.3.2** Implement offline detection
  - Use `navigator.onLine` + `online`/`offline` events
  - Show subtle indicator when offline
  - Queue all submissions when offline

- [ ] **1.3.3** Implement sync service
  - On `online` event: process pending submissions queue
  - Retry with exponential backoff
  - Clear queue after successful submission
  - Fetch latest community stats after sync

- [ ] **1.3.4** Local stats storage
  - Store user's own stats in localStorage
  - Calculate local percentiles from cached community stats
  - Fallback to "No comparison data" when offline and no cache

### 1.4 Basic Comparison Display

- [ ] **1.4.1** Extend level complete modal
  - Add comparison section below existing stats
  - Show: Your Time vs Median Time
  - Show: Your Moves vs Median Moves
  - Show: Your Spins vs Median Spins
  - Show percentile badges (e.g., "Top 25%")

- [ ] **1.4.2** Create comparison UI components
  - Stat comparison card component
  - Percentile badge component
  - Offline indicator component

- [ ] **1.4.3** Fetch and display community stats
  - On level load: fetch stats for current level
  - Cache in IndexedDB with TTL (1 hour)
  - Show cached data if fetch fails (offline)

---

## Current Direction (Local-Only, Online Deferred)

We are intentionally deferring online/community backend work for now.

### Strict Local-Only Mode

- [x] **L1** Add strict local-only flag (`VITE_STATS_MODE=local`)
  - No network calls (`fetch`) for stats
  - No online/offline sync listeners for stats

### Personal Baseline (Self Comparison)

- [x] **L2** Compare player against their own history for the same level
  - Median/p25/p75 + efficiency metrics
  - Shown as "Personal (N)" in the modal when community stats are unavailable

### Metric Explainability

- [x] **L3** Tap-to-explain modal for efficiency metrics:
  - `T/M` (time per move, lower is better)
  - `M/B` (moves per block removed, lower is better)
  - `B/S` (blocks per spin, higher is better)

### Personal Profile + Baseline UX

- [x] **L4** Profile modal (all-level summary)
- [x] **L5** Per-level baseline summary row in the level-complete comparison section (median + best)

---

## Phase 2: Enhanced Features

### 2.1 Real-Time Comparison Badges

- [ ] **2.1.1** Create badge system
  - Badge definitions (Speed Demon, Precision Master, etc.)
  - Badge trigger conditions
  - Badge display component

- [ ] **2.1.2** Integrate badge checks
  - Check on level completion
  - Check during gameplay (for time milestones)
  - Show badge animations

- [ ] **2.1.3** Badge persistence
  - Store earned badges in localStorage
  - Show badge collection in settings or stats view

### 2.2 Efficiency Metrics

- [ ] **2.2.1** Calculate efficiency metrics
  - Moves per block cleared
  - Time per move (thinking time)
  - Spin efficiency (blocks cleared per spin)
  - Overall efficiency score (weighted combination)

- [ ] **2.2.2** Display efficiency in UI
  - Add to level complete modal
  - Show comparison with community median
  - Visual efficiency indicator (progress bar)

- [ ] **2.2.3** Track efficiency over time
  - Store efficiency trends
  - Show improvement indicators

### 2.3 Streak & Consistency Tracking

- [ ] **2.3.1** Implement streak tracking
  - Perfect streak (all metrics beat median)
  - Speed streak (time beats median)
  - Efficiency streak (moves beats median)
  - Store in localStorage

- [ ] **2.3.2** Display streak indicators
  - Show current streak in stats bar
  - Show streak milestone notifications
  - Visual streak counter

- [ ] **2.3.3** Streak recovery
  - Handle offline gracefully (don't break streak)
  - Sync streak state when online

### 2.4 Visual Feedback During Play

- [ ] **2.4.1** Enhance stats bar
  - Color-code stats (green/yellow/red based on comparison)
  - Add comparison indicators (↑ faster, ↓ slower)
  - Show "beating median" badges in real-time

- [ ] **2.4.2** Add comparison tooltips
  - Hover/tap stats to see comparison
  - Show percentile on hover

- [ ] **2.4.3** Progress indicators
  - Show progress toward beating median
  - "5 seconds away from top 50%" notifications

---

## Phase 3: Advanced Features

### 3.1 Achievement System

- [ ] **3.1.1** Define achievement categories
  - Speed achievements (beat median time on X levels)
  - Efficiency achievements (beat median moves on X levels)
  - Consistency achievements (streaks)
  - Elite achievements (top 10% on X levels)

- [ ] **3.1.2** Implement achievement tracking
  - Check achievement conditions on level complete
  - Store achievements in localStorage
  - Sync achievements (optional, for cross-device)

- [ ] **3.1.3** Achievement UI
  - Achievement notification modal
  - Achievement collection view (in settings)
  - Achievement badges/icons

### 3.2 Progress Visualization

- [ ] **3.2.1** Create radial chart component
  - Show performance across all metrics
  - Compare user vs median visually
  - Use Chart.js or D3.js (or custom SVG)

- [ ] **3.2.2** Create level heatmap
  - Show which levels user excels at
  - Color-code by performance percentile
  - Interactive: click to see details

- [ ] **3.2.3** Create trend line chart
  - Show improvement over time
  - Track efficiency trends
  - Compare with community trends

### 3.3 Smart Comparisons

- [ ] **3.3.1** Implement skill-based comparison
  - Group players by highest level reached
  - Compare within skill bracket
  - "Players at your level average 2:30 here"

- [ ] **3.3.2** Implement recent performance comparison
  - Compare against last 7 days' data
  - Show "recent median" vs "all-time median"
  - Indicate if level difficulty changed

- [ ] **3.3.3** Level-specific insights
  - "This level is 15% harder than average"
  - "Most players take 3:20 here"
  - "Top players average 45 moves"

### 3.4 Dynamic Difficulty Indicators

- [ ] **3.4.1** Calculate level difficulty
  - Based on median completion time
  - Based on completion rate
  - Based on move count distribution

- [ ] **3.4.2** Display difficulty indicators
  - Show before level starts
  - Update in real-time as community data changes
  - Visual difficulty meter

---

## Phase 4: Polish & Optimization

### 4.1 Performance Optimization

- [ ] **4.1.1** Optimize stats fetching
  - Preload stats for next 3 levels
  - Cache aggressively (IndexedDB + memory)
  - Lazy load stats for levels not yet reached

- [ ] **4.1.2** Optimize submission batching
  - Batch multiple level completions if offline
  - Compress submission data
  - Rate limit client-side

- [ ] **4.1.3** Reduce API calls
  - Fetch all level stats in one call
  - Use ETags for cache validation
  - Implement request deduplication

### 4.2 UI/UX Polish

- [ ] **4.2.1** Smooth animations
  - Badge reveal animations
  - Stat comparison transitions
  - Progress bar animations

- [ ] **4.2.2** Responsive design
  - Mobile-friendly comparison displays
  - Touch-optimized interactions
  - Adaptive layouts for small screens

- [ ] **4.2.3** Accessibility
  - ARIA labels for stats
  - Keyboard navigation
  - Screen reader support

### 4.3 Error Handling & Edge Cases

- [ ] **4.3.1** Handle API failures gracefully
  - Show "Stats unavailable" instead of errors
  - Retry with exponential backoff
  - Fallback to cached data

- [ ] **4.3.2** Handle edge cases
  - First player on a level (no median yet)
  - Very small sample sizes (< 10 players)
  - Outlier detection (prevent skewing)

- [ ] **4.3.3** Data validation
  - Validate submission data (prevent bad data)
  - Sanitize inputs
  - Handle malformed responses

### 4.4 Privacy & Security

- [ ] **4.4.1** Implement privacy safeguards
  - No fingerprinting
  - Randomize submission timing (add jitter)
  - Optional opt-in/opt-out toggle

- [ ] **4.4.2** Security measures
  - Rate limiting on backend
  - Input validation
  - Prevent injection attacks

- [ ] **4.4.3** Privacy policy updates
  - Document what data is collected
  - Document how data is used
  - Provide opt-out mechanism

---

## Implementation Details

### File Structure

```
src/
  stats/
    stats.js              # Main stats tracking module
    statsAPI.js           # API communication
    statsOffline.js       # Offline queue management
    statsComparison.js    # Comparison calculations
    statsUI.js            # UI components
    achievements.js       # Achievement system
    visualization.js      # Charts and graphs
```

### Key Integration Points

1. **main.js**:
   - Import stats module
   - Initialize on game start
   - Hook into level completion
   - Hook into move/timer/spin tracking

2. **index.html**:
   - Add comparison UI to level complete modal
   - Add stats visualization components
   - Add achievement notifications

3. **Service Worker** (for offline):
   - Cache stats API responses
   - Queue submissions when offline
   - Sync when online

### Data Flow

```
Level Complete
    ↓
Capture Stats (time, moves, spins, blocks)
    ↓
Store Locally (localStorage + IndexedDB queue)
    ↓
Try to Submit (if online)
    ↓
    ├─ Success → Clear queue
    └─ Failure → Queue for later
    ↓
Fetch Community Stats (if online)
    ↓
    ├─ Success → Cache + Display
    └─ Failure → Use cached stats or show "unavailable"
    ↓
Calculate Percentiles
    ↓
Display Comparison UI
```

---

## Testing Checklist

### Offline Testing

- [ ] Complete level while offline
- [ ] Verify stats are queued
- [ ] Go online and verify sync
- [ ] Verify cached stats display when offline
- [ ] Test multiple level completions offline
- [ ] Verify queue doesn't grow unbounded

### Online Testing

- [ ] Submit stats successfully
- [ ] Fetch community stats
- [ ] Display comparisons correctly
- [ ] Handle API errors gracefully
- [ ] Test rate limiting

### Edge Cases

- [ ] First player on a level
- [ ] Very small sample size (< 10)
- [ ] Extreme outliers (prevent skewing)
- [ ] Network timeout
- [ ] Malformed API response
- [ ] localStorage quota exceeded

---

## Deployment Checklist

- [ ] Set up backend infrastructure
- [ ] Configure API endpoints
- [ ] Set up aggregation cron job
- [ ] Test offline functionality
- [ ] Test on multiple devices
- [ ] Performance testing
- [ ] Privacy review
- [ ] Update documentation
- [ ] Update README with new features

---

## Future Enhancements (Post-MVP)

- [ ] Cross-device sync (optional, with user account)
- [ ] Friends comparison (if user accounts added)
- [ ] Daily challenges
- [ ] Leaderboards (anonymous, percentile-based)
- [ ] Replay sharing (if replay system added)
- [ ] Difficulty adjustment based on performance

---

## Notes

- All features must degrade gracefully when offline
- Never break core gameplay if stats system fails
- Keep UI non-intrusive (stats are enhancement, not requirement)
- Consider battery impact of background sync
- Test on low-end devices

---

## Progress Tracking

**Phase 1:** 🟡 In Progress (Client-side complete, backend pending)  
**Phase 2:** ⬜ Not Started  
**Phase 3:** ⬜ Not Started  
**Phase 4:** ⬜ Not Started

**Current Focus:** Local-only UX + self-comparison (online/community backend deferred)

**Completed:**
- ✅ Phase 1.2.1: Stats tracking module created
- ✅ Phase 1.2.2: Integrated with game systems
- ✅ Phase 1.2.3: Stats submission with offline queue
- ✅ Phase 1.3.1: IndexedDB offline queue
- ✅ Phase 1.3.2: Offline detection
- ✅ Phase 1.3.3: Sync service
- ✅ Phase 1.3.4: Local stats storage
- ✅ Phase 1.4.1: Level complete modal extended
- ✅ Phase 1.4.2: Comparison UI components
- ✅ Phase 1.4.3: Community stats fetching and caching
 - ✅ Local-only mode: `VITE_STATS_MODE=local` (no network calls)
 - ✅ Personal comparison: self baseline (per-level)
 - ✅ Metric explain modal for efficiency metrics

---

**Last Updated:** 2026-01-05

