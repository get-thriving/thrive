import type { AspectSummary } from "@jupiter/webapi-client";
import { ApiError, WorkspaceFeature } from "@jupiter/webapi-client";
import { FormControl } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { AspectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.object({
  aspect: z.string(),
});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });

  const metricSettingsResponse = await apiClient.metrics.metricLoadSettings({});

  return json({
    collectionAspect: metricSettingsResponse.collection_aspect,
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    await apiClient.metrics.metricChangeCollectionAspect({
      collection_aspect_ref_id: form.aspect,
    });

    return redirect(`/app/workspace/metrics`);
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

export default function MetricsSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <BranchPanel
      key={"metrics/settings"}
      returnLocation="/app/workspace/metrics"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <SectionCard
          id="metrics-settings"
          title="Collection Aspect"
          actions={
            <SectionActions
              id="metrics-settings-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Save",
                  value: "change",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <FormControl fullWidth>
            <AspectSelect
              name="aspect"
              label="Collection Aspect"
              inputsEnabled={inputsEnabled}
              disabled={false}
              allAspects={loaderData.allAspects}
              defaultValue={loaderData.collectionAspect.ref_id}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/collection_aspect_ref_id"
            />
          </FormControl>
        </SectionCard>
      )}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/metrics",
  ParamsSchema,
  {
    notFound: () => `Could not find the metrics settings!`,
    error: () =>
      `There was an error loading the metrics settings! Please try again!`,
  },
);
