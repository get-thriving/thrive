import TuneIcon from "@mui/icons-material/Tune";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { DocsHelpSubject, MetricDirection, TagNamespace } from "@jupiter/webapi-client";
import type { MetricEntry, MetricFindResponseEntry, Tag } from "@jupiter/webapi-client";
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
  FilterManyOptions,
  SectionActions,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { compareADate } from "@jupiter/core/common/adate";

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
    include_entries: true,
    include_collection_inbox_tasks: false,
    include_metric_entry_notes: false,
    include_tags: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.METRIC],
  });

  return json({
    entries: metricResponse.entries,
    allTags: allTags.tags as Array<Tag>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function getDirectionArrow(
  direction: MetricDirection,
  entries: Array<MetricEntry> | null | undefined,
): { arrow: string; color: string } | null {
  if (
    direction === MetricDirection.NONE ||
    !entries ||
    entries.length < 2
  ) {
    return null;
  }

  const sorted = [...entries].sort((a, b) =>
    -compareADate(a.collection_time, b.collection_time),
  );

  const latest = sorted[0].value;
  const previous = sorted[1].value;

  if (latest === previous) {
    return null;
  }

  const isUp = latest > previous;

  if (direction === MetricDirection.UP_IS_GOOD) {
    return isUp
      ? { arrow: "↑", color: "green" }
      : { arrow: "↓", color: "red" };
  } else {
    return isUp
      ? { arrow: "↑", color: "red" }
      : { arrow: "↓", color: "green" };
  }
}

export default function Metrics() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const entriesFilteredByTag = loaderData.entries.filter(
    (entry: MetricFindResponseEntry) => {
      if (selectedTagsRefId.length === 0) {
        return true;
      }
      return entry.tags?.some((tag: Tag) =>
        selectedTagsRefId.includes(tag.ref_id),
      );
    },
  );

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
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
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
          {entriesFilteredByTag.map((entry: MetricFindResponseEntry) => {
            const directionIndicator = getDirectionArrow(
              entry.metric.metric_direction,
              entry.metric_entries,
            );
            return (
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
                  {directionIndicator && (
                    <span
                      style={{
                        color: directionIndicator.color,
                        fontWeight: "bold",
                        fontSize: "1.1em",
                        marginLeft: "4px",
                      }}
                    >
                      {directionIndicator.arrow}
                    </span>
                  )}
                  {entry?.tags?.map((tag: Tag) => (
                    <TagTag key={tag.ref_id} tag={tag} />
                  ))}
                </EntityLink>
              </EntityCard>
            );
          })}
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
