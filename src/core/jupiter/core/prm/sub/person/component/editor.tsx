import type {
  Circle,
  Contact,
  Person,
  Tag,
  UserLight,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useMemo } from "react";

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
  personCircles: Array<Circle>;
  circleRefIds: Array<string>;
  maxCirclesPerPerson: number;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  entityOwner?: UserLight;
  actionResult?: ActionResult<unknown>;
}

function mergeForeignCircles(
  viewerCircles: Array<Circle>,
  personCircles: Array<Circle>,
  circleRefIds: Array<string>,
): Array<Circle> {
  const byRefId = new Map(viewerCircles.map((c) => [c.ref_id, c]));
  for (const circle of personCircles) {
    if (!byRefId.has(circle.ref_id)) {
      byRefId.set(circle.ref_id, circle);
    }
  }
  // Ensure every selected ref id has a display entry when available.
  for (const refId of circleRefIds) {
    if (!byRefId.has(refId)) {
      const fromPerson = personCircles.find((c) => c.ref_id === refId);
      if (fromPerson) {
        byRefId.set(refId, fromPerson);
      }
    }
  }
  return Array.from(byRefId.values());
}

export function PersonEditor(props: PersonEditorProps) {
  const isBigScreen = useBigScreen();
  const { person, contact, tags, allTags, circleRefIds } = props;

  // Shared persons may reference circles from another workspace.
  // Include those for display, but keep associations read-only.
  const circleAssociationsInWorkspace = circleRefIds.every((refId) =>
    props.allCircles.some((circle) => circle.ref_id === refId),
  );
  const allCircles = useMemo(
    () =>
      mergeForeignCircles(
        props.allCircles,
        props.personCircles,
        props.circleRefIds,
      ),
    [props.allCircles, props.personCircles, props.circleRefIds],
  );

  return (
    <>
      <Stack direction={isBigScreen ? "row" : "column"} spacing={1}>
        <FormControl fullWidth sx={{ flexGrow: 3 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!props.inputsEnabled}
            disabled={!props.inputsEnabled}
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
            linkedTags={tags}
            defaultValue={tags.map((tag) => tag.ref_id)}
            inputsEnabled={props.inputsEnabled}
            entityOwnerRefId={props.entityOwner?.ref_id}
            owner={entityLinkStd(NamedEntityTag.PERSON, person.ref_id)}
          />
        </FormControl>
      </Stack>

      <CircleMultiSelect
        name="circleRefIds"
        label="Circles"
        inputsEnabled={props.inputsEnabled && circleAssociationsInWorkspace}
        disabled={!circleAssociationsInWorkspace}
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
