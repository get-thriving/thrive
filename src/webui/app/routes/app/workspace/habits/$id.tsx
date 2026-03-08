import type {
  ChapterSummary,
  Contact,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  Project,
} from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  HabitRepeatsStrategy,
  ContactNamespace,
  InboxTaskStatus,
  NoteNamespace,
  RecurringTaskPeriod,
  TagNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useFetcher,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams, parseQuery } from "zodix";
import { DateTime } from "luxon";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortInboxTasksNaturally } from "@jupiter/core/inbox_tasks/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { HabitRepeatStrategySelect } from "@jupiter/core/habits/component/repeat-strategy-select";
import { HabitStreakCalendar } from "@jupiter/core/habits/component/streak-calendar";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { RecurringTaskGenParamsBlock } from "@jupiter/core/common/component/recurring-task-gen-params-block";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { newURLParams } from "~/logic/navigation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const QuerySchema = z.object({
  inboxTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
  viewOneIncludeStreakMarksEarliestDate: z.string().optional(),
  viewOneIncludeStreakMarksLatestDate: z.string().optional(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    project: z.string().optional(),
    chapter: z.string().optional(),
    goal: z.string().optional(),
    period: z.nativeEnum(RecurringTaskPeriod),
    isKey: CheckboxAsString,
    eisen: z.nativeEnum(Eisen),
    difficulty: z.nativeEnum(Difficulty),
    actionableFromDay: z.string().optional(),
    actionableFromMonth: z.string().optional(),
    dueAtDay: z.string().optional(),
    dueAtMonth: z.string().optional(),
    skipRule: z.string().optional(),
    repeatsStrategy: z
      .nativeEnum(HabitRepeatsStrategy)
      .or(z.literal("none"))
      .optional(),
    repeatsInPeriodCount: z.string().optional(),
  }),
  z.object({
    intent: z.literal("regen"),
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
  const query = parseQuery(request, QuerySchema); // Parse the query parameters

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  let earliestDate = query.viewOneIncludeStreakMarksEarliestDate;
  let latestDate = query.viewOneIncludeStreakMarksLatestDate;
  if (earliestDate === undefined) {
    earliestDate = DateTime.now().minus({ days: 90 }).toISODate();
    latestDate = DateTime.now().toISODate();
  }

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.HABIT],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  try {
    const result = await apiClient.habits.habitLoad({
      ref_id: id,
      allow_archived: true,
      inbox_task_retrieve_offset: query.inboxTasksRetrieveOffset, // Pass the offset to the API call
      include_streak_marks_earliest_date: earliestDate,
      include_streak_marks_latest_date: latestDate,
    });

    return json({
      habit: result.habit,
      tags: result.tags,
      note: result.note,
      streakMarks: result.streak_marks,
      streakMarkEarliestDate: result.streak_mark_earliest_date,
      streakMarkLatestDate: result.streak_mark_latest_date,
      project: result.project,
      chapter: result.chapter,
      goal: result.goal,
      inboxTasks: result.inbox_tasks,
      inboxTasksTotalCnt: result.inbox_tasks_total_cnt,
      inboxTasksPageSize: result.inbox_tasks_page_size,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allProjects: summaryResponse.projects as Array<Project>,
      allChapters: summaryResponse.chapters as Array<ChapterSummary>,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
      allTags: allTags.tags,
      contacts:
        (
          result as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
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
      case "update": {
        await apiClient.habits.habitUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          project_ref_id: {
            should_change: form.project ? true : false,
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
          period: {
            should_change: true,
            value: form.period,
          },
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
          actionable_from_day: {
            should_change: true,
            value:
              form.actionableFromDay === undefined ||
              form.actionableFromDay === ""
                ? undefined
                : parseInt(form.actionableFromDay),
          },
          actionable_from_month: {
            should_change: true,
            value:
              form.actionableFromMonth === undefined ||
              form.actionableFromMonth === ""
                ? undefined
                : parseInt(form.actionableFromMonth),
          },
          due_at_day: {
            should_change: true,
            value:
              form.dueAtDay === undefined || form.dueAtDay === ""
                ? undefined
                : parseInt(form.dueAtDay),
          },
          due_at_month: {
            should_change: true,
            value:
              form.dueAtMonth === undefined || form.dueAtMonth === ""
                ? undefined
                : parseInt(form.dueAtMonth),
          },
          skip_rule: {
            should_change: true,
            value:
              form.skipRule === undefined || form.skipRule === ""
                ? undefined
                : form.skipRule,
          },
          repeats_strategy: {
            should_change: true,
            value:
              form.repeatsStrategy !== undefined &&
              form.repeatsStrategy !== "none"
                ? form.repeatsStrategy
                : undefined,
          },
          repeats_in_period_count: {
            should_change: true,
            value: form.repeatsInPeriodCount
              ? parseInt(form.repeatsInPeriodCount)
              : undefined,
          },
        });

        return redirect(`/app/workspace/habits`);
      }

      case "regen": {
        await apiClient.habits.habitRegen({
          ref_id: id,
        });

        return redirect(`/app/workspace/habits/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.HABIT,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/habits/${id}`);
      }

      case "archive": {
        await apiClient.habits.habitArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/habits`);
      }

      case "remove": {
        await apiClient.habits.habitRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/habits`);
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

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Habit() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const birthdayDate = lifePlanBirthdayDate(loaderData.lifePlan);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.habit.archived;

  const [selectedProject, setSelectedProject] = useState(
    loaderData.project.ref_id,
  );

  const [selectedPeriod, setSelectedPeriod] = useState(
    loaderData.habit.gen_params.period,
  );

  const [selectedRepeatsStrategy, setSelectedRepeatsStrategy] = useState<
    HabitRepeatsStrategy | "none"
  >(loaderData.habit.repeats_strategy || "none");

  const sortedInboxTasks = sortInboxTasksNaturally(loaderData.inboxTasks, {
    dueDateAscending: false,
  });

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.NOT_DONE,
      },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  useEffect(() => {
    // Update states based on loader data. This is necessary because these
    // two are not otherwise updated when the loader data changes. Which happens
    // on a navigation event.
    setSelectedProject(loaderData.project.ref_id);
    setSelectedPeriod(loaderData.habit.gen_params.period);
    setSelectedRepeatsStrategy(loaderData.habit.repeats_strategy || "none");
  }, [loaderData]);

  return (
    <LeafPanel
      key={`habit-${loaderData.habit.ref_id}`}
      fakeKey={`habit-${loaderData.habit.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.habit.archived}
      returnLocation="/app/workspace/habits"
      initialExpansionState={LeafPanelExpansionState.MEDIUM}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="habit-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
                highlight: true,
              }),
              ActionSingle({
                text: "Regen",
                value: "regen",
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.habit.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={loaderData.habit.is_key}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/is_key" />
          </FormControl>
        </Stack>

        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.HABIT}
              sourceEntityRefId={loaderData.habit.ref_id}
            />
            <FieldError actionResult={actionData} fieldName="/tags_names" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={loaderData.allContacts}
              defaultValue={loaderData.contacts.map(
                (contact) => contact.ref_id,
              )}
              inputsEnabled={inputsEnabled}
              namespace={ContactNamespace.HABIT}
              sourceEntityRefId={loaderData.habit.ref_id}
            />
          </FormControl>
        </Stack>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <LifePlanAssociations
              inputsEnabled={inputsEnabled}
              allProjects={loaderData.allProjects}
              projectValue={selectedProject}
              onProjectChange={setSelectedProject}
              allChapters={loaderData.allChapters}
              chapterDefaultValue={loaderData.chapter?.ref_id}
              allGoals={loaderData.allGoals}
              goalDefaultValue={loaderData.goal?.ref_id}
              birthday={birthdayDate}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones}
            />
            <FieldError actionResult={actionData} fieldName="/project_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}

        <RecurringTaskGenParamsBlock
          allowSkipRule
          inputsEnabled={inputsEnabled}
          period={selectedPeriod}
          onChangePeriod={(newPeriod) => {
            if (newPeriod === "none") {
              setSelectedPeriod(RecurringTaskPeriod.DAILY);
            } else {
              setSelectedPeriod(newPeriod);
            }
          }}
          eisen={loaderData.habit.gen_params.eisen}
          difficulty={loaderData.habit.gen_params.difficulty}
          actionableFromDay={loaderData.habit.gen_params.actionable_from_day}
          actionableFromMonth={
            loaderData.habit.gen_params.actionable_from_month
          }
          dueAtDay={loaderData.habit.gen_params.due_at_day}
          dueAtMonth={loaderData.habit.gen_params.due_at_month}
          skipRule={loaderData.habit.gen_params.skip_rule}
          actionData={actionData}
        />

        {selectedPeriod !== RecurringTaskPeriod.DAILY && (
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flexGrow: 3 }}>
              <HabitRepeatStrategySelect
                name="repeatsStrategy"
                inputsEnabled={inputsEnabled}
                allowNone
                value={selectedRepeatsStrategy}
                onChange={(newStrategy) =>
                  setSelectedRepeatsStrategy(newStrategy)
                }
              />
            </FormControl>

            {selectedRepeatsStrategy !== "none" && (
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel id="repeatsInPeriodCount">
                  Repeats In Period [Optional]
                </InputLabel>
                <OutlinedInput
                  label="Repeats In Period"
                  name="repeatsInPeriodCount"
                  readOnly={!inputsEnabled}
                  defaultValue={loaderData.habit.repeats_in_period_count}
                  sx={{ height: "100%" }}
                />
                <FieldError
                  actionResult={actionData}
                  fieldName="/repeats_in_period_count"
                />
              </FormControl>
            )}
          </Stack>
        )}
      </SectionCard>

      <SectionCard title="Streak">
        <HabitStreakCalendar
          earliestDate={loaderData.streakMarkEarliestDate}
          latestDate={loaderData.streakMarkLatestDate}
          currentToday={topLevelInfo.today}
          habit={loaderData.habit}
          streakMarks={loaderData.streakMarks}
          showNav
          getNavUrl={(earliestDate, latestDate) =>
            `/app/workspace/habits/${loaderData.habit.ref_id}?${newURLParams(
              query,
              "viewOneIncludeStreakMarksEarliestDate",
              earliestDate,
              "viewOneIncludeStreakMarksLatestDate",
              latestDate,
            )}`
          }
        />
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="habit-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
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
          <>
            <EntityNoteEditor
              initialNote={loaderData.note}
              inputsEnabled={inputsEnabled}
            />
          </>
        )}
      </SectionCard>

      <SectionCard title="Inbox Tasks">
        {sortedInboxTasks.length > 0 && (
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
              showHandleMarkDone: true,
              showHandleMarkNotDone: true,
            }}
            inboxTasks={sortedInboxTasks}
            withPages={{
              retrieveOffsetParamName: "inboxTasksRetrieveOffset",
              totalCnt: loaderData.inboxTasksTotalCnt,
              pageSize: loaderData.inboxTasksPageSize,
            }}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/habits",
  ParamsSchema,
  {
    notFound: (params) => `Could not find habit with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading habit with ID ${params.id}! Please try again!`,
  },
);
