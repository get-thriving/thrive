import type {
  JournalFindResultEntry,
  JournalStats,
  Tag,
  ADate,
  Journal,
} from "@jupiter/webapi-client";
import {
  RecurringTaskPeriod,
  DocsHelpSubject,
  TagNamespace,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { Button, Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";
import {
  findJournalsThatAreActive,
  sortJournalsNaturally,
} from "@jupiter/core/journals/root";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { JournalCard } from "@jupiter/core/journals/component/card";
import { JournalStack } from "@jupiter/core/journals/component/stack";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import type { TopLevelInfo } from "@jupiter/core/infra/top-level-context";
import {
  FilterManyOptions,
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

  const journalSettingsResponse = await apiClient.journals.journalLoadSettings(
    {},
  );

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.JOURNAL],
  });

  return json({
    entries: response.entries,
    journalSettings: journalSettingsResponse,
    allTags: allTags.tags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Journals() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const entries = loaderData.entries;
  const entriesByRefId = new Map<string, JournalFindResultEntry>();
  for (const entry of entries) {
    entriesByRefId.set(entry.journal.ref_id, entry);
  }

  const activeJournals = findJournalsThatAreActive(
    entries.map((e) => e.journal),
    topLevelInfo.today,
  );

  const yearJournal = activeJournals.find(
    (j) => j.period === RecurringTaskPeriod.YEARLY,
  );
  const quarterJournal = activeJournals.find(
    (j) => j.period === RecurringTaskPeriod.QUARTERLY,
  );
  const monthJournal = activeJournals.find(
    (j) => j.period === RecurringTaskPeriod.MONTHLY,
  );
  const weekJournal = activeJournals.find(
    (j) => j.period === RecurringTaskPeriod.WEEKLY,
  );
  const dayJournal = activeJournals.find(
    (j) => j.period === RecurringTaskPeriod.DAILY,
  );

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
      returnLocation="/app/workspace"
      actions={[
        NavSingle({
          text: "New",
          icon: <AddIcon />,
          link: "/app/workspace/journals/new",
        }),
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

        <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
          {loaderData.journalSettings.periods.includes(
            RecurringTaskPeriod.YEARLY,
          ) && (
            <CurrentJournal
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.YEARLY}
              topLevelInfo={topLevelInfo}
              journal={yearJournal}
              journalStats={
                yearJournal
                  ? journalStatsByJournalRefId.get(yearJournal.ref_id)
                  : undefined
              }
              label="Yearly Journal"
              tags={
                yearJournal
                  ? (journalTagsByJournalRefId.get(yearJournal.ref_id) ?? [])
                  : []
              }
            />
          )}

          {loaderData.journalSettings.periods.includes(
            RecurringTaskPeriod.QUARTERLY,
          ) && (
            <CurrentJournal
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.QUARTERLY}
              topLevelInfo={topLevelInfo}
              journal={quarterJournal}
              journalStats={
                quarterJournal
                  ? journalStatsByJournalRefId.get(quarterJournal.ref_id)
                  : undefined
              }
              label="Quarterly Journal"
              tags={
                quarterJournal
                  ? (journalTagsByJournalRefId.get(quarterJournal.ref_id) ?? [])
                  : []
              }
            />
          )}

          {loaderData.journalSettings.periods.includes(
            RecurringTaskPeriod.MONTHLY,
          ) && (
            <CurrentJournal
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.MONTHLY}
              topLevelInfo={topLevelInfo}
              journal={monthJournal}
              journalStats={
                monthJournal
                  ? journalStatsByJournalRefId.get(monthJournal.ref_id)
                  : undefined
              }
              label="Monthly Journal"
              tags={
                monthJournal
                  ? (journalTagsByJournalRefId.get(monthJournal.ref_id) ?? [])
                  : []
              }
            />
          )}

          {loaderData.journalSettings.periods.includes(
            RecurringTaskPeriod.WEEKLY,
          ) && (
            <CurrentJournal
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.WEEKLY}
              topLevelInfo={topLevelInfo}
              journal={weekJournal}
              journalStats={
                weekJournal
                  ? journalStatsByJournalRefId.get(weekJournal.ref_id)
                  : undefined
              }
              label="Weekly Journal"
              tags={
                weekJournal
                  ? (journalTagsByJournalRefId.get(weekJournal.ref_id) ?? [])
                  : []
              }
            />
          )}

          {loaderData.journalSettings.periods.includes(
            RecurringTaskPeriod.DAILY,
          ) && (
            <CurrentJournal
              today={topLevelInfo.today}
              period={RecurringTaskPeriod.DAILY}
              topLevelInfo={topLevelInfo}
              journal={dayJournal}
              journalStats={
                dayJournal
                  ? journalStatsByJournalRefId.get(dayJournal.ref_id)
                  : undefined
              }
              label="Daily Journal"
              tags={
                dayJournal
                  ? (journalTagsByJournalRefId.get(dayJournal.ref_id) ?? [])
                  : []
              }
            />
          )}
        </Stack>

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

interface CurrentJournalProps {
  label: string;
  today: ADate;
  period: RecurringTaskPeriod;
  journal?: Journal;
  journalStats?: JournalStats;
  tags: Array<Tag>;
  topLevelInfo: TopLevelInfo;
}

function CurrentJournal(props: CurrentJournalProps) {
  if (!props.journal) {
    return (
      <Button
        variant="outlined"
        component={Link}
        to={`/app/workspace/journals/new?initialPeriod=${props.period}&initialRightNow=${props.today}`}
      >
        Create a {props.label}
      </Button>
    );
  }

  return (
    <JournalCard
      key={`journal-${props.journal.ref_id}`}
      topLevelInfo={props.topLevelInfo}
      journal={props.journal}
      journalStats={props.journalStats}
      tags={props.tags}
      label={props.label}
      showOptions={{
        showSource: false,
        showPeriod: false,
      }}
    />
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the journals! Please try again!`,
});
