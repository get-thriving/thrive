import { DocsHelpSubject } from "@jupiter/webapi-client";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigation } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { z } from "zod";
import { useContext } from "react";

import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "#/core/infra/component/error-boundary";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "#/core/infra/component/use-nested-entities";
import { sortVisionsNaturally } from "#/core/apps/life_plan/sub/visions/root";
import { VisionStatusTag } from "#/core/apps/life_plan/sub/visions/components/status-tag";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { SectionCard } from "#/core/infra/component/section-card";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

export const handle = {
  displayType: DisplayType.LEAF,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const response = await apiClient.lifePlan.visionFind({
    include_notes: false,
  });

  return {
    entries: response.entries,
  };
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
      returnLocation="/app/workspace/apps/life-plan"
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
                  link: `/app/workspace/apps/life-plan/visions/new-draft`,
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
              newEntityLocations="/app/workspace/apps/life-plan/visions/new-draft"
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
                  to={`/app/workspace/apps/life-plan/visions/${entry.ref_id}`}
                >
                  <VisionStatusTag visionStatus={entry.status} />
                  <EntityNameComponent name={entry.name} />
                </EntityLink>
              </EntityCard>
            ))}
          </EntityStack>
        </SectionCard>
      </NestingAwareBlock>

      <NestedOutlet />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/apps/life-plan",
  ParamsSchema,
  {
    error: () => `There was an error loading the visions! Please try again!`,
  },
);
