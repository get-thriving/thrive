import type {
  BigPlanFindResultEntry,
  Contact,
  Goal,
  BigPlanMilestone,
  BigPlanStats,
  Tag,
} from "@jupiter/webapi-client";
import {
  WorkspaceFeature,
  DocsHelpSubject,
  TagNamespace,
} from "@jupiter/webapi-client";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { Fragment, useContext, useState } from "react";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  computeProjectHierarchicalNameFromRoot,
  sortProjectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import {
  bigPlanFindEntryToParent,
  sortBigPlansNaturally,
} from "@jupiter/core/big_plans/root";
import type { BigPlanParent } from "@jupiter/core/big_plans/root";
import { BigPlanStack } from "@jupiter/core/big_plans/component/stack";
import { BigPlanTimelineBigScreen } from "@jupiter/core/big_plans/component/timeline-big-screen";
import { BigPlanTimelineSmallScreen } from "@jupiter/core/big_plans/component/timeline-small-screen";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
  });
  const response = await apiClient.bigPlans.bigPlanFind({
    allow_archived: false,
    include_tags: true,
    include_life_plan: true,
    include_milestones: true,
    include_stats: true,
    include_inbox_tasks: false,
    include_notes: false,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.BIG_PLAN],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });
  return json({
    bigPlans: response.entries,
    allProjects: summaryResponse.projects || undefined,
    allTags: allTags.tags as Array<Tag>,
    allContacts: allContacts.contacts as Array<Contact>,
  });
}

enum View {
  TIMELINE_BY_PROJECT_AND_GOAL = "timeline-by-project-and-goal",
  TIMELINE_BY_PROJECT = "timeline-by-project",
  TIMELINE = "timeline",
  LIST_BY_PROJECT_AND_GOAL = "list-by-project-and-goal",
  LIST_BY_PROJECT = "list-by-project",
  LIST = "list",
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function BigPlans() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const isBigScreen = useBigScreen();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const entriesByRefId = new Map<string, BigPlanParent>();
  for (const entry of loaderData.bigPlans as Array<BigPlanFindResultEntry>) {
    entriesByRefId.set(entry.big_plan.ref_id, bigPlanFindEntryToParent(entry));
  }

