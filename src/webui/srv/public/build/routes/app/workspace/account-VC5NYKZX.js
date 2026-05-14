import {
  TimezoneSelect
} from "/build/_shared/chunk-BM5NLVDW.js";
import {
  UserFeatureFlagsEditor
} from "/build/_shared/chunk-WIJDIBWU.js";
import {
  ApiKeyView
} from "/build/_shared/chunk-QM4LFN2K.js";
import "/build/_shared/chunk-W2LTCAXB.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  ToolPanel,
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
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
  getHosting
} from "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Button_default,
  DialogActions_default,
  DialogContent_default,
  DialogTitle_default,
  Dialog_default,
  FormControlLabel_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Switch_default,
  TextField_default,
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
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import {
  useLeafNeedsToShowLeaflet,
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

// app/routes/app/workspace/account.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/account.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/account.tsx"
  );
  import.meta.hot.lastModified = "1775685113154.1555";
}
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  timezone: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("change-feature-flags"),
  featureFlags: external_exports.nativeEnum(import_webapi_client.UserFeature).optional().or(external_exports.array(external_exports.nativeEnum(import_webapi_client.UserFeature))).transform((v) => v ? Array.isArray(v) ? v : [v] : [])
}), external_exports.object({
  intent: external_exports.literal("update-appearance"),
  useNightMode: external_exports.string().optional().transform((v) => v === "on")
}), external_exports.object({
  intent: external_exports.literal("close-account")
})]);
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Account() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const globalProperties = (0, import_react2.useContext)(GlobalPropertiesContext);
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const [showCloseAccountDialog, setShowCloseAccountDialog] = (0, import_react2.useState)(false);
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf || shouldShowALeaflet, children: /* @__PURE__ */ jsxDEV(ToolPanel, { children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 160,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Account", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "account-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        text: "Save",
        value: "update",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 162,
        columnNumber: 49
      }, this), children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "emailAddress", children: "Your Email Address" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 168,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "email", autoComplete: "email", label: "Your Email Address", name: "emailAddress", disabled: true, defaultValue: loaderData.user.email_address ?? "" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 169,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 167,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(TextField_default, { name: "name", label: "Your Name", defaultValue: loaderData.user.name ?? "", disabled: !inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 173,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 174,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 172,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(TimezoneSelect, { id: "timezone", name: "timezone", inputsEnabled, initialValue: loaderData.user.timezone ?? "" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 177,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/timezone" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 179,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 176,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 162,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Feature Flags", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "feature-flags-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        text: "Change Feature Flags",
        value: "change-feature-flags",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 183,
        columnNumber: 55
      }, this), children: [
        /* @__PURE__ */ jsxDEV(GlobalError, { intent: "change-feature-flags", actionResult: actionData }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 188,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(UserFeatureFlagsEditor, { name: "featureFlags", inputsEnabled, featureFlagsControls: topLevelInfo.userFeatureFlagControls, defaultFeatureFlags: loaderData.user.feature_flags, hosting: getHosting(globalProperties.universe) }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 183,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Appearance", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "appearance-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        text: "Save",
        value: "update-appearance",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 192,
        columnNumber: 52
      }, this), children: [
        /* @__PURE__ */ jsxDEV(GlobalError, { intent: "update-appearance", actionResult: actionData }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 197,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "useNightMode", disabled: !inputsEnabled, defaultChecked: loaderData.webUiSettings.use_night_mode }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 199,
          columnNumber: 42
        }, this), label: "Night Mode" }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 199,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 198,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 192,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "API Keys", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "api-keys-actions", topLevelInfo, inputsEnabled, actions: [NavSingle({
        text: "Add",
        link: "/app/workspace/account/api-key/new",
        highlight: true
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 203,
        columnNumber: 50
      }, this), children: /* @__PURE__ */ jsxDEV(EntityStack, { children: loaderData.apiKeys.map((apiKey) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `api-key-${apiKey.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/account/api-key/${apiKey.ref_id}`, children: /* @__PURE__ */ jsxDEV(ApiKeyView, { apiKey }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 211,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 210,
        columnNumber: 19
      }, this) }, `api-key-${apiKey.ref_id}`, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 209,
        columnNumber: 49
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 208,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 203,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Dangerous", children: [
        /* @__PURE__ */ jsxDEV(GlobalError, { intent: "close-account", actionResult: actionData }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 218,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Dialog_default, { onClose: () => setShowCloseAccountDialog(false), open: showCloseAccountDialog, disablePortal: true, children: [
          /* @__PURE__ */ jsxDEV(DialogTitle_default, { children: "Are You Sure?" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 220,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(DialogContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: "Are you sure you want to close your account? This action is irreversible." }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 222,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 221,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(DialogActions_default, { children: /* @__PURE__ */ jsxDEV(Button_default, { id: "close-account", variant: "contained", disabled: !inputsEnabled, type: "submit", name: "intent", value: "close-account", color: "error", children: "Close Account" }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 228,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/account.tsx",
            lineNumber: 227,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 219,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Button_default, { id: "close-account-initialize", variant: "contained", disabled: !inputsEnabled, onClick: () => setShowCloseAccountDialog(true), color: "error", children: "Close Account" }, void 0, false, {
          fileName: "app/routes/app/workspace/account.tsx",
          lineNumber: 234,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/account.tsx",
        lineNumber: 217,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/account.tsx",
      lineNumber: 159,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/account.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/account.tsx",
      lineNumber: 242,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/account.tsx",
      lineNumber: 241,
      columnNumber: 7
    }, this)
  ] }, `account/${loaderData.user.version}`, true, {
    fileName: "app/routes/app/workspace/account.tsx",
    lineNumber: 157,
    columnNumber: 10
  }, this);
}
_s(Account, "UU6XlKU/Y+HOnTWRXPsRzKJFi5g=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useTrunkNeedsToShowLeaf, useLeafNeedsToShowLeaflet];
});
_c = Account;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the account! Please try again!`
});
var _c;
$RefreshReg$(_c, "Account");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Account as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/account-VC5NYKZX.js.map
