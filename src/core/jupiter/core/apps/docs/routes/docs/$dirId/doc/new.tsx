import { FormControl } from "@mui/material";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useLoaderData, useNavigation } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";

import { DocEditor } from "#/core/apps/docs/component/editor";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { handleLoaderApiError } from "#/core/infra/errors.server";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

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
    handleLoaderApiError(error);
  }

  return { parentDirRefId: dirId, dirId };
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
      returnLocation={`/app/workspace/apps/docs/${dirId}`}
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
  (params) => `/app/workspace/apps/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find the folder for this new doc!`,
    error: () => `There was an error creating the document! Please try again!`,
  },
);
