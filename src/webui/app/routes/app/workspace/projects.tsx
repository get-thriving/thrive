import type {
  ProjectFindResultEntry,
  Contact,
  Goal,
  ProjectMilestone,
  ProjectStats,
  Tag,
} from "@jupiter/webapi-client";
import { WorkspaceFeature, DocsHelpSubject } from "@jupiter/webapi-client";
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
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import {
  bigPlanFindEntryToParent,
  sortProjectsNaturally,
} from "@jupiter/core/projects/root";
import type { ProjectParent } from "@jupiter/core/projects/root";
import { ProjectStack } from "@jupiter/core/projects/component/stack";
import { ProjectTimelineBigScreen } from "@jupiter/core/projects/component/timeline-big-screen";
import { ProjectTimelineSmallScreen } from "@jupiter/core/projects/component/timeline-small-screen";
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
    include_aspects: true,
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
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });
  return json({
    bigPlans: response.entries,
    allAspects: summaryResponse.aspects || undefined,
    allTags: allTags.tags as Array<Tag>,
    allContacts: allContacts.contacts as Array<Contact>,
  });
}

enum View {
  TIMELINE_BY_ASPECT_AND_GOAL = "timeline-by-aspect-and-goal",
  TIMELINE_BY_ASPECT = "timeline-by-aspect",
  TIMELINE = "timeline",
  LIST_BY_ASPECT_AND_GOAL = "list-by-aspect-and-goal",
  LIST_BY_ASPECT = "list-by-aspect",
  LIST = "list",
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Projects() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const isBigScreen = useBigScreen();

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const entriesByRefId = new Map<string, ProjectParent>();
  for (const entry of loaderData.bigPlans as Array<ProjectFindResultEntry>) {
    entriesByRefId.set(entry.project.ref_id, bigPlanFindEntryToParent(entry));
  }

