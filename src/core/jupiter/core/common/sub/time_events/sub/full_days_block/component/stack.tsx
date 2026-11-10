import type { CombinedTimeEventFullDaysEntry } from "#/core/common/sub/time_events/time-event";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { countSummary } from "#/core/infra/component/count-summary";
import { StrataSection } from "#/core/infra/component/strata-section";
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
    <StrataSection
      id="time-event-full-days-block-stack"
      title={props.title}
      items={props.entries.length}
      split={{ size: 1 }}
      summary={countSummary(props.entries.length, "event", "events")}
      actions={actions}
    >
      {props.entries.map((entry) => (
        <TimeEventFullDaysBlockCard
          key={`time-event-full-days-block-${entry.time_event.ref_id}`}
          entry={entry}
        />
      ))}
    </StrataSection>
  );
}
