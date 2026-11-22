import { Eisen } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { eisenName } from "#/core/common/eisen";

interface Props {
  eisen: Eisen;
  /** Outlined, with the colour as the text, for where chips are many. */
  outlined?: boolean;
}

export function EisenTag(props: Props) {
  const tagName = eisenName(props.eisen);
  const tagClass = eisenToClass(props.eisen);
  return (
    <SlimChip
      label={tagName}
      color={tagClass}
      variant={props.outlined ? "outlined" : "filled"}
    />
  );
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
