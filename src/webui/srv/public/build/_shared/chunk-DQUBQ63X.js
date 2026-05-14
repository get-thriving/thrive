import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/top-level-context.ts
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
var EMPTY_CONTEXT = {
  today: "2025-01-01",
  userFeatureFlagControls: {
    controls: {}
  },
  workspaceFeatureFlagControls: {
    controls: {}
  },
  user: {
    ref_id: "bad",
    version: -1,
    archived: false,
    created_time: "0",
    last_modified_time: "0",
    archived_time: "0",
    category: import_webapi_client.UserCategory.STANDARD,
    email_address: "foo",
    name: "food",
    avatar: "this-is-not-a-data-url",
    timezone: "UTC",
    feature_flags: {}
  },
  userScoreOverview: void 0,
  workspace: {
    ref_id: "bad",
    version: -1,
    archived: false,
    created_time: "0",
    last_modified_time: "0",
    archived_time: "0",
    name: "food",
    feature_flags: {}
  }
};
var TopLevelInfoContext = (0, import_react.createContext)(EMPTY_CONTEXT);

export {
  EMPTY_CONTEXT,
  TopLevelInfoContext
};
//# sourceMappingURL=/build/_shared/chunk-DQUBQ63X.js.map
