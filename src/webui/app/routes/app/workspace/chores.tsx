import type {
  Chapter,
  ChoreFindResultEntry,
  Goal,
  GoalSummary,
  Project,
  ProjectSummary,
  Tag,
} from "@jupiter/webapi-client";
import {
  WorkspaceFeature,
  DocsHelpSubject,
  RecurringTaskPeriod,
  TagNamespace,
} from "@jupiter/webapi-client";
import ViewListIcon from "@mui/icons-material/ViewList";
import FlareIcon from "@mui/icons-material/Flare";
import FlagIcon from "@mui/icons-material/Flag";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import { Fragment, useContext, useState } from "react";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortChoresNaturally } from "@jupiter/core/chores/root";
import Check from "@jupiter/core/infra/component/check";
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
import { ProjectTag } from "@jupiter/core/life_plan/sub/aspects/component/tag";
import {
  computeProjectHierarchicalNameFromRoot,
  sortProjectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeyTag } from "@jupiter/core/common/component/is-key-tag";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { periodName } from "@jupiter/core/common/recurring-task-period";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

enum Grouping {
  FLAT = "flat",
  BY_PROJECT = "by-project",
  BY_PROJECT_AND_GOAL = "by-project-and-goal",
}

enum PeriodBreakdown {
  LIST = "list",
  BY_PERIOD = "by-period",
}

