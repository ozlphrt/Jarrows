import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Lighting system v5.0.0 - Updated default values

/**
 * Create a gradient background texture
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} topColor - Top color (hex)
 * @param {number} bottomColor - Bottom color (hex)
 */
export function setGradientBackground(scene, topColor, bottomColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create gradient from top to bottom
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    
    // Convert hex to RGB
    const topR = (topColor >> 16) & 0xff;
    const topG = (topColor >> 8) & 0xff;
    const topB = topColor & 0xff;
    
    const bottomR = (bottomColor >> 16) & 0xff;
    const bottomG = (bottomColor >> 8) & 0xff;
    const bottomB = bottomColor & 0xff;
    
    gradient.addColorStop(0, `rgb(${topR}, ${topG}, ${topB})`);
    gradient.addColorStop(1, `rgb(${bottomR}, ${bottomG}, ${bottomB})`);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
}

/**
 * Set up fog for the scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number|null} near - Fog near distance
 * @param {number|null} far - Fog far distance
 * @param {number} color - Fog color (hex)
 */
export function setupFog(scene, near = null, far = null, color = 0x000000) {
    if (near === null || far === null) {
        scene.fog = null;
    } else {
        scene.fog = new THREE.Fog(color, near, far);
    }
}

export function createLights(scene) {
    // Platform/perf heuristics
    const isIOS = (() => {
        try {
            return (
                /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
            );
        } catch {
            return false;
        }
    })();

    const isMobileLike = (() => {
        try {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                (typeof window !== 'undefined' && (window.innerWidth <= 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)))
            );
        } catch {
            return false;
        }
    })();

    // =========================================================================
    // 4-TIER VARYING EXPOSURE 3D STUDIO LIGHTING
    // Calibrated so all 4 tower sides have distinct, gradual exposures:
    // Side 1 (+X) -> Brightest
    // Side 2 (+Z) -> Less bright
    // Side 3 (-Z) -> Balanced
    // Side 4 (-X) -> Elevated shade tier (clearly legible on mobile OLEDs)
    // =========================================================================
    
    // 1. Ambient Light: Studio ambient baseline
    // 1. Ambient Light: Balanced baseline illumination - clear shadow legibility without bleaching
    const ambientIntensity = isMobileLike ? 0.38 : 0.32;
    const ambientLight = new THREE.AmbientLight(0xdce8ff, ambientIntensity);
    scene.add(ambientLight);
    
    // 2. Key Light: Primary warm directional sun & shadow caster
    // Calibrated to 0.72 so the brightest face never washes out or bleaches colors
    const keyIntensity = isMobileLike ? 0.70 : 0.75;
    const keyLight = new THREE.DirectionalLight(0xfffcf2, keyIntensity);
    keyLight.position.set(32.0, 38.0, 20.0);
    keyLight.castShadow = true;
    
    // Shadow camera bounds tailored for the whole tower
    keyLight.shadow.camera.left = -24;
    keyLight.shadow.camera.right = 24;
    keyLight.shadow.camera.top = 34;
    keyLight.shadow.camera.bottom = -34;
    keyLight.shadow.camera.near = 1.0;
    keyLight.shadow.camera.far = isIOS ? 95.0 : 90.0;
    keyLight.shadow.camera.position.set(0, 26.0, 0);
    keyLight.shadow.camera.lookAt(0, 0, 0);

    const shadowSize = isIOS ? 1024 : 2048;
    keyLight.shadow.mapSize.width = shadowSize;
    keyLight.shadow.mapSize.height = shadowSize;
    keyLight.shadow.bias = -0.00015;
    keyLight.shadow.radius = 3.0; // Sharp, clear cinematic shadow penumbra
    keyLight.shadow.normalBias = 0.025;
    scene.add(keyLight);
    
    // 3. Fill Light: Soft cool blue sky fill (+4.0, 30.0, -32.0)
    // Targets Side 3 (-Z) for balanced illumination
    const fillIntensity = isMobileLike ? 0.36 : 0.30;
    const fillLight = new THREE.DirectionalLight(0xc4dcff, fillIntensity);
    fillLight.position.set(4.0, 30.0, -32.0);
    scene.add(fillLight);

    // 4. Rim / Accent Light: Gentle shade accent (-28.0, 24.0, 2.0)
    // Targets Side 4 (-X) - soft accent so dark side remains legible
    const rimIntensity = isMobileLike ? 0.28 : 0.22;
    const rimLight = new THREE.DirectionalLight(0xd0e0ff, rimIntensity);
    rimLight.position.set(-28.0, 24.0, 2.0);
    scene.add(rimLight);
    
    return { 
        ambientLight, 
        keyLight,
        fillLight,
        rimLight
    };
}

/**
 * Enable or disable real-time dynamic directional shadows (Option 3)
 * @param {THREE.Scene} scene 
 * @param {object} lights 
 * @param {THREE.WebGLRenderer} renderer 
 * @param {boolean} enabled 
 */
export function setShadowsEnabled(scene, lights, renderer, enabled = true) {
    if (!lights || !renderer) return;
    if (lights.keyLight) {
        lights.keyLight.castShadow = !!enabled;
    }
    renderer.shadowMap.enabled = !!enabled;
    if (renderer.shadowMap.enabled) {
        renderer.shadowMap.needsUpdate = true;
    }
}

