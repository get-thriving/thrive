import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { timeEventInDayBlockParamsToTimezone } from "@jupiter/core/common/sub/time_events/time-event";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { ScheduleEventInDayEditor } from "@jupiter/core/schedule/sub/event_in_day/component/editor";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_in_day/root";

import { getGuestApiClient } from "~/api-clients.server";
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
      await apiClient.schedule.scheduleEventInDayLoadPublicFromScheduleStream({
        external_id: externalId,
        ref_id: eventId,
      });

    return json({
      externalId,
      scheduleEventInDay: result.schedule_event_in_day,
      timeEventInDayBlock: result.time_event_in_day_block,
      scheduleStream: result.schedule_stream,
      note: result.note ?? null,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedScheduleStreamInDayEvent() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const [query] = useSearchParams();

  const blockParamsInTz = useMemo(
    () =>
      timeEventInDayBlockParamsToTimezone(
        {
          startDate: loaderData.timeEventInDayBlock.start_date,
          startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day,
        },
        topLevelInfo.user.timezone,
      ),
    [loaderData.timeEventInDayBlock, topLevelInfo.user.timezone],
  );

  return (
    <LeafPanel
      key={`published-schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`}
      fakeKey={`published-schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`}
      isLeaflet
      inputsEnabled={false}
      entityNotEditable={true}
      returnLocation={`/app/public/published/schedule-stream/${loaderData.externalId}?${query}`}
    >
      <ScheduleEventInDayEditor
        scheduleEventInDay={loaderData.scheduleEventInDay}
        timeEventInDayBlock={loaderData.timeEventInDayBlock}
        allScheduleStreams={[loaderData.scheduleStream]}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.tags}
        allContacts={loaderData.contacts}
        inputsEnabled={false}
        corePropertyEditable={isCorePropertyEditable(
          loaderData.scheduleEventInDay,
        )}
        topLevelInfo={topLevelInfo}
        startDate={blockParamsInTz.startDate}
        startTimeInDay={blockParamsInTz.startTimeInDay!}
        durationMins={loaderData.timeEventInDayBlock.duration_mins}
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
      `Could not find in-day event ${params.eventId} in published stream ${params.externalId}!`,
    error: (params) =>
      `There was an error loading in-day event ${params.eventId}! Please try again!`,
  },
);
