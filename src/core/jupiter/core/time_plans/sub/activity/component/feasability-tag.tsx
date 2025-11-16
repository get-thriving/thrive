import { TimePlanActivityFeasability } from "@jupiter/webapi-client";

import { SlimChip } from "~/infra/component/chips";
import { timePlanActivityFeasabilityName } from "~/time_plans/sub/activity/feasability";

interface TimePlanActivityFeasabilityTagProps {
  feasability: TimePlanActivityFeasability;
}

export function TimePlanActivityFeasabilityTag(
  props: TimePlanActivityFeasabilityTagProps,
) {
  return (
    <SlimChip
      label={timePlanActivityFeasabilityName(props.feasability)}
      color={feasabilityToColor(props.feasability)}
    />
  );
}

function feasabilityToColor(
  props: TimePlanActivityFeasability,
): "success" | "warning" | "info" {
  switch (props) {
    case TimePlanActivityFeasability.MUST_DO:
      return "success";
    case TimePlanActivityFeasability.NICE_TO_HAVE:
      return "warning";
    case TimePlanActivityFeasability.STRETCH:
      return "info";
  }
}
