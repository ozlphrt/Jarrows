import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// Global geometry pool to reuse RoundedBoxGeometry instances
export const GeometryPool = new Map();
export const TextureCache = new Map();
export const ArrowGeometryPool = new Map();
export const ArrowRawGeometryPool = new Map();
export const DotGeometryPool = new Map();
export const CircleGeometryPool = new Map();
export const MergedIndicatorGeometryPool = new Map();
export const IndicatorMaterialPool = new Map();
export const BasePorcelainMaterialPool = new Map();

/**
 * Authoritative length-based indicator palette:
 * - Length 1: Deep Regal Crimson (#a8111a) - rich, dark, velvety blood-crimson with maximum contrast
 * - Length 2: Deep Electric Cyan / Azure (#0096c7) - rich, vivid chroma, zero pale mint washout
 * - Length 3: Warm Golden Amber / Marigold (#ea8c00) - deep contrast against white, never pale
 */
export const INDICATOR_LENGTH_COLORS = [
    0xa8111a, // Length 1: Dark Crimson Red
    0x0096c7, // Length 2: Cyan
    0xea8c00  // Length 3: Yellow / Golden Amber
];

if (typeof window !== 'undefined') {
    window.INDICATOR_LENGTH_COLORS = INDICATOR_LENGTH_COLORS;
}

/**
 * Creates a diagonal yellow/black stripe texture for bomb blocks.
 */
export function createBombStripeTexture() {
    if (typeof document === 'undefined') return null;
    if (TextureCache.has('bombStripes')) return TextureCache.get('bombStripes');

    const canvas = document.createElement('canvas');
    canvas.width = 128; // Increased resolution
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Yellow background
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(0, 0, 128, 128);

    // Much larger black diagonal stripes (Task 2.4/3.3)
    ctx.fillStyle = '#000000';
    const stripeWidth = 64; // Significant increase
    for (let i = -128; i < 256; i += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 128, 128);
        ctx.lineTo(i + 128 + stripeWidth, 128);
        ctx.lineTo(i + stripeWidth, 0);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // Large scale mapping
    TextureCache.set('bombStripes', texture);
    return texture;
}

/**
 * Generate procedural organic scorch texture with white-hot molten core and dark charred edges
 */
export function getOrCreateScorchTexture() {
    if (typeof document === 'undefined') return null;
    if (TextureCache.has('organicScorchTexture')) return TextureCache.get('organicScorchTexture');

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Organic radial molten core
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 122);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)'); // White-hot thermal core
    grad.addColorStop(0.15, 'rgba(255, 215, 60, 0.98)'); // Radiant molten gold
    grad.addColorStop(0.38, 'rgba(255, 70, 0, 0.92)');  // Fiery crimson orange
    grad.addColorStop(0.65, 'rgba(140, 20, 10, 0.85)'); // Smoldering ember
    grad.addColorStop(0.85, 'rgba(18, 20, 24, 0.94)');   // Deep charcoal ash soot
    grad.addColorStop(1.0, 'rgba(18, 20, 24, 0.0)');     // Soft feathered border

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 122, 0, Math.PI * 2);
    ctx.fill();

    // Add organic singed flecks and fissures
    ctx.fillStyle = 'rgba(14, 16, 20, 0.82)';
    for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = 40 + Math.random() * 75;
        const rSize = 2 + Math.random() * 7;
        ctx.beginPath();
        ctx.arc(128 + Math.cos(ang) * rad, 128 + Math.sin(ang) * rad, rSize, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    TextureCache.set('organicScorchTexture', texture);
    return texture;
}

export function asThreeColor(val, fallbackHex = 0xffffff) {
    if (val instanceof THREE.Color) return val.clone();
    if (val && typeof val === 'object') {
        if (typeof val.r === 'number' && typeof val.g === 'number' && typeof val.b === 'number') {
            return new THREE.Color(val.r, val.g, val.b);
        }
        if (typeof val.clone === 'function') {
            try {
                const res = val.clone();
                if (res instanceof THREE.Color) return res;
            } catch (_) {}
        }
    }
    if (typeof val === 'number' || typeof val === 'string') {
        try {
            return new THREE.Color(val);
        } catch (_) {}
    }
    return new THREE.Color(fallbackHex);
}