/**
 * Professional Lighting Presets - Optimized for depth and subtle, dramatic shadows
 * These presets DO NOT modify background or fog, only lights.
 */
export const LIGHT_PRESETS = {
    'default': {
        name: 'Default Cinematic Studio',
        ambient: { color: 0xdce8ff, intensity: 0.56 },
        key: { color: 0xfffcf2, intensity: 1.15, pos: [32.0, 38.0, 20.0] },
        fill: { color: 0xc4dcff, intensity: 0.55, pos: [4.0, 30.0, -32.0] },
        rim: { color: 0xd0e0ff, intensity: 0.40, pos: [-28.0, 24.0, 2.0] },
        shadowRadius: 3.0
    },
    'desert-dawn': {
        name: 'Desert Dawn',
        variant: 'warm',
        ambient: { color: 0xfff4e0, intensity: 0.35 },
        key: { color: 0xffd1a4, intensity: 1.4, pos: [30, 20, 10] }, 
        fill: { color: 0xffe0b2, intensity: 0.5, pos: [-15, 10, -15] }
    },
    'golden-hour': {
        name: 'Golden Hour',
        variant: 'warm',
        ambient: { color: 0xffefcc, intensity: 0.38 },
        key: { color: 0xffcc33, intensity: 1.6, pos: [25, 25, 25] },
        fill: { color: 0xffd966, intensity: 0.55, pos: [-20, 15, -10] }
    },
    'misty-morning': {
        name: 'Misty Morning',
        variant: 'cool',
        ambient: { color: 0xf0f7ff, intensity: 0.42 },
        key: { color: 0xd9eaff, intensity: 1.1, pos: [15, 35, 15] },
        fill: { color: 0xc4daff, intensity: 0.65, pos: [-15, 20, -15] }
    },
    'moonlight-glow': {
        name: 'Moonlight',
        variant: 'cool',
        ambient: { color: 0xe8f1ff, intensity: 0.32 },
        key: { color: 0xaec6ff, intensity: 1.3, pos: [-25, 40, 10] },
        fill: { color: 0x7c9eff, intensity: 0.45, pos: [20, 15, -20] }
    },
    'arctic-cool': {
        name: 'Arctic Cool',
        variant: 'cool',
        ambient: { color: 0xffffff, intensity: 0.45 },
        key: { color: 0xe3f2fd, intensity: 0.9, pos: [10, 45, 10] },
        fill: { color: 0xbbdefb, intensity: 0.7, pos: [-20, 20, -20] }
    },
    'soft-studio': {
        name: 'Soft Studio',
        variant: 'neutral',
        ambient: { color: 0xffffff, intensity: 0.4 },
        key: { color: 0xffffff, intensity: 1.25, pos: [20, 30, 20] },
        fill: { color: 0xeeeeee, intensity: 0.8, pos: [-20, 15, -20] }
    },
    'warm-indoor': {
        name: 'Warm Indoor',
        variant: 'warm',
        ambient: { color: 0xfff8e1, intensity: 0.48 },
        key: { color: 0xffecb3, intensity: 1.1, pos: [15, 35, -5] },
        fill: { color: 0xffcc80, intensity: 0.65, pos: [-10, 10, 20] }
    },
    'cool-quartz': {
        name: 'Cool Quartz',
        variant: 'cool',
        ambient: { color: 0xf3e5f5, intensity: 0.4 },
        key: { color: 0xe1bee7, intensity: 1.3, pos: [25, 25, 0] },
        fill: { color: 0xce93d8, intensity: 0.5, pos: [-15, 15, 15] }
    },
    'eventide': {
        name: 'Eventide',
        variant: 'neutral',
        ambient: { color: 0xf5f5f5, intensity: 0.35 },
        key: { color: 0xe0e0e0, intensity: 1.2, pos: [35, 15, 35] },
        fill: { color: 0xbdbdbd, intensity: 0.4, pos: [-25, 5, -25] }
    }
};

/**
 * Apply a specific lighting preset to the scene with optional smooth transition
 * Note: Only affects lights, preserves background/fog
 */
export function applyLightPreset(scene, lights, presetId, instant = false) {
    const preset = LIGHT_PRESETS[presetId] || LIGHT_PRESETS['default'];
    
    // 1. Update Lights
    if (lights.ambientLight && preset.ambient) {
        lights.ambientLight.color.setHex(preset.ambient.color);
        lights.ambientLight.intensity = preset.ambient.intensity;
    }
    
    if (lights.keyLight && preset.key) {
        lights.keyLight.color.setHex(preset.key.color);
        lights.keyLight.intensity = preset.key.intensity;
        lights.keyLight.position.set(...preset.key.pos);
    }
    
    if (lights.fillLight && preset.fill) {
        lights.fillLight.color.setHex(preset.fill.color);
        lights.fillLight.intensity = preset.fill.intensity;
        lights.fillLight.position.set(...preset.fill.pos);
    }

    if (lights.lateralLight && preset.lateral) {
        lights.lateralLight.color.setHex(preset.lateral.color);
        lights.lateralLight.intensity = preset.lateral.intensity;
        lights.lateralLight.position.set(...preset.lateral.pos);
    }

    if (lights.rimLight && preset.rim) {
        lights.rimLight.color.setHex(preset.rim.color);
        lights.rimLight.intensity = preset.rim.intensity;
        lights.rimLight.position.set(...preset.rim.pos);
    }
    
    return preset.name;
}

