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
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { AspectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.object({
  aspect: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });

  const slackTaskSettingsResponse =
    await apiClient.pushIntegrations.slackTaskLoadSettings({});

  return json({
    generationAspect: slackTaskSettingsResponse.generation_aspect,
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    if (form.aspect === undefined) {
      throw new Error("Invalid application state");
    }

    await apiClient.pushIntegrations.slackTaskChangeGenerationAspect({
      generation_aspect_ref_id: form.aspect,
    });

    return redirect(`/app/workspace/push-integrations/slack-tasks/settings`);
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

export default function SlackTasksSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="slack-tasks/settings"
      fakeKey={"slack-tasks/settings"}
      returnLocation="/app/workspace/push-integrations/slack-tasks"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <SectionCard
          title="Generation Aspect"
          actions={
            <SectionActions
              id="slack-task-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Change Generation Aspect",
                  value: "update",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <FormControl fullWidth>
            <AspectSelect
              name="aspect"
              label="Aspect"
              inputsEnabled={inputsEnabled}
              disabled={false}
              allAspects={loaderData.allAspects}
              defaultValue={loaderData.generationAspect.ref_id}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/generation_aspect_ref_id"
            />
          </FormControl>
        </SectionCard>
      )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/push-integrations/slack-tasks",
  ParamsSchema,
  {
    error: () =>
      `There was an error upserting Slack task settings! Please try again!`,
  },
);
