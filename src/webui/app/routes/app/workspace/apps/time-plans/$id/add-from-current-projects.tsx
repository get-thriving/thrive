import type {
  Project,
  ProjectMilestone,
  ProjectStats,
  TimePlan,
  Workspace,
} from "@jupiter/webapi-client";
import {
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { entityLinkRefIdFromWire } from "@jupiter/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityProjectTarget } from "@jupiter/core/apps/time_plans/sub/activity/target-wire";
import FlareIcon from "@mui/icons-material/Flare";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import { FormControl, FormLabel, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import type { DateTime } from "luxon";
import { Fragment, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { aDateToDate } from "@jupiter/core/common/adate";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/apps/life_plan/sub/aspects/root";
import {
  projectFindEntryToParent,
  sortProjectsNaturally,
} from "@jupiter/core/apps/projects/root";
import type { ProjectParent } from "@jupiter/core/apps/projects/root";
import { ProjectStack } from "@jupiter/core/apps/projects/component/stack";
import { ProjectTimelineBigScreen } from "@jupiter/core/apps/projects/component/timeline-big-screen";
import { ProjectTimelineSmallScreen } from "@jupiter/core/apps/projects/component/timeline-small-screen";
import { withTimePlanView } from "@jupiter/core/apps/time_plans/view-mode";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
  FilterFewOptionsCompact,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { TimePlanActivityFeasabilitySelect } from "@jupiter/core/apps/time_plans/sub/activity/component/feasability-select";
import { TimePlanActivitKindSelect } from "@jupiter/core/apps/time_plans/sub/activity/component/kind-select";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  TopLevelInfo,
  TopLevelInfoContext,
} from "@jupiter/core/infra/top-level-context";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

enum View {
  LIST_MERGED = "list-merged",
  LIST_BY_ASPECT = "list-by-aspect",
  TIMELINE_MERGED = "timeline-merged",
  TIMELINE_BY_ASPECT = "timeline-by-aspect",
}

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  targetProjectRefIds: z
    .string()
    .transform((s) => (s === "" ? [] : s.split(","))),
  kind: z.nativeEnum(TimePlanActivityKind),
  feasability: z.nativeEnum(TimePlanActivityFeasability),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("add"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("add-and-override"),
    ...CommonParamsSchema,
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
  });

  try {
    const timePlanResult = await apiClient.timePlans.timePlanLoad({
      ref_id: id,
      allow_archived: false,
      include_targets: false,
      include_completed_nontarget: false,
      include_other_time_plans: false,
    });

    const projectsResult = await apiClient.projects.projectFind({
      allow_archived: false,
      include_tags: false,
      include_notes: false,
      include_milestones: true,
      include_stats: true,
      filter_just_workable: true,
      include_life_plan: true,
      include_inbox_tasks: false,
    });

    return json({
      allAspects: summaryResponse.aspects || undefined,
      timePlan: timePlanResult.time_plan,
      activities: timePlanResult.activities,
      projects: projectsResult.entries,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);
  // The panel was opened from a time plan being looked at one way or another
  // - whatever it does, it hands that back on the way out.
  const timePlanView = new URL(request.url).searchParams;
  const timePlanLocation = withTimePlanView(
    `/app/workspace/apps/time-plans/${id}`,
    timePlanView,
  );

  try {
    switch (form.intent) {
      case "add": {
        await apiClient.timePlans.timePlanAssociateWithProjects({
          ref_id: id,
          project_ref_ids: form.targetProjectRefIds,
          override_existing_dates: false,
          kind: form.kind,
          feasability: form.feasability,
        });

        return redirect(timePlanLocation);
      }

      case "add-and-override": {
        await apiClient.timePlans.timePlanAssociateWithProjects({
          ref_id: id,
          project_ref_ids: form.targetProjectRefIds,
          override_existing_dates: true,
          kind: form.kind,
          feasability: form.feasability,
        });

        return redirect(timePlanLocation);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function TimePlanAddFromCurrentProjects() {
  const { id } = useParams();
  const [query] = useSearchParams();
  const timePlanView = query;
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlan.archived;
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const alreadyIncludedProjectRefIds = new Set(
    loaderData.activities
      .filter((tpa) => isTimePlanActivityProjectTarget(tpa.target))
      .map((tpa) => entityLinkRefIdFromWire(tpa.target)),
  );

  const [targetProjectRefIds, setTargetProjectRefIds] = useState(
    new Set<string>(),
  );

  const sortedProjects = sortProjectsNaturally(
    loaderData.projects.map((e) => e.project),
  ).filter((bp) => !alreadyIncludedProjectRefIds.has(bp.ref_id));

  const entriesByRefId: { [key: string]: ProjectParent } = {};
  for (const entry of loaderData.projects) {
    entriesByRefId[entry.project.ref_id] = projectFindEntryToParent(entry);
  }

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects || []);
  const allAspectsByRefId = new Map(
    loaderData.allAspects?.map((p) => [p.ref_id, p]),
  );
  const projectMilestonesByRefId = new Map<string, ProjectMilestone[]>(
    loaderData.projects.map((bp) => [bp.project.ref_id, bp.milestones || []]),
  );

  const projectStatsByRefId = new Map(
    loaderData.projects.map((b) => [b.project.ref_id, b.stats!]),
  );

  const thisYear = aDateToDate(loaderData.timePlan.right_now).startOf("year");

  const [selectedView, setSelectedView] = useState(
    inferDefaultSelectedView(topLevelInfo.workspace),
  );

  useEffect(() => {
    setSelectedView(inferDefaultSelectedView(topLevelInfo.workspace));
  }, [topLevelInfo]);

  return (
    <LeafPanel
      key={`time-plan-${id}/add-from-current-projects`}
      fakeKey={`time-plan-${id}/add-from-current-projects`}
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanView,
      )}
      returnLocationDiscriminator="add-from-current-projects"
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.LARGE}
      allowedExpansionStates={[
        LeafPanelExpansionState.LARGE,
        LeafPanelExpansionState.FULL,
      ]}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        id="time-plan-current-projects"
        title="Current Projects"
        actions={
          <SectionActions
            id="add-from-current-projects"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Add",
                    value: "add",
                    highlight: true,
                  }),
                  ActionSingle({
                    text: "Add And Override Dates",
                    value: "add-and-override",
                  }),
                ],
              }),
              FilterFewOptionsCompact(
                "View",
                selectedView,
                [
                  {
                    value: View.LIST_MERGED,
                    text: "List Merged",
                    icon: <ViewListIcon />,
                  },
                  {
                    value: View.LIST_BY_ASPECT,
                    text: "List By Aspect",
                    icon: <FlareIcon />,
                    gatedOn: WorkspaceFeature.LIFE_PLAN,
                  },
                  {
                    value: View.TIMELINE_MERGED,
                    text: "Timeline Merged",
                    icon: <ViewTimelineIcon />,
                  },
                  {
                    value: View.TIMELINE_BY_ASPECT,
                    text: "Timeline By Aspect",
                    icon: <ViewTimelineIcon />,
                    gatedOn: WorkspaceFeature.LIFE_PLAN,
                  },
                ],
                (selected) => setSelectedView(selected),
              ),
            ]}
          />
        }
      >
        <Stack
          spacing={2}
          useFlexGap
          direction={isBigScreen ? "row" : "column"}
        >
          <FormControl fullWidth>
            <FormLabel id="kind">Kind</FormLabel>
            <TimePlanActivitKindSelect
              name="kind"
              defaultValue={TimePlanActivityKind.FINISH}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/kind" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="feasability">Feasability</FormLabel>
            <TimePlanActivityFeasabilitySelect
              name="feasability"
              defaultValue={TimePlanActivityFeasability.NICE_TO_HAVE}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/feasability" />
          </FormControl>
        </Stack>

        {selectedView === View.LIST_MERGED && (
          <Fragment>
            <StandardDivider title="All Projects" size="large" />
            <ProjectList
              topLevelInfo={topLevelInfo}
              projects={sortedProjects}
              targetProjectRefIds={targetProjectRefIds}
              projectsByRefId={entriesByRefId}
              onSelected={(it) =>
                setTargetProjectRefIds((itri) =>
                  toggleProjectRefIds(itri, it.ref_id),
                )
              }
            />
          </Fragment>
        )}

        {selectedView === View.LIST_BY_ASPECT && (
          <>
            {sortedAspects.map((p) => {
              const theProjects = sortedProjects.filter(
                (se) => entriesByRefId[se.ref_id]?.aspect?.ref_id === p.ref_id,
              );

              if (theProjects.length === 0) {
                return null;
              }

              const fullAspectName = computeAspectHierarchicalNameFromRoot(
                p,
                allAspectsByRefId,
              );

              return (
                <Fragment key={`aspect-${p.ref_id}`}>
                  <StandardDivider title={fullAspectName} size="large" />

                  <ProjectList
                    topLevelInfo={topLevelInfo}
                    projects={theProjects}
                    targetProjectRefIds={targetProjectRefIds}
                    projectsByRefId={entriesByRefId}
                    onSelected={(it) =>
                      setTargetProjectRefIds((itri) =>
                        toggleProjectRefIds(itri, it.ref_id),
                      )
                    }
                  />
                </Fragment>
              );
            })}
          </>
        )}

        {selectedView === View.TIMELINE_MERGED && (
          <ProjectTimeline
            thisYear={thisYear}
            timePlan={loaderData.timePlan}
            projectStatsByRefId={projectStatsByRefId}
            projectMilestonesByRefId={projectMilestonesByRefId}
            topLevelInfo={topLevelInfo}
            projects={sortedProjects}
            targetProjectRefIds={targetProjectRefIds}
            onSelected={(it) =>
              setTargetProjectRefIds((itri) =>
                toggleProjectRefIds(itri, it.ref_id),
              )
            }
          />
        )}

        {selectedView === View.TIMELINE_BY_ASPECT && (
          <>
            {sortedAspects.map((p) => {
              const theProjects = sortedProjects.filter(
                (se) => entriesByRefId[se.ref_id]?.aspect?.ref_id === p.ref_id,
              );

              if (theProjects.length === 0) {
                return null;
              }

              const fullAspectName = computeAspectHierarchicalNameFromRoot(
                p,
                allAspectsByRefId,
              );

              return (
                <Fragment key={`aspect-${p.ref_id}`}>
                  <StandardDivider title={fullAspectName} size="large" />

                  <ProjectTimeline
                    thisYear={thisYear}
                    timePlan={loaderData.timePlan}
                    topLevelInfo={topLevelInfo}
                    projects={theProjects}
                    projectMilestonesByRefId={projectMilestonesByRefId}
                    projectStatsByRefId={projectStatsByRefId}
                    targetProjectRefIds={targetProjectRefIds}
                    onSelected={(it) =>
                      setTargetProjectRefIds((itri) =>
                        toggleProjectRefIds(itri, it.ref_id),
                      )
                    }
                  />
                </Fragment>
              );
            })}
          </>
        )}

        <input
          name="targetProjectRefIds"
          type="hidden"
          value={Array.from(targetProjectRefIds).join(",")}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params, searchParams) =>
    withTimePlanView(
      `/app/workspace/apps/time-plans/${params.id}`,
      searchParams,
    ),
  ParamsSchema,
  {
    notFound: (params) => `Could not find time plan #${params.id}!`,
    error: (params) =>
      `There was an error loading time plan #${params.id}! Please try again!`,
  },
);

