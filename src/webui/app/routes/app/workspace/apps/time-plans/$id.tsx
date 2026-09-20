import type {
  BigPlan,
  BigPlanStats,
  Contact,
  Habit,
  HabitStack,
  Chore,
  ChoreStack,
  InboxTask,
  TodoTask,
  LifePlan,
  Tag,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
} from "@jupiter/webapi-client";
import {
  Eisen,
  NamedEntityTag,
  RecurringTaskPeriod,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import type { DragStart, DropResult } from "@hello-pangea/dnd";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  UPDATE_INBOX_TASK_STATUS,
  inboxTaskKanbanMoveArgs,
} from "@jupiter/core/apps/time_plans/store/mutations/update-inbox-task-status";
import { RESCHEDULE_CALENDAR_EVENT } from "@jupiter/core/apps/time_plans/store/mutations/reschedule-calendar-event";
import {
  PLACE_TIME_EVENTS,
  placeTimeEventsArgsFromCalendar,
} from "@jupiter/core/apps/time_plans/store/mutations/place-time-events";
import type {
  CalendarPlaceFields,
  CalendarRescheduleFields,
} from "@jupiter/core/calendar/component/event-drag";
import {
  selectCalendarEntries,
  snapshotFromCalendarEntries,
} from "@jupiter/core/apps/time_plans/store/calendar";
import { useTimePlanMutation } from "@jupiter/core/apps/time_plans/store/mutation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FlareIcon from "@mui/icons-material/Flare";
import FlagIcon from "@mui/icons-material/Flag";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useRevalidateOnReturn } from "@jupiter/core/apps/time_plans/store/revalidate-on-return";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useLocation,
  useMatches,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { sortJournalsNaturally } from "@jupiter/core/apps/journals/root";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { allowUserChanges } from "@jupiter/core/apps/time_plans/source";
import {
  filterActivitiesForAspects,
  parentActivitiesByTargetRefId,
} from "@jupiter/core/apps/time_plans/sub/activity/group-by-parent";
import { filterActivityByFeasabilityWithParents } from "@jupiter/core/apps/time_plans/sub/activity/root";
import { isTimePlanActivityInboxTaskTarget } from "@jupiter/core/apps/time_plans/sub/activity/target-wire";
import {
  sortTimePlansNaturally,
  timePlanAllowsCalendarView,
  timePlanAllowsInboxTasks,
  timePlanAllowsKanbanViews,
  timePlanShowsBigPlanProgress,
  timePlanShowsTimeAndEffort,
} from "@jupiter/core/apps/time_plans/root";
import {
  resolveTimePlanGrouping,
  TIME_PLAN_GROUPING_PARAM,
  TimePlanGrouping,
} from "@jupiter/core/apps/time_plans/grouping";
import {
  resolveTimePlanViewMode,
  TIME_PLAN_VIEW_PARAM,
  TimePlanViewMode,
  timePlanPathIsAddingTimeEvent,
  timePlanViewModeIsAllowed,
  timePlanViewModeIsCalendar,
  withTimePlanDisplay,
} from "@jupiter/core/apps/time_plans/view-mode";
import { eisenIcon, eisenName } from "@jupiter/core/common/eisen";
import { InboxTaskKanbanBoard } from "@jupiter/core/common/sub/inbox_tasks/component/kanban-board";
import {
  SmallScreenKanban,
  SmallScreenKanbanByEisen,
} from "@jupiter/core/common/sub/inbox_tasks/component/small-screen-kanban";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { ActionableTime } from "@jupiter/core/infra/actionable-time";
import { type InboxTaskOptimisticState } from "@jupiter/core/common/sub/inbox_tasks/root";
import { entityLinkRefIdFromWire } from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/apps/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/apps/life_plan/sub/goals/root";
import { BigPlanStack } from "@jupiter/core/apps/big_plans/component/stack";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import { TimeAndEffortView } from "@jupiter/core/apps/time_plans/component/time-and-effort-view";
import { BigPlanProgressView } from "@jupiter/core/apps/time_plans/component/big-plan-progress-view";
import { FeasabilityView } from "@jupiter/core/apps/time_plans/component/feasaibility-view";
import { computeTimeAndEffortSummary } from "@jupiter/core/apps/time_plans/time-and-effort-summary";
import { computeBigPlanProgressSummary } from "@jupiter/core/apps/time_plans/big-plan-progress-summary";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  FilterOptionSeparator,
  NavMultipleCompact,
  NavSeparator,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { JournalStack } from "@jupiter/core/apps/journals/component/stack";
import { TimePlanEditor } from "@jupiter/core/apps/time_plans/component/editor";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TimePlanListMergedActivities } from "@jupiter/core/apps/time_plans/component/list-merged-activities";
import { TimePlanListByAspectActivities } from "@jupiter/core/apps/time_plans/component/list-by-aspect-activities";
import { TimePlanListByAspectAndGoalsActivities } from "@jupiter/core/apps/time_plans/component/list-by-aspect-and-goals-activities";
import { TimePlanTimelineMergedActivities } from "@jupiter/core/apps/time_plans/component/timeline-merged-activities";
import { TimePlanTimelineByAspectActivities } from "@jupiter/core/apps/time_plans/component/timeline-by-aspect-activities";
import { TimePlanTimelineByAspectAndGoalActivities } from "@jupiter/core/apps/time_plans/component/timeline-by-aspect-and-goal-activities";
import { TimePlanCalendarActivities } from "@jupiter/core/apps/time_plans/component/calendar-activities";
import { TimePlanStack } from "@jupiter/core/apps/time_plans/component/stack";
import {
  TimePlanStoreProvider,
  useTimePlanStore,
} from "@jupiter/core/apps/time_plans/store/context";
import {
  snapshotFromTimePlanActivityLoad,
  snapshotFromTimePlanLoad,
} from "@jupiter/core/apps/time_plans/store/snapshots";
import {
  latestEntities,
  selectTimePlanView,
} from "@jupiter/core/apps/time_plans/store/view";
import {
  fixSelectOutputEntityId,
  selectZod,
} from "@jupiter/core/common/select-form";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import {
  ignoringTimePlanQueryChanges,
  TIME_PLAN_OWNED_PARAMS,
} from "@jupiter/core/apps/time_plans/should-revalidate";

