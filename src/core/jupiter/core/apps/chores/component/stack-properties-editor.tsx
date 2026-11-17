import type {
  Aspect,
  AspectSummary,
  Chapter,
  ChapterSummary,
  Contact,
  Goal,
  GoalSummary,
  Chore,
  ChoreStack,
  LifePlan,
  Location,
  MilestoneSummary,
  Tag,
  UserLight,
} from "@jupiter/webapi-client";
import { NamedEntityTag, WorkspaceFeature } from "@jupiter/webapi-client";
import LaunchIcon from "@mui/icons-material/Launch";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useMemo, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import { entityLinkStd } from "#/core/common/entity-link";
import { PeriodSelect } from "#/core/common/component/period-select";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { EntityLocationMapSection } from "#/core/common/sub/locations/component/entity-location-map-section";
import { LocationsEditor } from "#/core/common/sub/locations/component/locations-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ChoreSelectMultiple } from "#/core/apps/chores/component/select-multiple";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import { constructFieldName } from "#/core/infra/field-names";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { StrataSection } from "#/core/infra/component/strata-section";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

interface ChoreStackPropertiesEditorProps {
  title: string;
  showLinkToChoreStack?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan | null;
  allAspects: AspectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  aspect?: Aspect | null;
  chapter?: Chapter | null;
  goal?: Goal | null;
  allChores: Chore[];
  chores: Chore[];
  allTags: Array<Tag>;
  tags: Array<Tag>;
  allContacts: Array<Contact>;
  contacts: Array<Contact>;
  location?: Location | null;
  inputsEnabled: boolean;
  periodEditable?: boolean;
  entityOwner?: UserLight;
  choreStack: ChoreStack;
  actionData?: SomeErrorNoData;
}