export const DEFAULT_FROSTY_CONFIG = {
    blockColor: '#cbd4d8',
    blockEmissive: '#309ccf',
    blockEmissiveIntensity: 0.38,
    blockOpacity: 1.0,
    blockRoughness: 1.0,
    blockMetalness: 0.62,
    indicatorColor: '#d9f0fc',
    indicatorEmissive: '#38bdf8',
    indicatorEmissiveIntensity: 0.00,
    indicatorOpacity: 0.18,
    indicatorRoughness: 0.59,
    indicatorMetalness: 0.02,
    minClusterSize: 3,
    alphaMapEnabled: true,
    alphaMapContrast: 0.0
};

export const FROSTY_CONFIG = { ...DEFAULT_FROSTY_CONFIG };

export function getFrostyConfig() {
    return { ...FROSTY_CONFIG };
}

export function setFrostyConfig(newConfig, allBlocks = null) {
    if (!newConfig || typeof newConfig !== 'object') return;
    Object.assign(FROSTY_CONFIG, newConfig);

    if (newConfig.alphaMapContrast !== undefined || newConfig.alphaMapEnabled !== undefined) {
        regenerateIceAlphaMap();
    }

    const targetBlocks = allBlocks || (typeof window !== 'undefined' && window.blocks) || [];
    if (Array.isArray(targetBlocks)) {
        for (const block of targetBlocks) {
            if (block && !block.isRemoved && !block.isFalling && !block.isExploding) {
                if (block._isFrostedClusterState || block.isTranslucent) {
                    block.setTranslucent(true);
                }
            }
        }
    }

    if (typeof window !== 'undefined' && typeof window.markNeedsRender === 'function') {
        window.markNeedsRender(400);
    }
}

export function regenerateIceAlphaMap() {
    if (TextureCache.has('iceAlphaMap')) {
        const oldTex = TextureCache.get('iceAlphaMap');
        if (oldTex) oldTex.dispose();
        TextureCache.delete('iceAlphaMap');
    }
    return getOrCreateIceAlphaMap();
}

/**
 * Procedural organic ice alpha map for non-uniform natural transparency
 * (Some sections dense/frosted, other sections clearer/glassy)
 */
export function getOrCreateIceAlphaMap() {
    if (!FROSTY_CONFIG.alphaMapEnabled) return null;
    if (typeof document === 'undefined') return null;
    if (TextureCache.has('iceAlphaMap')) return TextureCache.get('iceAlphaMap');

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const contrast = typeof FROSTY_CONFIG.alphaMapContrast === 'number' ? FROSTY_CONFIG.alphaMapContrast : 0.65;
    const baseVal = Math.round(180 * (1.0 - contrast * 0.3));

    // 1. Base mid-opacity foundation (~70% white)
    ctx.fillStyle = `rgb(${baseVal},${baseVal},${baseVal})`;
    ctx.fillRect(0, 0, 512, 512);

    // 2. High-transparency clear crystalline pockets (~35-45% opacity = darker grey)
    for (let i = 0; i < 18; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 35 + Math.random() * 75;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0.0, `rgba(65, 65, 65, ${0.75 * contrast + 0.25})`);
        grad.addColorStop(0.6, `rgba(110, 110, 110, ${0.35 * contrast + 0.15})`);
        grad.addColorStop(1.0, 'rgba(180, 180, 180, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Dense milky frost crystal clusters (~90-98% opacity = bright white)
    for (let i = 0; i < 22; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 25 + Math.random() * 60;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0.0, `rgba(255, 255, 255, ${0.85 * contrast + 0.15})`);
        grad.addColorStop(0.5, `rgba(235, 235, 235, ${0.45 * contrast + 0.10})`);
        grad.addColorStop(1.0, 'rgba(180, 180, 180, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // 4. Flowing diagonal ice density bands
    const bandGrad = ctx.createLinearGradient(0, 0, 512, 512);
    bandGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.15)');
    bandGrad.addColorStop(0.3, 'rgba(50, 50, 50, 0.25)');
    bandGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.20)');
    bandGrad.addColorStop(0.85, 'rgba(80, 80, 80, 0.18)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    texture.needsUpdate = true;
    TextureCache.set('iceAlphaMap', texture);
    return texture;
}

/**
 * Creates a procedural silky-smooth radial halo texture for emissive indicators.
 */
export function createIndicatorHaloTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    if (TextureCache.has('indicatorHaloTexture')) return TextureCache.get('indicatorHaloTexture');

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // High quality smooth feathered radial halo (soft ambient glow)
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.20, 'rgba(255, 255, 255, 0.90)');
    gradient.addColorStop(0.50, 'rgba(255, 255, 255, 0.45)');
    gradient.addColorStop(0.80, 'rgba(255, 255, 255, 0.12)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    TextureCache.set('indicatorHaloTexture', texture);
    return texture;
}

