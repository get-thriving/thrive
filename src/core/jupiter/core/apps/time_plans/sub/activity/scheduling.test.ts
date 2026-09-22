/**
 * The scheduling params a time plan activity takes after, and the duration
 * they give a block placed for it.
 */
import type {
  Chore,
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
  TimePlanActivityFeasability,
  TimePlanActivityKind,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  inferDurationMinsForTimePlanActivity,
  inferRequiredDurationMinsForTimePlanActivity,
  isTimePlanActivitySchedulable,
} from "#/core/apps/time_plans/sub/activity/root";
import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";

const SCHEDULABLE = {
  schedulability: Schedulability.SCHEDULABLE,
  event_duration_mins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
  event_count: DEFAULT_SCHEDULING_EVENT_COUNT,
};

const NOT_SCHEDULABLE = {
  schedulability: Schedulability.NOT_SCHEDULABLE,
  event_duration_mins: null,
  event_count: null,
};

function habit(fields: Partial<Habit> = {}): Habit {
  return {
    ref_id: "40",
    name: "A habit",
    stack_ref_id: null,
    gen_params: {
      period: RecurringTaskPeriod.DAILY,
      eisen: Eisen.REGULAR,
      // A hard habit is inferred at 60 minutes.
      difficulty: Difficulty.HARD,
    },
    scheduling_params: SCHEDULABLE,
    ...fields,
  } as Habit;
}

function chore(fields: Partial<Chore> = {}): Chore {
  return {
    ref_id: "50",
    name: "A chore",
    stack_ref_id: "60",
    gen_params: {
      period: RecurringTaskPeriod.DAILY,
      eisen: Eisen.REGULAR,
      difficulty: Difficulty.EASY,
    },
    scheduling_params: SCHEDULABLE,
    ...fields,
  } as Chore;
}

function inboxTask(fields: Partial<InboxTask> = {}): InboxTask {
  return {
    ref_id: "10",
    name: "A task",
    owner: "Habit:std:40",
    status: InboxTaskStatus.NOT_STARTED,
    is_key: false,
    eisen: Eisen.REGULAR,
    // A medium task is inferred at 30 minutes.
    difficulty: Difficulty.MEDIUM,
    ...fields,
  } as InboxTask;
}

function activity(target: string): TimePlanActivity {
  return {
    ref_id: "900",
    name: "An activity",
    time_plan_ref_id: "5",
    target,
    kind: TimePlanActivityKind.FINISH,
    feasability: TimePlanActivityFeasability.MUST_DO,
  } as TimePlanActivity;
}

function maps(
  habits: Habit[] = [],
  chores: Chore[] = [],
  tasks: InboxTask[] = [],
) {
  return {
    inboxTasks: new Map(tasks.map((task) => [task.ref_id, task])),
    bigPlans: new Map(),
    habits: new Map(habits.map((h) => [h.ref_id, h])),
    chores: new Map(chores.map((c) => [c.ref_id, c])),
  };
}

describe("isTimePlanActivitySchedulable", () => {
  it("takes after the habit that generated the inbox task", () => {
    const m = maps(
      [habit({ scheduling_params: NOT_SCHEDULABLE })],
      [],
      [inboxTask()],
    );

    expect(
      isTimePlanActivitySchedulable(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toBe(false);
  });

  it("is true when the entity says nothing about it", () => {
    const m = maps([habit()], [], [inboxTask()]);

    expect(
      isTimePlanActivitySchedulable(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toBe(true);
  });

  it("lets a stack be scheduled when one of its members can be", () => {
    const m = maps(
      [],
      [
        chore({ ref_id: "50", scheduling_params: NOT_SCHEDULABLE }),
        chore({ ref_id: "51", scheduling_params: SCHEDULABLE }),
      ],
    );

    expect(
      isTimePlanActivitySchedulable(
        activity("ChoreStack:std:60"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toBe(true);
  });

  it("keeps a stack off the calendar when no member can be scheduled", () => {
    const m = maps(
      [],
      [
        chore({ ref_id: "50", scheduling_params: NOT_SCHEDULABLE }),
        chore({ ref_id: "51", scheduling_params: NOT_SCHEDULABLE }),
      ],
    );

    expect(
      isTimePlanActivitySchedulable(
        activity("ChoreStack:std:60"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toBe(false);
  });
});

describe("inferDurationMinsForTimePlanActivity", () => {
  it("uses the duration the entity carries", () => {
    const m = maps([habit()], [], [inboxTask()]);

    expect(
      inferDurationMinsForTimePlanActivity(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toEqual(DEFAULT_SCHEDULING_EVENT_DURATION_MINS);
  });

  it("uses the difficulty when nothing carries scheduling params", () => {
    // The habit that generated the task isn't loaded, so the medium inbox
    // task's own 30 minutes is all there is to go on.
    const m = maps([], [], [inboxTask()]);

    expect(
      inferDurationMinsForTimePlanActivity(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toEqual(30);
  });

  it("uses the duration hint of whatever generated the task", () => {
    const m = maps(
      [
        habit({
          scheduling_params: {
            schedulability: Schedulability.SCHEDULABLE,
            event_duration_mins: 75,
            event_count: 2,
          },
        }),
      ],
      [],
      [inboxTask()],
    );

    // One block is placed at the hinted length, however many are needed.
    expect(
      inferDurationMinsForTimePlanActivity(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toEqual(75);
  });
});

describe("inferRequiredDurationMinsForTimePlanActivity", () => {
  it("asks for the whole time all the events need", () => {
    const m = maps(
      [
        habit({
          scheduling_params: {
            schedulability: Schedulability.SCHEDULABLE,
            event_duration_mins: 75,
            event_count: 2,
          },
        }),
      ],
      [],
      [inboxTask()],
    );

    expect(
      inferRequiredDurationMinsForTimePlanActivity(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toEqual(150);
  });

  it("asks for nothing when it cannot be scheduled", () => {
    const m = maps(
      [habit({ scheduling_params: NOT_SCHEDULABLE })],
      [],
      [inboxTask()],
    );

    expect(
      inferRequiredDurationMinsForTimePlanActivity(
        activity("InboxTask:std:10"),
        m.inboxTasks,
        m.bigPlans,
        m.habits,
        m.chores,
      ),
    ).toEqual(0);
  });
});
