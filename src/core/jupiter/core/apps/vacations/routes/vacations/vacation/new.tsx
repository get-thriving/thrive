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
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "#/core/infra/component/section-actions";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
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
  startDate: z.string(),
  endDate: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request, url }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.vacations.vacationCreate({
      name: form.name,
      start_date: form.startDate,
      end_date: form.endDate,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(url));
    }

    return redirect(
      `/app/workspace/apps/vacations/vacation/${result.new_vacation.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewVacation() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="vacations/new"
      fakeKey={"vacations/new"}
      returnLocation="/app/workspace/apps/vacations/vacation"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Vacation"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="vacation-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "vacation-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "vacation-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink>
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="endDate" shrink>
            End Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="endDate"
            name="endDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/vacations/vacation",
  ParamsSchema,
  {
    error: () => `There was an error creating the vacation! Please try again!`,
  },
);
