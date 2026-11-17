import type { CombinedTimeEventInDayEntry } from "#/core/common/sub/time_events/time-event";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { countSummary } from "#/core/infra/component/count-summary";
import { StrataSection } from "#/core/infra/component/strata-section";
import { TimeEventInDayBlockCard } from "#/core/common/sub/time_events/sub/in_day_block/component/card";

interface TimeEventInDayBlockStackProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  title: string;
  createLocation?: string;
  entries: CombinedTimeEventInDayEntry[];
}

export function TimeEventInDayBlockStack(props: TimeEventInDayBlockStackProps) {
  let actions = undefined;
  if (props.createLocation) {
    actions = (
      <SectionActions
        id="time-event-in-day-block-stack"
        topLevelInfo={props.topLevelInfo}
        inputsEnabled={props.inputsEnabled}
        actions={[
          NavSingle({
            text: "Add",
            link: props.createLocation,
            highlight: true,
          }),
        ]}
      />
    );
  }

  return (
    <StrataSection
      id="time-event-in-day-block-stack"
      title={props.title}
      items={props.entries.length}
      split={{ size: 1 }}
      summary={countSummary(props.entries.length, "event", "events")}
      actions={actions}
    >
      {props.entries.map((entry) => (
        <TimeEventInDayBlockCard
          key={`time-event-in-days-block-${entry.time_event_in_tz.ref_id}`}
          entry={entry}
          userTimezone={props.topLevelInfo.user.timezone}
        />
      ))}
    </StrataSection>
  );
}
