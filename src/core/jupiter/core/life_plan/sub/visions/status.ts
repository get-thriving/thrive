import { VisionStatus } from "@jupiter/webapi-client";

export function visionStatusLabel(status: VisionStatus): string {
  switch (status) {
    case VisionStatus.ACTIVE:
      return "Active";
    case VisionStatus.DRAFT:
      return "Draft";
    case VisionStatus.OLD:
      return "Old";
  }
}
