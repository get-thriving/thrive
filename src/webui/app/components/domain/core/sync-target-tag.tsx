import type { SyncTarget } from "@jupiter/webapi-client";
import { SlimChip } from "@jupiter/core/infra/components/chips";

import { syncTargetName } from "~/logic/domain/sync-target";

interface SyncTargetTagProps {
  target: SyncTarget;
}

export function SyncTargetTag(props: SyncTargetTagProps) {
  const tagName = syncTargetName(props.target);
  return <SlimChip label={tagName} color="info" />;
}
