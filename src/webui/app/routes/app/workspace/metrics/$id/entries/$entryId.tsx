import {
  ApiError,
  Contact,
  ContactNamespace,
  NamedEntityTag,
  Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { aDateToDate } from "@jupiter/core/common/adate";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  entryId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    collectionTime: z.string(),
    value: z.string().transform(parseFloat),
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
  const { entryId } = parseParams(params, ParamsSchema);

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.METRIC_ENTRY],
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const result = await apiClient.metrics.metricEntryLoad({
      ref_id: entryId,
      allow_archived: true,
    });

    return json({
      metricEntry: result.metric_entry,
      note: result.note,
      tags: result.tags,
      contacts:
        (
          result as {
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
  const { id, entryId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.metrics.metricEntryUpdate({
          ref_id: entryId,
          collection_time: {
            should_change: true,
            value: form.collectionTime,
          },
          value: {
            should_change: true,
            value: form.value,
          },
        });

        return redirect(`/app/workspace/metrics/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.METRIC_ENTRY, entryId),
          content: [],
        });

        return redirect(`/app/workspace/metrics/${id}/entries/${entryId}`);
      }

      case "archive": {
        await apiClient.metrics.metricEntryArchive({
          ref_id: entryId,
        });

        return redirect(`/app/workspace/metrics/${id}`);
      }

      case "remove": {
        await apiClient.metrics.metricEntryRemove({
          ref_id: entryId,
        });

        return redirect(`/app/workspace/metrics/${id}`);
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

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function MetricEntry() {
  const { id, entryId } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.metricEntry.archived;

  return (
    <LeafPanel
      key={`metric-${id}/entry-${entryId}`}
      entityType={NamedEntityTag.METRIC_ENTRY}
      entityRefId={loaderData.metricEntry.ref_id}
      fakeKey={`metric-${id}/entry-${entryId}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.metricEntry.archived}
      returnLocation={`/app/workspace/metrics/${id}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="metric-entry-properties"
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
        <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
          <TimeDiffTag
            today={topLevelInfo.today}
            labelPrefix="Collected"
            collectionTime={loaderData.metricEntry.collection_time}
          />

          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <TagsEditor
              name="tags"
              label={null}
              aloneOnLine
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.METRIC_ENTRY}
              sourceEntityRefId={loaderData.metricEntry.ref_id}
            />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <ContactsEditor
              name="contacts_names"
              label={null}
              aloneOnLine
              allContacts={loaderData.allContacts}
              defaultValue={loaderData.contacts.map(
                (contact) => contact.ref_id,
              )}
              inputsEnabled={inputsEnabled}
              namespace={ContactNamespace.METRIC_ENTRY}
              sourceEntityRefId={loaderData.metricEntry.ref_id}
            />
          </FormControl>
        </Stack>
        <FormControl fullWidth>
          <InputLabel id="collectionTime" shrink>
            Collection Time
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="collectionTime"
            defaultValue={
              loaderData.metricEntry.collection_time
                ? aDateToDate(loaderData.metricEntry.collection_time).toFormat(
                    "yyyy-MM-dd",
                  )
                : undefined
            }
            name="collectionTime"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />

          <FieldError actionResult={actionData} fieldName="/collection_time" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="value">Value</InputLabel>
          <OutlinedInput
            type="number"
            inputProps={{ step: "any" }}
            label="Value"
            name="value"
            readOnly={!inputsEnabled}
            defaultValue={loaderData.metricEntry.value}
          />
          <FieldError actionResult={actionData} fieldName="/value" />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="metric-entry-note"
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
  "/app/workspace/metrics",
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find entry ${params.entryId} in metric ${params.id}!`,
    error: (params) =>
      `There was an error loading entry ${params.entryId} in metric ${params.id}! Please try again!`,
  },
);
