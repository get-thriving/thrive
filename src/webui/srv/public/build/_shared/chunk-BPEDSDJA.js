import {
  At,
  Bi,
  C,
  Ei,
  Fi,
  H,
  Ji,
  Mi,
  Mt,
  P,
  Qi,
  Rt,
  Si,
  T,
  Vt,
  We,
  X,
  Xe,
  Xt,
  animated,
  area_default,
  b,
  band,
  et,
  format,
  it,
  k,
  kt,
  line_default,
  linear,
  log,
  point,
  pr,
  qt,
  require_Set,
  require_SetCache,
  require_Stack,
  require_arrayIncludes,
  require_arrayIncludesWith,
  require_arrayMap,
  require_baseFlatten,
  require_baseFor,
  require_baseGet,
  require_baseIsEqual,
  require_baseRest,
  require_baseUnary,
  require_cacheHas,
  require_get,
  require_hasIn,
  require_identity,
  require_isArray,
  require_isArrayLike,
  require_isDate,
  require_isIterateeCall,
  require_isKey,
  require_isObject,
  require_isSymbol,
  require_keys,
  require_last,
  require_setToArray,
  require_toKey,
  rn,
  symlog,
  ti,
  time,
  timeFormat,
  timeParse,
  tt,
  ui,
  useSpring,
  useTransition,
  utcParse,
  utcTime,
  w,
  yi
} from "/build/_shared/chunk-QROJZRQX.js";
import {
  require_prop_types
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_jsx_runtime
} from "/build/_shared/chunk-ONA7UHQ4.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/lodash/noop.js
var require_noop = __commonJS({
  "../../node_modules/lodash/noop.js"(exports, module) {
    function noop() {
    }
    module.exports = noop;
  }
});

// ../../node_modules/lodash/_createSet.js
var require_createSet = __commonJS({
  "../../node_modules/lodash/_createSet.js"(exports, module) {
    var Set = require_Set();
    var noop = require_noop();
    var setToArray = require_setToArray();
    var INFINITY = 1 / 0;
    var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set(values);
    };
    module.exports = createSet;
  }
});

// ../../node_modules/lodash/_baseUniq.js
var require_baseUniq = __commonJS({
  "../../node_modules/lodash/_baseUniq.js"(exports, module) {
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var cacheHas = require_cacheHas();
    var createSet = require_createSet();
    var setToArray = require_setToArray();
    var LARGE_ARRAY_SIZE = 200;
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    module.exports = baseUniq;
  }
});

// ../../node_modules/lodash/uniq.js
var require_uniq = __commonJS({
  "../../node_modules/lodash/uniq.js"(exports, module) {
    var baseUniq = require_baseUniq();
    function uniq(array) {
      return array && array.length ? baseUniq(array) : [];
    }
    module.exports = uniq;
  }
});

// ../../node_modules/lodash/_baseIsMatch.js
var require_baseIsMatch = __commonJS({
  "../../node_modules/lodash/_baseIsMatch.js"(exports, module) {
    var Stack = require_Stack();
    var baseIsEqual = require_baseIsEqual();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length, length = index, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    module.exports = baseIsMatch;
  }
});

// ../../node_modules/lodash/_isStrictComparable.js
var require_isStrictComparable = __commonJS({
  "../../node_modules/lodash/_isStrictComparable.js"(exports, module) {
    var isObject = require_isObject();
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    module.exports = isStrictComparable;
  }
});

// ../../node_modules/lodash/_getMatchData.js
var require_getMatchData = __commonJS({
  "../../node_modules/lodash/_getMatchData.js"(exports, module) {
    var isStrictComparable = require_isStrictComparable();
    var keys = require_keys();
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    module.exports = getMatchData;
  }
});

// ../../node_modules/lodash/_matchesStrictComparable.js
var require_matchesStrictComparable = __commonJS({
  "../../node_modules/lodash/_matchesStrictComparable.js"(exports, module) {
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    module.exports = matchesStrictComparable;
  }
});

// ../../node_modules/lodash/_baseMatches.js
var require_baseMatches = __commonJS({
  "../../node_modules/lodash/_baseMatches.js"(exports, module) {
    var baseIsMatch = require_baseIsMatch();
    var getMatchData = require_getMatchData();
    var matchesStrictComparable = require_matchesStrictComparable();
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    module.exports = baseMatches;
  }
});

// ../../node_modules/lodash/_baseMatchesProperty.js
var require_baseMatchesProperty = __commonJS({
  "../../node_modules/lodash/_baseMatchesProperty.js"(exports, module) {
    var baseIsEqual = require_baseIsEqual();
    var get = require_get();
    var hasIn = require_hasIn();
    var isKey = require_isKey();
    var isStrictComparable = require_isStrictComparable();
    var matchesStrictComparable = require_matchesStrictComparable();
    var toKey = require_toKey();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }
    module.exports = baseMatchesProperty;
  }
});

// ../../node_modules/lodash/_baseProperty.js
var require_baseProperty = __commonJS({
  "../../node_modules/lodash/_baseProperty.js"(exports, module) {
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    module.exports = baseProperty;
  }
});

// ../../node_modules/lodash/_basePropertyDeep.js
var require_basePropertyDeep = __commonJS({
  "../../node_modules/lodash/_basePropertyDeep.js"(exports, module) {
    var baseGet = require_baseGet();
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    module.exports = basePropertyDeep;
  }
});

// ../../node_modules/lodash/property.js
var require_property = __commonJS({
  "../../node_modules/lodash/property.js"(exports, module) {
    var baseProperty = require_baseProperty();
    var basePropertyDeep = require_basePropertyDeep();
    var isKey = require_isKey();
    var toKey = require_toKey();
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module.exports = property;
  }
});

// ../../node_modules/lodash/_baseIteratee.js
var require_baseIteratee = __commonJS({
  "../../node_modules/lodash/_baseIteratee.js"(exports, module) {
    var baseMatches = require_baseMatches();
    var baseMatchesProperty = require_baseMatchesProperty();
    var identity = require_identity();
    var isArray = require_isArray();
    var property = require_property();
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    module.exports = baseIteratee;
  }
});

// ../../node_modules/lodash/uniqBy.js
var require_uniqBy = __commonJS({
  "../../node_modules/lodash/uniqBy.js"(exports, module) {
    var baseIteratee = require_baseIteratee();
    var baseUniq = require_baseUniq();
    function uniqBy(array, iteratee) {
      return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
    }
    module.exports = uniqBy;
  }
});

// ../../node_modules/lodash/_baseForOwn.js
var require_baseForOwn = __commonJS({
  "../../node_modules/lodash/_baseForOwn.js"(exports, module) {
    var baseFor = require_baseFor();
    var keys = require_keys();
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }
    module.exports = baseForOwn;
  }
});

// ../../node_modules/lodash/_createBaseEach.js
var require_createBaseEach = __commonJS({
  "../../node_modules/lodash/_createBaseEach.js"(exports, module) {
    var isArrayLike = require_isArrayLike();
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
        while (fromRight ? index-- : ++index < length) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }
    module.exports = createBaseEach;
  }
});

// ../../node_modules/lodash/_baseEach.js
var require_baseEach = __commonJS({
  "../../node_modules/lodash/_baseEach.js"(exports, module) {
    var baseForOwn = require_baseForOwn();
    var createBaseEach = require_createBaseEach();
    var baseEach = createBaseEach(baseForOwn);
    module.exports = baseEach;
  }
});

// ../../node_modules/lodash/_baseMap.js
var require_baseMap = __commonJS({
  "../../node_modules/lodash/_baseMap.js"(exports, module) {
    var baseEach = require_baseEach();
    var isArrayLike = require_isArrayLike();
    function baseMap(collection, iteratee) {
      var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
      baseEach(collection, function(value, key, collection2) {
        result[++index] = iteratee(value, key, collection2);
      });
      return result;
    }
    module.exports = baseMap;
  }
});

// ../../node_modules/lodash/_baseSortBy.js
var require_baseSortBy = __commonJS({
  "../../node_modules/lodash/_baseSortBy.js"(exports, module) {
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    module.exports = baseSortBy;
  }
});

// ../../node_modules/lodash/_compareAscending.js
var require_compareAscending = __commonJS({
  "../../node_modules/lodash/_compareAscending.js"(exports, module) {
    var isSymbol = require_isSymbol();
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
        var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
        if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
          return 1;
        }
        if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }
    module.exports = compareAscending;
  }
});

// ../../node_modules/lodash/_compareMultiple.js
var require_compareMultiple = __commonJS({
  "../../node_modules/lodash/_compareMultiple.js"(exports, module) {
    var compareAscending = require_compareAscending();
    function compareMultiple(object, other, orders) {
      var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == "desc" ? -1 : 1);
        }
      }
      return object.index - other.index;
    }
    module.exports = compareMultiple;
  }
});

// ../../node_modules/lodash/_baseOrderBy.js
var require_baseOrderBy = __commonJS({
  "../../node_modules/lodash/_baseOrderBy.js"(exports, module) {
    var arrayMap = require_arrayMap();
    var baseGet = require_baseGet();
    var baseIteratee = require_baseIteratee();
    var baseMap = require_baseMap();
    var baseSortBy = require_baseSortBy();
    var baseUnary = require_baseUnary();
    var compareMultiple = require_compareMultiple();
    var identity = require_identity();
    var isArray = require_isArray();
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            };
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }
      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      var result = baseMap(collection, function(value, key, collection2) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { "criteria": criteria, "index": ++index, "value": value };
      });
      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }
    module.exports = baseOrderBy;
  }
});

// ../../node_modules/lodash/sortBy.js
var require_sortBy = __commonJS({
  "../../node_modules/lodash/sortBy.js"(exports, module) {
    var baseFlatten = require_baseFlatten();
    var baseOrderBy = require_baseOrderBy();
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });
    module.exports = sortBy;
  }
});

// ../../node_modules/@nivo/line/dist/nivo-line.es.js
var import_react3 = __toESM(require_react());

// ../../node_modules/@nivo/axes/dist/nivo-axes.es.js
var t2 = __toESM(require_react());
var import_react = __toESM(require_react());

// ../../node_modules/@nivo/scales/dist/nivo-scales.es.js
var import_uniq = __toESM(require_uniq());
var import_uniqBy = __toESM(require_uniqBy());
var import_sortBy = __toESM(require_sortBy());
var import_last = __toESM(require_last());
var import_isDate = __toESM(require_isDate());

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/interval.js
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

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/millisecond.js
var millisecond = newInterval(function() {
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});
millisecond.every = function(k4) {
  k4 = Math.floor(k4);
  if (!isFinite(k4) || !(k4 > 0))
    return null;
  if (!(k4 > 1))
    return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k4) * k4);
  }, function(date, step) {
    date.setTime(+date + step * k4);
  }, function(start, end) {
    return (end - start) / k4;
  });
};
var millisecond_default = millisecond;
var milliseconds = millisecond.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/duration.js
var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationWeek = 6048e5;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/second.js
var second = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});
var second_default = second;
var seconds = second.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/minute.js
var minute = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});
var minute_default = minute;
var minutes = minute.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/hour.js
var hour = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});
var hour_default = hour;
var hours = hour.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/week.js
function weekday(i4) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i4) % 7);
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

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/month.js
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
var month_default = month;
var months = month.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/year.js
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
year.every = function(k4) {
  return !isFinite(k4 = Math.floor(k4)) || !(k4 > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k4) * k4);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k4);
  });
};
var year_default = year;
var years = year.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/utcMinute.js
var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});
var utcMinute_default = utcMinute;
var utcMinutes = utcMinute.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/utcHour.js
var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});
var utcHour_default = utcHour;
var utcHours = utcHour.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/utcWeek.js
function utcWeekday(i4) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i4) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/utcMonth.js
var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});
var utcMonth_default = utcMonth;
var utcMonths = utcMonth.range;

// ../../node_modules/@nivo/scales/node_modules/d3-time/src/utcYear.js
var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});
utcYear.every = function(k4) {
  return !isFinite(k4 = Math.floor(k4)) || !(k4 > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k4) * k4);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k4);
  });
};
var utcYear_default = utcYear;
var utcYears = utcYear.range;