/**
 * Creates a procedural ring halo texture with a hollow/transparent center for circle indicators.
 */
export function createRingHaloTexture() {
    if (typeof document === 'undefined') return new THREE.Texture();
    if (TextureCache.has('ringHaloTexture')) return TextureCache.get('ringHaloTexture');

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Ring halo: completely transparent in the center hole (0 - 28px), glowing around the ring rim (28 - 48px)
    const gradient = ctx.createRadialGradient(64, 64, 20, 64, 64, 64);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');  // 100% transparent inside the circle
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.0)'); // 100% transparent inside the circle
    gradient.addColorStop(0.48, 'rgba(255, 255, 255, 0.85)'); // Glowing ring rim
    gradient.addColorStop(0.72, 'rgba(255, 255, 255, 0.28)'); // Outer aura
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    TextureCache.set('ringHaloTexture', texture);
    return texture;
}


/**
 * Get a pooled RoundedBoxGeometry or create a new one if it doesn't exist.
 * @param {number} width 
 * @param {number} height 
 * @param {number} depth 
 * @param {number} radius 
 * @param {number} segments 
 * @returns {THREE.BufferGeometry}
 */
export function getCubeGeometry(width, height, depth, radius, segments) {
    // Round values to 3 decimal places to avoid tiny precision differences causing cache misses
    const w = Math.round(width * 1000) / 1000;
    const h = Math.round(height * 1000) / 1000;
    const d = Math.round(depth * 1000) / 1000;
    const r = Math.round(radius * 1000) / 1000;
    const s = Math.round(segments);
    
    const key = `${w}_${h}_${d}_${r}_${s}`;
    if (GeometryPool.has(key)) {
        return GeometryPool.get(key);
    }
    const geometry = new RoundedBoxGeometry(w, h, d, s, r);
    GeometryPool.set(key, geometry);
    return geometry;
}

/**
 * Check if a geometry is managed by the global GeometryPool
 * @param {THREE.BufferGeometry} geometry 
 * @returns {boolean}
 */
