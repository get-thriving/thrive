import type { ScheduleStreamSummary } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  ApiError,
  Contact,
  ContactNamespace,
  NoteNamespace,
  Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
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
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ScheduleStreamSelect } from "@jupiter/core/schedule/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "@jupiter/core/common/sub/contacts/component/contacts-editor";

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
      filter_namespace: [TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK],
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
          namespace: NoteNamespace.SCHEDULE_EVENT_FULL_DAYS,
          source_entity_ref_id: id,
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
  const isBigScreen = useBigScreen();

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

  const allScheduleStreamsByRefId = new Map(
    loaderData.allScheduleStreams.map((st) => [st.ref_id, st]),
  );

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
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="schedule-event-full-days-properties"
        title="Properties"
        actions={
          <SectionActions
            id="schedule-event-full-days-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Save",
                    value: "update",
                    highlight: true,
                    disabled: !corePropertyEditable,
                  }),
                  ActionSingle({
                    text: "Change Stream",
                    value: "change-schedule-stream",
                    disabled: !corePropertyEditable,
                  }),
                ],
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="scheduleStreamRefId">Schedule Stream</InputLabel>
          <ScheduleStreamSelect
            labelId="scheduleStreamRefId"
            label="Schedule Stream"
            name="scheduleStreamRefId"
            readOnly={!inputsEnabled || !corePropertyEditable}
            allScheduleStreams={loaderData.allScheduleStreams}
            defaultValue={
              allScheduleStreamsByRefId.get(
                loaderData.scheduleEventFullDays.schedule_stream_ref_id,
              )!
            }
          />
          <FieldError
            actionResult={actionData}
            fieldName="/schedule_stream_ref_id"
          />
        </FormControl>
        <Stack
          direction={isBigScreen ? "row" : "column"}
          spacing={2}
          useFlexGap
        >
          <FormControl fullWidth={!isBigScreen} sx={{ flexGrow: 1 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={!inputsEnabled || !corePropertyEditable}
              defaultValue={loaderData.scheduleEventFullDays.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        </Stack>

        <Stack direction={isBigScreen ? "row" : "column"} useFlexGap gap={2}>
          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <TagsEditor
              name="tags_names"
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((t) => t.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK}
              sourceEntityRefId={loaderData.scheduleEventFullDays.ref_id}
              aloneOnLine={!isBigScreen}
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <ContactsEditor
              name="contacts_names"
              allContacts={loaderData.allContacts}
              defaultValue={loaderData.contacts.map(
                (contact) => contact.ref_id,
              )}
              inputsEnabled={inputsEnabled}
              namespace={ContactNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK}
              sourceEntityRefId={loaderData.scheduleEventFullDays.ref_id}
              aloneOnLine={!isBigScreen}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!inputsEnabled || !corePropertyEditable}
            disabled={!inputsEnabled || !corePropertyEditable}
            defaultValue={loaderData.timeEventFullDaysBlock.start_date}
          />

          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup
            variant="outlined"
            disabled={!inputsEnabled || !corePropertyEditable}
          >
            <Button
              disabled={!inputsEnabled || !corePropertyEditable}
              variant={durationDays === 1 ? "contained" : "outlined"}
              onClick={() => setDurationDays(1)}
            >
              1D
            </Button>
            <Button
              disabled={!inputsEnabled || !corePropertyEditable}
              variant={durationDays === 3 ? "contained" : "outlined"}
              onClick={() => setDurationDays(3)}
            >
              3d
            </Button>
            <Button
              disabled={!inputsEnabled || !corePropertyEditable}
              variant={durationDays === 7 ? "contained" : "outlined"}
              onClick={() => setDurationDays(7)}
            >
              7d
            </Button>
          </ButtonGroup>

          <FormControl fullWidth>
            <InputLabel id="durationDays" shrink margin="dense">
              Duration (Days)
            </InputLabel>
            <OutlinedInput
              type="number"
              label="Duration (Days)"
              name="durationDays"
              readOnly={!inputsEnabled || !corePropertyEditable}
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
            />

            <FieldError actionResult={actionData} fieldName="/duration_days" />
          </FormControl>
        </Stack>
      </SectionCard>

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
