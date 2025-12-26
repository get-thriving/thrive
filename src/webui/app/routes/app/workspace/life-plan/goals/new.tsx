import { ApiError, ProjectSummary } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
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
import { ProjectSelect } from "#/core/life_plan/sub/aspects/component/select";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  name: z.string(),
  project: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
  });
  return json({
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    rootProject: summaryResponse.root_project as ProjectSummary,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.lifePlan.goalCreate({
      name: form.name,
      project_ref_id: form.project,
    });

    return redirect(
      `/app/workspace/life-plan/goals/${response.new_goal.ref_id}`,
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

export default function NewGoal() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="goals/new"
      fakeKey={"goals/new"}
      returnLocation="/app/workspace/life-plan"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Goal"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="goal-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "goal-create",
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
            placeholder="Goal name"
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <ProjectSelect
            name="project"
            label="Project"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allProjects={loaderData.allProjects}
            defaultValue={loaderData.rootProject.ref_id}
          />
          <FieldError actionResult={actionData} fieldName="/project_ref_id" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan",
  ParamsSchema,
  {
    notFound: () => `Could not create the goal!`,
    error: () => `There was an error creating the goal! Please try again!`,
  },
);
