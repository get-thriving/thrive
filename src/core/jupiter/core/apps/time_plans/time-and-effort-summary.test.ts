/**
 * What an activity's scheduling params do to a plan's load.
 */
import type {
  Habit,
  InboxTask,
  TimePlanActivity,
} from "@jupiter/webapi-client";
import {
  Difficulty,
  Eisen,
  InboxTaskStatus,
  RecurringTaskPeriod,
  Schedulability,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import { computeTimeAndEffortSummary } from "#/core/apps/time_plans/time-and-effort-summary";

function habit(fields: Partial<Habit> = {}): Habit {
  return {
    ref_id: "40",
    version: 1,
    archived: false,
    name: "A habit",
    aspect_ref_id: "1",
    chapter_ref_id: null,
    goal_ref_id: null,
    stack_ref_id: null,
    is_key: false,
    gen_params: {
      period: RecurringTaskPeriod.DAILY,
      eisen: Eisen.REGULAR,
      difficulty: Difficulty.EASY,
    },
    scheduling_params: {
      schedulability: Schedulability.SCHEDULABLE,
      // A half hour, once - the same as the MEDIUM inbox task below infers.
      event_duration_mins: 30,
      event_count: 1,
    },
    suspended: false,
    repeats_strategy: null,
    repeats_in_period_count: null,
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as Habit;
}

function inboxTask(fields: Partial<InboxTask> = {}): InboxTask {
  return {
    ref_id: "10",
    version: 1,
    archived: false,
    name: "A task",
    owner: "Habit:std:40",
    status: InboxTaskStatus.NOT_STARTED,
    is_key: false,
    eisen: Eisen.REGULAR,
    // A medium task is inferred at 30 minutes.
    difficulty: Difficulty.MEDIUM,
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as InboxTask;
}

function activity(fields: Partial<TimePlanActivity> = {}): TimePlanActivity {
  return {
    ref_id: "900",
    version: 1,
    archived: false,
    name: "An activity",
    time_plan_ref_id: "5",
    target: "InboxTask:std:10",
    kind: TimePlanActivityKind.FINISH,
    feasability: TimePlanActivityFeasability.MUST_DO,
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as TimePlanActivity;
}

function summaryFor(
  habits: Habit[],
  activities: TimePlanActivity[] = [activity()],
  tasks: InboxTask[] = [inboxTask()],
) {
  return computeTimeAndEffortSummary({
    timePlanActivities: activities,
    targetInboxTasksByRefId: new Map(tasks.map((task) => [task.ref_id, task])),
    activityDoneness: { "900": TimePlanActivityDoneness.WORKING },
    completedNontargetInboxTasks: [],
    targetHabitsByRefId: new Map(habits.map((h) => [h.ref_id, h])),
  });
}

describe("computeTimeAndEffortSummary", () => {
  it("counts an activity at the duration its difficulty implies", () => {
    const summary = summaryFor([habit()]);

    expect(summary.planned.totalActivities).toEqual(1);
    expect(summary.planned.totalHours).toEqual(0.5);
    expect(summary.achieved.totalHours).toEqual(0.5);
  });

  it("leaves out an activity whose entity cannot be scheduled", () => {
    const summary = summaryFor([
      habit({
        scheduling_params: {
          schedulability: Schedulability.NOT_SCHEDULABLE,
          event_duration_mins: null,
          event_count: null,
        },
      }),
    ]);

    expect(summary.planned.totalActivities).toEqual(0);
    expect(summary.planned.totalScore).toEqual(0);
    expect(summary.planned.totalHours).toEqual(0);
    expect(summary.achieved.totalHours).toEqual(0);
    expect(
      summary.achieved.totalActivitiesByDoneness[
        TimePlanActivityDoneness.WORKING
      ],
    ).toEqual(0);
  });

  it("uses the duration hint over the one the difficulty implies", () => {
    const summary = summaryFor([
      habit({
        scheduling_params: {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: 90,
          event_count: null,
        },
      }),
    ]);

    expect(summary.planned.totalHours).toEqual(1.5);
  });

  it("asks for as much time as the event count needs", () => {
    const summary = summaryFor([
      habit({
        scheduling_params: {
          schedulability: Schedulability.SCHEDULABLE,
          event_duration_mins: 30,
          event_count: 3,
        },
      }),
    ]);

    expect(summary.planned.totalHours).toEqual(1.5);
    expect(
      summary.planned.hoursByFeasability[TimePlanActivityFeasability.MUST_DO],
    ).toEqual(1.5);
  });

  it("counts an activity whose entity isn't loaded, as before", () => {
    // Nothing carrying scheduling params is loaded, so the duration the
    // difficulty implies is all there is to go on - a medium task, so 30 mins.
    const summary = summaryFor([]);

    expect(summary.planned.totalActivities).toEqual(1);
    expect(summary.planned.totalHours).toEqual(0.5);
  });

  it("follows the habit an activity points at directly", () => {
    const summary = summaryFor(
      [
        habit({
          scheduling_params: {
            schedulability: Schedulability.NOT_SCHEDULABLE,
            event_duration_mins: null,
            event_count: null,
          },
        }),
      ],
      [activity({ target: "Habit:std:40" })],
    );

    expect(summary.planned.totalActivities).toEqual(0);
  });
});
