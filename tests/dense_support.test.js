import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createSolvableBlocks, setGeneratorContext } from '../src/puzzle/LevelGenerator.js';

describe('Dense Tower Packing & Zero Floating Gaps Verification', () => {
    function simulateLevel(level, targetBlockCount) {
        const estimatedVolume = targetBlockCount * 1.8;
        const targetSide = Math.ceil(Math.pow(estimatedVolume / 1.5, 1 / 3));
        const gridSize = Math.max(5, Math.min(20, targetSide));
        const cubeSize = 1;
        const gridCells = gridSize * gridSize;
        const scene = new THREE.Scene();

        setGeneratorContext({
            gridSize,
            cubeSize,
            scene,
            physics: null,
            currentArrowStyle: 2,
            blocks: []
        });

        let remainingBlocks = targetBlockCount;
        let currentLayer = 0;
        let lowerLayerCells = null;
        let allBlocks = [];
        const maxLayers = 15;

        while (remainingBlocks > 0 && currentLayer < maxLayers) {
            const yOffset = currentLayer * cubeSize;
            let blocksForThisLayer;
            let preferLongBlocks = false;

            if (currentLayer === 0) {
                blocksForThisLayer = Math.min(remainingBlocks, gridCells);
                preferLongBlocks = true;
            } else {
                remainingBlocks = targetBlockCount - allBlocks.length;
                let supportedCells = 0;
                if (lowerLayerCells && lowerLayerCells.yRanges) {
                    for (const [, ranges] of lowerLayerCells.yRanges.entries()) {
                        if (ranges.some(r => Math.abs(r.yTop - yOffset) < 0.05)) supportedCells++;
                    }
                } else if (lowerLayerCells?.cells) {
                    supportedCells = lowerLayerCells.cells.size;
                }
                const maxBlocksBasedOnSupport = Math.floor(supportedCells * 0.98);
                blocksForThisLayer = Math.min(remainingBlocks, Math.min(gridCells, maxBlocksBasedOnSupport));
                preferLongBlocks = false;
            }

            const layerBlocks = createSolvableBlocks(yOffset, lowerLayerCells, blocksForThisLayer, level, preferLongBlocks, null, 0.5, {
                gridSize, cubeSize, scene, physics: null, currentArrowStyle: 2, blocks: allBlocks
            });

            if (layerBlocks.length === 0 && remainingBlocks > 0) {
                break;
            }

            const currentLayerCells = new Set();
            const currentLayerYRanges = new Map();

            for (const block of layerBlocks) {
                const blockHeight = block.isVertical ? block.length * cubeSize : cubeSize;
                const yBottom = block.yOffset || yOffset;
                const yTop = yBottom + blockHeight;

                if (block.isVertical) {
                    const cellKey = `${block.gridX},${block.gridZ}`;
                    currentLayerCells.add(cellKey);
                    if (!currentLayerYRanges.has(cellKey)) currentLayerYRanges.set(cellKey, []);
                    currentLayerYRanges.get(cellKey).push({ yBottom, yTop });
                } else {
                    const isXAligned = Math.abs(block.direction.x) > 0;
                    for (let i = 0; i < block.length; i++) {
                        const x = block.gridX + (isXAligned ? i : 0);
                        const z = block.gridZ + (isXAligned ? 0 : i);
                        const cellKey = `${x},${z}`;
                        currentLayerCells.add(cellKey);
                        if (!currentLayerYRanges.has(cellKey)) currentLayerYRanges.set(cellKey, []);
                        currentLayerYRanges.get(cellKey).push({ yBottom, yTop });
                    }
                }
            }

            if (lowerLayerCells) {
                for (const cell of currentLayerCells) lowerLayerCells.cells.add(cell);
                for (const [cellKey, ranges] of currentLayerYRanges.entries()) {
                    if (!lowerLayerCells.yRanges.has(cellKey)) lowerLayerCells.yRanges.set(cellKey, []);
                    lowerLayerCells.yRanges.get(cellKey).push(...ranges);
                }
            } else {
                lowerLayerCells = { cells: currentLayerCells, yRanges: currentLayerYRanges };
            }

            allBlocks = allBlocks.concat(layerBlocks);
            remainingBlocks = targetBlockCount - allBlocks.length;
            currentLayer++;
            if (allBlocks.length >= targetBlockCount) break;
        }

        // Validate that EVERY cell at y > 0 has direct support directly beneath it at y - 1
        const occupied3D = new Set();
        for (const b of allBlocks) {
            const isX = Math.abs(b.direction.x) > 0;
            const yStart = Math.round(b.yOffset);
            if (b.isVertical) {
                for (let dy = 0; dy < b.length; dy++) {
                    occupied3D.add(`${b.gridX},${yStart + dy},${b.gridZ}`);
                }
            } else {
                for (let i = 0; i < b.length; i++) {
                    const x = b.gridX + (isX ? i : 0);
                    const z = b.gridZ + (isX ? 0 : i);
                    occupied3D.add(`${x},${yStart},${z}`);
                }
            }
        }

        let floatingCells = 0;
        for (const cell of occupied3D) {
            const [x, y, z] = cell.split(',').map(Number);
            if (y > 0 && !occupied3D.has(`${x},${y - 1},${z}`)) {
                floatingCells++;
            }
        }

        return {
            totalPlaced: allBlocks.length,
            targetBlockCount,
            floatingCells,
            layers: currentLayer
        };
    }

    it('Level 11 (110 blocks): should generate with 100% placed and 0 floating cells across 10 runs', () => {
        for (let r = 0; r < 10; r++) {
            const res = simulateLevel(11, 110);
            expect(res.floatingCells).toBe(0);
            expect(res.totalPlaced).toBe(110);
        }
    });

    it('Level 13 (130 blocks): should generate with 100% placed and 0 floating cells across 10 runs', () => {
        for (let r = 0; r < 10; r++) {
            const res = simulateLevel(13, 130);
            expect(res.floatingCells).toBe(0);
            expect(res.totalPlaced).toBe(130);
        }
    });

    it('Level 15 (150 blocks): should generate with 100% placed and 0 floating cells across 5 runs', () => {
        for (let r = 0; r < 5; r++) {
            const res = simulateLevel(15, 150);
            expect(res.floatingCells).toBe(0);
            expect(res.totalPlaced).toBe(150);
        }
    });
});
