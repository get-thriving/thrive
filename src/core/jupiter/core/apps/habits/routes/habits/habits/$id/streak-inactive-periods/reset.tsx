import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
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

const ResetFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: habitId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, ResetFormSchema);

  try {
    await apiClient.habits.habitStreakInactivePeriodReset({
      habit_ref_id: habitId,
      name: form.name,
    });

    return redirect(habitLocation(habitId, new URL(request.url).search));
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function StreakInactivePeriodReset() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: habitId } = useParams();
  const [query] = useSearchParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="streak-inactive-periods/reset"
      isLeaflet
      fakeKey="streak-inactive-periods/reset"
      returnLocation={habitLocation(habitId!, query.toString())}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="streak-inactive-period-reset"
        title="Reset Streak"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="streak-inactive-period-reset"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Reset Streak",
                value: "reset",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="reset-streak-name">Name</InputLabel>
          <OutlinedInput
            id="reset-streak-name"
            name="name"
            label="Name"
            required
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>
        <Typography variant="body2">
          Marks every day before today as inactive. Today stays open, and the
          recorded colours come back if you archive this period.
        </Typography>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error resetting the streak! Please try again!`,
});