// ../../node_modules/@nivo/scales/dist/nivo-scales.es.js
function $() {
  return $ = Object.assign || function(n5) {
    for (var t5 = 1; t5 < arguments.length; t5++) {
      var r4 = arguments[t5];
      for (var e5 in r4)
        Object.prototype.hasOwnProperty.call(r4, e5) && (n5[e5] = r4[e5]);
    }
    return n5;
  }, $.apply(this, arguments);
}
var J = [function(n5) {
  return n5.setMilliseconds(0);
}, function(n5) {
  return n5.setSeconds(0);
}, function(n5) {
  return n5.setMinutes(0);
}, function(n5) {
  return n5.setHours(0);
}, function(n5) {
  return n5.setDate(1);
}, function(n5) {
  return n5.setMonth(0);
}];
var K = { millisecond: [], second: J.slice(0, 1), minute: J.slice(0, 2), hour: J.slice(0, 3), day: J.slice(0, 4), month: J.slice(0, 5), year: J.slice(0, 6) };
var L = function(n5) {
  return function(t5) {
    return K[n5].forEach(function(n6) {
      n6(t5);
    }), t5;
  };
};
var Q = function(n5) {
  var t5 = n5.format, r4 = void 0 === t5 ? "native" : t5, e5 = n5.precision, a3 = void 0 === e5 ? "millisecond" : e5, u = n5.useUTC, c = void 0 === u || u, f2 = L(a3);
  return function(n6) {
    if (void 0 === n6)
      return n6;
    if ("native" === r4 || n6 instanceof Date)
      return f2(n6);
    var t6 = c ? utcParse(r4) : timeParse(r4);
    return f2(t6(n6));
  };
};
var W = function(n5, t5, r4, e5) {
  var a3, i4, o3, c, f2 = n5.min, d = void 0 === f2 ? 0 : f2, s2 = n5.max, l2 = void 0 === s2 ? "auto" : s2, m = n5.stacked, v3 = void 0 !== m && m, y2 = n5.reverse, p3 = void 0 !== y2 && y2, h2 = n5.clamp, g3 = void 0 !== h2 && h2, x2 = n5.nice, k4 = void 0 !== x2 && x2;
  "auto" === d ? a3 = true === v3 ? null != (i4 = t5.minStacked) ? i4 : 0 : t5.min : a3 = d;
  "auto" === l2 ? o3 = true === v3 ? null != (c = t5.maxStacked) ? c : 0 : t5.max : o3 = l2;
  var T3 = linear().rangeRound("x" === e5 ? [0, r4] : [r4, 0]).domain(p3 ? [o3, a3] : [a3, o3]).clamp(g3);
  return true === k4 ? T3.nice() : "number" == typeof k4 && T3.nice(k4), X2(T3, v3);
};
var X2 = function(n5, t5) {
  void 0 === t5 && (t5 = false);
  var r4 = n5;
  return r4.type = "linear", r4.stacked = t5, r4;
};
var Y = function(n5, t5, r4) {
  var e5 = point().range([0, r4]).domain(t5.all);
  return e5.type = "point", e5;
};
var _ = function(n5, t5, r4, e5) {
  var a3 = n5.round, i4 = void 0 === a3 || a3, o3 = band().range("x" === e5 ? [0, r4] : [r4, 0]).domain(t5.all).round(i4);
  return nn(o3);
};
var nn = function(n5) {
  var t5 = n5;
  return t5.type = "band", t5;
};
var tn = function(n5, t5, r4) {
  var e5, a3, i4 = n5.format, o3 = void 0 === i4 ? "native" : i4, u = n5.precision, c = void 0 === u ? "millisecond" : u, f2 = n5.min, l2 = void 0 === f2 ? "auto" : f2, m = n5.max, v3 = void 0 === m ? "auto" : m, y2 = n5.useUTC, p3 = void 0 === y2 || y2, h2 = n5.nice, g3 = void 0 !== h2 && h2, x2 = Q({ format: o3, precision: c, useUTC: p3 });
  e5 = "auto" === l2 ? x2(t5.min) : "native" !== o3 ? x2(l2) : l2, a3 = "auto" === v3 ? x2(t5.max) : "native" !== o3 ? x2(v3) : v3;
  var k4 = p3 ? utcTime() : time();
  k4.range([0, r4]), e5 && a3 && k4.domain([e5, a3]), true === g3 ? k4.nice() : "object" != typeof g3 && "number" != typeof g3 || k4.nice(g3);
  var T3 = k4;
  return T3.type = "time", T3.useUTC = p3, T3;
};
var rn2 = function(n5, t5, r4, e5) {
  var a3, i4 = n5.base, o3 = void 0 === i4 ? 10 : i4, u = n5.min, c = void 0 === u ? "auto" : u, f2 = n5.max, d = void 0 === f2 ? "auto" : f2;
  if (t5.all.some(function(n6) {
    return 0 === n6;
  }))
    throw new Error("a log scale domain must not include or cross zero");
  var s2, m, v3 = false;
  if (t5.all.filter(function(n6) {
    return null != n6;
  }).forEach(function(n6) {
    v3 || (void 0 === a3 ? a3 = Math.sign(n6) : Math.sign(n6) !== a3 && (v3 = true));
  }), v3)
    throw new Error("a log scale domain must be strictly-positive or strictly-negative");
  s2 = "auto" === c ? t5.min : c, m = "auto" === d ? t5.max : d;
  var y2 = log().domain([s2, m]).rangeRound("x" === e5 ? [0, r4] : [r4, 0]).base(o3).nice();
  return y2.type = "log", y2;
};
var en = function(n5, t5, r4, e5) {
  var a3, i4, o3 = n5.constant, u = void 0 === o3 ? 1 : o3, c = n5.min, f2 = void 0 === c ? "auto" : c, d = n5.max, s2 = void 0 === d ? "auto" : d, l2 = n5.reverse, v3 = void 0 !== l2 && l2;
  a3 = "auto" === f2 ? t5.min : f2, i4 = "auto" === s2 ? t5.max : s2;
  var y2 = symlog().constant(u).rangeRound("x" === e5 ? [0, r4] : [r4, 0]).nice();
  true === v3 ? y2.domain([i4, a3]) : y2.domain([a3, i4]);
  var p3 = y2;
  return p3.type = "symlog", p3;
};
var an = function(n5) {
  return "x" === n5 ? "y" : "x";
};
var on = function(n5, t5) {
  return n5 === t5;
};
var un = function(n5, t5) {
  return n5.getTime() === t5.getTime();
};
function cn(n5, t5, r4, e5) {
  switch (n5.type) {
    case "linear":
      return W(n5, t5, r4, e5);
    case "point":
      return Y(0, t5, r4);
    case "band":
      return _(n5, t5, r4, e5);
    case "time":
      return tn(n5, t5, r4);
    case "log":
      return rn2(n5, t5, r4, e5);
    case "symlog":
      return en(n5, t5, r4, e5);
    default:
      throw new Error("invalid scale spec");
  }
}
var fn = function(n5, t5, r4) {
  var e5;
  if ("stacked" in r4 && r4.stacked) {
    var a3 = n5.data["x" === t5 ? "xStacked" : "yStacked"];
    return null == a3 ? null : r4(a3);
  }
  return null != (e5 = r4(n5.data[t5])) ? e5 : null;
};
var dn = function(n5, t5, r4, e5, a3) {
  var i4 = n5.map(function(n6) {
    return function(n7) {
      return $({}, n7, { data: n7.data.map(function(n8) {
        return { data: $({}, n8) };
      }) });
    }(n6);
  }), o3 = sn(i4, t5, r4);
  "stacked" in t5 && true === t5.stacked && vn(o3, i4), "stacked" in r4 && true === r4.stacked && yn(o3, i4);
  var u = cn(t5, o3.x, e5, "x"), c = cn(r4, o3.y, a3, "y"), f2 = i4.map(function(n6) {
    return $({}, n6, { data: n6.data.map(function(n7) {
      return $({}, n7, { position: { x: fn(n7, "x", u), y: fn(n7, "y", c) } });
    }) });
  });
  return $({}, o3, { series: f2, xScale: u, yScale: c });
};
var sn = function(n5, t5, r4) {
  return { x: ln(n5, "x", t5), y: ln(n5, "y", r4) };
};
var ln = function(a3, i4, o3, u) {
  var c = void 0 === u ? {} : u, f2 = c.getValue, d = void 0 === f2 ? function(n5) {
    return n5.data[i4];
  } : f2, s2 = c.setValue, l2 = void 0 === s2 ? function(n5, t5) {
    n5.data[i4] = t5;
  } : s2;
  if ("linear" === o3.type)
    a3.forEach(function(n5) {
      n5.data.forEach(function(n6) {
        var t5 = d(n6);
        t5 && l2(n6, parseFloat(String(t5)));
      });
    });
  else if ("time" === o3.type && "native" !== o3.format) {
    var m = Q(o3);
    a3.forEach(function(n5) {
      n5.data.forEach(function(n6) {
        var t5 = d(n6);
        t5 && l2(n6, m(t5));
      });
    });
  }
  var v3 = [];
  switch (a3.forEach(function(n5) {
    n5.data.forEach(function(n6) {
      v3.push(d(n6));
    });
  }), o3.type) {
    case "linear":
      var y2 = (0, import_sortBy.default)((0, import_uniq.default)(v3).filter(function(n5) {
        return null !== n5;
      }), function(n5) {
        return n5;
      });
      return { all: y2, min: Math.min.apply(Math, y2), max: Math.max.apply(Math, y2) };
    case "time":
      var p3 = (0, import_uniqBy.default)(v3, function(n5) {
        return n5.getTime();
      }).slice(0).sort(function(n5, t5) {
        return t5.getTime() - n5.getTime();
      }).reverse();
      return { all: p3, min: p3[0], max: (0, import_last.default)(p3) };
    default:
      var h2 = (0, import_uniq.default)(v3);
      return { all: h2, min: h2[0], max: (0, import_last.default)(h2) };
  }
};
var mn = function(n5, t5, r4) {
  var i4 = an(n5), o3 = [];
  t5[i4].all.forEach(function(t6) {
    var u = (0, import_isDate.default)(t6) ? un : on, c = [];
    r4.forEach(function(r5) {
      var a3 = r5.data.find(function(n6) {
        return u(n6.data[i4], t6);
      }), f2 = null, d = null;
      if (void 0 !== a3) {
        if (null !== (f2 = a3.data[n5])) {
          var s2 = (0, import_last.default)(c);
          void 0 === s2 ? d = f2 : null !== s2 && (d = s2 + f2);
        }
        a3.data["x" === n5 ? "xStacked" : "yStacked"] = d;
      }
      c.push(d), null !== d && o3.push(d);
    });
  }), t5[n5].minStacked = Math.min.apply(Math, o3), t5[n5].maxStacked = Math.max.apply(Math, o3);
};
var vn = function(n5, t5) {
  return mn("x", n5, t5);
};
var yn = function(n5, t5) {
  return mn("y", n5, t5);
};
var pn = function(n5) {
  var t5 = n5.bandwidth();
  if (0 === t5)
    return n5;
  var r4 = t5 / 2;
  return n5.round() && (r4 = Math.round(r4)), function(t6) {
    var e5;
    return (null != (e5 = n5(t6)) ? e5 : 0) + r4;
  };
};
var hn = { millisecond: [millisecond_default, millisecond_default], second: [second_default, second_default], minute: [minute_default, utcMinute_default], hour: [hour_default, utcHour_default], day: [newInterval(function(n5) {
  return n5.setHours(0, 0, 0, 0);
}, function(n5, t5) {
  return n5.setDate(n5.getDate() + t5);
}, function(n5, t5) {
  return (t5.getTime() - n5.getTime()) / 864e5;
}, function(n5) {
  return Math.floor(n5.getTime() / 864e5);
}), newInterval(function(n5) {
  return n5.setUTCHours(0, 0, 0, 0);
}, function(n5, t5) {
  return n5.setUTCDate(n5.getUTCDate() + t5);
}, function(n5, t5) {
  return (t5.getTime() - n5.getTime()) / 864e5;
}, function(n5) {
  return Math.floor(n5.getTime() / 864e5);
})], week: [sunday, utcSunday], sunday: [sunday, utcSunday], monday: [monday, utcMonday], tuesday: [tuesday, utcTuesday], wednesday: [wednesday, utcWednesday], thursday: [thursday, utcThursday], friday: [friday, utcFriday], saturday: [saturday, utcSaturday], month: [month_default, utcMonth_default], year: [year_default, utcYear_default] };
var gn = Object.keys(hn);
var xn = new RegExp("^every\\s*(\\d+)?\\s*(" + gn.join("|") + ")s?$", "i");
var kn = function(n5, t5) {
  if (Array.isArray(t5))
    return t5;
  if ("string" == typeof t5 && "useUTC" in n5) {
    var r4 = t5.match(xn);
    if (r4) {
      var e5 = r4[1], a3 = r4[2], i4 = hn[a3][n5.useUTC ? 1 : 0];
      if ("day" === a3) {
        var o3, u, c = n5.domain(), f2 = c[0], d = c[1], s2 = new Date(d);
        return s2.setDate(s2.getDate() + 1), null != (o3 = null == (u = i4.every(Number(null != e5 ? e5 : 1))) ? void 0 : u.range(f2, s2)) ? o3 : [];
      }
      if (void 0 === e5)
        return n5.ticks(i4);
      var l2 = i4.every(Number(e5));
      if (l2)
        return n5.ticks(l2);
    }
    throw new Error("Invalid tickValues: " + t5);
  }
  if ("ticks" in n5) {
    if (void 0 === t5)
      return n5.ticks();
    if ("number" == typeof (m = t5) && isFinite(m) && Math.floor(m) === m)
      return n5.ticks(t5);
  }
  var m;
  return n5.domain();
};

