import type { RouteConfigEntry } from "@react-router/dev/routes";
import { relative } from "@react-router/dev/routes";

// `relative` resolves the files below against this directory, so the app owns
// its route modules instead of them living in the service that mounts it.
const { route } = relative(import.meta.dirname);

/**
 * Where this app's pages sit is up to the service mounting them, so the paths
 * here are relative to whatever the caller nests them under. Route ids are
 * named rather than derived: for a module outside the service's app directory
 * the derived id is an absolute path, which would end up in the client
 * manifest.
 */
export const timePlansRoutes: RouteConfigEntry[] = [
  route("time-plans", "routes/time-plans.tsx", { id: "apps/time-plans" }, [
    route(
      "mutations/create-big-plan-inbox-task",
      "routes/time-plans/mutations/create-big-plan-inbox-task.tsx",
      { id: "apps/time-plans/mutations/create-big-plan-inbox-task" },
    ),
    route(
      "mutations/archive-time-event",
      "routes/time-plans/mutations/archive-time-event.tsx",
      { id: "apps/time-plans/mutations/archive-time-event" },
    ),
    route(
      "mutations/update-chore-stack",
      "routes/time-plans/mutations/update-chore-stack.tsx",
      { id: "apps/time-plans/mutations/update-chore-stack" },
    ),
    route(
      "mutations/update-habit-stack",
      "routes/time-plans/mutations/update-habit-stack.tsx",
      { id: "apps/time-plans/mutations/update-habit-stack" },
    ),
    route(
      "mutations/update-inbox-task",
      "routes/time-plans/mutations/update-inbox-task.tsx",
      { id: "apps/time-plans/mutations/update-inbox-task" },
    ),
    route(
      "mutations/update-time-event",
      "routes/time-plans/mutations/update-time-event.tsx",
      { id: "apps/time-plans/mutations/update-time-event" },
    ),
    route(
      "mutations/archive-activity",
      "routes/time-plans/mutations/archive-activity.tsx",
      { id: "apps/time-plans/mutations/archive-activity" },
    ),
    route(
      "mutations/create-todo-task",
      "routes/time-plans/mutations/create-todo-task.tsx",
      { id: "apps/time-plans/mutations/create-todo-task" },
    ),
    route(
      "mutations/update-todo-task",
      "routes/time-plans/mutations/update-todo-task.tsx",
      { id: "apps/time-plans/mutations/update-todo-task" },
    ),
    route(
      "mutations/create-big-plan",
      "routes/time-plans/mutations/create-big-plan.tsx",
      { id: "apps/time-plans/mutations/create-big-plan" },
    ),
    route(
      "mutations/remove-activity",
      "routes/time-plans/mutations/remove-activity.tsx",
      { id: "apps/time-plans/mutations/remove-activity" },
    ),
    route(
      "mutations/update-activity",
      "routes/time-plans/mutations/update-activity.tsx",
      { id: "apps/time-plans/mutations/update-activity" },
    ),
    route(
      "mutations/update-big-plan",
      "routes/time-plans/mutations/update-big-plan.tsx",
      { id: "apps/time-plans/mutations/update-big-plan" },
    ),
    route(
      "place-activity-time-event",
      "routes/time-plans/place-activity-time-event.tsx",
      { id: "apps/time-plans/place-activity-time-event" },
    ),
    route(
      "add-chore-stack-to-plans",
      "routes/time-plans/add-chore-stack-to-plans.tsx",
      { id: "apps/time-plans/add-chore-stack-to-plans" },
    ),
    route(
      "add-habit-stack-to-plans",
      "routes/time-plans/add-habit-stack-to-plans.tsx",
      { id: "apps/time-plans/add-habit-stack-to-plans" },
    ),
    route(
      "add-inbox-task-to-plans",
      "routes/time-plans/add-inbox-task-to-plans.tsx",
      { id: "apps/time-plans/add-inbox-task-to-plans" },
    ),
    route(
      "mutations/create-chore",
      "routes/time-plans/mutations/create-chore.tsx",
      { id: "apps/time-plans/mutations/create-chore" },
    ),
    route(
      "mutations/create-habit",
      "routes/time-plans/mutations/create-habit.tsx",
      { id: "apps/time-plans/mutations/create-habit" },
    ),
    route(
      "mutations/update-chore",
      "routes/time-plans/mutations/update-chore.tsx",
      { id: "apps/time-plans/mutations/update-chore" },
    ),
    route(
      "mutations/update-habit",
      "routes/time-plans/mutations/update-habit.tsx",
      { id: "apps/time-plans/mutations/update-habit" },
    ),
    route(
      "add-big-plan-to-plans",
      "routes/time-plans/add-big-plan-to-plans.tsx",
      { id: "apps/time-plans/add-big-plan-to-plans" },
    ),
    route(
      "mutations/create-note",
      "routes/time-plans/mutations/create-note.tsx",
      { id: "apps/time-plans/mutations/create-note" },
    ),
    route(
      "mutations/regen-chore",
      "routes/time-plans/mutations/regen-chore.tsx",
      { id: "apps/time-plans/mutations/regen-chore" },
    ),
    route(
      "mutations/regen-habit",
      "routes/time-plans/mutations/regen-habit.tsx",
      { id: "apps/time-plans/mutations/regen-habit" },
    ),
    route("add-chore-to-plans", "routes/time-plans/add-chore-to-plans.tsx", {
      id: "apps/time-plans/add-chore-to-plans",
    }),
    route("add-habit-to-plans", "routes/time-plans/add-habit-to-plans.tsx", {
      id: "apps/time-plans/add-habit-to-plans",
    }),
    route("add-todo-to-plans", "routes/time-plans/add-todo-to-plans.tsx", {
      id: "apps/time-plans/add-todo-to-plans",
    }),
    route("no-parent/:id", "routes/time-plans/no-parent/$id.tsx", {
      id: "apps/time-plans/no-parent/$id",
    }),
    route(
      "questions",
      "routes/time-plans/questions.tsx",
      { id: "apps/time-plans/questions" },
      [
        route(":id", "routes/time-plans/questions/$id.tsx", {
          id: "apps/time-plans/questions/$id",
        }),
        route("new", "routes/time-plans/questions/new.tsx", {
          id: "apps/time-plans/questions/new",
        }),
      ],
    ),
    route("settings", "routes/time-plans/settings.tsx", {
      id: "apps/time-plans/settings",
    }),
    route(":id", "routes/time-plans/$id.tsx", { id: "apps/time-plans/$id" }, [
      route(
        "add-from-current-time-plans/:otherTimePlanId",
        "routes/time-plans/$id/add-from-current-time-plans/$otherTimePlanId.tsx",
        {
          id: "apps/time-plans/$id/add-from-current-time-plans/$otherTimePlanId",
        },
      ),
      route(
        "add-from-included-big-plan-tasks",
        "routes/time-plans/$id/add-from-included-big-plan-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-included-big-plan-tasks" },
      ),
      route(
        "add-from-generated-inbox-tasks",
        "routes/time-plans/$id/add-from-generated-inbox-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-generated-inbox-tasks" },
      ),
      route(
        "add-from-big-plan-inbox-tasks",
        "routes/time-plans/$id/add-from-big-plan-inbox-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-big-plan-inbox-tasks" },
      ),
      route(
        "add-from-included-chore-tasks",
        "routes/time-plans/$id/add-from-included-chore-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-included-chore-tasks" },
      ),
      route(
        "add-from-included-habit-tasks",
        "routes/time-plans/$id/add-from-included-habit-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-included-habit-tasks" },
      ),
      route(
        "add-from-current-todo-tasks",
        "routes/time-plans/$id/add-from-current-todo-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-current-todo-tasks" },
      ),
      route(
        "calendar-event/:kind/:refId",
        "routes/time-plans/$id/calendar-event/$kind/$refId.tsx",
        { id: "apps/time-plans/$id/calendar-event/$kind/$refId" },
      ),
      route(
        "add-from-chore-inbox-tasks",
        "routes/time-plans/$id/add-from-chore-inbox-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-chore-inbox-tasks" },
      ),
      route(
        "add-from-current-big-plans",
        "routes/time-plans/$id/add-from-current-big-plans.tsx",
        { id: "apps/time-plans/$id/add-from-current-big-plans" },
      ),
      route(
        "add-from-habit-inbox-tasks",
        "routes/time-plans/$id/add-from-habit-inbox-tasks.tsx",
        { id: "apps/time-plans/$id/add-from-habit-inbox-tasks" },
      ),
      route(
        "new-schedule-event-in-day",
        "routes/time-plans/$id/new-schedule-event-in-day.tsx",
        { id: "apps/time-plans/$id/new-schedule-event-in-day" },
      ),
      route(
        "add-from-current-chores",
        "routes/time-plans/$id/add-from-current-chores.tsx",
        { id: "apps/time-plans/$id/add-from-current-chores" },
      ),
      route(
        "add-from-current-habits",
        "routes/time-plans/$id/add-from-current-habits.tsx",
        { id: "apps/time-plans/$id/add-from-current-habits" },
      ),
      route(
        "new-activity-time-event",
        "routes/time-plans/$id/new-activity-time-event.tsx",
        { id: "apps/time-plans/$id/new-activity-time-event" },
      ),
      route(
        "new-big-plan-inbox-task",
        "routes/time-plans/$id/new-big-plan-inbox-task.tsx",
        { id: "apps/time-plans/$id/new-big-plan-inbox-task" },
      ),
      route("new-todo-task", "routes/time-plans/$id/new-todo-task.tsx", {
        id: "apps/time-plans/$id/new-todo-task",
      }),
      route("new-big-plan", "routes/time-plans/$id/new-big-plan.tsx", {
        id: "apps/time-plans/$id/new-big-plan",
      }),
      route(":activityId", "routes/time-plans/$id/$activityId.tsx", {
        id: "apps/time-plans/$id/$activityId",
      }),
      route("new-chore", "routes/time-plans/$id/new-chore.tsx", {
        id: "apps/time-plans/$id/new-chore",
      }),
      route("new-habit", "routes/time-plans/$id/new-habit.tsx", {
        id: "apps/time-plans/$id/new-habit",
      }),
    ]),
    route("new", "routes/time-plans/new.tsx", { id: "apps/time-plans/new" }),
  ]),
];
