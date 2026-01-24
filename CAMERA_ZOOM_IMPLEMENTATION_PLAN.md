# Camera & Zoom Implementation Plan (Extended)

**Version:** 1.1  
**Created:** 2026-01-24  
**Goal:** Implement UI-aware viewport, explicit padding, and all suggested camera/zoom/pan improvements so that:
1. **All blocks visible** at all times (desktop / tablet / mobile).
2. **No excessive padding** on top, bottom, left, right.
3. **Bottom buttons never overlap** blocks.

Reference: ideal zoom/aspect snippets (early Level 3, late Level 22, desktop + mobile).

---

## Phase 0: Prerequisites & Conventions

### 0.1 Coordinate / space conventions (existing)
- Right-handed, Y-up. Camera uses spherical coords (radius, azimuth, elevation) around tower center.
- `towerCenter` = (3.5, 0, 3.5). `framingOffsetY` = look-at offset above tower (default 4.8).
- Zoom fit uses **perspective projection**: `heightDistance`, `widthDistance` from FOV + aspect; `requiredDistance = max(height, width) * multiplier`.

### 0.2 Files to touch
| File | Purpose |
|------|---------|
| `src/main.js` | All camera constants, helpers, zoom math, resize, animate |

### 0.3 UI dimensions (from `index.html`)

| Element | Desktop | Mobile (≤600px) |
|---------|---------|------------------|
| Stats bar | `top: 20px`, `min-height: 52px`, `padding: 8px 24px` | Same |
| Game controls | `bottom: 20px`, `gap: 20px`, 6 buttons | `bottom: 12px`, `gap: 12px` |
| Control bar height | ~88px | ~80px |

Use **600px** as breakpoint to match `@media (max-width: 600px)`.

---

## Phase 1: Centralize constants (camera config)

**Objective:** Single source of truth for camera/zoom constants. Document padding semantics (half per side vs total). Remove or use `DESKTOP_ZOOM_PADDING_MULTIPLIER`.

### 1.1 Add `cameraConfig` object

**Location:** `main.js`, immediately after existing camera constants (~853–869).

```js
const cameraConfig = {
    MIN_RADIUS: 5,
    MAX_RADIUS: 50,
    MIN_RADIUS_SPAWN: 8,
    MIN_ELEVATION: -Math.PI / 2 + 0.1,
    MAX_ELEVATION: Math.PI / 2 - 0.1,
    PADDING_DESKTOP: 1.5,
    PADDING_MOBILE: 0.2,
    PADDING_TABLET: 0.8,
    PADDING_MIN: 0.15,
    PADDING_MAX: 2.0,
    COMFORT_HEIGHT_DESKTOP: 0.5,
    COMFORT_HEIGHT_MOBILE: 0,
    MULTIPLIER_DESKTOP: 1.12,
    MULTIPLIER_MOBILE: 1.02,
    MULTIPLIER_TABLET: 1.05,
    STATS_BAR_TOP: 20,
    STATS_BAR_HEIGHT: 52,
    GAME_CONTROLS_BOTTOM_DESKTOP: 20,
    GAME_CONTROLS_BOTTOM_MOBILE: 12,
    GAME_CONTROLS_HEIGHT_DESKTOP: 88,
    GAME_CONTROLS_HEIGHT_MOBILE: 80,
    PLAYABLE_BREAKPOINT_PX: 600,
    ASPECT_CLAMP_MIN: 0.5,
    ASPECT_CLAMP_MAX: 2.0,
    SMOOTHING_RADIUS: 0.1,
    SMOOTHING_ORBIT: 0.15,
    SMOOTHING_SPAWN: 0.25,
    SMOOTHING_TOWER_OFFSET: 0.2,
    SMOOTHING_TOWER_OFFSET_SPAWN: 0.3,
    SNAP_EPS: 1e-4,
};
```

**Padding:** "half per axis" — we add `effectivePadding * 2` in height/width formulas.

### 1.2 Migrate usage
- Replace scattered `MIN_RADIUS`, `ZOOM_PADDING`, etc. with `cameraConfig.*` or aliases.
- Remove or repurpose `DESKTOP_ZOOM_PADDING_MULTIPLIER`.

