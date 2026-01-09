import type { MilestoneSummary, ProjectSummary } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import AddIcon from "@mui/icons-material/Add";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { z } from "zod";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { sortMilestonesNaturally } from "@jupiter/core/life_plan/sub/milestones/root";
import { ProjectTag } from "@jupiter/core/life_plan/sub/aspects/component/tag";

import { getLoggedInApiClient } from "~/api-clients.server";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

export const handle = {
  displayType: DisplayType.LEAF,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
    include_milestones: true,
  });

  return json({
    allProjects: summaryResponse.projects as ProjectSummary[],
    allMilestones: summaryResponse.milestones as MilestoneSummary[],
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Milestones() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const allProjectsByRefId = new Map(
    loaderData.allProjects.map((project) => [project.ref_id, project]),
  );

  const sortedMilestones = sortMilestonesNaturally(loaderData.allMilestones);

  return (
    <LeafPanel
      key="life-plan-milestones"
      fakeKey="life-plan-milestones"
      returnLocation="/app/workspace/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={inputsEnabled}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard
          title="Milestones"
          actions={
            <SectionActions
              id="life-plan-milestones"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New Milestone",
                  link: `/app/workspace/life-plan/milestones/new`,
                  icon: <AddIcon />,
                }),
              ]}
            />
          }
        >
          {sortedMilestones.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no milestones to show. You can create a new milestone."
              newEntityLocations="/app/workspace/life-plan/milestones/new"
              helpSubject={DocsHelpSubject.LIFE_PLAN_MILESTONES}
            />
          )}

          <EntityStack>
            {sortedMilestones.map((milestone) => (
              <EntityCard
                key={`milestone-${milestone.ref_id}`}
                entityId={`milestone-${milestone.ref_id}`}
              >
                <EntityLink
                  to={`/app/workspace/life-plan/milestones/${milestone.ref_id}`}
                >
                  <ProjectTag
                    project={allProjectsByRefId.get(milestone.project_ref_id)!}
                  />
                  <EntityNameComponent name={milestone.name} />
                </EntityLink>
              </EntityCard>
            ))}
          </EntityStack>
        </SectionCard>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/milestones",
  ParamsSchema,
  {
    error: () => `There was an error loading the milestones! Please try again!`,
  },
);
