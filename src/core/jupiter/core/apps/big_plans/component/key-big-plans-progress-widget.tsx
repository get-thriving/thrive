import { BigPlanMilestone, BigPlanStats } from "@jupiter/webapi-client";

import {
  selectKeyBigPlanEntries,
  sortBigPlansNaturally,
} from "#/core/apps/big_plans/root";
import { WidgetProps } from "#/core/home/component/common";
import { WidgetNotConfiguredCard } from "#/core/home/component/widget-not-configured-card";
import { keyBigPlansProgressBigPlanRefIds } from "#/core/home/sub/widget/properties";
import { StandardDivider } from "#/core/infra/component/standard-divider";
import { BigPlanStack } from "#/core/apps/big_plans/component/stack";

export function KeyBigPlansProgressWidget(props: WidgetProps) {
  const keyBigPlans = props.keyBigPlans!;

  // A widget placed on a home tab includes the big plans it was set up with.
  // Anywhere else it includes everything it is given.
  const entries = props.properties
    ? selectKeyBigPlanEntries(
        keyBigPlans.bigPlans,
        keyBigPlansProgressBigPlanRefIds(props.properties),
      )
    : keyBigPlans.bigPlans;
  const sortedBigPlans = sortBigPlansNaturally(entries.map((bp) => bp.bigPlan));
  const bigPlanMilestonesByRefId: Map<string, BigPlanMilestone[]> = new Map(
    entries.map((bp) => [bp.bigPlan.ref_id, bp.milestones]),
  );
  const bigPlanStatsByRefId: Map<string, BigPlanStats> = new Map(
    entries.map((bp) => [bp.bigPlan.ref_id, bp.stats]),
  );

  if (sortedBigPlans.length === 0) {
    return (
      <WidgetNotConfiguredCard
        title="No Big Plans To Show"
        message="This widget has no big plans to show. Pick the big plans it should show the progress of in the widget's settings."
        settingsLocation={props.settingsLocation}
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
