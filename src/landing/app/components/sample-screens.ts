import type { SampleScreen } from "~/components/sample-screen";
import { SAMPLE_SCREEN_PROJECTS } from "~/components/sample-screen-projects";
import { SAMPLE_SCREEN_CALENDAR } from "~/components/sample-screen-calendar";
import { SAMPLE_SCREEN_JOURNAL } from "~/components/sample-screen-journal";
import { SAMPLE_SCREEN_PEOPLE } from "~/components/sample-screen-people";
import { SAMPLE_SCREEN_SMART_LISTS } from "~/components/sample-screen-smart-lists";

const CORE_SCREENS: SampleScreen[] = [
  {
    id: "timeplan",
    label: "Time plan",
    crumb: "Plans  ›  2026  ›  Q4  ›  November  ›  W47",
    railIndex: 1,
    columns: [
      {
        kind: "list",
        units: 1,
        title: "Time plans",
        groups: [
          {
            label: "2026",
            rows: [
              { name: "2026", marker: "square" },
              { name: "Q4 · Oct–Dec", marker: "square", indent: 10 },
              { name: "November", marker: "square", indent: 20 },
              {
                name: "W47 · Nov 16–22",
                marker: "square",
                indent: 30,
                state: "selected",
              },
              {
                name: "W46 · Nov 9–15",
                marker: "square",
                indent: 30,
                state: "muted",
              },
              {
                name: "W45 · Nov 2–8",
                marker: "square",
                indent: 30,
                state: "muted",
              },
              { name: "October", marker: "square", indent: 20, state: "muted" },
            ],
          },
        ],
      },
      {
        kind: "timeplan",
        units: 5,
        title: "W47 · Nov 16–22",
        count: "9",
        focused: true,
        note: "Finish the homepage draft and lock the cabin dates. Keep the long run for Sunday, and don't let the dentist slip again.",
        stats: [
          { label: "Planned", value: "9 tasks", detail: "about 14 hours" },
          { label: "Done", value: "3 of 9", percent: 33 },
          { label: "Score", value: "46 / 118", percent: 39 },
        ],
        tasks: [
          {
            label: "Must do",
            rows: [
              {
                name: "Draft the homepage copy",
                meta: "Fri",
                marker: "circle",
                state: "selected",
              },
              {
                name: "Pick dates for the cabin",
                meta: "Wed",
                marker: "circle",
              },
              { name: "Book the dentist", meta: "Mon", marker: "circle" },
              {
                name: "Call parents",
                meta: "Mon",
                marker: "circle",
                state: "done",
              },
              {
                name: "Weekly review",
                meta: "Sun",
                marker: "circle",
                state: "done",
              },
            ],
          },
          {
            label: "Nice to do",
            rows: [
              { name: "Intervals, 6 × 400 m", meta: "Tue", marker: "circle" },
              { name: "Water the plants", meta: "Thu", marker: "circle" },
              {
                name: "Pay the electricity bill",
                meta: "Tue",
                marker: "circle",
                state: "done",
              },
            ],
          },
          {
            label: "Stretch",
            rows: [{ name: "Long run, 14 km", meta: "Sun", marker: "circle" }],
          },
        ],
        calendar: {
          days: [
            { label: "Mon 16" },
            { label: "Tue 17" },
            { label: "Wed 18" },
            { label: "Thu 19" },
            { label: "Fri 20" },
            { label: "Sat 21", today: true },
            { label: "Sun 22" },
          ],
          firstHour: 8,
          hours: 10,
          events: [
            {
              day: 0,
              start: 9,
              end: 10,
              name: "Book the dentist",
              kind: "inbox",
            },
            { day: 0, start: 10, end: 12, name: "Deep work", kind: "plan" },
            { day: 1, start: 9, end: 11, name: "Deep work", kind: "plan" },
            { day: 1, start: 12, end: 13, name: "Intervals", kind: "habit" },
            { day: 2, start: 14, end: 16, name: "Cabin dates", kind: "plan" },
            { day: 3, start: 9, end: 12, name: "Docs page", kind: "plan" },
            { day: 3, start: 17, end: 18, name: "Plants", kind: "chore" },
            { day: 4, start: 9, end: 12, name: "Homepage copy", kind: "plan" },
            { day: 4, start: 15, end: 16, name: "Review", kind: "event" },
            { day: 5, start: 10, end: 12, name: "Market", kind: "event" },
            { day: 6, start: 8, end: 10, name: "Long run", kind: "habit" },
            {
              day: 6,
              start: 16,
              end: 17,
              name: "Weekly review",
              kind: "habit",
            },
          ],
        },
      },
      {
        kind: "details",
        units: 2,
        title: "Activity",
        name: "Draft the homepage copy",
        meta: "Inbox task · from the project Launch the new site",
        properties: [
          {
            label: "Kind",
            kind: "options",
            options: ["Finish", "Progress"],
            active: 0,
          },
          {
            label: "Feasibility",
            kind: "options",
            options: ["Must do", "Nice", "Stretch"],
            active: 0,
          },
          { label: "Status", kind: "text", value: "In progress" },
          { label: "Due", kind: "text", value: "Fri, Nov 20" },
          { label: "Goal", kind: "text", value: "Work › Ship the new site" },
        ],
        sectionTitle: "Same project",
        rows: [
          {
            name: "Pick the screenshots",
            meta: "done",
            marker: "circle",
            state: "done",
          },
          {
            name: "Write the docs landing page",
            meta: "W48",
            marker: "circle",
          },
          { name: "Move the domain", meta: "W49", marker: "circle" },
        ],
      },
    ],
  },
  {
    id: "habits",
    label: "Habits",
    crumb: "Habits  ›  Plan the next day",
    railIndex: 2,
    columns: [
      {
        kind: "list",
        units: 3,
        title: "Habits",
        count: "7",
        groups: [
          {
            label: "Daily",
            rows: [
              {
                name: "Morning run",
                meta: "32d",
                marker: "circle",
                streak: "xxxx.xxxxxxxxx",
              },
              {
                name: "Read 20 pages",
                meta: "11d",
                marker: "circle",
                streak: "xx.xxx.xxxxxxx",
              },
              {
                name: "Plan the next day",
                meta: "58d",
                marker: "circle",
                state: "selected",
                streak: "xxxxxxxxxxxxxx",
              },
              {
                name: "No phone after 22:00",
                meta: "4d",
                marker: "circle",
                streak: ".x.xx.xxx.xxxx",
              },
            ],
          },
          {
            label: "Weekly",
            rows: [
              {
                name: "Call parents",
                meta: "9w",
                marker: "circle",
                streak: "----xxxxxxxxxx",
              },
              {
                name: "Weekly review",
                meta: "21w",
                marker: "circle",
                streak: "xxxxx.xxxxxxxx",
              },
            ],
          },
          {
            label: "Monthly",
            rows: [
              {
                name: "Do one thing that scares me",
                meta: "2m",
                marker: "circle",
                streak: "--------xx.xxx",
              },
            ],
          },
        ],
      },
      {
        kind: "details",
        units: 2,
        title: "Habit",
        focused: true,
        name: "Plan the next day",
        meta: "Personal › Focused",
        properties: [
          {
            label: "Period",
            kind: "options",
            options: ["Day", "Week", "Month", "Qtr", "Year"],
            active: 0,
          },
          {
            label: "Priority",
            kind: "options",
            options: ["Important", "Urgent"],
            active: 0,
          },
          {
            label: "Difficulty",
            kind: "options",
            options: ["Easy", "Medium", "Hard"],
            active: 1,
          },
          { label: "Calendar", kind: "text", value: "15 min, evenings" },
        ],
        sectionTitle: "Will generate",
        rows: [
          { name: "2026:Nov21", meta: "today", marker: "circle" },
          { name: "2026:Nov22", meta: "Sun", marker: "circle" },
          { name: "2026:Nov23", meta: "Mon", marker: "circle" },
        ],
      },
      {
        kind: "list",
        units: 2,
        title: "↳ Inbox tasks",
        count: "5",
        groups: [
          {
            label: "This week",
            rows: [
              { name: "2026:Nov21", meta: "to do", marker: "circle" },
              {
                name: "2026:Nov20",
                meta: "done",
                marker: "circle",
                state: "done",
              },
              {
                name: "2026:Nov19",
                meta: "done",
                marker: "circle",
                state: "done",
              },
              {
                name: "2026:Nov18",
                meta: "done",
                marker: "circle",
                state: "done",
              },
              {
                name: "2026:Nov17",
                meta: "missed",
                marker: "circle",
                state: "missed",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "life",
    label: "Life plan",
    crumb: "Life plan  ›  Body & Mind  ›  Run a half marathon",
    railIndex: 0,
    columns: [
      {
        kind: "list",
        units: 1,
        title: "Life plan",
        groups: [
          {
            label: "Aspects",
            rows: [
              { name: "Body & Mind", marker: "square", state: "selected" },
              { name: "Work", marker: "square" },
              { name: "Family", marker: "square" },
              { name: "Personal", marker: "square" },
              { name: "Home & Money", marker: "square" },
            ],
          },
        ],
      },
      {
        kind: "list",
        units: 2,
        title: "Body & Mind",
        count: "3 goals",
        groups: [
          {
            label: "Getting fit",
            rows: [
              {
                name: "Run a half marathon",
                meta: "2027",
                marker: "circle",
                state: "selected",
              },
              { name: "Sleep seven hours", meta: "ongoing", marker: "circle" },
            ],
          },
          {
            label: "Eating well",
            rows: [
              {
                name: "Cook at home five days a week",
                meta: "ongoing",
                marker: "circle",
              },
            ],
          },
        ],
      },
      {
        kind: "details",
        units: 3,
        title: "Goal",
        focused: true,
        name: "Run a half marathon",
        meta: "Body & Mind › Getting fit",
        properties: [
          { label: "Target", kind: "text", value: "April 2027" },
          {
            label: "Progress",
            kind: "progress",
            percent: 40,
            value: "4 of 10 milestones",
          },
          { label: "Chapter", kind: "text", value: "Getting fit" },
        ],
        sectionTitle: "Working toward it",
        rows: [
          { name: "Build to 15 km", meta: "Project · 60%", marker: "circle" },
          { name: "Morning run", meta: "Habit · daily", marker: "circle" },
          {
            name: "Intervals, 6 × 400 m",
            meta: "Habit · weekly",
            marker: "circle",
          },
          {
            name: "Buy proper running shoes",
            meta: "done",
            marker: "circle",
            state: "done",
          },
        ],
      },
    ],
  },
];

function coreScreen(id: SampleScreen["id"]): SampleScreen {
  const screen = CORE_SCREENS.find((candidate) => candidate.id === id);
  if (screen === undefined) {
    throw new Error(`No sample screen ${id}`);
  }
  return screen;
}

/** The screens the page shows, in tab order. Sample data, not a live workspace. */
export const SAMPLE_SCREENS: SampleScreen[] = [
  coreScreen("timeplan"),
  SAMPLE_SCREEN_PROJECTS,
  SAMPLE_SCREEN_CALENDAR,
  coreScreen("habits"),
  SAMPLE_SCREEN_SMART_LISTS,
  SAMPLE_SCREEN_JOURNAL,
  SAMPLE_SCREEN_PEOPLE,
  coreScreen("life"),
];