export function createGrid(scene) {
    const gridSize = 7;
    const cubeSize = 1;
    
    // Base plate - single 21x21 plate (simple extension from original 7x7)
    const visualBaseSize = 21;
    const baseGeometry = new THREE.BoxGeometry(visualBaseSize * cubeSize, 0.2, visualBaseSize * cubeSize);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.8, // Higher roughness for matte/non-reflective surface
        metalness: 0.0 // No metalness for non-metallic appearance
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    // Position centered at the 7x7 grid center (will be reset to 0,0,0 when added to towerGroup)
    base.position.set(gridSize * cubeSize / 2, -0.1, gridSize * cubeSize / 2);
    base.receiveShadow = true;
    base.castShadow = true;
    scene.add(base);
    
    // Single grid helper for the entire 21x21 base plate with 1x1 unit spacing
    // GridHelper(size, divisions) creates a grid centered at the helper's position
    // With size=21 and divisions=21, it creates lines at: -10.5, -9.5, ..., -0.5, 0.5, ..., 9.5, 10.5 (relative to grid center)
    // Blocks are positioned at: (gridX * cubeSize + cubeSize/2) - (gridSize * cubeSize / 2)
    // For gridX=0: block center at 0.5 - 3.5 = -3.0 (relative to towerGroup)
    // For gridX=1: block center at 1.5 - 3.5 = -2.0 (relative to towerGroup)
    // Cell boundaries should be at: -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5 (relative to towerGroup)
    // GridHelper lines are already at half-integers, which match cell boundaries!
    // Position grid at (3.5, 0.01, 3.5) initially (will be reset to (0, 0.01, 0) when added to towerGroup)
    const gridHelper = new THREE.GridHelper(visualBaseSize * cubeSize, visualBaseSize, 0x888888, 0x666666);
    // Position at grid center - will be reset to (0, 0.01, 0) when added to towerGroup
    gridHelper.position.set(gridSize * cubeSize / 2, 0.01, gridSize * cubeSize / 2);
    // Improve grid line rendering
    if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.8;
    }
    scene.add(gridHelper);
    
    return { base, gridHelper, gridSize, cubeSize };
}

/**
 * Create visual helpers for camera pivot point
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} pivotX - X coordinate of pivot point
 * @param {number} pivotY - Y coordinate of pivot point
 * @param {number} pivotZ - Z coordinate of pivot point
 * @param {number} gridSize - Size of the grid (for scaling helpers)
 * @returns {Object} Object containing helper elements for toggling visibility
 */
export function createCameraPivotHelpers(scene, pivotX, pivotY, pivotZ, gridSize = 7) {
    const helpersGroup = new THREE.Group();
    helpersGroup.name = 'CameraPivotHelpers';
    
    // 1. Pivot point marker - small sphere at the center
    const pivotMarkerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const pivotMarkerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.8 
    });
    const pivotMarker = new THREE.Mesh(pivotMarkerGeometry, pivotMarkerMaterial);
    pivotMarker.position.set(pivotX, pivotY, pivotZ);
    helpersGroup.add(pivotMarker);
    
    // 2. Vertical line showing pivot axis (extends upward)
    const lineHeight = gridSize * 2; // Extend well above the grid
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX, pivotY, pivotZ),
        new THREE.Vector3(pivotX, pivotY + lineHeight, pivotZ)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.5,
        linewidth: 2
    });
    const pivotLine = new THREE.Line(lineGeometry, lineMaterial);
    helpersGroup.add(pivotLine);
    
    // 3. Axes helper at pivot point (shows X, Y, Z axes)
    const axesHelper = new THREE.AxesHelper(gridSize * 0.5);
    axesHelper.position.set(pivotX, pivotY, pivotZ);
    helpersGroup.add(axesHelper);
    
    // 4. Crosshair on the ground plane (XZ plane at pivot Y)
    const crosshairSize = gridSize * 0.3;
    const crosshairMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.4 
    });
    
    // Horizontal line (X axis)
    const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX - crosshairSize, pivotY, pivotZ),
        new THREE.Vector3(pivotX + crosshairSize, pivotY, pivotZ)
    ]);
    const xLine = new THREE.Line(xLineGeometry, crosshairMaterial);
    helpersGroup.add(xLine);
    
    // Vertical line in XZ plane (Z axis)
    const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pivotX, pivotY, pivotZ - crosshairSize),
        new THREE.Vector3(pivotX, pivotY, pivotZ + crosshairSize)
    ]);
    const zLine = new THREE.Line(zLineGeometry, crosshairMaterial);
    helpersGroup.add(zLine);
    
    scene.add(helpersGroup);
    
    // Return helpers object with toggle function
    return {
        group: helpersGroup,
        pivotMarker,
        pivotLine,
        axesHelper,
        crosshairX: xLine,
        crosshairZ: zLine,
        setVisible: (visible) => {
            helpersGroup.visible = visible;
        },
        toggle: () => {
            helpersGroup.visible = !helpersGroup.visible;
            return helpersGroup.visible;
        }
    };
}

