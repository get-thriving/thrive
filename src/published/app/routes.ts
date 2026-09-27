import type { RouteConfig } from "@react-router/dev/routes";
import { layout, route } from "@react-router/dev/routes";

// Every route this app serves, listed explicitly. The `/publish` prefix comes
// from the router basename in react-router.config.ts, so the shell below is a
// layout with no path of its own.

export default [
  layout("routes/publish.tsx", [
    route(
      "schedule-event-full-days/:externalId",
      "routes/publish/schedule-event-full-days/$externalId.tsx",
    ),
    route(
      "schedule-event-in-day/:externalId",
      "routes/publish/schedule-event-in-day/$externalId.tsx",
    ),
    route(
      "doc/dir/:externalId/dir/:dirId",
      "routes/publish/doc/dir/$externalId.dir/$dirId.tsx",
    ),
    route(
      "doc/dirtree/:externalId/:dirId",
      "routes/publish/doc/dirtree/$externalId/$dirId.tsx",
      [
        route(
          ":docId",
          "routes/publish/doc/dirtree/$externalId/$dirId/$docId.tsx",
        ),
      ],
    ),
    route(
      "schedule-stream/:externalId",
      "routes/publish/schedule-stream/$externalId.tsx",
      [
        route(
          "full-days-event/:eventId",
          "routes/publish/schedule-stream/$externalId/full-days-event/$eventId.tsx",
        ),
        route(
          "in-day-event/:eventId",
          "routes/publish/schedule-stream/$externalId/in-day-event/$eventId.tsx",
        ),
      ],
    ),
    route(
      "smart-list/item/:externalId",
      "routes/publish/smart-list/item/$externalId.tsx",
    ),
    route(
      "metric/entry/:externalId",
      "routes/publish/metric/entry/$externalId.tsx",
    ),
    route(
      "chore-stack/:externalId",
      "routes/publish/chore-stack/$externalId.tsx",
    ),
    route(
      "habit-stack/:externalId",
      "routes/publish/habit-stack/$externalId.tsx",
    ),
    route(
      "smart-list/:externalId",
      "routes/publish/smart-list/$externalId.tsx",
      [route(":itemId", "routes/publish/smart-list/$externalId/$itemId.tsx")],
    ),
    route("time-plan/:externalId", "routes/publish/time-plan/$externalId.tsx"),
    route("todo-task/:externalId", "routes/publish/todo-task/$externalId.tsx"),
    route("big-plan/:externalId", "routes/publish/big-plan/$externalId.tsx"),
    route("vacation/:externalId", "routes/publish/vacation/$externalId.tsx"),
    route("doc/dir/:externalId", "routes/publish/doc/dir/$externalId.tsx"),
    route("doc/doc/:externalId", "routes/publish/doc/doc/$externalId.tsx"),
    route("journal/:externalId", "routes/publish/journal/$externalId.tsx"),
    route("metric/:externalId", "routes/publish/metric/$externalId.tsx", [
      route(":entryId", "routes/publish/metric/$externalId/$entryId.tsx"),
    ]),
    route("person/:externalId", "routes/publish/person/$externalId.tsx"),
    route("chore/:externalId", "routes/publish/chore/$externalId.tsx"),
    route("habit/:externalId", "routes/publish/habit/$externalId.tsx"),
    route(":externalId", "routes/publish/$externalId.tsx"),
  ]),
  route("healthz", "routes/healthz.tsx"),
  route("render-fix", "routes/render-fix.tsx"),
] satisfies RouteConfig;
