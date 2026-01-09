import {
  ApiError,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
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
import { PartialDateSelect } from "@jupiter/core/life_plan/component/partial-date-select";
import { ProjectSelect } from "#/core/life_plan/sub/aspects/component/select";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  name: z.string(),
  project: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_milestones: true,
  });
  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
    allMilestones: summaryResponse.milestones as MilestoneSummary[],
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
    rootProject: summaryResponse.root_project as ProjectSummary,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const response = await apiClient.lifePlan.chapterCreate({
      name: form.name,
      project_ref_id: form.project,
      start_date: form.startDate,
      end_date: form.endDate,
    });

    return redirect(
      `/app/workspace/life-plan/chapters/${response.new_chapter.ref_id}`,
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

export default function NewChapter() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="chapters/new"
      fakeKey={"chapters/new"}
      isLeaflet
      returnLocation="/app/workspace/life-plan/chapters"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Chapter"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="chapter-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "chapter-create",
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
            placeholder="Chapter name"
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
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="startDate">Start Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="startDate"
            initialDate={null}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="endDate">End Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="endDate"
            initialDate={null}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/chapters",
  ParamsSchema,
  {
    notFound: () => `Could not find the chapter!`,
    error: () => `There was an error creating the chapter! Please try again!`,
  },
);
