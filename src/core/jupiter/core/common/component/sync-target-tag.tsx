import type { SyncTarget } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { syncTargetName } from "#/core/sync-target";

interface SyncTargetTagProps {
  target: SyncTarget;
}

export function SyncTargetTag(props: SyncTargetTagProps) {
  const tagName = syncTargetName(props.target);
  return <SlimChip label={tagName} color="info" />;
}
