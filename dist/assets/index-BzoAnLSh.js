const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/main-BW_gLWdk.js","assets/preload-helper-Si1OKCYg.js","assets/physics-CelHDFek.js"])))=>i.map(i=>d[i]);
import { _ as q } from "./preload-helper-Si1OKCYg.js";
(async () => {
  (function() {
    const o = document.createElement("link").relList;
    if (o && o.supports && o.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) n(r);
    new MutationObserver((r) => {
      for (const l of r) if (l.type === "childList") for (const a of l.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function i(r) {
      const l = {};
      return r.integrity && (l.integrity = r.integrity), r.referrerPolicy && (l.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? l.credentials = "include" : r.crossOrigin === "anonymous" ? l.credentials = "omit" : l.credentials = "same-origin", l;
    }
    function n(r) {
      if (r.ep) return;
      r.ep = true;
      const l = i(r);
      fetch(r.href, l);
    }
  })();
  await q(() => import("./main-BW_gLWdk.js").then(async (m) => {
    await m.__tla;
    return m;
  }), __vite__mapDeps([0,1,2]));
  let k;
  function D() {
    try {
      const e = localStorage.getItem("jarrows_theme"), o = localStorage.getItem("jarrows_colors"), i = localStorage.getItem("jarrows_quality");
      return {
        isDarkTheme: e !== null ? e === "dark" : true,
        useColoredBlocks: o !== null ? o === "colored" : false,
        qualityPreset: i || "balanced"
      };
    } catch (e) {
      return console.warn("Failed to load preferences:", e), {
        isDarkTheme: true,
        useColoredBlocks: false,
        qualityPreset: "balanced"
      };
    }
  }
  function L() {
    try {
      localStorage.setItem("jarrows_theme", g ? "dark" : "light"), localStorage.setItem("jarrows_colors", d ? "colored" : "white"), localStorage.setItem("jarrows_quality", c);
    } catch (e) {
      console.warn("Failed to save preferences:", e);
    }
  }
  const T = D();
  let g = T.isDarkTheme, d = T.useColoredBlocks, c = T.qualityPreset || "balanced", x = false;
  window.useColoredBlocksDefault = d;
  window.jarrowsQualityPreset = c;
  function B() {
    const e = window.gameScene, o = window.THREE, i = document.getElementById("theme-icon"), n = document.getElementById("theme-toggle");
    if (!e || !o || !i || !n) {
      console.log("updateThemeIcon: Missing dependencies", {
        scene: !!e,
        THREE: !!o,
        themeIcon: !!i,
        themeToggle: !!n
      });
      return;
    }
    if (!window.setGradientBackground || !window.setupFog) {
      console.log("updateThemeIcon: Waiting for functions...", {
        setGradientBackground: !!window.setGradientBackground,
        setupFog: !!window.setupFog
      }), setTimeout(B, 50);
      return;
    }
    console.log("updateThemeIcon: Applying theme", {
      isDarkTheme: g
    }), g ? (window.setGradientBackground(e, 986895, 328965), window.setupFog(e, true), i.setAttribute("fill", "none"), i.setAttribute("stroke", "currentColor"), i.setAttribute("stroke-width", "2"), i.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none"></path>', n.classList.add("active")) : (window.setGradientBackground(e, 5930904, 3824250), window.setupFog(e, false), i.setAttribute("fill", "none"), i.setAttribute("stroke", "currentColor"), i.setAttribute("stroke-width", "2"), i.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', n.classList.remove("active"));
  }
  function P() {
    const e = document.getElementById("colors-icon"), o = document.getElementById("colors-toggle");
    !e || !o || (d ? (e.setAttribute("stroke", "none"), e.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="#4ecdc4" stroke="none"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="#ffe66d" stroke="none"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect>', o.classList.add("active")) : (e.setAttribute("stroke", "currentColor"), e.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="white"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="white"></rect>', o.classList.remove("active")));
  }
  function S() {
    const e = window.gameBlocks || k || [];
    if (!e || e.length === 0) return;
    const o = [
      16739179,
      5164484,
      16770669
    ], i = 16777215;
    e.forEach((n) => {
      if (n.cubes && n.cubes.length > 0) {
        const r = n.cubes[0];
        if (r && r.material) {
          const l = d ? o[n.length - 1] || o[0] : i, a = o[n.length - 1] || o[0];
          r.material.color.setHex(l), n.updateBlockColor && n.updateBlockColor(l, a);
        }
      }
    });
  }
  function h() {
    if (x) return;
    x = true;
    const e = document.getElementById("theme-toggle"), o = document.getElementById("colors-toggle"), i = document.getElementById("settings-toggle"), n = document.getElementById("settings-menu"), r = document.getElementById("settings-container"), l = document.getElementById("quality-toggle"), a = document.getElementById("quality-label");
    if (console.log("Setting up toggle handlers...", {
      themeToggle: e,
      colorsToggle: o,
      settingsToggle: i
    }), !e || !o || !i) {
      console.warn("Toggle buttons not found, retrying...", {
        themeToggle: e,
        colorsToggle: o,
        settingsToggle: i
      }), x = false, setTimeout(h, 100);
      return;
    }
    if (i && n && i.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), n.classList.toggle("show");
    }), r && n) {
      const t = function(u) {
        r.contains(u.target) || n.classList.remove("show");
      };
      document.addEventListener("click", t);
      const s = document.querySelector("canvas");
      s && (s.addEventListener("mousedown", function(u) {
        n.classList.remove("show");
      }), s.addEventListener("touchstart", function(u) {
        n.classList.remove("show");
      }, {
        passive: true
      }));
    }
    e.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), console.log("Theme toggle clicked, current state:", g), g = !g, B(), L();
    }), o.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), console.log("Colors toggle clicked, current state:", d), d = !d, window.useColoredBlocksDefault = d, P(), S(), L();
    });
    const f = document.getElementById("audio-toggle"), w = document.getElementById("audio-icon");
    function p() {
      if (!f || !w) return;
      (window.isAudioEnabled ? window.isAudioEnabled() : true) ? (w.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>', f.classList.add("active")) : (w.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M23 9l-6 6M17 9l6 6"></path>', f.classList.remove("active"));
    }
    f && (p(), f.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), window.toggleAudio && (window.toggleAudio(), p());
    }));
    function b() {
      a && (a.textContent = c === "performance" ? "PERF" : c === "battery" ? "BATT" : "BAL", l && l.classList.add("active"));
    }
    function v() {
      const t = (window.jarrowsVersion || "").toString().trim(), s = (window.jarrowsGitSha || "").toString().trim();
      return t ? `v${t}` + (s ? ` @ ${s}` : "") : s ? `commit ${s}` : "v\u2014";
    }
    function _() {
      const t = document.getElementById("settings-version");
      t && (t.textContent = v());
    }
    l && l.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), c = c === "balanced" ? "performance" : c === "performance" ? "battery" : "balanced", window.jarrowsQualityPreset = c, b(), L(), typeof window.applyQualityPreset == "function" && window.applyQualityPreset(c);
    });
    const E = document.getElementById("ver-toggle");
    E && (E.classList.add("active"), E.addEventListener("click", function(t) {
      t.preventDefault(), t.stopPropagation(), n && n.classList.remove("show");
      const s = document.getElementById("ver-modal"), u = document.getElementById("ver-modal-value");
      u && (u.textContent = v()), s && (s.style.display = "flex");
    }));
    const m = document.getElementById("ver-modal"), C = document.getElementById("ver-modal-ok"), M = document.getElementById("ver-modal-close-x"), y = document.getElementById("ver-modal-copy");
    function I() {
      m && (m.style.display = "none");
    }
    C && C.addEventListener("click", I), M && M.addEventListener("click", I), m && m.addEventListener("click", function(t) {
      t.target === m && I();
    }), y && y.addEventListener("click", async function() {
      const t = v();
      try {
        await navigator.clipboard.writeText(t), y.textContent = "Copied", setTimeout(() => {
          y.textContent = "Copy";
        }, 900);
      } catch {
      }
    }), B(), P(), p(), b(), _(), S(), console.log("Toggle handlers setup complete");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", h) : h();
  function A() {
    window.gameScene ? (k = window.gameBlocks || k, h()) : setTimeout(A, 100);
  }
  setTimeout(A, 100);
  (function() {
    try {
      const o = "jarrows_seen_quality_notice_v1";
      if (localStorage.getItem(o) === "1") return;
      const i = document.getElementById("quality-preset-modal"), n = document.getElementById("quality-modal-ok");
      if (!i || !n) return;
      i.style.display = "flex", n.addEventListener("click", () => {
        i.style.display = "none", localStorage.setItem(o, "1");
      });
    } catch {
    }
  })();
})();
