import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { CameraController } from '../src/camera/CameraController.js';

describe('CameraController', () => {
    it('should initialize with default parameters', () => {
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        const controller = new CameraController(camera);

        expect(controller.radius).toBe(15);
        expect(controller.elevation).toBeCloseTo(1.35, 2);
        expect(controller.azimuth).toBeCloseTo(Math.PI / 4, 2);
    });

    it('should calculate initial position bounded by min and max radius', () => {
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        const controller = new CameraController(camera, { isMobileLike: false });

        globalThis.window = { innerWidth: 1920, innerHeight: 1080 };
        controller.calculateInitialPosition(5, 1);

        expect(controller.radius).toBeGreaterThanOrEqual(controller.MIN_RADIUS_DESKTOP);
        expect(controller.radius).toBeLessThanOrEqual(controller.MAX_RADIUS);
    });

    it('should step smoothing smoothly towards target', () => {
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        const controller = new CameraController(camera);

        controller.targetRadius = 20;
        controller.step(0.5);

        expect(controller.radius).toBeGreaterThan(15);
        expect(controller.radius).toBeLessThan(20);
    });

    it('should trigger camera shake with decay', () => {
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        const controller = new CameraController(camera);

        controller.shake(0.5, 300);
        expect(controller.shakeIntensity).toBe(0.5);
        expect(controller.shakeDuration).toBe(300);
    });
});
