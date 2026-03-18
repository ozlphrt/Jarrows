const h = "modulepreload", p = function(c) {
  return "/Jarrows/preview/" + c;
}, a = {}, E = function(u, s, v) {
  let i = Promise.resolve();
  if (s && s.length > 0) {
    document.getElementsByTagName("link");
    const n = document.querySelector("meta[property=csp-nonce]"), e = (n == null ? void 0 : n.nonce) || (n == null ? void 0 : n.getAttribute("nonce"));
    i = Promise.allSettled(s.map((t) => {
      if (t = p(t), t in a) return;
      a[t] = true;
      const o = t.endsWith(".css"), d = o ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${t}"]${d}`)) return;
      const r = document.createElement("link");
      if (r.rel = o ? "stylesheet" : h, o || (r.as = "script"), r.crossOrigin = "", r.href = t, e && r.setAttribute("nonce", e), document.head.appendChild(r), o) return new Promise((f, m) => {
        r.addEventListener("load", f), r.addEventListener("error", () => m(new Error(`Unable to preload CSS for ${t}`)));
      });
    }));
  }
  function l(n) {
    const e = new Event("vite:preloadError", { cancelable: true });
    if (e.payload = n, window.dispatchEvent(e), !e.defaultPrevented) throw n;
  }
  return i.then((n) => {
    for (const e of n || []) e.status === "rejected" && l(e.reason);
    return u().catch(l);
  });
};
export {
  E as _
};
