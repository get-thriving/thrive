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
  useRouteLoaderData,
  useSearchParams,
} from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import type { loader as habitLoader } from "#/core/apps/habits/routes/habits/habits/$id";
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
import { handleActionApiError } from "#/core/infra/errors.server";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { habitLocation } from "#/core/apps/habits/sub/streak_inactive_period/routes";

const ParamsSchema = z.object({
  id: z.string(),
  periodId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: habitId, periodId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.habits.habitStreakInactivePeriodUpdate({
          ref_id: periodId,
          name: form.name,
          start_date: form.startDate,
          end_date: form.endDate,
        });
        return redirect(habitLocation(habitId, new URL(request.url).search));
      }

      case "archive": {
        await apiClient.habits.habitStreakInactivePeriodArchive({
          ref_id: periodId,
        });
        return redirect(habitLocation(habitId, new URL(request.url).search));
      }

      case "remove": {
        await apiClient.habits.habitStreakInactivePeriodRemove({
          ref_id: periodId,
        });
        return redirect(habitLocation(habitId, new URL(request.url).search));
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function StreakInactivePeriodView() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: habitId, periodId } = useParams();
  const [query] = useSearchParams();
  const habit = useRouteLoaderData<typeof habitLoader>(
    "apps/habits/habits/$id",
  );
  const period = habit?.streakInactivePeriods.find(
    (entry) => entry.ref_id === periodId,
  );

  if (habit === undefined || period === undefined) {
    return (
      <LeafPanel
        key="streak-inactive-period-missing"
        fakeKey="streak-inactive-period-missing"
        isLeaflet
        inputsEnabled={false}
        returnLocation={habitLocation(habitId!, query.toString())}
      >
        <GlobalError actionResult={actionData} />
        <SectionCard title="Inactive Period">
          This inactive period is not in the current streak calendar dates.
        </SectionCard>
      </LeafPanel>
    );
  }

  const canWrite =
    !habit.habit.archived &&
    accessStatusAllowsWriterOrAbove(habit.accessStatus);
  const inputsEnabled =
    navigation.state === "idle" && canWrite && !period.archived;

  return (
    <LeafPanel
      key={`streak-inactive-period-${period.ref_id}`}
      fakeKey={`streak-inactive-period-${period.ref_id}`}
      isLeaflet
      showArchiveAndRemoveButton
      entityArchived={period.archived}
      entityNotEditable={!canWrite}
      inputsEnabled={inputsEnabled}
      returnLocation={habitLocation(habitId!, query.toString())}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="streak-inactive-period-properties"
        title="Inactive Period"
        actions={
          <SectionActions
            id="streak-inactive-period-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
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
            defaultValue={period.name}
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
            defaultValue={period.start_date}
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
            defaultValue={period.end_date}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../../..", ParamsSchema, {
  notFound: (params) => `Could not find inactive period #${params.periodId}!`,
  error: (params) =>
    `There was an error loading inactive period #${params.periodId}! Please try again!`,
});