/**
 * Global shader uniforms shared across all GPU-accelerated materials
 */
const MAX_BLASTS = 6;

export const globalUniforms = {
    uTime: { value: 0.0 },
    uThermalBlastPos: { value: Array.from({ length: MAX_BLASTS }, () => new THREE.Vector3(0, -9999, 0)) },
    uThermalBlastRadius: { value: new Float32Array(MAX_BLASTS) },
    uThermalBlastIntensity: { value: new Float32Array(MAX_BLASTS) },
    uAshRadius: { value: new Float32Array(MAX_BLASTS) },
    uAshIntensity: { value: new Float32Array(MAX_BLASTS) }
};

/**
 * Configure continuous 3D spherical thermal scorch, molten field & lingering ashy soot on GPU
 * Supports up to 6 simultaneous independent detonations.
 */
export function setupThermalMaterial(material) {
    const previousCompile = material.onBeforeCompile;
    material.onBeforeCompile = (shader) => {
        if (typeof previousCompile === 'function') {
            previousCompile(shader);
        }

        shader.uniforms.uThermalBlastPos = globalUniforms.uThermalBlastPos;
        shader.uniforms.uThermalBlastRadius = globalUniforms.uThermalBlastRadius;
        shader.uniforms.uThermalBlastIntensity = globalUniforms.uThermalBlastIntensity;
        shader.uniforms.uAshRadius = globalUniforms.uAshRadius;
        shader.uniforms.uAshIntensity = globalUniforms.uAshIntensity;

        let extraVertDeclarations = '';
        if (!shader.vertexShader.includes('vThermalWorldPos')) {
            extraVertDeclarations += 'varying vec3 vThermalWorldPos;\n';
        }
        if (!shader.vertexShader.includes('vThermalWorldNormal')) {
            extraVertDeclarations += 'varying vec3 vThermalWorldNormal;\n';
        }
        if (extraVertDeclarations.length > 0) {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\n${extraVertDeclarations}`
            );
        }

        if (!shader.vertexShader.includes('// __THERMAL_VERT_ASSIGN__')) {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `
                #include <worldpos_vertex>
                // __THERMAL_VERT_ASSIGN__
                vThermalWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                vThermalWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
                `
            );
        }

        let extraFragUniforms = '';
        if (!shader.fragmentShader.includes('uThermalBlastPos')) {
            extraFragUniforms += `
                uniform vec3 uThermalBlastPos[6];
                uniform float uThermalBlastRadius[6];
                uniform float uThermalBlastIntensity[6];
                uniform float uAshRadius[6];
                uniform float uAshIntensity[6];
            `;
        }
        if (!shader.fragmentShader.includes('vThermalWorldPos')) {
            extraFragUniforms += 'varying vec3 vThermalWorldPos;\n';
        }
        if (!shader.fragmentShader.includes('vThermalWorldNormal')) {
            extraFragUniforms += 'varying vec3 vThermalWorldNormal;\n';
        }
        if (extraFragUniforms.length > 0) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\n${extraFragUniforms}`
            );
        }

        if (!shader.fragmentShader.includes('// __THERMAL_AFTERMATH_HOOK__')) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                #include <dithering_fragment>
                // __THERMAL_AFTERMATH_HOOK__
                {
                    float maxAshFactor = 0.0;
                    float maxHeat = 0.0;
                    vec3 totalThermalGlow = vec3(0.0);

                    for (int bi = 0; bi < 6; bi++) {
                        if (uThermalBlastRadius[bi] > 0.01 || uAshRadius[bi] > 0.01) {
                            vec3 toFrag = vThermalWorldPos - uThermalBlastPos[bi];
                            vec3 dAbs = abs(toFrag);
                            float dEuc = length(toFrag);
                            float dBox = max(dAbs.x, max(dAbs.y, dAbs.z));

                            // 1. Grid-aware metric blending (channels along rectangular block gaps & faces)
                            float dMetric = mix(dEuc, dBox, 0.38);

                            // 2. Soft organic 3D billows (eliminates circular disc while keeping boundary smooth & feathered)
                            float n1 = sin(vThermalWorldPos.x * 2.2 + vThermalWorldPos.y * 1.8) * cos(vThermalWorldPos.z * 2.2 + vThermalWorldPos.y * 1.4);
                            float n2 = sin(vThermalWorldPos.x * 4.2 - vThermalWorldPos.z * 3.8 + vThermalWorldPos.y * 2.5) * 0.35;
                            float turbulence = (n1 + n2) * 0.26;

                            float effectiveDist = dMetric - turbulence;

                            vec3 blastDir = dEuc > 1e-4 ? toFrag / dEuc : vec3(0.0, 1.0, 0.0);
                            vec3 norm = length(vThermalWorldNormal) > 1e-4 ? normalize(vThermalWorldNormal) : vec3(0.0, 1.0, 0.0);
                            float directFacing = max(0.0, dot(-blastDir, norm));

                            // 3. Dark Ashy Soot Field (Wide, silky smooth feathered falloff into clean block surfaces)
                            if (effectiveDist <= uAshRadius[bi] + 1.25 && uAshIntensity[bi] > 0.001) {
                                float ashInner = uAshRadius[bi] - effectiveDist;
                                float ashFacing = 0.58 + 0.42 * pow(max(1e-4, directFacing), 0.5);
                                float af = smoothstep(-1.25, 0.85, ashInner) * uAshIntensity[bi] * ashFacing;
                                maxAshFactor = max(maxAshFactor, af);
                            }

                            // 4. Molten Glowing Core (Smooth feathered heat transition)
                            if (effectiveDist <= uThermalBlastRadius[bi] + 0.85 && uThermalBlastIntensity[bi] > 0.001) {
                                float heatInner = uThermalBlastRadius[bi] - effectiveDist;
                                float heatFacing = max(directFacing, 0.22 * max(0.0, dot(vec3(0.0, 1.0, 0.0), norm)));
                                if (heatFacing > 0.03) {
                                    float heat = smoothstep(-0.85, 0.95, heatInner) * uThermalBlastIntensity[bi] * pow(max(1e-4, heatFacing), 0.65);
                                    maxHeat = max(maxHeat, heat);

                                    vec3 colEmber = vec3(0.80, 0.10, 0.02);
                                    vec3 colOrange = vec3(1.0, 0.40, 0.0);
                                    vec3 colWhiteHot = vec3(1.0, 0.92, 0.65);

                                    vec3 thermalGlow = mix(colEmber, mix(colOrange, colWhiteHot, clamp((heat - 0.42) * 2.0, 0.0, 1.0)), clamp(heat * 1.5, 0.0, 1.0));
                                    totalThermalGlow += thermalGlow * (heat * 1.7);
                                }
                            }
                        }
                    }

                    if (maxAshFactor > 0.001) {
                        vec3 darkAshColor = vec3(0.032, 0.035, 0.040); // Deep matte burnt charcoal soot
                        gl_FragColor.rgb = mix(gl_FragColor.rgb, darkAshColor, maxAshFactor * 0.96);
                    }

                    if (maxHeat > 0.001) {
                        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.06, 0.07, 0.09), maxHeat * 0.90);
                        gl_FragColor.rgb += totalThermalGlow;
                    }
                }
                `
            );
        }
    };

    material.customProgramCacheKey = () => 'thermal_mat';
}

/**
 * Configure shader hook for materials that pulse on the GPU (bombs, highlights)
 */
export function setupPulsingMaterial(material, options = {}) {
    const pulseOffset = options.pulseOffset || 0.0;
    const isBomb = options.isBomb || false;
    const isHighlight = options.isHighlight || false;

    const previousCompile = material.onBeforeCompile;
    material.onBeforeCompile = (shader) => {
        if (typeof previousCompile === 'function') {
            previousCompile(shader);
        }

        shader.uniforms.uTime = globalUniforms.uTime;
        shader.uniforms.uPulseOffset = { value: pulseOffset };
        shader.uniforms.uThermalBlastPos = globalUniforms.uThermalBlastPos;
        shader.uniforms.uAshRadius = globalUniforms.uAshRadius;
        shader.uniforms.uAshIntensity = globalUniforms.uAshIntensity;

        let extraVertDeclarations = '';
        if (!shader.vertexShader.includes('vThermalWorldPos')) {
            extraVertDeclarations += 'varying vec3 vThermalWorldPos;\n';
        }
        if (!shader.vertexShader.includes('vThermalWorldNormal')) {
            extraVertDeclarations += 'varying vec3 vThermalWorldNormal;\n';
        }
        if (extraVertDeclarations.length > 0) {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `#include <common>\n${extraVertDeclarations}`
            );
        }

        if (!shader.vertexShader.includes('// __THERMAL_VERT_ASSIGN__')) {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <worldpos_vertex>',
                `
                #include <worldpos_vertex>
                // __THERMAL_VERT_ASSIGN__
                vThermalWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
                vThermalWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
                `
            );
        }

        // Declare uniforms only if not already declared by setupThermalMaterial
        let extraFragmentUniforms = '';
        if (!shader.fragmentShader.includes('uPulseOffset')) {
            extraFragmentUniforms += `
                uniform float uTime;
                uniform float uPulseOffset;
            `;
        }
        if (!shader.fragmentShader.includes('uThermalBlastPos')) {
            extraFragmentUniforms += `
                uniform vec3 uThermalBlastPos[6];
                uniform float uAshRadius[6];
                uniform float uAshIntensity[6];
            `;
        }
        if (!shader.fragmentShader.includes('vThermalWorldPos')) {
            extraFragmentUniforms += `
                varying vec3 vThermalWorldPos;
            `;
        }
        if (!shader.fragmentShader.includes('vThermalWorldNormal')) {
            extraFragmentUniforms += `
                varying vec3 vThermalWorldNormal;
            `;
        }

        if (extraFragmentUniforms.length > 0) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `#include <common>\n${extraFragmentUniforms}`
            );
        }

        if (isBomb && !shader.fragmentShader.includes('// __PULSE_BOMB_HOOK__')) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `
                #include <emissivemap_fragment>
                // __PULSE_BOMB_HOOK__
                {
                    // High-visibility hazard strobe flash cadence
                    float t = uTime * 2.8 + uPulseOffset * 2.0;
                    float cycle = fract(t * 0.45); // cycle repeats every ~0.8s
                    
                    // Double-burst strobe flash
                    float flash1 = smoothstep(0.0, 0.03, cycle) * (1.0 - smoothstep(0.06, 0.12, cycle));
                    float flash2 = smoothstep(0.15, 0.18, cycle) * (1.0 - smoothstep(0.21, 0.28, cycle));
                    float strobe = max(flash1, flash2);
                    
                    // Resting baseline glow + strobe flash - preserves rich indicator color without washing out to white
                    float pulseFactor = 0.35 + strobe * 0.65;
                    totalEmissiveRadiance *= pulseFactor;

                    // Extinguish emissive glow when ashed/locked by ANY active blast
                    float pulseAsh = 0.0;
                    for (int bi = 0; bi < 6; bi++) {
                        if (uAshIntensity[bi] > 0.001 && uAshRadius[bi] > 0.01) {
                            vec3 toFrag = vThermalWorldPos - uThermalBlastPos[bi];
                            vec3 dAbs = abs(toFrag);
                            float dMetric = mix(length(toFrag), max(dAbs.x, max(dAbs.y, dAbs.z)), 0.38);
                            float n1 = sin(vThermalWorldPos.x * 2.2 + vThermalWorldPos.y * 1.8) * cos(vThermalWorldPos.z * 2.2 + vThermalWorldPos.y * 1.4);
                            float n2 = sin(vThermalWorldPos.x * 4.2 - vThermalWorldPos.z * 3.8 + vThermalWorldPos.y * 2.5) * 0.35;
                            float effectiveDist = dMetric - (n1 + n2) * 0.26;

                            if (effectiveDist <= uAshRadius[bi] + 1.25) {
                                float af = smoothstep(-1.25, 0.85, uAshRadius[bi] - effectiveDist) * uAshIntensity[bi];
                                pulseAsh = max(pulseAsh, af);
                            }
                        }
                    }
                    if (pulseAsh > 0.001) {
                        totalEmissiveRadiance *= max(0.0, 1.0 - pulseAsh * 2.0);
                    }
                }
                `
            );
        } else if (isHighlight && !shader.fragmentShader.includes('// __PULSE_HIGHLIGHT_HOOK__')) {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <emissivemap_fragment>',
                `
                #include <emissivemap_fragment>
                // __PULSE_HIGHLIGHT_HOOK__
                {
                    float pulseFactor = sin(uTime * 3.0) * 0.3 + 0.7;
                    totalEmissiveRadiance *= pulseFactor;
                }
                `
            );
        }
    };

    const prevCacheKey = material.customProgramCacheKey;
    material.customProgramCacheKey = () => {
        const base = typeof prevCacheKey === 'function' ? prevCacheKey.call(material) : 'mat';
        return base + '_pulse_' + (isBomb ? 'bomb' : (isHighlight ? 'high' : 'norm'));
    };
}

