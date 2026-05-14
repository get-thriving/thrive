import {
  require_react_dom
} from "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/notistack/notistack.esm.js
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());

// ../../node_modules/notistack/node_modules/clsx/dist/clsx.m.js
function r(e2) {
  var t2, f, n2 = "";
  if ("string" == typeof e2 || "number" == typeof e2)
    n2 += e2;
  else if ("object" == typeof e2)
    if (Array.isArray(e2))
      for (t2 = 0; t2 < e2.length; t2++)
        e2[t2] && (f = r(e2[t2])) && (n2 && (n2 += " "), n2 += f);
    else
      for (t2 in e2)
        e2[t2] && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function clsx() {
  for (var e2, t2, f = 0, n2 = ""; f < arguments.length; )
    (e2 = arguments[f++]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
var clsx_m_default = clsx;

// ../../node_modules/goober/dist/goober.modern.js
var e = { data: "" };
var t = (t2) => {
  if ("object" == typeof window) {
    let e2 = (t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign(document.createElement("style"), { innerHTML: " ", id: "_goober" });
    return e2.nonce = window.__nonce__, e2.parentNode || (t2 || document.head).appendChild(e2), e2.firstChild;
  }
  return t2 || e;
};
var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var a = /\/\*[^]*?\*\/|  +/g;
var n = /\n+/g;
var o = (e2, t2) => {
  let r2 = "", l2 = "", a2 = "";
  for (let n2 in e2) {
    let c2 = e2[n2];
    "@" == n2[0] ? "i" == n2[1] ? r2 = n2 + " " + c2 + ";" : l2 += "f" == n2[1] ? o(c2, n2) : n2 + "{" + o(c2, "k" == n2[1] ? "" : t2) + "}" : "object" == typeof c2 ? l2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n2.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n2) : null != c2 && (n2 = /^--/.test(n2) ? n2 : n2.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n2, c2) : n2 + ":" + c2 + ";");
  }
  return r2 + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l2;
};
var c = {};
var s = (e2) => {
  if ("object" == typeof e2) {
    let t2 = "";
    for (let r2 in e2)
      t2 += r2 + s(e2[r2]);
    return t2;
  }
  return e2;
};
var i = (e2, t2, r2, i2, p2) => {
  let u2 = s(e2), d = c[u2] || (c[u2] = ((e3) => {
    let t3 = 0, r3 = 11;
    for (; t3 < e3.length; )
      r3 = 101 * r3 + e3.charCodeAt(t3++) >>> 0;
    return "go" + r3;
  })(u2));
  if (!c[d]) {
    let t3 = u2 !== e2 ? e2 : ((e3) => {
      let t4, r3, o2 = [{}];
      for (; t4 = l.exec(e3.replace(a, "")); )
        t4[4] ? o2.shift() : t4[3] ? (r3 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r3] = o2[0][r3] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
      return o2[0];
    })(e2);
    c[d] = o(p2 ? { ["@keyframes " + d]: t3 } : t3, r2 ? "" : "." + d);
  }
  let f = r2 && c.g ? c.g : null;
  return r2 && (c.g = c[d]), ((e3, t3, r3, l2) => {
    l2 ? t3.data = t3.data.replace(l2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r3 ? e3 + t3.data : t3.data + e3);
  })(c[d], t2, i2, f), d;
};
var p = (e2, t2, r2) => e2.reduce((e3, l2, a2) => {
  let n2 = t2[a2];
  if (n2 && n2.call) {
    let e4 = n2(r2), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
    n2 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
  }
  return e3 + l2 + (null == n2 ? "" : n2);
}, "");
function u(e2) {
  let r2 = this || {}, l2 = e2.call ? e2(r2.p) : e2;
  return i(l2.unshift ? l2.raw ? p(l2, [].slice.call(arguments, 1), r2.p) : l2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r2.p) : t2), {}) : l2, t(r2.target), r2.g, r2.o, r2.k);
}
var b = u.bind({ g: 1 });
var h = u.bind({ k: 1 });

