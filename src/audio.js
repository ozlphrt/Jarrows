// Audio manager for sound effects
// Handles loading, playing, and muting/unmuting sounds

const AUDIO_ENABLED_KEY = 'jarrows_audio_enabled';

// Audio state
let audioEnabled = true;
let audioContext = null;
let sounds = {};

// Initialize audio context (required for playing sounds in modern browsers)
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Resume audio context if it's suspended (required for autoplay policy)
            if (audioContext.state === 'suspended') {
                audioContext.resume().catch(e => {
                    console.warn('Failed to resume audio context:', e);
                });
            }
        } catch (e) {
            console.warn('AudioContext not supported:', e);
            return false;
        }
    }
    // Resume if suspended (user interaction may be required)
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(e => {
            console.warn('Failed to resume audio context:', e);
        });
    }
    return true;
}

// Load a sound file
async function loadSound(name, path) {
    try {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sounds[name] = audioBuffer;
        return true;
    } catch (e) {
        console.warn(`Failed to load sound ${name}:`, e);
        return false;
    }
}

// Play a sound effect
function playSound(name, volume = 0.5) {
    if (!audioEnabled || !audioContext) return;
    
    const audioBuffer = sounds[name];
    if (!audioBuffer) {
        console.warn(`Sound ${name} not loaded`);
        return;
    }
    
    try {
        // Resume audio context if suspended (required for autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(e => {
                console.warn('Failed to resume audio context:', e);
            });
        }
        
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = audioBuffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        source.start(0);
    } catch (e) {
        console.warn(`Failed to play sound ${name}:`, e);
    }
}

// Initialize audio system and load all sounds
async function initAudio() {
    // Load audio preference
    try {
        const saved = localStorage.getItem(AUDIO_ENABLED_KEY);
        audioEnabled = saved !== null ? saved === 'true' : true;
    } catch (e) {
        audioEnabled = true;
    }
    
    // Initialize audio context
    if (!initAudioContext()) {
        console.warn('Audio initialization failed');
        return;
    }
    
    // Load sound files
    // Use relative paths that work with Vite's base path configuration
    const basePath = import.meta.env.BASE_URL || '/';
    await Promise.all([
        loadSound('timeAdded', `${basePath}sound/time added.wav`),
        loadSound('timeRemoved', `${basePath}sound/time removed.wav`),
        loadSound('levelComplete', `${basePath}sound/level.wav`)
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

