import { DateTime } from "luxon";
import type {
  ChapterSummary,
  Contact,
  GoalSummary,
  LifePlan,
  MilestoneSummary,
  AspectSummary,
  Tag,
} from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  NoteNamespace,
  TagNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TodoTaskPropertiesEditor } from "@jupiter/core/todo/components/properties-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  name: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
  aspect: z.string().optional(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsString,
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
  actionableDate: z.string().optional(),
  dueDate: z.string().optional(),
};

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("mark-done"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("mark-not-done"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("start"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("restart"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("block"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("stop"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("reactivate"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("update"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("delay-1-day"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("delay-1-week"), ...CommonParamsSchema }),
  z.object({ intent: z.literal("delay-1-month"), ...CommonParamsSchema }),
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
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.TODO_TASK],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  try {
    const result = await apiClient.todo.todoTaskLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      todoTask: result.todo_task,
      inboxTask: result.inbox_task,
      note: result.note,
      aspect: result.aspect,
      chapter: result.chapter,
      goal: result.goal,
      tags: result.tags ?? [],
      contacts:
        (
          result as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
      timeEventBlocks: result.time_event_blocks,
      lifePlan: summaryResponse.life_plan as LifePlan | null,
      allAspects: summaryResponse.aspects as Array<AspectSummary> | null,
      allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
      allGoals: summaryResponse.goals as Array<GoalSummary> | null,
      allMilestones:
        summaryResponse.milestones as Array<MilestoneSummary> | null,
      allTags: allTags.tags as Array<Tag>,
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
      case "update":
      case "delay-1-day":
      case "delay-1-week":
      case "delay-1-month": {
        let status = form.status;

        if (form.intent === "mark-done") {
          status = InboxTaskStatus.DONE;
        } else if (form.intent === "mark-not-done") {
          status = InboxTaskStatus.NOT_DONE;
        } else if (form.intent === "start" || form.intent === "restart") {
          status = InboxTaskStatus.IN_PROGRESS;
        } else if (form.intent === "block") {
          status = InboxTaskStatus.BLOCKED;
        } else if (form.intent === "stop" || form.intent === "reactivate") {
          status = InboxTaskStatus.NOT_STARTED;
        }

        let actionableDate = form.actionableDate;
        let dueDate = form.dueDate;

        if (
          form.intent === "delay-1-day" ||
          form.intent === "delay-1-week" ||
          form.intent === "delay-1-month"
        ) {
          const today = DateTime.now().startOf("day");
          const delay =
            form.intent === "delay-1-day"
              ? { days: 1 }
              : form.intent === "delay-1-week"
                ? { weeks: 1 }
                : { months: 1 };
          const newActionableDate = today.plus(delay);
          actionableDate = newActionableDate.toISODate() ?? undefined;
          if (form.dueDate !== undefined && form.dueDate !== "") {
            const oldDueDate = DateTime.fromISO(form.dueDate);
            if (
              form.actionableDate !== undefined &&
              form.actionableDate !== ""
            ) {
              const oldActionableDate = DateTime.fromISO(form.actionableDate);
              const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
              dueDate =
                newActionableDate.plus({ days: gapDays }).toISODate() ??
                undefined;
            } else {
              dueDate = actionableDate;
            }
          }
        }

        await apiClient.todo.todoTaskUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          status: {
            should_change: true,
            value: status,
          },
          aspect_ref_id:
            form.aspect !== undefined
              ? { should_change: true, value: form.aspect }
              : { should_change: false },
          chapter_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.chapter !== undefined && form.chapter !== ""
                      ? form.chapter
                      : undefined,
                }
              : { should_change: false },
          goal_ref_id:
            form.aspect !== undefined
              ? {
                  should_change: true,
                  value:
                    form.goal !== undefined && form.goal !== ""
                      ? form.goal
                      : undefined,
                }
              : { should_change: false },
          is_key: {
            should_change: true,
            value: form.isKey,
          },
          eisen: {
            should_change: true,
            value: form.eisen,
          },
          difficulty: {
            should_change: true,
            value: form.difficulty,
          },
          actionable_date: {
            should_change: true,
            value:
              actionableDate !== undefined && actionableDate !== ""
                ? actionableDate
                : null,
          },
          due_date: {
            should_change: true,
            value: dueDate !== undefined && dueDate !== "" ? dueDate : null,
          },
        });

        return redirect(`/app/workspace/todos`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.TODO_TASK,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/todos/${id}`);
      }

      case "archive": {
        await apiClient.todo.todoTaskArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/todos`);
      }

      case "remove": {
        await apiClient.todo.todoTaskRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/todos`);
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

export default function TodoTask() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.todoTask.archived;

  const timeEventEntries = loaderData.timeEventBlocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      todo_task: loaderData.todoTask,
      inbox_task: loaderData.inboxTask,
      time_events: [block],
    },
  }));
  const sortedTimeEventEntries =
    sortInboxTaskTimeEventsNaturally(timeEventEntries);

  return (
    <LeafPanel
      key={`todo-task-${loaderData.todoTask.ref_id}`}
      fakeKey={`todo-task-${loaderData.todoTask.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.todoTask.archived}
      returnLocation="/app/workspace/todos"
    >
      <GlobalError actionResult={actionData} />
      <TodoTaskPropertiesEditor
        title="Properties"
        topLevelInfo={topLevelInfo}
        lifePlan={loaderData.lifePlan}
        allAspects={loaderData.allAspects ?? []}
        allChapters={loaderData.allChapters ?? []}
        allGoals={loaderData.allGoals ?? []}
        allMilestones={loaderData.allMilestones ?? []}
        allTags={loaderData.allTags}
        tags={loaderData.tags}
        allContacts={loaderData.allContacts}
        contacts={loaderData.contacts}
        inputsEnabled={inputsEnabled}
        todoTask={loaderData.todoTask}
        inboxTask={loaderData.inboxTask}
        actionData={actionData}
      />

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventInDayBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Time Events"
          createLocation={`/app/workspace/calendar/time-event/in-day-block/new-for-todo-task?todoTaskRefId=${loaderData.todoTask.ref_id}`}
          entries={sortedTimeEventEntries}
        />
      )}

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="todo-create-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "todo-create-note",
                text: "Create Note",
                value: "create-note",
                highlight: false,
                disabled: loaderData.note !== null,
              }),
            ]}
          />
        }
      >
        {loaderData.note && (
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/todos",
  ParamsSchema,
  {
    notFound: (params) => `Could not find todo task #${params.id}!`,
    error: (params) =>
      `There was an error loading todo task #${params.id}! Please try again!`,
  },
);
