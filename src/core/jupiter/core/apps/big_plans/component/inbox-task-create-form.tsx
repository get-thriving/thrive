import type { BigPlan, TimePlan } from "@jupiter/webapi-client";
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

import { TimePlanActivityFeasabilitySelect } from "#/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "#/core/apps/time_plans/sub/activity/component/kind-select";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { IsKeySelect } from "#/core/common/component/is-key-select";
import {
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate,
} from "#/core/common/suggested-date";
import type { ActionResult } from "#/core/infra/action-result";
import { DateInputWithSuggestions } from "#/core/infra/component/date-input-with-suggestions";
import {
  BetterFieldError,
  FieldError,
  GlobalError,
} from "#/core/infra/component/errors";
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
export interface BigPlanInboxTaskCreateFormData {
  bigPlan: BigPlan;
  // The plan the task is made for, if any: its dates start out as the plan's
  // rather than the big plan's, and the form asks what kind of activity it is
  // there.
  timePlan: TimePlan | null;
}

export interface BigPlanInboxTaskCreateFormProps extends BigPlanInboxTaskCreateFormData {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  actionResult: ActionResult<unknown> | undefined;
}

/**
 * The form for a new inbox task of a big plan, posting "create" or "create
 * and another".
 */
export function BigPlanInboxTaskCreateForm(
  props: BigPlanInboxTaskCreateFormProps,
) {
  const { topLevelInfo, inputsEnabled, actionResult } = props;

  return (
    <>
      <GlobalError actionResult={actionResult} />
      <SectionCard
        title={`New Inbox Task for ${props.bigPlan.name}`}
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="big-plan-inbox-task-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "big-plan-inbox-task-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "big-plan-inbox-task-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              {...BetterFieldError({
                actionResult: actionResult,
                fieldName: "/name",
              })}
            />
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
          />
          <FieldError actionResult={actionResult} fieldName="/difficulty" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="actionableDate" shrink>
            Actionable From [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="actionableDate"
            label="actionableDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              props.timePlan !== null
                ? props.timePlan.start_date
                : (props.bigPlan.actionable_date ?? undefined)
            }
            suggestedDates={getSuggestedDatesForInboxTaskActionableDate(
              topLevelInfo.today,
              props.bigPlan,
              props.timePlan,
            )}
          />

          <FieldError
            actionResult={actionResult}
            fieldName="/actionable_date"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="dueDate" shrink>
            Due At [Optional]
          </InputLabel>
          <DateInputWithSuggestions
            name="dueDate"
            label="dueDate"
            inputsEnabled={inputsEnabled}
            defaultValue={
              props.timePlan !== null
                ? props.timePlan.end_date
                : (props.bigPlan.due_date ?? undefined)
            }
            suggestedDates={getSuggestedDatesForInboxTaskDueDate(
              topLevelInfo.today,
              props.bigPlan,
              props.timePlan,
            )}
          />

          <FieldError actionResult={actionResult} fieldName="/due_date" />
        </FormControl>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.TIME_PLANS,
        ) &&
          props.timePlan !== null && (
            <>
              <FormControl fullWidth>
                <FormLabel id="timePlanActivityKind">Kind</FormLabel>
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
                  Feasability
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
