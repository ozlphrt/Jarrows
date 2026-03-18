const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/main-DCELqU_k.js","assets/preload-helper-Dwn842R7.js","assets/physics-BrNl21H6.js"])))=>i.map(i=>d[i]);
import { _ as Zt } from "./preload-helper-Dwn842R7.js";
(async () => {
  (function() {
    const t = document.createElement("link").relList;
    if (t && t.supports && t.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
    new MutationObserver((o) => {
      for (const r of o) if (r.type === "childList") for (const s of r.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && n(s);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function i(o) {
      const r = {};
      return o.integrity && (r.integrity = o.integrity), o.referrerPolicy && (r.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? r.credentials = "include" : o.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
    }
    function n(o) {
      if (o.ep) return;
      o.ep = true;
      const r = i(o);
      fetch(o.href, r);
    }
  })();
  var G = {}, Wt = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }, kt = {}, S = {};
  let Bt;
  const Xt = [
    0,
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ];
  S.getSymbolSize = function(t) {
    if (!t) throw new Error('"version" cannot be null or undefined');
    if (t < 1 || t > 40) throw new Error('"version" should be in range from 1 to 40');
    return t * 4 + 17;
  };
  S.getSymbolTotalCodewords = function(t) {
    return Xt[t];
  };
  S.getBCHDigit = function(e) {
    let t = 0;
    for (; e !== 0; ) t++, e >>>= 1;
    return t;
  };
  S.setToSJISFunction = function(t) {
    if (typeof t != "function") throw new Error('"toSJISFunc" is not a valid function.');
    Bt = t;
  };
  S.isKanjiModeEnabled = function() {
    return typeof Bt < "u";
  };
  S.toSJIS = function(t) {
    return Bt(t);
  };
  var rt = {};
  (function(e) {
    e.L = {
      bit: 1
    }, e.M = {
      bit: 0
    }, e.Q = {
      bit: 3
    }, e.H = {
      bit: 2
    };
    function t(i) {
      if (typeof i != "string") throw new Error("Param is not a string");
      switch (i.toLowerCase()) {
        case "l":
        case "low":
          return e.L;
        case "m":
        case "medium":
          return e.M;
        case "q":
        case "quartile":
          return e.Q;
        case "h":
        case "high":
          return e.H;
        default:
          throw new Error("Unknown EC Level: " + i);
      }
    }
    e.isValid = function(n) {
      return n && typeof n.bit < "u" && n.bit >= 0 && n.bit < 4;
    }, e.from = function(n, o) {
      if (e.isValid(n)) return n;
      try {
        return t(n);
      } catch {
        return o;
      }
    };
  })(rt);
  function Rt() {
    this.buffer = [], this.length = 0;
  }
  Rt.prototype = {
    get: function(e) {
      const t = Math.floor(e / 8);
      return (this.buffer[t] >>> 7 - e % 8 & 1) === 1;
    },
    put: function(e, t) {
      for (let i = 0; i < t; i++) this.putBit((e >>> t - i - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(e) {
      const t = Math.floor(this.length / 8);
      this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++;
    }
  };
  var $t = Rt;
  function Z(e) {
    if (!e || e < 1) throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = e, this.data = new Uint8Array(e * e), this.reservedBit = new Uint8Array(e * e);
  }
  Z.prototype.set = function(e, t, i, n) {
    const o = e * this.size + t;
    this.data[o] = i, n && (this.reservedBit[o] = true);
  };
  Z.prototype.get = function(e, t) {
    return this.data[e * this.size + t];
  };
  Z.prototype.xor = function(e, t, i) {
    this.data[e * this.size + t] ^= i;
  };
  Z.prototype.isReserved = function(e, t) {
    return this.reservedBit[e * this.size + t];
  };
  var te = Z, _t = {};
  (function(e) {
    const t = S.getSymbolSize;
    e.getRowColCoords = function(n) {
      if (n === 1) return [];
      const o = Math.floor(n / 7) + 2, r = t(n), s = r === 145 ? 26 : Math.ceil((r - 13) / (2 * o - 2)) * 2, a = [
        r - 7
      ];
      for (let l = 1; l < o - 1; l++) a[l] = a[l - 1] - s;
      return a.push(6), a.reverse();
    }, e.getPositions = function(n) {
      const o = [], r = e.getRowColCoords(n), s = r.length;
      for (let a = 0; a < s; a++) for (let l = 0; l < s; l++) a === 0 && l === 0 || a === 0 && l === s - 1 || a === s - 1 && l === 0 || o.push([
        r[a],
        r[l]
      ]);
      return o;
    };
  })(_t);
  var Dt = {};
  const ee = S.getSymbolSize, vt = 7;
  Dt.getPositions = function(t) {
    const i = ee(t);
    return [
      [
        0,
        0
      ],
      [
        i - vt,
        0
      ],
      [
        0,
        i - vt
      ]
    ];
  };
  var Ft = {};
  (function(e) {
    e.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    const t = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    e.isValid = function(o) {
      return o != null && o !== "" && !isNaN(o) && o >= 0 && o <= 7;
    }, e.from = function(o) {
      return e.isValid(o) ? parseInt(o, 10) : void 0;
    }, e.getPenaltyN1 = function(o) {
      const r = o.size;
      let s = 0, a = 0, l = 0, u = null, c = null;
      for (let B = 0; B < r; B++) {
        a = l = 0, u = c = null;
        for (let w = 0; w < r; w++) {
          let f = o.get(B, w);
          f === u ? a++ : (a >= 5 && (s += t.N1 + (a - 5)), u = f, a = 1), f = o.get(w, B), f === c ? l++ : (l >= 5 && (s += t.N1 + (l - 5)), c = f, l = 1);
        }
        a >= 5 && (s += t.N1 + (a - 5)), l >= 5 && (s += t.N1 + (l - 5));
      }
      return s;
    }, e.getPenaltyN2 = function(o) {
      const r = o.size;
      let s = 0;
      for (let a = 0; a < r - 1; a++) for (let l = 0; l < r - 1; l++) {
        const u = o.get(a, l) + o.get(a, l + 1) + o.get(a + 1, l) + o.get(a + 1, l + 1);
        (u === 4 || u === 0) && s++;
      }
      return s * t.N2;
    }, e.getPenaltyN3 = function(o) {
      const r = o.size;
      let s = 0, a = 0, l = 0;
      for (let u = 0; u < r; u++) {
        a = l = 0;
        for (let c = 0; c < r; c++) a = a << 1 & 2047 | o.get(u, c), c >= 10 && (a === 1488 || a === 93) && s++, l = l << 1 & 2047 | o.get(c, u), c >= 10 && (l === 1488 || l === 93) && s++;
      }
      return s * t.N3;
    }, e.getPenaltyN4 = function(o) {
      let r = 0;
      const s = o.data.length;
      for (let l = 0; l < s; l++) r += o.data[l];
      return Math.abs(Math.ceil(r * 100 / s / 5) - 10) * t.N4;
    };
    function i(n, o, r) {
      switch (n) {
        case e.Patterns.PATTERN000:
          return (o + r) % 2 === 0;
        case e.Patterns.PATTERN001:
          return o % 2 === 0;
        case e.Patterns.PATTERN010:
          return r % 3 === 0;
        case e.Patterns.PATTERN011:
          return (o + r) % 3 === 0;
        case e.Patterns.PATTERN100:
          return (Math.floor(o / 2) + Math.floor(r / 3)) % 2 === 0;
        case e.Patterns.PATTERN101:
          return o * r % 2 + o * r % 3 === 0;
        case e.Patterns.PATTERN110:
          return (o * r % 2 + o * r % 3) % 2 === 0;
        case e.Patterns.PATTERN111:
          return (o * r % 3 + (o + r) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + n);
      }
    }
    e.applyMask = function(o, r) {
      const s = r.size;
      for (let a = 0; a < s; a++) for (let l = 0; l < s; l++) r.isReserved(l, a) || r.xor(l, a, i(o, l, a));
    }, e.getBestMask = function(o, r) {
      const s = Object.keys(e.Patterns).length;
      let a = 0, l = 1 / 0;
      for (let u = 0; u < s; u++) {
        r(u), e.applyMask(u, o);
        const c = e.getPenaltyN1(o) + e.getPenaltyN2(o) + e.getPenaltyN3(o) + e.getPenaltyN4(o);
        e.applyMask(u, o), c < l && (l = c, a = u);
      }
      return a;
    };
  })(Ft);
  var it = {};
  const F = rt, X = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    1,
    2,
    2,
    4,
    1,
    2,
    4,
    4,
    2,
    4,
    4,
    4,
    2,
    4,
    6,
    5,
    2,
    4,
    6,
    6,
    2,
    5,
    8,
    8,
    4,
    5,
    8,
    8,
    4,
    5,
    8,
    11,
    4,
    8,
    10,
    11,
    4,
    9,
    12,
    16,
    4,
    9,
    16,
    16,
    6,
    10,
    12,
    18,
    6,
    10,
    17,
    16,
    6,
    11,
    16,
    19,
    6,
    13,
    18,
    21,
    7,
    14,
    21,
    25,
    8,
    16,
    20,
    25,
    8,
    17,
    23,
    25,
    9,
    17,
    23,
    34,
    9,
    18,
    25,
    30,
    10,
    20,
    27,
    32,
    12,
    21,
    29,
    35,
    12,
    23,
    34,
    37,
    12,
    25,
    34,
    40,
    13,
    26,
    35,
    42,
    14,
    28,
    38,
    45,
    15,
    29,
    40,
    48,
    16,
    31,
    43,
    51,
    17,
    33,
    45,
    54,
    18,
    35,
    48,
    57,
    19,
    37,
    51,
    60,
    19,
    38,
    53,
    63,
    20,
    40,
    56,
    66,
    21,
    43,
    59,
    70,
    22,
    45,
    62,
    74,
    24,
    47,
    65,
    77,
    25,
    49,
    68,
    81
  ], $ = [
    7,
    10,
    13,
    17,
    10,
    16,
    22,
    28,
    15,
    26,
    36,
    44,
    20,
    36,
    52,
    64,
    26,
    48,
    72,
    88,
    36,
    64,
    96,
    112,
    40,
    72,
    108,
    130,
    48,
    88,
    132,
    156,
    60,
    110,
    160,
    192,
    72,
    130,
    192,
    224,
    80,
    150,
    224,
    264,
    96,
    176,
    260,
    308,
    104,
    198,
    288,
    352,
    120,
    216,
    320,
    384,
    132,
    240,
    360,
    432,
    144,
    280,
    408,
    480,
    168,
    308,
    448,
    532,
    180,
    338,
    504,
    588,
    196,
    364,
    546,
    650,
    224,
    416,
    600,
    700,
    224,
    442,
    644,
    750,
    252,
    476,
    690,
    816,
    270,
    504,
    750,
    900,
    300,
    560,
    810,
    960,
    312,
    588,
    870,
    1050,
    336,
    644,
    952,
    1110,
    360,
    700,
    1020,
    1200,
    390,
    728,
    1050,
    1260,
    420,
    784,
    1140,
    1350,
    450,
    812,
    1200,
    1440,
    480,
    868,
    1290,
    1530,
    510,
    924,
    1350,
    1620,
    540,
    980,
    1440,
    1710,
    570,
    1036,
    1530,
    1800,
    570,
    1064,
    1590,
    1890,
    600,
    1120,
    1680,
    1980,
    630,
    1204,
    1770,
    2100,
    660,
    1260,
    1860,
    2220,
    720,
    1316,
    1950,
    2310,
    750,
    1372,
    2040,
    2430
  ];
  it.getBlocksCount = function(t, i) {
    switch (i) {
      case F.L:
        return X[(t - 1) * 4 + 0];
      case F.M:
        return X[(t - 1) * 4 + 1];
      case F.Q:
        return X[(t - 1) * 4 + 2];
      case F.H:
        return X[(t - 1) * 4 + 3];
      default:
        return;
    }
  };
  it.getTotalCodewordsCount = function(t, i) {
    switch (i) {
      case F.L:
        return $[(t - 1) * 4 + 0];
      case F.M:
        return $[(t - 1) * 4 + 1];
      case F.Q:
        return $[(t - 1) * 4 + 2];
      case F.H:
        return $[(t - 1) * 4 + 3];
      default:
        return;
    }
  };
  var Ut = {}, st = {};
  const J = new Uint8Array(512), et = new Uint8Array(256);
  (function() {
    let t = 1;
    for (let i = 0; i < 255; i++) J[i] = t, et[t] = i, t <<= 1, t & 256 && (t ^= 285);
    for (let i = 255; i < 512; i++) J[i] = J[i - 255];
  })();
  st.log = function(t) {
    if (t < 1) throw new Error("log(" + t + ")");
    return et[t];
  };
  st.exp = function(t) {
    return J[t];
  };
  st.mul = function(t, i) {
    return t === 0 || i === 0 ? 0 : J[et[t] + et[i]];
  };
  (function(e) {
    const t = st;
    e.mul = function(n, o) {
      const r = new Uint8Array(n.length + o.length - 1);
      for (let s = 0; s < n.length; s++) for (let a = 0; a < o.length; a++) r[s + a] ^= t.mul(n[s], o[a]);
      return r;
    }, e.mod = function(n, o) {
      let r = new Uint8Array(n);
      for (; r.length - o.length >= 0; ) {
        const s = r[0];
        for (let l = 0; l < o.length; l++) r[l] ^= t.mul(o[l], s);
        let a = 0;
        for (; a < r.length && r[a] === 0; ) a++;
        r = r.slice(a);
      }
      return r;
    }, e.generateECPolynomial = function(n) {
      let o = new Uint8Array([
        1
      ]);
      for (let r = 0; r < n; r++) o = e.mul(o, new Uint8Array([
        1,
        t.exp(r)
      ]));
      return o;
    };
  })(Ut);
  const xt = Ut;
  function It(e) {
    this.genPoly = void 0, this.degree = e, this.degree && this.initialize(this.degree);
  }
  It.prototype.initialize = function(t) {
    this.degree = t, this.genPoly = xt.generateECPolynomial(this.degree);
  };
  It.prototype.encode = function(t) {
    if (!this.genPoly) throw new Error("Encoder not initialized");
    const i = new Uint8Array(t.length + this.degree);
    i.set(t);
    const n = xt.mod(i, this.genPoly), o = this.degree - n.length;
    if (o > 0) {
      const r = new Uint8Array(this.degree);
      return r.set(n, o), r;
    }
    return n;
  };
  var ne = It, zt = {}, x = {}, bt = {};
  bt.isValid = function(t) {
    return !isNaN(t) && t >= 1 && t <= 40;
  };
  var R = {};
  const Ht = "[0-9]+", oe = "[A-Z $%*+\\-./:]+";
  let Q = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  Q = Q.replace(/u/g, "\\u");
  const re = "(?:(?![A-Z0-9 $%*+\\-./:]|" + Q + `)(?:.|[\r
]))+`;
  R.KANJI = new RegExp(Q, "g");
  R.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  R.BYTE = new RegExp(re, "g");
  R.NUMERIC = new RegExp(Ht, "g");
  R.ALPHANUMERIC = new RegExp(oe, "g");
  const ie = new RegExp("^" + Q + "$"), se = new RegExp("^" + Ht + "$"), le = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  R.testKanji = function(t) {
    return ie.test(t);
  };
  R.testNumeric = function(t) {
    return se.test(t);
  };
  R.testAlphanumeric = function(t) {
    return le.test(t);
  };
  (function(e) {
    const t = bt, i = R;
    e.NUMERIC = {
      id: "Numeric",
      bit: 1,
      ccBits: [
        10,
        12,
        14
      ]
    }, e.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 2,
      ccBits: [
        9,
        11,
        13
      ]
    }, e.BYTE = {
      id: "Byte",
      bit: 4,
      ccBits: [
        8,
        16,
        16
      ]
    }, e.KANJI = {
      id: "Kanji",
      bit: 8,
      ccBits: [
        8,
        10,
        12
      ]
    }, e.MIXED = {
      bit: -1
    }, e.getCharCountIndicator = function(r, s) {
      if (!r.ccBits) throw new Error("Invalid mode: " + r);
      if (!t.isValid(s)) throw new Error("Invalid version: " + s);
      return s >= 1 && s < 10 ? r.ccBits[0] : s < 27 ? r.ccBits[1] : r.ccBits[2];
    }, e.getBestModeForData = function(r) {
      return i.testNumeric(r) ? e.NUMERIC : i.testAlphanumeric(r) ? e.ALPHANUMERIC : i.testKanji(r) ? e.KANJI : e.BYTE;
    }, e.toString = function(r) {
      if (r && r.id) return r.id;
      throw new Error("Invalid mode");
    }, e.isValid = function(r) {
      return r && r.bit && r.ccBits;
    };
    function n(o) {
      if (typeof o != "string") throw new Error("Param is not a string");
      switch (o.toLowerCase()) {
        case "numeric":
          return e.NUMERIC;
        case "alphanumeric":
          return e.ALPHANUMERIC;
        case "kanji":
          return e.KANJI;
        case "byte":
          return e.BYTE;
        default:
          throw new Error("Unknown mode: " + o);
      }
    }
    e.from = function(r, s) {
      if (e.isValid(r)) return r;
      try {
        return n(r);
      } catch {
        return s;
      }
    };
  })(x);
  (function(e) {
    const t = S, i = it, n = rt, o = x, r = bt, s = 7973, a = t.getBCHDigit(s);
    function l(w, f, p) {
      for (let y = 1; y <= 40; y++) if (f <= e.getCapacity(y, p, w)) return y;
    }
    function u(w, f) {
      return o.getCharCountIndicator(w, f) + 4;
    }
    function c(w, f) {
      let p = 0;
      return w.forEach(function(y) {
        const T = u(y.mode, f);
        p += T + y.getBitsLength();
      }), p;
    }
    function B(w, f) {
      for (let p = 1; p <= 40; p++) if (c(w, p) <= e.getCapacity(p, f, o.MIXED)) return p;
    }
    e.from = function(f, p) {
      return r.isValid(f) ? parseInt(f, 10) : p;
    }, e.getCapacity = function(f, p, y) {
      if (!r.isValid(f)) throw new Error("Invalid QR Code version");
      typeof y > "u" && (y = o.BYTE);
      const T = t.getSymbolTotalCodewords(f), m = i.getTotalCodewordsCount(f, p), E = (T - m) * 8;
      if (y === o.MIXED) return E;
      const g = E - u(y, f);
      switch (y) {
        case o.NUMERIC:
          return Math.floor(g / 10 * 3);
        case o.ALPHANUMERIC:
          return Math.floor(g / 11 * 2);
        case o.KANJI:
          return Math.floor(g / 13);
        case o.BYTE:
        default:
          return Math.floor(g / 8);
      }
    }, e.getBestVersionForData = function(f, p) {
      let y;
      const T = n.from(p, n.M);
      if (Array.isArray(f)) {
        if (f.length > 1) return B(f, T);
        if (f.length === 0) return 1;
        y = f[0];
      } else y = f;
      return l(y.mode, y.getLength(), T);
    }, e.getEncodedBits = function(f) {
      if (!r.isValid(f) || f < 7) throw new Error("Invalid QR Code version");
      let p = f << 12;
      for (; t.getBCHDigit(p) - a >= 0; ) p ^= s << t.getBCHDigit(p) - a;
      return f << 12 | p;
    };
  })(zt);
  var Vt = {};
  const mt = S, Ot = 1335, ae = 21522, St = mt.getBCHDigit(Ot);
  Vt.getEncodedBits = function(t, i) {
    const n = t.bit << 3 | i;
    let o = n << 10;
    for (; mt.getBCHDigit(o) - St >= 0; ) o ^= Ot << mt.getBCHDigit(o) - St;
    return (n << 10 | o) ^ ae;
  };
  var jt = {};
  const ce = x;
  function O(e) {
    this.mode = ce.NUMERIC, this.data = e.toString();
  }
  O.getBitsLength = function(t) {
    return 10 * Math.floor(t / 3) + (t % 3 ? t % 3 * 3 + 1 : 0);
  };
  O.prototype.getLength = function() {
    return this.data.length;
  };
  O.prototype.getBitsLength = function() {
    return O.getBitsLength(this.data.length);
  };
  O.prototype.write = function(t) {
    let i, n, o;
    for (i = 0; i + 3 <= this.data.length; i += 3) n = this.data.substr(i, 3), o = parseInt(n, 10), t.put(o, 10);
    const r = this.data.length - i;
    r > 0 && (n = this.data.substr(i), o = parseInt(n, 10), t.put(o, r * 3 + 1));
  };
  var ue = O;
  const de = x, ct = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
    "$",
    "%",
    "*",
    "+",
    "-",
    ".",
    "/",
    ":"
  ];
  function j(e) {
    this.mode = de.ALPHANUMERIC, this.data = e;
  }
  j.getBitsLength = function(t) {
    return 11 * Math.floor(t / 2) + 6 * (t % 2);
  };
  j.prototype.getLength = function() {
    return this.data.length;
  };
  j.prototype.getBitsLength = function() {
    return j.getBitsLength(this.data.length);
  };
  j.prototype.write = function(t) {
    let i;
    for (i = 0; i + 2 <= this.data.length; i += 2) {
      let n = ct.indexOf(this.data[i]) * 45;
      n += ct.indexOf(this.data[i + 1]), t.put(n, 11);
    }
    this.data.length % 2 && t.put(ct.indexOf(this.data[i]), 6);
  };
  var fe = j;
  const ge = x;
  function K(e) {
    this.mode = ge.BYTE, typeof e == "string" ? this.data = new TextEncoder().encode(e) : this.data = new Uint8Array(e);
  }
  K.getBitsLength = function(t) {
    return t * 8;
  };
  K.prototype.getLength = function() {
    return this.data.length;
  };
  K.prototype.getBitsLength = function() {
    return K.getBitsLength(this.data.length);
  };
  K.prototype.write = function(e) {
    for (let t = 0, i = this.data.length; t < i; t++) e.put(this.data[t], 8);
  };
  var he = K;
  const me = x, we = S;
  function q(e) {
    this.mode = me.KANJI, this.data = e;
  }
  q.getBitsLength = function(t) {
    return t * 13;
  };
  q.prototype.getLength = function() {
    return this.data.length;
  };
  q.prototype.getBitsLength = function() {
    return q.getBitsLength(this.data.length);
  };
  q.prototype.write = function(e) {
    let t;
    for (t = 0; t < this.data.length; t++) {
      let i = we.toSJIS(this.data[t]);
      if (i >= 33088 && i <= 40956) i -= 33088;
      else if (i >= 57408 && i <= 60351) i -= 49472;
      else throw new Error("Invalid SJIS character: " + this.data[t] + `
Make sure your charset is UTF-8`);
      i = (i >>> 8 & 255) * 192 + (i & 255), e.put(i, 13);
    }
  };
  var pe = q, Kt = {
    exports: {}
  };
  (function(e) {
    var t = {
      single_source_shortest_paths: function(i, n, o) {
        var r = {}, s = {};
        s[n] = 0;
        var a = t.PriorityQueue.make();
        a.push(n, 0);
        for (var l, u, c, B, w, f, p, y, T; !a.empty(); ) {
          l = a.pop(), u = l.value, B = l.cost, w = i[u] || {};
          for (c in w) w.hasOwnProperty(c) && (f = w[c], p = B + f, y = s[c], T = typeof s[c] > "u", (T || y > p) && (s[c] = p, a.push(c, p), r[c] = u));
        }
        if (typeof o < "u" && typeof s[o] > "u") {
          var m = [
            "Could not find a path from ",
            n,
            " to ",
            o,
            "."
          ].join("");
          throw new Error(m);
        }
        return r;
      },
      extract_shortest_path_from_predecessor_list: function(i, n) {
        for (var o = [], r = n; r; ) o.push(r), i[r], r = i[r];
        return o.reverse(), o;
      },
      find_path: function(i, n, o) {
        var r = t.single_source_shortest_paths(i, n, o);
        return t.extract_shortest_path_from_predecessor_list(r, o);
      },
      PriorityQueue: {
        make: function(i) {
          var n = t.PriorityQueue, o = {}, r;
          i = i || {};
          for (r in n) n.hasOwnProperty(r) && (o[r] = n[r]);
          return o.queue = [], o.sorter = i.sorter || n.default_sorter, o;
        },
        default_sorter: function(i, n) {
          return i.cost - n.cost;
        },
        push: function(i, n) {
          var o = {
            value: i,
            cost: n
          };
          this.queue.push(o), this.queue.sort(this.sorter);
        },
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    e.exports = t;
  })(Kt);
  var ye = Kt.exports;
  (function(e) {
    const t = x, i = ue, n = fe, o = he, r = pe, s = R, a = S, l = ye;
    function u(m) {
      return unescape(encodeURIComponent(m)).length;
    }
    function c(m, E, g) {
      const h = [];
      let C;
      for (; (C = m.exec(g)) !== null; ) h.push({
        data: C[0],
        index: C.index,
        mode: E,
        length: C[0].length
      });
      return h;
    }
    function B(m) {
      const E = c(s.NUMERIC, t.NUMERIC, m), g = c(s.ALPHANUMERIC, t.ALPHANUMERIC, m);
      let h, C;
      return a.isKanjiModeEnabled() ? (h = c(s.BYTE, t.BYTE, m), C = c(s.KANJI, t.KANJI, m)) : (h = c(s.BYTE_KANJI, t.BYTE, m), C = []), E.concat(g, h, C).sort(function(b, v) {
        return b.index - v.index;
      }).map(function(b) {
        return {
          data: b.data,
          mode: b.mode,
          length: b.length
        };
      });
    }
    function w(m, E) {
      switch (E) {
        case t.NUMERIC:
          return i.getBitsLength(m);
        case t.ALPHANUMERIC:
          return n.getBitsLength(m);
        case t.KANJI:
          return r.getBitsLength(m);
        case t.BYTE:
          return o.getBitsLength(m);
      }
    }
    function f(m) {
      return m.reduce(function(E, g) {
        const h = E.length - 1 >= 0 ? E[E.length - 1] : null;
        return h && h.mode === g.mode ? (E[E.length - 1].data += g.data, E) : (E.push(g), E);
      }, []);
    }
    function p(m) {
      const E = [];
      for (let g = 0; g < m.length; g++) {
        const h = m[g];
        switch (h.mode) {
          case t.NUMERIC:
            E.push([
              h,
              {
                data: h.data,
                mode: t.ALPHANUMERIC,
                length: h.length
              },
              {
                data: h.data,
                mode: t.BYTE,
                length: h.length
              }
            ]);
            break;
          case t.ALPHANUMERIC:
            E.push([
              h,
              {
                data: h.data,
                mode: t.BYTE,
                length: h.length
              }
            ]);
            break;
          case t.KANJI:
            E.push([
              h,
              {
                data: h.data,
                mode: t.BYTE,
                length: u(h.data)
              }
            ]);
            break;
          case t.BYTE:
            E.push([
              {
                data: h.data,
                mode: t.BYTE,
                length: u(h.data)
              }
            ]);
        }
      }
      return E;
    }
    function y(m, E) {
      const g = {}, h = {
        start: {}
      };
      let C = [
        "start"
      ];
      for (let I = 0; I < m.length; I++) {
        const b = m[I], v = [];
        for (let k = 0; k < b.length; k++) {
          const M = b[k], z = "" + I + k;
          v.push(z), g[z] = {
            node: M,
            lastCount: 0
          }, h[z] = {};
          for (let _ = 0; _ < C.length; _++) {
            const P = C[_];
            g[P] && g[P].node.mode === M.mode ? (h[P][z] = w(g[P].lastCount + M.length, M.mode) - w(g[P].lastCount, M.mode), g[P].lastCount += M.length) : (g[P] && (g[P].lastCount = M.length), h[P][z] = w(M.length, M.mode) + 4 + t.getCharCountIndicator(M.mode, E));
          }
        }
        C = v;
      }
      for (let I = 0; I < C.length; I++) h[C[I]].end = 0;
      return {
        map: h,
        table: g
      };
    }
    function T(m, E) {
      let g;
      const h = t.getBestModeForData(m);
      if (g = t.from(E, h), g !== t.BYTE && g.bit < h.bit) throw new Error('"' + m + '" cannot be encoded with mode ' + t.toString(g) + `.
 Suggested mode is: ` + t.toString(h));
      switch (g === t.KANJI && !a.isKanjiModeEnabled() && (g = t.BYTE), g) {
        case t.NUMERIC:
          return new i(m);
        case t.ALPHANUMERIC:
          return new n(m);
        case t.KANJI:
          return new r(m);
        case t.BYTE:
          return new o(m);
      }
    }
    e.fromArray = function(E) {
      return E.reduce(function(g, h) {
        return typeof h == "string" ? g.push(T(h, null)) : h.data && g.push(T(h.data, h.mode)), g;
      }, []);
    }, e.fromString = function(E, g) {
      const h = B(E, a.isKanjiModeEnabled()), C = p(h), I = y(C, g), b = l.find_path(I.map, "start", "end"), v = [];
      for (let k = 1; k < b.length - 1; k++) v.push(I.table[b[k]].node);
      return e.fromArray(f(v));
    }, e.rawSplit = function(E) {
      return e.fromArray(B(E, a.isKanjiModeEnabled()));
    };
  })(jt);
  const lt = S, ut = rt, Ee = $t, Ce = te, Be = _t, Ie = Dt, wt = Ft, pt = it, be = ne, nt = zt, Te = Vt, Ae = x, dt = jt;
  function Le(e, t) {
    const i = e.size, n = Ie.getPositions(t);
    for (let o = 0; o < n.length; o++) {
      const r = n[o][0], s = n[o][1];
      for (let a = -1; a <= 7; a++) if (!(r + a <= -1 || i <= r + a)) for (let l = -1; l <= 7; l++) s + l <= -1 || i <= s + l || (a >= 0 && a <= 6 && (l === 0 || l === 6) || l >= 0 && l <= 6 && (a === 0 || a === 6) || a >= 2 && a <= 4 && l >= 2 && l <= 4 ? e.set(r + a, s + l, true, true) : e.set(r + a, s + l, false, true));
    }
  }
  function ve(e) {
    const t = e.size;
    for (let i = 8; i < t - 8; i++) {
      const n = i % 2 === 0;
      e.set(i, 6, n, true), e.set(6, i, n, true);
    }
  }
  function Se(e, t) {
    const i = Be.getPositions(t);
    for (let n = 0; n < i.length; n++) {
      const o = i[n][0], r = i[n][1];
      for (let s = -2; s <= 2; s++) for (let a = -2; a <= 2; a++) s === -2 || s === 2 || a === -2 || a === 2 || s === 0 && a === 0 ? e.set(o + s, r + a, true, true) : e.set(o + s, r + a, false, true);
    }
  }
  function Me(e, t) {
    const i = e.size, n = nt.getEncodedBits(t);
    let o, r, s;
    for (let a = 0; a < 18; a++) o = Math.floor(a / 3), r = a % 3 + i - 8 - 3, s = (n >> a & 1) === 1, e.set(o, r, s, true), e.set(r, o, s, true);
  }
  function ft(e, t, i) {
    const n = e.size, o = Te.getEncodedBits(t, i);
    let r, s;
    for (r = 0; r < 15; r++) s = (o >> r & 1) === 1, r < 6 ? e.set(r, 8, s, true) : r < 8 ? e.set(r + 1, 8, s, true) : e.set(n - 15 + r, 8, s, true), r < 8 ? e.set(8, n - r - 1, s, true) : r < 9 ? e.set(8, 15 - r - 1 + 1, s, true) : e.set(8, 15 - r - 1, s, true);
    e.set(n - 8, 8, 1, true);
  }
  function Pe(e, t) {
    const i = e.size;
    let n = -1, o = i - 1, r = 7, s = 0;
    for (let a = i - 1; a > 0; a -= 2) for (a === 6 && a--; ; ) {
      for (let l = 0; l < 2; l++) if (!e.isReserved(o, a - l)) {
        let u = false;
        s < t.length && (u = (t[s] >>> r & 1) === 1), e.set(o, a - l, u), r--, r === -1 && (s++, r = 7);
      }
      if (o += n, o < 0 || i <= o) {
        o -= n, n = -n;
        break;
      }
    }
  }
  function Ne(e, t, i) {
    const n = new Ee();
    i.forEach(function(l) {
      n.put(l.mode.bit, 4), n.put(l.getLength(), Ae.getCharCountIndicator(l.mode, e)), l.write(n);
    });
    const o = lt.getSymbolTotalCodewords(e), r = pt.getTotalCodewordsCount(e, t), s = (o - r) * 8;
    for (n.getLengthInBits() + 4 <= s && n.put(0, 4); n.getLengthInBits() % 8 !== 0; ) n.putBit(0);
    const a = (s - n.getLengthInBits()) / 8;
    for (let l = 0; l < a; l++) n.put(l % 2 ? 17 : 236, 8);
    return ke(n, e, t);
  }
  function ke(e, t, i) {
    const n = lt.getSymbolTotalCodewords(t), o = pt.getTotalCodewordsCount(t, i), r = n - o, s = pt.getBlocksCount(t, i), a = n % s, l = s - a, u = Math.floor(n / s), c = Math.floor(r / s), B = c + 1, w = u - c, f = new be(w);
    let p = 0;
    const y = new Array(s), T = new Array(s);
    let m = 0;
    const E = new Uint8Array(e.buffer);
    for (let b = 0; b < s; b++) {
      const v = b < l ? c : B;
      y[b] = E.slice(p, p + v), T[b] = f.encode(y[b]), p += v, m = Math.max(m, v);
    }
    const g = new Uint8Array(n);
    let h = 0, C, I;
    for (C = 0; C < m; C++) for (I = 0; I < s; I++) C < y[I].length && (g[h++] = y[I][C]);
    for (C = 0; C < w; C++) for (I = 0; I < s; I++) g[h++] = T[I][C];
    return g;
  }
  function Re(e, t, i, n) {
    let o;
    if (Array.isArray(e)) o = dt.fromArray(e);
    else if (typeof e == "string") {
      let u = t;
      if (!u) {
        const c = dt.rawSplit(e);
        u = nt.getBestVersionForData(c, i);
      }
      o = dt.fromString(e, u || 40);
    } else throw new Error("Invalid data");
    const r = nt.getBestVersionForData(o, i);
    if (!r) throw new Error("The amount of data is too big to be stored in a QR Code");
    if (!t) t = r;
    else if (t < r) throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + r + `.
`);
    const s = Ne(t, i, o), a = lt.getSymbolSize(t), l = new Ce(a);
    return Le(l, t), ve(l), Se(l, t), ft(l, i, 0), t >= 7 && Me(l, t), Pe(l, s), isNaN(n) && (n = wt.getBestMask(l, ft.bind(null, l, i))), wt.applyMask(n, l), ft(l, i, n), {
      modules: l,
      version: t,
      errorCorrectionLevel: i,
      maskPattern: n,
      segments: o
    };
  }
  kt.create = function(t, i) {
    if (typeof t > "u" || t === "") throw new Error("No input text");
    let n = ut.M, o, r;
    return typeof i < "u" && (n = ut.from(i.errorCorrectionLevel, ut.M), o = nt.from(i.version), r = wt.from(i.maskPattern), i.toSJISFunc && lt.setToSJISFunction(i.toSJISFunc)), Re(t, o, n, r);
  };
  var qt = {}, Tt = {};
  (function(e) {
    function t(i) {
      if (typeof i == "number" && (i = i.toString()), typeof i != "string") throw new Error("Color should be defined as hex string");
      let n = i.slice().replace("#", "").split("");
      if (n.length < 3 || n.length === 5 || n.length > 8) throw new Error("Invalid hex color: " + i);
      (n.length === 3 || n.length === 4) && (n = Array.prototype.concat.apply([], n.map(function(r) {
        return [
          r,
          r
        ];
      }))), n.length === 6 && n.push("F", "F");
      const o = parseInt(n.join(""), 16);
      return {
        r: o >> 24 & 255,
        g: o >> 16 & 255,
        b: o >> 8 & 255,
        a: o & 255,
        hex: "#" + n.slice(0, 6).join("")
      };
    }
    e.getOptions = function(n) {
      n || (n = {}), n.color || (n.color = {});
      const o = typeof n.margin > "u" || n.margin === null || n.margin < 0 ? 4 : n.margin, r = n.width && n.width >= 21 ? n.width : void 0, s = n.scale || 4;
      return {
        width: r,
        scale: r ? 4 : s,
        margin: o,
        color: {
          dark: t(n.color.dark || "#000000ff"),
          light: t(n.color.light || "#ffffffff")
        },
        type: n.type,
        rendererOpts: n.rendererOpts || {}
      };
    }, e.getScale = function(n, o) {
      return o.width && o.width >= n + o.margin * 2 ? o.width / (n + o.margin * 2) : o.scale;
    }, e.getImageWidth = function(n, o) {
      const r = e.getScale(n, o);
      return Math.floor((n + o.margin * 2) * r);
    }, e.qrToImageData = function(n, o, r) {
      const s = o.modules.size, a = o.modules.data, l = e.getScale(s, r), u = Math.floor((s + r.margin * 2) * l), c = r.margin * l, B = [
        r.color.light,
        r.color.dark
      ];
      for (let w = 0; w < u; w++) for (let f = 0; f < u; f++) {
        let p = (w * u + f) * 4, y = r.color.light;
        if (w >= c && f >= c && w < u - c && f < u - c) {
          const T = Math.floor((w - c) / l), m = Math.floor((f - c) / l);
          y = B[a[T * s + m] ? 1 : 0];
        }
        n[p++] = y.r, n[p++] = y.g, n[p++] = y.b, n[p] = y.a;
      }
    };
  })(Tt);
  (function(e) {
    const t = Tt;
    function i(o, r, s) {
      o.clearRect(0, 0, r.width, r.height), r.style || (r.style = {}), r.height = s, r.width = s, r.style.height = s + "px", r.style.width = s + "px";
    }
    function n() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    e.render = function(r, s, a) {
      let l = a, u = s;
      typeof l > "u" && (!s || !s.getContext) && (l = s, s = void 0), s || (u = n()), l = t.getOptions(l);
      const c = t.getImageWidth(r.modules.size, l), B = u.getContext("2d"), w = B.createImageData(c, c);
      return t.qrToImageData(w.data, r, l), i(B, u, c), B.putImageData(w, 0, 0), u;
    }, e.renderToDataURL = function(r, s, a) {
      let l = a;
      typeof l > "u" && (!s || !s.getContext) && (l = s, s = void 0), l || (l = {});
      const u = e.render(r, s, l), c = l.type || "image/png", B = l.rendererOpts || {};
      return u.toDataURL(c, B.quality);
    };
  })(qt);
  var Jt = {};
  const _e = Tt;
  function Mt(e, t) {
    const i = e.a / 255, n = t + '="' + e.hex + '"';
    return i < 1 ? n + " " + t + '-opacity="' + i.toFixed(2).slice(1) + '"' : n;
  }
  function gt(e, t, i) {
    let n = e + t;
    return typeof i < "u" && (n += " " + i), n;
  }
  function De(e, t, i) {
    let n = "", o = 0, r = false, s = 0;
    for (let a = 0; a < e.length; a++) {
      const l = Math.floor(a % t), u = Math.floor(a / t);
      !l && !r && (r = true), e[a] ? (s++, a > 0 && l > 0 && e[a - 1] || (n += r ? gt("M", l + i, 0.5 + u + i) : gt("m", o, 0), o = 0, r = false), l + 1 < t && e[a + 1] || (n += gt("h", s), s = 0)) : o++;
    }
    return n;
  }
  Jt.render = function(t, i, n) {
    const o = _e.getOptions(i), r = t.modules.size, s = t.modules.data, a = r + o.margin * 2, l = o.color.light.a ? "<path " + Mt(o.color.light, "fill") + ' d="M0 0h' + a + "v" + a + 'H0z"/>' : "", u = "<path " + Mt(o.color.dark, "stroke") + ' d="' + De(s, r, o.margin) + '"/>', c = 'viewBox="0 0 ' + a + " " + a + '"', w = '<svg xmlns="http://www.w3.org/2000/svg" ' + (o.width ? 'width="' + o.width + '" height="' + o.width + '" ' : "") + c + ' shape-rendering="crispEdges">' + l + u + `</svg>
`;
    return typeof n == "function" && n(null, w), w;
  };
  const Fe = Wt, yt = kt, Qt = qt, Ue = Jt;
  function At(e, t, i, n, o) {
    const r = [].slice.call(arguments, 1), s = r.length, a = typeof r[s - 1] == "function";
    if (!a && !Fe()) throw new Error("Callback required as last argument");
    if (a) {
      if (s < 2) throw new Error("Too few arguments provided");
      s === 2 ? (o = i, i = t, t = n = void 0) : s === 3 && (t.getContext && typeof o > "u" ? (o = n, n = void 0) : (o = n, n = i, i = t, t = void 0));
    } else {
      if (s < 1) throw new Error("Too few arguments provided");
      return s === 1 ? (i = t, t = n = void 0) : s === 2 && !t.getContext && (n = i, i = t, t = void 0), new Promise(function(l, u) {
        try {
          const c = yt.create(i, n);
          l(e(c, t, n));
        } catch (c) {
          u(c);
        }
      });
    }
    try {
      const l = yt.create(i, n);
      o(null, e(l, t, n));
    } catch (l) {
      o(l);
    }
  }
  G.create = yt.create;
  G.toCanvas = At.bind(null, Qt.render);
  G.toDataURL = At.bind(null, Qt.renderToDataURL);
  G.toString = At.bind(null, function(e, t, i) {
    return Ue.render(e, i);
  });
  await Zt(() => import("./main-DCELqU_k.js").then(async (m) => {
    await m.__tla;
    return m;
  }), __vite__mapDeps([0,1,2]));
  let Et;
  function xe() {
    try {
      const e = localStorage.getItem("jarrows_theme"), t = localStorage.getItem("jarrows_colors"), i = localStorage.getItem("jarrows_quality"), n = localStorage.getItem("jarrows_auto_zoom");
      return {
        isDarkTheme: e !== null ? e === "dark" : true,
        useColoredBlocks: t !== null ? t === "colored" : false,
        qualityPreset: i || "balanced",
        autoZoomEnabled: n !== null ? n === "true" : true
      };
    } catch (e) {
      return console.warn("Failed to load preferences:", e), {
        isDarkTheme: true,
        useColoredBlocks: false,
        qualityPreset: "balanced",
        autoZoomEnabled: true
      };
    }
  }
  function tt() {
    try {
      localStorage.setItem("jarrows_theme", V ? "dark" : "light"), localStorage.setItem("jarrows_colors", U ? "colored" : "white"), localStorage.setItem("jarrows_quality", D), localStorage.setItem("jarrows_auto_zoom", H.toString());
    } catch (e) {
      console.warn("Failed to save preferences:", e);
    }
  }
  const Y = xe();
  let V = Y.isDarkTheme, U = Y.useColoredBlocks, D = Y.qualityPreset || "balanced", H = Y.autoZoomEnabled !== void 0 ? Y.autoZoomEnabled : true, ht = false;
  window.useColoredBlocksDefault = U;
  window.jarrowsQualityPreset = D;
  function Ct() {
    const e = window.gameScene, t = window.THREE, i = document.getElementById("theme-icon"), n = document.getElementById("theme-toggle");
    if (!e || !t || !i || !n) {
      console.log("updateThemeIcon: Missing dependencies", {
        scene: !!e,
        THREE: !!t,
        themeIcon: !!i,
        themeToggle: !!n
      });
      return;
    }
    if (!window.setGradientBackground || !window.setupFog) {
      console.log("updateThemeIcon: Waiting for functions...", {
        setGradientBackground: !!window.setGradientBackground,
        setupFog: !!window.setupFog
      }), setTimeout(Ct, 50);
      return;
    }
    console.log("updateThemeIcon: Applying theme", {
      isDarkTheme: V
    }), V ? (window.setGradientBackground(e, 986895, 328965), window.setupFog(e, true), i.setAttribute("fill", "none"), i.setAttribute("stroke", "currentColor"), i.setAttribute("stroke-width", "2"), i.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none"></path>', n.classList.add("active")) : (window.setGradientBackground(e, 5930904, 3824250), window.setupFog(e, false), i.setAttribute("fill", "none"), i.setAttribute("stroke", "currentColor"), i.setAttribute("stroke-width", "2"), i.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', n.classList.remove("active"));
  }
  function Pt() {
    const e = document.getElementById("colors-icon"), t = document.getElementById("colors-toggle");
    !e || !t || (U ? (e.setAttribute("stroke", "none"), e.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="#4ecdc4" stroke="none"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="#ffe66d" stroke="none"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect>', t.classList.add("active")) : (e.setAttribute("stroke", "currentColor"), e.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="white"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="white"></rect>', t.classList.remove("active")));
  }
  function Nt() {
    const e = window.gameBlocks || Et || [];
    if (!e || e.length === 0) return;
    const t = [
      16739179,
      5164484,
      16770669
    ], i = 16777215;
    e.forEach((n) => {
      if (n.cubes && n.cubes.length > 0) {
        const o = n.cubes[0];
        if (o && o.material) {
          const r = U ? t[n.length - 1] || t[0] : i, s = t[n.length - 1] || t[0];
          o.material.color.setHex(r), n.updateBlockColor && n.updateBlockColor(r, s);
        }
      }
    });
  }
  function ot() {
    if (ht) return;
    ht = true;
    const e = document.getElementById("theme-toggle"), t = document.getElementById("colors-toggle"), i = document.getElementById("settings-toggle"), n = document.getElementById("settings-menu"), o = document.getElementById("settings-container"), r = document.getElementById("quality-toggle"), s = document.getElementById("quality-label");
    if (console.log("Setting up toggle handlers...", {
      themeToggle: e,
      colorsToggle: t,
      settingsToggle: i
    }), !e || !t || !i) {
      console.warn("Toggle buttons not found, retrying...", {
        themeToggle: e,
        colorsToggle: t,
        settingsToggle: i
      }), ht = false, setTimeout(ot, 100);
      return;
    }
    if (i && n && i.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), n.classList.toggle("show");
    }), o && n) {
      const d = function(L) {
        o.contains(L.target) || n.classList.remove("show");
      };
      document.addEventListener("click", d);
      const A = document.querySelector("canvas");
      A && (A.addEventListener("mousedown", function(L) {
        n.classList.remove("show");
      }), A.addEventListener("touchstart", function(L) {
        n.classList.remove("show");
      }, {
        passive: true
      }));
    }
    e.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), console.log("Theme toggle clicked, current state:", V), V = !V, Ct(), tt();
    }), t.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), console.log("Colors toggle clicked, current state:", U), U = !U, window.useColoredBlocksDefault = U, Pt(), Nt(), tt();
    });
    const a = document.getElementById("audio-toggle"), l = document.getElementById("audio-icon");
    function u() {
      if (!a || !l) return;
      (window.isAudioEnabled ? window.isAudioEnabled() : true) ? (l.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>', a.classList.add("active")) : (l.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M23 9l-6 6M17 9l6 6"></path>', a.classList.remove("active"));
    }
    a && (u(), a.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), window.toggleAudio && (window.toggleAudio(), u());
    }));
    const c = document.getElementById("auto-zoom-toggle"), B = document.getElementById("auto-zoom-icon");
    function w() {
      !c || !B || (H ? (B.innerHTML = '<path d="M23 7l-7 5 7 5V7z" fill="none"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none"></rect>', c.classList.add("active")) : (B.innerHTML = '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 7.16" fill="none"></path><line x1="1" y1="1" x2="23" y2="23" fill="none"></line><path d="M23 7l-7 5 7 5V7z" fill="none"></path>', c.classList.remove("active")));
    }
    c && (w(), window.autoZoomEnabled = H, c.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), H = !H, window.autoZoomEnabled = H, w(), tt();
    }));
    const f = document.getElementById("fps-toggle"), p = document.getElementById("fps-display");
    try {
      localStorage.getItem("jarrows_fps_enabled") === "true" && (window.fpsEnabled !== void 0 && (window.fpsEnabled = true), p && (p.style.display = "flex"), f && f.classList.add("active"));
    } catch (d) {
      console.warn("Failed to load FPS preference:", d);
    }
    function y() {
      if (!p) return;
      window.fpsEnabled || false ? p.style.display = "flex" : p.style.display = "none";
    }
    f && (y(), f.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation();
      const L = !(window.fpsEnabled || false);
      window.fpsEnabled !== void 0 && (window.fpsEnabled = L), y(), L ? f.classList.add("active") : f.classList.remove("active");
      try {
        localStorage.setItem("jarrows_fps_enabled", String(L));
      } catch (N) {
        console.warn("Failed to save FPS preference:", N);
      }
    }));
    function T() {
      s && (s.textContent = D === "performance" ? "PERF" : D === "battery" ? "BATT" : "BAL", r && r.classList.add("active"));
    }
    function m() {
      const d = (window.jarrowsVersion || "").toString().trim(), A = (window.jarrowsGitSha || "").toString().trim();
      return d ? `v${d}` + (A ? ` @ ${A}` : "") : A ? `commit ${A}` : "v\u2014";
    }
    function E() {
      const d = document.getElementById("settings-version");
      d && (d.textContent = m());
    }
    r && r.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), D = D === "balanced" ? "performance" : D === "performance" ? "battery" : "balanced", window.jarrowsQualityPreset = D, T(), tt(), typeof window.applyQualityPreset == "function" && window.applyQualityPreset(D);
    });
    const g = document.getElementById("ver-toggle");
    g && (g.classList.add("active"), g.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), n && n.classList.remove("show");
      const A = document.getElementById("ver-modal"), L = document.getElementById("ver-modal-value");
      L && (L.textContent = m()), A && (A.style.display = "flex");
    }));
    const h = document.getElementById("share-toggle");
    h && h.addEventListener("click", function(d) {
      d.preventDefault(), d.stopPropagation(), n && n.classList.remove("show"), k();
    });
    const C = document.getElementById("share-pwa-modal"), I = document.getElementById("share-pwa-modal-ok"), b = document.getElementById("share-pwa-modal-close");
    function v() {
      C && (C.style.display = "none");
    }
    I && I.addEventListener("click", v), b && b.addEventListener("click", v), C && C.addEventListener("click", function(d) {
      d.target === C && v();
    });
    function k() {
      const d = document.getElementById("share-pwa-modal");
      if (!d) return;
      const A = window.location.href, L = document.getElementById("share-url-display");
      L && (L.textContent = A);
      const N = document.getElementById("qr-code-canvas");
      N && M(N, A).catch((Gt) => {
        console.error("Error generating QR code:", Gt);
      }), z(), d.style.display = "flex";
    }
    async function M(d, A) {
      try {
        await G.toCanvas(d, A, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        });
      } catch (L) {
        console.error("Failed to generate QR code:", L);
        const N = d.getContext("2d");
        d.width = 200, d.height = 200, N.fillStyle = "#ffffff", N.fillRect(0, 0, 200, 200), N.fillStyle = "#ff0000", N.font = "12px monospace", N.textAlign = "center", N.fillText("QR Error", 100, 100);
      }
    }
    function z() {
      const d = document.getElementById("pwa-install-content");
      if (!d) return;
      const A = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || document.referrer.includes("android-app://");
      let L = "";
      A ? L = '<p style="opacity: 0.8; margin-bottom: 12px;">\u2705 App is already installed!</p>' : L = `
                        <div style="margin-bottom: 12px;">
                            <p style="font-weight: 700; margin-bottom: 8px;">Install on Mobile:</p>
                            <div style="margin-bottom: 12px;">
                                <p style="font-weight: 600; margin-bottom: 4px; font-size: 13px;">\u{1F4F1} iOS (iPhone/iPad):</p>
                                <ol style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6; font-size: 12px;">
                                    <li>Tap the <b>Share</b> button (square with arrow) in Safari</li>
                                    <li>Scroll down and tap <b>"Add to Home Screen"</b></li>
                                    <li>Tap <b>"Add"</b> to confirm</li>
                                </ol>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <p style="font-weight: 600; margin-bottom: 4px; font-size: 13px;">\u{1F916} Android:</p>
                                <ol style="margin: 0; padding-left: 20px; line-height: 1.6; font-size: 12px;">
                                    <li>Tap the <b>menu</b> (three dots) in Chrome</li>
                                    <li>Tap <b>"Install app"</b> or <b>"Add to Home screen"</b></li>
                                    <li>Tap <b>"Install"</b> to confirm</li>
                                </ol>
                                <p style="margin-top: 6px; opacity: 0.8; font-size: 11px;">Note: Installation prompt may appear automatically.</p>
                            </div>
                            <p style="font-weight: 700; margin-top: 16px; margin-bottom: 8px;">Install on Desktop:</p>
                            <ol style="margin: 0; padding-left: 20px; line-height: 1.6; font-size: 12px;">
                                <li><b>Chrome/Edge:</b> Click the install icon in the address bar</li>
                                <li><b>Firefox:</b> Use browser menu \u2192 "Install"</li>
                                <li>Follow the browser's installation prompts</li>
                            </ol>
                        </div>
                    `, d.innerHTML = L;
    }
    const _ = document.getElementById("ver-modal"), P = document.getElementById("ver-modal-ok"), Lt = document.getElementById("ver-modal-close-x"), W = document.getElementById("ver-modal-copy");
    function at() {
      _ && (_.style.display = "none");
    }
    P && P.addEventListener("click", at), Lt && Lt.addEventListener("click", at), _ && _.addEventListener("click", function(d) {
      d.target === _ && at();
    }), W && W.addEventListener("click", async function() {
      const d = m();
      try {
        await navigator.clipboard.writeText(d), W.textContent = "Copied", setTimeout(() => {
          W.textContent = "Copy";
        }, 900);
      } catch {
      }
    }), Ct(), Pt(), u(), T(), E(), Nt(), console.log("Toggle handlers setup complete");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ot) : ot();
  function Yt() {
    window.gameScene ? (Et = window.gameBlocks || Et, ot()) : setTimeout(Yt, 100);
  }
  setTimeout(Yt, 100);
  (function() {
    try {
      const t = "jarrows_seen_quality_notice_v1";
      if (localStorage.getItem(t) === "1") return;
      const i = document.getElementById("quality-preset-modal"), n = document.getElementById("quality-modal-ok");
      if (!i || !n) return;
      i.style.display = "flex", n.addEventListener("click", () => {
        i.style.display = "none", localStorage.setItem(t, "1");
      });
    } catch {
    }
  })();
})();
