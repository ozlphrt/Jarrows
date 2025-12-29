import { c as um, d as dm, i as dr, a as fm, r as pm, b as mm, h as gm, u as _m, _ as xm, e as vm, __tla as __tla_0 } from "./physics-D0uT6tGR.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  (function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
    new MutationObserver((i) => {
      for (const s of i) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && n(o);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function e(i) {
      const s = {};
      return i.integrity && (s.integrity = i.integrity), i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? s.credentials = "include" : i.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
    }
    function n(i) {
      if (i.ep) return;
      i.ep = true;
      const s = e(i);
      fetch(i.href, s);
    }
  })();
  const xa = "164", ym = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2
  }, Mm = {
    ROTATE: 0,
    PAN: 1,
    DOLLY_PAN: 2,
    DOLLY_ROTATE: 3
  }, Td = 0, kl = 1, Ad = 2, Sm = 3, bm = 0, Lc = 1, Dc = 2, An = 3, Zn = 0, Ve = 1, Xe = 2, Wn = 0, Gi = 1, Vl = 2, Hl = 3, Gl = 4, Ed = 5, fi = 100, Cd = 101, Rd = 102, Pd = 103, Id = 104, Ld = 200, Dd = 201, Ud = 202, Nd = 203, aa = 204, la = 205, Od = 206, zd = 207, Fd = 208, Bd = 209, kd = 210, Vd = 211, Hd = 212, Gd = 213, Wd = 214, Xd = 0, Yd = 1, qd = 2, br = 3, $d = 4, Zd = 5, Jd = 6, Kd = 7, Yr = 0, Qd = 1, jd = 2, Xn = 0, tf = 1, ef = 2, nf = 3, sf = 4, rf = 5, of = 6, af = 7, Wl = "attached", lf = "detached", va = 300, Jn = 301, _i = 302, Ns = 303, wr = 304, Vs = 306, Tr = 1e3, dn = 1001, Ar = 1002, we = 1003, Uc = 1004, wm = 1004, Es = 1005, Tm = 1005, xe = 1006, gr = 1007, Am = 1007, Cn = 1008, Em = 1008, Kn = 1009, cf = 1010, hf = 1011, Nc = 1012, Oc = 1013, $i = 1014, fn = 1015, qr = 1016, zc = 1017, Fc = 1018, Hs = 1020, uf = 35902, df = 1021, ff = 1022, nn = 1023, pf = 1024, mf = 1025, Wi = 1026, Os = 1027, Bc = 1028, kc = 1029, gf = 1030, Vc = 1031, Hc = 1033, ta = 33776, ea = 33777, na = 33778, ia = 33779, Xl = 35840, Yl = 35841, ql = 35842, $l = 35843, Zl = 36196, Jl = 37492, Kl = 37496, Ql = 37808, jl = 37809, tc = 37810, ec = 37811, nc = 37812, ic = 37813, sc = 37814, rc = 37815, oc = 37816, ac = 37817, lc = 37818, cc = 37819, hc = 37820, uc = 37821, sa = 36492, dc = 36494, fc = 36495, _f = 36283, pc = 36284, mc = 36285, gc = 36286, xf = 2200, vf = 2201, yf = 2202, Er = 2300, Cr = 2301, ra = 2302, Bi = 2400, ki = 2401, Rr = 2402, ya = 2500, Gc = 2501, Cm = 0, Rm = 1, Pm = 2, Mf = 3200, Sf = 3201, vi = 0, bf = 1, Vn = "", un = "srgb", ti = "srgb-linear", Ma = "display-p3", $r = "display-p3-linear", Pr = "linear", re = "srgb", Ir = "rec709", Lr = "p3", Im = 0, Oi = 7680, Lm = 7681, Dm = 7682, Um = 7683, Nm = 34055, Om = 34056, zm = 5386, Fm = 512, Bm = 513, km = 514, Vm = 515, Hm = 516, Gm = 517, Wm = 518, _c = 519, wf = 512, Tf = 513, Af = 514, Wc = 515, Ef = 516, Cf = 517, Rf = 518, Pf = 519, Dr = 35044, Xm = 35048, Ym = 35040, qm = 35045, $m = 35049, Zm = 35041, Jm = 35046, Km = 35050, Qm = 35042, jm = "100", xc = "300 es", Rn = 2e3, Ur = 2001;
  class ei {
    addEventListener(t, e) {
      this._listeners === void 0 && (this._listeners = {});
      const n = this._listeners;
      n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
    }
    hasEventListener(t, e) {
      if (this._listeners === void 0) return false;
      const n = this._listeners;
      return n[t] !== void 0 && n[t].indexOf(e) !== -1;
    }
    removeEventListener(t, e) {
      if (this._listeners === void 0) return;
      const i = this._listeners[t];
      if (i !== void 0) {
        const s = i.indexOf(e);
        s !== -1 && i.splice(s, 1);
      }
    }
    dispatchEvent(t) {
      if (this._listeners === void 0) return;
      const n = this._listeners[t.type];
      if (n !== void 0) {
        t.target = this;
        const i = n.slice(0);
        for (let s = 0, o = i.length; s < o; s++) i[s].call(this, t);
        t.target = null;
      }
    }
  }
  const Pe = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff"
  ];
  let Uh = 1234567;
  const Xi = Math.PI / 180, zs = 180 / Math.PI;
  function sn() {
    const r = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
    return (Pe[r & 255] + Pe[r >> 8 & 255] + Pe[r >> 16 & 255] + Pe[r >> 24 & 255] + "-" + Pe[t & 255] + Pe[t >> 8 & 255] + "-" + Pe[t >> 16 & 15 | 64] + Pe[t >> 24 & 255] + "-" + Pe[e & 63 | 128] + Pe[e >> 8 & 255] + "-" + Pe[e >> 16 & 255] + Pe[e >> 24 & 255] + Pe[n & 255] + Pe[n >> 8 & 255] + Pe[n >> 16 & 255] + Pe[n >> 24 & 255]).toLowerCase();
  }
  function de(r, t, e) {
    return Math.max(t, Math.min(e, r));
  }
  function Xc(r, t) {
    return (r % t + t) % t;
  }
  function tg(r, t, e, n, i) {
    return n + (r - t) * (i - n) / (e - t);
  }
  function eg(r, t, e) {
    return r !== t ? (e - r) / (t - r) : 0;
  }
  function _r(r, t, e) {
    return (1 - e) * r + e * t;
  }
  function ng(r, t, e, n) {
    return _r(r, t, 1 - Math.exp(-e * n));
  }
  function ig(r, t = 1) {
    return t - Math.abs(Xc(r, t * 2) - t);
  }
  function sg(r, t, e) {
    return r <= t ? 0 : r >= e ? 1 : (r = (r - t) / (e - t), r * r * (3 - 2 * r));
  }
  function rg(r, t, e) {
    return r <= t ? 0 : r >= e ? 1 : (r = (r - t) / (e - t), r * r * r * (r * (r * 6 - 15) + 10));
  }
  function og(r, t) {
    return r + Math.floor(Math.random() * (t - r + 1));
  }
  function ag(r, t) {
    return r + Math.random() * (t - r);
  }
  function lg(r) {
    return r * (0.5 - Math.random());
  }
  function cg(r) {
    r !== void 0 && (Uh = r);
    let t = Uh += 1831565813;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function hg(r) {
    return r * Xi;
  }
  function ug(r) {
    return r * zs;
  }
  function dg(r) {
    return (r & r - 1) === 0 && r !== 0;
  }
  function fg(r) {
    return Math.pow(2, Math.ceil(Math.log(r) / Math.LN2));
  }
  function pg(r) {
    return Math.pow(2, Math.floor(Math.log(r) / Math.LN2));
  }
  function mg(r, t, e, n, i) {
    const s = Math.cos, o = Math.sin, a = s(e / 2), l = o(e / 2), c = s((t + n) / 2), h = o((t + n) / 2), d = s((t - n) / 2), u = o((t - n) / 2), f = s((n - t) / 2), m = o((n - t) / 2);
    switch (i) {
      case "XYX":
        r.set(a * h, l * d, l * u, a * c);
        break;
      case "YZY":
        r.set(l * u, a * h, l * d, a * c);
        break;
      case "ZXZ":
        r.set(l * d, l * u, a * h, a * c);
        break;
      case "XZX":
        r.set(a * h, l * m, l * f, a * c);
        break;
      case "YXY":
        r.set(l * f, a * h, l * m, a * c);
        break;
      case "ZYZ":
        r.set(l * m, l * f, a * h, a * c);
        break;
      default:
        console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
    }
  }
  function ke(r, t) {
    switch (t.constructor) {
      case Float32Array:
        return r;
      case Uint32Array:
        return r / 4294967295;
      case Uint16Array:
        return r / 65535;
      case Uint8Array:
        return r / 255;
      case Int32Array:
        return Math.max(r / 2147483647, -1);
      case Int16Array:
        return Math.max(r / 32767, -1);
      case Int8Array:
        return Math.max(r / 127, -1);
      default:
        throw new Error("Invalid component type.");
    }
  }
  function kt(r, t) {
    switch (t.constructor) {
      case Float32Array:
        return r;
      case Uint32Array:
        return Math.round(r * 4294967295);
      case Uint16Array:
        return Math.round(r * 65535);
      case Uint8Array:
        return Math.round(r * 255);
      case Int32Array:
        return Math.round(r * 2147483647);
      case Int16Array:
        return Math.round(r * 32767);
      case Int8Array:
        return Math.round(r * 127);
      default:
        throw new Error("Invalid component type.");
    }
  }
  const gg = {
    DEG2RAD: Xi,
    RAD2DEG: zs,
    generateUUID: sn,
    clamp: de,
    euclideanModulo: Xc,
    mapLinear: tg,
    inverseLerp: eg,
    lerp: _r,
    damp: ng,
    pingpong: ig,
    smoothstep: sg,
    smootherstep: rg,
    randInt: og,
    randFloat: ag,
    randFloatSpread: lg,
    seededRandom: cg,
    degToRad: hg,
    radToDeg: ug,
    isPowerOfTwo: dg,
    ceilPowerOfTwo: fg,
    floorPowerOfTwo: pg,
    setQuaternionFromProperEuler: mg,
    normalize: kt,
    denormalize: ke
  };
  class et {
    constructor(t = 0, e = 0) {
      et.prototype.isVector2 = true, this.x = t, this.y = e;
    }
    get width() {
      return this.x;
    }
    set width(t) {
      this.x = t;
    }
    get height() {
      return this.y;
    }
    set height(t) {
      this.y = t;
    }
    set(t, e) {
      return this.x = t, this.y = e, this;
    }
    setScalar(t) {
      return this.x = t, this.y = t, this;
    }
    setX(t) {
      return this.x = t, this;
    }
    setY(t) {
      return this.y = t, this;
    }
    setComponent(t, e) {
      switch (t) {
        case 0:
          this.x = e;
          break;
        case 1:
          this.y = e;
          break;
        default:
          throw new Error("index is out of range: " + t);
      }
      return this;
    }
    getComponent(t) {
      switch (t) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + t);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this;
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this;
    }
    addVectors(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this;
    }
    addScaledVector(t, e) {
      return this.x += t.x * e, this.y += t.y * e, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this;
    }
    subVectors(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this;
    }
    multiply(t) {
      return this.x *= t.x, this.y *= t.y, this;
    }
    multiplyScalar(t) {
      return this.x *= t, this.y *= t, this;
    }
    divide(t) {
      return this.x /= t.x, this.y /= t.y, this;
    }
    divideScalar(t) {
      return this.multiplyScalar(1 / t);
    }
    applyMatrix3(t) {
      const e = this.x, n = this.y, i = t.elements;
      return this.x = i[0] * e + i[3] * n + i[6], this.y = i[1] * e + i[4] * n + i[7], this;
    }
    min(t) {
      return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
    }
    max(t) {
      return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
    }
    clamp(t, e) {
      return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this;
    }
    clampScalar(t, e) {
      return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this;
    }
    clampLength(t, e) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y;
    }
    cross(t) {
      return this.x * t.y - this.y * t.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(t) {
      const e = Math.sqrt(this.lengthSq() * t.lengthSq());
      if (e === 0) return Math.PI / 2;
      const n = this.dot(t) / e;
      return Math.acos(de(n, -1, 1));
    }
    distanceTo(t) {
      return Math.sqrt(this.distanceToSquared(t));
    }
    distanceToSquared(t) {
      const e = this.x - t.x, n = this.y - t.y;
      return e * e + n * n;
    }
    manhattanDistanceTo(t) {
      return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
    }
    setLength(t) {
      return this.normalize().multiplyScalar(t);
    }
    lerp(t, e) {
      return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
    }
    lerpVectors(t, e, n) {
      return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
    }
    equals(t) {
      return t.x === this.x && t.y === this.y;
    }
    fromArray(t, e = 0) {
      return this.x = t[e], this.y = t[e + 1], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this.x, t[e + 1] = this.y, t;
    }
    fromBufferAttribute(t, e) {
      return this.x = t.getX(e), this.y = t.getY(e), this;
    }
    rotateAround(t, e) {
      const n = Math.cos(e), i = Math.sin(e), s = this.x - t.x, o = this.y - t.y;
      return this.x = s * n - o * i + t.x, this.y = s * i + o * n + t.y, this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  }
  class Bt {
    constructor(t, e, n, i, s, o, a, l, c) {
      Bt.prototype.isMatrix3 = true, this.elements = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ], t !== void 0 && this.set(t, e, n, i, s, o, a, l, c);
    }
    set(t, e, n, i, s, o, a, l, c) {
      const h = this.elements;
      return h[0] = t, h[1] = i, h[2] = a, h[3] = e, h[4] = s, h[5] = l, h[6] = n, h[7] = o, h[8] = c, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
    }
    copy(t) {
      const e = this.elements, n = t.elements;
      return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
    }
    extractBasis(t, e, n) {
      return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
    }
    setFromMatrix4(t) {
      const e = t.elements;
      return this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this;
    }
    multiply(t) {
      return this.multiplyMatrices(this, t);
    }
    premultiply(t) {
      return this.multiplyMatrices(t, this);
    }
    multiplyMatrices(t, e) {
      const n = t.elements, i = e.elements, s = this.elements, o = n[0], a = n[3], l = n[6], c = n[1], h = n[4], d = n[7], u = n[2], f = n[5], m = n[8], _ = i[0], g = i[3], p = i[6], v = i[1], x = i[4], S = i[7], P = i[2], b = i[5], T = i[8];
      return s[0] = o * _ + a * v + l * P, s[3] = o * g + a * x + l * b, s[6] = o * p + a * S + l * T, s[1] = c * _ + h * v + d * P, s[4] = c * g + h * x + d * b, s[7] = c * p + h * S + d * T, s[2] = u * _ + f * v + m * P, s[5] = u * g + f * x + m * b, s[8] = u * p + f * S + m * T, this;
    }
    multiplyScalar(t) {
      const e = this.elements;
      return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
    }
    determinant() {
      const t = this.elements, e = t[0], n = t[1], i = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8];
      return e * o * h - e * a * c - n * s * h + n * a * l + i * s * c - i * o * l;
    }
    invert() {
      const t = this.elements, e = t[0], n = t[1], i = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8], d = h * o - a * c, u = a * l - h * s, f = c * s - o * l, m = e * d + n * u + i * f;
      if (m === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const _ = 1 / m;
      return t[0] = d * _, t[1] = (i * c - h * n) * _, t[2] = (a * n - i * o) * _, t[3] = u * _, t[4] = (h * e - i * l) * _, t[5] = (i * s - a * e) * _, t[6] = f * _, t[7] = (n * l - c * e) * _, t[8] = (o * e - n * s) * _, this;
    }
    transpose() {
      let t;
      const e = this.elements;
      return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
    }
    getNormalMatrix(t) {
      return this.setFromMatrix4(t).invert().transpose();
    }
    transposeIntoArray(t) {
      const e = this.elements;
      return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
    }
    setUvTransform(t, e, n, i, s, o, a) {
      const l = Math.cos(s), c = Math.sin(s);
      return this.set(n * l, n * c, -n * (l * o + c * a) + o + t, -i * c, i * l, -i * (-c * o + l * a) + a + e, 0, 0, 1), this;
    }
    scale(t, e) {
      return this.premultiply(Qa.makeScale(t, e)), this;
    }
    rotate(t) {
      return this.premultiply(Qa.makeRotation(-t)), this;
    }
    translate(t, e) {
      return this.premultiply(Qa.makeTranslation(t, e)), this;
    }
    makeTranslation(t, e) {
      return t.isVector2 ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1) : this.set(1, 0, t, 0, 1, e, 0, 0, 1), this;
    }
    makeRotation(t) {
      const e = Math.cos(t), n = Math.sin(t);
      return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this;
    }
    makeScale(t, e) {
      return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this;
    }
    equals(t) {
      const e = this.elements, n = t.elements;
      for (let i = 0; i < 9; i++) if (e[i] !== n[i]) return false;
      return true;
    }
    fromArray(t, e = 0) {
      for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
      return this;
    }
    toArray(t = [], e = 0) {
      const n = this.elements;
      return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  }
  const Qa = new Bt();
  function If(r) {
    for (let t = r.length - 1; t >= 0; --t) if (r[t] >= 65535) return true;
    return false;
  }
  const _g = {
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  };
  function Cs(r, t) {
    return new _g[r](t);
  }
  function Nr(r) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", r);
  }
  function Lf() {
    const r = Nr("canvas");
    return r.style.display = "block", r;
  }
  const Nh = {};
  function Df(r) {
    r in Nh || (Nh[r] = true, console.warn(r));
  }
  const Oh = new Bt().set(0.8224621, 0.177538, 0, 0.0331941, 0.9668058, 0, 0.0170827, 0.0723974, 0.9105199), zh = new Bt().set(1.2249401, -0.2249404, 0, -0.0420569, 1.0420571, 0, -0.0196376, -0.0786361, 1.0982735), oo = {
    [ti]: {
      transfer: Pr,
      primaries: Ir,
      toReference: (r) => r,
      fromReference: (r) => r
    },
    [un]: {
      transfer: re,
      primaries: Ir,
      toReference: (r) => r.convertSRGBToLinear(),
      fromReference: (r) => r.convertLinearToSRGB()
    },
    [$r]: {
      transfer: Pr,
      primaries: Lr,
      toReference: (r) => r.applyMatrix3(zh),
      fromReference: (r) => r.applyMatrix3(Oh)
    },
    [Ma]: {
      transfer: re,
      primaries: Lr,
      toReference: (r) => r.convertSRGBToLinear().applyMatrix3(zh),
      fromReference: (r) => r.applyMatrix3(Oh).convertLinearToSRGB()
    }
  }, xg = /* @__PURE__ */ new Set([
    ti,
    $r
  ]), ne = {
    enabled: true,
    _workingColorSpace: ti,
    get workingColorSpace() {
      return this._workingColorSpace;
    },
    set workingColorSpace(r) {
      if (!xg.has(r)) throw new Error(`Unsupported working color space, "${r}".`);
      this._workingColorSpace = r;
    },
    convert: function(r, t, e) {
      if (this.enabled === false || t === e || !t || !e) return r;
      const n = oo[t].toReference, i = oo[e].fromReference;
      return i(n(r));
    },
    fromWorkingColorSpace: function(r, t) {
      return this.convert(r, this._workingColorSpace, t);
    },
    toWorkingColorSpace: function(r, t) {
      return this.convert(r, t, this._workingColorSpace);
    },
    getPrimaries: function(r) {
      return oo[r].primaries;
    },
    getTransfer: function(r) {
      return r === Vn ? Pr : oo[r].transfer;
    }
  };
  function Is(r) {
    return r < 0.04045 ? r * 0.0773993808 : Math.pow(r * 0.9478672986 + 0.0521327014, 2.4);
  }
  function ja(r) {
    return r < 31308e-7 ? r * 12.92 : 1.055 * Math.pow(r, 0.41666) - 0.055;
  }
  let ss;
  class Uf {
    static getDataURL(t) {
      if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u") return t.src;
      let e;
      if (t instanceof HTMLCanvasElement) e = t;
      else {
        ss === void 0 && (ss = Nr("canvas")), ss.width = t.width, ss.height = t.height;
        const n = ss.getContext("2d");
        t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = ss;
      }
      return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", 0.6)) : e.toDataURL("image/png");
    }
    static sRGBToLinear(t) {
      if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
        const e = Nr("canvas");
        e.width = t.width, e.height = t.height;
        const n = e.getContext("2d");
        n.drawImage(t, 0, 0, t.width, t.height);
        const i = n.getImageData(0, 0, t.width, t.height), s = i.data;
        for (let o = 0; o < s.length; o++) s[o] = Is(s[o] / 255) * 255;
        return n.putImageData(i, 0, 0), e;
      } else if (t.data) {
        const e = t.data.slice(0);
        for (let n = 0; n < e.length; n++) e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(Is(e[n] / 255) * 255) : e[n] = Is(e[n]);
        return {
          data: e,
          width: t.width,
          height: t.height
        };
      } else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
    }
  }
  let vg = 0;
  class Vi {
    constructor(t = null) {
      this.isSource = true, Object.defineProperty(this, "id", {
        value: vg++
      }), this.uuid = sn(), this.data = t, this.dataReady = true, this.version = 0;
    }
    set needsUpdate(t) {
      t === true && this.version++;
    }
    toJSON(t) {
      const e = t === void 0 || typeof t == "string";
      if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid];
      const n = {
        uuid: this.uuid,
        url: ""
      }, i = this.data;
      if (i !== null) {
        let s;
        if (Array.isArray(i)) {
          s = [];
          for (let o = 0, a = i.length; o < a; o++) i[o].isDataTexture ? s.push(tl(i[o].image)) : s.push(tl(i[o]));
        } else s = tl(i);
        n.url = s;
      }
      return e || (t.images[this.uuid] = n), n;
    }
  }
  function tl(r) {
    return typeof HTMLImageElement < "u" && r instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && r instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && r instanceof ImageBitmap ? Uf.getDataURL(r) : r.data ? {
      data: Array.from(r.data),
      width: r.width,
      height: r.height,
      type: r.data.constructor.name
    } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
  }
  let yg = 0;
  class fe extends ei {
    constructor(t = fe.DEFAULT_IMAGE, e = fe.DEFAULT_MAPPING, n = dn, i = dn, s = xe, o = Cn, a = nn, l = Kn, c = fe.DEFAULT_ANISOTROPY, h = Vn) {
      super(), this.isTexture = true, Object.defineProperty(this, "id", {
        value: yg++
      }), this.uuid = sn(), this.name = "", this.source = new Vi(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = i, this.magFilter = s, this.minFilter = o, this.anisotropy = c, this.format = a, this.internalFormat = null, this.type = l, this.offset = new et(0, 0), this.repeat = new et(1, 1), this.center = new et(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new Bt(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = false, this.pmremVersion = 0;
    }
    get image() {
      return this.source.data;
    }
    set image(t = null) {
      this.source.data = t;
    }
    updateMatrix() {
      this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = true, this;
    }
    toJSON(t) {
      const e = t === void 0 || typeof t == "string";
      if (!e && t.textures[this.uuid] !== void 0) return t.textures[this.uuid];
      const n = {
        metadata: {
          version: 4.6,
          type: "Texture",
          generator: "Texture.toJSON"
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(t).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [
          this.repeat.x,
          this.repeat.y
        ],
        offset: [
          this.offset.x,
          this.offset.y
        ],
        center: [
          this.center.x,
          this.center.y
        ],
        rotation: this.rotation,
        wrap: [
          this.wrapS,
          this.wrapT
        ],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment
      };
      return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
    transformUv(t) {
      if (this.mapping !== va) return t;
      if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1) switch (this.wrapS) {
        case Tr:
          t.x = t.x - Math.floor(t.x);
          break;
        case dn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Ar:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
      if (t.y < 0 || t.y > 1) switch (this.wrapT) {
        case Tr:
          t.y = t.y - Math.floor(t.y);
          break;
        case dn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Ar:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
      return this.flipY && (t.y = 1 - t.y), t;
    }
    set needsUpdate(t) {
      t === true && (this.version++, this.source.needsUpdate = true);
    }
    set needsPMREMUpdate(t) {
      t === true && this.pmremVersion++;
    }
  }
  fe.DEFAULT_IMAGE = null;
  fe.DEFAULT_MAPPING = va;
  fe.DEFAULT_ANISOTROPY = 1;
  class ie {
    constructor(t = 0, e = 0, n = 0, i = 1) {
      ie.prototype.isVector4 = true, this.x = t, this.y = e, this.z = n, this.w = i;
    }
    get width() {
      return this.z;
    }
    set width(t) {
      this.z = t;
    }
    get height() {
      return this.w;
    }
    set height(t) {
      this.w = t;
    }
    set(t, e, n, i) {
      return this.x = t, this.y = e, this.z = n, this.w = i, this;
    }
    setScalar(t) {
      return this.x = t, this.y = t, this.z = t, this.w = t, this;
    }
    setX(t) {
      return this.x = t, this;
    }
    setY(t) {
      return this.y = t, this;
    }
    setZ(t) {
      return this.z = t, this;
    }
    setW(t) {
      return this.w = t, this;
    }
    setComponent(t, e) {
      switch (t) {
        case 0:
          this.x = e;
          break;
        case 1:
          this.y = e;
          break;
        case 2:
          this.z = e;
          break;
        case 3:
          this.w = e;
          break;
        default:
          throw new Error("index is out of range: " + t);
      }
      return this;
    }
    getComponent(t) {
      switch (t) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + t);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this.z += t, this.w += t, this;
    }
    addVectors(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
    }
    addScaledVector(t, e) {
      return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
    }
    subVectors(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
    }
    multiply(t) {
      return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
    }
    multiplyScalar(t) {
      return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
    }
    applyMatrix4(t) {
      const e = this.x, n = this.y, i = this.z, s = this.w, o = t.elements;
      return this.x = o[0] * e + o[4] * n + o[8] * i + o[12] * s, this.y = o[1] * e + o[5] * n + o[9] * i + o[13] * s, this.z = o[2] * e + o[6] * n + o[10] * i + o[14] * s, this.w = o[3] * e + o[7] * n + o[11] * i + o[15] * s, this;
    }
    divideScalar(t) {
      return this.multiplyScalar(1 / t);
    }
    setAxisAngleFromQuaternion(t) {
      this.w = 2 * Math.acos(t.w);
      const e = Math.sqrt(1 - t.w * t.w);
      return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
    }
    setAxisAngleFromRotationMatrix(t) {
      let e, n, i, s;
      const l = t.elements, c = l[0], h = l[4], d = l[8], u = l[1], f = l[5], m = l[9], _ = l[2], g = l[6], p = l[10];
      if (Math.abs(h - u) < 0.01 && Math.abs(d - _) < 0.01 && Math.abs(m - g) < 0.01) {
        if (Math.abs(h + u) < 0.1 && Math.abs(d + _) < 0.1 && Math.abs(m + g) < 0.1 && Math.abs(c + f + p - 3) < 0.1) return this.set(1, 0, 0, 0), this;
        e = Math.PI;
        const x = (c + 1) / 2, S = (f + 1) / 2, P = (p + 1) / 2, b = (h + u) / 4, T = (d + _) / 4, E = (m + g) / 4;
        return x > S && x > P ? x < 0.01 ? (n = 0, i = 0.707106781, s = 0.707106781) : (n = Math.sqrt(x), i = b / n, s = T / n) : S > P ? S < 0.01 ? (n = 0.707106781, i = 0, s = 0.707106781) : (i = Math.sqrt(S), n = b / i, s = E / i) : P < 0.01 ? (n = 0.707106781, i = 0.707106781, s = 0) : (s = Math.sqrt(P), n = T / s, i = E / s), this.set(n, i, s, e), this;
      }
      let v = Math.sqrt((g - m) * (g - m) + (d - _) * (d - _) + (u - h) * (u - h));
      return Math.abs(v) < 1e-3 && (v = 1), this.x = (g - m) / v, this.y = (d - _) / v, this.z = (u - h) / v, this.w = Math.acos((c + f + p - 1) / 2), this;
    }
    min(t) {
      return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
    }
    max(t) {
      return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
    }
    clamp(t, e) {
      return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this.w = Math.max(t.w, Math.min(e.w, this.w)), this;
    }
    clampScalar(t, e) {
      return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this.w = Math.max(t, Math.min(e, this.w)), this;
    }
    clampLength(t, e) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(t) {
      return this.normalize().multiplyScalar(t);
    }
    lerp(t, e) {
      return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
    }
    lerpVectors(t, e, n) {
      return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
    }
    equals(t) {
      return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
    }
    fromArray(t, e = 0) {
      return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
    }
    fromBufferAttribute(t, e) {
      return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  }
  class Nf extends ei {
    constructor(t = 1, e = 1, n = {}) {
      super(), this.isRenderTarget = true, this.width = t, this.height = e, this.depth = 1, this.scissor = new ie(0, 0, t, e), this.scissorTest = false, this.viewport = new ie(0, 0, t, e);
      const i = {
        width: t,
        height: e,
        depth: 1
      };
      n = Object.assign({
        generateMipmaps: false,
        internalFormat: null,
        minFilter: xe,
        depthBuffer: true,
        stencilBuffer: false,
        resolveDepthBuffer: true,
        resolveStencilBuffer: true,
        depthTexture: null,
        samples: 0,
        count: 1
      }, n);
      const s = new fe(i, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
      s.flipY = false, s.generateMipmaps = n.generateMipmaps, s.internalFormat = n.internalFormat, this.textures = [];
      const o = n.count;
      for (let a = 0; a < o; a++) this.textures[a] = s.clone(), this.textures[a].isRenderTargetTexture = true;
      this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.depthTexture = n.depthTexture, this.samples = n.samples;
    }
    get texture() {
      return this.textures[0];
    }
    set texture(t) {
      this.textures[0] = t;
    }
    setSize(t, e, n = 1) {
      if (this.width !== t || this.height !== e || this.depth !== n) {
        this.width = t, this.height = e, this.depth = n;
        for (let i = 0, s = this.textures.length; i < s; i++) this.textures[i].image.width = t, this.textures[i].image.height = e, this.textures[i].image.depth = n;
        this.dispose();
      }
      this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.textures.length = 0;
      for (let n = 0, i = t.textures.length; n < i; n++) this.textures[n] = t.textures[n].clone(), this.textures[n].isRenderTargetTexture = true;
      const e = Object.assign({}, t.texture.image);
      return this.texture.source = new Vi(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
  }
  class Mn extends Nf {
    constructor(t = 1, e = 1, n = {}) {
      super(t, e, n), this.isWebGLRenderTarget = true;
    }
  }
  class Sa extends fe {
    constructor(t = null, e = 1, n = 1, i = 1) {
      super(null), this.isDataArrayTexture = true, this.image = {
        data: t,
        width: e,
        height: n,
        depth: i
      }, this.magFilter = we, this.minFilter = we, this.wrapR = dn, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  }
  class Mg extends Mn {
    constructor(t = 1, e = 1, n = 1, i = {}) {
      super(t, e, i), this.isWebGLArrayRenderTarget = true, this.depth = n, this.texture = new Sa(null, t, e, n), this.texture.isRenderTargetTexture = true;
    }
  }
  class Yc extends fe {
    constructor(t = null, e = 1, n = 1, i = 1) {
      super(null), this.isData3DTexture = true, this.image = {
        data: t,
        width: e,
        height: n,
        depth: i
      }, this.magFilter = we, this.minFilter = we, this.wrapR = dn, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  }
  class Sg extends Mn {
    constructor(t = 1, e = 1, n = 1, i = {}) {
      super(t, e, i), this.isWebGL3DRenderTarget = true, this.depth = n, this.texture = new Yc(null, t, e, n), this.texture.isRenderTargetTexture = true;
    }
  }
  class qe {
    constructor(t = 0, e = 0, n = 0, i = 1) {
      this.isQuaternion = true, this._x = t, this._y = e, this._z = n, this._w = i;
    }
    static slerpFlat(t, e, n, i, s, o, a) {
      let l = n[i + 0], c = n[i + 1], h = n[i + 2], d = n[i + 3];
      const u = s[o + 0], f = s[o + 1], m = s[o + 2], _ = s[o + 3];
      if (a === 0) {
        t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
        return;
      }
      if (a === 1) {
        t[e + 0] = u, t[e + 1] = f, t[e + 2] = m, t[e + 3] = _;
        return;
      }
      if (d !== _ || l !== u || c !== f || h !== m) {
        let g = 1 - a;
        const p = l * u + c * f + h * m + d * _, v = p >= 0 ? 1 : -1, x = 1 - p * p;
        if (x > Number.EPSILON) {
          const P = Math.sqrt(x), b = Math.atan2(P, p * v);
          g = Math.sin(g * b) / P, a = Math.sin(a * b) / P;
        }
        const S = a * v;
        if (l = l * g + u * S, c = c * g + f * S, h = h * g + m * S, d = d * g + _ * S, g === 1 - a) {
          const P = 1 / Math.sqrt(l * l + c * c + h * h + d * d);
          l *= P, c *= P, h *= P, d *= P;
        }
      }
      t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
    }
    static multiplyQuaternionsFlat(t, e, n, i, s, o) {
      const a = n[i], l = n[i + 1], c = n[i + 2], h = n[i + 3], d = s[o], u = s[o + 1], f = s[o + 2], m = s[o + 3];
      return t[e] = a * m + h * d + l * f - c * u, t[e + 1] = l * m + h * u + c * d - a * f, t[e + 2] = c * m + h * f + a * u - l * d, t[e + 3] = h * m - a * d - l * u - c * f, t;
    }
    get x() {
      return this._x;
    }
    set x(t) {
      this._x = t, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(t) {
      this._y = t, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(t) {
      this._z = t, this._onChangeCallback();
    }
    get w() {
      return this._w;
    }
    set w(t) {
      this._w = t, this._onChangeCallback();
    }
    set(t, e, n, i) {
      return this._x = t, this._y = e, this._z = n, this._w = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(t) {
      return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
    }
    setFromEuler(t, e = true) {
      const n = t._x, i = t._y, s = t._z, o = t._order, a = Math.cos, l = Math.sin, c = a(n / 2), h = a(i / 2), d = a(s / 2), u = l(n / 2), f = l(i / 2), m = l(s / 2);
      switch (o) {
        case "XYZ":
          this._x = u * h * d + c * f * m, this._y = c * f * d - u * h * m, this._z = c * h * m + u * f * d, this._w = c * h * d - u * f * m;
          break;
        case "YXZ":
          this._x = u * h * d + c * f * m, this._y = c * f * d - u * h * m, this._z = c * h * m - u * f * d, this._w = c * h * d + u * f * m;
          break;
        case "ZXY":
          this._x = u * h * d - c * f * m, this._y = c * f * d + u * h * m, this._z = c * h * m + u * f * d, this._w = c * h * d - u * f * m;
          break;
        case "ZYX":
          this._x = u * h * d - c * f * m, this._y = c * f * d + u * h * m, this._z = c * h * m - u * f * d, this._w = c * h * d + u * f * m;
          break;
        case "YZX":
          this._x = u * h * d + c * f * m, this._y = c * f * d + u * h * m, this._z = c * h * m - u * f * d, this._w = c * h * d - u * f * m;
          break;
        case "XZY":
          this._x = u * h * d - c * f * m, this._y = c * f * d - u * h * m, this._z = c * h * m + u * f * d, this._w = c * h * d + u * f * m;
          break;
        default:
          console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + o);
      }
      return e === true && this._onChangeCallback(), this;
    }
    setFromAxisAngle(t, e) {
      const n = e / 2, i = Math.sin(n);
      return this._x = t.x * i, this._y = t.y * i, this._z = t.z * i, this._w = Math.cos(n), this._onChangeCallback(), this;
    }
    setFromRotationMatrix(t) {
      const e = t.elements, n = e[0], i = e[4], s = e[8], o = e[1], a = e[5], l = e[9], c = e[2], h = e[6], d = e[10], u = n + a + d;
      if (u > 0) {
        const f = 0.5 / Math.sqrt(u + 1);
        this._w = 0.25 / f, this._x = (h - l) * f, this._y = (s - c) * f, this._z = (o - i) * f;
      } else if (n > a && n > d) {
        const f = 2 * Math.sqrt(1 + n - a - d);
        this._w = (h - l) / f, this._x = 0.25 * f, this._y = (i + o) / f, this._z = (s + c) / f;
      } else if (a > d) {
        const f = 2 * Math.sqrt(1 + a - n - d);
        this._w = (s - c) / f, this._x = (i + o) / f, this._y = 0.25 * f, this._z = (l + h) / f;
      } else {
        const f = 2 * Math.sqrt(1 + d - n - a);
        this._w = (o - i) / f, this._x = (s + c) / f, this._y = (l + h) / f, this._z = 0.25 * f;
      }
      return this._onChangeCallback(), this;
    }
    setFromUnitVectors(t, e) {
      let n = t.dot(e) + 1;
      return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
    }
    angleTo(t) {
      return 2 * Math.acos(Math.abs(de(this.dot(t), -1, 1)));
    }
    rotateTowards(t, e) {
      const n = this.angleTo(t);
      if (n === 0) return this;
      const i = Math.min(1, e / n);
      return this.slerp(t, i), this;
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
    }
    dot(t) {
      return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
    }
    lengthSq() {
      return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }
    length() {
      return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }
    normalize() {
      let t = this.length();
      return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
    }
    multiply(t) {
      return this.multiplyQuaternions(this, t);
    }
    premultiply(t) {
      return this.multiplyQuaternions(t, this);
    }
    multiplyQuaternions(t, e) {
      const n = t._x, i = t._y, s = t._z, o = t._w, a = e._x, l = e._y, c = e._z, h = e._w;
      return this._x = n * h + o * a + i * c - s * l, this._y = i * h + o * l + s * a - n * c, this._z = s * h + o * c + n * l - i * a, this._w = o * h - n * a - i * l - s * c, this._onChangeCallback(), this;
    }
    slerp(t, e) {
      if (e === 0) return this;
      if (e === 1) return this.copy(t);
      const n = this._x, i = this._y, s = this._z, o = this._w;
      let a = o * t._w + n * t._x + i * t._y + s * t._z;
      if (a < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, a = -a) : this.copy(t), a >= 1) return this._w = o, this._x = n, this._y = i, this._z = s, this;
      const l = 1 - a * a;
      if (l <= Number.EPSILON) {
        const f = 1 - e;
        return this._w = f * o + e * this._w, this._x = f * n + e * this._x, this._y = f * i + e * this._y, this._z = f * s + e * this._z, this.normalize(), this;
      }
      const c = Math.sqrt(l), h = Math.atan2(c, a), d = Math.sin((1 - e) * h) / c, u = Math.sin(e * h) / c;
      return this._w = o * d + this._w * u, this._x = n * d + this._x * u, this._y = i * d + this._y * u, this._z = s * d + this._z * u, this._onChangeCallback(), this;
    }
    slerpQuaternions(t, e, n) {
      return this.copy(t).slerp(e, n);
    }
    random() {
      const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), n = Math.random(), i = Math.sqrt(1 - n), s = Math.sqrt(n);
      return this.set(i * Math.sin(t), i * Math.cos(t), s * Math.sin(e), s * Math.cos(e));
    }
    equals(t) {
      return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
    }
    fromArray(t, e = 0) {
      return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
    }
    fromBufferAttribute(t, e) {
      return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(t) {
      return this._onChangeCallback = t, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._w;
    }
  }
  class R {
    constructor(t = 0, e = 0, n = 0) {
      R.prototype.isVector3 = true, this.x = t, this.y = e, this.z = n;
    }
    set(t, e, n) {
      return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
    }
    setScalar(t) {
      return this.x = t, this.y = t, this.z = t, this;
    }
    setX(t) {
      return this.x = t, this;
    }
    setY(t) {
      return this.y = t, this;
    }
    setZ(t) {
      return this.z = t, this;
    }
    setComponent(t, e) {
      switch (t) {
        case 0:
          this.x = e;
          break;
        case 1:
          this.y = e;
          break;
        case 2:
          this.z = e;
          break;
        default:
          throw new Error("index is out of range: " + t);
      }
      return this;
    }
    getComponent(t) {
      switch (t) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + t);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this.z = t.z, this;
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this.z += t.z, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this.z += t, this;
    }
    addVectors(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
    }
    addScaledVector(t, e) {
      return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this.z -= t, this;
    }
    subVectors(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
    }
    multiply(t) {
      return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
    }
    multiplyScalar(t) {
      return this.x *= t, this.y *= t, this.z *= t, this;
    }
    multiplyVectors(t, e) {
      return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
    }
    applyEuler(t) {
      return this.applyQuaternion(Fh.setFromEuler(t));
    }
    applyAxisAngle(t, e) {
      return this.applyQuaternion(Fh.setFromAxisAngle(t, e));
    }
    applyMatrix3(t) {
      const e = this.x, n = this.y, i = this.z, s = t.elements;
      return this.x = s[0] * e + s[3] * n + s[6] * i, this.y = s[1] * e + s[4] * n + s[7] * i, this.z = s[2] * e + s[5] * n + s[8] * i, this;
    }
    applyNormalMatrix(t) {
      return this.applyMatrix3(t).normalize();
    }
    applyMatrix4(t) {
      const e = this.x, n = this.y, i = this.z, s = t.elements, o = 1 / (s[3] * e + s[7] * n + s[11] * i + s[15]);
      return this.x = (s[0] * e + s[4] * n + s[8] * i + s[12]) * o, this.y = (s[1] * e + s[5] * n + s[9] * i + s[13]) * o, this.z = (s[2] * e + s[6] * n + s[10] * i + s[14]) * o, this;
    }
    applyQuaternion(t) {
      const e = this.x, n = this.y, i = this.z, s = t.x, o = t.y, a = t.z, l = t.w, c = 2 * (o * i - a * n), h = 2 * (a * e - s * i), d = 2 * (s * n - o * e);
      return this.x = e + l * c + o * d - a * h, this.y = n + l * h + a * c - s * d, this.z = i + l * d + s * h - o * c, this;
    }
    project(t) {
      return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
    }
    unproject(t) {
      return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
    }
    transformDirection(t) {
      const e = this.x, n = this.y, i = this.z, s = t.elements;
      return this.x = s[0] * e + s[4] * n + s[8] * i, this.y = s[1] * e + s[5] * n + s[9] * i, this.z = s[2] * e + s[6] * n + s[10] * i, this.normalize();
    }
    divide(t) {
      return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
    }
    divideScalar(t) {
      return this.multiplyScalar(1 / t);
    }
    min(t) {
      return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
    }
    max(t) {
      return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
    }
    clamp(t, e) {
      return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this;
    }
    clampScalar(t, e) {
      return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this;
    }
    clampLength(t, e) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(t) {
      return this.normalize().multiplyScalar(t);
    }
    lerp(t, e) {
      return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
    }
    lerpVectors(t, e, n) {
      return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
    }
    cross(t) {
      return this.crossVectors(this, t);
    }
    crossVectors(t, e) {
      const n = t.x, i = t.y, s = t.z, o = e.x, a = e.y, l = e.z;
      return this.x = i * l - s * a, this.y = s * o - n * l, this.z = n * a - i * o, this;
    }
    projectOnVector(t) {
      const e = t.lengthSq();
      if (e === 0) return this.set(0, 0, 0);
      const n = t.dot(this) / e;
      return this.copy(t).multiplyScalar(n);
    }
    projectOnPlane(t) {
      return el.copy(this).projectOnVector(t), this.sub(el);
    }
    reflect(t) {
      return this.sub(el.copy(t).multiplyScalar(2 * this.dot(t)));
    }
    angleTo(t) {
      const e = Math.sqrt(this.lengthSq() * t.lengthSq());
      if (e === 0) return Math.PI / 2;
      const n = this.dot(t) / e;
      return Math.acos(de(n, -1, 1));
    }
    distanceTo(t) {
      return Math.sqrt(this.distanceToSquared(t));
    }
    distanceToSquared(t) {
      const e = this.x - t.x, n = this.y - t.y, i = this.z - t.z;
      return e * e + n * n + i * i;
    }
    manhattanDistanceTo(t) {
      return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
    }
    setFromSpherical(t) {
      return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
    }
    setFromSphericalCoords(t, e, n) {
      const i = Math.sin(e) * t;
      return this.x = i * Math.sin(n), this.y = Math.cos(e) * t, this.z = i * Math.cos(n), this;
    }
    setFromCylindrical(t) {
      return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
    }
    setFromCylindricalCoords(t, e, n) {
      return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
    }
    setFromMatrixPosition(t) {
      const e = t.elements;
      return this.x = e[12], this.y = e[13], this.z = e[14], this;
    }
    setFromMatrixScale(t) {
      const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), i = this.setFromMatrixColumn(t, 2).length();
      return this.x = e, this.y = n, this.z = i, this;
    }
    setFromMatrixColumn(t, e) {
      return this.fromArray(t.elements, e * 4);
    }
    setFromMatrix3Column(t, e) {
      return this.fromArray(t.elements, e * 3);
    }
    setFromEuler(t) {
      return this.x = t._x, this.y = t._y, this.z = t._z, this;
    }
    setFromColor(t) {
      return this.x = t.r, this.y = t.g, this.z = t.b, this;
    }
    equals(t) {
      return t.x === this.x && t.y === this.y && t.z === this.z;
    }
    fromArray(t, e = 0) {
      return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
    }
    fromBufferAttribute(t, e) {
      return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
    }
    randomDirection() {
      const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, n = Math.sqrt(1 - e * e);
      return this.x = n * Math.cos(t), this.y = e, this.z = n * Math.sin(t), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z;
    }
  }
  const el = new R(), Fh = new qe();
  class De {
    constructor(t = new R(1 / 0, 1 / 0, 1 / 0), e = new R(-1 / 0, -1 / 0, -1 / 0)) {
      this.isBox3 = true, this.min = t, this.max = e;
    }
    set(t, e) {
      return this.min.copy(t), this.max.copy(e), this;
    }
    setFromArray(t) {
      this.makeEmpty();
      for (let e = 0, n = t.length; e < n; e += 3) this.expandByPoint(mn.fromArray(t, e));
      return this;
    }
    setFromBufferAttribute(t) {
      this.makeEmpty();
      for (let e = 0, n = t.count; e < n; e++) this.expandByPoint(mn.fromBufferAttribute(t, e));
      return this;
    }
    setFromPoints(t) {
      this.makeEmpty();
      for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
      return this;
    }
    setFromCenterAndSize(t, e) {
      const n = mn.copy(e).multiplyScalar(0.5);
      return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
    }
    setFromObject(t, e = false) {
      return this.makeEmpty(), this.expandByObject(t, e);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      return this.min.copy(t.min), this.max.copy(t.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    }
    getCenter(t) {
      return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(t) {
      return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
    }
    expandByPoint(t) {
      return this.min.min(t), this.max.max(t), this;
    }
    expandByVector(t) {
      return this.min.sub(t), this.max.add(t), this;
    }
    expandByScalar(t) {
      return this.min.addScalar(-t), this.max.addScalar(t), this;
    }
    expandByObject(t, e = false) {
      t.updateWorldMatrix(false, false);
      const n = t.geometry;
      if (n !== void 0) {
        const s = n.getAttribute("position");
        if (e === true && s !== void 0 && t.isInstancedMesh !== true) for (let o = 0, a = s.count; o < a; o++) t.isMesh === true ? t.getVertexPosition(o, mn) : mn.fromBufferAttribute(s, o), mn.applyMatrix4(t.matrixWorld), this.expandByPoint(mn);
        else t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), ao.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), ao.copy(n.boundingBox)), ao.applyMatrix4(t.matrixWorld), this.union(ao);
      }
      const i = t.children;
      for (let s = 0, o = i.length; s < o; s++) this.expandByObject(i[s], e);
      return this;
    }
    containsPoint(t) {
      return !(t.x < this.min.x || t.x > this.max.x || t.y < this.min.y || t.y > this.max.y || t.z < this.min.z || t.z > this.max.z);
    }
    containsBox(t) {
      return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
    }
    getParameter(t, e) {
      return e.set((t.x - this.min.x) / (this.max.x - this.min.x), (t.y - this.min.y) / (this.max.y - this.min.y), (t.z - this.min.z) / (this.max.z - this.min.z));
    }
    intersectsBox(t) {
      return !(t.max.x < this.min.x || t.min.x > this.max.x || t.max.y < this.min.y || t.min.y > this.max.y || t.max.z < this.min.z || t.min.z > this.max.z);
    }
    intersectsSphere(t) {
      return this.clampPoint(t.center, mn), mn.distanceToSquared(t.center) <= t.radius * t.radius;
    }
    intersectsPlane(t) {
      let e, n;
      return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
    }
    intersectsTriangle(t) {
      if (this.isEmpty()) return false;
      this.getCenter(Qs), lo.subVectors(this.max, Qs), rs.subVectors(t.a, Qs), os.subVectors(t.b, Qs), as.subVectors(t.c, Qs), si.subVectors(os, rs), ri.subVectors(as, os), wi.subVectors(rs, as);
      let e = [
        0,
        -si.z,
        si.y,
        0,
        -ri.z,
        ri.y,
        0,
        -wi.z,
        wi.y,
        si.z,
        0,
        -si.x,
        ri.z,
        0,
        -ri.x,
        wi.z,
        0,
        -wi.x,
        -si.y,
        si.x,
        0,
        -ri.y,
        ri.x,
        0,
        -wi.y,
        wi.x,
        0
      ];
      return !nl(e, rs, os, as, lo) || (e = [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ], !nl(e, rs, os, as, lo)) ? false : (co.crossVectors(si, ri), e = [
        co.x,
        co.y,
        co.z
      ], nl(e, rs, os, as, lo));
    }
    clampPoint(t, e) {
      return e.copy(t).clamp(this.min, this.max);
    }
    distanceToPoint(t) {
      return this.clampPoint(t, mn).distanceTo(t);
    }
    getBoundingSphere(t) {
      return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(mn).length() * 0.5), t;
    }
    intersect(t) {
      return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(t) {
      return this.min.min(t.min), this.max.max(t.max), this;
    }
    applyMatrix4(t) {
      return this.isEmpty() ? this : (Nn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), Nn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), Nn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), Nn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), Nn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), Nn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), Nn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), Nn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(Nn), this);
    }
    translate(t) {
      return this.min.add(t), this.max.add(t), this;
    }
    equals(t) {
      return t.min.equals(this.min) && t.max.equals(this.max);
    }
  }
  const Nn = [
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R(),
    new R()
  ], mn = new R(), ao = new De(), rs = new R(), os = new R(), as = new R(), si = new R(), ri = new R(), wi = new R(), Qs = new R(), lo = new R(), co = new R(), Ti = new R();
  function nl(r, t, e, n, i) {
    for (let s = 0, o = r.length - 3; s <= o; s += 3) {
      Ti.fromArray(r, s);
      const a = i.x * Math.abs(Ti.x) + i.y * Math.abs(Ti.y) + i.z * Math.abs(Ti.z), l = t.dot(Ti), c = e.dot(Ti), h = n.dot(Ti);
      if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > a) return false;
    }
    return true;
  }
  const bg = new De(), js = new R(), il = new R();
  class Ue {
    constructor(t = new R(), e = -1) {
      this.isSphere = true, this.center = t, this.radius = e;
    }
    set(t, e) {
      return this.center.copy(t), this.radius = e, this;
    }
    setFromPoints(t, e) {
      const n = this.center;
      e !== void 0 ? n.copy(e) : bg.setFromPoints(t).getCenter(n);
      let i = 0;
      for (let s = 0, o = t.length; s < o; s++) i = Math.max(i, n.distanceToSquared(t[s]));
      return this.radius = Math.sqrt(i), this;
    }
    copy(t) {
      return this.center.copy(t.center), this.radius = t.radius, this;
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return this.center.set(0, 0, 0), this.radius = -1, this;
    }
    containsPoint(t) {
      return t.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(t) {
      return t.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(t) {
      const e = this.radius + t.radius;
      return t.center.distanceToSquared(this.center) <= e * e;
    }
    intersectsBox(t) {
      return t.intersectsSphere(this);
    }
    intersectsPlane(t) {
      return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(t, e) {
      const n = this.center.distanceToSquared(t);
      return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
    }
    getBoundingBox(t) {
      return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
    }
    applyMatrix4(t) {
      return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
    }
    translate(t) {
      return this.center.add(t), this;
    }
    expandByPoint(t) {
      if (this.isEmpty()) return this.center.copy(t), this.radius = 0, this;
      js.subVectors(t, this.center);
      const e = js.lengthSq();
      if (e > this.radius * this.radius) {
        const n = Math.sqrt(e), i = (n - this.radius) * 0.5;
        this.center.addScaledVector(js, i / n), this.radius += i;
      }
      return this;
    }
    union(t) {
      return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === true ? this.radius = Math.max(this.radius, t.radius) : (il.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(js.copy(t.center).add(il)), this.expandByPoint(js.copy(t.center).sub(il))), this);
    }
    equals(t) {
      return t.center.equals(this.center) && t.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const On = new R(), sl = new R(), ho = new R(), oi = new R(), rl = new R(), uo = new R(), ol = new R();
  class Gs {
    constructor(t = new R(), e = new R(0, 0, -1)) {
      this.origin = t, this.direction = e;
    }
    set(t, e) {
      return this.origin.copy(t), this.direction.copy(e), this;
    }
    copy(t) {
      return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
    }
    at(t, e) {
      return e.copy(this.origin).addScaledVector(this.direction, t);
    }
    lookAt(t) {
      return this.direction.copy(t).sub(this.origin).normalize(), this;
    }
    recast(t) {
      return this.origin.copy(this.at(t, On)), this;
    }
    closestPointToPoint(t, e) {
      e.subVectors(t, this.origin);
      const n = e.dot(this.direction);
      return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
    }
    distanceToPoint(t) {
      return Math.sqrt(this.distanceSqToPoint(t));
    }
    distanceSqToPoint(t) {
      const e = On.subVectors(t, this.origin).dot(this.direction);
      return e < 0 ? this.origin.distanceToSquared(t) : (On.copy(this.origin).addScaledVector(this.direction, e), On.distanceToSquared(t));
    }
    distanceSqToSegment(t, e, n, i) {
      sl.copy(t).add(e).multiplyScalar(0.5), ho.copy(e).sub(t).normalize(), oi.copy(this.origin).sub(sl);
      const s = t.distanceTo(e) * 0.5, o = -this.direction.dot(ho), a = oi.dot(this.direction), l = -oi.dot(ho), c = oi.lengthSq(), h = Math.abs(1 - o * o);
      let d, u, f, m;
      if (h > 0) if (d = o * l - a, u = o * a - l, m = s * h, d >= 0) if (u >= -m) if (u <= m) {
        const _ = 1 / h;
        d *= _, u *= _, f = d * (d + o * u + 2 * a) + u * (o * d + u + 2 * l) + c;
      } else u = s, d = Math.max(0, -(o * u + a)), f = -d * d + u * (u + 2 * l) + c;
      else u = -s, d = Math.max(0, -(o * u + a)), f = -d * d + u * (u + 2 * l) + c;
      else u <= -m ? (d = Math.max(0, -(-o * s + a)), u = d > 0 ? -s : Math.min(Math.max(-s, -l), s), f = -d * d + u * (u + 2 * l) + c) : u <= m ? (d = 0, u = Math.min(Math.max(-s, -l), s), f = u * (u + 2 * l) + c) : (d = Math.max(0, -(o * s + a)), u = d > 0 ? s : Math.min(Math.max(-s, -l), s), f = -d * d + u * (u + 2 * l) + c);
      else u = o > 0 ? -s : s, d = Math.max(0, -(o * u + a)), f = -d * d + u * (u + 2 * l) + c;
      return n && n.copy(this.origin).addScaledVector(this.direction, d), i && i.copy(sl).addScaledVector(ho, u), f;
    }
    intersectSphere(t, e) {
      On.subVectors(t.center, this.origin);
      const n = On.dot(this.direction), i = On.dot(On) - n * n, s = t.radius * t.radius;
      if (i > s) return null;
      const o = Math.sqrt(s - i), a = n - o, l = n + o;
      return l < 0 ? null : a < 0 ? this.at(l, e) : this.at(a, e);
    }
    intersectsSphere(t) {
      return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
    }
    distanceToPlane(t) {
      const e = t.normal.dot(this.direction);
      if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null;
      const n = -(this.origin.dot(t.normal) + t.constant) / e;
      return n >= 0 ? n : null;
    }
    intersectPlane(t, e) {
      const n = this.distanceToPlane(t);
      return n === null ? null : this.at(n, e);
    }
    intersectsPlane(t) {
      const e = t.distanceToPoint(this.origin);
      return e === 0 || t.normal.dot(this.direction) * e < 0;
    }
    intersectBox(t, e) {
      let n, i, s, o, a, l;
      const c = 1 / this.direction.x, h = 1 / this.direction.y, d = 1 / this.direction.z, u = this.origin;
      return c >= 0 ? (n = (t.min.x - u.x) * c, i = (t.max.x - u.x) * c) : (n = (t.max.x - u.x) * c, i = (t.min.x - u.x) * c), h >= 0 ? (s = (t.min.y - u.y) * h, o = (t.max.y - u.y) * h) : (s = (t.max.y - u.y) * h, o = (t.min.y - u.y) * h), n > o || s > i || ((s > n || isNaN(n)) && (n = s), (o < i || isNaN(i)) && (i = o), d >= 0 ? (a = (t.min.z - u.z) * d, l = (t.max.z - u.z) * d) : (a = (t.max.z - u.z) * d, l = (t.min.z - u.z) * d), n > l || a > i) || ((a > n || n !== n) && (n = a), (l < i || i !== i) && (i = l), i < 0) ? null : this.at(n >= 0 ? n : i, e);
    }
    intersectsBox(t) {
      return this.intersectBox(t, On) !== null;
    }
    intersectTriangle(t, e, n, i, s) {
      rl.subVectors(e, t), uo.subVectors(n, t), ol.crossVectors(rl, uo);
      let o = this.direction.dot(ol), a;
      if (o > 0) {
        if (i) return null;
        a = 1;
      } else if (o < 0) a = -1, o = -o;
      else return null;
      oi.subVectors(this.origin, t);
      const l = a * this.direction.dot(uo.crossVectors(oi, uo));
      if (l < 0) return null;
      const c = a * this.direction.dot(rl.cross(oi));
      if (c < 0 || l + c > o) return null;
      const h = -a * oi.dot(ol);
      return h < 0 ? null : this.at(h / o, s);
    }
    applyMatrix4(t) {
      return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
    }
    equals(t) {
      return t.origin.equals(this.origin) && t.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class Dt {
    constructor(t, e, n, i, s, o, a, l, c, h, d, u, f, m, _, g) {
      Dt.prototype.isMatrix4 = true, this.elements = [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ], t !== void 0 && this.set(t, e, n, i, s, o, a, l, c, h, d, u, f, m, _, g);
    }
    set(t, e, n, i, s, o, a, l, c, h, d, u, f, m, _, g) {
      const p = this.elements;
      return p[0] = t, p[4] = e, p[8] = n, p[12] = i, p[1] = s, p[5] = o, p[9] = a, p[13] = l, p[2] = c, p[6] = h, p[10] = d, p[14] = u, p[3] = f, p[7] = m, p[11] = _, p[15] = g, this;
    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new Dt().fromArray(this.elements);
    }
    copy(t) {
      const e = this.elements, n = t.elements;
      return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
    }
    copyPosition(t) {
      const e = this.elements, n = t.elements;
      return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
    }
    setFromMatrix3(t) {
      const e = t.elements;
      return this.set(e[0], e[3], e[6], 0, e[1], e[4], e[7], 0, e[2], e[5], e[8], 0, 0, 0, 0, 1), this;
    }
    extractBasis(t, e, n) {
      return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
    }
    makeBasis(t, e, n) {
      return this.set(t.x, e.x, n.x, 0, t.y, e.y, n.y, 0, t.z, e.z, n.z, 0, 0, 0, 0, 1), this;
    }
    extractRotation(t) {
      const e = this.elements, n = t.elements, i = 1 / ls.setFromMatrixColumn(t, 0).length(), s = 1 / ls.setFromMatrixColumn(t, 1).length(), o = 1 / ls.setFromMatrixColumn(t, 2).length();
      return e[0] = n[0] * i, e[1] = n[1] * i, e[2] = n[2] * i, e[3] = 0, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = 0, e[8] = n[8] * o, e[9] = n[9] * o, e[10] = n[10] * o, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
    }
    makeRotationFromEuler(t) {
      const e = this.elements, n = t.x, i = t.y, s = t.z, o = Math.cos(n), a = Math.sin(n), l = Math.cos(i), c = Math.sin(i), h = Math.cos(s), d = Math.sin(s);
      if (t.order === "XYZ") {
        const u = o * h, f = o * d, m = a * h, _ = a * d;
        e[0] = l * h, e[4] = -l * d, e[8] = c, e[1] = f + m * c, e[5] = u - _ * c, e[9] = -a * l, e[2] = _ - u * c, e[6] = m + f * c, e[10] = o * l;
      } else if (t.order === "YXZ") {
        const u = l * h, f = l * d, m = c * h, _ = c * d;
        e[0] = u + _ * a, e[4] = m * a - f, e[8] = o * c, e[1] = o * d, e[5] = o * h, e[9] = -a, e[2] = f * a - m, e[6] = _ + u * a, e[10] = o * l;
      } else if (t.order === "ZXY") {
        const u = l * h, f = l * d, m = c * h, _ = c * d;
        e[0] = u - _ * a, e[4] = -o * d, e[8] = m + f * a, e[1] = f + m * a, e[5] = o * h, e[9] = _ - u * a, e[2] = -o * c, e[6] = a, e[10] = o * l;
      } else if (t.order === "ZYX") {
        const u = o * h, f = o * d, m = a * h, _ = a * d;
        e[0] = l * h, e[4] = m * c - f, e[8] = u * c + _, e[1] = l * d, e[5] = _ * c + u, e[9] = f * c - m, e[2] = -c, e[6] = a * l, e[10] = o * l;
      } else if (t.order === "YZX") {
        const u = o * l, f = o * c, m = a * l, _ = a * c;
        e[0] = l * h, e[4] = _ - u * d, e[8] = m * d + f, e[1] = d, e[5] = o * h, e[9] = -a * h, e[2] = -c * h, e[6] = f * d + m, e[10] = u - _ * d;
      } else if (t.order === "XZY") {
        const u = o * l, f = o * c, m = a * l, _ = a * c;
        e[0] = l * h, e[4] = -d, e[8] = c * h, e[1] = u * d + _, e[5] = o * h, e[9] = f * d - m, e[2] = m * d - f, e[6] = a * h, e[10] = _ * d + u;
      }
      return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
    }
    makeRotationFromQuaternion(t) {
      return this.compose(wg, t, Tg);
    }
    lookAt(t, e, n) {
      const i = this.elements;
      return Je.subVectors(t, e), Je.lengthSq() === 0 && (Je.z = 1), Je.normalize(), ai.crossVectors(n, Je), ai.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Je.x += 1e-4 : Je.z += 1e-4, Je.normalize(), ai.crossVectors(n, Je)), ai.normalize(), fo.crossVectors(Je, ai), i[0] = ai.x, i[4] = fo.x, i[8] = Je.x, i[1] = ai.y, i[5] = fo.y, i[9] = Je.y, i[2] = ai.z, i[6] = fo.z, i[10] = Je.z, this;
    }
    multiply(t) {
      return this.multiplyMatrices(this, t);
    }
    premultiply(t) {
      return this.multiplyMatrices(t, this);
    }
    multiplyMatrices(t, e) {
      const n = t.elements, i = e.elements, s = this.elements, o = n[0], a = n[4], l = n[8], c = n[12], h = n[1], d = n[5], u = n[9], f = n[13], m = n[2], _ = n[6], g = n[10], p = n[14], v = n[3], x = n[7], S = n[11], P = n[15], b = i[0], T = i[4], E = i[8], M = i[12], y = i[1], C = i[5], N = i[9], I = i[13], U = i[2], D = i[6], O = i[10], H = i[14], z = i[3], F = i[7], Y = i[11], nt = i[15];
      return s[0] = o * b + a * y + l * U + c * z, s[4] = o * T + a * C + l * D + c * F, s[8] = o * E + a * N + l * O + c * Y, s[12] = o * M + a * I + l * H + c * nt, s[1] = h * b + d * y + u * U + f * z, s[5] = h * T + d * C + u * D + f * F, s[9] = h * E + d * N + u * O + f * Y, s[13] = h * M + d * I + u * H + f * nt, s[2] = m * b + _ * y + g * U + p * z, s[6] = m * T + _ * C + g * D + p * F, s[10] = m * E + _ * N + g * O + p * Y, s[14] = m * M + _ * I + g * H + p * nt, s[3] = v * b + x * y + S * U + P * z, s[7] = v * T + x * C + S * D + P * F, s[11] = v * E + x * N + S * O + P * Y, s[15] = v * M + x * I + S * H + P * nt, this;
    }
    multiplyScalar(t) {
      const e = this.elements;
      return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
    }
    determinant() {
      const t = this.elements, e = t[0], n = t[4], i = t[8], s = t[12], o = t[1], a = t[5], l = t[9], c = t[13], h = t[2], d = t[6], u = t[10], f = t[14], m = t[3], _ = t[7], g = t[11], p = t[15];
      return m * (+s * l * d - i * c * d - s * a * u + n * c * u + i * a * f - n * l * f) + _ * (+e * l * f - e * c * u + s * o * u - i * o * f + i * c * h - s * l * h) + g * (+e * c * d - e * a * f - s * o * d + n * o * f + s * a * h - n * c * h) + p * (-i * a * h - e * l * d + e * a * u + i * o * d - n * o * u + n * l * h);
    }
    transpose() {
      const t = this.elements;
      let e;
      return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
    }
    setPosition(t, e, n) {
      const i = this.elements;
      return t.isVector3 ? (i[12] = t.x, i[13] = t.y, i[14] = t.z) : (i[12] = t, i[13] = e, i[14] = n), this;
    }
    invert() {
      const t = this.elements, e = t[0], n = t[1], i = t[2], s = t[3], o = t[4], a = t[5], l = t[6], c = t[7], h = t[8], d = t[9], u = t[10], f = t[11], m = t[12], _ = t[13], g = t[14], p = t[15], v = d * g * c - _ * u * c + _ * l * f - a * g * f - d * l * p + a * u * p, x = m * u * c - h * g * c - m * l * f + o * g * f + h * l * p - o * u * p, S = h * _ * c - m * d * c + m * a * f - o * _ * f - h * a * p + o * d * p, P = m * d * l - h * _ * l - m * a * u + o * _ * u + h * a * g - o * d * g, b = e * v + n * x + i * S + s * P;
      if (b === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      const T = 1 / b;
      return t[0] = v * T, t[1] = (_ * u * s - d * g * s - _ * i * f + n * g * f + d * i * p - n * u * p) * T, t[2] = (a * g * s - _ * l * s + _ * i * c - n * g * c - a * i * p + n * l * p) * T, t[3] = (d * l * s - a * u * s - d * i * c + n * u * c + a * i * f - n * l * f) * T, t[4] = x * T, t[5] = (h * g * s - m * u * s + m * i * f - e * g * f - h * i * p + e * u * p) * T, t[6] = (m * l * s - o * g * s - m * i * c + e * g * c + o * i * p - e * l * p) * T, t[7] = (o * u * s - h * l * s + h * i * c - e * u * c - o * i * f + e * l * f) * T, t[8] = S * T, t[9] = (m * d * s - h * _ * s - m * n * f + e * _ * f + h * n * p - e * d * p) * T, t[10] = (o * _ * s - m * a * s + m * n * c - e * _ * c - o * n * p + e * a * p) * T, t[11] = (h * a * s - o * d * s - h * n * c + e * d * c + o * n * f - e * a * f) * T, t[12] = P * T, t[13] = (h * _ * i - m * d * i + m * n * u - e * _ * u - h * n * g + e * d * g) * T, t[14] = (m * a * i - o * _ * i - m * n * l + e * _ * l + o * n * g - e * a * g) * T, t[15] = (o * d * i - h * a * i + h * n * l - e * d * l - o * n * u + e * a * u) * T, this;
    }
    scale(t) {
      const e = this.elements, n = t.x, i = t.y, s = t.z;
      return e[0] *= n, e[4] *= i, e[8] *= s, e[1] *= n, e[5] *= i, e[9] *= s, e[2] *= n, e[6] *= i, e[10] *= s, e[3] *= n, e[7] *= i, e[11] *= s, this;
    }
    getMaxScaleOnAxis() {
      const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], i = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
      return Math.sqrt(Math.max(e, n, i));
    }
    makeTranslation(t, e, n) {
      return t.isVector3 ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1) : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1), this;
    }
    makeRotationX(t) {
      const e = Math.cos(t), n = Math.sin(t);
      return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(t) {
      const e = Math.cos(t), n = Math.sin(t);
      return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(t) {
      const e = Math.cos(t), n = Math.sin(t);
      return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(t, e) {
      const n = Math.cos(e), i = Math.sin(e), s = 1 - n, o = t.x, a = t.y, l = t.z, c = s * o, h = s * a;
      return this.set(c * o + n, c * a - i * l, c * l + i * a, 0, c * a + i * l, h * a + n, h * l - i * o, 0, c * l - i * a, h * l + i * o, s * l * l + n, 0, 0, 0, 0, 1), this;
    }
    makeScale(t, e, n) {
      return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
    }
    makeShear(t, e, n, i, s, o) {
      return this.set(1, n, s, 0, t, 1, o, 0, e, i, 1, 0, 0, 0, 0, 1), this;
    }
    compose(t, e, n) {
      const i = this.elements, s = e._x, o = e._y, a = e._z, l = e._w, c = s + s, h = o + o, d = a + a, u = s * c, f = s * h, m = s * d, _ = o * h, g = o * d, p = a * d, v = l * c, x = l * h, S = l * d, P = n.x, b = n.y, T = n.z;
      return i[0] = (1 - (_ + p)) * P, i[1] = (f + S) * P, i[2] = (m - x) * P, i[3] = 0, i[4] = (f - S) * b, i[5] = (1 - (u + p)) * b, i[6] = (g + v) * b, i[7] = 0, i[8] = (m + x) * T, i[9] = (g - v) * T, i[10] = (1 - (u + _)) * T, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, this;
    }
    decompose(t, e, n) {
      const i = this.elements;
      let s = ls.set(i[0], i[1], i[2]).length();
      const o = ls.set(i[4], i[5], i[6]).length(), a = ls.set(i[8], i[9], i[10]).length();
      this.determinant() < 0 && (s = -s), t.x = i[12], t.y = i[13], t.z = i[14], gn.copy(this);
      const c = 1 / s, h = 1 / o, d = 1 / a;
      return gn.elements[0] *= c, gn.elements[1] *= c, gn.elements[2] *= c, gn.elements[4] *= h, gn.elements[5] *= h, gn.elements[6] *= h, gn.elements[8] *= d, gn.elements[9] *= d, gn.elements[10] *= d, e.setFromRotationMatrix(gn), n.x = s, n.y = o, n.z = a, this;
    }
    makePerspective(t, e, n, i, s, o, a = Rn) {
      const l = this.elements, c = 2 * s / (e - t), h = 2 * s / (n - i), d = (e + t) / (e - t), u = (n + i) / (n - i);
      let f, m;
      if (a === Rn) f = -(o + s) / (o - s), m = -2 * o * s / (o - s);
      else if (a === Ur) f = -o / (o - s), m = -o * s / (o - s);
      else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a);
      return l[0] = c, l[4] = 0, l[8] = d, l[12] = 0, l[1] = 0, l[5] = h, l[9] = u, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = f, l[14] = m, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
    }
    makeOrthographic(t, e, n, i, s, o, a = Rn) {
      const l = this.elements, c = 1 / (e - t), h = 1 / (n - i), d = 1 / (o - s), u = (e + t) * c, f = (n + i) * h;
      let m, _;
      if (a === Rn) m = (o + s) * d, _ = -2 * d;
      else if (a === Ur) m = s * d, _ = -1 * d;
      else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a);
      return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -u, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -f, l[2] = 0, l[6] = 0, l[10] = _, l[14] = -m, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
    }
    equals(t) {
      const e = this.elements, n = t.elements;
      for (let i = 0; i < 16; i++) if (e[i] !== n[i]) return false;
      return true;
    }
    fromArray(t, e = 0) {
      for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
      return this;
    }
    toArray(t = [], e = 0) {
      const n = this.elements;
      return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
    }
  }
  const ls = new R(), gn = new Dt(), wg = new R(0, 0, 0), Tg = new R(1, 1, 1), ai = new R(), fo = new R(), Je = new R(), Bh = new Dt(), kh = new qe();
  class rn {
    constructor(t = 0, e = 0, n = 0, i = rn.DEFAULT_ORDER) {
      this.isEuler = true, this._x = t, this._y = e, this._z = n, this._order = i;
    }
    get x() {
      return this._x;
    }
    set x(t) {
      this._x = t, this._onChangeCallback();
    }
    get y() {
      return this._y;
    }
    set y(t) {
      this._y = t, this._onChangeCallback();
    }
    get z() {
      return this._z;
    }
    set z(t) {
      this._z = t, this._onChangeCallback();
    }
    get order() {
      return this._order;
    }
    set order(t) {
      this._order = t, this._onChangeCallback();
    }
    set(t, e, n, i = this._order) {
      return this._x = t, this._y = e, this._z = n, this._order = i, this._onChangeCallback(), this;
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(t) {
      return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
    }
    setFromRotationMatrix(t, e = this._order, n = true) {
      const i = t.elements, s = i[0], o = i[4], a = i[8], l = i[1], c = i[5], h = i[9], d = i[2], u = i[6], f = i[10];
      switch (e) {
        case "XYZ":
          this._y = Math.asin(de(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(-h, f), this._z = Math.atan2(-o, s)) : (this._x = Math.atan2(u, c), this._z = 0);
          break;
        case "YXZ":
          this._x = Math.asin(-de(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(a, f), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-d, s), this._z = 0);
          break;
        case "ZXY":
          this._x = Math.asin(de(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._y = Math.atan2(-d, f), this._z = Math.atan2(-o, c)) : (this._y = 0, this._z = Math.atan2(l, s));
          break;
        case "ZYX":
          this._y = Math.asin(-de(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._x = Math.atan2(u, f), this._z = Math.atan2(l, s)) : (this._x = 0, this._z = Math.atan2(-o, c));
          break;
        case "YZX":
          this._z = Math.asin(de(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-d, s)) : (this._x = 0, this._y = Math.atan2(a, f));
          break;
        case "XZY":
          this._z = Math.asin(-de(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(u, c), this._y = Math.atan2(a, s)) : (this._x = Math.atan2(-h, f), this._y = 0);
          break;
        default:
          console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
      }
      return this._order = e, n === true && this._onChangeCallback(), this;
    }
    setFromQuaternion(t, e, n) {
      return Bh.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Bh, e, n);
    }
    setFromVector3(t, e = this._order) {
      return this.set(t.x, t.y, t.z, e);
    }
    reorder(t) {
      return kh.setFromEuler(this), this.setFromQuaternion(kh, t);
    }
    equals(t) {
      return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
    }
    fromArray(t) {
      return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
    }
    _onChange(t) {
      return this._onChangeCallback = t, this;
    }
    _onChangeCallback() {
    }
    *[Symbol.iterator]() {
      yield this._x, yield this._y, yield this._z, yield this._order;
    }
  }
  rn.DEFAULT_ORDER = "XYZ";
  class ba {
    constructor() {
      this.mask = 1;
    }
    set(t) {
      this.mask = (1 << t | 0) >>> 0;
    }
    enable(t) {
      this.mask |= 1 << t | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(t) {
      this.mask ^= 1 << t | 0;
    }
    disable(t) {
      this.mask &= ~(1 << t | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(t) {
      return (this.mask & t.mask) !== 0;
    }
    isEnabled(t) {
      return (this.mask & (1 << t | 0)) !== 0;
    }
  }
  let Ag = 0;
  const Vh = new R(), cs = new qe(), zn = new Dt(), po = new R(), tr = new R(), Eg = new R(), Cg = new qe(), Hh = new R(1, 0, 0), Gh = new R(0, 1, 0), Wh = new R(0, 0, 1), Xh = {
    type: "added"
  }, Rg = {
    type: "removed"
  }, hs = {
    type: "childadded",
    child: null
  }, al = {
    type: "childremoved",
    child: null
  };
  class jt extends ei {
    constructor() {
      super(), this.isObject3D = true, Object.defineProperty(this, "id", {
        value: Ag++
      }), this.uuid = sn(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = jt.DEFAULT_UP.clone();
      const t = new R(), e = new rn(), n = new qe(), i = new R(1, 1, 1);
      function s() {
        n.setFromEuler(e, false);
      }
      function o() {
        e.setFromQuaternion(n, void 0, false);
      }
      e._onChange(s), n._onChange(o), Object.defineProperties(this, {
        position: {
          configurable: true,
          enumerable: true,
          value: t
        },
        rotation: {
          configurable: true,
          enumerable: true,
          value: e
        },
        quaternion: {
          configurable: true,
          enumerable: true,
          value: n
        },
        scale: {
          configurable: true,
          enumerable: true,
          value: i
        },
        modelViewMatrix: {
          value: new Dt()
        },
        normalMatrix: {
          value: new Bt()
        }
      }), this.matrix = new Dt(), this.matrixWorld = new Dt(), this.matrixAutoUpdate = jt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new ba(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.userData = {};
    }
    onBeforeShadow() {
    }
    onAfterShadow() {
    }
    onBeforeRender() {
    }
    onAfterRender() {
    }
    applyMatrix4(t) {
      this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(t) {
      return this.quaternion.premultiply(t), this;
    }
    setRotationFromAxisAngle(t, e) {
      this.quaternion.setFromAxisAngle(t, e);
    }
    setRotationFromEuler(t) {
      this.quaternion.setFromEuler(t, true);
    }
    setRotationFromMatrix(t) {
      this.quaternion.setFromRotationMatrix(t);
    }
    setRotationFromQuaternion(t) {
      this.quaternion.copy(t);
    }
    rotateOnAxis(t, e) {
      return cs.setFromAxisAngle(t, e), this.quaternion.multiply(cs), this;
    }
    rotateOnWorldAxis(t, e) {
      return cs.setFromAxisAngle(t, e), this.quaternion.premultiply(cs), this;
    }
    rotateX(t) {
      return this.rotateOnAxis(Hh, t);
    }
    rotateY(t) {
      return this.rotateOnAxis(Gh, t);
    }
    rotateZ(t) {
      return this.rotateOnAxis(Wh, t);
    }
    translateOnAxis(t, e) {
      return Vh.copy(t).applyQuaternion(this.quaternion), this.position.add(Vh.multiplyScalar(e)), this;
    }
    translateX(t) {
      return this.translateOnAxis(Hh, t);
    }
    translateY(t) {
      return this.translateOnAxis(Gh, t);
    }
    translateZ(t) {
      return this.translateOnAxis(Wh, t);
    }
    localToWorld(t) {
      return this.updateWorldMatrix(true, false), t.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(t) {
      return this.updateWorldMatrix(true, false), t.applyMatrix4(zn.copy(this.matrixWorld).invert());
    }
    lookAt(t, e, n) {
      t.isVector3 ? po.copy(t) : po.set(t, e, n);
      const i = this.parent;
      this.updateWorldMatrix(true, false), tr.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? zn.lookAt(tr, po, this.up) : zn.lookAt(po, tr, this.up), this.quaternion.setFromRotationMatrix(zn), i && (zn.extractRotation(i.matrixWorld), cs.setFromRotationMatrix(zn), this.quaternion.premultiply(cs.invert()));
    }
    add(t) {
      if (arguments.length > 1) {
        for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
        return this;
      }
      return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(Xh), hs.child = t, this.dispatchEvent(hs), hs.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
    }
    remove(t) {
      if (arguments.length > 1) {
        for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
        return this;
      }
      const e = this.children.indexOf(t);
      return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Rg), al.child = t, this.dispatchEvent(al), al.child = null), this;
    }
    removeFromParent() {
      const t = this.parent;
      return t !== null && t.remove(this), this;
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(t) {
      return this.updateWorldMatrix(true, false), zn.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(true, false), zn.multiply(t.parent.matrixWorld)), t.applyMatrix4(zn), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(false, true), t.dispatchEvent(Xh), hs.child = t, this.dispatchEvent(hs), hs.child = null, this;
    }
    getObjectById(t) {
      return this.getObjectByProperty("id", t);
    }
    getObjectByName(t) {
      return this.getObjectByProperty("name", t);
    }
    getObjectByProperty(t, e) {
      if (this[t] === e) return this;
      for (let n = 0, i = this.children.length; n < i; n++) {
        const o = this.children[n].getObjectByProperty(t, e);
        if (o !== void 0) return o;
      }
    }
    getObjectsByProperty(t, e, n = []) {
      this[t] === e && n.push(this);
      const i = this.children;
      for (let s = 0, o = i.length; s < o; s++) i[s].getObjectsByProperty(t, e, n);
      return n;
    }
    getWorldPosition(t) {
      return this.updateWorldMatrix(true, false), t.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(t) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(tr, t, Eg), t;
    }
    getWorldScale(t) {
      return this.updateWorldMatrix(true, false), this.matrixWorld.decompose(tr, Cg, t), t;
    }
    getWorldDirection(t) {
      this.updateWorldMatrix(true, false);
      const e = this.matrixWorld.elements;
      return t.set(e[8], e[9], e[10]).normalize();
    }
    raycast() {
    }
    traverse(t) {
      t(this);
      const e = this.children;
      for (let n = 0, i = e.length; n < i; n++) e[n].traverse(t);
    }
    traverseVisible(t) {
      if (this.visible === false) return;
      t(this);
      const e = this.children;
      for (let n = 0, i = e.length; n < i; n++) e[n].traverseVisible(t);
    }
    traverseAncestors(t) {
      const e = this.parent;
      e !== null && (t(e), e.traverseAncestors(t));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(t) {
      this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = false, t = true);
      const e = this.children;
      for (let n = 0, i = e.length; n < i; n++) {
        const s = e[n];
        (s.matrixWorldAutoUpdate === true || t === true) && s.updateMatrixWorld(t);
      }
    }
    updateWorldMatrix(t, e) {
      const n = this.parent;
      if (t === true && n !== null && n.matrixWorldAutoUpdate === true && n.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), e === true) {
        const i = this.children;
        for (let s = 0, o = i.length; s < o; s++) {
          const a = i[s];
          a.matrixWorldAutoUpdate === true && a.updateWorldMatrix(false, true);
        }
      }
    }
    toJSON(t) {
      const e = t === void 0 || typeof t == "string", n = {};
      e && (t = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {}
      }, n.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON"
      });
      const i = {};
      i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === true && (i.castShadow = true), this.receiveShadow === true && (i.receiveShadow = true), this.visible === false && (i.visible = false), this.frustumCulled === false && (i.frustumCulled = false), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === false && (i.matrixAutoUpdate = false), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.visibility = this._visibility, i.active = this._active, i.bounds = this._bounds.map((a) => ({
        boxInitialized: a.boxInitialized,
        boxMin: a.box.min.toArray(),
        boxMax: a.box.max.toArray(),
        sphereInitialized: a.sphereInitialized,
        sphereRadius: a.sphere.radius,
        sphereCenter: a.sphere.center.toArray()
      })), i.maxGeometryCount = this._maxGeometryCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.geometryCount = this._geometryCount, i.matricesTexture = this._matricesTexture.toJSON(t), this.boundingSphere !== null && (i.boundingSphere = {
        center: i.boundingSphere.center.toArray(),
        radius: i.boundingSphere.radius
      }), this.boundingBox !== null && (i.boundingBox = {
        min: i.boundingBox.min.toArray(),
        max: i.boundingBox.max.toArray()
      }));
      function s(a, l) {
        return a[l.uuid] === void 0 && (a[l.uuid] = l.toJSON(t)), l.uuid;
      }
      if (this.isScene) this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (i.environment = this.environment.toJSON(t).uuid);
      else if (this.isMesh || this.isLine || this.isPoints) {
        i.geometry = s(t.geometries, this.geometry);
        const a = this.geometry.parameters;
        if (a !== void 0 && a.shapes !== void 0) {
          const l = a.shapes;
          if (Array.isArray(l)) for (let c = 0, h = l.length; c < h; c++) {
            const d = l[c];
            s(t.shapes, d);
          }
          else s(t.shapes, l);
        }
      }
      if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(t.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0) if (Array.isArray(this.material)) {
        const a = [];
        for (let l = 0, c = this.material.length; l < c; l++) a.push(s(t.materials, this.material[l]));
        i.material = a;
      } else i.material = s(t.materials, this.material);
      if (this.children.length > 0) {
        i.children = [];
        for (let a = 0; a < this.children.length; a++) i.children.push(this.children[a].toJSON(t).object);
      }
      if (this.animations.length > 0) {
        i.animations = [];
        for (let a = 0; a < this.animations.length; a++) {
          const l = this.animations[a];
          i.animations.push(s(t.animations, l));
        }
      }
      if (e) {
        const a = o(t.geometries), l = o(t.materials), c = o(t.textures), h = o(t.images), d = o(t.shapes), u = o(t.skeletons), f = o(t.animations), m = o(t.nodes);
        a.length > 0 && (n.geometries = a), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), d.length > 0 && (n.shapes = d), u.length > 0 && (n.skeletons = u), f.length > 0 && (n.animations = f), m.length > 0 && (n.nodes = m);
      }
      return n.object = i, n;
      function o(a) {
        const l = [];
        for (const c in a) {
          const h = a[c];
          delete h.metadata, l.push(h);
        }
        return l;
      }
    }
    clone(t) {
      return new this.constructor().copy(this, t);
    }
    copy(t, e = true) {
      if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === true) for (let n = 0; n < t.children.length; n++) {
        const i = t.children[n];
        this.add(i.clone());
      }
      return this;
    }
  }
  jt.DEFAULT_UP = new R(0, 1, 0);
  jt.DEFAULT_MATRIX_AUTO_UPDATE = true;
  jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
  const _n = new R(), Fn = new R(), ll = new R(), Bn = new R(), us = new R(), ds = new R(), Yh = new R(), cl = new R(), hl = new R(), ul = new R();
  class en {
    constructor(t = new R(), e = new R(), n = new R()) {
      this.a = t, this.b = e, this.c = n;
    }
    static getNormal(t, e, n, i) {
      i.subVectors(n, e), _n.subVectors(t, e), i.cross(_n);
      const s = i.lengthSq();
      return s > 0 ? i.multiplyScalar(1 / Math.sqrt(s)) : i.set(0, 0, 0);
    }
    static getBarycoord(t, e, n, i, s) {
      _n.subVectors(i, e), Fn.subVectors(n, e), ll.subVectors(t, e);
      const o = _n.dot(_n), a = _n.dot(Fn), l = _n.dot(ll), c = Fn.dot(Fn), h = Fn.dot(ll), d = o * c - a * a;
      if (d === 0) return s.set(0, 0, 0), null;
      const u = 1 / d, f = (c * l - a * h) * u, m = (o * h - a * l) * u;
      return s.set(1 - f - m, m, f);
    }
    static containsPoint(t, e, n, i) {
      return this.getBarycoord(t, e, n, i, Bn) === null ? false : Bn.x >= 0 && Bn.y >= 0 && Bn.x + Bn.y <= 1;
    }
    static getInterpolation(t, e, n, i, s, o, a, l) {
      return this.getBarycoord(t, e, n, i, Bn) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(s, Bn.x), l.addScaledVector(o, Bn.y), l.addScaledVector(a, Bn.z), l);
    }
    static isFrontFacing(t, e, n, i) {
      return _n.subVectors(n, e), Fn.subVectors(t, e), _n.cross(Fn).dot(i) < 0;
    }
    set(t, e, n) {
      return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
    }
    setFromPointsAndIndices(t, e, n, i) {
      return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[i]), this;
    }
    setFromAttributeAndIndices(t, e, n, i) {
      return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, i), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
    }
    getArea() {
      return _n.subVectors(this.c, this.b), Fn.subVectors(this.a, this.b), _n.cross(Fn).length() * 0.5;
    }
    getMidpoint(t) {
      return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
    }
    getNormal(t) {
      return en.getNormal(this.a, this.b, this.c, t);
    }
    getPlane(t) {
      return t.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(t, e) {
      return en.getBarycoord(t, this.a, this.b, this.c, e);
    }
    getInterpolation(t, e, n, i, s) {
      return en.getInterpolation(t, this.a, this.b, this.c, e, n, i, s);
    }
    containsPoint(t) {
      return en.containsPoint(t, this.a, this.b, this.c);
    }
    isFrontFacing(t) {
      return en.isFrontFacing(this.a, this.b, this.c, t);
    }
    intersectsBox(t) {
      return t.intersectsTriangle(this);
    }
    closestPointToPoint(t, e) {
      const n = this.a, i = this.b, s = this.c;
      let o, a;
      us.subVectors(i, n), ds.subVectors(s, n), cl.subVectors(t, n);
      const l = us.dot(cl), c = ds.dot(cl);
      if (l <= 0 && c <= 0) return e.copy(n);
      hl.subVectors(t, i);
      const h = us.dot(hl), d = ds.dot(hl);
      if (h >= 0 && d <= h) return e.copy(i);
      const u = l * d - h * c;
      if (u <= 0 && l >= 0 && h <= 0) return o = l / (l - h), e.copy(n).addScaledVector(us, o);
      ul.subVectors(t, s);
      const f = us.dot(ul), m = ds.dot(ul);
      if (m >= 0 && f <= m) return e.copy(s);
      const _ = f * c - l * m;
      if (_ <= 0 && c >= 0 && m <= 0) return a = c / (c - m), e.copy(n).addScaledVector(ds, a);
      const g = h * m - f * d;
      if (g <= 0 && d - h >= 0 && f - m >= 0) return Yh.subVectors(s, i), a = (d - h) / (d - h + (f - m)), e.copy(i).addScaledVector(Yh, a);
      const p = 1 / (g + _ + u);
      return o = _ * p, a = u * p, e.copy(n).addScaledVector(us, o).addScaledVector(ds, a);
    }
    equals(t) {
      return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
    }
  }
  const Of = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  }, li = {
    h: 0,
    s: 0,
    l: 0
  }, mo = {
    h: 0,
    s: 0,
    l: 0
  };
  function dl(r, t, e) {
    return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? r + (t - r) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? r + (t - r) * 6 * (2 / 3 - e) : r;
  }
  class xt {
    constructor(t, e, n) {
      return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
    }
    set(t, e, n) {
      if (e === void 0 && n === void 0) {
        const i = t;
        i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
      } else this.setRGB(t, e, n);
      return this;
    }
    setScalar(t) {
      return this.r = t, this.g = t, this.b = t, this;
    }
    setHex(t, e = un) {
      return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, ne.toWorkingColorSpace(this, e), this;
    }
    setRGB(t, e, n, i = ne.workingColorSpace) {
      return this.r = t, this.g = e, this.b = n, ne.toWorkingColorSpace(this, i), this;
    }
    setHSL(t, e, n, i = ne.workingColorSpace) {
      if (t = Xc(t, 1), e = de(e, 0, 1), n = de(n, 0, 1), e === 0) this.r = this.g = this.b = n;
      else {
        const s = n <= 0.5 ? n * (1 + e) : n + e - n * e, o = 2 * n - s;
        this.r = dl(o, s, t + 1 / 3), this.g = dl(o, s, t), this.b = dl(o, s, t - 1 / 3);
      }
      return ne.toWorkingColorSpace(this, i), this;
    }
    setStyle(t, e = un) {
      function n(s) {
        s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
      }
      let i;
      if (i = /^(\w+)\(([^\)]*)\)/.exec(t)) {
        let s;
        const o = i[1], a = i[2];
        switch (o) {
          case "rgb":
          case "rgba":
            if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(s[4]), this.setRGB(Math.min(255, parseInt(s[1], 10)) / 255, Math.min(255, parseInt(s[2], 10)) / 255, Math.min(255, parseInt(s[3], 10)) / 255, e);
            if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(s[4]), this.setRGB(Math.min(100, parseInt(s[1], 10)) / 100, Math.min(100, parseInt(s[2], 10)) / 100, Math.min(100, parseInt(s[3], 10)) / 100, e);
            break;
          case "hsl":
          case "hsla":
            if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a)) return n(s[4]), this.setHSL(parseFloat(s[1]) / 360, parseFloat(s[2]) / 100, parseFloat(s[3]) / 100, e);
            break;
          default:
            console.warn("THREE.Color: Unknown color model " + t);
        }
      } else if (i = /^\#([A-Fa-f\d]+)$/.exec(t)) {
        const s = i[1], o = s.length;
        if (o === 3) return this.setRGB(parseInt(s.charAt(0), 16) / 15, parseInt(s.charAt(1), 16) / 15, parseInt(s.charAt(2), 16) / 15, e);
        if (o === 6) return this.setHex(parseInt(s, 16), e);
        console.warn("THREE.Color: Invalid hex color " + t);
      } else if (t && t.length > 0) return this.setColorName(t, e);
      return this;
    }
    setColorName(t, e = un) {
      const n = Of[t.toLowerCase()];
      return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(t) {
      return this.r = t.r, this.g = t.g, this.b = t.b, this;
    }
    copySRGBToLinear(t) {
      return this.r = Is(t.r), this.g = Is(t.g), this.b = Is(t.b), this;
    }
    copyLinearToSRGB(t) {
      return this.r = ja(t.r), this.g = ja(t.g), this.b = ja(t.b), this;
    }
    convertSRGBToLinear() {
      return this.copySRGBToLinear(this), this;
    }
    convertLinearToSRGB() {
      return this.copyLinearToSRGB(this), this;
    }
    getHex(t = un) {
      return ne.fromWorkingColorSpace(Ie.copy(this), t), Math.round(de(Ie.r * 255, 0, 255)) * 65536 + Math.round(de(Ie.g * 255, 0, 255)) * 256 + Math.round(de(Ie.b * 255, 0, 255));
    }
    getHexString(t = un) {
      return ("000000" + this.getHex(t).toString(16)).slice(-6);
    }
    getHSL(t, e = ne.workingColorSpace) {
      ne.fromWorkingColorSpace(Ie.copy(this), e);
      const n = Ie.r, i = Ie.g, s = Ie.b, o = Math.max(n, i, s), a = Math.min(n, i, s);
      let l, c;
      const h = (a + o) / 2;
      if (a === o) l = 0, c = 0;
      else {
        const d = o - a;
        switch (c = h <= 0.5 ? d / (o + a) : d / (2 - o - a), o) {
          case n:
            l = (i - s) / d + (i < s ? 6 : 0);
            break;
          case i:
            l = (s - n) / d + 2;
            break;
          case s:
            l = (n - i) / d + 4;
            break;
        }
        l /= 6;
      }
      return t.h = l, t.s = c, t.l = h, t;
    }
    getRGB(t, e = ne.workingColorSpace) {
      return ne.fromWorkingColorSpace(Ie.copy(this), e), t.r = Ie.r, t.g = Ie.g, t.b = Ie.b, t;
    }
    getStyle(t = un) {
      ne.fromWorkingColorSpace(Ie.copy(this), t);
      const e = Ie.r, n = Ie.g, i = Ie.b;
      return t !== un ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(i * 255)})`;
    }
    offsetHSL(t, e, n) {
      return this.getHSL(li), this.setHSL(li.h + t, li.s + e, li.l + n);
    }
    add(t) {
      return this.r += t.r, this.g += t.g, this.b += t.b, this;
    }
    addColors(t, e) {
      return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
    }
    addScalar(t) {
      return this.r += t, this.g += t, this.b += t, this;
    }
    sub(t) {
      return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
    }
    multiply(t) {
      return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
    }
    multiplyScalar(t) {
      return this.r *= t, this.g *= t, this.b *= t, this;
    }
    lerp(t, e) {
      return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
    }
    lerpColors(t, e, n) {
      return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
    }
    lerpHSL(t, e) {
      this.getHSL(li), t.getHSL(mo);
      const n = _r(li.h, mo.h, e), i = _r(li.s, mo.s, e), s = _r(li.l, mo.l, e);
      return this.setHSL(n, i, s), this;
    }
    setFromVector3(t) {
      return this.r = t.x, this.g = t.y, this.b = t.z, this;
    }
    applyMatrix3(t) {
      const e = this.r, n = this.g, i = this.b, s = t.elements;
      return this.r = s[0] * e + s[3] * n + s[6] * i, this.g = s[1] * e + s[4] * n + s[7] * i, this.b = s[2] * e + s[5] * n + s[8] * i, this;
    }
    equals(t) {
      return t.r === this.r && t.g === this.g && t.b === this.b;
    }
    fromArray(t, e = 0) {
      return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
    }
    fromBufferAttribute(t, e) {
      return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      yield this.r, yield this.g, yield this.b;
    }
  }
  const Ie = new xt();
  xt.NAMES = Of;
  let Pg = 0;
  class Ne extends ei {
    constructor() {
      super(), this.isMaterial = true, Object.defineProperty(this, "id", {
        value: Pg++
      }), this.uuid = sn(), this.name = "", this.type = "Material", this.blending = Gi, this.side = Zn, this.vertexColors = false, this.opacity = 1, this.transparent = false, this.alphaHash = false, this.blendSrc = aa, this.blendDst = la, this.blendEquation = fi, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new xt(0, 0, 0), this.blendAlpha = 0, this.depthFunc = br, this.depthTest = true, this.depthWrite = true, this.stencilWriteMask = 255, this.stencilFunc = _c, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Oi, this.stencilZFail = Oi, this.stencilZPass = Oi, this.stencilWrite = false, this.clippingPlanes = null, this.clipIntersection = false, this.clipShadows = false, this.shadowSide = null, this.colorWrite = true, this.precision = null, this.polygonOffset = false, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = false, this.alphaToCoverage = false, this.premultipliedAlpha = false, this.forceSinglePass = false, this.visible = true, this.toneMapped = true, this.userData = {}, this.version = 0, this._alphaTest = 0;
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(t) {
      this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
    }
    onBuild() {
    }
    onBeforeRender() {
    }
    onBeforeCompile() {
    }
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(t) {
      if (t !== void 0) for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const i = this[e];
        if (i === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[e] = n;
      }
    }
    toJSON(t) {
      const e = t === void 0 || typeof t == "string";
      e && (t = {
        textures: {},
        images: {}
      });
      const n = {
        metadata: {
          version: 4.6,
          type: "Material",
          generator: "Material.toJSON"
        }
      };
      n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== Gi && (n.blending = this.blending), this.side !== Zn && (n.side = this.side), this.vertexColors === true && (n.vertexColors = true), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === true && (n.transparent = true), this.blendSrc !== aa && (n.blendSrc = this.blendSrc), this.blendDst !== la && (n.blendDst = this.blendDst), this.blendEquation !== fi && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== br && (n.depthFunc = this.depthFunc), this.depthTest === false && (n.depthTest = this.depthTest), this.depthWrite === false && (n.depthWrite = this.depthWrite), this.colorWrite === false && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== _c && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Oi && (n.stencilFail = this.stencilFail), this.stencilZFail !== Oi && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Oi && (n.stencilZPass = this.stencilZPass), this.stencilWrite === true && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === true && (n.polygonOffset = true), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === true && (n.dithering = true), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === true && (n.alphaHash = true), this.alphaToCoverage === true && (n.alphaToCoverage = true), this.premultipliedAlpha === true && (n.premultipliedAlpha = true), this.forceSinglePass === true && (n.forceSinglePass = true), this.wireframe === true && (n.wireframe = true), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === true && (n.flatShading = true), this.visible === false && (n.visible = false), this.toneMapped === false && (n.toneMapped = false), this.fog === false && (n.fog = false), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
      function i(s) {
        const o = [];
        for (const a in s) {
          const l = s[a];
          delete l.metadata, o.push(l);
        }
        return o;
      }
      if (e) {
        const s = i(t.textures), o = i(t.images);
        s.length > 0 && (n.textures = s), o.length > 0 && (n.images = o);
      }
      return n;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
      const e = t.clippingPlanes;
      let n = null;
      if (e !== null) {
        const i = e.length;
        n = new Array(i);
        for (let s = 0; s !== i; ++s) n[s] = e[s].clone();
      }
      return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
    set needsUpdate(t) {
      t === true && this.version++;
    }
  }
  class yi extends Ne {
    constructor(t) {
      super(), this.isMeshBasicMaterial = true, this.type = "MeshBasicMaterial", this.color = new xt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.combine = Yr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
    }
  }
  const Hn = Ig();
  function Ig() {
    const r = new ArrayBuffer(4), t = new Float32Array(r), e = new Uint32Array(r), n = new Uint32Array(512), i = new Uint32Array(512);
    for (let l = 0; l < 256; ++l) {
      const c = l - 127;
      c < -27 ? (n[l] = 0, n[l | 256] = 32768, i[l] = 24, i[l | 256] = 24) : c < -14 ? (n[l] = 1024 >> -c - 14, n[l | 256] = 1024 >> -c - 14 | 32768, i[l] = -c - 1, i[l | 256] = -c - 1) : c <= 15 ? (n[l] = c + 15 << 10, n[l | 256] = c + 15 << 10 | 32768, i[l] = 13, i[l | 256] = 13) : c < 128 ? (n[l] = 31744, n[l | 256] = 64512, i[l] = 24, i[l | 256] = 24) : (n[l] = 31744, n[l | 256] = 64512, i[l] = 13, i[l | 256] = 13);
    }
    const s = new Uint32Array(2048), o = new Uint32Array(64), a = new Uint32Array(64);
    for (let l = 1; l < 1024; ++l) {
      let c = l << 13, h = 0;
      for (; !(c & 8388608); ) c <<= 1, h -= 8388608;
      c &= -8388609, h += 947912704, s[l] = c | h;
    }
    for (let l = 1024; l < 2048; ++l) s[l] = 939524096 + (l - 1024 << 13);
    for (let l = 1; l < 31; ++l) o[l] = l << 23;
    o[31] = 1199570944, o[32] = 2147483648;
    for (let l = 33; l < 63; ++l) o[l] = 2147483648 + (l - 32 << 23);
    o[63] = 3347054592;
    for (let l = 1; l < 64; ++l) l !== 32 && (a[l] = 1024);
    return {
      floatView: t,
      uint32View: e,
      baseTable: n,
      shiftTable: i,
      mantissaTable: s,
      exponentTable: o,
      offsetTable: a
    };
  }
  function Ge(r) {
    Math.abs(r) > 65504 && console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."), r = de(r, -65504, 65504), Hn.floatView[0] = r;
    const t = Hn.uint32View[0], e = t >> 23 & 511;
    return Hn.baseTable[e] + ((t & 8388607) >> Hn.shiftTable[e]);
  }
  function fr(r) {
    const t = r >> 10;
    return Hn.uint32View[0] = Hn.mantissaTable[Hn.offsetTable[t] + (r & 1023)] + Hn.exponentTable[t], Hn.floatView[0];
  }
  const Lg = {
    toHalfFloat: Ge,
    fromHalfFloat: fr
  }, _e = new R(), go = new et();
  class se {
    constructor(t, e, n = false) {
      if (Array.isArray(t)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
      this.isBufferAttribute = true, this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = Dr, this._updateRange = {
        offset: 0,
        count: -1
      }, this.updateRanges = [], this.gpuType = fn, this.version = 0;
    }
    onUploadCallback() {
    }
    set needsUpdate(t) {
      t === true && this.version++;
    }
    get updateRange() {
      return Df("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
    }
    setUsage(t) {
      return this.usage = t, this;
    }
    addUpdateRange(t, e) {
      this.updateRanges.push({
        start: t,
        count: e
      });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(t) {
      return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
    }
    copyAt(t, e, n) {
      t *= this.itemSize, n *= e.itemSize;
      for (let i = 0, s = this.itemSize; i < s; i++) this.array[t + i] = e.array[n + i];
      return this;
    }
    copyArray(t) {
      return this.array.set(t), this;
    }
    applyMatrix3(t) {
      if (this.itemSize === 2) for (let e = 0, n = this.count; e < n; e++) go.fromBufferAttribute(this, e), go.applyMatrix3(t), this.setXY(e, go.x, go.y);
      else if (this.itemSize === 3) for (let e = 0, n = this.count; e < n; e++) _e.fromBufferAttribute(this, e), _e.applyMatrix3(t), this.setXYZ(e, _e.x, _e.y, _e.z);
      return this;
    }
    applyMatrix4(t) {
      for (let e = 0, n = this.count; e < n; e++) _e.fromBufferAttribute(this, e), _e.applyMatrix4(t), this.setXYZ(e, _e.x, _e.y, _e.z);
      return this;
    }
    applyNormalMatrix(t) {
      for (let e = 0, n = this.count; e < n; e++) _e.fromBufferAttribute(this, e), _e.applyNormalMatrix(t), this.setXYZ(e, _e.x, _e.y, _e.z);
      return this;
    }
    transformDirection(t) {
      for (let e = 0, n = this.count; e < n; e++) _e.fromBufferAttribute(this, e), _e.transformDirection(t), this.setXYZ(e, _e.x, _e.y, _e.z);
      return this;
    }
    set(t, e = 0) {
      return this.array.set(t, e), this;
    }
    getComponent(t, e) {
      let n = this.array[t * this.itemSize + e];
      return this.normalized && (n = ke(n, this.array)), n;
    }
    setComponent(t, e, n) {
      return this.normalized && (n = kt(n, this.array)), this.array[t * this.itemSize + e] = n, this;
    }
    getX(t) {
      let e = this.array[t * this.itemSize];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setX(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize] = e, this;
    }
    getY(t) {
      let e = this.array[t * this.itemSize + 1];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setY(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
    }
    getZ(t) {
      let e = this.array[t * this.itemSize + 2];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setZ(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
    }
    getW(t) {
      let e = this.array[t * this.itemSize + 3];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setW(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
    }
    setXY(t, e, n) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
    }
    setXYZ(t, e, n, i) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this;
    }
    setXYZW(t, e, n, i, s) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), s = kt(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this.array[t + 3] = s, this;
    }
    onUpload(t) {
      return this.onUploadCallback = t, this;
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      const t = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized
      };
      return this.name !== "" && (t.name = this.name), this.usage !== Dr && (t.usage = this.usage), t;
    }
  }
  class Dg extends se {
    constructor(t, e, n) {
      super(new Int8Array(t), e, n);
    }
  }
  class Ug extends se {
    constructor(t, e, n) {
      super(new Uint8Array(t), e, n);
    }
  }
  class Ng extends se {
    constructor(t, e, n) {
      super(new Uint8ClampedArray(t), e, n);
    }
  }
  class Og extends se {
    constructor(t, e, n) {
      super(new Int16Array(t), e, n);
    }
  }
  class qc extends se {
    constructor(t, e, n) {
      super(new Uint16Array(t), e, n);
    }
  }
  class zg extends se {
    constructor(t, e, n) {
      super(new Int32Array(t), e, n);
    }
  }
  class $c extends se {
    constructor(t, e, n) {
      super(new Uint32Array(t), e, n);
    }
  }
  class Fg extends se {
    constructor(t, e, n) {
      super(new Uint16Array(t), e, n), this.isFloat16BufferAttribute = true;
    }
    getX(t) {
      let e = fr(this.array[t * this.itemSize]);
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setX(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize] = Ge(e), this;
    }
    getY(t) {
      let e = fr(this.array[t * this.itemSize + 1]);
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setY(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 1] = Ge(e), this;
    }
    getZ(t) {
      let e = fr(this.array[t * this.itemSize + 2]);
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setZ(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 2] = Ge(e), this;
    }
    getW(t) {
      let e = fr(this.array[t * this.itemSize + 3]);
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setW(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.array[t * this.itemSize + 3] = Ge(e), this;
    }
    setXY(t, e, n) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.array[t + 0] = Ge(e), this.array[t + 1] = Ge(n), this;
    }
    setXYZ(t, e, n, i) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.array[t + 0] = Ge(e), this.array[t + 1] = Ge(n), this.array[t + 2] = Ge(i), this;
    }
    setXYZW(t, e, n, i, s) {
      return t *= this.itemSize, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), s = kt(s, this.array)), this.array[t + 0] = Ge(e), this.array[t + 1] = Ge(n), this.array[t + 2] = Ge(i), this.array[t + 3] = Ge(s), this;
    }
  }
  class bt extends se {
    constructor(t, e, n) {
      super(new Float32Array(t), e, n);
    }
  }
  let Bg = 0;
  const an = new Dt(), fl = new jt(), fs = new R(), Ke = new De(), er = new De(), Se = new R();
  class Wt extends ei {
    constructor() {
      super(), this.isBufferGeometry = true, Object.defineProperty(this, "id", {
        value: Bg++
      }), this.uuid = sn(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = false, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
        start: 0,
        count: 1 / 0
      }, this.userData = {};
    }
    getIndex() {
      return this.index;
    }
    setIndex(t) {
      return Array.isArray(t) ? this.index = new (If(t) ? $c : qc)(t, 1) : this.index = t, this;
    }
    getAttribute(t) {
      return this.attributes[t];
    }
    setAttribute(t, e) {
      return this.attributes[t] = e, this;
    }
    deleteAttribute(t) {
      return delete this.attributes[t], this;
    }
    hasAttribute(t) {
      return this.attributes[t] !== void 0;
    }
    addGroup(t, e, n = 0) {
      this.groups.push({
        start: t,
        count: e,
        materialIndex: n
      });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(t, e) {
      this.drawRange.start = t, this.drawRange.count = e;
    }
    applyMatrix4(t) {
      const e = this.attributes.position;
      e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = true);
      const n = this.attributes.normal;
      if (n !== void 0) {
        const s = new Bt().getNormalMatrix(t);
        n.applyNormalMatrix(s), n.needsUpdate = true;
      }
      const i = this.attributes.tangent;
      return i !== void 0 && (i.transformDirection(t), i.needsUpdate = true), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
    }
    applyQuaternion(t) {
      return an.makeRotationFromQuaternion(t), this.applyMatrix4(an), this;
    }
    rotateX(t) {
      return an.makeRotationX(t), this.applyMatrix4(an), this;
    }
    rotateY(t) {
      return an.makeRotationY(t), this.applyMatrix4(an), this;
    }
    rotateZ(t) {
      return an.makeRotationZ(t), this.applyMatrix4(an), this;
    }
    translate(t, e, n) {
      return an.makeTranslation(t, e, n), this.applyMatrix4(an), this;
    }
    scale(t, e, n) {
      return an.makeScale(t, e, n), this.applyMatrix4(an), this;
    }
    lookAt(t) {
      return fl.lookAt(t), fl.updateMatrix(), this.applyMatrix4(fl.matrix), this;
    }
    center() {
      return this.computeBoundingBox(), this.boundingBox.getCenter(fs).negate(), this.translate(fs.x, fs.y, fs.z), this;
    }
    setFromPoints(t) {
      const e = [];
      for (let n = 0, i = t.length; n < i; n++) {
        const s = t[n];
        e.push(s.x, s.y, s.z || 0);
      }
      return this.setAttribute("position", new bt(e, 3)), this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new De());
      const t = this.attributes.position, e = this.morphAttributes.position;
      if (t && t.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new R(-1 / 0, -1 / 0, -1 / 0), new R(1 / 0, 1 / 0, 1 / 0));
        return;
      }
      if (t !== void 0) {
        if (this.boundingBox.setFromBufferAttribute(t), e) for (let n = 0, i = e.length; n < i; n++) {
          const s = e[n];
          Ke.setFromBufferAttribute(s), this.morphTargetsRelative ? (Se.addVectors(this.boundingBox.min, Ke.min), this.boundingBox.expandByPoint(Se), Se.addVectors(this.boundingBox.max, Ke.max), this.boundingBox.expandByPoint(Se)) : (this.boundingBox.expandByPoint(Ke.min), this.boundingBox.expandByPoint(Ke.max));
        }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new Ue());
      const t = this.attributes.position, e = this.morphAttributes.position;
      if (t && t.isGLBufferAttribute) {
        console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new R(), 1 / 0);
        return;
      }
      if (t) {
        const n = this.boundingSphere.center;
        if (Ke.setFromBufferAttribute(t), e) for (let s = 0, o = e.length; s < o; s++) {
          const a = e[s];
          er.setFromBufferAttribute(a), this.morphTargetsRelative ? (Se.addVectors(Ke.min, er.min), Ke.expandByPoint(Se), Se.addVectors(Ke.max, er.max), Ke.expandByPoint(Se)) : (Ke.expandByPoint(er.min), Ke.expandByPoint(er.max));
        }
        Ke.getCenter(n);
        let i = 0;
        for (let s = 0, o = t.count; s < o; s++) Se.fromBufferAttribute(t, s), i = Math.max(i, n.distanceToSquared(Se));
        if (e) for (let s = 0, o = e.length; s < o; s++) {
          const a = e[s], l = this.morphTargetsRelative;
          for (let c = 0, h = a.count; c < h; c++) Se.fromBufferAttribute(a, c), l && (fs.fromBufferAttribute(t, c), Se.add(fs)), i = Math.max(i, n.distanceToSquared(Se));
        }
        this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
      }
    }
    computeTangents() {
      const t = this.index, e = this.attributes;
      if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
        console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
        return;
      }
      const n = e.position, i = e.normal, s = e.uv;
      this.hasAttribute("tangent") === false && this.setAttribute("tangent", new se(new Float32Array(4 * n.count), 4));
      const o = this.getAttribute("tangent"), a = [], l = [];
      for (let E = 0; E < n.count; E++) a[E] = new R(), l[E] = new R();
      const c = new R(), h = new R(), d = new R(), u = new et(), f = new et(), m = new et(), _ = new R(), g = new R();
      function p(E, M, y) {
        c.fromBufferAttribute(n, E), h.fromBufferAttribute(n, M), d.fromBufferAttribute(n, y), u.fromBufferAttribute(s, E), f.fromBufferAttribute(s, M), m.fromBufferAttribute(s, y), h.sub(c), d.sub(c), f.sub(u), m.sub(u);
        const C = 1 / (f.x * m.y - m.x * f.y);
        isFinite(C) && (_.copy(h).multiplyScalar(m.y).addScaledVector(d, -f.y).multiplyScalar(C), g.copy(d).multiplyScalar(f.x).addScaledVector(h, -m.x).multiplyScalar(C), a[E].add(_), a[M].add(_), a[y].add(_), l[E].add(g), l[M].add(g), l[y].add(g));
      }
      let v = this.groups;
      v.length === 0 && (v = [
        {
          start: 0,
          count: t.count
        }
      ]);
      for (let E = 0, M = v.length; E < M; ++E) {
        const y = v[E], C = y.start, N = y.count;
        for (let I = C, U = C + N; I < U; I += 3) p(t.getX(I + 0), t.getX(I + 1), t.getX(I + 2));
      }
      const x = new R(), S = new R(), P = new R(), b = new R();
      function T(E) {
        P.fromBufferAttribute(i, E), b.copy(P);
        const M = a[E];
        x.copy(M), x.sub(P.multiplyScalar(P.dot(M))).normalize(), S.crossVectors(b, M);
        const C = S.dot(l[E]) < 0 ? -1 : 1;
        o.setXYZW(E, x.x, x.y, x.z, C);
      }
      for (let E = 0, M = v.length; E < M; ++E) {
        const y = v[E], C = y.start, N = y.count;
        for (let I = C, U = C + N; I < U; I += 3) T(t.getX(I + 0)), T(t.getX(I + 1)), T(t.getX(I + 2));
      }
    }
    computeVertexNormals() {
      const t = this.index, e = this.getAttribute("position");
      if (e !== void 0) {
        let n = this.getAttribute("normal");
        if (n === void 0) n = new se(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
        else for (let u = 0, f = n.count; u < f; u++) n.setXYZ(u, 0, 0, 0);
        const i = new R(), s = new R(), o = new R(), a = new R(), l = new R(), c = new R(), h = new R(), d = new R();
        if (t) for (let u = 0, f = t.count; u < f; u += 3) {
          const m = t.getX(u + 0), _ = t.getX(u + 1), g = t.getX(u + 2);
          i.fromBufferAttribute(e, m), s.fromBufferAttribute(e, _), o.fromBufferAttribute(e, g), h.subVectors(o, s), d.subVectors(i, s), h.cross(d), a.fromBufferAttribute(n, m), l.fromBufferAttribute(n, _), c.fromBufferAttribute(n, g), a.add(h), l.add(h), c.add(h), n.setXYZ(m, a.x, a.y, a.z), n.setXYZ(_, l.x, l.y, l.z), n.setXYZ(g, c.x, c.y, c.z);
        }
        else for (let u = 0, f = e.count; u < f; u += 3) i.fromBufferAttribute(e, u + 0), s.fromBufferAttribute(e, u + 1), o.fromBufferAttribute(e, u + 2), h.subVectors(o, s), d.subVectors(i, s), h.cross(d), n.setXYZ(u + 0, h.x, h.y, h.z), n.setXYZ(u + 1, h.x, h.y, h.z), n.setXYZ(u + 2, h.x, h.y, h.z);
        this.normalizeNormals(), n.needsUpdate = true;
      }
    }
    normalizeNormals() {
      const t = this.attributes.normal;
      for (let e = 0, n = t.count; e < n; e++) Se.fromBufferAttribute(t, e), Se.normalize(), t.setXYZ(e, Se.x, Se.y, Se.z);
    }
    toNonIndexed() {
      function t(a, l) {
        const c = a.array, h = a.itemSize, d = a.normalized, u = new c.constructor(l.length * h);
        let f = 0, m = 0;
        for (let _ = 0, g = l.length; _ < g; _++) {
          a.isInterleavedBufferAttribute ? f = l[_] * a.data.stride + a.offset : f = l[_] * h;
          for (let p = 0; p < h; p++) u[m++] = c[f++];
        }
        return new se(u, h, d);
      }
      if (this.index === null) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
      const e = new Wt(), n = this.index.array, i = this.attributes;
      for (const a in i) {
        const l = i[a], c = t(l, n);
        e.setAttribute(a, c);
      }
      const s = this.morphAttributes;
      for (const a in s) {
        const l = [], c = s[a];
        for (let h = 0, d = c.length; h < d; h++) {
          const u = c[h], f = t(u, n);
          l.push(f);
        }
        e.morphAttributes[a] = l;
      }
      e.morphTargetsRelative = this.morphTargetsRelative;
      const o = this.groups;
      for (let a = 0, l = o.length; a < l; a++) {
        const c = o[a];
        e.addGroup(c.start, c.count, c.materialIndex);
      }
      return e;
    }
    toJSON() {
      const t = {
        metadata: {
          version: 4.6,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON"
        }
      };
      if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
        const l = this.parameters;
        for (const c in l) l[c] !== void 0 && (t[c] = l[c]);
        return t;
      }
      t.data = {
        attributes: {}
      };
      const e = this.index;
      e !== null && (t.data.index = {
        type: e.array.constructor.name,
        array: Array.prototype.slice.call(e.array)
      });
      const n = this.attributes;
      for (const l in n) {
        const c = n[l];
        t.data.attributes[l] = c.toJSON(t.data);
      }
      const i = {};
      let s = false;
      for (const l in this.morphAttributes) {
        const c = this.morphAttributes[l], h = [];
        for (let d = 0, u = c.length; d < u; d++) {
          const f = c[d];
          h.push(f.toJSON(t.data));
        }
        h.length > 0 && (i[l] = h, s = true);
      }
      s && (t.data.morphAttributes = i, t.data.morphTargetsRelative = this.morphTargetsRelative);
      const o = this.groups;
      o.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(o)));
      const a = this.boundingSphere;
      return a !== null && (t.data.boundingSphere = {
        center: a.center.toArray(),
        radius: a.radius
      }), t;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
      const e = {};
      this.name = t.name;
      const n = t.index;
      n !== null && this.setIndex(n.clone(e));
      const i = t.attributes;
      for (const c in i) {
        const h = i[c];
        this.setAttribute(c, h.clone(e));
      }
      const s = t.morphAttributes;
      for (const c in s) {
        const h = [], d = s[c];
        for (let u = 0, f = d.length; u < f; u++) h.push(d[u].clone(e));
        this.morphAttributes[c] = h;
      }
      this.morphTargetsRelative = t.morphTargetsRelative;
      const o = t.groups;
      for (let c = 0, h = o.length; c < h; c++) {
        const d = o[c];
        this.addGroup(d.start, d.count, d.materialIndex);
      }
      const a = t.boundingBox;
      a !== null && (this.boundingBox = a.clone());
      const l = t.boundingSphere;
      return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
    }
    dispose() {
      this.dispatchEvent({
        type: "dispose"
      });
    }
  }
  const qh = new Dt(), Ai = new Gs(), _o = new Ue(), $h = new R(), ps = new R(), ms = new R(), gs = new R(), pl = new R(), xo = new R(), vo = new et(), yo = new et(), Mo = new et(), Zh = new R(), Jh = new R(), Kh = new R(), So = new R(), bo = new R();
  class ae extends jt {
    constructor(t = new Wt(), e = new yi()) {
      super(), this.isMesh = true, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets();
    }
    copy(t, e) {
      return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, n = Object.keys(e);
      if (n.length > 0) {
        const i = e[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let s = 0, o = i.length; s < o; s++) {
            const a = i[s].name || String(s);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
          }
        }
      }
    }
    getVertexPosition(t, e) {
      const n = this.geometry, i = n.attributes.position, s = n.morphAttributes.position, o = n.morphTargetsRelative;
      e.fromBufferAttribute(i, t);
      const a = this.morphTargetInfluences;
      if (s && a) {
        xo.set(0, 0, 0);
        for (let l = 0, c = s.length; l < c; l++) {
          const h = a[l], d = s[l];
          h !== 0 && (pl.fromBufferAttribute(d, t), o ? xo.addScaledVector(pl, h) : xo.addScaledVector(pl.sub(e), h));
        }
        e.add(xo);
      }
      return e;
    }
    raycast(t, e) {
      const n = this.geometry, i = this.material, s = this.matrixWorld;
      i !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), _o.copy(n.boundingSphere), _o.applyMatrix4(s), Ai.copy(t.ray).recast(t.near), !(_o.containsPoint(Ai.origin) === false && (Ai.intersectSphere(_o, $h) === null || Ai.origin.distanceToSquared($h) > (t.far - t.near) ** 2)) && (qh.copy(s).invert(), Ai.copy(t.ray).applyMatrix4(qh), !(n.boundingBox !== null && Ai.intersectsBox(n.boundingBox) === false) && this._computeIntersections(t, e, Ai)));
    }
    _computeIntersections(t, e, n) {
      let i;
      const s = this.geometry, o = this.material, a = s.index, l = s.attributes.position, c = s.attributes.uv, h = s.attributes.uv1, d = s.attributes.normal, u = s.groups, f = s.drawRange;
      if (a !== null) if (Array.isArray(o)) for (let m = 0, _ = u.length; m < _; m++) {
        const g = u[m], p = o[g.materialIndex], v = Math.max(g.start, f.start), x = Math.min(a.count, Math.min(g.start + g.count, f.start + f.count));
        for (let S = v, P = x; S < P; S += 3) {
          const b = a.getX(S), T = a.getX(S + 1), E = a.getX(S + 2);
          i = wo(this, p, t, n, c, h, d, b, T, E), i && (i.faceIndex = Math.floor(S / 3), i.face.materialIndex = g.materialIndex, e.push(i));
        }
      }
      else {
        const m = Math.max(0, f.start), _ = Math.min(a.count, f.start + f.count);
        for (let g = m, p = _; g < p; g += 3) {
          const v = a.getX(g), x = a.getX(g + 1), S = a.getX(g + 2);
          i = wo(this, o, t, n, c, h, d, v, x, S), i && (i.faceIndex = Math.floor(g / 3), e.push(i));
        }
      }
      else if (l !== void 0) if (Array.isArray(o)) for (let m = 0, _ = u.length; m < _; m++) {
        const g = u[m], p = o[g.materialIndex], v = Math.max(g.start, f.start), x = Math.min(l.count, Math.min(g.start + g.count, f.start + f.count));
        for (let S = v, P = x; S < P; S += 3) {
          const b = S, T = S + 1, E = S + 2;
          i = wo(this, p, t, n, c, h, d, b, T, E), i && (i.faceIndex = Math.floor(S / 3), i.face.materialIndex = g.materialIndex, e.push(i));
        }
      }
      else {
        const m = Math.max(0, f.start), _ = Math.min(l.count, f.start + f.count);
        for (let g = m, p = _; g < p; g += 3) {
          const v = g, x = g + 1, S = g + 2;
          i = wo(this, o, t, n, c, h, d, v, x, S), i && (i.faceIndex = Math.floor(g / 3), e.push(i));
        }
      }
    }
  }
  function kg(r, t, e, n, i, s, o, a) {
    let l;
    if (t.side === Ve ? l = n.intersectTriangle(o, s, i, true, a) : l = n.intersectTriangle(i, s, o, t.side === Zn, a), l === null) return null;
    bo.copy(a), bo.applyMatrix4(r.matrixWorld);
    const c = e.ray.origin.distanceTo(bo);
    return c < e.near || c > e.far ? null : {
      distance: c,
      point: bo.clone(),
      object: r
    };
  }
  function wo(r, t, e, n, i, s, o, a, l, c) {
    r.getVertexPosition(a, ps), r.getVertexPosition(l, ms), r.getVertexPosition(c, gs);
    const h = kg(r, t, e, n, ps, ms, gs, So);
    if (h) {
      i && (vo.fromBufferAttribute(i, a), yo.fromBufferAttribute(i, l), Mo.fromBufferAttribute(i, c), h.uv = en.getInterpolation(So, ps, ms, gs, vo, yo, Mo, new et())), s && (vo.fromBufferAttribute(s, a), yo.fromBufferAttribute(s, l), Mo.fromBufferAttribute(s, c), h.uv1 = en.getInterpolation(So, ps, ms, gs, vo, yo, Mo, new et())), o && (Zh.fromBufferAttribute(o, a), Jh.fromBufferAttribute(o, l), Kh.fromBufferAttribute(o, c), h.normal = en.getInterpolation(So, ps, ms, gs, Zh, Jh, Kh, new R()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
      const d = {
        a,
        b: l,
        c,
        normal: new R(),
        materialIndex: 0
      };
      en.getNormal(ps, ms, gs, d.normal), h.face = d;
    }
    return h;
  }
  class ni extends Wt {
    constructor(t = 1, e = 1, n = 1, i = 1, s = 1, o = 1) {
      super(), this.type = "BoxGeometry", this.parameters = {
        width: t,
        height: e,
        depth: n,
        widthSegments: i,
        heightSegments: s,
        depthSegments: o
      };
      const a = this;
      i = Math.floor(i), s = Math.floor(s), o = Math.floor(o);
      const l = [], c = [], h = [], d = [];
      let u = 0, f = 0;
      m("z", "y", "x", -1, -1, n, e, t, o, s, 0), m("z", "y", "x", 1, -1, n, e, -t, o, s, 1), m("x", "z", "y", 1, 1, t, n, e, i, o, 2), m("x", "z", "y", 1, -1, t, n, -e, i, o, 3), m("x", "y", "z", 1, -1, t, e, n, i, s, 4), m("x", "y", "z", -1, -1, t, e, -n, i, s, 5), this.setIndex(l), this.setAttribute("position", new bt(c, 3)), this.setAttribute("normal", new bt(h, 3)), this.setAttribute("uv", new bt(d, 2));
      function m(_, g, p, v, x, S, P, b, T, E, M) {
        const y = S / T, C = P / E, N = S / 2, I = P / 2, U = b / 2, D = T + 1, O = E + 1;
        let H = 0, z = 0;
        const F = new R();
        for (let Y = 0; Y < O; Y++) {
          const nt = Y * C - I;
          for (let dt = 0; dt < D; dt++) {
            const Et = dt * y - N;
            F[_] = Et * v, F[g] = nt * x, F[p] = U, c.push(F.x, F.y, F.z), F[_] = 0, F[g] = 0, F[p] = b > 0 ? 1 : -1, h.push(F.x, F.y, F.z), d.push(dt / T), d.push(1 - Y / E), H += 1;
          }
        }
        for (let Y = 0; Y < E; Y++) for (let nt = 0; nt < T; nt++) {
          const dt = u + nt + D * Y, Et = u + nt + D * (Y + 1), q = u + (nt + 1) + D * (Y + 1), at = u + (nt + 1) + D * Y;
          l.push(dt, Et, at), l.push(Et, q, at), z += 6;
        }
        a.addGroup(f, z, M), f += z, u += H;
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new ni(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
    }
  }
  function Fs(r) {
    const t = {};
    for (const e in r) {
      t[e] = {};
      for (const n in r[e]) {
        const i = r[e][n];
        i && (i.isColor || i.isMatrix3 || i.isMatrix4 || i.isVector2 || i.isVector3 || i.isVector4 || i.isTexture || i.isQuaternion) ? i.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = i.clone() : Array.isArray(i) ? t[e][n] = i.slice() : t[e][n] = i;
      }
    }
    return t;
  }
  function Fe(r) {
    const t = {};
    for (let e = 0; e < r.length; e++) {
      const n = Fs(r[e]);
      for (const i in n) t[i] = n[i];
    }
    return t;
  }
  function Vg(r) {
    const t = [];
    for (let e = 0; e < r.length; e++) t.push(r[e].clone());
    return t;
  }
  function zf(r) {
    const t = r.getRenderTarget();
    return t === null ? r.outputColorSpace : t.isXRRenderTarget === true ? t.texture.colorSpace : ne.workingColorSpace;
  }
  const Ff = {
    clone: Fs,
    merge: Fe
  };
  var Hg = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Gg = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
  class Sn extends Ne {
    constructor(t) {
      super(), this.isShaderMaterial = true, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Hg, this.fragmentShader = Gg, this.linewidth = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.fog = false, this.lights = false, this.clipping = false, this.forceSinglePass = true, this.extensions = {
        clipCullDistance: false,
        multiDraw: false
      }, this.defaultAttributeValues = {
        color: [
          1,
          1,
          1
        ],
        uv: [
          0,
          0
        ],
        uv1: [
          0,
          0
        ]
      }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = false, this.glslVersion = null, t !== void 0 && this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = Fs(t.uniforms), this.uniformsGroups = Vg(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      e.glslVersion = this.glslVersion, e.uniforms = {};
      for (const i in this.uniforms) {
        const o = this.uniforms[i].value;
        o && o.isTexture ? e.uniforms[i] = {
          type: "t",
          value: o.toJSON(t).uuid
        } : o && o.isColor ? e.uniforms[i] = {
          type: "c",
          value: o.getHex()
        } : o && o.isVector2 ? e.uniforms[i] = {
          type: "v2",
          value: o.toArray()
        } : o && o.isVector3 ? e.uniforms[i] = {
          type: "v3",
          value: o.toArray()
        } : o && o.isVector4 ? e.uniforms[i] = {
          type: "v4",
          value: o.toArray()
        } : o && o.isMatrix3 ? e.uniforms[i] = {
          type: "m3",
          value: o.toArray()
        } : o && o.isMatrix4 ? e.uniforms[i] = {
          type: "m4",
          value: o.toArray()
        } : e.uniforms[i] = {
          value: o
        };
      }
      Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
      const n = {};
      for (const i in this.extensions) this.extensions[i] === true && (n[i] = true);
      return Object.keys(n).length > 0 && (e.extensions = n), e;
    }
  }
  class wa extends jt {
    constructor() {
      super(), this.isCamera = true, this.type = "Camera", this.matrixWorldInverse = new Dt(), this.projectionMatrix = new Dt(), this.projectionMatrixInverse = new Dt(), this.coordinateSystem = Rn;
    }
    copy(t, e) {
      return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
    }
    getWorldDirection(t) {
      return super.getWorldDirection(t).negate();
    }
    updateMatrixWorld(t) {
      super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(t, e) {
      super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const ci = new R(), Qh = new et(), jh = new et();
  class be extends wa {
    constructor(t = 50, e = 1, n = 0.1, i = 2e3) {
      super(), this.isPerspectiveCamera = true, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = i, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
    }
    copy(t, e) {
      return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
    }
    setFocalLength(t) {
      const e = 0.5 * this.getFilmHeight() / t;
      this.fov = zs * 2 * Math.atan(e), this.updateProjectionMatrix();
    }
    getFocalLength() {
      const t = Math.tan(Xi * 0.5 * this.fov);
      return 0.5 * this.getFilmHeight() / t;
    }
    getEffectiveFOV() {
      return zs * 2 * Math.atan(Math.tan(Xi * 0.5 * this.fov) / this.zoom);
    }
    getFilmWidth() {
      return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
      return this.filmGauge / Math.max(this.aspect, 1);
    }
    getViewBounds(t, e, n) {
      ci.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(ci.x, ci.y).multiplyScalar(-t / ci.z), ci.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(ci.x, ci.y).multiplyScalar(-t / ci.z);
    }
    getViewSize(t, e) {
      return this.getViewBounds(t, Qh, jh), e.subVectors(jh, Qh);
    }
    setViewOffset(t, e, n, i, s, o) {
      this.aspect = t / e, this.view === null && (this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      }), this.view.enabled = true, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = s, this.view.height = o, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const t = this.near;
      let e = t * Math.tan(Xi * 0.5 * this.fov) / this.zoom, n = 2 * e, i = this.aspect * n, s = -0.5 * i;
      const o = this.view;
      if (this.view !== null && this.view.enabled) {
        const l = o.fullWidth, c = o.fullHeight;
        s += o.offsetX * i / l, e -= o.offsetY * n / c, i *= o.width / l, n *= o.height / c;
      }
      const a = this.filmOffset;
      a !== 0 && (s += t * a / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + i, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
    }
  }
  const _s = -90, xs = 1;
  class Bf extends jt {
    constructor(t, e, n) {
      super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
      const i = new be(_s, xs, t, e);
      i.layers = this.layers, this.add(i);
      const s = new be(_s, xs, t, e);
      s.layers = this.layers, this.add(s);
      const o = new be(_s, xs, t, e);
      o.layers = this.layers, this.add(o);
      const a = new be(_s, xs, t, e);
      a.layers = this.layers, this.add(a);
      const l = new be(_s, xs, t, e);
      l.layers = this.layers, this.add(l);
      const c = new be(_s, xs, t, e);
      c.layers = this.layers, this.add(c);
    }
    updateCoordinateSystem() {
      const t = this.coordinateSystem, e = this.children.concat(), [n, i, s, o, a, l] = e;
      for (const c of e) this.remove(c);
      if (t === Rn) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), i.up.set(0, 1, 0), i.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), o.up.set(0, 0, 1), o.lookAt(0, -1, 0), a.up.set(0, 1, 0), a.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
      else if (t === Ur) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), i.up.set(0, -1, 0), i.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), o.up.set(0, 0, -1), o.lookAt(0, -1, 0), a.up.set(0, -1, 0), a.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
      else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
      for (const c of e) this.add(c), c.updateMatrixWorld();
    }
    update(t, e) {
      this.parent === null && this.updateMatrixWorld();
      const { renderTarget: n, activeMipmapLevel: i } = this;
      this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
      const [s, o, a, l, c, h] = this.children, d = t.getRenderTarget(), u = t.getActiveCubeFace(), f = t.getActiveMipmapLevel(), m = t.xr.enabled;
      t.xr.enabled = false;
      const _ = n.texture.generateMipmaps;
      n.texture.generateMipmaps = false, t.setRenderTarget(n, 0, i), t.render(e, s), t.setRenderTarget(n, 1, i), t.render(e, o), t.setRenderTarget(n, 2, i), t.render(e, a), t.setRenderTarget(n, 3, i), t.render(e, l), t.setRenderTarget(n, 4, i), t.render(e, c), n.texture.generateMipmaps = _, t.setRenderTarget(n, 5, i), t.render(e, h), t.setRenderTarget(d, u, f), t.xr.enabled = m, n.texture.needsPMREMUpdate = true;
    }
  }
  class Zr extends fe {
    constructor(t, e, n, i, s, o, a, l, c, h) {
      t = t !== void 0 ? t : [], e = e !== void 0 ? e : Jn, super(t, e, n, i, s, o, a, l, c, h), this.isCubeTexture = true, this.flipY = false;
    }
    get images() {
      return this.image;
    }
    set images(t) {
      this.image = t;
    }
  }
  class kf extends Mn {
    constructor(t = 1, e = {}) {
      super(t, t, e), this.isWebGLCubeRenderTarget = true;
      const n = {
        width: t,
        height: t,
        depth: 1
      }, i = [
        n,
        n,
        n,
        n,
        n,
        n
      ];
      this.texture = new Zr(i, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = true, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : false, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : xe;
    }
    fromEquirectangularTexture(t, e) {
      this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
      const n = {
        uniforms: {
          tEquirect: {
            value: null
          }
        },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      }, i = new ni(5, 5, 5), s = new Sn({
        name: "CubemapFromEquirect",
        uniforms: Fs(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: Ve,
        blending: Wn
      });
      s.uniforms.tEquirect.value = e;
      const o = new ae(i, s), a = e.minFilter;
      return e.minFilter === Cn && (e.minFilter = xe), new Bf(1, 10, this).update(t, o), e.minFilter = a, o.geometry.dispose(), o.material.dispose(), this;
    }
    clear(t, e, n, i) {
      const s = t.getRenderTarget();
      for (let o = 0; o < 6; o++) t.setRenderTarget(this, o), t.clear(e, n, i);
      t.setRenderTarget(s);
    }
  }
  const ml = new R(), Wg = new R(), Xg = new Bt();
  class di {
    constructor(t = new R(1, 0, 0), e = 0) {
      this.isPlane = true, this.normal = t, this.constant = e;
    }
    set(t, e) {
      return this.normal.copy(t), this.constant = e, this;
    }
    setComponents(t, e, n, i) {
      return this.normal.set(t, e, n), this.constant = i, this;
    }
    setFromNormalAndCoplanarPoint(t, e) {
      return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
    }
    setFromCoplanarPoints(t, e, n) {
      const i = ml.subVectors(n, e).cross(Wg.subVectors(t, e)).normalize();
      return this.setFromNormalAndCoplanarPoint(i, t), this;
    }
    copy(t) {
      return this.normal.copy(t.normal), this.constant = t.constant, this;
    }
    normalize() {
      const t = 1 / this.normal.length();
      return this.normal.multiplyScalar(t), this.constant *= t, this;
    }
    negate() {
      return this.constant *= -1, this.normal.negate(), this;
    }
    distanceToPoint(t) {
      return this.normal.dot(t) + this.constant;
    }
    distanceToSphere(t) {
      return this.distanceToPoint(t.center) - t.radius;
    }
    projectPoint(t, e) {
      return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
    }
    intersectLine(t, e) {
      const n = t.delta(ml), i = this.normal.dot(n);
      if (i === 0) return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
      const s = -(t.start.dot(this.normal) + this.constant) / i;
      return s < 0 || s > 1 ? null : e.copy(t.start).addScaledVector(n, s);
    }
    intersectsLine(t) {
      const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
      return e < 0 && n > 0 || n < 0 && e > 0;
    }
    intersectsBox(t) {
      return t.intersectsPlane(this);
    }
    intersectsSphere(t) {
      return t.intersectsPlane(this);
    }
    coplanarPoint(t) {
      return t.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(t, e) {
      const n = e || Xg.getNormalMatrix(t), i = this.coplanarPoint(ml).applyMatrix4(t), s = this.normal.applyMatrix3(n).normalize();
      return this.constant = -i.dot(s), this;
    }
    translate(t) {
      return this.constant -= t.dot(this.normal), this;
    }
    equals(t) {
      return t.normal.equals(this.normal) && t.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const Ei = new Ue(), To = new R();
  class Jr {
    constructor(t = new di(), e = new di(), n = new di(), i = new di(), s = new di(), o = new di()) {
      this.planes = [
        t,
        e,
        n,
        i,
        s,
        o
      ];
    }
    set(t, e, n, i, s, o) {
      const a = this.planes;
      return a[0].copy(t), a[1].copy(e), a[2].copy(n), a[3].copy(i), a[4].copy(s), a[5].copy(o), this;
    }
    copy(t) {
      const e = this.planes;
      for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
      return this;
    }
    setFromProjectionMatrix(t, e = Rn) {
      const n = this.planes, i = t.elements, s = i[0], o = i[1], a = i[2], l = i[3], c = i[4], h = i[5], d = i[6], u = i[7], f = i[8], m = i[9], _ = i[10], g = i[11], p = i[12], v = i[13], x = i[14], S = i[15];
      if (n[0].setComponents(l - s, u - c, g - f, S - p).normalize(), n[1].setComponents(l + s, u + c, g + f, S + p).normalize(), n[2].setComponents(l + o, u + h, g + m, S + v).normalize(), n[3].setComponents(l - o, u - h, g - m, S - v).normalize(), n[4].setComponents(l - a, u - d, g - _, S - x).normalize(), e === Rn) n[5].setComponents(l + a, u + d, g + _, S + x).normalize();
      else if (e === Ur) n[5].setComponents(a, d, _, x).normalize();
      else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
      return this;
    }
    intersectsObject(t) {
      if (t.boundingSphere !== void 0) t.boundingSphere === null && t.computeBoundingSphere(), Ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
      else {
        const e = t.geometry;
        e.boundingSphere === null && e.computeBoundingSphere(), Ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
      }
      return this.intersectsSphere(Ei);
    }
    intersectsSprite(t) {
      return Ei.center.set(0, 0, 0), Ei.radius = 0.7071067811865476, Ei.applyMatrix4(t.matrixWorld), this.intersectsSphere(Ei);
    }
    intersectsSphere(t) {
      const e = this.planes, n = t.center, i = -t.radius;
      for (let s = 0; s < 6; s++) if (e[s].distanceToPoint(n) < i) return false;
      return true;
    }
    intersectsBox(t) {
      const e = this.planes;
      for (let n = 0; n < 6; n++) {
        const i = e[n];
        if (To.x = i.normal.x > 0 ? t.max.x : t.min.x, To.y = i.normal.y > 0 ? t.max.y : t.min.y, To.z = i.normal.z > 0 ? t.max.z : t.min.z, i.distanceToPoint(To) < 0) return false;
      }
      return true;
    }
    containsPoint(t) {
      const e = this.planes;
      for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return false;
      return true;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  function Vf() {
    let r = null, t = false, e = null, n = null;
    function i(s, o) {
      e(s, o), n = r.requestAnimationFrame(i);
    }
    return {
      start: function() {
        t !== true && e !== null && (n = r.requestAnimationFrame(i), t = true);
      },
      stop: function() {
        r.cancelAnimationFrame(n), t = false;
      },
      setAnimationLoop: function(s) {
        e = s;
      },
      setContext: function(s) {
        r = s;
      }
    };
  }
  function Yg(r) {
    const t = /* @__PURE__ */ new WeakMap();
    function e(a, l) {
      const c = a.array, h = a.usage, d = c.byteLength, u = r.createBuffer();
      r.bindBuffer(l, u), r.bufferData(l, c, h), a.onUploadCallback();
      let f;
      if (c instanceof Float32Array) f = r.FLOAT;
      else if (c instanceof Uint16Array) a.isFloat16BufferAttribute ? f = r.HALF_FLOAT : f = r.UNSIGNED_SHORT;
      else if (c instanceof Int16Array) f = r.SHORT;
      else if (c instanceof Uint32Array) f = r.UNSIGNED_INT;
      else if (c instanceof Int32Array) f = r.INT;
      else if (c instanceof Int8Array) f = r.BYTE;
      else if (c instanceof Uint8Array) f = r.UNSIGNED_BYTE;
      else if (c instanceof Uint8ClampedArray) f = r.UNSIGNED_BYTE;
      else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
      return {
        buffer: u,
        type: f,
        bytesPerElement: c.BYTES_PER_ELEMENT,
        version: a.version,
        size: d
      };
    }
    function n(a, l, c) {
      const h = l.array, d = l._updateRange, u = l.updateRanges;
      if (r.bindBuffer(c, a), d.count === -1 && u.length === 0 && r.bufferSubData(c, 0, h), u.length !== 0) {
        for (let f = 0, m = u.length; f < m; f++) {
          const _ = u[f];
          r.bufferSubData(c, _.start * h.BYTES_PER_ELEMENT, h, _.start, _.count);
        }
        l.clearUpdateRanges();
      }
      d.count !== -1 && (r.bufferSubData(c, d.offset * h.BYTES_PER_ELEMENT, h, d.offset, d.count), d.count = -1), l.onUploadCallback();
    }
    function i(a) {
      return a.isInterleavedBufferAttribute && (a = a.data), t.get(a);
    }
    function s(a) {
      a.isInterleavedBufferAttribute && (a = a.data);
      const l = t.get(a);
      l && (r.deleteBuffer(l.buffer), t.delete(a));
    }
    function o(a, l) {
      if (a.isGLBufferAttribute) {
        const h = t.get(a);
        (!h || h.version < a.version) && t.set(a, {
          buffer: a.buffer,
          type: a.type,
          bytesPerElement: a.elementSize,
          version: a.version
        });
        return;
      }
      a.isInterleavedBufferAttribute && (a = a.data);
      const c = t.get(a);
      if (c === void 0) t.set(a, e(a, l));
      else if (c.version < a.version) {
        if (c.size !== a.array.byteLength) throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
        n(c.buffer, a, l), c.version = a.version;
      }
    }
    return {
      get: i,
      remove: s,
      update: o
    };
  }
  class Ws extends Wt {
    constructor(t = 1, e = 1, n = 1, i = 1) {
      super(), this.type = "PlaneGeometry", this.parameters = {
        width: t,
        height: e,
        widthSegments: n,
        heightSegments: i
      };
      const s = t / 2, o = e / 2, a = Math.floor(n), l = Math.floor(i), c = a + 1, h = l + 1, d = t / a, u = e / l, f = [], m = [], _ = [], g = [];
      for (let p = 0; p < h; p++) {
        const v = p * u - o;
        for (let x = 0; x < c; x++) {
          const S = x * d - s;
          m.push(S, -v, 0), _.push(0, 0, 1), g.push(x / a), g.push(1 - p / l);
        }
      }
      for (let p = 0; p < l; p++) for (let v = 0; v < a; v++) {
        const x = v + c * p, S = v + c * (p + 1), P = v + 1 + c * (p + 1), b = v + 1 + c * p;
        f.push(x, S, b), f.push(S, P, b);
      }
      this.setIndex(f), this.setAttribute("position", new bt(m, 3)), this.setAttribute("normal", new bt(_, 3)), this.setAttribute("uv", new bt(g, 2));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Ws(t.width, t.height, t.widthSegments, t.heightSegments);
    }
  }
  var qg = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, $g = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, Zg = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Jg = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Kg = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Qg = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, jg = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, t0 = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, e0 = `#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, n0 = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`, i0 = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, s0 = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, r0 = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, o0 = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, a0 = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, l0 = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, c0 = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, h0 = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, u0 = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, d0 = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, f0 = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, p0 = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`, m0 = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`, g0 = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, _0 = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, x0 = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, v0 = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, y0 = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, M0 = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, S0 = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, b0 = "gl_FragColor = linearToOutputTexel( gl_FragColor );", w0 = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`, T0 = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, A0 = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, E0 = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, C0 = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, R0 = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, P0 = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, I0 = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, L0 = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, D0 = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, U0 = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, N0 = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, O0 = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, z0 = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, F0 = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, B0 = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, k0 = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, V0 = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, H0 = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, G0 = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, W0 = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, X0 = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Y0 = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, q0 = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, $0 = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Z0 = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, J0 = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, K0 = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Q0 = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, j0 = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, t_ = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, e_ = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, n_ = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, i_ = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, s_ = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, r_ = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[MORPHTARGETS_COUNT];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, o_ = `#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, a_ = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`, l_ = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
	#endif
	#ifdef MORPHTARGETS_TEXTURE
		#ifndef USE_INSTANCING_MORPH
			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		#endif
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`, c_ = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`, h_ = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, u_ = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, d_ = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, f_ = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, p_ = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, m_ = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, g_ = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, __ = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, x_ = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, v_ = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, y_ = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, M_ = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, S_ = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, b_ = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, w_ = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, T_ = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, A_ = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, E_ = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, C_ = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`, R_ = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, P_ = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, I_ = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, L_ = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, D_ = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, U_ = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, N_ = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, O_ = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, z_ = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, F_ = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, B_ = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, k_ = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, V_ = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, H_ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, G_ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, W_ = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, X_ = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
  const Y_ = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, q_ = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, $_ = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Z_ = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, J_ = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, K_ = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Q_ = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, j_ = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`, tx = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, ex = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, nx = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, ix = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, sx = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, rx = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, ox = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, ax = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, lx = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, cx = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, hx = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, ux = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, dx = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, fx = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, px = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, mx = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, gx = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, _x = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, xx = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, vx = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, yx = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, Mx = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Sx = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, bx = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, wx = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Tx = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ht = {
    alphahash_fragment: qg,
    alphahash_pars_fragment: $g,
    alphamap_fragment: Zg,
    alphamap_pars_fragment: Jg,
    alphatest_fragment: Kg,
    alphatest_pars_fragment: Qg,
    aomap_fragment: jg,
    aomap_pars_fragment: t0,
    batching_pars_vertex: e0,
    batching_vertex: n0,
    begin_vertex: i0,
    beginnormal_vertex: s0,
    bsdfs: r0,
    iridescence_fragment: o0,
    bumpmap_pars_fragment: a0,
    clipping_planes_fragment: l0,
    clipping_planes_pars_fragment: c0,
    clipping_planes_pars_vertex: h0,
    clipping_planes_vertex: u0,
    color_fragment: d0,
    color_pars_fragment: f0,
    color_pars_vertex: p0,
    color_vertex: m0,
    common: g0,
    cube_uv_reflection_fragment: _0,
    defaultnormal_vertex: x0,
    displacementmap_pars_vertex: v0,
    displacementmap_vertex: y0,
    emissivemap_fragment: M0,
    emissivemap_pars_fragment: S0,
    colorspace_fragment: b0,
    colorspace_pars_fragment: w0,
    envmap_fragment: T0,
    envmap_common_pars_fragment: A0,
    envmap_pars_fragment: E0,
    envmap_pars_vertex: C0,
    envmap_physical_pars_fragment: B0,
    envmap_vertex: R0,
    fog_vertex: P0,
    fog_pars_vertex: I0,
    fog_fragment: L0,
    fog_pars_fragment: D0,
    gradientmap_pars_fragment: U0,
    lightmap_pars_fragment: N0,
    lights_lambert_fragment: O0,
    lights_lambert_pars_fragment: z0,
    lights_pars_begin: F0,
    lights_toon_fragment: k0,
    lights_toon_pars_fragment: V0,
    lights_phong_fragment: H0,
    lights_phong_pars_fragment: G0,
    lights_physical_fragment: W0,
    lights_physical_pars_fragment: X0,
    lights_fragment_begin: Y0,
    lights_fragment_maps: q0,
    lights_fragment_end: $0,
    logdepthbuf_fragment: Z0,
    logdepthbuf_pars_fragment: J0,
    logdepthbuf_pars_vertex: K0,
    logdepthbuf_vertex: Q0,
    map_fragment: j0,
    map_pars_fragment: t_,
    map_particle_fragment: e_,
    map_particle_pars_fragment: n_,
    metalnessmap_fragment: i_,
    metalnessmap_pars_fragment: s_,
    morphinstance_vertex: r_,
    morphcolor_vertex: o_,
    morphnormal_vertex: a_,
    morphtarget_pars_vertex: l_,
    morphtarget_vertex: c_,
    normal_fragment_begin: h_,
    normal_fragment_maps: u_,
    normal_pars_fragment: d_,
    normal_pars_vertex: f_,
    normal_vertex: p_,
    normalmap_pars_fragment: m_,
    clearcoat_normal_fragment_begin: g_,
    clearcoat_normal_fragment_maps: __,
    clearcoat_pars_fragment: x_,
    iridescence_pars_fragment: v_,
    opaque_fragment: y_,
    packing: M_,
    premultiplied_alpha_fragment: S_,
    project_vertex: b_,
    dithering_fragment: w_,
    dithering_pars_fragment: T_,
    roughnessmap_fragment: A_,
    roughnessmap_pars_fragment: E_,
    shadowmap_pars_fragment: C_,
    shadowmap_pars_vertex: R_,
    shadowmap_vertex: P_,
    shadowmask_pars_fragment: I_,
    skinbase_vertex: L_,
    skinning_pars_vertex: D_,
    skinning_vertex: U_,
    skinnormal_vertex: N_,
    specularmap_fragment: O_,
    specularmap_pars_fragment: z_,
    tonemapping_fragment: F_,
    tonemapping_pars_fragment: B_,
    transmission_fragment: k_,
    transmission_pars_fragment: V_,
    uv_pars_fragment: H_,
    uv_pars_vertex: G_,
    uv_vertex: W_,
    worldpos_vertex: X_,
    background_vert: Y_,
    background_frag: q_,
    backgroundCube_vert: $_,
    backgroundCube_frag: Z_,
    cube_vert: J_,
    cube_frag: K_,
    depth_vert: Q_,
    depth_frag: j_,
    distanceRGBA_vert: tx,
    distanceRGBA_frag: ex,
    equirect_vert: nx,
    equirect_frag: ix,
    linedashed_vert: sx,
    linedashed_frag: rx,
    meshbasic_vert: ox,
    meshbasic_frag: ax,
    meshlambert_vert: lx,
    meshlambert_frag: cx,
    meshmatcap_vert: hx,
    meshmatcap_frag: ux,
    meshnormal_vert: dx,
    meshnormal_frag: fx,
    meshphong_vert: px,
    meshphong_frag: mx,
    meshphysical_vert: gx,
    meshphysical_frag: _x,
    meshtoon_vert: xx,
    meshtoon_frag: vx,
    points_vert: yx,
    points_frag: Mx,
    shadow_vert: Sx,
    shadow_frag: bx,
    sprite_vert: wx,
    sprite_frag: Tx
  }, ht = {
    common: {
      diffuse: {
        value: new xt(16777215)
      },
      opacity: {
        value: 1
      },
      map: {
        value: null
      },
      mapTransform: {
        value: new Bt()
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new Bt()
      },
      alphaTest: {
        value: 0
      }
    },
    specularmap: {
      specularMap: {
        value: null
      },
      specularMapTransform: {
        value: new Bt()
      }
    },
    envmap: {
      envMap: {
        value: null
      },
      envMapRotation: {
        value: new Bt()
      },
      flipEnvMap: {
        value: -1
      },
      reflectivity: {
        value: 1
      },
      ior: {
        value: 1.5
      },
      refractionRatio: {
        value: 0.98
      }
    },
    aomap: {
      aoMap: {
        value: null
      },
      aoMapIntensity: {
        value: 1
      },
      aoMapTransform: {
        value: new Bt()
      }
    },
    lightmap: {
      lightMap: {
        value: null
      },
      lightMapIntensity: {
        value: 1
      },
      lightMapTransform: {
        value: new Bt()
      }
    },
    bumpmap: {
      bumpMap: {
        value: null
      },
      bumpMapTransform: {
        value: new Bt()
      },
      bumpScale: {
        value: 1
      }
    },
    normalmap: {
      normalMap: {
        value: null
      },
      normalMapTransform: {
        value: new Bt()
      },
      normalScale: {
        value: new et(1, 1)
      }
    },
    displacementmap: {
      displacementMap: {
        value: null
      },
      displacementMapTransform: {
        value: new Bt()
      },
      displacementScale: {
        value: 1
      },
      displacementBias: {
        value: 0
      }
    },
    emissivemap: {
      emissiveMap: {
        value: null
      },
      emissiveMapTransform: {
        value: new Bt()
      }
    },
    metalnessmap: {
      metalnessMap: {
        value: null
      },
      metalnessMapTransform: {
        value: new Bt()
      }
    },
    roughnessmap: {
      roughnessMap: {
        value: null
      },
      roughnessMapTransform: {
        value: new Bt()
      }
    },
    gradientmap: {
      gradientMap: {
        value: null
      }
    },
    fog: {
      fogDensity: {
        value: 25e-5
      },
      fogNear: {
        value: 1
      },
      fogFar: {
        value: 2e3
      },
      fogColor: {
        value: new xt(16777215)
      }
    },
    lights: {
      ambientLightColor: {
        value: []
      },
      lightProbe: {
        value: []
      },
      directionalLights: {
        value: [],
        properties: {
          direction: {},
          color: {}
        }
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      directionalShadowMap: {
        value: []
      },
      directionalShadowMatrix: {
        value: []
      },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {}
        }
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {}
        }
      },
      spotLightMap: {
        value: []
      },
      spotShadowMap: {
        value: []
      },
      spotLightMatrix: {
        value: []
      },
      pointLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          decay: {},
          distance: {}
        }
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {}
        }
      },
      pointShadowMap: {
        value: []
      },
      pointShadowMatrix: {
        value: []
      },
      hemisphereLights: {
        value: [],
        properties: {
          direction: {},
          skyColor: {},
          groundColor: {}
        }
      },
      rectAreaLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          width: {},
          height: {}
        }
      },
      ltc_1: {
        value: null
      },
      ltc_2: {
        value: null
      }
    },
    points: {
      diffuse: {
        value: new xt(16777215)
      },
      opacity: {
        value: 1
      },
      size: {
        value: 1
      },
      scale: {
        value: 1
      },
      map: {
        value: null
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new Bt()
      },
      alphaTest: {
        value: 0
      },
      uvTransform: {
        value: new Bt()
      }
    },
    sprite: {
      diffuse: {
        value: new xt(16777215)
      },
      opacity: {
        value: 1
      },
      center: {
        value: new et(0.5, 0.5)
      },
      rotation: {
        value: 0
      },
      map: {
        value: null
      },
      mapTransform: {
        value: new Bt()
      },
      alphaMap: {
        value: null
      },
      alphaMapTransform: {
        value: new Bt()
      },
      alphaTest: {
        value: 0
      }
    }
  }, xn = {
    basic: {
      uniforms: Fe([
        ht.common,
        ht.specularmap,
        ht.envmap,
        ht.aomap,
        ht.lightmap,
        ht.fog
      ]),
      vertexShader: Ht.meshbasic_vert,
      fragmentShader: Ht.meshbasic_frag
    },
    lambert: {
      uniforms: Fe([
        ht.common,
        ht.specularmap,
        ht.envmap,
        ht.aomap,
        ht.lightmap,
        ht.emissivemap,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        ht.fog,
        ht.lights,
        {
          emissive: {
            value: new xt(0)
          }
        }
      ]),
      vertexShader: Ht.meshlambert_vert,
      fragmentShader: Ht.meshlambert_frag
    },
    phong: {
      uniforms: Fe([
        ht.common,
        ht.specularmap,
        ht.envmap,
        ht.aomap,
        ht.lightmap,
        ht.emissivemap,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        ht.fog,
        ht.lights,
        {
          emissive: {
            value: new xt(0)
          },
          specular: {
            value: new xt(1118481)
          },
          shininess: {
            value: 30
          }
        }
      ]),
      vertexShader: Ht.meshphong_vert,
      fragmentShader: Ht.meshphong_frag
    },
    standard: {
      uniforms: Fe([
        ht.common,
        ht.envmap,
        ht.aomap,
        ht.lightmap,
        ht.emissivemap,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        ht.roughnessmap,
        ht.metalnessmap,
        ht.fog,
        ht.lights,
        {
          emissive: {
            value: new xt(0)
          },
          roughness: {
            value: 1
          },
          metalness: {
            value: 0
          },
          envMapIntensity: {
            value: 1
          }
        }
      ]),
      vertexShader: Ht.meshphysical_vert,
      fragmentShader: Ht.meshphysical_frag
    },
    toon: {
      uniforms: Fe([
        ht.common,
        ht.aomap,
        ht.lightmap,
        ht.emissivemap,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        ht.gradientmap,
        ht.fog,
        ht.lights,
        {
          emissive: {
            value: new xt(0)
          }
        }
      ]),
      vertexShader: Ht.meshtoon_vert,
      fragmentShader: Ht.meshtoon_frag
    },
    matcap: {
      uniforms: Fe([
        ht.common,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        ht.fog,
        {
          matcap: {
            value: null
          }
        }
      ]),
      vertexShader: Ht.meshmatcap_vert,
      fragmentShader: Ht.meshmatcap_frag
    },
    points: {
      uniforms: Fe([
        ht.points,
        ht.fog
      ]),
      vertexShader: Ht.points_vert,
      fragmentShader: Ht.points_frag
    },
    dashed: {
      uniforms: Fe([
        ht.common,
        ht.fog,
        {
          scale: {
            value: 1
          },
          dashSize: {
            value: 1
          },
          totalSize: {
            value: 2
          }
        }
      ]),
      vertexShader: Ht.linedashed_vert,
      fragmentShader: Ht.linedashed_frag
    },
    depth: {
      uniforms: Fe([
        ht.common,
        ht.displacementmap
      ]),
      vertexShader: Ht.depth_vert,
      fragmentShader: Ht.depth_frag
    },
    normal: {
      uniforms: Fe([
        ht.common,
        ht.bumpmap,
        ht.normalmap,
        ht.displacementmap,
        {
          opacity: {
            value: 1
          }
        }
      ]),
      vertexShader: Ht.meshnormal_vert,
      fragmentShader: Ht.meshnormal_frag
    },
    sprite: {
      uniforms: Fe([
        ht.sprite,
        ht.fog
      ]),
      vertexShader: Ht.sprite_vert,
      fragmentShader: Ht.sprite_frag
    },
    background: {
      uniforms: {
        uvTransform: {
          value: new Bt()
        },
        t2D: {
          value: null
        },
        backgroundIntensity: {
          value: 1
        }
      },
      vertexShader: Ht.background_vert,
      fragmentShader: Ht.background_frag
    },
    backgroundCube: {
      uniforms: {
        envMap: {
          value: null
        },
        flipEnvMap: {
          value: -1
        },
        backgroundBlurriness: {
          value: 0
        },
        backgroundIntensity: {
          value: 1
        },
        backgroundRotation: {
          value: new Bt()
        }
      },
      vertexShader: Ht.backgroundCube_vert,
      fragmentShader: Ht.backgroundCube_frag
    },
    cube: {
      uniforms: {
        tCube: {
          value: null
        },
        tFlip: {
          value: -1
        },
        opacity: {
          value: 1
        }
      },
      vertexShader: Ht.cube_vert,
      fragmentShader: Ht.cube_frag
    },
    equirect: {
      uniforms: {
        tEquirect: {
          value: null
        }
      },
      vertexShader: Ht.equirect_vert,
      fragmentShader: Ht.equirect_frag
    },
    distanceRGBA: {
      uniforms: Fe([
        ht.common,
        ht.displacementmap,
        {
          referencePosition: {
            value: new R()
          },
          nearDistance: {
            value: 1
          },
          farDistance: {
            value: 1e3
          }
        }
      ]),
      vertexShader: Ht.distanceRGBA_vert,
      fragmentShader: Ht.distanceRGBA_frag
    },
    shadow: {
      uniforms: Fe([
        ht.lights,
        ht.fog,
        {
          color: {
            value: new xt(0)
          },
          opacity: {
            value: 1
          }
        }
      ]),
      vertexShader: Ht.shadow_vert,
      fragmentShader: Ht.shadow_frag
    }
  };
  xn.physical = {
    uniforms: Fe([
      xn.standard.uniforms,
      {
        clearcoat: {
          value: 0
        },
        clearcoatMap: {
          value: null
        },
        clearcoatMapTransform: {
          value: new Bt()
        },
        clearcoatNormalMap: {
          value: null
        },
        clearcoatNormalMapTransform: {
          value: new Bt()
        },
        clearcoatNormalScale: {
          value: new et(1, 1)
        },
        clearcoatRoughness: {
          value: 0
        },
        clearcoatRoughnessMap: {
          value: null
        },
        clearcoatRoughnessMapTransform: {
          value: new Bt()
        },
        dispersion: {
          value: 0
        },
        iridescence: {
          value: 0
        },
        iridescenceMap: {
          value: null
        },
        iridescenceMapTransform: {
          value: new Bt()
        },
        iridescenceIOR: {
          value: 1.3
        },
        iridescenceThicknessMinimum: {
          value: 100
        },
        iridescenceThicknessMaximum: {
          value: 400
        },
        iridescenceThicknessMap: {
          value: null
        },
        iridescenceThicknessMapTransform: {
          value: new Bt()
        },
        sheen: {
          value: 0
        },
        sheenColor: {
          value: new xt(0)
        },
        sheenColorMap: {
          value: null
        },
        sheenColorMapTransform: {
          value: new Bt()
        },
        sheenRoughness: {
          value: 1
        },
        sheenRoughnessMap: {
          value: null
        },
        sheenRoughnessMapTransform: {
          value: new Bt()
        },
        transmission: {
          value: 0
        },
        transmissionMap: {
          value: null
        },
        transmissionMapTransform: {
          value: new Bt()
        },
        transmissionSamplerSize: {
          value: new et()
        },
        transmissionSamplerMap: {
          value: null
        },
        thickness: {
          value: 0
        },
        thicknessMap: {
          value: null
        },
        thicknessMapTransform: {
          value: new Bt()
        },
        attenuationDistance: {
          value: 0
        },
        attenuationColor: {
          value: new xt(0)
        },
        specularColor: {
          value: new xt(1, 1, 1)
        },
        specularColorMap: {
          value: null
        },
        specularColorMapTransform: {
          value: new Bt()
        },
        specularIntensity: {
          value: 1
        },
        specularIntensityMap: {
          value: null
        },
        specularIntensityMapTransform: {
          value: new Bt()
        },
        anisotropyVector: {
          value: new et()
        },
        anisotropyMap: {
          value: null
        },
        anisotropyMapTransform: {
          value: new Bt()
        }
      }
    ]),
    vertexShader: Ht.meshphysical_vert,
    fragmentShader: Ht.meshphysical_frag
  };
  const Ao = {
    r: 0,
    b: 0,
    g: 0
  }, Ci = new rn(), Ax = new Dt();
  function Ex(r, t, e, n, i, s, o) {
    const a = new xt(0);
    let l = s === true ? 0 : 1, c, h, d = null, u = 0, f = null;
    function m(v) {
      let x = v.isScene === true ? v.background : null;
      return x && x.isTexture && (x = (v.backgroundBlurriness > 0 ? e : t).get(x)), x;
    }
    function _(v) {
      let x = false;
      const S = m(v);
      S === null ? p(a, l) : S && S.isColor && (p(S, 1), x = true);
      const P = r.xr.getEnvironmentBlendMode();
      P === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, o) : P === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, o), (r.autoClear || x) && r.clear(r.autoClearColor, r.autoClearDepth, r.autoClearStencil);
    }
    function g(v, x) {
      const S = m(x);
      S && (S.isCubeTexture || S.mapping === Vs) ? (h === void 0 && (h = new ae(new ni(1, 1, 1), new Sn({
        name: "BackgroundCubeMaterial",
        uniforms: Fs(xn.backgroundCube.uniforms),
        vertexShader: xn.backgroundCube.vertexShader,
        fragmentShader: xn.backgroundCube.fragmentShader,
        side: Ve,
        depthTest: false,
        depthWrite: false,
        fog: false
      })), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(P, b, T) {
        this.matrixWorld.copyPosition(T.matrixWorld);
      }, Object.defineProperty(h.material, "envMap", {
        get: function() {
          return this.uniforms.envMap.value;
        }
      }), i.update(h)), Ci.copy(x.backgroundRotation), Ci.x *= -1, Ci.y *= -1, Ci.z *= -1, S.isCubeTexture && S.isRenderTargetTexture === false && (Ci.y *= -1, Ci.z *= -1), h.material.uniforms.envMap.value = S, h.material.uniforms.flipEnvMap.value = S.isCubeTexture && S.isRenderTargetTexture === false ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = x.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = x.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ax.makeRotationFromEuler(Ci)), h.material.toneMapped = ne.getTransfer(S.colorSpace) !== re, (d !== S || u !== S.version || f !== r.toneMapping) && (h.material.needsUpdate = true, d = S, u = S.version, f = r.toneMapping), h.layers.enableAll(), v.unshift(h, h.geometry, h.material, 0, 0, null)) : S && S.isTexture && (c === void 0 && (c = new ae(new Ws(2, 2), new Sn({
        name: "BackgroundMaterial",
        uniforms: Fs(xn.background.uniforms),
        vertexShader: xn.background.vertexShader,
        fragmentShader: xn.background.fragmentShader,
        side: Zn,
        depthTest: false,
        depthWrite: false,
        fog: false
      })), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
        get: function() {
          return this.uniforms.t2D.value;
        }
      }), i.update(c)), c.material.uniforms.t2D.value = S, c.material.uniforms.backgroundIntensity.value = x.backgroundIntensity, c.material.toneMapped = ne.getTransfer(S.colorSpace) !== re, S.matrixAutoUpdate === true && S.updateMatrix(), c.material.uniforms.uvTransform.value.copy(S.matrix), (d !== S || u !== S.version || f !== r.toneMapping) && (c.material.needsUpdate = true, d = S, u = S.version, f = r.toneMapping), c.layers.enableAll(), v.unshift(c, c.geometry, c.material, 0, 0, null));
    }
    function p(v, x) {
      v.getRGB(Ao, zf(r)), n.buffers.color.setClear(Ao.r, Ao.g, Ao.b, x, o);
    }
    return {
      getClearColor: function() {
        return a;
      },
      setClearColor: function(v, x = 1) {
        a.set(v), l = x, p(a, l);
      },
      getClearAlpha: function() {
        return l;
      },
      setClearAlpha: function(v) {
        l = v, p(a, l);
      },
      render: _,
      addToRenderList: g
    };
  }
  function Cx(r, t) {
    const e = r.getParameter(r.MAX_VERTEX_ATTRIBS), n = {}, i = u(null);
    let s = i, o = false;
    function a(y, C, N, I, U) {
      let D = false;
      const O = d(I, N, C);
      s !== O && (s = O, c(s.object)), D = f(y, I, N, U), D && m(y, I, N, U), U !== null && t.update(U, r.ELEMENT_ARRAY_BUFFER), (D || o) && (o = false, S(y, C, N, I), U !== null && r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.get(U).buffer));
    }
    function l() {
      return r.createVertexArray();
    }
    function c(y) {
      return r.bindVertexArray(y);
    }
    function h(y) {
      return r.deleteVertexArray(y);
    }
    function d(y, C, N) {
      const I = N.wireframe === true;
      let U = n[y.id];
      U === void 0 && (U = {}, n[y.id] = U);
      let D = U[C.id];
      D === void 0 && (D = {}, U[C.id] = D);
      let O = D[I];
      return O === void 0 && (O = u(l()), D[I] = O), O;
    }
    function u(y) {
      const C = [], N = [], I = [];
      for (let U = 0; U < e; U++) C[U] = 0, N[U] = 0, I[U] = 0;
      return {
        geometry: null,
        program: null,
        wireframe: false,
        newAttributes: C,
        enabledAttributes: N,
        attributeDivisors: I,
        object: y,
        attributes: {},
        index: null
      };
    }
    function f(y, C, N, I) {
      const U = s.attributes, D = C.attributes;
      let O = 0;
      const H = N.getAttributes();
      for (const z in H) if (H[z].location >= 0) {
        const Y = U[z];
        let nt = D[z];
        if (nt === void 0 && (z === "instanceMatrix" && y.instanceMatrix && (nt = y.instanceMatrix), z === "instanceColor" && y.instanceColor && (nt = y.instanceColor)), Y === void 0 || Y.attribute !== nt || nt && Y.data !== nt.data) return true;
        O++;
      }
      return s.attributesNum !== O || s.index !== I;
    }
    function m(y, C, N, I) {
      const U = {}, D = C.attributes;
      let O = 0;
      const H = N.getAttributes();
      for (const z in H) if (H[z].location >= 0) {
        let Y = D[z];
        Y === void 0 && (z === "instanceMatrix" && y.instanceMatrix && (Y = y.instanceMatrix), z === "instanceColor" && y.instanceColor && (Y = y.instanceColor));
        const nt = {};
        nt.attribute = Y, Y && Y.data && (nt.data = Y.data), U[z] = nt, O++;
      }
      s.attributes = U, s.attributesNum = O, s.index = I;
    }
    function _() {
      const y = s.newAttributes;
      for (let C = 0, N = y.length; C < N; C++) y[C] = 0;
    }
    function g(y) {
      p(y, 0);
    }
    function p(y, C) {
      const N = s.newAttributes, I = s.enabledAttributes, U = s.attributeDivisors;
      N[y] = 1, I[y] === 0 && (r.enableVertexAttribArray(y), I[y] = 1), U[y] !== C && (r.vertexAttribDivisor(y, C), U[y] = C);
    }
    function v() {
      const y = s.newAttributes, C = s.enabledAttributes;
      for (let N = 0, I = C.length; N < I; N++) C[N] !== y[N] && (r.disableVertexAttribArray(N), C[N] = 0);
    }
    function x(y, C, N, I, U, D, O) {
      O === true ? r.vertexAttribIPointer(y, C, N, U, D) : r.vertexAttribPointer(y, C, N, I, U, D);
    }
    function S(y, C, N, I) {
      _();
      const U = I.attributes, D = N.getAttributes(), O = C.defaultAttributeValues;
      for (const H in D) {
        const z = D[H];
        if (z.location >= 0) {
          let F = U[H];
          if (F === void 0 && (H === "instanceMatrix" && y.instanceMatrix && (F = y.instanceMatrix), H === "instanceColor" && y.instanceColor && (F = y.instanceColor)), F !== void 0) {
            const Y = F.normalized, nt = F.itemSize, dt = t.get(F);
            if (dt === void 0) continue;
            const Et = dt.buffer, q = dt.type, at = dt.bytesPerElement, _t = q === r.INT || q === r.UNSIGNED_INT || F.gpuType === Oc;
            if (F.isInterleavedBufferAttribute) {
              const J = F.data, wt = J.stride, Pt = F.offset;
              if (J.isInstancedInterleavedBuffer) {
                for (let B = 0; B < z.locationSize; B++) p(z.location + B, J.meshPerAttribute);
                y.isInstancedMesh !== true && I._maxInstanceCount === void 0 && (I._maxInstanceCount = J.meshPerAttribute * J.count);
              } else for (let B = 0; B < z.locationSize; B++) g(z.location + B);
              r.bindBuffer(r.ARRAY_BUFFER, Et);
              for (let B = 0; B < z.locationSize; B++) x(z.location + B, nt / z.locationSize, q, Y, wt * at, (Pt + nt / z.locationSize * B) * at, _t);
            } else {
              if (F.isInstancedBufferAttribute) {
                for (let J = 0; J < z.locationSize; J++) p(z.location + J, F.meshPerAttribute);
                y.isInstancedMesh !== true && I._maxInstanceCount === void 0 && (I._maxInstanceCount = F.meshPerAttribute * F.count);
              } else for (let J = 0; J < z.locationSize; J++) g(z.location + J);
              r.bindBuffer(r.ARRAY_BUFFER, Et);
              for (let J = 0; J < z.locationSize; J++) x(z.location + J, nt / z.locationSize, q, Y, nt * at, nt / z.locationSize * J * at, _t);
            }
          } else if (O !== void 0) {
            const Y = O[H];
            if (Y !== void 0) switch (Y.length) {
              case 2:
                r.vertexAttrib2fv(z.location, Y);
                break;
              case 3:
                r.vertexAttrib3fv(z.location, Y);
                break;
              case 4:
                r.vertexAttrib4fv(z.location, Y);
                break;
              default:
                r.vertexAttrib1fv(z.location, Y);
            }
          }
        }
      }
      v();
    }
    function P() {
      E();
      for (const y in n) {
        const C = n[y];
        for (const N in C) {
          const I = C[N];
          for (const U in I) h(I[U].object), delete I[U];
          delete C[N];
        }
        delete n[y];
      }
    }
    function b(y) {
      if (n[y.id] === void 0) return;
      const C = n[y.id];
      for (const N in C) {
        const I = C[N];
        for (const U in I) h(I[U].object), delete I[U];
        delete C[N];
      }
      delete n[y.id];
    }
    function T(y) {
      for (const C in n) {
        const N = n[C];
        if (N[y.id] === void 0) continue;
        const I = N[y.id];
        for (const U in I) h(I[U].object), delete I[U];
        delete N[y.id];
      }
    }
    function E() {
      M(), o = true, s !== i && (s = i, c(s.object));
    }
    function M() {
      i.geometry = null, i.program = null, i.wireframe = false;
    }
    return {
      setup: a,
      reset: E,
      resetDefaultState: M,
      dispose: P,
      releaseStatesOfGeometry: b,
      releaseStatesOfProgram: T,
      initAttributes: _,
      enableAttribute: g,
      disableUnusedAttributes: v
    };
  }
  function Rx(r, t, e) {
    let n;
    function i(c) {
      n = c;
    }
    function s(c, h) {
      r.drawArrays(n, c, h), e.update(h, n, 1);
    }
    function o(c, h, d) {
      d !== 0 && (r.drawArraysInstanced(n, c, h, d), e.update(h, n, d));
    }
    function a(c, h, d) {
      if (d === 0) return;
      const u = t.get("WEBGL_multi_draw");
      if (u === null) for (let f = 0; f < d; f++) this.render(c[f], h[f]);
      else {
        u.multiDrawArraysWEBGL(n, c, 0, h, 0, d);
        let f = 0;
        for (let m = 0; m < d; m++) f += h[m];
        e.update(f, n, 1);
      }
    }
    function l(c, h, d, u) {
      if (d === 0) return;
      const f = t.get("WEBGL_multi_draw");
      if (f === null) for (let m = 0; m < c.length; m++) o(c[m], h[m], u[m]);
      else {
        f.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, u, 0, d);
        let m = 0;
        for (let _ = 0; _ < d; _++) m += h[_];
        for (let _ = 0; _ < u.length; _++) e.update(m, n, u[_]);
      }
    }
    this.setMode = i, this.render = s, this.renderInstances = o, this.renderMultiDraw = a, this.renderMultiDrawInstances = l;
  }
  function Px(r, t, e, n) {
    let i;
    function s() {
      if (i !== void 0) return i;
      if (t.has("EXT_texture_filter_anisotropic") === true) {
        const b = t.get("EXT_texture_filter_anisotropic");
        i = r.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else i = 0;
      return i;
    }
    function o(b) {
      return !(b !== nn && n.convert(b) !== r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT));
    }
    function a(b) {
      const T = b === qr && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
      return !(b !== Kn && n.convert(b) !== r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE) && b !== fn && !T);
    }
    function l(b) {
      if (b === "highp") {
        if (r.getShaderPrecisionFormat(r.VERTEX_SHADER, r.HIGH_FLOAT).precision > 0 && r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.HIGH_FLOAT).precision > 0) return "highp";
        b = "mediump";
      }
      return b === "mediump" && r.getShaderPrecisionFormat(r.VERTEX_SHADER, r.MEDIUM_FLOAT).precision > 0 && r.getShaderPrecisionFormat(r.FRAGMENT_SHADER, r.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
    }
    let c = e.precision !== void 0 ? e.precision : "highp";
    const h = l(c);
    h !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
    const d = e.logarithmicDepthBuffer === true, u = r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS), f = r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS), m = r.getParameter(r.MAX_TEXTURE_SIZE), _ = r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE), g = r.getParameter(r.MAX_VERTEX_ATTRIBS), p = r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS), v = r.getParameter(r.MAX_VARYING_VECTORS), x = r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS), S = f > 0, P = r.getParameter(r.MAX_SAMPLES);
    return {
      isWebGL2: true,
      getMaxAnisotropy: s,
      getMaxPrecision: l,
      textureFormatReadable: o,
      textureTypeReadable: a,
      precision: c,
      logarithmicDepthBuffer: d,
      maxTextures: u,
      maxVertexTextures: f,
      maxTextureSize: m,
      maxCubemapSize: _,
      maxAttributes: g,
      maxVertexUniforms: p,
      maxVaryings: v,
      maxFragmentUniforms: x,
      vertexTextures: S,
      maxSamples: P
    };
  }
  function Ix(r) {
    const t = this;
    let e = null, n = 0, i = false, s = false;
    const o = new di(), a = new Bt(), l = {
      value: null,
      needsUpdate: false
    };
    this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(d, u) {
      const f = d.length !== 0 || u || n !== 0 || i;
      return i = u, n = d.length, f;
    }, this.beginShadows = function() {
      s = true, h(null);
    }, this.endShadows = function() {
      s = false;
    }, this.setGlobalState = function(d, u) {
      e = h(d, u, 0);
    }, this.setState = function(d, u, f) {
      const m = d.clippingPlanes, _ = d.clipIntersection, g = d.clipShadows, p = r.get(d);
      if (!i || m === null || m.length === 0 || s && !g) s ? h(null) : c();
      else {
        const v = s ? 0 : n, x = v * 4;
        let S = p.clippingState || null;
        l.value = S, S = h(m, u, x, f);
        for (let P = 0; P !== x; ++P) S[P] = e[P];
        p.clippingState = S, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += v;
      }
    };
    function c() {
      l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
    }
    function h(d, u, f, m) {
      const _ = d !== null ? d.length : 0;
      let g = null;
      if (_ !== 0) {
        if (g = l.value, m !== true || g === null) {
          const p = f + _ * 4, v = u.matrixWorldInverse;
          a.getNormalMatrix(v), (g === null || g.length < p) && (g = new Float32Array(p));
          for (let x = 0, S = f; x !== _; ++x, S += 4) o.copy(d[x]).applyMatrix4(v, a), o.normal.toArray(g, S), g[S + 3] = o.constant;
        }
        l.value = g, l.needsUpdate = true;
      }
      return t.numPlanes = _, t.numIntersection = 0, g;
    }
  }
  function Lx(r) {
    let t = /* @__PURE__ */ new WeakMap();
    function e(o, a) {
      return a === Ns ? o.mapping = Jn : a === wr && (o.mapping = _i), o;
    }
    function n(o) {
      if (o && o.isTexture) {
        const a = o.mapping;
        if (a === Ns || a === wr) if (t.has(o)) {
          const l = t.get(o).texture;
          return e(l, o.mapping);
        } else {
          const l = o.image;
          if (l && l.height > 0) {
            const c = new kf(l.height);
            return c.fromEquirectangularTexture(r, o), t.set(o, c), o.addEventListener("dispose", i), e(c.texture, o.mapping);
          } else return null;
        }
      }
      return o;
    }
    function i(o) {
      const a = o.target;
      a.removeEventListener("dispose", i);
      const l = t.get(a);
      l !== void 0 && (t.delete(a), l.dispose());
    }
    function s() {
      t = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: n,
      dispose: s
    };
  }
  class Ta extends wa {
    constructor(t = -1, e = 1, n = 1, i = -1, s = 0.1, o = 2e3) {
      super(), this.isOrthographicCamera = true, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = i, this.near = s, this.far = o, this.updateProjectionMatrix();
    }
    copy(t, e) {
      return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
    }
    setViewOffset(t, e, n, i, s, o) {
      this.view === null && (this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      }), this.view.enabled = true, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = s, this.view.height = o, this.updateProjectionMatrix();
    }
    clearViewOffset() {
      this.view !== null && (this.view.enabled = false), this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
      const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, i = (this.top + this.bottom) / 2;
      let s = n - t, o = n + t, a = i + e, l = i - e;
      if (this.view !== null && this.view.enabled) {
        const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        s += c * this.view.offsetX, o = s + c * this.view.width, a -= h * this.view.offsetY, l = a - h * this.view.height;
      }
      this.projectionMatrix.makeOrthographic(s, o, a, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
    }
  }
  const Rs = 4, tu = [
    0.125,
    0.215,
    0.35,
    0.446,
    0.526,
    0.582
  ], Fi = 20, gl = new Ta(), eu = new xt();
  let _l = null, xl = 0, vl = 0, yl = false;
  const zi = (1 + Math.sqrt(5)) / 2, vs = 1 / zi, nu = [
    new R(-zi, vs, 0),
    new R(zi, vs, 0),
    new R(-vs, 0, zi),
    new R(vs, 0, zi),
    new R(0, zi, -vs),
    new R(0, zi, vs),
    new R(-1, 1, -1),
    new R(1, 1, -1),
    new R(-1, 1, 1),
    new R(1, 1, 1)
  ];
  class vc {
    constructor(t) {
      this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
    }
    fromScene(t, e = 0, n = 0.1, i = 100) {
      _l = this._renderer.getRenderTarget(), xl = this._renderer.getActiveCubeFace(), vl = this._renderer.getActiveMipmapLevel(), yl = this._renderer.xr.enabled, this._renderer.xr.enabled = false, this._setSize(256);
      const s = this._allocateTargets();
      return s.depthBuffer = true, this._sceneToCubeUV(t, n, i, s), e > 0 && this._blur(s, 0, 0, e), this._applyPMREM(s), this._cleanup(s), s;
    }
    fromEquirectangular(t, e = null) {
      return this._fromTexture(t, e);
    }
    fromCubemap(t, e = null) {
      return this._fromTexture(t, e);
    }
    compileCubemapShader() {
      this._cubemapMaterial === null && (this._cubemapMaterial = ru(), this._compileMaterial(this._cubemapMaterial));
    }
    compileEquirectangularShader() {
      this._equirectMaterial === null && (this._equirectMaterial = su(), this._compileMaterial(this._equirectMaterial));
    }
    dispose() {
      this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
    }
    _setSize(t) {
      this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
    }
    _dispose() {
      this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
      for (let t = 0; t < this._lodPlanes.length; t++) this._lodPlanes[t].dispose();
    }
    _cleanup(t) {
      this._renderer.setRenderTarget(_l, xl, vl), this._renderer.xr.enabled = yl, t.scissorTest = false, Eo(t, 0, 0, t.width, t.height);
    }
    _fromTexture(t, e) {
      t.mapping === Jn || t.mapping === _i ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), _l = this._renderer.getRenderTarget(), xl = this._renderer.getActiveCubeFace(), vl = this._renderer.getActiveMipmapLevel(), yl = this._renderer.xr.enabled, this._renderer.xr.enabled = false;
      const n = e || this._allocateTargets();
      return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
    }
    _allocateTargets() {
      const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
        magFilter: xe,
        minFilter: xe,
        generateMipmaps: false,
        type: qr,
        format: nn,
        colorSpace: ti,
        depthBuffer: false
      }, i = iu(t, e, n);
      if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
        this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = iu(t, e, n);
        const { _lodMax: s } = this;
        ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Dx(s)), this._blurMaterial = Ux(s, t, e);
      }
      return i;
    }
    _compileMaterial(t) {
      const e = new ae(this._lodPlanes[0], t);
      this._renderer.compile(e, gl);
    }
    _sceneToCubeUV(t, e, n, i) {
      const a = new be(90, 1, e, n), l = [
        1,
        -1,
        1,
        1,
        1,
        1
      ], c = [
        1,
        1,
        1,
        -1,
        -1,
        -1
      ], h = this._renderer, d = h.autoClear, u = h.toneMapping;
      h.getClearColor(eu), h.toneMapping = Xn, h.autoClear = false;
      const f = new yi({
        name: "PMREM.Background",
        side: Ve,
        depthWrite: false,
        depthTest: false
      }), m = new ae(new ni(), f);
      let _ = false;
      const g = t.background;
      g ? g.isColor && (f.color.copy(g), t.background = null, _ = true) : (f.color.copy(eu), _ = true);
      for (let p = 0; p < 6; p++) {
        const v = p % 3;
        v === 0 ? (a.up.set(0, l[p], 0), a.lookAt(c[p], 0, 0)) : v === 1 ? (a.up.set(0, 0, l[p]), a.lookAt(0, c[p], 0)) : (a.up.set(0, l[p], 0), a.lookAt(0, 0, c[p]));
        const x = this._cubeSize;
        Eo(i, v * x, p > 2 ? x : 0, x, x), h.setRenderTarget(i), _ && h.render(m, a), h.render(t, a);
      }
      m.geometry.dispose(), m.material.dispose(), h.toneMapping = u, h.autoClear = d, t.background = g;
    }
    _textureToCubeUV(t, e) {
      const n = this._renderer, i = t.mapping === Jn || t.mapping === _i;
      i ? (this._cubemapMaterial === null && (this._cubemapMaterial = ru()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === false ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = su());
      const s = i ? this._cubemapMaterial : this._equirectMaterial, o = new ae(this._lodPlanes[0], s), a = s.uniforms;
      a.envMap.value = t;
      const l = this._cubeSize;
      Eo(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(o, gl);
    }
    _applyPMREM(t) {
      const e = this._renderer, n = e.autoClear;
      e.autoClear = false;
      const i = this._lodPlanes.length;
      for (let s = 1; s < i; s++) {
        const o = Math.sqrt(this._sigmas[s] * this._sigmas[s] - this._sigmas[s - 1] * this._sigmas[s - 1]), a = nu[(i - s - 1) % nu.length];
        this._blur(t, s - 1, s, o, a);
      }
      e.autoClear = n;
    }
    _blur(t, e, n, i, s) {
      const o = this._pingPongRenderTarget;
      this._halfBlur(t, o, e, n, i, "latitudinal", s), this._halfBlur(o, t, n, n, i, "longitudinal", s);
    }
    _halfBlur(t, e, n, i, s, o, a) {
      const l = this._renderer, c = this._blurMaterial;
      o !== "latitudinal" && o !== "longitudinal" && console.error("blur direction must be either latitudinal or longitudinal!");
      const h = 3, d = new ae(this._lodPlanes[i], c), u = c.uniforms, f = this._sizeLods[n] - 1, m = isFinite(s) ? Math.PI / (2 * f) : 2 * Math.PI / (2 * Fi - 1), _ = s / m, g = isFinite(s) ? 1 + Math.floor(h * _) : Fi;
      g > Fi && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Fi}`);
      const p = [];
      let v = 0;
      for (let T = 0; T < Fi; ++T) {
        const E = T / _, M = Math.exp(-E * E / 2);
        p.push(M), T === 0 ? v += M : T < g && (v += 2 * M);
      }
      for (let T = 0; T < p.length; T++) p[T] = p[T] / v;
      u.envMap.value = t.texture, u.samples.value = g, u.weights.value = p, u.latitudinal.value = o === "latitudinal", a && (u.poleAxis.value = a);
      const { _lodMax: x } = this;
      u.dTheta.value = m, u.mipInt.value = x - n;
      const S = this._sizeLods[i], P = 3 * S * (i > x - Rs ? i - x + Rs : 0), b = 4 * (this._cubeSize - S);
      Eo(e, P, b, 3 * S, 2 * S), l.setRenderTarget(e), l.render(d, gl);
    }
  }
  function Dx(r) {
    const t = [], e = [], n = [];
    let i = r;
    const s = r - Rs + 1 + tu.length;
    for (let o = 0; o < s; o++) {
      const a = Math.pow(2, i);
      e.push(a);
      let l = 1 / a;
      o > r - Rs ? l = tu[o - r + Rs - 1] : o === 0 && (l = 0), n.push(l);
      const c = 1 / (a - 2), h = -c, d = 1 + c, u = [
        h,
        h,
        d,
        h,
        d,
        d,
        h,
        h,
        d,
        d,
        h,
        d
      ], f = 6, m = 6, _ = 3, g = 2, p = 1, v = new Float32Array(_ * m * f), x = new Float32Array(g * m * f), S = new Float32Array(p * m * f);
      for (let b = 0; b < f; b++) {
        const T = b % 3 * 2 / 3 - 1, E = b > 2 ? 0 : -1, M = [
          T,
          E,
          0,
          T + 2 / 3,
          E,
          0,
          T + 2 / 3,
          E + 1,
          0,
          T,
          E,
          0,
          T + 2 / 3,
          E + 1,
          0,
          T,
          E + 1,
          0
        ];
        v.set(M, _ * m * b), x.set(u, g * m * b);
        const y = [
          b,
          b,
          b,
          b,
          b,
          b
        ];
        S.set(y, p * m * b);
      }
      const P = new Wt();
      P.setAttribute("position", new se(v, _)), P.setAttribute("uv", new se(x, g)), P.setAttribute("faceIndex", new se(S, p)), t.push(P), i > Rs && i--;
    }
    return {
      lodPlanes: t,
      sizeLods: e,
      sigmas: n
    };
  }
  function iu(r, t, e) {
    const n = new Mn(r, t, e);
    return n.texture.mapping = Vs, n.texture.name = "PMREM.cubeUv", n.scissorTest = true, n;
  }
  function Eo(r, t, e, n, i) {
    r.viewport.set(t, e, n, i), r.scissor.set(t, e, n, i);
  }
  function Ux(r, t, e) {
    const n = new Float32Array(Fi), i = new R(0, 1, 0);
    return new Sn({
      name: "SphericalGaussianBlur",
      defines: {
        n: Fi,
        CUBEUV_TEXEL_WIDTH: 1 / t,
        CUBEUV_TEXEL_HEIGHT: 1 / e,
        CUBEUV_MAX_MIP: `${r}.0`
      },
      uniforms: {
        envMap: {
          value: null
        },
        samples: {
          value: 1
        },
        weights: {
          value: n
        },
        latitudinal: {
          value: false
        },
        dTheta: {
          value: 0
        },
        mipInt: {
          value: 0
        },
        poleAxis: {
          value: i
        }
      },
      vertexShader: Zc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
      blending: Wn,
      depthTest: false,
      depthWrite: false
    });
  }
  function su() {
    return new Sn({
      name: "EquirectangularToCubeUV",
      uniforms: {
        envMap: {
          value: null
        }
      },
      vertexShader: Zc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
      blending: Wn,
      depthTest: false,
      depthWrite: false
    });
  }
  function ru() {
    return new Sn({
      name: "CubemapToCubeUV",
      uniforms: {
        envMap: {
          value: null
        },
        flipEnvMap: {
          value: -1
        }
      },
      vertexShader: Zc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
      blending: Wn,
      depthTest: false,
      depthWrite: false
    });
  }
  function Zc() {
    return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
  }
  function Nx(r) {
    let t = /* @__PURE__ */ new WeakMap(), e = null;
    function n(a) {
      if (a && a.isTexture) {
        const l = a.mapping, c = l === Ns || l === wr, h = l === Jn || l === _i;
        if (c || h) {
          let d = t.get(a);
          const u = d !== void 0 ? d.texture.pmremVersion : 0;
          if (a.isRenderTargetTexture && a.pmremVersion !== u) return e === null && (e = new vc(r)), d = c ? e.fromEquirectangular(a, d) : e.fromCubemap(a, d), d.texture.pmremVersion = a.pmremVersion, t.set(a, d), d.texture;
          if (d !== void 0) return d.texture;
          {
            const f = a.image;
            return c && f && f.height > 0 || h && f && i(f) ? (e === null && (e = new vc(r)), d = c ? e.fromEquirectangular(a) : e.fromCubemap(a), d.texture.pmremVersion = a.pmremVersion, t.set(a, d), a.addEventListener("dispose", s), d.texture) : null;
          }
        }
      }
      return a;
    }
    function i(a) {
      let l = 0;
      const c = 6;
      for (let h = 0; h < c; h++) a[h] !== void 0 && l++;
      return l === c;
    }
    function s(a) {
      const l = a.target;
      l.removeEventListener("dispose", s);
      const c = t.get(l);
      c !== void 0 && (t.delete(l), c.dispose());
    }
    function o() {
      t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
    }
    return {
      get: n,
      dispose: o
    };
  }
  function Ox(r) {
    const t = {};
    function e(n) {
      if (t[n] !== void 0) return t[n];
      let i;
      switch (n) {
        case "WEBGL_depth_texture":
          i = r.getExtension("WEBGL_depth_texture") || r.getExtension("MOZ_WEBGL_depth_texture") || r.getExtension("WEBKIT_WEBGL_depth_texture");
          break;
        case "EXT_texture_filter_anisotropic":
          i = r.getExtension("EXT_texture_filter_anisotropic") || r.getExtension("MOZ_EXT_texture_filter_anisotropic") || r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
          break;
        case "WEBGL_compressed_texture_s3tc":
          i = r.getExtension("WEBGL_compressed_texture_s3tc") || r.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
          break;
        case "WEBGL_compressed_texture_pvrtc":
          i = r.getExtension("WEBGL_compressed_texture_pvrtc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
          break;
        default:
          i = r.getExtension(n);
      }
      return t[n] = i, i;
    }
    return {
      has: function(n) {
        return e(n) !== null;
      },
      init: function() {
        e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance"), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture"), e("WEBGL_render_shared_exponent");
      },
      get: function(n) {
        const i = e(n);
        return i === null && console.warn("THREE.WebGLRenderer: " + n + " extension not supported."), i;
      }
    };
  }
  function zx(r, t, e, n) {
    const i = {}, s = /* @__PURE__ */ new WeakMap();
    function o(d) {
      const u = d.target;
      u.index !== null && t.remove(u.index);
      for (const m in u.attributes) t.remove(u.attributes[m]);
      for (const m in u.morphAttributes) {
        const _ = u.morphAttributes[m];
        for (let g = 0, p = _.length; g < p; g++) t.remove(_[g]);
      }
      u.removeEventListener("dispose", o), delete i[u.id];
      const f = s.get(u);
      f && (t.remove(f), s.delete(u)), n.releaseStatesOfGeometry(u), u.isInstancedBufferGeometry === true && delete u._maxInstanceCount, e.memory.geometries--;
    }
    function a(d, u) {
      return i[u.id] === true || (u.addEventListener("dispose", o), i[u.id] = true, e.memory.geometries++), u;
    }
    function l(d) {
      const u = d.attributes;
      for (const m in u) t.update(u[m], r.ARRAY_BUFFER);
      const f = d.morphAttributes;
      for (const m in f) {
        const _ = f[m];
        for (let g = 0, p = _.length; g < p; g++) t.update(_[g], r.ARRAY_BUFFER);
      }
    }
    function c(d) {
      const u = [], f = d.index, m = d.attributes.position;
      let _ = 0;
      if (f !== null) {
        const v = f.array;
        _ = f.version;
        for (let x = 0, S = v.length; x < S; x += 3) {
          const P = v[x + 0], b = v[x + 1], T = v[x + 2];
          u.push(P, b, b, T, T, P);
        }
      } else if (m !== void 0) {
        const v = m.array;
        _ = m.version;
        for (let x = 0, S = v.length / 3 - 1; x < S; x += 3) {
          const P = x + 0, b = x + 1, T = x + 2;
          u.push(P, b, b, T, T, P);
        }
      } else return;
      const g = new (If(u) ? $c : qc)(u, 1);
      g.version = _;
      const p = s.get(d);
      p && t.remove(p), s.set(d, g);
    }
    function h(d) {
      const u = s.get(d);
      if (u) {
        const f = d.index;
        f !== null && u.version < f.version && c(d);
      } else c(d);
      return s.get(d);
    }
    return {
      get: a,
      update: l,
      getWireframeAttribute: h
    };
  }
  function Fx(r, t, e) {
    let n;
    function i(u) {
      n = u;
    }
    let s, o;
    function a(u) {
      s = u.type, o = u.bytesPerElement;
    }
    function l(u, f) {
      r.drawElements(n, f, s, u * o), e.update(f, n, 1);
    }
    function c(u, f, m) {
      m !== 0 && (r.drawElementsInstanced(n, f, s, u * o, m), e.update(f, n, m));
    }
    function h(u, f, m) {
      if (m === 0) return;
      const _ = t.get("WEBGL_multi_draw");
      if (_ === null) for (let g = 0; g < m; g++) this.render(u[g] / o, f[g]);
      else {
        _.multiDrawElementsWEBGL(n, f, 0, s, u, 0, m);
        let g = 0;
        for (let p = 0; p < m; p++) g += f[p];
        e.update(g, n, 1);
      }
    }
    function d(u, f, m, _) {
      if (m === 0) return;
      const g = t.get("WEBGL_multi_draw");
      if (g === null) for (let p = 0; p < u.length; p++) c(u[p] / o, f[p], _[p]);
      else {
        g.multiDrawElementsInstancedWEBGL(n, f, 0, s, u, 0, _, 0, m);
        let p = 0;
        for (let v = 0; v < m; v++) p += f[v];
        for (let v = 0; v < _.length; v++) e.update(p, n, _[v]);
      }
    }
    this.setMode = i, this.setIndex = a, this.render = l, this.renderInstances = c, this.renderMultiDraw = h, this.renderMultiDrawInstances = d;
  }
  function Bx(r) {
    const t = {
      geometries: 0,
      textures: 0
    }, e = {
      frame: 0,
      calls: 0,
      triangles: 0,
      points: 0,
      lines: 0
    };
    function n(s, o, a) {
      switch (e.calls++, o) {
        case r.TRIANGLES:
          e.triangles += a * (s / 3);
          break;
        case r.LINES:
          e.lines += a * (s / 2);
          break;
        case r.LINE_STRIP:
          e.lines += a * (s - 1);
          break;
        case r.LINE_LOOP:
          e.lines += a * s;
          break;
        case r.POINTS:
          e.points += a * s;
          break;
        default:
          console.error("THREE.WebGLInfo: Unknown draw mode:", o);
          break;
      }
    }
    function i() {
      e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
    }
    return {
      memory: t,
      render: e,
      programs: null,
      autoReset: true,
      reset: i,
      update: n
    };
  }
  function kx(r, t, e) {
    const n = /* @__PURE__ */ new WeakMap(), i = new ie();
    function s(o, a, l) {
      const c = o.morphTargetInfluences, h = a.morphAttributes.position || a.morphAttributes.normal || a.morphAttributes.color, d = h !== void 0 ? h.length : 0;
      let u = n.get(a);
      if (u === void 0 || u.count !== d) {
        let M = function() {
          T.dispose(), n.delete(a), a.removeEventListener("dispose", M);
        };
        u !== void 0 && u.texture.dispose();
        const f = a.morphAttributes.position !== void 0, m = a.morphAttributes.normal !== void 0, _ = a.morphAttributes.color !== void 0, g = a.morphAttributes.position || [], p = a.morphAttributes.normal || [], v = a.morphAttributes.color || [];
        let x = 0;
        f === true && (x = 1), m === true && (x = 2), _ === true && (x = 3);
        let S = a.attributes.position.count * x, P = 1;
        S > t.maxTextureSize && (P = Math.ceil(S / t.maxTextureSize), S = t.maxTextureSize);
        const b = new Float32Array(S * P * 4 * d), T = new Sa(b, S, P, d);
        T.type = fn, T.needsUpdate = true;
        const E = x * 4;
        for (let y = 0; y < d; y++) {
          const C = g[y], N = p[y], I = v[y], U = S * P * 4 * y;
          for (let D = 0; D < C.count; D++) {
            const O = D * E;
            f === true && (i.fromBufferAttribute(C, D), b[U + O + 0] = i.x, b[U + O + 1] = i.y, b[U + O + 2] = i.z, b[U + O + 3] = 0), m === true && (i.fromBufferAttribute(N, D), b[U + O + 4] = i.x, b[U + O + 5] = i.y, b[U + O + 6] = i.z, b[U + O + 7] = 0), _ === true && (i.fromBufferAttribute(I, D), b[U + O + 8] = i.x, b[U + O + 9] = i.y, b[U + O + 10] = i.z, b[U + O + 11] = I.itemSize === 4 ? i.w : 1);
          }
        }
        u = {
          count: d,
          texture: T,
          size: new et(S, P)
        }, n.set(a, u), a.addEventListener("dispose", M);
      }
      if (o.isInstancedMesh === true && o.morphTexture !== null) l.getUniforms().setValue(r, "morphTexture", o.morphTexture, e);
      else {
        let f = 0;
        for (let _ = 0; _ < c.length; _++) f += c[_];
        const m = a.morphTargetsRelative ? 1 : 1 - f;
        l.getUniforms().setValue(r, "morphTargetBaseInfluence", m), l.getUniforms().setValue(r, "morphTargetInfluences", c);
      }
      l.getUniforms().setValue(r, "morphTargetsTexture", u.texture, e), l.getUniforms().setValue(r, "morphTargetsTextureSize", u.size);
    }
    return {
      update: s
    };
  }
  function Vx(r, t, e, n) {
    let i = /* @__PURE__ */ new WeakMap();
    function s(l) {
      const c = n.render.frame, h = l.geometry, d = t.get(l, h);
      if (i.get(d) !== c && (t.update(d), i.set(d, c)), l.isInstancedMesh && (l.hasEventListener("dispose", a) === false && l.addEventListener("dispose", a), i.get(l) !== c && (e.update(l.instanceMatrix, r.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, r.ARRAY_BUFFER), i.set(l, c))), l.isSkinnedMesh) {
        const u = l.skeleton;
        i.get(u) !== c && (u.update(), i.set(u, c));
      }
      return d;
    }
    function o() {
      i = /* @__PURE__ */ new WeakMap();
    }
    function a(l) {
      const c = l.target;
      c.removeEventListener("dispose", a), e.remove(c.instanceMatrix), c.instanceColor !== null && e.remove(c.instanceColor);
    }
    return {
      update: s,
      dispose: o
    };
  }
  class Jc extends fe {
    constructor(t, e, n, i, s, o, a, l, c, h) {
      if (h = h !== void 0 ? h : Wi, h !== Wi && h !== Os) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
      n === void 0 && h === Wi && (n = $i), n === void 0 && h === Os && (n = Hs), super(null, i, s, o, a, l, h, n, c), this.isDepthTexture = true, this.image = {
        width: t,
        height: e
      }, this.magFilter = a !== void 0 ? a : we, this.minFilter = l !== void 0 ? l : we, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
    }
    copy(t) {
      return super.copy(t), this.compareFunction = t.compareFunction, this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
    }
  }
  const Hf = new fe(), Gf = new Jc(1, 1);
  Gf.compareFunction = Wc;
  const Wf = new Sa(), Xf = new Yc(), Yf = new Zr(), ou = [], au = [], lu = new Float32Array(16), cu = new Float32Array(9), hu = new Float32Array(4);
  function Xs(r, t, e) {
    const n = r[0];
    if (n <= 0 || n > 0) return r;
    const i = t * e;
    let s = ou[i];
    if (s === void 0 && (s = new Float32Array(i), ou[i] = s), t !== 0) {
      n.toArray(s, 0);
      for (let o = 1, a = 0; o !== t; ++o) a += e, r[o].toArray(s, a);
    }
    return s;
  }
  function ve(r, t) {
    if (r.length !== t.length) return false;
    for (let e = 0, n = r.length; e < n; e++) if (r[e] !== t[e]) return false;
    return true;
  }
  function ye(r, t) {
    for (let e = 0, n = t.length; e < n; e++) r[e] = t[e];
  }
  function Aa(r, t) {
    let e = au[t];
    e === void 0 && (e = new Int32Array(t), au[t] = e);
    for (let n = 0; n !== t; ++n) e[n] = r.allocateTextureUnit();
    return e;
  }
  function Hx(r, t) {
    const e = this.cache;
    e[0] !== t && (r.uniform1f(this.addr, t), e[0] = t);
  }
  function Gx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (r.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
    else {
      if (ve(e, t)) return;
      r.uniform2fv(this.addr, t), ye(e, t);
    }
  }
  function Wx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (r.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
    else if (t.r !== void 0) (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (r.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
    else {
      if (ve(e, t)) return;
      r.uniform3fv(this.addr, t), ye(e, t);
    }
  }
  function Xx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (r.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
    else {
      if (ve(e, t)) return;
      r.uniform4fv(this.addr, t), ye(e, t);
    }
  }
  function Yx(r, t) {
    const e = this.cache, n = t.elements;
    if (n === void 0) {
      if (ve(e, t)) return;
      r.uniformMatrix2fv(this.addr, false, t), ye(e, t);
    } else {
      if (ve(e, n)) return;
      hu.set(n), r.uniformMatrix2fv(this.addr, false, hu), ye(e, n);
    }
  }
  function qx(r, t) {
    const e = this.cache, n = t.elements;
    if (n === void 0) {
      if (ve(e, t)) return;
      r.uniformMatrix3fv(this.addr, false, t), ye(e, t);
    } else {
      if (ve(e, n)) return;
      cu.set(n), r.uniformMatrix3fv(this.addr, false, cu), ye(e, n);
    }
  }
  function $x(r, t) {
    const e = this.cache, n = t.elements;
    if (n === void 0) {
      if (ve(e, t)) return;
      r.uniformMatrix4fv(this.addr, false, t), ye(e, t);
    } else {
      if (ve(e, n)) return;
      lu.set(n), r.uniformMatrix4fv(this.addr, false, lu), ye(e, n);
    }
  }
  function Zx(r, t) {
    const e = this.cache;
    e[0] !== t && (r.uniform1i(this.addr, t), e[0] = t);
  }
  function Jx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (r.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
    else {
      if (ve(e, t)) return;
      r.uniform2iv(this.addr, t), ye(e, t);
    }
  }
  function Kx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (r.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
    else {
      if (ve(e, t)) return;
      r.uniform3iv(this.addr, t), ye(e, t);
    }
  }
  function Qx(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (r.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
    else {
      if (ve(e, t)) return;
      r.uniform4iv(this.addr, t), ye(e, t);
    }
  }
  function jx(r, t) {
    const e = this.cache;
    e[0] !== t && (r.uniform1ui(this.addr, t), e[0] = t);
  }
  function tv(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y) && (r.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
    else {
      if (ve(e, t)) return;
      r.uniform2uiv(this.addr, t), ye(e, t);
    }
  }
  function ev(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (r.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
    else {
      if (ve(e, t)) return;
      r.uniform3uiv(this.addr, t), ye(e, t);
    }
  }
  function nv(r, t) {
    const e = this.cache;
    if (t.x !== void 0) (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (r.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
    else {
      if (ve(e, t)) return;
      r.uniform4uiv(this.addr, t), ye(e, t);
    }
  }
  function iv(r, t, e) {
    const n = this.cache, i = e.allocateTextureUnit();
    n[0] !== i && (r.uniform1i(this.addr, i), n[0] = i);
    const s = this.type === r.SAMPLER_2D_SHADOW ? Gf : Hf;
    e.setTexture2D(t || s, i);
  }
  function sv(r, t, e) {
    const n = this.cache, i = e.allocateTextureUnit();
    n[0] !== i && (r.uniform1i(this.addr, i), n[0] = i), e.setTexture3D(t || Xf, i);
  }
  function rv(r, t, e) {
    const n = this.cache, i = e.allocateTextureUnit();
    n[0] !== i && (r.uniform1i(this.addr, i), n[0] = i), e.setTextureCube(t || Yf, i);
  }
  function ov(r, t, e) {
    const n = this.cache, i = e.allocateTextureUnit();
    n[0] !== i && (r.uniform1i(this.addr, i), n[0] = i), e.setTexture2DArray(t || Wf, i);
  }
  function av(r) {
    switch (r) {
      case 5126:
        return Hx;
      case 35664:
        return Gx;
      case 35665:
        return Wx;
      case 35666:
        return Xx;
      case 35674:
        return Yx;
      case 35675:
        return qx;
      case 35676:
        return $x;
      case 5124:
      case 35670:
        return Zx;
      case 35667:
      case 35671:
        return Jx;
      case 35668:
      case 35672:
        return Kx;
      case 35669:
      case 35673:
        return Qx;
      case 5125:
        return jx;
      case 36294:
        return tv;
      case 36295:
        return ev;
      case 36296:
        return nv;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return iv;
      case 35679:
      case 36299:
      case 36307:
        return sv;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return rv;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return ov;
    }
  }
  function lv(r, t) {
    r.uniform1fv(this.addr, t);
  }
  function cv(r, t) {
    const e = Xs(t, this.size, 2);
    r.uniform2fv(this.addr, e);
  }
  function hv(r, t) {
    const e = Xs(t, this.size, 3);
    r.uniform3fv(this.addr, e);
  }
  function uv(r, t) {
    const e = Xs(t, this.size, 4);
    r.uniform4fv(this.addr, e);
  }
  function dv(r, t) {
    const e = Xs(t, this.size, 4);
    r.uniformMatrix2fv(this.addr, false, e);
  }
  function fv(r, t) {
    const e = Xs(t, this.size, 9);
    r.uniformMatrix3fv(this.addr, false, e);
  }
  function pv(r, t) {
    const e = Xs(t, this.size, 16);
    r.uniformMatrix4fv(this.addr, false, e);
  }
  function mv(r, t) {
    r.uniform1iv(this.addr, t);
  }
  function gv(r, t) {
    r.uniform2iv(this.addr, t);
  }
  function _v(r, t) {
    r.uniform3iv(this.addr, t);
  }
  function xv(r, t) {
    r.uniform4iv(this.addr, t);
  }
  function vv(r, t) {
    r.uniform1uiv(this.addr, t);
  }
  function yv(r, t) {
    r.uniform2uiv(this.addr, t);
  }
  function Mv(r, t) {
    r.uniform3uiv(this.addr, t);
  }
  function Sv(r, t) {
    r.uniform4uiv(this.addr, t);
  }
  function bv(r, t, e) {
    const n = this.cache, i = t.length, s = Aa(e, i);
    ve(n, s) || (r.uniform1iv(this.addr, s), ye(n, s));
    for (let o = 0; o !== i; ++o) e.setTexture2D(t[o] || Hf, s[o]);
  }
  function wv(r, t, e) {
    const n = this.cache, i = t.length, s = Aa(e, i);
    ve(n, s) || (r.uniform1iv(this.addr, s), ye(n, s));
    for (let o = 0; o !== i; ++o) e.setTexture3D(t[o] || Xf, s[o]);
  }
  function Tv(r, t, e) {
    const n = this.cache, i = t.length, s = Aa(e, i);
    ve(n, s) || (r.uniform1iv(this.addr, s), ye(n, s));
    for (let o = 0; o !== i; ++o) e.setTextureCube(t[o] || Yf, s[o]);
  }
  function Av(r, t, e) {
    const n = this.cache, i = t.length, s = Aa(e, i);
    ve(n, s) || (r.uniform1iv(this.addr, s), ye(n, s));
    for (let o = 0; o !== i; ++o) e.setTexture2DArray(t[o] || Wf, s[o]);
  }
  function Ev(r) {
    switch (r) {
      case 5126:
        return lv;
      case 35664:
        return cv;
      case 35665:
        return hv;
      case 35666:
        return uv;
      case 35674:
        return dv;
      case 35675:
        return fv;
      case 35676:
        return pv;
      case 5124:
      case 35670:
        return mv;
      case 35667:
      case 35671:
        return gv;
      case 35668:
      case 35672:
        return _v;
      case 35669:
      case 35673:
        return xv;
      case 5125:
        return vv;
      case 36294:
        return yv;
      case 36295:
        return Mv;
      case 36296:
        return Sv;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return bv;
      case 35679:
      case 36299:
      case 36307:
        return wv;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return Tv;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return Av;
    }
  }
  class Cv {
    constructor(t, e, n) {
      this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = av(e.type);
    }
  }
  class Rv {
    constructor(t, e, n) {
      this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = Ev(e.type);
    }
  }
  class Pv {
    constructor(t) {
      this.id = t, this.seq = [], this.map = {};
    }
    setValue(t, e, n) {
      const i = this.seq;
      for (let s = 0, o = i.length; s !== o; ++s) {
        const a = i[s];
        a.setValue(t, e[a.id], n);
      }
    }
  }
  const Ml = /(\w+)(\])?(\[|\.)?/g;
  function uu(r, t) {
    r.seq.push(t), r.map[t.id] = t;
  }
  function Iv(r, t, e) {
    const n = r.name, i = n.length;
    for (Ml.lastIndex = 0; ; ) {
      const s = Ml.exec(n), o = Ml.lastIndex;
      let a = s[1];
      const l = s[2] === "]", c = s[3];
      if (l && (a = a | 0), c === void 0 || c === "[" && o + 2 === i) {
        uu(e, c === void 0 ? new Cv(a, r, t) : new Rv(a, r, t));
        break;
      } else {
        let d = e.map[a];
        d === void 0 && (d = new Pv(a), uu(e, d)), e = d;
      }
    }
  }
  class oa {
    constructor(t, e) {
      this.seq = [], this.map = {};
      const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; ++i) {
        const s = t.getActiveUniform(e, i), o = t.getUniformLocation(e, s.name);
        Iv(s, o, this);
      }
    }
    setValue(t, e, n, i) {
      const s = this.map[e];
      s !== void 0 && s.setValue(t, n, i);
    }
    setOptional(t, e, n) {
      const i = e[n];
      i !== void 0 && this.setValue(t, n, i);
    }
    static upload(t, e, n, i) {
      for (let s = 0, o = e.length; s !== o; ++s) {
        const a = e[s], l = n[a.id];
        l.needsUpdate !== false && a.setValue(t, l.value, i);
      }
    }
    static seqWithValue(t, e) {
      const n = [];
      for (let i = 0, s = t.length; i !== s; ++i) {
        const o = t[i];
        o.id in e && n.push(o);
      }
      return n;
    }
  }
  function du(r, t, e) {
    const n = r.createShader(t);
    return r.shaderSource(n, e), r.compileShader(n), n;
  }
  const Lv = 37297;
  let Dv = 0;
  function Uv(r, t) {
    const e = r.split(`
`), n = [], i = Math.max(t - 6, 0), s = Math.min(t + 6, e.length);
    for (let o = i; o < s; o++) {
      const a = o + 1;
      n.push(`${a === t ? ">" : " "} ${a}: ${e[o]}`);
    }
    return n.join(`
`);
  }
  function Nv(r) {
    const t = ne.getPrimaries(ne.workingColorSpace), e = ne.getPrimaries(r);
    let n;
    switch (t === e ? n = "" : t === Lr && e === Ir ? n = "LinearDisplayP3ToLinearSRGB" : t === Ir && e === Lr && (n = "LinearSRGBToLinearDisplayP3"), r) {
      case ti:
      case $r:
        return [
          n,
          "LinearTransferOETF"
        ];
      case un:
      case Ma:
        return [
          n,
          "sRGBTransferOETF"
        ];
      default:
        return console.warn("THREE.WebGLProgram: Unsupported color space:", r), [
          n,
          "LinearTransferOETF"
        ];
    }
  }
  function fu(r, t, e) {
    const n = r.getShaderParameter(t, r.COMPILE_STATUS), i = r.getShaderInfoLog(t).trim();
    if (n && i === "") return "";
    const s = /ERROR: 0:(\d+)/.exec(i);
    if (s) {
      const o = parseInt(s[1]);
      return e.toUpperCase() + `

` + i + `

` + Uv(r.getShaderSource(t), o);
    } else return i;
  }
  function Ov(r, t) {
    const e = Nv(t);
    return `vec4 ${r}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`;
  }
  function zv(r, t) {
    let e;
    switch (t) {
      case tf:
        e = "Linear";
        break;
      case ef:
        e = "Reinhard";
        break;
      case nf:
        e = "OptimizedCineon";
        break;
      case sf:
        e = "ACESFilmic";
        break;
      case of:
        e = "AgX";
        break;
      case af:
        e = "Neutral";
        break;
      case rf:
        e = "Custom";
        break;
      default:
        console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
    }
    return "vec3 " + r + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
  }
  function Fv(r) {
    return [
      r.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
      r.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
    ].filter(pr).join(`
`);
  }
  function Bv(r) {
    const t = [];
    for (const e in r) {
      const n = r[e];
      n !== false && t.push("#define " + e + " " + n);
    }
    return t.join(`
`);
  }
  function kv(r, t) {
    const e = {}, n = r.getProgramParameter(t, r.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < n; i++) {
      const s = r.getActiveAttrib(t, i), o = s.name;
      let a = 1;
      s.type === r.FLOAT_MAT2 && (a = 2), s.type === r.FLOAT_MAT3 && (a = 3), s.type === r.FLOAT_MAT4 && (a = 4), e[o] = {
        type: s.type,
        location: r.getAttribLocation(t, o),
        locationSize: a
      };
    }
    return e;
  }
  function pr(r) {
    return r !== "";
  }
  function pu(r, t) {
    const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
    return r.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
  }
  function mu(r, t) {
    return r.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
  }
  const Vv = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function yc(r) {
    return r.replace(Vv, Gv);
  }
  const Hv = /* @__PURE__ */ new Map();
  function Gv(r, t) {
    let e = Ht[t];
    if (e === void 0) {
      const n = Hv.get(t);
      if (n !== void 0) e = Ht[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
      else throw new Error("Can not resolve #include <" + t + ">");
    }
    return yc(e);
  }
  const Wv = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function gu(r) {
    return r.replace(Wv, Xv);
  }
  function Xv(r, t, e, n) {
    let i = "";
    for (let s = parseInt(t); s < parseInt(e); s++) i += n.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
    return i;
  }
  function _u(r) {
    let t = `precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;
    return r.precision === "highp" ? t += `
#define HIGH_PRECISION` : r.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : r.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
  }
  function Yv(r) {
    let t = "SHADOWMAP_TYPE_BASIC";
    return r.shadowMapType === Lc ? t = "SHADOWMAP_TYPE_PCF" : r.shadowMapType === Dc ? t = "SHADOWMAP_TYPE_PCF_SOFT" : r.shadowMapType === An && (t = "SHADOWMAP_TYPE_VSM"), t;
  }
  function qv(r) {
    let t = "ENVMAP_TYPE_CUBE";
    if (r.envMap) switch (r.envMapMode) {
      case Jn:
      case _i:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Vs:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
    return t;
  }
  function $v(r) {
    let t = "ENVMAP_MODE_REFLECTION";
    if (r.envMap) switch (r.envMapMode) {
      case _i:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
    return t;
  }
  function Zv(r) {
    let t = "ENVMAP_BLENDING_NONE";
    if (r.envMap) switch (r.combine) {
      case Yr:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Qd:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case jd:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
    return t;
  }
  function Jv(r) {
    const t = r.envMapCubeUVHeight;
    if (t === null) return null;
    const e = Math.log2(t) - 2, n = 1 / t;
    return {
      texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 7 * 16)),
      texelHeight: n,
      maxMip: e
    };
  }
  function Kv(r, t, e, n) {
    const i = r.getContext(), s = e.defines;
    let o = e.vertexShader, a = e.fragmentShader;
    const l = Yv(e), c = qv(e), h = $v(e), d = Zv(e), u = Jv(e), f = Fv(e), m = Bv(s), _ = i.createProgram();
    let g, p, v = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
    e.isRawShaderMaterial ? (g = [
      "#define SHADER_TYPE " + e.shaderType,
      "#define SHADER_NAME " + e.shaderName,
      m
    ].filter(pr).join(`
`), g.length > 0 && (g += `
`), p = [
      "#define SHADER_TYPE " + e.shaderType,
      "#define SHADER_NAME " + e.shaderName,
      m
    ].filter(pr).join(`
`), p.length > 0 && (p += `
`)) : (g = [
      _u(e),
      "#define SHADER_TYPE " + e.shaderType,
      "#define SHADER_NAME " + e.shaderName,
      m,
      e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
      e.batching ? "#define USE_BATCHING" : "",
      e.instancing ? "#define USE_INSTANCING" : "",
      e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
      e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
      e.useFog && e.fog ? "#define USE_FOG" : "",
      e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
      e.map ? "#define USE_MAP" : "",
      e.envMap ? "#define USE_ENVMAP" : "",
      e.envMap ? "#define " + h : "",
      e.lightMap ? "#define USE_LIGHTMAP" : "",
      e.aoMap ? "#define USE_AOMAP" : "",
      e.bumpMap ? "#define USE_BUMPMAP" : "",
      e.normalMap ? "#define USE_NORMALMAP" : "",
      e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
      e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
      e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
      e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
      e.anisotropy ? "#define USE_ANISOTROPY" : "",
      e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
      e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
      e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
      e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
      e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
      e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
      e.specularMap ? "#define USE_SPECULARMAP" : "",
      e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
      e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
      e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
      e.metalnessMap ? "#define USE_METALNESSMAP" : "",
      e.alphaMap ? "#define USE_ALPHAMAP" : "",
      e.alphaHash ? "#define USE_ALPHAHASH" : "",
      e.transmission ? "#define USE_TRANSMISSION" : "",
      e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
      e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
      e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
      e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
      e.mapUv ? "#define MAP_UV " + e.mapUv : "",
      e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
      e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
      e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
      e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
      e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
      e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
      e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "",
      e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
      e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
      e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "",
      e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
      e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "",
      e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "",
      e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "",
      e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "",
      e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "",
      e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "",
      e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
      e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "",
      e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "",
      e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "",
      e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
      e.vertexTangents && e.flatShading === false ? "#define USE_TANGENT" : "",
      e.vertexColors ? "#define USE_COLOR" : "",
      e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
      e.vertexUv1s ? "#define USE_UV1" : "",
      e.vertexUv2s ? "#define USE_UV2" : "",
      e.vertexUv3s ? "#define USE_UV3" : "",
      e.pointsUvs ? "#define USE_POINTS_UV" : "",
      e.flatShading ? "#define FLAT_SHADED" : "",
      e.skinning ? "#define USE_SKINNING" : "",
      e.morphTargets ? "#define USE_MORPHTARGETS" : "",
      e.morphNormals && e.flatShading === false ? "#define USE_MORPHNORMALS" : "",
      e.morphColors ? "#define USE_MORPHCOLORS" : "",
      e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE" : "",
      e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "",
      e.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "",
      e.doubleSided ? "#define DOUBLE_SIDED" : "",
      e.flipSided ? "#define FLIP_SIDED" : "",
      e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
      e.shadowMapEnabled ? "#define " + l : "",
      e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
      e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
      e.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
      e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
      "uniform mat4 modelMatrix;",
      "uniform mat4 modelViewMatrix;",
      "uniform mat4 projectionMatrix;",
      "uniform mat4 viewMatrix;",
      "uniform mat3 normalMatrix;",
      "uniform vec3 cameraPosition;",
      "uniform bool isOrthographic;",
      "#ifdef USE_INSTANCING",
      "	attribute mat4 instanceMatrix;",
      "#endif",
      "#ifdef USE_INSTANCING_COLOR",
      "	attribute vec3 instanceColor;",
      "#endif",
      "#ifdef USE_INSTANCING_MORPH",
      "	uniform sampler2D morphTexture;",
      "#endif",
      "attribute vec3 position;",
      "attribute vec3 normal;",
      "attribute vec2 uv;",
      "#ifdef USE_UV1",
      "	attribute vec2 uv1;",
      "#endif",
      "#ifdef USE_UV2",
      "	attribute vec2 uv2;",
      "#endif",
      "#ifdef USE_UV3",
      "	attribute vec2 uv3;",
      "#endif",
      "#ifdef USE_TANGENT",
      "	attribute vec4 tangent;",
      "#endif",
      "#if defined( USE_COLOR_ALPHA )",
      "	attribute vec4 color;",
      "#elif defined( USE_COLOR )",
      "	attribute vec3 color;",
      "#endif",
      "#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )",
      "	attribute vec3 morphTarget0;",
      "	attribute vec3 morphTarget1;",
      "	attribute vec3 morphTarget2;",
      "	attribute vec3 morphTarget3;",
      "	#ifdef USE_MORPHNORMALS",
      "		attribute vec3 morphNormal0;",
      "		attribute vec3 morphNormal1;",
      "		attribute vec3 morphNormal2;",
      "		attribute vec3 morphNormal3;",
      "	#else",
      "		attribute vec3 morphTarget4;",
      "		attribute vec3 morphTarget5;",
      "		attribute vec3 morphTarget6;",
      "		attribute vec3 morphTarget7;",
      "	#endif",
      "#endif",
      "#ifdef USE_SKINNING",
      "	attribute vec4 skinIndex;",
      "	attribute vec4 skinWeight;",
      "#endif",
      `
`
    ].filter(pr).join(`
`), p = [
      _u(e),
      "#define SHADER_TYPE " + e.shaderType,
      "#define SHADER_NAME " + e.shaderName,
      m,
      e.useFog && e.fog ? "#define USE_FOG" : "",
      e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
      e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
      e.map ? "#define USE_MAP" : "",
      e.matcap ? "#define USE_MATCAP" : "",
      e.envMap ? "#define USE_ENVMAP" : "",
      e.envMap ? "#define " + c : "",
      e.envMap ? "#define " + h : "",
      e.envMap ? "#define " + d : "",
      u ? "#define CUBEUV_TEXEL_WIDTH " + u.texelWidth : "",
      u ? "#define CUBEUV_TEXEL_HEIGHT " + u.texelHeight : "",
      u ? "#define CUBEUV_MAX_MIP " + u.maxMip + ".0" : "",
      e.lightMap ? "#define USE_LIGHTMAP" : "",
      e.aoMap ? "#define USE_AOMAP" : "",
      e.bumpMap ? "#define USE_BUMPMAP" : "",
      e.normalMap ? "#define USE_NORMALMAP" : "",
      e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
      e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
      e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
      e.anisotropy ? "#define USE_ANISOTROPY" : "",
      e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
      e.clearcoat ? "#define USE_CLEARCOAT" : "",
      e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
      e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
      e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
      e.dispersion ? "#define USE_DISPERSION" : "",
      e.iridescence ? "#define USE_IRIDESCENCE" : "",
      e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
      e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
      e.specularMap ? "#define USE_SPECULARMAP" : "",
      e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
      e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
      e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
      e.metalnessMap ? "#define USE_METALNESSMAP" : "",
      e.alphaMap ? "#define USE_ALPHAMAP" : "",
      e.alphaTest ? "#define USE_ALPHATEST" : "",
      e.alphaHash ? "#define USE_ALPHAHASH" : "",
      e.sheen ? "#define USE_SHEEN" : "",
      e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
      e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
      e.transmission ? "#define USE_TRANSMISSION" : "",
      e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
      e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
      e.vertexTangents && e.flatShading === false ? "#define USE_TANGENT" : "",
      e.vertexColors || e.instancingColor ? "#define USE_COLOR" : "",
      e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
      e.vertexUv1s ? "#define USE_UV1" : "",
      e.vertexUv2s ? "#define USE_UV2" : "",
      e.vertexUv3s ? "#define USE_UV3" : "",
      e.pointsUvs ? "#define USE_POINTS_UV" : "",
      e.gradientMap ? "#define USE_GRADIENTMAP" : "",
      e.flatShading ? "#define FLAT_SHADED" : "",
      e.doubleSided ? "#define DOUBLE_SIDED" : "",
      e.flipSided ? "#define FLIP_SIDED" : "",
      e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
      e.shadowMapEnabled ? "#define " + l : "",
      e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
      e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
      e.useLegacyLights ? "#define LEGACY_LIGHTS" : "",
      e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
      e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
      "uniform mat4 viewMatrix;",
      "uniform vec3 cameraPosition;",
      "uniform bool isOrthographic;",
      e.toneMapping !== Xn ? "#define TONE_MAPPING" : "",
      e.toneMapping !== Xn ? Ht.tonemapping_pars_fragment : "",
      e.toneMapping !== Xn ? zv("toneMapping", e.toneMapping) : "",
      e.dithering ? "#define DITHERING" : "",
      e.opaque ? "#define OPAQUE" : "",
      Ht.colorspace_pars_fragment,
      Ov("linearToOutputTexel", e.outputColorSpace),
      e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
      `
`
    ].filter(pr).join(`
`)), o = yc(o), o = pu(o, e), o = mu(o, e), a = yc(a), a = pu(a, e), a = mu(a, e), o = gu(o), a = gu(a), e.isRawShaderMaterial !== true && (v = `#version 300 es
`, g = [
      f,
      "#define attribute in",
      "#define varying out",
      "#define texture2D texture"
    ].join(`
`) + `
` + g, p = [
      "#define varying in",
      e.glslVersion === xc ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
      e.glslVersion === xc ? "" : "#define gl_FragColor pc_fragColor",
      "#define gl_FragDepthEXT gl_FragDepth",
      "#define texture2D texture",
      "#define textureCube texture",
      "#define texture2DProj textureProj",
      "#define texture2DLodEXT textureLod",
      "#define texture2DProjLodEXT textureProjLod",
      "#define textureCubeLodEXT textureLod",
      "#define texture2DGradEXT textureGrad",
      "#define texture2DProjGradEXT textureProjGrad",
      "#define textureCubeGradEXT textureGrad"
    ].join(`
`) + `
` + p);
    const x = v + g + o, S = v + p + a, P = du(i, i.VERTEX_SHADER, x), b = du(i, i.FRAGMENT_SHADER, S);
    i.attachShader(_, P), i.attachShader(_, b), e.index0AttributeName !== void 0 ? i.bindAttribLocation(_, 0, e.index0AttributeName) : e.morphTargets === true && i.bindAttribLocation(_, 0, "position"), i.linkProgram(_);
    function T(C) {
      if (r.debug.checkShaderErrors) {
        const N = i.getProgramInfoLog(_).trim(), I = i.getShaderInfoLog(P).trim(), U = i.getShaderInfoLog(b).trim();
        let D = true, O = true;
        if (i.getProgramParameter(_, i.LINK_STATUS) === false) if (D = false, typeof r.debug.onShaderError == "function") r.debug.onShaderError(i, _, P, b);
        else {
          const H = fu(i, P, "vertex"), z = fu(i, b, "fragment");
          console.error("THREE.WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(_, i.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + N + `
` + H + `
` + z);
        }
        else N !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", N) : (I === "" || U === "") && (O = false);
        O && (C.diagnostics = {
          runnable: D,
          programLog: N,
          vertexShader: {
            log: I,
            prefix: g
          },
          fragmentShader: {
            log: U,
            prefix: p
          }
        });
      }
      i.deleteShader(P), i.deleteShader(b), E = new oa(i, _), M = kv(i, _);
    }
    let E;
    this.getUniforms = function() {
      return E === void 0 && T(this), E;
    };
    let M;
    this.getAttributes = function() {
      return M === void 0 && T(this), M;
    };
    let y = e.rendererExtensionParallelShaderCompile === false;
    return this.isReady = function() {
      return y === false && (y = i.getProgramParameter(_, Lv)), y;
    }, this.destroy = function() {
      n.releaseStatesOfProgram(this), i.deleteProgram(_), this.program = void 0;
    }, this.type = e.shaderType, this.name = e.shaderName, this.id = Dv++, this.cacheKey = t, this.usedTimes = 1, this.program = _, this.vertexShader = P, this.fragmentShader = b, this;
  }
  let Qv = 0;
  class jv {
    constructor() {
      this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
    }
    update(t) {
      const e = t.vertexShader, n = t.fragmentShader, i = this._getShaderStage(e), s = this._getShaderStage(n), o = this._getShaderCacheForMaterial(t);
      return o.has(i) === false && (o.add(i), i.usedTimes++), o.has(s) === false && (o.add(s), s.usedTimes++), this;
    }
    remove(t) {
      const e = this.materialCache.get(t);
      for (const n of e) n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
      return this.materialCache.delete(t), this;
    }
    getVertexShaderID(t) {
      return this._getShaderStage(t.vertexShader).id;
    }
    getFragmentShaderID(t) {
      return this._getShaderStage(t.fragmentShader).id;
    }
    dispose() {
      this.shaderCache.clear(), this.materialCache.clear();
    }
    _getShaderCacheForMaterial(t) {
      const e = this.materialCache;
      let n = e.get(t);
      return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
    }
    _getShaderStage(t) {
      const e = this.shaderCache;
      let n = e.get(t);
      return n === void 0 && (n = new ty(t), e.set(t, n)), n;
    }
  }
  class ty {
    constructor(t) {
      this.id = Qv++, this.code = t, this.usedTimes = 0;
    }
  }
  function ey(r, t, e, n, i, s, o) {
    const a = new ba(), l = new jv(), c = /* @__PURE__ */ new Set(), h = [], d = i.logarithmicDepthBuffer, u = i.vertexTextures;
    let f = i.precision;
    const m = {
      MeshDepthMaterial: "depth",
      MeshDistanceMaterial: "distanceRGBA",
      MeshNormalMaterial: "normal",
      MeshBasicMaterial: "basic",
      MeshLambertMaterial: "lambert",
      MeshPhongMaterial: "phong",
      MeshToonMaterial: "toon",
      MeshStandardMaterial: "physical",
      MeshPhysicalMaterial: "physical",
      MeshMatcapMaterial: "matcap",
      LineBasicMaterial: "basic",
      LineDashedMaterial: "dashed",
      PointsMaterial: "points",
      ShadowMaterial: "shadow",
      SpriteMaterial: "sprite"
    };
    function _(M) {
      return c.add(M), M === 0 ? "uv" : `uv${M}`;
    }
    function g(M, y, C, N, I) {
      const U = N.fog, D = I.geometry, O = M.isMeshStandardMaterial ? N.environment : null, H = (M.isMeshStandardMaterial ? e : t).get(M.envMap || O), z = H && H.mapping === Vs ? H.image.height : null, F = m[M.type];
      M.precision !== null && (f = i.getMaxPrecision(M.precision), f !== M.precision && console.warn("THREE.WebGLProgram.getParameters:", M.precision, "not supported, using", f, "instead."));
      const Y = D.morphAttributes.position || D.morphAttributes.normal || D.morphAttributes.color, nt = Y !== void 0 ? Y.length : 0;
      let dt = 0;
      D.morphAttributes.position !== void 0 && (dt = 1), D.morphAttributes.normal !== void 0 && (dt = 2), D.morphAttributes.color !== void 0 && (dt = 3);
      let Et, q, at, _t;
      if (F) {
        const ee = xn[F];
        Et = ee.vertexShader, q = ee.fragmentShader;
      } else Et = M.vertexShader, q = M.fragmentShader, l.update(M), at = l.getVertexShaderID(M), _t = l.getFragmentShaderID(M);
      const J = r.getRenderTarget(), wt = I.isInstancedMesh === true, Pt = I.isBatchedMesh === true, B = !!M.map, Ot = !!M.matcap, Z = !!H, j = !!M.aoMap, K = !!M.lightMap, lt = !!M.bumpMap, it = !!M.normalMap, vt = !!M.displacementMap, It = !!M.emissiveMap, L = !!M.metalnessMap, w = !!M.roughnessMap, G = M.anisotropy > 0, tt = M.clearcoat > 0, ot = M.dispersion > 0, st = M.iridescence > 0, Lt = M.sheen > 0, pt = M.transmission > 0, ft = G && !!M.anisotropyMap, Vt = tt && !!M.clearcoatMap, ct = tt && !!M.clearcoatNormalMap, Rt = tt && !!M.clearcoatRoughnessMap, Zt = st && !!M.iridescenceMap, Ut = st && !!M.iridescenceThicknessMap, St = Lt && !!M.sheenColorMap, Xt = Lt && !!M.sheenRoughnessMap, Jt = !!M.specularMap, pe = !!M.specularColorMap, Yt = !!M.specularIntensityMap, k = pt && !!M.transmissionMap, rt = pt && !!M.thicknessMap, Q = !!M.gradientMap, mt = !!M.alphaMap, Mt = M.alphaTest > 0, Qt = !!M.alphaHash, oe = !!M.extensions;
      let he = Xn;
      M.toneMapped && (J === null || J.isXRRenderTarget === true) && (he = r.toneMapping);
      const Ee = {
        shaderID: F,
        shaderType: M.type,
        shaderName: M.name,
        vertexShader: Et,
        fragmentShader: q,
        defines: M.defines,
        customVertexShaderID: at,
        customFragmentShaderID: _t,
        isRawShaderMaterial: M.isRawShaderMaterial === true,
        glslVersion: M.glslVersion,
        precision: f,
        batching: Pt,
        instancing: wt,
        instancingColor: wt && I.instanceColor !== null,
        instancingMorph: wt && I.morphTexture !== null,
        supportsVertexTextures: u,
        outputColorSpace: J === null ? r.outputColorSpace : J.isXRRenderTarget === true ? J.texture.colorSpace : ti,
        alphaToCoverage: !!M.alphaToCoverage,
        map: B,
        matcap: Ot,
        envMap: Z,
        envMapMode: Z && H.mapping,
        envMapCubeUVHeight: z,
        aoMap: j,
        lightMap: K,
        bumpMap: lt,
        normalMap: it,
        displacementMap: u && vt,
        emissiveMap: It,
        normalMapObjectSpace: it && M.normalMapType === bf,
        normalMapTangentSpace: it && M.normalMapType === vi,
        metalnessMap: L,
        roughnessMap: w,
        anisotropy: G,
        anisotropyMap: ft,
        clearcoat: tt,
        clearcoatMap: Vt,
        clearcoatNormalMap: ct,
        clearcoatRoughnessMap: Rt,
        dispersion: ot,
        iridescence: st,
        iridescenceMap: Zt,
        iridescenceThicknessMap: Ut,
        sheen: Lt,
        sheenColorMap: St,
        sheenRoughnessMap: Xt,
        specularMap: Jt,
        specularColorMap: pe,
        specularIntensityMap: Yt,
        transmission: pt,
        transmissionMap: k,
        thicknessMap: rt,
        gradientMap: Q,
        opaque: M.transparent === false && M.blending === Gi && M.alphaToCoverage === false,
        alphaMap: mt,
        alphaTest: Mt,
        alphaHash: Qt,
        combine: M.combine,
        mapUv: B && _(M.map.channel),
        aoMapUv: j && _(M.aoMap.channel),
        lightMapUv: K && _(M.lightMap.channel),
        bumpMapUv: lt && _(M.bumpMap.channel),
        normalMapUv: it && _(M.normalMap.channel),
        displacementMapUv: vt && _(M.displacementMap.channel),
        emissiveMapUv: It && _(M.emissiveMap.channel),
        metalnessMapUv: L && _(M.metalnessMap.channel),
        roughnessMapUv: w && _(M.roughnessMap.channel),
        anisotropyMapUv: ft && _(M.anisotropyMap.channel),
        clearcoatMapUv: Vt && _(M.clearcoatMap.channel),
        clearcoatNormalMapUv: ct && _(M.clearcoatNormalMap.channel),
        clearcoatRoughnessMapUv: Rt && _(M.clearcoatRoughnessMap.channel),
        iridescenceMapUv: Zt && _(M.iridescenceMap.channel),
        iridescenceThicknessMapUv: Ut && _(M.iridescenceThicknessMap.channel),
        sheenColorMapUv: St && _(M.sheenColorMap.channel),
        sheenRoughnessMapUv: Xt && _(M.sheenRoughnessMap.channel),
        specularMapUv: Jt && _(M.specularMap.channel),
        specularColorMapUv: pe && _(M.specularColorMap.channel),
        specularIntensityMapUv: Yt && _(M.specularIntensityMap.channel),
        transmissionMapUv: k && _(M.transmissionMap.channel),
        thicknessMapUv: rt && _(M.thicknessMap.channel),
        alphaMapUv: mt && _(M.alphaMap.channel),
        vertexTangents: !!D.attributes.tangent && (it || G),
        vertexColors: M.vertexColors,
        vertexAlphas: M.vertexColors === true && !!D.attributes.color && D.attributes.color.itemSize === 4,
        pointsUvs: I.isPoints === true && !!D.attributes.uv && (B || mt),
        fog: !!U,
        useFog: M.fog === true,
        fogExp2: !!U && U.isFogExp2,
        flatShading: M.flatShading === true,
        sizeAttenuation: M.sizeAttenuation === true,
        logarithmicDepthBuffer: d,
        skinning: I.isSkinnedMesh === true,
        morphTargets: D.morphAttributes.position !== void 0,
        morphNormals: D.morphAttributes.normal !== void 0,
        morphColors: D.morphAttributes.color !== void 0,
        morphTargetsCount: nt,
        morphTextureStride: dt,
        numDirLights: y.directional.length,
        numPointLights: y.point.length,
        numSpotLights: y.spot.length,
        numSpotLightMaps: y.spotLightMap.length,
        numRectAreaLights: y.rectArea.length,
        numHemiLights: y.hemi.length,
        numDirLightShadows: y.directionalShadowMap.length,
        numPointLightShadows: y.pointShadowMap.length,
        numSpotLightShadows: y.spotShadowMap.length,
        numSpotLightShadowsWithMaps: y.numSpotLightShadowsWithMaps,
        numLightProbes: y.numLightProbes,
        numClippingPlanes: o.numPlanes,
        numClipIntersection: o.numIntersection,
        dithering: M.dithering,
        shadowMapEnabled: r.shadowMap.enabled && C.length > 0,
        shadowMapType: r.shadowMap.type,
        toneMapping: he,
        useLegacyLights: r._useLegacyLights,
        decodeVideoTexture: B && M.map.isVideoTexture === true && ne.getTransfer(M.map.colorSpace) === re,
        premultipliedAlpha: M.premultipliedAlpha,
        doubleSided: M.side === Xe,
        flipSided: M.side === Ve,
        useDepthPacking: M.depthPacking >= 0,
        depthPacking: M.depthPacking || 0,
        index0AttributeName: M.index0AttributeName,
        extensionClipCullDistance: oe && M.extensions.clipCullDistance === true && n.has("WEBGL_clip_cull_distance"),
        extensionMultiDraw: oe && M.extensions.multiDraw === true && n.has("WEBGL_multi_draw"),
        rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
        customProgramCacheKey: M.customProgramCacheKey()
      };
      return Ee.vertexUv1s = c.has(1), Ee.vertexUv2s = c.has(2), Ee.vertexUv3s = c.has(3), c.clear(), Ee;
    }
    function p(M) {
      const y = [];
      if (M.shaderID ? y.push(M.shaderID) : (y.push(M.customVertexShaderID), y.push(M.customFragmentShaderID)), M.defines !== void 0) for (const C in M.defines) y.push(C), y.push(M.defines[C]);
      return M.isRawShaderMaterial === false && (v(y, M), x(y, M), y.push(r.outputColorSpace)), y.push(M.customProgramCacheKey), y.join();
    }
    function v(M, y) {
      M.push(y.precision), M.push(y.outputColorSpace), M.push(y.envMapMode), M.push(y.envMapCubeUVHeight), M.push(y.mapUv), M.push(y.alphaMapUv), M.push(y.lightMapUv), M.push(y.aoMapUv), M.push(y.bumpMapUv), M.push(y.normalMapUv), M.push(y.displacementMapUv), M.push(y.emissiveMapUv), M.push(y.metalnessMapUv), M.push(y.roughnessMapUv), M.push(y.anisotropyMapUv), M.push(y.clearcoatMapUv), M.push(y.clearcoatNormalMapUv), M.push(y.clearcoatRoughnessMapUv), M.push(y.iridescenceMapUv), M.push(y.iridescenceThicknessMapUv), M.push(y.sheenColorMapUv), M.push(y.sheenRoughnessMapUv), M.push(y.specularMapUv), M.push(y.specularColorMapUv), M.push(y.specularIntensityMapUv), M.push(y.transmissionMapUv), M.push(y.thicknessMapUv), M.push(y.combine), M.push(y.fogExp2), M.push(y.sizeAttenuation), M.push(y.morphTargetsCount), M.push(y.morphAttributeCount), M.push(y.numDirLights), M.push(y.numPointLights), M.push(y.numSpotLights), M.push(y.numSpotLightMaps), M.push(y.numHemiLights), M.push(y.numRectAreaLights), M.push(y.numDirLightShadows), M.push(y.numPointLightShadows), M.push(y.numSpotLightShadows), M.push(y.numSpotLightShadowsWithMaps), M.push(y.numLightProbes), M.push(y.shadowMapType), M.push(y.toneMapping), M.push(y.numClippingPlanes), M.push(y.numClipIntersection), M.push(y.depthPacking);
    }
    function x(M, y) {
      a.disableAll(), y.supportsVertexTextures && a.enable(0), y.instancing && a.enable(1), y.instancingColor && a.enable(2), y.instancingMorph && a.enable(3), y.matcap && a.enable(4), y.envMap && a.enable(5), y.normalMapObjectSpace && a.enable(6), y.normalMapTangentSpace && a.enable(7), y.clearcoat && a.enable(8), y.iridescence && a.enable(9), y.alphaTest && a.enable(10), y.vertexColors && a.enable(11), y.vertexAlphas && a.enable(12), y.vertexUv1s && a.enable(13), y.vertexUv2s && a.enable(14), y.vertexUv3s && a.enable(15), y.vertexTangents && a.enable(16), y.anisotropy && a.enable(17), y.alphaHash && a.enable(18), y.batching && a.enable(19), y.dispersion && a.enable(20), M.push(a.mask), a.disableAll(), y.fog && a.enable(0), y.useFog && a.enable(1), y.flatShading && a.enable(2), y.logarithmicDepthBuffer && a.enable(3), y.skinning && a.enable(4), y.morphTargets && a.enable(5), y.morphNormals && a.enable(6), y.morphColors && a.enable(7), y.premultipliedAlpha && a.enable(8), y.shadowMapEnabled && a.enable(9), y.useLegacyLights && a.enable(10), y.doubleSided && a.enable(11), y.flipSided && a.enable(12), y.useDepthPacking && a.enable(13), y.dithering && a.enable(14), y.transmission && a.enable(15), y.sheen && a.enable(16), y.opaque && a.enable(17), y.pointsUvs && a.enable(18), y.decodeVideoTexture && a.enable(19), y.alphaToCoverage && a.enable(20), M.push(a.mask);
    }
    function S(M) {
      const y = m[M.type];
      let C;
      if (y) {
        const N = xn[y];
        C = Ff.clone(N.uniforms);
      } else C = M.uniforms;
      return C;
    }
    function P(M, y) {
      let C;
      for (let N = 0, I = h.length; N < I; N++) {
        const U = h[N];
        if (U.cacheKey === y) {
          C = U, ++C.usedTimes;
          break;
        }
      }
      return C === void 0 && (C = new Kv(r, y, M, s), h.push(C)), C;
    }
    function b(M) {
      if (--M.usedTimes === 0) {
        const y = h.indexOf(M);
        h[y] = h[h.length - 1], h.pop(), M.destroy();
      }
    }
    function T(M) {
      l.remove(M);
    }
    function E() {
      l.dispose();
    }
    return {
      getParameters: g,
      getProgramCacheKey: p,
      getUniforms: S,
      acquireProgram: P,
      releaseProgram: b,
      releaseShaderCache: T,
      programs: h,
      dispose: E
    };
  }
  function ny() {
    let r = /* @__PURE__ */ new WeakMap();
    function t(s) {
      let o = r.get(s);
      return o === void 0 && (o = {}, r.set(s, o)), o;
    }
    function e(s) {
      r.delete(s);
    }
    function n(s, o, a) {
      r.get(s)[o] = a;
    }
    function i() {
      r = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: t,
      remove: e,
      update: n,
      dispose: i
    };
  }
  function iy(r, t) {
    return r.groupOrder !== t.groupOrder ? r.groupOrder - t.groupOrder : r.renderOrder !== t.renderOrder ? r.renderOrder - t.renderOrder : r.material.id !== t.material.id ? r.material.id - t.material.id : r.z !== t.z ? r.z - t.z : r.id - t.id;
  }
  function xu(r, t) {
    return r.groupOrder !== t.groupOrder ? r.groupOrder - t.groupOrder : r.renderOrder !== t.renderOrder ? r.renderOrder - t.renderOrder : r.z !== t.z ? t.z - r.z : r.id - t.id;
  }
  function vu() {
    const r = [];
    let t = 0;
    const e = [], n = [], i = [];
    function s() {
      t = 0, e.length = 0, n.length = 0, i.length = 0;
    }
    function o(d, u, f, m, _, g) {
      let p = r[t];
      return p === void 0 ? (p = {
        id: d.id,
        object: d,
        geometry: u,
        material: f,
        groupOrder: m,
        renderOrder: d.renderOrder,
        z: _,
        group: g
      }, r[t] = p) : (p.id = d.id, p.object = d, p.geometry = u, p.material = f, p.groupOrder = m, p.renderOrder = d.renderOrder, p.z = _, p.group = g), t++, p;
    }
    function a(d, u, f, m, _, g) {
      const p = o(d, u, f, m, _, g);
      f.transmission > 0 ? n.push(p) : f.transparent === true ? i.push(p) : e.push(p);
    }
    function l(d, u, f, m, _, g) {
      const p = o(d, u, f, m, _, g);
      f.transmission > 0 ? n.unshift(p) : f.transparent === true ? i.unshift(p) : e.unshift(p);
    }
    function c(d, u) {
      e.length > 1 && e.sort(d || iy), n.length > 1 && n.sort(u || xu), i.length > 1 && i.sort(u || xu);
    }
    function h() {
      for (let d = t, u = r.length; d < u; d++) {
        const f = r[d];
        if (f.id === null) break;
        f.id = null, f.object = null, f.geometry = null, f.material = null, f.group = null;
      }
    }
    return {
      opaque: e,
      transmissive: n,
      transparent: i,
      init: s,
      push: a,
      unshift: l,
      finish: h,
      sort: c
    };
  }
  function sy() {
    let r = /* @__PURE__ */ new WeakMap();
    function t(n, i) {
      const s = r.get(n);
      let o;
      return s === void 0 ? (o = new vu(), r.set(n, [
        o
      ])) : i >= s.length ? (o = new vu(), s.push(o)) : o = s[i], o;
    }
    function e() {
      r = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: t,
      dispose: e
    };
  }
  function ry() {
    const r = {};
    return {
      get: function(t) {
        if (r[t.id] !== void 0) return r[t.id];
        let e;
        switch (t.type) {
          case "DirectionalLight":
            e = {
              direction: new R(),
              color: new xt()
            };
            break;
          case "SpotLight":
            e = {
              position: new R(),
              direction: new R(),
              color: new xt(),
              distance: 0,
              coneCos: 0,
              penumbraCos: 0,
              decay: 0
            };
            break;
          case "PointLight":
            e = {
              position: new R(),
              color: new xt(),
              distance: 0,
              decay: 0
            };
            break;
          case "HemisphereLight":
            e = {
              direction: new R(),
              skyColor: new xt(),
              groundColor: new xt()
            };
            break;
          case "RectAreaLight":
            e = {
              color: new xt(),
              position: new R(),
              halfWidth: new R(),
              halfHeight: new R()
            };
            break;
        }
        return r[t.id] = e, e;
      }
    };
  }
  function oy() {
    const r = {};
    return {
      get: function(t) {
        if (r[t.id] !== void 0) return r[t.id];
        let e;
        switch (t.type) {
          case "DirectionalLight":
            e = {
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new et()
            };
            break;
          case "SpotLight":
            e = {
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new et()
            };
            break;
          case "PointLight":
            e = {
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new et(),
              shadowCameraNear: 1,
              shadowCameraFar: 1e3
            };
            break;
        }
        return r[t.id] = e, e;
      }
    };
  }
  let ay = 0;
  function ly(r, t) {
    return (t.castShadow ? 2 : 0) - (r.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (r.map ? 1 : 0);
  }
  function cy(r) {
    const t = new ry(), e = oy(), n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1
      },
      ambient: [
        0,
        0,
        0
      ],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0
    };
    for (let c = 0; c < 9; c++) n.probe.push(new R());
    const i = new R(), s = new Dt(), o = new Dt();
    function a(c, h) {
      let d = 0, u = 0, f = 0;
      for (let C = 0; C < 9; C++) n.probe[C].set(0, 0, 0);
      let m = 0, _ = 0, g = 0, p = 0, v = 0, x = 0, S = 0, P = 0, b = 0, T = 0, E = 0;
      c.sort(ly);
      const M = h === true ? Math.PI : 1;
      for (let C = 0, N = c.length; C < N; C++) {
        const I = c[C], U = I.color, D = I.intensity, O = I.distance, H = I.shadow && I.shadow.map ? I.shadow.map.texture : null;
        if (I.isAmbientLight) d += U.r * D * M, u += U.g * D * M, f += U.b * D * M;
        else if (I.isLightProbe) {
          for (let z = 0; z < 9; z++) n.probe[z].addScaledVector(I.sh.coefficients[z], D);
          E++;
        } else if (I.isDirectionalLight) {
          const z = t.get(I);
          if (z.color.copy(I.color).multiplyScalar(I.intensity * M), I.castShadow) {
            const F = I.shadow, Y = e.get(I);
            Y.shadowBias = F.bias, Y.shadowNormalBias = F.normalBias, Y.shadowRadius = F.radius, Y.shadowMapSize = F.mapSize, n.directionalShadow[m] = Y, n.directionalShadowMap[m] = H, n.directionalShadowMatrix[m] = I.shadow.matrix, x++;
          }
          n.directional[m] = z, m++;
        } else if (I.isSpotLight) {
          const z = t.get(I);
          z.position.setFromMatrixPosition(I.matrixWorld), z.color.copy(U).multiplyScalar(D * M), z.distance = O, z.coneCos = Math.cos(I.angle), z.penumbraCos = Math.cos(I.angle * (1 - I.penumbra)), z.decay = I.decay, n.spot[g] = z;
          const F = I.shadow;
          if (I.map && (n.spotLightMap[b] = I.map, b++, F.updateMatrices(I), I.castShadow && T++), n.spotLightMatrix[g] = F.matrix, I.castShadow) {
            const Y = e.get(I);
            Y.shadowBias = F.bias, Y.shadowNormalBias = F.normalBias, Y.shadowRadius = F.radius, Y.shadowMapSize = F.mapSize, n.spotShadow[g] = Y, n.spotShadowMap[g] = H, P++;
          }
          g++;
        } else if (I.isRectAreaLight) {
          const z = t.get(I);
          z.color.copy(U).multiplyScalar(D), z.halfWidth.set(I.width * 0.5, 0, 0), z.halfHeight.set(0, I.height * 0.5, 0), n.rectArea[p] = z, p++;
        } else if (I.isPointLight) {
          const z = t.get(I);
          if (z.color.copy(I.color).multiplyScalar(I.intensity * M), z.distance = I.distance, z.decay = I.decay, I.castShadow) {
            const F = I.shadow, Y = e.get(I);
            Y.shadowBias = F.bias, Y.shadowNormalBias = F.normalBias, Y.shadowRadius = F.radius, Y.shadowMapSize = F.mapSize, Y.shadowCameraNear = F.camera.near, Y.shadowCameraFar = F.camera.far, n.pointShadow[_] = Y, n.pointShadowMap[_] = H, n.pointShadowMatrix[_] = I.shadow.matrix, S++;
          }
          n.point[_] = z, _++;
        } else if (I.isHemisphereLight) {
          const z = t.get(I);
          z.skyColor.copy(I.color).multiplyScalar(D * M), z.groundColor.copy(I.groundColor).multiplyScalar(D * M), n.hemi[v] = z, v++;
        }
      }
      p > 0 && (r.has("OES_texture_float_linear") === true ? (n.rectAreaLTC1 = ht.LTC_FLOAT_1, n.rectAreaLTC2 = ht.LTC_FLOAT_2) : (n.rectAreaLTC1 = ht.LTC_HALF_1, n.rectAreaLTC2 = ht.LTC_HALF_2)), n.ambient[0] = d, n.ambient[1] = u, n.ambient[2] = f;
      const y = n.hash;
      (y.directionalLength !== m || y.pointLength !== _ || y.spotLength !== g || y.rectAreaLength !== p || y.hemiLength !== v || y.numDirectionalShadows !== x || y.numPointShadows !== S || y.numSpotShadows !== P || y.numSpotMaps !== b || y.numLightProbes !== E) && (n.directional.length = m, n.spot.length = g, n.rectArea.length = p, n.point.length = _, n.hemi.length = v, n.directionalShadow.length = x, n.directionalShadowMap.length = x, n.pointShadow.length = S, n.pointShadowMap.length = S, n.spotShadow.length = P, n.spotShadowMap.length = P, n.directionalShadowMatrix.length = x, n.pointShadowMatrix.length = S, n.spotLightMatrix.length = P + b - T, n.spotLightMap.length = b, n.numSpotLightShadowsWithMaps = T, n.numLightProbes = E, y.directionalLength = m, y.pointLength = _, y.spotLength = g, y.rectAreaLength = p, y.hemiLength = v, y.numDirectionalShadows = x, y.numPointShadows = S, y.numSpotShadows = P, y.numSpotMaps = b, y.numLightProbes = E, n.version = ay++);
    }
    function l(c, h) {
      let d = 0, u = 0, f = 0, m = 0, _ = 0;
      const g = h.matrixWorldInverse;
      for (let p = 0, v = c.length; p < v; p++) {
        const x = c[p];
        if (x.isDirectionalLight) {
          const S = n.directional[d];
          S.direction.setFromMatrixPosition(x.matrixWorld), i.setFromMatrixPosition(x.target.matrixWorld), S.direction.sub(i), S.direction.transformDirection(g), d++;
        } else if (x.isSpotLight) {
          const S = n.spot[f];
          S.position.setFromMatrixPosition(x.matrixWorld), S.position.applyMatrix4(g), S.direction.setFromMatrixPosition(x.matrixWorld), i.setFromMatrixPosition(x.target.matrixWorld), S.direction.sub(i), S.direction.transformDirection(g), f++;
        } else if (x.isRectAreaLight) {
          const S = n.rectArea[m];
          S.position.setFromMatrixPosition(x.matrixWorld), S.position.applyMatrix4(g), o.identity(), s.copy(x.matrixWorld), s.premultiply(g), o.extractRotation(s), S.halfWidth.set(x.width * 0.5, 0, 0), S.halfHeight.set(0, x.height * 0.5, 0), S.halfWidth.applyMatrix4(o), S.halfHeight.applyMatrix4(o), m++;
        } else if (x.isPointLight) {
          const S = n.point[u];
          S.position.setFromMatrixPosition(x.matrixWorld), S.position.applyMatrix4(g), u++;
        } else if (x.isHemisphereLight) {
          const S = n.hemi[_];
          S.direction.setFromMatrixPosition(x.matrixWorld), S.direction.transformDirection(g), _++;
        }
      }
    }
    return {
      setup: a,
      setupView: l,
      state: n
    };
  }
  function yu(r) {
    const t = new cy(r), e = [], n = [];
    function i(h) {
      c.camera = h, e.length = 0, n.length = 0;
    }
    function s(h) {
      e.push(h);
    }
    function o(h) {
      n.push(h);
    }
    function a(h) {
      t.setup(e, h);
    }
    function l(h) {
      t.setupView(e, h);
    }
    const c = {
      lightsArray: e,
      shadowsArray: n,
      camera: null,
      lights: t,
      transmissionRenderTarget: {}
    };
    return {
      init: i,
      state: c,
      setupLights: a,
      setupLightsView: l,
      pushLight: s,
      pushShadow: o
    };
  }
  function hy(r) {
    let t = /* @__PURE__ */ new WeakMap();
    function e(i, s = 0) {
      const o = t.get(i);
      let a;
      return o === void 0 ? (a = new yu(r), t.set(i, [
        a
      ])) : s >= o.length ? (a = new yu(r), o.push(a)) : a = o[s], a;
    }
    function n() {
      t = /* @__PURE__ */ new WeakMap();
    }
    return {
      get: e,
      dispose: n
    };
  }
  class Kc extends Ne {
    constructor(t) {
      super(), this.isMeshDepthMaterial = true, this.type = "MeshDepthMaterial", this.depthPacking = Mf, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
    }
  }
  class Qc extends Ne {
    constructor(t) {
      super(), this.isMeshDistanceMaterial = true, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
    }
  }
  const uy = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, dy = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
  function fy(r, t, e) {
    let n = new Jr();
    const i = new et(), s = new et(), o = new ie(), a = new Kc({
      depthPacking: Sf
    }), l = new Qc(), c = {}, h = e.maxTextureSize, d = {
      [Zn]: Ve,
      [Ve]: Zn,
      [Xe]: Xe
    }, u = new Sn({
      defines: {
        VSM_SAMPLES: 8
      },
      uniforms: {
        shadow_pass: {
          value: null
        },
        resolution: {
          value: new et()
        },
        radius: {
          value: 4
        }
      },
      vertexShader: uy,
      fragmentShader: dy
    }), f = u.clone();
    f.defines.HORIZONTAL_PASS = 1;
    const m = new Wt();
    m.setAttribute("position", new se(new Float32Array([
      -1,
      -1,
      0.5,
      3,
      -1,
      0.5,
      -1,
      3,
      0.5
    ]), 3));
    const _ = new ae(m, u), g = this;
    this.enabled = false, this.autoUpdate = true, this.needsUpdate = false, this.type = Lc;
    let p = this.type;
    this.render = function(b, T, E) {
      if (g.enabled === false || g.autoUpdate === false && g.needsUpdate === false || b.length === 0) return;
      const M = r.getRenderTarget(), y = r.getActiveCubeFace(), C = r.getActiveMipmapLevel(), N = r.state;
      N.setBlending(Wn), N.buffers.color.setClear(1, 1, 1, 1), N.buffers.depth.setTest(true), N.setScissorTest(false);
      const I = p !== An && this.type === An, U = p === An && this.type !== An;
      for (let D = 0, O = b.length; D < O; D++) {
        const H = b[D], z = H.shadow;
        if (z === void 0) {
          console.warn("THREE.WebGLShadowMap:", H, "has no shadow.");
          continue;
        }
        if (z.autoUpdate === false && z.needsUpdate === false) continue;
        i.copy(z.mapSize);
        const F = z.getFrameExtents();
        if (i.multiply(F), s.copy(z.mapSize), (i.x > h || i.y > h) && (i.x > h && (s.x = Math.floor(h / F.x), i.x = s.x * F.x, z.mapSize.x = s.x), i.y > h && (s.y = Math.floor(h / F.y), i.y = s.y * F.y, z.mapSize.y = s.y)), z.map === null || I === true || U === true) {
          const nt = this.type !== An ? {
            minFilter: we,
            magFilter: we
          } : {};
          z.map !== null && z.map.dispose(), z.map = new Mn(i.x, i.y, nt), z.map.texture.name = H.name + ".shadowMap", z.camera.updateProjectionMatrix();
        }
        r.setRenderTarget(z.map), r.clear();
        const Y = z.getViewportCount();
        for (let nt = 0; nt < Y; nt++) {
          const dt = z.getViewport(nt);
          o.set(s.x * dt.x, s.y * dt.y, s.x * dt.z, s.y * dt.w), N.viewport(o), z.updateMatrices(H, nt), n = z.getFrustum(), S(T, E, z.camera, H, this.type);
        }
        z.isPointLightShadow !== true && this.type === An && v(z, E), z.needsUpdate = false;
      }
      p = this.type, g.needsUpdate = false, r.setRenderTarget(M, y, C);
    };
    function v(b, T) {
      const E = t.update(_);
      u.defines.VSM_SAMPLES !== b.blurSamples && (u.defines.VSM_SAMPLES = b.blurSamples, f.defines.VSM_SAMPLES = b.blurSamples, u.needsUpdate = true, f.needsUpdate = true), b.mapPass === null && (b.mapPass = new Mn(i.x, i.y)), u.uniforms.shadow_pass.value = b.map.texture, u.uniforms.resolution.value = b.mapSize, u.uniforms.radius.value = b.radius, r.setRenderTarget(b.mapPass), r.clear(), r.renderBufferDirect(T, null, E, u, _, null), f.uniforms.shadow_pass.value = b.mapPass.texture, f.uniforms.resolution.value = b.mapSize, f.uniforms.radius.value = b.radius, r.setRenderTarget(b.map), r.clear(), r.renderBufferDirect(T, null, E, f, _, null);
    }
    function x(b, T, E, M) {
      let y = null;
      const C = E.isPointLight === true ? b.customDistanceMaterial : b.customDepthMaterial;
      if (C !== void 0) y = C;
      else if (y = E.isPointLight === true ? l : a, r.localClippingEnabled && T.clipShadows === true && Array.isArray(T.clippingPlanes) && T.clippingPlanes.length !== 0 || T.displacementMap && T.displacementScale !== 0 || T.alphaMap && T.alphaTest > 0 || T.map && T.alphaTest > 0) {
        const N = y.uuid, I = T.uuid;
        let U = c[N];
        U === void 0 && (U = {}, c[N] = U);
        let D = U[I];
        D === void 0 && (D = y.clone(), U[I] = D, T.addEventListener("dispose", P)), y = D;
      }
      if (y.visible = T.visible, y.wireframe = T.wireframe, M === An ? y.side = T.shadowSide !== null ? T.shadowSide : T.side : y.side = T.shadowSide !== null ? T.shadowSide : d[T.side], y.alphaMap = T.alphaMap, y.alphaTest = T.alphaTest, y.map = T.map, y.clipShadows = T.clipShadows, y.clippingPlanes = T.clippingPlanes, y.clipIntersection = T.clipIntersection, y.displacementMap = T.displacementMap, y.displacementScale = T.displacementScale, y.displacementBias = T.displacementBias, y.wireframeLinewidth = T.wireframeLinewidth, y.linewidth = T.linewidth, E.isPointLight === true && y.isMeshDistanceMaterial === true) {
        const N = r.properties.get(y);
        N.light = E;
      }
      return y;
    }
    function S(b, T, E, M, y) {
      if (b.visible === false) return;
      if (b.layers.test(T.layers) && (b.isMesh || b.isLine || b.isPoints) && (b.castShadow || b.receiveShadow && y === An) && (!b.frustumCulled || n.intersectsObject(b))) {
        b.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse, b.matrixWorld);
        const I = t.update(b), U = b.material;
        if (Array.isArray(U)) {
          const D = I.groups;
          for (let O = 0, H = D.length; O < H; O++) {
            const z = D[O], F = U[z.materialIndex];
            if (F && F.visible) {
              const Y = x(b, F, M, y);
              b.onBeforeShadow(r, b, T, E, I, Y, z), r.renderBufferDirect(E, null, I, Y, b, z), b.onAfterShadow(r, b, T, E, I, Y, z);
            }
          }
        } else if (U.visible) {
          const D = x(b, U, M, y);
          b.onBeforeShadow(r, b, T, E, I, D, null), r.renderBufferDirect(E, null, I, D, b, null), b.onAfterShadow(r, b, T, E, I, D, null);
        }
      }
      const N = b.children;
      for (let I = 0, U = N.length; I < U; I++) S(N[I], T, E, M, y);
    }
    function P(b) {
      b.target.removeEventListener("dispose", P);
      for (const E in c) {
        const M = c[E], y = b.target.uuid;
        y in M && (M[y].dispose(), delete M[y]);
      }
    }
  }
  function py(r) {
    function t() {
      let k = false;
      const rt = new ie();
      let Q = null;
      const mt = new ie(0, 0, 0, 0);
      return {
        setMask: function(Mt) {
          Q !== Mt && !k && (r.colorMask(Mt, Mt, Mt, Mt), Q = Mt);
        },
        setLocked: function(Mt) {
          k = Mt;
        },
        setClear: function(Mt, Qt, oe, he, Ee) {
          Ee === true && (Mt *= he, Qt *= he, oe *= he), rt.set(Mt, Qt, oe, he), mt.equals(rt) === false && (r.clearColor(Mt, Qt, oe, he), mt.copy(rt));
        },
        reset: function() {
          k = false, Q = null, mt.set(-1, 0, 0, 0);
        }
      };
    }
    function e() {
      let k = false, rt = null, Q = null, mt = null;
      return {
        setTest: function(Mt) {
          Mt ? _t(r.DEPTH_TEST) : J(r.DEPTH_TEST);
        },
        setMask: function(Mt) {
          rt !== Mt && !k && (r.depthMask(Mt), rt = Mt);
        },
        setFunc: function(Mt) {
          if (Q !== Mt) {
            switch (Mt) {
              case Xd:
                r.depthFunc(r.NEVER);
                break;
              case Yd:
                r.depthFunc(r.ALWAYS);
                break;
              case qd:
                r.depthFunc(r.LESS);
                break;
              case br:
                r.depthFunc(r.LEQUAL);
                break;
              case $d:
                r.depthFunc(r.EQUAL);
                break;
              case Zd:
                r.depthFunc(r.GEQUAL);
                break;
              case Jd:
                r.depthFunc(r.GREATER);
                break;
              case Kd:
                r.depthFunc(r.NOTEQUAL);
                break;
              default:
                r.depthFunc(r.LEQUAL);
            }
            Q = Mt;
          }
        },
        setLocked: function(Mt) {
          k = Mt;
        },
        setClear: function(Mt) {
          mt !== Mt && (r.clearDepth(Mt), mt = Mt);
        },
        reset: function() {
          k = false, rt = null, Q = null, mt = null;
        }
      };
    }
    function n() {
      let k = false, rt = null, Q = null, mt = null, Mt = null, Qt = null, oe = null, he = null, Ee = null;
      return {
        setTest: function(ee) {
          k || (ee ? _t(r.STENCIL_TEST) : J(r.STENCIL_TEST));
        },
        setMask: function(ee) {
          rt !== ee && !k && (r.stencilMask(ee), rt = ee);
        },
        setFunc: function(ee, Tn, Oe) {
          (Q !== ee || mt !== Tn || Mt !== Oe) && (r.stencilFunc(ee, Tn, Oe), Q = ee, mt = Tn, Mt = Oe);
        },
        setOp: function(ee, Tn, Oe) {
          (Qt !== ee || oe !== Tn || he !== Oe) && (r.stencilOp(ee, Tn, Oe), Qt = ee, oe = Tn, he = Oe);
        },
        setLocked: function(ee) {
          k = ee;
        },
        setClear: function(ee) {
          Ee !== ee && (r.clearStencil(ee), Ee = ee);
        },
        reset: function() {
          k = false, rt = null, Q = null, mt = null, Mt = null, Qt = null, oe = null, he = null, Ee = null;
        }
      };
    }
    const i = new t(), s = new e(), o = new n(), a = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
    let c = {}, h = {}, d = /* @__PURE__ */ new WeakMap(), u = [], f = null, m = false, _ = null, g = null, p = null, v = null, x = null, S = null, P = null, b = new xt(0, 0, 0), T = 0, E = false, M = null, y = null, C = null, N = null, I = null;
    const U = r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    let D = false, O = 0;
    const H = r.getParameter(r.VERSION);
    H.indexOf("WebGL") !== -1 ? (O = parseFloat(/^WebGL (\d)/.exec(H)[1]), D = O >= 1) : H.indexOf("OpenGL ES") !== -1 && (O = parseFloat(/^OpenGL ES (\d)/.exec(H)[1]), D = O >= 2);
    let z = null, F = {};
    const Y = r.getParameter(r.SCISSOR_BOX), nt = r.getParameter(r.VIEWPORT), dt = new ie().fromArray(Y), Et = new ie().fromArray(nt);
    function q(k, rt, Q, mt) {
      const Mt = new Uint8Array(4), Qt = r.createTexture();
      r.bindTexture(k, Qt), r.texParameteri(k, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(k, r.TEXTURE_MAG_FILTER, r.NEAREST);
      for (let oe = 0; oe < Q; oe++) k === r.TEXTURE_3D || k === r.TEXTURE_2D_ARRAY ? r.texImage3D(rt, 0, r.RGBA, 1, 1, mt, 0, r.RGBA, r.UNSIGNED_BYTE, Mt) : r.texImage2D(rt + oe, 0, r.RGBA, 1, 1, 0, r.RGBA, r.UNSIGNED_BYTE, Mt);
      return Qt;
    }
    const at = {};
    at[r.TEXTURE_2D] = q(r.TEXTURE_2D, r.TEXTURE_2D, 1), at[r.TEXTURE_CUBE_MAP] = q(r.TEXTURE_CUBE_MAP, r.TEXTURE_CUBE_MAP_POSITIVE_X, 6), at[r.TEXTURE_2D_ARRAY] = q(r.TEXTURE_2D_ARRAY, r.TEXTURE_2D_ARRAY, 1, 1), at[r.TEXTURE_3D] = q(r.TEXTURE_3D, r.TEXTURE_3D, 1, 1), i.setClear(0, 0, 0, 1), s.setClear(1), o.setClear(0), _t(r.DEPTH_TEST), s.setFunc(br), lt(false), it(kl), _t(r.CULL_FACE), j(Wn);
    function _t(k) {
      c[k] !== true && (r.enable(k), c[k] = true);
    }
    function J(k) {
      c[k] !== false && (r.disable(k), c[k] = false);
    }
    function wt(k, rt) {
      return h[k] !== rt ? (r.bindFramebuffer(k, rt), h[k] = rt, k === r.DRAW_FRAMEBUFFER && (h[r.FRAMEBUFFER] = rt), k === r.FRAMEBUFFER && (h[r.DRAW_FRAMEBUFFER] = rt), true) : false;
    }
    function Pt(k, rt) {
      let Q = u, mt = false;
      if (k) {
        Q = d.get(rt), Q === void 0 && (Q = [], d.set(rt, Q));
        const Mt = k.textures;
        if (Q.length !== Mt.length || Q[0] !== r.COLOR_ATTACHMENT0) {
          for (let Qt = 0, oe = Mt.length; Qt < oe; Qt++) Q[Qt] = r.COLOR_ATTACHMENT0 + Qt;
          Q.length = Mt.length, mt = true;
        }
      } else Q[0] !== r.BACK && (Q[0] = r.BACK, mt = true);
      mt && r.drawBuffers(Q);
    }
    function B(k) {
      return f !== k ? (r.useProgram(k), f = k, true) : false;
    }
    const Ot = {
      [fi]: r.FUNC_ADD,
      [Cd]: r.FUNC_SUBTRACT,
      [Rd]: r.FUNC_REVERSE_SUBTRACT
    };
    Ot[Pd] = r.MIN, Ot[Id] = r.MAX;
    const Z = {
      [Ld]: r.ZERO,
      [Dd]: r.ONE,
      [Ud]: r.SRC_COLOR,
      [aa]: r.SRC_ALPHA,
      [kd]: r.SRC_ALPHA_SATURATE,
      [Fd]: r.DST_COLOR,
      [Od]: r.DST_ALPHA,
      [Nd]: r.ONE_MINUS_SRC_COLOR,
      [la]: r.ONE_MINUS_SRC_ALPHA,
      [Bd]: r.ONE_MINUS_DST_COLOR,
      [zd]: r.ONE_MINUS_DST_ALPHA,
      [Vd]: r.CONSTANT_COLOR,
      [Hd]: r.ONE_MINUS_CONSTANT_COLOR,
      [Gd]: r.CONSTANT_ALPHA,
      [Wd]: r.ONE_MINUS_CONSTANT_ALPHA
    };
    function j(k, rt, Q, mt, Mt, Qt, oe, he, Ee, ee) {
      if (k === Wn) {
        m === true && (J(r.BLEND), m = false);
        return;
      }
      if (m === false && (_t(r.BLEND), m = true), k !== Ed) {
        if (k !== _ || ee !== E) {
          if ((g !== fi || x !== fi) && (r.blendEquation(r.FUNC_ADD), g = fi, x = fi), ee) switch (k) {
            case Gi:
              r.blendFuncSeparate(r.ONE, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA);
              break;
            case Vl:
              r.blendFunc(r.ONE, r.ONE);
              break;
            case Hl:
              r.blendFuncSeparate(r.ZERO, r.ONE_MINUS_SRC_COLOR, r.ZERO, r.ONE);
              break;
            case Gl:
              r.blendFuncSeparate(r.ZERO, r.SRC_COLOR, r.ZERO, r.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", k);
              break;
          }
          else switch (k) {
            case Gi:
              r.blendFuncSeparate(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA, r.ONE, r.ONE_MINUS_SRC_ALPHA);
              break;
            case Vl:
              r.blendFunc(r.SRC_ALPHA, r.ONE);
              break;
            case Hl:
              r.blendFuncSeparate(r.ZERO, r.ONE_MINUS_SRC_COLOR, r.ZERO, r.ONE);
              break;
            case Gl:
              r.blendFunc(r.ZERO, r.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", k);
              break;
          }
          p = null, v = null, S = null, P = null, b.set(0, 0, 0), T = 0, _ = k, E = ee;
        }
        return;
      }
      Mt = Mt || rt, Qt = Qt || Q, oe = oe || mt, (rt !== g || Mt !== x) && (r.blendEquationSeparate(Ot[rt], Ot[Mt]), g = rt, x = Mt), (Q !== p || mt !== v || Qt !== S || oe !== P) && (r.blendFuncSeparate(Z[Q], Z[mt], Z[Qt], Z[oe]), p = Q, v = mt, S = Qt, P = oe), (he.equals(b) === false || Ee !== T) && (r.blendColor(he.r, he.g, he.b, Ee), b.copy(he), T = Ee), _ = k, E = false;
    }
    function K(k, rt) {
      k.side === Xe ? J(r.CULL_FACE) : _t(r.CULL_FACE);
      let Q = k.side === Ve;
      rt && (Q = !Q), lt(Q), k.blending === Gi && k.transparent === false ? j(Wn) : j(k.blending, k.blendEquation, k.blendSrc, k.blendDst, k.blendEquationAlpha, k.blendSrcAlpha, k.blendDstAlpha, k.blendColor, k.blendAlpha, k.premultipliedAlpha), s.setFunc(k.depthFunc), s.setTest(k.depthTest), s.setMask(k.depthWrite), i.setMask(k.colorWrite);
      const mt = k.stencilWrite;
      o.setTest(mt), mt && (o.setMask(k.stencilWriteMask), o.setFunc(k.stencilFunc, k.stencilRef, k.stencilFuncMask), o.setOp(k.stencilFail, k.stencilZFail, k.stencilZPass)), It(k.polygonOffset, k.polygonOffsetFactor, k.polygonOffsetUnits), k.alphaToCoverage === true ? _t(r.SAMPLE_ALPHA_TO_COVERAGE) : J(r.SAMPLE_ALPHA_TO_COVERAGE);
    }
    function lt(k) {
      M !== k && (k ? r.frontFace(r.CW) : r.frontFace(r.CCW), M = k);
    }
    function it(k) {
      k !== Td ? (_t(r.CULL_FACE), k !== y && (k === kl ? r.cullFace(r.BACK) : k === Ad ? r.cullFace(r.FRONT) : r.cullFace(r.FRONT_AND_BACK))) : J(r.CULL_FACE), y = k;
    }
    function vt(k) {
      k !== C && (D && r.lineWidth(k), C = k);
    }
    function It(k, rt, Q) {
      k ? (_t(r.POLYGON_OFFSET_FILL), (N !== rt || I !== Q) && (r.polygonOffset(rt, Q), N = rt, I = Q)) : J(r.POLYGON_OFFSET_FILL);
    }
    function L(k) {
      k ? _t(r.SCISSOR_TEST) : J(r.SCISSOR_TEST);
    }
    function w(k) {
      k === void 0 && (k = r.TEXTURE0 + U - 1), z !== k && (r.activeTexture(k), z = k);
    }
    function G(k, rt, Q) {
      Q === void 0 && (z === null ? Q = r.TEXTURE0 + U - 1 : Q = z);
      let mt = F[Q];
      mt === void 0 && (mt = {
        type: void 0,
        texture: void 0
      }, F[Q] = mt), (mt.type !== k || mt.texture !== rt) && (z !== Q && (r.activeTexture(Q), z = Q), r.bindTexture(k, rt || at[k]), mt.type = k, mt.texture = rt);
    }
    function tt() {
      const k = F[z];
      k !== void 0 && k.type !== void 0 && (r.bindTexture(k.type, null), k.type = void 0, k.texture = void 0);
    }
    function ot() {
      try {
        r.compressedTexImage2D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function st() {
      try {
        r.compressedTexImage3D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function Lt() {
      try {
        r.texSubImage2D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function pt() {
      try {
        r.texSubImage3D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function ft() {
      try {
        r.compressedTexSubImage2D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function Vt() {
      try {
        r.compressedTexSubImage3D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function ct() {
      try {
        r.texStorage2D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function Rt() {
      try {
        r.texStorage3D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function Zt() {
      try {
        r.texImage2D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function Ut() {
      try {
        r.texImage3D.apply(r, arguments);
      } catch (k) {
        console.error("THREE.WebGLState:", k);
      }
    }
    function St(k) {
      dt.equals(k) === false && (r.scissor(k.x, k.y, k.z, k.w), dt.copy(k));
    }
    function Xt(k) {
      Et.equals(k) === false && (r.viewport(k.x, k.y, k.z, k.w), Et.copy(k));
    }
    function Jt(k, rt) {
      let Q = l.get(rt);
      Q === void 0 && (Q = /* @__PURE__ */ new WeakMap(), l.set(rt, Q));
      let mt = Q.get(k);
      mt === void 0 && (mt = r.getUniformBlockIndex(rt, k.name), Q.set(k, mt));
    }
    function pe(k, rt) {
      const mt = l.get(rt).get(k);
      a.get(rt) !== mt && (r.uniformBlockBinding(rt, mt, k.__bindingPointIndex), a.set(rt, mt));
    }
    function Yt() {
      r.disable(r.BLEND), r.disable(r.CULL_FACE), r.disable(r.DEPTH_TEST), r.disable(r.POLYGON_OFFSET_FILL), r.disable(r.SCISSOR_TEST), r.disable(r.STENCIL_TEST), r.disable(r.SAMPLE_ALPHA_TO_COVERAGE), r.blendEquation(r.FUNC_ADD), r.blendFunc(r.ONE, r.ZERO), r.blendFuncSeparate(r.ONE, r.ZERO, r.ONE, r.ZERO), r.blendColor(0, 0, 0, 0), r.colorMask(true, true, true, true), r.clearColor(0, 0, 0, 0), r.depthMask(true), r.depthFunc(r.LESS), r.clearDepth(1), r.stencilMask(4294967295), r.stencilFunc(r.ALWAYS, 0, 4294967295), r.stencilOp(r.KEEP, r.KEEP, r.KEEP), r.clearStencil(0), r.cullFace(r.BACK), r.frontFace(r.CCW), r.polygonOffset(0, 0), r.activeTexture(r.TEXTURE0), r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindFramebuffer(r.DRAW_FRAMEBUFFER, null), r.bindFramebuffer(r.READ_FRAMEBUFFER, null), r.useProgram(null), r.lineWidth(1), r.scissor(0, 0, r.canvas.width, r.canvas.height), r.viewport(0, 0, r.canvas.width, r.canvas.height), c = {}, z = null, F = {}, h = {}, d = /* @__PURE__ */ new WeakMap(), u = [], f = null, m = false, _ = null, g = null, p = null, v = null, x = null, S = null, P = null, b = new xt(0, 0, 0), T = 0, E = false, M = null, y = null, C = null, N = null, I = null, dt.set(0, 0, r.canvas.width, r.canvas.height), Et.set(0, 0, r.canvas.width, r.canvas.height), i.reset(), s.reset(), o.reset();
    }
    return {
      buffers: {
        color: i,
        depth: s,
        stencil: o
      },
      enable: _t,
      disable: J,
      bindFramebuffer: wt,
      drawBuffers: Pt,
      useProgram: B,
      setBlending: j,
      setMaterial: K,
      setFlipSided: lt,
      setCullFace: it,
      setLineWidth: vt,
      setPolygonOffset: It,
      setScissorTest: L,
      activeTexture: w,
      bindTexture: G,
      unbindTexture: tt,
      compressedTexImage2D: ot,
      compressedTexImage3D: st,
      texImage2D: Zt,
      texImage3D: Ut,
      updateUBOMapping: Jt,
      uniformBlockBinding: pe,
      texStorage2D: ct,
      texStorage3D: Rt,
      texSubImage2D: Lt,
      texSubImage3D: pt,
      compressedTexSubImage2D: ft,
      compressedTexSubImage3D: Vt,
      scissor: St,
      viewport: Xt,
      reset: Yt
    };
  }
  function my(r, t, e, n, i, s, o) {
    const a = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? false : /OculusBrowser/g.test(navigator.userAgent), c = new et(), h = /* @__PURE__ */ new WeakMap();
    let d;
    const u = /* @__PURE__ */ new WeakMap();
    let f = false;
    try {
      f = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
    } catch {
    }
    function m(L, w) {
      return f ? new OffscreenCanvas(L, w) : Nr("canvas");
    }
    function _(L, w, G) {
      let tt = 1;
      const ot = It(L);
      if ((ot.width > G || ot.height > G) && (tt = G / Math.max(ot.width, ot.height)), tt < 1) if (typeof HTMLImageElement < "u" && L instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && L instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && L instanceof ImageBitmap || typeof VideoFrame < "u" && L instanceof VideoFrame) {
        const st = Math.floor(tt * ot.width), Lt = Math.floor(tt * ot.height);
        d === void 0 && (d = m(st, Lt));
        const pt = w ? m(st, Lt) : d;
        return pt.width = st, pt.height = Lt, pt.getContext("2d").drawImage(L, 0, 0, st, Lt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + ot.width + "x" + ot.height + ") to (" + st + "x" + Lt + ")."), pt;
      } else return "data" in L && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + ot.width + "x" + ot.height + ")."), L;
      return L;
    }
    function g(L) {
      return L.generateMipmaps && L.minFilter !== we && L.minFilter !== xe;
    }
    function p(L) {
      r.generateMipmap(L);
    }
    function v(L, w, G, tt, ot = false) {
      if (L !== null) {
        if (r[L] !== void 0) return r[L];
        console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + L + "'");
      }
      let st = w;
      if (w === r.RED && (G === r.FLOAT && (st = r.R32F), G === r.HALF_FLOAT && (st = r.R16F), G === r.UNSIGNED_BYTE && (st = r.R8)), w === r.RED_INTEGER && (G === r.UNSIGNED_BYTE && (st = r.R8UI), G === r.UNSIGNED_SHORT && (st = r.R16UI), G === r.UNSIGNED_INT && (st = r.R32UI), G === r.BYTE && (st = r.R8I), G === r.SHORT && (st = r.R16I), G === r.INT && (st = r.R32I)), w === r.RG && (G === r.FLOAT && (st = r.RG32F), G === r.HALF_FLOAT && (st = r.RG16F), G === r.UNSIGNED_BYTE && (st = r.RG8)), w === r.RG_INTEGER && (G === r.UNSIGNED_BYTE && (st = r.RG8UI), G === r.UNSIGNED_SHORT && (st = r.RG16UI), G === r.UNSIGNED_INT && (st = r.RG32UI), G === r.BYTE && (st = r.RG8I), G === r.SHORT && (st = r.RG16I), G === r.INT && (st = r.RG32I)), w === r.RGB && G === r.UNSIGNED_INT_5_9_9_9_REV && (st = r.RGB9_E5), w === r.RGBA) {
        const Lt = ot ? Pr : ne.getTransfer(tt);
        G === r.FLOAT && (st = r.RGBA32F), G === r.HALF_FLOAT && (st = r.RGBA16F), G === r.UNSIGNED_BYTE && (st = Lt === re ? r.SRGB8_ALPHA8 : r.RGBA8), G === r.UNSIGNED_SHORT_4_4_4_4 && (st = r.RGBA4), G === r.UNSIGNED_SHORT_5_5_5_1 && (st = r.RGB5_A1);
      }
      return (st === r.R16F || st === r.R32F || st === r.RG16F || st === r.RG32F || st === r.RGBA16F || st === r.RGBA32F) && t.get("EXT_color_buffer_float"), st;
    }
    function x(L, w) {
      return g(L) === true || L.isFramebufferTexture && L.minFilter !== we && L.minFilter !== xe ? Math.log2(Math.max(w.width, w.height)) + 1 : L.mipmaps !== void 0 && L.mipmaps.length > 0 ? L.mipmaps.length : L.isCompressedTexture && Array.isArray(L.image) ? w.mipmaps.length : 1;
    }
    function S(L) {
      const w = L.target;
      w.removeEventListener("dispose", S), b(w), w.isVideoTexture && h.delete(w);
    }
    function P(L) {
      const w = L.target;
      w.removeEventListener("dispose", P), E(w);
    }
    function b(L) {
      const w = n.get(L);
      if (w.__webglInit === void 0) return;
      const G = L.source, tt = u.get(G);
      if (tt) {
        const ot = tt[w.__cacheKey];
        ot.usedTimes--, ot.usedTimes === 0 && T(L), Object.keys(tt).length === 0 && u.delete(G);
      }
      n.remove(L);
    }
    function T(L) {
      const w = n.get(L);
      r.deleteTexture(w.__webglTexture);
      const G = L.source, tt = u.get(G);
      delete tt[w.__cacheKey], o.memory.textures--;
    }
    function E(L) {
      const w = n.get(L);
      if (L.depthTexture && L.depthTexture.dispose(), L.isWebGLCubeRenderTarget) for (let tt = 0; tt < 6; tt++) {
        if (Array.isArray(w.__webglFramebuffer[tt])) for (let ot = 0; ot < w.__webglFramebuffer[tt].length; ot++) r.deleteFramebuffer(w.__webglFramebuffer[tt][ot]);
        else r.deleteFramebuffer(w.__webglFramebuffer[tt]);
        w.__webglDepthbuffer && r.deleteRenderbuffer(w.__webglDepthbuffer[tt]);
      }
      else {
        if (Array.isArray(w.__webglFramebuffer)) for (let tt = 0; tt < w.__webglFramebuffer.length; tt++) r.deleteFramebuffer(w.__webglFramebuffer[tt]);
        else r.deleteFramebuffer(w.__webglFramebuffer);
        if (w.__webglDepthbuffer && r.deleteRenderbuffer(w.__webglDepthbuffer), w.__webglMultisampledFramebuffer && r.deleteFramebuffer(w.__webglMultisampledFramebuffer), w.__webglColorRenderbuffer) for (let tt = 0; tt < w.__webglColorRenderbuffer.length; tt++) w.__webglColorRenderbuffer[tt] && r.deleteRenderbuffer(w.__webglColorRenderbuffer[tt]);
        w.__webglDepthRenderbuffer && r.deleteRenderbuffer(w.__webglDepthRenderbuffer);
      }
      const G = L.textures;
      for (let tt = 0, ot = G.length; tt < ot; tt++) {
        const st = n.get(G[tt]);
        st.__webglTexture && (r.deleteTexture(st.__webglTexture), o.memory.textures--), n.remove(G[tt]);
      }
      n.remove(L);
    }
    let M = 0;
    function y() {
      M = 0;
    }
    function C() {
      const L = M;
      return L >= i.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + L + " texture units while this GPU supports only " + i.maxTextures), M += 1, L;
    }
    function N(L) {
      const w = [];
      return w.push(L.wrapS), w.push(L.wrapT), w.push(L.wrapR || 0), w.push(L.magFilter), w.push(L.minFilter), w.push(L.anisotropy), w.push(L.internalFormat), w.push(L.format), w.push(L.type), w.push(L.generateMipmaps), w.push(L.premultiplyAlpha), w.push(L.flipY), w.push(L.unpackAlignment), w.push(L.colorSpace), w.join();
    }
    function I(L, w) {
      const G = n.get(L);
      if (L.isVideoTexture && it(L), L.isRenderTargetTexture === false && L.version > 0 && G.__version !== L.version) {
        const tt = L.image;
        if (tt === null) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
        else if (tt.complete === false) console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
        else {
          dt(G, L, w);
          return;
        }
      }
      e.bindTexture(r.TEXTURE_2D, G.__webglTexture, r.TEXTURE0 + w);
    }
    function U(L, w) {
      const G = n.get(L);
      if (L.version > 0 && G.__version !== L.version) {
        dt(G, L, w);
        return;
      }
      e.bindTexture(r.TEXTURE_2D_ARRAY, G.__webglTexture, r.TEXTURE0 + w);
    }
    function D(L, w) {
      const G = n.get(L);
      if (L.version > 0 && G.__version !== L.version) {
        dt(G, L, w);
        return;
      }
      e.bindTexture(r.TEXTURE_3D, G.__webglTexture, r.TEXTURE0 + w);
    }
    function O(L, w) {
      const G = n.get(L);
      if (L.version > 0 && G.__version !== L.version) {
        Et(G, L, w);
        return;
      }
      e.bindTexture(r.TEXTURE_CUBE_MAP, G.__webglTexture, r.TEXTURE0 + w);
    }
    const H = {
      [Tr]: r.REPEAT,
      [dn]: r.CLAMP_TO_EDGE,
      [Ar]: r.MIRRORED_REPEAT
    }, z = {
      [we]: r.NEAREST,
      [Uc]: r.NEAREST_MIPMAP_NEAREST,
      [Es]: r.NEAREST_MIPMAP_LINEAR,
      [xe]: r.LINEAR,
      [gr]: r.LINEAR_MIPMAP_NEAREST,
      [Cn]: r.LINEAR_MIPMAP_LINEAR
    }, F = {
      [wf]: r.NEVER,
      [Pf]: r.ALWAYS,
      [Tf]: r.LESS,
      [Wc]: r.LEQUAL,
      [Af]: r.EQUAL,
      [Rf]: r.GEQUAL,
      [Ef]: r.GREATER,
      [Cf]: r.NOTEQUAL
    };
    function Y(L, w) {
      if (w.type === fn && t.has("OES_texture_float_linear") === false && (w.magFilter === xe || w.magFilter === gr || w.magFilter === Es || w.magFilter === Cn || w.minFilter === xe || w.minFilter === gr || w.minFilter === Es || w.minFilter === Cn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), r.texParameteri(L, r.TEXTURE_WRAP_S, H[w.wrapS]), r.texParameteri(L, r.TEXTURE_WRAP_T, H[w.wrapT]), (L === r.TEXTURE_3D || L === r.TEXTURE_2D_ARRAY) && r.texParameteri(L, r.TEXTURE_WRAP_R, H[w.wrapR]), r.texParameteri(L, r.TEXTURE_MAG_FILTER, z[w.magFilter]), r.texParameteri(L, r.TEXTURE_MIN_FILTER, z[w.minFilter]), w.compareFunction && (r.texParameteri(L, r.TEXTURE_COMPARE_MODE, r.COMPARE_REF_TO_TEXTURE), r.texParameteri(L, r.TEXTURE_COMPARE_FUNC, F[w.compareFunction])), t.has("EXT_texture_filter_anisotropic") === true) {
        if (w.magFilter === we || w.minFilter !== Es && w.minFilter !== Cn || w.type === fn && t.has("OES_texture_float_linear") === false) return;
        if (w.anisotropy > 1 || n.get(w).__currentAnisotropy) {
          const G = t.get("EXT_texture_filter_anisotropic");
          r.texParameterf(L, G.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(w.anisotropy, i.getMaxAnisotropy())), n.get(w).__currentAnisotropy = w.anisotropy;
        }
      }
    }
    function nt(L, w) {
      let G = false;
      L.__webglInit === void 0 && (L.__webglInit = true, w.addEventListener("dispose", S));
      const tt = w.source;
      let ot = u.get(tt);
      ot === void 0 && (ot = {}, u.set(tt, ot));
      const st = N(w);
      if (st !== L.__cacheKey) {
        ot[st] === void 0 && (ot[st] = {
          texture: r.createTexture(),
          usedTimes: 0
        }, o.memory.textures++, G = true), ot[st].usedTimes++;
        const Lt = ot[L.__cacheKey];
        Lt !== void 0 && (ot[L.__cacheKey].usedTimes--, Lt.usedTimes === 0 && T(w)), L.__cacheKey = st, L.__webglTexture = ot[st].texture;
      }
      return G;
    }
    function dt(L, w, G) {
      let tt = r.TEXTURE_2D;
      (w.isDataArrayTexture || w.isCompressedArrayTexture) && (tt = r.TEXTURE_2D_ARRAY), w.isData3DTexture && (tt = r.TEXTURE_3D);
      const ot = nt(L, w), st = w.source;
      e.bindTexture(tt, L.__webglTexture, r.TEXTURE0 + G);
      const Lt = n.get(st);
      if (st.version !== Lt.__version || ot === true) {
        e.activeTexture(r.TEXTURE0 + G);
        const pt = ne.getPrimaries(ne.workingColorSpace), ft = w.colorSpace === Vn ? null : ne.getPrimaries(w.colorSpace), Vt = w.colorSpace === Vn || pt === ft ? r.NONE : r.BROWSER_DEFAULT_WEBGL;
        r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, w.flipY), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, w.premultiplyAlpha), r.pixelStorei(r.UNPACK_ALIGNMENT, w.unpackAlignment), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, Vt);
        let ct = _(w.image, false, i.maxTextureSize);
        ct = vt(w, ct);
        const Rt = s.convert(w.format, w.colorSpace), Zt = s.convert(w.type);
        let Ut = v(w.internalFormat, Rt, Zt, w.colorSpace, w.isVideoTexture);
        Y(tt, w);
        let St;
        const Xt = w.mipmaps, Jt = w.isVideoTexture !== true, pe = Lt.__version === void 0 || ot === true, Yt = st.dataReady, k = x(w, ct);
        if (w.isDepthTexture) Ut = r.DEPTH_COMPONENT16, w.type === fn ? Ut = r.DEPTH_COMPONENT32F : w.type === $i ? Ut = r.DEPTH_COMPONENT24 : w.type === Hs && (Ut = r.DEPTH24_STENCIL8), pe && (Jt ? e.texStorage2D(r.TEXTURE_2D, 1, Ut, ct.width, ct.height) : e.texImage2D(r.TEXTURE_2D, 0, Ut, ct.width, ct.height, 0, Rt, Zt, null));
        else if (w.isDataTexture) if (Xt.length > 0) {
          Jt && pe && e.texStorage2D(r.TEXTURE_2D, k, Ut, Xt[0].width, Xt[0].height);
          for (let rt = 0, Q = Xt.length; rt < Q; rt++) St = Xt[rt], Jt ? Yt && e.texSubImage2D(r.TEXTURE_2D, rt, 0, 0, St.width, St.height, Rt, Zt, St.data) : e.texImage2D(r.TEXTURE_2D, rt, Ut, St.width, St.height, 0, Rt, Zt, St.data);
          w.generateMipmaps = false;
        } else Jt ? (pe && e.texStorage2D(r.TEXTURE_2D, k, Ut, ct.width, ct.height), Yt && e.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, ct.width, ct.height, Rt, Zt, ct.data)) : e.texImage2D(r.TEXTURE_2D, 0, Ut, ct.width, ct.height, 0, Rt, Zt, ct.data);
        else if (w.isCompressedTexture) if (w.isCompressedArrayTexture) {
          Jt && pe && e.texStorage3D(r.TEXTURE_2D_ARRAY, k, Ut, Xt[0].width, Xt[0].height, ct.depth);
          for (let rt = 0, Q = Xt.length; rt < Q; rt++) St = Xt[rt], w.format !== nn ? Rt !== null ? Jt ? Yt && e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY, rt, 0, 0, 0, St.width, St.height, ct.depth, Rt, St.data, 0, 0) : e.compressedTexImage3D(r.TEXTURE_2D_ARRAY, rt, Ut, St.width, St.height, ct.depth, 0, St.data, 0, 0) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Jt ? Yt && e.texSubImage3D(r.TEXTURE_2D_ARRAY, rt, 0, 0, 0, St.width, St.height, ct.depth, Rt, Zt, St.data) : e.texImage3D(r.TEXTURE_2D_ARRAY, rt, Ut, St.width, St.height, ct.depth, 0, Rt, Zt, St.data);
        } else {
          Jt && pe && e.texStorage2D(r.TEXTURE_2D, k, Ut, Xt[0].width, Xt[0].height);
          for (let rt = 0, Q = Xt.length; rt < Q; rt++) St = Xt[rt], w.format !== nn ? Rt !== null ? Jt ? Yt && e.compressedTexSubImage2D(r.TEXTURE_2D, rt, 0, 0, St.width, St.height, Rt, St.data) : e.compressedTexImage2D(r.TEXTURE_2D, rt, Ut, St.width, St.height, 0, St.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Jt ? Yt && e.texSubImage2D(r.TEXTURE_2D, rt, 0, 0, St.width, St.height, Rt, Zt, St.data) : e.texImage2D(r.TEXTURE_2D, rt, Ut, St.width, St.height, 0, Rt, Zt, St.data);
        }
        else if (w.isDataArrayTexture) Jt ? (pe && e.texStorage3D(r.TEXTURE_2D_ARRAY, k, Ut, ct.width, ct.height, ct.depth), Yt && e.texSubImage3D(r.TEXTURE_2D_ARRAY, 0, 0, 0, 0, ct.width, ct.height, ct.depth, Rt, Zt, ct.data)) : e.texImage3D(r.TEXTURE_2D_ARRAY, 0, Ut, ct.width, ct.height, ct.depth, 0, Rt, Zt, ct.data);
        else if (w.isData3DTexture) Jt ? (pe && e.texStorage3D(r.TEXTURE_3D, k, Ut, ct.width, ct.height, ct.depth), Yt && e.texSubImage3D(r.TEXTURE_3D, 0, 0, 0, 0, ct.width, ct.height, ct.depth, Rt, Zt, ct.data)) : e.texImage3D(r.TEXTURE_3D, 0, Ut, ct.width, ct.height, ct.depth, 0, Rt, Zt, ct.data);
        else if (w.isFramebufferTexture) {
          if (pe) if (Jt) e.texStorage2D(r.TEXTURE_2D, k, Ut, ct.width, ct.height);
          else {
            let rt = ct.width, Q = ct.height;
            for (let mt = 0; mt < k; mt++) e.texImage2D(r.TEXTURE_2D, mt, Ut, rt, Q, 0, Rt, Zt, null), rt >>= 1, Q >>= 1;
          }
        } else if (Xt.length > 0) {
          if (Jt && pe) {
            const rt = It(Xt[0]);
            e.texStorage2D(r.TEXTURE_2D, k, Ut, rt.width, rt.height);
          }
          for (let rt = 0, Q = Xt.length; rt < Q; rt++) St = Xt[rt], Jt ? Yt && e.texSubImage2D(r.TEXTURE_2D, rt, 0, 0, Rt, Zt, St) : e.texImage2D(r.TEXTURE_2D, rt, Ut, Rt, Zt, St);
          w.generateMipmaps = false;
        } else if (Jt) {
          if (pe) {
            const rt = It(ct);
            e.texStorage2D(r.TEXTURE_2D, k, Ut, rt.width, rt.height);
          }
          Yt && e.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, Rt, Zt, ct);
        } else e.texImage2D(r.TEXTURE_2D, 0, Ut, Rt, Zt, ct);
        g(w) && p(tt), Lt.__version = st.version, w.onUpdate && w.onUpdate(w);
      }
      L.__version = w.version;
    }
    function Et(L, w, G) {
      if (w.image.length !== 6) return;
      const tt = nt(L, w), ot = w.source;
      e.bindTexture(r.TEXTURE_CUBE_MAP, L.__webglTexture, r.TEXTURE0 + G);
      const st = n.get(ot);
      if (ot.version !== st.__version || tt === true) {
        e.activeTexture(r.TEXTURE0 + G);
        const Lt = ne.getPrimaries(ne.workingColorSpace), pt = w.colorSpace === Vn ? null : ne.getPrimaries(w.colorSpace), ft = w.colorSpace === Vn || Lt === pt ? r.NONE : r.BROWSER_DEFAULT_WEBGL;
        r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, w.flipY), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, w.premultiplyAlpha), r.pixelStorei(r.UNPACK_ALIGNMENT, w.unpackAlignment), r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL, ft);
        const Vt = w.isCompressedTexture || w.image[0].isCompressedTexture, ct = w.image[0] && w.image[0].isDataTexture, Rt = [];
        for (let Q = 0; Q < 6; Q++) !Vt && !ct ? Rt[Q] = _(w.image[Q], true, i.maxCubemapSize) : Rt[Q] = ct ? w.image[Q].image : w.image[Q], Rt[Q] = vt(w, Rt[Q]);
        const Zt = Rt[0], Ut = s.convert(w.format, w.colorSpace), St = s.convert(w.type), Xt = v(w.internalFormat, Ut, St, w.colorSpace), Jt = w.isVideoTexture !== true, pe = st.__version === void 0 || tt === true, Yt = ot.dataReady;
        let k = x(w, Zt);
        Y(r.TEXTURE_CUBE_MAP, w);
        let rt;
        if (Vt) {
          Jt && pe && e.texStorage2D(r.TEXTURE_CUBE_MAP, k, Xt, Zt.width, Zt.height);
          for (let Q = 0; Q < 6; Q++) {
            rt = Rt[Q].mipmaps;
            for (let mt = 0; mt < rt.length; mt++) {
              const Mt = rt[mt];
              w.format !== nn ? Ut !== null ? Jt ? Yt && e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt, 0, 0, Mt.width, Mt.height, Ut, Mt.data) : e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt, Xt, Mt.width, Mt.height, 0, Mt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Jt ? Yt && e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt, 0, 0, Mt.width, Mt.height, Ut, St, Mt.data) : e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt, Xt, Mt.width, Mt.height, 0, Ut, St, Mt.data);
            }
          }
        } else {
          if (rt = w.mipmaps, Jt && pe) {
            rt.length > 0 && k++;
            const Q = It(Rt[0]);
            e.texStorage2D(r.TEXTURE_CUBE_MAP, k, Xt, Q.width, Q.height);
          }
          for (let Q = 0; Q < 6; Q++) if (ct) {
            Jt ? Yt && e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, 0, 0, Rt[Q].width, Rt[Q].height, Ut, St, Rt[Q].data) : e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, Xt, Rt[Q].width, Rt[Q].height, 0, Ut, St, Rt[Q].data);
            for (let mt = 0; mt < rt.length; mt++) {
              const Qt = rt[mt].image[Q].image;
              Jt ? Yt && e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt + 1, 0, 0, Qt.width, Qt.height, Ut, St, Qt.data) : e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt + 1, Xt, Qt.width, Qt.height, 0, Ut, St, Qt.data);
            }
          } else {
            Jt ? Yt && e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, 0, 0, Ut, St, Rt[Q]) : e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, 0, Xt, Ut, St, Rt[Q]);
            for (let mt = 0; mt < rt.length; mt++) {
              const Mt = rt[mt];
              Jt ? Yt && e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt + 1, 0, 0, Ut, St, Mt.image[Q]) : e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X + Q, mt + 1, Xt, Ut, St, Mt.image[Q]);
            }
          }
        }
        g(w) && p(r.TEXTURE_CUBE_MAP), st.__version = ot.version, w.onUpdate && w.onUpdate(w);
      }
      L.__version = w.version;
    }
    function q(L, w, G, tt, ot, st) {
      const Lt = s.convert(G.format, G.colorSpace), pt = s.convert(G.type), ft = v(G.internalFormat, Lt, pt, G.colorSpace);
      if (!n.get(w).__hasExternalTextures) {
        const ct = Math.max(1, w.width >> st), Rt = Math.max(1, w.height >> st);
        ot === r.TEXTURE_3D || ot === r.TEXTURE_2D_ARRAY ? e.texImage3D(ot, st, ft, ct, Rt, w.depth, 0, Lt, pt, null) : e.texImage2D(ot, st, ft, ct, Rt, 0, Lt, pt, null);
      }
      e.bindFramebuffer(r.FRAMEBUFFER, L), lt(w) ? a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, tt, ot, n.get(G).__webglTexture, 0, K(w)) : (ot === r.TEXTURE_2D || ot >= r.TEXTURE_CUBE_MAP_POSITIVE_X && ot <= r.TEXTURE_CUBE_MAP_NEGATIVE_Z) && r.framebufferTexture2D(r.FRAMEBUFFER, tt, ot, n.get(G).__webglTexture, st), e.bindFramebuffer(r.FRAMEBUFFER, null);
    }
    function at(L, w, G) {
      if (r.bindRenderbuffer(r.RENDERBUFFER, L), w.depthBuffer && !w.stencilBuffer) {
        let tt = r.DEPTH_COMPONENT24;
        if (G || lt(w)) {
          const ot = w.depthTexture;
          ot && ot.isDepthTexture && (ot.type === fn ? tt = r.DEPTH_COMPONENT32F : ot.type === $i && (tt = r.DEPTH_COMPONENT24));
          const st = K(w);
          lt(w) ? a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, st, tt, w.width, w.height) : r.renderbufferStorageMultisample(r.RENDERBUFFER, st, tt, w.width, w.height);
        } else r.renderbufferStorage(r.RENDERBUFFER, tt, w.width, w.height);
        r.framebufferRenderbuffer(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.RENDERBUFFER, L);
      } else if (w.depthBuffer && w.stencilBuffer) {
        const tt = K(w);
        G && lt(w) === false ? r.renderbufferStorageMultisample(r.RENDERBUFFER, tt, r.DEPTH24_STENCIL8, w.width, w.height) : lt(w) ? a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, tt, r.DEPTH24_STENCIL8, w.width, w.height) : r.renderbufferStorage(r.RENDERBUFFER, r.DEPTH_STENCIL, w.width, w.height), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.RENDERBUFFER, L);
      } else {
        const tt = w.textures;
        for (let ot = 0; ot < tt.length; ot++) {
          const st = tt[ot], Lt = s.convert(st.format, st.colorSpace), pt = s.convert(st.type), ft = v(st.internalFormat, Lt, pt, st.colorSpace), Vt = K(w);
          G && lt(w) === false ? r.renderbufferStorageMultisample(r.RENDERBUFFER, Vt, ft, w.width, w.height) : lt(w) ? a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER, Vt, ft, w.width, w.height) : r.renderbufferStorage(r.RENDERBUFFER, ft, w.width, w.height);
        }
      }
      r.bindRenderbuffer(r.RENDERBUFFER, null);
    }
    function _t(L, w) {
      if (w && w.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
      if (e.bindFramebuffer(r.FRAMEBUFFER, L), !(w.depthTexture && w.depthTexture.isDepthTexture)) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
      (!n.get(w.depthTexture).__webglTexture || w.depthTexture.image.width !== w.width || w.depthTexture.image.height !== w.height) && (w.depthTexture.image.width = w.width, w.depthTexture.image.height = w.height, w.depthTexture.needsUpdate = true), I(w.depthTexture, 0);
      const tt = n.get(w.depthTexture).__webglTexture, ot = K(w);
      if (w.depthTexture.format === Wi) lt(w) ? a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.TEXTURE_2D, tt, 0, ot) : r.framebufferTexture2D(r.FRAMEBUFFER, r.DEPTH_ATTACHMENT, r.TEXTURE_2D, tt, 0);
      else if (w.depthTexture.format === Os) lt(w) ? a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.TEXTURE_2D, tt, 0, ot) : r.framebufferTexture2D(r.FRAMEBUFFER, r.DEPTH_STENCIL_ATTACHMENT, r.TEXTURE_2D, tt, 0);
      else throw new Error("Unknown depthTexture format");
    }
    function J(L) {
      const w = n.get(L), G = L.isWebGLCubeRenderTarget === true;
      if (L.depthTexture && !w.__autoAllocateDepthBuffer) {
        if (G) throw new Error("target.depthTexture not supported in Cube render targets");
        _t(w.__webglFramebuffer, L);
      } else if (G) {
        w.__webglDepthbuffer = [];
        for (let tt = 0; tt < 6; tt++) e.bindFramebuffer(r.FRAMEBUFFER, w.__webglFramebuffer[tt]), w.__webglDepthbuffer[tt] = r.createRenderbuffer(), at(w.__webglDepthbuffer[tt], L, false);
      } else e.bindFramebuffer(r.FRAMEBUFFER, w.__webglFramebuffer), w.__webglDepthbuffer = r.createRenderbuffer(), at(w.__webglDepthbuffer, L, false);
      e.bindFramebuffer(r.FRAMEBUFFER, null);
    }
    function wt(L, w, G) {
      const tt = n.get(L);
      w !== void 0 && q(tt.__webglFramebuffer, L, L.texture, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, 0), G !== void 0 && J(L);
    }
    function Pt(L) {
      const w = L.texture, G = n.get(L), tt = n.get(w);
      L.addEventListener("dispose", P);
      const ot = L.textures, st = L.isWebGLCubeRenderTarget === true, Lt = ot.length > 1;
      if (Lt || (tt.__webglTexture === void 0 && (tt.__webglTexture = r.createTexture()), tt.__version = w.version, o.memory.textures++), st) {
        G.__webglFramebuffer = [];
        for (let pt = 0; pt < 6; pt++) if (w.mipmaps && w.mipmaps.length > 0) {
          G.__webglFramebuffer[pt] = [];
          for (let ft = 0; ft < w.mipmaps.length; ft++) G.__webglFramebuffer[pt][ft] = r.createFramebuffer();
        } else G.__webglFramebuffer[pt] = r.createFramebuffer();
      } else {
        if (w.mipmaps && w.mipmaps.length > 0) {
          G.__webglFramebuffer = [];
          for (let pt = 0; pt < w.mipmaps.length; pt++) G.__webglFramebuffer[pt] = r.createFramebuffer();
        } else G.__webglFramebuffer = r.createFramebuffer();
        if (Lt) for (let pt = 0, ft = ot.length; pt < ft; pt++) {
          const Vt = n.get(ot[pt]);
          Vt.__webglTexture === void 0 && (Vt.__webglTexture = r.createTexture(), o.memory.textures++);
        }
        if (L.samples > 0 && lt(L) === false) {
          G.__webglMultisampledFramebuffer = r.createFramebuffer(), G.__webglColorRenderbuffer = [], e.bindFramebuffer(r.FRAMEBUFFER, G.__webglMultisampledFramebuffer);
          for (let pt = 0; pt < ot.length; pt++) {
            const ft = ot[pt];
            G.__webglColorRenderbuffer[pt] = r.createRenderbuffer(), r.bindRenderbuffer(r.RENDERBUFFER, G.__webglColorRenderbuffer[pt]);
            const Vt = s.convert(ft.format, ft.colorSpace), ct = s.convert(ft.type), Rt = v(ft.internalFormat, Vt, ct, ft.colorSpace, L.isXRRenderTarget === true), Zt = K(L);
            r.renderbufferStorageMultisample(r.RENDERBUFFER, Zt, Rt, L.width, L.height), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + pt, r.RENDERBUFFER, G.__webglColorRenderbuffer[pt]);
          }
          r.bindRenderbuffer(r.RENDERBUFFER, null), L.depthBuffer && (G.__webglDepthRenderbuffer = r.createRenderbuffer(), at(G.__webglDepthRenderbuffer, L, true)), e.bindFramebuffer(r.FRAMEBUFFER, null);
        }
      }
      if (st) {
        e.bindTexture(r.TEXTURE_CUBE_MAP, tt.__webglTexture), Y(r.TEXTURE_CUBE_MAP, w);
        for (let pt = 0; pt < 6; pt++) if (w.mipmaps && w.mipmaps.length > 0) for (let ft = 0; ft < w.mipmaps.length; ft++) q(G.__webglFramebuffer[pt][ft], L, w, r.COLOR_ATTACHMENT0, r.TEXTURE_CUBE_MAP_POSITIVE_X + pt, ft);
        else q(G.__webglFramebuffer[pt], L, w, r.COLOR_ATTACHMENT0, r.TEXTURE_CUBE_MAP_POSITIVE_X + pt, 0);
        g(w) && p(r.TEXTURE_CUBE_MAP), e.unbindTexture();
      } else if (Lt) {
        for (let pt = 0, ft = ot.length; pt < ft; pt++) {
          const Vt = ot[pt], ct = n.get(Vt);
          e.bindTexture(r.TEXTURE_2D, ct.__webglTexture), Y(r.TEXTURE_2D, Vt), q(G.__webglFramebuffer, L, Vt, r.COLOR_ATTACHMENT0 + pt, r.TEXTURE_2D, 0), g(Vt) && p(r.TEXTURE_2D);
        }
        e.unbindTexture();
      } else {
        let pt = r.TEXTURE_2D;
        if ((L.isWebGL3DRenderTarget || L.isWebGLArrayRenderTarget) && (pt = L.isWebGL3DRenderTarget ? r.TEXTURE_3D : r.TEXTURE_2D_ARRAY), e.bindTexture(pt, tt.__webglTexture), Y(pt, w), w.mipmaps && w.mipmaps.length > 0) for (let ft = 0; ft < w.mipmaps.length; ft++) q(G.__webglFramebuffer[ft], L, w, r.COLOR_ATTACHMENT0, pt, ft);
        else q(G.__webglFramebuffer, L, w, r.COLOR_ATTACHMENT0, pt, 0);
        g(w) && p(pt), e.unbindTexture();
      }
      L.depthBuffer && J(L);
    }
    function B(L) {
      const w = L.textures;
      for (let G = 0, tt = w.length; G < tt; G++) {
        const ot = w[G];
        if (g(ot)) {
          const st = L.isWebGLCubeRenderTarget ? r.TEXTURE_CUBE_MAP : r.TEXTURE_2D, Lt = n.get(ot).__webglTexture;
          e.bindTexture(st, Lt), p(st), e.unbindTexture();
        }
      }
    }
    const Ot = [], Z = [];
    function j(L) {
      if (L.samples > 0) {
        if (lt(L) === false) {
          const w = L.textures, G = L.width, tt = L.height;
          let ot = r.COLOR_BUFFER_BIT;
          const st = L.stencilBuffer ? r.DEPTH_STENCIL_ATTACHMENT : r.DEPTH_ATTACHMENT, Lt = n.get(L), pt = w.length > 1;
          if (pt) for (let ft = 0; ft < w.length; ft++) e.bindFramebuffer(r.FRAMEBUFFER, Lt.__webglMultisampledFramebuffer), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ft, r.RENDERBUFFER, null), e.bindFramebuffer(r.FRAMEBUFFER, Lt.__webglFramebuffer), r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ft, r.TEXTURE_2D, null, 0);
          e.bindFramebuffer(r.READ_FRAMEBUFFER, Lt.__webglMultisampledFramebuffer), e.bindFramebuffer(r.DRAW_FRAMEBUFFER, Lt.__webglFramebuffer);
          for (let ft = 0; ft < w.length; ft++) {
            if (L.resolveDepthBuffer && (L.depthBuffer && (ot |= r.DEPTH_BUFFER_BIT), L.stencilBuffer && L.resolveStencilBuffer && (ot |= r.STENCIL_BUFFER_BIT)), pt) {
              r.framebufferRenderbuffer(r.READ_FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.RENDERBUFFER, Lt.__webglColorRenderbuffer[ft]);
              const Vt = n.get(w[ft]).__webglTexture;
              r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, Vt, 0);
            }
            r.blitFramebuffer(0, 0, G, tt, 0, 0, G, tt, ot, r.NEAREST), l === true && (Ot.length = 0, Z.length = 0, Ot.push(r.COLOR_ATTACHMENT0 + ft), L.depthBuffer && L.resolveDepthBuffer === false && (Ot.push(st), Z.push(st), r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER, Z)), r.invalidateFramebuffer(r.READ_FRAMEBUFFER, Ot));
          }
          if (e.bindFramebuffer(r.READ_FRAMEBUFFER, null), e.bindFramebuffer(r.DRAW_FRAMEBUFFER, null), pt) for (let ft = 0; ft < w.length; ft++) {
            e.bindFramebuffer(r.FRAMEBUFFER, Lt.__webglMultisampledFramebuffer), r.framebufferRenderbuffer(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ft, r.RENDERBUFFER, Lt.__webglColorRenderbuffer[ft]);
            const Vt = n.get(w[ft]).__webglTexture;
            e.bindFramebuffer(r.FRAMEBUFFER, Lt.__webglFramebuffer), r.framebufferTexture2D(r.DRAW_FRAMEBUFFER, r.COLOR_ATTACHMENT0 + ft, r.TEXTURE_2D, Vt, 0);
          }
          e.bindFramebuffer(r.DRAW_FRAMEBUFFER, Lt.__webglMultisampledFramebuffer);
        } else if (L.depthBuffer && L.resolveDepthBuffer === false && l) {
          const w = L.stencilBuffer ? r.DEPTH_STENCIL_ATTACHMENT : r.DEPTH_ATTACHMENT;
          r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER, [
            w
          ]);
        }
      }
    }
    function K(L) {
      return Math.min(i.maxSamples, L.samples);
    }
    function lt(L) {
      const w = n.get(L);
      return L.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === true && w.__useRenderToTexture !== false;
    }
    function it(L) {
      const w = o.render.frame;
      h.get(L) !== w && (h.set(L, w), L.update());
    }
    function vt(L, w) {
      const G = L.colorSpace, tt = L.format, ot = L.type;
      return L.isCompressedTexture === true || L.isVideoTexture === true || G !== ti && G !== Vn && (ne.getTransfer(G) === re ? (tt !== nn || ot !== Kn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", G)), w;
    }
    function It(L) {
      return typeof HTMLImageElement < "u" && L instanceof HTMLImageElement ? (c.width = L.naturalWidth || L.width, c.height = L.naturalHeight || L.height) : typeof VideoFrame < "u" && L instanceof VideoFrame ? (c.width = L.displayWidth, c.height = L.displayHeight) : (c.width = L.width, c.height = L.height), c;
    }
    this.allocateTextureUnit = C, this.resetTextureUnits = y, this.setTexture2D = I, this.setTexture2DArray = U, this.setTexture3D = D, this.setTextureCube = O, this.rebindTextures = wt, this.setupRenderTarget = Pt, this.updateRenderTargetMipmap = B, this.updateMultisampleRenderTarget = j, this.setupDepthRenderbuffer = J, this.setupFrameBufferTexture = q, this.useMultisampledRTT = lt;
  }
  function qf(r, t) {
    function e(n, i = Vn) {
      let s;
      const o = ne.getTransfer(i);
      if (n === Kn) return r.UNSIGNED_BYTE;
      if (n === zc) return r.UNSIGNED_SHORT_4_4_4_4;
      if (n === Fc) return r.UNSIGNED_SHORT_5_5_5_1;
      if (n === uf) return r.UNSIGNED_INT_5_9_9_9_REV;
      if (n === cf) return r.BYTE;
      if (n === hf) return r.SHORT;
      if (n === Nc) return r.UNSIGNED_SHORT;
      if (n === Oc) return r.INT;
      if (n === $i) return r.UNSIGNED_INT;
      if (n === fn) return r.FLOAT;
      if (n === qr) return r.HALF_FLOAT;
      if (n === df) return r.ALPHA;
      if (n === ff) return r.RGB;
      if (n === nn) return r.RGBA;
      if (n === pf) return r.LUMINANCE;
      if (n === mf) return r.LUMINANCE_ALPHA;
      if (n === Wi) return r.DEPTH_COMPONENT;
      if (n === Os) return r.DEPTH_STENCIL;
      if (n === Bc) return r.RED;
      if (n === kc) return r.RED_INTEGER;
      if (n === gf) return r.RG;
      if (n === Vc) return r.RG_INTEGER;
      if (n === Hc) return r.RGBA_INTEGER;
      if (n === ta || n === ea || n === na || n === ia) if (o === re) if (s = t.get("WEBGL_compressed_texture_s3tc_srgb"), s !== null) {
        if (n === ta) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        if (n === ea) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        if (n === na) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        if (n === ia) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      } else return null;
      else if (s = t.get("WEBGL_compressed_texture_s3tc"), s !== null) {
        if (n === ta) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === ea) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === na) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === ia) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
      if (n === Xl || n === Yl || n === ql || n === $l) if (s = t.get("WEBGL_compressed_texture_pvrtc"), s !== null) {
        if (n === Xl) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Yl) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === ql) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === $l) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
      if (n === Zl || n === Jl || n === Kl) if (s = t.get("WEBGL_compressed_texture_etc"), s !== null) {
        if (n === Zl || n === Jl) return o === re ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (n === Kl) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : s.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
      if (n === Ql || n === jl || n === tc || n === ec || n === nc || n === ic || n === sc || n === rc || n === oc || n === ac || n === lc || n === cc || n === hc || n === uc) if (s = t.get("WEBGL_compressed_texture_astc"), s !== null) {
        if (n === Ql) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === jl) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === tc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === ec) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === nc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === ic) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === sc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === rc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === oc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === ac) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === lc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === cc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === hc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === uc) return o === re ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
      if (n === sa || n === dc || n === fc) if (s = t.get("EXT_texture_compression_bptc"), s !== null) {
        if (n === sa) return o === re ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === dc) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === fc) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
      if (n === _f || n === pc || n === mc || n === gc) if (s = t.get("EXT_texture_compression_rgtc"), s !== null) {
        if (n === sa) return s.COMPRESSED_RED_RGTC1_EXT;
        if (n === pc) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === mc) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === gc) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
      return n === Hs ? r.UNSIGNED_INT_24_8 : r[n] !== void 0 ? r[n] : null;
    }
    return {
      convert: e
    };
  }
  class $f extends be {
    constructor(t = []) {
      super(), this.isArrayCamera = true, this.cameras = t;
    }
  }
  class vn extends jt {
    constructor() {
      super(), this.isGroup = true, this.type = "Group";
    }
  }
  const gy = {
    type: "move"
  };
  class Sl {
    constructor() {
      this._targetRay = null, this._grip = null, this._hand = null;
    }
    getHandSpace() {
      return this._hand === null && (this._hand = new vn(), this._hand.matrixAutoUpdate = false, this._hand.visible = false, this._hand.joints = {}, this._hand.inputState = {
        pinching: false
      }), this._hand;
    }
    getTargetRaySpace() {
      return this._targetRay === null && (this._targetRay = new vn(), this._targetRay.matrixAutoUpdate = false, this._targetRay.visible = false, this._targetRay.hasLinearVelocity = false, this._targetRay.linearVelocity = new R(), this._targetRay.hasAngularVelocity = false, this._targetRay.angularVelocity = new R()), this._targetRay;
    }
    getGripSpace() {
      return this._grip === null && (this._grip = new vn(), this._grip.matrixAutoUpdate = false, this._grip.visible = false, this._grip.hasLinearVelocity = false, this._grip.linearVelocity = new R(), this._grip.hasAngularVelocity = false, this._grip.angularVelocity = new R()), this._grip;
    }
    dispatchEvent(t) {
      return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
    }
    connect(t) {
      if (t && t.hand) {
        const e = this._hand;
        if (e) for (const n of t.hand.values()) this._getHandJoint(e, n);
      }
      return this.dispatchEvent({
        type: "connected",
        data: t
      }), this;
    }
    disconnect(t) {
      return this.dispatchEvent({
        type: "disconnected",
        data: t
      }), this._targetRay !== null && (this._targetRay.visible = false), this._grip !== null && (this._grip.visible = false), this._hand !== null && (this._hand.visible = false), this;
    }
    update(t, e, n) {
      let i = null, s = null, o = null;
      const a = this._targetRay, l = this._grip, c = this._hand;
      if (t && e.session.visibilityState !== "visible-blurred") {
        if (c && t.hand) {
          o = true;
          for (const _ of t.hand.values()) {
            const g = e.getJointPose(_, n), p = this._getHandJoint(c, _);
            g !== null && (p.matrix.fromArray(g.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = true, p.jointRadius = g.radius), p.visible = g !== null;
          }
          const h = c.joints["index-finger-tip"], d = c.joints["thumb-tip"], u = h.position.distanceTo(d.position), f = 0.02, m = 5e-3;
          c.inputState.pinching && u > f + m ? (c.inputState.pinching = false, this.dispatchEvent({
            type: "pinchend",
            handedness: t.handedness,
            target: this
          })) : !c.inputState.pinching && u <= f - m && (c.inputState.pinching = true, this.dispatchEvent({
            type: "pinchstart",
            handedness: t.handedness,
            target: this
          }));
        } else l !== null && t.gripSpace && (s = e.getPose(t.gripSpace, n), s !== null && (l.matrix.fromArray(s.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = true, s.linearVelocity ? (l.hasLinearVelocity = true, l.linearVelocity.copy(s.linearVelocity)) : l.hasLinearVelocity = false, s.angularVelocity ? (l.hasAngularVelocity = true, l.angularVelocity.copy(s.angularVelocity)) : l.hasAngularVelocity = false));
        a !== null && (i = e.getPose(t.targetRaySpace, n), i === null && s !== null && (i = s), i !== null && (a.matrix.fromArray(i.transform.matrix), a.matrix.decompose(a.position, a.rotation, a.scale), a.matrixWorldNeedsUpdate = true, i.linearVelocity ? (a.hasLinearVelocity = true, a.linearVelocity.copy(i.linearVelocity)) : a.hasLinearVelocity = false, i.angularVelocity ? (a.hasAngularVelocity = true, a.angularVelocity.copy(i.angularVelocity)) : a.hasAngularVelocity = false, this.dispatchEvent(gy)));
      }
      return a !== null && (a.visible = i !== null), l !== null && (l.visible = s !== null), c !== null && (c.visible = o !== null), this;
    }
    _getHandJoint(t, e) {
      if (t.joints[e.jointName] === void 0) {
        const n = new vn();
        n.matrixAutoUpdate = false, n.visible = false, t.joints[e.jointName] = n, t.add(n);
      }
      return t.joints[e.jointName];
    }
  }
  const _y = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, xy = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
  class vy {
    constructor() {
      this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
    }
    init(t, e, n) {
      if (this.texture === null) {
        const i = new fe(), s = t.properties.get(i);
        s.__webglTexture = e.texture, (e.depthNear != n.depthNear || e.depthFar != n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = i;
      }
    }
    render(t, e) {
      if (this.texture !== null) {
        if (this.mesh === null) {
          const n = e.cameras[0].viewport, i = new Sn({
            vertexShader: _y,
            fragmentShader: xy,
            uniforms: {
              depthColor: {
                value: this.texture
              },
              depthWidth: {
                value: n.z
              },
              depthHeight: {
                value: n.w
              }
            }
          });
          this.mesh = new ae(new Ws(20, 20), i);
        }
        t.render(this.mesh, e);
      }
    }
    reset() {
      this.texture = null, this.mesh = null;
    }
  }
  class yy extends ei {
    constructor(t, e) {
      super();
      const n = this;
      let i = null, s = 1, o = null, a = "local-floor", l = 1, c = null, h = null, d = null, u = null, f = null, m = null;
      const _ = new vy(), g = e.getContextAttributes();
      let p = null, v = null;
      const x = [], S = [], P = new et();
      let b = null;
      const T = new be();
      T.layers.enable(1), T.viewport = new ie();
      const E = new be();
      E.layers.enable(2), E.viewport = new ie();
      const M = [
        T,
        E
      ], y = new $f();
      y.layers.enable(1), y.layers.enable(2);
      let C = null, N = null;
      this.cameraAutoUpdate = true, this.enabled = false, this.isPresenting = false, this.getController = function(q) {
        let at = x[q];
        return at === void 0 && (at = new Sl(), x[q] = at), at.getTargetRaySpace();
      }, this.getControllerGrip = function(q) {
        let at = x[q];
        return at === void 0 && (at = new Sl(), x[q] = at), at.getGripSpace();
      }, this.getHand = function(q) {
        let at = x[q];
        return at === void 0 && (at = new Sl(), x[q] = at), at.getHandSpace();
      };
      function I(q) {
        const at = S.indexOf(q.inputSource);
        if (at === -1) return;
        const _t = x[at];
        _t !== void 0 && (_t.update(q.inputSource, q.frame, c || o), _t.dispatchEvent({
          type: q.type,
          data: q.inputSource
        }));
      }
      function U() {
        i.removeEventListener("select", I), i.removeEventListener("selectstart", I), i.removeEventListener("selectend", I), i.removeEventListener("squeeze", I), i.removeEventListener("squeezestart", I), i.removeEventListener("squeezeend", I), i.removeEventListener("end", U), i.removeEventListener("inputsourceschange", D);
        for (let q = 0; q < x.length; q++) {
          const at = S[q];
          at !== null && (S[q] = null, x[q].disconnect(at));
        }
        C = null, N = null, _.reset(), t.setRenderTarget(p), f = null, u = null, d = null, i = null, v = null, Et.stop(), n.isPresenting = false, t.setPixelRatio(b), t.setSize(P.width, P.height, false), n.dispatchEvent({
          type: "sessionend"
        });
      }
      this.setFramebufferScaleFactor = function(q) {
        s = q, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
      }, this.setReferenceSpaceType = function(q) {
        a = q, n.isPresenting === true && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
      }, this.getReferenceSpace = function() {
        return c || o;
      }, this.setReferenceSpace = function(q) {
        c = q;
      }, this.getBaseLayer = function() {
        return u !== null ? u : f;
      }, this.getBinding = function() {
        return d;
      }, this.getFrame = function() {
        return m;
      }, this.getSession = function() {
        return i;
      }, this.setSession = async function(q) {
        if (i = q, i !== null) {
          if (p = t.getRenderTarget(), i.addEventListener("select", I), i.addEventListener("selectstart", I), i.addEventListener("selectend", I), i.addEventListener("squeeze", I), i.addEventListener("squeezestart", I), i.addEventListener("squeezeend", I), i.addEventListener("end", U), i.addEventListener("inputsourceschange", D), g.xrCompatible !== true && await e.makeXRCompatible(), b = t.getPixelRatio(), t.getSize(P), i.renderState.layers === void 0) {
            const at = {
              antialias: g.antialias,
              alpha: true,
              depth: g.depth,
              stencil: g.stencil,
              framebufferScaleFactor: s
            };
            f = new XRWebGLLayer(i, e, at), i.updateRenderState({
              baseLayer: f
            }), t.setPixelRatio(1), t.setSize(f.framebufferWidth, f.framebufferHeight, false), v = new Mn(f.framebufferWidth, f.framebufferHeight, {
              format: nn,
              type: Kn,
              colorSpace: t.outputColorSpace,
              stencilBuffer: g.stencil
            });
          } else {
            let at = null, _t = null, J = null;
            g.depth && (J = g.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, at = g.stencil ? Os : Wi, _t = g.stencil ? Hs : $i);
            const wt = {
              colorFormat: e.RGBA8,
              depthFormat: J,
              scaleFactor: s
            };
            d = new XRWebGLBinding(i, e), u = d.createProjectionLayer(wt), i.updateRenderState({
              layers: [
                u
              ]
            }), t.setPixelRatio(1), t.setSize(u.textureWidth, u.textureHeight, false), v = new Mn(u.textureWidth, u.textureHeight, {
              format: nn,
              type: Kn,
              depthTexture: new Jc(u.textureWidth, u.textureHeight, _t, void 0, void 0, void 0, void 0, void 0, void 0, at),
              stencilBuffer: g.stencil,
              colorSpace: t.outputColorSpace,
              samples: g.antialias ? 4 : 0,
              resolveDepthBuffer: u.ignoreDepthValues === false
            });
          }
          v.isXRRenderTarget = true, this.setFoveation(l), c = null, o = await i.requestReferenceSpace(a), Et.setContext(i), Et.start(), n.isPresenting = true, n.dispatchEvent({
            type: "sessionstart"
          });
        }
      }, this.getEnvironmentBlendMode = function() {
        if (i !== null) return i.environmentBlendMode;
      };
      function D(q) {
        for (let at = 0; at < q.removed.length; at++) {
          const _t = q.removed[at], J = S.indexOf(_t);
          J >= 0 && (S[J] = null, x[J].disconnect(_t));
        }
        for (let at = 0; at < q.added.length; at++) {
          const _t = q.added[at];
          let J = S.indexOf(_t);
          if (J === -1) {
            for (let Pt = 0; Pt < x.length; Pt++) if (Pt >= S.length) {
              S.push(_t), J = Pt;
              break;
            } else if (S[Pt] === null) {
              S[Pt] = _t, J = Pt;
              break;
            }
            if (J === -1) break;
          }
          const wt = x[J];
          wt && wt.connect(_t);
        }
      }
      const O = new R(), H = new R();
      function z(q, at, _t) {
        O.setFromMatrixPosition(at.matrixWorld), H.setFromMatrixPosition(_t.matrixWorld);
        const J = O.distanceTo(H), wt = at.projectionMatrix.elements, Pt = _t.projectionMatrix.elements, B = wt[14] / (wt[10] - 1), Ot = wt[14] / (wt[10] + 1), Z = (wt[9] + 1) / wt[5], j = (wt[9] - 1) / wt[5], K = (wt[8] - 1) / wt[0], lt = (Pt[8] + 1) / Pt[0], it = B * K, vt = B * lt, It = J / (-K + lt), L = It * -K;
        at.matrixWorld.decompose(q.position, q.quaternion, q.scale), q.translateX(L), q.translateZ(It), q.matrixWorld.compose(q.position, q.quaternion, q.scale), q.matrixWorldInverse.copy(q.matrixWorld).invert();
        const w = B + It, G = Ot + It, tt = it - L, ot = vt + (J - L), st = Z * Ot / G * w, Lt = j * Ot / G * w;
        q.projectionMatrix.makePerspective(tt, ot, st, Lt, w, G), q.projectionMatrixInverse.copy(q.projectionMatrix).invert();
      }
      function F(q, at) {
        at === null ? q.matrixWorld.copy(q.matrix) : q.matrixWorld.multiplyMatrices(at.matrixWorld, q.matrix), q.matrixWorldInverse.copy(q.matrixWorld).invert();
      }
      this.updateCamera = function(q) {
        if (i === null) return;
        _.texture !== null && (q.near = _.depthNear, q.far = _.depthFar), y.near = E.near = T.near = q.near, y.far = E.far = T.far = q.far, (C !== y.near || N !== y.far) && (i.updateRenderState({
          depthNear: y.near,
          depthFar: y.far
        }), C = y.near, N = y.far, T.near = C, T.far = N, E.near = C, E.far = N, T.updateProjectionMatrix(), E.updateProjectionMatrix(), q.updateProjectionMatrix());
        const at = q.parent, _t = y.cameras;
        F(y, at);
        for (let J = 0; J < _t.length; J++) F(_t[J], at);
        _t.length === 2 ? z(y, T, E) : y.projectionMatrix.copy(T.projectionMatrix), Y(q, y, at);
      };
      function Y(q, at, _t) {
        _t === null ? q.matrix.copy(at.matrixWorld) : (q.matrix.copy(_t.matrixWorld), q.matrix.invert(), q.matrix.multiply(at.matrixWorld)), q.matrix.decompose(q.position, q.quaternion, q.scale), q.updateMatrixWorld(true), q.projectionMatrix.copy(at.projectionMatrix), q.projectionMatrixInverse.copy(at.projectionMatrixInverse), q.isPerspectiveCamera && (q.fov = zs * 2 * Math.atan(1 / q.projectionMatrix.elements[5]), q.zoom = 1);
      }
      this.getCamera = function() {
        return y;
      }, this.getFoveation = function() {
        if (!(u === null && f === null)) return l;
      }, this.setFoveation = function(q) {
        l = q, u !== null && (u.fixedFoveation = q), f !== null && f.fixedFoveation !== void 0 && (f.fixedFoveation = q);
      }, this.hasDepthSensing = function() {
        return _.texture !== null;
      };
      let nt = null;
      function dt(q, at) {
        if (h = at.getViewerPose(c || o), m = at, h !== null) {
          const _t = h.views;
          f !== null && (t.setRenderTargetFramebuffer(v, f.framebuffer), t.setRenderTarget(v));
          let J = false;
          _t.length !== y.cameras.length && (y.cameras.length = 0, J = true);
          for (let Pt = 0; Pt < _t.length; Pt++) {
            const B = _t[Pt];
            let Ot = null;
            if (f !== null) Ot = f.getViewport(B);
            else {
              const j = d.getViewSubImage(u, B);
              Ot = j.viewport, Pt === 0 && (t.setRenderTargetTextures(v, j.colorTexture, u.ignoreDepthValues ? void 0 : j.depthStencilTexture), t.setRenderTarget(v));
            }
            let Z = M[Pt];
            Z === void 0 && (Z = new be(), Z.layers.enable(Pt), Z.viewport = new ie(), M[Pt] = Z), Z.matrix.fromArray(B.transform.matrix), Z.matrix.decompose(Z.position, Z.quaternion, Z.scale), Z.projectionMatrix.fromArray(B.projectionMatrix), Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert(), Z.viewport.set(Ot.x, Ot.y, Ot.width, Ot.height), Pt === 0 && (y.matrix.copy(Z.matrix), y.matrix.decompose(y.position, y.quaternion, y.scale)), J === true && y.cameras.push(Z);
          }
          const wt = i.enabledFeatures;
          if (wt && wt.includes("depth-sensing")) {
            const Pt = d.getDepthInformation(_t[0]);
            Pt && Pt.isValid && Pt.texture && _.init(t, Pt, i.renderState);
          }
        }
        for (let _t = 0; _t < x.length; _t++) {
          const J = S[_t], wt = x[_t];
          J !== null && wt !== void 0 && wt.update(J, at, c || o);
        }
        _.render(t, y), nt && nt(q, at), at.detectedPlanes && n.dispatchEvent({
          type: "planesdetected",
          data: at
        }), m = null;
      }
      const Et = new Vf();
      Et.setAnimationLoop(dt), this.setAnimationLoop = function(q) {
        nt = q;
      }, this.dispose = function() {
      };
    }
  }
  const Ri = new rn(), My = new Dt();
  function Sy(r, t) {
    function e(g, p) {
      g.matrixAutoUpdate === true && g.updateMatrix(), p.value.copy(g.matrix);
    }
    function n(g, p) {
      p.color.getRGB(g.fogColor.value, zf(r)), p.isFog ? (g.fogNear.value = p.near, g.fogFar.value = p.far) : p.isFogExp2 && (g.fogDensity.value = p.density);
    }
    function i(g, p, v, x, S) {
      p.isMeshBasicMaterial || p.isMeshLambertMaterial ? s(g, p) : p.isMeshToonMaterial ? (s(g, p), d(g, p)) : p.isMeshPhongMaterial ? (s(g, p), h(g, p)) : p.isMeshStandardMaterial ? (s(g, p), u(g, p), p.isMeshPhysicalMaterial && f(g, p, S)) : p.isMeshMatcapMaterial ? (s(g, p), m(g, p)) : p.isMeshDepthMaterial ? s(g, p) : p.isMeshDistanceMaterial ? (s(g, p), _(g, p)) : p.isMeshNormalMaterial ? s(g, p) : p.isLineBasicMaterial ? (o(g, p), p.isLineDashedMaterial && a(g, p)) : p.isPointsMaterial ? l(g, p, v, x) : p.isSpriteMaterial ? c(g, p) : p.isShadowMaterial ? (g.color.value.copy(p.color), g.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = false);
    }
    function s(g, p) {
      g.opacity.value = p.opacity, p.color && g.diffuse.value.copy(p.color), p.emissive && g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (g.map.value = p.map, e(p.map, g.mapTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.bumpMap && (g.bumpMap.value = p.bumpMap, e(p.bumpMap, g.bumpMapTransform), g.bumpScale.value = p.bumpScale, p.side === Ve && (g.bumpScale.value *= -1)), p.normalMap && (g.normalMap.value = p.normalMap, e(p.normalMap, g.normalMapTransform), g.normalScale.value.copy(p.normalScale), p.side === Ve && g.normalScale.value.negate()), p.displacementMap && (g.displacementMap.value = p.displacementMap, e(p.displacementMap, g.displacementMapTransform), g.displacementScale.value = p.displacementScale, g.displacementBias.value = p.displacementBias), p.emissiveMap && (g.emissiveMap.value = p.emissiveMap, e(p.emissiveMap, g.emissiveMapTransform)), p.specularMap && (g.specularMap.value = p.specularMap, e(p.specularMap, g.specularMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
      const v = t.get(p), x = v.envMap, S = v.envMapRotation;
      if (x && (g.envMap.value = x, Ri.copy(S), Ri.x *= -1, Ri.y *= -1, Ri.z *= -1, x.isCubeTexture && x.isRenderTargetTexture === false && (Ri.y *= -1, Ri.z *= -1), g.envMapRotation.value.setFromMatrix4(My.makeRotationFromEuler(Ri)), g.flipEnvMap.value = x.isCubeTexture && x.isRenderTargetTexture === false ? -1 : 1, g.reflectivity.value = p.reflectivity, g.ior.value = p.ior, g.refractionRatio.value = p.refractionRatio), p.lightMap) {
        g.lightMap.value = p.lightMap;
        const P = r._useLegacyLights === true ? Math.PI : 1;
        g.lightMapIntensity.value = p.lightMapIntensity * P, e(p.lightMap, g.lightMapTransform);
      }
      p.aoMap && (g.aoMap.value = p.aoMap, g.aoMapIntensity.value = p.aoMapIntensity, e(p.aoMap, g.aoMapTransform));
    }
    function o(g, p) {
      g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, p.map && (g.map.value = p.map, e(p.map, g.mapTransform));
    }
    function a(g, p) {
      g.dashSize.value = p.dashSize, g.totalSize.value = p.dashSize + p.gapSize, g.scale.value = p.scale;
    }
    function l(g, p, v, x) {
      g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, g.size.value = p.size * v, g.scale.value = x * 0.5, p.map && (g.map.value = p.map, e(p.map, g.uvTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
    }
    function c(g, p) {
      g.diffuse.value.copy(p.color), g.opacity.value = p.opacity, g.rotation.value = p.rotation, p.map && (g.map.value = p.map, e(p.map, g.mapTransform)), p.alphaMap && (g.alphaMap.value = p.alphaMap, e(p.alphaMap, g.alphaMapTransform)), p.alphaTest > 0 && (g.alphaTest.value = p.alphaTest);
    }
    function h(g, p) {
      g.specular.value.copy(p.specular), g.shininess.value = Math.max(p.shininess, 1e-4);
    }
    function d(g, p) {
      p.gradientMap && (g.gradientMap.value = p.gradientMap);
    }
    function u(g, p) {
      g.metalness.value = p.metalness, p.metalnessMap && (g.metalnessMap.value = p.metalnessMap, e(p.metalnessMap, g.metalnessMapTransform)), g.roughness.value = p.roughness, p.roughnessMap && (g.roughnessMap.value = p.roughnessMap, e(p.roughnessMap, g.roughnessMapTransform)), p.envMap && (g.envMapIntensity.value = p.envMapIntensity);
    }
    function f(g, p, v) {
      g.ior.value = p.ior, p.sheen > 0 && (g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), g.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (g.sheenColorMap.value = p.sheenColorMap, e(p.sheenColorMap, g.sheenColorMapTransform)), p.sheenRoughnessMap && (g.sheenRoughnessMap.value = p.sheenRoughnessMap, e(p.sheenRoughnessMap, g.sheenRoughnessMapTransform))), p.clearcoat > 0 && (g.clearcoat.value = p.clearcoat, g.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (g.clearcoatMap.value = p.clearcoatMap, e(p.clearcoatMap, g.clearcoatMapTransform)), p.clearcoatRoughnessMap && (g.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, e(p.clearcoatRoughnessMap, g.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (g.clearcoatNormalMap.value = p.clearcoatNormalMap, e(p.clearcoatNormalMap, g.clearcoatNormalMapTransform), g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === Ve && g.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (g.dispersion.value = p.dispersion), p.iridescence > 0 && (g.iridescence.value = p.iridescence, g.iridescenceIOR.value = p.iridescenceIOR, g.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], g.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (g.iridescenceMap.value = p.iridescenceMap, e(p.iridescenceMap, g.iridescenceMapTransform)), p.iridescenceThicknessMap && (g.iridescenceThicknessMap.value = p.iridescenceThicknessMap, e(p.iridescenceThicknessMap, g.iridescenceThicknessMapTransform))), p.transmission > 0 && (g.transmission.value = p.transmission, g.transmissionSamplerMap.value = v.texture, g.transmissionSamplerSize.value.set(v.width, v.height), p.transmissionMap && (g.transmissionMap.value = p.transmissionMap, e(p.transmissionMap, g.transmissionMapTransform)), g.thickness.value = p.thickness, p.thicknessMap && (g.thicknessMap.value = p.thicknessMap, e(p.thicknessMap, g.thicknessMapTransform)), g.attenuationDistance.value = p.attenuationDistance, g.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (g.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (g.anisotropyMap.value = p.anisotropyMap, e(p.anisotropyMap, g.anisotropyMapTransform))), g.specularIntensity.value = p.specularIntensity, g.specularColor.value.copy(p.specularColor), p.specularColorMap && (g.specularColorMap.value = p.specularColorMap, e(p.specularColorMap, g.specularColorMapTransform)), p.specularIntensityMap && (g.specularIntensityMap.value = p.specularIntensityMap, e(p.specularIntensityMap, g.specularIntensityMapTransform));
    }
    function m(g, p) {
      p.matcap && (g.matcap.value = p.matcap);
    }
    function _(g, p) {
      const v = t.get(p).light;
      g.referencePosition.value.setFromMatrixPosition(v.matrixWorld), g.nearDistance.value = v.shadow.camera.near, g.farDistance.value = v.shadow.camera.far;
    }
    return {
      refreshFogUniforms: n,
      refreshMaterialUniforms: i
    };
  }
  function by(r, t, e, n) {
    let i = {}, s = {}, o = [];
    const a = r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);
    function l(v, x) {
      const S = x.program;
      n.uniformBlockBinding(v, S);
    }
    function c(v, x) {
      let S = i[v.id];
      S === void 0 && (m(v), S = h(v), i[v.id] = S, v.addEventListener("dispose", g));
      const P = x.program;
      n.updateUBOMapping(v, P);
      const b = t.render.frame;
      s[v.id] !== b && (u(v), s[v.id] = b);
    }
    function h(v) {
      const x = d();
      v.__bindingPointIndex = x;
      const S = r.createBuffer(), P = v.__size, b = v.usage;
      return r.bindBuffer(r.UNIFORM_BUFFER, S), r.bufferData(r.UNIFORM_BUFFER, P, b), r.bindBuffer(r.UNIFORM_BUFFER, null), r.bindBufferBase(r.UNIFORM_BUFFER, x, S), S;
    }
    function d() {
      for (let v = 0; v < a; v++) if (o.indexOf(v) === -1) return o.push(v), v;
      return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
    }
    function u(v) {
      const x = i[v.id], S = v.uniforms, P = v.__cache;
      r.bindBuffer(r.UNIFORM_BUFFER, x);
      for (let b = 0, T = S.length; b < T; b++) {
        const E = Array.isArray(S[b]) ? S[b] : [
          S[b]
        ];
        for (let M = 0, y = E.length; M < y; M++) {
          const C = E[M];
          if (f(C, b, M, P) === true) {
            const N = C.__offset, I = Array.isArray(C.value) ? C.value : [
              C.value
            ];
            let U = 0;
            for (let D = 0; D < I.length; D++) {
              const O = I[D], H = _(O);
              typeof O == "number" || typeof O == "boolean" ? (C.__data[0] = O, r.bufferSubData(r.UNIFORM_BUFFER, N + U, C.__data)) : O.isMatrix3 ? (C.__data[0] = O.elements[0], C.__data[1] = O.elements[1], C.__data[2] = O.elements[2], C.__data[3] = 0, C.__data[4] = O.elements[3], C.__data[5] = O.elements[4], C.__data[6] = O.elements[5], C.__data[7] = 0, C.__data[8] = O.elements[6], C.__data[9] = O.elements[7], C.__data[10] = O.elements[8], C.__data[11] = 0) : (O.toArray(C.__data, U), U += H.storage / Float32Array.BYTES_PER_ELEMENT);
            }
            r.bufferSubData(r.UNIFORM_BUFFER, N, C.__data);
          }
        }
      }
      r.bindBuffer(r.UNIFORM_BUFFER, null);
    }
    function f(v, x, S, P) {
      const b = v.value, T = x + "_" + S;
      if (P[T] === void 0) return typeof b == "number" || typeof b == "boolean" ? P[T] = b : P[T] = b.clone(), true;
      {
        const E = P[T];
        if (typeof b == "number" || typeof b == "boolean") {
          if (E !== b) return P[T] = b, true;
        } else if (E.equals(b) === false) return E.copy(b), true;
      }
      return false;
    }
    function m(v) {
      const x = v.uniforms;
      let S = 0;
      const P = 16;
      for (let T = 0, E = x.length; T < E; T++) {
        const M = Array.isArray(x[T]) ? x[T] : [
          x[T]
        ];
        for (let y = 0, C = M.length; y < C; y++) {
          const N = M[y], I = Array.isArray(N.value) ? N.value : [
            N.value
          ];
          for (let U = 0, D = I.length; U < D; U++) {
            const O = I[U], H = _(O), z = S % P;
            z !== 0 && P - z < H.boundary && (S += P - z), N.__data = new Float32Array(H.storage / Float32Array.BYTES_PER_ELEMENT), N.__offset = S, S += H.storage;
          }
        }
      }
      const b = S % P;
      return b > 0 && (S += P - b), v.__size = S, v.__cache = {}, this;
    }
    function _(v) {
      const x = {
        boundary: 0,
        storage: 0
      };
      return typeof v == "number" || typeof v == "boolean" ? (x.boundary = 4, x.storage = 4) : v.isVector2 ? (x.boundary = 8, x.storage = 8) : v.isVector3 || v.isColor ? (x.boundary = 16, x.storage = 12) : v.isVector4 ? (x.boundary = 16, x.storage = 16) : v.isMatrix3 ? (x.boundary = 48, x.storage = 48) : v.isMatrix4 ? (x.boundary = 64, x.storage = 64) : v.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", v), x;
    }
    function g(v) {
      const x = v.target;
      x.removeEventListener("dispose", g);
      const S = o.indexOf(x.__bindingPointIndex);
      o.splice(S, 1), r.deleteBuffer(i[x.id]), delete i[x.id], delete s[x.id];
    }
    function p() {
      for (const v in i) r.deleteBuffer(i[v]);
      o = [], i = {}, s = {};
    }
    return {
      bind: l,
      update: c,
      dispose: p
    };
  }
  class Zf {
    constructor(t = {}) {
      const { canvas: e = Lf(), context: n = null, depth: i = true, stencil: s = false, alpha: o = false, antialias: a = false, premultipliedAlpha: l = true, preserveDrawingBuffer: c = false, powerPreference: h = "default", failIfMajorPerformanceCaveat: d = false } = t;
      this.isWebGLRenderer = true;
      let u;
      if (n !== null) {
        if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
        u = n.getContextAttributes().alpha;
      } else u = o;
      const f = new Uint32Array(4), m = new Int32Array(4);
      let _ = null, g = null;
      const p = [], v = [];
      this.domElement = e, this.debug = {
        checkShaderErrors: true,
        onShaderError: null
      }, this.autoClear = true, this.autoClearColor = true, this.autoClearDepth = true, this.autoClearStencil = true, this.sortObjects = true, this.clippingPlanes = [], this.localClippingEnabled = false, this._outputColorSpace = un, this._useLegacyLights = false, this.toneMapping = Xn, this.toneMappingExposure = 1;
      const x = this;
      let S = false, P = 0, b = 0, T = null, E = -1, M = null;
      const y = new ie(), C = new ie();
      let N = null;
      const I = new xt(0);
      let U = 0, D = e.width, O = e.height, H = 1, z = null, F = null;
      const Y = new ie(0, 0, D, O), nt = new ie(0, 0, D, O);
      let dt = false;
      const Et = new Jr();
      let q = false, at = false;
      const _t = new Dt(), J = new R(), wt = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: true
      };
      function Pt() {
        return T === null ? H : 1;
      }
      let B = n;
      function Ot(A, V) {
        return e.getContext(A, V);
      }
      try {
        const A = {
          alpha: true,
          depth: i,
          stencil: s,
          antialias: a,
          premultipliedAlpha: l,
          preserveDrawingBuffer: c,
          powerPreference: h,
          failIfMajorPerformanceCaveat: d
        };
        if ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${xa}`), e.addEventListener("webglcontextlost", k, false), e.addEventListener("webglcontextrestored", rt, false), e.addEventListener("webglcontextcreationerror", Q, false), B === null) {
          const V = "webgl2";
          if (B = Ot(V, A), B === null) throw Ot(V) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
        }
      } catch (A) {
        throw console.error("THREE.WebGLRenderer: " + A.message), A;
      }
      let Z, j, K, lt, it, vt, It, L, w, G, tt, ot, st, Lt, pt, ft, Vt, ct, Rt, Zt, Ut, St, Xt, Jt;
      function pe() {
        Z = new Ox(B), Z.init(), St = new qf(B, Z), j = new Px(B, Z, t, St), K = new py(B), lt = new Bx(B), it = new ny(), vt = new my(B, Z, K, it, j, St, lt), It = new Lx(x), L = new Nx(x), w = new Yg(B), Xt = new Cx(B, w), G = new zx(B, w, lt, Xt), tt = new Vx(B, G, w, lt), Rt = new kx(B, j, vt), ft = new Ix(it), ot = new ey(x, It, L, Z, j, Xt, ft), st = new Sy(x, it), Lt = new sy(), pt = new hy(Z), ct = new Ex(x, It, L, K, tt, u, l), Vt = new fy(x, tt, j), Jt = new by(B, lt, j, K), Zt = new Rx(B, Z, lt), Ut = new Fx(B, Z, lt), lt.programs = ot.programs, x.capabilities = j, x.extensions = Z, x.properties = it, x.renderLists = Lt, x.shadowMap = Vt, x.state = K, x.info = lt;
      }
      pe();
      const Yt = new yy(x, B);
      this.xr = Yt, this.getContext = function() {
        return B;
      }, this.getContextAttributes = function() {
        return B.getContextAttributes();
      }, this.forceContextLoss = function() {
        const A = Z.get("WEBGL_lose_context");
        A && A.loseContext();
      }, this.forceContextRestore = function() {
        const A = Z.get("WEBGL_lose_context");
        A && A.restoreContext();
      }, this.getPixelRatio = function() {
        return H;
      }, this.setPixelRatio = function(A) {
        A !== void 0 && (H = A, this.setSize(D, O, false));
      }, this.getSize = function(A) {
        return A.set(D, O);
      }, this.setSize = function(A, V, $ = true) {
        if (Yt.isPresenting) {
          console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
          return;
        }
        D = A, O = V, e.width = Math.floor(A * H), e.height = Math.floor(V * H), $ === true && (e.style.width = A + "px", e.style.height = V + "px"), this.setViewport(0, 0, A, V);
      }, this.getDrawingBufferSize = function(A) {
        return A.set(D * H, O * H).floor();
      }, this.setDrawingBufferSize = function(A, V, $) {
        D = A, O = V, H = $, e.width = Math.floor(A * $), e.height = Math.floor(V * $), this.setViewport(0, 0, A, V);
      }, this.getCurrentViewport = function(A) {
        return A.copy(y);
      }, this.getViewport = function(A) {
        return A.copy(Y);
      }, this.setViewport = function(A, V, $, W) {
        A.isVector4 ? Y.set(A.x, A.y, A.z, A.w) : Y.set(A, V, $, W), K.viewport(y.copy(Y).multiplyScalar(H).round());
      }, this.getScissor = function(A) {
        return A.copy(nt);
      }, this.setScissor = function(A, V, $, W) {
        A.isVector4 ? nt.set(A.x, A.y, A.z, A.w) : nt.set(A, V, $, W), K.scissor(C.copy(nt).multiplyScalar(H).round());
      }, this.getScissorTest = function() {
        return dt;
      }, this.setScissorTest = function(A) {
        K.setScissorTest(dt = A);
      }, this.setOpaqueSort = function(A) {
        z = A;
      }, this.setTransparentSort = function(A) {
        F = A;
      }, this.getClearColor = function(A) {
        return A.copy(ct.getClearColor());
      }, this.setClearColor = function() {
        ct.setClearColor.apply(ct, arguments);
      }, this.getClearAlpha = function() {
        return ct.getClearAlpha();
      }, this.setClearAlpha = function() {
        ct.setClearAlpha.apply(ct, arguments);
      }, this.clear = function(A = true, V = true, $ = true) {
        let W = 0;
        if (A) {
          let X = false;
          if (T !== null) {
            const gt = T.texture.format;
            X = gt === Hc || gt === Vc || gt === kc;
          }
          if (X) {
            const gt = T.texture.type, Tt = gt === Kn || gt === $i || gt === Nc || gt === Hs || gt === zc || gt === Fc, Ct = ct.getClearColor(), Nt = ct.getClearAlpha(), zt = Ct.r, Gt = Ct.g, $t = Ct.b;
            Tt ? (f[0] = zt, f[1] = Gt, f[2] = $t, f[3] = Nt, B.clearBufferuiv(B.COLOR, 0, f)) : (m[0] = zt, m[1] = Gt, m[2] = $t, m[3] = Nt, B.clearBufferiv(B.COLOR, 0, m));
          } else W |= B.COLOR_BUFFER_BIT;
        }
        V && (W |= B.DEPTH_BUFFER_BIT), $ && (W |= B.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), B.clear(W);
      }, this.clearColor = function() {
        this.clear(true, false, false);
      }, this.clearDepth = function() {
        this.clear(false, true, false);
      }, this.clearStencil = function() {
        this.clear(false, false, true);
      }, this.dispose = function() {
        e.removeEventListener("webglcontextlost", k, false), e.removeEventListener("webglcontextrestored", rt, false), e.removeEventListener("webglcontextcreationerror", Q, false), Lt.dispose(), pt.dispose(), it.dispose(), It.dispose(), L.dispose(), tt.dispose(), Xt.dispose(), Jt.dispose(), ot.dispose(), Yt.dispose(), Yt.removeEventListener("sessionstart", ee), Yt.removeEventListener("sessionend", Tn), Oe.stop();
      };
      function k(A) {
        A.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), S = true;
      }
      function rt() {
        console.log("THREE.WebGLRenderer: Context Restored."), S = false;
        const A = lt.autoReset, V = Vt.enabled, $ = Vt.autoUpdate, W = Vt.needsUpdate, X = Vt.type;
        pe(), lt.autoReset = A, Vt.enabled = V, Vt.autoUpdate = $, Vt.needsUpdate = W, Vt.type = X;
      }
      function Q(A) {
        console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", A.statusMessage);
      }
      function mt(A) {
        const V = A.target;
        V.removeEventListener("dispose", mt), Mt(V);
      }
      function Mt(A) {
        Qt(A), it.remove(A);
      }
      function Qt(A) {
        const V = it.get(A).programs;
        V !== void 0 && (V.forEach(function($) {
          ot.releaseProgram($);
        }), A.isShaderMaterial && ot.releaseShaderCache(A));
      }
      this.renderBufferDirect = function(A, V, $, W, X, gt) {
        V === null && (V = wt);
        const Tt = X.isMesh && X.matrixWorld.determinant() < 0, Ct = am(A, V, $, W, X);
        K.setMaterial(W, Tt);
        let Nt = $.index, zt = 1;
        if (W.wireframe === true) {
          if (Nt = G.getWireframeAttribute($), Nt === void 0) return;
          zt = 2;
        }
        const Gt = $.drawRange, $t = $.attributes.position;
        let ge = Gt.start * zt, Ce = (Gt.start + Gt.count) * zt;
        gt !== null && (ge = Math.max(ge, gt.start * zt), Ce = Math.min(Ce, (gt.start + gt.count) * zt)), Nt !== null ? (ge = Math.max(ge, 0), Ce = Math.min(Ce, Nt.count)) : $t != null && (ge = Math.max(ge, 0), Ce = Math.min(Ce, $t.count));
        const Ze = Ce - ge;
        if (Ze < 0 || Ze === 1 / 0) return;
        Xt.setup(X, W, Ct, $, Nt);
        let Un, te = Zt;
        if (Nt !== null && (Un = w.get(Nt), te = Ut, te.setIndex(Un)), X.isMesh) W.wireframe === true ? (K.setLineWidth(W.wireframeLinewidth * Pt()), te.setMode(B.LINES)) : te.setMode(B.TRIANGLES);
        else if (X.isLine) {
          let Ft = W.linewidth;
          Ft === void 0 && (Ft = 1), K.setLineWidth(Ft * Pt()), X.isLineSegments ? te.setMode(B.LINES) : X.isLineLoop ? te.setMode(B.LINE_LOOP) : te.setMode(B.LINE_STRIP);
        } else X.isPoints ? te.setMode(B.POINTS) : X.isSprite && te.setMode(B.TRIANGLES);
        if (X.isBatchedMesh) X._multiDrawInstances !== null ? te.renderMultiDrawInstances(X._multiDrawStarts, X._multiDrawCounts, X._multiDrawCount, X._multiDrawInstances) : te.renderMultiDraw(X._multiDrawStarts, X._multiDrawCounts, X._multiDrawCount);
        else if (X.isInstancedMesh) te.renderInstances(ge, Ze, X.count);
        else if ($.isInstancedBufferGeometry) {
          const Ft = $._maxInstanceCount !== void 0 ? $._maxInstanceCount : 1 / 0, Js = Math.min($.instanceCount, Ft);
          te.renderInstances(ge, Ze, Js);
        } else te.render(ge, Ze);
      };
      function oe(A, V, $) {
        A.transparent === true && A.side === Xe && A.forceSinglePass === false ? (A.side = Ve, A.needsUpdate = true, ro(A, V, $), A.side = Zn, A.needsUpdate = true, ro(A, V, $), A.side = Xe) : ro(A, V, $);
      }
      this.compile = function(A, V, $ = null) {
        $ === null && ($ = A), g = pt.get($), g.init(V), v.push(g), $.traverseVisible(function(X) {
          X.isLight && X.layers.test(V.layers) && (g.pushLight(X), X.castShadow && g.pushShadow(X));
        }), A !== $ && A.traverseVisible(function(X) {
          X.isLight && X.layers.test(V.layers) && (g.pushLight(X), X.castShadow && g.pushShadow(X));
        }), g.setupLights(x._useLegacyLights);
        const W = /* @__PURE__ */ new Set();
        return A.traverse(function(X) {
          const gt = X.material;
          if (gt) if (Array.isArray(gt)) for (let Tt = 0; Tt < gt.length; Tt++) {
            const Ct = gt[Tt];
            oe(Ct, $, X), W.add(Ct);
          }
          else oe(gt, $, X), W.add(gt);
        }), v.pop(), g = null, W;
      }, this.compileAsync = function(A, V, $ = null) {
        const W = this.compile(A, V, $);
        return new Promise((X) => {
          function gt() {
            if (W.forEach(function(Tt) {
              it.get(Tt).currentProgram.isReady() && W.delete(Tt);
            }), W.size === 0) {
              X(A);
              return;
            }
            setTimeout(gt, 10);
          }
          Z.get("KHR_parallel_shader_compile") !== null ? gt() : setTimeout(gt, 10);
        });
      };
      let he = null;
      function Ee(A) {
        he && he(A);
      }
      function ee() {
        Oe.stop();
      }
      function Tn() {
        Oe.start();
      }
      const Oe = new Vf();
      Oe.setAnimationLoop(Ee), typeof self < "u" && Oe.setContext(self), this.setAnimationLoop = function(A) {
        he = A, Yt.setAnimationLoop(A), A === null ? Oe.stop() : Oe.start();
      }, Yt.addEventListener("sessionstart", ee), Yt.addEventListener("sessionend", Tn), this.render = function(A, V) {
        if (V !== void 0 && V.isCamera !== true) {
          console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
          return;
        }
        if (S === true) return;
        A.matrixWorldAutoUpdate === true && A.updateMatrixWorld(), V.parent === null && V.matrixWorldAutoUpdate === true && V.updateMatrixWorld(), Yt.enabled === true && Yt.isPresenting === true && (Yt.cameraAutoUpdate === true && Yt.updateCamera(V), V = Yt.getCamera()), A.isScene === true && A.onBeforeRender(x, A, V, T), g = pt.get(A, v.length), g.init(V), v.push(g), _t.multiplyMatrices(V.projectionMatrix, V.matrixWorldInverse), Et.setFromProjectionMatrix(_t), at = this.localClippingEnabled, q = ft.init(this.clippingPlanes, at), _ = Lt.get(A, p.length), _.init(), p.push(_), Ah(A, V, 0, x.sortObjects), _.finish(), x.sortObjects === true && _.sort(z, F);
        const $ = Yt.enabled === false || Yt.isPresenting === false || Yt.hasDepthSensing() === false;
        $ && ct.addToRenderList(_, A), this.info.render.frame++, q === true && ft.beginShadows();
        const W = g.state.shadowsArray;
        Vt.render(W, A, V), q === true && ft.endShadows(), this.info.autoReset === true && this.info.reset();
        const X = _.opaque, gt = _.transmissive;
        if (g.setupLights(x._useLegacyLights), V.isArrayCamera) {
          const Tt = V.cameras;
          if (gt.length > 0) for (let Ct = 0, Nt = Tt.length; Ct < Nt; Ct++) {
            const zt = Tt[Ct];
            Ch(X, gt, A, zt);
          }
          $ && ct.render(A);
          for (let Ct = 0, Nt = Tt.length; Ct < Nt; Ct++) {
            const zt = Tt[Ct];
            Eh(_, A, zt, zt.viewport);
          }
        } else gt.length > 0 && Ch(X, gt, A, V), $ && ct.render(A), Eh(_, A, V);
        T !== null && (vt.updateMultisampleRenderTarget(T), vt.updateRenderTargetMipmap(T)), A.isScene === true && A.onAfterRender(x, A, V), Xt.resetDefaultState(), E = -1, M = null, v.pop(), v.length > 0 ? (g = v[v.length - 1], q === true && ft.setGlobalState(x.clippingPlanes, g.state.camera)) : g = null, p.pop(), p.length > 0 ? _ = p[p.length - 1] : _ = null;
      };
      function Ah(A, V, $, W) {
        if (A.visible === false) return;
        if (A.layers.test(V.layers)) {
          if (A.isGroup) $ = A.renderOrder;
          else if (A.isLOD) A.autoUpdate === true && A.update(V);
          else if (A.isLight) g.pushLight(A), A.castShadow && g.pushShadow(A);
          else if (A.isSprite) {
            if (!A.frustumCulled || Et.intersectsSprite(A)) {
              W && J.setFromMatrixPosition(A.matrixWorld).applyMatrix4(_t);
              const Tt = tt.update(A), Ct = A.material;
              Ct.visible && _.push(A, Tt, Ct, $, J.z, null);
            }
          } else if ((A.isMesh || A.isLine || A.isPoints) && (!A.frustumCulled || Et.intersectsObject(A))) {
            const Tt = tt.update(A), Ct = A.material;
            if (W && (A.boundingSphere !== void 0 ? (A.boundingSphere === null && A.computeBoundingSphere(), J.copy(A.boundingSphere.center)) : (Tt.boundingSphere === null && Tt.computeBoundingSphere(), J.copy(Tt.boundingSphere.center)), J.applyMatrix4(A.matrixWorld).applyMatrix4(_t)), Array.isArray(Ct)) {
              const Nt = Tt.groups;
              for (let zt = 0, Gt = Nt.length; zt < Gt; zt++) {
                const $t = Nt[zt], ge = Ct[$t.materialIndex];
                ge && ge.visible && _.push(A, Tt, ge, $, J.z, $t);
              }
            } else Ct.visible && _.push(A, Tt, Ct, $, J.z, null);
          }
        }
        const gt = A.children;
        for (let Tt = 0, Ct = gt.length; Tt < Ct; Tt++) Ah(gt[Tt], V, $, W);
      }
      function Eh(A, V, $, W) {
        const X = A.opaque, gt = A.transmissive, Tt = A.transparent;
        g.setupLightsView($), q === true && ft.setGlobalState(x.clippingPlanes, $), W && K.viewport(y.copy(W)), X.length > 0 && so(X, V, $), gt.length > 0 && so(gt, V, $), Tt.length > 0 && so(Tt, V, $), K.buffers.depth.setTest(true), K.buffers.depth.setMask(true), K.buffers.color.setMask(true), K.setPolygonOffset(false);
      }
      function Ch(A, V, $, W) {
        if (($.isScene === true ? $.overrideMaterial : null) !== null) return;
        g.state.transmissionRenderTarget[W.id] === void 0 && (g.state.transmissionRenderTarget[W.id] = new Mn(1, 1, {
          generateMipmaps: true,
          type: Z.has("EXT_color_buffer_half_float") || Z.has("EXT_color_buffer_float") ? qr : Kn,
          minFilter: Cn,
          samples: 4,
          stencilBuffer: s,
          resolveDepthBuffer: false,
          resolveStencilBuffer: false
        }));
        const gt = g.state.transmissionRenderTarget[W.id], Tt = W.viewport || y;
        gt.setSize(Tt.z, Tt.w);
        const Ct = x.getRenderTarget();
        x.setRenderTarget(gt), x.getClearColor(I), U = x.getClearAlpha(), U < 1 && x.setClearColor(16777215, 0.5), x.clear();
        const Nt = x.toneMapping;
        x.toneMapping = Xn;
        const zt = W.viewport;
        if (W.viewport !== void 0 && (W.viewport = void 0), g.setupLightsView(W), q === true && ft.setGlobalState(x.clippingPlanes, W), so(A, $, W), vt.updateMultisampleRenderTarget(gt), vt.updateRenderTargetMipmap(gt), Z.has("WEBGL_multisampled_render_to_texture") === false) {
          let Gt = false;
          for (let $t = 0, ge = V.length; $t < ge; $t++) {
            const Ce = V[$t], Ze = Ce.object, Un = Ce.geometry, te = Ce.material, Ft = Ce.group;
            if (te.side === Xe && Ze.layers.test(W.layers)) {
              const Js = te.side;
              te.side = Ve, te.needsUpdate = true, Rh(Ze, $, W, Un, te, Ft), te.side = Js, te.needsUpdate = true, Gt = true;
            }
          }
          Gt === true && (vt.updateMultisampleRenderTarget(gt), vt.updateRenderTargetMipmap(gt));
        }
        x.setRenderTarget(Ct), x.setClearColor(I, U), zt !== void 0 && (W.viewport = zt), x.toneMapping = Nt;
      }
      function so(A, V, $) {
        const W = V.isScene === true ? V.overrideMaterial : null;
        for (let X = 0, gt = A.length; X < gt; X++) {
          const Tt = A[X], Ct = Tt.object, Nt = Tt.geometry, zt = W === null ? Tt.material : W, Gt = Tt.group;
          Ct.layers.test($.layers) && Rh(Ct, V, $, Nt, zt, Gt);
        }
      }
      function Rh(A, V, $, W, X, gt) {
        A.onBeforeRender(x, V, $, W, X, gt), A.modelViewMatrix.multiplyMatrices($.matrixWorldInverse, A.matrixWorld), A.normalMatrix.getNormalMatrix(A.modelViewMatrix), X.onBeforeRender(x, V, $, W, A, gt), X.transparent === true && X.side === Xe && X.forceSinglePass === false ? (X.side = Ve, X.needsUpdate = true, x.renderBufferDirect($, V, W, X, A, gt), X.side = Zn, X.needsUpdate = true, x.renderBufferDirect($, V, W, X, A, gt), X.side = Xe) : x.renderBufferDirect($, V, W, X, A, gt), A.onAfterRender(x, V, $, W, X, gt);
      }
      function ro(A, V, $) {
        V.isScene !== true && (V = wt);
        const W = it.get(A), X = g.state.lights, gt = g.state.shadowsArray, Tt = X.state.version, Ct = ot.getParameters(A, X.state, gt, V, $), Nt = ot.getProgramCacheKey(Ct);
        let zt = W.programs;
        W.environment = A.isMeshStandardMaterial ? V.environment : null, W.fog = V.fog, W.envMap = (A.isMeshStandardMaterial ? L : It).get(A.envMap || W.environment), W.envMapRotation = W.environment !== null && A.envMap === null ? V.environmentRotation : A.envMapRotation, zt === void 0 && (A.addEventListener("dispose", mt), zt = /* @__PURE__ */ new Map(), W.programs = zt);
        let Gt = zt.get(Nt);
        if (Gt !== void 0) {
          if (W.currentProgram === Gt && W.lightsStateVersion === Tt) return Ih(A, Ct), Gt;
        } else Ct.uniforms = ot.getUniforms(A), A.onBuild($, Ct, x), A.onBeforeCompile(Ct, x), Gt = ot.acquireProgram(Ct, Nt), zt.set(Nt, Gt), W.uniforms = Ct.uniforms;
        const $t = W.uniforms;
        return (!A.isShaderMaterial && !A.isRawShaderMaterial || A.clipping === true) && ($t.clippingPlanes = ft.uniform), Ih(A, Ct), W.needsLights = cm(A), W.lightsStateVersion = Tt, W.needsLights && ($t.ambientLightColor.value = X.state.ambient, $t.lightProbe.value = X.state.probe, $t.directionalLights.value = X.state.directional, $t.directionalLightShadows.value = X.state.directionalShadow, $t.spotLights.value = X.state.spot, $t.spotLightShadows.value = X.state.spotShadow, $t.rectAreaLights.value = X.state.rectArea, $t.ltc_1.value = X.state.rectAreaLTC1, $t.ltc_2.value = X.state.rectAreaLTC2, $t.pointLights.value = X.state.point, $t.pointLightShadows.value = X.state.pointShadow, $t.hemisphereLights.value = X.state.hemi, $t.directionalShadowMap.value = X.state.directionalShadowMap, $t.directionalShadowMatrix.value = X.state.directionalShadowMatrix, $t.spotShadowMap.value = X.state.spotShadowMap, $t.spotLightMatrix.value = X.state.spotLightMatrix, $t.spotLightMap.value = X.state.spotLightMap, $t.pointShadowMap.value = X.state.pointShadowMap, $t.pointShadowMatrix.value = X.state.pointShadowMatrix), W.currentProgram = Gt, W.uniformsList = null, Gt;
      }
      function Ph(A) {
        if (A.uniformsList === null) {
          const V = A.currentProgram.getUniforms();
          A.uniformsList = oa.seqWithValue(V.seq, A.uniforms);
        }
        return A.uniformsList;
      }
      function Ih(A, V) {
        const $ = it.get(A);
        $.outputColorSpace = V.outputColorSpace, $.batching = V.batching, $.instancing = V.instancing, $.instancingColor = V.instancingColor, $.instancingMorph = V.instancingMorph, $.skinning = V.skinning, $.morphTargets = V.morphTargets, $.morphNormals = V.morphNormals, $.morphColors = V.morphColors, $.morphTargetsCount = V.morphTargetsCount, $.numClippingPlanes = V.numClippingPlanes, $.numIntersection = V.numClipIntersection, $.vertexAlphas = V.vertexAlphas, $.vertexTangents = V.vertexTangents, $.toneMapping = V.toneMapping;
      }
      function am(A, V, $, W, X) {
        V.isScene !== true && (V = wt), vt.resetTextureUnits();
        const gt = V.fog, Tt = W.isMeshStandardMaterial ? V.environment : null, Ct = T === null ? x.outputColorSpace : T.isXRRenderTarget === true ? T.texture.colorSpace : ti, Nt = (W.isMeshStandardMaterial ? L : It).get(W.envMap || Tt), zt = W.vertexColors === true && !!$.attributes.color && $.attributes.color.itemSize === 4, Gt = !!$.attributes.tangent && (!!W.normalMap || W.anisotropy > 0), $t = !!$.morphAttributes.position, ge = !!$.morphAttributes.normal, Ce = !!$.morphAttributes.color;
        let Ze = Xn;
        W.toneMapped && (T === null || T.isXRRenderTarget === true) && (Ze = x.toneMapping);
        const Un = $.morphAttributes.position || $.morphAttributes.normal || $.morphAttributes.color, te = Un !== void 0 ? Un.length : 0, Ft = it.get(W), Js = g.state.lights;
        if (q === true && (at === true || A !== M)) {
          const on = A === M && W.id === E;
          ft.setState(W, A, on);
        }
        let le = false;
        W.version === Ft.__version ? (Ft.needsLights && Ft.lightsStateVersion !== Js.state.version || Ft.outputColorSpace !== Ct || X.isBatchedMesh && Ft.batching === false || !X.isBatchedMesh && Ft.batching === true || X.isInstancedMesh && Ft.instancing === false || !X.isInstancedMesh && Ft.instancing === true || X.isSkinnedMesh && Ft.skinning === false || !X.isSkinnedMesh && Ft.skinning === true || X.isInstancedMesh && Ft.instancingColor === true && X.instanceColor === null || X.isInstancedMesh && Ft.instancingColor === false && X.instanceColor !== null || X.isInstancedMesh && Ft.instancingMorph === true && X.morphTexture === null || X.isInstancedMesh && Ft.instancingMorph === false && X.morphTexture !== null || Ft.envMap !== Nt || W.fog === true && Ft.fog !== gt || Ft.numClippingPlanes !== void 0 && (Ft.numClippingPlanes !== ft.numPlanes || Ft.numIntersection !== ft.numIntersection) || Ft.vertexAlphas !== zt || Ft.vertexTangents !== Gt || Ft.morphTargets !== $t || Ft.morphNormals !== ge || Ft.morphColors !== Ce || Ft.toneMapping !== Ze || Ft.morphTargetsCount !== te) && (le = true) : (le = true, Ft.__version = W.version);
        let bi = Ft.currentProgram;
        le === true && (bi = ro(W, V, X));
        let Lh = false, Ks = false, Za = false;
        const Re = bi.getUniforms(), ii = Ft.uniforms;
        if (K.useProgram(bi.program) && (Lh = true, Ks = true, Za = true), W.id !== E && (E = W.id, Ks = true), Lh || M !== A) {
          Re.setValue(B, "projectionMatrix", A.projectionMatrix), Re.setValue(B, "viewMatrix", A.matrixWorldInverse);
          const on = Re.map.cameraPosition;
          on !== void 0 && on.setValue(B, J.setFromMatrixPosition(A.matrixWorld)), j.logarithmicDepthBuffer && Re.setValue(B, "logDepthBufFC", 2 / (Math.log(A.far + 1) / Math.LN2)), (W.isMeshPhongMaterial || W.isMeshToonMaterial || W.isMeshLambertMaterial || W.isMeshBasicMaterial || W.isMeshStandardMaterial || W.isShaderMaterial) && Re.setValue(B, "isOrthographic", A.isOrthographicCamera === true), M !== A && (M = A, Ks = true, Za = true);
        }
        if (X.isSkinnedMesh) {
          Re.setOptional(B, X, "bindMatrix"), Re.setOptional(B, X, "bindMatrixInverse");
          const on = X.skeleton;
          on && (on.boneTexture === null && on.computeBoneTexture(), Re.setValue(B, "boneTexture", on.boneTexture, vt));
        }
        X.isBatchedMesh && (Re.setOptional(B, X, "batchingTexture"), Re.setValue(B, "batchingTexture", X._matricesTexture, vt));
        const Ja = $.morphAttributes;
        if ((Ja.position !== void 0 || Ja.normal !== void 0 || Ja.color !== void 0) && Rt.update(X, $, bi), (Ks || Ft.receiveShadow !== X.receiveShadow) && (Ft.receiveShadow = X.receiveShadow, Re.setValue(B, "receiveShadow", X.receiveShadow)), W.isMeshGouraudMaterial && W.envMap !== null && (ii.envMap.value = Nt, ii.flipEnvMap.value = Nt.isCubeTexture && Nt.isRenderTargetTexture === false ? -1 : 1), W.isMeshStandardMaterial && W.envMap === null && V.environment !== null && (ii.envMapIntensity.value = V.environmentIntensity), Ks && (Re.setValue(B, "toneMappingExposure", x.toneMappingExposure), Ft.needsLights && lm(ii, Za), gt && W.fog === true && st.refreshFogUniforms(ii, gt), st.refreshMaterialUniforms(ii, W, H, O, g.state.transmissionRenderTarget[A.id]), oa.upload(B, Ph(Ft), ii, vt)), W.isShaderMaterial && W.uniformsNeedUpdate === true && (oa.upload(B, Ph(Ft), ii, vt), W.uniformsNeedUpdate = false), W.isSpriteMaterial && Re.setValue(B, "center", X.center), Re.setValue(B, "modelViewMatrix", X.modelViewMatrix), Re.setValue(B, "normalMatrix", X.normalMatrix), Re.setValue(B, "modelMatrix", X.matrixWorld), W.isShaderMaterial || W.isRawShaderMaterial) {
          const on = W.uniformsGroups;
          for (let Ka = 0, hm = on.length; Ka < hm; Ka++) {
            const Dh = on[Ka];
            Jt.update(Dh, bi), Jt.bind(Dh, bi);
          }
        }
        return bi;
      }
      function lm(A, V) {
        A.ambientLightColor.needsUpdate = V, A.lightProbe.needsUpdate = V, A.directionalLights.needsUpdate = V, A.directionalLightShadows.needsUpdate = V, A.pointLights.needsUpdate = V, A.pointLightShadows.needsUpdate = V, A.spotLights.needsUpdate = V, A.spotLightShadows.needsUpdate = V, A.rectAreaLights.needsUpdate = V, A.hemisphereLights.needsUpdate = V;
      }
      function cm(A) {
        return A.isMeshLambertMaterial || A.isMeshToonMaterial || A.isMeshPhongMaterial || A.isMeshStandardMaterial || A.isShadowMaterial || A.isShaderMaterial && A.lights === true;
      }
      this.getActiveCubeFace = function() {
        return P;
      }, this.getActiveMipmapLevel = function() {
        return b;
      }, this.getRenderTarget = function() {
        return T;
      }, this.setRenderTargetTextures = function(A, V, $) {
        it.get(A.texture).__webglTexture = V, it.get(A.depthTexture).__webglTexture = $;
        const W = it.get(A);
        W.__hasExternalTextures = true, W.__autoAllocateDepthBuffer = $ === void 0, W.__autoAllocateDepthBuffer || Z.has("WEBGL_multisampled_render_to_texture") === true && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), W.__useRenderToTexture = false);
      }, this.setRenderTargetFramebuffer = function(A, V) {
        const $ = it.get(A);
        $.__webglFramebuffer = V, $.__useDefaultFramebuffer = V === void 0;
      }, this.setRenderTarget = function(A, V = 0, $ = 0) {
        T = A, P = V, b = $;
        let W = true, X = null, gt = false, Tt = false;
        if (A) {
          const Nt = it.get(A);
          Nt.__useDefaultFramebuffer !== void 0 ? (K.bindFramebuffer(B.FRAMEBUFFER, null), W = false) : Nt.__webglFramebuffer === void 0 ? vt.setupRenderTarget(A) : Nt.__hasExternalTextures && vt.rebindTextures(A, it.get(A.texture).__webglTexture, it.get(A.depthTexture).__webglTexture);
          const zt = A.texture;
          (zt.isData3DTexture || zt.isDataArrayTexture || zt.isCompressedArrayTexture) && (Tt = true);
          const Gt = it.get(A).__webglFramebuffer;
          A.isWebGLCubeRenderTarget ? (Array.isArray(Gt[V]) ? X = Gt[V][$] : X = Gt[V], gt = true) : A.samples > 0 && vt.useMultisampledRTT(A) === false ? X = it.get(A).__webglMultisampledFramebuffer : Array.isArray(Gt) ? X = Gt[$] : X = Gt, y.copy(A.viewport), C.copy(A.scissor), N = A.scissorTest;
        } else y.copy(Y).multiplyScalar(H).floor(), C.copy(nt).multiplyScalar(H).floor(), N = dt;
        if (K.bindFramebuffer(B.FRAMEBUFFER, X) && W && K.drawBuffers(A, X), K.viewport(y), K.scissor(C), K.setScissorTest(N), gt) {
          const Nt = it.get(A.texture);
          B.framebufferTexture2D(B.FRAMEBUFFER, B.COLOR_ATTACHMENT0, B.TEXTURE_CUBE_MAP_POSITIVE_X + V, Nt.__webglTexture, $);
        } else if (Tt) {
          const Nt = it.get(A.texture), zt = V || 0;
          B.framebufferTextureLayer(B.FRAMEBUFFER, B.COLOR_ATTACHMENT0, Nt.__webglTexture, $ || 0, zt);
        }
        E = -1;
      }, this.readRenderTargetPixels = function(A, V, $, W, X, gt, Tt) {
        if (!(A && A.isWebGLRenderTarget)) {
          console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
          return;
        }
        let Ct = it.get(A).__webglFramebuffer;
        if (A.isWebGLCubeRenderTarget && Tt !== void 0 && (Ct = Ct[Tt]), Ct) {
          K.bindFramebuffer(B.FRAMEBUFFER, Ct);
          try {
            const Nt = A.texture, zt = Nt.format, Gt = Nt.type;
            if (!j.textureFormatReadable(zt)) {
              console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
              return;
            }
            if (!j.textureTypeReadable(Gt)) {
              console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
              return;
            }
            V >= 0 && V <= A.width - W && $ >= 0 && $ <= A.height - X && B.readPixels(V, $, W, X, St.convert(zt), St.convert(Gt), gt);
          } finally {
            const Nt = T !== null ? it.get(T).__webglFramebuffer : null;
            K.bindFramebuffer(B.FRAMEBUFFER, Nt);
          }
        }
      }, this.copyFramebufferToTexture = function(A, V, $ = 0) {
        const W = Math.pow(2, -$), X = Math.floor(V.image.width * W), gt = Math.floor(V.image.height * W);
        vt.setTexture2D(V, 0), B.copyTexSubImage2D(B.TEXTURE_2D, $, 0, 0, A.x, A.y, X, gt), K.unbindTexture();
      }, this.copyTextureToTexture = function(A, V, $, W = 0) {
        const X = V.image.width, gt = V.image.height, Tt = St.convert($.format), Ct = St.convert($.type);
        vt.setTexture2D($, 0), B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL, $.flipY), B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL, $.premultiplyAlpha), B.pixelStorei(B.UNPACK_ALIGNMENT, $.unpackAlignment), V.isDataTexture ? B.texSubImage2D(B.TEXTURE_2D, W, A.x, A.y, X, gt, Tt, Ct, V.image.data) : V.isCompressedTexture ? B.compressedTexSubImage2D(B.TEXTURE_2D, W, A.x, A.y, V.mipmaps[0].width, V.mipmaps[0].height, Tt, V.mipmaps[0].data) : B.texSubImage2D(B.TEXTURE_2D, W, A.x, A.y, Tt, Ct, V.image), W === 0 && $.generateMipmaps && B.generateMipmap(B.TEXTURE_2D), K.unbindTexture();
      }, this.copyTextureToTexture3D = function(A, V, $, W, X = 0) {
        const gt = A.max.x - A.min.x, Tt = A.max.y - A.min.y, Ct = A.max.z - A.min.z, Nt = St.convert(W.format), zt = St.convert(W.type);
        let Gt;
        if (W.isData3DTexture) vt.setTexture3D(W, 0), Gt = B.TEXTURE_3D;
        else if (W.isDataArrayTexture || W.isCompressedArrayTexture) vt.setTexture2DArray(W, 0), Gt = B.TEXTURE_2D_ARRAY;
        else {
          console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
          return;
        }
        B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL, W.flipY), B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL, W.premultiplyAlpha), B.pixelStorei(B.UNPACK_ALIGNMENT, W.unpackAlignment);
        const $t = B.getParameter(B.UNPACK_ROW_LENGTH), ge = B.getParameter(B.UNPACK_IMAGE_HEIGHT), Ce = B.getParameter(B.UNPACK_SKIP_PIXELS), Ze = B.getParameter(B.UNPACK_SKIP_ROWS), Un = B.getParameter(B.UNPACK_SKIP_IMAGES), te = $.isCompressedTexture ? $.mipmaps[X] : $.image;
        B.pixelStorei(B.UNPACK_ROW_LENGTH, te.width), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, te.height), B.pixelStorei(B.UNPACK_SKIP_PIXELS, A.min.x), B.pixelStorei(B.UNPACK_SKIP_ROWS, A.min.y), B.pixelStorei(B.UNPACK_SKIP_IMAGES, A.min.z), $.isDataTexture || $.isData3DTexture ? B.texSubImage3D(Gt, X, V.x, V.y, V.z, gt, Tt, Ct, Nt, zt, te.data) : W.isCompressedArrayTexture ? B.compressedTexSubImage3D(Gt, X, V.x, V.y, V.z, gt, Tt, Ct, Nt, te.data) : B.texSubImage3D(Gt, X, V.x, V.y, V.z, gt, Tt, Ct, Nt, zt, te), B.pixelStorei(B.UNPACK_ROW_LENGTH, $t), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, ge), B.pixelStorei(B.UNPACK_SKIP_PIXELS, Ce), B.pixelStorei(B.UNPACK_SKIP_ROWS, Ze), B.pixelStorei(B.UNPACK_SKIP_IMAGES, Un), X === 0 && W.generateMipmaps && B.generateMipmap(Gt), K.unbindTexture();
      }, this.initTexture = function(A) {
        A.isCubeTexture ? vt.setTextureCube(A, 0) : A.isData3DTexture ? vt.setTexture3D(A, 0) : A.isDataArrayTexture || A.isCompressedArrayTexture ? vt.setTexture2DArray(A, 0) : vt.setTexture2D(A, 0), K.unbindTexture();
      }, this.resetState = function() {
        P = 0, b = 0, T = null, K.reset(), Xt.reset();
      }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
        detail: this
      }));
    }
    get coordinateSystem() {
      return Rn;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(t) {
      this._outputColorSpace = t;
      const e = this.getContext();
      e.drawingBufferColorSpace = t === Ma ? "display-p3" : "srgb", e.unpackColorSpace = ne.workingColorSpace === $r ? "display-p3" : "srgb";
    }
    get useLegacyLights() {
      return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights;
    }
    set useLegacyLights(t) {
      console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights = t;
    }
  }
  class Ea {
    constructor(t, e = 25e-5) {
      this.isFogExp2 = true, this.name = "", this.color = new xt(t), this.density = e;
    }
    clone() {
      return new Ea(this.color, this.density);
    }
    toJSON() {
      return {
        type: "FogExp2",
        name: this.name,
        color: this.color.getHex(),
        density: this.density
      };
    }
  }
  class Ca {
    constructor(t, e = 1, n = 1e3) {
      this.isFog = true, this.name = "", this.color = new xt(t), this.near = e, this.far = n;
    }
    clone() {
      return new Ca(this.color, this.near, this.far);
    }
    toJSON() {
      return {
        type: "Fog",
        name: this.name,
        color: this.color.getHex(),
        near: this.near,
        far: this.far
      };
    }
  }
  class jc extends jt {
    constructor() {
      super(), this.isScene = true, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new rn(), this.environmentIntensity = 1, this.environmentRotation = new rn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
        detail: this
      }));
    }
    copy(t, e) {
      return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
    }
  }
  class Ra {
    constructor(t, e) {
      this.isInterleavedBuffer = true, this.array = t, this.stride = e, this.count = t !== void 0 ? t.length / e : 0, this.usage = Dr, this._updateRange = {
        offset: 0,
        count: -1
      }, this.updateRanges = [], this.version = 0, this.uuid = sn();
    }
    onUploadCallback() {
    }
    set needsUpdate(t) {
      t === true && this.version++;
    }
    get updateRange() {
      return Df("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."), this._updateRange;
    }
    setUsage(t) {
      return this.usage = t, this;
    }
    addUpdateRange(t, e) {
      this.updateRanges.push({
        start: t,
        count: e
      });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(t) {
      return this.array = new t.array.constructor(t.array), this.count = t.count, this.stride = t.stride, this.usage = t.usage, this;
    }
    copyAt(t, e, n) {
      t *= this.stride, n *= e.stride;
      for (let i = 0, s = this.stride; i < s; i++) this.array[t + i] = e.array[n + i];
      return this;
    }
    set(t, e = 0) {
      return this.array.set(t, e), this;
    }
    clone(t) {
      t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = sn()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
      const e = new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(e, this.stride);
      return n.setUsage(this.usage), n;
    }
    onUpload(t) {
      return this.onUploadCallback = t, this;
    }
    toJSON(t) {
      return t.arrayBuffers === void 0 && (t.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = sn()), t.arrayBuffers[this.array.buffer._uuid] === void 0 && (t.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
        uuid: this.uuid,
        buffer: this.array.buffer._uuid,
        type: this.array.constructor.name,
        stride: this.stride
      };
    }
  }
  const ze = new R();
  class Zi {
    constructor(t, e, n, i = false) {
      this.isInterleavedBufferAttribute = true, this.name = "", this.data = t, this.itemSize = e, this.offset = n, this.normalized = i;
    }
    get count() {
      return this.data.count;
    }
    get array() {
      return this.data.array;
    }
    set needsUpdate(t) {
      this.data.needsUpdate = t;
    }
    applyMatrix4(t) {
      for (let e = 0, n = this.data.count; e < n; e++) ze.fromBufferAttribute(this, e), ze.applyMatrix4(t), this.setXYZ(e, ze.x, ze.y, ze.z);
      return this;
    }
    applyNormalMatrix(t) {
      for (let e = 0, n = this.count; e < n; e++) ze.fromBufferAttribute(this, e), ze.applyNormalMatrix(t), this.setXYZ(e, ze.x, ze.y, ze.z);
      return this;
    }
    transformDirection(t) {
      for (let e = 0, n = this.count; e < n; e++) ze.fromBufferAttribute(this, e), ze.transformDirection(t), this.setXYZ(e, ze.x, ze.y, ze.z);
      return this;
    }
    getComponent(t, e) {
      let n = this.array[t * this.data.stride + this.offset + e];
      return this.normalized && (n = ke(n, this.array)), n;
    }
    setComponent(t, e, n) {
      return this.normalized && (n = kt(n, this.array)), this.data.array[t * this.data.stride + this.offset + e] = n, this;
    }
    setX(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset] = e, this;
    }
    setY(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 1] = e, this;
    }
    setZ(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 2] = e, this;
    }
    setW(t, e) {
      return this.normalized && (e = kt(e, this.array)), this.data.array[t * this.data.stride + this.offset + 3] = e, this;
    }
    getX(t) {
      let e = this.data.array[t * this.data.stride + this.offset];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    getY(t) {
      let e = this.data.array[t * this.data.stride + this.offset + 1];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    getZ(t) {
      let e = this.data.array[t * this.data.stride + this.offset + 2];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    getW(t) {
      let e = this.data.array[t * this.data.stride + this.offset + 3];
      return this.normalized && (e = ke(e, this.array)), e;
    }
    setXY(t, e, n) {
      return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this;
    }
    setXYZ(t, e, n, i) {
      return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = i, this;
    }
    setXYZW(t, e, n, i, s) {
      return t = t * this.data.stride + this.offset, this.normalized && (e = kt(e, this.array), n = kt(n, this.array), i = kt(i, this.array), s = kt(s, this.array)), this.data.array[t + 0] = e, this.data.array[t + 1] = n, this.data.array[t + 2] = i, this.data.array[t + 3] = s, this;
    }
    clone(t) {
      if (t === void 0) {
        console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
        const e = [];
        for (let n = 0; n < this.count; n++) {
          const i = n * this.data.stride + this.offset;
          for (let s = 0; s < this.itemSize; s++) e.push(this.data.array[i + s]);
        }
        return new se(new this.array.constructor(e), this.itemSize, this.normalized);
      } else return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new Zi(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
    }
    toJSON(t) {
      if (t === void 0) {
        console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
        const e = [];
        for (let n = 0; n < this.count; n++) {
          const i = n * this.data.stride + this.offset;
          for (let s = 0; s < this.itemSize; s++) e.push(this.data.array[i + s]);
        }
        return {
          itemSize: this.itemSize,
          type: this.array.constructor.name,
          array: e,
          normalized: this.normalized
        };
      } else return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.toJSON(t)), {
        isInterleavedBufferAttribute: true,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
    }
  }
  class th extends Ne {
    constructor(t) {
      super(), this.isSpriteMaterial = true, this.type = "SpriteMaterial", this.color = new xt(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = true, this.transparent = true, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.rotation = t.rotation, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
    }
  }
  let ys;
  const nr = new R(), Ms = new R(), Ss = new R(), bs = new et(), ir = new et(), Jf = new Dt(), Co = new R(), sr = new R(), Ro = new R(), Mu = new et(), bl = new et(), Su = new et();
  class Kf extends jt {
    constructor(t = new th()) {
      if (super(), this.isSprite = true, this.type = "Sprite", ys === void 0) {
        ys = new Wt();
        const e = new Float32Array([
          -0.5,
          -0.5,
          0,
          0,
          0,
          0.5,
          -0.5,
          0,
          1,
          0,
          0.5,
          0.5,
          0,
          1,
          1,
          -0.5,
          0.5,
          0,
          0,
          1
        ]), n = new Ra(e, 5);
        ys.setIndex([
          0,
          1,
          2,
          0,
          2,
          3
        ]), ys.setAttribute("position", new Zi(n, 3, 0, false)), ys.setAttribute("uv", new Zi(n, 2, 3, false));
      }
      this.geometry = ys, this.material = t, this.center = new et(0.5, 0.5);
    }
    raycast(t, e) {
      t.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Ms.setFromMatrixScale(this.matrixWorld), Jf.copy(t.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse, this.matrixWorld), Ss.setFromMatrixPosition(this.modelViewMatrix), t.camera.isPerspectiveCamera && this.material.sizeAttenuation === false && Ms.multiplyScalar(-Ss.z);
      const n = this.material.rotation;
      let i, s;
      n !== 0 && (s = Math.cos(n), i = Math.sin(n));
      const o = this.center;
      Po(Co.set(-0.5, -0.5, 0), Ss, o, Ms, i, s), Po(sr.set(0.5, -0.5, 0), Ss, o, Ms, i, s), Po(Ro.set(0.5, 0.5, 0), Ss, o, Ms, i, s), Mu.set(0, 0), bl.set(1, 0), Su.set(1, 1);
      let a = t.ray.intersectTriangle(Co, sr, Ro, false, nr);
      if (a === null && (Po(sr.set(-0.5, 0.5, 0), Ss, o, Ms, i, s), bl.set(0, 1), a = t.ray.intersectTriangle(Co, Ro, sr, false, nr), a === null)) return;
      const l = t.ray.origin.distanceTo(nr);
      l < t.near || l > t.far || e.push({
        distance: l,
        point: nr.clone(),
        uv: en.getInterpolation(nr, Co, sr, Ro, Mu, bl, Su, new et()),
        face: null,
        object: this
      });
    }
    copy(t, e) {
      return super.copy(t, e), t.center !== void 0 && this.center.copy(t.center), this.material = t.material, this;
    }
  }
  function Po(r, t, e, n, i, s) {
    bs.subVectors(r, e).addScalar(0.5).multiply(n), i !== void 0 ? (ir.x = s * bs.x - i * bs.y, ir.y = i * bs.x + s * bs.y) : ir.copy(bs), r.copy(t), r.x += ir.x, r.y += ir.y, r.applyMatrix4(Jf);
  }
  const Io = new R(), bu = new R();
  class Qf extends jt {
    constructor() {
      super(), this._currentLevel = 0, this.type = "LOD", Object.defineProperties(this, {
        levels: {
          enumerable: true,
          value: []
        },
        isLOD: {
          value: true
        }
      }), this.autoUpdate = true;
    }
    copy(t) {
      super.copy(t, false);
      const e = t.levels;
      for (let n = 0, i = e.length; n < i; n++) {
        const s = e[n];
        this.addLevel(s.object.clone(), s.distance, s.hysteresis);
      }
      return this.autoUpdate = t.autoUpdate, this;
    }
    addLevel(t, e = 0, n = 0) {
      e = Math.abs(e);
      const i = this.levels;
      let s;
      for (s = 0; s < i.length && !(e < i[s].distance); s++) ;
      return i.splice(s, 0, {
        distance: e,
        hysteresis: n,
        object: t
      }), this.add(t), this;
    }
    getCurrentLevel() {
      return this._currentLevel;
    }
    getObjectForDistance(t) {
      const e = this.levels;
      if (e.length > 0) {
        let n, i;
        for (n = 1, i = e.length; n < i; n++) {
          let s = e[n].distance;
          if (e[n].object.visible && (s -= s * e[n].hysteresis), t < s) break;
        }
        return e[n - 1].object;
      }
      return null;
    }
    raycast(t, e) {
      if (this.levels.length > 0) {
        Io.setFromMatrixPosition(this.matrixWorld);
        const i = t.ray.origin.distanceTo(Io);
        this.getObjectForDistance(i).raycast(t, e);
      }
    }
    update(t) {
      const e = this.levels;
      if (e.length > 1) {
        Io.setFromMatrixPosition(t.matrixWorld), bu.setFromMatrixPosition(this.matrixWorld);
        const n = Io.distanceTo(bu) / t.zoom;
        e[0].object.visible = true;
        let i, s;
        for (i = 1, s = e.length; i < s; i++) {
          let o = e[i].distance;
          if (e[i].object.visible && (o -= o * e[i].hysteresis), n >= o) e[i - 1].object.visible = false, e[i].object.visible = true;
          else break;
        }
        for (this._currentLevel = i - 1; i < s; i++) e[i].object.visible = false;
      }
    }
    toJSON(t) {
      const e = super.toJSON(t);
      this.autoUpdate === false && (e.object.autoUpdate = false), e.object.levels = [];
      const n = this.levels;
      for (let i = 0, s = n.length; i < s; i++) {
        const o = n[i];
        e.object.levels.push({
          object: o.object.uuid,
          distance: o.distance,
          hysteresis: o.hysteresis
        });
      }
      return e;
    }
  }
  const wu = new R(), Tu = new ie(), Au = new ie(), wy = new R(), Eu = new Dt(), Lo = new R(), wl = new Ue(), Cu = new Dt(), Tl = new Gs();
  class jf extends ae {
    constructor(t, e) {
      super(t, e), this.isSkinnedMesh = true, this.type = "SkinnedMesh", this.bindMode = Wl, this.bindMatrix = new Dt(), this.bindMatrixInverse = new Dt(), this.boundingBox = null, this.boundingSphere = null;
    }
    computeBoundingBox() {
      const t = this.geometry;
      this.boundingBox === null && (this.boundingBox = new De()), this.boundingBox.makeEmpty();
      const e = t.getAttribute("position");
      for (let n = 0; n < e.count; n++) this.getVertexPosition(n, Lo), this.boundingBox.expandByPoint(Lo);
    }
    computeBoundingSphere() {
      const t = this.geometry;
      this.boundingSphere === null && (this.boundingSphere = new Ue()), this.boundingSphere.makeEmpty();
      const e = t.getAttribute("position");
      for (let n = 0; n < e.count; n++) this.getVertexPosition(n, Lo), this.boundingSphere.expandByPoint(Lo);
    }
    copy(t, e) {
      return super.copy(t, e), this.bindMode = t.bindMode, this.bindMatrix.copy(t.bindMatrix), this.bindMatrixInverse.copy(t.bindMatrixInverse), this.skeleton = t.skeleton, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
    }
    raycast(t, e) {
      const n = this.material, i = this.matrixWorld;
      n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), wl.copy(this.boundingSphere), wl.applyMatrix4(i), t.ray.intersectsSphere(wl) !== false && (Cu.copy(i).invert(), Tl.copy(t.ray).applyMatrix4(Cu), !(this.boundingBox !== null && Tl.intersectsBox(this.boundingBox) === false) && this._computeIntersections(t, e, Tl)));
    }
    getVertexPosition(t, e) {
      return super.getVertexPosition(t, e), this.applyBoneTransform(t, e), e;
    }
    bind(t, e) {
      this.skeleton = t, e === void 0 && (this.updateMatrixWorld(true), this.skeleton.calculateInverses(), e = this.matrixWorld), this.bindMatrix.copy(e), this.bindMatrixInverse.copy(e).invert();
    }
    pose() {
      this.skeleton.pose();
    }
    normalizeSkinWeights() {
      const t = new ie(), e = this.geometry.attributes.skinWeight;
      for (let n = 0, i = e.count; n < i; n++) {
        t.fromBufferAttribute(e, n);
        const s = 1 / t.manhattanLength();
        s !== 1 / 0 ? t.multiplyScalar(s) : t.set(1, 0, 0, 0), e.setXYZW(n, t.x, t.y, t.z, t.w);
      }
    }
    updateMatrixWorld(t) {
      super.updateMatrixWorld(t), this.bindMode === Wl ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === lf ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : console.warn("THREE.SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
    }
    applyBoneTransform(t, e) {
      const n = this.skeleton, i = this.geometry;
      Tu.fromBufferAttribute(i.attributes.skinIndex, t), Au.fromBufferAttribute(i.attributes.skinWeight, t), wu.copy(e).applyMatrix4(this.bindMatrix), e.set(0, 0, 0);
      for (let s = 0; s < 4; s++) {
        const o = Au.getComponent(s);
        if (o !== 0) {
          const a = Tu.getComponent(s);
          Eu.multiplyMatrices(n.bones[a].matrixWorld, n.boneInverses[a]), e.addScaledVector(wy.copy(wu).applyMatrix4(Eu), o);
        }
      }
      return e.applyMatrix4(this.bindMatrixInverse);
    }
  }
  class eh extends jt {
    constructor() {
      super(), this.isBone = true, this.type = "Bone";
    }
  }
  class pi extends fe {
    constructor(t = null, e = 1, n = 1, i, s, o, a, l, c = we, h = we, d, u) {
      super(null, o, a, l, c, h, i, s, d, u), this.isDataTexture = true, this.image = {
        data: t,
        width: e,
        height: n
      }, this.generateMipmaps = false, this.flipY = false, this.unpackAlignment = 1;
    }
  }
  const Ru = new Dt(), Ty = new Dt();
  class Pa {
    constructor(t = [], e = []) {
      this.uuid = sn(), this.bones = t.slice(0), this.boneInverses = e, this.boneMatrices = null, this.boneTexture = null, this.init();
    }
    init() {
      const t = this.bones, e = this.boneInverses;
      if (this.boneMatrices = new Float32Array(t.length * 16), e.length === 0) this.calculateInverses();
      else if (t.length !== e.length) {
        console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
        for (let n = 0, i = this.bones.length; n < i; n++) this.boneInverses.push(new Dt());
      }
    }
    calculateInverses() {
      this.boneInverses.length = 0;
      for (let t = 0, e = this.bones.length; t < e; t++) {
        const n = new Dt();
        this.bones[t] && n.copy(this.bones[t].matrixWorld).invert(), this.boneInverses.push(n);
      }
    }
    pose() {
      for (let t = 0, e = this.bones.length; t < e; t++) {
        const n = this.bones[t];
        n && n.matrixWorld.copy(this.boneInverses[t]).invert();
      }
      for (let t = 0, e = this.bones.length; t < e; t++) {
        const n = this.bones[t];
        n && (n.parent && n.parent.isBone ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld)) : n.matrix.copy(n.matrixWorld), n.matrix.decompose(n.position, n.quaternion, n.scale));
      }
    }
    update() {
      const t = this.bones, e = this.boneInverses, n = this.boneMatrices, i = this.boneTexture;
      for (let s = 0, o = t.length; s < o; s++) {
        const a = t[s] ? t[s].matrixWorld : Ty;
        Ru.multiplyMatrices(a, e[s]), Ru.toArray(n, s * 16);
      }
      i !== null && (i.needsUpdate = true);
    }
    clone() {
      return new Pa(this.bones, this.boneInverses);
    }
    computeBoneTexture() {
      let t = Math.sqrt(this.bones.length * 4);
      t = Math.ceil(t / 4) * 4, t = Math.max(t, 4);
      const e = new Float32Array(t * t * 4);
      e.set(this.boneMatrices);
      const n = new pi(e, t, t, nn, fn);
      return n.needsUpdate = true, this.boneMatrices = e, this.boneTexture = n, this;
    }
    getBoneByName(t) {
      for (let e = 0, n = this.bones.length; e < n; e++) {
        const i = this.bones[e];
        if (i.name === t) return i;
      }
    }
    dispose() {
      this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
    }
    fromJSON(t, e) {
      this.uuid = t.uuid;
      for (let n = 0, i = t.bones.length; n < i; n++) {
        const s = t.bones[n];
        let o = e[s];
        o === void 0 && (console.warn("THREE.Skeleton: No bone found with UUID:", s), o = new eh()), this.bones.push(o), this.boneInverses.push(new Dt().fromArray(t.boneInverses[n]));
      }
      return this.init(), this;
    }
    toJSON() {
      const t = {
        metadata: {
          version: 4.6,
          type: "Skeleton",
          generator: "Skeleton.toJSON"
        },
        bones: [],
        boneInverses: []
      };
      t.uuid = this.uuid;
      const e = this.bones, n = this.boneInverses;
      for (let i = 0, s = e.length; i < s; i++) {
        const o = e[i];
        t.bones.push(o.uuid);
        const a = n[i];
        t.boneInverses.push(a.toArray());
      }
      return t;
    }
  }
  class Bs extends se {
    constructor(t, e, n, i = 1) {
      super(t, e, n), this.isInstancedBufferAttribute = true, this.meshPerAttribute = i;
    }
    copy(t) {
      return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.meshPerAttribute = this.meshPerAttribute, t.isInstancedBufferAttribute = true, t;
    }
  }
  const ws = new Dt(), Pu = new Dt(), Do = [], Iu = new De(), Ay = new Dt(), rr = new ae(), or = new Ue();
  class tp extends ae {
    constructor(t, e, n) {
      super(t, e), this.isInstancedMesh = true, this.instanceMatrix = new Bs(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
      for (let i = 0; i < n; i++) this.setMatrixAt(i, Ay);
    }
    computeBoundingBox() {
      const t = this.geometry, e = this.count;
      this.boundingBox === null && (this.boundingBox = new De()), t.boundingBox === null && t.computeBoundingBox(), this.boundingBox.makeEmpty();
      for (let n = 0; n < e; n++) this.getMatrixAt(n, ws), Iu.copy(t.boundingBox).applyMatrix4(ws), this.boundingBox.union(Iu);
    }
    computeBoundingSphere() {
      const t = this.geometry, e = this.count;
      this.boundingSphere === null && (this.boundingSphere = new Ue()), t.boundingSphere === null && t.computeBoundingSphere(), this.boundingSphere.makeEmpty();
      for (let n = 0; n < e; n++) this.getMatrixAt(n, ws), or.copy(t.boundingSphere).applyMatrix4(ws), this.boundingSphere.union(or);
    }
    copy(t, e) {
      return super.copy(t, e), this.instanceMatrix.copy(t.instanceMatrix), t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone()), t.instanceColor !== null && (this.instanceColor = t.instanceColor.clone()), this.count = t.count, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
    }
    getColorAt(t, e) {
      e.fromArray(this.instanceColor.array, t * 3);
    }
    getMatrixAt(t, e) {
      e.fromArray(this.instanceMatrix.array, t * 16);
    }
    getMorphAt(t, e) {
      const n = e.morphTargetInfluences, i = this.morphTexture.source.data.data, s = n.length + 1, o = t * s + 1;
      for (let a = 0; a < n.length; a++) n[a] = i[o + a];
    }
    raycast(t, e) {
      const n = this.matrixWorld, i = this.count;
      if (rr.geometry = this.geometry, rr.material = this.material, rr.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), or.copy(this.boundingSphere), or.applyMatrix4(n), t.ray.intersectsSphere(or) !== false)) for (let s = 0; s < i; s++) {
        this.getMatrixAt(s, ws), Pu.multiplyMatrices(n, ws), rr.matrixWorld = Pu, rr.raycast(t, Do);
        for (let o = 0, a = Do.length; o < a; o++) {
          const l = Do[o];
          l.instanceId = s, l.object = this, e.push(l);
        }
        Do.length = 0;
      }
    }
    setColorAt(t, e) {
      this.instanceColor === null && (this.instanceColor = new Bs(new Float32Array(this.instanceMatrix.count * 3), 3)), e.toArray(this.instanceColor.array, t * 3);
    }
    setMatrixAt(t, e) {
      e.toArray(this.instanceMatrix.array, t * 16);
    }
    setMorphAt(t, e) {
      const n = e.morphTargetInfluences, i = n.length + 1;
      this.morphTexture === null && (this.morphTexture = new pi(new Float32Array(i * this.count), i, this.count, Bc, fn));
      const s = this.morphTexture.source.data.data;
      let o = 0;
      for (let c = 0; c < n.length; c++) o += n[c];
      const a = this.geometry.morphTargetsRelative ? 1 : 1 - o, l = i * t;
      s[l] = a, s.set(n, l + 1);
    }
    updateMorphTargets() {
    }
    dispose() {
      return this.dispatchEvent({
        type: "dispose"
      }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
    }
  }
  function Ey(r, t) {
    return r.z - t.z;
  }
  function Cy(r, t) {
    return t.z - r.z;
  }
  class Ry {
    constructor() {
      this.index = 0, this.pool = [], this.list = [];
    }
    push(t, e) {
      const n = this.pool, i = this.list;
      this.index >= n.length && n.push({
        start: -1,
        count: -1,
        z: -1
      });
      const s = n[this.index];
      i.push(s), this.index++, s.start = t.start, s.count = t.count, s.z = e;
    }
    reset() {
      this.list.length = 0, this.index = 0;
    }
  }
  const Ts = "batchId", hi = new Dt(), Lu = new Dt(), Py = new Dt(), Du = new Dt(), Al = new Jr(), Uo = new De(), Pi = new Ue(), ar = new R(), El = new Ry(), Le = new ae(), No = [];
  function Iy(r, t, e = 0) {
    const n = t.itemSize;
    if (r.isInterleavedBufferAttribute || r.array.constructor !== t.array.constructor) {
      const i = r.count;
      for (let s = 0; s < i; s++) for (let o = 0; o < n; o++) t.setComponent(s + e, o, r.getComponent(s, o));
    } else t.array.set(r.array, e * n);
    t.needsUpdate = true;
  }
  class ep extends ae {
    get maxGeometryCount() {
      return this._maxGeometryCount;
    }
    constructor(t, e, n = e * 2, i) {
      super(new Wt(), i), this.isBatchedMesh = true, this.perObjectFrustumCulled = true, this.sortObjects = true, this.boundingBox = null, this.boundingSphere = null, this.customSort = null, this._drawRanges = [], this._reservedRanges = [], this._visibility = [], this._active = [], this._bounds = [], this._maxGeometryCount = t, this._maxVertexCount = e, this._maxIndexCount = n, this._geometryInitialized = false, this._geometryCount = 0, this._multiDrawCounts = new Int32Array(t), this._multiDrawStarts = new Int32Array(t), this._multiDrawCount = 0, this._multiDrawInstances = null, this._visibilityChanged = true, this._matricesTexture = null, this._initMatricesTexture();
    }
    _initMatricesTexture() {
      let t = Math.sqrt(this._maxGeometryCount * 4);
      t = Math.ceil(t / 4) * 4, t = Math.max(t, 4);
      const e = new Float32Array(t * t * 4), n = new pi(e, t, t, nn, fn);
      this._matricesTexture = n;
    }
    _initializeGeometry(t) {
      const e = this.geometry, n = this._maxVertexCount, i = this._maxGeometryCount, s = this._maxIndexCount;
      if (this._geometryInitialized === false) {
        for (const a in t.attributes) {
          const l = t.getAttribute(a), { array: c, itemSize: h, normalized: d } = l, u = new c.constructor(n * h), f = new se(u, h, d);
          e.setAttribute(a, f);
        }
        if (t.getIndex() !== null) {
          const a = n > 65536 ? new Uint32Array(s) : new Uint16Array(s);
          e.setIndex(new se(a, 1));
        }
        const o = i > 65536 ? new Uint32Array(n) : new Uint16Array(n);
        e.setAttribute(Ts, new se(o, 1)), this._geometryInitialized = true;
      }
    }
    _validateGeometry(t) {
      if (t.getAttribute(Ts)) throw new Error(`BatchedMesh: Geometry cannot use attribute "${Ts}"`);
      const e = this.geometry;
      if (!!t.getIndex() != !!e.getIndex()) throw new Error('BatchedMesh: All geometries must consistently have "index".');
      for (const n in e.attributes) {
        if (n === Ts) continue;
        if (!t.hasAttribute(n)) throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);
        const i = t.getAttribute(n), s = e.getAttribute(n);
        if (i.itemSize !== s.itemSize || i.normalized !== s.normalized) throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.");
      }
    }
    setCustomSort(t) {
      return this.customSort = t, this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new De());
      const t = this._geometryCount, e = this.boundingBox, n = this._active;
      e.makeEmpty();
      for (let i = 0; i < t; i++) n[i] !== false && (this.getMatrixAt(i, hi), this.getBoundingBoxAt(i, Uo).applyMatrix4(hi), e.union(Uo));
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new Ue());
      const t = this._geometryCount, e = this.boundingSphere, n = this._active;
      e.makeEmpty();
      for (let i = 0; i < t; i++) n[i] !== false && (this.getMatrixAt(i, hi), this.getBoundingSphereAt(i, Pi).applyMatrix4(hi), e.union(Pi));
    }
    addGeometry(t, e = -1, n = -1) {
      if (this._initializeGeometry(t), this._validateGeometry(t), this._geometryCount >= this._maxGeometryCount) throw new Error("BatchedMesh: Maximum geometry count reached.");
      const i = {
        vertexStart: -1,
        vertexCount: -1,
        indexStart: -1,
        indexCount: -1
      };
      let s = null;
      const o = this._reservedRanges, a = this._drawRanges, l = this._bounds;
      this._geometryCount !== 0 && (s = o[o.length - 1]), e === -1 ? i.vertexCount = t.getAttribute("position").count : i.vertexCount = e, s === null ? i.vertexStart = 0 : i.vertexStart = s.vertexStart + s.vertexCount;
      const c = t.getIndex(), h = c !== null;
      if (h && (n === -1 ? i.indexCount = c.count : i.indexCount = n, s === null ? i.indexStart = 0 : i.indexStart = s.indexStart + s.indexCount), i.indexStart !== -1 && i.indexStart + i.indexCount > this._maxIndexCount || i.vertexStart + i.vertexCount > this._maxVertexCount) throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");
      const d = this._visibility, u = this._active, f = this._matricesTexture, m = this._matricesTexture.image.data;
      d.push(true), u.push(true);
      const _ = this._geometryCount;
      this._geometryCount++, Py.toArray(m, _ * 16), f.needsUpdate = true, o.push(i), a.push({
        start: h ? i.indexStart : i.vertexStart,
        count: -1
      }), l.push({
        boxInitialized: false,
        box: new De(),
        sphereInitialized: false,
        sphere: new Ue()
      });
      const g = this.geometry.getAttribute(Ts);
      for (let p = 0; p < i.vertexCount; p++) g.setX(i.vertexStart + p, _);
      return g.needsUpdate = true, this.setGeometryAt(_, t), _;
    }
    setGeometryAt(t, e) {
      if (t >= this._geometryCount) throw new Error("BatchedMesh: Maximum geometry count reached.");
      this._validateGeometry(e);
      const n = this.geometry, i = n.getIndex() !== null, s = n.getIndex(), o = e.getIndex(), a = this._reservedRanges[t];
      if (i && o.count > a.indexCount || e.attributes.position.count > a.vertexCount) throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");
      const l = a.vertexStart, c = a.vertexCount;
      for (const f in n.attributes) {
        if (f === Ts) continue;
        const m = e.getAttribute(f), _ = n.getAttribute(f);
        Iy(m, _, l);
        const g = m.itemSize;
        for (let p = m.count, v = c; p < v; p++) {
          const x = l + p;
          for (let S = 0; S < g; S++) _.setComponent(x, S, 0);
        }
        _.needsUpdate = true, _.addUpdateRange(l * g, c * g);
      }
      if (i) {
        const f = a.indexStart;
        for (let m = 0; m < o.count; m++) s.setX(f + m, l + o.getX(m));
        for (let m = o.count, _ = a.indexCount; m < _; m++) s.setX(f + m, l);
        s.needsUpdate = true, s.addUpdateRange(f, a.indexCount);
      }
      const h = this._bounds[t];
      e.boundingBox !== null ? (h.box.copy(e.boundingBox), h.boxInitialized = true) : h.boxInitialized = false, e.boundingSphere !== null ? (h.sphere.copy(e.boundingSphere), h.sphereInitialized = true) : h.sphereInitialized = false;
      const d = this._drawRanges[t], u = e.getAttribute("position");
      return d.count = i ? o.count : u.count, this._visibilityChanged = true, t;
    }
    deleteGeometry(t) {
      const e = this._active;
      return t >= e.length || e[t] === false ? this : (e[t] = false, this._visibilityChanged = true, this);
    }
    getInstanceCountAt(t) {
      return this._multiDrawInstances === null ? null : this._multiDrawInstances[t];
    }
    setInstanceCountAt(t, e) {
      return this._multiDrawInstances === null && (this._multiDrawInstances = new Int32Array(this._maxGeometryCount).fill(1)), this._multiDrawInstances[t] = e, t;
    }
    getBoundingBoxAt(t, e) {
      if (this._active[t] === false) return null;
      const i = this._bounds[t], s = i.box, o = this.geometry;
      if (i.boxInitialized === false) {
        s.makeEmpty();
        const a = o.index, l = o.attributes.position, c = this._drawRanges[t];
        for (let h = c.start, d = c.start + c.count; h < d; h++) {
          let u = h;
          a && (u = a.getX(u)), s.expandByPoint(ar.fromBufferAttribute(l, u));
        }
        i.boxInitialized = true;
      }
      return e.copy(s), e;
    }
    getBoundingSphereAt(t, e) {
      if (this._active[t] === false) return null;
      const i = this._bounds[t], s = i.sphere, o = this.geometry;
      if (i.sphereInitialized === false) {
        s.makeEmpty(), this.getBoundingBoxAt(t, Uo), Uo.getCenter(s.center);
        const a = o.index, l = o.attributes.position, c = this._drawRanges[t];
        let h = 0;
        for (let d = c.start, u = c.start + c.count; d < u; d++) {
          let f = d;
          a && (f = a.getX(f)), ar.fromBufferAttribute(l, f), h = Math.max(h, s.center.distanceToSquared(ar));
        }
        s.radius = Math.sqrt(h), i.sphereInitialized = true;
      }
      return e.copy(s), e;
    }
    setMatrixAt(t, e) {
      const n = this._active, i = this._matricesTexture, s = this._matricesTexture.image.data, o = this._geometryCount;
      return t >= o || n[t] === false ? this : (e.toArray(s, t * 16), i.needsUpdate = true, this);
    }
    getMatrixAt(t, e) {
      const n = this._active, i = this._matricesTexture.image.data, s = this._geometryCount;
      return t >= s || n[t] === false ? null : e.fromArray(i, t * 16);
    }
    setVisibleAt(t, e) {
      const n = this._visibility, i = this._active, s = this._geometryCount;
      return t >= s || i[t] === false || n[t] === e ? this : (n[t] = e, this._visibilityChanged = true, this);
    }
    getVisibleAt(t) {
      const e = this._visibility, n = this._active, i = this._geometryCount;
      return t >= i || n[t] === false ? false : e[t];
    }
    raycast(t, e) {
      const n = this._visibility, i = this._active, s = this._drawRanges, o = this._geometryCount, a = this.matrixWorld, l = this.geometry;
      Le.material = this.material, Le.geometry.index = l.index, Le.geometry.attributes = l.attributes, Le.geometry.boundingBox === null && (Le.geometry.boundingBox = new De()), Le.geometry.boundingSphere === null && (Le.geometry.boundingSphere = new Ue());
      for (let c = 0; c < o; c++) {
        if (!n[c] || !i[c]) continue;
        const h = s[c];
        Le.geometry.setDrawRange(h.start, h.count), this.getMatrixAt(c, Le.matrixWorld).premultiply(a), this.getBoundingBoxAt(c, Le.geometry.boundingBox), this.getBoundingSphereAt(c, Le.geometry.boundingSphere), Le.raycast(t, No);
        for (let d = 0, u = No.length; d < u; d++) {
          const f = No[d];
          f.object = this, f.batchId = c, e.push(f);
        }
        No.length = 0;
      }
      Le.material = null, Le.geometry.index = null, Le.geometry.attributes = {}, Le.geometry.setDrawRange(0, 1 / 0);
    }
    copy(t) {
      return super.copy(t), this.geometry = t.geometry.clone(), this.perObjectFrustumCulled = t.perObjectFrustumCulled, this.sortObjects = t.sortObjects, this.boundingBox = t.boundingBox !== null ? t.boundingBox.clone() : null, this.boundingSphere = t.boundingSphere !== null ? t.boundingSphere.clone() : null, this._drawRanges = t._drawRanges.map((e) => ({
        ...e
      })), this._reservedRanges = t._reservedRanges.map((e) => ({
        ...e
      })), this._visibility = t._visibility.slice(), this._active = t._active.slice(), this._bounds = t._bounds.map((e) => ({
        boxInitialized: e.boxInitialized,
        box: e.box.clone(),
        sphereInitialized: e.sphereInitialized,
        sphere: e.sphere.clone()
      })), this._maxGeometryCount = t._maxGeometryCount, this._maxVertexCount = t._maxVertexCount, this._maxIndexCount = t._maxIndexCount, this._geometryInitialized = t._geometryInitialized, this._geometryCount = t._geometryCount, this._multiDrawCounts = t._multiDrawCounts.slice(), this._multiDrawStarts = t._multiDrawStarts.slice(), this._matricesTexture = t._matricesTexture.clone(), this._matricesTexture.image.data = this._matricesTexture.image.slice(), this;
    }
    dispose() {
      return this.geometry.dispose(), this._matricesTexture.dispose(), this._matricesTexture = null, this;
    }
    onBeforeRender(t, e, n, i, s) {
      if (!this._visibilityChanged && !this.perObjectFrustumCulled && !this.sortObjects) return;
      const o = i.getIndex(), a = o === null ? 1 : o.array.BYTES_PER_ELEMENT, l = this._active, c = this._visibility, h = this._multiDrawStarts, d = this._multiDrawCounts, u = this._drawRanges, f = this.perObjectFrustumCulled;
      f && (Du.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse).multiply(this.matrixWorld), Al.setFromProjectionMatrix(Du, t.coordinateSystem));
      let m = 0;
      if (this.sortObjects) {
        Lu.copy(this.matrixWorld).invert(), ar.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Lu);
        for (let p = 0, v = c.length; p < v; p++) if (c[p] && l[p]) {
          this.getMatrixAt(p, hi), this.getBoundingSphereAt(p, Pi).applyMatrix4(hi);
          let x = false;
          if (f && (x = !Al.intersectsSphere(Pi)), !x) {
            const S = ar.distanceTo(Pi.center);
            El.push(u[p], S);
          }
        }
        const _ = El.list, g = this.customSort;
        g === null ? _.sort(s.transparent ? Cy : Ey) : g.call(this, _, n);
        for (let p = 0, v = _.length; p < v; p++) {
          const x = _[p];
          h[m] = x.start * a, d[m] = x.count, m++;
        }
        El.reset();
      } else for (let _ = 0, g = c.length; _ < g; _++) if (c[_] && l[_]) {
        let p = false;
        if (f && (this.getMatrixAt(_, hi), this.getBoundingSphereAt(_, Pi).applyMatrix4(hi), p = !Al.intersectsSphere(Pi)), !p) {
          const v = u[_];
          h[m] = v.start * a, d[m] = v.count, m++;
        }
      }
      this._multiDrawCount = m, this._visibilityChanged = false;
    }
    onBeforeShadow(t, e, n, i, s, o) {
      this.onBeforeRender(t, null, i, s, o);
    }
  }
  class He extends Ne {
    constructor(t) {
      super(), this.isLineBasicMaterial = true, this.type = "LineBasicMaterial", this.color = new xt(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.linewidth = t.linewidth, this.linecap = t.linecap, this.linejoin = t.linejoin, this.fog = t.fog, this;
    }
  }
  const ca = new R(), ha = new R(), Uu = new Dt(), lr = new Gs(), Oo = new Ue(), Cl = new R(), Nu = new R();
  class xi extends jt {
    constructor(t = new Wt(), e = new He()) {
      super(), this.isLine = true, this.type = "Line", this.geometry = t, this.material = e, this.updateMorphTargets();
    }
    copy(t, e) {
      return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
    }
    computeLineDistances() {
      const t = this.geometry;
      if (t.index === null) {
        const e = t.attributes.position, n = [
          0
        ];
        for (let i = 1, s = e.count; i < s; i++) ca.fromBufferAttribute(e, i - 1), ha.fromBufferAttribute(e, i), n[i] = n[i - 1], n[i] += ca.distanceTo(ha);
        t.setAttribute("lineDistance", new bt(n, 1));
      } else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
    raycast(t, e) {
      const n = this.geometry, i = this.matrixWorld, s = t.params.Line.threshold, o = n.drawRange;
      if (n.boundingSphere === null && n.computeBoundingSphere(), Oo.copy(n.boundingSphere), Oo.applyMatrix4(i), Oo.radius += s, t.ray.intersectsSphere(Oo) === false) return;
      Uu.copy(i).invert(), lr.copy(t.ray).applyMatrix4(Uu);
      const a = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = a * a, c = this.isLineSegments ? 2 : 1, h = n.index, u = n.attributes.position;
      if (h !== null) {
        const f = Math.max(0, o.start), m = Math.min(h.count, o.start + o.count);
        for (let _ = f, g = m - 1; _ < g; _ += c) {
          const p = h.getX(_), v = h.getX(_ + 1), x = zo(this, t, lr, l, p, v);
          x && e.push(x);
        }
        if (this.isLineLoop) {
          const _ = h.getX(m - 1), g = h.getX(f), p = zo(this, t, lr, l, _, g);
          p && e.push(p);
        }
      } else {
        const f = Math.max(0, o.start), m = Math.min(u.count, o.start + o.count);
        for (let _ = f, g = m - 1; _ < g; _ += c) {
          const p = zo(this, t, lr, l, _, _ + 1);
          p && e.push(p);
        }
        if (this.isLineLoop) {
          const _ = zo(this, t, lr, l, m - 1, f);
          _ && e.push(_);
        }
      }
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, n = Object.keys(e);
      if (n.length > 0) {
        const i = e[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let s = 0, o = i.length; s < o; s++) {
            const a = i[s].name || String(s);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
          }
        }
      }
    }
  }
  function zo(r, t, e, n, i, s) {
    const o = r.geometry.attributes.position;
    if (ca.fromBufferAttribute(o, i), ha.fromBufferAttribute(o, s), e.distanceSqToSegment(ca, ha, Cl, Nu) > n) return;
    Cl.applyMatrix4(r.matrixWorld);
    const l = t.ray.origin.distanceTo(Cl);
    if (!(l < t.near || l > t.far)) return {
      distance: l,
      point: Nu.clone().applyMatrix4(r.matrixWorld),
      index: i,
      face: null,
      faceIndex: null,
      object: r
    };
  }
  const Ou = new R(), zu = new R();
  class Dn extends xi {
    constructor(t, e) {
      super(t, e), this.isLineSegments = true, this.type = "LineSegments";
    }
    computeLineDistances() {
      const t = this.geometry;
      if (t.index === null) {
        const e = t.attributes.position, n = [];
        for (let i = 0, s = e.count; i < s; i += 2) Ou.fromBufferAttribute(e, i), zu.fromBufferAttribute(e, i + 1), n[i] = i === 0 ? 0 : n[i - 1], n[i + 1] = n[i] + Ou.distanceTo(zu);
        t.setAttribute("lineDistance", new bt(n, 1));
      } else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
      return this;
    }
  }
  class np extends xi {
    constructor(t, e) {
      super(t, e), this.isLineLoop = true, this.type = "LineLoop";
    }
  }
  class nh extends Ne {
    constructor(t) {
      super(), this.isPointsMaterial = true, this.type = "PointsMaterial", this.color = new xt(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = true, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.alphaMap = t.alphaMap, this.size = t.size, this.sizeAttenuation = t.sizeAttenuation, this.fog = t.fog, this;
    }
  }
  const Fu = new Dt(), Mc = new Gs(), Fo = new Ue(), Bo = new R();
  class ip extends jt {
    constructor(t = new Wt(), e = new nh()) {
      super(), this.isPoints = true, this.type = "Points", this.geometry = t, this.material = e, this.updateMorphTargets();
    }
    copy(t, e) {
      return super.copy(t, e), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
    }
    raycast(t, e) {
      const n = this.geometry, i = this.matrixWorld, s = t.params.Points.threshold, o = n.drawRange;
      if (n.boundingSphere === null && n.computeBoundingSphere(), Fo.copy(n.boundingSphere), Fo.applyMatrix4(i), Fo.radius += s, t.ray.intersectsSphere(Fo) === false) return;
      Fu.copy(i).invert(), Mc.copy(t.ray).applyMatrix4(Fu);
      const a = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), l = a * a, c = n.index, d = n.attributes.position;
      if (c !== null) {
        const u = Math.max(0, o.start), f = Math.min(c.count, o.start + o.count);
        for (let m = u, _ = f; m < _; m++) {
          const g = c.getX(m);
          Bo.fromBufferAttribute(d, g), Bu(Bo, g, l, i, t, e, this);
        }
      } else {
        const u = Math.max(0, o.start), f = Math.min(d.count, o.start + o.count);
        for (let m = u, _ = f; m < _; m++) Bo.fromBufferAttribute(d, m), Bu(Bo, m, l, i, t, e, this);
      }
    }
    updateMorphTargets() {
      const e = this.geometry.morphAttributes, n = Object.keys(e);
      if (n.length > 0) {
        const i = e[n[0]];
        if (i !== void 0) {
          this.morphTargetInfluences = [], this.morphTargetDictionary = {};
          for (let s = 0, o = i.length; s < o; s++) {
            const a = i[s].name || String(s);
            this.morphTargetInfluences.push(0), this.morphTargetDictionary[a] = s;
          }
        }
      }
    }
  }
  function Bu(r, t, e, n, i, s, o) {
    const a = Mc.distanceSqToPoint(r);
    if (a < e) {
      const l = new R();
      Mc.closestPointToPoint(r, l), l.applyMatrix4(n);
      const c = i.ray.origin.distanceTo(l);
      if (c < i.near || c > i.far) return;
      s.push({
        distance: c,
        distanceToRay: Math.sqrt(a),
        point: l,
        index: t,
        face: null,
        object: o
      });
    }
  }
  class Ly extends fe {
    constructor(t, e, n, i, s, o, a, l, c) {
      super(t, e, n, i, s, o, a, l, c), this.isVideoTexture = true, this.minFilter = o !== void 0 ? o : xe, this.magFilter = s !== void 0 ? s : xe, this.generateMipmaps = false;
      const h = this;
      function d() {
        h.needsUpdate = true, t.requestVideoFrameCallback(d);
      }
      "requestVideoFrameCallback" in t && t.requestVideoFrameCallback(d);
    }
    clone() {
      return new this.constructor(this.image).copy(this);
    }
    update() {
      const t = this.image;
      "requestVideoFrameCallback" in t === false && t.readyState >= t.HAVE_CURRENT_DATA && (this.needsUpdate = true);
    }
  }
  class Dy extends fe {
    constructor(t, e) {
      super({
        width: t,
        height: e
      }), this.isFramebufferTexture = true, this.magFilter = we, this.minFilter = we, this.generateMipmaps = false, this.needsUpdate = true;
    }
  }
  class Ia extends fe {
    constructor(t, e, n, i, s, o, a, l, c, h, d, u) {
      super(null, o, a, l, c, h, i, s, d, u), this.isCompressedTexture = true, this.image = {
        width: e,
        height: n
      }, this.mipmaps = t, this.flipY = false, this.generateMipmaps = false;
    }
  }
  class Uy extends Ia {
    constructor(t, e, n, i, s, o) {
      super(t, e, n, s, o), this.isCompressedArrayTexture = true, this.image.depth = i, this.wrapR = dn;
    }
  }
  class Ny extends Ia {
    constructor(t, e, n) {
      super(void 0, t[0].width, t[0].height, e, n, Jn), this.isCompressedCubeTexture = true, this.isCubeTexture = true, this.image = t;
    }
  }
  class sp extends fe {
    constructor(t, e, n, i, s, o, a, l, c) {
      super(t, e, n, i, s, o, a, l, c), this.isCanvasTexture = true, this.needsUpdate = true;
    }
  }
  class bn {
    constructor() {
      this.type = "Curve", this.arcLengthDivisions = 200;
    }
    getPoint() {
      return console.warn("THREE.Curve: .getPoint() not implemented."), null;
    }
    getPointAt(t, e) {
      const n = this.getUtoTmapping(t);
      return this.getPoint(n, e);
    }
    getPoints(t = 5) {
      const e = [];
      for (let n = 0; n <= t; n++) e.push(this.getPoint(n / t));
      return e;
    }
    getSpacedPoints(t = 5) {
      const e = [];
      for (let n = 0; n <= t; n++) e.push(this.getPointAt(n / t));
      return e;
    }
    getLength() {
      const t = this.getLengths();
      return t[t.length - 1];
    }
    getLengths(t = this.arcLengthDivisions) {
      if (this.cacheArcLengths && this.cacheArcLengths.length === t + 1 && !this.needsUpdate) return this.cacheArcLengths;
      this.needsUpdate = false;
      const e = [];
      let n, i = this.getPoint(0), s = 0;
      e.push(0);
      for (let o = 1; o <= t; o++) n = this.getPoint(o / t), s += n.distanceTo(i), e.push(s), i = n;
      return this.cacheArcLengths = e, e;
    }
    updateArcLengths() {
      this.needsUpdate = true, this.getLengths();
    }
    getUtoTmapping(t, e) {
      const n = this.getLengths();
      let i = 0;
      const s = n.length;
      let o;
      e ? o = e : o = t * n[s - 1];
      let a = 0, l = s - 1, c;
      for (; a <= l; ) if (i = Math.floor(a + (l - a) / 2), c = n[i] - o, c < 0) a = i + 1;
      else if (c > 0) l = i - 1;
      else {
        l = i;
        break;
      }
      if (i = l, n[i] === o) return i / (s - 1);
      const h = n[i], u = n[i + 1] - h, f = (o - h) / u;
      return (i + f) / (s - 1);
    }
    getTangent(t, e) {
      let i = t - 1e-4, s = t + 1e-4;
      i < 0 && (i = 0), s > 1 && (s = 1);
      const o = this.getPoint(i), a = this.getPoint(s), l = e || (o.isVector2 ? new et() : new R());
      return l.copy(a).sub(o).normalize(), l;
    }
    getTangentAt(t, e) {
      const n = this.getUtoTmapping(t);
      return this.getTangent(n, e);
    }
    computeFrenetFrames(t, e) {
      const n = new R(), i = [], s = [], o = [], a = new R(), l = new Dt();
      for (let f = 0; f <= t; f++) {
        const m = f / t;
        i[f] = this.getTangentAt(m, new R());
      }
      s[0] = new R(), o[0] = new R();
      let c = Number.MAX_VALUE;
      const h = Math.abs(i[0].x), d = Math.abs(i[0].y), u = Math.abs(i[0].z);
      h <= c && (c = h, n.set(1, 0, 0)), d <= c && (c = d, n.set(0, 1, 0)), u <= c && n.set(0, 0, 1), a.crossVectors(i[0], n).normalize(), s[0].crossVectors(i[0], a), o[0].crossVectors(i[0], s[0]);
      for (let f = 1; f <= t; f++) {
        if (s[f] = s[f - 1].clone(), o[f] = o[f - 1].clone(), a.crossVectors(i[f - 1], i[f]), a.length() > Number.EPSILON) {
          a.normalize();
          const m = Math.acos(de(i[f - 1].dot(i[f]), -1, 1));
          s[f].applyMatrix4(l.makeRotationAxis(a, m));
        }
        o[f].crossVectors(i[f], s[f]);
      }
      if (e === true) {
        let f = Math.acos(de(s[0].dot(s[t]), -1, 1));
        f /= t, i[0].dot(a.crossVectors(s[0], s[t])) > 0 && (f = -f);
        for (let m = 1; m <= t; m++) s[m].applyMatrix4(l.makeRotationAxis(i[m], f * m)), o[m].crossVectors(i[m], s[m]);
      }
      return {
        tangents: i,
        normals: s,
        binormals: o
      };
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      return this.arcLengthDivisions = t.arcLengthDivisions, this;
    }
    toJSON() {
      const t = {
        metadata: {
          version: 4.6,
          type: "Curve",
          generator: "Curve.toJSON"
        }
      };
      return t.arcLengthDivisions = this.arcLengthDivisions, t.type = this.type, t;
    }
    fromJSON(t) {
      return this.arcLengthDivisions = t.arcLengthDivisions, this;
    }
  }
  class La extends bn {
    constructor(t = 0, e = 0, n = 1, i = 1, s = 0, o = Math.PI * 2, a = false, l = 0) {
      super(), this.isEllipseCurve = true, this.type = "EllipseCurve", this.aX = t, this.aY = e, this.xRadius = n, this.yRadius = i, this.aStartAngle = s, this.aEndAngle = o, this.aClockwise = a, this.aRotation = l;
    }
    getPoint(t, e = new et()) {
      const n = e, i = Math.PI * 2;
      let s = this.aEndAngle - this.aStartAngle;
      const o = Math.abs(s) < Number.EPSILON;
      for (; s < 0; ) s += i;
      for (; s > i; ) s -= i;
      s < Number.EPSILON && (o ? s = 0 : s = i), this.aClockwise === true && !o && (s === i ? s = -i : s = s - i);
      const a = this.aStartAngle + t * s;
      let l = this.aX + this.xRadius * Math.cos(a), c = this.aY + this.yRadius * Math.sin(a);
      if (this.aRotation !== 0) {
        const h = Math.cos(this.aRotation), d = Math.sin(this.aRotation), u = l - this.aX, f = c - this.aY;
        l = u * h - f * d + this.aX, c = u * d + f * h + this.aY;
      }
      return n.set(l, c);
    }
    copy(t) {
      return super.copy(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.aX = this.aX, t.aY = this.aY, t.xRadius = this.xRadius, t.yRadius = this.yRadius, t.aStartAngle = this.aStartAngle, t.aEndAngle = this.aEndAngle, t.aClockwise = this.aClockwise, t.aRotation = this.aRotation, t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
    }
  }
  class rp extends La {
    constructor(t, e, n, i, s, o) {
      super(t, e, n, n, i, s, o), this.isArcCurve = true, this.type = "ArcCurve";
    }
  }
  function ih() {
    let r = 0, t = 0, e = 0, n = 0;
    function i(s, o, a, l) {
      r = s, t = a, e = -3 * s + 3 * o - 2 * a - l, n = 2 * s - 2 * o + a + l;
    }
    return {
      initCatmullRom: function(s, o, a, l, c) {
        i(o, a, c * (a - s), c * (l - o));
      },
      initNonuniformCatmullRom: function(s, o, a, l, c, h, d) {
        let u = (o - s) / c - (a - s) / (c + h) + (a - o) / h, f = (a - o) / h - (l - o) / (h + d) + (l - a) / d;
        u *= h, f *= h, i(o, a, u, f);
      },
      calc: function(s) {
        const o = s * s, a = o * s;
        return r + t * s + e * o + n * a;
      }
    };
  }
  const ko = new R(), Rl = new ih(), Pl = new ih(), Il = new ih();
  class op extends bn {
    constructor(t = [], e = false, n = "centripetal", i = 0.5) {
      super(), this.isCatmullRomCurve3 = true, this.type = "CatmullRomCurve3", this.points = t, this.closed = e, this.curveType = n, this.tension = i;
    }
    getPoint(t, e = new R()) {
      const n = e, i = this.points, s = i.length, o = (s - (this.closed ? 0 : 1)) * t;
      let a = Math.floor(o), l = o - a;
      this.closed ? a += a > 0 ? 0 : (Math.floor(Math.abs(a) / s) + 1) * s : l === 0 && a === s - 1 && (a = s - 2, l = 1);
      let c, h;
      this.closed || a > 0 ? c = i[(a - 1) % s] : (ko.subVectors(i[0], i[1]).add(i[0]), c = ko);
      const d = i[a % s], u = i[(a + 1) % s];
      if (this.closed || a + 2 < s ? h = i[(a + 2) % s] : (ko.subVectors(i[s - 1], i[s - 2]).add(i[s - 1]), h = ko), this.curveType === "centripetal" || this.curveType === "chordal") {
        const f = this.curveType === "chordal" ? 0.5 : 0.25;
        let m = Math.pow(c.distanceToSquared(d), f), _ = Math.pow(d.distanceToSquared(u), f), g = Math.pow(u.distanceToSquared(h), f);
        _ < 1e-4 && (_ = 1), m < 1e-4 && (m = _), g < 1e-4 && (g = _), Rl.initNonuniformCatmullRom(c.x, d.x, u.x, h.x, m, _, g), Pl.initNonuniformCatmullRom(c.y, d.y, u.y, h.y, m, _, g), Il.initNonuniformCatmullRom(c.z, d.z, u.z, h.z, m, _, g);
      } else this.curveType === "catmullrom" && (Rl.initCatmullRom(c.x, d.x, u.x, h.x, this.tension), Pl.initCatmullRom(c.y, d.y, u.y, h.y, this.tension), Il.initCatmullRom(c.z, d.z, u.z, h.z, this.tension));
      return n.set(Rl.calc(l), Pl.calc(l), Il.calc(l)), n;
    }
    copy(t) {
      super.copy(t), this.points = [];
      for (let e = 0, n = t.points.length; e < n; e++) {
        const i = t.points[e];
        this.points.push(i.clone());
      }
      return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
    }
    toJSON() {
      const t = super.toJSON();
      t.points = [];
      for (let e = 0, n = this.points.length; e < n; e++) {
        const i = this.points[e];
        t.points.push(i.toArray());
      }
      return t.closed = this.closed, t.curveType = this.curveType, t.tension = this.tension, t;
    }
    fromJSON(t) {
      super.fromJSON(t), this.points = [];
      for (let e = 0, n = t.points.length; e < n; e++) {
        const i = t.points[e];
        this.points.push(new R().fromArray(i));
      }
      return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
    }
  }
  function ku(r, t, e, n, i) {
    const s = (n - t) * 0.5, o = (i - e) * 0.5, a = r * r, l = r * a;
    return (2 * e - 2 * n + s + o) * l + (-3 * e + 3 * n - 2 * s - o) * a + s * r + e;
  }
  function Oy(r, t) {
    const e = 1 - r;
    return e * e * t;
  }
  function zy(r, t) {
    return 2 * (1 - r) * r * t;
  }
  function Fy(r, t) {
    return r * r * t;
  }
  function xr(r, t, e, n) {
    return Oy(r, t) + zy(r, e) + Fy(r, n);
  }
  function By(r, t) {
    const e = 1 - r;
    return e * e * e * t;
  }
  function ky(r, t) {
    const e = 1 - r;
    return 3 * e * e * r * t;
  }
  function Vy(r, t) {
    return 3 * (1 - r) * r * r * t;
  }
  function Hy(r, t) {
    return r * r * r * t;
  }
  function vr(r, t, e, n, i) {
    return By(r, t) + ky(r, e) + Vy(r, n) + Hy(r, i);
  }
  class sh extends bn {
    constructor(t = new et(), e = new et(), n = new et(), i = new et()) {
      super(), this.isCubicBezierCurve = true, this.type = "CubicBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = i;
    }
    getPoint(t, e = new et()) {
      const n = e, i = this.v0, s = this.v1, o = this.v2, a = this.v3;
      return n.set(vr(t, i.x, s.x, o.x, a.x), vr(t, i.y, s.y, o.y, a.y)), n;
    }
    copy(t) {
      return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
    }
  }
  class ap extends bn {
    constructor(t = new R(), e = new R(), n = new R(), i = new R()) {
      super(), this.isCubicBezierCurve3 = true, this.type = "CubicBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = i;
    }
    getPoint(t, e = new R()) {
      const n = e, i = this.v0, s = this.v1, o = this.v2, a = this.v3;
      return n.set(vr(t, i.x, s.x, o.x, a.x), vr(t, i.y, s.y, o.y, a.y), vr(t, i.z, s.z, o.z, a.z)), n;
    }
    copy(t) {
      return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
    }
  }
  class rh extends bn {
    constructor(t = new et(), e = new et()) {
      super(), this.isLineCurve = true, this.type = "LineCurve", this.v1 = t, this.v2 = e;
    }
    getPoint(t, e = new et()) {
      const n = e;
      return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
    }
    getPointAt(t, e) {
      return this.getPoint(t, e);
    }
    getTangent(t, e = new et()) {
      return e.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(t, e) {
      return this.getTangent(t, e);
    }
    copy(t) {
      return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
    }
  }
  class lp extends bn {
    constructor(t = new R(), e = new R()) {
      super(), this.isLineCurve3 = true, this.type = "LineCurve3", this.v1 = t, this.v2 = e;
    }
    getPoint(t, e = new R()) {
      const n = e;
      return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
    }
    getPointAt(t, e) {
      return this.getPoint(t, e);
    }
    getTangent(t, e = new R()) {
      return e.subVectors(this.v2, this.v1).normalize();
    }
    getTangentAt(t, e) {
      return this.getTangent(t, e);
    }
    copy(t) {
      return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
    }
  }
  class oh extends bn {
    constructor(t = new et(), e = new et(), n = new et()) {
      super(), this.isQuadraticBezierCurve = true, this.type = "QuadraticBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n;
    }
    getPoint(t, e = new et()) {
      const n = e, i = this.v0, s = this.v1, o = this.v2;
      return n.set(xr(t, i.x, s.x, o.x), xr(t, i.y, s.y, o.y)), n;
    }
    copy(t) {
      return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
    }
  }
  class ah extends bn {
    constructor(t = new R(), e = new R(), n = new R()) {
      super(), this.isQuadraticBezierCurve3 = true, this.type = "QuadraticBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n;
    }
    getPoint(t, e = new R()) {
      const n = e, i = this.v0, s = this.v1, o = this.v2;
      return n.set(xr(t, i.x, s.x, o.x), xr(t, i.y, s.y, o.y), xr(t, i.z, s.z, o.z)), n;
    }
    copy(t) {
      return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
    }
  }
  class lh extends bn {
    constructor(t = []) {
      super(), this.isSplineCurve = true, this.type = "SplineCurve", this.points = t;
    }
    getPoint(t, e = new et()) {
      const n = e, i = this.points, s = (i.length - 1) * t, o = Math.floor(s), a = s - o, l = i[o === 0 ? o : o - 1], c = i[o], h = i[o > i.length - 2 ? i.length - 1 : o + 1], d = i[o > i.length - 3 ? i.length - 1 : o + 2];
      return n.set(ku(a, l.x, c.x, h.x, d.x), ku(a, l.y, c.y, h.y, d.y)), n;
    }
    copy(t) {
      super.copy(t), this.points = [];
      for (let e = 0, n = t.points.length; e < n; e++) {
        const i = t.points[e];
        this.points.push(i.clone());
      }
      return this;
    }
    toJSON() {
      const t = super.toJSON();
      t.points = [];
      for (let e = 0, n = this.points.length; e < n; e++) {
        const i = this.points[e];
        t.points.push(i.toArray());
      }
      return t;
    }
    fromJSON(t) {
      super.fromJSON(t), this.points = [];
      for (let e = 0, n = t.points.length; e < n; e++) {
        const i = t.points[e];
        this.points.push(new et().fromArray(i));
      }
      return this;
    }
  }
  var ua = Object.freeze({
    __proto__: null,
    ArcCurve: rp,
    CatmullRomCurve3: op,
    CubicBezierCurve: sh,
    CubicBezierCurve3: ap,
    EllipseCurve: La,
    LineCurve: rh,
    LineCurve3: lp,
    QuadraticBezierCurve: oh,
    QuadraticBezierCurve3: ah,
    SplineCurve: lh
  });
  class cp extends bn {
    constructor() {
      super(), this.type = "CurvePath", this.curves = [], this.autoClose = false;
    }
    add(t) {
      this.curves.push(t);
    }
    closePath() {
      const t = this.curves[0].getPoint(0), e = this.curves[this.curves.length - 1].getPoint(1);
      if (!t.equals(e)) {
        const n = t.isVector2 === true ? "LineCurve" : "LineCurve3";
        this.curves.push(new ua[n](e, t));
      }
      return this;
    }
    getPoint(t, e) {
      const n = t * this.getLength(), i = this.getCurveLengths();
      let s = 0;
      for (; s < i.length; ) {
        if (i[s] >= n) {
          const o = i[s] - n, a = this.curves[s], l = a.getLength(), c = l === 0 ? 0 : 1 - o / l;
          return a.getPointAt(c, e);
        }
        s++;
      }
      return null;
    }
    getLength() {
      const t = this.getCurveLengths();
      return t[t.length - 1];
    }
    updateArcLengths() {
      this.needsUpdate = true, this.cacheLengths = null, this.getCurveLengths();
    }
    getCurveLengths() {
      if (this.cacheLengths && this.cacheLengths.length === this.curves.length) return this.cacheLengths;
      const t = [];
      let e = 0;
      for (let n = 0, i = this.curves.length; n < i; n++) e += this.curves[n].getLength(), t.push(e);
      return this.cacheLengths = t, t;
    }
    getSpacedPoints(t = 40) {
      const e = [];
      for (let n = 0; n <= t; n++) e.push(this.getPoint(n / t));
      return this.autoClose && e.push(e[0]), e;
    }
    getPoints(t = 12) {
      const e = [];
      let n;
      for (let i = 0, s = this.curves; i < s.length; i++) {
        const o = s[i], a = o.isEllipseCurve ? t * 2 : o.isLineCurve || o.isLineCurve3 ? 1 : o.isSplineCurve ? t * o.points.length : t, l = o.getPoints(a);
        for (let c = 0; c < l.length; c++) {
          const h = l[c];
          n && n.equals(h) || (e.push(h), n = h);
        }
      }
      return this.autoClose && e.length > 1 && !e[e.length - 1].equals(e[0]) && e.push(e[0]), e;
    }
    copy(t) {
      super.copy(t), this.curves = [];
      for (let e = 0, n = t.curves.length; e < n; e++) {
        const i = t.curves[e];
        this.curves.push(i.clone());
      }
      return this.autoClose = t.autoClose, this;
    }
    toJSON() {
      const t = super.toJSON();
      t.autoClose = this.autoClose, t.curves = [];
      for (let e = 0, n = this.curves.length; e < n; e++) {
        const i = this.curves[e];
        t.curves.push(i.toJSON());
      }
      return t;
    }
    fromJSON(t) {
      super.fromJSON(t), this.autoClose = t.autoClose, this.curves = [];
      for (let e = 0, n = t.curves.length; e < n; e++) {
        const i = t.curves[e];
        this.curves.push(new ua[i.type]().fromJSON(i));
      }
      return this;
    }
  }
  class Ji extends cp {
    constructor(t) {
      super(), this.type = "Path", this.currentPoint = new et(), t && this.setFromPoints(t);
    }
    setFromPoints(t) {
      this.moveTo(t[0].x, t[0].y);
      for (let e = 1, n = t.length; e < n; e++) this.lineTo(t[e].x, t[e].y);
      return this;
    }
    moveTo(t, e) {
      return this.currentPoint.set(t, e), this;
    }
    lineTo(t, e) {
      const n = new rh(this.currentPoint.clone(), new et(t, e));
      return this.curves.push(n), this.currentPoint.set(t, e), this;
    }
    quadraticCurveTo(t, e, n, i) {
      const s = new oh(this.currentPoint.clone(), new et(t, e), new et(n, i));
      return this.curves.push(s), this.currentPoint.set(n, i), this;
    }
    bezierCurveTo(t, e, n, i, s, o) {
      const a = new sh(this.currentPoint.clone(), new et(t, e), new et(n, i), new et(s, o));
      return this.curves.push(a), this.currentPoint.set(s, o), this;
    }
    splineThru(t) {
      const e = [
        this.currentPoint.clone()
      ].concat(t), n = new lh(e);
      return this.curves.push(n), this.currentPoint.copy(t[t.length - 1]), this;
    }
    arc(t, e, n, i, s, o) {
      const a = this.currentPoint.x, l = this.currentPoint.y;
      return this.absarc(t + a, e + l, n, i, s, o), this;
    }
    absarc(t, e, n, i, s, o) {
      return this.absellipse(t, e, n, n, i, s, o), this;
    }
    ellipse(t, e, n, i, s, o, a, l) {
      const c = this.currentPoint.x, h = this.currentPoint.y;
      return this.absellipse(t + c, e + h, n, i, s, o, a, l), this;
    }
    absellipse(t, e, n, i, s, o, a, l) {
      const c = new La(t, e, n, i, s, o, a, l);
      if (this.curves.length > 0) {
        const d = c.getPoint(0);
        d.equals(this.currentPoint) || this.lineTo(d.x, d.y);
      }
      this.curves.push(c);
      const h = c.getPoint(1);
      return this.currentPoint.copy(h), this;
    }
    copy(t) {
      return super.copy(t), this.currentPoint.copy(t.currentPoint), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.currentPoint = this.currentPoint.toArray(), t;
    }
    fromJSON(t) {
      return super.fromJSON(t), this.currentPoint.fromArray(t.currentPoint), this;
    }
  }
  class Kr extends Wt {
    constructor(t = [
      new et(0, -0.5),
      new et(0.5, 0),
      new et(0, 0.5)
    ], e = 12, n = 0, i = Math.PI * 2) {
      super(), this.type = "LatheGeometry", this.parameters = {
        points: t,
        segments: e,
        phiStart: n,
        phiLength: i
      }, e = Math.floor(e), i = de(i, 0, Math.PI * 2);
      const s = [], o = [], a = [], l = [], c = [], h = 1 / e, d = new R(), u = new et(), f = new R(), m = new R(), _ = new R();
      let g = 0, p = 0;
      for (let v = 0; v <= t.length - 1; v++) switch (v) {
        case 0:
          g = t[v + 1].x - t[v].x, p = t[v + 1].y - t[v].y, f.x = p * 1, f.y = -g, f.z = p * 0, _.copy(f), f.normalize(), l.push(f.x, f.y, f.z);
          break;
        case t.length - 1:
          l.push(_.x, _.y, _.z);
          break;
        default:
          g = t[v + 1].x - t[v].x, p = t[v + 1].y - t[v].y, f.x = p * 1, f.y = -g, f.z = p * 0, m.copy(f), f.x += _.x, f.y += _.y, f.z += _.z, f.normalize(), l.push(f.x, f.y, f.z), _.copy(m);
      }
      for (let v = 0; v <= e; v++) {
        const x = n + v * h * i, S = Math.sin(x), P = Math.cos(x);
        for (let b = 0; b <= t.length - 1; b++) {
          d.x = t[b].x * S, d.y = t[b].y, d.z = t[b].x * P, o.push(d.x, d.y, d.z), u.x = v / e, u.y = b / (t.length - 1), a.push(u.x, u.y);
          const T = l[3 * b + 0] * S, E = l[3 * b + 1], M = l[3 * b + 0] * P;
          c.push(T, E, M);
        }
      }
      for (let v = 0; v < e; v++) for (let x = 0; x < t.length - 1; x++) {
        const S = x + v * t.length, P = S, b = S + t.length, T = S + t.length + 1, E = S + 1;
        s.push(P, b, E), s.push(T, E, b);
      }
      this.setIndex(s), this.setAttribute("position", new bt(o, 3)), this.setAttribute("uv", new bt(a, 2)), this.setAttribute("normal", new bt(c, 3));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Kr(t.points, t.segments, t.phiStart, t.phiLength);
    }
  }
  class Da extends Kr {
    constructor(t = 1, e = 1, n = 4, i = 8) {
      const s = new Ji();
      s.absarc(0, -e / 2, t, Math.PI * 1.5, 0), s.absarc(0, e / 2, t, 0, Math.PI * 0.5), super(s.getPoints(n), i), this.type = "CapsuleGeometry", this.parameters = {
        radius: t,
        length: e,
        capSegments: n,
        radialSegments: i
      };
    }
    static fromJSON(t) {
      return new Da(t.radius, t.length, t.capSegments, t.radialSegments);
    }
  }
  class Ua extends Wt {
    constructor(t = 1, e = 32, n = 0, i = Math.PI * 2) {
      super(), this.type = "CircleGeometry", this.parameters = {
        radius: t,
        segments: e,
        thetaStart: n,
        thetaLength: i
      }, e = Math.max(3, e);
      const s = [], o = [], a = [], l = [], c = new R(), h = new et();
      o.push(0, 0, 0), a.push(0, 0, 1), l.push(0.5, 0.5);
      for (let d = 0, u = 3; d <= e; d++, u += 3) {
        const f = n + d / e * i;
        c.x = t * Math.cos(f), c.y = t * Math.sin(f), o.push(c.x, c.y, c.z), a.push(0, 0, 1), h.x = (o[u] / t + 1) / 2, h.y = (o[u + 1] / t + 1) / 2, l.push(h.x, h.y);
      }
      for (let d = 1; d <= e; d++) s.push(d, d + 1, 0);
      this.setIndex(s), this.setAttribute("position", new bt(o, 3)), this.setAttribute("normal", new bt(a, 3)), this.setAttribute("uv", new bt(l, 2));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Ua(t.radius, t.segments, t.thetaStart, t.thetaLength);
    }
  }
  class Ys extends Wt {
    constructor(t = 1, e = 1, n = 1, i = 32, s = 1, o = false, a = 0, l = Math.PI * 2) {
      super(), this.type = "CylinderGeometry", this.parameters = {
        radiusTop: t,
        radiusBottom: e,
        height: n,
        radialSegments: i,
        heightSegments: s,
        openEnded: o,
        thetaStart: a,
        thetaLength: l
      };
      const c = this;
      i = Math.floor(i), s = Math.floor(s);
      const h = [], d = [], u = [], f = [];
      let m = 0;
      const _ = [], g = n / 2;
      let p = 0;
      v(), o === false && (t > 0 && x(true), e > 0 && x(false)), this.setIndex(h), this.setAttribute("position", new bt(d, 3)), this.setAttribute("normal", new bt(u, 3)), this.setAttribute("uv", new bt(f, 2));
      function v() {
        const S = new R(), P = new R();
        let b = 0;
        const T = (e - t) / n;
        for (let E = 0; E <= s; E++) {
          const M = [], y = E / s, C = y * (e - t) + t;
          for (let N = 0; N <= i; N++) {
            const I = N / i, U = I * l + a, D = Math.sin(U), O = Math.cos(U);
            P.x = C * D, P.y = -y * n + g, P.z = C * O, d.push(P.x, P.y, P.z), S.set(D, T, O).normalize(), u.push(S.x, S.y, S.z), f.push(I, 1 - y), M.push(m++);
          }
          _.push(M);
        }
        for (let E = 0; E < i; E++) for (let M = 0; M < s; M++) {
          const y = _[M][E], C = _[M + 1][E], N = _[M + 1][E + 1], I = _[M][E + 1];
          h.push(y, C, I), h.push(C, N, I), b += 6;
        }
        c.addGroup(p, b, 0), p += b;
      }
      function x(S) {
        const P = m, b = new et(), T = new R();
        let E = 0;
        const M = S === true ? t : e, y = S === true ? 1 : -1;
        for (let N = 1; N <= i; N++) d.push(0, g * y, 0), u.push(0, y, 0), f.push(0.5, 0.5), m++;
        const C = m;
        for (let N = 0; N <= i; N++) {
          const U = N / i * l + a, D = Math.cos(U), O = Math.sin(U);
          T.x = M * O, T.y = g * y, T.z = M * D, d.push(T.x, T.y, T.z), u.push(0, y, 0), b.x = D * 0.5 + 0.5, b.y = O * 0.5 * y + 0.5, f.push(b.x, b.y), m++;
        }
        for (let N = 0; N < i; N++) {
          const I = P + N, U = C + N;
          S === true ? h.push(U, U + 1, I) : h.push(U + 1, U, I), E += 3;
        }
        c.addGroup(p, E, S === true ? 1 : 2), p += E;
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Ys(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
    }
  }
  class Na extends Ys {
    constructor(t = 1, e = 1, n = 32, i = 1, s = false, o = 0, a = Math.PI * 2) {
      super(0, t, e, n, i, s, o, a), this.type = "ConeGeometry", this.parameters = {
        radius: t,
        height: e,
        radialSegments: n,
        heightSegments: i,
        openEnded: s,
        thetaStart: o,
        thetaLength: a
      };
    }
    static fromJSON(t) {
      return new Na(t.radius, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
    }
  }
  class Mi extends Wt {
    constructor(t = [], e = [], n = 1, i = 0) {
      super(), this.type = "PolyhedronGeometry", this.parameters = {
        vertices: t,
        indices: e,
        radius: n,
        detail: i
      };
      const s = [], o = [];
      a(i), c(n), h(), this.setAttribute("position", new bt(s, 3)), this.setAttribute("normal", new bt(s.slice(), 3)), this.setAttribute("uv", new bt(o, 2)), i === 0 ? this.computeVertexNormals() : this.normalizeNormals();
      function a(v) {
        const x = new R(), S = new R(), P = new R();
        for (let b = 0; b < e.length; b += 3) f(e[b + 0], x), f(e[b + 1], S), f(e[b + 2], P), l(x, S, P, v);
      }
      function l(v, x, S, P) {
        const b = P + 1, T = [];
        for (let E = 0; E <= b; E++) {
          T[E] = [];
          const M = v.clone().lerp(S, E / b), y = x.clone().lerp(S, E / b), C = b - E;
          for (let N = 0; N <= C; N++) N === 0 && E === b ? T[E][N] = M : T[E][N] = M.clone().lerp(y, N / C);
        }
        for (let E = 0; E < b; E++) for (let M = 0; M < 2 * (b - E) - 1; M++) {
          const y = Math.floor(M / 2);
          M % 2 === 0 ? (u(T[E][y + 1]), u(T[E + 1][y]), u(T[E][y])) : (u(T[E][y + 1]), u(T[E + 1][y + 1]), u(T[E + 1][y]));
        }
      }
      function c(v) {
        const x = new R();
        for (let S = 0; S < s.length; S += 3) x.x = s[S + 0], x.y = s[S + 1], x.z = s[S + 2], x.normalize().multiplyScalar(v), s[S + 0] = x.x, s[S + 1] = x.y, s[S + 2] = x.z;
      }
      function h() {
        const v = new R();
        for (let x = 0; x < s.length; x += 3) {
          v.x = s[x + 0], v.y = s[x + 1], v.z = s[x + 2];
          const S = g(v) / 2 / Math.PI + 0.5, P = p(v) / Math.PI + 0.5;
          o.push(S, 1 - P);
        }
        m(), d();
      }
      function d() {
        for (let v = 0; v < o.length; v += 6) {
          const x = o[v + 0], S = o[v + 2], P = o[v + 4], b = Math.max(x, S, P), T = Math.min(x, S, P);
          b > 0.9 && T < 0.1 && (x < 0.2 && (o[v + 0] += 1), S < 0.2 && (o[v + 2] += 1), P < 0.2 && (o[v + 4] += 1));
        }
      }
      function u(v) {
        s.push(v.x, v.y, v.z);
      }
      function f(v, x) {
        const S = v * 3;
        x.x = t[S + 0], x.y = t[S + 1], x.z = t[S + 2];
      }
      function m() {
        const v = new R(), x = new R(), S = new R(), P = new R(), b = new et(), T = new et(), E = new et();
        for (let M = 0, y = 0; M < s.length; M += 9, y += 6) {
          v.set(s[M + 0], s[M + 1], s[M + 2]), x.set(s[M + 3], s[M + 4], s[M + 5]), S.set(s[M + 6], s[M + 7], s[M + 8]), b.set(o[y + 0], o[y + 1]), T.set(o[y + 2], o[y + 3]), E.set(o[y + 4], o[y + 5]), P.copy(v).add(x).add(S).divideScalar(3);
          const C = g(P);
          _(b, y + 0, v, C), _(T, y + 2, x, C), _(E, y + 4, S, C);
        }
      }
      function _(v, x, S, P) {
        P < 0 && v.x === 1 && (o[x] = v.x - 1), S.x === 0 && S.z === 0 && (o[x] = P / 2 / Math.PI + 0.5);
      }
      function g(v) {
        return Math.atan2(v.z, -v.x);
      }
      function p(v) {
        return Math.atan2(-v.y, Math.sqrt(v.x * v.x + v.z * v.z));
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Mi(t.vertices, t.indices, t.radius, t.details);
    }
  }
  class Oa extends Mi {
    constructor(t = 1, e = 0) {
      const n = (1 + Math.sqrt(5)) / 2, i = 1 / n, s = [
        -1,
        -1,
        -1,
        -1,
        -1,
        1,
        -1,
        1,
        -1,
        -1,
        1,
        1,
        1,
        -1,
        -1,
        1,
        -1,
        1,
        1,
        1,
        -1,
        1,
        1,
        1,
        0,
        -i,
        -n,
        0,
        -i,
        n,
        0,
        i,
        -n,
        0,
        i,
        n,
        -i,
        -n,
        0,
        -i,
        n,
        0,
        i,
        -n,
        0,
        i,
        n,
        0,
        -n,
        0,
        -i,
        n,
        0,
        -i,
        -n,
        0,
        i,
        n,
        0,
        i
      ], o = [
        3,
        11,
        7,
        3,
        7,
        15,
        3,
        15,
        13,
        7,
        19,
        17,
        7,
        17,
        6,
        7,
        6,
        15,
        17,
        4,
        8,
        17,
        8,
        10,
        17,
        10,
        6,
        8,
        0,
        16,
        8,
        16,
        2,
        8,
        2,
        10,
        0,
        12,
        1,
        0,
        1,
        18,
        0,
        18,
        16,
        6,
        10,
        2,
        6,
        2,
        13,
        6,
        13,
        15,
        2,
        16,
        18,
        2,
        18,
        3,
        2,
        3,
        13,
        18,
        1,
        9,
        18,
        9,
        11,
        18,
        11,
        3,
        4,
        14,
        12,
        4,
        12,
        0,
        4,
        0,
        8,
        11,
        9,
        5,
        11,
        5,
        19,
        11,
        19,
        7,
        19,
        5,
        14,
        19,
        14,
        4,
        19,
        4,
        17,
        1,
        12,
        14,
        1,
        14,
        5,
        1,
        5,
        9
      ];
      super(s, o, t, e), this.type = "DodecahedronGeometry", this.parameters = {
        radius: t,
        detail: e
      };
    }
    static fromJSON(t) {
      return new Oa(t.radius, t.detail);
    }
  }
  const Vo = new R(), Ho = new R(), Ll = new R(), Go = new en();
  class hp extends Wt {
    constructor(t = null, e = 1) {
      if (super(), this.type = "EdgesGeometry", this.parameters = {
        geometry: t,
        thresholdAngle: e
      }, t !== null) {
        const i = Math.pow(10, 4), s = Math.cos(Xi * e), o = t.getIndex(), a = t.getAttribute("position"), l = o ? o.count : a.count, c = [
          0,
          0,
          0
        ], h = [
          "a",
          "b",
          "c"
        ], d = new Array(3), u = {}, f = [];
        for (let m = 0; m < l; m += 3) {
          o ? (c[0] = o.getX(m), c[1] = o.getX(m + 1), c[2] = o.getX(m + 2)) : (c[0] = m, c[1] = m + 1, c[2] = m + 2);
          const { a: _, b: g, c: p } = Go;
          if (_.fromBufferAttribute(a, c[0]), g.fromBufferAttribute(a, c[1]), p.fromBufferAttribute(a, c[2]), Go.getNormal(Ll), d[0] = `${Math.round(_.x * i)},${Math.round(_.y * i)},${Math.round(_.z * i)}`, d[1] = `${Math.round(g.x * i)},${Math.round(g.y * i)},${Math.round(g.z * i)}`, d[2] = `${Math.round(p.x * i)},${Math.round(p.y * i)},${Math.round(p.z * i)}`, !(d[0] === d[1] || d[1] === d[2] || d[2] === d[0])) for (let v = 0; v < 3; v++) {
            const x = (v + 1) % 3, S = d[v], P = d[x], b = Go[h[v]], T = Go[h[x]], E = `${S}_${P}`, M = `${P}_${S}`;
            M in u && u[M] ? (Ll.dot(u[M].normal) <= s && (f.push(b.x, b.y, b.z), f.push(T.x, T.y, T.z)), u[M] = null) : E in u || (u[E] = {
              index0: c[v],
              index1: c[x],
              normal: Ll.clone()
            });
          }
        }
        for (const m in u) if (u[m]) {
          const { index0: _, index1: g } = u[m];
          Vo.fromBufferAttribute(a, _), Ho.fromBufferAttribute(a, g), f.push(Vo.x, Vo.y, Vo.z), f.push(Ho.x, Ho.y, Ho.z);
        }
        this.setAttribute("position", new bt(f, 3));
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
  }
  class Ae extends Ji {
    constructor(t) {
      super(t), this.uuid = sn(), this.type = "Shape", this.holes = [];
    }
    getPointsHoles(t) {
      const e = [];
      for (let n = 0, i = this.holes.length; n < i; n++) e[n] = this.holes[n].getPoints(t);
      return e;
    }
    extractPoints(t) {
      return {
        shape: this.getPoints(t),
        holes: this.getPointsHoles(t)
      };
    }
    copy(t) {
      super.copy(t), this.holes = [];
      for (let e = 0, n = t.holes.length; e < n; e++) {
        const i = t.holes[e];
        this.holes.push(i.clone());
      }
      return this;
    }
    toJSON() {
      const t = super.toJSON();
      t.uuid = this.uuid, t.holes = [];
      for (let e = 0, n = this.holes.length; e < n; e++) {
        const i = this.holes[e];
        t.holes.push(i.toJSON());
      }
      return t;
    }
    fromJSON(t) {
      super.fromJSON(t), this.uuid = t.uuid, this.holes = [];
      for (let e = 0, n = t.holes.length; e < n; e++) {
        const i = t.holes[e];
        this.holes.push(new Ji().fromJSON(i));
      }
      return this;
    }
  }
  const Gy = {
    triangulate: function(r, t, e = 2) {
      const n = t && t.length, i = n ? t[0] * e : r.length;
      let s = up(r, 0, i, e, true);
      const o = [];
      if (!s || s.next === s.prev) return o;
      let a, l, c, h, d, u, f;
      if (n && (s = $y(r, t, s, e)), r.length > 80 * e) {
        a = c = r[0], l = h = r[1];
        for (let m = e; m < i; m += e) d = r[m], u = r[m + 1], d < a && (a = d), u < l && (l = u), d > c && (c = d), u > h && (h = u);
        f = Math.max(c - a, h - l), f = f !== 0 ? 32767 / f : 0;
      }
      return Or(s, o, e, a, l, f, 0), o;
    }
  };
  function up(r, t, e, n, i) {
    let s, o;
    if (i === rM(r, t, e, n) > 0) for (s = t; s < e; s += n) o = Vu(s, r[s], r[s + 1], o);
    else for (s = e - n; s >= t; s -= n) o = Vu(s, r[s], r[s + 1], o);
    return o && za(o, o.next) && (Fr(o), o = o.next), o;
  }
  function Ki(r, t) {
    if (!r) return r;
    t || (t = r);
    let e = r, n;
    do
      if (n = false, !e.steiner && (za(e, e.next) || ce(e.prev, e, e.next) === 0)) {
        if (Fr(e), e = t = e.prev, e === e.next) break;
        n = true;
      } else e = e.next;
    while (n || e !== t);
    return t;
  }
  function Or(r, t, e, n, i, s, o) {
    if (!r) return;
    !o && s && jy(r, n, i, s);
    let a = r, l, c;
    for (; r.prev !== r.next; ) {
      if (l = r.prev, c = r.next, s ? Xy(r, n, i, s) : Wy(r)) {
        t.push(l.i / e | 0), t.push(r.i / e | 0), t.push(c.i / e | 0), Fr(r), r = c.next, a = c.next;
        continue;
      }
      if (r = c, r === a) {
        o ? o === 1 ? (r = Yy(Ki(r), t, e), Or(r, t, e, n, i, s, 2)) : o === 2 && qy(r, t, e, n, i, s) : Or(Ki(r), t, e, n, i, s, 1);
        break;
      }
    }
  }
  function Wy(r) {
    const t = r.prev, e = r, n = r.next;
    if (ce(t, e, n) >= 0) return false;
    const i = t.x, s = e.x, o = n.x, a = t.y, l = e.y, c = n.y, h = i < s ? i < o ? i : o : s < o ? s : o, d = a < l ? a < c ? a : c : l < c ? l : c, u = i > s ? i > o ? i : o : s > o ? s : o, f = a > l ? a > c ? a : c : l > c ? l : c;
    let m = n.next;
    for (; m !== t; ) {
      if (m.x >= h && m.x <= u && m.y >= d && m.y <= f && Ps(i, a, s, l, o, c, m.x, m.y) && ce(m.prev, m, m.next) >= 0) return false;
      m = m.next;
    }
    return true;
  }
  function Xy(r, t, e, n) {
    const i = r.prev, s = r, o = r.next;
    if (ce(i, s, o) >= 0) return false;
    const a = i.x, l = s.x, c = o.x, h = i.y, d = s.y, u = o.y, f = a < l ? a < c ? a : c : l < c ? l : c, m = h < d ? h < u ? h : u : d < u ? d : u, _ = a > l ? a > c ? a : c : l > c ? l : c, g = h > d ? h > u ? h : u : d > u ? d : u, p = Sc(f, m, t, e, n), v = Sc(_, g, t, e, n);
    let x = r.prevZ, S = r.nextZ;
    for (; x && x.z >= p && S && S.z <= v; ) {
      if (x.x >= f && x.x <= _ && x.y >= m && x.y <= g && x !== i && x !== o && Ps(a, h, l, d, c, u, x.x, x.y) && ce(x.prev, x, x.next) >= 0 || (x = x.prevZ, S.x >= f && S.x <= _ && S.y >= m && S.y <= g && S !== i && S !== o && Ps(a, h, l, d, c, u, S.x, S.y) && ce(S.prev, S, S.next) >= 0)) return false;
      S = S.nextZ;
    }
    for (; x && x.z >= p; ) {
      if (x.x >= f && x.x <= _ && x.y >= m && x.y <= g && x !== i && x !== o && Ps(a, h, l, d, c, u, x.x, x.y) && ce(x.prev, x, x.next) >= 0) return false;
      x = x.prevZ;
    }
    for (; S && S.z <= v; ) {
      if (S.x >= f && S.x <= _ && S.y >= m && S.y <= g && S !== i && S !== o && Ps(a, h, l, d, c, u, S.x, S.y) && ce(S.prev, S, S.next) >= 0) return false;
      S = S.nextZ;
    }
    return true;
  }
  function Yy(r, t, e) {
    let n = r;
    do {
      const i = n.prev, s = n.next.next;
      !za(i, s) && dp(i, n, n.next, s) && zr(i, s) && zr(s, i) && (t.push(i.i / e | 0), t.push(n.i / e | 0), t.push(s.i / e | 0), Fr(n), Fr(n.next), n = r = s), n = n.next;
    } while (n !== r);
    return Ki(n);
  }
  function qy(r, t, e, n, i, s) {
    let o = r;
    do {
      let a = o.next.next;
      for (; a !== o.prev; ) {
        if (o.i !== a.i && nM(o, a)) {
          let l = fp(o, a);
          o = Ki(o, o.next), l = Ki(l, l.next), Or(o, t, e, n, i, s, 0), Or(l, t, e, n, i, s, 0);
          return;
        }
        a = a.next;
      }
      o = o.next;
    } while (o !== r);
  }
  function $y(r, t, e, n) {
    const i = [];
    let s, o, a, l, c;
    for (s = 0, o = t.length; s < o; s++) a = t[s] * n, l = s < o - 1 ? t[s + 1] * n : r.length, c = up(r, a, l, n, false), c === c.next && (c.steiner = true), i.push(eM(c));
    for (i.sort(Zy), s = 0; s < i.length; s++) e = Jy(i[s], e);
    return e;
  }
  function Zy(r, t) {
    return r.x - t.x;
  }
  function Jy(r, t) {
    const e = Ky(r, t);
    if (!e) return t;
    const n = fp(e, r);
    return Ki(n, n.next), Ki(e, e.next);
  }
  function Ky(r, t) {
    let e = t, n = -1 / 0, i;
    const s = r.x, o = r.y;
    do {
      if (o <= e.y && o >= e.next.y && e.next.y !== e.y) {
        const u = e.x + (o - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
        if (u <= s && u > n && (n = u, i = e.x < e.next.x ? e : e.next, u === s)) return i;
      }
      e = e.next;
    } while (e !== t);
    if (!i) return null;
    const a = i, l = i.x, c = i.y;
    let h = 1 / 0, d;
    e = i;
    do
      s >= e.x && e.x >= l && s !== e.x && Ps(o < c ? s : n, o, l, c, o < c ? n : s, o, e.x, e.y) && (d = Math.abs(o - e.y) / (s - e.x), zr(e, r) && (d < h || d === h && (e.x > i.x || e.x === i.x && Qy(i, e))) && (i = e, h = d)), e = e.next;
    while (e !== a);
    return i;
  }
  function Qy(r, t) {
    return ce(r.prev, r, t.prev) < 0 && ce(t.next, r, r.next) < 0;
  }
  function jy(r, t, e, n) {
    let i = r;
    do
      i.z === 0 && (i.z = Sc(i.x, i.y, t, e, n)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
    while (i !== r);
    i.prevZ.nextZ = null, i.prevZ = null, tM(i);
  }
  function tM(r) {
    let t, e, n, i, s, o, a, l, c = 1;
    do {
      for (e = r, r = null, s = null, o = 0; e; ) {
        for (o++, n = e, a = 0, t = 0; t < c && (a++, n = n.nextZ, !!n); t++) ;
        for (l = c; a > 0 || l > 0 && n; ) a !== 0 && (l === 0 || !n || e.z <= n.z) ? (i = e, e = e.nextZ, a--) : (i = n, n = n.nextZ, l--), s ? s.nextZ = i : r = i, i.prevZ = s, s = i;
        e = n;
      }
      s.nextZ = null, c *= 2;
    } while (o > 1);
    return r;
  }
  function Sc(r, t, e, n, i) {
    return r = (r - e) * i | 0, t = (t - n) * i | 0, r = (r | r << 8) & 16711935, r = (r | r << 4) & 252645135, r = (r | r << 2) & 858993459, r = (r | r << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, r | t << 1;
  }
  function eM(r) {
    let t = r, e = r;
    do
      (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
    while (t !== r);
    return e;
  }
  function Ps(r, t, e, n, i, s, o, a) {
    return (i - o) * (t - a) >= (r - o) * (s - a) && (r - o) * (n - a) >= (e - o) * (t - a) && (e - o) * (s - a) >= (i - o) * (n - a);
  }
  function nM(r, t) {
    return r.next.i !== t.i && r.prev.i !== t.i && !iM(r, t) && (zr(r, t) && zr(t, r) && sM(r, t) && (ce(r.prev, r, t.prev) || ce(r, t.prev, t)) || za(r, t) && ce(r.prev, r, r.next) > 0 && ce(t.prev, t, t.next) > 0);
  }
  function ce(r, t, e) {
    return (t.y - r.y) * (e.x - t.x) - (t.x - r.x) * (e.y - t.y);
  }
  function za(r, t) {
    return r.x === t.x && r.y === t.y;
  }
  function dp(r, t, e, n) {
    const i = Xo(ce(r, t, e)), s = Xo(ce(r, t, n)), o = Xo(ce(e, n, r)), a = Xo(ce(e, n, t));
    return !!(i !== s && o !== a || i === 0 && Wo(r, e, t) || s === 0 && Wo(r, n, t) || o === 0 && Wo(e, r, n) || a === 0 && Wo(e, t, n));
  }
  function Wo(r, t, e) {
    return t.x <= Math.max(r.x, e.x) && t.x >= Math.min(r.x, e.x) && t.y <= Math.max(r.y, e.y) && t.y >= Math.min(r.y, e.y);
  }
  function Xo(r) {
    return r > 0 ? 1 : r < 0 ? -1 : 0;
  }
  function iM(r, t) {
    let e = r;
    do {
      if (e.i !== r.i && e.next.i !== r.i && e.i !== t.i && e.next.i !== t.i && dp(e, e.next, r, t)) return true;
      e = e.next;
    } while (e !== r);
    return false;
  }
  function zr(r, t) {
    return ce(r.prev, r, r.next) < 0 ? ce(r, t, r.next) >= 0 && ce(r, r.prev, t) >= 0 : ce(r, t, r.prev) < 0 || ce(r, r.next, t) < 0;
  }
  function sM(r, t) {
    let e = r, n = false;
    const i = (r.x + t.x) / 2, s = (r.y + t.y) / 2;
    do
      e.y > s != e.next.y > s && e.next.y !== e.y && i < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
    while (e !== r);
    return n;
  }
  function fp(r, t) {
    const e = new bc(r.i, r.x, r.y), n = new bc(t.i, t.x, t.y), i = r.next, s = t.prev;
    return r.next = t, t.prev = r, e.next = i, i.prev = e, n.next = e, e.prev = n, s.next = n, n.prev = s, n;
  }
  function Vu(r, t, e, n) {
    const i = new bc(r, t, e);
    return n ? (i.next = n.next, i.prev = n, n.next.prev = i, n.next = i) : (i.prev = i, i.next = i), i;
  }
  function Fr(r) {
    r.next.prev = r.prev, r.prev.next = r.next, r.prevZ && (r.prevZ.nextZ = r.nextZ), r.nextZ && (r.nextZ.prevZ = r.prevZ);
  }
  function bc(r, t, e) {
    this.i = r, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = false;
  }
  function rM(r, t, e, n) {
    let i = 0;
    for (let s = t, o = e - n; s < e; s += n) i += (r[o] - r[s]) * (r[s + 1] + r[o + 1]), o = s;
    return i;
  }
  class Pn {
    static area(t) {
      const e = t.length;
      let n = 0;
      for (let i = e - 1, s = 0; s < e; i = s++) n += t[i].x * t[s].y - t[s].x * t[i].y;
      return n * 0.5;
    }
    static isClockWise(t) {
      return Pn.area(t) < 0;
    }
    static triangulateShape(t, e) {
      const n = [], i = [], s = [];
      Hu(t), Gu(n, t);
      let o = t.length;
      e.forEach(Hu);
      for (let l = 0; l < e.length; l++) i.push(o), o += e[l].length, Gu(n, e[l]);
      const a = Gy.triangulate(n, i);
      for (let l = 0; l < a.length; l += 3) s.push(a.slice(l, l + 3));
      return s;
    }
  }
  function Hu(r) {
    const t = r.length;
    t > 2 && r[t - 1].equals(r[0]) && r.pop();
  }
  function Gu(r, t) {
    for (let e = 0; e < t.length; e++) r.push(t[e].x), r.push(t[e].y);
  }
  class Qe extends Wt {
    constructor(t = new Ae([
      new et(0.5, 0.5),
      new et(-0.5, 0.5),
      new et(-0.5, -0.5),
      new et(0.5, -0.5)
    ]), e = {}) {
      super(), this.type = "ExtrudeGeometry", this.parameters = {
        shapes: t,
        options: e
      }, t = Array.isArray(t) ? t : [
        t
      ];
      const n = this, i = [], s = [];
      for (let a = 0, l = t.length; a < l; a++) {
        const c = t[a];
        o(c);
      }
      this.setAttribute("position", new bt(i, 3)), this.setAttribute("uv", new bt(s, 2)), this.computeVertexNormals();
      function o(a) {
        const l = [], c = e.curveSegments !== void 0 ? e.curveSegments : 12, h = e.steps !== void 0 ? e.steps : 1, d = e.depth !== void 0 ? e.depth : 1;
        let u = e.bevelEnabled !== void 0 ? e.bevelEnabled : true, f = e.bevelThickness !== void 0 ? e.bevelThickness : 0.2, m = e.bevelSize !== void 0 ? e.bevelSize : f - 0.1, _ = e.bevelOffset !== void 0 ? e.bevelOffset : 0, g = e.bevelSegments !== void 0 ? e.bevelSegments : 3;
        const p = e.extrudePath, v = e.UVGenerator !== void 0 ? e.UVGenerator : oM;
        let x, S = false, P, b, T, E;
        p && (x = p.getSpacedPoints(h), S = true, u = false, P = p.computeFrenetFrames(h, false), b = new R(), T = new R(), E = new R()), u || (g = 0, f = 0, m = 0, _ = 0);
        const M = a.extractPoints(c);
        let y = M.shape;
        const C = M.holes;
        if (!Pn.isClockWise(y)) {
          y = y.reverse();
          for (let Z = 0, j = C.length; Z < j; Z++) {
            const K = C[Z];
            Pn.isClockWise(K) && (C[Z] = K.reverse());
          }
        }
        const I = Pn.triangulateShape(y, C), U = y;
        for (let Z = 0, j = C.length; Z < j; Z++) {
          const K = C[Z];
          y = y.concat(K);
        }
        function D(Z, j, K) {
          return j || console.error("THREE.ExtrudeGeometry: vec does not exist"), Z.clone().addScaledVector(j, K);
        }
        const O = y.length, H = I.length;
        function z(Z, j, K) {
          let lt, it, vt;
          const It = Z.x - j.x, L = Z.y - j.y, w = K.x - Z.x, G = K.y - Z.y, tt = It * It + L * L, ot = It * G - L * w;
          if (Math.abs(ot) > Number.EPSILON) {
            const st = Math.sqrt(tt), Lt = Math.sqrt(w * w + G * G), pt = j.x - L / st, ft = j.y + It / st, Vt = K.x - G / Lt, ct = K.y + w / Lt, Rt = ((Vt - pt) * G - (ct - ft) * w) / (It * G - L * w);
            lt = pt + It * Rt - Z.x, it = ft + L * Rt - Z.y;
            const Zt = lt * lt + it * it;
            if (Zt <= 2) return new et(lt, it);
            vt = Math.sqrt(Zt / 2);
          } else {
            let st = false;
            It > Number.EPSILON ? w > Number.EPSILON && (st = true) : It < -Number.EPSILON ? w < -Number.EPSILON && (st = true) : Math.sign(L) === Math.sign(G) && (st = true), st ? (lt = -L, it = It, vt = Math.sqrt(tt)) : (lt = It, it = L, vt = Math.sqrt(tt / 2));
          }
          return new et(lt / vt, it / vt);
        }
        const F = [];
        for (let Z = 0, j = U.length, K = j - 1, lt = Z + 1; Z < j; Z++, K++, lt++) K === j && (K = 0), lt === j && (lt = 0), F[Z] = z(U[Z], U[K], U[lt]);
        const Y = [];
        let nt, dt = F.concat();
        for (let Z = 0, j = C.length; Z < j; Z++) {
          const K = C[Z];
          nt = [];
          for (let lt = 0, it = K.length, vt = it - 1, It = lt + 1; lt < it; lt++, vt++, It++) vt === it && (vt = 0), It === it && (It = 0), nt[lt] = z(K[lt], K[vt], K[It]);
          Y.push(nt), dt = dt.concat(nt);
        }
        for (let Z = 0; Z < g; Z++) {
          const j = Z / g, K = f * Math.cos(j * Math.PI / 2), lt = m * Math.sin(j * Math.PI / 2) + _;
          for (let it = 0, vt = U.length; it < vt; it++) {
            const It = D(U[it], F[it], lt);
            J(It.x, It.y, -K);
          }
          for (let it = 0, vt = C.length; it < vt; it++) {
            const It = C[it];
            nt = Y[it];
            for (let L = 0, w = It.length; L < w; L++) {
              const G = D(It[L], nt[L], lt);
              J(G.x, G.y, -K);
            }
          }
        }
        const Et = m + _;
        for (let Z = 0; Z < O; Z++) {
          const j = u ? D(y[Z], dt[Z], Et) : y[Z];
          S ? (T.copy(P.normals[0]).multiplyScalar(j.x), b.copy(P.binormals[0]).multiplyScalar(j.y), E.copy(x[0]).add(T).add(b), J(E.x, E.y, E.z)) : J(j.x, j.y, 0);
        }
        for (let Z = 1; Z <= h; Z++) for (let j = 0; j < O; j++) {
          const K = u ? D(y[j], dt[j], Et) : y[j];
          S ? (T.copy(P.normals[Z]).multiplyScalar(K.x), b.copy(P.binormals[Z]).multiplyScalar(K.y), E.copy(x[Z]).add(T).add(b), J(E.x, E.y, E.z)) : J(K.x, K.y, d / h * Z);
        }
        for (let Z = g - 1; Z >= 0; Z--) {
          const j = Z / g, K = f * Math.cos(j * Math.PI / 2), lt = m * Math.sin(j * Math.PI / 2) + _;
          for (let it = 0, vt = U.length; it < vt; it++) {
            const It = D(U[it], F[it], lt);
            J(It.x, It.y, d + K);
          }
          for (let it = 0, vt = C.length; it < vt; it++) {
            const It = C[it];
            nt = Y[it];
            for (let L = 0, w = It.length; L < w; L++) {
              const G = D(It[L], nt[L], lt);
              S ? J(G.x, G.y + x[h - 1].y, x[h - 1].x + K) : J(G.x, G.y, d + K);
            }
          }
        }
        q(), at();
        function q() {
          const Z = i.length / 3;
          if (u) {
            let j = 0, K = O * j;
            for (let lt = 0; lt < H; lt++) {
              const it = I[lt];
              wt(it[2] + K, it[1] + K, it[0] + K);
            }
            j = h + g * 2, K = O * j;
            for (let lt = 0; lt < H; lt++) {
              const it = I[lt];
              wt(it[0] + K, it[1] + K, it[2] + K);
            }
          } else {
            for (let j = 0; j < H; j++) {
              const K = I[j];
              wt(K[2], K[1], K[0]);
            }
            for (let j = 0; j < H; j++) {
              const K = I[j];
              wt(K[0] + O * h, K[1] + O * h, K[2] + O * h);
            }
          }
          n.addGroup(Z, i.length / 3 - Z, 0);
        }
        function at() {
          const Z = i.length / 3;
          let j = 0;
          _t(U, j), j += U.length;
          for (let K = 0, lt = C.length; K < lt; K++) {
            const it = C[K];
            _t(it, j), j += it.length;
          }
          n.addGroup(Z, i.length / 3 - Z, 1);
        }
        function _t(Z, j) {
          let K = Z.length;
          for (; --K >= 0; ) {
            const lt = K;
            let it = K - 1;
            it < 0 && (it = Z.length - 1);
            for (let vt = 0, It = h + g * 2; vt < It; vt++) {
              const L = O * vt, w = O * (vt + 1), G = j + lt + L, tt = j + it + L, ot = j + it + w, st = j + lt + w;
              Pt(G, tt, ot, st);
            }
          }
        }
        function J(Z, j, K) {
          l.push(Z), l.push(j), l.push(K);
        }
        function wt(Z, j, K) {
          B(Z), B(j), B(K);
          const lt = i.length / 3, it = v.generateTopUV(n, i, lt - 3, lt - 2, lt - 1);
          Ot(it[0]), Ot(it[1]), Ot(it[2]);
        }
        function Pt(Z, j, K, lt) {
          B(Z), B(j), B(lt), B(j), B(K), B(lt);
          const it = i.length / 3, vt = v.generateSideWallUV(n, i, it - 6, it - 3, it - 2, it - 1);
          Ot(vt[0]), Ot(vt[1]), Ot(vt[3]), Ot(vt[1]), Ot(vt[2]), Ot(vt[3]);
        }
        function B(Z) {
          i.push(l[Z * 3 + 0]), i.push(l[Z * 3 + 1]), i.push(l[Z * 3 + 2]);
        }
        function Ot(Z) {
          s.push(Z.x), s.push(Z.y);
        }
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    toJSON() {
      const t = super.toJSON(), e = this.parameters.shapes, n = this.parameters.options;
      return aM(e, n, t);
    }
    static fromJSON(t, e) {
      const n = [];
      for (let s = 0, o = t.shapes.length; s < o; s++) {
        const a = e[t.shapes[s]];
        n.push(a);
      }
      const i = t.options.extrudePath;
      return i !== void 0 && (t.options.extrudePath = new ua[i.type]().fromJSON(i)), new Qe(n, t.options);
    }
  }
  const oM = {
    generateTopUV: function(r, t, e, n, i) {
      const s = t[e * 3], o = t[e * 3 + 1], a = t[n * 3], l = t[n * 3 + 1], c = t[i * 3], h = t[i * 3 + 1];
      return [
        new et(s, o),
        new et(a, l),
        new et(c, h)
      ];
    },
    generateSideWallUV: function(r, t, e, n, i, s) {
      const o = t[e * 3], a = t[e * 3 + 1], l = t[e * 3 + 2], c = t[n * 3], h = t[n * 3 + 1], d = t[n * 3 + 2], u = t[i * 3], f = t[i * 3 + 1], m = t[i * 3 + 2], _ = t[s * 3], g = t[s * 3 + 1], p = t[s * 3 + 2];
      return Math.abs(a - h) < Math.abs(o - c) ? [
        new et(o, 1 - l),
        new et(c, 1 - d),
        new et(u, 1 - m),
        new et(_, 1 - p)
      ] : [
        new et(a, 1 - l),
        new et(h, 1 - d),
        new et(f, 1 - m),
        new et(g, 1 - p)
      ];
    }
  };
  function aM(r, t, e) {
    if (e.shapes = [], Array.isArray(r)) for (let n = 0, i = r.length; n < i; n++) {
      const s = r[n];
      e.shapes.push(s.uuid);
    }
    else e.shapes.push(r.uuid);
    return e.options = Object.assign({}, t), t.extrudePath !== void 0 && (e.options.extrudePath = t.extrudePath.toJSON()), e;
  }
  class Fa extends Mi {
    constructor(t = 1, e = 0) {
      const n = (1 + Math.sqrt(5)) / 2, i = [
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        0,
        0,
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        n,
        0,
        -1,
        n,
        0,
        1,
        -n,
        0,
        -1,
        -n,
        0,
        1
      ], s = [
        0,
        11,
        5,
        0,
        5,
        1,
        0,
        1,
        7,
        0,
        7,
        10,
        0,
        10,
        11,
        1,
        5,
        9,
        5,
        11,
        4,
        11,
        10,
        2,
        10,
        7,
        6,
        7,
        1,
        8,
        3,
        9,
        4,
        3,
        4,
        2,
        3,
        2,
        6,
        3,
        6,
        8,
        3,
        8,
        9,
        4,
        9,
        5,
        2,
        4,
        11,
        6,
        2,
        10,
        8,
        6,
        7,
        9,
        8,
        1
      ];
      super(i, s, t, e), this.type = "IcosahedronGeometry", this.parameters = {
        radius: t,
        detail: e
      };
    }
    static fromJSON(t) {
      return new Fa(t.radius, t.detail);
    }
  }
  class Qr extends Mi {
    constructor(t = 1, e = 0) {
      const n = [
        1,
        0,
        0,
        -1,
        0,
        0,
        0,
        1,
        0,
        0,
        -1,
        0,
        0,
        0,
        1,
        0,
        0,
        -1
      ], i = [
        0,
        2,
        4,
        0,
        4,
        3,
        0,
        3,
        5,
        0,
        5,
        2,
        1,
        2,
        5,
        1,
        5,
        3,
        1,
        3,
        4,
        1,
        4,
        2
      ];
      super(n, i, t, e), this.type = "OctahedronGeometry", this.parameters = {
        radius: t,
        detail: e
      };
    }
    static fromJSON(t) {
      return new Qr(t.radius, t.detail);
    }
  }
  class Ba extends Wt {
    constructor(t = 0.5, e = 1, n = 32, i = 1, s = 0, o = Math.PI * 2) {
      super(), this.type = "RingGeometry", this.parameters = {
        innerRadius: t,
        outerRadius: e,
        thetaSegments: n,
        phiSegments: i,
        thetaStart: s,
        thetaLength: o
      }, n = Math.max(3, n), i = Math.max(1, i);
      const a = [], l = [], c = [], h = [];
      let d = t;
      const u = (e - t) / i, f = new R(), m = new et();
      for (let _ = 0; _ <= i; _++) {
        for (let g = 0; g <= n; g++) {
          const p = s + g / n * o;
          f.x = d * Math.cos(p), f.y = d * Math.sin(p), l.push(f.x, f.y, f.z), c.push(0, 0, 1), m.x = (f.x / e + 1) / 2, m.y = (f.y / e + 1) / 2, h.push(m.x, m.y);
        }
        d += u;
      }
      for (let _ = 0; _ < i; _++) {
        const g = _ * (n + 1);
        for (let p = 0; p < n; p++) {
          const v = p + g, x = v, S = v + n + 1, P = v + n + 2, b = v + 1;
          a.push(x, S, b), a.push(S, P, b);
        }
      }
      this.setIndex(a), this.setAttribute("position", new bt(l, 3)), this.setAttribute("normal", new bt(c, 3)), this.setAttribute("uv", new bt(h, 2));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Ba(t.innerRadius, t.outerRadius, t.thetaSegments, t.phiSegments, t.thetaStart, t.thetaLength);
    }
  }
  class jr extends Wt {
    constructor(t = new Ae([
      new et(0, 0.5),
      new et(-0.5, -0.5),
      new et(0.5, -0.5)
    ]), e = 12) {
      super(), this.type = "ShapeGeometry", this.parameters = {
        shapes: t,
        curveSegments: e
      };
      const n = [], i = [], s = [], o = [];
      let a = 0, l = 0;
      if (Array.isArray(t) === false) c(t);
      else for (let h = 0; h < t.length; h++) c(t[h]), this.addGroup(a, l, h), a += l, l = 0;
      this.setIndex(n), this.setAttribute("position", new bt(i, 3)), this.setAttribute("normal", new bt(s, 3)), this.setAttribute("uv", new bt(o, 2));
      function c(h) {
        const d = i.length / 3, u = h.extractPoints(e);
        let f = u.shape;
        const m = u.holes;
        Pn.isClockWise(f) === false && (f = f.reverse());
        for (let g = 0, p = m.length; g < p; g++) {
          const v = m[g];
          Pn.isClockWise(v) === true && (m[g] = v.reverse());
        }
        const _ = Pn.triangulateShape(f, m);
        for (let g = 0, p = m.length; g < p; g++) {
          const v = m[g];
          f = f.concat(v);
        }
        for (let g = 0, p = f.length; g < p; g++) {
          const v = f[g];
          i.push(v.x, v.y, 0), s.push(0, 0, 1), o.push(v.x, v.y);
        }
        for (let g = 0, p = _.length; g < p; g++) {
          const v = _[g], x = v[0] + d, S = v[1] + d, P = v[2] + d;
          n.push(x, S, P), l += 3;
        }
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    toJSON() {
      const t = super.toJSON(), e = this.parameters.shapes;
      return lM(e, t);
    }
    static fromJSON(t, e) {
      const n = [];
      for (let i = 0, s = t.shapes.length; i < s; i++) {
        const o = e[t.shapes[i]];
        n.push(o);
      }
      return new jr(n, t.curveSegments);
    }
  }
  function lM(r, t) {
    if (t.shapes = [], Array.isArray(r)) for (let e = 0, n = r.length; e < n; e++) {
      const i = r[e];
      t.shapes.push(i.uuid);
    }
    else t.shapes.push(r.uuid);
    return t;
  }
  class to extends Wt {
    constructor(t = 1, e = 32, n = 16, i = 0, s = Math.PI * 2, o = 0, a = Math.PI) {
      super(), this.type = "SphereGeometry", this.parameters = {
        radius: t,
        widthSegments: e,
        heightSegments: n,
        phiStart: i,
        phiLength: s,
        thetaStart: o,
        thetaLength: a
      }, e = Math.max(3, Math.floor(e)), n = Math.max(2, Math.floor(n));
      const l = Math.min(o + a, Math.PI);
      let c = 0;
      const h = [], d = new R(), u = new R(), f = [], m = [], _ = [], g = [];
      for (let p = 0; p <= n; p++) {
        const v = [], x = p / n;
        let S = 0;
        p === 0 && o === 0 ? S = 0.5 / e : p === n && l === Math.PI && (S = -0.5 / e);
        for (let P = 0; P <= e; P++) {
          const b = P / e;
          d.x = -t * Math.cos(i + b * s) * Math.sin(o + x * a), d.y = t * Math.cos(o + x * a), d.z = t * Math.sin(i + b * s) * Math.sin(o + x * a), m.push(d.x, d.y, d.z), u.copy(d).normalize(), _.push(u.x, u.y, u.z), g.push(b + S, 1 - x), v.push(c++);
        }
        h.push(v);
      }
      for (let p = 0; p < n; p++) for (let v = 0; v < e; v++) {
        const x = h[p][v + 1], S = h[p][v], P = h[p + 1][v], b = h[p + 1][v + 1];
        (p !== 0 || o > 0) && f.push(x, S, b), (p !== n - 1 || l < Math.PI) && f.push(S, P, b);
      }
      this.setIndex(f), this.setAttribute("position", new bt(m, 3)), this.setAttribute("normal", new bt(_, 3)), this.setAttribute("uv", new bt(g, 2));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new to(t.radius, t.widthSegments, t.heightSegments, t.phiStart, t.phiLength, t.thetaStart, t.thetaLength);
    }
  }
  class ka extends Mi {
    constructor(t = 1, e = 0) {
      const n = [
        1,
        1,
        1,
        -1,
        -1,
        1,
        -1,
        1,
        -1,
        1,
        -1,
        -1
      ], i = [
        2,
        1,
        0,
        0,
        3,
        2,
        1,
        3,
        0,
        2,
        3,
        1
      ];
      super(n, i, t, e), this.type = "TetrahedronGeometry", this.parameters = {
        radius: t,
        detail: e
      };
    }
    static fromJSON(t) {
      return new ka(t.radius, t.detail);
    }
  }
  class Va extends Wt {
    constructor(t = 1, e = 0.4, n = 12, i = 48, s = Math.PI * 2) {
      super(), this.type = "TorusGeometry", this.parameters = {
        radius: t,
        tube: e,
        radialSegments: n,
        tubularSegments: i,
        arc: s
      }, n = Math.floor(n), i = Math.floor(i);
      const o = [], a = [], l = [], c = [], h = new R(), d = new R(), u = new R();
      for (let f = 0; f <= n; f++) for (let m = 0; m <= i; m++) {
        const _ = m / i * s, g = f / n * Math.PI * 2;
        d.x = (t + e * Math.cos(g)) * Math.cos(_), d.y = (t + e * Math.cos(g)) * Math.sin(_), d.z = e * Math.sin(g), a.push(d.x, d.y, d.z), h.x = t * Math.cos(_), h.y = t * Math.sin(_), u.subVectors(d, h).normalize(), l.push(u.x, u.y, u.z), c.push(m / i), c.push(f / n);
      }
      for (let f = 1; f <= n; f++) for (let m = 1; m <= i; m++) {
        const _ = (i + 1) * f + m - 1, g = (i + 1) * (f - 1) + m - 1, p = (i + 1) * (f - 1) + m, v = (i + 1) * f + m;
        o.push(_, g, v), o.push(g, p, v);
      }
      this.setIndex(o), this.setAttribute("position", new bt(a, 3)), this.setAttribute("normal", new bt(l, 3)), this.setAttribute("uv", new bt(c, 2));
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Va(t.radius, t.tube, t.radialSegments, t.tubularSegments, t.arc);
    }
  }
  class Ha extends Wt {
    constructor(t = 1, e = 0.4, n = 64, i = 8, s = 2, o = 3) {
      super(), this.type = "TorusKnotGeometry", this.parameters = {
        radius: t,
        tube: e,
        tubularSegments: n,
        radialSegments: i,
        p: s,
        q: o
      }, n = Math.floor(n), i = Math.floor(i);
      const a = [], l = [], c = [], h = [], d = new R(), u = new R(), f = new R(), m = new R(), _ = new R(), g = new R(), p = new R();
      for (let x = 0; x <= n; ++x) {
        const S = x / n * s * Math.PI * 2;
        v(S, s, o, t, f), v(S + 0.01, s, o, t, m), g.subVectors(m, f), p.addVectors(m, f), _.crossVectors(g, p), p.crossVectors(_, g), _.normalize(), p.normalize();
        for (let P = 0; P <= i; ++P) {
          const b = P / i * Math.PI * 2, T = -e * Math.cos(b), E = e * Math.sin(b);
          d.x = f.x + (T * p.x + E * _.x), d.y = f.y + (T * p.y + E * _.y), d.z = f.z + (T * p.z + E * _.z), l.push(d.x, d.y, d.z), u.subVectors(d, f).normalize(), c.push(u.x, u.y, u.z), h.push(x / n), h.push(P / i);
        }
      }
      for (let x = 1; x <= n; x++) for (let S = 1; S <= i; S++) {
        const P = (i + 1) * (x - 1) + (S - 1), b = (i + 1) * x + (S - 1), T = (i + 1) * x + S, E = (i + 1) * (x - 1) + S;
        a.push(P, b, E), a.push(b, T, E);
      }
      this.setIndex(a), this.setAttribute("position", new bt(l, 3)), this.setAttribute("normal", new bt(c, 3)), this.setAttribute("uv", new bt(h, 2));
      function v(x, S, P, b, T) {
        const E = Math.cos(x), M = Math.sin(x), y = P / S * x, C = Math.cos(y);
        T.x = b * (2 + C) * 0.5 * E, T.y = b * (2 + C) * M * 0.5, T.z = b * Math.sin(y) * 0.5;
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    static fromJSON(t) {
      return new Ha(t.radius, t.tube, t.tubularSegments, t.radialSegments, t.p, t.q);
    }
  }
  class Ga extends Wt {
    constructor(t = new ah(new R(-1, -1, 0), new R(-1, 1, 0), new R(1, 1, 0)), e = 64, n = 1, i = 8, s = false) {
      super(), this.type = "TubeGeometry", this.parameters = {
        path: t,
        tubularSegments: e,
        radius: n,
        radialSegments: i,
        closed: s
      };
      const o = t.computeFrenetFrames(e, s);
      this.tangents = o.tangents, this.normals = o.normals, this.binormals = o.binormals;
      const a = new R(), l = new R(), c = new et();
      let h = new R();
      const d = [], u = [], f = [], m = [];
      _(), this.setIndex(m), this.setAttribute("position", new bt(d, 3)), this.setAttribute("normal", new bt(u, 3)), this.setAttribute("uv", new bt(f, 2));
      function _() {
        for (let x = 0; x < e; x++) g(x);
        g(s === false ? e : 0), v(), p();
      }
      function g(x) {
        h = t.getPointAt(x / e, h);
        const S = o.normals[x], P = o.binormals[x];
        for (let b = 0; b <= i; b++) {
          const T = b / i * Math.PI * 2, E = Math.sin(T), M = -Math.cos(T);
          l.x = M * S.x + E * P.x, l.y = M * S.y + E * P.y, l.z = M * S.z + E * P.z, l.normalize(), u.push(l.x, l.y, l.z), a.x = h.x + n * l.x, a.y = h.y + n * l.y, a.z = h.z + n * l.z, d.push(a.x, a.y, a.z);
        }
      }
      function p() {
        for (let x = 1; x <= e; x++) for (let S = 1; S <= i; S++) {
          const P = (i + 1) * (x - 1) + (S - 1), b = (i + 1) * x + (S - 1), T = (i + 1) * x + S, E = (i + 1) * (x - 1) + S;
          m.push(P, b, E), m.push(b, T, E);
        }
      }
      function v() {
        for (let x = 0; x <= e; x++) for (let S = 0; S <= i; S++) c.x = x / e, c.y = S / i, f.push(c.x, c.y);
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.path = this.parameters.path.toJSON(), t;
    }
    static fromJSON(t) {
      return new Ga(new ua[t.path.type]().fromJSON(t.path), t.tubularSegments, t.radius, t.radialSegments, t.closed);
    }
  }
  class pp extends Wt {
    constructor(t = null) {
      if (super(), this.type = "WireframeGeometry", this.parameters = {
        geometry: t
      }, t !== null) {
        const e = [], n = /* @__PURE__ */ new Set(), i = new R(), s = new R();
        if (t.index !== null) {
          const o = t.attributes.position, a = t.index;
          let l = t.groups;
          l.length === 0 && (l = [
            {
              start: 0,
              count: a.count,
              materialIndex: 0
            }
          ]);
          for (let c = 0, h = l.length; c < h; ++c) {
            const d = l[c], u = d.start, f = d.count;
            for (let m = u, _ = u + f; m < _; m += 3) for (let g = 0; g < 3; g++) {
              const p = a.getX(m + g), v = a.getX(m + (g + 1) % 3);
              i.fromBufferAttribute(o, p), s.fromBufferAttribute(o, v), Wu(i, s, n) === true && (e.push(i.x, i.y, i.z), e.push(s.x, s.y, s.z));
            }
          }
        } else {
          const o = t.attributes.position;
          for (let a = 0, l = o.count / 3; a < l; a++) for (let c = 0; c < 3; c++) {
            const h = 3 * a + c, d = 3 * a + (c + 1) % 3;
            i.fromBufferAttribute(o, h), s.fromBufferAttribute(o, d), Wu(i, s, n) === true && (e.push(i.x, i.y, i.z), e.push(s.x, s.y, s.z));
          }
        }
        this.setAttribute("position", new bt(e, 3));
      }
    }
    copy(t) {
      return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
    }
  }
  function Wu(r, t, e) {
    const n = `${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`, i = `${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;
    return e.has(n) === true || e.has(i) === true ? false : (e.add(n), e.add(i), true);
  }
  var Xu = Object.freeze({
    __proto__: null,
    BoxGeometry: ni,
    CapsuleGeometry: Da,
    CircleGeometry: Ua,
    ConeGeometry: Na,
    CylinderGeometry: Ys,
    DodecahedronGeometry: Oa,
    EdgesGeometry: hp,
    ExtrudeGeometry: Qe,
    IcosahedronGeometry: Fa,
    LatheGeometry: Kr,
    OctahedronGeometry: Qr,
    PlaneGeometry: Ws,
    PolyhedronGeometry: Mi,
    RingGeometry: Ba,
    ShapeGeometry: jr,
    SphereGeometry: to,
    TetrahedronGeometry: ka,
    TorusGeometry: Va,
    TorusKnotGeometry: Ha,
    TubeGeometry: Ga,
    WireframeGeometry: pp
  });
  class mp extends Ne {
    constructor(t) {
      super(), this.isShadowMaterial = true, this.type = "ShadowMaterial", this.color = new xt(0), this.transparent = true, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.fog = t.fog, this;
    }
  }
  class gp extends Sn {
    constructor(t) {
      super(t), this.isRawShaderMaterial = true, this.type = "RawShaderMaterial";
    }
  }
  class Be extends Ne {
    constructor(t) {
      super(), this.isMeshStandardMaterial = true, this.defines = {
        STANDARD: ""
      }, this.type = "MeshStandardMaterial", this.color = new xt(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new xt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.envMapIntensity = 1, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.defines = {
        STANDARD: ""
      }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
    }
  }
  class _p extends Be {
    constructor(t) {
      super(), this.isMeshPhysicalMaterial = true, this.defines = {
        STANDARD: "",
        PHYSICAL: ""
      }, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new et(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
        get: function() {
          return de(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
        },
        set: function(e) {
          this.ior = (1 + 0.4 * e) / (1 - 0.4 * e);
        }
      }), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [
        100,
        400
      ], this.iridescenceThicknessMap = null, this.sheenColor = new xt(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = 1 / 0, this.attenuationColor = new xt(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new xt(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._sheen = 0, this._transmission = 0, this.setValues(t);
    }
    get anisotropy() {
      return this._anisotropy;
    }
    set anisotropy(t) {
      this._anisotropy > 0 != t > 0 && this.version++, this._anisotropy = t;
    }
    get clearcoat() {
      return this._clearcoat;
    }
    set clearcoat(t) {
      this._clearcoat > 0 != t > 0 && this.version++, this._clearcoat = t;
    }
    get iridescence() {
      return this._iridescence;
    }
    set iridescence(t) {
      this._iridescence > 0 != t > 0 && this.version++, this._iridescence = t;
    }
    get dispersion() {
      return this._dispersion;
    }
    set dispersion(t) {
      this._dispersion > 0 != t > 0 && this.version++, this._dispersion = t;
    }
    get sheen() {
      return this._sheen;
    }
    set sheen(t) {
      this._sheen > 0 != t > 0 && this.version++, this._sheen = t;
    }
    get transmission() {
      return this._transmission;
    }
    set transmission(t) {
      this._transmission > 0 != t > 0 && this.version++, this._transmission = t;
    }
    copy(t) {
      return super.copy(t), this.defines = {
        STANDARD: "",
        PHYSICAL: ""
      }, this.anisotropy = t.anisotropy, this.anisotropyRotation = t.anisotropyRotation, this.anisotropyMap = t.anisotropyMap, this.clearcoat = t.clearcoat, this.clearcoatMap = t.clearcoatMap, this.clearcoatRoughness = t.clearcoatRoughness, this.clearcoatRoughnessMap = t.clearcoatRoughnessMap, this.clearcoatNormalMap = t.clearcoatNormalMap, this.clearcoatNormalScale.copy(t.clearcoatNormalScale), this.dispersion = t.dispersion, this.ior = t.ior, this.iridescence = t.iridescence, this.iridescenceMap = t.iridescenceMap, this.iridescenceIOR = t.iridescenceIOR, this.iridescenceThicknessRange = [
        ...t.iridescenceThicknessRange
      ], this.iridescenceThicknessMap = t.iridescenceThicknessMap, this.sheen = t.sheen, this.sheenColor.copy(t.sheenColor), this.sheenColorMap = t.sheenColorMap, this.sheenRoughness = t.sheenRoughness, this.sheenRoughnessMap = t.sheenRoughnessMap, this.transmission = t.transmission, this.transmissionMap = t.transmissionMap, this.thickness = t.thickness, this.thicknessMap = t.thicknessMap, this.attenuationDistance = t.attenuationDistance, this.attenuationColor.copy(t.attenuationColor), this.specularIntensity = t.specularIntensity, this.specularIntensityMap = t.specularIntensityMap, this.specularColor.copy(t.specularColor), this.specularColorMap = t.specularColorMap, this;
    }
  }
  class xp extends Ne {
    constructor(t) {
      super(), this.isMeshPhongMaterial = true, this.type = "MeshPhongMaterial", this.color = new xt(16777215), this.specular = new xt(1118481), this.shininess = 30, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new xt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.combine = Yr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.specular.copy(t.specular), this.shininess = t.shininess, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
    }
  }
  class vp extends Ne {
    constructor(t) {
      super(), this.isMeshToonMaterial = true, this.defines = {
        TOON: ""
      }, this.type = "MeshToonMaterial", this.color = new xt(16777215), this.map = null, this.gradientMap = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new xt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.alphaMap = null, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.gradientMap = t.gradientMap, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.alphaMap = t.alphaMap, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
    }
  }
  class yp extends Ne {
    constructor(t) {
      super(), this.isMeshNormalMaterial = true, this.type = "MeshNormalMaterial", this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = false, this.wireframeLinewidth = 1, this.flatShading = false, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.flatShading = t.flatShading, this;
    }
  }
  class Mp extends Ne {
    constructor(t) {
      super(), this.isMeshLambertMaterial = true, this.type = "MeshLambertMaterial", this.color = new xt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new xt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.combine = Yr, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = false, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = false, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
    }
  }
  class Sp extends Ne {
    constructor(t) {
      super(), this.isMeshMatcapMaterial = true, this.defines = {
        MATCAP: ""
      }, this.type = "MeshMatcapMaterial", this.color = new xt(16777215), this.matcap = null, this.map = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = vi, this.normalScale = new et(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.alphaMap = null, this.flatShading = false, this.fog = true, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.defines = {
        MATCAP: ""
      }, this.color.copy(t.color), this.matcap = t.matcap, this.map = t.map, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.alphaMap = t.alphaMap, this.flatShading = t.flatShading, this.fog = t.fog, this;
    }
  }
  class bp extends He {
    constructor(t) {
      super(), this.isLineDashedMaterial = true, this.type = "LineDashedMaterial", this.scale = 1, this.dashSize = 3, this.gapSize = 1, this.setValues(t);
    }
    copy(t) {
      return super.copy(t), this.scale = t.scale, this.dashSize = t.dashSize, this.gapSize = t.gapSize, this;
    }
  }
  function Hi(r, t, e) {
    return !r || !e && r.constructor === t ? r : typeof t.BYTES_PER_ELEMENT == "number" ? new t(r) : Array.prototype.slice.call(r);
  }
  function wp(r) {
    return ArrayBuffer.isView(r) && !(r instanceof DataView);
  }
  function Tp(r) {
    function t(i, s) {
      return r[i] - r[s];
    }
    const e = r.length, n = new Array(e);
    for (let i = 0; i !== e; ++i) n[i] = i;
    return n.sort(t), n;
  }
  function wc(r, t, e) {
    const n = r.length, i = new r.constructor(n);
    for (let s = 0, o = 0; o !== n; ++s) {
      const a = e[s] * t;
      for (let l = 0; l !== t; ++l) i[o++] = r[a + l];
    }
    return i;
  }
  function ch(r, t, e, n) {
    let i = 1, s = r[0];
    for (; s !== void 0 && s[n] === void 0; ) s = r[i++];
    if (s === void 0) return;
    let o = s[n];
    if (o !== void 0) if (Array.isArray(o)) do
      o = s[n], o !== void 0 && (t.push(s.time), e.push.apply(e, o)), s = r[i++];
    while (s !== void 0);
    else if (o.toArray !== void 0) do
      o = s[n], o !== void 0 && (t.push(s.time), o.toArray(e, e.length)), s = r[i++];
    while (s !== void 0);
    else do
      o = s[n], o !== void 0 && (t.push(s.time), e.push(o)), s = r[i++];
    while (s !== void 0);
  }
  function cM(r, t, e, n, i = 30) {
    const s = r.clone();
    s.name = t;
    const o = [];
    for (let l = 0; l < s.tracks.length; ++l) {
      const c = s.tracks[l], h = c.getValueSize(), d = [], u = [];
      for (let f = 0; f < c.times.length; ++f) {
        const m = c.times[f] * i;
        if (!(m < e || m >= n)) {
          d.push(c.times[f]);
          for (let _ = 0; _ < h; ++_) u.push(c.values[f * h + _]);
        }
      }
      d.length !== 0 && (c.times = Hi(d, c.times.constructor), c.values = Hi(u, c.values.constructor), o.push(c));
    }
    s.tracks = o;
    let a = 1 / 0;
    for (let l = 0; l < s.tracks.length; ++l) a > s.tracks[l].times[0] && (a = s.tracks[l].times[0]);
    for (let l = 0; l < s.tracks.length; ++l) s.tracks[l].shift(-1 * a);
    return s.resetDuration(), s;
  }
  function hM(r, t = 0, e = r, n = 30) {
    n <= 0 && (n = 30);
    const i = e.tracks.length, s = t / n;
    for (let o = 0; o < i; ++o) {
      const a = e.tracks[o], l = a.ValueTypeName;
      if (l === "bool" || l === "string") continue;
      const c = r.tracks.find(function(p) {
        return p.name === a.name && p.ValueTypeName === l;
      });
      if (c === void 0) continue;
      let h = 0;
      const d = a.getValueSize();
      a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline && (h = d / 3);
      let u = 0;
      const f = c.getValueSize();
      c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline && (u = f / 3);
      const m = a.times.length - 1;
      let _;
      if (s <= a.times[0]) {
        const p = h, v = d - h;
        _ = a.values.slice(p, v);
      } else if (s >= a.times[m]) {
        const p = m * d + h, v = p + d - h;
        _ = a.values.slice(p, v);
      } else {
        const p = a.createInterpolant(), v = h, x = d - h;
        p.evaluate(s), _ = p.resultBuffer.slice(v, x);
      }
      l === "quaternion" && new qe().fromArray(_).normalize().conjugate().toArray(_);
      const g = c.times.length;
      for (let p = 0; p < g; ++p) {
        const v = p * f + u;
        if (l === "quaternion") qe.multiplyQuaternionsFlat(c.values, v, _, 0, c.values, v);
        else {
          const x = f - u * 2;
          for (let S = 0; S < x; ++S) c.values[v + S] -= _[S];
        }
      }
    }
    return r.blendMode = Gc, r;
  }
  const uM = {
    convertArray: Hi,
    isTypedArray: wp,
    getKeyframeOrder: Tp,
    sortedArray: wc,
    flattenJSON: ch,
    subclip: cM,
    makeClipAdditive: hM
  };
  class eo {
    constructor(t, e, n, i) {
      this.parameterPositions = t, this._cachedIndex = 0, this.resultBuffer = i !== void 0 ? i : new e.constructor(n), this.sampleValues = e, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
    }
    evaluate(t) {
      const e = this.parameterPositions;
      let n = this._cachedIndex, i = e[n], s = e[n - 1];
      t: {
        e: {
          let o;
          n: {
            i: if (!(t < i)) {
              for (let a = n + 2; ; ) {
                if (i === void 0) {
                  if (t < s) break i;
                  return n = e.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
                }
                if (n === a) break;
                if (s = i, i = e[++n], t < i) break e;
              }
              o = e.length;
              break n;
            }
            if (!(t >= s)) {
              const a = e[1];
              t < a && (n = 2, s = a);
              for (let l = n - 2; ; ) {
                if (s === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
                if (n === l) break;
                if (i = s, s = e[--n - 1], t >= s) break e;
              }
              o = n, n = 0;
              break n;
            }
            break t;
          }
          for (; n < o; ) {
            const a = n + o >>> 1;
            t < e[a] ? o = a : n = a + 1;
          }
          if (i = e[n], s = e[n - 1], s === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
          if (i === void 0) return n = e.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
        }
        this._cachedIndex = n, this.intervalChanged_(n, s, i);
      }
      return this.interpolate_(n, s, t, i);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(t) {
      const e = this.resultBuffer, n = this.sampleValues, i = this.valueSize, s = t * i;
      for (let o = 0; o !== i; ++o) e[o] = n[s + o];
      return e;
    }
    interpolate_() {
      throw new Error("call to abstract method");
    }
    intervalChanged_() {
    }
  }
  class Ap extends eo {
    constructor(t, e, n, i) {
      super(t, e, n, i), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
        endingStart: Bi,
        endingEnd: Bi
      };
    }
    intervalChanged_(t, e, n) {
      const i = this.parameterPositions;
      let s = t - 2, o = t + 1, a = i[s], l = i[o];
      if (a === void 0) switch (this.getSettings_().endingStart) {
        case ki:
          s = t, a = 2 * e - n;
          break;
        case Rr:
          s = i.length - 2, a = e + i[s] - i[s + 1];
          break;
        default:
          s = t, a = n;
      }
      if (l === void 0) switch (this.getSettings_().endingEnd) {
        case ki:
          o = t, l = 2 * n - e;
          break;
        case Rr:
          o = 1, l = n + i[1] - i[0];
          break;
        default:
          o = t - 1, l = e;
      }
      const c = (n - e) * 0.5, h = this.valueSize;
      this._weightPrev = c / (e - a), this._weightNext = c / (l - n), this._offsetPrev = s * h, this._offsetNext = o * h;
    }
    interpolate_(t, e, n, i) {
      const s = this.resultBuffer, o = this.sampleValues, a = this.valueSize, l = t * a, c = l - a, h = this._offsetPrev, d = this._offsetNext, u = this._weightPrev, f = this._weightNext, m = (n - e) / (i - e), _ = m * m, g = _ * m, p = -u * g + 2 * u * _ - u * m, v = (1 + u) * g + (-1.5 - 2 * u) * _ + (-0.5 + u) * m + 1, x = (-1 - f) * g + (1.5 + f) * _ + 0.5 * m, S = f * g - f * _;
      for (let P = 0; P !== a; ++P) s[P] = p * o[h + P] + v * o[c + P] + x * o[l + P] + S * o[d + P];
      return s;
    }
  }
  class hh extends eo {
    constructor(t, e, n, i) {
      super(t, e, n, i);
    }
    interpolate_(t, e, n, i) {
      const s = this.resultBuffer, o = this.sampleValues, a = this.valueSize, l = t * a, c = l - a, h = (n - e) / (i - e), d = 1 - h;
      for (let u = 0; u !== a; ++u) s[u] = o[c + u] * d + o[l + u] * h;
      return s;
    }
  }
  class Ep extends eo {
    constructor(t, e, n, i) {
      super(t, e, n, i);
    }
    interpolate_(t) {
      return this.copySampleValue_(t - 1);
    }
  }
  class wn {
    constructor(t, e, n, i) {
      if (t === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
      if (e === void 0 || e.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + t);
      this.name = t, this.times = Hi(e, this.TimeBufferType), this.values = Hi(n, this.ValueBufferType), this.setInterpolation(i || this.DefaultInterpolation);
    }
    static toJSON(t) {
      const e = t.constructor;
      let n;
      if (e.toJSON !== this.toJSON) n = e.toJSON(t);
      else {
        n = {
          name: t.name,
          times: Hi(t.times, Array),
          values: Hi(t.values, Array)
        };
        const i = t.getInterpolation();
        i !== t.DefaultInterpolation && (n.interpolation = i);
      }
      return n.type = t.ValueTypeName, n;
    }
    InterpolantFactoryMethodDiscrete(t) {
      return new Ep(this.times, this.values, this.getValueSize(), t);
    }
    InterpolantFactoryMethodLinear(t) {
      return new hh(this.times, this.values, this.getValueSize(), t);
    }
    InterpolantFactoryMethodSmooth(t) {
      return new Ap(this.times, this.values, this.getValueSize(), t);
    }
    setInterpolation(t) {
      let e;
      switch (t) {
        case Er:
          e = this.InterpolantFactoryMethodDiscrete;
          break;
        case Cr:
          e = this.InterpolantFactoryMethodLinear;
          break;
        case ra:
          e = this.InterpolantFactoryMethodSmooth;
          break;
      }
      if (e === void 0) {
        const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
        if (this.createInterpolant === void 0) if (t !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw new Error(n);
        return console.warn("THREE.KeyframeTrack:", n), this;
      }
      return this.createInterpolant = e, this;
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return Er;
        case this.InterpolantFactoryMethodLinear:
          return Cr;
        case this.InterpolantFactoryMethodSmooth:
          return ra;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(t) {
      if (t !== 0) {
        const e = this.times;
        for (let n = 0, i = e.length; n !== i; ++n) e[n] += t;
      }
      return this;
    }
    scale(t) {
      if (t !== 1) {
        const e = this.times;
        for (let n = 0, i = e.length; n !== i; ++n) e[n] *= t;
      }
      return this;
    }
    trim(t, e) {
      const n = this.times, i = n.length;
      let s = 0, o = i - 1;
      for (; s !== i && n[s] < t; ) ++s;
      for (; o !== -1 && n[o] > e; ) --o;
      if (++o, s !== 0 || o !== i) {
        s >= o && (o = Math.max(o, 1), s = o - 1);
        const a = this.getValueSize();
        this.times = n.slice(s, o), this.values = this.values.slice(s * a, o * a);
      }
      return this;
    }
    validate() {
      let t = true;
      const e = this.getValueSize();
      e - Math.floor(e) !== 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), t = false);
      const n = this.times, i = this.values, s = n.length;
      s === 0 && (console.error("THREE.KeyframeTrack: Track is empty.", this), t = false);
      let o = null;
      for (let a = 0; a !== s; a++) {
        const l = n[a];
        if (typeof l == "number" && isNaN(l)) {
          console.error("THREE.KeyframeTrack: Time is not a valid number.", this, a, l), t = false;
          break;
        }
        if (o !== null && o > l) {
          console.error("THREE.KeyframeTrack: Out of order keys.", this, a, l, o), t = false;
          break;
        }
        o = l;
      }
      if (i !== void 0 && wp(i)) for (let a = 0, l = i.length; a !== l; ++a) {
        const c = i[a];
        if (isNaN(c)) {
          console.error("THREE.KeyframeTrack: Value is not a valid number.", this, a, c), t = false;
          break;
        }
      }
      return t;
    }
    optimize() {
      const t = this.times.slice(), e = this.values.slice(), n = this.getValueSize(), i = this.getInterpolation() === ra, s = t.length - 1;
      let o = 1;
      for (let a = 1; a < s; ++a) {
        let l = false;
        const c = t[a], h = t[a + 1];
        if (c !== h && (a !== 1 || c !== t[0])) if (i) l = true;
        else {
          const d = a * n, u = d - n, f = d + n;
          for (let m = 0; m !== n; ++m) {
            const _ = e[d + m];
            if (_ !== e[u + m] || _ !== e[f + m]) {
              l = true;
              break;
            }
          }
        }
        if (l) {
          if (a !== o) {
            t[o] = t[a];
            const d = a * n, u = o * n;
            for (let f = 0; f !== n; ++f) e[u + f] = e[d + f];
          }
          ++o;
        }
      }
      if (s > 0) {
        t[o] = t[s];
        for (let a = s * n, l = o * n, c = 0; c !== n; ++c) e[l + c] = e[a + c];
        ++o;
      }
      return o !== t.length ? (this.times = t.slice(0, o), this.values = e.slice(0, o * n)) : (this.times = t, this.values = e), this;
    }
    clone() {
      const t = this.times.slice(), e = this.values.slice(), n = this.constructor, i = new n(this.name, t, e);
      return i.createInterpolant = this.createInterpolant, i;
    }
  }
  wn.prototype.TimeBufferType = Float32Array;
  wn.prototype.ValueBufferType = Float32Array;
  wn.prototype.DefaultInterpolation = Cr;
  class ns extends wn {
  }
  ns.prototype.ValueTypeName = "bool";
  ns.prototype.ValueBufferType = Array;
  ns.prototype.DefaultInterpolation = Er;
  ns.prototype.InterpolantFactoryMethodLinear = void 0;
  ns.prototype.InterpolantFactoryMethodSmooth = void 0;
  class uh extends wn {
  }
  uh.prototype.ValueTypeName = "color";
  class Br extends wn {
  }
  Br.prototype.ValueTypeName = "number";
  class Cp extends eo {
    constructor(t, e, n, i) {
      super(t, e, n, i);
    }
    interpolate_(t, e, n, i) {
      const s = this.resultBuffer, o = this.sampleValues, a = this.valueSize, l = (n - e) / (i - e);
      let c = t * a;
      for (let h = c + a; c !== h; c += 4) qe.slerpFlat(s, 0, o, c - a, o, c, l);
      return s;
    }
  }
  class qs extends wn {
    InterpolantFactoryMethodLinear(t) {
      return new Cp(this.times, this.values, this.getValueSize(), t);
    }
  }
  qs.prototype.ValueTypeName = "quaternion";
  qs.prototype.DefaultInterpolation = Cr;
  qs.prototype.InterpolantFactoryMethodSmooth = void 0;
  class is extends wn {
  }
  is.prototype.ValueTypeName = "string";
  is.prototype.ValueBufferType = Array;
  is.prototype.DefaultInterpolation = Er;
  is.prototype.InterpolantFactoryMethodLinear = void 0;
  is.prototype.InterpolantFactoryMethodSmooth = void 0;
  class kr extends wn {
  }
  kr.prototype.ValueTypeName = "vector";
  class Vr {
    constructor(t = "", e = -1, n = [], i = ya) {
      this.name = t, this.tracks = n, this.duration = e, this.blendMode = i, this.uuid = sn(), this.duration < 0 && this.resetDuration();
    }
    static parse(t) {
      const e = [], n = t.tracks, i = 1 / (t.fps || 1);
      for (let o = 0, a = n.length; o !== a; ++o) e.push(fM(n[o]).scale(i));
      const s = new this(t.name, t.duration, e, t.blendMode);
      return s.uuid = t.uuid, s;
    }
    static toJSON(t) {
      const e = [], n = t.tracks, i = {
        name: t.name,
        duration: t.duration,
        tracks: e,
        uuid: t.uuid,
        blendMode: t.blendMode
      };
      for (let s = 0, o = n.length; s !== o; ++s) e.push(wn.toJSON(n[s]));
      return i;
    }
    static CreateFromMorphTargetSequence(t, e, n, i) {
      const s = e.length, o = [];
      for (let a = 0; a < s; a++) {
        let l = [], c = [];
        l.push((a + s - 1) % s, a, (a + 1) % s), c.push(0, 1, 0);
        const h = Tp(l);
        l = wc(l, 1, h), c = wc(c, 1, h), !i && l[0] === 0 && (l.push(s), c.push(c[0])), o.push(new Br(".morphTargetInfluences[" + e[a].name + "]", l, c).scale(1 / n));
      }
      return new this(t, -1, o);
    }
    static findByName(t, e) {
      let n = t;
      if (!Array.isArray(t)) {
        const i = t;
        n = i.geometry && i.geometry.animations || i.animations;
      }
      for (let i = 0; i < n.length; i++) if (n[i].name === e) return n[i];
      return null;
    }
    static CreateClipsFromMorphTargetSequences(t, e, n) {
      const i = {}, s = /^([\w-]*?)([\d]+)$/;
      for (let a = 0, l = t.length; a < l; a++) {
        const c = t[a], h = c.name.match(s);
        if (h && h.length > 1) {
          const d = h[1];
          let u = i[d];
          u || (i[d] = u = []), u.push(c);
        }
      }
      const o = [];
      for (const a in i) o.push(this.CreateFromMorphTargetSequence(a, i[a], e, n));
      return o;
    }
    static parseAnimation(t, e) {
      if (!t) return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
      const n = function(d, u, f, m, _) {
        if (f.length !== 0) {
          const g = [], p = [];
          ch(f, g, p, m), g.length !== 0 && _.push(new d(u, g, p));
        }
      }, i = [], s = t.name || "default", o = t.fps || 30, a = t.blendMode;
      let l = t.length || -1;
      const c = t.hierarchy || [];
      for (let d = 0; d < c.length; d++) {
        const u = c[d].keys;
        if (!(!u || u.length === 0)) if (u[0].morphTargets) {
          const f = {};
          let m;
          for (m = 0; m < u.length; m++) if (u[m].morphTargets) for (let _ = 0; _ < u[m].morphTargets.length; _++) f[u[m].morphTargets[_]] = -1;
          for (const _ in f) {
            const g = [], p = [];
            for (let v = 0; v !== u[m].morphTargets.length; ++v) {
              const x = u[m];
              g.push(x.time), p.push(x.morphTarget === _ ? 1 : 0);
            }
            i.push(new Br(".morphTargetInfluence[" + _ + "]", g, p));
          }
          l = f.length * o;
        } else {
          const f = ".bones[" + e[d].name + "]";
          n(kr, f + ".position", u, "pos", i), n(qs, f + ".quaternion", u, "rot", i), n(kr, f + ".scale", u, "scl", i);
        }
      }
      return i.length === 0 ? null : new this(s, l, i, a);
    }
    resetDuration() {
      const t = this.tracks;
      let e = 0;
      for (let n = 0, i = t.length; n !== i; ++n) {
        const s = this.tracks[n];
        e = Math.max(e, s.times[s.times.length - 1]);
      }
      return this.duration = e, this;
    }
    trim() {
      for (let t = 0; t < this.tracks.length; t++) this.tracks[t].trim(0, this.duration);
      return this;
    }
    validate() {
      let t = true;
      for (let e = 0; e < this.tracks.length; e++) t = t && this.tracks[e].validate();
      return t;
    }
    optimize() {
      for (let t = 0; t < this.tracks.length; t++) this.tracks[t].optimize();
      return this;
    }
    clone() {
      const t = [];
      for (let e = 0; e < this.tracks.length; e++) t.push(this.tracks[e].clone());
      return new this.constructor(this.name, this.duration, t, this.blendMode);
    }
    toJSON() {
      return this.constructor.toJSON(this);
    }
  }
  function dM(r) {
    switch (r.toLowerCase()) {
      case "scalar":
      case "double":
      case "float":
      case "number":
      case "integer":
        return Br;
      case "vector":
      case "vector2":
      case "vector3":
      case "vector4":
        return kr;
      case "color":
        return uh;
      case "quaternion":
        return qs;
      case "bool":
      case "boolean":
        return ns;
      case "string":
        return is;
    }
    throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + r);
  }
  function fM(r) {
    if (r.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
    const t = dM(r.type);
    if (r.times === void 0) {
      const e = [], n = [];
      ch(r.keys, e, n, "value"), r.times = e, r.values = n;
    }
    return t.parse !== void 0 ? t.parse(r) : new t(r.name, r.times, r.values, r.interpolation);
  }
  const Gn = {
    enabled: false,
    files: {},
    add: function(r, t) {
      this.enabled !== false && (this.files[r] = t);
    },
    get: function(r) {
      if (this.enabled !== false) return this.files[r];
    },
    remove: function(r) {
      delete this.files[r];
    },
    clear: function() {
      this.files = {};
    }
  };
  class dh {
    constructor(t, e, n) {
      const i = this;
      let s = false, o = 0, a = 0, l;
      const c = [];
      this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = n, this.itemStart = function(h) {
        a++, s === false && i.onStart !== void 0 && i.onStart(h, o, a), s = true;
      }, this.itemEnd = function(h) {
        o++, i.onProgress !== void 0 && i.onProgress(h, o, a), o === a && (s = false, i.onLoad !== void 0 && i.onLoad());
      }, this.itemError = function(h) {
        i.onError !== void 0 && i.onError(h);
      }, this.resolveURL = function(h) {
        return l ? l(h) : h;
      }, this.setURLModifier = function(h) {
        return l = h, this;
      }, this.addHandler = function(h, d) {
        return c.push(h, d), this;
      }, this.removeHandler = function(h) {
        const d = c.indexOf(h);
        return d !== -1 && c.splice(d, 2), this;
      }, this.getHandler = function(h) {
        for (let d = 0, u = c.length; d < u; d += 2) {
          const f = c[d], m = c[d + 1];
          if (f.global && (f.lastIndex = 0), f.test(h)) return m;
        }
        return null;
      };
    }
  }
  const Rp = new dh();
  class $e {
    constructor(t) {
      this.manager = t !== void 0 ? t : Rp, this.crossOrigin = "anonymous", this.withCredentials = false, this.path = "", this.resourcePath = "", this.requestHeader = {};
    }
    load() {
    }
    loadAsync(t, e) {
      const n = this;
      return new Promise(function(i, s) {
        n.load(t, i, e, s);
      });
    }
    parse() {
    }
    setCrossOrigin(t) {
      return this.crossOrigin = t, this;
    }
    setWithCredentials(t) {
      return this.withCredentials = t, this;
    }
    setPath(t) {
      return this.path = t, this;
    }
    setResourcePath(t) {
      return this.resourcePath = t, this;
    }
    setRequestHeader(t) {
      return this.requestHeader = t, this;
    }
  }
  $e.DEFAULT_MATERIAL_NAME = "__DEFAULT";
  const kn = {};
  class pM extends Error {
    constructor(t, e) {
      super(t), this.response = e;
    }
  }
  class Qn extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      t === void 0 && (t = ""), this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
      const s = Gn.get(t);
      if (s !== void 0) return this.manager.itemStart(t), setTimeout(() => {
        e && e(s), this.manager.itemEnd(t);
      }, 0), s;
      if (kn[t] !== void 0) {
        kn[t].push({
          onLoad: e,
          onProgress: n,
          onError: i
        });
        return;
      }
      kn[t] = [], kn[t].push({
        onLoad: e,
        onProgress: n,
        onError: i
      });
      const o = new Request(t, {
        headers: new Headers(this.requestHeader),
        credentials: this.withCredentials ? "include" : "same-origin"
      }), a = this.mimeType, l = this.responseType;
      fetch(o).then((c) => {
        if (c.status === 200 || c.status === 0) {
          if (c.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || c.body === void 0 || c.body.getReader === void 0) return c;
          const h = kn[t], d = c.body.getReader(), u = c.headers.get("X-File-Size") || c.headers.get("Content-Length"), f = u ? parseInt(u) : 0, m = f !== 0;
          let _ = 0;
          const g = new ReadableStream({
            start(p) {
              v();
              function v() {
                d.read().then(({ done: x, value: S }) => {
                  if (x) p.close();
                  else {
                    _ += S.byteLength;
                    const P = new ProgressEvent("progress", {
                      lengthComputable: m,
                      loaded: _,
                      total: f
                    });
                    for (let b = 0, T = h.length; b < T; b++) {
                      const E = h[b];
                      E.onProgress && E.onProgress(P);
                    }
                    p.enqueue(S), v();
                  }
                });
              }
            }
          });
          return new Response(g);
        } else throw new pM(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`, c);
      }).then((c) => {
        switch (l) {
          case "arraybuffer":
            return c.arrayBuffer();
          case "blob":
            return c.blob();
          case "document":
            return c.text().then((h) => new DOMParser().parseFromString(h, a));
          case "json":
            return c.json();
          default:
            if (a === void 0) return c.text();
            {
              const d = /charset="?([^;"\s]*)"?/i.exec(a), u = d && d[1] ? d[1].toLowerCase() : void 0, f = new TextDecoder(u);
              return c.arrayBuffer().then((m) => f.decode(m));
            }
        }
      }).then((c) => {
        Gn.add(t, c);
        const h = kn[t];
        delete kn[t];
        for (let d = 0, u = h.length; d < u; d++) {
          const f = h[d];
          f.onLoad && f.onLoad(c);
        }
      }).catch((c) => {
        const h = kn[t];
        if (h === void 0) throw this.manager.itemError(t), c;
        delete kn[t];
        for (let d = 0, u = h.length; d < u; d++) {
          const f = h[d];
          f.onError && f.onError(c);
        }
        this.manager.itemError(t);
      }).finally(() => {
        this.manager.itemEnd(t);
      }), this.manager.itemStart(t);
    }
    setResponseType(t) {
      return this.responseType = t, this;
    }
    setMimeType(t) {
      return this.mimeType = t, this;
    }
  }
  class mM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = new Qn(this.manager);
      o.setPath(this.path), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(t, function(a) {
        try {
          e(s.parse(JSON.parse(a)));
        } catch (l) {
          i ? i(l) : console.error(l), s.manager.itemError(t);
        }
      }, n, i);
    }
    parse(t) {
      const e = [];
      for (let n = 0; n < t.length; n++) {
        const i = Vr.parse(t[n]);
        e.push(i);
      }
      return e;
    }
  }
  class gM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = [], a = new Ia(), l = new Qn(this.manager);
      l.setPath(this.path), l.setResponseType("arraybuffer"), l.setRequestHeader(this.requestHeader), l.setWithCredentials(s.withCredentials);
      let c = 0;
      function h(d) {
        l.load(t[d], function(u) {
          const f = s.parse(u, true);
          o[d] = {
            width: f.width,
            height: f.height,
            format: f.format,
            mipmaps: f.mipmaps
          }, c += 1, c === 6 && (f.mipmapCount === 1 && (a.minFilter = xe), a.image = o, a.format = f.format, a.needsUpdate = true, e && e(a));
        }, n, i);
      }
      if (Array.isArray(t)) for (let d = 0, u = t.length; d < u; ++d) h(d);
      else l.load(t, function(d) {
        const u = s.parse(d, true);
        if (u.isCubemap) {
          const f = u.mipmaps.length / u.mipmapCount;
          for (let m = 0; m < f; m++) {
            o[m] = {
              mipmaps: []
            };
            for (let _ = 0; _ < u.mipmapCount; _++) o[m].mipmaps.push(u.mipmaps[m * u.mipmapCount + _]), o[m].format = u.format, o[m].width = u.width, o[m].height = u.height;
          }
          a.image = o;
        } else a.image.width = u.width, a.image.height = u.height, a.mipmaps = u.mipmaps;
        u.mipmapCount === 1 && (a.minFilter = xe), a.format = u.format, a.needsUpdate = true, e && e(a);
      }, n, i);
      return a;
    }
  }
  class Hr extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
      const s = this, o = Gn.get(t);
      if (o !== void 0) return s.manager.itemStart(t), setTimeout(function() {
        e && e(o), s.manager.itemEnd(t);
      }, 0), o;
      const a = Nr("img");
      function l() {
        h(), Gn.add(t, this), e && e(this), s.manager.itemEnd(t);
      }
      function c(d) {
        h(), i && i(d), s.manager.itemError(t), s.manager.itemEnd(t);
      }
      function h() {
        a.removeEventListener("load", l, false), a.removeEventListener("error", c, false);
      }
      return a.addEventListener("load", l, false), a.addEventListener("error", c, false), t.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (a.crossOrigin = this.crossOrigin), s.manager.itemStart(t), a.src = t, a;
    }
  }
  class _M extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = new Zr();
      s.colorSpace = un;
      const o = new Hr(this.manager);
      o.setCrossOrigin(this.crossOrigin), o.setPath(this.path);
      let a = 0;
      function l(c) {
        o.load(t[c], function(h) {
          s.images[c] = h, a++, a === 6 && (s.needsUpdate = true, e && e(s));
        }, void 0, i);
      }
      for (let c = 0; c < t.length; ++c) l(c);
      return s;
    }
  }
  class xM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = new pi(), a = new Qn(this.manager);
      return a.setResponseType("arraybuffer"), a.setRequestHeader(this.requestHeader), a.setPath(this.path), a.setWithCredentials(s.withCredentials), a.load(t, function(l) {
        let c;
        try {
          c = s.parse(l);
        } catch (h) {
          if (i !== void 0) i(h);
          else {
            console.error(h);
            return;
          }
        }
        c.image !== void 0 ? o.image = c.image : c.data !== void 0 && (o.image.width = c.width, o.image.height = c.height, o.image.data = c.data), o.wrapS = c.wrapS !== void 0 ? c.wrapS : dn, o.wrapT = c.wrapT !== void 0 ? c.wrapT : dn, o.magFilter = c.magFilter !== void 0 ? c.magFilter : xe, o.minFilter = c.minFilter !== void 0 ? c.minFilter : xe, o.anisotropy = c.anisotropy !== void 0 ? c.anisotropy : 1, c.colorSpace !== void 0 && (o.colorSpace = c.colorSpace), c.flipY !== void 0 && (o.flipY = c.flipY), c.format !== void 0 && (o.format = c.format), c.type !== void 0 && (o.type = c.type), c.mipmaps !== void 0 && (o.mipmaps = c.mipmaps, o.minFilter = Cn), c.mipmapCount === 1 && (o.minFilter = xe), c.generateMipmaps !== void 0 && (o.generateMipmaps = c.generateMipmaps), o.needsUpdate = true, e && e(o, c);
      }, n, i), o;
    }
  }
  class vM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = new fe(), o = new Hr(this.manager);
      return o.setCrossOrigin(this.crossOrigin), o.setPath(this.path), o.load(t, function(a) {
        s.image = a, s.needsUpdate = true, e !== void 0 && e(s);
      }, n, i), s;
    }
  }
  class Si extends jt {
    constructor(t, e = 1) {
      super(), this.isLight = true, this.type = "Light", this.color = new xt(t), this.intensity = e;
    }
    dispose() {
    }
    copy(t, e) {
      return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), e;
    }
  }
  class Pp extends Si {
    constructor(t, e, n) {
      super(t, n), this.isHemisphereLight = true, this.type = "HemisphereLight", this.position.copy(jt.DEFAULT_UP), this.updateMatrix(), this.groundColor = new xt(e);
    }
    copy(t, e) {
      return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
    }
  }
  const Dl = new Dt(), Yu = new R(), qu = new R();
  class fh {
    constructor(t) {
      this.camera = t, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new et(512, 512), this.map = null, this.mapPass = null, this.matrix = new Dt(), this.autoUpdate = true, this.needsUpdate = false, this._frustum = new Jr(), this._frameExtents = new et(1, 1), this._viewportCount = 1, this._viewports = [
        new ie(0, 0, 1, 1)
      ];
    }
    getViewportCount() {
      return this._viewportCount;
    }
    getFrustum() {
      return this._frustum;
    }
    updateMatrices(t) {
      const e = this.camera, n = this.matrix;
      Yu.setFromMatrixPosition(t.matrixWorld), e.position.copy(Yu), qu.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(qu), e.updateMatrixWorld(), Dl.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Dl), n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), n.multiply(Dl);
    }
    getViewport(t) {
      return this._viewports[t];
    }
    getFrameExtents() {
      return this._frameExtents;
    }
    dispose() {
      this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
    }
    copy(t) {
      return this.camera = t.camera.clone(), this.bias = t.bias, this.radius = t.radius, this.mapSize.copy(t.mapSize), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      const t = {};
      return this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(false).object, delete t.camera.matrix, t;
    }
  }
  class yM extends fh {
    constructor() {
      super(new be(50, 1, 0.5, 500)), this.isSpotLightShadow = true, this.focus = 1;
    }
    updateMatrices(t) {
      const e = this.camera, n = zs * 2 * t.angle * this.focus, i = this.mapSize.width / this.mapSize.height, s = t.distance || e.far;
      (n !== e.fov || i !== e.aspect || s !== e.far) && (e.fov = n, e.aspect = i, e.far = s, e.updateProjectionMatrix()), super.updateMatrices(t);
    }
    copy(t) {
      return super.copy(t), this.focus = t.focus, this;
    }
  }
  class Ip extends Si {
    constructor(t, e, n = 0, i = Math.PI / 3, s = 0, o = 2) {
      super(t, e), this.isSpotLight = true, this.type = "SpotLight", this.position.copy(jt.DEFAULT_UP), this.updateMatrix(), this.target = new jt(), this.distance = n, this.angle = i, this.penumbra = s, this.decay = o, this.map = null, this.shadow = new yM();
    }
    get power() {
      return this.intensity * Math.PI;
    }
    set power(t) {
      this.intensity = t / Math.PI;
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(t, e) {
      return super.copy(t, e), this.distance = t.distance, this.angle = t.angle, this.penumbra = t.penumbra, this.decay = t.decay, this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
    }
  }
  const $u = new Dt(), cr = new R(), Ul = new R();
  class MM extends fh {
    constructor() {
      super(new be(90, 1, 0.5, 500)), this.isPointLightShadow = true, this._frameExtents = new et(4, 2), this._viewportCount = 6, this._viewports = [
        new ie(2, 1, 1, 1),
        new ie(0, 1, 1, 1),
        new ie(3, 1, 1, 1),
        new ie(1, 1, 1, 1),
        new ie(3, 0, 1, 1),
        new ie(1, 0, 1, 1)
      ], this._cubeDirections = [
        new R(1, 0, 0),
        new R(-1, 0, 0),
        new R(0, 0, 1),
        new R(0, 0, -1),
        new R(0, 1, 0),
        new R(0, -1, 0)
      ], this._cubeUps = [
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 1, 0),
        new R(0, 0, 1),
        new R(0, 0, -1)
      ];
    }
    updateMatrices(t, e = 0) {
      const n = this.camera, i = this.matrix, s = t.distance || n.far;
      s !== n.far && (n.far = s, n.updateProjectionMatrix()), cr.setFromMatrixPosition(t.matrixWorld), n.position.copy(cr), Ul.copy(n.position), Ul.add(this._cubeDirections[e]), n.up.copy(this._cubeUps[e]), n.lookAt(Ul), n.updateMatrixWorld(), i.makeTranslation(-cr.x, -cr.y, -cr.z), $u.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix($u);
    }
  }
  class Lp extends Si {
    constructor(t, e, n = 0, i = 2) {
      super(t, e), this.isPointLight = true, this.type = "PointLight", this.distance = n, this.decay = i, this.shadow = new MM();
    }
    get power() {
      return this.intensity * 4 * Math.PI;
    }
    set power(t) {
      this.intensity = t / (4 * Math.PI);
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(t, e) {
      return super.copy(t, e), this.distance = t.distance, this.decay = t.decay, this.shadow = t.shadow.clone(), this;
    }
  }
  class SM extends fh {
    constructor() {
      super(new Ta(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = true;
    }
  }
  class da extends Si {
    constructor(t, e) {
      super(t, e), this.isDirectionalLight = true, this.type = "DirectionalLight", this.position.copy(jt.DEFAULT_UP), this.updateMatrix(), this.target = new jt(), this.shadow = new SM();
    }
    dispose() {
      this.shadow.dispose();
    }
    copy(t) {
      return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
    }
  }
  class ph extends Si {
    constructor(t, e) {
      super(t, e), this.isAmbientLight = true, this.type = "AmbientLight";
    }
  }
  class Dp extends Si {
    constructor(t, e, n = 10, i = 10) {
      super(t, e), this.isRectAreaLight = true, this.type = "RectAreaLight", this.width = n, this.height = i;
    }
    get power() {
      return this.intensity * this.width * this.height * Math.PI;
    }
    set power(t) {
      this.intensity = t / (this.width * this.height * Math.PI);
    }
    copy(t) {
      return super.copy(t), this.width = t.width, this.height = t.height, this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.object.width = this.width, e.object.height = this.height, e;
    }
  }
  class Up {
    constructor() {
      this.isSphericalHarmonics3 = true, this.coefficients = [];
      for (let t = 0; t < 9; t++) this.coefficients.push(new R());
    }
    set(t) {
      for (let e = 0; e < 9; e++) this.coefficients[e].copy(t[e]);
      return this;
    }
    zero() {
      for (let t = 0; t < 9; t++) this.coefficients[t].set(0, 0, 0);
      return this;
    }
    getAt(t, e) {
      const n = t.x, i = t.y, s = t.z, o = this.coefficients;
      return e.copy(o[0]).multiplyScalar(0.282095), e.addScaledVector(o[1], 0.488603 * i), e.addScaledVector(o[2], 0.488603 * s), e.addScaledVector(o[3], 0.488603 * n), e.addScaledVector(o[4], 1.092548 * (n * i)), e.addScaledVector(o[5], 1.092548 * (i * s)), e.addScaledVector(o[6], 0.315392 * (3 * s * s - 1)), e.addScaledVector(o[7], 1.092548 * (n * s)), e.addScaledVector(o[8], 0.546274 * (n * n - i * i)), e;
    }
    getIrradianceAt(t, e) {
      const n = t.x, i = t.y, s = t.z, o = this.coefficients;
      return e.copy(o[0]).multiplyScalar(0.886227), e.addScaledVector(o[1], 2 * 0.511664 * i), e.addScaledVector(o[2], 2 * 0.511664 * s), e.addScaledVector(o[3], 2 * 0.511664 * n), e.addScaledVector(o[4], 2 * 0.429043 * n * i), e.addScaledVector(o[5], 2 * 0.429043 * i * s), e.addScaledVector(o[6], 0.743125 * s * s - 0.247708), e.addScaledVector(o[7], 2 * 0.429043 * n * s), e.addScaledVector(o[8], 0.429043 * (n * n - i * i)), e;
    }
    add(t) {
      for (let e = 0; e < 9; e++) this.coefficients[e].add(t.coefficients[e]);
      return this;
    }
    addScaledSH(t, e) {
      for (let n = 0; n < 9; n++) this.coefficients[n].addScaledVector(t.coefficients[n], e);
      return this;
    }
    scale(t) {
      for (let e = 0; e < 9; e++) this.coefficients[e].multiplyScalar(t);
      return this;
    }
    lerp(t, e) {
      for (let n = 0; n < 9; n++) this.coefficients[n].lerp(t.coefficients[n], e);
      return this;
    }
    equals(t) {
      for (let e = 0; e < 9; e++) if (!this.coefficients[e].equals(t.coefficients[e])) return false;
      return true;
    }
    copy(t) {
      return this.set(t.coefficients);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    fromArray(t, e = 0) {
      const n = this.coefficients;
      for (let i = 0; i < 9; i++) n[i].fromArray(t, e + i * 3);
      return this;
    }
    toArray(t = [], e = 0) {
      const n = this.coefficients;
      for (let i = 0; i < 9; i++) n[i].toArray(t, e + i * 3);
      return t;
    }
    static getBasisAt(t, e) {
      const n = t.x, i = t.y, s = t.z;
      e[0] = 0.282095, e[1] = 0.488603 * i, e[2] = 0.488603 * s, e[3] = 0.488603 * n, e[4] = 1.092548 * n * i, e[5] = 1.092548 * i * s, e[6] = 0.315392 * (3 * s * s - 1), e[7] = 1.092548 * n * s, e[8] = 0.546274 * (n * n - i * i);
    }
  }
  class Np extends Si {
    constructor(t = new Up(), e = 1) {
      super(void 0, e), this.isLightProbe = true, this.sh = t;
    }
    copy(t) {
      return super.copy(t), this.sh.copy(t.sh), this;
    }
    fromJSON(t) {
      return this.intensity = t.intensity, this.sh.fromArray(t.sh), this;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.object.sh = this.sh.toArray(), e;
    }
  }
  class Wa extends $e {
    constructor(t) {
      super(t), this.textures = {};
    }
    load(t, e, n, i) {
      const s = this, o = new Qn(s.manager);
      o.setPath(s.path), o.setRequestHeader(s.requestHeader), o.setWithCredentials(s.withCredentials), o.load(t, function(a) {
        try {
          e(s.parse(JSON.parse(a)));
        } catch (l) {
          i ? i(l) : console.error(l), s.manager.itemError(t);
        }
      }, n, i);
    }
    parse(t) {
      const e = this.textures;
      function n(s) {
        return e[s] === void 0 && console.warn("THREE.MaterialLoader: Undefined texture", s), e[s];
      }
      const i = Wa.createMaterialFromType(t.type);
      if (t.uuid !== void 0 && (i.uuid = t.uuid), t.name !== void 0 && (i.name = t.name), t.color !== void 0 && i.color !== void 0 && i.color.setHex(t.color), t.roughness !== void 0 && (i.roughness = t.roughness), t.metalness !== void 0 && (i.metalness = t.metalness), t.sheen !== void 0 && (i.sheen = t.sheen), t.sheenColor !== void 0 && (i.sheenColor = new xt().setHex(t.sheenColor)), t.sheenRoughness !== void 0 && (i.sheenRoughness = t.sheenRoughness), t.emissive !== void 0 && i.emissive !== void 0 && i.emissive.setHex(t.emissive), t.specular !== void 0 && i.specular !== void 0 && i.specular.setHex(t.specular), t.specularIntensity !== void 0 && (i.specularIntensity = t.specularIntensity), t.specularColor !== void 0 && i.specularColor !== void 0 && i.specularColor.setHex(t.specularColor), t.shininess !== void 0 && (i.shininess = t.shininess), t.clearcoat !== void 0 && (i.clearcoat = t.clearcoat), t.clearcoatRoughness !== void 0 && (i.clearcoatRoughness = t.clearcoatRoughness), t.dispersion !== void 0 && (i.dispersion = t.dispersion), t.iridescence !== void 0 && (i.iridescence = t.iridescence), t.iridescenceIOR !== void 0 && (i.iridescenceIOR = t.iridescenceIOR), t.iridescenceThicknessRange !== void 0 && (i.iridescenceThicknessRange = t.iridescenceThicknessRange), t.transmission !== void 0 && (i.transmission = t.transmission), t.thickness !== void 0 && (i.thickness = t.thickness), t.attenuationDistance !== void 0 && (i.attenuationDistance = t.attenuationDistance), t.attenuationColor !== void 0 && i.attenuationColor !== void 0 && i.attenuationColor.setHex(t.attenuationColor), t.anisotropy !== void 0 && (i.anisotropy = t.anisotropy), t.anisotropyRotation !== void 0 && (i.anisotropyRotation = t.anisotropyRotation), t.fog !== void 0 && (i.fog = t.fog), t.flatShading !== void 0 && (i.flatShading = t.flatShading), t.blending !== void 0 && (i.blending = t.blending), t.combine !== void 0 && (i.combine = t.combine), t.side !== void 0 && (i.side = t.side), t.shadowSide !== void 0 && (i.shadowSide = t.shadowSide), t.opacity !== void 0 && (i.opacity = t.opacity), t.transparent !== void 0 && (i.transparent = t.transparent), t.alphaTest !== void 0 && (i.alphaTest = t.alphaTest), t.alphaHash !== void 0 && (i.alphaHash = t.alphaHash), t.depthFunc !== void 0 && (i.depthFunc = t.depthFunc), t.depthTest !== void 0 && (i.depthTest = t.depthTest), t.depthWrite !== void 0 && (i.depthWrite = t.depthWrite), t.colorWrite !== void 0 && (i.colorWrite = t.colorWrite), t.blendSrc !== void 0 && (i.blendSrc = t.blendSrc), t.blendDst !== void 0 && (i.blendDst = t.blendDst), t.blendEquation !== void 0 && (i.blendEquation = t.blendEquation), t.blendSrcAlpha !== void 0 && (i.blendSrcAlpha = t.blendSrcAlpha), t.blendDstAlpha !== void 0 && (i.blendDstAlpha = t.blendDstAlpha), t.blendEquationAlpha !== void 0 && (i.blendEquationAlpha = t.blendEquationAlpha), t.blendColor !== void 0 && i.blendColor !== void 0 && i.blendColor.setHex(t.blendColor), t.blendAlpha !== void 0 && (i.blendAlpha = t.blendAlpha), t.stencilWriteMask !== void 0 && (i.stencilWriteMask = t.stencilWriteMask), t.stencilFunc !== void 0 && (i.stencilFunc = t.stencilFunc), t.stencilRef !== void 0 && (i.stencilRef = t.stencilRef), t.stencilFuncMask !== void 0 && (i.stencilFuncMask = t.stencilFuncMask), t.stencilFail !== void 0 && (i.stencilFail = t.stencilFail), t.stencilZFail !== void 0 && (i.stencilZFail = t.stencilZFail), t.stencilZPass !== void 0 && (i.stencilZPass = t.stencilZPass), t.stencilWrite !== void 0 && (i.stencilWrite = t.stencilWrite), t.wireframe !== void 0 && (i.wireframe = t.wireframe), t.wireframeLinewidth !== void 0 && (i.wireframeLinewidth = t.wireframeLinewidth), t.wireframeLinecap !== void 0 && (i.wireframeLinecap = t.wireframeLinecap), t.wireframeLinejoin !== void 0 && (i.wireframeLinejoin = t.wireframeLinejoin), t.rotation !== void 0 && (i.rotation = t.rotation), t.linewidth !== void 0 && (i.linewidth = t.linewidth), t.dashSize !== void 0 && (i.dashSize = t.dashSize), t.gapSize !== void 0 && (i.gapSize = t.gapSize), t.scale !== void 0 && (i.scale = t.scale), t.polygonOffset !== void 0 && (i.polygonOffset = t.polygonOffset), t.polygonOffsetFactor !== void 0 && (i.polygonOffsetFactor = t.polygonOffsetFactor), t.polygonOffsetUnits !== void 0 && (i.polygonOffsetUnits = t.polygonOffsetUnits), t.dithering !== void 0 && (i.dithering = t.dithering), t.alphaToCoverage !== void 0 && (i.alphaToCoverage = t.alphaToCoverage), t.premultipliedAlpha !== void 0 && (i.premultipliedAlpha = t.premultipliedAlpha), t.forceSinglePass !== void 0 && (i.forceSinglePass = t.forceSinglePass), t.visible !== void 0 && (i.visible = t.visible), t.toneMapped !== void 0 && (i.toneMapped = t.toneMapped), t.userData !== void 0 && (i.userData = t.userData), t.vertexColors !== void 0 && (typeof t.vertexColors == "number" ? i.vertexColors = t.vertexColors > 0 : i.vertexColors = t.vertexColors), t.uniforms !== void 0) for (const s in t.uniforms) {
        const o = t.uniforms[s];
        switch (i.uniforms[s] = {}, o.type) {
          case "t":
            i.uniforms[s].value = n(o.value);
            break;
          case "c":
            i.uniforms[s].value = new xt().setHex(o.value);
            break;
          case "v2":
            i.uniforms[s].value = new et().fromArray(o.value);
            break;
          case "v3":
            i.uniforms[s].value = new R().fromArray(o.value);
            break;
          case "v4":
            i.uniforms[s].value = new ie().fromArray(o.value);
            break;
          case "m3":
            i.uniforms[s].value = new Bt().fromArray(o.value);
            break;
          case "m4":
            i.uniforms[s].value = new Dt().fromArray(o.value);
            break;
          default:
            i.uniforms[s].value = o.value;
        }
      }
      if (t.defines !== void 0 && (i.defines = t.defines), t.vertexShader !== void 0 && (i.vertexShader = t.vertexShader), t.fragmentShader !== void 0 && (i.fragmentShader = t.fragmentShader), t.glslVersion !== void 0 && (i.glslVersion = t.glslVersion), t.extensions !== void 0) for (const s in t.extensions) i.extensions[s] = t.extensions[s];
      if (t.lights !== void 0 && (i.lights = t.lights), t.clipping !== void 0 && (i.clipping = t.clipping), t.size !== void 0 && (i.size = t.size), t.sizeAttenuation !== void 0 && (i.sizeAttenuation = t.sizeAttenuation), t.map !== void 0 && (i.map = n(t.map)), t.matcap !== void 0 && (i.matcap = n(t.matcap)), t.alphaMap !== void 0 && (i.alphaMap = n(t.alphaMap)), t.bumpMap !== void 0 && (i.bumpMap = n(t.bumpMap)), t.bumpScale !== void 0 && (i.bumpScale = t.bumpScale), t.normalMap !== void 0 && (i.normalMap = n(t.normalMap)), t.normalMapType !== void 0 && (i.normalMapType = t.normalMapType), t.normalScale !== void 0) {
        let s = t.normalScale;
        Array.isArray(s) === false && (s = [
          s,
          s
        ]), i.normalScale = new et().fromArray(s);
      }
      return t.displacementMap !== void 0 && (i.displacementMap = n(t.displacementMap)), t.displacementScale !== void 0 && (i.displacementScale = t.displacementScale), t.displacementBias !== void 0 && (i.displacementBias = t.displacementBias), t.roughnessMap !== void 0 && (i.roughnessMap = n(t.roughnessMap)), t.metalnessMap !== void 0 && (i.metalnessMap = n(t.metalnessMap)), t.emissiveMap !== void 0 && (i.emissiveMap = n(t.emissiveMap)), t.emissiveIntensity !== void 0 && (i.emissiveIntensity = t.emissiveIntensity), t.specularMap !== void 0 && (i.specularMap = n(t.specularMap)), t.specularIntensityMap !== void 0 && (i.specularIntensityMap = n(t.specularIntensityMap)), t.specularColorMap !== void 0 && (i.specularColorMap = n(t.specularColorMap)), t.envMap !== void 0 && (i.envMap = n(t.envMap)), t.envMapRotation !== void 0 && i.envMapRotation.fromArray(t.envMapRotation), t.envMapIntensity !== void 0 && (i.envMapIntensity = t.envMapIntensity), t.reflectivity !== void 0 && (i.reflectivity = t.reflectivity), t.refractionRatio !== void 0 && (i.refractionRatio = t.refractionRatio), t.lightMap !== void 0 && (i.lightMap = n(t.lightMap)), t.lightMapIntensity !== void 0 && (i.lightMapIntensity = t.lightMapIntensity), t.aoMap !== void 0 && (i.aoMap = n(t.aoMap)), t.aoMapIntensity !== void 0 && (i.aoMapIntensity = t.aoMapIntensity), t.gradientMap !== void 0 && (i.gradientMap = n(t.gradientMap)), t.clearcoatMap !== void 0 && (i.clearcoatMap = n(t.clearcoatMap)), t.clearcoatRoughnessMap !== void 0 && (i.clearcoatRoughnessMap = n(t.clearcoatRoughnessMap)), t.clearcoatNormalMap !== void 0 && (i.clearcoatNormalMap = n(t.clearcoatNormalMap)), t.clearcoatNormalScale !== void 0 && (i.clearcoatNormalScale = new et().fromArray(t.clearcoatNormalScale)), t.iridescenceMap !== void 0 && (i.iridescenceMap = n(t.iridescenceMap)), t.iridescenceThicknessMap !== void 0 && (i.iridescenceThicknessMap = n(t.iridescenceThicknessMap)), t.transmissionMap !== void 0 && (i.transmissionMap = n(t.transmissionMap)), t.thicknessMap !== void 0 && (i.thicknessMap = n(t.thicknessMap)), t.anisotropyMap !== void 0 && (i.anisotropyMap = n(t.anisotropyMap)), t.sheenColorMap !== void 0 && (i.sheenColorMap = n(t.sheenColorMap)), t.sheenRoughnessMap !== void 0 && (i.sheenRoughnessMap = n(t.sheenRoughnessMap)), i;
    }
    setTextures(t) {
      return this.textures = t, this;
    }
    static createMaterialFromType(t) {
      const e = {
        ShadowMaterial: mp,
        SpriteMaterial: th,
        RawShaderMaterial: gp,
        ShaderMaterial: Sn,
        PointsMaterial: nh,
        MeshPhysicalMaterial: _p,
        MeshStandardMaterial: Be,
        MeshPhongMaterial: xp,
        MeshToonMaterial: vp,
        MeshNormalMaterial: yp,
        MeshLambertMaterial: Mp,
        MeshDepthMaterial: Kc,
        MeshDistanceMaterial: Qc,
        MeshBasicMaterial: yi,
        MeshMatcapMaterial: Sp,
        LineDashedMaterial: bp,
        LineBasicMaterial: He,
        Material: Ne
      };
      return new e[t]();
    }
  }
  class Tc {
    static decodeText(t) {
      if (typeof TextDecoder < "u") return new TextDecoder().decode(t);
      let e = "";
      for (let n = 0, i = t.length; n < i; n++) e += String.fromCharCode(t[n]);
      try {
        return decodeURIComponent(escape(e));
      } catch {
        return e;
      }
    }
    static extractUrlBase(t) {
      const e = t.lastIndexOf("/");
      return e === -1 ? "./" : t.slice(0, e + 1);
    }
    static resolveURL(t, e) {
      return typeof t != "string" || t === "" ? "" : (/^https?:\/\//i.test(e) && /^\//.test(t) && (e = e.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(t) || /^data:.*,.*$/i.test(t) || /^blob:.*$/i.test(t) ? t : e + t);
    }
  }
  class Op extends Wt {
    constructor() {
      super(), this.isInstancedBufferGeometry = true, this.type = "InstancedBufferGeometry", this.instanceCount = 1 / 0;
    }
    copy(t) {
      return super.copy(t), this.instanceCount = t.instanceCount, this;
    }
    toJSON() {
      const t = super.toJSON();
      return t.instanceCount = this.instanceCount, t.isInstancedBufferGeometry = true, t;
    }
  }
  class zp extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = new Qn(s.manager);
      o.setPath(s.path), o.setRequestHeader(s.requestHeader), o.setWithCredentials(s.withCredentials), o.load(t, function(a) {
        try {
          e(s.parse(JSON.parse(a)));
        } catch (l) {
          i ? i(l) : console.error(l), s.manager.itemError(t);
        }
      }, n, i);
    }
    parse(t) {
      const e = {}, n = {};
      function i(f, m) {
        if (e[m] !== void 0) return e[m];
        const g = f.interleavedBuffers[m], p = s(f, g.buffer), v = Cs(g.type, p), x = new Ra(v, g.stride);
        return x.uuid = g.uuid, e[m] = x, x;
      }
      function s(f, m) {
        if (n[m] !== void 0) return n[m];
        const g = f.arrayBuffers[m], p = new Uint32Array(g).buffer;
        return n[m] = p, p;
      }
      const o = t.isInstancedBufferGeometry ? new Op() : new Wt(), a = t.data.index;
      if (a !== void 0) {
        const f = Cs(a.type, a.array);
        o.setIndex(new se(f, 1));
      }
      const l = t.data.attributes;
      for (const f in l) {
        const m = l[f];
        let _;
        if (m.isInterleavedBufferAttribute) {
          const g = i(t.data, m.data);
          _ = new Zi(g, m.itemSize, m.offset, m.normalized);
        } else {
          const g = Cs(m.type, m.array), p = m.isInstancedBufferAttribute ? Bs : se;
          _ = new p(g, m.itemSize, m.normalized);
        }
        m.name !== void 0 && (_.name = m.name), m.usage !== void 0 && _.setUsage(m.usage), o.setAttribute(f, _);
      }
      const c = t.data.morphAttributes;
      if (c) for (const f in c) {
        const m = c[f], _ = [];
        for (let g = 0, p = m.length; g < p; g++) {
          const v = m[g];
          let x;
          if (v.isInterleavedBufferAttribute) {
            const S = i(t.data, v.data);
            x = new Zi(S, v.itemSize, v.offset, v.normalized);
          } else {
            const S = Cs(v.type, v.array);
            x = new se(S, v.itemSize, v.normalized);
          }
          v.name !== void 0 && (x.name = v.name), _.push(x);
        }
        o.morphAttributes[f] = _;
      }
      t.data.morphTargetsRelative && (o.morphTargetsRelative = true);
      const d = t.data.groups || t.data.drawcalls || t.data.offsets;
      if (d !== void 0) for (let f = 0, m = d.length; f !== m; ++f) {
        const _ = d[f];
        o.addGroup(_.start, _.count, _.materialIndex);
      }
      const u = t.data.boundingSphere;
      if (u !== void 0) {
        const f = new R();
        u.center !== void 0 && f.fromArray(u.center), o.boundingSphere = new Ue(f, u.radius);
      }
      return t.name && (o.name = t.name), t.userData && (o.userData = t.userData), o;
    }
  }
  class bM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = this.path === "" ? Tc.extractUrlBase(t) : this.path;
      this.resourcePath = this.resourcePath || o;
      const a = new Qn(this.manager);
      a.setPath(this.path), a.setRequestHeader(this.requestHeader), a.setWithCredentials(this.withCredentials), a.load(t, function(l) {
        let c = null;
        try {
          c = JSON.parse(l);
        } catch (d) {
          i !== void 0 && i(d), console.error("THREE:ObjectLoader: Can't parse " + t + ".", d.message);
          return;
        }
        const h = c.metadata;
        if (h === void 0 || h.type === void 0 || h.type.toLowerCase() === "geometry") {
          i !== void 0 && i(new Error("THREE.ObjectLoader: Can't load " + t)), console.error("THREE.ObjectLoader: Can't load " + t);
          return;
        }
        s.parse(c, e);
      }, n, i);
    }
    async loadAsync(t, e) {
      const n = this, i = this.path === "" ? Tc.extractUrlBase(t) : this.path;
      this.resourcePath = this.resourcePath || i;
      const s = new Qn(this.manager);
      s.setPath(this.path), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials);
      const o = await s.loadAsync(t, e), a = JSON.parse(o), l = a.metadata;
      if (l === void 0 || l.type === void 0 || l.type.toLowerCase() === "geometry") throw new Error("THREE.ObjectLoader: Can't load " + t);
      return await n.parseAsync(a);
    }
    parse(t, e) {
      const n = this.parseAnimations(t.animations), i = this.parseShapes(t.shapes), s = this.parseGeometries(t.geometries, i), o = this.parseImages(t.images, function() {
        e !== void 0 && e(c);
      }), a = this.parseTextures(t.textures, o), l = this.parseMaterials(t.materials, a), c = this.parseObject(t.object, s, l, a, n), h = this.parseSkeletons(t.skeletons, c);
      if (this.bindSkeletons(c, h), e !== void 0) {
        let d = false;
        for (const u in o) if (o[u].data instanceof HTMLImageElement) {
          d = true;
          break;
        }
        d === false && e(c);
      }
      return c;
    }
    async parseAsync(t) {
      const e = this.parseAnimations(t.animations), n = this.parseShapes(t.shapes), i = this.parseGeometries(t.geometries, n), s = await this.parseImagesAsync(t.images), o = this.parseTextures(t.textures, s), a = this.parseMaterials(t.materials, o), l = this.parseObject(t.object, i, a, o, e), c = this.parseSkeletons(t.skeletons, l);
      return this.bindSkeletons(l, c), l;
    }
    parseShapes(t) {
      const e = {};
      if (t !== void 0) for (let n = 0, i = t.length; n < i; n++) {
        const s = new Ae().fromJSON(t[n]);
        e[s.uuid] = s;
      }
      return e;
    }
    parseSkeletons(t, e) {
      const n = {}, i = {};
      if (e.traverse(function(s) {
        s.isBone && (i[s.uuid] = s);
      }), t !== void 0) for (let s = 0, o = t.length; s < o; s++) {
        const a = new Pa().fromJSON(t[s], i);
        n[a.uuid] = a;
      }
      return n;
    }
    parseGeometries(t, e) {
      const n = {};
      if (t !== void 0) {
        const i = new zp();
        for (let s = 0, o = t.length; s < o; s++) {
          let a;
          const l = t[s];
          switch (l.type) {
            case "BufferGeometry":
            case "InstancedBufferGeometry":
              a = i.parse(l);
              break;
            default:
              l.type in Xu ? a = Xu[l.type].fromJSON(l, e) : console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`);
          }
          a.uuid = l.uuid, l.name !== void 0 && (a.name = l.name), l.userData !== void 0 && (a.userData = l.userData), n[l.uuid] = a;
        }
      }
      return n;
    }
    parseMaterials(t, e) {
      const n = {}, i = {};
      if (t !== void 0) {
        const s = new Wa();
        s.setTextures(e);
        for (let o = 0, a = t.length; o < a; o++) {
          const l = t[o];
          n[l.uuid] === void 0 && (n[l.uuid] = s.parse(l)), i[l.uuid] = n[l.uuid];
        }
      }
      return i;
    }
    parseAnimations(t) {
      const e = {};
      if (t !== void 0) for (let n = 0; n < t.length; n++) {
        const i = t[n], s = Vr.parse(i);
        e[s.uuid] = s;
      }
      return e;
    }
    parseImages(t, e) {
      const n = this, i = {};
      let s;
      function o(l) {
        return n.manager.itemStart(l), s.load(l, function() {
          n.manager.itemEnd(l);
        }, void 0, function() {
          n.manager.itemError(l), n.manager.itemEnd(l);
        });
      }
      function a(l) {
        if (typeof l == "string") {
          const c = l, h = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(c) ? c : n.resourcePath + c;
          return o(h);
        } else return l.data ? {
          data: Cs(l.type, l.data),
          width: l.width,
          height: l.height
        } : null;
      }
      if (t !== void 0 && t.length > 0) {
        const l = new dh(e);
        s = new Hr(l), s.setCrossOrigin(this.crossOrigin);
        for (let c = 0, h = t.length; c < h; c++) {
          const d = t[c], u = d.url;
          if (Array.isArray(u)) {
            const f = [];
            for (let m = 0, _ = u.length; m < _; m++) {
              const g = u[m], p = a(g);
              p !== null && (p instanceof HTMLImageElement ? f.push(p) : f.push(new pi(p.data, p.width, p.height)));
            }
            i[d.uuid] = new Vi(f);
          } else {
            const f = a(d.url);
            i[d.uuid] = new Vi(f);
          }
        }
      }
      return i;
    }
    async parseImagesAsync(t) {
      const e = this, n = {};
      let i;
      async function s(o) {
        if (typeof o == "string") {
          const a = o, l = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(a) ? a : e.resourcePath + a;
          return await i.loadAsync(l);
        } else return o.data ? {
          data: Cs(o.type, o.data),
          width: o.width,
          height: o.height
        } : null;
      }
      if (t !== void 0 && t.length > 0) {
        i = new Hr(this.manager), i.setCrossOrigin(this.crossOrigin);
        for (let o = 0, a = t.length; o < a; o++) {
          const l = t[o], c = l.url;
          if (Array.isArray(c)) {
            const h = [];
            for (let d = 0, u = c.length; d < u; d++) {
              const f = c[d], m = await s(f);
              m !== null && (m instanceof HTMLImageElement ? h.push(m) : h.push(new pi(m.data, m.width, m.height)));
            }
            n[l.uuid] = new Vi(h);
          } else {
            const h = await s(l.url);
            n[l.uuid] = new Vi(h);
          }
        }
      }
      return n;
    }
    parseTextures(t, e) {
      function n(s, o) {
        return typeof s == "number" ? s : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", s), o[s]);
      }
      const i = {};
      if (t !== void 0) for (let s = 0, o = t.length; s < o; s++) {
        const a = t[s];
        a.image === void 0 && console.warn('THREE.ObjectLoader: No "image" specified for', a.uuid), e[a.image] === void 0 && console.warn("THREE.ObjectLoader: Undefined image", a.image);
        const l = e[a.image], c = l.data;
        let h;
        Array.isArray(c) ? (h = new Zr(), c.length === 6 && (h.needsUpdate = true)) : (c && c.data ? h = new pi() : h = new fe(), c && (h.needsUpdate = true)), h.source = l, h.uuid = a.uuid, a.name !== void 0 && (h.name = a.name), a.mapping !== void 0 && (h.mapping = n(a.mapping, wM)), a.channel !== void 0 && (h.channel = a.channel), a.offset !== void 0 && h.offset.fromArray(a.offset), a.repeat !== void 0 && h.repeat.fromArray(a.repeat), a.center !== void 0 && h.center.fromArray(a.center), a.rotation !== void 0 && (h.rotation = a.rotation), a.wrap !== void 0 && (h.wrapS = n(a.wrap[0], Zu), h.wrapT = n(a.wrap[1], Zu)), a.format !== void 0 && (h.format = a.format), a.internalFormat !== void 0 && (h.internalFormat = a.internalFormat), a.type !== void 0 && (h.type = a.type), a.colorSpace !== void 0 && (h.colorSpace = a.colorSpace), a.minFilter !== void 0 && (h.minFilter = n(a.minFilter, Ju)), a.magFilter !== void 0 && (h.magFilter = n(a.magFilter, Ju)), a.anisotropy !== void 0 && (h.anisotropy = a.anisotropy), a.flipY !== void 0 && (h.flipY = a.flipY), a.generateMipmaps !== void 0 && (h.generateMipmaps = a.generateMipmaps), a.premultiplyAlpha !== void 0 && (h.premultiplyAlpha = a.premultiplyAlpha), a.unpackAlignment !== void 0 && (h.unpackAlignment = a.unpackAlignment), a.compareFunction !== void 0 && (h.compareFunction = a.compareFunction), a.userData !== void 0 && (h.userData = a.userData), i[a.uuid] = h;
      }
      return i;
    }
    parseObject(t, e, n, i, s) {
      let o;
      function a(u) {
        return e[u] === void 0 && console.warn("THREE.ObjectLoader: Undefined geometry", u), e[u];
      }
      function l(u) {
        if (u !== void 0) {
          if (Array.isArray(u)) {
            const f = [];
            for (let m = 0, _ = u.length; m < _; m++) {
              const g = u[m];
              n[g] === void 0 && console.warn("THREE.ObjectLoader: Undefined material", g), f.push(n[g]);
            }
            return f;
          }
          return n[u] === void 0 && console.warn("THREE.ObjectLoader: Undefined material", u), n[u];
        }
      }
      function c(u) {
        return i[u] === void 0 && console.warn("THREE.ObjectLoader: Undefined texture", u), i[u];
      }
      let h, d;
      switch (t.type) {
        case "Scene":
          o = new jc(), t.background !== void 0 && (Number.isInteger(t.background) ? o.background = new xt(t.background) : o.background = c(t.background)), t.environment !== void 0 && (o.environment = c(t.environment)), t.fog !== void 0 && (t.fog.type === "Fog" ? o.fog = new Ca(t.fog.color, t.fog.near, t.fog.far) : t.fog.type === "FogExp2" && (o.fog = new Ea(t.fog.color, t.fog.density)), t.fog.name !== "" && (o.fog.name = t.fog.name)), t.backgroundBlurriness !== void 0 && (o.backgroundBlurriness = t.backgroundBlurriness), t.backgroundIntensity !== void 0 && (o.backgroundIntensity = t.backgroundIntensity), t.backgroundRotation !== void 0 && o.backgroundRotation.fromArray(t.backgroundRotation), t.environmentIntensity !== void 0 && (o.environmentIntensity = t.environmentIntensity), t.environmentRotation !== void 0 && o.environmentRotation.fromArray(t.environmentRotation);
          break;
        case "PerspectiveCamera":
          o = new be(t.fov, t.aspect, t.near, t.far), t.focus !== void 0 && (o.focus = t.focus), t.zoom !== void 0 && (o.zoom = t.zoom), t.filmGauge !== void 0 && (o.filmGauge = t.filmGauge), t.filmOffset !== void 0 && (o.filmOffset = t.filmOffset), t.view !== void 0 && (o.view = Object.assign({}, t.view));
          break;
        case "OrthographicCamera":
          o = new Ta(t.left, t.right, t.top, t.bottom, t.near, t.far), t.zoom !== void 0 && (o.zoom = t.zoom), t.view !== void 0 && (o.view = Object.assign({}, t.view));
          break;
        case "AmbientLight":
          o = new ph(t.color, t.intensity);
          break;
        case "DirectionalLight":
          o = new da(t.color, t.intensity);
          break;
        case "PointLight":
          o = new Lp(t.color, t.intensity, t.distance, t.decay);
          break;
        case "RectAreaLight":
          o = new Dp(t.color, t.intensity, t.width, t.height);
          break;
        case "SpotLight":
          o = new Ip(t.color, t.intensity, t.distance, t.angle, t.penumbra, t.decay);
          break;
        case "HemisphereLight":
          o = new Pp(t.color, t.groundColor, t.intensity);
          break;
        case "LightProbe":
          o = new Np().fromJSON(t);
          break;
        case "SkinnedMesh":
          h = a(t.geometry), d = l(t.material), o = new jf(h, d), t.bindMode !== void 0 && (o.bindMode = t.bindMode), t.bindMatrix !== void 0 && o.bindMatrix.fromArray(t.bindMatrix), t.skeleton !== void 0 && (o.skeleton = t.skeleton);
          break;
        case "Mesh":
          h = a(t.geometry), d = l(t.material), o = new ae(h, d);
          break;
        case "InstancedMesh":
          h = a(t.geometry), d = l(t.material);
          const u = t.count, f = t.instanceMatrix, m = t.instanceColor;
          o = new tp(h, d, u), o.instanceMatrix = new Bs(new Float32Array(f.array), 16), m !== void 0 && (o.instanceColor = new Bs(new Float32Array(m.array), m.itemSize));
          break;
        case "BatchedMesh":
          h = a(t.geometry), d = l(t.material), o = new ep(t.maxGeometryCount, t.maxVertexCount, t.maxIndexCount, d), o.geometry = h, o.perObjectFrustumCulled = t.perObjectFrustumCulled, o.sortObjects = t.sortObjects, o._drawRanges = t.drawRanges, o._reservedRanges = t.reservedRanges, o._visibility = t.visibility, o._active = t.active, o._bounds = t.bounds.map((_) => {
            const g = new De();
            g.min.fromArray(_.boxMin), g.max.fromArray(_.boxMax);
            const p = new Ue();
            return p.radius = _.sphereRadius, p.center.fromArray(_.sphereCenter), {
              boxInitialized: _.boxInitialized,
              box: g,
              sphereInitialized: _.sphereInitialized,
              sphere: p
            };
          }), o._maxGeometryCount = t.maxGeometryCount, o._maxVertexCount = t.maxVertexCount, o._maxIndexCount = t.maxIndexCount, o._geometryInitialized = t.geometryInitialized, o._geometryCount = t.geometryCount, o._matricesTexture = c(t.matricesTexture.uuid);
          break;
        case "LOD":
          o = new Qf();
          break;
        case "Line":
          o = new xi(a(t.geometry), l(t.material));
          break;
        case "LineLoop":
          o = new np(a(t.geometry), l(t.material));
          break;
        case "LineSegments":
          o = new Dn(a(t.geometry), l(t.material));
          break;
        case "PointCloud":
        case "Points":
          o = new ip(a(t.geometry), l(t.material));
          break;
        case "Sprite":
          o = new Kf(l(t.material));
          break;
        case "Group":
          o = new vn();
          break;
        case "Bone":
          o = new eh();
          break;
        default:
          o = new jt();
      }
      if (o.uuid = t.uuid, t.name !== void 0 && (o.name = t.name), t.matrix !== void 0 ? (o.matrix.fromArray(t.matrix), t.matrixAutoUpdate !== void 0 && (o.matrixAutoUpdate = t.matrixAutoUpdate), o.matrixAutoUpdate && o.matrix.decompose(o.position, o.quaternion, o.scale)) : (t.position !== void 0 && o.position.fromArray(t.position), t.rotation !== void 0 && o.rotation.fromArray(t.rotation), t.quaternion !== void 0 && o.quaternion.fromArray(t.quaternion), t.scale !== void 0 && o.scale.fromArray(t.scale)), t.up !== void 0 && o.up.fromArray(t.up), t.castShadow !== void 0 && (o.castShadow = t.castShadow), t.receiveShadow !== void 0 && (o.receiveShadow = t.receiveShadow), t.shadow && (t.shadow.bias !== void 0 && (o.shadow.bias = t.shadow.bias), t.shadow.normalBias !== void 0 && (o.shadow.normalBias = t.shadow.normalBias), t.shadow.radius !== void 0 && (o.shadow.radius = t.shadow.radius), t.shadow.mapSize !== void 0 && o.shadow.mapSize.fromArray(t.shadow.mapSize), t.shadow.camera !== void 0 && (o.shadow.camera = this.parseObject(t.shadow.camera))), t.visible !== void 0 && (o.visible = t.visible), t.frustumCulled !== void 0 && (o.frustumCulled = t.frustumCulled), t.renderOrder !== void 0 && (o.renderOrder = t.renderOrder), t.userData !== void 0 && (o.userData = t.userData), t.layers !== void 0 && (o.layers.mask = t.layers), t.children !== void 0) {
        const u = t.children;
        for (let f = 0; f < u.length; f++) o.add(this.parseObject(u[f], e, n, i, s));
      }
      if (t.animations !== void 0) {
        const u = t.animations;
        for (let f = 0; f < u.length; f++) {
          const m = u[f];
          o.animations.push(s[m]);
        }
      }
      if (t.type === "LOD") {
        t.autoUpdate !== void 0 && (o.autoUpdate = t.autoUpdate);
        const u = t.levels;
        for (let f = 0; f < u.length; f++) {
          const m = u[f], _ = o.getObjectByProperty("uuid", m.object);
          _ !== void 0 && o.addLevel(_, m.distance, m.hysteresis);
        }
      }
      return o;
    }
    bindSkeletons(t, e) {
      Object.keys(e).length !== 0 && t.traverse(function(n) {
        if (n.isSkinnedMesh === true && n.skeleton !== void 0) {
          const i = e[n.skeleton];
          i === void 0 ? console.warn("THREE.ObjectLoader: No skeleton found with UUID:", n.skeleton) : n.bind(i, n.bindMatrix);
        }
      });
    }
  }
  const wM = {
    UVMapping: va,
    CubeReflectionMapping: Jn,
    CubeRefractionMapping: _i,
    EquirectangularReflectionMapping: Ns,
    EquirectangularRefractionMapping: wr,
    CubeUVReflectionMapping: Vs
  }, Zu = {
    RepeatWrapping: Tr,
    ClampToEdgeWrapping: dn,
    MirroredRepeatWrapping: Ar
  }, Ju = {
    NearestFilter: we,
    NearestMipmapNearestFilter: Uc,
    NearestMipmapLinearFilter: Es,
    LinearFilter: xe,
    LinearMipmapNearestFilter: gr,
    LinearMipmapLinearFilter: Cn
  };
  class TM extends $e {
    constructor(t) {
      super(t), this.isImageBitmapLoader = true, typeof createImageBitmap > "u" && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), this.options = {
        premultiplyAlpha: "none"
      };
    }
    setOptions(t) {
      return this.options = t, this;
    }
    load(t, e, n, i) {
      t === void 0 && (t = ""), this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
      const s = this, o = Gn.get(t);
      if (o !== void 0) {
        if (s.manager.itemStart(t), o.then) {
          o.then((c) => {
            e && e(c), s.manager.itemEnd(t);
          }).catch((c) => {
            i && i(c);
          });
          return;
        }
        return setTimeout(function() {
          e && e(o), s.manager.itemEnd(t);
        }, 0), o;
      }
      const a = {};
      a.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", a.headers = this.requestHeader;
      const l = fetch(t, a).then(function(c) {
        return c.blob();
      }).then(function(c) {
        return createImageBitmap(c, Object.assign(s.options, {
          colorSpaceConversion: "none"
        }));
      }).then(function(c) {
        return Gn.add(t, c), e && e(c), s.manager.itemEnd(t), c;
      }).catch(function(c) {
        i && i(c), Gn.remove(t), s.manager.itemError(t), s.manager.itemEnd(t);
      });
      Gn.add(t, l), s.manager.itemStart(t);
    }
  }
  let Yo;
  class mh {
    static getContext() {
      return Yo === void 0 && (Yo = new (window.AudioContext || window.webkitAudioContext)()), Yo;
    }
    static setContext(t) {
      Yo = t;
    }
  }
  class AM extends $e {
    constructor(t) {
      super(t);
    }
    load(t, e, n, i) {
      const s = this, o = new Qn(this.manager);
      o.setResponseType("arraybuffer"), o.setPath(this.path), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(t, function(l) {
        try {
          const c = l.slice(0);
          mh.getContext().decodeAudioData(c, function(d) {
            e(d);
          }).catch(a);
        } catch (c) {
          a(c);
        }
      }, n, i);
      function a(l) {
        i ? i(l) : console.error(l), s.manager.itemError(t);
      }
    }
  }
  const Ku = new Dt(), Qu = new Dt(), Ii = new Dt();
  class EM {
    constructor() {
      this.type = "StereoCamera", this.aspect = 1, this.eyeSep = 0.064, this.cameraL = new be(), this.cameraL.layers.enable(1), this.cameraL.matrixAutoUpdate = false, this.cameraR = new be(), this.cameraR.layers.enable(2), this.cameraR.matrixAutoUpdate = false, this._cache = {
        focus: null,
        fov: null,
        aspect: null,
        near: null,
        far: null,
        zoom: null,
        eyeSep: null
      };
    }
    update(t) {
      const e = this._cache;
      if (e.focus !== t.focus || e.fov !== t.fov || e.aspect !== t.aspect * this.aspect || e.near !== t.near || e.far !== t.far || e.zoom !== t.zoom || e.eyeSep !== this.eyeSep) {
        e.focus = t.focus, e.fov = t.fov, e.aspect = t.aspect * this.aspect, e.near = t.near, e.far = t.far, e.zoom = t.zoom, e.eyeSep = this.eyeSep, Ii.copy(t.projectionMatrix);
        const i = e.eyeSep / 2, s = i * e.near / e.focus, o = e.near * Math.tan(Xi * e.fov * 0.5) / e.zoom;
        let a, l;
        Qu.elements[12] = -i, Ku.elements[12] = i, a = -o * e.aspect + s, l = o * e.aspect + s, Ii.elements[0] = 2 * e.near / (l - a), Ii.elements[8] = (l + a) / (l - a), this.cameraL.projectionMatrix.copy(Ii), a = -o * e.aspect - s, l = o * e.aspect - s, Ii.elements[0] = 2 * e.near / (l - a), Ii.elements[8] = (l + a) / (l - a), this.cameraR.projectionMatrix.copy(Ii);
      }
      this.cameraL.matrixWorld.copy(t.matrixWorld).multiply(Qu), this.cameraR.matrixWorld.copy(t.matrixWorld).multiply(Ku);
    }
  }
  class Fp {
    constructor(t = true) {
      this.autoStart = t, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = false;
    }
    start() {
      this.startTime = ju(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = true;
    }
    stop() {
      this.getElapsedTime(), this.running = false, this.autoStart = false;
    }
    getElapsedTime() {
      return this.getDelta(), this.elapsedTime;
    }
    getDelta() {
      let t = 0;
      if (this.autoStart && !this.running) return this.start(), 0;
      if (this.running) {
        const e = ju();
        t = (e - this.oldTime) / 1e3, this.oldTime = e, this.elapsedTime += t;
      }
      return t;
    }
  }
  function ju() {
    return (typeof performance > "u" ? Date : performance).now();
  }
  const Li = new R(), td = new qe(), CM = new R(), Di = new R();
  class RM extends jt {
    constructor() {
      super(), this.type = "AudioListener", this.context = mh.getContext(), this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.filter = null, this.timeDelta = 0, this._clock = new Fp();
    }
    getInput() {
      return this.gain;
    }
    removeFilter() {
      return this.filter !== null && (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination), this.gain.connect(this.context.destination), this.filter = null), this;
    }
    getFilter() {
      return this.filter;
    }
    setFilter(t) {
      return this.filter !== null ? (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination)) : this.gain.disconnect(this.context.destination), this.filter = t, this.gain.connect(this.filter), this.filter.connect(this.context.destination), this;
    }
    getMasterVolume() {
      return this.gain.gain.value;
    }
    setMasterVolume(t) {
      return this.gain.gain.setTargetAtTime(t, this.context.currentTime, 0.01), this;
    }
    updateMatrixWorld(t) {
      super.updateMatrixWorld(t);
      const e = this.context.listener, n = this.up;
      if (this.timeDelta = this._clock.getDelta(), this.matrixWorld.decompose(Li, td, CM), Di.set(0, 0, -1).applyQuaternion(td), e.positionX) {
        const i = this.context.currentTime + this.timeDelta;
        e.positionX.linearRampToValueAtTime(Li.x, i), e.positionY.linearRampToValueAtTime(Li.y, i), e.positionZ.linearRampToValueAtTime(Li.z, i), e.forwardX.linearRampToValueAtTime(Di.x, i), e.forwardY.linearRampToValueAtTime(Di.y, i), e.forwardZ.linearRampToValueAtTime(Di.z, i), e.upX.linearRampToValueAtTime(n.x, i), e.upY.linearRampToValueAtTime(n.y, i), e.upZ.linearRampToValueAtTime(n.z, i);
      } else e.setPosition(Li.x, Li.y, Li.z), e.setOrientation(Di.x, Di.y, Di.z, n.x, n.y, n.z);
    }
  }
  class Bp extends jt {
    constructor(t) {
      super(), this.type = "Audio", this.listener = t, this.context = t.context, this.gain = this.context.createGain(), this.gain.connect(t.getInput()), this.autoplay = false, this.buffer = null, this.detune = 0, this.loop = false, this.loopStart = 0, this.loopEnd = 0, this.offset = 0, this.duration = void 0, this.playbackRate = 1, this.isPlaying = false, this.hasPlaybackControl = true, this.source = null, this.sourceType = "empty", this._startedAt = 0, this._progress = 0, this._connected = false, this.filters = [];
    }
    getOutput() {
      return this.gain;
    }
    setNodeSource(t) {
      return this.hasPlaybackControl = false, this.sourceType = "audioNode", this.source = t, this.connect(), this;
    }
    setMediaElementSource(t) {
      return this.hasPlaybackControl = false, this.sourceType = "mediaNode", this.source = this.context.createMediaElementSource(t), this.connect(), this;
    }
    setMediaStreamSource(t) {
      return this.hasPlaybackControl = false, this.sourceType = "mediaStreamNode", this.source = this.context.createMediaStreamSource(t), this.connect(), this;
    }
    setBuffer(t) {
      return this.buffer = t, this.sourceType = "buffer", this.autoplay && this.play(), this;
    }
    play(t = 0) {
      if (this.isPlaying === true) {
        console.warn("THREE.Audio: Audio is already playing.");
        return;
      }
      if (this.hasPlaybackControl === false) {
        console.warn("THREE.Audio: this Audio has no playback control.");
        return;
      }
      this._startedAt = this.context.currentTime + t;
      const e = this.context.createBufferSource();
      return e.buffer = this.buffer, e.loop = this.loop, e.loopStart = this.loopStart, e.loopEnd = this.loopEnd, e.onended = this.onEnded.bind(this), e.start(this._startedAt, this._progress + this.offset, this.duration), this.isPlaying = true, this.source = e, this.setDetune(this.detune), this.setPlaybackRate(this.playbackRate), this.connect();
    }
    pause() {
      if (this.hasPlaybackControl === false) {
        console.warn("THREE.Audio: this Audio has no playback control.");
        return;
      }
      return this.isPlaying === true && (this._progress += Math.max(this.context.currentTime - this._startedAt, 0) * this.playbackRate, this.loop === true && (this._progress = this._progress % (this.duration || this.buffer.duration)), this.source.stop(), this.source.onended = null, this.isPlaying = false), this;
    }
    stop() {
      if (this.hasPlaybackControl === false) {
        console.warn("THREE.Audio: this Audio has no playback control.");
        return;
      }
      return this._progress = 0, this.source !== null && (this.source.stop(), this.source.onended = null), this.isPlaying = false, this;
    }
    connect() {
      if (this.filters.length > 0) {
        this.source.connect(this.filters[0]);
        for (let t = 1, e = this.filters.length; t < e; t++) this.filters[t - 1].connect(this.filters[t]);
        this.filters[this.filters.length - 1].connect(this.getOutput());
      } else this.source.connect(this.getOutput());
      return this._connected = true, this;
    }
    disconnect() {
      if (this._connected !== false) {
        if (this.filters.length > 0) {
          this.source.disconnect(this.filters[0]);
          for (let t = 1, e = this.filters.length; t < e; t++) this.filters[t - 1].disconnect(this.filters[t]);
          this.filters[this.filters.length - 1].disconnect(this.getOutput());
        } else this.source.disconnect(this.getOutput());
        return this._connected = false, this;
      }
    }
    getFilters() {
      return this.filters;
    }
    setFilters(t) {
      return t || (t = []), this._connected === true ? (this.disconnect(), this.filters = t.slice(), this.connect()) : this.filters = t.slice(), this;
    }
    setDetune(t) {
      return this.detune = t, this.isPlaying === true && this.source.detune !== void 0 && this.source.detune.setTargetAtTime(this.detune, this.context.currentTime, 0.01), this;
    }
    getDetune() {
      return this.detune;
    }
    getFilter() {
      return this.getFilters()[0];
    }
    setFilter(t) {
      return this.setFilters(t ? [
        t
      ] : []);
    }
    setPlaybackRate(t) {
      if (this.hasPlaybackControl === false) {
        console.warn("THREE.Audio: this Audio has no playback control.");
        return;
      }
      return this.playbackRate = t, this.isPlaying === true && this.source.playbackRate.setTargetAtTime(this.playbackRate, this.context.currentTime, 0.01), this;
    }
    getPlaybackRate() {
      return this.playbackRate;
    }
    onEnded() {
      this.isPlaying = false;
    }
    getLoop() {
      return this.hasPlaybackControl === false ? (console.warn("THREE.Audio: this Audio has no playback control."), false) : this.loop;
    }
    setLoop(t) {
      if (this.hasPlaybackControl === false) {
        console.warn("THREE.Audio: this Audio has no playback control.");
        return;
      }
      return this.loop = t, this.isPlaying === true && (this.source.loop = this.loop), this;
    }
    setLoopStart(t) {
      return this.loopStart = t, this;
    }
    setLoopEnd(t) {
      return this.loopEnd = t, this;
    }
    getVolume() {
      return this.gain.gain.value;
    }
    setVolume(t) {
      return this.gain.gain.setTargetAtTime(t, this.context.currentTime, 0.01), this;
    }
  }
  const Ui = new R(), ed = new qe(), PM = new R(), Ni = new R();
  class IM extends Bp {
    constructor(t) {
      super(t), this.panner = this.context.createPanner(), this.panner.panningModel = "HRTF", this.panner.connect(this.gain);
    }
    connect() {
      super.connect(), this.panner.connect(this.gain);
    }
    disconnect() {
      super.disconnect(), this.panner.disconnect(this.gain);
    }
    getOutput() {
      return this.panner;
    }
    getRefDistance() {
      return this.panner.refDistance;
    }
    setRefDistance(t) {
      return this.panner.refDistance = t, this;
    }
    getRolloffFactor() {
      return this.panner.rolloffFactor;
    }
    setRolloffFactor(t) {
      return this.panner.rolloffFactor = t, this;
    }
    getDistanceModel() {
      return this.panner.distanceModel;
    }
    setDistanceModel(t) {
      return this.panner.distanceModel = t, this;
    }
    getMaxDistance() {
      return this.panner.maxDistance;
    }
    setMaxDistance(t) {
      return this.panner.maxDistance = t, this;
    }
    setDirectionalCone(t, e, n) {
      return this.panner.coneInnerAngle = t, this.panner.coneOuterAngle = e, this.panner.coneOuterGain = n, this;
    }
    updateMatrixWorld(t) {
      if (super.updateMatrixWorld(t), this.hasPlaybackControl === true && this.isPlaying === false) return;
      this.matrixWorld.decompose(Ui, ed, PM), Ni.set(0, 0, 1).applyQuaternion(ed);
      const e = this.panner;
      if (e.positionX) {
        const n = this.context.currentTime + this.listener.timeDelta;
        e.positionX.linearRampToValueAtTime(Ui.x, n), e.positionY.linearRampToValueAtTime(Ui.y, n), e.positionZ.linearRampToValueAtTime(Ui.z, n), e.orientationX.linearRampToValueAtTime(Ni.x, n), e.orientationY.linearRampToValueAtTime(Ni.y, n), e.orientationZ.linearRampToValueAtTime(Ni.z, n);
      } else e.setPosition(Ui.x, Ui.y, Ui.z), e.setOrientation(Ni.x, Ni.y, Ni.z);
    }
  }
  class LM {
    constructor(t, e = 2048) {
      this.analyser = t.context.createAnalyser(), this.analyser.fftSize = e, this.data = new Uint8Array(this.analyser.frequencyBinCount), t.getOutput().connect(this.analyser);
    }
    getFrequencyData() {
      return this.analyser.getByteFrequencyData(this.data), this.data;
    }
    getAverageFrequency() {
      let t = 0;
      const e = this.getFrequencyData();
      for (let n = 0; n < e.length; n++) t += e[n];
      return t / e.length;
    }
  }
  class kp {
    constructor(t, e, n) {
      this.binding = t, this.valueSize = n;
      let i, s, o;
      switch (e) {
        case "quaternion":
          i = this._slerp, s = this._slerpAdditive, o = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
          break;
        case "string":
        case "bool":
          i = this._select, s = this._select, o = this._setAdditiveIdentityOther, this.buffer = new Array(n * 5);
          break;
        default:
          i = this._lerp, s = this._lerpAdditive, o = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
      }
      this._mixBufferRegion = i, this._mixBufferRegionAdditive = s, this._setIdentity = o, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
    }
    accumulate(t, e) {
      const n = this.buffer, i = this.valueSize, s = t * i + i;
      let o = this.cumulativeWeight;
      if (o === 0) {
        for (let a = 0; a !== i; ++a) n[s + a] = n[a];
        o = e;
      } else {
        o += e;
        const a = e / o;
        this._mixBufferRegion(n, s, 0, a, i);
      }
      this.cumulativeWeight = o;
    }
    accumulateAdditive(t) {
      const e = this.buffer, n = this.valueSize, i = n * this._addIndex;
      this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(e, i, 0, t, n), this.cumulativeWeightAdditive += t;
    }
    apply(t) {
      const e = this.valueSize, n = this.buffer, i = t * e + e, s = this.cumulativeWeight, o = this.cumulativeWeightAdditive, a = this.binding;
      if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, s < 1) {
        const l = e * this._origIndex;
        this._mixBufferRegion(n, i, l, 1 - s, e);
      }
      o > 0 && this._mixBufferRegionAdditive(n, i, this._addIndex * e, 1, e);
      for (let l = e, c = e + e; l !== c; ++l) if (n[l] !== n[l + e]) {
        a.setValue(n, i);
        break;
      }
    }
    saveOriginalState() {
      const t = this.binding, e = this.buffer, n = this.valueSize, i = n * this._origIndex;
      t.getValue(e, i);
      for (let s = n, o = i; s !== o; ++s) e[s] = e[i + s % n];
      this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
    }
    restoreOriginalState() {
      const t = this.valueSize * 3;
      this.binding.setValue(this.buffer, t);
    }
    _setAdditiveIdentityNumeric() {
      const t = this._addIndex * this.valueSize, e = t + this.valueSize;
      for (let n = t; n < e; n++) this.buffer[n] = 0;
    }
    _setAdditiveIdentityQuaternion() {
      this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
    }
    _setAdditiveIdentityOther() {
      const t = this._origIndex * this.valueSize, e = this._addIndex * this.valueSize;
      for (let n = 0; n < this.valueSize; n++) this.buffer[e + n] = this.buffer[t + n];
    }
    _select(t, e, n, i, s) {
      if (i >= 0.5) for (let o = 0; o !== s; ++o) t[e + o] = t[n + o];
    }
    _slerp(t, e, n, i) {
      qe.slerpFlat(t, e, t, e, t, n, i);
    }
    _slerpAdditive(t, e, n, i, s) {
      const o = this._workIndex * s;
      qe.multiplyQuaternionsFlat(t, o, t, e, t, n), qe.slerpFlat(t, e, t, e, t, o, i);
    }
    _lerp(t, e, n, i, s) {
      const o = 1 - i;
      for (let a = 0; a !== s; ++a) {
        const l = e + a;
        t[l] = t[l] * o + t[n + a] * i;
      }
    }
    _lerpAdditive(t, e, n, i, s) {
      for (let o = 0; o !== s; ++o) {
        const a = e + o;
        t[a] = t[a] + t[n + o] * i;
      }
    }
  }
  const gh = "\\[\\]\\.:\\/", DM = new RegExp("[" + gh + "]", "g"), _h = "[^" + gh + "]", UM = "[^" + gh.replace("\\.", "") + "]", NM = /((?:WC+[\/:])*)/.source.replace("WC", _h), OM = /(WCOD+)?/.source.replace("WCOD", UM), zM = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", _h), FM = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", _h), BM = new RegExp("^" + NM + OM + zM + FM + "$"), kM = [
    "material",
    "materials",
    "bones",
    "map"
  ];
  class VM {
    constructor(t, e, n) {
      const i = n || Kt.parseTrackName(e);
      this._targetGroup = t, this._bindings = t.subscribe_(e, i);
    }
    getValue(t, e) {
      this.bind();
      const n = this._targetGroup.nCachedObjects_, i = this._bindings[n];
      i !== void 0 && i.getValue(t, e);
    }
    setValue(t, e) {
      const n = this._bindings;
      for (let i = this._targetGroup.nCachedObjects_, s = n.length; i !== s; ++i) n[i].setValue(t, e);
    }
    bind() {
      const t = this._bindings;
      for (let e = this._targetGroup.nCachedObjects_, n = t.length; e !== n; ++e) t[e].bind();
    }
    unbind() {
      const t = this._bindings;
      for (let e = this._targetGroup.nCachedObjects_, n = t.length; e !== n; ++e) t[e].unbind();
    }
  }
  class Kt {
    constructor(t, e, n) {
      this.path = e, this.parsedPath = n || Kt.parseTrackName(e), this.node = Kt.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
    static create(t, e, n) {
      return t && t.isAnimationObjectGroup ? new Kt.Composite(t, e, n) : new Kt(t, e, n);
    }
    static sanitizeNodeName(t) {
      return t.replace(/\s/g, "_").replace(DM, "");
    }
    static parseTrackName(t) {
      const e = BM.exec(t);
      if (e === null) throw new Error("PropertyBinding: Cannot parse trackName: " + t);
      const n = {
        nodeName: e[2],
        objectName: e[3],
        objectIndex: e[4],
        propertyName: e[5],
        propertyIndex: e[6]
      }, i = n.nodeName && n.nodeName.lastIndexOf(".");
      if (i !== void 0 && i !== -1) {
        const s = n.nodeName.substring(i + 1);
        kM.indexOf(s) !== -1 && (n.nodeName = n.nodeName.substring(0, i), n.objectName = s);
      }
      if (n.propertyName === null || n.propertyName.length === 0) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + t);
      return n;
    }
    static findNode(t, e) {
      if (e === void 0 || e === "" || e === "." || e === -1 || e === t.name || e === t.uuid) return t;
      if (t.skeleton) {
        const n = t.skeleton.getBoneByName(e);
        if (n !== void 0) return n;
      }
      if (t.children) {
        const n = function(s) {
          for (let o = 0; o < s.length; o++) {
            const a = s[o];
            if (a.name === e || a.uuid === e) return a;
            const l = n(a.children);
            if (l) return l;
          }
          return null;
        }, i = n(t.children);
        if (i) return i;
      }
      return null;
    }
    _getValue_unavailable() {
    }
    _setValue_unavailable() {
    }
    _getValue_direct(t, e) {
      t[e] = this.targetObject[this.propertyName];
    }
    _getValue_array(t, e) {
      const n = this.resolvedProperty;
      for (let i = 0, s = n.length; i !== s; ++i) t[e++] = n[i];
    }
    _getValue_arrayElement(t, e) {
      t[e] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(t, e) {
      this.resolvedProperty.toArray(t, e);
    }
    _setValue_direct(t, e) {
      this.targetObject[this.propertyName] = t[e];
    }
    _setValue_direct_setNeedsUpdate(t, e) {
      this.targetObject[this.propertyName] = t[e], this.targetObject.needsUpdate = true;
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(t, e) {
      this.targetObject[this.propertyName] = t[e], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_array(t, e) {
      const n = this.resolvedProperty;
      for (let i = 0, s = n.length; i !== s; ++i) n[i] = t[e++];
    }
    _setValue_array_setNeedsUpdate(t, e) {
      const n = this.resolvedProperty;
      for (let i = 0, s = n.length; i !== s; ++i) n[i] = t[e++];
      this.targetObject.needsUpdate = true;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(t, e) {
      const n = this.resolvedProperty;
      for (let i = 0, s = n.length; i !== s; ++i) n[i] = t[e++];
      this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_arrayElement(t, e) {
      this.resolvedProperty[this.propertyIndex] = t[e];
    }
    _setValue_arrayElement_setNeedsUpdate(t, e) {
      this.resolvedProperty[this.propertyIndex] = t[e], this.targetObject.needsUpdate = true;
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(t, e) {
      this.resolvedProperty[this.propertyIndex] = t[e], this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _setValue_fromArray(t, e) {
      this.resolvedProperty.fromArray(t, e);
    }
    _setValue_fromArray_setNeedsUpdate(t, e) {
      this.resolvedProperty.fromArray(t, e), this.targetObject.needsUpdate = true;
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(t, e) {
      this.resolvedProperty.fromArray(t, e), this.targetObject.matrixWorldNeedsUpdate = true;
    }
    _getValue_unbound(t, e) {
      this.bind(), this.getValue(t, e);
    }
    _setValue_unbound(t, e) {
      this.bind(), this.setValue(t, e);
    }
    bind() {
      let t = this.node;
      const e = this.parsedPath, n = e.objectName, i = e.propertyName;
      let s = e.propertyIndex;
      if (t || (t = Kt.findNode(this.rootNode, e.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
        console.warn("THREE.PropertyBinding: No target node found for track: " + this.path + ".");
        return;
      }
      if (n) {
        let c = e.objectIndex;
        switch (n) {
          case "materials":
            if (!t.material) {
              console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
              return;
            }
            if (!t.material.materials) {
              console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
              return;
            }
            t = t.material.materials;
            break;
          case "bones":
            if (!t.skeleton) {
              console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
              return;
            }
            t = t.skeleton.bones;
            for (let h = 0; h < t.length; h++) if (t[h].name === c) {
              c = h;
              break;
            }
            break;
          case "map":
            if ("map" in t) {
              t = t.map;
              break;
            }
            if (!t.material) {
              console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
              return;
            }
            if (!t.material.map) {
              console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
              return;
            }
            t = t.material.map;
            break;
          default:
            if (t[n] === void 0) {
              console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
              return;
            }
            t = t[n];
        }
        if (c !== void 0) {
          if (t[c] === void 0) {
            console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
            return;
          }
          t = t[c];
        }
      }
      const o = t[i];
      if (o === void 0) {
        const c = e.nodeName;
        console.error("THREE.PropertyBinding: Trying to update property for track: " + c + "." + i + " but it wasn't found.", t);
        return;
      }
      let a = this.Versioning.None;
      this.targetObject = t, t.needsUpdate !== void 0 ? a = this.Versioning.NeedsUpdate : t.matrixWorldNeedsUpdate !== void 0 && (a = this.Versioning.MatrixWorldNeedsUpdate);
      let l = this.BindingType.Direct;
      if (s !== void 0) {
        if (i === "morphTargetInfluences") {
          if (!t.geometry) {
            console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
            return;
          }
          if (!t.geometry.morphAttributes) {
            console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
            return;
          }
          t.morphTargetDictionary[s] !== void 0 && (s = t.morphTargetDictionary[s]);
        }
        l = this.BindingType.ArrayElement, this.resolvedProperty = o, this.propertyIndex = s;
      } else o.fromArray !== void 0 && o.toArray !== void 0 ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = o) : Array.isArray(o) ? (l = this.BindingType.EntireArray, this.resolvedProperty = o) : this.propertyName = i;
      this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][a];
    }
    unbind() {
      this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
    }
  }
  Kt.Composite = VM;
  Kt.prototype.BindingType = {
    Direct: 0,
    EntireArray: 1,
    ArrayElement: 2,
    HasFromToArray: 3
  };
  Kt.prototype.Versioning = {
    None: 0,
    NeedsUpdate: 1,
    MatrixWorldNeedsUpdate: 2
  };
  Kt.prototype.GetterByBindingType = [
    Kt.prototype._getValue_direct,
    Kt.prototype._getValue_array,
    Kt.prototype._getValue_arrayElement,
    Kt.prototype._getValue_toArray
  ];
  Kt.prototype.SetterByBindingTypeAndVersioning = [
    [
      Kt.prototype._setValue_direct,
      Kt.prototype._setValue_direct_setNeedsUpdate,
      Kt.prototype._setValue_direct_setMatrixWorldNeedsUpdate
    ],
    [
      Kt.prototype._setValue_array,
      Kt.prototype._setValue_array_setNeedsUpdate,
      Kt.prototype._setValue_array_setMatrixWorldNeedsUpdate
    ],
    [
      Kt.prototype._setValue_arrayElement,
      Kt.prototype._setValue_arrayElement_setNeedsUpdate,
      Kt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
    ],
    [
      Kt.prototype._setValue_fromArray,
      Kt.prototype._setValue_fromArray_setNeedsUpdate,
      Kt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
    ]
  ];
  class HM {
    constructor() {
      this.isAnimationObjectGroup = true, this.uuid = sn(), this._objects = Array.prototype.slice.call(arguments), this.nCachedObjects_ = 0;
      const t = {};
      this._indicesByUUID = t;
      for (let n = 0, i = arguments.length; n !== i; ++n) t[arguments[n].uuid] = n;
      this._paths = [], this._parsedPaths = [], this._bindings = [], this._bindingsIndicesByPath = {};
      const e = this;
      this.stats = {
        objects: {
          get total() {
            return e._objects.length;
          },
          get inUse() {
            return this.total - e.nCachedObjects_;
          }
        },
        get bindingsPerObject() {
          return e._bindings.length;
        }
      };
    }
    add() {
      const t = this._objects, e = this._indicesByUUID, n = this._paths, i = this._parsedPaths, s = this._bindings, o = s.length;
      let a, l = t.length, c = this.nCachedObjects_;
      for (let h = 0, d = arguments.length; h !== d; ++h) {
        const u = arguments[h], f = u.uuid;
        let m = e[f];
        if (m === void 0) {
          m = l++, e[f] = m, t.push(u);
          for (let _ = 0, g = o; _ !== g; ++_) s[_].push(new Kt(u, n[_], i[_]));
        } else if (m < c) {
          a = t[m];
          const _ = --c, g = t[_];
          e[g.uuid] = m, t[m] = g, e[f] = _, t[_] = u;
          for (let p = 0, v = o; p !== v; ++p) {
            const x = s[p], S = x[_];
            let P = x[m];
            x[m] = S, P === void 0 && (P = new Kt(u, n[p], i[p])), x[_] = P;
          }
        } else t[m] !== a && console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.");
      }
      this.nCachedObjects_ = c;
    }
    remove() {
      const t = this._objects, e = this._indicesByUUID, n = this._bindings, i = n.length;
      let s = this.nCachedObjects_;
      for (let o = 0, a = arguments.length; o !== a; ++o) {
        const l = arguments[o], c = l.uuid, h = e[c];
        if (h !== void 0 && h >= s) {
          const d = s++, u = t[d];
          e[u.uuid] = h, t[h] = u, e[c] = d, t[d] = l;
          for (let f = 0, m = i; f !== m; ++f) {
            const _ = n[f], g = _[d], p = _[h];
            _[h] = g, _[d] = p;
          }
        }
      }
      this.nCachedObjects_ = s;
    }
    uncache() {
      const t = this._objects, e = this._indicesByUUID, n = this._bindings, i = n.length;
      let s = this.nCachedObjects_, o = t.length;
      for (let a = 0, l = arguments.length; a !== l; ++a) {
        const c = arguments[a], h = c.uuid, d = e[h];
        if (d !== void 0) if (delete e[h], d < s) {
          const u = --s, f = t[u], m = --o, _ = t[m];
          e[f.uuid] = d, t[d] = f, e[_.uuid] = u, t[u] = _, t.pop();
          for (let g = 0, p = i; g !== p; ++g) {
            const v = n[g], x = v[u], S = v[m];
            v[d] = x, v[u] = S, v.pop();
          }
        } else {
          const u = --o, f = t[u];
          u > 0 && (e[f.uuid] = d), t[d] = f, t.pop();
          for (let m = 0, _ = i; m !== _; ++m) {
            const g = n[m];
            g[d] = g[u], g.pop();
          }
        }
      }
      this.nCachedObjects_ = s;
    }
    subscribe_(t, e) {
      const n = this._bindingsIndicesByPath;
      let i = n[t];
      const s = this._bindings;
      if (i !== void 0) return s[i];
      const o = this._paths, a = this._parsedPaths, l = this._objects, c = l.length, h = this.nCachedObjects_, d = new Array(c);
      i = s.length, n[t] = i, o.push(t), a.push(e), s.push(d);
      for (let u = h, f = l.length; u !== f; ++u) {
        const m = l[u];
        d[u] = new Kt(m, t, e);
      }
      return d;
    }
    unsubscribe_(t) {
      const e = this._bindingsIndicesByPath, n = e[t];
      if (n !== void 0) {
        const i = this._paths, s = this._parsedPaths, o = this._bindings, a = o.length - 1, l = o[a], c = t[a];
        e[c] = n, o[n] = l, o.pop(), s[n] = s[a], s.pop(), i[n] = i[a], i.pop();
      }
    }
  }
  class Vp {
    constructor(t, e, n = null, i = e.blendMode) {
      this._mixer = t, this._clip = e, this._localRoot = n, this.blendMode = i;
      const s = e.tracks, o = s.length, a = new Array(o), l = {
        endingStart: Bi,
        endingEnd: Bi
      };
      for (let c = 0; c !== o; ++c) {
        const h = s[c].createInterpolant(null);
        a[c] = h, h.settings = l;
      }
      this._interpolantSettings = l, this._interpolants = a, this._propertyBindings = new Array(o), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._weightInterpolant = null, this.loop = vf, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = 1 / 0, this.paused = false, this.enabled = true, this.clampWhenFinished = false, this.zeroSlopeAtStart = true, this.zeroSlopeAtEnd = true;
    }
    play() {
      return this._mixer._activateAction(this), this;
    }
    stop() {
      return this._mixer._deactivateAction(this), this.reset();
    }
    reset() {
      return this.paused = false, this.enabled = true, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
    }
    isRunning() {
      return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
    }
    isScheduled() {
      return this._mixer._isActiveAction(this);
    }
    startAt(t) {
      return this._startTime = t, this;
    }
    setLoop(t, e) {
      return this.loop = t, this.repetitions = e, this;
    }
    setEffectiveWeight(t) {
      return this.weight = t, this._effectiveWeight = this.enabled ? t : 0, this.stopFading();
    }
    getEffectiveWeight() {
      return this._effectiveWeight;
    }
    fadeIn(t) {
      return this._scheduleFading(t, 0, 1);
    }
    fadeOut(t) {
      return this._scheduleFading(t, 1, 0);
    }
    crossFadeFrom(t, e, n) {
      if (t.fadeOut(e), this.fadeIn(e), n) {
        const i = this._clip.duration, s = t._clip.duration, o = s / i, a = i / s;
        t.warp(1, o, e), this.warp(a, 1, e);
      }
      return this;
    }
    crossFadeTo(t, e, n) {
      return t.crossFadeFrom(this, e, n);
    }
    stopFading() {
      const t = this._weightInterpolant;
      return t !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(t)), this;
    }
    setEffectiveTimeScale(t) {
      return this.timeScale = t, this._effectiveTimeScale = this.paused ? 0 : t, this.stopWarping();
    }
    getEffectiveTimeScale() {
      return this._effectiveTimeScale;
    }
    setDuration(t) {
      return this.timeScale = this._clip.duration / t, this.stopWarping();
    }
    syncWith(t) {
      return this.time = t.time, this.timeScale = t.timeScale, this.stopWarping();
    }
    halt(t) {
      return this.warp(this._effectiveTimeScale, 0, t);
    }
    warp(t, e, n) {
      const i = this._mixer, s = i.time, o = this.timeScale;
      let a = this._timeScaleInterpolant;
      a === null && (a = i._lendControlInterpolant(), this._timeScaleInterpolant = a);
      const l = a.parameterPositions, c = a.sampleValues;
      return l[0] = s, l[1] = s + n, c[0] = t / o, c[1] = e / o, this;
    }
    stopWarping() {
      const t = this._timeScaleInterpolant;
      return t !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(t)), this;
    }
    getMixer() {
      return this._mixer;
    }
    getClip() {
      return this._clip;
    }
    getRoot() {
      return this._localRoot || this._mixer._root;
    }
    _update(t, e, n, i) {
      if (!this.enabled) {
        this._updateWeight(t);
        return;
      }
      const s = this._startTime;
      if (s !== null) {
        const l = (t - s) * n;
        l < 0 || n === 0 ? e = 0 : (this._startTime = null, e = n * l);
      }
      e *= this._updateTimeScale(t);
      const o = this._updateTime(e), a = this._updateWeight(t);
      if (a > 0) {
        const l = this._interpolants, c = this._propertyBindings;
        switch (this.blendMode) {
          case Gc:
            for (let h = 0, d = l.length; h !== d; ++h) l[h].evaluate(o), c[h].accumulateAdditive(a);
            break;
          case ya:
          default:
            for (let h = 0, d = l.length; h !== d; ++h) l[h].evaluate(o), c[h].accumulate(i, a);
        }
      }
    }
    _updateWeight(t) {
      let e = 0;
      if (this.enabled) {
        e = this.weight;
        const n = this._weightInterpolant;
        if (n !== null) {
          const i = n.evaluate(t)[0];
          e *= i, t > n.parameterPositions[1] && (this.stopFading(), i === 0 && (this.enabled = false));
        }
      }
      return this._effectiveWeight = e, e;
    }
    _updateTimeScale(t) {
      let e = 0;
      if (!this.paused) {
        e = this.timeScale;
        const n = this._timeScaleInterpolant;
        if (n !== null) {
          const i = n.evaluate(t)[0];
          e *= i, t > n.parameterPositions[1] && (this.stopWarping(), e === 0 ? this.paused = true : this.timeScale = e);
        }
      }
      return this._effectiveTimeScale = e, e;
    }
    _updateTime(t) {
      const e = this._clip.duration, n = this.loop;
      let i = this.time + t, s = this._loopCount;
      const o = n === yf;
      if (t === 0) return s === -1 ? i : o && (s & 1) === 1 ? e - i : i;
      if (n === xf) {
        s === -1 && (this._loopCount = 0, this._setEndings(true, true, false));
        t: {
          if (i >= e) i = e;
          else if (i < 0) i = 0;
          else {
            this.time = i;
            break t;
          }
          this.clampWhenFinished ? this.paused = true : this.enabled = false, this.time = i, this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: t < 0 ? -1 : 1
          });
        }
      } else {
        if (s === -1 && (t >= 0 ? (s = 0, this._setEndings(true, this.repetitions === 0, o)) : this._setEndings(this.repetitions === 0, true, o)), i >= e || i < 0) {
          const a = Math.floor(i / e);
          i -= e * a, s += Math.abs(a);
          const l = this.repetitions - s;
          if (l <= 0) this.clampWhenFinished ? this.paused = true : this.enabled = false, i = t > 0 ? e : 0, this.time = i, this._mixer.dispatchEvent({
            type: "finished",
            action: this,
            direction: t > 0 ? 1 : -1
          });
          else {
            if (l === 1) {
              const c = t < 0;
              this._setEndings(c, !c, o);
            } else this._setEndings(false, false, o);
            this._loopCount = s, this.time = i, this._mixer.dispatchEvent({
              type: "loop",
              action: this,
              loopDelta: a
            });
          }
        } else this.time = i;
        if (o && (s & 1) === 1) return e - i;
      }
      return i;
    }
    _setEndings(t, e, n) {
      const i = this._interpolantSettings;
      n ? (i.endingStart = ki, i.endingEnd = ki) : (t ? i.endingStart = this.zeroSlopeAtStart ? ki : Bi : i.endingStart = Rr, e ? i.endingEnd = this.zeroSlopeAtEnd ? ki : Bi : i.endingEnd = Rr);
    }
    _scheduleFading(t, e, n) {
      const i = this._mixer, s = i.time;
      let o = this._weightInterpolant;
      o === null && (o = i._lendControlInterpolant(), this._weightInterpolant = o);
      const a = o.parameterPositions, l = o.sampleValues;
      return a[0] = s, l[0] = e, a[1] = s + t, l[1] = n, this;
    }
  }
  const GM = new Float32Array(1);
  class WM extends ei {
    constructor(t) {
      super(), this._root = t, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1;
    }
    _bindAction(t, e) {
      const n = t._localRoot || this._root, i = t._clip.tracks, s = i.length, o = t._propertyBindings, a = t._interpolants, l = n.uuid, c = this._bindingsByRootAndName;
      let h = c[l];
      h === void 0 && (h = {}, c[l] = h);
      for (let d = 0; d !== s; ++d) {
        const u = i[d], f = u.name;
        let m = h[f];
        if (m !== void 0) ++m.referenceCount, o[d] = m;
        else {
          if (m = o[d], m !== void 0) {
            m._cacheIndex === null && (++m.referenceCount, this._addInactiveBinding(m, l, f));
            continue;
          }
          const _ = e && e._propertyBindings[d].binding.parsedPath;
          m = new kp(Kt.create(n, f, _), u.ValueTypeName, u.getValueSize()), ++m.referenceCount, this._addInactiveBinding(m, l, f), o[d] = m;
        }
        a[d].resultBuffer = m.buffer;
      }
    }
    _activateAction(t) {
      if (!this._isActiveAction(t)) {
        if (t._cacheIndex === null) {
          const n = (t._localRoot || this._root).uuid, i = t._clip.uuid, s = this._actionsByClip[i];
          this._bindAction(t, s && s.knownActions[0]), this._addInactiveAction(t, i, n);
        }
        const e = t._propertyBindings;
        for (let n = 0, i = e.length; n !== i; ++n) {
          const s = e[n];
          s.useCount++ === 0 && (this._lendBinding(s), s.saveOriginalState());
        }
        this._lendAction(t);
      }
    }
    _deactivateAction(t) {
      if (this._isActiveAction(t)) {
        const e = t._propertyBindings;
        for (let n = 0, i = e.length; n !== i; ++n) {
          const s = e[n];
          --s.useCount === 0 && (s.restoreOriginalState(), this._takeBackBinding(s));
        }
        this._takeBackAction(t);
      }
    }
    _initMemoryManager() {
      this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
      const t = this;
      this.stats = {
        actions: {
          get total() {
            return t._actions.length;
          },
          get inUse() {
            return t._nActiveActions;
          }
        },
        bindings: {
          get total() {
            return t._bindings.length;
          },
          get inUse() {
            return t._nActiveBindings;
          }
        },
        controlInterpolants: {
          get total() {
            return t._controlInterpolants.length;
          },
          get inUse() {
            return t._nActiveControlInterpolants;
          }
        }
      };
    }
    _isActiveAction(t) {
      const e = t._cacheIndex;
      return e !== null && e < this._nActiveActions;
    }
    _addInactiveAction(t, e, n) {
      const i = this._actions, s = this._actionsByClip;
      let o = s[e];
      if (o === void 0) o = {
        knownActions: [
          t
        ],
        actionByRoot: {}
      }, t._byClipCacheIndex = 0, s[e] = o;
      else {
        const a = o.knownActions;
        t._byClipCacheIndex = a.length, a.push(t);
      }
      t._cacheIndex = i.length, i.push(t), o.actionByRoot[n] = t;
    }
    _removeInactiveAction(t) {
      const e = this._actions, n = e[e.length - 1], i = t._cacheIndex;
      n._cacheIndex = i, e[i] = n, e.pop(), t._cacheIndex = null;
      const s = t._clip.uuid, o = this._actionsByClip, a = o[s], l = a.knownActions, c = l[l.length - 1], h = t._byClipCacheIndex;
      c._byClipCacheIndex = h, l[h] = c, l.pop(), t._byClipCacheIndex = null;
      const d = a.actionByRoot, u = (t._localRoot || this._root).uuid;
      delete d[u], l.length === 0 && delete o[s], this._removeInactiveBindingsForAction(t);
    }
    _removeInactiveBindingsForAction(t) {
      const e = t._propertyBindings;
      for (let n = 0, i = e.length; n !== i; ++n) {
        const s = e[n];
        --s.referenceCount === 0 && this._removeInactiveBinding(s);
      }
    }
    _lendAction(t) {
      const e = this._actions, n = t._cacheIndex, i = this._nActiveActions++, s = e[i];
      t._cacheIndex = i, e[i] = t, s._cacheIndex = n, e[n] = s;
    }
    _takeBackAction(t) {
      const e = this._actions, n = t._cacheIndex, i = --this._nActiveActions, s = e[i];
      t._cacheIndex = i, e[i] = t, s._cacheIndex = n, e[n] = s;
    }
    _addInactiveBinding(t, e, n) {
      const i = this._bindingsByRootAndName, s = this._bindings;
      let o = i[e];
      o === void 0 && (o = {}, i[e] = o), o[n] = t, t._cacheIndex = s.length, s.push(t);
    }
    _removeInactiveBinding(t) {
      const e = this._bindings, n = t.binding, i = n.rootNode.uuid, s = n.path, o = this._bindingsByRootAndName, a = o[i], l = e[e.length - 1], c = t._cacheIndex;
      l._cacheIndex = c, e[c] = l, e.pop(), delete a[s], Object.keys(a).length === 0 && delete o[i];
    }
    _lendBinding(t) {
      const e = this._bindings, n = t._cacheIndex, i = this._nActiveBindings++, s = e[i];
      t._cacheIndex = i, e[i] = t, s._cacheIndex = n, e[n] = s;
    }
    _takeBackBinding(t) {
      const e = this._bindings, n = t._cacheIndex, i = --this._nActiveBindings, s = e[i];
      t._cacheIndex = i, e[i] = t, s._cacheIndex = n, e[n] = s;
    }
    _lendControlInterpolant() {
      const t = this._controlInterpolants, e = this._nActiveControlInterpolants++;
      let n = t[e];
      return n === void 0 && (n = new hh(new Float32Array(2), new Float32Array(2), 1, GM), n.__cacheIndex = e, t[e] = n), n;
    }
    _takeBackControlInterpolant(t) {
      const e = this._controlInterpolants, n = t.__cacheIndex, i = --this._nActiveControlInterpolants, s = e[i];
      t.__cacheIndex = i, e[i] = t, s.__cacheIndex = n, e[n] = s;
    }
    clipAction(t, e, n) {
      const i = e || this._root, s = i.uuid;
      let o = typeof t == "string" ? Vr.findByName(i, t) : t;
      const a = o !== null ? o.uuid : t, l = this._actionsByClip[a];
      let c = null;
      if (n === void 0 && (o !== null ? n = o.blendMode : n = ya), l !== void 0) {
        const d = l.actionByRoot[s];
        if (d !== void 0 && d.blendMode === n) return d;
        c = l.knownActions[0], o === null && (o = c._clip);
      }
      if (o === null) return null;
      const h = new Vp(this, o, e, n);
      return this._bindAction(h, c), this._addInactiveAction(h, a, s), h;
    }
    existingAction(t, e) {
      const n = e || this._root, i = n.uuid, s = typeof t == "string" ? Vr.findByName(n, t) : t, o = s ? s.uuid : t, a = this._actionsByClip[o];
      return a !== void 0 && a.actionByRoot[i] || null;
    }
    stopAllAction() {
      const t = this._actions, e = this._nActiveActions;
      for (let n = e - 1; n >= 0; --n) t[n].stop();
      return this;
    }
    update(t) {
      t *= this.timeScale;
      const e = this._actions, n = this._nActiveActions, i = this.time += t, s = Math.sign(t), o = this._accuIndex ^= 1;
      for (let c = 0; c !== n; ++c) e[c]._update(i, t, s, o);
      const a = this._bindings, l = this._nActiveBindings;
      for (let c = 0; c !== l; ++c) a[c].apply(o);
      return this;
    }
    setTime(t) {
      this.time = 0;
      for (let e = 0; e < this._actions.length; e++) this._actions[e].time = 0;
      return this.update(t);
    }
    getRoot() {
      return this._root;
    }
    uncacheClip(t) {
      const e = this._actions, n = t.uuid, i = this._actionsByClip, s = i[n];
      if (s !== void 0) {
        const o = s.knownActions;
        for (let a = 0, l = o.length; a !== l; ++a) {
          const c = o[a];
          this._deactivateAction(c);
          const h = c._cacheIndex, d = e[e.length - 1];
          c._cacheIndex = null, c._byClipCacheIndex = null, d._cacheIndex = h, e[h] = d, e.pop(), this._removeInactiveBindingsForAction(c);
        }
        delete i[n];
      }
    }
    uncacheRoot(t) {
      const e = t.uuid, n = this._actionsByClip;
      for (const o in n) {
        const a = n[o].actionByRoot, l = a[e];
        l !== void 0 && (this._deactivateAction(l), this._removeInactiveAction(l));
      }
      const i = this._bindingsByRootAndName, s = i[e];
      if (s !== void 0) for (const o in s) {
        const a = s[o];
        a.restoreOriginalState(), this._removeInactiveBinding(a);
      }
    }
    uncacheAction(t, e) {
      const n = this.existingAction(t, e);
      n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
    }
  }
  class xh {
    constructor(t) {
      this.value = t;
    }
    clone() {
      return new xh(this.value.clone === void 0 ? this.value : this.value.clone());
    }
  }
  let XM = 0;
  class YM extends ei {
    constructor() {
      super(), this.isUniformsGroup = true, Object.defineProperty(this, "id", {
        value: XM++
      }), this.name = "", this.usage = Dr, this.uniforms = [];
    }
    add(t) {
      return this.uniforms.push(t), this;
    }
    remove(t) {
      const e = this.uniforms.indexOf(t);
      return e !== -1 && this.uniforms.splice(e, 1), this;
    }
    setName(t) {
      return this.name = t, this;
    }
    setUsage(t) {
      return this.usage = t, this;
    }
    dispose() {
      return this.dispatchEvent({
        type: "dispose"
      }), this;
    }
    copy(t) {
      this.name = t.name, this.usage = t.usage;
      const e = t.uniforms;
      this.uniforms.length = 0;
      for (let n = 0, i = e.length; n < i; n++) {
        const s = Array.isArray(e[n]) ? e[n] : [
          e[n]
        ];
        for (let o = 0; o < s.length; o++) this.uniforms.push(s[o].clone());
      }
      return this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class qM extends Ra {
    constructor(t, e, n = 1) {
      super(t, e), this.isInstancedInterleavedBuffer = true, this.meshPerAttribute = n;
    }
    copy(t) {
      return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
    }
    clone(t) {
      const e = super.clone(t);
      return e.meshPerAttribute = this.meshPerAttribute, e;
    }
    toJSON(t) {
      const e = super.toJSON(t);
      return e.isInstancedInterleavedBuffer = true, e.meshPerAttribute = this.meshPerAttribute, e;
    }
  }
  class $M {
    constructor(t, e, n, i, s) {
      this.isGLBufferAttribute = true, this.name = "", this.buffer = t, this.type = e, this.itemSize = n, this.elementSize = i, this.count = s, this.version = 0;
    }
    set needsUpdate(t) {
      t === true && this.version++;
    }
    setBuffer(t) {
      return this.buffer = t, this;
    }
    setType(t, e) {
      return this.type = t, this.elementSize = e, this;
    }
    setItemSize(t) {
      return this.itemSize = t, this;
    }
    setCount(t) {
      return this.count = t, this;
    }
  }
  const nd = new Dt();
  class Hp {
    constructor(t, e, n = 0, i = 1 / 0) {
      this.ray = new Gs(t, e), this.near = n, this.far = i, this.camera = null, this.layers = new ba(), this.params = {
        Mesh: {},
        Line: {
          threshold: 1
        },
        LOD: {},
        Points: {
          threshold: 1
        },
        Sprite: {}
      };
    }
    set(t, e) {
      this.ray.set(t, e);
    }
    setFromCamera(t, e) {
      e.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(t.x, t.y, 0.5).unproject(e).sub(this.ray.origin).normalize(), this.camera = e) : e.isOrthographicCamera ? (this.ray.origin.set(t.x, t.y, (e.near + e.far) / (e.near - e.far)).unproject(e), this.ray.direction.set(0, 0, -1).transformDirection(e.matrixWorld), this.camera = e) : console.error("THREE.Raycaster: Unsupported camera type: " + e.type);
    }
    setFromXRController(t) {
      return nd.identity().extractRotation(t.matrixWorld), this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(nd), this;
    }
    intersectObject(t, e = true, n = []) {
      return Ac(t, this, n, e), n.sort(id), n;
    }
    intersectObjects(t, e = true, n = []) {
      for (let i = 0, s = t.length; i < s; i++) Ac(t[i], this, n, e);
      return n.sort(id), n;
    }
  }
  function id(r, t) {
    return r.distance - t.distance;
  }
  function Ac(r, t, e, n) {
    if (r.layers.test(t.layers) && r.raycast(t, e), n === true) {
      const i = r.children;
      for (let s = 0, o = i.length; s < o; s++) Ac(i[s], t, e, true);
    }
  }
  class ZM {
    constructor(t = 1, e = 0, n = 0) {
      return this.radius = t, this.phi = e, this.theta = n, this;
    }
    set(t, e, n) {
      return this.radius = t, this.phi = e, this.theta = n, this;
    }
    copy(t) {
      return this.radius = t.radius, this.phi = t.phi, this.theta = t.theta, this;
    }
    makeSafe() {
      return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
    }
    setFromVector3(t) {
      return this.setFromCartesianCoords(t.x, t.y, t.z);
    }
    setFromCartesianCoords(t, e, n) {
      return this.radius = Math.sqrt(t * t + e * e + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(t, n), this.phi = Math.acos(de(e / this.radius, -1, 1))), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  class JM {
    constructor(t = 1, e = 0, n = 0) {
      return this.radius = t, this.theta = e, this.y = n, this;
    }
    set(t, e, n) {
      return this.radius = t, this.theta = e, this.y = n, this;
    }
    copy(t) {
      return this.radius = t.radius, this.theta = t.theta, this.y = t.y, this;
    }
    setFromVector3(t) {
      return this.setFromCartesianCoords(t.x, t.y, t.z);
    }
    setFromCartesianCoords(t, e, n) {
      return this.radius = Math.sqrt(t * t + n * n), this.theta = Math.atan2(t, n), this.y = e, this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const sd = new et();
  class KM {
    constructor(t = new et(1 / 0, 1 / 0), e = new et(-1 / 0, -1 / 0)) {
      this.isBox2 = true, this.min = t, this.max = e;
    }
    set(t, e) {
      return this.min.copy(t), this.max.copy(e), this;
    }
    setFromPoints(t) {
      this.makeEmpty();
      for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
      return this;
    }
    setFromCenterAndSize(t, e) {
      const n = sd.copy(e).multiplyScalar(0.5);
      return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(t) {
      return this.min.copy(t.min), this.max.copy(t.max), this;
    }
    makeEmpty() {
      return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -1 / 0, this;
    }
    isEmpty() {
      return this.max.x < this.min.x || this.max.y < this.min.y;
    }
    getCenter(t) {
      return this.isEmpty() ? t.set(0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(t) {
      return this.isEmpty() ? t.set(0, 0) : t.subVectors(this.max, this.min);
    }
    expandByPoint(t) {
      return this.min.min(t), this.max.max(t), this;
    }
    expandByVector(t) {
      return this.min.sub(t), this.max.add(t), this;
    }
    expandByScalar(t) {
      return this.min.addScalar(-t), this.max.addScalar(t), this;
    }
    containsPoint(t) {
      return !(t.x < this.min.x || t.x > this.max.x || t.y < this.min.y || t.y > this.max.y);
    }
    containsBox(t) {
      return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y;
    }
    getParameter(t, e) {
      return e.set((t.x - this.min.x) / (this.max.x - this.min.x), (t.y - this.min.y) / (this.max.y - this.min.y));
    }
    intersectsBox(t) {
      return !(t.max.x < this.min.x || t.min.x > this.max.x || t.max.y < this.min.y || t.min.y > this.max.y);
    }
    clampPoint(t, e) {
      return e.copy(t).clamp(this.min, this.max);
    }
    distanceToPoint(t) {
      return this.clampPoint(t, sd).distanceTo(t);
    }
    intersect(t) {
      return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
    }
    union(t) {
      return this.min.min(t.min), this.max.max(t.max), this;
    }
    translate(t) {
      return this.min.add(t), this.max.add(t), this;
    }
    equals(t) {
      return t.min.equals(this.min) && t.max.equals(this.max);
    }
  }
  const rd = new R(), qo = new R();
  class QM {
    constructor(t = new R(), e = new R()) {
      this.start = t, this.end = e;
    }
    set(t, e) {
      return this.start.copy(t), this.end.copy(e), this;
    }
    copy(t) {
      return this.start.copy(t.start), this.end.copy(t.end), this;
    }
    getCenter(t) {
      return t.addVectors(this.start, this.end).multiplyScalar(0.5);
    }
    delta(t) {
      return t.subVectors(this.end, this.start);
    }
    distanceSq() {
      return this.start.distanceToSquared(this.end);
    }
    distance() {
      return this.start.distanceTo(this.end);
    }
    at(t, e) {
      return this.delta(e).multiplyScalar(t).add(this.start);
    }
    closestPointToPointParameter(t, e) {
      rd.subVectors(t, this.start), qo.subVectors(this.end, this.start);
      const n = qo.dot(qo);
      let s = qo.dot(rd) / n;
      return e && (s = de(s, 0, 1)), s;
    }
    closestPointToPoint(t, e, n) {
      const i = this.closestPointToPointParameter(t, e);
      return this.delta(n).multiplyScalar(i).add(this.start);
    }
    applyMatrix4(t) {
      return this.start.applyMatrix4(t), this.end.applyMatrix4(t), this;
    }
    equals(t) {
      return t.start.equals(this.start) && t.end.equals(this.end);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  }
  const od = new R();
  class jM extends jt {
    constructor(t, e) {
      super(), this.light = t, this.matrixAutoUpdate = false, this.color = e, this.type = "SpotLightHelper";
      const n = new Wt(), i = [
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        -1,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        -1,
        1
      ];
      for (let o = 0, a = 1, l = 32; o < l; o++, a++) {
        const c = o / l * Math.PI * 2, h = a / l * Math.PI * 2;
        i.push(Math.cos(c), Math.sin(c), 1, Math.cos(h), Math.sin(h), 1);
      }
      n.setAttribute("position", new bt(i, 3));
      const s = new He({
        fog: false,
        toneMapped: false
      });
      this.cone = new Dn(n, s), this.add(this.cone), this.update();
    }
    dispose() {
      this.cone.geometry.dispose(), this.cone.material.dispose();
    }
    update() {
      this.light.updateWorldMatrix(true, false), this.light.target.updateWorldMatrix(true, false), this.parent ? (this.parent.updateWorldMatrix(true), this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)) : this.matrix.copy(this.light.matrixWorld), this.matrixWorld.copy(this.light.matrixWorld);
      const t = this.light.distance ? this.light.distance : 1e3, e = t * Math.tan(this.light.angle);
      this.cone.scale.set(e, e, t), od.setFromMatrixPosition(this.light.target.matrixWorld), this.cone.lookAt(od), this.color !== void 0 ? this.cone.material.color.set(this.color) : this.cone.material.color.copy(this.light.color);
    }
  }
  const ui = new R(), $o = new Dt(), Nl = new Dt();
  class tS extends Dn {
    constructor(t) {
      const e = Gp(t), n = new Wt(), i = [], s = [], o = new xt(0, 0, 1), a = new xt(0, 1, 0);
      for (let c = 0; c < e.length; c++) {
        const h = e[c];
        h.parent && h.parent.isBone && (i.push(0, 0, 0), i.push(0, 0, 0), s.push(o.r, o.g, o.b), s.push(a.r, a.g, a.b));
      }
      n.setAttribute("position", new bt(i, 3)), n.setAttribute("color", new bt(s, 3));
      const l = new He({
        vertexColors: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        transparent: true
      });
      super(n, l), this.isSkeletonHelper = true, this.type = "SkeletonHelper", this.root = t, this.bones = e, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false;
    }
    updateMatrixWorld(t) {
      const e = this.bones, n = this.geometry, i = n.getAttribute("position");
      Nl.copy(this.root.matrixWorld).invert();
      for (let s = 0, o = 0; s < e.length; s++) {
        const a = e[s];
        a.parent && a.parent.isBone && ($o.multiplyMatrices(Nl, a.matrixWorld), ui.setFromMatrixPosition($o), i.setXYZ(o, ui.x, ui.y, ui.z), $o.multiplyMatrices(Nl, a.parent.matrixWorld), ui.setFromMatrixPosition($o), i.setXYZ(o + 1, ui.x, ui.y, ui.z), o += 2);
      }
      n.getAttribute("position").needsUpdate = true, super.updateMatrixWorld(t);
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  function Gp(r) {
    const t = [];
    r.isBone === true && t.push(r);
    for (let e = 0; e < r.children.length; e++) t.push.apply(t, Gp(r.children[e]));
    return t;
  }
  class eS extends ae {
    constructor(t, e, n) {
      const i = new to(e, 4, 2), s = new yi({
        wireframe: true,
        fog: false,
        toneMapped: false
      });
      super(i, s), this.light = t, this.color = n, this.type = "PointLightHelper", this.matrix = this.light.matrixWorld, this.matrixAutoUpdate = false, this.update();
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
    update() {
      this.light.updateWorldMatrix(true, false), this.color !== void 0 ? this.material.color.set(this.color) : this.material.color.copy(this.light.color);
    }
  }
  const nS = new R(), ad = new xt(), ld = new xt();
  class iS extends jt {
    constructor(t, e, n) {
      super(), this.light = t, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.color = n, this.type = "HemisphereLightHelper";
      const i = new Qr(e);
      i.rotateY(Math.PI * 0.5), this.material = new yi({
        wireframe: true,
        fog: false,
        toneMapped: false
      }), this.color === void 0 && (this.material.vertexColors = true);
      const s = i.getAttribute("position"), o = new Float32Array(s.count * 3);
      i.setAttribute("color", new se(o, 3)), this.add(new ae(i, this.material)), this.update();
    }
    dispose() {
      this.children[0].geometry.dispose(), this.children[0].material.dispose();
    }
    update() {
      const t = this.children[0];
      if (this.color !== void 0) this.material.color.set(this.color);
      else {
        const e = t.geometry.getAttribute("color");
        ad.copy(this.light.color), ld.copy(this.light.groundColor);
        for (let n = 0, i = e.count; n < i; n++) {
          const s = n < i / 2 ? ad : ld;
          e.setXYZ(n, s.r, s.g, s.b);
        }
        e.needsUpdate = true;
      }
      this.light.updateWorldMatrix(true, false), t.lookAt(nS.setFromMatrixPosition(this.light.matrixWorld).negate());
    }
  }
  class Wp extends Dn {
    constructor(t = 10, e = 10, n = 4473924, i = 8947848) {
      n = new xt(n), i = new xt(i);
      const s = e / 2, o = t / e, a = t / 2, l = [], c = [];
      for (let u = 0, f = 0, m = -a; u <= e; u++, m += o) {
        l.push(-a, 0, m, a, 0, m), l.push(m, 0, -a, m, 0, a);
        const _ = u === s ? n : i;
        _.toArray(c, f), f += 3, _.toArray(c, f), f += 3, _.toArray(c, f), f += 3, _.toArray(c, f), f += 3;
      }
      const h = new Wt();
      h.setAttribute("position", new bt(l, 3)), h.setAttribute("color", new bt(c, 3));
      const d = new He({
        vertexColors: true,
        toneMapped: false
      });
      super(h, d), this.type = "GridHelper";
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  class sS extends Dn {
    constructor(t = 10, e = 16, n = 8, i = 64, s = 4473924, o = 8947848) {
      s = new xt(s), o = new xt(o);
      const a = [], l = [];
      if (e > 1) for (let d = 0; d < e; d++) {
        const u = d / e * (Math.PI * 2), f = Math.sin(u) * t, m = Math.cos(u) * t;
        a.push(0, 0, 0), a.push(f, 0, m);
        const _ = d & 1 ? s : o;
        l.push(_.r, _.g, _.b), l.push(_.r, _.g, _.b);
      }
      for (let d = 0; d < n; d++) {
        const u = d & 1 ? s : o, f = t - t / n * d;
        for (let m = 0; m < i; m++) {
          let _ = m / i * (Math.PI * 2), g = Math.sin(_) * f, p = Math.cos(_) * f;
          a.push(g, 0, p), l.push(u.r, u.g, u.b), _ = (m + 1) / i * (Math.PI * 2), g = Math.sin(_) * f, p = Math.cos(_) * f, a.push(g, 0, p), l.push(u.r, u.g, u.b);
        }
      }
      const c = new Wt();
      c.setAttribute("position", new bt(a, 3)), c.setAttribute("color", new bt(l, 3));
      const h = new He({
        vertexColors: true,
        toneMapped: false
      });
      super(c, h), this.type = "PolarGridHelper";
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  const cd = new R(), Zo = new R(), hd = new R();
  class rS extends jt {
    constructor(t, e, n) {
      super(), this.light = t, this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.color = n, this.type = "DirectionalLightHelper", e === void 0 && (e = 1);
      let i = new Wt();
      i.setAttribute("position", new bt([
        -e,
        e,
        0,
        e,
        e,
        0,
        e,
        -e,
        0,
        -e,
        -e,
        0,
        -e,
        e,
        0
      ], 3));
      const s = new He({
        fog: false,
        toneMapped: false
      });
      this.lightPlane = new xi(i, s), this.add(this.lightPlane), i = new Wt(), i.setAttribute("position", new bt([
        0,
        0,
        0,
        0,
        0,
        1
      ], 3)), this.targetLine = new xi(i, s), this.add(this.targetLine), this.update();
    }
    dispose() {
      this.lightPlane.geometry.dispose(), this.lightPlane.material.dispose(), this.targetLine.geometry.dispose(), this.targetLine.material.dispose();
    }
    update() {
      this.light.updateWorldMatrix(true, false), this.light.target.updateWorldMatrix(true, false), cd.setFromMatrixPosition(this.light.matrixWorld), Zo.setFromMatrixPosition(this.light.target.matrixWorld), hd.subVectors(Zo, cd), this.lightPlane.lookAt(Zo), this.color !== void 0 ? (this.lightPlane.material.color.set(this.color), this.targetLine.material.color.set(this.color)) : (this.lightPlane.material.color.copy(this.light.color), this.targetLine.material.color.copy(this.light.color)), this.targetLine.lookAt(Zo), this.targetLine.scale.z = hd.length();
    }
  }
  const Jo = new R(), ue = new wa();
  class oS extends Dn {
    constructor(t) {
      const e = new Wt(), n = new He({
        color: 16777215,
        vertexColors: true,
        toneMapped: false
      }), i = [], s = [], o = {};
      a("n1", "n2"), a("n2", "n4"), a("n4", "n3"), a("n3", "n1"), a("f1", "f2"), a("f2", "f4"), a("f4", "f3"), a("f3", "f1"), a("n1", "f1"), a("n2", "f2"), a("n3", "f3"), a("n4", "f4"), a("p", "n1"), a("p", "n2"), a("p", "n3"), a("p", "n4"), a("u1", "u2"), a("u2", "u3"), a("u3", "u1"), a("c", "t"), a("p", "c"), a("cn1", "cn2"), a("cn3", "cn4"), a("cf1", "cf2"), a("cf3", "cf4");
      function a(m, _) {
        l(m), l(_);
      }
      function l(m) {
        i.push(0, 0, 0), s.push(0, 0, 0), o[m] === void 0 && (o[m] = []), o[m].push(i.length / 3 - 1);
      }
      e.setAttribute("position", new bt(i, 3)), e.setAttribute("color", new bt(s, 3)), super(e, n), this.type = "CameraHelper", this.camera = t, this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix(), this.matrix = t.matrixWorld, this.matrixAutoUpdate = false, this.pointMap = o, this.update();
      const c = new xt(16755200), h = new xt(16711680), d = new xt(43775), u = new xt(16777215), f = new xt(3355443);
      this.setColors(c, h, d, u, f);
    }
    setColors(t, e, n, i, s) {
      const a = this.geometry.getAttribute("color");
      a.setXYZ(0, t.r, t.g, t.b), a.setXYZ(1, t.r, t.g, t.b), a.setXYZ(2, t.r, t.g, t.b), a.setXYZ(3, t.r, t.g, t.b), a.setXYZ(4, t.r, t.g, t.b), a.setXYZ(5, t.r, t.g, t.b), a.setXYZ(6, t.r, t.g, t.b), a.setXYZ(7, t.r, t.g, t.b), a.setXYZ(8, t.r, t.g, t.b), a.setXYZ(9, t.r, t.g, t.b), a.setXYZ(10, t.r, t.g, t.b), a.setXYZ(11, t.r, t.g, t.b), a.setXYZ(12, t.r, t.g, t.b), a.setXYZ(13, t.r, t.g, t.b), a.setXYZ(14, t.r, t.g, t.b), a.setXYZ(15, t.r, t.g, t.b), a.setXYZ(16, t.r, t.g, t.b), a.setXYZ(17, t.r, t.g, t.b), a.setXYZ(18, t.r, t.g, t.b), a.setXYZ(19, t.r, t.g, t.b), a.setXYZ(20, t.r, t.g, t.b), a.setXYZ(21, t.r, t.g, t.b), a.setXYZ(22, t.r, t.g, t.b), a.setXYZ(23, t.r, t.g, t.b), a.setXYZ(24, e.r, e.g, e.b), a.setXYZ(25, e.r, e.g, e.b), a.setXYZ(26, e.r, e.g, e.b), a.setXYZ(27, e.r, e.g, e.b), a.setXYZ(28, e.r, e.g, e.b), a.setXYZ(29, e.r, e.g, e.b), a.setXYZ(30, e.r, e.g, e.b), a.setXYZ(31, e.r, e.g, e.b), a.setXYZ(32, n.r, n.g, n.b), a.setXYZ(33, n.r, n.g, n.b), a.setXYZ(34, n.r, n.g, n.b), a.setXYZ(35, n.r, n.g, n.b), a.setXYZ(36, n.r, n.g, n.b), a.setXYZ(37, n.r, n.g, n.b), a.setXYZ(38, i.r, i.g, i.b), a.setXYZ(39, i.r, i.g, i.b), a.setXYZ(40, s.r, s.g, s.b), a.setXYZ(41, s.r, s.g, s.b), a.setXYZ(42, s.r, s.g, s.b), a.setXYZ(43, s.r, s.g, s.b), a.setXYZ(44, s.r, s.g, s.b), a.setXYZ(45, s.r, s.g, s.b), a.setXYZ(46, s.r, s.g, s.b), a.setXYZ(47, s.r, s.g, s.b), a.setXYZ(48, s.r, s.g, s.b), a.setXYZ(49, s.r, s.g, s.b), a.needsUpdate = true;
    }
    update() {
      const t = this.geometry, e = this.pointMap, n = 1, i = 1;
      ue.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse), me("c", e, t, ue, 0, 0, -1), me("t", e, t, ue, 0, 0, 1), me("n1", e, t, ue, -n, -i, -1), me("n2", e, t, ue, n, -i, -1), me("n3", e, t, ue, -n, i, -1), me("n4", e, t, ue, n, i, -1), me("f1", e, t, ue, -n, -i, 1), me("f2", e, t, ue, n, -i, 1), me("f3", e, t, ue, -n, i, 1), me("f4", e, t, ue, n, i, 1), me("u1", e, t, ue, n * 0.7, i * 1.1, -1), me("u2", e, t, ue, -n * 0.7, i * 1.1, -1), me("u3", e, t, ue, 0, i * 2, -1), me("cf1", e, t, ue, -n, 0, 1), me("cf2", e, t, ue, n, 0, 1), me("cf3", e, t, ue, 0, -i, 1), me("cf4", e, t, ue, 0, i, 1), me("cn1", e, t, ue, -n, 0, -1), me("cn2", e, t, ue, n, 0, -1), me("cn3", e, t, ue, 0, -i, -1), me("cn4", e, t, ue, 0, i, -1), t.getAttribute("position").needsUpdate = true;
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  function me(r, t, e, n, i, s, o) {
    Jo.set(i, s, o).unproject(n);
    const a = t[r];
    if (a !== void 0) {
      const l = e.getAttribute("position");
      for (let c = 0, h = a.length; c < h; c++) l.setXYZ(a[c], Jo.x, Jo.y, Jo.z);
    }
  }
  const Ko = new De();
  class aS extends Dn {
    constructor(t, e = 16776960) {
      const n = new Uint16Array([
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        0,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        4,
        0,
        4,
        1,
        5,
        2,
        6,
        3,
        7
      ]), i = new Float32Array(8 * 3), s = new Wt();
      s.setIndex(new se(n, 1)), s.setAttribute("position", new se(i, 3)), super(s, new He({
        color: e,
        toneMapped: false
      })), this.object = t, this.type = "BoxHelper", this.matrixAutoUpdate = false, this.update();
    }
    update(t) {
      if (t !== void 0 && console.warn("THREE.BoxHelper: .update() has no longer arguments."), this.object !== void 0 && Ko.setFromObject(this.object), Ko.isEmpty()) return;
      const e = Ko.min, n = Ko.max, i = this.geometry.attributes.position, s = i.array;
      s[0] = n.x, s[1] = n.y, s[2] = n.z, s[3] = e.x, s[4] = n.y, s[5] = n.z, s[6] = e.x, s[7] = e.y, s[8] = n.z, s[9] = n.x, s[10] = e.y, s[11] = n.z, s[12] = n.x, s[13] = n.y, s[14] = e.z, s[15] = e.x, s[16] = n.y, s[17] = e.z, s[18] = e.x, s[19] = e.y, s[20] = e.z, s[21] = n.x, s[22] = e.y, s[23] = e.z, i.needsUpdate = true, this.geometry.computeBoundingSphere();
    }
    setFromObject(t) {
      return this.object = t, this.update(), this;
    }
    copy(t, e) {
      return super.copy(t, e), this.object = t.object, this;
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  class lS extends Dn {
    constructor(t, e = 16776960) {
      const n = new Uint16Array([
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        0,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        4,
        0,
        4,
        1,
        5,
        2,
        6,
        3,
        7
      ]), i = [
        1,
        1,
        1,
        -1,
        1,
        1,
        -1,
        -1,
        1,
        1,
        -1,
        1,
        1,
        1,
        -1,
        -1,
        1,
        -1,
        -1,
        -1,
        -1,
        1,
        -1,
        -1
      ], s = new Wt();
      s.setIndex(new se(n, 1)), s.setAttribute("position", new bt(i, 3)), super(s, new He({
        color: e,
        toneMapped: false
      })), this.box = t, this.type = "Box3Helper", this.geometry.computeBoundingSphere();
    }
    updateMatrixWorld(t) {
      const e = this.box;
      e.isEmpty() || (e.getCenter(this.position), e.getSize(this.scale), this.scale.multiplyScalar(0.5), super.updateMatrixWorld(t));
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  class cS extends xi {
    constructor(t, e = 1, n = 16776960) {
      const i = n, s = [
        1,
        -1,
        0,
        -1,
        1,
        0,
        -1,
        -1,
        0,
        1,
        1,
        0,
        -1,
        1,
        0,
        -1,
        -1,
        0,
        1,
        -1,
        0,
        1,
        1,
        0
      ], o = new Wt();
      o.setAttribute("position", new bt(s, 3)), o.computeBoundingSphere(), super(o, new He({
        color: i,
        toneMapped: false
      })), this.type = "PlaneHelper", this.plane = t, this.size = e;
      const a = [
        1,
        1,
        0,
        -1,
        1,
        0,
        -1,
        -1,
        0,
        1,
        1,
        0,
        -1,
        -1,
        0,
        1,
        -1,
        0
      ], l = new Wt();
      l.setAttribute("position", new bt(a, 3)), l.computeBoundingSphere(), this.add(new ae(l, new yi({
        color: i,
        opacity: 0.2,
        transparent: true,
        depthWrite: false,
        toneMapped: false
      })));
    }
    updateMatrixWorld(t) {
      this.position.set(0, 0, 0), this.scale.set(0.5 * this.size, 0.5 * this.size, 1), this.lookAt(this.plane.normal), this.translateZ(-this.plane.constant), super.updateMatrixWorld(t);
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose(), this.children[0].geometry.dispose(), this.children[0].material.dispose();
    }
  }
  const ud = new R();
  let Qo, Ol;
  class hS extends jt {
    constructor(t = new R(0, 0, 1), e = new R(0, 0, 0), n = 1, i = 16776960, s = n * 0.2, o = s * 0.2) {
      super(), this.type = "ArrowHelper", Qo === void 0 && (Qo = new Wt(), Qo.setAttribute("position", new bt([
        0,
        0,
        0,
        0,
        1,
        0
      ], 3)), Ol = new Ys(0, 0.5, 1, 5, 1), Ol.translate(0, -0.5, 0)), this.position.copy(e), this.line = new xi(Qo, new He({
        color: i,
        toneMapped: false
      })), this.line.matrixAutoUpdate = false, this.add(this.line), this.cone = new ae(Ol, new yi({
        color: i,
        toneMapped: false
      })), this.cone.matrixAutoUpdate = false, this.add(this.cone), this.setDirection(t), this.setLength(n, s, o);
    }
    setDirection(t) {
      if (t.y > 0.99999) this.quaternion.set(0, 0, 0, 1);
      else if (t.y < -0.99999) this.quaternion.set(1, 0, 0, 0);
      else {
        ud.set(t.z, 0, -t.x).normalize();
        const e = Math.acos(t.y);
        this.quaternion.setFromAxisAngle(ud, e);
      }
    }
    setLength(t, e = t * 0.2, n = e * 0.2) {
      this.line.scale.set(1, Math.max(1e-4, t - e), 1), this.line.updateMatrix(), this.cone.scale.set(n, e, n), this.cone.position.y = t, this.cone.updateMatrix();
    }
    setColor(t) {
      this.line.material.color.set(t), this.cone.material.color.set(t);
    }
    copy(t) {
      return super.copy(t, false), this.line.copy(t.line), this.cone.copy(t.cone), this;
    }
    dispose() {
      this.line.geometry.dispose(), this.line.material.dispose(), this.cone.geometry.dispose(), this.cone.material.dispose();
    }
  }
  class uS extends Dn {
    constructor(t = 1) {
      const e = [
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        0,
        0,
        0,
        t,
        0,
        0,
        0,
        0,
        0,
        0,
        t
      ], n = [
        1,
        0,
        0,
        1,
        0.6,
        0,
        0,
        1,
        0,
        0.6,
        1,
        0,
        0,
        0,
        1,
        0,
        0.6,
        1
      ], i = new Wt();
      i.setAttribute("position", new bt(e, 3)), i.setAttribute("color", new bt(n, 3));
      const s = new He({
        vertexColors: true,
        toneMapped: false
      });
      super(i, s), this.type = "AxesHelper";
    }
    setColors(t, e, n) {
      const i = new xt(), s = this.geometry.attributes.color.array;
      return i.set(t), i.toArray(s, 0), i.toArray(s, 3), i.set(e), i.toArray(s, 6), i.toArray(s, 9), i.set(n), i.toArray(s, 12), i.toArray(s, 15), this.geometry.attributes.color.needsUpdate = true, this;
    }
    dispose() {
      this.geometry.dispose(), this.material.dispose();
    }
  }
  class dS {
    constructor() {
      this.type = "ShapePath", this.color = new xt(), this.subPaths = [], this.currentPath = null;
    }
    moveTo(t, e) {
      return this.currentPath = new Ji(), this.subPaths.push(this.currentPath), this.currentPath.moveTo(t, e), this;
    }
    lineTo(t, e) {
      return this.currentPath.lineTo(t, e), this;
    }
    quadraticCurveTo(t, e, n, i) {
      return this.currentPath.quadraticCurveTo(t, e, n, i), this;
    }
    bezierCurveTo(t, e, n, i, s, o) {
      return this.currentPath.bezierCurveTo(t, e, n, i, s, o), this;
    }
    splineThru(t) {
      return this.currentPath.splineThru(t), this;
    }
    toShapes(t) {
      function e(p) {
        const v = [];
        for (let x = 0, S = p.length; x < S; x++) {
          const P = p[x], b = new Ae();
          b.curves = P.curves, v.push(b);
        }
        return v;
      }
      function n(p, v) {
        const x = v.length;
        let S = false;
        for (let P = x - 1, b = 0; b < x; P = b++) {
          let T = v[P], E = v[b], M = E.x - T.x, y = E.y - T.y;
          if (Math.abs(y) > Number.EPSILON) {
            if (y < 0 && (T = v[b], M = -M, E = v[P], y = -y), p.y < T.y || p.y > E.y) continue;
            if (p.y === T.y) {
              if (p.x === T.x) return true;
            } else {
              const C = y * (p.x - T.x) - M * (p.y - T.y);
              if (C === 0) return true;
              if (C < 0) continue;
              S = !S;
            }
          } else {
            if (p.y !== T.y) continue;
            if (E.x <= p.x && p.x <= T.x || T.x <= p.x && p.x <= E.x) return true;
          }
        }
        return S;
      }
      const i = Pn.isClockWise, s = this.subPaths;
      if (s.length === 0) return [];
      let o, a, l;
      const c = [];
      if (s.length === 1) return a = s[0], l = new Ae(), l.curves = a.curves, c.push(l), c;
      let h = !i(s[0].getPoints());
      h = t ? !h : h;
      const d = [], u = [];
      let f = [], m = 0, _;
      u[m] = void 0, f[m] = [];
      for (let p = 0, v = s.length; p < v; p++) a = s[p], _ = a.getPoints(), o = i(_), o = t ? !o : o, o ? (!h && u[m] && m++, u[m] = {
        s: new Ae(),
        p: _
      }, u[m].s.curves = a.curves, h && m++, f[m] = []) : f[m].push({
        h: a,
        p: _[0]
      });
      if (!u[0]) return e(s);
      if (u.length > 1) {
        let p = false, v = 0;
        for (let x = 0, S = u.length; x < S; x++) d[x] = [];
        for (let x = 0, S = u.length; x < S; x++) {
          const P = f[x];
          for (let b = 0; b < P.length; b++) {
            const T = P[b];
            let E = true;
            for (let M = 0; M < u.length; M++) n(T.p, u[M].p) && (x !== M && v++, E ? (E = false, d[M].push(T)) : p = true);
            E && d[x].push(T);
          }
        }
        v > 0 && p === false && (f = d);
      }
      let g;
      for (let p = 0, v = u.length; p < v; p++) {
        l = u[p].s, c.push(l), g = f[p];
        for (let x = 0, S = g.length; x < S; x++) l.holes.push(g[x].h);
      }
      return c;
    }
  }
  class fS extends Mn {
    constructor(t = 1, e = 1, n = 1, i = {}) {
      console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'), super(t, e, {
        ...i,
        count: n
      }), this.isWebGLMultipleRenderTargets = true;
    }
    get texture() {
      return this.textures;
    }
  }
  typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", {
    detail: {
      revision: xa
    }
  }));
  typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = xa);
  const pS = Object.freeze(Object.defineProperty({
    __proto__: null,
    ACESFilmicToneMapping: sf,
    AddEquation: fi,
    AddOperation: jd,
    AdditiveAnimationBlendMode: Gc,
    AdditiveBlending: Vl,
    AgXToneMapping: of,
    AlphaFormat: df,
    AlwaysCompare: Pf,
    AlwaysDepth: Yd,
    AlwaysStencilFunc: _c,
    AmbientLight: ph,
    AnimationAction: Vp,
    AnimationClip: Vr,
    AnimationLoader: mM,
    AnimationMixer: WM,
    AnimationObjectGroup: HM,
    AnimationUtils: uM,
    ArcCurve: rp,
    ArrayCamera: $f,
    ArrowHelper: hS,
    AttachedBindMode: Wl,
    Audio: Bp,
    AudioAnalyser: LM,
    AudioContext: mh,
    AudioListener: RM,
    AudioLoader: AM,
    AxesHelper: uS,
    BackSide: Ve,
    BasicDepthPacking: Mf,
    BasicShadowMap: bm,
    BatchedMesh: ep,
    Bone: eh,
    BooleanKeyframeTrack: ns,
    Box2: KM,
    Box3: De,
    Box3Helper: lS,
    BoxGeometry: ni,
    BoxHelper: aS,
    BufferAttribute: se,
    BufferGeometry: Wt,
    BufferGeometryLoader: zp,
    ByteType: cf,
    Cache: Gn,
    Camera: wa,
    CameraHelper: oS,
    CanvasTexture: sp,
    CapsuleGeometry: Da,
    CatmullRomCurve3: op,
    CineonToneMapping: nf,
    CircleGeometry: Ua,
    ClampToEdgeWrapping: dn,
    Clock: Fp,
    Color: xt,
    ColorKeyframeTrack: uh,
    ColorManagement: ne,
    CompressedArrayTexture: Uy,
    CompressedCubeTexture: Ny,
    CompressedTexture: Ia,
    CompressedTextureLoader: gM,
    ConeGeometry: Na,
    ConstantAlphaFactor: Gd,
    ConstantColorFactor: Vd,
    CubeCamera: Bf,
    CubeReflectionMapping: Jn,
    CubeRefractionMapping: _i,
    CubeTexture: Zr,
    CubeTextureLoader: _M,
    CubeUVReflectionMapping: Vs,
    CubicBezierCurve: sh,
    CubicBezierCurve3: ap,
    CubicInterpolant: Ap,
    CullFaceBack: kl,
    CullFaceFront: Ad,
    CullFaceFrontBack: Sm,
    CullFaceNone: Td,
    Curve: bn,
    CurvePath: cp,
    CustomBlending: Ed,
    CustomToneMapping: rf,
    CylinderGeometry: Ys,
    Cylindrical: JM,
    Data3DTexture: Yc,
    DataArrayTexture: Sa,
    DataTexture: pi,
    DataTextureLoader: xM,
    DataUtils: Lg,
    DecrementStencilOp: Um,
    DecrementWrapStencilOp: Om,
    DefaultLoadingManager: Rp,
    DepthFormat: Wi,
    DepthStencilFormat: Os,
    DepthTexture: Jc,
    DetachedBindMode: lf,
    DirectionalLight: da,
    DirectionalLightHelper: rS,
    DiscreteInterpolant: Ep,
    DisplayP3ColorSpace: Ma,
    DodecahedronGeometry: Oa,
    DoubleSide: Xe,
    DstAlphaFactor: Od,
    DstColorFactor: Fd,
    DynamicCopyUsage: Km,
    DynamicDrawUsage: Xm,
    DynamicReadUsage: $m,
    EdgesGeometry: hp,
    EllipseCurve: La,
    EqualCompare: Af,
    EqualDepth: $d,
    EqualStencilFunc: km,
    EquirectangularReflectionMapping: Ns,
    EquirectangularRefractionMapping: wr,
    Euler: rn,
    EventDispatcher: ei,
    ExtrudeGeometry: Qe,
    FileLoader: Qn,
    Float16BufferAttribute: Fg,
    Float32BufferAttribute: bt,
    FloatType: fn,
    Fog: Ca,
    FogExp2: Ea,
    FramebufferTexture: Dy,
    FrontSide: Zn,
    Frustum: Jr,
    GLBufferAttribute: $M,
    GLSL1: jm,
    GLSL3: xc,
    GreaterCompare: Ef,
    GreaterDepth: Jd,
    GreaterEqualCompare: Rf,
    GreaterEqualDepth: Zd,
    GreaterEqualStencilFunc: Wm,
    GreaterStencilFunc: Hm,
    GridHelper: Wp,
    Group: vn,
    HalfFloatType: qr,
    HemisphereLight: Pp,
    HemisphereLightHelper: iS,
    IcosahedronGeometry: Fa,
    ImageBitmapLoader: TM,
    ImageLoader: Hr,
    ImageUtils: Uf,
    IncrementStencilOp: Dm,
    IncrementWrapStencilOp: Nm,
    InstancedBufferAttribute: Bs,
    InstancedBufferGeometry: Op,
    InstancedInterleavedBuffer: qM,
    InstancedMesh: tp,
    Int16BufferAttribute: Og,
    Int32BufferAttribute: zg,
    Int8BufferAttribute: Dg,
    IntType: Oc,
    InterleavedBuffer: Ra,
    InterleavedBufferAttribute: Zi,
    Interpolant: eo,
    InterpolateDiscrete: Er,
    InterpolateLinear: Cr,
    InterpolateSmooth: ra,
    InvertStencilOp: zm,
    KeepStencilOp: Oi,
    KeyframeTrack: wn,
    LOD: Qf,
    LatheGeometry: Kr,
    Layers: ba,
    LessCompare: Tf,
    LessDepth: qd,
    LessEqualCompare: Wc,
    LessEqualDepth: br,
    LessEqualStencilFunc: Vm,
    LessStencilFunc: Bm,
    Light: Si,
    LightProbe: Np,
    Line: xi,
    Line3: QM,
    LineBasicMaterial: He,
    LineCurve: rh,
    LineCurve3: lp,
    LineDashedMaterial: bp,
    LineLoop: np,
    LineSegments: Dn,
    LinearDisplayP3ColorSpace: $r,
    LinearFilter: xe,
    LinearInterpolant: hh,
    LinearMipMapLinearFilter: Em,
    LinearMipMapNearestFilter: Am,
    LinearMipmapLinearFilter: Cn,
    LinearMipmapNearestFilter: gr,
    LinearSRGBColorSpace: ti,
    LinearToneMapping: tf,
    LinearTransfer: Pr,
    Loader: $e,
    LoaderUtils: Tc,
    LoadingManager: dh,
    LoopOnce: xf,
    LoopPingPong: yf,
    LoopRepeat: vf,
    LuminanceAlphaFormat: mf,
    LuminanceFormat: pf,
    MOUSE: ym,
    Material: Ne,
    MaterialLoader: Wa,
    MathUtils: gg,
    Matrix3: Bt,
    Matrix4: Dt,
    MaxEquation: Id,
    Mesh: ae,
    MeshBasicMaterial: yi,
    MeshDepthMaterial: Kc,
    MeshDistanceMaterial: Qc,
    MeshLambertMaterial: Mp,
    MeshMatcapMaterial: Sp,
    MeshNormalMaterial: yp,
    MeshPhongMaterial: xp,
    MeshPhysicalMaterial: _p,
    MeshStandardMaterial: Be,
    MeshToonMaterial: vp,
    MinEquation: Pd,
    MirroredRepeatWrapping: Ar,
    MixOperation: Qd,
    MultiplyBlending: Gl,
    MultiplyOperation: Yr,
    NearestFilter: we,
    NearestMipMapLinearFilter: Tm,
    NearestMipMapNearestFilter: wm,
    NearestMipmapLinearFilter: Es,
    NearestMipmapNearestFilter: Uc,
    NeutralToneMapping: af,
    NeverCompare: wf,
    NeverDepth: Xd,
    NeverStencilFunc: Fm,
    NoBlending: Wn,
    NoColorSpace: Vn,
    NoToneMapping: Xn,
    NormalAnimationBlendMode: ya,
    NormalBlending: Gi,
    NotEqualCompare: Cf,
    NotEqualDepth: Kd,
    NotEqualStencilFunc: Gm,
    NumberKeyframeTrack: Br,
    Object3D: jt,
    ObjectLoader: bM,
    ObjectSpaceNormalMap: bf,
    OctahedronGeometry: Qr,
    OneFactor: Dd,
    OneMinusConstantAlphaFactor: Wd,
    OneMinusConstantColorFactor: Hd,
    OneMinusDstAlphaFactor: zd,
    OneMinusDstColorFactor: Bd,
    OneMinusSrcAlphaFactor: la,
    OneMinusSrcColorFactor: Nd,
    OrthographicCamera: Ta,
    P3Primaries: Lr,
    PCFShadowMap: Lc,
    PCFSoftShadowMap: Dc,
    PMREMGenerator: vc,
    Path: Ji,
    PerspectiveCamera: be,
    Plane: di,
    PlaneGeometry: Ws,
    PlaneHelper: cS,
    PointLight: Lp,
    PointLightHelper: eS,
    Points: ip,
    PointsMaterial: nh,
    PolarGridHelper: sS,
    PolyhedronGeometry: Mi,
    PositionalAudio: IM,
    PropertyBinding: Kt,
    PropertyMixer: kp,
    QuadraticBezierCurve: oh,
    QuadraticBezierCurve3: ah,
    Quaternion: qe,
    QuaternionKeyframeTrack: qs,
    QuaternionLinearInterpolant: Cp,
    RED_GREEN_RGTC2_Format: mc,
    RED_RGTC1_Format: _f,
    REVISION: xa,
    RGBADepthPacking: Sf,
    RGBAFormat: nn,
    RGBAIntegerFormat: Hc,
    RGBA_ASTC_10x10_Format: cc,
    RGBA_ASTC_10x5_Format: oc,
    RGBA_ASTC_10x6_Format: ac,
    RGBA_ASTC_10x8_Format: lc,
    RGBA_ASTC_12x10_Format: hc,
    RGBA_ASTC_12x12_Format: uc,
    RGBA_ASTC_4x4_Format: Ql,
    RGBA_ASTC_5x4_Format: jl,
    RGBA_ASTC_5x5_Format: tc,
    RGBA_ASTC_6x5_Format: ec,
    RGBA_ASTC_6x6_Format: nc,
    RGBA_ASTC_8x5_Format: ic,
    RGBA_ASTC_8x6_Format: sc,
    RGBA_ASTC_8x8_Format: rc,
    RGBA_BPTC_Format: sa,
    RGBA_ETC2_EAC_Format: Kl,
    RGBA_PVRTC_2BPPV1_Format: $l,
    RGBA_PVRTC_4BPPV1_Format: ql,
    RGBA_S3TC_DXT1_Format: ea,
    RGBA_S3TC_DXT3_Format: na,
    RGBA_S3TC_DXT5_Format: ia,
    RGBFormat: ff,
    RGB_BPTC_SIGNED_Format: dc,
    RGB_BPTC_UNSIGNED_Format: fc,
    RGB_ETC1_Format: Zl,
    RGB_ETC2_Format: Jl,
    RGB_PVRTC_2BPPV1_Format: Yl,
    RGB_PVRTC_4BPPV1_Format: Xl,
    RGB_S3TC_DXT1_Format: ta,
    RGFormat: gf,
    RGIntegerFormat: Vc,
    RawShaderMaterial: gp,
    Ray: Gs,
    Raycaster: Hp,
    Rec709Primaries: Ir,
    RectAreaLight: Dp,
    RedFormat: Bc,
    RedIntegerFormat: kc,
    ReinhardToneMapping: ef,
    RenderTarget: Nf,
    RepeatWrapping: Tr,
    ReplaceStencilOp: Lm,
    ReverseSubtractEquation: Rd,
    RingGeometry: Ba,
    SIGNED_RED_GREEN_RGTC2_Format: gc,
    SIGNED_RED_RGTC1_Format: pc,
    SRGBColorSpace: un,
    SRGBTransfer: re,
    Scene: jc,
    ShaderChunk: Ht,
    ShaderLib: xn,
    ShaderMaterial: Sn,
    ShadowMaterial: mp,
    Shape: Ae,
    ShapeGeometry: jr,
    ShapePath: dS,
    ShapeUtils: Pn,
    ShortType: hf,
    Skeleton: Pa,
    SkeletonHelper: tS,
    SkinnedMesh: jf,
    Source: Vi,
    Sphere: Ue,
    SphereGeometry: to,
    Spherical: ZM,
    SphericalHarmonics3: Up,
    SplineCurve: lh,
    SpotLight: Ip,
    SpotLightHelper: jM,
    Sprite: Kf,
    SpriteMaterial: th,
    SrcAlphaFactor: aa,
    SrcAlphaSaturateFactor: kd,
    SrcColorFactor: Ud,
    StaticCopyUsage: Jm,
    StaticDrawUsage: Dr,
    StaticReadUsage: qm,
    StereoCamera: EM,
    StreamCopyUsage: Qm,
    StreamDrawUsage: Ym,
    StreamReadUsage: Zm,
    StringKeyframeTrack: is,
    SubtractEquation: Cd,
    SubtractiveBlending: Hl,
    TOUCH: Mm,
    TangentSpaceNormalMap: vi,
    TetrahedronGeometry: ka,
    Texture: fe,
    TextureLoader: vM,
    TorusGeometry: Va,
    TorusKnotGeometry: Ha,
    Triangle: en,
    TriangleFanDrawMode: Pm,
    TriangleStripDrawMode: Rm,
    TrianglesDrawMode: Cm,
    TubeGeometry: Ga,
    UVMapping: va,
    Uint16BufferAttribute: qc,
    Uint32BufferAttribute: $c,
    Uint8BufferAttribute: Ug,
    Uint8ClampedBufferAttribute: Ng,
    Uniform: xh,
    UniformsGroup: YM,
    UniformsLib: ht,
    UniformsUtils: Ff,
    UnsignedByteType: Kn,
    UnsignedInt248Type: Hs,
    UnsignedInt5999Type: uf,
    UnsignedIntType: $i,
    UnsignedShort4444Type: zc,
    UnsignedShort5551Type: Fc,
    UnsignedShortType: Nc,
    VSMShadowMap: An,
    Vector2: et,
    Vector3: R,
    Vector4: ie,
    VectorKeyframeTrack: kr,
    VideoTexture: Ly,
    WebGL3DRenderTarget: Sg,
    WebGLArrayRenderTarget: Mg,
    WebGLCoordinateSystem: Rn,
    WebGLCubeRenderTarget: kf,
    WebGLMultipleRenderTargets: fS,
    WebGLRenderTarget: Mn,
    WebGLRenderer: Zf,
    WebGLUtils: qf,
    WebGPUCoordinateSystem: Ur,
    WireframeGeometry: pp,
    WrapAroundEnding: Rr,
    ZeroCurvatureEnding: Bi,
    ZeroFactor: Ld,
    ZeroSlopeEnding: ki,
    ZeroStencilOp: Im,
    createCanvasElement: Lf
  }, Symbol.toStringTag, {
    value: "Module"
  })), hr = new R();
  function ln(r, t, e, n, i, s) {
    const o = 2 * Math.PI * i / 4, a = Math.max(s - 2 * i, 0), l = Math.PI / 4;
    hr.copy(t), hr[n] = 0, hr.normalize();
    const c = 0.5 * o / (o + a), h = 1 - hr.angleTo(r) / l;
    return Math.sign(hr[e]) === 1 ? h * c : a / (o + a) + c + c * (1 - h);
  }
  class mS extends ni {
    constructor(t = 1, e = 1, n = 1, i = 2, s = 0.1) {
      if (i = i * 2 + 1, s = Math.min(t / 2, e / 2, n / 2, s), super(1, 1, 1, i, i, i), i === 1) return;
      const o = this.toNonIndexed();
      this.index = null, this.attributes.position = o.attributes.position, this.attributes.normal = o.attributes.normal, this.attributes.uv = o.attributes.uv;
      const a = new R(), l = new R(), c = new R(t, e, n).divideScalar(2).subScalar(s), h = this.attributes.position.array, d = this.attributes.normal.array, u = this.attributes.uv.array, f = h.length / 6, m = new R(), _ = 0.5 / i;
      for (let g = 0, p = 0; g < h.length; g += 3, p += 2) switch (a.fromArray(h, g), l.copy(a), l.x -= Math.sign(l.x) * _, l.y -= Math.sign(l.y) * _, l.z -= Math.sign(l.z) * _, l.normalize(), h[g + 0] = c.x * Math.sign(a.x) + l.x * s, h[g + 1] = c.y * Math.sign(a.y) + l.y * s, h[g + 2] = c.z * Math.sign(a.z) + l.z * s, d[g + 0] = l.x, d[g + 1] = l.y, d[g + 2] = l.z, Math.floor(g / f)) {
        case 0:
          m.set(1, 0, 0), u[p + 0] = ln(m, l, "z", "y", s, n), u[p + 1] = 1 - ln(m, l, "y", "z", s, e);
          break;
        case 1:
          m.set(-1, 0, 0), u[p + 0] = 1 - ln(m, l, "z", "y", s, n), u[p + 1] = 1 - ln(m, l, "y", "z", s, e);
          break;
        case 2:
          m.set(0, 1, 0), u[p + 0] = 1 - ln(m, l, "x", "z", s, t), u[p + 1] = ln(m, l, "z", "x", s, n);
          break;
        case 3:
          m.set(0, -1, 0), u[p + 0] = 1 - ln(m, l, "x", "z", s, t), u[p + 1] = 1 - ln(m, l, "z", "x", s, n);
          break;
        case 4:
          m.set(0, 0, 1), u[p + 0] = 1 - ln(m, l, "x", "y", s, t), u[p + 1] = 1 - ln(m, l, "y", "x", s, e);
          break;
        case 5:
          m.set(0, 0, -1), u[p + 0] = ln(m, l, "x", "y", s, t), u[p + 1] = 1 - ln(m, l, "y", "x", s, e);
          break;
      }
    }
  }
  class cn {
    constructor(t, e, n, i, s, o, a, l, c, h, d = 0, u = 1) {
      this.length = t, this.gridX = e, this.gridZ = n, this.direction = i, this.isVertical = s, this.isAnimating = false, this.isFalling = false, this.needsTransitionToFalling = false, this.needsStop = false, this.scene = a, this.physics = l, this.gridSize = c, this.cubeSize = h, this.yOffset = d, this.level = u, this.arrowStyle = o, this.group = new vn();
      const f = 0.08, m = 4;
      let _, g, p;
      const v = Math.abs(i.x) > 0;
      this.isVertical ? (_ = h, g = t * h, p = h) : v ? (_ = t * h, g = h, p = h) : (_ = h, g = h, p = t * h);
      const x = new mS(_, g, p, m, f), S = [
        16739179,
        5164484,
        16770669
      ], T = (typeof window < "u" && window.useColoredBlocksDefault !== void 0 ? window.useColoredBlocksDefault : false) ? S[t - 1] : 16777215, E = S[t - 1], M = new Be({
        color: T,
        roughness: 0.1,
        metalness: 0
      }), y = new ae(x, M);
      y.castShadow = true, y.receiveShadow = true, y.position.set(0, g / 2, 0), this.cubes = [
        y
      ], this.group.add(y), this.originalMaterial = M, this.isHighlighted = false, this.createArrow(o, E), this.createDirectionIndicators(E, o), this.updateWorldPosition(), this.physicsBody = null, this.physicsCollider = null, a.add(this.group);
    }
    createPhysicsBody() {
      let t, e, n;
      this.isVertical ? (t = this.cubeSize, e = this.length * this.cubeSize, n = this.cubeSize) : Math.abs(this.direction.x) > 0 ? (t = this.length * this.cubeSize, e = this.cubeSize, n = this.cubeSize) : (t = this.cubeSize, e = this.cubeSize, n = this.length * this.cubeSize);
      const i = new R();
      this.group.getWorldPosition(i);
      const s = um(this.physics, {
        x: i.x,
        y: i.y + e / 2,
        z: i.z
      }, {
        x: t,
        y: e,
        z: n
      }, true, true);
      this.physicsBody = s.body, this.physicsCollider = s.collider;
    }
    createArrow(t = 1, e = 16777215) {
      const n = new vn(), i = (d) => {
        let u, f, m, _;
        if (d === 1) {
          u = new Ae();
          const g = 0.25, p = 0.35, v = 0.06;
          u.moveTo(0, p), u.lineTo(g, p - g), u.lineTo(g - v, p - g), u.lineTo(0, p - v), u.lineTo(-g + v, p - g), u.lineTo(-g, p - g), u.lineTo(0, p), u.moveTo(v / 2, p - g), u.lineTo(v / 2, -p * 0.3), u.lineTo(-v / 2, -p * 0.3), u.lineTo(-v / 2, p - g), f = {
            depth: 0.06,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 2
          }, m = new Qe(u, f), _ = new Be({
            color: e,
            emissive: e,
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0.6,
            side: Xe
          });
        } else if (d === 2) u = new Ae(), u.moveTo(0, 0.35), u.lineTo(-0.2, 0), u.lineTo(-0.06, 0), u.lineTo(-0.06, -0.25), u.lineTo(0.06, -0.25), u.lineTo(0.06, 0), u.lineTo(0.2, 0), u.lineTo(0, 0.35), f = {
          depth: 0.05,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 3
        }, m = new Qe(u, f), _ = new Be({
          color: e,
          roughness: 0.4,
          metalness: 0.3
        });
        else if (d === 3) {
          u = new Ae();
          const g = 0.05;
          u.moveTo(-g / 2, -0.2), u.lineTo(g / 2, -0.2), u.lineTo(g / 2, 0.1), u.lineTo(-g / 2, 0.1), u.moveTo(0, 0.35), u.lineTo(-0.15, 0.05), u.lineTo(-0.08, 0.05), u.lineTo(0, 0.2), u.lineTo(0.08, 0.05), u.lineTo(0.15, 0.05), u.lineTo(0, 0.35), m = new jr(u), _ = new Be({
            color: e,
            side: Xe
          });
        } else if (d === 4) {
          u = new Ae();
          const g = 0.3, p = 0.22, v = 0.06;
          u.moveTo(0, g), u.lineTo(-g, -0.05), u.lineTo(-v, -0.05), u.lineTo(-v, -0.25), u.lineTo(v, -0.25), u.lineTo(v, -0.05), u.lineTo(g, -0.05), u.lineTo(0, g);
          const x = new Ji();
          x.moveTo(0, p), x.lineTo(-p + 0.05, 0.02), x.lineTo(0, 0.12), x.lineTo(p - 0.05, 0.02), x.lineTo(0, p), u.holes.push(x), f = {
            depth: 0.06,
            bevelEnabled: false
          }, m = new Qe(u, f), _ = new Be({
            color: e
          });
        } else d === 5 ? (u = new Ae(), u.moveTo(0, 0.35), u.lineTo(-0.18, 0.05), u.quadraticCurveTo(-0.18, 0, -0.12, 0), u.lineTo(-0.07, 0), u.lineTo(-0.07, -0.2), u.quadraticCurveTo(-0.07, -0.25, 0, -0.25), u.quadraticCurveTo(0.07, -0.25, 0.07, -0.2), u.lineTo(0.07, 0), u.lineTo(0.12, 0), u.quadraticCurveTo(0.18, 0, 0.18, 0.05), u.lineTo(0, 0.35), f = {
          depth: 0.08,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelSegments: 5
        }, m = new Qe(u, f), _ = new Be({
          color: e
        })) : d === 6 ? (u = new Ae(), u.moveTo(0, 0.38), u.lineTo(-0.2, 0.05), u.quadraticCurveTo(-0.2, -0.02, -0.1, -0.02), u.lineTo(-0.09, -0.02), u.lineTo(-0.09, -0.22), u.quadraticCurveTo(-0.09, -0.28, 0, -0.28), u.quadraticCurveTo(0.09, -0.28, 0.09, -0.22), u.lineTo(0.09, -0.02), u.lineTo(0.1, -0.02), u.quadraticCurveTo(0.2, -0.02, 0.2, 0.05), u.lineTo(0, 0.38), f = {
          depth: 0.09,
          bevelEnabled: true,
          bevelThickness: 0.035,
          bevelSize: 0.035,
          bevelSegments: 4
        }, m = new Qe(u, f), _ = new Be({
          color: e
        })) : d === 7 ? (u = new Ae(), u.moveTo(0, 0.36), u.lineTo(-0.22, -0.02), u.lineTo(-0.11, -0.02), u.lineTo(-0.11, -0.06), u.lineTo(-0.08, -0.06), u.lineTo(-0.08, -0.24), u.quadraticCurveTo(-0.08, -0.27, 0, -0.27), u.quadraticCurveTo(0.08, -0.27, 0.08, -0.24), u.lineTo(0.08, -0.06), u.lineTo(0.11, -0.06), u.lineTo(0.11, -0.02), u.lineTo(0.22, -0.02), u.lineTo(0, 0.36), f = {
          depth: 0.08,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelSegments: 3
        }, m = new Qe(u, f), _ = new Be({
          color: e
        })) : d === 8 && (u = new Ae(), u.moveTo(0, 0.4), u.lineTo(-0.24, 0.02), u.lineTo(-0.1, 0.02), u.lineTo(-0.1, -0.24), u.lineTo(0.1, -0.24), u.lineTo(0.1, 0.02), u.lineTo(0.24, 0.02), u.lineTo(0, 0.4), f = {
          depth: 0.08,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.03,
          bevelSegments: 2
        }, m = new Qe(u, f), _ = new Be({
          color: e
        }));
        return {
          geometry: m,
          material: _
        };
      }, s = Math.abs(this.direction.x) > 0, o = (this.length - 1) * this.cubeSize / 2;
      let a = 0;
      t === 1 ? a = 0.1225 : t === 2 ? a = 0.05 : t === 3 ? a = 0.075 : t === 4 ? a = 0.025 : t === 5 || t === 6 ? a = 0.05 : t === 7 ? a = 0.045 : t === 8 && (a = 0.08);
      const l = new vn(), c = i(t), h = new ae(c.geometry, c.material);
      h.material.emissive && (h.material._originalEmissiveIntensity = h.material.emissiveIntensity !== void 0 ? h.material.emissiveIntensity : 0), h.castShadow = true, h.receiveShadow = true, t === 1 ? h.position.z = -0.015 : t === 2 ? h.position.z = -0.0125 : t === 4 ? h.position.z = -0.015 : t === 5 ? h.position.z = -0.025 : t === 6 ? h.position.z = -0.03 : t === 7 ? h.position.z = -0.025 : t === 8 && (h.position.z = -0.0275), h.position.y = -a, l.add(h), this.isVertical ? l.position.set(0, this.length * this.cubeSize + 0.02, 0) : s ? l.position.set(o, this.cubeSize + 0.02, 0) : l.position.set(0, this.cubeSize + 0.02, o), l.rotation.x = -Math.PI / 2, l.rotation.z = Math.atan2(this.direction.x, this.direction.z) + Math.PI, n.add(l), this.group.add(n), this.arrow = n;
    }
    createDirectionIndicators(t, e = 2) {
      const n = new vn();
      let i, s, o;
      const a = Math.abs(this.direction.x) > 0;
      this.isVertical ? (i = this.cubeSize, s = this.length * this.cubeSize, o = this.cubeSize) : a ? (i = this.length * this.cubeSize, s = this.cubeSize, o = this.cubeSize) : (i = this.cubeSize, s = this.cubeSize, o = this.length * this.cubeSize);
      const l = 0.03, c = t, h = 0.2, d = new Ae();
      d.arc(0, 0, h, 0, Math.PI * 2, false);
      let u;
      e === 1 ? u = {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2
      } : e === 2 ? u = {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      } : e === 3 ? u = {
        depth: 0.05,
        bevelEnabled: false
      } : e === 4 ? u = {
        depth: 0.06,
        bevelEnabled: false
      } : e === 5 ? u = {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 5
      } : e === 6 ? u = {
        depth: 0.09,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.035,
        bevelSegments: 4
      } : e === 7 ? u = {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 3
      } : e === 8 ? u = {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 2
      } : u = {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3
      };
      const f = new Qe(d, u), m = new Be({
        color: c,
        side: Xe
      }), _ = new ae(f, m);
      _.castShadow = true, _.receiveShadow = true;
      const g = 0.01, p = 0.25, v = new Ae();
      v.arc(0, 0, p, 0, Math.PI * 2, false);
      const x = new Ji();
      x.arc(0, 0, p - 0.06, 0, Math.PI * 2, true), v.holes.push(x);
      const P = u, b = new Qe(v, P), T = new Be({
        color: c,
        side: Xe
      }), E = new ae(b, T);
      E.castShadow = true, E.receiveShadow = true, E.position.z = g, this.isVertical ? (this.direction.x > 0 ? (_.position.set(i / 2 + l, s / 2, 0), _.rotation.set(0, -Math.PI / 2, 0)) : this.direction.x < 0 ? (_.position.set(-i / 2 - l, s / 2, 0), _.rotation.set(0, Math.PI / 2, 0)) : this.direction.z > 0 ? (_.position.set(0, s / 2, o / 2 + l), _.rotation.set(0, Math.PI, 0)) : this.direction.z < 0 && (_.position.set(0, s / 2, -o / 2 - l), _.rotation.set(0, 0, 0)), this.direction.x > 0 ? (E.position.set(-i / 2 - l, s / 2, 0), E.rotation.set(0, Math.PI / 2, 0)) : this.direction.x < 0 ? (E.position.set(i / 2 + l, s / 2, 0), E.rotation.set(0, -Math.PI / 2, 0)) : this.direction.z > 0 ? (E.position.set(0, s / 2, -o / 2 - l), E.rotation.set(0, 0, 0)) : this.direction.z < 0 && (E.position.set(0, s / 2, o / 2 + l), E.rotation.set(0, Math.PI, 0))) : a ? this.direction.x > 0 ? (_.position.set(i / 2 + l, s / 2, 0), _.rotation.set(0, -Math.PI / 2, 0), E.position.set(-i / 2 - l, s / 2, 0), E.rotation.set(0, Math.PI / 2, 0)) : (_.position.set(-i / 2 - l, s / 2, 0), _.rotation.set(0, Math.PI / 2, 0), E.position.set(i / 2 + l, s / 2, 0), E.rotation.set(0, -Math.PI / 2, 0)) : this.direction.z > 0 ? (_.position.set(0, s / 2, o / 2 + l), _.rotation.set(0, Math.PI, 0), E.position.set(0, s / 2, -o / 2 - l), E.rotation.set(0, 0, 0)) : (_.position.set(0, s / 2, -o / 2 - l), _.rotation.set(0, 0, 0), E.position.set(0, s / 2, o / 2 + l), E.rotation.set(0, Math.PI, 0)), n.add(_), n.add(E), this.group.add(n), this.directionIndicators = n, typeof window < "u" && window.location.hostname !== "localhost" && console.log("Direction indicators created:", {
        dotMesh: !!_,
        circleMesh: !!E,
        indicatorsGroup: n.children.length
      });
    }
    updateBlockColor(t, e = null) {
      this.originalMaterial && (this.originalMaterial.color.setHex(t), this.originalMaterial.roughness = 0.1, this.originalMaterial.metalness = 0);
      const n = [
        16739179,
        5164484,
        16770669
      ], i = n[this.length - 1] || n[0];
      if (this.arrow && this.arrow.children.length > 0) {
        const o = this.arrow.children[0];
        if (o && o.children && o.children.length > 0) {
          const a = o.children[0];
          a && a.material && a.material.color.setHex(i);
        }
      }
      const s = i;
      if (this.directionIndicators && this.directionIndicators.children.length >= 2) {
        const o = this.directionIndicators.children[0], a = this.directionIndicators.children[1];
        o && o.material && o.material.color.setHex(s), a && a.material && a.material.color.setHex(s);
      }
    }
    rotateDirectionClockwise() {
      const t = -this.direction.z, e = this.direction.x;
      this.direction = {
        x: t,
        z: e
      }, this.updateArrowRotation();
    }
    animateRotationClockwise(t = 400, e = null) {
      if (!this.arrow || !this.arrow.children.length > 0) {
        this.rotateDirectionClockwise(), e && e();
        return;
      }
      const n = this.arrow.children[0];
      if (!n) {
        this.rotateDirectionClockwise(), e && e();
        return;
      }
      const i = Math.atan2(this.direction.x, this.direction.z) + Math.PI, s = -this.direction.z, o = this.direction.x, a = Math.atan2(s, o) + Math.PI;
      this.direction = {
        x: s,
        z: o
      };
      const l = performance.now(), c = () => {
        const h = performance.now() - l, d = Math.min(h / t, 1), u = d < 0.5 ? 2 * d * d : 1 - Math.pow(-2 * d + 2, 2) / 2, f = i + (a - i) * u;
        n.rotation.z = f, d < 1 ? requestAnimationFrame(c) : (n.rotation.z = a, e && e());
      };
      c();
    }
    updateArrowRotation() {
      if (this.arrow && this.arrow.children.length > 0) {
        const t = this.arrow.children[0];
        t && (t.rotation.z = Math.atan2(this.direction.x, this.direction.z) + Math.PI);
      }
      if (this.directionIndicators) {
        this.group.remove(this.directionIndicators);
        const t = [
          16739179,
          5164484,
          16770669
        ], e = t[this.length - 1] || t[0];
        this.createDirectionIndicators(e, this.arrowStyle);
      }
    }
    animateRandomSpin(t = 1800, e = null) {
      const n = !this.isVertical && this.length > 1;
      if (!this.isVertical && this.length !== 1 && !n) {
        e && e();
        return;
      }
      if (!this.arrow || !this.arrow.children.length > 0) {
        let p;
        if (n) p = {
          x: -this.direction.x,
          z: -this.direction.z
        };
        else {
          const v = [
            {
              x: 1,
              z: 0
            },
            {
              x: -1,
              z: 0
            },
            {
              x: 0,
              z: 1
            },
            {
              x: 0,
              z: -1
            }
          ];
          p = v[Math.floor(Math.random() * v.length)];
        }
        this.direction = p, this.updateArrowRotation(), e && e();
        return;
      }
      const i = this.arrow.children[0];
      if (!i) {
        let p;
        if (n) p = {
          x: -this.direction.x,
          z: -this.direction.z
        };
        else {
          const v = [
            {
              x: 1,
              z: 0
            },
            {
              x: -1,
              z: 0
            },
            {
              x: 0,
              z: 1
            },
            {
              x: 0,
              z: -1
            }
          ];
          p = v[Math.floor(Math.random() * v.length)];
        }
        this.direction = p, this.updateArrowRotation(), e && e();
        return;
      }
      let s;
      if (n) s = {
        x: -this.direction.x,
        z: -this.direction.z
      };
      else {
        const p = [
          {
            x: 1,
            z: 0
          },
          {
            x: -1,
            z: 0
          },
          {
            x: 0,
            z: 1
          },
          {
            x: 0,
            z: -1
          }
        ];
        s = p[Math.floor(Math.random() * p.length)];
      }
      const o = Math.atan2(this.direction.x, this.direction.z) + Math.PI, a = Math.atan2(s.x, s.z) + Math.PI, c = (2 + Math.random() * 2) * Math.PI * 2;
      let h = a - o;
      for (; h > Math.PI; ) h -= Math.PI * 2;
      for (; h < -Math.PI; ) h += Math.PI * 2;
      n && (h = Math.PI);
      const d = h >= 0 ? 1 : -1, u = o + d * c + h;
      this.direction = {
        x: s.x,
        z: s.z
      };
      const f = performance.now(), m = t * 0.8, _ = t * 0.2, g = () => {
        const p = performance.now() - f, v = Math.min(p / m, 1);
        if (v < 1) {
          const x = 1 - Math.pow(1 - v, 3), S = o + (u - o) * x;
          i.rotation.z = S, requestAnimationFrame(g);
        } else {
          const x = performance.now(), S = Math.PI / 8, P = 3, b = () => {
            const T = performance.now() - x, E = Math.min(T / _, 1);
            if (E < 1) {
              const M = Math.exp(-3 * E), y = Math.sin(E * Math.PI * P * 2) * S * M;
              i.rotation.z = a + y, requestAnimationFrame(b);
            } else i.rotation.z = a, this.updateArrowRotation(), e && e();
          };
          b();
        }
      };
      g();
    }
    canRotateSafelyAtWithDirection(t, e, n, i, s, o, a = null) {
      const l = t + i.x, c = e + i.z;
      if (this.isVertical) {
        if (l < 0 || l >= o || c < 0 || c >= o) return true;
        for (const h of s) {
          if (h === this || h === a || h.isFalling || h.isRemoved || h.removalStartTime) continue;
          const d = this.isVertical ? this.length * this.cubeSize : this.cubeSize, u = this.yOffset, f = this.yOffset + d, m = h.isVertical ? h.length * h.cubeSize : h.cubeSize, _ = h.yOffset, g = h.yOffset + m;
          if (f > _ && u < g) if (h.isVertical) {
            if (l === h.gridX && c === h.gridZ) return false;
          } else {
            const v = Math.abs(h.direction.x) > 0;
            for (let x = 0; x < h.length; x++) {
              const S = h.gridX + (v ? x : 0), P = h.gridZ + (v ? 0 : x);
              if (l === S && c === P) return false;
            }
          }
        }
        return true;
      } else {
        const h = Math.abs(i.x) > 0;
        for (let d = 0; d < this.length; d++) {
          const u = l + (h ? d : 0), f = c + (h ? 0 : d);
          if (u < 0 || u >= o || f < 0 || f >= o) return true;
          for (const m of s) {
            if (m === this || m === a || m.isFalling || m.isRemoved || m.removalStartTime) continue;
            const _ = this.isVertical ? this.length * this.cubeSize : this.cubeSize, g = this.yOffset, p = this.yOffset + _, v = m.isVertical ? m.length * m.cubeSize : m.cubeSize, x = m.yOffset, S = m.yOffset + v;
            if (p > x && g < S) if (m.isVertical) {
              if (u === m.gridX && f === m.gridZ) return false;
            } else {
              const b = Math.abs(m.direction.x) > 0;
              for (let T = 0; T < m.length; T++) {
                const E = m.gridX + (b ? T : 0), M = m.gridZ + (b ? 0 : T);
                if (u === E && f === M) return false;
              }
            }
          }
        }
        return true;
      }
    }
    canRotateSafelyAt(t, e, n, i, s = null) {
      const o = {
        x: -this.direction.z,
        z: this.direction.x
      };
      if (this.isVertical) {
        const a = t + o.x, l = e + o.z;
        if (a < 0 || a >= i || l < 0 || l >= i) return true;
        for (const c of n) {
          if (c === this || c === s || c.isFalling || c.isRemoved || c.removalStartTime) continue;
          const h = this.isVertical ? this.length * this.cubeSize : this.cubeSize, d = this.yOffset, u = this.yOffset + h, f = c.isVertical ? c.length * c.cubeSize : c.cubeSize, m = c.yOffset, _ = c.yOffset + f;
          if (u > m && d < _) if (c.isVertical) {
            if (a === c.gridX && l === c.gridZ) return false;
          } else {
            const p = Math.abs(c.direction.x) > 0;
            for (let v = 0; v < c.length; v++) {
              const x = c.gridX + (p ? v : 0), S = c.gridZ + (p ? 0 : v);
              if (a === x && l === S) return false;
            }
          }
        }
        return true;
      } else {
        const a = t + o.x, l = e + o.z, c = Math.abs(o.x) > 0;
        for (let h = 0; h < this.length; h++) {
          const d = a + (c ? h : 0), u = l + (c ? 0 : h);
          if (d < 0 || d >= i || u < 0 || u >= i) return true;
          for (const f of n) {
            if (f === this || f === s || f.isFalling || f.isRemoved || f.removalStartTime) continue;
            const m = this.isVertical ? this.length * this.cubeSize : this.cubeSize, _ = this.yOffset, g = this.yOffset + m, p = f.isVertical ? f.length * f.cubeSize : f.cubeSize, v = f.yOffset, x = f.yOffset + p;
            if (g > v && _ < x) if (f.isVertical) {
              if (d === f.gridX && u === f.gridZ) return false;
            } else {
              const P = Math.abs(f.direction.x) > 0;
              for (let b = 0; b < f.length; b++) {
                const T = f.gridX + (P ? b : 0), E = f.gridZ + (P ? 0 : b);
                if (d === T && u === E) return false;
              }
            }
          }
        }
        return true;
      }
    }
    updateWorldPosition() {
      let t, e;
      if (this.isVertical) t = this.gridX * this.cubeSize + this.cubeSize / 2, e = this.gridZ * this.cubeSize + this.cubeSize / 2;
      else if (Math.abs(this.direction.x) > 0) {
        const s = this.gridX * this.cubeSize + this.cubeSize / 2, o = (this.gridX + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        t = (s + o) / 2, e = this.gridZ * this.cubeSize + this.cubeSize / 2;
      } else {
        t = this.gridX * this.cubeSize + this.cubeSize / 2;
        const s = this.gridZ * this.cubeSize + this.cubeSize / 2, o = (this.gridZ + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        e = (s + o) / 2;
      }
      const n = this.gridSize * this.cubeSize / 2;
      this.group.position.set(t - n, this.yOffset, e - n);
    }
    updateFromPhysics() {
      if (this.isFalling && !this.isRemoved) {
        if (this.needsPhysicsBody && !this.physicsBody) {
          dm(() => {
            if (this.createPhysicsBody(), this.needsPhysicsBody = false, this.physicsBody && this.pendingAngularVel) {
              const t = this.physics.RAPIER;
              this.physicsBody.setAngvel(new t.Vector3(this.pendingAngularVel.x, this.pendingAngularVel.y, this.pendingAngularVel.z), true), this.physicsBody.setEnabledRotations(true, true, true, true), this.pendingLinearVel && this.physicsBody.setLinvel(new t.Vector3(this.pendingLinearVel.x, this.pendingLinearVel.y, this.pendingLinearVel.z), true), this.pendingAngularVel = null, this.pendingLinearVel = null;
            }
          });
          return;
        }
        if (this.physicsBody && !dr()) try {
          if (!this.physicsBody || dr()) return;
          let t, e, n, i, s, o, a, l = false;
          try {
            if (dr()) return;
            const _ = this.physicsBody.translation();
            if (!_) return;
            t = _.x, e = _.y, n = _.z, l = true;
          } catch {
            return;
          }
          try {
            if (dr()) return;
            const _ = this.physicsBody.rotation();
            if (!_) return;
            i = _.x, s = _.y, o = _.z, a = _.w;
          } catch {
            i = 0, s = 0, o = 0, a = 1;
          }
          if (!l) return;
          const c = this.isVertical ? this.length * this.cubeSize : this.cubeSize, h = this.gridSize * this.cubeSize / 2;
          this.group.position.set(t - h, e - c / 2, n - h), this.group.quaternion.set(i, s, o, a);
          const d = this.gridSize * this.cubeSize / 2, u = this.gridSize * this.cubeSize * 1.5, f = Math.sqrt(Math.pow(t - d, 2) + Math.pow(n - d, 2));
          (e < -2 || f > u || Date.now() - this.fallingStartTime > 5e3) && !this.isRemoved && (console.log(`Removing block: y=${e.toFixed(2)}, distance=${f.toFixed(2)}, maxDist=${u.toFixed(2)}, time=${Date.now() - this.fallingStartTime}ms`), this.remove()), this.needsTransitionToFalling && this.physicsBody && (this.needsTransitionToFalling = false, fm(() => {
            if (this.physicsBody) {
              this.physicsBody.setEnabledRotations(true, true, true, true);
              const _ = Math.abs(this.direction.x) > 0, g = _ ? this.direction.x : this.direction.z;
              let p = 0, v = 0, x = 0;
              this.isVertical ? (_ ? (x = g * 3.5, p = (Math.random() - 0.5) * 2.5) : (p = -g * 3.5, x = (Math.random() - 0.5) * 2.5), v = (Math.random() - 0.5) * 1.5) : _ ? (x = g * 4.5, v = (Math.random() - 0.5) * 2, p = (Math.random() - 0.5) * 1.5) : (p = -g * 4.5, v = (Math.random() - 0.5) * 2, x = (Math.random() - 0.5) * 1.5), this.physicsBody.setAngvel(new this.physics.RAPIER.Vector3(p, v, x), true);
            }
          }));
        } catch (t) {
          console.warn("Failed to update physics:", t);
        }
      }
    }
    canMove(t) {
      const e = this.gridX + this.direction.x, n = this.gridZ + this.direction.z;
      if (window.debugMoveMode && (window.debugMoveInfo = {
        block: {
          gridX: this.gridX,
          gridZ: this.gridZ,
          yOffset: this.yOffset,
          isVertical: this.isVertical,
          length: this.length,
          direction: {
            ...this.direction
          }
        },
        targetPos: {
          x: e,
          z: n
        },
        blockers: [],
        yRangeChecks: []
      }), this.isVertical) {
        if (e < 0 || e >= this.gridSize || n < 0 || n >= this.gridSize) return window.debugMoveMode && (window.debugMoveInfo.result = "fall", window.debugMoveInfo.reason = `Out of bounds: (${e}, ${n})`), "fall";
        const s = this.isVertical ? this.length * this.cubeSize : this.cubeSize, o = this.yOffset, a = this.yOffset + s;
        for (const l of t) {
          if (l === this || l.isFalling || l.isRemoved || l.removalStartTime) continue;
          const c = l.isVertical ? l.length * l.cubeSize : l.cubeSize, h = l.yOffset, d = l.yOffset + c;
          let u;
          if (l.isVertical ? u = a - h > 1e-3 && d - o > 1e-3 : u = h - o > 1e-3 && a - h > 1e-3, window.debugMoveMode) {
            const f = e === l.gridX && n === l.gridZ;
            (f || u) && window.debugMoveInfo.yRangeChecks.push({
              other: {
                gridX: l.gridX,
                gridZ: l.gridZ,
                yOffset: l.yOffset,
                isVertical: l.isVertical,
                length: l.length
              },
              thisYRange: {
                bottom: o,
                top: a,
                height: s
              },
              otherYRange: {
                bottom: h,
                top: d,
                height: c
              },
              overlaps: u,
              atTargetPosition: f
            });
          }
          if (u) if (l.isVertical) {
            if (e === l.gridX && n === l.gridZ) {
              const f = this.length === 1 || this.isVertical, m = !this.isVertical && this.length > 1;
              if ((f || m) && this.direction.x === -l.direction.x && this.direction.z === -l.direction.z) {
                window.debugMoveMode && window.debugMoveInfo.blockers.push({
                  block: {
                    gridX: l.gridX,
                    gridZ: l.gridZ,
                    yOffset: l.yOffset
                  },
                  reason: "Head-on collision (allowed)",
                  isHeadOn: true
                });
                continue;
              }
              return window.debugMoveMode && (window.debugMoveInfo.result = "blocked", window.debugMoveInfo.blockers.push({
                block: {
                  gridX: l.gridX,
                  gridZ: l.gridZ,
                  yOffset: l.yOffset,
                  isVertical: l.isVertical,
                  length: l.length,
                  direction: {
                    ...l.direction
                  }
                },
                reason: "Vertical block at same position",
                isHeadOn: false
              })), "blocked";
            }
          } else {
            const f = Math.abs(l.direction.x) > 0;
            for (let m = 0; m < l.length; m++) {
              let _ = l.gridX, g = l.gridZ;
              if (f ? _ += m : g += m, e === _ && n === g) {
                if ((this.length === 1 || this.isVertical) && this.direction.x === -l.direction.x && this.direction.z === -l.direction.z) {
                  window.debugMoveMode && window.debugMoveInfo.blockers.push({
                    block: {
                      gridX: l.gridX,
                      gridZ: l.gridZ,
                      yOffset: l.yOffset,
                      length: l.length,
                      direction: {
                        ...l.direction
                      }
                    },
                    reason: "Head-on collision (allowed)",
                    isHeadOn: true
                  });
                  continue;
                }
                return window.debugMoveMode && (window.debugMoveInfo.result = "blocked", window.debugMoveInfo.blockers.push({
                  block: {
                    gridX: l.gridX,
                    gridZ: l.gridZ,
                    yOffset: l.yOffset,
                    isVertical: l.isVertical,
                    length: l.length,
                    direction: {
                      ...l.direction
                    }
                  },
                  cell: {
                    x: _,
                    z: g
                  },
                  reason: "Horizontal block occupies target cell",
                  isHeadOn: false
                })), "blocked";
              }
            }
          }
        }
        return window.debugMoveMode && (window.debugMoveInfo.result = "ok"), "ok";
      }
      const i = Math.abs(this.direction.x) > 0;
      for (let s = 0; s < this.length; s++) {
        let o = e, a = n;
        if (i ? o += s : a += s, o < 0 || o >= this.gridSize || a < 0 || a >= this.gridSize) return window.debugMoveMode && (window.debugMoveInfo.result = "fall", window.debugMoveInfo.reason = `Out of bounds: cell ${s} at (${o}, ${a})`), "fall";
        const l = this.isVertical ? this.length * this.cubeSize : this.cubeSize, c = this.yOffset, h = this.yOffset + l;
        for (const d of t) {
          if (d === this || d.isFalling || d.isRemoved || d.removalStartTime) continue;
          const u = d.isVertical ? d.length * d.cubeSize : d.cubeSize, f = d.yOffset, m = d.yOffset + u;
          let _;
          if (this.isVertical ? _ = h - f > 1e-3 && m - c > 1e-3 : d.isVertical ? _ = c - f > 1e-3 && m - c > 1e-3 : _ = Math.abs(this.yOffset - d.yOffset) < 1e-3, window.debugMoveMode && s === 0 && window.debugMoveInfo.yRangeChecks.push({
            other: {
              gridX: d.gridX,
              gridZ: d.gridZ,
              yOffset: d.yOffset,
              isVertical: d.isVertical,
              length: d.length
            },
            thisYRange: {
              bottom: c,
              top: h,
              height: l
            },
            otherYRange: {
              bottom: f,
              top: m,
              height: u
            },
            overlaps: _,
            cellIndex: s,
            checkCell: {
              x: o,
              z: a
            }
          }), !!_) if (d.isVertical) {
            if (o === d.gridX && a === d.gridZ) {
              const g = this.length === 1 || this.isVertical, p = !this.isVertical && this.length > 1;
              if ((g || p) && this.direction.x === -d.direction.x && this.direction.z === -d.direction.z) {
                window.debugMoveMode && window.debugMoveInfo.blockers.push({
                  block: {
                    gridX: d.gridX,
                    gridZ: d.gridZ,
                    yOffset: d.yOffset
                  },
                  cell: {
                    x: o,
                    z: a,
                    index: s
                  },
                  reason: "Head-on collision (allowed)",
                  isHeadOn: true
                });
                continue;
              }
              return window.debugMoveMode && (window.debugMoveInfo.result = "blocked", window.debugMoveInfo.blockers.push({
                block: {
                  gridX: d.gridX,
                  gridZ: d.gridZ,
                  yOffset: d.yOffset,
                  isVertical: d.isVertical,
                  length: d.length,
                  direction: {
                    ...d.direction
                  }
                },
                cell: {
                  x: o,
                  z: a,
                  index: s
                },
                reason: "Vertical block at cell position",
                isHeadOn: false
              })), "blocked";
            }
          } else {
            const g = Math.abs(d.direction.x) > 0;
            for (let p = 0; p < d.length; p++) {
              let v = d.gridX, x = d.gridZ;
              if (g ? v += p : x += p, o === v && a === x) {
                const S = this.length === 1 || this.isVertical, P = !this.isVertical && this.length > 1;
                if ((S || P) && this.direction.x === -d.direction.x && this.direction.z === -d.direction.z) {
                  window.debugMoveMode && window.debugMoveInfo.blockers.push({
                    block: {
                      gridX: d.gridX,
                      gridZ: d.gridZ,
                      yOffset: d.yOffset,
                      length: d.length,
                      direction: {
                        ...d.direction
                      }
                    },
                    cell: {
                      x: o,
                      z: a,
                      index: s
                    },
                    reason: "Head-on collision (allowed)",
                    isHeadOn: true
                  });
                  continue;
                }
                return window.debugMoveMode && (window.debugMoveInfo.result = "blocked", window.debugMoveInfo.blockers.push({
                  block: {
                    gridX: d.gridX,
                    gridZ: d.gridZ,
                    yOffset: d.yOffset,
                    isVertical: d.isVertical,
                    length: d.length,
                    direction: {
                      ...d.direction
                    }
                  },
                  cell: {
                    x: o,
                    z: a,
                    index: s
                  },
                  reason: "Horizontal block occupies cell",
                  isHeadOn: false
                })), "blocked";
              }
            }
          }
        }
      }
      return window.debugMoveMode && (window.debugMoveInfo.result = "ok"), "ok";
    }
    move(t, e) {
      if (this.isAnimating || this.isFalling) return;
      let n = 0, i = this.gridX, s = this.gridZ, o = false, a = false, l = null, c = null, h = 0;
      const d = 10;
      for (; ; ) {
        const D = i + this.direction.x, O = s + this.direction.z;
        let H = false;
        for (const F of t) {
          if (F === this || F.isFalling || F.isRemoved || F.removalStartTime) continue;
          const Y = this.isVertical ? this.length * this.cubeSize : this.cubeSize, nt = this.yOffset, dt = this.yOffset + Y, Et = F.isVertical ? F.length * F.cubeSize : F.cubeSize, q = F.yOffset, at = F.yOffset + Et;
          if (dt > q && nt < at) {
            if (this.isVertical) if (F.isVertical) D === F.gridX && O === F.gridZ && (H = true, l = F);
            else {
              const J = Math.abs(F.direction.x) > 0;
              for (let wt = 0; wt < F.length; wt++) {
                const Pt = F.gridX + (J ? wt : 0), B = F.gridZ + (J ? 0 : wt);
                if (D === Pt && O === B) {
                  H = true, l = F;
                  break;
                }
              }
            }
            else {
              const J = Math.abs(this.direction.x) > 0;
              for (let wt = 0; wt < this.length; wt++) {
                const Pt = D + (J ? wt : 0), B = O + (J ? 0 : wt);
                if (F.isVertical) {
                  if (Pt === F.gridX && B === F.gridZ) {
                    H = true, l = F;
                    break;
                  }
                } else {
                  const Ot = Math.abs(F.direction.x) > 0;
                  for (let Z = 0; Z < F.length; Z++) {
                    const j = F.gridX + (Ot ? Z : 0), K = F.gridZ + (Ot ? 0 : Z);
                    if (Pt === j && B === K) {
                      H = true, l = F;
                      break;
                    }
                  }
                }
                if (H) break;
              }
            }
            if (H) break;
          }
        }
        if (H) {
          const F = this.length === 1 || this.isVertical, Y = !this.isVertical && this.length > 1;
          if ((F || Y) && l && this.direction.x === -l.direction.x && this.direction.z === -l.direction.z) {
            if (h++, h > d) {
              console.warn(`Block at (${this.gridX}, ${this.gridZ}) hit maximum head-on collisions (${d}), stopping movement`), o = true;
              break;
            }
            c = {
              block: l,
              gridX: i,
              gridZ: s,
              originalDirection: {
                x: this.direction.x,
                z: this.direction.z
              },
              stepsToCollision: n,
              originalYOffset: this.yOffset
            }, this.gridX = i, this.gridZ = s, Y ? (this.direction = {
              x: -this.direction.x,
              z: -this.direction.z
            }, this.updateArrowRotation()) : this.rotateDirectionClockwise();
            const dt = Math.max(0, this.yOffset - this.cubeSize), Et = this.isVertical ? this.length * this.cubeSize : this.cubeSize, q = dt, at = dt + Et;
            let _t = false;
            for (const J of t) {
              if (J === this || J === l || J.isFalling || J.isRemoved || J.removalStartTime) continue;
              if (J.isVertical ? J.gridX === i && J.gridZ === s : (() => {
                const Pt = Math.abs(J.direction.x) > 0;
                for (let B = 0; B < J.length; B++) {
                  const Ot = J.gridX + (Pt ? B : 0), Z = J.gridZ + (Pt ? 0 : B);
                  if (Ot === i && Z === s) return true;
                }
                return false;
              })()) {
                const Pt = J.isVertical ? J.length * J.cubeSize : J.cubeSize, B = J.yOffset, Ot = J.yOffset + Pt;
                if (at > B && q < Ot) {
                  _t = true;
                  break;
                }
              }
            }
            if (!_t) this.yOffset = dt;
            else {
              let J = this.yOffset;
              for (let wt = 1; wt <= 5; wt++) {
                const Pt = Math.max(0, this.yOffset - wt * this.cubeSize), B = Pt, Ot = Pt + Et;
                let Z = false;
                for (const j of t) {
                  if (j === this || j === l || j.isFalling || j.isRemoved || j.removalStartTime) continue;
                  if (j.isVertical ? j.gridX === i && j.gridZ === s : (() => {
                    const lt = Math.abs(j.direction.x) > 0;
                    for (let it = 0; it < j.length; it++) {
                      const vt = j.gridX + (lt ? it : 0), It = j.gridZ + (lt ? 0 : it);
                      if (vt === i && It === s) return true;
                    }
                    return false;
                  })()) {
                    const lt = j.isVertical ? j.length * j.cubeSize : j.cubeSize, it = j.yOffset, vt = j.yOffset + lt;
                    if (Ot > it && B < vt) {
                      Z = true;
                      break;
                    }
                  }
                }
                if (!Z) {
                  J = Pt;
                  break;
                }
              }
              this.yOffset = J;
            }
            continue;
          } else {
            o = true;
            break;
          }
        }
        n++, i = D, s = O;
        let z = true;
        if (this.isVertical) i >= 0 && i < e && s >= 0 && s < e && (z = false);
        else {
          const F = Math.abs(this.direction.x) > 0;
          for (let Y = 0; Y < this.length; Y++) {
            const nt = i + (F ? Y : 0), dt = s + (F ? 0 : Y);
            if (nt >= 0 && nt < e && dt >= 0 && dt < e) {
              z = false;
              break;
            }
          }
        }
        if (z) {
          a = true;
          break;
        }
      }
      if (n === 0 && o) {
        this.addBounceEffect(t);
        return;
      }
      if (n === 0) return;
      this.isAnimating = true;
      let u = i, f = s;
      const m = this.group.position.x, _ = this.group.position.z, g = this.gridSize * this.cubeSize / 2;
      let p, v;
      if (this.isVertical) p = u * this.cubeSize + this.cubeSize / 2 - g, v = f * this.cubeSize + this.cubeSize / 2 - g;
      else if (Math.abs(this.direction.x) > 0) {
        const O = u * this.cubeSize + this.cubeSize / 2, H = (u + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        p = (O + H) / 2 - g, v = f * this.cubeSize + this.cubeSize / 2 - g;
      } else {
        p = u * this.cubeSize + this.cubeSize / 2 - g;
        const O = f * this.cubeSize + this.cubeSize / 2, H = (f + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        v = (O + H) / 2 - g;
      }
      if (a) {
        const D = p - m, O = v - _, H = Math.sqrt(D * D + O * O);
        if (H > 0) {
          const z = D / H, F = O / H, Y = Math.max(e * this.cubeSize * 2, this.length * this.cubeSize * 3);
          p = p + z * Y, v = v + F * Y;
        }
      }
      const x = Math.sqrt((p - m) ** 2 + (v - _) ** 2), S = a, P = 0.05;
      let b, T, E = 200;
      const M = c !== null;
      if (M) {
        const D = c.gridX, O = c.gridZ;
        if (this.isVertical) b = D * this.cubeSize + this.cubeSize / 2 - g, T = O * this.cubeSize + this.cubeSize / 2 - g;
        else {
          const H = c.originalDirection;
          if (Math.abs(H.x) > 0) {
            const F = D * this.cubeSize + this.cubeSize / 2, Y = (D + this.length - 1) * this.cubeSize + this.cubeSize / 2;
            b = (F + Y) / 2 - g, T = O * this.cubeSize + this.cubeSize / 2 - g;
          } else {
            b = D * this.cubeSize + this.cubeSize / 2 - g;
            const F = O * this.cubeSize + this.cubeSize / 2, Y = (O + this.length - 1) * this.cubeSize + this.cubeSize / 2;
            T = (F + Y) / 2 - g;
          }
        }
      }
      if (this.gridX = u, this.gridZ = f, M) if (this.isVertical) p = u * this.cubeSize + this.cubeSize / 2 - g, v = f * this.cubeSize + this.cubeSize / 2 - g;
      else if (Math.abs(this.direction.x) > 0) {
        const O = u * this.cubeSize + this.cubeSize / 2, H = (u + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        p = (O + H) / 2 - g, v = f * this.cubeSize + this.cubeSize / 2 - g;
      } else {
        p = u * this.cubeSize + this.cubeSize / 2 - g;
        const O = f * this.cubeSize + this.cubeSize / 2, H = (f + this.length - 1) * this.cubeSize + this.cubeSize / 2;
        v = (O + H) / 2 - g;
      }
      let y, C = 0, N = 0;
      if (M) {
        const D = Math.sqrt((b - m) ** 2 + (T - _) ** 2), O = Math.sqrt((p - b) ** 2 + (v - T) ** 2);
        C = D / P, N = O / P, y = C + E + N;
      } else y = x / P;
      const I = performance.now(), U = () => {
        const D = performance.now() - I;
        let O = Math.min(D / y, 1);
        if (M) {
          const H = D, z = C;
          if (H < z) {
            const F = H / z;
            this.group.position.x = m + (b - m) * F, this.group.position.z = _ + (T - _) * F;
            const Y = c.originalYOffset;
            this.group.position.y = Y, this.group.scale.set(1, 1, 1);
          } else {
            const F = H - z;
            if (F < E) {
              this.group.position.x = b, this.group.position.z = T;
              const Y = c.originalYOffset;
              this.group.position.y = Y;
              const nt = F / E, dt = nt < 0.5 ? 2 * nt * nt : 1 - Math.pow(-2 * nt + 2, 2) / 2, Et = c.originalDirection, q = Math.atan2(Et.x, Et.z) + Math.PI, at = !this.isVertical && this.length > 1;
              let _t;
              at ? _t = q + Math.PI : _t = Math.atan2(this.direction.x, this.direction.z) + Math.PI;
              const J = q + (_t - q) * dt;
              if (this.arrow && this.arrow.children.length > 0) {
                const Pt = this.arrow.children[0];
                Pt && (Pt.rotation.z = J);
              }
              const wt = Math.sin(nt * Math.PI) * 0.08;
              this.group.scale.set(1 + wt, 1 + wt, 1 + wt);
            } else {
              const Y = F - E, nt = N > 0 ? Math.min(Y / N, 1) : 1;
              this.group.position.x = b + (p - b) * nt, this.group.position.z = T + (v - T) * nt;
              const dt = c.originalYOffset, Et = this.yOffset, q = dt + (Et - dt) * nt;
              this.group.position.y = q, this.group.scale.set(1, 1, 1);
            }
          }
        } else S ? (this.group.position.x = m + (p - m) * O, this.group.position.z = _ + (v - _) * O, this.group.scale.set(1, 1, 1)) : (this.group.position.x = m + (p - m) * O, this.group.position.z = _ + (v - _) * O, this.group.scale.set(1, 1, 1));
        if (O < 1) requestAnimationFrame(U);
        else if (o) this.updateWorldPosition(), this.addBounceEffect(t);
        else if (a) {
          this.isAnimating = false;
          let H, z, F;
          const Y = this.direction.x, nt = this.direction.z;
          S ? (H = Y * 8, z = nt * 8, F = Math.sin(0.3) * 8 * 0.6, this.fall(H, z, F)) : (H = Y * 3.5, z = nt * 3.5, this.fall(H, z));
        } else this.group.scale.set(1, 1, 1), this.updateWorldPosition(), this.isAnimating = false;
      };
      U();
    }
    addBounceEffect(t = []) {
      const a = /* @__PURE__ */ new Set();
      if (this.isVertical) a.add(`${this.gridX},${this.gridZ}`);
      else {
        const g = Math.abs(this.direction.x) > 0;
        for (let p = 0; p < this.length; p++) {
          const v = this.gridX + (g ? p : 0), x = this.gridZ + (g ? 0 : p);
          a.add(`${v},${x}`);
        }
      }
      const l = /* @__PURE__ */ new Set();
      for (const g of a) {
        const [p, v] = g.split(",").map(Number);
        for (let x = -1; x <= 1; x++) for (let S = -1; S <= 1; S++) {
          if (x === 0 && S === 0) continue;
          const P = p + x, b = v + S, T = `${P},${b}`;
          if (!a.has(T)) for (const E of t) {
            if (E === this || E.isFalling || E.isAnimating || l.has(E)) continue;
            let M = false;
            if (E.isVertical) E.gridX === P && E.gridZ === b && (M = true);
            else {
              const y = Math.abs(E.direction.x) > 0;
              for (let C = 0; C < E.length; C++) {
                const N = E.gridX + (y ? C : 0), I = E.gridZ + (y ? 0 : C);
                if (N === P && I === b) {
                  M = true;
                  break;
                }
              }
            }
            M && l.add(E);
          }
        }
      }
      const c = this.group.position.x, h = this.group.position.z, d = c - this.direction.x * 0.08, u = h - this.direction.z * 0.08, f = /* @__PURE__ */ new Map();
      for (const g of l) f.set(g, {
        x: g.group.position.x,
        z: g.group.position.z
      });
      const m = performance.now(), _ = () => {
        const g = performance.now() - m, p = Math.min(g / 200, 1);
        if (p < 0.5) {
          const v = p * 2, x = 1 - Math.pow(1 - v, 2);
          this.group.position.x = c + (d - c) * x, this.group.position.z = h + (u - h) * x;
        } else {
          const v = (p - 0.5) * 2, x = v * Math.PI * 3, S = 0.08 * (1 - v), P = Math.sin(x) * S, b = Math.cos(x) * S;
          this.group.position.x = c + P, this.group.position.z = h + b;
          const T = 0.6;
          if (p > T) {
            const E = (p - T) / (1 - T), M = E * Math.PI * 3, y = 0.04 * (1 - E);
            for (const C of l) {
              const N = f.get(C);
              if (N) {
                const I = Math.sin(M) * y, U = Math.cos(M) * y;
                C.group.position.x = N.x + I, C.group.position.z = N.z + U;
              }
            }
          }
        }
        if (p < 1) requestAnimationFrame(_);
        else {
          this.updateWorldPosition(), this.isAnimating = false;
          for (const v of l) v.updateWorldPosition();
        }
      };
      _();
    }
    fall(t = null, e = null, n = null) {
      if (this.isFalling) return;
      this.isFalling = true, this.fallingStartTime = Date.now();
      const i = n !== null && n > 0, s = Math.abs(this.direction.x) > 0, o = s ? this.direction.x : this.direction.z;
      let a = 0, l = 0, c = 0;
      const h = i ? 1.8 : 1;
      if (this.isVertical ? (s ? (c = o * 3.5 * h, a = (Math.random() - 0.5) * 2.5 * h) : (a = -o * 3.5 * h, c = (Math.random() - 0.5) * 2.5 * h), l = (Math.random() - 0.5) * 1.5 * h) : s ? (c = o * 4.5 * h, l = (Math.random() - 0.5) * 2 * h, a = (Math.random() - 0.5) * 1.5 * h) : (a = -o * 4.5 * h, l = (Math.random() - 0.5) * 2 * h, c = (Math.random() - 0.5) * 1.5 * h), this.pendingAngularVel = {
        x: a,
        y: l,
        z: c
      }, t !== null && e !== null) {
        const d = n !== null ? n : 0;
        this.pendingLinearVel = {
          x: t,
          y: d,
          z: e
        };
      } else this.pendingLinearVel = {
        x: this.direction.x * 3.5,
        y: 0,
        z: this.direction.z * 3.5
      };
      this.needsPhysicsBody = true;
    }
    setHighlight(t) {
      if (this.isHighlighted === t) return;
      if (this.isHighlighted = t, !this.cubes || !this.cubes[0]) {
        console.warn("Block.setHighlight: No cubes found");
        return;
      }
      const e = this.cubes[0];
      if (!e.material) {
        console.warn("Block.setHighlight: No material found");
        return;
      }
      if (t) {
        const n = this.originalMaterial.clone();
        n.emissive = new xt(16776960), n.emissiveIntensity = 2, n.color = new xt(16776960), n.roughness = 0.1, e.material = n, this.highlightAnimation || (this.highlightAnimation = {
          time: 0
        }), console.log(`Block at (${this.gridX}, ${this.gridZ}) highlighted - material updated`);
      } else e.material = this.originalMaterial, this.highlightAnimation = null;
    }
    updateHighlightAnimation(t) {
      if (this.isHighlighted && this.cubes && this.cubes[0] && this.cubes[0].material) {
        this.highlightAnimation || (this.highlightAnimation = {
          time: 0
        }), this.highlightAnimation.time += t;
        const e = Math.sin(this.highlightAnimation.time * 3) * 0.3 + 0.7;
        this.cubes[0].material.emissiveIntensity = e;
      }
    }
    remove() {
      this.isRemoved = true, this.physicsBody && (pm(this.physics, this.physicsBody, true), this.physicsBody = null, this.physicsCollider = null), this.group.parent ? this.group.parent.remove(this.group) : this.scene.remove(this.group);
    }
  }
  function Xp(r, t, e) {
    const n = document.createElement("canvas");
    n.width = 256, n.height = 256;
    const i = n.getContext("2d"), s = i.createLinearGradient(0, 0, 0, 256), o = t >> 16 & 255, a = t >> 8 & 255, l = t & 255, c = e >> 16 & 255, h = e >> 8 & 255, d = e & 255;
    s.addColorStop(0, `rgb(${o}, ${a}, ${l})`), s.addColorStop(1, `rgb(${c}, ${h}, ${d})`), i.fillStyle = s, i.fillRect(0, 0, 256, 256);
    const u = new sp(n);
    u.mapping = Ns, r.background = u;
  }
  function Yp(r, t) {
    r.fog = null;
  }
  function gS(r) {
    const t = new ph(16777215, 0.08);
    r.add(t);
    const e = new da(16777215, 2);
    e.position.set(10, 20, 10), e.castShadow = true, e.shadow.camera.left = -30, e.shadow.camera.right = 30, e.shadow.camera.top = 30, e.shadow.camera.bottom = -30, e.shadow.camera.near = 0.1, e.shadow.camera.far = 100, e.shadow.camera.position.set(0, 25, 0), e.shadow.camera.lookAt(0, 0, 0), e.shadow.mapSize.width = 2048, e.shadow.mapSize.height = 2048, e.shadow.bias = -1e-4, e.shadow.radius = 2, e.shadow.normalBias = 0.02, r.add(e);
    const n = new da(16777215, 0.1);
    return n.position.set(-8, 12, -8), r.add(n), {
      ambientLight: t,
      keyLight: e,
      fillLight: n
    };
  }
  function _S(r) {
    const n = new ni(7, 0.2, 7), i = new Be({
      color: 4473924,
      roughness: 0.3,
      metalness: 0.1
    }), s = new ae(n, i);
    s.position.set(7 * 1 / 2, -0.1, 7 * 1 / 2), s.receiveShadow = true, r.add(s);
    const o = new Wp(7 * 1, 7, 8947848, 6710886);
    return o.position.set(7 * 1 / 2, 0.01, 7 * 1 / 2), o.material && (o.material.transparent = true, o.material.opacity = 0.8), r.add(o), {
      base: s,
      gridHelper: o,
      gridSize: 7,
      cubeSize: 1
    };
  }
  function jn(r) {
    const t = [];
    if (r.isVertical) t.push({
      x: r.gridX,
      z: r.gridZ
    });
    else {
      const e = Math.abs(r.direction.x) > 0;
      for (let n = 0; n < r.length; n++) {
        const i = r.gridX + (e ? n : 0), s = r.gridZ + (e ? 0 : n);
        t.push({
          x: i,
          z: s
        });
      }
    }
    return t;
  }
  function dd(r, t, e) {
    const n = r.direction;
    let i = r.gridX, s = r.gridZ, o = 0;
    const a = e * 2;
    for (; o < a; ) {
      o++;
      const l = i + n.x, c = s + n.z;
      if (r.isVertical) {
        if (l < 0 || l >= e || c < 0 || c >= e) return {
          canExit: true,
          stepsToExit: o
        };
        if (t.has(`${l},${c}`)) return {
          canExit: false,
          stepsToExit: o
        };
      } else {
        const h = Math.abs(n.x) > 0;
        let d = true, u = false;
        for (let f = 0; f < r.length; f++) {
          const m = l + (h ? f : 0), _ = c + (h ? 0 : f);
          if (m < 0 || m >= e || _ < 0 || _ >= e) {
            u = true;
            break;
          }
          if (t.has(`${m},${_}`)) {
            d = false;
            break;
          }
        }
        if (u) return {
          canExit: true,
          stepsToExit: o
        };
        if (!d) return {
          canExit: false,
          stepsToExit: o
        };
      }
      i = l, s = c;
    }
    return {
      canExit: false,
      stepsToExit: o
    };
  }
  function Qi(r, t) {
    const e = /* @__PURE__ */ new Map();
    for (const n of r) {
      if (n.isFalling || n.isAnimating || n.isRemoved || n.removalStartTime) continue;
      const i = jn(n), s = n.cubeSize || 1, o = n.isVertical ? n.length * s : s, a = n.yOffset || 0, l = a + o;
      for (const c of i) if (c.x < 0 || c.x >= t || c.z < 0 || c.z >= t) return {
        valid: false,
        reason: `Block out of bounds at (${c.x}, ${c.z})`
      };
      for (const c of i) {
        const h = `${c.x},${c.z}`;
        if (e.has(h)) {
          const d = e.get(h);
          for (const u of d) if (!(l <= u.yBottom || a >= u.yTop)) {
            const f = `block at (${n.gridX}, ${n.gridZ}), yOffset=${a}, height=${o}`, m = `block at (${u.block.gridX}, ${u.block.gridZ}), yOffset=${u.yBottom}, height=${u.yTop - u.yBottom}`;
            return console.warn(`Overlap detected: ${f} overlaps with ${m} at (${c.x}, ${c.z})`), {
              valid: false,
              reason: `Overlap at (${c.x}, ${c.z})`
            };
          }
          d.push({
            block: n,
            yBottom: a,
            yTop: l
          });
        } else e.set(h, [
          {
            block: n,
            yBottom: a,
            yTop: l
          }
        ]);
      }
    }
    return {
      valid: true
    };
  }
  function vh(r, t) {
    const e = [], n = /* @__PURE__ */ new Map(), i = [];
    for (const s of r) {
      if (s.isFalling || s.isAnimating || s.isRemoved || s.removalStartTime) continue;
      const o = jn(s), a = s.cubeSize || 1, l = s.isVertical ? s.length * a : a, c = s.yOffset || 0, h = c + l;
      for (const d of o) {
        const u = `${d.x},${d.z}`;
        if (n.has(u)) {
          const f = n.get(u);
          for (const m of f) h <= m.yBottom || c >= m.yTop || i.push({
            block1: s,
            block2: m.block,
            cell: {
              x: d.x,
              z: d.z
            }
          });
          f.push({
            block: s,
            yBottom: c,
            yTop: h
          });
        } else n.set(u, [
          {
            block: s,
            yBottom: c,
            yTop: h
          }
        ]);
      }
    }
    for (const s of i) {
      const { block1: o, block2: a, cell: l } = s, c = o.yOffset || 0, h = a.yOffset || 0, d = c >= h ? o : a, u = d.cubeSize || 1, f = d.isVertical ? d.length * u : u;
      let m = d.yOffset;
      for (let _ = 1; _ <= 10; _++) {
        const g = Math.max(0, d.yOffset - _ * u), p = g, v = g + f;
        let x = true;
        const S = jn(d);
        for (const P of S) {
          const b = `${P.x},${P.z}`, T = n.get(b) || [];
          for (const E of T) if (E.block !== d && v > E.yBottom && p < E.yTop) {
            x = false;
            break;
          }
          if (!x) break;
        }
        if (x) {
          m = g;
          break;
        }
      }
      m !== d.yOffset && (d.yOffset = m, d.updateWorldPosition(), e.includes(d) || e.push(d));
    }
    return {
      fixed: e.length > 0,
      movedBlocks: e
    };
  }
  function xS(r, t) {
    if (Qi(r, t).valid) return {
      fixed: false,
      message: "No overlaps detected"
    };
    console.warn("Overlaps detected, attempting to fix...");
    const n = vh(r);
    if (n.fixed) {
      const i = Qi(r, t);
      return i.valid ? {
        fixed: true,
        message: `Fixed ${n.movedBlocks.length} overlapping block(s)`,
        movedBlocks: n.movedBlocks
      } : {
        fixed: false,
        message: `Partially fixed, but still have overlaps: ${i.reason}`,
        movedBlocks: n.movedBlocks
      };
    } else return {
      fixed: false,
      message: "Could not fix overlaps automatically",
      movedBlocks: []
    };
  }
  const qt = new jc();
  Xp(qt, 986895, 328965);
  Yp(qt);
  window.gameScene = qt;
  window.THREE = pS;
  window.setGradientBackground = Xp;
  window.setupFog = Yp;
  let hn = 2;
  const yn = new be(60, window.innerWidth / window.innerHeight, 0.1, 1e3), Me = new Zf({
    antialias: true
  });
  Me.setSize(window.innerWidth, window.innerHeight);
  Me.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  Me.shadowMap.enabled = true;
  Me.shadowMap.type = Dc;
  document.body.appendChild(Me.domElement);
  let In = false, Yi = false, je = null;
  const fa = 3;
  let Xa = false, Ec = 0, Cc = 0;
  Me.domElement.addEventListener("mousedown", (r) => {
    r.button === 0 && (Xa = true, Ec = r.clientX, Cc = r.clientY, je = {
      x: r.clientX,
      y: r.clientY
    }, performance.now(), In = false, Yi = false);
  }, {
    passive: true
  });
  Me.domElement.addEventListener("mousemove", (r) => {
    if (Xa) {
      const t = r.clientX - Ec, e = r.clientY - Cc;
      qa += t * pd, mi -= e * pd, mi = Math.max(Jp, Math.min(Kp, mi)), Ec = r.clientX, Cc = r.clientY, je && Math.sqrt(t * t + e * e) > fa && (In = true, Yi = true);
    } else if (je) {
      const t = r.clientX - je.x, e = r.clientY - je.y;
      Math.sqrt(t * t + e * e) > fa && (In = true, Yi = true);
    }
  });
  Me.domElement.addEventListener("mouseup", (r) => {
    r.button === 0 && (Xa = false), je = null, In = false;
  });
  Me.domElement.addEventListener("mouseleave", () => {
    Xa = false, je = null, In = false, Yi = false;
  });
  let pa = false, qp = 0, Rc = 0;
  const $p = 0.02;
  let tn = window.framingOffsetY || 0.1, Yn = null;
  const Zp = 0.2;
  window.framingOffsetY !== void 0 && (tn = window.framingOffsetY);
  Me.domElement.addEventListener("contextmenu", (r) => {
    r.preventDefault();
  });
  Me.domElement.addEventListener("mousedown", (r) => {
    r.button === 2 && (pa = true, qp = r.clientY, Rc = r.clientY, r.preventDefault());
  }, {
    passive: false
  });
  Me.domElement.addEventListener("mousemove", (r) => {
    if (pa) {
      const t = r.clientY - Rc;
      r.clientY - qp;
      const e = performance.now();
      mr || (mr = e);
      const n = Math.max(1, e - mr), i = Math.abs(t) / n, s = Math.min(1 + i * 0.5, 5), o = $p * s, a = -t * o;
      if (tn = Math.max(Gr, Math.min(Wr, tn + a)), Yn === null) {
        const l = () => {
          const c = window.framingOffsetY, h = tn - c;
          if (Math.abs(h) > 1e-3) {
            const d = c + h * Zp, u = Math.max(Gr, Math.min(Wr, d));
            window.framingOffsetY = u, ji();
            const f = document.getElementById("framing-value-display");
            f && (f.textContent = u.toFixed(1)), Yn = requestAnimationFrame(l);
          } else {
            window.framingOffsetY = tn, ji();
            const d = document.getElementById("framing-value-display");
            d && (d.textContent = tn.toFixed(1));
            try {
              localStorage.setItem("jarrows_framing", tn.toString());
            } catch (u) {
              console.warn("Failed to save framing preference:", u);
            }
            Yn = null;
          }
        };
        l();
      }
      Rc = r.clientY, mr = e, r.preventDefault();
    }
  });
  let mr = 0;
  Me.domElement.addEventListener("mouseup", (r) => {
    r.button === 2 && pa && (pa = false, mr = 0, r.preventDefault());
  });
  Me.domElement.addEventListener("wheel", (r) => {
    r.preventDefault();
    const t = 0.1, e = 1 + (r.deltaY > 0 ? t : -t);
    qn *= e, qn = Math.max(Ya, Math.min(Sh, qn));
  }, {
    passive: false
  });
  const vS = gS(qt), { base: yh, gridHelper: Mh } = _S(qt), ut = 7, Te = 1, ma = new R(3.5, 0, 3.5), Ln = new vn();
  Ln.name = "towerGroup";
  qt.add(Ln);
  qt.remove(yh);
  qt.remove(Mh);
  yh.position.set(0, -0.1, 0);
  Mh.position.set(0, 0.01, 0);
  Ln.add(yh);
  Ln.add(Mh);
  let ks = new R(0, 0, 0);
  function yS() {
    if (At.length === 0) return;
    let r = 1 / 0, t = -1 / 0;
    for (const n of At) {
      if (n.isRemoved || n.isFalling) continue;
      const i = n.isVertical ? n.length * n.cubeSize : n.cubeSize, s = n.yOffset, o = s + i;
      r = Math.min(r, s), t = Math.max(t, o);
    }
    if (r === 1 / 0 || t === -1 / 0) return;
    const e = (r + t) / 2;
    ks.y = -e, console.log(`Tower vertically centered: minY=${r.toFixed(2)}, maxY=${t.toFixed(2)}, centerY=${e.toFixed(2)}, offsetY=${ks.y.toFixed(2)}`);
  }
  const Ya = 5, Sh = 50, Jp = -Math.PI / 2 + 0.1, Kp = Math.PI / 2 - 0.1, MS = 2, fd = 4, SS = 1.3, pd = 25e-4, md = 4e-3;
  let yr = 10, Mr = Math.PI / 4, Sr = Math.PI / 4, qn = yr, qa = Mr, mi = Sr, Ls = yr, Ds = Mr, qi = Sr;
  function Qp() {
    const r = ut * Te, t = Math.sqrt(r * r * 2), e = yn.fov * (Math.PI / 180), n = yn.aspect, i = (t + MS) / (2 * Math.tan(e / 2) * n);
    yr = Math.max(Ya, i), Sr = Math.PI / 4, Mr = Math.PI / 4, qn = yr, qa = Mr, mi = Sr, Ls = yr, Ds = Mr, qi = Sr;
  }
  function ji() {
    const r = ma.clone().add(ks), t = Ls * Math.sin(qi) * Math.cos(Ds), e = Ls * Math.cos(qi), n = Ls * Math.sin(qi) * Math.sin(Ds);
    yn.position.set(r.x + t, r.y + e, r.z + n);
    const i = new R(0, window.framingOffsetY || 6.5, 0), s = r.clone().add(i);
    yn.lookAt(s), Ln.position.copy(ma.clone().add(ks)), Ln.rotation.set(0, 0, 0);
  }
  function bS(r, t, e, n) {
    if (!r) return;
    const i = Math.sin(e) * Math.cos(t), s = Math.cos(e), o = Math.sin(e) * Math.sin(t), a = new R(i, s, o).normalize(), l = Math.PI / 6, c = Math.tan(l), h = 30, d = new R(a.x * 0.3 + Math.sin(t + Math.PI / 4) * 0.2, a.y * 0.5 + 0.3, a.z * 0.3 + Math.cos(t + Math.PI / 4) * 0.2);
    let u = a.clone().multiplyScalar(h).add(d);
    const m = Math.sqrt(u.x * u.x + u.z * u.z) * c;
    u.y < m && (u.y = m), r.keyLight.position.copy(n.clone().add(u)), r.keyLight.shadow && r.keyLight.shadow.camera && (r.keyLight.shadow.camera.position.copy(r.keyLight.position), r.keyLight.shadow.camera.lookAt(n), r.keyLight.shadow.camera.updateMatrixWorld());
    let _ = a.clone().multiplyScalar(-25);
    _.y += 6;
    const p = Math.sqrt(_.x * _.x + _.z * _.z) * c;
    _.y < p && (_.y = p), r.fillLight && r.fillLight.position.copy(n.clone().add(_));
  }
  const We = await mm(), At = [];
  window.gameBlocks = At;
  window.fixOverlaps = () => {
    const r = xS(At, ut);
    return console.log(r.message), r;
  };
  const ur = [
    {
      x: 1,
      z: 0
    },
    {
      x: -1,
      z: 0
    },
    {
      x: 0,
      z: 1
    },
    {
      x: 0,
      z: -1
    }
  ];
  let pn = 0, Ye = false, ga = false, ts = 3;
  const jp = "jarrows_progress", gd = "jarrows_highest_level";
  function tm() {
    try {
      localStorage.setItem(jp, pn.toString());
      const r = parseInt(localStorage.getItem(gd) || "0", 10);
      pn > r && localStorage.setItem(gd, pn.toString());
    } catch (r) {
      console.warn("Failed to save progress:", r);
    }
  }
  function wS() {
    try {
      localStorage.removeItem(jp);
    } catch (r) {
      console.warn("Failed to clear progress:", r);
    }
  }
  function bh(r) {
    return r === 0 ? 3 : 10 + (r - 1) * 10;
  }
  function _d(r = 0, t = null, e = 10, n = 1, i = false) {
    const s = ut * ut, o = /* @__PURE__ */ new Set(), a = [], l = r > 0, c = e <= 50;
    function h(M, y) {
      return o.has(`${M},${y}`);
    }
    function d(M) {
      if (r === 0) return true;
      const y = t instanceof Set ? t : (t == null ? void 0 : t.cells) || null;
      if (M.isVertical) return y && y.has(`${M.gridX},${M.gridZ}`);
      {
        const C = Math.abs(M.direction.x) > 0;
        for (let N = 0; N < M.length; N++) {
          const I = M.gridX + (C ? N : 0), U = M.gridZ + (C ? 0 : N);
          if (y && y.has(`${I},${U}`)) return true;
        }
        return false;
      }
    }
    function u(M, y, C, N) {
      const I = y, U = N - 1 - y, D = M, O = N - 1 - M;
      let H = 1 / 0, z = false;
      return C.z === -1 && I < U && I < D && I < O ? (H = I, z = true) : C.z === 1 && U < I && U < D && U < O ? (H = U, z = true) : C.x === -1 && D < I && D < U && D < O ? (H = D, z = true) : C.x === 1 && O < I && O < U && O < D && (H = O, z = true), {
        canExit: z,
        distanceToEdge: H
      };
    }
    function f(M, y, C) {
      const N = y, I = C - 1 - y, U = M, D = C - 1 - M, O = Math.min(N, I, U, D);
      return O === N ? {
        x: 0,
        z: -1
      } : O === I ? {
        x: 0,
        z: 1
      } : O === U ? {
        x: -1,
        z: 0
      } : {
        x: 1,
        z: 0
      };
    }
    function m(M, y, C, N, I) {
      const U = /* @__PURE__ */ new Set(), D = N ? C * Te : Te, O = r, H = r + D;
      if (N) {
        const z = `${M},${y}`;
        if (o.has(z)) return null;
        if (t && typeof t == "object" && t.yRanges) {
          const F = t.yRanges.get(z);
          if (F) {
            for (const Y of F) if (!(H <= Y.yBottom || O >= Y.yTop)) return null;
          }
        }
        U.add(z);
      } else {
        const z = Math.abs(I.x) > 0;
        for (let F = 0; F < C; F++) {
          const Y = M + (z ? F : 0), nt = y + (z ? 0 : F);
          if (Y < 0 || Y >= ut || nt < 0 || nt >= ut) return null;
          const dt = `${Y},${nt}`;
          if (o.has(dt)) return null;
          if (t && typeof t == "object" && t.yRanges) {
            const Et = t.yRanges.get(dt);
            if (Et) {
              for (const q of Et) if (!(H <= q.yBottom || O >= q.yTop)) return null;
            }
          }
          U.add(dt);
        }
      }
      for (const z of U) o.add(z);
      return {
        cells: U,
        yBottom: O,
        yTop: H
      };
    }
    if (c) {
      const M = l ? e > 100 ? 50 : 40 : e > 100 ? 20 : 10;
      let y = 0;
      for (; a.length < e && y < M; ) {
        y++;
        const C = [];
        for (let U = 0; U < ut; U++) for (let D = 0; D < ut; D++) h(U, D) || C.push({
          x: U,
          z: D
        });
        if (C.length === 0) break;
        const N = n === 0 ? 3 : 1;
        for (let U = 0; U < N; U++) for (let D = C.length - 1; D > 0; D--) {
          const O = Math.floor(Math.random() * (D + 1));
          [C[D], C[O]] = [
            C[O],
            C[D]
          ];
        }
        let I = 0;
        for (const U of C) {
          if (a.length >= e) break;
          const D = e - a.length, O = Math.random();
          let H;
          i ? O < 0.2 ? H = 1 : O < 0.7 ? H = 2 : H = 3 : D <= 5 ? O < 0.8 ? H = 1 : O < 0.95 ? H = 2 : H = 3 : O < 0.4 ? H = 1 : O < 0.8 ? H = 2 : H = 3;
          let z;
          if (Math.random() < 0.7) {
            const Et = f(U.x, U.z, ut);
            z = Math.random() < 0.8 ? Et : ur[Math.floor(Math.random() * ur.length)];
          } else z = ur[Math.floor(Math.random() * ur.length)];
          const Y = Math.random() < 0.5, nt = m(U.x, U.z, H, Y, z);
          if (!nt) continue;
          const dt = new cn(H, U.x, U.z, z, Y, hn, qt, We, ut, Te, r, n);
          if (qt.remove(dt.group), !d(dt)) {
            for (const Et of nt.cells) o.delete(Et);
            continue;
          }
          a.push(dt), I++;
        }
        if (I === 0) break;
      }
      if (a.length > 0) {
        const C = /* @__PURE__ */ new Set();
        a.forEach((N) => {
          jn(N).forEach((U) => C.add(`${U.x},${U.z}`));
        }), a.sort((N, I) => {
          const U = dd(N, C, ut), D = dd(I, C, ut);
          if (U.canExit && !D.canExit) return -1;
          if (!U.canExit && D.canExit) return 1;
          if (U.canExit && D.canExit) return U.stepsToExit - D.stepsToExit;
          const O = u(N.gridX, N.gridZ, N.direction, ut), H = u(I.gridX, I.gridZ, I.direction, ut);
          return O.canExit && !H.canExit ? -1 : !O.canExit && H.canExit ? 1 : O.canExit && H.canExit ? O.distanceToEdge - H.distanceToEdge : 0;
        });
      }
      return a;
    }
    const _ = [];
    for (let M = 0; M < ut && !(a.length >= e); M++) if (!h(M, 0)) {
      const y = Math.random() < 0.9 ? Math.floor(Math.random() * 2) + 2 : 1, C = y > 1 && Math.random() < 0.7, N = {
        x: 0,
        z: -1
      };
      if (C || y === 1) {
        const I = m(M, 0, y, C, N);
        if (I) {
          const U = new cn(y, M, 0, N, C, hn, qt, We, ut, Te, r, n);
          if (d(U)) {
            if (qt.remove(U.group), _.push(U), a.push(U), a.length >= e) break;
          } else {
            for (const D of I.cells) o.delete(D);
            qt.remove(U.group);
          }
        }
      }
    }
    for (let M = 0; M < ut && !(a.length >= e); M++) if (!h(M, ut - 1)) {
      const y = Math.random() < 0.9 ? Math.floor(Math.random() * 2) + 2 : 1, C = y > 1 && Math.random() < 0.7, N = {
        x: 0,
        z: 1
      };
      if (C || y === 1) {
        const I = m(M, ut - 1, y, C, N);
        if (I) {
          const U = new cn(y, M, ut - 1, N, C, hn, qt, We, ut, Te, r, n);
          if (d(U)) {
            if (qt.remove(U.group), _.push(U), a.push(U), a.length >= e) break;
          } else {
            for (const D of I.cells) o.delete(D);
            qt.remove(U.group);
          }
        }
      }
    }
    for (let M = 0; M < ut && !(a.length >= e); M++) if (!h(0, M)) {
      const y = Math.random() < 0.9 ? Math.floor(Math.random() * 2) + 2 : 1, C = y > 1 && Math.random() < 0.7, N = {
        x: -1,
        z: 0
      };
      if (C || y === 1) {
        const I = m(0, M, y, C, N);
        if (I) {
          const U = new cn(y, 0, M, N, C, hn, qt, We, ut, Te, r, n);
          if (d(U)) {
            if (qt.remove(U.group), _.push(U), a.push(U), a.length >= e) break;
          } else {
            for (const D of I.cells) o.delete(D);
            qt.remove(U.group);
          }
        }
      }
    }
    for (let M = 0; M < ut && !(a.length >= e); M++) if (!h(ut - 1, M)) {
      const y = Math.random() < 0.9 ? Math.floor(Math.random() * 2) + 2 : 1, C = y > 1 && Math.random() < 0.7, N = {
        x: 1,
        z: 0
      };
      if (C || y === 1) {
        const I = m(ut - 1, M, y, C, N);
        if (I) {
          const U = new cn(y, ut - 1, M, N, C, hn, qt, We, ut, Te, r, n);
          if (d(U)) {
            if (qt.remove(U.group), _.push(U), a.push(U), a.length >= e) break;
          } else {
            for (const D of I.cells) o.delete(D);
            qt.remove(U.group);
          }
        }
      }
    }
    const g = 800;
    let p = 0;
    const v = l ? 0.98 : e > 100 ? 1 : 0.95;
    for (; p < g && o.size < s * v && a.length < e && (p++, _.length !== 0); ) {
      const M = _[Math.floor(Math.random() * _.length)];
      if (!M || M.isFalling) continue;
      const y = {
        x: -M.direction.x,
        z: -M.direction.z
      }, C = M.gridX + y.x, N = M.gridZ + y.z;
      let I = true;
      if (M.isVertical) (C < 0 || C >= ut || N < 0 || N >= ut || h(C, N)) && (I = false);
      else {
        const O = Math.abs(M.direction.x) > 0;
        for (let H = 0; H < M.length; H++) {
          const z = C + (O ? H : 0), F = N + (O ? 0 : H);
          if (z < 0 || z >= ut || F < 0 || F >= ut) {
            I = false;
            break;
          }
          if (h(z, F)) {
            I = false;
            break;
          }
        }
      }
      if (!I || !m(C, N, M.length, M.isVertical, M.direction)) continue;
      M.gridX, M.gridZ;
      const D = jn(M);
      for (const O of D) o.delete(`${O.x},${O.z}`);
      M.gridX = C, M.gridZ = N, M.updateWorldPosition();
    }
    const x = [];
    for (let M = 0; M < ut; M++) for (let y = 0; y < ut; y++) h(M, y) || x.push({
      x: M,
      z: y
    });
    for (let M = x.length - 1; M > 0; M--) {
      const y = Math.floor(Math.random() * (M + 1));
      [x[M], x[y]] = [
        x[y],
        x[M]
      ];
    }
    for (const M of x) {
      if (a.length >= e) break;
      const y = {
        east: ut - 1 - M.x,
        west: M.x,
        south: ut - 1 - M.z,
        north: M.z
      }, C = Math.min(...Object.values(y)), N = Object.entries(y).filter(([D, O]) => O === C).map(([D, O]) => D);
      let I = ur[0];
      N.includes("east") ? I = {
        x: 1,
        z: 0
      } : N.includes("west") ? I = {
        x: -1,
        z: 0
      } : N.includes("south") ? I = {
        x: 0,
        z: 1
      } : N.includes("north") && (I = {
        x: 0,
        z: -1
      });
      const U = Math.abs(I.x) > 0;
      for (const D of [
        3,
        2,
        1
      ]) {
        if (D === 1 && Math.random() < 0.85) continue;
        let O = true;
        for (let F = 0; F < D; F++) {
          const Y = M.x + (U ? F : 0), nt = M.z + (U ? 0 : F);
          if (Y < 0 || Y >= ut || nt < 0 || nt >= ut) {
            O = false;
            break;
          }
          if (h(Y, nt)) {
            O = false;
            break;
          }
        }
        if (!O) continue;
        const H = m(M.x, M.z, D, false, I);
        if (!H) continue;
        const z = new cn(D, M.x, M.z, I, false, hn, qt, We, ut, Te, r, n);
        if (!d(z)) {
          for (const F of H.cells) o.delete(F);
          if (qt.remove(z.group), l && a.length < e * 0.5) {
            const F = t instanceof Set ? t : (t == null ? void 0 : t.cells) || null;
            (z.isVertical ? F && F.has(`${z.gridX},${z.gridZ}`) ? 1 : 0 : (() => {
              const nt = Math.abs(z.direction.x) > 0;
              let dt = 0;
              for (let Et = 0; Et < z.length; Et++) {
                const q = z.gridX + (nt ? Et : 0), at = z.gridZ + (nt ? 0 : Et);
                F && F.has(`${q},${at}`) && dt++;
              }
              return dt;
            })()) === 0 && a.length % 10 === 0 && console.log(`  [Debug] Block at (${z.gridX},${z.gridZ}) rejected: no support (layer yOffset=${r})`);
          }
          continue;
        }
        if (qt.remove(z.group), a.push(z), a.length >= e) break;
        break;
      }
    }
    let S = 0;
    const P = l ? e > 100 ? 25 : 15 : e > 100 ? 10 : 3;
    for (; S < P && o.size < s && a.length < e; ) {
      S++;
      const M = o.size, y = [];
      for (let C = 0; C < ut; C++) for (let N = 0; N < ut; N++) h(C, N) || y.push({
        x: C,
        z: N
      });
      for (let C = y.length - 1; C > 0; C--) {
        const N = Math.floor(Math.random() * (C + 1));
        [y[C], y[N]] = [
          y[N],
          y[C]
        ];
      }
      for (const C of y) {
        const N = [
          {
            x: 1,
            z: 0
          },
          {
            x: -1,
            z: 0
          },
          {
            x: 0,
            z: 1
          },
          {
            x: 0,
            z: -1
          }
        ];
        for (let U = N.length - 1; U > 0; U--) {
          const D = Math.floor(Math.random() * (U + 1));
          [N[U], N[D]] = [
            N[D],
            N[U]
          ];
        }
        let I = false;
        for (const U of N) {
          for (const D of [
            2,
            3,
            1
          ]) {
            if (D === 1 && Math.random() < 0.9) continue;
            const O = Math.abs(U.x) > 0;
            let H = true;
            for (let Y = 0; Y < D; Y++) {
              const nt = C.x + (O ? Y : 0), dt = C.z + (O ? 0 : Y);
              if (nt < 0 || nt >= ut || dt < 0 || dt >= ut) {
                H = false;
                break;
              }
              if (h(nt, dt)) {
                H = false;
                break;
              }
            }
            if (!H) continue;
            const z = m(C.x, C.z, D, false, U);
            if (!z) continue;
            const F = new cn(D, C.x, C.z, U, false, hn, qt, We, ut, Te, r, n);
            if (!d(F)) {
              for (const Y of z.cells) o.delete(Y);
              qt.remove(F.group);
              continue;
            }
            if (qt.remove(F.group), a.push(F), I = true, a.length >= e) break;
            break;
          }
          if (I || a.length >= e) break;
        }
      }
      if (o.size === M) break;
    }
    if (a.length < e && o.size < s) {
      e - a.length;
      const M = [];
      for (let y = 0; y < ut; y++) for (let C = 0; C < ut; C++) M.push({
        x: y,
        z: C
      });
      for (let y = M.length - 1; y > 0 && a.length < e; y--) {
        const C = Math.floor(Math.random() * (y + 1));
        [M[y], M[C]] = [
          M[C],
          M[y]
        ];
      }
      for (const y of M) {
        if (a.length >= e) break;
        const C = {
          east: ut - 1 - y.x,
          west: y.x,
          south: ut - 1 - y.z,
          north: y.z
        }, N = Math.min(...Object.values(C)), I = Object.entries(C).filter(([F, Y]) => Y === N).map(([F, Y]) => F), U = I[Math.floor(Math.random() * I.length)];
        let D = {
          x: 0,
          z: 0
        };
        U === "east" ? D = {
          x: 1,
          z: 0
        } : U === "west" ? D = {
          x: -1,
          z: 0
        } : U === "south" ? D = {
          x: 0,
          z: 1
        } : U === "north" && (D = {
          x: 0,
          z: -1
        });
        const O = m(y.x, y.z, 1, false, D);
        if (!O) continue;
        const H = new cn(1, y.x, y.z, D, false, hn, qt, We, ut, Te, r, n), z = r === 0 || d(H);
        if (qt.remove(H.group), z) {
          const F = new cn(1, y.x, y.z, D, false, hn, qt, We, ut, Te, r, n);
          qt.remove(F.group), a.push(F);
        } else for (const F of O.cells) o.delete(F);
      }
    }
    const b = a.filter((M) => M.length === 1).length, T = a.length, E = (b / T * 100).toFixed(1);
    return console.log(`Generated puzzle with ${a.length} blocks, ${o.size}/${s} cells filled (${(o.size / s * 100).toFixed(1)}%)`), console.log(`  Single blocks: ${b}/${T} (${E}%)`), a;
  }
  function xd(r, t = 10, e = 10) {
    return new Promise((n) => {
      let i = 0;
      const s = () => {
        const o = i * t, a = Math.min(o + t, r.length);
        if (o >= r.length) {
          n();
          return;
        }
        for (let u = o; u < a; u++) {
          const f = r[u];
          if (!f) {
            console.warn(`\u26A0\uFE0F Null block at index ${u} in batch starting at ${o}`);
            continue;
          }
          f.group.scale.set(0, 0, 0), Ln.add(f.group), At.push(f);
        }
        const l = performance.now(), c = 50;
        let h = null;
        const d = () => {
          const u = i * t;
          if (!Ye || r.length === 0 || u >= r.length) {
            h !== null && (cancelAnimationFrame(h), h = null);
            return;
          }
          const f = performance.now() - l, m = Math.min(f / c, 1), _ = 1 - Math.pow(1 - m, 3);
          for (let g = u; g < a && g < r.length; g++) r[g] && r[g].group && r[g].group.scale.set(_, _, _);
          if (m < 1) h = requestAnimationFrame(d);
          else {
            for (let g = u; g < a && g < r.length; g++) r[g] && r[g].group && r[g].group.scale.set(1, 1, 1);
            h !== null && (cancelAnimationFrame(h), h = null), i++, setTimeout(s, e);
          }
        };
        h = requestAnimationFrame(d);
      };
      s();
    });
  }
  function TS(r = 10) {
    const t = [], e = /* @__PURE__ */ new Set(), n = [
      {
        x1: 1,
        z1: 1,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 3,
        z2: 1,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 1,
        len2: 1,
        vert1: false,
        vert2: false
      },
      {
        x1: 1,
        z1: 3,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 4,
        z2: 3,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 1,
        len2: 1,
        vert1: false,
        vert2: false
      },
      {
        x1: 0,
        z1: 5,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 3,
        z2: 5,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 2,
        len2: 2,
        vert1: false,
        vert2: false
      },
      {
        x1: 2,
        z1: 1,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 2,
        z2: 3,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 1,
        len2: 1,
        vert1: false,
        vert2: false
      },
      {
        x1: 5,
        z1: 2,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 5,
        z2: 5,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 1,
        len2: 1,
        vert1: false,
        vert2: false
      },
      {
        x1: 0,
        z1: 2,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 0,
        z2: 4,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 2,
        len2: 2,
        vert1: false,
        vert2: false
      },
      {
        x1: 3,
        z1: 2,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 5,
        z2: 2,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 2,
        len2: 2,
        vert1: true,
        vert2: true
      },
      {
        x1: 1,
        z1: 4,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 1,
        z2: 6,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 3,
        len2: 2,
        vert1: true,
        vert2: true
      },
      {
        x1: 6,
        z1: 1,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 4,
        z2: 1,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 2,
        len2: 1,
        vert1: true,
        vert2: true
      },
      {
        x1: 6,
        z1: 4,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 6,
        z2: 6,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 2,
        len2: 2,
        vert1: true,
        vert2: true
      },
      {
        x1: 0,
        z1: 0,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 6,
        z2: 0,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 3,
        len2: 2,
        vert1: true,
        vert2: true
      },
      {
        x1: 3,
        z1: 5,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 3,
        z2: 3,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 2,
        len2: 3,
        vert1: true,
        vert2: true
      },
      {
        x1: 2,
        z1: 0,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 5,
        z2: 0,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 3,
        len2: 2,
        vert1: false,
        vert2: false
      },
      {
        x1: 4,
        z1: 0,
        dir1: {
          x: 0,
          z: 1
        },
        x2: 4,
        z2: 2,
        dir2: {
          x: 0,
          z: -1
        },
        len1: 2,
        len2: 1,
        vert1: false,
        vert2: false
      },
      {
        x1: 3,
        z1: 6,
        dir1: {
          x: 1,
          z: 0
        },
        x2: 5,
        z2: 6,
        dir2: {
          x: -1,
          z: 0
        },
        len1: 1,
        len2: 1,
        vert1: false,
        vert2: false
      }
    ];
    function i(o, a) {
      return e.has(`${o},${a}`);
    }
    function s(o, a, l, c) {
      for (let h = 0; h < l; h++) {
        const d = o + (c ? h : 0), u = a + (c ? 0 : h);
        e.add(`${d},${u}`);
      }
    }
    for (const o of n) {
      if (t.length >= r) break;
      const a = Math.abs(o.dir1.x) > 0;
      let l = true;
      if (o.vert1) (o.x1 < 0 || o.x1 >= ut || o.z1 < 0 || o.z1 >= ut || i(o.x1, o.z1)) && (l = false);
      else for (let c = 0; c < o.len1; c++) {
        const h = o.x1 + (a ? c : 0), d = o.z1 + (a ? 0 : c);
        if (h < 0 || h >= ut || d < 0 || d >= ut || i(h, d)) {
          l = false;
          break;
        }
      }
      if (l) {
        o.vert1 ? e.add(`${o.x1},${o.z1}`) : s(o.x1, o.z1, o.len1, a);
        const c = o.vert1 === true;
        console.log(`Creating block1 at (${o.x1}, ${o.z1}), vert1=${o.vert1}, isVertical1=${c}, length=${o.len1}`);
        const h = new cn(o.len1, o.x1, o.z1, o.dir1, c, hn, qt, We, ut, Te, 0, 1);
        console.log(`Block1 created, isVertical=${h.isVertical}`), qt.remove(h.group), t.push(h);
      }
      if (t.length < r) {
        const c = Math.abs(o.dir2.x) > 0;
        let h = true;
        if (o.vert2) (o.x2 < 0 || o.x2 >= ut || o.z2 < 0 || o.z2 >= ut || i(o.x2, o.z2)) && (h = false);
        else for (let d = 0; d < o.len2; d++) {
          const u = o.x2 + (c ? d : 0), f = o.z2 + (c ? 0 : d);
          if (u < 0 || u >= ut || f < 0 || f >= ut || i(u, f)) {
            h = false;
            break;
          }
        }
        if (h) {
          o.vert2 ? e.add(`${o.x2},${o.z2}`) : s(o.x2, o.z2, o.len2, c);
          const d = o.vert2 === true;
          console.log(`Creating block2 at (${o.x2}, ${o.z2}), vert2=${o.vert2}, isVertical2=${d}, length=${o.len2}`);
          const u = new cn(o.len2, o.x2, o.z2, o.dir2, d, hn, qt, We, ut, Te, 0, 1);
          console.log(`Block2 created, isVertical=${u.isVertical}`), qt.remove(u.group), t.push(u);
        }
      }
    }
    for (; t.length < r; ) {
      const o = Math.floor(Math.random() * ut), a = Math.floor(Math.random() * ut);
      if (!i(o, a)) {
        const l = [
          {
            x: 1,
            z: 0
          },
          {
            x: -1,
            z: 0
          },
          {
            x: 0,
            z: 1
          },
          {
            x: 0,
            z: -1
          }
        ], c = l[Math.floor(Math.random() * l.length)], h = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 3, d = Math.random() < 0.3, u = Math.abs(c.x) > 0;
        let f = true;
        if (d) (o < 0 || o >= ut || a < 0 || a >= ut || i(o, a)) && (f = false);
        else for (let m = 0; m < h; m++) {
          const _ = o + (u ? m : 0), g = a + (u ? 0 : m);
          if (_ < 0 || _ >= ut || g < 0 || g >= ut || i(_, g)) {
            f = false;
            break;
          }
        }
        if (f) {
          d ? e.add(`${o},${a}`) : s(o, a, h, u);
          const m = new cn(h, o, a, c, d, hn, qt, We, ut, Te, 0, 1);
          qt.remove(m.group), t.push(m);
        }
      }
    }
    return t;
  }
  async function $s(r = 1) {
    var _a2, _b, _c2;
    if (Ye) {
      console.warn("Level generation already in progress, skipping...");
      return;
    }
    Ye = true, ga = false, ts = 3, io();
    for (const d of At) d.isAnimating && (d.isAnimating = false), Ln.remove(d.group), d.cubes && d.cubes.forEach((u) => {
      u.geometry && u.geometry.dispose(), u.material && u.material.dispose();
    }), d.arrow && d.arrow.traverse((u) => {
      u.geometry && u.geometry.dispose(), u.material && u.material.dispose();
    }), d.directionIndicators && d.directionIndicators.traverse((u) => {
      u.geometry && u.geometry.dispose(), u.material && u.material.dispose();
    });
    At.length = 0, Yn !== null && (cancelAnimationFrame(Yn), Yn = null);
    const t = bh(r);
    if (r === 1) {
      const d = TS(t);
      await xd(d), Ye = false;
      return;
    }
    const e = ut * ut, n = t > e;
    let i = [];
    if (n) {
      let d = t, u = 0, f = null;
      const m = Math.ceil(t / e) + 2, _ = Math.max(10, m);
      for (; d > 0 && u < _; ) {
        const g = u * Te;
        let p, v = false;
        if (u === 0) p = Math.min(d, e), v = true;
        else {
          d = t - i.length;
          const b = ((_a2 = f == null ? void 0 : f.cells) == null ? void 0 : _a2.size) || 0, T = Math.floor(b * 0.95), E = Math.min(e, T);
          p = Math.min(d, E), v = false, b < 10 && d > 50 && console.warn(`\u26A0\uFE0F Layer ${u}: Only ${b} supported cells, limiting block requests`);
        }
        console.log(`  Layer ${u}: Requesting ${p} blocks (remaining: ${d}, total so far: ${i.length})`);
        const x = _d(g, f, p, r, v);
        console.log(`  Layer ${u}: Generated ${x.length} blocks (requested ${p}, difference: ${p - x.length})`);
        const S = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Map();
        for (const b of x) {
          const T = b.cubeSize || Te, E = b.isVertical ? b.length * T : T, M = b.yOffset || g, y = M + E;
          if (b.isVertical) {
            const C = `${b.gridX},${b.gridZ}`;
            S.add(C), P.has(C) || P.set(C, []), P.get(C).push({
              yBottom: M,
              yTop: y
            });
          } else {
            const C = Math.abs(b.direction.x) > 0;
            for (let N = 0; N < b.length; N++) {
              const I = b.gridX + (C ? N : 0), U = b.gridZ + (C ? 0 : N), D = `${I},${U}`;
              S.add(D), P.has(D) || P.set(D, []), P.get(D).push({
                yBottom: M,
                yTop: y
              });
            }
          }
        }
        if (f) {
          f instanceof Set && (f = {
            cells: f,
            yRanges: /* @__PURE__ */ new Map()
          });
          for (const b of S) f.cells.add(b);
          f.yRanges || (f.yRanges = /* @__PURE__ */ new Map());
          for (const [b, T] of P.entries()) f.yRanges.has(b) || f.yRanges.set(b, []), f.yRanges.get(b).push(...T);
        } else f = {
          cells: S,
          yRanges: P
        };
        if (i = i.concat(x), d = t - i.length, u++, i.length >= t) break;
        x.length === 0 && d > 0 && (console.warn(`\u26A0\uFE0F Layer ${u} generated 0 blocks, but ${d} blocks still needed`), console.warn(`   Lower layer has ${((_b = f == null ? void 0 : f.cells) == null ? void 0 : _b.size) || 0} supported cells`)), x.length < p * 0.8 && d > 0 && (console.warn(`\u26A0\uFE0F Layer ${u} only generated ${x.length}/${p} blocks (${(x.length / p * 100).toFixed(1)}%)`), console.warn(`   Lower layer support: ${((_c2 = f == null ? void 0 : f.cells) == null ? void 0 : _c2.size) || 0} cells`), console.warn(`   Current layer occupied: ${S.size} cells`));
      }
    } else i = _d(0, null, t, r);
    console.log(`  Placing ${i.length} blocks in batches...`), await xd(i, 10, 10), console.log(`  Placement complete. Blocks array now has ${At.length} blocks`);
    const s = Qi(At, ut);
    if (!s.valid) {
      console.error(`\u2717 Structure validation failed: ${s.reason}`), console.error("  Regenerating puzzle..."), Ye = false, await $s(r);
      return;
    }
    const o = document.getElementById("level-value");
    o && (o.textContent = r), setTimeout(() => {
      Ye = false, console.log("  Level generation complete, support checking enabled"), yS();
    }, 1500), CS(), AS(), Zs = 0, console.log(`\u2713 Generated Level ${r} puzzle using reverse generation`), console.log(`  Target blocks: ${t}, Actual blocks: ${At.length}`), console.log("  Structure validation: \u2713 PASSED"), At.length !== t ? console.warn(`\u26A0\uFE0F BLOCK COUNT MISMATCH: Expected ${t}, got ${At.length} (difference: ${t - At.length})`) : console.log(`\u2713 Block count verified: ${At.length} blocks match target ${t}`);
    const a = At.filter((d) => d.isVertical).length, l = At.filter((d) => !d.isVertical).length, c = At.filter((d) => d.length === 1).length, h = At.filter((d) => d.length > 1).length;
    console.log(`  Block breakdown: ${a} vertical, ${l} horizontal, ${c} single-cell, ${h} multi-cell`);
  }
  let gi = [], Zs = 0, $n = null, no = 0, es = false;
  function em(r) {
    const t = Math.floor(r / 60), e = Math.floor(r % 60);
    return `${String(t).padStart(2, "0")}:${String(e).padStart(2, "0")}`;
  }
  function AS() {
    es || ($n = performance.now() / 1e3, no = 0, es = true);
  }
  function ES() {
    es && ($n !== null && (no += performance.now() / 1e3 - $n), $n = null, es = false);
  }
  function CS() {
    $n = null, no = 0, es = false, wh();
  }
  function wh() {
    const r = document.getElementById("timer-value");
    if (!r) return;
    let t = no;
    es && $n !== null && (t += performance.now() / 1e3 - $n), r.textContent = em(t);
  }
  function nm(r) {
    gi.push({
      block: r,
      gridX: r.gridX,
      gridZ: r.gridZ,
      direction: {
        ...r.direction
      },
      isVertical: r.isVertical,
      timestamp: performance.now()
    }), Zs++, gi.length > 50 && gi.shift();
  }
  async function RS() {
    ts = 3, io(), !Ye && (gi = [], Zs = 0, await $s(pn));
  }
  async function PS() {
    Ye || (pn = 0, ga = false, gi = [], Zs = 0, ts = 3, io(), wS(), im(), await $s(pn));
  }
  function IS(r) {
    const t = document.getElementById("level-complete-modal"), e = document.getElementById("level-complete-message"), n = document.getElementById("level-complete-time"), i = document.getElementById("level-complete-moves"), s = document.getElementById("level-complete-blocks");
    if (t && e) {
      e.textContent = `Congratulations! You cleared Level ${r}!`;
      let o = no;
      es && $n !== null && (o += performance.now() / 1e3 - $n);
      const a = em(o);
      n && (n.textContent = a), i && (i.textContent = Zs);
      const l = bh(r);
      s && (s.textContent = l), t.style.display = "flex";
    }
  }
  function im() {
    const r = document.getElementById("level-complete-modal");
    r && (r.style.display = "none");
  }
  const vd = document.getElementById("next-level-button");
  vd && vd.addEventListener("click", async () => {
    im(), pn++, gi = [], Zs = 0, tm(), await $s(pn);
  });
  const yd = document.getElementById("restart-level-button");
  yd && yd.addEventListener("click", async () => {
    await RS();
  });
  const Md = document.getElementById("new-game-button");
  Md && Md.addEventListener("click", async () => {
    await PS();
  });
  function io() {
    const r = document.getElementById("spin-counter");
    r && (r.textContent = ts.toString());
    const t = document.getElementById("dice-button");
    t && (ts === 0 ? (t.disabled = true, t.style.opacity = "0.5", t.style.cursor = "not-allowed") : (t.disabled = false, t.style.opacity = "1", t.style.cursor = "pointer"));
  }
  let As = false;
  window.debugMoveMode = false;
  const jo = document.getElementById("debug-move-button");
  jo && jo.addEventListener("click", (r) => {
    r.preventDefault(), r.stopPropagation(), As = !As, window.debugMoveMode = As, jo.textContent = As ? "DEBUG ON" : "DEBUG", jo.style.background = As ? "rgba(255, 0, 0, 0.8)" : "", console.log("Debug move mode:", As ? "ON" : "OFF");
  });
  function LS() {
    if (ts <= 0) {
      console.log("No spins remaining");
      return;
    }
    console.log("spinRandomBlocks called, total blocks:", At.length);
    const r = At.filter((t) => (t.isVertical || t.length === 1 || !t.isVertical && t.length > 1) && !t.isFalling && !t.isRemoved && !t.removalStartTime && !t.isAnimating);
    if (console.log("Eligible blocks found:", r.length), r.length === 0) {
      console.log("No eligible blocks to spin");
      return;
    }
    ts--, io(), r.forEach((t, e) => {
      const s = 1800 + (Math.random() * 2 - 1) * 200, o = e * 20;
      setTimeout(() => {
        try {
          console.log("Spinning block:", {
            isVertical: t.isVertical,
            length: t.length
          }), typeof t.animateRandomSpin == "function" ? t.animateRandomSpin(s) : console.error("Block does not have animateRandomSpin method!", t);
        } catch (a) {
          console.error("Error spinning block:", a);
        }
      }, o);
    });
  }
  function Pc() {
    const r = document.getElementById("dice-button");
    r ? (console.log("Dice button found, attaching handler"), io(), r.addEventListener("click", (t) => {
      t.preventDefault(), t.stopPropagation(), console.log("Dice button clicked!"), LS();
    })) : (console.error("Dice button not found! Retrying..."), setTimeout(Pc, 100));
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Pc) : Pc();
  const Gr = 0.1, Wr = 10;
  window.framingOffsetY = 0.1;
  function Ic() {
    const r = document.getElementById("framing-control"), t = document.getElementById("framing-value-display");
    if (r && t) {
      let d = false, u = 0, f = 0, m = 0, _ = null, g = 0, p = 0, v = 0, x = 0, S = null;
      const P = (D) => {
        t.textContent = D.toFixed(1);
      }, b = (D) => Math.max(Gr, Math.min(Wr, D)), T = (D) => {
        const O = b(window.framingOffsetY + D);
        if (O !== window.framingOffsetY) {
          window.framingOffsetY = O, P(O), ji();
          try {
            localStorage.setItem("jarrows_framing", O.toString());
          } catch (H) {
            console.warn("Failed to save framing preference:", H);
          }
        }
      }, E = () => {
        S !== null && (cancelAnimationFrame(S), S = null);
      }, M = () => {
        if (!d) {
          E(), x = 0, v = 0;
          return;
        }
        v = 0.01 + Math.min(p * 2e-3, 0.3), x = x + (v - x) * 0.15, T(x * (_ === "up" ? -1 : 1)), S = requestAnimationFrame(M);
      }, y = (D) => {
        r.classList.remove("pushing-up", "pushing-down"), D === "up" ? r.classList.add("pushing-up") : D === "down" && r.classList.add("pushing-down");
      }, C = () => {
        r.classList.remove("pushing-up", "pushing-down");
      };
      if (window.framingOffsetY === void 0 || window.framingOffsetY === null) try {
        const D = localStorage.getItem("jarrows_framing");
        if (D !== null) {
          const O = parseFloat(D);
          isNaN(O) || (window.framingOffsetY = b(O));
        }
      } catch (D) {
        console.warn("Failed to load framing preference:", D);
      }
      P(window.framingOffsetY), r.addEventListener("mousedown", (D) => {
        E(), d = true, u = D.clientY, f = D.clientY, m = performance.now(), g = 0, p = 0, v = 0, x = 0, r.style.cursor = "grabbing", D.preventDefault();
      }), document.addEventListener("mousemove", (D) => {
        if (!d) return;
        const O = performance.now(), H = Math.max(1, O - m), z = D.clientY - f, F = D.clientY - u;
        p = Math.abs(F);
        const Y = Math.abs(z) / H;
        if (g = g * 0.7 + Y * (1 - 0.7), Math.abs(F) > 3) {
          const q = F < 0 ? "up" : "down";
          _ !== q && (_ = q, y(q), S === null && M());
        }
        const dt = 0.02 * Math.min(1 + g * 0.5, 5), Et = -z * dt;
        T(Et), f = D.clientY, m = O;
      }), document.addEventListener("mouseup", () => {
        d && (d = false, E(), C(), _ = null, g = 0, p = 0, v = 0, x = 0, r.style.cursor = "ns-resize");
      });
      let N = 0, I = 0, U = 0;
      r.addEventListener("touchstart", (D) => {
        D.touches.length === 1 && (E(), d = true, N = D.touches[0].clientY, I = D.touches[0].clientY, U = performance.now(), g = 0, p = 0, v = 0, x = 0, D.preventDefault());
      }), r.addEventListener("touchmove", (D) => {
        if (!d || D.touches.length !== 1) return;
        const O = D.touches[0].clientY, H = performance.now(), z = Math.max(1, H - U), F = O - I, Y = O - N;
        p = Math.abs(Y);
        const nt = Math.abs(F) / z;
        if (g = g * 0.7 + nt * (1 - 0.7), Math.abs(Y) > 3) {
          const at = Y < 0 ? "up" : "down";
          _ !== at && (_ = at, y(at), S === null && M());
        }
        const Et = 0.02 * Math.min(1 + g * 0.5, 5), q = -F * Et;
        T(q), I = O, U = H, D.preventDefault();
      }), r.addEventListener("touchend", () => {
        d && (d = false, E(), C(), _ = null, g = 0, p = 0, v = 0, x = 0);
      }), r.addEventListener("touchcancel", () => {
        d && (d = false, E(), C(), _ = null, g = 0, p = 0, v = 0, x = 0);
      });
    } else setTimeout(Ic, 100);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ic) : Ic();
  Qp();
  ji();
  pn = 40;
  $s(pn);
  wh();
  window.puzzleSolution = null;
  window.solutionStep = 0;
  function $a() {
    for (const t of At) t.setHighlight && t.setHighlight(false);
    if (!window.puzzleSolution || window.solutionStep >= window.puzzleSolution.length) {
      console.log("\u2713 Solution complete! All blocks cleared.");
      return;
    }
    const r = window.puzzleSolution[window.solutionStep];
    At.includes(r) && !r.isFalling && !r.isRemoved ? (console.log(`\u2192 Step ${window.solutionStep + 1}/${window.puzzleSolution.length}: Highlighting block at (${r.gridX}, ${r.gridZ})`), r.setHighlight(true), console.log("  \u2713 Block highlighted! Look for the bright YELLOW block"), console.log(`  Block properties: length=${r.length}, vertical=${r.isVertical}, dir=(${r.direction.x}, ${r.direction.z})`)) : (console.warn("Block from solution already moved, advancing to next step"), window.solutionStep++, $a());
  }
  const _a = new Hp(), Us = new et();
  function DS(r) {
    if (r.button !== 0) return;
    if (Yi || In) {
      Yi = false, In = false, je = null;
      return;
    }
    if (je) {
      const l = r.clientX - je.x, c = r.clientY - je.y;
      if (Math.sqrt(l * l + c * c) > fa) {
        je = null;
        return;
      }
    }
    je = null, In = false, Yi = false, Us.x = r.clientX / window.innerWidth * 2 - 1, Us.y = -(r.clientY / window.innerHeight) * 2 + 1, _a.setFromCamera(Us, yn);
    const t = [];
    for (const l of At) {
      if (l.isAnimating || l.isFalling) continue;
      const c = _a.intersectObjects(l.cubes, true);
      for (const h of c) t.push({
        intersection: h,
        block: l,
        distance: h.distance
      });
    }
    if (t.length === 0) return;
    t.sort((l, c) => l.distance - c.distance);
    const n = t[0].block, i = document.getElementById("settings-menu");
    if (i && i.classList.remove("show"), window.puzzleSolution && window.solutionStep < window.puzzleSolution.length) {
      const l = window.puzzleSolution[window.solutionStep];
      n === l ? console.log(`\u2713 Correct! Moving block at step ${window.solutionStep + 1}/${window.puzzleSolution.length}`) : (console.warn(`\u2717 Wrong block! Expected block at (${l.gridX}, ${l.gridZ}), clicked (${n.gridX}, ${n.gridZ})`), console.warn("  You can still move it, but it may not match the solution path"));
    }
    const s = Qi(At, ut);
    s.valid || (console.warn("Puzzle structure invalid before move, skipping:", s.reason), console.warn("This may indicate a bug in the movement logic or puzzle generation."));
    const o = n.canMove(At), a = o === "fall";
    if (window.debugMoveMode && window.debugMoveInfo) {
      if (console.group(`\u{1F50D} DEBUG: Block at (${n.gridX}, ${n.gridZ})`), console.log("Block info:", window.debugMoveInfo.block), console.log("Target position:", window.debugMoveInfo.targetPos), console.log("Result:", window.debugMoveInfo.result), window.debugMoveInfo.reason && console.log("Reason:", window.debugMoveInfo.reason), window.debugMoveInfo.blockers.length > 0 && (console.log("Blockers found:", window.debugMoveInfo.blockers), window.debugMoveInfo.blockers.forEach((l, c) => {
        var _a2, _b, _c2, _d2;
        console.log(`  Blocker ${c + 1}:`, {
          position: ((_a2 = l.block) == null ? void 0 : _a2.gridX) !== void 0 ? `(${l.block.gridX}, ${l.block.gridZ})` : "unknown",
          yOffset: (_b = l.block) == null ? void 0 : _b.yOffset,
          isVertical: (_c2 = l.block) == null ? void 0 : _c2.isVertical,
          length: (_d2 = l.block) == null ? void 0 : _d2.length,
          reason: l.reason,
          isHeadOn: l.isHeadOn
        });
      })), window.debugMoveInfo.yRangeChecks.length > 0) {
        const l = window.debugMoveInfo.yRangeChecks.filter((h) => h.overlaps ? h.other.gridX === window.debugMoveInfo.targetPos.x && h.other.gridZ === window.debugMoveInfo.targetPos.z : false);
        l.length > 0 && (console.log("Y-range checks at target position:", l), l.forEach((h) => {
          const d = Math.max(h.thisYRange.bottom, h.otherYRange.bottom), f = Math.min(h.thisYRange.top, h.otherYRange.top) - d;
          console.log(`  Overlap amount: ${f.toFixed(6)} (EPSILON: 0.001)`);
        }));
        const c = window.debugMoveInfo.yRangeChecks.filter((h) => h.overlaps && window.debugMoveInfo.result === "blocked");
        c.length > 0 && console.warn(`\u26A0\uFE0F Total Y-overlaps found: ${c.length} (only blocks at target position matter)`);
      }
      console.groupEnd();
    }
    o === "blocked" && console.log(`Block at (${n.gridX}, ${n.gridZ}) cannot move ${JSON.stringify(n.direction)}: blocked by another block`), nm(n), n.move(At, ut), setTimeout(() => {
      if (!Qi(At, ut).valid) {
        console.warn("Overlap detected after move, attempting to fix...");
        const c = vh(At);
        c.fixed ? console.log(`Fixed ${c.movedBlocks.length} overlapping block(s)`) : console.error("Failed to fix overlaps - manual intervention may be needed");
      }
    }, 100), setTimeout(() => {
      Xr(At), setTimeout(() => {
        Xr(At);
      }, 500);
    }, 400), a && window.puzzleSolution && setTimeout(() => {
      (!At.includes(n) || n.isFalling) && (window.solutionStep++, $a());
    }, 1e3);
  }
  function sm(r, t) {
    if (r.yOffset === 0) return true;
    const e = jn(r);
    for (const n of e) {
      let i = false;
      for (const s of t) {
        if (s === r || s.isFalling || s.isRemoved || s.yOffset >= r.yOffset) continue;
        const o = s.isVertical ? s.length * s.cubeSize : s.cubeSize;
        if (s.yOffset + o < r.yOffset - 0.01) continue;
        const l = jn(s);
        for (const c of l) if (c.x === n.x && c.z === n.z) {
          i = true;
          break;
        }
        if (i) break;
      }
      if (i) return true;
    }
    return false;
  }
  function Xr(r) {
    if (!(Ye || window.supportCheckingEnabled === false)) for (const t of r) t.isFalling || t.isRemoved || t.isAnimating && !t.isFalling || sm(t, r) || (console.log(`Block at (${t.gridX}, ${t.gridZ}) yOffset=${t.yOffset} lost support, starting fall`), rm(t));
  }
  function rm(r) {
    if (r.isFalling || r.isRemoved || r.isAnimating || r.yOffset === 0) return;
    let t = 0;
    const e = jn(r);
    for (const c of e) {
      let h = 0;
      for (const d of At) {
        if (d === r || d.isFalling || d.isRemoved || d.yOffset >= r.yOffset) continue;
        const u = jn(d);
        for (const f of u) if (f.x === c.x && f.z === c.z) {
          const m = d.isVertical ? d.length * d.cubeSize : d.cubeSize, _ = d.yOffset + m;
          _ > h && (h = _);
          break;
        }
      }
      h > t && (t = h);
    }
    if (t >= r.yOffset) return;
    r.isAnimating = true;
    const n = r.yOffset, i = performance.now(), s = n - t, o = Math.max(300, s * 200);
    let a = null;
    const l = () => {
      if (r.isRemoved || !At.includes(r) || Ye) {
        a !== null && (cancelAnimationFrame(a), a = null), r.isAnimating = false;
        return;
      }
      const c = performance.now() - i, h = Math.min(c / o, 1), d = 1 - Math.pow(1 - h, 3), u = n + (t - n) * d;
      r.yOffset = u, r.updateWorldPosition(), h < 1 ? a = requestAnimationFrame(l) : (r.yOffset = t, r.updateWorldPosition(), r.isAnimating = false, a = null, !sm(r, At) && r.yOffset > 0 && setTimeout(() => {
        rm(r);
      }, 50));
    };
    a = requestAnimationFrame(l);
  }
  window.addEventListener("click", (r) => {
  }, {
    capture: true,
    passive: true
  });
  window.addEventListener("touchstart", (r) => {
    if (r.touches.length === 1) {
      const t = r.touches[0];
      En = {
        x: t.clientX,
        y: t.clientY
      }, Th = performance.now();
    }
  }, {
    capture: true,
    passive: true
  });
  window.addEventListener("click", DS);
  let yt = {
    isActive: false,
    touches: [],
    startDistance: 0,
    startCenter: null,
    lastCenter: null,
    isPinching: false,
    isFramingControl: false,
    wasFramingControl: false,
    hadDoubleTouch: false,
    framingStartY: 0,
    framingLastY: 0,
    framingLastTime: 0
  };
  Me.domElement.addEventListener("touchstart", (r) => {
    if (r.preventDefault(), yt.touches = Array.from(r.touches), yt.isActive = true, yt.wasFramingControl = false, yt.hadDoubleTouch = false, yt.touches.length === 1) {
      const t = yt.touches[0];
      yt.lastCenter = {
        x: t.clientX,
        y: t.clientY
      }, En = {
        x: t.clientX,
        y: t.clientY
      }, Th = performance.now(), In = false;
    } else if (yt.touches.length === 2) {
      yt.hadDoubleTouch = true;
      const t = yt.touches[0], e = yt.touches[1], n = e.clientX - t.clientX, i = e.clientY - t.clientY;
      yt.startDistance = Math.sqrt(n * n + i * i), yt.startCenter = {
        x: (t.clientX + e.clientX) / 2,
        y: (t.clientY + e.clientY) / 2
      }, yt.lastCenter = yt.startCenter, yt.isPinching = false, yt.isFramingControl = false, yt.framingStartY = yt.startCenter.y, yt.framingLastY = yt.startCenter.y, yt.framingLastTime = performance.now();
    }
  }, {
    passive: false
  });
  Me.domElement.addEventListener("touchmove", (r) => {
    if (r.preventDefault(), !yt.isActive) return;
    const t = Array.from(r.touches);
    if (t.length === 1 && yt.touches.length === 1) {
      const e = t[0], n = yt.touches[0], i = e.clientX - n.clientX, s = e.clientY - n.clientY;
      qa += i * md, mi -= s * md, mi = Math.max(Jp, Math.min(Kp, mi)), yt.touches = t, En && Math.sqrt(i * i + s * s) > fa && (In = true);
    } else if (t.length === 2 && yt.touches.length === 2) {
      yt.hadDoubleTouch = true;
      const e = t[0], n = t[1], i = n.clientX - e.clientX, s = n.clientY - e.clientY, o = Math.sqrt(i * i + s * s), a = Math.abs(o - yt.startDistance) / yt.startDistance, l = {
        x: (e.clientX + n.clientX) / 2,
        y: (e.clientY + n.clientY) / 2
      }, c = Math.abs(l.y - yt.lastCenter.y), h = Math.abs(l.x - yt.lastCenter.x), d = Math.sqrt(h * h + c * c);
      if (a > 0.05) {
        yt.isPinching || (yt.isPinching = true, yt.isFramingControl = false);
        const u = o / yt.startDistance;
        qn /= u, qn = Math.max(Ya, Math.min(Sh, qn)), yt.startDistance = o, yt.lastCenter = l;
      } else if (c > h && d > 5) {
        yt.isFramingControl || (yt.isFramingControl = true, yt.isPinching = false, yt.framingStartY = l.y, yt.framingLastY = l.y, yt.framingLastTime = performance.now());
        const u = l.y - yt.framingLastY, f = performance.now(), m = Math.max(1, f - yt.framingLastTime), _ = Math.abs(u) / m, g = Math.min(1 + _ * 0.5, 5), p = $p * g, v = u * p;
        if (tn = Math.max(Gr, Math.min(Wr, tn + v)), Yn === null) {
          const x = () => {
            const S = window.framingOffsetY, P = tn - S;
            if (Math.abs(P) > 1e-3) {
              const b = S + P * Zp, T = Math.max(Gr, Math.min(Wr, b));
              window.framingOffsetY = T, ji();
              const E = document.getElementById("framing-value-display");
              E && (E.textContent = T.toFixed(1)), Yn = requestAnimationFrame(x);
            } else {
              window.framingOffsetY = tn, ji();
              const b = document.getElementById("framing-value-display");
              b && (b.textContent = tn.toFixed(1));
              try {
                localStorage.setItem("jarrows_framing", tn.toString());
              } catch (T) {
                console.warn("Failed to save framing preference:", T);
              }
              Yn = null;
            }
          };
          x();
        }
        yt.framingLastY = l.y, yt.framingLastTime = f, yt.lastCenter = l;
      } else yt.lastCenter = l;
      yt.touches = t;
    }
  }, {
    passive: false
  });
  Me.domElement.addEventListener("touchend", (r) => {
    r.preventDefault();
    const t = Array.from(r.touches);
    if (yt.isFramingControl && (yt.wasFramingControl = true), t.length === 0) yt.isActive = false, yt.touches = [], yt.isPinching = false, yt.isFramingControl = false, yt.framingLastTime = 0;
    else if (t.length === 1) {
      yt.touches = t;
      const e = t[0];
      yt.lastCenter = {
        x: e.clientX,
        y: e.clientY
      }, yt.isFramingControl = false, yt.framingLastTime = 0;
    }
  }, {
    passive: false
  });
  let En = null, Th = null;
  const US = 5;
  function NS(r) {
    if (yt.hadDoubleTouch || yt.wasFramingControl || yt.isFramingControl) {
      r.touches.length === 0 && (yt.hadDoubleTouch = false), yt.wasFramingControl = false, En = null;
      return;
    }
    if (r.touches.length > 0 || r.changedTouches.length !== 1) {
      En = null;
      return;
    }
    const t = r.changedTouches[0];
    if (En) {
      const l = t.clientX - En.x, c = t.clientY - En.y, h = Math.sqrt(l * l + c * c), d = performance.now() - Th;
      if (h > US || d > 300) {
        En = null;
        return;
      }
    }
    En = null, Us.x = t.clientX / window.innerWidth * 2 - 1, Us.y = -(t.clientY / window.innerHeight) * 2 + 1, _a.setFromCamera(Us, yn);
    const e = [];
    for (const l of At) {
      if (l.isAnimating || l.isFalling) continue;
      const c = _a.intersectObjects(l.cubes, true);
      for (const h of c) e.push({
        intersection: h,
        block: l,
        distance: h.distance
      });
    }
    if (e.length === 0) return;
    e.sort((l, c) => l.distance - c.distance);
    const i = e[0].block, s = document.getElementById("settings-menu");
    s && s.classList.remove("show");
    const o = Qi(At, ut);
    o.valid || (console.warn("Puzzle structure invalid before move, skipping:", o.reason), console.warn("This may indicate a bug in the movement logic or puzzle generation."));
    const a = i.canMove(At) === "fall";
    nm(i), i.move(At, ut), setTimeout(() => {
      if (!Qi(At, ut).valid) {
        console.warn("Overlap detected after move, attempting to fix...");
        const c = vh(At);
        c.fixed ? console.log(`Fixed ${c.movedBlocks.length} overlapping block(s)`) : console.error("Failed to fix overlaps - manual intervention may be needed");
      }
    }, 100), setTimeout(() => {
      Xr(At), setTimeout(() => {
        Xr(At);
      }, 500);
    }, 400), a && window.puzzleSolution && setTimeout(() => {
      (!At.includes(i) || i.isFalling) && (window.solutionStep++, $a());
    }, 1e3);
  }
  window.addEventListener("touchend", NS, {
    passive: true
  });
  window.addEventListener("resize", () => {
    yn.aspect = window.innerWidth / window.innerHeight, yn.updateProjectionMatrix(), Me.setSize(window.innerWidth, window.innerHeight), !Ye && At.length === 0 && Qp();
  });
  let Sd = performance.now(), zl = false, bd = 0;
  const OS = 200;
  let Fl = 0, Bl = performance.now(), zS = 500;
  const wd = document.getElementById("fps-counter");
  function om() {
    requestAnimationFrame(om);
    const r = performance.now(), t = (r - Sd) / 1e3;
    if (Sd = r, Ln.position.copy(ma.clone().add(ks)), Ln.rotation.set(0, 0, 0), Ye && At.length > 0) {
      const s = new De();
      for (const f of At) f.group.updateMatrixWorld(true), s.expandByObject(f.group);
      const o = s.getSize(new R());
      s.getCenter(new R());
      const a = yn.fov * (Math.PI / 180), l = yn.aspect, c = (o.y + fd) / (2 * Math.tan(a / 2)), d = (Math.sqrt(o.x * o.x + o.z * o.z) + fd) / (2 * Math.tan(a / 2) * l), u = Math.max(c, d) * SS;
      qn = Math.max(Ya, Math.min(Sh, u));
    }
    const e = Ye ? 0.25 : 0.04;
    if (Ls += (qn - Ls) * e, Ds += (qa - Ds) * e, qi += (mi - qi) * e, ji(), bS(vS, Ds, qi, ma.clone().add(ks)), wh(), Fl++, r - Bl >= zS) {
      const s = Math.round(Fl * 1e3 / (r - Bl));
      wd && (wd.textContent = `FPS: ${s}`);
      const o = document.getElementById("block-value");
      o && (o.textContent = At.length), Fl = 0, Bl = r;
    }
    zl = false;
    const n = At.some((s) => s.isFalling && s.physicsBody), i = At.some((s) => s.isFalling);
    if (!zl && (n || gm() || i) && (_m(We), zl = true), !dr() && !vm()) {
      const s = At.filter((o) => !o.isRemoved && o.isFalling);
      for (const o of s) o.updateFromPhysics();
      for (const o of At) o.updateHighlightAnimation && o.updateHighlightAnimation(t);
      for (const o of At) if (o.updateMeltAnimation && o.removalStartTime && !o.isRemoved) try {
        o.updateMeltAnimation(t);
      } catch (a) {
        console.error("Error updating melt animation:", a, o);
      }
      r - bd > OS && (bd = r, Xr(At));
      for (let o = At.length - 1; o >= 0; o--) {
        const a = At[o];
        a.isRemoved && (a.group.parent && a.group.parent.remove(a.group), a.physicsBody && a.physicsBody.body && xm(async () => {
          const { removePhysicsBody: l } = await import("./physics-D0uT6tGR.js").then(async (m) => {
            await m.__tla;
            return m;
          }).then((c) => c.p);
          return {
            removePhysicsBody: l
          };
        }, []).then(({ removePhysicsBody: l }) => {
          l(We, a.physicsBody.body);
        }), window.puzzleSolution && window.solutionStep < window.puzzleSolution.length && (window.solutionStep++, setTimeout(() => {
          $a();
        }, 100)), gi = gi.filter((l) => l.block !== a), At.splice(o, 1));
      }
      At.length === 0 && pn >= 0 && !Ye && !ga && (ga = true, ES(), tm(), IS(pn));
    }
    Me.render(qt, yn);
  }
  window.testBlockCounts = async function(r = 5) {
    console.log("\u{1F9EA} Testing block counts for levels 0-" + r), console.log("=".repeat(60));
    const t = [];
    for (let i = 0; i <= r; i++) {
      const s = bh(i);
      console.log(`
\u{1F4CA} Level ${i}: Target = ${s}`), await $s(i), await new Promise((l) => setTimeout(l, 500));
      const o = At.length, a = o === s;
      t.push({
        level: i,
        target: s,
        actual: o,
        match: a,
        difference: s - o
      }), a ? console.log(`\u2705 Level ${i}: PASS (${o} blocks)`) : console.error(`\u274C Level ${i}: FAIL - Expected ${s}, got ${o} (difference: ${s - o})`);
    }
    console.log(`
` + "=".repeat(60)), console.log("\u{1F4CB} SUMMARY:");
    const e = t.filter((i) => i.match).length, n = t.filter((i) => !i.match).length;
    return console.log(`\u2705 Passed: ${e}/${t.length}`), console.log(`\u274C Failed: ${n}/${t.length}`), n > 0 && (console.log(`
\u274C Failed levels:`), t.filter((i) => !i.match).forEach((i) => {
      console.log(`  Level ${i.level}: Expected ${i.target}, got ${i.actual} (diff: ${i.difference})`);
    })), t;
  };
  om();
});
