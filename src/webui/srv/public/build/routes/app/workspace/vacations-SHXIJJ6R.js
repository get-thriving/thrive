import {
  ContactTag
} from "/build/_shared/chunk-SLZ5UQVD.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  At,
  H,
  Hi,
  Ji,
  Qi,
  Si,
  Vt,
  X,
  Xt,
  Zt,
  k,
  quantize,
  require_isDate,
  require_isIterateeCall,
  require_isObject,
  require_isSymbol,
  require_memoize,
  ti,
  timeFormat,
  ui,
  w
} from "/build/_shared/chunk-QROJZRQX.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  ADateTag
} from "/build/_shared/chunk-NBD44M5V.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  ArrowBackIosNew_default,
  ArrowForwardIos_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  Box_default,
  IconButton_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_jsx_runtime
} from "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
  useNavigate
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/lodash/_baseRange.js
var require_baseRange = __commonJS({
  "../../node_modules/lodash/_baseRange.js"(exports, module) {
    var nativeCeil = Math.ceil;
    var nativeMax = Math.max;
    function baseRange(start, end, step, fromRight) {
      var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }
    module.exports = baseRange;
  }
});

// ../../node_modules/lodash/_trimmedEndIndex.js
var require_trimmedEndIndex = __commonJS({
  "../../node_modules/lodash/_trimmedEndIndex.js"(exports, module) {
    var reWhitespace = /\s/;
    function trimmedEndIndex(string) {
      var index = string.length;
      while (index-- && reWhitespace.test(string.charAt(index))) {
      }
      return index;
    }
    module.exports = trimmedEndIndex;
  }
});

// ../../node_modules/lodash/_baseTrim.js
var require_baseTrim = __commonJS({
  "../../node_modules/lodash/_baseTrim.js"(exports, module) {
    var trimmedEndIndex = require_trimmedEndIndex();
    var reTrimStart = /^\s+/;
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    module.exports = baseTrim;
  }
});

// ../../node_modules/lodash/toNumber.js
var require_toNumber = __commonJS({
  "../../node_modules/lodash/toNumber.js"(exports, module) {
    var baseTrim = require_baseTrim();
    var isObject = require_isObject();
    var isSymbol = require_isSymbol();
    var NAN = 0 / 0;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module.exports = toNumber;
  }
});

// ../../node_modules/lodash/toFinite.js
var require_toFinite = __commonJS({
  "../../node_modules/lodash/toFinite.js"(exports, module) {
    var toNumber = require_toNumber();
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    module.exports = toFinite;
  }
});

// ../../node_modules/lodash/_createRange.js
var require_createRange = __commonJS({
  "../../node_modules/lodash/_createRange.js"(exports, module) {
    var baseRange = require_baseRange();
    var isIterateeCall = require_isIterateeCall();
    var toFinite = require_toFinite();
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
          end = step = void 0;
        }
        start = toFinite(start);
        if (end === void 0) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }
    module.exports = createRange;
  }
});

// ../../node_modules/lodash/range.js
var require_range = __commonJS({
  "../../node_modules/lodash/range.js"(exports, module) {
    var createRange = require_createRange();
    var range = createRange();
    module.exports = range;
  }
});

// ../../node_modules/@nivo/calendar/dist/nivo-calendar.es.js
var s = __toESM(require_react());
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_range = __toESM(require_range());
var import_memoize = __toESM(require_memoize());
var import_isDate = __toESM(require_isDate());

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/interval.js
var t0 = /* @__PURE__ */ new Date();
var t1 = /* @__PURE__ */ new Date();
function newInterval(floori, offseti, count, field) {
  function interval(date) {
    return floori(date = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date)), date;
  }
  interval.floor = function(date) {
    return floori(date = /* @__PURE__ */ new Date(+date)), date;
  };
  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };
  interval.round = function(date) {
    var d0 = interval(date), d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };
  interval.offset = function(date, step) {
    return offseti(date = /* @__PURE__ */ new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };
  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0))
      return range;
    do
      range.push(previous = /* @__PURE__ */ new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };
  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date)
        while (floori(date), !test(date))
          date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0)
          while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {
            }
          }
        else
          while (--step >= 0) {
            while (offseti(date, 1), !test(date)) {
            }
          }
      }
    });
  };
  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };
    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d) {
        return field(d) % step === 0;
      } : function(d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }
  return interval;
}

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/duration.js
var durationMinute = 6e4;
var durationDay = 864e5;
var durationWeek = 6048e5;

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/day.js
var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});
var day_default = day;
var days = day.range;

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/week.js
function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}
var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);
var sundays = sunday.range;
var mondays = monday.range;
var tuesdays = tuesday.range;
var wednesdays = wednesday.range;
var thursdays = thursday.range;
var fridays = friday.range;
var saturdays = saturday.range;

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/month.js
var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});
var months = month.range;

// ../../node_modules/@nivo/calendar/node_modules/d3-time/src/year.js
var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});
year.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k3) * k3);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k3);
  });
};
var year_default = year;
var years = year.range;

