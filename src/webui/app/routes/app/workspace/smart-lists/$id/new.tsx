import { ApiError } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Switch,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { useContext } from "react";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CreateFormSchema = z.object({
  name: z.string(),
  isDone: CheckboxAsString,
  url: z
    .string()
    .transform((s) => (s === "" ? undefined : s))
    .optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const result = await apiClient.smartLists.smartListLoad({
    ref_id: id,
    include_item_tags_and_notes: false,
    allow_archived: true,
    allow_archived_items: false,
    allow_archived_tags: false,
  });

  return json({
    smartList: result.smart_list,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.smartLists.smartListItemCreate({
      smart_list_ref_id: id,
      name: form.name,
      is_done: form.isDone,
      url: form.url,
    });

    return redirect(
      `/app/workspace/smart-lists/${id}/${response.new_smart_list_item.ref_id}`,
    );
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

export default function NewSmartListItem() {
  const { id } = useParams();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key={`smart-list-${id}/new`}
      fakeKey={`smart-list-${id}/new`}
      returnLocation={`/app/workspace/smart-lists/${id}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Smart List Item"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="smart-list-item-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "smart-list-item-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!inputsEnabled}
            defaultValue={""}
          />

          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <FormControlLabel
            control={<Switch name="isDone" readOnly={!inputsEnabled} />}
            label="Is Done"
          />
          <FieldError actionResult={actionData} fieldName="/is_done" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="url">Url [Optional]</InputLabel>
          <OutlinedInput label="Url" name="url" readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/url" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/smart-lists/${params.id}`,
  ParamsSchema,
  {
    notFound: () => `Could not find the smart list item!`,
    error: () =>
      `There was an error creating the smart list item! Please try again!`,
  },
);