### 1.3 Acceptance criteria
- [x] All zoom/padding constants live in `cameraConfig` (or aliased). *(Done 2026-01-24)*
- [x] Padding semantics documented.

---

## Phase 2: UI-aware viewport (playable rect)

**Objective:** Fit blocks to the visible region between stats bar and game controls; keep buttons from overlapping.

### 2.1 `getPlayableViewport()`

Use `cameraConfig` for UI dimensions. Return `fullWidth`, `fullHeight`, `playableY`, `playableHeight`, `playableAspect`, `topReserved`, `bottomReserved`. Breakpoint `PLAYABLE_BREAKPOINT_PX`.

```js
function getPlayableViewport() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isNarrow = w <= cameraConfig.PLAYABLE_BREAKPOINT_PX;
    const bottom = isNarrow ? cameraConfig.GAME_CONTROLS_BOTTOM_MOBILE : cameraConfig.GAME_CONTROLS_BOTTOM_DESKTOP;
    const ctrlH = isNarrow ? cameraConfig.GAME_CONTROLS_HEIGHT_MOBILE : cameraConfig.GAME_CONTROLS_HEIGHT_DESKTOP;
    const bottomReserved = bottom + ctrlH;
    const topReserved = cameraConfig.STATS_BAR_TOP + cameraConfig.STATS_BAR_HEIGHT;
    const playableHeight = Math.max(1, h - topReserved - bottomReserved);
    return {
        fullWidth: w, fullHeight: h,
        playableY: topReserved, playableHeight,
        playableAspect: w / playableHeight,
        topReserved, bottomReserved,
    };
}
```

### 2.2 Use playable aspect in zoom
- **Spawn zoom** (~8328–8360): `aspect = getPlayableViewport().playableAspect` for `widthDistance`.
- **Gameplay auto-zoom** (~8518–8540): same.
- **Initial camera:** keep `camera.aspect` full-window; use `playableAspect` only for distance math.

### 2.3 Resize
- Resize handler updates `camera.aspect` and `renderer.setSize`. `getPlayableViewport()` uses current dimensions.

### 2.4 Acceptance criteria
- [ ] All blocks visible; bottom buttons never overlap (early/late, desktop/mobile).

---

## Phase 3: Explicit padding & platform tier

**Objective:** `getEffectivePadding(tier)` with min/max, optional aspect scale. Platform tier: desktop / mobile / tablet.

### 3.1 `getPlatformTier()`
- `isTablet`: `matchMedia('(pointer: coarse)').matches && innerWidth >= 600 && innerWidth <= 1024`.
- Return `'desktop' | 'mobile' | 'tablet'`.

### 3.2 `getEffectivePadding(tier)`
- Base from `cameraConfig.PADDING_DESKTOP` / `PADDING_MOBILE` / `PADDING_TABLET`.
- Optional aspect scale (e.g. 0.9 when `playableAspect > 1.8` or `< 0.6`).
- Clamp to `[PADDING_MIN, PADDING_MAX]`.

### 3.3 Fit vs comfort (Phase 3b)
- **Comfort height:** Add `COMFORT_HEIGHT_DESKTOP` (e.g. 0.5) to height term on desktop. Mobile: 0.
- **Mobile clipping:** If needed, increase `PADDING_MOBILE` to 0.4–0.5.

### 3.4 Use everywhere
Replace all `effectivePadding` / `initialPadding` with `getEffectivePadding(getPlatformTier())`.

### 3.5 Acceptance criteria
- [ ] Padding in `[MIN, MAX]`; no excessive padding; comfort margin applied.

---

## Phase 4: Multipliers and aspect clamp

**Objective:** Use `getPlatformTier()` for multipliers. Clamp aspect in zoom math.

### 4.1 Multipliers
- `autoZoomMultiplier` from `cameraConfig.MULTIPLIER_*` based on tier.

### 4.2 Aspect clamp
- Before using `aspect` in `widthDistance`:  
  `aspect = Math.max(cameraConfig.ASPECT_CLAMP_MIN, Math.min(cameraConfig.ASPECT_CLAMP_MAX, aspect));`

