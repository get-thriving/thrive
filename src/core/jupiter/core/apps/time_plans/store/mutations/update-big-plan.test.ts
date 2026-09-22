import type { BigPlan, InboxTask } from "@jupiter/webapi-client";
import {
  BigPlanStatus,
  Difficulty,
  Eisen,
  Schedulability,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  UPDATE_BIG_PLAN,
  updateBigPlanArgsFromForm,
} from "#/core/apps/time_plans/store/mutations/update-big-plan";
import {
  createTimePlanStore,
  seedTimePlanSource,
  selectTimePlanEntities,
} from "#/core/apps/time_plans/store/store";
import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";

const MODIFIED = "2026-09-14T10:00:00Z";

function bigPlan(fields: Partial<BigPlan> = {}): BigPlan {
  return {
    ref_id: "500",
    version: 1,
    archived: false,
    name: "Stored name",
    aspect_ref_id: "1",
    chapter_ref_id: "2",
    goal_ref_id: null,
    status: BigPlanStatus.NOT_STARTED,
    is_key: false,
    eisen: Eisen.REGULAR,
    difficulty: Difficulty.EASY,
    actionable_date: null,
    due_date: null,
    dependency_ref_ids: [],
    last_modified_time: "2026-09-01T00:00:00Z",
    ...fields,
  } as BigPlan;
}

function editorForm(fields: Record<string, string>): FormData {
  const formData = new FormData();
  const values = {
    RefId: "500",
    Name: "Edited name",
    Status: BigPlanStatus.IN_PROGRESS,
    Eisen: Eisen.IMPORTANT,
    Difficulty: Difficulty.HARD,
    ActionableDate: "",
    DueDate: "2026-09-30",
    DependencyRefIds: "",
    ...fields,
  };
  for (const [name, value] of Object.entries(values)) {
    formData.set(`targetBigPlan${name}`, value);
  }
  return formData;
}

describe("updateBigPlanArgsFromForm", () => {
  it("takes the edited fields and the status the intent leads to", () => {
    const args = updateBigPlanArgsFromForm(
      "mark-done",
      editorForm({ Aspect: "3", Chapter: "4", Goal: "" }),
      MODIFIED,
      "targetBigPlan",
    );

    expect(args).toEqual({
      refId: "500",
      name: "Edited name",
      status: BigPlanStatus.DONE,
      lifePlan: { aspectRefId: "3", chapterRefId: "4", goalRefId: null },
      isKey: false,
      eisen: Eisen.IMPORTANT,
      difficulty: Difficulty.HARD,
      actionableDate: null,
      dueDate: "2026-09-30",
      schedulingParams: {
        schedulability: Schedulability.SCHEDULABLE,
        eventDurationMins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
        eventCount: DEFAULT_SCHEDULING_EVENT_COUNT,
      },
      dependencyRefIds: [],
      modifiedTime: MODIFIED,
    });
  });

  it("reads the dependencies the multi-select joined", () => {
    const args = updateBigPlanArgsFromForm(
      "update",
      editorForm({ DependencyRefIds: "7, 8" }),
      MODIFIED,
      "targetBigPlan",
    );

    expect(args.status).toBe(BigPlanStatus.IN_PROGRESS);
    expect(args.dependencyRefIds).toEqual(["7", "8"]);
    expect(args.lifePlan).toBeNull();
  });
});

describe("UPDATE_BIG_PLAN", () => {
  const args = {
    refId: "500",
    name: "Edited name",
    status: BigPlanStatus.DONE,
    lifePlan: null,
    isKey: true,
    eisen: Eisen.IMPORTANT,
    difficulty: Difficulty.HARD,
    actionableDate: null,
    dueDate: "2026-09-30",
    dependencyRefIds: ["7", "8"],
    schedulingParams: {
      schedulability: Schedulability.SCHEDULABLE,
      eventDurationMins: DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
      eventCount: DEFAULT_SCHEDULING_EVENT_COUNT,
    },
    modifiedTime: MODIFIED,
  };

  it("patches the big plan, keeping its life plan when none was sent", () => {
    const entities = UPDATE_BIG_PLAN.applyOptimistic(
      selectTimePlanEntities(
        seedTimePlanSource(createTimePlanStore(), "plan", {
          bigPlans: [bigPlan()],
        }),
      ),
      args,
    );

    expect(entities.bigPlans["500"]).toMatchObject({
      name: "Edited name",
      status: BigPlanStatus.DONE,
      chapter_ref_id: "2",
      dependency_ref_ids: ["7", "8"],
      last_modified_time: MODIFIED,
    });
  });

  it("sends the dependencies the way the multi-select does", () => {
    expect(UPDATE_BIG_PLAN.toFormFields(args).dependencyRefIds).toBe("7,8");
  });

  it("merges back the big plan and the inbox tasks it changed", () => {
    const updatedBigPlan = bigPlan({ version: 2 });
    const updatedInboxTasks = [{ ref_id: "100" } as InboxTask];

    expect(
      UPDATE_BIG_PLAN.toDelta({
        updated_big_plan: updatedBigPlan,
        updated_inbox_tasks: updatedInboxTasks,
      }),
    ).toEqual({ bigPlans: [updatedBigPlan], inboxTasks: updatedInboxTasks });
  });
});
