import { ApiError } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
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
import { JournalEditor } from "@jupiter/core/journals/component/editor";
import { allowUserChanges } from "@jupiter/core/journals/source";
import { ShowReport } from "@jupiter/core/report/component/show-report";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { externalId } = parseParams(params, ParamsSchema);
  const apiClient = await getGuestApiClient(request);

  try {
    const result = await apiClient.journals.journalLoadPublic({
      external_id: externalId,
    });

    return json({
      journal: result.journal,
      journalStats: result.journal_stats,
      note: result.note,
      tags: result.tags ?? [],
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

export default function PublishedJournal() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { journal, journalStats, note, tags } = loaderData;

  return (
    <LeafPanel
      key={`published-journal-${journal.ref_id}`}
      fakeKey={`published-journal-${journal.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <JournalEditor
        journal={journal}
        tags={tags}
        allTags={tags}
        inputsEnabled={false}
        corePropertyEditable={allowUserChanges(journal.source)}
        topLevelInfo={topLevelInfo}
      />

      <SectionCard title="Note">
        {note ? (
          <EntityNoteEditor initialNote={note} inputsEnabled={false} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No note.
          </Typography>
        )}
      </SectionCard>

      <SectionCard title="Report">
        <ShowReport
          topLevelInfo={topLevelInfo}
          allAspects={[]}
          allGoals={[]}
          report={journalStats.report}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published journal ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published journal ${params.externalId}! Please try again!`,
});
