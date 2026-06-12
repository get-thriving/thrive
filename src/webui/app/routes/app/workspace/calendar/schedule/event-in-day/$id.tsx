import type { ScheduleStreamSummary } from "@jupiter/webapi-client";
import { NamedEntityTag, ApiError, Contact, Tag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import {
  timeEventInDayBlockParamsToTimezone,
  timeEventInDayBlockParamsToUtc,
} from "@jupiter/core/common/sub/time_events/time-event";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_in_day/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ScheduleEventInDayEditor } from "@jupiter/core/schedule/sub/event_in_day/component/editor";
import { TimeEventParamsSource } from "@jupiter/core/common/sub/time_events/component/params-source";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    userTimezone: z.string(),
    name: z.string(),
    startDate: z.string(),
    startTimeInDay: z.string().optional(),
    durationMins: z.string().transform((v) => parseInt(v, 10)),
  }),
  z.object({
    intent: z.literal("change-schedule-stream"),
    scheduleStreamRefId: z.string(),
  }),
  z.object({
    intent: z.literal("create-note"),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
  z.object({
    intent: z.literal("create-publish"),
    publishOwner: z.string(),
  }),
  z.object({
    intent: z.literal("activate-publish"),
    publishEntityRefId: z.string(),
  }),
  z.object({
    intent: z.literal("to-draft-publish"),
    publishEntityRefId: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_schedule_streams: true,
  });

  try {
    const response = await apiClient.schedule.scheduleEventInDayLoad({
      ref_id: id,
      allow_archived: true,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    return json({
      allScheduleStreams:
        summaryResponse.schedule_streams as Array<ScheduleStreamSummary>,
      scheduleEventInDay: response.schedule_event_in_day,
      timeEventInDayBlock: response.time_event_in_day_block,
      note: response.note,
      tags: response.tags as Array<Tag>,
      contacts:
        (
          response as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
      allTags: allTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
      publishEntity: response.publish_entity ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  const url = new URL(request.url);

  try {
    switch (form.intent) {
      case "update": {
        const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
          form,
          form.userTimezone,
        );
        await apiClient.schedule.scheduleEventInDayUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          start_date: {
            should_change: true,
            value: startDate,
          },
          start_time_in_day: {
            should_change: true,
            value: startTimeInDay ?? "",
          },
          duration_mins: {
            should_change: true,
            value: form.durationMins,
          },
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "change-schedule-stream": {
        await apiClient.schedule.scheduleEventInDayChangeScheduleStream({
          ref_id: id,
          schedule_stream_ref_id: form.scheduleStreamRefId,
        });
        return redirect(
          `/app/workspace/calendar/schedule/event-in-day/${id}?${url.searchParams}`,
        );
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.SCHEDULE_EVENT_IN_DAY, id),
          content: [],
        });
        return redirect(
          `/app/workspace/calendar/schedule/event-in-day/${id}?${url.searchParams}`,
        );
      }

      case "archive": {
        await apiClient.schedule.scheduleEventInDayArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "remove": {
        await apiClient.schedule.scheduleEventInDayRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-in-day/${id}?${url.searchParams}`,
        );
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-in-day/${id}?${url.searchParams}`,
        );
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-in-day/${id}?${url.searchParams}`,
        );
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function ScheduleEventInDayViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.scheduleEventInDay.archived;
  const corePropertyEditable = isCorePropertyEditable(
    loaderData.scheduleEventInDay,
  );

  const blockParamsInTz = timeEventInDayBlockParamsToTimezone(
    {
      startDate: loaderData.timeEventInDayBlock.start_date,
      startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day,
    },
    topLevelInfo.user.timezone,
  );
  const [startDate, setStartDate] = useState(blockParamsInTz.startDate);
  const [startTimeInDay, setStartTimeInDay] = useState(
    blockParamsInTz.startTimeInDay!,
  );
  const [durationMins, setDurationMins] = useState(
    loaderData.timeEventInDayBlock.duration_mins,
  );

  useEffect(() => {
    const blockParamsInTz = timeEventInDayBlockParamsToTimezone(
      {
        startDate: loaderData.timeEventInDayBlock.start_date,
        startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day,
      },
      topLevelInfo.user.timezone,
    );
    setStartDate(blockParamsInTz.startDate);
    setStartTimeInDay(blockParamsInTz.startTimeInDay!);
    setDurationMins(loaderData.timeEventInDayBlock.duration_mins);
  }, [loaderData.timeEventInDayBlock, topLevelInfo.user.timezone]);

  const [debounceForeign, setDeoubceForeign] = useState(false);
  setTimeout(() => setDeoubceForeign(true), 100);
  useEffect(() => {
    if (!debounceForeign) {
      return;
    }
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate")!);
      setStartTimeInDay(query.get("sourceStartTimeInDay")!);
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins")!, 10));
    }
  }, [query, debounceForeign]);

  return (
    <LeafPanel
      key={`schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`}
      entityType={NamedEntityTag.SCHEDULE_EVENT_IN_DAY}
      entityRefId={loaderData.scheduleEventInDay.ref_id}
      fakeKey={`schedule-event-in-day-${loaderData.scheduleEventInDay.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityNotEditable={!corePropertyEditable}
      entityArchived={loaderData.scheduleEventInDay.archived}
      returnLocation={`/app/workspace/calendar?${query}`}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <GlobalError actionResult={actionData} />
      <ScheduleEventInDayEditor
        scheduleEventInDay={loaderData.scheduleEventInDay}
        timeEventInDayBlock={loaderData.timeEventInDayBlock}
        allScheduleStreams={loaderData.allScheduleStreams}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.allTags}
        allContacts={loaderData.allContacts}
        inputsEnabled={inputsEnabled}
        corePropertyEditable={corePropertyEditable}
        topLevelInfo={topLevelInfo}
        actionResult={actionData}
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
        onStartDateChange={setStartDate}
        onStartTimeInDayChange={setStartTimeInDay}
        onDurationMinsChange={setDurationMins}
      />

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="inbox-task-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create Note",
                value: "create-note",
                highlight: false,
                disabled: loaderData.note !== null,
              }),
            ]}
          />
        }
      >
        {loaderData.note && (
          <>
            <EntityNoteEditor
              initialNote={loaderData.note}
              inputsEnabled={inputsEnabled}
            />
          </>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/calendar/schedule/event-in-day/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find event in day #${params.id}!`,
    error: (params) =>
      `There was an error loading event in day #${params.id}! Please try again!`,
  },
);
