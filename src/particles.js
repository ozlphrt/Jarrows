/**
 * Particle System -- Debris Physics + Sprite-pool Volumetric Smoke
 *
 * Two completely separate systems:
 * 1. THREE.Points physics debris  -- physical parabolic arcs with gravity & bounce.
 * 2. THREE.Sprite smoke pool      -- world-space billboarded quads, overlapping softly,
 *    with per-puff rotation, expansion and fade, producing genuine volumetric billowing
 *    smoke columns.
 */

import * as THREE from 'three';

/* ------------------------------------------------------------------ TEXTURES */

function createSparkTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0,    'rgba(255,255,255,1.0)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.75, 'rgba(255,255,255,0.35)');
    g.addColorStop(1,    'rgba(255,255,255,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.generateMipmaps = true;
    return t;
}

function createSmokePuffTexture() {
    const S = 256;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const ctx = c.getContext('2d');
    const H = S / 2;

    const base = ctx.createRadialGradient(H, H, 0, H, H, H * 0.92);
    base.addColorStop(0.00, 'rgba(255,255,255,0.90)');
    base.addColorStop(0.30, 'rgba(240,240,240,0.70)');
    base.addColorStop(0.60, 'rgba(200,200,200,0.30)');
    base.addColorStop(0.82, 'rgba(150,150,150,0.08)');
    base.addColorStop(1.00, 'rgba(100,100,100,0.00)');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, S, S);

    for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = (0.15 + Math.random() * 0.45) * H;
        const cx    = H + Math.cos(angle) * dist;
        const cy    = H + Math.sin(angle) * dist;
        const r     = (0.18 + Math.random() * 0.28) * H;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0.00, 'rgba(255,255,255,' + (0.22 + Math.random() * 0.22).toFixed(2) + ')');
        g.addColorStop(0.50, 'rgba(220,220,220,' + (0.08 + Math.random() * 0.10).toFixed(2) + ')');
        g.addColorStop(1.00, 'rgba(150,150,150,0.00)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    }

    const t = new THREE.CanvasTexture(c);
    t.generateMipmaps = true;
    return t;
}

/* ------------------------------------------------------------------ FACTORY */

