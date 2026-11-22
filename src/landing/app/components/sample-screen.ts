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

export type SampleTagKind = "habit" | "chore" | "plan" | "inbox";

export interface SampleCard {
  name: string;
  tag: string;
  tagKind: SampleTagKind;
  due: string;
  state?: "normal" | "selected" | "done";
}

export interface SampleLane {
  label: string;
  cards: SampleCard[];
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
  | (SampleColumnBase & { kind: "board"; lanes: SampleLane[] })
  | (SampleColumnBase & {
      kind: "details";
      name: string;
      meta: string;
      properties: SampleProperty[];
      sectionTitle: string;
      rows: SampleRow[];
    });

export interface SampleScreen {
  id: "week" | "habits" | "life";
  label: string;
  /** The path shown in the top bar. */
  crumb: string;
  /** Which of the rail's six places is on. */
  railIndex: number;
  columns: SampleColumn[];
}
