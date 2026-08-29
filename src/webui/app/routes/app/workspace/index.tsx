import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Outlet,
  useFetcher,
  useNavigation,
  useSearchParams,
  type ShouldRevalidateFunction,
} from "@remix-run/react";
import {
  BigScreenHomeTabWidgetPlacement,
  ChapterSummary,
  HabitLoadResult,
  HomeTab,
  HomeTabTarget,
  HomeWidget,
  InboxTask,
  InboxTaskStatus,
  LifePlan,
  MilestoneSummary,
  Note,
  RecurringTaskPeriod,
  SmallScreenHomeTabWidgetPlacement,
  Vision,
  WidgetType,
  ProjectLoadResult,
  WorkspaceFeature,
  WidgetTypeConstraints,
  User,
  Workspace,
  DocsHelpSubject,
  AspectSummary,
} from "@jupiter/webapi-client";
import { Fragment, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { AnimatePresence } from "framer-motion";
import TuneIcon from "@mui/icons-material/Tune";
import { z } from "zod";
import { parseQuery } from "zodix";
import { Tabs, Tab, Box } from "@mui/material";
import {
  widgetDimensionRows,
  widgetDimensionCols,
  isAllowedForWidgetConstraints,
} from "@jupiter/core/home/sub/widget/root";
import {
  inboxTaskFindEntryToParent,
  InboxTaskOptimisticState,
  InboxTaskParent,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { isUserFeatureAvailable } from "@jupiter/core/users/root";
import { sortAndFilterTabsByTheirOrder } from "@jupiter/core/home/sub/tab/root";
import {
  useTrunkNeedsToShowLeaf,
  DisplayType,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { MOTDWidget } from "@jupiter/core/apps/motd/component/widget";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { HabitInboxTasksWidget } from "@jupiter/core/apps/habits/component/inbox-tasks-widget";
import { TimePlanViewWidget } from "@jupiter/core/apps/time_plans/component/widget";
import { CalendarDailyWidget } from "@jupiter/core/calendar/component/calendar-daily-widget";
import { HabitKeyHabitStreakWidget } from "@jupiter/core/apps/habits/component/key-habit-streak-widget";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  WidgetFeatureNotAvailableBanner,
  WidgetContainer,
  WidgetPropsNoGeometry,
} from "@jupiter/core/home/component/common";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { ScheduleDailyWidget } from "@jupiter/core/calendar/component/schedule-daily-widget";
import { HabitRandomWidget } from "@jupiter/core/apps/habits/component/random-widget";
import { ChoreInboxTasksWidget } from "@jupiter/core/apps/chores/component/inbox-tasks-widget";
import { TodoInboxTasksWidget } from "@jupiter/core/apps/todo/components/inbox-tasks-widget";
import { ChoreRandomWidget } from "@jupiter/core/apps/chores/component/random-widget";
import { UpcomingBirthdaysWidget } from "@jupiter/core/apps/prm/sub/person/component/upcoming-birthdays-widget";
import { GamificationOverviewWidget } from "@jupiter/core/gamification/component/overview-widget";
import { GamificationHistoryWeeklyWidget } from "@jupiter/core/gamification/component/history-weekly-widget";
import { GamificationHistoryMonthlyWidget } from "@jupiter/core/gamification/component/history-monthly-widget";
import { KeyProjectsProgressWidget } from "@jupiter/core/apps/projects/component/key-projects-progress-widget";
import { LifeWeeksWidget } from "@jupiter/core/apps/life_plan/component/life-weeks-widget";
import { LifeVisionWidget } from "@jupiter/core/apps/life_plan/component/life-vision-widget";
import { LifeChaptersWidget } from "@jupiter/core/apps/life_plan/component/life-chapters-widget";
import { CollaborationWidget } from "@jupiter/core/common/sub/access/components/collaboration-widget";
import { midDate } from "@jupiter/core/apps/life_plan/partial-date";
import { lifePlanBirthdayDate } from "@jupiter/core/apps/life_plan/root";
import { aDateToDate } from "@jupiter/core/common/adate";
import {
  CHORE,
  HABIT,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  TODO_TASK,
} from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";

import { newURLParams } from "~/logic/navigation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

const QuerySchema = z.object({
  tabRefId: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const rightNow = DateTime.now().toISODate();

  const apiClient = await getLoggedInApiClient(request);

  const homeConfigResponse = await apiClient.home.homeConfigLoad({});
  const widgetTypes = new Set(
    homeConfigResponse.widgets.map((widget) => widget.the_type),
  );

  const needsMotd = widgetTypes.has(WidgetType.MOTD);
  const needsKeyHabitStreaks = widgetTypes.has(WidgetType.KEY_HABITS_STREAKS);
  const needsHabitInbox =
    widgetTypes.has(WidgetType.HABIT_INBOX_TASKS) ||
    widgetTypes.has(WidgetType.RANDOM_HABIT);
  const needsChoreInbox =
    widgetTypes.has(WidgetType.CHORE_INBOX_TASKS) ||
    widgetTypes.has(WidgetType.RANDOM_CHORE);
  const needsTodoInbox = widgetTypes.has(WidgetType.TODO_INBOX_TASKS);
  const needsKeyProjects = widgetTypes.has(WidgetType.KEY_PROJECTS_PROGRESS);
  const needsPersonInbox = widgetTypes.has(WidgetType.UPCOMING_BIRTHDAYS);
  const needsCalendar =
    widgetTypes.has(WidgetType.CALENDAR_DAY) ||
    widgetTypes.has(WidgetType.SCHEDULE_DAY);
  const needsTimePlan = widgetTypes.has(WidgetType.TIME_PLAN_VIEW);
  const needsGamification =
    widgetTypes.has(WidgetType.GAMIFICATION_OVERVIEW) ||
    widgetTypes.has(WidgetType.GAMIFICATION_HISTORY_WEEKLY) ||
    widgetTypes.has(WidgetType.GAMIFICATION_HISTORY_MONTHLY);
  const needsLifeWeeksOrChapters =
    widgetTypes.has(WidgetType.LIFE_WEEKS) ||
    widgetTypes.has(WidgetType.LIFE_CHAPTERS);
  const needsLifeVision = widgetTypes.has(WidgetType.LIFE_VISION);
  const needsCollaboration = widgetTypes.has(WidgetType.COLLABORATION);

  async function loadTimePlanForPeriod(period: RecurringTaskPeriod) {
    const timePlanForPeriodResponse =
      await apiClient.timePlans.timePlanLoadForTimeDateAndPeriod({
        right_now: rightNow,
        period,
        allow_archived: false,
      });
    if (!timePlanForPeriodResponse.time_plan) {
      return null;
    }
    return apiClient.timePlans.timePlanLoad({
      ref_id: timePlanForPeriodResponse.time_plan.ref_id,
      allow_archived: false,
      include_targets: true,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });
  }

  const [
    summariesAndKeys,
    motdResponse,
    habitInboxTasksResponse,
    choreInboxTasksResponse,
    todoInboxTasksResponse,
    personInboxTasksResponse,
    calendarForTodayResponse,
    fullTimePlanForToday,
    fullTimePlanForWeek,
    userResponse,
    activeVisionResponse,
    collaborationsResponse,
  ] = await Promise.all([
    (async () => {
      const summaryResponse = await apiClient.application.getSummaries({
        include_workspace: true,
        include_habits: needsKeyHabitStreaks,
        include_projects: needsKeyProjects,
        include_life_plan: needsLifeWeeksOrChapters || needsLifeVision,
        include_chapters: needsLifeWeeksOrChapters,
        include_milestones: needsLifeWeeksOrChapters,
        include_aspects: needsLifeWeeksOrChapters,
      });
      const workspace = summaryResponse.workspace!;

      const earliestDate = DateTime.now().minus({ days: 365 }).toISODate();
      const latestDate = DateTime.now().toISODate();

      const [keyHabitResults, keyProjectsResults] = await Promise.all([
        (async (): Promise<HabitLoadResult[] | undefined> => {
          if (
            !needsKeyHabitStreaks ||
            !isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.HABITS)
          ) {
            return undefined;
          }
          const keyHabits =
            summaryResponse.habits?.filter((habit) => habit.is_key) || [];
          if (keyHabits.length === 0) {
            return [];
          }
          return Promise.all(
            keyHabits.map((habit) =>
              apiClient.habits.habitLoad({
                ref_id: habit.ref_id,
                allow_archived: false,
                include_streak_marks_earliest_date: earliestDate,
                include_streak_marks_latest_date: latestDate,
              }),
            ),
          );
        })(),
        (async (): Promise<ProjectLoadResult[] | undefined> => {
          if (
            !needsKeyProjects ||
            !isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.PROJECTS)
          ) {
            return undefined;
          }
          const keyProjects =
            summaryResponse.projects?.filter((bp) => bp.is_key) || [];
          if (keyProjects.length === 0) {
            return [];
          }
          return Promise.all(
            keyProjects.map((bp) =>
              apiClient.projects.projectLoad({
                ref_id: bp.ref_id,
                allow_archived: false,
              }),
            ),
          );
        })(),
      ]);

      return { summaryResponse, keyHabitResults, keyProjectsResults };
    })(),
    needsMotd ? apiClient.motd.mOtdGetForToday({}) : Promise.resolve(undefined),
    needsHabitInbox
      ? apiClient.inboxTasks.inboxTaskFind({
          allow_archived: false,
          filter_namespace: [HABIT],
        })
      : Promise.resolve(undefined),
    needsChoreInbox
      ? apiClient.inboxTasks.inboxTaskFind({
          allow_archived: false,
          filter_namespace: [CHORE],
        })
      : Promise.resolve(undefined),
    needsTodoInbox
      ? apiClient.inboxTasks.inboxTaskFind({
          allow_archived: false,
          filter_namespace: [TODO_TASK],
        })
      : Promise.resolve(undefined),
    needsPersonInbox
      ? apiClient.inboxTasks.inboxTaskFind({
          allow_archived: false,
          filter_namespace: [PERSON_OCCASION, PERSON_CATCH_UP],
        })
      : Promise.resolve(undefined),
    needsCalendar
      ? apiClient.calendar.calendarLoadForDateAndPeriod({
          right_now: rightNow,
          period: RecurringTaskPeriod.DAILY,
          stats_subperiod: null,
        })
      : Promise.resolve(undefined),
    needsTimePlan
      ? loadTimePlanForPeriod(RecurringTaskPeriod.DAILY)
      : Promise.resolve(null),
    needsTimePlan
      ? loadTimePlanForPeriod(RecurringTaskPeriod.WEEKLY)
      : Promise.resolve(null),
    needsGamification
      ? apiClient.users.userLoad({})
      : Promise.resolve(undefined),
    needsLifeVision
      ? apiClient.lifePlan.visionLoadActive({})
      : Promise.resolve(null),
    needsCollaboration
      ? apiClient.application.findCollaborations({
          allow_archived: false,
        })
      : Promise.resolve(undefined),
  ]);

  const { summaryResponse, keyHabitResults, keyProjectsResults } =
    summariesAndKeys;

  return json({
    homeConfig: {
      config: homeConfigResponse.home_config,
      tabs: homeConfigResponse.tabs,
      widgets: homeConfigResponse.widgets,
      widgetConstraints: homeConfigResponse.widget_constraints,
    },
    motd: motdResponse?.motd,
    habitInboxTasks: habitInboxTasksResponse?.entries,
    choreInboxTasks: choreInboxTasksResponse?.entries,
    todoInboxTasks: todoInboxTasksResponse?.entries,
    personInboxTasks: personInboxTasksResponse?.entries,
    keyHabitResults: keyHabitResults?.map((h) => ({
      habit: h.habit,
      streakMarkEarliestDate: h.streak_mark_earliest_date,
      streakMarkLatestDate: h.streak_mark_latest_date,
      streakMarks: h.streak_marks,
    })),
    keyProjectsResults: keyProjectsResults?.map((bp) => ({
      project: bp.project,
      stats: bp.stats,
      milestones: bp.milestones,
    })),
    calendarEntriesForToday: calendarForTodayResponse?.entries,
    timePlanForToday: fullTimePlanForToday
      ? {
          timePlan: fullTimePlanForToday.time_plan,
          activities: fullTimePlanForToday.activities,
          targetInboxTasks: fullTimePlanForToday.target_inbox_tasks ?? [],
          targetProjects: fullTimePlanForToday.target_projects ?? [],
          targetTodoTasks: fullTimePlanForToday.target_todo_tasks ?? [],
          targetHabits: fullTimePlanForToday.target_habits ?? [],
          targetChores: fullTimePlanForToday.target_chores ?? [],
          activityDoneness: fullTimePlanForToday.activity_doneness ?? {},
        }
      : undefined,
    timePlanForWeek: fullTimePlanForWeek
      ? {
          timePlan: fullTimePlanForWeek.time_plan,
          activities: fullTimePlanForWeek.activities,
          targetInboxTasks: fullTimePlanForWeek.target_inbox_tasks ?? [],
          targetProjects: fullTimePlanForWeek.target_projects ?? [],
          targetTodoTasks: fullTimePlanForWeek.target_todo_tasks ?? [],
          targetHabits: fullTimePlanForWeek.target_habits ?? [],
          targetChores: fullTimePlanForWeek.target_chores ?? [],
          activityDoneness: fullTimePlanForWeek.activity_doneness ?? {},
        }
      : undefined,
    gamificationOverview: userResponse?.user_score_overview,
    gamificationHistory: userResponse?.user_score_history,
    lifePlan: summaryResponse.life_plan as LifePlan | undefined,
    allChapters: summaryResponse.chapters as ChapterSummary[] | undefined,
    allMilestones: summaryResponse.milestones as MilestoneSummary[] | undefined,
    allAspects: summaryResponse.aspects as AspectSummary[] | undefined,
    activeVision:
      activeVisionResponse?.vision && activeVisionResponse?.note
        ? {
            vision: activeVisionResponse.vision as Vision,
            note: activeVisionResponse.note as Note,
          }
        : undefined,
    collaborationInvites: collaborationsResponse?.invites ?? [],
    collaborationIncomingRequests:
      collaborationsResponse?.incoming_requests ?? [],
    collaborationOutgoingRequests:
      collaborationsResponse?.outgoing_requests ?? [],
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl,
}) => {
  if (currentUrl.pathname === nextUrl.pathname) {
    return false;
  }

  return standardShouldRevalidate({
    currentUrl,
    defaultShouldRevalidate,
    formAction,
    formMethod,
    nextUrl,
    currentParams: {},
    nextParams: {},
  });
};

export default function WorkspaceHome() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "loading" ? false : true;
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const isBigScreen = useBigScreen();

  const sortedHabitInboxTasks = loaderData.habitInboxTasks
    ? sortInboxTasksNaturally(
        loaderData.habitInboxTasks.map((e) => e.inbox_task),
      )
    : undefined;
  const habitInboxTasksByRefId: { [key: string]: InboxTask } = {};
  if (loaderData.habitInboxTasks) {
    for (const entry of loaderData.habitInboxTasks) {
      habitInboxTasksByRefId[entry.inbox_task.ref_id] = entry.inbox_task;
    }
  }
  const habitEntriesByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.habitInboxTasks) {
    for (const entry of loaderData.habitInboxTasks) {
      habitEntriesByRefId[entry.inbox_task.ref_id] =
        inboxTaskFindEntryToParent(entry);
    }
  }

  const sortedChoreInboxTasks = loaderData.choreInboxTasks
    ? sortInboxTasksNaturally(
        loaderData.choreInboxTasks.map((e) => e.inbox_task),
      )
    : undefined;
  const choreInboxTasksByRefId: { [key: string]: InboxTask } = {};
  if (loaderData.choreInboxTasks) {
    for (const entry of loaderData.choreInboxTasks) {
      choreInboxTasksByRefId[entry.inbox_task.ref_id] = entry.inbox_task;
    }
  }
  const choreEntriesByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.choreInboxTasks) {
    for (const entry of loaderData.choreInboxTasks) {
      choreEntriesByRefId[entry.inbox_task.ref_id] =
        inboxTaskFindEntryToParent(entry);
    }
  }

  const sortedTodoInboxTasks = loaderData.todoInboxTasks
    ? sortInboxTasksNaturally(
        loaderData.todoInboxTasks.map((e) => e.inbox_task),
      )
    : undefined;
  const todoEntriesByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.todoInboxTasks) {
    for (const entry of loaderData.todoInboxTasks) {
      todoEntriesByRefId[entry.inbox_task.ref_id] =
        inboxTaskFindEntryToParent(entry);
    }
  }

  const sortedPersonInboxTasks = loaderData.personInboxTasks
    ? sortInboxTasksNaturally(
        loaderData.personInboxTasks.map((e) => e.inbox_task),
      )
    : undefined;
  const personInboxTasksByRefId: { [key: string]: InboxTask } = {};
  if (loaderData.personInboxTasks) {
    for (const entry of loaderData.personInboxTasks) {
      personInboxTasksByRefId[entry.inbox_task.ref_id] = entry.inbox_task;
    }
  }

  const personEntriesByRefId: { [key: string]: InboxTaskParent } = {};
  if (loaderData.personInboxTasks) {
    for (const entry of loaderData.personInboxTasks) {
      personEntriesByRefId[entry.inbox_task.ref_id] =
        inboxTaskFindEntryToParent(entry);
    }
  }

  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [key: string]: InboxTaskOptimisticState;
  }>({});
  const [dismissedCollaborationIds, setDismissedCollaborationIds] = useState<
    Set<string>
  >(new Set());

  const kanbanBoardMoveFetcher = useFetcher();
  const collaborationActionFetcher = useFetcher();

  const rightNow = DateTime.local({ zone: topLevelInfo.user.timezone });
  const today = rightNow.toISODate();

  const bigScreenTabs = sortAndFilterTabsByTheirOrder(
    loaderData.homeConfig.config,
    HomeTabTarget.BIG_SCREEN,
    loaderData.homeConfig.tabs,
  );
  const smallScreenTabs = sortAndFilterTabsByTheirOrder(
    loaderData.homeConfig.config,
    HomeTabTarget.SMALL_SCREEN,
    loaderData.homeConfig.tabs,
  );

  const widgetByRefId = new Map(
    loaderData.homeConfig.widgets.map((w) => [w.ref_id, w]),
  );

  function handleCardMarkDone(it: InboxTask) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: InboxTaskStatus.DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
        },
      };
    });

    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        {
          id: it.ref_id,
          status: InboxTaskStatus.DONE,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  function handleCardMarkNotDone(it: InboxTask) {
    setOptimisticUpdates((oldOptimisticUpdates) => {
      return {
        ...oldOptimisticUpdates,
        [it.ref_id]: {
          status: InboxTaskStatus.NOT_DONE,
          eisen: oldOptimisticUpdates[it.ref_id]?.eisen ?? it.eisen,
        },
      };
    });

    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        {
          id: it.ref_id,
          status: InboxTaskStatus.NOT_DONE,
        },
        {
          method: "post",
          action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  function dismissCollaborationId(refId: string) {
    setDismissedCollaborationIds((old) => {
      const next = new Set(old);
      next.add(refId);
      return next;
    });
  }

  function handleAcknowledgeInvite(accessInviteRefId: string) {
    dismissCollaborationId(accessInviteRefId);
    collaborationActionFetcher.submit(
      { accessInviteRefId },
      {
        method: "post",
        action: "/app/workspace/core/access/acknowledge-invite",
      },
    );
  }

  function handleCancelInvite(accessInviteRefId: string) {
    dismissCollaborationId(accessInviteRefId);
    collaborationActionFetcher.submit(
      { accessInviteRefId },
      {
        method: "post",
        action: "/app/workspace/core/access/cancel-invite",
      },
    );
  }

  function handleAcceptRequest(accessRequestRefId: string) {
    dismissCollaborationId(accessRequestRefId);
    collaborationActionFetcher.submit(
      { accessRequestRefId },
      {
        method: "post",
        action: "/app/workspace/core/access/accept-access",
      },
    );
  }

  function handleRejectRequest(accessRequestRefId: string) {
    dismissCollaborationId(accessRequestRefId);
    collaborationActionFetcher.submit(
      { accessRequestRefId },
      {
        method: "post",
        action: "/app/workspace/core/access/reject-access",
      },
    );
  }

  const activeChapters: ChapterSummary[] | undefined = (() => {
    if (!loaderData.allChapters || !loaderData.lifePlan) return undefined;
    const birthday = lifePlanBirthdayDate(loaderData.lifePlan);
    const todayDt = aDateToDate(topLevelInfo.today);
    const milestones = loaderData.allMilestones ?? [];
    return loaderData.allChapters.filter((chapter) => {
      try {
        const startDt = midDate(
          chapter.start_date,
          birthday,
          todayDt,
          milestones,
        );
        const endDt = midDate(chapter.end_date, birthday, todayDt, milestones);
        return (
          startDt.toMillis() <= todayDt.toMillis() &&
          todayDt.toMillis() < endDt.toMillis()
        );
      } catch {
        return false;
      }
    });
  })();

  const widgetProps: WidgetPropsNoGeometry = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    motd: loaderData.motd,
    habitTasks: loaderData.habitInboxTasks
      ? {
          habits: loaderData.keyHabitResults?.map((h) => h.habit) ?? [],
          habitInboxTasks: sortedHabitInboxTasks!,
          habitEntriesByRefId: habitEntriesByRefId!,
          optimisticUpdates,
          onCardMarkDone: handleCardMarkDone,
          onCardMarkNotDone: handleCardMarkNotDone,
        }
      : undefined,
    choreTasks: loaderData.choreInboxTasks
      ? {
          choreInboxTasks: sortedChoreInboxTasks!,
          choreEntriesByRefId: choreEntriesByRefId!,
          optimisticUpdates,
          onCardMarkDone: handleCardMarkDone,
          onCardMarkNotDone: handleCardMarkNotDone,
        }
      : undefined,
    todoTasks: loaderData.todoInboxTasks
      ? {
          todoInboxTasks: sortedTodoInboxTasks!,
          todoEntriesByRefId: todoEntriesByRefId!,
          optimisticUpdates,
          onCardMarkDone: handleCardMarkDone,
          onCardMarkNotDone: handleCardMarkNotDone,
        }
      : undefined,
    personTasks: loaderData.personInboxTasks
      ? {
          personInboxTasks: sortedPersonInboxTasks!,
          personEntriesByRefId: personEntriesByRefId!,
          optimisticUpdates,
          onCardMarkDone: handleCardMarkDone,
          onCardMarkNotDone: handleCardMarkNotDone,
        }
      : undefined,
    habitStreak: loaderData.keyHabitResults
      ? {
          earliestDate:
            loaderData.keyHabitResults[0]?.streakMarkEarliestDate ??
            topLevelInfo.today,
          latestDate:
            loaderData.keyHabitResults[0]?.streakMarkLatestDate ??
            topLevelInfo.today,
          currentToday: topLevelInfo.today,
          entries: loaderData.keyHabitResults,
          noLabel: true,
        }
      : undefined,
    keyProjects: loaderData.keyProjectsResults
      ? {
          projects: loaderData.keyProjectsResults.map((bp) => ({
            project: bp.project,
            stats: bp.stats,
            milestones: bp.milestones,
          })),
        }
      : undefined,
    calendar: loaderData.calendarEntriesForToday
      ? {
          period: RecurringTaskPeriod.DAILY,
          periodStartDate: today,
          periodEndDate: today,
          entries: loaderData.calendarEntriesForToday,
        }
      : undefined,
    timePlans: {
      timePlanForToday: loaderData.timePlanForToday,
      timePlanForWeek: loaderData.timePlanForWeek,
    },
    gamificationOverview: loaderData.gamificationOverview ?? undefined,
    gamificationHistory: loaderData.gamificationHistory ?? undefined,
    lifePlan: loaderData.lifePlan ?? undefined,
    activeVision: loaderData.activeVision ?? undefined,
    activeChapters: activeChapters,
    aspectsByRefId: loaderData.allAspects
      ? Object.fromEntries(loaderData.allAspects.map((p) => [p.ref_id, p]))
      : undefined,
    collaboration: {
      invites: loaderData.collaborationInvites.filter(
        (entry) => !dismissedCollaborationIds.has(entry.access_invite.ref_id),
      ),
      incomingRequests: loaderData.collaborationIncomingRequests.filter(
        (entry) => !dismissedCollaborationIds.has(entry.access_request.ref_id),
      ),
      outgoingRequests: loaderData.collaborationOutgoingRequests.filter(
        (entry) => !dismissedCollaborationIds.has(entry.access_request.ref_id),
      ),
      inputsEnabled: collaborationActionFetcher.state === "idle",
      onAcknowledgeInvite: handleAcknowledgeInvite,
      onCancelInvite: handleCancelInvite,
      onAcceptRequest: handleAcceptRequest,
      onRejectRequest: handleRejectRequest,
    },
  };

  return (
    <TrunkPanel
      key={"workspace"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="home-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: "Settings",
              icon: <TuneIcon />,
              link: "/app/workspace/home/settings",
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {isBigScreen && (
          <>
            {bigScreenTabs.length === 0 && (
              <EntityNoNothingCard
                title="You Have To Start Somewhere"
                message="There are no tabs to show for the big screen. You can create a new tab."
                newEntityLocations="/app/workspace/home/settings/tabs/new"
                helpSubject={DocsHelpSubject.HOME}
              />
            )}

            {bigScreenTabs.length > 0 && (
              <BigScreenTabs
                topLevelInfo={topLevelInfo}
                widgetConstraints={loaderData.homeConfig.widgetConstraints}
                bigScreenTabs={bigScreenTabs}
                widgetByRefId={widgetByRefId}
                widgetProps={widgetProps}
              />
            )}
          </>
        )}

        {!isBigScreen && (
          <>
            {smallScreenTabs.length === 0 && (
              <EntityNoNothingCard
                title="You Have To Start Somewhere"
                message="There are no tabs to show for the small screen. You can create a new tab."
                newEntityLocations="/app/workspace/home/settings/tabs/new"
                helpSubject={DocsHelpSubject.HOME}
              />
            )}

            {smallScreenTabs.length > 0 && (
              <SmallScreenTabs
                topLevelInfo={topLevelInfo}
                widgetConstraints={loaderData.homeConfig.widgetConstraints}
                smallScreenTabs={smallScreenTabs}
                widgetByRefId={widgetByRefId}
                widgetProps={widgetProps}
              />
            )}
          </>
        )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the workspace! Please try again!`,
});

interface BigScreenTabsProps {
  topLevelInfo: TopLevelInfo;
  widgetConstraints: Record<string, WidgetTypeConstraints>;
  bigScreenTabs: HomeTab[];
  widgetByRefId: Map<string, HomeWidget>;
  widgetProps: WidgetPropsNoGeometry;
}

function BigScreenTabs(props: BigScreenTabsProps) {
  const [query] = useSearchParams();
  const { tabRefId } = parseQuery(query, QuerySchema);
  const [bigScreenTab, setBigScreenTab] = useState<string>(
    inferCurrentTabs(props.bigScreenTabs, tabRefId),
  );

  useEffect(() => {
    setBigScreenTab(inferCurrentTabs(props.bigScreenTabs, tabRefId));
  }, [tabRefId, props.bigScreenTabs]);

  return (
    <>
      <Tabs value={bigScreenTab} variant="scrollable" scrollButtons="auto">
        {props.bigScreenTabs.map((t) => {
          return (
            <Tab
              key={t.ref_id}
              icon={<p>{t.icon}</p>}
              iconPosition="top"
              label={t.name}
              value={t.ref_id}
              component={Link}
              to={`/app/workspace?${newURLParams(query, "tabRefId", t.ref_id)}`}
              replace
            />
          );
        })}
      </Tabs>

      {props.bigScreenTabs.map((t) => {
        if (t.ref_id !== bigScreenTab) {
          return null;
        }

        const widgetPlacement =
          t.widget_placement as BigScreenHomeTabWidgetPlacement;

        if (widgetPlacement.matrix.every((r) => r.every((c) => c === null))) {
          return (
            <EntityNoNothingCard
              key={t.ref_id}
              title="You Have To Start Somewhere"
              message="There are no widgets to show. You can create a new widget."
              newEntityLocations={`/app/workspace/home/settings/tabs/${t.ref_id}`}
              helpSubject={DocsHelpSubject.HOME}
            />
          );
        }

        const maxCols = widgetPlacement.matrix.length;
        const maxRows = widgetPlacement.matrix[0].length;

        return (
          <Box
            key={t.ref_id}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
              gridGap: "0.25rem",
              alignItems: "flex-start",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {Array.from({ length: maxRows }, (_, rowIndex) => {
              return (
                <Fragment key={rowIndex}>
                  {Array.from({ length: maxCols }, (_, colIndex) => {
                    const cell = widgetPlacement.matrix[colIndex][rowIndex];

                    if (cell === null) {
                      return null;
                    }

                    // If the previous widget is the same as the current one, don't render the current block,
                    // since this is a bigger widget that is taking up the space of the smaller one.
                    // We check both the row and the column to make sure we don't render the same widget twice.
                    if (
                      rowIndex > 0 &&
                      widgetPlacement.matrix[colIndex][rowIndex] ===
                        widgetPlacement.matrix[colIndex][rowIndex - 1]
                    ) {
                      return null;
                    }

                    if (
                      colIndex > 0 &&
                      widgetPlacement.matrix[colIndex][rowIndex] ===
                        widgetPlacement.matrix[colIndex - 1][rowIndex]
                    ) {
                      return null;
                    }

                    const widget = props.widgetByRefId.get(cell)!;
                    const isLastInColumn =
                      rowIndex ===
                        widgetPlacement.matrix[colIndex].length - 1 ||
                      widgetPlacement.matrix[colIndex].every(
                        (w, idx) =>
                          idx <=
                            rowIndex +
                              widgetDimensionRows(widget!.geometry.dimension) -
                              1 || w === null,
                      );
                    const shouldBeFullWidget = !isLastInColumn;

                    return (
                      <Box
                        key={`${rowIndex}-${colIndex}`}
                        sx={{
                          display: "flex",
                          minWidth: 0,
                          height: shouldBeFullWidget ? "100%" : undefined,
                          gridRowStart: rowIndex + 1,
                          gridRowEnd:
                            rowIndex +
                            1 +
                            widgetDimensionRows(widget!.geometry.dimension),
                          gridColumnStart: colIndex + 1,
                          gridColumnEnd:
                            colIndex +
                            1 +
                            widgetDimensionCols(widget!.geometry.dimension),
                        }}
                      >
                        <ActualWidget
                          widget={widget}
                          widgetProps={props.widgetProps}
                          widgetConstraints={props.widgetConstraints}
                          user={props.topLevelInfo.user}
                          workspace={props.topLevelInfo.workspace}
                        />
                      </Box>
                    );
                  })}
                </Fragment>
              );
            })}
          </Box>
        );
      })}
    </>
  );
}

interface SmallScreenTabsProps {
  topLevelInfo: TopLevelInfo;
  widgetConstraints: Record<string, WidgetTypeConstraints>;
  smallScreenTabs: HomeTab[];
  widgetByRefId: Map<string, HomeWidget>;
  widgetProps: WidgetPropsNoGeometry;
}

function SmallScreenTabs(props: SmallScreenTabsProps) {
  const [query] = useSearchParams();
  const { tabRefId } = parseQuery(query, QuerySchema);
  const [mobileTab, setMobileTab] = useState<string>(
    inferCurrentTabs(props.smallScreenTabs, tabRefId),
  );

  useEffect(() => {
    setMobileTab(inferCurrentTabs(props.smallScreenTabs, tabRefId));
  }, [tabRefId, props.smallScreenTabs]);

  return (
    <>
      <Tabs value={mobileTab} variant="scrollable" scrollButtons="auto">
        {props.smallScreenTabs.map((t) => {
          return (
            <Tab
              key={t.ref_id}
              icon={<p>{t.icon}</p>}
              iconPosition="top"
              label={t.name}
              value={t.ref_id}
              component={Link}
              to={`/app/workspace?${newURLParams(query, "tabRefId", t.ref_id)}`}
              replace
            />
          );
        })}
      </Tabs>

      {props.smallScreenTabs.map((t) => {
        if (t.ref_id !== mobileTab) {
          return null;
        }

        const widgetPlacement =
          t.widget_placement as SmallScreenHomeTabWidgetPlacement;

        if (widgetPlacement.matrix.every((r) => r === null)) {
          return (
            <EntityNoNothingCard
              key={t.ref_id}
              title="You Have To Start Somewhere"
              message="There are no widgets to show. You can create a new widget."
              newEntityLocations={`/app/workspace/home/settings/tabs/${t.ref_id}`}
              helpSubject={DocsHelpSubject.HOME}
            />
          );
        }

        return (
          <Fragment key={t.ref_id}>
            {widgetPlacement.matrix.map((row, rowIndex) => {
              if (row === null) {
                return null;
              }

              // If the previous widget is the same as the current one, don't render the current block,
              // since this is a bigger widget that is taking up the space of the smaller one.
              if (
                rowIndex > 0 &&
                widgetPlacement.matrix[rowIndex] ===
                  widgetPlacement.matrix[rowIndex - 1]
              ) {
                return null;
              }

              const widget = props.widgetByRefId.get(row)!;

              return (
                <ActualWidget
                  key={rowIndex}
                  widget={widget}
                  widgetProps={props.widgetProps}
                  widgetConstraints={props.widgetConstraints}
                  user={props.topLevelInfo.user}
                  workspace={props.topLevelInfo.workspace}
                />
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}

interface ActualWidgetProps {
  widget: HomeWidget;
  widgetProps: WidgetPropsNoGeometry;
  widgetConstraints: Record<WidgetType, WidgetTypeConstraints>;
  user: User;
  workspace: Workspace;
}

function ActualWidget({
  widget,
  widgetProps,
  widgetConstraints,
  user,
  workspace,
}: ActualWidgetProps) {
  const constraint = widgetConstraints[widget.the_type];
  if (!constraint) {
    return <div>Not implemented</div>;
  }

  if (!isAllowedForWidgetConstraints(constraint, user, workspace)) {
    const workspaceFeatures = constraint.only_for_workspace_features || [];
    const userFeatures = constraint.only_for_user_features || [];

    const missingWorkspaceFeatures = workspaceFeatures.filter(
      (feature) => !isWorkspaceFeatureAvailable(workspace, feature),
    );
    const missingUserFeatures = userFeatures.filter(
      (feature) => !isUserFeatureAvailable(user, feature),
    );

    return (
      <WidgetFeatureNotAvailableBanner
        widgetType={widget.the_type}
        missingWorkspaceFeatures={missingWorkspaceFeatures}
        missingUserFeatures={missingUserFeatures}
      />
    );
  }

  return (
    <WidgetContainer geometry={widget.geometry}>
      <ActualWidgetItself widget={widget} widgetProps={widgetProps} />
    </WidgetContainer>
  );
}

interface ActualWidgetItselfProps {
  widget: HomeWidget;
  widgetProps: WidgetPropsNoGeometry;
}

function ActualWidgetItself({ widget, widgetProps }: ActualWidgetItselfProps) {
  const widgetPropsWithGeometry = {
    ...widgetProps,
    geometry: widget.geometry,
  };

  switch (widget.the_type) {
    case WidgetType.MOTD:
      return <MOTDWidget {...widgetPropsWithGeometry} />;
    case WidgetType.KEY_HABITS_STREAKS:
      return <HabitKeyHabitStreakWidget {...widgetPropsWithGeometry} />;
    case WidgetType.HABIT_INBOX_TASKS:
      return <HabitInboxTasksWidget {...widgetPropsWithGeometry} />;
    case WidgetType.RANDOM_HABIT:
      return <HabitRandomWidget {...widgetPropsWithGeometry} />;
    case WidgetType.CHORE_INBOX_TASKS:
      return <ChoreInboxTasksWidget {...widgetPropsWithGeometry} />;
    case WidgetType.TODO_INBOX_TASKS:
      return <TodoInboxTasksWidget {...widgetPropsWithGeometry} />;
    case WidgetType.RANDOM_CHORE:
      return <ChoreRandomWidget {...widgetPropsWithGeometry} />;
    case WidgetType.KEY_PROJECTS_PROGRESS:
      return <KeyProjectsProgressWidget {...widgetPropsWithGeometry} />;
    case WidgetType.UPCOMING_BIRTHDAYS:
      return <UpcomingBirthdaysWidget {...widgetPropsWithGeometry} />;
    case WidgetType.CALENDAR_DAY:
      return <CalendarDailyWidget {...widgetPropsWithGeometry} />;
    case WidgetType.SCHEDULE_DAY:
      return <ScheduleDailyWidget {...widgetPropsWithGeometry} />;
    case WidgetType.TIME_PLAN_VIEW:
      return <TimePlanViewWidget {...widgetPropsWithGeometry} />;
    case WidgetType.GAMIFICATION_OVERVIEW:
      return <GamificationOverviewWidget {...widgetPropsWithGeometry} />;
    case WidgetType.GAMIFICATION_HISTORY_WEEKLY:
      return <GamificationHistoryWeeklyWidget {...widgetPropsWithGeometry} />;
    case WidgetType.GAMIFICATION_HISTORY_MONTHLY:
      return <GamificationHistoryMonthlyWidget {...widgetPropsWithGeometry} />;
    case WidgetType.LIFE_WEEKS:
      return <LifeWeeksWidget {...widgetPropsWithGeometry} />;
    case WidgetType.LIFE_VISION:
      return <LifeVisionWidget {...widgetPropsWithGeometry} />;
    case WidgetType.LIFE_CHAPTERS:
      return <LifeChaptersWidget {...widgetPropsWithGeometry} />;
    case WidgetType.COLLABORATION:
      return <CollaborationWidget {...widgetPropsWithGeometry} />;
  }
}

function inferCurrentTabs(tabs: HomeTab[], tabRefId?: string): string {
  if (tabRefId) {
    const tab = tabs.find((t) => t.ref_id === tabRefId);
    if (tab) {
      return tab.ref_id;
    }
  }

  return tabs[0].ref_id;
}
