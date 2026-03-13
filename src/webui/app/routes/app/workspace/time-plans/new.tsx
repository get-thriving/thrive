import {
  ApiError,
  LifePlan,
  RecurringTaskPeriod,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { AspectMultiSelect } from "#/core/life_plan/sub/aspects/component/multi-select";
import { ChapterMultiSelect } from "#/core/life_plan/sub/chapters/components/multi-select";
import { GoalMultiSelect } from "#/core/life_plan/sub/goals/components/multi-select";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { fixSelectOutputEntityId, selectZod } from "~/logic/select";
import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  initialToday: z.string().optional(),
  initialPeriod: z.nativeEnum(RecurringTaskPeriod).optional(),
});

const CreateFormSchema = z.object({
  rightNow: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
  aspectRefIds: selectZod(z.string()),
  chapterRefIds: selectZod(z.string()),
  goalRefIds: selectZod(z.string()),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_workspace: true,
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });
  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
    allAspects: summaryResponse.aspects,
    allChapters: summaryResponse.chapters,
    allGoals: summaryResponse.goals,
    allMilestones: summaryResponse.milestones,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.timePlans.timePlanCreate({
      right_now: form.rightNow,
      period: form.period,
      aspect_ref_ids: fixSelectOutputEntityId(form.aspectRefIds),
      chapter_ref_ids: fixSelectOutputEntityId(form.chapterRefIds),
      goal_ref_ids: fixSelectOutputEntityId(form.goalRefIds),
    });

    return redirect(`/app/workspace/time-plans/${result.new_time_plan.ref_id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewTimePlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const actionData = useActionData<typeof action>();
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";

  const query = parseQuery(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || RecurringTaskPeriod.WEEKLY;

  return (
    <LeafPanel
      key="time-plans/new"
      fakeKey={`time-plans-${initialToday}-${initialPeriod}/new`}
      returnLocation="/app/workspace/time-plans"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="time-plan-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "time-plan-create",
                text: "Create",
                value: "create",
                disabled: !inputsEnabled,
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="rightNow" shrink margin="dense">
            The Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="rightNow"
            name="rightNow"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
            defaultValue={initialToday}
          />

          <FieldError actionResult={actionData} fieldName="/rightNow" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="period">Period</FormLabel>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={inputsEnabled}
            defaultValue={initialPeriod}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>

        <FormControl fullWidth>
          <AspectMultiSelect
            name="aspectRefIds"
            label="Aspect"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allAspects={loaderData.allAspects ?? []}
            maxSelections={loaderData.lifePlan.time_plan_max_life_plan_links}
            defaultValue={undefined}
          />
          <FieldError actionResult={actionData} fieldName="/aspectRefIds" />
        </FormControl>

        <FormControl fullWidth>
          <ChapterMultiSelect
            name="chapterRefIds"
            label="Chapter"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allChapters={loaderData.allChapters ?? []}
            maxSelections={loaderData.lifePlan.time_plan_max_life_plan_links}
            defaultValue={undefined}
            birthday={lifePlanBirthdayDate(loaderData.lifePlan)}
            today={aDateToDate(topLevelInfo.today)}
            allMilestones={loaderData.allMilestones ?? []}
            allAspects={loaderData.allAspects ?? []}
          />
          <FieldError actionResult={actionData} fieldName="/chapterRefIds" />
        </FormControl>

        <FormControl fullWidth>
          <GoalMultiSelect
            name="goalRefIds"
            label="Goal"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allGoals={loaderData.allGoals ?? []}
            maxSelections={loaderData.lifePlan.time_plan_max_life_plan_links}
            defaultValue={undefined}
          />
          <FieldError actionResult={actionData} fieldName="/goalRefIds" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/time-plans",
  ParamsSchema,
  {
    error: () => `There was an error creating the time plan! Please try again!`,
  },
);
