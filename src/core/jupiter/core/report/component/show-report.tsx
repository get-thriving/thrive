import type {
  GoalSummary,
  InboxTasksSummary,
  AspectSummary,
  ReportPeriodResult,
  WorkableSummary,
} from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  UserFeature,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import { Fragment, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import { periodName } from "#/core/common/recurring-task-period";
import { inboxTaskNamespaceName } from "#/core/common/sub/inbox_tasks/namespace";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { isUserFeatureAvailable } from "#/core/users/root";
import {
  inferSourcesForEnabledFeatures,
  isWorkspaceFeatureAvailable,
} from "#/core/workspaces/root";
import { EntityNameOneLineComponent } from "#/core/common/component/entity-name";
import { ScoreOverview } from "#/core/gamification/component/score-overview";
import { EntityLink } from "#/core/infra/component/entity-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TabPanel } from "#/core/infra/component/tab-panel";
import {
  PROJECT,
  CHORE,
  EMAIL_TASK,
  HABIT,
  JOURNAL,
  LIFE_PLAN_EVAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  TODO_TASK,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";

const _SOURCES_TO_REPORT = [
  TODO_TASK,
  HABIT,
  CHORE,
  PROJECT,
  JOURNAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  EMAIL_TASK,
  LIFE_PLAN_EVAL,
];

interface ShowReportProps {
  topLevelInfo: TopLevelInfo;
  allAspects: AspectSummary[];
  allGoals: GoalSummary[];
  report: ReportPeriodResult;
}

export function ShowReport({
  topLevelInfo,
  allAspects,
  allGoals,
  report,
}: ShowReportProps) {
  const isBigScreen = useBigScreen();
  const [showTab, changeShowTab] = useState(0);

  const tabIndicesMap = {
    global: 0,
    "by-periods": 1,
    "by-aspects": 2,
    "by-goals": 3,
    "by-habits": 4,
    "by-chores": 5,
    "by-projects": 6,
  };

  if (
    !isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      WorkspaceFeature.LIFE_PLAN,
    )
  ) {
    tabIndicesMap["by-goals"] -= 1;
    tabIndicesMap["by-habits"] -= 1;
    tabIndicesMap["by-chores"] -= 1;
    tabIndicesMap["by-projects"] -= 1;
  }
  if (
    !isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      WorkspaceFeature.HABITS,
    )
  ) {
    tabIndicesMap["by-chores"] -= 1;
    tabIndicesMap["by-projects"] -= 1;
  }
  if (
    !isWorkspaceFeatureAvailable(
      topLevelInfo.workspace,
      WorkspaceFeature.CHORES,
    )
  ) {
    tabIndicesMap["by-projects"] -= 1;
  }

  const allAspectsSorted = sortAspectsByTreeOrder(allAspects);
  const allAspectsByRefId = new Map<string, AspectSummary>(
    allAspects.map((p) => [p.ref_id, p]),
  );
  const allGoalsSorted = sortGoalsNaturally(allGoals);
  const allGoalsByRefId = new Map<string, GoalSummary>(
    allGoals.map((g) => [g.ref_id, g]),
  );

  return (
    <Stack spacing={2} useFlexGap sx={{ paddingTop: "1rem" }}>
      <Box sx={{ width: "100%", display: "flex", fontSize: "0.2rem" }}>
        <Typography
          variant="h5"
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          🚀 {periodName(report.period)} as of{" "}
          {aDateToDate(report.today).toFormat("yyyy-MM-dd")}
        </Typography>
      </Box>

      {isUserFeatureAvailable(topLevelInfo.user, UserFeature.GAMIFICATION) &&
        report.user_score_overview && (
          <>
            <StandardDivider title="💪 Score" size="large" />
            <ScoreOverview scoreOverview={report.user_score_overview} />
          </>
        )}

      <Tabs
        value={showTab}
        onChange={(_, newValue) => changeShowTab(newValue)}
        variant={isBigScreen ? "standard" : "scrollable"}
        scrollButtons="auto"
        centered={isBigScreen}
      >
        <Tab label="🌍 Global" />
        <Tab label="⌛ By Periods" />
        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && <Tab label="💡 By Aspects" />}
        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && <Tab label="🎯 By Goals" />}
        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.HABITS,
        ) && <Tab label="💪 By Habits" />}
        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.CHORES,
        ) && <Tab label="♻️ By Chore" />}
        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.PROJECTS,
        ) && <Tab label="🌍 By Project" />}
      </Tabs>

      <TabPanel value={showTab} index={tabIndicesMap["global"]}>
        <OverviewReport
          topLevelInfo={topLevelInfo}
          inboxTasksSummary={report.global_inbox_tasks_summary}
          bigPlansSummary={report.global_projects_summary}
        />
      </TabPanel>

      <TabPanel value={showTab} index={tabIndicesMap["by-periods"]}>
        <Stack spacing={2} useFlexGap>
          {report.per_period_breakdown.map((pp) => (
            <Fragment key={pp.name}>
              <StandardDivider title={pp.name} size="large" />
              <OverviewReport
                topLevelInfo={topLevelInfo}
                inboxTasksSummary={pp.inbox_tasks_summary}
                bigPlansSummary={pp.projects_summary}
              />
            </Fragment>
          ))}
        </Stack>
      </TabPanel>

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <TabPanel value={showTab} index={tabIndicesMap["by-aspects"]}>
          <Stack spacing={2} useFlexGap>
            {allAspectsSorted.map((aspect) => {
              const pb = report.per_aspect_breakdown.find(
                (pb) => pb.ref_id === aspect.ref_id,
              );

              if (pb === undefined) {
                return null;
              }

              const fullAspectName = computeAspectHierarchicalNameFromRoot(
                aspect,
                allAspectsByRefId,
              );

              return (
                <Fragment key={pb.ref_id}>
                  <StandardDivider title={fullAspectName} size="large" />
                  <OverviewReport
                    topLevelInfo={topLevelInfo}
                    bigPlansSummary={pb.projects_summary}
                  />
                </Fragment>
              );
            })}
          </Stack>
        </TabPanel>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <TabPanel value={showTab} index={tabIndicesMap["by-goals"]}>
          <Stack spacing={2} useFlexGap>
            {allGoalsSorted.map((goal) => {
              const gb = report.per_goal_breakdown.find(
                (gb) => gb.ref_id === goal.ref_id,
              );

              if (gb === undefined) {
                return null;
              }

              const parentGoal = goal.parent_goal_ref_id
                ? allGoalsByRefId.get(goal.parent_goal_ref_id)
                : undefined;
              const goalLabel = parentGoal
                ? `${parentGoal.name} / ${goal.name}`
                : String(goal.name);

              return (
                <Fragment key={gb.ref_id}>
                  <StandardDivider title={goalLabel} size="large" />
                  <OverviewReport
                    topLevelInfo={topLevelInfo}
                    bigPlansSummary={gb.projects_summary}
                  />
                </Fragment>
              );
            })}
          </Stack>
        </TabPanel>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.HABITS,
      ) && (
        <TabPanel value={showTab} index={tabIndicesMap["by-habits"]}>
          <Stack spacing={2} useFlexGap>
            {Object.values(RecurringTaskPeriod).map((period) => {
              const periodHabits = report.per_habit_breakdown.filter(
                (phb) => phb.period === period,
              );

              if (periodHabits.length === 0) {
                return null;
              }

              return (
                <Fragment key={period}>
                  <StandardDivider title={periodName(period)} size="large" />
                  <TableContainer component={Box}>
                    <Table sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          <SmallTableCell width={isBigScreen ? "20%" : "50%"}>
                            Name
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            📥 {isBigScreen && "Created"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            🔧 {isBigScreen && "Not Started"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            🚧 {isBigScreen && "Working"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            ⛔ {isBigScreen && "Not Done"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            ✅ {isBigScreen && "Done"}
                          </SmallTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {periodHabits.map((phb) => (
                          <TableRow key={`${period}-${phb.ref_id}`}>
                            <SmallTableCell>
                              <EntityLink
                                to={`/app/workspace/habits/${phb.ref_id}`}
                              >
                                <EntityNameOneLineComponent name={phb.name} />
                              </EntityLink>
                            </SmallTableCell>
                            <SmallTableCell>
                              {phb.summary.created_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {phb.summary.not_started_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {phb.summary.working_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {phb.summary.not_done_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {phb.summary.done_cnt}
                            </SmallTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Fragment>
              );
            })}
          </Stack>
        </TabPanel>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.CHORES,
      ) && (
        <TabPanel value={showTab} index={tabIndicesMap["by-chores"]}>
          <Stack spacing={2} useFlexGap>
            {Object.values(RecurringTaskPeriod).map((period) => {
              const periodChores = report.per_chore_breakdown.filter(
                (pcb) => pcb.period === period,
              );

              if (periodChores.length === 0) {
                return null;
              }

              return (
                <Fragment key={period}>
                  <StandardDivider title={periodName(period)} size="large" />
                  <TableContainer component={Box}>
                    <Table sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          <SmallTableCell width="50%">Name</SmallTableCell>
                          <SmallTableCell width="10%">
                            📥 {isBigScreen && "Created"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            🔧 {isBigScreen && "Not Started"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            🚧 {isBigScreen && "Working"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            ⛔ {isBigScreen && "Not Done"}
                          </SmallTableCell>
                          <SmallTableCell width="10%">
                            ✅ {isBigScreen && "Done"}
                          </SmallTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {periodChores.map((pcb) => (
                          <TableRow key={`${period}-${pcb.ref_id}`}>
                            <SmallTableCell className="name-value">
                              <EntityLink
                                to={`/app/workspace/chores/${pcb.ref_id}`}
                              >
                                <EntityNameOneLineComponent name={pcb.name} />
                              </EntityLink>
                            </SmallTableCell>
                            <SmallTableCell>
                              {pcb.summary.created_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {pcb.summary.not_started_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {pcb.summary.working_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {pcb.summary.not_done_cnt}
                            </SmallTableCell>
                            <SmallTableCell>
                              {pcb.summary.done_cnt}
                            </SmallTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Fragment>
              );
            })}
          </Stack>
        </TabPanel>
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.PROJECTS,
      ) && (
        <TabPanel value={showTab} index={tabIndicesMap["by-projects"]}>
          <TableContainer component={Box}>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <SmallTableCell width="50%">Name</SmallTableCell>
                  <SmallTableCell width="10%">
                    📥 {isBigScreen && "Created"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    🔧 {isBigScreen && "Not Started"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    🚧 {isBigScreen && "Working"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    ⛔ {isBigScreen && "Not Done"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    ✅ {isBigScreen && "Done"}
                  </SmallTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {report.per_project_breakdown.map((pbb) => (
                  <TableRow key={pbb.ref_id}>
                    <SmallTableCell className="name-value">
                      <EntityLink to={`/app/workspace/projects/${pbb.ref_id}`}>
                        <EntityNameOneLineComponent name={pbb.name} />
                      </EntityLink>
                    </SmallTableCell>
                    <SmallTableCell>{pbb.summary.created_cnt}</SmallTableCell>
                    <SmallTableCell>
                      {pbb.summary.not_started_cnt}
                    </SmallTableCell>
                    <SmallTableCell>{pbb.summary.working_cnt}</SmallTableCell>
                    <SmallTableCell>{pbb.summary.not_done_cnt}</SmallTableCell>
                    <SmallTableCell>{pbb.summary.done_cnt}</SmallTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      )}
    </Stack>
  );
}

interface OverviewReportProps {
  topLevelInfo: TopLevelInfo;
  inboxTasksSummary?: InboxTasksSummary;
  bigPlansSummary: WorkableSummary;
}

function OverviewReport(props: OverviewReportProps) {
  const isBigScreen = useBigScreen();
  const filteredSource = inferSourcesForEnabledFeatures(
    props.topLevelInfo.workspace,
    _SOURCES_TO_REPORT,
  );

  return (
    <Stack spacing={2} useFlexGap>
      {props.inboxTasksSummary && (
        <>
          <StandardDivider title="📥 Inbox Tasks" size="large" />
          <TableContainer>
            <Table sx={{ tableLayout: "fixed", width: "97%" }}>
              <TableHead>
                <TableRow>
                  <SmallTableCell width="50%">Name</SmallTableCell>
                  <SmallTableCell width="10%">
                    📥 {isBigScreen && "Created"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    🔧 {isBigScreen && "Not Started"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    🚧 {isBigScreen && "Working"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    ⛔ {isBigScreen && "Not Done"}
                  </SmallTableCell>
                  <SmallTableCell width="10%">
                    ✅ {isBigScreen && "Done"}
                  </SmallTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <SmallTableCell>Total</SmallTableCell>
                  <SmallTableCell>
                    {props.inboxTasksSummary.created.total_cnt}
                  </SmallTableCell>
                  <SmallTableCell>
                    {props.inboxTasksSummary.not_started.total_cnt}
                  </SmallTableCell>
                  <SmallTableCell>
                    {props.inboxTasksSummary.working.total_cnt}
                  </SmallTableCell>
                  <SmallTableCell>
                    {props.inboxTasksSummary.not_done.total_cnt}
                  </SmallTableCell>
                  <SmallTableCell>
                    {props.inboxTasksSummary.done.total_cnt}
                  </SmallTableCell>
                </TableRow>
                {filteredSource.map((source) => (
                  <TableRow key={source}>
                    <SmallTableCell>
                      {inboxTaskNamespaceName(source)}
                    </SmallTableCell>
                    <SmallTableCell>
                      {props.inboxTasksSummary!.created.per_source_cnt.find(
                        (s) => s.source === source,
                      )?.count || 0}
                    </SmallTableCell>
                    <SmallTableCell>
                      {props.inboxTasksSummary!.not_started.per_source_cnt.find(
                        (s) => s.source === source,
                      )?.count || 0}
                    </SmallTableCell>
                    <SmallTableCell>
                      {props.inboxTasksSummary!.working.per_source_cnt.find(
                        (s) => s.source === source,
                      )?.count || 0}
                    </SmallTableCell>
                    <SmallTableCell>
                      {props.inboxTasksSummary!.not_done.per_source_cnt.find(
                        (s) => s.source === source,
                      )?.count || 0}
                    </SmallTableCell>
                    <SmallTableCell>
                      {props.inboxTasksSummary!.done.per_source_cnt.find(
                        (s) => s.source === source,
                      )?.count || 0}
                    </SmallTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {isWorkspaceFeatureAvailable(
        props.topLevelInfo.workspace,
        WorkspaceFeature.PROJECTS,
      ) && (
        <>
          <StandardDivider title="🌍 Projects" size="large" />

          <Typography variant="h6">Summary</Typography>

          <List>
            <ListItem>
              <ListItemText
                primary={`📥 Created: ${props.bigPlansSummary.created_cnt}`}
              />{" "}
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`🔧 Not Started: ${props.bigPlansSummary.not_started_cnt}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`🚧 Working: ${props.bigPlansSummary.working_cnt}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`⛔ Not Done: ${props.bigPlansSummary.not_done_cnt}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`✅ Done: ${props.bigPlansSummary.done_cnt}`}
              />
            </ListItem>
          </List>

          {props.bigPlansSummary.not_done_projects.length > 0 && (
            <>
              <Typography variant="h6">⛔ Not Done Details</Typography>

              <List>
                {props.bigPlansSummary.not_done_projects.map((bp) => (
                  <ListItem key={bp.ref_id}>
                    <EntityLink to={`/app/workspace/projects/${bp.ref_id}`}>
                      <EntityNameOneLineComponent name={bp.name} />
                    </EntityLink>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {props.bigPlansSummary.done_projects.length > 0 && (
            <>
              <Typography variant="h6">✅ Done Details</Typography>

              <List>
                {props.bigPlansSummary.done_projects.map((bp) => (
                  <ListItem key={bp.ref_id}>
                    <EntityLink to={`/app/workspace/projects/${bp.ref_id}`}>
                      <EntityNameOneLineComponent name={bp.name} />
                    </EntityLink>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </>
      )}
    </Stack>
  );
}

const SmallTableCell = styled(TableCell)`
  font-size: 0.75rem;
`;