enum GroupVisibility {
  NON_EMPTY_ONLY = "non-empty-only",
  SHOW_ALL = "show-all",
}

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
    include_goals: true,
  });

  const response = await apiClient.chores.choreFind({
    allow_archived: false,
    include_tags: true,
    include_life_plan: true,
    include_inbox_tasks: false,
    include_notes: false,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.CHORE],
  });

  return json({
    chores: response.entries,
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    allGoals: summaryResponse.goals as Array<GoalSummary>,
    allTags: allTags.tags as Array<Tag>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Chores() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const entriesByRefId = new Map<string, ChoreFindResultEntry>();
  for (const entry of loaderData.chores) {
    entriesByRefId.set(entry.chore.ref_id, entry);
  }

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const sortedChores = sortChoresNaturally(
    (loaderData.chores as Array<ChoreFindResultEntry>).map((e) => e.chore),
  ).filter((chore) => {
    const entry = entriesByRefId.get(chore.ref_id);
    const tagsOk =
      selectedTagsRefId.length === 0 ||
      entry?.tags?.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id));
    return tagsOk;
  });

  const lifePlanAvailable = isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    WorkspaceFeature.LIFE_PLAN,
  );

  const [selectedGrouping, setSelectedGrouping] = useState<Grouping>(
    lifePlanAvailable ? Grouping.BY_PROJECT_AND_GOAL : Grouping.FLAT,
  );
  const [selectedPeriodBreakdown, setSelectedPeriodBreakdown] =
    useState<PeriodBreakdown>(
      isBigScreen ? PeriodBreakdown.BY_PERIOD : PeriodBreakdown.LIST,
    );
  const [selectedGroupVisibility, setSelectedGroupVisibility] =
    useState<GroupVisibility>(GroupVisibility.NON_EMPTY_ONLY);

  const sortedProjects = sortProjectsByTreeOrder(loaderData.allProjects || []);
  const allProjectsByRefId = new Map(
    loaderData.allProjects?.map((p) => [p.ref_id, p]),
  );

  const sortedGoals = sortGoalsNaturally(loaderData.allGoals || []);
  const allGoalsByRefId = new Map(
    loaderData.allGoals?.map((g) => [g.ref_id, g]),
  );

  return (
    <TrunkPanel
      key={"chores"}
      createLocation="/app/workspace/chores/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="chores-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterFewOptionsCompact(
              "Grouping",
              selectedGrouping,
              [
                {
                  value: Grouping.BY_PROJECT_AND_GOAL,
                  text: "By Project & Goal",
                  icon: <FlagIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: Grouping.BY_PROJECT,
                  text: "By Project",
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
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {sortedChores.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no chores to show. You can create a new chore."
            newEntityLocations="/app/workspace/chores/new"
            helpSubject={DocsHelpSubject.CHORES}
          />
        )}

        {selectedGrouping === Grouping.FLAT &&
          isBigScreen &&
          selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD && (
            <ChoresByPeriodsStack
              chores={sortedChores}
              renderStack={(subset) => (
                <ChoresFlatStack
                  chores={subset}
                  entriesByRefId={entriesByRefId}
                  topLevelInfo={topLevelInfo}
                  showPeriodTag={false}
                />
              )}
            />
          )}

        {selectedGrouping === Grouping.FLAT &&
          !(
            isBigScreen && selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD
          ) && (
            <ChoresFlatStack
              chores={sortedChores}
              entriesByRefId={entriesByRefId}
              topLevelInfo={topLevelInfo}
              showPeriodTag={true}
            />
          )}

        {selectedGrouping === Grouping.BY_PROJECT && (
          <ChoresByProjectStack
            chores={sortedChores}
            isBigScreen={isBigScreen}
            selectedPeriodBreakdown={selectedPeriodBreakdown}
            showEmptyGroups={
              selectedGroupVisibility === GroupVisibility.SHOW_ALL
            }
            sortedProjects={sortedProjects}
            allProjectsByRefId={allProjectsByRefId}
            entriesByRefId={entriesByRefId}
            topLevelInfo={topLevelInfo}
          />
        )}

        {selectedGrouping === Grouping.BY_PROJECT_AND_GOAL && (
          <ChoresByProjectAndGoalStack
            chores={sortedChores}
            isBigScreen={isBigScreen}
            selectedPeriodBreakdown={selectedPeriodBreakdown}
            showEmptyGroups={
              selectedGroupVisibility === GroupVisibility.SHOW_ALL
            }
            sortedProjects={sortedProjects}
            allProjectsByRefId={allProjectsByRefId}
            sortedGoals={sortedGoals}
            allGoalsByRefId={allGoalsByRefId}
            entriesByRefId={entriesByRefId}
            topLevelInfo={topLevelInfo}
          />
        )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the chores! Please try again!`,
});

interface ChoreRowProps {
  choreRefId: string;
  entriesByRefId: Map<string, ChoreFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
  showProjectTag: boolean;
  showGoalTag: boolean;
  showPeriodTag: boolean;
}

function ChoreRow(props: ChoreRowProps) {
  const entry = props.entriesByRefId.get(props.choreRefId);
  if (!entry) {
    return null;
  }
  const chore = entry.chore;

  return (
    <EntityCard
      key={`chore-${chore.ref_id}`}
      entityId={`chore-${chore.ref_id}`}
    >
      <EntityLink to={`/app/workspace/chores/${chore.ref_id}`}>
        <IsKeyTag isKey={chore.is_key} />
        <EntityNameComponent name={chore.name} />
        {props.showProjectTag &&
          isWorkspaceFeatureAvailable(
            props.topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) && <ProjectTag project={entry.project as Project} />}
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
        <Check isDone={!chore.suspended} label="Active" />
        {props.showPeriodTag && <PeriodTag period={chore.gen_params.period} />}
        {chore.gen_params.eisen && <EisenTag eisen={chore.gen_params.eisen} />}
        {chore.gen_params.difficulty && (
          <DifficultyTag difficulty={chore.gen_params.difficulty} />
        )}
        {entry.tags?.map((tag: Tag) => (
          <TagTag key={tag.ref_id} tag={tag} />
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

interface ChoresFlatStackProps {
  chores: Array<ChoreFindResultEntry["chore"]>;
  entriesByRefId: Map<string, ChoreFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
  showProjectTag?: boolean;
  showGoalTag?: boolean;
  showPeriodTag?: boolean;
}

function ChoresFlatStack(props: ChoresFlatStackProps) {
  const showProjectTag = props.showProjectTag ?? true;
  const showGoalTag = props.showGoalTag ?? true;
  const showPeriodTag = props.showPeriodTag ?? true;

  return (
    <EntityStack>
      {props.chores.map((chore) => (
        <ChoreRow
          key={`chore-${chore.ref_id}`}
          choreRefId={chore.ref_id}
          entriesByRefId={props.entriesByRefId}
          topLevelInfo={props.topLevelInfo}
          showProjectTag={showProjectTag}
          showGoalTag={showGoalTag}
          showPeriodTag={showPeriodTag}
        />
      ))}
    </EntityStack>
  );
}

interface ChoresByProjectStackProps {
  chores: Array<ChoreFindResultEntry["chore"]>;
  isBigScreen: boolean;
  selectedPeriodBreakdown: PeriodBreakdown;
  showEmptyGroups: boolean;
  sortedProjects: Array<ProjectSummary>;
  allProjectsByRefId: Map<string, ProjectSummary>;
  entriesByRefId: Map<string, ChoreFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
}

function ChoresByProjectStack(props: ChoresByProjectStackProps) {
  const showPeriodTag =
    props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  const shouldShowByPeriods =
    props.isBigScreen &&
    props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;

  return (
    <>
      {props.sortedProjects.map((project) => {
        const projectChores = props.chores.filter(
          (c) => c.project_ref_id === project.ref_id,
        );
        if (projectChores.length === 0 && !props.showEmptyGroups) {
          return null;
        }

        const fullProjectName = computeProjectHierarchicalNameFromRoot(
          project,
          props.allProjectsByRefId,
        );

        return (
          <Fragment key={`project-${project.ref_id}`}>
            <StandardDivider title={fullProjectName} size="large" />

            {projectChores.length === 0 && <EmptyChoresHint />}

            {projectChores.length > 0 && shouldShowByPeriods && (
              <ChoresByPeriodsStack
                chores={projectChores}
                renderStack={(subset) => (
                  <ChoresFlatStack
                    chores={subset}
                    entriesByRefId={props.entriesByRefId}
                    topLevelInfo={props.topLevelInfo}
                    showProjectTag={false}
                    showGoalTag={true}
                    showPeriodTag={false}
                  />
                )}
              />
            )}

            {projectChores.length > 0 && !shouldShowByPeriods && (
              <ChoresFlatStack
                chores={projectChores}
                entriesByRefId={props.entriesByRefId}
                topLevelInfo={props.topLevelInfo}
                showProjectTag={false}
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

interface ChoresByProjectAndGoalStackProps {
  chores: Array<ChoreFindResultEntry["chore"]>;
  isBigScreen: boolean;
  selectedPeriodBreakdown: PeriodBreakdown;
  showEmptyGroups: boolean;
  sortedProjects: Array<ProjectSummary>;
  allProjectsByRefId: Map<string, ProjectSummary>;
  sortedGoals: Array<GoalSummary>;
  allGoalsByRefId: Map<string, GoalSummary>;
  entriesByRefId: Map<string, ChoreFindResultEntry>;
  topLevelInfo: React.ContextType<typeof TopLevelInfoContext>;
}

function ChoresByProjectAndGoalStack(props: ChoresByProjectAndGoalStackProps) {
  const showPeriodTag =
    props.selectedPeriodBreakdown !== PeriodBreakdown.BY_PERIOD;
  const shouldShowByPeriods =
    props.isBigScreen &&
    props.selectedPeriodBreakdown === PeriodBreakdown.BY_PERIOD;

  return (
    <>
      {props.sortedProjects.map((project) => {
        const projectChores = props.chores.filter(
          (c) => c.project_ref_id === project.ref_id,
        );
        if (projectChores.length === 0 && !props.showEmptyGroups) {
          return null;
        }

        const fullProjectName = computeProjectHierarchicalNameFromRoot(
          project,
          props.allProjectsByRefId,
        );

        if (projectChores.length === 0) {
          return (
            <Fragment key={`project-${project.ref_id}`}>
              <StandardDivider title={fullProjectName} size="large" />
              <EmptyChoresHint />
            </Fragment>
          );
        }

        const choresByGoalRefId = new Map<string, typeof projectChores>();
        const noGoalChores: typeof projectChores = [];
        for (const chore of projectChores) {
          const goalRefId = chore.goal_ref_id ?? null;
          if (!goalRefId) {
            noGoalChores.push(chore);
            continue;
          }
          const existing = choresByGoalRefId.get(goalRefId) ?? [];
          existing.push(chore);
          choresByGoalRefId.set(goalRefId, existing);
        }

        const projectGoals = props.sortedGoals
          .filter((g) => g.project_ref_id === project.ref_id)
          .filter(
            (g) => props.showEmptyGroups || choresByGoalRefId.has(g.ref_id),
          );

        return (
          <Fragment key={`project-${project.ref_id}`}>
            <StandardDivider title={fullProjectName} size="large" />

            {projectGoals.map((goal) => {
              const goalChores = choresByGoalRefId.get(goal.ref_id) ?? [];
              if (goalChores.length === 0 && !props.showEmptyGroups) {
                return null;
              }

              return (
                <Fragment key={`project-${project.ref_id}-goal-${goal.ref_id}`}>
                  <StandardDivider
                    title={`🎯 ${fullGoalName(goal, props.allGoalsByRefId)}`}
                    size="medium"
                  />
                  {goalChores.length === 0 && <EmptyChoresHint />}
                  {goalChores.length > 0 && shouldShowByPeriods && (
                    <ChoresByPeriodsStack
                      chores={goalChores}
                      renderStack={(subset) => (
                        <ChoresFlatStack
                          chores={subset}
                          entriesByRefId={props.entriesByRefId}
                          topLevelInfo={props.topLevelInfo}
                          showProjectTag={false}
                          showGoalTag={false}
                          showPeriodTag={false}
                        />
                      )}
                    />
                  )}
                  {goalChores.length > 0 && !shouldShowByPeriods && (
                    <ChoresFlatStack
                      chores={goalChores}
                      entriesByRefId={props.entriesByRefId}
                      topLevelInfo={props.topLevelInfo}
                      showProjectTag={false}
                      showGoalTag={false}
                      showPeriodTag={showPeriodTag}
                    />
                  )}
                </Fragment>
              );
            })}

            {noGoalChores.length > 0 && (
              <>
                <StandardDivider title="🚫 No Goal" size="medium" />
                {shouldShowByPeriods && (
                  <ChoresByPeriodsStack
                    chores={noGoalChores}
                    renderStack={(subset) => (
                      <ChoresFlatStack
                        chores={subset}
                        entriesByRefId={props.entriesByRefId}
                        topLevelInfo={props.topLevelInfo}
                        showProjectTag={false}
                        showGoalTag={false}
                        showPeriodTag={false}
                      />
                    )}
                  />
                )}

                {!shouldShowByPeriods && (
                  <ChoresFlatStack
                    chores={noGoalChores}
                    entriesByRefId={props.entriesByRefId}
                    topLevelInfo={props.topLevelInfo}
                    showProjectTag={false}
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

function EmptyChoresHint() {
  return (
    <Box sx={{ paddingBottom: 1, opacity: 0.7, fontSize: "0.9rem" }}>
      No chores.
    </Box>
  );
}

interface ChoresByPeriodsStackProps {
  chores: Array<ChoreFindResultEntry["chore"]>;
  renderStack: (chores: Array<ChoreFindResultEntry["chore"]>) => JSX.Element;
}

function ChoresByPeriodsStack(props: ChoresByPeriodsStackProps) {
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
        const subset = props.chores.filter(
          (c) => c.gen_params.period === period && !c.suspended,
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
        {props.renderStack(props.chores.filter((c) => c.suspended))}
      </Box>
    </Box>
  );
}
