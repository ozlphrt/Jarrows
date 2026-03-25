# Jarrows v2: Strategic Implementation Roadmap

## 1. Business Summary & Vision
The primary goal of Jarrows v2 is to evolve the core gameplay from a simple physics-based activity into a strategic, high-engagement puzzle experience. By introducing level-based surprises, biome-driven atmospheres, and tactical block mechanics, we aim to significantly increase player retention through the first 100 levels.

### Key Objectives
*   **Engagement**: Introduce new mechanics every 10 levels to maintain a sense of "surprise."
*   **Strategy**: Shift from "clearing all blocks" to "prioritizing and sequencing" moves.
*   **Premium Aesthetic**: Achieve a state-of-the-art "Zen" visual experience via subtle, high-fidelity biomes.
*   **Error Correction**: Implement a dynamic penalty system (Welding) that discourages spam-tapping and rewards precision.

---

## 2. Phase-Based Implementation Plan

### Phase 1: Core Mechanics & "Kickers" (Levels 1-30)
*Focus: Enhancing the immediate satisfying feedback of clearing the tower.*

*   **Task 1.1: Volatile (Bomb) Blocks**
    *   Implement radius-clear logic in `Block.js`.
    *   Add "Detonation" particle effects in `particles.js`.
*   **Task 1.2: Crushing Physics**
    *   Update `physics.js` to detect high-impact falls (distance > 2 units).
    *   Implement `onCrushed()` event to remove blocks under heavy impact.
*   **Task 1.3: Spin Gem & Resource Management**
    *   Add `isSpinGem` property to `Block` class.
    *   Modify move-counter logic to skip deduction when a Spin Gem is cleared.

### Phase 2: Structural Depth & Puzzles (Levels 31-60)
*Focus: Introducing mandatory sequencing and "Iconic" challenges.*

*   **Task 2.1: Key & Lock System**
    *   **Visuals (`Block.js`)**: 
        *   Add `isKey` and `isLocked` properties to `Block`.
        *   Keys will have a glowing keyhole icon (`createKeyTexture`).
        *   Locks will have a heavy chain or shield visual (`createLockTexture`) and will visually "shake" and play a clink sound if the player tries to move them while locked.
    *   **Logic (`Block.js` & `main.js`)**: 
        *   Locks keep a reference to their Key (`this.lockedByKey = keyBlock`).
        *   When a Key block is successfully removed, it triggers `unlock()` on all associated Lock blocks.
    *   **Generation Safety (`main.js`)**: 
        *   To guarantee solvability without deadlocks, Keys must always be placed in upper/outer layers or generated in a way that guarantees they can be accessed *before* the Lock. 
        *   This feature will activate starting at **Level 61**, bringing in high-level sequencing strategy.
*   **Task 2.2: Iconic Architecture Templates**
    *   Create a JSON-based Voxel Template system.
    *   Refactor `createSolvableBlocks` in `main.js` to support masked generation.
*   **Task 2.3: L-Shaped Geometry**
    *   Define `LShapeBlock` class extending `Block`.
    *   Implement multi-collider physics in `physics.js`.

### Phase 3: Advanced Challenges & Biomes (Levels 61-100)
*Focus: Late-game retention via aesthetic shifts and a skill-based penalty system.*

*   **Task 3.1: The Biome Manager**
    *   Implement a global `ClimateManager` for smooth transitions between 10 subtle themes.
    *   Configure lighting, fog, and background presets for all 100 levels.
*   **Task 3.2: Welding (The Mistake Penalty)**
    *   Implement `onStuckTap` and `onCollision` triggers for welding.
    *   Develop "Fused Body" physics logic for composite blocks.
*   **Task 3.3: Superheat Frenzy**
    *   Implement the temporary "No-Collision Slider" state.

# Spin Time Cost & Blasted Rewards (v7.7.7)

Re-implement the spin button's time cost logic and reward blasted spin gems with time instead of a penalty.