/**
 * Configure GPU vertex oscillation and opacity breathing for glow quad meshes
 */
export function setupGlowQuadMaterial(material, options = {}) {
    const pulseOffset = options.pulseOffset || 0.0;
    material.customProgramCacheKey = () => 'glowquad_' + (pulseOffset > 0 ? pulseOffset.toFixed(1) : '0');
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = globalUniforms.uTime;
        shader.uniforms.uPulseOffset = { value: pulseOffset };
        shader.uniforms.uThermalBlastPos = globalUniforms.uThermalBlastPos;
        shader.uniforms.uAshRadius = globalUniforms.uAshRadius;
        shader.uniforms.uAshIntensity = globalUniforms.uAshIntensity;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
            #include <common>
            uniform float uTime;
            uniform float uPulseOffset;
            varying vec3 vGlowWorldPos;
            `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <worldpos_vertex>',
            `
            #include <worldpos_vertex>
            vGlowWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
            `
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            float t = uTime * 2.8 + uPulseOffset * 2.0;
            float cycle = fract(t * 0.45);
            float flash1 = smoothstep(0.0, 0.03, cycle) * (1.0 - smoothstep(0.06, 0.12, cycle));
            float flash2 = smoothstep(0.15, 0.18, cycle) * (1.0 - smoothstep(0.21, 0.28, cycle));
            float strobe = max(flash1, flash2);
            float scaleFactor = 1.0 + strobe * 0.55;
            vec3 transformed = vec3( position.xy * scaleFactor, position.z );
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
            #include <common>
            uniform float uTime;
            uniform float uPulseOffset;
            uniform vec3 uThermalBlastPos[6];
            uniform float uAshRadius[6];
            uniform float uAshIntensity[6];
            varying vec3 vGlowWorldPos;
            `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            `
            #include <color_fragment>
            float t = uTime * 2.8 + uPulseOffset * 2.0;
            float cycle = fract(t * 0.45);
            float flash1 = smoothstep(0.0, 0.03, cycle) * (1.0 - smoothstep(0.06, 0.12, cycle));
            float flash2 = smoothstep(0.15, 0.18, cycle) * (1.0 - smoothstep(0.21, 0.28, cycle));
            float strobe = max(flash1, flash2);
            // Modulate alpha only so the glow pulses without washing out or turning white
            diffuseColor.a *= (0.30 + strobe * 0.70);

            // Extinguish halo aura completely when covered in ash by ANY active blast
            float maxAshFactor = 0.0;
            for (int bi = 0; bi < 6; bi++) {
                if (uAshIntensity[bi] > 0.001 && uAshRadius[bi] > 0.01) {
                    vec3 toGlow = vGlowWorldPos - uThermalBlastPos[bi];
                    vec3 dGlowAbs = abs(toGlow);
                    float dGlowMetric = mix(length(toGlow), max(dGlowAbs.x, max(dGlowAbs.y, dGlowAbs.z)), 0.38);
                    if (dGlowMetric <= uAshRadius[bi] + 1.25) {
                        float af = smoothstep(-1.25, 0.85, uAshRadius[bi] - dGlowMetric) * uAshIntensity[bi];
                        maxAshFactor = max(maxAshFactor, af);
                    }
                }
            }
            if (maxAshFactor > 0.001) {
                diffuseColor.a *= max(0.0, 1.0 - maxAshFactor * 1.8);
                diffuseColor.rgb *= max(0.0, 1.0 - maxAshFactor * 1.8);
            }
            `
        );
    };
}

