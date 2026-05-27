import type {
  Person,
  TimeEventFullDaysBlock,
  TimeEventInDayBlock,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { Launch as LaunchIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@remix-run/react";

import { parseEntityLinkStd } from "#/core/common/entity-link";

interface TimeEventSourceLinkProps {
  timeEvent: TimeEventFullDaysBlock | TimeEventInDayBlock;
  extraInfo?: {
    person?: Person;
  };
}

export function TimeEventSourceLink(props: TimeEventSourceLinkProps) {
  const { theType, refId } = parseEntityLinkStd(props.timeEvent.owner);
  switch (theType) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/calendar/schedule/event-in-day/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.BIG_PLAN: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/big-plans/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.TODO_TASK: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/todos/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.HABIT: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/habits/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.CHORE: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/chores/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.TIME_PLAN_ACTIVITY: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/time-plans/no-parent/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/calendar/schedule/event-full-days/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.OCCASION: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/prm/persons/${props.extraInfo?.person?.ref_id}/occasions/${refId}`}
        >
          Link
        </Button>
      );
    }

    case NamedEntityTag.VACATION: {
      return (
        <Button
          startIcon={<LaunchIcon />}
          variant="outlined"
          size="small"
          component={Link}
          to={`/app/workspace/vacations/${refId}`}
        >
          Link
        </Button>
      );
    }

    default: {
      throw new Error(`Unknown time event owner type: ${theType}`);
    }
  }
}