// ../../node_modules/notistack/notistack.esm.js
function _defineProperties(target, props) {
  for (var i2 = 0; i2 < props.length; i2++) {
    var descriptor = props[i2];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
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
  subClass.__proto__ = superClass;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
var noOp = function noOp2() {
  return "";
};
var SnackbarContext = /* @__PURE__ */ import_react.default.createContext({
  enqueueSnackbar: noOp,
  closeSnackbar: noOp
});
var breakpoints = {
  downXs: "@media (max-width:599.95px)",
  upSm: "@media (min-width:600px)"
};
var capitalise = function capitalise2(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
var originKeyExtractor = function originKeyExtractor2(anchor) {
  return "" + capitalise(anchor.vertical) + capitalise(anchor.horizontal);
};
var isDefined = function isDefined2(value) {
  return !!value || value === 0;
};
var UNMOUNTED = "unmounted";
var EXITED = "exited";
var ENTERING = "entering";
var ENTERED = "entered";
var EXITING = "exiting";
var Transition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(Transition2, _React$Component);
  function Transition2(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    var appear = props.appear;
    var initialStatus;
    _this.appearStatus = null;
    if (props["in"]) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else if (props.unmountOnExit || props.mountOnEnter) {
      initialStatus = UNMOUNTED;
    } else {
      initialStatus = EXITED;
    }
    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }
  Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref["in"];
    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }
    return null;
  };
  var _proto = Transition2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;
    if (prevProps !== this.props) {
      var status = this.state.status;
      if (this.props["in"]) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else if (status === ENTERING || status === ENTERED) {
        nextStatus = EXITING;
      }
    }
    this.updateStatus(false, nextStatus);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };
  _proto.getTimeouts = function getTimeouts() {
    var timeout2 = this.props.timeout;
    var enter = timeout2;
    var exit = timeout2;
    if (timeout2 != null && typeof timeout2 !== "number" && typeof timeout2 !== "string") {
      exit = timeout2.exit;
      enter = timeout2.enter;
    }
    return {
      exit,
      enter
    };
  };
  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }
    if (nextStatus !== null) {
      this.cancelNextCallback();
      if (nextStatus === ENTERING) {
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };
  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;
    var enter = this.props.enter;
    var isAppearing = mounting;
    var timeouts = this.getTimeouts();
    if (!mounting && !enter) {
      this.safeSetState({
        status: ENTERED
      }, function() {
        if (_this2.props.onEntered) {
          _this2.props.onEntered(_this2.node, isAppearing);
        }
      });
      return;
    }
    if (this.props.onEnter) {
      this.props.onEnter(this.node, isAppearing);
    }
    this.safeSetState({
      status: ENTERING
    }, function() {
      if (_this2.props.onEntering) {
        _this2.props.onEntering(_this2.node, isAppearing);
      }
      _this2.onTransitionEnd(timeouts.enter, function() {
        _this2.safeSetState({
          status: ENTERED
        }, function() {
          if (_this2.props.onEntered) {
            _this2.props.onEntered(_this2.node, isAppearing);
          }
        });
      });
    });
  };
  _proto.performExit = function performExit() {
    var _this3 = this;
    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    if (!exit) {
      this.safeSetState({
        status: EXITED
      }, function() {
        if (_this3.props.onExited) {
          _this3.props.onExited(_this3.node);
        }
      });
      return;
    }
    if (this.props.onExit) {
      this.props.onExit(this.node);
    }
    this.safeSetState({
      status: EXITING
    }, function() {
      if (_this3.props.onExiting) {
        _this3.props.onExiting(_this3.node);
      }
      _this3.onTransitionEnd(timeouts.exit, function() {
        _this3.safeSetState({
          status: EXITED
        }, function() {
          if (_this3.props.onExited) {
            _this3.props.onExited(_this3.node);
          }
        });
      });
    });
  };
  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null && this.nextCallback.cancel) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };
  _proto.safeSetState = function safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };
  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;
    var active = true;
    this.nextCallback = function() {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback();
      }
    };
    this.nextCallback.cancel = function() {
      active = false;
    };
    return this.nextCallback;
  };
  _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
    this.setNextCallback(handler);
    var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
    if (!this.node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      this.props.addEndListener(this.node, this.nextCallback);
    }
    if (timeout2 != null) {
      setTimeout(this.nextCallback, timeout2);
    }
  };
  _proto.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }
    var _this$props = this.props, children = _this$props.children, childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return children(status, childProps);
  };
  _createClass(Transition2, [{
    key: "node",
    get: function get() {
      var _this$props$nodeRef;
      var node = (_this$props$nodeRef = this.props.nodeRef) === null || _this$props$nodeRef === void 0 ? void 0 : _this$props$nodeRef.current;
      if (!node) {
        throw new Error("notistack - Custom snackbar is not refForwarding");
      }
      return node;
    }
  }]);
  return Transition2;
}(import_react.default.Component);
function noop() {
}
Transition.defaultProps = {
  "in": false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
function useForkRef(refA, refB) {
  return (0, import_react.useMemo)(function() {
    if (refA == null && refB == null) {
      return null;
    }
    return function(refValue) {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
}
function getTransitionProps(props) {
  var timeout2 = props.timeout, _props$style = props.style, style = _props$style === void 0 ? {} : _props$style, mode = props.mode;
  return {
    duration: typeof timeout2 === "object" ? timeout2[mode] || 0 : timeout2,
    easing: style.transitionTimingFunction,
    delay: style.transitionDelay
  };
}
var defaultEasing = {
  // This is the most common easing curve.
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
};
var reflow = function reflow2(node) {
  node.scrollTop = node.scrollTop;
};
var formatMs = function formatMs2(milliseconds) {
  return Math.round(milliseconds) + "ms";
};
function createTransition(props, options) {
  if (props === void 0) {
    props = ["all"];
  }
  var _ref = options || {}, _ref$duration = _ref.duration, duration = _ref$duration === void 0 ? 300 : _ref$duration, _ref$easing = _ref.easing, easing = _ref$easing === void 0 ? defaultEasing.easeInOut : _ref$easing, _ref$delay = _ref.delay, delay = _ref$delay === void 0 ? 0 : _ref$delay;
  var properties = Array.isArray(props) ? props : [props];
  return properties.map(function(animatedProp) {
    var formattedDuration = typeof duration === "string" ? duration : formatMs(duration);
    var formattedDelay = typeof delay === "string" ? delay : formatMs(delay);
    return animatedProp + " " + formattedDuration + " " + easing + " " + formattedDelay;
  }).join(",");
}
function ownerDocument(node) {
  return node && node.ownerDocument || document;
}
function ownerWindow(node) {
  var doc = ownerDocument(node);
  return doc.defaultView || window;
}
function debounce(func, wait) {
  if (wait === void 0) {
    wait = 166;
  }
  var timeout2;
  function debounced() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var later = function later2() {
      func.apply(_this, args);
    };
    clearTimeout(timeout2);
    timeout2 = setTimeout(later, wait);
  }
  debounced.clear = function() {
    clearTimeout(timeout2);
  };
  return debounced;
}
function getTranslateValue(direction2, node) {
  var rect = node.getBoundingClientRect();
  var containerWindow = ownerWindow(node);
  var transform;
  if (node.fakeTransform) {
    transform = node.fakeTransform;
  } else {
    var computedStyle = containerWindow.getComputedStyle(node);
    transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform");
  }
  var offsetX = 0;
  var offsetY = 0;
  if (transform && transform !== "none" && typeof transform === "string") {
    var transformValues = transform.split("(")[1].split(")")[0].split(",");
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }
  switch (direction2) {
    case "left":
      return "translateX(" + (containerWindow.innerWidth + offsetX - rect.left) + "px)";
    case "right":
      return "translateX(-" + (rect.left + rect.width - offsetX) + "px)";
    case "up":
      return "translateY(" + (containerWindow.innerHeight + offsetY - rect.top) + "px)";
    default:
      return "translateY(-" + (rect.top + rect.height - offsetY) + "px)";
  }
}
function setTranslateValue(direction2, node) {
  if (!node)
    return;
  var transform = getTranslateValue(direction2, node);
  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
}
var Slide = /* @__PURE__ */ (0, import_react.forwardRef)(function(props, ref) {
  var children = props.children, _props$direction = props.direction, direction2 = _props$direction === void 0 ? "down" : _props$direction, inProp = props["in"], style = props.style, _props$timeout = props.timeout, timeout2 = _props$timeout === void 0 ? 0 : _props$timeout, onEnter = props.onEnter, onEntered = props.onEntered, onExit = props.onExit, onExited = props.onExited, other = _objectWithoutPropertiesLoose(props, ["children", "direction", "in", "style", "timeout", "onEnter", "onEntered", "onExit", "onExited"]);
  var nodeRef = (0, import_react.useRef)(null);
  var handleRefIntermediary = useForkRef(children.ref, nodeRef);
  var handleRef = useForkRef(handleRefIntermediary, ref);
  var handleEnter = function handleEnter2(node, isAppearing) {
    setTranslateValue(direction2, node);
    reflow(node);
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };
  var handleEntering = function handleEntering2(node) {
    var easing = (style === null || style === void 0 ? void 0 : style.transitionTimingFunction) || defaultEasing.easeOut;
    var transitionProps = getTransitionProps({
      timeout: timeout2,
      mode: "enter",
      style: _extends({}, style, {
        transitionTimingFunction: easing
      })
    });
    node.style.webkitTransition = createTransition("-webkit-transform", transitionProps);
    node.style.transition = createTransition("transform", transitionProps);
    node.style.webkitTransform = "none";
    node.style.transform = "none";
  };
  var handleExit = function handleExit2(node) {
    var easing = (style === null || style === void 0 ? void 0 : style.transitionTimingFunction) || defaultEasing.sharp;
    var transitionProps = getTransitionProps({
      timeout: timeout2,
      mode: "exit",
      style: _extends({}, style, {
        transitionTimingFunction: easing
      })
    });
    node.style.webkitTransition = createTransition("-webkit-transform", transitionProps);
    node.style.transition = createTransition("transform", transitionProps);
    setTranslateValue(direction2, node);
    if (onExit) {
      onExit(node);
    }
  };
  var handleExited = function handleExited2(node) {
    node.style.webkitTransition = "";
    node.style.transition = "";
    if (onExited) {
      onExited(node);
    }
  };
  var updatePosition = (0, import_react.useCallback)(function() {
    if (nodeRef.current) {
      setTranslateValue(direction2, nodeRef.current);
    }
  }, [direction2]);
  (0, import_react.useEffect)(function() {
    if (inProp || direction2 === "down" || direction2 === "right") {
      return void 0;
    }
    var handleResize = debounce(function() {
      if (nodeRef.current) {
        setTranslateValue(direction2, nodeRef.current);
      }
    });
    var containerWindow = ownerWindow(nodeRef.current);
    containerWindow.addEventListener("resize", handleResize);
    return function() {
      handleResize.clear();
      containerWindow.removeEventListener("resize", handleResize);
    };
  }, [direction2, inProp]);
  (0, import_react.useEffect)(function() {
    if (!inProp) {
      updatePosition();
    }
  }, [inProp, updatePosition]);
  return (0, import_react.createElement)(Transition, Object.assign({
    appear: true,
    nodeRef,
    onEnter: handleEnter,
    onEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited: handleExited,
    "in": inProp,
    timeout: timeout2
  }, other), function(state, childProps) {
    return (0, import_react.cloneElement)(children, _extends({
      ref: handleRef,
      style: _extends({
        visibility: state === "exited" && !inProp ? "hidden" : void 0
      }, style, {}, children.props.style)
    }, childProps));
  });
});
Slide.displayName = "Slide";
var SvgIcon = function SvgIcon2(props) {
  return import_react.default.createElement("svg", Object.assign({
    viewBox: "0 0 24 24",
    focusable: "false",
    style: {
      fontSize: 20,
      marginInlineEnd: 8,
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fill: "currentColor",
      flexShrink: 0
    }
  }, props));
};
var CheckIcon = function CheckIcon2() {
  return import_react.default.createElement(SvgIcon, null, import_react.default.createElement("path", {
    d: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41\n        10.59L10 14.17L17.59 6.58L19 8L10 17Z"
  }));
};
var WarningIcon = function WarningIcon2() {
  return import_react.default.createElement(SvgIcon, null, import_react.default.createElement("path", {
    d: "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"
  }));
};
var ErrorIcon = function ErrorIcon2() {
  return import_react.default.createElement(SvgIcon, null, import_react.default.createElement("path", {
    d: "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,\n        6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,\n        13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
  }));
};
var InfoIcon = function InfoIcon2() {
  return import_react.default.createElement(SvgIcon, null, import_react.default.createElement("path", {
    d: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,\n        0 22,12A10,10 0 0,0 12,2Z"
  }));
};
var defaultIconVariants = {
  "default": void 0,
  success: /* @__PURE__ */ import_react.default.createElement(CheckIcon, null),
  warning: /* @__PURE__ */ import_react.default.createElement(WarningIcon, null),
  error: /* @__PURE__ */ import_react.default.createElement(ErrorIcon, null),
  info: /* @__PURE__ */ import_react.default.createElement(InfoIcon, null)
};
var defaults = {
  maxSnack: 3,
  persist: false,
  hideIconVariant: false,
  disableWindowBlurListener: false,
  variant: "default",
  autoHideDuration: 5e3,
  iconVariant: defaultIconVariants,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  TransitionComponent: Slide,
  transitionDuration: {
    enter: 225,
    exit: 195
  }
};
var getAutoHideDuration = function getAutoHideDuration2(optionsDuration, propsDuration) {
  var isNumberOrNull = function isNumberOrNull2(numberish) {
    return typeof numberish === "number" || numberish === null;
  };
  if (isNumberOrNull(optionsDuration))
    return optionsDuration;
  if (isNumberOrNull(propsDuration))
    return propsDuration;
  return defaults.autoHideDuration;
};
var getTransitionDuration = function getTransitionDuration2(optionsDuration, propsDuration) {
  var is = function is2(item, types) {
    return types.some(function(t2) {
      return typeof item === t2;
    });
  };
  if (is(optionsDuration, ["string", "number"])) {
    return optionsDuration;
  }
  if (is(optionsDuration, ["object"])) {
    return _extends({}, defaults.transitionDuration, {}, is(propsDuration, ["object"]) && propsDuration, {}, optionsDuration);
  }
  if (is(propsDuration, ["string", "number"])) {
    return propsDuration;
  }
  if (is(propsDuration, ["object"])) {
    return _extends({}, defaults.transitionDuration, {}, propsDuration);
  }
  return defaults.transitionDuration;
};
var merge = function merge2(options, props) {
  return function(name, shouldObjectMerge) {
    if (shouldObjectMerge === void 0) {
      shouldObjectMerge = false;
    }
    if (shouldObjectMerge) {
      return _extends({}, defaults[name], {}, props[name], {}, options[name]);
    }
    if (name === "autoHideDuration") {
      return getAutoHideDuration(options.autoHideDuration, props.autoHideDuration);
    }
    if (name === "transitionDuration") {
      return getTransitionDuration(options.transitionDuration, props.transitionDuration);
    }
    return options[name] || props[name] || defaults[name];
  };
};
function makeStyles(styles2) {
  return Object.entries(styles2).reduce(function(acc, _ref) {
    var _extends2;
    var key = _ref[0], value = _ref[1];
    return _extends({}, acc, (_extends2 = {}, _extends2[key] = u(value), _extends2));
  }, {});
}
var ComponentClasses = {
  SnackbarContainer: "notistack-SnackbarContainer",
  Snackbar: "notistack-Snackbar",
  CollapseWrapper: "notistack-CollapseWrapper",
  MuiContent: "notistack-MuiContent",
  MuiContentVariant: function MuiContentVariant(variant) {
    return "notistack-MuiContent-" + variant;
  }
};
var classes = /* @__PURE__ */ makeStyles({
  root: {
    height: 0
  },
  entered: {
    height: "auto"
  }
});
var collapsedSize = "0px";
var timeout = 175;
var Collapse = /* @__PURE__ */ (0, import_react.forwardRef)(function(props, ref) {
  var children = props.children, inProp = props["in"], onExited = props.onExited;
  var wrapperRef = (0, import_react.useRef)(null);
  var nodeRef = (0, import_react.useRef)(null);
  var handleRef = useForkRef(ref, nodeRef);
  var getWrapperSize = function getWrapperSize2() {
    return wrapperRef.current ? wrapperRef.current.clientHeight : 0;
  };
  var handleEnter = function handleEnter2(node) {
    node.style.height = collapsedSize;
  };
  var handleEntering = function handleEntering2(node) {
    var wrapperSize = getWrapperSize();
    var _getTransitionProps = getTransitionProps({
      timeout,
      mode: "enter"
    }), transitionDuration = _getTransitionProps.duration, easing = _getTransitionProps.easing;
    node.style.transitionDuration = typeof transitionDuration === "string" ? transitionDuration : transitionDuration + "ms";
    node.style.height = wrapperSize + "px";
    node.style.transitionTimingFunction = easing || "";
  };
  var handleEntered = function handleEntered2(node) {
    node.style.height = "auto";
  };
  var handleExit = function handleExit2(node) {
    node.style.height = getWrapperSize() + "px";
  };
  var handleExiting = function handleExiting2(node) {
    reflow(node);
    var _getTransitionProps2 = getTransitionProps({
      timeout,
      mode: "exit"
    }), transitionDuration = _getTransitionProps2.duration, easing = _getTransitionProps2.easing;
    node.style.transitionDuration = typeof transitionDuration === "string" ? transitionDuration : transitionDuration + "ms";
    node.style.height = collapsedSize;
    node.style.transitionTimingFunction = easing || "";
  };
  return (0, import_react.createElement)(Transition, {
    "in": inProp,
    unmountOnExit: true,
    onEnter: handleEnter,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExit: handleExit,
    onExited,
    onExiting: handleExiting,
    nodeRef,
    timeout
  }, function(state, childProps) {
    return (0, import_react.createElement)("div", Object.assign({
      ref: handleRef,
      className: clsx_m_default(classes.root, state === "entered" && classes.entered),
      style: _extends({
        pointerEvents: "all",
        overflow: "hidden",
        minHeight: collapsedSize,
        transition: createTransition("height")
      }, state === "entered" && {
        overflow: "visible"
      }, {}, state === "exited" && !inProp && {
        visibility: "hidden"
      })
    }, childProps), (0, import_react.createElement)("div", {
      ref: wrapperRef,
      className: ComponentClasses.CollapseWrapper,
      // Hack to get children with a negative margin to not falsify the height computation.
      style: {
        display: "flex",
        width: "100%"
      }
    }, children));
  });
});
Collapse.displayName = "Collapse";
var direction = {
  right: "left",
  left: "right",
  bottom: "up",
  top: "down"
};
var getSlideDirection = function getSlideDirection2(anchorOrigin) {
  if (anchorOrigin.horizontal !== "center") {
    return direction[anchorOrigin.horizontal];
  }
  return direction[anchorOrigin.vertical];
};
var toSnackbarAnchorOrigin = function toSnackbarAnchorOrigin2(anchorOrigin) {
  return "anchorOrigin" + originKeyExtractor(anchorOrigin);
};
var keepSnackbarClassKeys = function keepSnackbarClassKeys2(classes2) {
  if (classes2 === void 0) {
    classes2 = {};
  }
  var containerClasses = {
    containerRoot: true,
    containerAnchorOriginTopCenter: true,
    containerAnchorOriginBottomCenter: true,
    containerAnchorOriginTopRight: true,
    containerAnchorOriginBottomRight: true,
    containerAnchorOriginTopLeft: true,
    containerAnchorOriginBottomLeft: true
  };
  return Object.keys(classes2).filter(function(key) {
    return !containerClasses[key];
  }).reduce(function(obj, key) {
    var _extends2;
    return _extends({}, obj, (_extends2 = {}, _extends2[key] = classes2[key], _extends2));
  }, {});
};
var noOp$1 = function noOp3() {
};
function createChainedFunction(funcs, snackbarId) {
  return funcs.reduce(function(acc, func) {
    if (func === null || func === void 0) {
      return acc;
    }
    return function chainedFunction() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var argums = [].concat(args);
      if (snackbarId && argums.indexOf(snackbarId) === -1) {
        argums.push(snackbarId);
      }
      acc.apply(this, argums);
      func.apply(this, argums);
    };
  }, noOp$1);
}
var useEnhancedEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
function useEventCallback(fn) {
  var ref = (0, import_react.useRef)(fn);
  useEnhancedEffect(function() {
    ref.current = fn;
  });
  return (0, import_react.useCallback)(function() {
    return (
      // @ts-expect-error hide `this`
      ref.current.apply(void 0, arguments)
    );
  }, []);
}
var Snackbar = /* @__PURE__ */ (0, import_react.forwardRef)(function(props, ref) {
  var children = props.children, className = props.className, autoHideDuration = props.autoHideDuration, _props$disableWindowB = props.disableWindowBlurListener, disableWindowBlurListener = _props$disableWindowB === void 0 ? false : _props$disableWindowB, onClose = props.onClose, id = props.id, open = props.open, _props$SnackbarProps = props.SnackbarProps, SnackbarProps = _props$SnackbarProps === void 0 ? {} : _props$SnackbarProps;
  var timerAutoHide = (0, import_react.useRef)();
  var handleClose = useEventCallback(function() {
    if (onClose) {
      onClose.apply(void 0, arguments);
    }
  });
  var setAutoHideTimer = useEventCallback(function(autoHideDurationParam) {
    if (!onClose || autoHideDurationParam == null) {
      return;
    }
    if (timerAutoHide.current) {
      clearTimeout(timerAutoHide.current);
    }
    timerAutoHide.current = setTimeout(function() {
      handleClose(null, "timeout", id);
    }, autoHideDurationParam);
  });
  (0, import_react.useEffect)(function() {
    if (open) {
      setAutoHideTimer(autoHideDuration);
    }
    return function() {
      if (timerAutoHide.current) {
        clearTimeout(timerAutoHide.current);
      }
    };
  }, [open, autoHideDuration, setAutoHideTimer]);
  var handlePause = function handlePause2() {
    if (timerAutoHide.current) {
      clearTimeout(timerAutoHide.current);
    }
  };
  var handleResume = (0, import_react.useCallback)(function() {
    if (autoHideDuration != null) {
      setAutoHideTimer(autoHideDuration * 0.5);
    }
  }, [autoHideDuration, setAutoHideTimer]);
  var handleMouseEnter = function handleMouseEnter2(event) {
    if (SnackbarProps.onMouseEnter) {
      SnackbarProps.onMouseEnter(event);
    }
    handlePause();
  };
  var handleMouseLeave = function handleMouseLeave2(event) {
    if (SnackbarProps.onMouseLeave) {
      SnackbarProps.onMouseLeave(event);
    }
    handleResume();
  };
  (0, import_react.useEffect)(function() {
    if (!disableWindowBlurListener && open) {
      window.addEventListener("focus", handleResume);
      window.addEventListener("blur", handlePause);
      return function() {
        window.removeEventListener("focus", handleResume);
        window.removeEventListener("blur", handlePause);
      };
    }
    return void 0;
  }, [disableWindowBlurListener, handleResume, open]);
  return (0, import_react.createElement)("div", Object.assign({
    ref
  }, SnackbarProps, {
    className: clsx_m_default(ComponentClasses.Snackbar, className),
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  }), children);
});
Snackbar.displayName = "Snackbar";
var _root;
var classes$1 = /* @__PURE__ */ makeStyles({
  root: (_root = {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1
  }, _root[breakpoints.upSm] = {
    flexGrow: "initial",
    minWidth: "288px"
  }, _root)
});
var SnackbarContent = /* @__PURE__ */ (0, import_react.forwardRef)(function(_ref, ref) {
  var className = _ref.className, props = _objectWithoutPropertiesLoose(_ref, ["className"]);
  return import_react.default.createElement("div", Object.assign({
    ref,
    className: clsx_m_default(classes$1.root, className)
  }, props));
});
SnackbarContent.displayName = "SnackbarContent";
var classes$2 = /* @__PURE__ */ makeStyles({
  root: {
    backgroundColor: "#313131",
    fontSize: "0.875rem",
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
    color: "#fff",
    alignItems: "center",
    padding: "6px 16px",
    borderRadius: "4px",
    boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)"
  },
  lessPadding: {
    paddingLeft: 8 * 2.5 + "px"
  },
  "default": {
    backgroundColor: "#313131"
  },
  success: {
    backgroundColor: "#43a047"
  },
  error: {
    backgroundColor: "#d32f2f"
  },
  warning: {
    backgroundColor: "#ff9800"
  },
  info: {
    backgroundColor: "#2196f3"
  },
  message: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0"
  },
  action: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: "16px",
    marginRight: "-8px"
  }
});
var ariaDescribedby = "notistack-snackbar";
var MaterialDesignContent = /* @__PURE__ */ (0, import_react.forwardRef)(function(props, forwardedRef) {
  var id = props.id, message = props.message, componentOrFunctionAction = props.action, iconVariant = props.iconVariant, variant = props.variant, hideIconVariant = props.hideIconVariant, style = props.style, className = props.className;
  var icon = iconVariant[variant];
  var action = componentOrFunctionAction;
  if (typeof action === "function") {
    action = action(id);
  }
  return import_react.default.createElement(SnackbarContent, {
    ref: forwardedRef,
    role: "alert",
    "aria-describedby": ariaDescribedby,
    style,
    className: clsx_m_default(ComponentClasses.MuiContent, ComponentClasses.MuiContentVariant(variant), classes$2.root, classes$2[variant], className, !hideIconVariant && icon && classes$2.lessPadding)
  }, import_react.default.createElement("div", {
    id: ariaDescribedby,
    className: classes$2.message
  }, !hideIconVariant ? icon : null, message), action && import_react.default.createElement("div", {
    className: classes$2.action
  }, action));
});
MaterialDesignContent.displayName = "MaterialDesignContent";
var MaterialDesignContent$1 = /* @__PURE__ */ (0, import_react.memo)(MaterialDesignContent);
var styles = /* @__PURE__ */ makeStyles({
  wrappedRoot: {
    width: "100%",
    position: "relative",
    transform: "translateX(0)",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    minWidth: "288px"
  }
});
var SnackbarItem = function SnackbarItem2(props) {
  var timeout2 = (0, import_react.useRef)();
  var _useState = (0, import_react.useState)(true), collapsed = _useState[0], setCollapsed = _useState[1];
  var handleClose = createChainedFunction([props.snack.onClose, props.onClose]);
  var handleEntered = function handleEntered2() {
    if (props.snack.requestClose) {
      handleClose(null, "instructed", props.snack.id);
    }
  };
  var handleExitedScreen = (0, import_react.useCallback)(function() {
    timeout2.current = setTimeout(function() {
      setCollapsed(function(col) {
        return !col;
      });
    }, 125);
  }, []);
  (0, import_react.useEffect)(function() {
    return function() {
      if (timeout2.current) {
        clearTimeout(timeout2.current);
      }
    };
  }, []);
  var snack = props.snack, allClasses = props.classes, _props$Component = props.Component, Component2 = _props$Component === void 0 ? MaterialDesignContent$1 : _props$Component;
  var classes2 = (0, import_react.useMemo)(function() {
    return keepSnackbarClassKeys(allClasses);
  }, [allClasses]);
  var open = snack.open, SnackbarProps = snack.SnackbarProps, TransitionComponent = snack.TransitionComponent, TransitionProps = snack.TransitionProps, transitionDuration = snack.transitionDuration, disableWindowBlurListener = snack.disableWindowBlurListener, componentOrFunctionContent = snack.content, otherSnack = _objectWithoutPropertiesLoose(snack, ["open", "SnackbarProps", "TransitionComponent", "TransitionProps", "transitionDuration", "disableWindowBlurListener", "content", "entered", "requestClose", "onEnter", "onEntered", "onExit", "onExited"]);
  var transitionProps = _extends({
    direction: getSlideDirection(otherSnack.anchorOrigin),
    timeout: transitionDuration
  }, TransitionProps);
  var content = componentOrFunctionContent;
  if (typeof content === "function") {
    content = content(otherSnack.id, otherSnack.message);
  }
  var callbacks = ["onEnter", "onEntered", "onExit", "onExited"].reduce(function(acc, cbName) {
    var _extends2;
    return _extends({}, acc, (_extends2 = {}, _extends2[cbName] = createChainedFunction([props.snack[cbName], props[cbName]], otherSnack.id), _extends2));
  }, {});
  return import_react.default.createElement(Collapse, {
    "in": collapsed,
    onExited: callbacks.onExited
  }, import_react.default.createElement(Snackbar, {
    open,
    id: otherSnack.id,
    disableWindowBlurListener,
    autoHideDuration: otherSnack.autoHideDuration,
    className: clsx_m_default(styles.wrappedRoot, classes2.root, classes2[toSnackbarAnchorOrigin(otherSnack.anchorOrigin)]),
    SnackbarProps,
    onClose: handleClose
  }, import_react.default.createElement(TransitionComponent, Object.assign({}, transitionProps, {
    appear: true,
    "in": open,
    onExit: callbacks.onExit,
    onExited: handleExitedScreen,
    onEnter: callbacks.onEnter,
    // order matters. first callbacks.onEntered to set entered: true,
    // then handleEntered to check if there's a request for closing
    onEntered: createChainedFunction([callbacks.onEntered, handleEntered], otherSnack.id)
  }), content || import_react.default.createElement(Component2, Object.assign({}, otherSnack)))));
};
var _root$1;
var _rootDense;
var _left;
var _right;
var _center;
var indents = {
  view: {
    "default": 20,
    dense: 4
  },
  snackbar: {
    "default": 6,
    dense: 2
  }
};
var collapseWrapper = "." + ComponentClasses.CollapseWrapper;
var xsWidthMargin = 16;
var styles$1 = /* @__PURE__ */ makeStyles({
  root: (_root$1 = {
    boxSizing: "border-box",
    display: "flex",
    maxHeight: "100%",
    position: "fixed",
    zIndex: 1400,
    height: "auto",
    width: "auto",
    transition: /* @__PURE__ */ createTransition(["top", "right", "bottom", "left", "max-width"], {
      duration: 300,
      easing: "ease"
    }),
    // container itself is invisible and should not block clicks, clicks should be passed to its children
    // a pointerEvents: all is applied in the collapse component
    pointerEvents: "none"
  }, _root$1[collapseWrapper] = {
    padding: indents.snackbar["default"] + "px 0px",
    transition: "padding 300ms ease 0ms"
  }, _root$1.maxWidth = "calc(100% - " + indents.view["default"] * 2 + "px)", _root$1[breakpoints.downXs] = {
    width: "100%",
    maxWidth: "calc(100% - " + xsWidthMargin * 2 + "px)"
  }, _root$1),
  rootDense: (_rootDense = {}, _rootDense[collapseWrapper] = {
    padding: indents.snackbar.dense + "px 0px"
  }, _rootDense),
  top: {
    top: indents.view["default"] - indents.snackbar["default"] + "px",
    flexDirection: "column"
  },
  bottom: {
    bottom: indents.view["default"] - indents.snackbar["default"] + "px",
    flexDirection: "column-reverse"
  },
  left: (_left = {
    left: indents.view["default"] + "px"
  }, _left[breakpoints.upSm] = {
    alignItems: "flex-start"
  }, _left[breakpoints.downXs] = {
    left: xsWidthMargin + "px"
  }, _left),
  right: (_right = {
    right: indents.view["default"] + "px"
  }, _right[breakpoints.upSm] = {
    alignItems: "flex-end"
  }, _right[breakpoints.downXs] = {
    right: xsWidthMargin + "px"
  }, _right),
  center: (_center = {
    left: "50%",
    transform: "translateX(-50%)"
  }, _center[breakpoints.upSm] = {
    alignItems: "center"
  }, _center)
});
var SnackbarContainer = function SnackbarContainer2(props) {
  var _props$classes = props.classes, classes2 = _props$classes === void 0 ? {} : _props$classes, anchorOrigin = props.anchorOrigin, dense = props.dense, children = props.children;
  var combinedClassname = clsx_m_default(
    ComponentClasses.SnackbarContainer,
    styles$1[anchorOrigin.vertical],
    styles$1[anchorOrigin.horizontal],
    styles$1.root,
    // root should come after others to override maxWidth
    classes2.containerRoot,
    classes2["containerAnchorOrigin" + originKeyExtractor(anchorOrigin)],
    dense && styles$1.rootDense
  );
  return import_react.default.createElement("div", {
    className: combinedClassname
  }, children);
};
var SnackbarContainer$1 = /* @__PURE__ */ (0, import_react.memo)(SnackbarContainer);
var __DEV__ = true;
var messages = {
  NO_PERSIST_ALL: "Reached maxSnack while all enqueued snackbars have 'persist' flag. Notistack will dismiss the oldest snackbar anyway to allow other ones in the queue to be presented."
};
var warning = function(messageKey) {
  if (!__DEV__)
    return;
  var message = messages[messageKey];
  if (typeof console !== "undefined") {
    console.error("WARNING - notistack: " + message);
  }
  try {
    throw new Error(message);
  } catch (x) {
  }
};
var isOptions = function isOptions2(messageOrOptions) {
  var isMessage = typeof messageOrOptions === "string" || (0, import_react.isValidElement)(messageOrOptions);
  return !isMessage;
};
var enqueueSnackbar;
var closeSnackbar;
var SnackbarProvider = /* @__PURE__ */ function(_Component) {
  _inheritsLoose(SnackbarProvider2, _Component);
  function SnackbarProvider2(props) {
    var _this;
    _this = _Component.call(this, props) || this;
    _this.enqueueSnackbar = function(messageOrOptions, optsOrUndefined) {
      if (optsOrUndefined === void 0) {
        optsOrUndefined = {};
      }
      if (messageOrOptions === void 0 || messageOrOptions === null) {
        throw new Error("enqueueSnackbar called with invalid argument");
      }
      var opts = isOptions(messageOrOptions) ? messageOrOptions : optsOrUndefined;
      var message = isOptions(messageOrOptions) ? messageOrOptions.message : messageOrOptions;
      var key = opts.key, preventDuplicate = opts.preventDuplicate, options = _objectWithoutPropertiesLoose(opts, ["key", "preventDuplicate"]);
      var hasSpecifiedKey = isDefined(key);
      var id = hasSpecifiedKey ? key : (/* @__PURE__ */ new Date()).getTime() + Math.random();
      var merger = merge(options, _this.props);
      var snack = _extends({
        id
      }, options, {
        message,
        open: true,
        entered: false,
        requestClose: false,
        persist: merger("persist"),
        action: merger("action"),
        content: merger("content"),
        variant: merger("variant"),
        anchorOrigin: merger("anchorOrigin"),
        disableWindowBlurListener: merger("disableWindowBlurListener"),
        autoHideDuration: merger("autoHideDuration"),
        hideIconVariant: merger("hideIconVariant"),
        TransitionComponent: merger("TransitionComponent"),
        transitionDuration: merger("transitionDuration"),
        TransitionProps: merger("TransitionProps", true),
        iconVariant: merger("iconVariant", true),
        style: merger("style", true),
        SnackbarProps: merger("SnackbarProps", true),
        className: clsx_m_default(_this.props.className, options.className)
      });
      if (snack.persist) {
        snack.autoHideDuration = void 0;
      }
      _this.setState(function(state) {
        if (preventDuplicate === void 0 && _this.props.preventDuplicate || preventDuplicate) {
          var compareFunction = function compareFunction2(item) {
            return hasSpecifiedKey ? item.id === id : item.message === message;
          };
          var inQueue = state.queue.findIndex(compareFunction) > -1;
          var inView = state.snacks.findIndex(compareFunction) > -1;
          if (inQueue || inView) {
            return state;
          }
        }
        return _this.handleDisplaySnack(_extends({}, state, {
          queue: [].concat(state.queue, [snack])
        }));
      });
      return id;
    };
    _this.handleDisplaySnack = function(state) {
      var snacks = state.snacks;
      if (snacks.length >= _this.maxSnack) {
        return _this.handleDismissOldest(state);
      }
      return _this.processQueue(state);
    };
    _this.processQueue = function(state) {
      var queue = state.queue, snacks = state.snacks;
      if (queue.length > 0) {
        return _extends({}, state, {
          snacks: [].concat(snacks, [queue[0]]),
          queue: queue.slice(1, queue.length)
        });
      }
      return state;
    };
    _this.handleDismissOldest = function(state) {
      if (state.snacks.some(function(item) {
        return !item.open || item.requestClose;
      })) {
        return state;
      }
      var popped = false;
      var ignore = false;
      var persistentCount = state.snacks.reduce(function(acc, current) {
        return acc + (current.open && current.persist ? 1 : 0);
      }, 0);
      if (persistentCount === _this.maxSnack) {
        true ? warning("NO_PERSIST_ALL") : void 0;
        ignore = true;
      }
      var snacks = state.snacks.map(function(item) {
        if (!popped && (!item.persist || ignore)) {
          popped = true;
          if (!item.entered) {
            return _extends({}, item, {
              requestClose: true
            });
          }
          if (item.onClose) {
            item.onClose(null, "maxsnack", item.id);
          }
          if (_this.props.onClose) {
            _this.props.onClose(null, "maxsnack", item.id);
          }
          return _extends({}, item, {
            open: false
          });
        }
        return _extends({}, item);
      });
      return _extends({}, state, {
        snacks
      });
    };
    _this.handleEnteredSnack = function(node, isAppearing, key) {
      if (!isDefined(key)) {
        throw new Error("handleEnteredSnack Cannot be called with undefined key");
      }
      _this.setState(function(_ref) {
        var snacks = _ref.snacks;
        return {
          snacks: snacks.map(function(item) {
            return item.id === key ? _extends({}, item, {
              entered: true
            }) : _extends({}, item);
          })
        };
      });
    };
    _this.handleCloseSnack = function(event, reason, key) {
      if (_this.props.onClose) {
        _this.props.onClose(event, reason, key);
      }
      var shouldCloseAll = key === void 0;
      _this.setState(function(_ref2) {
        var snacks = _ref2.snacks, queue = _ref2.queue;
        return {
          snacks: snacks.map(function(item) {
            if (!shouldCloseAll && item.id !== key) {
              return _extends({}, item);
            }
            return item.entered ? _extends({}, item, {
              open: false
            }) : _extends({}, item, {
              requestClose: true
            });
          }),
          queue: queue.filter(function(item) {
            return item.id !== key;
          })
        };
      });
    };
    _this.closeSnackbar = function(key) {
      var toBeClosed = _this.state.snacks.find(function(item) {
        return item.id === key;
      });
      if (isDefined(key) && toBeClosed && toBeClosed.onClose) {
        toBeClosed.onClose(null, "instructed", key);
      }
      _this.handleCloseSnack(null, "instructed", key);
    };
    _this.handleExitedSnack = function(node, key) {
      if (!isDefined(key)) {
        throw new Error("handleExitedSnack Cannot be called with undefined key");
      }
      _this.setState(function(state) {
        var newState = _this.processQueue(_extends({}, state, {
          snacks: state.snacks.filter(function(item) {
            return item.id !== key;
          })
        }));
        if (newState.queue.length === 0) {
          return newState;
        }
        return _this.handleDismissOldest(newState);
      });
    };
    enqueueSnackbar = _this.enqueueSnackbar;
    closeSnackbar = _this.closeSnackbar;
    _this.state = {
      snacks: [],
      queue: [],
      contextValue: {
        enqueueSnackbar: _this.enqueueSnackbar.bind(_assertThisInitialized(_this)),
        closeSnackbar: _this.closeSnackbar.bind(_assertThisInitialized(_this))
      }
    };
    return _this;
  }
  var _proto = SnackbarProvider2.prototype;
  _proto.render = function render() {
    var _this2 = this;
    var contextValue = this.state.contextValue;
    var _this$props = this.props, domRoot = _this$props.domRoot, children = _this$props.children, _this$props$dense = _this$props.dense, dense = _this$props$dense === void 0 ? false : _this$props$dense, _this$props$Component = _this$props.Components, Components = _this$props$Component === void 0 ? {} : _this$props$Component, classes2 = _this$props.classes;
    var categ = this.state.snacks.reduce(function(acc, current) {
      var _extends2;
      var category = originKeyExtractor(current.anchorOrigin);
      var existingOfCategory = acc[category] || [];
      return _extends({}, acc, (_extends2 = {}, _extends2[category] = [].concat(existingOfCategory, [current]), _extends2));
    }, {});
    var snackbars = Object.keys(categ).map(function(origin) {
      var snacks = categ[origin];
      var nomineeSnack = snacks[0];
      return import_react.default.createElement(SnackbarContainer$1, {
        key: origin,
        dense,
        anchorOrigin: nomineeSnack.anchorOrigin,
        classes: classes2
      }, snacks.map(function(snack) {
        return import_react.default.createElement(SnackbarItem, {
          key: snack.id,
          snack,
          classes: classes2,
          Component: Components[snack.variant],
          onClose: _this2.handleCloseSnack,
          onEnter: _this2.props.onEnter,
          onExit: _this2.props.onExit,
          onExited: createChainedFunction([_this2.handleExitedSnack, _this2.props.onExited], snack.id),
          onEntered: createChainedFunction([_this2.handleEnteredSnack, _this2.props.onEntered], snack.id)
        });
      }));
    });
    return import_react.default.createElement(SnackbarContext.Provider, {
      value: contextValue
    }, children, domRoot ? (0, import_react_dom.createPortal)(snackbars, domRoot) : snackbars);
  };
  _createClass(SnackbarProvider2, [{
    key: "maxSnack",
    get: function get() {
      return this.props.maxSnack || defaults.maxSnack;
    }
  }]);
  return SnackbarProvider2;
}(import_react.Component);
var useSnackbar = function() {
  return (0, import_react.useContext)(SnackbarContext);
};

export {
  SnackbarProvider,
  useSnackbar
};
//# sourceMappingURL=/build/_shared/chunk-43PAR6MS.js.map
