import type { InboxTaskLoadResult } from "@jupiter/webapi-client";
import { InboxTaskSource } from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@remix-run/react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface InboxTaskSourceLinkProps {
  inboxTaskResult: InboxTaskLoadResult;
}

export function InboxTaskSourceLink(props: InboxTaskSourceLinkProps) {
  const isBigScreen = useBigScreen();

  switch (props.inboxTaskResult.inbox_task.source) {
    case InboxTaskSource.WORKING_MEM_CLEANUP: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/working-mem`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Working Mem" : "WM"}
        </Button>
      );
    }

    case InboxTaskSource.TIME_PLAN: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/time-plans/${props.inboxTaskResult.time_plan?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Time Plan" : "TP"}
        </Button>
      );
    }

    case InboxTaskSource.HABIT: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/habits/${props.inboxTaskResult.habit?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Habit" : "H"}
        </Button>
      );
    }

    case InboxTaskSource.CHORE: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/chores/${props.inboxTaskResult.chore?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Chore" : "C"}
        </Button>
      );
    }

    case InboxTaskSource.BIG_PLAN: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/big-plans/${props.inboxTaskResult.big_plan?.ref_id}`}
          sx={{
            flexGrow: 1,
            width: "2rem",
            minWidth: "unset",
            paddingRight: "3px",
          }}
        ></Button>
      );
    }

    case InboxTaskSource.JOURNAL: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/journals/${props.inboxTaskResult.journal?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Journal" : "J"}
        </Button>
      );
    }

    case InboxTaskSource.METRIC: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/metrics/${props.inboxTaskResult.metric?.ref_id}/details`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Metric" : "M"}
        </Button>
      );
    }

    case InboxTaskSource.PERSON_CATCH_UP: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/prm/persons/${props.inboxTaskResult.person?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Person" : "P"}
        </Button>
      );
    }

    case InboxTaskSource.PERSON_OCCASION: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/prm/persons/${props.inboxTaskResult.person?.ref_id}/occasions/${props.inboxTaskResult.occasion?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Occasion" : "O"}
        </Button>
      );
    }

    case InboxTaskSource.SLACK_TASK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/push-integration/slack-tasks/${props.inboxTaskResult.slack_task?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Slack Task" : "ST"}
        </Button>
      );
    }

    case InboxTaskSource.EMAIL_TASK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/push-integration/email-tasks/${props.inboxTaskResult.email_task?.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Email Task" : "ET"}
        </Button>
      );
    }

    case InboxTaskSource.USER: {
      if (!props.inboxTaskResult.todo_task) {
        return null;
      }
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/todos/${props.inboxTaskResult.todo_task.ref_id}`}
          sx={{ flexGrow: 1 }}
        >
          {isBigScreen ? "Todo Task" : "TT"}
        </Button>
      );
    }

    case InboxTaskSource.LIFE_PLAN_EVAL: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/life-plan}`}
        >
          {isBigScreen ? "Life Plan Eval" : "LPE"}
        </Button>
      );
    }

    default: {
      return null;
    }
  }
}
