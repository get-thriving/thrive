import type { TimePlan } from "@jupiter/webapi-client";
import { SlimChip } from "@jupiter/core/jupiter/core/infra/components/chips";

interface TimePlanTagProps {
  timePlan: TimePlan;
}

export function TimePlanTag(props: TimePlanTagProps) {
  return (
    <SlimChip
      sx={{ maxWidth: "unset" }}
      label={props.timePlan.name}
      color={"info"}
    />
  );
}
