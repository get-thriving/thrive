import { VisionStatus } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { visionStatusLabel } from "#/core/life_plan/sub/visions/status";

interface VisionStatusTagProps {
  visionStatus: VisionStatus;
}

export function VisionStatusTag({ visionStatus }: VisionStatusTagProps) {
  const tagName = visionStatusLabel(visionStatus);
  const tagClass = visionStatusColor(visionStatus);
  return <SlimChip label={tagName} color={tagClass} />;
}

function visionStatusColor(
  status: VisionStatus,
): "success" | "warning" | "default" {
  switch (status) {
    case VisionStatus.ACTIVE:
      return "success";
    case VisionStatus.DRAFT:
      return "warning";
    case VisionStatus.OLD:
      return "default";
  }
}
