import { Eisen } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { eisenIcon, eisenName } from "#/core/common/eisen";

interface Props {
  eisen: Eisen;
  /** Just the icon, with the name as a tooltip, for where room is tight. */
  compact?: boolean;
}

export function EisenTag(props: Props) {
  const tagName = eisenName(props.eisen);
  const tagClass = eisenToClass(props.eisen);
  if (props.compact) {
    return (
      <SlimChip
        label={eisenIcon(props.eisen)}
        title={tagName}
        color={tagClass}
      />
    );
  }
  return <SlimChip label={tagName} color={tagClass} />;
}

function eisenToClass(eisen: Eisen) {
  switch (eisen) {
    case Eisen.REGULAR:
      return "default";
    case Eisen.IMPORTANT:
      return "success";
    case Eisen.URGENT:
      return "warning";
    case Eisen.IMPORTANT_AND_URGENT:
      return "error";
  }
}