// ../../node_modules/@nivo/axes/dist/nivo-axes.es.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_prop_types = __toESM(require_prop_types());
function v() {
  return v = Object.assign || function(t5) {
    for (var e5 = 1; e5 < arguments.length; e5++) {
      var i4 = arguments[e5];
      for (var n5 in i4)
        Object.prototype.hasOwnProperty.call(i4, n5) && (t5[n5] = i4[n5]);
    }
    return t5;
  }, v.apply(this, arguments);
}
var p = function(t5) {
  var e5, i4 = t5.axis, n5 = t5.scale, r4 = t5.ticksPosition, a3 = t5.tickValues, o3 = t5.tickSize, s2 = t5.tickPadding, c = t5.tickRotation, f2 = t5.engine, x2 = void 0 === f2 ? "svg" : f2, u = kn(n5, a3), y2 = yi[x2], g3 = "bandwidth" in n5 ? pn(n5) : n5, k4 = { lineX: 0, lineY: 0 }, h2 = { textX: 0, textY: 0 }, p3 = "object" == typeof document && "rtl" === document.dir, b4 = y2.align.center, P4 = y2.baseline.center;
  return "x" === i4 ? (e5 = function(t6) {
    var e6;
    return { x: null != (e6 = g3(t6)) ? e6 : 0, y: 0 };
  }, k4.lineY = o3 * ("after" === r4 ? 1 : -1), h2.textY = (o3 + s2) * ("after" === r4 ? 1 : -1), P4 = "after" === r4 ? y2.baseline.top : y2.baseline.bottom, 0 === c ? b4 = y2.align.center : "after" === r4 && c < 0 || "before" === r4 && c > 0 ? (b4 = y2.align[p3 ? "left" : "right"], P4 = y2.baseline.center) : ("after" === r4 && c > 0 || "before" === r4 && c < 0) && (b4 = y2.align[p3 ? "right" : "left"], P4 = y2.baseline.center)) : (e5 = function(t6) {
    var e6;
    return { x: 0, y: null != (e6 = g3(t6)) ? e6 : 0 };
  }, k4.lineX = o3 * ("after" === r4 ? 1 : -1), h2.textX = (o3 + s2) * ("after" === r4 ? 1 : -1), b4 = "after" === r4 ? y2.align.left : y2.align.right), { ticks: u.map(function(t6) {
    return v({ key: t6 instanceof Date ? "" + t6.valueOf() : "" + t6, value: t6 }, e5(t6), k4, h2);
  }), textAlign: b4, textBaseline: P4 };
};
var b2 = function(t5, e5) {
  if (void 0 === t5 || "function" == typeof t5)
    return t5;
  if ("time" === e5.type) {
    var i4 = timeFormat(t5);
    return function(t6) {
      return i4(t6 instanceof Date ? t6 : new Date(t6));
    };
  }
  return format(t5);
};
var P2 = function(t5) {
  var e5, i4 = t5.width, n5 = t5.height, r4 = t5.scale, a3 = t5.axis, o3 = t5.values, l2 = (e5 = o3, Array.isArray(e5) ? o3 : void 0) || kn(r4, o3), s2 = "bandwidth" in r4 ? pn(r4) : r4, c = "x" === a3 ? l2.map(function(t6) {
    var e6, i5;
    return { key: t6 instanceof Date ? "" + t6.valueOf() : "" + t6, x1: null != (e6 = s2(t6)) ? e6 : 0, x2: null != (i5 = s2(t6)) ? i5 : 0, y1: 0, y2: n5 };
  }) : l2.map(function(t6) {
    var e6, n6;
    return { key: t6 instanceof Date ? "" + t6.valueOf() : "" + t6, x1: 0, x2: i4, y1: null != (e6 = s2(t6)) ? e6 : 0, y2: null != (n6 = s2(t6)) ? n6 : 0 };
  });
  return c;
};
var S = (0, import_react.memo)(function(t5) {
  var e5, n5 = t5.value, a3 = t5.format, o3 = t5.lineX, l2 = t5.lineY, c = t5.onClick, f2 = t5.textBaseline, x2 = t5.textAnchor, u = t5.animatedProps, d = Vt(), m = null != (e5 = null == a3 ? void 0 : a3(n5)) ? e5 : n5, k4 = (0, import_react.useMemo)(function() {
    var t6 = { opacity: u.opacity };
    return c ? { style: v({}, t6, { cursor: "pointer" }), onClick: function(t7) {
      return c(t7, m);
    } } : { style: t6 };
  }, [u.opacity, c, m]);
  return (0, import_jsx_runtime.jsxs)(animated.g, v({ transform: u.transform }, k4, { children: [(0, import_jsx_runtime.jsx)("line", { x1: 0, x2: o3, y1: 0, y2: l2, style: d.axis.ticks.line }), (0, import_jsx_runtime.jsx)(animated.text, { dominantBaseline: f2, textAnchor: x2, transform: u.textTransform, style: d.axis.ticks.text, children: m })] }));
});
var T2 = (0, import_react.memo)(function(e5) {
  var n5 = e5.axis, l2 = e5.scale, f2 = e5.x, x2 = void 0 === f2 ? 0 : f2, u = e5.y, d = void 0 === u ? 0 : u, m = e5.length, k4 = e5.ticksPosition, h2 = e5.tickValues, P4 = e5.tickSize, T3 = void 0 === P4 ? 5 : P4, O3 = e5.tickPadding, w3 = void 0 === O3 ? 5 : O3, A2 = e5.tickRotation, X4 = void 0 === A2 ? 0 : A2, Y3 = e5.format, W3 = e5.renderTick, B2 = void 0 === W3 ? S : W3, z2 = e5.legend, V2 = e5.legendPosition, C3 = void 0 === V2 ? "end" : V2, D = e5.legendOffset, R = void 0 === D ? 0 : D, j = e5.onClick, E = e5.ariaHidden, q = Vt(), F = (0, import_react.useMemo)(function() {
    return b2(Y3, l2);
  }, [Y3, l2]), H2 = p({ axis: n5, scale: l2, ticksPosition: k4, tickValues: h2, tickSize: T3, tickPadding: w3, tickRotation: X4 }), N2 = H2.ticks, I = H2.textAlign, G = H2.textBaseline, J2 = null;
  if (void 0 !== z2) {
    var K3, L2 = 0, M = 0, Q3 = 0;
    "y" === n5 ? (Q3 = -90, L2 = R, "start" === C3 ? (K3 = "start", M = m) : "middle" === C3 ? (K3 = "middle", M = m / 2) : "end" === C3 && (K3 = "end")) : (M = R, "start" === C3 ? K3 = "start" : "middle" === C3 ? (K3 = "middle", L2 = m / 2) : "end" === C3 && (K3 = "end", L2 = m)), J2 = (0, import_jsx_runtime.jsx)("text", { transform: "translate(" + L2 + ", " + M + ") rotate(" + Q3 + ")", textAnchor: K3, style: v({ dominantBaseline: "central" }, q.axis.legend.text), children: z2 });
  }
  var U = tt(), Z = U.animate, $2 = U.config, _2 = useSpring({ transform: "translate(" + x2 + "," + d + ")", lineX2: "x" === n5 ? m : 0, lineY2: "x" === n5 ? 0 : m, config: $2, immediate: !Z }), tt2 = useTransition(N2, { keys: function(t5) {
    return t5.key;
  }, initial: function(t5) {
    return { opacity: 1, transform: "translate(" + t5.x + "," + t5.y + ")", textTransform: "translate(" + t5.textX + "," + t5.textY + ") rotate(" + X4 + ")" };
  }, from: function(t5) {
    return { opacity: 0, transform: "translate(" + t5.x + "," + t5.y + ")", textTransform: "translate(" + t5.textX + "," + t5.textY + ") rotate(" + X4 + ")" };
  }, enter: function(t5) {
    return { opacity: 1, transform: "translate(" + t5.x + "," + t5.y + ")", textTransform: "translate(" + t5.textX + "," + t5.textY + ") rotate(" + X4 + ")" };
  }, update: function(t5) {
    return { opacity: 1, transform: "translate(" + t5.x + "," + t5.y + ")", textTransform: "translate(" + t5.textX + "," + t5.textY + ") rotate(" + X4 + ")" };
  }, leave: { opacity: 0 }, config: $2, immediate: !Z });
  return (0, import_jsx_runtime.jsxs)(animated.g, { transform: _2.transform, "aria-hidden": E, children: [tt2(function(e6, i4, n6, r4) {
    return t2.createElement(B2, v({ tickIndex: r4, format: F, rotate: X4, textBaseline: G, textAnchor: I, animatedProps: e6 }, i4, j ? { onClick: j } : {}));
  }), (0, import_jsx_runtime.jsx)(animated.line, { style: q.axis.domain.line, x1: 0, x2: _2.lineX2, y1: 0, y2: _2.lineY2 }), J2] });
});
var O = { ticksPosition: import_prop_types.default.oneOf(["before", "after"]), tickValues: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string, import_prop_types.default.instanceOf(Date)])), import_prop_types.default.string]), tickSize: import_prop_types.default.number, tickPadding: import_prop_types.default.number, tickRotation: import_prop_types.default.number, format: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.string]), renderTick: import_prop_types.default.func, legend: import_prop_types.default.node, legendPosition: import_prop_types.default.oneOf(["start", "middle", "end"]), legendOffset: import_prop_types.default.number, ariaHidden: import_prop_types.default.bool };
var w2 = import_prop_types.default.shape(O);
var A = ["top", "right", "bottom", "left"];
var X3 = (0, import_react.memo)(function(t5) {
  var e5 = t5.xScale, i4 = t5.yScale, n5 = t5.width, r4 = t5.height, a3 = { top: t5.top, right: t5.right, bottom: t5.bottom, left: t5.left };
  return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: A.map(function(t6) {
    var o3 = a3[t6];
    if (!o3)
      return null;
    var l2 = "top" === t6 || "bottom" === t6;
    return (0, import_jsx_runtime.jsx)(T2, v({}, o3, { axis: l2 ? "x" : "y", x: "right" === t6 ? n5 : 0, y: "bottom" === t6 ? r4 : 0, scale: l2 ? e5 : i4, length: l2 ? n5 : r4, ticksPosition: "top" === t6 || "left" === t6 ? "before" : "after" }), t6);
  }) });
});
var Y2 = (0, import_react.memo)(function(t5) {
  var e5 = t5.animatedProps, i4 = Vt();
  return (0, import_jsx_runtime.jsx)(animated.line, v({}, e5, i4.grid.line));
});
var W2 = (0, import_react.memo)(function(t5) {
  var e5 = t5.lines, i4 = tt(), r4 = i4.animate, a3 = i4.config, l2 = useTransition(e5, { keys: function(t6) {
    return t6.key;
  }, initial: function(t6) {
    return { opacity: 1, x1: t6.x1, x2: t6.x2, y1: t6.y1, y2: t6.y2 };
  }, from: function(t6) {
    return { opacity: 0, x1: t6.x1, x2: t6.x2, y1: t6.y1, y2: t6.y2 };
  }, enter: function(t6) {
    return { opacity: 1, x1: t6.x1, x2: t6.x2, y1: t6.y1, y2: t6.y2 };
  }, update: function(t6) {
    return { opacity: 1, x1: t6.x1, x2: t6.x2, y1: t6.y1, y2: t6.y2 };
  }, leave: { opacity: 0 }, config: a3, immediate: !r4 });
  return (0, import_jsx_runtime.jsx)("g", { children: l2(function(t6, e6) {
    return (0, import_react.createElement)(Y2, v({}, e6, { key: e6.key, animatedProps: t6 }));
  }) });
});
var B = (0, import_react.memo)(function(t5) {
  var e5 = t5.width, n5 = t5.height, r4 = t5.xScale, a3 = t5.yScale, o3 = t5.xValues, l2 = t5.yValues, s2 = (0, import_react.useMemo)(function() {
    return !!r4 && P2({ width: e5, height: n5, scale: r4, axis: "x", values: o3 });
  }, [r4, o3, e5, n5]), c = (0, import_react.useMemo)(function() {
    return !!a3 && P2({ width: e5, height: n5, scale: a3, axis: "y", values: l2 });
  }, [n5, e5, a3, l2]);
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [s2 && (0, import_jsx_runtime.jsx)(W2, { lines: s2 }), c && (0, import_jsx_runtime.jsx)(W2, { lines: c })] });
});
var z = function(t5, e5) {
  var i4, n5 = e5.axis, r4 = e5.scale, a3 = e5.x, o3 = void 0 === a3 ? 0 : a3, l2 = e5.y, s2 = void 0 === l2 ? 0 : l2, c = e5.length, x2 = e5.ticksPosition, u = e5.tickValues, d = e5.tickSize, m = void 0 === d ? 5 : d, y2 = e5.tickPadding, g3 = void 0 === y2 ? 5 : y2, k4 = e5.tickRotation, h2 = void 0 === k4 ? 0 : k4, v3 = e5.format, b4 = e5.legend, P4 = e5.legendPosition, S3 = void 0 === P4 ? "end" : P4, T3 = e5.legendOffset, O3 = void 0 === T3 ? 0 : T3, w3 = e5.theme, A2 = p({ axis: n5, scale: r4, ticksPosition: x2, tickValues: u, tickSize: m, tickPadding: g3, tickRotation: h2, engine: "canvas" }), X4 = A2.ticks, Y3 = A2.textAlign, W3 = A2.textBaseline;
  t5.save(), t5.translate(o3, s2), t5.textAlign = Y3, t5.textBaseline = W3, t5.font = (w3.axis.ticks.text.fontWeight ? w3.axis.ticks.text.fontWeight + " " : "") + w3.axis.ticks.text.fontSize + "px " + w3.axis.ticks.text.fontFamily, (null != (i4 = w3.axis.domain.line.strokeWidth) ? i4 : 0) > 0 && (t5.lineWidth = Number(w3.axis.domain.line.strokeWidth), t5.lineCap = "square", w3.axis.domain.line.stroke && (t5.strokeStyle = w3.axis.domain.line.stroke), t5.beginPath(), t5.moveTo(0, 0), t5.lineTo("x" === n5 ? c : 0, "x" === n5 ? 0 : c), t5.stroke());
  var B2 = "function" == typeof v3 ? v3 : function(t6) {
    return "" + t6;
  };
  if (X4.forEach(function(e6) {
    var i5;
    (null != (i5 = w3.axis.ticks.line.strokeWidth) ? i5 : 0) > 0 && (t5.lineWidth = Number(w3.axis.ticks.line.strokeWidth), t5.lineCap = "square", w3.axis.ticks.line.stroke && (t5.strokeStyle = w3.axis.ticks.line.stroke), t5.beginPath(), t5.moveTo(e6.x, e6.y), t5.lineTo(e6.x + e6.lineX, e6.y + e6.lineY), t5.stroke());
    var n6 = B2(e6.value);
    t5.save(), t5.translate(e6.x + e6.textX, e6.y + e6.textY), t5.rotate(ui(h2)), w3.axis.ticks.text.fill && (t5.fillStyle = w3.axis.ticks.text.fill), t5.fillText(String(n6), 0, 0), t5.restore();
  }), void 0 !== b4) {
    var z2 = 0, V2 = 0, C3 = 0, D = "center";
    "y" === n5 ? (C3 = -90, z2 = O3, "start" === S3 ? (D = "start", V2 = c) : "middle" === S3 ? (D = "center", V2 = c / 2) : "end" === S3 && (D = "end")) : (V2 = O3, "start" === S3 ? D = "start" : "middle" === S3 ? (D = "center", z2 = c / 2) : "end" === S3 && (D = "end", z2 = c)), t5.translate(z2, V2), t5.rotate(ui(C3)), t5.font = (w3.axis.legend.text.fontWeight ? w3.axis.legend.text.fontWeight + " " : "") + w3.axis.legend.text.fontSize + "px " + w3.axis.legend.text.fontFamily, w3.axis.legend.text.fill && (t5.fillStyle = w3.axis.legend.text.fill), t5.textAlign = D, t5.textBaseline = "middle", t5.fillText(b4, 0, 0);
  }
  t5.restore();
};
var V = function(t5, e5) {
  var i4 = e5.xScale, n5 = e5.yScale, r4 = e5.width, a3 = e5.height, o3 = e5.top, l2 = e5.right, s2 = e5.bottom, c = e5.left, f2 = e5.theme, x2 = { top: o3, right: l2, bottom: s2, left: c };
  A.forEach(function(e6) {
    var o4 = x2[e6];
    if (!o4)
      return null;
    var l3 = "top" === e6 || "bottom" === e6, s3 = "top" === e6 || "left" === e6 ? "before" : "after", c2 = l3 ? i4 : n5, u = b2(o4.format, c2);
    z(t5, v({}, o4, { axis: l3 ? "x" : "y", x: "right" === e6 ? r4 : 0, y: "bottom" === e6 ? a3 : 0, scale: c2, format: u, length: l3 ? r4 : a3, ticksPosition: s3, theme: f2 }));
  });
};
var C2 = function(t5, e5) {
  var i4 = e5.width, n5 = e5.height, r4 = e5.scale, a3 = e5.axis, o3 = e5.values;
  P2({ width: i4, height: n5, scale: r4, axis: a3, values: o3 }).forEach(function(e6) {
    t5.beginPath(), t5.moveTo(e6.x1, e6.y1), t5.lineTo(e6.x2, e6.y2), t5.stroke();
  });
};

// ../../node_modules/@nivo/line/dist/nivo-line.es.js
var import_prop_types2 = __toESM(require_prop_types());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());

// ../../node_modules/@nivo/voronoi/dist/nivo-voronoi.es.js
var import_react2 = __toESM(require_react());

