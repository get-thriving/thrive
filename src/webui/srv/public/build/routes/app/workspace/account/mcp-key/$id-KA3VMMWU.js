import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
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
  OutlinedInput_default
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
  useLoaderData,
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

// app/routes/app/workspace/account/mcp-key/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/account/mcp-key/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/account/mcp-key/$id.tsx"
  );
  import.meta.hot.lastModified = "1775685113176.0413";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string()
}), external_exports.object({
  intent: external_exports.literal("archive")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function McpKeyEdit() {
  _s();
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const mcpKey = loaderData.mcpKey;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `account/mcp-key/${mcpKey.ref_id}`, returnLocation: "/app/workspace/account", inputsEnabled, showArchiveButton: true, entityArchived: mcpKey.archived, children: /* @__PURE__ */ jsxDEV(SectionCard, { title: `MCP Key: ${mcpKey.name}`, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: `mcp-key-${mcpKey.ref_id}-actions`, topLevelInfo, inputsEnabled, actions: [ActionSingle({
    id: "mcp-key-update",
    text: "Save",
    value: "update",
    highlight: true
  })] }, void 0, false, {
    fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
    lineNumber: 129,
    columnNumber: 63
  }, this), children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
      lineNumber: 135,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", defaultValue: mcpKey.name, readOnly: !inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
        lineNumber: 139,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
        fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
        lineNumber: 140,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
      lineNumber: 137,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
    lineNumber: 129,
    columnNumber: 7
  }, this) }, `account/mcp-key/${mcpKey.ref_id}`, false, {
    fileName: "app/routes/app/workspace/account/mcp-key/$id.tsx",
    lineNumber: 128,
    columnNumber: 10
  }, this);
}
_s(McpKeyEdit, "ncZI6OHH5LThC0y+A7ofM8VLGu4=", false, function() {
  return [useActionData, useLoaderData, useNavigation];
});
_c = McpKeyEdit;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/account", ParamsSchema, {
  notFound: (params) => `Could not find MCP key ${params.id}!`,
  error: () => `There was an error loading the MCP key! Please try again!`
});
var _c;
$RefreshReg$(_c, "McpKeyEdit");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  McpKeyEdit as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/account/mcp-key/$id-KA3VMMWU.js.map
