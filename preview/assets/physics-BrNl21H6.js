import { _ as C } from "./preload-helper-Dwn842R7.js";
let A, D, I, v, F, M, S, B, b, z, x;
let __tla = (async () => {
  let c = null, w = null;
  b = async function() {
    return w || (w = (async () => {
      if (!c) {
        console.log("Loading Rapier physics engine...");
        const e = await C(() => import("./rapier-CxarogEY.js"), []);
        c = e.default || e;
        let i = null;
        if (typeof c.init == "function" ? i = c.init : typeof e.init == "function" ? i = e.init : e.default && typeof e.default.init == "function" && (i = e.default.init), i) console.log("Initializing Rapier WASM..."), await i({}), console.log("Rapier WASM initialized");
        else throw console.error("Rapier module structure:", {
          hasRAPIERInit: typeof c.init,
          hasModuleInit: typeof e.init,
          hasDefaultInit: e.default && typeof e.default.init,
          RAPIERKeys: Object.keys(c).slice(0, 10),
          moduleKeys: Object.keys(e).slice(0, 10)
        }), new Error("Rapier init() function not found. rapier3d-compat requires explicit initialization. Check console for module structure.");
        try {
          new c.World({
            x: 0,
            y: 0,
            z: 0
          }).free();
        } catch (t) {
          throw new Error(`Rapier WASM verification failed: ${t.message}. World creation requires WASM to be fully initialized.`);
        }
        console.log("Rapier physics engine loaded successfully");
      }
      return c;
    })(), w);
  };
  M = async function() {
    const e = await b();
    try {
      if (!new e.Vector3(0, 0, 0)) throw new Error("Rapier Vector3 creation failed - WASM not ready");
    } catch (s) {
      throw console.error("Rapier WASM verification failed:", s), new Error("Cannot initialize physics: WASM module not ready. " + s.message);
    }
    let i, t, o, r;
    try {
      i = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), t = new e.EventQueue(true), o = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), r = new e.EventQueue(true);
    } catch (s) {
      throw console.error("Failed to create Rapier World - WASM not initialized:", s), new Error("Failed to create physics world. WASM module may not be loaded correctly. " + s.message);
    }
    const l = 10.5, u = 3.5, a = 3.5, p = u, g = a, d = e.ColliderDesc.cuboid(l, 0.1, l).setTranslation(p, -0.1, g).setFriction(0).setRestitution(0);
    return o.createCollider(d).setFrictionCombineRule(e.CoefficientCombineRule.Min), {
      world: i,
      eventQueue: t,
      fallingWorld: o,
      fallingEventQueue: r,
      RAPIER: e
    };
  };
  A = function(e, i, t, o = true, r = true, l = 0) {
    const u = r ? e.fallingWorld : e.world;
    if (!u) throw new Error("Physics world not available");
    if (n) throw new Error("Cannot create physics body during step");
    const a = e.RAPIER, p = o ? a.RigidBodyDesc.dynamic() : a.RigidBodyDesc.fixed();
    p.setTranslation(i.x, i.y, i.z);
    const g = u.createRigidBody(p);
    let d;
    if (l > 0) {
      const s = Math.max(1e-3, t.x / 2 - l), W = Math.max(1e-3, t.y / 2 - l), P = Math.max(1e-3, t.z / 2 - l);
      d = a.ColliderDesc.roundCuboid(s, W, P, l);
    } else d = a.ColliderDesc.cuboid(t.x / 2, t.y / 2, t.z / 2);
    d.setDensity(1).setFriction(0.5).setRestitution(0.3);
    const R = u.createCollider(d, g);
    return {
      body: g,
      collider: R
    };
  };
  let n = false, m = false, f = [], y = [], h = [];
  F = function() {
    return f.length > 0 || y.length > 0 || h.length > 0;
  };
  x = function(e, i) {
    if (!(!e || !e.fallingWorld) && !(m || n)) {
      m = true;
      try {
        if (f.length > 0) {
          const t = [
            ...f
          ];
          f = [];
          for (const o of t) try {
            n || o();
          } catch (r) {
            console.warn("Failed to create physics body:", r.message, r.stack, r);
          }
        }
        if (y.length > 0) {
          const t = [
            ...y
          ];
          y = [];
          for (const o of t) try {
            n || o();
          } catch (r) {
            console.warn("Failed to modify physics body:", r);
          }
        }
        if (h.length > 0) {
          const t = [
            ...h
          ];
          h = [];
          for (const o of t) try {
            n || o();
          } catch (r) {
            console.warn("Failed to remove physics body:", r);
          }
        }
        if (!n) {
          let t = false;
          try {
            t = true;
          } catch (o) {
            console.warn("World state invalid, skipping step:", o);
            return;
          }
          if (t || f.length === 0) {
            n = true;
            try {
              e.fallingWorld.step();
            } catch (o) {
              console.error("Failed to step physics:", o);
            } finally {
              n = false;
            }
          }
        }
      } finally {
        m = false;
      }
    }
  };
  B = function() {
    return n;
  };
  S = function() {
    return m;
  };
  D = function(e) {
    f.push(e);
  };
  I = function(e) {
    y.push(e);
  };
  v = function(e) {
    h.push(e);
  };
  z = function(e, i, t = true) {
    if (!e || !i) return;
    const o = t ? e.fallingWorld : e.world;
    o && v(() => {
      try {
        o.removeRigidBody(i);
      } catch (r) {
        console.warn("Failed to remove physics body:", r);
      }
    });
  };
})();
export {
  __tla,
  A as createPhysicsBlock,
  D as deferBodyCreation,
  I as deferBodyModification,
  v as deferBodyRemoval,
  F as hasPendingOperations,
  M as initPhysics,
  S as isPhysicsProcessing,
  B as isPhysicsStepping,
  b as loadRapier,
  z as removePhysicsBody,
  x as updatePhysics
};
