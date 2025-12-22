# Puzzle Validation Strategy

## Overview

This document outlines the logical approach to creating and validating valid puzzles for the sliding block game.

## Validation Levels

### 1. Structural Validation (Required)

**Purpose**: Ensure puzzle configuration is physically valid.

**Checks**:
- ✅ No overlapping blocks (each cell occupied by at most one block)
- ✅ All blocks within grid bounds
- ✅ Valid block properties (length, direction, position)

**Implementation**: `validateStructure(blocks, gridSize)`

**Why**: Without structural validity, the puzzle cannot be rendered or played.

---

### 2. Sequential Solvability Validation (Critical)

**Purpose**: Verify that all blocks can be cleared in some order.

**Problem with Simple Check**: 
- Old approach only checked if each block could exit **immediately**
- This fails for puzzles where Block A blocks Block B, but Block B can be cleared first, then Block A

**Solution**: Sequential simulation
1. Start with all blocks
2. Find any block that can exit in current state
3. Remove that block (simulate clearing)
4. Repeat until all blocks cleared or stuck
5. If stuck → unsolvable
6. If all cleared → solvable

**Implementation**: `validateSolvability(blocks, gridSize)`

**Returns**:
- `solvable`: boolean
- `solution`: array of blocks in clearing order
- `reason`: explanation string

**Why**: Ensures puzzles are actually playable, not just structurally valid.

---

### 3. Difficulty Assessment (Optional)

**Purpose**: Classify puzzle difficulty for gameplay variety.

**Factors**:
- **Block count**: More blocks = harder
- **Average steps to exit**: Longer paths = harder
- **Interdependencies**: Blocks that block others = harder
- **Density**: Higher fill percentage = harder

**Implementation**: `calculateDifficulty(blocks, gridSize)`

**Returns**:
- `difficulty`: 'easy' | 'medium' | 'hard' | 'unsolvable'
- `score`: numeric difficulty score
- `metrics`: detailed statistics

---

## Generation Strategies

### Current Approach (Basic)
1. Randomly place blocks trying to fill 100% of board
2. Fill remaining cells with single-cell blocks pointing to nearest edge
3. Validate after generation

**Issues**:
- May create unsolvable puzzles
- No difficulty control
- Random placement can create trivial or impossible puzzles

---

### Recommended Approach: Constrained Generation

**Strategy**: Generate with solvability validation at each step

```javascript
function generateValidPuzzle(gridSize, targetDifficulty = 'medium') {
    const blocks = [];
    const maxAttempts = 1000;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // Try adding a new block
        const candidate = generateRandomBlock(gridSize, blocks);
        
        // Test if adding this block maintains solvability
        const testBlocks = [...blocks, candidate];
        const validation = validateSolvability(testBlocks, gridSize);
        
        if (validation.solvable) {
            blocks.push(candidate);
            
            // Check difficulty
            const difficulty = calculateDifficulty(blocks, gridSize);
            if (difficulty.difficulty === targetDifficulty) {
                return blocks; // Found target difficulty
            }
        }
        
        attempts++;
    }
    
    return blocks; // Return best attempt
}
```

**Benefits**:
- Guarantees solvability
- Can target specific difficulty
- More controlled puzzle generation

---

### Alternative: Reverse Generation

**Strategy**: Start from solved state, work backward

1. Place blocks at edges (all pointing outward)
2. Gradually move blocks inward
3. Validate solvability at each step
4. Stop when desired difficulty reached

**Benefits**:
- Always starts from solvable state
- Can control difficulty progression
- More predictable results

---

## Usage Example

```javascript
import { validateStructure, validateSolvability, calculateDifficulty } from './puzzle_validation.js';

// After generating blocks
const blocks = createRandomBlocks();

// 1. Validate structure
const structure = validateStructure(blocks, gridSize);
if (!structure.valid) {
    console.error('Invalid puzzle:', structure.reason);
    return;
}

// 2. Validate solvability
const solvability = validateSolvability(blocks, gridSize);
if (!solvability.solvable) {
    console.warn('Unsolvable puzzle:', solvability.reason);
    // Regenerate or adjust
    return;
}

// 3. Assess difficulty
const difficulty = calculateDifficulty(blocks, gridSize);
console.log(`Difficulty: ${difficulty.difficulty}`);
console.log(`Metrics:`, difficulty.metrics);
```

---

## Best Practices

1. **Always validate structure first** - catches basic errors early
2. **Use sequential solvability** - not just immediate reachability
3. **Validate during generation** - catch problems early, not after
4. **Track difficulty metrics** - for balanced gameplay
5. **Log validation results** - helps debug generation issues

---

## Performance Considerations

- Sequential solvability check is O(n²) where n = number of blocks
- For large puzzles, consider:
  - Caching validation results
  - Incremental validation (only check new blocks)
  - Early termination if unsolvable

---

## Future Enhancements

1. **Difficulty targeting**: Generate puzzles at specific difficulty levels
2. **Puzzle uniqueness**: Ensure generated puzzles are distinct
3. **Solution verification**: Verify solution is optimal or near-optimal
4. **Constraint-based generation**: Generate puzzles with specific properties (e.g., "requires 5 moves minimum")