/**
 * Procedural Soft-Box Studio Reflection Environment Map
 * Creates an image-based lighting (IBL) environment map with overhead soft-box panels
 * and gentle lateral fill panels. Applies dynamic specular reflections to all blocks and arrows.
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 */
// Cache for pre-filtered artistic environment maps
const reflectionEnvMapCache = new Map();
let currentReflectionPreset = 'gallery';
let isCameraRelative = false;

/**
 * Direction 1: Hero Studio (Camera-Relative)
 * Dual-flank key + rim glints positioned at grazing angles (+75° and -75°).
 * Leaves front faces pure and saturated while defining contours with gold & cyan.
 */
function renderHeroStudioCanvas(ctx, width, height) {
    // 1. Pitch black void (zero diffuse wash on tower faces)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Overhead Zenith Rim Arc (grazing top bevels)
    const haloGrad = ctx.createLinearGradient(0, height * 0.04, 0, height * 0.16);
    haloGrad.addColorStop(0.0, 'rgba(255, 235, 200, 0.0)');
    haloGrad.addColorStop(0.5, 'rgba(255, 235, 200, 0.70)');
    haloGrad.addColorStop(1.0, 'rgba(255, 200, 140, 0.0)');
    ctx.fillStyle = haloGrad;
    ctx.fillRect(0, height * 0.04, width, height * 0.12);

    // 3. Flank Golden Key Soft-Box (+72° azimuth grazing)
    const keyX = width * 0.70;
    const keyY = height * 0.30;
    const keyGrad = ctx.createRadialGradient(keyX, keyY, 8, keyX, keyY, 90);
    keyGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    keyGrad.addColorStop(0.35, 'rgba(255, 230, 160, 0.90)');
    keyGrad.addColorStop(0.70, 'rgba(255, 180, 70, 0.30)');
    keyGrad.addColorStop(1.0, 'rgba(255, 140, 20, 0.0)');
    ctx.fillStyle = keyGrad;
    ctx.beginPath();
    ctx.ellipse(keyX, keyY, 55, 110, -0.10, 0, Math.PI * 2);
    ctx.fill();

    // 4. Opposite Electric Cyan Rim Blade (-72° azimuth grazing)
    const rimX = width * 0.30;
    const rimY = height * 0.30;
    const rimGrad = ctx.createRadialGradient(rimX, rimY, 6, rimX, rimY, 60);
    rimGrad.addColorStop(0.0, 'rgba(0, 240, 255, 0.90)');
    rimGrad.addColorStop(0.5, 'rgba(0, 160, 255, 0.35)');
    rimGrad.addColorStop(1.0, 'rgba(0, 100, 255, 0.0)');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.ellipse(rimX, rimY, 35, 100, 0.10, 0, Math.PI * 2);
    ctx.fill();
    // Slender bright cyan core
    ctx.fillStyle = 'rgba(200, 255, 255, 0.95)';
    ctx.fillRect(rimX - 6, rimY - 80, 12, 160);
}

