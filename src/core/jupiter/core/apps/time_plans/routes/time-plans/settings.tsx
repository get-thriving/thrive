import {
  RecurringTaskPeriod,
  Difficulty,
  Eisen,
  WorkspaceFeature,
  TimePlanGenerationApproach,
} from "@jupiter/webapi-client";
import { z } from "zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  ShouldRevalidateFunction,
  useActionData,
  useNavigation,
} from "react-router";
import { CheckboxAsString, parseForm } from "zodix";
import { useContext, useEffect, useState } from "react";
import {
  Stack,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Divider,
  Switch,
  Typography,
} from "@mui/material";

import { periodName } from "#/core/common/recurring-task-period";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { BranchPanel } from "#/core/infra/component/layout/branch-panel";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { makeBranchErrorBoundary } from "#/core/infra/component/error-boundary";
import { PeriodSelect } from "#/core/common/component/period-select";
import { EisenhowerSelect } from "#/core/common/component/eisenhower-select";
import { DifficultySelect } from "#/core/common/component/difficulty-select";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TimePlanGenerationApproachSelect } from "#/core/apps/time_plans/component/generation-approach-select";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import {
  selectZod,
  fixSelectOutputToEnumStrict,
} from "#/core/common/select-form";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  SchedulingParamsFormFields,
  schedulingParamsUpdateArgs,
} from "#/core/common/scheduling-params-form";
import { SchedulingParamsBlock } from "#/core/common/component/scheduling-params-block";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    periods: selectZod(z.nativeEnum(RecurringTaskPeriod)),
    generationApproach: z.nativeEnum(TimePlanGenerationApproach),
    generationInAdvanceDaysForDaily: z.coerce.number().optional(),
    generationInAdvanceDaysForWeekly: z.coerce.number().optional(),
    generationInAdvanceDaysForMonthly: z.coerce.number().optional(),
    generationInAdvanceDaysForQuarterly: z.coerce.number().optional(),
    generationInAdvanceDaysForYearly: z.coerce.number().optional(),
    planningTaskEisen: z.nativeEnum(Eisen).optional(),
    planningTaskDifficulty: z.nativeEnum(Difficulty).optional(),
    includeAspectsInNote: CheckboxAsString,
    includeGoalsInNote: CheckboxAsString,
    ...SchedulingParamsFormFields,
  }),
  z.object({
    intent: z.literal("regen"),
  }),
]);

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const timePlanSettingsResponse =
    await apiClient.timePlans.timePlanLoadSettings({});

  return {
    periods: timePlanSettingsResponse.periods,
    generationApproach: timePlanSettingsResponse.generation_approach,
    generationInAdvanceDays:
      timePlanSettingsResponse.generation_in_advance_days,
    planningTaskGenParams: timePlanSettingsResponse.planning_task_gen_params,
    planningTaskSchedulingParams:
      timePlanSettingsResponse.planning_task_scheduling_params,
    includeAspectsInNote: timePlanSettingsResponse.include_aspects_in_note,
    includeGoalsInNote: timePlanSettingsResponse.include_goals_in_note,
    planningTasks: timePlanSettingsResponse.planning_tasks,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        const generationInAdvanceDays: Record<string, number> = {};
        if (form.generationInAdvanceDaysForDaily !== undefined) {
          generationInAdvanceDays[RecurringTaskPeriod.DAILY] =
            form.generationInAdvanceDaysForDaily;
        }
        if (form.generationInAdvanceDaysForWeekly !== undefined) {
          generationInAdvanceDays[RecurringTaskPeriod.WEEKLY] =
            form.generationInAdvanceDaysForWeekly;
        }
        if (form.generationInAdvanceDaysForMonthly !== undefined) {
          generationInAdvanceDays[RecurringTaskPeriod.MONTHLY] =
            form.generationInAdvanceDaysForMonthly;
        }
        if (form.generationInAdvanceDaysForQuarterly !== undefined) {
          generationInAdvanceDays[RecurringTaskPeriod.QUARTERLY] =
            form.generationInAdvanceDaysForQuarterly;
        }
        if (form.generationInAdvanceDaysForYearly !== undefined) {
          generationInAdvanceDays[RecurringTaskPeriod.YEARLY] =
            form.generationInAdvanceDaysForYearly;
        }

        await apiClient.timePlans.timePlanUpdateSettings({
          periods: {
            should_change: true,
            value: fixSelectOutputToEnumStrict<RecurringTaskPeriod>(
              form.periods,
            ),
          },
          generation_approach: {
            should_change: true,
            value: form.generationApproach,
          },
          generation_in_advance_days: {
            should_change: true,
            value: generationInAdvanceDays,
          },
          planning_task_eisen: {
            should_change: true,
            value: form.planningTaskEisen,
          },
          planning_task_difficulty: {
            should_change: true,
            value: form.planningTaskDifficulty,
          },
          include_aspects_in_note: {
            should_change: true,
            value: form.includeAspectsInNote,
          },
          include_goals_in_note: {
            should_change: true,
            value: form.includeGoalsInNote,
          },
          ...schedulingParamsUpdateArgs(form),
        });

        return redirect(`/app/workspace/apps/time-plans/settings`);
      }

      case "regen": {
        await apiClient.timePlans.timePlanRegen({});
        return redirect(`/app/workspace/apps/time-plans/settings`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function TimePlansSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const isBigScreen = useBigScreen();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const [periods, setPeriods] = useState<RecurringTaskPeriod[]>(
    loaderData.periods,
  );

  const [approach, setApproach] = useState<TimePlanGenerationApproach>(
    loaderData.generationApproach,
  );

  const inputsEnabled = navigation.state === "idle";

  useEffect(() => {
    setPeriods(loaderData.periods);
    setApproach(loaderData.generationApproach);
  }, [loaderData]);

  return (
    <BranchPanel
      key={"time-plans/settings"}
      returnLocation="/app/workspace/apps/time-plans"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.TIME_PLANS,
      ) && (
        <>
          <SectionCard
            id="time-plans-settings"
            title="Settings"
            actions={
              <SectionActions
                id="time-plans-settings-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    id: "time-plans-settings-save",
                    text: "Save",
                    value: "update",
                    highlight: true,
                  }),
                  ActionSingle({
                    id: "time-plans-settings-regen",
                    text: "Regen",
                    value: "regen",
                  }),
                ]}
              />
            }
          >
            <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
              <FormControl fullWidth>
                <FormLabel id="periods">Periods You Want To Plan</FormLabel>
                <PeriodSelect
                  labelId="periods"
                  label="Periods"
                  name="periods"
                  multiSelect
                  inputsEnabled={inputsEnabled}
                  value={periods}
                  onChange={(newPeriods) => {
                    setPeriods(newPeriods as RecurringTaskPeriod[]);
                  }}
                />
                <FieldError actionResult={actionData} fieldName="/periods" />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel id="generationApproach">
                  Generation Approach
                </FormLabel>
                <TimePlanGenerationApproachSelect
                  name="generationApproach"
                  inputsEnabled={inputsEnabled}
                  value={approach}
                  onChange={setApproach}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/generation_approach"
                />
              </FormControl>
            </Stack>

            {isWorkspaceFeatureAvailable(
              topLevelInfo.workspace,
              WorkspaceFeature.LIFE_PLAN,
            ) && (
              <>
                <Divider>
                  <Typography variant="h6">Document Properties</Typography>
                </Divider>

                <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Switch
                          name="includeAspectsInNote"
                          readOnly={!inputsEnabled}
                          disabled={!inputsEnabled}
                          defaultChecked={loaderData.includeAspectsInNote}
                        />
                      }
                      label="Include Aspects Of The Life Plan (Monthly And Up)"
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/include_aspects_in_note"
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Switch
                          name="includeGoalsInNote"
                          readOnly={!inputsEnabled}
                          disabled={!inputsEnabled}
                          defaultChecked={loaderData.includeGoalsInNote}
                        />
                      }
                      label="Include Goals Of The Life Plan (Quarterly And Up)"
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/include_goals_in_note"
                    />
                  </FormControl>
                </Stack>
              </>
            )}

            {approach === TimePlanGenerationApproach.BOTH_PLAN_AND_TASK && (
              <>
                <Divider>
                  <Typography variant="h6">
                    Planning Inbox Task Properties
                  </Typography>
                </Divider>

                <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
                  <FormControl fullWidth sx={{ alignSelf: "flex-end" }}>
                    <FormLabel id="planningTaskEisen">
                      Planning Task Eisen
                    </FormLabel>
                    <EisenhowerSelect
                      name="planningTaskEisen"
                      inputsEnabled={inputsEnabled}
                      defaultValue={
                        loaderData.planningTaskGenParams?.eisen ??
                        Eisen.IMPORTANT
                      }
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/planning_task_eisen"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ alignSelf: "flex-end" }}>
                    <FormLabel id="planningTaskDifficulty">
                      Planning Task Difficulty
                    </FormLabel>
                    <DifficultySelect
                      name="planningTaskDifficulty"
                      inputsEnabled={inputsEnabled}
                      defaultValue={
                        loaderData.planningTaskGenParams?.difficulty ??
                        Difficulty.EASY
                      }
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/planning_task_difficulty"
                    />
                  </FormControl>
                </Stack>

                <SchedulingParamsBlock
                  inputsEnabled={inputsEnabled}
                  schedulingParams={loaderData.planningTaskSchedulingParams}
                  actionData={actionData}
                />
              </>
            )}

            {(approach === TimePlanGenerationApproach.BOTH_PLAN_AND_TASK ||
              approach === TimePlanGenerationApproach.ONLY_PLAN) && (
              <>
                <Divider>
                  <Typography variant="h6">
                    Days To Generate In Advance
                  </Typography>
                </Divider>

                <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
                  {Object.values(RecurringTaskPeriod).map((period) => {
                    if (!periods.includes(period)) {
                      return null;
                    }

                    return (
                      <FormControl fullWidth key={period}>
                        <InputLabel
                          id={`generationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`}
                        >
                          For {periodName(period)}
                        </InputLabel>
                        <OutlinedInput
                          name={`generationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`}
                          label={`For ${periodName(period)}`}
                          disabled={!inputsEnabled}
                          defaultValue={
                            loaderData.generationInAdvanceDays[period] ?? 1
                          }
                        />
                        <FieldError
                          actionResult={actionData}
                          fieldName={`/generation_in_advance_days`}
                        />
                      </FormControl>
                    );
                  })}
                </Stack>
              </>
            )}
          </SectionCard>

          <SectionCard
            id="time-plans-generated-time-plans-and-planning-tasks"
            title="Generated Planning Tasks"
          >
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showEisen: true,
                showDifficulty: true,
                showDueDate: true,
              }}
              inboxTasks={loaderData.planningTasks}
            />
          </SectionCard>
        </>
      )}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/apps/time-plans",
  ParamsSchema,
  {
    notFound: () => `Could not find the time plans settings!`,
    error: () =>
      `There was an error loading the time plans settings! Please try again!`,
  },
);