export function isPooledGeometry(geometry) {
    if (!geometry) return false;
    for (const pooled of GeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    for (const pooled of ArrowGeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    for (const pooled of ArrowRawGeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    for (const pooled of DotGeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    for (const pooled of CircleGeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    for (const pooled of MergedIndicatorGeometryPool.values()) {
        if (pooled === geometry) return true;
    }
    return false;
}

/**
 * Check if a material is managed by global pools
 * @param {THREE.Material} material 
 * @returns {boolean}
 */
export function isPooledMaterial(material) {
    if (!material) return false;
    for (const pooled of IndicatorMaterialPool.values()) {
        if (pooled === material) return true;
    }
    for (const pooled of BasePorcelainMaterialPool.values()) {
        if (pooled === material) return true;
    }
    return false;
}

export function getArrowRawExtrudeGeometry(style = 2) {
    if (ArrowRawGeometryPool.has(style)) return ArrowRawGeometryPool.get(style);

    let arrowShape = new THREE.Shape();
    let extrudeSettings;

    if (style === 1) {
        const width = 0.25, length = 0.35, thickness = 0.06;
        arrowShape.moveTo(0, length);
        arrowShape.lineTo(width, length - width);
        arrowShape.lineTo(width - thickness, length - width);
        arrowShape.lineTo(0, length - thickness);
        arrowShape.lineTo(-width + thickness, length - width);
        arrowShape.lineTo(-width, length - width);
        arrowShape.lineTo(0, length);
        arrowShape.moveTo(thickness / 2, length - width);
        arrowShape.lineTo(thickness / 2, -length * 0.3);
        arrowShape.lineTo(-thickness / 2, -length * 0.3);
        arrowShape.lineTo(-thickness / 2, length - width);
        extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 };
    } else if (style === 2) {
        arrowShape.moveTo(0, 0.38);
        arrowShape.lineTo(0.32, -0.16);
        arrowShape.lineTo(0.18, -0.20);
        arrowShape.lineTo(0, -0.02);
        arrowShape.lineTo(-0.18, -0.20);
        arrowShape.lineTo(-0.32, -0.16);
        arrowShape.lineTo(0, 0.38);
        extrudeSettings = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 8 };
    } else if (style === 3) {
        arrowShape.moveTo(0, 0.35);
        arrowShape.lineTo(-0.15, 0.05);
        arrowShape.lineTo(-0.08, 0.05);
        arrowShape.lineTo(0, 0.2);
        arrowShape.lineTo(0.08, 0.05);
        arrowShape.lineTo(0.15, 0.05);
        arrowShape.lineTo(0, 0.35);
        extrudeSettings = { depth: 0.05, bevelEnabled: false };
    } else if (style === 4) {
        arrowShape.moveTo(0, 0.3);
        arrowShape.lineTo(-0.3, -0.05);
        arrowShape.lineTo(-0.06, -0.05);
        arrowShape.lineTo(-0.06, -0.25);
        arrowShape.lineTo(0.06, -0.25);
        arrowShape.lineTo(0.06, -0.05);
        arrowShape.lineTo(0.3, -0.05);
        arrowShape.lineTo(0, 0.3);
        const hole = new THREE.Path();
        hole.moveTo(0, 0.22);
        hole.lineTo(-0.17, 0.02);
        hole.lineTo(0, 0.12);
        hole.lineTo(0.17, 0.02);
        hole.lineTo(0, 0.22);
        arrowShape.holes.push(hole);
        extrudeSettings = { depth: 0.06, bevelEnabled: false };
    } else if (style === 5) {
        arrowShape.moveTo(0, 0.35);
        arrowShape.lineTo(-0.25, 0.05);
        arrowShape.lineTo(-0.12, 0.05);
        arrowShape.lineTo(-0.12, -0.25);
        arrowShape.lineTo(0.12, -0.25);
        arrowShape.lineTo(0.12, 0.05);
        arrowShape.lineTo(0.25, 0.05);
        arrowShape.lineTo(0, 0.35);
        extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 5 };
    } else if (style === 6) {
        arrowShape.moveTo(0, 0.38);
        arrowShape.lineTo(-0.2, 0.05);
        arrowShape.quadraticCurveTo(-0.2, -0.02, -0.1, -0.02);
        arrowShape.lineTo(-0.09, -0.02);
        arrowShape.lineTo(-0.09, -0.22);
        arrowShape.quadraticCurveTo(-0.09, -0.28, 0, -0.28);
        arrowShape.quadraticCurveTo(0.09, -0.28, 0.09, -0.22);
        arrowShape.lineTo(0.09, -0.02);
        arrowShape.lineTo(0.1, -0.02);
        arrowShape.quadraticCurveTo(0.2, -0.02, 0.2, 0.05);
        arrowShape.lineTo(0, 0.38);
        extrudeSettings = { depth: 0.09, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 4 };
    } else if (style === 7) {
        arrowShape.moveTo(0, 0.36);
        arrowShape.lineTo(-0.22, -0.02);
        arrowShape.lineTo(-0.11, -0.02);
        arrowShape.lineTo(-0.11, -0.06);
        arrowShape.lineTo(-0.08, -0.06);
        arrowShape.lineTo(-0.08, -0.24);
        arrowShape.quadraticCurveTo(-0.08, -0.27, 0, -0.27);
        arrowShape.quadraticCurveTo(0.08, -0.27, 0.08, -0.24);
        arrowShape.lineTo(0.08, -0.06);
        arrowShape.lineTo(0.11, -0.06);
        arrowShape.lineTo(0.11, -0.02);
        arrowShape.lineTo(0.22, -0.02);
        arrowShape.lineTo(0, 0.36);
        extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 };
    } else {
        arrowShape.moveTo(0, 0.4);
        arrowShape.lineTo(-0.24, 0.02);
        arrowShape.lineTo(-0.1, 0.02);
        arrowShape.lineTo(-0.1, -0.24);
        arrowShape.lineTo(0.1, -0.24);
        arrowShape.lineTo(0.1, 0.02);
        arrowShape.lineTo(0.24, 0.02);
        arrowShape.lineTo(0, 0.4);
        extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 };
    }

    const raw = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    ArrowRawGeometryPool.set(style, raw);
    return raw;
}

