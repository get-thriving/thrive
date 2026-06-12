import type {
  Contact,
  ScheduleEventInDay,
  ScheduleStreamSummary,
  Tag,
  TimeEventInDayBlock,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

import { entityLinkStd } from "#/core/common/entity-link";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { ScheduleStreamSelect } from "#/core/schedule/component/select";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface ScheduleEventInDayEditorProps {
  scheduleEventInDay: ScheduleEventInDay;
  timeEventInDayBlock: TimeEventInDayBlock;
  allScheduleStreams: Array<ScheduleStreamSummary>;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  inputsEnabled: boolean;
  corePropertyEditable: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
  startDate: string;
  startTimeInDay: string;
  durationMins: number;
  onStartDateChange?: (value: string) => void;
  onStartTimeInDayChange?: (value: string) => void;
  onDurationMinsChange?: (value: number) => void;
}

export function ScheduleEventInDayEditor(props: ScheduleEventInDayEditorProps) {
  const isBigScreen = useBigScreen();
  const {
    scheduleEventInDay,
    tags,
    contacts,
    allTags,
    allContacts,
    allScheduleStreams,
    startDate,
    startTimeInDay,
    durationMins,
  } = props;
  const editable = props.inputsEnabled && props.corePropertyEditable;

  const allScheduleStreamsByRefId = new Map(
    allScheduleStreams.map((st) => [st.ref_id, st]),
  );
  const selectedScheduleStream = allScheduleStreamsByRefId.get(
    scheduleEventInDay.schedule_stream_ref_id,
  );

  return (
    <SectionCard
      id="schedule-event-in-day-properties"
      title="Properties"
      actions={
        props.inputsEnabled ? (
          <SectionActions
            id="schedule-event-in-day-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Save",
                    value: "update",
                    highlight: true,
                    disabled: !props.corePropertyEditable,
                  }),
                  ActionSingle({
                    text: "Change Stream",
                    value: "change-schedule-stream",
                    disabled: !props.corePropertyEditable,
                  }),
                ],
              }),
            ]}
          />
        ) : undefined
      }
    >
      <input
        type="hidden"
        name="userTimezone"
        value={props.topLevelInfo.user.timezone}
      />
      <FormControl fullWidth>
        <InputLabel id="scheduleStreamRefId">Schedule Stream</InputLabel>
        {selectedScheduleStream ? (
          <ScheduleStreamSelect
            labelId="scheduleStreamRefId"
            label="Schedule Stream"
            name="scheduleStreamRefId"
            readOnly={!editable}
            allScheduleStreams={allScheduleStreams}
            defaultValue={selectedScheduleStream}
          />
        ) : (
          <OutlinedInput label="Schedule Stream" readOnly disabled value="—" />
        )}
        <FieldError
          actionResult={props.actionResult}
          fieldName="/schedule_stream_ref_id"
        />
      </FormControl>

      <FormControl fullWidth={!isBigScreen} sx={{ flexGrow: 1 }}>
        <InputLabel id="name">Name</InputLabel>
        <OutlinedInput
          label="name"
          name="name"
          readOnly={!editable}
          defaultValue={scheduleEventInDay.name}
        />
        <FieldError actionResult={props.actionResult} fieldName="/name" />
      </FormControl>

      <Stack direction={isBigScreen ? "row" : "column"} useFlexGap gap={2}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <TagsEditor
            name="tags_names"
            allTags={allTags}
            defaultValue={tags.map((t) => t.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(
              NamedEntityTag.SCHEDULE_EVENT_IN_DAY,
              scheduleEventInDay.ref_id,
            )}
            aloneOnLine={!isBigScreen}
          />
        </FormControl>

        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <ContactsEditor
            name="contacts_names"
            allContacts={allContacts}
            defaultValue={contacts.map((contact) => contact.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(
              NamedEntityTag.SCHEDULE_EVENT_IN_DAY,
              scheduleEventInDay.ref_id,
            )}
            aloneOnLine={!isBigScreen}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" useFlexGap gap={2}>
        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!editable}
            disabled={!editable}
            value={startDate}
            onChange={(e) => props.onStartDateChange?.(e.target.value)}
          />

          <FieldError
            actionResult={props.actionResult}
            fieldName="/start_date"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startTimeInDay" shrink margin="dense">
            Start Time
          </InputLabel>
          <OutlinedInput
            type="time"
            label="startTimeInDay"
            name="startTimeInDay"
            readOnly={!editable}
            value={startTimeInDay}
            onChange={(e) => props.onStartTimeInDayChange?.(e.target.value)}
          />

          <FieldError
            actionResult={props.actionResult}
            fieldName="/start_time_in_day"
          />
        </FormControl>
      </Stack>

      <Stack spacing={2} direction="row">
        <ButtonGroup variant="outlined" disabled={!editable}>
          <Button
            disabled={!editable}
            variant={durationMins === 15 ? "contained" : "outlined"}
            onClick={() => props.onDurationMinsChange?.(15)}
          >
            15m
          </Button>
          <Button
            disabled={!editable}
            variant={durationMins === 30 ? "contained" : "outlined"}
            onClick={() => props.onDurationMinsChange?.(30)}
          >
            30m
          </Button>
          <Button
            disabled={!editable}
            variant={durationMins === 60 ? "contained" : "outlined"}
            onClick={() => props.onDurationMinsChange?.(60)}
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
            readOnly={!editable}
            value={durationMins}
            onChange={(e) => {
              if (Number.isNaN(parseInt(e.target.value, 10))) {
                props.onDurationMinsChange?.(0);
                return;
              }
              props.onDurationMinsChange?.(parseInt(e.target.value, 10));
            }}
          />

          <FieldError
            actionResult={props.actionResult}
            fieldName="/duration_mins"
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}
