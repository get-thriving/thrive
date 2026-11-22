export interface Feature {
  name: string;
  description: string;
}

export interface FeatureGroup {
  label: string;
  features: Feature[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Plan",
    features: [
      {
        name: "Life plan",
        description:
          "A vision, the aspects of your life, and goals under each.",
      },
      {
        name: "Big plans",
        description:
          "Projects that run for months, with milestones and their own tasks.",
      },
      {
        name: "Time plans",
        description:
          "From the year down to the day, each one holding what belongs to it.",
      },
    ],
  },
  {
    label: "Do",
    features: [
      {
        name: "Inbox tasks",
        description:
          "Everything that needs doing, captured by you or created on schedule.",
      },
      {
        name: "Calendar",
        description: "Events and time blocks, with iCal import and export.",
      },
      {
        name: "Smart lists",
        description:
          "Tagged lists for books, gear, ideas and anything else you collect.",
      },
    ],
  },
  {
    label: "Keep up",
    features: [
      {
        name: "Habits",
        description: "Daily to yearly, with streaks and skip rules.",
      },
      {
        name: "Chores",
        description: "Recurring upkeep that turns into tasks when it's due.",
      },
      {
        name: "Journals and metrics",
        description:
          "Reflect on the questions you choose, and track any number over time.",
      },
    ],
  },
  {
    label: "Remember",
    features: [
      {
        name: "Contacts",
        description:
          "The people in your life, and the birthdays and dates that matter.",
      },
      {
        name: "Docs and notes",
        description: "Writing that lives next to the plan it's about.",
      },
      {
        name: "Vacations",
        description: "Time off, and a list of the trips you want to take.",
      },
    ],
  },
];
