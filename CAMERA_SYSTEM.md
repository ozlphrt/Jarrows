# Camera and Tower Control System Documentation

## Overview

The camera system uses **spherical coordinates** to position the camera around an imaginary sphere centered on the tower. The tower itself is contained in a `towerGroup` that can be panned/reframed independently of camera rotation. This creates an intuitive orbit-and-pan control scheme.

---

## Coordinate System

### Spherical Coordinates

The camera position is defined by three spherical coordinates relative to the tower center:

1. **Radius** (`cameraRadius`): Distance from tower center to camera
   - Range: `MIN_RADIUS = 5` to `MAX_RADIUS = 50`
   - Units: World units (meters)

2. **Azimuth** (`cameraAzimuth`): Horizontal rotation angle around the tower
   - Range: `0` to `2π` (unlimited rotation)
   - `0` = +X axis (East)
   - `π/2` = +Z axis (South)
   - `π` = -X axis (West)
   - `3π/2` = -Z axis (North)

3. **Elevation** (`cameraElevation`): Vertical angle from horizontal
   - Range: `MIN_ELEVATION = -π/2 + 0.1` to `MAX_ELEVATION = π/2 - 0.1`
   - `0` = Horizontal (looking straight at tower)
   - `π/4` = 45° above horizontal (default initial)
   - `π/2` = Straight up (prevented)
   - `-π/2` = Straight down (prevented)

### Conversion to Cartesian

The spherical coordinates are converted to Cartesian (world) coordinates using:

```javascript
x = radius * sin(elevation) * cos(azimuth)
y = radius * cos(elevation)
z = radius * sin(elevation) * sin(azimuth)
```

**Note**: This uses a **Y-up coordinate system** where:
- X: East (+)/West (-)
- Y: Up (+)/Down (-)
- Z: South (+)/North (-)

---

## Tower Group Structure

### Purpose

The `towerGroup` is a `THREE.Group` that contains:
- Base plate (grid foundation)
- Grid helper (visual grid)
- **All blocks** (added during gameplay)

### Positioning

The tower group is positioned at:
```javascript
towerGroup.position = towerCenter + towerPositionOffset
```

Where:
- `towerCenter` = `(3.5, 0, 3.5)` - Fixed center of the 7x7 grid
- `towerPositionOffset` = `(0, 0, 0)` initially, can be modified for panning

### Rotation

The tower group rotation is **always locked to zero**:
```javascript
towerGroup.rotation.set(0, 0, 0)
```

This ensures the tower never rotates - only the camera orbits around it.

---

## Camera Controls

### Mouse Controls (Desktop)

#### Left-Click Drag (Orbit)
- **Horizontal drag**: Changes azimuth (rotates camera around tower)
  - Drag left → camera rotates right (azimuth increases)
  - Drag right → camera rotates left (azimuth decreases)
  - Sensitivity: `DRAG_SENSITIVITY = 0.005`

- **Vertical drag**: Changes elevation (moves camera up/down on sphere)
  - Drag up → camera moves down (elevation decreases)
  - Drag down → camera moves up (elevation increases)
  - Sensitivity: `DRAG_SENSITIVITY = 0.005`
  - Clamped to `MIN_ELEVATION` and `MAX_ELEVATION`

#### Mouse Wheel (Zoom)
- **Scroll up**: Zoom out (radius increases)
- **Scroll down**: Zoom in (radius decreases)
- Zoom speed: `zoomSpeed = 0.1` (10% per scroll step)
- Clamped to `MIN_RADIUS` and `MAX_RADIUS`

### Touch Controls (Mobile)

#### Single Touch (Orbit)
- Same behavior as mouse left-click drag
- Horizontal drag → azimuth change
- Vertical drag → elevation change

#### Dual Touch (Pinch & Pan)

**Pinch to Zoom**:
- Detected when finger distance changes > 10%
- Pinch out (fingers apart) → zoom in (radius decreases)
- Pinch in (fingers together) → zoom out (radius increases)
- Formula: `targetRadius /= zoomFactor` where `zoomFactor = currentDistance / startDistance`

