import type { SampleScreen } from "~/components/sample-screen";

export const SAMPLE_SCREEN_JOURNAL: SampleScreen = {
  id: "journal",
  label: "Journal",
  crumb: "Journal  ›  2026  ›  November  ›  W47",
  railIndex: 5,
  columns: [
    {
      kind: "list",
      units: 2,
      title: "Journals",
      groups: [
        {
          label: "Weekly",
          rows: [
            {
              name: "W47 · Nov 16–22",
              marker: "square",
              state: "selected",
            },
            { name: "W46 · Nov 9–15", marker: "square" },
            { name: "W45 · Nov 2–8", marker: "square" },
            { name: "W44 · Oct 26–Nov 1", marker: "square" },
          ],
        },
        {
          label: "Monthly",
          rows: [
            { name: "October", marker: "square" },
            { name: "September", marker: "square" },
          ],
        },
      ],
    },
    {
      kind: "entry",
      units: 5,
      title: "Journal",
      focused: true,
      name: "W47 · Nov 16–22",
      meta: "Weekly journal · 4 questions",
      answers: [
        {
          question: "What went well this week?",
          answer:
            "Kept the morning run going through the cold snap, and finished the homepage draft two days early.",
        },
        {
          question: "What was hard?",
          answer:
            "Too many tabs open and too little deep work on Wednesday. The dentist kept slipping down the list.",
        },
        {
          question: "What will I do differently next week?",
          answer:
            "Block two mornings for the docs page, and book the dentist first thing on Monday.",
        },
        {
          question: "What am I grateful for?",
          answer: "Dinner with Ana, and a long call with my parents on Sunday.",
        },
      ],
    },
  ],
};
