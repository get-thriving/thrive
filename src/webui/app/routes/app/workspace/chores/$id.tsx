import type {
  ChapterSummary,
  Contact,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  Aspect,
  Tag,
} from "@jupiter/webapi-client";
import {
  NamedEntityTag,
  ApiError,
  ContactNamespace,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  RecurringTaskPeriod,
  TagNamespace,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useFetcher, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams, parseQuery } from "zodix";
import { aDateToDate } from "@jupiter/core/common/adate";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { TimeEventInDayBlockStack } from "@jupiter/core/common/sub/time_events/sub/in_day_block/component/stack";
import { sortInboxTasksNaturally } from "#/core/common/sub/inbox_tasks/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/common/sub/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { RecurringTaskGenParamsBlock } from "@jupiter/core/common/component/recurring-task-gen-params-block";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

const ParamsSchema = z.object({
  id: z.string(),
});

const QuerySchema = z.object({
  inboxTasksRetrieveOffset: z
    .string()
    .transform((s) => parseInt(s, 10))
    .optional(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    aspect: z.string().optional(),
    chapter: z.string().optional(),
    goal: z.string().optional(),
    isKey: CheckboxAsString,
    period: z.nativeEnum(RecurringTaskPeriod),
    eisen: z.nativeEnum(Eisen),
    difficulty: z.nativeEnum(Difficulty),
    actionableFromDay: z.string().optional(),
    actionableFromMonth: z.string().optional(),
    dueAtDay: z.string().optional(),
    dueAtMonth: z.string().optional(),
    mustDo: CheckboxAsString,
    skipRule: z.string().optional(),
    startAtDate: z.string().optional(),
    endAtDate: z.string().optional(),
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
  const query = parseQuery(request, QuerySchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_aspects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.CHORE],
  });
  const allContacts = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  try {
    const result = await apiClient.chores.choreLoad({
      ref_id: id,
      allow_archived: true,
      inbox_task_retrieve_offset: query.inboxTasksRetrieveOffset,
    });

    return json({
      chore: result.chore,
      tags: result.tags,
      note: result.note,
      aspect: result.aspect,
      chapter: result.chapter,
      goal: result.goal,
      inboxTasks: result.inbox_tasks,
      inboxTasksTotalCnt: result.inbox_tasks_total_cnt,
      inboxTasksPageSize: result.inbox_tasks_page_size,
      lifePlan: summaryResponse.life_plan as LifePlan | null,
      allAspects: summaryResponse.aspects as Array<Aspect> | null,
      allChapters: summaryResponse.chapters as Array<ChapterSummary> | null,
      allGoals: summaryResponse.goals as Array<GoalSummary> | null,
      allMilestones:
        summaryResponse.milestones as Array<MilestoneSummary> | null,
      allTags: allTags.tags as Array<Tag>,
      contacts:
        (
          result as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
      allContacts: allContacts.contacts as Array<Contact>,
      timeEventBlocks: result.time_event_blocks,
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
        await apiClient.chores.choreUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          is_key: {
            should_change: true,
            value: form.isKey,
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
          period: {
            should_change: true,
            value: form.period,
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
          must_do: {
            should_change: true,
            value: form.mustDo,
          },
          skip_rule: {
            should_change: true,
            value:
              form.skipRule === undefined || form.skipRule === ""
                ? undefined
                : form.skipRule,
          },
          start_at_date: {
            should_change: true,
            value:
              form.startAtDate === undefined || form.startAtDate === ""
                ? undefined
                : form.startAtDate,
          },
          end_at_date: {
            should_change: true,
            value:
              form.endAtDate === undefined || form.endAtDate === ""
                ? undefined
                : form.endAtDate,
          },
        });

        return redirect(`/app/workspace/chores`);
      }

      case "regen": {
        await apiClient.chores.choreRegen({
          ref_id: id,
        });

        return redirect(`/app/workspace/chores/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.CHORE, id),
          content: [],
        });

        return redirect(`/app/workspace/chores/${id}`);
      }

      case "archive": {
        await apiClient.chores.choreArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/chores`);
      }

      case "remove": {
        await apiClient.chores.choreRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/chores`);
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

export default function Chore() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const birthdayDate = loaderData.lifePlan
    ? lifePlanBirthdayDate(loaderData.lifePlan)
    : null;

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.chore.archived;

  const [selectedAspect, setSelectedAspect] = useState(
    loaderData.aspect?.ref_id ?? "",
  );

  const sortedInboxTasks = sortInboxTasksNaturally(loaderData.inboxTasks, {
    dueDateAscending: false,
  });

  const timeEventEntries = loaderData.timeEventBlocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(
      block,
      topLevelInfo.user.timezone,
    ),
    entry: {
      chore: loaderData.chore,
      time_events: [block],
    },
  }));
  const sortedTimeEventEntries =
    sortInboxTaskTimeEventsNaturally(timeEventEntries);

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
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
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  useEffect(() => {
    // Update states based on loader data. This is necessary because these
    // two are not otherwise updated when the loader data changes. Which happens
    // on a navigation event.
    setSelectedAspect(loaderData.aspect?.ref_id ?? "");
  }, [loaderData]);

  return (
    <LeafPanel
      key={`chore-${loaderData.chore.ref_id}`}
      entityType={NamedEntityTag.CHORE}
      entityRefId={loaderData.chore.ref_id}
      fakeKey={`chore-{loaderData.chore.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.chore.archived}
      returnLocation="/app/workspace/chores"
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="chore-properties"
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
                highlight: false,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.chore.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl sx={{ flexGrow: 1 }}>
            <IsKeySelect
              name="isKey"
              defaultValue={loaderData.chore.is_key}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/is_key" />
          </FormControl>
        </Stack>

        <Stack
          direction={isBigScreen ? "row" : "column"}
          useFlexGap
          spacing={1}
        >
          <FormControl sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.CHORE}
              sourceEntityRefId={loaderData.chore.ref_id}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 2 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={loaderData.allContacts}
              defaultValue={loaderData.contacts.map(
                (contact) => contact.ref_id,
              )}
              inputsEnabled={inputsEnabled}
              namespace={ContactNamespace.CHORE}
              sourceEntityRefId={loaderData.chore.ref_id}
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
              allAspects={loaderData.allAspects ?? []}
              aspectValue={selectedAspect}
              onAspectChange={setSelectedAspect}
              allChapters={loaderData.allChapters ?? []}
              chapterDefaultValue={loaderData.chapter?.ref_id}
              allGoals={loaderData.allGoals ?? []}
              goalDefaultValue={loaderData.goal?.ref_id}
              birthday={birthdayDate!}
              today={aDateToDate(topLevelInfo.today)}
              allMilestones={loaderData.allMilestones ?? []}
            />
            <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
            <FieldError actionResult={actionData} fieldName="/chapter_ref_id" />
            <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
          </FormControl>
        )}

        <RecurringTaskGenParamsBlock
          inputsEnabled={inputsEnabled}
          allowSkipRule
          period={loaderData.chore.gen_params.period}
          eisen={loaderData.chore.gen_params.eisen}
          difficulty={loaderData.chore.gen_params.difficulty}
          actionableFromDay={loaderData.chore.gen_params.actionable_from_day}
          actionableFromMonth={
            loaderData.chore.gen_params.actionable_from_month
          }
          dueAtDay={loaderData.chore.gen_params.due_at_day}
          dueAtMonth={loaderData.chore.gen_params.due_at_month}
          skipRule={loaderData.chore.gen_params.skip_rule}
          actionData={actionData}
        />

        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                name="mustDo"
                readOnly={!inputsEnabled}
                defaultChecked={loaderData.chore.must_do}
              />
            }
            label="Must Do In Vacation"
          />
          <FieldError actionResult={actionData} fieldName="/must_do" />
        </FormControl>

        <Stack spacing={2} direction={isBigScreen ? "row" : "column"}>
          <FormControl fullWidth>
            <InputLabel id="startAtDate" shrink>
              Start At Date [Optional]
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="startAtDate"
              defaultValue={
                loaderData.chore.start_at_date
                  ? aDateToDate(loaderData.chore.start_at_date).toFormat(
                      "yyyy-MM-dd",
                    )
                  : undefined
              }
              name="startAtDate"
              readOnly={!inputsEnabled}
              disabled={!inputsEnabled}
            />

            <FieldError actionResult={actionData} fieldName="/start_at_date" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="endAtDate" shrink>
              End At Date [Optional]
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="endAtDate"
              defaultValue={
                loaderData.chore.end_at_date
                  ? aDateToDate(loaderData.chore.end_at_date).toFormat(
                      "yyyy-MM-dd",
                    )
                  : undefined
              }
              name="endAtDate"
              readOnly={!inputsEnabled}
              disabled={!inputsEnabled}
            />

            <FieldError actionResult={actionData} fieldName="/end_at_date" />
          </FormControl>
        </Stack>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="chore-note"
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

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventInDayBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Time Events"
          createLocation={`/app/workspace/calendar/time-event/in-day-block/new-for-chore?choreRefId=${loaderData.chore.ref_id}`}
          entries={sortedTimeEventEntries}
        />
      )}

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
  "/app/workspace/chores",
  ParamsSchema,
  {
    notFound: (params) => `Could not find chore #${params.id}!`,
    error: (params) =>
      `There was an error loading chore #${params.id}! Please try again!`,
  },
);
