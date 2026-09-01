import type { TimePlanQuestion } from "@jupiter/webapi-client";
import { RecurringTaskPeriod, WorkspaceFeature } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Switch,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseQuery } from "zodix";
import { sortQuestionsByOrder } from "@jupiter/core/apps/time_plans/sub/question/root";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
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
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { AspectMultiSelect } from "#/core/apps/life_plan/sub/aspects/component/multi-select";
import { ChapterMultiSelect } from "#/core/apps/life_plan/sub/chapters/components/multi-select";
import { GoalMultiSelect } from "#/core/apps/life_plan/sub/goals/components/multi-select";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import {
  fixSelectOutputEntityId,
  selectZod,
} from "@jupiter/core/common/select-form";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherAware,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  initialToday: z.string().optional(),
  initialPeriod: z.nativeEnum(RecurringTaskPeriod).optional(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  rightNow: z.string(),
  period: z.nativeEnum(RecurringTaskPeriod),
  questionRefIds: z.string().transform((s) => (s === "" ? [] : s.split(","))),
  aspectRefIds: selectZod(z.string()),
  chapterRefIds: selectZod(z.string()),
  goalRefIds: selectZod(z.string()),
  includeAspects: CheckboxAsString,
  includeGoals: CheckboxAsString,
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
  const questionsResponse = await apiClient.timePlans.timePlanQuestionFind({
    allow_archived: false,
  });
  const settingsResponse = await apiClient.timePlans.timePlanLoadSettings({});
  return json({
    lifePlan: summaryResponse.life_plan ?? undefined,
    allAspects: summaryResponse.aspects,
    allChapters: summaryResponse.chapters,
    allGoals: summaryResponse.goals,
    allMilestones: summaryResponse.milestones,
    questions: questionsResponse.questions as Array<TimePlanQuestion>,
    orderOfQuestions: questionsResponse.order_of_questions,
    includeAspectsInNote: settingsResponse.include_aspects_in_note,
    includeGoalsInNote: settingsResponse.include_goals_in_note,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.timePlans.timePlanCreate({
      right_now: form.rightNow,
      period: form.period,
      question_ref_ids: form.questionRefIds,
      aspect_ref_ids: fixSelectOutputEntityId(form.aspectRefIds),
      chapter_ref_ids: fixSelectOutputEntityId(form.chapterRefIds),
      goal_ref_ids: fixSelectOutputEntityId(form.goalRefIds),
      include_aspects: form.includeAspects,
      include_goals: form.includeGoals,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/time-plans/${result.new_time_plan.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function NewTimePlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const actionData = useActionData<typeof action>();
  const [queryRaw] = useSearchParams();
  const inputsEnabled = navigation.state === "idle";

  const query = parseQuery(queryRaw, QuerySchema);
  const initialToday = query.initialToday || topLevelInfo.today;
  const initialPeriod = query.initialPeriod || RecurringTaskPeriod.WEEKLY;
  const [period, setPeriod] = useState<RecurringTaskPeriod>(initialPeriod);

  const questionsForPeriod = useMemo(
    () =>
      sortQuestionsByOrder(
        loaderData.questions.filter((question) => question.period === period),
        loaderData.orderOfQuestions[period] ?? [],
      ),
    [loaderData.orderOfQuestions, loaderData.questions, period],
  );
  const [selectedQuestionRefIds, setSelectedQuestionRefIds] = useState<
    Set<string>
  >(() => new Set(questionsForPeriod.map((question) => question.ref_id)));

  return (
    <LeafPanel
      key="time-plans/new"
      fakeKey={`time-plans-${initialToday}-${initialPeriod}/new`}
      returnLocation="/app/workspace/apps/time-plans"
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
              ActionSingle({
                id: "time-plan-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
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
            value={period}
            onChange={(newPeriod) => {
              if (newPeriod !== "none" && !Array.isArray(newPeriod)) {
                setPeriod(newPeriod);
                setSelectedQuestionRefIds(
                  new Set(
                    sortQuestionsByOrder(
                      loaderData.questions.filter(
                        (question) => question.period === newPeriod,
                      ),
                      loaderData.orderOfQuestions[newPeriod] ?? [],
                    ).map((question) => question.ref_id),
                  ),
                );
              }
            }}
          />
          <FieldError actionResult={actionData} fieldName="/period" />
        </FormControl>

        <input
          type="hidden"
          name="questionRefIds"
          value={[...selectedQuestionRefIds].join(",")}
        />
        {questionsForPeriod.length > 0 && (
          <FormControl fullWidth>
            <FormLabel id="questions">Questions</FormLabel>
            <EntityStack>
              {questionsForPeriod.map((question) => (
                <EntityCard
                  key={`time-plan-new-question-${question.ref_id}`}
                  entityId={`time-plan-new-question-${question.ref_id}`}
                  allowSelect
                  selected={selectedQuestionRefIds.has(question.ref_id)}
                  onClick={() => {
                    setSelectedQuestionRefIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(question.ref_id)) {
                        next.delete(question.ref_id);
                      } else {
                        next.add(question.ref_id);
                      }
                      return next;
                    });
                  }}
                >
                  <EntityLink
                    to={`/app/workspace/apps/time-plans/questions/${question.ref_id}`}
                    block
                  >
                    <EntityNameComponent name={question.name} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
            <FieldError
              actionResult={actionData}
              fieldName="/question_ref_ids"
            />
          </FormControl>
        )}

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) &&
          loaderData.lifePlan && (
            <>
              <FormControl fullWidth>
                <AspectMultiSelect
                  name="aspectRefIds"
                  label="Aspect"
                  inputsEnabled={inputsEnabled}
                  disabled={false}
                  allAspects={loaderData.allAspects ?? []}
                  maxSelections={
                    loaderData.lifePlan.time_plan_max_life_plan_links
                  }
                  defaultValue={undefined}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/aspectRefIds"
                />
              </FormControl>

              <FormControl fullWidth>
                <ChapterMultiSelect
                  name="chapterRefIds"
                  label="Chapter"
                  inputsEnabled={inputsEnabled}
                  disabled={false}
                  allChapters={loaderData.allChapters ?? []}
                  maxSelections={
                    loaderData.lifePlan.time_plan_max_life_plan_links
                  }
                  defaultValue={undefined}
                  birthday={lifePlanBirthdayDate(loaderData.lifePlan)}
                  today={aDateToDate(topLevelInfo.today)}
                  allMilestones={loaderData.allMilestones ?? []}
                  allAspects={loaderData.allAspects ?? []}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/chapterRefIds"
                />
              </FormControl>

              <FormControl fullWidth>
                <GoalMultiSelect
                  name="goalRefIds"
                  label="Goal"
                  inputsEnabled={inputsEnabled}
                  disabled={false}
                  allGoals={loaderData.allGoals ?? []}
                  maxSelections={
                    loaderData.lifePlan.time_plan_max_life_plan_links
                  }
                  defaultValue={undefined}
                />
                <FieldError actionResult={actionData} fieldName="/goalRefIds" />
              </FormControl>

              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      name="includeAspects"
                      readOnly={!inputsEnabled}
                      disabled={!inputsEnabled}
                      defaultChecked={loaderData.includeAspectsInNote}
                    />
                  }
                  label="Include Aspects Of The Life Plan"
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/include_aspects"
                />
              </FormControl>

              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      name="includeGoals"
                      readOnly={!inputsEnabled}
                      disabled={!inputsEnabled}
                      defaultChecked={loaderData.includeGoalsInNote}
                    />
                  }
                  label="Include Goals Of The Life Plan"
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/include_goals"
                />
              </FormControl>
            </>
          )}
      </SectionCard>
    </LeafPanel>
  );
}

export default createAnotherAware(NewTimePlan);

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/time-plans",
  ParamsSchema,
  {
    error: () => `There was an error creating the time plan! Please try again!`,
  },
);
