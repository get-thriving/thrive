import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { MetricEntryEditor } from "@jupiter/core/apps/metrics/sub/entry/component/editor";
import { metricEntryName } from "@jupiter/core/apps/metrics/sub/entry/root";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";

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

    const result = await apiClient.metrics.metricEntryLoadPublic({
      external_id: externalId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.METRIC_ENTRY,
        name: metricEntryName(result.metric_entry),
        note: result.note,
        dateModified: result.metric_entry.last_modified_time,
      }),
      metricEntry: result.metric_entry,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      locations: result.locations ?? [],
      note: result.note ?? null,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedMetricEntry() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { metricEntry, tags, contacts, locations, note } = loaderData;

  return (
    <LeafPanel
      key={`published-metric-entry-${metricEntry.ref_id}`}
      fakeKey={`published-metric-entry-${metricEntry.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <MetricEntryEditor
        metricEntry={metricEntry}
        tags={tags}
        contacts={contacts}
        locations={locations}
        allTags={tags}
        allContacts={contacts}
        allLocations={locations}
        inputsEnabled={false}
        topLevelInfo={topLevelInfo}
      />

      <SectionCard title="Note">
        {note ? (
          <EntityNoteEditor initialNote={note} inputsEnabled={false} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No note.
          </Typography>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) =>
    `Could not find published metric entry ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published metric entry ${params.externalId}! Please try again!`,
});
