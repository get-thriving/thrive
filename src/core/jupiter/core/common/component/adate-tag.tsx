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
