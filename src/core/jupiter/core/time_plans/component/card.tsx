import type {
  ChapterSummary,
  GoalSummary,
  AspectSummary,
  Tag,
  TimePlan,
} from "@jupiter/webapi-client";

import type { TopLevelInfo } from "#/core/infra/top-level-context";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { PeriodTag } from "#/core/common/component/period-tag";
import { TimePlanSourceTag } from "#/core/time_plans/component/source-tag";
import { ChapterTag } from "#/core/life_plan/sub/chapters/components/tag";
import { AspectTag } from "#/core/life_plan/sub/aspects/component/tag";
import { GoalTag } from "#/core/life_plan/sub/goals/components/tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";

export interface TimePlanShowOptions {
  showSource?: boolean;
  showPeriod?: boolean;
}

interface TimePlanCardProps {
  label?: string;
  topLevelInfo: TopLevelInfo;
  timePlan: TimePlan;
  tags?: Array<Tag>;
  aspects: Array<AspectSummary>;
  goals: Array<GoalSummary>;
  chapters: Array<ChapterSummary>;
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
        {props.tags?.map((tag) => (
          <TagTag key={tag.ref_id} tag={tag} />
        ))}
        {props.aspects.map((aspect) => (
          <AspectTag key={aspect.ref_id} aspect={aspect} />
        ))}
        {props.goals.map((goal) => (
          <GoalTag key={goal.ref_id} goal={goal} />
        ))}
        {props.chapters.map((chapter) => (
          <ChapterTag key={chapter.ref_id} chapter={chapter} />
        ))}
      </EntityLink>
    </EntityCard>
  );
}
