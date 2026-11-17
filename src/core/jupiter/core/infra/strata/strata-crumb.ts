/** One part of the path in the top bar. */
export interface StrataCrumb {
  /** The route it comes from. */
  id: string;
  label: string;
  /**
   * Which open panel it belongs to, counting the panels in the order of the
   * path, for the button that focuses it; -1 when there is none.
   */
  owner: number;
}
