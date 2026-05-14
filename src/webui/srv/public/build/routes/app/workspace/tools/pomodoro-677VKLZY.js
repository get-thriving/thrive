import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ButtonSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  Duration,
  ToolPanel,
  isDevelopment,
  makeToolErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import {
  getPublicName
} from "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Button_default,
  CardContent_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  GlobalPropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import "/build/_shared/chunk-VVGD4GL7.js";
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/tools/pomodoro.tsx
var import_react = __toESM(require_react());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/tools/pomodoro.tsx"' + id);
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
    "app/routes/app/workspace/tools/pomodoro.tsx"
  );
  import.meta.hot.lastModified = "1775685113131.799";
}
var DEFAULT_PROD_DURATION = Duration.fromMillis(1e3 * 60 * 25);
var DEFAULT_DEV_DURATION = Duration.fromMillis(1e3 * 4);
var DEFAULT_STEP_MS = 1e3;
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Pomodoro() {
  _s();
  const globalProperties = (0, import_react.useContext)(GlobalPropertiesContext);
  const actualDuration = isDevelopment(globalProperties.env) ? DEFAULT_DEV_DURATION : DEFAULT_PROD_DURATION;
  const topLevelInfo = (0, import_react.useContext)(TopLevelInfoContext);
  const [timerValue, setTimerValue] = (0, import_react.useState)(actualDuration);
  const [timerStarted, setTimerStarted] = (0, import_react.useState)(false);
  const [timerFinished, setTimerFinished] = (0, import_react.useState)(false);
  const [intervalHandle, setIntervalHandle] = (0, import_react.useState)(void 0);
  function startTimer() {
    setTimerStarted(true);
    setTimerFinished(false);
    const newIntervalHandle = setInterval(() => {
      setTimerValue((d) => {
        if (d.toMillis() > 0) {
          return d.minus(DEFAULT_STEP_MS);
        } else {
          return d;
        }
      });
    }, DEFAULT_STEP_MS);
    setIntervalHandle(newIntervalHandle);
  }
  function resetTimer() {
    setTimerStarted(false);
    setTimerFinished(false);
    setTimerValue(actualDuration);
    clearInterval(intervalHandle);
    setIntervalHandle(void 0);
  }
  const notifyToast = (0, import_react.useCallback)(() => {
    if (!("Notification" in window)) {
      return;
    }
    new Notification(`${getPublicName(globalProperties)} Pomodoro Timer`, {
      icon: "/favicon.ico",
      body: `Your ${actualDuration.toFormat("m")} minutes Pomodor interval is finished!`
    });
  }, [actualDuration, globalProperties]);
  function notifyAudio() {
    const notificationAudio = new Audio("/pomodoro-notification.mp3");
    notificationAudio.play();
  }
  (0, import_react.useEffect)(() => {
    if (timerValue.toMillis() === 0) {
      setTimerFinished(true);
      clearInterval(intervalHandle);
      setIntervalHandle(void 0);
      setTimeout(notifyToast, 0);
      setTimeout(notifyAudio, 0);
    }
  }, [timerValue, intervalHandle, notifyToast]);
  return /* @__PURE__ */ jsxDEV(ToolPanel, { children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Pomodoro Timer", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "pomodoro-actions", topLevelInfo, inputsEnabled: true, actions: [ButtonSingle({
    text: "Start",
    highlight: true,
    disabled: timerStarted,
    onClick: () => startTimer()
  }), ButtonSingle({
    text: "Reset",
    disabled: !timerStarted,
    onClick: () => resetTimer()
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
    lineNumber: 97,
    columnNumber: 52
  }, this), children: [
    /* @__PURE__ */ jsxDEV(PomodoroCard, { finished: timerFinished.toString(), children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "h2", children: timerValue.toFormat("mm'm'ss's'") }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 108,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 107,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 113,
      columnNumber: 31
    }, this), children: () => "Notification" in window && /* @__PURE__ */ jsxDEV(NotificationControl, {}, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 114,
      columnNumber: 46
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
    lineNumber: 97,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
    lineNumber: 96,
    columnNumber: 10
  }, this);
}
_s(Pomodoro, "uik32pljHc+dk9kuNqXb+XiErRE=");
_c = Pomodoro;
var ErrorBoundary = makeToolErrorBoundary(_c2 = () => `There was an error with the pomodoro timing! Please try again!`);
_c3 = ErrorBoundary;
var PomodoroCard = styled_default(CardContent_default)(({
  theme,
  finished
}) => ({
  backgroundColor: finished === "true" ? theme.palette.info.light : theme.palette.background.paper
}));
_c4 = PomodoroCard;
function NotificationControl() {
  _s2();
  const [permissionStatus, setPermissionStatus] = (0, import_react.useState)(Notification.permission);
  function enableNotifications() {
    Notification.requestPermission().then((permission) => {
      setPermissionStatus(permission);
    });
  }
  if (permissionStatus === "default") {
    return /* @__PURE__ */ jsxDEV(Button_default, { onClick: enableNotifications, variant: "text", children: "Enable Notif." }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 139,
      columnNumber: 12
    }, this);
  } else if (permissionStatus === "denied") {
    return /* @__PURE__ */ jsxDEV(Button_default, { variant: "text", disabled: true, children: "Notif. Blocked" }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 143,
      columnNumber: 12
    }, this);
  } else {
    return /* @__PURE__ */ jsxDEV(Button_default, { variant: "text", disabled: true, children: "Notif. Allowed" }, void 0, false, {
      fileName: "app/routes/app/workspace/tools/pomodoro.tsx",
      lineNumber: 147,
      columnNumber: 12
    }, this);
  }
}
_s2(NotificationControl, "KH499XG/nqL7iD+Q38vsvx2hqPo=");
_c5 = NotificationControl;
var _c;
var _c2;
var _c3;
var _c4;
var _c5;
$RefreshReg$(_c, "Pomodoro");
$RefreshReg$(_c2, "ErrorBoundary$makeToolErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
$RefreshReg$(_c4, "PomodoroCard");
$RefreshReg$(_c5, "NotificationControl");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Pomodoro as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/tools/pomodoro-677VKLZY.js.map
