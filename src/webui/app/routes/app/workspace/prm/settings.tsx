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
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.object({
  aspect: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });

  const personSettingsResponse = await apiClient.prm.personLoadSettings({});

  return json({
    catchUpAspect: personSettingsResponse.catch_up_aspect,
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

    await apiClient.prm.personChangeCatchUpAspect({
      catch_up_aspect_ref_id: form.aspect,
    });

    return redirect(`/app/workspace/prm/settings`);
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

export default function PersonsSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <BranchPanel
      key={"persons/settings"}
      returnLocation="/app/workspace/prm/persons"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.LIFE_PLAN,
      ) && (
        <SectionCard
          id="persons-settings"
          title="Catch Up Aspect"
          actions={
            <SectionActions
              id="persons-settings-actions"
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
              label="Catch Up Aspect"
              inputsEnabled={inputsEnabled}
              disabled={false}
              allAspects={loaderData.allAspects}
              defaultValue={loaderData.catchUpAspect.ref_id}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/catch_up_aspect_key"
            />
          </FormControl>
        </SectionCard>
      )}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/prm/persons",
  ParamsSchema,
  {
    notFound: () => `Could not find the persons settings!`,
    error: () =>
      `There was an error loading the persons settings! Please try again!`,
  },
);
