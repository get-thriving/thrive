import type { Contact, Tag, Vacation } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

import { aDateToDate } from "#/core/common/adate";
import { entityLinkStd } from "#/core/common/entity-link";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface VacationEditorProps {
  vacation: Vacation;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function VacationEditor(props: VacationEditorProps) {
  const isBigScreen = useBigScreen();
  const { vacation, tags, contacts, allTags, allContacts } = props;

  return (
    <SectionCard
      title="Properties"
      actions={
        <SectionActions
          id="vacation-update"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={[
            ActionSingle({
              id: "vacation-update",
              text: "Save",
              value: "update",
              highlight: true,
            }),
          ]}
        />
      }
    >
      <Stack direction="row" spacing={1}>
        <FormControl fullWidth sx={{ flexGrow: 3 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            readOnly={!props.inputsEnabled}
            disabled={!props.inputsEnabled}
            defaultValue={vacation.name}
          />
          <FieldError actionResult={props.actionResult} fieldName="/name" />
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
            owner={entityLinkStd(NamedEntityTag.VACATION, vacation.ref_id)}
          />
        </FormControl>

        <FormControl sx={{ flexGrow: 2 }}>
          <ContactsEditor
            name="contacts_names"
            aloneOnLine
            allContacts={allContacts}
            defaultValue={contacts.map((contact) => contact.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.VACATION, vacation.ref_id)}
          />
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <InputLabel id="startDate" shrink>
          Start Date
        </InputLabel>
        <OutlinedInput
          type="date"
          notched
          label="startDate"
          defaultValue={aDateToDate(vacation.start_date).toFormat("yyyy-MM-dd")}
          name="startDate"
          readOnly={!props.inputsEnabled}
          disabled={!props.inputsEnabled}
        />

        <FieldError actionResult={props.actionResult} fieldName="/start_date" />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="endDate" shrink>
          End Date
        </InputLabel>
        <OutlinedInput
          type="date"
          notched
          label="endDate"
          defaultValue={aDateToDate(vacation.end_date).toFormat("yyyy-MM-dd")}
          name="endDate"
          readOnly={!props.inputsEnabled}
          disabled={!props.inputsEnabled}
        />

        <FieldError actionResult={props.actionResult} fieldName="/end_date" />
      </FormControl>
    </SectionCard>
  );
}
