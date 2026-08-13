import type {
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  TimePlan,
} from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
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
import { useContext, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseQuery } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  TIME_PLAN_VIEW_PARAM,
  withTimePlanView,
} from "@jupiter/core/time_plans/view-mode";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { RecurringTaskGenParamsBlock } from "@jupiter/core/common/component/recurring-task-gen-params-block";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/time_plans/sub/activity/component/kind-select";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  timePlanReason: z.literal("for-time-plan").optional(),
  timePlanRefId: z.string().optional(),
});

const CreateFormSchema = z.object({
  name: z.string(),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  period: z.nativeEnum(RecurringTaskPeriod),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableFromDay: z.string().optional(),
  actionableFromMonth: z.string().optional(),
  dueAtDay: z.string().optional(),
  dueAtMonth: z.string().optional(),
  mustDo: CheckboxAsString,
  skipRule: z.string().optional(),
  startAtDate: z.string().optional(),
  endAtDate: z.string().optional(),
  timePlanActivityKind: z.nativeEnum(TimePlanActivityKind).optional(),
  timePlanActivityFeasability: z
    .nativeEnum(TimePlanActivityFeasability)
    .optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const apiClient = await getLoggedInApiClient(request);

  const timePlanReason = query.timePlanReason || "standard";

  let associatedTimePlan = null;
  if (timePlanReason === "for-time-plan") {
    if (!query.timePlanRefId) {
      throw new Response("Missing Time Plan Id", { status: 500 });
    }

    const timePlanResult = await apiClient.timePlans.timePlanLoad({
      allow_archived: false,
      ref_id: query.timePlanRefId,
      include_targets: false,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });

    associatedTimePlan = timePlanResult.time_plan;
  }

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  return json({
    timePlanReason: timePlanReason,
    associatedTimePlan: associatedTimePlan,
    rootAspect: summaryResponse.root_aspect as AspectSummary | null,
    lifePlan: summaryResponse.life_plan as LifePlan | null,
    allAspects: summaryResponse.aspects as Array<AspectSummary> | null,
    allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
    allGoals: summaryResponse.goals as Array<GoalSummary> | null,
    allMilestones: summaryResponse.milestones as Array<MilestoneSummary> | null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const timePlanReason = query.timePlanReason || "standard";

    const result = await apiClient.chores.choreCreate({
      name: form.name,
      time_plan_ref_id:
        timePlanReason === "standard"
          ? undefined
          : (query.timePlanRefId as string),
      time_plan_activity_kind: form.timePlanActivityKind,
      time_plan_activity_feasability: form.timePlanActivityFeasability,
      aspect_ref_id: form.aspect !== undefined ? form.aspect : undefined,
      chapter_ref_id:
        form.chapter !== undefined && form.chapter !== ""
          ? form.chapter
          : undefined,
      goal_ref_id:
        form.goal !== undefined && form.goal !== "" ? form.goal : undefined,
      period: form.period,
      is_key: form.isKey,
      eisen: form.eisen,
      difficulty: form.difficulty,
      actionable_from_day: form.actionableFromDay
        ? parseInt(form.actionableFromDay)
        : undefined,
      actionable_from_month: form.actionableFromMonth
        ? parseInt(form.actionableFromMonth)
        : undefined,
      due_at_day: form.dueAtDay ? parseInt(form.dueAtDay) : undefined,
      due_at_month: form.dueAtMonth ? parseInt(form.dueAtMonth) : undefined,
      skip_rule:
        form.skipRule !== undefined && form.skipRule !== ""
          ? form.skipRule
          : undefined,
      must_do: form.mustDo,
      start_at_date: form.startAtDate ? form.startAtDate : undefined,
      end_at_date: form.endAtDate ? form.endAtDate : undefined,
    });

    switch (timePlanReason) {
      case "standard":
        return redirect(`/app/workspace/chores/${result.new_chore.ref_id}`);

      case "for-time-plan":
        return redirect(
          withTimePlanView(
            `/app/workspace/time-plans/${result.new_time_plan_activity?.time_plan_ref_id}/${result.new_time_plan_activity?.ref_id}`,
            new URL(request.url).searchParams.get(TIME_PLAN_VIEW_PARAM),
          ),
        );
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewChore() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const [query] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const birthdayDate = loaderData.lifePlan
    ? lifePlanBirthdayDate(loaderData.lifePlan)
    : null;
  const [selectedAspect, setSelectedAspect] = useState<string>(
    loaderData.rootAspect?.ref_id ?? "",
  );

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="chores/new"
      fakeKey={"chores/new"}
      returnLocation={
        loaderData.timePlanReason === "for-time-plan"
          ? withTimePlanView(
              `/app/workspace/time-plans/${(loaderData.associatedTimePlan as TimePlan).ref_id}`,
              query.get(TIME_PLAN_VIEW_PARAM),
            )
          : "/app/workspace/chores"
      }
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Chore"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="chore-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "chore-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={false}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/is_key" />
          </FormControl>
        </Stack>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allAspects={loaderData.allAspects ?? []}
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={loaderData.allChapters ?? []}
              allGoals={loaderData.allGoals ?? []}
              birthday={birthdayDate!}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones ?? []}
            />
            <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}

        <RecurringTaskGenParamsBlock
          inputsEnabled={inputsEnabled}
          allowSkipRule
          period={RecurringTaskPeriod.DAILY}
          eisen={Eisen.REGULAR}
          difficulty={Difficulty.EASY}
          actionableFromDay={null}
          actionableFromMonth={null}
          dueAtDay={null}
          dueAtMonth={null}
          skipRule={null}
          actionData={actionData}
        />

        <FormControl fullWidth>
          <FormControlLabel
            control={<Switch name="mustDo" readOnly={!inputsEnabled} />}
            label="Must Do In Vacation"
          />
          <FieldError actionResult={actionData} fieldName="/must_do" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startAtDate" shrink>
            Start At date [Optional]
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startAtDate"
            name="startAtDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/start_at_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="endAtDate" shrink>
            End At Date [Optional]
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="endAtDate"
            name="endAtDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/end_at_date" />
        </FormControl>

        {loaderData.timePlanReason === "for-time-plan" && (
          <Stack direction="row" useFlexGap spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="timePlanActivityKind">Activity Kind</InputLabel>
              <TimePlanActivitKindSelect
                name="timePlanActivityKind"
                defaultValue={TimePlanActivityKind.FINISH}
                inputsEnabled={inputsEnabled}
              />
              <FieldError
                actionResult={actionData}
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
                actionResult={actionData}
                fieldName="/time_plan_activity_feasability"
              />
            </FormControl>
          </Stack>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/chores",
  ParamsSchema,
  {
    error: () => `There was an error creating the chore! Please try again!`,
  },
);
