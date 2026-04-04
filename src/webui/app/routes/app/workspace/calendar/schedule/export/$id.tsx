import {
  ApiError,
  NamedEntityTag,
  NoteNamespace,
  Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import {
  Button,
  FormControl,
  InputAdornment,
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
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ScheduleStreamMultiSelect } from "@jupiter/core/schedule/component/multi-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { ServicePropertiesContext } from "@jupiter/core/config-client";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";
import { selectZod, fixSelectOutputEntityId } from "~/logic/select";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    scheduleStreamRefIds: selectZod(z.string()),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("create-note"),
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

  try {
    const response = await apiClient.schedule.scheduleExportLoad({
      ref_id: id,
      allow_archived: true,
    });
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.SCHEDULE_EXPORT],
    });

    const streamsResponse = await apiClient.schedule.scheduleStreamFind({
      allow_archived: false,
      include_notes: false,
      include_tags: false,
    });

    return json({
      scheduleExport: response.schedule_export,
      note: response.note,
      tags: response.tags as Array<Tag>,
      allTags: allTags.tags as Array<Tag>,
      allScheduleStreams: streamsResponse.entries.map((e) => e.schedule_stream),
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
        await apiClient.schedule.scheduleExportUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          schedule_stream_ref_ids: {
            should_change: true,
            value: fixSelectOutputEntityId(form.scheduleStreamRefIds) ?? [],
          },
        });

        return redirect(
          `/app/workspace/calendar/schedule/export?${url.searchParams}`,
        );
      }

      case "archive": {
        await apiClient.schedule.scheduleExportArchive({
          ref_id: id,
        });

        return redirect(
          `/app/workspace/calendar/schedule/export?${url.searchParams}`,
        );
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.SCHEDULE_EXPORT,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(
          `/app/workspace/calendar/schedule/export/${id}?${url.searchParams}`,
        );
      }

      case "remove": {
        await apiClient.schedule.scheduleExportRemove({
          ref_id: id,
        });

        return redirect(
          `/app/workspace/calendar/schedule/export?${url.searchParams}`,
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

export default function ScheduleExportViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();
  const isBigScreen = useBigScreen();
  const [hasCopiedExternalUrl, setHasCopiedExternalUrl] = useState(false);
  const serviceProperties = useContext(ServicePropertiesContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.scheduleExport.archived;
  const externalId =
    (loaderData.scheduleExport as { external_id?: string }).external_id ?? "";
  const externalCalendarUrl = `${serviceProperties.webUiUrl}/app/public/schedule/export/${externalId}`;

  async function copyExternalCalendarUrl() {
    await navigator.clipboard.writeText(externalCalendarUrl);
    setHasCopiedExternalUrl(true);
  }

  return (
    <LeafPanel
      key={`schedule-export-${loaderData.scheduleExport.ref_id}`}
      entityType={NamedEntityTag.SCHEDULE_EXPORT}
      entityRefId={loaderData.scheduleExport.ref_id}
      fakeKey={`schedule-export-${loaderData.scheduleExport.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.scheduleExport.archived}
      returnLocation={`/app/workspace/calendar/schedule/export?${query}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="schedule-export-properties"
        title="Properties"
        actions={
          <SectionActions
            id="schedule-export-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
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
              readOnly={!inputsEnabled}
              defaultValue={loaderData.scheduleExport.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth={!isBigScreen}>
            <TagsEditor
              name="tags_names"
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((t) => t.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.SCHEDULE_EXPORT}
              sourceEntityRefId={loaderData.scheduleExport.ref_id}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="scheduleStreamRefIds">Calendar Streams</InputLabel>
          <ScheduleStreamMultiSelect
            labelId="scheduleStreamRefIds"
            label="Calendar Streams"
            name="scheduleStreamRefIds"
            readOnly={!inputsEnabled}
            allScheduleStreams={loaderData.allScheduleStreams}
            defaultValue={loaderData.scheduleExport.schedule_stream_ref_ids}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/schedule_stream_ref_ids"
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="externalCalendarUrl">
            External Calendar URL
          </InputLabel>
          <OutlinedInput
            label="External Calendar URL"
            name="externalCalendarUrl"
            readOnly
            value={externalCalendarUrl}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="outlined"
                  onClick={copyExternalCalendarUrl}
                  disabled={hasCopiedExternalUrl}
                >
                  {hasCopiedExternalUrl ? "Copied" : "Copy"}
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="schedule-export-note"
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
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/calendar/schedule/export/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find export #${params.id}!`,
    error: (params) =>
      `There was an error loading export #${params.id}! Please try again!`,
  },
);
