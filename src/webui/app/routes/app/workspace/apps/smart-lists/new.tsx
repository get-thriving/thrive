import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";
import { IconSelector } from "@jupiter/core/infra/component/icon-selector";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { remountOnCreateAnother } from "~/rendering/remount-on-create-another";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  icon: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.smartLists.smartListCreate({
      name: form.name,
      icon: form.icon,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/smart-lists/${result.new_smart_list.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function NewSmartList() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="smart-lists/new"
      fakeKey={"smart-lists/new"}
      returnLocation="/app/workspace/apps/smart-lists"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Smart List"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="smart-list-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "smart-list-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "smart-list-create-and-another",
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

        <FormControl fullWidth>
          <InputLabel id="icon">Icon</InputLabel>
          <IconSelector readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/icon" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export default remountOnCreateAnother(NewSmartList);

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/smart-lists",
  ParamsSchema,
  {
    notFound: () => `Could not find the smart list!`,
    error: () =>
      `There was an error creating the smart list! Please try again!`,
  },
);
