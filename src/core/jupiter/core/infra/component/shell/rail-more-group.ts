import type { RailEntry } from "#/core/infra/component/shell/rail-entry";

/** A labelled group of entries inside the rail's More popover. */
export interface RailMoreGroup {
  title: string;
  entries: Array<RailEntry>;
}
