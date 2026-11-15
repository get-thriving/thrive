/** One kind of thing the menu of new items (ADR 0021) can start creating. */
export interface NewEntityEntry {
  /** What it is called, and what its letters come from. */
  label: string;
  /** The page that creates it: one of the app's `new` routes. */
  to: string;
}
