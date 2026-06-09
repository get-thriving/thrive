import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { ScheduleEventFullDaysEditor } from "@jupiter/core/schedule/sub/event_full_days/component/editor";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_full_days/root";

import { getGuestApiClient } from "~/api-clients.server";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
  eventId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId, eventId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result =
      await apiClient.schedule.scheduleEventFullDaysLoadPublicFromScheduleStream(
        {
          external_id: externalId,
          ref_id: eventId,
        },
      );

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS,
        name: result.schedule_event_full_days.name,
        note: result.note,
        dateModified: result.schedule_event_full_days.last_modified_time,
      }),
      externalId,
      scheduleEventFullDays: result.schedule_event_full_days,
      timeEventFullDaysBlock: result.time_event_full_days_block,
      scheduleStream: result.schedule_stream,
      note: result.note ?? null,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedScheduleStreamFullDaysEvent() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [query] = useSearchParams();

  return (
    <LeafPanel
      key={`published-schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`}
      fakeKey={`published-schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`}
      isLeaflet
      inputsEnabled={false}
      entityNotEditable={true}
      returnLocation={`/app/public/published/schedule-stream/${loaderData.externalId}?${query}`}
    >
      <ScheduleEventFullDaysEditor
        scheduleEventFullDays={loaderData.scheduleEventFullDays}
        timeEventFullDaysBlock={loaderData.timeEventFullDaysBlock}
        allScheduleStreams={[loaderData.scheduleStream]}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.tags}
        allContacts={loaderData.contacts}
        inputsEnabled={false}
        corePropertyEditable={isCorePropertyEditable(
          loaderData.scheduleEventFullDays,
        )}
        topLevelInfo={topLevelInfo}
      />

      <SectionCard title="Note">
        {loaderData.note ? (
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={false}
          />
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
  (params) => `/app/public/published/schedule-stream/${params.externalId}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find full-days event ${params.eventId} in published stream ${params.externalId}!`,
    error: (params) =>
      `There was an error loading full-days event ${params.eventId}! Please try again!`,
  },
);
