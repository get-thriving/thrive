import type { CombinedTimeEventFullDaysEntry } from "#/core/common/sub/time_events/time-event";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { SectionCard } from "#/core/infra/component/section-card";
import { TimeEventFullDaysBlockCard } from "#/core/common/sub/time_events/sub/full_days_block/component/card";

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
