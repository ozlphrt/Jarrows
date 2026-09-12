/**
 * Settings & HUD Controls Module
 * Handles themes, audio toggle, block coloring, quality presets, lighting,
 * PWA installation guidance, QR code sharing, and build version modal.
 */

import QRCode from 'qrcode';
import { setGradientBackground, setupFog, applyLightPreset } from '../scene.js';
import { gameState } from '../core/GameState.js';
import { eventBus } from '../core/EventBus.js';

// DEV ONLY: prevent a previously-registered Service Worker from serving stale cached assets
export async function unregisterServiceWorkersAndClearCaches() {
    try {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const reg of regs) {
                try { await reg.unregister(); } catch { }
            }
        }
        if ('caches' in window) {
            const names = await caches.keys();
            await Promise.allSettled(names.map((n) => caches.delete(n)));
        }
    } catch {
        // best-effort
    }
}

// Load preferences from localStorage
export function loadPreferences() {
    try {
        const savedTheme = localStorage.getItem('jarrows_theme');
        const savedColors = localStorage.getItem('jarrows_colors');
        const savedQuality = localStorage.getItem('jarrows_quality');
        const savedAutoZoom = localStorage.getItem('jarrows_auto_zoom');
        const savedLightPreset = localStorage.getItem('jarrows_light_preset');

        return {
            isDarkTheme: savedTheme !== null ? savedTheme === 'dark' : true,
            useColoredBlocks: savedColors !== null ? savedColors === 'colored' : false,
            qualityPreset: savedQuality || 'balanced',
            autoZoomEnabled: savedAutoZoom !== null ? savedAutoZoom === 'true' : true,
            lightPreset: savedLightPreset || 'default'
        };
    } catch (e) {
        console.warn('Failed to load preferences:', e);
        return {
            isDarkTheme: true,
            useColoredBlocks: false,
            qualityPreset: 'balanced',
            autoZoomEnabled: true,
            lightPreset: 'default'
        };
    }
}

// Save preferences to localStorage
export function savePreferences(prefs) {
    try {
        localStorage.setItem('jarrows_theme', prefs.isDarkTheme ? 'dark' : 'light');
        localStorage.setItem('jarrows_colors', prefs.useColoredBlocks ? 'colored' : 'white');
        localStorage.setItem('jarrows_quality', prefs.qualityPreset);
        localStorage.setItem('jarrows_auto_zoom', prefs.autoZoomEnabled.toString());
        localStorage.setItem('jarrows_light_preset', prefs.lightPreset);
    } catch (e) {
        console.warn('Failed to save preferences:', e);
    }
}

export function selectDebugReflectionPreset(preset) {
    if (window.setReflectionPreset) {
        window.setReflectionPreset(preset);
    }
    ['gallery', 'hero', 'blades'].forEach(function(m) {
        const btn = document.getElementById('debug-ref-btn-' + m);
        if (!btn) return;
        if (m === preset) {
            btn.style.background = 'linear-gradient(135deg, #00f0ff, #0077ff)';
            btn.style.color = '#ffffff';
            btn.style.fontWeight = '700';
        } else {
            btn.style.background = 'rgba(255, 255, 255, 0.08)';
            btn.style.color = '#cbd5e1';
            btn.style.fontWeight = '600';
        }
    });
}
if (typeof window !== 'undefined') {
    window.selectDebugReflectionPreset = selectDebugReflectionPreset;
}

/**
 * Initialize all HUD settings toggles and modal listeners
 */
