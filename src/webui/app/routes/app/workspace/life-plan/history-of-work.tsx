import type {
  BigPlan,
  BigPlanFindResultEntry,
  Chore,
  ChoreFindResultEntry,
  GoalSummary,
  Habit,
  HabitFindResultEntry,
  ProjectSummary,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, useSearchParams } from "@remix-run/react";
import { DateTime } from "luxon";
import { useContext, type PropsWithChildren } from "react";
import { z } from "zod";
import { parseQuery } from "zodix";
import { sortProjectsByTreeOrder } from "#/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { BigPlanStatusTag } from "@jupiter/core/big_plans/component/status-tag";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { Box, styled } from "@mui/material";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import {
  NavMultipleCompact,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { newURLParams } from "~/logic/navigation";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  hideNoGoal: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === "true" ? true : false)),
});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
    include_goals: true,
  });

  const bigPlansResponse = await apiClient.bigPlans.bigPlanFind({
    allow_archived: true,
    include_life_plan: true,
    include_milestones: false,
    include_stats: false,
    include_inbox_tasks: false,
    include_notes: false,
  });

  const habitsResponse = await apiClient.habits.habitFind({
    allow_archived: true,
    include_notes: false,
    include_life_plan: true,
    include_inbox_tasks: false,
  });

  const choresResponse = await apiClient.chores.choreFind({
    allow_archived: true,
    include_life_plan: true,
    include_inbox_tasks: false,
    include_notes: false,
  });

  return json({
    query: {
      hideNoGoal: query.hideNoGoal,
    },
    projects: (summaryResponse.projects ?? []) as ProjectSummary[],
    goals: (summaryResponse.goals ?? []) as GoalSummary[],
    bigPlanEntries: bigPlansResponse.entries as BigPlanFindResultEntry[],
    habitEntries: habitsResponse.entries as HabitFindResultEntry[],
    choreEntries: choresResponse.entries as ChoreFindResultEntry[],
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function LifePlanHistoryOfWork() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const [searchParams] = useSearchParams();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const sortedProjects = sortProjectsByTreeOrder(loaderData.projects);

  const sortedGoals = sortGoalsNaturally(loaderData.goals);
  const goalsByRefId = new Map(sortedGoals.map((g) => [g.ref_id, g]));

  const allBigPlans = loaderData.bigPlanEntries.map((e) => e.big_plan);
  const allHabits = loaderData.habitEntries.map((e) => e.habit);
  const allChores = loaderData.choreEntries.map((e) => e.chore);

  return (
    <BranchPanel
      key={"life-plan/history-of-work"}
      returnLocation="/app/workspace/life-plan"
      inputsEnabled={true}
      actions={
        <SectionActions
          id="history-of-work"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavMultipleCompact({
              navs: [
                NavSingle({
                  text: "Show No Goals",
                  link: `/app/workspace/life-plan/history-of-work?${newURLParams(searchParams, "hideNoGoal", "false")}`,
                }),
                NavSingle({
                  text: "Hide No Goals",
                  link: `/app/workspace/life-plan/history-of-work?${newURLParams(searchParams, "hideNoGoal", "true")}`,
                }),
              ],
            }),
          ]}
        />
      }
    >
      <SectionCard id="history-of-work" title="History of Work">
        {sortedProjects.map((project) => {
          const projectGoals = sortedGoals.filter(
            (g) => g.project_ref_id === project.ref_id,
          );

          return (
            <Box key={`project-${project.ref_id}`}>
              <StandardDivider title={String(project.name)} size="large" />

              {projectGoals.map((goal) => {
                const goalHabits = allHabits.filter(
                  (h: Habit) =>
                    h.project_ref_id === project.ref_id &&
                    (h.goal_ref_id ?? null) === goal.ref_id,
                );
                const goalChores = allChores.filter(
                  (c: Chore) =>
                    c.project_ref_id === project.ref_id &&
                    (c.goal_ref_id ?? null) === goal.ref_id,
                );
                const goalBigPlans = allBigPlans.filter(
                  (bp) =>
                    bp.project_ref_id === project.ref_id &&
                    (bp.goal_ref_id ?? null) === goal.ref_id,
                );

                if (
                  goalHabits.length === 0 &&
                  goalChores.length === 0 &&
                  goalBigPlans.length === 0
                ) {
                  return null;
                }

                const bigPlansByYear = new Map<number, BigPlan[]>();
                for (const bp of goalBigPlans) {
                  const year = computeStartedYear(bp);
                  bigPlansByYear.set(
                    year,
                    (bigPlansByYear.get(year) ?? []).concat(bp),
                  );
                }
                const years = [...bigPlansByYear.keys()].sort((a, b) => b - a);

                return (
                  <Box key={`project-${project.ref_id}-goal-${goal.ref_id}`}>
                    <StandardDivider
                      title={`🎯 ${fullGoalName(goal, goalsByRefId)}`}
                      size="medium"
                    />

                    {goalHabits.length > 0 && (
                      <>
                        <StandardDivider title="💪 Habits" size="small" />
                        <DenseLinksContainer>
                          {goalHabits.map((h) => (
                            <DenseLinksItem key={`habit-${h.ref_id}`}>
                              <DenseSingleLineLink
                                to={`/app/workspace/habits/${h.ref_id}`}
                              >
                                <span style={{ flexShrink: 0 }}>
                                  <PeriodTag period={h.gen_params.period} />
                                </span>
                                <Box
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                  }}
                                >
                                  <EntityNameComponent name={h.name} />
                                </Box>
                              </DenseSingleLineLink>
                            </DenseLinksItem>
                          ))}
                        </DenseLinksContainer>
                      </>
                    )}

                    {goalChores.length > 0 && (
                      <>
                        <StandardDivider title="♻️ Chores" size="small" />
                        <DenseLinksContainer>
                          {goalChores.map((c) => (
                            <DenseLinksItem key={`chore-${c.ref_id}`}>
                              <DenseSingleLineLink
                                to={`/app/workspace/chores/${c.ref_id}`}
                              >
                                <span style={{ flexShrink: 0 }}>
                                  <PeriodTag period={c.gen_params.period} />
                                </span>
                                <Box
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                  }}
                                >
                                  <EntityNameComponent name={c.name} />
                                </Box>
                              </DenseSingleLineLink>
                            </DenseLinksItem>
                          ))}
                        </DenseLinksContainer>
                      </>
                    )}

                    {years.length > 0 &&
                      years.map((year) => (
                        <Box
                          key={`project-${project.ref_id}-goal-${goal.ref_id}-year-${year}`}
                        >
                          <StandardDivider
                            title={`🌍 Big Plans in ${String(year)}`}
                            size="small"
                          />
                          <DenseLinksContainer>
                            {(bigPlansByYear.get(year) ?? []).map((bp) => (
                              <DenseLinksItem key={`big-plan-${bp.ref_id}`}>
                                <DenseSingleLineLink
                                  to={`/app/workspace/big-plans/${bp.ref_id}`}
                                >
                                  <BigPlanStatusTag
                                    status={bp.status}
                                    format="icon"
                                  />
                                  <EntityNameComponent name={bp.name} />
                                </DenseSingleLineLink>
                              </DenseLinksItem>
                            ))}
                          </DenseLinksContainer>
                        </Box>
                      ))}
                  </Box>
                );
              })}

              {/* Always show a last "No Goal" entry */}
              {!loaderData.query.hideNoGoal &&
                (() => {
                  const noGoalHabits = allHabits.filter(
                    (h: Habit) =>
                      h.project_ref_id === project.ref_id &&
                      (h.goal_ref_id ?? null) === null,
                  );
                  const noGoalChores = allChores.filter(
                    (c: Chore) =>
                      c.project_ref_id === project.ref_id &&
                      (c.goal_ref_id ?? null) === null,
                  );
                  const noGoalBigPlans = allBigPlans.filter(
                    (bp) =>
                      bp.project_ref_id === project.ref_id &&
                      (bp.goal_ref_id ?? null) === null,
                  );

                  const bigPlansByYear = new Map<number, BigPlan[]>();
                  for (const bp of noGoalBigPlans) {
                    const year = computeStartedYear(bp);
                    bigPlansByYear.set(
                      year,
                      (bigPlansByYear.get(year) ?? []).concat(bp),
                    );
                  }
                  const years = [...bigPlansByYear.keys()].sort(
                    (a, b) => b - a,
                  );

                  return (
                    <Box key={`project-${project.ref_id}-goal-none`}>
                      <StandardDivider title="🚫 No Goal" size="medium" />

                      {noGoalHabits.length > 0 && (
                        <>
                          <StandardDivider title="💪 Habits" size="small" />
                          <DenseLinksContainer>
                            {noGoalHabits.map((h) => (
                              <DenseLinksItem key={`habit-${h.ref_id}`}>
                                <DenseSingleLineLink
                                  to={`/app/workspace/habits/${h.ref_id}`}
                                >
                                  <span style={{ flexShrink: 0 }}>
                                    <PeriodTag period={h.gen_params.period} />
                                  </span>
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      minWidth: 0,
                                    }}
                                  >
                                    <EntityNameComponent name={h.name} />
                                  </Box>
                                </DenseSingleLineLink>
                              </DenseLinksItem>
                            ))}
                          </DenseLinksContainer>
                        </>
                      )}

                      {noGoalChores.length > 0 && (
                        <>
                          <StandardDivider title="♻️ Chores" size="small" />
                          <DenseLinksContainer>
                            {noGoalChores.map((c) => (
                              <DenseLinksItem key={`chore-${c.ref_id}`}>
                                <DenseSingleLineLink
                                  to={`/app/workspace/chores/${c.ref_id}`}
                                >
                                  <span style={{ flexShrink: 0 }}>
                                    <PeriodTag period={c.gen_params.period} />
                                  </span>
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      minWidth: 0,
                                    }}
                                  >
                                    <EntityNameComponent name={c.name} />
                                  </Box>
                                </DenseSingleLineLink>
                              </DenseLinksItem>
                            ))}
                          </DenseLinksContainer>
                        </>
                      )}

                      {years.length > 0 &&
                        years.map((year) => (
                          <Box
                            key={`project-${project.ref_id}-goal-none-year-${year}`}
                          >
                            <StandardDivider
                              title={`🌍 Big Plans in ${String(year)}`}
                              size="small"
                            />
                            <DenseLinksContainer>
                              {(bigPlansByYear.get(year) ?? []).map((bp) => (
                                <DenseLinksItem key={`big-plan-${bp.ref_id}`}>
                                  <DenseSingleLineLink
                                    to={`/app/workspace/big-plans/${bp.ref_id}`}
                                  >
                                    <BigPlanStatusTag
                                      status={bp.status}
                                      format="icon"
                                    />
                                    <EntityNameComponent name={bp.name} />
                                  </DenseSingleLineLink>
                                </DenseLinksItem>
                              ))}
                            </DenseLinksContainer>
                          </Box>
                        ))}
                    </Box>
                  );
                })()}
            </Box>
          );
        })}
      </SectionCard>
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    notFound: () => `Could not find the history of work!`,
    error: () =>
      `There was an error loading the history of work! Please try again!`,
  },
);

function computeStartedYear(bp: BigPlan): number {
  const ts = bp.working_time ?? bp.actionable_date ?? bp.created_time;
  const dt = DateTime.fromISO(String(ts));
  if (!dt.isValid) {
    throw new Error(`Invalid date: ${ts}`);
  }
  return dt.year;
}

function fullGoalName(
  goal: GoalSummary,
  goalsByRefId: Map<string, GoalSummary>,
) {
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

function DenseLinksContainer(props: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: 1,
        rowGap: 0.5,
        paddingBottom: "1rem",
      }}
    >
      {props.children}
    </Box>
  );
}

function DenseLinksItem(props: PropsWithChildren) {
  const isBigScreen = useBigScreen();

  return (
    <Box
      sx={{
        flexBasis: isBigScreen ? "18%" : "100%",
        flexGrow: 0,
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      {props.children}
    </Box>
  );
}

const DenseSingleLineLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  textDecoration: "none",
  color: theme.palette.info.dark,
  ":visited": {
    color: theme.palette.info.dark,
  },
  overflow: "hidden",
  whiteSpace: "nowrap",
  minWidth: 0,
}));
