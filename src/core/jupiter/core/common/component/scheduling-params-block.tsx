import type { SchedulingParams } from "@jupiter/webapi-client";
import { Schedulability } from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
  MAX_SCHEDULING_EVENT_COUNT,
  MAX_SCHEDULING_EVENT_DURATION_MINS,
  MIN_SCHEDULING_EVENT_COUNT,
  MIN_SCHEDULING_EVENT_DURATION_MINS,
  schedulabilityName,
} from "#/core/common/scheduling-params";
import { DurationMinsSelect } from "#/core/common/component/duration-mins-select";
import { FieldError } from "#/core/infra/component/errors";
import type { ActionResult } from "#/core/infra/action-result";

interface SchedulingParamsBlockProps {
  inputsEnabled: boolean;
  // Set when the block sits next to another one posting the same field names.
  namePrefix?: string;
  fieldsPrefix?: string;
  schedulingParams?: SchedulingParams | null;
  actionData?: ActionResult<unknown>;
}

/**
 * How the work an entity generates should be scheduled.
 *
 * Something like "no sweets today" is never placed in the calendar, and says
 * nothing more. Everything else takes up real time, so it always says how long
 * one block is and how many of them it needs.
 */
export function SchedulingParamsBlock(props: SchedulingParamsBlockProps) {
  const initialSchedulability =
    props.schedulingParams?.schedulability ?? Schedulability.SCHEDULABLE;
  const [schedulability, setSchedulability] = useState(initialSchedulability);
  useEffect(() => {
    setSchedulability(initialSchedulability);
  }, [initialSchedulability]);

  const initialEventDurationMins =
    props.schedulingParams?.event_duration_mins ??
    DEFAULT_SCHEDULING_EVENT_DURATION_MINS;
  const [eventDurationMins, setEventDurationMins] = useState<number | null>(
    initialEventDurationMins,
  );
  useEffect(() => {
    setEventDurationMins(initialEventDurationMins);
  }, [initialEventDurationMins]);

  const initialEventCount =
    props.schedulingParams?.event_count ?? DEFAULT_SCHEDULING_EVENT_COUNT;
  const [eventCount, setEventCount] = useState<number | null>(
    initialEventCount,
  );
  useEffect(() => {
    setEventCount(initialEventCount);
  }, [initialEventCount]);

  const isSchedulable = schedulability === Schedulability.SCHEDULABLE;

  return (
    <>
      <FormControl fullWidth>
        <FormLabel id="schedulability">Scheduling</FormLabel>
        <ToggleButtonGroup
          value={schedulability}
          exclusive
          fullWidth
          size="small"
          onChange={(_, newSchedulability) =>
            newSchedulability !== null && setSchedulability(newSchedulability)
          }
        >
          {Object.values(Schedulability).map((s) => (
            <ToggleButton key={s} value={s} disabled={!props.inputsEnabled}>
              {schedulabilityName(s)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <input
          type="hidden"
          name={constructFieldName(props.namePrefix, "schedulability")}
          value={schedulability}
        />
        <FieldError
          actionResult={props.actionData}
          fieldName={constructFieldErrorName(
            props.fieldsPrefix,
            "schedulability",
          )}
        />
      </FormControl>

      {isSchedulable && (
        <Stack spacing={2} useFlexGap direction="row">
          <DurationMinsSelect
            name={constructFieldName(
              props.namePrefix,
              "schedulingEventDurationMins",
            )}
            label="Event Duration (Mins)"
            inputsEnabled={props.inputsEnabled}
            value={eventDurationMins}
            onChange={setEventDurationMins}
            minMins={MIN_SCHEDULING_EVENT_DURATION_MINS}
            maxMins={MAX_SCHEDULING_EVENT_DURATION_MINS}
            actionData={props.actionData}
            fieldName={constructFieldErrorName(
              props.fieldsPrefix,
              "scheduling_event_duration_mins",
            )}
          />

          <FormControl sx={{ minWidth: "8rem" }}>
            <InputLabel id="schedulingEventCount" shrink margin="dense">
              Event Count
            </InputLabel>
            <OutlinedInput
              label="Event Count"
              name={constructFieldName(
                props.namePrefix,
                "schedulingEventCount",
              )}
              type="number"
              inputProps={{
                min: MIN_SCHEDULING_EVENT_COUNT,
                max: MAX_SCHEDULING_EVENT_COUNT,
              }}
              readOnly={!props.inputsEnabled}
              value={eventCount ?? ""}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                setEventCount(Number.isNaN(parsed) ? null : parsed);
              }}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "scheduling_event_count",
              )}
            />
          </FormControl>
        </Stack>
      )}
    </>
  );
}

function constructFieldName(
  namePrefix: string | undefined,
  fieldName: string,
): string {
  if (!namePrefix) {
    return fieldName;
  }
  return `${namePrefix}${
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  }`;
}

function constructFieldErrorName(
  fieldsPrefix: string | undefined,
  fieldName: string,
): string {
  if (!fieldsPrefix) {
    return `/${fieldName}`;
  }
  return `/${fieldsPrefix}_${fieldName}`;
}