// ../../node_modules/delaunator/index.js
var EPSILON = Math.pow(2, -52);
var EDGE_STACK = new Uint32Array(512);
var Delaunator = class {
  static from(points, getX = defaultGetX, getY = defaultGetY) {
    const n5 = points.length;
    const coords = new Float64Array(n5 * 2);
    for (let i4 = 0; i4 < n5; i4++) {
      const p3 = points[i4];
      coords[2 * i4] = getX(p3);
      coords[2 * i4 + 1] = getY(p3);
    }
    return new Delaunator(coords);
  }
  constructor(coords) {
    const n5 = coords.length >> 1;
    if (n5 > 0 && typeof coords[0] !== "number")
      throw new Error("Expected coords to contain numbers.");
    this.coords = coords;
    const maxTriangles = Math.max(2 * n5 - 5, 0);
    this._triangles = new Uint32Array(maxTriangles * 3);
    this._halfedges = new Int32Array(maxTriangles * 3);
    this._hashSize = Math.ceil(Math.sqrt(n5));
    this._hullPrev = new Uint32Array(n5);
    this._hullNext = new Uint32Array(n5);
    this._hullTri = new Uint32Array(n5);
    this._hullHash = new Int32Array(this._hashSize).fill(-1);
    this._ids = new Uint32Array(n5);
    this._dists = new Float64Array(n5);
    this.update();
  }
  update() {
    const { coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash } = this;
    const n5 = coords.length >> 1;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i4 = 0; i4 < n5; i4++) {
      const x2 = coords[2 * i4];
      const y2 = coords[2 * i4 + 1];
      if (x2 < minX)
        minX = x2;
      if (y2 < minY)
        minY = y2;
      if (x2 > maxX)
        maxX = x2;
      if (y2 > maxY)
        maxY = y2;
      this._ids[i4] = i4;
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    let minDist = Infinity;
    let i0, i1, i22;
    for (let i4 = 0; i4 < n5; i4++) {
      const d = dist(cx, cy, coords[2 * i4], coords[2 * i4 + 1]);
      if (d < minDist) {
        i0 = i4;
        minDist = d;
      }
    }
    const i0x = coords[2 * i0];
    const i0y = coords[2 * i0 + 1];
    minDist = Infinity;
    for (let i4 = 0; i4 < n5; i4++) {
      if (i4 === i0)
        continue;
      const d = dist(i0x, i0y, coords[2 * i4], coords[2 * i4 + 1]);
      if (d < minDist && d > 0) {
        i1 = i4;
        minDist = d;
      }
    }
    let i1x = coords[2 * i1];
    let i1y = coords[2 * i1 + 1];
    let minRadius = Infinity;
    for (let i4 = 0; i4 < n5; i4++) {
      if (i4 === i0 || i4 === i1)
        continue;
      const r4 = circumradius(i0x, i0y, i1x, i1y, coords[2 * i4], coords[2 * i4 + 1]);
      if (r4 < minRadius) {
        i22 = i4;
        minRadius = r4;
      }
    }
    let i2x = coords[2 * i22];
    let i2y = coords[2 * i22 + 1];
    if (minRadius === Infinity) {
      for (let i4 = 0; i4 < n5; i4++) {
        this._dists[i4] = coords[2 * i4] - coords[0] || coords[2 * i4 + 1] - coords[1];
      }
      quicksort(this._ids, this._dists, 0, n5 - 1);
      const hull = new Uint32Array(n5);
      let j = 0;
      for (let i4 = 0, d0 = -Infinity; i4 < n5; i4++) {
        const id = this._ids[i4];
        if (this._dists[id] > d0) {
          hull[j++] = id;
          d0 = this._dists[id];
        }
      }
      this.hull = hull.subarray(0, j);
      this.triangles = new Uint32Array(0);
      this.halfedges = new Uint32Array(0);
      return;
    }
    if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
      const i4 = i1;
      const x2 = i1x;
      const y2 = i1y;
      i1 = i22;
      i1x = i2x;
      i1y = i2y;
      i22 = i4;
      i2x = x2;
      i2y = y2;
    }
    const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;
    for (let i4 = 0; i4 < n5; i4++) {
      this._dists[i4] = dist(coords[2 * i4], coords[2 * i4 + 1], center.x, center.y);
    }
    quicksort(this._ids, this._dists, 0, n5 - 1);
    this._hullStart = i0;
    let hullSize = 3;
    hullNext[i0] = hullPrev[i22] = i1;
    hullNext[i1] = hullPrev[i0] = i22;
    hullNext[i22] = hullPrev[i1] = i0;
    hullTri[i0] = 0;
    hullTri[i1] = 1;
    hullTri[i22] = 2;
    hullHash.fill(-1);
    hullHash[this._hashKey(i0x, i0y)] = i0;
    hullHash[this._hashKey(i1x, i1y)] = i1;
    hullHash[this._hashKey(i2x, i2y)] = i22;
    this.trianglesLen = 0;
    this._addTriangle(i0, i1, i22, -1, -1, -1);
    for (let k4 = 0, xp, yp; k4 < this._ids.length; k4++) {
      const i4 = this._ids[k4];
      const x2 = coords[2 * i4];
      const y2 = coords[2 * i4 + 1];
      if (k4 > 0 && Math.abs(x2 - xp) <= EPSILON && Math.abs(y2 - yp) <= EPSILON)
        continue;
      xp = x2;
      yp = y2;
      if (i4 === i0 || i4 === i1 || i4 === i22)
        continue;
      let start = 0;
      for (let j = 0, key = this._hashKey(x2, y2); j < this._hashSize; j++) {
        start = hullHash[(key + j) % this._hashSize];
        if (start !== -1 && start !== hullNext[start])
          break;
      }
      start = hullPrev[start];
      let e5 = start, q;
      while (q = hullNext[e5], !orient(x2, y2, coords[2 * e5], coords[2 * e5 + 1], coords[2 * q], coords[2 * q + 1])) {
        e5 = q;
        if (e5 === start) {
          e5 = -1;
          break;
        }
      }
      if (e5 === -1)
        continue;
      let t5 = this._addTriangle(e5, i4, hullNext[e5], -1, -1, hullTri[e5]);
      hullTri[i4] = this._legalize(t5 + 2);
      hullTri[e5] = t5;
      hullSize++;
      let n6 = hullNext[e5];
      while (q = hullNext[n6], orient(x2, y2, coords[2 * n6], coords[2 * n6 + 1], coords[2 * q], coords[2 * q + 1])) {
        t5 = this._addTriangle(n6, i4, q, hullTri[i4], -1, hullTri[n6]);
        hullTri[i4] = this._legalize(t5 + 2);
        hullNext[n6] = n6;
        hullSize--;
        n6 = q;
      }
      if (e5 === start) {
        while (q = hullPrev[e5], orient(x2, y2, coords[2 * q], coords[2 * q + 1], coords[2 * e5], coords[2 * e5 + 1])) {
          t5 = this._addTriangle(q, i4, e5, -1, hullTri[e5], hullTri[q]);
          this._legalize(t5 + 2);
          hullTri[q] = t5;
          hullNext[e5] = e5;
          hullSize--;
          e5 = q;
        }
      }
      this._hullStart = hullPrev[i4] = e5;
      hullNext[e5] = hullPrev[n6] = i4;
      hullNext[i4] = n6;
      hullHash[this._hashKey(x2, y2)] = i4;
      hullHash[this._hashKey(coords[2 * e5], coords[2 * e5 + 1])] = e5;
    }
    this.hull = new Uint32Array(hullSize);
    for (let i4 = 0, e5 = this._hullStart; i4 < hullSize; i4++) {
      this.hull[i4] = e5;
      e5 = hullNext[e5];
    }
    this.triangles = this._triangles.subarray(0, this.trianglesLen);
    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  }
  _hashKey(x2, y2) {
    return Math.floor(pseudoAngle(x2 - this._cx, y2 - this._cy) * this._hashSize) % this._hashSize;
  }
  _legalize(a3) {
    const { _triangles: triangles, _halfedges: halfedges, coords } = this;
    let i4 = 0;
    let ar = 0;
    while (true) {
      const b4 = halfedges[a3];
      const a0 = a3 - a3 % 3;
      ar = a0 + (a3 + 2) % 3;
      if (b4 === -1) {
        if (i4 === 0)
          break;
        a3 = EDGE_STACK[--i4];
        continue;
      }
      const b0 = b4 - b4 % 3;
      const al = a0 + (a3 + 1) % 3;
      const bl = b0 + (b4 + 2) % 3;
      const p0 = triangles[ar];
      const pr2 = triangles[a3];
      const pl = triangles[al];
      const p1 = triangles[bl];
      const illegal = inCircle(
        coords[2 * p0],
        coords[2 * p0 + 1],
        coords[2 * pr2],
        coords[2 * pr2 + 1],
        coords[2 * pl],
        coords[2 * pl + 1],
        coords[2 * p1],
        coords[2 * p1 + 1]
      );
      if (illegal) {
        triangles[a3] = p1;
        triangles[b4] = p0;
        const hbl = halfedges[bl];
        if (hbl === -1) {
          let e5 = this._hullStart;
          do {
            if (this._hullTri[e5] === bl) {
              this._hullTri[e5] = a3;
              break;
            }
            e5 = this._hullPrev[e5];
          } while (e5 !== this._hullStart);
        }
        this._link(a3, hbl);
        this._link(b4, halfedges[ar]);
        this._link(ar, bl);
        const br = b0 + (b4 + 1) % 3;
        if (i4 < EDGE_STACK.length) {
          EDGE_STACK[i4++] = br;
        }
      } else {
        if (i4 === 0)
          break;
        a3 = EDGE_STACK[--i4];
      }
    }
    return ar;
  }
  _link(a3, b4) {
    this._halfedges[a3] = b4;
    if (b4 !== -1)
      this._halfedges[b4] = a3;
  }
  // add a new triangle given vertex indices and adjacent half-edge ids
  _addTriangle(i0, i1, i22, a3, b4, c) {
    const t5 = this.trianglesLen;
    this._triangles[t5] = i0;
    this._triangles[t5 + 1] = i1;
    this._triangles[t5 + 2] = i22;
    this._link(t5, a3);
    this._link(t5 + 1, b4);
    this._link(t5 + 2, c);
    this.trianglesLen += 3;
    return t5;
  }
};
function pseudoAngle(dx, dy) {
  const p3 = dx / (Math.abs(dx) + Math.abs(dy));
  return (dy > 0 ? 3 - p3 : 1 + p3) / 4;
}
function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
function orientIfSure(px, py, rx, ry, qx, qy) {
  const l2 = (ry - py) * (qx - px);
  const r4 = (rx - px) * (qy - py);
  return Math.abs(l2 - r4) >= 33306690738754716e-32 * Math.abs(l2 + r4) ? l2 - r4 : 0;
}
function orient(rx, ry, qx, qy, px, py) {
  const sign = orientIfSure(px, py, rx, ry, qx, qy) || orientIfSure(rx, ry, qx, qy, px, py) || orientIfSure(qx, qy, px, py, rx, ry);
  return sign < 0;
}
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
  const dx = ax - px;
  const dy = ay - py;
  const ex = bx - px;
  const ey = by - py;
  const fx = cx - px;
  const fy = cy - py;
  const ap = dx * dx + dy * dy;
  const bp = ex * ex + ey * ey;
  const cp = fx * fx + fy * fy;
  return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
}
function circumradius(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x2 = (ey * bl - dy * cl) * d;
  const y2 = (dx * cl - ex * bl) * d;
  return x2 * x2 + y2 * y2;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax;
  const dy = by - ay;
  const ex = cx - ax;
  const ey = cy - ay;
  const bl = dx * dx + dy * dy;
  const cl = ex * ex + ey * ey;
  const d = 0.5 / (dx * ey - dy * ex);
  const x2 = ax + (ey * bl - dy * cl) * d;
  const y2 = ay + (dx * cl - ex * bl) * d;
  return { x: x2, y: y2 };
}
function quicksort(ids, dists, left, right) {
  if (right - left <= 20) {
    for (let i4 = left + 1; i4 <= right; i4++) {
      const temp = ids[i4];
      const tempDist = dists[temp];
      let j = i4 - 1;
      while (j >= left && dists[ids[j]] > tempDist)
        ids[j + 1] = ids[j--];
      ids[j + 1] = temp;
    }
  } else {
    const median = left + right >> 1;
    let i4 = left + 1;
    let j = right;
    swap(ids, median, i4);
    if (dists[ids[left]] > dists[ids[right]])
      swap(ids, left, right);
    if (dists[ids[i4]] > dists[ids[right]])
      swap(ids, i4, right);
    if (dists[ids[left]] > dists[ids[i4]])
      swap(ids, left, i4);
    const temp = ids[i4];
    const tempDist = dists[temp];
    while (true) {
      do
        i4++;
      while (dists[ids[i4]] < tempDist);
      do
        j--;
      while (dists[ids[j]] > tempDist);
      if (j < i4)
        break;
      swap(ids, i4, j);
    }
    ids[left + 1] = ids[j];
    ids[j] = temp;
    if (right - i4 + 1 >= j - left) {
      quicksort(ids, dists, i4, right);
      quicksort(ids, dists, left, j - 1);
    } else {
      quicksort(ids, dists, left, j - 1);
      quicksort(ids, dists, i4, right);
    }
  }
}
function swap(arr, i4, j) {
  const tmp = arr[i4];
  arr[i4] = arr[j];
  arr[j] = tmp;
}
function defaultGetX(p3) {
  return p3[0];
}
function defaultGetY(p3) {
  return p3[1];
}

// ../../node_modules/d3-delaunay/src/path.js
var epsilon = 1e-6;
var Path = class {
  constructor() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
  }
  moveTo(x2, y2) {
    this._ += `M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  }
  lineTo(x2, y2) {
    this._ += `L${this._x1 = +x2},${this._y1 = +y2}`;
  }
  arc(x2, y2, r4) {
    x2 = +x2, y2 = +y2, r4 = +r4;
    const x0 = x2 + r4;
    const y0 = y2;
    if (r4 < 0)
      throw new Error("negative radius");
    if (this._x1 === null)
      this._ += `M${x0},${y0}`;
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon)
      this._ += "L" + x0 + "," + y0;
    if (!r4)
      return;
    this._ += `A${r4},${r4},0,1,1,${x2 - r4},${y2}A${r4},${r4},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
  }
  rect(x2, y2, w3, h2) {
    this._ += `M${this._x0 = this._x1 = +x2},${this._y0 = this._y1 = +y2}h${+w3}v${+h2}h${-w3}Z`;
  }
  value() {
    return this._ || null;
  }
};

// ../../node_modules/d3-delaunay/src/polygon.js
var Polygon = class {
  constructor() {
    this._ = [];
  }
  moveTo(x2, y2) {
    this._.push([x2, y2]);
  }
  closePath() {
    this._.push(this._[0].slice());
  }
  lineTo(x2, y2) {
    this._.push([x2, y2]);
  }
  value() {
    return this._.length ? this._ : null;
  }
};

