import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type {
  ActionFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import {
  SectionCard,
  ActionsPosition,
} from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request, url }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.prm.circleCreate({
      name: form.name,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(url));
    }

    return redirect(
      `/app/workspace/apps/prm/circles/${result.new_circle.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewCircle() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="prm/circles/new"
      fakeKey={"prm/circles/new"}
      returnLocation="/app/workspace/apps/prm/circles"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Circle"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="circle-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "circle-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "circle-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
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
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/prm/circles",
  ParamsSchema,
  {
    notFound: () => `Could not find the circle!`,
    error: () => `There was an error creating the circle! Please try again!`,
  },
);
