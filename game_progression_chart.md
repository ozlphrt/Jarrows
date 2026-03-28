# Jarrows: Game Progression & Difficulty Chart (v8.14.0)

This chart outlines the major milestones, mechanic introductions, and difficulty scaling as you progress through the levels.

| Level Range | Key Milestones & New Mechanics | Difficulty Scaling (Inferno Mode) |
| :--- | :--- | :--- |
| **1 - 5** | **Tutorial Phase**: Introduction to 3D controls and basic sliding. | **L1-5**: 30% Vertical blocks, 22.5% outward-looking paths. Mostly short (len 1-2) blocks. |
| **6 - 10** | **Complexity Intro**: Modals for Directional, Vertical, and Length complexity begin to appear. | **L10 Target**: Outward-facing blocks drop to 20%. 3-unit blocks increase to 30%. |
| **11 - 20** | **Multilayer Strategy**: Upper layers start blocking lower exits. Tower height increases. | **L11+**: Multi-layer dependency introduced. Vertical blocks drop toward 10%. |
| **21 - 30** | **Crushing Falls**: Dropping blocks from height (>2.0 units) can now "crush" blocks below. | **L25 Target**: 3st-long blocks reach 60% frequency. Outward blocks drop to ~10%. |
| **31 - 41** | **BOMB ERA**: Bombs are introduced (8% base prob). High intensity clearing. | **Density**: High bomb density (~13% at base). Blocks become longer and more restrictive. |
| **42 - 50** | **Altitude Damping**: Towers become tall enough to trigger bomb reduction at upper layers. | **L50 Target**: Outward blocks hit **2.5% minimum**. 3-unit blocks dominate (70%+). |
| **51 - 60** | **Post-50 Scaling**: Level growth slows down (2 blocks/lvl). Scaling becomes aggressive. | **Intensity**: Complexity threshold increases at 50% rate. Tower height stabilizes. |
| **61 - 80** | **The Key & Lock**: Introduces a single Key-and-Lock pair that must be solved first. | **Restrictive**: Multi-layer blocking hits 40-60%. Exit paths are extremely scarce. |
| **81 - 99** | **Double Locks**: Two Key-and-Lock pairs appear, dramatically increasing puzzle depth. | **Elite**: Vertical blocks drop to ~1.5%. Puzzles require precise multi-step ordering. |
| **100+** | **Grand Master**: Three Key-and-Lock pairs. Puzzles are maximal complexity. | **Infinity**: Max complexity 80%+. 1000-block hard cap. Scaling continues at 50% rate. |

---

### Core Mechanic Transitions

*   **Bombs (L31+)**: Base probability is 8%, but modulated by height (12.8% at ground, 3.2% at peak).
*   **Tower Shape**: Dynamically scales to a **1 : 1 : 1.5** (W:D:H) portrait ratio.
*   **Grid Size**: 
    *   **L1-42**: Stays around **5x5 to 8x8**.
    *   **L43+**: Jumps to **9x9** and continues to grow as volume increases.
*   **Spin Gems (L11+)**: *Currently Disabled* (Replaced by normal blocks in v9.1 roadmap).
*   **Undo/Restart**: Unlimited, but resets the current level layout if you Restart.
