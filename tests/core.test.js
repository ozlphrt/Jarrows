import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../src/core/EventBus.js';
import { GameState } from '../src/core/GameState.js';

describe('EventBus', () => {
    it('should subscribe and emit events with payloads', () => {
        const bus = new EventBus();
        const handler = vi.fn();

        bus.on('test:event', handler);
        bus.emit('test:event', { foo: 'bar' });

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should unsubscribe correctly', () => {
        const bus = new EventBus();
        const handler = vi.fn();

        const unsub = bus.on('test:event', handler);
        unsub();

        bus.emit('test:event', 123);
        expect(handler).not.toHaveBeenCalled();
    });

    it('should support once listeners', () => {
        const bus = new EventBus();
        const handler = vi.fn();

        bus.once('test:once', handler);
        bus.emit('test:once', 'first');
        bus.emit('test:once', 'second');

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith('first');
    });
});

describe('GameState', () => {
    it('should initialize with default values', () => {
        const state = new GameState();
        expect(state.currentLevel).toBe(1);
        expect(state.isGeneratingLevel).toBe(false);
        expect(state.isPaused).toBe(false);
        expect(state.autoZoomEnabled).toBe(true);
    });

    it('should update reactive properties and mirror critical globals when window exists', () => {
        globalThis.window = {};
        const state = new GameState();
        state.isGeneratingLevel = true;
        expect(state.isGeneratingLevel).toBe(true);
        expect(globalThis.window.isGeneratingLevel).toBe(true);

        state.autoZoomEnabled = false;
        expect(state.autoZoomEnabled).toBe(false);
        expect(globalThis.window.autoZoomEnabled).toBe(false);
    });
});
