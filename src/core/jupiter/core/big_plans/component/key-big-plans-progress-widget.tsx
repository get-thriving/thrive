import {
  BigPlanMilestone,
  BigPlanStats,
  DocsHelpSubject,
} from "@jupiter/webapi-client";

import { sortBigPlansNaturally } from "#/core/big_plans/root";
import { WidgetProps } from "#/core/home/component/common";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { BigPlanStack } from "#/core/big_plans/component/stack";

export function KeyBigPlansProgressWidget(props: WidgetProps) {
  const keyBigPlans = props.keyBigPlans!;
  const sortedBigPlans = sortBigPlansNaturally(
    keyBigPlans.bigPlans.map((bp) => bp.bigPlan),
  );
  const bigPlanMilestonesByRefId: Map<string, BigPlanMilestone[]> = new Map(
    keyBigPlans.bigPlans.map((bp) => [bp.bigPlan.ref_id, bp.milestones]),
  );
  const bigPlanStatsByRefId: Map<string, BigPlanStats> = new Map(
    keyBigPlans.bigPlans.map((bp) => [bp.bigPlan.ref_id, bp.stats]),
  );

  if (sortedBigPlans.length === 0) {
    return (
      <EntityNoNothingCard
        title="No key big plans found"
        message="Mark some big plans as key to see their progress here."
        newEntityLocations="/app/workspace/big-plans/new"
        helpSubject={DocsHelpSubject.BIG_PLANS}
      />
    );
  }

  return (
    <>
      <StandardDivider title="📋 Key Big Plans Progress" size="large" />
      <BigPlanStack
        topLevelInfo={props.topLevelInfo}
        bigPlans={sortedBigPlans}
        bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
        bigPlanStatsByRefId={bigPlanStatsByRefId}
        showOptions={{
          showDonePct: true,
          showMilestonesLeft: true,
          showStatus: true,
          showLifePlan: true,
          showEisen: true,
          showDifficulty: true,
          showActionableDate: true,
          showDueDate: true,
          showHandleMarkDone: false,
          showHandleMarkNotDone: false,
        }}
      />
    </>
  );
}
