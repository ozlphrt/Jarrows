/**
 * CameraController - Modular 3D Camera System
 * Handles spherical orbit math, auto-zoom bounding calculations, and camera shake.
 */

import * as THREE from 'three';

export class CameraController {
    constructor(camera, options = {}) {
        this.camera = camera;
        this.isMobileLike = options.isMobileLike || false;

        // Constants
        this.ZOOM_PADDING = 2.0;
        this.ZOOM_PADDING_MOBILE = 2.5;
        this.MIN_RADIUS_DESKTOP = 8.0;
        this.MIN_RADIUS_MOBILE = 9.0;
        this.MAX_RADIUS = 35.0;
        this.DEFAULT_FRAMING_OFFSET_Y = 2.4;

        // State
        this.radius = 15.0;
        this.azimuth = Math.PI / 4;
        this.elevation = 1.35;
        this.targetRadius = 15.0;
        this.targetAzimuth = Math.PI / 4;
        this.targetElevation = 1.35;
        this.smoothedAutoZoomRadius = 15.0;
        this.framingOffsetY = this.DEFAULT_FRAMING_OFFSET_Y;

        // Shake
        this.shakeIntensity = 0;
        this.shakeStartTime = 0;
        this.shakeDuration = 0;
        this._shakeOffset = new THREE.Vector3();

        // Targets
        this.targetCenter = new THREE.Vector3(0, 0, 0);
        this.targetOffset = new THREE.Vector3(0, 0, 0);
        this.lookAtTarget = new THREE.Vector3(0, 0, 0);

        this.stillMoving = false;
    }

    /**
     * Trigger camera shake effect
     * @param {number} intensity - Shake amplitude
     * @param {number} duration - Duration in milliseconds
     */
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStartTime = performance.now();
    }

    /**
     * Calculate initial camera framing for the grid
     */
    calculateInitialPosition(gridSize, cubeSize) {
        if (!this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        const basePlateSize = gridSize * cubeSize;
        const basePlateWidth = basePlateSize * 0.8;
        const fov = this.camera.fov * (Math.PI / 180);
        const aspect = this.camera.aspect;

        const padding = this.isMobileLike ? this.ZOOM_PADDING_MOBILE : this.ZOOM_PADDING;
        const hDist = (basePlateWidth + padding) / (2 * Math.tan(fov / 2) * aspect);
        const vDist = (5 + padding) / (2 * Math.tan(fov / 2));
        const requiredDist = Math.max(hDist * 0.9, vDist);

        const minRadius = this.isMobileLike ? this.MIN_RADIUS_MOBILE : this.MIN_RADIUS_DESKTOP;
        this.radius = Math.max(minRadius, Math.min(this.MAX_RADIUS, requiredDist));
        this.elevation = 1.35;
        this.azimuth = Math.PI / 4;

        this.targetRadius = this.radius;
        this.targetAzimuth = this.azimuth;
        this.targetElevation = this.elevation;
        this.smoothedAutoZoomRadius = this.radius;

        this.updatePosition();
    }

    /**
     * Update camera world position from spherical coordinates
     */
    updatePosition() {
        if (!this.camera) return;

        // Apply camera shake if active
        this._shakeOffset.set(0, 0, 0);
        const now = performance.now();
        if (now - this.shakeStartTime < this.shakeDuration) {
            const progress = (now - this.shakeStartTime) / this.shakeDuration;
            const decay = 1 - progress;
            const currentIntensity = this.shakeIntensity * decay;
            this._shakeOffset.set(
                (Math.random() - 0.5) * currentIntensity,
                (Math.random() - 0.5) * currentIntensity,
                (Math.random() - 0.5) * currentIntensity
            );
        }

        const sinElevation = Math.sin(this.elevation);
        const x = this.targetCenter.x + this.radius * sinElevation * Math.cos(this.azimuth);
        const y = this.targetCenter.y + this.radius * Math.cos(this.elevation);
        const z = this.targetCenter.z + this.radius * sinElevation * Math.sin(this.azimuth);

        this.camera.position.set(
            x + this._shakeOffset.x,
            y + this._shakeOffset.y,
            z + this._shakeOffset.z
        );

        this.lookAtTarget.copy(this.targetCenter).add(new THREE.Vector3(0, this.framingOffsetY, 0));
        this.camera.lookAt(this.lookAtTarget);
    }

    /**
     * Step smoothing toward target coordinates
     * @param {number} [smoothing=0.15]
     */
    step(smoothing = 0.15) {
        this.radius += (this.targetRadius - this.radius) * smoothing;
        this.azimuth += (this.targetAzimuth - this.azimuth) * smoothing;
        this.elevation += (this.targetElevation - this.elevation) * smoothing;

        const EPS = 1e-4;
        const dr = Math.abs(this.targetRadius - this.radius);
        const da = Math.abs(this.targetAzimuth - this.azimuth);
        const de = Math.abs(this.targetElevation - this.elevation);

        if (dr < EPS) this.radius = this.targetRadius;
        if (da < EPS) this.azimuth = this.targetAzimuth;
        if (de < EPS) this.elevation = this.targetElevation;

        this.stillMoving = (dr >= EPS) || (da >= EPS) || (de >= EPS);
        if (this.stillMoving || (performance.now() - this.shakeStartTime < this.shakeDuration)) {
            this.updatePosition();
        }
    }
}
