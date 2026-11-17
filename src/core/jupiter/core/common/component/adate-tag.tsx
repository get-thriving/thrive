import type { ADate } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { aDateToDate } from "#/core/common/adate";

interface Props {
  label: string;
  date: ADate;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  /** Just a short date, outlined, with the full label and date as a tooltip, for where room is tight. */
  compact?: boolean;
}

export function ADateTag(props: Props) {
  if (props.compact) {
    const date = aDateToDate(props.date).setLocale("en-gb");
    return (
      <SlimChip
        label={date.toFormat("d LLL")}
        title={`${props.label} ${date.toLocaleString()}`}
        variant="outlined"
        color={props.color ?? "info"}
      />
    );
  }
  return (
    <SlimChip
      label={`${props.label} ${aDateToDate(props.date)
        .setLocale("en-gb")
        .toLocaleString()}`}
      color={props.color ?? "info"}
    />
  );
}
