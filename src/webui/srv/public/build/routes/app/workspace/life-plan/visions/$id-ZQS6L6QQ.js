import {
  isVisionActivable,
  isVisionEditable
} from "/build/_shared/chunk-4HGT4W3H.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
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
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
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
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/life-plan/visions/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/life-plan/visions/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/life-plan/visions/$id.tsx"
  );
  import.meta.hot.lastModified = "1775685113121.4868";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("mark-draft-as-active")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 4 /* LEAFLET */
};
var shouldRevalidate = standardShouldRevalidate;
function Vision() {
  _s();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle" && !loaderData.vision.archived;
  const noteInputsEnabled = inputsEnabled && isVisionEditable(loaderData.vision);
  const isActivable = isVisionActivable(loaderData.vision);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.VISION, entityRefId: loaderData.vision.ref_id, fakeKey: `vision-${loaderData.vision.ref_id}`, showArchiveAndRemoveButton: true, isLeaflet: true, inputsEnabled, entityArchived: loaderData.vision.archived, returnLocation: "/app/workspace/life-plan/visions", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions/$id.tsx",
      lineNumber: 137,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Vision", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "vision-actions", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Mark as Active",
      value: "mark-draft-as-active",
      highlight: true,
      disabled: !isActivable
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions/$id.tsx",
      lineNumber: 139,
      columnNumber: 44
    }, this), children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled: noteInputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions/$id.tsx",
      lineNumber: 145,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/life-plan/visions/$id.tsx",
      lineNumber: 139,
      columnNumber: 7
    }, this)
  ] }, `vision-${loaderData.vision.ref_id}`, true, {
    fileName: "app/routes/app/workspace/life-plan/visions/$id.tsx",
    lineNumber: 136,
    columnNumber: 10
  }, this);
}
_s(Vision, "Ix92OHpw1YzcryOJ01ZWZwOTGH0=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation];
});
_c = Vision;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/life-plan/visions", ParamsSchema, {
  notFound: (params) => `Could not find vision #${params.id}!`,
  error: (params) => `There was an error loading vision #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Vision");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Vision as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/life-plan/visions/$id-ZQS6L6QQ.js.map
