import { describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { Block } from '../src/Block.js';
import {
    SpinAnimationCoordinator,
    getSpinAnimationProfile,
    getSpinLayerDelay
} from '../src/spin/SpinAnimationCoordinator.js';

describe('spin animation coordinator', () => {
    it('selects bounded workloads from the live block count', () => {
        expect(getSpinAnimationProfile(499).mode).toBe('central-60fps');
        expect(getSpinAnimationProfile(500).mode).toBe('central-30fps');
        expect(getSpinAnimationProfile(750).mode).toBe('central-30fps');
        expect(getSpinAnimationProfile(800).mode).toBe('layered-snap');
    });

    it('spreads layer starts across the configured cascade window', () => {
        const profile = getSpinAnimationProfile(100);
        expect(getSpinLayerDelay(0, 3, profile)).toBe(0);
        expect(getSpinLayerDelay(1, 3, profile)).toBe(840);
        expect(getSpinLayerDelay(2, 3, profile)).toBe(1680);
    });

    it('snaps each high-count layer once through a single frame chain', async () => {
        let clock = 0;
        let nextFrameId = 0;
        const queuedFrames = [];
        const applyFrame = vi.fn();
        const onLayerStart = vi.fn();
        const coordinator = new SpinAnimationCoordinator({
            now: () => clock,
            requestFrame: (callback) => {
                queuedFrames.push(callback);
                return ++nextFrameId;
            },
            cancelFrame: vi.fn()
        });

        const completion = coordinator.start({
            layers: [['top'], ['bottom']],
            blockCount: 800,
            applyFrame,
            onLayerStart
        });

        queuedFrames.shift()(0);
        clock = 900;
        queuedFrames.shift()(900);
        const metrics = await completion;

        expect(applyFrame.mock.calls).toEqual([
            ['top', 1, true],
            ['bottom', 1, true]
        ]);
        expect(onLayerStart).toHaveBeenCalledTimes(2);
        expect(metrics.mode).toBe('layered-snap');
        expect(metrics.visualFrames).toBe(2);
    });

    it('prepares and applies an indicator-only direction transition', () => {
        const block = Object.create(Block.prototype);
        block.direction = { x: 1, z: 0 };
        block._indicatorBaseAngle = Math.atan2(1, 0);
        block._spinAnimId = null;
        block.isVertical = true;
        block.length = 1;
        block.cubes = [];
        block.directionIndicators = new THREE.Group();
        const topArrow = new THREE.Object3D();
        block.arrow = { children: [topArrow] };

        const transition = block.prepareDirectionAnimation({ x: 0, z: -1 });
        block.applyDirectionAnimationFrame(transition, 1, true);

        expect(block.direction).toEqual({ x: 0, z: -1 });
        expect(block.directionIndicators.rotation.y).toBeCloseTo(transition.destRotY);
        expect(topArrow.rotation.z).toBeCloseTo(transition.destTopArrowZ);
    });
});