// ../../node_modules/d3-delaunay/src/voronoi.js
var Voronoi = class {
  constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin)))
      throw new Error("invalid bounds");
    this.delaunay = delaunay;
    this._circumcenters = new Float64Array(delaunay.points.length * 2);
    this.vectors = new Float64Array(delaunay.points.length * 2);
    this.xmax = xmax, this.xmin = xmin;
    this.ymax = ymax, this.ymin = ymin;
    this._init();
  }
  update() {
    this.delaunay.update();
    this._init();
    return this;
  }
  _init() {
    const { delaunay: { points, hull, triangles }, vectors } = this;
    const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
    for (let i4 = 0, j = 0, n5 = triangles.length, x2, y2; i4 < n5; i4 += 3, j += 2) {
      const t12 = triangles[i4] * 2;
      const t22 = triangles[i4 + 1] * 2;
      const t32 = triangles[i4 + 2] * 2;
      const x12 = points[t12];
      const y12 = points[t12 + 1];
      const x22 = points[t22];
      const y22 = points[t22 + 1];
      const x3 = points[t32];
      const y3 = points[t32 + 1];
      const dx = x22 - x12;
      const dy = y22 - y12;
      const ex = x3 - x12;
      const ey = y3 - y12;
      const bl = dx * dx + dy * dy;
      const cl = ex * ex + ey * ey;
      const ab = (dx * ey - dy * ex) * 2;
      if (!ab) {
        x2 = (x12 + x3) / 2 - 1e8 * ey;
        y2 = (y12 + y3) / 2 + 1e8 * ex;
      } else if (Math.abs(ab) < 1e-8) {
        x2 = (x12 + x3) / 2;
        y2 = (y12 + y3) / 2;
      } else {
        const d = 1 / ab;
        x2 = x12 + (ey * bl - dy * cl) * d;
        y2 = y12 + (dx * cl - ex * bl) * d;
      }
      circumcenters[j] = x2;
      circumcenters[j + 1] = y2;
    }
    let h2 = hull[hull.length - 1];
    let p0, p1 = h2 * 4;
    let x0, x1 = points[2 * h2];
    let y0, y1 = points[2 * h2 + 1];
    vectors.fill(0);
    for (let i4 = 0; i4 < hull.length; ++i4) {
      h2 = hull[i4];
      p0 = p1, x0 = x1, y0 = y1;
      p1 = h2 * 4, x1 = points[2 * h2], y1 = points[2 * h2 + 1];
      vectors[p0 + 2] = vectors[p1] = y0 - y1;
      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
    }
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { delaunay: { halfedges, inedges, hull }, circumcenters, vectors } = this;
    if (hull.length <= 1)
      return null;
    for (let i4 = 0, n5 = halfedges.length; i4 < n5; ++i4) {
      const j = halfedges[i4];
      if (j < i4)
        continue;
      const ti2 = Math.floor(i4 / 3) * 2;
      const tj = Math.floor(j / 3) * 2;
      const xi = circumcenters[ti2];
      const yi2 = circumcenters[ti2 + 1];
      const xj = circumcenters[tj];
      const yj = circumcenters[tj + 1];
      this._renderSegment(xi, yi2, xj, yj, context);
    }
    let h0, h1 = hull[hull.length - 1];
    for (let i4 = 0; i4 < hull.length; ++i4) {
      h0 = h1, h1 = hull[i4];
      const t5 = Math.floor(inedges[h1] / 3) * 2;
      const x2 = circumcenters[t5];
      const y2 = circumcenters[t5 + 1];
      const v3 = h0 * 4;
      const p3 = this._project(x2, y2, vectors[v3 + 2], vectors[v3 + 3]);
      if (p3)
        this._renderSegment(x2, y2, p3[0], p3[1], context);
    }
    return buffer && buffer.value();
  }
  renderBounds(context) {
    const buffer = context == null ? context = new Path() : void 0;
    context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    return buffer && buffer.value();
  }
  renderCell(i4, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const points = this._clip(i4);
    if (points === null || !points.length)
      return;
    context.moveTo(points[0], points[1]);
    let n5 = points.length;
    while (points[0] === points[n5 - 2] && points[1] === points[n5 - 1] && n5 > 1)
      n5 -= 2;
    for (let i5 = 2; i5 < n5; i5 += 2) {
      if (points[i5] !== points[i5 - 2] || points[i5 + 1] !== points[i5 - 1])
        context.lineTo(points[i5], points[i5 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  *cellPolygons() {
    const { delaunay: { points } } = this;
    for (let i4 = 0, n5 = points.length / 2; i4 < n5; ++i4) {
      const cell = this.cellPolygon(i4);
      if (cell)
        cell.index = i4, yield cell;
    }
  }
  cellPolygon(i4) {
    const polygon = new Polygon();
    this.renderCell(i4, polygon);
    return polygon.value();
  }
  _renderSegment(x0, y0, x1, y1, context) {
    let S3;
    const c0 = this._regioncode(x0, y0);
    const c1 = this._regioncode(x1, y1);
    if (c0 === 0 && c1 === 0) {
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
    } else if (S3 = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
      context.moveTo(S3[0], S3[1]);
      context.lineTo(S3[2], S3[3]);
    }
  }
  contains(i4, x2, y2) {
    if ((x2 = +x2, x2 !== x2) || (y2 = +y2, y2 !== y2))
      return false;
    return this.delaunay._step(i4, x2, y2) === i4;
  }
  *neighbors(i4) {
    const ci = this._clip(i4);
    if (ci)
      for (const j of this.delaunay.neighbors(i4)) {
        const cj = this._clip(j);
        if (cj)
          loop:
            for (let ai = 0, li = ci.length; ai < li; ai += 2) {
              for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
                if (ci[ai] == cj[aj] && ci[ai + 1] == cj[aj + 1] && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]) {
                  yield j;
                  break loop;
                }
              }
            }
      }
  }
  _cell(i4) {
    const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this;
    const e0 = inedges[i4];
    if (e0 === -1)
      return null;
    const points = [];
    let e5 = e0;
    do {
      const t5 = Math.floor(e5 / 3);
      points.push(circumcenters[t5 * 2], circumcenters[t5 * 2 + 1]);
      e5 = e5 % 3 === 2 ? e5 - 2 : e5 + 1;
      if (triangles[e5] !== i4)
        break;
      e5 = halfedges[e5];
    } while (e5 !== e0 && e5 !== -1);
    return points;
  }
  _clip(i4) {
    if (i4 === 0 && this.delaunay.hull.length === 1) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    const points = this._cell(i4);
    if (points === null)
      return null;
    const { vectors: V2 } = this;
    const v3 = i4 * 4;
    return V2[v3] || V2[v3 + 1] ? this._clipInfinite(i4, points, V2[v3], V2[v3 + 1], V2[v3 + 2], V2[v3 + 3]) : this._clipFinite(i4, points);
  }
  _clipFinite(i4, points) {
    const n5 = points.length;
    let P4 = null;
    let x0, y0, x1 = points[n5 - 2], y1 = points[n5 - 1];
    let c0, c1 = this._regioncode(x1, y1);
    let e0, e1;
    for (let j = 0; j < n5; j += 2) {
      x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
      c0 = c1, c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        e0 = e1, e1 = 0;
        if (P4)
          P4.push(x1, y1);
        else
          P4 = [x1, y1];
      } else {
        let S3, sx0, sy0, sx1, sy1;
        if (c0 === 0) {
          if ((S3 = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null)
            continue;
          [sx0, sy0, sx1, sy1] = S3;
        } else {
          if ((S3 = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null)
            continue;
          [sx1, sy1, sx0, sy0] = S3;
          e0 = e1, e1 = this._edgecode(sx0, sy0);
          if (e0 && e1)
            this._edge(i4, e0, e1, P4, P4.length);
          if (P4)
            P4.push(sx0, sy0);
          else
            P4 = [sx0, sy0];
        }
        e0 = e1, e1 = this._edgecode(sx1, sy1);
        if (e0 && e1)
          this._edge(i4, e0, e1, P4, P4.length);
        if (P4)
          P4.push(sx1, sy1);
        else
          P4 = [sx1, sy1];
      }
    }
    if (P4) {
      e0 = e1, e1 = this._edgecode(P4[0], P4[1]);
      if (e0 && e1)
        this._edge(i4, e0, e1, P4, P4.length);
    } else if (this.contains(i4, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
    }
    return P4;
  }
  _clipSegment(x0, y0, x1, y1, c0, c1) {
    while (true) {
      if (c0 === 0 && c1 === 0)
        return [x0, y0, x1, y1];
      if (c0 & c1)
        return null;
      let x2, y2, c = c0 || c1;
      if (c & 8)
        x2 = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y2 = this.ymax;
      else if (c & 4)
        x2 = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y2 = this.ymin;
      else if (c & 2)
        y2 = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x2 = this.xmax;
      else
        y2 = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x2 = this.xmin;
      if (c0)
        x0 = x2, y0 = y2, c0 = this._regioncode(x0, y0);
      else
        x1 = x2, y1 = y2, c1 = this._regioncode(x1, y1);
    }
  }
  _clipInfinite(i4, points, vx0, vy0, vxn, vyn) {
    let P4 = Array.from(points), p3;
    if (p3 = this._project(P4[0], P4[1], vx0, vy0))
      P4.unshift(p3[0], p3[1]);
    if (p3 = this._project(P4[P4.length - 2], P4[P4.length - 1], vxn, vyn))
      P4.push(p3[0], p3[1]);
    if (P4 = this._clipFinite(i4, P4)) {
      for (let j = 0, n5 = P4.length, c0, c1 = this._edgecode(P4[n5 - 2], P4[n5 - 1]); j < n5; j += 2) {
        c0 = c1, c1 = this._edgecode(P4[j], P4[j + 1]);
        if (c0 && c1)
          j = this._edge(i4, c0, c1, P4, j), n5 = P4.length;
      }
    } else if (this.contains(i4, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
      P4 = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
    }
    return P4;
  }
  _edge(i4, e0, e1, P4, j) {
    while (e0 !== e1) {
      let x2, y2;
      switch (e0) {
        case 5:
          e0 = 4;
          continue;
        case 4:
          e0 = 6, x2 = this.xmax, y2 = this.ymin;
          break;
        case 6:
          e0 = 2;
          continue;
        case 2:
          e0 = 10, x2 = this.xmax, y2 = this.ymax;
          break;
        case 10:
          e0 = 8;
          continue;
        case 8:
          e0 = 9, x2 = this.xmin, y2 = this.ymax;
          break;
        case 9:
          e0 = 1;
          continue;
        case 1:
          e0 = 5, x2 = this.xmin, y2 = this.ymin;
          break;
      }
      if ((P4[j] !== x2 || P4[j + 1] !== y2) && this.contains(i4, x2, y2)) {
        P4.splice(j, 0, x2, y2), j += 2;
      }
    }
    if (P4.length > 4) {
      for (let i5 = 0; i5 < P4.length; i5 += 2) {
        const j2 = (i5 + 2) % P4.length, k4 = (i5 + 4) % P4.length;
        if (P4[i5] === P4[j2] && P4[j2] === P4[k4] || P4[i5 + 1] === P4[j2 + 1] && P4[j2 + 1] === P4[k4 + 1])
          P4.splice(j2, 2), i5 -= 2;
      }
    }
    return j;
  }
  _project(x0, y0, vx, vy) {
    let t5 = Infinity, c, x2, y2;
    if (vy < 0) {
      if (y0 <= this.ymin)
        return null;
      if ((c = (this.ymin - y0) / vy) < t5)
        y2 = this.ymin, x2 = x0 + (t5 = c) * vx;
    } else if (vy > 0) {
      if (y0 >= this.ymax)
        return null;
      if ((c = (this.ymax - y0) / vy) < t5)
        y2 = this.ymax, x2 = x0 + (t5 = c) * vx;
    }
    if (vx > 0) {
      if (x0 >= this.xmax)
        return null;
      if ((c = (this.xmax - x0) / vx) < t5)
        x2 = this.xmax, y2 = y0 + (t5 = c) * vy;
    } else if (vx < 0) {
      if (x0 <= this.xmin)
        return null;
      if ((c = (this.xmin - x0) / vx) < t5)
        x2 = this.xmin, y2 = y0 + (t5 = c) * vy;
    }
    return [x2, y2];
  }
  _edgecode(x2, y2) {
    return (x2 === this.xmin ? 1 : x2 === this.xmax ? 2 : 0) | (y2 === this.ymin ? 4 : y2 === this.ymax ? 8 : 0);
  }
  _regioncode(x2, y2) {
    return (x2 < this.xmin ? 1 : x2 > this.xmax ? 2 : 0) | (y2 < this.ymin ? 4 : y2 > this.ymax ? 8 : 0);
  }
};

// ../../node_modules/d3-delaunay/src/delaunay.js
var tau = 2 * Math.PI;
var pow = Math.pow;
function pointX(p3) {
  return p3[0];
}
function pointY(p3) {
  return p3[1];
}
function collinear(d) {
  const { triangles, coords } = d;
  for (let i4 = 0; i4 < triangles.length; i4 += 3) {
    const a3 = 2 * triangles[i4], b4 = 2 * triangles[i4 + 1], c = 2 * triangles[i4 + 2], cross = (coords[c] - coords[a3]) * (coords[b4 + 1] - coords[a3 + 1]) - (coords[b4] - coords[a3]) * (coords[c + 1] - coords[a3 + 1]);
    if (cross > 1e-10)
      return false;
  }
  return true;
}
function jitter(x2, y2, r4) {
  return [x2 + Math.sin(x2 + y2) * r4, y2 + Math.cos(x2 - y2) * r4];
}
var Delaunay = class {
  static from(points, fx = pointX, fy = pointY, that) {
    return new Delaunay("length" in points ? flatArray(points, fx, fy, that) : Float64Array.from(flatIterable(points, fx, fy, that)));
  }
  constructor(points) {
    this._delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = this._delaunator.coords;
    this._init();
  }
  update() {
    this._delaunator.update();
    this._init();
    return this;
  }
  _init() {
    const d = this._delaunator, points = this.points;
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({ length: points.length / 2 }, (_2, i4) => i4).sort((i4, j) => points[2 * i4] - points[2 * j] || points[2 * i4 + 1] - points[2 * j + 1]);
      const e5 = this.collinear[0], f2 = this.collinear[this.collinear.length - 1], bounds = [points[2 * e5], points[2 * e5 + 1], points[2 * f2], points[2 * f2 + 1]], r4 = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
      for (let i4 = 0, n5 = points.length / 2; i4 < n5; ++i4) {
        const p3 = jitter(points[2 * i4], points[2 * i4 + 1], r4);
        points[2 * i4] = p3[0];
        points[2 * i4 + 1] = p3[1];
      }
      this._delaunator = new Delaunator(points);
    } else {
      delete this.collinear;
    }
    const halfedges = this.halfedges = this._delaunator.halfedges;
    const hull = this.hull = this._delaunator.hull;
    const triangles = this.triangles = this._delaunator.triangles;
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);
    for (let e5 = 0, n5 = halfedges.length; e5 < n5; ++e5) {
      const p3 = triangles[e5 % 3 === 2 ? e5 - 2 : e5 + 1];
      if (halfedges[e5] === -1 || inedges[p3] === -1)
        inedges[p3] = e5;
    }
    for (let i4 = 0, n5 = hull.length; i4 < n5; ++i4) {
      hullIndex[hull[i4]] = i4;
    }
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      this.triangles[1] = hull[1];
      this.triangles[2] = hull[1];
      inedges[hull[0]] = 1;
      if (hull.length === 2)
        inedges[hull[1]] = 0;
    }
  }
  voronoi(bounds) {
    return new Voronoi(this, bounds);
  }
  *neighbors(i4) {
    const { inedges, hull, _hullIndex, halfedges, triangles, collinear: collinear2 } = this;
    if (collinear2) {
      const l2 = collinear2.indexOf(i4);
      if (l2 > 0)
        yield collinear2[l2 - 1];
      if (l2 < collinear2.length - 1)
        yield collinear2[l2 + 1];
      return;
    }
    const e0 = inedges[i4];
    if (e0 === -1)
      return;
    let e5 = e0, p0 = -1;
    do {
      yield p0 = triangles[e5];
      e5 = e5 % 3 === 2 ? e5 - 2 : e5 + 1;
      if (triangles[e5] !== i4)
        return;
      e5 = halfedges[e5];
      if (e5 === -1) {
        const p3 = hull[(_hullIndex[i4] + 1) % hull.length];
        if (p3 !== p0)
          yield p3;
        return;
      }
    } while (e5 !== e0);
  }
  find(x2, y2, i4 = 0) {
    if ((x2 = +x2, x2 !== x2) || (y2 = +y2, y2 !== y2))
      return -1;
    const i0 = i4;
    let c;
    while ((c = this._step(i4, x2, y2)) >= 0 && c !== i4 && c !== i0)
      i4 = c;
    return c;
  }
  _step(i4, x2, y2) {
    const { inedges, hull, _hullIndex, halfedges, triangles, points } = this;
    if (inedges[i4] === -1 || !points.length)
      return (i4 + 1) % (points.length >> 1);
    let c = i4;
    let dc = pow(x2 - points[i4 * 2], 2) + pow(y2 - points[i4 * 2 + 1], 2);
    const e0 = inedges[i4];
    let e5 = e0;
    do {
      let t5 = triangles[e5];
      const dt = pow(x2 - points[t5 * 2], 2) + pow(y2 - points[t5 * 2 + 1], 2);
      if (dt < dc)
        dc = dt, c = t5;
      e5 = e5 % 3 === 2 ? e5 - 2 : e5 + 1;
      if (triangles[e5] !== i4)
        break;
      e5 = halfedges[e5];
      if (e5 === -1) {
        e5 = hull[(_hullIndex[i4] + 1) % hull.length];
        if (e5 !== t5) {
          if (pow(x2 - points[e5 * 2], 2) + pow(y2 - points[e5 * 2 + 1], 2) < dc)
            return e5;
        }
        break;
      }
    } while (e5 !== e0);
    return c;
  }
  render(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, halfedges, triangles } = this;
    for (let i4 = 0, n5 = halfedges.length; i4 < n5; ++i4) {
      const j = halfedges[i4];
      if (j < i4)
        continue;
      const ti2 = triangles[i4] * 2;
      const tj = triangles[j] * 2;
      context.moveTo(points[ti2], points[ti2 + 1]);
      context.lineTo(points[tj], points[tj + 1]);
    }
    this.renderHull(context);
    return buffer && buffer.value();
  }
  renderPoints(context, r4 = 2) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points } = this;
    for (let i4 = 0, n5 = points.length; i4 < n5; i4 += 2) {
      const x2 = points[i4], y2 = points[i4 + 1];
      context.moveTo(x2 + r4, y2);
      context.arc(x2, y2, r4, 0, tau);
    }
    return buffer && buffer.value();
  }
  renderHull(context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { hull, points } = this;
    const h2 = hull[0] * 2, n5 = hull.length;
    context.moveTo(points[h2], points[h2 + 1]);
    for (let i4 = 1; i4 < n5; ++i4) {
      const h3 = 2 * hull[i4];
      context.lineTo(points[h3], points[h3 + 1]);
    }
    context.closePath();
    return buffer && buffer.value();
  }
  hullPolygon() {
    const polygon = new Polygon();
    this.renderHull(polygon);
    return polygon.value();
  }
  renderTriangle(i4, context) {
    const buffer = context == null ? context = new Path() : void 0;
    const { points, triangles } = this;
    const t02 = triangles[i4 *= 3] * 2;
    const t12 = triangles[i4 + 1] * 2;
    const t22 = triangles[i4 + 2] * 2;
    context.moveTo(points[t02], points[t02 + 1]);
    context.lineTo(points[t12], points[t12 + 1]);
    context.lineTo(points[t22], points[t22 + 1]);
    context.closePath();
    return buffer && buffer.value();
  }
  *trianglePolygons() {
    const { triangles } = this;
    for (let i4 = 0, n5 = triangles.length / 3; i4 < n5; ++i4) {
      yield this.trianglePolygon(i4);
    }
  }
  trianglePolygon(i4) {
    const polygon = new Polygon();
    this.renderTriangle(i4, polygon);
    return polygon.value();
  }
};
function flatArray(points, fx, fy, that) {
  const n5 = points.length;
  const array = new Float64Array(n5 * 2);
  for (let i4 = 0; i4 < n5; ++i4) {
    const p3 = points[i4];
    array[i4 * 2] = fx.call(that, p3, i4, points);
    array[i4 * 2 + 1] = fy.call(that, p3, i4, points);
  }
  return array;
}
function* flatIterable(points, fx, fy, that) {
  let i4 = 0;
  for (const p3 of points) {
    yield fx.call(that, p3, i4, points);
    yield fy.call(that, p3, i4, points);
    ++i4;
  }
}

