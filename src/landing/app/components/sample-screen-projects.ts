import type { SampleScreen } from "~/components/sample-screen";

export const SAMPLE_SCREEN_PROJECTS: SampleScreen = {
  id: "projects",
  label: "Projects",
  crumb: "Plans  ›  Projects  ›  Launch the new site",
  railIndex: 1,
  columns: [
    {
      kind: "list",
      units: 2,
      title: "Projects",
      count: "5",
      groups: [
        {
          label: "Active",
          rows: [
            {
              name: "Launch the new site",
              meta: "62%",
              marker: "square",
              state: "selected",
            },
            { name: "Build to 15 km", meta: "60%", marker: "square" },
            { name: "Plan the winter trip", meta: "20%", marker: "square" },
            { name: "Paint the hallway", meta: "35%", marker: "square" },
          ],
        },
        {
          label: "Done",
          rows: [
            {
              name: "Move to the new apartment",
              meta: "100%",
              marker: "square",
              state: "done",
            },
          ],
        },
      ],
    },
    {
      kind: "details",
      units: 3,
      title: "Project",
      focused: true,
      name: "Launch the new site",
      meta: "Work › Ship the new site",
      properties: [
        { label: "Status", kind: "text", value: "In progress" },
        { label: "Due", kind: "text", value: "Fri, Dec 4" },
        {
          label: "Progress",
          kind: "progress",
          percent: 62,
          value: "5 of 8 tasks",
        },
        { label: "Goal", kind: "text", value: "Work › Ship the new site" },
      ],
      sectionTitle: "Milestones",
      rows: [
        {
          name: "Design the page",
          meta: "Oct 30",
          marker: "square",
          state: "done",
        },
        { name: "Draft the homepage copy", meta: "Nov 20", marker: "square" },
        { name: "Build the page", meta: "Nov 27", marker: "square" },
        { name: "Move the domain", meta: "Dec 4", marker: "square" },
      ],
    },
    {
      kind: "list",
      units: 2,
      title: "↳ Inbox tasks",
      count: "5",
      groups: [
        {
          label: "This project",
          rows: [
            {
              name: "Draft the homepage copy",
              meta: "doing",
              marker: "circle",
            },
            {
              name: "Write the docs landing page",
              meta: "W48",
              marker: "circle",
            },
            { name: "Move the domain", meta: "W49", marker: "circle" },
            {
              name: "Pick the screenshots",
              meta: "done",
              marker: "circle",
              state: "done",
            },
            {
              name: "Choose the hosting",
              meta: "done",
              marker: "circle",
              state: "done",
            },
          ],
        },
      ],
    },
  ],
};
