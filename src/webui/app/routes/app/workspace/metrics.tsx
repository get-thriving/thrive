import TuneIcon from "@mui/icons-material/Tune";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import EntityIconComponent from "@jupiter/core/infra/component/entity-icon";
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
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeyTag } from "@jupiter/core/common/component/is-key-tag";
import {
  SectionActions,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const metricResponse = await apiClient.metrics.metricFind({
    allow_archived: false,
    include_notes: false,
    include_entries: false,
    include_collection_inbox_tasks: false,
    include_metric_entry_notes: false,
  });

  return json({
    entries: metricResponse.entries,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Metrics() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  return (
    <TrunkPanel
      key={"metrics"}
      createLocation="/app/workspace/metrics/new"
      actions={
        <SectionActions
          id="metrics"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavSingle({
              text: "Settings",
              link: `/app/workspace/metrics/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeafToo}
      >
        {loaderData.entries.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no metrics to show. You can create a new metric."
            newEntityLocations="/app/workspace/metrics/new"
            helpSubject={DocsHelpSubject.METRICS}
          />
        )}
        <EntityStack>
          {loaderData.entries.map((entry) => (
            <EntityCard
              entityId={`metric-${entry.metric.ref_id}`}
              key={entry.metric.ref_id}
            >
              <EntityLink to={`/app/workspace/metrics/${entry.metric.ref_id}`}>
                {entry.metric.icon && (
                  <EntityIconComponent icon={entry.metric.icon} />
                )}
                <IsKeyTag isKey={entry.metric.is_key} />
                <EntityNameComponent name={entry.metric.name} />
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
  error: () => `There was an error loading the metrics! Please try again!`,
});
