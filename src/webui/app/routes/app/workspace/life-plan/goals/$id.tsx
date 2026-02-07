import {
  ApiError,
  GoalSummary,
  NoteDomain,
  ProjectSummary,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { ProjectSelect } from "#/core/life_plan/sub/aspects/component/select";
import { GoalSelect } from "#/core/life_plan/sub/goals/components/select";

import { useLoaderDataSafeForAnimation as useLoaderDataForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    project: z.string(),
    parent_goal: z.string().optional().default(""),
  }),
  z.object({
    intent: z.literal("create-note"),
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
    include_goals: true,
  });

  try {
    const response = await apiClient.lifePlan.goalLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      allProjects: summaryResponse.projects as Array<ProjectSummary>,
      rootProject: summaryResponse.root_project as ProjectSummary,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      goal: response.goal,
      note: response.note ?? null,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.lifePlan.goalUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          project_ref_id: {
            should_change: true,
            value: form.project,
          },
          parent_goal_ref_id: {
            should_change: true,
            value: form.parent_goal === "" ? null : form.parent_goal,
          },
        });

        return redirect(`/app/workspace/life-plan/goals/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          domain: NoteDomain.GOAL,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/life-plan/goals/${id}`);
      }

      case "archive": {
        await apiClient.lifePlan.goalArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/goals`);
      }

      case "remove": {
        await apiClient.lifePlan.goalRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/goals`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
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

export default function GoalView() {
  const loaderData = useLoaderDataForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.goal.archived;

  const [selectedProjectRefId, setSelectedProjectRefId] = useState<string>(
    loaderData.goal.project_ref_id,
  );
  const [selectedParentGoalRefId, setSelectedParentGoalRefId] = useState<
    string | null
  >(loaderData.goal.parent_goal_ref_id ?? null);

  const parentGoalCandidates = loaderData.allGoals.filter(
    (g) => g.ref_id !== loaderData.goal.ref_id,
  );

  return (
    <LeafPanel
      key={`goal-${loaderData.goal.ref_id}`}
      isLeaflet
      fakeKey={`goals-${loaderData.goal.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.goal.archived}
      returnLocation="/app/workspace/life-plan/goals"
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="goal-properties"
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
            label="name"
            name="name"
            readOnly={!inputsEnabled}
            defaultValue={loaderData.goal.name}
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
            value={selectedProjectRefId}
            onChange={(newProjectRefId) => {
              setSelectedProjectRefId(newProjectRefId);
              setSelectedParentGoalRefId(null);
            }}
          />
          <FieldError actionResult={actionData} fieldName="/project_ref_id" />
        </FormControl>

        <FormControl fullWidth>
          <GoalSelect
            name="parent_goal"
            label="Parent Goal"
            inputsEnabled={inputsEnabled}
            disabled={false}
            onlyForProject={selectedProjectRefId}
            allGoals={parentGoalCandidates}
            value={selectedParentGoalRefId}
            onChange={(newValue) => setSelectedParentGoalRefId(newValue)}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/parent_goal_ref_id"
          />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="goal-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create Note",
                value: "create-note",
                highlight: false,
                disabled: loaderData.note !== null,
              }),
            ]}
          />
        }
      >
        {loaderData.note && (
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/goals",
  ParamsSchema,
  {
    notFound: () => `Could not find the goal!`,
    error: () => `There was an error loading the goal! Please try again!`,
  },
);
