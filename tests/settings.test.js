import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadPreferences, savePreferences, initSettingsUI } from '../src/ui/settings.js';

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

    describe('Level button and modal interaction', () => {
        let mockElements;
        let documentListeners;

        function createMockElement(id) {
            const listeners = {};
            return {
                id,
                style: { display: 'none', setProperty: vi.fn() },
                classList: {
                    _classes: new Set(),
                    add(cls) { this._classes.add(cls); },
                    remove(cls) { this._classes.delete(cls); },
                    toggle(cls, force) {
                        if (force !== undefined) {
                            if (force) this._classes.add(cls);
                            else this._classes.delete(cls);
                            return force;
                        }
                        if (this._classes.has(cls)) {
                            this._classes.delete(cls);
                            return false;
                        }
                        this._classes.add(cls);
                        return true;
                    },
                    contains(cls) { return this._classes.has(cls); }
                },
                setAttribute: vi.fn(),
                addEventListener: vi.fn((event, handler) => {
                    if (!listeners[event]) listeners[event] = [];
                    listeners[event].push(handler);
                }),
                removeEventListener: vi.fn(),
                dispatchEvent(event, ...args) {
                    const handlers = listeners[event.type || event] || [];
                    for (const h of handlers) {
                        h(typeof event === 'string' ? { type: event, preventDefault() {}, stopPropagation() {} } : event, ...args);
                    }
                },
                focus: vi.fn(),
                select: vi.fn(),
                value: '',
                textContent: ''
            };
        }

        beforeEach(() => {
            mockElements = {};
            documentListeners = {};

            globalThis.document = {
                readyState: 'complete',
                getElementById: vi.fn(id => {
                    if (!mockElements[id]) {
                        mockElements[id] = createMockElement(id);
                    }
                    return mockElements[id];
                }),
                createElement: vi.fn(tag => ({
                    tagName: tag.toUpperCase(),
                    width: 0,
                    height: 0,
                    getContext: vi.fn(() => ({
                        createLinearGradient: vi.fn(() => ({
                            addColorStop: vi.fn()
                        })),
                        fillRect: vi.fn()
                    }))
                })),
                querySelector: vi.fn(() => null),
                addEventListener: vi.fn((event, handler) => {
                    if (!documentListeners[event]) documentListeners[event] = [];
                    documentListeners[event].push(handler);
                })
            };

            globalThis.window = {
                gameScene: {},
                lights: {},
                gameBlocks: [],
                jumpToLevel: vi.fn(),
                debugJumpToLevel: vi.fn(),
                updateIdleTimers: vi.fn()
            };
        });

        it('should wire select-level-btn to open modal and populate current level', () => {
            const timerLevel = globalThis.document.getElementById('timer-level');
            timerLevel.textContent = '15';

            initSettingsUI();

            const selectLevelBtn = globalThis.document.getElementById('select-level-btn');
            const selectLevelModal = globalThis.document.getElementById('select-level-modal');
            const selectLevelInput = globalThis.document.getElementById('select-level-input');
            const settingsMenu = globalThis.document.getElementById('settings-menu');

            settingsMenu.style.display = 'flex';
            settingsMenu.classList.add('show');

            selectLevelBtn.dispatchEvent({
                type: 'click',
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            });

            expect(selectLevelModal.style.display).toBe('flex');
            expect(selectLevelInput.value).toBe(15);
            expect(settingsMenu.style.display).toBe('none');
            expect(settingsMenu.classList.contains('show')).toBe(false);
        });

        it('should leave top-bar level-container as a pure stat display without click handlers', () => {
            initSettingsUI();

            const levelContainer = globalThis.document.getElementById('level-container');
            expect(levelContainer.setAttribute).not.toHaveBeenCalledWith('title', 'Select Level');
            expect(levelContainer.style.setProperty).not.toHaveBeenCalledWith('pointer-events', 'auto', 'important');
        });

        it('should jump to chosen level when confirm button is clicked', () => {
            initSettingsUI();

            const selectLevelModal = globalThis.document.getElementById('select-level-modal');
            const selectLevelInput = globalThis.document.getElementById('select-level-input');
            const selectLevelConfirm = globalThis.document.getElementById('select-level-confirm');

            selectLevelModal.style.display = 'flex';
            selectLevelInput.value = '42';

            selectLevelConfirm.dispatchEvent({
                type: 'click',
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            });

            expect(selectLevelModal.style.display).toBe('none');
            expect(globalThis.window.jumpToLevel).toHaveBeenCalledWith(42);
        });

        it('should jump to chosen level when Enter key is pressed in the input', () => {
            initSettingsUI();

            const selectLevelModal = globalThis.document.getElementById('select-level-modal');
            const selectLevelInput = globalThis.document.getElementById('select-level-input');

            selectLevelModal.style.display = 'flex';
            selectLevelInput.value = '77';

            selectLevelInput.dispatchEvent({
                type: 'keydown',
                key: 'Enter',
                preventDefault: vi.fn()
            });

            expect(selectLevelModal.style.display).toBe('none');
            expect(globalThis.window.jumpToLevel).toHaveBeenCalledWith(77);
        });

        it('should close modal when Cancel button is clicked without jumping', () => {
            initSettingsUI();

            const selectLevelModal = globalThis.document.getElementById('select-level-modal');
            const selectLevelCancel = globalThis.document.getElementById('select-level-cancel');

            selectLevelModal.style.display = 'flex';

            selectLevelCancel.dispatchEvent({
                type: 'click',
                preventDefault: vi.fn(),
                stopPropagation: vi.fn()
            });

            expect(selectLevelModal.style.display).toBe('none');
            expect(globalThis.window.jumpToLevel).not.toHaveBeenCalled();
        });

        it('should close modal when Escape key is pressed in the input', () => {
            initSettingsUI();

            const selectLevelModal = globalThis.document.getElementById('select-level-modal');
            const selectLevelInput = globalThis.document.getElementById('select-level-input');

            selectLevelModal.style.display = 'flex';

            selectLevelInput.dispatchEvent({
                type: 'keydown',
                key: 'Escape',
                preventDefault: vi.fn()
            });

            expect(selectLevelModal.style.display).toBe('none');
            expect(globalThis.window.jumpToLevel).not.toHaveBeenCalled();
        });
    });
});
