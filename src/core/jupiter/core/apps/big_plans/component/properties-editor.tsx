import type {
  Aspect,
  AspectSummary,
  BigPlan,
  BigPlanLoadResult,
  BigPlanSummary,
  Chapter,
  ChapterSummary,
  Contact,
  Goal,
  GoalSummary,
  LifePlan,
  Location,
  MilestoneSummary,
  Tag,
  UserLight,
} from "@jupiter/webapi-client";
import {
  BigPlanStatus,
  NamedEntityTag,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  CardActions,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useMemo, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import {
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
} from "#/core/common/suggested-date";
import { findActiveChaptersForSuggestions } from "#/core/apps/life_plan/sub/chapters/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { bigPlanDonePct } from "#/core/apps/big_plans/root";
import { BigPlanStatusBigTag } from "#/core/apps/big_plans/component/status-big-tag";
import { BigPlanDonePctBigTag } from "#/core/apps/big_plans/component/done-pct-big-tag";
import { BigPlanMultiSelect } from "#/core/apps/big_plans/component/multi-select";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { FieldError } from "#/core/infra/component/errors";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  constructFieldErrorName,
  constructFieldName,
} from "#/core/infra/field-names";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { LocationsEditor } from "#/core/common/sub/locations/component/locations-editor";
import { entityLinkStd } from "#/core/common/entity-link";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface BigPlanPropertiesEditorProps {
  title: string;
  showLinkToBigPlan?: boolean;
  showRefreshStats?: boolean;
  intentPrefix?: string;
  namePrefix?: string;
  fieldsPrefix?: string;
  topLevelInfo: TopLevelInfo;
  lifePlan: LifePlan | null;
  allAspects: AspectSummary[];
  allChapters: ChapterSummary[];
  allGoals: GoalSummary[];
  allMilestones: MilestoneSummary[];
  allBigPlans?: BigPlanSummary[];
  allTags?: Array<Tag>;
  tags?: Array<Tag>;
  allContacts?: Array<Contact>;
  contacts?: Array<Contact>;
  allLocations?: Array<Location>;
  location?: Location | null;
  inputsEnabled: boolean;
  entityOwner?: UserLight;
  bigPlan: BigPlan;
  bigPlanInfo: BigPlanLoadResult;
  actionData?: SomeErrorNoData;
}

