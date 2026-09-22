import type {
  AspectSummary,
  BigPlanSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useMemo, useState } from "react";

import { BigPlanMultiSelect } from "#/core/apps/big_plans/component/multi-select";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
import { findActiveChaptersForSuggestions } from "#/core/apps/life_plan/sub/chapters/root";
import { TimePlanActivityFeasabilitySelect } from "#/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "#/core/apps/time_plans/sub/activity/component/kind-select";
import { aDateToDate } from "#/core/common/adate";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { SchedulingParamsBlock } from "#/core/common/component/scheduling-params-block";
import {
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
} from "#/core/common/suggested-date";
import type { ActionResult } from "#/core/infra/action-result";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import { CREATE_AND_ANOTHER_INTENT } from "#/core/infra/create-and-another";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

/** What the form needs loaded before it can show. */
export interface BigPlanCreateFormData {
  rootAspect: AspectSummary | null;
  lifePlan: LifePlan | null;
  allAspects: Array<AspectSummary> | null;
  allChapters: Array<ChapterSummary> | null;
  allGoals: Array<GoalSummary> | null;
  allMilestones: Array<MilestoneSummary> | null;
  allBigPlans: Array<BigPlanSummary> | null;
  // The plan the big plan is made for, if any: its dates start out as the
  // plan's, and the form asks what kind of activity it is there.
  timePlan: TimePlan | null;
}

export interface BigPlanCreateFormProps extends BigPlanCreateFormData {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  actionResult: ActionResult<unknown> | undefined;
}

/** The form for a new big plan, posting "create" or "create and another". */
export function BigPlanCreateForm(props: BigPlanCreateFormProps) {
  const { topLevelInfo, inputsEnabled, actionResult } = props;

  const birthdayDate = props.lifePlan
    ? lifePlanBirthdayDate(props.lifePlan)
    : null;
  const todayDate = aDateToDate(topLevelInfo.today);
  const [selectedAspectRefId, setSelectedAspectRefId] = useState(
    props.rootAspect?.ref_id ?? "",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulty.EASY,
  );
  const chaptersForSuggestions = useMemo(
    () =>
      birthdayDate
        ? findActiveChaptersForSuggestions(
            (props.allChapters ?? []).filter(
              (chapter) => chapter.aspect_ref_id === selectedAspectRefId,
            ),
            birthdayDate,
            todayDate,
            props.allMilestones ?? [],
          )
        : [],
    [
      props.allChapters,
      props.allMilestones,
      selectedAspectRefId,
      birthdayDate,
      todayDate,
    ],
  );

  return (
    <>
      <GlobalError actionResult={actionResult} />
      <SectionCard
        title="New Big Plan"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="big-plan-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "big-plan-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "big-plan-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
            <FieldError actionResult={actionResult} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={false}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionResult} fieldName="/is_key" />
          </FormControl>
        </Stack>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allAspects={props.allAspects ?? []}
              aspectValue={selectedAspectRefId}
              onAspectChange={setSelectedAspectRefId}
              aspectDefaultValue={props.rootAspect?.ref_id ?? ""}
              allChapters={props.allChapters ?? []}
              allGoals={props.allGoals ?? []}
              birthday={birthdayDate!}
              today={todayDate}
              allMilestones={props.allMilestones ?? []}
            />
            <FieldError
              actionResult={actionResult}
              fieldName="/aspect_ref_id"
            />
            <FieldError
              actionResult={actionResult}
              fieldName="/chapter_ref_id"
            />
            <FieldError actionResult={actionResult} fieldName="/goal_ref_id" />
          </FormControl>
        )}

        <FormControl fullWidth>
          <BigPlanMultiSelect
            name="dependencyRefIds"
            label="Depends On"
            inputsEnabled={inputsEnabled}
            disabled={!inputsEnabled}
            allBigPlans={props.allBigPlans ?? []}
          />
          <FieldError
            actionResult={actionResult}
            fieldName="/dependency_ref_ids"
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="eisen">Eisenhower</FormLabel>
          <EisenhowerSelect
            name="eisen"
            defaultValue={Eisen.REGULAR}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionResult} fieldName="/eisen" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="difficulty">Difficulty</FormLabel>
          <DifficultySelect
            name="difficulty"
            defaultValue={Difficulty.EASY}
            inputsEnabled={inputsEnabled}
            onChange={setSelectedDifficulty}
          />
          <FieldError actionResult={actionResult} fieldName="/difficulty" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink margin="dense">
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="actionableDate"
            label="actionableDate"
            inputsEnabled={inputsEnabled}
            defaultValue={props.timePlan?.start_date}
            suggestedDates={getSuggestedDatesForBigPlanActionableDate(
              topLevelInfo.today,
              props.timePlan,
              chaptersForSuggestions,
            )}
          />
          <FieldError
            actionResult={actionResult}
            fieldName="/actionable_date"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink margin="dense">
            Due Date [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="dueDate"
            label="dueDate"
            inputsEnabled={inputsEnabled}
            defaultValue={props.timePlan?.end_date}
            suggestedDates={getSuggestedDatesForBigPlanDueDate(
              topLevelInfo.today,
              props.timePlan,
              chaptersForSuggestions,
            )}
          />
          <FieldError actionResult={actionResult} fieldName="/due_date" />
        </FormControl>

        <SchedulingParamsBlock
          inputsEnabled={inputsEnabled}
          difficulty={selectedDifficulty}
          actionData={actionResult}
        />

        {props.timePlan !== null && (
          <>
            <FormControl fullWidth>
              <FormLabel id="timePlanActivityKind">
                Time Plan Activity Kind
              </FormLabel>
              <TimePlanActivitKindSelect
                name="timePlanActivityKind"
                defaultValue={TimePlanActivityKind.FINISH}
                inputsEnabled={inputsEnabled}
              />
              <FieldError
                actionResult={actionResult}
                fieldName="/time_plan_activity_kind"
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel id="timePlanActivityFeasability">
                Time Plan Activity Feasability
              </FormLabel>
              <TimePlanActivityFeasabilitySelect
                name="timePlanActivityFeasability"
                defaultValue={TimePlanActivityFeasability.NICE_TO_HAVE}
                inputsEnabled={inputsEnabled}
              />
              <FieldError
                actionResult={actionResult}
                fieldName="/time_plan_activity_feasability"
              />
            </FormControl>
          </>
        )}
      </SectionCard>
    </>
  );
}
