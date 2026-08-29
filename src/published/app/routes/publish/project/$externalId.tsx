import type { ProjectLoadResult, InboxTask } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext, useMemo } from "react";
import { z } from "zod";
import { parseParams, parseQuery } from "zodix";
import { sortInboxTasksNaturally } from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import { ProjectPropertiesEditor } from "@jupiter/core/apps/projects/component/properties-editor";
import { ProjectMilestoneStack } from "@jupiter/core/apps/projects/sub/milestones/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";

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

    const result = await apiClient.projects.projectLoadPublic({
      external_id: externalId,
      inbox_task_retrieve_offset: query.inboxTasksRetrieveOffset,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.PROJECT,
        name: result.project.name,
        note: result.note,
        dateModified: result.project.last_modified_time,
      }),
      project: result.project,
      stats: result.stats,
      aspect: result.aspect,
      chapter: result.chapter ?? null,
      goal: result.goal ?? null,
      milestones: result.milestones ?? [],
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      note: result.note ?? null,
      inboxTasks: result.inbox_tasks as Array<InboxTask>,
      inboxTasksTotalCnt: result.inbox_tasks_total_cnt,
      inboxTasksPageSize: result.inbox_tasks_page_size,
      owner: result.owner,
      accessStatus: result.access_status ?? null,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedProject() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const sortedInboxTasks = useMemo(
    () =>
      sortInboxTasksNaturally(loaderData.inboxTasks, {
        dueDateAscending: false,
      }),
    [loaderData.inboxTasks],
  );

  const projectInfo: ProjectLoadResult = {
    project: loaderData.project,
    aspect: loaderData.aspect,
    chapter: loaderData.chapter,
    goal: loaderData.goal,
    milestones: loaderData.milestones,
    inbox_tasks: loaderData.inboxTasks,
    inbox_tasks_total_cnt: loaderData.inboxTasksTotalCnt,
    inbox_tasks_page_size: loaderData.inboxTasksPageSize,
    tags: loaderData.tags,
    contacts: loaderData.contacts,
    note: loaderData.note,
    time_event_blocks: [],
    stats: loaderData.stats,
    publish_entity: null,
    owner: loaderData.owner,
    access_status: loaderData.accessStatus,
  };

  const allAspects = loaderData.aspect ? [loaderData.aspect] : [];
  const allChapters = loaderData.chapter ? [loaderData.chapter] : [];
  const allGoals = loaderData.goal ? [loaderData.goal] : [];

  return (
    <LeafPanel
      key={`published-project-${loaderData.project.ref_id}`}
      fakeKey={`published-project-${loaderData.project.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <ProjectPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={null}
        allAspects={allAspects}
        allChapters={allChapters}
        allGoals={allGoals}
        allMilestones={[]}
        allTags={loaderData.tags}
        tags={loaderData.tags}
        allContacts={loaderData.contacts}
        contacts={loaderData.contacts}
        inputsEnabled={false}
        entityOwner={loaderData.owner}
        project={loaderData.project}
        projectInfo={projectInfo}
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

      <SectionCard title="Milestones">
        {loaderData.milestones.length > 0 && (
          <ProjectMilestoneStack
            milestones={loaderData.milestones}
            linksEnabled={false}
          />
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

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) =>
    `Could not find published project ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published project ${params.externalId}! Please try again!`,
});