**Dual Touch Drag (Pan/Reframe)**:
- Detected when finger distance changes < 10%
- Moves the tower within the view (reframing)
- Converts screen-space movement to world-space using camera's right/up vectors
- Updates `towerPositionOffset`:
  ```javascript
  towerPositionOffset.add(right.multiplyScalar(-deltaX * PAN_SENSITIVITY))
  towerPositionOffset.add(up.multiplyScalar(deltaY * PAN_SENSITIVITY))
  ```
- Sensitivity: `PAN_SENSITIVITY = 0.01`

---

## Initial Camera Position

### Calculation

On level start, the camera is positioned to show the entire base plate at 45° elevation:

```javascript
function calculateInitialCameraPosition() {
    // Base plate dimensions
    const basePlateSize = gridSize * cubeSize; // 7 units
    const basePlateDiagonal = Math.sqrt(basePlateSize * basePlateSize * 2);
    
    // Calculate required distance to fit base plate in view
    const fov = camera.fov * (Math.PI / 180); // Convert to radians
    const aspect = camera.aspect;
    const requiredDistance = (basePlateDiagonal + ZOOM_PADDING) / (2 * Math.tan(fov / 2) * aspect);
    
    // Set initial values
    cameraRadius = Math.max(MIN_RADIUS, requiredDistance);
    cameraElevation = Math.PI / 4; // 45°
    cameraAzimuth = Math.PI / 4; // 45° (diagonal view)
}
```

### Look-At Target

The camera always looks at a point **8 units above the tower center**:
```javascript
const lookAtOffset = new THREE.Vector3(0, 8, 0);
const lookAtTarget = effectiveTowerCenter.clone().add(lookAtOffset);
camera.lookAt(lookAtTarget);
```

This pushes the base plate toward the bottom of the screen, providing a better view of the tower structure.

---

## Dynamic Zoom During Spawn

### Automatic Zoom-Out

During level generation (`isGeneratingLevel === true`), the camera automatically zooms out to fit all blocks:

1. **Calculate bounding box** of all placed blocks
2. **Calculate required distance** to fit:
   - Height: `(height + ZOOM_PADDING) / (2 * tan(fov/2))`
   - Width/Depth: `(baseDiagonal + ZOOM_PADDING) / (2 * tan(fov/2) * aspect)`
3. **Use the larger distance** to ensure everything fits
4. **Update target radius** (smoothly interpolated)

### Smoothing

During spawn, interpolation is faster (`smoothing = 0.25`) for real-time feel. During gameplay, it's slower (`smoothing = 0.1`) for smoother motion.

---

## Smooth Interpolation

### Target vs Current Values

The system uses **target values** and **current values** for smooth interpolation:

- **Target values**: Set by user input (drag, wheel, touch)
- **Current values**: Interpolated toward targets each frame

### Interpolation Formula

```javascript
currentValue += (targetValue - currentValue) * smoothing
```

Where `smoothing` is:
- `0.25` during level generation (faster, more responsive)
- `0.1` during gameplay (slower, smoother)

This creates smooth, damped motion rather than instant snapping.

---

## Camera Position Update

### Per-Frame Update

Every frame, the camera position is updated:

1. **Interpolate spherical coordinates**:
   ```javascript
   currentRadius += (targetRadius - currentRadius) * smoothing
   currentAzimuth += (targetAzimuth - currentAzimuth) * smoothing
   currentElevation += (targetElevation - currentElevation) * smoothing
   ```

2. **Convert to Cartesian**:
   ```javascript
   const x = currentRadius * Math.sin(currentElevation) * Math.cos(currentAzimuth)
   const y = currentRadius * Math.cos(currentElevation)
   const z = currentRadius * Math.sin(currentElevation) * Math.sin(currentAzimuth)
   ```

3. **Apply tower offset**:
   ```javascript
   const effectiveTowerCenter = towerCenter.clone().add(towerPositionOffset)
   camera.position.set(
       effectiveTowerCenter.x + x,
       effectiveTowerCenter.y + y,
       effectiveTowerCenter.z + z
   )
   ```

4. **Update look-at target**:
   ```javascript
   const lookAtTarget = effectiveTowerCenter.clone().add(new THREE.Vector3(0, 8, 0))
   camera.lookAt(lookAtTarget)
   ```

