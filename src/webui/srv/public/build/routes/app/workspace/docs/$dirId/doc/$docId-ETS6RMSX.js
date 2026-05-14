import {
  DocEditor
} from "/build/_shared/chunk-ZALVYYVQ.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  Button_default
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
import {
  useLeafNeedsToShowLeaflet
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  Outlet,
  useActionData,
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

// app/routes/app/workspace/docs/$dirId/doc/$docId.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/docs/$dirId/doc/$docId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx"
  );
  import.meta.hot.lastModified = "1777810170521.1033";
}
var ParamsSchema = external_exports.object({
  dirId: external_exports.string(),
  docId: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function DocInFolder() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const inputsEnabled = navigation.state === "idle" && !loaderData.doc.archived;
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.DOC, entityRefId: loaderData.doc.ref_id, fakeKey: `doc-${loaderData.doc.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.doc.archived, returnLocation: `/app/workspace/docs/${loaderData.dirId}`, initialExpansionState: "full" /* FULL */, shouldShowALeaflet, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaflet, children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Doc", actions: /* @__PURE__ */ jsxDEV(Button_default, { component: Link, to: `/app/workspace/docs/${loaderData.dirId}/doc/${loaderData.doc.ref_id}/settings`, variant: "outlined", size: "small", type: "button", children: "Settings" }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
        lineNumber: 145,
        columnNumber: 43
      }, this), children: /* @__PURE__ */ jsxDEV(DocEditor, { initialDoc: loaderData.doc, initialNote: loaderData.note, inputsEnabled, parentDirRefId: loaderData.doc.parent_dir_ref_id, rightOfName: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.DOC, loaderData.doc.ref_id) }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
        lineNumber: 148,
        columnNumber: 173
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
        lineNumber: 148,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
        lineNumber: 145,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
      lineNumber: 143,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
      lineNumber: 153,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
      lineNumber: 152,
      columnNumber: 7
    }, this)
  ] }, `doc-${loaderData.doc.ref_id}`, true, {
    fileName: "app/routes/app/workspace/docs/$dirId/doc/$docId.tsx",
    lineNumber: 142,
    columnNumber: 10
  }, this);
}
_s(DocInFolder, "jdpuCq7+VxTxKEwEsCBMaFTKewY=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useLeafNeedsToShowLeaflet];
});
_c = DocInFolder;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/docs/${params.dirId}`, ParamsSchema, {
  notFound: (params) => `Could not find doc #${params.docId}!`,
  error: (params) => `There was an error loading doc #${params.docId}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "DocInFolder");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  DocInFolder as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/docs/$dirId/doc/$docId-ETS6RMSX.js.map
