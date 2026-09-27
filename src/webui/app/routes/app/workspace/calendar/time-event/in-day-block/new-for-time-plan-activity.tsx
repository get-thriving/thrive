import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import {
  parseTimeEventBufferMins,
  timeEventInDayBlockParamsToUtc,
} from "@jupiter/core/common/sub/time_events/time-event";
import { calendarLeafReturnLocation } from "@jupiter/core/calendar/component/calendar-navigation";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventBuffersEditor } from "@jupiter/core/common/sub/time_events/component/buffers-editor";
import { TimeEventParamsSource } from "@jupiter/core/common/sub/time_events/component/params-source";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { timePlanActivityTargetNameForEvent } from "#/core/apps/time_plans/sub/activity/root";
import { habitActivitiesForStackMembers } from "#/core/apps/time_plans/sub/activity/habit-chore-group";
import { isTimePlanActivityHabitStackTarget } from "#/core/apps/time_plans/sub/activity/target-wire";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  timePlanActivityRefId: z.string(),
  timePlanRefId: z.string(),
  date: z
    .string()
    .regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/)
    .optional(),
});

const CreateFormSchema = z.object({
  userTimezone: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string().optional(),
  durationMins: z.string().transform((v) => parseInt(v, 10)),
  bufferBeforeMins: z.string().optional(),
  bufferAfterMins: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  const activityResponse = await apiClient.timePlans.timePlanActivityLoadTarget(
    {
      ref_id: query.timePlanActivityRefId,
      allow_archived: true,
    },
  );

  return {
    date: query.date,
    timePlanActivity: activityResponse.time_plan_activity,
    targetInboxTask: activityResponse.target_inbox_task,
    targetBigPlan: activityResponse.target_big_plan,
    targetTodoTask: activityResponse.target_todo_task,
    targetHabit: activityResponse.target_habit,
    targetHabitStack: activityResponse.target_habit_stack,
    targetChore: activityResponse.target_chore,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const activityResponse =
      await apiClient.timePlans.timePlanActivityLoadTarget({
        ref_id: query.timePlanActivityRefId,
        allow_archived: true,
      });

    if (
      isTimePlanActivityHabitStackTarget(
        activityResponse.time_plan_activity.target,
      ) &&
      activityResponse.target_habit_stack
    ) {
      const timePlanResult = await apiClient.timePlans.timePlanLoad({
        ref_id: query.timePlanRefId,
        allow_archived: true,
        include_targets: true,
        include_completed_nontarget: false,
        include_other_time_plans: false,
      });
      const memberActivities = habitActivitiesForStackMembers(
        timePlanResult.activities,
        activityResponse.habit_stack_members,
      );
      const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
        form,
        form.userTimezone,
      );
      for (const memberActivity of memberActivities) {
        await apiClient.timeEvents.timeEventInDayBlockCreateForTimePlanActivity(
          {
            time_plan_activity_ref_id: memberActivity.ref_id,
            start_date: startDate,
            start_time_in_day: startTimeInDay ?? "",
            duration_mins: form.durationMins,
            buffer_before_mins: parseTimeEventBufferMins(form.bufferBeforeMins),
            buffer_after_mins: parseTimeEventBufferMins(form.bufferAfterMins),
          },
        );
      }
    } else {
      const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
        form,
        form.userTimezone,
      );

      await apiClient.timeEvents.timeEventInDayBlockCreateForTimePlanActivity({
        time_plan_activity_ref_id: query.timePlanActivityRefId,
        start_date: startDate,
        start_time_in_day: startTimeInDay ?? "",
        duration_mins: form.durationMins,
        buffer_before_mins: parseTimeEventBufferMins(form.bufferBeforeMins),
        buffer_after_mins: parseTimeEventBufferMins(form.bufferAfterMins),
      });
    }

    return redirect(
      `/app/workspace/apps/time-plans/${query.timePlanRefId}/${query.timePlanActivityRefId}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function TimeEventInDayBlockCreateForTimePlanActivity() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlanActivity.archived;

  const rightNow = DateTime.local({ zone: topLevelInfo.user.timezone });

  const [startDate, setStartDate] = useState(rightNow.toFormat("yyyy-MM-dd"));
  const [startTimeInDay, setStartTimeInDay] = useState(
    rightNow.toFormat("HH:mm"),
  );
  const [durationMins, setDurationMins] = useState(60);
  const [bufferBeforeMins, setBufferBeforeMins] = useState<number | null>(null);
  const [bufferAfterMins, setBufferAfterMins] = useState<number | null>(null);

  useEffect(() => {
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate")!);
      setStartTimeInDay(query.get("sourceStartTimeInDay")!);
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins")!, 10));
    }
  }, [query]);

  return (
    <LeafPanel
      key="time-event-in-day-block/new"
      fakeKey="time-event-in-day-block/new"
      returnLocation={calendarLeafReturnLocation(query)}
      inputsEnabled={inputsEnabled}
    >
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-event-in-day-block-properties"
        title="Properties"
        actions={
          <SectionActions
            id="time-event-in-day-block-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <input
          type="hidden"
          name="userTimezone"
          value={topLevelInfo.user.timezone}
        />

        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            defaultValue={timePlanActivityTargetNameForEvent(
              loaderData.targetInboxTask,
              loaderData.targetBigPlan,
              loaderData.timePlanActivity.ref_id,
              loaderData.targetTodoTask,
              loaderData.targetHabit,
              loaderData.targetChore,
              loaderData.targetHabitStack,
            )}
            readOnly={true}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startTimeInDay" shrink margin="dense">
            Start Time
          </InputLabel>
          <OutlinedInput
            type="time"
            label="startTimeInDay"
            name="startTimeInDay"
            readOnly={!inputsEnabled}
            value={startTimeInDay}
            onChange={(e) => setStartTimeInDay(e.target.value)}
          />

          <FieldError
            actionResult={actionData}
            fieldName="/start_time_in_day"
          />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup variant="outlined" disabled={!inputsEnabled}>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 15 ? "contained" : "outlined"}
              onClick={() => setDurationMins(15)}
            >
              15m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 30 ? "contained" : "outlined"}
              onClick={() => setDurationMins(30)}
            >
              30m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 60 ? "contained" : "outlined"}
              onClick={() => setDurationMins(60)}
            >
              60m
            </Button>
          </ButtonGroup>

          <FormControl fullWidth>
            <InputLabel id="durationMins" shrink margin="dense">
              Duration (Mins)
            </InputLabel>
            <OutlinedInput
              type="number"
              label="Duration (Mins)"
              name="durationMins"
              readOnly={!inputsEnabled}
              value={durationMins}
              onChange={(e) => {
                if (Number.isNaN(parseInt(e.target.value, 10))) {
                  setDurationMins(0);
                  e.preventDefault();
                  return;
                }

                return setDurationMins(parseInt(e.target.value, 10));
              }}
            />

            <FieldError actionResult={actionData} fieldName="/duration_mins" />
          </FormControl>
        </Stack>

        <TimeEventBuffersEditor
          inputsEnabled={inputsEnabled}
          bufferBeforeMins={bufferBeforeMins}
          bufferAfterMins={bufferAfterMins}
          onBufferBeforeMinsChange={setBufferBeforeMins}
          onBufferAfterMinsChange={setBufferAfterMins}
          actionResult={actionData}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (_params, searchParams) => calendarLeafReturnLocation(searchParams),
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the event in day! Please try again!`,
  },
);
