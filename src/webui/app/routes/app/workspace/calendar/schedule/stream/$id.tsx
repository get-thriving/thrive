import {
  ApiError,
  NamedEntityTag,
  ScheduleStreamSource,
  ScheduleStreamColor,
  Tag,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { isCorePropertyEditable } from "@jupiter/core/schedule/sub/stream/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ScheduleStreamColorInput } from "@jupiter/core/schedule/component/color-input";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
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
    color: z.nativeEnum(ScheduleStreamColor),
  }),
  z.object({
    intent: z.literal("create-note"),
  }),
  z.object({
    intent: z.literal("sync"),
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

  try {
    const response = await apiClient.schedule.scheduleStreamLoad({
      ref_id: id,
      allow_archived: true,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    return json({
      scheduleStream: response.schedule_stream,
      note: response.note,
      tags: response.tags as Array<Tag>,
      allTags: allTags.tags as Array<Tag>,
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
        await apiClient.schedule.scheduleStreamUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          color: {
            should_change: true,
            value: form.color,
          },
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream?${url.searchParams}`,
        );
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.SCHEDULE_STREAM, id),
          content: [],
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream/${id}?${url.searchParams}`,
        );
      }

      case "sync": {
        await apiClient.schedule.scheduleExternalSyncDo({
          sync_even_if_not_modified: true,
          filter_schedule_stream_ref_id: [id],
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream/${id}?${url.searchParams}`,
        );
      }

      case "archive": {
        await apiClient.schedule.scheduleStreamArchive({
          ref_id: id,
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream?${url.searchParams}`,
        );
      }

      case "remove": {
        await apiClient.schedule.scheduleStreamRemove({
          ref_id: id,
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream?${url.searchParams}`,
        );
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream/${id}?${url.searchParams}`,
        );
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream/${id}?${url.searchParams}`,
        );
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(
          `/app/workspace/calendar/schedule/stream/${id}?${url.searchParams}`,
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

export default function ScheduleStreamViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.scheduleStream.archived;
  const corePropertyEditable = isCorePropertyEditable(
    loaderData.scheduleStream,
  );

  return (
    <LeafPanel
      key={`schedule-stream-${loaderData.scheduleStream.ref_id}`}
      entityType={NamedEntityTag.SCHEDULE_STREAM}
      entityRefId={loaderData.scheduleStream.ref_id}
      fakeKey={`schedule-stream-${loaderData.scheduleStream.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityNotEditable={!corePropertyEditable}
      entityArchived={loaderData.scheduleStream.archived}
      returnLocation={`/app/workspace/calendar/schedule/stream?${query}`}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="schedule-stream-properties"
        title="Properties"
        actions={
          <SectionActions
            id="schedule-stream-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
                highlight: true,
              }),
              ActionSingle({
                text: "Sync",
                value: "sync",
                disabled:
                  loaderData.scheduleStream.source !==
                  ScheduleStreamSource.EXTERNAL_ICAL,
              }),
            ]}
          />
        }
      >
        {loaderData.scheduleStream.source ===
          ScheduleStreamSource.EXTERNAL_ICAL && (
          <FormControl fullWidth>
            <InputLabel id="sourceIcalUrl">Source iCal URL</InputLabel>
            <OutlinedInput
              label="sourceIcalUrl"
              name="sourceIcalUrl"
              defaultValue={loaderData.scheduleStream.source_ical_url!}
              readOnly={true}
            />
          </FormControl>
        )}

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
              defaultValue={loaderData.scheduleStream.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth={!isBigScreen}>
            <TagsEditor
              name="tags_names"
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((t) => t.ref_id)}
              inputsEnabled={inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.SCHEDULE_STREAM,
                loaderData.scheduleStream.ref_id,
              )}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="color">Color</InputLabel>
          <ScheduleStreamColorInput
            labelId="color"
            label="Color"
            name="color"
            value={loaderData.scheduleStream.color}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/color" />
        </FormControl>
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
  (params) => `/app/workspace/calendar/schedule/stream/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find stream #${params.id}!`,
    error: (params) =>
      `There was an error loading stream #${params.id}! Please try again!`,
  },
);