## Proposed Changes

### [main.js](file:///c:/Users/ozalp/Code/AntiGravity/Jarrows%20v2/src/main.js)

- [MODIFY] `updateSpinCounterDisplay`:
  - If `remainingSpins > 0`, show the count.
  - Else if `isTimeBasedMode()`, show the time cost icon/text (e.g. "-10s").
- [MODIFY] `spinRandomBlocks`:
  - Implement priority: use `remainingSpins` first (free), then check `timeLeftSec` for cost (10s).
  - Flash timer and block spin if insufficient time.
- [NEW] `window.awardSpinGemBlastedTime(seconds)`: Helper to add time, play sound, and flash timer.
- [MODIFY] `showSpinFeedback(isSuccess)`:
  - Success: "+1 Spin".
  - Failure (Blasted): "Blasted! +10s Time Bonus" (using checkmark or clock icon).

### [Block.js](file:///c:/Users/ozalp/Code/AntiGravity/Jarrows%20v2/src/Block.js)

- [MODIFY] `explodeWithParticles(isBlasted)`:
  - If `isSpinGem && isBlasted`, call `window.awardSpinGemBlastedTime(10)`.

## Verification Plan

### Automated Tests
- Browser test: Spin the button with 0 spins and 30s time. Verify time drops to 20s.
- Browser test: Blasted a Spin Gem. Verify time increases by 10s and popup says "Blasted! +10s".
- Browser test: Collect a Spin Gem manually. Verify `remainingSpins` increases by 1.

### Manual Verification
- Verify the spin counter UI looks correct when it shows time cost vs remaining spins.

---

## 3. Deep Technical Implementation Detail

### 🔧 Block Fusion Architecture
To prevent physics "jitters" in multi-block units, we avoid joint-based connections.
*   **Mechanism**: On a mistake, two `RigidBody` objects are removed and replaced by a single `RigidBody` containing multiple `Collider` shapes.
*   **Data Structure**: A `CompositeBlock` class will maintain the original block IDs and their relative offsets to the new shared center-of-mass.

### 🧩 Template-Based Generation
*   **Algorithm**: The reverse-generator will "carve" the iconic shape from a solid volume by restricting block placement to a 3D coordinate mask.
*   **Solvability Guarantee**: Because we build *inward* from a solved (cleared) state, the resulting iconic tower is mathematically guaranteed to be solvable.

---

## 4. Level-By-Level Progression Map

| Levels | Biome Theme | Priority Introduction | Surprises / Hazards |
| :--- | :--- | :--- | :--- |
| **1-10** | Zen Garden | 1x1, 2x1 blocks | Tutorial Guidance |
| **11-20** | Mist Mountain | **Swiss Cheese** | Intro to hollow-core layouts |
| **21-30** | Sunset Horizon | **Glass Blocks** | Brittle foundation clearing |
| **31-40** | Bamboo Grove | **Bomb Blocks** | Speed-clearing accelerators |
| **41-50** | Above Clouds | **L-Shapes** | Complex interlocking puzzles |
| **51-60** | Scholar Study | **Welding (Penalty)** | High-precision requirement |
| **61-70** | Deep Space | **Key & Lock** | Strategic clearing sequences |
| **71-80** | Terracotta | Spin Gems | Resource pressure (few spins) |
| **81-90** | Lunar Surface | Superheat Frenzy | Tall, top-heavy towers |
| **91-100**| Cherry Blossom | Mixed All Types | **Iconic Shape Levels** |

---

## 5. Quality Assurance & Metrics
*   **Benchmark**: Achieving 0.0% "Hard-Stuck" rate in the 100-level generation suite.
*   **Performance**: Maintaining 60FPS during bulk removals (Bomb/Frenzy) on mid-tier mobile devices.
*   **Engagement**: Verification that the level-10-threshold "Swiss Cheese" layout provides a clear psychological reward.
