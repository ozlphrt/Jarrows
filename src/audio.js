// Audio manager for sound effects
// Handles loading, playing, and muting/unmuting sounds

const AUDIO_ENABLED_KEY = 'jarrows_audio_enabled';

// Audio state
let audioEnabled = true;
let audioContext = null;
let sounds = {};
let soundBuffers = {}; // Store raw ArrayBuffers until AudioContext is ready

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
        loadSound('heartbeat', `${basePath}sound/heartbeat.mp3`)
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
}

