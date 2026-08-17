import type { ADate } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

import { ADateTag } from "#/core/common/component/adate-tag";

interface Props {
  generatedCount: number;
  doneCount: number;
  nextDueDate: ADate;
}

export function RecurringTaskPeriodProgress(props: Props) {
  return (
    <>
      <Typography color="text.secondary">
        ({props.doneCount} done / {props.generatedCount} generated)
      </Typography>
      <ADateTag label="Due" date={props.nextDueDate} />
    </>
  );
}
