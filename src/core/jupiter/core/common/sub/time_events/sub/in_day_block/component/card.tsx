import type { ScheduleInDayEventEntry, Timezone } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";

import {
  type CombinedTimeEventInDayEntry,
  timeEventInDayBlockOwnerTheType,
} from "#/core/common/sub/time_events/time-event";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";

interface TimeEventInDayBlockCardProps {
  entry: CombinedTimeEventInDayEntry;
  userTimezone: Timezone;
}

export function TimeEventInDayBlockCard(props: TimeEventInDayBlockCardProps) {
  const isBigScreen = useBigScreen();

  let name = null;
  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const entry = props.entry.entry as ScheduleInDayEventEntry;
      name = entry.event.name;
      break;
    }

    case NamedEntityTag.BIG_PLAN: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    case NamedEntityTag.TODO_TASK: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    case NamedEntityTag.HABIT: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    case NamedEntityTag.CHORE: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    case NamedEntityTag.TIME_PLAN_ACTIVITY: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    default:
      throw new Error("Unknown time event in day owner type");
  }

  return (
    <EntityCard
      entityId={`time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`}
      showAsArchived={props.entry.time_event_in_tz.archived}
    >
      <EntityLink
        to={`/app/workspace/calendar/time-event/in-day-block/${
          props.entry.time_event_in_tz.ref_id
        }?date=${props.entry.time_event_in_tz.start_date}&period=${
          isBigScreen ? "weekly" : "daily"
        }`}
      >
        <EntityNameComponent name={name} />
      </EntityLink>
    </EntityCard>
  );
}