  const sortedBigPlans = sortBigPlansNaturally(
    (loaderData.bigPlans as Array<BigPlanFindResultEntry>).map(
      (b) => b.big_plan,
    ),
  ).filter((bp) => {
    const entry = entriesByRefId.get(bp.ref_id);
    const tagsOk =
      selectedTagsRefId.length === 0 ||
      entry?.tags?.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id));
    const contactsOk =
      selectedContactsRefId.length === 0 ||
      entry?.contacts?.some((contact: Contact) =>
        selectedContactsRefId.includes(contact.ref_id),
      );
    return tagsOk && contactsOk;
  });

  const topLevelInfo = useContext(TopLevelInfoContext);

  const initialView = isWorkspaceFeatureAvailable(
    topLevelInfo.workspace,
    WorkspaceFeature.LIFE_PLAN,
  )
    ? View.TIMELINE_BY_PROJECT
    : View.TIMELINE;
  const [selectedView, setSelectedView] = useState(initialView);

  const thisYear = DateTime.local({ zone: topLevelInfo.user.timezone }).startOf(
    "year",
  );
  const sortedProjects = sortProjectsByTreeOrder(loaderData.allProjects || []);
  const allProjectsByRefId = new Map(
    loaderData.allProjects?.map((p) => [p.ref_id, p]),
  );
  const bigPlanMilestonesByRefId = new Map<string, BigPlanMilestone[]>(
    (loaderData.bigPlans as Array<BigPlanFindResultEntry>).map((b) => [
      b.big_plan.ref_id,
      b.milestones!,
    ]),
  );
  const bigPlanStatsByRefId = new Map<string, BigPlanStats>(
    (loaderData.bigPlans as Array<BigPlanFindResultEntry>).map((b) => [
      b.big_plan.ref_id,
      b.stats!,
    ]),
  );

  return (
    <TrunkPanel
      key={"big-plans"}
      createLocation="/app/workspace/big-plans/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="big-plans-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterFewOptionsCompact(
              "View",
              selectedView,
              [
                {
                  value: View.TIMELINE_BY_PROJECT_AND_GOAL,
                  text: "Timeline by Project & Goal",
                  icon: <ViewTimelineIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.TIMELINE_BY_PROJECT,
                  text: "Timeline by Project",
                  icon: <ViewTimelineIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.TIMELINE,
                  text: "Timeline",
                  icon: <ViewTimelineIcon />,
                },
                {
                  value: View.LIST_BY_PROJECT_AND_GOAL,
                  text: "List by Project & Goal",
                  icon: <ViewListIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.LIST_BY_PROJECT,
                  text: "List by Project",
                  icon: <ViewListIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                { value: View.LIST, text: "List", icon: <ViewListIcon /> },
              ],
              (selected) => setSelectedView(selected),
            ),
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
            FilterManyOptions(
              "Contacts",
              loaderData.allContacts.map((contact) => ({
                value: contact.ref_id,
                text: contact.name,
              })),
              setSelectedContactsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        {sortedBigPlans.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no big plans to show. You can create a new big plan."
            newEntityLocations="/app/workspace/big-plans/new"
            helpSubject={DocsHelpSubject.BIG_PLANS}
          />
        )}

        {sortedBigPlans.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.TIMELINE_BY_PROJECT_AND_GOAL && (
            <>
              {sortedProjects.map((p) => {
                const projectBigPlans = sortedBigPlans.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.project?.ref_id === p.ref_id,
                );

                if (projectBigPlans.length === 0) {
                  return null;
                }

                const fullProjectName = computeProjectHierarchicalNameFromRoot(
                  p,
                  allProjectsByRefId,
                );

                const goalsByRefId = new Map<string, Goal>();
                for (const bp of projectBigPlans) {
                  const goal = entriesByRefId.get(bp.ref_id)?.goal;
                  if (goal) {
                    goalsByRefId.set(goal.ref_id, goal);
                  }
                }
                const sortedGoals = Array.from(goalsByRefId.values()).sort(
                  (a, b) => a.name.localeCompare(b.name),
                );
                const noGoalPlans = projectBigPlans.filter(
                  (bp) => !entriesByRefId.get(bp.ref_id)?.goal,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullProjectName} size="large" />
                    {sortedGoals.map((goal) => {
                      const goalBigPlans = projectBigPlans.filter(
                        (bp) =>
                          entriesByRefId.get(bp.ref_id)?.goal?.ref_id ===
                          goal.ref_id,
                      );
                      return (
                        <Fragment key={goal.ref_id}>
                          <StandardDivider title={goal.name} size="medium" />
                          {isBigScreen && (
                            <BigPlanTimelineBigScreen
                              today={topLevelInfo.today}
                              thisYear={thisYear}
                              bigPlans={goalBigPlans}
                              bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                              bigPlanStatsByRefId={bigPlanStatsByRefId}
                              dateMarkers={[
                                {
                                  date: topLevelInfo.today,
                                  color: "red",
                                  label: "Today",
                                },
                              ]}
                            />
                          )}
                          {!isBigScreen && (
                            <BigPlanTimelineSmallScreen
                              today={topLevelInfo.today}
                              thisYear={thisYear}
                              bigPlans={goalBigPlans}
                              bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                              bigPlanStatsByRefId={bigPlanStatsByRefId}
                              dateMarkers={[
                                {
                                  date: topLevelInfo.today,
                                  color: "red",
                                  label: "Today",
                                },
                              ]}
                            />
                          )}
                        </Fragment>
                      );
                    })}
                    {noGoalPlans.length > 0 && (
                      <Fragment>
                        <StandardDivider title="No Goal" size="medium" />
                        {isBigScreen && (
                          <BigPlanTimelineBigScreen
                            today={topLevelInfo.today}
                            thisYear={thisYear}
                            bigPlans={noGoalPlans}
                            bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                            bigPlanStatsByRefId={bigPlanStatsByRefId}
                            dateMarkers={[
                              {
                                date: topLevelInfo.today,
                                color: "red",
                                label: "Today",
                              },
                            ]}
                          />
                        )}
                        {!isBigScreen && (
                          <BigPlanTimelineSmallScreen
                            today={topLevelInfo.today}
                            thisYear={thisYear}
                            bigPlans={noGoalPlans}
                            bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                            bigPlanStatsByRefId={bigPlanStatsByRefId}
                            dateMarkers={[
                              {
                                date: topLevelInfo.today,
                                color: "red",
                                label: "Today",
                              },
                            ]}
                          />
                        )}
                      </Fragment>
                    )}
                  </Fragment>
                );
              })}
            </>
          )}

        {sortedBigPlans.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.TIMELINE_BY_PROJECT && (
            <>
              {sortedProjects.map((p) => {
                const theBigPlans = sortedBigPlans.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.project?.ref_id === p.ref_id,
                );

                if (theBigPlans.length === 0) {
                  return null;
                }

                const fullProjectName = computeProjectHierarchicalNameFromRoot(
                  p,
                  allProjectsByRefId,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullProjectName} size="large" />
                    <>
                      {isBigScreen && (
                        <BigPlanTimelineBigScreen
                          today={topLevelInfo.today}
                          thisYear={thisYear}
                          bigPlans={theBigPlans}
                          bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                          bigPlanStatsByRefId={bigPlanStatsByRefId}
                          dateMarkers={[
                            {
                              date: topLevelInfo.today,
                              color: "red",
                              label: "Today",
                            },
                          ]}
                        />
                      )}
                      {!isBigScreen && (
                        <BigPlanTimelineSmallScreen
                          today={topLevelInfo.today}
                          thisYear={thisYear}
                          bigPlans={theBigPlans}
                          bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                          bigPlanStatsByRefId={bigPlanStatsByRefId}
                          dateMarkers={[
                            {
                              date: topLevelInfo.today,
                              color: "red",
                              label: "Today",
                            },
                          ]}
                        />
                      )}
                    </>
                  </Fragment>
                );
              })}
            </>
          )}

        {sortedBigPlans.length > 0 && selectedView === View.TIMELINE && (
          <>
            {isBigScreen && (
              <BigPlanTimelineBigScreen
                today={topLevelInfo.today}
                thisYear={thisYear}
                bigPlans={sortedBigPlans}
                bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                bigPlanStatsByRefId={bigPlanStatsByRefId}
                dateMarkers={[
                  {
                    date: topLevelInfo.today,
                    color: "red",
                    label: "Today",
                  },
                ]}
              />
            )}
            {!isBigScreen && (
              <BigPlanTimelineSmallScreen
                today={topLevelInfo.today}
                thisYear={thisYear}
                bigPlans={sortedBigPlans}
                bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                bigPlanStatsByRefId={bigPlanStatsByRefId}
                dateMarkers={[
                  {
                    date: topLevelInfo.today,
                    color: "red",
                    label: "Today",
                  },
                ]}
              />
            )}
          </>
        )}

        {sortedBigPlans.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.LIST_BY_PROJECT_AND_GOAL && (
            <>
              {sortedProjects.map((p) => {
                const projectBigPlans = sortedBigPlans.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.project?.ref_id === p.ref_id,
                );

                if (projectBigPlans.length === 0) {
                  return null;
                }

                const fullProjectName = computeProjectHierarchicalNameFromRoot(
                  p,
                  allProjectsByRefId,
                );

                const goalsByRefId = new Map<string, Goal>();
                for (const bp of projectBigPlans) {
                  const goal = entriesByRefId.get(bp.ref_id)?.goal;
                  if (goal) {
                    goalsByRefId.set(goal.ref_id, goal);
                  }
                }
                const sortedGoals = Array.from(goalsByRefId.values()).sort(
                  (a, b) => a.name.localeCompare(b.name),
                );
                const noGoalPlans = projectBigPlans.filter(
                  (bp) => !entriesByRefId.get(bp.ref_id)?.goal,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullProjectName} size="large" />
                    {sortedGoals.map((goal) => {
                      const goalBigPlans = projectBigPlans.filter(
                        (bp) =>
                          entriesByRefId.get(bp.ref_id)?.goal?.ref_id ===
                          goal.ref_id,
                      );
                      return (
                        <BigPlanStack
                          key={goal.ref_id}
                          topLevelInfo={topLevelInfo}
                          label={goal.name}
                          bigPlans={goalBigPlans}
                          bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                          bigPlanStatsByRefId={bigPlanStatsByRefId}
                          entriesByRefId={entriesByRefId}
                          showOptions={{
                            showDonePct: true,
                            showMilestonesLeft: true,
                            showLifePlan: true,
                            showEisen: true,
                            showDifficulty: true,
                            showActionableDate: true,
                            showDueDate: true,
                            showHandleMarkDone: false,
                            showHandleMarkNotDone: false,
                          }}
                        />
                      );
                    })}
                    {noGoalPlans.length > 0 && (
                      <BigPlanStack
                        topLevelInfo={topLevelInfo}
                        label="No Goal"
                        bigPlans={noGoalPlans}
                        bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                        bigPlanStatsByRefId={bigPlanStatsByRefId}
                        entriesByRefId={entriesByRefId}
                        showOptions={{
                          showDonePct: true,
                          showMilestonesLeft: true,
                          showLifePlan: true,
                          showEisen: true,
                          showDifficulty: true,
                          showActionableDate: true,
                          showDueDate: true,
                          showHandleMarkDone: false,
                          showHandleMarkNotDone: false,
                        }}
                      />
                    )}
                  </Fragment>
                );
              })}
            </>
          )}

        {sortedBigPlans.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.LIST_BY_PROJECT && (
            <>
              {sortedProjects.map((p) => {
                const theBigPlans = sortedBigPlans.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.project?.ref_id === p.ref_id,
                );

                if (theBigPlans.length === 0) {
                  return null;
                }

                const fullProjectName = computeProjectHierarchicalNameFromRoot(
                  p,
                  allProjectsByRefId,
                );

                return (
                  <BigPlanStack
                    key={p.ref_id}
                    topLevelInfo={topLevelInfo}
                    label={fullProjectName}
                    bigPlans={theBigPlans}
                    bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
                    bigPlanStatsByRefId={bigPlanStatsByRefId}
                    entriesByRefId={entriesByRefId}
                    showOptions={{
                      showDonePct: true,
                      showMilestonesLeft: true,
                      showLifePlan: true,
                      showEisen: true,
                      showDifficulty: true,
                      showActionableDate: true,
                      showDueDate: true,
                      showHandleMarkDone: false,
                      showHandleMarkNotDone: false,
                    }}
                  />
                );
              })}
            </>
          )}

        {sortedBigPlans.length > 0 && selectedView === View.LIST && (
          <BigPlanStack
            topLevelInfo={topLevelInfo}
            bigPlans={sortedBigPlans}
            bigPlanMilestonesByRefId={bigPlanMilestonesByRefId}
            bigPlanStatsByRefId={bigPlanStatsByRefId}
            entriesByRefId={entriesByRefId}
            showOptions={{
              showDonePct: true,
              showMilestonesLeft: true,
              showLifePlan: true,
              showEisen: true,
              showDifficulty: true,
              showActionableDate: true,
              showDueDate: true,
              showHandleMarkDone: false,
              showHandleMarkNotDone: false,
            }}
          />
        )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the big plans! Please try again!`,
});
