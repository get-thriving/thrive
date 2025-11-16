import type { SyncTarget } from "@jupiter/webapi-client";

import { SlimChip } from "~/infra/component/chips";
import { syncTargetName } from "~/sync-target";

interface SyncTargetTagProps {
  target: SyncTarget;
}

export function SyncTargetTag(props: SyncTargetTagProps) {
  const tagName = syncTargetName(props.target);
  return <SlimChip label={tagName} color="info" />;
}
