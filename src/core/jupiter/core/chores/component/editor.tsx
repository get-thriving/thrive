import type {
  Aspect,
  Chapter,
  Contact,
  Chore,
  Goal,
  Tag,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
} from "@mui/material";

import { aDateToDate } from "#/core/common/adate";
import { entityLinkStd } from "#/core/common/entity-link";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { RecurringTaskGenParamsBlock } from "#/core/common/component/recurring-task-gen-params-block";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { SlimChip } from "#/core/infra/component/chips";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface ChoreEditorProps {
  chore: Chore;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  aspect: Aspect;
  chapter: Chapter | null;
  goal: Goal | null;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
}

export function ChoreEditor(props: ChoreEditorProps) {
  const isBigScreen = useBigScreen();
  const { chore, tags, contacts, allTags, allContacts, aspect, chapter, goal } =
    props;

  return (
    <SectionCard title="Properties">
      <Stack direction="row" useFlexGap spacing={1}>
        <FormControl fullWidth sx={{ flexGrow: 3 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!props.inputsEnabled}
            defaultValue={chore.name}
          />
        </FormControl>

        <FormControl sx={{ flexGrow: 1 }}>
          <IsKeySelect
            name="isKey"
            defaultValue={chore.is_key}
            inputsEnabled={props.inputsEnabled}
          />
        </FormControl>
      </Stack>

      <Stack direction={isBigScreen ? "row" : "column"} useFlexGap spacing={1}>
        <FormControl sx={{ flexGrow: 2 }}>
          <TagsEditor
            name="tags"
            aloneOnLine
            allTags={allTags}
            defaultValue={tags.map((tag) => tag.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.CHORE, chore.ref_id)}
          />
        </FormControl>

        <FormControl sx={{ flexGrow: 2 }}>
          <ContactsEditor
            name="contacts_names"
            aloneOnLine
            allContacts={allContacts}
            defaultValue={contacts.map((contact) => contact.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.CHORE, chore.ref_id)}
          />
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <SlimChip label={`Aspect: ${aspect.name}`} color="default" />
        {chapter !== null && (
          <SlimChip label={`Chapter: ${chapter.name}`} color="default" />
        )}
        {goal !== null && (
          <SlimChip label={`Goal: ${goal.name}`} color="default" />
        )}
      </Stack>

      <RecurringTaskGenParamsBlock
        inputsEnabled={props.inputsEnabled}
        allowSkipRule
        period={chore.gen_params.period}
        eisen={chore.gen_params.eisen}
        difficulty={chore.gen_params.difficulty}
        actionableFromDay={chore.gen_params.actionable_from_day}
        actionableFromMonth={chore.gen_params.actionable_from_month}
        dueAtDay={chore.gen_params.due_at_day}
        dueAtMonth={chore.gen_params.due_at_month}
        skipRule={chore.gen_params.skip_rule}
      />

      <FormControl fullWidth>
        <FormControlLabel
          control={
            <Switch
              name="mustDo"
              readOnly={!props.inputsEnabled}
              defaultChecked={chore.must_do}
            />
          }
          label="Must Do In Vacation"
        />
      </FormControl>

      <Stack spacing={2} direction={isBigScreen ? "row" : "column"}>
        <FormControl fullWidth>
          <InputLabel id="startAtDate" shrink>
            Start At Date [Optional]
          </InputLabel>
          <OutlinedInput
            label="Start At Date [Optional]"
            name="startAtDate"
            readOnly={!props.inputsEnabled}
            defaultValue={
              chore.start_at_date
                ? aDateToDate(chore.start_at_date).toISODate()
                : ""
            }
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="endAtDate" shrink>
            End At Date [Optional]
          </InputLabel>
          <OutlinedInput
            label="End At Date [Optional]"
            name="endAtDate"
            readOnly={!props.inputsEnabled}
            defaultValue={
              chore.end_at_date
                ? aDateToDate(chore.end_at_date).toISODate()
                : ""
            }
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}
