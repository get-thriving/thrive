import type { Location } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.locations.locationFind({
    allow_archived: false,
  });

  return json({
    locations: result.locations as Array<Location>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Locations() {
  const { locations } = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const sortedLocations = useMemo(
    () => [...locations].sort((a, b) => a.name.localeCompare(b.name)),
    [locations],
  );

  return (
    <TrunkPanel
      key={"core/locations"}
      createLocation="/app/workspace/core/locations/new"
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        {sortedLocations.length === 0 && (
          <EntityNoNothingCard
            title="No Locations"
            message="There are no locations to show. You can create a new location."
            newEntityLocations="/app/workspace/core/locations/new"
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {sortedLocations.map((location) => (
            <EntityCard
              entityId={`location-${location.ref_id}`}
              key={`location-${location.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/core/locations/${location.ref_id}`}
              >
                <EntityNameComponent name={location.name} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the locations! Please try again!`,
});
