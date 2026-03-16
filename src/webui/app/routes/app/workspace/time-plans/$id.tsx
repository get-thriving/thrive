import type {
  BigPlan,
  InboxTask,
  LifePlan,
  Tag,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  Workspace,
} from "@jupiter/webapi-client";
import {
  ApiError,
  RecurringTaskPeriod,
  TagNamespace,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  TimePlanActivityTarget,
  WorkspaceFeature,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import FlareIcon from "@mui/icons-material/Flare";
import FlagIcon from "@mui/icons-material/Flag";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useActionData, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { sortJournalsNaturally } from "@jupiter/core/journals/root";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { allowUserChanges } from "@jupiter/core/time_plans/source";
import { filterActivityByFeasabilityWithParents } from "@jupiter/core/time_plans/sub/activity/root";
import {
  sortTimePlansNaturally,
  timePlanAllowsInboxTasks,
} from "@jupiter/core/time_plans/root";
import { sortAspectsByTreeOrder } from "#/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { BigPlanStack } from "@jupiter/core/big_plans/component/stack";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TimeAndEffortView } from "@jupiter/core/time_plans/component/time-and-effort-view";
import { FeasabilityView } from "@jupiter/core/time_plans/component/feasaibility-view";
import { computeTimeAndEffortSummary } from "@jupiter/core/time_plans/time-and-effort-summary";
import {
  ActionSingle,
  FilterFewOptionsSpread,
  FilterManyOptions,
  NavMultipleCompact,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { JournalStack } from "@jupiter/core/journals/component/stack";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TimePlanListMergedActivities } from "@jupiter/core/time_plans/component/list-merged-activities";
import { TimePlanListByAspectActivities } from "@jupiter/core/time_plans/component/list-by-aspect-activities";
import { TimePlanListByAspectAndGoalsActivities } from "@jupiter/core/time_plans/component/list-by-aspect-and-goals-activities";
import { TimePlanTimelineMergedActivities } from "@jupiter/core/time_plans/component/timeline-merged-activities";
import { TimePlanTimelineByAspectActivities } from "@jupiter/core/time_plans/component/timeline-by-aspect-activities";
import { TimePlanTimelineByAspectAndGoalActivities } from "@jupiter/core/time_plans/component/timeline-by-aspect-and-goal-activities";
import { TimePlanStack } from "@jupiter/core/time_plans/component/stack";
import { ChapterMultiSelect } from "#/core/life_plan/sub/chapters/components/multi-select";
import { AspectMultiSelect } from "#/core/life_plan/sub/aspects/component/multi-select";
import { aDateToDate } from "#/core/common/adate";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { GoalMultiSelect } from "#/core/life_plan/sub/goals/components/multi-select";

import { fixSelectOutputEntityId, selectZod } from "~/logic/select";
import { getLoggedInApiClient } from "~/api-clients.server";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

enum Grouping {
  MERGED = "merged",
  BY_ASPECT = "by-aspect",
  BY_ASPECT_AND_GOALS = "by-aspect-and-goals",
}

enum ViewMode {
  LIST = "list",
  TIMELINE = "timeline",
}

enum GroupVisibility {
  NON_EMPTY_ONLY = "non-empty-only",
  SHOW_ALL = "show-all",
}

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("change-time-config"),
    rightNow: z.string(),
    period: z.nativeEnum(RecurringTaskPeriod),
    chapterRefIds: selectZod(z.string()),
    aspectRefIds: selectZod(z.string()),
    goalRefIds: selectZod(z.string()),
  }),
  z.object({
    intent: z.literal("change-time-config-for-generated"),
    chapterRefIds: selectZod(z.string()),
    aspectRefIds: selectZod(z.string()),
    goalRefIds: selectZod(z.string()),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_workspace: true,
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  try {
    const workspace = summaryResponse.workspace!;

    const result = await apiClient.timePlans.timePlanLoad({
      ref_id: id,
      allow_archived: true,
      include_targets: true,
      include_completed_nontarget: true,
      include_other_time_plans: true,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.TIME_PLAN],
    });

    let journalResult = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.JOURNALS)) {
      journalResult = await apiClient.journals.journalLoadForDateAndPeriod({
        right_now: result.time_plan.right_now,
        period: result.time_plan.period,
        allow_archived: false,
      });
    }

    let timeEventResult = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SCHEDULE)) {
      timeEventResult = await apiClient.calendar.calendarLoadForDateAndPeriod({
        right_now: result.time_plan.right_now,
        period: result.time_plan.period,
      });
    }

    return json({
      lifePlan: summaryResponse.life_plan as LifePlan,
      allAspects: summaryResponse.aspects,
      allChapters: summaryResponse.chapters,
      allGoals: summaryResponse.goals,
      allMilestones: summaryResponse.milestones,
      timePlan: result.time_plan,
      tags: result.tags as Array<Tag>,
      allTags: allTags.tags as Array<Tag>,
      note: result.note,
      activities: result.activities,
      aspects: result.aspects,
      chapters: result.chapters,
      goals: result.goals,
      targetInboxTasks: result.target_inbox_tasks as Array<InboxTask>,
      targetBigPlans: result.target_big_plans,
      activityDoneness: result.activity_doneness as Record<
        string,
        TimePlanActivityDoneness
      >,
      completedNontargetInboxTasks:
        result.completed_nontarget_inbox_tasks as Array<InboxTask>,
      completedNontargetBigPlans: result.completed_nottarget_big_plans,
      subPeriodTimePlans: result.sub_period_time_plans as Array<TimePlan>,
      higherTimePlan: result.higher_time_plan as TimePlan,
      previousTimePlan: result.previous_time_plan as TimePlan,
      journal: journalResult?.journal,
      subPeriodJournals: journalResult?.sub_period_journals || [],
      timeEventForInboxTasks:
        timeEventResult?.entries?.inbox_task_entries || [],
      timeEventForBigPlans: [],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "change-time-config": {
        await apiClient.timePlans.timePlanChangeTimeConfig({
          ref_id: id,
          right_now: {
            should_change: true,
            value: form.rightNow,
          },
          period: {
            should_change: true,
            value: form.period,
          },
          chapter_ref_ids:
            form.chapterRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.chapterRefIds) || [],
                }
              : { should_change: false },
          aspect_ref_ids:
            form.aspectRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.aspectRefIds) || [],
                }
              : { should_change: false },
          goal_ref_ids:
            form.goalRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.goalRefIds) || [],
                }
              : { should_change: false },
        });
        return redirect(`/app/workspace/time-plans/${id}`);
      }

      case "change-time-config-for-generated": {
        await apiClient.timePlans.timePlanChangeTimeConfig({
          ref_id: id,
          right_now: {
            should_change: false,
          },
          period: {
            should_change: false,
          },
          chapter_ref_ids:
            form.chapterRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.chapterRefIds) || [],
                }
              : { should_change: false },
          aspect_ref_ids:
            form.aspectRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.aspectRefIds) || [],
                }
              : { should_change: false },
          goal_ref_ids:
            form.goalRefIds !== undefined
              ? {
                  should_change: true,
                  value: fixSelectOutputEntityId(form.goalRefIds) || [],
                }
              : { should_change: false },
        });
        return redirect(`/app/workspace/time-plans/${id}`);
      }

      case "archive": {
        await apiClient.timePlans.timePlanArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/time-plans`);
      }

      case "remove": {
        await apiClient.timePlans.timePlanRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/time-plans`);
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

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function TimePlanView() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();

  const shouldShowALeaf = useBranchNeedsToShowLeaf();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const corePropertyEditable = allowUserChanges(loaderData.timePlan.source);
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlan.archived;

  const targetInboxTasksByRefId = new Map<string, InboxTask>(
    loaderData.targetInboxTasks.map((it) => [it.ref_id, it]),
  );
  const actitiviesByBigPlanRefId = new Map<string, TimePlanActivity>(
    loaderData.activities
      .filter((a) => a.target === TimePlanActivityTarget.BIG_PLAN)
      .map((a) => [a.target_ref_id, a]),
  );
  const targetBigPlansByRefId = new Map<string, BigPlan>(
    loaderData.targetBigPlans
      ? loaderData.targetBigPlans.map((bp) => [bp.ref_id, bp])
      : [],
  );
  const timeEventsByRefId = new Map();
  for (const e of loaderData.timeEventForInboxTasks) {
    timeEventsByRefId.set(`it:${e.inbox_task.ref_id}`, e.time_events);
  }
  // TODO(horia141): re-enable this when we have time events for big plans.
  // for (const e of loaderData.timeEventForBigPlans) {
  //   timeEventsByRefId.set(`bp:${e.big_plan.ref_id}`, e.time_events);
  // }

  const sortedSubTimePlans = sortTimePlansNaturally(
    loaderData.subPeriodTimePlans,
  );

  const [selectedGrouping, setSelectedGrouping] = useState(
    inferDefaultSelectedGrouping(topLevelInfo.workspace, loaderData.timePlan),
  );
  const [selectedView, setSelectedView] = useState<ViewMode>(
    inferDefaultSelectedView(topLevelInfo.workspace, loaderData.timePlan),
  );
  const [selectedGroupVisibility, setSelectedGroupVisibility] =
    useState<GroupVisibility>(GroupVisibility.NON_EMPTY_ONLY);
  const [selectedKinds, setSelectedKinds] = useState<TimePlanActivityKind[]>(
    [],
  );
  const [selectedFeasabilities, setSelectedFeasabilities] = useState<
    TimePlanActivityFeasability[]
  >([]);
  const [selectedDoneness, setSelectedDoneness] = useState<boolean[]>([]);

  const mustDoActivities = filterActivityByFeasabilityWithParents(
    loaderData.activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.MUST_DO,
  );
  const niceToHaveActivities = filterActivityByFeasabilityWithParents(
    loaderData.activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.NICE_TO_HAVE,
  );
  const stretchActivities = filterActivityByFeasabilityWithParents(
    loaderData.activities,
    actitiviesByBigPlanRefId,
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    TimePlanActivityFeasability.STRETCH,
  );
  const otherActivities = niceToHaveActivities.concat(stretchActivities);

  useEffect(() => {
    setSelectedGrouping(
      inferDefaultSelectedGrouping(topLevelInfo.workspace, loaderData.timePlan),
    );
    setSelectedView(
      inferDefaultSelectedView(topLevelInfo.workspace, loaderData.timePlan),
    );
    setSelectedGroupVisibility(GroupVisibility.NON_EMPTY_ONLY);
    setSelectedKinds([]);
    setSelectedFeasabilities([]);
    setSelectedDoneness([]);
  }, [topLevelInfo.workspace, loaderData.timePlan]);

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(
    loaderData.allAspects?.map((p) => [p.ref_id, p]),
  );

  const sortedGoals = sortGoalsNaturally(loaderData.allGoals || []);
  const allGoalsByRefId = new Map(
    loaderData.allGoals?.map((g) => [g.ref_id, g]),
  );

  const sortedSubJournals = sortJournalsNaturally(loaderData.subPeriodJournals);

  const timeAndEffortSummary = computeTimeAndEffortSummary({
    timePlanActivities: loaderData.activities,
    targetInboxTasksByRefId: targetInboxTasksByRefId,
    activityDoneness: loaderData.activityDoneness,
  });

  return (
    <BranchPanel
      key={`time-plan-${loaderData.timePlan.ref_id}`}
      showArchiveAndRemoveButton={corePropertyEditable}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.timePlan.archived}
      returnLocation="/app/workspace/time-plans"
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="Properties"
          actions={
            <SectionActions
              id="time-plan-properties"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "time-plan-change-time-config",
                  text: "Change Time Config",
                  value: corePropertyEditable
                    ? "change-time-config"
                    : "change-time-config-for-generated",
                  disabled: !inputsEnabled,
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <Stack
            direction={isBigScreen ? "row" : "column"}
            spacing={2}
            useFlexGap
          >
            <FormControl fullWidth={!isBigScreen}>
              <InputLabel id="rightNow" shrink margin="dense">
                The Date
              </InputLabel>
              <OutlinedInput
                type="date"
                notched
                label="rightNow"
                name="rightNow"
                readOnly={!inputsEnabled || !corePropertyEditable}
                disabled={!inputsEnabled || !corePropertyEditable}
                defaultValue={loaderData.timePlan.right_now}
              />

              <FieldError actionResult={actionData} fieldName="/rightNow" />
            </FormControl>

            <FormControl fullWidth={!isBigScreen}>
              <PeriodSelect
                labelId="period"
                label="Period"
                name="period"
                inputsEnabled={inputsEnabled && corePropertyEditable}
                defaultValue={loaderData.timePlan.period}
                compact
              />
              <FieldError actionResult={actionData} fieldName="/period" />
              <FieldError actionResult={actionData} fieldName="/status" />
            </FormControl>

            <FormControl fullWidth={!isBigScreen}>
              <TagsEditor
                name="tags_names"
                allTags={loaderData.allTags}
                defaultValue={loaderData.tags.map((t) => t.ref_id)}
                inputsEnabled={inputsEnabled}
                namespace={TagNamespace.TIME_PLAN}
                sourceEntityRefId={loaderData.timePlan.ref_id}
                aloneOnLine={!isBigScreen}
              />
            </FormControl>

            {isWorkspaceFeatureAvailable(
              topLevelInfo.workspace,
              WorkspaceFeature.LIFE_PLAN,
            ) && (
              <>
                <FormControl
                  fullWidth={!isBigScreen}
                  sx={{ width: isBigScreen ? "15%" : "100%" }}
                >
                  <AspectMultiSelect
                    name="aspectRefIds"
                    label="Aspect"
                    inputsEnabled={inputsEnabled}
                    disabled={false}
                    allAspects={loaderData.allAspects ?? []}
                    maxSelections={
                      loaderData.lifePlan.time_plan_max_life_plan_links
                    }
                    defaultValue={loaderData.aspects.map((p) => p.ref_id)}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/aspectRefIds"
                  />
                </FormControl>

                <FormControl
                  fullWidth={!isBigScreen}
                  sx={{ width: isBigScreen ? "15%" : "100%" }}
                >
                  <ChapterMultiSelect
                    name="chapterRefIds"
                    label="Chapter"
                    inputsEnabled={inputsEnabled}
                    disabled={false}
                    allChapters={loaderData.allChapters ?? []}
                    maxSelections={
                      loaderData.lifePlan.time_plan_max_life_plan_links
                    }
                    defaultValue={loaderData.chapters.map((c) => c.ref_id)}
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

                <FormControl
                  fullWidth={!isBigScreen}
                  sx={{ width: isBigScreen ? "15%" : "100%" }}
                >
                  <GoalMultiSelect
                    name="goalRefIds"
                    label="Goal"
                    inputsEnabled={inputsEnabled}
                    disabled={false}
                    allGoals={loaderData.allGoals ?? []}
                    maxSelections={
                      loaderData.lifePlan.time_plan_max_life_plan_links
                    }
                    defaultValue={loaderData.goals.map((g) => g.ref_id)}
                  />
                  <FieldError
                    actionResult={actionData}
                    fieldName="/goalRefIds"
                  />
                </FormControl>
              </>
            )}
          </Stack>
        </SectionCard>
        <SectionCard title="Notes">
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        </SectionCard>

        {(loaderData.timePlan.period === RecurringTaskPeriod.DAILY ||
          loaderData.timePlan.period === RecurringTaskPeriod.WEEKLY) && (
          <SectionCard id="time-plan-effort" title="Time & Effort">
            <TimeAndEffortView
              topLevelInfo={topLevelInfo}
              timePlan={loaderData.timePlan}
              timeAndEffortSummary={timeAndEffortSummary}
            />

            <FeasabilityView
              timePlan={loaderData.timePlan}
              timeAndEffortSummary={timeAndEffortSummary}
            />
          </SectionCard>
        )}

        <SectionCard
          id="time-plan-activities"
          title="Activities"
          actions={
            <SectionActions
              id="activities"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavMultipleCompact({
                  navs: [
                    ...(timePlanAllowsInboxTasks(loaderData.timePlan)
                      ? [
                          NavSingle({
                            text: "New Inbox Task",
                            link: `/app/workspace/inbox-tasks/new?timePlanReason=for-time-plan&timePlanRefId=${loaderData.timePlan.ref_id}`,
                          }),
                        ]
                      : []),
                    NavSingle({
                      text: "New Big Plan",
                      link: `/app/workspace/big-plans/new?timePlanReason=for-time-plan&timePlanRefId=${loaderData.timePlan.ref_id}`,
                      gatedOn: WorkspaceFeature.BIG_PLANS,
                    }),
                    ...(timePlanAllowsInboxTasks(loaderData.timePlan)
                      ? [
                          NavSingle({
                            text: "From Current Inbox Tasks",
                            link: `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-current-inbox-tasks`,
                          }),
                          NavSingle({
                            text: "From Generated Inbox Tasks",
                            link: `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-generated-inbox-tasks?showFromPeriod=${loaderData.timePlan.period}`,
                          }),
                        ]
                      : []),
                    NavSingle({
                      text: "From Current Big Plans",
                      link: `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-current-big-plans`,
                      gatedOn: WorkspaceFeature.BIG_PLANS,
                    }),
                    NavSingle({
                      text: "From Time Plans",
                      link: `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-current-time-plans/${loaderData.timePlan.ref_id}`,
                    }),
                  ],
                }),
                FilterFewOptionsSpread(
                  "View",
                  selectedView,
                  [
                    {
                      value: ViewMode.LIST,
                      text: "List",
                      icon: <ViewListIcon />,
                    },
                    {
                      value: ViewMode.TIMELINE,
                      text: "Timeline",
                      icon: <ViewTimelineIcon />,
                    },
                  ],
                  (selected) => setSelectedView(selected),
                ),
                FilterFewOptionsSpread(
                  "Grouping",
                  selectedGrouping,
                  [
                    {
                      value: Grouping.MERGED,
                      text: "Merged",
                      icon: <ViewListIcon />,
                    },
                    {
                      value: Grouping.BY_ASPECT,
                      text: "By Aspect",
                      icon: <FlareIcon />,
                      gatedOn: WorkspaceFeature.LIFE_PLAN,
                    },
                    {
                      value: Grouping.BY_ASPECT_AND_GOALS,
                      text: "By Aspect & Goals",
                      icon: <FlagIcon />,
                      gatedOn: WorkspaceFeature.LIFE_PLAN,
                    },
                  ],
                  (selected) => setSelectedGrouping(selected),
                ),
              ]}
              extraActions={[
                FilterManyOptions(
                  "Kind",
                  [
                    { value: TimePlanActivityKind.FINISH, text: "Finish" },
                    {
                      value: TimePlanActivityKind.MAKE_PROGRESS,
                      text: "Make Progress",
                    },
                  ],
                  setSelectedKinds,
                ),
                FilterManyOptions(
                  "Feasability",
                  [
                    {
                      value: TimePlanActivityFeasability.MUST_DO,
                      text: "Must Do",
                    },
                    {
                      value: TimePlanActivityFeasability.NICE_TO_HAVE,
                      text: "Nice to Have",
                    },
                    {
                      value: TimePlanActivityFeasability.STRETCH,
                      text: "Stretch",
                    },
                  ],
                  setSelectedFeasabilities,
                ),
                FilterManyOptions(
                  "Done",
                  [
                    { value: true, text: "Done" },
                    { value: false, text: "Not Done" },
                  ],
                  setSelectedDoneness,
                ),
                FilterFewOptionsSpread(
                  "Groups",
                  selectedGroupVisibility,
                  [
                    {
                      value: GroupVisibility.NON_EMPTY_ONLY,
                      text: "Only non-empty",
                      icon: <ViewListIcon />,
                    },
                    {
                      value: GroupVisibility.SHOW_ALL,
                      text: "Show all",
                      icon: <ViewListIcon />,
                      gatedOn: WorkspaceFeature.LIFE_PLAN,
                    },
                  ],
                  (selected) => setSelectedGroupVisibility(selected),
                ),
              ]}
            />
          }
        >
          {loaderData.activities.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no activities to show. You can create a new activity."
              newEntityLocations={
                timePlanAllowsInboxTasks(loaderData.timePlan)
                  ? `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-current-inbox-tasks`
                  : `/app/workspace/time-plans/${loaderData.timePlan.ref_id}/add-from-current-big-plans`
              }
              helpSubject={DocsHelpSubject.TIME_PLANS}
            />
          )}

          {selectedView === ViewMode.LIST &&
            selectedGrouping === Grouping.MERGED && (
              <TimePlanListMergedActivities
                mustDoActivities={mustDoActivities}
                niceToHaveActivities={niceToHaveActivities}
                stretchActivities={stretchActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
              />
            )}

          {selectedView === ViewMode.LIST &&
            selectedGrouping === Grouping.BY_ASPECT && (
              <TimePlanListByAspectActivities
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={sortedAspects}
                aspectsByRefId={allAspectsByRefId}
                showEmptyGroups={
                  selectedGroupVisibility === GroupVisibility.SHOW_ALL
                }
              />
            )}

          {selectedView === ViewMode.LIST &&
            selectedGrouping === Grouping.BY_ASPECT_AND_GOALS && (
              <TimePlanListByAspectAndGoalsActivities
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={sortedAspects}
                aspectsByRefId={allAspectsByRefId}
                goals={sortedGoals}
                goalsByRefId={allGoalsByRefId}
                showEmptyGroups={
                  selectedGroupVisibility === GroupVisibility.SHOW_ALL
                }
              />
            )}

          {selectedView === ViewMode.TIMELINE &&
            selectedGrouping === Grouping.MERGED && (
              <TimePlanTimelineMergedActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                niceToHaveActivities={niceToHaveActivities}
                stretchActivities={stretchActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
              />
            )}

          {selectedView === ViewMode.TIMELINE &&
            selectedGrouping === Grouping.BY_ASPECT && (
              <TimePlanTimelineByAspectActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={sortedAspects}
                aspectsByRefId={allAspectsByRefId}
                showEmptyGroups={
                  selectedGroupVisibility === GroupVisibility.SHOW_ALL
                }
              />
            )}

          {selectedView === ViewMode.TIMELINE &&
            selectedGrouping === Grouping.BY_ASPECT_AND_GOALS && (
              <TimePlanTimelineByAspectAndGoalActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={sortedAspects}
                aspectsByRefId={allAspectsByRefId}
                goals={sortedGoals}
                goalsByRefId={allGoalsByRefId}
                showEmptyGroups={
                  selectedGroupVisibility === GroupVisibility.SHOW_ALL
                }
              />
            )}
        </SectionCard>

        {loaderData.completedNontargetInboxTasks.length > 0 && (
          <SectionCard
            id="time-plan-untracked-inbox-tasks"
            title="Completed & Untracked Inbox Tasks"
          >
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showEisen: true,
                showDifficulty: true,
              }}
              inboxTasks={loaderData.completedNontargetInboxTasks}
            />
          </SectionCard>
        )}

        {loaderData.completedNontargetBigPlans &&
          loaderData.completedNontargetBigPlans.length > 0 && (
            <SectionCard
              id="time-plan-untracked-big-plans"
              title="Completed & Untracked Big Plans"
            >
              <BigPlanStack
                topLevelInfo={topLevelInfo}
                showOptions={{
                  showDonePct: true,
                  showStatus: true,
                  showLifePlan: true,
                  showEisen: true,
                  showDifficulty: true,
                  showActionableDate: true,
                  showDueDate: true,
                  showHandleMarkDone: false,
                  showHandleMarkNotDone: false,
                }}
                bigPlans={loaderData.completedNontargetBigPlans}
              />
            </SectionCard>
          )}

        {sortedSubTimePlans.length > 0 && (
          <SectionCard id="time-plan-lower" title="Lower Time Plans">
            <TimePlanStack
              topLevelInfo={topLevelInfo}
              timePlans={sortedSubTimePlans}
            />
          </SectionCard>
        )}

        {loaderData.higherTimePlan && (
          <SectionCard id="time-plan-higher" title="Higher Time Plan">
            <TimePlanStack
              topLevelInfo={topLevelInfo}
              timePlans={[loaderData.higherTimePlan]}
            />
          </SectionCard>
        )}

        {loaderData.previousTimePlan && (
          <SectionCard id="time-plan-previous" title="Previous Time Plan">
            <TimePlanStack
              topLevelInfo={topLevelInfo}
              timePlans={[loaderData.previousTimePlan]}
            />
          </SectionCard>
        )}

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.JOURNALS,
        ) &&
          (loaderData.journal || sortedSubJournals.length > 0) && (
            <SectionCard id="time-plan-journal" title="Journal For This Plan">
              {loaderData.journal && (
                <JournalStack
                  topLevelInfo={topLevelInfo}
                  journals={[loaderData.journal]}
                />
              )}

              {sortedSubJournals.length > 0 && (
                <JournalStack
                  topLevelInfo={topLevelInfo}
                  journals={sortedSubJournals}
                />
              )}
            </SectionCard>
          )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/time-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}. Please try again!`,
  },
);

function inferDefaultSelectedGrouping(
  workspace: Workspace,
  timePlan: TimePlan,
) {
  if (!isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)) {
    return Grouping.MERGED;
  }

  switch (timePlan.period) {
    case RecurringTaskPeriod.DAILY:
    case RecurringTaskPeriod.WEEKLY:
      return Grouping.MERGED;
    case RecurringTaskPeriod.MONTHLY:
      return Grouping.BY_ASPECT;
    case RecurringTaskPeriod.QUARTERLY:
    case RecurringTaskPeriod.YEARLY:
      return Grouping.BY_ASPECT_AND_GOALS;
  }
}

function inferDefaultSelectedView(workspace: Workspace, timePlan: TimePlan) {
  if (!isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)) {
    return ViewMode.LIST;
  }

  switch (timePlan.period) {
    case RecurringTaskPeriod.DAILY:
    case RecurringTaskPeriod.WEEKLY:
    case RecurringTaskPeriod.MONTHLY:
      return ViewMode.LIST;
    case RecurringTaskPeriod.QUARTERLY:
    case RecurringTaskPeriod.YEARLY:
      return ViewMode.TIMELINE;
  }
}
