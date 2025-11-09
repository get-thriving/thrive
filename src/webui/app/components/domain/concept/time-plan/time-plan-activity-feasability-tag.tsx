import { TimePlanActivityFeasability } from "@jupiter/webapi-client";
import { SlimChip } from "@jupiter/core/infra/components/chips";

import { timePlanActivityFeasabilityName } from "~/logic/domain/time-plan-activity-feasability";

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
