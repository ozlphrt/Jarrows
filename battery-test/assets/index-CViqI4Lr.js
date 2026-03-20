const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/main-DAf3W9C3.js","assets/preload-helper-BrL09032.js","assets/physics-B2C9Lbr9.js"])))=>i.map(i=>d[i]);
import { _ as nt } from "./preload-helper-BrL09032.js";
(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
    new MutationObserver((o) => {
      for (const i of o) if (i.type === "childList") for (const s of i.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && n(s);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function r(o) {
      const i = {};
      return o.integrity && (i.integrity = o.integrity), o.referrerPolicy && (i.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? i.credentials = "include" : o.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
    }
    function n(o) {
      if (o.ep) return;
      o.ep = true;
      const i = r(o);
      fetch(o.href, i);
    }
  })();
  var Z = {}, ot = function() {
    return typeof Promise == "function" && Promise.prototype && Promise.prototype.then;
  }, De = {}, P = {};
  let Te;
  const it = [
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
  P.getSymbolSize = function(e) {
    if (!e) throw new Error('"version" cannot be null or undefined');
    if (e < 1 || e > 40) throw new Error('"version" should be in range from 1 to 40');
    return e * 4 + 17;
  };
  P.getSymbolTotalCodewords = function(e) {
    return it[e];
  };
  P.getBCHDigit = function(t) {
    let e = 0;
    for (; t !== 0; ) e++, t >>>= 1;
    return e;
  };
  P.setToSJISFunction = function(e) {
    if (typeof e != "function") throw new Error('"toSJISFunc" is not a valid function.');
    Te = e;
  };
  P.isKanjiModeEnabled = function() {
    return typeof Te < "u";
  };
  P.toSJIS = function(e) {
    return Te(e);
  };
  var re = {};
  (function(t) {
    t.L = {
      bit: 1
    }, t.M = {
      bit: 0
    }, t.Q = {
      bit: 3
    }, t.H = {
      bit: 2
    };
    function e(r) {
      if (typeof r != "string") throw new Error("Param is not a string");
      switch (r.toLowerCase()) {
        case "l":
        case "low":
          return t.L;
        case "m":
        case "medium":
          return t.M;
        case "q":
        case "quartile":
          return t.Q;
        case "h":
        case "high":
          return t.H;
        default:
          throw new Error("Unknown EC Level: " + r);
      }
    }
    t.isValid = function(n) {
      return n && typeof n.bit < "u" && n.bit >= 0 && n.bit < 4;
    }, t.from = function(n, o) {
      if (t.isValid(n)) return n;
      try {
        return e(n);
      } catch {
        return o;
      }
    };
  })(re);
  function Fe() {
    this.buffer = [], this.length = 0;
  }
  Fe.prototype = {
    get: function(t) {
      const e = Math.floor(t / 8);
      return (this.buffer[e] >>> 7 - t % 8 & 1) === 1;
    },
    put: function(t, e) {
      for (let r = 0; r < e; r++) this.putBit((t >>> e - r - 1 & 1) === 1);
    },
    getLengthInBits: function() {
      return this.length;
    },
    putBit: function(t) {
      const e = Math.floor(this.length / 8);
      this.buffer.length <= e && this.buffer.push(0), t && (this.buffer[e] |= 128 >>> this.length % 8), this.length++;
    }
  };
  var rt = Fe;
  function W(t) {
    if (!t || t < 1) throw new Error("BitMatrix size must be defined and greater than 0");
    this.size = t, this.data = new Uint8Array(t * t), this.reservedBit = new Uint8Array(t * t);
  }
  W.prototype.set = function(t, e, r, n) {
    const o = t * this.size + e;
    this.data[o] = r, n && (this.reservedBit[o] = true);
  };
  W.prototype.get = function(t, e) {
    return this.data[t * this.size + e];
  };
  W.prototype.xor = function(t, e, r) {
    this.data[t * this.size + e] ^= r;
  };
  W.prototype.isReserved = function(t, e) {
    return this.reservedBit[t * this.size + e];
  };
  var st = W, xe = {};
  (function(t) {
    const e = P.getSymbolSize;
    t.getRowColCoords = function(n) {
      if (n === 1) return [];
      const o = Math.floor(n / 7) + 2, i = e(n), s = i === 145 ? 26 : Math.ceil((i - 13) / (2 * o - 2)) * 2, a = [
        i - 7
      ];
      for (let l = 1; l < o - 1; l++) a[l] = a[l - 1] - s;
      return a.push(6), a.reverse();
    }, t.getPositions = function(n) {
      const o = [], i = t.getRowColCoords(n), s = i.length;
      for (let a = 0; a < s; a++) for (let l = 0; l < s; l++) a === 0 && l === 0 || a === 0 && l === s - 1 || a === s - 1 && l === 0 || o.push([
        i[a],
        i[l]
      ]);
      return o;
    };
  })(xe);
  var Ue = {};
  const lt = P.getSymbolSize, Pe = 7;
  Ue.getPositions = function(e) {
    const r = lt(e);
    return [
      [
        0,
        0
      ],
      [
        r - Pe,
        0
      ],
      [
        0,
        r - Pe
      ]
    ];
  };
  var ze = {};
  (function(t) {
    t.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    const e = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    t.isValid = function(o) {
      return o != null && o !== "" && !isNaN(o) && o >= 0 && o <= 7;
    }, t.from = function(o) {
      return t.isValid(o) ? parseInt(o, 10) : void 0;
    }, t.getPenaltyN1 = function(o) {
      const i = o.size;
      let s = 0, a = 0, l = 0, d = null, u = null;
      for (let C = 0; C < i; C++) {
        a = l = 0, d = u = null;
        for (let w = 0; w < i; w++) {
          let f = o.get(C, w);
          f === d ? a++ : (a >= 5 && (s += e.N1 + (a - 5)), d = f, a = 1), f = o.get(w, C), f === u ? l++ : (l >= 5 && (s += e.N1 + (l - 5)), u = f, l = 1);
        }
        a >= 5 && (s += e.N1 + (a - 5)), l >= 5 && (s += e.N1 + (l - 5));
      }
      return s;
    }, t.getPenaltyN2 = function(o) {
      const i = o.size;
      let s = 0;
      for (let a = 0; a < i - 1; a++) for (let l = 0; l < i - 1; l++) {
        const d = o.get(a, l) + o.get(a, l + 1) + o.get(a + 1, l) + o.get(a + 1, l + 1);
        (d === 4 || d === 0) && s++;
      }
      return s * e.N2;
    }, t.getPenaltyN3 = function(o) {
      const i = o.size;
      let s = 0, a = 0, l = 0;
      for (let d = 0; d < i; d++) {
        a = l = 0;
        for (let u = 0; u < i; u++) a = a << 1 & 2047 | o.get(d, u), u >= 10 && (a === 1488 || a === 93) && s++, l = l << 1 & 2047 | o.get(u, d), u >= 10 && (l === 1488 || l === 93) && s++;
      }
      return s * e.N3;
    }, t.getPenaltyN4 = function(o) {
      let i = 0;
      const s = o.data.length;
      for (let l = 0; l < s; l++) i += o.data[l];
      return Math.abs(Math.ceil(i * 100 / s / 5) - 10) * e.N4;
    };
    function r(n, o, i) {
      switch (n) {
        case t.Patterns.PATTERN000:
          return (o + i) % 2 === 0;
        case t.Patterns.PATTERN001:
          return o % 2 === 0;
        case t.Patterns.PATTERN010:
          return i % 3 === 0;
        case t.Patterns.PATTERN011:
          return (o + i) % 3 === 0;
        case t.Patterns.PATTERN100:
          return (Math.floor(o / 2) + Math.floor(i / 3)) % 2 === 0;
        case t.Patterns.PATTERN101:
          return o * i % 2 + o * i % 3 === 0;
        case t.Patterns.PATTERN110:
          return (o * i % 2 + o * i % 3) % 2 === 0;
        case t.Patterns.PATTERN111:
          return (o * i % 3 + (o + i) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + n);
      }
    }
    t.applyMask = function(o, i) {
      const s = i.size;
      for (let a = 0; a < s; a++) for (let l = 0; l < s; l++) i.isReserved(l, a) || i.xor(l, a, r(o, l, a));
    }, t.getBestMask = function(o, i) {
      const s = Object.keys(t.Patterns).length;
      let a = 0, l = 1 / 0;
      for (let d = 0; d < s; d++) {
        i(d), t.applyMask(d, o);
        const u = t.getPenaltyN1(o) + t.getPenaltyN2(o) + t.getPenaltyN3(o) + t.getPenaltyN4(o);
        t.applyMask(d, o), u < l && (l = u, a = d);
      }
      return a;
    };
  })(ze);
  var se = {};
  const F = re, $ = [
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
  ], ee = [
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
  se.getBlocksCount = function(e, r) {
    switch (r) {
      case F.L:
        return $[(e - 1) * 4 + 0];
      case F.M:
        return $[(e - 1) * 4 + 1];
      case F.Q:
        return $[(e - 1) * 4 + 2];
      case F.H:
        return $[(e - 1) * 4 + 3];
      default:
        return;
    }
  };
  se.getTotalCodewordsCount = function(e, r) {
    switch (r) {
      case F.L:
        return ee[(e - 1) * 4 + 0];
      case F.M:
        return ee[(e - 1) * 4 + 1];
      case F.Q:
        return ee[(e - 1) * 4 + 2];
      case F.H:
        return ee[(e - 1) * 4 + 3];
      default:
        return;
    }
  };
  var He = {}, le = {};
  const Q = new Uint8Array(512), ne = new Uint8Array(256);
  (function() {
    let e = 1;
    for (let r = 0; r < 255; r++) Q[r] = e, ne[e] = r, e <<= 1, e & 256 && (e ^= 285);
    for (let r = 255; r < 512; r++) Q[r] = Q[r - 255];
  })();
  le.log = function(e) {
    if (e < 1) throw new Error("log(" + e + ")");
    return ne[e];
  };
  le.exp = function(e) {
    return Q[e];
  };
  le.mul = function(e, r) {
    return e === 0 || r === 0 ? 0 : Q[ne[e] + ne[r]];
  };
  (function(t) {
    const e = le;
    t.mul = function(n, o) {
      const i = new Uint8Array(n.length + o.length - 1);
      for (let s = 0; s < n.length; s++) for (let a = 0; a < o.length; a++) i[s + a] ^= e.mul(n[s], o[a]);
      return i;
    }, t.mod = function(n, o) {
      let i = new Uint8Array(n);
      for (; i.length - o.length >= 0; ) {
        const s = i[0];
        for (let l = 0; l < o.length; l++) i[l] ^= e.mul(o[l], s);
        let a = 0;
        for (; a < i.length && i[a] === 0; ) a++;
        i = i.slice(a);
      }
      return i;
    }, t.generateECPolynomial = function(n) {
      let o = new Uint8Array([
        1
      ]);
      for (let i = 0; i < n; i++) o = t.mul(o, new Uint8Array([
        1,
        e.exp(i)
      ]));
      return o;
    };
  })(He);
  const Ve = He;
  function be(t) {
    this.genPoly = void 0, this.degree = t, this.degree && this.initialize(this.degree);
  }
  be.prototype.initialize = function(e) {
    this.degree = e, this.genPoly = Ve.generateECPolynomial(this.degree);
  };
  be.prototype.encode = function(e) {
    if (!this.genPoly) throw new Error("Encoder not initialized");
    const r = new Uint8Array(e.length + this.degree);
    r.set(e);
    const n = Ve.mod(r, this.genPoly), o = this.degree - n.length;
    if (o > 0) {
      const i = new Uint8Array(this.degree);
      return i.set(n, o), i;
    }
    return n;
  };
  var at = be, je = {}, U = {}, ve = {};
  ve.isValid = function(e) {
    return !isNaN(e) && e >= 1 && e <= 40;
  };
  var _ = {};
  const Oe = "[0-9]+", ct = "[A-Z $%*+\\-./:]+";
  let Y = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
  Y = Y.replace(/u/g, "\\u");
  const ut = "(?:(?![A-Z0-9 $%*+\\-./:]|" + Y + `)(?:.|[\r
]))+`;
  _.KANJI = new RegExp(Y, "g");
  _.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
  _.BYTE = new RegExp(ut, "g");
  _.NUMERIC = new RegExp(Oe, "g");
  _.ALPHANUMERIC = new RegExp(ct, "g");
  const dt = new RegExp("^" + Y + "$"), ft = new RegExp("^" + Oe + "$"), gt = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
  _.testKanji = function(e) {
    return dt.test(e);
  };
  _.testNumeric = function(e) {
    return ft.test(e);
  };
  _.testAlphanumeric = function(e) {
    return gt.test(e);
  };
  (function(t) {
    const e = ve, r = _;
    t.NUMERIC = {
      id: "Numeric",
      bit: 1,
      ccBits: [
        10,
        12,
        14
      ]
    }, t.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 2,
      ccBits: [
        9,
        11,
        13
      ]
    }, t.BYTE = {
      id: "Byte",
      bit: 4,
      ccBits: [
        8,
        16,
        16
      ]
    }, t.KANJI = {
      id: "Kanji",
      bit: 8,
      ccBits: [
        8,
        10,
        12
      ]
    }, t.MIXED = {
      bit: -1
    }, t.getCharCountIndicator = function(i, s) {
      if (!i.ccBits) throw new Error("Invalid mode: " + i);
      if (!e.isValid(s)) throw new Error("Invalid version: " + s);
      return s >= 1 && s < 10 ? i.ccBits[0] : s < 27 ? i.ccBits[1] : i.ccBits[2];
    }, t.getBestModeForData = function(i) {
      return r.testNumeric(i) ? t.NUMERIC : r.testAlphanumeric(i) ? t.ALPHANUMERIC : r.testKanji(i) ? t.KANJI : t.BYTE;
    }, t.toString = function(i) {
      if (i && i.id) return i.id;
      throw new Error("Invalid mode");
    }, t.isValid = function(i) {
      return i && i.bit && i.ccBits;
    };
    function n(o) {
      if (typeof o != "string") throw new Error("Param is not a string");
      switch (o.toLowerCase()) {
        case "numeric":
          return t.NUMERIC;
        case "alphanumeric":
          return t.ALPHANUMERIC;
        case "kanji":
          return t.KANJI;
        case "byte":
          return t.BYTE;
        default:
          throw new Error("Unknown mode: " + o);
      }
    }
    t.from = function(i, s) {
      if (t.isValid(i)) return i;
      try {
        return n(i);
      } catch {
        return s;
      }
    };
  })(U);
  (function(t) {
    const e = P, r = se, n = re, o = U, i = ve, s = 7973, a = e.getBCHDigit(s);
    function l(w, f, p) {
      for (let E = 1; E <= 40; E++) if (f <= t.getCapacity(E, p, w)) return E;
    }
    function d(w, f) {
      return o.getCharCountIndicator(w, f) + 4;
    }
    function u(w, f) {
      let p = 0;
      return w.forEach(function(E) {
        const T = d(E.mode, f);
        p += T + E.getBitsLength();
      }), p;
    }
    function C(w, f) {
      for (let p = 1; p <= 40; p++) if (u(w, p) <= t.getCapacity(p, f, o.MIXED)) return p;
    }
    t.from = function(f, p) {
      return i.isValid(f) ? parseInt(f, 10) : p;
    }, t.getCapacity = function(f, p, E) {
      if (!i.isValid(f)) throw new Error("Invalid QR Code version");
      typeof E > "u" && (E = o.BYTE);
      const T = e.getSymbolTotalCodewords(f), m = r.getTotalCodewordsCount(f, p), y = (T - m) * 8;
      if (E === o.MIXED) return y;
      const g = y - d(E, f);
      switch (E) {
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
    }, t.getBestVersionForData = function(f, p) {
      let E;
      const T = n.from(p, n.M);
      if (Array.isArray(f)) {
        if (f.length > 1) return C(f, T);
        if (f.length === 0) return 1;
        E = f[0];
      } else E = f;
      return l(E.mode, E.getLength(), T);
    }, t.getEncodedBits = function(f) {
      if (!i.isValid(f) || f < 7) throw new Error("Invalid QR Code version");
      let p = f << 12;
      for (; e.getBCHDigit(p) - a >= 0; ) p ^= s << e.getBCHDigit(p) - a;
      return f << 12 | p;
    };
  })(je);
  var qe = {};
  const pe = P, Ke = 1335, ht = 21522, Ne = pe.getBCHDigit(Ke);
  qe.getEncodedBits = function(e, r) {
    const n = e.bit << 3 | r;
    let o = n << 10;
    for (; pe.getBCHDigit(o) - Ne >= 0; ) o ^= Ke << pe.getBCHDigit(o) - Ne;
    return (n << 10 | o) ^ ht;
  };
  var Je = {};
  const mt = U;
  function j(t) {
    this.mode = mt.NUMERIC, this.data = t.toString();
  }
  j.getBitsLength = function(e) {
    return 10 * Math.floor(e / 3) + (e % 3 ? e % 3 * 3 + 1 : 0);
  };
  j.prototype.getLength = function() {
    return this.data.length;
  };
  j.prototype.getBitsLength = function() {
    return j.getBitsLength(this.data.length);
  };
  j.prototype.write = function(e) {
    let r, n, o;
    for (r = 0; r + 3 <= this.data.length; r += 3) n = this.data.substr(r, 3), o = parseInt(n, 10), e.put(o, 10);
    const i = this.data.length - r;
    i > 0 && (n = this.data.substr(r), o = parseInt(n, 10), e.put(o, i * 3 + 1));
  };
  var wt = j;
  const pt = U, de = [
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
  function O(t) {
    this.mode = pt.ALPHANUMERIC, this.data = t;
  }
  O.getBitsLength = function(e) {
    return 11 * Math.floor(e / 2) + 6 * (e % 2);
  };
  O.prototype.getLength = function() {
    return this.data.length;
  };
  O.prototype.getBitsLength = function() {
    return O.getBitsLength(this.data.length);
  };
  O.prototype.write = function(e) {
    let r;
    for (r = 0; r + 2 <= this.data.length; r += 2) {
      let n = de.indexOf(this.data[r]) * 45;
      n += de.indexOf(this.data[r + 1]), e.put(n, 11);
    }
    this.data.length % 2 && e.put(de.indexOf(this.data[r]), 6);
  };
  var yt = O;
  const Et = U;
  function q(t) {
    this.mode = Et.BYTE, typeof t == "string" ? this.data = new TextEncoder().encode(t) : this.data = new Uint8Array(t);
  }
  q.getBitsLength = function(e) {
    return e * 8;
  };
  q.prototype.getLength = function() {
    return this.data.length;
  };
  q.prototype.getBitsLength = function() {
    return q.getBitsLength(this.data.length);
  };
  q.prototype.write = function(t) {
    for (let e = 0, r = this.data.length; e < r; e++) t.put(this.data[e], 8);
  };
  var It = q;
  const Ct = U, Bt = P;
  function K(t) {
    this.mode = Ct.KANJI, this.data = t;
  }
  K.getBitsLength = function(e) {
    return e * 13;
  };
  K.prototype.getLength = function() {
    return this.data.length;
  };
  K.prototype.getBitsLength = function() {
    return K.getBitsLength(this.data.length);
  };
  K.prototype.write = function(t) {
    let e;
    for (e = 0; e < this.data.length; e++) {
      let r = Bt.toSJIS(this.data[e]);
      if (r >= 33088 && r <= 40956) r -= 33088;
      else if (r >= 57408 && r <= 60351) r -= 49472;
      else throw new Error("Invalid SJIS character: " + this.data[e] + `
Make sure your charset is UTF-8`);
      r = (r >>> 8 & 255) * 192 + (r & 255), t.put(r, 13);
    }
  };
  var Tt = K, Qe = {
    exports: {}
  };
  (function(t) {
    var e = {
      single_source_shortest_paths: function(r, n, o) {
        var i = {}, s = {};
        s[n] = 0;
        var a = e.PriorityQueue.make();
        a.push(n, 0);
        for (var l, d, u, C, w, f, p, E, T; !a.empty(); ) {
          l = a.pop(), d = l.value, C = l.cost, w = r[d] || {};
          for (u in w) w.hasOwnProperty(u) && (f = w[u], p = C + f, E = s[u], T = typeof s[u] > "u", (T || E > p) && (s[u] = p, a.push(u, p), i[u] = d));
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
        return i;
      },
      extract_shortest_path_from_predecessor_list: function(r, n) {
        for (var o = [], i = n; i; ) o.push(i), r[i], i = r[i];
        return o.reverse(), o;
      },
      find_path: function(r, n, o) {
        var i = e.single_source_shortest_paths(r, n, o);
        return e.extract_shortest_path_from_predecessor_list(i, o);
      },
      PriorityQueue: {
        make: function(r) {
          var n = e.PriorityQueue, o = {}, i;
          r = r || {};
          for (i in n) n.hasOwnProperty(i) && (o[i] = n[i]);
          return o.queue = [], o.sorter = r.sorter || n.default_sorter, o;
        },
        default_sorter: function(r, n) {
          return r.cost - n.cost;
        },
        push: function(r, n) {
          var o = {
            value: r,
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
    t.exports = e;
  })(Qe);
  var bt = Qe.exports;
  (function(t) {
    const e = U, r = wt, n = yt, o = It, i = Tt, s = _, a = P, l = bt;
    function d(m) {
      return unescape(encodeURIComponent(m)).length;
    }
    function u(m, y, g) {
      const h = [];
      let I;
      for (; (I = m.exec(g)) !== null; ) h.push({
        data: I[0],
        index: I.index,
        mode: y,
        length: I[0].length
      });
      return h;
    }
    function C(m) {
      const y = u(s.NUMERIC, e.NUMERIC, m), g = u(s.ALPHANUMERIC, e.ALPHANUMERIC, m);
      let h, I;
      return a.isKanjiModeEnabled() ? (h = u(s.BYTE, e.BYTE, m), I = u(s.KANJI, e.KANJI, m)) : (h = u(s.BYTE_KANJI, e.BYTE, m), I = []), y.concat(g, h, I).sort(function(v, S) {
        return v.index - S.index;
      }).map(function(v) {
        return {
          data: v.data,
          mode: v.mode,
          length: v.length
        };
      });
    }
    function w(m, y) {
      switch (y) {
        case e.NUMERIC:
          return r.getBitsLength(m);
        case e.ALPHANUMERIC:
          return n.getBitsLength(m);
        case e.KANJI:
          return i.getBitsLength(m);
        case e.BYTE:
          return o.getBitsLength(m);
      }
    }
    function f(m) {
      return m.reduce(function(y, g) {
        const h = y.length - 1 >= 0 ? y[y.length - 1] : null;
        return h && h.mode === g.mode ? (y[y.length - 1].data += g.data, y) : (y.push(g), y);
      }, []);
    }
    function p(m) {
      const y = [];
      for (let g = 0; g < m.length; g++) {
        const h = m[g];
        switch (h.mode) {
          case e.NUMERIC:
            y.push([
              h,
              {
                data: h.data,
                mode: e.ALPHANUMERIC,
                length: h.length
              },
              {
                data: h.data,
                mode: e.BYTE,
                length: h.length
              }
            ]);
            break;
          case e.ALPHANUMERIC:
            y.push([
              h,
              {
                data: h.data,
                mode: e.BYTE,
                length: h.length
              }
            ]);
            break;
          case e.KANJI:
            y.push([
              h,
              {
                data: h.data,
                mode: e.BYTE,
                length: d(h.data)
              }
            ]);
            break;
          case e.BYTE:
            y.push([
              {
                data: h.data,
                mode: e.BYTE,
                length: d(h.data)
              }
            ]);
        }
      }
      return y;
    }
    function E(m, y) {
      const g = {}, h = {
        start: {}
      };
      let I = [
        "start"
      ];
      for (let B = 0; B < m.length; B++) {
        const v = m[B], S = [];
        for (let N = 0; N < v.length; N++) {
          const M = v[N], R = "" + B + N;
          S.push(R), g[R] = {
            node: M,
            lastCount: 0
          }, h[R] = {};
          for (let z = 0; z < I.length; z++) {
            const k = I[z];
            g[k] && g[k].node.mode === M.mode ? (h[k][R] = w(g[k].lastCount + M.length, M.mode) - w(g[k].lastCount, M.mode), g[k].lastCount += M.length) : (g[k] && (g[k].lastCount = M.length), h[k][R] = w(M.length, M.mode) + 4 + e.getCharCountIndicator(M.mode, y));
          }
        }
        I = S;
      }
      for (let B = 0; B < I.length; B++) h[I[B]].end = 0;
      return {
        map: h,
        table: g
      };
    }
    function T(m, y) {
      let g;
      const h = e.getBestModeForData(m);
      if (g = e.from(y, h), g !== e.BYTE && g.bit < h.bit) throw new Error('"' + m + '" cannot be encoded with mode ' + e.toString(g) + `.
 Suggested mode is: ` + e.toString(h));
      switch (g === e.KANJI && !a.isKanjiModeEnabled() && (g = e.BYTE), g) {
        case e.NUMERIC:
          return new r(m);
        case e.ALPHANUMERIC:
          return new n(m);
        case e.KANJI:
          return new i(m);
        case e.BYTE:
          return new o(m);
      }
    }
    t.fromArray = function(y) {
      return y.reduce(function(g, h) {
        return typeof h == "string" ? g.push(T(h, null)) : h.data && g.push(T(h.data, h.mode)), g;
      }, []);
    }, t.fromString = function(y, g) {
      const h = C(y, a.isKanjiModeEnabled()), I = p(h), B = E(I, g), v = l.find_path(B.map, "start", "end"), S = [];
      for (let N = 1; N < v.length - 1; N++) S.push(B.table[v[N]].node);
      return t.fromArray(f(S));
    }, t.rawSplit = function(y) {
      return t.fromArray(C(y, a.isKanjiModeEnabled()));
    };
  })(Je);
  const ae = P, fe = re, vt = rt, Lt = st, At = xe, St = Ue, ye = ze, Ee = se, Mt = at, oe = je, Pt = qe, Nt = U, ge = Je;
  function kt(t, e) {
    const r = t.size, n = St.getPositions(e);
    for (let o = 0; o < n.length; o++) {
      const i = n[o][0], s = n[o][1];
      for (let a = -1; a <= 7; a++) if (!(i + a <= -1 || r <= i + a)) for (let l = -1; l <= 7; l++) s + l <= -1 || r <= s + l || (a >= 0 && a <= 6 && (l === 0 || l === 6) || l >= 0 && l <= 6 && (a === 0 || a === 6) || a >= 2 && a <= 4 && l >= 2 && l <= 4 ? t.set(i + a, s + l, true, true) : t.set(i + a, s + l, false, true));
    }
  }
  function Rt(t) {
    const e = t.size;
    for (let r = 8; r < e - 8; r++) {
      const n = r % 2 === 0;
      t.set(r, 6, n, true), t.set(6, r, n, true);
    }
  }
  function _t(t, e) {
    const r = At.getPositions(e);
    for (let n = 0; n < r.length; n++) {
      const o = r[n][0], i = r[n][1];
      for (let s = -2; s <= 2; s++) for (let a = -2; a <= 2; a++) s === -2 || s === 2 || a === -2 || a === 2 || s === 0 && a === 0 ? t.set(o + s, i + a, true, true) : t.set(o + s, i + a, false, true);
    }
  }
  function Dt(t, e) {
    const r = t.size, n = oe.getEncodedBits(e);
    let o, i, s;
    for (let a = 0; a < 18; a++) o = Math.floor(a / 3), i = a % 3 + r - 8 - 3, s = (n >> a & 1) === 1, t.set(o, i, s, true), t.set(i, o, s, true);
  }
  function he(t, e, r) {
    const n = t.size, o = Pt.getEncodedBits(e, r);
    let i, s;
    for (i = 0; i < 15; i++) s = (o >> i & 1) === 1, i < 6 ? t.set(i, 8, s, true) : i < 8 ? t.set(i + 1, 8, s, true) : t.set(n - 15 + i, 8, s, true), i < 8 ? t.set(8, n - i - 1, s, true) : i < 9 ? t.set(8, 15 - i - 1 + 1, s, true) : t.set(8, 15 - i - 1, s, true);
    t.set(n - 8, 8, 1, true);
  }
  function Ft(t, e) {
    const r = t.size;
    let n = -1, o = r - 1, i = 7, s = 0;
    for (let a = r - 1; a > 0; a -= 2) for (a === 6 && a--; ; ) {
      for (let l = 0; l < 2; l++) if (!t.isReserved(o, a - l)) {
        let d = false;
        s < e.length && (d = (e[s] >>> i & 1) === 1), t.set(o, a - l, d), i--, i === -1 && (s++, i = 7);
      }
      if (o += n, o < 0 || r <= o) {
        o -= n, n = -n;
        break;
      }
    }
  }
  function xt(t, e, r) {
    const n = new vt();
    r.forEach(function(l) {
      n.put(l.mode.bit, 4), n.put(l.getLength(), Nt.getCharCountIndicator(l.mode, t)), l.write(n);
    });
    const o = ae.getSymbolTotalCodewords(t), i = Ee.getTotalCodewordsCount(t, e), s = (o - i) * 8;
    for (n.getLengthInBits() + 4 <= s && n.put(0, 4); n.getLengthInBits() % 8 !== 0; ) n.putBit(0);
    const a = (s - n.getLengthInBits()) / 8;
    for (let l = 0; l < a; l++) n.put(l % 2 ? 17 : 236, 8);
    return Ut(n, t, e);
  }
  function Ut(t, e, r) {
    const n = ae.getSymbolTotalCodewords(e), o = Ee.getTotalCodewordsCount(e, r), i = n - o, s = Ee.getBlocksCount(e, r), a = n % s, l = s - a, d = Math.floor(n / s), u = Math.floor(i / s), C = u + 1, w = d - u, f = new Mt(w);
    let p = 0;
    const E = new Array(s), T = new Array(s);
    let m = 0;
    const y = new Uint8Array(t.buffer);
    for (let v = 0; v < s; v++) {
      const S = v < l ? u : C;
      E[v] = y.slice(p, p + S), T[v] = f.encode(E[v]), p += S, m = Math.max(m, S);
    }
    const g = new Uint8Array(n);
    let h = 0, I, B;
    for (I = 0; I < m; I++) for (B = 0; B < s; B++) I < E[B].length && (g[h++] = E[B][I]);
    for (I = 0; I < w; I++) for (B = 0; B < s; B++) g[h++] = T[B][I];
    return g;
  }
  function zt(t, e, r, n) {
    let o;
    if (Array.isArray(t)) o = ge.fromArray(t);
    else if (typeof t == "string") {
      let d = e;
      if (!d) {
        const u = ge.rawSplit(t);
        d = oe.getBestVersionForData(u, r);
      }
      o = ge.fromString(t, d || 40);
    } else throw new Error("Invalid data");
    const i = oe.getBestVersionForData(o, r);
    if (!i) throw new Error("The amount of data is too big to be stored in a QR Code");
    if (!e) e = i;
    else if (e < i) throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: ` + i + `.
`);
    const s = xt(e, r, o), a = ae.getSymbolSize(e), l = new Lt(a);
    return kt(l, e), Rt(l), _t(l, e), he(l, r, 0), e >= 7 && Dt(l, e), Ft(l, s), isNaN(n) && (n = ye.getBestMask(l, he.bind(null, l, r))), ye.applyMask(n, l), he(l, r, n), {
      modules: l,
      version: e,
      errorCorrectionLevel: r,
      maskPattern: n,
      segments: o
    };
  }
  De.create = function(e, r) {
    if (typeof e > "u" || e === "") throw new Error("No input text");
    let n = fe.M, o, i;
    return typeof r < "u" && (n = fe.from(r.errorCorrectionLevel, fe.M), o = oe.from(r.version), i = ye.from(r.maskPattern), r.toSJISFunc && ae.setToSJISFunction(r.toSJISFunc)), zt(e, o, n, i);
  };
  var Ye = {}, Le = {};
  (function(t) {
    function e(r) {
      if (typeof r == "number" && (r = r.toString()), typeof r != "string") throw new Error("Color should be defined as hex string");
      let n = r.slice().replace("#", "").split("");
      if (n.length < 3 || n.length === 5 || n.length > 8) throw new Error("Invalid hex color: " + r);
      (n.length === 3 || n.length === 4) && (n = Array.prototype.concat.apply([], n.map(function(i) {
        return [
          i,
          i
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
    t.getOptions = function(n) {
      n || (n = {}), n.color || (n.color = {});
      const o = typeof n.margin > "u" || n.margin === null || n.margin < 0 ? 4 : n.margin, i = n.width && n.width >= 21 ? n.width : void 0, s = n.scale || 4;
      return {
        width: i,
        scale: i ? 4 : s,
        margin: o,
        color: {
          dark: e(n.color.dark || "#000000ff"),
          light: e(n.color.light || "#ffffffff")
        },
        type: n.type,
        rendererOpts: n.rendererOpts || {}
      };
    }, t.getScale = function(n, o) {
      return o.width && o.width >= n + o.margin * 2 ? o.width / (n + o.margin * 2) : o.scale;
    }, t.getImageWidth = function(n, o) {
      const i = t.getScale(n, o);
      return Math.floor((n + o.margin * 2) * i);
    }, t.qrToImageData = function(n, o, i) {
      const s = o.modules.size, a = o.modules.data, l = t.getScale(s, i), d = Math.floor((s + i.margin * 2) * l), u = i.margin * l, C = [
        i.color.light,
        i.color.dark
      ];
      for (let w = 0; w < d; w++) for (let f = 0; f < d; f++) {
        let p = (w * d + f) * 4, E = i.color.light;
        if (w >= u && f >= u && w < d - u && f < d - u) {
          const T = Math.floor((w - u) / l), m = Math.floor((f - u) / l);
          E = C[a[T * s + m] ? 1 : 0];
        }
        n[p++] = E.r, n[p++] = E.g, n[p++] = E.b, n[p] = E.a;
      }
    };
  })(Le);
  (function(t) {
    const e = Le;
    function r(o, i, s) {
      o.clearRect(0, 0, i.width, i.height), i.style || (i.style = {}), i.height = s, i.width = s, i.style.height = s + "px", i.style.width = s + "px";
    }
    function n() {
      try {
        return document.createElement("canvas");
      } catch {
        throw new Error("You need to specify a canvas element");
      }
    }
    t.render = function(i, s, a) {
      let l = a, d = s;
      typeof l > "u" && (!s || !s.getContext) && (l = s, s = void 0), s || (d = n()), l = e.getOptions(l);
      const u = e.getImageWidth(i.modules.size, l), C = d.getContext("2d"), w = C.createImageData(u, u);
      return e.qrToImageData(w.data, i, l), r(C, d, u), C.putImageData(w, 0, 0), d;
    }, t.renderToDataURL = function(i, s, a) {
      let l = a;
      typeof l > "u" && (!s || !s.getContext) && (l = s, s = void 0), l || (l = {});
      const d = t.render(i, s, l), u = l.type || "image/png", C = l.rendererOpts || {};
      return d.toDataURL(u, C.quality);
    };
  })(Ye);
  var Ge = {};
  const Ht = Le;
  function ke(t, e) {
    const r = t.a / 255, n = e + '="' + t.hex + '"';
    return r < 1 ? n + " " + e + '-opacity="' + r.toFixed(2).slice(1) + '"' : n;
  }
  function me(t, e, r) {
    let n = t + e;
    return typeof r < "u" && (n += " " + r), n;
  }
  function Vt(t, e, r) {
    let n = "", o = 0, i = false, s = 0;
    for (let a = 0; a < t.length; a++) {
      const l = Math.floor(a % e), d = Math.floor(a / e);
      !l && !i && (i = true), t[a] ? (s++, a > 0 && l > 0 && t[a - 1] || (n += i ? me("M", l + r, 0.5 + d + r) : me("m", o, 0), o = 0, i = false), l + 1 < e && t[a + 1] || (n += me("h", s), s = 0)) : o++;
    }
    return n;
  }
  Ge.render = function(e, r, n) {
    const o = Ht.getOptions(r), i = e.modules.size, s = e.modules.data, a = i + o.margin * 2, l = o.color.light.a ? "<path " + ke(o.color.light, "fill") + ' d="M0 0h' + a + "v" + a + 'H0z"/>' : "", d = "<path " + ke(o.color.dark, "stroke") + ' d="' + Vt(s, i, o.margin) + '"/>', u = 'viewBox="0 0 ' + a + " " + a + '"', w = '<svg xmlns="http://www.w3.org/2000/svg" ' + (o.width ? 'width="' + o.width + '" height="' + o.width + '" ' : "") + u + ' shape-rendering="crispEdges">' + l + d + `</svg>
`;
    return typeof n == "function" && n(null, w), w;
  };
  const jt = ot, Ie = De, Ze = Ye, Ot = Ge;
  function Ae(t, e, r, n, o) {
    const i = [].slice.call(arguments, 1), s = i.length, a = typeof i[s - 1] == "function";
    if (!a && !jt()) throw new Error("Callback required as last argument");
    if (a) {
      if (s < 2) throw new Error("Too few arguments provided");
      s === 2 ? (o = r, r = e, e = n = void 0) : s === 3 && (e.getContext && typeof o > "u" ? (o = n, n = void 0) : (o = n, n = r, r = e, e = void 0));
    } else {
      if (s < 1) throw new Error("Too few arguments provided");
      return s === 1 ? (r = e, e = n = void 0) : s === 2 && !e.getContext && (n = r, r = e, e = void 0), new Promise(function(l, d) {
        try {
          const u = Ie.create(r, n);
          l(t(u, e, n));
        } catch (u) {
          d(u);
        }
      });
    }
    try {
      const l = Ie.create(r, n);
      o(null, t(l, e, n));
    } catch (l) {
      o(l);
    }
  }
  Z.create = Ie.create;
  Z.toCanvas = Ae.bind(null, Ze.render);
  Z.toDataURL = Ae.bind(null, Ze.renderToDataURL);
  Z.toString = Ae.bind(null, function(t, e, r) {
    return Ot.render(t, r);
  });
  await nt(() => import("./main-DAf3W9C3.js").then(async (m) => {
    await m.__tla;
    return m;
  }), __vite__mapDeps([0,1,2]));
  let Ce;
  function qt() {
    try {
      const t = localStorage.getItem("jarrows_theme"), e = localStorage.getItem("jarrows_colors"), r = localStorage.getItem("jarrows_quality"), n = localStorage.getItem("jarrows_auto_zoom");
      return {
        isDarkTheme: t !== null ? t === "dark" : true,
        useColoredBlocks: e !== null ? e === "colored" : false,
        qualityPreset: r || "balanced",
        autoZoomEnabled: n !== null ? n === "true" : true
      };
    } catch (t) {
      return console.warn("Failed to load preferences:", t), {
        isDarkTheme: true,
        useColoredBlocks: false,
        qualityPreset: "balanced",
        autoZoomEnabled: true
      };
    }
  }
  function te() {
    try {
      localStorage.setItem("jarrows_theme", V ? "dark" : "light"), localStorage.setItem("jarrows_colors", x ? "colored" : "white"), localStorage.setItem("jarrows_quality", D), localStorage.setItem("jarrows_auto_zoom", H.toString());
    } catch (t) {
      console.warn("Failed to save preferences:", t);
    }
  }
  const G = qt();
  let V = G.isDarkTheme, x = G.useColoredBlocks, D = G.qualityPreset || "balanced", H = G.autoZoomEnabled !== void 0 ? G.autoZoomEnabled : true, we = false;
  window.useColoredBlocksDefault = x;
  window.jarrowsQualityPreset = D;
  function Be() {
    const t = window.gameScene, e = window.THREE, r = document.getElementById("theme-icon"), n = document.getElementById("theme-toggle");
    if (!t || !e || !r || !n) {
      console.log("updateThemeIcon: Missing dependencies", {
        scene: !!t,
        THREE: !!e,
        themeIcon: !!r,
        themeToggle: !!n
      });
      return;
    }
    if (!window.setGradientBackground || !window.setupFog) {
      console.log("updateThemeIcon: Waiting for functions...", {
        setGradientBackground: !!window.setGradientBackground,
        setupFog: !!window.setupFog
      }), setTimeout(Be, 50);
      return;
    }
    console.log("updateThemeIcon: Applying theme", {
      isDarkTheme: V
    }), V ? (window.setGradientBackground(t, 986895, 328965), window.setupFog(t, true), r.setAttribute("fill", "none"), r.setAttribute("stroke", "currentColor"), r.setAttribute("stroke-width", "2"), r.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="none"></path>', n.classList.add("active")) : (window.setGradientBackground(t, 5930904, 3824250), window.setupFog(t, false), r.setAttribute("fill", "none"), r.setAttribute("stroke", "currentColor"), r.setAttribute("stroke-width", "2"), r.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', n.classList.remove("active"));
  }
  function Re() {
    const t = document.getElementById("colors-icon"), e = document.getElementById("colors-toggle");
    !t || !e || (x ? (t.setAttribute("stroke", "none"), t.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="#4ecdc4" stroke="none"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="#ffe66d" stroke="none"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="#ff6b6b" stroke="none"></rect>', e.classList.add("active")) : (t.setAttribute("stroke", "currentColor"), t.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="3" width="7" height="7" rx="1" fill="white"></rect><rect x="14" y="14" width="7" height="7" rx="1" fill="white"></rect><rect x="3" y="14" width="7" height="7" rx="1" fill="white"></rect>', e.classList.remove("active")));
  }
  function _e() {
    const t = window.gameBlocks || Ce || [];
    if (!t || t.length === 0) return;
    const e = [
      16739179,
      5164484,
      16770669
    ], r = 16777215;
    t.forEach((n) => {
      if (n.cubes && n.cubes.length > 0) {
        const o = n.cubes[0];
        if (o && o.material) {
          const i = x ? e[n.length - 1] || e[0] : r, s = e[n.length - 1] || e[0];
          o.material.color.setHex(i), n.updateBlockColor && n.updateBlockColor(i, s);
        }
      }
    });
  }
  function ie() {
    if (we) return;
    we = true;
    const t = document.getElementById("theme-toggle"), e = document.getElementById("colors-toggle"), r = document.getElementById("settings-toggle"), n = document.getElementById("settings-menu"), o = document.getElementById("settings-container"), i = document.getElementById("quality-toggle"), s = document.getElementById("quality-label");
    if (console.log("Setting up toggle handlers...", {
      themeToggle: t,
      colorsToggle: e,
      settingsToggle: r
    }), !t || !e || !r) {
      console.warn("Toggle buttons not found, retrying...", {
        themeToggle: t,
        colorsToggle: e,
        settingsToggle: r
      }), we = false, setTimeout(ie, 100);
      return;
    }
    if (r && n && r.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), n.classList.toggle("show");
    }), o && n) {
      const c = function(L) {
        o.contains(L.target) || n.classList.remove("show");
      };
      document.addEventListener("click", c);
      const b = document.querySelector("canvas");
      b && (b.addEventListener("mousedown", function(L) {
        n.classList.remove("show");
      }), b.addEventListener("touchstart", function(L) {
        n.classList.remove("show");
      }, {
        passive: true
      }));
    }
    t.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), console.log("Theme toggle clicked, current state:", V), V = !V, Be(), te();
    }), e.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), console.log("Colors toggle clicked, current state:", x), x = !x, window.useColoredBlocksDefault = x, Re(), _e(), te();
    });
    const a = document.getElementById("audio-toggle"), l = document.getElementById("audio-icon");
    function d() {
      if (!a || !l) return;
      (window.isAudioEnabled ? window.isAudioEnabled() : true) ? (l.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>', a.classList.add("active")) : (l.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M23 9l-6 6M17 9l6 6"></path>', a.classList.remove("active"));
    }
    a && (d(), a.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), window.toggleAudio && (window.toggleAudio(), d());
    }));
    const u = document.getElementById("auto-zoom-toggle"), C = document.getElementById("auto-zoom-icon");
    function w() {
      !u || !C || (H ? (C.innerHTML = '<path d="M23 7l-7 5 7 5V7z" fill="none"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none"></rect>', u.classList.add("active")) : (C.innerHTML = '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 7.16" fill="none"></path><line x1="1" y1="1" x2="23" y2="23" fill="none"></line><path d="M23 7l-7 5 7 5V7z" fill="none"></path>', u.classList.remove("active")));
    }
    u && (w(), window.autoZoomEnabled = H, u.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), H = !H, window.autoZoomEnabled = H, w(), te();
    }));
    const f = document.getElementById("fps-toggle"), p = document.getElementById("fps-display");
    try {
      localStorage.getItem("jarrows_fps_enabled") === "true" && (window.fpsEnabled !== void 0 && (window.fpsEnabled = true), p && (p.style.display = "flex"), f && f.classList.add("active"));
    } catch (c) {
      console.warn("Failed to load FPS preference:", c);
    }
    function E() {
      if (!p) return;
      window.fpsEnabled || false ? p.style.display = "flex" : p.style.display = "none";
    }
    f && (E(), f.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers();
      const L = !(window.fpsEnabled || false);
      window.fpsEnabled !== void 0 && (window.fpsEnabled = L), E(), L ? f.classList.add("active") : f.classList.remove("active");
      try {
        localStorage.setItem("jarrows_fps_enabled", String(L));
      } catch (A) {
        console.warn("Failed to save FPS preference:", A);
      }
    }));
    const T = document.getElementById("autofall-toggle");
    if (T) {
      const c = T.querySelector(".status-dot"), b = localStorage.getItem("jarrows_autofall") === "true";
      b && (T.classList.add("active"), c && c.classList.add("active")), window.autoFallEnabled = b, T.addEventListener("click", function(L) {
        L.preventDefault(), L.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers();
        const A = !T.classList.contains("active");
        T.classList.toggle("active", A), c && c.classList.toggle("active", A), localStorage.setItem("jarrows_autofall", A), window.autoFallEnabled = A, console.log("Auto-fall enabled:", A);
      });
    }
    const m = document.getElementById("select-level-btn"), y = document.getElementById("select-level-modal"), g = document.getElementById("select-level-input"), h = document.getElementById("select-level-confirm"), I = document.getElementById("select-level-cancel");
    m && y && (m.addEventListener("click", function(c) {
      var _a;
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers();
      const b = parseInt(((_a = document.getElementById("timer-level")) == null ? void 0 : _a.textContent) || "1", 10);
      g.value = b, y.style.display = "flex", n.classList.remove("show");
    }), I.addEventListener("click", () => {
      y.style.display = "none";
    }), h.addEventListener("click", () => {
      const c = parseInt(g.value, 10);
      !isNaN(c) && c >= 0 && (y.style.display = "none", window.jumpToLevel ? window.jumpToLevel(c) : (console.error("window.jumpToLevel not found"), window.location.href = window.location.pathname + "?level=" + c));
    }));
    function B() {
      s && (s.textContent = D === "performance" ? "PERF" : D === "battery" ? "BATT" : "BAL", i && i.classList.add("active"));
    }
    function v() {
      const c = (window.jarrowsVersion || "").toString().trim(), b = (window.jarrowsGitSha || "").toString().trim();
      return c ? `v${c}` + (b ? ` @ ${b}` : "") : b ? `commit ${b}` : "v\u2014";
    }
    function S() {
      const c = document.getElementById("settings-version");
      c && (c.textContent = v());
    }
    i && i.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), D = D === "balanced" ? "performance" : D === "performance" ? "battery" : "balanced", window.jarrowsQualityPreset = D, B(), te(), typeof window.applyQualityPreset == "function" && window.applyQualityPreset(D);
    });
    const N = document.getElementById("ver-toggle");
    N && (N.classList.add("active"), N.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), n && n.classList.remove("show");
      const b = document.getElementById("ver-modal"), L = document.getElementById("ver-modal-value");
      L && (L.textContent = v()), b && (b.style.display = "flex");
    }));
    const M = document.getElementById("share-toggle");
    M && M.addEventListener("click", function(c) {
      c.preventDefault(), c.stopPropagation(), window.updateIdleTimers && window.updateIdleTimers(), n && n.classList.remove("show"), Xe();
    });
    const R = document.getElementById("share-pwa-modal"), z = document.getElementById("share-pwa-modal-ok"), k = document.getElementById("share-pwa-modal-close");
    function ce() {
      R && (R.style.display = "none");
    }
    z && z.addEventListener("click", ce), k && k.addEventListener("click", ce), R && R.addEventListener("click", function(c) {
      c.target === R && ce();
    });
    function Xe() {
      const c = document.getElementById("share-pwa-modal");
      if (!c) return;
      const b = window.location.href, L = document.getElementById("share-url-display");
      L && (L.textContent = b);
      const A = document.getElementById("qr-code-canvas");
      A && $e(A, b).catch((tt) => {
        console.error("Error generating QR code:", tt);
      }), et(), c.style.display = "flex";
    }
    async function $e(c, b) {
      try {
        await Z.toCanvas(c, b, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          }
        });
      } catch (L) {
        console.error("Failed to generate QR code:", L);
        const A = c.getContext("2d");
        c.width = 200, c.height = 200, A.fillStyle = "#ffffff", A.fillRect(0, 0, 200, 200), A.fillStyle = "#ff0000", A.font = "12px monospace", A.textAlign = "center", A.fillText("QR Error", 100, 100);
      }
    }
    function et() {
      const c = document.getElementById("pwa-install-content");
      if (!c) return;
      const b = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone || document.referrer.includes("android-app://");
      let L = "";
      b ? L = '<p style="opacity: 0.8; margin-bottom: 12px;">\u2705 App is already installed!</p>' : L = `
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
                    `, c.innerHTML = L;
    }
    const J = document.getElementById("ver-modal"), Se = document.getElementById("ver-modal-ok"), Me = document.getElementById("ver-modal-close-x"), X = document.getElementById("ver-modal-copy");
    function ue() {
      J && (J.style.display = "none");
    }
    Se && Se.addEventListener("click", ue), Me && Me.addEventListener("click", ue), J && J.addEventListener("click", function(c) {
      c.target === J && ue();
    }), X && X.addEventListener("click", async function() {
      const c = v();
      try {
        await navigator.clipboard.writeText(c), X.textContent = "Copied", setTimeout(() => {
          X.textContent = "Copy";
        }, 900);
      } catch {
      }
    }), Be(), Re(), d(), B(), S(), _e(), console.log("Toggle handlers setup complete");
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ie) : ie();
  function We() {
    window.gameScene ? (Ce = window.gameBlocks || Ce, ie()) : setTimeout(We, 100);
  }
  setTimeout(We, 100);
  (function() {
    try {
      const e = "jarrows_seen_quality_notice_v1";
      if (localStorage.getItem(e) === "1") return;
      const r = document.getElementById("quality-preset-modal"), n = document.getElementById("quality-modal-ok");
      if (!r || !n) return;
      r.style.display = "flex", n.addEventListener("click", () => {
        r.style.display = "none", localStorage.setItem(e, "1");
      });
    } catch {
    }
  })();
})();
