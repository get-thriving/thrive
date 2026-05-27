import { ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
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
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
});

const CreateFormSchema = z.object({
  name: z.string(),
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

  return json({ dirId });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.docs.dirCreate({
      name: form.name,
      parent_dir_ref_id: dirId,
    });

    return redirect(`/app/workspace/docs/${result.new_dir.ref_id}`);
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

export const handle = {
  displayType: DisplayType.LEAF,
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewDirectory() {
  const actionData = useActionData<typeof action>();
  const { dirId } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key={`docs-${dirId}-dir-new`}
      fakeKey={`docs-${dirId}-dir-new`}
      returnLocation={`/app/workspace/docs/${dirId}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="New Folder"
        actions={
          <SectionActions
            id="docs-dir-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "docs-dir-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="docs-new-dir-name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!inputsEnabled}
            inputProps={{ "aria-labelledby": "docs-new-dir-name" }}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find the parent folder!`,
    error: () => `There was an error creating the folder! Please try again!`,
  },
);
