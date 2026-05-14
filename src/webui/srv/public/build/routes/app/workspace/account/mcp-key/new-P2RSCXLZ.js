import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  ButtonSingle,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
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
  InputLabel_default,
  OutlinedInput_default,
  Typography_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
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

// app/routes/app/workspace/account/mcp-key/new.tsx
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/account/mcp-key/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/account/mcp-key/new.tsx"
  );
  import.meta.hot.lastModified = "1775685113176.4727";
}
var ParamsSchema = external_exports.object({});
var CreateFormSchema = external_exports.object({
  intent: external_exports.string().optional(),
  name: external_exports.string()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewMcpKey() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [hasCopied, setHasCopied] = (0, import_react2.useState)(false);
  const successData = actionData?.theType === "no-error-some-data" ? actionData.data : null;
  const created = successData?.created === true;
  const mcpKey = successData?.mcpKey ?? null;
  async function copyToClipboard() {
    if (mcpKey) {
      await navigator.clipboard.writeText(mcpKey);
      setHasCopied(true);
    }
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: "account/mcp-key/new", returnLocation: "/app/workspace/account", inputsEnabled, children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "New MCP Key", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "mcp-key-create", topLevelInfo, inputsEnabled, expansion: created ? 0 /* ALWAYS_SHOW */ : void 0, actions: created ? [ButtonSingle({
    text: hasCopied ? "Copied" : "Copy",
    onClick: copyToClipboard,
    disabled: hasCopied,
    highlight: true
  }), NavSingle({
    text: "Close",
    link: "/app/workspace/account"
  })] : [ActionSingle({
    text: "Create",
    value: "create",
    highlight: true
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
    lineNumber: 87,
    columnNumber: 49
  }, this), children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
      lineNumber: 100,
      columnNumber: 9
    }, this),
    !created ? /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
        lineNumber: 103,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
        lineNumber: 104,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
        lineNumber: 105,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
      lineNumber: 102,
      columnNumber: 21
    }, this) : mcpKey ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
        "This is your new MCP key. ",
        /* @__PURE__ */ jsxDEV("em", { children: "Store it in a safe place!" }, void 0, false, {
          fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
          lineNumber: 108,
          columnNumber: 41
        }, this),
        " You won't be able to see it again."
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
        lineNumber: 107,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(McpKeyBox, { variant: "body2", children: mcpKey }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
        lineNumber: 111,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
      lineNumber: 106,
      columnNumber: 37
    }, this) : null
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
    lineNumber: 87,
    columnNumber: 7
  }, this) }, "account/mcp-key/new", false, {
    fileName: "app/routes/app/workspace/account/mcp-key/new.tsx",
    lineNumber: 86,
    columnNumber: 10
  }, this);
}
_s(NewMcpKey, "nFJyqqooFWPgC9k8JEGnQBR9bRU=", false, function() {
  return [useActionData, useNavigation];
});
_c = NewMcpKey;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/account", ParamsSchema, {
  error: () => `There was an error creating the MCP key! Please try again!`
});
var McpKeyBox = styled_default(Typography_default)(({
  theme
}) => ({
  marginTop: "1rem",
  padding: "0.5rem",
  textAlign: "center",
  fontSize: "0.8rem",
  borderRadius: "0.25rem",
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.success.contrastText
}));
_c2 = McpKeyBox;
var _c;
var _c2;
$RefreshReg$(_c, "NewMcpKey");
$RefreshReg$(_c2, "McpKeyBox");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewMcpKey as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/account/mcp-key/new-P2RSCXLZ.js.map
