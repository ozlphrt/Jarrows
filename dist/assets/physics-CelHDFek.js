import { _ as R } from "./preload-helper-Si1OKCYg.js";
let E, M, S, P, A, v, B, b, m, I, F;
let __tla = (async () => {
  let c = null, y = null;
  m = async function() {
    return y || (y = (async () => {
      if (!c) {
        console.log("Loading Rapier physics engine...");
        const e = await R(() => import("./rapier-CxarogEY.js"), []);
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
    })(), y);
  };
  v = async function() {
    const e = await m();
    try {
      if (!new e.Vector3(0, 0, 0)) throw new Error("Rapier Vector3 creation failed - WASM not ready");
    } catch (r) {
      throw console.error("Rapier WASM verification failed:", r), new Error("Cannot initialize physics: WASM module not ready. " + r.message);
    }
    let i, t, o, n;
    try {
      i = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), t = new e.EventQueue(true), o = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), n = new e.EventQueue(true);
    } catch (r) {
      throw console.error("Failed to create Rapier World - WASM not initialized:", r), new Error("Failed to create physics world. WASM module may not be loaded correctly. " + r.message);
    }
    const s = 3.5, d = e.ColliderDesc.cuboid(s, 0.1, s).setTranslation(s, -0.1, s).setFriction(0.7).setRestitution(0.1);
    return o.createCollider(d), {
      world: i,
      eventQueue: t,
      fallingWorld: o,
      fallingEventQueue: n,
      RAPIER: e
    };
  };
  E = function(e, i, t, o = true, n = true) {
    const s = n ? e.fallingWorld : e.world;
    if (!s) throw new Error("Physics world not available");
    if (l) throw new Error("Cannot create physics body during step");
    const d = e.RAPIER, r = o ? d.RigidBodyDesc.dynamic() : d.RigidBodyDesc.fixed();
    r.setTranslation(i.x, i.y, i.z);
    const h = s.createRigidBody(r), g = d.ColliderDesc.cuboid(t.x / 2, t.y / 2, t.z / 2).setDensity(1).setFriction(0.5).setRestitution(0.3), w = s.createCollider(g, h);
    return {
      body: h,
      collider: w
    };
  };
  let l = false, p = false, a = [], f = [], u = [];
  A = function() {
    return a.length > 0 || f.length > 0 || u.length > 0;
  };
  F = function(e, i) {
    if (!(!e || !e.fallingWorld) && !(p || l)) {
      p = true;
      try {
        if (a.length > 0) {
          const t = [
            ...a
          ];
          a = [];
          for (const o of t) try {
            l || o();
          } catch (n) {
            console.warn("Failed to create physics body:", n);
          }
        }
        if (f.length > 0) {
          const t = [
            ...f
          ];
          f = [];
          for (const o of t) try {
            l || o();
          } catch (n) {
            console.warn("Failed to modify physics body:", n);
          }
        }
        if (u.length > 0) {
          const t = [
            ...u
          ];
          u = [];
          for (const o of t) try {
            l || o();
          } catch (n) {
            console.warn("Failed to remove physics body:", n);
          }
        }
        if (!l) {
          let t = false;
          try {
            t = true;
          } catch (o) {
            console.warn("World state invalid, skipping step:", o);
            return;
          }
          if (t || a.length === 0) {
            l = true;
            try {
              e.fallingWorld.step();
            } catch (o) {
              console.error("Failed to step physics:", o);
            } finally {
              l = false;
            }
          }
        }
      } finally {
        p = false;
      }
    }
  };
  b = function() {
    return l;
  };
  B = function() {
    return p;
  };
  M = function(e) {
    a.push(e);
  };
  S = function(e) {
    f.push(e);
  };
  P = function(e) {
    u.push(e);
  };
  I = function(e, i, t = true) {
    if (!e || !i) return;
    const o = t ? e.fallingWorld : e.world;
    o && P(() => {
      try {
        o.removeRigidBody(i);
      } catch (n) {
        console.warn("Failed to remove physics body:", n);
      }
    });
  };
})();
export {
  __tla,
  E as createPhysicsBlock,
  M as deferBodyCreation,
  S as deferBodyModification,
  P as deferBodyRemoval,
  A as hasPendingOperations,
  v as initPhysics,
  B as isPhysicsProcessing,
  b as isPhysicsStepping,
  m as loadRapier,
  I as removePhysicsBody,
  F as updatePhysics
};
