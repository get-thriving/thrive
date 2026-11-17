import { WorkspaceFeature } from "@jupiter/webapi-client";

import type { NewEntityGroup } from "#/core/infra/component/shell/new-entity-group";

const W = "/app/workspace";
const A = `${W}/apps`;

/**
 * Every kind of item that can be created from its `new` page without something
 * else to hang it on, by app, in the order of the rail. A page that creates an
 * item inside another (a milestone of a big plan, an entry of a metric, a doc
 * of a directory) is not here: it needs that one open. A test checks that every
 * such page of the apps is listed, so a new one is not forgotten.
 */
export const NEW_ENTITY_CATALOG: NewEntityGroup[] = [
  {
    title: "Todos",
    features: [WorkspaceFeature.TODO_TASK],
    entries: [{ label: "Todo", to: `${A}/todos/new` }],
  },
  {
    title: "Time plans",
    features: [WorkspaceFeature.TIME_PLANS],
    entries: [
      { label: "Time plan", to: `${A}/time-plans/new` },
      { label: "Time plan question", to: `${A}/time-plans/questions/new` },
    ],
  },
  {
    title: "Calendar",
    features: [WorkspaceFeature.SCHEDULE],
    entries: [
      {
        label: "Event in a day",
        to: `${W}/calendar/schedule/event-in-day/new`,
      },
      {
        label: "Full days event",
        to: `${W}/calendar/schedule/event-full-days/new`,
      },
      { label: "Stream", to: `${W}/calendar/schedule/stream/new` },
      { label: "Export", to: `${W}/calendar/schedule/export/new` },
    ],
  },
  {
    title: "Habits",
    features: [WorkspaceFeature.HABITS],
    entries: [
      { label: "Habit", to: `${A}/habits/habits/new` },
      { label: "Habit stack", to: `${A}/habits/stacks/new` },
    ],
  },
  {
    title: "Chores",
    features: [WorkspaceFeature.CHORES],
    entries: [
      { label: "Chore", to: `${A}/chores/chores/new` },
      { label: "Chore stack", to: `${A}/chores/stacks/new` },
    ],
  },
  {
    title: "Big plans",
    features: [WorkspaceFeature.BIG_PLANS],
    entries: [{ label: "Big plan", to: `${A}/big-plans/new` }],
  },
  {
    title: "Journals",
    features: [WorkspaceFeature.JOURNALS],
    entries: [
      { label: "Journal", to: `${A}/journals/new` },
      { label: "Journal question", to: `${A}/journals/questions/new` },
    ],
  },
  {
    title: "Vacations",
    features: [WorkspaceFeature.VACATIONS],
    entries: [
      { label: "Vacation", to: `${A}/vacations/vacation/new` },
      { label: "Travel wish", to: `${A}/vacations/wish-list/new` },
    ],
  },
  {
    title: "Life plan",
    features: [WorkspaceFeature.LIFE_PLAN],
    entries: [
      { label: "Aspect", to: `${A}/life-plan/aspects/new` },
      { label: "Goal", to: `${A}/life-plan/goals/new` },
      { label: "Chapter", to: `${A}/life-plan/chapters/new` },
      { label: "Milestone", to: `${A}/life-plan/milestones/new` },
    ],
  },
  {
    title: "Smart lists",
    features: [WorkspaceFeature.SMART_LISTS],
    entries: [{ label: "Smart list", to: `${A}/smart-lists/new` }],
  },
  {
    title: "Metrics",
    features: [WorkspaceFeature.METRICS],
    entries: [{ label: "Metric", to: `${A}/metrics/new` }],
  },
  {
    title: "PRM",
    features: [WorkspaceFeature.PRM],
    entries: [
      { label: "Person", to: `${A}/prm/persons/new` },
      { label: "Circle", to: `${A}/prm/circles/new` },
    ],
  },
  {
    title: "Core",
    entries: [
      { label: "Tag", to: `${W}/core/tags/new` },
      { label: "Contact", to: `${W}/core/contacts/new` },
      { label: "Location", to: `${W}/core/locations/new` },
    ],
  },
  {
    title: "Home and access",
    entries: [
      { label: "Home tab", to: `${W}/home/settings/tabs/new` },
      { label: "API key", to: `${W}/access/api-keys/new` },
      { label: "MCP key", to: `${W}/access/mcp-keys/new` },
    ],
  },
];
