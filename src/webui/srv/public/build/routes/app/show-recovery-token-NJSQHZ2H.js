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
  makeRootErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
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
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
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
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useLoaderData
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

// app/routes/app/show-recovery-token.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_webapi_client = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/show-recovery-token.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/show-recovery-token.tsx"
  );
  import.meta.hot.lastModified = "1775685113183.5583";
}
var QuerySchema = external_exports.object({
  recoveryToken: external_exports.string()
});
function ShowRecoveryToken() {
  _s();
  const {
    recoveryToken
  } = useLoaderData();
  const [hasCopied, setHasCopied] = (0, import_react2.useState)(false);
  async function copyToClipboard() {
    await navigator.clipboard.writeText(recoveryToken);
    setHasCopied(true);
  }
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 74,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 78,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/show-recovery-token.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "Your Recovery Token", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "recovery-token", topLevelInfo: EMPTY_CONTEXT, inputsEnabled: true, expansion: 0 /* ALWAYS_SHOW */, actions: [ButtonSingle({
      text: hasCopied ? "Copied" : "Copy",
      onClick: copyToClipboard,
      disabled: hasCopied,
      highlight: true
    }), NavSingle({
      text: "To Workspace",
      link: "/app/workspace"
    })] }, void 0, false, {
      fileName: "app/routes/app/show-recovery-token.tsx",
      lineNumber: 82,
      columnNumber: 99
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
        "This is your recovery token! It is used to recover your account in the case you forget your password!",
        " ",
        /* @__PURE__ */ jsxDEV("em", { children: "Store it in a safe place!" }, void 0, false, {
          fileName: "app/routes/app/show-recovery-token.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 91,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(RecoveryTokenBox, { variant: "body2", children: recoveryToken }, void 0, false, {
        fileName: "app/routes/app/show-recovery-token.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/show-recovery-token.tsx",
      lineNumber: 82,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/show-recovery-token.tsx",
      lineNumber: 81,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/show-recovery-token.tsx",
    lineNumber: 71,
    columnNumber: 10
  }, this);
}
_s(ShowRecoveryToken, "qBVAHT8N1IWhMaXGuPvkK0teT9Q=", false, function() {
  return [useLoaderData];
});
_c = ShowRecoveryToken;
var ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error creating the workspace! Please try again!`
});
var RecoveryTokenBox = styled_default(Typography_default)(({
  theme
}) => ({
  marginTop: "1rem",
  padding: "0.5rem",
  textAlign: "center",
  fontSize: "1.2rem",
  borderRadius: "0.25rem",
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.success.contrastText
}));
_c2 = RecoveryTokenBox;
var _c;
var _c2;
$RefreshReg$(_c, "ShowRecoveryToken");
$RefreshReg$(_c2, "RecoveryTokenBox");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  ShowRecoveryToken as default
};
//# sourceMappingURL=/build/routes/app/show-recovery-token-NJSQHZ2H.js.map