export function createParticleSystem(maxParticles, scene) {
    if (maxParticles === undefined) maxParticles = 800;

    const sparkTexture    = createSparkTexture();
    const smokePuffTexture = createSmokePuffTexture();

    /* ---- SYSTEM 1: DEBRIS / SPARKS (THREE.Points, physics) ---- */
    const maxDebris = Math.floor(maxParticles * 0.65);
    const dPos  = new Float32Array(maxDebris * 3);
    const dCol  = new Float32Array(maxDebris * 3);
    const dSize = new Float32Array(maxDebris);
    const dData = [];

    const debrisGeo = new THREE.BufferGeometry();
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    debrisGeo.setAttribute('color',    new THREE.BufferAttribute(dCol, 3));
    debrisGeo.setAttribute('size',     new THREE.BufferAttribute(dSize, 1));

    const debrisMat = new THREE.PointsMaterial({
        size: 0.14, map: sparkTexture, vertexColors: true,
        transparent: true, opacity: 0.95,
        blending: THREE.NormalBlending, depthWrite: false
    });
    const debrisPoints = new THREE.Points(debrisGeo, debrisMat);
    scene.add(debrisPoints);

    var nextDebris = 0;
    var GRAVITY = -28.0;

    /* ---- SYSTEM 2: VOLUMETRIC SMOKE SPRITES (THREE.Sprite pool) ---- */
    // Larger pool: 320 sprites comfortably handles several concurrent blasts
    var MAX_SMOKE = 320;
    var smokeMat = new THREE.SpriteMaterial({
        map: smokePuffTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        color: new THREE.Color(1, 1, 1)
    });

    var spritePool = [];
    var spriteState = [];

    for (var si = 0; si < MAX_SMOKE; si++) {
        var mat = smokeMat.clone();
        var sp = new THREE.Sprite(mat);
        sp.visible = false;
        sp.scale.set(0.01, 0.01, 0.01);
        scene.add(sp);
        spritePool.push(sp);
        spriteState.push({ active: false, sprite: sp, fadingOut: false, fadeAge: 0, fadeDur: 0 });
    }

    var nextSmoke = 0;

    /**
     * Acquire a free sprite from the pool.
     * If all 320 are active, steal the one that is furthest into its fade-out
     * (highest t), so the visual disruption is minimal.  The stolen sprite
     * is given a short 220 ms soft fade-out rather than being killed instantly.
     */
    function acquireSprite() {
        // 1. Try to find an idle sprite first (fast ring-buffer scan)
        for (var tries = 0; tries < MAX_SMOKE; tries++) {
            var idx = nextSmoke;
            nextSmoke = (nextSmoke + 1) % MAX_SMOKE;
            if (!spriteState[idx].active) return idx;
        }
        // 2. Pool is fully saturated — find the sprite with the highest
        //    normalised age (closest to its natural end of life)
        var bestIdx = 0;
        var bestT   = -1;
        for (var k = 0; k < MAX_SMOKE; k++) {
            var st = spriteState[k];
            if (!st.active) { bestIdx = k; break; }
            var nt = st.maxAge > 0 ? st.age / st.maxAge : 1;
            if (nt > bestT) { bestT = nt; bestIdx = k; }
        }
        // 3. Trigger graceful 220 ms fade-out on the stolen sprite
        var stolen = spriteState[bestIdx];
        if (stolen.active) {
            stolen.fadingOut = true;
            stolen.fadeAge   = 0;
            stolen.fadeDur   = 0.22;          // seconds
            stolen.fadeFrom  = stolen.sprite.material.opacity;
        }
        return bestIdx;
    }

    /* ---- DEBRIS API ---- */

    function addExplosion(position, color, count, velocity, moveDirection) {
        if (count === undefined) count = 40;
        if (velocity === undefined) velocity = 5.0;
        if (moveDirection === undefined) moveDirection = null;
        var cv = Math.min(velocity, 9.0);
        for (var i = 0; i < count; i++) {
            var idx = nextDebris;
            nextDebris = (nextDebris + 1) % maxDebris;
            if (!dData[idx]) dData[idx] = { index: idx };
            var p = dData[idx];
            p.active = true; p.isGrounded = false;
            p.bounces = 0;   p.maxBounces = 1 + Math.floor(Math.random() * 2);
            p.groundedAge = 0; p.age = 0;
            p.startSize = 0.12 + Math.random() * 0.14;
            p.drag = 0.985;

            var theta  = Math.random() * Math.PI * 2;
            var hSpeed = cv * (0.6 + Math.random() * 0.8);
            var vx = Math.cos(theta) * hSpeed;
            var vz = Math.sin(theta) * hSpeed;
            var vy = 3.5 + Math.random() * 4.5;
            if (moveDirection && (moveDirection.x || moveDirection.z)) {
                vx += moveDirection.x * cv * 1.6;
                vz += moveDirection.z * cv * 1.6;
                vy = 2.5 + Math.random() * 3.5;
            }
            p.velocity = new THREE.Vector3(vx, vy, vz);

            var isSpark = Math.random() < 0.20;
            var br = isSpark ? 1.5 : (0.85 + Math.random() * 0.35);
            dCol[idx*3]   = Math.min(1, color.r * br + (isSpark ? 0.2 : 0));
            dCol[idx*3+1] = Math.min(1, color.g * br + (isSpark ? 0.2 : 0));
            dCol[idx*3+2] = Math.min(1, color.b * br + (isSpark ? 0.2 : 0));
            if (isSpark) p.startSize *= 1.25;

            dPos[idx*3]   = position.x + (Math.random() - 0.5) * 0.25;
            dPos[idx*3+1] = position.y + (Math.random() - 0.5) * 0.25;
            dPos[idx*3+2] = position.z + (Math.random() - 0.5) * 0.25;
            p.colorR = dCol[idx*3]; p.colorG = dCol[idx*3+1]; p.colorB = dCol[idx*3+2];
            dSize[idx] = p.startSize;
        }
        debrisGeo.attributes.position.needsUpdate = true;
        debrisGeo.attributes.color.needsUpdate    = true;
        debrisGeo.attributes.size.needsUpdate     = true;
        if (window.markNeedsRender) window.markNeedsRender(2500);
    }

    function addFireSparks(position, count) {
        if (count === undefined) count = 10;
        for (var i = 0; i < count; i++) {
            var idx = nextDebris;
            nextDebris = (nextDebris + 1) % maxDebris;
            if (!dData[idx]) dData[idx] = { index: idx };
            var p = dData[idx];
            p.active = true; p.isGrounded = false; p.age = 0;
            p.startSize = 0.14 + Math.random() * 0.12; p.drag = 0.96;
            var a = Math.random() * Math.PI * 2;
            p.velocity = new THREE.Vector3(
                Math.cos(a) * (0.6 + Math.random()),
                2.2 + Math.random() * 2.5,
                Math.sin(a) * (0.6 + Math.random())
            );
            dCol[idx*3]   = 1.0;
            dCol[idx*3+1] = 0.55 + Math.random() * 0.4;
            dCol[idx*3+2] = 0.08;
            dPos[idx*3]   = position.x + (Math.random() - 0.5) * 0.4;
            dPos[idx*3+1] = position.y + 0.15;
            dPos[idx*3+2] = position.z + (Math.random() - 0.5) * 0.4;
            p.colorR = dCol[idx*3]; p.colorG = dCol[idx*3+1]; p.colorB = dCol[idx*3+2];
            dSize[idx] = p.startSize;
        }
        debrisGeo.attributes.position.needsUpdate = true;
        debrisGeo.attributes.color.needsUpdate    = true;
        debrisGeo.attributes.size.needsUpdate     = true;
        if (window.markNeedsRender) window.markNeedsRender(2000);
    }

    /* ---- SPRITE SMOKE API ---- */

    function addSmokeWisps(position, count, opts) {
        if (count === undefined) count = 4;
        if (opts === undefined) opts = {};
        for (var i = 0; i < count; i++) {
            var idx = acquireSprite();
            var state = spriteState[idx];
            var sprite = state.sprite;

            state.active = true;
            state.age = 0;
            state.maxAge = (opts.maxAge !== undefined) ? opts.maxAge : (2.5 + Math.random() * 1.5);

            var baseSize = ((opts.sizeMult !== undefined) ? opts.sizeMult : 1.0) * (0.35 + Math.random() * 0.30);
            state.startSize = baseSize;
            state.endSize   = baseSize * (3.5 + Math.random() * 2.0);

            state.velY = 0.55 + Math.random() * 0.70;
            var ang = Math.random() * Math.PI * 2;
            var hs  = 0.08 + Math.random() * 0.22;
            state.velX = Math.cos(ang) * hs;
            state.velZ = Math.sin(ang) * hs;
            state.phase = Math.random() * Math.PI * 2;

            sprite.material.rotation = Math.random() * Math.PI * 2;
            state.rotSpeed = (Math.random() - 0.5) * 0.55;

            if (opts.isEmber) {
                sprite.material.color.setRGB(1.0, 0.55 + Math.random() * 0.35, 0.08);
                state.startOpacity = 0.85;
            } else if (opts.isSteam) {
                var v = 0.88 + Math.random() * 0.12;
                sprite.material.color.setRGB(v, v, Math.min(1, v + 0.04));
                state.startOpacity = 0.55;
            } else {
                var sh = 0.22 + Math.random() * 0.20;
                sprite.material.color.setRGB(sh, sh * 1.04, sh * 1.10);
                state.startOpacity = 0.50 + Math.random() * 0.20;
            }
            sprite.material.opacity = 0.0;

            sprite.position.set(
                position.x + (Math.random() - 0.5) * 0.55,
                position.y + Math.random() * 0.25,
                position.z + (Math.random() - 0.5) * 0.55
            );

            sprite.scale.setScalar(state.startSize * 0.3);
            sprite.visible = true;
        }
        if (window.markNeedsRender) window.markNeedsRender(3500);
    }

    function addQuenchBurst(position, count) {
        if (count === undefined) count = 18;
        for (var i = 0; i < count; i++) {
            addSmokeWisps(position, 1, {
                isSteam: true,
                sizeMult: 1.2 + Math.random() * 0.6,
                maxAge: 1.2 + Math.random() * 0.7
            });
        }
    }

    function clearSmoke(immediate) {
        if (immediate) {
            for (var i = 0; i < MAX_SMOKE; i++) {
                spriteState[i].active = false;
                spriteState[i].fadingOut = false;
                spritePool[i].visible = false;
                spritePool[i].material.opacity = 0;
            }
        } else {
            // Gracefully dissolve remaining clouds over ~1.1s instead of popping
            for (var j = 0; j < MAX_SMOKE; j++) {
                var st = spriteState[j];
                if (st.active && !st.fadingOut) {
                    st.fadingOut = true;
                    st.fadeAge = 0;
                    st.fadeDur = 1.1; // Smooth dissolution duration
                    st.fadeFrom = st.sprite.material.opacity;
                }
            }
        }
        if (window.markNeedsRender) window.markNeedsRender(1400);
    }

    /* ---- UPDATE LOOP ---- */

    function updateParticles(deltaTime) {
        var dt = Math.min(deltaTime, 0.05);

        var baseY = 0, baseX = 3.5, baseZ = 3.5, baseHS = 5.5;
        if (window.gameGrid && window.gameGrid.base) {
            var bp = new THREE.Vector3();
            window.gameGrid.base.getWorldPosition(bp);
            baseY = bp.y + 0.08; baseX = bp.x; baseZ = bp.z;
            if (window.gameGrid.base.geometry && window.gameGrid.base.geometry.parameters) {
                var bw = window.gameGrid.base.geometry.parameters.width || 21;
                baseHS = (bw * window.gameGrid.base.scale.x) / 2;
            }
        }
        var BX0 = baseX - baseHS, BX1 = baseX + baseHS;
        var BZ0 = baseZ - baseHS, BZ1 = baseZ + baseHS;

        /* -- debris -- */
        for (var i = 0; i < maxDebris; i++) {
            var p = dData[i];
            if (!p || !p.active) continue;

            if (p.isGrounded) {
                p.groundedAge += dt;
                if (p.groundedAge >= 1.6) {
                    p.active = false; dPos[i*3+1] = -9999; dSize[i] = 0;
                } else {
                    var f = Math.max(0, 1 - p.groundedAge / 1.6);
                    dCol[i*3]   = p.colorR * f;
                    dCol[i*3+1] = p.colorG * f;
                    dCol[i*3+2] = p.colorB * f;
                }
                continue;
            }

            p.age += dt;
            p.velocity.x *= p.drag;
            p.velocity.z *= p.drag;
            p.velocity.y += GRAVITY * dt;

            var nx = dPos[i*3]   + p.velocity.x * dt;
            var ny = dPos[i*3+1] + p.velocity.y * dt;
            var nz = dPos[i*3+2] + p.velocity.z * dt;
            var onPlate = nx >= BX0 && nx <= BX1 && nz >= BZ0 && nz <= BZ1;

            if (ny < -12 || (!onPlate && ny < baseY - 0.3)) {
                p.active = false; dPos[i*3+1] = -9999; dSize[i] = 0; continue;
            }
            if (ny <= baseY && onPlate) {
                p.bounces++;
                if (p.bounces >= p.maxBounces || Math.abs(p.velocity.y) < 1.5) {
                    p.isGrounded = true; p.velocity.set(0,0,0);
                    dPos[i*3] = nx; dPos[i*3+1] = baseY + 0.02; dPos[i*3+2] = nz;
                } else {
                    p.velocity.y *= -0.35; p.velocity.x *= 0.6; p.velocity.z *= 0.6;
                    dPos[i*3+1] = baseY + 0.03;
                }
            } else {
                dPos[i*3] = nx; dPos[i*3+1] = ny; dPos[i*3+2] = nz;
            }
        }
        debrisGeo.attributes.position.needsUpdate = true;
        debrisGeo.attributes.color.needsUpdate    = true;
        debrisGeo.attributes.size.needsUpdate     = true;

        /* -- sprites -- */
        for (var j = 0; j < MAX_SMOKE; j++) {
            var st = spriteState[j];
            if (!st.active) continue;

            // ── Graceful soft fade-out (for stolen sprites or cleanup) ──
            if (st.fadingOut) {
                st.fadeAge += dt;
                var fp = Math.min(st.fadeAge / st.fadeDur, 1.0);
                // Hermite smoothstep for natural dissolving
                var smoothFade = 1.0 - (fp * fp * (3.0 - 2.0 * fp));
                st.sprite.material.opacity = Math.max(0, st.fadeFrom * smoothFade);

                // Continue slow expansion and drift during dissolution
                var currSz = st.sprite.scale.x * (1.0 + 0.12 * dt);
                st.sprite.scale.setScalar(currSz);

                st.sprite.position.x += st.velX * dt;
                st.sprite.position.y += st.velY * dt;
                st.sprite.position.z += st.velZ * dt;

                if (fp >= 1.0) {
                    st.active = false;
                    st.fadingOut = false;
                    st.sprite.visible = false;
                    st.sprite.material.opacity = 0;
                }
                continue;
            }

            st.age += dt;
            var t = st.age / st.maxAge;

            if (t >= 1.0) {
                st.active = false;
                st.sprite.visible = false;
                st.sprite.material.opacity = 0;
                continue;
            }

            // Ultra-smooth opacity: gentle sine rise, then asymptotic power decay to zero
            var op;
            if (t < 0.16) {
                op = Math.sin((t / 0.16) * Math.PI * 0.5) * st.startOpacity;
            } else {
                var decayP = (t - 0.16) / 0.84;
                var fadeFactor = Math.max(0.0, 1.0 - decayP);
                // Power of 2.2 ensures zero slope at end of lifetime
                op = Math.pow(fadeFactor, 2.2) * st.startOpacity;
            }
            st.sprite.material.opacity = Math.max(0, op);

            // Progressive cloud expansion (starts compact, billows outward)
            var sz = st.startSize + (st.endSize - st.startSize) * Math.pow(t, 0.50);
            st.sprite.scale.setScalar(sz);

            st.sprite.material.rotation += st.rotSpeed * dt;

            var curl = Math.sin(st.age * 2.2 + st.phase) * 0.18;
            st.velX += curl * dt;
            st.velZ += Math.cos(st.age * 1.8 + st.phase + 1.1) * 0.14 * dt;
            st.velX *= 0.985;
            st.velZ *= 0.985;

            st.sprite.position.x += st.velX * dt;
            st.sprite.position.y += st.velY * dt;
            st.sprite.position.z += st.velZ * dt;
            st.velY = Math.max(0.04, st.velY - 0.16 * dt);
        }
    }

    /* ---- CLEANUP ---- */

    function cleanupParticles() {
        for (var i = 0; i < maxDebris; i++) {
            if (dData[i]) { dData[i].active = false; dSize[i] = 0; }
        }
        debrisGeo.attributes.size.needsUpdate = true;
        clearSmoke();
    }

    function dispose() {
        scene.remove(debrisPoints);
        debrisGeo.dispose(); debrisMat.dispose(); sparkTexture.dispose();
        for (var i = 0; i < spritePool.length; i++) {
            scene.remove(spritePool[i]);
            spritePool[i].material.dispose();
        }
        smokePuffTexture.dispose(); smokeMat.dispose();
    }

    return {
        addExplosion:    addExplosion,
        addSmokeWisps:   addSmokeWisps,
        addFireSparks:   addFireSparks,
        addQuenchBurst:  addQuenchBurst,
        clearSmoke:      clearSmoke,
        updateParticles: updateParticles,
        cleanupParticles: cleanupParticles,
        dispose:         dispose,
        debrisPoints:    debrisPoints,
        getActiveCount:  function() {
            var d = 0, s = 0;
            for (var i = 0; i < dData.length; i++) if (dData[i] && dData[i].active) d++;
            for (var j = 0; j < spriteState.length; j++) if (spriteState[j].active) s++;
            return d + s;
        }
    };
}
