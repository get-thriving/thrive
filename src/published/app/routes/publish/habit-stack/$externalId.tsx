import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityCard } from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { HabitStackPropertiesEditor } from "@jupiter/core/apps/habits/component/stack-properties-editor";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { sortHabitsNaturally } from "@jupiter/core/apps/habits/root";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";

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

    const result = await apiClient.habits.habitStackLoadPublic({
      external_id: externalId,
    });

    return {
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.HABIT_STACK,
        name: result.habit_stack.name,
        note: result.note,
        dateModified: result.habit_stack.last_modified_time,
      }),
      habitStack: result.habit_stack,
      habits: result.habits,
      tags: result.tags ?? [],
      contacts: result.contacts ?? [],
      location: result.location ?? null,
      note: result.note ?? null,
      aspect: result.aspect,
      chapter: result.chapter ?? null,
      goal: result.goal ?? null,
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedHabitStack() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const sortedHabits = sortHabitsNaturally(loaderData.habits);
  const allAspects = loaderData.aspect ? [loaderData.aspect] : [];
  const allChapters = loaderData.chapter ? [loaderData.chapter] : [];
  const allGoals = loaderData.goal ? [loaderData.goal] : [];

  return (
    <LeafPanel
      key={`published-habit-stack-${loaderData.habitStack.ref_id}`}
      fakeKey={`published-habit-stack-${loaderData.habitStack.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <HabitStackPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={null}
        allAspects={allAspects}
        allChapters={allChapters}
        allGoals={allGoals}
        allMilestones={[]}
        allHabits={loaderData.habits}
        habits={loaderData.habits}
        allTags={loaderData.tags}
        tags={loaderData.tags}
        allContacts={loaderData.contacts}
        contacts={loaderData.contacts}
        location={loaderData.location}
        inputsEnabled={false}
        habitStack={loaderData.habitStack}
        aspect={loaderData.aspect}
        chapter={loaderData.chapter}
        goal={loaderData.goal}
      />

      <SectionCard title="Habits">
        <EntityStack>
          {sortedHabits.map((habit) => (
            <EntityCard
              key={`habit-${habit.ref_id}`}
              entityId={`habit-${habit.ref_id}`}
            >
              <EntityNameComponent name={habit.name} />
              <PeriodTag period={habit.gen_params.period} />
            </EntityCard>
          ))}
        </EntityStack>
      </SectionCard>

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

export const ErrorBoundary = makeLeafErrorBoundary("/", ParamsSchema, {
  notFound: (params) =>
    `Could not find published habit stack ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published habit stack ${params.externalId}! Please try again!`,
});
