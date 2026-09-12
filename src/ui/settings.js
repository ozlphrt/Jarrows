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
        const settingsContainer = document.getElementById('settings-container');
        if (settingsToggle && settingsMenu) {
            settingsToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                const isVisible = settingsMenu.style.display === 'flex' || settingsMenu.classList.contains('show');
                settingsMenu.style.display = isVisible ? 'none' : 'flex';
                settingsMenu.classList.toggle('show', !isVisible);
            });
            document.addEventListener('click', function (e) {
                if (settingsMenu && !settingsMenu.contains(e.target) && e.target !== settingsToggle) {
                    settingsMenu.style.display = 'none';
                    settingsMenu.classList.remove('show');
                }
            });
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.addEventListener('pointerdown', function () {
                    if (settingsMenu) {
                        settingsMenu.style.display = 'none';
                        settingsMenu.classList.remove('show');
                    }
                });
            }
        }

        function closeSettingsMenu() {
            if (settingsMenu) {
                settingsMenu.style.display = 'none';
                settingsMenu.classList.remove('show');
            }
        }

        // Auto-zoom toggle & HUD camera reset button
        const autoZoomToggle = document.getElementById('auto-zoom-toggle');
        const autoZoomIcon = document.getElementById('auto-zoom-icon');
        const cameraZoomBtn = document.getElementById('camera-zoom-btn');
        let cameraBtnFadeTimeout = null;

        function updateAutoZoomIcon() {
            if (autoZoomToggle && autoZoomIcon) {
                if (autoZoomEnabled) {
                    autoZoomIcon.innerHTML = '<path d="M23 7l-7 5 7 5V7z" fill="none"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none"></rect>';
                    autoZoomToggle.classList.add('active');
                } else {
                    autoZoomIcon.innerHTML = '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 7.16" fill="none"></path><line x1="1" y1="1" x2="23" y2="23" fill="none"></line><path d="M23 7l-7 5 7 5V7z" fill="none"></path>';
                    autoZoomToggle.classList.remove('active');
                }
            }
        }
        window.updateAutoZoomIcon = updateAutoZoomIcon;

        window.showCameraAutoZoomButton = function () {
            if (!cameraZoomBtn) return;
            if (cameraBtnFadeTimeout) {
                clearTimeout(cameraBtnFadeTimeout);
                cameraBtnFadeTimeout = null;
            }
            autoZoomEnabled = false;
            window.autoZoomEnabled = false;
            updateAutoZoomIcon();
            cameraZoomBtn.style.display = 'inline-flex';
            requestAnimationFrame(() => {
                cameraZoomBtn.style.opacity = '1';
            });
        };

        window.hideCameraAutoZoomButton = function () {
            if (!cameraZoomBtn) return;
            cameraZoomBtn.style.opacity = '0';
            if (cameraBtnFadeTimeout) clearTimeout(cameraBtnFadeTimeout);
            cameraBtnFadeTimeout = setTimeout(() => {
                if (cameraZoomBtn && cameraZoomBtn.style.opacity === '0') {
                    cameraZoomBtn.style.display = 'none';
                }
            }, 500);
        };

        function activateAutoZoom() {
            autoZoomEnabled = true;
            window.autoZoomEnabled = true;
            updateAutoZoomIcon();
            window.hideCameraAutoZoomButton();
            savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
            if (typeof window.onAutoZoomReenabled === 'function') {
                window.onAutoZoomReenabled();
            }
        }

        if (autoZoomToggle) {
            updateAutoZoomIcon();
            autoZoomToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                if (autoZoomEnabled) {
                    autoZoomEnabled = false;
                    window.autoZoomEnabled = false;
                    updateAutoZoomIcon();
                    savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
                } else {
                    activateAutoZoom();
                }
            });
        }

        if (cameraZoomBtn) {
            cameraZoomBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                activateAutoZoom();
            });
        }

        // Lighting Cycles toggle handler
        const lightingToggle = document.getElementById('lighting-toggle');
        if (lightingToggle) {
            lightingToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                const presets = ['default', 'warm', 'cool', 'dramatic', 'studio'];
                const currentIndex = presets.indexOf(lightPreset);
                const nextIndex = (currentIndex + 1) % presets.length;
                lightPreset = presets[nextIndex];

                const name = applyLightPreset(window.gameScene, window.lights, lightPreset);
                const popup = document.getElementById('light-preset-popup');
                if (popup) {
                    popup.textContent = name || lightPreset;
                    popup.classList.add('show');
                    if (window.lightPopupTimeout) clearTimeout(window.lightPopupTimeout);
                    window.lightPopupTimeout = setTimeout(() => {
                        popup.classList.remove('show');
                    }, 1500);
                }
                savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
            });
        }

        // Shadows toggle handler
        const shadowsToggle = document.getElementById('shadows-toggle');
        if (shadowsToggle) {
            const updateShadowsIcon = () => {
                const isEnabled = window.isShadowsEnabled ? window.isShadowsEnabled() : true;
                if (isEnabled) {
                    shadowsToggle.classList.add('active');
                } else {
                    shadowsToggle.classList.remove('active');
                }
            };
            updateShadowsIcon();

            shadowsToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                if (window.toggleShadows) {
                    const state = window.toggleShadows();
                    updateShadowsIcon();
                    const popup = document.getElementById('shadows-popup');
                    if (popup) {
                        popup.textContent = state ? 'Shadows: ON' : 'Shadows: OFF';
                        popup.classList.add('show');
                        if (window.shadowPopupTimeout) clearTimeout(window.shadowPopupTimeout);
                        window.shadowPopupTimeout = setTimeout(() => popup.classList.remove('show'), 1500);
                    }
                }
            });
        }

        // Quality & Battery preset toggle handler
        const qualityToggle = document.getElementById('quality-toggle');
        if (qualityToggle) {
            qualityToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                const presets = ['balanced', 'performance', 'battery'];
                const current = qualityPreset || 'balanced';
                const nextIdx = (presets.indexOf(current) + 1) % presets.length;
                qualityPreset = presets[nextIdx];
                window.jarrowsQualityPreset = qualityPreset;
                if (window.applyQualityPreset) {
                    window.applyQualityPreset(qualityPreset);
                }
                savePreferences({ isDarkTheme, useColoredBlocks, qualityPreset, autoZoomEnabled, lightPreset });
                const popup = document.getElementById('quality-popup');
                if (popup) {
                    const labels = { balanced: 'Balanced', performance: 'Performance', battery: 'Battery Saver' };
                    popup.textContent = labels[qualityPreset] || qualityPreset;
                    popup.classList.add('show');
                    if (window.qualityPopupTimeout) clearTimeout(window.qualityPopupTimeout);
                    window.qualityPopupTimeout = setTimeout(() => popup.classList.remove('show'), 1500);
                }
            });
        }

        // Debug Copy Layout button
        const debugCopyBtn = document.getElementById('debug-copy-layout-btn');
        if (debugCopyBtn) {
            debugCopyBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                closeSettingsMenu();
                if (typeof window.copyLayoutToClipboard === 'function') {
                    window.copyLayoutToClipboard();
                }
            });
        }

        // Select Level Modal & Trigger Handlers
        const selectLevelBtn = document.getElementById('select-level-btn');
        const selectLevelModal = document.getElementById('select-level-modal');
        const selectLevelInput = document.getElementById('select-level-input');
        const selectLevelConfirm = document.getElementById('select-level-confirm');
        const selectLevelCancel = document.getElementById('select-level-cancel');
        const levelContainer = document.getElementById('level-container');

        function openSelectLevelModal(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (window.updateIdleTimers) window.updateIdleTimers();
            const currentLevelText = document.getElementById('timer-level')?.textContent ||
                                     document.getElementById('level-value')?.textContent || '1';
            const currentLevel = parseInt(currentLevelText, 10);
            if (selectLevelInput) {
                selectLevelInput.value = isNaN(currentLevel) ? 1 : currentLevel;
                setTimeout(() => {
                    try {
                        selectLevelInput.focus();
                        selectLevelInput.select();
                    } catch {}
                }, 50);
            }
            if (selectLevelModal) {
                selectLevelModal.style.display = 'flex';
            }
            closeSettingsMenu();
        }

        if (selectLevelBtn && selectLevelModal) {
            selectLevelBtn.addEventListener('click', openSelectLevelModal);
        }

        if (levelContainer && selectLevelModal) {
            levelContainer.style.setProperty('pointer-events', 'auto', 'important');
            levelContainer.style.cursor = 'pointer';
            levelContainer.setAttribute('title', 'Select Level');
            levelContainer.addEventListener('click', openSelectLevelModal);
        }

        if (selectLevelCancel && selectLevelModal) {
            selectLevelCancel.addEventListener('click', (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                selectLevelModal.style.display = 'none';
            });
        }

        if (selectLevelModal) {
            selectLevelModal.addEventListener('click', (e) => {
                if (e.target === selectLevelModal) {
                    selectLevelModal.style.display = 'none';
                }
            });
        }

        if (selectLevelConfirm && selectLevelModal && selectLevelInput) {
            const handleConfirm = () => {
                const newLevel = parseInt(selectLevelInput.value, 10);
                if (!isNaN(newLevel) && newLevel >= 0) {
                    selectLevelModal.style.display = 'none';
                    if (typeof window.jumpToLevel === 'function') {
                        window.jumpToLevel(newLevel);
                    } else if (typeof window.debugJumpToLevel === 'function') {
                        window.debugJumpToLevel(newLevel);
                    } else {
                        window.location.href = window.location.pathname + '?level=' + newLevel;
                    }
                }
            };

            selectLevelConfirm.addEventListener('click', (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                handleConfirm();
            });

            selectLevelInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleConfirm();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    selectLevelModal.style.display = 'none';
                }
            });
        }

        // Share & QR Modal
        const shareToggle = document.getElementById('share-toggle') || document.getElementById('share-btn');
        const sharePWAModal = document.getElementById('share-pwa-modal');
        const shareModalClose = document.getElementById('share-modal-close') || document.getElementById('share-pwa-modal-ok');
        if (shareToggle) {
            shareToggle.addEventListener('click', function (e) {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                closeSettingsMenu();
                showSharePWAModal();
            });
        }
        if (shareModalClose && sharePWAModal) {
            shareModalClose.addEventListener('click', () => { sharePWAModal.style.display = 'none'; });
        }
        if (sharePWAModal) {
            sharePWAModal.addEventListener('click', (e) => {
                if (e.target === sharePWAModal) sharePWAModal.style.display = 'none';
            });
        }

        function updatePWAInstallGuidance() {
            const pwaContent = document.getElementById('pwa-install-content');
            if (!pwaContent) return;

            const isStandalone = (typeof window !== 'undefined' && (
                window.matchMedia?.('(display-mode: standalone)')?.matches ||
                window.navigator?.standalone ||
                document.referrer?.includes('android-app://')
            ));

            if (isStandalone) {
                pwaContent.innerHTML = '<p style="opacity: 0.8; margin-bottom: 12px;">✅ App is already installed!</p>';
            } else {
                pwaContent.innerHTML = `
                    <div style="margin-bottom: 12px;">
                        <p style="font-weight: 700; margin-bottom: 8px;">Install on Mobile:</p>
                        <div style="margin-bottom: 12px;">
                            <p style="font-weight: 600; margin-bottom: 4px; font-size: 13px;">📱 iOS (iPhone/iPad):</p>
                            <ol style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6; font-size: 12px;">
                                <li>Tap the <b>Share</b> button in Safari</li>
                                <li>Scroll down and tap <b>"Add to Home Screen"</b></li>
                                <li>Tap <b>"Add"</b> to confirm</li>
                            </ol>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <p style="font-weight: 600; margin-bottom: 4px; font-size: 13px;">🤖 Android:</p>
                            <ol style="margin: 0; padding-left: 20px; line-height: 1.6; font-size: 12px;">
                                <li>Tap the <b>menu</b> (three dots) in Chrome</li>
                                <li>Tap <b>"Install app"</b> or <b>"Add to Home screen"</b></li>
                                <li>Tap <b>"Install"</b> to confirm</li>
                            </ol>
                        </div>
                    </div>
                `;
            }
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
            updatePWAInstallGuidance();
            sharePWAModal.style.display = 'flex';
        }

        // Build Version Modal
        const verToggle = document.getElementById('ver-toggle') || document.getElementById('ver-btn');
        const verModal = document.getElementById('ver-modal');
        const verModalOk = document.getElementById('ver-modal-ok');
        const verModalCloseX = document.getElementById('ver-modal-close-x');
        const verModalCopy = document.getElementById('ver-modal-copy');
        const verModalValue = document.getElementById('ver-modal-value');

        function getBuildIdString() {
            const v = (window.jarrowsVersion || 'v8.33.0').toString().trim();
            const sha = (window.jarrowsGitSha || '').toString().trim();
            return sha ? `${v} @ ${sha}` : v;
        }

        if (verToggle && verModal) {
            verToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.updateIdleTimers) window.updateIdleTimers();
                closeSettingsMenu();
                if (verModalValue) {
                    verModalValue.textContent = getBuildIdString();
                }
                verModal.style.display = 'flex';
            });
        }
        if (verModalOk && verModal) verModalOk.addEventListener('click', () => { verModal.style.display = 'none'; });
        if (verModalCloseX && verModal) verModalCloseX.addEventListener('click', () => { verModal.style.display = 'none'; });
        if (verModal) {
            verModal.addEventListener('click', (e) => {
                if (e.target === verModal) verModal.style.display = 'none';
            });
        }
        if (verModalCopy) {
            verModalCopy.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(getBuildIdString());
                    verModalCopy.textContent = 'Copied!';
                    setTimeout(() => { verModalCopy.textContent = 'Copy'; }, 1000);
                } catch {
                    // fallback
                }
            });
        }

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
