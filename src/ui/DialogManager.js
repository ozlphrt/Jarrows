import { getChangelogForVersion } from '../changelog.js';
import { eventBus } from '../core/EventBus.js';
import { playSound } from '../audio.js';

export const TIME_RULES_SEEN_KEY = 'jarrows_time_rules_seen';
export const INFERNO_RULES_SEEN_KEY = 'jarrows_inferno_rules_seen';
export const LOCK_EXPLANATION_KEY = 'jarrows_lock_explanation_seen';

export class DialogManager {
    constructor() {
        this.activeModal = null;
        this.lockExplanationModalShowing = false;
        this.timeUpShown = false;
    }

    openModal(elementOrId) {
        if (typeof document === 'undefined') return false;
        const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        if (!el) return false;
        el.style.display = 'flex';
        this.activeModal = el;
        eventBus.emit('dialog:opened', { id: el.id });
        return true;
    }

    closeModal(elementOrId) {
        if (typeof document === 'undefined') return false;
        const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        if (!el) return false;
        el.style.display = 'none';
        if (this.activeModal === el) {
            this.activeModal = null;
        }
        eventBus.emit('dialog:closed', { id: el.id });
        return true;
    }

    isModalOpen(elementOrId) {
        if (typeof document === 'undefined') return false;
        const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
        return el ? el.style.display !== 'none' && el.style.display !== '' : false;
    }

    showChangelog(version) {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('changelog-modal');
        const content = document.getElementById('changelog-content');
        if (!modal || !content) return false;

        const changelog = getChangelogForVersion(version);
        if (!changelog) return false;

        let html = `<div style="margin-bottom: 16px;">`;
        html += `<div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; opacity: 0.95;">Version ${version}</div>`;
        if (changelog.title) {
            html += `<div style="font-size: 16px; font-weight: 500; margin-bottom: 12px; opacity: 0.85;">${changelog.title}</div>`;
        }
        if (changelog.date) {
            html += `<div style="font-size: 12px; opacity: 0.6; margin-bottom: 16px;">${changelog.date}</div>`;
        }
        if (changelog.changes && changelog.changes.length > 0) {
            html += `<div style="line-height: 1.8;">`;
            changelog.changes.forEach(change => {
                html += `<div style="margin-bottom: 8px; opacity: 0.9;">• ${change}</div>`;
            });
            html += `</div>`;
        }
        html += `</div>`;

        content.innerHTML = html;
        return this.openModal(modal);
    }

    hideChangelog() {
        return this.closeModal('changelog-modal');
    }

    showPause() {
        return this.openModal('pause-modal');
    }

    hidePause() {
        return this.closeModal('pause-modal');
    }

    showNewGame() {
        return this.openModal('new-game-modal');
    }

    hideNewGame() {
        return this.closeModal('new-game-modal');
    }

    showTimeRulesIfNeeded(onClose = null) {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('time-rules-modal');
        const okBtn = document.getElementById('time-rules-ok');
        if (!modal || !okBtn) return false;

        let alreadySeen = false;
        try {
            alreadySeen = localStorage.getItem(TIME_RULES_SEEN_KEY) === '1';
        } catch {
            alreadySeen = false;
        }
        if (alreadySeen) return false;

        this.openModal(modal);

        const onOk = () => {
            this.closeModal(modal);
            okBtn.removeEventListener('click', onOk);
            try {
                localStorage.setItem(TIME_RULES_SEEN_KEY, '1');
            } catch {}
            if (typeof onClose === 'function') onClose();
        };
        okBtn.addEventListener('click', onOk);
        return true;
    }

    showInfernoRulesIfNeeded(onClose = null) {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('inferno-rules-modal');
        const okBtn = document.getElementById('inferno-rules-ok');
        if (!modal || !okBtn) return false;

        let alreadySeen = false;
        try {
            alreadySeen = localStorage.getItem(INFERNO_RULES_SEEN_KEY) === '1';
        } catch {
            alreadySeen = false;
        }
        if (alreadySeen) return false;

        this.openModal(modal);

        const onOk = () => {
            this.closeModal(modal);
            okBtn.removeEventListener('click', onOk);
            try {
                localStorage.setItem(INFERNO_RULES_SEEN_KEY, '1');
            } catch {}
            if (typeof onClose === 'function') onClose();
        };
        okBtn.addEventListener('click', onOk);
        return true;
    }

