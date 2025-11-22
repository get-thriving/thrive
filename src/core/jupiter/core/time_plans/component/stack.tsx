import type { TimePlan } from "@jupiter/webapi-client";

import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityStack2 } from "#/core/infra/component/entity-stack";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanCard } from "#/core/time_plans/component/card";

interface TimePlanStackProps {
  id?: string;
  label?: string;
  topLevelInfo: TopLevelInfo;
  timePlans: Array<TimePlan>;
  selectedPredicate?: (timePlan: TimePlan) => boolean;
  allowSwipe?: boolean;
  allowSelect?: boolean;
  allowMarkNotDone?: boolean;
  relativeToTimePlan?: TimePlan;
  onMarkNotDone?: (timePlan: TimePlan) => void;
  onClick?: (timePlan: TimePlan) => void;
}

export function TimePlanStack(props: TimePlanStackProps) {
  return (
    <EntityStack2 id={props.id}>
      {props.label && <StandardDivider title={props.label} size="large" />}

      {props.timePlans.map((timePlan) => (
        <TimePlanCard
          key={`time-plan-${timePlan.ref_id}`}
          topLevelInfo={props.topLevelInfo}
          timePlan={timePlan}
          showOptions={{
            showSource: true,
            showPeriod: true,
          }}
          allowSwipe={props.allowSwipe}
          allowSelect={props.allowSelect}
          allowMarkNotDone={props.allowMarkNotDone}
          selected={props.selectedPredicate?.(timePlan)}
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
          relativeToTimePlan={props.relativeToTimePlan}
        />
      ))}
    </EntityStack2>
  );
}