// ../../node_modules/@nivo/voronoi/dist/nivo-voronoi.es.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var g2 = function(n5) {
  return "function" == typeof n5 ? n5 : function(e5) {
    return e5[n5];
  };
};
var b3 = function(n5) {
  var e5 = n5.points, i4 = n5.x, o3 = void 0 === i4 ? "x" : i4, t5 = n5.y, r4 = void 0 === t5 ? "y" : t5, l2 = g2(o3), u = g2(r4);
  return e5.map(function(n6) {
    return [l2(n6), u(n6)];
  });
};
var k3 = function(n5) {
  var e5 = n5.points, i4 = n5.width, o3 = n5.height, t5 = n5.debug, r4 = Delaunay.from(e5), l2 = t5 ? r4.voronoi([0, 0, i4, o3]) : void 0;
  return { delaunay: r4, voronoi: l2 };
};
var x = function(e5) {
  var i4 = e5.points, o3 = e5.x, t5 = e5.y, r4 = e5.width, l2 = e5.height, u = e5.debug, a3 = (0, import_react2.useMemo)(function() {
    return b3({ points: i4, x: o3, y: t5 });
  }, [i4, o3, t5]);
  return (0, import_react2.useMemo)(function() {
    return k3({ points: a3, width: r4, height: l2, debug: u });
  }, [a3, r4, l2, u]);
};
var P3 = function(e5) {
  var i4 = e5.nodes, l2 = e5.width, u = e5.height, a3 = e5.x, d = e5.y, c = e5.onMouseEnter, h2 = e5.onMouseMove, m = e5.onMouseLeave, y2 = e5.onClick, g3 = e5.debug, b4 = (0, import_react2.useRef)(null), k4 = (0, import_react2.useState)(null), C3 = k4[0], L2 = k4[1], w3 = x({ points: i4, x: a3, y: d, width: l2, height: u, debug: g3 }), W3 = w3.delaunay, D = w3.voronoi, M = (0, import_react2.useMemo)(function() {
    if (g3 && D)
      return D.render();
  }, [g3, D]), P4 = (0, import_react2.useCallback)(function(n5) {
    if (!b4.current)
      return [null, null];
    var e6 = Qi(b4.current, n5), o3 = e6[0], t5 = e6[1], r4 = W3.find(o3, t5);
    return [r4, void 0 !== r4 ? i4[r4] : null];
  }, [b4, W3]), O3 = (0, import_react2.useCallback)(function(n5) {
    var e6 = P4(n5), i5 = e6[0], o3 = e6[1];
    L2(i5), o3 && (null == c || c(o3, n5));
  }, [P4, L2, c]), S3 = (0, import_react2.useCallback)(function(n5) {
    var e6 = P4(n5), i5 = e6[0], o3 = e6[1];
    L2(i5), o3 && (null == h2 || h2(o3, n5));
  }, [P4, L2, h2]), j = (0, import_react2.useCallback)(function(n5) {
    if (L2(null), m) {
      var e6 = void 0;
      null !== C3 && (e6 = i4[C3]), e6 && m(e6, n5);
    }
  }, [L2, C3, m, i4]), z2 = (0, import_react2.useCallback)(function(n5) {
    var e6 = P4(n5), i5 = e6[0], o3 = e6[1];
    L2(i5), o3 && (null == y2 || y2(o3, n5));
  }, [P4, L2, y2]);
  return (0, import_jsx_runtime2.jsxs)("g", { ref: b4, children: [g3 && D && (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [(0, import_jsx_runtime2.jsx)("path", { d: M, stroke: "red", strokeWidth: 1, opacity: 0.75 }), null !== C3 && (0, import_jsx_runtime2.jsx)("path", { fill: "pink", opacity: 0.35, d: D.renderCell(C3) })] }), (0, import_jsx_runtime2.jsx)("rect", { width: l2, height: u, fill: "red", opacity: 0, style: { cursor: "auto" }, onMouseEnter: O3, onMouseMove: S3, onMouseLeave: j, onClick: z2 })] });
};
var O2 = function(n5, e5) {
  n5.save(), n5.globalAlpha = 0.75, n5.beginPath(), e5.render(n5), n5.strokeStyle = "red", n5.lineWidth = 1, n5.stroke(), n5.restore();
};
var S2 = function(n5, e5, i4) {
  n5.save(), n5.globalAlpha = 0.35, n5.beginPath(), e5.renderCell(i4, n5), n5.fillStyle = "red", n5.fill(), n5.restore();
};