import { getLoggedInApiClient } from "~/api-clients.server";
import type { loader as timePlanActivityLoader } from "~/routes/app/workspace/apps/time-plans/$id/$activityId";
import { newURLParams } from "~/logic/navigation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const EISENS = [
  Eisen.IMPORTANT_AND_URGENT,
  Eisen.URGENT,
  Eisen.IMPORTANT,
  Eisen.REGULAR,
];

const TIME_PLAN_ACTIVITY_KIND_VALUES = new Set<string>(
  Object.values(TimePlanActivityKind),
);

type TimePlanActivityFilterValue =
  | TimePlanActivityKind
  | TimePlanActivityFeasability
  | boolean;

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
  z.object({
    intent: z.literal("create-publish"),
    publishOwner: z.string(),
  }),
  z.object({
    intent: z.literal("activate-publish"),
    publishEntityRefId: z.string(),
  }),
  z.object({
    intent: z.literal("to-draft-publish"),
    publishEntityRefId: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    // Summaries, the time plan, and tags do not depend on each other — start
    // them together instead of waiting for summaries before the heavy load.
    const [summaryResponse, result, allTags] = await Promise.all([
      apiClient.application.getSummaries({
        include_workspace: true,
        include_life_plan: true,
        include_aspects: true,
        include_chapters: true,
        include_goals: true,
        include_milestones: true,
        include_big_plans: true,
      }),
      apiClient.timePlans.timePlanLoad({
        ref_id: id,
        allow_archived: true,
        include_targets: true,
        include_completed_nontarget: true,
        include_other_time_plans: true,
      }),
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
    ]);

    const workspace = summaryResponse.workspace!;

    const habitsAvailable = isWorkspaceFeatureAvailable(
      workspace,
      WorkspaceFeature.HABITS,
    );
    const choresAvailable = isWorkspaceFeatureAvailable(
      workspace,
      WorkspaceFeature.CHORES,
    );
    const emptyFind = { entries: [] };

    // Journal and calendar need the time plan's dates and workspace features,
    // but not each other. The lists the activity panels pick from are
    // workspace-wide and don't change while a plan is being looked at, so they
    // are loaded here once rather than with every panel.
    const [
      journalResult,
      timeEventResult,
      allContacts,
      stacksResponse,
      choreStacksResponse,
      habitsResponse,
      choresResponse,
    ] = await Promise.all([
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.JOURNALS)
        ? apiClient.journals.journalLoadForDateAndPeriod({
            right_now: result.time_plan.right_now,
            period: result.time_plan.period,
            allow_archived: false,
          })
        : Promise.resolve(undefined),
      isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SCHEDULE)
        ? apiClient.calendar.calendarLoadForDateAndPeriod({
            right_now: result.time_plan.right_now,
            period: result.time_plan.period,
          })
        : Promise.resolve(undefined),
      apiClient.contacts.contactFind({
        allow_archived: false,
      }),
      habitsAvailable
        ? apiClient.habits.habitStackFind({
            allow_archived: false,
            include_tags: false,
            include_notes: false,
            include_life_plan: false,
            include_habits: false,
          })
        : Promise.resolve(emptyFind),
      choresAvailable
        ? apiClient.chores.choreStackFind({
            allow_archived: false,
            include_tags: false,
            include_notes: false,
            include_life_plan: false,
            include_chores: false,
          })
        : Promise.resolve(emptyFind),
      habitsAvailable
        ? apiClient.habits.habitFind({
            allow_archived: false,
            include_tags: false,
            include_notes: false,
            include_life_plan: false,
            include_inbox_tasks: false,
          })
        : Promise.resolve(emptyFind),
      choresAvailable
        ? apiClient.chores.choreFind({
            allow_archived: false,
            include_tags: false,
            include_notes: false,
            include_life_plan: false,
            include_inbox_tasks: false,
          })
        : Promise.resolve(emptyFind),
    ]);

    return json({
      lifePlan: summaryResponse.life_plan as LifePlan,
      allAspects: summaryResponse.aspects,
      allChapters: summaryResponse.chapters,
      allGoals: summaryResponse.goals,
      allMilestones: summaryResponse.milestones,
      allBigPlans: summaryResponse.big_plans,
      // What the activity panels' editors pick from.
      allContacts: allContacts.contacts as Array<Contact>,
      allStacks: stacksResponse.entries.map((entry) => entry.habit_stack),
      allChoreStacks: choreStacksResponse.entries.map(
        (entry) => entry.chore_stack,
      ) as Array<ChoreStack>,
      allHabits: habitsResponse.entries.map(
        (entry) => entry.habit,
      ) as Array<Habit>,
      allChores: choresResponse.entries.map(
        (entry) => entry.chore,
      ) as Array<Chore>,
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
      bigPlanStats: result.big_plan_stats,
      targetTodoTasks: result.target_todo_tasks,
      targetHabits: result.target_habits,
      targetHabitStacks: result.target_habit_stacks,
      targetChoreStacks: result.target_chore_stacks,
      targetChores: result.target_chores,
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
      calendarEntries: timeEventResult?.entries ?? null,
      calendarPeriodStartDate: timeEventResult?.period_start_date ?? null,
      calendarPeriodEndDate: timeEventResult?.period_end_date ?? null,
      calendarAdditionalTimezones: timeEventResult?.additional_timezones ?? [],
      activityTimeEventBlocks: result.activity_time_event_blocks || [],
      publishEntity: result.publish_entity ?? null,
      owner: result.owner,
      accessStatus: result.access_status ?? null,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  // The form posts to this very page, so the way the plan is being looked at
  // comes along with it and can be handed back on the way out.
  const timePlanLocation = withTimePlanDisplay(
    `/app/workspace/apps/time-plans/${id}`,
    new URL(request.url).searchParams,
  );

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
        return redirect(timePlanLocation);
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
        return redirect(timePlanLocation);
      }

      case "archive": {
        await apiClient.timePlans.timePlanArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/time-plans`);
      }

      case "remove": {
        await apiClient.timePlans.timePlanRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/apps/time-plans`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(timePlanLocation);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(timePlanLocation);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(timePlanLocation);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

// The kanban boards take overrides for tasks being moved; here the store
// already holds the moved tasks.
const NO_OPTIMISTIC_UPDATES: { [key: string]: InboxTaskOptimisticState } = {};

// The loader keys off the plan's id alone, so opening one of the plan's
// panels - which is a query string away - doesn't reload the plan, its
// activities and the calendar of its period alongside the panel.
export const shouldRevalidate: ShouldRevalidateFunction =
  ignoringTimePlanQueryChanges(basicShouldRevalidate, TIME_PLAN_OWNED_PARAMS);

const TIME_PLAN_ACTIVITY_ROUTE_ID =
  "routes/app/workspace/apps/time-plans/$id/$activityId";

export default function TimePlanView() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const activityLoaderData = useMatches().find(
    (match) => match.id === TIME_PLAN_ACTIVITY_ROUTE_ID,
  )?.data as SerializeFrom<typeof timePlanActivityLoader> | undefined;

  // The entities of the plan live in a store that both this route's loader and
  // the activity panel's seed, so local edits can show up without reloading
  // everything.
  const planSnapshot = useMemo(
    () => snapshotFromTimePlanLoad(loaderData),
    [loaderData],
  );
  const activitySnapshot = useMemo(
    () =>
      activityLoaderData === undefined
        ? undefined
        : snapshotFromTimePlanActivityLoad(activityLoaderData),
    [activityLoaderData],
  );
  const calendarSnapshot = useMemo(
    () => snapshotFromCalendarEntries(loaderData.calendarEntries),
    [loaderData.calendarEntries],
  );
  const storeSources = useMemo(
    () => ({
      plan: planSnapshot,
      activity: activitySnapshot,
      calendar: calendarSnapshot,
    }),
    [planSnapshot, activitySnapshot, calendarSnapshot],
  );

  return (
    <TimePlanStoreProvider sources={storeSources}>
      <TimePlanViewContent />
    </TimePlanStoreProvider>
  );
}

function TimePlanViewContent() {
  const rawLoaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const { entities, pendingMutations } = useTimePlanStore();
  // Local edits keep the view current while it's the only thing changing the
  // plan; coming back after a while picks up what changed elsewhere.
  useRevalidateOnReturn(pendingMutations);
  const view = useMemo(
    () => selectTimePlanView(entities, rawLoaderData.timePlan),
    [entities, rawLoaderData.timePlan],
  );
  const calendarEntries = useMemo(
    () =>
      selectCalendarEntries(
        rawLoaderData.calendarEntries,
        entities,
        rawLoaderData.timePlan.ref_id,
      ),
    [rawLoaderData.calendarEntries, entities, rawLoaderData.timePlan.ref_id],
  );
  // The entities come from the store, so they reflect local edits; the rest
  // is straight from the loader.
  const loaderData = {
    ...rawLoaderData,
    ...view,
    calendarEntries,
    completedNontargetInboxTasks: latestEntities(
      entities.inboxTasks,
      rawLoaderData.completedNontargetInboxTasks,
    ),
    completedNontargetBigPlans:
      rawLoaderData.completedNontargetBigPlans &&
      latestEntities(
        entities.bigPlans,
        rawLoaderData.completedNontargetBigPlans,
      ),
  };
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const [query, setQuery] = useSearchParams();
  const location = useLocation();

  const shouldShowALeaf = useBranchNeedsToShowLeaf();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const corePropertyEditable = allowUserChanges(loaderData.timePlan.source);
  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.timePlan.archived &&
    accessStatusAllowsWriterOrAbove(loaderData.accessStatus);

  const targetInboxTasksByRefId = new Map<string, InboxTask>(
    loaderData.targetInboxTasks.map((it) => [it.ref_id, it]),
  );

  const inboxTasksByRefId: { [key: string]: InboxTask } = {};
  for (const it of loaderData.targetInboxTasks) {
    inboxTasksByRefId[it.ref_id] = it;
  }

  const activityByInboxTaskRefId = new Map<string, TimePlanActivity>(
    loaderData.activities
      .filter((a) => isTimePlanActivityInboxTaskTarget(a.target))
      .map((a) => [entityLinkRefIdFromWire(a.target), a]),
  );

  const [draggedInboxTaskId, setDraggedInboxTaskId] = useState<
    string | undefined
  >(undefined);

  // Moving a card is a local edit: it lands in its new column right away, and
  // saving it doesn't reload the plan. Concurrent moves don't cancel each other.
  const { run: runUpdateInboxTaskStatus } = useTimePlanMutation(
    UPDATE_INBOX_TASK_STATUS,
  );

  // Moving or stretching an event on the calendar is a local edit too.
  const { run: runRescheduleCalendarEvent } = useTimePlanMutation(
    RESCHEDULE_CALENDAR_EVENT,
  );
  const handleCalendarReschedule = useCallback(
    (fields: CalendarRescheduleFields) =>
      runRescheduleCalendarEvent({
        ...fields,
        modifiedTime: new Date().toISOString(),
      }),
    [runRescheduleCalendarEvent],
  );
  const { run: runPlaceTimeEvents } = useTimePlanMutation(PLACE_TIME_EVENTS);
  const handleCalendarPlace = useCallback(
    (fields: CalendarPlaceFields) =>
      runPlaceTimeEvents(
        placeTimeEventsArgsFromCalendar(
          fields,
          crypto.randomUUID(),
          new Date().toISOString(),
        ),
      ),
    [runPlaceTimeEvents],
  );

  function onDragStart(start: DragStart) {
    setDraggedInboxTaskId(start.draggableId);
  }

  function onDragEnd(result: DropResult) {
    setDraggedInboxTaskId(undefined);

    if (!result.destination) {
      return;
    }

    const inboxTask = inboxTasksByRefId[result.draggableId];
    if (inboxTask === undefined) {
      return;
    }

    const args = inboxTaskKanbanMoveArgs(
      inboxTask,
      result.destination.droppableId,
      new Date().toISOString(),
    );
    if (args !== null) {
      runUpdateInboxTaskStatus(args);
    }
  }

  const parentActivitiesByRefId = parentActivitiesByTargetRefId(
    loaderData.activities,
  );
  const targetBigPlansByRefId = new Map<string, BigPlan>(
    loaderData.targetBigPlans
      ? loaderData.targetBigPlans.map((bp) => [bp.ref_id, bp])
      : [],
  );
  const bigPlanStatsByRefId = new Map<string, BigPlanStats>(
    (loaderData.bigPlanStats ?? []).map((stats) => [
      stats.big_plan_ref_id,
      stats,
    ]),
  );
  const targetTodoTasksByRefId = new Map<string, TodoTask>(
    loaderData.targetTodoTasks
      ? loaderData.targetTodoTasks.map((tt) => [tt.ref_id, tt])
      : [],
  );
  const targetHabitsByRefId = new Map<string, Habit>(
    loaderData.targetHabits
      ? loaderData.targetHabits.map((h) => [h.ref_id, h])
      : [],
  );
  const targetHabitStacksByRefId = new Map<string, HabitStack>(
    loaderData.targetHabitStacks
      ? loaderData.targetHabitStacks.map((stack) => [stack.ref_id, stack])
      : [],
  );
  const targetChoreStacksByRefId = new Map<string, ChoreStack>(
    loaderData.targetChoreStacks
      ? loaderData.targetChoreStacks.map((stack) => [stack.ref_id, stack])
      : [],
  );
  const targetChoresByRefId = new Map<string, Chore>(
    loaderData.targetChores
      ? loaderData.targetChores.map((c) => [c.ref_id, c])
      : [],
  );
  const timeEventsByRefId = new Map();
  for (const e of loaderData.calendarEntries?.todo_task_entries ?? []) {
    timeEventsByRefId.set(`it:${e.inbox_task.ref_id}`, e.time_events);
  }
  for (const e of loaderData.calendarEntries?.big_plan_entries ?? []) {
    timeEventsByRefId.set(`bp:${e.big_plan.ref_id}`, e.time_events);
  }
  for (const block of loaderData.activityTimeEventBlocks) {
    const { refId } = parseEntityLinkStd(block.owner);
    const key = `tpa:${refId}`;
    const existing = timeEventsByRefId.get(key) ?? [];
    existing.push(block);
    timeEventsByRefId.set(key, existing);
  }

  const sortedSubTimePlans = sortTimePlansNaturally(
    loaderData.subPeriodTimePlans,
  );

  // The view and grouping live in the URL rather than in here, so a reload -
  // or coming back from one of the panels this plan opens - shows the same
  // ones again. Adding a time event is done against the calendar of the
  // period, so that leaf puts it on screen even when the URL is still
  // carrying another view to restore when the adding is done.
  const timePlanViewParam = query.get(TIME_PLAN_VIEW_PARAM);
  const isAddingTimeEvent = timePlanPathIsAddingTimeEvent(location.pathname);
  const resolvedView = resolveTimePlanViewMode(
    timePlanViewParam,
    topLevelInfo.workspace,
    loaderData.timePlan,
  );
  const selectedView =
    isAddingTimeEvent &&
    !timePlanViewModeIsCalendar(resolvedView) &&
    timePlanViewModeIsAllowed(
      TimePlanViewMode.CALENDAR,
      topLevelInfo.workspace,
      loaderData.timePlan,
    )
      ? TimePlanViewMode.CALENDAR
      : resolvedView;
  const selectedGrouping = resolveTimePlanGrouping(
    query.get(TIME_PLAN_GROUPING_PARAM),
    topLevelInfo.workspace,
    loaderData.timePlan,
  );

  function setSelectedView(view: TimePlanViewMode) {
    setQuery(newURLParams(query, TIME_PLAN_VIEW_PARAM, view), {
      replace: true,
      preventScrollReset: true,
    });
  }

  function setSelectedGrouping(grouping: TimePlanGrouping) {
    setQuery(newURLParams(query, TIME_PLAN_GROUPING_PARAM, grouping), {
      replace: true,
      preventScrollReset: true,
    });
  }

  const [selectedGroupVisibility, setSelectedGroupVisibility] =
    useState<GroupVisibility>(GroupVisibility.NON_EMPTY_ONLY);
  const [selectedKinds, setSelectedKinds] = useState<TimePlanActivityKind[]>(
    [],
  );
  const [selectedFeasabilities, setSelectedFeasabilities] = useState<
    TimePlanActivityFeasability[]
  >([]);
  const [selectedDoneness, setSelectedDoneness] = useState<boolean[]>([]);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);

  const groupingMaps = {
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    targetTodoTasksByRefId,
    targetHabitsByRefId,
    targetHabitStacksByRefId,
    targetChoreStacksByRefId,
    targetChoresByRefId,
  };

  const mustDoActivities = filterActivitiesForAspects(
    filterActivityByFeasabilityWithParents(
      loaderData.activities,
      parentActivitiesByRefId,
      targetInboxTasksByRefId,
      TimePlanActivityFeasability.MUST_DO,
    ),
    selectedAspects,
    groupingMaps,
  );
  const niceToHaveActivities = filterActivitiesForAspects(
    filterActivityByFeasabilityWithParents(
      loaderData.activities,
      parentActivitiesByRefId,
      targetInboxTasksByRefId,
      TimePlanActivityFeasability.NICE_TO_HAVE,
    ),
    selectedAspects,
    groupingMaps,
  );
  const stretchActivities = filterActivitiesForAspects(
    filterActivityByFeasabilityWithParents(
      loaderData.activities,
      parentActivitiesByRefId,
      targetInboxTasksByRefId,
      TimePlanActivityFeasability.STRETCH,
    ),
    selectedAspects,
    groupingMaps,
  );
  const otherActivities = niceToHaveActivities.concat(stretchActivities);

  useEffect(() => {
    setSelectedGroupVisibility(GroupVisibility.NON_EMPTY_ONLY);
    setSelectedKinds([]);
    setSelectedFeasabilities([]);
    setSelectedDoneness([]);
    setSelectedAspects([]);
  }, [topLevelInfo.workspace, loaderData.timePlan]);

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const visibleAspects =
    selectedAspects.length === 0
      ? sortedAspects
      : sortedAspects.filter((aspect) =>
          selectedAspects.includes(aspect.ref_id),
        );
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
    completedNontargetInboxTasks: loaderData.completedNontargetInboxTasks ?? [],
    targetBigPlansByRefId: targetBigPlansByRefId,
    targetHabitsByRefId: targetHabitsByRefId,
    targetChoresByRefId: targetChoresByRefId,
    targetTodoTasksByRefId: targetTodoTasksByRefId,
  });
  const bigPlanProgressSummary = computeBigPlanProgressSummary({
    timePlanActivities: loaderData.activities,
    targetBigPlansByRefId: targetBigPlansByRefId,
    bigPlanStatsByRefId: bigPlanStatsByRefId,
    activityDoneness: loaderData.activityDoneness,
    completedNontargetBigPlans: loaderData.completedNontargetBigPlans ?? [],
  });

  // The activities as the list view shows them. The calendar view shows the
  // very same thing in a column next to the calendar itself, so everything
  // there says its piece as briefly as it can. On a small screen that list
  // sits in a tab of its own, with the whole width, so it isn't compact.
  const activitiesAreCompact =
    timePlanViewModeIsCalendar(selectedView) && isBigScreen;
  const activitiesAsList = (() => {
    switch (selectedGrouping) {
      case TimePlanGrouping.MERGED:
        return (
          <TimePlanListMergedActivities
            mustDoActivities={mustDoActivities}
            niceToHaveActivities={niceToHaveActivities}
            stretchActivities={stretchActivities}
            targetInboxTasksByRefId={targetInboxTasksByRefId}
            targetBigPlansByRefId={targetBigPlansByRefId}
            bigPlanStatsByRefId={bigPlanStatsByRefId}
            targetTodoTasksByRefId={targetTodoTasksByRefId}
            targetHabitsByRefId={targetHabitsByRefId}
            targetHabitStacksByRefId={targetHabitStacksByRefId}
            targetChoreStacksByRefId={targetChoreStacksByRefId}
            targetChoresByRefId={targetChoresByRefId}
            activityDoneness={loaderData.activityDoneness}
            timeEventsByRefId={timeEventsByRefId}
            selectedKinds={selectedKinds}
            selectedFeasabilities={selectedFeasabilities}
            selectedDoneness={selectedDoneness}
            compact={activitiesAreCompact}
          />
        );

      case TimePlanGrouping.BY_ASPECT:
        return (
          <TimePlanListByAspectActivities
            mustDoActivities={mustDoActivities}
            otherActivities={otherActivities}
            targetInboxTasksByRefId={targetInboxTasksByRefId}
            targetBigPlansByRefId={targetBigPlansByRefId}
            bigPlanStatsByRefId={bigPlanStatsByRefId}
            targetTodoTasksByRefId={targetTodoTasksByRefId}
            targetHabitsByRefId={targetHabitsByRefId}
            targetHabitStacksByRefId={targetHabitStacksByRefId}
            targetChoreStacksByRefId={targetChoreStacksByRefId}
            targetChoresByRefId={targetChoresByRefId}
            activityDoneness={loaderData.activityDoneness}
            timeEventsByRefId={timeEventsByRefId}
            selectedKinds={selectedKinds}
            selectedFeasabilities={selectedFeasabilities}
            selectedDoneness={selectedDoneness}
            aspects={visibleAspects}
            aspectsByRefId={allAspectsByRefId}
            showEmptyGroups={
              selectedGroupVisibility === GroupVisibility.SHOW_ALL
            }
            compact={activitiesAreCompact}
          />
        );

      case TimePlanGrouping.BY_ASPECT_AND_GOALS:
        return (
          <TimePlanListByAspectAndGoalsActivities
            mustDoActivities={mustDoActivities}
            otherActivities={otherActivities}
            targetInboxTasksByRefId={targetInboxTasksByRefId}
            targetBigPlansByRefId={targetBigPlansByRefId}
            bigPlanStatsByRefId={bigPlanStatsByRefId}
            targetTodoTasksByRefId={targetTodoTasksByRefId}
            targetHabitsByRefId={targetHabitsByRefId}
            targetHabitStacksByRefId={targetHabitStacksByRefId}
            targetChoreStacksByRefId={targetChoreStacksByRefId}
            targetChoresByRefId={targetChoresByRefId}
            activityDoneness={loaderData.activityDoneness}
            timeEventsByRefId={timeEventsByRefId}
            selectedKinds={selectedKinds}
            selectedFeasabilities={selectedFeasabilities}
            selectedDoneness={selectedDoneness}
            aspects={visibleAspects}
            aspectsByRefId={allAspectsByRefId}
            goals={sortedGoals}
            goalsByRefId={allGoalsByRefId}
            showEmptyGroups={
              selectedGroupVisibility === GroupVisibility.SHOW_ALL
            }
            compact={activitiesAreCompact}
          />
        );
    }
  })();

  return (
    <BranchPanel
      key={`time-plan-${loaderData.timePlan.ref_id}`}
      entityType={NamedEntityTag.TIME_PLAN}
      entityRefId={loaderData.timePlan.ref_id}
      showArchiveAndRemoveButton={corePropertyEditable}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.timePlan.archived}
      returnLocation="/app/workspace/apps/time-plans"
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
      accessable
      accessOwner={loaderData.owner}
      accessStatus={loaderData.accessStatus}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <GlobalError actionResult={actionData} />
        <TimePlanEditor
          timePlan={loaderData.timePlan}
          tags={loaderData.tags}
          allTags={loaderData.allTags}
          aspects={loaderData.aspects}
          chapters={loaderData.chapters}
          goals={loaderData.goals}
          lifePlan={loaderData.lifePlan}
          allAspects={loaderData.allAspects ?? undefined}
          allChapters={loaderData.allChapters ?? undefined}
          allGoals={loaderData.allGoals ?? undefined}
          allMilestones={loaderData.allMilestones ?? undefined}
          inputsEnabled={inputsEnabled}
          corePropertyEditable={corePropertyEditable}
          topLevelInfo={topLevelInfo}
          actionResult={actionData}
        />
        <SectionCard title="Notes">
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        </SectionCard>

        {timePlanShowsTimeAndEffort(loaderData.timePlan) && (
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

        {timePlanShowsBigPlanProgress(loaderData.timePlan) &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.BIG_PLANS,
          ) && (
            <SectionCard id="time-plan-progress" title="Progress">
              <BigPlanProgressView summary={bigPlanProgressSummary} />
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
                            text: "New Todo",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/new-todo-task`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.TODO_TASK,
                          }),
                          NavSingle({
                            text: "From Existing Todos",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-todo-tasks`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.TODO_TASK,
                          }),
                          NavSeparator(),
                          NavSingle({
                            text: "New Habit",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/new-habit`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.HABITS,
                          }),
                          NavSingle({
                            text: "From Existing Habits",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-habits`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.HABITS,
                          }),
                          NavSingle({
                            text: "From Included Habit Tasks",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-included-habit-tasks`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.HABITS,
                          }),
                          NavSeparator(),
                          NavSingle({
                            text: "New Chore",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/new-chore`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.CHORES,
                          }),
                          NavSingle({
                            text: "From Existing Chores",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-chores`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.CHORES,
                          }),
                          NavSingle({
                            text: "From Included Chore Tasks",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-included-chore-tasks`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.CHORES,
                          }),
                          NavSeparator(),
                        ]
                      : []),
                    NavSingle({
                      text: "New Big Plan",
                      link: withTimePlanDisplay(
                        `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/new-big-plan`,
                        query,
                      ),
                      gatedOn: WorkspaceFeature.BIG_PLANS,
                    }),
                    NavSingle({
                      text: "From Existing Big Plans",
                      link: withTimePlanDisplay(
                        `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-big-plans`,
                        query,
                      ),
                      gatedOn: WorkspaceFeature.BIG_PLANS,
                    }),
                    ...(timePlanAllowsInboxTasks(loaderData.timePlan)
                      ? [
                          NavSingle({
                            text: "From Included Big Plan Tasks",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-included-big-plan-tasks`,
                              query,
                            ),
                            gatedOn: WorkspaceFeature.BIG_PLANS,
                          }),
                        ]
                      : []),
                    NavSeparator(),
                    NavSingle({
                      text: "From Time Plans",
                      link: withTimePlanDisplay(
                        `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-time-plans/${loaderData.timePlan.ref_id}`,
                        query,
                      ),
                    }),
                    ...(timePlanAllowsInboxTasks(loaderData.timePlan)
                      ? [
                          NavSingle({
                            text: "From Generated Inbox Tasks",
                            link: withTimePlanDisplay(
                              `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-generated-inbox-tasks?showFromPeriod=${loaderData.timePlan.period}`,
                              query,
                            ),
                          }),
                        ]
                      : []),
                  ],
                }),
                FilterFewOptionsCompact(
                  "View",
                  selectedView,
                  [
                    {
                      value: TimePlanViewMode.KANBAN_BY_EISEN,
                      text: "Kanban by Eisen",
                      icon: <ViewKanbanIcon />,
                      disabled: !timePlanAllowsKanbanViews(loaderData.timePlan),
                    },
                    {
                      value: TimePlanViewMode.KANBAN,
                      text: "Kanban",
                      icon: <ViewKanbanIcon />,
                      disabled: !timePlanAllowsKanbanViews(loaderData.timePlan),
                    },
                    {
                      value: TimePlanViewMode.LIST,
                      text: "List",
                      icon: <ViewListIcon />,
                    },
                    {
                      value: TimePlanViewMode.TIMELINE,
                      text: "Timeline",
                      icon: <ViewTimelineIcon />,
                    },
                    ...(loaderData.timePlan.period ===
                    RecurringTaskPeriod.WEEKLY
                      ? [
                          {
                            value: TimePlanViewMode.CALENDAR,
                            text: "Calendar Week",
                            icon: <CalendarMonthIcon />,
                            gatedOn: WorkspaceFeature.SCHEDULE,
                            disabled: !timePlanAllowsCalendarView(
                              loaderData.timePlan,
                            ),
                          },
                          {
                            value: TimePlanViewMode.CALENDAR_3_DAYS,
                            text: "Calendar 3 Days",
                            icon: <DateRangeIcon />,
                            gatedOn: WorkspaceFeature.SCHEDULE,
                            disabled: !timePlanAllowsCalendarView(
                              loaderData.timePlan,
                            ),
                          },
                        ]
                      : [
                          {
                            value: TimePlanViewMode.CALENDAR,
                            text: "Calendar",
                            icon: <CalendarMonthIcon />,
                            gatedOn: WorkspaceFeature.SCHEDULE,
                            disabled: !timePlanAllowsCalendarView(
                              loaderData.timePlan,
                            ),
                          },
                        ]),
                  ],
                  (selected) => setSelectedView(selected),
                ),
                FilterFewOptionsCompact(
                  "Grouping",
                  selectedGrouping,
                  [
                    {
                      value: TimePlanGrouping.MERGED,
                      text: "Merged",
                      icon: <ViewListIcon />,
                    },
                    {
                      value: TimePlanGrouping.BY_ASPECT,
                      text: "By Aspect",
                      icon: <FlareIcon />,
                      gatedOn: WorkspaceFeature.LIFE_PLAN,
                    },
                    {
                      value: TimePlanGrouping.BY_ASPECT_AND_GOALS,
                      text: "By Aspect & Goals",
                      icon: <FlagIcon />,
                      gatedOn: WorkspaceFeature.LIFE_PLAN,
                    },
                  ],
                  (selected) => setSelectedGrouping(selected),
                ),
                FilterManyOptions<TimePlanActivityFilterValue>(
                  "Filter",
                  [
                    { value: TimePlanActivityKind.FINISH, text: "Finish" },
                    {
                      value: TimePlanActivityKind.MAKE_PROGRESS,
                      text: "Make Progress",
                    },
                    FilterOptionSeparator(),
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
                    FilterOptionSeparator(),
                    { value: true, text: "Done" },
                    { value: false, text: "Not Done" },
                  ],
                  (selected) => {
                    const kinds: TimePlanActivityKind[] = [];
                    const feasabilities: TimePlanActivityFeasability[] = [];
                    const doneness: boolean[] = [];
                    for (const value of selected) {
                      if (typeof value === "boolean") {
                        doneness.push(value);
                      } else if (TIME_PLAN_ACTIVITY_KIND_VALUES.has(value)) {
                        kinds.push(value as TimePlanActivityKind);
                      } else {
                        feasabilities.push(
                          value as TimePlanActivityFeasability,
                        );
                      }
                    }
                    setSelectedKinds(kinds);
                    setSelectedFeasabilities(feasabilities);
                    setSelectedDoneness(doneness);
                  },
                ),
                ...(isWorkspaceFeatureAvailable(
                  topLevelInfo.workspace,
                  WorkspaceFeature.LIFE_PLAN,
                )
                  ? [
                      FilterManyOptions(
                        "Aspects",
                        sortedAspects.map((aspect) => ({
                          value: aspect.ref_id,
                          text: computeAspectHierarchicalNameFromRoot(
                            aspect,
                            allAspectsByRefId,
                          ),
                        })),
                        setSelectedAspects,
                      ),
                    ]
                  : []),
              ]}
              extraActions={[
                ...(isWorkspaceFeatureAvailable(
                  topLevelInfo.workspace,
                  WorkspaceFeature.LIFE_PLAN,
                )
                  ? [
                      FilterFewOptionsCompact(
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
                    ]
                  : []),
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
                  ? withTimePlanDisplay(
                      `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-generated-inbox-tasks?showFromPeriod=${loaderData.timePlan.period}`,
                      query,
                    )
                  : withTimePlanDisplay(
                      `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/add-from-current-big-plans`,
                      query,
                    )
              }
              helpSubject={DocsHelpSubject.TIME_PLANS}
            />
          )}

          {selectedView === TimePlanViewMode.KANBAN_BY_EISEN &&
            timePlanAllowsKanbanViews(loaderData.timePlan) && (
              <>
                {isBigScreen && (
                  <DragDropContext
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  >
                    <>
                      {EISENS.map((e) => (
                        <Fragment key={e}>
                          <StandardDivider
                            title={`${eisenIcon(e)} ${eisenName(e)}`}
                            size="large"
                          />
                          <InboxTaskKanbanBoard
                            topLevelInfo={topLevelInfo}
                            inboxTasks={loaderData.targetInboxTasks}
                            optimisticUpdates={NO_OPTIMISTIC_UPDATES}
                            inboxTasksByRefId={inboxTasksByRefId}
                            moreInfoByRefId={{}}
                            actionableTime={ActionableTime.NOW}
                            allowEisen={e}
                            draggedInboxTaskId={draggedInboxTaskId}
                            cardLinkResolver={(it) =>
                              withTimePlanDisplay(
                                `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/${activityByInboxTaskRefId.get(it.ref_id)?.ref_id ?? it.ref_id}`,
                                query,
                              )
                            }
                          />
                        </Fragment>
                      ))}
                    </>
                  </DragDropContext>
                )}
                {!isBigScreen && (
                  <SmallScreenKanbanByEisen
                    topLevelInfo={topLevelInfo}
                    inboxTasks={loaderData.targetInboxTasks}
                    optimisticUpdates={NO_OPTIMISTIC_UPDATES}
                    moreInfoByRefId={{}}
                    actionableTime={ActionableTime.NOW}
                    emptyParent="inbox task"
                    cardLinkResolver={(it) =>
                      withTimePlanDisplay(
                        `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/${activityByInboxTaskRefId.get(it.ref_id)?.ref_id ?? it.ref_id}`,
                        query,
                      )
                    }
                  />
                )}
              </>
            )}

          {selectedView === TimePlanViewMode.KANBAN &&
            timePlanAllowsKanbanViews(loaderData.timePlan) && (
              <>
                {isBigScreen && (
                  <DragDropContext
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  >
                    <InboxTaskKanbanBoard
                      topLevelInfo={topLevelInfo}
                      inboxTasks={loaderData.targetInboxTasks}
                      optimisticUpdates={NO_OPTIMISTIC_UPDATES}
                      inboxTasksByRefId={inboxTasksByRefId}
                      moreInfoByRefId={{}}
                      actionableTime={ActionableTime.NOW}
                      draggedInboxTaskId={draggedInboxTaskId}
                      cardLinkResolver={(it) =>
                        withTimePlanDisplay(
                          `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/${activityByInboxTaskRefId.get(it.ref_id)?.ref_id ?? it.ref_id}`,
                          query,
                        )
                      }
                    />
                  </DragDropContext>
                )}
                {!isBigScreen && (
                  <SmallScreenKanban
                    topLevelInfo={topLevelInfo}
                    inboxTasks={loaderData.targetInboxTasks}
                    optimisticUpdates={NO_OPTIMISTIC_UPDATES}
                    moreInfoByRefId={{}}
                    actionableTime={ActionableTime.NOW}
                    emptyParent="inbox task"
                    cardLinkResolver={(it) =>
                      withTimePlanDisplay(
                        `/app/workspace/apps/time-plans/${loaderData.timePlan.ref_id}/${activityByInboxTaskRefId.get(it.ref_id)?.ref_id ?? it.ref_id}`,
                        query,
                      )
                    }
                  />
                )}
              </>
            )}

          {selectedView === TimePlanViewMode.LIST && activitiesAsList}

          {timePlanViewModeIsCalendar(selectedView) &&
            timePlanAllowsCalendarView(loaderData.timePlan) && (
              <TimePlanCalendarActivities
                timePlan={loaderData.timePlan}
                periodStartDate={
                  loaderData.calendarPeriodStartDate ??
                  loaderData.timePlan.start_date
                }
                periodEndDate={
                  loaderData.calendarPeriodEndDate ??
                  loaderData.timePlan.end_date
                }
                entries={loaderData.calendarEntries ?? undefined}
                timePlanActivities={loaderData.activities}
                activityTimeEventBlocks={loaderData.activityTimeEventBlocks}
                activities={activitiesAsList}
                isAdding={isAddingTimeEvent}
                viewMode={selectedView}
                additionalTimezones={loaderData.calendarAdditionalTimezones}
                onReschedule={handleCalendarReschedule}
                onPlace={handleCalendarPlace}
              />
            )}

          {selectedView === TimePlanViewMode.TIMELINE &&
            selectedGrouping === TimePlanGrouping.MERGED && (
              <TimePlanTimelineMergedActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                niceToHaveActivities={niceToHaveActivities}
                stretchActivities={stretchActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                bigPlanStatsByRefId={bigPlanStatsByRefId}
                targetTodoTasksByRefId={targetTodoTasksByRefId}
                targetHabitsByRefId={targetHabitsByRefId}
                targetHabitStacksByRefId={targetHabitStacksByRefId}
                targetChoreStacksByRefId={targetChoreStacksByRefId}
                targetChoresByRefId={targetChoresByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
              />
            )}

          {selectedView === TimePlanViewMode.TIMELINE &&
            selectedGrouping === TimePlanGrouping.BY_ASPECT && (
              <TimePlanTimelineByAspectActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                bigPlanStatsByRefId={bigPlanStatsByRefId}
                targetTodoTasksByRefId={targetTodoTasksByRefId}
                targetHabitsByRefId={targetHabitsByRefId}
                targetHabitStacksByRefId={targetHabitStacksByRefId}
                targetChoreStacksByRefId={targetChoreStacksByRefId}
                targetChoresByRefId={targetChoresByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={visibleAspects}
                aspectsByRefId={allAspectsByRefId}
                showEmptyGroups={
                  selectedGroupVisibility === GroupVisibility.SHOW_ALL
                }
              />
            )}

          {selectedView === TimePlanViewMode.TIMELINE &&
            selectedGrouping === TimePlanGrouping.BY_ASPECT_AND_GOALS && (
              <TimePlanTimelineByAspectAndGoalActivities
                timePlan={loaderData.timePlan}
                mustDoActivities={mustDoActivities}
                otherActivities={otherActivities}
                targetInboxTasksByRefId={targetInboxTasksByRefId}
                targetBigPlansByRefId={targetBigPlansByRefId}
                bigPlanStatsByRefId={bigPlanStatsByRefId}
                targetTodoTasksByRefId={targetTodoTasksByRefId}
                targetHabitsByRefId={targetHabitsByRefId}
                targetHabitStacksByRefId={targetHabitStacksByRefId}
                targetChoreStacksByRefId={targetChoreStacksByRefId}
                targetChoresByRefId={targetChoresByRefId}
                activityDoneness={loaderData.activityDoneness}
                timeEventsByRefId={timeEventsByRefId}
                selectedKinds={selectedKinds}
                selectedFeasabilities={selectedFeasabilities}
                selectedDoneness={selectedDoneness}
                aspects={visibleAspects}
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
                bigPlanStatsByRefId={bigPlanStatsByRefId}
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

      <NestedOutlet />
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/apps/time-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}. Please try again!`,
  },
);
