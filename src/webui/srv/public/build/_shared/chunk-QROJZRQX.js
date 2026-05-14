import {
  require_prop_types
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_jsx_runtime
} from "/build/_shared/chunk-ONA7UHQ4.js";
import {
  require_react_dom
} from "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/lodash/_listCacheClear.js
var require_listCacheClear = __commonJS({
  "../../node_modules/lodash/_listCacheClear.js"(exports, module) {
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    module.exports = listCacheClear;
  }
});

// ../../node_modules/lodash/eq.js
var require_eq = __commonJS({
  "../../node_modules/lodash/eq.js"(exports, module) {
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    module.exports = eq;
  }
});

// ../../node_modules/lodash/_assocIndexOf.js
var require_assocIndexOf = __commonJS({
  "../../node_modules/lodash/_assocIndexOf.js"(exports, module) {
    var eq = require_eq();
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    module.exports = assocIndexOf;
  }
});

// ../../node_modules/lodash/_listCacheDelete.js
var require_listCacheDelete = __commonJS({
  "../../node_modules/lodash/_listCacheDelete.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    var arrayProto = Array.prototype;
    var splice = arrayProto.splice;
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    module.exports = listCacheDelete;
  }
});

// ../../node_modules/lodash/_listCacheGet.js
var require_listCacheGet = __commonJS({
  "../../node_modules/lodash/_listCacheGet.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    module.exports = listCacheGet;
  }
});

// ../../node_modules/lodash/_listCacheHas.js
var require_listCacheHas = __commonJS({
  "../../node_modules/lodash/_listCacheHas.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    module.exports = listCacheHas;
  }
});

// ../../node_modules/lodash/_listCacheSet.js
var require_listCacheSet = __commonJS({
  "../../node_modules/lodash/_listCacheSet.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    module.exports = listCacheSet;
  }
});

// ../../node_modules/lodash/_ListCache.js
var require_ListCache = __commonJS({
  "../../node_modules/lodash/_ListCache.js"(exports, module) {
    var listCacheClear = require_listCacheClear();
    var listCacheDelete = require_listCacheDelete();
    var listCacheGet = require_listCacheGet();
    var listCacheHas = require_listCacheHas();
    var listCacheSet = require_listCacheSet();
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    module.exports = ListCache;
  }
});

// ../../node_modules/lodash/_stackClear.js
var require_stackClear = __commonJS({
  "../../node_modules/lodash/_stackClear.js"(exports, module) {
    var ListCache = require_ListCache();
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    module.exports = stackClear;
  }
});

// ../../node_modules/lodash/_stackDelete.js
var require_stackDelete = __commonJS({
  "../../node_modules/lodash/_stackDelete.js"(exports, module) {
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    module.exports = stackDelete;
  }
});

// ../../node_modules/lodash/_stackGet.js
var require_stackGet = __commonJS({
  "../../node_modules/lodash/_stackGet.js"(exports, module) {
    function stackGet(key) {
      return this.__data__.get(key);
    }
    module.exports = stackGet;
  }
});

// ../../node_modules/lodash/_stackHas.js
var require_stackHas = __commonJS({
  "../../node_modules/lodash/_stackHas.js"(exports, module) {
    function stackHas(key) {
      return this.__data__.has(key);
    }
    module.exports = stackHas;
  }
});

// ../../node_modules/lodash/_freeGlobal.js
var require_freeGlobal = __commonJS({
  "../../node_modules/lodash/_freeGlobal.js"(exports, module) {
    var freeGlobal = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis;
    module.exports = freeGlobal;
  }
});

// ../../node_modules/lodash/_root.js
var require_root = __commonJS({
  "../../node_modules/lodash/_root.js"(exports, module) {
    var freeGlobal = require_freeGlobal();
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    module.exports = root;
  }
});

// ../../node_modules/lodash/_Symbol.js
var require_Symbol = __commonJS({
  "../../node_modules/lodash/_Symbol.js"(exports, module) {
    var root = require_root();
    var Symbol2 = root.Symbol;
    module.exports = Symbol2;
  }
});

// ../../node_modules/lodash/_getRawTag.js
var require_getRawTag = __commonJS({
  "../../node_modules/lodash/_getRawTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e6) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    module.exports = getRawTag;
  }
});

// ../../node_modules/lodash/_objectToString.js
var require_objectToString = __commonJS({
  "../../node_modules/lodash/_objectToString.js"(exports, module) {
    var objectProto = Object.prototype;
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    module.exports = objectToString;
  }
});

// ../../node_modules/lodash/_baseGetTag.js
var require_baseGetTag = __commonJS({
  "../../node_modules/lodash/_baseGetTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var getRawTag = require_getRawTag();
    var objectToString = require_objectToString();
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    module.exports = baseGetTag;
  }
});

// ../../node_modules/lodash/isObject.js
var require_isObject = __commonJS({
  "../../node_modules/lodash/isObject.js"(exports, module) {
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isObject;
  }
});

// ../../node_modules/lodash/isFunction.js
var require_isFunction = __commonJS({
  "../../node_modules/lodash/isFunction.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObject = require_isObject();
    var asyncTag = "[object AsyncFunction]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var proxyTag = "[object Proxy]";
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    module.exports = isFunction;
  }
});

// ../../node_modules/lodash/_coreJsData.js
var require_coreJsData = __commonJS({
  "../../node_modules/lodash/_coreJsData.js"(exports, module) {
    var root = require_root();
    var coreJsData = root["__core-js_shared__"];
    module.exports = coreJsData;
  }
});

// ../../node_modules/lodash/_isMasked.js
var require_isMasked = __commonJS({
  "../../node_modules/lodash/_isMasked.js"(exports, module) {
    var coreJsData = require_coreJsData();
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    module.exports = isMasked;
  }
});

// ../../node_modules/lodash/_toSource.js
var require_toSource = __commonJS({
  "../../node_modules/lodash/_toSource.js"(exports, module) {
    var funcProto = Function.prototype;
    var funcToString = funcProto.toString;
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e6) {
        }
        try {
          return func + "";
        } catch (e6) {
        }
      }
      return "";
    }
    module.exports = toSource;
  }
});

// ../../node_modules/lodash/_baseIsNative.js
var require_baseIsNative = __commonJS({
  "../../node_modules/lodash/_baseIsNative.js"(exports, module) {
    var isFunction = require_isFunction();
    var isMasked = require_isMasked();
    var isObject = require_isObject();
    var toSource = require_toSource();
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    module.exports = baseIsNative;
  }
});

// ../../node_modules/lodash/_getValue.js
var require_getValue = __commonJS({
  "../../node_modules/lodash/_getValue.js"(exports, module) {
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    module.exports = getValue;
  }
});

// ../../node_modules/lodash/_getNative.js
var require_getNative = __commonJS({
  "../../node_modules/lodash/_getNative.js"(exports, module) {
    var baseIsNative = require_baseIsNative();
    var getValue = require_getValue();
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    module.exports = getNative;
  }
});

// ../../node_modules/lodash/_Map.js
var require_Map = __commonJS({
  "../../node_modules/lodash/_Map.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Map2 = getNative(root, "Map");
    module.exports = Map2;
  }
});

// ../../node_modules/lodash/_nativeCreate.js
var require_nativeCreate = __commonJS({
  "../../node_modules/lodash/_nativeCreate.js"(exports, module) {
    var getNative = require_getNative();
    var nativeCreate = getNative(Object, "create");
    module.exports = nativeCreate;
  }
});

// ../../node_modules/lodash/_hashClear.js
var require_hashClear = __commonJS({
  "../../node_modules/lodash/_hashClear.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    module.exports = hashClear;
  }
});

// ../../node_modules/lodash/_hashDelete.js
var require_hashDelete = __commonJS({
  "../../node_modules/lodash/_hashDelete.js"(exports, module) {
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    module.exports = hashDelete;
  }
});

// ../../node_modules/lodash/_hashGet.js
var require_hashGet = __commonJS({
  "../../node_modules/lodash/_hashGet.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    module.exports = hashGet;
  }
});

// ../../node_modules/lodash/_hashHas.js
var require_hashHas = __commonJS({
  "../../node_modules/lodash/_hashHas.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    module.exports = hashHas;
  }
});

// ../../node_modules/lodash/_hashSet.js
var require_hashSet = __commonJS({
  "../../node_modules/lodash/_hashSet.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    module.exports = hashSet;
  }
});

// ../../node_modules/lodash/_Hash.js
var require_Hash = __commonJS({
  "../../node_modules/lodash/_Hash.js"(exports, module) {
    var hashClear = require_hashClear();
    var hashDelete = require_hashDelete();
    var hashGet = require_hashGet();
    var hashHas = require_hashHas();
    var hashSet = require_hashSet();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    module.exports = Hash;
  }
});

// ../../node_modules/lodash/_mapCacheClear.js
var require_mapCacheClear = __commonJS({
  "../../node_modules/lodash/_mapCacheClear.js"(exports, module) {
    var Hash = require_Hash();
    var ListCache = require_ListCache();
    var Map2 = require_Map();
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    module.exports = mapCacheClear;
  }
});

// ../../node_modules/lodash/_isKeyable.js
var require_isKeyable = __commonJS({
  "../../node_modules/lodash/_isKeyable.js"(exports, module) {
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    module.exports = isKeyable;
  }
});

// ../../node_modules/lodash/_getMapData.js
var require_getMapData = __commonJS({
  "../../node_modules/lodash/_getMapData.js"(exports, module) {
    var isKeyable = require_isKeyable();
    function getMapData(map3, key) {
      var data = map3.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    module.exports = getMapData;
  }
});

// ../../node_modules/lodash/_mapCacheDelete.js
var require_mapCacheDelete = __commonJS({
  "../../node_modules/lodash/_mapCacheDelete.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    module.exports = mapCacheDelete;
  }
});

// ../../node_modules/lodash/_mapCacheGet.js
var require_mapCacheGet = __commonJS({
  "../../node_modules/lodash/_mapCacheGet.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    module.exports = mapCacheGet;
  }
});

// ../../node_modules/lodash/_mapCacheHas.js
var require_mapCacheHas = __commonJS({
  "../../node_modules/lodash/_mapCacheHas.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    module.exports = mapCacheHas;
  }
});

// ../../node_modules/lodash/_mapCacheSet.js
var require_mapCacheSet = __commonJS({
  "../../node_modules/lodash/_mapCacheSet.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    module.exports = mapCacheSet;
  }
});

// ../../node_modules/lodash/_MapCache.js
var require_MapCache = __commonJS({
  "../../node_modules/lodash/_MapCache.js"(exports, module) {
    var mapCacheClear = require_mapCacheClear();
    var mapCacheDelete = require_mapCacheDelete();
    var mapCacheGet = require_mapCacheGet();
    var mapCacheHas = require_mapCacheHas();
    var mapCacheSet = require_mapCacheSet();
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    module.exports = MapCache;
  }
});

// ../../node_modules/lodash/_stackSet.js
var require_stackSet = __commonJS({
  "../../node_modules/lodash/_stackSet.js"(exports, module) {
    var ListCache = require_ListCache();
    var Map2 = require_Map();
    var MapCache = require_MapCache();
    var LARGE_ARRAY_SIZE = 200;
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    module.exports = stackSet;
  }
});

// ../../node_modules/lodash/_Stack.js
var require_Stack = __commonJS({
  "../../node_modules/lodash/_Stack.js"(exports, module) {
    var ListCache = require_ListCache();
    var stackClear = require_stackClear();
    var stackDelete = require_stackDelete();
    var stackGet = require_stackGet();
    var stackHas = require_stackHas();
    var stackSet = require_stackSet();
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    module.exports = Stack;
  }
});

// ../../node_modules/lodash/_defineProperty.js
var require_defineProperty = __commonJS({
  "../../node_modules/lodash/_defineProperty.js"(exports, module) {
    var getNative = require_getNative();
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e6) {
      }
    }();
    module.exports = defineProperty;
  }
});

// ../../node_modules/lodash/_baseAssignValue.js
var require_baseAssignValue = __commonJS({
  "../../node_modules/lodash/_baseAssignValue.js"(exports, module) {
    var defineProperty = require_defineProperty();
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    module.exports = baseAssignValue;
  }
});

// ../../node_modules/lodash/_assignMergeValue.js
var require_assignMergeValue = __commonJS({
  "../../node_modules/lodash/_assignMergeValue.js"(exports, module) {
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module.exports = assignMergeValue;
  }
});

// ../../node_modules/lodash/_createBaseFor.js
var require_createBaseFor = __commonJS({
  "../../node_modules/lodash/_createBaseFor.js"(exports, module) {
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    module.exports = createBaseFor;
  }
});

// ../../node_modules/lodash/_baseFor.js
var require_baseFor = __commonJS({
  "../../node_modules/lodash/_baseFor.js"(exports, module) {
    var createBaseFor = require_createBaseFor();
    var baseFor = createBaseFor();
    module.exports = baseFor;
  }
});

// ../../node_modules/lodash/_cloneBuffer.js
var require_cloneBuffer = __commonJS({
  "../../node_modules/lodash/_cloneBuffer.js"(exports, module) {
    var root = require_root();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root.Buffer : void 0;
    var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    module.exports = cloneBuffer;
  }
});

// ../../node_modules/lodash/_Uint8Array.js
var require_Uint8Array = __commonJS({
  "../../node_modules/lodash/_Uint8Array.js"(exports, module) {
    var root = require_root();
    var Uint8Array = root.Uint8Array;
    module.exports = Uint8Array;
  }
});

// ../../node_modules/lodash/_cloneArrayBuffer.js
var require_cloneArrayBuffer = __commonJS({
  "../../node_modules/lodash/_cloneArrayBuffer.js"(exports, module) {
    var Uint8Array = require_Uint8Array();
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    module.exports = cloneArrayBuffer;
  }
});

// ../../node_modules/lodash/_cloneTypedArray.js
var require_cloneTypedArray = __commonJS({
  "../../node_modules/lodash/_cloneTypedArray.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    module.exports = cloneTypedArray;
  }
});

// ../../node_modules/lodash/_copyArray.js
var require_copyArray = __commonJS({
  "../../node_modules/lodash/_copyArray.js"(exports, module) {
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    module.exports = copyArray;
  }
});

// ../../node_modules/lodash/_baseCreate.js
var require_baseCreate = __commonJS({
  "../../node_modules/lodash/_baseCreate.js"(exports, module) {
    var isObject = require_isObject();
    var objectCreate = Object.create;
    var baseCreate = function() {
      function object() {
      }
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    module.exports = baseCreate;
  }
});

// ../../node_modules/lodash/_overArg.js
var require_overArg = __commonJS({
  "../../node_modules/lodash/_overArg.js"(exports, module) {
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    module.exports = overArg;
  }
});

// ../../node_modules/lodash/_getPrototype.js
var require_getPrototype = __commonJS({
  "../../node_modules/lodash/_getPrototype.js"(exports, module) {
    var overArg = require_overArg();
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    module.exports = getPrototype;
  }
});

// ../../node_modules/lodash/_isPrototype.js
var require_isPrototype = __commonJS({
  "../../node_modules/lodash/_isPrototype.js"(exports, module) {
    var objectProto = Object.prototype;
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    module.exports = isPrototype;
  }
});

// ../../node_modules/lodash/_initCloneObject.js
var require_initCloneObject = __commonJS({
  "../../node_modules/lodash/_initCloneObject.js"(exports, module) {
    var baseCreate = require_baseCreate();
    var getPrototype = require_getPrototype();
    var isPrototype = require_isPrototype();
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    module.exports = initCloneObject;
  }
});

// ../../node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS({
  "../../node_modules/lodash/isObjectLike.js"(exports, module) {
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    module.exports = isObjectLike;
  }
});

// ../../node_modules/lodash/_baseIsArguments.js
var require_baseIsArguments = __commonJS({
  "../../node_modules/lodash/_baseIsArguments.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    module.exports = baseIsArguments;
  }
});

// ../../node_modules/lodash/isArguments.js
var require_isArguments = __commonJS({
  "../../node_modules/lodash/isArguments.js"(exports, module) {
    var baseIsArguments = require_baseIsArguments();
    var isObjectLike = require_isObjectLike();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var isArguments = baseIsArguments(function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    module.exports = isArguments;
  }
});

// ../../node_modules/lodash/isArray.js
var require_isArray = __commonJS({
  "../../node_modules/lodash/isArray.js"(exports, module) {
    var isArray = Array.isArray;
    module.exports = isArray;
  }
});

// ../../node_modules/lodash/isLength.js
var require_isLength = __commonJS({
  "../../node_modules/lodash/isLength.js"(exports, module) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    module.exports = isLength;
  }
});

// ../../node_modules/lodash/isArrayLike.js
var require_isArrayLike = __commonJS({
  "../../node_modules/lodash/isArrayLike.js"(exports, module) {
    var isFunction = require_isFunction();
    var isLength = require_isLength();
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    module.exports = isArrayLike;
  }
});

// ../../node_modules/lodash/isArrayLikeObject.js
var require_isArrayLikeObject = __commonJS({
  "../../node_modules/lodash/isArrayLikeObject.js"(exports, module) {
    var isArrayLike = require_isArrayLike();
    var isObjectLike = require_isObjectLike();
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    module.exports = isArrayLikeObject;
  }
});

// ../../node_modules/lodash/stubFalse.js
var require_stubFalse = __commonJS({
  "../../node_modules/lodash/stubFalse.js"(exports, module) {
    function stubFalse() {
      return false;
    }
    module.exports = stubFalse;
  }
});

// ../../node_modules/lodash/isBuffer.js
var require_isBuffer = __commonJS({
  "../../node_modules/lodash/isBuffer.js"(exports, module) {
    var root = require_root();
    var stubFalse = require_stubFalse();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root.Buffer : void 0;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
    var isBuffer = nativeIsBuffer || stubFalse;
    module.exports = isBuffer;
  }
});

// ../../node_modules/lodash/isPlainObject.js
var require_isPlainObject = __commonJS({
  "../../node_modules/lodash/isPlainObject.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var getPrototype = require_getPrototype();
    var isObjectLike = require_isObjectLike();
    var objectTag = "[object Object]";
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module.exports = isPlainObject;
  }
});

// ../../node_modules/lodash/_baseIsTypedArray.js
var require_baseIsTypedArray = __commonJS({
  "../../node_modules/lodash/_baseIsTypedArray.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isLength = require_isLength();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    module.exports = baseIsTypedArray;
  }
});

// ../../node_modules/lodash/_baseUnary.js
var require_baseUnary = __commonJS({
  "../../node_modules/lodash/_baseUnary.js"(exports, module) {
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    module.exports = baseUnary;
  }
});

// ../../node_modules/lodash/_nodeUtil.js
var require_nodeUtil = __commonJS({
  "../../node_modules/lodash/_nodeUtil.js"(exports, module) {
    var freeGlobal = require_freeGlobal();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e6) {
      }
    }();
    module.exports = nodeUtil;
  }
});

// ../../node_modules/lodash/isTypedArray.js
var require_isTypedArray = __commonJS({
  "../../node_modules/lodash/isTypedArray.js"(exports, module) {
    var baseIsTypedArray = require_baseIsTypedArray();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    module.exports = isTypedArray;
  }
});

// ../../node_modules/lodash/_safeGet.js
var require_safeGet = __commonJS({
  "../../node_modules/lodash/_safeGet.js"(exports, module) {
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    module.exports = safeGet;
  }
});

// ../../node_modules/lodash/_assignValue.js
var require_assignValue = __commonJS({
  "../../node_modules/lodash/_assignValue.js"(exports, module) {
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module.exports = assignValue;
  }
});

// ../../node_modules/lodash/_copyObject.js
var require_copyObject = __commonJS({
  "../../node_modules/lodash/_copyObject.js"(exports, module) {
    var assignValue = require_assignValue();
    var baseAssignValue = require_baseAssignValue();
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    module.exports = copyObject;
  }
});

// ../../node_modules/lodash/_baseTimes.js
var require_baseTimes = __commonJS({
  "../../node_modules/lodash/_baseTimes.js"(exports, module) {
    function baseTimes(n3, iteratee) {
      var index = -1, result = Array(n3);
      while (++index < n3) {
        result[index] = iteratee(index);
      }
      return result;
    }
    module.exports = baseTimes;
  }
});

// ../../node_modules/lodash/_isIndex.js
var require_isIndex = __commonJS({
  "../../node_modules/lodash/_isIndex.js"(exports, module) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    module.exports = isIndex;
  }
});

// ../../node_modules/lodash/_arrayLikeKeys.js
var require_arrayLikeKeys = __commonJS({
  "../../node_modules/lodash/_arrayLikeKeys.js"(exports, module) {
    var baseTimes = require_baseTimes();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isIndex = require_isIndex();
    var isTypedArray = require_isTypedArray();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = arrayLikeKeys;
  }
});

// ../../node_modules/lodash/_nativeKeysIn.js
var require_nativeKeysIn = __commonJS({
  "../../node_modules/lodash/_nativeKeysIn.js"(exports, module) {
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = nativeKeysIn;
  }
});

// ../../node_modules/lodash/_baseKeysIn.js
var require_baseKeysIn = __commonJS({
  "../../node_modules/lodash/_baseKeysIn.js"(exports, module) {
    var isObject = require_isObject();
    var isPrototype = require_isPrototype();
    var nativeKeysIn = require_nativeKeysIn();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeysIn;
  }
});

// ../../node_modules/lodash/keysIn.js
var require_keysIn = __commonJS({
  "../../node_modules/lodash/keysIn.js"(exports, module) {
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeysIn = require_baseKeysIn();
    var isArrayLike = require_isArrayLike();
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    module.exports = keysIn;
  }
});

// ../../node_modules/lodash/toPlainObject.js
var require_toPlainObject = __commonJS({
  "../../node_modules/lodash/toPlainObject.js"(exports, module) {
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    module.exports = toPlainObject;
  }
});

// ../../node_modules/lodash/_baseMergeDeep.js
var require_baseMergeDeep = __commonJS({
  "../../node_modules/lodash/_baseMergeDeep.js"(exports, module) {
    var assignMergeValue = require_assignMergeValue();
    var cloneBuffer = require_cloneBuffer();
    var cloneTypedArray = require_cloneTypedArray();
    var copyArray = require_copyArray();
    var initCloneObject = require_initCloneObject();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isArrayLikeObject = require_isArrayLikeObject();
    var isBuffer = require_isBuffer();
    var isFunction = require_isFunction();
    var isObject = require_isObject();
    var isPlainObject = require_isPlainObject();
    var isTypedArray = require_isTypedArray();
    var safeGet = require_safeGet();
    var toPlainObject = require_toPlainObject();
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    module.exports = baseMergeDeep;
  }
});

// ../../node_modules/lodash/_baseMerge.js
var require_baseMerge = __commonJS({
  "../../node_modules/lodash/_baseMerge.js"(exports, module) {
    var Stack = require_Stack();
    var assignMergeValue = require_assignMergeValue();
    var baseFor = require_baseFor();
    var baseMergeDeep = require_baseMergeDeep();
    var isObject = require_isObject();
    var keysIn = require_keysIn();
    var safeGet = require_safeGet();
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    module.exports = baseMerge;
  }
});

// ../../node_modules/lodash/identity.js
var require_identity = __commonJS({
  "../../node_modules/lodash/identity.js"(exports, module) {
    function identity2(value) {
      return value;
    }
    module.exports = identity2;
  }
});

// ../../node_modules/lodash/_apply.js
var require_apply = __commonJS({
  "../../node_modules/lodash/_apply.js"(exports, module) {
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    module.exports = apply;
  }
});

// ../../node_modules/lodash/_overRest.js
var require_overRest = __commonJS({
  "../../node_modules/lodash/_overRest.js"(exports, module) {
    var apply = require_apply();
    var nativeMax = Math.max;
    function overRest(func, start2, transform) {
      start2 = nativeMax(start2 === void 0 ? func.length - 1 : start2, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start2, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start2 + index];
        }
        index = -1;
        var otherArgs = Array(start2 + 1);
        while (++index < start2) {
          otherArgs[index] = args[index];
        }
        otherArgs[start2] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    module.exports = overRest;
  }
});

// ../../node_modules/lodash/constant.js
var require_constant = __commonJS({
  "../../node_modules/lodash/constant.js"(exports, module) {
    function constant(value) {
      return function() {
        return value;
      };
    }
    module.exports = constant;
  }
});

// ../../node_modules/lodash/_baseSetToString.js
var require_baseSetToString = __commonJS({
  "../../node_modules/lodash/_baseSetToString.js"(exports, module) {
    var constant = require_constant();
    var defineProperty = require_defineProperty();
    var identity2 = require_identity();
    var baseSetToString = !defineProperty ? identity2 : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    module.exports = baseSetToString;
  }
});

// ../../node_modules/lodash/_shortOut.js
var require_shortOut = __commonJS({
  "../../node_modules/lodash/_shortOut.js"(exports, module) {
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var nativeNow = Date.now;
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    module.exports = shortOut;
  }
});

// ../../node_modules/lodash/_setToString.js
var require_setToString = __commonJS({
  "../../node_modules/lodash/_setToString.js"(exports, module) {
    var baseSetToString = require_baseSetToString();
    var shortOut = require_shortOut();
    var setToString = shortOut(baseSetToString);
    module.exports = setToString;
  }
});

// ../../node_modules/lodash/_baseRest.js
var require_baseRest = __commonJS({
  "../../node_modules/lodash/_baseRest.js"(exports, module) {
    var identity2 = require_identity();
    var overRest = require_overRest();
    var setToString = require_setToString();
    function baseRest(func, start2) {
      return setToString(overRest(func, start2, identity2), func + "");
    }
    module.exports = baseRest;
  }
});

// ../../node_modules/lodash/_isIterateeCall.js
var require_isIterateeCall = __commonJS({
  "../../node_modules/lodash/_isIterateeCall.js"(exports, module) {
    var eq = require_eq();
    var isArrayLike = require_isArrayLike();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    module.exports = isIterateeCall;
  }
});

// ../../node_modules/lodash/_createAssigner.js
var require_createAssigner = __commonJS({
  "../../node_modules/lodash/_createAssigner.js"(exports, module) {
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    module.exports = createAssigner;
  }
});

// ../../node_modules/lodash/merge.js
var require_merge = __commonJS({
  "../../node_modules/lodash/merge.js"(exports, module) {
    var baseMerge = require_baseMerge();
    var createAssigner = require_createAssigner();
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    module.exports = merge;
  }
});

// ../../node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "../../node_modules/lodash/isSymbol.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module.exports = isSymbol;
  }
});

// ../../node_modules/lodash/_isKey.js
var require_isKey = __commonJS({
  "../../node_modules/lodash/_isKey.js"(exports, module) {
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    module.exports = isKey;
  }
});

// ../../node_modules/lodash/memoize.js
var require_memoize = __commonJS({
  "../../node_modules/lodash/memoize.js"(exports, module) {
    var MapCache = require_MapCache();
    var FUNC_ERROR_TEXT = "Expected a function";
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver != null && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    module.exports = memoize;
  }
});

// ../../node_modules/lodash/_memoizeCapped.js
var require_memoizeCapped = __commonJS({
  "../../node_modules/lodash/_memoizeCapped.js"(exports, module) {
    var memoize = require_memoize();
    var MAX_MEMOIZE_SIZE = 500;
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });
      var cache = result.cache;
      return result;
    }
    module.exports = memoizeCapped;
  }
});

// ../../node_modules/lodash/_stringToPath.js
var require_stringToPath = __commonJS({
  "../../node_modules/lodash/_stringToPath.js"(exports, module) {
    var memoizeCapped = require_memoizeCapped();
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46) {
        result.push("");
      }
      string.replace(rePropName, function(match, number3, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, "$1") : number3 || match);
      });
      return result;
    });
    module.exports = stringToPath;
  }
});

// ../../node_modules/lodash/_arrayMap.js
var require_arrayMap = __commonJS({
  "../../node_modules/lodash/_arrayMap.js"(exports, module) {
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    module.exports = arrayMap;
  }
});

// ../../node_modules/lodash/_baseToString.js
var require_baseToString = __commonJS({
  "../../node_modules/lodash/_baseToString.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var arrayMap = require_arrayMap();
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isArray(value)) {
        return arrayMap(value, baseToString) + "";
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module.exports = baseToString;
  }
});

// ../../node_modules/lodash/toString.js
var require_toString = __commonJS({
  "../../node_modules/lodash/toString.js"(exports, module) {
    var baseToString = require_baseToString();
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    module.exports = toString;
  }
});

// ../../node_modules/lodash/_castPath.js
var require_castPath = __commonJS({
  "../../node_modules/lodash/_castPath.js"(exports, module) {
    var isArray = require_isArray();
    var isKey = require_isKey();
    var stringToPath = require_stringToPath();
    var toString = require_toString();
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }
    module.exports = castPath;
  }
});

// ../../node_modules/lodash/_toKey.js
var require_toKey = __commonJS({
  "../../node_modules/lodash/_toKey.js"(exports, module) {
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module.exports = toKey;
  }
});

// ../../node_modules/lodash/_baseGet.js
var require_baseGet = __commonJS({
  "../../node_modules/lodash/_baseGet.js"(exports, module) {
    var castPath = require_castPath();
    var toKey = require_toKey();
    function baseGet(object, path2) {
      path2 = castPath(path2, object);
      var index = 0, length = path2.length;
      while (object != null && index < length) {
        object = object[toKey(path2[index++])];
      }
      return index && index == length ? object : void 0;
    }
    module.exports = baseGet;
  }
});

// ../../node_modules/lodash/get.js
var require_get = __commonJS({
  "../../node_modules/lodash/get.js"(exports, module) {
    var baseGet = require_baseGet();
    function get(object, path2, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path2);
      return result === void 0 ? defaultValue : result;
    }
    module.exports = get;
  }
});

// ../../node_modules/lodash/_baseSet.js
var require_baseSet = __commonJS({
  "../../node_modules/lodash/_baseSet.js"(exports, module) {
    var assignValue = require_assignValue();
    var castPath = require_castPath();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    var toKey = require_toKey();
    function baseSet(object, path2, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path2 = castPath(path2, object);
      var index = -1, length = path2.length, lastIndex = length - 1, nested = object;
      while (nested != null && ++index < length) {
        var key = toKey(path2[index]), newValue = value;
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          return object;
        }
        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : void 0;
          if (newValue === void 0) {
            newValue = isObject(objValue) ? objValue : isIndex(path2[index + 1]) ? [] : {};
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }
    module.exports = baseSet;
  }
});

// ../../node_modules/lodash/set.js
var require_set = __commonJS({
  "../../node_modules/lodash/set.js"(exports, module) {
    var baseSet = require_baseSet();
    function set(object, path2, value) {
      return object == null ? object : baseSet(object, path2, value);
    }
    module.exports = set;
  }
});

// ../../node_modules/lodash/isString.js
var require_isString = __commonJS({
  "../../node_modules/lodash/isString.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isArray = require_isArray();
    var isObjectLike = require_isObjectLike();
    var stringTag = "[object String]";
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
    }
    module.exports = isString;
  }
});

// ../../node_modules/lodash/last.js
var require_last = __commonJS({
  "../../node_modules/lodash/last.js"(exports, module) {
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : void 0;
    }
    module.exports = last;
  }
});

// ../../node_modules/lodash/_setCacheAdd.js
var require_setCacheAdd = __commonJS({
  "../../node_modules/lodash/_setCacheAdd.js"(exports, module) {
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    module.exports = setCacheAdd;
  }
});

// ../../node_modules/lodash/_setCacheHas.js
var require_setCacheHas = __commonJS({
  "../../node_modules/lodash/_setCacheHas.js"(exports, module) {
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    module.exports = setCacheHas;
  }
});

// ../../node_modules/lodash/_SetCache.js
var require_SetCache = __commonJS({
  "../../node_modules/lodash/_SetCache.js"(exports, module) {
    var MapCache = require_MapCache();
    var setCacheAdd = require_setCacheAdd();
    var setCacheHas = require_setCacheHas();
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    module.exports = SetCache;
  }
});

// ../../node_modules/lodash/_baseFindIndex.js
var require_baseFindIndex = __commonJS({
  "../../node_modules/lodash/_baseFindIndex.js"(exports, module) {
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    module.exports = baseFindIndex;
  }
});

// ../../node_modules/lodash/_baseIsNaN.js
var require_baseIsNaN = __commonJS({
  "../../node_modules/lodash/_baseIsNaN.js"(exports, module) {
    function baseIsNaN(value) {
      return value !== value;
    }
    module.exports = baseIsNaN;
  }
});

// ../../node_modules/lodash/_strictIndexOf.js
var require_strictIndexOf = __commonJS({
  "../../node_modules/lodash/_strictIndexOf.js"(exports, module) {
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    module.exports = strictIndexOf;
  }
});

// ../../node_modules/lodash/_baseIndexOf.js
var require_baseIndexOf = __commonJS({
  "../../node_modules/lodash/_baseIndexOf.js"(exports, module) {
    var baseFindIndex = require_baseFindIndex();
    var baseIsNaN = require_baseIsNaN();
    var strictIndexOf = require_strictIndexOf();
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    module.exports = baseIndexOf;
  }
});

// ../../node_modules/lodash/_arrayIncludes.js
var require_arrayIncludes = __commonJS({
  "../../node_modules/lodash/_arrayIncludes.js"(exports, module) {
    var baseIndexOf = require_baseIndexOf();
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    module.exports = arrayIncludes;
  }
});

// ../../node_modules/lodash/_arrayIncludesWith.js
var require_arrayIncludesWith = __commonJS({
  "../../node_modules/lodash/_arrayIncludesWith.js"(exports, module) {
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    module.exports = arrayIncludesWith;
  }
});

// ../../node_modules/lodash/_cacheHas.js
var require_cacheHas = __commonJS({
  "../../node_modules/lodash/_cacheHas.js"(exports, module) {
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    module.exports = cacheHas;
  }
});

// ../../node_modules/lodash/_baseDifference.js
var require_baseDifference = __commonJS({
  "../../node_modules/lodash/_baseDifference.js"(exports, module) {
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var arrayMap = require_arrayMap();
    var baseUnary = require_baseUnary();
    var cacheHas = require_cacheHas();
    var LARGE_ARRAY_SIZE = 200;
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      } else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee == null ? value : iteratee(value);
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
      return result;
    }
    module.exports = baseDifference;
  }
});

// ../../node_modules/lodash/without.js
var require_without = __commonJS({
  "../../node_modules/lodash/without.js"(exports, module) {
    var baseDifference = require_baseDifference();
    var baseRest = require_baseRest();
    var isArrayLikeObject = require_isArrayLikeObject();
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array) ? baseDifference(array, values) : [];
    });
    module.exports = without;
  }
});

// ../../node_modules/lodash/_arraySome.js
var require_arraySome = __commonJS({
  "../../node_modules/lodash/_arraySome.js"(exports, module) {
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    module.exports = arraySome;
  }
});

// ../../node_modules/lodash/_equalArrays.js
var require_equalArrays = __commonJS({
  "../../node_modules/lodash/_equalArrays.js"(exports, module) {
    var SetCache = require_SetCache();
    var arraySome = require_arraySome();
    var cacheHas = require_cacheHas();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    module.exports = equalArrays;
  }
});

// ../../node_modules/lodash/_mapToArray.js
var require_mapToArray = __commonJS({
  "../../node_modules/lodash/_mapToArray.js"(exports, module) {
    function mapToArray(map3) {
      var index = -1, result = Array(map3.size);
      map3.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    module.exports = mapToArray;
  }
});

// ../../node_modules/lodash/_setToArray.js
var require_setToArray = __commonJS({
  "../../node_modules/lodash/_setToArray.js"(exports, module) {
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    module.exports = setToArray;
  }
});

// ../../node_modules/lodash/_equalByTag.js
var require_equalByTag = __commonJS({
  "../../node_modules/lodash/_equalByTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var Uint8Array = require_Uint8Array();
    var eq = require_eq();
    var equalArrays = require_equalArrays();
    var mapToArray = require_mapToArray();
    var setToArray = require_setToArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    module.exports = equalByTag;
  }
});

// ../../node_modules/lodash/_arrayPush.js
var require_arrayPush = __commonJS({
  "../../node_modules/lodash/_arrayPush.js"(exports, module) {
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    module.exports = arrayPush;
  }
});

// ../../node_modules/lodash/_baseGetAllKeys.js
var require_baseGetAllKeys = __commonJS({
  "../../node_modules/lodash/_baseGetAllKeys.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var isArray = require_isArray();
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    module.exports = baseGetAllKeys;
  }
});

// ../../node_modules/lodash/_arrayFilter.js
var require_arrayFilter = __commonJS({
  "../../node_modules/lodash/_arrayFilter.js"(exports, module) {
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    module.exports = arrayFilter;
  }
});

// ../../node_modules/lodash/stubArray.js
var require_stubArray = __commonJS({
  "../../node_modules/lodash/stubArray.js"(exports, module) {
    function stubArray() {
      return [];
    }
    module.exports = stubArray;
  }
});

// ../../node_modules/lodash/_getSymbols.js
var require_getSymbols = __commonJS({
  "../../node_modules/lodash/_getSymbols.js"(exports, module) {
    var arrayFilter = require_arrayFilter();
    var stubArray = require_stubArray();
    var objectProto = Object.prototype;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    module.exports = getSymbols;
  }
});

// ../../node_modules/lodash/_nativeKeys.js
var require_nativeKeys = __commonJS({
  "../../node_modules/lodash/_nativeKeys.js"(exports, module) {
    var overArg = require_overArg();
    var nativeKeys = overArg(Object.keys, Object);
    module.exports = nativeKeys;
  }
});

// ../../node_modules/lodash/_baseKeys.js
var require_baseKeys = __commonJS({
  "../../node_modules/lodash/_baseKeys.js"(exports, module) {
    var isPrototype = require_isPrototype();
    var nativeKeys = require_nativeKeys();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeys;
  }
});

// ../../node_modules/lodash/keys.js
var require_keys = __commonJS({
  "../../node_modules/lodash/keys.js"(exports, module) {
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeys = require_baseKeys();
    var isArrayLike = require_isArrayLike();
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    module.exports = keys;
  }
});

// ../../node_modules/lodash/_getAllKeys.js
var require_getAllKeys = __commonJS({
  "../../node_modules/lodash/_getAllKeys.js"(exports, module) {
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbols = require_getSymbols();
    var keys = require_keys();
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    module.exports = getAllKeys;
  }
});

// ../../node_modules/lodash/_equalObjects.js
var require_equalObjects = __commonJS({
  "../../node_modules/lodash/_equalObjects.js"(exports, module) {
    var getAllKeys = require_getAllKeys();
    var COMPARE_PARTIAL_FLAG = 1;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    module.exports = equalObjects;
  }
});

// ../../node_modules/lodash/_DataView.js
var require_DataView = __commonJS({
  "../../node_modules/lodash/_DataView.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var DataView2 = getNative(root, "DataView");
    module.exports = DataView2;
  }
});

// ../../node_modules/lodash/_Promise.js
var require_Promise = __commonJS({
  "../../node_modules/lodash/_Promise.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Promise2 = getNative(root, "Promise");
    module.exports = Promise2;
  }
});

// ../../node_modules/lodash/_Set.js
var require_Set = __commonJS({
  "../../node_modules/lodash/_Set.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Set2 = getNative(root, "Set");
    module.exports = Set2;
  }
});

// ../../node_modules/lodash/_WeakMap.js
var require_WeakMap = __commonJS({
  "../../node_modules/lodash/_WeakMap.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var WeakMap = getNative(root, "WeakMap");
    module.exports = WeakMap;
  }
});

// ../../node_modules/lodash/_getTag.js
var require_getTag = __commonJS({
  "../../node_modules/lodash/_getTag.js"(exports, module) {
    var DataView2 = require_DataView();
    var Map2 = require_Map();
    var Promise2 = require_Promise();
    var Set2 = require_Set();
    var WeakMap = require_WeakMap();
    var baseGetTag = require_baseGetTag();
    var toSource = require_toSource();
    var mapTag = "[object Map]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var setTag = "[object Set]";
    var weakMapTag = "[object WeakMap]";
    var dataViewTag = "[object DataView]";
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    module.exports = getTag;
  }
});

// ../../node_modules/lodash/_baseIsEqualDeep.js
var require_baseIsEqualDeep = __commonJS({
  "../../node_modules/lodash/_baseIsEqualDeep.js"(exports, module) {
    var Stack = require_Stack();
    var equalArrays = require_equalArrays();
    var equalByTag = require_equalByTag();
    var equalObjects = require_equalObjects();
    var getTag = require_getTag();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isTypedArray = require_isTypedArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    module.exports = baseIsEqualDeep;
  }
});

// ../../node_modules/lodash/_baseIsEqual.js
var require_baseIsEqual = __commonJS({
  "../../node_modules/lodash/_baseIsEqual.js"(exports, module) {
    var baseIsEqualDeep = require_baseIsEqualDeep();
    var isObjectLike = require_isObjectLike();
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    module.exports = baseIsEqual;
  }
});

// ../../node_modules/lodash/isEqual.js
var require_isEqual = __commonJS({
  "../../node_modules/lodash/isEqual.js"(exports, module) {
    var baseIsEqual = require_baseIsEqual();
    function isEqual2(value, other) {
      return baseIsEqual(value, other);
    }
    module.exports = isEqual2;
  }
});

// ../../node_modules/lodash/_basePickBy.js
var require_basePickBy = __commonJS({
  "../../node_modules/lodash/_basePickBy.js"(exports, module) {
    var baseGet = require_baseGet();
    var baseSet = require_baseSet();
    var castPath = require_castPath();
    function basePickBy(object, paths, predicate) {
      var index = -1, length = paths.length, result = {};
      while (++index < length) {
        var path2 = paths[index], value = baseGet(object, path2);
        if (predicate(value, path2)) {
          baseSet(result, castPath(path2, object), value);
        }
      }
      return result;
    }
    module.exports = basePickBy;
  }
});

// ../../node_modules/lodash/_baseHasIn.js
var require_baseHasIn = __commonJS({
  "../../node_modules/lodash/_baseHasIn.js"(exports, module) {
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    module.exports = baseHasIn;
  }
});

// ../../node_modules/lodash/_hasPath.js
var require_hasPath = __commonJS({
  "../../node_modules/lodash/_hasPath.js"(exports, module) {
    var castPath = require_castPath();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isIndex = require_isIndex();
    var isLength = require_isLength();
    var toKey = require_toKey();
    function hasPath(object, path2, hasFunc) {
      path2 = castPath(path2, object);
      var index = -1, length = path2.length, result = false;
      while (++index < length) {
        var key = toKey(path2[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    module.exports = hasPath;
  }
});

// ../../node_modules/lodash/hasIn.js
var require_hasIn = __commonJS({
  "../../node_modules/lodash/hasIn.js"(exports, module) {
    var baseHasIn = require_baseHasIn();
    var hasPath = require_hasPath();
    function hasIn(object, path2) {
      return object != null && hasPath(object, path2, baseHasIn);
    }
    module.exports = hasIn;
  }
});

// ../../node_modules/lodash/_basePick.js
var require_basePick = __commonJS({
  "../../node_modules/lodash/_basePick.js"(exports, module) {
    var basePickBy = require_basePickBy();
    var hasIn = require_hasIn();
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path2) {
        return hasIn(object, path2);
      });
    }
    module.exports = basePick;
  }
});

// ../../node_modules/lodash/_isFlattenable.js
var require_isFlattenable = __commonJS({
  "../../node_modules/lodash/_isFlattenable.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    module.exports = isFlattenable;
  }
});

// ../../node_modules/lodash/_baseFlatten.js
var require_baseFlatten = __commonJS({
  "../../node_modules/lodash/_baseFlatten.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var isFlattenable = require_isFlattenable();
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    module.exports = baseFlatten;
  }
});

// ../../node_modules/lodash/flatten.js
var require_flatten = __commonJS({
  "../../node_modules/lodash/flatten.js"(exports, module) {
    var baseFlatten = require_baseFlatten();
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }
    module.exports = flatten;
  }
});

// ../../node_modules/lodash/_flatRest.js
var require_flatRest = __commonJS({
  "../../node_modules/lodash/_flatRest.js"(exports, module) {
    var flatten = require_flatten();
    var overRest = require_overRest();
    var setToString = require_setToString();
    function flatRest(func) {
      return setToString(overRest(func, void 0, flatten), func + "");
    }
    module.exports = flatRest;
  }
});

// ../../node_modules/lodash/pick.js
var require_pick = __commonJS({
  "../../node_modules/lodash/pick.js"(exports, module) {
    var basePick = require_basePick();
    var flatRest = require_flatRest();
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });
    module.exports = pick;
  }
});

// ../../node_modules/lodash/_baseIsDate.js
var require_baseIsDate = __commonJS({
  "../../node_modules/lodash/_baseIsDate.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var dateTag = "[object Date]";
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }
    module.exports = baseIsDate;
  }
});

// ../../node_modules/lodash/isDate.js
var require_isDate = __commonJS({
  "../../node_modules/lodash/isDate.js"(exports, module) {
    var baseIsDate = require_baseIsDate();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsDate = nodeUtil && nodeUtil.isDate;
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
    module.exports = isDate;
  }
});

// ../../node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js
var updateQueue = makeQueue();
var raf = (fn) => schedule(fn, updateQueue);
var writeQueue = makeQueue();
raf.write = (fn) => schedule(fn, writeQueue);
var onStartQueue = makeQueue();
raf.onStart = (fn) => schedule(fn, onStartQueue);
var onFrameQueue = makeQueue();
raf.onFrame = (fn) => schedule(fn, onFrameQueue);
var onFinishQueue = makeQueue();
raf.onFinish = (fn) => schedule(fn, onFinishQueue);
var timeouts = [];
raf.setTimeout = (handler, ms) => {
  let time2 = raf.now() + ms;
  let cancel = () => {
    let i3 = timeouts.findIndex((t5) => t5.cancel == cancel);
    if (~i3)
      timeouts.splice(i3, 1);
    pendingCount -= ~i3 ? 1 : 0;
  };
  let timeout = {
    time: time2,
    handler,
    cancel
  };
  timeouts.splice(findTimeout(time2), 0, timeout);
  pendingCount += 1;
  start();
  return timeout;
};
var findTimeout = (time2) => ~(~timeouts.findIndex((t5) => t5.time > time2) || ~timeouts.length);
raf.cancel = (fn) => {
  onStartQueue.delete(fn);
  onFrameQueue.delete(fn);
  updateQueue.delete(fn);
  writeQueue.delete(fn);
  onFinishQueue.delete(fn);
};
raf.sync = (fn) => {
  sync = true;
  raf.batchedUpdates(fn);
  sync = false;
};
raf.throttle = (fn) => {
  let lastArgs;
  function queuedFn() {
    try {
      fn(...lastArgs);
    } finally {
      lastArgs = null;
    }
  }
  function throttled(...args) {
    lastArgs = args;
    raf.onStart(queuedFn);
  }
  throttled.handler = fn;
  throttled.cancel = () => {
    onStartQueue.delete(queuedFn);
    lastArgs = null;
  };
  return throttled;
};
var nativeRaf = typeof window != "undefined" ? window.requestAnimationFrame : () => {
};
raf.use = (impl) => nativeRaf = impl;
raf.now = typeof performance != "undefined" ? () => performance.now() : Date.now;
raf.batchedUpdates = (fn) => fn();
raf.catch = console.error;
raf.frameLoop = "always";
raf.advance = () => {
  if (raf.frameLoop !== "demand") {
    console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand");
  } else {
    update();
  }
};
var ts = -1;
var pendingCount = 0;
var sync = false;
function schedule(fn, queue) {
  if (sync) {
    queue.delete(fn);
    fn(0);
  } else {
    queue.add(fn);
    start();
  }
}
function start() {
  if (ts < 0) {
    ts = 0;
    if (raf.frameLoop !== "demand") {
      nativeRaf(loop);
    }
  }
}
function stop() {
  ts = -1;
}
function loop() {
  if (~ts) {
    nativeRaf(loop);
    raf.batchedUpdates(update);
  }
}
function update() {
  let prevTs = ts;
  ts = raf.now();
  let count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t5) => t5.handler());
    pendingCount -= count;
  }
  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
  if (!pendingCount) {
    stop();
  }
}
function makeQueue() {
  let next = /* @__PURE__ */ new Set();
  let current = next;
  return {
    add(fn) {
      pendingCount += current == next && !next.has(fn) ? 1 : 0;
      next.add(fn);
    },
    delete(fn) {
      pendingCount -= current == next && next.has(fn) ? 1 : 0;
      return next.delete(fn);
    },
    flush(arg) {
      if (current.size) {
        next = /* @__PURE__ */ new Set();
        pendingCount -= current.size;
        eachSafely(current, (fn) => fn(arg) && next.add(fn));
        pendingCount += next.size;
        current = next;
      }
    }
  };
}
function eachSafely(values, each2) {
  values.forEach((value) => {
    try {
      each2(value);
    } catch (e6) {
      raf.catch(e6);
    }
  });
}

// ../../node_modules/@react-spring/shared/dist/react-spring-shared.esm.js
var React = __toESM(require_react());
var import_react = __toESM(require_react());
function noop() {
}
var defineHidden = (obj, key, value) => Object.defineProperty(obj, key, {
  value,
  writable: true,
  configurable: true
});
var is = {
  arr: Array.isArray,
  obj: (a3) => !!a3 && a3.constructor.name === "Object",
  fun: (a3) => typeof a3 === "function",
  str: (a3) => typeof a3 === "string",
  num: (a3) => typeof a3 === "number",
  und: (a3) => a3 === void 0
};
function isEqual(a3, b4) {
  if (is.arr(a3)) {
    if (!is.arr(b4) || a3.length !== b4.length)
      return false;
    for (let i3 = 0; i3 < a3.length; i3++) {
      if (a3[i3] !== b4[i3])
        return false;
    }
    return true;
  }
  return a3 === b4;
}
var each = (obj, fn) => obj.forEach(fn);
function eachProp(obj, fn, ctx2) {
  if (is.arr(obj)) {
    for (let i3 = 0; i3 < obj.length; i3++) {
      fn.call(ctx2, obj[i3], `${i3}`);
    }
    return;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn.call(ctx2, obj[key], key);
    }
  }
}
var toArray = (a3) => is.und(a3) ? [] : is.arr(a3) ? a3 : [a3];
function flush(queue, iterator) {
  if (queue.size) {
    const items = Array.from(queue);
    queue.clear();
    each(items, iterator);
  }
}
var flushCalls = (queue, ...args) => flush(queue, (fn) => fn(...args));
var isSSR = () => typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
var createStringInterpolator$1;
var to;
var colors$1 = null;
var skipAnimation = false;
var willAdvance = noop;
var assign = (globals2) => {
  if (globals2.to)
    to = globals2.to;
  if (globals2.now)
    raf.now = globals2.now;
  if (globals2.colors !== void 0)
    colors$1 = globals2.colors;
  if (globals2.skipAnimation != null)
    skipAnimation = globals2.skipAnimation;
  if (globals2.createStringInterpolator)
    createStringInterpolator$1 = globals2.createStringInterpolator;
  if (globals2.requestAnimationFrame)
    raf.use(globals2.requestAnimationFrame);
  if (globals2.batchedUpdates)
    raf.batchedUpdates = globals2.batchedUpdates;
  if (globals2.willAdvance)
    willAdvance = globals2.willAdvance;
  if (globals2.frameLoop)
    raf.frameLoop = globals2.frameLoop;
};
var globals = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  get createStringInterpolator() {
    return createStringInterpolator$1;
  },
  get to() {
    return to;
  },
  get colors() {
    return colors$1;
  },
  get skipAnimation() {
    return skipAnimation;
  },
  get willAdvance() {
    return willAdvance;
  },
  assign
});
var startQueue = /* @__PURE__ */ new Set();
var currentFrame = [];
var prevFrame = [];
var priority = 0;
var frameLoop = {
  get idle() {
    return !startQueue.size && !currentFrame.length;
  },
  start(animation) {
    if (priority > animation.priority) {
      startQueue.add(animation);
      raf.onStart(flushStartQueue);
    } else {
      startSafely(animation);
      raf(advance);
    }
  },
  advance,
  sort(animation) {
    if (priority) {
      raf.onFrame(() => frameLoop.sort(animation));
    } else {
      const prevIndex = currentFrame.indexOf(animation);
      if (~prevIndex) {
        currentFrame.splice(prevIndex, 1);
        startUnsafely(animation);
      }
    }
  },
  clear() {
    currentFrame = [];
    startQueue.clear();
  }
};
function flushStartQueue() {
  startQueue.forEach(startSafely);
  startQueue.clear();
  raf(advance);
}
function startSafely(animation) {
  if (!currentFrame.includes(animation))
    startUnsafely(animation);
}
function startUnsafely(animation) {
  currentFrame.splice(findIndex(currentFrame, (other) => other.priority > animation.priority), 0, animation);
}
function advance(dt) {
  const nextFrame = prevFrame;
  for (let i3 = 0; i3 < currentFrame.length; i3++) {
    const animation = currentFrame[i3];
    priority = animation.priority;
    if (!animation.idle) {
      willAdvance(animation);
      animation.advance(dt);
      if (!animation.idle) {
        nextFrame.push(animation);
      }
    }
  }
  priority = 0;
  prevFrame = currentFrame;
  prevFrame.length = 0;
  currentFrame = nextFrame;
  return currentFrame.length > 0;
}
function findIndex(arr, test) {
  const index = arr.findIndex(test);
  return index < 0 ? arr.length : index;
}
var colors = {
  transparent: 0,
  aliceblue: 4042850303,
  antiquewhite: 4209760255,
  aqua: 16777215,
  aquamarine: 2147472639,
  azure: 4043309055,
  beige: 4126530815,
  bisque: 4293182719,
  black: 255,
  blanchedalmond: 4293643775,
  blue: 65535,
  blueviolet: 2318131967,
  brown: 2771004159,
  burlywood: 3736635391,
  burntsienna: 3934150143,
  cadetblue: 1604231423,
  chartreuse: 2147418367,
  chocolate: 3530104575,
  coral: 4286533887,
  cornflowerblue: 1687547391,
  cornsilk: 4294499583,
  crimson: 3692313855,
  cyan: 16777215,
  darkblue: 35839,
  darkcyan: 9145343,
  darkgoldenrod: 3095792639,
  darkgray: 2846468607,
  darkgreen: 6553855,
  darkgrey: 2846468607,
  darkkhaki: 3182914559,
  darkmagenta: 2332068863,
  darkolivegreen: 1433087999,
  darkorange: 4287365375,
  darkorchid: 2570243327,
  darkred: 2332033279,
  darksalmon: 3918953215,
  darkseagreen: 2411499519,
  darkslateblue: 1211993087,
  darkslategray: 793726975,
  darkslategrey: 793726975,
  darkturquoise: 13554175,
  darkviolet: 2483082239,
  deeppink: 4279538687,
  deepskyblue: 12582911,
  dimgray: 1768516095,
  dimgrey: 1768516095,
  dodgerblue: 512819199,
  firebrick: 2988581631,
  floralwhite: 4294635775,
  forestgreen: 579543807,
  fuchsia: 4278255615,
  gainsboro: 3705462015,
  ghostwhite: 4177068031,
  gold: 4292280575,
  goldenrod: 3668254975,
  gray: 2155905279,
  green: 8388863,
  greenyellow: 2919182335,
  grey: 2155905279,
  honeydew: 4043305215,
  hotpink: 4285117695,
  indianred: 3445382399,
  indigo: 1258324735,
  ivory: 4294963455,
  khaki: 4041641215,
  lavender: 3873897215,
  lavenderblush: 4293981695,
  lawngreen: 2096890111,
  lemonchiffon: 4294626815,
  lightblue: 2916673279,
  lightcoral: 4034953471,
  lightcyan: 3774873599,
  lightgoldenrodyellow: 4210742015,
  lightgray: 3553874943,
  lightgreen: 2431553791,
  lightgrey: 3553874943,
  lightpink: 4290167295,
  lightsalmon: 4288707327,
  lightseagreen: 548580095,
  lightskyblue: 2278488831,
  lightslategray: 2005441023,
  lightslategrey: 2005441023,
  lightsteelblue: 2965692159,
  lightyellow: 4294959359,
  lime: 16711935,
  limegreen: 852308735,
  linen: 4210091775,
  magenta: 4278255615,
  maroon: 2147483903,
  mediumaquamarine: 1724754687,
  mediumblue: 52735,
  mediumorchid: 3126187007,
  mediumpurple: 2473647103,
  mediumseagreen: 1018393087,
  mediumslateblue: 2070474495,
  mediumspringgreen: 16423679,
  mediumturquoise: 1221709055,
  mediumvioletred: 3340076543,
  midnightblue: 421097727,
  mintcream: 4127193855,
  mistyrose: 4293190143,
  moccasin: 4293178879,
  navajowhite: 4292783615,
  navy: 33023,
  oldlace: 4260751103,
  olive: 2155872511,
  olivedrab: 1804477439,
  orange: 4289003775,
  orangered: 4282712319,
  orchid: 3664828159,
  palegoldenrod: 4008225535,
  palegreen: 2566625535,
  paleturquoise: 2951671551,
  palevioletred: 3681588223,
  papayawhip: 4293907967,
  peachpuff: 4292524543,
  peru: 3448061951,
  pink: 4290825215,
  plum: 3718307327,
  powderblue: 2967529215,
  purple: 2147516671,
  rebeccapurple: 1714657791,
  red: 4278190335,
  rosybrown: 3163525119,
  royalblue: 1097458175,
  saddlebrown: 2336560127,
  salmon: 4202722047,
  sandybrown: 4104413439,
  seagreen: 780883967,
  seashell: 4294307583,
  sienna: 2689740287,
  silver: 3233857791,
  skyblue: 2278484991,
  slateblue: 1784335871,
  slategray: 1887473919,
  slategrey: 1887473919,
  snow: 4294638335,
  springgreen: 16744447,
  steelblue: 1182971135,
  tan: 3535047935,
  teal: 8421631,
  thistle: 3636451583,
  tomato: 4284696575,
  turquoise: 1088475391,
  violet: 4001558271,
  wheat: 4125012991,
  white: 4294967295,
  whitesmoke: 4126537215,
  yellow: 4294902015,
  yellowgreen: 2597139199
};
var NUMBER = "[-+]?\\d*\\.?\\d+";
var PERCENTAGE = NUMBER + "%";
function call(...parts) {
  return "\\(\\s*(" + parts.join(")\\s*,\\s*(") + ")\\s*\\)";
}
var rgb = new RegExp("rgb" + call(NUMBER, NUMBER, NUMBER));
var rgba = new RegExp("rgba" + call(NUMBER, NUMBER, NUMBER, NUMBER));
var hsl = new RegExp("hsl" + call(NUMBER, PERCENTAGE, PERCENTAGE));
var hsla = new RegExp("hsla" + call(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER));
var hex3 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex4 = /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/;
var hex6 = /^#([0-9a-fA-F]{6})$/;
var hex8 = /^#([0-9a-fA-F]{8})$/;
function normalizeColor(color2) {
  let match;
  if (typeof color2 === "number") {
    return color2 >>> 0 === color2 && color2 >= 0 && color2 <= 4294967295 ? color2 : null;
  }
  if (match = hex6.exec(color2))
    return parseInt(match[1] + "ff", 16) >>> 0;
  if (colors$1 && colors$1[color2] !== void 0) {
    return colors$1[color2];
  }
  if (match = rgb.exec(color2)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | 255) >>> 0;
  }
  if (match = rgba.exec(color2)) {
    return (parse255(match[1]) << 24 | parse255(match[2]) << 16 | parse255(match[3]) << 8 | parse1(match[4])) >>> 0;
  }
  if (match = hex3.exec(color2)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + "ff", 16) >>> 0;
  }
  if (match = hex8.exec(color2))
    return parseInt(match[1], 16) >>> 0;
  if (match = hex4.exec(color2)) {
    return parseInt(match[1] + match[1] + match[2] + match[2] + match[3] + match[3] + match[4] + match[4], 16) >>> 0;
  }
  if (match = hsl.exec(color2)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | 255) >>> 0;
  }
  if (match = hsla.exec(color2)) {
    return (hslToRgb(parse360(match[1]), parsePercentage(match[2]), parsePercentage(match[3])) | parse1(match[4])) >>> 0;
  }
  return null;
}
function hue2rgb(p3, q, t5) {
  if (t5 < 0)
    t5 += 1;
  if (t5 > 1)
    t5 -= 1;
  if (t5 < 1 / 6)
    return p3 + (q - p3) * 6 * t5;
  if (t5 < 1 / 2)
    return q;
  if (t5 < 2 / 3)
    return p3 + (q - p3) * (2 / 3 - t5) * 6;
  return p3;
}
function hslToRgb(h3, s3, l3) {
  const q = l3 < 0.5 ? l3 * (1 + s3) : l3 + s3 - l3 * s3;
  const p3 = 2 * l3 - q;
  const r4 = hue2rgb(p3, q, h3 + 1 / 3);
  const g3 = hue2rgb(p3, q, h3);
  const b4 = hue2rgb(p3, q, h3 - 1 / 3);
  return Math.round(r4 * 255) << 24 | Math.round(g3 * 255) << 16 | Math.round(b4 * 255) << 8;
}
function parse255(str) {
  const int = parseInt(str, 10);
  if (int < 0)
    return 0;
  if (int > 255)
    return 255;
  return int;
}
function parse360(str) {
  const int = parseFloat(str);
  return (int % 360 + 360) % 360 / 360;
}
function parse1(str) {
  const num = parseFloat(str);
  if (num < 0)
    return 0;
  if (num > 1)
    return 255;
  return Math.round(num * 255);
}
function parsePercentage(str) {
  const int = parseFloat(str);
  if (int < 0)
    return 0;
  if (int > 100)
    return 1;
  return int / 100;
}
function colorToRgba(input) {
  let int32Color = normalizeColor(input);
  if (int32Color === null)
    return input;
  int32Color = int32Color || 0;
  let r4 = (int32Color & 4278190080) >>> 24;
  let g3 = (int32Color & 16711680) >>> 16;
  let b4 = (int32Color & 65280) >>> 8;
  let a3 = (int32Color & 255) / 255;
  return `rgba(${r4}, ${g3}, ${b4}, ${a3})`;
}
var createInterpolator = (range, output, extrapolate) => {
  if (is.fun(range)) {
    return range;
  }
  if (is.arr(range)) {
    return createInterpolator({
      range,
      output,
      extrapolate
    });
  }
  if (is.str(range.output[0])) {
    return createStringInterpolator$1(range);
  }
  const config2 = range;
  const outputRange = config2.output;
  const inputRange = config2.range || [0, 1];
  const extrapolateLeft = config2.extrapolateLeft || config2.extrapolate || "extend";
  const extrapolateRight = config2.extrapolateRight || config2.extrapolate || "extend";
  const easing = config2.easing || ((t5) => t5);
  return (input) => {
    const range2 = findRange(input, inputRange);
    return interpolate(input, inputRange[range2], inputRange[range2 + 1], outputRange[range2], outputRange[range2 + 1], easing, extrapolateLeft, extrapolateRight, config2.map);
  };
};
function interpolate(input, inputMin, inputMax, outputMin, outputMax, easing, extrapolateLeft, extrapolateRight, map3) {
  let result = map3 ? map3(input) : input;
  if (result < inputMin) {
    if (extrapolateLeft === "identity")
      return result;
    else if (extrapolateLeft === "clamp")
      result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity")
      return result;
    else if (extrapolateRight === "clamp")
      result = inputMax;
  }
  if (outputMin === outputMax)
    return outputMin;
  if (inputMin === inputMax)
    return input <= inputMin ? outputMin : outputMax;
  if (inputMin === -Infinity)
    result = -result;
  else if (inputMax === Infinity)
    result = result - inputMin;
  else
    result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  if (outputMin === -Infinity)
    result = -result;
  else if (outputMax === Infinity)
    result = result + outputMin;
  else
    result = result * (outputMax - outputMin) + outputMin;
  return result;
}
function findRange(input, inputRange) {
  for (var i3 = 1; i3 < inputRange.length - 1; ++i3)
    if (inputRange[i3] >= input)
      break;
  return i3 - 1;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var $get = Symbol.for("FluidValue.get");
var $observers = Symbol.for("FluidValue.observers");
var hasFluidValue = (arg) => Boolean(arg && arg[$get]);
var getFluidValue = (arg) => arg && arg[$get] ? arg[$get]() : arg;
var getFluidObservers = (target) => target[$observers] || null;
function callFluidObserver(observer, event) {
  if (observer.eventObserved) {
    observer.eventObserved(event);
  } else {
    observer(event);
  }
}
function callFluidObservers(target, event) {
  let observers = target[$observers];
  if (observers) {
    observers.forEach((observer) => {
      callFluidObserver(observer, event);
    });
  }
}
var FluidValue = class {
  constructor(get) {
    this[$get] = void 0;
    this[$observers] = void 0;
    if (!get && !(get = this.get)) {
      throw Error("Unknown getter");
    }
    setFluidGetter(this, get);
  }
};
var setFluidGetter = (target, get) => setHidden(target, $get, get);
function addFluidObserver(target, observer) {
  if (target[$get]) {
    let observers = target[$observers];
    if (!observers) {
      setHidden(target, $observers, observers = /* @__PURE__ */ new Set());
    }
    if (!observers.has(observer)) {
      observers.add(observer);
      if (target.observerAdded) {
        target.observerAdded(observers.size, observer);
      }
    }
  }
  return observer;
}
function removeFluidObserver(target, observer) {
  let observers = target[$observers];
  if (observers && observers.has(observer)) {
    const count = observers.size - 1;
    if (count) {
      observers.delete(observer);
    } else {
      target[$observers] = null;
    }
    if (target.observerRemoved) {
      target.observerRemoved(count, observer);
    }
  }
}
var setHidden = (target, key, value) => Object.defineProperty(target, key, {
  value,
  writable: true,
  configurable: true
});
var numberRegex = /[+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var colorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/gi;
var unitRegex = new RegExp(`(${numberRegex.source})(%|[a-z]+)`, "i");
var rgbaRegex = /rgba\(([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+), ([0-9\.-]+)\)/gi;
var cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;
var variableToRgba = (input) => {
  const [token, fallback] = parseCSSVariable(input);
  if (!token || isSSR()) {
    return input;
  }
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(token);
  if (value) {
    return value.trim();
  } else if (fallback && fallback.startsWith("--")) {
    const _value = window.getComputedStyle(document.documentElement).getPropertyValue(fallback);
    if (_value) {
      return _value;
    } else {
      return input;
    }
  } else if (fallback && cssVariableRegex.test(fallback)) {
    return variableToRgba(fallback);
  } else if (fallback) {
    return fallback;
  }
  return input;
};
var parseCSSVariable = (current) => {
  const match = cssVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token, fallback] = match;
  return [token, fallback];
};
var namedColorRegex;
var rgbaRound = (_, p1, p22, p3, p4) => `rgba(${Math.round(p1)}, ${Math.round(p22)}, ${Math.round(p3)}, ${p4})`;
var createStringInterpolator = (config2) => {
  if (!namedColorRegex)
    namedColorRegex = colors$1 ? new RegExp(`(${Object.keys(colors$1).join("|")})(?!\\w)`, "g") : /^\b$/;
  const output = config2.output.map((value) => {
    return getFluidValue(value).replace(cssVariableRegex, variableToRgba).replace(colorRegex, colorToRgba).replace(namedColorRegex, colorToRgba);
  });
  const keyframes = output.map((value) => value.match(numberRegex).map(Number));
  const outputRanges = keyframes[0].map((_, i3) => keyframes.map((values) => {
    if (!(i3 in values)) {
      throw Error('The arity of each "output" value must be equal');
    }
    return values[i3];
  }));
  const interpolators = outputRanges.map((output2) => createInterpolator(_extends({}, config2, {
    output: output2
  })));
  return (input) => {
    var _output$find;
    const missingUnit = !unitRegex.test(output[0]) && ((_output$find = output.find((value) => unitRegex.test(value))) == null ? void 0 : _output$find.replace(numberRegex, ""));
    let i3 = 0;
    return output[0].replace(numberRegex, () => `${interpolators[i3++](input)}${missingUnit || ""}`).replace(rgbaRegex, rgbaRound);
  };
};
var prefix = "react-spring: ";
var once = (fn) => {
  const func = fn;
  let called = false;
  if (typeof func != "function") {
    throw new TypeError(`${prefix}once requires a function parameter`);
  }
  return (...args) => {
    if (!called) {
      func(...args);
      called = true;
    }
  };
};
var warnInterpolate = once(console.warn);
function deprecateInterpolate() {
  warnInterpolate(`${prefix}The "interpolate" function is deprecated in v9 (use "to" instead)`);
}
var warnDirectCall = once(console.warn);
function deprecateDirectCall() {
  warnDirectCall(`${prefix}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`);
}
function isAnimatedString(value) {
  return is.str(value) && (value[0] == "#" || /\d/.test(value) || !isSSR() && cssVariableRegex.test(value) || value in (colors$1 || {}));
}
var useLayoutEffect2 = typeof window !== "undefined" && window.document && window.document.createElement ? React.useLayoutEffect : React.useEffect;
var useIsMounted = () => {
  const isMounted = (0, import_react.useRef)(false);
  useLayoutEffect2(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};
function useForceUpdate() {
  const update3 = (0, import_react.useState)()[1];
  const isMounted = useIsMounted();
  return () => {
    if (isMounted.current) {
      update3(Math.random());
    }
  };
}
function useMemoOne(getResult, inputs) {
  const [initial] = (0, import_react.useState)(() => ({
    inputs,
    result: getResult()
  }));
  const committed = (0, import_react.useRef)();
  const prevCache = committed.current;
  let cache = prevCache;
  if (cache) {
    const useCache = Boolean(inputs && cache.inputs && areInputsEqual(inputs, cache.inputs));
    if (!useCache) {
      cache = {
        inputs,
        result: getResult()
      };
    }
  } else {
    cache = initial;
  }
  (0, import_react.useEffect)(() => {
    committed.current = cache;
    if (prevCache == initial) {
      initial.inputs = initial.result = void 0;
    }
  }, [cache]);
  return cache.result;
}
function areInputsEqual(next, prev) {
  if (next.length !== prev.length) {
    return false;
  }
  for (let i3 = 0; i3 < next.length; i3++) {
    if (next[i3] !== prev[i3]) {
      return false;
    }
  }
  return true;
}
var useOnce = (effect) => (0, import_react.useEffect)(effect, emptyDeps);
var emptyDeps = [];
function usePrev(value) {
  const prevRef = (0, import_react.useRef)();
  (0, import_react.useEffect)(() => {
    prevRef.current = value;
  });
  return prevRef.current;
}

// ../../node_modules/@react-spring/core/dist/react-spring-core.esm.js
var React3 = __toESM(require_react());
var import_react3 = __toESM(require_react());

// ../../node_modules/@react-spring/animated/dist/react-spring-animated.esm.js
var React2 = __toESM(require_react());
var import_react2 = __toESM(require_react());
var $node = Symbol.for("Animated:node");
var isAnimated = (value) => !!value && value[$node] === value;
var getAnimated = (owner) => owner && owner[$node];
var setAnimated = (owner, node) => defineHidden(owner, $node, node);
var getPayload = (owner) => owner && owner[$node] && owner[$node].getPayload();
var Animated = class {
  constructor() {
    this.payload = void 0;
    setAnimated(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
};
var AnimatedValue = class extends Animated {
  constructor(_value) {
    super();
    this.done = true;
    this.elapsedTime = void 0;
    this.lastPosition = void 0;
    this.lastVelocity = void 0;
    this.v0 = void 0;
    this.durationProgress = 0;
    this._value = _value;
    if (is.num(this._value)) {
      this.lastPosition = this._value;
    }
  }
  static create(value) {
    return new AnimatedValue(value);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(value, step) {
    if (is.num(value)) {
      this.lastPosition = value;
      if (step) {
        value = Math.round(value / step) * step;
        if (this.done) {
          this.lastPosition = value;
        }
      }
    }
    if (this._value === value) {
      return false;
    }
    this._value = value;
    return true;
  }
  reset() {
    const {
      done
    } = this;
    this.done = false;
    if (is.num(this._value)) {
      this.elapsedTime = 0;
      this.durationProgress = 0;
      this.lastPosition = this._value;
      if (done)
        this.lastVelocity = null;
      this.v0 = null;
    }
  }
};
var AnimatedString = class extends AnimatedValue {
  constructor(value) {
    super(0);
    this._string = null;
    this._toString = void 0;
    this._toString = createInterpolator({
      output: [value, value]
    });
  }
  static create(value) {
    return new AnimatedString(value);
  }
  getValue() {
    let value = this._string;
    return value == null ? this._string = this._toString(this._value) : value;
  }
  setValue(value) {
    if (is.str(value)) {
      if (value == this._string) {
        return false;
      }
      this._string = value;
      this._value = 1;
    } else if (super.setValue(value)) {
      this._string = null;
    } else {
      return false;
    }
    return true;
  }
  reset(goal) {
    if (goal) {
      this._toString = createInterpolator({
        output: [this.getValue(), goal]
      });
    }
    this._value = 0;
    super.reset();
  }
};
var TreeContext = {
  dependencies: null
};
var AnimatedObject = class extends Animated {
  constructor(source) {
    super();
    this.source = source;
    this.setValue(source);
  }
  getValue(animated2) {
    const values = {};
    eachProp(this.source, (source, key) => {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated2);
      } else if (hasFluidValue(source)) {
        values[key] = getFluidValue(source);
      } else if (!animated2) {
        values[key] = source;
      }
    });
    return values;
  }
  setValue(source) {
    this.source = source;
    this.payload = this._makePayload(source);
  }
  reset() {
    if (this.payload) {
      each(this.payload, (node) => node.reset());
    }
  }
  _makePayload(source) {
    if (source) {
      const payload = /* @__PURE__ */ new Set();
      eachProp(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }
  _addToPayload(source) {
    if (TreeContext.dependencies && hasFluidValue(source)) {
      TreeContext.dependencies.add(source);
    }
    const payload = getPayload(source);
    if (payload) {
      each(payload, (node) => this.add(node));
    }
  }
};
var AnimatedArray = class extends AnimatedObject {
  constructor(source) {
    super(source);
  }
  static create(source) {
    return new AnimatedArray(source);
  }
  getValue() {
    return this.source.map((node) => node.getValue());
  }
  setValue(source) {
    const payload = this.getPayload();
    if (source.length == payload.length) {
      return payload.map((node, i3) => node.setValue(source[i3])).some(Boolean);
    }
    super.setValue(source.map(makeAnimated));
    return true;
  }
};
function makeAnimated(value) {
  const nodeType = isAnimatedString(value) ? AnimatedString : AnimatedValue;
  return nodeType.create(value);
}
function getAnimatedType(value) {
  const parentNode = getAnimated(value);
  return parentNode ? parentNode.constructor : is.arr(value) ? AnimatedArray : isAnimatedString(value) ? AnimatedString : AnimatedValue;
}
function _extends2() {
  _extends2 = Object.assign || function(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends2.apply(this, arguments);
}
var withAnimated = (Component, host2) => {
  const hasInstance = !is.fun(Component) || Component.prototype && Component.prototype.isReactComponent;
  return (0, import_react2.forwardRef)((givenProps, givenRef) => {
    const instanceRef = (0, import_react2.useRef)(null);
    const ref = hasInstance && (0, import_react2.useCallback)((value) => {
      instanceRef.current = updateRef(givenRef, value);
    }, [givenRef]);
    const [props, deps] = getAnimatedState(givenProps, host2);
    const forceUpdate = useForceUpdate();
    const callback = () => {
      const instance = instanceRef.current;
      if (hasInstance && !instance) {
        return;
      }
      const didUpdate = instance ? host2.applyAnimatedValues(instance, props.getValue(true)) : false;
      if (didUpdate === false) {
        forceUpdate();
      }
    };
    const observer = new PropsObserver(callback, deps);
    const observerRef = (0, import_react2.useRef)();
    useLayoutEffect2(() => {
      observerRef.current = observer;
      each(deps, (dep) => addFluidObserver(dep, observer));
      return () => {
        if (observerRef.current) {
          each(observerRef.current.deps, (dep) => removeFluidObserver(dep, observerRef.current));
          raf.cancel(observerRef.current.update);
        }
      };
    });
    (0, import_react2.useEffect)(callback, []);
    useOnce(() => () => {
      const observer2 = observerRef.current;
      each(observer2.deps, (dep) => removeFluidObserver(dep, observer2));
    });
    const usedProps = host2.getComponentProps(props.getValue());
    return React2.createElement(Component, _extends2({}, usedProps, {
      ref
    }));
  });
};
var PropsObserver = class {
  constructor(update3, deps) {
    this.update = update3;
    this.deps = deps;
  }
  eventObserved(event) {
    if (event.type == "change") {
      raf.write(this.update);
    }
  }
};
function getAnimatedState(props, host2) {
  const dependencies = /* @__PURE__ */ new Set();
  TreeContext.dependencies = dependencies;
  if (props.style)
    props = _extends2({}, props, {
      style: host2.createAnimatedStyle(props.style)
    });
  props = new AnimatedObject(props);
  TreeContext.dependencies = null;
  return [props, dependencies];
}
function updateRef(ref, value) {
  if (ref) {
    if (is.fun(ref))
      ref(value);
    else
      ref.current = value;
  }
  return value;
}
var cacheKey = Symbol.for("AnimatedComponent");
var createHost = (components, {
  applyAnimatedValues: _applyAnimatedValues = () => false,
  createAnimatedStyle: _createAnimatedStyle = (style) => new AnimatedObject(style),
  getComponentProps: _getComponentProps = (props) => props
} = {}) => {
  const hostConfig = {
    applyAnimatedValues: _applyAnimatedValues,
    createAnimatedStyle: _createAnimatedStyle,
    getComponentProps: _getComponentProps
  };
  const animated2 = (Component) => {
    const displayName = getDisplayName(Component) || "Anonymous";
    if (is.str(Component)) {
      Component = animated2[Component] || (animated2[Component] = withAnimated(Component, hostConfig));
    } else {
      Component = Component[cacheKey] || (Component[cacheKey] = withAnimated(Component, hostConfig));
    }
    Component.displayName = `Animated(${displayName})`;
    return Component;
  };
  eachProp(components, (Component, key) => {
    if (is.arr(components)) {
      key = getDisplayName(Component);
    }
    animated2[key] = animated2(Component);
  });
  return {
    animated: animated2
  };
};
var getDisplayName = (arg) => is.str(arg) ? arg : arg && is.str(arg.displayName) ? arg.displayName : is.fun(arg) && arg.name || null;

// ../../node_modules/@react-spring/core/dist/react-spring-core.esm.js
function _extends3() {
  _extends3 = Object.assign || function(target) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var source = arguments[i3];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends3.apply(this, arguments);
}
function callProp(value, ...args) {
  return is.fun(value) ? value(...args) : value;
}
var matchProp = (value, key) => value === true || !!(key && value && (is.fun(value) ? value(key) : toArray(value).includes(key)));
var resolveProp = (prop, key) => is.obj(prop) ? key && prop[key] : prop;
var getDefaultProp = (props, key) => props.default === true ? props[key] : props.default ? props.default[key] : void 0;
var noopTransform = (value) => value;
var getDefaultProps = (props, transform = noopTransform) => {
  let keys = DEFAULT_PROPS;
  if (props.default && props.default !== true) {
    props = props.default;
    keys = Object.keys(props);
  }
  const defaults2 = {};
  for (const key of keys) {
    const value = transform(props[key], key);
    if (!is.und(value)) {
      defaults2[key] = value;
    }
  }
  return defaults2;
};
var DEFAULT_PROPS = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"];
var RESERVED_PROPS = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,
  keys: 1,
  callId: 1,
  parentId: 1
};
function getForwardProps(props) {
  const forward = {};
  let count = 0;
  eachProp(props, (value, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value;
      count++;
    }
  });
  if (count) {
    return forward;
  }
}
function inferTo(props) {
  const to3 = getForwardProps(props);
  if (to3) {
    const out = {
      to: to3
    };
    eachProp(props, (val, key) => key in to3 || (out[key] = val));
    return out;
  }
  return _extends3({}, props);
}
function computeGoal(value) {
  value = getFluidValue(value);
  return is.arr(value) ? value.map(computeGoal) : isAnimatedString(value) ? globals.createStringInterpolator({
    range: [0, 1],
    output: [value, value]
  })(1) : value;
}
function hasProps(props) {
  for (const _ in props)
    return true;
  return false;
}
function isAsyncTo(to3) {
  return is.fun(to3) || is.arr(to3) && is.obj(to3[0]);
}
function detachRefs(ctrl, ref) {
  var _ctrl$ref;
  (_ctrl$ref = ctrl.ref) == null ? void 0 : _ctrl$ref.delete(ctrl);
  ref == null ? void 0 : ref.delete(ctrl);
}
function replaceRef(ctrl, ref) {
  if (ref && ctrl.ref !== ref) {
    var _ctrl$ref2;
    (_ctrl$ref2 = ctrl.ref) == null ? void 0 : _ctrl$ref2.delete(ctrl);
    ref.add(ctrl);
    ctrl.ref = ref;
  }
}
var config = {
  default: {
    tension: 170,
    friction: 26
  },
  gentle: {
    tension: 120,
    friction: 14
  },
  wobbly: {
    tension: 180,
    friction: 12
  },
  stiff: {
    tension: 210,
    friction: 20
  },
  slow: {
    tension: 280,
    friction: 60
  },
  molasses: {
    tension: 280,
    friction: 120
  }
};
var c1 = 1.70158;
var c2 = c1 * 1.525;
var c3 = c1 + 1;
var c4 = 2 * Math.PI / 3;
var c5 = 2 * Math.PI / 4.5;
var bounceOut = (x5) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x5 < 1 / d1) {
    return n1 * x5 * x5;
  } else if (x5 < 2 / d1) {
    return n1 * (x5 -= 1.5 / d1) * x5 + 0.75;
  } else if (x5 < 2.5 / d1) {
    return n1 * (x5 -= 2.25 / d1) * x5 + 0.9375;
  } else {
    return n1 * (x5 -= 2.625 / d1) * x5 + 0.984375;
  }
};
var easings = {
  linear: (x5) => x5,
  easeInQuad: (x5) => x5 * x5,
  easeOutQuad: (x5) => 1 - (1 - x5) * (1 - x5),
  easeInOutQuad: (x5) => x5 < 0.5 ? 2 * x5 * x5 : 1 - Math.pow(-2 * x5 + 2, 2) / 2,
  easeInCubic: (x5) => x5 * x5 * x5,
  easeOutCubic: (x5) => 1 - Math.pow(1 - x5, 3),
  easeInOutCubic: (x5) => x5 < 0.5 ? 4 * x5 * x5 * x5 : 1 - Math.pow(-2 * x5 + 2, 3) / 2,
  easeInQuart: (x5) => x5 * x5 * x5 * x5,
  easeOutQuart: (x5) => 1 - Math.pow(1 - x5, 4),
  easeInOutQuart: (x5) => x5 < 0.5 ? 8 * x5 * x5 * x5 * x5 : 1 - Math.pow(-2 * x5 + 2, 4) / 2,
  easeInQuint: (x5) => x5 * x5 * x5 * x5 * x5,
  easeOutQuint: (x5) => 1 - Math.pow(1 - x5, 5),
  easeInOutQuint: (x5) => x5 < 0.5 ? 16 * x5 * x5 * x5 * x5 * x5 : 1 - Math.pow(-2 * x5 + 2, 5) / 2,
  easeInSine: (x5) => 1 - Math.cos(x5 * Math.PI / 2),
  easeOutSine: (x5) => Math.sin(x5 * Math.PI / 2),
  easeInOutSine: (x5) => -(Math.cos(Math.PI * x5) - 1) / 2,
  easeInExpo: (x5) => x5 === 0 ? 0 : Math.pow(2, 10 * x5 - 10),
  easeOutExpo: (x5) => x5 === 1 ? 1 : 1 - Math.pow(2, -10 * x5),
  easeInOutExpo: (x5) => x5 === 0 ? 0 : x5 === 1 ? 1 : x5 < 0.5 ? Math.pow(2, 20 * x5 - 10) / 2 : (2 - Math.pow(2, -20 * x5 + 10)) / 2,
  easeInCirc: (x5) => 1 - Math.sqrt(1 - Math.pow(x5, 2)),
  easeOutCirc: (x5) => Math.sqrt(1 - Math.pow(x5 - 1, 2)),
  easeInOutCirc: (x5) => x5 < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x5, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x5 + 2, 2)) + 1) / 2,
  easeInBack: (x5) => c3 * x5 * x5 * x5 - c1 * x5 * x5,
  easeOutBack: (x5) => 1 + c3 * Math.pow(x5 - 1, 3) + c1 * Math.pow(x5 - 1, 2),
  easeInOutBack: (x5) => x5 < 0.5 ? Math.pow(2 * x5, 2) * ((c2 + 1) * 2 * x5 - c2) / 2 : (Math.pow(2 * x5 - 2, 2) * ((c2 + 1) * (x5 * 2 - 2) + c2) + 2) / 2,
  easeInElastic: (x5) => x5 === 0 ? 0 : x5 === 1 ? 1 : -Math.pow(2, 10 * x5 - 10) * Math.sin((x5 * 10 - 10.75) * c4),
  easeOutElastic: (x5) => x5 === 0 ? 0 : x5 === 1 ? 1 : Math.pow(2, -10 * x5) * Math.sin((x5 * 10 - 0.75) * c4) + 1,
  easeInOutElastic: (x5) => x5 === 0 ? 0 : x5 === 1 ? 1 : x5 < 0.5 ? -(Math.pow(2, 20 * x5 - 10) * Math.sin((20 * x5 - 11.125) * c5)) / 2 : Math.pow(2, -20 * x5 + 10) * Math.sin((20 * x5 - 11.125) * c5) / 2 + 1,
  easeInBounce: (x5) => 1 - bounceOut(1 - x5),
  easeOutBounce: bounceOut,
  easeInOutBounce: (x5) => x5 < 0.5 ? (1 - bounceOut(1 - 2 * x5)) / 2 : (1 + bounceOut(2 * x5 - 1)) / 2
};
var defaults = _extends3({}, config.default, {
  mass: 1,
  damping: 1,
  easing: easings.linear,
  clamp: false
});
var AnimationConfig = class {
  constructor() {
    this.tension = void 0;
    this.friction = void 0;
    this.frequency = void 0;
    this.damping = void 0;
    this.mass = void 0;
    this.velocity = 0;
    this.restVelocity = void 0;
    this.precision = void 0;
    this.progress = void 0;
    this.duration = void 0;
    this.easing = void 0;
    this.clamp = void 0;
    this.bounce = void 0;
    this.decay = void 0;
    this.round = void 0;
    Object.assign(this, defaults);
  }
};
function mergeConfig(config2, newConfig, defaultConfig) {
  if (defaultConfig) {
    defaultConfig = _extends3({}, defaultConfig);
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = _extends3({}, defaultConfig, newConfig);
  }
  sanitizeConfig(config2, newConfig);
  Object.assign(config2, newConfig);
  for (const key in defaults) {
    if (config2[key] == null) {
      config2[key] = defaults[key];
    }
  }
  let {
    mass,
    frequency,
    damping
  } = config2;
  if (!is.und(frequency)) {
    if (frequency < 0.01)
      frequency = 0.01;
    if (damping < 0)
      damping = 0;
    config2.tension = Math.pow(2 * Math.PI / frequency, 2) * mass;
    config2.friction = 4 * Math.PI * damping * mass / frequency;
  }
  return config2;
}
function sanitizeConfig(config2, props) {
  if (!is.und(props.decay)) {
    config2.duration = void 0;
  } else {
    const isTensionConfig = !is.und(props.tension) || !is.und(props.friction);
    if (isTensionConfig || !is.und(props.frequency) || !is.und(props.damping) || !is.und(props.mass)) {
      config2.duration = void 0;
      config2.decay = void 0;
    }
    if (isTensionConfig) {
      config2.frequency = void 0;
    }
  }
}
var emptyArray = [];
var Animation = class {
  constructor() {
    this.changed = false;
    this.values = emptyArray;
    this.toValues = null;
    this.fromValues = emptyArray;
    this.to = void 0;
    this.from = void 0;
    this.config = new AnimationConfig();
    this.immediate = false;
  }
};
function scheduleProps(callId, {
  key,
  props,
  defaultProps,
  state,
  actions
}) {
  return new Promise((resolve, reject) => {
    var _props$cancel;
    let delay;
    let timeout;
    let cancel = matchProp((_props$cancel = props.cancel) != null ? _props$cancel : defaultProps == null ? void 0 : defaultProps.cancel, key);
    if (cancel) {
      onStart();
    } else {
      if (!is.und(props.pause)) {
        state.paused = matchProp(props.pause, key);
      }
      let pause = defaultProps == null ? void 0 : defaultProps.pause;
      if (pause !== true) {
        pause = state.paused || matchProp(pause, key);
      }
      delay = callProp(props.delay || 0, key);
      if (pause) {
        state.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }
    function onPause() {
      state.resumeQueue.add(onResume);
      state.timeouts.delete(timeout);
      timeout.cancel();
      delay = timeout.time - raf.now();
    }
    function onResume() {
      if (delay > 0 && !globals.skipAnimation) {
        state.delayed = true;
        timeout = raf.setTimeout(onStart, delay);
        state.pauseQueue.add(onPause);
        state.timeouts.add(timeout);
      } else {
        onStart();
      }
    }
    function onStart() {
      if (state.delayed) {
        state.delayed = false;
      }
      state.pauseQueue.delete(onPause);
      state.timeouts.delete(timeout);
      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }
      try {
        actions.start(_extends3({}, props, {
          callId,
          cancel
        }), resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}
var getCombinedResult = (target, results) => results.length == 1 ? results[0] : results.some((result) => result.cancelled) ? getCancelledResult(target.get()) : results.every((result) => result.noop) ? getNoopResult(target.get()) : getFinishedResult(target.get(), results.every((result) => result.finished));
var getNoopResult = (value) => ({
  value,
  noop: true,
  finished: true,
  cancelled: false
});
var getFinishedResult = (value, finished, cancelled = false) => ({
  value,
  finished,
  cancelled
});
var getCancelledResult = (value) => ({
  value,
  cancelled: true,
  finished: false
});
function runAsync(to3, props, state, target) {
  const {
    callId,
    parentId,
    onRest
  } = props;
  const {
    asyncTo: prevTo,
    promise: prevPromise
  } = state;
  if (!parentId && to3 === prevTo && !props.reset) {
    return prevPromise;
  }
  return state.promise = (async () => {
    state.asyncId = callId;
    state.asyncTo = to3;
    const defaultProps = getDefaultProps(props, (value, key) => key === "onRest" ? void 0 : value);
    let preventBail;
    let bail;
    const bailPromise = new Promise((resolve, reject) => (preventBail = resolve, bail = reject));
    const bailIfEnded = (bailSignal) => {
      const bailResult = callId <= (state.cancelId || 0) && getCancelledResult(target) || callId !== state.asyncId && getFinishedResult(target, false);
      if (bailResult) {
        bailSignal.result = bailResult;
        bail(bailSignal);
        throw bailSignal;
      }
    };
    const animate = (arg1, arg2) => {
      const bailSignal = new BailSignal();
      const skipAnimationSignal = new SkipAniamtionSignal();
      return (async () => {
        if (globals.skipAnimation) {
          stopAsync(state);
          skipAnimationSignal.result = getFinishedResult(target, false);
          bail(skipAnimationSignal);
          throw skipAnimationSignal;
        }
        bailIfEnded(bailSignal);
        const props2 = is.obj(arg1) ? _extends3({}, arg1) : _extends3({}, arg2, {
          to: arg1
        });
        props2.parentId = callId;
        eachProp(defaultProps, (value, key) => {
          if (is.und(props2[key])) {
            props2[key] = value;
          }
        });
        const result2 = await target.start(props2);
        bailIfEnded(bailSignal);
        if (state.paused) {
          await new Promise((resume) => {
            state.resumeQueue.add(resume);
          });
        }
        return result2;
      })();
    };
    let result;
    if (globals.skipAnimation) {
      stopAsync(state);
      return getFinishedResult(target, false);
    }
    try {
      let animating;
      if (is.arr(to3)) {
        animating = (async (queue) => {
          for (const props2 of queue) {
            await animate(props2);
          }
        })(to3);
      } else {
        animating = Promise.resolve(to3(animate, target.stop.bind(target)));
      }
      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target.get(), true, false);
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else if (err instanceof SkipAniamtionSignal) {
        result = err.result;
      } else {
        throw err;
      }
    } finally {
      if (callId == state.asyncId) {
        state.asyncId = parentId;
        state.asyncTo = parentId ? prevTo : void 0;
        state.promise = parentId ? prevPromise : void 0;
      }
    }
    if (is.fun(onRest)) {
      raf.batchedUpdates(() => {
        onRest(result, target, target.item);
      });
    }
    return result;
  })();
}
function stopAsync(state, cancelId) {
  flush(state.timeouts, (t5) => t5.cancel());
  state.pauseQueue.clear();
  state.resumeQueue.clear();
  state.asyncId = state.asyncTo = state.promise = void 0;
  if (cancelId)
    state.cancelId = cancelId;
}
var BailSignal = class extends Error {
  constructor() {
    super("An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise.");
    this.result = void 0;
  }
};
var SkipAniamtionSignal = class extends Error {
  constructor() {
    super("SkipAnimationSignal");
    this.result = void 0;
  }
};
var isFrameValue = (value) => value instanceof FrameValue;
var nextId$1 = 1;
var FrameValue = class extends FluidValue {
  constructor(...args) {
    super(...args);
    this.id = nextId$1++;
    this.key = void 0;
    this._priority = 0;
  }
  get priority() {
    return this._priority;
  }
  set priority(priority2) {
    if (this._priority != priority2) {
      this._priority = priority2;
      this._onPriorityChange(priority2);
    }
  }
  get() {
    const node = getAnimated(this);
    return node && node.getValue();
  }
  to(...args) {
    return globals.to(this, args);
  }
  interpolate(...args) {
    deprecateInterpolate();
    return globals.to(this, args);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(count) {
    if (count == 1)
      this._attach();
  }
  observerRemoved(count) {
    if (count == 0)
      this._detach();
  }
  _attach() {
  }
  _detach() {
  }
  _onChange(value, idle = false) {
    callFluidObservers(this, {
      type: "change",
      parent: this,
      value,
      idle
    });
  }
  _onPriorityChange(priority2) {
    if (!this.idle) {
      frameLoop.sort(this);
    }
    callFluidObservers(this, {
      type: "priority",
      parent: this,
      priority: priority2
    });
  }
};
var $P = Symbol.for("SpringPhase");
var HAS_ANIMATED = 1;
var IS_ANIMATING = 2;
var IS_PAUSED = 4;
var hasAnimated = (target) => (target[$P] & HAS_ANIMATED) > 0;
var isAnimating = (target) => (target[$P] & IS_ANIMATING) > 0;
var isPaused = (target) => (target[$P] & IS_PAUSED) > 0;
var setActiveBit = (target, active) => active ? target[$P] |= IS_ANIMATING | HAS_ANIMATED : target[$P] &= ~IS_ANIMATING;
var setPausedBit = (target, paused) => paused ? target[$P] |= IS_PAUSED : target[$P] &= ~IS_PAUSED;
var SpringValue = class extends FrameValue {
  constructor(arg1, arg2) {
    super();
    this.key = void 0;
    this.animation = new Animation();
    this.queue = void 0;
    this.defaultProps = {};
    this._state = {
      paused: false,
      delayed: false,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    };
    this._pendingCalls = /* @__PURE__ */ new Set();
    this._lastCallId = 0;
    this._lastToId = 0;
    this._memoizedDuration = 0;
    if (!is.und(arg1) || !is.und(arg2)) {
      const props = is.obj(arg1) ? _extends3({}, arg1) : _extends3({}, arg2, {
        from: arg1
      });
      if (is.und(props.default)) {
        props.default = true;
      }
      this.start(props);
    }
  }
  get idle() {
    return !(isAnimating(this) || this._state.asyncTo) || isPaused(this);
  }
  get goal() {
    return getFluidValue(this.animation.to);
  }
  get velocity() {
    const node = getAnimated(this);
    return node instanceof AnimatedValue ? node.lastVelocity || 0 : node.getPayload().map((node2) => node2.lastVelocity || 0);
  }
  get hasAnimated() {
    return hasAnimated(this);
  }
  get isAnimating() {
    return isAnimating(this);
  }
  get isPaused() {
    return isPaused(this);
  }
  get isDelayed() {
    return this._state.delayed;
  }
  advance(dt) {
    let idle = true;
    let changed = false;
    const anim = this.animation;
    let {
      config: config2,
      toValues
    } = anim;
    const payload = getPayload(anim.to);
    if (!payload && hasFluidValue(anim.to)) {
      toValues = toArray(getFluidValue(anim.to));
    }
    anim.values.forEach((node2, i3) => {
      if (node2.done)
        return;
      const to3 = node2.constructor == AnimatedString ? 1 : payload ? payload[i3].lastPosition : toValues[i3];
      let finished = anim.immediate;
      let position = to3;
      if (!finished) {
        position = node2.lastPosition;
        if (config2.tension <= 0) {
          node2.done = true;
          return;
        }
        let elapsed = node2.elapsedTime += dt;
        const from = anim.fromValues[i3];
        const v0 = node2.v0 != null ? node2.v0 : node2.v0 = is.arr(config2.velocity) ? config2.velocity[i3] : config2.velocity;
        let velocity;
        if (!is.und(config2.duration)) {
          let p3 = 1;
          if (config2.duration > 0) {
            if (this._memoizedDuration !== config2.duration) {
              this._memoizedDuration = config2.duration;
              if (node2.durationProgress > 0) {
                node2.elapsedTime = config2.duration * node2.durationProgress;
                elapsed = node2.elapsedTime += dt;
              }
            }
            p3 = (config2.progress || 0) + elapsed / this._memoizedDuration;
            p3 = p3 > 1 ? 1 : p3 < 0 ? 0 : p3;
            node2.durationProgress = p3;
          }
          position = from + config2.easing(p3) * (to3 - from);
          velocity = (position - node2.lastPosition) / dt;
          finished = p3 == 1;
        } else if (config2.decay) {
          const decay = config2.decay === true ? 0.998 : config2.decay;
          const e6 = Math.exp(-(1 - decay) * elapsed);
          position = from + v0 / (1 - decay) * (1 - e6);
          finished = Math.abs(node2.lastPosition - position) < 0.1;
          velocity = v0 * e6;
        } else {
          velocity = node2.lastVelocity == null ? v0 : node2.lastVelocity;
          const precision = config2.precision || (from == to3 ? 5e-3 : Math.min(1, Math.abs(to3 - from) * 1e-3));
          const restVelocity = config2.restVelocity || precision / 10;
          const bounceFactor = config2.clamp ? 0 : config2.bounce;
          const canBounce = !is.und(bounceFactor);
          const isGrowing = from == to3 ? node2.v0 > 0 : from < to3;
          let isMoving;
          let isBouncing = false;
          const step = 1;
          const numSteps = Math.ceil(dt / step);
          for (let n3 = 0; n3 < numSteps; ++n3) {
            isMoving = Math.abs(velocity) > restVelocity;
            if (!isMoving) {
              finished = Math.abs(to3 - position) <= precision;
              if (finished) {
                break;
              }
            }
            if (canBounce) {
              isBouncing = position == to3 || position > to3 == isGrowing;
              if (isBouncing) {
                velocity = -velocity * bounceFactor;
                position = to3;
              }
            }
            const springForce = -config2.tension * 1e-6 * (position - to3);
            const dampingForce = -config2.friction * 1e-3 * velocity;
            const acceleration = (springForce + dampingForce) / config2.mass;
            velocity = velocity + acceleration * step;
            position = position + velocity * step;
          }
        }
        node2.lastVelocity = velocity;
        if (Number.isNaN(position)) {
          console.warn(`Got NaN while animating:`, this);
          finished = true;
        }
      }
      if (payload && !payload[i3].done) {
        finished = false;
      }
      if (finished) {
        node2.done = true;
      } else {
        idle = false;
      }
      if (node2.setValue(position, config2.round)) {
        changed = true;
      }
    });
    const node = getAnimated(this);
    const currVal = node.getValue();
    if (idle) {
      const finalVal = getFluidValue(anim.to);
      if ((currVal !== finalVal || changed) && !config2.decay) {
        node.setValue(finalVal);
        this._onChange(finalVal);
      } else if (changed && config2.decay) {
        this._onChange(currVal);
      }
      this._stop();
    } else if (changed) {
      this._onChange(currVal);
    }
  }
  set(value) {
    raf.batchedUpdates(() => {
      this._stop();
      this._focus(value);
      this._set(value);
    });
    return this;
  }
  pause() {
    this._update({
      pause: true
    });
  }
  resume() {
    this._update({
      pause: false
    });
  }
  finish() {
    if (isAnimating(this)) {
      const {
        to: to3,
        config: config2
      } = this.animation;
      raf.batchedUpdates(() => {
        this._onStart();
        if (!config2.decay) {
          this._set(to3, false);
        }
        this._stop();
      });
    }
    return this;
  }
  update(props) {
    const queue = this.queue || (this.queue = []);
    queue.push(props);
    return this;
  }
  start(to3, arg2) {
    let queue;
    if (!is.und(to3)) {
      queue = [is.obj(to3) ? to3 : _extends3({}, arg2, {
        to: to3
      })];
    } else {
      queue = this.queue || [];
      this.queue = [];
    }
    return Promise.all(queue.map((props) => {
      const up = this._update(props);
      return up;
    })).then((results) => getCombinedResult(this, results));
  }
  stop(cancel) {
    const {
      to: to3
    } = this.animation;
    this._focus(this.get());
    stopAsync(this._state, cancel && this._lastCallId);
    raf.batchedUpdates(() => this._stop(to3, cancel));
    return this;
  }
  reset() {
    this._update({
      reset: true
    });
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._start();
    } else if (event.type == "priority") {
      this.priority = event.priority + 1;
    }
  }
  _prepareNode(props) {
    const key = this.key || "";
    let {
      to: to3,
      from
    } = props;
    to3 = is.obj(to3) ? to3[key] : to3;
    if (to3 == null || isAsyncTo(to3)) {
      to3 = void 0;
    }
    from = is.obj(from) ? from[key] : from;
    if (from == null) {
      from = void 0;
    }
    const range = {
      to: to3,
      from
    };
    if (!hasAnimated(this)) {
      if (props.reverse)
        [to3, from] = [from, to3];
      from = getFluidValue(from);
      if (!is.und(from)) {
        this._set(from);
      } else if (!getAnimated(this)) {
        this._set(to3);
      }
    }
    return range;
  }
  _update(_ref, isLoop) {
    let props = _extends3({}, _ref);
    const {
      key,
      defaultProps
    } = this;
    if (props.default)
      Object.assign(defaultProps, getDefaultProps(props, (value, prop) => /^on/.test(prop) ? resolveProp(value, key) : value));
    mergeActiveFn(this, props, "onProps");
    sendEvent(this, "onProps", props, this);
    const range = this._prepareNode(props);
    if (Object.isFrozen(this)) {
      throw Error("Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?");
    }
    const state = this._state;
    return scheduleProps(++this._lastCallId, {
      key,
      props,
      defaultProps,
      state,
      actions: {
        pause: () => {
          if (!isPaused(this)) {
            setPausedBit(this, true);
            flushCalls(state.pauseQueue);
            sendEvent(this, "onPause", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
          }
        },
        resume: () => {
          if (isPaused(this)) {
            setPausedBit(this, false);
            if (isAnimating(this)) {
              this._resume();
            }
            flushCalls(state.resumeQueue);
            sendEvent(this, "onResume", getFinishedResult(this, checkFinished(this, this.animation.to)), this);
          }
        },
        start: this._merge.bind(this, range)
      }
    }).then((result) => {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        const nextProps = createLoopUpdate(props);
        if (nextProps) {
          return this._update(nextProps, true);
        }
      }
      return result;
    });
  }
  _merge(range, props, resolve) {
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }
    const hasToProp = !is.und(range.to);
    const hasFromProp = !is.und(range.from);
    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }
    const {
      key,
      defaultProps,
      animation: anim
    } = this;
    const {
      to: prevTo,
      from: prevFrom
    } = anim;
    let {
      to: to3 = prevTo,
      from = prevFrom
    } = range;
    if (hasFromProp && !hasToProp && (!props.default || is.und(to3))) {
      to3 = from;
    }
    if (props.reverse)
      [to3, from] = [from, to3];
    const hasFromChanged = !isEqual(from, prevFrom);
    if (hasFromChanged) {
      anim.from = from;
    }
    from = getFluidValue(from);
    const hasToChanged = !isEqual(to3, prevTo);
    if (hasToChanged) {
      this._focus(to3);
    }
    const hasAsyncTo = isAsyncTo(props.to);
    const {
      config: config2
    } = anim;
    const {
      decay,
      velocity
    } = config2;
    if (hasToProp || hasFromProp) {
      config2.velocity = 0;
    }
    if (props.config && !hasAsyncTo) {
      mergeConfig(config2, callProp(props.config, key), props.config !== defaultProps.config ? callProp(defaultProps.config, key) : void 0);
    }
    let node = getAnimated(this);
    if (!node || is.und(to3)) {
      return resolve(getFinishedResult(this, true));
    }
    const reset = is.und(props.reset) ? hasFromProp && !props.default : !is.und(from) && matchProp(props.reset, key);
    const value = reset ? from : this.get();
    const goal = computeGoal(to3);
    const isAnimatable = is.num(goal) || is.arr(goal) || isAnimatedString(goal);
    const immediate = !hasAsyncTo && (!isAnimatable || matchProp(defaultProps.immediate || props.immediate, key));
    if (hasToChanged) {
      const nodeType = getAnimatedType(to3);
      if (nodeType !== node.constructor) {
        if (immediate) {
          node = this._set(goal);
        } else
          throw Error(`Cannot animate between ${node.constructor.name} and ${nodeType.name}, as the "to" prop suggests`);
      }
    }
    const goalType = node.constructor;
    let started = hasFluidValue(to3);
    let finished = false;
    if (!started) {
      const hasValueChanged = reset || !hasAnimated(this) && hasFromChanged;
      if (hasToChanged || hasValueChanged) {
        finished = isEqual(computeGoal(value), goal);
        started = !finished;
      }
      if (!isEqual(anim.immediate, immediate) && !immediate || !isEqual(config2.decay, decay) || !isEqual(config2.velocity, velocity)) {
        started = true;
      }
    }
    if (finished && isAnimating(this)) {
      if (anim.changed && !reset) {
        started = true;
      } else if (!started) {
        this._stop(prevTo);
      }
    }
    if (!hasAsyncTo) {
      if (started || hasFluidValue(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = hasFluidValue(to3) ? null : goalType == AnimatedString ? [1] : toArray(goal);
      }
      if (anim.immediate != immediate) {
        anim.immediate = immediate;
        if (!immediate && !reset) {
          this._set(prevTo);
        }
      }
      if (started) {
        const {
          onRest
        } = anim;
        each(ACTIVE_EVENTS, (type) => mergeActiveFn(this, props, type));
        const result = getFinishedResult(this, checkFinished(this, prevTo));
        flushCalls(this._pendingCalls, result);
        this._pendingCalls.add(resolve);
        if (anim.changed)
          raf.batchedUpdates(() => {
            anim.changed = !reset;
            onRest == null ? void 0 : onRest(result, this);
            if (reset) {
              callProp(defaultProps.onRest, result);
            } else {
              anim.onStart == null ? void 0 : anim.onStart(result, this);
            }
          });
      }
    }
    if (reset) {
      this._set(value);
    }
    if (hasAsyncTo) {
      resolve(runAsync(props.to, props, this._state, this));
    } else if (started) {
      this._start();
    } else if (isAnimating(this) && !hasToChanged) {
      this._pendingCalls.add(resolve);
    } else {
      resolve(getNoopResult(value));
    }
  }
  _focus(value) {
    const anim = this.animation;
    if (value !== anim.to) {
      if (getFluidObservers(this)) {
        this._detach();
      }
      anim.to = value;
      if (getFluidObservers(this)) {
        this._attach();
      }
    }
  }
  _attach() {
    let priority2 = 0;
    const {
      to: to3
    } = this.animation;
    if (hasFluidValue(to3)) {
      addFluidObserver(to3, this);
      if (isFrameValue(to3)) {
        priority2 = to3.priority + 1;
      }
    }
    this.priority = priority2;
  }
  _detach() {
    const {
      to: to3
    } = this.animation;
    if (hasFluidValue(to3)) {
      removeFluidObserver(to3, this);
    }
  }
  _set(arg, idle = true) {
    const value = getFluidValue(arg);
    if (!is.und(value)) {
      const oldNode = getAnimated(this);
      if (!oldNode || !isEqual(value, oldNode.getValue())) {
        const nodeType = getAnimatedType(value);
        if (!oldNode || oldNode.constructor != nodeType) {
          setAnimated(this, nodeType.create(value));
        } else {
          oldNode.setValue(value);
        }
        if (oldNode) {
          raf.batchedUpdates(() => {
            this._onChange(value, idle);
          });
        }
      }
    }
    return getAnimated(this);
  }
  _onStart() {
    const anim = this.animation;
    if (!anim.changed) {
      anim.changed = true;
      sendEvent(this, "onStart", getFinishedResult(this, checkFinished(this, anim.to)), this);
    }
  }
  _onChange(value, idle) {
    if (!idle) {
      this._onStart();
      callProp(this.animation.onChange, value, this);
    }
    callProp(this.defaultProps.onChange, value, this);
    super._onChange(value, idle);
  }
  _start() {
    const anim = this.animation;
    getAnimated(this).reset(getFluidValue(anim.to));
    if (!anim.immediate) {
      anim.fromValues = anim.values.map((node) => node.lastPosition);
    }
    if (!isAnimating(this)) {
      setActiveBit(this, true);
      if (!isPaused(this)) {
        this._resume();
      }
    }
  }
  _resume() {
    if (globals.skipAnimation) {
      this.finish();
    } else {
      frameLoop.start(this);
    }
  }
  _stop(goal, cancel) {
    if (isAnimating(this)) {
      setActiveBit(this, false);
      const anim = this.animation;
      each(anim.values, (node) => {
        node.done = true;
      });
      if (anim.toValues) {
        anim.onChange = anim.onPause = anim.onResume = void 0;
      }
      callFluidObservers(this, {
        type: "idle",
        parent: this
      });
      const result = cancel ? getCancelledResult(this.get()) : getFinishedResult(this.get(), checkFinished(this, goal != null ? goal : anim.to));
      flushCalls(this._pendingCalls, result);
      if (anim.changed) {
        anim.changed = false;
        sendEvent(this, "onRest", result, this);
      }
    }
  }
};
function checkFinished(target, to3) {
  const goal = computeGoal(to3);
  const value = computeGoal(target.get());
  return isEqual(value, goal);
}
function createLoopUpdate(props, loop2 = props.loop, to3 = props.to) {
  let loopRet = callProp(loop2);
  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate(_extends3({}, props, {
      loop: loop2,
      default: false,
      pause: void 0,
      to: !reverse || isAsyncTo(to3) ? to3 : void 0,
      from: reset ? props.from : void 0,
      reset
    }, overrides));
  }
}
function createUpdate(props) {
  const {
    to: to3,
    from
  } = props = inferTo(props);
  const keys = /* @__PURE__ */ new Set();
  if (is.obj(to3))
    findDefined(to3, keys);
  if (is.obj(from))
    findDefined(from, keys);
  props.keys = keys.size ? Array.from(keys) : null;
  return props;
}
function declareUpdate(props) {
  const update3 = createUpdate(props);
  if (is.und(update3.default)) {
    update3.default = getDefaultProps(update3);
  }
  return update3;
}
function findDefined(values, keys) {
  eachProp(values, (value, key) => value != null && keys.add(key));
}
var ACTIVE_EVENTS = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function mergeActiveFn(target, props, type) {
  target.animation[type] = props[type] !== getDefaultProp(props, type) ? resolveProp(props[type], target.key) : void 0;
}
function sendEvent(target, type, ...args) {
  var _target$animation$typ, _target$animation, _target$defaultProps$, _target$defaultProps;
  (_target$animation$typ = (_target$animation = target.animation)[type]) == null ? void 0 : _target$animation$typ.call(_target$animation, ...args);
  (_target$defaultProps$ = (_target$defaultProps = target.defaultProps)[type]) == null ? void 0 : _target$defaultProps$.call(_target$defaultProps, ...args);
}
var BATCHED_EVENTS = ["onStart", "onChange", "onRest"];
var nextId = 1;
var Controller = class {
  constructor(props, flush2) {
    this.id = nextId++;
    this.springs = {};
    this.queue = [];
    this.ref = void 0;
    this._flush = void 0;
    this._initialProps = void 0;
    this._lastAsyncId = 0;
    this._active = /* @__PURE__ */ new Set();
    this._changed = /* @__PURE__ */ new Set();
    this._started = false;
    this._item = void 0;
    this._state = {
      paused: false,
      pauseQueue: /* @__PURE__ */ new Set(),
      resumeQueue: /* @__PURE__ */ new Set(),
      timeouts: /* @__PURE__ */ new Set()
    };
    this._events = {
      onStart: /* @__PURE__ */ new Map(),
      onChange: /* @__PURE__ */ new Map(),
      onRest: /* @__PURE__ */ new Map()
    };
    this._onFrame = this._onFrame.bind(this);
    if (flush2) {
      this._flush = flush2;
    }
    if (props) {
      this.start(_extends3({
        default: true
      }, props));
    }
  }
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every((spring) => {
      return spring.idle && !spring.isDelayed && !spring.isPaused;
    });
  }
  get item() {
    return this._item;
  }
  set item(item) {
    this._item = item;
  }
  get() {
    const values = {};
    this.each((spring, key) => values[key] = spring.get());
    return values;
  }
  set(values) {
    for (const key in values) {
      const value = values[key];
      if (!is.und(value)) {
        this.springs[key].set(value);
      }
    }
  }
  update(props) {
    if (props) {
      this.queue.push(createUpdate(props));
    }
    return this;
  }
  start(props) {
    let {
      queue
    } = this;
    if (props) {
      queue = toArray(props).map(createUpdate);
    } else {
      this.queue = [];
    }
    if (this._flush) {
      return this._flush(this, queue);
    }
    prepareKeys(this, queue);
    return flushUpdateQueue(this, queue);
  }
  stop(arg, keys) {
    if (arg !== !!arg) {
      keys = arg;
    }
    if (keys) {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].stop(!!arg));
    } else {
      stopAsync(this._state, this._lastAsyncId);
      this.each((spring) => spring.stop(!!arg));
    }
    return this;
  }
  pause(keys) {
    if (is.und(keys)) {
      this.start({
        pause: true
      });
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].pause());
    }
    return this;
  }
  resume(keys) {
    if (is.und(keys)) {
      this.start({
        pause: false
      });
    } else {
      const springs = this.springs;
      each(toArray(keys), (key) => springs[key].resume());
    }
    return this;
  }
  each(iterator) {
    eachProp(this.springs, iterator);
  }
  _onFrame() {
    const {
      onStart,
      onChange,
      onRest
    } = this._events;
    const active = this._active.size > 0;
    const changed = this._changed.size > 0;
    if (active && !this._started || changed && !this._started) {
      this._started = true;
      flush(onStart, ([onStart2, result]) => {
        result.value = this.get();
        onStart2(result, this, this._item);
      });
    }
    const idle = !active && this._started;
    const values = changed || idle && onRest.size ? this.get() : null;
    if (changed && onChange.size) {
      flush(onChange, ([onChange2, result]) => {
        result.value = values;
        onChange2(result, this, this._item);
      });
    }
    if (idle) {
      this._started = false;
      flush(onRest, ([onRest2, result]) => {
        result.value = values;
        onRest2(result, this, this._item);
      });
    }
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._changed.add(event.parent);
      if (!event.idle) {
        this._active.add(event.parent);
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else
      return;
    raf.onFrame(this._onFrame);
  }
};
function flushUpdateQueue(ctrl, queue) {
  return Promise.all(queue.map((props) => flushUpdate(ctrl, props))).then((results) => getCombinedResult(ctrl, results));
}
async function flushUpdate(ctrl, props, isLoop) {
  const {
    keys,
    to: to3,
    from,
    loop: loop2,
    onRest,
    onResolve
  } = props;
  const defaults2 = is.obj(props.default) && props.default;
  if (loop2) {
    props.loop = false;
  }
  if (to3 === false)
    props.to = null;
  if (from === false)
    props.from = null;
  const asyncTo = is.arr(to3) || is.fun(to3) ? to3 : void 0;
  if (asyncTo) {
    props.to = void 0;
    props.onRest = void 0;
    if (defaults2) {
      defaults2.onRest = void 0;
    }
  } else {
    each(BATCHED_EVENTS, (key) => {
      const handler = props[key];
      if (is.fun(handler)) {
        const queue = ctrl["_events"][key];
        props[key] = ({
          finished,
          cancelled
        }) => {
          const result2 = queue.get(handler);
          if (result2) {
            if (!finished)
              result2.finished = false;
            if (cancelled)
              result2.cancelled = true;
          } else {
            queue.set(handler, {
              value: null,
              finished: finished || false,
              cancelled: cancelled || false
            });
          }
        };
        if (defaults2) {
          defaults2[key] = props[key];
        }
      }
    });
  }
  const state = ctrl["_state"];
  if (props.pause === !state.paused) {
    state.paused = props.pause;
    flushCalls(props.pause ? state.pauseQueue : state.resumeQueue);
  } else if (state.paused) {
    props.pause = true;
  }
  const promises = (keys || Object.keys(ctrl.springs)).map((key) => ctrl.springs[key].start(props));
  const cancel = props.cancel === true || getDefaultProp(props, "cancel") === true;
  if (asyncTo || cancel && state.asyncId) {
    promises.push(scheduleProps(++ctrl["_lastAsyncId"], {
      props,
      state,
      actions: {
        pause: noop,
        resume: noop,
        start(props2, resolve) {
          if (cancel) {
            stopAsync(state, ctrl["_lastAsyncId"]);
            resolve(getCancelledResult(ctrl));
          } else {
            props2.onRest = onRest;
            resolve(runAsync(asyncTo, props2, state, ctrl));
          }
        }
      }
    }));
  }
  if (state.paused) {
    await new Promise((resume) => {
      state.resumeQueue.add(resume);
    });
  }
  const result = getCombinedResult(ctrl, await Promise.all(promises));
  if (loop2 && result.finished && !(isLoop && result.noop)) {
    const nextProps = createLoopUpdate(props, loop2, to3);
    if (nextProps) {
      prepareKeys(ctrl, [nextProps]);
      return flushUpdate(ctrl, nextProps, true);
    }
  }
  if (onResolve) {
    raf.batchedUpdates(() => onResolve(result, ctrl, ctrl.item));
  }
  return result;
}
function getSprings(ctrl, props) {
  const springs = _extends3({}, ctrl.springs);
  if (props) {
    each(toArray(props), (props2) => {
      if (is.und(props2.keys)) {
        props2 = createUpdate(props2);
      }
      if (!is.obj(props2.to)) {
        props2 = _extends3({}, props2, {
          to: void 0
        });
      }
      prepareSprings(springs, props2, (key) => {
        return createSpring(key);
      });
    });
  }
  setSprings(ctrl, springs);
  return springs;
}
function setSprings(ctrl, springs) {
  eachProp(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      addFluidObserver(spring, ctrl);
    }
  });
}
function createSpring(key, observer) {
  const spring = new SpringValue();
  spring.key = key;
  if (observer) {
    addFluidObserver(spring, observer);
  }
  return spring;
}
function prepareSprings(springs, props, create) {
  if (props.keys) {
    each(props.keys, (key) => {
      const spring = springs[key] || (springs[key] = create(key));
      spring["_prepareNode"](props);
    });
  }
}
function prepareKeys(ctrl, queue) {
  each(queue, (props) => {
    prepareSprings(ctrl.springs, props, (key) => {
      return createSpring(key, ctrl);
    });
  });
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i3;
  for (i3 = 0; i3 < sourceKeys.length; i3++) {
    key = sourceKeys[i3];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var _excluded$3 = ["children"];
var SpringContext = (_ref) => {
  let {
    children
  } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  const inherited = (0, import_react3.useContext)(ctx);
  const pause = props.pause || !!inherited.pause, immediate = props.immediate || !!inherited.immediate;
  props = useMemoOne(() => ({
    pause,
    immediate
  }), [pause, immediate]);
  const {
    Provider
  } = ctx;
  return React3.createElement(Provider, {
    value: props
  }, children);
};
var ctx = makeContext(SpringContext, {});
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;
function makeContext(target, init) {
  Object.assign(target, React3.createContext(init));
  target.Provider._context = target;
  target.Consumer._context = target;
  return target;
}
var SpringRef = () => {
  const current = [];
  const SpringRef2 = function SpringRef3(props) {
    deprecateDirectCall();
    const results = [];
    each(current, (ctrl, i3) => {
      if (is.und(props)) {
        results.push(ctrl.start());
      } else {
        const update3 = _getProps(props, ctrl, i3);
        if (update3) {
          results.push(ctrl.start(update3));
        }
      }
    });
    return results;
  };
  SpringRef2.current = current;
  SpringRef2.add = function(ctrl) {
    if (!current.includes(ctrl)) {
      current.push(ctrl);
    }
  };
  SpringRef2.delete = function(ctrl) {
    const i3 = current.indexOf(ctrl);
    if (~i3)
      current.splice(i3, 1);
  };
  SpringRef2.pause = function() {
    each(current, (ctrl) => ctrl.pause(...arguments));
    return this;
  };
  SpringRef2.resume = function() {
    each(current, (ctrl) => ctrl.resume(...arguments));
    return this;
  };
  SpringRef2.set = function(values) {
    each(current, (ctrl) => ctrl.set(values));
  };
  SpringRef2.start = function(props) {
    const results = [];
    each(current, (ctrl, i3) => {
      if (is.und(props)) {
        results.push(ctrl.start());
      } else {
        const update3 = this._getProps(props, ctrl, i3);
        if (update3) {
          results.push(ctrl.start(update3));
        }
      }
    });
    return results;
  };
  SpringRef2.stop = function() {
    each(current, (ctrl) => ctrl.stop(...arguments));
    return this;
  };
  SpringRef2.update = function(props) {
    each(current, (ctrl, i3) => ctrl.update(this._getProps(props, ctrl, i3)));
    return this;
  };
  const _getProps = function _getProps2(arg, ctrl, index) {
    return is.fun(arg) ? arg(index, ctrl) : arg;
  };
  SpringRef2._getProps = _getProps;
  return SpringRef2;
};
function useSprings(length, props, deps) {
  const propsFn = is.fun(props) && props;
  if (propsFn && !deps)
    deps = [];
  const ref = (0, import_react3.useMemo)(() => propsFn || arguments.length == 3 ? SpringRef() : void 0, []);
  const layoutId = (0, import_react3.useRef)(0);
  const forceUpdate = useForceUpdate();
  const state = (0, import_react3.useMemo)(() => ({
    ctrls: [],
    queue: [],
    flush(ctrl, updates2) {
      const springs2 = getSprings(ctrl, updates2);
      const canFlushSync = layoutId.current > 0 && !state.queue.length && !Object.keys(springs2).some((key) => !ctrl.springs[key]);
      return canFlushSync ? flushUpdateQueue(ctrl, updates2) : new Promise((resolve) => {
        setSprings(ctrl, springs2);
        state.queue.push(() => {
          resolve(flushUpdateQueue(ctrl, updates2));
        });
        forceUpdate();
      });
    }
  }), []);
  const ctrls = (0, import_react3.useRef)([...state.ctrls]);
  const updates = [];
  const prevLength = usePrev(length) || 0;
  (0, import_react3.useMemo)(() => {
    each(ctrls.current.slice(length, prevLength), (ctrl) => {
      detachRefs(ctrl, ref);
      ctrl.stop(true);
    });
    ctrls.current.length = length;
    declareUpdates(prevLength, length);
  }, [length]);
  (0, import_react3.useMemo)(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);
  function declareUpdates(startIndex, endIndex) {
    for (let i3 = startIndex; i3 < endIndex; i3++) {
      const ctrl = ctrls.current[i3] || (ctrls.current[i3] = new Controller(null, state.flush));
      const update3 = propsFn ? propsFn(i3, ctrl) : props[i3];
      if (update3) {
        updates[i3] = declareUpdate(update3);
      }
    }
  }
  const springs = ctrls.current.map((ctrl, i3) => getSprings(ctrl, updates[i3]));
  const context = (0, import_react3.useContext)(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useLayoutEffect2(() => {
    layoutId.current++;
    state.ctrls = ctrls.current;
    const {
      queue
    } = state;
    if (queue.length) {
      state.queue = [];
      each(queue, (cb) => cb());
    }
    each(ctrls.current, (ctrl, i3) => {
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext) {
        ctrl.start({
          default: context
        });
      }
      const update3 = updates[i3];
      if (update3) {
        replaceRef(ctrl, update3.ref);
        if (ctrl.ref) {
          ctrl.queue.push(update3);
        } else {
          ctrl.start(update3);
        }
      }
    });
  });
  useOnce(() => () => {
    each(state.ctrls, (ctrl) => ctrl.stop(true));
  });
  const values = springs.map((x5) => _extends3({}, x5));
  return ref ? [values, ref] : values;
}
function useSpring(props, deps) {
  const isFn = is.fun(props);
  const [[values], ref] = useSprings(1, isFn ? props : [props], isFn ? deps || [] : deps);
  return isFn || arguments.length == 2 ? [values, ref] : values;
}
var TransitionPhase;
(function(TransitionPhase2) {
  TransitionPhase2["MOUNT"] = "mount";
  TransitionPhase2["ENTER"] = "enter";
  TransitionPhase2["UPDATE"] = "update";
  TransitionPhase2["LEAVE"] = "leave";
})(TransitionPhase || (TransitionPhase = {}));
function useTransition(data, props, deps) {
  const propsFn = is.fun(props) && props;
  const {
    reset,
    sort,
    trail = 0,
    expires = true,
    exitBeforeEnter = false,
    onDestroyed,
    ref: propsRef,
    config: propsConfig
  } = propsFn ? propsFn() : props;
  const ref = (0, import_react3.useMemo)(() => propsFn || arguments.length == 3 ? SpringRef() : void 0, []);
  const items = toArray(data);
  const transitions = [];
  const usedTransitions = (0, import_react3.useRef)(null);
  const prevTransitions = reset ? null : usedTransitions.current;
  useLayoutEffect2(() => {
    usedTransitions.current = transitions;
  });
  useOnce(() => {
    each(usedTransitions.current, (t5) => {
      var _t$ctrl$ref;
      (_t$ctrl$ref = t5.ctrl.ref) == null ? void 0 : _t$ctrl$ref.add(t5.ctrl);
      const change = changes.get(t5);
      if (change) {
        t5.ctrl.start(change.payload);
      }
    });
    return () => {
      each(usedTransitions.current, (t5) => {
        if (t5.expired) {
          clearTimeout(t5.expirationId);
        }
        detachRefs(t5.ctrl, ref);
        t5.ctrl.stop(true);
      });
    };
  });
  const keys = getKeys(items, propsFn ? propsFn() : props, prevTransitions);
  const expired = reset && usedTransitions.current || [];
  useLayoutEffect2(() => each(expired, ({
    ctrl,
    item,
    key
  }) => {
    detachRefs(ctrl, ref);
    callProp(onDestroyed, item, key);
  }));
  const reused = [];
  if (prevTransitions)
    each(prevTransitions, (t5, i3) => {
      if (t5.expired) {
        clearTimeout(t5.expirationId);
        expired.push(t5);
      } else {
        i3 = reused[i3] = keys.indexOf(t5.key);
        if (~i3)
          transitions[i3] = t5;
      }
    });
  each(items, (item, i3) => {
    if (!transitions[i3]) {
      transitions[i3] = {
        key: keys[i3],
        item,
        phase: TransitionPhase.MOUNT,
        ctrl: new Controller()
      };
      transitions[i3].ctrl.item = item;
    }
  });
  if (reused.length) {
    let i3 = -1;
    const {
      leave
    } = propsFn ? propsFn() : props;
    each(reused, (keyIndex, prevIndex) => {
      const t5 = prevTransitions[prevIndex];
      if (~keyIndex) {
        i3 = transitions.indexOf(t5);
        transitions[i3] = _extends3({}, t5, {
          item: items[keyIndex]
        });
      } else if (leave) {
        transitions.splice(++i3, 0, t5);
      }
    });
  }
  if (is.fun(sort)) {
    transitions.sort((a3, b4) => sort(a3.item, b4.item));
  }
  let delay = -trail;
  const forceUpdate = useForceUpdate();
  const defaultProps = getDefaultProps(props);
  const changes = /* @__PURE__ */ new Map();
  const exitingTransitions = (0, import_react3.useRef)(/* @__PURE__ */ new Map());
  const forceChange = (0, import_react3.useRef)(false);
  each(transitions, (t5, i3) => {
    const key = t5.key;
    const prevPhase = t5.phase;
    const p3 = propsFn ? propsFn() : props;
    let to3;
    let phase;
    let propsDelay = callProp(p3.delay || 0, key);
    if (prevPhase == TransitionPhase.MOUNT) {
      to3 = p3.enter;
      phase = TransitionPhase.ENTER;
    } else {
      const isLeave = keys.indexOf(key) < 0;
      if (prevPhase != TransitionPhase.LEAVE) {
        if (isLeave) {
          to3 = p3.leave;
          phase = TransitionPhase.LEAVE;
        } else if (to3 = p3.update) {
          phase = TransitionPhase.UPDATE;
        } else
          return;
      } else if (!isLeave) {
        to3 = p3.enter;
        phase = TransitionPhase.ENTER;
      } else
        return;
    }
    to3 = callProp(to3, t5.item, i3);
    to3 = is.obj(to3) ? inferTo(to3) : {
      to: to3
    };
    if (!to3.config) {
      const config2 = propsConfig || defaultProps.config;
      to3.config = callProp(config2, t5.item, i3, phase);
    }
    delay += trail;
    const payload = _extends3({}, defaultProps, {
      delay: propsDelay + delay,
      ref: propsRef,
      immediate: p3.immediate,
      reset: false
    }, to3);
    if (phase == TransitionPhase.ENTER && is.und(payload.from)) {
      const _p = propsFn ? propsFn() : props;
      const from = is.und(_p.initial) || prevTransitions ? _p.from : _p.initial;
      payload.from = callProp(from, t5.item, i3);
    }
    const {
      onResolve
    } = payload;
    payload.onResolve = (result) => {
      callProp(onResolve, result);
      const transitions2 = usedTransitions.current;
      const t6 = transitions2.find((t7) => t7.key === key);
      if (!t6)
        return;
      if (result.cancelled && t6.phase != TransitionPhase.UPDATE) {
        return;
      }
      if (t6.ctrl.idle) {
        const idle = transitions2.every((t7) => t7.ctrl.idle);
        if (t6.phase == TransitionPhase.LEAVE) {
          const expiry = callProp(expires, t6.item);
          if (expiry !== false) {
            const expiryMs = expiry === true ? 0 : expiry;
            t6.expired = true;
            if (!idle && expiryMs > 0) {
              if (expiryMs <= 2147483647)
                t6.expirationId = setTimeout(forceUpdate, expiryMs);
              return;
            }
          }
        }
        if (idle && transitions2.some((t7) => t7.expired)) {
          exitingTransitions.current.delete(t6);
          if (exitBeforeEnter) {
            forceChange.current = true;
          }
          forceUpdate();
        }
      }
    };
    const springs = getSprings(t5.ctrl, payload);
    if (phase === TransitionPhase.LEAVE && exitBeforeEnter) {
      exitingTransitions.current.set(t5, {
        phase,
        springs,
        payload
      });
    } else {
      changes.set(t5, {
        phase,
        springs,
        payload
      });
    }
  });
  const context = (0, import_react3.useContext)(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);
  useLayoutEffect2(() => {
    if (hasContext) {
      each(transitions, (t5) => {
        t5.ctrl.start({
          default: context
        });
      });
    }
  }, [context]);
  each(changes, (_, t5) => {
    if (exitingTransitions.current.size) {
      const ind = transitions.findIndex((state) => state.key === t5.key);
      transitions.splice(ind, 1);
    }
  });
  useLayoutEffect2(() => {
    each(exitingTransitions.current.size ? exitingTransitions.current : changes, ({
      phase,
      payload
    }, t5) => {
      const {
        ctrl
      } = t5;
      t5.phase = phase;
      ref == null ? void 0 : ref.add(ctrl);
      if (hasContext && phase == TransitionPhase.ENTER) {
        ctrl.start({
          default: context
        });
      }
      if (payload) {
        replaceRef(ctrl, payload.ref);
        if (ctrl.ref && !forceChange.current) {
          ctrl.update(payload);
        } else {
          ctrl.start(payload);
          if (forceChange.current) {
            forceChange.current = false;
          }
        }
      }
    });
  }, reset ? void 0 : deps);
  const renderTransitions = (render) => React3.createElement(React3.Fragment, null, transitions.map((t5, i3) => {
    const {
      springs
    } = changes.get(t5) || t5.ctrl;
    const elem = render(_extends3({}, springs), t5.item, t5, i3);
    return elem && elem.type ? React3.createElement(elem.type, _extends3({}, elem.props, {
      key: is.str(t5.key) || is.num(t5.key) ? t5.key : t5.ctrl.id,
      ref: elem.ref
    })) : elem;
  }));
  return ref ? [renderTransitions, ref] : renderTransitions;
}
var nextKey = 1;
function getKeys(items, {
  key,
  keys = key
}, prevTransitions) {
  if (keys === null) {
    const reused = /* @__PURE__ */ new Set();
    return items.map((item) => {
      const t5 = prevTransitions && prevTransitions.find((t6) => t6.item === item && t6.phase !== TransitionPhase.LEAVE && !reused.has(t6));
      if (t5) {
        reused.add(t5);
        return t5.key;
      }
      return nextKey++;
    });
  }
  return is.und(keys) ? items : is.fun(keys) ? items.map(keys) : toArray(keys);
}
var Interpolation = class extends FrameValue {
  constructor(source, args) {
    super();
    this.key = void 0;
    this.idle = true;
    this.calc = void 0;
    this._active = /* @__PURE__ */ new Set();
    this.source = source;
    this.calc = createInterpolator(...args);
    const value = this._get();
    const nodeType = getAnimatedType(value);
    setAnimated(this, nodeType.create(value));
  }
  advance(_dt) {
    const value = this._get();
    const oldValue = this.get();
    if (!isEqual(value, oldValue)) {
      getAnimated(this).setValue(value);
      this._onChange(value, this.idle);
    }
    if (!this.idle && checkIdle(this._active)) {
      becomeIdle(this);
    }
  }
  _get() {
    const inputs = is.arr(this.source) ? this.source.map(getFluidValue) : toArray(getFluidValue(this.source));
    return this.calc(...inputs);
  }
  _start() {
    if (this.idle && !checkIdle(this._active)) {
      this.idle = false;
      each(getPayload(this), (node) => {
        node.done = false;
      });
      if (globals.skipAnimation) {
        raf.batchedUpdates(() => this.advance());
        becomeIdle(this);
      } else {
        frameLoop.start(this);
      }
    }
  }
  _attach() {
    let priority2 = 1;
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        addFluidObserver(source, this);
      }
      if (isFrameValue(source)) {
        if (!source.idle) {
          this._active.add(source);
        }
        priority2 = Math.max(priority2, source.priority + 1);
      }
    });
    this.priority = priority2;
    this._start();
  }
  _detach() {
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        removeFluidObserver(source, this);
      }
    });
    this._active.clear();
    becomeIdle(this);
  }
  eventObserved(event) {
    if (event.type == "change") {
      if (event.idle) {
        this.advance();
      } else {
        this._active.add(event.parent);
        this._start();
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    } else if (event.type == "priority") {
      this.priority = toArray(this.source).reduce((highest, parent) => Math.max(highest, (isFrameValue(parent) ? parent.priority : 0) + 1), 0);
    }
  }
};
function isIdle(source) {
  return source.idle !== false;
}
function checkIdle(active) {
  return !active.size || Array.from(active).every(isIdle);
}
function becomeIdle(self2) {
  if (!self2.idle) {
    self2.idle = true;
    each(getPayload(self2), (node) => {
      node.done = true;
    });
    callFluidObservers(self2, {
      type: "idle",
      parent: self2
    });
  }
}
var to2 = (source, ...args) => new Interpolation(source, args);
globals.assign({
  createStringInterpolator,
  to: (source, args) => new Interpolation(source, args)
});
var update2 = frameLoop.advance;

// ../../node_modules/@react-spring/web/dist/react-spring-web.esm.js
var import_react_dom = __toESM(require_react_dom());
function _objectWithoutPropertiesLoose2(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i3;
  for (i3 = 0; i3 < sourceKeys.length; i3++) {
    key = sourceKeys[i3];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var _excluded$2 = ["style", "children", "scrollTop", "scrollLeft"];
var isCustomPropRE = /^--/;
function dangerousStyleValue(name, value) {
  if (value == null || typeof value === "boolean" || value === "")
    return "";
  if (typeof value === "number" && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]))
    return value + "px";
  return ("" + value).trim();
}
var attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }
  const isFilterElement = instance.nodeName === "filter" || instance.parentNode && instance.parentNode.nodeName === "filter";
  const _ref = props, {
    style,
    children,
    scrollTop,
    scrollLeft
  } = _ref, attributes = _objectWithoutPropertiesLoose2(_ref, _excluded$2);
  const values = Object.values(attributes);
  const names = Object.keys(attributes).map((name) => isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(/([A-Z])/g, (n3) => "-" + n3.toLowerCase())));
  if (children !== void 0) {
    instance.textContent = children;
  }
  for (let name in style) {
    if (style.hasOwnProperty(name)) {
      const value = dangerousStyleValue(name, style[name]);
      if (isCustomPropRE.test(name)) {
        instance.style.setProperty(name, value);
      } else {
        instance.style[name] = value;
      }
    }
  }
  names.forEach((name, i3) => {
    instance.setAttribute(name, values[i3]);
  });
  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop;
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft;
  }
}
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
var prefixKey = (prefix2, key) => prefix2 + key.charAt(0).toUpperCase() + key.substring(1);
var prefixes = ["Webkit", "Ms", "Moz", "O"];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach((prefix2) => acc[prefixKey(prefix2, prop)] = acc[prop]);
  return acc;
}, isUnitlessNumber);
var _excluded$1 = ["x", "y", "z"];
var domTransforms = /^(matrix|translate|scale|rotate|skew)/;
var pxTransforms = /^(translate)/;
var degTransforms = /^(rotate|skew)/;
var addUnit = (value, unit2) => is.num(value) && value !== 0 ? value + unit2 : value;
var isValueIdentity = (value, id) => is.arr(value) ? value.every((v4) => isValueIdentity(v4, id)) : is.num(value) ? value === id : parseFloat(value) === id;
var AnimatedStyle = class extends AnimatedObject {
  constructor(_ref) {
    let {
      x: x5,
      y: y4,
      z: z2
    } = _ref, style = _objectWithoutPropertiesLoose2(_ref, _excluded$1);
    const inputs = [];
    const transforms = [];
    if (x5 || y4 || z2) {
      inputs.push([x5 || 0, y4 || 0, z2 || 0]);
      transforms.push((xyz) => [`translate3d(${xyz.map((v4) => addUnit(v4, "px")).join(",")})`, isValueIdentity(xyz, 0)]);
    }
    eachProp(style, (value, key) => {
      if (key === "transform") {
        inputs.push([value || ""]);
        transforms.push((transform) => [transform, transform === ""]);
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (is.und(value))
          return;
        const unit2 = pxTransforms.test(key) ? "px" : degTransforms.test(key) ? "deg" : "";
        inputs.push(toArray(value));
        transforms.push(key === "rotate3d" ? ([x6, y5, z3, deg]) => [`rotate3d(${x6},${y5},${z3},${addUnit(deg, unit2)})`, isValueIdentity(deg, 0)] : (input) => [`${key}(${input.map((v4) => addUnit(v4, unit2)).join(",")})`, isValueIdentity(input, key.startsWith("scale") ? 1 : 0)]);
      }
    });
    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }
    super(style);
  }
};
var FluidTransform = class extends FluidValue {
  constructor(inputs, transforms) {
    super();
    this._value = null;
    this.inputs = inputs;
    this.transforms = transforms;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let transform = "";
    let identity2 = true;
    each(this.inputs, (input, i3) => {
      const arg1 = getFluidValue(input[0]);
      const [t5, id] = this.transforms[i3](is.arr(arg1) ? arg1 : input.map(getFluidValue));
      transform += " " + t5;
      identity2 = identity2 && id;
    });
    return identity2 ? "none" : transform;
  }
  observerAdded(count) {
    if (count == 1)
      each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && addFluidObserver(value, this)));
  }
  observerRemoved(count) {
    if (count == 0)
      each(this.inputs, (input) => each(input, (value) => hasFluidValue(value) && removeFluidObserver(value, this)));
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._value = null;
    }
    callFluidObservers(this, event);
  }
};
var primitives = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"];
var _excluded = ["scrollTop", "scrollLeft"];
globals.assign({
  batchedUpdates: import_react_dom.unstable_batchedUpdates,
  createStringInterpolator,
  colors
});
var host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: (style) => new AnimatedStyle(style),
  getComponentProps: (_ref) => {
    let props = _objectWithoutPropertiesLoose2(_ref, _excluded);
    return props;
  }
});
var animated = host.animated;

// ../../node_modules/@nivo/tooltip/dist/nivo-tooltip.es.js
var import_react6 = __toESM(require_react());

// ../../node_modules/@nivo/core/dist/nivo-core.es.js
var import_react5 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_merge = __toESM(require_merge());
var import_get = __toESM(require_get());
var import_set = __toESM(require_set());

// ../../node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// ../../node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
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
};
define_default(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format3) {
  var m4, l3;
  format3 = (format3 + "").trim().toLowerCase();
  return (m4 = reHex.exec(format3)) ? (l3 = m4[1].length, m4 = parseInt(m4[1], 16), l3 === 6 ? rgbn(m4) : l3 === 3 ? new Rgb(m4 >> 8 & 15 | m4 >> 4 & 240, m4 >> 4 & 15 | m4 & 240, (m4 & 15) << 4 | m4 & 15, 1) : l3 === 8 ? rgba2(m4 >> 24 & 255, m4 >> 16 & 255, m4 >> 8 & 255, (m4 & 255) / 255) : l3 === 4 ? rgba2(m4 >> 12 & 15 | m4 >> 8 & 240, m4 >> 8 & 15 | m4 >> 4 & 240, m4 >> 4 & 15 | m4 & 240, ((m4 & 15) << 4 | m4 & 15) / 255) : null) : (m4 = reRgbInteger.exec(format3)) ? new Rgb(m4[1], m4[2], m4[3], 1) : (m4 = reRgbPercent.exec(format3)) ? new Rgb(m4[1] * 255 / 100, m4[2] * 255 / 100, m4[3] * 255 / 100, 1) : (m4 = reRgbaInteger.exec(format3)) ? rgba2(m4[1], m4[2], m4[3], m4[4]) : (m4 = reRgbaPercent.exec(format3)) ? rgba2(m4[1] * 255 / 100, m4[2] * 255 / 100, m4[3] * 255 / 100, m4[4]) : (m4 = reHslPercent.exec(format3)) ? hsla2(m4[1], m4[2] / 100, m4[3] / 100, 1) : (m4 = reHslaPercent.exec(format3)) ? hsla2(m4[1], m4[2] / 100, m4[3] / 100, m4[4]) : named.hasOwnProperty(format3) ? rgbn(named[format3]) : format3 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n3) {
  return new Rgb(n3 >> 16 & 255, n3 >> 8 & 255, n3 & 255, 1);
}
function rgba2(r4, g3, b4, a3) {
  if (a3 <= 0)
    r4 = g3 = b4 = NaN;
  return new Rgb(r4, g3, b4, a3);
}
function rgbConvert(o3) {
  if (!(o3 instanceof Color))
    o3 = color(o3);
  if (!o3)
    return new Rgb();
  o3 = o3.rgb();
  return new Rgb(o3.r, o3.g, o3.b, o3.opacity);
}
function rgb2(r4, g3, b4, opacity) {
  return arguments.length === 1 ? rgbConvert(r4) : new Rgb(r4, g3, b4, opacity == null ? 1 : opacity);
}
function Rgb(r4, g3, b4, opacity) {
  this.r = +r4;
  this.g = +g3;
  this.b = +b4;
  this.opacity = +opacity;
}
define_default(Rgb, rgb2, extend(Color, {
  brighter: function(k3) {
    k3 = k3 == null ? brighter : Math.pow(brighter, k3);
    return new Rgb(this.r * k3, this.g * k3, this.b * k3, this.opacity);
  },
  darker: function(k3) {
    k3 = k3 == null ? darker : Math.pow(darker, k3);
    return new Rgb(this.r * k3, this.g * k3, this.b * k3, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
  var a3 = this.opacity;
  a3 = isNaN(a3) ? 1 : Math.max(0, Math.min(1, a3));
  return (a3 === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a3 === 1 ? ")" : ", " + a3 + ")");
}
function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla2(h3, s3, l3, a3) {
  if (a3 <= 0)
    h3 = s3 = l3 = NaN;
  else if (l3 <= 0 || l3 >= 1)
    h3 = s3 = NaN;
  else if (s3 <= 0)
    h3 = NaN;
  return new Hsl(h3, s3, l3, a3);
}
function hslConvert(o3) {
  if (o3 instanceof Hsl)
    return new Hsl(o3.h, o3.s, o3.l, o3.opacity);
  if (!(o3 instanceof Color))
    o3 = color(o3);
  if (!o3)
    return new Hsl();
  if (o3 instanceof Hsl)
    return o3;
  o3 = o3.rgb();
  var r4 = o3.r / 255, g3 = o3.g / 255, b4 = o3.b / 255, min = Math.min(r4, g3, b4), max = Math.max(r4, g3, b4), h3 = NaN, s3 = max - min, l3 = (max + min) / 2;
  if (s3) {
    if (r4 === max)
      h3 = (g3 - b4) / s3 + (g3 < b4) * 6;
    else if (g3 === max)
      h3 = (b4 - r4) / s3 + 2;
    else
      h3 = (r4 - g3) / s3 + 4;
    s3 /= l3 < 0.5 ? max + min : 2 - max - min;
    h3 *= 60;
  } else {
    s3 = l3 > 0 && l3 < 1 ? 0 : h3;
  }
  return new Hsl(h3, s3, l3, o3.opacity);
}
function hsl2(h3, s3, l3, opacity) {
  return arguments.length === 1 ? hslConvert(h3) : new Hsl(h3, s3, l3, opacity == null ? 1 : opacity);
}
function Hsl(h3, s3, l3, opacity) {
  this.h = +h3;
  this.s = +s3;
  this.l = +l3;
  this.opacity = +opacity;
}
define_default(Hsl, hsl2, extend(Color, {
  brighter: function(k3) {
    k3 = k3 == null ? brighter : Math.pow(brighter, k3);
    return new Hsl(this.h, this.s, this.l * k3, this.opacity);
  },
  darker: function(k3) {
    k3 = k3 == null ? darker : Math.pow(darker, k3);
    return new Hsl(this.h, this.s, this.l * k3, this.opacity);
  },
  rgb: function() {
    var h3 = this.h % 360 + (this.h < 0) * 360, s3 = isNaN(h3) || isNaN(this.s) ? 0 : this.s, l3 = this.l, m22 = l3 + (l3 < 0.5 ? l3 : 1 - l3) * s3, m1 = 2 * l3 - m22;
    return new Rgb(
      hsl2rgb(h3 >= 240 ? h3 - 240 : h3 + 120, m1, m22),
      hsl2rgb(h3, m1, m22),
      hsl2rgb(h3 < 120 ? h3 + 240 : h3 - 120, m1, m22),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a3 = this.opacity;
    a3 = isNaN(a3) ? 1 : Math.max(0, Math.min(1, a3));
    return (a3 === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a3 === 1 ? ")" : ", " + a3 + ")");
  }
}));
function hsl2rgb(h3, m1, m22) {
  return (h3 < 60 ? m1 + (m22 - m1) * h3 / 60 : h3 < 180 ? m22 : h3 < 240 ? m1 + (m22 - m1) * (240 - h3) / 60 : m1) * 255;
}

// ../../node_modules/d3-color/src/math.js
var radians = Math.PI / 180;
var degrees = 180 / Math.PI;

// ../../node_modules/d3-color/src/cubehelix.js
var A = -0.14861;
var B = 1.78277;
var C = -0.29227;
var D = -0.90649;
var E = 1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;
function cubehelixConvert(o3) {
  if (o3 instanceof Cubehelix)
    return new Cubehelix(o3.h, o3.s, o3.l, o3.opacity);
  if (!(o3 instanceof Rgb))
    o3 = rgbConvert(o3);
  var r4 = o3.r / 255, g3 = o3.g / 255, b4 = o3.b / 255, l3 = (BC_DA * b4 + ED * r4 - EB * g3) / (BC_DA + ED - EB), bl = b4 - l3, k3 = (E * (g3 - l3) - C * bl) / D, s3 = Math.sqrt(k3 * k3 + bl * bl) / (E * l3 * (1 - l3)), h3 = s3 ? Math.atan2(k3, bl) * degrees - 120 : NaN;
  return new Cubehelix(h3 < 0 ? h3 + 360 : h3, s3, l3, o3.opacity);
}
function cubehelix(h3, s3, l3, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h3) : new Cubehelix(h3, s3, l3, opacity == null ? 1 : opacity);
}
function Cubehelix(h3, s3, l3, opacity) {
  this.h = +h3;
  this.s = +s3;
  this.l = +l3;
  this.opacity = +opacity;
}
define_default(Cubehelix, cubehelix, extend(Color, {
  brighter: function(k3) {
    k3 = k3 == null ? brighter : Math.pow(brighter, k3);
    return new Cubehelix(this.h, this.s, this.l * k3, this.opacity);
  },
  darker: function(k3) {
    k3 = k3 == null ? darker : Math.pow(darker, k3);
    return new Cubehelix(this.h, this.s, this.l * k3, this.opacity);
  },
  rgb: function() {
    var h3 = isNaN(this.h) ? 0 : (this.h + 120) * radians, l3 = +this.l, a3 = isNaN(this.s) ? 0 : this.s * l3 * (1 - l3), cosh = Math.cos(h3), sinh = Math.sin(h3);
    return new Rgb(
      255 * (l3 + a3 * (A * cosh + B * sinh)),
      255 * (l3 + a3 * (C * cosh + D * sinh)),
      255 * (l3 + a3 * (E * cosh)),
      this.opacity
    );
  }
}));

// ../../node_modules/d3-interpolate/src/basis.js
function basis(t12, v0, v1, v22, v32) {
  var t22 = t12 * t12, t32 = t22 * t12;
  return ((1 - 3 * t12 + 3 * t22 - t32) * v0 + (4 - 6 * t22 + 3 * t32) * v1 + (1 + 3 * t12 + 3 * t22 - 3 * t32) * v22 + t32 * v32) / 6;
}
function basis_default(values) {
  var n3 = values.length - 1;
  return function(t5) {
    var i3 = t5 <= 0 ? t5 = 0 : t5 >= 1 ? (t5 = 1, n3 - 1) : Math.floor(t5 * n3), v1 = values[i3], v22 = values[i3 + 1], v0 = i3 > 0 ? values[i3 - 1] : 2 * v1 - v22, v32 = i3 < n3 - 1 ? values[i3 + 2] : 2 * v22 - v1;
    return basis((t5 - i3 / n3) * n3, v0, v1, v22, v32);
  };
}

// ../../node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n3 = values.length;
  return function(t5) {
    var i3 = Math.floor(((t5 %= 1) < 0 ? ++t5 : t5) * n3), v0 = values[(i3 + n3 - 1) % n3], v1 = values[i3 % n3], v22 = values[(i3 + 1) % n3], v32 = values[(i3 + 2) % n3];
    return basis((t5 - i3 / n3) * n3, v0, v1, v22, v32);
  };
}

// ../../node_modules/d3-interpolate/src/constant.js
var constant_default = (x5) => () => x5;

// ../../node_modules/d3-interpolate/src/color.js
function linear(a3, d3) {
  return function(t5) {
    return a3 + t5 * d3;
  };
}
function exponential(a3, b4, y4) {
  return a3 = Math.pow(a3, y4), b4 = Math.pow(b4, y4) - a3, y4 = 1 / y4, function(t5) {
    return Math.pow(a3 + t5 * b4, y4);
  };
}
function hue(a3, b4) {
  var d3 = b4 - a3;
  return d3 ? linear(a3, d3 > 180 || d3 < -180 ? d3 - 360 * Math.round(d3 / 360) : d3) : constant_default(isNaN(a3) ? b4 : a3);
}
function gamma(y4) {
  return (y4 = +y4) === 1 ? nogamma : function(a3, b4) {
    return b4 - a3 ? exponential(a3, b4, y4) : constant_default(isNaN(a3) ? b4 : a3);
  };
}
function nogamma(a3, b4) {
  var d3 = b4 - a3;
  return d3 ? linear(a3, d3) : constant_default(isNaN(a3) ? b4 : a3);
}

// ../../node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y4) {
  var color2 = gamma(y4);
  function rgb3(start2, end) {
    var r4 = color2((start2 = rgb2(start2)).r, (end = rgb2(end)).r), g3 = color2(start2.g, end.g), b4 = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t5) {
      start2.r = r4(t5);
      start2.g = g3(t5);
      start2.b = b4(t5);
      start2.opacity = opacity(t5);
      return start2 + "";
    };
  }
  rgb3.gamma = rgbGamma;
  return rgb3;
}(1);
function rgbSpline(spline) {
  return function(colors2) {
    var n3 = colors2.length, r4 = new Array(n3), g3 = new Array(n3), b4 = new Array(n3), i3, color2;
    for (i3 = 0; i3 < n3; ++i3) {
      color2 = rgb2(colors2[i3]);
      r4[i3] = color2.r || 0;
      g3[i3] = color2.g || 0;
      b4[i3] = color2.b || 0;
    }
    r4 = spline(r4);
    g3 = spline(g3);
    b4 = spline(b4);
    color2.opacity = 1;
    return function(t5) {
      color2.r = r4(t5);
      color2.g = g3(t5);
      color2.b = b4(t5);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// ../../node_modules/d3-interpolate/src/numberArray.js
function numberArray_default(a3, b4) {
  if (!b4)
    b4 = [];
  var n3 = a3 ? Math.min(b4.length, a3.length) : 0, c8 = b4.slice(), i3;
  return function(t5) {
    for (i3 = 0; i3 < n3; ++i3)
      c8[i3] = a3[i3] * (1 - t5) + b4[i3] * t5;
    return c8;
  };
}
function isNumberArray(x5) {
  return ArrayBuffer.isView(x5) && !(x5 instanceof DataView);
}

// ../../node_modules/d3-interpolate/src/array.js
function genericArray(a3, b4) {
  var nb = b4 ? b4.length : 0, na = a3 ? Math.min(nb, a3.length) : 0, x5 = new Array(na), c8 = new Array(nb), i3;
  for (i3 = 0; i3 < na; ++i3)
    x5[i3] = value_default(a3[i3], b4[i3]);
  for (; i3 < nb; ++i3)
    c8[i3] = b4[i3];
  return function(t5) {
    for (i3 = 0; i3 < na; ++i3)
      c8[i3] = x5[i3](t5);
    return c8;
  };
}

// ../../node_modules/d3-interpolate/src/date.js
function date_default(a3, b4) {
  var d3 = /* @__PURE__ */ new Date();
  return a3 = +a3, b4 = +b4, function(t5) {
    return d3.setTime(a3 * (1 - t5) + b4 * t5), d3;
  };
}

// ../../node_modules/d3-interpolate/src/number.js
function number_default(a3, b4) {
  return a3 = +a3, b4 = +b4, function(t5) {
    return a3 * (1 - t5) + b4 * t5;
  };
}

// ../../node_modules/d3-interpolate/src/object.js
function object_default(a3, b4) {
  var i3 = {}, c8 = {}, k3;
  if (a3 === null || typeof a3 !== "object")
    a3 = {};
  if (b4 === null || typeof b4 !== "object")
    b4 = {};
  for (k3 in b4) {
    if (k3 in a3) {
      i3[k3] = value_default(a3[k3], b4[k3]);
    } else {
      c8[k3] = b4[k3];
    }
  }
  return function(t5) {
    for (k3 in i3)
      c8[k3] = i3[k3](t5);
    return c8;
  };
}

// ../../node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b4) {
  return function() {
    return b4;
  };
}
function one(b4) {
  return function(t5) {
    return b4(t5) + "";
  };
}
function string_default(a3, b4) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i3 = -1, s3 = [], q = [];
  a3 = a3 + "", b4 = b4 + "";
  while ((am = reA.exec(a3)) && (bm = reB.exec(b4))) {
    if ((bs = bm.index) > bi) {
      bs = b4.slice(bi, bs);
      if (s3[i3])
        s3[i3] += bs;
      else
        s3[++i3] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s3[i3])
        s3[i3] += bm;
      else
        s3[++i3] = bm;
    } else {
      s3[++i3] = null;
      q.push({ i: i3, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b4.length) {
    bs = b4.slice(bi);
    if (s3[i3])
      s3[i3] += bs;
    else
      s3[++i3] = bs;
  }
  return s3.length < 2 ? q[0] ? one(q[0].x) : zero(b4) : (b4 = q.length, function(t5) {
    for (var i4 = 0, o3; i4 < b4; ++i4)
      s3[(o3 = q[i4]).i] = o3.x(t5);
    return s3.join("");
  });
}

// ../../node_modules/d3-interpolate/src/value.js
function value_default(a3, b4) {
  var t5 = typeof b4, c8;
  return b4 == null || t5 === "boolean" ? constant_default(b4) : (t5 === "number" ? number_default : t5 === "string" ? (c8 = color(b4)) ? (b4 = c8, rgb_default) : string_default : b4 instanceof color ? rgb_default : b4 instanceof Date ? date_default : isNumberArray(b4) ? numberArray_default : Array.isArray(b4) ? genericArray : typeof b4.valueOf !== "function" && typeof b4.toString !== "function" || isNaN(b4) ? object_default : number_default)(a3, b4);
}

// ../../node_modules/d3-interpolate/src/round.js
function round_default(a3, b4) {
  return a3 = +a3, b4 = +b4, function(t5) {
    return Math.round(a3 * (1 - t5) + b4 * t5);
  };
}

// ../../node_modules/d3-interpolate/src/cubehelix.js
function cubehelix2(hue2) {
  return function cubehelixGamma(y4) {
    y4 = +y4;
    function cubehelix3(start2, end) {
      var h3 = hue2((start2 = cubehelix(start2)).h, (end = cubehelix(end)).h), s3 = nogamma(start2.s, end.s), l3 = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
      return function(t5) {
        start2.h = h3(t5);
        start2.s = s3(t5);
        start2.l = l3(Math.pow(t5, y4));
        start2.opacity = opacity(t5);
        return start2 + "";
      };
    }
    cubehelix3.gamma = cubehelixGamma;
    return cubehelix3;
  }(1);
}
var cubehelix_default = cubehelix2(hue);
var cubehelixLong = cubehelix2(nogamma);

// ../../node_modules/@nivo/core/dist/nivo-core.es.js
var import_isString = __toESM(require_isString());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_last = __toESM(require_last());
var import_isArray = __toESM(require_isArray());

// ../../node_modules/d3-array/src/ascending.js
function ascending_default(a3, b4) {
  return a3 < b4 ? -1 : a3 > b4 ? 1 : a3 >= b4 ? 0 : NaN;
}

// ../../node_modules/d3-array/src/bisector.js
function bisector_default(f4) {
  let delta = f4;
  let compare = f4;
  if (f4.length === 1) {
    delta = (d3, x5) => f4(d3) - x5;
    compare = ascendingComparator(f4);
  }
  function left(a3, x5, lo, hi) {
    if (lo == null)
      lo = 0;
    if (hi == null)
      hi = a3.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (compare(a3[mid], x5) < 0)
        lo = mid + 1;
      else
        hi = mid;
    }
    return lo;
  }
  function right(a3, x5, lo, hi) {
    if (lo == null)
      lo = 0;
    if (hi == null)
      hi = a3.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (compare(a3[mid], x5) > 0)
        hi = mid;
      else
        lo = mid + 1;
    }
    return lo;
  }
  function center(a3, x5, lo, hi) {
    if (lo == null)
      lo = 0;
    if (hi == null)
      hi = a3.length;
    const i3 = left(a3, x5, lo, hi - 1);
    return i3 > lo && delta(a3[i3 - 1], x5) > -delta(a3[i3], x5) ? i3 - 1 : i3;
  }
  return { left, center, right };
}
function ascendingComparator(f4) {
  return (d3, x5) => ascending_default(f4(d3), x5);
}

// ../../node_modules/d3-array/src/number.js
function number_default2(x5) {
  return x5 === null ? NaN : +x5;
}

// ../../node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector_default(ascending_default);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
var bisectCenter = bisector_default(number_default2).center;
var bisect_default = bisectRight;

// ../../node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function ticks_default(start2, stop2, count) {
  var reverse, i3 = -1, n3, ticks, step;
  stop2 = +stop2, start2 = +start2, count = +count;
  if (start2 === stop2 && count > 0)
    return [start2];
  if (reverse = stop2 < start2)
    n3 = start2, start2 = stop2, stop2 = n3;
  if ((step = tickIncrement(start2, stop2, count)) === 0 || !isFinite(step))
    return [];
  if (step > 0) {
    let r0 = Math.round(start2 / step), r1 = Math.round(stop2 / step);
    if (r0 * step < start2)
      ++r0;
    if (r1 * step > stop2)
      --r1;
    ticks = new Array(n3 = r1 - r0 + 1);
    while (++i3 < n3)
      ticks[i3] = (r0 + i3) * step;
  } else {
    step = -step;
    let r0 = Math.round(start2 * step), r1 = Math.round(stop2 * step);
    if (r0 / step < start2)
      ++r0;
    if (r1 / step > stop2)
      --r1;
    ticks = new Array(n3 = r1 - r0 + 1);
    while (++i3 < n3)
      ticks[i3] = (r0 + i3) / step;
  }
  if (reverse)
    ticks.reverse();
  return ticks;
}
function tickIncrement(start2, stop2, count) {
  var step = (stop2 - start2) / Math.max(0, count), power = Math.floor(Math.log(step) / Math.LN10), error = step / Math.pow(10, power);
  return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}
function tickStep(start2, stop2, count) {
  var step0 = Math.abs(stop2 - start2) / Math.max(0, count), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error = step0 / step1;
  if (error >= e10)
    step1 *= 10;
  else if (error >= e5)
    step1 *= 5;
  else if (error >= e2)
    step1 *= 2;
  return stop2 < start2 ? -step1 : step1;
}

// ../../node_modules/d3-array/src/range.js
function range_default(start2, stop2, step) {
  start2 = +start2, stop2 = +stop2, step = (n3 = arguments.length) < 2 ? (stop2 = start2, start2 = 0, 1) : n3 < 3 ? 1 : +step;
  var i3 = -1, n3 = Math.max(0, Math.ceil((stop2 - start2) / step)) | 0, range = new Array(n3);
  while (++i3 < n3) {
    range[i3] = start2 + i3 * step;
  }
  return range;
}

// ../../node_modules/d3-scale/src/init.js
function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}

// ../../node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index = /* @__PURE__ */ new Map(), domain = [], range = [], unknown = implicit;
  function scale(d3) {
    var key = d3 + "", i3 = index.get(key);
    if (!i3) {
      if (unknown !== implicit)
        return unknown;
      index.set(key, i3 = domain.push(d3));
    }
    return range[(i3 - 1) % range.length];
  }
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index = /* @__PURE__ */ new Map();
    for (const value of _) {
      const key = value + "";
      if (index.has(key))
        continue;
      index.set(key, domain.push(value));
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// ../../node_modules/d3-scale/src/band.js
function band() {
  var scale = ordinal().unknown(void 0), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n3 = domain().length, reverse = r1 < r0, start2 = reverse ? r1 : r0, stop2 = reverse ? r0 : r1;
    step = (stop2 - start2) / Math.max(1, n3 - paddingInner + paddingOuter * 2);
    if (round)
      step = Math.floor(step);
    start2 += (stop2 - start2 - step * (n3 - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round)
      start2 = Math.round(start2), bandwidth = Math.round(bandwidth);
    var values = range_default(n3).map(function(i3) {
      return start2 + step * i3;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };
  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };
  scale.bandwidth = function() {
    return bandwidth;
  };
  scale.step = function() {
    return step;
  };
  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };
  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };
  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };
  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };
  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };
  scale.copy = function() {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  return initRange.apply(rescale(), arguments);
}
function pointish(scale) {
  var copy2 = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;
  scale.copy = function() {
    return pointish(copy2());
  };
  return scale;
}
function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}

// ../../node_modules/d3-scale/src/constant.js
function constants(x5) {
  return function() {
    return x5;
  };
}

// ../../node_modules/d3-scale/src/number.js
function number(x5) {
  return +x5;
}

// ../../node_modules/d3-scale/src/continuous.js
var unit = [0, 1];
function identity(x5) {
  return x5;
}
function normalize(a3, b4) {
  return (b4 -= a3 = +a3) ? function(x5) {
    return (x5 - a3) / b4;
  } : constants(isNaN(b4) ? NaN : 0.5);
}
function clamper(a3, b4) {
  var t5;
  if (a3 > b4)
    t5 = a3, a3 = b4, b4 = t5;
  return function(x5) {
    return Math.max(a3, Math.min(b4, x5));
  };
}
function bimap(domain, range, interpolate2) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0)
    d0 = normalize(d1, d0), r0 = interpolate2(r1, r0);
  else
    d0 = normalize(d0, d1), r0 = interpolate2(r0, r1);
  return function(x5) {
    return r0(d0(x5));
  };
}
function polymap(domain, range, interpolate2) {
  var j2 = Math.min(domain.length, range.length) - 1, d3 = new Array(j2), r4 = new Array(j2), i3 = -1;
  if (domain[j2] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }
  while (++i3 < j2) {
    d3[i3] = normalize(domain[i3], domain[i3 + 1]);
    r4[i3] = interpolate2(range[i3], range[i3 + 1]);
  }
  return function(x5) {
    var i4 = bisect_default(domain, x5, 1, j2) - 1;
    return r4[i4](d3[i4](x5));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range = unit, interpolate2 = value_default, transform, untransform, unknown, clamp = identity, piecewise, output, input;
  function rescale() {
    var n3 = Math.min(domain.length, range.length);
    if (clamp !== identity)
      clamp = clamper(domain[0], domain[n3 - 1]);
    piecewise = n3 > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x5) {
    return x5 == null || isNaN(x5 = +x5) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate2)))(transform(clamp(x5)));
  }
  scale.invert = function(y4) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), number_default)))(y4)));
  };
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };
  scale.rangeRound = function(_) {
    return range = Array.from(_), interpolate2 = round_default, rescale();
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity, rescale()) : clamp !== identity;
  };
  scale.interpolate = function(_) {
    return arguments.length ? (interpolate2 = _, rescale()) : interpolate2;
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t5, u3) {
    transform = t5, untransform = u3;
    return rescale();
  };
}
function continuous() {
  return transformer()(identity, identity);
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x5) {
  return Math.abs(x5 = Math.round(x5)) >= 1e21 ? x5.toLocaleString("en").replace(/,/g, "") : x5.toString(10);
}
function formatDecimalParts(x5, p3) {
  if ((i3 = (x5 = p3 ? x5.toExponential(p3 - 1) : x5.toExponential()).indexOf("e")) < 0)
    return null;
  var i3, coefficient = x5.slice(0, i3);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x5.slice(i3 + 1)
  ];
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/exponent.js
function exponent_default(x5) {
  return x5 = formatDecimalParts(Math.abs(x5)), x5 ? x5[1] : NaN;
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value, width) {
    var i3 = value.length, t5 = [], j2 = 0, g3 = grouping[0], length = 0;
    while (i3 > 0 && g3 > 0) {
      if (length + g3 + 1 > width)
        g3 = Math.max(1, width - length);
      t5.push(value.substring(i3 -= g3, i3 + g3));
      if ((length += g3 + 1) > width)
        break;
      g3 = grouping[j2 = (j2 + 1) % grouping.length];
    }
    return t5.reverse().join(thousands);
  };
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i3) {
      return numerals[+i3];
    });
  };
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s3) {
  out:
    for (var n3 = s3.length, i3 = 1, i0 = -1, i1; i3 < n3; ++i3) {
      switch (s3[i3]) {
        case ".":
          i0 = i1 = i3;
          break;
        case "0":
          if (i0 === 0)
            i0 = i3;
          i1 = i3;
          break;
        default:
          if (!+s3[i3])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s3.slice(0, i0) + s3.slice(i1 + 1) : s3;
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x5, p3) {
  var d3 = formatDecimalParts(x5, p3);
  if (!d3)
    return x5 + "";
  var coefficient = d3[0], exponent = d3[1], i3 = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n3 = coefficient.length;
  return i3 === n3 ? coefficient : i3 > n3 ? coefficient + new Array(i3 - n3 + 1).join("0") : i3 > 0 ? coefficient.slice(0, i3) + "." + coefficient.slice(i3) : "0." + new Array(1 - i3).join("0") + formatDecimalParts(x5, Math.max(0, p3 + i3 - 1))[0];
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x5, p3) {
  var d3 = formatDecimalParts(x5, p3);
  if (!d3)
    return x5 + "";
  var coefficient = d3[0], exponent = d3[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": (x5, p3) => (x5 * 100).toFixed(p3),
  "b": (x5) => Math.round(x5).toString(2),
  "c": (x5) => x5 + "",
  "d": formatDecimal_default,
  "e": (x5, p3) => x5.toExponential(p3),
  "f": (x5, p3) => x5.toFixed(p3),
  "g": (x5, p3) => x5.toPrecision(p3),
  "o": (x5) => Math.round(x5).toString(8),
  "p": (x5, p3) => formatRounded_default(x5 * 100, p3),
  "r": formatRounded_default,
  "s": formatPrefixAuto_default,
  "X": (x5) => Math.round(x5).toString(16).toUpperCase(),
  "x": (x5) => Math.round(x5).toString(16)
};

// ../../node_modules/d3-scale/node_modules/d3-format/src/identity.js
function identity_default(x5) {
  return x5;
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/locale.js
var map = Array.prototype.map;
var prefixes2 = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale4) {
  var group = locale4.grouping === void 0 || locale4.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale4.grouping, Number), locale4.thousands + ""), currencyPrefix = locale4.currency === void 0 ? "" : locale4.currency[0] + "", currencySuffix = locale4.currency === void 0 ? "" : locale4.currency[1] + "", decimal = locale4.decimal === void 0 ? "." : locale4.decimal + "", numerals = locale4.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale4.numerals, String)), percent = locale4.percent === void 0 ? "%" : locale4.percent + "", minus = locale4.minus === void 0 ? "\u2212" : locale4.minus + "", nan = locale4.nan === void 0 ? "NaN" : locale4.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign2 = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n")
      comma = true, type = "g";
    else if (!formatTypes_default[type])
      precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero2 || fill === "0" && align === "=")
      zero2 = true, fill = "0", align = "=";
    var prefix2 = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format3(value) {
      var valuePrefix = prefix2, valueSuffix = suffix, i3, n3, c8;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim)
          value = formatTrim_default(value);
        if (valueNegative && +value === 0 && sign2 !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign2 === "(" ? sign2 : minus : sign2 === "-" || sign2 === "(" ? "" : sign2) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes2[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign2 === "(" ? ")" : "");
        if (maybeSuffix) {
          i3 = -1, n3 = value.length;
          while (++i3 < n3) {
            if (c8 = value.charCodeAt(i3), 48 > c8 || c8 > 57) {
              valueSuffix = (c8 === 46 ? decimal + value.slice(i3 + 1) : value.slice(i3)) + valueSuffix;
              value = value.slice(0, i3);
              break;
            }
          }
        }
      }
      if (comma && !zero2)
        value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero2)
        value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format3.toString = function() {
      return specifier + "";
    };
    return format3;
  }
  function formatPrefix3(specifier, value) {
    var f4 = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e6 = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k3 = Math.pow(10, -e6), prefix2 = prefixes2[8 + e6 / 3];
    return function(value2) {
      return f4(k3 * value2) + prefix2;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix3
  };
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/defaultLocale.js
var locale;
var format;
var formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  locale = locale_default(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/precisionFixed.js
function precisionFixed_default(step) {
  return Math.max(0, -exponent_default(Math.abs(step)));
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/precisionPrefix.js
function precisionPrefix_default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3 - exponent_default(Math.abs(step)));
}

// ../../node_modules/d3-scale/node_modules/d3-format/src/precisionRound.js
function precisionRound_default(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent_default(max) - exponent_default(step)) + 1;
}

// ../../node_modules/d3-scale/src/tickFormat.js
function tickFormat(start2, stop2, count, specifier) {
  var step = tickStep(start2, stop2, count), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start2), Math.abs(stop2));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value)))
        specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start2), Math.abs(stop2)))))
        specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step)))
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

// ../../node_modules/d3-scale/src/linear.js
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count) {
    var d3 = domain();
    return ticks_default(d3[0], d3[d3.length - 1], count == null ? 10 : count);
  };
  scale.tickFormat = function(count, specifier) {
    var d3 = domain();
    return tickFormat(d3[0], d3[d3.length - 1], count == null ? 10 : count, specifier);
  };
  scale.nice = function(count) {
    if (count == null)
      count = 10;
    var d3 = domain();
    var i0 = 0;
    var i1 = d3.length - 1;
    var start2 = d3[i0];
    var stop2 = d3[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop2 < start2) {
      step = start2, start2 = stop2, stop2 = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start2, stop2, count);
      if (step === prestep) {
        d3[i0] = start2;
        d3[i1] = stop2;
        return domain(d3);
      } else if (step > 0) {
        start2 = Math.floor(start2 / step) * step;
        stop2 = Math.ceil(stop2 / step) * step;
      } else if (step < 0) {
        start2 = Math.ceil(start2 * step) / step;
        stop2 = Math.floor(stop2 * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function linear2() {
  var scale = continuous();
  scale.copy = function() {
    return copy(scale, linear2());
  };
  initRange.apply(scale, arguments);
  return linearish(scale);
}

// ../../node_modules/d3-scale/src/nice.js
function nice(domain, interval) {
  domain = domain.slice();
  var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], t5;
  if (x1 < x0) {
    t5 = i0, i0 = i1, i1 = t5;
    t5 = x0, x0 = x1, x1 = t5;
  }
  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

// ../../node_modules/d3-scale/src/log.js
function transformLog(x5) {
  return Math.log(x5);
}
function transformExp(x5) {
  return Math.exp(x5);
}
function transformLogn(x5) {
  return -Math.log(-x5);
}
function transformExpn(x5) {
  return -Math.exp(-x5);
}
function pow10(x5) {
  return isFinite(x5) ? +("1e" + x5) : x5 < 0 ? 0 : x5;
}
function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function(x5) {
    return Math.pow(base, x5);
  };
}
function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function(x5) {
    return Math.log(x5) / base;
  });
}
function reflect(f4) {
  return function(x5) {
    return -f4(-x5);
  };
}
function loggish(transform) {
  var scale = transform(transformLog, transformExp), domain = scale.domain, base = 10, logs, pows;
  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }
    return scale;
  }
  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.ticks = function(count) {
    var d3 = domain(), u3 = d3[0], v4 = d3[d3.length - 1], r4;
    if (r4 = v4 < u3)
      i3 = u3, u3 = v4, v4 = i3;
    var i3 = logs(u3), j2 = logs(v4), p3, k3, t5, n3 = count == null ? 10 : +count, z2 = [];
    if (!(base % 1) && j2 - i3 < n3) {
      i3 = Math.floor(i3), j2 = Math.ceil(j2);
      if (u3 > 0)
        for (; i3 <= j2; ++i3) {
          for (k3 = 1, p3 = pows(i3); k3 < base; ++k3) {
            t5 = p3 * k3;
            if (t5 < u3)
              continue;
            if (t5 > v4)
              break;
            z2.push(t5);
          }
        }
      else
        for (; i3 <= j2; ++i3) {
          for (k3 = base - 1, p3 = pows(i3); k3 >= 1; --k3) {
            t5 = p3 * k3;
            if (t5 < u3)
              continue;
            if (t5 > v4)
              break;
            z2.push(t5);
          }
        }
      if (z2.length * 2 < n3)
        z2 = ticks_default(u3, v4, n3);
    } else {
      z2 = ticks_default(i3, j2, Math.min(j2 - i3, n3)).map(pows);
    }
    return r4 ? z2.reverse() : z2;
  };
  scale.tickFormat = function(count, specifier) {
    if (specifier == null)
      specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function")
      specifier = format(specifier);
    if (count === Infinity)
      return specifier;
    if (count == null)
      count = 10;
    var k3 = Math.max(1, base * count / scale.ticks().length);
    return function(d3) {
      var i3 = d3 / pows(Math.round(logs(d3)));
      if (i3 * base < base - 0.5)
        i3 *= base;
      return i3 <= k3 ? specifier(d3) : "";
    };
  };
  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x5) {
        return pows(Math.floor(logs(x5)));
      },
      ceil: function(x5) {
        return pows(Math.ceil(logs(x5)));
      }
    }));
  };
  return scale;
}
function log() {
  var scale = loggish(transformer()).domain([1, 10]);
  scale.copy = function() {
    return copy(scale, log()).base(scale.base());
  };
  initRange.apply(scale, arguments);
  return scale;
}

// ../../node_modules/d3-scale/src/symlog.js
function transformSymlog(c8) {
  return function(x5) {
    return Math.sign(x5) * Math.log1p(Math.abs(x5 / c8));
  };
}
function transformSymexp(c8) {
  return function(x5) {
    return Math.sign(x5) * Math.expm1(Math.abs(x5)) * c8;
  };
}
function symlogish(transform) {
  var c8 = 1, scale = transform(transformSymlog(c8), transformSymexp(c8));
  scale.constant = function(_) {
    return arguments.length ? transform(transformSymlog(c8 = +_), transformSymexp(c8)) : c8;
  };
  return linearish(scale);
}
function symlog() {
  var scale = symlogish(transformer());
  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };
  return initRange.apply(scale, arguments);
}

// ../../node_modules/d3-scale/src/quantize.js
function quantize() {
  var x0 = 0, x1 = 1, n3 = 1, domain = [0.5], range = [0, 1], unknown;
  function scale(x5) {
    return x5 != null && x5 <= x5 ? range[bisect_default(domain, x5, 0, n3)] : unknown;
  }
  function rescale() {
    var i3 = -1;
    domain = new Array(n3);
    while (++i3 < n3)
      domain[i3] = ((i3 + 1) * x1 - (i3 - n3) * x0) / (n3 + 1);
    return scale;
  }
  scale.domain = function(_) {
    return arguments.length ? ([x0, x1] = _, x0 = +x0, x1 = +x1, rescale()) : [x0, x1];
  };
  scale.range = function(_) {
    return arguments.length ? (n3 = (range = Array.from(_)).length - 1, rescale()) : range.slice();
  };
  scale.invertExtent = function(y4) {
    var i3 = range.indexOf(y4);
    return i3 < 0 ? [NaN, NaN] : i3 < 1 ? [x0, domain[0]] : i3 >= n3 ? [domain[n3 - 1], x1] : [domain[i3 - 1], domain[i3]];
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : scale;
  };
  scale.thresholds = function() {
    return domain.slice();
  };
  scale.copy = function() {
    return quantize().domain([x0, x1]).range(range).unknown(unknown);
  };
  return initRange.apply(linearish(scale), arguments);
}

// ../../node_modules/d3-time/src/interval.js
var t0 = /* @__PURE__ */ new Date();
var t1 = /* @__PURE__ */ new Date();
function newInterval(floori, offseti, count, field) {
  function interval(date2) {
    return floori(date2 = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+date2)), date2;
  }
  interval.floor = function(date2) {
    return floori(date2 = /* @__PURE__ */ new Date(+date2)), date2;
  };
  interval.ceil = function(date2) {
    return floori(date2 = new Date(date2 - 1)), offseti(date2, 1), floori(date2), date2;
  };
  interval.round = function(date2) {
    var d0 = interval(date2), d1 = interval.ceil(date2);
    return date2 - d0 < d1 - date2 ? d0 : d1;
  };
  interval.offset = function(date2, step) {
    return offseti(date2 = /* @__PURE__ */ new Date(+date2), step == null ? 1 : Math.floor(step)), date2;
  };
  interval.range = function(start2, stop2, step) {
    var range = [], previous;
    start2 = interval.ceil(start2);
    step = step == null ? 1 : Math.floor(step);
    if (!(start2 < stop2) || !(step > 0))
      return range;
    do
      range.push(previous = /* @__PURE__ */ new Date(+start2)), offseti(start2, step), floori(start2);
    while (previous < start2 && start2 < stop2);
    return range;
  };
  interval.filter = function(test) {
    return newInterval(function(date2) {
      if (date2 >= date2)
        while (floori(date2), !test(date2))
          date2.setTime(date2 - 1);
    }, function(date2, step) {
      if (date2 >= date2) {
        if (step < 0)
          while (++step <= 0) {
            while (offseti(date2, -1), !test(date2)) {
            }
          }
        else
          while (--step >= 0) {
            while (offseti(date2, 1), !test(date2)) {
            }
          }
      }
    });
  };
  if (count) {
    interval.count = function(start2, end) {
      t0.setTime(+start2), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };
    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function(d3) {
        return field(d3) % step === 0;
      } : function(d3) {
        return interval.count(0, d3) % step === 0;
      });
    };
  }
  return interval;
}

// ../../node_modules/d3-time/src/millisecond.js
var millisecond = newInterval(function() {
}, function(date2, step) {
  date2.setTime(+date2 + step);
}, function(start2, end) {
  return end - start2;
});
millisecond.every = function(k3) {
  k3 = Math.floor(k3);
  if (!isFinite(k3) || !(k3 > 0))
    return null;
  if (!(k3 > 1))
    return millisecond;
  return newInterval(function(date2) {
    date2.setTime(Math.floor(date2 / k3) * k3);
  }, function(date2, step) {
    date2.setTime(+date2 + step * k3);
  }, function(start2, end) {
    return (end - start2) / k3;
  });
};
var millisecond_default = millisecond;
var milliseconds = millisecond.range;

// ../../node_modules/d3-time/src/duration.js
var durationSecond = 1e3;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

// ../../node_modules/d3-time/src/second.js
var second = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds());
}, function(date2, step) {
  date2.setTime(+date2 + step * durationSecond);
}, function(start2, end) {
  return (end - start2) / durationSecond;
}, function(date2) {
  return date2.getUTCSeconds();
});
var second_default = second;
var seconds = second.range;

// ../../node_modules/d3-time/src/minute.js
var minute = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationMinute);
}, function(start2, end) {
  return (end - start2) / durationMinute;
}, function(date2) {
  return date2.getMinutes();
});
var minute_default = minute;
var minutes = minute.range;

// ../../node_modules/d3-time/src/hour.js
var hour = newInterval(function(date2) {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond - date2.getMinutes() * durationMinute);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationHour);
}, function(start2, end) {
  return (end - start2) / durationHour;
}, function(date2) {
  return date2.getHours();
});
var hour_default = hour;
var hours = hour.range;

// ../../node_modules/d3-time/src/day.js
var day = newInterval(
  (date2) => date2.setHours(0, 0, 0, 0),
  (date2, step) => date2.setDate(date2.getDate() + step),
  (start2, end) => (end - start2 - (end.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationDay,
  (date2) => date2.getDate() - 1
);
var day_default = day;
var days = day.range;

// ../../node_modules/d3-time/src/week.js
function weekday(i3) {
  return newInterval(function(date2) {
    date2.setDate(date2.getDate() - (date2.getDay() + 7 - i3) % 7);
    date2.setHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setDate(date2.getDate() + step * 7);
  }, function(start2, end) {
    return (end - start2 - (end.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationWeek;
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

// ../../node_modules/d3-time/src/month.js
var month = newInterval(function(date2) {
  date2.setDate(1);
  date2.setHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setMonth(date2.getMonth() + step);
}, function(start2, end) {
  return end.getMonth() - start2.getMonth() + (end.getFullYear() - start2.getFullYear()) * 12;
}, function(date2) {
  return date2.getMonth();
});
var month_default = month;
var months = month.range;

// ../../node_modules/d3-time/src/year.js
var year = newInterval(function(date2) {
  date2.setMonth(0, 1);
  date2.setHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setFullYear(date2.getFullYear() + step);
}, function(start2, end) {
  return end.getFullYear() - start2.getFullYear();
}, function(date2) {
  return date2.getFullYear();
});
year.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval(function(date2) {
    date2.setFullYear(Math.floor(date2.getFullYear() / k3) * k3);
    date2.setMonth(0, 1);
    date2.setHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setFullYear(date2.getFullYear() + step * k3);
  });
};
var year_default = year;
var years = year.range;

// ../../node_modules/d3-time/src/utcMinute.js
var utcMinute = newInterval(function(date2) {
  date2.setUTCSeconds(0, 0);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationMinute);
}, function(start2, end) {
  return (end - start2) / durationMinute;
}, function(date2) {
  return date2.getUTCMinutes();
});
var utcMinute_default = utcMinute;
var utcMinutes = utcMinute.range;

// ../../node_modules/d3-time/src/utcHour.js
var utcHour = newInterval(function(date2) {
  date2.setUTCMinutes(0, 0, 0);
}, function(date2, step) {
  date2.setTime(+date2 + step * durationHour);
}, function(start2, end) {
  return (end - start2) / durationHour;
}, function(date2) {
  return date2.getUTCHours();
});
var utcHour_default = utcHour;
var utcHours = utcHour.range;

// ../../node_modules/d3-time/src/utcDay.js
var utcDay = newInterval(function(date2) {
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCDate(date2.getUTCDate() + step);
}, function(start2, end) {
  return (end - start2) / durationDay;
}, function(date2) {
  return date2.getUTCDate() - 1;
});
var utcDay_default = utcDay;
var utcDays = utcDay.range;

// ../../node_modules/d3-time/src/utcWeek.js
function utcWeekday(i3) {
  return newInterval(function(date2) {
    date2.setUTCDate(date2.getUTCDate() - (date2.getUTCDay() + 7 - i3) % 7);
    date2.setUTCHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setUTCDate(date2.getUTCDate() + step * 7);
  }, function(start2, end) {
    return (end - start2) / durationWeek;
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

// ../../node_modules/d3-time/src/utcMonth.js
var utcMonth = newInterval(function(date2) {
  date2.setUTCDate(1);
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCMonth(date2.getUTCMonth() + step);
}, function(start2, end) {
  return end.getUTCMonth() - start2.getUTCMonth() + (end.getUTCFullYear() - start2.getUTCFullYear()) * 12;
}, function(date2) {
  return date2.getUTCMonth();
});
var utcMonth_default = utcMonth;
var utcMonths = utcMonth.range;

// ../../node_modules/d3-time/src/utcYear.js
var utcYear = newInterval(function(date2) {
  date2.setUTCMonth(0, 1);
  date2.setUTCHours(0, 0, 0, 0);
}, function(date2, step) {
  date2.setUTCFullYear(date2.getUTCFullYear() + step);
}, function(start2, end) {
  return end.getUTCFullYear() - start2.getUTCFullYear();
}, function(date2) {
  return date2.getUTCFullYear();
});
utcYear.every = function(k3) {
  return !isFinite(k3 = Math.floor(k3)) || !(k3 > 0) ? null : newInterval(function(date2) {
    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / k3) * k3);
    date2.setUTCMonth(0, 1);
    date2.setUTCHours(0, 0, 0, 0);
  }, function(date2, step) {
    date2.setUTCFullYear(date2.getUTCFullYear() + step * k3);
  });
};
var utcYear_default = utcYear;
var utcYears = utcYear.range;

// ../../node_modules/d3-time/src/ticks.js
function ticker(year2, month2, week, day2, hour2, minute2) {
  const tickIntervals = [
    [second_default, 1, durationSecond],
    [second_default, 5, 5 * durationSecond],
    [second_default, 15, 15 * durationSecond],
    [second_default, 30, 30 * durationSecond],
    [minute2, 1, durationMinute],
    [minute2, 5, 5 * durationMinute],
    [minute2, 15, 15 * durationMinute],
    [minute2, 30, 30 * durationMinute],
    [hour2, 1, durationHour],
    [hour2, 3, 3 * durationHour],
    [hour2, 6, 6 * durationHour],
    [hour2, 12, 12 * durationHour],
    [day2, 1, durationDay],
    [day2, 2, 2 * durationDay],
    [week, 1, durationWeek],
    [month2, 1, durationMonth],
    [month2, 3, 3 * durationMonth],
    [year2, 1, durationYear]
  ];
  function ticks(start2, stop2, count) {
    const reverse = stop2 < start2;
    if (reverse)
      [start2, stop2] = [stop2, start2];
    const interval = count && typeof count.range === "function" ? count : tickInterval(start2, stop2, count);
    const ticks2 = interval ? interval.range(start2, +stop2 + 1) : [];
    return reverse ? ticks2.reverse() : ticks2;
  }
  function tickInterval(start2, stop2, count) {
    const target = Math.abs(stop2 - start2) / count;
    const i3 = bisector_default(([, , step2]) => step2).right(tickIntervals, target);
    if (i3 === tickIntervals.length)
      return year2.every(tickStep(start2 / durationYear, stop2 / durationYear, count));
    if (i3 === 0)
      return millisecond_default.every(Math.max(tickStep(start2, stop2, count), 1));
    const [t5, step] = tickIntervals[target / tickIntervals[i3 - 1][2] < tickIntervals[i3][2] / target ? i3 - 1 : i3];
    return t5.every(step);
  }
  return [ticks, tickInterval];
}
var [utcTicks, utcTickInterval] = ticker(utcYear_default, utcMonth_default, utcSunday, utcDay_default, utcHour_default, utcMinute_default);
var [timeTicks, timeTickInterval] = ticker(year_default, month_default, sunday, day_default, hour_default, minute_default);

// ../../node_modules/d3-time-format/src/locale.js
function localDate(d3) {
  if (0 <= d3.y && d3.y < 100) {
    var date2 = new Date(-1, d3.m, d3.d, d3.H, d3.M, d3.S, d3.L);
    date2.setFullYear(d3.y);
    return date2;
  }
  return new Date(d3.y, d3.m, d3.d, d3.H, d3.M, d3.S, d3.L);
}
function utcDate(d3) {
  if (0 <= d3.y && d3.y < 100) {
    var date2 = new Date(Date.UTC(-1, d3.m, d3.d, d3.H, d3.M, d3.S, d3.L));
    date2.setUTCFullYear(d3.y);
    return date2;
  }
  return new Date(Date.UTC(d3.y, d3.m, d3.d, d3.H, d3.M, d3.S, d3.L));
}
function newDate(y4, m4, d3) {
  return { y: y4, m: m4, d: d3, H: 0, M: 0, S: 0, L: 0 };
}
function formatLocale(locale4) {
  var locale_dateTime = locale4.dateTime, locale_date = locale4.date, locale_time = locale4.time, locale_periods = locale4.periods, locale_weekdays = locale4.days, locale_shortWeekdays = locale4.shortDays, locale_months = locale4.months, locale_shortMonths = locale4.shortMonths;
  var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "g": formatYearISO,
    "G": formatFullYearISO,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "g": formatUTCYearISO,
    "G": formatUTCFullYearISO,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "g": parseYear,
    "G": parseFullYear,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);
  function newFormat(specifier, formats2) {
    return function(date2) {
      var string = [], i3 = -1, j2 = 0, n3 = specifier.length, c8, pad2, format3;
      if (!(date2 instanceof Date))
        date2 = /* @__PURE__ */ new Date(+date2);
      while (++i3 < n3) {
        if (specifier.charCodeAt(i3) === 37) {
          string.push(specifier.slice(j2, i3));
          if ((pad2 = pads[c8 = specifier.charAt(++i3)]) != null)
            c8 = specifier.charAt(++i3);
          else
            pad2 = c8 === "e" ? " " : "0";
          if (format3 = formats2[c8])
            c8 = format3(date2, pad2);
          string.push(c8);
          j2 = i3 + 1;
        }
      }
      string.push(specifier.slice(j2, i3));
      return string.join("");
    };
  }
  function newParse(specifier, Z) {
    return function(string) {
      var d3 = newDate(1900, void 0, 1), i3 = parseSpecifier(d3, specifier, string += "", 0), week, day2;
      if (i3 != string.length)
        return null;
      if ("Q" in d3)
        return new Date(d3.Q);
      if ("s" in d3)
        return new Date(d3.s * 1e3 + ("L" in d3 ? d3.L : 0));
      if (Z && !("Z" in d3))
        d3.Z = 0;
      if ("p" in d3)
        d3.H = d3.H % 12 + d3.p * 12;
      if (d3.m === void 0)
        d3.m = "q" in d3 ? d3.q : 0;
      if ("V" in d3) {
        if (d3.V < 1 || d3.V > 53)
          return null;
        if (!("w" in d3))
          d3.w = 1;
        if ("Z" in d3) {
          week = utcDate(newDate(d3.y, 0, 1)), day2 = week.getUTCDay();
          week = day2 > 4 || day2 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay_default.offset(week, (d3.V - 1) * 7);
          d3.y = week.getUTCFullYear();
          d3.m = week.getUTCMonth();
          d3.d = week.getUTCDate() + (d3.w + 6) % 7;
        } else {
          week = localDate(newDate(d3.y, 0, 1)), day2 = week.getDay();
          week = day2 > 4 || day2 === 0 ? monday.ceil(week) : monday(week);
          week = day_default.offset(week, (d3.V - 1) * 7);
          d3.y = week.getFullYear();
          d3.m = week.getMonth();
          d3.d = week.getDate() + (d3.w + 6) % 7;
        }
      } else if ("W" in d3 || "U" in d3) {
        if (!("w" in d3))
          d3.w = "u" in d3 ? d3.u % 7 : "W" in d3 ? 1 : 0;
        day2 = "Z" in d3 ? utcDate(newDate(d3.y, 0, 1)).getUTCDay() : localDate(newDate(d3.y, 0, 1)).getDay();
        d3.m = 0;
        d3.d = "W" in d3 ? (d3.w + 6) % 7 + d3.W * 7 - (day2 + 5) % 7 : d3.w + d3.U * 7 - (day2 + 6) % 7;
      }
      if ("Z" in d3) {
        d3.H += d3.Z / 100 | 0;
        d3.M += d3.Z % 100;
        return utcDate(d3);
      }
      return localDate(d3);
    };
  }
  function parseSpecifier(d3, specifier, string, j2) {
    var i3 = 0, n3 = specifier.length, m4 = string.length, c8, parse;
    while (i3 < n3) {
      if (j2 >= m4)
        return -1;
      c8 = specifier.charCodeAt(i3++);
      if (c8 === 37) {
        c8 = specifier.charAt(i3++);
        parse = parses[c8 in pads ? specifier.charAt(i3++) : c8];
        if (!parse || (j2 = parse(d3, string, j2)) < 0)
          return -1;
      } else if (c8 != string.charCodeAt(j2++)) {
        return -1;
      }
    }
    return j2;
  }
  function parsePeriod(d3, string, i3) {
    var n3 = periodRe.exec(string.slice(i3));
    return n3 ? (d3.p = periodLookup.get(n3[0].toLowerCase()), i3 + n3[0].length) : -1;
  }
  function parseShortWeekday(d3, string, i3) {
    var n3 = shortWeekdayRe.exec(string.slice(i3));
    return n3 ? (d3.w = shortWeekdayLookup.get(n3[0].toLowerCase()), i3 + n3[0].length) : -1;
  }
  function parseWeekday(d3, string, i3) {
    var n3 = weekdayRe.exec(string.slice(i3));
    return n3 ? (d3.w = weekdayLookup.get(n3[0].toLowerCase()), i3 + n3[0].length) : -1;
  }
  function parseShortMonth(d3, string, i3) {
    var n3 = shortMonthRe.exec(string.slice(i3));
    return n3 ? (d3.m = shortMonthLookup.get(n3[0].toLowerCase()), i3 + n3[0].length) : -1;
  }
  function parseMonth(d3, string, i3) {
    var n3 = monthRe.exec(string.slice(i3));
    return n3 ? (d3.m = monthLookup.get(n3[0].toLowerCase()), i3 + n3[0].length) : -1;
  }
  function parseLocaleDateTime(d3, string, i3) {
    return parseSpecifier(d3, locale_dateTime, string, i3);
  }
  function parseLocaleDate(d3, string, i3) {
    return parseSpecifier(d3, locale_date, string, i3);
  }
  function parseLocaleTime(d3, string, i3) {
    return parseSpecifier(d3, locale_time, string, i3);
  }
  function formatShortWeekday(d3) {
    return locale_shortWeekdays[d3.getDay()];
  }
  function formatWeekday(d3) {
    return locale_weekdays[d3.getDay()];
  }
  function formatShortMonth(d3) {
    return locale_shortMonths[d3.getMonth()];
  }
  function formatMonth(d3) {
    return locale_months[d3.getMonth()];
  }
  function formatPeriod(d3) {
    return locale_periods[+(d3.getHours() >= 12)];
  }
  function formatQuarter(d3) {
    return 1 + ~~(d3.getMonth() / 3);
  }
  function formatUTCShortWeekday(d3) {
    return locale_shortWeekdays[d3.getUTCDay()];
  }
  function formatUTCWeekday(d3) {
    return locale_weekdays[d3.getUTCDay()];
  }
  function formatUTCShortMonth(d3) {
    return locale_shortMonths[d3.getUTCMonth()];
  }
  function formatUTCMonth(d3) {
    return locale_months[d3.getUTCMonth()];
  }
  function formatUTCPeriod(d3) {
    return locale_periods[+(d3.getUTCHours() >= 12)];
  }
  function formatUTCQuarter(d3) {
    return 1 + ~~(d3.getUTCMonth() / 3);
  }
  return {
    format: function(specifier) {
      var f4 = newFormat(specifier += "", formats);
      f4.toString = function() {
        return specifier;
      };
      return f4;
    },
    parse: function(specifier) {
      var p3 = newParse(specifier += "", false);
      p3.toString = function() {
        return specifier;
      };
      return p3;
    },
    utcFormat: function(specifier) {
      var f4 = newFormat(specifier += "", utcFormats);
      f4.toString = function() {
        return specifier;
      };
      return f4;
    },
    utcParse: function(specifier) {
      var p3 = newParse(specifier += "", true);
      p3.toString = function() {
        return specifier;
      };
      return p3;
    }
  };
}
var pads = { "-": "", "_": " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad(value, fill, width) {
  var sign2 = value < 0 ? "-" : "", string = (sign2 ? -value : value) + "", length = string.length;
  return sign2 + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}
function requote(s3) {
  return s3.replace(requoteRe, "\\$&");
}
function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
  return new Map(names.map((name, i3) => [name.toLowerCase(), i3]));
}
function parseWeekdayNumberSunday(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 1));
  return n3 ? (d3.w = +n3[0], i3 + n3[0].length) : -1;
}
function parseWeekdayNumberMonday(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 1));
  return n3 ? (d3.u = +n3[0], i3 + n3[0].length) : -1;
}
function parseWeekNumberSunday(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.U = +n3[0], i3 + n3[0].length) : -1;
}
function parseWeekNumberISO(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.V = +n3[0], i3 + n3[0].length) : -1;
}
function parseWeekNumberMonday(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.W = +n3[0], i3 + n3[0].length) : -1;
}
function parseFullYear(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 4));
  return n3 ? (d3.y = +n3[0], i3 + n3[0].length) : -1;
}
function parseYear(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.y = +n3[0] + (+n3[0] > 68 ? 1900 : 2e3), i3 + n3[0].length) : -1;
}
function parseZone(d3, string, i3) {
  var n3 = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i3, i3 + 6));
  return n3 ? (d3.Z = n3[1] ? 0 : -(n3[2] + (n3[3] || "00")), i3 + n3[0].length) : -1;
}
function parseQuarter(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 1));
  return n3 ? (d3.q = n3[0] * 3 - 3, i3 + n3[0].length) : -1;
}
function parseMonthNumber(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.m = n3[0] - 1, i3 + n3[0].length) : -1;
}
function parseDayOfMonth(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.d = +n3[0], i3 + n3[0].length) : -1;
}
function parseDayOfYear(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 3));
  return n3 ? (d3.m = 0, d3.d = +n3[0], i3 + n3[0].length) : -1;
}
function parseHour24(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.H = +n3[0], i3 + n3[0].length) : -1;
}
function parseMinutes(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.M = +n3[0], i3 + n3[0].length) : -1;
}
function parseSeconds(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 2));
  return n3 ? (d3.S = +n3[0], i3 + n3[0].length) : -1;
}
function parseMilliseconds(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 3));
  return n3 ? (d3.L = +n3[0], i3 + n3[0].length) : -1;
}
function parseMicroseconds(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3, i3 + 6));
  return n3 ? (d3.L = Math.floor(n3[0] / 1e3), i3 + n3[0].length) : -1;
}
function parseLiteralPercent(d3, string, i3) {
  var n3 = percentRe.exec(string.slice(i3, i3 + 1));
  return n3 ? i3 + n3[0].length : -1;
}
function parseUnixTimestamp(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3));
  return n3 ? (d3.Q = +n3[0], i3 + n3[0].length) : -1;
}
function parseUnixTimestampSeconds(d3, string, i3) {
  var n3 = numberRe.exec(string.slice(i3));
  return n3 ? (d3.s = +n3[0], i3 + n3[0].length) : -1;
}
function formatDayOfMonth(d3, p3) {
  return pad(d3.getDate(), p3, 2);
}
function formatHour24(d3, p3) {
  return pad(d3.getHours(), p3, 2);
}
function formatHour12(d3, p3) {
  return pad(d3.getHours() % 12 || 12, p3, 2);
}
function formatDayOfYear(d3, p3) {
  return pad(1 + day_default.count(year_default(d3), d3), p3, 3);
}
function formatMilliseconds(d3, p3) {
  return pad(d3.getMilliseconds(), p3, 3);
}
function formatMicroseconds(d3, p3) {
  return formatMilliseconds(d3, p3) + "000";
}
function formatMonthNumber(d3, p3) {
  return pad(d3.getMonth() + 1, p3, 2);
}
function formatMinutes(d3, p3) {
  return pad(d3.getMinutes(), p3, 2);
}
function formatSeconds(d3, p3) {
  return pad(d3.getSeconds(), p3, 2);
}
function formatWeekdayNumberMonday(d3) {
  var day2 = d3.getDay();
  return day2 === 0 ? 7 : day2;
}
function formatWeekNumberSunday(d3, p3) {
  return pad(sunday.count(year_default(d3) - 1, d3), p3, 2);
}
function dISO(d3) {
  var day2 = d3.getDay();
  return day2 >= 4 || day2 === 0 ? thursday(d3) : thursday.ceil(d3);
}
function formatWeekNumberISO(d3, p3) {
  d3 = dISO(d3);
  return pad(thursday.count(year_default(d3), d3) + (year_default(d3).getDay() === 4), p3, 2);
}
function formatWeekdayNumberSunday(d3) {
  return d3.getDay();
}
function formatWeekNumberMonday(d3, p3) {
  return pad(monday.count(year_default(d3) - 1, d3), p3, 2);
}
function formatYear(d3, p3) {
  return pad(d3.getFullYear() % 100, p3, 2);
}
function formatYearISO(d3, p3) {
  d3 = dISO(d3);
  return pad(d3.getFullYear() % 100, p3, 2);
}
function formatFullYear(d3, p3) {
  return pad(d3.getFullYear() % 1e4, p3, 4);
}
function formatFullYearISO(d3, p3) {
  var day2 = d3.getDay();
  d3 = day2 >= 4 || day2 === 0 ? thursday(d3) : thursday.ceil(d3);
  return pad(d3.getFullYear() % 1e4, p3, 4);
}
function formatZone(d3) {
  var z2 = d3.getTimezoneOffset();
  return (z2 > 0 ? "-" : (z2 *= -1, "+")) + pad(z2 / 60 | 0, "0", 2) + pad(z2 % 60, "0", 2);
}
function formatUTCDayOfMonth(d3, p3) {
  return pad(d3.getUTCDate(), p3, 2);
}
function formatUTCHour24(d3, p3) {
  return pad(d3.getUTCHours(), p3, 2);
}
function formatUTCHour12(d3, p3) {
  return pad(d3.getUTCHours() % 12 || 12, p3, 2);
}
function formatUTCDayOfYear(d3, p3) {
  return pad(1 + utcDay_default.count(utcYear_default(d3), d3), p3, 3);
}
function formatUTCMilliseconds(d3, p3) {
  return pad(d3.getUTCMilliseconds(), p3, 3);
}
function formatUTCMicroseconds(d3, p3) {
  return formatUTCMilliseconds(d3, p3) + "000";
}
function formatUTCMonthNumber(d3, p3) {
  return pad(d3.getUTCMonth() + 1, p3, 2);
}
function formatUTCMinutes(d3, p3) {
  return pad(d3.getUTCMinutes(), p3, 2);
}
function formatUTCSeconds(d3, p3) {
  return pad(d3.getUTCSeconds(), p3, 2);
}
function formatUTCWeekdayNumberMonday(d3) {
  var dow = d3.getUTCDay();
  return dow === 0 ? 7 : dow;
}
function formatUTCWeekNumberSunday(d3, p3) {
  return pad(utcSunday.count(utcYear_default(d3) - 1, d3), p3, 2);
}
function UTCdISO(d3) {
  var day2 = d3.getUTCDay();
  return day2 >= 4 || day2 === 0 ? utcThursday(d3) : utcThursday.ceil(d3);
}
function formatUTCWeekNumberISO(d3, p3) {
  d3 = UTCdISO(d3);
  return pad(utcThursday.count(utcYear_default(d3), d3) + (utcYear_default(d3).getUTCDay() === 4), p3, 2);
}
function formatUTCWeekdayNumberSunday(d3) {
  return d3.getUTCDay();
}
function formatUTCWeekNumberMonday(d3, p3) {
  return pad(utcMonday.count(utcYear_default(d3) - 1, d3), p3, 2);
}
function formatUTCYear(d3, p3) {
  return pad(d3.getUTCFullYear() % 100, p3, 2);
}
function formatUTCYearISO(d3, p3) {
  d3 = UTCdISO(d3);
  return pad(d3.getUTCFullYear() % 100, p3, 2);
}
function formatUTCFullYear(d3, p3) {
  return pad(d3.getUTCFullYear() % 1e4, p3, 4);
}
function formatUTCFullYearISO(d3, p3) {
  var day2 = d3.getUTCDay();
  d3 = day2 >= 4 || day2 === 0 ? utcThursday(d3) : utcThursday.ceil(d3);
  return pad(d3.getUTCFullYear() % 1e4, p3, 4);
}
function formatUTCZone() {
  return "+0000";
}
function formatLiteralPercent() {
  return "%";
}
function formatUnixTimestamp(d3) {
  return +d3;
}
function formatUnixTimestampSeconds(d3) {
  return Math.floor(+d3 / 1e3);
}

// ../../node_modules/d3-time-format/src/defaultLocale.js
var locale2;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale2({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function defaultLocale2(definition) {
  locale2 = formatLocale(definition);
  timeFormat = locale2.format;
  timeParse = locale2.parse;
  utcFormat = locale2.utcFormat;
  utcParse = locale2.utcParse;
  return locale2;
}

// ../../node_modules/d3-scale/src/time.js
function date(t5) {
  return new Date(t5);
}
function number2(t5) {
  return t5 instanceof Date ? +t5 : +/* @__PURE__ */ new Date(+t5);
}
function calendar(ticks, tickInterval, year2, month2, week, day2, hour2, minute2, second2, format3) {
  var scale = continuous(), invert = scale.invert, domain = scale.domain;
  var formatMillisecond = format3(".%L"), formatSecond = format3(":%S"), formatMinute = format3("%I:%M"), formatHour = format3("%I %p"), formatDay = format3("%a %d"), formatWeek = format3("%b %d"), formatMonth = format3("%B"), formatYear2 = format3("%Y");
  function tickFormat2(date2) {
    return (second2(date2) < date2 ? formatMillisecond : minute2(date2) < date2 ? formatSecond : hour2(date2) < date2 ? formatMinute : day2(date2) < date2 ? formatHour : month2(date2) < date2 ? week(date2) < date2 ? formatDay : formatWeek : year2(date2) < date2 ? formatMonth : formatYear2)(date2);
  }
  scale.invert = function(y4) {
    return new Date(invert(y4));
  };
  scale.domain = function(_) {
    return arguments.length ? domain(Array.from(_, number2)) : domain().map(date);
  };
  scale.ticks = function(interval) {
    var d3 = domain();
    return ticks(d3[0], d3[d3.length - 1], interval == null ? 10 : interval);
  };
  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat2 : format3(specifier);
  };
  scale.nice = function(interval) {
    var d3 = domain();
    if (!interval || typeof interval.range !== "function")
      interval = tickInterval(d3[0], d3[d3.length - 1], interval == null ? 10 : interval);
    return interval ? domain(nice(d3, interval)) : scale;
  };
  scale.copy = function() {
    return copy(scale, calendar(ticks, tickInterval, year2, month2, week, day2, hour2, minute2, second2, format3));
  };
  return scale;
}
function time() {
  return initRange.apply(calendar(timeTicks, timeTickInterval, year_default, month_default, sunday, day_default, hour_default, minute_default, second_default, timeFormat).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}

// ../../node_modules/d3-scale/src/utcTime.js
function utcTime() {
  return initRange.apply(calendar(utcTicks, utcTickInterval, utcYear_default, utcMonth_default, utcSunday, utcDay_default, utcHour_default, utcMinute_default, second_default, utcFormat).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}

// ../../node_modules/d3-scale-chromatic/src/colors.js
function colors_default(specifier) {
  var n3 = specifier.length / 6 | 0, colors2 = new Array(n3), i3 = 0;
  while (i3 < n3)
    colors2[i3] = "#" + specifier.slice(i3 * 6, ++i3 * 6);
  return colors2;
}

// ../../node_modules/d3-scale-chromatic/src/categorical/category10.js
var category10_default = colors_default("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

// ../../node_modules/d3-scale-chromatic/src/categorical/Accent.js
var Accent_default = colors_default("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

// ../../node_modules/d3-scale-chromatic/src/categorical/Dark2.js
var Dark2_default = colors_default("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

// ../../node_modules/d3-scale-chromatic/src/categorical/Paired.js
var Paired_default = colors_default("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

// ../../node_modules/d3-scale-chromatic/src/categorical/Pastel1.js
var Pastel1_default = colors_default("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

// ../../node_modules/d3-scale-chromatic/src/categorical/Pastel2.js
var Pastel2_default = colors_default("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

// ../../node_modules/d3-scale-chromatic/src/categorical/Set1.js
var Set1_default = colors_default("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

// ../../node_modules/d3-scale-chromatic/src/categorical/Set2.js
var Set2_default = colors_default("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

// ../../node_modules/d3-scale-chromatic/src/categorical/Set3.js
var Set3_default = colors_default("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

// ../../node_modules/d3-scale-chromatic/src/ramp.js
var ramp_default = (scheme28) => rgbBasis(scheme28[scheme28.length - 1]);

// ../../node_modules/d3-scale-chromatic/src/diverging/BrBG.js
var scheme = new Array(3).concat(
  "d8b365f5f5f55ab4ac",
  "a6611adfc27d80cdc1018571",
  "a6611adfc27df5f5f580cdc1018571",
  "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
  "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
  "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
  "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
  "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
  "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
).map(colors_default);
var BrBG_default = ramp_default(scheme);

// ../../node_modules/d3-scale-chromatic/src/diverging/PRGn.js
var scheme2 = new Array(3).concat(
  "af8dc3f7f7f77fbf7b",
  "7b3294c2a5cfa6dba0008837",
  "7b3294c2a5cff7f7f7a6dba0008837",
  "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
  "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
  "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
  "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
  "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
  "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
).map(colors_default);
var PRGn_default = ramp_default(scheme2);

// ../../node_modules/d3-scale-chromatic/src/diverging/PiYG.js
var scheme3 = new Array(3).concat(
  "e9a3c9f7f7f7a1d76a",
  "d01c8bf1b6dab8e1864dac26",
  "d01c8bf1b6daf7f7f7b8e1864dac26",
  "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
  "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
  "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
  "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
  "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
  "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
).map(colors_default);
var PiYG_default = ramp_default(scheme3);

// ../../node_modules/d3-scale-chromatic/src/diverging/PuOr.js
var scheme4 = new Array(3).concat(
  "998ec3f7f7f7f1a340",
  "5e3c99b2abd2fdb863e66101",
  "5e3c99b2abd2f7f7f7fdb863e66101",
  "542788998ec3d8daebfee0b6f1a340b35806",
  "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
  "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
  "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
  "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
  "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
).map(colors_default);
var PuOr_default = ramp_default(scheme4);

// ../../node_modules/d3-scale-chromatic/src/diverging/RdBu.js
var scheme5 = new Array(3).concat(
  "ef8a62f7f7f767a9cf",
  "ca0020f4a58292c5de0571b0",
  "ca0020f4a582f7f7f792c5de0571b0",
  "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
  "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
  "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
  "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
  "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
  "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
).map(colors_default);
var RdBu_default = ramp_default(scheme5);

// ../../node_modules/d3-scale-chromatic/src/diverging/RdGy.js
var scheme6 = new Array(3).concat(
  "ef8a62ffffff999999",
  "ca0020f4a582bababa404040",
  "ca0020f4a582ffffffbababa404040",
  "b2182bef8a62fddbc7e0e0e09999994d4d4d",
  "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
  "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
  "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
  "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
  "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
).map(colors_default);
var RdGy_default = ramp_default(scheme6);

// ../../node_modules/d3-scale-chromatic/src/diverging/RdYlBu.js
var scheme7 = new Array(3).concat(
  "fc8d59ffffbf91bfdb",
  "d7191cfdae61abd9e92c7bb6",
  "d7191cfdae61ffffbfabd9e92c7bb6",
  "d73027fc8d59fee090e0f3f891bfdb4575b4",
  "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
  "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
  "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
  "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
  "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
).map(colors_default);
var RdYlBu_default = ramp_default(scheme7);

// ../../node_modules/d3-scale-chromatic/src/diverging/RdYlGn.js
var scheme8 = new Array(3).concat(
  "fc8d59ffffbf91cf60",
  "d7191cfdae61a6d96a1a9641",
  "d7191cfdae61ffffbfa6d96a1a9641",
  "d73027fc8d59fee08bd9ef8b91cf601a9850",
  "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
  "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
  "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
  "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
  "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
).map(colors_default);
var RdYlGn_default = ramp_default(scheme8);

// ../../node_modules/d3-scale-chromatic/src/diverging/Spectral.js
var scheme9 = new Array(3).concat(
  "fc8d59ffffbf99d594",
  "d7191cfdae61abdda42b83ba",
  "d7191cfdae61ffffbfabdda42b83ba",
  "d53e4ffc8d59fee08be6f59899d5943288bd",
  "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
  "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
  "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
  "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
  "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
).map(colors_default);
var Spectral_default = ramp_default(scheme9);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/BuGn.js
var scheme10 = new Array(3).concat(
  "e5f5f999d8c92ca25f",
  "edf8fbb2e2e266c2a4238b45",
  "edf8fbb2e2e266c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a42ca25f006d2c",
  "edf8fbccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
  "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
).map(colors_default);
var BuGn_default = ramp_default(scheme10);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/BuPu.js
var scheme11 = new Array(3).concat(
  "e0ecf49ebcda8856a7",
  "edf8fbb3cde38c96c688419d",
  "edf8fbb3cde38c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
).map(colors_default);
var BuPu_default = ramp_default(scheme11);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/GnBu.js
var scheme12 = new Array(3).concat(
  "e0f3dba8ddb543a2ca",
  "f0f9e8bae4bc7bccc42b8cbe",
  "f0f9e8bae4bc7bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
  "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
  "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
).map(colors_default);
var GnBu_default = ramp_default(scheme12);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/OrRd.js
var scheme13 = new Array(3).concat(
  "fee8c8fdbb84e34a33",
  "fef0d9fdcc8afc8d59d7301f",
  "fef0d9fdcc8afc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59e34a33b30000",
  "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
  "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
).map(colors_default);
var OrRd_default = ramp_default(scheme13);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/PuBuGn.js
var scheme14 = new Array(3).concat(
  "ece2f0a6bddb1c9099",
  "f6eff7bdc9e167a9cf02818a",
  "f6eff7bdc9e167a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
  "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
  "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
).map(colors_default);
var PuBuGn_default = ramp_default(scheme14);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/PuBu.js
var scheme15 = new Array(3).concat(
  "ece7f2a6bddb2b8cbe",
  "f1eef6bdc9e174a9cf0570b0",
  "f1eef6bdc9e174a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
  "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
  "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
).map(colors_default);
var PuBu_default = ramp_default(scheme15);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/PuRd.js
var scheme16 = new Array(3).concat(
  "e7e1efc994c7dd1c77",
  "f1eef6d7b5d8df65b0ce1256",
  "f1eef6d7b5d8df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0dd1c77980043",
  "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
  "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
).map(colors_default);
var PuRd_default = ramp_default(scheme16);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/RdPu.js
var scheme17 = new Array(3).concat(
  "fde0ddfa9fb5c51b8a",
  "feebe2fbb4b9f768a1ae017e",
  "feebe2fbb4b9f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
  "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
  "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
).map(colors_default);
var RdPu_default = ramp_default(scheme17);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/YlGnBu.js
var scheme18 = new Array(3).concat(
  "edf8b17fcdbb2c7fb8",
  "ffffcca1dab441b6c4225ea8",
  "ffffcca1dab441b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
  "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
  "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
).map(colors_default);
var YlGnBu_default = ramp_default(scheme18);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/YlGn.js
var scheme19 = new Array(3).concat(
  "f7fcb9addd8e31a354",
  "ffffccc2e69978c679238443",
  "ffffccc2e69978c67931a354006837",
  "ffffccd9f0a3addd8e78c67931a354006837",
  "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
  "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
).map(colors_default);
var YlGn_default = ramp_default(scheme19);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/YlOrBr.js
var scheme20 = new Array(3).concat(
  "fff7bcfec44fd95f0e",
  "ffffd4fed98efe9929cc4c02",
  "ffffd4fed98efe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929d95f0e993404",
  "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
  "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
).map(colors_default);
var YlOrBr_default = ramp_default(scheme20);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/YlOrRd.js
var scheme21 = new Array(3).concat(
  "ffeda0feb24cf03b20",
  "ffffb2fecc5cfd8d3ce31a1c",
  "ffffb2fecc5cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cf03b20bd0026",
  "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
  "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
).map(colors_default);
var YlOrRd_default = ramp_default(scheme21);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Blues.js
var scheme22 = new Array(3).concat(
  "deebf79ecae13182bd",
  "eff3ffbdd7e76baed62171b5",
  "eff3ffbdd7e76baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed63182bd08519c",
  "eff3ffc6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
  "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
).map(colors_default);
var Blues_default = ramp_default(scheme22);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Greens.js
var scheme23 = new Array(3).concat(
  "e5f5e0a1d99b31a354",
  "edf8e9bae4b374c476238b45",
  "edf8e9bae4b374c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47631a354006d2c",
  "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
  "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
).map(colors_default);
var Greens_default = ramp_default(scheme23);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Greys.js
var scheme24 = new Array(3).concat(
  "f0f0f0bdbdbd636363",
  "f7f7f7cccccc969696525252",
  "f7f7f7cccccc969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696636363252525",
  "f7f7f7d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
  "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
).map(colors_default);
var Greys_default = ramp_default(scheme24);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Purples.js
var scheme25 = new Array(3).concat(
  "efedf5bcbddc756bb1",
  "f2f0f7cbc9e29e9ac86a51a3",
  "f2f0f7cbc9e29e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
  "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
  "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
).map(colors_default);
var Purples_default = ramp_default(scheme25);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Reds.js
var scheme26 = new Array(3).concat(
  "fee0d2fc9272de2d26",
  "fee5d9fcae91fb6a4acb181d",
  "fee5d9fcae91fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
  "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
  "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
).map(colors_default);
var Reds_default = ramp_default(scheme26);

// ../../node_modules/d3-scale-chromatic/src/sequential-single/Oranges.js
var scheme27 = new Array(3).concat(
  "fee6cefdae6be6550d",
  "feeddefdbe85fd8d3cd94701",
  "feeddefdbe85fd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3ce6550da63603",
  "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
  "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
).map(colors_default);
var Oranges_default = ramp_default(scheme27);

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/cividis.js
function cividis_default(t5) {
  t5 = Math.max(0, Math.min(1, t5));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - t5 * (35.34 - t5 * (2381.73 - t5 * (6402.7 - t5 * (7024.72 - t5 * 2710.57))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + t5 * (170.73 + t5 * (52.82 - t5 * (131.46 - t5 * (176.58 - t5 * 67.37))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + t5 * (442.36 - t5 * (2482.43 - t5 * (6167.24 - t5 * (6614.94 - t5 * 2475.67))))))) + ")";
}

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/cubehelix.js
var cubehelix_default2 = cubehelixLong(cubehelix(300, 0.5, 0), cubehelix(-240, 0.5, 1));

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/rainbow.js
var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
var c = cubehelix();
function rainbow_default(t5) {
  if (t5 < 0 || t5 > 1)
    t5 -= Math.floor(t5);
  var ts2 = Math.abs(t5 - 0.5);
  c.h = 360 * t5 - 100;
  c.s = 1.5 - 1.5 * ts2;
  c.l = 0.8 - 0.9 * ts2;
  return c + "";
}

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/sinebow.js
var c6 = rgb2();
var pi_1_3 = Math.PI / 3;
var pi_2_3 = Math.PI * 2 / 3;
function sinebow_default(t5) {
  var x5;
  t5 = (0.5 - t5) * Math.PI;
  c6.r = 255 * (x5 = Math.sin(t5)) * x5;
  c6.g = 255 * (x5 = Math.sin(t5 + pi_1_3)) * x5;
  c6.b = 255 * (x5 = Math.sin(t5 + pi_2_3)) * x5;
  return c6 + "";
}

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/turbo.js
function turbo_default(t5) {
  t5 = Math.max(0, Math.min(1, t5));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + t5 * (1172.33 - t5 * (10793.56 - t5 * (33300.12 - t5 * (38394.49 - t5 * 14825.05))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + t5 * (557.33 + t5 * (1225.33 - t5 * (3574.96 - t5 * (1073.77 + t5 * 707.56))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + t5 * (3211.1 - t5 * (15327.97 - t5 * (27814 - t5 * (22569.18 - t5 * 6838.66))))))) + ")";
}

// ../../node_modules/d3-scale-chromatic/src/sequential-multi/viridis.js
function ramp(range) {
  var n3 = range.length;
  return function(t5) {
    return range[Math.max(0, Math.min(n3 - 1, Math.floor(t5 * n3)))];
  };
}
var viridis_default = ramp(colors_default("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
var magma = ramp(colors_default("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
var inferno = ramp(colors_default("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
var plasma = ramp(colors_default("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

// ../../node_modules/@nivo/core/dist/nivo-core.es.js
var import_isFunction = __toESM(require_isFunction());
var import_without = __toESM(require_without());

// ../../node_modules/d3-path/src/path.js
var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;
function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null;
  this._ = "";
}
function path() {
  return new Path();
}
Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x5, y4) {
    this._ += "M" + (this._x0 = this._x1 = +x5) + "," + (this._y0 = this._y1 = +y4);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x5, y4) {
    this._ += "L" + (this._x1 = +x5) + "," + (this._y1 = +y4);
  },
  quadraticCurveTo: function(x1, y1, x5, y4) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x5) + "," + (this._y1 = +y4);
  },
  bezierCurveTo: function(x1, y1, x22, y22, x5, y4) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x22 + "," + +y22 + "," + (this._x1 = +x5) + "," + (this._y1 = +y4);
  },
  arcTo: function(x1, y1, x22, y22, r4) {
    x1 = +x1, y1 = +y1, x22 = +x22, y22 = +y22, r4 = +r4;
    var x0 = this._x1, y0 = this._y1, x21 = x22 - x1, y21 = y22 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (r4 < 0)
      throw new Error("negative radius: " + r4);
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else if (!(l01_2 > epsilon))
      ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r4) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    } else {
      var x20 = x22 - x0, y20 = y22 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l3 = r4 * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l3 / l01, t21 = l3 / l21;
      if (Math.abs(t01 - 1) > epsilon) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }
      this._ += "A" + r4 + "," + r4 + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x5, y4, r4, a0, a1, ccw) {
    x5 = +x5, y4 = +y4, r4 = +r4, ccw = !!ccw;
    var dx = r4 * Math.cos(a0), dy = r4 * Math.sin(a0), x0 = x5 + dx, y0 = y4 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (r4 < 0)
      throw new Error("negative radius: " + r4);
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._ += "L" + x0 + "," + y0;
    }
    if (!r4)
      return;
    if (da < 0)
      da = da % tau + tau;
    if (da > tauEpsilon) {
      this._ += "A" + r4 + "," + r4 + ",0,1," + cw + "," + (x5 - dx) + "," + (y4 - dy) + "A" + r4 + "," + r4 + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } else if (da > epsilon) {
      this._ += "A" + r4 + "," + r4 + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x5 + r4 * Math.cos(a1)) + "," + (this._y1 = y4 + r4 * Math.sin(a1));
    }
  },
  rect: function(x5, y4, w3, h3) {
    this._ += "M" + (this._x0 = this._x1 = +x5) + "," + (this._y0 = this._y1 = +y4) + "h" + +w3 + "v" + +h3 + "h" + -w3 + "Z";
  },
  toString: function() {
    return this._;
  }
};
var path_default = path;

// ../../node_modules/d3-shape/src/constant.js
function constant_default2(x5) {
  return function constant() {
    return x5;
  };
}

// ../../node_modules/d3-shape/src/math.js
var epsilon2 = 1e-12;
var pi2 = Math.PI;
var halfPi = pi2 / 2;
var tau2 = 2 * pi2;

// ../../node_modules/d3-shape/src/curve/linear.js
function Linear(context) {
  this._context = context;
}
Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(x5, y4);
        break;
    }
  }
};
function linear_default(context) {
  return new Linear(context);
}

// ../../node_modules/d3-shape/src/point.js
function x(p3) {
  return p3[0];
}
function y(p3) {
  return p3[1];
}

// ../../node_modules/d3-shape/src/line.js
function line_default() {
  var x5 = x, y4 = y, defined = constant_default2(true), context = null, curve = linear_default, output = null;
  function line(data) {
    var i3, n3 = data.length, d3, defined0 = false, buffer;
    if (context == null)
      output = curve(buffer = path_default());
    for (i3 = 0; i3 <= n3; ++i3) {
      if (!(i3 < n3 && defined(d3 = data[i3], i3, data)) === defined0) {
        if (defined0 = !defined0)
          output.lineStart();
        else
          output.lineEnd();
      }
      if (defined0)
        output.point(+x5(d3, i3, data), +y4(d3, i3, data));
    }
    if (buffer)
      return output = null, buffer + "" || null;
  }
  line.x = function(_) {
    return arguments.length ? (x5 = typeof _ === "function" ? _ : constant_default2(+_), line) : x5;
  };
  line.y = function(_) {
    return arguments.length ? (y4 = typeof _ === "function" ? _ : constant_default2(+_), line) : y4;
  };
  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default2(!!_), line) : defined;
  };
  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };
  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };
  return line;
}

// ../../node_modules/d3-shape/src/area.js
function area_default() {
  var x0 = x, x1 = null, y0 = constant_default2(0), y1 = y, defined = constant_default2(true), context = null, curve = linear_default, output = null;
  function area(data) {
    var i3, j2, k3, n3 = data.length, d3, defined0 = false, buffer, x0z = new Array(n3), y0z = new Array(n3);
    if (context == null)
      output = curve(buffer = path_default());
    for (i3 = 0; i3 <= n3; ++i3) {
      if (!(i3 < n3 && defined(d3 = data[i3], i3, data)) === defined0) {
        if (defined0 = !defined0) {
          j2 = i3;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k3 = i3 - 1; k3 >= j2; --k3) {
            output.point(x0z[k3], y0z[k3]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i3] = +x0(d3, i3, data), y0z[i3] = +y0(d3, i3, data);
        output.point(x1 ? +x1(d3, i3, data) : x0z[i3], y1 ? +y1(d3, i3, data) : y0z[i3]);
      }
    }
    if (buffer)
      return output = null, buffer + "" || null;
  }
  function arealine() {
    return line_default().defined(defined).curve(curve).context(context);
  }
  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default2(+_), x1 = null, area) : x0;
  };
  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant_default2(+_), area) : x0;
  };
  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant_default2(+_), area) : x1;
  };
  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default2(+_), y1 = null, area) : y0;
  };
  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant_default2(+_), area) : y0;
  };
  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant_default2(+_), area) : y1;
  };
  area.lineX0 = area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };
  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };
  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };
  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default2(!!_), area) : defined;
  };
  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };
  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };
  return area;
}

// ../../node_modules/d3-shape/src/noop.js
function noop_default() {
}

// ../../node_modules/d3-shape/src/curve/basis.js
function point2(that, x5, y4) {
  that._context.bezierCurveTo(
    (2 * that._x0 + that._x1) / 3,
    (2 * that._y0 + that._y1) / 3,
    (that._x0 + 2 * that._x1) / 3,
    (that._y0 + 2 * that._y1) / 3,
    (that._x0 + 4 * that._x1 + x5) / 6,
    (that._y0 + 4 * that._y1 + y4) / 6
  );
}
function Basis(context) {
  this._context = context;
}
Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        point2(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        point2(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = x5;
    this._y0 = this._y1, this._y1 = y4;
  }
};
function basis_default2(context) {
  return new Basis(context);
}

// ../../node_modules/d3-shape/src/curve/basisClosed.js
function BasisClosed(context) {
  this._context = context;
}
BasisClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x2 = x5, this._y2 = y4;
        break;
      case 1:
        this._point = 2;
        this._x3 = x5, this._y3 = y4;
        break;
      case 2:
        this._point = 3;
        this._x4 = x5, this._y4 = y4;
        this._context.moveTo((this._x0 + 4 * this._x1 + x5) / 6, (this._y0 + 4 * this._y1 + y4) / 6);
        break;
      default:
        point2(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = x5;
    this._y0 = this._y1, this._y1 = y4;
  }
};
function basisClosed_default2(context) {
  return new BasisClosed(context);
}

// ../../node_modules/d3-shape/src/curve/basisOpen.js
function BasisOpen(context) {
  this._context = context;
}
BasisOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var x0 = (this._x0 + 4 * this._x1 + x5) / 6, y0 = (this._y0 + 4 * this._y1 + y4) / 6;
        this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
        break;
      case 3:
        this._point = 4;
      default:
        point2(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = x5;
    this._y0 = this._y1, this._y1 = y4;
  }
};
function basisOpen_default(context) {
  return new BasisOpen(context);
}

// ../../node_modules/d3-shape/src/curve/bundle.js
function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}
Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x5 = this._x, y4 = this._y, j2 = x5.length - 1;
    if (j2 > 0) {
      var x0 = x5[0], y0 = y4[0], dx = x5[j2] - x0, dy = y4[j2] - y0, i3 = -1, t5;
      while (++i3 <= j2) {
        t5 = i3 / j2;
        this._basis.point(
          this._beta * x5[i3] + (1 - this._beta) * (x0 + t5 * dx),
          this._beta * y4[i3] + (1 - this._beta) * (y0 + t5 * dy)
        );
      }
    }
    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x5, y4) {
    this._x.push(+x5);
    this._y.push(+y4);
  }
};
var bundle_default = function custom(beta) {
  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }
  bundle.beta = function(beta2) {
    return custom(+beta2);
  };
  return bundle;
}(0.85);

// ../../node_modules/d3-shape/src/curve/cardinal.js
function point3(that, x5, y4) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x5),
    that._y2 + that._k * (that._y1 - y4),
    that._x2,
    that._y2
  );
}
function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        point3(this, this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
        this._x1 = x5, this._y1 = y4;
        break;
      case 2:
        this._point = 3;
      default:
        point3(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var cardinal_default = function custom2(tension) {
  function cardinal(context) {
    return new Cardinal(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom2(+tension2);
  };
  return cardinal;
}(0);

// ../../node_modules/d3-shape/src/curve/cardinalClosed.js
function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
CardinalClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x5, this._y3 = y4;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x5, this._y4 = y4);
        break;
      case 2:
        this._point = 3;
        this._x5 = x5, this._y5 = y4;
        break;
      default:
        point3(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var cardinalClosed_default = function custom3(tension) {
  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom3(+tension2);
  };
  return cardinal;
}(0);

// ../../node_modules/d3-shape/src/curve/cardinalOpen.js
function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}
CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point3(this, x5, y4);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var cardinalOpen_default = function custom4(tension) {
  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }
  cardinal.tension = function(tension2) {
    return custom4(+tension2);
  };
  return cardinal;
}(0);

// ../../node_modules/d3-shape/src/curve/catmullRom.js
function point4(that, x5, y4) {
  var x1 = that._x1, y1 = that._y1, x22 = that._x2, y22 = that._y2;
  if (that._l01_a > epsilon2) {
    var a3 = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n3 = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a3 - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n3;
    y1 = (y1 * a3 - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n3;
  }
  if (that._l23_a > epsilon2) {
    var b4 = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m4 = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x22 = (x22 * b4 + that._x1 * that._l23_2a - x5 * that._l12_2a) / m4;
    y22 = (y22 * b4 + that._y1 * that._l23_2a - y4 * that._l12_2a) / m4;
  }
  that._context.bezierCurveTo(x1, y1, x22, y22, that._x2, that._y2);
}
function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    if (this._point) {
      var x23 = this._x2 - x5, y23 = this._y2 - y4;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        point4(this, x5, y4);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var catmullRom_default = function custom5(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom5(+alpha2);
  };
  return catmullRom;
}(0.5);

// ../../node_modules/d3-shape/src/curve/catmullRomClosed.js
function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRomClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    if (this._point) {
      var x23 = this._x2 - x5, y23 = this._y2 - y4;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x5, this._y3 = y4;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x5, this._y4 = y4);
        break;
      case 2:
        this._point = 3;
        this._x5 = x5, this._y5 = y4;
        break;
      default:
        point4(this, x5, y4);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var catmullRomClosed_default = function custom6(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom6(+alpha2);
  };
  return catmullRom;
}(0.5);

// ../../node_modules/d3-shape/src/curve/catmullRomOpen.js
function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}
CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    if (this._point) {
      var x23 = this._x2 - x5, y23 = this._y2 - y4;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point4(this, x5, y4);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x5;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y4;
  }
};
var catmullRomOpen_default = function custom7(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom7(+alpha2);
  };
  return catmullRom;
}(0.5);

// ../../node_modules/d3-shape/src/curve/linearClosed.js
function LinearClosed(context) {
  this._context = context;
}
LinearClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._point)
      this._context.closePath();
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    if (this._point)
      this._context.lineTo(x5, y4);
    else
      this._point = 1, this._context.moveTo(x5, y4);
  }
};
function linearClosed_default(context) {
  return new LinearClosed(context);
}

// ../../node_modules/d3-shape/src/curve/monotone.js
function sign(x5) {
  return x5 < 0 ? -1 : 1;
}
function slope3(that, x22, y22) {
  var h0 = that._x1 - that._x0, h1 = x22 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y22 - that._y1) / (h1 || h0 < 0 && -0), p3 = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p3)) || 0;
}
function slope2(that, t5) {
  var h3 = that._x1 - that._x0;
  return h3 ? (3 * (that._y1 - that._y0) / h3 - t5) / 2 : t5;
}
function point5(that, t02, t12) {
  var x0 = that._x0, y0 = that._y0, x1 = that._x1, y1 = that._y1, dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t02, x1 - dx, y1 - dx * t12, x1, y1);
}
function MonotoneX(context) {
  this._context = context;
}
MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        point5(this, this._t0, slope2(this, this._t0));
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    var t12 = NaN;
    x5 = +x5, y4 = +y4;
    if (x5 === this._x1 && y4 === this._y1)
      return;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        point5(this, slope2(this, t12 = slope3(this, x5, y4)), t12);
        break;
      default:
        point5(this, this._t0, t12 = slope3(this, x5, y4));
        break;
    }
    this._x0 = this._x1, this._x1 = x5;
    this._y0 = this._y1, this._y1 = y4;
    this._t0 = t12;
  }
};
function MonotoneY(context) {
  this._context = new ReflectContext(context);
}
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x5, y4) {
  MonotoneX.prototype.point.call(this, y4, x5);
};
function ReflectContext(context) {
  this._context = context;
}
ReflectContext.prototype = {
  moveTo: function(x5, y4) {
    this._context.moveTo(y4, x5);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(x5, y4) {
    this._context.lineTo(y4, x5);
  },
  bezierCurveTo: function(x1, y1, x22, y22, x5, y4) {
    this._context.bezierCurveTo(y1, x1, y22, x22, y4, x5);
  }
};
function monotoneX(context) {
  return new MonotoneX(context);
}
function monotoneY(context) {
  return new MonotoneY(context);
}

// ../../node_modules/d3-shape/src/curve/natural.js
function Natural(context) {
  this._context = context;
}
Natural.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function() {
    var x5 = this._x, y4 = this._y, n3 = x5.length;
    if (n3) {
      this._line ? this._context.lineTo(x5[0], y4[0]) : this._context.moveTo(x5[0], y4[0]);
      if (n3 === 2) {
        this._context.lineTo(x5[1], y4[1]);
      } else {
        var px = controlPoints(x5), py = controlPoints(y4);
        for (var i0 = 0, i1 = 1; i1 < n3; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x5[i1], y4[i1]);
        }
      }
    }
    if (this._line || this._line !== 0 && n3 === 1)
      this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function(x5, y4) {
    this._x.push(+x5);
    this._y.push(+y4);
  }
};
function controlPoints(x5) {
  var i3, n3 = x5.length - 1, m4, a3 = new Array(n3), b4 = new Array(n3), r4 = new Array(n3);
  a3[0] = 0, b4[0] = 2, r4[0] = x5[0] + 2 * x5[1];
  for (i3 = 1; i3 < n3 - 1; ++i3)
    a3[i3] = 1, b4[i3] = 4, r4[i3] = 4 * x5[i3] + 2 * x5[i3 + 1];
  a3[n3 - 1] = 2, b4[n3 - 1] = 7, r4[n3 - 1] = 8 * x5[n3 - 1] + x5[n3];
  for (i3 = 1; i3 < n3; ++i3)
    m4 = a3[i3] / b4[i3 - 1], b4[i3] -= m4, r4[i3] -= m4 * r4[i3 - 1];
  a3[n3 - 1] = r4[n3 - 1] / b4[n3 - 1];
  for (i3 = n3 - 2; i3 >= 0; --i3)
    a3[i3] = (r4[i3] - a3[i3 + 1]) / b4[i3];
  b4[n3 - 1] = (x5[n3] + a3[n3 - 1]) / 2;
  for (i3 = 0; i3 < n3 - 1; ++i3)
    b4[i3] = 2 * x5[i3 + 1] - a3[i3 + 1];
  return [a3, b4];
}
function natural_default(context) {
  return new Natural(context);
}

// ../../node_modules/d3-shape/src/curve/step.js
function Step(context, t5) {
  this._context = context;
  this._t = t5;
}
Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2)
      this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    if (this._line >= 0)
      this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x5, y4) {
    x5 = +x5, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x5, y4) : this._context.moveTo(x5, y4);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y4);
          this._context.lineTo(x5, y4);
        } else {
          var x1 = this._x * (1 - this._t) + x5 * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y4);
        }
        break;
      }
    }
    this._x = x5, this._y = y4;
  }
};
function step_default(context) {
  return new Step(context, 0.5);
}
function stepBefore(context) {
  return new Step(context, 0);
}
function stepAfter(context) {
  return new Step(context, 1);
}

// ../../node_modules/d3-shape/src/offset/none.js
function none_default(series, order) {
  if (!((n3 = series.length) > 1))
    return;
  for (var i3 = 1, j2, s0, s1 = series[order[0]], n3, m4 = s1.length; i3 < n3; ++i3) {
    s0 = s1, s1 = series[order[i3]];
    for (j2 = 0; j2 < m4; ++j2) {
      s1[j2][1] += s1[j2][0] = isNaN(s0[j2][1]) ? s0[j2][0] : s0[j2][1];
    }
  }
}

// ../../node_modules/d3-shape/src/order/none.js
function none_default2(series) {
  var n3 = series.length, o3 = new Array(n3);
  while (--n3 >= 0)
    o3[n3] = n3;
  return o3;
}

// ../../node_modules/d3-shape/src/offset/expand.js
function expand_default(series, order) {
  if (!((n3 = series.length) > 0))
    return;
  for (var i3, n3, j2 = 0, m4 = series[0].length, y4; j2 < m4; ++j2) {
    for (y4 = i3 = 0; i3 < n3; ++i3)
      y4 += series[i3][j2][1] || 0;
    if (y4)
      for (i3 = 0; i3 < n3; ++i3)
        series[i3][j2][1] /= y4;
  }
  none_default(series, order);
}

// ../../node_modules/d3-shape/src/offset/diverging.js
function diverging_default(series, order) {
  if (!((n3 = series.length) > 0))
    return;
  for (var i3, j2 = 0, d3, dy, yp, yn, n3, m4 = series[order[0]].length; j2 < m4; ++j2) {
    for (yp = yn = 0, i3 = 0; i3 < n3; ++i3) {
      if ((dy = (d3 = series[order[i3]][j2])[1] - d3[0]) > 0) {
        d3[0] = yp, d3[1] = yp += dy;
      } else if (dy < 0) {
        d3[1] = yn, d3[0] = yn += dy;
      } else {
        d3[0] = 0, d3[1] = dy;
      }
    }
  }
}

// ../../node_modules/d3-shape/src/offset/silhouette.js
function silhouette_default(series, order) {
  if (!((n3 = series.length) > 0))
    return;
  for (var j2 = 0, s0 = series[order[0]], n3, m4 = s0.length; j2 < m4; ++j2) {
    for (var i3 = 0, y4 = 0; i3 < n3; ++i3)
      y4 += series[i3][j2][1] || 0;
    s0[j2][1] += s0[j2][0] = -y4 / 2;
  }
  none_default(series, order);
}

// ../../node_modules/d3-shape/src/offset/wiggle.js
function wiggle_default(series, order) {
  if (!((n3 = series.length) > 0) || !((m4 = (s0 = series[order[0]]).length) > 0))
    return;
  for (var y4 = 0, j2 = 1, s0, m4, n3; j2 < m4; ++j2) {
    for (var i3 = 0, s1 = 0, s22 = 0; i3 < n3; ++i3) {
      var si2 = series[order[i3]], sij0 = si2[j2][1] || 0, sij1 = si2[j2 - 1][1] || 0, s3 = (sij0 - sij1) / 2;
      for (var k3 = 0; k3 < i3; ++k3) {
        var sk = series[order[k3]], skj0 = sk[j2][1] || 0, skj1 = sk[j2 - 1][1] || 0;
        s3 += skj0 - skj1;
      }
      s1 += sij0, s22 += s3 * sij0;
    }
    s0[j2 - 1][1] += s0[j2 - 1][0] = y4;
    if (s1)
      y4 -= s22 / s1;
  }
  s0[j2 - 1][1] += s0[j2 - 1][0] = y4;
  none_default(series, order);
}

// ../../node_modules/d3-shape/src/order/appearance.js
function appearance_default(series) {
  var peaks = series.map(peak);
  return none_default2(series).sort(function(a3, b4) {
    return peaks[a3] - peaks[b4];
  });
}
function peak(series) {
  var i3 = -1, j2 = 0, n3 = series.length, vi, vj = -Infinity;
  while (++i3 < n3)
    if ((vi = +series[i3][1]) > vj)
      vj = vi, j2 = i3;
  return j2;
}

// ../../node_modules/d3-shape/src/order/ascending.js
function ascending_default2(series) {
  var sums = series.map(sum);
  return none_default2(series).sort(function(a3, b4) {
    return sums[a3] - sums[b4];
  });
}
function sum(series) {
  var s3 = 0, i3 = -1, n3 = series.length, v4;
  while (++i3 < n3)
    if (v4 = +series[i3][1])
      s3 += v4;
  return s3;
}

// ../../node_modules/d3-shape/src/order/descending.js
function descending_default(series) {
  return ascending_default2(series).reverse();
}

// ../../node_modules/d3-shape/src/order/insideOut.js
function insideOut_default(series) {
  var n3 = series.length, i3, j2, sums = series.map(sum), order = appearance_default(series), top = 0, bottom = 0, tops = [], bottoms = [];
  for (i3 = 0; i3 < n3; ++i3) {
    j2 = order[i3];
    if (top < bottom) {
      top += sums[j2];
      tops.push(j2);
    } else {
      bottom += sums[j2];
      bottoms.push(j2);
    }
  }
  return bottoms.reverse().concat(tops);
}

// ../../node_modules/d3-shape/src/order/reverse.js
function reverse_default(series) {
  return none_default2(series).reverse();
}

// ../../node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default2(x5) {
  return Math.abs(x5 = Math.round(x5)) >= 1e21 ? x5.toLocaleString("en").replace(/,/g, "") : x5.toString(10);
}
function formatDecimalParts2(x5, p3) {
  if ((i3 = (x5 = p3 ? x5.toExponential(p3 - 1) : x5.toExponential()).indexOf("e")) < 0)
    return null;
  var i3, coefficient = x5.slice(0, i3);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x5.slice(i3 + 1)
  ];
}

// ../../node_modules/d3-format/src/exponent.js
function exponent_default2(x5) {
  return x5 = formatDecimalParts2(Math.abs(x5)), x5 ? x5[1] : NaN;
}

// ../../node_modules/d3-format/src/formatGroup.js
function formatGroup_default2(grouping, thousands) {
  return function(value, width) {
    var i3 = value.length, t5 = [], j2 = 0, g3 = grouping[0], length = 0;
    while (i3 > 0 && g3 > 0) {
      if (length + g3 + 1 > width)
        g3 = Math.max(1, width - length);
      t5.push(value.substring(i3 -= g3, i3 + g3));
      if ((length += g3 + 1) > width)
        break;
      g3 = grouping[j2 = (j2 + 1) % grouping.length];
    }
    return t5.reverse().join(thousands);
  };
}

// ../../node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default2(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i3) {
      return numerals[+i3];
    });
  };
}

// ../../node_modules/d3-format/src/formatSpecifier.js
var re2 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier2(specifier) {
  if (!(match = re2.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier2({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier2.prototype = FormatSpecifier2.prototype;
function FormatSpecifier2(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier2.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// ../../node_modules/d3-format/src/formatTrim.js
function formatTrim_default2(s3) {
  out:
    for (var n3 = s3.length, i3 = 1, i0 = -1, i1; i3 < n3; ++i3) {
      switch (s3[i3]) {
        case ".":
          i0 = i1 = i3;
          break;
        case "0":
          if (i0 === 0)
            i0 = i3;
          i1 = i3;
          break;
        default:
          if (!+s3[i3])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s3.slice(0, i0) + s3.slice(i1 + 1) : s3;
}

// ../../node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent2;
function formatPrefixAuto_default2(x5, p3) {
  var d3 = formatDecimalParts2(x5, p3);
  if (!d3)
    return x5 + "";
  var coefficient = d3[0], exponent = d3[1], i3 = exponent - (prefixExponent2 = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n3 = coefficient.length;
  return i3 === n3 ? coefficient : i3 > n3 ? coefficient + new Array(i3 - n3 + 1).join("0") : i3 > 0 ? coefficient.slice(0, i3) + "." + coefficient.slice(i3) : "0." + new Array(1 - i3).join("0") + formatDecimalParts2(x5, Math.max(0, p3 + i3 - 1))[0];
}

// ../../node_modules/d3-format/src/formatRounded.js
function formatRounded_default2(x5, p3) {
  var d3 = formatDecimalParts2(x5, p3);
  if (!d3)
    return x5 + "";
  var coefficient = d3[0], exponent = d3[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// ../../node_modules/d3-format/src/formatTypes.js
var formatTypes_default2 = {
  "%": function(x5, p3) {
    return (x5 * 100).toFixed(p3);
  },
  "b": function(x5) {
    return Math.round(x5).toString(2);
  },
  "c": function(x5) {
    return x5 + "";
  },
  "d": formatDecimal_default2,
  "e": function(x5, p3) {
    return x5.toExponential(p3);
  },
  "f": function(x5, p3) {
    return x5.toFixed(p3);
  },
  "g": function(x5, p3) {
    return x5.toPrecision(p3);
  },
  "o": function(x5) {
    return Math.round(x5).toString(8);
  },
  "p": function(x5, p3) {
    return formatRounded_default2(x5 * 100, p3);
  },
  "r": formatRounded_default2,
  "s": formatPrefixAuto_default2,
  "X": function(x5) {
    return Math.round(x5).toString(16).toUpperCase();
  },
  "x": function(x5) {
    return Math.round(x5).toString(16);
  }
};

// ../../node_modules/d3-format/src/identity.js
function identity_default2(x5) {
  return x5;
}

// ../../node_modules/d3-format/src/locale.js
var map2 = Array.prototype.map;
var prefixes3 = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default2(locale4) {
  var group = locale4.grouping === void 0 || locale4.thousands === void 0 ? identity_default2 : formatGroup_default2(map2.call(locale4.grouping, Number), locale4.thousands + ""), currencyPrefix = locale4.currency === void 0 ? "" : locale4.currency[0] + "", currencySuffix = locale4.currency === void 0 ? "" : locale4.currency[1] + "", decimal = locale4.decimal === void 0 ? "." : locale4.decimal + "", numerals = locale4.numerals === void 0 ? identity_default2 : formatNumerals_default2(map2.call(locale4.numerals, String)), percent = locale4.percent === void 0 ? "%" : locale4.percent + "", minus = locale4.minus === void 0 ? "-" : locale4.minus + "", nan = locale4.nan === void 0 ? "NaN" : locale4.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier2(specifier);
    var fill = specifier.fill, align = specifier.align, sign2 = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n")
      comma = true, type = "g";
    else if (!formatTypes_default2[type])
      precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero2 || fill === "0" && align === "=")
      zero2 = true, fill = "0", align = "=";
    var prefix2 = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes_default2[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format3(value) {
      var valuePrefix = prefix2, valueSuffix = suffix, i3, n3, c8;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim)
          value = formatTrim_default2(value);
        if (valueNegative && +value === 0 && sign2 !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign2 === "(" ? sign2 : minus : sign2 === "-" || sign2 === "(" ? "" : sign2) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes3[8 + prefixExponent2 / 3] : "") + valueSuffix + (valueNegative && sign2 === "(" ? ")" : "");
        if (maybeSuffix) {
          i3 = -1, n3 = value.length;
          while (++i3 < n3) {
            if (c8 = value.charCodeAt(i3), 48 > c8 || c8 > 57) {
              valueSuffix = (c8 === 46 ? decimal + value.slice(i3 + 1) : value.slice(i3)) + valueSuffix;
              value = value.slice(0, i3);
              break;
            }
          }
        }
      }
      if (comma && !zero2)
        value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero2)
        value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format3.toString = function() {
      return specifier + "";
    };
    return format3;
  }
  function formatPrefix3(specifier, value) {
    var f4 = newFormat((specifier = formatSpecifier2(specifier), specifier.type = "f", specifier)), e6 = Math.max(-8, Math.min(8, Math.floor(exponent_default2(value) / 3))) * 3, k3 = Math.pow(10, -e6), prefix2 = prefixes3[8 + e6 / 3];
    return function(value2) {
      return f4(k3 * value2) + prefix2;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix3
  };
}

// ../../node_modules/d3-format/src/defaultLocale.js
var locale3;
var format2;
var formatPrefix2;
defaultLocale3({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});
function defaultLocale3(definition) {
  locale3 = locale_default2(definition);
  format2 = locale3.format;
  formatPrefix2 = locale3.formatPrefix;
  return locale3;
}

// ../../node_modules/@nivo/recompose/dist/nivo-recompose.es.js
var import_react4 = __toESM(require_react());

// ../../node_modules/react-lifecycles-compat/react-lifecycles-compat.es.js
function componentWillMount() {
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== void 0) {
    this.setState(state);
  }
}
function componentWillReceiveProps(nextProps) {
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== void 0 ? state : null;
  }
  this.setState(updater.bind(this));
}
function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

// ../../node_modules/@nivo/core/dist/nivo-core.es.js
var import_isEqual = __toESM(require_isEqual());
var import_isPlainObject = __toESM(require_isPlainObject());
var import_pick = __toESM(require_pick());
function Gr() {
  return Gr = Object.assign || function(e6) {
    for (var r4 = 1; r4 < arguments.length; r4++) {
      var t5 = arguments[r4];
      for (var i3 in t5)
        Object.prototype.hasOwnProperty.call(t5, i3) && (e6[i3] = t5[i3]);
    }
    return e6;
  }, Gr.apply(this, arguments);
}
function Br(e6, r4) {
  return Br = Object.setPrototypeOf || function(e7, r5) {
    return e7.__proto__ = r5, e7;
  }, Br(e6, r4);
}
function Lr(e6, r4) {
  if (null == e6)
    return {};
  var t5, i3, n3 = {}, o3 = Object.keys(e6);
  for (i3 = 0; i3 < o3.length; i3++)
    t5 = o3[i3], r4.indexOf(t5) >= 0 || (n3[t5] = e6[t5]);
  return n3;
}
var Ir = { fill: import_prop_types.default.string, fontSize: import_prop_types.default.number, fontFamily: import_prop_types.default.string };
var Yr = import_prop_types.default.shape({ domain: import_prop_types.default.shape({ line: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, strokeDasharray: import_prop_types.default.string }).isRequired }).isRequired, ticks: import_prop_types.default.shape({ line: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, strokeDasharray: import_prop_types.default.string }).isRequired, text: import_prop_types.default.shape(Gr({}, Ir)).isRequired }).isRequired, legend: import_prop_types.default.shape({ text: import_prop_types.default.shape(Gr({}, Ir)).isRequired }).isRequired });
var Ar = import_prop_types.default.shape({ line: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, strokeDasharray: import_prop_types.default.string }).isRequired });
var Fr = import_prop_types.default.shape({ hidden: import_prop_types.default.shape({ symbol: import_prop_types.default.shape({ fill: import_prop_types.default.string.isRequired, opacity: import_prop_types.default.number }).isRequired, text: import_prop_types.default.shape(Gr({}, Ir, { opacity: import_prop_types.default.number })).isRequired }).isRequired, text: import_prop_types.default.shape(Gr({}, Ir)).isRequired });
var Er = import_prop_types.default.shape({ text: import_prop_types.default.shape(Gr({}, Ir)).isRequired });
var Ur = import_prop_types.default.shape({ text: import_prop_types.default.shape(Gr({}, Ir)).isRequired });
var Xr = import_prop_types.default.shape({ text: import_prop_types.default.shape(Gr({}, Ir)).isRequired });
var Kr = import_prop_types.default.shape({ line: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, strokeDasharray: import_prop_types.default.string }).isRequired });
var Hr = import_prop_types.default.shape({ text: import_prop_types.default.shape(Gr({}, Ir, { outlineWidth: import_prop_types.default.number.isRequired, outlineColor: import_prop_types.default.string.isRequired })).isRequired, link: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, outlineWidth: import_prop_types.default.number.isRequired, outlineColor: import_prop_types.default.string.isRequired }).isRequired, outline: import_prop_types.default.shape({ stroke: import_prop_types.default.string.isRequired, strokeWidth: import_prop_types.default.number.isRequired, outlineWidth: import_prop_types.default.number.isRequired, outlineColor: import_prop_types.default.string.isRequired }).isRequired, symbol: import_prop_types.default.shape({ fill: import_prop_types.default.string.isRequired, outlineWidth: import_prop_types.default.number.isRequired, outlineColor: import_prop_types.default.string.isRequired }).isRequired });
var Nr = import_prop_types.default.shape({ background: import_prop_types.default.string.isRequired, fontFamily: import_prop_types.default.string.isRequired, fontSize: import_prop_types.default.number.isRequired, textColor: import_prop_types.default.string.isRequired, axis: Yr.isRequired, grid: Ar.isRequired, legends: Fr.isRequired, labels: Er.isRequired, dots: Ur.isRequired, markers: Xr, crosshair: Kr.isRequired, annotations: Hr.isRequired });
var Vr = { background: "transparent", fontFamily: "sans-serif", fontSize: 11, textColor: "#333333", axis: { domain: { line: { stroke: "transparent", strokeWidth: 1 } }, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} }, legend: { text: { fontSize: 12 } } }, grid: { line: { stroke: "#dddddd", strokeWidth: 1 } }, legends: { hidden: { symbol: { fill: "#333333", opacity: 0.6 }, text: { fill: "#333333", opacity: 0.6 } }, text: {}, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } }, title: { text: {} } }, labels: { text: {} }, markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} }, dots: { text: {} }, tooltip: { container: { background: "white", color: "inherit", fontSize: "inherit", borderRadius: "2px", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)", padding: "5px 9px" }, basic: { whiteSpace: "pre", display: "flex", alignItems: "center" }, chip: { marginRight: 7 }, table: {}, tableCell: { padding: "3px 5px" }, tableCellValue: { fontWeight: "bold" } }, crosshair: { line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" } }, annotations: { text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, link: { stroke: "#000000", strokeWidth: 1, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, outline: { fill: "none", stroke: "#000000", strokeWidth: 2, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 } } };
var Jr = ["axis.ticks.text", "axis.legend.text", "legends.title.text", "legends.text", "legends.ticks.text", "legends.title.text", "labels.text", "dots.text", "markers.text", "annotations.text"];
var Qr = function(e6, r4) {
  var t5 = (0, import_merge.default)({}, e6, r4);
  return Jr.forEach(function(e7) {
    void 0 === (0, import_get.default)(t5, e7 + ".fontFamily") && (0, import_set.default)(t5, e7 + ".fontFamily", t5.fontFamily), void 0 === (0, import_get.default)(t5, e7 + ".fontSize") && (0, import_set.default)(t5, e7 + ".fontSize", t5.fontSize), void 0 === (0, import_get.default)(t5, e7 + ".fill") && (0, import_set.default)(t5, e7 + ".fill", t5.textColor);
  }), t5;
};
var Zr = (0, import_react5.createContext)();
var $r = function(e6) {
  var t5 = e6.children, i3 = e6.animate, n3 = e6.stiffness, o3 = e6.damping, a3 = e6.config, s3 = (0, import_react5.useMemo)(function() {
    var e7 = (0, import_isString.default)(a3) ? config[a3] : a3;
    return { animate: i3, springConfig: { stiffness: n3, damping: o3 }, config: e7 };
  }, [i3, n3, o3, a3]);
  return (0, import_jsx_runtime.jsx)(Zr.Provider, { value: s3, children: t5 });
};
var et = { animate: import_prop_types.default.bool, motionStiffness: import_prop_types.default.number, motionDamping: import_prop_types.default.number, motionConfig: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(Object.keys(config)), import_prop_types.default.shape({ mass: import_prop_types.default.number, tension: import_prop_types.default.number, friction: import_prop_types.default.number, clamp: import_prop_types.default.bool, precision: import_prop_types.default.number, velocity: import_prop_types.default.number, duration: import_prop_types.default.number, easing: import_prop_types.default.func })]) };
$r.propTypes = { children: import_prop_types.default.node.isRequired, animate: et.animate, stiffness: et.motionStiffness, damping: et.motionDamping, config: et.motionConfig };
var rt = { animate: true, stiffness: 90, damping: 15, config: "default" };
$r.defaultProps = rt;
var tt = function() {
  return (0, import_react5.useContext)(Zr);
};
var it = function(e6) {
  var t5 = tt(), o3 = t5.animate, a3 = t5.config, s3 = function(e7) {
    var r4 = (0, import_react5.useRef)();
    return (0, import_react5.useEffect)(function() {
      r4.current = e7;
    }, [e7]), r4.current;
  }(e6), l3 = (0, import_react5.useMemo)(function() {
    return string_default(s3, e6);
  }, [s3, e6]), d3 = useSpring({ from: { value: 0 }, to: { value: 1 }, reset: true, config: a3, immediate: !o3 }).value;
  return to2(d3, l3);
};
var nt = { nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"], BrBG: (0, import_last.default)(scheme), PRGn: (0, import_last.default)(scheme2), PiYG: (0, import_last.default)(scheme3), PuOr: (0, import_last.default)(scheme4), RdBu: (0, import_last.default)(scheme5), RdGy: (0, import_last.default)(scheme6), RdYlBu: (0, import_last.default)(scheme7), RdYlGn: (0, import_last.default)(scheme8), spectral: (0, import_last.default)(scheme9), blues: (0, import_last.default)(scheme22), greens: (0, import_last.default)(scheme23), greys: (0, import_last.default)(scheme24), oranges: (0, import_last.default)(scheme27), purples: (0, import_last.default)(scheme25), reds: (0, import_last.default)(scheme26), BuGn: (0, import_last.default)(scheme10), BuPu: (0, import_last.default)(scheme11), GnBu: (0, import_last.default)(scheme12), OrRd: (0, import_last.default)(scheme13), PuBuGn: (0, import_last.default)(scheme14), PuBu: (0, import_last.default)(scheme15), PuRd: (0, import_last.default)(scheme16), RdPu: (0, import_last.default)(scheme17), YlGnBu: (0, import_last.default)(scheme18), YlGn: (0, import_last.default)(scheme19), YlOrBr: (0, import_last.default)(scheme20), YlOrRd: (0, import_last.default)(scheme21) };
var ot = Object.keys(nt);
var st = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: category10_default, accent: Accent_default, dark2: Dark2_default, paired: Paired_default, pastel1: Pastel1_default, pastel2: Pastel2_default, set1: Set1_default, set2: Set2_default, set3: Set3_default, brown_blueGreen: (0, import_last.default)(scheme), purpleRed_green: (0, import_last.default)(scheme2), pink_yellowGreen: (0, import_last.default)(scheme3), purple_orange: (0, import_last.default)(scheme4), red_blue: (0, import_last.default)(scheme5), red_grey: (0, import_last.default)(scheme6), red_yellow_blue: (0, import_last.default)(scheme7), red_yellow_green: (0, import_last.default)(scheme8), spectral: (0, import_last.default)(scheme9), blues: (0, import_last.default)(scheme22), greens: (0, import_last.default)(scheme23), greys: (0, import_last.default)(scheme24), oranges: (0, import_last.default)(scheme27), purples: (0, import_last.default)(scheme25), reds: (0, import_last.default)(scheme26), blue_green: (0, import_last.default)(scheme10), blue_purple: (0, import_last.default)(scheme11), green_blue: (0, import_last.default)(scheme12), orange_red: (0, import_last.default)(scheme13), purple_blue_green: (0, import_last.default)(scheme14), purple_blue: (0, import_last.default)(scheme15), purple_red: (0, import_last.default)(scheme16), red_purple: (0, import_last.default)(scheme17), yellow_green_blue: (0, import_last.default)(scheme18), yellow_green: (0, import_last.default)(scheme19), yellow_orange_brown: (0, import_last.default)(scheme20), yellow_orange_red: (0, import_last.default)(scheme21) };
var pt = import_prop_types.default.oneOfType([import_prop_types.default.oneOf(ot), import_prop_types.default.func, import_prop_types.default.arrayOf(import_prop_types.default.string)]);
var ht = { basis: basis_default2, basisClosed: basisClosed_default2, basisOpen: basisOpen_default, bundle: bundle_default, cardinal: cardinal_default, cardinalClosed: cardinalClosed_default, cardinalOpen: cardinalOpen_default, catmullRom: catmullRom_default, catmullRomClosed: catmullRomClosed_default, catmullRomOpen: catmullRomOpen_default, linear: linear_default, linearClosed: linearClosed_default, monotoneX, monotoneY, natural: natural_default, step: step_default, stepAfter, stepBefore };
var gt = Object.keys(ht);
var mt = import_prop_types.default.oneOf(gt);
var bt = gt.filter(function(e6) {
  return e6.endsWith("Closed");
});
var yt = (0, import_without.default)(gt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
var vt = (0, import_without.default)(gt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
var Rt = import_prop_types.default.oneOf(vt);
var qt = function(e6) {
  if (!ht[e6])
    throw new TypeError("'" + e6 + "', is not a valid curve interpolator identifier.");
  return ht[e6];
};
var kt = { defs: import_prop_types.default.arrayOf(import_prop_types.default.shape({ id: import_prop_types.default.string.isRequired })).isRequired, fill: import_prop_types.default.arrayOf(import_prop_types.default.shape({ id: import_prop_types.default.string.isRequired, match: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(["*"]), import_prop_types.default.object, import_prop_types.default.func]).isRequired })).isRequired };
var _t = { ascending: ascending_default2, descending: descending_default, insideOut: insideOut_default, none: none_default2, reverse: reverse_default };
var wt = Object.keys(_t);
var xt = import_prop_types.default.oneOf(wt);
var Ct = { expand: expand_default, diverging: diverging_default, none: none_default, silhouette: silhouette_default, wiggle: wiggle_default };
var Wt = Object.keys(Ct);
var St = import_prop_types.default.oneOf(Wt);
var Pt = import_prop_types.default.shape({ top: import_prop_types.default.number, right: import_prop_types.default.number, bottom: import_prop_types.default.number, left: import_prop_types.default.number }).isRequired;
var Tt = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
var Mt = import_prop_types.default.oneOf(Tt);
var It = ordinal(Set3_default);
var Yt = { top: 0, right: 0, bottom: 0, left: 0 };
var At = function(e6, t5, i3) {
  return void 0 === i3 && (i3 = {}), (0, import_react5.useMemo)(function() {
    var r4 = Gr({}, Yt, i3);
    return { margin: r4, innerWidth: e6 - r4.left - r4.right, innerHeight: t5 - r4.top - r4.bottom, outerWidth: e6, outerHeight: t5 };
  }, [e6, t5, i3.top, i3.right, i3.bottom, i3.left]);
};
var Ft = function() {
  var e6 = (0, import_react5.useRef)(null), r4 = (0, import_react5.useState)({ left: 0, top: 0, width: 0, height: 0 }), t5 = r4[0], a3 = r4[1], s3 = (0, import_react5.useState)(function() {
    return "undefined" != typeof window ? new ResizeObserver(function(e7) {
      var r5 = e7[0];
      return a3(r5.contentRect);
    }) : null;
  })[0];
  return (0, import_react5.useEffect)(function() {
    return e6.current && null !== s3 && s3.observe(e6.current), function() {
      null !== s3 && s3.disconnect();
    };
  }, []), [e6, t5];
};
var Et = function(e6) {
  return (0, import_react5.useMemo)(function() {
    return Qr(Vr, e6);
  }, [e6]);
};
var Ut = function(e6) {
  return "function" == typeof e6 ? e6 : "string" == typeof e6 ? 0 === e6.indexOf("time:") ? timeFormat(e6.slice("5")) : format2(e6) : function(e7) {
    return "" + e7;
  };
};
var Xt = function(e6) {
  return (0, import_react5.useMemo)(function() {
    return Ut(e6);
  }, [e6]);
};
var Kt = (0, import_react5.createContext)();
var Ht = {};
var Nt = function(e6) {
  var r4 = e6.theme, t5 = void 0 === r4 ? Ht : r4, i3 = e6.children, n3 = Et(t5);
  return (0, import_jsx_runtime.jsx)(Kt.Provider, { value: n3, children: i3 });
};
Nt.propTypes = { children: import_prop_types.default.node.isRequired, theme: import_prop_types.default.object };
var Vt = function() {
  return (0, import_react5.useContext)(Kt);
};
var Jt = function(e6) {
  var r4 = e6.children, t5 = e6.condition, i3 = e6.wrapper;
  return t5 ? (0, import_react5.cloneElement)(i3, {}, r4) : r4;
};
Jt.propTypes = { children: import_prop_types.default.node.isRequired, condition: import_prop_types.default.bool.isRequired, wrapper: import_prop_types.default.element.isRequired };
var Qt = { position: "relative" };
var Zt = function(e6) {
  var r4 = e6.children, t5 = e6.theme, n3 = e6.renderWrapper, o3 = void 0 === n3 || n3, a3 = e6.isInteractive, s3 = void 0 === a3 || a3, l3 = e6.animate, d3 = e6.motionStiffness, u3 = e6.motionDamping, f4 = e6.motionConfig, h3 = (0, import_react5.useRef)(null);
  return (0, import_jsx_runtime.jsx)(Nt, { theme: t5, children: (0, import_jsx_runtime.jsx)($r, { animate: l3, stiffness: d3, damping: u3, config: f4, children: (0, import_jsx_runtime.jsx)(M, { container: h3, children: (0, import_jsx_runtime.jsxs)(Jt, { condition: o3, wrapper: (0, import_jsx_runtime.jsx)("div", { style: Qt, ref: h3 }), children: [r4, s3 && (0, import_jsx_runtime.jsx)(F, {})] }) }) }) });
};
Zt.propTypes = { children: import_prop_types.default.element.isRequired, isInteractive: import_prop_types.default.bool, renderWrapper: import_prop_types.default.bool, theme: import_prop_types.default.object, animate: import_prop_types.default.bool, motionStiffness: import_prop_types.default.number, motionDamping: import_prop_types.default.number, motionConfig: import_prop_types.default.string };
var $t = function() {
};
var ei = { position: "relative" };
var ri = function(e6) {
  var t5 = e6.children, n3 = e6.theme, o3 = e6.isInteractive, a3 = void 0 === o3 || o3, l3 = e6.renderWrapper, d3 = void 0 === l3 || l3, u3 = e6.animate, f4 = e6.motionStiffness, c8 = e6.motionDamping, b4 = e6.motionConfig, y4 = (0, import_react5.useRef)(null), v4 = O(y4), R = v4.actions, q = v4.state, k3 = (0, import_react5.useCallback)(function(e7, r4) {
    return R.showTooltipFromEvent(e7, r4);
  }, [R.showTooltipFromEvent]), _ = (0, import_react5.useMemo)(function() {
    return { showTooltip: a3 ? k3 : $t, hideTooltip: a3 ? R.hideTooltip : $t };
  }, [R.hideTooltip, a3, k3]);
  return (0, import_jsx_runtime.jsx)(Nt, { theme: n3, children: (0, import_jsx_runtime.jsx)($r, { animate: u3, stiffness: f4, damping: c8, config: b4, children: (0, import_jsx_runtime.jsx)(N.Provider, { value: R, children: (0, import_jsx_runtime.jsx)(j.Provider, { value: q, children: (0, import_jsx_runtime.jsxs)(Jt, { condition: d3, wrapper: (0, import_jsx_runtime.jsx)("div", { style: ei, ref: y4 }), children: [t5(_), a3 && (0, import_jsx_runtime.jsx)(F, {})] }) }) }) }) });
};
ri.propTypes = { children: import_prop_types.default.func.isRequired, isInteractive: import_prop_types.default.bool, renderWrapper: import_prop_types.default.bool, theme: import_prop_types.default.object.isRequired, animate: import_prop_types.default.bool.isRequired, motionStiffness: import_prop_types.default.number, motionDamping: import_prop_types.default.number, motionConfig: import_prop_types.default.string };
var ti = function(e6) {
  var r4 = e6.children, t5 = Ft(), i3 = t5[0], n3 = t5[1], o3 = n3.width > 0 && n3.height > 0;
  return (0, import_jsx_runtime.jsx)("div", { ref: i3, style: { width: "100%", height: "100%" }, children: o3 && r4({ width: n3.width, height: n3.height }) });
};
ti.propTypes = { children: import_prop_types.default.func.isRequired };
var ii = ["id", "colors"];
var ni = function(e6) {
  var r4 = e6.id, t5 = e6.colors, i3 = Lr(e6, ii);
  return (0, import_jsx_runtime.jsx)("linearGradient", Gr({ id: r4, x1: 0, x2: 0, y1: 0, y2: 1 }, i3, { children: t5.map(function(e7) {
    var r5 = e7.offset, t6 = e7.color, i4 = e7.opacity;
    return (0, import_jsx_runtime.jsx)("stop", { offset: r5 + "%", stopColor: t6, stopOpacity: void 0 !== i4 ? i4 : 1 }, r5);
  }) }));
};
ni.propTypes = { id: import_prop_types.default.string.isRequired, colors: import_prop_types.default.arrayOf(import_prop_types.default.shape({ offset: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, opacity: import_prop_types.default.number })).isRequired, gradientTransform: import_prop_types.default.string };
var ai = { linearGradient: ni };
var si = (0, import_react5.memo)(function(e6) {
  var r4 = e6.id, t5 = e6.background, i3 = e6.color, n3 = e6.size, o3 = e6.padding, a3 = e6.stagger, s3 = n3 + o3, l3 = n3 / 2, d3 = o3 / 2;
  return true === a3 && (s3 = 2 * n3 + 2 * o3), (0, import_jsx_runtime.jsxs)("pattern", { id: r4, width: s3, height: s3, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime.jsx)("rect", { width: s3, height: s3, fill: t5 }), (0, import_jsx_runtime.jsx)("circle", { cx: d3 + l3, cy: d3 + l3, r: l3, fill: i3 }), a3 && (0, import_jsx_runtime.jsx)("circle", { cx: 1.5 * o3 + n3 + l3, cy: 1.5 * o3 + n3 + l3, r: l3, fill: i3 })] });
});
si.displayName = "PatternDots", si.propTypes = { id: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, background: import_prop_types.default.string.isRequired, size: import_prop_types.default.number.isRequired, padding: import_prop_types.default.number.isRequired, stagger: import_prop_types.default.bool.isRequired }, si.defaultProps = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false };
var di = 2 * Math.PI;
var ui = function(e6) {
  return e6 * Math.PI / 180;
};
var yi = { svg: { align: { left: "start", center: "middle", right: "end", start: "start", middle: "middle", end: "end" }, baseline: { top: "text-before-edge", center: "central", bottom: "alphabetic" } }, canvas: { align: { left: "left", center: "center", right: "right", start: "left", middle: "center", end: "right" }, baseline: { top: "top", center: "middle", bottom: "bottom" } } };
var Ri = (0, import_react5.memo)(function(e6) {
  var r4 = e6.id, t5 = e6.spacing, i3 = e6.rotation, n3 = e6.background, o3 = e6.color, a3 = e6.lineWidth, s3 = Math.round(i3) % 360, l3 = Math.abs(t5);
  s3 > 180 ? s3 -= 360 : s3 > 90 ? s3 -= 180 : s3 < -180 ? s3 += 360 : s3 < -90 && (s3 += 180);
  var d3, u3 = l3, f4 = l3;
  return 0 === s3 ? d3 = "\n                M 0 0 L " + u3 + " 0\n                M 0 " + f4 + " L " + u3 + " " + f4 + "\n            " : 90 === s3 ? d3 = "\n                M 0 0 L 0 " + f4 + "\n                M " + u3 + " 0 L " + u3 + " " + f4 + "\n            " : (u3 = Math.abs(l3 / Math.sin(ui(s3))), f4 = l3 / Math.sin(ui(90 - s3)), d3 = s3 > 0 ? "\n                    M 0 " + -f4 + " L " + 2 * u3 + " " + f4 + "\n                    M " + -u3 + " " + -f4 + " L " + u3 + " " + f4 + "\n                    M " + -u3 + " 0 L " + u3 + " " + 2 * f4 + "\n                " : "\n                    M " + -u3 + " " + f4 + " L " + u3 + " " + -f4 + "\n                    M " + -u3 + " " + 2 * f4 + " L " + 2 * u3 + " " + -f4 + "\n                    M 0 " + 2 * f4 + " L " + 2 * u3 + " 0\n                "), (0, import_jsx_runtime.jsxs)("pattern", { id: r4, width: u3, height: f4, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime.jsx)("rect", { width: u3, height: f4, fill: n3, stroke: "rgba(255, 0, 0, 0.1)", strokeWidth: 0 }), (0, import_jsx_runtime.jsx)("path", { d: d3, strokeWidth: a3, stroke: o3, strokeLinecap: "square" })] });
});
Ri.displayName = "PatternLines", Ri.propTypes = { id: import_prop_types.default.string.isRequired, spacing: import_prop_types.default.number.isRequired, rotation: import_prop_types.default.number.isRequired, background: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, lineWidth: import_prop_types.default.number.isRequired }, Ri.defaultProps = { spacing: 5, rotation: 0, color: "#000000", background: "#ffffff", lineWidth: 2 };
var ki = (0, import_react5.memo)(function(e6) {
  var r4 = e6.id, t5 = e6.background, i3 = e6.color, n3 = e6.size, o3 = e6.padding, a3 = e6.stagger, s3 = n3 + o3, l3 = o3 / 2;
  return true === a3 && (s3 = 2 * n3 + 2 * o3), (0, import_jsx_runtime.jsxs)("pattern", { id: r4, width: s3, height: s3, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime.jsx)("rect", { width: s3, height: s3, fill: t5 }), (0, import_jsx_runtime.jsx)("rect", { x: l3, y: l3, width: n3, height: n3, fill: i3 }), a3 && (0, import_jsx_runtime.jsx)("rect", { x: 1.5 * o3 + n3, y: 1.5 * o3 + n3, width: n3, height: n3, fill: i3 })] });
});
ki.displayName = "PatternSquares", ki.propTypes = { id: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, background: import_prop_types.default.string.isRequired, size: import_prop_types.default.number.isRequired, padding: import_prop_types.default.number.isRequired, stagger: import_prop_types.default.bool.isRequired }, ki.defaultProps = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false };
var wi = { patternDots: si, patternLines: Ri, patternSquares: ki };
var xi = ["type"];
var Oi = Gr({}, ai, wi);
var Ci = function(e6) {
  var r4 = e6.defs;
  return !r4 || r4.length < 1 ? null : (0, import_jsx_runtime.jsx)("defs", { "aria-hidden": true, children: r4.map(function(e7) {
    var r5 = e7.type, t5 = Lr(e7, xi);
    return Oi[r5] ? (0, import_react5.createElement)(Oi[r5], Gr({ key: t5.id }, t5)) : null;
  }) });
};
Ci.propTypes = { defs: import_prop_types.default.arrayOf(import_prop_types.default.shape({ type: import_prop_types.default.oneOf(Object.keys(Oi)).isRequired, id: import_prop_types.default.string.isRequired })) };
var Wi = (0, import_react5.memo)(Ci);
var Si = function(e6) {
  var r4 = e6.width, t5 = e6.height, i3 = e6.margin, n3 = e6.defs, o3 = e6.children, a3 = e6.role, s3 = e6.ariaLabel, l3 = e6.ariaLabelledBy, d3 = e6.ariaDescribedBy, u3 = e6.isFocusable, f4 = Vt();
  return (0, import_jsx_runtime.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: r4, height: t5, role: a3, "aria-label": s3, "aria-labelledby": l3, "aria-describedby": d3, focusable: u3, tabIndex: u3 ? 0 : void 0, children: [(0, import_jsx_runtime.jsx)(Wi, { defs: n3 }), (0, import_jsx_runtime.jsx)("rect", { width: r4, height: t5, fill: f4.background }), (0, import_jsx_runtime.jsx)("g", { transform: "translate(" + i3.left + "," + i3.top + ")", children: o3 })] });
};
Si.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, margin: import_prop_types.default.shape({ top: import_prop_types.default.number.isRequired, left: import_prop_types.default.number.isRequired }).isRequired, defs: import_prop_types.default.array, children: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.node), import_prop_types.default.node]).isRequired, role: import_prop_types.default.string, isFocusable: import_prop_types.default.bool, ariaLabel: import_prop_types.default.string, ariaLabelledBy: import_prop_types.default.string, ariaDescribedBy: import_prop_types.default.string };
var zi = function(e6) {
  var r4 = e6.size, t5 = e6.color, i3 = e6.borderWidth, n3 = e6.borderColor;
  return (0, import_jsx_runtime.jsx)("circle", { r: r4 / 2, fill: t5, stroke: n3, strokeWidth: i3, style: { pointerEvents: "none" } });
};
zi.propTypes = { size: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, borderWidth: import_prop_types.default.number.isRequired, borderColor: import_prop_types.default.string.isRequired };
var Pi = (0, import_react5.memo)(zi);
var Ti = function(e6) {
  var r4 = e6.x, t5 = e6.y, i3 = e6.symbol, n3 = void 0 === i3 ? Pi : i3, o3 = e6.size, a3 = e6.datum, s3 = e6.color, l3 = e6.borderWidth, u3 = e6.borderColor, f4 = e6.label, c8 = e6.labelTextAnchor, p3 = void 0 === c8 ? "middle" : c8, h3 = e6.labelYOffset, g3 = void 0 === h3 ? -12 : h3, m4 = Vt(), b4 = tt(), y4 = b4.animate, v4 = b4.config, R = useSpring({ transform: "translate(" + r4 + ", " + t5 + ")", config: v4, immediate: !y4 });
  return (0, import_jsx_runtime.jsxs)(animated.g, { transform: R.transform, style: { pointerEvents: "none" }, children: [(0, import_react5.createElement)(n3, { size: o3, color: s3, datum: a3, borderWidth: l3, borderColor: u3 }), f4 && (0, import_jsx_runtime.jsx)("text", { textAnchor: p3, y: g3, style: m4.dots.text, children: f4 })] });
};
Ti.propTypes = { x: import_prop_types.default.number.isRequired, y: import_prop_types.default.number.isRequired, datum: import_prop_types.default.object.isRequired, size: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, borderWidth: import_prop_types.default.number.isRequired, borderColor: import_prop_types.default.string.isRequired, symbol: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]), label: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number]), labelTextAnchor: import_prop_types.default.oneOf(["start", "middle", "end"]), labelYOffset: import_prop_types.default.number };
var Mi = (0, import_react5.memo)(Ti);
var ji = function(e6) {
  var r4 = e6.width, t5 = e6.height, i3 = e6.axis, n3 = e6.scale, o3 = e6.value, a3 = e6.lineStyle, s3 = e6.textStyle, l3 = e6.legend, d3 = e6.legendPosition, u3 = e6.legendOffsetX, f4 = e6.legendOffsetY, c8 = e6.legendOrientation, p3 = Vt(), h3 = 0, g3 = 0, m4 = 0, b4 = 0;
  "y" === i3 ? (m4 = n3(o3), g3 = r4) : (h3 = n3(o3), b4 = t5);
  var y4 = null;
  if (l3) {
    var v4 = function(e7) {
      var r5 = e7.axis, t6 = e7.width, i4 = e7.height, n4 = e7.position, o4 = e7.offsetX, a4 = e7.offsetY, s4 = e7.orientation, l4 = 0, d4 = 0, u4 = "vertical" === s4 ? -90 : 0, f5 = "start";
      if ("x" === r5)
        switch (n4) {
          case "top-left":
            l4 = -o4, d4 = a4, f5 = "end";
            break;
          case "top":
            d4 = -a4, f5 = "horizontal" === s4 ? "middle" : "start";
            break;
          case "top-right":
            l4 = o4, d4 = a4, f5 = "horizontal" === s4 ? "start" : "end";
            break;
          case "right":
            l4 = o4, d4 = i4 / 2, f5 = "horizontal" === s4 ? "start" : "middle";
            break;
          case "bottom-right":
            l4 = o4, d4 = i4 - a4, f5 = "start";
            break;
          case "bottom":
            d4 = i4 + a4, f5 = "horizontal" === s4 ? "middle" : "end";
            break;
          case "bottom-left":
            d4 = i4 - a4, l4 = -o4, f5 = "horizontal" === s4 ? "end" : "start";
            break;
          case "left":
            l4 = -o4, d4 = i4 / 2, f5 = "horizontal" === s4 ? "end" : "middle";
        }
      else
        switch (n4) {
          case "top-left":
            l4 = o4, d4 = -a4, f5 = "start";
            break;
          case "top":
            l4 = t6 / 2, d4 = -a4, f5 = "horizontal" === s4 ? "middle" : "start";
            break;
          case "top-right":
            l4 = t6 - o4, d4 = -a4, f5 = "horizontal" === s4 ? "end" : "start";
            break;
          case "right":
            l4 = t6 + o4, f5 = "horizontal" === s4 ? "start" : "middle";
            break;
          case "bottom-right":
            l4 = t6 - o4, d4 = a4, f5 = "end";
            break;
          case "bottom":
            l4 = t6 / 2, d4 = a4, f5 = "horizontal" === s4 ? "middle" : "end";
            break;
          case "bottom-left":
            l4 = o4, d4 = a4, f5 = "horizontal" === s4 ? "start" : "end";
            break;
          case "left":
            l4 = -o4, f5 = "horizontal" === s4 ? "end" : "middle";
        }
      return { x: l4, y: d4, rotation: u4, textAnchor: f5 };
    }({ axis: i3, width: r4, height: t5, position: d3, offsetX: u3, offsetY: f4, orientation: c8 });
    y4 = (0, import_jsx_runtime.jsx)("text", { transform: "translate(" + v4.x + ", " + v4.y + ") rotate(" + v4.rotation + ")", textAnchor: v4.textAnchor, dominantBaseline: "central", style: s3, children: l3 });
  }
  return (0, import_jsx_runtime.jsxs)("g", { transform: "translate(" + h3 + ", " + m4 + ")", children: [(0, import_jsx_runtime.jsx)("line", { x1: 0, x2: g3, y1: 0, y2: b4, stroke: p3.markers.lineColor, strokeWidth: p3.markers.lineStrokeWidth, style: a3 }), y4] });
};
ji.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, axis: import_prop_types.default.oneOf(["x", "y"]).isRequired, scale: import_prop_types.default.func.isRequired, value: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string, import_prop_types.default.instanceOf(Date)]).isRequired, lineStyle: import_prop_types.default.object, textStyle: import_prop_types.default.object, legend: import_prop_types.default.string, legendPosition: import_prop_types.default.oneOf(["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]), legendOffsetX: import_prop_types.default.number.isRequired, legendOffsetY: import_prop_types.default.number.isRequired, legendOrientation: import_prop_types.default.oneOf(["horizontal", "vertical"]).isRequired }, ji.defaultProps = { legendPosition: "top-right", legendOffsetX: 14, legendOffsetY: 14, legendOrientation: "horizontal" };
var Di = (0, import_react5.memo)(ji);
var Gi = function(e6) {
  var r4 = e6.markers, t5 = e6.width, i3 = e6.height, n3 = e6.xScale, o3 = e6.yScale;
  return r4 && 0 !== r4.length ? r4.map(function(e7, r5) {
    return (0, import_jsx_runtime.jsx)(Di, Gr({}, e7, { width: t5, height: i3, scale: "y" === e7.axis ? o3 : n3 }), r5);
  }) : null;
};
Gi.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, xScale: import_prop_types.default.func.isRequired, yScale: import_prop_types.default.func.isRequired, markers: import_prop_types.default.arrayOf(import_prop_types.default.shape({ axis: import_prop_types.default.oneOf(["x", "y"]).isRequired, value: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string, import_prop_types.default.instanceOf(Date)]).isRequired, lineStyle: import_prop_types.default.object, textStyle: import_prop_types.default.object })) };
var Bi = (0, import_react5.memo)(Gi);
var Ai = ["theme", "renderWrapper", "animate", "motionStiffness", "motionDamping", "motionConfig"];
var Fi = function(e6) {
  return function(r4) {
    var t5, i3;
    function n3() {
      return r4.apply(this, arguments) || this;
    }
    return i3 = r4, (t5 = n3).prototype = Object.create(i3.prototype), t5.prototype.constructor = t5, Br(t5, i3), n3.prototype.render = function() {
      var r5 = this.props, t6 = r5.theme, i4 = r5.renderWrapper, n4 = r5.animate, o3 = r5.motionStiffness, a3 = r5.motionDamping, s3 = r5.motionConfig, l3 = Lr(r5, Ai);
      return (0, import_jsx_runtime.jsx)(Zt, { theme: t6, renderWrapper: i4, isInteractive: l3.isInteractive, animate: n4, motionStiffness: o3, motionDamping: a3, motionConfig: s3, children: (0, import_jsx_runtime.jsx)(e6, Gr({}, l3)) });
    }, n3;
  }(import_react5.Component);
};
var Ei = function(e6, r4) {
  var t5, i3 = (0, import_isFunction.default)(e6) ? e6 : function(r5) {
    return (0, import_get.default)(r5, e6);
  };
  return r4 && (t5 = (0, import_isFunction.default)(r4) ? r4 : format2(r4)), t5 ? function(e7) {
    return t5(i3(e7));
  } : i3;
};
var Hi = function(e6, r4, t5) {
  var i3 = r4.width - e6.width, n3 = r4.height - e6.height, o3 = 0, a3 = 0;
  return "center" === t5 && (o3 = i3 / 2, a3 = n3 / 2), "top" === t5 && (o3 = i3 / 2), "top-right" === t5 && (o3 = i3), "right" === t5 && (o3 = i3, a3 = n3 / 2), "bottom-right" === t5 && (o3 = i3, a3 = n3), "bottom" === t5 && (o3 = i3 / 2, a3 = n3), "bottom-left" === t5 && (a3 = n3), "left" === t5 && (a3 = n3 / 2), [o3, a3];
};
var Ji = function(e6, r4, t5, i3, n3, o3) {
  return e6 <= n3 && n3 <= e6 + t5 && r4 <= o3 && o3 <= r4 + i3;
};
var Qi = function(e6, r4) {
  var t5 = r4.clientX, i3 = r4.clientY, n3 = e6.getBoundingClientRect(), o3 = e6.getBBox(), a3 = o3.width === n3.width ? 1 : o3.width / n3.width;
  return [(t5 - n3.left) * a3, (i3 - n3.top) * a3];
};
var Zi = Object.keys(ai);
var $i = Object.keys(wi);
var en = function(e6, r4, t5) {
  if ("*" === e6)
    return true;
  if ((0, import_isFunction.default)(e6))
    return e6(r4);
  if ((0, import_isPlainObject.default)(e6)) {
    var i3 = t5 ? (0, import_get.default)(r4, t5) : r4;
    return (0, import_isEqual.default)((0, import_pick.default)(i3, Object.keys(e6)), e6);
  }
  return false;
};
var rn = function(e6, r4, t5, i3) {
  var n3 = void 0 === i3 ? {} : i3, o3 = n3.dataKey, a3 = n3.colorKey, s3 = void 0 === a3 ? "color" : a3, l3 = n3.targetKey, d3 = void 0 === l3 ? "fill" : l3, u3 = [], f4 = {};
  return e6.length && r4.length && (u3 = [].concat(e6), r4.forEach(function(r5) {
    for (var i4 = function(i5) {
      var n5 = t5[i5], a4 = n5.id, l4 = n5.match;
      if (en(l4, r5, o3)) {
        var c8 = e6.find(function(e7) {
          return e7.id === a4;
        });
        if (c8) {
          if ($i.includes(c8.type))
            if ("inherit" === c8.background || "inherit" === c8.color) {
              var p3 = (0, import_get.default)(r5, s3), h3 = c8.background, g3 = c8.color, m4 = a4;
              "inherit" === c8.background && (m4 = m4 + ".bg." + p3, h3 = p3), "inherit" === c8.color && (m4 = m4 + ".fg." + p3, g3 = p3), (0, import_set.default)(r5, d3, "url(#" + m4 + ")"), f4[m4] || (u3.push(Gr({}, c8, { id: m4, background: h3, color: g3 })), f4[m4] = 1);
            } else
              (0, import_set.default)(r5, d3, "url(#" + a4 + ")");
          else if (Zi.includes(c8.type)) {
            if (c8.colors.map(function(e7) {
              return e7.color;
            }).includes("inherit")) {
              var b4 = (0, import_get.default)(r5, s3), R = a4, q = Gr({}, c8, { colors: c8.colors.map(function(e7, r6) {
                return "inherit" !== e7.color ? e7 : (R = R + "." + r6 + "." + b4, Gr({}, e7, { color: "inherit" === e7.color ? b4 : e7.color }));
              }) });
              q.id = R, (0, import_set.default)(r5, d3, "url(#" + R + ")"), f4[R] || (u3.push(q), f4[R] = 1);
            } else
              (0, import_set.default)(r5, d3, "url(#" + a4 + ")");
          }
        }
        return "break";
      }
    }, n4 = 0; n4 < t5.length; n4++) {
      if ("break" === i4(n4))
        break;
    }
  })), u3;
};

// ../../node_modules/@nivo/tooltip/dist/nivo-tooltip.es.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
function v2() {
  return v2 = Object.assign || function(t5) {
    for (var i3 = 1; i3 < arguments.length; i3++) {
      var o3 = arguments[i3];
      for (var n3 in o3)
        Object.prototype.hasOwnProperty.call(o3, n3) && (t5[n3] = o3[n3]);
    }
    return t5;
  }, v2.apply(this, arguments);
}
var x3 = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 };
var m2 = function(t5, i3) {
  return "translate(" + t5 + "px, " + i3 + "px)";
};
var g = (0, import_react6.memo)(function(t5) {
  var o3, n3 = t5.position, r4 = t5.anchor, e6 = t5.children, l3 = Vt(), u3 = tt(), p3 = u3.animate, f4 = u3.config, g3 = Ft(), b4 = g3[0], w3 = g3[1], T3 = (0, import_react6.useRef)(false), C4 = void 0, E3 = false, P3 = w3.width > 0 && w3.height > 0, N2 = Math.round(n3[0]), V2 = Math.round(n3[1]);
  P3 && ("top" === r4 ? (N2 -= w3.width / 2, V2 -= w3.height + 14) : "right" === r4 ? (N2 += 14, V2 -= w3.height / 2) : "bottom" === r4 ? (N2 -= w3.width / 2, V2 += 14) : "left" === r4 ? (N2 -= w3.width + 14, V2 -= w3.height / 2) : "center" === r4 && (N2 -= w3.width / 2, V2 -= w3.height / 2), C4 = { transform: m2(N2, V2) }, T3.current || (E3 = true), T3.current = [N2, V2]);
  var j2 = useSpring({ to: C4, config: f4, immediate: !p3 || E3 }), O5 = v2({}, x3, l3.tooltip, { transform: null != (o3 = j2.transform) ? o3 : m2(N2, V2) });
  return (0, import_jsx_runtime2.jsx)(animated.div, { ref: b4, style: O5, children: e6 });
});
g.displayName = "TooltipWrapper";
var b2 = (0, import_react6.memo)(function(t5) {
  var i3 = t5.size, o3 = void 0 === i3 ? 12 : i3, n3 = t5.color, r4 = t5.style;
  return (0, import_jsx_runtime2.jsx)("span", { style: v2({ display: "block", width: o3, height: o3, background: n3 }, void 0 === r4 ? {} : r4) });
});
var w = (0, import_react6.memo)(function(t5) {
  var i3, o3 = t5.id, n3 = t5.value, r4 = t5.format, e6 = t5.enableChip, l3 = void 0 !== e6 && e6, a3 = t5.color, c8 = t5.renderContent, s3 = Vt(), d3 = Xt(r4);
  if ("function" == typeof c8)
    i3 = c8();
  else {
    var f4 = n3;
    void 0 !== d3 && void 0 !== f4 && (f4 = d3(f4)), i3 = (0, import_jsx_runtime2.jsxs)("div", { style: s3.tooltip.basic, children: [l3 && (0, import_jsx_runtime2.jsx)(b2, { color: a3, style: s3.tooltip.chip }), void 0 !== f4 ? (0, import_jsx_runtime2.jsxs)("span", { children: [o3, ": ", (0, import_jsx_runtime2.jsx)("strong", { children: "" + f4 })] }) : o3] });
  }
  return (0, import_jsx_runtime2.jsx)("div", { style: s3.tooltip.container, children: i3 });
});
var T = { width: "100%", borderCollapse: "collapse" };
var C3 = (0, import_react6.memo)(function(t5) {
  var i3, o3 = t5.title, n3 = t5.rows, r4 = void 0 === n3 ? [] : n3, e6 = t5.renderContent, l3 = Vt();
  return r4.length ? (i3 = "function" == typeof e6 ? e6() : (0, import_jsx_runtime2.jsxs)("div", { children: [o3 && o3, (0, import_jsx_runtime2.jsx)("table", { style: v2({}, T, l3.tooltip.table), children: (0, import_jsx_runtime2.jsx)("tbody", { children: r4.map(function(t6, i4) {
    return (0, import_jsx_runtime2.jsx)("tr", { children: t6.map(function(t7, i5) {
      return (0, import_jsx_runtime2.jsx)("td", { style: l3.tooltip.tableCell, children: t7 }, i5);
    }) }, i4);
  }) }) })] }), (0, import_jsx_runtime2.jsx)("div", { style: l3.tooltip.container, children: i3 })) : null;
});
C3.displayName = "TableTooltip";
var E2 = (0, import_react6.memo)(function(t5) {
  var i3 = t5.x0, n3 = t5.x1, r4 = t5.y0, e6 = t5.y1, l3 = Vt(), d3 = tt(), u3 = d3.animate, p3 = d3.config, f4 = (0, import_react6.useMemo)(function() {
    return v2({}, l3.crosshair.line, { pointerEvents: "none" });
  }, [l3.crosshair.line]), x5 = useSpring({ x1: i3, x2: n3, y1: r4, y2: e6, config: p3, immediate: !u3 });
  return (0, import_jsx_runtime2.jsx)(animated.line, v2({}, x5, { fill: "none", style: f4 }));
});
E2.displayName = "CrosshairLine";
var P2 = (0, import_react6.memo)(function(t5) {
  var i3, o3, n3 = t5.width, r4 = t5.height, e6 = t5.type, l3 = t5.x, a3 = t5.y;
  return "cross" === e6 ? (i3 = { x0: l3, x1: l3, y0: 0, y1: r4 }, o3 = { x0: 0, x1: n3, y0: a3, y1: a3 }) : "top-left" === e6 ? (i3 = { x0: l3, x1: l3, y0: 0, y1: a3 }, o3 = { x0: 0, x1: l3, y0: a3, y1: a3 }) : "top" === e6 ? i3 = { x0: l3, x1: l3, y0: 0, y1: a3 } : "top-right" === e6 ? (i3 = { x0: l3, x1: l3, y0: 0, y1: a3 }, o3 = { x0: l3, x1: n3, y0: a3, y1: a3 }) : "right" === e6 ? o3 = { x0: l3, x1: n3, y0: a3, y1: a3 } : "bottom-right" === e6 ? (i3 = { x0: l3, x1: l3, y0: a3, y1: r4 }, o3 = { x0: l3, x1: n3, y0: a3, y1: a3 }) : "bottom" === e6 ? i3 = { x0: l3, x1: l3, y0: a3, y1: r4 } : "bottom-left" === e6 ? (i3 = { x0: l3, x1: l3, y0: a3, y1: r4 }, o3 = { x0: 0, x1: l3, y0: a3, y1: a3 }) : "left" === e6 ? o3 = { x0: 0, x1: l3, y0: a3, y1: a3 } : "x" === e6 ? i3 = { x0: l3, x1: l3, y0: 0, y1: r4 } : "y" === e6 && (o3 = { x0: 0, x1: n3, y0: a3, y1: a3 }), (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [i3 && (0, import_jsx_runtime2.jsx)(E2, { x0: i3.x0, x1: i3.x1, y0: i3.y0, y1: i3.y1 }), o3 && (0, import_jsx_runtime2.jsx)(E2, { x0: o3.x0, x1: o3.x1, y0: o3.y0, y1: o3.y1 })] });
});
P2.displayName = "Crosshair";
var N = (0, import_react6.createContext)({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} });
var V = { isVisible: false, position: [null, null], content: null, anchor: null };
var j = (0, import_react6.createContext)(V);
var O = function(t5) {
  var i3 = (0, import_react6.useState)(V), n3 = i3[0], l3 = i3[1], a3 = (0, import_react6.useCallback)(function(t6, i4, o3) {
    var n4 = i4[0], r4 = i4[1];
    void 0 === o3 && (o3 = "top"), l3({ isVisible: true, position: [n4, r4], anchor: o3, content: t6 });
  }, [l3]), c8 = (0, import_react6.useCallback)(function(i4, o3, n4) {
    void 0 === n4 && (n4 = "top");
    var r4 = t5.current.getBoundingClientRect(), e6 = t5.current.offsetWidth, a4 = e6 === r4.width ? 1 : e6 / r4.width, c9 = (o3.clientX - r4.left) * a4, h4 = (o3.clientY - r4.top) * a4;
    "left" !== n4 && "right" !== n4 || (n4 = c9 < r4.width / 2 ? "right" : "left"), l3({ isVisible: true, position: [c9, h4], anchor: n4, content: i4 });
  }, [t5, l3]), h3 = (0, import_react6.useCallback)(function() {
    l3(V);
  }, [l3]);
  return { actions: (0, import_react6.useMemo)(function() {
    return { showTooltipAt: a3, showTooltipFromEvent: c8, hideTooltip: h3 };
  }, [a3, c8, h3]), state: n3 };
};
var k = function() {
  var t5 = (0, import_react6.useContext)(N);
  if (void 0 === t5)
    throw new Error("useTooltip must be used within a TooltipProvider");
  return t5;
};
var z = function() {
  var t5 = (0, import_react6.useContext)(j);
  if (void 0 === t5)
    throw new Error("useTooltipState must be used within a TooltipProvider");
  return t5;
};
var A2 = function(t5) {
  return t5.isVisible;
};
var F = function() {
  var t5 = z();
  return A2(t5) ? (0, import_jsx_runtime2.jsx)(g, { position: t5.position, anchor: t5.anchor, children: t5.content }) : null;
};
var M = function(t5) {
  var i3 = t5.container, o3 = t5.children, n3 = O(i3), r4 = n3.actions, e6 = n3.state;
  return (0, import_jsx_runtime2.jsx)(N.Provider, { value: r4, children: (0, import_jsx_runtime2.jsx)(j.Provider, { value: e6, children: o3 }) });
};

// ../../node_modules/@nivo/colors/dist/nivo-colors.es.js
var import_isPlainObject2 = __toESM(require_isPlainObject());
var import_get2 = __toESM(require_get());
var import_react7 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());
function qe() {
  return qe = Object.assign || function(e6) {
    for (var r4 = 1; r4 < arguments.length; r4++) {
      var n3 = arguments[r4];
      for (var t5 in n3)
        Object.prototype.hasOwnProperty.call(n3, t5) && (e6[t5] = n3[t5]);
    }
    return e6;
  }, qe.apply(this, arguments);
}
function Se(e6, r4) {
  (null == r4 || r4 > e6.length) && (r4 = e6.length);
  for (var n3 = 0, t5 = new Array(r4); n3 < r4; n3++)
    t5[n3] = e6[n3];
  return t5;
}
function Re(e6, r4) {
  var n3 = "undefined" != typeof Symbol && e6[Symbol.iterator] || e6["@@iterator"];
  if (n3)
    return (n3 = n3.call(e6)).next.bind(n3);
  if (Array.isArray(e6) || (n3 = function(e7, r5) {
    if (e7) {
      if ("string" == typeof e7)
        return Se(e7, r5);
      var n4 = Object.prototype.toString.call(e7).slice(8, -1);
      return "Object" === n4 && e7.constructor && (n4 = e7.constructor.name), "Map" === n4 || "Set" === n4 ? Array.from(e7) : "Arguments" === n4 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n4) ? Se(e7, r5) : void 0;
    }
  }(e6)) || r4 && e6 && "number" == typeof e6.length) {
    n3 && (e6 = n3);
    var t5 = 0;
    return function() {
      return t5 >= e6.length ? { done: true } : { done: false, value: e6[t5++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var Ce = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: category10_default, accent: Accent_default, dark2: Dark2_default, paired: Paired_default, pastel1: Pastel1_default, pastel2: Pastel2_default, set1: Set1_default, set2: Set2_default, set3: Set3_default };
var Ge = Object.keys(Ce);
var Ve = { brown_blueGreen: scheme, purpleRed_green: scheme2, pink_yellowGreen: scheme3, purple_orange: scheme4, red_blue: scheme5, red_grey: scheme6, red_yellow_blue: scheme7, red_yellow_green: scheme8, spectral: scheme9 };
var Te = Object.keys(Ve);
var Pe = { brown_blueGreen: BrBG_default, purpleRed_green: PRGn_default, pink_yellowGreen: PiYG_default, purple_orange: PuOr_default, red_blue: RdBu_default, red_grey: RdGy_default, red_yellow_blue: RdYlBu_default, red_yellow_green: RdYlGn_default, spectral: Spectral_default };
var Ue = { blues: scheme22, greens: scheme23, greys: scheme24, oranges: scheme27, purples: scheme25, reds: scheme26, blue_green: scheme10, blue_purple: scheme11, green_blue: scheme12, orange_red: scheme13, purple_blue_green: scheme14, purple_blue: scheme15, purple_red: scheme16, red_purple: scheme17, yellow_green_blue: scheme18, yellow_green: scheme19, yellow_orange_brown: scheme20, yellow_orange_red: scheme21 };
var De = Object.keys(Ue);
var Me = { blues: Blues_default, greens: Greens_default, greys: Greys_default, oranges: Oranges_default, purples: Purples_default, reds: Reds_default, turbo: turbo_default, viridis: viridis_default, inferno, magma, plasma, cividis: cividis_default, warm, cool, cubehelixDefault: cubehelix_default2, blue_green: BuGn_default, blue_purple: BuPu_default, green_blue: GnBu_default, orange_red: OrRd_default, purple_blue_green: PuBuGn_default, purple_blue: PuBu_default, purple_red: PuRd_default, red_purple: RdPu_default, yellow_green_blue: YlGnBu_default, yellow_green: YlGn_default, yellow_orange_brown: YlOrBr_default, yellow_orange_red: YlOrRd_default };
var $e = qe({}, Ce, Ve, Ue);
var Be = Object.keys($e);
var Fe = function(e6) {
  return Ge.includes(e6);
};
var He = function(e6) {
  return Te.includes(e6);
};
var Je = function(e6) {
  return De.includes(e6);
};
var Ke = { rainbow: rainbow_default, sinebow: sinebow_default };
var Le = qe({}, Pe, Me, Ke);
var Ne = Object.keys(Le);
var Qe2 = function(e6, r4) {
  if ("function" == typeof e6)
    return e6;
  if ((0, import_isPlainObject2.default)(e6)) {
    if (function(e7) {
      return void 0 !== e7.theme;
    }(e6)) {
      if (void 0 === r4)
        throw new Error("Unable to use color from theme as no theme was provided");
      var n3 = (0, import_get2.default)(r4, e6.theme);
      if (void 0 === n3)
        throw new Error("Color from theme is undefined at path: '" + e6.theme + "'");
      return function() {
        return n3;
      };
    }
    if (function(e7) {
      return void 0 !== e7.from;
    }(e6)) {
      var t5 = function(r5) {
        return (0, import_get2.default)(r5, e6.from);
      };
      if (Array.isArray(e6.modifiers)) {
        for (var o3, i3 = [], u3 = function() {
          var e7 = o3.value, r5 = e7[0], n4 = e7[1];
          if ("brighter" === r5)
            i3.push(function(e8) {
              return e8.brighter(n4);
            });
          else if ("darker" === r5)
            i3.push(function(e8) {
              return e8.darker(n4);
            });
          else {
            if ("opacity" !== r5)
              throw new Error("Invalid color modifier: '" + r5 + "', must be one of: 'brighter', 'darker', 'opacity'");
            i3.push(function(e8) {
              return e8.opacity = n4, e8;
            });
          }
        }, a3 = Re(e6.modifiers); !(o3 = a3()).done; )
          u3();
        return 0 === i3.length ? t5 : function(e7) {
          return i3.reduce(function(e8, r5) {
            return r5(e8);
          }, rgb2(t5(e7))).toString();
        };
      }
      return t5;
    }
    throw new Error("Invalid color spec, you should either specify 'theme' or 'from' when using a config object");
  }
  return function() {
    return e6;
  };
};
var We = function(e6, r4) {
  return (0, import_react7.useMemo)(function() {
    return Qe2(e6, r4);
  }, [e6, r4]);
};
var Xe = import_prop_types2.default.oneOfType([import_prop_types2.default.func, import_prop_types2.default.arrayOf(import_prop_types2.default.string), import_prop_types2.default.shape({ scheme: import_prop_types2.default.oneOf(Be).isRequired, size: import_prop_types2.default.number }), import_prop_types2.default.shape({ datum: import_prop_types2.default.string.isRequired }), import_prop_types2.default.string]);
var Ye = import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.func, import_prop_types2.default.shape({ theme: import_prop_types2.default.string.isRequired }), import_prop_types2.default.shape({ from: import_prop_types2.default.string.isRequired, modifiers: import_prop_types2.default.arrayOf(import_prop_types2.default.array) })]);
var fr = function(e6, r4) {
  if ("function" == typeof e6)
    return e6;
  var n3 = "function" == typeof r4 ? r4 : function(e7) {
    return (0, import_get2.default)(e7, r4);
  };
  if (Array.isArray(e6)) {
    var t5 = ordinal(e6), o3 = function(e7) {
      return t5(n3(e7));
    };
    return o3.scale = t5, o3;
  }
  if ((0, import_isPlainObject2.default)(e6)) {
    if (function(e7) {
      return void 0 !== e7.datum;
    }(e6))
      return function(r5) {
        return (0, import_get2.default)(r5, e6.datum);
      };
    if (function(e7) {
      return void 0 !== e7.scheme;
    }(e6)) {
      if (Fe(e6.scheme)) {
        var i3 = ordinal($e[e6.scheme]), u3 = function(e7) {
          return i3(n3(e7));
        };
        return u3.scale = i3, u3;
      }
      if (He(e6.scheme)) {
        if (void 0 !== e6.size && (e6.size < 3 || e6.size > 11))
          throw new Error("Invalid size '" + e6.size + "' for diverging color scheme '" + e6.scheme + "', must be between 3~11");
        var a3 = ordinal($e[e6.scheme][e6.size || 11]), l3 = function(e7) {
          return a3(n3(e7));
        };
        return l3.scale = a3, l3;
      }
      if (Je(e6.scheme)) {
        if (void 0 !== e6.size && (e6.size < 3 || e6.size > 9))
          throw new Error("Invalid size '" + e6.size + "' for sequential color scheme '" + e6.scheme + "', must be between 3~9");
        var s3 = ordinal($e[e6.scheme][e6.size || 9]), c8 = function(e7) {
          return s3(n3(e7));
        };
        return c8.scale = s3, c8;
      }
    }
    throw new Error("Invalid colors, when using an object, you should either pass a 'datum' or a 'scheme' property");
  }
  return function() {
    return e6;
  };
};
var pr = function(e6, r4) {
  return (0, import_react7.useMemo)(function() {
    return fr(e6, r4);
  }, [e6, r4]);
};

// ../../node_modules/@nivo/legends/dist/nivo-legends.es.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var a2 = __toESM(require_react());
var import_react8 = __toESM(require_react());
var import_prop_types3 = __toESM(require_prop_types());
var m3 = function(e6) {
  var i3 = e6.x, n3 = e6.y, o3 = e6.size, r4 = e6.fill, l3 = e6.opacity, a3 = void 0 === l3 ? 1 : l3, c8 = e6.borderWidth, s3 = void 0 === c8 ? 0 : c8, d3 = e6.borderColor;
  return (0, import_jsx_runtime3.jsx)("circle", { r: o3 / 2, cx: i3 + o3 / 2, cy: n3 + o3 / 2, fill: r4, opacity: a3, strokeWidth: s3, stroke: void 0 === d3 ? "transparent" : d3, style: { pointerEvents: "none" } });
};
var f3 = function(e6) {
  var i3 = e6.x, n3 = e6.y, o3 = e6.size, r4 = e6.fill, l3 = e6.opacity, a3 = void 0 === l3 ? 1 : l3, c8 = e6.borderWidth, s3 = void 0 === c8 ? 0 : c8, d3 = e6.borderColor;
  return (0, import_jsx_runtime3.jsx)("g", { transform: "translate(" + i3 + "," + n3 + ")", children: (0, import_jsx_runtime3.jsx)("path", { d: "\n                    M" + o3 / 2 + " 0\n                    L" + 0.8 * o3 + " " + o3 / 2 + "\n                    L" + o3 / 2 + " " + o3 + "\n                    L" + 0.2 * o3 + " " + o3 / 2 + "\n                    L" + o3 / 2 + " 0\n                ", fill: r4, opacity: a3, strokeWidth: s3, stroke: void 0 === d3 ? "transparent" : d3, style: { pointerEvents: "none" } }) });
};
var u2 = function(e6) {
  var i3 = e6.x, n3 = e6.y, o3 = e6.size, r4 = e6.fill, l3 = e6.opacity, a3 = void 0 === l3 ? 1 : l3, c8 = e6.borderWidth, s3 = void 0 === c8 ? 0 : c8, d3 = e6.borderColor;
  return (0, import_jsx_runtime3.jsx)("rect", { x: i3, y: n3, fill: r4, opacity: a3, strokeWidth: s3, stroke: void 0 === d3 ? "transparent" : d3, width: o3, height: o3, style: { pointerEvents: "none" } });
};
var v3 = function(e6) {
  var i3 = e6.x, n3 = e6.y, o3 = e6.size, r4 = e6.fill, l3 = e6.opacity, a3 = void 0 === l3 ? 1 : l3, c8 = e6.borderWidth, s3 = void 0 === c8 ? 0 : c8, d3 = e6.borderColor;
  return (0, import_jsx_runtime3.jsx)("g", { transform: "translate(" + i3 + "," + n3 + ")", children: (0, import_jsx_runtime3.jsx)("path", { d: "\n                M" + o3 / 2 + " 0\n                L" + o3 + " " + o3 + "\n                L0 " + o3 + "\n                L" + o3 / 2 + " 0\n            ", fill: r4, opacity: a3, strokeWidth: s3, stroke: void 0 === d3 ? "transparent" : d3, style: { pointerEvents: "none" } }) });
};
function p2() {
  return p2 = Object.assign || function(t5) {
    for (var e6 = 1; e6 < arguments.length; e6++) {
      var i3 = arguments[e6];
      for (var n3 in i3)
        Object.prototype.hasOwnProperty.call(i3, n3) && (t5[n3] = i3[n3]);
    }
    return t5;
  }, p2.apply(this, arguments);
}
var b3 = { top: 0, right: 0, bottom: 0, left: 0 };
var k2 = function(t5) {
  var e6, i3 = t5.direction, n3 = t5.itemsSpacing, o3 = t5.padding, r4 = t5.itemCount, l3 = t5.itemWidth, a3 = t5.itemHeight;
  if ("number" != typeof o3 && ("object" != typeof (e6 = o3) || Array.isArray(e6) || null === e6))
    throw new Error("Invalid property padding, must be one of: number, object");
  var c8 = "number" == typeof o3 ? { top: o3, right: o3, bottom: o3, left: o3 } : p2({}, b3, o3), s3 = c8.left + c8.right, d3 = c8.top + c8.bottom, h3 = l3 + s3, g3 = a3 + d3, m4 = (r4 - 1) * n3;
  return "row" === i3 ? h3 = l3 * r4 + m4 + s3 : "column" === i3 && (g3 = a3 * r4 + m4 + d3), { width: h3, height: g3, padding: c8 };
};
var x4 = function(t5) {
  var e6 = t5.anchor, i3 = t5.translateX, n3 = t5.translateY, o3 = t5.containerWidth, r4 = t5.containerHeight, l3 = t5.width, a3 = t5.height, c8 = i3, s3 = n3;
  switch (e6) {
    case "top":
      c8 += (o3 - l3) / 2;
      break;
    case "top-right":
      c8 += o3 - l3;
      break;
    case "right":
      c8 += o3 - l3, s3 += (r4 - a3) / 2;
      break;
    case "bottom-right":
      c8 += o3 - l3, s3 += r4 - a3;
      break;
    case "bottom":
      c8 += (o3 - l3) / 2, s3 += r4 - a3;
      break;
    case "bottom-left":
      s3 += r4 - a3;
      break;
    case "left":
      s3 += (r4 - a3) / 2;
      break;
    case "center":
      c8 += (o3 - l3) / 2, s3 += (r4 - a3) / 2;
  }
  return { x: c8, y: s3 };
};
var S2 = function(t5) {
  var e6, i3, n3, o3, r4, l3, a3 = t5.direction, c8 = t5.justify, s3 = t5.symbolSize, d3 = t5.symbolSpacing, h3 = t5.width, g3 = t5.height;
  switch (a3) {
    case "left-to-right":
      e6 = 0, i3 = (g3 - s3) / 2, o3 = g3 / 2, l3 = "central", c8 ? (n3 = h3, r4 = "end") : (n3 = s3 + d3, r4 = "start");
      break;
    case "right-to-left":
      e6 = h3 - s3, i3 = (g3 - s3) / 2, o3 = g3 / 2, l3 = "central", c8 ? (n3 = 0, r4 = "start") : (n3 = h3 - s3 - d3, r4 = "end");
      break;
    case "top-to-bottom":
      e6 = (h3 - s3) / 2, i3 = 0, n3 = h3 / 2, r4 = "middle", c8 ? (o3 = g3, l3 = "alphabetic") : (o3 = s3 + d3, l3 = "text-before-edge");
      break;
    case "bottom-to-top":
      e6 = (h3 - s3) / 2, i3 = g3 - s3, n3 = h3 / 2, r4 = "middle", c8 ? (o3 = 0, l3 = "text-before-edge") : (o3 = g3 - s3 - d3, l3 = "alphabetic");
  }
  return { symbolX: e6, symbolY: i3, labelX: n3, labelY: o3, labelAnchor: r4, labelAlignment: l3 };
};
var O4 = { circle: m3, diamond: f3, square: u2, triangle: v3 };
var B2 = function(i3) {
  var n3, r4, l3, c8, h3, g3, m4, f4, u3, v4, y4, b4 = i3.x, k3 = i3.y, x5 = i3.width, A3 = i3.height, W2 = i3.data, z2 = i3.direction, C4 = void 0 === z2 ? "left-to-right" : z2, B3 = i3.justify, w3 = void 0 !== B3 && B3, X2 = i3.textColor, Y2 = i3.background, H2 = void 0 === Y2 ? "transparent" : Y2, E3 = i3.opacity, j2 = void 0 === E3 ? 1 : E3, T3 = i3.symbolShape, L = void 0 === T3 ? "square" : T3, M2 = i3.symbolSize, F2 = void 0 === M2 ? 16 : M2, P3 = i3.symbolSpacing, R = void 0 === P3 ? 8 : P3, q = i3.symbolBorderWidth, V2 = void 0 === q ? 0 : q, D2 = i3.symbolBorderColor, G = void 0 === D2 ? "transparent" : D2, I = i3.onClick, N2 = i3.onMouseEnter, _ = i3.onMouseLeave, J = i3.toggleSerie, K = i3.effects, Q = (0, import_react8.useState)({}), U = Q[0], Z = Q[1], $ = Vt(), tt2 = (0, import_react8.useCallback)(function(t5) {
    if (K) {
      var e6 = K.filter(function(t6) {
        return "hover" === t6.on;
      }).reduce(function(t6, e7) {
        return p2({}, t6, e7.style);
      }, {});
      Z(e6);
    }
    null == N2 || N2(W2, t5);
  }, [N2, W2, K]), et2 = (0, import_react8.useCallback)(function(t5) {
    if (K) {
      var e6 = K.filter(function(t6) {
        return "hover" !== t6.on;
      }).reduce(function(t6, e7) {
        return p2({}, t6, e7.style);
      }, {});
      Z(e6);
    }
    null == _ || _(W2, t5);
  }, [_, W2, K]), it2 = S2({ direction: C4, justify: w3, symbolSize: null != (n3 = U.symbolSize) ? n3 : F2, symbolSpacing: R, width: x5, height: A3 }), nt2 = it2.symbolX, ot2 = it2.symbolY, rt2 = it2.labelX, lt = it2.labelY, at = it2.labelAnchor, ct = it2.labelAlignment, st2 = [I, N2, _, J].some(function(t5) {
    return void 0 !== t5;
  }), dt = "function" == typeof L ? L : O4[L];
  return (0, import_jsx_runtime3.jsxs)("g", { transform: "translate(" + b4 + "," + k3 + ")", style: { opacity: null != (r4 = U.itemOpacity) ? r4 : j2 }, children: [(0, import_jsx_runtime3.jsx)("rect", { width: x5, height: A3, fill: null != (l3 = U.itemBackground) ? l3 : H2, style: { cursor: st2 ? "pointer" : "auto" }, onClick: function(t5) {
    null == I || I(W2, t5), null == J || J(W2.id);
  }, onMouseEnter: tt2, onMouseLeave: et2 }), a2.createElement(dt, p2({ id: W2.id, x: nt2, y: ot2, size: null != (c8 = U.symbolSize) ? c8 : F2, fill: null != (h3 = null != (g3 = W2.fill) ? g3 : W2.color) ? h3 : "black", borderWidth: null != (m4 = U.symbolBorderWidth) ? m4 : V2, borderColor: null != (f4 = U.symbolBorderColor) ? f4 : G }, W2.hidden ? $.legends.hidden.symbol : void 0)), (0, import_jsx_runtime3.jsx)("text", { textAnchor: at, style: p2({}, $.legends.text, { fill: null != (u3 = null != (v4 = null != (y4 = U.itemTextColor) ? y4 : X2) ? v4 : $.legends.text.fill) ? u3 : "black", dominantBaseline: ct, pointerEvents: "none", userSelect: "none" }, W2.hidden ? $.legends.hidden.text : void 0), x: rt2, y: lt, children: W2.label })] });
};
var w2 = function(e6) {
  var i3 = e6.data, n3 = e6.x, o3 = e6.y, r4 = e6.direction, l3 = e6.padding, a3 = void 0 === l3 ? 0 : l3, c8 = e6.justify, s3 = e6.effects, d3 = e6.itemWidth, h3 = e6.itemHeight, g3 = e6.itemDirection, m4 = void 0 === g3 ? "left-to-right" : g3, f4 = e6.itemsSpacing, u3 = void 0 === f4 ? 0 : f4, v4 = e6.itemTextColor, p3 = e6.itemBackground, y4 = void 0 === p3 ? "transparent" : p3, b4 = e6.itemOpacity, x5 = void 0 === b4 ? 1 : b4, S3 = e6.symbolShape, A3 = e6.symbolSize, W2 = e6.symbolSpacing, z2 = e6.symbolBorderWidth, C4 = e6.symbolBorderColor, O5 = e6.onClick, w3 = e6.onMouseEnter, X2 = e6.onMouseLeave, Y2 = e6.toggleSerie, H2 = k2({ itemCount: i3.length, itemWidth: d3, itemHeight: h3, itemsSpacing: u3, direction: r4, padding: a3 }).padding, E3 = "row" === r4 ? d3 + u3 : 0, j2 = "column" === r4 ? h3 + u3 : 0;
  return (0, import_jsx_runtime3.jsx)("g", { transform: "translate(" + n3 + "," + o3 + ")", children: i3.map(function(e7, i4) {
    return (0, import_jsx_runtime3.jsx)(B2, { data: e7, x: i4 * E3 + H2.left, y: i4 * j2 + H2.top, width: d3, height: h3, direction: m4, justify: c8, effects: s3, textColor: v4, background: y4, opacity: x5, symbolShape: S3, symbolSize: A3, symbolSpacing: W2, symbolBorderWidth: z2, symbolBorderColor: C4, onClick: O5, onMouseEnter: w3, onMouseLeave: X2, toggleSerie: Y2 }, i4);
  }) });
};
var X = function(e6) {
  var i3 = e6.data, n3 = e6.containerWidth, o3 = e6.containerHeight, r4 = e6.translateX, l3 = void 0 === r4 ? 0 : r4, a3 = e6.translateY, c8 = void 0 === a3 ? 0 : a3, s3 = e6.anchor, d3 = e6.direction, h3 = e6.padding, g3 = void 0 === h3 ? 0 : h3, m4 = e6.justify, f4 = e6.itemsSpacing, u3 = void 0 === f4 ? 0 : f4, v4 = e6.itemWidth, p3 = e6.itemHeight, y4 = e6.itemDirection, b4 = e6.itemTextColor, S3 = e6.itemBackground, A3 = e6.itemOpacity, W2 = e6.symbolShape, z2 = e6.symbolSize, C4 = e6.symbolSpacing, O5 = e6.symbolBorderWidth, B3 = e6.symbolBorderColor, X2 = e6.onClick, Y2 = e6.onMouseEnter, H2 = e6.onMouseLeave, E3 = e6.toggleSerie, j2 = e6.effects, T3 = k2({ itemCount: i3.length, itemsSpacing: u3, itemWidth: v4, itemHeight: p3, direction: d3, padding: g3 }), L = T3.width, M2 = T3.height, F2 = x4({ anchor: s3, translateX: l3, translateY: c8, containerWidth: n3, containerHeight: o3, width: L, height: M2 }), P3 = F2.x, R = F2.y;
  return (0, import_jsx_runtime3.jsx)(w2, { data: i3, x: P3, y: R, direction: d3, padding: g3, justify: m4, effects: j2, itemsSpacing: u3, itemWidth: v4, itemHeight: p3, itemDirection: y4, itemTextColor: b4, itemBackground: S3, itemOpacity: A3, symbolShape: W2, symbolSize: z2, symbolSpacing: C4, symbolBorderWidth: O5, symbolBorderColor: B3, onClick: X2, onMouseEnter: Y2, onMouseLeave: H2, toggleSerie: "boolean" == typeof E3 ? void 0 : E3 });
};
var Y = { start: "left", middle: "center", end: "right" };
var H = function(t5, e6) {
  var i3 = e6.data, n3 = e6.containerWidth, o3 = e6.containerHeight, r4 = e6.translateX, l3 = void 0 === r4 ? 0 : r4, a3 = e6.translateY, c8 = void 0 === a3 ? 0 : a3, s3 = e6.anchor, d3 = e6.direction, h3 = e6.padding, g3 = void 0 === h3 ? 0 : h3, m4 = e6.justify, f4 = void 0 !== m4 && m4, u3 = e6.itemsSpacing, v4 = void 0 === u3 ? 0 : u3, p3 = e6.itemWidth, y4 = e6.itemHeight, b4 = e6.itemDirection, A3 = void 0 === b4 ? "left-to-right" : b4, W2 = e6.itemTextColor, z2 = e6.symbolSize, C4 = void 0 === z2 ? 16 : z2, O5 = e6.symbolSpacing, B3 = void 0 === O5 ? 8 : O5, w3 = e6.theme, X2 = k2({ itemCount: i3.length, itemWidth: p3, itemHeight: y4, itemsSpacing: v4, direction: d3, padding: g3 }), H2 = X2.width, E3 = X2.height, j2 = X2.padding, T3 = x4({ anchor: s3, translateX: l3, translateY: c8, containerWidth: n3, containerHeight: o3, width: H2, height: E3 }), L = T3.x, M2 = T3.y, F2 = "row" === d3 ? p3 + v4 : 0, P3 = "column" === d3 ? y4 + v4 : 0;
  t5.save(), t5.translate(L, M2), t5.font = w3.legends.text.fontSize + "px " + (w3.legends.text.fontFamily || "sans-serif"), i3.forEach(function(e7, i4) {
    var n4, o4, r5 = i4 * F2 + j2.left, l4 = i4 * P3 + j2.top, a4 = S2({ direction: A3, justify: f4, symbolSize: C4, symbolSpacing: B3, width: p3, height: y4 }), c9 = a4.symbolX, s4 = a4.symbolY, d4 = a4.labelX, h4 = a4.labelY, g4 = a4.labelAnchor, m5 = a4.labelAlignment;
    t5.fillStyle = null != (n4 = e7.color) ? n4 : "black", t5.fillRect(r5 + c9, l4 + s4, C4, C4), t5.textAlign = Y[g4], "central" === m5 && (t5.textBaseline = "middle"), t5.fillStyle = null != (o4 = null != W2 ? W2 : w3.legends.text.fill) ? o4 : "black", t5.fillText(String(e7.label), r5 + d4, l4 + h4);
  }), t5.restore();
};
var T2 = { data: import_prop_types3.default.arrayOf(import_prop_types3.default.object), anchor: import_prop_types3.default.oneOf(["top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", "center"]).isRequired, translateX: import_prop_types3.default.number, translateY: import_prop_types3.default.number, direction: import_prop_types3.default.oneOf(["row", "column"]).isRequired, itemsSpacing: import_prop_types3.default.number, itemWidth: import_prop_types3.default.number.isRequired, itemHeight: import_prop_types3.default.number.isRequired, itemDirection: import_prop_types3.default.oneOf(["left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"]), itemTextColor: import_prop_types3.default.string, itemBackground: import_prop_types3.default.string, itemOpacity: import_prop_types3.default.number, symbolShape: import_prop_types3.default.oneOfType([import_prop_types3.default.oneOf(["circle", "diamond", "square", "triangle"]), import_prop_types3.default.func]), symbolSize: import_prop_types3.default.number, symbolSpacing: import_prop_types3.default.number, symbolBorderWidth: import_prop_types3.default.number, symbolBorderColor: import_prop_types3.default.string, onClick: import_prop_types3.default.func, onMouseEnter: import_prop_types3.default.func, onMouseLeave: import_prop_types3.default.func, effects: import_prop_types3.default.arrayOf(import_prop_types3.default.shape({ on: import_prop_types3.default.oneOfType([import_prop_types3.default.oneOf(["hover"])]).isRequired, style: import_prop_types3.default.shape({ itemTextColor: import_prop_types3.default.string, itemBackground: import_prop_types3.default.string, itemOpacity: import_prop_types3.default.number, symbolSize: import_prop_types3.default.number, symbolBorderWidth: import_prop_types3.default.number, symbolBorderColor: import_prop_types3.default.string }).isRequired })) };

export {
  useSpring,
  useTransition,
  animated,
  b2 as b,
  w,
  C3 as C,
  P2 as P,
  k,
  require_isObject,
  require_Stack,
  require_baseFor,
  require_isArray,
  require_isArrayLike,
  require_baseUnary,
  require_identity,
  require_baseRest,
  require_isIterateeCall,
  require_isSymbol,
  require_isKey,
  require_memoize,
  require_arrayMap,
  require_toKey,
  require_baseGet,
  require_get,
  require_last,
  band,
  point,
  linear2 as linear,
  log,
  symlog,
  quantize,
  timeFormat,
  timeParse,
  utcParse,
  time,
  utcTime,
  require_SetCache,
  require_arrayIncludes,
  require_arrayIncludesWith,
  require_cacheHas,
  line_default,
  area_default,
  format2 as format,
  require_setToArray,
  require_keys,
  require_Set,
  require_baseIsEqual,
  require_hasIn,
  require_baseFlatten,
  et,
  tt,
  it,
  Rt,
  qt,
  kt,
  Mt,
  At,
  Xt,
  Vt,
  Zt,
  ti,
  ui,
  yi,
  Si,
  Mi,
  Bi,
  Fi,
  Ei,
  Hi,
  Ji,
  Qi,
  rn,
  We,
  Xe,
  pr,
  require_isDate,
  X,
  H,
  T2 as T
};
//# sourceMappingURL=/build/_shared/chunk-QROJZRQX.js.map
