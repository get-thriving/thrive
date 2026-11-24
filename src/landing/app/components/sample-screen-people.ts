import type { SampleScreen } from "~/components/sample-screen";

export const SAMPLE_SCREEN_PEOPLE: SampleScreen = {
  id: "people",
  label: "People",
  crumb: "People  ›  Friends  ›  Ana Popescu",
  railIndex: 2,
  columns: [
    {
      kind: "list",
      units: 2,
      title: "People",
      count: "28",
      groups: [
        {
          label: "Family",
          rows: [
            { name: "Mom", meta: "3d", marker: "circle" },
            { name: "Dad", meta: "3d", marker: "circle" },
            { name: "Elena", meta: "2w", marker: "circle" },
          ],
        },
        {
          label: "Friends",
          rows: [
            {
              name: "Ana Popescu",
              meta: "12d",
              marker: "circle",
              state: "selected",
            },
            {
              name: "Radu Matei",
              meta: "due",
              marker: "circle",
              state: "missed",
            },
          ],
        },
        {
          label: "Work",
          rows: [{ name: "Marta Ionescu", meta: "1d", marker: "circle" }],
        },
      ],
    },
    {
      kind: "details",
      units: 3,
      title: "Person",
      focused: true,
      name: "Ana Popescu",
      meta: "Friend · Bucharest",
      properties: [
        { label: "Birthday", kind: "text", value: "March 14" },
        {
          label: "Circle",
          kind: "options",
          options: ["Family", "Friends", "Work"],
          active: 1,
        },
        {
          label: "Catch up",
          kind: "options",
          options: ["Weekly", "Monthly", "Quarterly"],
          active: 1,
        },
        { label: "Last seen", kind: "text", value: "Nov 9 · dinner" },
      ],
      sectionTitle: "Coming up",
      rows: [
        { name: "Catch up", meta: "Dec 9", marker: "circle" },
        { name: "Birthday", meta: "Mar 14", marker: "circle" },
        {
          name: "Gift idea: Four Thousand Weeks",
          meta: "Smart list",
          marker: "square",
        },
      ],
    },
    {
      kind: "list",
      units: 2,
      title: "↳ Notes",
      count: "4",
      groups: [
        {
          label: "Recent",
          rows: [
            { name: "Dinner at Casa Veche", meta: "Nov 9", marker: "square" },
            { name: "Recommended a book", meta: "Nov 3", marker: "square" },
            { name: "Her new job", meta: "Sep 21", marker: "square" },
            { name: "Trip to the mountains", meta: "Aug 2", marker: "square" },
          ],
        },
      ],
    },
  ],
};
