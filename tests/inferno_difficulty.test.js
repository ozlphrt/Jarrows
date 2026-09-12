import { describe, it, expect } from 'vitest';
import {
    getInfernoDifficultyConfig,
    getBigSpinCostMultiplier,
    getSpinCostMultiplier
} from '../src/inferno_difficulty.js';

describe('inferno_difficulty module', () => {
    it('should return default config for level 1', () => {
        const config = getInfernoDifficultyConfig(1);
        expect(config).toBeDefined();
        expect(config.difficultyThreshold).toBeGreaterThan(0);
        expect(config.outwardPercentage).toBeGreaterThan(0);
        expect(config.lengthDistribution).toBeDefined();
    });

    it('should scale difficulty progressively for higher levels', () => {
        const c1 = getInfernoDifficultyConfig(1);
        const c50 = getInfernoDifficultyConfig(50);
        expect(c50.difficultyThreshold).toBeGreaterThan(c1.difficultyThreshold);
        // Level 50 has lower outward percentage (harder) than Level 1
        expect(c50.outwardPercentage).toBeLessThan(c1.outwardPercentage);
    });

    it('should compute valid spin cost multipliers', () => {
        const m1 = getSpinCostMultiplier(1);
        const m50 = getSpinCostMultiplier(50);
        expect(m1).toBeGreaterThan(0);
        expect(m50).toBeGreaterThanOrEqual(m1);
    });

    it('should compute valid big spin cost multipliers', () => {
        const b1 = getBigSpinCostMultiplier(1);
        const b50 = getBigSpinCostMultiplier(50);
        expect(b1).toBeGreaterThanOrEqual(1 / 3);
        expect(b50).toBeGreaterThanOrEqual(b1);
    });
});
