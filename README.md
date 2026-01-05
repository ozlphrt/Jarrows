# Sliding Block Puzzle

A 3D sliding block puzzle game built with Three.js and Rapier.js physics engine.

## Features

- 3D block puzzle with grid-based movement
- Physics-based falling using Rapier.js
- Multiple arrow styles for block direction indicators
- Smooth animations and interactions
- Modern development setup with Vite

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Technologies

- **Three.js** - 3D graphics rendering
- **Rapier.js** - Physics simulation
- **Vite** - Build tool and dev server

## Releases

### v4.5.6 - Performance Preset Shadow Quality Fix (Catapult)
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.6
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.6
- **Live**: https://ozlphrt.github.io/Jarrows/
- Performance preset now updates shadow maps more frequently on iOS and increases shadow quality during fast catapult/fall motion

### v4.5.5 - Performance Presets (Fixed) + Restore v4.5.3 Gameplay/Visual Baseline
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.5
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.5
- **Live**: https://ozlphrt.github.io/Jarrows/
- Restored v4.5.3 baseline to fix tower/base alignment and bring back direction indicators
- Added Settings → Quality preset (Battery / Balanced / Performance) + one-time in-game explainer

### v4.5.4 - Performance Presets (Battery / Balanced / Performance)
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.4
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.4
- **Live**: https://ozlphrt.github.io/Jarrows/
- Added a Quality preset in Settings to trade off smoothness/sharpness vs battery
- Added a one-time in-game notice explaining the presets

### v4.5.3 - Shadow Stability (Battery Optimizations Follow-up)
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.3
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.3
- **Live**: https://ozlphrt.github.io/Jarrows/
- Smoothed shadow updates to prevent distracting shadow popping while retaining iOS battery optimizations

### v4.5.1 - Remove Debug Button
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.1
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.1
- **Live**: https://ozlphrt.github.io/Jarrows/
- Removed the DEBUG UI button (diagnostics remain available only via console for development)

### v4.5.0 - Undo + Debug Movement Diagnostics + Overlap Fixes
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.5.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.5.0
- **Live**: https://ozlphrt.github.io/Jarrows/
- Added Undo support (including restoring cleared blocks when possible)
- Added DEBUG toggle to record non-moving block clicks for diagnosis
- Improved Y-overlap handling (snap-to-layer + epsilon) to reduce float-drift false overlaps and prevent impossible states

### v4.4.3 - LocalStorage Progress Fix & Reset All Users
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.4.3
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.4.3
- **Live**: https://ozlphrt.github.io/Jarrows/
- Fixed localStorage level progress saving and loading
- Added one-time reset mechanism to start all users from level 0
- Improved error handling and verification for progress saves
- Added reset flag to prevent multiple resets
- Progress now saves on level completion and when advancing levels

### v4.4.2 - Fix Level Initialization
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.4.2
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.4.2
- Fixed hardcoded test level 40 - now properly loads saved progress
- New users start at level 0, existing users resume from their saved level

### v4.4.1 - Remove Debug Panel
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.4.1
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.4.1
- Removed DEBUG button from game controls
- Removed debug output from block click handler
- Cleaned up debug UI code

### v4.4.0 - Collision Detection Improvements & Gameplay Enhancements
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.4.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.4.0
- Fixed Y-overlap collision detection with epsilon tolerance for floating-point precision
- Added debug mode button for movement analysis (DEBUG button in game controls)
- Implemented vertical tower centering after block spawn
- Prioritized blocks facing outward (toward edges) for easier gameplay
- Improved block generation to prefer exit-capable blocks (70% outward-facing)
- Enhanced block sorting to prioritize blocks that can exit immediately
- Fixed false collision detections when blocks are just touching at boundaries

### v4.3.1 - Arrow Color Fix
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.3.1
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.3.1
- Fixed arrow colors to always use length-based colors on white blocks
- Ensured arrows remain colored (red/teal/yellow) regardless of block color setting

### v4.3.0 - Enhanced Visibility & Color Controls
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v4.3.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v4.3.0
- Increased emboss depth for arrows, dots, and circles (2x visibility)
- Added temporary color adjustment controls (brightness, hue, saturation) in debug panel
- Reverted arrow color changes to match block colors
- Enhanced bevel settings for better 3D appearance

### v2.2.0 - Crescent Icon & UI Improvements
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v2.2.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v2.2.0
- Updated moon icon to filled crescent with thick outline
- Fixed block color toggle to properly show colored vs white blocks
- Replaced dice icon with refresh/random icon
- Improved icon sizing and alignment
- Fixed Vite HMR by disabling service worker in dev mode
- Enhanced light source angle enforcement (30° minimum)

### v2.1.0 - Camera Initialization Fix
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v2.1.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v2.1.0
- Fixed camera positioning to eliminate incorrect view on initial frame
- Camera now positioned correctly before first render

### v1.1.0 - Catapult Effect (Level 1)
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v1.1.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v1.1.0
- Catapult launch effect when blocks fly off the edge
- Wind-up compression animation before launch
- Upward arc trajectory with enhanced spin

### v1.0.0 - Stable Release
- **Tree**: https://github.com/ozlphrt/Jarrows/tree/v1.0.0
- **Release**: https://github.com/ozlphrt/Jarrows/releases/tag/v1.0.0