### 4.3 Acceptance criteria
- [ ] Multipliers applied; extreme aspect ratios don't break zoom.

---

## Phase 5: Improve initial camera position

**Objective:** Level-based `estimatedTowerHeight`, aspect-aware safety margin, reuse FOV math.

### 5.1 Level-based tower height
- `estimatedTowerHeight = 2 + (currentLevel || 1) * 0.2`, clamped to `[4, 14]`.
- Use in vertical-distance formula.

### 5.2 Aspect-aware safety
- `safety = 1.05` normally; `1.08` when `playableAspect > 1.8` or `< 0.6`.

### 5.3 Reuse FOV structure
- Same `horizontalDistance` / `verticalDistance` structure as zoom (playable aspect, `getEffectivePadding`).

### 5.4 Acceptance criteria
- [ ] First frame good for early and late levels; fewer post-spawn corrections.

---

## Phase 6: Smoothing and snap

**Objective:** Different smoothing for radius vs orbit; snap only when idle.

### 6.1 Radius vs orbit
- **Radius:** `SMOOTHING_RADIUS` (0.1) gameplay; `SMOOTHING_SPAWN` (0.25) spawn.
- **Azimuth / elevation:** `SMOOTHING_ORBIT` (0.15).

### 6.2 Snap only when idle
- Snap only when **not** `isDraggingCamera` and **not** `isZooming`. Use `SNAP_EPS`.

### 6.3 Tower offset
- `SMOOTHING_TOWER_OFFSET` (gameplay), `SMOOTHING_TOWER_OFFSET_SPAWN` (spawn) for `towerPositionOffset`.

### 6.4 Optional
- Slight ease-out for last 10–20% of zoom.

### 6.5 Acceptance criteria
- [ ] Radius slower than orbit; no snap during drag/zoom; tower offset smooth.

---

## Phase 7: Vertical centering

**Objective:** Call `centerTowerVertically` at end of spawn; optional periodic update.

### 7.1 End of spawn
- When `isGeneratingLevel` → `false`, call `centerTowerVertically()`.

### 7.2 Optional
- Low-frequency vertical-center update during gameplay (e.g. on block remove).

### 7.3 Acceptance criteria
- [ ] Tower vertically centered after spawn; smooth transition.

---

## Phase 8: Unify spawn vs gameplay zoom

**Objective:** Single `computeZoomRadiusForBox(box, isSpawn)` for both.

### 8.1 Extract helper
- Input: world `Box3`, `isSpawn`.
- Reuse perspective math; use playable aspect (clamped), `getEffectivePadding`, comfort, multiplier.
- Return `{ requiredDistance, heightDistance, widthDistance }`.

### 8.2 Spawn / gameplay
- Spawn: `computeZoomRadiusForBox(_spawnZoomBox, true)`; apply with spawn smoothing.
- Gameplay: `computeZoomRadiusForBox(_autoZoomBox, false)`; apply with `AUTO_ZOOM_SMOOTHING`.

### 8.3 Transition
- When `isGeneratingLevel` → false, don't reset `smoothedAutoZoomRadius` / `targetRadius`; let gameplay zoom adjust from last spawn value.

### 8.4 Acceptance criteria
- [ ] Single source of truth; no spawn→gameplay zoom jump.

---

## Phase 9: Zoom limits per phase (optional)

**Objective:** Stricter `MIN_RADIUS` during spawn.

### 9.1 Spawn vs gameplay
- Spawn: use `MIN_RADIUS_SPAWN` (8) when clamping.
- Gameplay: use `MIN_RADIUS` (5).

### 9.2 Acceptance criteria
- [ ] Spawn never zooms in past `MIN_RADIUS_SPAWN`.

---

## Phase 10: Zoom-out on block remove (optional)

**Objective:** Brief zoom-out when a block is removed.

### 10.1 Trigger
- On block removal: `targetRadius *= 1.03`, clamped to `MAX_RADIUS`.

### 10.2 Ease back
- Auto-zoom continues; `requiredDistance` from smaller bbox eases back.

### 10.3 Acceptance criteria
- [ ] Slight zoom-out on remove; smooth return.

---

