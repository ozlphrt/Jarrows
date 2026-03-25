// Audio manager for sound effects
// Handles loading, playing, and muting/unmuting sounds

const AUDIO_ENABLED_KEY = 'jarrows_audio_enabled';

// Audio state
let audioEnabled = true;
let audioContext = null;
let sounds = {};
let soundBuffers = {}; // Store raw ArrayBuffers until AudioContext is ready
let lastPlayTimes = {}; // Track last play time for debounce

// Synthetic sound generators (Web Audio API)
const syntheticSounds = {
    /**
     * "Liquid Satin": A soft, filtered white-noise sweep.
     * Evokes air moving over smooth glass.
     */
    'syntheticSpin': (ctx, destination, volume) => {
        // Noise burst - 0.75 seconds of audio data
        const duration = 0.75;
        const bufferSize = Math.ceil(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(6000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);

        const env = ctx.createGain();
        const peakGain = 0.12 * (volume / 0.5);

        env.gain.setValueAtTime(0, ctx.currentTime);
        env.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + 0.02);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(env);
        env.connect(destination);
        noise.start();
        // Explicitly stop after duration to prevent continued playback
        noise.stop(ctx.currentTime + duration);

        return noise;
    },
    /**
     * "Crush": A sharp, plasticky "dice clack" sound.
     * Aligned with standard move sounds but with a mechanical, resonant character.
     */
    'syntheticCrush': (ctx, destination, volume) => {
        const duration = 0.3;
        const now = ctx.currentTime;
        
        // Layer 1: The "Plasticky Thud" (Tighter, resonant low-end)
        const lowOsc = ctx.createOscillator();
        const lowGain = ctx.createGain();
        lowOsc.type = 'sine';
        lowOsc.frequency.setValueAtTime(150, now);
        lowOsc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        lowGain.gain.setValueAtTime(volume * 0.8, now);
        lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        lowOsc.connect(lowGain);
        lowGain.connect(destination);
        lowOsc.start(now);
        lowOsc.stop(now + 0.15);
        
        // Layer 2: The "Dice Clack" (High-Q resonant noise)
        const clackBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.1), ctx.sampleRate);
        const clackData = clackBuffer.getChannelData(0);
        for (let i = 0; i < clackBuffer.length; i++) clackData[i] = Math.random() * 2 - 1;
        const clackSource = ctx.createBufferSource();
        clackSource.buffer = clackBuffer;
        const clackFilter = ctx.createBiquadFilter();
        clackFilter.type = "bandpass";
        clackFilter.frequency.setValueAtTime(2500, now);
        clackFilter.Q.setValueAtTime(12, now); // High resonance for "plastic" feel
        const clackGain = ctx.createGain();
        clackGain.gain.setValueAtTime(volume * 1.5, now); // Sharp attack
        clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        clackSource.connect(clackFilter);
        clackFilter.connect(clackGain);
        clackGain.connect(destination);
        clackSource.start(now);

        // Layer 3: The "Satin Friction" (Aligned with 'syntheticSpin')
        const satinBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const satinData = satinBuffer.getChannelData(0);
        for (let i = 0; i < satinBuffer.length; i++) satinData[i] = Math.random() * 2 - 1;
        const satinSource = ctx.createBufferSource();
        satinSource.buffer = satinBuffer;
        const satinFilter = ctx.createBiquadFilter();
        satinFilter.type = "highpass";
        satinFilter.frequency.setValueAtTime(6000, now);
        satinFilter.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.5);
        const satinGain = ctx.createGain();
        satinGain.gain.setValueAtTime(volume * 0.4, now);
        satinGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);
        satinSource.connect(satinFilter);
        satinFilter.connect(satinGain);
        satinGain.connect(destination);
        satinSource.start(now);

        return lowOsc; // Return the first oscillator as a representative source
    }
};

// Initialize audio context (required for playing sounds in modern browsers)
// Deferred until first user interaction to avoid autoplay policy warnings
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return false; // Audio not supported
        }
    }
    return true;
}

