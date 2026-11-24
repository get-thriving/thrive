import type { SampleScreen } from "~/components/sample-screen";

export const SAMPLE_SCREEN_SMART_LISTS: SampleScreen = {
  id: "smartlists",
  label: "Smart lists",
  crumb: "Lists  ›  Smart lists  ›  Books to read",
  railIndex: 4,
  columns: [
    {
      kind: "list",
      units: 2,
      title: "Smart lists",
      count: "4",
      groups: [
        {
          label: "Lists",
          rows: [
            {
              name: "Books to read",
              meta: "12",
              marker: "square",
              state: "selected",
            },
            { name: "Movies to watch", meta: "8", marker: "square" },
            { name: "Gift ideas", meta: "6", marker: "square" },
            { name: "Packing list", meta: "14", marker: "square" },
          ],
        },
      ],
    },
    {
      kind: "list",
      units: 3,
      title: "Books to read",
      count: "12",
      groups: [
        {
          label: "To read",
          rows: [
            { name: "The Overstory", meta: "Powers", marker: "circle" },
            {
              name: "Four Thousand Weeks",
              meta: "Burkeman",
              marker: "circle",
              state: "selected",
            },
            { name: "Braiding Sweetgrass", meta: "Kimmerer", marker: "circle" },
            { name: "The Dispossessed", meta: "Le Guin", marker: "circle" },
          ],
        },
        {
          label: "Reading",
          rows: [
            { name: "A Gentleman in Moscow", meta: "Towles", marker: "circle" },
          ],
        },
        {
          label: "Done",
          rows: [
            {
              name: "Atomic Habits",
              meta: "Clear",
              marker: "circle",
              state: "done",
            },
            {
              name: "Deep Work",
              meta: "Newport",
              marker: "circle",
              state: "done",
            },
          ],
        },
      ],
    },
    {
      kind: "details",
      units: 2,
      title: "Item",
      focused: true,
      name: "Four Thousand Weeks",
      meta: "Books to read · added Nov 3",
      properties: [
        {
          label: "Status",
          kind: "options",
          options: ["To read", "Reading", "Done"],
          active: 0,
        },
        { label: "Tags", kind: "text", value: "non-fiction, time" },
        { label: "Source", kind: "text", value: "Recommended by Ana" },
      ],
      sectionTitle: "Related",
      rows: [
        { name: "Reading notes", meta: "Note", marker: "square" },
        { name: "Weekly review", meta: "Habit", marker: "circle" },
      ],
    },
  ],
};