5. **Update tower group position**:
   ```javascript
   towerGroup.position.copy(towerCenter.clone().add(towerPositionOffset))
   towerGroup.rotation.set(0, 0, 0) // Always locked
   ```

---

## Implementation Details

### Key Variables

```javascript
// Spherical coordinates
let cameraRadius = 10
let cameraAzimuth = Math.PI / 4
let cameraElevation = Math.PI / 4

// Target values (set by user input)
let targetRadius = cameraRadius
let targetAzimuth = cameraAzimuth
let targetElevation = cameraElevation

// Current values (interpolated)
let currentRadius = cameraRadius
let currentAzimuth = cameraAzimuth
let currentElevation = cameraElevation

// Tower positioning
const towerCenter = new THREE.Vector3(3.5, 0, 3.5) // Center of 7x7 grid
let towerPositionOffset = new THREE.Vector3(0, 0, 0) // For panning
```

### Constants

```javascript
const MIN_RADIUS = 5
const MAX_RADIUS = 50
const MIN_ELEVATION = -Math.PI / 2 + 0.1
const MAX_ELEVATION = Math.PI / 2 - 0.1
const ZOOM_PADDING = 2
const DRAG_SENSITIVITY = 0.005
const PAN_SENSITIVITY = 0.01
```

### Event Handlers

- `onMouseDown`: Start camera drag
- `onMouseMove`: Update target azimuth/elevation during drag
- `onMouseUp`: End camera drag
- `onWheel`: Update target radius (zoom)
- `onTouchStart`: Handle single/dual touch start
- `onTouchMove`: Handle single touch orbit or dual touch zoom/pan
- `onTouchEnd`: Clean up touch state

### Animation Loop Integration

The camera update happens in the main animation loop:

```javascript
function animate() {
    // ... other updates ...
    
    // Update tower group position
    towerGroup.position.copy(towerCenter.clone().add(towerPositionOffset))
    towerGroup.rotation.set(0, 0, 0)
    
    // Dynamic zoom during spawn
    if (isGeneratingLevel && blocks.length > 0) {
        // Calculate and update targetRadius to fit all blocks
    }
    
    // Smooth interpolation
    const smoothing = isGeneratingLevel ? 0.25 : 0.1
    currentRadius += (targetRadius - currentRadius) * smoothing
    currentAzimuth += (targetAzimuth - currentAzimuth) * smoothing
    currentElevation += (targetElevation - currentElevation) * smoothing
    
    // Update camera position
    updateCameraPosition()
    
    // Render
    renderer.render(scene, camera)
}
```

---

## Coordinate System Notes

### Right-Handed, Y-Up

The system uses a **right-handed, Y-up coordinate system**:
- X: East (+)/West (-)
- Y: Up (+)/Down (-)
- Z: South (+)/North (-)
- Origin: Center of world grid

### Three.js Integration

```javascript
const coordinateSystem = {
    handedness: 'right',
    up: 'Y',
    origin: 'center',
    units: 'meters'
}
```

All transforms should explicitly state source and target spaces:
- `local → world`: Block position relative to tower group
- `world → view`: Camera view matrix
- `view → NDC`: Camera projection matrix

---

## Block Interaction

### Click Detection

Block clicks are detected via raycasting. The system distinguishes between:
- **Camera drag**: Mouse movement > `DRAG_THRESHOLD` (3 pixels)
- **Block click**: Mouse movement < `DRAG_THRESHOLD`

This prevents accidental block clicks during camera movement.

### Raycasting

```javascript
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Convert screen coordinates to normalized device coordinates
mouse.x = (event.clientX / window.innerWidth) * 2 - 1
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

raycaster.setFromCamera(mouse, camera)

// Intersect with all blocks
const intersections = raycaster.intersectObjects(block.cubes, true)
```

---

## Summary

The camera system provides:
1. **Intuitive orbit controls** - drag to rotate around tower
2. **Smooth zoom** - wheel or pinch to zoom in/out
3. **Pan/reframe** - dual touch drag to move tower in view
4. **Automatic framing** - zooms to fit content during spawn
5. **Smooth interpolation** - damped motion for professional feel
6. **Mobile support** - full touch gesture support

The tower group structure allows independent positioning of the tower while the camera orbits around it, creating a flexible viewing system that works well for both desktop and mobile.





