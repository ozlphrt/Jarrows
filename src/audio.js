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
     * "Springy Boing": A very soft, gentle, warm spring wobble with low-pass filtering.
     */
    'syntheticBlockSnap': (ctx, destination, volume = 0.2) => {
        const now = ctx.currentTime;
        const duration = 0.18;
        const baseVol = volume * 0.045; // Whisper-soft level

        // Master warm low-pass filter to remove any sharpness/harshness
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.Q.setValueAtTime(1.2, now);
        filter.connect(destination);

        // Layer 1: Spring Vibrato Wobble (24Hz LFO modulating pitch for elastic boing)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(24, now); // 24Hz soft coil oscillation
        lfoGain.gain.setValueAtTime(35, now);  // Subtle wobble depth in Hz
        lfoGain.gain.exponentialRampToValueAtTime(0.1, now + duration);
        lfo.connect(lfoGain);

        // Layer 2: Primary "Boiiing" Oscillator (Smooth elastic pitch sweep)
        const springOsc = ctx.createOscillator();
        const springGain = ctx.createGain();
        springOsc.type = 'sine';
        springOsc.frequency.setValueAtTime(140, now);
        springOsc.frequency.exponentialRampToValueAtTime(420, now + 0.035);
        springOsc.frequency.exponentialRampToValueAtTime(210, now + duration);
        lfoGain.connect(springOsc.frequency);

        springGain.gain.setValueAtTime(0, now);
        springGain.gain.linearRampToValueAtTime(baseVol, now + 0.01);
        springGain.gain.exponentialRampToValueAtTime(0.00005, now + duration);

        springOsc.connect(springGain);
        springGain.connect(filter);

        // Layer 3: Warm Sine Overtone
        const harmOsc = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(280, now);
        harmOsc.frequency.exponentialRampToValueAtTime(560, now + 0.035);
        harmOsc.frequency.exponentialRampToValueAtTime(310, now + duration * 0.6);
        lfoGain.connect(harmOsc.frequency);

        harmGain.gain.setValueAtTime(0, now);
        harmGain.gain.linearRampToValueAtTime(baseVol * 0.3, now + 0.012);
        harmGain.gain.exponentialRampToValueAtTime(0.00005, now + duration * 0.6);

        harmOsc.connect(harmGain);
        harmGain.connect(filter);

        // Start and stop all nodes cleanly
        lfo.start(now);
        lfo.stop(now + duration);
        springOsc.start(now);
        springOsc.stop(now + duration);
        harmOsc.start(now);
        harmOsc.stop(now + duration * 0.65);

        return springOsc;
    },
    'syntheticSpin': (ctx, destination, volume) => {
        return syntheticSounds['syntheticBlockSnap'](ctx, destination, volume);
    },
    'syntheticMagneticSnap': (ctx, destination, volume) => {
        return syntheticSounds['syntheticBlockSnap'](ctx, destination, volume);
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
    },

    /**
     * "Fire Ignite": A rich whoosh of flame ignition with snapping wood/ember crackles.
     */
    'syntheticFireIgnite': (ctx, destination, volume = 0.25) => {
        const now = ctx.currentTime;
        const duration = 0.5;
        const baseVol = volume * 0.26;

        // Layer 1: Fire ignition whoosh
        const bufferSize = Math.ceil(ctx.sampleRate * duration);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(600, now);
        bandpass.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
        bandpass.frequency.exponentialRampToValueAtTime(300, now + duration);
        bandpass.Q.setValueAtTime(1.2, now);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(baseVol, now + 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        whiteNoise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(destination);
        whiteNoise.start(now);
        whiteNoise.stop(now + duration);

        // Layer 2: Ember crackles
        for (let j = 0; j < 3; j++) {
            const crackleTime = now + 0.04 + Math.random() * 0.25;
            const popOsc = ctx.createOscillator();
            popOsc.type = 'triangle';
            popOsc.frequency.setValueAtTime(1600 + Math.random() * 600, crackleTime);
            popOsc.frequency.exponentialRampToValueAtTime(200, crackleTime + 0.02);

            const popGain = ctx.createGain();
            popGain.gain.setValueAtTime(baseVol * 0.5, crackleTime);
            popGain.gain.exponentialRampToValueAtTime(0.0001, crackleTime + 0.02);

            popOsc.connect(popGain);
            popGain.connect(destination);
            popOsc.start(crackleTime);
            popOsc.stop(crackleTime + 0.025);
        }

        return whiteNoise;
    },

    /**
     * "Molten Sizzle": A soft burning ember sizzle / heat crackle.
     */
    'syntheticSizzle': (ctx, destination, volume = 0.25) => {
        const now = ctx.currentTime;
        const duration = 0.45;
        const baseVol = volume * 0.22;

        // Filtered noise for sizzle
        const bufferSize = Math.ceil(ctx.sampleRate * duration);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * (Math.random() < 0.35 ? 1.0 : 0.25);
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(2400, now);
        bandpass.Q.setValueAtTime(1.8, now);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(baseVol, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        whiteNoise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);
        return whiteNoise;
    },

    /**
     * "Steam Quench": A gentle steam release quench sound when charred blocks cool and recover.
     */
    'syntheticQuench': (ctx, destination, volume = 0.25) => {
        const now = ctx.currentTime;
        const duration = 0.35;
        const baseVol = volume * 0.18;

        const bufferSize = Math.ceil(ctx.sampleRate * duration);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(3200, now);
        lowpass.frequency.exponentialRampToValueAtTime(600, now + duration);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(baseVol, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        whiteNoise.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(destination);

        whiteNoise.start(now);
        whiteNoise.stop(now + duration);
        return whiteNoise;
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

    // Debounce check: Prevent playing the same sound multiple times within debounce threshold
    const now = Date.now();
    const lastTime = lastPlayTimes[name] || 0;
    const debounceMs = (name === 'syntheticBlockSnap' || name === 'syntheticMagneticSnap') ? 8 : 100;
    if (now - lastTime < debounceMs) {
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