// ../../node_modules/@nivo/calendar/dist/nivo-calendar.es.js
function P() {
  return P = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o)
        Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
  }, P.apply(this, arguments);
}
function F(e, t) {
  if (null == e)
    return {};
  var o, n, i = {}, r = Object.keys(e);
  for (n = 0; n < r.length; n++)
    o = r[n], t.indexOf(o) >= 0 || (i[o] = e[o]);
  return i;
}
var R;
var T = (0, import_react.memo)(function(e) {
  var t = e.years, o = e.legend, n = e.theme;
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: t.map(function(e2) {
    return (0, import_jsx_runtime.jsx)("text", { transform: "translate(" + e2.x + "," + e2.y + ") rotate(" + e2.rotation + ")", textAnchor: "middle", style: n.labels.text, children: o(e2.year) }, e2.year);
  }) });
});
var Y = (0, import_react.memo)(function(e) {
  var t = e.path, o = e.borderWidth, n = e.borderColor;
  return (0, import_jsx_runtime.jsx)("path", { d: t, style: { fill: "none", strokeWidth: o, stroke: n, pointerEvents: "none" } });
});
var j = (0, import_react.memo)(function(e) {
  var t = e.months, o = e.legend, n = e.theme;
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: t.map(function(e2) {
    return (0, import_jsx_runtime.jsx)("text", { transform: "translate(" + e2.x + "," + e2.y + ") rotate(" + e2.rotation + ")", textAnchor: "middle", style: n.labels.text, children: o(e2.year, e2.month, e2.date) }, e2.date.toString() + ".legend");
  }) });
});
var q = (0, import_react.memo)(function(e) {
  var t = e.data, o = e.x, n = e.y, i = e.size, r = e.color, a = e.borderWidth, d = e.borderColor, l = e.isInteractive, c = e.tooltip, h = e.onMouseEnter, u = e.onMouseMove, g2 = e.onMouseLeave, m2 = e.onClick, v2 = e.formatValue, y2 = k(), p2 = y2.showTooltipFromEvent, x2 = y2.hideTooltip, S2 = (0, import_react.useCallback)(function(e2) {
    if ("value" in t) {
      var o2 = P({}, t, { value: v2(t.value), data: P({}, t.data) });
      p2(s.createElement(c, P({}, o2)), e2), null == h || h(t, e2);
    }
  }, [p2, c, t, h, v2]), w3 = (0, import_react.useCallback)(function(e2) {
    if ("value" in t) {
      var o2 = P({}, t, { value: v2(t.value), data: P({}, t.data) });
      p2(s.createElement(c, P({}, o2)), e2), u && u(t, e2);
    }
  }, [p2, c, t, u, v2]), W = (0, import_react.useCallback)(function(e2) {
    "value" in t && (x2(), null == g2 || g2(t, e2));
  }, [x2, t, g2]), M = (0, import_react.useCallback)(function(e2) {
    return null == m2 ? void 0 : m2(t, e2);
  }, [t, m2]);
  return (0, import_jsx_runtime.jsx)("rect", { x: o, y: n, width: i, height: i, style: { fill: r, strokeWidth: a, stroke: d }, onMouseEnter: l ? S2 : void 0, onMouseMove: l ? w3 : void 0, onMouseLeave: l ? W : void 0, onClick: l ? M : void 0 });
});
var A = (0, import_react.memo)(function(e) {
  var t = e.value, o = e.day, n = e.color;
  return void 0 === t || isNaN(Number(t)) ? null : (0, import_jsx_runtime.jsx)(w, { id: o, value: t, color: n, enableChip: true });
});
var X2 = timeFormat("%b");
var N = { colors: ["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"], align: "center", direction: "horizontal", emptyColor: "#fff", minValue: 0, maxValue: "auto", yearSpacing: 30, yearLegend: function(e) {
  return e;
}, yearLegendPosition: "before", yearLegendOffset: 10, monthBorderWidth: 2, monthBorderColor: "#000", monthSpacing: 0, monthLegend: function(e, t, o) {
  return X2(o);
}, monthLegendPosition: "before", monthLegendOffset: 10, daySpacing: 0, dayBorderWidth: 1, dayBorderColor: "#000", isInteractive: true, legends: [], tooltip: A };
var Z = P({}, N, { role: "img" });
var G = P({}, N, { pixelRatio: "undefined" != typeof window && null != (R = window.devicePixelRatio) ? R : 1 });
var J = P({}, Z, { dayBorderColor: "#fff", dayRadius: 0, square: true, weekdayLegendOffset: 75 });
var K = function(e, t, o) {
  var n = e.map(function(e2) {
    return e2.value;
  });
  return ["auto" === t ? Math.min.apply(Math, n) : t, "auto" === o ? Math.max.apply(Math, n) : o];
};
var Q = (0, import_memoize.default)(function(e) {
  var t, o = e.date, n = e.cellSize, i = e.yearIndex, r = e.yearSpacing, a = e.monthSpacing, d = e.daySpacing, l = e.direction, c = e.originX, h = e.originY, u = new Date(o.getFullYear(), o.getMonth() + 1, 0), s2 = sunday.count(year_default(o), o), g2 = sunday.count(year_default(u), u), f2 = o.getDay(), m2 = u.getDay(), v2 = c, y2 = h, p2 = i * (7 * (n + d) + r), x2 = o.getMonth() * a;
  "horizontal" === l ? (y2 += p2, v2 += x2) : (y2 += x2, v2 += p2);
  var b2 = { x: v2, y: y2, width: 0, height: 0 };
  return "horizontal" === l ? (t = ["M" + (v2 + (s2 + 1) * (n + d)) + "," + (y2 + f2 * (n + d)), "H" + (v2 + s2 * (n + d)) + "V" + (y2 + 7 * (n + d)), "H" + (v2 + g2 * (n + d)) + "V" + (y2 + (m2 + 1) * (n + d)), "H" + (v2 + (g2 + 1) * (n + d)) + "V" + y2, "H" + (v2 + (s2 + 1) * (n + d)) + "Z"].join(""), b2.x = v2 + s2 * (n + d), b2.width = v2 + (g2 + 1) * (n + d) - b2.x, b2.height = 7 * (n + d)) : (t = ["M" + (v2 + f2 * (n + d)) + "," + (y2 + (s2 + 1) * (n + d)), "H" + v2 + "V" + (y2 + (g2 + 1) * (n + d)), "H" + (v2 + (m2 + 1) * (n + d)) + "V" + (y2 + g2 * (n + d)), "H" + (v2 + 7 * (n + d)) + "V" + (y2 + s2 * (n + d)), "H" + (v2 + f2 * (n + d)) + "Z"].join(""), b2.y = y2 + s2 * (n + d), b2.width = 7 * (n + d), b2.height = y2 + (g2 + 1) * (n + d) - b2.y), { path: t, bbox: b2 };
}, function(e) {
  var t = e.date, o = e.cellSize, n = e.yearIndex, i = e.yearSpacing, r = e.monthSpacing, a = e.daySpacing, d = e.direction, l = e.originX, c = e.originY;
  return t.toString() + "." + o + "." + n + "." + i + "." + r + "." + a + "." + d + "." + l + "." + c;
});
var U = timeFormat("%Y-%m-%d");
var $ = function(t) {
  var o, n = t.width, i = t.height, r = t.from, a = t.to, d = t.direction, l = t.yearSpacing, c = t.monthSpacing, h = t.daySpacing, u = t.align, s2 = (0, import_isDate.default)(r) ? r : new Date(r), g2 = (0, import_isDate.default)(a) ? a : new Date(a), f2 = (0, import_range.default)(s2.getFullYear(), g2.getFullYear() + 1), m2 = Math.max.apply(Math, f2.map(function(e) {
    return sundays(new Date(e, 0, 1), new Date(e + 1, 0, 1)).length;
  })) + 1, v2 = function(e) {
    var t2, o2, n2 = e.width, i2 = e.height, r2 = e.direction, a2 = e.yearRange, d2 = e.yearSpacing, l2 = e.monthSpacing, c2 = e.daySpacing, h2 = e.maxWeeks;
    return "horizontal" === r2 ? (t2 = (n2 - 12 * l2 - c2 * h2) / h2, o2 = (i2 - (a2.length - 1) * d2 - a2.length * (8 * c2)) / (7 * a2.length)) : (t2 = (n2 - (a2.length - 1) * d2 - a2.length * (8 * c2)) / (7 * a2.length), o2 = (i2 - 12 * l2 - c2 * h2) / h2), Math.min(t2, o2);
  }({ width: n, height: i, direction: d, yearRange: f2, yearSpacing: l, monthSpacing: c, daySpacing: h, maxWeeks: m2 }), y2 = v2 * m2 + h * m2 + 12 * c, p2 = 7 * (v2 + h) * f2.length + l * (f2.length - 1), x2 = "horizontal" === d ? y2 : p2, b2 = "horizontal" === d ? p2 : y2, S2 = Hi({ x: 0, y: 0, width: x2, height: b2 }, { x: 0, y: 0, width: n, height: i }, u), w3 = S2[0], L = S2[1];
  o = "horizontal" === d ? function(e, t2, o2, n2) {
    return function(i2, r2, a2, d2) {
      return { x: i2 + sunday.count(year_default(a2), a2) * (e + n2) + n2 / 2 + a2.getMonth() * o2, y: r2 + a2.getDay() * (e + n2) + n2 / 2 + d2 * (t2 + 7 * (e + n2)) };
    };
  }(v2, l, c, h) : function(e, t2, o2, n2) {
    return function(i2, r2, a2, d2) {
      var l2 = sunday.count(year_default(a2), a2);
      return { x: i2 + a2.getDay() * (e + n2) + n2 / 2 + d2 * (t2 + 7 * (e + n2)), y: r2 + l2 * (e + n2) + n2 / 2 + a2.getMonth() * o2 };
    };
  }(v2, l, c, h);
  var W = [], M = [], C = [];
  return f2.forEach(function(e, t2) {
    var n2 = new Date(e, 0, 1), i2 = new Date(e + 1, 0, 1);
    C = C.concat(days(n2, i2).map(function(e2) {
      return P({ date: e2, day: U(e2), size: v2 }, o(w3, L, e2, t2));
    }));
    var r2 = months(n2, i2).map(function(e2) {
      return P({ date: e2, year: e2.getFullYear(), month: e2.getMonth() }, Q({ originX: w3, originY: L, date: e2, direction: d, yearIndex: t2, yearSpacing: l, monthSpacing: c, daySpacing: h, cellSize: v2 }));
    });
    M = M.concat(r2), W.push({ year: e, bbox: { x: r2[0].bbox.x, y: r2[0].bbox.y, width: r2[11].bbox.x - r2[0].bbox.x + r2[11].bbox.width, height: r2[11].bbox.y - r2[0].bbox.y + r2[11].bbox.height } });
  }), { years: W, months: M, days: C, cellSize: v2, calendarWidth: x2, calendarHeight: b2, originX: w3, originY: L };
};
var _ = function(e) {
  var t = e.days, o = e.data, n = e.colorScale, i = e.emptyColor;
  return t.map(function(e2) {
    var t2 = o.find(function(t3) {
      return t3.day === e2.day;
    });
    return P({}, e2, t2 ? { color: n(t2.value), data: t2, value: t2.value } : { color: i });
  });
};
var ee = function(e) {
  var t = e.years, o = e.direction, n = e.position, i = e.offset;
  return t.map(function(e2) {
    var t2 = 0, r = 0, a = 0;
    return "horizontal" === o && "before" === n ? (t2 = e2.bbox.x - i, r = e2.bbox.y + e2.bbox.height / 2, a = -90) : "horizontal" === o && "after" === n ? (t2 = e2.bbox.x + e2.bbox.width + i, r = e2.bbox.y + e2.bbox.height / 2, a = -90) : "vertical" === o && "before" === n ? (t2 = e2.bbox.x + e2.bbox.width / 2, r = e2.bbox.y - i) : (t2 = e2.bbox.x + e2.bbox.width / 2, r = e2.bbox.y + e2.bbox.height + i), P({}, e2, { x: t2, y: r, rotation: a });
  });
};
var te = function(e) {
  var t = e.months, o = e.direction, n = e.position, i = e.offset;
  return t.map(function(e2) {
    var t2 = 0, r = 0, a = 0;
    return "horizontal" === o && "before" === n ? (t2 = e2.bbox.x + e2.bbox.width / 2, r = e2.bbox.y - i) : "horizontal" === o && "after" === n ? (t2 = e2.bbox.x + e2.bbox.width / 2, r = e2.bbox.y + e2.bbox.height + i) : "vertical" === o && "before" === n ? (t2 = e2.bbox.x - i, r = e2.bbox.y + e2.bbox.height / 2, a = -90) : (t2 = e2.bbox.x + e2.bbox.width + i, r = e2.bbox.y + e2.bbox.height / 2, a = -90), P({}, e2, { x: t2, y: r, rotation: a });
  });
};
var oe = function(e) {
  var t = e.width, o = e.height, n = e.from, i = e.to, r = e.direction, a = e.yearSpacing, d = e.monthSpacing, l = e.daySpacing, c = e.align;
  return (0, import_react.useMemo)(function() {
    return $({ width: t, height: o, from: n, to: i, direction: r, yearSpacing: a, monthSpacing: d, daySpacing: l, align: c });
  }, [t, o, n, i, r, a, d, l, c]);
};
var ne = function(e) {
  var t = e.data, o = e.minValue, n = e.maxValue, i = e.colors, r = e.colorScale;
  return (0, import_react.useMemo)(function() {
    if (r)
      return r;
    var e2 = K(t, o, n);
    return quantize().domain(e2).range(i);
  }, [t, o, n, i, r]);
};
var ie = function(e) {
  var t = e.years, o = e.direction, n = e.yearLegendPosition, i = e.yearLegendOffset;
  return (0, import_react.useMemo)(function() {
    return ee({ years: t, direction: o, position: n, offset: i });
  }, [t, o, n, i]);
};
var re = function(e) {
  var t = e.months, o = e.direction, n = e.monthLegendPosition, i = e.monthLegendOffset;
  return (0, import_react.useMemo)(function() {
    return te({ months: t, direction: o, position: n, offset: i });
  }, [t, o, n, i]);
};
var ae = function(e) {
  var t = e.days, o = e.data, n = e.colorScale, i = e.emptyColor;
  return (0, import_react.useMemo)(function() {
    return _({ days: t, data: o, colorScale: n, emptyColor: i });
  }, [t, o, n, i]);
};
var ue = timeFormat("%Y-%m-%d");
var se = function(e) {
  var t, o, n = e.direction, i = e.daySpacing, r = e.offset, a = e.square, d = e.totalDays, l = e.width, c = e.height;
  "horizontal" === n ? (l -= r, t = 7, o = Math.ceil(d / 7)) : (c -= r, o = 7, t = Math.ceil(d / 7));
  var h = (c - i * (t + 1)) / t, u = (l - i * (o + 1)) / o, s2 = Math.min(h, u);
  return { columns: o, rows: t, cellHeight: a ? s2 : h, cellWidth: a ? s2 : u };
};
var ge = function(e) {
  var t = e.direction, o = e.colorScale, n = e.emptyColor, i = e.from, r = e.to, a = e.data, d = e.cellWidth, l = e.cellHeight, c = e.daySpacing, h = e.offset, u = c, s2 = c;
  "horizontal" === t ? u += h : s2 += h;
  var g2 = i || a[0].date, f2 = r || a[a.length - 1].date, m2 = (0, import_isDate.default)(g2) ? g2 : new Date(g2), v2 = (0, import_isDate.default)(f2) ? f2 : new Date(f2), y2 = days(m2, v2).map(function(e2) {
    return { date: e2, day: ue(e2) };
  }).map(function(e2) {
    var i2 = a.find(function(t2) {
      return t2.day === e2.day;
    }), r2 = function(e3) {
      var t2 = e3.startDate, o2 = e3.date, n2 = e3.direction, i3 = sunday.count(t2, o2), r3 = o2.getMonth(), a2 = o2.getFullYear(), d2 = 0, l2 = 0;
      return "horizontal" === n2 ? (d2 = i3, l2 = o2.getDay()) : (d2 = o2.getDay(), l2 = i3), { currentColumn: d2, year: a2, currentRow: l2, firstWeek: i3, month: r3, date: o2 };
    }({ startDate: m2, date: e2.date, direction: t }), h2 = r2.currentColumn, g3 = r2.currentRow, f3 = r2.firstWeek, v3 = r2.year, y3 = r2.month, p2 = r2.date, x2 = { x: u + c * h2 + d * h2, y: s2 + c * g3 + l * g3 };
    return i2 ? P({}, i2, { coordinates: x2, firstWeek: f3, month: y3, year: v3, date: p2, color: o(i2.value), width: d, height: l }) : P({}, e2, { coordinates: x2, firstWeek: f3, month: y3, year: v3, date: p2, color: n, width: d, height: l });
  });
  return y2;
};
var fe = function(e) {
  var t = e.cellHeight, o = e.cellWidth, n = e.direction, i = e.daySpacing, r = e.ticks, a = void 0 === r ? [1, 3, 5] : r, d = e.arrayOfWeekdays, l = void 0 === d ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : d, c = o + i, h = t + i;
  return a.map(function(e2) {
    return { value: l[e2], rotation: "horizontal" === n ? 0 : -90, y: "horizontal" === n ? h * (e2 + 1) - h / 3 : 0, x: "horizontal" === n ? 0 : c * (e2 + 1) - c / 3 };
  });
};
var me = function(e) {
  var t = e.direction, o = e.daySpacing, n = e.days, i = e.cellHeight, r = e.cellWidth;
  return n.reduce(function(e2, n2) {
    if (e2.weeks.length === n2.firstWeek) {
      e2.weeks.push(n2);
      var a = n2.year + "-" + n2.month;
      if (Object.keys(e2.months).includes(a))
        "horizontal" === t ? e2.months[a].bbox.width = (n2.firstWeek - e2.months[a].firstWeek) * (r + o) : e2.months[a].bbox.height = (n2.firstWeek - e2.months[a].firstWeek) * (i + o);
      else {
        var d = { x: 0, y: 0, width: 0, height: 0 };
        "horizontal" === t ? (d.x = n2.coordinates.x - o, d.height = i + o, d.width = r + 2 * o) : (d.y = n2.coordinates.y - o, d.height = i + 2 * o, d.width = r + 2 * o), e2.months[a] = { date: n2.date, bbox: d, firstWeek: n2.firstWeek, month: 0, year: 0 };
      }
    }
    return e2;
  }, { months: {}, weeks: [] });
};
var ve = function(e) {
  var t, o, n = e.from, i = e.to, r = e.data;
  return t = n ? (0, import_isDate.default)(n) ? n : new Date(n) : r[0].date, o = n && i ? (0, import_isDate.default)(i) ? i : new Date(i) : r[r.length - 1].date, t.getDay() + day_default.count(t, o);
};
var ye = (0, import_react.memo)(function(e) {
  var t = e.data, o = e.x, n = e.ry, i = void 0 === n ? 5 : n, r = e.rx, a = void 0 === r ? 5 : r, d = e.y, l = e.width, c = e.height, h = e.color, u = e.borderWidth, s2 = e.borderColor, g2 = e.isInteractive, m2 = e.tooltip, y2 = e.onMouseEnter, p2 = e.onMouseMove, x2 = e.onMouseLeave, S2 = e.onClick, w3 = e.formatValue, W = k(), M = W.showTooltipFromEvent, C = W.hideTooltip, k3 = (0, import_react.useCallback)(function(e2) {
    if ("value" in t) {
      var o2 = P({}, t, { value: w3(t.value) });
      M((0, import_react.createElement)(m2, P({}, o2)), e2), null == y2 || y2(t, e2);
    }
  }, [M, m2, t, y2, w3]), z2 = (0, import_react.useCallback)(function(e2) {
    if ("value" in t) {
      var o2 = P({}, t, { value: w3(t.value) });
      M((0, import_react.createElement)(m2, P({}, o2)), e2), null == p2 || p2(t, e2);
    }
  }, [M, m2, t, p2, w3]), V2 = (0, import_react.useCallback)(function(e2) {
    "value" in t && (C(), null == x2 || x2(t, e2));
  }, [C, t, x2]), O = (0, import_react.useCallback)(function(e2) {
    return null == S2 ? void 0 : S2(t, e2);
  }, [t, S2]);
  return (0, import_jsx_runtime.jsx)("rect", { x: o, y: d, rx: a, ry: i, width: l, height: c, style: { fill: h, strokeWidth: u, stroke: s2 }, onMouseEnter: g2 ? k3 : void 0, onMouseMove: g2 ? z2 : void 0, onMouseLeave: g2 ? V2 : void 0, onClick: g2 ? O : void 0 });
});
var pe = ["isInteractive", "renderWrapper", "theme"];
var xe = function(e) {
  var t = e.margin, a = e.width, d = e.height, l = e.square, c = void 0 === l ? J.square : l, u = e.colors, s2 = void 0 === u ? J.colors : u, g2 = e.colorScale, f2 = e.emptyColor, v2 = void 0 === f2 ? J.emptyColor : f2, y2 = e.from, p2 = e.to, x2 = e.data, S2 = e.direction, L = void 0 === S2 ? J.direction : S2, W = e.minValue, M = void 0 === W ? J.minValue : W, C = e.maxValue, k3 = void 0 === C ? J.maxValue : C, z2 = e.valueFormat, V2 = e.legendFormat, O = e.monthLegend, I = void 0 === O ? J.monthLegend : O, H2 = e.monthLegendOffset, D = void 0 === H2 ? J.monthLegendOffset : H2, B = e.monthLegendPosition, E = void 0 === B ? J.monthLegendPosition : B, F2 = e.weekdayLegendOffset, R2 = void 0 === F2 ? J.weekdayLegendOffset : F2, T2 = e.weekdayTicks, Y2 = e.dayBorderColor, q2 = void 0 === Y2 ? J.dayBorderColor : Y2, A2 = e.dayBorderWidth, X3 = void 0 === A2 ? J.dayBorderWidth : A2, N2 = e.daySpacing, Z2 = void 0 === N2 ? J.daySpacing : N2, G2 = e.dayRadius, K2 = void 0 === G2 ? J.dayRadius : G2, Q2 = e.isInteractive, U2 = void 0 === Q2 ? J.isInteractive : Q2, $2 = e.tooltip, _2 = void 0 === $2 ? J.tooltip : $2, ee2 = e.onClick, te2 = e.onMouseEnter, oe2 = e.onMouseLeave, ie2 = e.onMouseMove, ae2 = e.legends, de = void 0 === ae2 ? J.legends : ae2, le = e.role, ce = void 0 === le ? J.role : le, he = At(a, d, t), ue2 = he.margin, pe2 = he.innerWidth, xe2 = he.innerHeight, be2 = he.outerWidth, Se2 = he.outerHeight, we = (0, import_react.useMemo)(function() {
    return x2.map(function(e2) {
      return P({}, e2, { date: /* @__PURE__ */ new Date(e2.day + "T00:00:00") });
    }).sort(function(e2, t2) {
      return e2.day.localeCompare(t2.day);
    });
  }, [x2]), Le2 = Vt(), We = ne({ data: we, minValue: M, maxValue: k3, colors: s2, colorScale: g2 }), Me2 = ve({ from: y2, to: p2, data: we }), Ce2 = se({ square: c, offset: R2, totalDays: Me2, width: pe2, height: xe2, daySpacing: Z2, direction: L }), ke = Ce2.cellHeight, ze = Ce2.cellWidth, Ve = ge({ offset: R2, colorScale: We, emptyColor: v2, cellHeight: ke, cellWidth: ze, from: y2, to: p2, data: we, direction: L, daySpacing: Z2 }), Oe = Object.values(me({ daySpacing: Z2, direction: L, cellHeight: ke, cellWidth: ze, days: Ve }).months), Ie = fe({ direction: L, cellHeight: ke, cellWidth: ze, daySpacing: Z2, ticks: T2 }), He = re({ months: Oe, direction: L, monthLegendPosition: E, monthLegendOffset: D }), De = Xt(z2), Be = Xt(V2);
  return (0, import_jsx_runtime.jsxs)(Si, { width: be2, height: Se2, margin: ue2, role: ce, children: [Ie.map(function(e2) {
    return (0, import_jsx_runtime.jsx)("text", { transform: "translate(" + e2.x + "," + e2.y + ") rotate(" + e2.rotation + ")", textAnchor: "left", style: Le2.labels.text, children: e2.value }, e2.value);
  }), Ve.map(function(e2) {
    return (0, import_jsx_runtime.jsx)(ye, { data: e2, x: e2.coordinates.x, rx: K2, y: e2.coordinates.y, ry: K2, width: ze, height: ke, color: e2.color, borderWidth: X3, borderColor: q2, onMouseEnter: te2, onMouseLeave: oe2, onMouseMove: ie2, isInteractive: U2, tooltip: _2, onClick: ee2, formatValue: De }, e2.date.toString());
  }), (0, import_jsx_runtime.jsx)(j, { months: He, legend: I, theme: Le2 }), de.map(function(e2, t2) {
    var o = We.ticks(e2.itemCount).map(function(e3) {
      return { id: e3, label: Be(e3), color: We(e3) };
    });
    return (0, import_jsx_runtime.jsx)(X, P({}, e2, { containerWidth: a, containerHeight: d, data: o }), t2);
  })] });
};
var be = function(e) {
  var o = e.isInteractive, n = void 0 === o ? J.isInteractive : o, i = e.renderWrapper, r = e.theme, a = F(e, pe);
  return (0, import_jsx_runtime.jsx)(Zt, { isInteractive: n, renderWrapper: i, theme: r, children: (0, import_jsx_runtime.jsx)(xe, P({ isInteractive: n }, a)) });
};
var Se = function(e) {
  return (0, import_jsx_runtime.jsx)(ti, { children: function(t) {
    var o = t.width, n = t.height;
    return (0, import_jsx_runtime.jsx)(be, P({ width: o, height: n }, e));
  } });
};
var Le = ["months", "years"];
var Me = function(e, t, o, n, i, r) {
  var a = Qi(t, e), d = a[0], h = a[1];
  return o.find(function(e2) {
    return "value" in e2 && Ji(e2.x + r.left - i / 2, e2.y + r.top - i / 2, n + i, n + i, d, h);
  });
};
var Ce = (0, import_react.memo)(function(e) {
  var t = e.margin, r = e.width, a = e.height, l = e.pixelRatio, c = void 0 === l ? G.pixelRatio : l, h = e.align, g2 = void 0 === h ? G.align : h, m2 = e.colors, v2 = void 0 === m2 ? G.colors : m2, S2 = e.colorScale, w3 = e.data, W = e.direction, M = void 0 === W ? G.direction : W, C = e.emptyColor, k3 = void 0 === C ? G.emptyColor : C, z2 = e.from, V2 = e.to, O = e.minValue, I = void 0 === O ? G.minValue : O, H2 = e.maxValue, D = void 0 === H2 ? G.maxValue : H2, B = e.valueFormat, E = e.legendFormat, R2 = e.yearLegend, T2 = void 0 === R2 ? G.yearLegend : R2, Y2 = e.yearLegendOffset, j2 = void 0 === Y2 ? G.yearLegendOffset : Y2, q2 = e.yearLegendPosition, A2 = void 0 === q2 ? G.yearLegendPosition : q2, X3 = e.yearSpacing, N2 = void 0 === X3 ? G.yearSpacing : X3, Z2 = e.monthLegend, J2 = void 0 === Z2 ? G.monthLegend : Z2, K2 = e.monthLegendOffset, Q2 = void 0 === K2 ? G.monthLegendOffset : K2, U2 = e.monthLegendPosition, $2 = void 0 === U2 ? G.monthLegendPosition : U2, _2 = e.monthSpacing, ee2 = void 0 === _2 ? G.monthSpacing : _2, te2 = e.dayBorderColor, de = void 0 === te2 ? G.dayBorderColor : te2, le = e.dayBorderWidth, ce = void 0 === le ? G.dayBorderWidth : le, he = e.daySpacing, ue2 = void 0 === he ? G.daySpacing : he, se2 = e.isInteractive, ge2 = void 0 === se2 ? G.isInteractive : se2, fe2 = e.tooltip, me2 = void 0 === fe2 ? G.tooltip : fe2, ve2 = e.onClick, ye2 = e.onMouseEnter, pe2 = e.onMouseLeave, xe2 = e.onMouseMove, be2 = e.legends, Se2 = void 0 === be2 ? G.legends : be2, we = (0, import_react.useRef)(null), We = At(r, a, t), Ce2 = We.innerWidth, ke = We.innerHeight, ze = We.outerWidth, Ve = We.outerHeight, Oe = We.margin, Ie = oe({ width: Ce2, height: ke, from: z2, to: V2, direction: M, yearSpacing: N2, monthSpacing: ee2, daySpacing: ue2, align: g2 }), He = Ie.months, De = Ie.years, Be = F(Ie, Le), Ee = ne({ data: w3, minValue: I, maxValue: D, colors: v2, colorScale: S2 }), Pe = re({ months: He, direction: M, monthLegendPosition: $2, monthLegendOffset: Q2 }), Fe = ie({ years: De, direction: M, yearLegendPosition: A2, yearLegendOffset: j2 }), Re = ae({ days: Be.days, data: w3, colorScale: Ee, emptyColor: k3 }), Te = (0, import_react.useState)(null), Ye = Te[0], je = Te[1], qe = Vt(), Ae = Xt(B), Xe = Xt(E), Ne = k(), Ze = Ne.showTooltipFromEvent, Ge = Ne.hideTooltip;
  (0, import_react.useEffect)(function() {
    var e2;
    if (we.current) {
      we.current.width = ze * c, we.current.height = Ve * c;
      var t2 = we.current.getContext("2d");
      t2 && (t2.scale(c, c), t2.fillStyle = qe.background, t2.fillRect(0, 0, ze, Ve), t2.translate(Oe.left, Oe.top), Re.forEach(function(e3) {
        t2.fillStyle = e3.color, ce > 0 && (t2.strokeStyle = de, t2.lineWidth = ce), t2.beginPath(), t2.rect(e3.x, e3.y, e3.size, e3.size), t2.fill(), ce > 0 && t2.stroke();
      }), t2.textAlign = "center", t2.textBaseline = "middle", t2.fillStyle = null != (e2 = qe.labels.text.fill) ? e2 : "", t2.font = qe.labels.text.fontSize + "px " + qe.labels.text.fontFamily, Pe.forEach(function(e3) {
        t2.save(), t2.translate(e3.x, e3.y), t2.rotate(ui(e3.rotation)), t2.fillText(String(J2(e3.year, e3.month, e3.date)), 0, 0), t2.restore();
      }), Fe.forEach(function(e3) {
        t2.save(), t2.translate(e3.x, e3.y), t2.rotate(ui(e3.rotation)), t2.fillText(String(T2(e3.year)), 0, 0), t2.restore();
      }), Se2.forEach(function(e3) {
        var o = Ee.ticks(e3.itemCount).map(function(e4) {
          return { id: e4, label: Xe(e4), color: Ee(e4) };
        });
        H(t2, P({}, e3, { data: o, containerWidth: Ce2, containerHeight: ke, theme: qe }));
      }));
    }
  }, [we, ke, Ce2, ze, Ve, c, Oe, Re, de, ce, S2, T2, Fe, J2, Pe, Se2, qe, Xe, Ee]);
  var Je = (0, import_react.useCallback)(function(e2) {
    if (we.current) {
      var t2 = Me(e2, we.current, Re, Re[0].size, ce, Oe);
      if (t2) {
        if (je(t2), !("value" in t2))
          return;
        var o = P({}, t2, { value: Ae(t2.value), data: P({}, t2.data) });
        Ze(s.createElement(me2, P({}, o)), e2), !Ye && (null == ye2 || ye2(t2, e2)), null == xe2 || xe2(t2, e2), Ye && (null == pe2 || pe2(t2, e2));
      } else
        Ge(), t2 && (null == pe2 || pe2(t2, e2));
    }
  }, [we, Ye, Oe, Re, je, Ae, ce, Ze, Ge, ye2, xe2, pe2, me2]), Ke = (0, import_react.useCallback)(function() {
    je(null), Ge();
  }, [je, Ge]), Qe = (0, import_react.useCallback)(function(e2) {
    if (ve2 && we.current) {
      var t2 = Me(e2, we.current, Re, Re[0].size, ue2, Oe);
      t2 && ve2(t2, e2);
    }
  }, [we, ue2, Oe, Re, ve2]);
  return (0, import_jsx_runtime.jsx)("canvas", { ref: we, width: ze * c, height: Ve * c, style: { width: ze, height: Ve }, onMouseEnter: ge2 ? Je : void 0, onMouseMove: ge2 ? Je : void 0, onMouseLeave: ge2 ? Ke : void 0, onClick: ge2 ? Qe : void 0 });
});

