import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useNavigation,
  useParams,
} from "react-router";
import { DateTime } from "luxon";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "#/core/infra/create-and-another";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  collectionTime: z.string(),
  value: z.string().transform(parseFloat),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const response = await apiClient.metrics.metricLoad({
    ref_id: id,
    allow_archived: true,
    allow_archived_entries: false,
  });

  return {
    metric: response.metric,
  };
}

export async function action({ params, request, url }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.metrics.metricEntryCreate({
      metric_ref_id: id,
      collection_time: form.collectionTime,
      value: form.value,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(url));
    }

    return redirect(
      `/app/workspace/apps/metrics/${id}/entries/${response.new_metric_entry.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewMetricEntry() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key={`metric-${id}/entries/new`}
      fakeKey={`metric-${id}/entries/new`}
      returnLocation={`/app/workspace/apps/metrics/${loaderData.metric.ref_id}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Metric Entry"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="metric-entry-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "metric-entry-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "metric-entry-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="collectionTime" shrink>
            Collection Time
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="collectionTime"
            defaultValue={DateTime.local({
              zone: topLevelInfo.user.timezone,
            }).toFormat("yyyy-MM-dd")}
            name="collectionTime"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />

          <FieldError actionResult={actionData} fieldName="/collection_time" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="value">Value</InputLabel>
          <OutlinedInput
            type="number"
            inputProps={{ step: "any" }}
            label="Value"
            name="value"
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/value" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/apps/metrics/${params.id}`,
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the metric entry! Please try again!`,
  },
);
