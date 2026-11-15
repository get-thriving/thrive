import { NamedEntityTag } from "@jupiter/webapi-client";
import { Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import { DocEditor } from "#/core/apps/docs/component/editor";
import { entityLinkStd } from "#/core/common/entity-link";
import { EntityLocationMapSection } from "#/core/common/sub/locations/component/entity-location-map-section";
import { LocationsEditor } from "#/core/common/sub/locations/component/locations-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { GlobalError } from "#/core/infra/component/errors";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import { EntityPanel } from "#/core/infra/component/layout/entity-panel";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "#/core/infra/errors.server";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import type { StrataHandle } from "#/core/infra/strata/strata-handle";
import { strataEntityLabel } from "#/core/infra/strata/strata-entity-label";

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
  strata: { size: "B", grow: true } satisfies StrataHandle,
  label: strataEntityLabel("Doc"),
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

    return {
      doc: result.doc,
      note: result.note,
      tags: result.tags,
      location: result.location ?? null,
      publishEntity: result.publish_entity ?? null,
      owner: result.owner,
      accessStatus: result.access_status ?? null,
      allTags: allTags.tags,
      dirId,
    };
  } catch (error) {
    handleLoaderApiError(error);
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
        return redirect(`/app/workspace/apps/docs/${dirId}`);
      }

      case "remove": {
        await apiClient.docs.docRemove({
          ref_id: docId,
        });
        return redirect(`/app/workspace/apps/docs/${dirId}`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/apps/docs/${dirId}/doc/${docId}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/apps/docs/${dirId}/doc/${docId}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/apps/docs/${dirId}/doc/${docId}`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function DocInFolder() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.doc.archived &&
    accessStatusAllowsWriterOrAbove(loaderData.accessStatus);

  return (
    <EntityPanel
      kind="leaf"
      key={`doc-${loaderData.doc.ref_id}`}
      entityType={NamedEntityTag.DOC}
      entityRefId={loaderData.doc.ref_id}
      fakeKey={`doc-${loaderData.doc.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.doc.archived}
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
      accessable
      accessOwner={loaderData.owner}
      accessStatus={loaderData.accessStatus}
      returnLocation={`/app/workspace/apps/docs/${loaderData.dirId}`}
      forgetReturnLocation="/app/workspace/apps/docs/root-redirect"
      actions={
        <SectionActions
          id="docs-doc"
          topLevelInfo={topLevelInfo}
          inputsEnabled={navigation.state === "idle"}
          actions={[
            NavSingle({
              id: "docs-doc-settings",
              text: "Settings",
              link: `/app/workspace/apps/docs/${loaderData.dirId}/doc/${loaderData.doc.ref_id}/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock>
        <GlobalError actionResult={actionData} />
        <SectionCard title="Doc">
          <DocEditor
            initialDoc={loaderData.doc}
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
            parentDirRefId={loaderData.doc.parent_dir_ref_id}
            rightOfName={
              // Tags and locations keep their regular size; the name takes
              // the rest of the line.
              <Stack
                direction="row"
                spacing={1}
                sx={{ minWidth: 0, flex: "0 1 28rem" }}
              >
                <TagsEditor
                  name="tags"
                  allTags={loaderData.allTags}
                  defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
                  inputsEnabled={inputsEnabled}
                  owner={entityLinkStd(
                    NamedEntityTag.DOC,
                    loaderData.doc.ref_id,
                  )}
                />
                <LocationsEditor
                  name="locations"
                  linkedLocation={loaderData.location}
                  inputsEnabled={inputsEnabled}
                  entityOwnerRefId={loaderData.owner?.ref_id}
                  owner={entityLinkStd(
                    NamedEntityTag.DOC,
                    loaderData.doc.ref_id,
                  )}
                />
              </Stack>
            }
          />
        </SectionCard>
        <EntityLocationMapSection location={loaderData.location} />
      </NestingAwareBlock>

      <NestedOutlet />
    </EntityPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/apps/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find doc #${params.docId}!`,
    error: (params) =>
      `There was an error loading doc #${params.docId}! Please try again!`,
  },
);
