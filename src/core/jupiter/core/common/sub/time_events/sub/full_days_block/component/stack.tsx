import type { CombinedTimeEventFullDaysEntry } from "~/common/sub/time_events/time-event";

import type { TopLevelInfo } from "~/infra/top-level-context";
import { SectionCard } from "~/infra/component/section-card";
import { TimeEventFullDaysBlockCard } from "~/common/sub/time_events/sub/full_days_block/component/card";

interface TimeEventFullDaysBlockStackProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  title: string;
  entries: CombinedTimeEventFullDaysEntry[];
}

export function TimeEventFullDaysBlockStack(
  props: TimeEventFullDaysBlockStackProps,
) {
  const actions = undefined;

  return (
    <SectionCard
      id="time-event-full-days-block-stack"
      title={props.title}
      actions={actions}
    >
      {props.entries.map((entry) => (
        <TimeEventFullDaysBlockCard
          key={`time-event-full-days-block-${entry.time_event.ref_id}`}
          entry={entry}
        />
      ))}
    </SectionCard>
  );
}
