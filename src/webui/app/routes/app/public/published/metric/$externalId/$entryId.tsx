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
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { MetricEntryEditor } from "@jupiter/core/metrics/sub/entry/component/editor";
import { metricEntryName } from "@jupiter/core/metrics/sub/entry/root";

import { getGuestApiClient } from "~/api-clients.server";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
  entryId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId, entryId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.metrics.metricEntryLoadPublicFromMetric({
      external_id: externalId,
      ref_id: entryId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.METRIC_ENTRY,
        name: metricEntryName(result.metric_entry),
        note: result.note,
        dateModified: result.metric_entry.last_modified_time,
      }),
      externalId,
      metricEntry: result.metric_entry,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      note: result.note ?? null,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedMetricEntryFromMetric() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { metricEntry, tags, contacts, note } = loaderData;

  return (
    <LeafPanel
      key={`published-metric-entry-${metricEntry.ref_id}`}
      fakeKey={`published-metric-entry-${metricEntry.ref_id}`}
      isLeaflet
      inputsEnabled={false}
      entityNotEditable={true}
      returnLocation={`/app/public/published/metric/${loaderData.externalId}`}
    >
      <MetricEntryEditor
        metricEntry={metricEntry}
        tags={tags}
        contacts={contacts}
        allTags={tags}
        allContacts={contacts}
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

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/public/published/metric/${params.externalId}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find metric entry ${params.entryId} in published metric ${params.externalId}!`,
    error: (params) =>
      `There was an error loading metric entry ${params.entryId}! Please try again!`,
  },
);
