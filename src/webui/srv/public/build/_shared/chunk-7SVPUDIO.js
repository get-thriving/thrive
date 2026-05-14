import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/component/app-component-tag.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);

// ../core/jupiter/core/app-component.ts
var import_webapi_client = __toESM(require_dist(), 1);
function appComponentName(source) {
  switch (source) {
    case import_webapi_client.AppComponent.CLI:
      return "Cli";
    case import_webapi_client.AppComponent.WEB:
      return "Web";
    case import_webapi_client.AppComponent.APP:
      return "App";
    case import_webapi_client.AppComponent.GC_CRON:
      return "GC Cron";
    case import_webapi_client.AppComponent.GEN_CRON:
      return "Gen Cron";
    case import_webapi_client.AppComponent.SCHEDULE_EXTERNAL_SYNC_CRON:
      return "Schedule External Sync Cron";
    case import_webapi_client.AppComponent.STATS_CRON:
      return "Stats Cron";
    case import_webapi_client.AppComponent.SEARCH_INDEX_BACKFILL:
      return "Search Index Backfill Cron";
    case import_webapi_client.AppComponent.SEARCH_MUTATION_LOG_DRAIN:
      return "Search Mutation Log Drain Cron";
    case import_webapi_client.AppComponent.SEARCH_MUTATION_LOG_PROCESSING_REQUEUE:
      return "Search Mutation Log Processing Re-Queue Cron";
  }
}

// ../core/jupiter/core/infra/component/app-component-tag.tsx
function AppComponentTag(props) {
  if (!Object.values(import_webapi_client2.AppComponent).includes(props.source)) {
    return /* @__PURE__ */ jsxDEV(SlimChip, { label: props.source, color: "info" }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/app-component-tag.tsx",
      lineNumber: 13,
      columnNumber: 12
    }, this);
  }
  const tagName = appComponentName(props.source);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: "info" }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/app-component-tag.tsx",
    lineNumber: 16,
    columnNumber: 10
  }, this);
}

export {
  AppComponentTag
};
//# sourceMappingURL=/build/_shared/chunk-7SVPUDIO.js.map
