import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TodoTaskPropertiesEditor } from "@jupiter/core/todo/components/properties-editor";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.todo.todoTaskLoadPublic({
      external_id: externalId,
    });

    return json({
      todoTask: result.todo_task,
      inboxTask: result.inbox_task,
      note: result.note ?? null,
      aspect: result.aspect,
      chapter: result.chapter ?? null,
      goal: result.goal ?? null,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedTodoTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  return (
    <LeafPanel
      key={`published-todo-task-${loaderData.todoTask.ref_id}`}
      fakeKey={`published-todo-task-${loaderData.todoTask.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <TodoTaskPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={null}
        allAspects={[loaderData.aspect]}
        allChapters={loaderData.chapter ? [loaderData.chapter] : []}
        allGoals={loaderData.goal ? [loaderData.goal] : []}
        allMilestones={[]}
        allTags={loaderData.tags}
        tags={loaderData.tags}
        allContacts={loaderData.contacts}
        contacts={loaderData.contacts}
        inputsEnabled={false}
        todoTask={loaderData.todoTask}
        inboxTask={loaderData.inboxTask}
      />

      <SectionCard title="Note">
        {loaderData.note ? (
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={false}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No note.
          </Typography>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published todo task ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published todo task ${params.externalId}! Please try again!`,
});
