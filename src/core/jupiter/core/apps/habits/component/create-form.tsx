import type {
  AspectSummary,
  ChapterSummary,
  GoalSummary,
  HabitStack,
  LifePlan,
  MilestoneSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  HabitRepeatsStrategy,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useState } from "react";

import { HabitRepeatStrategySelect } from "#/core/apps/habits/component/repeat-strategy-select";
import { HabitStackSelectSingle } from "#/core/apps/habits/component/stack-select-single";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { LifePlanAssociations } from "#/core/apps/life_plan/components/life-plan-associations";
import { TimePlanActivityFeasabilitySelect } from "#/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "#/core/apps/time_plans/sub/activity/component/kind-select";
import { aDateToDate } from "#/core/common/adate";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import { RecurringTaskGenParamsBlock } from "#/core/common/component/recurring-task-gen-params-block";
import { SchedulingParamsBlock } from "#/core/common/component/scheduling-params-block";
import type { ActionResult } from "#/core/infra/action-result";
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
export interface HabitCreateFormData {
  rootAspect: AspectSummary | null;
  lifePlan: LifePlan | null;
  allAspects: Array<AspectSummary> | null;
  allChapters: Array<ChapterSummary> | null;
  allGoals: Array<GoalSummary> | null;
  allMilestones: Array<MilestoneSummary> | null;
  allStacks: Array<HabitStack>;
  // The plan the habit is made for, if any: the form asks what kind of
  // activity it is there.
  timePlan: TimePlan | null;
}

export interface HabitCreateFormProps extends HabitCreateFormData {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  actionResult: ActionResult<unknown> | undefined;
}

/** The form for a new habit, posting "create" or "create and another". */
export function HabitCreateForm(props: HabitCreateFormProps) {
  const { topLevelInfo, inputsEnabled, actionResult } = props;

  const birthdayDate = props.lifePlan
    ? lifePlanBirthdayDate(props.lifePlan)
    : null;
  const [selectedAspect, setSelectedAspect] = useState<string>(
    props.rootAspect?.ref_id ?? "",
  );
  const [selectedPeriod, setSelectedPeriod] = useState<RecurringTaskPeriod>(
    RecurringTaskPeriod.DAILY,
  );
  const [selectedStackRefId, setSelectedStackRefId] = useState<
    string | undefined
  >(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    Difficulty.EASY,
  );
  const [selectedRepeatsStrategy, setSelectedRepeatsStrategy] = useState<
    HabitRepeatsStrategy | "none"
  >("none");

  return (
    <>
      <GlobalError actionResult={actionResult} />
      <SectionCard
        title="New Habit"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="habit-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "habit-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "habit-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <Stack
          direction="row"
          useFlexGap
          spacing={1}
          sx={{ flexWrap: "nowrap" }}
        >
          <FormControl sx={{ flex: "1 1 0", minWidth: 0 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionResult} fieldName="/name" />
          </FormControl>

          <FormControl
            sx={{ flex: "0 1 10rem", minWidth: 0, maxWidth: "10rem" }}
          >
            <HabitStackSelectSingle
              name="stack"
              label="Stack"
              allowNone
              allStacks={props.allStacks.filter(
                (stack) => stack.period === selectedPeriod,
              )}
              value={selectedStackRefId}
              inputsEnabled={inputsEnabled}
              onChange={(value) => setSelectedStackRefId(value)}
            />
            <FieldError actionResult={actionResult} fieldName="/stack_ref_id" />
          </FormControl>

          <FormControl sx={{ flex: "0 0 auto" }}>
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
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={props.allChapters ?? []}
              allGoals={props.allGoals ?? []}
              birthday={birthdayDate!}
              today={aDateToDate(topLevelInfo.today)}
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

        <RecurringTaskGenParamsBlock
          inputsEnabled={inputsEnabled}
          allowSkipRule
          period={selectedPeriod}
          onChangePeriod={(newPeriod) => {
            const nextPeriod =
              newPeriod === "none" ? RecurringTaskPeriod.DAILY : newPeriod;
            setSelectedPeriod(nextPeriod);
            const selectedStack = props.allStacks.find(
              (stack) => stack.ref_id === selectedStackRefId,
            );
            if (selectedStack && selectedStack.period !== nextPeriod) {
              setSelectedStackRefId(undefined);
            }
          }}
          eisen={Eisen.REGULAR}
          difficulty={selectedDifficulty}
          onChangeDifficulty={setSelectedDifficulty}
          actionableFromDay={null}
          actionableFromMonth={null}
          dueAtDay={null}
          dueAtMonth={null}
          skipRule={null}
          actionData={actionResult}
        />

        <SchedulingParamsBlock
          inputsEnabled={inputsEnabled}
          difficulty={selectedDifficulty}
          actionData={actionResult}
        />

        {selectedPeriod !== RecurringTaskPeriod.DAILY && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flexGrow: 3 }}>
              <HabitRepeatStrategySelect
                name="repeatsStrategy"
                inputsEnabled={inputsEnabled}
                allowNone
                value={selectedRepeatsStrategy}
                onChange={(newStrategy) =>
                  setSelectedRepeatsStrategy(newStrategy)
                }
              />
            </FormControl>
            {selectedRepeatsStrategy !== "none" && (
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel id="repeatsInPeriodCount">
                  Repeats In Period [Optional]
                </InputLabel>
                <OutlinedInput
                  label="Repeats In Period"
                  name="repeatsInPeriodCount"
                  readOnly={!inputsEnabled}
                  sx={{ height: "100%" }}
                />
                <FieldError
                  actionResult={actionResult}
                  fieldName="/repeats_in_period_count"
                />
              </FormControl>
            )}
          </Stack>
        )}

        {props.timePlan !== null && (
          <Stack direction="row" useFlexGap spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="timePlanActivityKind">Activity Kind</InputLabel>
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
              <InputLabel id="timePlanActivityFeasability">
                Activity Feasability
              </InputLabel>
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
          </Stack>
        )}
      </SectionCard>
    </>
  );
}
