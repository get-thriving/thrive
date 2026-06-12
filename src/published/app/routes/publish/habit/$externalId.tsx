import type { InboxTask } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DateTime } from "luxon";
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
import { HabitEditor } from "@jupiter/core/habits/component/editor";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

const QuerySchema = z.object({
  inboxTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
  viewOneIncludeStreakMarksEarliestDate: z.string().optional(),
  viewOneIncludeStreakMarksLatestDate: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const query = parseQuery(request, QuerySchema);
    const apiClient = await getGuestApiClient(request);

    let earliestDate = query.viewOneIncludeStreakMarksEarliestDate;
    let latestDate = query.viewOneIncludeStreakMarksLatestDate;
    if (earliestDate === undefined) {
      earliestDate =
        DateTime.now().minus({ days: 90 }).toISODate() ?? undefined;
      latestDate = DateTime.now().toISODate() ?? undefined;
    }

    const result = await apiClient.habits.habitLoadPublic({
      external_id: externalId,
      inbox_task_retrieve_offset: query.inboxTasksRetrieveOffset,
      include_streak_marks_earliest_date: earliestDate,
      include_streak_marks_latest_date: latestDate,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.HABIT,
        name: result.habit.name,
        note: result.note,
        dateModified: result.habit.last_modified_time,
      }),
      habit: result.habit,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      note: result.note ?? null,
      aspect: result.aspect,
      chapter: result.chapter ?? null,
      goal: result.goal ?? null,
      inboxTasks: result.inbox_tasks as Array<InboxTask>,
      inboxTasksTotalCnt: result.inbox_tasks_total_cnt,
      inboxTasksPageSize: result.inbox_tasks_page_size,
      streakMarks: result.streak_marks,
      streakMarkEarliestDate: result.streak_mark_earliest_date,
      streakMarkLatestDate: result.streak_mark_latest_date,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedHabit() {
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
      key={`published-habit-${loaderData.habit.ref_id}`}
      fakeKey={`published-habit-${loaderData.habit.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <HabitEditor
        habit={loaderData.habit}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.tags}
        allContacts={loaderData.contacts}
        aspect={loaderData.aspect}
        chapter={loaderData.chapter}
        goal={loaderData.goal}
        inputsEnabled={false}
        topLevelInfo={topLevelInfo}
        streakMarks={loaderData.streakMarks}
        streakMarkEarliestDate={loaderData.streakMarkEarliestDate}
        streakMarkLatestDate={loaderData.streakMarkLatestDate}
        showStreak
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

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) => `Could not find published habit ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published habit ${params.externalId}! Please try again!`,
});