interface ProjectListProps {
  topLevelInfo: TopLevelInfo;
  projects: Array<Project>;
  targetProjectRefIds: Set<string>;
  projectsByRefId: { [key: string]: ProjectParent };
  onSelected: (it: Project) => void;
}

function ProjectList(props: ProjectListProps) {
  return (
    <ProjectStack
      topLevelInfo={props.topLevelInfo}
      projects={props.projects}
      selectedPredicate={(it) => props.targetProjectRefIds.has(it.ref_id)}
      compact
      allowSelect
      showOptions={{
        showDonePct: true,
        showDueDate: true,
        showLifePlan: true,
      }}
      onClick={(it) => {
        props.onSelected(it);
      }}
    />
  );
}

interface ProjectTimelineProps {
  thisYear: DateTime;
  timePlan: TimePlan;
  topLevelInfo: TopLevelInfo;
  projects: Array<Project>;
  projectMilestonesByRefId: Map<string, ProjectMilestone[]>;
  projectStatsByRefId: Map<string, ProjectStats>;
  targetProjectRefIds: Set<string>;
  onSelected: (it: Project) => void;
}

function ProjectTimeline(props: ProjectTimelineProps) {
  const isBigScreen = useBigScreen();

  if (isBigScreen) {
    return (
      <ProjectTimelineBigScreen
        today={props.topLevelInfo.today}
        thisYear={props.thisYear}
        projects={props.projects}
        projectMilestonesByRefId={props.projectMilestonesByRefId}
        projectStatsByRefId={props.projectStatsByRefId}
        dateMarkers={[
          {
            date: props.timePlan.start_date,
            color: "red",
            label: "Start Date",
          },
          {
            date: props.timePlan.end_date,
            color: "blue",
            label: "End Date",
          },
        ]}
        selectedPredicate={(it) => props.targetProjectRefIds.has(it.ref_id)}
        allowSelect
        onClick={(it) => {
          props.onSelected(it);
        }}
      />
    );
  } else {
    return (
      <ProjectTimelineSmallScreen
        today={props.topLevelInfo.today}
        thisYear={props.thisYear}
        projects={props.projects}
        projectMilestonesByRefId={props.projectMilestonesByRefId}
        projectStatsByRefId={props.projectStatsByRefId}
        dateMarkers={[
          {
            date: props.timePlan.start_date,
            color: "red",
            label: "Start Date",
          },
          {
            date: props.timePlan.end_date,
            color: "blue",
            label: "End Date",
          },
        ]}
        selectedPredicate={(it) => props.targetProjectRefIds.has(it.ref_id)}
        allowSelect
        onClick={(it) => {
          props.onSelected(it);
        }}
      />
    );
  }
}

function toggleProjectRefIds(
  projectRefIds: Set<string>,
  newRefId: string,
): Set<string> {
  if (projectRefIds.has(newRefId)) {
    const newProjectRefIds = new Set<string>();
    for (const ri of projectRefIds.values()) {
      if (ri === newRefId) {
        continue;
      }
      newProjectRefIds.add(ri);
    }
    return newProjectRefIds;
  } else {
    const newProjectRefIds = new Set<string>();
    for (const ri of projectRefIds.values()) {
      newProjectRefIds.add(ri);
    }
    newProjectRefIds.add(newRefId);
    return newProjectRefIds;
  }
}

function inferDefaultSelectedView(workspace: Workspace) {
  if (!isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)) {
    return View.TIMELINE_MERGED;
  }

  return View.TIMELINE_BY_ASPECT;
}
