import { ApiError } from "@jupiter/webapi-client";
import { FormControl } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseParams } from "zodix";
import { DocEditor } from "@jupiter/core/docs/component/editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);

  try {
    await apiClient.docs.dirLoad({
      ref_id: dirId,
      allow_archived: false,
      filter_ref_ids: null,
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

  return json({ parentDirRefId: dirId, dirId });
}

export const handle = {
  displayType: DisplayType.LEAF,
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewDoc() {
  const navigation = useNavigation();
  const { parentDirRefId, dirId } = useLoaderData<typeof loader>();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key={`docs-${dirId}-doc-new`}
      fakeKey={`docs-${dirId}-doc-new`}
      returnLocation={`/app/workspace/docs/${dirId}`}
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.FULL}
    >
      <SectionCard title="New Doc" actionsPosition={ActionsPosition.BELOW}>
        <FormControl fullWidth>
          <DocEditor
            inputsEnabled={inputsEnabled}
            parentDirRefId={parentDirRefId}
          />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find the folder for this new doc!`,
    error: () => `There was an error creating the document! Please try again!`,
  },
);