    showLockExplanation(lockDuration, isTimerMode, blockLength = null) {
        if (typeof document === 'undefined') return false;
        try {
            if (localStorage.getItem(LOCK_EXPLANATION_KEY) === '1') return false;
        } catch {}

        if (this.lockExplanationModalShowing) return false;
        this.lockExplanationModalShowing = true;

        const modal = document.getElementById('inferno-feature-modal');
        const titleEl = document.getElementById('inferno-feature-title');
        const contentEl = document.getElementById('inferno-feature-content');
        const okBtn = document.getElementById('inferno-feature-ok');
        if (!modal || !titleEl || !contentEl || !okBtn) return false;

        const durationText = lockDuration >= 1
            ? `${lockDuration.toFixed(1)} seconds`
            : `${(lockDuration * 1000).toFixed(0)} milliseconds`;

        titleEl.textContent = '🔒 Block Locked!';

        let content = `
            <p style="margin-bottom: 10px;"><b>What happened?</b></p>
            <p style="margin-bottom: 10px;">This block collided with another block and is now <b>locked</b> for ${durationText}.</p>
            
            <p style="margin-bottom: 10px;"><b>What does locked mean?</b></p>
            <ul style="margin: 0 0 10px 20px; padding: 0;">
                <li>Block becomes <b>transparent</b> and <b>tinted</b> with its color</li>
                <li>Block <b>cannot move</b> until the lock expires</li>
                <li>Block still <b>intercepts clicks</b> (prevents clicking through)</li>
            </ul>
            
            <p style="margin-bottom: 10px;"><b>Lock duration:</b></p>
        `;

        if (isTimerMode) {
            if (blockLength) {
                let lockFraction = blockLength === 1 ? '1/10' : (blockLength === 2 ? '1/5' : '1/3');
                content += `<p style="margin: 0;">In <b>Timer mode</b>: Lock duration is proportional to block size.</p>`;
                content += `<ul style="margin: 5px 0 0 20px; padding: 0;">`;
                content += `<li><b>Red</b> (1 cell): <b>1/10</b> of remaining time (10%)</li>`;
                content += `<li><b>Teal</b> (2 cells): <b>1/5</b> of remaining time (20%)</li>`;
                content += `<li><b>Yellow</b> (3 cells): <b>1/3</b> of remaining time (33.3%)</li>`;
                content += `</ul>`;
                content += `<p style="margin-top: 5px; margin-bottom: 0;">This block (${blockLength} cell${blockLength > 1 ? 's' : ''}) is locked for <b>${lockFraction}</b> of your remaining time.</p>`;
            } else {
                content += `<p style="margin: 0;">In <b>Timer mode</b>: Lock duration is proportional to block size (1/10, 1/5, or 1/3 of remaining time).</p>`;
            }
        } else {
            content += `<p style="margin: 0;">In <b>Free Flow mode</b>: Lock duration increases with level difficulty.</p>`;
        }

        content += `
            <p style="margin-top: 10px; margin-bottom: 0;"><b>Tip:</b> All blocks auto-unlock when 5 or fewer blocks remain!</p>
        `;

        contentEl.innerHTML = content;
        this.openModal(modal);

        const onOk = () => {
            this.closeModal(modal);
            okBtn.removeEventListener('click', onOk);
            this.lockExplanationModalShowing = false;
            try {
                localStorage.setItem(LOCK_EXPLANATION_KEY, '1');
            } catch {}
        };
        okBtn.addEventListener('click', onOk);
        return true;
    }

    showTimeUp(options = {}) {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('time-up-modal');
        if (!modal) return false;

        const levelDisplay = document.getElementById('time-up-level');
        if (levelDisplay && options.currentLevel !== undefined) {
            levelDisplay.textContent = String(options.currentLevel);
        }

        modal.classList.remove('game-over-modal-entering');
        this.timeUpShown = true;

        const delay = options.delay ?? 2500;
        if (delay <= 0) {
            this.openModal(modal);
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => modal.classList.add('game-over-modal-entering'));
            }
        } else {
            setTimeout(() => {
                this.openModal(modal);
                if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(() => modal.classList.add('game-over-modal-entering'));
                }
            }, delay);
        }
        return true;
    }

    hideTimeUp() {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('time-up-modal');
        if (modal) {
            modal.classList.remove('game-over-modal-entering');
            this.closeModal(modal);
        }
        this.timeUpShown = false;
    }

    showLevelComplete(options = {}) {
        if (typeof document === 'undefined') return false;
        const modal = document.getElementById('level-complete-modal');
        if (!modal) return false;

        const {
            completedLevel = 1,
            timeString = '00:00',
            totalMoves = 0,
            initialBlockCount = 10,
            comboMultiplier = 1.0,
            bankedSeconds = 0,
            humorMessage = ''
        } = options;

        const messageEl = document.getElementById('level-complete-message');
        if (messageEl && humorMessage) {
            messageEl.textContent = humorMessage;
            messageEl.style.fontSize = '20px';
            messageEl.style.fontWeight = '700';
            messageEl.style.color = 'rgba(255, 255, 255, 0.9)';
            messageEl.style.marginTop = '10px';
        }

        const titleEl = document.getElementById('level-complete-title');
        if (titleEl) {
            titleEl.innerHTML = `Level <span class="modal-level-number-inline">${completedLevel}</span> Complete!`;
        }

        const levelNumEl = document.getElementById('level-complete-level');
        if (levelNumEl) {
            levelNumEl.style.display = 'none';
        }

        const timeEl = document.getElementById('level-complete-time');
        if (timeEl) {
            timeEl.textContent = timeString;
        }

        const movesEl = document.getElementById('level-complete-moves');
        if (movesEl) {
            movesEl.textContent = String(totalMoves);
        }

        const blocksEl = document.getElementById('level-complete-blocks');
        if (blocksEl) {
            blocksEl.textContent = String(initialBlockCount);
        }

        const comboEl = document.getElementById('level-complete-combo');
        if (comboEl) {
            comboEl.textContent = `x${comboMultiplier.toFixed(1)}`;
            comboEl.style.color = comboMultiplier >= 1.8 ? '#fbbf24' : '#ffffff';
        }

        const bonusEl = document.getElementById('level-complete-bonus');
        if (bonusEl) {
            bonusEl.textContent = `+${bankedSeconds}s`;
            bonusEl.style.color = bankedSeconds > 0 ? '#34d399' : '#ffffff';
        }

        try {
            playSound('levelComplete', 0.25);
        } catch {}

        return this.openModal(modal);
    }

    hideLevelComplete() {
        return this.closeModal('level-complete-modal');
    }
}

export const dialogManager = new DialogManager();