/**
 * Creates or retrieves a pooled, indexed 3-in-1 merged geometry combining top arrow, forward dot, and backward circle.
 * Hardware-indexed via mergeVertices to maximize GPU post-transform vertex cache efficiency and eliminate ~1,000 draw calls.
 */
export function getOrCreateMergedIndicatorGeometry(arrowStyle, length, isVertical, dirX, dirZ, cubeSize, dotExtrudeSettings) {
    const normDirX = dirX === 0 ? 0 : (dirX > 0 ? 1 : -1);
    const normDirZ = dirZ === 0 ? 0 : (dirZ > 0 ? 1 : -1);
    const key = `3in1_${arrowStyle}_${length}_${isVertical}_${normDirX}_${normDirZ}_${cubeSize}`;
    if (MergedIndicatorGeometryPool.has(key)) {
        return MergedIndicatorGeometryPool.get(key);
    }

    let blockWidth, blockHeight, blockDepth;
    const isXAligned = Math.abs(normDirX) > 0;
    const centerOffset = (length - 1) * cubeSize / 2;

    if (isVertical) {
        blockWidth = cubeSize;
        blockHeight = length * cubeSize;
        blockDepth = cubeSize;
    } else if (isXAligned) {
        blockWidth = length * cubeSize;
        blockHeight = cubeSize;
        blockDepth = cubeSize;
    } else {
        blockWidth = cubeSize;
        blockHeight = cubeSize;
        blockDepth = length * cubeSize;
    }

    const surfaceOffset = 0.005;

    // 1. Top arrow transform relative to block group origin
    let arrowCenterOffset = 0.09;
    if (arrowStyle === 1) arrowCenterOffset = 0.1225;
    else if (arrowStyle === 2) arrowCenterOffset = 0.09;
    else if (arrowStyle === 3) arrowCenterOffset = 0.075;
    else if (arrowStyle === 4) arrowCenterOffset = 0.025;
    else if (arrowStyle === 5) arrowCenterOffset = 0.05;
    else if (arrowStyle === 6) arrowCenterOffset = 0.05;
    else if (arrowStyle === 7) arrowCenterOffset = 0.045;
    else if (arrowStyle === 8) arrowCenterOffset = 0.08;

    let arrowZ = -0.0125;
    if (arrowStyle === 1) arrowZ = -0.015;
    else if (arrowStyle === 2) arrowZ = -0.0125;
    else if (arrowStyle === 4) arrowZ = -0.015;
    else if (arrowStyle === 5) arrowZ = -0.025;
    else if (arrowStyle === 6) arrowZ = -0.03;
    else if (arrowStyle === 7) arrowZ = -0.025;
    else if (arrowStyle === 8) arrowZ = -0.0275;

    const arrowGroupMatrix = new THREE.Matrix4();
    const arrowGroupPos = new THREE.Vector3();
    if (isVertical) {
        arrowGroupPos.set(0, length * cubeSize + 0.02, 0);
    } else if (isXAligned) {
        // Place top arrow on front cube pointing in travel direction
        arrowGroupPos.set((normDirX >= 0 ? 1 : -1) * centerOffset, cubeSize + 0.02, 0);
    } else {
        // Place top arrow on front cube pointing in travel direction
        arrowGroupPos.set(0, cubeSize + 0.02, (normDirZ >= 0 ? 1 : -1) * centerOffset);
    }
    const arrowAngle = Math.atan2(normDirX, normDirZ) + Math.PI;
    const arrowGroupQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, arrowAngle, 'XYZ'));
    arrowGroupMatrix.compose(arrowGroupPos, arrowGroupQuat, new THREE.Vector3(1, 1, 1));

    const arrowMeshMatrix = new THREE.Matrix4().compose(
        new THREE.Vector3(0, -arrowCenterOffset, arrowZ),
        new THREE.Quaternion(),
        new THREE.Vector3(0.85, 0.85, 0.85)
    );
    const finalArrowMatrix = new THREE.Matrix4().multiplyMatrices(arrowGroupMatrix, arrowMeshMatrix);

    const rawArrow = getArrowRawExtrudeGeometry(arrowStyle);
    const gA = rawArrow.clone().applyMatrix4(finalArrowMatrix);

    // 2. Dot geometry
    const dotRadius = 0.2;
    const dotShape = new THREE.Shape();
    dotShape.arc(0, 0, dotRadius, 0, Math.PI * 2, false);
    const dotExtrude = Object.assign({}, dotExtrudeSettings, { curveSegments: 8 });
    const dotGeo = new THREE.ExtrudeGeometry(dotShape, dotExtrude);

    // 3. Circle geometry
    const circleRadius = 0.25;
    const circleShape = new THREE.Shape();
    circleShape.arc(0, 0, circleRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.arc(0, 0, circleRadius - 0.06, 0, Math.PI * 2, true);
    circleShape.holes.push(hole);
    const circleGeo = new THREE.ExtrudeGeometry(circleShape, dotExtrude);

    const dotMatrix = new THREE.Matrix4();
    const circleMatrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const euler = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    if (isVertical) {
        if (normDirX > 0) {
            pos.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
            euler.set(0, -Math.PI / 2, 0);
            dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

            pos.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
            euler.set(0, Math.PI / 2, 0);
            circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
        } else if (normDirX < 0) {
            pos.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
            euler.set(0, Math.PI / 2, 0);
            dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

            pos.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
            euler.set(0, -Math.PI / 2, 0);
            circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
        } else if (normDirZ > 0) {
            pos.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
            euler.set(0, Math.PI, 0);
            dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

            pos.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
            euler.set(0, 0, 0);
            circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
        } else {
            pos.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
            euler.set(0, 0, 0);
            dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

            pos.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
            euler.set(0, Math.PI, 0);
            circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
        }
    } else {
        if (isXAligned) {
            if (normDirX > 0) {
                pos.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                euler.set(0, -Math.PI / 2, 0);
                dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

                pos.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                euler.set(0, Math.PI / 2, 0);
                circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
            } else {
                pos.set(-blockWidth / 2 - surfaceOffset, blockHeight / 2, 0);
                euler.set(0, Math.PI / 2, 0);
                dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

                pos.set(blockWidth / 2 + surfaceOffset, blockHeight / 2, 0);
                euler.set(0, -Math.PI / 2, 0);
                circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
            }
        } else {
            if (normDirZ > 0) {
                pos.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                euler.set(0, Math.PI, 0);
                dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

                pos.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                euler.set(0, 0, 0);
                circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
            } else {
                pos.set(0, blockHeight / 2, -blockDepth / 2 - surfaceOffset);
                euler.set(0, 0, 0);
                dotMatrix.compose(pos, quat.setFromEuler(euler), scale);

                pos.set(0, blockHeight / 2, blockDepth / 2 + surfaceOffset);
                euler.set(0, Math.PI, 0);
                circleMatrix.compose(pos, quat.setFromEuler(euler), scale);
            }
        }
    }

    const gD = dotGeo.clone().applyMatrix4(dotMatrix);
    const gC = circleGeo.clone().applyMatrix4(circleMatrix);
    const merged = mergeVertices(mergeGeometries([gA, gD, gC]));
    dotGeo.dispose();
    circleGeo.dispose();
    gD.dispose();
    gC.dispose();
    gA.dispose();

    MergedIndicatorGeometryPool.set(key, merged);
    return merged;
}

/**
 * Safely dispose and clear all pooled geometries.
 * Should only be called on full application teardown or level reset when no blocks exist.
 */
export function clearGeometryPool() {
    for (const geom of GeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    GeometryPool.clear();

    for (const geom of ArrowGeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    ArrowGeometryPool.clear();

    for (const geom of ArrowRawGeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    ArrowRawGeometryPool.clear();

    for (const geom of DotGeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    DotGeometryPool.clear();

    for (const geom of CircleGeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    CircleGeometryPool.clear();

    for (const geom of MergedIndicatorGeometryPool.values()) {
        if (geom && typeof geom.dispose === 'function') geom.dispose();
    }
    MergedIndicatorGeometryPool.clear();

    IndicatorMaterialPool.clear();
    BasePorcelainMaterialPool.clear();
}

