import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type {
  ActionFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { habitLocation } from "#/core/apps/habits/sub/streak_inactive_period/routes";

const ParamsSchema = z.object({
  id: z.string(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: habitId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    await apiClient.habits.habitStreakInactivePeriodCreate({
      habit_ref_id: habitId,
      name: form.name,
      start_date: form.startDate,
      end_date: form.endDate,
    });

    return redirect(habitLocation(habitId, new URL(request.url).search));
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function StreakInactivePeriodNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: habitId } = useParams();
  const [query] = useSearchParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="streak-inactive-periods/new"
      isLeaflet
      fakeKey="streak-inactive-periods/new"
      returnLocation={habitLocation(habitId!, query.toString())}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="streak-inactive-period-new"
        title="Mark Range Inactive"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="streak-inactive-period-new"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="inactive-name">Name</InputLabel>
          <OutlinedInput
            id="inactive-name"
            name="name"
            label="Name"
            required
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="inactive-start-date" shrink>
            Start
          </InputLabel>
          <OutlinedInput
            id="inactive-start-date"
            name="startDate"
            label="Start"
            type="date"
            notched
            required
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel htmlFor="inactive-end-date" shrink>
            End
          </InputLabel>
          <OutlinedInput
            id="inactive-end-date"
            name="endDate"
            label="End"
            type="date"
            notched
            required
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error marking a range inactive! Please try again!`,
});
