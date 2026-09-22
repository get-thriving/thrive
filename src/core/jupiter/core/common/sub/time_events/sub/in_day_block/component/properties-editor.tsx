import type { TimeEventInDayBlock, Timezone } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";

import { TimeEventBuffersEditor } from "#/core/common/sub/time_events/component/buffers-editor";
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
import { DurationMinsSelect } from "#/core/common/component/duration-mins-select";

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
  const [bufferBeforeMins, setBufferBeforeMins] = useState(
    props.inDayBlock.buffer_before_mins ?? null,
  );
  const [bufferAfterMins, setBufferAfterMins] = useState(
    props.inDayBlock.buffer_after_mins ?? null,
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
    setBufferBeforeMins(props.inDayBlock.buffer_before_mins ?? null);
    setBufferAfterMins(props.inDayBlock.buffer_after_mins ?? null);
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

        <DurationMinsSelect
          name="durationMins"
          inputsEnabled={props.inputsEnabled}
          value={durationMins}
          onChange={(newDurationMins) => setDurationMins(newDurationMins ?? 0)}
          actionData={props.actionData}
          fieldName="/duration_mins"
        />

        <TimeEventBuffersEditor
          inputsEnabled={props.inputsEnabled}
          bufferBeforeMins={bufferBeforeMins}
          bufferAfterMins={bufferAfterMins}
          onBufferBeforeMinsChange={setBufferBeforeMins}
          onBufferAfterMinsChange={setBufferAfterMins}
          actionResult={props.actionData}
        />
      </SectionCard>
    </>
  );
}
