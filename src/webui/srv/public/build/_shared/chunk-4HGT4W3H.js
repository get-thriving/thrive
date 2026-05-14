import {
  timestampToDate
} from "/build/_shared/chunk-X6MG2JXZ.js";
import {
  compareADate,
  dateToAdate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/life_plan/sub/visions/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function sortVisionsNaturally(visions) {
  return visions.sort((a, b) => {
    const byStatus = visionStatusOrder(a.status) - visionStatusOrder(b.status);
    if (byStatus !== 0) {
      return byStatus;
    }
    return compareADate(
      dateToAdate(timestampToDate(a.created_time)),
      dateToAdate(timestampToDate(b.created_time))
    );
  });
}
function visionStatusOrder(status) {
  switch (status) {
    case import_webapi_client.VisionStatus.ACTIVE:
      return 0;
    case import_webapi_client.VisionStatus.DRAFT:
      return 1;
    case import_webapi_client.VisionStatus.OLD:
      return 2;
  }
}
function isVisionEditable(vision) {
  return vision.status === import_webapi_client.VisionStatus.DRAFT;
}
function isVisionActivable(vision) {
  return vision.status === import_webapi_client.VisionStatus.DRAFT;
}

export {
  sortVisionsNaturally,
  isVisionEditable,
  isVisionActivable
};
//# sourceMappingURL=/build/_shared/chunk-4HGT4W3H.js.map