## Phase 11: Adaptive look-at Y (optional)

**Objective:** Default `framingOffsetY` from tower height; keep user override; smooth.

### 11.1 Compute
- From bbox: `centerY` or `baseY + f * towerHeight`; clamp to `[MIN_FRAMING_OFFSET_Y, MAX_FRAMING_OFFSET_Y]`.

### 11.2 Override
- User (two-finger, Settings) overrides; smooth over frames.

### 11.3 Acceptance criteria
- [ ] Early/late framed well; override works.

---

## Phase 12: Viewport / scissor (optional)

**Objective:** Render 3D only in playable rect.

### 12.1 Before render
- `vp = getPlayableViewport()`. `setScissor` + `setViewport` to playable rect; `setScissorTest(true)`, render, reset.

### 12.2 Acceptance criteria
- [ ] 3D clipped to playable rect; no blocks under UI.

---

## Phase 13: Orbit-aware framing (optional)

**Objective:** Nudge look-at with azimuth so tower stays centered when orbited.

### 13.1 Approach
- Small XZ offset from tower center proportional to `sin`/`cos` of azimuth.

### 13.2 Acceptance criteria
- [ ] Tower visually centered during orbit.

---

## Phase 14: Debug and tune (optional)

**Objective:** `?jarrows_debug=1` logging; optional overlay.

### 14.1 Logging
- Log `heightDistance`, `widthDistance`, `effectiveHeight`/`Width`, which axis won, `framingOffsetY`, `playableAspect`, `effectivePadding`, tier.

### 14.2 Overlay
- Optional "H"/"W" or red box showing limiting axis.

### 14.3 Acceptance criteria
- [ ] Debug logging available; easier tuning.

---

## Implementation order

| Order | Phase | Mandatory? |
|-------|--------|------------|
| 1 | Phase 1: Centralize constants | **Yes** |
| 2 | Phase 2: UI-aware viewport | **Yes** |
| 3 | Phase 3: Explicit padding & platform tier | **Yes** |
| 4 | Phase 4: Multipliers & aspect clamp | **Yes** |
| 5 | Phase 5: Improve initial camera | **Yes** |
| 6 | Phase 6: Smoothing and snap | **Yes** |
| 7 | Phase 7: Vertical centering | **Yes** |
| 8 | Phase 8: Unify spawn/gameplay zoom | **Yes** |
| 9 | Phase 9: Zoom limits per phase | Optional |
| 10 | Phase 10: Zoom-out on block remove | Optional |
| 11 | Phase 11: Adaptive look-at Y | Optional |
| 12 | Phase 12: Viewport/scissor | Optional |
| 13 | Phase 13: Orbit-aware framing | Optional |
| 14 | Phase 14: Debug and tune | Optional |

---

## Testing checklist

- [ ] Desktop, Level 3 & 22: all blocks visible; no UI overlap; padding matches ideal.
- [ ] Mobile portrait, early & late: same.
- [ ] Tablet (if Phase 3/4): same.
- [ ] Resize across 600px: playable aspect, padding, tier update.
- [ ] Extreme aspect: clamp and padding prevent bad zoom.
- [ ] Orbit + manual zoom: work; auto-zoom re-frames correctly.
- [ ] Spawn → gameplay: no zoom jump; vertical centering smooth.
- [ ] Block remove: optional zoom-out (Phase 10) feels natural.

---

## Rollback

- Phase 1: Revert to scattered constants.
- Phase 2: Use `camera.aspect` in zoom and initial camera.
- Phase 3–4: Revert to `isMobileLike`-only; remove aspect clamp.
- Phase 5: Restore fixed `estimatedTowerHeight`, single safety.
- Phase 6: Single smoothing; snap every frame.
- Phase 7: Remove `centerTowerVertically` at end of spawn.
- Phase 8: Separate spawn vs gameplay zoom.
- Phases 9–14: Toggle off or revert independently.

---

## Document updates

- **CAMERA_SYSTEM.md:** Add "Playable viewport & padding," "Config & constants," "Smoothing & snap," "Vertical centering," and reference this plan.
- **DECISIONS.md:** Log `cameraConfig`, UI constants, padding semantics, optional phases.
