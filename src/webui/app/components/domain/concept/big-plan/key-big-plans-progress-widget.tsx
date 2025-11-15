import {
  BigPlanMilestone,
  BigPlanStats,
  DocsHelpSubject,
} from "@jupiter/webapi-client";
import { sortBigPlansNaturally } from "@jupiter/core/big_plans/root";

import { WidgetProps } from "~/components/domain/application/home/common";
import { StandardDivider } from "~/components/infra/standard-divider";
import { EntityNoNothingCard } from "~/components/infra/entity-no-nothing-card";
import { BigPlanStack } from "~/components/domain/concept/big-plan/big-plan-stack";

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
          showProject: true,
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
