import {
  ApiError,
  Difficulty,
  Eisen,
  LifePlan,
  LifePlanEvalApproach,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import {
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { BirthdaySelect } from "@jupiter/core/common/component/birthday-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { BirthYearSelect } from "#/core/common/component/birth-year-select";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { ProjectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { EisenhowerSelect } from "@jupiter/core/common/component/eisenhower-select";
import { DifficultySelect } from "@jupiter/core/common/component/difficulty-select";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";

import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { selectZod, fixSelectOutputToEnumStrict } from "~/logic/select";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    birthday: z.string(),
    birthYear: z.string().transform((value) => parseInt(value, 10)),
  }),
  z.object({
    intent: z.literal("update-eval-settings"),
    evalPeriods: selectZod(z.nativeEnum(RecurringTaskPeriod)),
    evalApproach: z.nativeEnum(LifePlanEvalApproach),
    evalTaskGenerationInAdvanceDaysForDaily: z.coerce.number().optional(),
    evalTaskGenerationInAdvanceDaysForWeekly: z.coerce.number().optional(),
    evalTaskGenerationInAdvanceDaysForMonthly: z.coerce.number().optional(),
    evalTaskGenerationInAdvanceDaysForQuarterly: z.coerce.number().optional(),
    evalTaskGenerationInAdvanceDaysForYearly: z.coerce.number().optional(),
    evalTaskProject: z.string().optional(),
    evalTaskEisen: z.nativeEnum(Eisen).optional(),
    evalTaskDifficulty: z.nativeEnum(Difficulty).optional(),
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
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
  });

  const evalSettingsResponse =
    await apiClient.lifePlan.lifePlanLoadEvalSettings({});

  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
    evalPeriods: evalSettingsResponse.eval_periods,
    evalApproach: evalSettingsResponse.eval_approach,
    evalTaskProject: evalSettingsResponse.eval_task_project,
    evalTaskGenParams: evalSettingsResponse.eval_task_gen_params,
    evalTaskGenerationInAdvanceDays:
      evalSettingsResponse.eval_task_generation_in_advance_days,
    evalTasks: evalSettingsResponse.eval_tasks,
    allProjects: summaryResponse.projects || undefined,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.lifePlan.lifePlanUpdate({
          birthday: {
            should_change: true,
            value: form.birthday,
          },
          birth_year: {
            should_change: true,
            value: form.birthYear,
          },
        });

        return redirect(`/app/workspace/life-plan/settings`);
      }

      case "update-eval-settings": {
        const evalTaskGenerationInAdvanceDays: Record<string, number> = {};
        if (form.evalTaskGenerationInAdvanceDaysForDaily !== undefined) {
          evalTaskGenerationInAdvanceDays[RecurringTaskPeriod.DAILY] =
            form.evalTaskGenerationInAdvanceDaysForDaily;
        }
        if (form.evalTaskGenerationInAdvanceDaysForWeekly !== undefined) {
          evalTaskGenerationInAdvanceDays[RecurringTaskPeriod.WEEKLY] =
            form.evalTaskGenerationInAdvanceDaysForWeekly;
        }
        if (form.evalTaskGenerationInAdvanceDaysForMonthly !== undefined) {
          evalTaskGenerationInAdvanceDays[RecurringTaskPeriod.MONTHLY] =
            form.evalTaskGenerationInAdvanceDaysForMonthly;
        }
        if (form.evalTaskGenerationInAdvanceDaysForQuarterly !== undefined) {
          evalTaskGenerationInAdvanceDays[RecurringTaskPeriod.QUARTERLY] =
            form.evalTaskGenerationInAdvanceDaysForQuarterly;
        }
        if (form.evalTaskGenerationInAdvanceDaysForYearly !== undefined) {
          evalTaskGenerationInAdvanceDays[RecurringTaskPeriod.YEARLY] =
            form.evalTaskGenerationInAdvanceDaysForYearly;
        }

        await apiClient.lifePlan.lifePlanUpdateEvalSettings({
          eval_periods: {
            should_change: true,
            value: fixSelectOutputToEnumStrict<RecurringTaskPeriod>(
              form.evalPeriods,
            ),
          },
          eval_approach: {
            should_change: true,
            value: form.evalApproach,
          },
          eval_task_project_ref_id: {
            should_change: true,
            value: form.evalTaskProject,
          },
          eval_task_eisen: {
            should_change: true,
            value: form.evalTaskEisen,
          },
          eval_task_difficulty: {
            should_change: true,
            value: form.evalTaskDifficulty,
          },
          eval_task_generation_in_advance_days: {
            should_change: true,
            value: evalTaskGenerationInAdvanceDays,
          },
        });

        return redirect(`/app/workspace/life-plan/settings`);
      }

      case "regen": {
        await apiClient.lifePlan.lifePlanRegen({});
        return redirect(`/app/workspace/life-plan/settings`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function LifePlanSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const [evalPeriods, setEvalPeriods] = useState<RecurringTaskPeriod[]>(
    loaderData.evalPeriods,
  );
  const [evalApproach, setEvalApproach] = useState<LifePlanEvalApproach>(
    loaderData.evalApproach,
  );

  useEffect(() => {
    setEvalPeriods(loaderData.evalPeriods);
    setEvalApproach(loaderData.evalApproach);
  }, [loaderData]);

  return (
    <BranchPanel
      key={"life-plan/settings"}
      returnLocation="/app/workspace/life-plan"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <>
          <SectionCard
            id="life-plan-settings"
            title="Settings"
            actions={
              <SectionActions
                id="life-plan-settings-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    id: "life-plan-settings-save",
                    text: "Save",
                    value: "update",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <Stack spacing={2} useFlexGap direction="row">
              <BirthdaySelect
                name="birthday"
                allowNoneBirthday={false}
                inputsEnabled={inputsEnabled}
                initialValue={loaderData.lifePlan.birthday}
              />
              <FormControl fullWidth>
                <BirthYearSelect
                  label="Your Birth Year"
                  name="birthYear"
                  inputsEnabled={inputsEnabled}
                  defaultValue={loaderData.lifePlan.birth_year}
                  allowNoneBirthYear={false}
                />
              </FormControl>
              <FieldError actionResult={actionData} fieldName="/birthday" />
              <FieldError actionResult={actionData} fieldName="/birth_year" />
            </Stack>
          </SectionCard>

          <SectionCard
            id="life-plan-eval-settings"
            title="Eval Settings"
            actions={
              <SectionActions
                id="life-plan-eval-settings-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  ActionSingle({
                    id: "life-plan-eval-settings-save",
                    text: "Save",
                    value: "update-eval-settings",
                    highlight: true,
                  }),
                  ActionSingle({
                    id: "life-plan-eval-settings-regen",
                    text: "Regen",
                    value: "regen",
                  }),
                ]}
              />
            }
          >
            <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
              <FormControl fullWidth>
                <FormLabel id="evalPeriods">
                  Periods You Want To Evaluate
                </FormLabel>
                <PeriodSelect
                  labelId="evalPeriods"
                  label="Periods"
                  name="evalPeriods"
                  multiSelect
                  inputsEnabled={inputsEnabled}
                  value={evalPeriods}
                  onChange={(newPeriods) => {
                    setEvalPeriods(newPeriods as RecurringTaskPeriod[]);
                  }}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/eval_periods"
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel id="evalApproach">Generation Approach</FormLabel>
                <ToggleButtonGroup
                  value={evalApproach}
                  exclusive
                  fullWidth
                  onChange={(_, newApproach) =>
                    newApproach !== null && setEvalApproach(newApproach)
                  }
                >
                  <ToggleButton
                    size="small"
                    id="approach-task"
                    disabled={!inputsEnabled}
                    value={LifePlanEvalApproach.TASK}
                  >
                    Generate Eval Task
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    id="approach-none"
                    disabled={!inputsEnabled}
                    value={LifePlanEvalApproach.NONE}
                  >
                    None
                  </ToggleButton>
                </ToggleButtonGroup>
                <input
                  name="evalApproach"
                  type="hidden"
                  value={evalApproach}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/eval_approach"
                />
              </FormControl>
            </Stack>

            {evalApproach === LifePlanEvalApproach.TASK && (
              <>
                <Divider>
                  <Typography variant="h6">Eval Task Properties</Typography>
                </Divider>

                <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
                  <FormControl fullWidth sx={{ alignSelf: "flex-end" }}>
                    <ProjectSelect
                      name="evalTaskProject"
                      label="Eval Task Project"
                      inputsEnabled={inputsEnabled}
                      disabled={false}
                      allProjects={loaderData.allProjects!}
                      defaultValue={loaderData.evalTaskProject?.ref_id}
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/eval_task_project_ref_id"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ alignSelf: "flex-end" }}>
                    <FormLabel id="evalTaskEisen">Eval Task Eisen</FormLabel>
                    <EisenhowerSelect
                      name="evalTaskEisen"
                      inputsEnabled={inputsEnabled}
                      defaultValue={
                        loaderData.evalTaskGenParams?.eisen ?? Eisen.IMPORTANT
                      }
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/eval_task_eisen"
                    />
                  </FormControl>

                  <FormControl fullWidth sx={{ alignSelf: "flex-end" }}>
                    <FormLabel id="evalTaskDifficulty">
                      Eval Task Difficulty
                    </FormLabel>
                    <DifficultySelect
                      name="evalTaskDifficulty"
                      inputsEnabled={inputsEnabled}
                      defaultValue={
                        loaderData.evalTaskGenParams?.difficulty ??
                        Difficulty.EASY
                      }
                    />
                    <FieldError
                      actionResult={actionData}
                      fieldName="/eval_task_difficulty"
                    />
                  </FormControl>
                </Stack>

                <Divider>
                  <Typography variant="h6">
                    Days To Generate In Advance
                  </Typography>
                </Divider>

                <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
                  {Object.values(RecurringTaskPeriod).map((period) => {
                    if (!evalPeriods.includes(period)) {
                      return null;
                    }

                    return (
                      <FormControl fullWidth key={period}>
                        <InputLabel
                          id={`evalTaskGenerationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`}
                        >
                          For {periodName(period)}
                        </InputLabel>
                        <OutlinedInput
                          name={`evalTaskGenerationInAdvanceDaysFor${period.charAt(0).toUpperCase() + period.slice(1)}`}
                          label={`For ${periodName(period)}`}
                          disabled={!inputsEnabled}
                          defaultValue={
                            loaderData.evalTaskGenerationInAdvanceDays[
                              period
                            ] ?? 1
                          }
                        />
                        <FieldError
                          actionResult={actionData}
                          fieldName={`/eval_task_generation_in_advance_days`}
                        />
                      </FormControl>
                    );
                  })}
                </Stack>
              </>
            )}
          </SectionCard>

          <SectionCard
            id="life-plan-eval-tasks"
            title="Generated Eval Tasks"
          >
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showEisen: true,
                showDifficulty: true,
                showDueDate: true,
              }}
              inboxTasks={loaderData.evalTasks}
            />
          </SectionCard>
        </>
      )}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    notFound: () => `Could not find the life plan settings!`,
    error: () =>
      `There was an error loading the life plan settings! Please try again!`,
  },
);
