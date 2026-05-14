import {
  Password
} from "/build/_shared/chunk-TAFZP6GZ.js";
import {
  LifecyclePanel,
  Logo,
  StandaloneContainer
} from "/build/_shared/chunk-ABCRCQCW.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  NavMultipleCompact,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  makeRootErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
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
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import "/build/_shared/chunk-VB6MSCNJ.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
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

// app/routes/app/login.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/login.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/login.tsx"
  );
  import.meta.hot.lastModified = "1775685113111.6177";
}
var LoginFormSchema = external_exports.object({
  emailAddress: external_exports.string(),
  password: external_exports.string()
});
var handle = {
  displayType: 0 /* ROOT */
};
function Login() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const serviceProperties = (0, import_react2.useContext)(ServicePropertiesContext);
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 113,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT, theId: "docs-help" }, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 115,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/login.tsx",
      lineNumber: 108,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 119,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Login", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "login", topLevelInfo: EMPTY_CONTEXT, inputsEnabled, expansion: 0 /* ALWAYS_SHOW */, actions: [ActionSingle({
        text: "Login",
        value: "login",
        highlight: true
      }), NavMultipleCompact({
        navs: [NavSingle({
          text: "New Workspace",
          link: "/app/init"
        }), NavSingle({
          text: "Reset Password",
          link: "/app/reset-password"
        }), NavSingle({
          text: "Pick Server",
          link: "/app/pick-server/desktop",
          disabled: serviceProperties.frontDoorInfo.appShell !== import_webapi_client.AppShell.DESKTOP_ELECTRON
        })]
      })] }, void 0, false, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 120,
        columnNumber: 85
      }, this), children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "emailAddress", children: "Email Address" }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 138,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Email Address", name: "emailAddress", type: "email", autoComplete: "email", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 139,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/email_address" }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 140,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/login.tsx",
          lineNumber: 137,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "password", children: "Password" }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 144,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Password, { label: "Password", name: "password", autoComplete: "current-password", inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/password" }, void 0, false, {
            fileName: "app/routes/app/login.tsx",
            lineNumber: 146,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/login.tsx",
          lineNumber: 143,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/login.tsx",
        lineNumber: 120,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/login.tsx",
      lineNumber: 118,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/login.tsx",
    lineNumber: 107,
    columnNumber: 10
  }, this);
}
_s(Login, "vGdzI9vCTp+BDEeokyZwPxHvhAw=", false, function() {
  return [useActionData, useNavigation];
});
_c = Login;
var ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error logging in! Please try again!`
});
var _c;
$RefreshReg$(_c, "Login");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Login as default,
  handle
};
//# sourceMappingURL=/build/routes/app/login-DTYEG3OQ.js.map
