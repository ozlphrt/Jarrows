import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadPreferences, savePreferences } from '../src/ui/settings.js';

describe('settings module', () => {
    beforeEach(() => {
        globalThis.localStorage = {
            _store: {},
            getItem(key) { return this._store[key] || null; },
            setItem(key, val) { this._store[key] = String(val); },
            clear() { this._store = {}; }
        };
    });

    it('should return default preferences if none stored', () => {
        const prefs = loadPreferences();
        expect(prefs.isDarkTheme).toBe(true);
        expect(prefs.qualityPreset).toBe('balanced');
        expect(prefs.autoZoomEnabled).toBe(true);
    });

    it('should persist and retrieve preferences', () => {
        savePreferences({
            isDarkTheme: false,
            useColoredBlocks: true,
            qualityPreset: 'performance',
            autoZoomEnabled: false,
            lightPreset: 'studio'
        });

        const loaded = loadPreferences();
        expect(loaded.isDarkTheme).toBe(false);
        expect(loaded.useColoredBlocks).toBe(true);
        expect(loaded.qualityPreset).toBe('performance');
        expect(loaded.autoZoomEnabled).toBe(false);
        expect(loaded.lightPreset).toBe('studio');
    });
});
