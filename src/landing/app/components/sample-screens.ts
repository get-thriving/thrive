import type { SampleScreen } from "~/components/sample-screen";

/** The screens the page shows. Sample data, not a live workspace. */
export const SAMPLE_SCREENS: SampleScreen[] = [
  {
    id: "week",
    label: "Week plan",
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
        kind: "board",
        units: 3,
        title: "W47 · Nov 16–22",
        count: "9",
        focused: true,
        lanes: [
          {
            label: "To do",
            cards: [
              {
                name: "Long run, 14 km",
                tag: "Habit",
                tagKind: "habit",
                due: "Sun",
              },
              {
                name: "Pick dates for the cabin",
                tag: "Big plan · Winter trip",
                tagKind: "plan",
                due: "Wed",
              },
              {
                name: "Water the plants",
                tag: "Chore",
                tagKind: "chore",
                due: "Thu",
              },
              {
                name: "Book the dentist",
                tag: "Inbox",
                tagKind: "inbox",
                due: "Mon",
              },
            ],
          },
          {
            label: "Doing",
            cards: [
              {
                name: "Draft the homepage copy",
                tag: "Big plan · New site",
                tagKind: "plan",
                due: "Fri",
                state: "selected",
              },
              {
                name: "Intervals, 6 × 400 m",
                tag: "Habit",
                tagKind: "habit",
                due: "Tue",
              },
            ],
          },
          {
            label: "Done",
            cards: [
              {
                name: "Call parents",
                tag: "Habit",
                tagKind: "habit",
                due: "Mon",
                state: "done",
              },
              {
                name: "Pay the electricity bill",
                tag: "Chore",
                tagKind: "chore",
                due: "Tue",
                state: "done",
              },
              {
                name: "Weekly review",
                tag: "Habit",
                tagKind: "habit",
                due: "Sun",
                state: "done",
              },
            ],
          },
        ],
      },
      {
        kind: "details",
        units: 2,
        title: "Activity",
        name: "Draft the homepage copy",
        meta: "Inbox task · from the big plan Launch the new site",
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
        sectionTitle: "Same big plan",
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
          { name: "Build to 15 km", meta: "Big plan · 60%", marker: "circle" },
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