/**
 * Direction 2: Modern Art Gallery (Architectural Fixed)
 * Architectural loft window on side wall + triple ceiling skylight slits.
 */
function renderGalleryCanvas(ctx, width, height) {
    // 1. Pitch black gallery void
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Triple Cathedral Ceiling Skylights (grazing overhead top bevels)
    ctx.save();
    ctx.translate(width * 0.50, height * 0.12);
    ctx.rotate(-0.12);
    const beamW = 380;
    const beamH = 14;
    const spacing = 22;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
    ctx.fillRect(-beamW / 2, -spacing - beamH, beamW, beamH);
    ctx.fillRect(-beamW / 2, -beamH / 2, beamW, beamH);
    ctx.fillRect(-beamW / 2, spacing, beamW, beamH);
    ctx.restore();

    // 3. Flank Loft Window (+80° side wall azimuth: width * 0.72)
    const winX = width * 0.72;
    const winY = height * 0.34;
    const totalW = 110;
    const totalH = 150;
    const cols = 2;
    const rows = 4;
    const mullion = 10;
    const paneW = (totalW - (cols + 1) * mullion) / cols;
    const paneH = (totalH - (rows + 1) * mullion) / rows;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    const startX = winX - totalW / 2 + mullion;
    const startY = winY - totalH / 2 + mullion;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.fillRect(
                startX + c * (paneW + mullion),
                startY + r * (paneH + mullion),
                paneW,
                paneH
            );
        }
    }

    // 4. Opposite Flank Rim Scribe (width * 0.28)
    ctx.fillStyle = 'rgba(215, 235, 255, 0.75)';
    ctx.fillRect(width * 0.28 - 5, height * 0.26, 10, 110);

    // 5. Floor horizon line
    ctx.fillStyle = 'rgba(200, 225, 255, 0.40)';
    ctx.fillRect(0, height * 0.50, width, 4);
}

