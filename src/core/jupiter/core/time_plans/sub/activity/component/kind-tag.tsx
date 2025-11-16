import { TimePlanActivityKind } from "@jupiter/webapi-client";
import { SlimChip } from "~/infra/component/chips";
import { timePlanActivityKindName } from "~/time_plans/sub/activity/kind";

interface TimePlanActivityKindTagProps {
  kind: TimePlanActivityKind;
}

export function TimePlanActivityKindTag(props: TimePlanActivityKindTagProps) {
  return (
    <SlimChip
      label={timePlanActivityKindName(props.kind)}
      color={kindToColor(props.kind)}
    />
  );
}

function kindToColor(props: TimePlanActivityKind): "success" | "info" {
  switch (props) {
    case TimePlanActivityKind.FINISH:
      return "success";
    case TimePlanActivityKind.MAKE_PROGRESS:
      return "info";
  }
}
