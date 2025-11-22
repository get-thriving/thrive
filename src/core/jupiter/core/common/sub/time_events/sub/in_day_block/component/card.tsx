import type { ScheduleInDayEventEntry, Timezone } from "@jupiter/webapi-client";
import { TimeEventNamespace } from "@jupiter/webapi-client";

import { type CombinedTimeEventInDayEntry } from "#/core/common/sub/time_events/time-event";
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
  switch (props.entry.time_event_in_tz.namespace) {
    case TimeEventNamespace.SCHEDULE_EVENT_IN_DAY: {
      const entry = props.entry.entry as ScheduleInDayEventEntry;
      name = entry.event.name;
      break;
    }

    case TimeEventNamespace.INBOX_TASK: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }

    default:
      throw new Error("Unknown namespace");
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
