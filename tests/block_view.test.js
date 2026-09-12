import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
    asThreeColor,
    INDICATOR_LENGTH_COLORS,
    getFrostyConfig,
    setFrostyConfig,
    getCubeGeometry,
    isPooledGeometry,
    clearGeometryPool
} from '../src/block/BlockView.js';

describe('BlockView', () => {
    describe('asThreeColor', () => {
        it('should clone existing THREE.Color', () => {
            const original = new THREE.Color(0xff0000);
            const cloned = asThreeColor(original);
            expect(cloned.getHex()).toBe(0xff0000);
            expect(cloned).not.toBe(original);
        });

        it('should handle rgb object', () => {
            const col = asThreeColor({ r: 0, g: 1, b: 0 });
            expect(col.r).toBe(0);
            expect(col.g).toBe(1);
            expect(col.b).toBe(0);
        });

        it('should fallback for null or undefined', () => {
            const col = asThreeColor(null, 0x123456);
            expect(col.getHex()).toBe(0x123456);
        });
    });

    describe('INDICATOR_LENGTH_COLORS', () => {
        it('should have distinct color entries for lengths 1, 2, 3', () => {
            expect(INDICATOR_LENGTH_COLORS).toHaveLength(3);
            expect(INDICATOR_LENGTH_COLORS[0]).toBe(0xa8111a); // Red
            expect(INDICATOR_LENGTH_COLORS[1]).toBe(0x0096c7); // Cyan
            expect(INDICATOR_LENGTH_COLORS[2]).toBe(0xea8c00); // Amber
        });
    });

    describe('FrostyConfig', () => {
        it('should return default frosty config', () => {
            const config = getFrostyConfig();
            expect(config).toBeDefined();
            expect(typeof config.blockRoughness).toBe('number');
            expect(typeof config.blockMetalness).toBe('number');
        });

        it('should allow setting frosty config', () => {
            const original = getFrostyConfig();
            setFrostyConfig({ blockRoughness: 0.42 });
            expect(getFrostyConfig().blockRoughness).toBe(0.42);
            // Restore
            setFrostyConfig(original);
        });
    });

    describe('Geometry pooling', () => {
        it('should return cached RoundedBoxGeometry for identical parameters', () => {
            const g1 = getCubeGeometry(1, 1, 1, 0.1, 4);
            const g2 = getCubeGeometry(1, 1, 1, 0.1, 4);
            expect(g1).toBe(g2);
            expect(isPooledGeometry(g1)).toBe(true);
        });

        it('should clear pools on clearGeometryPool', () => {
            const g = getCubeGeometry(2, 2, 2, 0.1, 4);
            expect(isPooledGeometry(g)).toBe(true);
            clearGeometryPool();
            expect(isPooledGeometry(g)).toBe(false);
        });
    });
});
