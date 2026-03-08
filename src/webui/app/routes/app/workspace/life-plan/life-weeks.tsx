import { json, LoaderFunctionArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useContext } from "react";
import { LifePlan } from "@jupiter/webapi-client";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { lifePlanBirthdayDate } from "@jupiter/core/life_plan/root";
import { aDateToDate } from "@jupiter/core/common/adate";
import { LifeWeeksGrid } from "@jupiter/core/life_plan/component/life-weeks-grid";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
  });

  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function LifeWeeks() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const birthday = lifePlanBirthdayDate(loaderData.lifePlan);
  const today = aDateToDate(topLevelInfo.today);

  return (
    <LeafPanel
      key="life-weeks"
      fakeKey="life-weeks"
      returnLocation="/app/workspace/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={true}
      initialExpansionState={LeafPanelExpansionState.LARGE}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard title="Life Weeks">
          <LifeWeeksGrid birthday={birthday} today={today} />
        </SectionCard>
      </NestingAwareBlock>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  () => `There was an error loading the life weeks view! Please try again!`,
);
