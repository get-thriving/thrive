import type {
  Person,
  TimeEventFullDaysBlock,
  TimeEventInDayBlock,
} from "@jupiter/webapi-client";
import { TimeEventNamespace } from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@remix-run/react";

interface TimeEventSourceLinkProps {
  timeEvent: TimeEventFullDaysBlock | TimeEventInDayBlock;
  extraInfo?: {
    person?: Person;
  };
}

export function TimeEventSourceLink(props: TimeEventSourceLinkProps) {
  switch (props.timeEvent.namespace) {
    case TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/calendar/schedule/event-full-days/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.SCHEDULE_EVENT_IN_DAY: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/calendar/schedule/event-in-day/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.PERSON_OCCASION: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/prm/persons/${props.extraInfo?.person?.ref_id}/occasions/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.INBOX_TASK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/inbox-tasks/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.BIG_PLAN: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/big-plans/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.TODO_TASK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/todos/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.HABIT: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/habits/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.CHORE: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/chores/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    case TimeEventNamespace.VACATION: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/vacations/${props.timeEvent.source_entity_ref_id}`}
        >
          Link
        </Button>
      );
    }

    default: {
      throw new Error("Unknown namespace");
    }
  }
}
