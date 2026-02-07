import { ApiError, WorkspaceFeature } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { WorkspaceFeatureFlagsEditor } from "@jupiter/core/workspaces/component/feature-flags-editor";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { GlobalPropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { getHosting } from "#/core/universe";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
  }),
  z.object({
    intent: z.literal("change-feature-flags"),
    featureFlags: z.array(z.nativeEnum(WorkspaceFeature)),
  }),
]);

export const handle = {
  displayType: DisplayType.TOOL,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const result = await apiClient.workspaces.workspaceLoad({});

  return json({
    workspace: result.workspace,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  // We do a hard redirect for all actions here, because changing these
  // vary basic properties of the properties, most assuredly will
  // modify topLevelInfo which will need to invalidate all the
  // routes. Since there's some caching over there, we take this
  // simple approach.

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.workspaces.workspaceUpdate({
          name: {
            should_change: true,
            value: form.name,
          },
        });

        return redirectDocument(`/app/workspace/settings`);
      }

      case "change-feature-flags": {
        await apiClient.workspaces.workspaceChangeFeatureFlags({
          feature_flags: form.featureFlags,
        });

        return redirectDocument(`/app/workspace/settings`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body, form.intent));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Settings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const globalProperties = useContext(GlobalPropertiesContext);
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <TrunkPanel key={"settings"} returnLocation="/app/workspace">
      <ToolPanel>
        <GlobalError intent="update" actionResult={actionData} />
        <SectionCard
          id="general"
          title="General"
          actions={
            <SectionActions
              id="general-actions"
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
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.workspace.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        </SectionCard>

        <GlobalError intent="change-feature-flags" actionResult={actionData} />
        <SectionCard
          id="feature-flags"
          title="Feature Flags"
          actions={
            <SectionActions
              id="feature-flags-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Change Feature Flags",
                  value: "change-feature-flags",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <WorkspaceFeatureFlagsEditor
            name="featureFlags"
            inputsEnabled={inputsEnabled}
            featureFlagsControls={topLevelInfo.workspaceFeatureFlagControls}
            defaultFeatureFlags={loaderData.workspace.feature_flags}
            hosting={getHosting(globalProperties.universe)}
          />
        </SectionCard>
      </ToolPanel>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error updating the workspace! Please try again!`,
});
