import type { AspectSummary } from "@jupiter/webapi-client";
import { ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { AspectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
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

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  parentAspectRefId: z.string(),
  name: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });

  return json({
    rootAspect: summaryResponse.root_aspect as AspectSummary,
    allAspects: summaryResponse.aspects as Array<AspectSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.lifePlan.aspectCreate({
      parent_aspect_ref_id: form.parentAspectRefId,
      name: form.name,
    });

    return redirect(
      `/app/workspace/life-plan/aspects/${response.new_aspect.ref_id}`,
    );
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

export default function NewAspect() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="aspects/new"
      isLeaflet
      fakeKey={"aspects/new"}
      returnLocation="/app/workspace/life-plan/aspects"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Aspect"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="aspect-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "aspect-create",
                text: "Create",
                value: "create",
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
            type="text"
            placeholder="Aspect name"
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <AspectSelect
            name="parentAspectRefId"
            label="Parent Aspect"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allAspects={loaderData.allAspects}
            defaultValue={loaderData.rootAspect.ref_id}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/parent_aspect_ref_id"
          />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/aspects",
  ParamsSchema,
  {
    notFound: () => `Could not find the aspect!`,
    error: () => `There was an error creating the aspect! Please try again!`,
  },
);
