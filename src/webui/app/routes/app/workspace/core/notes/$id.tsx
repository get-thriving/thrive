import type { Note } from "@jupiter/webapi-client";
import { ApiError } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { EntitySummaryLink } from "#/core/common/component/entity-summary-link";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { useContext } from "react";
import { noteNamespaceToEntityTag } from "#/core/common/sub/notes/note-namespace-to-entity-tag";

import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
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

  try {
    const result = await apiClient.notes.noteLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      note: result.note as Note,
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

  try {
    switch (form.intent) {
      case "archive": {
        await apiClient.notes.noteArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/notes`);
      }

      case "remove": {
        await apiClient.notes.noteRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/notes`);
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

export default function NoteDetail() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.note.archived;

  return (
    <LeafPanel
      key={`core/notes/${loaderData.note.ref_id}`}
      fakeKey={`core/notes/${loaderData.note.ref_id}`}
      returnLocation="/app/workspace/core/notes"
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
      entityArchived={loaderData.note.archived}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard title="Note">
        <EntitySummaryLink
          today={topLevelInfo.today}
          hideModifiedTime
          summary={{
            entity_tag: noteNamespaceToEntityTag(loaderData.note.namespace),
            ref_id: loaderData.note.source_entity_ref_id,
            snippet: loaderData.note.name,
            archived: loaderData.note.archived,
            last_modified_time: loaderData.note.last_modified_time,
            archived_time: loaderData.note.archived_time,
          }}
        />
        <EntityNoteEditor
          initialNote={loaderData.note}
          inputsEnabled={inputsEnabled}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/core/notes`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find note #${params.id}!`,
    error: (params) =>
      `There was an error loading note #${params.id}! Please try again!`,
  },
);
