# Collision Penalty Brainstorm

## Current State
- **Head-on collisions**: Blocks rotate and continue (special mechanic, no penalty)
- **Side collisions**: Block simply stops (no penalty currently)
- **Time Challenge mode**: Countdown timer with time rewards for block removals
- **Inferno mode**: Similar timer system to Time Challenge, with escalating difficulty

## Penalty Ideas for Side Collisions

### 1. Time-Based Penalties (Time Challenge & Inferno Modes)

**Note**: Both Time Challenge and Inferno modes use timer systems, so time-based penalties apply to both.

#### 1.1 Fixed Time Deduction
- **Mechanic**: Deduct fixed time (e.g., 0.5s, 1s, 2s) per side collision
- **Pros**: Simple, predictable, encourages careful planning
- **Cons**: Can feel punitive if accidental
- **Visual**: Timer flashes red, negative time animation

#### 1.2 Percentage-Based Time Deduction
- **Mechanic**: Deduct percentage of remaining time (e.g., 5%, 10%)
- **Pros**: Scales with difficulty, less harsh early game
- **Cons**: Can be devastating late game
- **Visual**: Timer shrinks proportionally

#### 1.3 Escalating Time Penalty
- **Mechanic**: First collision = 0.5s, second = 1s, third = 2s, etc. (resets per level)
- **Pros**: Rewards careful play, punishes repeated mistakes
- **Cons**: Can snowball if player gets stuck
- **Visual**: Penalty counter badge, escalating animation intensity

#### 1.4 Time Freeze (Temporary)
- **Mechanic**: Freeze timer for X seconds (e.g., 2-5s) on collision
- **Pros**: Doesn't reduce time, but wastes it
- **Cons**: Less impactful than direct deduction
- **Visual**: Timer pauses with ice effect, countdown overlay

### 2. Movement-Based Penalties

**Note**: These work well in Free Flow mode (no timer) and can complement time penalties in Time Challenge/Inferno modes.

#### 2.1 Movement Cooldown
- **Mechanic**: Block cannot move for X seconds after side collision
- **Pros**: Creates tactical pause, forces planning
- **Cons**: Can feel frustrating if accidental
- **Visual**: Block dims/grays out, cooldown timer overlay

#### 2.2 Reverse Movement
- **Mechanic**: Block automatically moves backward 1 cell after collision
- **Pros**: Creates interesting positioning challenges
- **Cons**: Can create cascading collisions
- **Visual**: Block slides back with bounce animation

#### 2.3 Random Direction Change
- **Mechanic**: Block's direction randomly changes after side collision
- **Pros**: Adds chaos, unpredictable outcomes
- **Cons**: Can feel unfair, reduces player agency
- **Visual**: Arrow spins randomly, block rotates

#### 2.4 Block Lock (Temporary) - **NEW PROPOSAL**
- **Mechanic**: Collided block becomes unclickable for X seconds, with lock duration scaling by level
  - Early levels (1-10): 1-2 seconds
  - Mid levels (11-25): 2-4 seconds
  - Late levels (26-50): 3-6 seconds
  - Post-50: 4-8 seconds (scales with level)
- **Visual**: 
  - Block color slightly altered (e.g., desaturated, darker, or tinted gray/red)
  - Lock icon overlay (optional)
  - Disabled cursor on hover
  - Smooth color transition on lock/unlock
- **Pros**: 
  - Prevents spam clicking, forces strategic planning
  - Level-based scaling feels fair and progressive
  - Visual feedback is clear and non-intrusive
  - Works in all game modes (no timer dependency)
- **Cons**: 
  - Can feel restrictive if accidental
  - Need to ensure color change is visible but not jarring
- **Implementation Notes**:
  - Lock duration formula: `baseTime + (level * scalingFactor)`
  - Color alteration: reduce saturation by 40-60%, or apply gray/red tint
  - Track locked state separately from other block states
  - Lock applies to the block that was hit (the stationary one), not the moving one

### 3. Visual/Audio Feedback Penalties

#### 3.1 Screen Shake
- **Mechanic**: Camera shakes on collision (intensity based on block size)
- **Pros**: Provides clear feedback without gameplay impact
- **Cons**: Can be disorienting, accessibility concerns
- **Visual**: Camera shake effect, intensity scales with block length

#### 3.2 Red Flash/Strobe
- **Mechanic**: Screen flashes red on collision
- **Pros**: Clear visual feedback
- **Cons**: Accessibility concerns (epilepsy), can be annoying
- **Visual**: Red overlay flash, optional intensity setting

#### 3.3 Audio Penalty
- **Mechanic**: Harsh sound effect on collision (grinding, crash)
- **Pros**: Immediate feedback, doesn't affect gameplay
- **Cons**: Can be annoying if frequent
- **Audio**: Metal grind, wood crack, glass shatter (configurable)

### 4. Gameplay State Penalties

#### 4.1 Block Removal Penalty
- **Mechanic**: Remove a random block from the tower on collision
- **Pros**: High stakes, dramatic impact
- **Cons**: Can make puzzles unsolvable, very punitive
- **Visual**: Random block explodes/falls, tower adjusts

#### 4.2 Block Spawn Penalty
- **Mechanic**: Spawn an additional block on the tower after collision
- **Pros**: Increases difficulty dynamically
- **Cons**: Can make puzzles unsolvable
- **Visual**: New block spawns with warning animation

#### 4.3 Level Restart Penalty
- **Mechanic**: After N collisions (e.g., 3-5), restart level
- **Pros**: High stakes, encourages perfection
- **Cons**: Very punitive, can frustrate players
- **Visual**: Collision counter, warning at threshold

