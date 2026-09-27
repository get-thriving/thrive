import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import {
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router";
import { DateTime } from "luxon";
import { useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { TimeEventBuffersEditor } from "#/core/common/sub/time_events/component/buffers-editor";
import { TimeEventParamsSource } from "#/core/common/sub/time_events/component/params-source";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { timePlanActivityTargetNameForEvent } from "#/core/apps/time_plans/sub/activity/root";
import { habitActivitiesForStackMembers } from "#/core/apps/time_plans/sub/activity/habit-chore-group";
import { selectActivityWithTarget } from "#/core/apps/time_plans/store/activity-target";
import { withTimePlanView } from "#/core/apps/time_plans/view-mode";
import { useTimePlanStore } from "#/core/apps/time_plans/store/context";
import { useTimePlanMutation } from "#/core/apps/time_plans/store/mutation";
import { PLACE_TIME_EVENTS } from "#/core/apps/time_plans/store/mutations/place-time-events";

const ParamsSchema = z.object({
  id: z.string(),
});

const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

export const handle = {
  displayType: DisplayType.LEAF,
};

// The activity and what it targets are already in the plan's store, so this
// leaf loads nothing of its own.
export default function TimePlanActivityTimeEventNew() {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const { id } = useParams();
  const [query] = useSearchParams();
  const timePlanView = query;
  const navigate = useNavigate();
  const { entities } = useTimePlanStore();
  const {
    runForResult: runPlaceTimeEvents,
    inFlight,
    error,
  } = useTimePlanMutation(PLACE_TIME_EVENTS);
  const activityRefId = query.get("timePlanActivityRefId") ?? "";
  const queryDate = query.get("date");
  const activity = useMemo(
    () => selectActivityWithTarget(entities, activityRefId),
    [entities, activityRefId],
  );

  // Making the event is a local edit: it shows up on the calendar right away,
  // and going on to the activity doesn't reload the plan. A habit stack's event
  // goes on each of its member habits' activities in the plan.
  const intentHandlers = useMemo(
    () => ({
      create: (formData: FormData) => {
        if (activity === null) {
          return;
        }
        const activityLocation = withTimePlanView(
          `/app/workspace/apps/time-plans/${id}/${activity.timePlanActivity.ref_id}`,
          timePlanView,
        );
        const planActivities = Object.values(entities.activities).filter(
          (it) => it.time_plan_ref_id === id && !it.archived,
        );
        const activities =
          activity.targetHabitStack !== null
            ? habitActivitiesForStackMembers(
                planActivities,
                activity.habitStackMembers,
              )
            : [activity.timePlanActivity];
        if (activities.length === 0) {
          navigate(activityLocation);
          return;
        }
        const durationMins = parseInt(
          String(formData.get("durationMins") ?? ""),
          10,
        );
        void runPlaceTimeEvents({
          placements: activities.map((it) => ({
            activityRefId: it.ref_id,
            durationMins,
          })),
          startDate: String(formData.get("startDate") ?? ""),
          startTimeInDay: String(formData.get("startTimeInDay") ?? ""),
          userTimezone: String(formData.get("userTimezone") ?? ""),
          bufferBeforeMins: String(formData.get("bufferBeforeMins") ?? ""),
          bufferAfterMins: String(formData.get("bufferAfterMins") ?? ""),
          placeholderRefId: crypto.randomUUID(),
          modifiedTime: new Date().toISOString(),
        }).then((result) => {
          if (result !== null) {
            navigate(activityLocation);
          }
        });
      },
    }),
    [
      activity,
      entities.activities,
      id,
      timePlanView,
      navigate,
      runPlaceTimeEvents,
    ],
  );

  const rightNow = DateTime.local({ zone: topLevelInfo.user.timezone });

  const [startDate, setStartDate] = useState(
    queryDate !== null && DATE_PATTERN.test(queryDate)
      ? queryDate
      : rightNow.toFormat("yyyy-MM-dd"),
  );
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

  if (activity === null) {
    throw new Error(`Could not find activity ${activityRefId} in this plan!`);
  }

  const inputsEnabled =
    navigation.state === "idle" &&
    !inFlight &&
    !activity.timePlanActivity.archived;

  return (
    <LeafPanel
      key="time-plan-activity-time-event/new"
      fakeKey="time-plan-activity-time-event/new"
      returnLocation={withTimePlanView(
        `/app/workspace/apps/time-plans/${id}`,
        timePlanView,
      )}
      inputsEnabled={inputsEnabled}
      initialExpansionState={LeafPanelExpansionState.SMALL}
      intentHandlers={intentHandlers}
    >
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <GlobalError actionResult={error ?? undefined} />
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
              activity.targetInboxTask,
              activity.targetBigPlan,
              activity.timePlanActivity.ref_id,
              activity.targetTodoTask,
              activity.targetHabit,
              activity.targetChore,
              activity.targetHabitStack,
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

          <FieldError
            actionResult={error ?? undefined}
            fieldName="/start_date"
          />
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
            actionResult={error ?? undefined}
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

            <FieldError
              actionResult={error ?? undefined}
              fieldName="/duration_mins"
            />
          </FormControl>
        </Stack>

        <TimeEventBuffersEditor
          inputsEnabled={inputsEnabled}
          bufferBeforeMins={bufferBeforeMins}
          bufferAfterMins={bufferAfterMins}
          onBufferBeforeMinsChange={setBufferBeforeMins}
          onBufferAfterMinsChange={setBufferAfterMins}
          actionResult={error ?? undefined}
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
    error: () =>
      `There was an error creating the event in day! Please try again!`,
  },
);
