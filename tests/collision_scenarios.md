# Physics Rules Test Scenarios

## Rule 1: Blocks are solid and cannot overlap

### Test Cases
1. **Basic Overlap Prevention**
   - Place two blocks at same (x, z) and overlapping Y ranges
   - Verify: Blocks cannot be placed in overlapping positions
   - Verify: Movement is blocked if it would create overlap

2. **Edge Case: Floating Point Precision**
   - Blocks with yOffset values like 2.00168
   - Verify: SnapLayerY correctly treats near-integer values as integers
   - Verify: No false overlaps from floating point drift

3. **Overlap After Head-on Collision**
   - Trigger head-on collision that causes block to drop
   - Verify: Block drops to Y level that doesn't create overlap
   - Verify: Final position check prevents overlaps

4. **Overlap During Falling**
   - Remove support from block above another block
   - Verify: Falling block stops at correct Y level
   - Verify: No overlaps created during fall animation

## Rule 2: Blocks can collide and bounce off each other (visual only)

### Test Cases
1. **Visual Bounce Effect**
   - Block hits obstacle immediately (no movement)
   - Verify: Bounce animation plays
   - Verify: Block's grid position does NOT change
   - Verify: Only group.position changes (visual only)

2. **Block Stops at Collision Point**
   - Block moves and hits obstacle
   - Verify: Block stops at collision point
   - Verify: Block does NOT move backward
   - Verify: Grid coordinates match collision point

3. **Shake Effect for Surrounding Blocks**
   - Block hits obstacle
   - Verify: Blocks within radius shake
   - Verify: Shake is visual only (no grid position change)
   - Verify: All blocks return to exact grid positions after shake

## Rule 3: Head-on collision rotation

### Test Cases
1. **Single-Cell Block Rotation**
   - Single-cell block hits head-on collision
   - Verify: Block rotates clockwise (90°)
   - Verify: Block continues moving in new direction

2. **Multi-Cell Block (2-3 cells) Rotation**
   - 2-3 cell block hits head-on collision
   - Verify: Block flips direction 180°
   - Verify: Block continues moving in opposite direction

3. **Consecutive Head-on Collisions**
   - Block hits multiple head-on collisions in sequence
   - Verify: Block rotates/flips multiple times
   - Verify: Block continues moving after each rotation
   - Verify: Maximum limit prevents infinite loops (50 collisions)

4. **Rotation at Correct Position**
   - Block moves several steps then hits head-on collision
   - Verify: Rotation happens at collision point
   - Verify: Block position updated correctly before rotation

## Rule 4: Block stacking with support

### Test Cases
1. **Support from Any Cell**
   - Place horizontal multi-cell block
   - Place supporting block under only one cell
   - Verify: Block has support (at least one cell supported)

2. **Multi-Cell Block Support**
   - Place 3-cell horizontal block
   - Place supports under different cells
   - Verify: Support check covers ALL cells
   - Verify: Block supported if ANY cell has support

3. **Vertical Block Support**
   - Place vertical block (multiple Y levels)
   - Verify: Support checked at base cell
   - Verify: Block supported if base cell has support

4. **Base Plate Support**
   - Place block at yOffset = 0
   - Verify: Block always has support (base plate)

## Rule 5: Falling when no support

### Test Cases
1. **Single Block Falling**
   - Remove support from single block
   - Verify: Block falls to base plate or supporting block
   - Verify: Block stops at correct Y level

2. **Chain Reaction Falling**
   - Remove support from lower block
   - Upper blocks lose support
   - Verify: All unsupported blocks fall simultaneously
   - Verify: Blocks land in correct order (bottom→top)

3. **Falling Through Multiple Layers**
   - Block at high Y level loses support
   - Multiple layers below
   - Verify: Block falls to first support or base
   - Verify: No overlaps created during fall

4. **Falling to Correct Y Level**
   - Block above supporting block
   - Verify: Block lands on top of support (no gap, no overlap)
   - Verify: Y offset matches support top exactly

## Rule 6: Non-head-on collision shake

### Test Cases
1. **Radius-Based Shake Detection**
   - Block hits obstacle (non-head-on)
   - Blocks at various distances
   - Verify: Blocks within radius (2 cells) shake
   - Verify: Blocks outside radius do NOT shake

2. **Shake is Visual Only**
   - Trigger shake effect
   - Verify: Block grid positions do NOT change
   - Verify: Only visual positions (group.position) change
   - Verify: All blocks return to exact grid positions

3. **Shake with Various Configurations**
   - Dense block configuration
   - Sparse block configuration
   - Multiple blocks within radius
   - Verify: All blocks within radius shake correctly

## High Block Count Tests (Level 40+)

1. **Performance with Many Blocks**
   - Test with 1000+ blocks
   - Verify: Overlap detection performs well
   - Verify: Support checking performs well
   - Verify: No performance degradation

2. **Complex Collision Scenarios**
   - Multiple simultaneous head-on collisions
   - Complex support chains
   - Verify: All rules enforced correctly
   - Verify: No overlaps created

3. **Edge Cases**
   - Blocks at grid boundaries
   - Blocks at maximum Y levels
   - Blocks with various sizes and orientations
   - Verify: All rules work correctly
