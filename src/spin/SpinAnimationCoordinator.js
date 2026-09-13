export const SPIN_SMOOTH_LIMIT = 500;
export const SPIN_SNAP_LIMIT = 750;

export function getSpinAnimationProfile(blockCount) {
    const count = Math.max(0, Number(blockCount) || 0);

    if (count > SPIN_SNAP_LIMIT) {
        return {
            mode: 'layered-snap',
            totalCascadeMs: 900,
            blockDurationMs: 0,
            minFrameIntervalMs: 0
        };
    }

    if (count >= SPIN_SMOOTH_LIMIT) {
        return {
            mode: 'central-30fps',
            totalCascadeMs: 1600,
            blockDurationMs: 260,
            minFrameIntervalMs: 1000 / 30
        };
    }

    return {
        mode: 'central-60fps',
        totalCascadeMs: 2000,
        blockDurationMs: 320,
        minFrameIntervalMs: 0
    };
}

export function getSpinLayerDelay(layerIndex, layerCount, profile) {
    if (layerCount <= 1) return 0;
    const cascadeWindowMs = Math.max(0, profile.totalCascadeMs - profile.blockDurationMs);
    return (layerIndex / (layerCount - 1)) * cascadeWindowMs;
}

/**
 * Runs a whole-tower indicator animation through one requestAnimationFrame chain.
 * Callers provide lightweight transition objects and the function that applies them.
 */
export class SpinAnimationCoordinator {
    constructor({ requestFrame, cancelFrame, now } = {}) {
        this.requestFrame = requestFrame || ((callback) => requestAnimationFrame(callback));
        this.cancelFrame = cancelFrame || ((id) => cancelAnimationFrame(id));
        this.now = now || (() => performance.now());
        this.frameId = null;
        this.runId = 0;
        this.resolveActive = null;
    }

    cancel() {
        this.runId++;
        if (this.frameId !== null) {
            this.cancelFrame(this.frameId);
            this.frameId = null;
        }
        if (this.resolveActive) {
            this.resolveActive({ cancelled: true });
            this.resolveActive = null;
        }
    }

    start({ layers, blockCount, applyFrame, onLayerStart, onRender, onComplete }) {
        this.cancel();

        const safeLayers = Array.isArray(layers) ? layers : [];
        const profile = getSpinAnimationProfile(blockCount);
        const startedAt = this.now();
        const runId = this.runId;
        const layerStates = safeLayers.map((items, index) => ({
            items: Array.isArray(items) ? items : [],
            startAt: startedAt + getSpinLayerDelay(index, safeLayers.length, profile),
            started: false,
            completed: false
        }));

        if (layerStates.length === 0) {
            const metrics = {
                cancelled: false,
                mode: profile.mode,
                blockCount: 0,
                visualFrames: 0,
                maxFrameWorkMs: 0,
                elapsedMs: 0
            };
            if (onComplete) onComplete(metrics);
            return Promise.resolve(metrics);
        }

        return new Promise((resolve) => {
            this.resolveActive = resolve;
            let lastAppliedAt = -Infinity;
            let visualFrames = 0;
            let maxFrameWorkMs = 0;

            const finish = (timestamp) => {
                if (runId !== this.runId) return;
                this.frameId = null;
                this.resolveActive = null;
                const metrics = {
                    cancelled: false,
                    mode: profile.mode,
                    blockCount: Math.max(0, Number(blockCount) || 0),
                    visualFrames,
                    maxFrameWorkMs,
                    elapsedMs: Math.max(0, timestamp - startedAt)
                };
                if (onComplete) onComplete(metrics);
                resolve(metrics);
            };

            const tick = (frameTimestamp) => {
                if (runId !== this.runId) return;

                const timestamp = Number.isFinite(frameTimestamp) ? frameTimestamp : this.now();
                const workStartedAt = this.now();
                const canApplySmoothFrame = profile.minFrameIntervalMs === 0 ||
                    (timestamp - lastAppliedAt) >= profile.minFrameIntervalMs;
                let changed = false;

                for (const layer of layerStates) {
                    if (layer.completed || timestamp < layer.startAt) continue;

                    if (!layer.started) {
                        layer.started = true;
                        if (onLayerStart) onLayerStart(layer.items);
                    }

                    if (layer.items.length === 0) {
                        layer.completed = true;
                        continue;
                    }

                    if (profile.mode === 'layered-snap') {
                        for (const item of layer.items) applyFrame(item, 1, true);
                        layer.completed = true;
                        changed = true;
                        continue;
                    }

                    const rawProgress = Math.min(
                        Math.max((timestamp - layer.startAt) / profile.blockDurationMs, 0),
                        1
                    );
                    if (canApplySmoothFrame || rawProgress === 1) {
                        const eased = 1 - Math.pow(1 - rawProgress, 3);
                        for (const item of layer.items) applyFrame(item, eased, rawProgress === 1);
                        changed = true;
                        if (rawProgress === 1) layer.completed = true;
                    }
                }

                if (changed) {
                    lastAppliedAt = timestamp;
                    visualFrames++;
                    if (onRender) onRender();
                }

                maxFrameWorkMs = Math.max(maxFrameWorkMs, this.now() - workStartedAt);
                if (layerStates.every((layer) => layer.completed)) {
                    finish(timestamp);
                } else {
                    this.frameId = this.requestFrame(tick);
                }
            };

            this.frameId = this.requestFrame(tick);
        });
    }
}