// Load a sound file (stores raw buffer, decodes when AudioContext is ready)
async function loadSound(name, path) {
    try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        soundBuffers[name] = arrayBuffer;
        // Decode if AudioContext is already available
        if (audioContext && audioContext.state !== 'closed') {
            try {
                sounds[name] = await audioContext.decodeAudioData(arrayBuffer);
            } catch (e) {
                // Will decode on first play
            }
        }
        return true;
    } catch (e) {
        console.warn(`Failed to load sound ${name}:`, e);
        return false;
    }
}

// Play a sound effect
// Returns the audio source so it can be stopped if needed
async function playSound(name, volume = 0.5) {
    if (!audioEnabled) return null;

    // Initialize AudioContext on first user interaction
    if (!audioContext) {
        if (!initAudioContext()) {
            return null; // Audio not supported
        }
        // Decode all pending sound buffers
        for (const [soundName, arrayBuffer] of Object.entries(soundBuffers)) {
            if (!sounds[soundName]) {
                try {
                    sounds[soundName] = await audioContext.decodeAudioData(arrayBuffer);
                } catch (e) {
                    // Skip if decode fails
                }
            }
        }
    }

    // Resume audio context if suspended (required for autoplay policy)
    if (audioContext.state === 'suspended') {
        try {
            await audioContext.resume();
        } catch (e) {
            // Silently fail - will retry next time
            return null;
        }
    }

    // Debounce check: Prevent playing the same sound multiple times within 100ms
    const now = Date.now();
    const lastTime = lastPlayTimes[name] || 0;
    if (now - lastTime < 100) {
        // Debounced - skip playing
        return null;
    }
    lastPlayTimes[name] = now;

    // Check for synthetic sound first
    if (syntheticSounds[name]) {
        try {
            return syntheticSounds[name](audioContext, audioContext.destination, volume);
        } catch (e) {
            console.warn(`Failed to play synthetic sound ${name}:`, e);
            return null;
        }
    }

    const audioBuffer = sounds[name];
    if (!audioBuffer) {
        // Try to decode if we have the raw buffer
        if (soundBuffers[name]) {
            try {
                sounds[name] = await audioContext.decodeAudioData(soundBuffers[name]);
            } catch (e) {
                return null; // Can't decode
            }
        } else {
            return null; // Sound not loaded
        }
    }

    try {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = sounds[name];
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(0);
        return source; // Return source so it can be stopped
    } catch (e) {
        // Silently fail
        return null;
    }
}

// Initialize audio system and load all sounds
// Audio context creation is deferred until first user interaction
async function initAudio() {
    // Load audio preference
    try {
        const saved = localStorage.getItem(AUDIO_ENABLED_KEY);
        audioEnabled = saved !== null ? saved === 'true' : true;
    } catch (e) {
        audioEnabled = true;
    }

    // Don't create AudioContext immediately - wait for user interaction
    // This avoids autoplay policy warnings

    // Load sound files (will be decoded when AudioContext is ready)
    // Use relative paths that work with Vite's base path configuration
    const basePath = import.meta.env.BASE_URL || '/';
    await Promise.all([
        loadSound('timeAdded', `${basePath}sound/time added.wav`),
        loadSound('timeRemoved', `${basePath}sound/time removed.wav`),
        loadSound('levelComplete', `${basePath}sound/level.wav`),
    ]);

    console.log('Audio system initialized', { audioEnabled, soundsLoaded: Object.keys(sounds).length });
}

// Toggle audio on/off
function toggleAudio() {
    audioEnabled = !audioEnabled;
    try {
        localStorage.setItem(AUDIO_ENABLED_KEY, audioEnabled.toString());
    } catch (e) {
        console.warn('Failed to save audio preference:', e);
    }
    return audioEnabled;
}

// Get current audio state
function isAudioEnabled() {
    return audioEnabled;
}

// Export functions
export {
    initAudio,
    playSound,
    toggleAudio,
    isAudioEnabled
};

// Expose to window for HTML script access
if (typeof window !== 'undefined') {
    window.toggleAudio = toggleAudio;
    window.isAudioEnabled = isAudioEnabled;
    window.playSound = playSound;
}

