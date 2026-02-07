import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import TuneIcon from "@mui/icons-material/Tune";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  NavMultipleSpread,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { useContext } from "react";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const circlesResponse = await apiClient.prm.circleFind({
    allow_archived: false,
    filter_ref_ids: undefined,
  });

  return json({
    circles: circlesResponse.circles,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Circles() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const topLevelInfo = useContext(TopLevelInfoContext);

  return (
    <TrunkPanel
      key={"prm/circles"}
      createLocation="/app/workspace/prm/circles/new"
      returnLocation="/app/workspace/prm/persons"
      actions={
        <SectionActions
          id="circles-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavMultipleSpread({
              navs: [
                NavSingle({
                  text: "Persons",
                  link: `/app/workspace/prm/persons`,
                  icon: <GroupWorkIcon />,
                }),
              ],
            }),
            NavSingle({
              text: "Settings",
              link: `/app/workspace/prm/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <EntityStack>
          {loaderData.circles.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no circles to show. You can create a new circle."
              newEntityLocations="/app/workspace/prm/circles/new"
              helpSubject={DocsHelpSubject.PRM}
            />
          )}
          {loaderData.circles.map((circle) => (
            <EntityCard
              key={`circle-${circle.ref_id}`}
              entityId={`circle-${circle.ref_id}`}
            >
              <EntityLink to={`/app/workspace/prm/circles/${circle.ref_id}`}>
                <EntityNameComponent name={circle.name} />
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

export const ErrorBoundary = makeTrunkErrorBoundary(
  "/app/workspace/prm/persons",
  {
    error: () => `There was an error loading the circles! Please try again!`,
  },
);
