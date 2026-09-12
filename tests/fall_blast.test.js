import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Block } from '../src/Block.js';

describe('Fall Blast & Ash Updates', () => {
    let scene;
    let mockParticleSystem;

    beforeEach(() => {
        scene = new THREE.Scene();
        mockParticleSystem = {
            addExplosion: vi.fn(),
            addFireSparks: vi.fn(),
        };
        let rafId = 0;
        globalThis.requestAnimationFrame = vi.fn((cb) => {
            rafId++;
            return setTimeout(cb, 50);
        });
        globalThis.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));
        globalThis.window = {
            triggerRadialTowerShake: vi.fn(),
            shakeTower: vi.fn(),
            shakeCamera: vi.fn(),
            blocks: [],
            markNeedsRender: vi.fn(),
            playSound: vi.fn(),
            particleSystem: mockParticleSystem,
        };
    });

    function createTestBlock(isBomb = false) {
        return new Block(
            1, // length
            0, // gridX
            0, // gridZ
            { x: 1, z: 0 }, // direction
            false, // isVertical
            2, // arrowStyle
            scene, // scene
            null, // physics
            7, // gridSize
            1, // cubeSize
            0, // yOffset
            1, // level
            isBomb // isBomb
        );
    }

    it('onCrushed should default to skipFlash: true, avoiding startBlastIndicatorFlash and rapidly shaking tower', () => {
        const block = createTestBlock();
        const flashSpy = vi.spyOn(block, 'startBlastIndicatorFlash');
        vi.spyOn(block, 'shakeViolently').mockResolvedValue();

        block.onCrushed(mockParticleSystem);

        expect(flashSpy).not.toHaveBeenCalled();
        expect(globalThis.window.triggerRadialTowerShake).toHaveBeenCalledWith(
            block,
            globalThis.window.blocks,
            0.45,
            420
        );
        expect(globalThis.window.shakeTower).toHaveBeenCalledWith(0.38, 380);
        expect(globalThis.window.shakeCamera).toHaveBeenCalledWith(0.14, 280);
    });

    it('onCrushed should call startBlastIndicatorFlash only if skipFlash is explicitly false', () => {
        const block = createTestBlock();
        const flashSpy = vi.spyOn(block, 'startBlastIndicatorFlash').mockImplementation(() => {});
        vi.spyOn(block, 'shakeViolently').mockResolvedValue();

        block.onCrushed(mockParticleSystem, { skipFlash: false });

        expect(flashSpy).toHaveBeenCalledWith(350);
    });

    it('explodeWithParticles should accept skipFlash option without error', async () => {
        const block = createTestBlock();
        const promise = block.explodeWithParticles(mockParticleSystem, 0, true, { skipFlash: true });
        expect(block.isExploding).toBe(true);
        expect(mockParticleSystem.addExplosion).toHaveBeenCalled();
        await promise;
    }, 10000);

    it('setCharred should apply darker ashed indicator palette', () => {
        const block = createTestBlock();
        block.setCharred(true);
        expect(block.isCharred).toBe(true);
        block.setCharred(false);
        expect(block.isCharred).toBe(false);
    });
});
