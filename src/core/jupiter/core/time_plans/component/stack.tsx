import type {
  ChapterSummary,
  EntityId,
  GoalSummary,
  ProjectSummary,
  TimePlan,
} from "@jupiter/webapi-client";

import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityStack2 } from "#/core/infra/component/entity-stack";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { TimePlanCard } from "#/core/time_plans/component/card";

interface TimePlanStackProps {
  id?: string;
  label?: string;
  topLevelInfo: TopLevelInfo;
  timePlans: Array<TimePlan>;
  timePlanProjectRefIds?: Map<string, Array<EntityId>>;
  timePlanGoalRefIds?: Map<string, Array<EntityId>>;
  timePlanChapterRefIds?: Map<string, Array<EntityId>>;
  allProjectsByRefId?: Map<string, ProjectSummary>;
  allGoalsByRefId?: Map<string, GoalSummary>;
  allChaptersByRefId?: Map<string, ChapterSummary>;
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
          projects={
            props.timePlanProjectRefIds
              ?.get(timePlan.ref_id)
              ?.map((refId) => props.allProjectsByRefId?.get(refId))
              .filter((project) => project !== undefined) ?? []
          }
          goals={
            props.timePlanGoalRefIds
              ?.get(timePlan.ref_id)
              ?.map((refId) => props.allGoalsByRefId?.get(refId))
              .filter((goal) => goal !== undefined) ?? []
          }
          chapters={
            props.timePlanChapterRefIds
              ?.get(timePlan.ref_id)
              ?.map((refId) => props.allChaptersByRefId?.get(refId))
              .filter((chapter) => chapter !== undefined) ?? []
          }
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
