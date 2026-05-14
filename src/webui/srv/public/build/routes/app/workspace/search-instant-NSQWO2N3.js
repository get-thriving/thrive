import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/search-instant.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/search-instant.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/search-instant.tsx"
  );
  import.meta.hot.lastModified = "1777213342597.0432";
}
var WorkspaceSearchQuerySchema = external_exports.object({
  query: external_exports.string().optional(),
  limit: external_exports.string().optional(),
  offset: external_exports.string().optional(),
  includeArchived: import_zodix.CheckboxAsString,
  filterEntityTags: selectZod(external_exports.nativeEnum(import_webapi_client.NamedEntityTag)).optional(),
  filterTagRefIds: external_exports.string().optional(),
  filterContactRefIds: external_exports.string().optional(),
  filterCreatedTimeAfter: external_exports.string().optional(),
  filterCreatedTimeBefore: external_exports.string().optional(),
  filterLastModifiedTimeAfter: external_exports.string().optional(),
  filterLastModifiedTimeBefore: external_exports.string().optional(),
  filterArchivedTimeAfter: external_exports.string().optional(),
  filterArchivedTimeBefore: external_exports.string().optional()
});
function SearchInstantRoute() {
  return null;
}
_c = SearchInstantRoute;
var _c;
$RefreshReg$(_c, "SearchInstantRoute");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  SearchInstantRoute as default
};
//# sourceMappingURL=/build/routes/app/workspace/search-instant-NSQWO2N3.js.map
