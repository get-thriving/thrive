import "/build/_shared/chunk-7SK2WYB3.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  Password
} from "/build/_shared/chunk-TAFZP6GZ.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  ToolPanel,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  InputLabel_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist
} from "/build/_shared/chunk-ZZL6WUOE.js";
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

// app/routes/app/workspace/security.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/security.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/security.tsx"
  );
  import.meta.hot.lastModified = "1775685113181.2383";
}
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("change-password"),
  currentPassword: external_exports.string(),
  newPassword: external_exports.string(),
  newPasswordRepeat: external_exports.string()
})]);
var handle = {
  displayType: 5 /* TOOL */
};
var shouldRevalidate = standardShouldRevalidate;
function Security() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/security.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { id: "security", title: "Security", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "security-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      id: "change-password",
      text: "Change Password",
      value: "change-password",
      highlight: true
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/security.tsx",
      lineNumber: 99,
      columnNumber: 62
    }, this), children: [
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "currentPassword", children: "Current Password" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 106,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Password, { label: "Current Password", name: "currentPassword", autoComplete: "current-password", inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 107,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/current_password" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 108,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/security.tsx",
        lineNumber: 105,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "newPassword", children: "New Password" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Password, { label: "newPassword", name: "newPassword", autoComplete: "new-password", inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 113,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/new_password" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 114,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/security.tsx",
        lineNumber: 111,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "newPasswordRepeat", children: "New Password Repeat" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 118,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Password, { label: "New Password Repeat", name: "newPasswordRepeat", autoComplete: "new-password", inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 119,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/new_password_repeat" }, void 0, false, {
          fileName: "app/routes/app/workspace/security.tsx",
          lineNumber: 120,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/security.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/security.tsx",
      lineNumber: 99,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/security.tsx",
    lineNumber: 97,
    columnNumber: 7
  }, this) }, "security", false, {
    fileName: "app/routes/app/workspace/security.tsx",
    lineNumber: 96,
    columnNumber: 10
  }, this);
}
_s(Security, "G7puvUxUXA/5akLEuLt3IBDsrwc=", false, function() {
  return [useActionData, useNavigation];
});
_c = Security;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error changing security settings! Please try again!`
});
var _c;
$RefreshReg$(_c, "Security");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Security as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/security-GOZ6TNLH.js.map
