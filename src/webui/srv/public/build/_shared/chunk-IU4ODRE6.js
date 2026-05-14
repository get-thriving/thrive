import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  ButtonGroup_default,
  Button_default,
  OutlinedInput_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js
var import_react = __toESM(require_react());

// ../../node_modules/flairup/dist/esm/index.js
function asArray(v) {
  return [].concat(v);
}
function isPsuedoSelector(selector) {
  return selector.startsWith(":");
}
function isStyleCondition(selector) {
  return isString(selector) && (selector === "*" || selector.length > 1 && ":>~.+*".includes(selector.slice(0, 1)) || isImmediatePostcondition(selector));
}
function isValidProperty(property, value) {
  return (isString(value) || typeof value === "number") && !isCssVariables(property) && !isPsuedoSelector(property) && !isMediaQuery(property);
}
function isMediaQuery(selector) {
  return selector.startsWith("@media");
}
function isDirectClass(selector) {
  return selector === ".";
}
function isCssVariables(selector) {
  return selector === "--";
}
function isString(value) {
  return value + "" === value;
}
function isImmediatePostcondition(value) {
  return isString(value) && (value.startsWith("&") || isPsuedoSelector(value));
}
function joinTruthy(arr, delimiter = "") {
  return arr.filter(Boolean).join(delimiter);
}
function stableHash(prefix, seed) {
  let hash = 0;
  if (seed.length === 0)
    return hash.toString();
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${prefix ?? "cl"}_${hash.toString(36)}`;
}
function handlePropertyValue(property, value) {
  if (property === "content") {
    return `"${value}"`;
  }
  return value;
}
function camelCaseToDash(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function joinedProperty(property, value) {
  return `${property}:${value}`;
}
function toClass(str) {
  return str ? `.${str}` : "";
}
function appendString(base, line) {
  return base ? `${base}
${line}` : line;
}
var Rule = class _Rule {
  constructor(sheet, property, value, selector) {
    this.sheet = sheet;
    this.property = property;
    this.value = value;
    this.selector = selector;
    this.property = property;
    this.value = value;
    this.joined = joinedProperty(property, value);
    const joinedConditions = this.selector.preconditions.concat(
      this.selector.postconditions
    );
    this.hash = this.selector.hasConditions ? this.selector.scopeClassName : stableHash(this.sheet.name, this.joined);
    this.key = joinTruthy([this.joined, joinedConditions, this.hash]);
  }
  toString() {
    let selectors = mergeSelectors(this.selector.preconditions, {
      right: this.hash
    });
    selectors = mergeSelectors(this.selector.postconditions, {
      left: selectors
    });
    return `${selectors} {${_Rule.genRule(this.property, this.value)}}`;
  }
  static genRule(property, value) {
    const transformedProperty = camelCaseToDash(property);
    return joinedProperty(
      transformedProperty,
      handlePropertyValue(property, value)
    ) + ";";
  }
};
function mergeSelectors(selectors, { left = "", right = "" } = {}) {
  const output = selectors.reduce((selectors2, current) => {
    if (isPsuedoSelector(current)) {
      return selectors2 + current;
    }
    if (isImmediatePostcondition(current)) {
      return selectors2 + current.slice(1);
    }
    return joinTruthy([selectors2, current], " ");
  }, left);
  return joinTruthy([output, toClass(right)], " ");
}
var Selector = class _Selector {
  constructor(sheet, scopeName = null, {
    preconditions,
    postconditions
  } = {}) {
    this.sheet = sheet;
    this.preconditions = [];
    this.scopeClassName = null;
    this.scopeName = null;
    this.postconditions = [];
    this.preconditions = preconditions ? asArray(preconditions) : [];
    this.postconditions = postconditions ? asArray(postconditions) : [];
    this.setScope(scopeName);
  }
  setScope(scopeName) {
    if (!scopeName) {
      return this;
    }
    if (!this.scopeClassName) {
      this.scopeName = scopeName;
      this.scopeClassName = stableHash(
        this.sheet.name,
        // adding the count guarantees uniqueness across style.create calls
        scopeName + this.sheet.count
      );
    }
    return this;
  }
  get hasConditions() {
    return this.preconditions.length > 0 || this.postconditions.length > 0;
  }
  addScope(scopeName) {
    return new _Selector(this.sheet, scopeName, {
      preconditions: this.preconditions,
      postconditions: this.postconditions
    });
  }
  addPrecondition(precondition) {
    return new _Selector(this.sheet, this.scopeClassName, {
      postconditions: this.postconditions,
      preconditions: this.preconditions.concat(precondition)
    });
  }
  addPostcondition(postcondition) {
    return new _Selector(this.sheet, this.scopeClassName, {
      preconditions: this.preconditions,
      postconditions: this.postconditions.concat(postcondition)
    });
  }
  createRule(property, value) {
    return new Rule(this.sheet, property, value, this);
  }
};
var Sheet = class {
  constructor(name, rootNode) {
    this.name = name;
    this.rootNode = rootNode;
    this.storedStyles = {};
    this.storedClasses = {};
    this.style = "";
    this.count = 0;
    this.id = `flairup-${name}`;
    this.styleTag = this.createStyleTag();
  }
  getStyle() {
    return this.style;
  }
  append(css) {
    this.style = appendString(this.style, css);
  }
  apply() {
    this.count++;
    if (!this.styleTag) {
      return;
    }
    this.styleTag.innerHTML = this.style;
  }
  isApplied() {
    return !!this.styleTag;
  }
  createStyleTag() {
    if (typeof document === "undefined" || this.isApplied() || // Explicitly disallow mounting to the DOM
    this.rootNode === null) {
      return this.styleTag;
    }
    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.id = this.id;
    (this.rootNode ?? document.head).appendChild(styleTag);
    return styleTag;
  }
  addRule(rule) {
    const storedClass = this.storedClasses[rule.key];
    if (isString(storedClass)) {
      return storedClass;
    }
    this.storedClasses[rule.key] = rule.hash;
    this.storedStyles[rule.hash] = [rule.property, rule.value];
    this.append(rule.toString());
    return rule.hash;
  }
};
function forIn(obj, fn) {
  for (const key in obj) {
    fn(key.trim(), obj[key]);
  }
}
function cx(...args) {
  const classes = args.reduce((classes2, arg) => {
    if (arg instanceof Set) {
      classes2.push(...arg);
    } else if (typeof arg === "string") {
      classes2.push(arg);
    } else if (Array.isArray(arg)) {
      classes2.push(cx(...arg));
    } else if (typeof arg === "object") {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes2.push(key);
        }
      });
    }
    return classes2;
  }, []);
  return joinTruthy(classes, " ").trim();
}
function createSheet(name, rootNode) {
  const sheet = new Sheet(name, rootNode);
  return {
    create,
    getStyle: sheet.getStyle.bind(sheet),
    isApplied: sheet.isApplied.bind(sheet)
  };
  function create(styles2) {
    const scopedStyles = {};
    iteratePreconditions(sheet, styles2, new Selector(sheet)).forEach(
      ([scopeName, styles22, selector]) => {
        iterateStyles(sheet, styles22, selector).forEach(
          (className) => {
            addScopedStyle(scopeName, className);
          }
        );
      }
    );
    sheet.apply();
    return scopedStyles;
    function addScopedStyle(name2, className) {
      scopedStyles[name2] = scopedStyles[name2] ?? /* @__PURE__ */ new Set();
      scopedStyles[name2].add(className);
    }
  }
}
function iteratePreconditions(sheet, styles2, selector) {
  const output = [];
  forIn(styles2, (key, value) => {
    if (isStyleCondition(key)) {
      return iteratePreconditions(
        sheet,
        value,
        selector.addPrecondition(key)
      ).forEach((item) => output.push(item));
    }
    output.push([key, styles2[key], selector.addScope(key)]);
  });
  return output;
}
function iterateStyles(sheet, styles2, selector) {
  const output = /* @__PURE__ */ new Set();
  forIn(styles2, (property, value) => {
    let res = [];
    if (isStyleCondition(property)) {
      res = iterateStyles(
        sheet,
        value,
        selector.addPostcondition(property)
      );
    } else if (isDirectClass(property)) {
      res = asArray(value);
    } else if (isMediaQuery(property)) {
      res = handleMediaQuery(sheet, value, property, selector);
    } else if (isCssVariables(property)) {
      res = cssVariablesBlock(sheet, value, selector);
    } else if (isValidProperty(property, value)) {
      const rule = selector.createRule(property, value);
      sheet.addRule(rule);
      output.add(rule.hash);
    }
    return addEachClass(res, output);
  });
  return output;
}
function addEachClass(list, to) {
  list.forEach((className) => to.add(className));
  return to;
}
function cssVariablesBlock(sheet, styles2, selector) {
  const classes = /* @__PURE__ */ new Set();
  const chunkRows = [];
  forIn(styles2, (property, value) => {
    if (isValidProperty(property, value)) {
      chunkRows.push(Rule.genRule(property, value));
      return;
    }
    const res = iterateStyles(sheet, value ?? {}, selector);
    addEachClass(res, classes);
  });
  if (!selector.scopeClassName) {
    return classes;
  }
  if (chunkRows.length) {
    const output = chunkRows.join(" ");
    sheet.append(
      `${mergeSelectors(selector.preconditions, {
        right: selector.scopeClassName
      })} {${output}}`
    );
  }
  classes.add(selector.scopeClassName);
  return classes;
}
function handleMediaQuery(sheet, styles2, mediaQuery, selector) {
  sheet.append(mediaQuery + " {");
  const output = iterateStyles(sheet, styles2, selector);
  sheet.append("}");
  return output;
}

// ../../node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
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
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it)
    return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it)
      o = it;
    var i = 0;
    return function() {
      if (i >= o.length)
        return {
          done: true
        };
      return {
        done: false,
        value: o[i++]
      };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var ClassNames;
(function(ClassNames2) {
  ClassNames2["hiddenOnSearch"] = "epr-hidden-on-search";
  ClassNames2["searchActive"] = "epr-search-active";
  ClassNames2["hidden"] = "epr-hidden";
  ClassNames2["visible"] = "epr-visible";
  ClassNames2["active"] = "epr-active";
  ClassNames2["emoji"] = "epr-emoji";
  ClassNames2["category"] = "epr-emoji-category";
  ClassNames2["label"] = "epr-emoji-category-label";
  ClassNames2["categoryContent"] = "epr-emoji-category-content";
  ClassNames2["emojiHasVariations"] = "epr-emoji-has-variations";
  ClassNames2["scrollBody"] = "epr-body";
  ClassNames2["emojiList"] = "epr-emoji-list";
  ClassNames2["external"] = "__EmojiPicker__";
  ClassNames2["emojiPicker"] = "EmojiPickerReact";
  ClassNames2["open"] = "epr-open";
  ClassNames2["vertical"] = "epr-vertical";
  ClassNames2["horizontal"] = "epr-horizontal";
  ClassNames2["variationPicker"] = "epr-emoji-variation-picker";
  ClassNames2["darkTheme"] = "epr-dark-theme";
  ClassNames2["autoTheme"] = "epr-auto-theme";
})(ClassNames || (ClassNames = {}));
function asSelectors() {
  for (var _len = arguments.length, classNames = new Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }
  return classNames.map(function(c) {
    return "." + c;
  }).join("");
}
var stylesheet = /* @__PURE__ */ createSheet("epr", null);
var hidden = {
  display: "none",
  opacity: "0",
  pointerEvents: "none",
  visibility: "hidden",
  overflow: "hidden"
};
var commonStyles = /* @__PURE__ */ stylesheet.create({
  hidden: /* @__PURE__ */ _extends({
    ".": ClassNames.hidden
  }, hidden)
});
var PickerStyleTag = /* @__PURE__ */ (0, import_react.memo)(function PickerStyleTag2() {
  return (0, import_react.createElement)("style", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: stylesheet.getStyle()
    }
  });
});
var commonInteractionStyles = /* @__PURE__ */ stylesheet.create({
  ".epr-main": {
    ":has(input:not(:placeholder-shown))": {
      categoryBtn: {
        ":hover": {
          opacity: "1",
          backgroundPositionY: "var(--epr-category-navigation-button-size)"
        }
      },
      hiddenOnSearch: /* @__PURE__ */ _extends({
        ".": ClassNames.hiddenOnSearch
      }, hidden)
    },
    ":has(input:placeholder-shown)": {
      visibleOnSearchOnly: hidden
    }
  },
  hiddenOnReactions: {
    transition: "all 0.5s ease-in-out"
  },
  ".epr-reactions": {
    hiddenOnReactions: {
      height: "0px",
      width: "0px",
      opacity: "0",
      pointerEvents: "none",
      overflow: "hidden"
    }
  },
  ".EmojiPickerReact:not(.epr-search-active)": {
    categoryBtn: {
      ":hover": {
        opacity: "1",
        backgroundPositionY: "var(--epr-category-navigation-button-size)"
      },
      "&.epr-active": {
        opacity: "1",
        backgroundPositionY: "var(--epr-category-navigation-button-size)"
      }
    },
    visibleOnSearchOnly: /* @__PURE__ */ _extends({
      ".": "epr-visible-on-search-only"
    }, hidden)
  }
});
function darkMode(key, value) {
  var _eprDarkTheme, _eprAutoTheme;
  return {
    ".epr-dark-theme": (_eprDarkTheme = {}, _eprDarkTheme[key] = value, _eprDarkTheme),
    ".epr-auto-theme": (_eprAutoTheme = {}, _eprAutoTheme[key] = {
      "@media (prefers-color-scheme: dark)": value
    }, _eprAutoTheme)
  };
}
function compareConfig(prev, next) {
  var _prev$customEmojis, _next$customEmojis;
  var prevCustomEmojis = (_prev$customEmojis = prev.customEmojis) != null ? _prev$customEmojis : [];
  var nextCustomEmojis = (_next$customEmojis = next.customEmojis) != null ? _next$customEmojis : [];
  return prev.open === next.open && prev.emojiVersion === next.emojiVersion && prev.reactionsDefaultOpen === next.reactionsDefaultOpen && prev.searchPlaceHolder === next.searchPlaceHolder && prev.searchPlaceholder === next.searchPlaceholder && prev.defaultSkinTone === next.defaultSkinTone && prev.skinTonesDisabled === next.skinTonesDisabled && prev.autoFocusSearch === next.autoFocusSearch && prev.emojiStyle === next.emojiStyle && prev.theme === next.theme && prev.suggestedEmojisMode === next.suggestedEmojisMode && prev.lazyLoadEmojis === next.lazyLoadEmojis && prev.className === next.className && prev.height === next.height && prev.width === next.width && prev.style === next.style && prev.searchDisabled === next.searchDisabled && prev.skinTonePickerLocation === next.skinTonePickerLocation && prevCustomEmojis.length === nextCustomEmojis.length;
}
var DEFAULT_REACTIONS = [
  "1f44d",
  "2764-fe0f",
  "1f603",
  "1f622",
  "1f64f",
  "1f44e",
  "1f621"
  // 😡
];
var alphaNumericEmojiIndex = {};
setTimeout(function() {
  allEmojis.reduce(function(searchIndex, emoji) {
    indexEmoji(emoji);
    return searchIndex;
  }, alphaNumericEmojiIndex);
});
function indexEmoji(emoji) {
  var joinedNameString = emojiNames(emoji).flat().join("").toLowerCase().replace(/[^a-zA-Z\d]/g, "").split("");
  joinedNameString.forEach(function(_char) {
    var _alphaNumericEmojiInd;
    alphaNumericEmojiIndex[_char] = (_alphaNumericEmojiInd = alphaNumericEmojiIndex[_char]) != null ? _alphaNumericEmojiInd : {};
    alphaNumericEmojiIndex[_char][emojiUnified(emoji)] = emoji;
  });
}
function useDebouncedState(initialValue, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  var _useState = (0, import_react.useState)(initialValue), state = _useState[0], setState = _useState[1];
  var timer = (0, import_react.useRef)(null);
  function debouncedSetState(value) {
    return new Promise(function(resolve) {
      var _window;
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = (_window = window) == null ? void 0 : _window.setTimeout(function() {
        setState(value);
        resolve(value);
      }, delay);
    });
  }
  return [state, debouncedSetState];
}
function useIsUnicodeHidden() {
  var unicodeToHide = useUnicodeToHide();
  return function(emojiUnified2) {
    return unicodeToHide.has(emojiUnified2);
  };
}
function useDisallowedEmojis() {
  var DisallowedEmojisRef = (0, import_react.useRef)({});
  var emojiVersionConfig = useEmojiVersionConfig();
  return (0, import_react.useMemo)(function() {
    var emojiVersion = parseFloat("" + emojiVersionConfig);
    if (!emojiVersionConfig || Number.isNaN(emojiVersion)) {
      return DisallowedEmojisRef.current;
    }
    return allEmojis.reduce(function(disallowedEmojis, emoji) {
      if (addedInNewerVersion(emoji, emojiVersion)) {
        disallowedEmojis[emojiUnified(emoji)] = true;
      }
      return disallowedEmojis;
    }, DisallowedEmojisRef.current);
  }, [emojiVersionConfig]);
}
function useIsEmojiDisallowed() {
  var disallowedEmojis = useDisallowedEmojis();
  var isUnicodeHidden = useIsUnicodeHidden();
  return function isEmojiDisallowed(emoji) {
    var unified = unifiedWithoutSkinTone(emojiUnified(emoji));
    return Boolean(disallowedEmojis[unified] || isUnicodeHidden(unified));
  };
}
function addedInNewerVersion(emoji, supportedLevel) {
  return addedIn(emoji) > supportedLevel;
}
function useMarkInitialLoad(dispatch) {
  (0, import_react.useEffect)(function() {
    dispatch(true);
  }, [dispatch]);
}
var SuggestionMode;
(function(SuggestionMode2) {
  SuggestionMode2["RECENT"] = "recent";
  SuggestionMode2["FREQUENT"] = "frequent";
})(SuggestionMode || (SuggestionMode = {}));
var EmojiStyle;
(function(EmojiStyle2) {
  EmojiStyle2["NATIVE"] = "native";
  EmojiStyle2["APPLE"] = "apple";
  EmojiStyle2["TWITTER"] = "twitter";
  EmojiStyle2["GOOGLE"] = "google";
  EmojiStyle2["FACEBOOK"] = "facebook";
})(EmojiStyle || (EmojiStyle = {}));
var Theme;
(function(Theme2) {
  Theme2["DARK"] = "dark";
  Theme2["LIGHT"] = "light";
  Theme2["AUTO"] = "auto";
})(Theme || (Theme = {}));
var SkinTones;
(function(SkinTones2) {
  SkinTones2["NEUTRAL"] = "neutral";
  SkinTones2["LIGHT"] = "1f3fb";
  SkinTones2["MEDIUM_LIGHT"] = "1f3fc";
  SkinTones2["MEDIUM"] = "1f3fd";
  SkinTones2["MEDIUM_DARK"] = "1f3fe";
  SkinTones2["DARK"] = "1f3ff";
})(SkinTones || (SkinTones = {}));
var Categories;
(function(Categories2) {
  Categories2["SUGGESTED"] = "suggested";
  Categories2["CUSTOM"] = "custom";
  Categories2["SMILEYS_PEOPLE"] = "smileys_people";
  Categories2["ANIMALS_NATURE"] = "animals_nature";
  Categories2["FOOD_DRINK"] = "food_drink";
  Categories2["TRAVEL_PLACES"] = "travel_places";
  Categories2["ACTIVITIES"] = "activities";
  Categories2["OBJECTS"] = "objects";
  Categories2["SYMBOLS"] = "symbols";
  Categories2["FLAGS"] = "flags";
})(Categories || (Categories = {}));
var SkinTonePickerLocation;
(function(SkinTonePickerLocation2) {
  SkinTonePickerLocation2["SEARCH"] = "SEARCH";
  SkinTonePickerLocation2["PREVIEW"] = "PREVIEW";
})(SkinTonePickerLocation || (SkinTonePickerLocation = {}));
function PickerContextProvider(_ref) {
  var children = _ref.children;
  var disallowedEmojis = useDisallowedEmojis();
  var defaultSkinTone = useDefaultSkinToneConfig();
  var reactionsDefaultOpen = useReactionsOpenConfig();
  var filterRef = (0, import_react.useRef)(alphaNumericEmojiIndex);
  var disallowClickRef = (0, import_react.useRef)(false);
  var disallowMouseRef = (0, import_react.useRef)(false);
  var disallowedEmojisRef = (0, import_react.useRef)(disallowedEmojis);
  var suggestedUpdateState = useDebouncedState(Date.now(), 200);
  var searchTerm = useDebouncedState("", 100);
  var skinToneFanOpenState = (0, import_react.useState)(false);
  var activeSkinTone = (0, import_react.useState)(defaultSkinTone);
  var activeCategoryState = (0, import_react.useState)(null);
  var emojisThatFailedToLoadState = (0, import_react.useState)(/* @__PURE__ */ new Set());
  var emojiVariationPickerState = (0, import_react.useState)(null);
  var reactionsModeState = (0, import_react.useState)(reactionsDefaultOpen);
  var _useState = (0, import_react.useState)(false), isPastInitialLoad = _useState[0], setIsPastInitialLoad = _useState[1];
  var visibleCategoriesState = (0, import_react.useState)([]);
  useMarkInitialLoad(setIsPastInitialLoad);
  return (0, import_react.createElement)(PickerContext.Provider, {
    value: {
      activeCategoryState,
      activeSkinTone,
      disallowClickRef,
      disallowMouseRef,
      disallowedEmojisRef,
      emojiVariationPickerState,
      emojisThatFailedToLoadState,
      filterRef,
      isPastInitialLoad,
      searchTerm,
      skinToneFanOpenState,
      suggestedUpdateState,
      reactionsModeState,
      visibleCategoriesState
    }
  }, children);
}
var PickerContext = /* @__PURE__ */ (0, import_react.createContext)({
  activeCategoryState: [null, function() {
  }],
  activeSkinTone: [SkinTones.NEUTRAL, function() {
  }],
  disallowClickRef: {
    current: false
  },
  disallowMouseRef: {
    current: false
  },
  disallowedEmojisRef: {
    current: {}
  },
  emojiVariationPickerState: [null, function() {
  }],
  emojisThatFailedToLoadState: [/* @__PURE__ */ new Set(), function() {
  }],
  filterRef: {
    current: {}
  },
  isPastInitialLoad: true,
  searchTerm: ["", function() {
    return new Promise(function() {
      return void 0;
    });
  }],
  skinToneFanOpenState: [false, function() {
  }],
  suggestedUpdateState: [/* @__PURE__ */ Date.now(), function() {
  }],
  reactionsModeState: [false, function() {
  }],
  visibleCategoriesState: [[], function() {
    return [];
  }]
});
function useFilterRef() {
  var _React$useContext = (0, import_react.useContext)(PickerContext), filterRef = _React$useContext.filterRef;
  return filterRef;
}
function useDisallowClickRef() {
  var _React$useContext2 = (0, import_react.useContext)(PickerContext), disallowClickRef = _React$useContext2.disallowClickRef;
  return disallowClickRef;
}
function useDisallowMouseRef() {
  var _React$useContext3 = (0, import_react.useContext)(PickerContext), disallowMouseRef = _React$useContext3.disallowMouseRef;
  return disallowMouseRef;
}
function useReactionsModeState() {
  var _React$useContext4 = (0, import_react.useContext)(PickerContext), reactionsModeState = _React$useContext4.reactionsModeState;
  return reactionsModeState;
}
function useSearchTermState() {
  var _React$useContext5 = (0, import_react.useContext)(PickerContext), searchTerm = _React$useContext5.searchTerm;
  return searchTerm;
}
function useActiveSkinToneState() {
  var _React$useContext6 = (0, import_react.useContext)(PickerContext), activeSkinTone = _React$useContext6.activeSkinTone;
  return activeSkinTone;
}
function useEmojisThatFailedToLoadState() {
  var _React$useContext7 = (0, import_react.useContext)(PickerContext), emojisThatFailedToLoadState = _React$useContext7.emojisThatFailedToLoadState;
  return emojisThatFailedToLoadState;
}
function useEmojiVariationPickerState() {
  var _React$useContext9 = (0, import_react.useContext)(PickerContext), emojiVariationPickerState = _React$useContext9.emojiVariationPickerState;
  return emojiVariationPickerState;
}
function useSkinToneFanOpenState() {
  var _React$useContext10 = (0, import_react.useContext)(PickerContext), skinToneFanOpenState = _React$useContext10.skinToneFanOpenState;
  return skinToneFanOpenState;
}
function useVisibleCategoriesState() {
  var _React$useContext12 = (0, import_react.useContext)(PickerContext), visibleCategoriesState = _React$useContext12.visibleCategoriesState;
  return visibleCategoriesState;
}
function useUpdateSuggested() {
  var _React$useContext13 = (0, import_react.useContext)(PickerContext), suggestedUpdateState = _React$useContext13.suggestedUpdateState;
  var suggestedUpdated = suggestedUpdateState[0], setsuggestedUpdate = suggestedUpdateState[1];
  return [suggestedUpdated, function updateSuggested() {
    setsuggestedUpdate(Date.now());
  }];
}
var _configByCategory;
var categoriesOrdered = [Categories.SUGGESTED, Categories.CUSTOM, Categories.SMILEYS_PEOPLE, Categories.ANIMALS_NATURE, Categories.FOOD_DRINK, Categories.TRAVEL_PLACES, Categories.ACTIVITIES, Categories.OBJECTS, Categories.SYMBOLS, Categories.FLAGS];
var SuggestedRecent = {
  name: "Recently Used",
  category: Categories.SUGGESTED
};
var configByCategory = (_configByCategory = {}, _configByCategory[Categories.SUGGESTED] = {
  category: Categories.SUGGESTED,
  name: "Frequently Used"
}, _configByCategory[Categories.CUSTOM] = {
  category: Categories.CUSTOM,
  name: "Custom Emojis"
}, _configByCategory[Categories.SMILEYS_PEOPLE] = {
  category: Categories.SMILEYS_PEOPLE,
  name: "Smileys & People"
}, _configByCategory[Categories.ANIMALS_NATURE] = {
  category: Categories.ANIMALS_NATURE,
  name: "Animals & Nature"
}, _configByCategory[Categories.FOOD_DRINK] = {
  category: Categories.FOOD_DRINK,
  name: "Food & Drink"
}, _configByCategory[Categories.TRAVEL_PLACES] = {
  category: Categories.TRAVEL_PLACES,
  name: "Travel & Places"
}, _configByCategory[Categories.ACTIVITIES] = {
  category: Categories.ACTIVITIES,
  name: "Activities"
}, _configByCategory[Categories.OBJECTS] = {
  category: Categories.OBJECTS,
  name: "Objects"
}, _configByCategory[Categories.SYMBOLS] = {
  category: Categories.SYMBOLS,
  name: "Symbols"
}, _configByCategory[Categories.FLAGS] = {
  category: Categories.FLAGS,
  name: "Flags"
}, _configByCategory);
function baseCategoriesConfig(modifiers) {
  return categoriesOrdered.map(function(category) {
    return _extends({}, configByCategory[category], modifiers && modifiers[category] && modifiers[category]);
  });
}
function categoryFromCategoryConfig(category) {
  return category.category;
}
function categoryNameFromCategoryConfig(category) {
  return category.name;
}
function mergeCategoriesConfig(userCategoriesConfig, modifiers) {
  var _userCategoriesConfig;
  if (userCategoriesConfig === void 0) {
    userCategoriesConfig = [];
  }
  if (modifiers === void 0) {
    modifiers = {};
  }
  var extra = {};
  if (modifiers.suggestionMode === SuggestionMode.RECENT) {
    extra[Categories.SUGGESTED] = SuggestedRecent;
  }
  var base = baseCategoriesConfig(extra);
  if (!((_userCategoriesConfig = userCategoriesConfig) != null && _userCategoriesConfig.length)) {
    return base;
  }
  return userCategoriesConfig.map(function(category) {
    if (typeof category === "string") {
      return getBaseConfigByCategory(category, extra[category]);
    }
    return _extends({}, getBaseConfigByCategory(category.category, extra[category.category]), category);
  });
}
function getBaseConfigByCategory(category, modifier) {
  if (modifier === void 0) {
    modifier = {};
  }
  return Object.assign(configByCategory[category], modifier);
}
var CDN_URL_APPLE = "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/";
var CDN_URL_FACEBOOK = "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/";
var CDN_URL_TWITTER = "https://cdn.jsdelivr.net/npm/emoji-datasource-twitter/img/twitter/64/";
var CDN_URL_GOOGLE = "https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/";
function cdnUrl(emojiStyle) {
  switch (emojiStyle) {
    case EmojiStyle.TWITTER:
      return CDN_URL_TWITTER;
    case EmojiStyle.GOOGLE:
      return CDN_URL_GOOGLE;
    case EmojiStyle.FACEBOOK:
      return CDN_URL_FACEBOOK;
    case EmojiStyle.APPLE:
    default:
      return CDN_URL_APPLE;
  }
}
var custom = [];
var smileys_people = [
  {
    n: [
      "grinning",
      "grinning face"
    ],
    u: "1f600",
    a: "1.0"
  },
  {
    n: [
      "smiley",
      "smiling face with open mouth"
    ],
    u: "1f603",
    a: "0.6"
  },
  {
    n: [
      "smile",
      "smiling face with open mouth and smiling eyes"
    ],
    u: "1f604",
    a: "0.6"
  },
  {
    n: [
      "grin",
      "grinning face with smiling eyes"
    ],
    u: "1f601",
    a: "0.6"
  },
  {
    n: [
      "laughing",
      "satisfied",
      "smiling face with open mouth and tightly-closed eyes"
    ],
    u: "1f606",
    a: "0.6"
  },
  {
    n: [
      "sweat smile",
      "smiling face with open mouth and cold sweat"
    ],
    u: "1f605",
    a: "0.6"
  },
  {
    n: [
      "rolling on the floor laughing"
    ],
    u: "1f923",
    a: "3.0"
  },
  {
    n: [
      "joy",
      "face with tears of joy"
    ],
    u: "1f602",
    a: "0.6"
  },
  {
    n: [
      "slightly smiling face"
    ],
    u: "1f642",
    a: "1.0"
  },
  {
    n: [
      "upside-down face",
      "upside down face"
    ],
    u: "1f643",
    a: "1.0"
  },
  {
    n: [
      "melting face"
    ],
    u: "1fae0",
    a: "14.0"
  },
  {
    n: [
      "wink",
      "winking face"
    ],
    u: "1f609",
    a: "0.6"
  },
  {
    n: [
      "blush",
      "smiling face with smiling eyes"
    ],
    u: "1f60a",
    a: "0.6"
  },
  {
    n: [
      "innocent",
      "smiling face with halo"
    ],
    u: "1f607",
    a: "1.0"
  },
  {
    n: [
      "smiling face with 3 hearts",
      "smiling face with smiling eyes and three hearts"
    ],
    u: "1f970",
    a: "11.0"
  },
  {
    n: [
      "heart eyes",
      "smiling face with heart-shaped eyes"
    ],
    u: "1f60d",
    a: "0.6"
  },
  {
    n: [
      "star-struck",
      "grinning face with star eyes"
    ],
    u: "1f929",
    a: "5.0"
  },
  {
    n: [
      "kissing heart",
      "face throwing a kiss"
    ],
    u: "1f618",
    a: "0.6"
  },
  {
    n: [
      "kissing",
      "kissing face"
    ],
    u: "1f617",
    a: "1.0"
  },
  {
    n: [
      "relaxed",
      "white smiling face"
    ],
    u: "263a-fe0f",
    a: "0.6"
  },
  {
    n: [
      "kissing closed eyes",
      "kissing face with closed eyes"
    ],
    u: "1f61a",
    a: "0.6"
  },
  {
    n: [
      "kissing smiling eyes",
      "kissing face with smiling eyes"
    ],
    u: "1f619",
    a: "1.0"
  },
  {
    n: [
      "smiling face with tear"
    ],
    u: "1f972",
    a: "13.0"
  },
  {
    n: [
      "yum",
      "face savouring delicious food"
    ],
    u: "1f60b",
    a: "0.6"
  },
  {
    n: [
      "stuck out tongue",
      "face with stuck-out tongue"
    ],
    u: "1f61b",
    a: "1.0"
  },
  {
    n: [
      "stuck out tongue winking eye",
      "face with stuck-out tongue and winking eye"
    ],
    u: "1f61c",
    a: "0.6"
  },
  {
    n: [
      "zany face",
      "grinning face with one large and one small eye"
    ],
    u: "1f92a",
    a: "5.0"
  },
  {
    n: [
      "stuck out tongue closed eyes",
      "face with stuck-out tongue and tightly-closed eyes"
    ],
    u: "1f61d",
    a: "0.6"
  },
  {
    n: [
      "money-mouth face",
      "money mouth face"
    ],
    u: "1f911",
    a: "1.0"
  },
  {
    n: [
      "hugging face"
    ],
    u: "1f917",
    a: "1.0"
  },
  {
    n: [
      "face with hand over mouth",
      "smiling face with smiling eyes and hand covering mouth"
    ],
    u: "1f92d",
    a: "5.0"
  },
  {
    n: [
      "face with open eyes and hand over mouth"
    ],
    u: "1fae2",
    a: "14.0"
  },
  {
    n: [
      "face with peeking eye"
    ],
    u: "1fae3",
    a: "14.0"
  },
  {
    n: [
      "shushing face",
      "face with finger covering closed lips"
    ],
    u: "1f92b",
    a: "5.0"
  },
  {
    n: [
      "thinking face"
    ],
    u: "1f914",
    a: "1.0"
  },
  {
    n: [
      "saluting face"
    ],
    u: "1fae1",
    a: "14.0"
  },
  {
    n: [
      "zipper-mouth face",
      "zipper mouth face"
    ],
    u: "1f910",
    a: "1.0"
  },
  {
    n: [
      "face with raised eyebrow",
      "face with one eyebrow raised"
    ],
    u: "1f928",
    a: "5.0"
  },
  {
    n: [
      "neutral face"
    ],
    u: "1f610",
    a: "0.7"
  },
  {
    n: [
      "expressionless",
      "expressionless face"
    ],
    u: "1f611",
    a: "1.0"
  },
  {
    n: [
      "no mouth",
      "face without mouth"
    ],
    u: "1f636",
    a: "1.0"
  },
  {
    n: [
      "dotted line face"
    ],
    u: "1fae5",
    a: "14.0"
  },
  {
    n: [
      "face in clouds"
    ],
    u: "1f636-200d-1f32b-fe0f",
    a: "13.1"
  },
  {
    n: [
      "smirk",
      "smirking face"
    ],
    u: "1f60f",
    a: "0.6"
  },
  {
    n: [
      "unamused",
      "unamused face"
    ],
    u: "1f612",
    a: "0.6"
  },
  {
    n: [
      "face with rolling eyes"
    ],
    u: "1f644",
    a: "1.0"
  },
  {
    n: [
      "grimacing",
      "grimacing face"
    ],
    u: "1f62c",
    a: "1.0"
  },
  {
    n: [
      "face exhaling"
    ],
    u: "1f62e-200d-1f4a8",
    a: "13.1"
  },
  {
    n: [
      "lying face"
    ],
    u: "1f925",
    a: "3.0"
  },
  {
    n: [
      "shaking face"
    ],
    u: "1fae8",
    a: "15.0"
  },
  {
    n: [
      "head shaking horizontally"
    ],
    u: "1f642-200d-2194-fe0f",
    a: "15.1"
  },
  {
    n: [
      "head shaking vertically"
    ],
    u: "1f642-200d-2195-fe0f",
    a: "15.1"
  },
  {
    n: [
      "relieved",
      "relieved face"
    ],
    u: "1f60c",
    a: "0.6"
  },
  {
    n: [
      "pensive",
      "pensive face"
    ],
    u: "1f614",
    a: "0.6"
  },
  {
    n: [
      "sleepy",
      "sleepy face"
    ],
    u: "1f62a",
    a: "0.6"
  },
  {
    n: [
      "drooling face"
    ],
    u: "1f924",
    a: "3.0"
  },
  {
    n: [
      "sleeping",
      "sleeping face"
    ],
    u: "1f634",
    a: "1.0"
  },
  {
    n: [
      "mask",
      "face with medical mask"
    ],
    u: "1f637",
    a: "0.6"
  },
  {
    n: [
      "face with thermometer"
    ],
    u: "1f912",
    a: "1.0"
  },
  {
    n: [
      "face with head-bandage",
      "face with head bandage"
    ],
    u: "1f915",
    a: "1.0"
  },
  {
    n: [
      "nauseated face"
    ],
    u: "1f922",
    a: "3.0"
  },
  {
    n: [
      "face vomiting",
      "face with open mouth vomiting"
    ],
    u: "1f92e",
    a: "5.0"
  },
  {
    n: [
      "sneezing face"
    ],
    u: "1f927",
    a: "3.0"
  },
  {
    n: [
      "hot face",
      "overheated face"
    ],
    u: "1f975",
    a: "11.0"
  },
  {
    n: [
      "cold face",
      "freezing face"
    ],
    u: "1f976",
    a: "11.0"
  },
  {
    n: [
      "woozy face",
      "face with uneven eyes and wavy mouth"
    ],
    u: "1f974",
    a: "11.0"
  },
  {
    n: [
      "dizzy face"
    ],
    u: "1f635",
    a: "0.6"
  },
  {
    n: [
      "face with spiral eyes"
    ],
    u: "1f635-200d-1f4ab",
    a: "13.1"
  },
  {
    n: [
      "exploding head",
      "shocked face with exploding head"
    ],
    u: "1f92f",
    a: "5.0"
  },
  {
    n: [
      "face with cowboy hat"
    ],
    u: "1f920",
    a: "3.0"
  },
  {
    n: [
      "partying face",
      "face with party horn and party hat"
    ],
    u: "1f973",
    a: "11.0"
  },
  {
    n: [
      "disguised face"
    ],
    u: "1f978",
    a: "13.0"
  },
  {
    n: [
      "sunglasses",
      "smiling face with sunglasses"
    ],
    u: "1f60e",
    a: "1.0"
  },
  {
    n: [
      "nerd face"
    ],
    u: "1f913",
    a: "1.0"
  },
  {
    n: [
      "face with monocle"
    ],
    u: "1f9d0",
    a: "5.0"
  },
  {
    n: [
      "confused",
      "confused face"
    ],
    u: "1f615",
    a: "1.0"
  },
  {
    n: [
      "face with diagonal mouth"
    ],
    u: "1fae4",
    a: "14.0"
  },
  {
    n: [
      "worried",
      "worried face"
    ],
    u: "1f61f",
    a: "1.0"
  },
  {
    n: [
      "slightly frowning face"
    ],
    u: "1f641",
    a: "1.0"
  },
  {
    n: [
      "frowning face",
      "white frowning face"
    ],
    u: "2639-fe0f",
    a: "0.7"
  },
  {
    n: [
      "open mouth",
      "face with open mouth"
    ],
    u: "1f62e",
    a: "1.0"
  },
  {
    n: [
      "hushed",
      "hushed face"
    ],
    u: "1f62f",
    a: "1.0"
  },
  {
    n: [
      "astonished",
      "astonished face"
    ],
    u: "1f632",
    a: "0.6"
  },
  {
    n: [
      "flushed",
      "flushed face"
    ],
    u: "1f633",
    a: "0.6"
  },
  {
    n: [
      "pleading face",
      "face with pleading eyes"
    ],
    u: "1f97a",
    a: "11.0"
  },
  {
    n: [
      "face holding back tears"
    ],
    u: "1f979",
    a: "14.0"
  },
  {
    n: [
      "frowning",
      "frowning face with open mouth"
    ],
    u: "1f626",
    a: "1.0"
  },
  {
    n: [
      "anguished",
      "anguished face"
    ],
    u: "1f627",
    a: "1.0"
  },
  {
    n: [
      "fearful",
      "fearful face"
    ],
    u: "1f628",
    a: "0.6"
  },
  {
    n: [
      "cold sweat",
      "face with open mouth and cold sweat"
    ],
    u: "1f630",
    a: "0.6"
  },
  {
    n: [
      "disappointed relieved",
      "disappointed but relieved face"
    ],
    u: "1f625",
    a: "0.6"
  },
  {
    n: [
      "cry",
      "crying face"
    ],
    u: "1f622",
    a: "0.6"
  },
  {
    n: [
      "sob",
      "loudly crying face"
    ],
    u: "1f62d",
    a: "0.6"
  },
  {
    n: [
      "scream",
      "face screaming in fear"
    ],
    u: "1f631",
    a: "0.6"
  },
  {
    n: [
      "confounded",
      "confounded face"
    ],
    u: "1f616",
    a: "0.6"
  },
  {
    n: [
      "persevere",
      "persevering face"
    ],
    u: "1f623",
    a: "0.6"
  },
  {
    n: [
      "disappointed",
      "disappointed face"
    ],
    u: "1f61e",
    a: "0.6"
  },
  {
    n: [
      "sweat",
      "face with cold sweat"
    ],
    u: "1f613",
    a: "0.6"
  },
  {
    n: [
      "weary",
      "weary face"
    ],
    u: "1f629",
    a: "0.6"
  },
  {
    n: [
      "tired face"
    ],
    u: "1f62b",
    a: "0.6"
  },
  {
    n: [
      "yawning face"
    ],
    u: "1f971",
    a: "12.0"
  },
  {
    n: [
      "triumph",
      "face with look of triumph"
    ],
    u: "1f624",
    a: "0.6"
  },
  {
    n: [
      "rage",
      "pouting face"
    ],
    u: "1f621",
    a: "0.6"
  },
  {
    n: [
      "angry",
      "angry face"
    ],
    u: "1f620",
    a: "0.6"
  },
  {
    n: [
      "face with symbols on mouth",
      "serious face with symbols covering mouth"
    ],
    u: "1f92c",
    a: "5.0"
  },
  {
    n: [
      "smiling imp",
      "smiling face with horns"
    ],
    u: "1f608",
    a: "1.0"
  },
  {
    n: [
      "imp"
    ],
    u: "1f47f",
    a: "0.6"
  },
  {
    n: [
      "skull"
    ],
    u: "1f480",
    a: "0.6"
  },
  {
    n: [
      "skull and crossbones"
    ],
    u: "2620-fe0f",
    a: "1.0"
  },
  {
    n: [
      "poop",
      "shit",
      "hankey",
      "pile of poo"
    ],
    u: "1f4a9",
    a: "0.6"
  },
  {
    n: [
      "clown face"
    ],
    u: "1f921",
    a: "3.0"
  },
  {
    n: [
      "japanese ogre"
    ],
    u: "1f479",
    a: "0.6"
  },
  {
    n: [
      "japanese goblin"
    ],
    u: "1f47a",
    a: "0.6"
  },
  {
    n: [
      "ghost"
    ],
    u: "1f47b",
    a: "0.6"
  },
  {
    n: [
      "alien",
      "extraterrestrial alien"
    ],
    u: "1f47d",
    a: "0.6"
  },
  {
    n: [
      "alien monster",
      "space invader"
    ],
    u: "1f47e",
    a: "0.6"
  },
  {
    n: [
      "robot face"
    ],
    u: "1f916",
    a: "1.0"
  },
  {
    n: [
      "smiley cat",
      "smiling cat face with open mouth"
    ],
    u: "1f63a",
    a: "0.6"
  },
  {
    n: [
      "smile cat",
      "grinning cat face with smiling eyes"
    ],
    u: "1f638",
    a: "0.6"
  },
  {
    n: [
      "joy cat",
      "cat face with tears of joy"
    ],
    u: "1f639",
    a: "0.6"
  },
  {
    n: [
      "heart eyes cat",
      "smiling cat face with heart-shaped eyes"
    ],
    u: "1f63b",
    a: "0.6"
  },
  {
    n: [
      "smirk cat",
      "cat face with wry smile"
    ],
    u: "1f63c",
    a: "0.6"
  },
  {
    n: [
      "kissing cat",
      "kissing cat face with closed eyes"
    ],
    u: "1f63d",
    a: "0.6"
  },
  {
    n: [
      "scream cat",
      "weary cat face"
    ],
    u: "1f640",
    a: "0.6"
  },
  {
    n: [
      "crying cat face"
    ],
    u: "1f63f",
    a: "0.6"
  },
  {
    n: [
      "pouting cat",
      "pouting cat face"
    ],
    u: "1f63e",
    a: "0.6"
  },
  {
    n: [
      "see no evil",
      "see-no-evil monkey"
    ],
    u: "1f648",
    a: "0.6"
  },
  {
    n: [
      "hear no evil",
      "hear-no-evil monkey"
    ],
    u: "1f649",
    a: "0.6"
  },
  {
    n: [
      "speak no evil",
      "speak-no-evil monkey"
    ],
    u: "1f64a",
    a: "0.6"
  },
  {
    n: [
      "love letter"
    ],
    u: "1f48c",
    a: "0.6"
  },
  {
    n: [
      "cupid",
      "heart with arrow"
    ],
    u: "1f498",
    a: "0.6"
  },
  {
    n: [
      "gift heart",
      "heart with ribbon"
    ],
    u: "1f49d",
    a: "0.6"
  },
  {
    n: [
      "sparkling heart"
    ],
    u: "1f496",
    a: "0.6"
  },
  {
    n: [
      "heartpulse",
      "growing heart"
    ],
    u: "1f497",
    a: "0.6"
  },
  {
    n: [
      "heartbeat",
      "beating heart"
    ],
    u: "1f493",
    a: "0.6"
  },
  {
    n: [
      "revolving hearts"
    ],
    u: "1f49e",
    a: "0.6"
  },
  {
    n: [
      "two hearts"
    ],
    u: "1f495",
    a: "0.6"
  },
  {
    n: [
      "heart decoration"
    ],
    u: "1f49f",
    a: "0.6"
  },
  {
    n: [
      "heart exclamation",
      "heavy heart exclamation mark ornament"
    ],
    u: "2763-fe0f",
    a: "1.0"
  },
  {
    n: [
      "broken heart"
    ],
    u: "1f494",
    a: "0.6"
  },
  {
    n: [
      "heart on fire"
    ],
    u: "2764-fe0f-200d-1f525",
    a: "13.1"
  },
  {
    n: [
      "mending heart"
    ],
    u: "2764-fe0f-200d-1fa79",
    a: "13.1"
  },
  {
    n: [
      "heart",
      "heavy black heart"
    ],
    u: "2764-fe0f",
    a: "0.6"
  },
  {
    n: [
      "pink heart"
    ],
    u: "1fa77",
    a: "15.0"
  },
  {
    n: [
      "orange heart"
    ],
    u: "1f9e1",
    a: "5.0"
  },
  {
    n: [
      "yellow heart"
    ],
    u: "1f49b",
    a: "0.6"
  },
  {
    n: [
      "green heart"
    ],
    u: "1f49a",
    a: "0.6"
  },
  {
    n: [
      "blue heart"
    ],
    u: "1f499",
    a: "0.6"
  },
  {
    n: [
      "light blue heart"
    ],
    u: "1fa75",
    a: "15.0"
  },
  {
    n: [
      "purple heart"
    ],
    u: "1f49c",
    a: "0.6"
  },
  {
    n: [
      "brown heart"
    ],
    u: "1f90e",
    a: "12.0"
  },
  {
    n: [
      "black heart"
    ],
    u: "1f5a4",
    a: "3.0"
  },
  {
    n: [
      "grey heart"
    ],
    u: "1fa76",
    a: "15.0"
  },
  {
    n: [
      "white heart"
    ],
    u: "1f90d",
    a: "12.0"
  },
  {
    n: [
      "kiss",
      "kiss mark"
    ],
    u: "1f48b",
    a: "0.6"
  },
  {
    n: [
      "100",
      "hundred points symbol"
    ],
    u: "1f4af",
    a: "0.6"
  },
  {
    n: [
      "anger",
      "anger symbol"
    ],
    u: "1f4a2",
    a: "0.6"
  },
  {
    n: [
      "boom",
      "collision",
      "collision symbol"
    ],
    u: "1f4a5",
    a: "0.6"
  },
  {
    n: [
      "dizzy",
      "dizzy symbol"
    ],
    u: "1f4ab",
    a: "0.6"
  },
  {
    n: [
      "sweat drops",
      "splashing sweat symbol"
    ],
    u: "1f4a6",
    a: "0.6"
  },
  {
    n: [
      "dash",
      "dash symbol"
    ],
    u: "1f4a8",
    a: "0.6"
  },
  {
    n: [
      "hole"
    ],
    u: "1f573-fe0f",
    a: "0.7"
  },
  {
    n: [
      "speech balloon"
    ],
    u: "1f4ac",
    a: "0.6"
  },
  {
    n: [
      "eye in speech bubble",
      "eye-in-speech-bubble"
    ],
    u: "1f441-fe0f-200d-1f5e8-fe0f",
    a: "2.0"
  },
  {
    n: [
      "left speech bubble"
    ],
    u: "1f5e8-fe0f",
    a: "2.0"
  },
  {
    n: [
      "right anger bubble"
    ],
    u: "1f5ef-fe0f",
    a: "0.7"
  },
  {
    n: [
      "thought balloon"
    ],
    u: "1f4ad",
    a: "1.0"
  },
  {
    n: [
      "zzz",
      "sleeping symbol"
    ],
    u: "1f4a4",
    a: "0.6"
  },
  {
    n: [
      "wave",
      "waving hand sign"
    ],
    u: "1f44b",
    v: [
      "1f44b-1f3fb",
      "1f44b-1f3fc",
      "1f44b-1f3fd",
      "1f44b-1f3fe",
      "1f44b-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "raised back of hand"
    ],
    u: "1f91a",
    v: [
      "1f91a-1f3fb",
      "1f91a-1f3fc",
      "1f91a-1f3fd",
      "1f91a-1f3fe",
      "1f91a-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "hand with fingers splayed",
      "raised hand with fingers splayed"
    ],
    u: "1f590-fe0f",
    v: [
      "1f590-1f3fb",
      "1f590-1f3fc",
      "1f590-1f3fd",
      "1f590-1f3fe",
      "1f590-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "hand",
      "raised hand"
    ],
    u: "270b",
    v: [
      "270b-1f3fb",
      "270b-1f3fc",
      "270b-1f3fd",
      "270b-1f3fe",
      "270b-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "spock-hand",
      "raised hand with part between middle and ring fingers"
    ],
    u: "1f596",
    v: [
      "1f596-1f3fb",
      "1f596-1f3fc",
      "1f596-1f3fd",
      "1f596-1f3fe",
      "1f596-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "rightwards hand"
    ],
    u: "1faf1",
    v: [
      "1faf1-1f3fb",
      "1faf1-1f3fc",
      "1faf1-1f3fd",
      "1faf1-1f3fe",
      "1faf1-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "leftwards hand"
    ],
    u: "1faf2",
    v: [
      "1faf2-1f3fb",
      "1faf2-1f3fc",
      "1faf2-1f3fd",
      "1faf2-1f3fe",
      "1faf2-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "palm down hand"
    ],
    u: "1faf3",
    v: [
      "1faf3-1f3fb",
      "1faf3-1f3fc",
      "1faf3-1f3fd",
      "1faf3-1f3fe",
      "1faf3-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "palm up hand"
    ],
    u: "1faf4",
    v: [
      "1faf4-1f3fb",
      "1faf4-1f3fc",
      "1faf4-1f3fd",
      "1faf4-1f3fe",
      "1faf4-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "leftwards pushing hand"
    ],
    u: "1faf7",
    v: [
      "1faf7-1f3fb",
      "1faf7-1f3fc",
      "1faf7-1f3fd",
      "1faf7-1f3fe",
      "1faf7-1f3ff"
    ],
    a: "15.0"
  },
  {
    n: [
      "rightwards pushing hand"
    ],
    u: "1faf8",
    v: [
      "1faf8-1f3fb",
      "1faf8-1f3fc",
      "1faf8-1f3fd",
      "1faf8-1f3fe",
      "1faf8-1f3ff"
    ],
    a: "15.0"
  },
  {
    n: [
      "ok hand",
      "ok hand sign"
    ],
    u: "1f44c",
    v: [
      "1f44c-1f3fb",
      "1f44c-1f3fc",
      "1f44c-1f3fd",
      "1f44c-1f3fe",
      "1f44c-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "pinched fingers"
    ],
    u: "1f90c",
    v: [
      "1f90c-1f3fb",
      "1f90c-1f3fc",
      "1f90c-1f3fd",
      "1f90c-1f3fe",
      "1f90c-1f3ff"
    ],
    a: "13.0"
  },
  {
    n: [
      "pinching hand"
    ],
    u: "1f90f",
    v: [
      "1f90f-1f3fb",
      "1f90f-1f3fc",
      "1f90f-1f3fd",
      "1f90f-1f3fe",
      "1f90f-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "v",
      "victory hand"
    ],
    u: "270c-fe0f",
    v: [
      "270c-1f3fb",
      "270c-1f3fc",
      "270c-1f3fd",
      "270c-1f3fe",
      "270c-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "crossed fingers",
      "hand with index and middle fingers crossed"
    ],
    u: "1f91e",
    v: [
      "1f91e-1f3fb",
      "1f91e-1f3fc",
      "1f91e-1f3fd",
      "1f91e-1f3fe",
      "1f91e-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "hand with index finger and thumb crossed"
    ],
    u: "1faf0",
    v: [
      "1faf0-1f3fb",
      "1faf0-1f3fc",
      "1faf0-1f3fd",
      "1faf0-1f3fe",
      "1faf0-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "i love you hand sign"
    ],
    u: "1f91f",
    v: [
      "1f91f-1f3fb",
      "1f91f-1f3fc",
      "1f91f-1f3fd",
      "1f91f-1f3fe",
      "1f91f-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "the horns",
      "sign of the horns"
    ],
    u: "1f918",
    v: [
      "1f918-1f3fb",
      "1f918-1f3fc",
      "1f918-1f3fd",
      "1f918-1f3fe",
      "1f918-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "call me hand"
    ],
    u: "1f919",
    v: [
      "1f919-1f3fb",
      "1f919-1f3fc",
      "1f919-1f3fd",
      "1f919-1f3fe",
      "1f919-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "point left",
      "white left pointing backhand index"
    ],
    u: "1f448",
    v: [
      "1f448-1f3fb",
      "1f448-1f3fc",
      "1f448-1f3fd",
      "1f448-1f3fe",
      "1f448-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "point right",
      "white right pointing backhand index"
    ],
    u: "1f449",
    v: [
      "1f449-1f3fb",
      "1f449-1f3fc",
      "1f449-1f3fd",
      "1f449-1f3fe",
      "1f449-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "point up 2",
      "white up pointing backhand index"
    ],
    u: "1f446",
    v: [
      "1f446-1f3fb",
      "1f446-1f3fc",
      "1f446-1f3fd",
      "1f446-1f3fe",
      "1f446-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "middle finger",
      "reversed hand with middle finger extended"
    ],
    u: "1f595",
    v: [
      "1f595-1f3fb",
      "1f595-1f3fc",
      "1f595-1f3fd",
      "1f595-1f3fe",
      "1f595-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "point down",
      "white down pointing backhand index"
    ],
    u: "1f447",
    v: [
      "1f447-1f3fb",
      "1f447-1f3fc",
      "1f447-1f3fd",
      "1f447-1f3fe",
      "1f447-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "point up",
      "white up pointing index"
    ],
    u: "261d-fe0f",
    v: [
      "261d-1f3fb",
      "261d-1f3fc",
      "261d-1f3fd",
      "261d-1f3fe",
      "261d-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "index pointing at the viewer"
    ],
    u: "1faf5",
    v: [
      "1faf5-1f3fb",
      "1faf5-1f3fc",
      "1faf5-1f3fd",
      "1faf5-1f3fe",
      "1faf5-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "+1",
      "thumbsup",
      "thumbs up sign"
    ],
    u: "1f44d",
    v: [
      "1f44d-1f3fb",
      "1f44d-1f3fc",
      "1f44d-1f3fd",
      "1f44d-1f3fe",
      "1f44d-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "-1",
      "thumbsdown",
      "thumbs down sign"
    ],
    u: "1f44e",
    v: [
      "1f44e-1f3fb",
      "1f44e-1f3fc",
      "1f44e-1f3fd",
      "1f44e-1f3fe",
      "1f44e-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "fist",
      "raised fist"
    ],
    u: "270a",
    v: [
      "270a-1f3fb",
      "270a-1f3fc",
      "270a-1f3fd",
      "270a-1f3fe",
      "270a-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "punch",
      "facepunch",
      "fisted hand sign"
    ],
    u: "1f44a",
    v: [
      "1f44a-1f3fb",
      "1f44a-1f3fc",
      "1f44a-1f3fd",
      "1f44a-1f3fe",
      "1f44a-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "left-facing fist"
    ],
    u: "1f91b",
    v: [
      "1f91b-1f3fb",
      "1f91b-1f3fc",
      "1f91b-1f3fd",
      "1f91b-1f3fe",
      "1f91b-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "right-facing fist"
    ],
    u: "1f91c",
    v: [
      "1f91c-1f3fb",
      "1f91c-1f3fc",
      "1f91c-1f3fd",
      "1f91c-1f3fe",
      "1f91c-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "clap",
      "clapping hands sign"
    ],
    u: "1f44f",
    v: [
      "1f44f-1f3fb",
      "1f44f-1f3fc",
      "1f44f-1f3fd",
      "1f44f-1f3fe",
      "1f44f-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "raised hands",
      "person raising both hands in celebration"
    ],
    u: "1f64c",
    v: [
      "1f64c-1f3fb",
      "1f64c-1f3fc",
      "1f64c-1f3fd",
      "1f64c-1f3fe",
      "1f64c-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "heart hands"
    ],
    u: "1faf6",
    v: [
      "1faf6-1f3fb",
      "1faf6-1f3fc",
      "1faf6-1f3fd",
      "1faf6-1f3fe",
      "1faf6-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "open hands",
      "open hands sign"
    ],
    u: "1f450",
    v: [
      "1f450-1f3fb",
      "1f450-1f3fc",
      "1f450-1f3fd",
      "1f450-1f3fe",
      "1f450-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "palms up together"
    ],
    u: "1f932",
    v: [
      "1f932-1f3fb",
      "1f932-1f3fc",
      "1f932-1f3fd",
      "1f932-1f3fe",
      "1f932-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "handshake"
    ],
    u: "1f91d",
    v: [
      "1f91d-1f3fb",
      "1f91d-1f3fc",
      "1f91d-1f3fd",
      "1f91d-1f3fe",
      "1f91d-1f3ff",
      "1faf1-1f3fb-200d-1faf2-1f3fc",
      "1faf1-1f3fb-200d-1faf2-1f3fd",
      "1faf1-1f3fb-200d-1faf2-1f3fe",
      "1faf1-1f3fb-200d-1faf2-1f3ff",
      "1faf1-1f3fc-200d-1faf2-1f3fb",
      "1faf1-1f3fc-200d-1faf2-1f3fd",
      "1faf1-1f3fc-200d-1faf2-1f3fe",
      "1faf1-1f3fc-200d-1faf2-1f3ff",
      "1faf1-1f3fd-200d-1faf2-1f3fb",
      "1faf1-1f3fd-200d-1faf2-1f3fc",
      "1faf1-1f3fd-200d-1faf2-1f3fe",
      "1faf1-1f3fd-200d-1faf2-1f3ff",
      "1faf1-1f3fe-200d-1faf2-1f3fb",
      "1faf1-1f3fe-200d-1faf2-1f3fc",
      "1faf1-1f3fe-200d-1faf2-1f3fd",
      "1faf1-1f3fe-200d-1faf2-1f3ff",
      "1faf1-1f3ff-200d-1faf2-1f3fb",
      "1faf1-1f3ff-200d-1faf2-1f3fc",
      "1faf1-1f3ff-200d-1faf2-1f3fd",
      "1faf1-1f3ff-200d-1faf2-1f3fe"
    ],
    a: "3.0"
  },
  {
    n: [
      "pray",
      "person with folded hands"
    ],
    u: "1f64f",
    v: [
      "1f64f-1f3fb",
      "1f64f-1f3fc",
      "1f64f-1f3fd",
      "1f64f-1f3fe",
      "1f64f-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "writing hand"
    ],
    u: "270d-fe0f",
    v: [
      "270d-1f3fb",
      "270d-1f3fc",
      "270d-1f3fd",
      "270d-1f3fe",
      "270d-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "nail care",
      "nail polish"
    ],
    u: "1f485",
    v: [
      "1f485-1f3fb",
      "1f485-1f3fc",
      "1f485-1f3fd",
      "1f485-1f3fe",
      "1f485-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "selfie"
    ],
    u: "1f933",
    v: [
      "1f933-1f3fb",
      "1f933-1f3fc",
      "1f933-1f3fd",
      "1f933-1f3fe",
      "1f933-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "muscle",
      "flexed biceps"
    ],
    u: "1f4aa",
    v: [
      "1f4aa-1f3fb",
      "1f4aa-1f3fc",
      "1f4aa-1f3fd",
      "1f4aa-1f3fe",
      "1f4aa-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "mechanical arm"
    ],
    u: "1f9be",
    a: "12.0"
  },
  {
    n: [
      "mechanical leg"
    ],
    u: "1f9bf",
    a: "12.0"
  },
  {
    n: [
      "leg"
    ],
    u: "1f9b5",
    v: [
      "1f9b5-1f3fb",
      "1f9b5-1f3fc",
      "1f9b5-1f3fd",
      "1f9b5-1f3fe",
      "1f9b5-1f3ff"
    ],
    a: "11.0"
  },
  {
    n: [
      "foot"
    ],
    u: "1f9b6",
    v: [
      "1f9b6-1f3fb",
      "1f9b6-1f3fc",
      "1f9b6-1f3fd",
      "1f9b6-1f3fe",
      "1f9b6-1f3ff"
    ],
    a: "11.0"
  },
  {
    n: [
      "ear"
    ],
    u: "1f442",
    v: [
      "1f442-1f3fb",
      "1f442-1f3fc",
      "1f442-1f3fd",
      "1f442-1f3fe",
      "1f442-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "ear with hearing aid"
    ],
    u: "1f9bb",
    v: [
      "1f9bb-1f3fb",
      "1f9bb-1f3fc",
      "1f9bb-1f3fd",
      "1f9bb-1f3fe",
      "1f9bb-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "nose"
    ],
    u: "1f443",
    v: [
      "1f443-1f3fb",
      "1f443-1f3fc",
      "1f443-1f3fd",
      "1f443-1f3fe",
      "1f443-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "brain"
    ],
    u: "1f9e0",
    a: "5.0"
  },
  {
    n: [
      "anatomical heart"
    ],
    u: "1fac0",
    a: "13.0"
  },
  {
    n: [
      "lungs"
    ],
    u: "1fac1",
    a: "13.0"
  },
  {
    n: [
      "tooth"
    ],
    u: "1f9b7",
    a: "11.0"
  },
  {
    n: [
      "bone"
    ],
    u: "1f9b4",
    a: "11.0"
  },
  {
    n: [
      "eyes"
    ],
    u: "1f440",
    a: "0.6"
  },
  {
    n: [
      "eye"
    ],
    u: "1f441-fe0f",
    a: "0.7"
  },
  {
    n: [
      "tongue"
    ],
    u: "1f445",
    a: "0.6"
  },
  {
    n: [
      "lips",
      "mouth"
    ],
    u: "1f444",
    a: "0.6"
  },
  {
    n: [
      "biting lip"
    ],
    u: "1fae6",
    a: "14.0"
  },
  {
    n: [
      "baby"
    ],
    u: "1f476",
    v: [
      "1f476-1f3fb",
      "1f476-1f3fc",
      "1f476-1f3fd",
      "1f476-1f3fe",
      "1f476-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "child"
    ],
    u: "1f9d2",
    v: [
      "1f9d2-1f3fb",
      "1f9d2-1f3fc",
      "1f9d2-1f3fd",
      "1f9d2-1f3fe",
      "1f9d2-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "boy"
    ],
    u: "1f466",
    v: [
      "1f466-1f3fb",
      "1f466-1f3fc",
      "1f466-1f3fd",
      "1f466-1f3fe",
      "1f466-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "girl"
    ],
    u: "1f467",
    v: [
      "1f467-1f3fb",
      "1f467-1f3fc",
      "1f467-1f3fd",
      "1f467-1f3fe",
      "1f467-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "adult"
    ],
    u: "1f9d1",
    v: [
      "1f9d1-1f3fb",
      "1f9d1-1f3fc",
      "1f9d1-1f3fd",
      "1f9d1-1f3fe",
      "1f9d1-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "person with blond hair"
    ],
    u: "1f471",
    v: [
      "1f471-1f3fb",
      "1f471-1f3fc",
      "1f471-1f3fd",
      "1f471-1f3fe",
      "1f471-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man"
    ],
    u: "1f468",
    v: [
      "1f468-1f3fb",
      "1f468-1f3fc",
      "1f468-1f3fd",
      "1f468-1f3fe",
      "1f468-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "bearded person"
    ],
    u: "1f9d4",
    v: [
      "1f9d4-1f3fb",
      "1f9d4-1f3fc",
      "1f9d4-1f3fd",
      "1f9d4-1f3fe",
      "1f9d4-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man: beard",
      "man with beard"
    ],
    u: "1f9d4-200d-2642-fe0f",
    v: [
      "1f9d4-1f3fb-200d-2642-fe0f",
      "1f9d4-1f3fc-200d-2642-fe0f",
      "1f9d4-1f3fd-200d-2642-fe0f",
      "1f9d4-1f3fe-200d-2642-fe0f",
      "1f9d4-1f3ff-200d-2642-fe0f"
    ],
    a: "13.1"
  },
  {
    n: [
      "woman: beard",
      "woman with beard"
    ],
    u: "1f9d4-200d-2640-fe0f",
    v: [
      "1f9d4-1f3fb-200d-2640-fe0f",
      "1f9d4-1f3fc-200d-2640-fe0f",
      "1f9d4-1f3fd-200d-2640-fe0f",
      "1f9d4-1f3fe-200d-2640-fe0f",
      "1f9d4-1f3ff-200d-2640-fe0f"
    ],
    a: "13.1"
  },
  {
    n: [
      "man: red hair",
      "red haired man"
    ],
    u: "1f468-200d-1f9b0",
    v: [
      "1f468-1f3fb-200d-1f9b0",
      "1f468-1f3fc-200d-1f9b0",
      "1f468-1f3fd-200d-1f9b0",
      "1f468-1f3fe-200d-1f9b0",
      "1f468-1f3ff-200d-1f9b0"
    ],
    a: "11.0"
  },
  {
    n: [
      "man: curly hair",
      "curly haired man"
    ],
    u: "1f468-200d-1f9b1",
    v: [
      "1f468-1f3fb-200d-1f9b1",
      "1f468-1f3fc-200d-1f9b1",
      "1f468-1f3fd-200d-1f9b1",
      "1f468-1f3fe-200d-1f9b1",
      "1f468-1f3ff-200d-1f9b1"
    ],
    a: "11.0"
  },
  {
    n: [
      "man: white hair",
      "white haired man"
    ],
    u: "1f468-200d-1f9b3",
    v: [
      "1f468-1f3fb-200d-1f9b3",
      "1f468-1f3fc-200d-1f9b3",
      "1f468-1f3fd-200d-1f9b3",
      "1f468-1f3fe-200d-1f9b3",
      "1f468-1f3ff-200d-1f9b3"
    ],
    a: "11.0"
  },
  {
    n: [
      "bald man",
      "man: bald"
    ],
    u: "1f468-200d-1f9b2",
    v: [
      "1f468-1f3fb-200d-1f9b2",
      "1f468-1f3fc-200d-1f9b2",
      "1f468-1f3fd-200d-1f9b2",
      "1f468-1f3fe-200d-1f9b2",
      "1f468-1f3ff-200d-1f9b2"
    ],
    a: "11.0"
  },
  {
    n: [
      "woman"
    ],
    u: "1f469",
    v: [
      "1f469-1f3fb",
      "1f469-1f3fc",
      "1f469-1f3fd",
      "1f469-1f3fe",
      "1f469-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "woman: red hair",
      "red haired woman"
    ],
    u: "1f469-200d-1f9b0",
    v: [
      "1f469-1f3fb-200d-1f9b0",
      "1f469-1f3fc-200d-1f9b0",
      "1f469-1f3fd-200d-1f9b0",
      "1f469-1f3fe-200d-1f9b0",
      "1f469-1f3ff-200d-1f9b0"
    ],
    a: "11.0"
  },
  {
    n: [
      "person: red hair",
      "red haired person"
    ],
    u: "1f9d1-200d-1f9b0",
    v: [
      "1f9d1-1f3fb-200d-1f9b0",
      "1f9d1-1f3fc-200d-1f9b0",
      "1f9d1-1f3fd-200d-1f9b0",
      "1f9d1-1f3fe-200d-1f9b0",
      "1f9d1-1f3ff-200d-1f9b0"
    ],
    a: "12.1"
  },
  {
    n: [
      "woman: curly hair",
      "curly haired woman"
    ],
    u: "1f469-200d-1f9b1",
    v: [
      "1f469-1f3fb-200d-1f9b1",
      "1f469-1f3fc-200d-1f9b1",
      "1f469-1f3fd-200d-1f9b1",
      "1f469-1f3fe-200d-1f9b1",
      "1f469-1f3ff-200d-1f9b1"
    ],
    a: "11.0"
  },
  {
    n: [
      "person: curly hair",
      "curly haired person"
    ],
    u: "1f9d1-200d-1f9b1",
    v: [
      "1f9d1-1f3fb-200d-1f9b1",
      "1f9d1-1f3fc-200d-1f9b1",
      "1f9d1-1f3fd-200d-1f9b1",
      "1f9d1-1f3fe-200d-1f9b1",
      "1f9d1-1f3ff-200d-1f9b1"
    ],
    a: "12.1"
  },
  {
    n: [
      "woman: white hair",
      "white haired woman"
    ],
    u: "1f469-200d-1f9b3",
    v: [
      "1f469-1f3fb-200d-1f9b3",
      "1f469-1f3fc-200d-1f9b3",
      "1f469-1f3fd-200d-1f9b3",
      "1f469-1f3fe-200d-1f9b3",
      "1f469-1f3ff-200d-1f9b3"
    ],
    a: "11.0"
  },
  {
    n: [
      "person: white hair",
      "white haired person"
    ],
    u: "1f9d1-200d-1f9b3",
    v: [
      "1f9d1-1f3fb-200d-1f9b3",
      "1f9d1-1f3fc-200d-1f9b3",
      "1f9d1-1f3fd-200d-1f9b3",
      "1f9d1-1f3fe-200d-1f9b3",
      "1f9d1-1f3ff-200d-1f9b3"
    ],
    a: "12.1"
  },
  {
    n: [
      "bald woman",
      "woman: bald"
    ],
    u: "1f469-200d-1f9b2",
    v: [
      "1f469-1f3fb-200d-1f9b2",
      "1f469-1f3fc-200d-1f9b2",
      "1f469-1f3fd-200d-1f9b2",
      "1f469-1f3fe-200d-1f9b2",
      "1f469-1f3ff-200d-1f9b2"
    ],
    a: "11.0"
  },
  {
    n: [
      "bald person",
      "person: bald"
    ],
    u: "1f9d1-200d-1f9b2",
    v: [
      "1f9d1-1f3fb-200d-1f9b2",
      "1f9d1-1f3fc-200d-1f9b2",
      "1f9d1-1f3fd-200d-1f9b2",
      "1f9d1-1f3fe-200d-1f9b2",
      "1f9d1-1f3ff-200d-1f9b2"
    ],
    a: "12.1"
  },
  {
    n: [
      "woman: blond hair",
      "blond-haired-woman"
    ],
    u: "1f471-200d-2640-fe0f",
    v: [
      "1f471-1f3fb-200d-2640-fe0f",
      "1f471-1f3fc-200d-2640-fe0f",
      "1f471-1f3fd-200d-2640-fe0f",
      "1f471-1f3fe-200d-2640-fe0f",
      "1f471-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "man: blond hair",
      "blond-haired-man"
    ],
    u: "1f471-200d-2642-fe0f",
    v: [
      "1f471-1f3fb-200d-2642-fe0f",
      "1f471-1f3fc-200d-2642-fe0f",
      "1f471-1f3fd-200d-2642-fe0f",
      "1f471-1f3fe-200d-2642-fe0f",
      "1f471-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "older adult"
    ],
    u: "1f9d3",
    v: [
      "1f9d3-1f3fb",
      "1f9d3-1f3fc",
      "1f9d3-1f3fd",
      "1f9d3-1f3fe",
      "1f9d3-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "older man"
    ],
    u: "1f474",
    v: [
      "1f474-1f3fb",
      "1f474-1f3fc",
      "1f474-1f3fd",
      "1f474-1f3fe",
      "1f474-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "older woman"
    ],
    u: "1f475",
    v: [
      "1f475-1f3fb",
      "1f475-1f3fc",
      "1f475-1f3fd",
      "1f475-1f3fe",
      "1f475-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "person frowning"
    ],
    u: "1f64d",
    v: [
      "1f64d-1f3fb",
      "1f64d-1f3fc",
      "1f64d-1f3fd",
      "1f64d-1f3fe",
      "1f64d-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man frowning",
      "man-frowning"
    ],
    u: "1f64d-200d-2642-fe0f",
    v: [
      "1f64d-1f3fb-200d-2642-fe0f",
      "1f64d-1f3fc-200d-2642-fe0f",
      "1f64d-1f3fd-200d-2642-fe0f",
      "1f64d-1f3fe-200d-2642-fe0f",
      "1f64d-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman frowning",
      "woman-frowning"
    ],
    u: "1f64d-200d-2640-fe0f",
    v: [
      "1f64d-1f3fb-200d-2640-fe0f",
      "1f64d-1f3fc-200d-2640-fe0f",
      "1f64d-1f3fd-200d-2640-fe0f",
      "1f64d-1f3fe-200d-2640-fe0f",
      "1f64d-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person with pouting face"
    ],
    u: "1f64e",
    v: [
      "1f64e-1f3fb",
      "1f64e-1f3fc",
      "1f64e-1f3fd",
      "1f64e-1f3fe",
      "1f64e-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man pouting",
      "man-pouting"
    ],
    u: "1f64e-200d-2642-fe0f",
    v: [
      "1f64e-1f3fb-200d-2642-fe0f",
      "1f64e-1f3fc-200d-2642-fe0f",
      "1f64e-1f3fd-200d-2642-fe0f",
      "1f64e-1f3fe-200d-2642-fe0f",
      "1f64e-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman pouting",
      "woman-pouting"
    ],
    u: "1f64e-200d-2640-fe0f",
    v: [
      "1f64e-1f3fb-200d-2640-fe0f",
      "1f64e-1f3fc-200d-2640-fe0f",
      "1f64e-1f3fd-200d-2640-fe0f",
      "1f64e-1f3fe-200d-2640-fe0f",
      "1f64e-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "no good",
      "face with no good gesture"
    ],
    u: "1f645",
    v: [
      "1f645-1f3fb",
      "1f645-1f3fc",
      "1f645-1f3fd",
      "1f645-1f3fe",
      "1f645-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man gesturing no",
      "man-gesturing-no"
    ],
    u: "1f645-200d-2642-fe0f",
    v: [
      "1f645-1f3fb-200d-2642-fe0f",
      "1f645-1f3fc-200d-2642-fe0f",
      "1f645-1f3fd-200d-2642-fe0f",
      "1f645-1f3fe-200d-2642-fe0f",
      "1f645-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman gesturing no",
      "woman-gesturing-no"
    ],
    u: "1f645-200d-2640-fe0f",
    v: [
      "1f645-1f3fb-200d-2640-fe0f",
      "1f645-1f3fc-200d-2640-fe0f",
      "1f645-1f3fd-200d-2640-fe0f",
      "1f645-1f3fe-200d-2640-fe0f",
      "1f645-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "ok woman",
      "face with ok gesture"
    ],
    u: "1f646",
    v: [
      "1f646-1f3fb",
      "1f646-1f3fc",
      "1f646-1f3fd",
      "1f646-1f3fe",
      "1f646-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man gesturing ok",
      "man-gesturing-ok"
    ],
    u: "1f646-200d-2642-fe0f",
    v: [
      "1f646-1f3fb-200d-2642-fe0f",
      "1f646-1f3fc-200d-2642-fe0f",
      "1f646-1f3fd-200d-2642-fe0f",
      "1f646-1f3fe-200d-2642-fe0f",
      "1f646-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman gesturing ok",
      "woman-gesturing-ok"
    ],
    u: "1f646-200d-2640-fe0f",
    v: [
      "1f646-1f3fb-200d-2640-fe0f",
      "1f646-1f3fc-200d-2640-fe0f",
      "1f646-1f3fd-200d-2640-fe0f",
      "1f646-1f3fe-200d-2640-fe0f",
      "1f646-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "information desk person"
    ],
    u: "1f481",
    v: [
      "1f481-1f3fb",
      "1f481-1f3fc",
      "1f481-1f3fd",
      "1f481-1f3fe",
      "1f481-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man tipping hand",
      "man-tipping-hand"
    ],
    u: "1f481-200d-2642-fe0f",
    v: [
      "1f481-1f3fb-200d-2642-fe0f",
      "1f481-1f3fc-200d-2642-fe0f",
      "1f481-1f3fd-200d-2642-fe0f",
      "1f481-1f3fe-200d-2642-fe0f",
      "1f481-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman tipping hand",
      "woman-tipping-hand"
    ],
    u: "1f481-200d-2640-fe0f",
    v: [
      "1f481-1f3fb-200d-2640-fe0f",
      "1f481-1f3fc-200d-2640-fe0f",
      "1f481-1f3fd-200d-2640-fe0f",
      "1f481-1f3fe-200d-2640-fe0f",
      "1f481-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "raising hand",
      "happy person raising one hand"
    ],
    u: "1f64b",
    v: [
      "1f64b-1f3fb",
      "1f64b-1f3fc",
      "1f64b-1f3fd",
      "1f64b-1f3fe",
      "1f64b-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man raising hand",
      "man-raising-hand"
    ],
    u: "1f64b-200d-2642-fe0f",
    v: [
      "1f64b-1f3fb-200d-2642-fe0f",
      "1f64b-1f3fc-200d-2642-fe0f",
      "1f64b-1f3fd-200d-2642-fe0f",
      "1f64b-1f3fe-200d-2642-fe0f",
      "1f64b-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman raising hand",
      "woman-raising-hand"
    ],
    u: "1f64b-200d-2640-fe0f",
    v: [
      "1f64b-1f3fb-200d-2640-fe0f",
      "1f64b-1f3fc-200d-2640-fe0f",
      "1f64b-1f3fd-200d-2640-fe0f",
      "1f64b-1f3fe-200d-2640-fe0f",
      "1f64b-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "deaf person"
    ],
    u: "1f9cf",
    v: [
      "1f9cf-1f3fb",
      "1f9cf-1f3fc",
      "1f9cf-1f3fd",
      "1f9cf-1f3fe",
      "1f9cf-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "deaf man"
    ],
    u: "1f9cf-200d-2642-fe0f",
    v: [
      "1f9cf-1f3fb-200d-2642-fe0f",
      "1f9cf-1f3fc-200d-2642-fe0f",
      "1f9cf-1f3fd-200d-2642-fe0f",
      "1f9cf-1f3fe-200d-2642-fe0f",
      "1f9cf-1f3ff-200d-2642-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "deaf woman"
    ],
    u: "1f9cf-200d-2640-fe0f",
    v: [
      "1f9cf-1f3fb-200d-2640-fe0f",
      "1f9cf-1f3fc-200d-2640-fe0f",
      "1f9cf-1f3fd-200d-2640-fe0f",
      "1f9cf-1f3fe-200d-2640-fe0f",
      "1f9cf-1f3ff-200d-2640-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "bow",
      "person bowing deeply"
    ],
    u: "1f647",
    v: [
      "1f647-1f3fb",
      "1f647-1f3fc",
      "1f647-1f3fd",
      "1f647-1f3fe",
      "1f647-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man bowing",
      "man-bowing"
    ],
    u: "1f647-200d-2642-fe0f",
    v: [
      "1f647-1f3fb-200d-2642-fe0f",
      "1f647-1f3fc-200d-2642-fe0f",
      "1f647-1f3fd-200d-2642-fe0f",
      "1f647-1f3fe-200d-2642-fe0f",
      "1f647-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman bowing",
      "woman-bowing"
    ],
    u: "1f647-200d-2640-fe0f",
    v: [
      "1f647-1f3fb-200d-2640-fe0f",
      "1f647-1f3fc-200d-2640-fe0f",
      "1f647-1f3fd-200d-2640-fe0f",
      "1f647-1f3fe-200d-2640-fe0f",
      "1f647-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "face palm"
    ],
    u: "1f926",
    v: [
      "1f926-1f3fb",
      "1f926-1f3fc",
      "1f926-1f3fd",
      "1f926-1f3fe",
      "1f926-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man facepalming",
      "man-facepalming"
    ],
    u: "1f926-200d-2642-fe0f",
    v: [
      "1f926-1f3fb-200d-2642-fe0f",
      "1f926-1f3fc-200d-2642-fe0f",
      "1f926-1f3fd-200d-2642-fe0f",
      "1f926-1f3fe-200d-2642-fe0f",
      "1f926-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman facepalming",
      "woman-facepalming"
    ],
    u: "1f926-200d-2640-fe0f",
    v: [
      "1f926-1f3fb-200d-2640-fe0f",
      "1f926-1f3fc-200d-2640-fe0f",
      "1f926-1f3fd-200d-2640-fe0f",
      "1f926-1f3fe-200d-2640-fe0f",
      "1f926-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "shrug"
    ],
    u: "1f937",
    v: [
      "1f937-1f3fb",
      "1f937-1f3fc",
      "1f937-1f3fd",
      "1f937-1f3fe",
      "1f937-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man shrugging",
      "man-shrugging"
    ],
    u: "1f937-200d-2642-fe0f",
    v: [
      "1f937-1f3fb-200d-2642-fe0f",
      "1f937-1f3fc-200d-2642-fe0f",
      "1f937-1f3fd-200d-2642-fe0f",
      "1f937-1f3fe-200d-2642-fe0f",
      "1f937-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman shrugging",
      "woman-shrugging"
    ],
    u: "1f937-200d-2640-fe0f",
    v: [
      "1f937-1f3fb-200d-2640-fe0f",
      "1f937-1f3fc-200d-2640-fe0f",
      "1f937-1f3fd-200d-2640-fe0f",
      "1f937-1f3fe-200d-2640-fe0f",
      "1f937-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "health worker"
    ],
    u: "1f9d1-200d-2695-fe0f",
    v: [
      "1f9d1-1f3fb-200d-2695-fe0f",
      "1f9d1-1f3fc-200d-2695-fe0f",
      "1f9d1-1f3fd-200d-2695-fe0f",
      "1f9d1-1f3fe-200d-2695-fe0f",
      "1f9d1-1f3ff-200d-2695-fe0f"
    ],
    a: "12.1"
  },
  {
    n: [
      "male-doctor",
      "man health worker"
    ],
    u: "1f468-200d-2695-fe0f",
    v: [
      "1f468-1f3fb-200d-2695-fe0f",
      "1f468-1f3fc-200d-2695-fe0f",
      "1f468-1f3fd-200d-2695-fe0f",
      "1f468-1f3fe-200d-2695-fe0f",
      "1f468-1f3ff-200d-2695-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "female-doctor",
      "woman health worker"
    ],
    u: "1f469-200d-2695-fe0f",
    v: [
      "1f469-1f3fb-200d-2695-fe0f",
      "1f469-1f3fc-200d-2695-fe0f",
      "1f469-1f3fd-200d-2695-fe0f",
      "1f469-1f3fe-200d-2695-fe0f",
      "1f469-1f3ff-200d-2695-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "student"
    ],
    u: "1f9d1-200d-1f393",
    v: [
      "1f9d1-1f3fb-200d-1f393",
      "1f9d1-1f3fc-200d-1f393",
      "1f9d1-1f3fd-200d-1f393",
      "1f9d1-1f3fe-200d-1f393",
      "1f9d1-1f3ff-200d-1f393"
    ],
    a: "12.1"
  },
  {
    n: [
      "man student",
      "male-student"
    ],
    u: "1f468-200d-1f393",
    v: [
      "1f468-1f3fb-200d-1f393",
      "1f468-1f3fc-200d-1f393",
      "1f468-1f3fd-200d-1f393",
      "1f468-1f3fe-200d-1f393",
      "1f468-1f3ff-200d-1f393"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman student",
      "female-student"
    ],
    u: "1f469-200d-1f393",
    v: [
      "1f469-1f3fb-200d-1f393",
      "1f469-1f3fc-200d-1f393",
      "1f469-1f3fd-200d-1f393",
      "1f469-1f3fe-200d-1f393",
      "1f469-1f3ff-200d-1f393"
    ],
    a: "4.0"
  },
  {
    n: [
      "teacher"
    ],
    u: "1f9d1-200d-1f3eb",
    v: [
      "1f9d1-1f3fb-200d-1f3eb",
      "1f9d1-1f3fc-200d-1f3eb",
      "1f9d1-1f3fd-200d-1f3eb",
      "1f9d1-1f3fe-200d-1f3eb",
      "1f9d1-1f3ff-200d-1f3eb"
    ],
    a: "12.1"
  },
  {
    n: [
      "man teacher",
      "male-teacher"
    ],
    u: "1f468-200d-1f3eb",
    v: [
      "1f468-1f3fb-200d-1f3eb",
      "1f468-1f3fc-200d-1f3eb",
      "1f468-1f3fd-200d-1f3eb",
      "1f468-1f3fe-200d-1f3eb",
      "1f468-1f3ff-200d-1f3eb"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman teacher",
      "female-teacher"
    ],
    u: "1f469-200d-1f3eb",
    v: [
      "1f469-1f3fb-200d-1f3eb",
      "1f469-1f3fc-200d-1f3eb",
      "1f469-1f3fd-200d-1f3eb",
      "1f469-1f3fe-200d-1f3eb",
      "1f469-1f3ff-200d-1f3eb"
    ],
    a: "4.0"
  },
  {
    n: [
      "judge"
    ],
    u: "1f9d1-200d-2696-fe0f",
    v: [
      "1f9d1-1f3fb-200d-2696-fe0f",
      "1f9d1-1f3fc-200d-2696-fe0f",
      "1f9d1-1f3fd-200d-2696-fe0f",
      "1f9d1-1f3fe-200d-2696-fe0f",
      "1f9d1-1f3ff-200d-2696-fe0f"
    ],
    a: "12.1"
  },
  {
    n: [
      "man judge",
      "male-judge"
    ],
    u: "1f468-200d-2696-fe0f",
    v: [
      "1f468-1f3fb-200d-2696-fe0f",
      "1f468-1f3fc-200d-2696-fe0f",
      "1f468-1f3fd-200d-2696-fe0f",
      "1f468-1f3fe-200d-2696-fe0f",
      "1f468-1f3ff-200d-2696-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman judge",
      "female-judge"
    ],
    u: "1f469-200d-2696-fe0f",
    v: [
      "1f469-1f3fb-200d-2696-fe0f",
      "1f469-1f3fc-200d-2696-fe0f",
      "1f469-1f3fd-200d-2696-fe0f",
      "1f469-1f3fe-200d-2696-fe0f",
      "1f469-1f3ff-200d-2696-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "farmer"
    ],
    u: "1f9d1-200d-1f33e",
    v: [
      "1f9d1-1f3fb-200d-1f33e",
      "1f9d1-1f3fc-200d-1f33e",
      "1f9d1-1f3fd-200d-1f33e",
      "1f9d1-1f3fe-200d-1f33e",
      "1f9d1-1f3ff-200d-1f33e"
    ],
    a: "12.1"
  },
  {
    n: [
      "man farmer",
      "male-farmer"
    ],
    u: "1f468-200d-1f33e",
    v: [
      "1f468-1f3fb-200d-1f33e",
      "1f468-1f3fc-200d-1f33e",
      "1f468-1f3fd-200d-1f33e",
      "1f468-1f3fe-200d-1f33e",
      "1f468-1f3ff-200d-1f33e"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman farmer",
      "female-farmer"
    ],
    u: "1f469-200d-1f33e",
    v: [
      "1f469-1f3fb-200d-1f33e",
      "1f469-1f3fc-200d-1f33e",
      "1f469-1f3fd-200d-1f33e",
      "1f469-1f3fe-200d-1f33e",
      "1f469-1f3ff-200d-1f33e"
    ],
    a: "4.0"
  },
  {
    n: [
      "cook"
    ],
    u: "1f9d1-200d-1f373",
    v: [
      "1f9d1-1f3fb-200d-1f373",
      "1f9d1-1f3fc-200d-1f373",
      "1f9d1-1f3fd-200d-1f373",
      "1f9d1-1f3fe-200d-1f373",
      "1f9d1-1f3ff-200d-1f373"
    ],
    a: "12.1"
  },
  {
    n: [
      "man cook",
      "male-cook"
    ],
    u: "1f468-200d-1f373",
    v: [
      "1f468-1f3fb-200d-1f373",
      "1f468-1f3fc-200d-1f373",
      "1f468-1f3fd-200d-1f373",
      "1f468-1f3fe-200d-1f373",
      "1f468-1f3ff-200d-1f373"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman cook",
      "female-cook"
    ],
    u: "1f469-200d-1f373",
    v: [
      "1f469-1f3fb-200d-1f373",
      "1f469-1f3fc-200d-1f373",
      "1f469-1f3fd-200d-1f373",
      "1f469-1f3fe-200d-1f373",
      "1f469-1f3ff-200d-1f373"
    ],
    a: "4.0"
  },
  {
    n: [
      "mechanic"
    ],
    u: "1f9d1-200d-1f527",
    v: [
      "1f9d1-1f3fb-200d-1f527",
      "1f9d1-1f3fc-200d-1f527",
      "1f9d1-1f3fd-200d-1f527",
      "1f9d1-1f3fe-200d-1f527",
      "1f9d1-1f3ff-200d-1f527"
    ],
    a: "12.1"
  },
  {
    n: [
      "man mechanic",
      "male-mechanic"
    ],
    u: "1f468-200d-1f527",
    v: [
      "1f468-1f3fb-200d-1f527",
      "1f468-1f3fc-200d-1f527",
      "1f468-1f3fd-200d-1f527",
      "1f468-1f3fe-200d-1f527",
      "1f468-1f3ff-200d-1f527"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman mechanic",
      "female-mechanic"
    ],
    u: "1f469-200d-1f527",
    v: [
      "1f469-1f3fb-200d-1f527",
      "1f469-1f3fc-200d-1f527",
      "1f469-1f3fd-200d-1f527",
      "1f469-1f3fe-200d-1f527",
      "1f469-1f3ff-200d-1f527"
    ],
    a: "4.0"
  },
  {
    n: [
      "factory worker"
    ],
    u: "1f9d1-200d-1f3ed",
    v: [
      "1f9d1-1f3fb-200d-1f3ed",
      "1f9d1-1f3fc-200d-1f3ed",
      "1f9d1-1f3fd-200d-1f3ed",
      "1f9d1-1f3fe-200d-1f3ed",
      "1f9d1-1f3ff-200d-1f3ed"
    ],
    a: "12.1"
  },
  {
    n: [
      "man factory worker",
      "male-factory-worker"
    ],
    u: "1f468-200d-1f3ed",
    v: [
      "1f468-1f3fb-200d-1f3ed",
      "1f468-1f3fc-200d-1f3ed",
      "1f468-1f3fd-200d-1f3ed",
      "1f468-1f3fe-200d-1f3ed",
      "1f468-1f3ff-200d-1f3ed"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman factory worker",
      "female-factory-worker"
    ],
    u: "1f469-200d-1f3ed",
    v: [
      "1f469-1f3fb-200d-1f3ed",
      "1f469-1f3fc-200d-1f3ed",
      "1f469-1f3fd-200d-1f3ed",
      "1f469-1f3fe-200d-1f3ed",
      "1f469-1f3ff-200d-1f3ed"
    ],
    a: "4.0"
  },
  {
    n: [
      "office worker"
    ],
    u: "1f9d1-200d-1f4bc",
    v: [
      "1f9d1-1f3fb-200d-1f4bc",
      "1f9d1-1f3fc-200d-1f4bc",
      "1f9d1-1f3fd-200d-1f4bc",
      "1f9d1-1f3fe-200d-1f4bc",
      "1f9d1-1f3ff-200d-1f4bc"
    ],
    a: "12.1"
  },
  {
    n: [
      "man office worker",
      "male-office-worker"
    ],
    u: "1f468-200d-1f4bc",
    v: [
      "1f468-1f3fb-200d-1f4bc",
      "1f468-1f3fc-200d-1f4bc",
      "1f468-1f3fd-200d-1f4bc",
      "1f468-1f3fe-200d-1f4bc",
      "1f468-1f3ff-200d-1f4bc"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman office worker",
      "female-office-worker"
    ],
    u: "1f469-200d-1f4bc",
    v: [
      "1f469-1f3fb-200d-1f4bc",
      "1f469-1f3fc-200d-1f4bc",
      "1f469-1f3fd-200d-1f4bc",
      "1f469-1f3fe-200d-1f4bc",
      "1f469-1f3ff-200d-1f4bc"
    ],
    a: "4.0"
  },
  {
    n: [
      "scientist"
    ],
    u: "1f9d1-200d-1f52c",
    v: [
      "1f9d1-1f3fb-200d-1f52c",
      "1f9d1-1f3fc-200d-1f52c",
      "1f9d1-1f3fd-200d-1f52c",
      "1f9d1-1f3fe-200d-1f52c",
      "1f9d1-1f3ff-200d-1f52c"
    ],
    a: "12.1"
  },
  {
    n: [
      "man scientist",
      "male-scientist"
    ],
    u: "1f468-200d-1f52c",
    v: [
      "1f468-1f3fb-200d-1f52c",
      "1f468-1f3fc-200d-1f52c",
      "1f468-1f3fd-200d-1f52c",
      "1f468-1f3fe-200d-1f52c",
      "1f468-1f3ff-200d-1f52c"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman scientist",
      "female-scientist"
    ],
    u: "1f469-200d-1f52c",
    v: [
      "1f469-1f3fb-200d-1f52c",
      "1f469-1f3fc-200d-1f52c",
      "1f469-1f3fd-200d-1f52c",
      "1f469-1f3fe-200d-1f52c",
      "1f469-1f3ff-200d-1f52c"
    ],
    a: "4.0"
  },
  {
    n: [
      "technologist"
    ],
    u: "1f9d1-200d-1f4bb",
    v: [
      "1f9d1-1f3fb-200d-1f4bb",
      "1f9d1-1f3fc-200d-1f4bb",
      "1f9d1-1f3fd-200d-1f4bb",
      "1f9d1-1f3fe-200d-1f4bb",
      "1f9d1-1f3ff-200d-1f4bb"
    ],
    a: "12.1"
  },
  {
    n: [
      "man technologist",
      "male-technologist"
    ],
    u: "1f468-200d-1f4bb",
    v: [
      "1f468-1f3fb-200d-1f4bb",
      "1f468-1f3fc-200d-1f4bb",
      "1f468-1f3fd-200d-1f4bb",
      "1f468-1f3fe-200d-1f4bb",
      "1f468-1f3ff-200d-1f4bb"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman technologist",
      "female-technologist"
    ],
    u: "1f469-200d-1f4bb",
    v: [
      "1f469-1f3fb-200d-1f4bb",
      "1f469-1f3fc-200d-1f4bb",
      "1f469-1f3fd-200d-1f4bb",
      "1f469-1f3fe-200d-1f4bb",
      "1f469-1f3ff-200d-1f4bb"
    ],
    a: "4.0"
  },
  {
    n: [
      "singer"
    ],
    u: "1f9d1-200d-1f3a4",
    v: [
      "1f9d1-1f3fb-200d-1f3a4",
      "1f9d1-1f3fc-200d-1f3a4",
      "1f9d1-1f3fd-200d-1f3a4",
      "1f9d1-1f3fe-200d-1f3a4",
      "1f9d1-1f3ff-200d-1f3a4"
    ],
    a: "12.1"
  },
  {
    n: [
      "man singer",
      "male-singer"
    ],
    u: "1f468-200d-1f3a4",
    v: [
      "1f468-1f3fb-200d-1f3a4",
      "1f468-1f3fc-200d-1f3a4",
      "1f468-1f3fd-200d-1f3a4",
      "1f468-1f3fe-200d-1f3a4",
      "1f468-1f3ff-200d-1f3a4"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman singer",
      "female-singer"
    ],
    u: "1f469-200d-1f3a4",
    v: [
      "1f469-1f3fb-200d-1f3a4",
      "1f469-1f3fc-200d-1f3a4",
      "1f469-1f3fd-200d-1f3a4",
      "1f469-1f3fe-200d-1f3a4",
      "1f469-1f3ff-200d-1f3a4"
    ],
    a: "4.0"
  },
  {
    n: [
      "artist"
    ],
    u: "1f9d1-200d-1f3a8",
    v: [
      "1f9d1-1f3fb-200d-1f3a8",
      "1f9d1-1f3fc-200d-1f3a8",
      "1f9d1-1f3fd-200d-1f3a8",
      "1f9d1-1f3fe-200d-1f3a8",
      "1f9d1-1f3ff-200d-1f3a8"
    ],
    a: "12.1"
  },
  {
    n: [
      "man artist",
      "male-artist"
    ],
    u: "1f468-200d-1f3a8",
    v: [
      "1f468-1f3fb-200d-1f3a8",
      "1f468-1f3fc-200d-1f3a8",
      "1f468-1f3fd-200d-1f3a8",
      "1f468-1f3fe-200d-1f3a8",
      "1f468-1f3ff-200d-1f3a8"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman artist",
      "female-artist"
    ],
    u: "1f469-200d-1f3a8",
    v: [
      "1f469-1f3fb-200d-1f3a8",
      "1f469-1f3fc-200d-1f3a8",
      "1f469-1f3fd-200d-1f3a8",
      "1f469-1f3fe-200d-1f3a8",
      "1f469-1f3ff-200d-1f3a8"
    ],
    a: "4.0"
  },
  {
    n: [
      "pilot"
    ],
    u: "1f9d1-200d-2708-fe0f",
    v: [
      "1f9d1-1f3fb-200d-2708-fe0f",
      "1f9d1-1f3fc-200d-2708-fe0f",
      "1f9d1-1f3fd-200d-2708-fe0f",
      "1f9d1-1f3fe-200d-2708-fe0f",
      "1f9d1-1f3ff-200d-2708-fe0f"
    ],
    a: "12.1"
  },
  {
    n: [
      "man pilot",
      "male-pilot"
    ],
    u: "1f468-200d-2708-fe0f",
    v: [
      "1f468-1f3fb-200d-2708-fe0f",
      "1f468-1f3fc-200d-2708-fe0f",
      "1f468-1f3fd-200d-2708-fe0f",
      "1f468-1f3fe-200d-2708-fe0f",
      "1f468-1f3ff-200d-2708-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman pilot",
      "female-pilot"
    ],
    u: "1f469-200d-2708-fe0f",
    v: [
      "1f469-1f3fb-200d-2708-fe0f",
      "1f469-1f3fc-200d-2708-fe0f",
      "1f469-1f3fd-200d-2708-fe0f",
      "1f469-1f3fe-200d-2708-fe0f",
      "1f469-1f3ff-200d-2708-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "astronaut"
    ],
    u: "1f9d1-200d-1f680",
    v: [
      "1f9d1-1f3fb-200d-1f680",
      "1f9d1-1f3fc-200d-1f680",
      "1f9d1-1f3fd-200d-1f680",
      "1f9d1-1f3fe-200d-1f680",
      "1f9d1-1f3ff-200d-1f680"
    ],
    a: "12.1"
  },
  {
    n: [
      "man astronaut",
      "male-astronaut"
    ],
    u: "1f468-200d-1f680",
    v: [
      "1f468-1f3fb-200d-1f680",
      "1f468-1f3fc-200d-1f680",
      "1f468-1f3fd-200d-1f680",
      "1f468-1f3fe-200d-1f680",
      "1f468-1f3ff-200d-1f680"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman astronaut",
      "female-astronaut"
    ],
    u: "1f469-200d-1f680",
    v: [
      "1f469-1f3fb-200d-1f680",
      "1f469-1f3fc-200d-1f680",
      "1f469-1f3fd-200d-1f680",
      "1f469-1f3fe-200d-1f680",
      "1f469-1f3ff-200d-1f680"
    ],
    a: "4.0"
  },
  {
    n: [
      "firefighter"
    ],
    u: "1f9d1-200d-1f692",
    v: [
      "1f9d1-1f3fb-200d-1f692",
      "1f9d1-1f3fc-200d-1f692",
      "1f9d1-1f3fd-200d-1f692",
      "1f9d1-1f3fe-200d-1f692",
      "1f9d1-1f3ff-200d-1f692"
    ],
    a: "12.1"
  },
  {
    n: [
      "man firefighter",
      "male-firefighter"
    ],
    u: "1f468-200d-1f692",
    v: [
      "1f468-1f3fb-200d-1f692",
      "1f468-1f3fc-200d-1f692",
      "1f468-1f3fd-200d-1f692",
      "1f468-1f3fe-200d-1f692",
      "1f468-1f3ff-200d-1f692"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman firefighter",
      "female-firefighter"
    ],
    u: "1f469-200d-1f692",
    v: [
      "1f469-1f3fb-200d-1f692",
      "1f469-1f3fc-200d-1f692",
      "1f469-1f3fd-200d-1f692",
      "1f469-1f3fe-200d-1f692",
      "1f469-1f3ff-200d-1f692"
    ],
    a: "4.0"
  },
  {
    n: [
      "cop",
      "police officer"
    ],
    u: "1f46e",
    v: [
      "1f46e-1f3fb",
      "1f46e-1f3fc",
      "1f46e-1f3fd",
      "1f46e-1f3fe",
      "1f46e-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man police officer",
      "male-police-officer"
    ],
    u: "1f46e-200d-2642-fe0f",
    v: [
      "1f46e-1f3fb-200d-2642-fe0f",
      "1f46e-1f3fc-200d-2642-fe0f",
      "1f46e-1f3fd-200d-2642-fe0f",
      "1f46e-1f3fe-200d-2642-fe0f",
      "1f46e-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman police officer",
      "female-police-officer"
    ],
    u: "1f46e-200d-2640-fe0f",
    v: [
      "1f46e-1f3fb-200d-2640-fe0f",
      "1f46e-1f3fc-200d-2640-fe0f",
      "1f46e-1f3fd-200d-2640-fe0f",
      "1f46e-1f3fe-200d-2640-fe0f",
      "1f46e-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "detective",
      "sleuth or spy"
    ],
    u: "1f575-fe0f",
    v: [
      "1f575-1f3fb",
      "1f575-1f3fc",
      "1f575-1f3fd",
      "1f575-1f3fe",
      "1f575-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "man detective",
      "male-detective"
    ],
    u: "1f575-fe0f-200d-2642-fe0f",
    v: [
      "1f575-1f3fb-200d-2642-fe0f",
      "1f575-1f3fc-200d-2642-fe0f",
      "1f575-1f3fd-200d-2642-fe0f",
      "1f575-1f3fe-200d-2642-fe0f",
      "1f575-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman detective",
      "female-detective"
    ],
    u: "1f575-fe0f-200d-2640-fe0f",
    v: [
      "1f575-1f3fb-200d-2640-fe0f",
      "1f575-1f3fc-200d-2640-fe0f",
      "1f575-1f3fd-200d-2640-fe0f",
      "1f575-1f3fe-200d-2640-fe0f",
      "1f575-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "guardsman"
    ],
    u: "1f482",
    v: [
      "1f482-1f3fb",
      "1f482-1f3fc",
      "1f482-1f3fd",
      "1f482-1f3fe",
      "1f482-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man guard",
      "male-guard"
    ],
    u: "1f482-200d-2642-fe0f",
    v: [
      "1f482-1f3fb-200d-2642-fe0f",
      "1f482-1f3fc-200d-2642-fe0f",
      "1f482-1f3fd-200d-2642-fe0f",
      "1f482-1f3fe-200d-2642-fe0f",
      "1f482-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman guard",
      "female-guard"
    ],
    u: "1f482-200d-2640-fe0f",
    v: [
      "1f482-1f3fb-200d-2640-fe0f",
      "1f482-1f3fc-200d-2640-fe0f",
      "1f482-1f3fd-200d-2640-fe0f",
      "1f482-1f3fe-200d-2640-fe0f",
      "1f482-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "ninja"
    ],
    u: "1f977",
    v: [
      "1f977-1f3fb",
      "1f977-1f3fc",
      "1f977-1f3fd",
      "1f977-1f3fe",
      "1f977-1f3ff"
    ],
    a: "13.0"
  },
  {
    n: [
      "construction worker"
    ],
    u: "1f477",
    v: [
      "1f477-1f3fb",
      "1f477-1f3fc",
      "1f477-1f3fd",
      "1f477-1f3fe",
      "1f477-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man construction worker",
      "male-construction-worker"
    ],
    u: "1f477-200d-2642-fe0f",
    v: [
      "1f477-1f3fb-200d-2642-fe0f",
      "1f477-1f3fc-200d-2642-fe0f",
      "1f477-1f3fd-200d-2642-fe0f",
      "1f477-1f3fe-200d-2642-fe0f",
      "1f477-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman construction worker",
      "female-construction-worker"
    ],
    u: "1f477-200d-2640-fe0f",
    v: [
      "1f477-1f3fb-200d-2640-fe0f",
      "1f477-1f3fc-200d-2640-fe0f",
      "1f477-1f3fd-200d-2640-fe0f",
      "1f477-1f3fe-200d-2640-fe0f",
      "1f477-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person with crown"
    ],
    u: "1fac5",
    v: [
      "1fac5-1f3fb",
      "1fac5-1f3fc",
      "1fac5-1f3fd",
      "1fac5-1f3fe",
      "1fac5-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "prince"
    ],
    u: "1f934",
    v: [
      "1f934-1f3fb",
      "1f934-1f3fc",
      "1f934-1f3fd",
      "1f934-1f3fe",
      "1f934-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "princess"
    ],
    u: "1f478",
    v: [
      "1f478-1f3fb",
      "1f478-1f3fc",
      "1f478-1f3fd",
      "1f478-1f3fe",
      "1f478-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man with turban"
    ],
    u: "1f473",
    v: [
      "1f473-1f3fb",
      "1f473-1f3fc",
      "1f473-1f3fd",
      "1f473-1f3fe",
      "1f473-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man wearing turban",
      "man-wearing-turban"
    ],
    u: "1f473-200d-2642-fe0f",
    v: [
      "1f473-1f3fb-200d-2642-fe0f",
      "1f473-1f3fc-200d-2642-fe0f",
      "1f473-1f3fd-200d-2642-fe0f",
      "1f473-1f3fe-200d-2642-fe0f",
      "1f473-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman wearing turban",
      "woman-wearing-turban"
    ],
    u: "1f473-200d-2640-fe0f",
    v: [
      "1f473-1f3fb-200d-2640-fe0f",
      "1f473-1f3fc-200d-2640-fe0f",
      "1f473-1f3fd-200d-2640-fe0f",
      "1f473-1f3fe-200d-2640-fe0f",
      "1f473-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "man with gua pi mao"
    ],
    u: "1f472",
    v: [
      "1f472-1f3fb",
      "1f472-1f3fc",
      "1f472-1f3fd",
      "1f472-1f3fe",
      "1f472-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "person with headscarf"
    ],
    u: "1f9d5",
    v: [
      "1f9d5-1f3fb",
      "1f9d5-1f3fc",
      "1f9d5-1f3fd",
      "1f9d5-1f3fe",
      "1f9d5-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man in tuxedo",
      "person in tuxedo"
    ],
    u: "1f935",
    v: [
      "1f935-1f3fb",
      "1f935-1f3fc",
      "1f935-1f3fd",
      "1f935-1f3fe",
      "1f935-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man in tuxedo"
    ],
    u: "1f935-200d-2642-fe0f",
    v: [
      "1f935-1f3fb-200d-2642-fe0f",
      "1f935-1f3fc-200d-2642-fe0f",
      "1f935-1f3fd-200d-2642-fe0f",
      "1f935-1f3fe-200d-2642-fe0f",
      "1f935-1f3ff-200d-2642-fe0f"
    ],
    a: "13.0"
  },
  {
    n: [
      "woman in tuxedo"
    ],
    u: "1f935-200d-2640-fe0f",
    v: [
      "1f935-1f3fb-200d-2640-fe0f",
      "1f935-1f3fc-200d-2640-fe0f",
      "1f935-1f3fd-200d-2640-fe0f",
      "1f935-1f3fe-200d-2640-fe0f",
      "1f935-1f3ff-200d-2640-fe0f"
    ],
    a: "13.0"
  },
  {
    n: [
      "bride with veil"
    ],
    u: "1f470",
    v: [
      "1f470-1f3fb",
      "1f470-1f3fc",
      "1f470-1f3fd",
      "1f470-1f3fe",
      "1f470-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man with veil"
    ],
    u: "1f470-200d-2642-fe0f",
    v: [
      "1f470-1f3fb-200d-2642-fe0f",
      "1f470-1f3fc-200d-2642-fe0f",
      "1f470-1f3fd-200d-2642-fe0f",
      "1f470-1f3fe-200d-2642-fe0f",
      "1f470-1f3ff-200d-2642-fe0f"
    ],
    a: "13.0"
  },
  {
    n: [
      "woman with veil"
    ],
    u: "1f470-200d-2640-fe0f",
    v: [
      "1f470-1f3fb-200d-2640-fe0f",
      "1f470-1f3fc-200d-2640-fe0f",
      "1f470-1f3fd-200d-2640-fe0f",
      "1f470-1f3fe-200d-2640-fe0f",
      "1f470-1f3ff-200d-2640-fe0f"
    ],
    a: "13.0"
  },
  {
    n: [
      "pregnant woman"
    ],
    u: "1f930",
    v: [
      "1f930-1f3fb",
      "1f930-1f3fc",
      "1f930-1f3fd",
      "1f930-1f3fe",
      "1f930-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "pregnant man"
    ],
    u: "1fac3",
    v: [
      "1fac3-1f3fb",
      "1fac3-1f3fc",
      "1fac3-1f3fd",
      "1fac3-1f3fe",
      "1fac3-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "pregnant person"
    ],
    u: "1fac4",
    v: [
      "1fac4-1f3fb",
      "1fac4-1f3fc",
      "1fac4-1f3fd",
      "1fac4-1f3fe",
      "1fac4-1f3ff"
    ],
    a: "14.0"
  },
  {
    n: [
      "breast-feeding"
    ],
    u: "1f931",
    v: [
      "1f931-1f3fb",
      "1f931-1f3fc",
      "1f931-1f3fd",
      "1f931-1f3fe",
      "1f931-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman feeding baby"
    ],
    u: "1f469-200d-1f37c",
    v: [
      "1f469-1f3fb-200d-1f37c",
      "1f469-1f3fc-200d-1f37c",
      "1f469-1f3fd-200d-1f37c",
      "1f469-1f3fe-200d-1f37c",
      "1f469-1f3ff-200d-1f37c"
    ],
    a: "13.0"
  },
  {
    n: [
      "man feeding baby"
    ],
    u: "1f468-200d-1f37c",
    v: [
      "1f468-1f3fb-200d-1f37c",
      "1f468-1f3fc-200d-1f37c",
      "1f468-1f3fd-200d-1f37c",
      "1f468-1f3fe-200d-1f37c",
      "1f468-1f3ff-200d-1f37c"
    ],
    a: "13.0"
  },
  {
    n: [
      "person feeding baby"
    ],
    u: "1f9d1-200d-1f37c",
    v: [
      "1f9d1-1f3fb-200d-1f37c",
      "1f9d1-1f3fc-200d-1f37c",
      "1f9d1-1f3fd-200d-1f37c",
      "1f9d1-1f3fe-200d-1f37c",
      "1f9d1-1f3ff-200d-1f37c"
    ],
    a: "13.0"
  },
  {
    n: [
      "angel",
      "baby angel"
    ],
    u: "1f47c",
    v: [
      "1f47c-1f3fb",
      "1f47c-1f3fc",
      "1f47c-1f3fd",
      "1f47c-1f3fe",
      "1f47c-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "santa",
      "father christmas"
    ],
    u: "1f385",
    v: [
      "1f385-1f3fb",
      "1f385-1f3fc",
      "1f385-1f3fd",
      "1f385-1f3fe",
      "1f385-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "mrs claus",
      "mother christmas"
    ],
    u: "1f936",
    v: [
      "1f936-1f3fb",
      "1f936-1f3fc",
      "1f936-1f3fd",
      "1f936-1f3fe",
      "1f936-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "mx claus"
    ],
    u: "1f9d1-200d-1f384",
    v: [
      "1f9d1-1f3fb-200d-1f384",
      "1f9d1-1f3fc-200d-1f384",
      "1f9d1-1f3fd-200d-1f384",
      "1f9d1-1f3fe-200d-1f384",
      "1f9d1-1f3ff-200d-1f384"
    ],
    a: "13.0"
  },
  {
    n: [
      "superhero"
    ],
    u: "1f9b8",
    v: [
      "1f9b8-1f3fb",
      "1f9b8-1f3fc",
      "1f9b8-1f3fd",
      "1f9b8-1f3fe",
      "1f9b8-1f3ff"
    ],
    a: "11.0"
  },
  {
    n: [
      "man superhero",
      "male superhero"
    ],
    u: "1f9b8-200d-2642-fe0f",
    v: [
      "1f9b8-1f3fb-200d-2642-fe0f",
      "1f9b8-1f3fc-200d-2642-fe0f",
      "1f9b8-1f3fd-200d-2642-fe0f",
      "1f9b8-1f3fe-200d-2642-fe0f",
      "1f9b8-1f3ff-200d-2642-fe0f"
    ],
    a: "11.0"
  },
  {
    n: [
      "woman superhero",
      "female superhero"
    ],
    u: "1f9b8-200d-2640-fe0f",
    v: [
      "1f9b8-1f3fb-200d-2640-fe0f",
      "1f9b8-1f3fc-200d-2640-fe0f",
      "1f9b8-1f3fd-200d-2640-fe0f",
      "1f9b8-1f3fe-200d-2640-fe0f",
      "1f9b8-1f3ff-200d-2640-fe0f"
    ],
    a: "11.0"
  },
  {
    n: [
      "supervillain"
    ],
    u: "1f9b9",
    v: [
      "1f9b9-1f3fb",
      "1f9b9-1f3fc",
      "1f9b9-1f3fd",
      "1f9b9-1f3fe",
      "1f9b9-1f3ff"
    ],
    a: "11.0"
  },
  {
    n: [
      "man supervillain",
      "male supervillain"
    ],
    u: "1f9b9-200d-2642-fe0f",
    v: [
      "1f9b9-1f3fb-200d-2642-fe0f",
      "1f9b9-1f3fc-200d-2642-fe0f",
      "1f9b9-1f3fd-200d-2642-fe0f",
      "1f9b9-1f3fe-200d-2642-fe0f",
      "1f9b9-1f3ff-200d-2642-fe0f"
    ],
    a: "11.0"
  },
  {
    n: [
      "woman supervillain",
      "female supervillain"
    ],
    u: "1f9b9-200d-2640-fe0f",
    v: [
      "1f9b9-1f3fb-200d-2640-fe0f",
      "1f9b9-1f3fc-200d-2640-fe0f",
      "1f9b9-1f3fd-200d-2640-fe0f",
      "1f9b9-1f3fe-200d-2640-fe0f",
      "1f9b9-1f3ff-200d-2640-fe0f"
    ],
    a: "11.0"
  },
  {
    n: [
      "mage"
    ],
    u: "1f9d9",
    v: [
      "1f9d9-1f3fb",
      "1f9d9-1f3fc",
      "1f9d9-1f3fd",
      "1f9d9-1f3fe",
      "1f9d9-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man mage",
      "male mage"
    ],
    u: "1f9d9-200d-2642-fe0f",
    v: [
      "1f9d9-1f3fb-200d-2642-fe0f",
      "1f9d9-1f3fc-200d-2642-fe0f",
      "1f9d9-1f3fd-200d-2642-fe0f",
      "1f9d9-1f3fe-200d-2642-fe0f",
      "1f9d9-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman mage",
      "female mage"
    ],
    u: "1f9d9-200d-2640-fe0f",
    v: [
      "1f9d9-1f3fb-200d-2640-fe0f",
      "1f9d9-1f3fc-200d-2640-fe0f",
      "1f9d9-1f3fd-200d-2640-fe0f",
      "1f9d9-1f3fe-200d-2640-fe0f",
      "1f9d9-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "fairy"
    ],
    u: "1f9da",
    v: [
      "1f9da-1f3fb",
      "1f9da-1f3fc",
      "1f9da-1f3fd",
      "1f9da-1f3fe",
      "1f9da-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man fairy",
      "male fairy"
    ],
    u: "1f9da-200d-2642-fe0f",
    v: [
      "1f9da-1f3fb-200d-2642-fe0f",
      "1f9da-1f3fc-200d-2642-fe0f",
      "1f9da-1f3fd-200d-2642-fe0f",
      "1f9da-1f3fe-200d-2642-fe0f",
      "1f9da-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman fairy",
      "female fairy"
    ],
    u: "1f9da-200d-2640-fe0f",
    v: [
      "1f9da-1f3fb-200d-2640-fe0f",
      "1f9da-1f3fc-200d-2640-fe0f",
      "1f9da-1f3fd-200d-2640-fe0f",
      "1f9da-1f3fe-200d-2640-fe0f",
      "1f9da-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "vampire"
    ],
    u: "1f9db",
    v: [
      "1f9db-1f3fb",
      "1f9db-1f3fc",
      "1f9db-1f3fd",
      "1f9db-1f3fe",
      "1f9db-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man vampire",
      "male vampire"
    ],
    u: "1f9db-200d-2642-fe0f",
    v: [
      "1f9db-1f3fb-200d-2642-fe0f",
      "1f9db-1f3fc-200d-2642-fe0f",
      "1f9db-1f3fd-200d-2642-fe0f",
      "1f9db-1f3fe-200d-2642-fe0f",
      "1f9db-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman vampire",
      "female vampire"
    ],
    u: "1f9db-200d-2640-fe0f",
    v: [
      "1f9db-1f3fb-200d-2640-fe0f",
      "1f9db-1f3fc-200d-2640-fe0f",
      "1f9db-1f3fd-200d-2640-fe0f",
      "1f9db-1f3fe-200d-2640-fe0f",
      "1f9db-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "merperson"
    ],
    u: "1f9dc",
    v: [
      "1f9dc-1f3fb",
      "1f9dc-1f3fc",
      "1f9dc-1f3fd",
      "1f9dc-1f3fe",
      "1f9dc-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "merman"
    ],
    u: "1f9dc-200d-2642-fe0f",
    v: [
      "1f9dc-1f3fb-200d-2642-fe0f",
      "1f9dc-1f3fc-200d-2642-fe0f",
      "1f9dc-1f3fd-200d-2642-fe0f",
      "1f9dc-1f3fe-200d-2642-fe0f",
      "1f9dc-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "mermaid"
    ],
    u: "1f9dc-200d-2640-fe0f",
    v: [
      "1f9dc-1f3fb-200d-2640-fe0f",
      "1f9dc-1f3fc-200d-2640-fe0f",
      "1f9dc-1f3fd-200d-2640-fe0f",
      "1f9dc-1f3fe-200d-2640-fe0f",
      "1f9dc-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "elf"
    ],
    u: "1f9dd",
    v: [
      "1f9dd-1f3fb",
      "1f9dd-1f3fc",
      "1f9dd-1f3fd",
      "1f9dd-1f3fe",
      "1f9dd-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man elf",
      "male elf"
    ],
    u: "1f9dd-200d-2642-fe0f",
    v: [
      "1f9dd-1f3fb-200d-2642-fe0f",
      "1f9dd-1f3fc-200d-2642-fe0f",
      "1f9dd-1f3fd-200d-2642-fe0f",
      "1f9dd-1f3fe-200d-2642-fe0f",
      "1f9dd-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman elf",
      "female elf"
    ],
    u: "1f9dd-200d-2640-fe0f",
    v: [
      "1f9dd-1f3fb-200d-2640-fe0f",
      "1f9dd-1f3fc-200d-2640-fe0f",
      "1f9dd-1f3fd-200d-2640-fe0f",
      "1f9dd-1f3fe-200d-2640-fe0f",
      "1f9dd-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "genie"
    ],
    u: "1f9de",
    a: "5.0"
  },
  {
    n: [
      "man genie",
      "male genie"
    ],
    u: "1f9de-200d-2642-fe0f",
    a: "5.0"
  },
  {
    n: [
      "woman genie",
      "female genie"
    ],
    u: "1f9de-200d-2640-fe0f",
    a: "5.0"
  },
  {
    n: [
      "zombie"
    ],
    u: "1f9df",
    a: "5.0"
  },
  {
    n: [
      "man zombie",
      "male zombie"
    ],
    u: "1f9df-200d-2642-fe0f",
    a: "5.0"
  },
  {
    n: [
      "woman zombie",
      "female zombie"
    ],
    u: "1f9df-200d-2640-fe0f",
    a: "5.0"
  },
  {
    n: [
      "troll"
    ],
    u: "1f9cc",
    a: "14.0"
  },
  {
    n: [
      "massage",
      "face massage"
    ],
    u: "1f486",
    v: [
      "1f486-1f3fb",
      "1f486-1f3fc",
      "1f486-1f3fd",
      "1f486-1f3fe",
      "1f486-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man getting massage",
      "man-getting-massage"
    ],
    u: "1f486-200d-2642-fe0f",
    v: [
      "1f486-1f3fb-200d-2642-fe0f",
      "1f486-1f3fc-200d-2642-fe0f",
      "1f486-1f3fd-200d-2642-fe0f",
      "1f486-1f3fe-200d-2642-fe0f",
      "1f486-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman getting massage",
      "woman-getting-massage"
    ],
    u: "1f486-200d-2640-fe0f",
    v: [
      "1f486-1f3fb-200d-2640-fe0f",
      "1f486-1f3fc-200d-2640-fe0f",
      "1f486-1f3fd-200d-2640-fe0f",
      "1f486-1f3fe-200d-2640-fe0f",
      "1f486-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "haircut"
    ],
    u: "1f487",
    v: [
      "1f487-1f3fb",
      "1f487-1f3fc",
      "1f487-1f3fd",
      "1f487-1f3fe",
      "1f487-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man getting haircut",
      "man-getting-haircut"
    ],
    u: "1f487-200d-2642-fe0f",
    v: [
      "1f487-1f3fb-200d-2642-fe0f",
      "1f487-1f3fc-200d-2642-fe0f",
      "1f487-1f3fd-200d-2642-fe0f",
      "1f487-1f3fe-200d-2642-fe0f",
      "1f487-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman getting haircut",
      "woman-getting-haircut"
    ],
    u: "1f487-200d-2640-fe0f",
    v: [
      "1f487-1f3fb-200d-2640-fe0f",
      "1f487-1f3fc-200d-2640-fe0f",
      "1f487-1f3fd-200d-2640-fe0f",
      "1f487-1f3fe-200d-2640-fe0f",
      "1f487-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "walking",
      "pedestrian"
    ],
    u: "1f6b6",
    v: [
      "1f6b6-1f3fb",
      "1f6b6-1f3fc",
      "1f6b6-1f3fd",
      "1f6b6-1f3fe",
      "1f6b6-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man walking",
      "man-walking"
    ],
    u: "1f6b6-200d-2642-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2642-fe0f",
      "1f6b6-1f3fc-200d-2642-fe0f",
      "1f6b6-1f3fd-200d-2642-fe0f",
      "1f6b6-1f3fe-200d-2642-fe0f",
      "1f6b6-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman walking",
      "woman-walking"
    ],
    u: "1f6b6-200d-2640-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2640-fe0f",
      "1f6b6-1f3fc-200d-2640-fe0f",
      "1f6b6-1f3fd-200d-2640-fe0f",
      "1f6b6-1f3fe-200d-2640-fe0f",
      "1f6b6-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person walking facing right"
    ],
    u: "1f6b6-200d-27a1-fe0f",
    v: [
      "1f6b6-1f3fb-200d-27a1-fe0f",
      "1f6b6-1f3fc-200d-27a1-fe0f",
      "1f6b6-1f3fd-200d-27a1-fe0f",
      "1f6b6-1f3fe-200d-27a1-fe0f",
      "1f6b6-1f3ff-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman walking facing right"
    ],
    u: "1f6b6-200d-2640-fe0f-200d-27a1-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2640-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fc-200d-2640-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fd-200d-2640-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fe-200d-2640-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3ff-200d-2640-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man walking facing right"
    ],
    u: "1f6b6-200d-2642-fe0f-200d-27a1-fe0f",
    v: [
      "1f6b6-1f3fb-200d-2642-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fc-200d-2642-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fd-200d-2642-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3fe-200d-2642-fe0f-200d-27a1-fe0f",
      "1f6b6-1f3ff-200d-2642-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "standing person"
    ],
    u: "1f9cd",
    v: [
      "1f9cd-1f3fb",
      "1f9cd-1f3fc",
      "1f9cd-1f3fd",
      "1f9cd-1f3fe",
      "1f9cd-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "man standing"
    ],
    u: "1f9cd-200d-2642-fe0f",
    v: [
      "1f9cd-1f3fb-200d-2642-fe0f",
      "1f9cd-1f3fc-200d-2642-fe0f",
      "1f9cd-1f3fd-200d-2642-fe0f",
      "1f9cd-1f3fe-200d-2642-fe0f",
      "1f9cd-1f3ff-200d-2642-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "woman standing"
    ],
    u: "1f9cd-200d-2640-fe0f",
    v: [
      "1f9cd-1f3fb-200d-2640-fe0f",
      "1f9cd-1f3fc-200d-2640-fe0f",
      "1f9cd-1f3fd-200d-2640-fe0f",
      "1f9cd-1f3fe-200d-2640-fe0f",
      "1f9cd-1f3ff-200d-2640-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "kneeling person"
    ],
    u: "1f9ce",
    v: [
      "1f9ce-1f3fb",
      "1f9ce-1f3fc",
      "1f9ce-1f3fd",
      "1f9ce-1f3fe",
      "1f9ce-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "man kneeling"
    ],
    u: "1f9ce-200d-2642-fe0f",
    v: [
      "1f9ce-1f3fb-200d-2642-fe0f",
      "1f9ce-1f3fc-200d-2642-fe0f",
      "1f9ce-1f3fd-200d-2642-fe0f",
      "1f9ce-1f3fe-200d-2642-fe0f",
      "1f9ce-1f3ff-200d-2642-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "woman kneeling"
    ],
    u: "1f9ce-200d-2640-fe0f",
    v: [
      "1f9ce-1f3fb-200d-2640-fe0f",
      "1f9ce-1f3fc-200d-2640-fe0f",
      "1f9ce-1f3fd-200d-2640-fe0f",
      "1f9ce-1f3fe-200d-2640-fe0f",
      "1f9ce-1f3ff-200d-2640-fe0f"
    ],
    a: "12.0"
  },
  {
    n: [
      "person kneeling facing right"
    ],
    u: "1f9ce-200d-27a1-fe0f",
    v: [
      "1f9ce-1f3fb-200d-27a1-fe0f",
      "1f9ce-1f3fc-200d-27a1-fe0f",
      "1f9ce-1f3fd-200d-27a1-fe0f",
      "1f9ce-1f3fe-200d-27a1-fe0f",
      "1f9ce-1f3ff-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman kneeling facing right"
    ],
    u: "1f9ce-200d-2640-fe0f-200d-27a1-fe0f",
    v: [
      "1f9ce-1f3fb-200d-2640-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fc-200d-2640-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fd-200d-2640-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fe-200d-2640-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3ff-200d-2640-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man kneeling facing right"
    ],
    u: "1f9ce-200d-2642-fe0f-200d-27a1-fe0f",
    v: [
      "1f9ce-1f3fb-200d-2642-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fc-200d-2642-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fd-200d-2642-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3fe-200d-2642-fe0f-200d-27a1-fe0f",
      "1f9ce-1f3ff-200d-2642-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "person with white cane",
      "person with probing cane"
    ],
    u: "1f9d1-200d-1f9af",
    v: [
      "1f9d1-1f3fb-200d-1f9af",
      "1f9d1-1f3fc-200d-1f9af",
      "1f9d1-1f3fd-200d-1f9af",
      "1f9d1-1f3fe-200d-1f9af",
      "1f9d1-1f3ff-200d-1f9af"
    ],
    a: "12.1"
  },
  {
    n: [
      "person with white cane facing right"
    ],
    u: "1f9d1-200d-1f9af-200d-27a1-fe0f",
    v: [
      "1f9d1-1f3fb-200d-1f9af-200d-27a1-fe0f",
      "1f9d1-1f3fc-200d-1f9af-200d-27a1-fe0f",
      "1f9d1-1f3fd-200d-1f9af-200d-27a1-fe0f",
      "1f9d1-1f3fe-200d-1f9af-200d-27a1-fe0f",
      "1f9d1-1f3ff-200d-1f9af-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man with white cane",
      "man with probing cane"
    ],
    u: "1f468-200d-1f9af",
    v: [
      "1f468-1f3fb-200d-1f9af",
      "1f468-1f3fc-200d-1f9af",
      "1f468-1f3fd-200d-1f9af",
      "1f468-1f3fe-200d-1f9af",
      "1f468-1f3ff-200d-1f9af"
    ],
    a: "12.0"
  },
  {
    n: [
      "man with white cane facing right"
    ],
    u: "1f468-200d-1f9af-200d-27a1-fe0f",
    v: [
      "1f468-1f3fb-200d-1f9af-200d-27a1-fe0f",
      "1f468-1f3fc-200d-1f9af-200d-27a1-fe0f",
      "1f468-1f3fd-200d-1f9af-200d-27a1-fe0f",
      "1f468-1f3fe-200d-1f9af-200d-27a1-fe0f",
      "1f468-1f3ff-200d-1f9af-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman with white cane",
      "woman with probing cane"
    ],
    u: "1f469-200d-1f9af",
    v: [
      "1f469-1f3fb-200d-1f9af",
      "1f469-1f3fc-200d-1f9af",
      "1f469-1f3fd-200d-1f9af",
      "1f469-1f3fe-200d-1f9af",
      "1f469-1f3ff-200d-1f9af"
    ],
    a: "12.0"
  },
  {
    n: [
      "woman with white cane facing right"
    ],
    u: "1f469-200d-1f9af-200d-27a1-fe0f",
    v: [
      "1f469-1f3fb-200d-1f9af-200d-27a1-fe0f",
      "1f469-1f3fc-200d-1f9af-200d-27a1-fe0f",
      "1f469-1f3fd-200d-1f9af-200d-27a1-fe0f",
      "1f469-1f3fe-200d-1f9af-200d-27a1-fe0f",
      "1f469-1f3ff-200d-1f9af-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "person in motorized wheelchair"
    ],
    u: "1f9d1-200d-1f9bc",
    v: [
      "1f9d1-1f3fb-200d-1f9bc",
      "1f9d1-1f3fc-200d-1f9bc",
      "1f9d1-1f3fd-200d-1f9bc",
      "1f9d1-1f3fe-200d-1f9bc",
      "1f9d1-1f3ff-200d-1f9bc"
    ],
    a: "12.1"
  },
  {
    n: [
      "person in motorized wheelchair facing right"
    ],
    u: "1f9d1-200d-1f9bc-200d-27a1-fe0f",
    v: [
      "1f9d1-1f3fb-200d-1f9bc-200d-27a1-fe0f",
      "1f9d1-1f3fc-200d-1f9bc-200d-27a1-fe0f",
      "1f9d1-1f3fd-200d-1f9bc-200d-27a1-fe0f",
      "1f9d1-1f3fe-200d-1f9bc-200d-27a1-fe0f",
      "1f9d1-1f3ff-200d-1f9bc-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man in motorized wheelchair"
    ],
    u: "1f468-200d-1f9bc",
    v: [
      "1f468-1f3fb-200d-1f9bc",
      "1f468-1f3fc-200d-1f9bc",
      "1f468-1f3fd-200d-1f9bc",
      "1f468-1f3fe-200d-1f9bc",
      "1f468-1f3ff-200d-1f9bc"
    ],
    a: "12.0"
  },
  {
    n: [
      "man in motorized wheelchair facing right"
    ],
    u: "1f468-200d-1f9bc-200d-27a1-fe0f",
    v: [
      "1f468-1f3fb-200d-1f9bc-200d-27a1-fe0f",
      "1f468-1f3fc-200d-1f9bc-200d-27a1-fe0f",
      "1f468-1f3fd-200d-1f9bc-200d-27a1-fe0f",
      "1f468-1f3fe-200d-1f9bc-200d-27a1-fe0f",
      "1f468-1f3ff-200d-1f9bc-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman in motorized wheelchair"
    ],
    u: "1f469-200d-1f9bc",
    v: [
      "1f469-1f3fb-200d-1f9bc",
      "1f469-1f3fc-200d-1f9bc",
      "1f469-1f3fd-200d-1f9bc",
      "1f469-1f3fe-200d-1f9bc",
      "1f469-1f3ff-200d-1f9bc"
    ],
    a: "12.0"
  },
  {
    n: [
      "woman in motorized wheelchair facing right"
    ],
    u: "1f469-200d-1f9bc-200d-27a1-fe0f",
    v: [
      "1f469-1f3fb-200d-1f9bc-200d-27a1-fe0f",
      "1f469-1f3fc-200d-1f9bc-200d-27a1-fe0f",
      "1f469-1f3fd-200d-1f9bc-200d-27a1-fe0f",
      "1f469-1f3fe-200d-1f9bc-200d-27a1-fe0f",
      "1f469-1f3ff-200d-1f9bc-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "person in manual wheelchair"
    ],
    u: "1f9d1-200d-1f9bd",
    v: [
      "1f9d1-1f3fb-200d-1f9bd",
      "1f9d1-1f3fc-200d-1f9bd",
      "1f9d1-1f3fd-200d-1f9bd",
      "1f9d1-1f3fe-200d-1f9bd",
      "1f9d1-1f3ff-200d-1f9bd"
    ],
    a: "12.1"
  },
  {
    n: [
      "person in manual wheelchair facing right"
    ],
    u: "1f9d1-200d-1f9bd-200d-27a1-fe0f",
    v: [
      "1f9d1-1f3fb-200d-1f9bd-200d-27a1-fe0f",
      "1f9d1-1f3fc-200d-1f9bd-200d-27a1-fe0f",
      "1f9d1-1f3fd-200d-1f9bd-200d-27a1-fe0f",
      "1f9d1-1f3fe-200d-1f9bd-200d-27a1-fe0f",
      "1f9d1-1f3ff-200d-1f9bd-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man in manual wheelchair"
    ],
    u: "1f468-200d-1f9bd",
    v: [
      "1f468-1f3fb-200d-1f9bd",
      "1f468-1f3fc-200d-1f9bd",
      "1f468-1f3fd-200d-1f9bd",
      "1f468-1f3fe-200d-1f9bd",
      "1f468-1f3ff-200d-1f9bd"
    ],
    a: "12.0"
  },
  {
    n: [
      "man in manual wheelchair facing right"
    ],
    u: "1f468-200d-1f9bd-200d-27a1-fe0f",
    v: [
      "1f468-1f3fb-200d-1f9bd-200d-27a1-fe0f",
      "1f468-1f3fc-200d-1f9bd-200d-27a1-fe0f",
      "1f468-1f3fd-200d-1f9bd-200d-27a1-fe0f",
      "1f468-1f3fe-200d-1f9bd-200d-27a1-fe0f",
      "1f468-1f3ff-200d-1f9bd-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman in manual wheelchair"
    ],
    u: "1f469-200d-1f9bd",
    v: [
      "1f469-1f3fb-200d-1f9bd",
      "1f469-1f3fc-200d-1f9bd",
      "1f469-1f3fd-200d-1f9bd",
      "1f469-1f3fe-200d-1f9bd",
      "1f469-1f3ff-200d-1f9bd"
    ],
    a: "12.0"
  },
  {
    n: [
      "woman in manual wheelchair facing right"
    ],
    u: "1f469-200d-1f9bd-200d-27a1-fe0f",
    v: [
      "1f469-1f3fb-200d-1f9bd-200d-27a1-fe0f",
      "1f469-1f3fc-200d-1f9bd-200d-27a1-fe0f",
      "1f469-1f3fd-200d-1f9bd-200d-27a1-fe0f",
      "1f469-1f3fe-200d-1f9bd-200d-27a1-fe0f",
      "1f469-1f3ff-200d-1f9bd-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "runner",
      "running"
    ],
    u: "1f3c3",
    v: [
      "1f3c3-1f3fb",
      "1f3c3-1f3fc",
      "1f3c3-1f3fd",
      "1f3c3-1f3fe",
      "1f3c3-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man running",
      "man-running"
    ],
    u: "1f3c3-200d-2642-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2642-fe0f",
      "1f3c3-1f3fc-200d-2642-fe0f",
      "1f3c3-1f3fd-200d-2642-fe0f",
      "1f3c3-1f3fe-200d-2642-fe0f",
      "1f3c3-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman running",
      "woman-running"
    ],
    u: "1f3c3-200d-2640-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2640-fe0f",
      "1f3c3-1f3fc-200d-2640-fe0f",
      "1f3c3-1f3fd-200d-2640-fe0f",
      "1f3c3-1f3fe-200d-2640-fe0f",
      "1f3c3-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person running facing right"
    ],
    u: "1f3c3-200d-27a1-fe0f",
    v: [
      "1f3c3-1f3fb-200d-27a1-fe0f",
      "1f3c3-1f3fc-200d-27a1-fe0f",
      "1f3c3-1f3fd-200d-27a1-fe0f",
      "1f3c3-1f3fe-200d-27a1-fe0f",
      "1f3c3-1f3ff-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "woman running facing right"
    ],
    u: "1f3c3-200d-2640-fe0f-200d-27a1-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2640-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fc-200d-2640-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fd-200d-2640-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fe-200d-2640-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3ff-200d-2640-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "man running facing right"
    ],
    u: "1f3c3-200d-2642-fe0f-200d-27a1-fe0f",
    v: [
      "1f3c3-1f3fb-200d-2642-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fc-200d-2642-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fd-200d-2642-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3fe-200d-2642-fe0f-200d-27a1-fe0f",
      "1f3c3-1f3ff-200d-2642-fe0f-200d-27a1-fe0f"
    ],
    a: "15.1"
  },
  {
    n: [
      "dancer"
    ],
    u: "1f483",
    v: [
      "1f483-1f3fb",
      "1f483-1f3fc",
      "1f483-1f3fd",
      "1f483-1f3fe",
      "1f483-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man dancing"
    ],
    u: "1f57a",
    v: [
      "1f57a-1f3fb",
      "1f57a-1f3fc",
      "1f57a-1f3fd",
      "1f57a-1f3fe",
      "1f57a-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "person in suit levitating",
      "man in business suit levitating"
    ],
    u: "1f574-fe0f",
    v: [
      "1f574-1f3fb",
      "1f574-1f3fc",
      "1f574-1f3fd",
      "1f574-1f3fe",
      "1f574-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "dancers",
      "woman with bunny ears"
    ],
    u: "1f46f",
    a: "0.6"
  },
  {
    n: [
      "men with bunny ears",
      "men-with-bunny-ears-partying",
      "man-with-bunny-ears-partying"
    ],
    u: "1f46f-200d-2642-fe0f",
    a: "4.0"
  },
  {
    n: [
      "women with bunny ears",
      "women-with-bunny-ears-partying",
      "woman-with-bunny-ears-partying"
    ],
    u: "1f46f-200d-2640-fe0f",
    a: "4.0"
  },
  {
    n: [
      "person in steamy room"
    ],
    u: "1f9d6",
    v: [
      "1f9d6-1f3fb",
      "1f9d6-1f3fc",
      "1f9d6-1f3fd",
      "1f9d6-1f3fe",
      "1f9d6-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man in steamy room"
    ],
    u: "1f9d6-200d-2642-fe0f",
    v: [
      "1f9d6-1f3fb-200d-2642-fe0f",
      "1f9d6-1f3fc-200d-2642-fe0f",
      "1f9d6-1f3fd-200d-2642-fe0f",
      "1f9d6-1f3fe-200d-2642-fe0f",
      "1f9d6-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman in steamy room"
    ],
    u: "1f9d6-200d-2640-fe0f",
    v: [
      "1f9d6-1f3fb-200d-2640-fe0f",
      "1f9d6-1f3fc-200d-2640-fe0f",
      "1f9d6-1f3fd-200d-2640-fe0f",
      "1f9d6-1f3fe-200d-2640-fe0f",
      "1f9d6-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "person climbing"
    ],
    u: "1f9d7",
    v: [
      "1f9d7-1f3fb",
      "1f9d7-1f3fc",
      "1f9d7-1f3fd",
      "1f9d7-1f3fe",
      "1f9d7-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man climbing"
    ],
    u: "1f9d7-200d-2642-fe0f",
    v: [
      "1f9d7-1f3fb-200d-2642-fe0f",
      "1f9d7-1f3fc-200d-2642-fe0f",
      "1f9d7-1f3fd-200d-2642-fe0f",
      "1f9d7-1f3fe-200d-2642-fe0f",
      "1f9d7-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman climbing"
    ],
    u: "1f9d7-200d-2640-fe0f",
    v: [
      "1f9d7-1f3fb-200d-2640-fe0f",
      "1f9d7-1f3fc-200d-2640-fe0f",
      "1f9d7-1f3fd-200d-2640-fe0f",
      "1f9d7-1f3fe-200d-2640-fe0f",
      "1f9d7-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "fencer"
    ],
    u: "1f93a",
    a: "3.0"
  },
  {
    n: [
      "horse racing"
    ],
    u: "1f3c7",
    v: [
      "1f3c7-1f3fb",
      "1f3c7-1f3fc",
      "1f3c7-1f3fd",
      "1f3c7-1f3fe",
      "1f3c7-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "skier"
    ],
    u: "26f7-fe0f",
    a: "0.7"
  },
  {
    n: [
      "snowboarder"
    ],
    u: "1f3c2",
    v: [
      "1f3c2-1f3fb",
      "1f3c2-1f3fc",
      "1f3c2-1f3fd",
      "1f3c2-1f3fe",
      "1f3c2-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "golfer",
      "person golfing"
    ],
    u: "1f3cc-fe0f",
    v: [
      "1f3cc-1f3fb",
      "1f3cc-1f3fc",
      "1f3cc-1f3fd",
      "1f3cc-1f3fe",
      "1f3cc-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "man golfing",
      "man-golfing"
    ],
    u: "1f3cc-fe0f-200d-2642-fe0f",
    v: [
      "1f3cc-1f3fb-200d-2642-fe0f",
      "1f3cc-1f3fc-200d-2642-fe0f",
      "1f3cc-1f3fd-200d-2642-fe0f",
      "1f3cc-1f3fe-200d-2642-fe0f",
      "1f3cc-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman golfing",
      "woman-golfing"
    ],
    u: "1f3cc-fe0f-200d-2640-fe0f",
    v: [
      "1f3cc-1f3fb-200d-2640-fe0f",
      "1f3cc-1f3fc-200d-2640-fe0f",
      "1f3cc-1f3fd-200d-2640-fe0f",
      "1f3cc-1f3fe-200d-2640-fe0f",
      "1f3cc-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "surfer"
    ],
    u: "1f3c4",
    v: [
      "1f3c4-1f3fb",
      "1f3c4-1f3fc",
      "1f3c4-1f3fd",
      "1f3c4-1f3fe",
      "1f3c4-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man surfing",
      "man-surfing"
    ],
    u: "1f3c4-200d-2642-fe0f",
    v: [
      "1f3c4-1f3fb-200d-2642-fe0f",
      "1f3c4-1f3fc-200d-2642-fe0f",
      "1f3c4-1f3fd-200d-2642-fe0f",
      "1f3c4-1f3fe-200d-2642-fe0f",
      "1f3c4-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman surfing",
      "woman-surfing"
    ],
    u: "1f3c4-200d-2640-fe0f",
    v: [
      "1f3c4-1f3fb-200d-2640-fe0f",
      "1f3c4-1f3fc-200d-2640-fe0f",
      "1f3c4-1f3fd-200d-2640-fe0f",
      "1f3c4-1f3fe-200d-2640-fe0f",
      "1f3c4-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "rowboat"
    ],
    u: "1f6a3",
    v: [
      "1f6a3-1f3fb",
      "1f6a3-1f3fc",
      "1f6a3-1f3fd",
      "1f6a3-1f3fe",
      "1f6a3-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "man rowing boat",
      "man-rowing-boat"
    ],
    u: "1f6a3-200d-2642-fe0f",
    v: [
      "1f6a3-1f3fb-200d-2642-fe0f",
      "1f6a3-1f3fc-200d-2642-fe0f",
      "1f6a3-1f3fd-200d-2642-fe0f",
      "1f6a3-1f3fe-200d-2642-fe0f",
      "1f6a3-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman rowing boat",
      "woman-rowing-boat"
    ],
    u: "1f6a3-200d-2640-fe0f",
    v: [
      "1f6a3-1f3fb-200d-2640-fe0f",
      "1f6a3-1f3fc-200d-2640-fe0f",
      "1f6a3-1f3fd-200d-2640-fe0f",
      "1f6a3-1f3fe-200d-2640-fe0f",
      "1f6a3-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "swimmer"
    ],
    u: "1f3ca",
    v: [
      "1f3ca-1f3fb",
      "1f3ca-1f3fc",
      "1f3ca-1f3fd",
      "1f3ca-1f3fe",
      "1f3ca-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "man swimming",
      "man-swimming"
    ],
    u: "1f3ca-200d-2642-fe0f",
    v: [
      "1f3ca-1f3fb-200d-2642-fe0f",
      "1f3ca-1f3fc-200d-2642-fe0f",
      "1f3ca-1f3fd-200d-2642-fe0f",
      "1f3ca-1f3fe-200d-2642-fe0f",
      "1f3ca-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman swimming",
      "woman-swimming"
    ],
    u: "1f3ca-200d-2640-fe0f",
    v: [
      "1f3ca-1f3fb-200d-2640-fe0f",
      "1f3ca-1f3fc-200d-2640-fe0f",
      "1f3ca-1f3fd-200d-2640-fe0f",
      "1f3ca-1f3fe-200d-2640-fe0f",
      "1f3ca-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person with ball",
      "person bouncing ball"
    ],
    u: "26f9-fe0f",
    v: [
      "26f9-1f3fb",
      "26f9-1f3fc",
      "26f9-1f3fd",
      "26f9-1f3fe",
      "26f9-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "man bouncing ball",
      "man-bouncing-ball"
    ],
    u: "26f9-fe0f-200d-2642-fe0f",
    v: [
      "26f9-1f3fb-200d-2642-fe0f",
      "26f9-1f3fc-200d-2642-fe0f",
      "26f9-1f3fd-200d-2642-fe0f",
      "26f9-1f3fe-200d-2642-fe0f",
      "26f9-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman bouncing ball",
      "woman-bouncing-ball"
    ],
    u: "26f9-fe0f-200d-2640-fe0f",
    v: [
      "26f9-1f3fb-200d-2640-fe0f",
      "26f9-1f3fc-200d-2640-fe0f",
      "26f9-1f3fd-200d-2640-fe0f",
      "26f9-1f3fe-200d-2640-fe0f",
      "26f9-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "weight lifter",
      "person lifting weights"
    ],
    u: "1f3cb-fe0f",
    v: [
      "1f3cb-1f3fb",
      "1f3cb-1f3fc",
      "1f3cb-1f3fd",
      "1f3cb-1f3fe",
      "1f3cb-1f3ff"
    ],
    a: "0.7"
  },
  {
    n: [
      "man lifting weights",
      "man-lifting-weights"
    ],
    u: "1f3cb-fe0f-200d-2642-fe0f",
    v: [
      "1f3cb-1f3fb-200d-2642-fe0f",
      "1f3cb-1f3fc-200d-2642-fe0f",
      "1f3cb-1f3fd-200d-2642-fe0f",
      "1f3cb-1f3fe-200d-2642-fe0f",
      "1f3cb-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman lifting weights",
      "woman-lifting-weights"
    ],
    u: "1f3cb-fe0f-200d-2640-fe0f",
    v: [
      "1f3cb-1f3fb-200d-2640-fe0f",
      "1f3cb-1f3fc-200d-2640-fe0f",
      "1f3cb-1f3fd-200d-2640-fe0f",
      "1f3cb-1f3fe-200d-2640-fe0f",
      "1f3cb-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "bicyclist"
    ],
    u: "1f6b4",
    v: [
      "1f6b4-1f3fb",
      "1f6b4-1f3fc",
      "1f6b4-1f3fd",
      "1f6b4-1f3fe",
      "1f6b4-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "man biking",
      "man-biking"
    ],
    u: "1f6b4-200d-2642-fe0f",
    v: [
      "1f6b4-1f3fb-200d-2642-fe0f",
      "1f6b4-1f3fc-200d-2642-fe0f",
      "1f6b4-1f3fd-200d-2642-fe0f",
      "1f6b4-1f3fe-200d-2642-fe0f",
      "1f6b4-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman biking",
      "woman-biking"
    ],
    u: "1f6b4-200d-2640-fe0f",
    v: [
      "1f6b4-1f3fb-200d-2640-fe0f",
      "1f6b4-1f3fc-200d-2640-fe0f",
      "1f6b4-1f3fd-200d-2640-fe0f",
      "1f6b4-1f3fe-200d-2640-fe0f",
      "1f6b4-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "mountain bicyclist"
    ],
    u: "1f6b5",
    v: [
      "1f6b5-1f3fb",
      "1f6b5-1f3fc",
      "1f6b5-1f3fd",
      "1f6b5-1f3fe",
      "1f6b5-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "man mountain biking",
      "man-mountain-biking"
    ],
    u: "1f6b5-200d-2642-fe0f",
    v: [
      "1f6b5-1f3fb-200d-2642-fe0f",
      "1f6b5-1f3fc-200d-2642-fe0f",
      "1f6b5-1f3fd-200d-2642-fe0f",
      "1f6b5-1f3fe-200d-2642-fe0f",
      "1f6b5-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman mountain biking",
      "woman-mountain-biking"
    ],
    u: "1f6b5-200d-2640-fe0f",
    v: [
      "1f6b5-1f3fb-200d-2640-fe0f",
      "1f6b5-1f3fc-200d-2640-fe0f",
      "1f6b5-1f3fd-200d-2640-fe0f",
      "1f6b5-1f3fe-200d-2640-fe0f",
      "1f6b5-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person doing cartwheel"
    ],
    u: "1f938",
    v: [
      "1f938-1f3fb",
      "1f938-1f3fc",
      "1f938-1f3fd",
      "1f938-1f3fe",
      "1f938-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man cartwheeling",
      "man-cartwheeling"
    ],
    u: "1f938-200d-2642-fe0f",
    v: [
      "1f938-1f3fb-200d-2642-fe0f",
      "1f938-1f3fc-200d-2642-fe0f",
      "1f938-1f3fd-200d-2642-fe0f",
      "1f938-1f3fe-200d-2642-fe0f",
      "1f938-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman cartwheeling",
      "woman-cartwheeling"
    ],
    u: "1f938-200d-2640-fe0f",
    v: [
      "1f938-1f3fb-200d-2640-fe0f",
      "1f938-1f3fc-200d-2640-fe0f",
      "1f938-1f3fd-200d-2640-fe0f",
      "1f938-1f3fe-200d-2640-fe0f",
      "1f938-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "wrestlers"
    ],
    u: "1f93c",
    a: "3.0"
  },
  {
    n: [
      "men wrestling",
      "man-wrestling"
    ],
    u: "1f93c-200d-2642-fe0f",
    a: "4.0"
  },
  {
    n: [
      "women wrestling",
      "woman-wrestling"
    ],
    u: "1f93c-200d-2640-fe0f",
    a: "4.0"
  },
  {
    n: [
      "water polo"
    ],
    u: "1f93d",
    v: [
      "1f93d-1f3fb",
      "1f93d-1f3fc",
      "1f93d-1f3fd",
      "1f93d-1f3fe",
      "1f93d-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man playing water polo",
      "man-playing-water-polo"
    ],
    u: "1f93d-200d-2642-fe0f",
    v: [
      "1f93d-1f3fb-200d-2642-fe0f",
      "1f93d-1f3fc-200d-2642-fe0f",
      "1f93d-1f3fd-200d-2642-fe0f",
      "1f93d-1f3fe-200d-2642-fe0f",
      "1f93d-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman playing water polo",
      "woman-playing-water-polo"
    ],
    u: "1f93d-200d-2640-fe0f",
    v: [
      "1f93d-1f3fb-200d-2640-fe0f",
      "1f93d-1f3fc-200d-2640-fe0f",
      "1f93d-1f3fd-200d-2640-fe0f",
      "1f93d-1f3fe-200d-2640-fe0f",
      "1f93d-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "handball"
    ],
    u: "1f93e",
    v: [
      "1f93e-1f3fb",
      "1f93e-1f3fc",
      "1f93e-1f3fd",
      "1f93e-1f3fe",
      "1f93e-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man playing handball",
      "man-playing-handball"
    ],
    u: "1f93e-200d-2642-fe0f",
    v: [
      "1f93e-1f3fb-200d-2642-fe0f",
      "1f93e-1f3fc-200d-2642-fe0f",
      "1f93e-1f3fd-200d-2642-fe0f",
      "1f93e-1f3fe-200d-2642-fe0f",
      "1f93e-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman playing handball",
      "woman-playing-handball"
    ],
    u: "1f93e-200d-2640-fe0f",
    v: [
      "1f93e-1f3fb-200d-2640-fe0f",
      "1f93e-1f3fc-200d-2640-fe0f",
      "1f93e-1f3fd-200d-2640-fe0f",
      "1f93e-1f3fe-200d-2640-fe0f",
      "1f93e-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "juggling"
    ],
    u: "1f939",
    v: [
      "1f939-1f3fb",
      "1f939-1f3fc",
      "1f939-1f3fd",
      "1f939-1f3fe",
      "1f939-1f3ff"
    ],
    a: "3.0"
  },
  {
    n: [
      "man juggling",
      "man-juggling"
    ],
    u: "1f939-200d-2642-fe0f",
    v: [
      "1f939-1f3fb-200d-2642-fe0f",
      "1f939-1f3fc-200d-2642-fe0f",
      "1f939-1f3fd-200d-2642-fe0f",
      "1f939-1f3fe-200d-2642-fe0f",
      "1f939-1f3ff-200d-2642-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "woman juggling",
      "woman-juggling"
    ],
    u: "1f939-200d-2640-fe0f",
    v: [
      "1f939-1f3fb-200d-2640-fe0f",
      "1f939-1f3fc-200d-2640-fe0f",
      "1f939-1f3fd-200d-2640-fe0f",
      "1f939-1f3fe-200d-2640-fe0f",
      "1f939-1f3ff-200d-2640-fe0f"
    ],
    a: "4.0"
  },
  {
    n: [
      "person in lotus position"
    ],
    u: "1f9d8",
    v: [
      "1f9d8-1f3fb",
      "1f9d8-1f3fc",
      "1f9d8-1f3fd",
      "1f9d8-1f3fe",
      "1f9d8-1f3ff"
    ],
    a: "5.0"
  },
  {
    n: [
      "man in lotus position"
    ],
    u: "1f9d8-200d-2642-fe0f",
    v: [
      "1f9d8-1f3fb-200d-2642-fe0f",
      "1f9d8-1f3fc-200d-2642-fe0f",
      "1f9d8-1f3fd-200d-2642-fe0f",
      "1f9d8-1f3fe-200d-2642-fe0f",
      "1f9d8-1f3ff-200d-2642-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "woman in lotus position"
    ],
    u: "1f9d8-200d-2640-fe0f",
    v: [
      "1f9d8-1f3fb-200d-2640-fe0f",
      "1f9d8-1f3fc-200d-2640-fe0f",
      "1f9d8-1f3fd-200d-2640-fe0f",
      "1f9d8-1f3fe-200d-2640-fe0f",
      "1f9d8-1f3ff-200d-2640-fe0f"
    ],
    a: "5.0"
  },
  {
    n: [
      "bath"
    ],
    u: "1f6c0",
    v: [
      "1f6c0-1f3fb",
      "1f6c0-1f3fc",
      "1f6c0-1f3fd",
      "1f6c0-1f3fe",
      "1f6c0-1f3ff"
    ],
    a: "0.6"
  },
  {
    n: [
      "sleeping accommodation"
    ],
    u: "1f6cc",
    v: [
      "1f6cc-1f3fb",
      "1f6cc-1f3fc",
      "1f6cc-1f3fd",
      "1f6cc-1f3fe",
      "1f6cc-1f3ff"
    ],
    a: "1.0"
  },
  {
    n: [
      "people holding hands"
    ],
    u: "1f9d1-200d-1f91d-200d-1f9d1",
    v: [
      "1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fb",
      "1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fc",
      "1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fd",
      "1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fe",
      "1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3ff",
      "1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fb",
      "1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fc",
      "1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fd",
      "1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fe",
      "1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3ff",
      "1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fb",
      "1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fc",
      "1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fd",
      "1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fe",
      "1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3ff",
      "1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fb",
      "1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fc",
      "1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fd",
      "1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fe",
      "1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3ff",
      "1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fb",
      "1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fc",
      "1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fd",
      "1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fe",
      "1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff"
    ],
    a: "12.0"
  },
  {
    n: [
      "women holding hands",
      "two women holding hands"
    ],
    u: "1f46d",
    v: [
      "1f46d-1f3fb",
      "1f46d-1f3fc",
      "1f46d-1f3fd",
      "1f46d-1f3fe",
      "1f46d-1f3ff",
      "1f469-1f3fb-200d-1f91d-200d-1f469-1f3fc",
      "1f469-1f3fb-200d-1f91d-200d-1f469-1f3fd",
      "1f469-1f3fb-200d-1f91d-200d-1f469-1f3fe",
      "1f469-1f3fb-200d-1f91d-200d-1f469-1f3ff",
      "1f469-1f3fc-200d-1f91d-200d-1f469-1f3fb",
      "1f469-1f3fc-200d-1f91d-200d-1f469-1f3fd",
      "1f469-1f3fc-200d-1f91d-200d-1f469-1f3fe",
      "1f469-1f3fc-200d-1f91d-200d-1f469-1f3ff",
      "1f469-1f3fd-200d-1f91d-200d-1f469-1f3fb",
      "1f469-1f3fd-200d-1f91d-200d-1f469-1f3fc",
      "1f469-1f3fd-200d-1f91d-200d-1f469-1f3fe",
      "1f469-1f3fd-200d-1f91d-200d-1f469-1f3ff",
      "1f469-1f3fe-200d-1f91d-200d-1f469-1f3fb",
      "1f469-1f3fe-200d-1f91d-200d-1f469-1f3fc",
      "1f469-1f3fe-200d-1f91d-200d-1f469-1f3fd",
      "1f469-1f3fe-200d-1f91d-200d-1f469-1f3ff",
      "1f469-1f3ff-200d-1f91d-200d-1f469-1f3fb",
      "1f469-1f3ff-200d-1f91d-200d-1f469-1f3fc",
      "1f469-1f3ff-200d-1f91d-200d-1f469-1f3fd",
      "1f469-1f3ff-200d-1f91d-200d-1f469-1f3fe"
    ],
    a: "1.0"
  },
  {
    n: [
      "couple",
      "man and woman holding hands",
      "woman and man holding hands"
    ],
    u: "1f46b",
    v: [
      "1f46b-1f3fb",
      "1f46b-1f3fc",
      "1f46b-1f3fd",
      "1f46b-1f3fe",
      "1f46b-1f3ff",
      "1f469-1f3fb-200d-1f91d-200d-1f468-1f3fc",
      "1f469-1f3fb-200d-1f91d-200d-1f468-1f3fd",
      "1f469-1f3fb-200d-1f91d-200d-1f468-1f3fe",
      "1f469-1f3fb-200d-1f91d-200d-1f468-1f3ff",
      "1f469-1f3fc-200d-1f91d-200d-1f468-1f3fb",
      "1f469-1f3fc-200d-1f91d-200d-1f468-1f3fd",
      "1f469-1f3fc-200d-1f91d-200d-1f468-1f3fe",
      "1f469-1f3fc-200d-1f91d-200d-1f468-1f3ff",
      "1f469-1f3fd-200d-1f91d-200d-1f468-1f3fb",
      "1f469-1f3fd-200d-1f91d-200d-1f468-1f3fc",
      "1f469-1f3fd-200d-1f91d-200d-1f468-1f3fe",
      "1f469-1f3fd-200d-1f91d-200d-1f468-1f3ff",
      "1f469-1f3fe-200d-1f91d-200d-1f468-1f3fb",
      "1f469-1f3fe-200d-1f91d-200d-1f468-1f3fc",
      "1f469-1f3fe-200d-1f91d-200d-1f468-1f3fd",
      "1f469-1f3fe-200d-1f91d-200d-1f468-1f3ff",
      "1f469-1f3ff-200d-1f91d-200d-1f468-1f3fb",
      "1f469-1f3ff-200d-1f91d-200d-1f468-1f3fc",
      "1f469-1f3ff-200d-1f91d-200d-1f468-1f3fd",
      "1f469-1f3ff-200d-1f91d-200d-1f468-1f3fe"
    ],
    a: "0.6"
  },
  {
    n: [
      "men holding hands",
      "two men holding hands"
    ],
    u: "1f46c",
    v: [
      "1f46c-1f3fb",
      "1f46c-1f3fc",
      "1f46c-1f3fd",
      "1f46c-1f3fe",
      "1f46c-1f3ff",
      "1f468-1f3fb-200d-1f91d-200d-1f468-1f3fc",
      "1f468-1f3fb-200d-1f91d-200d-1f468-1f3fd",
      "1f468-1f3fb-200d-1f91d-200d-1f468-1f3fe",
      "1f468-1f3fb-200d-1f91d-200d-1f468-1f3ff",
      "1f468-1f3fc-200d-1f91d-200d-1f468-1f3fb",
      "1f468-1f3fc-200d-1f91d-200d-1f468-1f3fd",
      "1f468-1f3fc-200d-1f91d-200d-1f468-1f3fe",
      "1f468-1f3fc-200d-1f91d-200d-1f468-1f3ff",
      "1f468-1f3fd-200d-1f91d-200d-1f468-1f3fb",
      "1f468-1f3fd-200d-1f91d-200d-1f468-1f3fc",
      "1f468-1f3fd-200d-1f91d-200d-1f468-1f3fe",
      "1f468-1f3fd-200d-1f91d-200d-1f468-1f3ff",
      "1f468-1f3fe-200d-1f91d-200d-1f468-1f3fb",
      "1f468-1f3fe-200d-1f91d-200d-1f468-1f3fc",
      "1f468-1f3fe-200d-1f91d-200d-1f468-1f3fd",
      "1f468-1f3fe-200d-1f91d-200d-1f468-1f3ff",
      "1f468-1f3ff-200d-1f91d-200d-1f468-1f3fb",
      "1f468-1f3ff-200d-1f91d-200d-1f468-1f3fc",
      "1f468-1f3ff-200d-1f91d-200d-1f468-1f3fd",
      "1f468-1f3ff-200d-1f91d-200d-1f468-1f3fe"
    ],
    a: "1.0"
  },
  {
    n: [
      "kiss",
      "couplekiss"
    ],
    u: "1f48f",
    v: [
      "1f48f-1f3fb",
      "1f48f-1f3fc",
      "1f48f-1f3fd",
      "1f48f-1f3fe",
      "1f48f-1f3ff",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3ff",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fb",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fc",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fd",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f9d1-1f3fe"
    ],
    a: "0.6"
  },
  {
    n: [
      "woman-kiss-man",
      "kiss: woman, man"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f48b-200d-1f468",
    v: [
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "man-kiss-man",
      "kiss: man, man"
    ],
    u: "1f468-200d-2764-fe0f-200d-1f48b-200d-1f468",
    v: [
      "1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fb",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fc",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fd",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3fe",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f468-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "woman-kiss-woman",
      "kiss: woman, woman"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f48b-200d-1f469",
    v: [
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fb",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fc",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fd",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3fe",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f48b-200d-1f469-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "couple with heart"
    ],
    u: "1f491",
    v: [
      "1f491-1f3fb",
      "1f491-1f3fc",
      "1f491-1f3fd",
      "1f491-1f3fe",
      "1f491-1f3ff",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fc",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fd",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3fe",
      "1f9d1-1f3fb-200d-2764-fe0f-200d-1f9d1-1f3ff",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fb",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fd",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe",
      "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3ff",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fb",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fc",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3fe",
      "1f9d1-1f3fd-200d-2764-fe0f-200d-1f9d1-1f3ff",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fb",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fc",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3fd",
      "1f9d1-1f3fe-200d-2764-fe0f-200d-1f9d1-1f3ff",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fb",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fc",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fd",
      "1f9d1-1f3ff-200d-2764-fe0f-200d-1f9d1-1f3fe"
    ],
    a: "0.6"
  },
  {
    n: [
      "woman-heart-man",
      "couple with heart: woman, man"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f468",
    v: [
      "1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f468-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "man-heart-man",
      "couple with heart: man, man"
    ],
    u: "1f468-200d-2764-fe0f-200d-1f468",
    v: [
      "1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f468-1f3fb-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f468-1f3fc-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f468-1f3fd-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f468-1f3fe-200d-2764-fe0f-200d-1f468-1f3ff",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fb",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fc",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fd",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3fe",
      "1f468-1f3ff-200d-2764-fe0f-200d-1f468-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "woman-heart-woman",
      "couple with heart: woman, woman"
    ],
    u: "1f469-200d-2764-fe0f-200d-1f469",
    v: [
      "1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fb",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fc",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fd",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3fe",
      "1f469-1f3fb-200d-2764-fe0f-200d-1f469-1f3ff",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fb",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fc",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fd",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3fe",
      "1f469-1f3fc-200d-2764-fe0f-200d-1f469-1f3ff",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fb",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fc",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fd",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3fe",
      "1f469-1f3fd-200d-2764-fe0f-200d-1f469-1f3ff",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fb",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fc",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fd",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3fe",
      "1f469-1f3fe-200d-2764-fe0f-200d-1f469-1f3ff",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fb",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fc",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fd",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3fe",
      "1f469-1f3ff-200d-2764-fe0f-200d-1f469-1f3ff"
    ],
    a: "2.0"
  },
  {
    n: [
      "man-woman-boy",
      "family: man, woman, boy"
    ],
    u: "1f468-200d-1f469-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-woman-girl",
      "family: man, woman, girl"
    ],
    u: "1f468-200d-1f469-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "man-woman-girl-boy",
      "family: man, woman, girl, boy"
    ],
    u: "1f468-200d-1f469-200d-1f467-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-woman-boy-boy",
      "family: man, woman, boy, boy"
    ],
    u: "1f468-200d-1f469-200d-1f466-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-woman-girl-girl",
      "family: man, woman, girl, girl"
    ],
    u: "1f468-200d-1f469-200d-1f467-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "man-man-boy",
      "family: man, man, boy"
    ],
    u: "1f468-200d-1f468-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-man-girl",
      "family: man, man, girl"
    ],
    u: "1f468-200d-1f468-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "man-man-girl-boy",
      "family: man, man, girl, boy"
    ],
    u: "1f468-200d-1f468-200d-1f467-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-man-boy-boy",
      "family: man, man, boy, boy"
    ],
    u: "1f468-200d-1f468-200d-1f466-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "man-man-girl-girl",
      "family: man, man, girl, girl"
    ],
    u: "1f468-200d-1f468-200d-1f467-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "woman-woman-boy",
      "family: woman, woman, boy"
    ],
    u: "1f469-200d-1f469-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "woman-woman-girl",
      "family: woman, woman, girl"
    ],
    u: "1f469-200d-1f469-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "woman-woman-girl-boy",
      "family: woman, woman, girl, boy"
    ],
    u: "1f469-200d-1f469-200d-1f467-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "woman-woman-boy-boy",
      "family: woman, woman, boy, boy"
    ],
    u: "1f469-200d-1f469-200d-1f466-200d-1f466",
    a: "2.0"
  },
  {
    n: [
      "woman-woman-girl-girl",
      "family: woman, woman, girl, girl"
    ],
    u: "1f469-200d-1f469-200d-1f467-200d-1f467",
    a: "2.0"
  },
  {
    n: [
      "man-boy",
      "family: man, boy"
    ],
    u: "1f468-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "man-boy-boy",
      "family: man, boy, boy"
    ],
    u: "1f468-200d-1f466-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "man-girl",
      "family: man, girl"
    ],
    u: "1f468-200d-1f467",
    a: "4.0"
  },
  {
    n: [
      "man-girl-boy",
      "family: man, girl, boy"
    ],
    u: "1f468-200d-1f467-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "man-girl-girl",
      "family: man, girl, girl"
    ],
    u: "1f468-200d-1f467-200d-1f467",
    a: "4.0"
  },
  {
    n: [
      "woman-boy",
      "family: woman, boy"
    ],
    u: "1f469-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "woman-boy-boy",
      "family: woman, boy, boy"
    ],
    u: "1f469-200d-1f466-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "woman-girl",
      "family: woman, girl"
    ],
    u: "1f469-200d-1f467",
    a: "4.0"
  },
  {
    n: [
      "woman-girl-boy",
      "family: woman, girl, boy"
    ],
    u: "1f469-200d-1f467-200d-1f466",
    a: "4.0"
  },
  {
    n: [
      "woman-girl-girl",
      "family: woman, girl, girl"
    ],
    u: "1f469-200d-1f467-200d-1f467",
    a: "4.0"
  },
  {
    n: [
      "speaking head",
      "speaking head in silhouette"
    ],
    u: "1f5e3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "bust in silhouette"
    ],
    u: "1f464",
    a: "0.6"
  },
  {
    n: [
      "busts in silhouette"
    ],
    u: "1f465",
    a: "1.0"
  },
  {
    n: [
      "people hugging"
    ],
    u: "1fac2",
    a: "13.0"
  },
  {
    n: [
      "family"
    ],
    u: "1f46a",
    a: "0.6"
  },
  {
    n: [
      "family adult adult child",
      "family: adult, adult, child"
    ],
    u: "1f9d1-200d-1f9d1-200d-1f9d2",
    a: "15.1"
  },
  {
    n: [
      "family adult adult child child",
      "family: adult, adult, child, child"
    ],
    u: "1f9d1-200d-1f9d1-200d-1f9d2-200d-1f9d2",
    a: "15.1"
  },
  {
    n: [
      "family adult child",
      "family: adult, child"
    ],
    u: "1f9d1-200d-1f9d2",
    a: "15.1"
  },
  {
    n: [
      "family adult child child",
      "family: adult, child, child"
    ],
    u: "1f9d1-200d-1f9d2-200d-1f9d2",
    a: "15.1"
  },
  {
    n: [
      "footprints"
    ],
    u: "1f463",
    a: "0.6"
  }
];
var animals_nature = [
  {
    n: [
      "monkey face"
    ],
    u: "1f435",
    a: "0.6"
  },
  {
    n: [
      "monkey"
    ],
    u: "1f412",
    a: "0.6"
  },
  {
    n: [
      "gorilla"
    ],
    u: "1f98d",
    a: "3.0"
  },
  {
    n: [
      "orangutan"
    ],
    u: "1f9a7",
    a: "12.0"
  },
  {
    n: [
      "dog",
      "dog face"
    ],
    u: "1f436",
    a: "0.6"
  },
  {
    n: [
      "dog",
      "dog2"
    ],
    u: "1f415",
    a: "0.7"
  },
  {
    n: [
      "guide dog"
    ],
    u: "1f9ae",
    a: "12.0"
  },
  {
    n: [
      "service dog"
    ],
    u: "1f415-200d-1f9ba",
    a: "12.0"
  },
  {
    n: [
      "poodle"
    ],
    u: "1f429",
    a: "0.6"
  },
  {
    n: [
      "wolf",
      "wolf face"
    ],
    u: "1f43a",
    a: "0.6"
  },
  {
    n: [
      "fox face"
    ],
    u: "1f98a",
    a: "3.0"
  },
  {
    n: [
      "raccoon"
    ],
    u: "1f99d",
    a: "11.0"
  },
  {
    n: [
      "cat",
      "cat face"
    ],
    u: "1f431",
    a: "0.6"
  },
  {
    n: [
      "cat",
      "cat2"
    ],
    u: "1f408",
    a: "0.7"
  },
  {
    n: [
      "black cat"
    ],
    u: "1f408-200d-2b1b",
    a: "13.0"
  },
  {
    n: [
      "lion face"
    ],
    u: "1f981",
    a: "1.0"
  },
  {
    n: [
      "tiger",
      "tiger face"
    ],
    u: "1f42f",
    a: "0.6"
  },
  {
    n: [
      "tiger",
      "tiger2"
    ],
    u: "1f405",
    a: "1.0"
  },
  {
    n: [
      "leopard"
    ],
    u: "1f406",
    a: "1.0"
  },
  {
    n: [
      "horse",
      "horse face"
    ],
    u: "1f434",
    a: "0.6"
  },
  {
    n: [
      "moose"
    ],
    u: "1face",
    a: "15.0"
  },
  {
    n: [
      "donkey"
    ],
    u: "1facf",
    a: "15.0"
  },
  {
    n: [
      "horse",
      "racehorse"
    ],
    u: "1f40e",
    a: "0.6"
  },
  {
    n: [
      "unicorn face"
    ],
    u: "1f984",
    a: "1.0"
  },
  {
    n: [
      "zebra face"
    ],
    u: "1f993",
    a: "5.0"
  },
  {
    n: [
      "deer"
    ],
    u: "1f98c",
    a: "3.0"
  },
  {
    n: [
      "bison"
    ],
    u: "1f9ac",
    a: "13.0"
  },
  {
    n: [
      "cow",
      "cow face"
    ],
    u: "1f42e",
    a: "0.6"
  },
  {
    n: [
      "ox"
    ],
    u: "1f402",
    a: "1.0"
  },
  {
    n: [
      "water buffalo"
    ],
    u: "1f403",
    a: "1.0"
  },
  {
    n: [
      "cow",
      "cow2"
    ],
    u: "1f404",
    a: "1.0"
  },
  {
    n: [
      "pig",
      "pig face"
    ],
    u: "1f437",
    a: "0.6"
  },
  {
    n: [
      "pig",
      "pig2"
    ],
    u: "1f416",
    a: "1.0"
  },
  {
    n: [
      "boar"
    ],
    u: "1f417",
    a: "0.6"
  },
  {
    n: [
      "pig nose"
    ],
    u: "1f43d",
    a: "0.6"
  },
  {
    n: [
      "ram"
    ],
    u: "1f40f",
    a: "1.0"
  },
  {
    n: [
      "sheep"
    ],
    u: "1f411",
    a: "0.6"
  },
  {
    n: [
      "goat"
    ],
    u: "1f410",
    a: "1.0"
  },
  {
    n: [
      "dromedary camel"
    ],
    u: "1f42a",
    a: "1.0"
  },
  {
    n: [
      "camel",
      "bactrian camel"
    ],
    u: "1f42b",
    a: "0.6"
  },
  {
    n: [
      "llama"
    ],
    u: "1f999",
    a: "11.0"
  },
  {
    n: [
      "giraffe face"
    ],
    u: "1f992",
    a: "5.0"
  },
  {
    n: [
      "elephant"
    ],
    u: "1f418",
    a: "0.6"
  },
  {
    n: [
      "mammoth"
    ],
    u: "1f9a3",
    a: "13.0"
  },
  {
    n: [
      "rhinoceros"
    ],
    u: "1f98f",
    a: "3.0"
  },
  {
    n: [
      "hippopotamus"
    ],
    u: "1f99b",
    a: "11.0"
  },
  {
    n: [
      "mouse",
      "mouse face"
    ],
    u: "1f42d",
    a: "0.6"
  },
  {
    n: [
      "mouse",
      "mouse2"
    ],
    u: "1f401",
    a: "1.0"
  },
  {
    n: [
      "rat"
    ],
    u: "1f400",
    a: "1.0"
  },
  {
    n: [
      "hamster",
      "hamster face"
    ],
    u: "1f439",
    a: "0.6"
  },
  {
    n: [
      "rabbit",
      "rabbit face"
    ],
    u: "1f430",
    a: "0.6"
  },
  {
    n: [
      "rabbit",
      "rabbit2"
    ],
    u: "1f407",
    a: "1.0"
  },
  {
    n: [
      "chipmunk"
    ],
    u: "1f43f-fe0f",
    a: "0.7"
  },
  {
    n: [
      "beaver"
    ],
    u: "1f9ab",
    a: "13.0"
  },
  {
    n: [
      "hedgehog"
    ],
    u: "1f994",
    a: "5.0"
  },
  {
    n: [
      "bat"
    ],
    u: "1f987",
    a: "3.0"
  },
  {
    n: [
      "bear",
      "bear face"
    ],
    u: "1f43b",
    a: "0.6"
  },
  {
    n: [
      "polar bear"
    ],
    u: "1f43b-200d-2744-fe0f",
    a: "13.0"
  },
  {
    n: [
      "koala"
    ],
    u: "1f428",
    a: "0.6"
  },
  {
    n: [
      "panda face"
    ],
    u: "1f43c",
    a: "0.6"
  },
  {
    n: [
      "sloth"
    ],
    u: "1f9a5",
    a: "12.0"
  },
  {
    n: [
      "otter"
    ],
    u: "1f9a6",
    a: "12.0"
  },
  {
    n: [
      "skunk"
    ],
    u: "1f9a8",
    a: "12.0"
  },
  {
    n: [
      "kangaroo"
    ],
    u: "1f998",
    a: "11.0"
  },
  {
    n: [
      "badger"
    ],
    u: "1f9a1",
    a: "11.0"
  },
  {
    n: [
      "feet",
      "paw prints"
    ],
    u: "1f43e",
    a: "0.6"
  },
  {
    n: [
      "turkey"
    ],
    u: "1f983",
    a: "1.0"
  },
  {
    n: [
      "chicken"
    ],
    u: "1f414",
    a: "0.6"
  },
  {
    n: [
      "rooster"
    ],
    u: "1f413",
    a: "1.0"
  },
  {
    n: [
      "hatching chick"
    ],
    u: "1f423",
    a: "0.6"
  },
  {
    n: [
      "baby chick"
    ],
    u: "1f424",
    a: "0.6"
  },
  {
    n: [
      "hatched chick",
      "front-facing baby chick"
    ],
    u: "1f425",
    a: "0.6"
  },
  {
    n: [
      "bird"
    ],
    u: "1f426",
    a: "0.6"
  },
  {
    n: [
      "penguin"
    ],
    u: "1f427",
    a: "0.6"
  },
  {
    n: [
      "dove",
      "dove of peace"
    ],
    u: "1f54a-fe0f",
    a: "0.7"
  },
  {
    n: [
      "eagle"
    ],
    u: "1f985",
    a: "3.0"
  },
  {
    n: [
      "duck"
    ],
    u: "1f986",
    a: "3.0"
  },
  {
    n: [
      "swan"
    ],
    u: "1f9a2",
    a: "11.0"
  },
  {
    n: [
      "owl"
    ],
    u: "1f989",
    a: "3.0"
  },
  {
    n: [
      "dodo"
    ],
    u: "1f9a4",
    a: "13.0"
  },
  {
    n: [
      "feather"
    ],
    u: "1fab6",
    a: "13.0"
  },
  {
    n: [
      "flamingo"
    ],
    u: "1f9a9",
    a: "12.0"
  },
  {
    n: [
      "peacock"
    ],
    u: "1f99a",
    a: "11.0"
  },
  {
    n: [
      "parrot"
    ],
    u: "1f99c",
    a: "11.0"
  },
  {
    n: [
      "wing"
    ],
    u: "1fabd",
    a: "15.0"
  },
  {
    n: [
      "black bird"
    ],
    u: "1f426-200d-2b1b",
    a: "15.0"
  },
  {
    n: [
      "goose"
    ],
    u: "1fabf",
    a: "15.0"
  },
  {
    n: [
      "phoenix"
    ],
    u: "1f426-200d-1f525",
    a: "15.1"
  },
  {
    n: [
      "frog",
      "frog face"
    ],
    u: "1f438",
    a: "0.6"
  },
  {
    n: [
      "crocodile"
    ],
    u: "1f40a",
    a: "1.0"
  },
  {
    n: [
      "turtle"
    ],
    u: "1f422",
    a: "0.6"
  },
  {
    n: [
      "lizard"
    ],
    u: "1f98e",
    a: "3.0"
  },
  {
    n: [
      "snake"
    ],
    u: "1f40d",
    a: "0.6"
  },
  {
    n: [
      "dragon face"
    ],
    u: "1f432",
    a: "0.6"
  },
  {
    n: [
      "dragon"
    ],
    u: "1f409",
    a: "1.0"
  },
  {
    n: [
      "sauropod"
    ],
    u: "1f995",
    a: "5.0"
  },
  {
    n: [
      "t-rex"
    ],
    u: "1f996",
    a: "5.0"
  },
  {
    n: [
      "whale",
      "spouting whale"
    ],
    u: "1f433",
    a: "0.6"
  },
  {
    n: [
      "whale",
      "whale2"
    ],
    u: "1f40b",
    a: "1.0"
  },
  {
    n: [
      "dolphin",
      "flipper"
    ],
    u: "1f42c",
    a: "0.6"
  },
  {
    n: [
      "seal"
    ],
    u: "1f9ad",
    a: "13.0"
  },
  {
    n: [
      "fish"
    ],
    u: "1f41f",
    a: "0.6"
  },
  {
    n: [
      "tropical fish"
    ],
    u: "1f420",
    a: "0.6"
  },
  {
    n: [
      "blowfish"
    ],
    u: "1f421",
    a: "0.6"
  },
  {
    n: [
      "shark"
    ],
    u: "1f988",
    a: "3.0"
  },
  {
    n: [
      "octopus"
    ],
    u: "1f419",
    a: "0.6"
  },
  {
    n: [
      "shell",
      "spiral shell"
    ],
    u: "1f41a",
    a: "0.6"
  },
  {
    n: [
      "coral"
    ],
    u: "1fab8",
    a: "14.0"
  },
  {
    n: [
      "jellyfish"
    ],
    u: "1fabc",
    a: "15.0"
  },
  {
    n: [
      "snail"
    ],
    u: "1f40c",
    a: "0.6"
  },
  {
    n: [
      "butterfly"
    ],
    u: "1f98b",
    a: "3.0"
  },
  {
    n: [
      "bug"
    ],
    u: "1f41b",
    a: "0.6"
  },
  {
    n: [
      "ant"
    ],
    u: "1f41c",
    a: "0.6"
  },
  {
    n: [
      "bee",
      "honeybee"
    ],
    u: "1f41d",
    a: "0.6"
  },
  {
    n: [
      "beetle"
    ],
    u: "1fab2",
    a: "13.0"
  },
  {
    n: [
      "ladybug",
      "lady beetle"
    ],
    u: "1f41e",
    a: "0.6"
  },
  {
    n: [
      "cricket"
    ],
    u: "1f997",
    a: "5.0"
  },
  {
    n: [
      "cockroach"
    ],
    u: "1fab3",
    a: "13.0"
  },
  {
    n: [
      "spider"
    ],
    u: "1f577-fe0f",
    a: "0.7"
  },
  {
    n: [
      "spider web"
    ],
    u: "1f578-fe0f",
    a: "0.7"
  },
  {
    n: [
      "scorpion"
    ],
    u: "1f982",
    a: "1.0"
  },
  {
    n: [
      "mosquito"
    ],
    u: "1f99f",
    a: "11.0"
  },
  {
    n: [
      "fly"
    ],
    u: "1fab0",
    a: "13.0"
  },
  {
    n: [
      "worm"
    ],
    u: "1fab1",
    a: "13.0"
  },
  {
    n: [
      "microbe"
    ],
    u: "1f9a0",
    a: "11.0"
  },
  {
    n: [
      "bouquet"
    ],
    u: "1f490",
    a: "0.6"
  },
  {
    n: [
      "cherry blossom"
    ],
    u: "1f338",
    a: "0.6"
  },
  {
    n: [
      "white flower"
    ],
    u: "1f4ae",
    a: "0.6"
  },
  {
    n: [
      "lotus"
    ],
    u: "1fab7",
    a: "14.0"
  },
  {
    n: [
      "rosette"
    ],
    u: "1f3f5-fe0f",
    a: "0.7"
  },
  {
    n: [
      "rose"
    ],
    u: "1f339",
    a: "0.6"
  },
  {
    n: [
      "wilted flower"
    ],
    u: "1f940",
    a: "3.0"
  },
  {
    n: [
      "hibiscus"
    ],
    u: "1f33a",
    a: "0.6"
  },
  {
    n: [
      "sunflower"
    ],
    u: "1f33b",
    a: "0.6"
  },
  {
    n: [
      "blossom"
    ],
    u: "1f33c",
    a: "0.6"
  },
  {
    n: [
      "tulip"
    ],
    u: "1f337",
    a: "0.6"
  },
  {
    n: [
      "hyacinth"
    ],
    u: "1fabb",
    a: "15.0"
  },
  {
    n: [
      "seedling"
    ],
    u: "1f331",
    a: "0.6"
  },
  {
    n: [
      "potted plant"
    ],
    u: "1fab4",
    a: "13.0"
  },
  {
    n: [
      "evergreen tree"
    ],
    u: "1f332",
    a: "1.0"
  },
  {
    n: [
      "deciduous tree"
    ],
    u: "1f333",
    a: "1.0"
  },
  {
    n: [
      "palm tree"
    ],
    u: "1f334",
    a: "0.6"
  },
  {
    n: [
      "cactus"
    ],
    u: "1f335",
    a: "0.6"
  },
  {
    n: [
      "ear of rice"
    ],
    u: "1f33e",
    a: "0.6"
  },
  {
    n: [
      "herb"
    ],
    u: "1f33f",
    a: "0.6"
  },
  {
    n: [
      "shamrock"
    ],
    u: "2618-fe0f",
    a: "1.0"
  },
  {
    n: [
      "four leaf clover"
    ],
    u: "1f340",
    a: "0.6"
  },
  {
    n: [
      "maple leaf"
    ],
    u: "1f341",
    a: "0.6"
  },
  {
    n: [
      "fallen leaf"
    ],
    u: "1f342",
    a: "0.6"
  },
  {
    n: [
      "leaves",
      "leaf fluttering in wind"
    ],
    u: "1f343",
    a: "0.6"
  },
  {
    n: [
      "empty nest"
    ],
    u: "1fab9",
    a: "14.0"
  },
  {
    n: [
      "nest with eggs"
    ],
    u: "1faba",
    a: "14.0"
  },
  {
    n: [
      "mushroom"
    ],
    u: "1f344",
    a: "0.6"
  }
];
var food_drink = [
  {
    n: [
      "grapes"
    ],
    u: "1f347",
    a: "0.6"
  },
  {
    n: [
      "melon"
    ],
    u: "1f348",
    a: "0.6"
  },
  {
    n: [
      "watermelon"
    ],
    u: "1f349",
    a: "0.6"
  },
  {
    n: [
      "tangerine"
    ],
    u: "1f34a",
    a: "0.6"
  },
  {
    n: [
      "lemon"
    ],
    u: "1f34b",
    a: "1.0"
  },
  {
    n: [
      "lime"
    ],
    u: "1f34b-200d-1f7e9",
    a: "15.1"
  },
  {
    n: [
      "banana"
    ],
    u: "1f34c",
    a: "0.6"
  },
  {
    n: [
      "pineapple"
    ],
    u: "1f34d",
    a: "0.6"
  },
  {
    n: [
      "mango"
    ],
    u: "1f96d",
    a: "11.0"
  },
  {
    n: [
      "apple",
      "red apple"
    ],
    u: "1f34e",
    a: "0.6"
  },
  {
    n: [
      "green apple"
    ],
    u: "1f34f",
    a: "0.6"
  },
  {
    n: [
      "pear"
    ],
    u: "1f350",
    a: "1.0"
  },
  {
    n: [
      "peach"
    ],
    u: "1f351",
    a: "0.6"
  },
  {
    n: [
      "cherries"
    ],
    u: "1f352",
    a: "0.6"
  },
  {
    n: [
      "strawberry"
    ],
    u: "1f353",
    a: "0.6"
  },
  {
    n: [
      "blueberries"
    ],
    u: "1fad0",
    a: "13.0"
  },
  {
    n: [
      "kiwifruit"
    ],
    u: "1f95d",
    a: "3.0"
  },
  {
    n: [
      "tomato"
    ],
    u: "1f345",
    a: "0.6"
  },
  {
    n: [
      "olive"
    ],
    u: "1fad2",
    a: "13.0"
  },
  {
    n: [
      "coconut"
    ],
    u: "1f965",
    a: "5.0"
  },
  {
    n: [
      "avocado"
    ],
    u: "1f951",
    a: "3.0"
  },
  {
    n: [
      "eggplant",
      "aubergine"
    ],
    u: "1f346",
    a: "0.6"
  },
  {
    n: [
      "potato"
    ],
    u: "1f954",
    a: "3.0"
  },
  {
    n: [
      "carrot"
    ],
    u: "1f955",
    a: "3.0"
  },
  {
    n: [
      "corn",
      "ear of maize"
    ],
    u: "1f33d",
    a: "0.6"
  },
  {
    n: [
      "hot pepper"
    ],
    u: "1f336-fe0f",
    a: "0.7"
  },
  {
    n: [
      "bell pepper"
    ],
    u: "1fad1",
    a: "13.0"
  },
  {
    n: [
      "cucumber"
    ],
    u: "1f952",
    a: "3.0"
  },
  {
    n: [
      "leafy green"
    ],
    u: "1f96c",
    a: "11.0"
  },
  {
    n: [
      "broccoli"
    ],
    u: "1f966",
    a: "5.0"
  },
  {
    n: [
      "garlic"
    ],
    u: "1f9c4",
    a: "12.0"
  },
  {
    n: [
      "onion"
    ],
    u: "1f9c5",
    a: "12.0"
  },
  {
    n: [
      "peanuts"
    ],
    u: "1f95c",
    a: "3.0"
  },
  {
    n: [
      "beans"
    ],
    u: "1fad8",
    a: "14.0"
  },
  {
    n: [
      "chestnut"
    ],
    u: "1f330",
    a: "0.6"
  },
  {
    n: [
      "ginger root"
    ],
    u: "1fada",
    a: "15.0"
  },
  {
    n: [
      "pea pod"
    ],
    u: "1fadb",
    a: "15.0"
  },
  {
    n: [
      "brown mushroom"
    ],
    u: "1f344-200d-1f7eb",
    a: "15.1"
  },
  {
    n: [
      "bread"
    ],
    u: "1f35e",
    a: "0.6"
  },
  {
    n: [
      "croissant"
    ],
    u: "1f950",
    a: "3.0"
  },
  {
    n: [
      "baguette bread"
    ],
    u: "1f956",
    a: "3.0"
  },
  {
    n: [
      "flatbread"
    ],
    u: "1fad3",
    a: "13.0"
  },
  {
    n: [
      "pretzel"
    ],
    u: "1f968",
    a: "5.0"
  },
  {
    n: [
      "bagel"
    ],
    u: "1f96f",
    a: "11.0"
  },
  {
    n: [
      "pancakes"
    ],
    u: "1f95e",
    a: "3.0"
  },
  {
    n: [
      "waffle"
    ],
    u: "1f9c7",
    a: "12.0"
  },
  {
    n: [
      "cheese wedge"
    ],
    u: "1f9c0",
    a: "1.0"
  },
  {
    n: [
      "meat on bone"
    ],
    u: "1f356",
    a: "0.6"
  },
  {
    n: [
      "poultry leg"
    ],
    u: "1f357",
    a: "0.6"
  },
  {
    n: [
      "cut of meat"
    ],
    u: "1f969",
    a: "5.0"
  },
  {
    n: [
      "bacon"
    ],
    u: "1f953",
    a: "3.0"
  },
  {
    n: [
      "hamburger"
    ],
    u: "1f354",
    a: "0.6"
  },
  {
    n: [
      "fries",
      "french fries"
    ],
    u: "1f35f",
    a: "0.6"
  },
  {
    n: [
      "pizza",
      "slice of pizza"
    ],
    u: "1f355",
    a: "0.6"
  },
  {
    n: [
      "hotdog",
      "hot dog"
    ],
    u: "1f32d",
    a: "1.0"
  },
  {
    n: [
      "sandwich"
    ],
    u: "1f96a",
    a: "5.0"
  },
  {
    n: [
      "taco"
    ],
    u: "1f32e",
    a: "1.0"
  },
  {
    n: [
      "burrito"
    ],
    u: "1f32f",
    a: "1.0"
  },
  {
    n: [
      "tamale"
    ],
    u: "1fad4",
    a: "13.0"
  },
  {
    n: [
      "stuffed flatbread"
    ],
    u: "1f959",
    a: "3.0"
  },
  {
    n: [
      "falafel"
    ],
    u: "1f9c6",
    a: "12.0"
  },
  {
    n: [
      "egg"
    ],
    u: "1f95a",
    a: "3.0"
  },
  {
    n: [
      "cooking",
      "fried egg"
    ],
    u: "1f373",
    a: "0.6"
  },
  {
    n: [
      "shallow pan of food"
    ],
    u: "1f958",
    a: "3.0"
  },
  {
    n: [
      "stew",
      "pot of food"
    ],
    u: "1f372",
    a: "0.6"
  },
  {
    n: [
      "fondue"
    ],
    u: "1fad5",
    a: "13.0"
  },
  {
    n: [
      "bowl with spoon"
    ],
    u: "1f963",
    a: "5.0"
  },
  {
    n: [
      "green salad"
    ],
    u: "1f957",
    a: "3.0"
  },
  {
    n: [
      "popcorn"
    ],
    u: "1f37f",
    a: "1.0"
  },
  {
    n: [
      "butter"
    ],
    u: "1f9c8",
    a: "12.0"
  },
  {
    n: [
      "salt",
      "salt shaker"
    ],
    u: "1f9c2",
    a: "11.0"
  },
  {
    n: [
      "canned food"
    ],
    u: "1f96b",
    a: "5.0"
  },
  {
    n: [
      "bento",
      "bento box"
    ],
    u: "1f371",
    a: "0.6"
  },
  {
    n: [
      "rice cracker"
    ],
    u: "1f358",
    a: "0.6"
  },
  {
    n: [
      "rice ball"
    ],
    u: "1f359",
    a: "0.6"
  },
  {
    n: [
      "rice",
      "cooked rice"
    ],
    u: "1f35a",
    a: "0.6"
  },
  {
    n: [
      "curry",
      "curry and rice"
    ],
    u: "1f35b",
    a: "0.6"
  },
  {
    n: [
      "ramen",
      "steaming bowl"
    ],
    u: "1f35c",
    a: "0.6"
  },
  {
    n: [
      "spaghetti"
    ],
    u: "1f35d",
    a: "0.6"
  },
  {
    n: [
      "sweet potato",
      "roasted sweet potato"
    ],
    u: "1f360",
    a: "0.6"
  },
  {
    n: [
      "oden"
    ],
    u: "1f362",
    a: "0.6"
  },
  {
    n: [
      "sushi"
    ],
    u: "1f363",
    a: "0.6"
  },
  {
    n: [
      "fried shrimp"
    ],
    u: "1f364",
    a: "0.6"
  },
  {
    n: [
      "fish cake",
      "fish cake with swirl design"
    ],
    u: "1f365",
    a: "0.6"
  },
  {
    n: [
      "moon cake"
    ],
    u: "1f96e",
    a: "11.0"
  },
  {
    n: [
      "dango"
    ],
    u: "1f361",
    a: "0.6"
  },
  {
    n: [
      "dumpling"
    ],
    u: "1f95f",
    a: "5.0"
  },
  {
    n: [
      "fortune cookie"
    ],
    u: "1f960",
    a: "5.0"
  },
  {
    n: [
      "takeout box"
    ],
    u: "1f961",
    a: "5.0"
  },
  {
    n: [
      "crab"
    ],
    u: "1f980",
    a: "1.0"
  },
  {
    n: [
      "lobster"
    ],
    u: "1f99e",
    a: "11.0"
  },
  {
    n: [
      "shrimp"
    ],
    u: "1f990",
    a: "3.0"
  },
  {
    n: [
      "squid"
    ],
    u: "1f991",
    a: "3.0"
  },
  {
    n: [
      "oyster"
    ],
    u: "1f9aa",
    a: "12.0"
  },
  {
    n: [
      "icecream",
      "soft ice cream"
    ],
    u: "1f366",
    a: "0.6"
  },
  {
    n: [
      "shaved ice"
    ],
    u: "1f367",
    a: "0.6"
  },
  {
    n: [
      "ice cream"
    ],
    u: "1f368",
    a: "0.6"
  },
  {
    n: [
      "doughnut"
    ],
    u: "1f369",
    a: "0.6"
  },
  {
    n: [
      "cookie"
    ],
    u: "1f36a",
    a: "0.6"
  },
  {
    n: [
      "birthday",
      "birthday cake"
    ],
    u: "1f382",
    a: "0.6"
  },
  {
    n: [
      "cake",
      "shortcake"
    ],
    u: "1f370",
    a: "0.6"
  },
  {
    n: [
      "cupcake"
    ],
    u: "1f9c1",
    a: "11.0"
  },
  {
    n: [
      "pie"
    ],
    u: "1f967",
    a: "5.0"
  },
  {
    n: [
      "chocolate bar"
    ],
    u: "1f36b",
    a: "0.6"
  },
  {
    n: [
      "candy"
    ],
    u: "1f36c",
    a: "0.6"
  },
  {
    n: [
      "lollipop"
    ],
    u: "1f36d",
    a: "0.6"
  },
  {
    n: [
      "custard"
    ],
    u: "1f36e",
    a: "0.6"
  },
  {
    n: [
      "honey pot"
    ],
    u: "1f36f",
    a: "0.6"
  },
  {
    n: [
      "baby bottle"
    ],
    u: "1f37c",
    a: "1.0"
  },
  {
    n: [
      "glass of milk"
    ],
    u: "1f95b",
    a: "3.0"
  },
  {
    n: [
      "coffee",
      "hot beverage"
    ],
    u: "2615",
    a: "0.6"
  },
  {
    n: [
      "teapot"
    ],
    u: "1fad6",
    a: "13.0"
  },
  {
    n: [
      "tea",
      "teacup without handle"
    ],
    u: "1f375",
    a: "0.6"
  },
  {
    n: [
      "sake",
      "sake bottle and cup"
    ],
    u: "1f376",
    a: "0.6"
  },
  {
    n: [
      "champagne",
      "bottle with popping cork"
    ],
    u: "1f37e",
    a: "1.0"
  },
  {
    n: [
      "wine glass"
    ],
    u: "1f377",
    a: "0.6"
  },
  {
    n: [
      "cocktail",
      "cocktail glass"
    ],
    u: "1f378",
    a: "0.6"
  },
  {
    n: [
      "tropical drink"
    ],
    u: "1f379",
    a: "0.6"
  },
  {
    n: [
      "beer",
      "beer mug"
    ],
    u: "1f37a",
    a: "0.6"
  },
  {
    n: [
      "beers",
      "clinking beer mugs"
    ],
    u: "1f37b",
    a: "0.6"
  },
  {
    n: [
      "clinking glasses"
    ],
    u: "1f942",
    a: "3.0"
  },
  {
    n: [
      "tumbler glass"
    ],
    u: "1f943",
    a: "3.0"
  },
  {
    n: [
      "pouring liquid"
    ],
    u: "1fad7",
    a: "14.0"
  },
  {
    n: [
      "cup with straw"
    ],
    u: "1f964",
    a: "5.0"
  },
  {
    n: [
      "bubble tea"
    ],
    u: "1f9cb",
    a: "13.0"
  },
  {
    n: [
      "beverage box"
    ],
    u: "1f9c3",
    a: "12.0"
  },
  {
    n: [
      "mate drink"
    ],
    u: "1f9c9",
    a: "12.0"
  },
  {
    n: [
      "ice cube"
    ],
    u: "1f9ca",
    a: "12.0"
  },
  {
    n: [
      "chopsticks"
    ],
    u: "1f962",
    a: "5.0"
  },
  {
    n: [
      "knife fork plate",
      "fork and knife with plate"
    ],
    u: "1f37d-fe0f",
    a: "0.7"
  },
  {
    n: [
      "fork and knife"
    ],
    u: "1f374",
    a: "0.6"
  },
  {
    n: [
      "spoon"
    ],
    u: "1f944",
    a: "3.0"
  },
  {
    n: [
      "hocho",
      "knife"
    ],
    u: "1f52a",
    a: "0.6"
  },
  {
    n: [
      "jar"
    ],
    u: "1fad9",
    a: "14.0"
  },
  {
    n: [
      "amphora"
    ],
    u: "1f3fa",
    a: "1.0"
  }
];
var travel_places = [
  {
    n: [
      "earth africa",
      "earth globe europe-africa"
    ],
    u: "1f30d",
    a: "0.7"
  },
  {
    n: [
      "earth americas",
      "earth globe americas"
    ],
    u: "1f30e",
    a: "0.7"
  },
  {
    n: [
      "earth asia",
      "earth globe asia-australia"
    ],
    u: "1f30f",
    a: "0.6"
  },
  {
    n: [
      "globe with meridians"
    ],
    u: "1f310",
    a: "1.0"
  },
  {
    n: [
      "world map"
    ],
    u: "1f5fa-fe0f",
    a: "0.7"
  },
  {
    n: [
      "japan",
      "silhouette of japan"
    ],
    u: "1f5fe",
    a: "0.6"
  },
  {
    n: [
      "compass"
    ],
    u: "1f9ed",
    a: "11.0"
  },
  {
    n: [
      "snow-capped mountain",
      "snow capped mountain"
    ],
    u: "1f3d4-fe0f",
    a: "0.7"
  },
  {
    n: [
      "mountain"
    ],
    u: "26f0-fe0f",
    a: "0.7"
  },
  {
    n: [
      "volcano"
    ],
    u: "1f30b",
    a: "0.6"
  },
  {
    n: [
      "mount fuji"
    ],
    u: "1f5fb",
    a: "0.6"
  },
  {
    n: [
      "camping"
    ],
    u: "1f3d5-fe0f",
    a: "0.7"
  },
  {
    n: [
      "beach with umbrella"
    ],
    u: "1f3d6-fe0f",
    a: "0.7"
  },
  {
    n: [
      "desert"
    ],
    u: "1f3dc-fe0f",
    a: "0.7"
  },
  {
    n: [
      "desert island"
    ],
    u: "1f3dd-fe0f",
    a: "0.7"
  },
  {
    n: [
      "national park"
    ],
    u: "1f3de-fe0f",
    a: "0.7"
  },
  {
    n: [
      "stadium"
    ],
    u: "1f3df-fe0f",
    a: "0.7"
  },
  {
    n: [
      "classical building"
    ],
    u: "1f3db-fe0f",
    a: "0.7"
  },
  {
    n: [
      "building construction"
    ],
    u: "1f3d7-fe0f",
    a: "0.7"
  },
  {
    n: [
      "brick",
      "bricks"
    ],
    u: "1f9f1",
    a: "11.0"
  },
  {
    n: [
      "rock"
    ],
    u: "1faa8",
    a: "13.0"
  },
  {
    n: [
      "wood"
    ],
    u: "1fab5",
    a: "13.0"
  },
  {
    n: [
      "hut"
    ],
    u: "1f6d6",
    a: "13.0"
  },
  {
    n: [
      "houses",
      "house buildings"
    ],
    u: "1f3d8-fe0f",
    a: "0.7"
  },
  {
    n: [
      "derelict house",
      "derelict house building"
    ],
    u: "1f3da-fe0f",
    a: "0.7"
  },
  {
    n: [
      "house",
      "house building"
    ],
    u: "1f3e0",
    a: "0.6"
  },
  {
    n: [
      "house with garden"
    ],
    u: "1f3e1",
    a: "0.6"
  },
  {
    n: [
      "office",
      "office building"
    ],
    u: "1f3e2",
    a: "0.6"
  },
  {
    n: [
      "post office",
      "japanese post office"
    ],
    u: "1f3e3",
    a: "0.6"
  },
  {
    n: [
      "european post office"
    ],
    u: "1f3e4",
    a: "1.0"
  },
  {
    n: [
      "hospital"
    ],
    u: "1f3e5",
    a: "0.6"
  },
  {
    n: [
      "bank"
    ],
    u: "1f3e6",
    a: "0.6"
  },
  {
    n: [
      "hotel"
    ],
    u: "1f3e8",
    a: "0.6"
  },
  {
    n: [
      "love hotel"
    ],
    u: "1f3e9",
    a: "0.6"
  },
  {
    n: [
      "convenience store"
    ],
    u: "1f3ea",
    a: "0.6"
  },
  {
    n: [
      "school"
    ],
    u: "1f3eb",
    a: "0.6"
  },
  {
    n: [
      "department store"
    ],
    u: "1f3ec",
    a: "0.6"
  },
  {
    n: [
      "factory"
    ],
    u: "1f3ed",
    a: "0.6"
  },
  {
    n: [
      "japanese castle"
    ],
    u: "1f3ef",
    a: "0.6"
  },
  {
    n: [
      "european castle"
    ],
    u: "1f3f0",
    a: "0.6"
  },
  {
    n: [
      "wedding"
    ],
    u: "1f492",
    a: "0.6"
  },
  {
    n: [
      "tokyo tower"
    ],
    u: "1f5fc",
    a: "0.6"
  },
  {
    n: [
      "statue of liberty"
    ],
    u: "1f5fd",
    a: "0.6"
  },
  {
    n: [
      "church"
    ],
    u: "26ea",
    a: "0.6"
  },
  {
    n: [
      "mosque"
    ],
    u: "1f54c",
    a: "1.0"
  },
  {
    n: [
      "hindu temple"
    ],
    u: "1f6d5",
    a: "12.0"
  },
  {
    n: [
      "synagogue"
    ],
    u: "1f54d",
    a: "1.0"
  },
  {
    n: [
      "shinto shrine"
    ],
    u: "26e9-fe0f",
    a: "0.7"
  },
  {
    n: [
      "kaaba"
    ],
    u: "1f54b",
    a: "1.0"
  },
  {
    n: [
      "fountain"
    ],
    u: "26f2",
    a: "0.6"
  },
  {
    n: [
      "tent"
    ],
    u: "26fa",
    a: "0.6"
  },
  {
    n: [
      "foggy"
    ],
    u: "1f301",
    a: "0.6"
  },
  {
    n: [
      "night with stars"
    ],
    u: "1f303",
    a: "0.6"
  },
  {
    n: [
      "cityscape"
    ],
    u: "1f3d9-fe0f",
    a: "0.7"
  },
  {
    n: [
      "sunrise over mountains"
    ],
    u: "1f304",
    a: "0.6"
  },
  {
    n: [
      "sunrise"
    ],
    u: "1f305",
    a: "0.6"
  },
  {
    n: [
      "city sunset",
      "cityscape at dusk"
    ],
    u: "1f306",
    a: "0.6"
  },
  {
    n: [
      "city sunrise",
      "sunset over buildings"
    ],
    u: "1f307",
    a: "0.6"
  },
  {
    n: [
      "bridge at night"
    ],
    u: "1f309",
    a: "0.6"
  },
  {
    n: [
      "hotsprings",
      "hot springs"
    ],
    u: "2668-fe0f",
    a: "0.6"
  },
  {
    n: [
      "carousel horse"
    ],
    u: "1f3a0",
    a: "0.6"
  },
  {
    n: [
      "playground slide"
    ],
    u: "1f6dd",
    a: "14.0"
  },
  {
    n: [
      "ferris wheel"
    ],
    u: "1f3a1",
    a: "0.6"
  },
  {
    n: [
      "roller coaster"
    ],
    u: "1f3a2",
    a: "0.6"
  },
  {
    n: [
      "barber",
      "barber pole"
    ],
    u: "1f488",
    a: "0.6"
  },
  {
    n: [
      "circus tent"
    ],
    u: "1f3aa",
    a: "0.6"
  },
  {
    n: [
      "steam locomotive"
    ],
    u: "1f682",
    a: "1.0"
  },
  {
    n: [
      "railway car"
    ],
    u: "1f683",
    a: "0.6"
  },
  {
    n: [
      "high-speed train",
      "bullettrain side"
    ],
    u: "1f684",
    a: "0.6"
  },
  {
    n: [
      "bullettrain front",
      "high-speed train with bullet nose"
    ],
    u: "1f685",
    a: "0.6"
  },
  {
    n: [
      "train",
      "train2"
    ],
    u: "1f686",
    a: "1.0"
  },
  {
    n: [
      "metro"
    ],
    u: "1f687",
    a: "0.6"
  },
  {
    n: [
      "light rail"
    ],
    u: "1f688",
    a: "1.0"
  },
  {
    n: [
      "station"
    ],
    u: "1f689",
    a: "0.6"
  },
  {
    n: [
      "tram"
    ],
    u: "1f68a",
    a: "1.0"
  },
  {
    n: [
      "monorail"
    ],
    u: "1f69d",
    a: "1.0"
  },
  {
    n: [
      "mountain railway"
    ],
    u: "1f69e",
    a: "1.0"
  },
  {
    n: [
      "train",
      "tram car"
    ],
    u: "1f68b",
    a: "1.0"
  },
  {
    n: [
      "bus"
    ],
    u: "1f68c",
    a: "0.6"
  },
  {
    n: [
      "oncoming bus"
    ],
    u: "1f68d",
    a: "0.7"
  },
  {
    n: [
      "trolleybus"
    ],
    u: "1f68e",
    a: "1.0"
  },
  {
    n: [
      "minibus"
    ],
    u: "1f690",
    a: "1.0"
  },
  {
    n: [
      "ambulance"
    ],
    u: "1f691",
    a: "0.6"
  },
  {
    n: [
      "fire engine"
    ],
    u: "1f692",
    a: "0.6"
  },
  {
    n: [
      "police car"
    ],
    u: "1f693",
    a: "0.6"
  },
  {
    n: [
      "oncoming police car"
    ],
    u: "1f694",
    a: "0.7"
  },
  {
    n: [
      "taxi"
    ],
    u: "1f695",
    a: "0.6"
  },
  {
    n: [
      "oncoming taxi"
    ],
    u: "1f696",
    a: "1.0"
  },
  {
    n: [
      "car",
      "red car",
      "automobile"
    ],
    u: "1f697",
    a: "0.6"
  },
  {
    n: [
      "oncoming automobile"
    ],
    u: "1f698",
    a: "0.7"
  },
  {
    n: [
      "blue car",
      "recreational vehicle"
    ],
    u: "1f699",
    a: "0.6"
  },
  {
    n: [
      "pickup truck"
    ],
    u: "1f6fb",
    a: "13.0"
  },
  {
    n: [
      "truck",
      "delivery truck"
    ],
    u: "1f69a",
    a: "0.6"
  },
  {
    n: [
      "articulated lorry"
    ],
    u: "1f69b",
    a: "1.0"
  },
  {
    n: [
      "tractor"
    ],
    u: "1f69c",
    a: "1.0"
  },
  {
    n: [
      "racing car"
    ],
    u: "1f3ce-fe0f",
    a: "0.7"
  },
  {
    n: [
      "motorcycle",
      "racing motorcycle"
    ],
    u: "1f3cd-fe0f",
    a: "0.7"
  },
  {
    n: [
      "motor scooter"
    ],
    u: "1f6f5",
    a: "3.0"
  },
  {
    n: [
      "manual wheelchair"
    ],
    u: "1f9bd",
    a: "12.0"
  },
  {
    n: [
      "motorized wheelchair"
    ],
    u: "1f9bc",
    a: "12.0"
  },
  {
    n: [
      "auto rickshaw"
    ],
    u: "1f6fa",
    a: "12.0"
  },
  {
    n: [
      "bike",
      "bicycle"
    ],
    u: "1f6b2",
    a: "0.6"
  },
  {
    n: [
      "scooter"
    ],
    u: "1f6f4",
    a: "3.0"
  },
  {
    n: [
      "skateboard"
    ],
    u: "1f6f9",
    a: "11.0"
  },
  {
    n: [
      "roller skate"
    ],
    u: "1f6fc",
    a: "13.0"
  },
  {
    n: [
      "busstop",
      "bus stop"
    ],
    u: "1f68f",
    a: "0.6"
  },
  {
    n: [
      "motorway"
    ],
    u: "1f6e3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "railway track"
    ],
    u: "1f6e4-fe0f",
    a: "0.7"
  },
  {
    n: [
      "oil drum"
    ],
    u: "1f6e2-fe0f",
    a: "0.7"
  },
  {
    n: [
      "fuelpump",
      "fuel pump"
    ],
    u: "26fd",
    a: "0.6"
  },
  {
    n: [
      "wheel"
    ],
    u: "1f6de",
    a: "14.0"
  },
  {
    n: [
      "rotating light",
      "police cars revolving light"
    ],
    u: "1f6a8",
    a: "0.6"
  },
  {
    n: [
      "traffic light",
      "horizontal traffic light"
    ],
    u: "1f6a5",
    a: "0.6"
  },
  {
    n: [
      "vertical traffic light"
    ],
    u: "1f6a6",
    a: "1.0"
  },
  {
    n: [
      "octagonal sign"
    ],
    u: "1f6d1",
    a: "3.0"
  },
  {
    n: [
      "construction",
      "construction sign"
    ],
    u: "1f6a7",
    a: "0.6"
  },
  {
    n: [
      "anchor"
    ],
    u: "2693",
    a: "0.6"
  },
  {
    n: [
      "ring buoy"
    ],
    u: "1f6df",
    a: "14.0"
  },
  {
    n: [
      "boat",
      "sailboat"
    ],
    u: "26f5",
    a: "0.6"
  },
  {
    n: [
      "canoe"
    ],
    u: "1f6f6",
    a: "3.0"
  },
  {
    n: [
      "speedboat"
    ],
    u: "1f6a4",
    a: "0.6"
  },
  {
    n: [
      "passenger ship"
    ],
    u: "1f6f3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "ferry"
    ],
    u: "26f4-fe0f",
    a: "0.7"
  },
  {
    n: [
      "motor boat"
    ],
    u: "1f6e5-fe0f",
    a: "0.7"
  },
  {
    n: [
      "ship"
    ],
    u: "1f6a2",
    a: "0.6"
  },
  {
    n: [
      "airplane"
    ],
    u: "2708-fe0f",
    a: "0.6"
  },
  {
    n: [
      "small airplane"
    ],
    u: "1f6e9-fe0f",
    a: "0.7"
  },
  {
    n: [
      "airplane departure"
    ],
    u: "1f6eb",
    a: "1.0"
  },
  {
    n: [
      "airplane arriving"
    ],
    u: "1f6ec",
    a: "1.0"
  },
  {
    n: [
      "parachute"
    ],
    u: "1fa82",
    a: "12.0"
  },
  {
    n: [
      "seat"
    ],
    u: "1f4ba",
    a: "0.6"
  },
  {
    n: [
      "helicopter"
    ],
    u: "1f681",
    a: "1.0"
  },
  {
    n: [
      "suspension railway"
    ],
    u: "1f69f",
    a: "1.0"
  },
  {
    n: [
      "mountain cableway"
    ],
    u: "1f6a0",
    a: "1.0"
  },
  {
    n: [
      "aerial tramway"
    ],
    u: "1f6a1",
    a: "1.0"
  },
  {
    n: [
      "satellite"
    ],
    u: "1f6f0-fe0f",
    a: "0.7"
  },
  {
    n: [
      "rocket"
    ],
    u: "1f680",
    a: "0.6"
  },
  {
    n: [
      "flying saucer"
    ],
    u: "1f6f8",
    a: "5.0"
  },
  {
    n: [
      "bellhop bell"
    ],
    u: "1f6ce-fe0f",
    a: "0.7"
  },
  {
    n: [
      "luggage"
    ],
    u: "1f9f3",
    a: "11.0"
  },
  {
    n: [
      "hourglass"
    ],
    u: "231b",
    a: "0.6"
  },
  {
    n: [
      "hourglass flowing sand",
      "hourglass with flowing sand"
    ],
    u: "23f3",
    a: "0.6"
  },
  {
    n: [
      "watch"
    ],
    u: "231a",
    a: "0.6"
  },
  {
    n: [
      "alarm clock"
    ],
    u: "23f0",
    a: "0.6"
  },
  {
    n: [
      "stopwatch"
    ],
    u: "23f1-fe0f",
    a: "1.0"
  },
  {
    n: [
      "timer clock"
    ],
    u: "23f2-fe0f",
    a: "1.0"
  },
  {
    n: [
      "mantelpiece clock"
    ],
    u: "1f570-fe0f",
    a: "0.7"
  },
  {
    n: [
      "clock12",
      "clock face twelve oclock"
    ],
    u: "1f55b",
    a: "0.6"
  },
  {
    n: [
      "clock1230",
      "clock face twelve-thirty"
    ],
    u: "1f567",
    a: "0.7"
  },
  {
    n: [
      "clock1",
      "clock face one oclock"
    ],
    u: "1f550",
    a: "0.6"
  },
  {
    n: [
      "clock130",
      "clock face one-thirty"
    ],
    u: "1f55c",
    a: "0.7"
  },
  {
    n: [
      "clock2",
      "clock face two oclock"
    ],
    u: "1f551",
    a: "0.6"
  },
  {
    n: [
      "clock230",
      "clock face two-thirty"
    ],
    u: "1f55d",
    a: "0.7"
  },
  {
    n: [
      "clock3",
      "clock face three oclock"
    ],
    u: "1f552",
    a: "0.6"
  },
  {
    n: [
      "clock330",
      "clock face three-thirty"
    ],
    u: "1f55e",
    a: "0.7"
  },
  {
    n: [
      "clock4",
      "clock face four oclock"
    ],
    u: "1f553",
    a: "0.6"
  },
  {
    n: [
      "clock430",
      "clock face four-thirty"
    ],
    u: "1f55f",
    a: "0.7"
  },
  {
    n: [
      "clock5",
      "clock face five oclock"
    ],
    u: "1f554",
    a: "0.6"
  },
  {
    n: [
      "clock530",
      "clock face five-thirty"
    ],
    u: "1f560",
    a: "0.7"
  },
  {
    n: [
      "clock6",
      "clock face six oclock"
    ],
    u: "1f555",
    a: "0.6"
  },
  {
    n: [
      "clock630",
      "clock face six-thirty"
    ],
    u: "1f561",
    a: "0.7"
  },
  {
    n: [
      "clock7",
      "clock face seven oclock"
    ],
    u: "1f556",
    a: "0.6"
  },
  {
    n: [
      "clock730",
      "clock face seven-thirty"
    ],
    u: "1f562",
    a: "0.7"
  },
  {
    n: [
      "clock8",
      "clock face eight oclock"
    ],
    u: "1f557",
    a: "0.6"
  },
  {
    n: [
      "clock830",
      "clock face eight-thirty"
    ],
    u: "1f563",
    a: "0.7"
  },
  {
    n: [
      "clock9",
      "clock face nine oclock"
    ],
    u: "1f558",
    a: "0.6"
  },
  {
    n: [
      "clock930",
      "clock face nine-thirty"
    ],
    u: "1f564",
    a: "0.7"
  },
  {
    n: [
      "clock10",
      "clock face ten oclock"
    ],
    u: "1f559",
    a: "0.6"
  },
  {
    n: [
      "clock1030",
      "clock face ten-thirty"
    ],
    u: "1f565",
    a: "0.7"
  },
  {
    n: [
      "clock11",
      "clock face eleven oclock"
    ],
    u: "1f55a",
    a: "0.6"
  },
  {
    n: [
      "clock1130",
      "clock face eleven-thirty"
    ],
    u: "1f566",
    a: "0.7"
  },
  {
    n: [
      "new moon",
      "new moon symbol"
    ],
    u: "1f311",
    a: "0.6"
  },
  {
    n: [
      "waxing crescent moon",
      "waxing crescent moon symbol"
    ],
    u: "1f312",
    a: "1.0"
  },
  {
    n: [
      "first quarter moon",
      "first quarter moon symbol"
    ],
    u: "1f313",
    a: "0.6"
  },
  {
    n: [
      "moon",
      "waxing gibbous moon",
      "waxing gibbous moon symbol"
    ],
    u: "1f314",
    a: "0.6"
  },
  {
    n: [
      "full moon",
      "full moon symbol"
    ],
    u: "1f315",
    a: "0.6"
  },
  {
    n: [
      "waning gibbous moon",
      "waning gibbous moon symbol"
    ],
    u: "1f316",
    a: "1.0"
  },
  {
    n: [
      "last quarter moon",
      "last quarter moon symbol"
    ],
    u: "1f317",
    a: "1.0"
  },
  {
    n: [
      "waning crescent moon",
      "waning crescent moon symbol"
    ],
    u: "1f318",
    a: "1.0"
  },
  {
    n: [
      "crescent moon"
    ],
    u: "1f319",
    a: "0.6"
  },
  {
    n: [
      "new moon with face"
    ],
    u: "1f31a",
    a: "1.0"
  },
  {
    n: [
      "first quarter moon with face"
    ],
    u: "1f31b",
    a: "0.6"
  },
  {
    n: [
      "last quarter moon with face"
    ],
    u: "1f31c",
    a: "0.7"
  },
  {
    n: [
      "thermometer"
    ],
    u: "1f321-fe0f",
    a: "0.7"
  },
  {
    n: [
      "sunny",
      "black sun with rays"
    ],
    u: "2600-fe0f",
    a: "0.6"
  },
  {
    n: [
      "full moon with face"
    ],
    u: "1f31d",
    a: "1.0"
  },
  {
    n: [
      "sun with face"
    ],
    u: "1f31e",
    a: "1.0"
  },
  {
    n: [
      "ringed planet"
    ],
    u: "1fa90",
    a: "12.0"
  },
  {
    n: [
      "star",
      "white medium star"
    ],
    u: "2b50",
    a: "0.6"
  },
  {
    n: [
      "star2",
      "glowing star"
    ],
    u: "1f31f",
    a: "0.6"
  },
  {
    n: [
      "stars",
      "shooting star"
    ],
    u: "1f320",
    a: "0.6"
  },
  {
    n: [
      "milky way"
    ],
    u: "1f30c",
    a: "0.6"
  },
  {
    n: [
      "cloud"
    ],
    u: "2601-fe0f",
    a: "0.6"
  },
  {
    n: [
      "partly sunny",
      "sun behind cloud"
    ],
    u: "26c5",
    a: "0.6"
  },
  {
    n: [
      "thunder cloud and rain",
      "cloud with lightning and rain"
    ],
    u: "26c8-fe0f",
    a: "0.7"
  },
  {
    n: [
      "mostly sunny",
      "sun small cloud",
      "sun behind small cloud"
    ],
    u: "1f324-fe0f",
    a: "0.7"
  },
  {
    n: [
      "barely sunny",
      "sun behind cloud",
      "sun behind large cloud"
    ],
    u: "1f325-fe0f",
    a: "0.7"
  },
  {
    n: [
      "partly sunny rain",
      "sun behind rain cloud"
    ],
    u: "1f326-fe0f",
    a: "0.7"
  },
  {
    n: [
      "rain cloud",
      "cloud with rain"
    ],
    u: "1f327-fe0f",
    a: "0.7"
  },
  {
    n: [
      "snow cloud",
      "cloud with snow"
    ],
    u: "1f328-fe0f",
    a: "0.7"
  },
  {
    n: [
      "lightning",
      "lightning cloud",
      "cloud with lightning"
    ],
    u: "1f329-fe0f",
    a: "0.7"
  },
  {
    n: [
      "tornado",
      "tornado cloud"
    ],
    u: "1f32a-fe0f",
    a: "0.7"
  },
  {
    n: [
      "fog"
    ],
    u: "1f32b-fe0f",
    a: "0.7"
  },
  {
    n: [
      "wind face",
      "wind blowing face"
    ],
    u: "1f32c-fe0f",
    a: "0.7"
  },
  {
    n: [
      "cyclone"
    ],
    u: "1f300",
    a: "0.6"
  },
  {
    n: [
      "rainbow"
    ],
    u: "1f308",
    a: "0.6"
  },
  {
    n: [
      "closed umbrella"
    ],
    u: "1f302",
    a: "0.6"
  },
  {
    n: [
      "umbrella"
    ],
    u: "2602-fe0f",
    a: "0.7"
  },
  {
    n: [
      "umbrella with rain drops"
    ],
    u: "2614",
    a: "0.6"
  },
  {
    n: [
      "umbrella on ground"
    ],
    u: "26f1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "zap",
      "high voltage sign"
    ],
    u: "26a1",
    a: "0.6"
  },
  {
    n: [
      "snowflake"
    ],
    u: "2744-fe0f",
    a: "0.6"
  },
  {
    n: [
      "snowman"
    ],
    u: "2603-fe0f",
    a: "0.7"
  },
  {
    n: [
      "snowman without snow"
    ],
    u: "26c4",
    a: "0.6"
  },
  {
    n: [
      "comet"
    ],
    u: "2604-fe0f",
    a: "1.0"
  },
  {
    n: [
      "fire"
    ],
    u: "1f525",
    a: "0.6"
  },
  {
    n: [
      "droplet"
    ],
    u: "1f4a7",
    a: "0.6"
  },
  {
    n: [
      "ocean",
      "water wave"
    ],
    u: "1f30a",
    a: "0.6"
  }
];
var activities = [
  {
    n: [
      "jack-o-lantern",
      "jack o lantern"
    ],
    u: "1f383",
    a: "0.6"
  },
  {
    n: [
      "christmas tree"
    ],
    u: "1f384",
    a: "0.6"
  },
  {
    n: [
      "fireworks"
    ],
    u: "1f386",
    a: "0.6"
  },
  {
    n: [
      "sparkler",
      "firework sparkler"
    ],
    u: "1f387",
    a: "0.6"
  },
  {
    n: [
      "firecracker"
    ],
    u: "1f9e8",
    a: "11.0"
  },
  {
    n: [
      "sparkles"
    ],
    u: "2728",
    a: "0.6"
  },
  {
    n: [
      "balloon"
    ],
    u: "1f388",
    a: "0.6"
  },
  {
    n: [
      "tada",
      "party popper"
    ],
    u: "1f389",
    a: "0.6"
  },
  {
    n: [
      "confetti ball"
    ],
    u: "1f38a",
    a: "0.6"
  },
  {
    n: [
      "tanabata tree"
    ],
    u: "1f38b",
    a: "0.6"
  },
  {
    n: [
      "bamboo",
      "pine decoration"
    ],
    u: "1f38d",
    a: "0.6"
  },
  {
    n: [
      "dolls",
      "japanese dolls"
    ],
    u: "1f38e",
    a: "0.6"
  },
  {
    n: [
      "flags",
      "carp streamer"
    ],
    u: "1f38f",
    a: "0.6"
  },
  {
    n: [
      "wind chime"
    ],
    u: "1f390",
    a: "0.6"
  },
  {
    n: [
      "rice scene",
      "moon viewing ceremony"
    ],
    u: "1f391",
    a: "0.6"
  },
  {
    n: [
      "red envelope",
      "red gift envelope"
    ],
    u: "1f9e7",
    a: "11.0"
  },
  {
    n: [
      "ribbon"
    ],
    u: "1f380",
    a: "0.6"
  },
  {
    n: [
      "gift",
      "wrapped present"
    ],
    u: "1f381",
    a: "0.6"
  },
  {
    n: [
      "reminder ribbon"
    ],
    u: "1f397-fe0f",
    a: "0.7"
  },
  {
    n: [
      "admission tickets"
    ],
    u: "1f39f-fe0f",
    a: "0.7"
  },
  {
    n: [
      "ticket"
    ],
    u: "1f3ab",
    a: "0.6"
  },
  {
    n: [
      "medal",
      "military medal"
    ],
    u: "1f396-fe0f",
    a: "0.7"
  },
  {
    n: [
      "trophy"
    ],
    u: "1f3c6",
    a: "0.6"
  },
  {
    n: [
      "sports medal"
    ],
    u: "1f3c5",
    a: "1.0"
  },
  {
    n: [
      "first place medal"
    ],
    u: "1f947",
    a: "3.0"
  },
  {
    n: [
      "second place medal"
    ],
    u: "1f948",
    a: "3.0"
  },
  {
    n: [
      "third place medal"
    ],
    u: "1f949",
    a: "3.0"
  },
  {
    n: [
      "soccer",
      "soccer ball"
    ],
    u: "26bd",
    a: "0.6"
  },
  {
    n: [
      "baseball"
    ],
    u: "26be",
    a: "0.6"
  },
  {
    n: [
      "softball"
    ],
    u: "1f94e",
    a: "11.0"
  },
  {
    n: [
      "basketball",
      "basketball and hoop"
    ],
    u: "1f3c0",
    a: "0.6"
  },
  {
    n: [
      "volleyball"
    ],
    u: "1f3d0",
    a: "1.0"
  },
  {
    n: [
      "football",
      "american football"
    ],
    u: "1f3c8",
    a: "0.6"
  },
  {
    n: [
      "rugby football"
    ],
    u: "1f3c9",
    a: "1.0"
  },
  {
    n: [
      "tennis",
      "tennis racquet and ball"
    ],
    u: "1f3be",
    a: "0.6"
  },
  {
    n: [
      "flying disc"
    ],
    u: "1f94f",
    a: "11.0"
  },
  {
    n: [
      "bowling"
    ],
    u: "1f3b3",
    a: "0.6"
  },
  {
    n: [
      "cricket bat and ball"
    ],
    u: "1f3cf",
    a: "1.0"
  },
  {
    n: [
      "field hockey stick and ball"
    ],
    u: "1f3d1",
    a: "1.0"
  },
  {
    n: [
      "ice hockey stick and puck"
    ],
    u: "1f3d2",
    a: "1.0"
  },
  {
    n: [
      "lacrosse",
      "lacrosse stick and ball"
    ],
    u: "1f94d",
    a: "11.0"
  },
  {
    n: [
      "table tennis paddle and ball"
    ],
    u: "1f3d3",
    a: "1.0"
  },
  {
    n: [
      "badminton racquet and shuttlecock"
    ],
    u: "1f3f8",
    a: "1.0"
  },
  {
    n: [
      "boxing glove"
    ],
    u: "1f94a",
    a: "3.0"
  },
  {
    n: [
      "martial arts uniform"
    ],
    u: "1f94b",
    a: "3.0"
  },
  {
    n: [
      "goal net"
    ],
    u: "1f945",
    a: "3.0"
  },
  {
    n: [
      "golf",
      "flag in hole"
    ],
    u: "26f3",
    a: "0.6"
  },
  {
    n: [
      "ice skate"
    ],
    u: "26f8-fe0f",
    a: "0.7"
  },
  {
    n: [
      "fishing pole and fish"
    ],
    u: "1f3a3",
    a: "0.6"
  },
  {
    n: [
      "diving mask"
    ],
    u: "1f93f",
    a: "12.0"
  },
  {
    n: [
      "running shirt with sash"
    ],
    u: "1f3bd",
    a: "0.6"
  },
  {
    n: [
      "ski",
      "ski and ski boot"
    ],
    u: "1f3bf",
    a: "0.6"
  },
  {
    n: [
      "sled"
    ],
    u: "1f6f7",
    a: "5.0"
  },
  {
    n: [
      "curling stone"
    ],
    u: "1f94c",
    a: "5.0"
  },
  {
    n: [
      "dart",
      "direct hit"
    ],
    u: "1f3af",
    a: "0.6"
  },
  {
    n: [
      "yo-yo"
    ],
    u: "1fa80",
    a: "12.0"
  },
  {
    n: [
      "kite"
    ],
    u: "1fa81",
    a: "12.0"
  },
  {
    n: [
      "gun",
      "pistol"
    ],
    u: "1f52b",
    a: "0.6"
  },
  {
    n: [
      "8ball",
      "billiards"
    ],
    u: "1f3b1",
    a: "0.6"
  },
  {
    n: [
      "crystal ball"
    ],
    u: "1f52e",
    a: "0.6"
  },
  {
    n: [
      "magic wand"
    ],
    u: "1fa84",
    a: "13.0"
  },
  {
    n: [
      "video game"
    ],
    u: "1f3ae",
    a: "0.6"
  },
  {
    n: [
      "joystick"
    ],
    u: "1f579-fe0f",
    a: "0.7"
  },
  {
    n: [
      "slot machine"
    ],
    u: "1f3b0",
    a: "0.6"
  },
  {
    n: [
      "game die"
    ],
    u: "1f3b2",
    a: "0.6"
  },
  {
    n: [
      "jigsaw",
      "jigsaw puzzle piece"
    ],
    u: "1f9e9",
    a: "11.0"
  },
  {
    n: [
      "teddy bear"
    ],
    u: "1f9f8",
    a: "11.0"
  },
  {
    n: [
      "pinata"
    ],
    u: "1fa85",
    a: "13.0"
  },
  {
    n: [
      "mirror ball"
    ],
    u: "1faa9",
    a: "14.0"
  },
  {
    n: [
      "nesting dolls"
    ],
    u: "1fa86",
    a: "13.0"
  },
  {
    n: [
      "spades",
      "black spade suit"
    ],
    u: "2660-fe0f",
    a: "0.6"
  },
  {
    n: [
      "hearts",
      "black heart suit"
    ],
    u: "2665-fe0f",
    a: "0.6"
  },
  {
    n: [
      "diamonds",
      "black diamond suit"
    ],
    u: "2666-fe0f",
    a: "0.6"
  },
  {
    n: [
      "clubs",
      "black club suit"
    ],
    u: "2663-fe0f",
    a: "0.6"
  },
  {
    n: [
      "chess pawn"
    ],
    u: "265f-fe0f",
    a: "11.0"
  },
  {
    n: [
      "black joker",
      "playing card black joker"
    ],
    u: "1f0cf",
    a: "0.6"
  },
  {
    n: [
      "mahjong",
      "mahjong tile red dragon"
    ],
    u: "1f004",
    a: "0.6"
  },
  {
    n: [
      "flower playing cards"
    ],
    u: "1f3b4",
    a: "0.6"
  },
  {
    n: [
      "performing arts"
    ],
    u: "1f3ad",
    a: "0.6"
  },
  {
    n: [
      "framed picture",
      "frame with picture"
    ],
    u: "1f5bc-fe0f",
    a: "0.7"
  },
  {
    n: [
      "art",
      "artist palette"
    ],
    u: "1f3a8",
    a: "0.6"
  },
  {
    n: [
      "thread",
      "spool of thread"
    ],
    u: "1f9f5",
    a: "11.0"
  },
  {
    n: [
      "sewing needle"
    ],
    u: "1faa1",
    a: "13.0"
  },
  {
    n: [
      "yarn",
      "ball of yarn"
    ],
    u: "1f9f6",
    a: "11.0"
  },
  {
    n: [
      "knot"
    ],
    u: "1faa2",
    a: "13.0"
  }
];
var objects = [
  {
    n: [
      "eyeglasses"
    ],
    u: "1f453",
    a: "0.6"
  },
  {
    n: [
      "sunglasses",
      "dark sunglasses"
    ],
    u: "1f576-fe0f",
    a: "0.7"
  },
  {
    n: [
      "goggles"
    ],
    u: "1f97d",
    a: "11.0"
  },
  {
    n: [
      "lab coat"
    ],
    u: "1f97c",
    a: "11.0"
  },
  {
    n: [
      "safety vest"
    ],
    u: "1f9ba",
    a: "12.0"
  },
  {
    n: [
      "necktie"
    ],
    u: "1f454",
    a: "0.6"
  },
  {
    n: [
      "shirt",
      "tshirt",
      "t-shirt"
    ],
    u: "1f455",
    a: "0.6"
  },
  {
    n: [
      "jeans"
    ],
    u: "1f456",
    a: "0.6"
  },
  {
    n: [
      "scarf"
    ],
    u: "1f9e3",
    a: "5.0"
  },
  {
    n: [
      "gloves"
    ],
    u: "1f9e4",
    a: "5.0"
  },
  {
    n: [
      "coat"
    ],
    u: "1f9e5",
    a: "5.0"
  },
  {
    n: [
      "socks"
    ],
    u: "1f9e6",
    a: "5.0"
  },
  {
    n: [
      "dress"
    ],
    u: "1f457",
    a: "0.6"
  },
  {
    n: [
      "kimono"
    ],
    u: "1f458",
    a: "0.6"
  },
  {
    n: [
      "sari"
    ],
    u: "1f97b",
    a: "12.0"
  },
  {
    n: [
      "one-piece swimsuit"
    ],
    u: "1fa71",
    a: "12.0"
  },
  {
    n: [
      "briefs"
    ],
    u: "1fa72",
    a: "12.0"
  },
  {
    n: [
      "shorts"
    ],
    u: "1fa73",
    a: "12.0"
  },
  {
    n: [
      "bikini"
    ],
    u: "1f459",
    a: "0.6"
  },
  {
    n: [
      "womans clothes"
    ],
    u: "1f45a",
    a: "0.6"
  },
  {
    n: [
      "folding hand fan"
    ],
    u: "1faad",
    a: "15.0"
  },
  {
    n: [
      "purse"
    ],
    u: "1f45b",
    a: "0.6"
  },
  {
    n: [
      "handbag"
    ],
    u: "1f45c",
    a: "0.6"
  },
  {
    n: [
      "pouch"
    ],
    u: "1f45d",
    a: "0.6"
  },
  {
    n: [
      "shopping bags"
    ],
    u: "1f6cd-fe0f",
    a: "0.7"
  },
  {
    n: [
      "school satchel"
    ],
    u: "1f392",
    a: "0.6"
  },
  {
    n: [
      "thong sandal"
    ],
    u: "1fa74",
    a: "13.0"
  },
  {
    n: [
      "shoe",
      "mans shoe"
    ],
    u: "1f45e",
    a: "0.6"
  },
  {
    n: [
      "athletic shoe"
    ],
    u: "1f45f",
    a: "0.6"
  },
  {
    n: [
      "hiking boot"
    ],
    u: "1f97e",
    a: "11.0"
  },
  {
    n: [
      "flat shoe",
      "womans flat shoe"
    ],
    u: "1f97f",
    a: "11.0"
  },
  {
    n: [
      "high heel",
      "high-heeled shoe"
    ],
    u: "1f460",
    a: "0.6"
  },
  {
    n: [
      "sandal",
      "womans sandal"
    ],
    u: "1f461",
    a: "0.6"
  },
  {
    n: [
      "ballet shoes"
    ],
    u: "1fa70",
    a: "12.0"
  },
  {
    n: [
      "boot",
      "womans boots"
    ],
    u: "1f462",
    a: "0.6"
  },
  {
    n: [
      "hair pick"
    ],
    u: "1faae",
    a: "15.0"
  },
  {
    n: [
      "crown"
    ],
    u: "1f451",
    a: "0.6"
  },
  {
    n: [
      "womans hat"
    ],
    u: "1f452",
    a: "0.6"
  },
  {
    n: [
      "tophat",
      "top hat"
    ],
    u: "1f3a9",
    a: "0.6"
  },
  {
    n: [
      "mortar board",
      "graduation cap"
    ],
    u: "1f393",
    a: "0.6"
  },
  {
    n: [
      "billed cap"
    ],
    u: "1f9e2",
    a: "5.0"
  },
  {
    n: [
      "military helmet"
    ],
    u: "1fa96",
    a: "13.0"
  },
  {
    n: [
      "rescue worker\u2019s helmet",
      "helmet with white cross"
    ],
    u: "26d1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "prayer beads"
    ],
    u: "1f4ff",
    a: "1.0"
  },
  {
    n: [
      "lipstick"
    ],
    u: "1f484",
    a: "0.6"
  },
  {
    n: [
      "ring"
    ],
    u: "1f48d",
    a: "0.6"
  },
  {
    n: [
      "gem",
      "gem stone"
    ],
    u: "1f48e",
    a: "0.6"
  },
  {
    n: [
      "mute",
      "speaker with cancellation stroke"
    ],
    u: "1f507",
    a: "1.0"
  },
  {
    n: [
      "speaker"
    ],
    u: "1f508",
    a: "0.7"
  },
  {
    n: [
      "sound",
      "speaker with one sound wave"
    ],
    u: "1f509",
    a: "1.0"
  },
  {
    n: [
      "loud sound",
      "speaker with three sound waves"
    ],
    u: "1f50a",
    a: "0.6"
  },
  {
    n: [
      "loudspeaker",
      "public address loudspeaker"
    ],
    u: "1f4e2",
    a: "0.6"
  },
  {
    n: [
      "mega",
      "cheering megaphone"
    ],
    u: "1f4e3",
    a: "0.6"
  },
  {
    n: [
      "postal horn"
    ],
    u: "1f4ef",
    a: "1.0"
  },
  {
    n: [
      "bell"
    ],
    u: "1f514",
    a: "0.6"
  },
  {
    n: [
      "no bell",
      "bell with cancellation stroke"
    ],
    u: "1f515",
    a: "1.0"
  },
  {
    n: [
      "musical score"
    ],
    u: "1f3bc",
    a: "0.6"
  },
  {
    n: [
      "musical note"
    ],
    u: "1f3b5",
    a: "0.6"
  },
  {
    n: [
      "notes",
      "multiple musical notes"
    ],
    u: "1f3b6",
    a: "0.6"
  },
  {
    n: [
      "studio microphone"
    ],
    u: "1f399-fe0f",
    a: "0.7"
  },
  {
    n: [
      "level slider"
    ],
    u: "1f39a-fe0f",
    a: "0.7"
  },
  {
    n: [
      "control knobs"
    ],
    u: "1f39b-fe0f",
    a: "0.7"
  },
  {
    n: [
      "microphone"
    ],
    u: "1f3a4",
    a: "0.6"
  },
  {
    n: [
      "headphone",
      "headphones"
    ],
    u: "1f3a7",
    a: "0.6"
  },
  {
    n: [
      "radio"
    ],
    u: "1f4fb",
    a: "0.6"
  },
  {
    n: [
      "saxophone"
    ],
    u: "1f3b7",
    a: "0.6"
  },
  {
    n: [
      "accordion"
    ],
    u: "1fa97",
    a: "13.0"
  },
  {
    n: [
      "guitar"
    ],
    u: "1f3b8",
    a: "0.6"
  },
  {
    n: [
      "musical keyboard"
    ],
    u: "1f3b9",
    a: "0.6"
  },
  {
    n: [
      "trumpet"
    ],
    u: "1f3ba",
    a: "0.6"
  },
  {
    n: [
      "violin"
    ],
    u: "1f3bb",
    a: "0.6"
  },
  {
    n: [
      "banjo"
    ],
    u: "1fa95",
    a: "12.0"
  },
  {
    n: [
      "drum with drumsticks"
    ],
    u: "1f941",
    a: "3.0"
  },
  {
    n: [
      "long drum"
    ],
    u: "1fa98",
    a: "13.0"
  },
  {
    n: [
      "maracas"
    ],
    u: "1fa87",
    a: "15.0"
  },
  {
    n: [
      "flute"
    ],
    u: "1fa88",
    a: "15.0"
  },
  {
    n: [
      "iphone",
      "mobile phone"
    ],
    u: "1f4f1",
    a: "0.6"
  },
  {
    n: [
      "calling",
      "mobile phone with rightwards arrow at left"
    ],
    u: "1f4f2",
    a: "0.6"
  },
  {
    n: [
      "phone",
      "telephone",
      "black telephone"
    ],
    u: "260e-fe0f",
    a: "0.6"
  },
  {
    n: [
      "telephone receiver"
    ],
    u: "1f4de",
    a: "0.6"
  },
  {
    n: [
      "pager"
    ],
    u: "1f4df",
    a: "0.6"
  },
  {
    n: [
      "fax",
      "fax machine"
    ],
    u: "1f4e0",
    a: "0.6"
  },
  {
    n: [
      "battery"
    ],
    u: "1f50b",
    a: "0.6"
  },
  {
    n: [
      "low battery"
    ],
    u: "1faab",
    a: "14.0"
  },
  {
    n: [
      "electric plug"
    ],
    u: "1f50c",
    a: "0.6"
  },
  {
    n: [
      "computer",
      "personal computer"
    ],
    u: "1f4bb",
    a: "0.6"
  },
  {
    n: [
      "desktop computer"
    ],
    u: "1f5a5-fe0f",
    a: "0.7"
  },
  {
    n: [
      "printer"
    ],
    u: "1f5a8-fe0f",
    a: "0.7"
  },
  {
    n: [
      "keyboard"
    ],
    u: "2328-fe0f",
    a: "1.0"
  },
  {
    n: [
      "computer mouse",
      "three button mouse"
    ],
    u: "1f5b1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "trackball"
    ],
    u: "1f5b2-fe0f",
    a: "0.7"
  },
  {
    n: [
      "minidisc"
    ],
    u: "1f4bd",
    a: "0.6"
  },
  {
    n: [
      "floppy disk"
    ],
    u: "1f4be",
    a: "0.6"
  },
  {
    n: [
      "cd",
      "optical disc"
    ],
    u: "1f4bf",
    a: "0.6"
  },
  {
    n: [
      "dvd"
    ],
    u: "1f4c0",
    a: "0.6"
  },
  {
    n: [
      "abacus"
    ],
    u: "1f9ee",
    a: "11.0"
  },
  {
    n: [
      "movie camera"
    ],
    u: "1f3a5",
    a: "0.6"
  },
  {
    n: [
      "film frames"
    ],
    u: "1f39e-fe0f",
    a: "0.7"
  },
  {
    n: [
      "film projector"
    ],
    u: "1f4fd-fe0f",
    a: "0.7"
  },
  {
    n: [
      "clapper",
      "clapper board"
    ],
    u: "1f3ac",
    a: "0.6"
  },
  {
    n: [
      "tv",
      "television"
    ],
    u: "1f4fa",
    a: "0.6"
  },
  {
    n: [
      "camera"
    ],
    u: "1f4f7",
    a: "0.6"
  },
  {
    n: [
      "camera with flash"
    ],
    u: "1f4f8",
    a: "1.0"
  },
  {
    n: [
      "video camera"
    ],
    u: "1f4f9",
    a: "0.6"
  },
  {
    n: [
      "vhs",
      "videocassette"
    ],
    u: "1f4fc",
    a: "0.6"
  },
  {
    n: [
      "mag",
      "left-pointing magnifying glass"
    ],
    u: "1f50d",
    a: "0.6"
  },
  {
    n: [
      "mag right",
      "right-pointing magnifying glass"
    ],
    u: "1f50e",
    a: "0.6"
  },
  {
    n: [
      "candle"
    ],
    u: "1f56f-fe0f",
    a: "0.7"
  },
  {
    n: [
      "bulb",
      "electric light bulb"
    ],
    u: "1f4a1",
    a: "0.6"
  },
  {
    n: [
      "flashlight",
      "electric torch"
    ],
    u: "1f526",
    a: "0.6"
  },
  {
    n: [
      "lantern",
      "izakaya lantern"
    ],
    u: "1f3ee",
    a: "0.6"
  },
  {
    n: [
      "diya lamp"
    ],
    u: "1fa94",
    a: "12.0"
  },
  {
    n: [
      "notebook with decorative cover"
    ],
    u: "1f4d4",
    a: "0.6"
  },
  {
    n: [
      "closed book"
    ],
    u: "1f4d5",
    a: "0.6"
  },
  {
    n: [
      "book",
      "open book"
    ],
    u: "1f4d6",
    a: "0.6"
  },
  {
    n: [
      "green book"
    ],
    u: "1f4d7",
    a: "0.6"
  },
  {
    n: [
      "blue book"
    ],
    u: "1f4d8",
    a: "0.6"
  },
  {
    n: [
      "orange book"
    ],
    u: "1f4d9",
    a: "0.6"
  },
  {
    n: [
      "books"
    ],
    u: "1f4da",
    a: "0.6"
  },
  {
    n: [
      "notebook"
    ],
    u: "1f4d3",
    a: "0.6"
  },
  {
    n: [
      "ledger"
    ],
    u: "1f4d2",
    a: "0.6"
  },
  {
    n: [
      "page with curl"
    ],
    u: "1f4c3",
    a: "0.6"
  },
  {
    n: [
      "scroll"
    ],
    u: "1f4dc",
    a: "0.6"
  },
  {
    n: [
      "page facing up"
    ],
    u: "1f4c4",
    a: "0.6"
  },
  {
    n: [
      "newspaper"
    ],
    u: "1f4f0",
    a: "0.6"
  },
  {
    n: [
      "rolled-up newspaper",
      "rolled up newspaper"
    ],
    u: "1f5de-fe0f",
    a: "0.7"
  },
  {
    n: [
      "bookmark tabs"
    ],
    u: "1f4d1",
    a: "0.6"
  },
  {
    n: [
      "bookmark"
    ],
    u: "1f516",
    a: "0.6"
  },
  {
    n: [
      "label"
    ],
    u: "1f3f7-fe0f",
    a: "0.7"
  },
  {
    n: [
      "moneybag",
      "money bag"
    ],
    u: "1f4b0",
    a: "0.6"
  },
  {
    n: [
      "coin"
    ],
    u: "1fa99",
    a: "13.0"
  },
  {
    n: [
      "yen",
      "banknote with yen sign"
    ],
    u: "1f4b4",
    a: "0.6"
  },
  {
    n: [
      "dollar",
      "banknote with dollar sign"
    ],
    u: "1f4b5",
    a: "0.6"
  },
  {
    n: [
      "euro",
      "banknote with euro sign"
    ],
    u: "1f4b6",
    a: "1.0"
  },
  {
    n: [
      "pound",
      "banknote with pound sign"
    ],
    u: "1f4b7",
    a: "1.0"
  },
  {
    n: [
      "money with wings"
    ],
    u: "1f4b8",
    a: "0.6"
  },
  {
    n: [
      "credit card"
    ],
    u: "1f4b3",
    a: "0.6"
  },
  {
    n: [
      "receipt"
    ],
    u: "1f9fe",
    a: "11.0"
  },
  {
    n: [
      "chart",
      "chart with upwards trend and yen sign"
    ],
    u: "1f4b9",
    a: "0.6"
  },
  {
    n: [
      "email",
      "envelope"
    ],
    u: "2709-fe0f",
    a: "0.6"
  },
  {
    n: [
      "e-mail",
      "e-mail symbol"
    ],
    u: "1f4e7",
    a: "0.6"
  },
  {
    n: [
      "incoming envelope"
    ],
    u: "1f4e8",
    a: "0.6"
  },
  {
    n: [
      "envelope with arrow",
      "envelope with downwards arrow above"
    ],
    u: "1f4e9",
    a: "0.6"
  },
  {
    n: [
      "outbox tray"
    ],
    u: "1f4e4",
    a: "0.6"
  },
  {
    n: [
      "inbox tray"
    ],
    u: "1f4e5",
    a: "0.6"
  },
  {
    n: [
      "package"
    ],
    u: "1f4e6",
    a: "0.6"
  },
  {
    n: [
      "mailbox",
      "closed mailbox with raised flag"
    ],
    u: "1f4eb",
    a: "0.6"
  },
  {
    n: [
      "mailbox closed",
      "closed mailbox with lowered flag"
    ],
    u: "1f4ea",
    a: "0.6"
  },
  {
    n: [
      "mailbox with mail",
      "open mailbox with raised flag"
    ],
    u: "1f4ec",
    a: "0.7"
  },
  {
    n: [
      "mailbox with no mail",
      "open mailbox with lowered flag"
    ],
    u: "1f4ed",
    a: "0.7"
  },
  {
    n: [
      "postbox"
    ],
    u: "1f4ee",
    a: "0.6"
  },
  {
    n: [
      "ballot box with ballot"
    ],
    u: "1f5f3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "pencil",
      "pencil2"
    ],
    u: "270f-fe0f",
    a: "0.6"
  },
  {
    n: [
      "black nib"
    ],
    u: "2712-fe0f",
    a: "0.6"
  },
  {
    n: [
      "fountain pen",
      "lower left fountain pen"
    ],
    u: "1f58b-fe0f",
    a: "0.7"
  },
  {
    n: [
      "pen",
      "lower left ballpoint pen"
    ],
    u: "1f58a-fe0f",
    a: "0.7"
  },
  {
    n: [
      "paintbrush",
      "lower left paintbrush"
    ],
    u: "1f58c-fe0f",
    a: "0.7"
  },
  {
    n: [
      "crayon",
      "lower left crayon"
    ],
    u: "1f58d-fe0f",
    a: "0.7"
  },
  {
    n: [
      "memo",
      "pencil"
    ],
    u: "1f4dd",
    a: "0.6"
  },
  {
    n: [
      "briefcase"
    ],
    u: "1f4bc",
    a: "0.6"
  },
  {
    n: [
      "file folder"
    ],
    u: "1f4c1",
    a: "0.6"
  },
  {
    n: [
      "open file folder"
    ],
    u: "1f4c2",
    a: "0.6"
  },
  {
    n: [
      "card index dividers"
    ],
    u: "1f5c2-fe0f",
    a: "0.7"
  },
  {
    n: [
      "date",
      "calendar"
    ],
    u: "1f4c5",
    a: "0.6"
  },
  {
    n: [
      "calendar",
      "tear-off calendar"
    ],
    u: "1f4c6",
    a: "0.6"
  },
  {
    n: [
      "spiral notepad",
      "spiral note pad"
    ],
    u: "1f5d2-fe0f",
    a: "0.7"
  },
  {
    n: [
      "spiral calendar",
      "spiral calendar pad"
    ],
    u: "1f5d3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "card index"
    ],
    u: "1f4c7",
    a: "0.6"
  },
  {
    n: [
      "chart with upwards trend"
    ],
    u: "1f4c8",
    a: "0.6"
  },
  {
    n: [
      "chart with downwards trend"
    ],
    u: "1f4c9",
    a: "0.6"
  },
  {
    n: [
      "bar chart"
    ],
    u: "1f4ca",
    a: "0.6"
  },
  {
    n: [
      "clipboard"
    ],
    u: "1f4cb",
    a: "0.6"
  },
  {
    n: [
      "pushpin"
    ],
    u: "1f4cc",
    a: "0.6"
  },
  {
    n: [
      "round pushpin"
    ],
    u: "1f4cd",
    a: "0.6"
  },
  {
    n: [
      "paperclip"
    ],
    u: "1f4ce",
    a: "0.6"
  },
  {
    n: [
      "linked paperclips"
    ],
    u: "1f587-fe0f",
    a: "0.7"
  },
  {
    n: [
      "straight ruler"
    ],
    u: "1f4cf",
    a: "0.6"
  },
  {
    n: [
      "triangular ruler"
    ],
    u: "1f4d0",
    a: "0.6"
  },
  {
    n: [
      "scissors",
      "black scissors"
    ],
    u: "2702-fe0f",
    a: "0.6"
  },
  {
    n: [
      "card file box"
    ],
    u: "1f5c3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "file cabinet"
    ],
    u: "1f5c4-fe0f",
    a: "0.7"
  },
  {
    n: [
      "wastebasket"
    ],
    u: "1f5d1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "lock"
    ],
    u: "1f512",
    a: "0.6"
  },
  {
    n: [
      "unlock",
      "open lock"
    ],
    u: "1f513",
    a: "0.6"
  },
  {
    n: [
      "lock with ink pen"
    ],
    u: "1f50f",
    a: "0.6"
  },
  {
    n: [
      "closed lock with key"
    ],
    u: "1f510",
    a: "0.6"
  },
  {
    n: [
      "key"
    ],
    u: "1f511",
    a: "0.6"
  },
  {
    n: [
      "old key"
    ],
    u: "1f5dd-fe0f",
    a: "0.7"
  },
  {
    n: [
      "hammer"
    ],
    u: "1f528",
    a: "0.6"
  },
  {
    n: [
      "axe"
    ],
    u: "1fa93",
    a: "12.0"
  },
  {
    n: [
      "pick"
    ],
    u: "26cf-fe0f",
    a: "0.7"
  },
  {
    n: [
      "hammer and pick"
    ],
    u: "2692-fe0f",
    a: "1.0"
  },
  {
    n: [
      "hammer and wrench"
    ],
    u: "1f6e0-fe0f",
    a: "0.7"
  },
  {
    n: [
      "dagger",
      "dagger knife"
    ],
    u: "1f5e1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "crossed swords"
    ],
    u: "2694-fe0f",
    a: "1.0"
  },
  {
    n: [
      "bomb"
    ],
    u: "1f4a3",
    a: "0.6"
  },
  {
    n: [
      "boomerang"
    ],
    u: "1fa83",
    a: "13.0"
  },
  {
    n: [
      "bow and arrow"
    ],
    u: "1f3f9",
    a: "1.0"
  },
  {
    n: [
      "shield"
    ],
    u: "1f6e1-fe0f",
    a: "0.7"
  },
  {
    n: [
      "carpentry saw"
    ],
    u: "1fa9a",
    a: "13.0"
  },
  {
    n: [
      "wrench"
    ],
    u: "1f527",
    a: "0.6"
  },
  {
    n: [
      "screwdriver"
    ],
    u: "1fa9b",
    a: "13.0"
  },
  {
    n: [
      "nut and bolt"
    ],
    u: "1f529",
    a: "0.6"
  },
  {
    n: [
      "gear"
    ],
    u: "2699-fe0f",
    a: "1.0"
  },
  {
    n: [
      "clamp",
      "compression"
    ],
    u: "1f5dc-fe0f",
    a: "0.7"
  },
  {
    n: [
      "scales",
      "balance scale"
    ],
    u: "2696-fe0f",
    a: "1.0"
  },
  {
    n: [
      "probing cane"
    ],
    u: "1f9af",
    a: "12.0"
  },
  {
    n: [
      "link",
      "link symbol"
    ],
    u: "1f517",
    a: "0.6"
  },
  {
    n: [
      "broken chain"
    ],
    u: "26d3-fe0f-200d-1f4a5",
    a: "15.1"
  },
  {
    n: [
      "chains"
    ],
    u: "26d3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "hook"
    ],
    u: "1fa9d",
    a: "13.0"
  },
  {
    n: [
      "toolbox"
    ],
    u: "1f9f0",
    a: "11.0"
  },
  {
    n: [
      "magnet"
    ],
    u: "1f9f2",
    a: "11.0"
  },
  {
    n: [
      "ladder"
    ],
    u: "1fa9c",
    a: "13.0"
  },
  {
    n: [
      "alembic"
    ],
    u: "2697-fe0f",
    a: "1.0"
  },
  {
    n: [
      "test tube"
    ],
    u: "1f9ea",
    a: "11.0"
  },
  {
    n: [
      "petri dish"
    ],
    u: "1f9eb",
    a: "11.0"
  },
  {
    n: [
      "dna",
      "dna double helix"
    ],
    u: "1f9ec",
    a: "11.0"
  },
  {
    n: [
      "microscope"
    ],
    u: "1f52c",
    a: "1.0"
  },
  {
    n: [
      "telescope"
    ],
    u: "1f52d",
    a: "1.0"
  },
  {
    n: [
      "satellite antenna"
    ],
    u: "1f4e1",
    a: "0.6"
  },
  {
    n: [
      "syringe"
    ],
    u: "1f489",
    a: "0.6"
  },
  {
    n: [
      "drop of blood"
    ],
    u: "1fa78",
    a: "12.0"
  },
  {
    n: [
      "pill"
    ],
    u: "1f48a",
    a: "0.6"
  },
  {
    n: [
      "adhesive bandage"
    ],
    u: "1fa79",
    a: "12.0"
  },
  {
    n: [
      "crutch"
    ],
    u: "1fa7c",
    a: "14.0"
  },
  {
    n: [
      "stethoscope"
    ],
    u: "1fa7a",
    a: "12.0"
  },
  {
    n: [
      "x-ray"
    ],
    u: "1fa7b",
    a: "14.0"
  },
  {
    n: [
      "door"
    ],
    u: "1f6aa",
    a: "0.6"
  },
  {
    n: [
      "elevator"
    ],
    u: "1f6d7",
    a: "13.0"
  },
  {
    n: [
      "mirror"
    ],
    u: "1fa9e",
    a: "13.0"
  },
  {
    n: [
      "window"
    ],
    u: "1fa9f",
    a: "13.0"
  },
  {
    n: [
      "bed"
    ],
    u: "1f6cf-fe0f",
    a: "0.7"
  },
  {
    n: [
      "couch and lamp"
    ],
    u: "1f6cb-fe0f",
    a: "0.7"
  },
  {
    n: [
      "chair"
    ],
    u: "1fa91",
    a: "12.0"
  },
  {
    n: [
      "toilet"
    ],
    u: "1f6bd",
    a: "0.6"
  },
  {
    n: [
      "plunger"
    ],
    u: "1faa0",
    a: "13.0"
  },
  {
    n: [
      "shower"
    ],
    u: "1f6bf",
    a: "1.0"
  },
  {
    n: [
      "bathtub"
    ],
    u: "1f6c1",
    a: "1.0"
  },
  {
    n: [
      "mouse trap"
    ],
    u: "1faa4",
    a: "13.0"
  },
  {
    n: [
      "razor"
    ],
    u: "1fa92",
    a: "12.0"
  },
  {
    n: [
      "lotion bottle"
    ],
    u: "1f9f4",
    a: "11.0"
  },
  {
    n: [
      "safety pin"
    ],
    u: "1f9f7",
    a: "11.0"
  },
  {
    n: [
      "broom"
    ],
    u: "1f9f9",
    a: "11.0"
  },
  {
    n: [
      "basket"
    ],
    u: "1f9fa",
    a: "11.0"
  },
  {
    n: [
      "roll of paper"
    ],
    u: "1f9fb",
    a: "11.0"
  },
  {
    n: [
      "bucket"
    ],
    u: "1faa3",
    a: "13.0"
  },
  {
    n: [
      "soap",
      "bar of soap"
    ],
    u: "1f9fc",
    a: "11.0"
  },
  {
    n: [
      "bubbles"
    ],
    u: "1fae7",
    a: "14.0"
  },
  {
    n: [
      "toothbrush"
    ],
    u: "1faa5",
    a: "13.0"
  },
  {
    n: [
      "sponge"
    ],
    u: "1f9fd",
    a: "11.0"
  },
  {
    n: [
      "fire extinguisher"
    ],
    u: "1f9ef",
    a: "11.0"
  },
  {
    n: [
      "shopping trolley"
    ],
    u: "1f6d2",
    a: "3.0"
  },
  {
    n: [
      "smoking",
      "smoking symbol"
    ],
    u: "1f6ac",
    a: "0.6"
  },
  {
    n: [
      "coffin"
    ],
    u: "26b0-fe0f",
    a: "1.0"
  },
  {
    n: [
      "headstone"
    ],
    u: "1faa6",
    a: "13.0"
  },
  {
    n: [
      "funeral urn"
    ],
    u: "26b1-fe0f",
    a: "1.0"
  },
  {
    n: [
      "nazar amulet"
    ],
    u: "1f9ff",
    a: "11.0"
  },
  {
    n: [
      "hamsa"
    ],
    u: "1faac",
    a: "14.0"
  },
  {
    n: [
      "moyai"
    ],
    u: "1f5ff",
    a: "0.6"
  },
  {
    n: [
      "placard"
    ],
    u: "1faa7",
    a: "13.0"
  },
  {
    n: [
      "identification card"
    ],
    u: "1faaa",
    a: "14.0"
  }
];
var symbols = [
  {
    n: [
      "atm",
      "automated teller machine"
    ],
    u: "1f3e7",
    a: "0.6"
  },
  {
    n: [
      "put litter in its place",
      "put litter in its place symbol"
    ],
    u: "1f6ae",
    a: "1.0"
  },
  {
    n: [
      "potable water",
      "potable water symbol"
    ],
    u: "1f6b0",
    a: "1.0"
  },
  {
    n: [
      "wheelchair",
      "wheelchair symbol"
    ],
    u: "267f",
    a: "0.6"
  },
  {
    n: [
      "mens",
      "mens symbol"
    ],
    u: "1f6b9",
    a: "0.6"
  },
  {
    n: [
      "womens",
      "womens symbol"
    ],
    u: "1f6ba",
    a: "0.6"
  },
  {
    n: [
      "restroom"
    ],
    u: "1f6bb",
    a: "0.6"
  },
  {
    n: [
      "baby symbol"
    ],
    u: "1f6bc",
    a: "0.6"
  },
  {
    n: [
      "wc",
      "water closet"
    ],
    u: "1f6be",
    a: "0.6"
  },
  {
    n: [
      "passport control"
    ],
    u: "1f6c2",
    a: "1.0"
  },
  {
    n: [
      "customs"
    ],
    u: "1f6c3",
    a: "1.0"
  },
  {
    n: [
      "baggage claim"
    ],
    u: "1f6c4",
    a: "1.0"
  },
  {
    n: [
      "left luggage"
    ],
    u: "1f6c5",
    a: "1.0"
  },
  {
    n: [
      "warning",
      "warning sign"
    ],
    u: "26a0-fe0f",
    a: "0.6"
  },
  {
    n: [
      "children crossing"
    ],
    u: "1f6b8",
    a: "1.0"
  },
  {
    n: [
      "no entry"
    ],
    u: "26d4",
    a: "0.6"
  },
  {
    n: [
      "no entry sign"
    ],
    u: "1f6ab",
    a: "0.6"
  },
  {
    n: [
      "no bicycles"
    ],
    u: "1f6b3",
    a: "1.0"
  },
  {
    n: [
      "no smoking",
      "no smoking symbol"
    ],
    u: "1f6ad",
    a: "0.6"
  },
  {
    n: [
      "do not litter",
      "do not litter symbol"
    ],
    u: "1f6af",
    a: "1.0"
  },
  {
    n: [
      "non-potable water",
      "non-potable water symbol"
    ],
    u: "1f6b1",
    a: "1.0"
  },
  {
    n: [
      "no pedestrians"
    ],
    u: "1f6b7",
    a: "1.0"
  },
  {
    n: [
      "no mobile phones"
    ],
    u: "1f4f5",
    a: "1.0"
  },
  {
    n: [
      "underage",
      "no one under eighteen symbol"
    ],
    u: "1f51e",
    a: "0.6"
  },
  {
    n: [
      "radioactive",
      "radioactive sign"
    ],
    u: "2622-fe0f",
    a: "1.0"
  },
  {
    n: [
      "biohazard",
      "biohazard sign"
    ],
    u: "2623-fe0f",
    a: "1.0"
  },
  {
    n: [
      "arrow up",
      "upwards black arrow"
    ],
    u: "2b06-fe0f",
    a: "0.6"
  },
  {
    n: [
      "north east arrow",
      "arrow upper right"
    ],
    u: "2197-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow right",
      "black rightwards arrow"
    ],
    u: "27a1-fe0f",
    a: "0.6"
  },
  {
    n: [
      "south east arrow",
      "arrow lower right"
    ],
    u: "2198-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow down",
      "downwards black arrow"
    ],
    u: "2b07-fe0f",
    a: "0.6"
  },
  {
    n: [
      "south west arrow",
      "arrow lower left"
    ],
    u: "2199-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow left",
      "leftwards black arrow"
    ],
    u: "2b05-fe0f",
    a: "0.6"
  },
  {
    n: [
      "north west arrow",
      "arrow upper left"
    ],
    u: "2196-fe0f",
    a: "0.6"
  },
  {
    n: [
      "up down arrow",
      "arrow up down"
    ],
    u: "2195-fe0f",
    a: "0.6"
  },
  {
    n: [
      "left right arrow"
    ],
    u: "2194-fe0f",
    a: "0.6"
  },
  {
    n: [
      "leftwards arrow with hook"
    ],
    u: "21a9-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow right hook",
      "rightwards arrow with hook"
    ],
    u: "21aa-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow heading up",
      "arrow pointing rightwards then curving upwards"
    ],
    u: "2934-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrow heading down",
      "arrow pointing rightwards then curving downwards"
    ],
    u: "2935-fe0f",
    a: "0.6"
  },
  {
    n: [
      "arrows clockwise",
      "clockwise downwards and upwards open circle arrows"
    ],
    u: "1f503",
    a: "0.6"
  },
  {
    n: [
      "arrows counterclockwise",
      "anticlockwise downwards and upwards open circle arrows"
    ],
    u: "1f504",
    a: "1.0"
  },
  {
    n: [
      "back",
      "back with leftwards arrow above"
    ],
    u: "1f519",
    a: "0.6"
  },
  {
    n: [
      "end",
      "end with leftwards arrow above"
    ],
    u: "1f51a",
    a: "0.6"
  },
  {
    n: [
      "on",
      "on with exclamation mark with left right arrow above"
    ],
    u: "1f51b",
    a: "0.6"
  },
  {
    n: [
      "soon",
      "soon with rightwards arrow above"
    ],
    u: "1f51c",
    a: "0.6"
  },
  {
    n: [
      "top",
      "top with upwards arrow above"
    ],
    u: "1f51d",
    a: "0.6"
  },
  {
    n: [
      "place of worship"
    ],
    u: "1f6d0",
    a: "1.0"
  },
  {
    n: [
      "atom symbol"
    ],
    u: "269b-fe0f",
    a: "1.0"
  },
  {
    n: [
      "om",
      "om symbol"
    ],
    u: "1f549-fe0f",
    a: "0.7"
  },
  {
    n: [
      "star of david"
    ],
    u: "2721-fe0f",
    a: "0.7"
  },
  {
    n: [
      "wheel of dharma"
    ],
    u: "2638-fe0f",
    a: "0.7"
  },
  {
    n: [
      "yin yang"
    ],
    u: "262f-fe0f",
    a: "0.7"
  },
  {
    n: [
      "latin cross"
    ],
    u: "271d-fe0f",
    a: "0.7"
  },
  {
    n: [
      "orthodox cross"
    ],
    u: "2626-fe0f",
    a: "1.0"
  },
  {
    n: [
      "star and crescent"
    ],
    u: "262a-fe0f",
    a: "0.7"
  },
  {
    n: [
      "peace symbol"
    ],
    u: "262e-fe0f",
    a: "1.0"
  },
  {
    n: [
      "menorah with nine branches"
    ],
    u: "1f54e",
    a: "1.0"
  },
  {
    n: [
      "six pointed star",
      "six pointed star with middle dot"
    ],
    u: "1f52f",
    a: "0.6"
  },
  {
    n: [
      "khanda"
    ],
    u: "1faaf",
    a: "15.0"
  },
  {
    n: [
      "aries"
    ],
    u: "2648",
    a: "0.6"
  },
  {
    n: [
      "taurus"
    ],
    u: "2649",
    a: "0.6"
  },
  {
    n: [
      "gemini"
    ],
    u: "264a",
    a: "0.6"
  },
  {
    n: [
      "cancer"
    ],
    u: "264b",
    a: "0.6"
  },
  {
    n: [
      "leo"
    ],
    u: "264c",
    a: "0.6"
  },
  {
    n: [
      "virgo"
    ],
    u: "264d",
    a: "0.6"
  },
  {
    n: [
      "libra"
    ],
    u: "264e",
    a: "0.6"
  },
  {
    n: [
      "scorpius"
    ],
    u: "264f",
    a: "0.6"
  },
  {
    n: [
      "sagittarius"
    ],
    u: "2650",
    a: "0.6"
  },
  {
    n: [
      "capricorn"
    ],
    u: "2651",
    a: "0.6"
  },
  {
    n: [
      "aquarius"
    ],
    u: "2652",
    a: "0.6"
  },
  {
    n: [
      "pisces"
    ],
    u: "2653",
    a: "0.6"
  },
  {
    n: [
      "ophiuchus"
    ],
    u: "26ce",
    a: "0.6"
  },
  {
    n: [
      "twisted rightwards arrows"
    ],
    u: "1f500",
    a: "1.0"
  },
  {
    n: [
      "repeat",
      "clockwise rightwards and leftwards open circle arrows"
    ],
    u: "1f501",
    a: "1.0"
  },
  {
    n: [
      "repeat one",
      "clockwise rightwards and leftwards open circle arrows with circled one overlay"
    ],
    u: "1f502",
    a: "1.0"
  },
  {
    n: [
      "arrow forward",
      "black right-pointing triangle"
    ],
    u: "25b6-fe0f",
    a: "0.6"
  },
  {
    n: [
      "fast forward",
      "black right-pointing double triangle"
    ],
    u: "23e9",
    a: "0.6"
  },
  {
    n: [
      "next track button",
      "black right pointing double triangle with vertical bar"
    ],
    u: "23ed-fe0f",
    a: "0.7"
  },
  {
    n: [
      "play or pause button",
      "black right pointing triangle with double vertical bar"
    ],
    u: "23ef-fe0f",
    a: "1.0"
  },
  {
    n: [
      "arrow backward",
      "black left-pointing triangle"
    ],
    u: "25c0-fe0f",
    a: "0.6"
  },
  {
    n: [
      "rewind",
      "black left-pointing double triangle"
    ],
    u: "23ea",
    a: "0.6"
  },
  {
    n: [
      "last track button",
      "black left pointing double triangle with vertical bar"
    ],
    u: "23ee-fe0f",
    a: "0.7"
  },
  {
    n: [
      "arrow up small",
      "up-pointing small red triangle"
    ],
    u: "1f53c",
    a: "0.6"
  },
  {
    n: [
      "arrow double up",
      "black up-pointing double triangle"
    ],
    u: "23eb",
    a: "0.6"
  },
  {
    n: [
      "arrow down small",
      "down-pointing small red triangle"
    ],
    u: "1f53d",
    a: "0.6"
  },
  {
    n: [
      "arrow double down",
      "black down-pointing double triangle"
    ],
    u: "23ec",
    a: "0.6"
  },
  {
    n: [
      "pause button",
      "double vertical bar"
    ],
    u: "23f8-fe0f",
    a: "0.7"
  },
  {
    n: [
      "stop button",
      "black square for stop"
    ],
    u: "23f9-fe0f",
    a: "0.7"
  },
  {
    n: [
      "record button",
      "black circle for record"
    ],
    u: "23fa-fe0f",
    a: "0.7"
  },
  {
    n: [
      "eject",
      "eject button"
    ],
    u: "23cf-fe0f",
    a: "1.0"
  },
  {
    n: [
      "cinema"
    ],
    u: "1f3a6",
    a: "0.6"
  },
  {
    n: [
      "low brightness",
      "low brightness symbol"
    ],
    u: "1f505",
    a: "1.0"
  },
  {
    n: [
      "high brightness",
      "high brightness symbol"
    ],
    u: "1f506",
    a: "1.0"
  },
  {
    n: [
      "signal strength",
      "antenna with bars"
    ],
    u: "1f4f6",
    a: "0.6"
  },
  {
    n: [
      "wireless"
    ],
    u: "1f6dc",
    a: "15.0"
  },
  {
    n: [
      "vibration mode"
    ],
    u: "1f4f3",
    a: "0.6"
  },
  {
    n: [
      "mobile phone off"
    ],
    u: "1f4f4",
    a: "0.6"
  },
  {
    n: [
      "female sign"
    ],
    u: "2640-fe0f",
    a: "4.0"
  },
  {
    n: [
      "male sign"
    ],
    u: "2642-fe0f",
    a: "4.0"
  },
  {
    n: [
      "transgender symbol"
    ],
    u: "26a7-fe0f",
    a: "13.0"
  },
  {
    n: [
      "heavy multiplication x"
    ],
    u: "2716-fe0f",
    a: "0.6"
  },
  {
    n: [
      "heavy plus sign"
    ],
    u: "2795",
    a: "0.6"
  },
  {
    n: [
      "heavy minus sign"
    ],
    u: "2796",
    a: "0.6"
  },
  {
    n: [
      "heavy division sign"
    ],
    u: "2797",
    a: "0.6"
  },
  {
    n: [
      "heavy equals sign"
    ],
    u: "1f7f0",
    a: "14.0"
  },
  {
    n: [
      "infinity"
    ],
    u: "267e-fe0f",
    a: "11.0"
  },
  {
    n: [
      "bangbang",
      "double exclamation mark"
    ],
    u: "203c-fe0f",
    a: "0.6"
  },
  {
    n: [
      "interrobang",
      "exclamation question mark"
    ],
    u: "2049-fe0f",
    a: "0.6"
  },
  {
    n: [
      "question",
      "black question mark ornament"
    ],
    u: "2753",
    a: "0.6"
  },
  {
    n: [
      "grey question",
      "white question mark ornament"
    ],
    u: "2754",
    a: "0.6"
  },
  {
    n: [
      "grey exclamation",
      "white exclamation mark ornament"
    ],
    u: "2755",
    a: "0.6"
  },
  {
    n: [
      "exclamation",
      "heavy exclamation mark",
      "heavy exclamation mark symbol"
    ],
    u: "2757",
    a: "0.6"
  },
  {
    n: [
      "wavy dash"
    ],
    u: "3030-fe0f",
    a: "0.6"
  },
  {
    n: [
      "currency exchange"
    ],
    u: "1f4b1",
    a: "0.6"
  },
  {
    n: [
      "heavy dollar sign"
    ],
    u: "1f4b2",
    a: "0.6"
  },
  {
    n: [
      "medical symbol",
      "staff of aesculapius"
    ],
    u: "2695-fe0f",
    a: "4.0"
  },
  {
    n: [
      "recycle",
      "black universal recycling symbol"
    ],
    u: "267b-fe0f",
    a: "0.6"
  },
  {
    n: [
      "fleur-de-lis",
      "fleur de lis"
    ],
    u: "269c-fe0f",
    a: "1.0"
  },
  {
    n: [
      "trident",
      "trident emblem"
    ],
    u: "1f531",
    a: "0.6"
  },
  {
    n: [
      "name badge"
    ],
    u: "1f4db",
    a: "0.6"
  },
  {
    n: [
      "beginner",
      "japanese symbol for beginner"
    ],
    u: "1f530",
    a: "0.6"
  },
  {
    n: [
      "o",
      "heavy large circle"
    ],
    u: "2b55",
    a: "0.6"
  },
  {
    n: [
      "white check mark",
      "white heavy check mark"
    ],
    u: "2705",
    a: "0.6"
  },
  {
    n: [
      "ballot box with check"
    ],
    u: "2611-fe0f",
    a: "0.6"
  },
  {
    n: [
      "heavy check mark"
    ],
    u: "2714-fe0f",
    a: "0.6"
  },
  {
    n: [
      "x",
      "cross mark"
    ],
    u: "274c",
    a: "0.6"
  },
  {
    n: [
      "negative squared cross mark"
    ],
    u: "274e",
    a: "0.6"
  },
  {
    n: [
      "curly loop"
    ],
    u: "27b0",
    a: "0.6"
  },
  {
    n: [
      "loop",
      "double curly loop"
    ],
    u: "27bf",
    a: "1.0"
  },
  {
    n: [
      "part alternation mark"
    ],
    u: "303d-fe0f",
    a: "0.6"
  },
  {
    n: [
      "eight spoked asterisk"
    ],
    u: "2733-fe0f",
    a: "0.6"
  },
  {
    n: [
      "eight pointed black star"
    ],
    u: "2734-fe0f",
    a: "0.6"
  },
  {
    n: [
      "sparkle"
    ],
    u: "2747-fe0f",
    a: "0.6"
  },
  {
    n: [
      "copyright",
      "copyright sign"
    ],
    u: "00a9-fe0f",
    a: "0.6"
  },
  {
    n: [
      "registered",
      "registered sign"
    ],
    u: "00ae-fe0f",
    a: "0.6"
  },
  {
    n: [
      "tm",
      "trade mark sign"
    ],
    u: "2122-fe0f",
    a: "0.6"
  },
  {
    n: [
      "hash",
      "hash key"
    ],
    u: "0023-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "keycap: *",
      "keycap star"
    ],
    u: "002a-fe0f-20e3",
    a: "2.0"
  },
  {
    n: [
      "zero",
      "keycap 0"
    ],
    u: "0030-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "one",
      "keycap 1"
    ],
    u: "0031-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "two",
      "keycap 2"
    ],
    u: "0032-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "three",
      "keycap 3"
    ],
    u: "0033-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "four",
      "keycap 4"
    ],
    u: "0034-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "five",
      "keycap 5"
    ],
    u: "0035-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "six",
      "keycap 6"
    ],
    u: "0036-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "seven",
      "keycap 7"
    ],
    u: "0037-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "eight",
      "keycap 8"
    ],
    u: "0038-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "nine",
      "keycap 9"
    ],
    u: "0039-fe0f-20e3",
    a: "0.6"
  },
  {
    n: [
      "keycap ten"
    ],
    u: "1f51f",
    a: "0.6"
  },
  {
    n: [
      "capital abcd",
      "input symbol for latin capital letters"
    ],
    u: "1f520",
    a: "0.6"
  },
  {
    n: [
      "abcd",
      "input symbol for latin small letters"
    ],
    u: "1f521",
    a: "0.6"
  },
  {
    n: [
      "1234",
      "input symbol for numbers"
    ],
    u: "1f522",
    a: "0.6"
  },
  {
    n: [
      "symbols",
      "input symbol for symbols"
    ],
    u: "1f523",
    a: "0.6"
  },
  {
    n: [
      "abc",
      "input symbol for latin letters"
    ],
    u: "1f524",
    a: "0.6"
  },
  {
    n: [
      "a",
      "negative squared latin capital letter a"
    ],
    u: "1f170-fe0f",
    a: "0.6"
  },
  {
    n: [
      "ab",
      "negative squared ab"
    ],
    u: "1f18e",
    a: "0.6"
  },
  {
    n: [
      "b",
      "negative squared latin capital letter b"
    ],
    u: "1f171-fe0f",
    a: "0.6"
  },
  {
    n: [
      "cl",
      "squared cl"
    ],
    u: "1f191",
    a: "0.6"
  },
  {
    n: [
      "cool",
      "squared cool"
    ],
    u: "1f192",
    a: "0.6"
  },
  {
    n: [
      "free",
      "squared free"
    ],
    u: "1f193",
    a: "0.6"
  },
  {
    n: [
      "information source"
    ],
    u: "2139-fe0f",
    a: "0.6"
  },
  {
    n: [
      "id",
      "squared id"
    ],
    u: "1f194",
    a: "0.6"
  },
  {
    n: [
      "m",
      "circled latin capital letter m"
    ],
    u: "24c2-fe0f",
    a: "0.6"
  },
  {
    n: [
      "new",
      "squared new"
    ],
    u: "1f195",
    a: "0.6"
  },
  {
    n: [
      "ng",
      "squared ng"
    ],
    u: "1f196",
    a: "0.6"
  },
  {
    n: [
      "o2",
      "negative squared latin capital letter o"
    ],
    u: "1f17e-fe0f",
    a: "0.6"
  },
  {
    n: [
      "ok",
      "squared ok"
    ],
    u: "1f197",
    a: "0.6"
  },
  {
    n: [
      "parking",
      "negative squared latin capital letter p"
    ],
    u: "1f17f-fe0f",
    a: "0.6"
  },
  {
    n: [
      "sos",
      "squared sos"
    ],
    u: "1f198",
    a: "0.6"
  },
  {
    n: [
      "up",
      "squared up with exclamation mark"
    ],
    u: "1f199",
    a: "0.6"
  },
  {
    n: [
      "vs",
      "squared vs"
    ],
    u: "1f19a",
    a: "0.6"
  },
  {
    n: [
      "koko",
      "squared katakana koko"
    ],
    u: "1f201",
    a: "0.6"
  },
  {
    n: [
      "sa",
      "squared katakana sa"
    ],
    u: "1f202-fe0f",
    a: "0.6"
  },
  {
    n: [
      "u6708",
      "squared cjk unified ideograph-6708"
    ],
    u: "1f237-fe0f",
    a: "0.6"
  },
  {
    n: [
      "u6709",
      "squared cjk unified ideograph-6709"
    ],
    u: "1f236",
    a: "0.6"
  },
  {
    n: [
      "u6307",
      "squared cjk unified ideograph-6307"
    ],
    u: "1f22f",
    a: "0.6"
  },
  {
    n: [
      "ideograph advantage",
      "circled ideograph advantage"
    ],
    u: "1f250",
    a: "0.6"
  },
  {
    n: [
      "u5272",
      "squared cjk unified ideograph-5272"
    ],
    u: "1f239",
    a: "0.6"
  },
  {
    n: [
      "u7121",
      "squared cjk unified ideograph-7121"
    ],
    u: "1f21a",
    a: "0.6"
  },
  {
    n: [
      "u7981",
      "squared cjk unified ideograph-7981"
    ],
    u: "1f232",
    a: "0.6"
  },
  {
    n: [
      "accept",
      "circled ideograph accept"
    ],
    u: "1f251",
    a: "0.6"
  },
  {
    n: [
      "u7533",
      "squared cjk unified ideograph-7533"
    ],
    u: "1f238",
    a: "0.6"
  },
  {
    n: [
      "u5408",
      "squared cjk unified ideograph-5408"
    ],
    u: "1f234",
    a: "0.6"
  },
  {
    n: [
      "u7a7a",
      "squared cjk unified ideograph-7a7a"
    ],
    u: "1f233",
    a: "0.6"
  },
  {
    n: [
      "congratulations",
      "circled ideograph congratulation"
    ],
    u: "3297-fe0f",
    a: "0.6"
  },
  {
    n: [
      "secret",
      "circled ideograph secret"
    ],
    u: "3299-fe0f",
    a: "0.6"
  },
  {
    n: [
      "u55b6",
      "squared cjk unified ideograph-55b6"
    ],
    u: "1f23a",
    a: "0.6"
  },
  {
    n: [
      "u6e80",
      "squared cjk unified ideograph-6e80"
    ],
    u: "1f235",
    a: "0.6"
  },
  {
    n: [
      "red circle",
      "large red circle"
    ],
    u: "1f534",
    a: "0.6"
  },
  {
    n: [
      "large orange circle"
    ],
    u: "1f7e0",
    a: "12.0"
  },
  {
    n: [
      "large yellow circle"
    ],
    u: "1f7e1",
    a: "12.0"
  },
  {
    n: [
      "large green circle"
    ],
    u: "1f7e2",
    a: "12.0"
  },
  {
    n: [
      "large blue circle"
    ],
    u: "1f535",
    a: "0.6"
  },
  {
    n: [
      "large purple circle"
    ],
    u: "1f7e3",
    a: "12.0"
  },
  {
    n: [
      "large brown circle"
    ],
    u: "1f7e4",
    a: "12.0"
  },
  {
    n: [
      "black circle",
      "medium black circle"
    ],
    u: "26ab",
    a: "0.6"
  },
  {
    n: [
      "white circle",
      "medium white circle"
    ],
    u: "26aa",
    a: "0.6"
  },
  {
    n: [
      "large red square"
    ],
    u: "1f7e5",
    a: "12.0"
  },
  {
    n: [
      "large orange square"
    ],
    u: "1f7e7",
    a: "12.0"
  },
  {
    n: [
      "large yellow square"
    ],
    u: "1f7e8",
    a: "12.0"
  },
  {
    n: [
      "large green square"
    ],
    u: "1f7e9",
    a: "12.0"
  },
  {
    n: [
      "large blue square"
    ],
    u: "1f7e6",
    a: "12.0"
  },
  {
    n: [
      "large purple square"
    ],
    u: "1f7ea",
    a: "12.0"
  },
  {
    n: [
      "large brown square"
    ],
    u: "1f7eb",
    a: "12.0"
  },
  {
    n: [
      "black large square"
    ],
    u: "2b1b",
    a: "0.6"
  },
  {
    n: [
      "white large square"
    ],
    u: "2b1c",
    a: "0.6"
  },
  {
    n: [
      "black medium square"
    ],
    u: "25fc-fe0f",
    a: "0.6"
  },
  {
    n: [
      "white medium square"
    ],
    u: "25fb-fe0f",
    a: "0.6"
  },
  {
    n: [
      "black medium small square"
    ],
    u: "25fe",
    a: "0.6"
  },
  {
    n: [
      "white medium small square"
    ],
    u: "25fd",
    a: "0.6"
  },
  {
    n: [
      "black small square"
    ],
    u: "25aa-fe0f",
    a: "0.6"
  },
  {
    n: [
      "white small square"
    ],
    u: "25ab-fe0f",
    a: "0.6"
  },
  {
    n: [
      "large orange diamond"
    ],
    u: "1f536",
    a: "0.6"
  },
  {
    n: [
      "large blue diamond"
    ],
    u: "1f537",
    a: "0.6"
  },
  {
    n: [
      "small orange diamond"
    ],
    u: "1f538",
    a: "0.6"
  },
  {
    n: [
      "small blue diamond"
    ],
    u: "1f539",
    a: "0.6"
  },
  {
    n: [
      "small red triangle",
      "up-pointing red triangle"
    ],
    u: "1f53a",
    a: "0.6"
  },
  {
    n: [
      "small red triangle down",
      "down-pointing red triangle"
    ],
    u: "1f53b",
    a: "0.6"
  },
  {
    n: [
      "diamond shape with a dot inside"
    ],
    u: "1f4a0",
    a: "0.6"
  },
  {
    n: [
      "radio button"
    ],
    u: "1f518",
    a: "0.6"
  },
  {
    n: [
      "white square button"
    ],
    u: "1f533",
    a: "0.6"
  },
  {
    n: [
      "black square button"
    ],
    u: "1f532",
    a: "0.6"
  }
];
var flags = [
  {
    n: [
      "chequered flag",
      "checkered flag"
    ],
    u: "1f3c1",
    a: "0.6"
  },
  {
    n: [
      "triangular flag on post"
    ],
    u: "1f6a9",
    a: "0.6"
  },
  {
    n: [
      "crossed flags"
    ],
    u: "1f38c",
    a: "0.6"
  },
  {
    n: [
      "waving black flag"
    ],
    u: "1f3f4",
    a: "1.0"
  },
  {
    n: [
      "white flag",
      "waving white flag"
    ],
    u: "1f3f3-fe0f",
    a: "0.7"
  },
  {
    n: [
      "rainbow flag",
      "rainbow-flag"
    ],
    u: "1f3f3-fe0f-200d-1f308",
    a: "4.0"
  },
  {
    n: [
      "transgender flag"
    ],
    u: "1f3f3-fe0f-200d-26a7-fe0f",
    a: "13.0"
  },
  {
    n: [
      "pirate flag"
    ],
    u: "1f3f4-200d-2620-fe0f",
    a: "11.0"
  },
  {
    n: [
      "flag-ac",
      "ascension island flag"
    ],
    u: "1f1e6-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-ad",
      "andorra flag"
    ],
    u: "1f1e6-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-ae",
      "united arab emirates flag"
    ],
    u: "1f1e6-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-af",
      "afghanistan flag"
    ],
    u: "1f1e6-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-ag",
      "antigua & barbuda flag"
    ],
    u: "1f1e6-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-ai",
      "anguilla flag"
    ],
    u: "1f1e6-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-al",
      "albania flag"
    ],
    u: "1f1e6-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-am",
      "armenia flag"
    ],
    u: "1f1e6-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-ao",
      "angola flag"
    ],
    u: "1f1e6-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-aq",
      "antarctica flag"
    ],
    u: "1f1e6-1f1f6",
    a: "2.0"
  },
  {
    n: [
      "flag-ar",
      "argentina flag"
    ],
    u: "1f1e6-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-as",
      "american samoa flag"
    ],
    u: "1f1e6-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-at",
      "austria flag"
    ],
    u: "1f1e6-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-au",
      "australia flag"
    ],
    u: "1f1e6-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-aw",
      "aruba flag"
    ],
    u: "1f1e6-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-ax",
      "\xE5land islands flag"
    ],
    u: "1f1e6-1f1fd",
    a: "2.0"
  },
  {
    n: [
      "flag-az",
      "azerbaijan flag"
    ],
    u: "1f1e6-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-ba",
      "bosnia & herzegovina flag"
    ],
    u: "1f1e7-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-bb",
      "barbados flag"
    ],
    u: "1f1e7-1f1e7",
    a: "2.0"
  },
  {
    n: [
      "flag-bd",
      "bangladesh flag"
    ],
    u: "1f1e7-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-be",
      "belgium flag"
    ],
    u: "1f1e7-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-bf",
      "burkina faso flag"
    ],
    u: "1f1e7-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-bg",
      "bulgaria flag"
    ],
    u: "1f1e7-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-bh",
      "bahrain flag"
    ],
    u: "1f1e7-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-bi",
      "burundi flag"
    ],
    u: "1f1e7-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-bj",
      "benin flag"
    ],
    u: "1f1e7-1f1ef",
    a: "2.0"
  },
  {
    n: [
      "flag-bl",
      "st. barth\xE9lemy flag"
    ],
    u: "1f1e7-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-bm",
      "bermuda flag"
    ],
    u: "1f1e7-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-bn",
      "brunei flag"
    ],
    u: "1f1e7-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-bo",
      "bolivia flag"
    ],
    u: "1f1e7-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-bq",
      "caribbean netherlands flag"
    ],
    u: "1f1e7-1f1f6",
    a: "2.0"
  },
  {
    n: [
      "flag-br",
      "brazil flag"
    ],
    u: "1f1e7-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-bs",
      "bahamas flag"
    ],
    u: "1f1e7-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-bt",
      "bhutan flag"
    ],
    u: "1f1e7-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-bv",
      "bouvet island flag"
    ],
    u: "1f1e7-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-bw",
      "botswana flag"
    ],
    u: "1f1e7-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-by",
      "belarus flag"
    ],
    u: "1f1e7-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-bz",
      "belize flag"
    ],
    u: "1f1e7-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-ca",
      "canada flag"
    ],
    u: "1f1e8-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-cc",
      "cocos (keeling) islands flag"
    ],
    u: "1f1e8-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-cd",
      "congo - kinshasa flag"
    ],
    u: "1f1e8-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-cf",
      "central african republic flag"
    ],
    u: "1f1e8-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-cg",
      "congo - brazzaville flag"
    ],
    u: "1f1e8-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-ch",
      "switzerland flag"
    ],
    u: "1f1e8-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-ci",
      "c\xF4te d\u2019ivoire flag"
    ],
    u: "1f1e8-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-ck",
      "cook islands flag"
    ],
    u: "1f1e8-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-cl",
      "chile flag"
    ],
    u: "1f1e8-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-cm",
      "cameroon flag"
    ],
    u: "1f1e8-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "cn",
      "flag-cn",
      "china flag"
    ],
    u: "1f1e8-1f1f3",
    a: "0.6"
  },
  {
    n: [
      "flag-co",
      "colombia flag"
    ],
    u: "1f1e8-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-cp",
      "clipperton island flag"
    ],
    u: "1f1e8-1f1f5",
    a: "2.0"
  },
  {
    n: [
      "flag-cr",
      "costa rica flag"
    ],
    u: "1f1e8-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-cu",
      "cuba flag"
    ],
    u: "1f1e8-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-cv",
      "cape verde flag"
    ],
    u: "1f1e8-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-cw",
      "cura\xE7ao flag"
    ],
    u: "1f1e8-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-cx",
      "christmas island flag"
    ],
    u: "1f1e8-1f1fd",
    a: "2.0"
  },
  {
    n: [
      "flag-cy",
      "cyprus flag"
    ],
    u: "1f1e8-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-cz",
      "czechia flag"
    ],
    u: "1f1e8-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "de",
      "flag-de",
      "germany flag"
    ],
    u: "1f1e9-1f1ea",
    a: "0.6"
  },
  {
    n: [
      "flag-dg",
      "diego garcia flag"
    ],
    u: "1f1e9-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-dj",
      "djibouti flag"
    ],
    u: "1f1e9-1f1ef",
    a: "2.0"
  },
  {
    n: [
      "flag-dk",
      "denmark flag"
    ],
    u: "1f1e9-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-dm",
      "dominica flag"
    ],
    u: "1f1e9-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-do",
      "dominican republic flag"
    ],
    u: "1f1e9-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-dz",
      "algeria flag"
    ],
    u: "1f1e9-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-ea",
      "ceuta & melilla flag"
    ],
    u: "1f1ea-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-ec",
      "ecuador flag"
    ],
    u: "1f1ea-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-ee",
      "estonia flag"
    ],
    u: "1f1ea-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-eg",
      "egypt flag"
    ],
    u: "1f1ea-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-eh",
      "western sahara flag"
    ],
    u: "1f1ea-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-er",
      "eritrea flag"
    ],
    u: "1f1ea-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "es",
      "flag-es",
      "spain flag"
    ],
    u: "1f1ea-1f1f8",
    a: "0.6"
  },
  {
    n: [
      "flag-et",
      "ethiopia flag"
    ],
    u: "1f1ea-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-eu",
      "european union flag"
    ],
    u: "1f1ea-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-fi",
      "finland flag"
    ],
    u: "1f1eb-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-fj",
      "fiji flag"
    ],
    u: "1f1eb-1f1ef",
    a: "2.0"
  },
  {
    n: [
      "flag-fk",
      "falkland islands flag"
    ],
    u: "1f1eb-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-fm",
      "micronesia flag"
    ],
    u: "1f1eb-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-fo",
      "faroe islands flag"
    ],
    u: "1f1eb-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "fr",
      "flag-fr",
      "france flag"
    ],
    u: "1f1eb-1f1f7",
    a: "0.6"
  },
  {
    n: [
      "flag-ga",
      "gabon flag"
    ],
    u: "1f1ec-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "gb",
      "uk",
      "flag-gb",
      "united kingdom flag"
    ],
    u: "1f1ec-1f1e7",
    a: "0.6"
  },
  {
    n: [
      "flag-gd",
      "grenada flag"
    ],
    u: "1f1ec-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-ge",
      "georgia flag"
    ],
    u: "1f1ec-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-gf",
      "french guiana flag"
    ],
    u: "1f1ec-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-gg",
      "guernsey flag"
    ],
    u: "1f1ec-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-gh",
      "ghana flag"
    ],
    u: "1f1ec-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-gi",
      "gibraltar flag"
    ],
    u: "1f1ec-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-gl",
      "greenland flag"
    ],
    u: "1f1ec-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-gm",
      "gambia flag"
    ],
    u: "1f1ec-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-gn",
      "guinea flag"
    ],
    u: "1f1ec-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-gp",
      "guadeloupe flag"
    ],
    u: "1f1ec-1f1f5",
    a: "2.0"
  },
  {
    n: [
      "flag-gq",
      "equatorial guinea flag"
    ],
    u: "1f1ec-1f1f6",
    a: "2.0"
  },
  {
    n: [
      "flag-gr",
      "greece flag"
    ],
    u: "1f1ec-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-gs",
      "south georgia & south sandwich islands flag"
    ],
    u: "1f1ec-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-gt",
      "guatemala flag"
    ],
    u: "1f1ec-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-gu",
      "guam flag"
    ],
    u: "1f1ec-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-gw",
      "guinea-bissau flag"
    ],
    u: "1f1ec-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-gy",
      "guyana flag"
    ],
    u: "1f1ec-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-hk",
      "hong kong sar china flag"
    ],
    u: "1f1ed-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-hm",
      "heard & mcdonald islands flag"
    ],
    u: "1f1ed-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-hn",
      "honduras flag"
    ],
    u: "1f1ed-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-hr",
      "croatia flag"
    ],
    u: "1f1ed-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-ht",
      "haiti flag"
    ],
    u: "1f1ed-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-hu",
      "hungary flag"
    ],
    u: "1f1ed-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-ic",
      "canary islands flag"
    ],
    u: "1f1ee-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-id",
      "indonesia flag"
    ],
    u: "1f1ee-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-ie",
      "ireland flag"
    ],
    u: "1f1ee-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-il",
      "israel flag"
    ],
    u: "1f1ee-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-im",
      "isle of man flag"
    ],
    u: "1f1ee-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-in",
      "india flag"
    ],
    u: "1f1ee-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-io",
      "british indian ocean territory flag"
    ],
    u: "1f1ee-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-iq",
      "iraq flag"
    ],
    u: "1f1ee-1f1f6",
    a: "2.0"
  },
  {
    n: [
      "flag-ir",
      "iran flag"
    ],
    u: "1f1ee-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-is",
      "iceland flag"
    ],
    u: "1f1ee-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "it",
      "flag-it",
      "italy flag"
    ],
    u: "1f1ee-1f1f9",
    a: "0.6"
  },
  {
    n: [
      "flag-je",
      "jersey flag"
    ],
    u: "1f1ef-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-jm",
      "jamaica flag"
    ],
    u: "1f1ef-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-jo",
      "jordan flag"
    ],
    u: "1f1ef-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "jp",
      "flag-jp",
      "japan flag"
    ],
    u: "1f1ef-1f1f5",
    a: "0.6"
  },
  {
    n: [
      "flag-ke",
      "kenya flag"
    ],
    u: "1f1f0-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-kg",
      "kyrgyzstan flag"
    ],
    u: "1f1f0-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-kh",
      "cambodia flag"
    ],
    u: "1f1f0-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-ki",
      "kiribati flag"
    ],
    u: "1f1f0-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-km",
      "comoros flag"
    ],
    u: "1f1f0-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-kn",
      "st. kitts & nevis flag"
    ],
    u: "1f1f0-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-kp",
      "north korea flag"
    ],
    u: "1f1f0-1f1f5",
    a: "2.0"
  },
  {
    n: [
      "kr",
      "flag-kr",
      "south korea flag"
    ],
    u: "1f1f0-1f1f7",
    a: "0.6"
  },
  {
    n: [
      "flag-kw",
      "kuwait flag"
    ],
    u: "1f1f0-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-ky",
      "cayman islands flag"
    ],
    u: "1f1f0-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-kz",
      "kazakhstan flag"
    ],
    u: "1f1f0-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-la",
      "laos flag"
    ],
    u: "1f1f1-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-lb",
      "lebanon flag"
    ],
    u: "1f1f1-1f1e7",
    a: "2.0"
  },
  {
    n: [
      "flag-lc",
      "st. lucia flag"
    ],
    u: "1f1f1-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-li",
      "liechtenstein flag"
    ],
    u: "1f1f1-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-lk",
      "sri lanka flag"
    ],
    u: "1f1f1-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-lr",
      "liberia flag"
    ],
    u: "1f1f1-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-ls",
      "lesotho flag"
    ],
    u: "1f1f1-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-lt",
      "lithuania flag"
    ],
    u: "1f1f1-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-lu",
      "luxembourg flag"
    ],
    u: "1f1f1-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-lv",
      "latvia flag"
    ],
    u: "1f1f1-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-ly",
      "libya flag"
    ],
    u: "1f1f1-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-ma",
      "morocco flag"
    ],
    u: "1f1f2-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-mc",
      "monaco flag"
    ],
    u: "1f1f2-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-md",
      "moldova flag"
    ],
    u: "1f1f2-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-me",
      "montenegro flag"
    ],
    u: "1f1f2-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-mf",
      "st. martin flag"
    ],
    u: "1f1f2-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-mg",
      "madagascar flag"
    ],
    u: "1f1f2-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-mh",
      "marshall islands flag"
    ],
    u: "1f1f2-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-mk",
      "north macedonia flag"
    ],
    u: "1f1f2-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-ml",
      "mali flag"
    ],
    u: "1f1f2-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-mm",
      "myanmar (burma) flag"
    ],
    u: "1f1f2-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-mn",
      "mongolia flag"
    ],
    u: "1f1f2-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-mo",
      "macao sar china flag"
    ],
    u: "1f1f2-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-mp",
      "northern mariana islands flag"
    ],
    u: "1f1f2-1f1f5",
    a: "2.0"
  },
  {
    n: [
      "flag-mq",
      "martinique flag"
    ],
    u: "1f1f2-1f1f6",
    a: "2.0"
  },
  {
    n: [
      "flag-mr",
      "mauritania flag"
    ],
    u: "1f1f2-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-ms",
      "montserrat flag"
    ],
    u: "1f1f2-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-mt",
      "malta flag"
    ],
    u: "1f1f2-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-mu",
      "mauritius flag"
    ],
    u: "1f1f2-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-mv",
      "maldives flag"
    ],
    u: "1f1f2-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-mw",
      "malawi flag"
    ],
    u: "1f1f2-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-mx",
      "mexico flag"
    ],
    u: "1f1f2-1f1fd",
    a: "2.0"
  },
  {
    n: [
      "flag-my",
      "malaysia flag"
    ],
    u: "1f1f2-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-mz",
      "mozambique flag"
    ],
    u: "1f1f2-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-na",
      "namibia flag"
    ],
    u: "1f1f3-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-nc",
      "new caledonia flag"
    ],
    u: "1f1f3-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-ne",
      "niger flag"
    ],
    u: "1f1f3-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-nf",
      "norfolk island flag"
    ],
    u: "1f1f3-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-ng",
      "nigeria flag"
    ],
    u: "1f1f3-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-ni",
      "nicaragua flag"
    ],
    u: "1f1f3-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-nl",
      "netherlands flag"
    ],
    u: "1f1f3-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-no",
      "norway flag"
    ],
    u: "1f1f3-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-np",
      "nepal flag"
    ],
    u: "1f1f3-1f1f5",
    a: "2.0"
  },
  {
    n: [
      "flag-nr",
      "nauru flag"
    ],
    u: "1f1f3-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-nu",
      "niue flag"
    ],
    u: "1f1f3-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-nz",
      "new zealand flag"
    ],
    u: "1f1f3-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-om",
      "oman flag"
    ],
    u: "1f1f4-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-pa",
      "panama flag"
    ],
    u: "1f1f5-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-pe",
      "peru flag"
    ],
    u: "1f1f5-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-pf",
      "french polynesia flag"
    ],
    u: "1f1f5-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-pg",
      "papua new guinea flag"
    ],
    u: "1f1f5-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-ph",
      "philippines flag"
    ],
    u: "1f1f5-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-pk",
      "pakistan flag"
    ],
    u: "1f1f5-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-pl",
      "poland flag"
    ],
    u: "1f1f5-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-pm",
      "st. pierre & miquelon flag"
    ],
    u: "1f1f5-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-pn",
      "pitcairn islands flag"
    ],
    u: "1f1f5-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-pr",
      "puerto rico flag"
    ],
    u: "1f1f5-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-ps",
      "palestinian territories flag"
    ],
    u: "1f1f5-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-pt",
      "portugal flag"
    ],
    u: "1f1f5-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-pw",
      "palau flag"
    ],
    u: "1f1f5-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-py",
      "paraguay flag"
    ],
    u: "1f1f5-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-qa",
      "qatar flag"
    ],
    u: "1f1f6-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-re",
      "r\xE9union flag"
    ],
    u: "1f1f7-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-ro",
      "romania flag"
    ],
    u: "1f1f7-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-rs",
      "serbia flag"
    ],
    u: "1f1f7-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "ru",
      "flag-ru",
      "russia flag"
    ],
    u: "1f1f7-1f1fa",
    a: "0.6"
  },
  {
    n: [
      "flag-rw",
      "rwanda flag"
    ],
    u: "1f1f7-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-sa",
      "saudi arabia flag"
    ],
    u: "1f1f8-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-sb",
      "solomon islands flag"
    ],
    u: "1f1f8-1f1e7",
    a: "2.0"
  },
  {
    n: [
      "flag-sc",
      "seychelles flag"
    ],
    u: "1f1f8-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-sd",
      "sudan flag"
    ],
    u: "1f1f8-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-se",
      "sweden flag"
    ],
    u: "1f1f8-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-sg",
      "singapore flag"
    ],
    u: "1f1f8-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-sh",
      "st. helena flag"
    ],
    u: "1f1f8-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-si",
      "slovenia flag"
    ],
    u: "1f1f8-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-sj",
      "svalbard & jan mayen flag"
    ],
    u: "1f1f8-1f1ef",
    a: "2.0"
  },
  {
    n: [
      "flag-sk",
      "slovakia flag"
    ],
    u: "1f1f8-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-sl",
      "sierra leone flag"
    ],
    u: "1f1f8-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-sm",
      "san marino flag"
    ],
    u: "1f1f8-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-sn",
      "senegal flag"
    ],
    u: "1f1f8-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-so",
      "somalia flag"
    ],
    u: "1f1f8-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-sr",
      "suriname flag"
    ],
    u: "1f1f8-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-ss",
      "south sudan flag"
    ],
    u: "1f1f8-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-st",
      "s\xE3o tom\xE9 & pr\xEDncipe flag"
    ],
    u: "1f1f8-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-sv",
      "el salvador flag"
    ],
    u: "1f1f8-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-sx",
      "sint maarten flag"
    ],
    u: "1f1f8-1f1fd",
    a: "2.0"
  },
  {
    n: [
      "flag-sy",
      "syria flag"
    ],
    u: "1f1f8-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-sz",
      "eswatini flag"
    ],
    u: "1f1f8-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-ta",
      "tristan da cunha flag"
    ],
    u: "1f1f9-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-tc",
      "turks & caicos islands flag"
    ],
    u: "1f1f9-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-td",
      "chad flag"
    ],
    u: "1f1f9-1f1e9",
    a: "2.0"
  },
  {
    n: [
      "flag-tf",
      "french southern territories flag"
    ],
    u: "1f1f9-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-tg",
      "togo flag"
    ],
    u: "1f1f9-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-th",
      "thailand flag"
    ],
    u: "1f1f9-1f1ed",
    a: "2.0"
  },
  {
    n: [
      "flag-tj",
      "tajikistan flag"
    ],
    u: "1f1f9-1f1ef",
    a: "2.0"
  },
  {
    n: [
      "flag-tk",
      "tokelau flag"
    ],
    u: "1f1f9-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-tl",
      "timor-leste flag"
    ],
    u: "1f1f9-1f1f1",
    a: "2.0"
  },
  {
    n: [
      "flag-tm",
      "turkmenistan flag"
    ],
    u: "1f1f9-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-tn",
      "tunisia flag"
    ],
    u: "1f1f9-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-to",
      "tonga flag"
    ],
    u: "1f1f9-1f1f4",
    a: "2.0"
  },
  {
    n: [
      "flag-tr",
      "t\xFCrkiye flag"
    ],
    u: "1f1f9-1f1f7",
    a: "2.0"
  },
  {
    n: [
      "flag-tt",
      "trinidad & tobago flag"
    ],
    u: "1f1f9-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-tv",
      "tuvalu flag"
    ],
    u: "1f1f9-1f1fb",
    a: "2.0"
  },
  {
    n: [
      "flag-tw",
      "taiwan flag"
    ],
    u: "1f1f9-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "flag-tz",
      "tanzania flag"
    ],
    u: "1f1f9-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-ua",
      "ukraine flag"
    ],
    u: "1f1fa-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-ug",
      "uganda flag"
    ],
    u: "1f1fa-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-um",
      "u.s. outlying islands flag"
    ],
    u: "1f1fa-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-un",
      "united nations flag"
    ],
    u: "1f1fa-1f1f3",
    a: "4.0"
  },
  {
    n: [
      "us",
      "flag-us",
      "united states flag"
    ],
    u: "1f1fa-1f1f8",
    a: "0.6"
  },
  {
    n: [
      "flag-uy",
      "uruguay flag"
    ],
    u: "1f1fa-1f1fe",
    a: "2.0"
  },
  {
    n: [
      "flag-uz",
      "uzbekistan flag"
    ],
    u: "1f1fa-1f1ff",
    a: "2.0"
  },
  {
    n: [
      "flag-va",
      "vatican city flag"
    ],
    u: "1f1fb-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-vc",
      "st. vincent & grenadines flag"
    ],
    u: "1f1fb-1f1e8",
    a: "2.0"
  },
  {
    n: [
      "flag-ve",
      "venezuela flag"
    ],
    u: "1f1fb-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-vg",
      "british virgin islands flag"
    ],
    u: "1f1fb-1f1ec",
    a: "2.0"
  },
  {
    n: [
      "flag-vi",
      "u.s. virgin islands flag"
    ],
    u: "1f1fb-1f1ee",
    a: "2.0"
  },
  {
    n: [
      "flag-vn",
      "vietnam flag"
    ],
    u: "1f1fb-1f1f3",
    a: "2.0"
  },
  {
    n: [
      "flag-vu",
      "vanuatu flag"
    ],
    u: "1f1fb-1f1fa",
    a: "2.0"
  },
  {
    n: [
      "flag-wf",
      "wallis & futuna flag"
    ],
    u: "1f1fc-1f1eb",
    a: "2.0"
  },
  {
    n: [
      "flag-ws",
      "samoa flag"
    ],
    u: "1f1fc-1f1f8",
    a: "2.0"
  },
  {
    n: [
      "flag-xk",
      "kosovo flag"
    ],
    u: "1f1fd-1f1f0",
    a: "2.0"
  },
  {
    n: [
      "flag-ye",
      "yemen flag"
    ],
    u: "1f1fe-1f1ea",
    a: "2.0"
  },
  {
    n: [
      "flag-yt",
      "mayotte flag"
    ],
    u: "1f1fe-1f1f9",
    a: "2.0"
  },
  {
    n: [
      "flag-za",
      "south africa flag"
    ],
    u: "1f1ff-1f1e6",
    a: "2.0"
  },
  {
    n: [
      "flag-zm",
      "zambia flag"
    ],
    u: "1f1ff-1f1f2",
    a: "2.0"
  },
  {
    n: [
      "flag-zw",
      "zimbabwe flag"
    ],
    u: "1f1ff-1f1fc",
    a: "2.0"
  },
  {
    n: [
      "england flag",
      "flag-england"
    ],
    u: "1f3f4-e0067-e0062-e0065-e006e-e0067-e007f",
    a: "5.0"
  },
  {
    n: [
      "scotland flag",
      "flag-scotland"
    ],
    u: "1f3f4-e0067-e0062-e0073-e0063-e0074-e007f",
    a: "5.0"
  },
  {
    n: [
      "wales flag",
      "flag-wales"
    ],
    u: "1f3f4-e0067-e0062-e0077-e006c-e0073-e007f",
    a: "5.0"
  }
];
var emojis = {
  custom,
  smileys_people,
  animals_nature,
  food_drink,
  travel_places,
  activities,
  objects,
  symbols,
  flags
};
var skinToneVariations = [SkinTones.NEUTRAL, SkinTones.LIGHT, SkinTones.MEDIUM_LIGHT, SkinTones.MEDIUM, SkinTones.MEDIUM_DARK, SkinTones.DARK];
var skinTonesNamed = /* @__PURE__ */ Object.entries(SkinTones).reduce(function(acc, _ref) {
  var key = _ref[0], value = _ref[1];
  acc[value] = key;
  return acc;
}, {});
var skinTonesMapped = /* @__PURE__ */ skinToneVariations.reduce(function(mapped, skinTone) {
  var _Object$assign;
  return Object.assign(mapped, (_Object$assign = {}, _Object$assign[skinTone] = skinTone, _Object$assign));
}, {});
var EmojiProperties;
(function(EmojiProperties2) {
  EmojiProperties2["name"] = "n";
  EmojiProperties2["unified"] = "u";
  EmojiProperties2["variations"] = "v";
  EmojiProperties2["added_in"] = "a";
  EmojiProperties2["imgUrl"] = "imgUrl";
})(EmojiProperties || (EmojiProperties = {}));
var SUGGESTED_LS_KEY = "epr_suggested";
function getSuggested(mode) {
  try {
    var _window, _window$localStorage$, _window2;
    if (!((_window = window) != null && _window.localStorage)) {
      return [];
    }
    var recent = JSON.parse((_window$localStorage$ = (_window2 = window) == null ? void 0 : _window2.localStorage.getItem(SUGGESTED_LS_KEY)) != null ? _window$localStorage$ : "[]");
    if (mode === SuggestionMode.FREQUENT) {
      return recent.sort(function(a, b) {
        return b.count - a.count;
      });
    }
    return recent;
  } catch (_unused) {
    return [];
  }
}
function setSuggested(emoji, skinTone) {
  var recent = getSuggested();
  var unified = emojiUnified(emoji, skinTone);
  var originalUnified = emojiUnified(emoji);
  var existing = recent.find(function(_ref) {
    var u = _ref.unified;
    return u === unified;
  });
  var nextList;
  if (existing) {
    nextList = [existing].concat(recent.filter(function(i) {
      return i !== existing;
    }));
  } else {
    existing = {
      unified,
      original: originalUnified,
      count: 0
    };
    nextList = [existing].concat(recent);
  }
  existing.count++;
  nextList.length = Math.min(nextList.length, 14);
  try {
    var _window3;
    (_window3 = window) == null ? void 0 : _window3.localStorage.setItem(SUGGESTED_LS_KEY, JSON.stringify(nextList));
  } catch (_unused2) {
  }
}
function emojiNames(emoji) {
  var _emoji$EmojiPropertie;
  return (_emoji$EmojiPropertie = emoji[EmojiProperties.name]) != null ? _emoji$EmojiPropertie : [];
}
function addedIn(emoji) {
  return parseFloat(emoji[EmojiProperties.added_in]);
}
function emojiName(emoji) {
  if (!emoji) {
    return "";
  }
  return emojiNames(emoji)[0];
}
function unifiedWithoutSkinTone(unified) {
  var splat = unified.split("-");
  var _splat$splice = splat.splice(1, 1), skinTone = _splat$splice[0];
  if (skinTonesMapped[skinTone]) {
    return splat.join("-");
  }
  return unified;
}
function emojiUnified(emoji, skinTone) {
  var _emojiVariationUnifie;
  var unified = emoji[EmojiProperties.unified];
  if (!skinTone || !emojiHasVariations(emoji)) {
    return unified;
  }
  return (_emojiVariationUnifie = emojiVariationUnified(emoji, skinTone)) != null ? _emojiVariationUnifie : unified;
}
function useGetEmojisByCategory() {
  var suggestedEmojisModeConfig = useSuggestedEmojisModeConfig();
  var _useUpdateSuggested = useUpdateSuggested(), suggestedUpdated = _useUpdateSuggested[0];
  var suggested = import_react.default.useMemo(
    function() {
      var _getSuggested;
      var suggested2 = (_getSuggested = getSuggested(suggestedEmojisModeConfig)) != null ? _getSuggested : [];
      return suggested2.map(function(s) {
        return emojiByUnified(s.unified);
      }).filter(Boolean);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestedUpdated, suggestedEmojisModeConfig]
  );
  return function getEmojisByCategory(category) {
    var _emojis$category;
    if (category === Categories.SUGGESTED) {
      return suggested;
    }
    return (_emojis$category = emojis[category]) != null ? _emojis$category : [];
  };
}
function emojiUrlByUnified(unified, emojiStyle) {
  return "" + cdnUrl(emojiStyle) + unified + ".png";
}
function emojiVariations(emoji) {
  var _emoji$EmojiPropertie2;
  return (_emoji$EmojiPropertie2 = emoji[EmojiProperties.variations]) != null ? _emoji$EmojiPropertie2 : [];
}
function emojiHasVariations(emoji) {
  return emojiVariations(emoji).length > 0;
}
function emojiVariationUnified(emoji, skinTone) {
  return skinTone ? emojiVariations(emoji).find(function(variation) {
    return variation.includes(skinTone);
  }) : emojiUnified(emoji);
}
function emojiByUnified(unified) {
  if (!unified) {
    return;
  }
  if (allEmojisByUnified[unified]) {
    return allEmojisByUnified[unified];
  }
  var withoutSkinTone = unifiedWithoutSkinTone(unified);
  return allEmojisByUnified[withoutSkinTone];
}
var allEmojis = /* @__PURE__ */ Object.values(emojis).flat();
function setCustomEmojis(customEmojis) {
  emojis[Categories.CUSTOM].length = 0;
  customEmojis.forEach(function(emoji) {
    var emojiData = customToRegularEmoji(emoji);
    emojis[Categories.CUSTOM].push(emojiData);
    if (allEmojisByUnified[emojiData[EmojiProperties.unified]]) {
      return;
    }
    allEmojis.push(emojiData);
    allEmojisByUnified[emojiData[EmojiProperties.unified]] = emojiData;
    indexEmoji(emojiData);
  });
}
function customToRegularEmoji(emoji) {
  var _ref;
  return _ref = {}, _ref[EmojiProperties.name] = emoji.names.map(function(name) {
    return name.toLowerCase();
  }), _ref[EmojiProperties.unified] = emoji.id.toLowerCase(), _ref[EmojiProperties.added_in] = "0", _ref[EmojiProperties.imgUrl] = emoji.imgUrl, _ref;
}
var allEmojisByUnified = {};
setTimeout(function() {
  allEmojis.reduce(function(allEmojis2, Emoji) {
    allEmojis2[emojiUnified(Emoji)] = Emoji;
    if (emojiHasVariations(Emoji)) {
      emojiVariations(Emoji).forEach(function(variation) {
        allEmojis2[variation] = Emoji;
      });
    }
    return allEmojis2;
  }, allEmojisByUnified);
});
function activeVariationFromUnified(unified) {
  var _unified$split = unified.split("-"), suspectedSkinTone = _unified$split[1];
  return skinToneVariations.includes(suspectedSkinTone) ? suspectedSkinTone : null;
}
var KNOWN_FAILING_EMOJIS = ["2640-fe0f", "2642-fe0f", "2695-fe0f"];
var DEFAULT_SEARCH_PLACEHOLDER = "Search";
var SEARCH_RESULTS_NO_RESULTS_FOUND = "No results found";
var SEARCH_RESULTS_SUFFIX = " found. Use up and down arrow keys to navigate.";
var SEARCH_RESULTS_ONE_RESULT_FOUND = "1 result" + SEARCH_RESULTS_SUFFIX;
var SEARCH_RESULTS_MULTIPLE_RESULTS_FOUND = "%n results" + SEARCH_RESULTS_SUFFIX;
function mergeConfig(userConfig) {
  var _userConfig$previewCo, _config$customEmojis;
  if (userConfig === void 0) {
    userConfig = {};
  }
  var base = basePickerConfig();
  var previewConfig = Object.assign(base.previewConfig, (_userConfig$previewCo = userConfig.previewConfig) != null ? _userConfig$previewCo : {});
  var config = Object.assign(base, userConfig);
  var categories = mergeCategoriesConfig(userConfig.categories, {
    suggestionMode: config.suggestedEmojisMode
  });
  config.hiddenEmojis.forEach(function(emoji) {
    config.unicodeToHide.add(emoji);
  });
  setCustomEmojis((_config$customEmojis = config.customEmojis) != null ? _config$customEmojis : []);
  var skinTonePickerLocation = config.searchDisabled ? SkinTonePickerLocation.PREVIEW : config.skinTonePickerLocation;
  return _extends({}, config, {
    categories,
    previewConfig,
    skinTonePickerLocation
  });
}
function basePickerConfig() {
  return {
    autoFocusSearch: true,
    categories: baseCategoriesConfig(),
    className: "",
    customEmojis: [],
    defaultSkinTone: SkinTones.NEUTRAL,
    emojiStyle: EmojiStyle.APPLE,
    emojiVersion: null,
    getEmojiUrl: emojiUrlByUnified,
    height: 450,
    lazyLoadEmojis: false,
    previewConfig: _extends({}, basePreviewConfig),
    searchDisabled: false,
    searchPlaceHolder: DEFAULT_SEARCH_PLACEHOLDER,
    searchPlaceholder: DEFAULT_SEARCH_PLACEHOLDER,
    skinTonePickerLocation: SkinTonePickerLocation.SEARCH,
    skinTonesDisabled: false,
    style: {},
    suggestedEmojisMode: SuggestionMode.FREQUENT,
    theme: Theme.LIGHT,
    unicodeToHide: new Set(KNOWN_FAILING_EMOJIS),
    width: 350,
    reactionsDefaultOpen: false,
    reactions: DEFAULT_REACTIONS,
    open: true,
    allowExpandReactions: true,
    hiddenEmojis: []
  };
}
var basePreviewConfig = {
  defaultEmoji: "1f60a",
  defaultCaption: "What's your mood?",
  showPreview: true
};
var _excluded = ["children"];
var ConfigContext = /* @__PURE__ */ (0, import_react.createContext)(/* @__PURE__ */ basePickerConfig());
function PickerConfigProvider(_ref) {
  var children = _ref.children, config = _objectWithoutPropertiesLoose(_ref, _excluded);
  var mergedConfig = useSetConfig(config);
  return (0, import_react.createElement)(ConfigContext.Provider, {
    value: mergedConfig
  }, children);
}
function useSetConfig(config) {
  var _config$customEmojis;
  var _React$useState = (0, import_react.useState)(function() {
    return mergeConfig(config);
  }), mergedConfig = _React$useState[0], setMergedConfig = _React$useState[1];
  (0, import_react.useEffect)(function() {
    if (compareConfig(mergedConfig, config)) {
      return;
    }
    setMergedConfig(mergeConfig(config));
  }, [(_config$customEmojis = config.customEmojis) == null ? void 0 : _config$customEmojis.length, config.open, config.emojiVersion, config.reactionsDefaultOpen, config.searchPlaceHolder, config.searchPlaceholder, config.defaultSkinTone, config.skinTonesDisabled, config.autoFocusSearch, config.emojiStyle, config.theme, config.suggestedEmojisMode, config.lazyLoadEmojis, config.className, config.height, config.width, config.searchDisabled, config.skinTonePickerLocation, config.allowExpandReactions]);
  return mergedConfig;
}
function usePickerConfig() {
  return (0, import_react.useContext)(ConfigContext);
}
var MutableConfigContext = /* @__PURE__ */ import_react.default.createContext({});
function useMutableConfig() {
  var mutableConfig = import_react.default.useContext(MutableConfigContext);
  return mutableConfig;
}
function useDefineMutableConfig(config) {
  var MutableConfigRef = import_react.default.useRef({
    onEmojiClick: config.onEmojiClick || emptyFunc,
    onReactionClick: config.onReactionClick || config.onEmojiClick,
    onSkinToneChange: config.onSkinToneChange || emptyFunc
  });
  import_react.default.useEffect(function() {
    MutableConfigRef.current.onEmojiClick = config.onEmojiClick || emptyFunc;
    MutableConfigRef.current.onReactionClick = config.onReactionClick || config.onEmojiClick;
  }, [config.onEmojiClick, config.onReactionClick]);
  import_react.default.useEffect(function() {
    MutableConfigRef.current.onSkinToneChange = config.onSkinToneChange || emptyFunc;
  }, [config.onSkinToneChange]);
  return MutableConfigRef;
}
function emptyFunc() {
}
var MOUSE_EVENT_SOURCE;
(function(MOUSE_EVENT_SOURCE2) {
  MOUSE_EVENT_SOURCE2["REACTIONS"] = "reactions";
  MOUSE_EVENT_SOURCE2["PICKER"] = "picker";
})(MOUSE_EVENT_SOURCE || (MOUSE_EVENT_SOURCE = {}));
function useSearchPlaceHolderConfig() {
  var _find;
  var _usePickerConfig = usePickerConfig(), searchPlaceHolder = _usePickerConfig.searchPlaceHolder, searchPlaceholder = _usePickerConfig.searchPlaceholder;
  return (_find = [searchPlaceHolder, searchPlaceholder].find(function(p) {
    return p !== DEFAULT_SEARCH_PLACEHOLDER;
  })) != null ? _find : DEFAULT_SEARCH_PLACEHOLDER;
}
function useDefaultSkinToneConfig() {
  var _usePickerConfig2 = usePickerConfig(), defaultSkinTone = _usePickerConfig2.defaultSkinTone;
  return defaultSkinTone;
}
function useAllowExpandReactions() {
  var _usePickerConfig3 = usePickerConfig(), allowExpandReactions = _usePickerConfig3.allowExpandReactions;
  return allowExpandReactions;
}
function useSkinTonesDisabledConfig() {
  var _usePickerConfig4 = usePickerConfig(), skinTonesDisabled = _usePickerConfig4.skinTonesDisabled;
  return skinTonesDisabled;
}
function useEmojiStyleConfig() {
  var _usePickerConfig5 = usePickerConfig(), emojiStyle = _usePickerConfig5.emojiStyle;
  return emojiStyle;
}
function useAutoFocusSearchConfig() {
  var _usePickerConfig6 = usePickerConfig(), autoFocusSearch = _usePickerConfig6.autoFocusSearch;
  return autoFocusSearch;
}
function useCategoriesConfig() {
  var _usePickerConfig7 = usePickerConfig(), categories = _usePickerConfig7.categories;
  return categories;
}
function useCustomEmojisConfig() {
  var _usePickerConfig8 = usePickerConfig(), customEmojis = _usePickerConfig8.customEmojis;
  return customEmojis;
}
function useOpenConfig() {
  var _usePickerConfig9 = usePickerConfig(), open = _usePickerConfig9.open;
  return open;
}
function useOnEmojiClickConfig(mouseEventSource) {
  var _useMutableConfig = useMutableConfig(), current = _useMutableConfig.current;
  var _useReactionsModeStat = useReactionsModeState(), setReactionsOpen = _useReactionsModeStat[1];
  var handler = current.onEmojiClick || function() {
  };
  var onReactionClick = current.onReactionClick;
  if (mouseEventSource === MOUSE_EVENT_SOURCE.REACTIONS && onReactionClick) {
    return function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return onReactionClick.apply(void 0, args.concat([{
        collapseToReactions: function collapseToReactions() {
          setReactionsOpen(function(o) {
            return o;
          });
        }
      }]));
    };
  }
  return function() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    handler.apply(void 0, args.concat([{
      collapseToReactions: function collapseToReactions() {
        setReactionsOpen(true);
      }
    }]));
  };
}
function useOnSkinToneChangeConfig() {
  var _useMutableConfig2 = useMutableConfig(), current = _useMutableConfig2.current;
  return current.onSkinToneChange || function() {
  };
}
function usePreviewConfig() {
  var _usePickerConfig10 = usePickerConfig(), previewConfig = _usePickerConfig10.previewConfig;
  return previewConfig;
}
function useThemeConfig() {
  var _usePickerConfig11 = usePickerConfig(), theme = _usePickerConfig11.theme;
  return theme;
}
function useSuggestedEmojisModeConfig() {
  var _usePickerConfig12 = usePickerConfig(), suggestedEmojisMode = _usePickerConfig12.suggestedEmojisMode;
  return suggestedEmojisMode;
}
function useLazyLoadEmojisConfig() {
  var _usePickerConfig13 = usePickerConfig(), lazyLoadEmojis = _usePickerConfig13.lazyLoadEmojis;
  return lazyLoadEmojis;
}
function useClassNameConfig() {
  var _usePickerConfig14 = usePickerConfig(), className = _usePickerConfig14.className;
  return className;
}
function useStyleConfig() {
  var _usePickerConfig15 = usePickerConfig(), height = _usePickerConfig15.height, width = _usePickerConfig15.width, style = _usePickerConfig15.style;
  return _extends({
    height: getDimension(height),
    width: getDimension(width)
  }, style);
}
function useReactionsOpenConfig() {
  var _usePickerConfig16 = usePickerConfig(), reactionsDefaultOpen = _usePickerConfig16.reactionsDefaultOpen;
  return reactionsDefaultOpen;
}
function useEmojiVersionConfig() {
  var _usePickerConfig17 = usePickerConfig(), emojiVersion = _usePickerConfig17.emojiVersion;
  return emojiVersion;
}
function useSearchDisabledConfig() {
  var _usePickerConfig18 = usePickerConfig(), searchDisabled = _usePickerConfig18.searchDisabled;
  return searchDisabled;
}
function useSkinTonePickerLocationConfig() {
  var _usePickerConfig19 = usePickerConfig(), skinTonePickerLocation = _usePickerConfig19.skinTonePickerLocation;
  return skinTonePickerLocation;
}
function useUnicodeToHide() {
  var _usePickerConfig20 = usePickerConfig(), unicodeToHide = _usePickerConfig20.unicodeToHide;
  return unicodeToHide;
}
function useReactionsConfig() {
  var _usePickerConfig21 = usePickerConfig(), reactions = _usePickerConfig21.reactions;
  return reactions;
}
function useGetEmojiUrlConfig() {
  var _usePickerConfig22 = usePickerConfig(), getEmojiUrl = _usePickerConfig22.getEmojiUrl;
  return getEmojiUrl;
}
function getDimension(dimensionConfig) {
  return typeof dimensionConfig === "number" ? dimensionConfig + "px" : dimensionConfig;
}
function useSearchResultsConfig(searchResultsCount) {
  var hasResults = searchResultsCount > 0;
  var isPlural = searchResultsCount > 1;
  if (hasResults) {
    return isPlural ? SEARCH_RESULTS_MULTIPLE_RESULTS_FOUND.replace("%n", searchResultsCount.toString()) : SEARCH_RESULTS_ONE_RESULT_FOUND;
  }
  return SEARCH_RESULTS_NO_RESULTS_FOUND;
}
function useIsSearchMode() {
  var _useSearchTermState = useSearchTermState(), searchTerm = _useSearchTermState[0];
  return !!searchTerm;
}
function focusElement(element) {
  if (!element) {
    return;
  }
  requestAnimationFrame(function() {
    element.focus();
  });
}
function focusPrevElementSibling(element) {
  if (!element)
    return;
  var prev = element.previousElementSibling;
  focusElement(prev);
}
function focusNextElementSibling(element) {
  if (!element)
    return;
  var next = element.nextElementSibling;
  focusElement(next);
}
function focusFirstElementChild(element) {
  if (!element)
    return;
  var first = element.firstElementChild;
  focusElement(first);
}
function getActiveElement() {
  return document.activeElement;
}
function ElementRefContextProvider(_ref) {
  var children = _ref.children;
  var PickerMainRef = (0, import_react.useRef)(null);
  var AnchoredEmojiRef = (0, import_react.useRef)(null);
  var BodyRef = (0, import_react.useRef)(null);
  var EmojiListRef = (0, import_react.useRef)(null);
  var SearchInputRef = (0, import_react.useRef)(null);
  var SkinTonePickerRef = (0, import_react.useRef)(null);
  var CategoryNavigationRef = (0, import_react.useRef)(null);
  var VariationPickerRef = (0, import_react.useRef)(null);
  var ReactionsRef = (0, import_react.useRef)(null);
  return (0, import_react.createElement)(ElementRefContext.Provider, {
    value: {
      AnchoredEmojiRef,
      BodyRef,
      EmojiListRef,
      CategoryNavigationRef,
      PickerMainRef,
      SearchInputRef,
      SkinTonePickerRef,
      VariationPickerRef,
      ReactionsRef
    }
  }, children);
}
var ElementRefContext = /* @__PURE__ */ (0, import_react.createContext)({
  AnchoredEmojiRef: /* @__PURE__ */ (0, import_react.createRef)(),
  BodyRef: /* @__PURE__ */ (0, import_react.createRef)(),
  CategoryNavigationRef: /* @__PURE__ */ (0, import_react.createRef)(),
  EmojiListRef: /* @__PURE__ */ (0, import_react.createRef)(),
  PickerMainRef: /* @__PURE__ */ (0, import_react.createRef)(),
  SearchInputRef: /* @__PURE__ */ (0, import_react.createRef)(),
  SkinTonePickerRef: /* @__PURE__ */ (0, import_react.createRef)(),
  VariationPickerRef: /* @__PURE__ */ (0, import_react.createRef)(),
  ReactionsRef: /* @__PURE__ */ (0, import_react.createRef)()
});
function useElementRef() {
  return (0, import_react.useContext)(ElementRefContext);
}
function useEmojiListRef() {
  return useElementRef()["EmojiListRef"];
}
function usePickerMainRef() {
  return useElementRef()["PickerMainRef"];
}
function useAnchoredEmojiRef() {
  return useElementRef()["AnchoredEmojiRef"];
}
function useSetAnchoredEmojiRef() {
  var AnchoredEmojiRef = useAnchoredEmojiRef();
  return function(target) {
    if (target === null && AnchoredEmojiRef.current !== null) {
      focusElement(AnchoredEmojiRef.current);
    }
    AnchoredEmojiRef.current = target;
  };
}
function useBodyRef() {
  return useElementRef()["BodyRef"];
}
function useReactionsRef() {
  return useElementRef()["ReactionsRef"];
}
function useSearchInputRef() {
  return useElementRef()["SearchInputRef"];
}
function useSkinTonePickerRef() {
  return useElementRef()["SkinTonePickerRef"];
}
function useCategoryNavigationRef() {
  return useElementRef()["CategoryNavigationRef"];
}
function useVariationPickerRef() {
  return useElementRef()["VariationPickerRef"];
}
function scrollTo(root, top) {
  if (top === void 0) {
    top = 0;
  }
  var $eprBody = queryScrollBody(root);
  if (!$eprBody) {
    return;
  }
  requestAnimationFrame(function() {
    $eprBody.scrollTop = top;
  });
}
function scrollBy(root, by) {
  var $eprBody = queryScrollBody(root);
  if (!$eprBody) {
    return;
  }
  requestAnimationFrame(function() {
    $eprBody.scrollTop = $eprBody.scrollTop + by;
  });
}
function useScrollTo() {
  var BodyRef = useBodyRef();
  return (0, import_react.useCallback)(function(top) {
    requestAnimationFrame(function() {
      if (BodyRef.current) {
        BodyRef.current.scrollTop = top;
      }
    });
  }, [BodyRef]);
}
function scrollEmojiAboveLabel(emoji) {
  if (!emoji || !isEmojiBehindLabel(emoji)) {
    return;
  }
  if (emoji.closest(asSelectors(ClassNames.variationPicker))) {
    return;
  }
  var scrollBody = closestScrollBody(emoji);
  var by = emojiDistanceFromScrollTop(emoji);
  scrollBy(scrollBody, -(categoryLabelHeight(closestCategory(emoji)) - by));
}
function focusFirstVisibleEmoji(parent) {
  var emoji = firstVisibleEmoji(parent);
  focusElement(emoji);
  scrollEmojiAboveLabel(emoji);
}
function focusAndClickFirstVisibleEmoji(parent) {
  var firstEmoji = firstVisibleEmoji(parent);
  focusElement(firstEmoji);
  firstEmoji == null ? void 0 : firstEmoji.click();
}
function focusLastVisibleEmoji(parent) {
  focusElement(lastVisibleEmoji(parent));
}
function focusNextVisibleEmoji(element) {
  if (!element) {
    return;
  }
  var next = nextVisibleEmoji(element);
  if (!next) {
    return focusFirstVisibleEmoji(nextCategory(element));
  }
  focusElement(next);
  scrollEmojiAboveLabel(next);
}
function focusPrevVisibleEmoji(element) {
  if (!element) {
    return;
  }
  var prev = prevVisibleEmoji(element);
  if (!prev) {
    return focusLastVisibleEmoji(prevCategory(element));
  }
  focusElement(prev);
  scrollEmojiAboveLabel(prev);
}
function focusVisibleEmojiOneRowUp(element, exitUp) {
  if (!element) {
    return;
  }
  var prev = visibleEmojiOneRowUp(element);
  if (!prev) {
    return exitUp();
  }
  focusElement(prev);
  scrollEmojiAboveLabel(prev);
}
function focusVisibleEmojiOneRowDown(element) {
  if (!element) {
    return;
  }
  var next = visibleEmojiOneRowDown(element);
  return focusElement(next);
}
function visibleEmojiOneRowUp(element) {
  if (!element) {
    return null;
  }
  var categoryContent = closestCategoryContent(element);
  var category = closestCategory(categoryContent);
  var countInRow = elementCountInRow(categoryContent, element);
  var emojisInCurrentCategory = allVisibleEmojis(category);
  var currentEmojiIndex = emojisInCurrentCategory.indexOf(element);
  var indexInRow = currentEmojiIndex % countInRow;
  if (currentEmojiIndex === -1) {
    return null;
  }
  if (emojisInCurrentCategory[currentEmojiIndex - countInRow]) {
    return emojisInCurrentCategory[currentEmojiIndex - countInRow];
  }
  var prevVisibleCategory = prevCategory(category);
  if (!prevVisibleCategory) {
    return null;
  }
  var allPrevEmojis = allVisibleEmojis(prevVisibleCategory);
  var lastIndexInRow = allPrevEmojis.length % countInRow - 1;
  if (indexInRow > lastIndexInRow) {
    return allPrevEmojis.at(-1);
  }
  for (var i = allPrevEmojis.length - 1; i >= 0; i--) {
    if (i % countInRow === indexInRow) {
      return allPrevEmojis[i];
    }
  }
  return allPrevEmojis.at(-1);
}
function visibleEmojiOneRowDown(element) {
  var _emojisInNextCategory;
  if (!element) {
    return null;
  }
  var categoryContent = closestCategoryContent(element);
  var category = closestCategory(categoryContent);
  var countInRow = elementCountInRow(categoryContent, element);
  var emojisInCurrentCategory = allVisibleEmojis(category);
  var currentEmojiIndex = emojisInCurrentCategory.indexOf(element);
  if (currentEmojiIndex === -1) {
    return null;
  }
  var remainder = countInRow - currentEmojiIndex % countInRow - 1;
  var firstInNextRow = currentEmojiIndex + remainder + 1;
  if (emojisInCurrentCategory[firstInNextRow]) {
    for (var p = currentEmojiIndex + countInRow; p % countInRow >= 0; p--) {
      if (emojisInCurrentCategory[p]) {
        return emojisInCurrentCategory[p];
      }
    }
  }
  var indexInRow = currentEmojiIndex % countInRow;
  var nextVisibleCategory = nextCategory(category);
  var emojisInNextCategory = allVisibleEmojis(nextVisibleCategory);
  if (emojisInNextCategory[indexInRow]) {
    return emojisInNextCategory[indexInRow];
  }
  return (_emojisInNextCategory = emojisInNextCategory.at(0)) != null ? _emojisInNextCategory : null;
}
function useCloseAllOpenToggles() {
  var _useEmojiVariationPic = useEmojiVariationPickerState(), variationPicker = _useEmojiVariationPic[0], setVariationPicker = _useEmojiVariationPic[1];
  var _useSkinToneFanOpenSt = useSkinToneFanOpenState(), skinToneFanOpen = _useSkinToneFanOpenSt[0], setSkinToneFanOpen = _useSkinToneFanOpenSt[1];
  var closeAllOpenToggles = (0, import_react.useCallback)(function() {
    if (variationPicker) {
      setVariationPicker(null);
    }
    if (skinToneFanOpen) {
      setSkinToneFanOpen(false);
    }
  }, [variationPicker, skinToneFanOpen, setVariationPicker, setSkinToneFanOpen]);
  return closeAllOpenToggles;
}
function useHasOpenToggles() {
  var _useEmojiVariationPic2 = useEmojiVariationPickerState(), variationPicker = _useEmojiVariationPic2[0];
  var _useSkinToneFanOpenSt2 = useSkinToneFanOpenState(), skinToneFanOpen = _useSkinToneFanOpenSt2[0];
  return function hasOpenToggles() {
    return !!variationPicker || skinToneFanOpen;
  };
}
function useDisallowMouseMove() {
  var DisallowMouseRef = useDisallowMouseRef();
  return function disallowMouseMove() {
    DisallowMouseRef.current = true;
  };
}
function useAllowMouseMove() {
  var DisallowMouseRef = useDisallowMouseRef();
  return function allowMouseMove() {
    DisallowMouseRef.current = false;
  };
}
function useIsMouseDisallowed() {
  var DisallowMouseRef = useDisallowMouseRef();
  return function isMouseDisallowed() {
    return DisallowMouseRef.current;
  };
}
function useOnMouseMove() {
  var BodyRef = useBodyRef();
  var allowMouseMove = useAllowMouseMove();
  var isMouseDisallowed = useIsMouseDisallowed();
  (0, import_react.useEffect)(function() {
    var bodyRef = BodyRef.current;
    bodyRef == null ? void 0 : bodyRef.addEventListener("mousemove", onMouseMove, {
      passive: true
    });
    function onMouseMove() {
      if (isMouseDisallowed()) {
        allowMouseMove();
      }
    }
    return function() {
      bodyRef == null ? void 0 : bodyRef.removeEventListener("mousemove", onMouseMove);
    };
  }, [BodyRef, allowMouseMove, isMouseDisallowed]);
}
function useFocusSearchInput() {
  var SearchInputRef = useSearchInputRef();
  return (0, import_react.useCallback)(function() {
    focusElement(SearchInputRef.current);
  }, [SearchInputRef]);
}
function useFocusSkinTonePicker() {
  var SkinTonePickerRef = useSkinTonePickerRef();
  return (0, import_react.useCallback)(function() {
    if (!SkinTonePickerRef.current) {
      return;
    }
    focusFirstElementChild(SkinTonePickerRef.current);
  }, [SkinTonePickerRef]);
}
function useFocusCategoryNavigation() {
  var CategoryNavigationRef = useCategoryNavigationRef();
  return (0, import_react.useCallback)(function() {
    if (!CategoryNavigationRef.current) {
      return;
    }
    focusFirstElementChild(CategoryNavigationRef.current);
  }, [CategoryNavigationRef]);
}
function useSetFilterRef() {
  var filterRef = useFilterRef();
  return function setFilter(setter) {
    if (typeof setter === "function") {
      return setFilter(setter(filterRef.current));
    }
    filterRef.current = setter;
  };
}
function useClearSearch() {
  var applySearch = useApplySearch();
  var SearchInputRef = useSearchInputRef();
  var focusSearchInput = useFocusSearchInput();
  return function clearSearch() {
    if (SearchInputRef.current) {
      SearchInputRef.current.value = "";
    }
    applySearch("");
    focusSearchInput();
  };
}
function useAppendSearch() {
  var SearchInputRef = useSearchInputRef();
  var applySearch = useApplySearch();
  return function appendSearch(str) {
    if (SearchInputRef.current) {
      SearchInputRef.current.value = "" + SearchInputRef.current.value + str;
      applySearch(getNormalizedSearchTerm(SearchInputRef.current.value));
    } else {
      applySearch(getNormalizedSearchTerm(str));
    }
  };
}
function useFilter() {
  var SearchInputRef = useSearchInputRef();
  var filterRef = useFilterRef();
  var setFilterRef = useSetFilterRef();
  var applySearch = useApplySearch();
  var _useSearchTermState = useSearchTermState(), searchTerm = _useSearchTermState[0];
  var statusSearchResults = getStatusSearchResults(filterRef.current, searchTerm);
  return {
    onChange,
    searchTerm,
    SearchInputRef,
    statusSearchResults
  };
  function onChange(inputValue) {
    var filter = filterRef.current;
    var nextValue = inputValue.toLowerCase();
    if (filter != null && filter[nextValue] || nextValue.length <= 1) {
      return applySearch(nextValue);
    }
    var longestMatch = findLongestMatch(nextValue, filter);
    if (!longestMatch) {
      return applySearch(nextValue);
    }
    setFilterRef(function(current) {
      var _Object$assign;
      return Object.assign(current, (_Object$assign = {}, _Object$assign[nextValue] = filterEmojiObjectByKeyword(longestMatch, nextValue), _Object$assign));
    });
    applySearch(nextValue);
  }
}
function useApplySearch() {
  var _useSearchTermState2 = useSearchTermState(), setSearchTerm = _useSearchTermState2[1];
  var PickerMainRef = usePickerMainRef();
  return function applySearch(searchTerm) {
    requestAnimationFrame(function() {
      setSearchTerm(searchTerm ? searchTerm == null ? void 0 : searchTerm.toLowerCase() : searchTerm).then(function() {
        scrollTo(PickerMainRef.current, 0);
      });
    });
  };
}
function filterEmojiObjectByKeyword(emojis2, keyword) {
  var filtered = {};
  for (var unified in emojis2) {
    var emoji = emojis2[unified];
    if (hasMatch(emoji, keyword)) {
      filtered[unified] = emoji;
    }
  }
  return filtered;
}
function hasMatch(emoji, keyword) {
  return emojiNames(emoji).some(function(name) {
    return name.includes(keyword);
  });
}
function useIsEmojiFiltered() {
  var _useFilterRef = useFilterRef(), filter = _useFilterRef.current;
  var _useSearchTermState3 = useSearchTermState(), searchTerm = _useSearchTermState3[0];
  return function(unified) {
    return isEmojiFilteredBySearchTerm(unified, filter, searchTerm);
  };
}
function isEmojiFilteredBySearchTerm(unified, filter, searchTerm) {
  var _filter$searchTerm;
  if (!filter || !searchTerm) {
    return false;
  }
  return !((_filter$searchTerm = filter[searchTerm]) != null && _filter$searchTerm[unified]);
}
function findLongestMatch(keyword, dict) {
  if (!dict) {
    return null;
  }
  if (dict[keyword]) {
    return dict[keyword];
  }
  var longestMatchingKey = Object.keys(dict).sort(function(a, b) {
    return b.length - a.length;
  }).find(function(key) {
    return keyword.includes(key);
  });
  if (longestMatchingKey) {
    return dict[longestMatchingKey];
  }
  return null;
}
function getNormalizedSearchTerm(str) {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.trim().toLowerCase();
}
function getStatusSearchResults(filterState, searchTerm) {
  var _Object$entries;
  if (!(filterState != null && filterState[searchTerm]))
    return "";
  var searchResultsCount = ((_Object$entries = Object.entries(filterState == null ? void 0 : filterState[searchTerm])) == null ? void 0 : _Object$entries.length) || 0;
  return useSearchResultsConfig(searchResultsCount);
}
function useSetVariationPicker() {
  var setAnchoredEmojiRef = useSetAnchoredEmojiRef();
  var _useEmojiVariationPic = useEmojiVariationPickerState(), setEmojiVariationPicker = _useEmojiVariationPic[1];
  return function setVariationPicker(element) {
    var _emojiFromElement = emojiFromElement(element), emoji = _emojiFromElement[0];
    if (emoji) {
      setAnchoredEmojiRef(element);
      setEmojiVariationPicker(emoji);
    }
  };
}
function useIsSkinToneInSearch() {
  var skinTonePickerLocationConfig = useSkinTonePickerLocationConfig();
  return skinTonePickerLocationConfig === SkinTonePickerLocation.SEARCH;
}
function useIsSkinToneInPreview() {
  var skinTonePickerLocationConfig = useSkinTonePickerLocationConfig();
  return skinTonePickerLocationConfig === SkinTonePickerLocation.PREVIEW;
}
var KeyboardEvents;
(function(KeyboardEvents2) {
  KeyboardEvents2["ArrowDown"] = "ArrowDown";
  KeyboardEvents2["ArrowUp"] = "ArrowUp";
  KeyboardEvents2["ArrowLeft"] = "ArrowLeft";
  KeyboardEvents2["ArrowRight"] = "ArrowRight";
  KeyboardEvents2["Escape"] = "Escape";
  KeyboardEvents2["Enter"] = "Enter";
  KeyboardEvents2["Space"] = " ";
})(KeyboardEvents || (KeyboardEvents = {}));
function useKeyboardNavigation() {
  usePickerMainKeyboardEvents();
  useSearchInputKeyboardEvents();
  useSkinTonePickerKeyboardEvents();
  useCategoryNavigationKeyboardEvents();
  useBodyKeyboardEvents();
}
function usePickerMainKeyboardEvents() {
  var PickerMainRef = usePickerMainRef();
  var clearSearch = useClearSearch();
  var scrollTo2 = useScrollTo();
  var SearchInputRef = useSearchInputRef();
  var focusSearchInput = useFocusSearchInput();
  var hasOpenToggles = useHasOpenToggles();
  var disallowMouseMove = useDisallowMouseMove();
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var onKeyDown = (0, import_react.useMemo)(function() {
    return function onKeyDown2(event) {
      var key = event.key;
      disallowMouseMove();
      switch (key) {
        case KeyboardEvents.Escape:
          event.preventDefault();
          if (hasOpenToggles()) {
            closeAllOpenToggles();
            return;
          }
          clearSearch();
          scrollTo2(0);
          focusSearchInput();
          break;
      }
    };
  }, [scrollTo2, clearSearch, closeAllOpenToggles, focusSearchInput, hasOpenToggles, disallowMouseMove]);
  (0, import_react.useEffect)(function() {
    var current = PickerMainRef.current;
    if (!current) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return function() {
      current.removeEventListener("keydown", onKeyDown);
    };
  }, [PickerMainRef, SearchInputRef, scrollTo2, onKeyDown]);
}
function useSearchInputKeyboardEvents() {
  var focusSkinTonePicker = useFocusSkinTonePicker();
  var PickerMainRef = usePickerMainRef();
  var BodyRef = useBodyRef();
  var SearchInputRef = useSearchInputRef();
  var _useSkinToneFanOpenSt = useSkinToneFanOpenState(), setSkinToneFanOpenState = _useSkinToneFanOpenSt[1];
  var goDownFromSearchInput = useGoDownFromSearchInput();
  var isSkinToneInSearch = useIsSkinToneInSearch();
  var onKeyDown = (0, import_react.useMemo)(function() {
    return function onKeyDown2(event) {
      var key = event.key;
      switch (key) {
        case KeyboardEvents.ArrowRight:
          if (!isSkinToneInSearch) {
            return;
          }
          event.preventDefault();
          setSkinToneFanOpenState(true);
          focusSkinTonePicker();
          break;
        case KeyboardEvents.ArrowDown:
          event.preventDefault();
          goDownFromSearchInput();
          break;
        case KeyboardEvents.Enter:
          event.preventDefault();
          focusAndClickFirstVisibleEmoji(BodyRef.current);
          break;
      }
    };
  }, [focusSkinTonePicker, goDownFromSearchInput, setSkinToneFanOpenState, BodyRef, isSkinToneInSearch]);
  (0, import_react.useEffect)(function() {
    var current = SearchInputRef.current;
    if (!current) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return function() {
      current.removeEventListener("keydown", onKeyDown);
    };
  }, [PickerMainRef, SearchInputRef, onKeyDown]);
}
function useSkinTonePickerKeyboardEvents() {
  var SkinTonePickerRef = useSkinTonePickerRef();
  var focusSearchInput = useFocusSearchInput();
  var SearchInputRef = useSearchInputRef();
  var goDownFromSearchInput = useGoDownFromSearchInput();
  var _useSkinToneFanOpenSt2 = useSkinToneFanOpenState(), isOpen = _useSkinToneFanOpenSt2[0], setIsOpen = _useSkinToneFanOpenSt2[1];
  var isSkinToneInPreview = useIsSkinToneInPreview();
  var isSkinToneInSearch = useIsSkinToneInSearch();
  var onType = useOnType();
  var onKeyDown = (0, import_react.useMemo)(function() {
    return (
      // eslint-disable-next-line complexity
      function onKeyDown2(event) {
        var key = event.key;
        if (isSkinToneInSearch) {
          switch (key) {
            case KeyboardEvents.ArrowLeft:
              event.preventDefault();
              if (!isOpen) {
                return focusSearchInput();
              }
              focusNextSkinTone(focusSearchInput);
              break;
            case KeyboardEvents.ArrowRight:
              event.preventDefault();
              if (!isOpen) {
                return focusSearchInput();
              }
              focusPrevSkinTone();
              break;
            case KeyboardEvents.ArrowDown:
              event.preventDefault();
              if (isOpen) {
                setIsOpen(false);
              }
              goDownFromSearchInput();
              break;
            default:
              onType(event);
              break;
          }
        }
        if (isSkinToneInPreview) {
          switch (key) {
            case KeyboardEvents.ArrowUp:
              event.preventDefault();
              if (!isOpen) {
                return focusSearchInput();
              }
              focusNextSkinTone(focusSearchInput);
              break;
            case KeyboardEvents.ArrowDown:
              event.preventDefault();
              if (!isOpen) {
                return focusSearchInput();
              }
              focusPrevSkinTone();
              break;
            default:
              onType(event);
              break;
          }
        }
      }
    );
  }, [isOpen, focusSearchInput, setIsOpen, goDownFromSearchInput, onType, isSkinToneInPreview, isSkinToneInSearch]);
  (0, import_react.useEffect)(function() {
    var current = SkinTonePickerRef.current;
    if (!current) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return function() {
      current.removeEventListener("keydown", onKeyDown);
    };
  }, [SkinTonePickerRef, SearchInputRef, isOpen, onKeyDown]);
}
function useCategoryNavigationKeyboardEvents() {
  var focusSearchInput = useFocusSearchInput();
  var CategoryNavigationRef = useCategoryNavigationRef();
  var BodyRef = useBodyRef();
  var onType = useOnType();
  var onKeyDown = (0, import_react.useMemo)(function() {
    return function onKeyDown2(event) {
      var key = event.key;
      switch (key) {
        case KeyboardEvents.ArrowUp:
          event.preventDefault();
          focusSearchInput();
          break;
        case KeyboardEvents.ArrowRight:
          event.preventDefault();
          focusNextElementSibling(getActiveElement());
          break;
        case KeyboardEvents.ArrowLeft:
          event.preventDefault();
          focusPrevElementSibling(getActiveElement());
          break;
        case KeyboardEvents.ArrowDown:
          event.preventDefault();
          focusFirstVisibleEmoji(BodyRef.current);
          break;
        default:
          onType(event);
          break;
      }
    };
  }, [BodyRef, focusSearchInput, onType]);
  (0, import_react.useEffect)(function() {
    var current = CategoryNavigationRef.current;
    if (!current) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return function() {
      current.removeEventListener("keydown", onKeyDown);
    };
  }, [CategoryNavigationRef, BodyRef, onKeyDown]);
}
function useBodyKeyboardEvents() {
  var BodyRef = useBodyRef();
  var goUpFromBody = useGoUpFromBody();
  var setVariationPicker = useSetVariationPicker();
  var hasOpenToggles = useHasOpenToggles();
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var onType = useOnType();
  var onKeyDown = (0, import_react.useMemo)(function() {
    return (
      // eslint-disable-next-line complexity
      function onKeyDown2(event) {
        var key = event.key;
        var activeElement = buttonFromTarget(getActiveElement());
        switch (key) {
          case KeyboardEvents.ArrowRight:
            event.preventDefault();
            focusNextVisibleEmoji(activeElement);
            break;
          case KeyboardEvents.ArrowLeft:
            event.preventDefault();
            focusPrevVisibleEmoji(activeElement);
            break;
          case KeyboardEvents.ArrowDown:
            event.preventDefault();
            if (hasOpenToggles()) {
              closeAllOpenToggles();
              break;
            }
            focusVisibleEmojiOneRowDown(activeElement);
            break;
          case KeyboardEvents.ArrowUp:
            event.preventDefault();
            if (hasOpenToggles()) {
              closeAllOpenToggles();
              break;
            }
            focusVisibleEmojiOneRowUp(activeElement, goUpFromBody);
            break;
          case KeyboardEvents.Space:
            event.preventDefault();
            setVariationPicker(event.target);
            break;
          default:
            onType(event);
            break;
        }
      }
    );
  }, [goUpFromBody, onType, setVariationPicker, hasOpenToggles, closeAllOpenToggles]);
  (0, import_react.useEffect)(function() {
    var current = BodyRef.current;
    if (!current) {
      return;
    }
    current.addEventListener("keydown", onKeyDown);
    return function() {
      current.removeEventListener("keydown", onKeyDown);
    };
  }, [BodyRef, onKeyDown]);
}
function useGoDownFromSearchInput() {
  var focusCategoryNavigation = useFocusCategoryNavigation();
  var isSearchMode = useIsSearchMode();
  var BodyRef = useBodyRef();
  return (0, import_react.useCallback)(function goDownFromSearchInput() {
    if (isSearchMode) {
      return focusFirstVisibleEmoji(BodyRef.current);
    }
    return focusCategoryNavigation();
  }, [BodyRef, focusCategoryNavigation, isSearchMode]);
}
function useGoUpFromBody() {
  var focusSearchInput = useFocusSearchInput();
  var focusCategoryNavigation = useFocusCategoryNavigation();
  var isSearchMode = useIsSearchMode();
  return (0, import_react.useCallback)(function goUpFromEmoji() {
    if (isSearchMode) {
      return focusSearchInput();
    }
    return focusCategoryNavigation();
  }, [focusSearchInput, isSearchMode, focusCategoryNavigation]);
}
function focusNextSkinTone(exitLeft) {
  var currentSkinTone = getActiveElement();
  if (!currentSkinTone) {
    return;
  }
  if (!hasNextElementSibling(currentSkinTone)) {
    exitLeft();
  }
  focusNextElementSibling(currentSkinTone);
}
function focusPrevSkinTone() {
  var currentSkinTone = getActiveElement();
  if (!currentSkinTone) {
    return;
  }
  focusPrevElementSibling(currentSkinTone);
}
function useOnType() {
  var appendSearch = useAppendSearch();
  var focusSearchInput = useFocusSearchInput();
  var searchDisabled = useSearchDisabledConfig();
  var closeAllOpenToggles = useCloseAllOpenToggles();
  return function onType(event) {
    var key = event.key;
    if (hasModifier(event) || searchDisabled) {
      return;
    }
    if (key.match(/(^[a-zA-Z0-9]$){1}/)) {
      event.preventDefault();
      closeAllOpenToggles();
      focusSearchInput();
      appendSearch(key);
    }
  };
}
function hasModifier(event) {
  var metaKey = event.metaKey, ctrlKey = event.ctrlKey, altKey = event.altKey;
  return metaKey || ctrlKey || altKey;
}
function preloadEmojiIfNeeded(emoji, emojiStyles2, scrollTop, clientHeight, topOffset, style, dimensions, getEmojiUrl) {
  if (!emoji) {
    return;
  }
  if (emojiStyles2 === EmojiStyle.NATIVE) {
    return;
  }
  var unified = emojiUnified(emoji);
  if (preloadedEmojs.has(unified)) {
    return;
  }
  if (!style || !dimensions) {
    return;
  }
  setTimeout(function() {
    var emojiTop = topOffset + style.top;
    var viewportBottom = scrollTop + clientHeight;
    var isJustBelowViewport = emojiTop >= viewportBottom && emojiTop < viewportBottom + dimensions.emojiSize * 2;
    if (isJustBelowViewport) {
      preloadEmoji(getEmojiUrl, emoji, emojiStyles2);
    }
  });
}
function preloadEmoji(getEmojiUrl, emoji, emojiStyle) {
  if (!emoji) {
    return;
  }
  var unified = emojiUnified(emoji);
  if (preloadedEmojs.has(unified)) {
    return;
  }
  preloadedEmojs.add(unified);
  emojiVariations(emoji).concat(unified).forEach(function(variation) {
    var emojiUrl = getEmojiUrl(variation, emojiStyle);
    preloadImage(emojiUrl);
  });
}
var preloadedEmojs = /* @__PURE__ */ new Set();
function preloadImage(url) {
  var image = new Image();
  image.src = url;
}
function useOnFocus() {
  var BodyRef = useBodyRef();
  var emojiStyle = useEmojiStyleConfig();
  var getEmojiUrl = useGetEmojiUrlConfig();
  (0, import_react.useEffect)(function() {
    if (emojiStyle === EmojiStyle.NATIVE) {
      return;
    }
    var bodyRef = BodyRef.current;
    bodyRef == null ? void 0 : bodyRef.addEventListener("focusin", onFocus);
    return function() {
      bodyRef == null ? void 0 : bodyRef.removeEventListener("focusin", onFocus);
    };
    function onFocus(event) {
      var button = buttonFromTarget(event.target);
      if (!button) {
        return;
      }
      var _emojiFromElement = emojiFromElement(button), emoji = _emojiFromElement[0];
      if (!emoji) {
        return;
      }
      if (emojiHasVariations(emoji)) {
        preloadEmoji(getEmojiUrl, emoji, emojiStyle);
      }
    }
  }, [BodyRef, emojiStyle, getEmojiUrl]);
}
var _excluded$1 = ["width", "height"];
var DEFAULT_LABEL_HEIGHT = 40;
function PickerMain(_ref) {
  var children = _ref.children;
  return (0, import_react.createElement)(PickerContextProvider, null, (0, import_react.createElement)(PickerRootElement, null, children));
}
function PickerRootElement(_ref2) {
  var _cx;
  var children = _ref2.children;
  var _useReactionsModeStat = useReactionsModeState(), reactionsMode = _useReactionsModeStat[0];
  var theme = useThemeConfig();
  var searchModeActive = useIsSearchMode();
  var PickerMainRef = usePickerMainRef();
  var className = useClassNameConfig();
  var style = useStyleConfig();
  useKeyboardNavigation();
  useOnFocus();
  var _ref3 = style || {}, width = _ref3.width, height = _ref3.height, styleProps = _objectWithoutPropertiesLoose(_ref3, _excluded$1);
  return (0, import_react.createElement)("aside", {
    className: cx(styles.main, styles.baseVariables, theme === Theme.DARK && styles.darkTheme, theme === Theme.AUTO && styles.autoThemeDark, (_cx = {}, _cx[ClassNames.searchActive] = searchModeActive, _cx), reactionsMode && styles.reactionsMenu, className),
    ref: PickerMainRef,
    style: _extends({}, styleProps, !reactionsMode && {
      height,
      width
    })
  }, children);
}
var DarkTheme = {
  "--epr-emoji-variation-picker-bg-color": "var(--epr-dark-emoji-variation-picker-bg-color)",
  "--epr-hover-bg-color-reduced-opacity": "var(--epr-dark-hover-bg-color-reduced-opacity)",
  "--epr-highlight-color": "var(--epr-dark-highlight-color)",
  "--epr-text-color": "var(--epr-dark-text-color)",
  "--epr-hover-bg-color": "var(--epr-dark-hover-bg-color)",
  "--epr-focus-bg-color": "var(--epr-dark-focus-bg-color)",
  "--epr-search-input-bg-color": "var(--epr-dark-search-input-bg-color)",
  "--epr-category-label-bg-color": "var(--epr-dark-category-label-bg-color)",
  "--epr-picker-border-color": "var(--epr-dark-picker-border-color)",
  "--epr-bg-color": "var(--epr-dark-bg-color)",
  "--epr-reactions-bg-color": "var(--epr-dark-reactions-bg-color)",
  "--epr-search-input-bg-color-active": "var(--epr-dark-search-input-bg-color-active)",
  "--epr-emoji-variation-indicator-color": "var(--epr-dark-emoji-variation-indicator-color)",
  "--epr-category-icon-active-color": "var(--epr-dark-category-icon-active-color)",
  "--epr-skin-tone-picker-menu-color": "var(--epr-dark-skin-tone-picker-menu-color)",
  "--epr-skin-tone-outer-border-color": "var(--epr-dark-skin-tone-outer-border-color)",
  "--epr-skin-tone-inner-border-color": "var(--epr-dark-skin-tone-inner-border-color)"
};
var styles = /* @__PURE__ */ stylesheet.create({
  main: {
    ".": ["epr-main", ClassNames.emojiPicker],
    position: "relative",
    display: "flex",
    flexDirection: "column",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--epr-picker-border-radius)",
    borderColor: "var(--epr-picker-border-color)",
    backgroundColor: "var(--epr-bg-color)",
    overflow: "hidden",
    transition: "height 0.3s ease-in-out, background-color 0.1s ease-in-out",
    "*": {
      boxSizing: "border-box",
      fontFamily: "sans-serif"
    }
  },
  baseVariables: {
    "--": {
      "--epr-highlight-color": "#007aeb",
      "--epr-hover-bg-color": "#e5f0fa",
      "--epr-hover-bg-color-reduced-opacity": "#e5f0fa80",
      "--epr-focus-bg-color": "#e0f0ff",
      "--epr-text-color": "#858585",
      "--epr-search-input-bg-color": "#f6f6f6",
      "--epr-picker-border-color": "#e7e7e7",
      "--epr-bg-color": "#fff",
      "--epr-reactions-bg-color": "#ffffff90",
      "--epr-category-icon-active-color": "#6aa8de",
      "--epr-skin-tone-picker-menu-color": "#ffffff95",
      "--epr-skin-tone-outer-border-color": "#555555",
      "--epr-skin-tone-inner-border-color": "var(--epr-bg-color)",
      "--epr-horizontal-padding": "10px",
      "--epr-picker-border-radius": "8px",
      /* Header */
      "--epr-header-padding": "15px var(--epr-horizontal-padding)",
      /* Skin Tone Picker */
      "--epr-active-skin-tone-indicator-border-color": "var(--epr-highlight-color)",
      "--epr-active-skin-hover-color": "var(--epr-hover-bg-color)",
      /* Search */
      "--epr-search-input-bg-color-active": "var(--epr-search-input-bg-color)",
      "--epr-search-input-padding": "0 30px",
      "--epr-search-input-border-radius": "8px",
      "--epr-search-input-height": "40px",
      "--epr-search-input-text-color": "var(--epr-text-color)",
      "--epr-search-input-placeholder-color": "var(--epr-text-color)",
      "--epr-search-bar-inner-padding": "var(--epr-horizontal-padding)",
      "--epr-search-border-color": "var(--epr-search-input-bg-color)",
      "--epr-search-border-color-active": "var(--epr-highlight-color)",
      /*  Category Navigation */
      "--epr-category-navigation-button-size": "30px",
      /* Variation Picker */
      "--epr-emoji-variation-picker-height": "45px",
      "--epr-emoji-variation-picker-bg-color": "var(--epr-bg-color)",
      /*  Preview */
      "--epr-preview-height": "70px",
      "--epr-preview-text-size": "14px",
      "--epr-preview-text-padding": "0 var(--epr-horizontal-padding)",
      "--epr-preview-border-color": "var(--epr-picker-border-color)",
      "--epr-preview-text-color": "var(--epr-text-color)",
      /* Category */
      "--epr-category-padding": "0 var(--epr-horizontal-padding)",
      /*  Category Label */
      "--epr-category-label-bg-color": "#ffffffe6",
      "--epr-category-label-text-color": "var(--epr-text-color)",
      "--epr-category-label-padding": "0 var(--epr-horizontal-padding)",
      "--epr-category-label-height": DEFAULT_LABEL_HEIGHT + "px",
      /*  Emoji */
      "--epr-emoji-size": "30px",
      "--epr-emoji-padding": "5px",
      "--epr-emoji-fullsize": "calc(var(--epr-emoji-size) + var(--epr-emoji-padding) * 2)",
      "--epr-emoji-hover-color": "var(--epr-hover-bg-color)",
      "--epr-emoji-variation-indicator-color": "var(--epr-picker-border-color)",
      "--epr-emoji-variation-indicator-color-hover": "var(--epr-text-color)",
      /* Z-Index */
      "--epr-header-overlay-z-index": "3",
      "--epr-emoji-variations-indictator-z-index": "1",
      "--epr-category-label-z-index": "2",
      "--epr-skin-variation-picker-z-index": "5",
      "--epr-preview-z-index": "6",
      /* Dark Theme Variables */
      "--epr-dark": "#000",
      "--epr-dark-emoji-variation-picker-bg-color": "var(--epr-dark)",
      "--epr-dark-highlight-color": "#c0c0c0",
      "--epr-dark-text-color": "var(--epr-highlight-color)",
      "--epr-dark-hover-bg-color": "#363636f6",
      "--epr-dark-hover-bg-color-reduced-opacity": "#36363680",
      "--epr-dark-focus-bg-color": "#474747",
      "--epr-dark-search-input-bg-color": "#333333",
      "--epr-dark-category-label-bg-color": "#222222e6",
      "--epr-dark-picker-border-color": "#151617",
      "--epr-dark-bg-color": "#222222",
      "--epr-dark-reactions-bg-color": "#22222290",
      "--epr-dark-search-input-bg-color-active": "var(--epr-dark)",
      "--epr-dark-emoji-variation-indicator-color": "#444",
      "--epr-dark-category-icon-active-color": "#3271b7",
      "--epr-dark-skin-tone-picker-menu-color": "#22222295",
      "--epr-dark-skin-tone-outer-border-color": "var(--epr-dark-picker-border-color)",
      "--epr-dark-skin-tone-inner-border-color": "#00000000"
    }
  },
  autoThemeDark: {
    ".": ClassNames.autoTheme,
    "@media (prefers-color-scheme: dark)": {
      "--": DarkTheme
    }
  },
  darkTheme: {
    ".": ClassNames.darkTheme,
    "--": DarkTheme
  },
  reactionsMenu: {
    ".": "epr-reactions",
    height: "50px",
    display: "inline-flex",
    backgroundColor: "var(--epr-reactions-bg-color)",
    // @ts-ignore - backdropFilter is not recognized.
    backdropFilter: "blur(8px)",
    "--": {
      "--epr-picker-border-radius": "50px"
    }
  }
});
function elementCountInRow(parent, element) {
  if (!parent || !element) {
    return 0;
  }
  var parentWidth = parent.getBoundingClientRect().width;
  var elementWidth = element.getBoundingClientRect().width;
  return Math.floor(parentWidth / elementWidth);
}
function firstVisibleElementInContainer(parent, elements, maxVisibilityDiffThreshold) {
  if (maxVisibilityDiffThreshold === void 0) {
    maxVisibilityDiffThreshold = 0;
  }
  if (!parent || !elements.length) {
    return null;
  }
  var parentTop = parent.getBoundingClientRect().top;
  var parentBottom = parent.getBoundingClientRect().bottom;
  var parentTopWithLabel = parentTop + getLabelHeight(parent);
  var visibleElements = elements.find(function(element) {
    var elementTop = element.getBoundingClientRect().top;
    var elementBottom = element.getBoundingClientRect().bottom;
    var maxVisibilityDiffPixels = element.clientHeight * maxVisibilityDiffThreshold;
    var elementTopWithAllowedDiff = elementTop + maxVisibilityDiffPixels;
    var elementBottomWithAllowedDiff = elementBottom - maxVisibilityDiffPixels;
    if (elementTopWithAllowedDiff < parentTopWithLabel) {
      return false;
    }
    return elementTopWithAllowedDiff >= parentTop && elementTopWithAllowedDiff <= parentBottom || elementBottomWithAllowedDiff >= parentTop && elementBottomWithAllowedDiff <= parentBottom;
  });
  return visibleElements || null;
}
function hasNextElementSibling(element) {
  return !!element.nextElementSibling;
}
function getLabelHeight(parentNode) {
  if (!parentNode) {
    return DEFAULT_LABEL_HEIGHT;
  }
  var label = parentNode.querySelector(asSelectors(ClassNames.label));
  if (label) {
    var height = label.getBoundingClientRect().height;
    if (height > 0) {
      return height;
    }
  }
  return DEFAULT_LABEL_HEIGHT;
}
var EmojiButtonSelector = "button" + /* @__PURE__ */ asSelectors(ClassNames.emoji);
var VisibleEmojiSelector = /* @__PURE__ */ [EmojiButtonSelector, asSelectors(ClassNames.visible), ":not(" + asSelectors(ClassNames.hidden) + ")"].join("");
function buttonFromTarget(emojiElement) {
  var _emojiElement$closest;
  return (_emojiElement$closest = emojiElement == null ? void 0 : emojiElement.closest(EmojiButtonSelector)) != null ? _emojiElement$closest : null;
}
function emojiFromElement(element) {
  var originalUnified = originalUnifiedFromEmojiElement(element);
  var unified = unifiedFromEmojiElement(element);
  if (!originalUnified) {
    return [];
  }
  var emoji = emojiByUnified(unified != null ? unified : originalUnified);
  if (!emoji) {
    return [];
  }
  return [emoji, unified];
}
function isEmojiElement(element) {
  var _element$parentElemen;
  return Boolean((element == null ? void 0 : element.matches(EmojiButtonSelector)) || (element == null ? void 0 : (_element$parentElemen = element.parentElement) == null ? void 0 : _element$parentElemen.matches(EmojiButtonSelector)));
}
function elementHeight(element) {
  var _element$clientHeight;
  return (_element$clientHeight = element == null ? void 0 : element.clientHeight) != null ? _element$clientHeight : 0;
}
function emojiTrueOffsetTop(element) {
  if (!element) {
    return 0;
  }
  var button = buttonFromTarget(element);
  var category = closestCategory(button);
  var labelHeight = categoryLabelHeight(category);
  return elementOffsetTop(button) + elementOffsetTop(category) + labelHeight;
}
function categoryLabelHeight(category) {
  var _category$clientHeigh, _categoryWithoutLabel;
  if (!category) {
    return 0;
  }
  var categoryWithoutLabel = category.querySelector(asSelectors(ClassNames.categoryContent));
  return ((_category$clientHeigh = category == null ? void 0 : category.clientHeight) != null ? _category$clientHeigh : 0) - ((_categoryWithoutLabel = categoryWithoutLabel == null ? void 0 : categoryWithoutLabel.clientHeight) != null ? _categoryWithoutLabel : 0);
}
function isEmojiBehindLabel(emoji) {
  if (!emoji) {
    return false;
  }
  return emojiDistanceFromScrollTop(emoji) < categoryLabelHeight(closestCategory(emoji));
}
function queryScrollBody(root) {
  if (!root)
    return null;
  return root.matches(asSelectors(ClassNames.scrollBody)) ? root : root.querySelector(asSelectors(ClassNames.scrollBody));
}
function emojiDistanceFromScrollTop(emoji) {
  var _closestScrollBody$sc, _closestScrollBody;
  if (!emoji) {
    return 0;
  }
  return emojiTrueOffsetTop(emoji) - ((_closestScrollBody$sc = (_closestScrollBody = closestScrollBody(emoji)) == null ? void 0 : _closestScrollBody.scrollTop) != null ? _closestScrollBody$sc : 0);
}
function closestScrollBody(element) {
  var _element$closest;
  if (!element) {
    return null;
  }
  return (_element$closest = element.closest(asSelectors(ClassNames.scrollBody))) != null ? _element$closest : null;
}
function emojiTruOffsetLeft(element) {
  var button = buttonFromTarget(element);
  var category = closestCategory(button);
  return elementOffsetLeft(button) + elementOffsetLeft(category);
}
function elementOffsetTop(element) {
  var _element$offsetTop;
  return (_element$offsetTop = element == null ? void 0 : element.offsetTop) != null ? _element$offsetTop : 0;
}
function elementOffsetLeft(element) {
  var _element$offsetLeft;
  return (_element$offsetLeft = element == null ? void 0 : element.offsetLeft) != null ? _element$offsetLeft : 0;
}
function unifiedFromEmojiElement(emoji) {
  var _elementDataSetKey;
  return (_elementDataSetKey = elementDataSetKey(buttonFromTarget(emoji), "unified")) != null ? _elementDataSetKey : null;
}
function originalUnifiedFromEmojiElement(emoji) {
  var unified = unifiedFromEmojiElement(emoji);
  if (unified) {
    return unifiedWithoutSkinTone(unified);
  }
  return null;
}
function allUnifiedFromEmojiElement(emoji) {
  if (!emoji) {
    return {
      unified: null,
      originalUnified: null
    };
  }
  return {
    unified: unifiedFromEmojiElement(emoji),
    originalUnified: originalUnifiedFromEmojiElement(emoji)
  };
}
function elementDataSetKey(element, key) {
  var _elementDataSet$key;
  return (_elementDataSet$key = elementDataSet(element)[key]) != null ? _elementDataSet$key : null;
}
function elementDataSet(element) {
  var _element$dataset;
  return (_element$dataset = element == null ? void 0 : element.dataset) != null ? _element$dataset : {};
}
function isVisibleEmoji(element) {
  return element.classList.contains(ClassNames.visible);
}
function isHidden(element) {
  if (!element)
    return true;
  return element.classList.contains(ClassNames.hidden);
}
function allVisibleEmojis(parent) {
  if (!parent) {
    return [];
  }
  return Array.from(parent.querySelectorAll(VisibleEmojiSelector));
}
function lastVisibleEmoji(element) {
  if (!element)
    return null;
  var allEmojis2 = allVisibleEmojis(element);
  var _allEmojis$slice = allEmojis2.slice(-1), last = _allEmojis$slice[0];
  if (!last) {
    return null;
  }
  if (!isVisibleEmoji(last)) {
    return prevVisibleEmoji(last);
  }
  return last;
}
function nextVisibleEmoji(element) {
  var next = element.nextElementSibling;
  if (!next) {
    return firstVisibleEmoji(nextCategory(element));
  }
  if (!isVisibleEmoji(next)) {
    return nextVisibleEmoji(next);
  }
  return next;
}
function prevVisibleEmoji(element) {
  var prev = element.previousElementSibling;
  if (!prev) {
    return lastVisibleEmoji(prevCategory(element));
  }
  if (!isVisibleEmoji(prev)) {
    return prevVisibleEmoji(prev);
  }
  return prev;
}
function firstVisibleEmoji(parent) {
  if (!parent) {
    return null;
  }
  var allEmojis2 = allVisibleEmojis(parent);
  return firstVisibleElementInContainer(parent, allEmojis2, 0.1);
}
function prevCategory(element) {
  var category = closestCategory(element);
  if (!category) {
    return null;
  }
  var prev = category.previousElementSibling;
  if (!prev) {
    return null;
  }
  if (isHidden(prev)) {
    return prevCategory(prev);
  }
  return prev;
}
function nextCategory(element) {
  var category = closestCategory(element);
  if (!category) {
    return null;
  }
  var next = category.nextElementSibling;
  if (!next) {
    return null;
  }
  if (isHidden(next)) {
    return nextCategory(next);
  }
  return next;
}
function closestCategory(element) {
  if (!element) {
    return null;
  }
  return element.closest(asSelectors(ClassNames.category));
}
function closestCategoryContent(element) {
  if (!element) {
    return null;
  }
  return element.closest(asSelectors(ClassNames.categoryContent));
}
function parseNativeEmoji(unified) {
  return unified.split("-").map(function(hex) {
    return String.fromCodePoint(parseInt(hex, 16));
  }).join("");
}
function isCustomCategory(category) {
  return category.category === Categories.CUSTOM;
}
function isCustomEmoji(emoji) {
  return emoji.imgUrl !== void 0;
}
function useMouseDownHandlers(ContainerRef, mouseEventSource) {
  var mouseDownTimerRef = (0, import_react.useRef)();
  var setVariationPicker = useSetVariationPicker();
  var disallowClickRef = useDisallowClickRef();
  var _useEmojiVariationPic = useEmojiVariationPickerState(), setEmojiVariationPicker = _useEmojiVariationPic[1];
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var _useActiveSkinToneSta = useActiveSkinToneState(), activeSkinTone = _useActiveSkinToneSta[0];
  var onEmojiClick = useOnEmojiClickConfig(mouseEventSource);
  var _useUpdateSuggested = useUpdateSuggested(), updateSuggested = _useUpdateSuggested[1];
  var getEmojiUrl = useGetEmojiUrlConfig();
  var activeEmojiStyle = useEmojiStyleConfig();
  var onClick = (0, import_react.useCallback)(function onClick2(event) {
    if (disallowClickRef.current) {
      return;
    }
    closeAllOpenToggles();
    var _emojiFromEvent = emojiFromEvent(event), emoji = _emojiFromEvent[0], unified = _emojiFromEvent[1];
    if (!emoji || !unified) {
      return;
    }
    var skinToneToUse = activeVariationFromUnified(unified) || activeSkinTone;
    updateSuggested();
    setSuggested(emoji, skinToneToUse);
    onEmojiClick(emojiClickOutput(emoji, skinToneToUse, activeEmojiStyle, getEmojiUrl), event);
  }, [activeSkinTone, closeAllOpenToggles, disallowClickRef, onEmojiClick, updateSuggested, getEmojiUrl, activeEmojiStyle]);
  var onMouseDown = (0, import_react.useCallback)(function onMouseDown2(event) {
    var _window;
    if (mouseDownTimerRef.current) {
      clearTimeout(mouseDownTimerRef.current);
    }
    var _emojiFromEvent2 = emojiFromEvent(event), emoji = _emojiFromEvent2[0];
    if (!emoji || !emojiHasVariations(emoji)) {
      return;
    }
    mouseDownTimerRef.current = (_window = window) == null ? void 0 : _window.setTimeout(function() {
      disallowClickRef.current = true;
      mouseDownTimerRef.current = void 0;
      closeAllOpenToggles();
      setVariationPicker(event.target);
      setEmojiVariationPicker(emoji);
    }, 500);
  }, [disallowClickRef, closeAllOpenToggles, setVariationPicker, setEmojiVariationPicker]);
  var onMouseUp = (0, import_react.useCallback)(function onMouseUp2() {
    if (mouseDownTimerRef.current) {
      clearTimeout(mouseDownTimerRef.current);
      mouseDownTimerRef.current = void 0;
    } else if (disallowClickRef.current) {
      requestAnimationFrame(function() {
        disallowClickRef.current = false;
      });
    }
  }, [disallowClickRef]);
  (0, import_react.useEffect)(function() {
    if (!ContainerRef.current) {
      return;
    }
    var confainerRef = ContainerRef.current;
    confainerRef.addEventListener("click", onClick, {
      passive: true
    });
    confainerRef.addEventListener("mousedown", onMouseDown, {
      passive: true
    });
    confainerRef.addEventListener("mouseup", onMouseUp, {
      passive: true
    });
    return function() {
      confainerRef == null ? void 0 : confainerRef.removeEventListener("click", onClick);
      confainerRef == null ? void 0 : confainerRef.removeEventListener("mousedown", onMouseDown);
      confainerRef == null ? void 0 : confainerRef.removeEventListener("mouseup", onMouseUp);
    };
  }, [ContainerRef, onClick, onMouseDown, onMouseUp]);
}
function emojiFromEvent(event) {
  var target = event == null ? void 0 : event.target;
  if (!isEmojiElement(target)) {
    return [];
  }
  return emojiFromElement(target);
}
function emojiClickOutput(emoji, activeSkinTone, activeEmojiStyle, getEmojiUrl) {
  var names = emojiNames(emoji);
  if (isCustomEmoji(emoji)) {
    var _unified = emojiUnified(emoji);
    return {
      activeSkinTone,
      emoji: _unified,
      getImageUrl: function getImageUrl() {
        return emoji.imgUrl;
      },
      imageUrl: emoji.imgUrl,
      isCustom: true,
      names,
      unified: _unified,
      unifiedWithoutSkinTone: _unified
    };
  }
  var unified = emojiUnified(emoji, activeSkinTone);
  return {
    activeSkinTone,
    emoji: parseNativeEmoji(unified),
    getImageUrl: function getImageUrl(emojiStyle) {
      if (emojiStyle === void 0) {
        emojiStyle = activeEmojiStyle != null ? activeEmojiStyle : EmojiStyle.APPLE;
      }
      return getEmojiUrl(unified, emojiStyle);
    },
    imageUrl: getEmojiUrl(unified, activeEmojiStyle != null ? activeEmojiStyle : EmojiStyle.APPLE),
    isCustom: false,
    names,
    unified,
    unifiedWithoutSkinTone: emojiUnified(emoji)
  };
}
function Button(props) {
  return (0, import_react.createElement)("button", Object.assign({
    type: "button"
  }, props, {
    className: cx(styles$1.button, props.className)
  }), props.children);
}
var styles$1 = /* @__PURE__ */ stylesheet.create({
  button: {
    ".": "epr-btn",
    cursor: "pointer",
    border: "0",
    background: "none",
    outline: "none"
  }
});
function ClickableEmojiButton(_ref) {
  var _cx;
  var emojiNames2 = _ref.emojiNames, unified = _ref.unified, hidden2 = _ref.hidden, hiddenOnSearch = _ref.hiddenOnSearch, _ref$showVariations = _ref.showVariations, showVariations = _ref$showVariations === void 0 ? true : _ref$showVariations, hasVariations = _ref.hasVariations, children = _ref.children, className = _ref.className, _ref$noBackground = _ref.noBackground, noBackground = _ref$noBackground === void 0 ? false : _ref$noBackground, style = _ref.style;
  return (0, import_react.createElement)(Button, {
    className: cx(styles$2.emoji, hidden2 && commonStyles.hidden, hiddenOnSearch && commonInteractionStyles.hiddenOnSearch, (_cx = {}, _cx[ClassNames.visible] = !hidden2 && !hiddenOnSearch, _cx), !!(hasVariations && showVariations) && styles$2.hasVariations, noBackground && styles$2.noBackground, className),
    "data-unified": unified,
    "aria-label": getAriaLabel(emojiNames2),
    "data-full-name": emojiNames2,
    style
  }, children);
}
function getAriaLabel(emojiNames2) {
  var _emojiNames$;
  return emojiNames2[0].match("flag-") ? (_emojiNames$ = emojiNames2[1]) != null ? _emojiNames$ : emojiNames2[0] : emojiNames2[0];
}
var styles$2 = /* @__PURE__ */ stylesheet.create({
  emoji: {
    ".": ClassNames.emoji,
    position: "relative",
    width: "var(--epr-emoji-fullsize)",
    height: "var(--epr-emoji-fullsize)",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "var(--epr-emoji-fullsize)",
    maxHeight: "var(--epr-emoji-fullsize)",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "var(--epr-emoji-hover-color)"
    },
    ":focus": {
      backgroundColor: "var(--epr-focus-bg-color)"
    }
  },
  noBackground: {
    background: "none",
    ":hover": {
      backgroundColor: "transparent",
      background: "none"
    },
    ":focus": {
      backgroundColor: "transparent",
      background: "none"
    }
  },
  hasVariations: {
    ".": ClassNames.emojiHasVariations,
    ":after": {
      content: "",
      display: "block",
      width: "0",
      height: "0",
      right: "0px",
      bottom: "1px",
      position: "absolute",
      borderLeft: "4px solid transparent",
      borderRight: "4px solid transparent",
      transform: "rotate(135deg)",
      borderBottom: "4px solid var(--epr-emoji-variation-indicator-color)",
      zIndex: "var(--epr-emoji-variations-indictator-z-index)"
    },
    ":hover:after": {
      borderBottom: "4px solid var(--epr-emoji-variation-indicator-color-hover)"
    }
  }
});
var emojiStyles = /* @__PURE__ */ stylesheet.create({
  external: {
    ".": ClassNames.external,
    fontSize: "0"
  },
  common: {
    alignSelf: "center",
    justifySelf: "center",
    display: "block"
  }
});
function EmojiImg(_ref) {
  var emojiName2 = _ref.emojiName, style = _ref.style, _ref$lazyLoad = _ref.lazyLoad, lazyLoad = _ref$lazyLoad === void 0 ? false : _ref$lazyLoad, imgUrl = _ref.imgUrl, onError = _ref.onError, className = _ref.className;
  return (0, import_react.createElement)("img", {
    src: imgUrl,
    alt: emojiName2,
    className: cx(styles$3.emojiImag, emojiStyles.external, emojiStyles.common, className),
    loading: lazyLoad ? "lazy" : "eager",
    onError,
    style
  });
}
var styles$3 = /* @__PURE__ */ stylesheet.create({
  emojiImag: {
    ".": "epr-emoji-img",
    maxWidth: "var(--epr-emoji-fullsize)",
    maxHeight: "var(--epr-emoji-fullsize)",
    minWidth: "var(--epr-emoji-fullsize)",
    minHeight: "var(--epr-emoji-fullsize)",
    padding: "var(--epr-emoji-padding)"
  }
});
function NativeEmoji(_ref) {
  var unified = _ref.unified, style = _ref.style, className = _ref.className;
  return (0, import_react.createElement)("span", {
    className: cx(styles$4.nativeEmoji, emojiStyles.common, emojiStyles.external, className),
    "data-unified": unified,
    style
  }, parseNativeEmoji(unified));
}
var styles$4 = /* @__PURE__ */ stylesheet.create({
  nativeEmoji: {
    ".": "epr-emoji-native",
    fontFamily: '"Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "EmojiOne Color", "Android Emoji"!important',
    position: "relative",
    lineHeight: "100%",
    fontSize: "var(--epr-emoji-size)",
    textAlign: "center",
    alignSelf: "center",
    justifySelf: "center",
    letterSpacing: "0",
    padding: "var(--epr-emoji-padding)"
  }
});
function ViewOnlyEmoji(_ref) {
  var emoji = _ref.emoji, unified = _ref.unified, emojiStyle = _ref.emojiStyle, size = _ref.size, lazyLoad = _ref.lazyLoad, _ref$getEmojiUrl = _ref.getEmojiUrl, getEmojiUrl = _ref$getEmojiUrl === void 0 ? emojiUrlByUnified : _ref$getEmojiUrl, className = _ref.className;
  var _useEmojisThatFailedT = useEmojisThatFailedToLoadState(), setEmojisThatFailedToLoad = _useEmojisThatFailedT[1];
  var style = {};
  if (size) {
    style.width = style.height = style.fontSize = size + "px";
  }
  var emojiToRender = emoji ? emoji : emojiByUnified(unified);
  if (!emojiToRender) {
    return null;
  }
  if (isCustomEmoji(emojiToRender)) {
    return (0, import_react.createElement)(EmojiImg, {
      style,
      emojiName: unified,
      emojiStyle: EmojiStyle.NATIVE,
      lazyLoad,
      imgUrl: emojiToRender.imgUrl,
      onError,
      className
    });
  }
  return (0, import_react.createElement)(import_react.Fragment, null, emojiStyle === EmojiStyle.NATIVE ? (0, import_react.createElement)(NativeEmoji, {
    unified,
    style,
    className
  }) : (0, import_react.createElement)(EmojiImg, {
    style,
    emojiName: emojiName(emojiToRender),
    emojiStyle,
    lazyLoad,
    imgUrl: getEmojiUrl(unified, emojiStyle),
    onError,
    className
  }));
  function onError() {
    setEmojisThatFailedToLoad(function(prev) {
      return new Set(prev).add(unified);
    });
  }
}
function ClickableEmoji(_ref) {
  var emoji = _ref.emoji, unified = _ref.unified, hidden2 = _ref.hidden, hiddenOnSearch = _ref.hiddenOnSearch, emojiStyle = _ref.emojiStyle, _ref$showVariations = _ref.showVariations, showVariations = _ref$showVariations === void 0 ? true : _ref$showVariations, size = _ref.size, lazyLoad = _ref.lazyLoad, getEmojiUrl = _ref.getEmojiUrl, className = _ref.className, _ref$noBackground = _ref.noBackground, noBackground = _ref$noBackground === void 0 ? false : _ref$noBackground, style = _ref.style;
  var hasVariations = emojiHasVariations(emoji);
  return (0, import_react.createElement)(ClickableEmojiButton, {
    hasVariations,
    showVariations,
    hidden: hidden2,
    hiddenOnSearch,
    emojiNames: emojiNames(emoji),
    unified,
    noBackground,
    style
  }, (0, import_react.createElement)(ViewOnlyEmoji, {
    unified,
    emoji,
    size,
    emojiStyle,
    lazyLoad,
    getEmojiUrl,
    className
  }));
}
var Plus = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI4LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjgwcHgiIHZpZXdCb3g9IjAgMCAyMCA4MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAgODAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjODY4Njg2IiBkPSJNNS43LDEwLjRjMCwwLjEsMC4xLDAuMywwLjIsMC40QzYsMTAuOSw2LjEsMTEsNi4zLDExaDMuNHYzLjRjMCwwLjEsMC4xLDAuMywwLjIsMC40CgljMC4xLDAuMSwwLjIsMC4yLDAuNCwwLjJjMC4zLDAsMC41LTAuMiwwLjUtMC41di0zLjRoMy40YzAuMywwLDAuNS0wLjIsMC41LTAuNXMtMC4yLTAuNS0wLjUtMC41aC0zLjRWNi43YzAtMC4zLTAuMi0wLjUtMC41LTAuNQoJQzkuOCw2LDkuNiw2LjIsOS42LDYuNXYzLjRINi4yQzUuOSw5LjksNS43LDEwLjEsNS43LDEwLjRMNS43LDEwLjR6Ii8+CjxwYXRoIGZpbGw9IiMzMzcxQjciIGQ9Ik01LjcsMzAuNGMwLDAuMSwwLjEsMC4zLDAuMiwwLjRTNi4xLDMxLDYuMywzMWgzLjR2My40YzAsMC4xLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMiwwLjIsMC40LDAuMgoJYzAuMywwLDAuNS0wLjIsMC41LTAuNXYtMy40aDMuNGMwLjMsMCwwLjUtMC4yLDAuNS0wLjVzLTAuMi0wLjUtMC41LTAuNWgtMy40di0zLjRjMC0wLjMtMC4yLTAuNS0wLjUtMC41cy0wLjUsMC4yLTAuNSwwLjV2My40SDYuMgoJQzUuOSwyOS45LDUuNywzMC4xLDUuNywzMC40TDUuNywzMC40eiIvPgo8cGF0aCBmaWxsPSIjQzBDMEJGIiBkPSJNNS43LDUwLjRjMCwwLjEsMC4xLDAuMywwLjIsMC40QzYsNTAuOSw2LjEsNTEsNi4zLDUxaDMuNHYzLjRjMCwwLjEsMC4xLDAuMywwLjIsMC40CgljMC4xLDAuMSwwLjIsMC4yLDAuNCwwLjJjMC4zLDAsMC41LTAuMiwwLjUtMC41di0zLjRoMy40YzAuMywwLDAuNS0wLjIsMC41LTAuNXMtMC4yLTAuNS0wLjUtMC41aC0zLjR2LTMuNGMwLTAuMy0wLjItMC41LTAuNS0wLjUKCXMtMC41LDAuMi0wLjUsMC41djMuNEg2LjJDNS45LDQ5LjksNS43LDUwLjEsNS43LDUwLjRMNS43LDUwLjR6Ii8+CjxwYXRoIGZpbGw9IiM2QUE5REQiIGQ9Ik01LjcsNzAuNGMwLDAuMSwwLjEsMC4zLDAuMiwwLjRTNi4xLDcxLDYuMyw3MWgzLjR2My40YzAsMC4xLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMiwwLjIsMC40LDAuMgoJYzAuMywwLDAuNS0wLjIsMC41LTAuNXYtMy40aDMuNGMwLjMsMCwwLjUtMC4yLDAuNS0wLjVzLTAuMi0wLjUtMC41LTAuNWgtMy40di0zLjRjMC0wLjMtMC4yLTAuNS0wLjUtMC41cy0wLjUsMC4yLTAuNSwwLjV2My40SDYuNAoJQzUuOSw2OS45LDUuNyw3MC4xLDUuNyw3MC40TDUuNyw3MC40eiIvPgo8L3N2Zz4=";
function BtnPlus() {
  var _useReactionsModeStat = useReactionsModeState(), setReactionsMode = _useReactionsModeStat[1];
  return (0, import_react.createElement)(Button, {
    "aria-label": "Show all Emojis",
    title: "Show all Emojis",
    tabIndex: 0,
    className: cx(styles$5.plusSign),
    onClick: function onClick() {
      return setReactionsMode(false);
    }
  });
}
var styles$5 = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  plusSign: {
    fontSize: "20px",
    padding: "17px",
    color: "var(--epr-text-color)",
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "100%",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 0.2s ease-in-out",
    ":after": {
      content: "",
      minWidth: "20px",
      minHeight: "20px",
      backgroundImage: "url(" + Plus + ")",
      backgroundColor: "transparent",
      backgroundRepeat: "no-repeat",
      backgroundSize: "20px",
      backgroundPositionY: "0"
    },
    ":hover": {
      color: "var(--epr-highlight-color)",
      backgroundColor: "var(--epr-hover-bg-color-reduced-opacity)",
      ":after": {
        backgroundPositionY: "-20px"
      }
    },
    ":focus": {
      color: "var(--epr-highlight-color)",
      backgroundColor: "var(--epr-hover-bg-color-reduced-opacity)",
      ":after": {
        backgroundPositionY: "-40px"
      }
    }
  }
}, /* @__PURE__ */ darkMode("plusSign", {
  ":after": {
    backgroundPositionY: "-40px"
  },
  ":hover:after": {
    backgroundPositionY: "-60px"
  }
})));
function Reactions() {
  var _useReactionsModeStat = useReactionsModeState(), reactionsOpen = _useReactionsModeStat[0];
  var ReactionsRef = useReactionsRef();
  var reactions = useReactionsConfig();
  useMouseDownHandlers(ReactionsRef, MOUSE_EVENT_SOURCE.REACTIONS);
  var emojiStyle = useEmojiStyleConfig();
  var allowExpandReactions = useAllowExpandReactions();
  var getEmojiUrl = useGetEmojiUrlConfig();
  if (!reactionsOpen) {
    return null;
  }
  return (0, import_react.createElement)("ul", {
    className: cx(styles$6.list, !reactionsOpen && commonStyles.hidden),
    ref: ReactionsRef
  }, reactions.map(function(reaction) {
    return (0, import_react.createElement)("li", {
      key: reaction
    }, (0, import_react.createElement)(ClickableEmoji, {
      emoji: emojiByUnified(reaction),
      emojiStyle,
      unified: reaction,
      showVariations: false,
      className: cx(styles$6.emojiButton),
      noBackground: true,
      getEmojiUrl
    }));
  }), allowExpandReactions ? (0, import_react.createElement)("li", null, (0, import_react.createElement)(BtnPlus, null)) : null);
}
var styles$6 = /* @__PURE__ */ stylesheet.create({
  list: {
    listStyle: "none",
    margin: "0",
    padding: "0 5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%"
  },
  emojiButton: {
    ":hover": {
      transform: "scale(1.2)"
    },
    ":focus": {
      transform: "scale(1.2)"
    },
    ":active": {
      transform: "scale(1.1)"
    },
    transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.5)"
  }
});
function useOnScroll(BodyRef) {
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var _useState = (0, import_react.useState)(0), scrollTop = _useState[0], setScrollTop = _useState[1];
  (0, import_react.useEffect)(function() {
    var bodyRef = BodyRef.current;
    if (!bodyRef) {
      return;
    }
    bodyRef.addEventListener("scroll", onScroll, {
      passive: true
    });
    function onScroll() {
      var _bodyRef$scrollTop;
      setScrollTop((_bodyRef$scrollTop = bodyRef == null ? void 0 : bodyRef.scrollTop) != null ? _bodyRef$scrollTop : 0);
      closeAllOpenToggles();
    }
    return function() {
      bodyRef == null ? void 0 : bodyRef.removeEventListener("scroll", onScroll);
    };
  }, [BodyRef, closeAllOpenToggles]);
  return scrollTop;
}
function shouldVirtualize(_ref) {
  var scrollTop = _ref.scrollTop, clientHeight = _ref.clientHeight, topOffset = _ref.topOffset, style = _ref.style, dimensions = _ref.dimensions;
  if (!style || !dimensions) {
    return false;
  }
  var emojiTop = topOffset + style.top;
  var emojiBottom = emojiTop + dimensions.emojiSize;
  var isVisible = emojiBottom + dimensions.emojiSize * 2 >= scrollTop && emojiTop <= scrollTop + clientHeight + dimensions.emojiSize;
  return !isVisible;
}
function getEmojiPositionStyle(dimensions, index) {
  return dimensions ? {
    top: Math.floor(index / dimensions.emojisPerRow) * dimensions.emojiSize,
    left: index % dimensions.emojisPerRow * dimensions.emojiSize
  } : void 0;
}
var EMOJI_SIZE_DEFAULT = 32;
function useCategoryHeight(emojiCount) {
  var EmojiListRef = useEmojiListRef();
  var _useReactionsModeStat = useReactionsModeState(), isReactionsMode = _useReactionsModeStat[0];
  var PickerMainRef = usePickerMainRef();
  var emojiSizeRef = (0, import_react.useRef)();
  var _useVisibleCategories = useVisibleCategoriesState(), visibleCategories = _useVisibleCategories[0];
  var _React$useState = (0, import_react.useState)(), dimensions = _React$useState[0], setDimensions = _React$useState[1];
  var computeAndSetDimensions = (0, import_react.useCallback)(function() {
    var _ref;
    var listEl = EmojiListRef.current;
    if (!listEl)
      return;
    var emojiElement = listEl.querySelector(EmojiButtonSelector);
    var measured = emojiElement == null ? void 0 : emojiElement.clientHeight;
    var emojiSize = (_ref = measured != null ? measured : emojiSizeRef.current) != null ? _ref : EMOJI_SIZE_DEFAULT;
    emojiSizeRef.current = emojiSize;
    var pickerWidth = listEl.clientWidth;
    if (pickerWidth === 0 || emojiSize === 0)
      return;
    var emojisPerRow = Math.max(1, Math.floor(pickerWidth / emojiSize));
    var rowCount = Math.ceil(emojiCount / emojisPerRow);
    var categoryHeight = rowCount * emojiSize;
    setDimensions({
      categoryHeight,
      emojisPerRow,
      emojiSize
    });
  }, [EmojiListRef, emojiCount]);
  (0, import_react.useEffect)(function() {
    computeAndSetDimensions();
  }, [emojiCount, isReactionsMode, computeAndSetDimensions, visibleCategories.length]);
  (0, import_react.useEffect)(function() {
    var rootEl = PickerMainRef.current;
    if (!rootEl)
      return;
    var handler = function handler2(e) {
      var te = e;
      var prop = te.propertyName;
      if (prop === "width" || prop === "max-width" || prop === "min-width" || prop === "height" || prop === "max-height" || prop === "min-height") {
        if (typeof queueMicrotask === "function") {
          queueMicrotask(function() {
            return computeAndSetDimensions();
          });
        } else {
          requestAnimationFrame(function() {
            return computeAndSetDimensions();
          });
        }
      }
    };
    rootEl.addEventListener("transitionend", handler, {
      passive: true
    });
    return function() {
      rootEl.removeEventListener("transitionend", handler);
    };
  }, [PickerMainRef, computeAndSetDimensions]);
  return dimensions;
}
function useIsEmojiHidden() {
  var _useEmojisThatFailedT = useEmojisThatFailedToLoadState(), emojisThatFailedToLoad = _useEmojisThatFailedT[0];
  var isEmojiFiltered = useIsEmojiFiltered();
  return function(emoji) {
    var unified = emojiUnified(emoji);
    var failedToLoad = emojisThatFailedToLoad.has(unified);
    var filteredOut = isEmojiFiltered(unified);
    return {
      failedToLoad,
      filteredOut,
      hidden: failedToLoad || filteredOut
    };
  };
}
function useEmojiVirtualization(_ref) {
  var categoryEmojis = _ref.categoryEmojis, topOffset = _ref.topOffset, onHeightReady = _ref.onHeightReady, scrollTop = _ref.scrollTop, isCategoryVisible = _ref.isCategoryVisible;
  var isEmojiHidden = useIsEmojiHidden();
  var lazyLoadEmojis = useLazyLoadEmojisConfig();
  var emojiStyle = useEmojiStyleConfig();
  var _useActiveSkinToneSta = useActiveSkinToneState(), activeSkinTone = _useActiveSkinToneSta[0];
  var isEmojiDisallowed = useIsEmojiDisallowed();
  var getEmojiUrl = useGetEmojiUrlConfig();
  var showVariations = !useSkinTonesDisabledConfig();
  var BodyRef = useBodyRef();
  var virtualizedCounter = 0;
  var emojisToPush = categoryEmojis.filter(function(emoji) {
    var isDisallowed = isEmojiDisallowed(emoji);
    var _isEmojiHidden = isEmojiHidden(emoji), failedToLoad = _isEmojiHidden.failedToLoad, filteredOut = _isEmojiHidden.filteredOut, hidden2 = _isEmojiHidden.hidden;
    return !failedToLoad && !filteredOut && !hidden2 && !isDisallowed;
  });
  var dimensions = useCategoryHeight(emojisToPush.length);
  (0, import_react.useEffect)(function() {
    if (dimensions) {
      onHeightReady(dimensions.categoryHeight);
    }
  }, [dimensions, onHeightReady, emojisToPush.length]);
  var emojis2 = emojisToPush.reduce(function(accumulator, emoji, index) {
    var _BodyRef$current$clie, _BodyRef$current;
    var unified = emojiUnified(emoji, activeSkinTone);
    var style = getEmojiPositionStyle(dimensions, index);
    if (dimensions && BodyRef.current && shouldVirtualize({
      scrollTop,
      clientHeight: (_BodyRef$current$clie = (_BodyRef$current = BodyRef.current) == null ? void 0 : _BodyRef$current.clientHeight) != null ? _BodyRef$current$clie : 0,
      topOffset,
      style,
      dimensions
    })) {
      var _BodyRef$current$clie2, _BodyRef$current2;
      virtualizedCounter++;
      preloadEmojiIfNeeded(emoji, emojiStyle, scrollTop, (_BodyRef$current$clie2 = (_BodyRef$current2 = BodyRef.current) == null ? void 0 : _BodyRef$current2.clientHeight) != null ? _BodyRef$current$clie2 : 0, topOffset, style, dimensions, getEmojiUrl);
      return accumulator;
    }
    if (!isCategoryVisible) {
      virtualizedCounter++;
      return accumulator;
    }
    accumulator.push((0, import_react.createElement)(ClickableEmoji, {
      showVariations,
      key: unified,
      emoji,
      unified,
      emojiStyle,
      lazyLoad: lazyLoadEmojis,
      getEmojiUrl,
      style: _extends({}, style, {
        position: "absolute"
      })
    }));
    return accumulator;
  }, []);
  return {
    virtualizedCounter,
    emojis: emojis2,
    dimensions
  };
}
function EmojiCategory(_ref) {
  var categoryConfig = _ref.categoryConfig, children = _ref.children, hidden2 = _ref.hidden, hiddenOnSearch = _ref.hiddenOnSearch, height = _ref.height;
  var category = categoryFromCategoryConfig(categoryConfig);
  var categoryName = categoryNameFromCategoryConfig(categoryConfig);
  return (0, import_react.createElement)("li", {
    className: cx(styles$7.category, hidden2 && commonStyles.hidden, hiddenOnSearch && commonInteractionStyles.hiddenOnSearch),
    "data-name": category,
    "aria-label": categoryName
  }, (0, import_react.createElement)("h2", {
    className: cx(styles$7.label)
  }, categoryName), (0, import_react.createElement)("div", {
    className: cx(styles$7.categoryContent),
    style: {
      height
    }
  }, children));
}
var styles$7 = /* @__PURE__ */ stylesheet.create({
  category: {
    ".": ClassNames.category,
    position: "relative"
  },
  categoryContent: {
    ".": ClassNames.categoryContent,
    display: "grid",
    gridGap: "0",
    gridTemplateColumns: "repeat(auto-fill, var(--epr-emoji-fullsize))",
    justifyContent: "space-between",
    margin: "var(--epr-category-padding)",
    position: "relative"
  },
  label: {
    ".": ClassNames.label,
    alignItems: "center",
    // @ts-ignore - backdropFilter is not recognized.
    backdropFilter: "blur(3px)",
    backgroundColor: "var(--epr-category-label-bg-color)",
    color: "var(--epr-category-label-text-color)",
    display: "flex",
    fontSize: "16px",
    fontWeight: "bold",
    height: "var(--epr-category-label-height)",
    margin: "0",
    padding: "var(--epr-category-label-padding)",
    position: "sticky",
    textTransform: "capitalize",
    top: "0",
    width: "100%",
    zIndex: "var(--epr-category-label-z-index)"
  }
});
function EmojiList(_ref) {
  var scrollTop = _ref.scrollTop;
  var categories = useCategoriesConfig();
  var _React$useState = (0, import_react.useState)({}), categoryHeights = _React$useState[0], setCategoryHeights = _React$useState[1];
  var EmojiListRef = useEmojiListRef();
  var getEmojisByCategory = useGetEmojisByCategory();
  var labelHeight = getLabelHeight(EmojiListRef.current);
  var topOffset = 0;
  return (0, import_react.createElement)("ul", {
    className: cx(styles$8.emojiList),
    ref: EmojiListRef
  }, categories.map(function(categoryConfig) {
    var category = categoryFromCategoryConfig(categoryConfig);
    var currentOffset = topOffset;
    var categoryHeight = categoryHeights[category];
    if (categoryHeight) {
      topOffset += categoryHeight + labelHeight;
    }
    return (0, import_react.createElement)(import_react.Suspense, {
      key: category
    }, (0, import_react.createElement)(RenderCategory, {
      categoryEmojis: getEmojisByCategory(category),
      categoryConfig,
      topOffset: currentOffset,
      onHeightReady: function onHeightReady(height) {
        if (categoryHeights[category] !== height) {
          setCategoryHeights(function(prev) {
            var _extends2;
            return _extends({}, prev, (_extends2 = {}, _extends2[category] = height, _extends2));
          });
        }
      },
      scrollTop
    }));
  }));
}
function RenderCategory(_ref2) {
  var categoryEmojis = _ref2.categoryEmojis, categoryConfig = _ref2.categoryConfig, topOffset = _ref2.topOffset, onHeightReady = _ref2.onHeightReady, scrollTop = _ref2.scrollTop;
  var _useVisibleCategories = useVisibleCategoriesState(), visibleCategories = _useVisibleCategories[0];
  var _useEmojiVirtualizati = useEmojiVirtualization({
    categoryEmojis,
    topOffset,
    onHeightReady,
    scrollTop,
    isCategoryVisible: visibleCategories.includes(categoryConfig.category)
  }), virtualizedCounter = _useEmojiVirtualizati.virtualizedCounter, emojis2 = _useEmojiVirtualizati.emojis, dimensions = _useEmojiVirtualizati.dimensions;
  return (0, import_react.createElement)(EmojiCategory, {
    categoryConfig,
    height: dimensions == null ? void 0 : dimensions.categoryHeight,
    // Indicates that there are no visible emojis
    // Hence, the category should be hidden
    hidden: !emojis2.length && virtualizedCounter === 0
  }, emojis2);
}
var styles$8 = /* @__PURE__ */ stylesheet.create({
  emojiList: {
    ".": ClassNames.emojiList,
    listStyle: "none",
    margin: "0",
    padding: "0"
  }
});
var SVGTriangle = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI1MHB4IgoJIGhlaWdodD0iMTVweCIgdmlld0JveD0iMCAwIDUwIDE1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MCAxNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnIGlkPSJMYXllcl8xIj4KPC9nPgo8ZyBpZD0iTGF5ZXJfMiI+Cgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNFOEU3RTciIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEuODYtMC40M2w5LjgzLDExLjUzYzAuNTksMC42OSwxLjU2LDAuNjksMi4xNCwwbDkuODMtMTEuNTMiLz4KCTxwYXRoIGZpbGw9IiMwMTAyMDIiIHN0cm9rZT0iIzE1MTYxNyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMjYuODYtMC40M2w5LjgzLDExLjUzYzAuNTksMC42OSwxLjU2LDAuNjksMi4xNCwwbDkuODMtMTEuNTMiLz4KPC9nPgo8L3N2Zz4=";
var Direction;
(function(Direction2) {
  Direction2[Direction2["Up"] = 0] = "Up";
  Direction2[Direction2["Down"] = 1] = "Down";
})(Direction || (Direction = {}));
function EmojiVariationPicker() {
  var AnchoredEmojiRef = useAnchoredEmojiRef();
  var VariationPickerRef = useVariationPickerRef();
  var _useEmojiVariationPic = useEmojiVariationPickerState(), emoji = _useEmojiVariationPic[0];
  var emojiStyle = useEmojiStyleConfig();
  var _useVariationPickerTo = useVariationPickerTop(VariationPickerRef), getTop = _useVariationPickerTo.getTop, getMenuDirection = _useVariationPickerTo.getMenuDirection;
  var setAnchoredEmojiRef = useSetAnchoredEmojiRef();
  var getPointerStyle = usePointerStyle(VariationPickerRef);
  var getEmojiUrl = useGetEmojiUrlConfig();
  var button = buttonFromTarget(AnchoredEmojiRef.current);
  var visible = Boolean(emoji && button && emojiHasVariations(emoji) && button.classList.contains(ClassNames.emojiHasVariations));
  (0, import_react.useEffect)(function() {
    if (!visible) {
      return;
    }
    focusFirstVisibleEmoji(VariationPickerRef.current);
  }, [VariationPickerRef, visible, AnchoredEmojiRef]);
  var top, pointerStyle;
  if (!visible && AnchoredEmojiRef.current) {
    setAnchoredEmojiRef(null);
  } else {
    top = getTop();
    pointerStyle = getPointerStyle();
  }
  return (0, import_react.createElement)("div", {
    ref: VariationPickerRef,
    className: cx(styles$9.variationPicker, getMenuDirection() === Direction.Down && styles$9.pointingUp, visible && styles$9.visible),
    style: {
      top
    }
  }, visible && emoji ? [emojiUnified(emoji)].concat(emojiVariations(emoji)).slice(0, 6).map(function(unified) {
    return (0, import_react.createElement)(ClickableEmoji, {
      key: unified,
      emoji,
      unified,
      emojiStyle,
      showVariations: false,
      getEmojiUrl
    });
  }) : null, (0, import_react.createElement)("div", {
    className: cx(styles$9.pointer),
    style: pointerStyle
  }));
}
function usePointerStyle(VariationPickerRef) {
  var AnchoredEmojiRef = useAnchoredEmojiRef();
  return function getPointerStyle() {
    var style = {};
    if (!VariationPickerRef.current) {
      return style;
    }
    if (AnchoredEmojiRef.current) {
      var button = buttonFromTarget(AnchoredEmojiRef.current);
      var offsetLeft = emojiTruOffsetLeft(button);
      if (!button) {
        return style;
      }
      style.left = offsetLeft + (button == null ? void 0 : button.clientWidth) / 2;
    }
    return style;
  };
}
function useVariationPickerTop(VariationPickerRef) {
  var AnchoredEmojiRef = useAnchoredEmojiRef();
  var BodyRef = useBodyRef();
  var direction = Direction.Up;
  return {
    getMenuDirection,
    getTop
  };
  function getMenuDirection() {
    return direction;
  }
  function getTop() {
    direction = Direction.Up;
    var emojiOffsetTop = 0;
    if (!VariationPickerRef.current) {
      return 0;
    }
    var height = elementHeight(VariationPickerRef.current);
    if (AnchoredEmojiRef.current) {
      var _bodyRef$scrollTop;
      var bodyRef = BodyRef.current;
      var button = buttonFromTarget(AnchoredEmojiRef.current);
      var buttonHeight = elementHeight(button);
      emojiOffsetTop = emojiTrueOffsetTop(button);
      var scrollTop = (_bodyRef$scrollTop = bodyRef == null ? void 0 : bodyRef.scrollTop) != null ? _bodyRef$scrollTop : 0;
      if (scrollTop > emojiOffsetTop - height) {
        direction = Direction.Down;
        emojiOffsetTop += buttonHeight + height;
      }
    }
    return emojiOffsetTop - height;
  }
}
var styles$9 = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  variationPicker: {
    ".": ClassNames.variationPicker,
    position: "absolute",
    right: "15px",
    left: "15px",
    padding: "5px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    opacity: "0",
    visibility: "hidden",
    pointerEvents: "none",
    top: "-100%",
    border: "1px solid var(--epr-picker-border-color)",
    height: "var(--epr-emoji-variation-picker-height)",
    zIndex: "var(--epr-skin-variation-picker-z-index)",
    background: "var(--epr-emoji-variation-picker-bg-color)",
    transform: "scale(0.9)",
    transition: "transform 0.1s ease-out, opacity 0.2s ease-out"
  },
  visible: {
    opacity: "1",
    visibility: "visible",
    pointerEvents: "all",
    transform: "scale(1)"
  },
  pointingUp: {
    ".": "pointing-up",
    transformOrigin: "center 0%",
    transform: "scale(0.9)"
  },
  ".pointing-up": {
    pointer: {
      top: "0",
      transform: "rotate(180deg) translateY(100%) translateX(18px)"
    }
  },
  pointer: {
    ".": "epr-emoji-pointer",
    content: "",
    position: "absolute",
    width: "25px",
    height: "15px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 0",
    backgroundSize: "50px 15px",
    top: "100%",
    transform: "translateX(-18px)",
    backgroundImage: "url(" + SVGTriangle + ")"
  }
}, /* @__PURE__ */ darkMode("pointer", {
  backgroundPosition: "-25px 0"
})));
function Body() {
  var BodyRef = useBodyRef();
  var scrollTop = useOnScroll(BodyRef);
  useMouseDownHandlers(BodyRef, MOUSE_EVENT_SOURCE.PICKER);
  useOnMouseMove();
  return (0, import_react.createElement)("div", {
    className: cx(styles$a.body, commonInteractionStyles.hiddenOnReactions),
    ref: BodyRef
  }, (0, import_react.createElement)(EmojiVariationPicker, null), (0, import_react.createElement)(EmojiList, {
    scrollTop
  }));
}
var styles$a = /* @__PURE__ */ stylesheet.create({
  body: {
    ".": ClassNames.scrollBody,
    flex: "1",
    overflowY: "scroll",
    overflowX: "hidden",
    position: "relative"
  }
});
function detectEmojyPartiallyBelowFold(button, bodyRef) {
  if (!button || !bodyRef) {
    return 0;
  }
  var buttonRect = button.getBoundingClientRect();
  var bodyRect = bodyRef.getBoundingClientRect();
  return bodyRect.height - (buttonRect.y - bodyRect.y);
}
function useEmojiPreviewEvents(allow, setPreviewEmoji) {
  var BodyRef = useBodyRef();
  var isMouseDisallowed = useIsMouseDisallowed();
  var allowMouseMove = useAllowMouseMove();
  (0, import_react.useEffect)(function() {
    if (!allow) {
      return;
    }
    var bodyRef = BodyRef.current;
    bodyRef == null ? void 0 : bodyRef.addEventListener("keydown", onEscape, {
      passive: true
    });
    bodyRef == null ? void 0 : bodyRef.addEventListener("mouseover", onMouseOver, true);
    bodyRef == null ? void 0 : bodyRef.addEventListener("focus", onEnter, true);
    bodyRef == null ? void 0 : bodyRef.addEventListener("mouseout", onLeave, {
      passive: true
    });
    bodyRef == null ? void 0 : bodyRef.addEventListener("blur", onLeave, true);
    function onEnter(e) {
      var button = buttonFromTarget(e.target);
      if (!button) {
        return onLeave();
      }
      var _allUnifiedFromEmojiE = allUnifiedFromEmojiElement(button), unified = _allUnifiedFromEmojiE.unified, originalUnified = _allUnifiedFromEmojiE.originalUnified;
      if (!unified || !originalUnified) {
        return onLeave();
      }
      setPreviewEmoji({
        unified,
        originalUnified
      });
    }
    function onLeave(e) {
      if (e) {
        var relatedTarget = e.relatedTarget;
        if (!buttonFromTarget(relatedTarget)) {
          return setPreviewEmoji(null);
        }
      }
      setPreviewEmoji(null);
    }
    function onEscape(e) {
      if (e.key === "Escape") {
        setPreviewEmoji(null);
      }
    }
    function onMouseOver(e) {
      if (isMouseDisallowed()) {
        return;
      }
      var button = buttonFromTarget(e.target);
      if (button) {
        var belowFoldByPx = detectEmojyPartiallyBelowFold(button, bodyRef);
        var buttonHeight = button.getBoundingClientRect().height;
        if (belowFoldByPx < buttonHeight) {
          return handlePartiallyVisibleElementFocus(button, setPreviewEmoji);
        }
        focusElement(button);
      }
    }
    return function() {
      bodyRef == null ? void 0 : bodyRef.removeEventListener("mouseover", onMouseOver);
      bodyRef == null ? void 0 : bodyRef.removeEventListener("mouseout", onLeave);
      bodyRef == null ? void 0 : bodyRef.removeEventListener("focus", onEnter, true);
      bodyRef == null ? void 0 : bodyRef.removeEventListener("blur", onLeave, true);
      bodyRef == null ? void 0 : bodyRef.removeEventListener("keydown", onEscape);
    };
  }, [BodyRef, allow, setPreviewEmoji, isMouseDisallowed, allowMouseMove]);
}
function handlePartiallyVisibleElementFocus(button, setPreviewEmoji) {
  var _document$activeEleme;
  var _allUnifiedFromEmojiE2 = allUnifiedFromEmojiElement(button), unified = _allUnifiedFromEmojiE2.unified, originalUnified = _allUnifiedFromEmojiE2.originalUnified;
  if (!unified || !originalUnified) {
    return;
  }
  (_document$activeEleme = document.activeElement) == null ? void 0 : _document$activeEleme.blur == null ? void 0 : _document$activeEleme.blur();
  setPreviewEmoji({
    unified,
    originalUnified
  });
}
var _stylesheet$create;
var FlexDirection;
(function(FlexDirection2) {
  FlexDirection2["ROW"] = "FlexRow";
  FlexDirection2["COLUMN"] = "FlexColumn";
})(FlexDirection || (FlexDirection = {}));
function Flex(_ref) {
  var children = _ref.children, className = _ref.className, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style, _ref$direction = _ref.direction, direction = _ref$direction === void 0 ? FlexDirection.ROW : _ref$direction;
  return (0, import_react.createElement)("div", {
    style: _extends({}, style),
    className: cx(styles$b.flex, className, styles$b[direction])
  }, children);
}
var styles$b = /* @__PURE__ */ stylesheet.create((_stylesheet$create = {
  flex: {
    display: "flex"
  }
}, _stylesheet$create[FlexDirection.ROW] = {
  flexDirection: "row"
}, _stylesheet$create[FlexDirection.COLUMN] = {
  flexDirection: "column"
}, _stylesheet$create));
function Space(_ref) {
  var className = _ref.className, _ref$style = _ref.style, style = _ref$style === void 0 ? {} : _ref$style;
  return (0, import_react.createElement)("div", {
    style: _extends({
      flex: 1
    }, style),
    className: cx(className)
  });
}
function Absolute(_ref) {
  var children = _ref.children, className = _ref.className, style = _ref.style;
  return (0, import_react.createElement)("div", {
    style: _extends({}, style, {
      position: "absolute"
    }),
    className
  }, children);
}
function Relative(_ref) {
  var children = _ref.children, className = _ref.className, style = _ref.style;
  return (0, import_react.createElement)("div", {
    style: _extends({}, style, {
      position: "relative"
    }),
    className
  }, children);
}
function BtnSkinToneVariation(_ref) {
  var isOpen = _ref.isOpen, onClick = _ref.onClick, isActive = _ref.isActive, skinToneVariation = _ref.skinToneVariation, style = _ref.style;
  return (0, import_react.createElement)(Button, {
    style,
    onClick,
    className: cx("epr-tone-" + skinToneVariation, styles$c.tone, !isOpen && styles$c.closedTone, isActive && styles$c.active),
    "aria-pressed": isActive,
    "aria-label": "Skin tone " + skinTonesNamed[skinToneVariation]
  });
}
var styles$c = /* @__PURE__ */ stylesheet.create({
  closedTone: {
    opacity: "0",
    zIndex: "0"
  },
  active: {
    ".": "epr-active",
    zIndex: "1",
    opacity: "1"
  },
  tone: {
    ".": "epr-tone",
    width: "var(--epr-skin-tone-size)",
    display: "block",
    cursor: "pointer",
    borderRadius: "4px",
    height: "var(--epr-skin-tone-size)",
    position: "absolute",
    right: "0",
    transition: "transform 0.3s ease-in-out, opacity 0.35s ease-in-out",
    zIndex: "0",
    border: "1px solid var(--epr-skin-tone-outer-border-color)",
    boxShadow: "inset 0px 0px 0 1px var(--epr-skin-tone-inner-border-color)",
    ":hover": {
      boxShadow: "0 0 0 3px var(--epr-active-skin-hover-color), inset 0px 0px 0 1px var(--epr-skin-tone-inner-border-color)"
    },
    ":focus": {
      boxShadow: "0 0 0 3px var(--epr-focus-bg-color)"
    },
    "&.epr-tone-neutral": {
      backgroundColor: "#ffd225"
    },
    "&.epr-tone-1f3fb": {
      backgroundColor: "#ffdfbd"
    },
    "&.epr-tone-1f3fc": {
      backgroundColor: "#e9c197"
    },
    "&.epr-tone-1f3fd": {
      backgroundColor: "#c88e62"
    },
    "&.epr-tone-1f3fe": {
      backgroundColor: "#a86637"
    },
    "&.epr-tone-1f3ff": {
      backgroundColor: "#60463a"
    }
  }
});
var ITEM_SIZE = 28;
function SkinTonePickerMenu() {
  return (0, import_react.createElement)(Relative, {
    style: {
      height: ITEM_SIZE
    }
  }, (0, import_react.createElement)(Absolute, {
    style: {
      bottom: 0,
      right: 0
    }
  }, (0, import_react.createElement)(SkinTonePicker, {
    direction: SkinTonePickerDirection.VERTICAL
  })));
}
function SkinTonePicker(_ref) {
  var _ref$direction = _ref.direction, direction = _ref$direction === void 0 ? SkinTonePickerDirection.HORIZONTAL : _ref$direction;
  var SkinTonePickerRef = useSkinTonePickerRef();
  var isDisabled = useSkinTonesDisabledConfig();
  var _useSkinToneFanOpenSt = useSkinToneFanOpenState(), isOpen = _useSkinToneFanOpenSt[0], setIsOpen = _useSkinToneFanOpenSt[1];
  var _useActiveSkinToneSta = useActiveSkinToneState(), activeSkinTone = _useActiveSkinToneSta[0], setActiveSkinTone = _useActiveSkinToneSta[1];
  var onSkinToneChange = useOnSkinToneChangeConfig();
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var focusSearchInput = useFocusSearchInput();
  if (isDisabled) {
    return null;
  }
  var fullWidth = ITEM_SIZE * skinToneVariations.length + "px";
  var expandedSize = isOpen ? fullWidth : ITEM_SIZE + "px";
  var vertical = direction === SkinTonePickerDirection.VERTICAL;
  return (0, import_react.createElement)(Relative, {
    className: cx(styles$d.skinTones, vertical && styles$d.vertical, isOpen && styles$d.open, vertical && isOpen && styles$d.verticalShadow),
    style: vertical ? {
      flexBasis: expandedSize,
      height: expandedSize
    } : {
      flexBasis: expandedSize
    }
  }, (0, import_react.createElement)("div", {
    className: cx(styles$d.select),
    ref: SkinTonePickerRef
  }, skinToneVariations.map(function(skinToneVariation, i) {
    var active = skinToneVariation === activeSkinTone;
    return (0, import_react.createElement)(BtnSkinToneVariation, {
      key: skinToneVariation,
      skinToneVariation,
      isOpen,
      style: {
        transform: cx(vertical ? "translateY(-" + i * (isOpen ? ITEM_SIZE : 0) + "px)" : "translateX(-" + i * (isOpen ? ITEM_SIZE : 0) + "px)", isOpen && active && "scale(1.3)")
      },
      isActive: active,
      onClick: function onClick() {
        if (isOpen) {
          setActiveSkinTone(skinToneVariation);
          onSkinToneChange(skinToneVariation);
          focusSearchInput();
        } else {
          setIsOpen(true);
        }
        closeAllOpenToggles();
      }
    });
  })));
}
var SkinTonePickerDirection;
(function(SkinTonePickerDirection2) {
  SkinTonePickerDirection2["VERTICAL"] = "epr-vertical";
  SkinTonePickerDirection2["HORIZONTAL"] = "epr-horizontal";
})(SkinTonePickerDirection || (SkinTonePickerDirection = {}));
var styles$d = /* @__PURE__ */ stylesheet.create({
  skinTones: {
    ".": "epr-skin-tones",
    "--": {
      "--epr-skin-tone-size": "15px"
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    transition: "all 0.3s ease-in-out",
    padding: "10px 0"
  },
  vertical: {
    padding: "9px",
    alignItems: "flex-end",
    flexDirection: "column",
    borderRadius: "6px",
    border: "1px solid var(--epr-bg-color)"
  },
  verticalShadow: {
    boxShadow: "0px 0 7px var(--epr-picker-border-color)"
  },
  open: {
    // @ts-ignore - backdropFilter is not recognized.
    backdropFilter: "blur(5px)",
    background: "var(--epr-skin-tone-picker-menu-color)",
    ".epr-active": {
      border: "1px solid var(--epr-active-skin-tone-indicator-border-color)"
    }
  },
  select: {
    ".": "epr-skin-tone-select",
    position: "relative",
    width: "var(--epr-skin-tone-size)",
    height: "var(--epr-skin-tone-size)"
  }
});
function Preview() {
  var previewConfig = usePreviewConfig();
  var isSkinToneInPreview = useIsSkinToneInPreview();
  var _useReactionsModeStat = useReactionsModeState(), reactionsOpen = _useReactionsModeStat[0];
  if (!previewConfig.showPreview) {
    return null;
  }
  return (0, import_react.createElement)(Flex, {
    className: cx(styles$e.preview, commonInteractionStyles.hiddenOnReactions, reactionsOpen && styles$e.hideOnReactions)
  }, (0, import_react.createElement)(PreviewBody, null), (0, import_react.createElement)(Space, null), isSkinToneInPreview ? (0, import_react.createElement)(SkinTonePickerMenu, null) : null);
}
function PreviewBody() {
  var _previewEmoji$unified;
  var previewConfig = usePreviewConfig();
  var _useState = (0, import_react.useState)(null), previewEmoji = _useState[0], setPreviewEmoji = _useState[1];
  var emojiStyle = useEmojiStyleConfig();
  var _useEmojiVariationPic = useEmojiVariationPickerState(), variationPickerEmoji = _useEmojiVariationPic[0];
  var getEmojiUrl = useGetEmojiUrlConfig();
  useEmojiPreviewEvents(previewConfig.showPreview, setPreviewEmoji);
  var emoji = emojiByUnified((_previewEmoji$unified = previewEmoji == null ? void 0 : previewEmoji.unified) != null ? _previewEmoji$unified : previewEmoji == null ? void 0 : previewEmoji.originalUnified);
  var show = emoji != null && previewEmoji != null;
  return (0, import_react.createElement)(PreviewContent, null);
  function PreviewContent() {
    var defaultEmoji = variationPickerEmoji != null ? variationPickerEmoji : emojiByUnified(previewConfig.defaultEmoji);
    if (!defaultEmoji) {
      return null;
    }
    var defaultText = variationPickerEmoji ? emojiName(variationPickerEmoji) : previewConfig.defaultCaption;
    return (0, import_react.createElement)(import_react.Fragment, null, (0, import_react.createElement)("div", null, show ? (0, import_react.createElement)(ViewOnlyEmoji, {
      unified: previewEmoji == null ? void 0 : previewEmoji.unified,
      emoji,
      emojiStyle,
      size: 45,
      getEmojiUrl,
      className: cx(styles$e.emoji)
    }) : defaultEmoji ? (0, import_react.createElement)(ViewOnlyEmoji, {
      unified: emojiUnified(defaultEmoji),
      emoji: defaultEmoji,
      emojiStyle,
      size: 45,
      getEmojiUrl,
      className: cx(styles$e.emoji)
    }) : null), (0, import_react.createElement)("div", {
      className: cx(styles$e.label)
    }, show ? emojiName(emoji) : defaultText));
  }
}
var styles$e = /* @__PURE__ */ stylesheet.create({
  preview: {
    alignItems: "center",
    borderTop: "1px solid var(--epr-preview-border-color)",
    height: "var(--epr-preview-height)",
    padding: "0 var(--epr-horizontal-padding)",
    position: "relative",
    zIndex: "var(--epr-preview-z-index)"
  },
  label: {
    color: "var(--epr-preview-text-color)",
    fontSize: "var(--epr-preview-text-size)",
    padding: "var(--epr-preview-text-padding)",
    textTransform: "capitalize"
  },
  emoji: {
    padding: "0"
  },
  hideOnReactions: {
    opacity: "0",
    transition: "opacity 0.5s ease-in-out"
  }
});
function categoryNameFromDom($category) {
  var _$category$getAttribu;
  return (_$category$getAttribu = $category == null ? void 0 : $category.getAttribute("data-name")) != null ? _$category$getAttribu : null;
}
function useActiveCategoryScrollDetection(_ref) {
  var setActiveCategory = _ref.setActiveCategory, setVisibleCategories = _ref.setVisibleCategories;
  var BodyRef = useBodyRef();
  (0, import_react.useEffect)(function() {
    var visibleCategories = /* @__PURE__ */ new Map();
    var bodyRef = BodyRef.current;
    var observer = new IntersectionObserver(function(entries) {
      if (!bodyRef) {
        return;
      }
      for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done; ) {
        var entry = _step.value;
        var _id = categoryNameFromDom(entry.target);
        if (!_id) {
          continue;
        }
        visibleCategories.set(_id, entry.intersectionRatio);
      }
      var ratios = Array.from(visibleCategories);
      setVisibleCategories(ratios.filter(function(_ref2) {
        var ratio2 = _ref2[1];
        return ratio2 > 0;
      }).map(function(_ref3) {
        var id2 = _ref3[0];
        return id2;
      }));
      var lastCategory = ratios[ratios.length - 1];
      if (lastCategory[1] == 1) {
        return setActiveCategory(lastCategory[0]);
      }
      for (var _i = 0, _ratios = ratios; _i < _ratios.length; _i++) {
        var _ratios$_i = _ratios[_i], id = _ratios$_i[0], ratio = _ratios$_i[1];
        if (ratio) {
          setActiveCategory(id);
          break;
        }
      }
    }, {
      threshold: [0, 1]
    });
    bodyRef == null ? void 0 : bodyRef.querySelectorAll(asSelectors(ClassNames.category)).forEach(function(el) {
      observer.observe(el);
    });
  }, [BodyRef, setActiveCategory, setVisibleCategories]);
}
function useScrollCategoryIntoView() {
  var BodyRef = useBodyRef();
  var PickerMainRef = usePickerMainRef();
  return function scrollCategoryIntoView(category) {
    var _BodyRef$current;
    if (!BodyRef.current) {
      return;
    }
    var $category = (_BodyRef$current = BodyRef.current) == null ? void 0 : _BodyRef$current.querySelector('[data-name="' + category + '"]');
    if (!$category) {
      return;
    }
    var offsetTop = $category.offsetTop || 0;
    scrollTo(PickerMainRef.current, offsetTop);
  };
}
function useShouldHideCustomEmojis() {
  var customCategoryConfig = useCustomEmojisConfig();
  if (!customCategoryConfig) {
    return false;
  }
  return customCategoryConfig.length === 0;
}
var SVGNavigation = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyMDBweCIgaGVpZ2h0PSI4MHB4IiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMDAgODAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZyBpZD0iTGF5ZXJfMTEiPgoJPGc+CgkJPHBhdGggZmlsbD0iIzMzNzFCNyIgc3Ryb2tlPSIjMzM3MUI3IiBzdHJva2Utd2lkdGg9IjAuMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTIuOCwyOS41YzAuNiwwLDEuMS0wLjUsMS4xLTEuMQoJCQljMC0wLjYtMC41LTEuMi0xLjEtMS4yYy0wLjYsMC0xLjIsMC41LTEuMiwxLjJDMTEuNiwyOSwxMi4yLDI5LjUsMTIuOCwyOS41eiBNMTIuOCwyOGMwLjIsMCwwLjQsMC4yLDAuNCwwLjQKCQkJYzAsMC4yLTAuMiwwLjQtMC40LDAuNGMtMC4yLDAtMC40LTAuMi0wLjQtMC40QzEyLjQsMjguMSwxMi42LDI4LDEyLjgsMjh6Ii8+CgkJPHBhdGggZmlsbD0iIzMzNzFCNyIgc3Ryb2tlPSIjMzM3MUI3IiBzdHJva2Utd2lkdGg9IjAuMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTAsMjNjLTMuOCwwLTcsMy4xLTcsN2MwLDMuOCwzLjEsNyw3LDcKCQkJczctMy4xLDctN0MxNywyNi4yLDEzLjgsMjMsMTAsMjN6IE0xMCwzNi4yYy0zLjQsMC02LjItMi44LTYuMi02LjJjMC0zLjQsMi44LTYuMiw2LjItNi4yczYuMiwyLjgsNi4yLDYuMgoJCQlDMTYuMiwzMy40LDEzLjQsMzYuMiwxMCwzNi4yeiIvPgoJCTxwYXRoIGZpbGw9IiMzMzcxQjciIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTE0LjYsMzEuMmMtMC4xLTAuMS0wLjItMC4yLTAuMy0wLjJINS43CgkJCWMtMC4xLDAtMC4yLDAuMS0wLjMsMC4yYy0wLjEsMC4xLTAuMSwwLjIsMCwwLjRjMC43LDIsMi41LDMuMyw0LjYsMy4zczMuOS0xLjMsNC42LTMuM0MxNC43LDMxLjUsMTQuNywzMS4zLDE0LjYsMzEuMnogTTEwLDM0LjEKCQkJYy0xLjYsMC0zLTAuOS0zLjctMi4yaDcuM0MxMywzMy4yLDExLjYsMzQuMSwxMCwzNC4xeiIvPgoJCTxwYXRoIGZpbGw9IiMzMzcxQjciIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTcuMiwyOS41YzAuNiwwLDEuMi0wLjUsMS4yLTEuMQoJCQljMC0wLjYtMC41LTEuMi0xLjItMS4yYy0wLjYsMC0xLjEsMC41LTEuMSwxLjJDNi4xLDI5LDYuNiwyOS41LDcuMiwyOS41eiBNNy4yLDI4YzAuMiwwLDAuNCwwLjIsMC40LDAuNGMwLDAuMi0wLjIsMC40LTAuNCwwLjQKCQkJYy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRDNi44LDI4LjEsNywyOCw3LjIsMjh6Ii8+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBkPSJNNjQuMSwzMy40bDIuMywwYzAuMiwwLDAuNCwwLjIsMC40LDAuNHYyLjFjMCwwLjItMC4yLDAuNC0wLjQsMC40aC0yLjMKCQkJCWMtMC4yLDAtMC40LTAuMi0wLjQtMC40di0yLjFDNjMuNywzMy42LDYzLjgsMzMuNCw2NC4xLDMzLjR6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgZD0iTTczLjUsMzMuNWgyLjRjMC4yLDAsMC40LDAuMiwwLjQsMC40djJjMCwwLjItMC4yLDAuNC0wLjQsMC40aC0yLjQKCQkJCWMtMC4yLDAtMC40LTAuMi0wLjQtMC40bDAtMkM3My4xLDMzLjYsNzMuMywzMy41LDczLjUsMzMuNXoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBkPSJNNjMuNywyOC40aDEyLjZ2NUg2My43VjI4LjR6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgZD0iTTY1LjUsMjMuNmg4LjljMSwwLDEuOSwwLjgsMS45LDEuOXYzLjFINjMuN3YtMy4xQzYzLjcsMjQuNSw2NC41LDIzLjYsNjUuNSwyMy42eiIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjMzM3MUI3IiBjeD0iNjYuMiIgY3k9IjMwLjkiIHJ4PSIwLjkiIHJ5PSIxIi8+CgkJCTxlbGxpcHNlIGZpbGw9IiMzMzcxQjciIGN4PSI3My44IiBjeT0iMzAuOSIgcng9IjAuOSIgcnk9IjEiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBkPSJNOTYuNCwzMGMwLDMuNi0yLjksNi41LTYuNCw2LjVzLTYuNC0yLjktNi40LTYuNXMyLjktNi41LDYuNC02LjVTOTYuNCwyNi40LDk2LjQsMzB6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgZD0iTTk2LjMsMjguNmMwLDAsMCwwLjEsMCwwLjFjLTAuOSwwLjEtMi45LDAuMS00LjYtMS4xYy0xLjEtMC44LTItMS43LTIuNi0yLjUKCQkJCWMtMC4zLTAuNC0wLjYtMC44LTAuNy0xYy0wLjEtMC4xLTAuMS0wLjEtMC4xLTAuMmMwLjUtMC4xLDEuMi0wLjIsMi0wLjFjMS4yLDAsMi41LDAuMywzLjUsMS4xYzEsMC44LDEuNywxLjgsMi4xLDIuOAoJCQkJQzk2LjEsMjcuOSw5Ni4yLDI4LjMsOTYuMywyOC42eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik04NCwzMi4yYzAsMCwwLTAuMSwwLTAuMWMwLjktMC4yLDIuOS0wLjQsNC43LDAuNmMxLjEsMC43LDEuOSwxLjUsMi40LDIuMwoJCQkJYzAuNCwwLjUsMC42LDEsMC43LDEuM2MtMC40LDAuMS0xLDAuMi0xLjcsMC4zYy0xLDAtMi4xLTAuMS0zLjItMC44cy0xLjktMS42LTIuNC0yLjVDODQuMiwzMi44LDg0LjEsMzIuNSw4NCwzMi4yeiIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTExNi4zLDI2LjhsLTEuNCwybC0wLjgtMC44bC0wLjYtMC42bDAsMC45bC0wLjEsOC4yaC02LjgKCQkJCWwtMC4xLTguMmwwLTAuOWwtMC42LDAuNmwtMC44LDAuOGwtMS40LTJsMi42LTIuOWMwLjEtMC4xLDAuMi0wLjEsMC4zLTAuMWgxLjNsMC40LDAuN2MwLjcsMS4zLDIuNiwxLjMsMy4zLTAuMWwwLjMtMC42aDEuMgoJCQkJYzAuMSwwLDAuMiwwLDAuMywwLjFsMC4zLTAuM2wtMC4zLDAuM0wxMTYuMywyNi44eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik0xMTAuMSwyNy43aDJ2MC45YzAsMC40LTAuNCwwLjctMSwwLjdjLTAuNiwwLTEtMC4zLTEtMC43TDExMC4xLDI3LjdMMTEwLjEsMjcuN3oiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBkPSJNMTI2LjgsMzQuM2MwLDEuMi0xLDIuMi0yLjIsMi4ycy0yLjItMS0yLjItMi4yczEtMi4yLDIuMi0yLjJTMTI2LjgsMzMuMSwxMjYuOCwzNC4zeiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik0xMzcuNiwzNC4zYzAsMS4yLTEsMi4yLTIuMiwyLjJjLTEuMiwwLTIuMi0xLTIuMi0yLjJzMS0yLjIsMi4yLTIuMgoJCQkJQzEzNi42LDMyLjEsMTM3LjYsMzMuMSwxMzcuNiwzNC4zeiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik0xMjYuOCwyNC40djkuOSIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik0xMzcuNywyNC40djkuOSIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIGQ9Ik0xMjYuOCwyMy41aDEwLjh2Mi43aC0xMC44QzEyNi44LDI2LjIsMTI2LjgsMjMuNSwxMjYuOCwyMy41eiIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSIjMzM3MUI3IiBkPSJNMTcwLjgsMjMuMUwxNzAuOCwyMy4xYy0wLjMsMC0wLjUsMC0wLjgsMGMtMi4xLDAtNCwxLTUuMywyLjVsLTAuMSwwbC0wLjEtMC4xbC0xLTEuMmwtMC4zLDMuNGwzLjQsMC4zCgkJCQlsLTEuMS0xLjNsLTAuMS0wLjFsMC4xLTAuMWMxLjEtMS41LDMtMi4zLDUtMi4xbDAsMGMzLjIsMC4zLDUuNSwzLjEsNS4yLDYuM2MtMC4zLDMtMy4xLDUuMy02LjEsNS4xYy0zLjEtMC4yLTUuNC0yLjktNS4zLTYKCQkJCWwtMS4zLTAuMWMtMC4yLDMuOCwyLjYsNy4xLDYuMyw3LjRjMy45LDAuMyw3LjMtMi42LDcuNi02LjVDMTc3LjIsMjYuOCwxNzQuNCwyMy41LDE3MC44LDIzLjF6Ii8+CgkJCTxwYXRoIGZpbGw9IiMzMzcxQjciIGQ9Ik0xNzAuMywyNy40YzAtMC4zLTAuMy0wLjYtMC42LTAuNnMtMC42LDAuMy0wLjYsMC42djMuMmMwLDAuMiwwLjEsMC4zLDAuMiwwLjRjMC4xLDAuMSwwLjMsMC4yLDAuNCwwLjIKCQkJCWgyLjRjMC40LDAsMC42LTAuMywwLjYtMC42YzAtMC40LTAuMy0wLjYtMC42LTAuNmgtMS42aC0wLjJ2LTAuMkwxNzAuMywyNy40TDE3MC4zLDI3LjR6Ii8+CgkJPC9nPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgZD0iTTE4Ni4yLDIzLjRoNy43YzEuNSwwLDIuNywxLjIsMi43LDIuN3Y3LjdjMCwxLjUtMS4yLDIuNy0yLjcsMi43aC03LjcKCQkJCWMtMS41LDAtMi43LTEuMi0yLjctMi43di03LjdDMTgzLjQsMjQuNiwxODQuNywyMy40LDE4Ni4yLDIzLjR6Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiMzMzcxQjciIGN4PSIxODYiIGN5PSIyOC45IiByeD0iMC43IiByeT0iMC43Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiMzMzcxQjciIGN4PSIxOTQiIGN5PSIyNi43IiByeD0iMC43IiByeT0iMC43Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMTg2LDMzLjNsMC40LTAuM2MwLjQtMC4zLDEtMC4zLDEuNS0wLjFsMSwwLjQKCQkJCWMwLjUsMC4yLDEsMC4yLDEuNS0wLjFsMC44LTAuNWMwLjQtMC4zLDEtMC4zLDEuNS0wLjFsMS44LDAuOCIvPgoJCTwvZz4KCTwvZz4KCTxwYXRoIGZpbGw9IiMzMzcxQjciIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLXdpZHRoPSIwLjI1IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0xNTYsMjQuM2MtMC4yLTAuMS0wLjQtMC4xLTAuNSwwCgkJYzAsMC0wLjIsMC4xLTAuOSwwLjJjLTAuNywwLTIuNC0wLjEtMy44LTAuNmMtMC44LTAuMy0xLjctMC41LTIuNS0wLjVjLTAuMiwwLTAuNCwwLTAuNSwwYy0xLjMsMC0yLjUsMC4zLTMuNiwxCgkJYy0wLjIsMC4xLTAuMiwwLjItMC4yLDAuNHYxMS42YzAsMC4zLDAuMSwwLjUsMC4zLDAuNWMwLjYsMCwwLjUtMC40LDAuNS0wLjZ2LTUuN2MwLjctMC4zLDMuMi0xLjEsNS44LTAuMQoJCWMxLjYsMC42LDMuNSwwLjcsNC4zLDAuN2MwLjgsMCwxLjMtMC4zLDEuMy0wLjNjMC4yLTAuMSwwLjMtMC4yLDAuMy0wLjR2LTUuN0MxNTYuMiwyNC42LDE1Ni4xLDI0LjQsMTU2LDI0LjN6IE0xNTUuNiwzMC4yCgkJYy0wLjEsMC0wLjcsMC4xLTEsMC4xYy0wLjcsMC0yLjQtMC4xLTMuOC0wLjZjLTIuNS0xLTUtMC41LTYuMi0wLjF2LTQuOWMwLjktMC41LDIuMi0wLjcsMy4yLTAuN2MwLjEsMCwwLjMsMCwwLjQsMAoJCWMwLjcsMCwxLjUsMC4yLDIuMiwwLjRjMS42LDAuNiwzLjUsMC43LDQuMywwLjdjMC4yLDAsMC44LDAsMS0wLjFWMzAuMnoiLz4KCTxnPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgZD0iTTQ4LjEsMjMuNWgzLjdjMi41LDAsNC41LDIsNC41LDQuNWMwLDAuNS0wLjQsMC45LTAuOSwwLjlINDQuNWMtMC41LDAtMC45LTAuNC0wLjktMC45CgkJCUM0My42LDI1LjUsNDUuNiwyMy41LDQ4LjEsMjMuNXoiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTQzLjUsMjguOGMtMC4yLDAuMS0wLjUsMS4yLDAsMS41YzEuNCwxLDguNSwwLjgsMTEuMywwLjYKCQkJYzAuOC0wLjEsMS42LTAuNCwxLjctMS4yYzAtMC4zLTAuMS0wLjYtMC42LTAuOSIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSwzMC42TDQzLjMsMzFjLTAuMiwwLjUsMC4yLDEsMC43LDAuOWMwLjMtMC4xLDAuNSwwLDAuNywwLjMKCQkJbDAuMSwwLjJjMC4zLDAuNSwxLDAuNiwxLjUsMC4ybDAsMGMwLjMtMC4yLDAuNy0wLjMsMS0wLjJsMC44LDAuM2MwLjQsMC4yLDAuOCwwLjEsMS4yLDBsMC41LTAuMmMwLjQtMC4yLDAuOS0wLjIsMS4zLDBsMC41LDAuMgoJCQljMC40LDAuMiwwLjgsMC4yLDEuMiwwbDAuMi0wLjFjMC4zLTAuMiwwLjgtMC4yLDEuMSwwLjFsMC4yLDAuMmMwLjMsMC4zLDAuOCwwLjIsMS0wLjJsMC4xLTAuMmMwLjEtMC4yLDAtMC4zLDAuMi0wLjMKCQkJYzAuNSwwLDEuMi0wLjMsMS4xLTAuN2wtMC40LTEuMSIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSwzMi4yYy0wLjEsMC4yLTAuMywwLjgsMCwxLjFjMC4zLDAuNCwzLDEuMSw2LjQsMS4xCgkJCWMyLjIsMCw0LjYtMC4zLDYtMC42YzAuNS0wLjEsMC45LTAuNSwwLjgtMC45YzAtMC4yLTAuMi0wLjUtMC40LTAuNyIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSwzMy4zYzAsMC41LDAuNiwyLjMsMS4zLDIuN2MxLjgsMC44LDUuNywwLjcsOC4xLDAuNQoJCQljMS4zLTAuMSwyLjUtMC43LDMuMi0xLjhjMC4zLTAuNSwwLjUtMSwwLjUtMS40Ii8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjUxLjYiIGN5PSIyNi41IiByeD0iMC4zIiByeT0iMC40Ii8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjUzIiBjeT0iMjUiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjMzM3MUI3IiBjeD0iNTMiIGN5PSIyNy4yIiByeD0iMC4zIiByeT0iMC40Ii8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjU0LjMiIGN5PSIyNi41IiByeD0iMC4zIiByeT0iMC40Ii8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjUwLjkiIGN5PSIyNSIgcng9IjAuMyIgcnk9IjAuNCIvPgoJPC9nPgoJPGc+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBkPSJNMjQuMiwzMXYtNy42YzAuMSwwLjEsMC44LDAuOSwyLjgsMy4xYzIuNS0xLjYsNS42LTAuNyw2LjksMGwyLjQtMy4xdjcuMQoJCQljMCwxLjItMC4xLDIuNS0wLjksMy40Yy0xLDEuMi0yLjcsMi41LTUuMywyLjVjLTIuOSwwLTQuNS0xLjUtNS4zLTIuOUMyNC4yLDMyLjksMjQuMiwzMiwyNC4yLDMxeiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMjEuMiwzMGw1LjQsMS4yIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM3MUI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0yMS4yLDM0LjFsNS40LTEuMiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzguOCwzMGwtNS40LDEuMiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNzFCNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzguOCwzNC4xbC01LjQtMS4yIi8+CgkJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMzMzcxQjciIGQ9Ik0yOS41LDMyLjRMMjksMzEuN2MtMC4yLTAuMywwLTAuNiwwLjMtMC42aDEuNAoJCQljMC4zLDAsMC41LDAuNCwwLjMsMC42bC0wLjcsMWwwLDBjLTAuNywxLjItMi42LDEuMS0zLjEtMC4zbC0wLjEtMC4yYy0wLjEtMC4yLDAtMC40LDAuMi0wLjVzMC40LDAsMC41LDAuMmwwLjEsMC4yCgkJCUMyOC4zLDMyLjgsMjkuMSwzMi45LDI5LjUsMzIuNHoiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMzcxQjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTMyLjQsMzIuMWwtMC4xLDAuMmMtMC40LDEtMS44LDEuMS0yLjMsMC4yIi8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjI3LjYiIGN5PSIyOS43IiByeD0iMC43IiByeT0iMC43Ii8+CgkJPGVsbGlwc2UgZmlsbD0iIzMzNzFCNyIgY3g9IjMyLjQiIGN5PSIyOS43IiByeD0iMC43IiByeT0iMC43Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBmaWxsPSIjQzBDMEJGIiBzdHJva2U9IiNDMEMwQkYiIHN0cm9rZS13aWR0aD0iMC4xIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0xMi44LDQ5LjVjMC42LDAsMS4xLTAuNSwxLjEtMS4xCgkJCWMwLTAuNi0wLjUtMS4yLTEuMS0xLjJjLTAuNiwwLTEuMiwwLjUtMS4yLDEuMkMxMS42LDQ5LDEyLjIsNDkuNSwxMi44LDQ5LjV6IE0xMi44LDQ4YzAuMiwwLDAuNCwwLjIsMC40LDAuNAoJCQljMCwwLjItMC4yLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRDMTIuNCw0OC4xLDEyLjYsNDgsMTIuOCw0OHoiLz4KCQk8cGF0aCBmaWxsPSIjQzBDMEJGIiBzdHJva2U9IiNDMEMwQkYiIHN0cm9rZS13aWR0aD0iMC4xIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik0xNC42LDUxLjJjLTAuMS0wLjEtMC4yLTAuMi0wLjMtMC4ySDUuNwoJCQljLTAuMSwwLTAuMiwwLjEtMC4zLDAuMmMtMC4xLDAuMS0wLjEsMC4yLDAsMC40YzAuNywyLDIuNSwzLjMsNC42LDMuM3MzLjktMS4zLDQuNi0zLjNDMTQuNyw1MS41LDE0LjcsNTEuMywxNC42LDUxLjJ6IE0xMCw1NC4xCgkJCWMtMS42LDAtMy0wLjktMy43LTIuMmg3LjNDMTMsNTMuMiwxMS42LDU0LjEsMTAsNTQuMXoiLz4KCQk8cGF0aCBmaWxsPSIjQzBDMEJGIiBzdHJva2U9IiNDMEMwQkYiIHN0cm9rZS13aWR0aD0iMC4xIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik03LjIsNDkuNWMwLjYsMCwxLjItMC41LDEuMi0xLjEKCQkJYzAtMC42LTAuNS0xLjItMS4yLTEuMmMtMC42LDAtMS4xLDAuNS0xLjEsMS4yQzYuMSw0OSw2LjYsNDkuNSw3LjIsNDkuNXogTTcuMiw0OGMwLjIsMCwwLjQsMC4yLDAuNCwwLjRjMCwwLjItMC4yLDAuNC0wLjQsMC40CgkJCWMtMC4yLDAtMC40LTAuMi0wLjQtMC40QzYuOCw0OC4xLDcsNDgsNy4yLDQ4eiIvPgoJCTxwYXRoIGZpbGw9IiNDMEMwQkYiIHN0cm9rZT0iI0MwQzBCRiIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEwLDQzYy0zLjgsMC03LDMuMS03LDdjMCwzLjgsMy4xLDcsNyw3CgkJCXM3LTMuMSw3LTdDMTcsNDYuMiwxMy44LDQzLDEwLDQzeiBNMTAsNTYuMmMtMy40LDAtNi4yLTIuOC02LjItNi4yYzAtMy40LDIuOC02LjIsNi4yLTYuMnM2LjIsMi44LDYuMiw2LjIKCQkJQzE2LjIsNTMuNCwxMy40LDU2LjIsMTAsNTYuMnoiLz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIGQ9Ik02NC4xLDUzLjRsMi4zLDBjMC4yLDAsMC40LDAuMiwwLjQsMC40djIuMWMwLDAuMi0wLjIsMC40LTAuNCwwLjRoLTIuMwoJCQkJYy0wLjIsMC0wLjQtMC4yLTAuNC0wLjR2LTIuMUM2My43LDUzLjYsNjMuOCw1My40LDY0LjEsNTMuNHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBkPSJNNzMuNSw1My41aDIuNGMwLjIsMCwwLjQsMC4yLDAuNCwwLjR2MmMwLDAuMi0wLjIsMC40LTAuNCwwLjRoLTIuNAoJCQkJYy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRsMC0yQzczLjEsNTMuNiw3My4zLDUzLjUsNzMuNSw1My41eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIGQ9Ik02My43LDQ4LjRoMTIuNnY1SDYzLjdWNDguNHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBkPSJNNjUuNSw0My42aDguOWMxLDAsMS45LDAuOCwxLjksMS45djMuMUg2My43di0zLjFDNjMuNyw0NC41LDY0LjUsNDMuNiw2NS41LDQzLjZ6Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiNDMEMwQkYiIGN4PSI2Ni4yIiBjeT0iNTAuOSIgcng9IjAuOSIgcnk9IjEiLz4KCQkJPGVsbGlwc2UgZmlsbD0iI0MwQzBCRiIgY3g9IjczLjgiIGN5PSI1MC45IiByeD0iMC45IiByeT0iMSIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIGQ9Ik05Ni40LDUwYzAsMy42LTIuOSw2LjUtNi40LDYuNXMtNi40LTIuOS02LjQtNi41czIuOS02LjUsNi40LTYuNVM5Ni40LDQ2LjQsOTYuNCw1MHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBkPSJNOTYuMyw0OC42YzAsMCwwLDAuMSwwLDAuMWMtMC45LDAuMS0yLjksMC4xLTQuNi0xLjJjLTEuMS0wLjgtMi0xLjctMi42LTIuNQoJCQkJYy0wLjMtMC40LTAuNi0wLjgtMC43LTFjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC4yYzAuNS0wLjEsMS4yLTAuMiwyLTAuMmMxLjIsMCwyLjUsMC4zLDMuNSwxLjFjMSwwLjgsMS43LDEuOCwyLjEsMi44CgkJCQlDOTYuMSw0Ny45LDk2LjIsNDguMyw5Ni4zLDQ4LjZ6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTg0LDUyLjJjMCwwLDAtMC4xLDAtMC4xYzAuOS0wLjIsMi45LTAuNCw0LjcsMC42YzEuMSwwLjcsMS45LDEuNSwyLjQsMi4zCgkJCQljMC40LDAuNSwwLjYsMSwwLjcsMS4zYy0wLjQsMC4xLTEsMC4yLTEuNywwLjNjLTEsMC0yLjEtMC4xLTMuMi0wLjhzLTEuOS0xLjYtMi40LTIuNUM4NC4yLDUyLjgsODQuMSw1Mi41LDg0LDUyLjJ6Ii8+CgkJPC9nPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMTE2LjMsNDYuOGwtMS40LDJsLTAuOC0wLjhsLTAuNi0wLjdsMCwwLjlsLTAuMSw4LjJoLTYuOAoJCQkJbC0wLjEtOC4ybDAtMC45bC0wLjYsMC43bC0wLjgsMC44bC0xLjQtMmwyLjYtMi45YzAuMS0wLjEsMC4yLTAuMSwwLjMtMC4xaDEuM2wwLjQsMC43YzAuNywxLjMsMi42LDEuMywzLjMtMC4xbDAuMy0wLjZoMS4yCgkJCQljMC4xLDAsMC4yLDAsMC4zLDAuMWwwLjMtMC4zbC0wLjMsMC4zTDExNi4zLDQ2Ljh6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTExMC4xLDQ3LjdoMnYwLjljMCwwLjQtMC40LDAuNy0xLDAuN2MtMC42LDAtMS0wLjMtMS0wLjdMMTEwLjEsNDcuN0wxMTAuMSw0Ny43eiIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIGQ9Ik0xMjYuOCw1NC4zYzAsMS4yLTEsMi4yLTIuMiwyLjJzLTIuMi0xLTIuMi0yLjJzMS0yLjIsMi4yLTIuMlMxMjYuOCw1My4xLDEyNi44LDU0LjN6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTEzNy42LDU0LjNjMCwxLjItMSwyLjItMi4yLDIuMmMtMS4yLDAtMi4yLTEtMi4yLTIuMnMxLTIuMiwyLjItMi4yCgkJCQlDMTM2LjYsNTIuMSwxMzcuNiw1My4xLDEzNy42LDU0LjN6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTEyNi44LDQ0LjR2OS45Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTEzNy43LDQ0LjR2OS45Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgZD0iTTEyNi44LDQzLjVoMTAuOHYyLjdoLTEwLjhDMTI2LjgsNDYuMiwxMjYuOCw0My41LDEyNi44LDQzLjV6Ii8+CgkJPC9nPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9IiNDMEMwQkYiIGQ9Ik0xNzAuOCw0My4xTDE3MC44LDQzLjFjLTAuMywwLTAuNSwwLTAuOCwwYy0yLjEsMC00LDEtNS4zLDIuNWwtMC4xLDBsLTAuMS0wLjFsLTEtMS4ybC0wLjMsMy40bDMuNCwwLjMKCQkJCWwtMS4xLTEuM2wtMC4xLTAuMWwwLjEtMC4xYzEuMS0xLjUsMy0yLjMsNS0yLjFsMCwwYzMuMiwwLjMsNS41LDMuMSw1LjIsNi4zYy0wLjMsMy0zLjEsNS4zLTYuMSw1LjFjLTMuMS0wLjItNS40LTIuOS01LjMtNgoJCQkJbC0xLjMtMC4xYy0wLjIsMy44LDIuNiw3LjEsNi4zLDcuNGMzLjksMC4zLDcuMy0yLjYsNy42LTYuNUMxNzcuMiw0Ni44LDE3NC40LDQzLjUsMTcwLjgsNDMuMXoiLz4KCQkJPHBhdGggZmlsbD0iI0MwQzBCRiIgZD0iTTE3MC4zLDQ3LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42cy0wLjYsMC4zLTAuNiwwLjZ2My4yYzAsMC4yLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMywwLjIsMC40LDAuMgoJCQkJaDIuNGMwLjQsMCwwLjYtMC4zLDAuNi0wLjZjMC0wLjMtMC4zLTAuNi0wLjYtMC42aC0xLjZoLTAuMnYtMC4yTDE3MC4zLDQ3LjRMMTcwLjMsNDcuNHoiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBkPSJNMTg2LjIsNDMuNGg3LjdjMS41LDAsMi43LDEuMiwyLjcsMi43djcuN2MwLDEuNS0xLjIsMi43LTIuNywyLjdoLTcuNwoJCQkJYy0xLjUsMC0yLjctMS4yLTIuNy0yLjd2LTcuN0MxODMuNCw0NC43LDE4NC43LDQzLjQsMTg2LjIsNDMuNHoiLz4KCQkJPGVsbGlwc2UgZmlsbD0iI0MwQzBCRiIgY3g9IjE4NiIgY3k9IjQ4LjkiIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQkJPGVsbGlwc2UgZmlsbD0iI0MwQzBCRiIgY3g9IjE5NCIgY3k9IjQ2LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0xODYsNTMuM2wwLjQtMC4zYzAuNC0wLjMsMS0wLjMsMS41LTAuMWwxLDAuNAoJCQkJYzAuNSwwLjIsMSwwLjIsMS41LTAuMWwwLjgtMC41YzAuNC0wLjMsMS0wLjMsMS41LTAuMWwxLjgsMC44Ii8+CgkJPC9nPgoJPC9nPgoJPHBhdGggZmlsbD0iI0MwQzBCRiIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2Utd2lkdGg9IjAuMjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTE1Niw0NC4zYy0wLjItMC4xLTAuNC0wLjEtMC41LDAKCQljMCwwLTAuMiwwLjEtMC45LDAuMmMtMC43LDAtMi40LTAuMS0zLjgtMC42Yy0wLjgtMC4zLTEuNy0wLjUtMi41LTAuNWMtMC4yLDAtMC40LDAtMC41LDBjLTEuMywwLTIuNSwwLjMtMy42LDEKCQljLTAuMiwwLjEtMC4yLDAuMi0wLjIsMC40djExLjZjMCwwLjMsMC4xLDAuNSwwLjMsMC41YzAuNiwwLDAuNS0wLjQsMC41LTAuNnYtNS43YzAuNy0wLjMsMy4yLTEuMSw1LjgtMC4xCgkJYzEuNiwwLjYsMy41LDAuNyw0LjMsMC43YzAuOCwwLDEuMy0wLjMsMS4zLTAuM2MwLjItMC4xLDAuMy0wLjIsMC4zLTAuNHYtNS43QzE1Ni4yLDQ0LjYsMTU2LjEsNDQuNCwxNTYsNDQuM3ogTTE1NS42LDUwLjIKCQljLTAuMSwwLTAuNywwLjEtMSwwLjFjLTAuNywwLTIuNC0wLjEtMy44LTAuNmMtMi41LTEtNS0wLjUtNi4yLTAuMXYtNC45YzAuOS0wLjUsMi4yLTAuNywzLjItMC43YzAuMSwwLDAuMywwLDAuNCwwCgkJYzAuNywwLDEuNSwwLjIsMi4yLDAuNGMxLjYsMC42LDMuNSwwLjcsNC4zLDAuN2MwLjIsMCwwLjgsMCwxLTAuMVY1MC4yeiIvPgoJPGc+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBkPSJNNDguMSw0My41aDMuN2MyLjUsMCw0LjUsMiw0LjUsNC41YzAsMC41LTAuNCwwLjktMC45LDAuOUg0NC41Yy0wLjUsMC0wLjktMC40LTAuOS0wLjkKCQkJQzQzLjYsNDUuNSw0NS42LDQzLjUsNDguMSw0My41eiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSw0OC44Yy0wLjIsMC4xLTAuNSwxLjIsMCwxLjVjMS40LDEsOC41LDAuOCwxMS4zLDAuNgoJCQljMC44LTAuMSwxLjYtMC40LDEuNy0xLjJjMC0wLjMtMC4xLTAuNi0wLjYtMC45Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDUwLjZMNDMuMyw1MWMtMC4yLDAuNSwwLjIsMSwwLjcsMC45YzAuMy0wLjEsMC41LDAsMC43LDAuMwoJCQlsMC4xLDAuMmMwLjMsMC41LDEsMC42LDEuNSwwLjJsMCwwYzAuMy0wLjIsMC43LTAuMywxLTAuMmwwLjgsMC4zYzAuNCwwLjIsMC44LDAuMSwxLjIsMGwwLjUtMC4yYzAuNC0wLjIsMC45LTAuMiwxLjMsMGwwLjUsMC4yCgkJCWMwLjQsMC4yLDAuOCwwLjIsMS4yLDBsMC4yLTAuMWMwLjMtMC4yLDAuOC0wLjIsMS4xLDAuMWwwLjIsMC4yYzAuMywwLjMsMC44LDAuMiwxLTAuMmwwLjEtMC4yYzAuMS0wLjIsMC0wLjMsMC4yLTAuMwoJCQljMC41LDAsMS4yLTAuMywxLjEtMC43bC0wLjQtMS4xIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDUyLjJjLTAuMSwwLjItMC4zLDAuOCwwLDEuMWMwLjMsMC40LDMsMS4xLDYuNCwxLjEKCQkJYzIuMiwwLDQuNi0wLjMsNi0wLjZjMC41LTAuMSwwLjktMC41LDAuOC0wLjljMC0wLjItMC4yLTAuNS0wLjQtMC43Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDUzLjNjMCwwLjUsMC42LDIuMywxLjMsMi43YzEuOCwwLjgsNS43LDAuNyw4LjEsMC41CgkJCWMxLjMtMC4xLDIuNS0wLjcsMy4yLTEuOGMwLjMtMC41LDAuNS0xLDAuNS0xLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iNTEuNiIgY3k9IjQ2LjUiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iNTMiIGN5PSI0NSIgcng9IjAuMyIgcnk9IjAuNCIvPgoJCTxlbGxpcHNlIGZpbGw9IiNDMEMwQkYiIGN4PSI1MyIgY3k9IjQ3LjIiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iNTQuMyIgY3k9IjQ2LjUiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iNTAuOSIgY3k9IjQ1IiByeD0iMC4zIiByeT0iMC40Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIGQ9Ik0yNC4yLDUxdi03LjZjMC4xLDAuMSwwLjgsMC45LDIuOCwzLjFjMi41LTEuNyw1LjYtMC43LDYuOSwwbDIuNC0zLjF2Ny4xCgkJCWMwLDEuMi0wLjEsMi41LTAuOSwzLjRjLTEsMS4yLTIuNywyLjUtNS4zLDIuNWMtMi45LDAtNC41LTEuNS01LjMtMi45QzI0LjIsNTIuOSwyNC4yLDUyLDI0LjIsNTF6Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0yMS4yLDUwbDUuNCwxLjIiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNDMEMwQkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTIxLjIsNTQuMWw1LjQtMS4yIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0zOC44LDUwbC01LjQsMS4yIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzBDMEJGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0zOC44LDU0LjFsLTUuNC0xLjIiLz4KCQk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0MwQzBCRiIgZD0iTTI5LjUsNTIuNEwyOSw1MS43Yy0wLjItMC4zLDAtMC42LDAuMy0wLjZoMS40CgkJCWMwLjMsMCwwLjUsMC40LDAuMywwLjZsLTAuNywxbDAsMGMtMC43LDEuMi0yLjYsMS4xLTMuMS0wLjNsLTAuMS0wLjJjLTAuMS0wLjIsMC0wLjQsMC4yLTAuNXMwLjQsMCwwLjUsMC4ybDAuMSwwLjIKCQkJQzI4LjMsNTIuOCwyOS4xLDUyLjksMjkuNSw1Mi40eiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwQzBCRiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzIuNCw1Mi4xbC0wLjEsMC4yYy0wLjQsMS0xLjgsMS4xLTIuMywwLjIiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iMjcuNiIgY3k9IjQ5LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQk8ZWxsaXBzZSBmaWxsPSIjQzBDMEJGIiBjeD0iMzIuNCIgY3k9IjQ5LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGZpbGw9IiM2QUE5REQiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTE0LjYsNzEuMmMtMC4xLTAuMS0wLjItMC4yLTAuMy0wLjJINS43CgkJCWMtMC4xLDAtMC4yLDAuMS0wLjMsMC4yYy0wLjEsMC4xLTAuMSwwLjIsMCwwLjRjMC43LDIsMi41LDMuMyw0LjYsMy4zczMuOS0xLjMsNC42LTMuM0MxNC43LDcxLjUsMTQuNyw3MS4zLDE0LjYsNzEuMnogTTEwLDc0LjEKCQkJYy0xLjYsMC0zLTAuOS0zLjctMi4yaDcuM0MxMyw3My4yLDExLjYsNzQuMSwxMCw3NC4xeiIvPgoJCTxwYXRoIGZpbGw9IiM2QUE5REQiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEyLjgsNjkuNWMwLjYsMCwxLjEtMC41LDEuMS0xLjEKCQkJYzAtMC42LTAuNS0xLjItMS4xLTEuMmMtMC42LDAtMS4yLDAuNS0xLjIsMS4yQzExLjYsNjksMTIuMiw2OS41LDEyLjgsNjkuNXogTTEyLjgsNjhjMC4yLDAsMC40LDAuMiwwLjQsMC40CgkJCWMwLDAuMi0wLjIsMC40LTAuNCwwLjRjLTAuMiwwLTAuNC0wLjItMC40LTAuNEMxMi40LDY4LjEsMTIuNiw2OCwxMi44LDY4eiIvPgoJCTxwYXRoIGZpbGw9IiM2QUE5REQiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTcuMiw2OS41YzAuNiwwLDEuMi0wLjUsMS4yLTEuMQoJCQljMC0wLjYtMC41LTEuMi0xLjItMS4yYy0wLjYsMC0xLjEsMC41LTEuMSwxLjJDNi4xLDY5LDYuNiw2OS41LDcuMiw2OS41eiBNNy4yLDY4YzAuMiwwLDAuNCwwLjIsMC40LDAuNGMwLDAuMi0wLjIsMC40LTAuNCwwLjQKCQkJYy0wLjIsMC0wLjQtMC4yLTAuNC0wLjRDNi44LDY4LjEsNyw2OCw3LjIsNjh6Ii8+CgkJPHBhdGggZmlsbD0iIzZBQTlERCIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2Utd2lkdGg9IjAuMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTAsNjNjLTMuOCwwLTcsMy4xLTcsN2MwLDMuOCwzLjEsNyw3LDcKCQkJczctMy4xLDctN0MxNyw2Ni4yLDEzLjgsNjMsMTAsNjN6IE0xMCw3Ni4yYy0zLjQsMC02LjItMi44LTYuMi02LjJjMC0zLjQsMi44LTYuMiw2LjItNi4yczYuMiwyLjgsNi4yLDYuMgoJCQlDMTYuMiw3My40LDEzLjQsNzYuMiwxMCw3Ni4yeiIvPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTY0LjEsNzMuNGwyLjMsMGMwLjIsMCwwLjQsMC4yLDAuNCwwLjR2Mi4xYzAsMC4yLTAuMiwwLjQtMC40LDAuNGgtMi4zCgkJCQljLTAuMiwwLTAuNC0wLjItMC40LTAuNHYtMi4xQzYzLjcsNzMuNiw2My44LDczLjQsNjQuMSw3My40eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIGQ9Ik03My41LDczLjVoMi40YzAuMiwwLDAuNCwwLjIsMC40LDAuNHYyLjFjMCwwLjItMC4yLDAuNC0wLjQsMC40aC0yLjQKCQkJCWMtMC4yLDAtMC40LTAuMi0wLjQtMC40bDAtMi4xQzczLjEsNzMuNiw3My4zLDczLjUsNzMuNSw3My41eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIGQ9Ik02My43LDY4LjRoMTIuNnY1SDYzLjdWNjguNHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBkPSJNNjUuNSw2My42aDguOWMxLDAsMS45LDAuOCwxLjksMS45djMuMUg2My43di0zLjFDNjMuNyw2NC41LDY0LjUsNjMuNiw2NS41LDYzLjZ6Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiM2QUE5REQiIGN4PSI2Ni4yIiBjeT0iNzAuOSIgcng9IjAuOSIgcnk9IjAuOSIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iNzMuOCIgY3k9IjcwLjkiIHJ4PSIwLjkiIHJ5PSIwLjkiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBkPSJNOTYuNCw3MGMwLDMuNi0yLjksNi41LTYuNCw2LjVzLTYuNC0yLjktNi40LTYuNXMyLjktNi41LDYuNC02LjVTOTYuNCw2Ni40LDk2LjQsNzB6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTk2LjMsNjguNmMwLDAsMCwwLjEsMCwwLjFjLTAuOSwwLjEtMi45LDAuMS00LjYtMS4yYy0xLjEtMC44LTItMS43LTIuNi0yLjUKCQkJCWMtMC4zLTAuNC0wLjYtMC44LTAuNy0xLjFjLTAuMS0wLjEtMC4xLTAuMi0wLjEtMC4yYzAuNS0wLjEsMS4yLTAuMiwyLTAuMmMxLjIsMCwyLjUsMC4zLDMuNSwxLjFjMSwwLjgsMS43LDEuOCwyLjEsMi44CgkJCQlDOTYuMSw2Ny45LDk2LjIsNjguMyw5Ni4zLDY4LjZ6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTg0LDcyLjJjMCwwLDAtMC4xLDAtMC4xYzAuOS0wLjIsMi45LTAuNCw0LjcsMC42YzEuMSwwLjcsMS45LDEuNSwyLjQsMi4zCgkJCQljMC40LDAuNSwwLjYsMSwwLjcsMS4zYy0wLjQsMC4xLTEsMC4yLTEuNywwLjNjLTEsMC0yLjEtMC4xLTMuMi0wLjhzLTEuOS0xLjYtMi40LTIuNUM4NC4yLDcyLjgsODQuMSw3Mi40LDg0LDcyLjJ6Ii8+CgkJPC9nPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMTE2LjMsNjYuOGwtMS40LDJsLTAuOC0wLjhsLTAuNi0wLjdsMCwwLjlsLTAuMSw4LjJoLTYuOAoJCQkJbC0wLjEtOC4ybDAtMC45bC0wLjYsMC43bC0wLjgsMC44bC0xLjQtMmwyLjYtMi45YzAuMS0wLjEsMC4yLTAuMSwwLjMtMC4xaDEuM2wwLjQsMC43YzAuNywxLjMsMi42LDEuMywzLjMtMC4xbDAuMy0wLjZoMS4yCgkJCQljMC4xLDAsMC4yLDAsMC4zLDAuMWwwLjMtMC4zbC0wLjMsMC4zTDExNi4zLDY2Ljh6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTExMC4xLDY3LjdoMnYwLjljMCwwLjQtMC40LDAuNy0xLDAuN2MtMC42LDAtMS0wLjMtMS0wLjdMMTEwLjEsNjcuN0wxMTAuMSw2Ny43eiIvPgoJCTwvZz4KCTwvZz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIGQ9Ik0xMjYuOCw3NC4zYzAsMS4yLTEsMi4yLTIuMiwyLjJzLTIuMi0xLTIuMi0yLjJzMS0yLjIsMi4yLTIuMlMxMjYuOCw3My4xLDEyNi44LDc0LjN6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTEzNy42LDc0LjNjMCwxLjItMSwyLjItMi4yLDIuMmMtMS4yLDAtMi4yLTEtMi4yLTIuMnMxLTIuMiwyLjItMi4yCgkJCQlDMTM2LjYsNzIuMSwxMzcuNiw3My4xLDEzNy42LDc0LjN6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTEyNi44LDY0LjR2OS45Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTEzNy43LDY0LjR2OS45Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgZD0iTTEyNi44LDYzLjVoMTAuOHYyLjdoLTEwLjhDMTI2LjgsNjYuMiwxMjYuOCw2My41LDEyNi44LDYzLjV6Ii8+CgkJPC9nPgoJPC9nPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9IiM2QUE5REQiIGQ9Ik0xNzAuOCw2My4xTDE3MC44LDYzLjFjLTAuMywwLTAuNSwwLTAuOCwwYy0yLjEsMC00LDEtNS4zLDIuNWwtMC4xLDBsLTAuMS0wLjFsLTEtMS4ybC0wLjMsMy40bDMuNCwwLjMKCQkJCWwtMS4xLTEuM2wtMC4xLTAuMWwwLjEtMC4xYzEuMS0xLjQsMy0yLjMsNS0yLjFsMCwwYzMuMiwwLjMsNS41LDMuMSw1LjIsNi4zYy0wLjMsMy0zLjEsNS4zLTYuMSw1LjFjLTMuMS0wLjItNS40LTIuOS01LjMtNgoJCQkJbC0xLjMtMC4xYy0wLjIsMy44LDIuNiw3LjEsNi4zLDcuNGMzLjksMC4zLDcuMy0yLjYsNy42LTYuNUMxNzcuMiw2Ni44LDE3NC40LDYzLjUsMTcwLjgsNjMuMXoiLz4KCQkJPHBhdGggZmlsbD0iIzZBQTlERCIgZD0iTTE3MC4zLDY3LjRjMC0wLjMtMC4zLTAuNi0wLjYtMC42cy0wLjYsMC4zLTAuNiwwLjZ2My4yYzAsMC4yLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMywwLjIsMC40LDAuMgoJCQkJaDIuNGMwLjQsMCwwLjYtMC4zLDAuNi0wLjZTMTcyLjQsNzAsMTcyLDcwaC0xLjZoLTAuMnYtMC4yTDE3MC4zLDY3LjRMMTcwLjMsNjcuNHoiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBkPSJNMTg2LjIsNjMuNGg3LjdjMS41LDAsMi43LDEuMiwyLjcsMi43djcuN2MwLDEuNS0xLjIsMi43LTIuNywyLjdoLTcuNwoJCQkJYy0xLjUsMC0yLjctMS4yLTIuNy0yLjd2LTcuN0MxODMuNCw2NC43LDE4NC43LDYzLjQsMTg2LjIsNjMuNHoiLz4KCQkJPGVsbGlwc2UgZmlsbD0iIzZBQTlERCIgY3g9IjE4NiIgY3k9IjY4LjkiIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQkJPGVsbGlwc2UgZmlsbD0iIzZBQTlERCIgY3g9IjE5NCIgY3k9IjY2LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0xODYsNzMuM2wwLjQtMC4zYzAuNC0wLjMsMS0wLjMsMS41LTAuMWwxLDAuNAoJCQkJYzAuNSwwLjIsMSwwLjIsMS41LTAuMWwwLjgtMC41YzAuNC0wLjMsMS0wLjMsMS41LTAuMWwxLjgsMC44Ii8+CgkJPC9nPgoJPC9nPgoJPHBhdGggZmlsbD0iIzZBQTlERCIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2Utd2lkdGg9IjAuMjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTE1Niw2NC4zYy0wLjItMC4xLTAuNC0wLjEtMC41LDAKCQljMCwwLTAuMiwwLjEtMC45LDAuMmMtMC43LDAtMi40LTAuMS0zLjgtMC42Yy0wLjgtMC4zLTEuNy0wLjUtMi41LTAuNWMtMC4yLDAtMC40LDAtMC41LDBjLTEuMywwLTIuNSwwLjMtMy42LDEKCQljLTAuMiwwLjEtMC4yLDAuMi0wLjIsMC40djExLjZjMCwwLjMsMC4xLDAuNSwwLjMsMC41YzAuNiwwLDAuNS0wLjQsMC41LTAuNnYtNS43YzAuNy0wLjMsMy4yLTEuMSw1LjgtMC4xCgkJYzEuNiwwLjYsMy41LDAuNyw0LjMsMC43YzAuOCwwLDEuMy0wLjMsMS4zLTAuM2MwLjItMC4xLDAuMy0wLjIsMC4zLTAuNHYtNS43QzE1Ni4yLDY0LjYsMTU2LjEsNjQuNCwxNTYsNjQuM3ogTTE1NS42LDcwLjIKCQljLTAuMSwwLTAuNywwLjEtMSwwLjFjLTAuNywwLTIuNC0wLjEtMy44LTAuNmMtMi41LTEtNS0wLjUtNi4yLTAuMXYtNC45YzAuOS0wLjUsMi4yLTAuNywzLjItMC43YzAuMSwwLDAuMywwLDAuNCwwCgkJYzAuNywwLDEuNSwwLjIsMi4yLDAuNGMxLjYsMC42LDMuNSwwLjcsNC4zLDAuN2MwLjIsMCwwLjgsMCwxLTAuMVY3MC4yeiIvPgoJPGc+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBkPSJNNDguMSw2My41aDMuN2MyLjUsMCw0LjUsMiw0LjUsNC41YzAsMC41LTAuNCwwLjktMC45LDAuOUg0NC41Yy0wLjUsMC0wLjktMC40LTAuOS0wLjkKCQkJQzQzLjYsNjUuNSw0NS42LDYzLjUsNDguMSw2My41eiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSw2OC44Yy0wLjIsMC4xLTAuNSwxLjIsMCwxLjVjMS40LDAuOSw4LjUsMC44LDExLjMsMC42CgkJCWMwLjgtMC4xLDEuNi0wLjQsMS43LTEuMmMwLTAuMy0wLjEtMC42LTAuNi0wLjkiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTQzLjUsNzAuNkw0My4zLDcxYy0wLjIsMC41LDAuMiwxLDAuNywwLjljMC4zLTAuMSwwLjUsMC4xLDAuNywwLjMKCQkJbDAuMSwwLjJjMC4zLDAuNSwxLDAuNiwxLjUsMC4ybDAsMGMwLjMtMC4yLDAuNy0wLjMsMS0wLjJsMC44LDAuM2MwLjQsMC4yLDAuOCwwLjEsMS4yLDBsMC41LTAuMmMwLjQtMC4yLDAuOS0wLjIsMS4zLDBsMC41LDAuMgoJCQljMC40LDAuMiwwLjgsMC4yLDEuMi0wLjFsMC4yLTAuMWMwLjMtMC4yLDAuOC0wLjIsMS4xLDAuMWwwLjIsMC4yYzAuMywwLjMsMC44LDAuMiwxLTAuMmwwLjEtMC4yYzAuMS0wLjIsMC0wLjMsMC4yLTAuMwoJCQljMC41LDAsMS4yLTAuMywxLjEtMC43bC0wLjQtMS4xIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDcyLjJjLTAuMSwwLjItMC4zLDAuOCwwLDEuMWMwLjMsMC40LDMsMS4xLDYuNCwxLjEKCQkJYzIuMiwwLDQuNi0wLjMsNi0wLjZjMC41LTAuMSwwLjktMC40LDAuOC0wLjljMC0wLjItMC4yLTAuNS0wLjQtMC43Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDczLjNjMCwwLjUsMC42LDIuMywxLjMsMi43YzEuOCwwLjgsNS43LDAuNyw4LjEsMC41CgkJCWMxLjMtMC4xLDIuNS0wLjcsMy4yLTEuOGMwLjMtMC41LDAuNS0xLDAuNS0xLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iNTEuNiIgY3k9IjY2LjUiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iNTMiIGN5PSI2NSIgcng9IjAuMyIgcnk9IjAuNCIvPgoJCTxlbGxpcHNlIGZpbGw9IiM2QUE5REQiIGN4PSI1MyIgY3k9IjY3LjIiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iNTQuMyIgY3k9IjY2LjUiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iNTAuOSIgY3k9IjY1IiByeD0iMC4zIiByeT0iMC40Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIGQ9Ik0yNC4yLDcxdi03LjZjMC4xLDAuMSwwLjgsMC45LDIuOCwzLjFjMi41LTEuNyw1LjYtMC43LDYuOSwwbDIuNC0zLjF2Ny4xCgkJCWMwLDEuMi0wLjEsMi41LTAuOSwzLjRjLTEsMS4yLTIuNywyLjUtNS4zLDIuNWMtMi45LDAtNC41LTEuNS01LjMtMi45QzI0LjIsNzIuOSwyNC4yLDcyLDI0LjIsNzF6Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNkFBOUREIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0yMS4yLDcwLjFsNS40LDEuMiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMjEuMiw3NC4xbDUuNC0xLjIiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM2QUE5REQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTM4LjgsNzAuMWwtNS40LDEuMiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzguOCw3NC4xbC01LjQtMS4yIi8+CgkJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM2QUE5REQiIGQ9Ik0yOS41LDcyLjRMMjksNzEuN2MtMC4yLTAuMywwLTAuNiwwLjMtMC42aDEuNAoJCQljMC4zLDAsMC41LDAuNCwwLjMsMC42bC0wLjcsMWwwLDBjLTAuNywxLjItMi42LDEuMS0zLjEtMC4zbC0wLjEtMC4yYy0wLjEtMC4yLDAtMC40LDAuMi0wLjVjMC4yLTAuMSwwLjQsMCwwLjUsMC4ybDAuMSwwLjIKCQkJQzI4LjMsNzIuOCwyOS4xLDcyLjksMjkuNSw3Mi40eiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZBQTlERCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzIuNCw3Mi4xbC0wLjEsMC4yYy0wLjQsMS0xLjgsMS4xLTIuMywwLjIiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iMjcuNiIgY3k9IjY5LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCQk8ZWxsaXBzZSBmaWxsPSIjNkFBOUREIiBjeD0iMzIuNCIgY3k9IjY5LjciIHJ4PSIwLjciIHJ5PSIwLjciLz4KCTwvZz4KPC9nPgo8Zz4KCTxwYXRoIGZpbGw9IiM4Njg2ODYiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEyLjgsOS41YzAuNiwwLDEuMS0wLjUsMS4xLTEuMgoJCWMwLTAuNi0wLjUtMS4xLTEuMS0xLjFjLTAuNiwwLTEuMiwwLjUtMS4yLDEuMVMxMi4yLDkuNSwxMi44LDkuNXogTTEyLjgsNy45YzAuMiwwLDAuNCwwLjIsMC40LDAuNGMwLDAuMi0wLjIsMC40LTAuNCwwLjQKCQljLTAuMiwwLTAuNC0wLjItMC40LTAuNEMxMi40LDguMSwxMi42LDcuOSwxMi44LDcuOXoiLz4KCTxwYXRoIGZpbGw9IiM4Njg2ODYiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLXdpZHRoPSIwLjEiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTcuMiw5LjVjMC42LDAsMS4yLTAuNSwxLjItMS4yCgkJYzAtMC42LTAuNS0xLjEtMS4yLTEuMWMtMC42LDAtMS4xLDAuNS0xLjEsMS4xUzYuNiw5LjUsNy4yLDkuNXogTTcuMiw3LjljMC4yLDAsMC40LDAuMiwwLjQsMC40YzAsMC4yLTAuMiwwLjQtMC40LDAuNAoJCUM3LDguNyw2LjgsOC41LDYuOCw4LjNDNi44LDguMSw3LDcuOSw3LjIsNy45eiIvPgoJPHBhdGggZmlsbD0iIzg2ODY4NiIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2Utd2lkdGg9IjAuMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTQuNiwxMS4yYy0wLjEtMC4xLTAuMi0wLjItMC4zLTAuMkg1LjcKCQljLTAuMSwwLTAuMiwwLjEtMC4zLDAuMmMtMC4xLDAuMS0wLjEsMC4yLDAsMC40YzAuNywyLDIuNSwzLjMsNC42LDMuM3MzLjktMS4zLDQuNi0zLjNDMTQuNywxMS40LDE0LjcsMTEuMywxNC42LDExLjJ6IE0xMCwxNC4xCgkJYy0xLjYsMC0zLTAuOS0zLjctMi4yaDcuM0MxMywxMy4yLDExLjYsMTQuMSwxMCwxNC4xeiIvPgoJPHBhdGggZmlsbD0iIzg2ODY4NiIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2Utd2lkdGg9IjAuMSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTAsM2MtMy44LDAtNywzLjEtNyw3czMuMSw3LDcsN3M3LTMuMSw3LTcKCQlTMTMuOCwzLDEwLDN6IE0xMCwxNi4yYy0zLjQsMC02LjItMi44LTYuMi02LjJTNi42LDMuOCwxMCwzLjhzNi4yLDIuOCw2LjIsNi4yUzEzLjQsMTYuMiwxMCwxNi4yeiIvPgo8L2c+CjxnIGlkPSJDYXJfMDAwMDAwMTg5MzUzOTUwODU0MTM0MTM3NTAwMDAwMDA4MjUyNzM4Nzc4NDI3NzU3MTVfIj4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik02NC4xLDEzLjRsMi4zLDBjMC4yLDAsMC40LDAuMiwwLjQsMC40djIuMWMwLDAuMi0wLjIsMC40LTAuNCwwLjRoLTIuMwoJCQkJYy0wLjIsMC0wLjQtMC4yLTAuNC0wLjR2LTIuMUM2My43LDEzLjYsNjMuOCwxMy40LDY0LjEsMTMuNHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNNzMuNSwxMy40aDIuNGMwLjIsMCwwLjQsMC4yLDAuNCwwLjR2Mi4xYzAsMC4yLTAuMiwwLjQtMC40LDAuNGgtMi40CgkJCQljLTAuMiwwLTAuNC0wLjItMC40LTAuNGwwLTIuMUM3My4xLDEzLjYsNzMuMywxMy40LDczLjUsMTMuNHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNNjMuNyw4LjRoMTIuNnY1SDYzLjdWOC40eiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik02NS41LDMuNmg4LjljMSwwLDEuOSwwLjgsMS45LDEuOXYzLjFINjMuN1Y1LjVDNjMuNyw0LjQsNjQuNSwzLjYsNjUuNSwzLjZ6Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiM4Njg2ODYiIGN4PSI2Ni4yIiBjeT0iMTAuOSIgcng9IjAuOSIgcnk9IjAuOSIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjODY4Njg2IiBjeD0iNzMuOCIgY3k9IjEwLjkiIHJ4PSIwLjkiIHJ5PSIwLjkiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGcgaWQ9IkFjdGl2aXRpZXMiPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgZD0iTTk2LjQsMTBjMCwzLjYtMi45LDYuNS02LjQsNi41cy02LjQtMi45LTYuNC02LjVzMi45LTYuNSw2LjQtNi41Uzk2LjQsNi40LDk2LjQsMTB6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgZD0iTTk2LjMsOC42YzAsMCwwLDAuMSwwLDAuMWMtMC45LDAuMS0yLjksMC4xLTQuNi0xLjJjLTEuMS0wLjgtMi0xLjctMi42LTIuNQoJCQkJYy0wLjMtMC40LTAuNi0wLjgtMC43LTEuMWMtMC4xLTAuMS0wLjEtMC4yLTAuMS0wLjJjMC41LTAuMSwxLjItMC4yLDItMC4yYzEuMiwwLDIuNSwwLjMsMy41LDEuMWMxLDAuOCwxLjcsMS44LDIuMSwyLjgKCQkJCUM5Ni4xLDcuOSw5Ni4yLDguMyw5Ni4zLDguNnoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNODQsMTIuMWMwLDAsMC0wLjEsMC0wLjFjMC45LTAuMiwyLjktMC40LDQuNywwLjZjMS4xLDAuNiwxLjksMS41LDIuNCwyLjMKCQkJCWMwLjQsMC41LDAuNiwxLDAuNywxLjNjLTAuNCwwLjEtMSwwLjItMS43LDAuM2MtMSwwLTIuMS0wLjEtMy4yLTAuOGMtMS4xLTAuNi0xLjktMS42LTIuNC0yLjVDODQuMiwxMi44LDg0LjEsMTIuNCw4NCwxMi4xeiIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyBpZD0iT2JqZWN0c18wMDAwMDA2NDMxMjM3MTczOTEzMDMxNTI1MDAwMDAxMDIyNTg4OTAzMjIyODYzMjk3NV8iPgoJPGc+CgkJPGc+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMTE2LjMsNi44bC0xLjQsMkwxMTQuMSw4bC0wLjYtMC43bDAsMC45bC0wLjEsOC4yaC02LjhsLTAuMS04LjIKCQkJCWwwLTAuOUwxMDUuOSw4bC0wLjgsMC44bC0xLjQtMmwyLjYtMi45YzAuMS0wLjEsMC4yLTAuMSwwLjMtMC4xaDEuM2wwLjQsMC43YzAuNywxLjMsMi42LDEuMywzLjMtMC4xbDAuMy0wLjZoMS4yCgkJCQljMC4xLDAsMC4yLDAsMC4zLDAuMWwwLjMtMC4zbC0wLjMsMC4zTDExNi4zLDYuOHoiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNMTEwLjEsNy43aDJ2MC45YzAsMC40LTAuNCwwLjctMSwwLjdjLTAuNiwwLTEtMC4zLTEtMC43TDExMC4xLDcuN0wxMTAuMSw3Ljd6Ii8+CgkJPC9nPgoJPC9nPgo8L2c+CjxnIGlkPSJTeW1ib2xzXzAwMDAwMDk2NzQ2OTA3ODY5OTI5OTIxMTgwMDAwMDA2NDg0ODEyODMwMjgyNTgyNDE2XyI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNMTI2LjgsMTQuM2MwLDEuMi0xLDIuMi0yLjIsMi4ycy0yLjItMS0yLjItMi4yczEtMi4yLDIuMi0yLjJTMTI2LjgsMTMuMSwxMjYuOCwxNC4zeiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik0xMzcuNiwxNC4zYzAsMS4yLTEsMi4yLTIuMiwyLjJjLTEuMiwwLTIuMi0xLTIuMi0yLjJzMS0yLjIsMi4yLTIuMgoJCQkJQzEzNi42LDEyLjEsMTM3LjYsMTMuMSwxMzcuNiwxNC4zeiIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik0xMjYuOCw0LjR2OS45Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgZD0iTTEzNy43LDQuNHY5LjkiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBkPSJNMTI2LjgsMy41aDEwLjh2Mi43aC0xMC44QzEyNi44LDYuMiwxMjYuOCwzLjUsMTI2LjgsMy41eiIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyBpZD0iUmVjZW50cyI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZmlsbD0iIzg2ODY4NiIgZD0iTTE3MC44LDMuMUwxNzAuOCwzLjFjLTAuMywwLTAuNSwwLTAuOCwwYy0yLjEsMC00LDEtNS4zLDIuNWwtMC4xLDBsLTAuMS0wLjFsLTEtMS4ybC0wLjMsMy40bDMuNCwwLjMKCQkJCWwtMS4xLTEuM2wtMC4xLTAuMWwwLjEtMC4xYzEuMS0xLjQsMy0yLjMsNS0yLjFsMCwwYzMuMiwwLjMsNS41LDMuMSw1LjIsNi4zYy0wLjMsMy0zLjEsNS4zLTYuMSw1LjFjLTMuMS0wLjItNS40LTIuOS01LjMtNgoJCQkJTDE2Myw5LjVjLTAuMiwzLjgsMi42LDcuMSw2LjMsNy40YzMuOSwwLjQsNy4zLTIuNiw3LjYtNi41QzE3Ny4yLDYuOCwxNzQuNCwzLjUsMTcwLjgsMy4xeiIvPgoJCQk8cGF0aCBmaWxsPSIjODY4Njg2IiBkPSJNMTcwLjMsNy40YzAtMC4zLTAuMy0wLjYtMC42LTAuNlMxNjksNy4xLDE2OSw3LjR2My4yYzAsMC4yLDAuMSwwLjMsMC4yLDAuNGMwLjEsMC4xLDAuMywwLjIsMC40LDAuMgoJCQkJaDIuNGMwLjQsMCwwLjYtMC4zLDAuNi0wLjZzLTAuMy0wLjYtMC42LTAuNmgtMS42aC0wLjJWOS44TDE3MC4zLDcuNEwxNzAuMyw3LjR6Ii8+CgkJPC9nPgoJPC9nPgo8L2c+CjxnIGlkPSJDdXN0b21fMDAwMDAxODEwODcyMjk0MzQzMDIzMzY3ODAwMDAwMDUxNTIyNzc5NDU5NDA2NzQ0ODhfIj4KCTxnPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik0xODYuMiwzLjRoNy43YzEuNSwwLDIuNywxLjIsMi43LDIuN3Y3LjdjMCwxLjUtMS4yLDIuNy0yLjcsMi43aC03LjcKCQkJCWMtMS41LDAtMi43LTEuMi0yLjctMi43VjYuMUMxODMuNCw0LjYsMTg0LjcsMy40LDE4Ni4yLDMuNHoiLz4KCQkJPGVsbGlwc2UgZmlsbD0iIzg2ODY4NiIgY3g9IjE4NiIgY3k9IjguOSIgcng9IjAuNyIgcnk9IjAuNyIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjODY4Njg2IiBjeD0iMTk0IiBjeT0iNi43IiByeD0iMC43IiByeT0iMC43Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMTg2LDEzLjNsMC40LTAuM2MwLjQtMC4zLDEtMC4zLDEuNS0wLjFsMSwwLjQKCQkJCWMwLjUsMC4yLDEsMC4yLDEuNS0wLjFsMC44LTAuNWMwLjQtMC4zLDEtMC4zLDEuNS0wLjFsMS44LDAuOCIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8cGF0aCBmaWxsPSIjODY4Njg2IiBzdHJva2U9IiM4Njg2ODYiIHN0cm9rZS13aWR0aD0iMC4yNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTU2LDQuM2MtMC4yLTAuMS0wLjQtMC4xLTAuNSwwCgljMCwwLTAuMiwwLjEtMC45LDAuMWMtMC43LDAtMi40LTAuMS0zLjgtMC42Yy0wLjgtMC4zLTEuNy0wLjUtMi41LTAuNWMtMC4yLDAtMC40LDAtMC41LDBjLTEuMywwLTIuNSwwLjMtMy42LDEKCWMtMC4yLDAuMS0wLjIsMC4yLTAuMiwwLjR2MTEuNmMwLDAuMywwLjEsMC41LDAuMywwLjVjMC42LDAsMC41LTAuNCwwLjUtMC42di01LjdjMC43LTAuMywzLjItMS4xLDUuOC0wLjFjMS42LDAuNiwzLjUsMC43LDQuMywwLjcKCWMwLjgsMCwxLjMtMC4zLDEuMy0wLjNjMC4yLTAuMSwwLjMtMC4yLDAuMy0wLjRWNC43QzE1Ni4yLDQuNSwxNTYuMSw0LjQsMTU2LDQuM3ogTTE1NS42LDEwLjJjLTAuMSwwLTAuNywwLjEtMSwwLjEKCWMtMC43LDAtMi40LTAuMS0zLjgtMC42Yy0yLjUtMS01LTAuNS02LjItMC4xVjQuN2MwLjktMC41LDIuMi0wLjcsMy4yLTAuN2MwLjEsMCwwLjMsMCwwLjQsMGMwLjcsMCwxLjUsMC4yLDIuMiwwLjQKCWMxLjYsMC42LDMuNSwwLjcsNC4zLDAuN2MwLjIsMCwwLjgsMCwxLTAuMVYxMC4yeiIvPgo8ZyBpZD0iRm9vZCI+Cgk8ZyBpZD0iTGF5ZXJfMTIiPgoJCTxnPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIGQ9Ik00OC4xLDMuNWgzLjdjMi41LDAsNC41LDIsNC41LDQuNWMwLDAuNS0wLjQsMC45LTAuOSwwLjlINDQuNWMtMC41LDAtMC45LTAuNC0wLjktMC45CgkJCQlDNDMuNiw1LjUsNDUuNiwzLjUsNDguMSwzLjV6Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSw4LjdjLTAuMiwwLjEtMC41LDEuMiwwLDEuNWMxLjQsMC45LDguNSwwLjgsMTEuMywwLjYKCQkJCWMwLjgtMC4xLDEuNi0wLjQsMS43LTEuMmMwLTAuMy0wLjEtMC42LTAuNi0wLjkiLz4KCQkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik00My41LDEwLjZMNDMuMywxMWMtMC4yLDAuNSwwLjIsMSwwLjcsMC45CgkJCQljMC4zLTAuMSwwLjUsMC4xLDAuNywwLjNsMC4xLDAuMmMwLjMsMC41LDEsMC42LDEuNSwwLjJsMCwwYzAuMy0wLjIsMC43LTAuMywxLTAuMmwwLjgsMC4zYzAuNCwwLjEsMC44LDAuMSwxLjIsMGwwLjUtMC4yCgkJCQljMC40LTAuMiwwLjktMC4yLDEuMywwbDAuNSwwLjJjMC40LDAuMiwwLjgsMC4xLDEuMi0wLjFsMC4yLTAuMWMwLjMtMC4yLDAuOC0wLjEsMS4xLDAuMWwwLjIsMC4yYzAuMywwLjMsMC44LDAuMiwxLTAuMmwwLjEtMC4yCgkJCQljMC4xLTAuMiwwLTAuMywwLjItMC40YzAuNSwwLDEuMi0wLjMsMS4xLTAuN2wtMC40LTEuMSIvPgoJCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTQzLjUsMTIuMWMtMC4xLDAuMi0wLjMsMC44LDAsMS4xYzAuMywwLjQsMywxLjEsNi40LDEuMQoJCQkJYzIuMiwwLDQuNi0wLjMsNi0wLjZjMC41LTAuMSwwLjktMC40LDAuOC0wLjljMC0wLjItMC4yLTAuNS0wLjQtMC43Ii8+CgkJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNNDMuNSwxMy4zYzAsMC41LDAuNiwyLjQsMS4zLDIuNmMxLjgsMC44LDUuNywwLjcsOC4xLDAuNQoJCQkJYzEuMy0wLjEsMi41LTAuNywzLjItMS44YzAuMy0wLjUsMC41LTEsMC41LTEuNCIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjODY4Njg2IiBjeD0iNTEuNiIgY3k9IjYuNSIgcng9IjAuMyIgcnk9IjAuNCIvPgoJCQk8ZWxsaXBzZSBmaWxsPSIjODY4Njg2IiBjeD0iNTMiIGN5PSI0LjkiIHJ4PSIwLjMiIHJ5PSIwLjQiLz4KCQkJPGVsbGlwc2UgZmlsbD0iIzg2ODY4NiIgY3g9IjUzIiBjeT0iNy4yIiByeD0iMC4zIiByeT0iMC40Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiM4Njg2ODYiIGN4PSI1NC4zIiBjeT0iNi41IiByeD0iMC4zIiByeT0iMC40Ii8+CgkJCTxlbGxpcHNlIGZpbGw9IiM4Njg2ODYiIGN4PSI1MC45IiBjeT0iNC45IiByeD0iMC4zIiByeT0iMC40Ii8+CgkJPC9nPgoJPC9nPgo8L2c+CjxnIGlkPSJBbmltYWxzIj4KCTxnPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgZD0iTTI0LjIsMTFWMy41YzAuMSwwLjEsMC44LDAuOSwyLjgsMy4xYzIuNS0xLjcsNS42LTAuNyw2LjksMGwyLjQtMy4xdjcuMQoJCQljMCwxLjItMC4xLDIuNS0wLjksMy40Yy0xLDEuMi0yLjcsMi41LTUuMywyLjVjLTIuOSwwLTQuNS0xLjUtNS4zLTIuOUMyNC4yLDEyLjksMjQuMiwxMS45LDI0LjIsMTF6Ii8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0yMS4yLDEwbDUuNCwxLjIiLz4KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM4Njg2ODYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTIxLjIsMTQuMWw1LjQtMS4yIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0zOC44LDEwbC01LjQsMS4yIi8+CgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjODY4Njg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0zOC44LDE0LjFsLTUuNC0xLjIiLz4KCQk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzg2ODY4NiIgZD0iTTI5LjUsMTIuNEwyOSwxMS43Yy0wLjItMC4zLDAtMC42LDAuMy0wLjZoMS40CgkJCWMwLjMsMCwwLjUsMC40LDAuMywwLjZsLTAuNywxbDAsMGMtMC43LDEuMi0yLjYsMS4xLTMuMS0wLjNsLTAuMS0wLjJjLTAuMS0wLjIsMC0wLjQsMC4yLTAuNXMwLjQsMCwwLjUsMC4ybDAuMSwwLjIKCQkJQzI4LjMsMTIuNywyOS4xLDEyLjksMjkuNSwxMi40eiIvPgoJCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg2ODY4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBkPSJNMzIuNCwxMi4xbC0wLjEsMC4yYy0wLjQsMS0xLjgsMS4xLTIuMywwLjIiLz4KCQk8ZWxsaXBzZSBmaWxsPSIjODY4Njg2IiBjeD0iMjcuNiIgY3k9IjkuNyIgcng9IjAuNyIgcnk9IjAuNyIvPgoJCTxlbGxpcHNlIGZpbGw9IiM4Njg2ODYiIGN4PSIzMi40IiBjeT0iOS43IiByeD0iMC43IiByeT0iMC43Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+";
function CategoryButton(_ref) {
  var _cx;
  var isActiveCategory = _ref.isActiveCategory, category = _ref.category, allowNavigation = _ref.allowNavigation, categoryConfig = _ref.categoryConfig, onClick = _ref.onClick;
  return (0, import_react.createElement)(Button, {
    tabIndex: allowNavigation ? 0 : -1,
    className: cx(styles$f.catBtn, commonInteractionStyles.categoryBtn, "epr-icn-" + category, (_cx = {}, _cx[ClassNames.active] = isActiveCategory, _cx)),
    onClick,
    "aria-label": categoryNameFromCategoryConfig(categoryConfig),
    "aria-selected": isActiveCategory,
    role: "tab",
    "aria-controls": "epr-category-nav-id"
  });
}
var DarkActivePositionY = {
  backgroundPositionY: "calc(var(--epr-category-navigation-button-size) * 3)"
};
var DarkPositionY = {
  backgroundPositionY: "calc(var(--epr-category-navigation-button-size) * 2)"
};
var DarkInactivePosition = {
  ":not(.epr-search-active)": {
    catBtn: {
      ":hover": DarkActivePositionY,
      "&.epr-active": DarkActivePositionY
    }
  }
};
var styles$f = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  catBtn: {
    ".": "epr-cat-btn",
    display: "inline-block",
    transition: "opacity 0.2s ease-in-out",
    position: "relative",
    height: "var(--epr-category-navigation-button-size)",
    width: "var(--epr-category-navigation-button-size)",
    backgroundSize: "calc(var(--epr-category-navigation-button-size) * 10)",
    outline: "none",
    backgroundPosition: "0 0",
    backgroundImage: "url(" + SVGNavigation + ")",
    ":focus:before": {
      content: "",
      position: "absolute",
      top: "-2px",
      left: "-2px",
      right: "-2px",
      bottom: "-2px",
      border: "2px solid var(--epr-category-icon-active-color)",
      borderRadius: "50%"
    },
    "&.epr-icn-suggested": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -8)"
    },
    "&.epr-icn-custom": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -9)"
    },
    "&.epr-icn-activities": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -4)"
    },
    "&.epr-icn-animals_nature": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -1)"
    },
    "&.epr-icn-flags": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -7)"
    },
    "&.epr-icn-food_drink": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -2)"
    },
    "&.epr-icn-objects": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -5)"
    },
    "&.epr-icn-smileys_people": {
      backgroundPositionX: "0px"
    },
    "&.epr-icn-symbols": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -6)"
    },
    "&.epr-icn-travel_places": {
      backgroundPositionX: "calc(var(--epr-category-navigation-button-size) * -3)"
    }
  }
}, /* @__PURE__ */ darkMode("catBtn", DarkPositionY), {
  ".epr-dark-theme": /* @__PURE__ */ _extends({}, DarkInactivePosition),
  ".epr-auto-theme": /* @__PURE__ */ _extends({}, DarkInactivePosition)
}));
function CategoryNavigation() {
  var _useState = (0, import_react.useState)(null), activeCategory = _useState[0], setActiveCategory = _useState[1];
  var _useVisibleCategories = useVisibleCategoriesState(), setVisibleCategories = _useVisibleCategories[1];
  var scrollCategoryIntoView = useScrollCategoryIntoView();
  useActiveCategoryScrollDetection({
    setActiveCategory,
    setVisibleCategories
  });
  var isSearchMode = useIsSearchMode();
  var categoriesConfig = useCategoriesConfig();
  var CategoryNavigationRef = useCategoryNavigationRef();
  var hideCustomCategory = useShouldHideCustomEmojis();
  return (0, import_react.createElement)("div", {
    className: cx(styles$g.nav),
    role: "tablist",
    "aria-label": "Category navigation",
    id: "epr-category-nav-id",
    ref: CategoryNavigationRef
  }, categoriesConfig.map(function(categoryConfig) {
    var category = categoryFromCategoryConfig(categoryConfig);
    var isActiveCategory = category === activeCategory;
    if (isCustomCategory(categoryConfig) && hideCustomCategory) {
      return null;
    }
    var allowNavigation = !isSearchMode && !isActiveCategory;
    return (0, import_react.createElement)(CategoryButton, {
      key: category,
      category,
      isActiveCategory,
      allowNavigation,
      categoryConfig,
      onClick: function onClick() {
        scrollCategoryIntoView(category);
        setTimeout(function() {
          setActiveCategory(category);
        }, 10);
      }
    });
  }));
}
var styles$g = /* @__PURE__ */ stylesheet.create({
  nav: {
    ".": "epr-category-nav",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "var(--epr-header-padding)"
  },
  ".epr-search-active": {
    nav: {
      opacity: "0.3",
      cursor: "default",
      pointerEvents: "none"
    }
  },
  ".epr-main:has(input:not(:placeholder-shown))": {
    nav: {
      opacity: "0.3",
      cursor: "default",
      pointerEvents: "none"
    }
  }
});
var SVGTimes = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjgwcHgiIHZpZXdCb3g9IjAgMCAyMCA4MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAgODAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjODY4Njg2IiBkPSJNNi45OCwxMy41OWMwLjEsMC4xLDAuMjQsMC4xNSwwLjM3LDAuMTVzMC4yNy0wLjA1LDAuMzctMC4xNWwyLjQyLTIuNDJsMi40MywyLjQzCgljMC4xLDAuMSwwLjI0LDAuMTUsMC4zNywwLjE1YzAuMTQsMCwwLjI3LTAuMDUsMC4zNy0wLjE1YzAuMjEtMC4yMSwwLjIxLTAuNTQsMC0wLjc1bC0yLjQzLTIuNDNMMTMuMzIsOAoJYzAuMjEtMC4yMSwwLjIxLTAuNTQsMC0wLjc1Yy0wLjIxLTAuMjEtMC41NC0wLjIxLTAuNzUsMGwtMi40MiwyLjQyTDcuNzQsNy4yN2MtMC4yMS0wLjIxLTAuNTQtMC4yMS0wLjc1LDAKCWMtMC4yMSwwLjIxLTAuMjEsMC41NCwwLDAuNzVsMi40MSwyLjQxbC0yLjQyLDIuNDJDNi43NywxMy4wNSw2Ljc3LDEzLjM5LDYuOTgsMTMuNTlMNi45OCwxMy41OXoiLz4KPHBhdGggZmlsbD0iIzg2ODY4NiIgZD0iTTEwLjE1LDE4LjQzYzQuNDEsMCw4LTMuNTksOC04YzAtNC40MS0zLjU5LTgtOC04Yy00LjQxLDAtOCwzLjU5LTgsOEMyLjE1LDE0Ljg0LDUuNzQsMTguNDMsMTAuMTUsMTguNDN6CgkgTTEwLjE1LDMuNDljMy44MywwLDYuOTQsMy4xMSw2Ljk0LDYuOTRjMCwzLjgzLTMuMTEsNi45NC02Ljk0LDYuOTRjLTMuODMsMC02Ljk0LTMuMTEtNi45NC02Ljk0QzMuMjEsNi42LDYuMzMsMy40OSwxMC4xNSwzLjQ5CglMMTAuMTUsMy40OXoiLz4KPHBhdGggZmlsbD0iIzMzNzFCNyIgZD0iTTYuOTgsMzMuNTljMC4xLDAuMSwwLjI0LDAuMTUsMC4zNywwLjE1czAuMjctMC4wNSwwLjM3LTAuMTVsMi40Mi0yLjQybDIuNDMsMi40MwoJYzAuMSwwLjEsMC4yNCwwLjE1LDAuMzcsMC4xNWMwLjE0LDAsMC4yNy0wLjA1LDAuMzctMC4xNWMwLjIxLTAuMjEsMC4yMS0wLjU0LDAtMC43NWwtMi40My0yLjQzTDEzLjMyLDI4CgljMC4yMS0wLjIxLDAuMjEtMC41NCwwLTAuNzVjLTAuMjEtMC4yMS0wLjU0LTAuMjEtMC43NSwwbC0yLjQyLDIuNDJsLTIuNDEtMi40MWMtMC4yMS0wLjIxLTAuNTQtMC4yMS0wLjc1LDAKCWMtMC4yMSwwLjIxLTAuMjEsMC41NCwwLDAuNzVsMi40MSwyLjQxbC0yLjQyLDIuNDJDNi43NywzMy4wNSw2Ljc3LDMzLjM5LDYuOTgsMzMuNTlMNi45OCwzMy41OXoiLz4KPHBhdGggZmlsbD0iIzMzNzFCNyIgZD0iTTEwLjE1LDM4LjQzYzQuNDEsMCw4LTMuNTksOC04YzAtNC40MS0zLjU5LTgtOC04Yy00LjQxLDAtOCwzLjU5LTgsOEMyLjE1LDM0Ljg0LDUuNzQsMzguNDMsMTAuMTUsMzguNDN6CgkgTTEwLjE1LDIzLjQ5YzMuODMsMCw2Ljk0LDMuMTEsNi45NCw2Ljk0YzAsMy44My0zLjExLDYuOTQtNi45NCw2Ljk0Yy0zLjgzLDAtNi45NC0zLjExLTYuOTQtNi45NAoJQzMuMjEsMjYuNiw2LjMzLDIzLjQ5LDEwLjE1LDIzLjQ5TDEwLjE1LDIzLjQ5eiIvPgo8cGF0aCBmaWxsPSIjQzBDMEJGIiBkPSJNNi45OCw1My41OWMwLjEsMC4xLDAuMjQsMC4xNSwwLjM3LDAuMTVzMC4yNy0wLjA1LDAuMzctMC4xNWwyLjQyLTIuNDJsMi40MywyLjQzCgljMC4xLDAuMSwwLjI0LDAuMTUsMC4zNywwLjE1YzAuMTQsMCwwLjI3LTAuMDUsMC4zNy0wLjE1YzAuMjEtMC4yMSwwLjIxLTAuNTQsMC0wLjc1bC0yLjQzLTIuNDNMMTMuMzIsNDgKCWMwLjIxLTAuMjEsMC4yMS0wLjU0LDAtMC43NWMtMC4yMS0wLjIxLTAuNTQtMC4yMS0wLjc1LDBsLTIuNDIsMi40MmwtMi40MS0yLjQxYy0wLjIxLTAuMjEtMC41NC0wLjIxLTAuNzUsMAoJYy0wLjIxLDAuMjEtMC4yMSwwLjU0LDAsMC43NWwyLjQxLDIuNDFsLTIuNDIsMi40MkM2Ljc3LDUzLjA1LDYuNzcsNTMuMzksNi45OCw1My41OUw2Ljk4LDUzLjU5eiIvPgo8cGF0aCBmaWxsPSIjQzBDMEJGIiBkPSJNMTAuMTUsNTguNDNjNC40MSwwLDgtMy41OSw4LThjMC00LjQxLTMuNTktOC04LThjLTQuNDEsMC04LDMuNTktOCw4QzIuMTUsNTQuODQsNS43NCw1OC40MywxMC4xNSw1OC40M3oKCSBNMTAuMTUsNDMuNDljMy44MywwLDYuOTQsMy4xMSw2Ljk0LDYuOTRjMCwzLjgzLTMuMTEsNi45NC02Ljk0LDYuOTRjLTMuODMsMC02Ljk0LTMuMTEtNi45NC02Ljk0CglDMy4yMSw0Ni42LDYuMzMsNDMuNDksMTAuMTUsNDMuNDlMMTAuMTUsNDMuNDl6Ii8+CjxwYXRoIGZpbGw9IiM2QUE5REQiIGQ9Ik02Ljk4LDczLjU5YzAuMSwwLjEsMC4yNCwwLjE1LDAuMzcsMC4xNXMwLjI3LTAuMDUsMC4zNy0wLjE1bDIuNDItMi40MmwyLjQzLDIuNDMKCWMwLjEsMC4xLDAuMjQsMC4xNSwwLjM3LDAuMTVjMC4xNCwwLDAuMjctMC4wNSwwLjM3LTAuMTVjMC4yMS0wLjIxLDAuMjEtMC41NCwwLTAuNzVsLTIuNDMtMi40M0wxMy4zMiw2OAoJYzAuMjEtMC4yMSwwLjIxLTAuNTQsMC0wLjc1Yy0wLjIxLTAuMjEtMC41NC0wLjIxLTAuNzUsMGwtMi40MiwyLjQybC0yLjQxLTIuNDFjLTAuMjEtMC4yMS0wLjU0LTAuMjEtMC43NSwwCgljLTAuMjEsMC4yMS0wLjIxLDAuNTQsMCwwLjc1bDIuNDEsMi40MWwtMi40MiwyLjQyQzYuNzcsNzMuMDUsNi43Nyw3My4zOSw2Ljk4LDczLjU5TDYuOTgsNzMuNTl6Ii8+CjxwYXRoIGZpbGw9IiM2QUE5REQiIGQ9Ik0xMC4xNSw3OC40M2M0LjQxLDAsOC0zLjU5LDgtOGMwLTQuNDEtMy41OS04LTgtOGMtNC40MSwwLTgsMy41OS04LDhDMi4xNSw3NC44NCw1Ljc0LDc4LjQzLDEwLjE1LDc4LjQzegoJIE0xMC4xNSw2My40OWMzLjgzLDAsNi45NCwzLjExLDYuOTQsNi45NGMwLDMuODMtMy4xMSw2Ljk0LTYuOTQsNi45NGMtMy44MywwLTYuOTQtMy4xMS02Ljk0LTYuOTQKCUMzLjIxLDY2LjYsNi4zMyw2My40OSwxMC4xNSw2My40OUwxMC4xNSw2My40OXoiLz4KPC9zdmc+";
function BtnClearSearch() {
  var clearSearch = useClearSearch();
  return (0, import_react.createElement)(Button, {
    className: cx(styles$h.btnClearSearch, commonInteractionStyles.visibleOnSearchOnly),
    onClick: clearSearch,
    "aria-label": "Clear",
    title: "Clear"
  }, (0, import_react.createElement)("div", {
    className: cx(styles$h.icnClearnSearch)
  }));
}
var HoverDark = {
  ":hover": {
    "> .epr-icn-clear-search": {
      backgroundPositionY: "-60px"
    }
  }
};
var styles$h = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  btnClearSearch: {
    ".": "epr-btn-clear-search",
    position: "absolute",
    right: "var(--epr-search-bar-inner-padding)",
    height: "30px",
    width: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "0",
    borderRadius: "50%",
    ":hover": {
      background: "var(--epr-hover-bg-color)"
    },
    ":focus": {
      background: "var(--epr-hover-bg-color)"
    }
  },
  icnClearnSearch: {
    ".": "epr-icn-clear-search",
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    backgroundSize: "20px",
    height: "20px",
    width: "20px",
    backgroundImage: "url(" + SVGTimes + ")",
    ":hover": {
      backgroundPositionY: "-20px"
    },
    ":focus": {
      backgroundPositionY: "-20px"
    }
  }
}, /* @__PURE__ */ darkMode("icnClearnSearch", {
  backgroundPositionY: "-40px"
}), /* @__PURE__ */ darkMode("btnClearSearch", HoverDark)));
var SVGMagnifier = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI2LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCAyMCA0MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzg2ODY4NiIgZD0iTTEyLDguODFjMCwyLjA4LTEuNjgsMy43Ni0zLjc2LDMuNzZjLTIuMDgsMC0zLjc2LTEuNjgtMy43Ni0zLjc2CgljMC0yLjA4LDEuNjgtMy43NiwzLjc2LTMuNzZDMTAuMzIsNS4wNSwxMiw2LjczLDEyLDguODF6IE0xMS4yMywxMi43MmMtMC44MywwLjY0LTEuODcsMS4wMS0yLjk5LDEuMDFjLTIuNzIsMC00LjkyLTIuMi00LjkyLTQuOTIKCWMwLTIuNzIsMi4yLTQuOTIsNC45Mi00LjkyYzIuNzIsMCw0LjkyLDIuMiw0LjkyLDQuOTJjMCwxLjEzLTAuMzgsMi4xNi0xLjAxLDIuOTlsMy45NCwzLjkzYzAuMjUsMC4yNSwwLjI1LDAuNjYsMCwwLjkyCgljLTAuMjUsMC4yNS0wLjY2LDAuMjUtMC45MiwwTDExLjIzLDEyLjcyeiIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0MwQzBCRiIgZD0iTTEyLDI4LjgxYzAsMi4wOC0xLjY4LDMuNzYtMy43NiwzLjc2Yy0yLjA4LDAtMy43Ni0xLjY4LTMuNzYtMy43NgoJYzAtMi4wOCwxLjY4LTMuNzYsMy43Ni0zLjc2QzEwLjMyLDI1LjA1LDEyLDI2LjczLDEyLDI4LjgxeiBNMTEuMjMsMzIuNzJjLTAuODMsMC42NC0xLjg3LDEuMDEtMi45OSwxLjAxCgljLTIuNzIsMC00LjkyLTIuMi00LjkyLTQuOTJjMC0yLjcyLDIuMi00LjkyLDQuOTItNC45MmMyLjcyLDAsNC45MiwyLjIsNC45Miw0LjkyYzAsMS4xMy0wLjM4LDIuMTYtMS4wMSwyLjk5bDMuOTQsMy45MwoJYzAuMjUsMC4yNSwwLjI1LDAuNjYsMCwwLjkyYy0wLjI1LDAuMjUtMC42NiwwLjI1LTAuOTIsMEwxMS4yMywzMi43MnoiLz4KPC9zdmc+";
function IcnSearch() {
  return (0, import_react.createElement)("div", {
    className: cx(styles$i.icnSearch)
  });
}
var styles$i = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  icnSearch: {
    ".": "epr-icn-search",
    content: "",
    position: "absolute",
    top: "50%",
    left: "var(--epr-search-bar-inner-padding)",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 0",
    backgroundSize: "20px",
    backgroundImage: "url(" + SVGMagnifier + ")"
  }
}, /* @__PURE__ */ darkMode("icnSearch", {
  backgroundPositionY: "-20px"
})));
function SearchContainer() {
  var searchDisabled = useSearchDisabledConfig();
  var isSkinToneInSearch = useIsSkinToneInSearch();
  if (searchDisabled) {
    return null;
  }
  return (0, import_react.createElement)(Flex, {
    className: cx(styles$j.overlay)
  }, (0, import_react.createElement)(Search, null), isSkinToneInSearch ? (0, import_react.createElement)(SkinTonePicker, null) : null);
}
function Search() {
  var closeAllOpenToggles = useCloseAllOpenToggles();
  var SearchInputRef = useSearchInputRef();
  var placeholder = useSearchPlaceHolderConfig();
  var autoFocus = useAutoFocusSearchConfig();
  var _useFilter = useFilter(), statusSearchResults = _useFilter.statusSearchResults, searchTerm = _useFilter.searchTerm, _onChange = _useFilter.onChange;
  var input = SearchInputRef == null ? void 0 : SearchInputRef.current;
  var value = input == null ? void 0 : input.value;
  return (0, import_react.createElement)(Relative, {
    className: cx(styles$j.searchContainer)
  }, (0, import_react.createElement)("input", {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    autoFocus,
    "aria-label": "Type to search for an emoji",
    onFocus: closeAllOpenToggles,
    className: cx(styles$j.search),
    type: "text",
    "aria-controls": "epr-search-id",
    placeholder,
    onChange: function onChange(event) {
      var _event$target$value, _event$target;
      _onChange((_event$target$value = event == null ? void 0 : (_event$target = event.target) == null ? void 0 : _event$target.value) != null ? _event$target$value : value);
    },
    ref: SearchInputRef
  }), searchTerm ? (0, import_react.createElement)("div", {
    role: "status",
    className: cx("epr-status-search-results", styles$j.visuallyHidden),
    "aria-live": "polite",
    id: "epr-search-id",
    "aria-atomic": "true"
  }, statusSearchResults) : null, (0, import_react.createElement)(IcnSearch, null), (0, import_react.createElement)(BtnClearSearch, null));
}
var styles$j = /* @__PURE__ */ stylesheet.create(/* @__PURE__ */ _extends({
  overlay: {
    padding: "var(--epr-header-padding)",
    zIndex: "var(--epr-header-overlay-z-index)"
  },
  searchContainer: {
    ".": "epr-search-container",
    flex: "1",
    display: "block",
    minWidth: "0"
  },
  visuallyHidden: {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: "1px",
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px"
  },
  search: {
    outline: "none",
    transition: "all 0.2s ease-in-out",
    color: "var(--epr-search-input-text-color)",
    borderRadius: "var(--epr-search-input-border-radius)",
    padding: "var(--epr-search-input-padding)",
    height: "var(--epr-search-input-height)",
    backgroundColor: "var(--epr-search-input-bg-color)",
    border: "1px solid var(--epr-search-border-color)",
    width: "100%",
    ":focus": {
      backgroundColor: "var(--epr-search-input-bg-color-active)",
      border: "1px solid var(--epr-search-border-color-active)"
    },
    "::placeholder": {
      color: "var(--epr-search-input-placeholder-color)"
    }
  },
  btnClearSearch: {
    ".": "epr-btn-clear-search",
    position: "absolute",
    right: "var(--epr-search-bar-inner-padding)",
    height: "30px",
    width: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "0",
    borderRadius: "50%",
    ":hover": {
      background: "var(--epr-hover-bg-color)"
    },
    ":focus": {
      background: "var(--epr-hover-bg-color)"
    }
  },
  icnClearnSearch: {
    ".": "epr-icn-clear-search",
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    backgroundSize: "20px",
    height: "20px",
    width: "20px",
    backgroundImage: "url(" + SVGTimes + ")",
    ":hover": {
      backgroundPositionY: "-20px"
    },
    ":focus": {
      backgroundPositionY: "-20px"
    }
  }
}, /* @__PURE__ */ darkMode("icnClearnSearch", {
  backgroundPositionY: "-40px"
}), /* @__PURE__ */ darkMode("btnClearSearch", {
  ":hover > .epr-icn-clear-search": {
    backgroundPositionY: "-60px"
  }
})));
function Header() {
  return (0, import_react.createElement)(Relative, {
    className: cx("epr-header", commonInteractionStyles.hiddenOnReactions)
  }, (0, import_react.createElement)(SearchContainer, null), (0, import_react.createElement)(CategoryNavigation, null));
}
function EmojiPicker(props) {
  return (0, import_react.createElement)(ElementRefContextProvider, null, (0, import_react.createElement)(PickerStyleTag, null), (0, import_react.createElement)(PickerConfigProvider, Object.assign({}, props), (0, import_react.createElement)(ContentControl, null)));
}
function ContentControl() {
  var _useReactionsModeStat = useReactionsModeState(), reactionsDefaultOpen = _useReactionsModeStat[0];
  var allowExpandReactions = useAllowExpandReactions();
  var _React$useState = (0, import_react.useState)(!reactionsDefaultOpen), renderAll = _React$useState[0], setRenderAll = _React$useState[1];
  var isOpen = useOpenConfig();
  (0, import_react.useEffect)(function() {
    if (reactionsDefaultOpen && !allowExpandReactions) {
      return;
    }
    if (!renderAll) {
      setRenderAll(true);
    }
  }, [renderAll, allowExpandReactions, reactionsDefaultOpen]);
  if (!isOpen) {
    return null;
  }
  return (0, import_react.createElement)(PickerMain, null, (0, import_react.createElement)(Reactions, null), (0, import_react.createElement)(ExpandedPickerContent, {
    renderAll
  }));
}
function ExpandedPickerContent(_ref) {
  var renderAll = _ref.renderAll;
  if (!renderAll) {
    return null;
  }
  return (0, import_react.createElement)(import_react.Fragment, null, (0, import_react.createElement)(Header, null), (0, import_react.createElement)(Body, null), (0, import_react.createElement)(Preview, null));
}
var EmojiPickerReact = /* @__PURE__ */ (0, import_react.memo)(EmojiPicker, compareConfig);
var ErrorBoundary = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(ErrorBoundary2, _React$Component);
  function ErrorBoundary2(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasError: false
    };
    return _this;
  }
  ErrorBoundary2.getDerivedStateFromError = function getDerivedStateFromError() {
    return {
      hasError: true
    };
  };
  var _proto = ErrorBoundary2.prototype;
  _proto.componentDidCatch = function componentDidCatch(error, errorInfo) {
    console.error("Emoji Picker React failed to render:", error, errorInfo);
  };
  _proto.render = function render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  };
  return ErrorBoundary2;
}(import_react.Component);
function EmojiPicker$1(props) {
  var MutableConfigRef = useDefineMutableConfig({
    onEmojiClick: props.onEmojiClick,
    onReactionClick: props.onReactionClick,
    onSkinToneChange: props.onSkinToneChange
  });
  return (0, import_react.createElement)(ErrorBoundary, null, (0, import_react.createElement)(MutableConfigContext.Provider, {
    value: MutableConfigRef
  }, (0, import_react.createElement)(EmojiPickerReact, Object.assign({}, props))));
}
var emoji_picker_react_esm_default = EmojiPicker$1;

// ../core/jupiter/core/infra/component/icon-selector.tsx
var import_react2 = __toESM(require_react(), 1);
function IconSelector({ defaultIcon, readOnly }) {
  const [selectedIcon, setSelectedIcon] = (0, import_react2.useState)(defaultIcon);
  const [showIconSelector, setShowIconSelector] = (0, import_react2.useState)(false);
  function handleClear() {
    setSelectedIcon("");
  }
  function handleChoose() {
    setShowIconSelector((i) => !i);
  }
  function handleSelect(emojiData) {
    setSelectedIcon(emojiData.emoji);
    setShowIconSelector(false);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      OutlinedInput_default,
      {
        label: "Icon",
        name: "icon",
        readOnly: true,
        value: selectedIcon,
        endAdornment: /* @__PURE__ */ jsxDEV(ButtonGroup_default, { children: [
          /* @__PURE__ */ jsxDEV(Button_default, { disabled: readOnly, onClick: handleClear, children: "Clear" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
            lineNumber: 39,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Button_default,
            {
              disabled: readOnly,
              variant: showIconSelector ? "contained" : "outlined",
              onClick: handleChoose,
              children: "Choose"
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
              lineNumber: 42,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
          lineNumber: 38,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
        lineNumber: 32,
        columnNumber: 7
      },
      this
    ),
    showIconSelector && /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV("span", { children: defaultIcon }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
      lineNumber: 54,
      columnNumber: 31
    }, this), children: () => /* @__PURE__ */ jsxDEV(
      emoji_picker_react_esm_default,
      {
        width: "auto",
        autoFocusSearch: false,
        allowExpandReactions: false,
        emojiStyle: EmojiStyle.NATIVE,
        onEmojiClick: handleSelect
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
        lineNumber: 56,
        columnNumber: 13
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/icon-selector.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, this);
}

export {
  IconSelector
};
//# sourceMappingURL=/build/_shared/chunk-IU4ODRE6.js.map
