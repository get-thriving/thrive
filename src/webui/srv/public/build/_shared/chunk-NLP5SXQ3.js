import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/universe.ts
var import_webapi_client = __toESM(require_dist(), 1);
var THRIVE_UNIVERSE = "thrive";
var DEV_UNIVERSE = "dev";
function isThriveUniverse(universe) {
  return universe === THRIVE_UNIVERSE;
}
function isDevUniverse(universe) {
  return universe === DEV_UNIVERSE;
}
function getHosting(universe) {
  if (isThriveUniverse(universe)) {
    return import_webapi_client.Hosting.HOSTED_GLOBAL;
  }
  if (isDevUniverse(universe)) {
    return import_webapi_client.Hosting.LOCAL;
  }
  return import_webapi_client.Hosting.SELF_HOSTED;
}

export {
  getHosting
};
//# sourceMappingURL=/build/_shared/chunk-NLP5SXQ3.js.map
