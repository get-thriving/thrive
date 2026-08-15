import {
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
} from "@jupiter/webapi-client";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

import { timePlanActivityDonenessName } from "#/core/apps/time_plans/sub/activity/doneness";
import { timePlanActivityFeasabilityName } from "#/core/apps/time_plans/sub/activity/feasability";
import { BigPlanProgressSummary } from "#/core/apps/time_plans/big-plan-progress-summary";

interface BigPlanProgressViewProps {
  summary: BigPlanProgressSummary;
}

export function BigPlanProgressView(props: BigPlanProgressViewProps) {
  const summary = props.summary;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead
          sx={{
            borderBottomWidth: "0.25rem",
            borderBottomStyle: "solid",
            borderBottomColor: "divider",
          }}
        >
          <TableRow>
            <ValueAndPctCell value="Category" rowSpan={2} align="left" />
            <ValueAndPctCell value="Planned" align="left" />
            <ValueAndPctCell value="Achieved" colSpan={3} align="left" />
            <ValueAndPctCell value="Task Progress" rowSpan={2} align="left" />
          </TableRow>
          <TableRow>
            <ValueAndPctCell value="Big Plans" align="left" />
            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.DONE,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.WORKING,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.NOT_DONE,
              )}
              align="left"
            />
          </TableRow>
        </TableHead>

        <TableBody>
          <SummaryRow
            label="Total"
            planned={summary.planned.totalPlans}
            done={
              summary.achieved.totalPlansByDoneness[
                TimePlanActivityDoneness.DONE
              ]
            }
            working={
              summary.achieved.totalPlansByDoneness[
                TimePlanActivityDoneness.WORKING
              ]
            }
            notDone={
              summary.achieved.totalPlansByDoneness[
                TimePlanActivityDoneness.NOT_DONE
              ]
            }
            completedTasks={summary.achieved.completedInboxTasks}
            allTasks={summary.planned.totalInboxTasks}
          />
          <FeasabilityRow
            feasability={TimePlanActivityFeasability.MUST_DO}
            summary={summary}
          />
          <FeasabilityRow
            feasability={TimePlanActivityFeasability.NICE_TO_HAVE}
            summary={summary}
          />
          <FeasabilityRow
            feasability={TimePlanActivityFeasability.STRETCH}
            summary={summary}
          />
          <TableRow>
            <ValueAndPctCell value="Done outside time plan" align="left" />
            <ValueAndPctCell value="-" />
            <ValueAndPctCell value={summary.achieved.completedNontargetPlans} />
            <ValueAndPctCell value="-" />
            <ValueAndPctCell value="-" />
            <TaskProgressCell
              completed={summary.achieved.completedNontargetInboxTasks}
              total={summary.achieved.completedNontargetAllInboxTasks}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FeasabilityRow({
  feasability,
  summary,
}: {
  feasability: TimePlanActivityFeasability;
  summary: BigPlanProgressSummary;
}) {
  return (
    <SummaryRow
      label={timePlanActivityFeasabilityName(feasability)}
      planned={summary.planned.plansByFeasability[feasability]}
      done={
        summary.achieved.plansByFeasabilityByDoneness[
          TimePlanActivityDoneness.DONE
        ][feasability]
      }
      working={
        summary.achieved.plansByFeasabilityByDoneness[
          TimePlanActivityDoneness.WORKING
        ][feasability]
      }
      notDone={
        summary.achieved.plansByFeasabilityByDoneness[
          TimePlanActivityDoneness.NOT_DONE
        ][feasability]
      }
      completedTasks={
        summary.achieved.completedInboxTasksByFeasability[feasability]
      }
      allTasks={summary.planned.inboxTasksByFeasability[feasability]}
    />
  );
}

function SummaryRow({
  label,
  planned,
  done,
  working,
  notDone,
  completedTasks,
  allTasks,
}: {
  label: string;
  planned: number;
  done: number;
  working: number;
  notDone: number;
  completedTasks: number;
  allTasks: number;
}) {
  return (
    <TableRow>
      <ValueAndPctCell value={label} align="left" />
      <ValueAndPctCell value={planned} />
      <ValueAndPctCell value={done} total={planned} />
      <ValueAndPctCell value={working} total={planned} />
      <ValueAndPctCell value={notDone} total={planned} />
      <TaskProgressCell completed={completedTasks} total={allTasks} />
    </TableRow>
  );
}

function TaskProgressCell({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  if (total <= 0) {
    return <ValueAndPctCell value="-" />;
  }

  const percentage = ((completed / total) * 100).toFixed(0) + "%";
  return <ValueAndPctCell value={`${completed}/${total} [${percentage}]`} />;
}

interface ValueAndPctCellProps {
  value: number | string;
  total?: number;
  align?: "center" | "left" | "right";
  rowSpan?: number;
  colSpan?: number;
}

function ValueAndPctCell({
  value,
  total,
  align = "center",
  rowSpan,
  colSpan,
}: ValueAndPctCellProps) {
  const theme = useTheme();
  const percentage =
    typeof value === "number" && total !== undefined && total > 0
      ? ((value / total) * 100).toFixed(0) + "%"
      : undefined;

  return (
    <TableCell
      sx={{
        borderWidth: "1px",
        borderColor: theme.palette.grey[200],
        borderStyle: "solid",
        textAlign: "left",
      }}
      align={align}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {value}
      {percentage !== undefined && <> [{percentage}]</>}
    </TableCell>
  );
}
