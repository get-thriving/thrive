import type { Contact, MetricEntry, Tag } from "@jupiter/webapi-client";
import {
  DocsHelpSubject,
  MetricDirection,
  NamedEntityTag,
} from "@jupiter/webapi-client";
import { styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResponsiveLine } from "@nivo/line";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { aDateToDate, compareADate } from "@jupiter/core/common/adate";
import { metricEntryName } from "@jupiter/core/metrics/sub/entry/root";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "@jupiter/core/common/sub/contacts/component/contact-tag";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { getGuestApiClient } from "~/api-clients.server";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const response = await apiClient.metrics.metricLoadPublic({
      external_id: externalId,
      include_entry_tags_and_contacts: true,
    });

    const metricEntryContactsByRefId: { [key: string]: Array<Contact> } =
      response.metric_entry_contacts ?? {};

    const tagsByMetricEntryRefId: { [key: string]: Array<Tag> } = {};
    for (const entryTags of response.metric_entry_tags) {
      tagsByMetricEntryRefId[entryTags.metric_entry_ref_id] = entryTags.tags;
    }

    const allEntryTags = Object.values(tagsByMetricEntryRefId)
      .flat()
      .filter(
        (tag, index, tags) =>
          tags.findIndex((other) => other.ref_id === tag.ref_id) === index,
      );
    const allContacts = Object.values(metricEntryContactsByRefId)
      .flat()
      .filter(
        (contact, index, contacts) =>
          contacts.findIndex((other) => other.ref_id === contact.ref_id) ===
          index,
      );

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.METRIC,
        name: response.metric.name,
        summary: `${response.metric_entries.length} entries`,
        dateModified: response.metric.last_modified_time,
        ogType: "website",
      }),
      externalId,
      metric: response.metric,
      metricEntries: response.metric_entries,
      tagsByMetricEntryRefId,
      metricEntryContactsByRefId,
      allEntryTags,
      allContacts,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedMetric() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const allEntriesSorted = useMemo(
    () =>
      [...loaderData.metricEntries].sort(
        (e1, e2) => -compareADate(e1.collection_time, e2.collection_time),
      ),
    [loaderData.metricEntries],
  );

  const previousEntryByRefId = useMemo(() => {
    const map = new Map<string, MetricEntry>();
    for (let i = 0; i < allEntriesSorted.length - 1; i++) {
      map.set(allEntriesSorted[i].ref_id, allEntriesSorted[i + 1]);
    }
    return map;
  }, [allEntriesSorted]);

  const filteredEntries = useMemo(
    () =>
      allEntriesSorted.filter((entry) => {
        const tags = loaderData.tagsByMetricEntryRefId[entry.ref_id] ?? [];
        const tagsOk =
          selectedTagsRefId.length === 0 ||
          tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));

        const contacts =
          loaderData.metricEntryContactsByRefId[entry.ref_id] ?? [];
        const contactsOk =
          selectedContactsRefId.length === 0 ||
          contacts.some((contact: Contact) =>
            selectedContactsRefId.includes(contact.ref_id),
          );

        return tagsOk && contactsOk;
      }),
    [
      allEntriesSorted,
      loaderData.tagsByMetricEntryRefId,
      loaderData.metricEntryContactsByRefId,
      selectedTagsRefId,
      selectedContactsRefId,
    ],
  );

  function getDirectionIndicator(
    entry: MetricEntry,
  ): { arrow: string; diff: string; color: string } | null {
    const direction = loaderData.metric.metric_direction;
    if (direction === MetricDirection.NONE) return null;

    const prev = previousEntryByRefId.get(entry.ref_id);
    if (!prev) return null;

    const delta = entry.value - prev.value;
    const roundedDelta = Math.round(delta * 100) / 100;
    if (roundedDelta === 0) return null;

    const isUp = roundedDelta > 0;
    const diffStr = isUp
      ? `+${roundedDelta.toFixed(2)}`
      : `${roundedDelta.toFixed(2)}`;

    const isGood =
      (direction === MetricDirection.UP_IS_GOOD && isUp) ||
      (direction === MetricDirection.DOWN_IS_GOOD && !isUp);

    return {
      arrow: isUp ? "⬆" : "⬇",
      diff: diffStr,
      color: isGood ? "green" : "red",
    };
  }

  return (
    <LeafPanel
      key={`published-metric-${loaderData.metric.ref_id}`}
      fakeKey={`published-metric-${loaderData.metric.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <SectionCard
          title={loaderData.metric.name}
          actions={
            <SectionActions
              id="published-metric-entries"
              topLevelInfo={topLevelInfo}
              inputsEnabled={false}
              actions={[
                FilterManyOptions(
                  "Tags",
                  loaderData.allEntryTags.map((tag) => ({
                    value: tag.ref_id,
                    text: tag.name,
                  })),
                  setSelectedTagsRefId,
                ),
                FilterManyOptions(
                  "Contacts",
                  loaderData.allContacts.map((contact) => ({
                    value: contact.ref_id,
                    text: contact.name,
                  })),
                  setSelectedContactsRefId,
                ),
              ]}
            />
          }
        >
          <MetricGraph sortedMetricEntries={filteredEntries} />

          {filteredEntries.length === 0 && (
            <EntityNoNothingCard
              title="Nothing To Show"
              message="There are no metric entries to show with the current filters."
              helpSubject={DocsHelpSubject.METRICS}
            />
          )}

          <EntityStack>
            {filteredEntries.map((entry) => {
              const indicator = getDirectionIndicator(entry);
              return (
                <EntityCard
                  key={`metric-entry-${entry.ref_id}`}
                  entityId={`metric-entry-${entry.ref_id}`}
                >
                  <EntityLink
                    to={`/app/public/published/metric/${loaderData.externalId}/${entry.ref_id}`}
                  >
                    <EntityNameComponent name={metricEntryName(entry)} />
                    {indicator && (
                      <span
                        style={{
                          color: indicator.color,
                          fontWeight: "bold",
                          fontSize: "0.9em",
                          marginLeft: "4px",
                        }}
                      >
                        {indicator.arrow} {indicator.diff}
                      </span>
                    )}
                    <TimeDiffTag
                      today={topLevelInfo.today}
                      labelPrefix="Collected"
                      collectionTime={entry.collection_time}
                    />
                    {(
                      loaderData.tagsByMetricEntryRefId[entry.ref_id] ?? []
                    ).map((tag) => (
                      <TagTag key={tag.ref_id} tag={tag} />
                    ))}
                    {(
                      loaderData.metricEntryContactsByRefId[entry.ref_id] ?? []
                    ).map((contact: Contact) => (
                      <ContactTag key={contact.ref_id} contact={contact} />
                    ))}
                  </EntityLink>
                </EntityCard>
              );
            })}
          </EntityStack>
        </SectionCard>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) => `Could not find published metric ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published metric ${params.externalId}! Please try again!`,
});

interface MetricGraphProps {
  sortedMetricEntries: MetricEntry[];
}

function MetricGraph({ sortedMetricEntries }: MetricGraphProps) {
  const theme = useTheme();
  const nivoTheme = {
    axis: {
      ticks: {
        text: { fill: theme.palette.text.secondary },
      },
      legend: {
        text: { fill: theme.palette.text.primary },
      },
    },
    legends: {
      text: { fill: theme.palette.text.primary },
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  };

  if (sortedMetricEntries.length === 0) {
    return null;
  }

  const entriesForGraph = sortedMetricEntries.map((e) => ({
    x: aDateToDate(e.collection_time).toFormat("yyyy-MM-dd"),
    y: e.value,
    refId: e.ref_id,
  }));
  const graphMaxValue = Math.max(...entriesForGraph.map((e) => e.y)) * 1.35;

  return (
    <MetricGraphDiv>
      <ResponsiveLine
        theme={nivoTheme}
        curve="monotoneX"
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day",
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          nice: true,
          min: 0,
          max: graphMaxValue,
        }}
        axisBottom={{
          format: "'%y-%b-%d",
          tickValues: 7,
        }}
        pointSize={4}
        pointBorderWidth={1}
        pointBorderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        margin={{ top: 20, right: 10, bottom: 50, left: 50 }}
        useMesh={true}
        enableSlices={false}
        data={[
          {
            id: "metricValue",
            data: entriesForGraph,
          },
        ]}
      />
    </MetricGraphDiv>
  );
}

const MetricGraphDiv = styled("div")`
  height: 300px;
`;
