import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { timeEventInDayBlockParamsToTimezone } from "@jupiter/core/common/sub/time_events/time-event";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { ScheduleEventInDayEditor } from "@jupiter/core/schedule/sub/event_in_day/component/editor";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_in_day/root";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

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

    const result = await apiClient.schedule.scheduleEventInDayLoadPublic({
      external_id: externalId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.SCHEDULE_EVENT_IN_DAY,
        name: result.schedule_event_in_day.name,
        note: result.note,
        dateModified: result.schedule_event_in_day.last_modified_time,
      }),
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

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedScheduleEventInDay() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const {
    scheduleEventInDay,
    timeEventInDayBlock,
    scheduleStream,
    note,
    tags,
    contacts,
  } = loaderData;

  const blockParamsInTz = useMemo(
    () =>
      timeEventInDayBlockParamsToTimezone(
        {
          startDate: timeEventInDayBlock.start_date,
          startTimeInDay: timeEventInDayBlock.start_time_in_day,
        },
        topLevelInfo.user.timezone,
      ),
    [timeEventInDayBlock, topLevelInfo.user.timezone],
  );

  return (
    <LeafPanel
      key={`published-schedule-event-in-day-${scheduleEventInDay.ref_id}`}
      fakeKey={`published-schedule-event-in-day-${scheduleEventInDay.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <ScheduleEventInDayEditor
        scheduleEventInDay={scheduleEventInDay}
        timeEventInDayBlock={timeEventInDayBlock}
        allScheduleStreams={[scheduleStream]}
        tags={tags}
        contacts={contacts}
        allTags={tags}
        allContacts={contacts}
        inputsEnabled={false}
        corePropertyEditable={isCorePropertyEditable(scheduleEventInDay)}
        topLevelInfo={topLevelInfo}
        startDate={blockParamsInTz.startDate}
        startTimeInDay={blockParamsInTz.startTimeInDay!}
        durationMins={timeEventInDayBlock.duration_mins}
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
    `Could not find published schedule event ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published schedule event ${params.externalId}! Please try again!`,
});
