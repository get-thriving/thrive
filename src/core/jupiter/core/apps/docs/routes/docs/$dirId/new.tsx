import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "#/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
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
    handleLoaderApiError(error);
  }

  return { dirId };
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

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(`/app/workspace/apps/docs/${result.new_dir.ref_id}`);
  } catch (error) {
    return handleActionApiError(error);
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
      returnLocation={`/app/workspace/apps/docs/${dirId}`}
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
              ActionSingle({
                id: "docs-dir-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
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
  (params) => `/app/workspace/apps/docs/${params.dirId}`,
  ParamsSchema,
  {
    notFound: () => `Could not find the parent folder!`,
    error: () => `There was an error creating the folder! Please try again!`,
  },
);
