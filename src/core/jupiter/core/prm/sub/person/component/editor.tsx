import type { Circle, Contact, Person, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

import { entityLinkStd } from "#/core/common/entity-link";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import { RecurringTaskGenParamsBlock } from "#/core/common/component/recurring-task-gen-params-block";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { CircleMultiSelect } from "#/core/prm/sub/circle/components/multi-select";

interface PersonEditorProps {
  person: Person;
  contact: Contact;
  tags: Array<Tag>;
  allTags: Array<Tag>;
  allCircles: Array<Circle>;
  circleRefIds: Array<string>;
  maxCirclesPerPerson: number;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function PersonEditor(props: PersonEditorProps) {
  const isBigScreen = useBigScreen();
  const { person, contact, tags, allTags, allCircles, circleRefIds } = props;

  return (
    <>
      <Stack direction={isBigScreen ? "row" : "column"} spacing={1}>
        <FormControl fullWidth sx={{ flexGrow: 3 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!props.inputsEnabled}
            defaultValue={contact.name}
          />
          <FieldError actionResult={props.actionResult} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth sx={{ flexGrow: 2 }}>
          <TagsEditor
            name="tags"
            label={null}
            aloneOnLine={!isBigScreen}
            allTags={allTags}
            defaultValue={tags.map((tag) => tag.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.PERSON, person.ref_id)}
          />
        </FormControl>
      </Stack>

      <CircleMultiSelect
        name="circleRefIds"
        label="Circles"
        inputsEnabled={props.inputsEnabled}
        disabled={false}
        allCircles={allCircles}
        defaultValue={circleRefIds}
        maxSelections={props.maxCirclesPerPerson}
      />
      <FieldError
        actionResult={props.actionResult}
        fieldName="/circle_ref_ids"
      />

      <StandardDivider title="Catch Up" size="small" />

      <RecurringTaskGenParamsBlock
        namePrefix="catchUp"
        fieldsPrefix="catch_up"
        allowNonePeriod
        period={person.catch_up_params?.period ?? "none"}
        eisen={person.catch_up_params?.eisen}
        difficulty={person.catch_up_params?.difficulty}
        actionableFromDay={person.catch_up_params?.actionable_from_day}
        actionableFromMonth={person.catch_up_params?.actionable_from_month}
        dueAtDay={person.catch_up_params?.due_at_day}
        dueAtMonth={person.catch_up_params?.due_at_month}
        inputsEnabled={props.inputsEnabled}
        actionData={props.actionResult}
      />
    </>
  );
}
