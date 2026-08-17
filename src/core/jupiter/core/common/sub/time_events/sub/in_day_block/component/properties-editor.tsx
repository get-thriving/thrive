import type { TimeEventInDayBlock, Timezone } from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

import { TimeEventParamsSource } from "#/core/common/sub/time_events/component/params-source";
import { timeEventInDayBlockParamsToTimezone } from "#/core/common/sub/time_events/time-event";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface TimeEventInDayBlockPropertiesEditorProps {
  title: string;
  name: string;
  inDayBlock: TimeEventInDayBlock;
  timezone: Timezone;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionData?: SomeErrorNoData;
}

export function TimeEventInDayBlockPropertiesEditor(
  props: TimeEventInDayBlockPropertiesEditorProps,
) {
  const blockParamsInTz = timeEventInDayBlockParamsToTimezone(
    {
      startDate: props.inDayBlock.start_date,
      startTimeInDay: props.inDayBlock.start_time_in_day,
    },
    props.timezone,
  );
  const [startDate, setStartDate] = useState(blockParamsInTz.startDate!);
  const [startTimeInDay, setStartTimeInDay] = useState(
    blockParamsInTz.startTimeInDay!,
  );
  const [durationMins, setDurationMins] = useState(
    props.inDayBlock.duration_mins,
  );

  useEffect(() => {
    const nextParams = timeEventInDayBlockParamsToTimezone(
      {
        startDate: props.inDayBlock.start_date,
        startTimeInDay: props.inDayBlock.start_time_in_day,
      },
      props.timezone,
    );
    setStartDate(nextParams.startDate!);
    setStartTimeInDay(nextParams.startTimeInDay!);
    setDurationMins(props.inDayBlock.duration_mins);
  }, [props.inDayBlock, props.timezone]);

  return (
    <>
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <SectionCard
        id="time-event-in-day-block-properties"
        title={props.title}
        actions={
          <SectionActions
            id="time-event-in-day-block-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Save",
                    value: "update-time-event",
                    highlight: true,
                  }),
                  ActionSingle({
                    text: "Remove Event",
                    value: "remove-time-event",
                  }),
                ],
              }),
            ]}
          />
        }
      >
        <input
          type="hidden"
          name="timeEventRefId"
          value={props.inDayBlock.ref_id}
        />
        <input type="hidden" name="userTimezone" value={props.timezone} />

        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            readOnly={true}
            defaultValue={props.name}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!props.inputsEnabled}
            disabled={!props.inputsEnabled}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FieldError actionResult={props.actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startTimeInDay" shrink margin="dense">
            Start Time
          </InputLabel>
          <OutlinedInput
            type="time"
            label="startTimeInDay"
            name="startTimeInDay"
            readOnly={!props.inputsEnabled}
            value={startTimeInDay}
            onChange={(e) => setStartTimeInDay(e.target.value)}
          />

          <FieldError
            actionResult={props.actionData}
            fieldName="/start_time_in_day"
          />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup variant="outlined" disabled={!props.inputsEnabled}>
            <Button
              disabled={!props.inputsEnabled}
              variant={durationMins === 15 ? "contained" : "outlined"}
              onClick={() => setDurationMins(15)}
            >
              15m
            </Button>
            <Button
              disabled={!props.inputsEnabled}
              variant={durationMins === 30 ? "contained" : "outlined"}
              onClick={() => setDurationMins(30)}
            >
              30m
            </Button>
            <Button
              disabled={!props.inputsEnabled}
              variant={durationMins === 60 ? "contained" : "outlined"}
              onClick={() => setDurationMins(60)}
            >
              60m
            </Button>
          </ButtonGroup>

          <FormControl fullWidth>
            <InputLabel id="durationMins" shrink margin="dense">
              Duration (Mins)
            </InputLabel>
            <OutlinedInput
              type="number"
              label="Duration (Mins)"
              name="durationMins"
              readOnly={!props.inputsEnabled}
              value={durationMins}
              onChange={(e) => {
                if (Number.isNaN(parseInt(e.target.value, 10))) {
                  setDurationMins(0);
                  e.preventDefault();
                  return;
                }

                return setDurationMins(parseInt(e.target.value, 10));
              }}
            />

            <FieldError
              actionResult={props.actionData}
              fieldName="/duration_mins"
            />
          </FormControl>
        </Stack>
      </SectionCard>
    </>
  );
}
