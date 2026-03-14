import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
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
import AddIcon from "@mui/icons-material/Add";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { z } from "zod";
import { sortVisionsNaturally } from "#/core/life_plan/sub/visions/root";
import { VisionStatusTag } from "#/core/life_plan/sub/visions/components/status-tag";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { useContext } from "react";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { SectionCard } from "#/core/infra/component/section-card";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.LEAF,
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

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return true;
};

export default function Visions() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const sortedEntries = sortVisionsNaturally(
    loaderData.entries.map((entry) => entry.vision),
  );

  return (
    <LeafPanel
      key="visions"
      fakeKey="visions"
      returnLocation="/app/workspace/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={inputsEnabled}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard
          title="Visions"
          actions={
            <SectionActions
              id="visions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  id: "new-vision",
                  text: "New Vision",
                  link: `/app/workspace/life-plan/visions/new-draft`,
                  icon: <AddIcon />,
                }),
              ]}
            />
          }
        >
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
        </SectionCard>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    error: () => `There was an error loading the visions! Please try again!`,
  },
);
