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

