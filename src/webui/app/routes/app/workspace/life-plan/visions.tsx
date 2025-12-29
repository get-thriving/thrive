import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { BranchPanel } from "#/core/infra/component/layout/branch-panel";
import { z } from "zod";
import { sortVisionsNaturally } from "#/core/life_plan/sub/visions/root";
import { VisionStatusTag } from "#/core/life_plan/sub/visions/components/status-tag";

import { getLoggedInApiClient } from "~/api-clients.server";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

export const handle = {
  displayType: DisplayType.BRANCH,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const response = await apiClient.lifePlan.visionFind({
    include_notes: false,
  });

  return json({
    entries: response.entries,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Visions() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const sortedEntries = sortVisionsNaturally(
    loaderData.entries.map((entry) => entry.vision),
  );

  return (
    <BranchPanel
      createLocation="/app/workspace/life-plan/visions/new-draft"
      returnLocation="/app/workspace/life-plan"
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {sortedEntries.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no visions to show. You can create a new vision draft."
            newEntityLocations="/app/workspace/life-plan/visions/new-draft"
            helpSubject={DocsHelpSubject.LIFE_PLAN_VISIONS}
          />
        )}

        <EntityStack>
          {sortedEntries.map((entry) => (
            <EntityCard
              key={`vision-${entry.ref_id}`}
              entityId={`vision-${entry.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/life-plan/visions/${entry.ref_id}`}
              >
                <VisionStatusTag visionStatus={entry.status} />
                <EntityNameComponent name={entry.name} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    error: () => `There was an error loading the visions! Please try again!`,
  },
);
