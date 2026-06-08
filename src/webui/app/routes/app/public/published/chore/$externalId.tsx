import type { InboxTask } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams, parseQuery } from "zodix";
import { sortInboxTasksNaturally } from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { ChoreEditor } from "@jupiter/core/chores/component/editor";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

const QuerySchema = z.object({
  inboxTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const query = parseQuery(request, QuerySchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.chores.choreLoadPublic({
      external_id: externalId,
      inbox_task_retrieve_offset: query.inboxTasksRetrieveOffset,
    });

    return json({
      chore: result.chore,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      note: result.note ?? null,
      aspect: result.aspect,
      chapter: result.chapter ?? null,
      goal: result.goal ?? null,
      inboxTasks: result.inbox_tasks as Array<InboxTask>,
      inboxTasksTotalCnt: result.inbox_tasks_total_cnt,
      inboxTasksPageSize: result.inbox_tasks_page_size,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedChore() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const sortedInboxTasks = useMemo(
    () =>
      sortInboxTasksNaturally(loaderData.inboxTasks, {
        dueDateAscending: false,
      }),
    [loaderData.inboxTasks],
  );

  return (
    <LeafPanel
      key={`published-chore-${loaderData.chore.ref_id}`}
      fakeKey={`published-chore-${loaderData.chore.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <ChoreEditor
        chore={loaderData.chore}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.tags}
        allContacts={loaderData.contacts}
        aspect={loaderData.aspect}
        chapter={loaderData.chapter}
        goal={loaderData.goal}
        inputsEnabled={false}
        topLevelInfo={topLevelInfo}
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

      <SectionCard title="Inbox Tasks">
        {sortedInboxTasks.length > 0 && (
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
            }}
            inboxTasks={sortedInboxTasks}
            linksEnabled={false}
            withPages={{
              retrieveOffsetParamName: "inboxTasksRetrieveOffset",
              totalCnt: loaderData.inboxTasksTotalCnt,
              pageSize: loaderData.inboxTasksPageSize,
            }}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) => `Could not find published chore ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published chore ${params.externalId}! Please try again!`,
});
