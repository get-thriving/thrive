import { TimePlanActivityKind } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import {
  timePlanActivityKindIcon,
  timePlanActivityKindName,
} from "#/core/apps/time_plans/sub/activity/kind";

interface TimePlanActivityKindTagProps {
  kind: TimePlanActivityKind;
  format?: "name" | "icon";
}

export function TimePlanActivityKindTag(props: TimePlanActivityKindTagProps) {
  const format = props.format ?? "name";

  if (format === "icon") {
    return (
      <span
        title={timePlanActivityKindName(props.kind)}
        style={{ paddingRight: "0.5rem" }}
      >
        {timePlanActivityKindIcon(props.kind)}
      </span>
    );
  }

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