// ../../node_modules/@nivo/line/dist/nivo-line.es.js
function ie() {
  return ie = Object.assign || function(e5) {
    for (var r4 = 1; r4 < arguments.length; r4++) {
      var i4 = arguments[r4];
      for (var n5 in i4)
        Object.prototype.hasOwnProperty.call(i4, n5) && (e5[n5] = i4[n5]);
    }
    return e5;
  }, ie.apply(this, arguments);
}
var ne = function(e5) {
  var r4 = e5.point;
  return (0, import_jsx_runtime3.jsx)(w, { id: (0, import_jsx_runtime3.jsxs)("span", { children: ["x: ", (0, import_jsx_runtime3.jsx)("strong", { children: r4.data.xFormatted }), ", y:", " ", (0, import_jsx_runtime3.jsx)("strong", { children: r4.data.yFormatted })] }), enableChip: true, color: r4.serieColor });
};
ne.propTypes = { point: import_prop_types2.default.object.isRequired };
var te = (0, import_react3.memo)(ne);
var oe = function(e5) {
  var r4 = e5.slice, i4 = e5.axis, n5 = Vt(), t5 = "x" === i4 ? "y" : "x";
  return (0, import_jsx_runtime3.jsx)(C, { rows: r4.points.map(function(e6) {
    return [(0, import_jsx_runtime3.jsx)(b, { color: e6.serieColor, style: n5.tooltip.chip }, "chip"), e6.serieId, (0, import_jsx_runtime3.jsx)("span", { style: n5.tooltip.tableCellValue, children: e6.data[t5 + "Formatted"] }, "value")];
  }) });
};
oe.propTypes = { slice: import_prop_types2.default.object.isRequired, axis: import_prop_types2.default.oneOf(["x", "y"]).isRequired };
var ae = (0, import_react3.memo)(oe);
var se = { data: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ id: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number]).isRequired, data: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ x: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]), y: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]) })).isRequired })).isRequired, xScale: import_prop_types2.default.object.isRequired, xFormat: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.string]), yScale: import_prop_types2.default.object.isRequired, yFormat: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.string]), layers: import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.oneOf(["grid", "markers", "axes", "areas", "crosshair", "lines", "slices", "points", "mesh", "legends"]), import_prop_types2.default.func])).isRequired, curve: Rt.isRequired, axisTop: w2, axisRight: w2, axisBottom: w2, axisLeft: w2, enableGridX: import_prop_types2.default.bool.isRequired, enableGridY: import_prop_types2.default.bool.isRequired, gridXValues: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]))]), gridYValues: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.arrayOf(import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]))]), enablePoints: import_prop_types2.default.bool.isRequired, pointSymbol: import_prop_types2.default.func, pointSize: import_prop_types2.default.number.isRequired, pointColor: import_prop_types2.default.any.isRequired, pointBorderWidth: import_prop_types2.default.number.isRequired, pointBorderColor: import_prop_types2.default.any.isRequired, enablePointLabel: import_prop_types2.default.bool.isRequired, pointLabel: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.func]).isRequired, markers: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ axis: import_prop_types2.default.oneOf(["x", "y"]).isRequired, value: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]).isRequired, style: import_prop_types2.default.object })), colors: Xe.isRequired, enableArea: import_prop_types2.default.bool.isRequired, areaOpacity: import_prop_types2.default.number.isRequired, areaBlendMode: Mt.isRequired, areaBaselineValue: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]).isRequired, lineWidth: import_prop_types2.default.number.isRequired, legends: import_prop_types2.default.arrayOf(import_prop_types2.default.shape(T)).isRequired, isInteractive: import_prop_types2.default.bool.isRequired, debugMesh: import_prop_types2.default.bool.isRequired, tooltip: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object]).isRequired, enableSlices: import_prop_types2.default.oneOf(["x", "y", false]).isRequired, debugSlices: import_prop_types2.default.bool.isRequired, sliceTooltip: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object]).isRequired, enableCrosshair: import_prop_types2.default.bool.isRequired, crosshairType: import_prop_types2.default.string.isRequired };
var le = ie({}, se, { enablePointLabel: import_prop_types2.default.bool.isRequired, role: import_prop_types2.default.string.isRequired, useMesh: import_prop_types2.default.bool.isRequired }, et, kt);
var ue = ie({ pixelRatio: import_prop_types2.default.number.isRequired }, se);
var de = { curve: "linear", xScale: { type: "point" }, yScale: { type: "linear", min: 0, max: "auto" }, layers: ["grid", "markers", "axes", "areas", "crosshair", "lines", "points", "slices", "mesh", "legends"], axisBottom: {}, axisLeft: {}, enableGridX: true, enableGridY: true, enablePoints: true, pointSize: 6, pointColor: { from: "color" }, pointBorderWidth: 0, pointBorderColor: { theme: "background" }, enablePointLabel: false, pointLabel: "yFormatted", colors: { scheme: "nivo" }, enableArea: false, areaBaselineValue: 0, areaOpacity: 0.2, areaBlendMode: "normal", lineWidth: 2, legends: [], isInteractive: true, tooltip: te, enableSlices: false, debugSlices: false, sliceTooltip: ae, debugMesh: false, enableCrosshair: true, crosshairType: "bottom-left" };
var ce = ie({}, de, { enablePointLabel: false, useMesh: false, animate: true, motionConfig: "gentle", defs: [], fill: [], role: "img" });
var fe = ie({}, de, { pixelRatio: "undefined" != typeof window && window.devicePixelRatio || 1 });
var pe = function(e5) {
  var i4 = e5.curve;
  return (0, import_react3.useMemo)(function() {
    return line_default().defined(function(e6) {
      return null !== e6.x && null !== e6.y;
    }).x(function(e6) {
      return e6.x;
    }).y(function(e6) {
      return e6.y;
    }).curve(qt(i4));
  }, [i4]);
};
var he = function(e5) {
  var i4 = e5.curve, n5 = e5.yScale, t5 = e5.areaBaselineValue;
  return (0, import_react3.useMemo)(function() {
    return area_default().defined(function(e6) {
      return null !== e6.x && null !== e6.y;
    }).x(function(e6) {
      return e6.x;
    }).y1(function(e6) {
      return e6.y;
    }).curve(qt(i4)).y0(n5(t5));
  }, [i4, n5, t5]);
};
var ye = function(e5) {
  var i4 = e5.enableSlices, n5 = e5.points, t5 = e5.width, o3 = e5.height;
  return (0, import_react3.useMemo)(function() {
    if (false === i4)
      return [];
    if ("x" === i4) {
      var e6 = /* @__PURE__ */ new Map();
      return n5.forEach(function(r5) {
        null !== r5.data.x && null !== r5.data.y && (e6.has(r5.x) ? e6.get(r5.x).push(r5) : e6.set(r5.x, [r5]));
      }), Array.from(e6.entries()).sort(function(e7, r5) {
        return e7[0] - r5[0];
      }).map(function(e7, r5, i5) {
        var n6, a3 = e7[0], s2 = e7[1], l2 = i5[r5 - 1], u = i5[r5 + 1];
        return { id: a3, x0: n6 = l2 ? a3 - (a3 - l2[0]) / 2 : a3, x: a3, y0: 0, y: 0, width: u ? a3 - n6 + (u[0] - a3) / 2 : t5 - n6, height: o3, points: s2.reverse() };
      });
    }
    if ("y" === i4) {
      var r4 = /* @__PURE__ */ new Map();
      return n5.forEach(function(e7) {
        null !== e7.data.x && null !== e7.data.y && (r4.has(e7.y) ? r4.get(e7.y).push(e7) : r4.set(e7.y, [e7]));
      }), Array.from(r4.entries()).sort(function(e7, r5) {
        return e7[0] - r5[0];
      }).map(function(e7, r5, i5) {
        var n6, a3, s2 = e7[0], l2 = e7[1], u = i5[r5 - 1], d = i5[r5 + 1];
        return n6 = u ? s2 - (s2 - u[0]) / 2 : s2, a3 = d ? s2 - n6 + (d[0] - s2) / 2 : o3 - n6, { id: s2, x0: 0, x: 0, y0: n6, y: s2, width: t5, height: a3, points: l2.reverse() };
      });
    }
  }, [i4, n5]);
};
var be = function(e5) {
  var t5 = e5.data, o3 = e5.xScale, a3 = void 0 === o3 ? ce.xScale : o3, s2 = e5.xFormat, l2 = e5.yScale, d = void 0 === l2 ? ce.yScale : l2, c = e5.yFormat, f2 = e5.width, p3 = e5.height, h2 = e5.colors, b4 = void 0 === h2 ? ce.colors : h2, g3 = e5.curve, m = void 0 === g3 ? ce.curve : g3, v3 = e5.areaBaselineValue, x2 = void 0 === v3 ? ce.areaBaselineValue : v3, R = e5.pointColor, q = void 0 === R ? ce.pointColor : R, O3 = e5.pointBorderColor, S3 = void 0 === O3 ? ce.pointBorderColor : O3, C3 = e5.enableSlices, T3 = void 0 === C3 ? ce.enableSlicesTooltip : C3, M = Xt(s2), w3 = Xt(c), W3 = pr(b4, "id"), G = Vt(), L2 = We(q, G), P4 = We(S3, G), j = (0, import_react3.useState)([]), F = j[0], V2 = j[1], E = (0, import_react3.useMemo)(function() {
    return dn(t5.filter(function(e6) {
      return -1 === F.indexOf(e6.id);
    }), a3, d, f2, p3);
  }, [t5, F, a3, d, f2, p3]), Y3 = E.xScale, D = E.yScale, X4 = E.series, z2 = (0, import_react3.useMemo)(function() {
    var e6 = t5.map(function(e7) {
      return { id: e7.id, label: e7.id, color: W3(e7) };
    }), r4 = e6.map(function(e7) {
      return ie({}, X4.find(function(r5) {
        return r5.id === e7.id;
      }), { color: e7.color });
    }).filter(function(e7) {
      return Boolean(e7.id);
    });
    return { legendData: e6.map(function(e7) {
      return ie({}, e7, { hidden: !r4.find(function(r5) {
        return r5.id === e7.id;
      }) });
    }).reverse(), series: r4 };
  }, [t5, X4, W3]), A2 = z2.legendData, H2 = z2.series, I = (0, import_react3.useCallback)(function(e6) {
    V2(function(r4) {
      return r4.indexOf(e6) > -1 ? r4.filter(function(r5) {
        return r5 !== e6;
      }) : [].concat(r4, [e6]);
    });
  }, []), K3 = function(e6) {
    var i4 = e6.series, n5 = e6.getPointColor, t6 = e6.getPointBorderColor, o4 = e6.formatX, a4 = e6.formatY;
    return (0, import_react3.useMemo)(function() {
      return i4.reduce(function(e7, r4) {
        return [].concat(e7, r4.data.filter(function(e8) {
          return null !== e8.position.x && null !== e8.position.y;
        }).map(function(i5, s3) {
          var l3 = { id: r4.id + "." + s3, index: e7.length + s3, serieId: r4.id, serieColor: r4.color, x: i5.position.x, y: i5.position.y };
          return l3.color = n5(r4), l3.borderColor = t6(l3), l3.data = ie({}, i5.data, { xFormatted: o4(i5.data.x), yFormatted: a4(i5.data.y) }), l3;
        }));
      }, []);
    }, [i4, n5, t6, o4, a4]);
  }({ series: H2, getPointColor: L2, getPointBorderColor: P4, formatX: M, formatY: w3 }), N2 = ye({ enableSlices: T3, points: K3, width: f2, height: p3 });
  return { legendData: A2, toggleSerie: I, lineGenerator: pe({ curve: m }), areaGenerator: he({ curve: m, yScale: D, areaBaselineValue: x2 }), getColor: W3, series: H2, xScale: Y3, yScale: D, slices: N2, points: K3 };
};
var ge = function(e5) {
  var r4 = e5.areaBlendMode, i4 = e5.areaOpacity, n5 = e5.color, t5 = e5.fill, o3 = e5.path, a3 = tt(), s2 = a3.animate, l2 = a3.config, u = it(o3), d = useSpring({ color: n5, config: l2, immediate: !s2 });
  return (0, import_jsx_runtime3.jsx)(animated.path, { d: u, fill: t5 || d.color, fillOpacity: i4, strokeWidth: 0, style: { mixBlendMode: r4 } });
};
ge.propTypes = { areaBlendMode: Mt.isRequired, areaOpacity: import_prop_types2.default.number.isRequired, color: import_prop_types2.default.string, fill: import_prop_types2.default.string, path: import_prop_types2.default.string.isRequired };
var me = function(e5) {
  var r4 = e5.areaGenerator, i4 = e5.areaOpacity, n5 = e5.areaBlendMode, t5 = e5.lines.slice(0).reverse();
  return (0, import_jsx_runtime3.jsx)("g", { children: t5.map(function(e6) {
    return (0, import_jsx_runtime3.jsx)(ge, ie({ path: r4(e6.data.map(function(e7) {
      return e7.position;
    })) }, ie({ areaOpacity: i4, areaBlendMode: n5 }, e6)), e6.id);
  }) });
};
me.propTypes = { areaGenerator: import_prop_types2.default.func.isRequired, areaOpacity: import_prop_types2.default.number.isRequired, areaBlendMode: Mt.isRequired, lines: import_prop_types2.default.arrayOf(import_prop_types2.default.object).isRequired };
var ve = (0, import_react3.memo)(me);
var xe = function(e5) {
  var i4 = e5.lineGenerator, n5 = e5.points, t5 = e5.color, o3 = e5.thickness, a3 = (0, import_react3.useMemo)(function() {
    return i4(n5);
  }, [i4, n5]), s2 = it(a3);
  return (0, import_jsx_runtime3.jsx)(animated.path, { d: s2, fill: "none", strokeWidth: o3, stroke: t5 });
};
xe.propTypes = { points: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ x: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number]), y: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number]) })), lineGenerator: import_prop_types2.default.func.isRequired, color: import_prop_types2.default.string.isRequired, thickness: import_prop_types2.default.number.isRequired };
var Re = (0, import_react3.memo)(xe);
var qe = function(e5) {
  var r4 = e5.lines, i4 = e5.lineGenerator, n5 = e5.lineWidth;
  return r4.slice(0).reverse().map(function(e6) {
    var r5 = e6.id, t5 = e6.data, o3 = e6.color;
    return (0, import_jsx_runtime3.jsx)(Re, { id: r5, points: t5.map(function(e7) {
      return e7.position;
    }), lineGenerator: i4, color: o3, thickness: n5 }, r5);
  });
};
qe.propTypes = { lines: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ id: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number]).isRequired, color: import_prop_types2.default.string.isRequired, data: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ data: import_prop_types2.default.shape({ x: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number, import_prop_types2.default.instanceOf(Date)]), y: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.number, import_prop_types2.default.instanceOf(Date)]) }).isRequired, position: import_prop_types2.default.shape({ x: import_prop_types2.default.number, y: import_prop_types2.default.number }).isRequired })).isRequired })).isRequired, lineWidth: import_prop_types2.default.number.isRequired, lineGenerator: import_prop_types2.default.func.isRequired };
var Oe = (0, import_react3.memo)(qe);
var Se = function(e5) {
  var r4 = e5.slice, i4 = e5.axis, o3 = e5.debug, a3 = e5.tooltip, s2 = e5.isCurrent, l2 = e5.setCurrent, u = k(), d = u.showTooltipFromEvent, c = u.hideTooltip, f2 = (0, import_react3.useCallback)(function(e6) {
    d((0, import_react3.createElement)(a3, { slice: r4, axis: i4 }), e6, "right"), l2(r4);
  }, [d, a3, r4]), p3 = (0, import_react3.useCallback)(function(e6) {
    d((0, import_react3.createElement)(a3, { slice: r4, axis: i4 }), e6, "right");
  }, [d, a3, r4]), h2 = (0, import_react3.useCallback)(function() {
    c(), l2(null);
  }, [c]);
  return (0, import_jsx_runtime3.jsx)("rect", { x: r4.x0, y: r4.y0, width: r4.width, height: r4.height, stroke: "red", strokeWidth: o3 ? 1 : 0, strokeOpacity: 0.75, fill: "red", fillOpacity: s2 && o3 ? 0.35 : 0, onMouseEnter: f2, onMouseMove: p3, onMouseLeave: h2 });
};
Se.propTypes = { slice: import_prop_types2.default.object.isRequired, axis: import_prop_types2.default.oneOf(["x", "y"]).isRequired, debug: import_prop_types2.default.bool.isRequired, height: import_prop_types2.default.number.isRequired, tooltip: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object]), isCurrent: import_prop_types2.default.bool.isRequired, setCurrent: import_prop_types2.default.func.isRequired };
var Ce = (0, import_react3.memo)(Se);
var Te = function(e5) {
  var r4 = e5.slices, i4 = e5.axis, n5 = e5.debug, t5 = e5.height, o3 = e5.tooltip, a3 = e5.current, s2 = e5.setCurrent;
  return r4.map(function(e6) {
    return (0, import_jsx_runtime3.jsx)(Ce, { slice: e6, axis: i4, debug: n5, height: t5, tooltip: o3, setCurrent: s2, isCurrent: null !== a3 && a3.id === e6.id }, e6.id);
  });
};
Te.propTypes = { slices: import_prop_types2.default.arrayOf(import_prop_types2.default.shape({ id: import_prop_types2.default.oneOfType([import_prop_types2.default.number, import_prop_types2.default.string, import_prop_types2.default.instanceOf(Date)]).isRequired, x: import_prop_types2.default.number.isRequired, y: import_prop_types2.default.number.isRequired, points: import_prop_types2.default.arrayOf(import_prop_types2.default.object).isRequired })).isRequired, axis: import_prop_types2.default.oneOf(["x", "y"]).isRequired, debug: import_prop_types2.default.bool.isRequired, height: import_prop_types2.default.number.isRequired, tooltip: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object]).isRequired, current: import_prop_types2.default.object, setCurrent: import_prop_types2.default.func.isRequired };
var Me = (0, import_react3.memo)(Te);
var we = function(e5) {
  var r4 = e5.points, i4 = e5.symbol, n5 = e5.size, t5 = e5.borderWidth, o3 = e5.enableLabel, a3 = e5.label, s2 = e5.labelYOffset, l2 = Vt(), d = Ei(a3), c = r4.slice(0).reverse().map(function(e6) {
    return { id: e6.id, x: e6.x, y: e6.y, datum: e6.data, fill: e6.color, stroke: e6.borderColor, label: o3 ? d(e6.data) : null };
  });
  return (0, import_jsx_runtime3.jsx)("g", { children: c.map(function(e6) {
    return (0, import_jsx_runtime3.jsx)(Mi, { x: e6.x, y: e6.y, datum: e6.datum, symbol: i4, size: n5, color: e6.fill, borderWidth: t5, borderColor: e6.stroke, label: e6.label, labelYOffset: s2, theme: l2 }, e6.id);
  }) });
};
we.propTypes = { points: import_prop_types2.default.arrayOf(import_prop_types2.default.object), symbol: import_prop_types2.default.func, size: import_prop_types2.default.number.isRequired, color: import_prop_types2.default.func.isRequired, borderWidth: import_prop_types2.default.number.isRequired, borderColor: import_prop_types2.default.func.isRequired, enableLabel: import_prop_types2.default.bool.isRequired, label: import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.func]).isRequired, labelYOffset: import_prop_types2.default.number };
var Be = (0, import_react3.memo)(we);
var ke = function(e5) {
  var r4 = e5.points, i4 = e5.width, o3 = e5.height, a3 = e5.margin, s2 = e5.setCurrent, l2 = e5.onMouseEnter, u = e5.onMouseMove, d = e5.onMouseLeave, c = e5.onClick, f2 = e5.tooltip, p3 = e5.debug, h2 = k(), y2 = h2.showTooltipAt, b4 = h2.hideTooltip, g3 = (0, import_react3.useCallback)(function(e6, r5) {
    y2((0, import_react3.createElement)(f2, { point: e6 }), [e6.x + a3.left, e6.y + a3.top], "top"), s2(e6), l2 && l2(e6, r5);
  }, [s2, y2, f2, l2, a3]), m = (0, import_react3.useCallback)(function(e6, r5) {
    y2((0, import_react3.createElement)(f2, { point: e6 }), [e6.x + a3.left, e6.y + a3.top], "top"), s2(e6), u && u(e6, r5);
  }, [s2, y2, f2, u]), v3 = (0, import_react3.useCallback)(function(e6, r5) {
    b4(), s2(null), d && d(e6, r5);
  }, [b4, s2, d]), x2 = (0, import_react3.useCallback)(function(e6, r5) {
    c && c(e6, r5);
  }, [c]);
  return (0, import_jsx_runtime3.jsx)(P3, { nodes: r4, width: i4, height: o3, onMouseEnter: g3, onMouseMove: m, onMouseLeave: v3, onClick: x2, debug: p3 });
};
ke.propTypes = { points: import_prop_types2.default.arrayOf(import_prop_types2.default.object).isRequired, width: import_prop_types2.default.number.isRequired, height: import_prop_types2.default.number.isRequired, margin: import_prop_types2.default.object.isRequired, setCurrent: import_prop_types2.default.func.isRequired, onMouseEnter: import_prop_types2.default.func, onMouseMove: import_prop_types2.default.func, onMouseLeave: import_prop_types2.default.func, onClick: import_prop_types2.default.func, tooltip: import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.object]).isRequired, debug: import_prop_types2.default.bool.isRequired };
var We2 = (0, import_react3.memo)(ke);
var Ge = function(e5) {
  var r4 = e5.data, n5 = e5.xScale, t5 = e5.xFormat, a3 = e5.yScale, s2 = e5.yFormat, l2 = e5.layers, d = e5.curve, c = e5.areaBaselineValue, f2 = e5.colors, p3 = e5.margin, h2 = e5.width, y2 = e5.height, b4 = e5.axisTop, g3 = e5.axisRight, m = e5.axisBottom, v3 = e5.axisLeft, x2 = e5.enableGridX, C3 = e5.enableGridY, T3 = e5.gridXValues, M = e5.gridYValues, w3 = e5.lineWidth, B2 = e5.enableArea, W3 = e5.areaOpacity, P4 = e5.areaBlendMode, j = e5.enablePoints, F = e5.pointSymbol, E = e5.pointSize, Y3 = e5.pointColor, D = e5.pointBorderWidth, X4 = e5.pointBorderColor, z2 = e5.enablePointLabel, H2 = e5.pointLabel, I = e5.pointLabelYOffset, J2 = e5.defs, K3 = e5.fill, Q3 = e5.markers, U = e5.legends, Z = e5.isInteractive, $2 = e5.useMesh, _2 = e5.debugMesh, ee = e5.onMouseEnter, re = e5.onMouseMove, ne2 = e5.onMouseLeave, te2 = e5.onClick, oe2 = e5.tooltip, ae2 = e5.enableSlices, se2 = e5.debugSlices, le2 = e5.sliceTooltip, ue2 = e5.enableCrosshair, de2 = e5.crosshairType, ce2 = e5.role, fe2 = At(h2, y2, p3), pe2 = fe2.margin, he2 = fe2.innerWidth, ye2 = fe2.innerHeight, ge2 = fe2.outerWidth, me2 = fe2.outerHeight, xe2 = be({ data: r4, xScale: n5, xFormat: t5, yScale: a3, yFormat: s2, width: he2, height: ye2, colors: f2, curve: d, areaBaselineValue: c, pointColor: Y3, pointBorderColor: X4, enableSlices: ae2 }), Re2 = xe2.legendData, qe2 = xe2.toggleSerie, Se2 = xe2.lineGenerator, Ce2 = xe2.areaGenerator, Te2 = xe2.series, we2 = xe2.xScale, ke2 = xe2.yScale, Ge2 = xe2.slices, Le2 = xe2.points, Pe2 = Vt(), je2 = We(Y3, Pe2), Fe2 = We(X4, Pe2), Ve2 = (0, import_react3.useState)(null), Ee2 = Ve2[0], Ye = Ve2[1], De = (0, import_react3.useState)(null), Xe2 = De[0], ze = De[1], Ae = { grid: (0, import_jsx_runtime3.jsx)(B, { theme: Pe2, width: he2, height: ye2, xScale: x2 ? we2 : null, yScale: C3 ? ke2 : null, xValues: T3, yValues: M }, "grid"), markers: (0, import_jsx_runtime3.jsx)(Bi, { markers: Q3, width: he2, height: ye2, xScale: we2, yScale: ke2, theme: Pe2 }, "markers"), axes: (0, import_jsx_runtime3.jsx)(X3, { xScale: we2, yScale: ke2, width: he2, height: ye2, theme: Pe2, top: b4, right: g3, bottom: m, left: v3 }, "axes"), areas: null, lines: (0, import_jsx_runtime3.jsx)(Oe, { lines: Te2, lineGenerator: Se2, lineWidth: w3 }, "lines"), slices: null, points: null, crosshair: null, mesh: null, legends: U.map(function(e6, r5) {
    return (0, import_jsx_runtime3.jsx)(X, ie({}, e6, { containerWidth: he2, containerHeight: ye2, data: e6.data || Re2, theme: Pe2, toggleSerie: e6.toggleSerie ? qe2 : void 0 }), "legend." + r5);
  }) }, He = rn(J2, Te2, K3);
  return B2 && (Ae.areas = (0, import_jsx_runtime3.jsx)(ve, { areaGenerator: Ce2, areaOpacity: W3, areaBlendMode: P4, lines: Te2 }, "areas")), Z && false !== ae2 && (Ae.slices = (0, import_jsx_runtime3.jsx)(Me, { slices: Ge2, axis: ae2, debug: se2, height: ye2, tooltip: le2, current: Xe2, setCurrent: ze }, "slices")), j && (Ae.points = (0, import_jsx_runtime3.jsx)(Be, { points: Le2, symbol: F, size: E, color: je2, borderWidth: D, borderColor: Fe2, enableLabel: z2, label: H2, labelYOffset: I }, "points")), Z && ue2 && (null !== Ee2 && (Ae.crosshair = (0, import_jsx_runtime3.jsx)(P, { width: he2, height: ye2, x: Ee2.x, y: Ee2.y, type: de2 }, "crosshair")), null !== Xe2 && (Ae.crosshair = (0, import_jsx_runtime3.jsx)(P, { width: he2, height: ye2, x: Xe2.x, y: Xe2.y, type: ae2 }, "crosshair"))), Z && $2 && false === ae2 && (Ae.mesh = (0, import_jsx_runtime3.jsx)(We2, { points: Le2, width: he2, height: ye2, margin: pe2, current: Ee2, setCurrent: Ye, onMouseEnter: ee, onMouseMove: re, onMouseLeave: ne2, onClick: te2, tooltip: oe2, debug: _2 }, "mesh")), (0, import_jsx_runtime3.jsx)(Si, { defs: He, width: ge2, height: me2, margin: pe2, role: ce2, children: l2.map(function(r5, i4) {
    return "function" == typeof r5 ? (0, import_jsx_runtime3.jsx)(import_react3.Fragment, { children: r5(ie({}, e5, { innerWidth: he2, innerHeight: ye2, series: Te2, slices: Ge2, points: Le2, xScale: we2, yScale: ke2, lineGenerator: Se2, areaGenerator: Ce2, currentPoint: Ee2, setCurrentPoint: Ye, currentSlice: Xe2, setCurrentSlice: ze })) }, i4) : Ae[r5];
  }) });
};
Ge.propTypes = le, Ge.defaultProps = ce;
var Le = Fi(Ge);
var Pe = function(e5) {
  return (0, import_jsx_runtime3.jsx)(ti, { children: function(r4) {
    var i4 = r4.width, n5 = r4.height;
    return (0, import_jsx_runtime3.jsx)(Le, ie({ width: i4, height: n5 }, e5));
  } });
};
var je = function(e5) {
  var r4 = e5.width, o3 = e5.height, a3 = e5.margin, d = e5.pixelRatio, c = e5.data, f2 = e5.xScale, p3 = e5.xFormat, h2 = e5.yScale, y2 = e5.yFormat, b4 = e5.curve, g3 = e5.layers, m = e5.colors, v3 = e5.lineWidth, x2 = e5.enableArea, q = e5.areaBaselineValue, O3 = e5.areaOpacity, S3 = e5.enablePoints, C3 = e5.pointSize, w3 = e5.pointColor, B2 = e5.pointBorderWidth, k4 = e5.pointBorderColor, W3 = e5.enableGridX, G = e5.gridXValues, L2 = e5.enableGridY, F = e5.gridYValues, V2 = e5.axisTop, Y3 = e5.axisRight, D = e5.axisBottom, X4 = e5.axisLeft, A2 = e5.legends, H2 = e5.isInteractive, I = e5.debugMesh, J2 = e5.onMouseLeave, K3 = e5.onClick, Q3 = e5.tooltip, U = e5.canvasRef, Z = (0, import_react3.useRef)(null), $2 = At(r4, o3, a3), ne2 = $2.margin, te2 = $2.innerWidth, oe2 = $2.innerHeight, ae2 = $2.outerWidth, se2 = $2.outerHeight, le2 = Vt(), ue2 = (0, import_react3.useState)(null), de2 = ue2[0], ce2 = ue2[1], fe2 = be({ data: c, xScale: f2, xFormat: p3, yScale: h2, yFormat: y2, width: te2, height: oe2, colors: m, curve: b4, areaBaselineValue: q, pointColor: w3, pointBorderColor: k4 }), pe2 = fe2.lineGenerator, he2 = fe2.areaGenerator, ye2 = fe2.series, ge2 = fe2.xScale, me2 = fe2.yScale, ve2 = fe2.points, xe2 = x({ points: ve2, width: te2, height: oe2, debug: I }), Re2 = xe2.delaunay, qe2 = xe2.voronoi;
  (0, import_react3.useEffect)(function() {
    U && (U.current = Z.current), Z.current.width = ae2 * d, Z.current.height = se2 * d;
    var e6 = Z.current.getContext("2d");
    e6.scale(d, d), e6.fillStyle = le2.background, e6.fillRect(0, 0, ae2, se2), e6.translate(ne2.left, ne2.top), g3.forEach(function(r5) {
      if ("function" == typeof r5 && r5({ ctx: e6, innerWidth: te2, innerHeight: oe2, series: ye2, points: ve2, xScale: ge2, yScale: me2, lineWidth: v3, lineGenerator: pe2, areaGenerator: he2, currentPoint: de2, setCurrentPoint: ce2 }), "grid" === r5 && le2.grid.line.strokeWidth > 0 && (e6.lineWidth = le2.grid.line.strokeWidth, e6.strokeStyle = le2.grid.line.stroke, W3 && C2(e6, { width: te2, height: oe2, scale: ge2, axis: "x", values: G }), L2 && C2(e6, { width: te2, height: oe2, scale: me2, axis: "y", values: F })), "axes" === r5 && V(e6, { xScale: ge2, yScale: me2, width: te2, height: oe2, top: V2, right: Y3, bottom: D, left: X4, theme: le2 }), "areas" === r5 && true === x2 && (e6.save(), e6.globalAlpha = O3, he2.context(e6), ye2.forEach(function(r6) {
        e6.fillStyle = r6.color, e6.beginPath(), he2(r6.data.map(function(e7) {
          return e7.position;
        })), e6.fill();
      }), e6.restore()), "lines" === r5 && (pe2.context(e6), ye2.forEach(function(r6) {
        e6.strokeStyle = r6.color, e6.lineWidth = v3, e6.beginPath(), pe2(r6.data.map(function(e7) {
          return e7.position;
        })), e6.stroke();
      })), "points" === r5 && true === S3 && C3 > 0 && ve2.forEach(function(r6) {
        e6.fillStyle = r6.color, e6.beginPath(), e6.arc(r6.x, r6.y, C3 / 2, 0, 2 * Math.PI), e6.fill(), B2 > 0 && (e6.strokeStyle = r6.borderColor, e6.lineWidth = B2, e6.stroke());
      }), "mesh" === r5 && true === I && (O2(e6, qe2), de2 && S2(e6, qe2, de2.index)), "legends" === r5) {
        var i4 = ye2.map(function(e7) {
          return { id: e7.id, label: e7.id, color: e7.color };
        }).reverse();
        A2.forEach(function(r6) {
          H(e6, ie({}, r6, { data: r6.data || i4, containerWidth: te2, containerHeight: oe2, theme: le2 }));
        });
      }
    });
  }, [Z, ae2, se2, g3, le2, pe2, ye2, ge2, me2, W3, G, L2, F, V2, Y3, D, X4, A2, ve2, S3, C3, de2]);
  var Oe2 = (0, import_react3.useCallback)(function(e6) {
    var r5 = Qi(Z.current, e6), i4 = r5[0], n5 = r5[1];
    if (!Ji(ne2.left, ne2.top, te2, oe2, i4, n5))
      return null;
    var t5 = Re2.find(i4 - ne2.left, n5 - ne2.top);
    return ve2[t5];
  }, [Z, ne2, te2, oe2, Re2]), Se2 = k(), Ce2 = Se2.showTooltipFromEvent, Te2 = Se2.hideTooltip, Me2 = (0, import_react3.useCallback)(function(e6) {
    var r5 = Oe2(e6);
    ce2(r5), r5 ? Ce2((0, import_react3.createElement)(Q3, { point: r5 }), e6) : Te2();
  }, [Oe2, ce2, Ce2, Te2, Q3]), we2 = (0, import_react3.useCallback)(function(e6) {
    Te2(), ce2(null), de2 && J2 && J2(de2, e6);
  }, [Te2, ce2, J2]), Be2 = (0, import_react3.useCallback)(function(e6) {
    if (K3) {
      var r5 = Oe2(e6);
      r5 && K3(r5, e6);
    }
  }, [Oe2, K3]);
  return (0, import_jsx_runtime3.jsx)("canvas", { ref: Z, width: ae2 * d, height: se2 * d, style: { width: ae2, height: se2, cursor: H2 ? "auto" : "normal" }, onMouseEnter: H2 ? Me2 : void 0, onMouseMove: H2 ? Me2 : void 0, onMouseLeave: H2 ? we2 : void 0, onClick: H2 ? Be2 : void 0 });
};
je.propTypes = ue, je.defaultProps = fe;
var Fe = Fi(je);
var Ve = (0, import_react3.forwardRef)(function(e5, r4) {
  return (0, import_jsx_runtime3.jsx)(Fe, ie({}, e5, { canvasRef: r4 }));
});
var Ee = (0, import_react3.forwardRef)(function(e5, r4) {
  return (0, import_jsx_runtime3.jsx)(ti, { children: function(i4) {
    var n5 = i4.width, t5 = i4.height;
    return (0, import_jsx_runtime3.jsx)(Ve, ie({ width: n5, height: t5 }, e5, { ref: r4 }));
  } });
});

export {
  Pe
};
//# sourceMappingURL=/build/_shared/chunk-BPEDSDJA.js.map
