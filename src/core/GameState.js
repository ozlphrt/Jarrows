/**
 * GameState - Centralized reactive state store
 * Replaces direct window.* mutations with an observable state model.
 */

import { eventBus } from './EventBus.js';

class GameState {
    constructor() {
        this._state = {
            currentLevel: 1,
            isGeneratingLevel: false,
            isLevelPlayable: false,
            levelBlocksSpawned: false,
            isPaused: false,
            isTimeFrozen: false,
            gameMode: 'standard', // standard, time_challenge, inferno
            autoZoomEnabled: true,
            remainingSpins: 3,
            blocksRemaining: 0,
            bombsRemaining: 0,
            qualityPreset: 'balanced'
        };

        // Mirror critical flags to window during refactoring for backwards compatibility
        if (typeof window !== 'undefined') {
            window.isGeneratingLevel = false;
            window.autoZoomEnabled = true;
        }
    }

    get currentLevel() { return this._state.currentLevel; }
    set currentLevel(val) {
        if (this._state.currentLevel !== val) {
            const old = this._state.currentLevel;
            this._state.currentLevel = val;
            eventBus.emit('state:level', { current: val, previous: old });
        }
    }

    get isGeneratingLevel() { return this._state.isGeneratingLevel; }
    set isGeneratingLevel(val) {
        const bool = Boolean(val);
        if (this._state.isGeneratingLevel !== bool) {
            this._state.isGeneratingLevel = bool;
            if (typeof window !== 'undefined') window.isGeneratingLevel = bool;
            eventBus.emit('state:generating', bool);
        }
    }

    get isLevelPlayable() { return this._state.isLevelPlayable; }
    set isLevelPlayable(val) {
        const bool = Boolean(val);
        if (this._state.isLevelPlayable !== bool) {
            this._state.isLevelPlayable = bool;
            eventBus.emit('state:playable', bool);
        }
    }

    get isPaused() { return this._state.isPaused; }
    set isPaused(val) {
        const bool = Boolean(val);
        if (this._state.isPaused !== bool) {
            this._state.isPaused = bool;
            eventBus.emit('state:paused', bool);
        }
    }

    get autoZoomEnabled() { return this._state.autoZoomEnabled; }
    set autoZoomEnabled(val) {
        const bool = Boolean(val);
        if (this._state.autoZoomEnabled !== bool) {
            this._state.autoZoomEnabled = bool;
            if (typeof window !== 'undefined') window.autoZoomEnabled = bool;
            eventBus.emit('state:autoZoom', bool);
        }
    }

    get gameMode() { return this._state.gameMode; }
    set gameMode(val) {
        if (this._state.gameMode !== val) {
            this._state.gameMode = val;
            eventBus.emit('state:gameMode', val);
        }
    }

    get blocksRemaining() { return this._state.blocksRemaining; }
    set blocksRemaining(val) {
        if (this._state.blocksRemaining !== val) {
            this._state.blocksRemaining = val;
            eventBus.emit('state:blocksRemaining', val);
        }
    }

    get remainingSpins() { return this._state.remainingSpins; }
    set remainingSpins(val) {
        if (this._state.remainingSpins !== val) {
            this._state.remainingSpins = val;
            eventBus.emit('state:remainingSpins', val);
        }
    }

    /**
     * Snapshot of the entire state
     */
    getSnapshot() {
        return { ...this._state };
    }

    /**
     * Reset state for a new level
     */
    resetForNewLevel(level) {
        this.currentLevel = level;
        this.isGeneratingLevel = true;
        this.isLevelPlayable = false;
        this._state.levelBlocksSpawned = false;
        eventBus.emit('state:resetLevel', level);
    }
}

export const gameState = new GameState();
export { GameState };
