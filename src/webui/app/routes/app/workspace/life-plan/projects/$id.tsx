import type { ProjectSummary, Tag } from "@jupiter/webapi-client";
import { ApiError, NoteNamespace, TagNamespace } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { isRootProject } from "#/core/life_plan/sub/aspects/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { ProjectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";

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
    parentProjectRefId: z.string().optional(),
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
  });

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.PROJECT],
    });

    const response = await apiClient.lifePlan.projectLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      rootProject: summaryResponse.root_project as ProjectSummary,
      allProjects: summaryResponse.projects as Array<ProjectSummary>,
      project: response.project,
      tags: response.tags,
      note: response.note,
      allTags: allTags.tags,
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
        await apiClient.lifePlan.projectUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          parent_project_ref_id: {
            should_change: form.parentProjectRefId !== undefined,
            value: form.parentProjectRefId ?? null,
          },
        });

        return redirect(`/app/workspace/life-plan/projects/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.PROJECT,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/life-plan/projects/${id}`);
      }

      case "archive": {
        await apiClient.lifePlan.projectArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/projects`);
      }

      case "remove": {
        await apiClient.lifePlan.projectRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/projects`);
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

export default function Project() {
  const loaderData = useLoaderDataForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.project.archived;

  const parentProject = loaderData.allProjects.find(
    (project) => project.ref_id === loaderData.project.parent_project_ref_id,
  );
  const [selectedProject, setSelectedProject] = useState(
    parentProject === undefined
      ? loaderData.rootProject.ref_id
      : parentProject.ref_id,
  );

  useEffect(() => {
    const parentProject = loaderData.allProjects.find(
      (project) => project.ref_id === loaderData.project.parent_project_ref_id,
    );
    setSelectedProject(
      parentProject === undefined
        ? loaderData.rootProject.ref_id
        : parentProject.ref_id,
    );
  }, [loaderData]);

  return (
    <LeafPanel
      key={`project-${loaderData.project.ref_id}`}
      isLeaflet
      fakeKey={`projects-${loaderData.project.ref_id}`}
      showArchiveAndRemoveButton={!isRootProject(loaderData.project)}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.project.archived}
      returnLocation="/app/workspace/life-plan/projects"
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="project-properties"
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
        <Stack direction="row" spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.project.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              label={null}
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag: Tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.PROJECT}
              sourceEntityRefId={loaderData.project.ref_id}
            />
          </FormControl>
        </Stack>

        {!isRootProject(loaderData.project) && (
          <FormControl fullWidth>
            <ProjectSelect
              name="parentProjectRefId"
              label="Parent Project"
              inputsEnabled={inputsEnabled}
              disabled={false}
              allProjects={loaderData.allProjects}
              value={selectedProject}
              onChange={setSelectedProject}
            />

            <FieldError
              actionResult={actionData}
              fieldName="/parent_project_ref_id"
            />
          </FormControl>
        )}
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="project-note"
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
          <>
            <EntityNoteEditor
              initialNote={loaderData.note}
              inputsEnabled={inputsEnabled}
            />
          </>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/projects",
  ParamsSchema,
  {
    notFound: (params) => `Could not find project with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading project with ID ${params.id}! Please try again!`,
  },
);
