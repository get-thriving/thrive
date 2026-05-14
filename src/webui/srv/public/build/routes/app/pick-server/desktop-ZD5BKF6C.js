import {
  LifecyclePanel,
  Logo,
  StandaloneContainer
} from "/build/_shared/chunk-ABCRCQCW.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ButtonSingle,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  FieldError
} from "/build/_shared/chunk-ETVCQIGU.js";
import {
  aFieldError
} from "/build/_shared/chunk-MF4Q6G6N.js";
import {
  CommunityLink,
  SmartAppBar,
  Title
} from "/build/_shared/chunk-UVXGDSKE.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  EMPTY_CONTEXT
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Button_default,
  FormControl_default,
  InputAdornment_default,
  InputLabel_default,
  OutlinedInput_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  GlobalPropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_frontdoor
} from "/build/_shared/chunk-7YAKCRRX.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useNavigation
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
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/pick-server/desktop.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_frontdoor = __toESM(require_frontdoor());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/pick-server/desktop.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/pick-server/desktop.tsx"
  );
  import.meta.hot.lastModified = "1775685113182.1995";
}
function PickServer() {
  _s();
  const globalProperties = (0, import_react2.useContext)(GlobalPropertiesContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [serverUrl, setServerUrl] = (0, import_react2.useState)("");
  const [errorMessage, setErrorMessage] = (0, import_react2.useState)(null);
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/pick-server/desktop.tsx",
      lineNumber: 59,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Pick Server", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "pick-server", topLevelInfo: EMPTY_CONTEXT, inputsEnabled, expansion: 0 /* ALWAYS_SHOW */, actions: [ButtonSingle({
      text: "Pick Server",
      highlight: true,
      onClick: async () => {
        const res = await window.pickServer.pickServer(serverUrl);
        if (res.result === "error") {
          setErrorMessage(res.errorMsg);
        }
      }
    }), NavSingle({
      text: "Go Back",
      link: "/app/workspace"
    })] }, void 0, false, {
      fileName: "app/routes/app/pick-server/desktop.tsx",
      lineNumber: 70,
      columnNumber: 91
    }, this), children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "server-url", children: "Server URL" }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 84,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Server URL", name: "serverUrl", type: "text", readOnly: !inputsEnabled, value: serverUrl, onChange: (event) => setServerUrl(event.target.value), endAdornment: /* @__PURE__ */ jsxDEV(InputAdornment_default, { position: "end", children: /* @__PURE__ */ jsxDEV(Button_default, { variant: "outlined", disabled: !inputsEnabled, onClick: () => setServerUrl(globalProperties.hostedGlobalDomain), children: "Use Global" }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 86,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 85,
        columnNumber: 187
      }, this) }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 85,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "caption", sx: {
        paddingTop: "1rem"
      }, children: [
        "Examples:",
        /* @__PURE__ */ jsxDEV("ul", { children: [
          /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("code", { children: "thrive-test.com" }, void 0, false, {
              fileName: "app/routes/app/pick-server/desktop.tsx",
              lineNumber: 97,
              columnNumber: 19
            }, this),
            " (assumes https)"
          ] }, void 0, true, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 96,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("code", { children: "http://thrive-test.com" }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 100,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 99,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("code", { children: "https://my-thrive-instance.io" }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 103,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 102,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("li", { children: /* @__PURE__ */ jsxDEV("code", { children: "http://32.18.23.128:10000" }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 106,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/app/pick-server/desktop.tsx",
            lineNumber: 105,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/pick-server/desktop.tsx",
          lineNumber: 95,
          columnNumber: 15
        }, this),
        "You can learn more about self-hosting in the docs:",
        /* @__PURE__ */ jsxDEV(DocsHelp, { size: "small", subject: import_webapi_client.DocsHelpSubject.SELF_HOSTING }, void 0, false, {
          fileName: "app/routes/app/pick-server/desktop.tsx",
          lineNumber: 110,
          columnNumber: 15
        }, this),
        "."
      ] }, void 0, true, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 91,
        columnNumber: 13
      }, this),
      errorMessage && /* @__PURE__ */ jsxDEV(FieldError, { actionResult: aFieldError("server_url", errorMessage), fieldName: "server_url" }, void 0, false, {
        fileName: "app/routes/app/pick-server/desktop.tsx",
        lineNumber: 113,
        columnNumber: 30
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/pick-server/desktop.tsx",
      lineNumber: 83,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/app/pick-server/desktop.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/pick-server/desktop.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/pick-server/desktop.tsx",
    lineNumber: 58,
    columnNumber: 10
  }, this);
}
_s(PickServer, "uozgKXuvDADjfh58OJz7XxK4zSw=", false, function() {
  return [useNavigation];
});
_c = PickServer;
var _c;
$RefreshReg$(_c, "PickServer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  PickServer as default
};
//# sourceMappingURL=/build/routes/app/pick-server/desktop-ZD5BKF6C.js.map
