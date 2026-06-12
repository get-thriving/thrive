import { ApiError, Contact, NamedEntityTag, Tag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { MetricEntryEditor } from "@jupiter/core/metrics/sub/entry/component/editor";
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
  const { entryId } = parseParams(params, ParamsSchema);

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
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
      publishEntity: result.publish_entity ?? null,
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

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/metrics/${id}/entries/${entryId}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/metrics/${id}/entries/${entryId}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/metrics/${id}/entries/${entryId}`);
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
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <GlobalError actionResult={actionData} />
      <MetricEntryEditor
        metricEntry={loaderData.metricEntry}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.allTags}
        allContacts={loaderData.allContacts}
        inputsEnabled={inputsEnabled}
        topLevelInfo={topLevelInfo}
        actionResult={actionData}
      />

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
