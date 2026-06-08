import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import { Button } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, Outlet, useActionData, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { DocEditor } from "@jupiter/core/docs/component/editor";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
  docId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("archive") }),
  z.object({ intent: z.literal("remove") }),
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
  const { dirId, docId } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.docs.docLoad({
      ref_id: docId,
      allow_archived: true,
    });

    if (result.doc.parent_dir_ref_id !== dirId) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    return json({
      doc: result.doc,
      note: result.note,
      tags: result.tags,
      publishEntity: result.publish_entity ?? null,
      allTags: allTags.tags,
      dirId,
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
      case "archive": {
        await apiClient.docs.docArchive({
          ref_id: docId,
        });
        return redirect(`/app/workspace/docs/${dirId}`);
      }

      case "remove": {
        await apiClient.docs.docRemove({
          ref_id: docId,
        });
        return redirect(`/app/workspace/docs/${dirId}`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/docs/${dirId}/doc/${docId}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/docs/${dirId}/doc/${docId}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/docs/${dirId}/doc/${docId}`);
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

export default function DocInFolder() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const inputsEnabled = navigation.state === "idle" && !loaderData.doc.archived;

  return (
    <LeafPanel
      key={`doc-${loaderData.doc.ref_id}`}
      entityType={NamedEntityTag.DOC}
      entityRefId={loaderData.doc.ref_id}
      fakeKey={`doc-${loaderData.doc.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.doc.archived}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
      returnLocation={`/app/workspace/docs/${loaderData.dirId}`}
      initialExpansionState={LeafPanelExpansionState.FULL}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="Doc"
          actions={
            <Button
              component={Link}
              to={`/app/workspace/docs/${loaderData.dirId}/doc/${loaderData.doc.ref_id}/settings`}
              variant="outlined"
              size="small"
              type="button"
            >
              Settings
            </Button>
          }
        >
          <DocEditor
            initialDoc={loaderData.doc}
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
            parentDirRefId={loaderData.doc.parent_dir_ref_id}
            rightOfName={
              <TagsEditor
                name="tags"
                allTags={loaderData.allTags}
                defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
                inputsEnabled={inputsEnabled}
                owner={entityLinkStd(NamedEntityTag.DOC, loaderData.doc.ref_id)}
              />
            }
          />
        </SectionCard>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find doc #${params.docId}!`,
    error: (params) =>
      `There was an error loading doc #${params.docId}! Please try again!`,
  },
);
