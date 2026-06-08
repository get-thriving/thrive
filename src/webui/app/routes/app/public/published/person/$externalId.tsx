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
import { PersonEditor } from "@jupiter/core/prm/sub/person/component/editor";
import { OccasionStack } from "@jupiter/core/prm/sub/person/sub/occasion/components/stack";

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

    const result = await apiClient.prm.personLoadPublic({
      external_id: externalId,
    });

    return json({
      person: result.person,
      contact: result.contact,
      tags: result.tags ?? [],
      circles: result.circles ?? [],
      circleRefIds: result.circle_ref_ids ?? [],
      occasions: result.occasions ?? [],
      occasionTagsByRefId: result.occasion_tags_by_ref_id ?? {},
      note: result.note ?? null,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedPerson() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const {
    person,
    contact,
    tags,
    circles,
    circleRefIds,
    occasions,
    occasionTagsByRefId,
    note,
  } = loaderData;

  return (
    <LeafPanel
      key={`published-person-${person.ref_id}`}
      fakeKey={`published-person-${person.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <SectionCard title="Properties">
        <PersonEditor
          person={person}
          contact={contact}
          tags={tags}
          allTags={tags}
          allCircles={circles}
          circleRefIds={circleRefIds}
          maxCirclesPerPerson={3}
          inputsEnabled={false}
          topLevelInfo={topLevelInfo}
        />
      </SectionCard>

      <SectionCard title="Occasions">
        <OccasionStack
          occasions={occasions}
          occasionTagsByRefId={occasionTagsByRefId}
          linksEnabled={false}
        />
      </SectionCard>

      <SectionCard title="Note">
        {note ? (
          <EntityNoteEditor initialNote={note} inputsEnabled={false} />
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
  notFound: (params) => `Could not find published person ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published person ${params.externalId}! Please try again!`,
});
