import type {
  ChapterSummary,
  GoalSummary,
  InboxTask,
  LifePlan,
  MilestoneSummary,
  ProjectSummary,
  Tag,
  Workspace,
} from "@jupiter/webapi-client";
import {
  ApiError,
  BigPlanStatus,
  Difficulty,
  Eisen,
  InboxTaskStatus,
  NoteNamespace,
  TagNamespace,
  TimePlanActivityTarget,
  WorkspaceFeature,
  SyncTarget,
} from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  Outlet,
  useActionData,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { AnimatePresence } from "framer-motion";
import { aDateToDate } from "@jupiter/core/common/adate";
import { bigPlanDonePct } from "@jupiter/core/big_plans/root";
import {
  getSuggestedDatesForBigPlanActionableDate,
  getSuggestedDatesForBigPlanDueDate,
} from "@jupiter/core/common/suggested-date";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortInboxTasksNaturally } from "@jupiter/core/inbox_tasks/root";
import { BigPlanStatusBigTag } from "@jupiter/core/big_plans/component/status-big-tag";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { LifePlanAssociations } from "@jupiter/core/life_plan/components/life-plan-associations";
import { TimePlanActivityList } from "@jupiter/core/time_plans/sub/activity/component/list";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { EisenhowerSelect } from "@jupiter/core/common/component/eisenhower-select";
import { DifficultySelect } from "@jupiter/core/common/component/difficulty-select";
import {
  SectionActions,
  ActionSingle,
  NavSingle,
} from "@jupiter/core/infra/component/section-actions";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";
import { BigPlanMilestoneStack } from "@jupiter/core/big_plans/sub/milestones/component/stack";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { BigPlanDonePctBigTag } from "@jupiter/core/big_plans/component/done-pct-big-tag";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CommonParamsSchema = {
  name: z.string(),
  status: z.nativeEnum(BigPlanStatus),
  project: z.string(),
  chapter: z.string().optional(),
  goal: z.string().optional(),
  isKey: CheckboxAsString,
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
    intent: z.literal("upsert-tags"),
    tags: z
      .string()
      .transform((s) => (s.trim() !== "" ? s.trim().split(",") : [])),
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
  z.object({
    intent: z.literal("refresh-stats"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_workspace: true,
    include_life_plan: true,
    include_projects: true,
    include_chapters: true,
    include_goals: true,
    include_milestones: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.BIG_PLAN],
  });

  try {
    const result = await apiClient.bigPlans.bigPlanLoad({
      ref_id: id,
      allow_archived: true,
    });

    const workspace = summaryResponse.workspace as Workspace;
    let timePlanEntries = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.TIME_PLANS)) {
      const timePlanActivitiesResult =
        await apiClient.timePlans.timePlanActivityFindForTarget({
          allow_archived: true,
          target: TimePlanActivityTarget.BIG_PLAN,
          target_ref_id: id,
        });
      timePlanEntries = timePlanActivitiesResult.entries;
    }

    return json({
      bigPlan: result.big_plan,
      stats: result.stats,
      project: result.project,
      chapter: result.chapter,
      goal: result.goal,
      milestones: result.milestones,
      inboxTasks: result.inbox_tasks,
      tags: result.tags,
      note: result.note,
      timePlanEntries: timePlanEntries,
      lifePlan: summaryResponse.life_plan as LifePlan,
      allProjects: summaryResponse.projects as Array<ProjectSummary>,
      allChapters: summaryResponse.chapters as Array<ChapterSummary>,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      allMilestones: summaryResponse.milestones as Array<MilestoneSummary>,
      allTags: allTags.tags as Array<Tag>,
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
        if (form.intent === "mark-done") {
          status = BigPlanStatus.DONE;
        } else if (form.intent === "mark-not-done") {
          status = BigPlanStatus.NOT_DONE;
        } else if (form.intent === "start") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "restart") {
          status = BigPlanStatus.IN_PROGRESS;
        } else if (form.intent === "block") {
          status = BigPlanStatus.BLOCKED;
        } else if (form.intent === "stop") {
          status = BigPlanStatus.NOT_STARTED;
        } else if (form.intent === "reactivate") {
          status = BigPlanStatus.NOT_STARTED;
        }

        const result = await apiClient.bigPlans.bigPlanUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          status: {
            should_change: true,
            value: status,
          },
          project_ref_id: {
            should_change: true,
            value: form.project,
          },
          chapter_ref_id: {
            should_change: true,
            value:
              form.chapter !== undefined && form.chapter !== ""
                ? form.chapter
                : undefined,
          },
          goal_ref_id: {
            should_change: true,
            value:
              form.goal !== undefined && form.goal !== ""
                ? form.goal
                : undefined,
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
          return redirect(`/app/workspace/big-plans/${id}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/big-plans`);
      }

      case "upsert-tags": {
        await apiClient.tags.tagLinkUpsert({
          namespace: TagNamespace.BIG_PLAN,
          source_entity_ref_id: id,
          tag_names: form.tags,
        });

        return redirect(`/app/workspace/big-plans/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.BIG_PLAN,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/big-plans/${id}`);
      }

      case "archive": {
        await apiClient.bigPlans.bigPlanArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/big-plans`);
      }

      case "remove": {
        await apiClient.bigPlans.bigPlanRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/big-plans`);
      }

      case "refresh-stats": {
        await apiClient.stats.statsDo({
          stats_targets: [SyncTarget.BIG_PLANS],
          filter_big_plan_ref_ids: [id],
          filter_habit_ref_ids: undefined,
          filter_journal_ref_ids: undefined,
        });
        return redirect(`/app/workspace/big-plans/${id}`);
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

export default function BigPlan() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.bigPlan.archived;

  const bigPlansByRefId = new Map();
  bigPlansByRefId.set(loaderData.bigPlan.ref_id, loaderData.bigPlan);

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

  const sortedInboxTasks = sortInboxTasksNaturally(loaderData.inboxTasks, {
    dueDateAscending: false,
  });
  const milestonesLeft = loaderData.milestones.filter(
    (m) => aDateToDate(m.date) > aDateToDate(topLevelInfo.today),
  ).length;

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

  return (
    <LeafPanel
      key={`big-plan-${loaderData.bigPlan.ref_id}`}
      fakeKey={`big-plan-${loaderData.bigPlan.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.bigPlan.archived}
      returnLocation={"/app/workspace/big-plans"}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <GlobalError actionResult={actionData} />
        <SectionCard
          id="big-plan-properties"
          title="Properties"
          actions={
            <SectionActions
              id="big-plan-properties"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Save",
                  value: "update",
                  highlight: true,
                }),
                ActionSingle({
                  text: "Refresh Stats",
                  value: "refresh-stats",
                }),
              ]}
            />
          }
        >
          <Stack direction="row" spacing={1}>
            <FormControl sx={{ flexGrow: 3 }}>
              <InputLabel id="name">Name</InputLabel>
              <OutlinedInput
                label="Name"
                name="name"
                readOnly={!inputsEnabled}
                defaultValue={loaderData.bigPlan.name}
              />
              <FieldError actionResult={actionData} fieldName="/name" />
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <IsKeySelect
                name="isKey"
                defaultValue={loaderData.bigPlan.is_key}
                inputsEnabled={inputsEnabled}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flexGrow: 1 }}>
              <BigPlanStatusBigTag status={loaderData.bigPlan.status} />
              <input
                type="hidden"
                name="status"
                value={loaderData.bigPlan.status}
              />
              <FieldError actionResult={actionData} fieldName="/status" />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <BigPlanDonePctBigTag
                donePct={bigPlanDonePct(loaderData.bigPlan, loaderData.stats)}
                shouldShowMilestonesLeft={loaderData.milestones.length > 0}
                milestonesLeft={milestonesLeft}
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
                projectDefaultValue={loaderData.project.ref_id}
                allChapters={loaderData.allChapters}
                chapterDefaultValue={loaderData.chapter?.ref_id}
                allGoals={loaderData.allGoals}
                goalDefaultValue={loaderData.goal?.ref_id}
                birthday={lifePlanBirthdayDate(loaderData.lifePlan)}
                today={aDateToDate(topLevelInfo.today)}
                allMilestones={loaderData.allMilestones}
              />
              <FieldError
                actionResult={actionData}
                fieldName="/project_ref_id"
              />
              <FieldError
                actionResult={actionData}
                fieldName="/chapter_ref_id"
              />
              <FieldError actionResult={actionData} fieldName="/goal_ref_id" />
            </FormControl>
          )}

          <FormControl fullWidth>
            <FormLabel id="eisen">Eisenhower</FormLabel>
            <EisenhowerSelect
              name="eisen"
              defaultValue={loaderData.bigPlan.eisen}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/eisen" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="difficulty">Difficulty</FormLabel>
            <DifficultySelect
              name="difficulty"
              defaultValue={loaderData.bigPlan.difficulty}
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/difficulty" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="actionableDate" shrink>
              Actionable From [Optional]
            </InputLabel>
            <DateInputWithSuggestions
              name="actionableDate"
              label="actionableDate"
              inputsEnabled={inputsEnabled}
              defaultValue={loaderData.bigPlan.actionable_date}
              suggestedDates={getSuggestedDatesForBigPlanActionableDate(
                topLevelInfo.today,
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="dueDate" shrink>
              Due At [Optional]
            </InputLabel>
            <DateInputWithSuggestions
              name="dueDate"
              label="dueDate"
              inputsEnabled={inputsEnabled}
              defaultValue={loaderData.bigPlan.due_date}
              suggestedDates={getSuggestedDatesForBigPlanDueDate(
                topLevelInfo.today,
              )}
            />
          </FormControl>

          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            {loaderData.bigPlan.status === BigPlanStatus.NOT_STARTED && (
              <ButtonGroup fullWidth>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-done"
                >
                  Mark Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-not-done"
                >
                  Mark Not Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="start"
                >
                  Start
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="block"
                >
                  Block
                </Button>
              </ButtonGroup>
            )}

            {loaderData.bigPlan.status === BigPlanStatus.IN_PROGRESS && (
              <ButtonGroup fullWidth>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-done"
                >
                  Mark Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-not-done"
                >
                  Mark Not Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="block"
                >
                  Block
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="stop"
                >
                  Stop
                </Button>
              </ButtonGroup>
            )}

            {loaderData.bigPlan.status === BigPlanStatus.BLOCKED && (
              <ButtonGroup fullWidth>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-done"
                >
                  Mark Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="mark-not-done"
                >
                  Mark Not Done
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="restart"
                >
                  Restart
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="stop"
                >
                  Stop
                </Button>
              </ButtonGroup>
            )}

            {(loaderData.bigPlan.status === BigPlanStatus.DONE ||
              loaderData.bigPlan.status === BigPlanStatus.NOT_DONE) && (
              <ButtonGroup fullWidth>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={!inputsEnabled}
                  type="submit"
                  name="intent"
                  value="reactivate"
                >
                  Reactivate
                </Button>
              </ButtonGroup>
            )}
          </Stack>
        </SectionCard>

        <SectionCard
          title="Tags"
          actions={
            <SectionActions
              id="big-plan-tags"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  text: "Add Tags",
                  value: "upsert-tags",
                  highlight: false,
                }),
              ]}
            />
          }
        >
          <TagsEditor
            name="tags"
            allTags={loaderData.allTags}
            defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/tags_names" />
        </SectionCard>

        <SectionCard
          title="Note"
          actions={
            <SectionActions
              id="person-note"
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

        <SectionCard
          id="big-plan-milestones"
          title="Milestones"
          actions={
            <SectionActions
              id="big-plan-milestones"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New",
                  link: `/app/workspace/big-plans/${loaderData.bigPlan.ref_id}/milestones/new`,
                }),
              ]}
            />
          }
        >
          <BigPlanMilestoneStack milestones={loaderData.milestones} />
        </SectionCard>

        <SectionCard
          id="big-plan-inbox-tasks"
          title="Inbox Tasks"
          actions={
            <SectionActions
              id="big-plan-inbox-tasks"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New",
                  link: `/app/workspace/inbox-tasks/new?bigPlanReason=for-big-plan&bigPlanRefId=${loaderData.bigPlan.ref_id}`,
                }),
              ]}
            />
          }
        >
          {sortedInboxTasks.length > 0 && (
            <InboxTaskStack
              topLevelInfo={topLevelInfo}
              showOptions={{
                showStatus: true,
                showEisen: true,
                showDifficulty: true,
                showActionableDate: true,
                showDueDate: true,
                showHandleMarkDone: true,
                showHandleMarkNotDone: true,
              }}
              inboxTasks={sortedInboxTasks}
              onCardMarkDone={handleCardMarkDone}
              onCardMarkNotDone={handleCardMarkNotDone}
            />
          )}
        </SectionCard>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.TIME_PLANS,
        ) &&
          timePlanActivities && (
            <SectionCard
              id="big-plan-time-plans"
              title="Time Plans"
              actions={
                <SectionActions
                  id="big-plan-time-plans-actions"
                  topLevelInfo={topLevelInfo}
                  inputsEnabled={inputsEnabled}
                  actions={[
                    NavSingle({
                      text: "Add",
                      highlight: false,
                      link: `/app/workspace/time-plans/add-big-plan-to-plans?bigPlanRefId=${loaderData.bigPlan.ref_id}`,
                    }),
                  ]}
                />
              }
            >
              <TimePlanActivityList
                topLevelInfo={topLevelInfo}
                activities={timePlanActivities}
                timePlansByRefId={timePlansByRefId}
                inboxTasksByRefId={new Map()}
                bigPlansByRefId={bigPlansByRefId}
                activityDoneness={{}}
                timeEventsByRefId={timeEventsByRefId}
                fullInfo={false}
                showTimePlanName={true}
              />
            </SectionCard>
          )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/big-plans",
  ParamsSchema,
  {
    notFound: (params) => `Could not find big plan with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading big plan with ID ${params.id}! Please try again!`,
  },
);
