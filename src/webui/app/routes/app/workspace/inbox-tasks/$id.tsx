import type {
  BigPlanSummary,
  ChapterSummary,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
  Tag,
  Contact,
  Workspace,
} from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  InboxTaskSource,
  InboxTaskStatus,
  NoteNamespace,
  TagNamespace,
  TimePlanActivityTarget,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { allowUserChanges } from "@jupiter/core/common/sub/inbox_tasks/source";
import { isInboxTaskCoreFieldEditable } from "@jupiter/core/common/sub/inbox_tasks/root";
import { InboxTaskPropertiesEditor } from "@jupiter/core/common/sub/inbox_tasks/component/properties-editor";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { TimePlanActivityList } from "@jupiter/core/time_plans/sub/activity/component/list";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  source: z.nativeEnum(InboxTaskSource),
  name: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
  isKey: CheckboxAsString,
  project: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  bigPlan: z.string().optional(),
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("mark-done"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("mark-not-done"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("start"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("restart"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("block"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("stop"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("reactivate"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("update"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("create-note"),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    allow_archived: false,
    include_workspace: true,
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
    include_big_plans: true,
  });

  try {
    const result = await apiClient.inboxTasks.inboxTaskLoad({
      ref_id: id,
      allow_archived: true,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.INBOX_TASK],
    });

    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const workspace = summaryResponse.workspace as Workspace;
    let timePlanEntries = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.TIME_PLANS)) {
      const timePlanActivitiesResult =
        await apiClient.timePlans.timePlanActivityFindForTarget({
          allow_archived: true,
          target: TimePlanActivityTarget.INBOX_TASK,
          target_ref_id: id,
        });
      timePlanEntries = timePlanActivitiesResult.entries;
    }

    return json({
      info: result,
      timePlanEntries: timePlanEntries,
      rootProject: summaryResponse.root_project as ProjectSummary,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allProjects: summaryResponse.projects as Array<ProjectSummary>,
      allChapters: summaryResponse.chapters as Array<ChapterSummary>,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
      allBigPlans: summaryResponse.big_plans as Array<BigPlanSummary>,
      tags: result.tags as Array<Tag>,
      allTags: allTags.tags as Array<Tag>,
      contacts: result.contacts as Array<Contact>,
      allContacts: allContacts.contacts as Array<Contact>,
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

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "mark-done":
      case "mark-not-done":
      case "start":
      case "restart":
      case "block":
      case "stop":
      case "reactivate":
      case "update": {
        let status = form.status;
        const corePropertyEditable = isInboxTaskCoreFieldEditable(form.source);

        if (form.intent === "mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (form.intent === "start") {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "restart") {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (form.intent === "stop") {
          status = allowUserChanges(form.source)
            ? InboxTaskStatus.NOT_STARTED
            : InboxTaskStatus.NOT_STARTED_GEN;
        } else if (form.intent === "reactivate") {
          status = allowUserChanges(form.source)
            ? InboxTaskStatus.NOT_STARTED
            : InboxTaskStatus.NOT_STARTED_GEN;
        }

        const result = await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: id,
          name: corePropertyEditable
            ? {
                should_change: true,
                value: form.name,
              }
            : { should_change: false },
          status: {
            should_change: true,
            value: status,
          },
          project_ref_id: {
            should_change: form.project !== undefined,
            value: form.project,
          },
          chapter_ref_id: {
            should_change: form.chapter !== undefined,
            value:
              form.chapter !== undefined && form.chapter !== ""
                ? form.chapter
                : null,
          },
          goal_ref_id: {
            should_change: form.goal !== undefined,
            value:
              form.goal !== undefined && form.goal !== "" ? form.goal : null,
          },
          big_plan_ref_id: {
            should_change: form.bigPlan !== undefined,
            value:
              form.bigPlan !== undefined && form.bigPlan !== "none"
                ? form.bigPlan
                : undefined,
          },
          is_key: corePropertyEditable
            ? {
                should_change: true,
                value: form.isKey,
              }
            : { should_change: false },
          eisen: corePropertyEditable
            ? {
                should_change: true,
                value: form.eisen,
              }
            : { should_change: false },
          difficulty: corePropertyEditable
            ? {
                should_change: true,
                value: form.difficulty,
              }
            : { should_change: false },
          actionable_date: {
            should_change: true,
            value:
              form.actionableDate !== undefined && form.actionableDate !== ""
                ? form.actionableDate
                : undefined,
          },
          due_date: {
            should_change: true,
            value:
              form.dueDate !== undefined && form.dueDate !== ""
                ? form.dueDate
                : undefined,
          },
        });

        if (result.record_score_result) {
          return redirect(`/app/workspace/inbox-tasks`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/inbox-tasks`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.INBOX_TASK,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/inbox-tasks/${id}`);
      }

      case "archive": {
        await apiClient.inboxTasks.inboxTaskArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/inbox-tasks`);
      }

      case "remove": {
        await apiClient.inboxTasks.inboxTaskRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/inbox-tasks`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function InboxTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const info = loaderData.info;
  const inboxTask = loaderData.info.inbox_task;

  const inputsEnabled = navigation.state === "idle" && !inboxTask.archived;

  const corePropertyEditable = isInboxTaskCoreFieldEditable(inboxTask.source);

  const inboxTasksByRefId = new Map();
  inboxTasksByRefId.set(
    loaderData.info.inbox_task.ref_id,
    loaderData.info.inbox_task,
  );

  const timePlanActivities = loaderData.timePlanEntries?.map(
    (entry) => entry.time_plan_activity,
  );
  const timePlansByRefId = new Map();
  if (loaderData.timePlanEntries) {
    for (const entry of loaderData.timePlanEntries) {
      timePlansByRefId.set(entry.time_plan.ref_id, entry.time_plan);
    }
  }

  const timeEventsByRefId = new Map();
  timeEventsByRefId.set(
    `it:${loaderData.info.inbox_task.ref_id}`,
    loaderData.info.time_event_blocks,
  );

  const timeEventEntries = loaderData.info.time_event_blocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      inbox_task: loaderData.info.inbox_task,
      time_events: [block],
    },
  }));
  const sortedTimeEventEntries =
    sortInboxTaskTimeEventsNaturally(timeEventEntries);

  return (
    <LeafPanel
      key={`inbox-task-${inboxTask.ref_id}`}
      fakeKey={`inbox-task-${inboxTask.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={inboxTask.archived}
      entityNotEditable={!corePropertyEditable}
      returnLocation="/app/workspace/inbox-tasks"
    >
      <GlobalError actionResult={actionData} />
      <InboxTaskPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={loaderData.lifePlan}
        rootProject={loaderData.rootProject}
        allProjects={loaderData.allProjects}
        allChapters={loaderData.allChapters}
        allGoals={loaderData.allGoals}
        allMilestones={loaderData.allMilestones}
        allBigPlans={loaderData.allBigPlans}
        allTags={loaderData.allTags}
        tags={loaderData.tags}
        allContacts={loaderData.allContacts}
        contacts={loaderData.contacts}
        inputsEnabled={inputsEnabled}
        inboxTask={inboxTask}
        inboxTaskInfo={info}
        actionData={actionData}
      />

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="inbox-task-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create-note",
                highlight: false,
                disabled: loaderData.info.note !== null,
              }),
            ]}
          />
        }
      >
        {loaderData.info.note && (
          <>
            <EntityNoteEditor
              initialNote={loaderData.info.note}
              inputsEnabled={inputsEnabled}
            />
          </>
        )}
      </SectionCard>

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventInDayBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Time Events"
          createLocation={`/app/workspace/calendar/time-event/in-day-block/new-for-inbox-task?inboxTaskRefId=${loaderData.info.inbox_task.ref_id}`}
          entries={sortedTimeEventEntries}
        />
      )}

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.TIME_PLANS,
      ) &&
        timePlanActivities && (
          <SectionCard
            id="inbox-task-time-plans"
            title="Time Plans"
            actions={
              <SectionActions
                id="inbox-task-time-plans-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={inputsEnabled}
                actions={[
                  NavSingle({
                    text: "Add",
                    highlight: false,
                    link: `/app/workspace/time-plans/add-inbox-task-to-plans?inboxTaskRefId=${loaderData.info.inbox_task.ref_id}`,
                  }),
                ]}
              />
            }
          >
            <TimePlanActivityList
              topLevelInfo={topLevelInfo}
              activities={timePlanActivities}
              timePlansByRefId={timePlansByRefId}
              inboxTasksByRefId={inboxTasksByRefId}
              bigPlansByRefId={new Map()}
              activityDoneness={{}}
              timeEventsByRefId={timeEventsByRefId}
              fullInfo={false}
              showTimePlanName={true}
            />
          </SectionCard>
        )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/inbox-tasks",
  ParamsSchema,
  {
    notFound: (params) => `Could not find inbox task #${params.id}!`,
    error: (params) =>
      `There was an error loading inbox task #${params.id}! Please try again!`,
  },
);