  const sortedProjects = sortProjectsNaturally(
    (loaderData.bigPlans as Array<ProjectFindResultEntry>).map(
      (b) => b.project,
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
    ? View.TIMELINE_BY_ASPECT
    : View.TIMELINE;
  const [selectedView, setSelectedView] = useState(initialView);

  const thisYear = DateTime.local({ zone: topLevelInfo.user.timezone }).startOf(
    "year",
  );
  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(
    loaderData.allAspects?.map((p) => [p.ref_id, p]),
  );
  const bigPlanMilestonesByRefId = new Map<string, ProjectMilestone[]>(
    (loaderData.bigPlans as Array<ProjectFindResultEntry>).map((b) => [
      b.project.ref_id,
      b.milestones!,
    ]),
  );
  const bigPlanStatsByRefId = new Map<string, ProjectStats>(
    (loaderData.bigPlans as Array<ProjectFindResultEntry>).map((b) => [
      b.project.ref_id,
      b.stats!,
    ]),
  );

  return (
    <TrunkPanel
      key={"projects"}
      createLocation="/app/workspace/projects/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="projects-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterFewOptionsCompact(
              "View",
              selectedView,
              [
                {
                  value: View.TIMELINE_BY_ASPECT_AND_GOAL,
                  text: "Timeline by Aspect & Goal",
                  icon: <ViewTimelineIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.TIMELINE_BY_ASPECT,
                  text: "Timeline by Aspect",
                  icon: <ViewTimelineIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.TIMELINE,
                  text: "Timeline",
                  icon: <ViewTimelineIcon />,
                },
                {
                  value: View.LIST_BY_ASPECT_AND_GOAL,
                  text: "List by Aspect & Goal",
                  icon: <ViewListIcon />,
                  gatedOn: WorkspaceFeature.LIFE_PLAN,
                },
                {
                  value: View.LIST_BY_ASPECT,
                  text: "List by Aspect",
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
        {sortedProjects.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no projects to show. You can create a new project."
            newEntityLocations="/app/workspace/projects/new"
            helpSubject={DocsHelpSubject.PROJECTS}
          />
        )}

        {sortedProjects.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.TIMELINE_BY_ASPECT_AND_GOAL && (
            <>
              {sortedAspects.map((p) => {
                const aspectProjects = sortedProjects.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id,
                );

                if (aspectProjects.length === 0) {
                  return null;
                }

                const fullAspectName = computeAspectHierarchicalNameFromRoot(
                  p,
                  allAspectsByRefId,
                );

                const goalsByRefId = new Map<string, Goal>();
                for (const bp of aspectProjects) {
                  const goal = entriesByRefId.get(bp.ref_id)?.goal;
                  if (goal) {
                    goalsByRefId.set(goal.ref_id, goal);
                  }
                }
                const sortedGoals = Array.from(goalsByRefId.values()).sort(
                  (a, b) => a.name.localeCompare(b.name),
                );
                const noGoalPlans = aspectProjects.filter(
                  (bp) => !entriesByRefId.get(bp.ref_id)?.goal,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullAspectName} size="large" />
                    {sortedGoals.map((goal) => {
                      const goalProjects = aspectProjects.filter(
                        (bp) =>
                          entriesByRefId.get(bp.ref_id)?.goal?.ref_id ===
                          goal.ref_id,
                      );
                      return (
                        <Fragment key={goal.ref_id}>
                          <StandardDivider title={goal.name} size="medium" />
                          {isBigScreen && (
                            <ProjectTimelineBigScreen
                              today={topLevelInfo.today}
                              thisYear={thisYear}
                              bigPlans={goalProjects}
                              bigPlanMilestonesByRefId={
                                bigPlanMilestonesByRefId
                              }
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
                            <ProjectTimelineSmallScreen
                              today={topLevelInfo.today}
                              thisYear={thisYear}
                              bigPlans={goalProjects}
                              bigPlanMilestonesByRefId={
                                bigPlanMilestonesByRefId
                              }
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
                          <ProjectTimelineBigScreen
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
                          <ProjectTimelineSmallScreen
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

        {sortedProjects.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.TIMELINE_BY_ASPECT && (
            <>
              {sortedAspects.map((p) => {
                const theProjects = sortedProjects.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id,
                );

                if (theProjects.length === 0) {
                  return null;
                }

                const fullAspectName = computeAspectHierarchicalNameFromRoot(
                  p,
                  allAspectsByRefId,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullAspectName} size="large" />
                    <>
                      {isBigScreen && (
                        <ProjectTimelineBigScreen
                          today={topLevelInfo.today}
                          thisYear={thisYear}
                          bigPlans={theProjects}
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
                        <ProjectTimelineSmallScreen
                          today={topLevelInfo.today}
                          thisYear={thisYear}
                          bigPlans={theProjects}
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

        {sortedProjects.length > 0 && selectedView === View.TIMELINE && (
          <>
            {isBigScreen && (
              <ProjectTimelineBigScreen
                today={topLevelInfo.today}
                thisYear={thisYear}
                bigPlans={sortedProjects}
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
              <ProjectTimelineSmallScreen
                today={topLevelInfo.today}
                thisYear={thisYear}
                bigPlans={sortedProjects}
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

        {sortedProjects.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.LIST_BY_ASPECT_AND_GOAL && (
            <>
              {sortedAspects.map((p) => {
                const aspectProjects = sortedProjects.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id,
                );

                if (aspectProjects.length === 0) {
                  return null;
                }

                const fullAspectName = computeAspectHierarchicalNameFromRoot(
                  p,
                  allAspectsByRefId,
                );

                const goalsByRefId = new Map<string, Goal>();
                for (const bp of aspectProjects) {
                  const goal = entriesByRefId.get(bp.ref_id)?.goal;
                  if (goal) {
                    goalsByRefId.set(goal.ref_id, goal);
                  }
                }
                const sortedGoals = Array.from(goalsByRefId.values()).sort(
                  (a, b) => a.name.localeCompare(b.name),
                );
                const noGoalPlans = aspectProjects.filter(
                  (bp) => !entriesByRefId.get(bp.ref_id)?.goal,
                );

                return (
                  <Fragment key={p.ref_id}>
                    <StandardDivider title={fullAspectName} size="large" />
                    {sortedGoals.map((goal) => {
                      const goalProjects = aspectProjects.filter(
                        (bp) =>
                          entriesByRefId.get(bp.ref_id)?.goal?.ref_id ===
                          goal.ref_id,
                      );
                      return (
                        <ProjectStack
                          key={goal.ref_id}
                          topLevelInfo={topLevelInfo}
                          label={goal.name}
                          bigPlans={goalProjects}
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
                      <ProjectStack
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

        {sortedProjects.length > 0 &&
          isWorkspaceFeatureAvailable(
            topLevelInfo.workspace,
            WorkspaceFeature.LIFE_PLAN,
          ) &&
          selectedView === View.LIST_BY_ASPECT && (
            <>
              {sortedAspects.map((p) => {
                const theProjects = sortedProjects.filter(
                  (se) =>
                    entriesByRefId.get(se.ref_id)?.aspect?.ref_id === p.ref_id,
                );

                if (theProjects.length === 0) {
                  return null;
                }

                const fullAspectName = computeAspectHierarchicalNameFromRoot(
                  p,
                  allAspectsByRefId,
                );

                return (
                  <ProjectStack
                    key={p.ref_id}
                    topLevelInfo={topLevelInfo}
                    label={fullAspectName}
                    bigPlans={theProjects}
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

        {sortedProjects.length > 0 && selectedView === View.LIST && (
          <ProjectStack
            topLevelInfo={topLevelInfo}
            bigPlans={sortedProjects}
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
  error: () => `There was an error loading the projects! Please try again!`,
});
