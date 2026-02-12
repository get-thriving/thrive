import type {
  JournalFindResultEntry,
  JournalStats,
  Tag,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import { sortJournalsNaturally } from "@jupiter/core/journals/root";
import { DocsHelpSubject, TagNamespace } from "@jupiter/webapi-client";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { JournalStack } from "@jupiter/core/journals/component/stack";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  FilterManyOptions,
  SectionActions,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.journals.journalFind({
    allow_archived: false,
    include_notes: false,
    include_writing_tasks: false,
    include_journal_stats: true,
    include_tags: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.JOURNAL],
  });

  return json({
    entries: response.entries,
    allTags: allTags.tags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Journals() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const entries = loaderData.entries;
  const entriesByRefId = new Map<string, JournalFindResultEntry>();
  for (const entry of entries) {
    entriesByRefId.set(entry.journal.ref_id, entry);
  }
  const sortedJournals = sortJournalsNaturally(
    entries.map((e) => e.journal),
  ).filter((journal) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(journal.ref_id);
    return entry?.tags?.some((tag: Tag) =>
      selectedTagsRefId.includes(tag.ref_id),
    );
  });
  const journalStatsByJournalRefId = new Map<string, JournalStats>();
  for (const entry of entries) {
    journalStatsByJournalRefId.set(entry.journal.ref_id, entry.journal_stats!);
  }
  const journalTagsByJournalRefId = new Map<string, Array<Tag>>();
  for (const entry of entries) {
    journalTagsByJournalRefId.set(entry.journal.ref_id, entry.tags ?? []);
  }

  return (
    <TrunkPanel
      key={"journals"}
      createLocation="/app/workspace/journals/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="journals"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
            NavSingle({
              text: "Settings",
              link: `/app/workspace/journals/settings`,
              icon: <TuneIcon />,
            }),
          ]}
        />
      }
    >
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeaf}
      >
        {sortedJournals.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no journals to show. You can create a new journal."
            newEntityLocations="/app/workspace/journals/new"
            helpSubject={DocsHelpSubject.JOURNALS}
          />
        )}

        <JournalStack
          topLevelInfo={topLevelInfo}
          journals={sortedJournals}
          journalStatsByJournalRefId={journalStatsByJournalRefId}
          journalTagsByJournalRefId={journalTagsByJournalRefId}
        />
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the journals! Please try again!`,
});
