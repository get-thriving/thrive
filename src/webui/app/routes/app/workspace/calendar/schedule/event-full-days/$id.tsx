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
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/event_full_days/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ScheduleEventFullDaysEditor } from "@jupiter/core/schedule/sub/event_full_days/component/editor";
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
    name: z.string(),
    startDate: z.string(),
    durationDays: z.string().transform((v) => parseInt(v, 10)),
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
    const response = await apiClient.schedule.scheduleEventFullDaysLoad({
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
      scheduleEventFullDays: response.schedule_event_full_days,
      timeEventFullDaysBlock: response.time_event_full_days_block,
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
        await apiClient.schedule.scheduleEventFullDaysUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          start_date: {
            should_change: true,
            value: form.startDate,
          },
          duration_days: {
            should_change: true,
            value: form.durationDays,
          },
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "change-schedule-stream": {
        await apiClient.schedule.scheduleEventFullDaysChangeScheduleStream({
          ref_id: id,
          schedule_stream_ref_id: form.scheduleStreamRefId,
        });
        return redirect(
          `/app/workspace/calendar/schedule/event-full-days/${id}?${url.searchParams}`,
        );
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS, id),
          content: [],
        });
        return redirect(
          `/app/workspace/calendar/schedule/event-full-days/${id}?${url.searchParams}`,
        );
      }

      case "archive": {
        await apiClient.schedule.scheduleEventFullDaysArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "remove": {
        await apiClient.schedule.scheduleEventFullDaysRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/calendar?${url.searchParams}`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-full-days/${id}?${url.searchParams}`,
        );
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-full-days/${id}?${url.searchParams}`,
        );
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/event-full-days/${id}?${url.searchParams}`,
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

export default function ScheduleEventFullDaysViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.scheduleEventFullDays.archived;
  const corePropertyEditable = isCorePropertyEditable(
    loaderData.scheduleEventFullDays,
  );

  const [durationDays, setDurationDays] = useState(
    loaderData.timeEventFullDaysBlock.duration_days,
  );
  useEffect(() => {
    setDurationDays(loaderData.timeEventFullDaysBlock.duration_days);
  }, [loaderData.timeEventFullDaysBlock.duration_days]);

  return (
    <LeafPanel
      key={`schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`}
      entityType={NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS}
      entityRefId={loaderData.scheduleEventFullDays.ref_id}
      fakeKey={`schedule-event-full-days-${loaderData.scheduleEventFullDays.ref_id}`}
      showArchiveAndRemoveButton={inputsEnabled}
      inputsEnabled={inputsEnabled}
      entityNotEditable={!corePropertyEditable}
      entityArchived={loaderData.scheduleEventFullDays.archived}
      returnLocation={`/app/workspace/calendar?${query}`}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <GlobalError actionResult={actionData} />
      <ScheduleEventFullDaysEditor
        scheduleEventFullDays={loaderData.scheduleEventFullDays}
        timeEventFullDaysBlock={loaderData.timeEventFullDaysBlock}
        allScheduleStreams={loaderData.allScheduleStreams}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.allTags}
        allContacts={loaderData.allContacts}
        inputsEnabled={inputsEnabled}
        corePropertyEditable={corePropertyEditable}
        topLevelInfo={topLevelInfo}
        actionResult={actionData}
        durationDays={durationDays}
        onDurationDaysChange={setDurationDays}
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
  "/app/workspace/calendar",
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find event full days with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading event full days with ID ${params.id}! Please try again!`,
  },
);
