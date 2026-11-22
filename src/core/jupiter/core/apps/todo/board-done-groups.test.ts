import type { InboxTask } from "@jupiter/webapi-client";
import { InboxTaskStatus } from "@jupiter/webapi-client";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import {
  groupTodoBoardDoneByDay,
  isTodoBoardRecentlyFinishedArchivedTask,
  todoBoardDayLabel,
  todoBoardFinishedTime,
} from "#/core/apps/todo/board-done-groups";
import {
  TodoBoardColumn,
  todoBoardColumnForStatus,
  todoBoardStatusForColumn,
} from "#/core/apps/todo/board-column";

// Wednesday, 2026-11-11, 10:00 in Bucharest (08:00 UTC).
const NOW = DateTime.fromISO("2026-11-11T08:00:00Z", { zone: "UTC" });
const TZ = "Europe/Bucharest";

function task(refId: string, fields: Partial<InboxTask> = {}): InboxTask {
  return {
    ref_id: refId,
    version: 1,
    archived: false,
    created_time: "2026-10-01T08:00:00Z",
    last_modified_time: "2026-10-01T08:00:00Z",
    name: refId,
    status: InboxTaskStatus.DONE,
    completed_time: "2026-11-11T07:00:00Z",
    ...fields,
  } as InboxTask;
}

describe("todo board columns", () => {
  it("puts not started and blocked in to do, in progress in doing, both endings in done", () => {
    expect(todoBoardColumnForStatus(InboxTaskStatus.NOT_STARTED)).toBe(
      TodoBoardColumn.TODO,
    );
    expect(todoBoardColumnForStatus(InboxTaskStatus.BLOCKED)).toBe(
      TodoBoardColumn.TODO,
    );
    expect(todoBoardColumnForStatus(InboxTaskStatus.IN_PROGRESS)).toBe(
      TodoBoardColumn.DOING,
    );
    expect(todoBoardColumnForStatus(InboxTaskStatus.DONE)).toBe(
      TodoBoardColumn.DONE,
    );
    expect(todoBoardColumnForStatus(InboxTaskStatus.NOT_DONE)).toBe(
      TodoBoardColumn.DONE,
    );
  });

  it("gives a dropped task the plain status of the column", () => {
    expect(todoBoardStatusForColumn(TodoBoardColumn.TODO)).toBe(
      InboxTaskStatus.NOT_STARTED,
    );
    expect(todoBoardStatusForColumn(TodoBoardColumn.DOING)).toBe(
      InboxTaskStatus.IN_PROGRESS,
    );
    expect(todoBoardStatusForColumn(TodoBoardColumn.DONE)).toBe(
      InboxTaskStatus.DONE,
    );
  });
});

describe("groupTodoBoardDoneByDay", () => {
  it("groups by finished day in the user's timezone, latest first", () => {
    const groups = groupTodoBoardDoneByDay(
      [
        task("early-today", { completed_time: "2026-11-10T22:30:00Z" }), // 00:30 on the 11th in Bucharest
        task("yesterday", { completed_time: "2026-11-10T12:00:00Z" }),
        task("late-today", { completed_time: "2026-11-11T07:30:00Z" }),
        task("older", {
          completed_time: "2026-11-07T12:00:00Z",
          status: InboxTaskStatus.NOT_DONE,
        }),
      ],
      TZ,
      NOW,
    );

    expect(groups.map((g) => g.day)).toEqual([
      "2026-11-11",
      "2026-11-10",
      "2026-11-07",
    ]);
    expect(groups[0].inboxTasks.map((t) => t.ref_id)).toEqual([
      "late-today",
      "early-today",
    ]);
  });

  it("counts a task just dropped into done as finished now", () => {
    const groups = groupTodoBoardDoneByDay(
      [
        task("dropped", {
          status: InboxTaskStatus.IN_PROGRESS,
          completed_time: null,
        }),
        task("earlier", { completed_time: "2026-11-11T05:00:00Z" }),
      ],
      TZ,
      NOW,
      { dropped: InboxTaskStatus.DONE },
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].inboxTasks.map((t) => t.ref_id)).toEqual([
      "dropped",
      "earlier",
    ]);
  });
});

describe("isTodoBoardRecentlyFinishedArchivedTask", () => {
  it("keeps archived tasks finished in the last seven calendar days", () => {
    expect(
      isTodoBoardRecentlyFinishedArchivedTask(
        task("a", { archived: true, completed_time: "2026-11-05T12:00:00Z" }),
        TZ,
        NOW,
      ),
    ).toBe(true);
  });

  it("drops archived tasks finished before the window", () => {
    expect(
      isTodoBoardRecentlyFinishedArchivedTask(
        task("a", { archived: true, completed_time: "2026-11-04T12:00:00Z" }),
        TZ,
        NOW,
      ),
    ).toBe(false);
  });

  it("drops archived tasks that were never finished", () => {
    expect(
      isTodoBoardRecentlyFinishedArchivedTask(
        task("a", {
          archived: true,
          status: InboxTaskStatus.IN_PROGRESS,
          completed_time: null,
          archived_time: "2026-11-10T12:00:00Z",
        }),
        TZ,
        NOW,
      ),
    ).toBe(false);
  });

  it("is about archived tasks only", () => {
    expect(isTodoBoardRecentlyFinishedArchivedTask(task("a"), TZ, NOW)).toBe(
      false,
    );
  });
});

describe("todoBoardFinishedTime", () => {
  it("falls back to the archival time when there is no completion time", () => {
    const finished = todoBoardFinishedTime(
      task("a", {
        completed_time: null,
        archived_time: "2026-11-09T09:00:00Z",
      }),
      TZ,
      NOW,
    );
    expect(finished.toISODate()).toBe("2026-11-09");
  });
});

describe("todoBoardDayLabel", () => {
  it("names today and yesterday, dates the rest", () => {
    expect(todoBoardDayLabel("2026-11-11", TZ, NOW)).toBe("Today");
    expect(todoBoardDayLabel("2026-11-10", TZ, NOW)).toBe("Yesterday");
    expect(todoBoardDayLabel("2026-11-07", TZ, NOW)).toBe("Sat, Nov 7");
  });
});
