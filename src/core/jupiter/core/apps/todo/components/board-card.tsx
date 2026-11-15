import type { InboxTask, TodoTask, UserLight } from "@jupiter/webapi-client";
import { Difficulty, Eisen, InboxTaskStatus } from "@jupiter/webapi-client";
import { Box, Tooltip, Typography } from "@mui/material";
import type { Theme } from "@mui/material";
import { Link } from "react-router";

import { aDateToDate } from "#/core/common/adate";
import { difficultyName } from "#/core/common/difficulty";
import { eisenName } from "#/core/common/eisen";
import { isCompleted } from "#/core/common/sub/inbox_tasks/status";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { useSectionFiltersPreservedTo } from "#/core/infra/component/use-section-filter";

export interface TodoBoardCardProps {
  topLevelInfo: TopLevelInfo;
  inboxTask: InboxTask;
  todoTask: TodoTask;
  /** Who owns the todo, when it is somebody else. */
  owner?: UserLight;
  /** What the board shows for the status, which leads the saved one while a move is in flight. */
  status: InboxTaskStatus;
}

function eisenColor(theme: Theme, eisen: Eisen): string {
  switch (eisen) {
    case Eisen.IMPORTANT_AND_URGENT:
      return theme.palette.error.main;
    case Eisen.URGENT:
      return theme.palette.warning.main;
    case Eisen.IMPORTANT:
      return theme.palette.success.main;
    case Eisen.REGULAR:
      return theme.palette.divider;
  }
}

function difficultyLetter(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.EASY:
      return "E";
    case Difficulty.MEDIUM:
      return "M";
    case Difficulty.HARD:
      return "H";
  }
}

/**
 * A todo as one dense card: a stripe for the Eisenhower quadrant, the name, and
 * at most one line of small facts. It carries no buttons: the way to change a
 * todo's state on the board is to move the card.
 */
export function TodoBoardCard(props: TodoBoardCardProps) {
  const { inboxTask, todoTask, status } = props;
  const to = useSectionFiltersPreservedTo(
    `/app/workspace/apps/todos/${todoTask.ref_id}`,
  );

  const finished = isCompleted(status);
  const notDone = status === InboxTaskStatus.NOT_DONE;
  const blocked = status === InboxTaskStatus.BLOCKED;

  const today = aDateToDate(props.topLevelInfo.today);
  const dueDate = inboxTask.due_date ? aDateToDate(inboxTask.due_date) : null;
  const overdue = dueDate !== null && !finished && dueDate < today;
  const dueToday =
    dueDate !== null && !finished && dueDate.hasSame(today, "day");

  const facts: Array<{ key: string; node: React.ReactNode }> = [];

  if (blocked) {
    facts.push({
      key: "blocked",
      node: (
        <Box component="span" sx={{ color: "warning.main", fontWeight: 600 }}>
          🚧 Blocked
        </Box>
      ),
    });
  }
  if (notDone) {
    facts.push({
      key: "not-done",
      node: (
        <Box component="span" sx={{ color: "error.main", fontWeight: 600 }}>
          ⛔ Not done
        </Box>
      ),
    });
  }
  if (dueDate !== null) {
    facts.push({
      key: "due",
      node: (
        <Tooltip title={`Due at ${dueDate.toFormat("LLL d, yyyy")}`}>
          <Box
            component="span"
            sx={{
              color: overdue
                ? "error.main"
                : dueToday
                  ? "warning.main"
                  : "inherit",
              fontWeight: overdue || dueToday ? 600 : "inherit",
            }}
          >
            📅 {dueDate.toFormat("LLL d")}
          </Box>
        </Tooltip>
      ),
    });
  }
  facts.push({
    key: "difficulty",
    node: (
      <Tooltip title={`${difficultyName(inboxTask.difficulty)} difficulty`}>
        <Box
          component="span"
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "3px",
            px: "0.25rem",
            fontSize: "0.6rem",
            lineHeight: "0.9rem",
          }}
        >
          {difficultyLetter(inboxTask.difficulty)}
        </Box>
      </Tooltip>
    ),
  });
  if (props.owner) {
    facts.push({
      key: "owner",
      node: <span>@{props.owner.name}</span>,
    });
  }
  if (inboxTask.archived) {
    facts.push({
      key: "archived",
      node: (
        <Tooltip title="Archived">
          <span>🗄️</span>
        </Tooltip>
      ),
    });
  }

  return (
    <Box
      component={Link}
      to={to}
      id={`todo-board-card-${inboxTask.ref_id}`}
      sx={(theme) => ({
        display: "block",
        textDecoration: "none",
        color: "inherit",
        backgroundColor: theme.palette.background.paper,
        border: 1,
        borderColor: "divider",
        borderLeft: `3px solid ${eisenColor(theme, inboxTask.eisen)}`,
        borderRadius: "4px",
        padding: "0.25rem 0.5rem",
        opacity: inboxTask.archived ? 0.65 : 1,
        "&:hover": { borderColor: theme.palette.primary.main },
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          columnGap: "0.5rem",
        }}
      >
        <Tooltip title={eisenName(inboxTask.eisen)} placement="left" arrow>
          <Typography
            component="div"
            sx={{
              // Takes what the facts leave. A name too long for that pushes
              // the facts onto a line of their own.
              flex: "1 1 9rem",
              minWidth: 0,
              fontSize: "0.8rem",
              lineHeight: 1.25,
              color: finished ? "text.secondary" : "text.primary",
              textDecoration: notDone ? "line-through" : "none",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {inboxTask.is_key && <span title="Key task">⭐ </span>}
            {todoTask.name}
          </Typography>
        </Tooltip>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "0.5rem",
            marginLeft: "auto",
            fontSize: "0.68rem",
            lineHeight: "1rem",
            color: "text.secondary",
            whiteSpace: "nowrap",
          }}
        >
          {facts.map((fact) => (
            <Box component="span" key={fact.key}>
              {fact.node}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
