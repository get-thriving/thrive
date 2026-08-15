import { Vision, VisionStatus } from "@jupiter/webapi-client";

import { compareADate, dateToAdate } from "#/core/common/adate";
import { timestampToDate } from "#/core/common/timestamp";

export function sortVisionsNaturally(visions: Vision[]): Vision[] {
  return visions.sort((a, b) => {
    const byStatus = visionStatusOrder(a.status) - visionStatusOrder(b.status);
    if (byStatus !== 0) {
      return byStatus;
    }

    return compareADate(
      dateToAdate(timestampToDate(a.created_time)),
      dateToAdate(timestampToDate(b.created_time)),
    );
  });
}

function visionStatusOrder(status: VisionStatus): number {
  switch (status) {
    case VisionStatus.ACTIVE:
      return 0;
    case VisionStatus.DRAFT:
      return 1;
    case VisionStatus.OLD:
      return 2;
  }
}

export function isVisionEditable(vision: Vision): boolean {
  return vision.status === VisionStatus.DRAFT;
}

export function isVisionActivable(vision: Vision): boolean {
  return vision.status === VisionStatus.DRAFT;
}
