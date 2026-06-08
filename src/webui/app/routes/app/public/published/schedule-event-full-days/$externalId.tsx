import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
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
import { ScheduleEventFullDaysEditor } from "@jupiter/core/schedule/sub/event_full_days/component/editor";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_full_days/root";

import { getGuestApiClient } from "~/api-clients.server";
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

    const result = await apiClient.schedule.scheduleEventFullDaysLoadPublic({
      external_id: externalId,
    });

    return json({
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

export default function PublishedScheduleEventFullDays() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const {
    scheduleEventFullDays,
    timeEventFullDaysBlock,
    scheduleStream,
    note,
    tags,
    contacts,
  } = loaderData;

  return (
    <LeafPanel
      key={`published-schedule-event-full-days-${scheduleEventFullDays.ref_id}`}
      fakeKey={`published-schedule-event-full-days-${scheduleEventFullDays.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <ScheduleEventFullDaysEditor
        scheduleEventFullDays={scheduleEventFullDays}
        timeEventFullDaysBlock={timeEventFullDaysBlock}
        allScheduleStreams={[scheduleStream]}
        tags={tags}
        contacts={contacts}
        allTags={tags}
        allContacts={contacts}
        inputsEnabled={false}
        corePropertyEditable={isCorePropertyEditable(scheduleEventFullDays)}
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

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published schedule event ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published schedule event ${params.externalId}! Please try again!`,
});