export function ChoreStackPropertiesEditor(
  props: ChoreStackPropertiesEditorProps,
) {
  const isBigScreen = useBigScreen();
  const birthdayDate = props.lifePlan
    ? lifePlanBirthdayDate(props.lifePlan)
    : null;
  const [selectedAspectRefId, setSelectedAspectRefId] = useState(
    props.choreStack.aspect_ref_id,
  );
  const [selectedPeriod, setSelectedPeriod] = useState(props.choreStack.period);
  const periodEditable = props.periodEditable ?? false;

  const lifePlanAssociationsInWorkspace = props.allAspects.some(
    (aspect) => aspect.ref_id === props.choreStack.aspect_ref_id,
  );
  const allAspects = useMemo(
    () =>
      mergeForeignAspectSummary(
        props.allAspects,
        props.aspect,
        props.choreStack.aspect_ref_id,
      ),
    [props.allAspects, props.aspect, props.choreStack.aspect_ref_id],
  );
  const allChapters = useMemo(
    () =>
      mergeForeignChapterSummary(
        props.allChapters,
        props.chapter,
        props.choreStack.chapter_ref_id,
      ),
    [props.allChapters, props.chapter, props.choreStack.chapter_ref_id],
  );
  const allGoals = useMemo(
    () =>
      mergeForeignGoalSummary(
        props.allGoals,
        props.goal,
        props.choreStack.goal_ref_id,
      ),
    [props.allGoals, props.goal, props.choreStack.goal_ref_id],
  );

  return (
    <>
      <StrataSection
        id="chore-stack-properties-section"
        fixed
        title={props.title}
        actions={
          <SectionActions
            id="chore-stack-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionSingle({
                id: "chore-stack-update",
                text: "Save",
                value: constructIntentName(props.intentPrefix, "update"),
                highlight: true,
              }),
            ]}
            extraActions={
              props.showLinkToChoreStack
                ? [
                    NavSingle({
                      text: "Chore Stack",
                      link: `/app/workspace/apps/chores/stacks/${props.choreStack.ref_id}`,
                      icon: <LaunchIcon />,
                    }),
                  ]
                : undefined
            }
          />
        }
      >
        <input
          type="hidden"
          name={constructFieldName(props.namePrefix, "refId")}
          value={props.choreStack.ref_id}
        />
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name={constructFieldName(props.namePrefix, "name")}
            readOnly={!props.inputsEnabled}
            disabled={!props.inputsEnabled}
            defaultValue={props.choreStack.name}
          />
          <FieldError actionResult={props.actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={props.inputsEnabled && periodEditable}
            value={selectedPeriod}
            onChange={(newPeriod) => {
              if (newPeriod === "none" || Array.isArray(newPeriod)) {
                return;
              }
              setSelectedPeriod(newPeriod);
            }}
          />
          <FieldError actionResult={props.actionData} fieldName="/period" />
        </FormControl>

        <FormControl fullWidth>
          <ChoreSelectMultiple
            name={constructFieldName(props.namePrefix, "choreRefIds")}
            label="Chores"
            allChores={props.allChores}
            defaultValue={props.chores.map((chore) => chore.ref_id)}
            filterPeriod={selectedPeriod}
            inputsEnabled={props.inputsEnabled}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName="/chore_ref_ids"
          />
        </FormControl>

        <Stack
          direction={isBigScreen ? "row" : "column"}
          useFlexGap
          spacing={1}
        >
          <FormControl fullWidth sx={{ flexGrow: 2, minWidth: 0 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={props.allTags}
              linkedTags={props.tags}
              defaultValue={props.tags.map((tag) => tag.ref_id)}
              inputsEnabled={props.inputsEnabled}
              entityOwnerRefId={props.entityOwner?.ref_id}
              owner={entityLinkStd(
                NamedEntityTag.CHORE_STACK,
                props.choreStack.ref_id,
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/tags_names"
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2, minWidth: 0 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={props.allContacts}
              linkedContacts={props.contacts}
              defaultValue={props.contacts.map((contact) => contact.ref_id)}
              inputsEnabled={props.inputsEnabled}
              entityOwnerRefId={props.entityOwner?.ref_id}
              owner={entityLinkStd(
                NamedEntityTag.CHORE_STACK,
                props.choreStack.ref_id,
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/contacts_names"
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2, minWidth: 0 }}>
            <LocationsEditor
              name="locations"
              aloneOnLine
              linkedLocation={props.location}
              inputsEnabled={props.inputsEnabled}
              entityOwnerRefId={props.entityOwner?.ref_id}
              owner={entityLinkStd(
                NamedEntityTag.CHORE_STACK,
                props.choreStack.ref_id,
              )}
            />
          </FormControl>
        </Stack>

        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={
                props.inputsEnabled && lifePlanAssociationsInWorkspace
              }
              aspectName={constructFieldName(props.namePrefix, "aspect")}
              chapterName={constructFieldName(props.namePrefix, "chapter")}
              goalName={constructFieldName(props.namePrefix, "goal")}
              allAspects={allAspects}
              aspectValue={selectedAspectRefId}
              onAspectChange={setSelectedAspectRefId}
              aspectDefaultValue={props.choreStack.aspect_ref_id}
              allChapters={allChapters}
              chapterDefaultValue={props.choreStack.chapter_ref_id}
              allGoals={allGoals}
              goalDefaultValue={props.choreStack.goal_ref_id}
              birthday={birthdayDate!}
              today={aDateToDate(props.topLevelInfo.today)}
              allMilestones={props.allMilestones}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/aspect_ref_id"
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/chapter_ref_id"
            />
            <FieldError
              actionResult={props.actionData}
              fieldName="/goal_ref_id"
            />
          </FormControl>
        )}
      </StrataSection>
      <EntityLocationMapSection location={props.location} />
    </>
  );
}

function constructIntentName(
  intentPrefix: string | undefined,
  intent: string,
): string {
  if (!intentPrefix) {
    return intent;
  }
  return `${intentPrefix}-${intent}`;
}

function mergeForeignAspectSummary(
  allAspects: AspectSummary[],
  aspect: Aspect | null | undefined,
  aspectRefId: string,
): AspectSummary[] {
  if (allAspects.some((entry) => entry.ref_id === aspectRefId)) {
    return allAspects;
  }
  if (
    aspect === undefined ||
    aspect === null ||
    aspect.ref_id !== aspectRefId
  ) {
    return allAspects;
  }
  return [
    ...allAspects,
    {
      ref_id: aspect.ref_id,
      parent_aspect_ref_id: null,
      name: aspect.name,
      order_of_child_aspects: [],
    },
  ];
}

function mergeForeignChapterSummary(
  allChapters: ChapterSummary[],
  chapter: Chapter | null | undefined,
  chapterRefId: string | null | undefined,
): ChapterSummary[] {
  if (
    chapterRefId === undefined ||
    chapterRefId === null ||
    allChapters.some((entry) => entry.ref_id === chapterRefId)
  ) {
    return allChapters;
  }
  if (
    chapter === undefined ||
    chapter === null ||
    chapter.ref_id !== chapterRefId
  ) {
    return allChapters;
  }
  return [
    ...allChapters,
    {
      ref_id: chapter.ref_id,
      name: chapter.name,
      start_date: chapter.start_date,
      end_date: chapter.end_date,
      aspect_ref_id: chapter.aspect_ref_id,
    },
  ];
}

function mergeForeignGoalSummary(
  allGoals: GoalSummary[],
  goal: Goal | null | undefined,
  goalRefId: string | null | undefined,
): GoalSummary[] {
  if (
    goalRefId === undefined ||
    goalRefId === null ||
    allGoals.some((entry) => entry.ref_id === goalRefId)
  ) {
    return allGoals;
  }
  if (goal === undefined || goal === null || goal.ref_id !== goalRefId) {
    return allGoals;
  }
  return [
    ...allGoals,
    {
      ref_id: goal.ref_id,
      name: goal.name,
      aspect_ref_id: goal.aspect_ref_id,
      parent_goal_ref_id: goal.parent_goal_ref_id,
    },
  ];
}
