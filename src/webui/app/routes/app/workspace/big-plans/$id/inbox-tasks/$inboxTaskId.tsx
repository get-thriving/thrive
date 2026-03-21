import { DateTime } from "luxon";
import {
  ApiError,
  Difficulty,
  Eisen,
  InboxTaskStatus,
} from "@jupiter/webapi-client";
import {
  Box,
  Button,
  ButtonGroup,
  CardActions,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import {
  getSuggestedDatesForInboxTaskActionableDate,
  getSuggestedDatesForInboxTaskDueDate,
} from "@jupiter/core/common/suggested-date";
import { DifficultySelect } from "@jupiter/core/common/component/difficulty-select";
import { EisenhowerSelect } from "@jupiter/core/common/component/eisenhower-select";
import { InboxTaskStatusBigTag } from "@jupiter/core/inbox_tasks/component/status-big-tag";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { saveScoreAction } from "@jupiter/core/gamification/scores.server";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { IsKeySelect } from "@jupiter/core/common/component/is-key-select";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";

import { getLoggedInApiClient } from "~/api-clients.server";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  id: z.string(),
  inboxTaskId: z.string(),
});

const CommonParamsSchema = {
  name: z.string(),
  status: z.nativeEnum(InboxTaskStatus),
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
    intent: z.literal("delay-1-day"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("delay-1-week"),
    ...CommonParamsSchema,
  }),
  z.object({
    intent: z.literal("delay-1-month"),
    ...CommonParamsSchema,
  }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: bigPlanId, inboxTaskId } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.inboxTasks.inboxTaskLoad({
      ref_id: inboxTaskId,
      allow_archived: true,
    });

    return json({
      bigPlanId: bigPlanId,
      info: result,
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
  const { id: bigPlanId, inboxTaskId } = parseParams(params, ParamsSchema);
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
          status = InboxTaskStatus.NOT_STARTED;
        } else if (form.intent === "reactivate") {
          status = InboxTaskStatus.NOT_STARTED;
        }

        const result = await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: inboxTaskId,
          name: {
            should_change: true,
            value: form.name,
          },
          status: {
            should_change: true,
            value: status,
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
          return redirect(`/app/workspace/big-plans/${bigPlanId}`, {
            headers: {
              "Set-Cookie": await saveScoreAction(result.record_score_result),
            },
          });
        }

        return redirect(`/app/workspace/big-plans/${bigPlanId}`);
      }

      case "delay-1-day":
      case "delay-1-week":
      case "delay-1-month": {
        const today = DateTime.now().startOf("day");
        const delay =
          form.intent === "delay-1-day"
            ? { days: 1 }
            : form.intent === "delay-1-week"
              ? { weeks: 1 }
              : { months: 1 };
        const newActionableDate = today.plus(delay);

        let newDueDate: DateTime | undefined;
        if (form.dueDate !== undefined && form.dueDate !== "") {
          const oldDueDate = DateTime.fromISO(form.dueDate);
          if (form.actionableDate !== undefined && form.actionableDate !== "") {
            const oldActionableDate = DateTime.fromISO(form.actionableDate);
            const gapDays = oldDueDate.diff(oldActionableDate, "days").days;
            newDueDate = newActionableDate.plus({ days: gapDays });
          } else {
            newDueDate = newActionableDate;
          }
        }

        await apiClient.inboxTasks.inboxTaskUpdate({
          ref_id: inboxTaskId,
          name: { should_change: false },
          status: { should_change: false },
          is_key: { should_change: false },
          eisen: { should_change: false },
          difficulty: { should_change: false },
          actionable_date: {
            should_change: true,
            value: newActionableDate.toISODate() ?? undefined,
          },
          due_date: {
            should_change: true,
            value: newDueDate
              ? (newDueDate.toISODate() ?? undefined)
              : undefined,
          },
        });

        return redirect(`/app/workspace/big-plans/${bigPlanId}`);
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

export default function BigPlanInboxTaskEdit() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: bigPlanId } = useParams();

  const inboxTask = loaderData.info.inbox_task;
  const inputsEnabled = navigation.state === "idle" && !inboxTask.archived;

  return (
    <LeafPanel
      key={`big-plan-inbox-task-${inboxTask.ref_id}`}
      isLeaflet
      fakeKey={`big-plan-inbox-task-${inboxTask.ref_id}`}
      returnLocation={`/app/workspace/big-plans/${bigPlanId}`}
      inputsEnabled={inputsEnabled}
      entityArchived={inboxTask.archived}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Inbox Task Properties"
        actions={
          <SectionActions
            id="big-plan-inbox-task-editor"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "big-plan-inbox-task-editor-save",
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack spacing={2} useFlexGap>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}>
            <FormControl sx={{ flexGrow: 3 }}>
              <InputLabel id="name">Name</InputLabel>
              <OutlinedInput
                label="Name"
                name="name"
                readOnly={!inputsEnabled}
                defaultValue={inboxTask.name}
              />
              <FieldError actionResult={actionData} fieldName="/name" />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <IsKeySelect
                name="isKey"
                defaultValue={inboxTask.is_key}
                inputsEnabled={inputsEnabled}
              />
            </FormControl>
          </Box>

          <Stack direction="row" useFlexGap spacing={1}>
            <FormControl sx={{ flexGrow: 1, minWidth: "unset" }}>
              <InboxTaskStatusBigTag status={inboxTask.status} />
              <input type="hidden" name="status" value={inboxTask.status} />
              <FieldError actionResult={actionData} fieldName="/status" />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="bigPlan" shrink>
                Big Plan
              </InputLabel>
              <OutlinedInput
                label="Big Plan"
                readOnly
                value={loaderData.info.big_plan?.name ?? "Unknown"}
              />
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <FormLabel id="eisen">Eisenhower</FormLabel>
            <EisenhowerSelect
              name="eisen"
              inputsEnabled={inputsEnabled}
              defaultValue={inboxTask.eisen}
            />
            <FieldError actionResult={actionData} fieldName="/eisen" />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel id="difficulty">Difficulty</FormLabel>
            <DifficultySelect
              name="difficulty"
              inputsEnabled={inputsEnabled}
              defaultValue={inboxTask.difficulty}
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
              defaultValue={inboxTask.actionable_date}
              suggestedDates={getSuggestedDatesForInboxTaskActionableDate(
                topLevelInfo.today,
                loaderData.info.big_plan,
                loaderData.info.time_plan,
              )}
            />

            <FieldError
              actionResult={actionData}
              fieldName="/actionable_date"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="dueDate" shrink margin="dense">
              Due At [Optional]
            </InputLabel>
            <DateInputWithSuggestions
              name="dueDate"
              label="dueDate"
              inputsEnabled={inputsEnabled}
              defaultValue={inboxTask.due_date}
              suggestedDates={getSuggestedDatesForInboxTaskDueDate(
                topLevelInfo.today,
                loaderData.info.big_plan,
                loaderData.info.time_plan,
              )}
            />

            <FieldError actionResult={actionData} fieldName="/due_date" />
          </FormControl>
        </Stack>

        <CardActions sx={{ paddingLeft: "0px", paddingRight: "0px" }}>
          <Stack direction="column" spacing={1} sx={{ width: "100%" }}>
            {(inboxTask.status === InboxTaskStatus.NOT_STARTED ||
              inboxTask.status === InboxTaskStatus.NOT_STARTED_GEN) && (
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

            {inboxTask.status === InboxTaskStatus.IN_PROGRESS && (
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

            {inboxTask.status === InboxTaskStatus.BLOCKED && (
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

            {(inboxTask.status === InboxTaskStatus.DONE ||
              inboxTask.status === InboxTaskStatus.NOT_DONE) && (
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

            <ButtonGroup fullWidth>
              <Button
                size="small"
                variant="outlined"
                disabled={!inputsEnabled}
                type="submit"
                name="intent"
                value="delay-1-day"
              >
                Delay by 1 Day
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!inputsEnabled}
                type="submit"
                name="intent"
                value="delay-1-week"
              >
                Delay by 1 Week
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!inputsEnabled}
                type="submit"
                name="intent"
                value="delay-1-month"
              >
                Delay by 1 Month
              </Button>
            </ButtonGroup>
          </Stack>
        </CardActions>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  notFound: (params) => `Could not find inbox task #${params.inboxTaskId}!`,
  error: (params) =>
    `There was an error loading inbox task #${params.inboxTaskId}! Please try again!`,
});
