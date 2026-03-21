import type {
  ADate,
  Chapter,
  Contact,
  Goal,
  GoalSummary,
  HabitFindResultEntry,
  HabitLoadResult,
  InboxTask,
  Aspect,
  AspectSummary,
  Tag,
} from "@jupiter/webapi-client";
import {
  WidgetDimension,
  WorkspaceFeature,
  DocsHelpSubject,
  InboxTaskSource,
  InboxTaskStatus,
  RecurringTaskPeriod,
  TagNamespace,
} from "@jupiter/webapi-client";
import ViewListIcon from "@mui/icons-material/ViewList";
import FlareIcon from "@mui/icons-material/Flare";
import FlagIcon from "@mui/icons-material/Flag";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { Box, Tab, Tabs } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useFetcher } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Fragment, useContext, useState } from "react";
import { DateTime } from "luxon";
import { z } from "zod";
import { parseQuery } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortHabitsNaturally } from "@jupiter/core/habits/root";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { DifficultyTag } from "@jupiter/core/common/component/difficulty-tag";
import { EisenTag } from "@jupiter/core/common/component/eisen-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { AspectTag } from "@jupiter/core/life_plan/sub/aspects/component/tag";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { IsKeyTag } from "@jupiter/core/common/component/is-key-tag";
import { HabitKeyHabitStreakWidget } from "@jupiter/core/habits/component/key-habit-streak-widget";
import { HabitInboxTasksWidget } from "@jupiter/core/habits/component/inbox-tasks-widget";
import { WidgetProps } from "@jupiter/core/home/component/common";
import {
  inboxTaskFindEntryToParent,
  InboxTaskOptimisticState,
  InboxTaskParent,
  sortInboxTasksNaturally,
} from "@jupiter/core/inbox_tasks/root";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

enum Grouping {
  FLAT = "flat",
  BY_ASPECT = "by-aspect",
  BY_ASPECT_AND_GOAL = "by-aspect-and-goal",
}

enum PeriodBreakdown {
  LIST = "list",
  BY_PERIOD = "by-period",
}

enum GroupVisibility {
  NON_EMPTY_ONLY = "non-empty-only",
  SHOW_ALL = "show-all",
}

