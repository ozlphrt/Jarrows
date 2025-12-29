let A, D, M, B, I, z, F, _, T, k, C;
let __tla = (async () => {
  let b, S, R;
  b = "modulepreload";
  S = function(e) {
    return "/Jarrows/" + e;
  };
  R = {};
  A = function(r, t, o) {
    let i = Promise.resolve();
    if (t && t.length > 0) {
      document.getElementsByTagName("link");
      const s = document.querySelector("meta[property=csp-nonce]"), n = (s == null ? void 0 : s.nonce) || (s == null ? void 0 : s.getAttribute("nonce"));
      i = Promise.allSettled(t.map((c) => {
        if (c = S(c), c in R) return;
        R[c] = true;
        const f = c.endsWith(".css"), w = f ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${c}"]${w}`)) return;
        const d = document.createElement("link");
        if (d.rel = f ? "stylesheet" : b, f || (d.as = "script"), d.crossOrigin = "", d.href = c, n && d.setAttribute("nonce", n), document.head.appendChild(d), f) return new Promise((v, W) => {
          d.addEventListener("load", v), d.addEventListener("error", () => W(new Error(`Unable to preload CSS for ${c}`)));
        });
      }));
    }
    function l(s) {
      const n = new Event("vite:preloadError", {
        cancelable: true
      });
      if (n.payload = s, window.dispatchEvent(n), !n.defaultPrevented) throw s;
    }
    return i.then((s) => {
      for (const n of s || []) n.status === "rejected" && l(n.reason);
      return r().catch(l);
    });
  };
  let u = null, g = null;
  async function P() {
    return g || (g = (async () => {
      if (!u) {
        console.log("Loading Rapier physics engine...");
        const e = await A(() => import("./rapier-CxarogEY.js"), []);
        u = e.default || e;
        let r = null;
        if (typeof u.init == "function" ? r = u.init : typeof e.init == "function" ? r = e.init : e.default && typeof e.default.init == "function" && (r = e.default.init), r) console.log("Initializing Rapier WASM..."), await r(), console.log("Rapier WASM initialized");
        else throw console.error("Rapier module structure:", {
          hasRAPIERInit: typeof u.init,
          hasModuleInit: typeof e.init,
          hasDefaultInit: e.default && typeof e.default.init,
          RAPIERKeys: Object.keys(u).slice(0, 10),
          moduleKeys: Object.keys(e).slice(0, 10)
        }), new Error("Rapier init() function not found. rapier3d-compat requires explicit initialization. Check console for module structure.");
        try {
          new u.World({
            x: 0,
            y: 0,
            z: 0
          }).free();
        } catch (t) {
          throw new Error(`Rapier WASM verification failed: ${t.message}. World creation requires WASM to be fully initialized.`);
        }
        console.log("Rapier physics engine loaded successfully");
      }
      return u;
    })(), g);
  }
  M = async function() {
    const e = await P();
    try {
      if (!new e.Vector3(0, 0, 0)) throw new Error("Rapier Vector3 creation failed - WASM not ready");
    } catch (n) {
      throw console.error("Rapier WASM verification failed:", n), new Error("Cannot initialize physics: WASM module not ready. " + n.message);
    }
    let r, t, o, i;
    try {
      r = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), t = new e.EventQueue(true), o = new e.World({
        x: 0,
        y: -9.81,
        z: 0
      }), i = new e.EventQueue(true);
    } catch (n) {
      throw console.error("Failed to create Rapier World - WASM not initialized:", n), new Error("Failed to create physics world. WASM module may not be loaded correctly. " + n.message);
    }
    const l = 3.5, s = e.ColliderDesc.cuboid(l, 0.1, l).setTranslation(l, -0.1, l).setFriction(0.7).setRestitution(0.1);
    return o.createCollider(s), {
      world: r,
      eventQueue: t,
      fallingWorld: o,
      fallingEventQueue: i,
      RAPIER: e
    };
  };
  B = function(e, r, t, o = true, i = true) {
    const l = i ? e.fallingWorld : e.world;
    if (!l) throw new Error("Physics world not available");
    if (a) throw new Error("Cannot create physics body during step");
    const s = e.RAPIER, n = o ? s.RigidBodyDesc.dynamic() : s.RigidBodyDesc.fixed();
    n.setTranslation(r.x, r.y, r.z);
    const c = l.createRigidBody(n), f = s.ColliderDesc.cuboid(t.x / 2, t.y / 2, t.z / 2).setDensity(1).setFriction(0.5).setRestitution(0.3), w = l.createCollider(f, c);
    return {
      body: c,
      collider: w
    };
  };
  let a = false, m = false, y = [], h = [], p = [];
  F = function() {
    return y.length > 0 || h.length > 0 || p.length > 0;
  };
  C = function(e, r) {
    if (!(!e || !e.fallingWorld) && !(m || a)) {
      m = true;
      try {
        if (y.length > 0) {
          const t = [
            ...y
          ];
          y = [];
          for (const o of t) try {
            a || o();
          } catch (i) {
            console.warn("Failed to create physics body:", i);
          }
        }
        if (h.length > 0) {
          const t = [
            ...h
          ];
          h = [];
          for (const o of t) try {
            a || o();
          } catch (i) {
            console.warn("Failed to modify physics body:", i);
          }
        }
        if (p.length > 0) {
          const t = [
            ...p
          ];
          p = [];
          for (const o of t) try {
            a || o();
          } catch (i) {
            console.warn("Failed to remove physics body:", i);
          }
        }
        if (!a) {
          let t = false;
          try {
            t = true;
          } catch (o) {
            console.warn("World state invalid, skipping step:", o);
            return;
          }
          if (t || y.length === 0) {
            a = true;
            try {
              e.fallingWorld.step();
            } catch (o) {
              console.error("Failed to step physics:", o);
            } finally {
              a = false;
            }
          }
        }
      } finally {
        m = false;
      }
    }
  };
  _ = function() {
    return a;
  };
  z = function() {
    return m;
  };
  I = function(e) {
    y.push(e);
  };
  D = function(e) {
    h.push(e);
  };
  function E(e) {
    p.push(e);
  }
  k = function(e, r, t = true) {
    if (!e || !r) return;
    const o = t ? e.fallingWorld : e.world;
    o && E(() => {
      try {
        o.removeRigidBody(r);
      } catch (i) {
        console.warn("Failed to remove physics body:", i);
      }
    });
  };
  T = Object.freeze(Object.defineProperty({
    __proto__: null,
    createPhysicsBlock: B,
    deferBodyCreation: I,
    deferBodyModification: D,
    deferBodyRemoval: E,
    hasPendingOperations: F,
    initPhysics: M,
    isPhysicsProcessing: z,
    isPhysicsStepping: _,
    loadRapier: P,
    removePhysicsBody: k,
    updatePhysics: C
  }, Symbol.toStringTag, {
    value: "Module"
  }));
})();
export {
  A as _,
  __tla,
  D as a,
  M as b,
  B as c,
  I as d,
  z as e,
  F as h,
  _ as i,
  T as p,
  k as r,
  C as u
};
