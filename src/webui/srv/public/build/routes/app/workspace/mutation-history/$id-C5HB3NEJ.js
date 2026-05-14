import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  EntityEventList,
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  Stack_default
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
import "/build/_shared/chunk-VVGD4GL7.js";
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

// app/routes/app/workspace/mutation-history/$id.tsx
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/mutation-history/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/mutation-history/$id.tsx"
  );
  import.meta.hot.lastModified = "1775685113180.815";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function MutationDetail() {
  _s();
  const {
    mutationName,
    entries,
    users
  } = useLoaderDataSafeForAnimation();
  const usersById = Object.fromEntries(users.map((u) => [u.ref_id, u]));
  const mutationLabel = mutationName.replace(/UseCase$/, "");
  return /* @__PURE__ */ jsxDEV(LeafPanel, { fakeKey: `mutation-history/${mutationLabel}`, returnLocation: "/app/workspace/mutation-history", inputsEnabled: false, children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: /* @__PURE__ */ jsxDEV(EntityEventList, { entries: entries.map((e) => ({
    entity_name: e.entity_name,
    event_kind: e.event_kind,
    event_name: e.event_name,
    timestamp: e.timestamp,
    source: e.source,
    user_ref_id: e.user_ref_id,
    entity_version: e.entity_version,
    data: e.data
  })), usersById, emptyMessage: "No entity events found for this mutation." }, void 0, false, {
    fileName: "app/routes/app/workspace/mutation-history/$id.tsx",
    lineNumber: 80,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/mutation-history/$id.tsx",
    lineNumber: 79,
    columnNumber: 7
  }, this) }, `mutation-history/${mutationLabel}`, false, {
    fileName: "app/routes/app/workspace/mutation-history/$id.tsx",
    lineNumber: 78,
    columnNumber: 10
  }, this);
}
_s(MutationDetail, "4/SNhFpvYeVarRdIMkKu6wAfUYc=", false, function() {
  return [useLoaderDataSafeForAnimation];
});
_c = MutationDetail;
var ErrorBoundary = makeLeafErrorBoundary(`/app/workspace/mutation-history`, ParamsSchema, {
  notFound: (params) => `Could not find mutation #${params.id}!`,
  error: (params) => `There was an error loading mutation #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "MutationDetail");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  MutationDetail as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/mutation-history/$id-C5HB3NEJ.js.map