const QuerySchema = z.object({
  includeStreakMarksEarliestDate: z.string().optional(),
  includeStreakMarksLatestDate: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
    include_goals: true,
  });

  const response = await apiClient.habits.habitFind({
    allow_archived: false,
    include_tags: true,
    include_notes: false,
    include_life_plan: true,
    include_inbox_tasks: false,
  });

  const habitInboxTasksResponse = await apiClient.inboxTasks.inboxTaskFind({
    allow_archived: false,
    include_time_event_blocks: false,
    filter_sources: [InboxTaskSource.HABIT],
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.HABIT],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  let earliestDate = query.includeStreakMarksEarliestDate;
  let latestDate = query.includeStreakMarksLatestDate;
  if (earliestDate === undefined) {
    earliestDate = DateTime.now().minus({ days: 365 }).toISODate();
    latestDate = DateTime.now().toISODate();
  }

  const keyHabitRefIds = response.entries
    .filter((e) => e.habit.is_key)
    .map((e) => e.habit.ref_id);

  let keyHabitResults: HabitLoadResult[] = [];
  if (keyHabitRefIds.length > 0) {
    keyHabitResults = await Promise.all(
      keyHabitRefIds.map((refId) =>
        apiClient.habits.habitLoad({
          ref_id: refId,
          allow_archived: false,
          include_streak_marks_earliest_date: earliestDate,
          include_streak_marks_latest_date: latestDate,
        }),
      ),
    );
  }

  return json({
    habits: response.entries,
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
    allTags: allTags.tags,
    allContacts: allContacts.contacts as Array<Contact>,
    keyHabitStreaks: keyHabitResults.map((h) => ({
      habitRefId: h.habit.ref_id,
      streakMarkEarliestDate: h.streak_mark_earliest_date,
      streakMarkLatestDate: h.streak_mark_latest_date,
      streakMarks: h.streak_marks,
    })),
    habitInboxTasks: habitInboxTasksResponse.entries,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Habits() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const [mobileTab, setMobileTab] = useState<"streaks" | "habits" | "tasks">(
    "streaks",
  );
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    [key: string]: InboxTaskOptimisticState;
  }>({});
  const kanbanBoardMoveFetcher = useFetcher();

  const sortedHabitInboxTasks = sortInboxTasksNaturally(
    loaderData.habitInboxTasks.map((e) => e.inbox_task),
  );
  const habitEntriesByRefId: { [key: string]: InboxTaskParent } = {};
  for (const entry of loaderData.habitInboxTasks) {
    habitEntriesByRefId[entry.inbox_task.ref_id] =
      inboxTaskFindEntryToParent(entry);
  }

  function handleCardMarkDone(it: InboxTask) {
    setOptimisticUpdates((old) => ({
      ...old,
      [it.ref_id]: {
        status: InboxTaskStatus.DONE,
        eisen: old[it.ref_id]?.eisen ?? it.eisen,
      },
    }));
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        { id: it.ref_id, status: InboxTaskStatus.DONE },
        {
          method: "post",
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  function handleCardMarkNotDone(it: InboxTask) {
    setOptimisticUpdates((old) => ({
      ...old,
      [it.ref_id]: {
        status: InboxTaskStatus.NOT_DONE,
        eisen: old[it.ref_id]?.eisen ?? it.eisen,
      },
    }));
    setTimeout(() => {
      kanbanBoardMoveFetcher.submit(
        { id: it.ref_id, status: InboxTaskStatus.NOT_DONE },
        {
          method: "post",
          action: "/app/workspace/inbox-tasks/update-status-and-eisen",
        },
      );
    }, 0);
  }

  const lifePlanAvailable = isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    WorkspaceFeature.LIFE_PLAN,
  );

  const [selectedGrouping, setSelectedGrouping] = useState<Grouping>(
    lifePlanAvailable ? Grouping.BY_ASPECT_AND_GOAL : Grouping.FLAT,
  );
  const [selectedPeriodBreakdown, setSelectedPeriodBreakdown] =
    useState<PeriodBreakdown>(
      isBigScreen ? PeriodBreakdown.BY_PERIOD : PeriodBreakdown.LIST,
    );
  const [selectedGroupVisibility, setSelectedGroupVisibility] =
    useState<GroupVisibility>(GroupVisibility.NON_EMPTY_ONLY);
  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const tagsByRefId: { [tag: string]: Tag } = {};
  for (const tag of loaderData.allTags) {
    tagsByRefId[tag.ref_id] = tag;
  }

  const entriesByRefId = new Map<string, HabitFindResultEntry>();
  for (const entry of loaderData.habits) {
    entriesByRefId.set(entry.habit.ref_id, entry);
  }

  const sortedHabits = sortHabitsNaturally(
    loaderData.habits.map((e) => e.habit),
  ).filter((habit) => {
    const tagsOk =
      selectedTagsRefId.length === 0 ||
      entriesByRefId
        .get(habit.ref_id)
        ?.tags?.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk =
      selectedContactsRefId.length === 0 ||
      entriesByRefId
        .get(habit.ref_id)
        ?.contacts?.some((contact) =>
          selectedContactsRefId.includes(contact.ref_id),
        );
    return tagsOk && contactsOk;
  });

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(
    loaderData.allAspects?.map((p) => [p.ref_id, p]),
  );

  const sortedGoals = sortGoalsNaturally(loaderData.allGoals || []);
  const allGoalsByRefId = new Map(
    loaderData.allGoals?.map((g) => [g.ref_id, g]),
  );

  const rightNow = DateTime.local({ zone: topLevelInfo.user.timezone });

  const streakWidgetProps: WidgetProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    habitStreak: {
      earliestDate:
        loaderData.keyHabitStreaks[0]?.streakMarkEarliestDate ??
        topLevelInfo.today,
      latestDate:
        loaderData.keyHabitStreaks[0]?.streakMarkLatestDate ??
        topLevelInfo.today,
      currentToday: topLevelInfo.today,
      entries: loaderData.keyHabitStreaks.map((h) => ({
        habit: entriesByRefId.get(h.habitRefId)!.habit,
        streakMarks: h.streakMarks,
      })),
      label: "Latest Streak",
      showNav: true,
      getNavUrl: (earliestDate: ADate, latestDate: ADate) => {
        return `/app/workspace/habits?includeStreakMarksEarliestDate=${earliestDate}&includeStreakMarksLatestDate=${latestDate}`;
      },
    },
    geometry: {
      row: 0,
      col: 0,
      dimension: WidgetDimension.DIM_3X1,
    },
  };

  const tasksWidgetProps: WidgetProps = {
    rightNow,
    timezone: topLevelInfo.user.timezone,
    topLevelInfo,
    habitTasks: {
      habits: loaderData.habits.map((e) => e.habit),
      habitInboxTasks: sortedHabitInboxTasks,
      habitEntriesByRefId,
      optimisticUpdates,
      onCardMarkDone: handleCardMarkDone,
      onCardMarkNotDone: handleCardMarkNotDone,
    },
    geometry: {
      row: 0,
      col: 0,
      dimension: WidgetDimension.DIM_1X3,
    },
  };

  return (
    <TrunkPanel
      key={"habits"}
      createLocation="/app/workspace/habits/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="habits-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterFewOptionsCompact(
              "Grouping",
              selectedGrouping,
              [
                {
                  value: Grouping.BY_ASPECT_AND_GOAL,
                  text: "By Aspect & Goal",
                  icon: <FlagIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: Grouping.BY_ASPECT,
                  text: "By Aspect",
                  icon: <FlareIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                { value: Grouping.FLAT, text: "Flat", icon: <ViewListIcon /> },
              ],
              (selected) => setSelectedGrouping(selected),
            ),
            ...(isBigScreen
              ? [
                  FilterFewOptionsCompact(
                    "Periods",
                    selectedPeriodBreakdown,
                    [
                      {
                        value: PeriodBreakdown.BY_PERIOD,
                        text: "By Period",
                        icon: <ViewTimelineIcon />,
                      },
                      {
                        value: PeriodBreakdown.LIST,
                        text: "List",
                        icon: <ViewListIcon />,
                      },
                    ],
                    (selected) => setSelectedPeriodBreakdown(selected),
                  ),
                ]
              : []),
            ...(lifePlanAvailable && selectedGrouping !== Grouping.FLAT
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
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
            FilterManyOptions(
              "Contacts",
              loaderData.allContacts.map((contact) => ({
                value: contact.ref_id,
                text: contact.name,
              })),
              setSelectedContactsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {isBigScreen ? (
          <>
            {loaderData.habits.length === 0 && (
              <EntityNoNothingCard
                title="You Have To Start Somewhere"
                message="There are no habits to show. You can create a new habit."
                newEntityLocations="/app/workspace/habits/new"
                helpSubject={DocsHelpSubject.HABITS}
              />
            )}

            {loaderData.keyHabitStreaks.length > 0 && (
              <HabitKeyHabitStreakWidget {...streakWidgetProps} />
            )}

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {selectedGrouping === Grouping.FLAT &&
                  selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && (
                    <HabitsByPeriodsStack
                      habits={sortedHabits}
                      renderStack={(subset) => (
                        <HabitsFlatStack
                          habits={subset}
                          entriesByRefId={entriesByRefId}
                          topLevelInfo={topLevelInfo}
                          showPeriodTag={false}
                        />
                      )}
                    />
                  )}

                {selectedGrouping === Grouping.FLAT &&
                  selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD && (
                    <HabitsFlatStack
                      habits={sortedHabits}
                      entriesByRefId={entriesByRefId}
                      topLevelInfo={topLevelInfo}
                      showPeriodTag={true}
                    />
                  )}

                {selectedGrouping === Grouping.BY_ASPECT && (
                  <HabitsByAspectStack
                    habits={sortedHabits}
                    isBigScreen={isBigScreen}
                    selectedPeriodBreakdown={selectedPeriodBreakdown}
                    showEmptyGroups={
                      selectedGroupVisibility === GroupVisibility.SHOW_ALL
                    }
                    sortedAspects={sortedAspects}
                    allAspectsByRefId={allAspectsByRefId}
                    entriesByRefId={entriesByRefId}
                    topLevelInfo={topLevelInfo}
                  />
                )}

                {selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && (
                  <HabitsByAspectAndGoalStack
                    habits={sortedHabits}
                    isBigScreen={isBigScreen}
                    selectedPeriodBreakdown={selectedPeriodBreakdown}
                    showEmptyGroups={
                      selectedGroupVisibility === GroupVisibility.SHOW_ALL
                    }
                    sortedAspects={sortedAspects}
                    allAspectsByRefId={allAspectsByRefId}
                    sortedGoals={sortedGoals}
                    allGoalsByRefId={allGoalsByRefId}
                    entriesByRefId={entriesByRefId}
                    topLevelInfo={topLevelInfo}
                  />
                )}
              </Box>

              <Box
                sx={{
                  width: "320px",
                  flexShrink: 0,
                  position: "sticky",
                  top: "1rem",
                  maxHeight: "calc(100vh - 8rem)",
                  overflowY: "auto",
                  border: (theme) => `2px dotted ${theme.palette.primary.main}`,
                  borderRadius: "4px",
                  padding: "0.4rem",
                }}
              >
                <HabitInboxTasksWidget {...tasksWidgetProps} />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Tabs
              value={mobileTab}
              variant="scrollable"
              scrollButtons="auto"
              onChange={(_, v) => setMobileTab(v)}
            >
              <Tab label="Streaks" value="streaks" />
              <Tab label="Habits" value="habits" />
              <Tab label="Tasks" value="tasks" />
            </Tabs>

            {mobileTab === "streaks" && (
              <>
                {loaderData.habits.length === 0 && (
                  <EntityNoNothingCard
                    title="You Have To Start Somewhere"
                    message="There are no habits to show. You can create a new habit."
                    newEntityLocations="/app/workspace/habits/new"
                    helpSubject={DocsHelpSubject.HABITS}
                  />
                )}
                {loaderData.keyHabitStreaks.length > 0 && (
                  <HabitKeyHabitStreakWidget {...streakWidgetProps} />
                )}
              </>
            )}

            {mobileTab === "habits" && (
              <>
                {sortedHabits.length === 0 && (
                  <EntityNoNothingCard
                    title="You Have To Start Somewhere"
                    message="There are no habits to show. You can create a new habit."
                    newEntityLocations="/app/workspace/habits/new"
                    helpSubject={DocsHelpSubject.HABITS}
                  />
                )}

                {selectedGrouping === Grouping.FLAT && (
                  <HabitsFlatStack
                    habits={sortedHabits}
                    entriesByRefId={entriesByRefId}
                    topLevelInfo={topLevelInfo}
                    showPeriodTag={true}
                  />
                )}

                {selectedGrouping === Grouping.BY_ASPECT && (
                  <HabitsByAspectStack
                    habits={sortedHabits}
                    isBigScreen={isBigScreen}
                    selectedPeriodBreakdown={selectedPeriodBreakdown}
                    showEmptyGroups={
                      selectedGroupVisibility === GroupVisibility.SHOW_ALL
                    }
                    sortedAspects={sortedAspects}
                    allAspectsByRefId={allAspectsByRefId}
                    entriesByRefId={entriesByRefId}
                    topLevelInfo={topLevelInfo}
                  />
                )}

                {selectedGrouping === Grouping.BY_ASPECT_AND_GOAL && (
                  <HabitsByAspectAndGoalStack
                    habits={sortedHabits}
                    isBigScreen={isBigScreen}
                    selectedPeriodBreakdown={selectedPeriodBreakdown}
                    showEmptyGroups={
                      selectedGroupVisibility === GroupVisibility.SHOW_ALL
                    }
                    sortedAspects={sortedAspects}
                    allAspectsByRefId={allAspectsByRefId}
                    sortedGoals={sortedGoals}
                    allGoalsByRefId={allGoalsByRefId}
                    entriesByRefId={entriesByRefId}
                    topLevelInfo={topLevelInfo}
                  />
                )}
              </>
            )}

            {mobileTab === "tasks" && (
              <HabitInboxTasksWidget {...tasksWidgetProps} />
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

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the habits! Please try again!`,
});

interface HabitRowProps {
  habitRefId: string;
  entriesByRefId: Map<string, HabitFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
  showAspectTag: boolean;
  showGoalTag: boolean;
  showPeriodTag: boolean;
}

function HabitRow(props: HabitRowProps) {
  const entry = props.entriesByRefId.get(props.habitRefId);
  if (!entry) {
    return null;
  }
  const habit = entry.habit;

  return (
    <EntityCard
      key={`habit-${habit.ref_id}`}
      entityId={`habit-${habit.ref_id}`}
    >
      <EntityLink to={`/app/workspace/habits/${habit.ref_id}`}>
        <IsKeyTag isKey={habit.is_key} />
        <EntityNameComponent name={habit.name} />
        {props.showAspectTag &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) && <AspectTag aspect={entry.aspect as Aspect} />}
        {isWorkspaceFeatureAvailable(
          props.topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) &&
          entry.chapter && <ChapterTag chapter={entry.chapter as Chapter} />}
        {props.showGoalTag &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          entry.goal && <GoalTag goal={entry.goal as Goal} />}
        {habit.suspended && <span className="tag">Suspended</span>}
        {props.showPeriodTag && <PeriodTag period={habit.gen_params.period} />}
        {habit.gen_params.eisen && <EisenTag eisen={habit.gen_params.eisen} />}
        {habit.gen_params.difficulty && (
          <DifficultyTag difficulty={habit.gen_params.difficulty} />
        )}
        {entry.tags?.map((tag) => (
          <TagTag key={tag.ref_id} tag={tag} />
        ))}
        {entry.contacts?.map((contact) => (
          <ContactTag key={contact.ref_id} contact={contact} />
        ))}
      </EntityLink>
    </EntityCard>
  );
}

function fullGoalName(
  goal: GoalSummary,
  goalsByRefId: Map<string, GoalSummary>,
): string {
  const visited = new Set<string>();
  const parts: string[] = [String(goal.name)];

  let current: GoalSummary | undefined = goal;
  while (current?.parent_goal_ref_id) {
    const parentRefId = String(current.parent_goal_ref_id);
    if (visited.has(parentRefId)) {
      break;
    }
    visited.add(parentRefId);
    const parent = goalsByRefId.get(parentRefId);
    if (!parent) {
      break;
    }
    parts.unshift(String(parent.name));
    current = parent;
  }

  return parts.join(" / ");
}

interface HabitsFlatStackProps {
  habits: Array<HabitFindResultEntry["habit"]>;
  entriesByRefId: Map<string, HabitFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
  showAspectTag?: boolean;
  showGoalTag?: boolean;
  showPeriodTag?: boolean;
}

function HabitsFlatStack(props: HabitsFlatStackProps) {
  const showAspectTag = props.showAspectTag ?? true;
  const showGoalTag = props.showGoalTag ?? true;
  const showPeriodTag = props.showPeriodTag ?? true;

  return (
    <EntityStack>
      {props.habits.map((habit) => (
        <HabitRow
          key={`habit-${habit.ref_id}`}
          habitRefId={habit.ref_id}
          entriesByRefId={props.entriesByRefId}
          topLevelInfo={props.topLevelInfo}
          showAspectTag={showAspectTag}
          showGoalTag={showGoalTag}
          showPeriodTag={showPeriodTag}
        />
      ))}
    </EntityStack>
  );
}

interface HabitsByAspectStackProps {
  habits: Array<HabitFindResultEntry["habit"]>;
  isBigScreen: boolean;
  selectedPeriodBreakdown: PeriodBreakdown;
  showEmptyGroups: boolean;
  sortedAspects: Array<AspectSummary>;
  allAspectsByRefId: Map<string, AspectSummary>;
  entriesByRefId: Map<string, HabitFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
}

function HabitsByAspectStack(props: HabitsByAspectStackProps) {
  const showPeriodTag =
    props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;

  return (
    <>
      {props.sortedAspects.map((aspect) => {
        const aspectHabits = props.habits.filter(
          (h) => h.aspect_ref_id === aspect.ref_id,
        );
        if (aspectHabits.length === 0 && !props.showEmptyGroups) {
          return null;
        }

        const fullAspectName = computeAspectHierarchicalNameFromRoot(
          aspect,
          props.allAspectsByRefId,
        );

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />
            {aspectHabits.length === 0 && <EmptyHabitsHint />}

            {aspectHabits.length > 0 &&
              props.isBigScreen &&
              props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && (
                <HabitsByPeriodsStack
                  habits={aspectHabits}
                  renderStack={(subset) => (
                    <HabitsFlatStack
                      habits={subset}
                      entriesByRefId={props.entriesByRefId}
                      topLevelInfo={props.topLevelInfo}
                      showAspectTag={false}
                      showGoalTag={true}
                      showPeriodTag={false}
                    />
                  )}
                />
              )}

            {aspectHabits.length > 0 &&
              (!props.isBigScreen ||
                props.selectedPeriodBreakdown !==
                  PeriodBreakdown.BY_PERIOD) && (
                <HabitsFlatStack
                  habits={aspectHabits}
                  entriesByRefId={props.entriesByRefId}
                  topLevelInfo={props.topLevelInfo}
                  showAspectTag={false}
                  showGoalTag={true}
                  showPeriodTag={showPeriodTag}
                />
              )}
          </Fragment>
        );
      })}
    </>
  );
}

interface HabitsByAspectAndGoalStackProps {
  habits: Array<HabitFindResultEntry["habit"]>;
  isBigScreen: boolean;
  selectedPeriodBreakdown: PeriodBreakdown;
  showEmptyGroups: boolean;
  sortedAspects: Array<AspectSummary>;
  allAspectsByRefId: Map<string, AspectSummary>;
  sortedGoals: Array<GoalSummary>;
  allGoalsByRefId: Map<string, GoalSummary>;
  entriesByRefId: Map<string, HabitFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
}

function HabitsByAspectAndGoalStack(props: HabitsByAspectAndGoalStackProps) {
  const showPeriodTag =
    props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;

  return (
    <>
      {props.sortedAspects.map((aspect) => {
        const aspectHabits = props.habits.filter(
          (h) => h.aspect_ref_id === aspect.ref_id,
        );
        if (aspectHabits.length === 0 && !props.showEmptyGroups) {
          return null;
        }

        const fullAspectName = computeAspectHierarchicalNameFromRoot(
          aspect,
          props.allAspectsByRefId,
        );

        if (aspectHabits.length === 0) {
          return (
            <Fragment key={`aspect-${aspect.ref_id}`}>
              <StandardDivider title={fullAspectName} size="large" />
              <EmptyHabitsHint />
            </Fragment>
          );
        }

        const habitsByGoalRefId = new Map<string, typeof aspectHabits>();
        const noGoalHabits: typeof aspectHabits = [];
        for (const habit of aspectHabits) {
          const goalRefId = habit.goal_ref_id ?? null;
          if (!goalRefId) {
            noGoalHabits.push(habit);
            continue;
          }
          const existing = habitsByGoalRefId.get(goalRefId) ?? [];
          existing.push(habit);
          habitsByGoalRefId.set(goalRefId, existing);
        }

        const aspectGoals = props.sortedGoals
          .filter((g) => g.aspect_ref_id === aspect.ref_id)
          .filter(
            (g) => props.showEmptyGroups || habitsByGoalRefId.has(g.ref_id),
          );

        const shouldShowByPeriods =
          props.isBigScreen &&
          props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;

        return (
          <Fragment key={`aspect-${aspect.ref_id}`}>
            <StandardDivider title={fullAspectName} size="large" />

            {aspectGoals.map((goal) => {
              const goalHabits = habitsByGoalRefId.get(goal.ref_id) ?? [];
              if (goalHabits.length === 0 && !props.showEmptyGroups) {
                return null;
              }

              return (
                <Fragment key={`aspect-${aspect.ref_id}-goal-${goal.ref_id}`}>
                  <StandardDivider
                    title={`🎯 ${fullGoalName(goal, props.allGoalsByRefId)}`}
                    size="medium"
                  />
                  {goalHabits.length === 0 && <EmptyHabitsHint />}
                  {goalHabits.length > 0 && shouldShowByPeriods && (
                    <HabitsByPeriodsStack
                      habits={goalHabits}
                      renderStack={(subset) => (
                        <HabitsFlatStack
                          habits={subset}
                          entriesByRefId={props.entriesByRefId}
                          topLevelInfo={props.topLevelInfo}
                          showAspectTag={false}
                          showGoalTag={false}
                          showPeriodTag={false}
                        />
                      )}
                    />
                  )}
                  {goalHabits.length > 0 && !shouldShowByPeriods && (
                    <HabitsFlatStack
                      habits={goalHabits}
                      entriesByRefId={props.entriesByRefId}
                      topLevelInfo={props.topLevelInfo}
                      showAspectTag={false}
                      showGoalTag={false}
                      showPeriodTag={showPeriodTag}
                    />
                  )}
                </Fragment>
              );
            })}

            {noGoalHabits.length > 0 && (
              <>
                <StandardDivider title="🚫 No Goal" size="medium" />
                {shouldShowByPeriods && (
                  <HabitsByPeriodsStack
                    habits={noGoalHabits}
                    renderStack={(subset) => (
                      <HabitsFlatStack
                        habits={subset}
                        entriesByRefId={props.entriesByRefId}
                        topLevelInfo={props.topLevelInfo}
                        showAspectTag={false}
                        showGoalTag={false}
                        showPeriodTag={false}
                      />
                    )}
                  />
                )}

                {!shouldShowByPeriods && (
                  <HabitsFlatStack
                    habits={noGoalHabits}
                    entriesByRefId={props.entriesByRefId}
                    topLevelInfo={props.topLevelInfo}
                    showAspectTag={false}
                    showGoalTag={false}
                    showPeriodTag={showPeriodTag}
                  />
                )}
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function EmptyHabitsHint() {
  return (
    <Box sx={{ paddingBottom: 1, opacity: 0.7, fontSize: "0.9rem" }}>
      No habits.
    </Box>
  );
}

interface HabitsByPeriodsStackProps {
  habits: Array<HabitFindResultEntry["habit"]>;
  renderStack: (habits: Array<HabitFindResultEntry["habit"]>) => JSX.Element;
}

function HabitsByPeriodsStack(props: HabitsByPeriodsStackProps) {
  const periods = [
    RecurringTaskPeriod.DAILY,
    RecurringTaskPeriod.WEEKLY,
    RecurringTaskPeriod.MONTHLY,
    RecurringTaskPeriod.QUARTERLY,
    RecurringTaskPeriod.YEARLY,
  ] as const;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        flexWrap: "nowrap",
      }}
    >
      {periods.map((period) => {
        const subset = props.habits.filter(
          (h) => h.gen_params.period === period && !h.suspended,
        );
        return (
          <Box
            key={`period-${period}`}
            sx={{ flexBasis: "16.6%", flexGrow: 1, minWidth: 0 }}
          >
            <StandardDivider title={periodName(period)} size="large" />
            {props.renderStack(subset)}
          </Box>
        );
      })}

      {/* 6th column */}
      <Box sx={{ flexBasis: "16.6%", flexGrow: 1, minWidth: 0 }}>
        <StandardDivider title="Suspended" size="large" />
        {props.renderStack(props.habits.filter((h) => h.suspended))}
      </Box>
    </Box>
  );
}
