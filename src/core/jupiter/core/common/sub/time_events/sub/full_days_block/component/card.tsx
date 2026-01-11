import type {
  PersonOccasionEntry,
  ScheduleFullDaysEventEntry,
  VacationEntry,
} from "@jupiter/webapi-client";
import { TimeEventNamespace } from "@jupiter/webapi-client";

import type { CombinedTimeEventFullDaysEntry } from "#/core/common/sub/time_events/time-event";
import { occasionTimeEventName } from "#/core/common/sub/time_events/time-event";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";

interface TimeEventFullDaysBlockCardProps {
  entry: CombinedTimeEventFullDaysEntry;
}

export function TimeEventFullDaysBlockCard(
  props: TimeEventFullDaysBlockCardProps,
) {
  let name = null;
  switch (props.entry.time_event.namespace) {
    case TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK: {
      const entry = props.entry.entry as ScheduleFullDaysEventEntry;
      name = entry.event.name;
      break;
    }

    case TimeEventNamespace.PERSON_OCCASION: {
      const entry = props.entry.entry as PersonOccasionEntry;
      name = occasionTimeEventName(
        entry.occasion_time_event,
        entry.person,
        entry.occasion,
      );
      break;
    }

    case TimeEventNamespace.VACATION: {
      const entry = props.entry.entry as VacationEntry;
      name = entry.vacation.name;
      break;
    }

    default:
      throw new Error("Unknown namespace");
  }

  return (
    <EntityCard
      entityId={`time-event-full-days-block-${props.entry.time_event.ref_id}`}
      showAsArchived={props.entry.time_event.archived}
    >
      <EntityLink
        to={`/app/workspace/calendar/time-event/full-days-block/${props.entry.time_event.ref_id}`}
      >
        <EntityNameComponent name={name} />
      </EntityLink>
    </EntityCard>
  );
}
