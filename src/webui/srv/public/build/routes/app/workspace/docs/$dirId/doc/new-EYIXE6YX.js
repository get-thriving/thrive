import {
  DocEditor
} from "/build/_shared/chunk-ZALVYYVQ.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default
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
  useLoaderData,
  useNavigation
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/docs/$dirId/doc/new.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/docs/$dirId/doc/new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/docs/$dirId/doc/new.tsx"
  );
  import.meta.hot.lastModified = "1777810170521.714";
}
var ParamsSchema = external_exports.object({
  dirId: external_exports.string()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function NewDoc() {
  _s();
  const navigation = useNavigation();
  const {
    parentDirRefId,
    dirId
  } = useLoaderData();
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `docs-${dirId}-doc-new`, returnLocation: `/app/workspace/docs/${dirId}`, inputsEnabled, initialExpansionState: "full" /* FULL */, children: /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Doc", actionsPosition: 1 /* BELOW */, children: /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(DocEditor, { inputsEnabled, parentDirRefId }, void 0, false, {
    fileName: "app/routes/app/workspace/docs/$dirId/doc/new.tsx",
    lineNumber: 83,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/docs/$dirId/doc/new.tsx",
    lineNumber: 82,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/docs/$dirId/doc/new.tsx",
    lineNumber: 81,
    columnNumber: 7
  }, this) }, `docs-${dirId}-doc-new`, false, {
    fileName: "app/routes/app/workspace/docs/$dirId/doc/new.tsx",
    lineNumber: 80,
    columnNumber: 10
  }, this);
}
_s(NewDoc, "jBz1NLSXC0ZaoGrY1KpApkrYpSk=", false, function() {
  return [useNavigation, useLoaderData];
});
_c = NewDoc;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/docs/${params.dirId}`, ParamsSchema, {
  notFound: () => `Could not find the folder for this new doc!`,
  error: () => `There was an error creating the document! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "NewDoc");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  NewDoc as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/docs/$dirId/doc/new-EYIXE6YX.js.map
