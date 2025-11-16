import type { TimePlan } from "@jupiter/webapi-client";

import type { TopLevelInfo } from "~/infra/top-level-context";
import { EntityNameComponent } from "~/common/component/entity-name";
import { EntityCard, EntityLink } from "~/infra/component/entity-card";
import { PeriodTag } from "~/common/component/period-tag";
import { TimePlanSourceTag } from "~/time_plans/component/source-tag";

export interface TimePlanShowOptions {
  showSource?: boolean;
  showPeriod?: boolean;
}

interface TimePlanCardProps {
  label?: string;
  topLevelInfo: TopLevelInfo;
  timePlan: TimePlan;
  relativeToTimePlan?: TimePlan;
  showOptions: TimePlanShowOptions;
  selected?: boolean;
  allowSwipe?: boolean;
  allowSelect?: boolean;
  allowMarkNotDone?: boolean;
  onClick?: (timePlan: TimePlan) => void;
  onMarkNotDone?: (timePlan: TimePlan) => void;
}

export function TimePlanCard(props: TimePlanCardProps) {
  const timePlan = props.timePlan;
  const link =
    props.relativeToTimePlan !== undefined
      ? `/app/workspace/time-plans/${props.relativeToTimePlan.ref_id}/add-from-current-time-plans/${timePlan.ref_id}`
      : `/app/workspace/time-plans/${timePlan.ref_id}`;
  return (
    <EntityCard
      entityId={`time-plan-${timePlan.ref_id}`}
      allowSwipe={props.allowSwipe}
      allowSelect={props.allowSelect}
      allowMarkNotDone={props.allowMarkNotDone}
      selected={props.selected}
      onClick={
        props.onClick
          ? () => props.onClick && props.onClick(timePlan)
          : undefined
      }
      onMarkNotDone={
        props.onMarkNotDone
          ? () => props.onMarkNotDone && props.onMarkNotDone(timePlan)
          : undefined
      }
    >
      <EntityLink to={link} block={props.onClick !== undefined}>
        <EntityNameComponent name={props.label ?? timePlan.name} />
        {props.showOptions.showSource && (
          <TimePlanSourceTag source={timePlan.source} />
        )}
        {props.showOptions.showPeriod && <PeriodTag period={timePlan.period} />}
      </EntityLink>
    </EntityCard>
  );
}
