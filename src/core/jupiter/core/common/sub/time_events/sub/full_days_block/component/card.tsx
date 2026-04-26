import type {
  PersonOccasionEntry,
  ScheduleFullDaysEventEntry,
  VacationEntry,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";

import { parseEntityLinkStd } from "#/core/common/entity-link";
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
  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      const entry = props.entry.entry as ScheduleFullDaysEventEntry;
      name = entry.event.name;
      break;
    }

    case NamedEntityTag.OCCASION: {
      const entry = props.entry.entry as PersonOccasionEntry;
      name = occasionTimeEventName(
        entry.occasion_time_event,
        entry.contact,
        entry.occasion,
      );
      break;
    }

    case NamedEntityTag.VACATION: {
      const entry = props.entry.entry as VacationEntry;
      name = entry.vacation.name;
      break;
    }

    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
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
