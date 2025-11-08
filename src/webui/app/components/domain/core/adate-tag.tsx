import type { ADate } from "@jupiter/webapi-client";
import { SlimChip } from "@jupiter/core/jupiter/core/infra/components/chips";

import { aDateToDate } from "@jupiter/core/jupiter/core/adate";

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
}

export function ADateTag(props: Props) {
  return (
    <SlimChip
      label={`${props.label} ${aDateToDate(props.date)
        .setLocale("en-gb")
        .toLocaleString()}`}
      color={props.color ?? "info"}
    />
  );
}
