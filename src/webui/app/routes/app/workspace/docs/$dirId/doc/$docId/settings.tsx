import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { DirSelect } from "@jupiter/core/docs/sub/dir/component/select";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
  docId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    parent_dir_ref_id: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId, docId } = parseParams(params, ParamsSchema);

  try {
    const [docResult, findResult, allTags] = await Promise.all([
      apiClient.docs.docLoad({
        ref_id: docId,
        allow_archived: true,
      }),
      apiClient.docs.dirFind({
        allow_archived: false,
        include_tags: false,
      }),
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
    ]);

    if (docResult.doc.parent_dir_ref_id !== dirId) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    return json({
      doc: docResult.doc,
      tags: docResult.tags,
      allDirs: findResult.entries.map((e) => e.dir),
      allTags: allTags.tags,
      dirId,
      docId,
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
  const { dirId, docId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        const docResult = await apiClient.docs.docLoad({
          ref_id: docId,
          allow_archived: true,
        });
        if (docResult.doc.parent_dir_ref_id !== dirId) {
          throw new Response(ReasonPhrases.NOT_FOUND, {
            status: StatusCodes.NOT_FOUND,
            statusText: ReasonPhrases.NOT_FOUND,
          });
        }
        if (docResult.doc.archived) {
          return redirect(`/app/workspace/docs/${dirId}/doc/${docId}/settings`);
        }

        await apiClient.docs.docUpdate({
          ref_id: docId,
          name: {
            should_change: true,
            value: form.name,
          },
          parent_dir_ref_id: {
            should_change: true,
            value: form.parent_dir_ref_id,
          },
        });

        return redirect(
          `/app/workspace/docs/${form.parent_dir_ref_id}/doc/${docId}`,
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

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function DocSettings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.doc.archived;

  return (
    <LeafPanel
      key={`docs-doc-settings-${loaderData.doc.ref_id}`}
      entityType={NamedEntityTag.DOC}
      entityRefId={loaderData.doc.ref_id}
      isLeaflet
      fakeKey={`docs-doc-settings-${loaderData.doc.ref_id}`}
      returnLocation={`/app/workspace/docs/${loaderData.dirId}/doc/${loaderData.doc.ref_id}`}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.doc.archived}
      initialExpansionState={LeafPanelExpansionState.FULL}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Doc"
        actions={
          !loaderData.doc.archived ? (
            <SectionActions
              id="docs-doc-settings-save"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "docs-doc-settings-save",
                  text: "Save",
                  value: "update",
                  highlight: true,
                }),
              ]}
            />
          ) : undefined
        }
      >
        <Stack spacing={2}>
          {loaderData.doc.archived && (
            <Typography variant="body2" color="text.secondary">
              This doc is archived; settings cannot be edited.
            </Typography>
          )}
          <FormControl fullWidth>
            <InputLabel id="docs-doc-settings-name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              defaultValue={loaderData.doc.name}
              readOnly={!inputsEnabled}
              inputProps={{
                "aria-labelledby": "docs-doc-settings-name",
              }}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <DirSelect
            name="parent_dir_ref_id"
            label="Folder"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allDirs={loaderData.allDirs}
            defaultValue={loaderData.doc.parent_dir_ref_id}
          />

          <TagsEditor
            name="tags"
            allTags={loaderData.allTags}
            defaultValue={loaderData.tags.map((t) => t.ref_id)}
            inputsEnabled={inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.DOC, loaderData.doc.ref_id)}
            label="Tags"
            aloneOnLine
          />
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/docs/${params.dirId}/doc/${params.docId}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find doc #${params.docId}!`,
    error: (params) =>
      `There was an error loading doc settings #${params.docId}! Please try again!`,
  },
);
