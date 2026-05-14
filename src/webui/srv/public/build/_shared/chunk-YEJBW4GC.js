import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/config-client.ts
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
var GlobalPropertiesContext = (0, import_react.createContext)({
  publicName: "FAKE-FAKE",
  description: "FAKE-FAKE",
  universe: "dev",
  env: import_webapi_client.Env.LOCAL,
  instance: "Main",
  version: "FAKE-FAKE",
  hostedGlobalDomain: "FAKE-FAKE",
  communityUrl: "FAKE-FAKE",
  termsOfServiceUrl: "FAKE-FAKE",
  privacyPolicyUrl: "FAKE-FAKE"
});
var ServicePropertiesContext = (0, import_react.createContext)({
  appCore: import_webapi_client.AppCore.WEBUI,
  frontDoorInfo: {
    clientVersion: "FAKE-FAKE",
    appShell: import_webapi_client.AppShell.BROWSER,
    appPlatform: import_webapi_client.AppPlatform.DESKTOP_MACOS,
    appDistribution: import_webapi_client.AppDistribution.WEB,
    initialWindowWidth: void 0
  },
  webApiProgressReporterUrl: "FAKE-FAKE",
  webApiUrl: "FAKE-FAKE",
  apiUrl: "FAKE-FAKE",
  mcpUrl: "FAKE-FAKE",
  webUiUrl: "FAKE-FAKE",
  docsUrl: "FAKE-FAKE",
  inboxTasksToAskForGC: 20,
  overdueInfoDays: 1,
  overdueWarningDays: 2,
  overdueDangerDays: 3
});

export {
  GlobalPropertiesContext,
  ServicePropertiesContext
};
//# sourceMappingURL=/build/_shared/chunk-YEJBW4GC.js.map