/**
 * Direction 3: Twin Light-Blade (Automotive Studio)
 * Slender, razor-sharp dual vertical blades positioned on the flanks.
 * Creates clean metallic pin-stripes along bevels with zero face flooding.
 */
function renderTwinBladesCanvas(ctx, width, height) {
    // 1. Pure obsidian black void
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. Primary Twin Neon Laser Blades on Right Flank (+65° azimuth: width * 0.68)
    const b1X = width * 0.67;
    const b2X = width * 0.71;
    const bY = height * 0.32;
    const bW = 16;
    const bH = 220;

    // Twin crisp white laser ribbons
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b1X - bW / 2, bY - bH / 2, bW, bH);
    ctx.fillRect(b2X - bW / 2, bY - bH / 2, bW, bH);

    // 3. Secondary Twin Laser Blades on Left Flank (-65° azimuth: width * 0.29)
    const s1X = width * 0.29;
    const s2X = width * 0.33;
    ctx.fillStyle = 'rgba(225, 240, 255, 0.85)';
    ctx.fillRect(s1X - bW / 2, bY - bH * 0.40, 14, bH * 0.80);
    ctx.fillRect(s2X - bW / 2, bY - bH * 0.40, 14, bH * 0.80);

    // 4. Overhead Sleek Zenith Line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.70)';
    ctx.fillRect(0, height * 0.08, width, 6);
}

/**
 * Generate a compiled PMREM environment map for a given artistic preset
 */
function createArtisticEnvMap(renderer, presetName) {
    const width = 1024;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (presetName === 'gallery') {
        renderGalleryCanvas(ctx, width, height);
    } else if (presetName === 'blades') {
        renderTwinBladesCanvas(ctx, width, height);
    } else {
        renderHeroStudioCanvas(ctx, width, height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    texture.dispose();
    pmremGenerator.dispose();
    return envMap;
}

/**
 * Switch artistic reflection preset dynamically
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {'hero' | 'gallery' | 'blades'} presetName
 */
export function setReflectionPreset(scene, renderer, presetName) {
    if (!scene || !renderer) return;
    const validPresets = ['hero', 'gallery', 'blades'];
    const selected = validPresets.includes(presetName) ? presetName : 'hero';
    currentReflectionPreset = selected;
    isCameraRelative = (selected === 'hero');

    if (!reflectionEnvMapCache.has(selected)) {
        const envMap = createArtisticEnvMap(renderer, selected);
        if (envMap) reflectionEnvMapCache.set(selected, envMap);
    }

    const activeMap = reflectionEnvMapCache.get(selected);
    if (activeMap) {
        scene.environment = activeMap;
        if (typeof scene.environmentIntensity !== 'undefined') {
            scene.environmentIntensity = 1.0;
        }
    }

    if (!isCameraRelative && scene.environmentRotation) {
        scene.environmentRotation.y = 0;
    }
}

/**
 * Update dynamic reflection tracking in the render loop
 * @param {THREE.Camera} camera
 * @param {THREE.Scene} scene
 */
export function updateReflectionEnvironment(camera, scene) {
    if (!scene || !camera) return;
    if (isCameraRelative && scene.environmentRotation) {
        const azimuth = Math.atan2(camera.position.x, camera.position.z);
        scene.environmentRotation.y = azimuth;
    }
}

/**
 * Procedural Soft-Box Studio Reflection Environment Map
 * Initializes default artistic environment
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 */
export function setupStudioEnvironment(scene, renderer, initialPreset = 'gallery') {
    if (!scene || !renderer) return;
    try {
        setReflectionPreset(scene, renderer, initialPreset);
        if (typeof window !== 'undefined') {
            window.setReflectionPreset = (preset) => setReflectionPreset(scene, renderer, preset);
            window.getReflectionPreset = () => currentReflectionPreset;
        }
    } catch (err) {
        console.warn('Failed to generate procedural studio environment:', err);
    }
}