// app/routes/app/workspace/vacations.tsx
var import_node = __toESM(require_node());
var import_react3 = __toESM(require_react());
var import_webapi_client = __toESM(require_dist());

// ../core/jupiter/core/vacations/root.ts
function sortVacationsNaturally(vacations) {
  return [...vacations].sort((v1, v2) => {
    const v1Start = aDateToDate(v1.start_date).toISO();
    const v2Start = aDateToDate(v2.start_date).toISO();
    if (v1Start !== v2Start) {
      return v1Start < v2Start ? 1 : -1;
    }
    const v1End = aDateToDate(v1.end_date).toISO();
    const v2End = aDateToDate(v2.end_date).toISO();
    if (v1End !== v2End) {
      return v1End < v2End ? 1 : -1;
    }
    return 0;
  });
}

// app/routes/app/workspace/vacations.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/vacations.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/vacations.tsx"
  );
  import.meta.hot.lastModified = "1777213342619.7366";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Vacations() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const topLevelInfo = (0, import_react3.useContext)(TopLevelInfoContext);
  const entries = loaderData.entries;
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react3.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react3.useState)([]);
  const entriesByRefId = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    entriesByRefId.set(entry.vacation.ref_id, entry);
  }
  const sortedVacations = sortVacationsNaturally(entries.map((e) => e.vacation).filter((vacation) => {
    const entry = entriesByRefId.get(vacation.ref_id);
    const tagsOk = selectedTagsRefId.length === 0 || entry?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk = selectedContactsRefId.length === 0 || entry?.contacts?.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return tagsOk && contactsOk;
  }));
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/vacations/new", returnLocation: "/app/workspace", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "vacations-actions", topLevelInfo, inputsEnabled: true, actions: [FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/vacations.tsx",
    lineNumber: 95,
    columnNumber: 127
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      /* @__PURE__ */ jsxDEV(VacationCalendar, { today: topLevelInfo.today, sortedVacations }, void 0, false, {
        fileName: "app/routes/app/workspace/vacations.tsx",
        lineNumber: 103,
        columnNumber: 9
      }, this),
      sortedVacations.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no vacations to show. You can create a new vacation.", newEntityLocations: "/app/workspace/vacations/new", helpSubject: import_webapi_client.DocsHelpSubject.VACATIONS }, void 0, false, {
        fileName: "app/routes/app/workspace/vacations.tsx",
        lineNumber: 105,
        columnNumber: 42
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedVacations.map((vacation) => {
        return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `vacation-${vacation.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/vacations/${vacation.ref_id}`, children: [
          /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: vacation.name }, void 0, false, {
            fileName: "app/routes/app/workspace/vacations.tsx",
            lineNumber: 111,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(ADateTag, { label: "Start Date", date: vacation.start_date }, void 0, false, {
            fileName: "app/routes/app/workspace/vacations.tsx",
            lineNumber: 112,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(ADateTag, { label: "End Date", date: vacation.end_date, color: "success" }, void 0, false, {
            fileName: "app/routes/app/workspace/vacations.tsx",
            lineNumber: 113,
            columnNumber: 19
          }, this),
          entriesByRefId.get(vacation.ref_id)?.tags?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
            fileName: "app/routes/app/workspace/vacations.tsx",
            lineNumber: 114,
            columnNumber: 74
          }, this)),
          entriesByRefId.get(vacation.ref_id)?.contacts?.map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
            fileName: "app/routes/app/workspace/vacations.tsx",
            lineNumber: 115,
            columnNumber: 82
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/vacations.tsx",
          lineNumber: 110,
          columnNumber: 17
        }, this) }, `vacation-${vacation.ref_id}`, false, {
          fileName: "app/routes/app/workspace/vacations.tsx",
          lineNumber: 109,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/vacations.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 102,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 123,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this)
  ] }, "vacations", true, {
    fileName: "app/routes/app/workspace/vacations.tsx",
    lineNumber: 95,
    columnNumber: 10
  }, this);
}
_s(Vacations, "v+QCBbJ30L8iKSDJyM0ymNjKRtg=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf];
});
_c = Vacations;
function VacationCalendar({
  today,
  sortedVacations
}) {
  _s2();
  const earliestDate = sortedVacations.length > 0 ? aDateToDate(sortedVacations[sortedVacations.length - 1].start_date) : aDateToDate(today);
  const latestDate = sortedVacations.length > 0 ? aDateToDate(sortedVacations[0].end_date) : earliestDate;
  const [vacationDays, vacationsById, data] = (0, import_react3.useMemo)(() => {
    const vacationDays2 = /* @__PURE__ */ new Map();
    const vacationsById2 = /* @__PURE__ */ new Map();
    for (const vacation of sortedVacations) {
      let walker = aDateToDate(vacation.start_date).startOf("day");
      const limit = aDateToDate(vacation.end_date).endOf("day").toISODate();
      while (walker.toISODate() <= limit) {
        const entry = vacationDays2.get(walker.toISODate()) || /* @__PURE__ */ new Set();
        entry.add(vacation.ref_id);
        vacationDays2.set(walker.toISODate(), entry);
        walker = walker.plus({
          days: 1
        });
      }
      vacationsById2.set(vacation.ref_id, vacation);
    }
    const data2 = [];
    let currDate = earliestDate;
    while (currDate.toISODate() <= latestDate.toISODate()) {
      data2.push({
        value: vacationDays2.has(currDate.toISODate()) ? 100 : 0,
        day: currDate.toISODate()
      });
      currDate = currDate.plus({
        days: 1
      });
    }
    return [vacationDays2, vacationsById2, data2];
  }, [sortedVacations, earliestDate, latestDate]);
  const isBigScreen = useBigScreen();
  const intervalStep = isBigScreen ? "year" : "month";
  const firstIntervalRoundDate = earliestDate.startOf(intervalStep);
  const lastIntervalRoundDate = latestDate.endOf(intervalStep);
  const [currentInterval, setCurrentInterval] = (0, import_react3.useState)(lastIntervalRoundDate.startOf(intervalStep));
  (0, import_react3.useEffect)(() => {
    setCurrentInterval(() => lastIntervalRoundDate.startOf(intervalStep));
  }, [isBigScreen]);
  const dayClickNavigate = useNavigate();
  function handlePrevInterval() {
    if (currentInterval === firstIntervalRoundDate) {
      return;
    }
    setCurrentInterval((ci) => intervalStep === "year" ? ci.minus({
      years: 1
    }) : ci.minus({
      months: 1
    }));
  }
  function handleNextInterval() {
    if (currentInterval === lastIntervalRoundDate) {
      return;
    }
    setCurrentInterval((ci) => intervalStep === "year" ? ci.plus({
      years: 1
    }) : ci.plus({
      months: 1
    }));
  }
  function handleDayClick(datum) {
    if (!vacationDays.has(datum.day)) {
      return null;
    }
    const [theId] = vacationDays.get(datum.day);
    dayClickNavigate(`/app/workspace/vacations/${theId}`);
  }
  function handleTooltip(props) {
    if (!vacationDays.has(props.day)) {
      return null;
    }
    const [theId] = vacationDays.get(props.day);
    const vacation = vacationsById.get(theId);
    return /* @__PURE__ */ jsxDEV(TooltipBox, { sx: {
      backgroundColor: "white"
    }, children: vacation.name }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 211,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(StyledDiv, { children: [
    /* @__PURE__ */ jsxDEV(IconButton_default, { disabled: currentInterval.equals(firstIntervalRoundDate), onClick: handlePrevInterval, "aria-label": "previous-interval", size: "large", children: /* @__PURE__ */ jsxDEV(ArrowBackIosNew_default, { fontSize: "inherit" }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 219,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 218,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: {
      minWidth: isBigScreen ? "900px" : "200px"
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { sx: {
        textAlign: "center"
      }, children: [
        "Year ",
        currentInterval.toFormat("yyyy")
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/vacations.tsx",
        lineNumber: 224,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Se, { data, from: currentInterval.toFormat("yyyy-MM-dd"), to: currentInterval.endOf(intervalStep).toFormat("yyyy-MM-dd"), weekdayLegendOffset: 60, weekdayTicks: [0, 1, 2, 3, 4, 5, 6], onClick: handleDayClick, tooltip: handleTooltip, minValue: 0, maxValue: 100, emptyColor: "#eeeeee", colors: ["#eeeeee", "#61cdbb"], align: "center", margin: {
        top: 40,
        right: isBigScreen ? 100 : 60,
        bottom: 20,
        left: isBigScreen ? 40 : 0
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/vacations.tsx",
        lineNumber: 229,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 221,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(IconButton_default, { disabled: currentInterval.endOf(intervalStep).equals(lastIntervalRoundDate), onClick: handleNextInterval, "aria-label": "next-interval", size: "large", children: /* @__PURE__ */ jsxDEV(ArrowForwardIos_default, { fontSize: "inherit" }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 237,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/vacations.tsx",
      lineNumber: 236,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/vacations.tsx",
    lineNumber: 217,
    columnNumber: 10
  }, this);
}
_s2(VacationCalendar, "/KT7N9XAhSqoO+7+qCQi62Wm1XE=", false, function() {
  return [useBigScreen, useNavigate];
});
_c2 = VacationCalendar;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the vacations! Please try again!`
});
var TooltipBox = styled_default("div")`
  font-size: 1rem;
  border: 1px dashed gray;
  padding: 5px;
  border-radius: 5px;
`;
_c3 = TooltipBox;
var StyledDiv = styled_default("div")`
  height: 180px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;
_c4 = StyledDiv;
var _c;
var _c2;
var _c3;
var _c4;
$RefreshReg$(_c, "Vacations");
$RefreshReg$(_c2, "VacationCalendar");
$RefreshReg$(_c3, "TooltipBox");
$RefreshReg$(_c4, "StyledDiv");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Vacations as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/vacations-SHXIJJ6R.js.map