### 5. Score/Stats Penalties

#### 5.1 Move Counter Penalty
- **Mechanic**: Add extra moves to stats (counts as "wasted" moves)
- **Pros**: Affects leaderboards, encourages efficiency
- **Cons**: Only matters if stats are competitive
- **Visual**: Move counter increments, red highlight

#### 5.2 Efficiency Score Deduction
- **Mechanic**: Deduct points from efficiency score (M/B ratio)
- **Pros**: Affects competitive stats
- **Cons**: Only relevant in competitive mode
- **Visual**: Score animation, efficiency badge update

### 6. Hybrid/Progressive Penalties

#### 6.1 Collision Meter
- **Mechanic**: Track collisions per level, apply escalating penalties:
  - 1-2 collisions: Time freeze (2s)
  - 3-4 collisions: Time deduction (1s each)
  - 5+ collisions: Movement cooldown (3s)
- **Pros**: Balanced, progressive difficulty
- **Cons**: Complex to track and communicate
- **Visual**: Collision meter UI, color-coded thresholds

#### 6.2 Adaptive Penalty System
- **Mechanic**: Penalty type changes based on game state:
  - Early level: Visual feedback only
  - Mid level: Time freeze
  - Late level: Time deduction
  - Time Challenge: Time-based penalties
  - Free Flow: Movement penalties
- **Pros**: Context-aware, balanced
- **Cons**: Complex implementation
- **Visual**: Contextual UI indicators

#### 6.3 Player Choice Penalty
- **Mechanic**: On collision, player chooses penalty:
  - Option A: Lose 2s time
  - Option B: Block locked for 3s
  - Option C: Reverse movement 1 cell
- **Pros**: Player agency, strategic choice
- **Cons**: Interrupts flow, decision fatigue
- **Visual**: Modal with penalty options

### 7. Mode-Specific Penalties

#### 7.1 Time Challenge Mode
- Time deduction (fixed or percentage)
- Time freeze
- Escalating time penalty

#### 7.2 Inferno Mode
- **Same time-based penalties as Time Challenge** (both use timers)
- **Higher penalty values** (scaled by level difficulty)
- Optionally: Combination with movement penalties for extra challenge
- Collision meter with thresholds (optional enhancement)

#### 7.3 Free Flow Mode
- Movement cooldown
- Block lock
- Visual/audio feedback only

## Recommended Implementation (Phase 1)

### Primary Recommendation: **Hybrid Approach - Time Penalty (Timer Modes) + Block Lock (All Modes) + Visual Feedback**

1. **Time Challenge & Inferno Modes** (both use timers):
   - Side collision = deduct time based on collision count
   - Formula: `penalty = 0.5s * (collisionCount ^ 1.2)`
   - Example: 1st = 0.5s, 2nd = 1.1s, 3rd = 1.8s, 4th = 2.6s
   - Reset counter per level
   - **Inferno mode**: Optionally scale penalty by level difficulty (e.g., multiply by `1.0 + (level / 100)`)
   - **PLUS**: Block lock penalty (see below)

2. **All Modes** (including Free Flow):
   - **Block Lock with Color Alteration** (NEW):
     - Lock duration scales by level: `baseTime + (level * 0.05)` seconds
     - Early levels (1-10): ~1-2s
     - Mid levels (11-25): ~2-4s  
     - Late levels (26-50): ~3-6s
     - Post-50: ~4-8s (continues scaling)
     - Color alteration: Desaturate by 50% or apply gray/red tint
     - Smooth transition animations
   - Screen shake (mild, configurable intensity)
   - Audio feedback (optional, toggleable)
   - Visual flash (subtle, accessibility-friendly)

3. **Stats Tracking**:
   - Track side collisions separately from head-on
   - Track total lock time (cumulative seconds blocks were locked)
   - Add to stats modal: "Side Collisions" and "Lock Time" metrics
   - Include in efficiency calculations

### Alternative: **Block Lock Only (Simpler Implementation)**

If time penalties feel too complex initially, start with just block lock:
- Works in all modes
- Level-scaled duration feels fair
- Clear visual feedback
- Can add time penalties later if desired

### Implementation Considerations

- **Accessibility**: All visual effects should be toggleable
- **Balance**: Penalties should feel fair, not punitive
- **Feedback**: Clear communication of penalty type/amount
- **Progression**: Penalties should scale with difficulty
- **Mode Awareness**: Different penalties for different game modes

## Questions to Answer

1. Should penalties apply to all game modes or only specific ones?
   - **Confirmed**: Time-based penalties apply to both Time Challenge AND Inferno modes (both use timers)
   - **Block Lock**: Can work in all modes (universal penalty)
2. Should head-on collisions remain penalty-free?
   - **Recommendation**: Yes, head-on collisions are a special mechanic (rotation/continuation)
3. Should penalties be configurable in settings?
   - **Recommendation**: Visual/audio effects yes, but core penalties (time/lock) should be consistent for fairness
4. Should there be a "grace period" (first collision free)?
   - **Recommendation**: No, but first collision has minimal penalty (escalating system handles this)
5. Should penalties scale with block length (longer blocks = bigger penalty)?
   - **Open question**: Could longer blocks = longer lock time? (e.g., length-3 block locked 1.5x longer)
6. **NEW**: Which block gets locked - the moving block or the stationary one that was hit?
   - **Recommendation**: Lock the stationary block (the one that was hit), as it's the "obstacle"
   - **Alternative**: Lock the moving block (the one that caused the collision)
   - **Hybrid**: Lock both blocks for shorter duration?