export function initSettingsUI() {
    const preferences = loadPreferences();
    let isDarkTheme = preferences.isDarkTheme;
    let useColoredBlocks = preferences.useColoredBlocks || false;
    let qualityPreset = preferences.qualityPreset || 'balanced';
    let autoZoomEnabled = preferences.autoZoomEnabled !== undefined ? preferences.autoZoomEnabled : true;
    let lightPreset = preferences.lightPreset || 'default';
    let handlersSetup = false;

    window.useColoredBlocksDefault = useColoredBlocks;
    window.jarrowsQualityPreset = qualityPreset;

    function applyInitialLighting() {
        if (window.gameScene && window.lights) {
            const name = applyLightPreset(window.gameScene, window.lights, lightPreset, true);
            const popup = document.getElementById('light-preset-popup');
            if (popup) popup.textContent = name;
        } else {
            setTimeout(applyInitialLighting, 100);
        }
    }
    applyInitialLighting();

    function updateThemeUI() {
        const scene = window.gameScene;
        const themeIcon = document.getElementById('theme-icon');
        const themeToggle = document.getElementById('theme-toggle');

        if (scene) {
            if (isDarkTheme) {
                setGradientBackground(scene, 0x0f0f0f, 0x050505);
                setupFog(scene, true);
            } else {
                setGradientBackground(scene, 0x5a7f98, 0x3a5a7a);
                setupFog(scene, false);
            }
        }

        if (themeIcon) {
            if (isDarkTheme) {
                themeIcon.setAttribute('fill', 'none');
                themeIcon.setAttribute('stroke', 'currentColor');
                themeIcon.setAttribute('stroke-width', '2');
                themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none"></path>';
            } else {
                themeIcon.setAttribute('fill', 'none');
                themeIcon.setAttribute('stroke', 'currentColor');
                themeIcon.setAttribute('stroke-width', '2');
                themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            }
        }
        if (themeToggle) {
            if (isDarkTheme) themeToggle.classList.add('active');
            else themeToggle.classList.remove('active');
        }
    }

    function updateColorsIcon() {
        const colorsIcon = document.getElementById('colors-icon');
        const colorsToggle = document.getElementById('colors-toggle');
        if (!colorsIcon || !colorsToggle) return;

        if (useColoredBlocks) {
            colorsToggle.classList.add('active');
            colorsIcon.innerHTML = `
                <rect x="3" y="3" width="7" height="7" rx="1" fill="#e74c3c"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="#3498db"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="#2ecc71"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="#f39c12"></rect>
            `;
        } else {
            colorsToggle.classList.remove('active');
            colorsIcon.innerHTML = `
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="white"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white"></rect>
            `;
        }
    }

    function updateAudioIcon() {
        const audioIcon = document.getElementById('audio-icon');
        const audioToggle = document.getElementById('audio-toggle');
        if (!audioIcon || !audioToggle) return;

        const isAudioActive = window.isAudioEnabled ? window.isAudioEnabled() : true;
        if (isAudioActive) {
            audioToggle.classList.add('active');
            audioIcon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
        } else {
            audioToggle.classList.remove('active');
            audioIcon.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
        }
    }

    function updateBlockColors() {
        const blocks = window.gameBlocks;
        if (!blocks || !blocks.length) return;
        blocks.forEach(block => {
            if (block && typeof block.updateBlockColor === 'function') {
                const color = useColoredBlocks ? (block.originalColor || 0xffffff) : 0xffffff;
                block.updateBlockColor(color);
            }
        });
    }

    function setupToggleHandlers() {
        if (handlersSetup) return;

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                isDarkTheme = !isDarkTheme;
                savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
                updateThemeUI();
            });
        }

        const colorsToggle = document.getElementById('colors-toggle');
        if (colorsToggle) {
            colorsToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                useColoredBlocks = !useColoredBlocks;
                window.useColoredBlocksDefault = useColoredBlocks;
                savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
                updateColorsIcon();
                updateBlockColors();
            });
        }

        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.toggleAudio) {
                    window.toggleAudio();
                    updateAudioIcon();
                }
            });
        }

        const settingsToggle = document.getElementById('settings-toggle');
        const settingsMenu = document.getElementById('settings-menu');
        if (settingsToggle && settingsMenu) {
            settingsToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                const isVisible = settingsMenu.style.display === 'flex';
                settingsMenu.style.display = isVisible ? 'none' : 'flex';
            });
            document.addEventListener('click', function (e) {
                if (settingsMenu && !settingsMenu.contains(e.target) && e.target !== settingsToggle) {
                    settingsMenu.style.display = 'none';
                }
            });
        }

        // Share & QR Modal
        const shareBtn = document.getElementById('share-btn');
        const sharePWAModal = document.getElementById('share-pwa-modal');
        const shareModalClose = document.getElementById('share-modal-close');
        if (shareBtn) shareBtn.addEventListener('click', showSharePWAModal);
        if (shareModalClose && sharePWAModal) {
            shareModalClose.addEventListener('click', () => { sharePWAModal.style.display = 'none'; });
        }

        function showSharePWAModal() {
            if (!sharePWAModal) return;
            const currentUrl = window.location.href;
            const urlDisplay = document.getElementById('share-url-display');
            if (urlDisplay) urlDisplay.textContent = currentUrl;

            const qrCanvas = document.getElementById('qr-code-canvas');
            if (qrCanvas) {
                QRCode.toCanvas(qrCanvas, currentUrl, { width: 200, margin: 2 }).catch(err => {
                    console.error('QR Error:', err);
                });
            }
            sharePWAModal.style.display = 'flex';
        }

        // VER modal
        const verBtn = document.getElementById('ver-btn');
        const verModal = document.getElementById('ver-modal');
        const verModalOk = document.getElementById('ver-modal-ok');
        const verModalCloseX = document.getElementById('ver-modal-close-x');
        if (verBtn && verModal) verBtn.addEventListener('click', () => { verModal.style.display = 'flex'; });
        if (verModalOk && verModal) verModalOk.addEventListener('click', () => { verModal.style.display = 'none'; });
        if (verModalCloseX && verModal) verModalCloseX.addEventListener('click', () => { verModal.style.display = 'none'; });

        updateThemeUI();
        updateColorsIcon();
        updateAudioIcon();
        handlersSetup = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupToggleHandlers);
    } else {
        setupToggleHandlers();
    }
}
