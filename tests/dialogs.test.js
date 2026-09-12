import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DialogManager } from '../src/ui/DialogManager.js';
import { eventBus } from '../src/core/EventBus.js';

describe('DialogManager', () => {
    let dm;
    let mockElements;

    beforeEach(() => {
        dm = new DialogManager();
        mockElements = {};

        // Mock document.getElementById
        globalThis.document = {
            getElementById: vi.fn(id => {
                if (!mockElements[id]) {
                    mockElements[id] = {
                        id,
                        style: { display: 'none' },
                        classList: {
                            _classes: new Set(),
                            add(cls) { this._classes.add(cls); },
                            remove(cls) { this._classes.delete(cls); },
                            contains(cls) { return this._classes.has(cls); }
                        },
                        addEventListener: vi.fn(),
                        removeEventListener: vi.fn(),
                        innerHTML: '',
                        textContent: ''
                    };
                }
                return mockElements[id];
            })
        };

        globalThis.localStorage = {
            _store: {},
            getItem(key) { return this._store[key] || null; },
            setItem(key, val) { this._store[key] = String(val); },
            clear() { this._store = {}; }
        };
    });

    it('should open and close modals', () => {
        let openedEvent = null;
        let closedEvent = null;
        eventBus.on('dialog:opened', e => { openedEvent = e; });
        eventBus.on('dialog:closed', e => { closedEvent = e; });

        const result = dm.openModal('test-modal');
        expect(result).toBe(true);
        expect(dm.isModalOpen('test-modal')).toBe(true);
        expect(openedEvent).toEqual({ id: 'test-modal' });

        dm.closeModal('test-modal');
        expect(dm.isModalOpen('test-modal')).toBe(false);
        expect(closedEvent).toEqual({ id: 'test-modal' });
    });

    it('should manage pause dialog', () => {
        expect(dm.showPause()).toBe(true);
        expect(dm.isModalOpen('pause-modal')).toBe(true);
        expect(dm.hidePause()).toBe(true);
        expect(dm.isModalOpen('pause-modal')).toBe(false);
    });

    it('should manage new game dialog', () => {
        expect(dm.showNewGame()).toBe(true);
        expect(dm.isModalOpen('new-game-modal')).toBe(true);
        expect(dm.hideNewGame()).toBe(true);
        expect(dm.isModalOpen('new-game-modal')).toBe(false);
    });

    it('should populate level complete dialog fields', () => {
        const result = dm.showLevelComplete({
            completedLevel: 5,
            timeString: '01:23',
            totalMoves: 42,
            initialBlockCount: 50,
            comboMultiplier: 2.0,
            bankedSeconds: 15,
            humorMessage: 'Smooth moves!'
        });

        expect(result).toBe(true);
        expect(dm.isModalOpen('level-complete-modal')).toBe(true);

        const titleEl = document.getElementById('level-complete-title');
        expect(titleEl.innerHTML).toContain('Level <span class="modal-level-number-inline">5</span> Complete!');

        const timeEl = document.getElementById('level-complete-time');
        expect(timeEl.textContent).toBe('01:23');

        const movesEl = document.getElementById('level-complete-moves');
        expect(movesEl.textContent).toBe('42');

        const blocksEl = document.getElementById('level-complete-blocks');
        expect(blocksEl.textContent).toBe('50');

        const comboEl = document.getElementById('level-complete-combo');
        expect(comboEl.textContent).toBe('x2.0');

        const bonusEl = document.getElementById('level-complete-bonus');
        expect(bonusEl.textContent).toBe('+15s');

        const msgEl = document.getElementById('level-complete-message');
        expect(msgEl.textContent).toBe('Smooth moves!');
    });
});
