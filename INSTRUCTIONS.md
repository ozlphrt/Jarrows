# Step-by-Step Instructions to Add Level System

## Step 1: Add Level Variables (after line 75)

1. Go to line 75 in `src/main.js`
2. You should see: `];`
3. After line 75 (which is blank), add these 4 lines:

```javascript
// Level system: 35 blocks per level
const BLOCKS_PER_LEVEL = 35;
let currentLevel = 1; // Start at level 1
```

**Result:** After line 75, you should have:
```
];
// Level system: 35 blocks per level
const BLOCKS_PER_LEVEL = 35;
let currentLevel = 1; // Start at level 1

// Validation functions are now imported from puzzle_validation.js
```

---

## Step 2: Update createSolvableBlocks Function Signature (line 86)

1. Go to line 86
2. Find this line:
   ```javascript
   function createSolvableBlocks(yOffset = 0, lowerLayerCells = null) {
   ```
3. Change it to:
   ```javascript
   function createSolvableBlocks(yOffset = 0, lowerLayerCells = null, targetBlockCount = BLOCKS_PER_LEVEL) {
   ```

---

## Step 3: Update generateSolvablePuzzle Function (starting at line 591)

1. Go to line 591
2. You should see: `blocks.length = 0;`
3. DELETE everything from line 591 to line 621 (including the closing `}`)
4. REPLACE it with this code:

```javascript
    blocks.length = 0;
    currentLevel = 1; // Reset to level 1
    
    // Generate Level 1: 35 blocks (1 * 35)
    const targetBlocks = currentLevel * BLOCKS_PER_LEVEL;
    const levelBlocks = createSolvableBlocks(0, null, targetBlocks);
    await placeBlocksBatch(levelBlocks, 10, 10);
    
    console.log(`✓ Generated Level ${currentLevel} with ${blocks.length} blocks`);
}
```

**Important:** Make sure the closing `}` at the end matches the function declaration!

---

## Step 4: Add Level Detection in animate Function (after line 813)

1. Go to line 813
2. You should see a closing brace `}` and then line 814 is blank
3. After line 813 (before the closing brace of the if statement), add this code:

```javascript
        // Check if level is completed (blocks count goes to zero)
        if (blocks.length === 0) {
            // Level completed - increase level and generate new blocks
            currentLevel++;
            const targetBlocks = currentLevel * BLOCKS_PER_LEVEL;
            console.log(`🎉 Level ${currentLevel - 1} cleared! Generating Level ${currentLevel} with ${targetBlocks} blocks...`);
            
            const levelBlocks = createSolvableBlocks(0, null, targetBlocks);
            placeBlocksBatch(levelBlocks, 10, 10);
        }
```

**Result:** After line 813, you should have:
```
        }
        
        // Check if level is completed (blocks count goes to zero)
        if (blocks.length === 0) {
            // Level completed - increase level and generate new blocks
            currentLevel++;
            const targetBlocks = currentLevel * BLOCKS_PER_LEVEL;
            console.log(`🎉 Level ${currentLevel - 1} cleared! Generating Level ${currentLevel} with ${targetBlocks} blocks...`);
            
            const levelBlocks = createSolvableBlocks(0, null, targetBlocks);
            placeBlocksBatch(levelBlocks, 10, 10);
        }
        
    }
```

---

## Step 5: Save and Test

1. Save the file (Ctrl+S)
2. Check the browser console - you should see "✓ Generated Level 1 with X blocks"
3. Clear all blocks
4. You should see "🎉 Level 1 cleared! Generating Level 2 with 70 blocks..."
5. The board should fill with 70 blocks for Level 2

---

## Troubleshooting

- If you get errors, check that:
  - All opening `{` have matching closing `}`
  - You didn't accidentally delete any required code
  - The function signatures match exactly (including commas and parentheses)
  - You're inside the correct function when adding code

- If blocks don't generate the right amount:
  - Check that `targetBlockCount` parameter is being used in `createSolvableBlocks`
  - You may need to add checks inside `createSolvableBlocks` to stop when `blocksToPlace.length >= targetBlockCount`








