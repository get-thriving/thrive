import type {
  Contact,
  ScheduleEventFullDays,
  ScheduleStreamSummary,
  Tag,
  TimeEventFullDaysBlock,
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

interface ScheduleEventFullDaysEditorProps {
  scheduleEventFullDays: ScheduleEventFullDays;
  timeEventFullDaysBlock: TimeEventFullDaysBlock;
  allScheduleStreams: Array<ScheduleStreamSummary>;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  inputsEnabled: boolean;
  corePropertyEditable: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
  durationDays?: number;
  onDurationDaysChange?: (value: number) => void;
}

export function ScheduleEventFullDaysEditor(
  props: ScheduleEventFullDaysEditorProps,
) {
  const isBigScreen = useBigScreen();
  const {
    scheduleEventFullDays,
    timeEventFullDaysBlock,
    allScheduleStreams,
    tags,
    contacts,
    allTags,
    allContacts,
  } = props;
  const editable = props.inputsEnabled && props.corePropertyEditable;
  const durationDays =
    props.durationDays ?? timeEventFullDaysBlock.duration_days;

  const allScheduleStreamsByRefId = new Map(
    allScheduleStreams.map((st) => [st.ref_id, st]),
  );
  const selectedScheduleStream = allScheduleStreamsByRefId.get(
    scheduleEventFullDays.schedule_stream_ref_id,
  );

  return (
    <SectionCard
      id="schedule-event-full-days-properties"
      title="Properties"
      actions={
        props.inputsEnabled ? (
          <SectionActions
            id="schedule-event-full-days-properties"
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

      <Stack direction={isBigScreen ? "row" : "column"} spacing={2} useFlexGap>
        <FormControl fullWidth={!isBigScreen} sx={{ flexGrow: 1 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            readOnly={!editable}
            defaultValue={scheduleEventFullDays.name}
          />
          <FieldError actionResult={props.actionResult} fieldName="/name" />
        </FormControl>
      </Stack>

      <Stack direction={isBigScreen ? "row" : "column"} useFlexGap gap={2}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <TagsEditor
            name="tags_names"
            allTags={allTags}
            defaultValue={tags.map((t) => t.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(
              NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS,
              scheduleEventFullDays.ref_id,
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
              NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS,
              scheduleEventFullDays.ref_id,
            )}
            aloneOnLine={!isBigScreen}
          />
        </FormControl>
      </Stack>

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
          defaultValue={timeEventFullDaysBlock.start_date}
        />

        <FieldError actionResult={props.actionResult} fieldName="/start_date" />
      </FormControl>

      <Stack spacing={2} direction="row">
        <ButtonGroup variant="outlined" disabled={!editable}>
          <Button
            disabled={!editable}
            variant={durationDays === 1 ? "contained" : "outlined"}
            onClick={() => props.onDurationDaysChange?.(1)}
          >
            1D
          </Button>
          <Button
            disabled={!editable}
            variant={durationDays === 3 ? "contained" : "outlined"}
            onClick={() => props.onDurationDaysChange?.(3)}
          >
            3d
          </Button>
          <Button
            disabled={!editable}
            variant={durationDays === 7 ? "contained" : "outlined"}
            onClick={() => props.onDurationDaysChange?.(7)}
          >
            7d
          </Button>
        </ButtonGroup>

        <FormControl fullWidth>
          <InputLabel id="durationDays" shrink margin="dense">
            Duration (Days)
          </InputLabel>
          <OutlinedInput
            type="number"
            label="Duration (Days)"
            name="durationDays"
            readOnly={!editable}
            value={durationDays}
            onChange={(e) =>
              props.onDurationDaysChange?.(parseInt(e.target.value, 10))
            }
          />

          <FieldError
            actionResult={props.actionResult}
            fieldName="/duration_days"
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}