export function BigPlanPropertiesEditor(props: BigPlanPropertiesEditorProps) {
  const milestonesLeft = props.bigPlanInfo.milestones.filter(
    (m) => aDateToDate(m.date) > aDateToDate(props.topLevelInfo.today),
  ).length;

  const birthday = props.lifePlan ? lifePlanBirthdayDate(props.lifePlan) : null;
  const today = aDateToDate(props.topLevelInfo.today);
  const [selectedAspectRefId, setSelectedAspectRefId] = useState(
    props.bigPlanInfo.aspect?.ref_id ?? "",
  );

  // Shared big plans may reference life-plan entities from another workspace.
  // Include those for display, but keep associations read-only.
  const lifePlanAssociationsInWorkspace = props.allAspects.some(
    (aspect) => aspect.ref_id === props.bigPlan.aspect_ref_id,
  );
  const allAspects = useMemo(
    () =>
      mergeForeignAspectSummary(
        props.allAspects,
        props.bigPlanInfo.aspect,
        props.bigPlan.aspect_ref_id,
      ),
    [props.allAspects, props.bigPlanInfo.aspect, props.bigPlan.aspect_ref_id],
  );
  const allChapters = useMemo(
    () =>
      mergeForeignChapterSummary(
        props.allChapters,
        props.bigPlanInfo.chapter,
        props.bigPlan.chapter_ref_id,
      ),
    [
      props.allChapters,
      props.bigPlanInfo.chapter,
      props.bigPlan.chapter_ref_id,
    ],
  );
  const allGoals = useMemo(
    () =>
      mergeForeignGoalSummary(
        props.allGoals,
        props.bigPlanInfo.goal,
        props.bigPlan.goal_ref_id,
      ),
    [props.allGoals, props.bigPlanInfo.goal, props.bigPlan.goal_ref_id],
  );

  const chaptersForSuggestions = useMemo(
    () =>
      birthday
        ? findActiveChaptersForSuggestions(
            allChapters.filter(
              (chapter) => chapter.aspect_ref_id === selectedAspectRefId,
            ),
            birthday,
            today,
            props.allMilestones,
          )
        : [],
    [allChapters, props.allMilestones, selectedAspectRefId, birthday, today],
  );

  const actions = [];
  if (props.showLinkToBigPlan) {
    actions.push(
      NavSingle({
        text: "Big Plan",
        icon: <LaunchIcon />,
        link: `/app/workspace/apps/big-plans/${props.bigPlan.ref_id}`,
      }),
    );
  }
  actions.push(
    ActionSingle({
      id: "big-plan-editor-save",
      text: "Save",
      value: constructIntentName(props.intentPrefix, "update"),
      highlight: true,
    }),
  );
  if (props.showRefreshStats) {
    actions.push(
      ActionSingle({
        text: "Refresh Stats",
        value: constructIntentName(props.intentPrefix, "refresh-stats"),
      }),
    );
  }

  return (
    <SectionCard
      title={props.title}
      actions={
        <SectionActions
          id="big-plan-editor"
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={actions}
        />
      }
    >
      <Stack spacing={2} useFlexGap>
        <input
          type="hidden"
          name={constructFieldName(props.namePrefix, "refId")}
          value={props.bigPlan.ref_id}
        />

        <Stack direction="row" spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name={constructFieldName(props.namePrefix, "name")}
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
              defaultValue={props.bigPlan.name}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "name")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name={constructFieldName(props.namePrefix, "isKey")}
              defaultValue={props.bigPlan.is_key}
              inputsEnabled={props.inputsEnabled}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" useFlexGap spacing={1}>
          {props.allTags && props.tags && (
            <FormControl sx={{ flexGrow: 2 }}>
              <TagsEditor
                name="tags"
                aloneOnLine
                allTags={props.allTags}
                defaultValue={props.tags.map((tag) => tag.ref_id)}
                inputsEnabled={props.inputsEnabled}
                entityOwnerRefId={props.entityOwner?.ref_id}
                owner={entityLinkStd(
                  NamedEntityTag.BIG_PLAN,
                  props.bigPlan.ref_id,
                )}
              />
            </FormControl>
          )}

          {props.allContacts && props.contacts && (
            <FormControl sx={{ flexGrow: 2 }}>
              <ContactsEditor
                name="contacts_names"
                aloneOnLine
                allContacts={props.allContacts}
                defaultValue={props.contacts.map((contact) => contact.ref_id)}
                inputsEnabled={props.inputsEnabled}
                entityOwnerRefId={props.entityOwner?.ref_id}
                owner={entityLinkStd(
                  NamedEntityTag.BIG_PLAN,
                  props.bigPlan.ref_id,
                )}
              />
            </FormControl>
          )}

          {props.allLocations && (
            <FormControl sx={{ flexGrow: 2 }}>
              <LocationsEditor
                name="location"
                aloneOnLine
                allLocations={props.allLocations}
                linkedLocation={props.location}
                defaultValue={props.location?.ref_id ?? null}
                inputsEnabled={props.inputsEnabled}
                entityOwnerRefId={props.entityOwner?.ref_id}
                owner={entityLinkStd(
                  NamedEntityTag.BIG_PLAN,
                  props.bigPlan.ref_id,
                )}
              />
            </FormControl>
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flexGrow: 1 }}>
            <BigPlanStatusBigTag status={props.bigPlan.status} />
            <input
              type="hidden"
              name={constructFieldName(props.namePrefix, "status")}
              value={props.bigPlan.status}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(props.fieldsPrefix, "status")}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <BigPlanDonePctBigTag
              donePct={bigPlanDonePct(props.bigPlan, props.bigPlanInfo.stats)}
              shouldShowMilestonesLeft={props.bigPlanInfo.milestones.length > 0}
              milestonesLeft={milestonesLeft}
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
              aspectDefaultValue={props.bigPlanInfo.aspect?.ref_id ?? ""}
              allChapters={allChapters}
              chapterDefaultValue={props.bigPlanInfo.chapter?.ref_id}
              allGoals={allGoals}
              goalDefaultValue={props.bigPlanInfo.goal?.ref_id}
              birthday={birthday!}
              today={aDateToDate(props.topLevelInfo.today)}
              allMilestones={props.allMilestones}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "aspect_ref_id",
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "chapter_ref_id",
              )}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "goal_ref_id",
              )}
            />
          </FormControl>
        )}

        {props.allBigPlans && (
          <FormControl fullWidth>
            <BigPlanMultiSelect
              name={constructFieldName(props.namePrefix, "dependencyRefIds")}
              label="Depends On"
              inputsEnabled={props.inputsEnabled}
              disabled={!props.inputsEnabled}
              allBigPlans={props.allBigPlans}
              exceptRefId={props.bigPlan.ref_id}
              defaultValue={props.bigPlan.dependency_ref_ids}
            />
            <FieldError
              actionResult={props.actionData}
              fieldName={constructFieldErrorName(
                props.fieldsPrefix,
                "dependency_ref_ids",
              )}
            />
          </FormControl>
        )}

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name={constructFieldName(props.namePrefix, "eisen")}
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.eisen}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(props.fieldsPrefix, "eisen")}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="difficulty">Difficulty</FormLabel>
          <DifficultySelect
            name={constructFieldName(props.namePrefix, "difficulty")}
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.difficulty}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(
              props.fieldsPrefix,
              "difficulty",
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink>
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "actionableDate")}
            label="actionableDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.actionable_date}
            suggestedDates={getSuggestedDatesForBigPlanActionableDate(
              props.topLevelInfo.today,
              undefined,
              chaptersForSuggestions,
            )}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(
              props.fieldsPrefix,
              "actionable_date",
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink>
            Due At [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name={constructFieldName(props.namePrefix, "dueDate")}
            label="dueDate"
            inputsEnabled={props.inputsEnabled}
            defaultValue={props.bigPlan.due_date}
            suggestedDates={getSuggestedDatesForBigPlanDueDate(
              props.topLevelInfo.today,
              undefined,
              chaptersForSuggestions,
            )}
          />
          <FieldError
            actionResult={props.actionData}
            fieldName={constructFieldErrorName(props.fieldsPrefix, "due_date")}
          />
        </FormControl>
      </Stack>

      <CardActions sx={{ paddingLeft: "0px", paddingRight: "0px" }}>
        <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
          {props.bigPlan.status === BigPlanStatus.NOT_STARTED && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "start")}
              >
                Start
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "block")}
              >
                Block
              </Button>
            </ButtonGroup>
          )}

          {props.bigPlan.status === BigPlanStatus.IN_PROGRESS && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "block")}
              >
                Block
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "stop")}
              >
                Stop
              </Button>
            </ButtonGroup>
          )}

          {props.bigPlan.status === BigPlanStatus.BLOCKED && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="contained"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-done")}
              >
                Mark Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "mark-not-done")}
              >
                Mark Not Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "restart")}
              >
                Restart
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "stop")}
              >
                Stop
              </Button>
            </ButtonGroup>
          )}

          {(props.bigPlan.status === BigPlanStatus.DONE ||
            props.bigPlan.status === BigPlanStatus.NOT_DONE) && (
            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="outlined"
                disabled={!props.inputsEnabled}
                type="submit"
                name="intent"
                value={constructIntentName(props.intentPrefix, "reactivate")}
              >
                Reactivate
              </Button>
            </ButtonGroup>
          )}
        </Stack>
      </CardActions>
    </SectionCard>
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
  // Detach from the foreign parent chain so tree helpers can still render it.
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
