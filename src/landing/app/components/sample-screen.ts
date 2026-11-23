/** What a row in the sample screens looks like. */
export type SampleRowState =
  "normal" | "selected" | "muted" | "done" | "missed";

export interface SampleRow {
  name: string;
  meta?: string;
  /** How far in the row sits, for a tree, in px. */
  indent?: number;
  /** A circle for a thing to do, a square for a place in a tree. */
  marker: "circle" | "square";
  state?: SampleRowState;
  /** One character a day: `x` done, `.` missed, `-` not due. */
  streak?: string;
}

export interface SampleGroup {
  label: string;
  rows: SampleRow[];
}

export type SampleEventKind = "habit" | "chore" | "plan" | "inbox" | "event";

/** One block of the week grid; `start` and `end` are hours of the day. */
export interface SampleCalendarEvent {
  day: number;
  start: number;
  end: number;
  name: string;
  kind: SampleEventKind;
}

export interface SampleCalendarDay {
  label: string;
  today?: boolean;
}

/** A week grid: a column a day, and the hours it shows. */
export interface SampleCalendar {
  days: SampleCalendarDay[];
  /** The hour the grid starts at, and how many hours it shows. */
  firstHour: number;
  hours: number;
  events: SampleCalendarEvent[];
}

/** One figure of a time plan, with a bar when it is a share of something. */
export interface SampleStat {
  label: string;
  value: string;
  detail?: string;
  percent?: number;
}

/** One question of a journal and the answer written to it. */
export interface SampleAnswer {
  question: string;
  answer: string;
}

export type SampleProperty =
  | { label: string; kind: "options"; options: string[]; active: number }
  | { label: string; kind: "text"; value: string }
  | { label: string; kind: "progress"; percent: number; value: string };

interface SampleColumnBase {
  /** Its share of the width, as in the product's unit layout (ADR 0021). */
  units: number;
  title: string;
  count?: string;
  focused?: boolean;
}

export type SampleColumn =
  | (SampleColumnBase & { kind: "list"; groups: SampleGroup[] })
  | (SampleColumnBase & { kind: "calendar" } & SampleCalendar)
  | (SampleColumnBase & {
      kind: "timeplan";
      note: string;
      stats: SampleStat[];
      tasks: SampleGroup[];
      calendar: SampleCalendar;
    })
  | (SampleColumnBase & {
      kind: "entry";
      name: string;
      meta: string;
      answers: SampleAnswer[];
    })
  | (SampleColumnBase & {
      kind: "details";
      name: string;
      meta: string;
      properties: SampleProperty[];
      sectionTitle: string;
      rows: SampleRow[];
    });

export interface SampleScreen {
  id:
    | "timeplan"
    | "projects"
    | "calendar"
    | "habits"
    | "smartlists"
    | "journal"
    | "people"
    | "life";
  label: string;
  /** The path shown in the top bar. */
  crumb: string;
  /** Which of the rail's six places is on. */
  railIndex: number;
  columns: SampleColumn[];
}
