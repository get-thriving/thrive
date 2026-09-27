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
import { ChoreStackPropertiesEditor } from "@jupiter/core/apps/chores/component/stack-properties-editor";
import { PeriodTag } from "@jupiter/core/common/component/period-tag";
import { sortChoresNaturally } from "@jupiter/core/apps/chores/root";
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

    const result = await apiClient.chores.choreStackLoadPublic({
      external_id: externalId,
    });

    return {
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.CHORE_STACK,
        name: result.chore_stack.name,
        note: result.note,
        dateModified: result.chore_stack.last_modified_time,
      }),
      choreStack: result.chore_stack,
      chores: result.chores,
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

export default function PublishedChoreStack() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const sortedChores = sortChoresNaturally(loaderData.chores);
  const allAspects = loaderData.aspect ? [loaderData.aspect] : [];
  const allChapters = loaderData.chapter ? [loaderData.chapter] : [];
  const allGoals = loaderData.goal ? [loaderData.goal] : [];

  return (
    <LeafPanel
      key={`published-chore-stack-${loaderData.choreStack.ref_id}`}
      fakeKey={`published-chore-stack-${loaderData.choreStack.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <ChoreStackPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={null}
        allAspects={allAspects}
        allChapters={allChapters}
        allGoals={allGoals}
        allMilestones={[]}
        allChores={loaderData.chores}
        chores={loaderData.chores}
        allTags={loaderData.tags}
        tags={loaderData.tags}
        allContacts={loaderData.contacts}
        contacts={loaderData.contacts}
        location={loaderData.location}
        inputsEnabled={false}
        choreStack={loaderData.choreStack}
        aspect={loaderData.aspect}
        chapter={loaderData.chapter}
        goal={loaderData.goal}
      />

      <SectionCard title="Chores">
        <EntityStack>
          {sortedChores.map((chore) => (
            <EntityCard
              key={`chore-${chore.ref_id}`}
              entityId={`chore-${chore.ref_id}`}
            >
              <EntityNameComponent name={chore.name} />
              <PeriodTag period={chore.gen_params.period} />
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
    `Could not find published chore stack ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published chore stack ${params.externalId}! Please try again!`,
});
