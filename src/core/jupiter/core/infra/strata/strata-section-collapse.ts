/**
 * Which sections of a stack are collapsed, kept in the URL as two lists
 * (ADR 0014): the ones asked to be `collapsed`, and the ones asked to be
 * `expanded`. A section that starts collapsed (History, Sharing) is open only
 * when it is in `expanded`; one that starts open is collapsed only when it is in
 * `collapsed`. So a link without either list shows every section as it starts.
 */
export interface StrataSectionCollapse {
  collapsed: string[];
  expanded: string[];
}

/** Whether the section is collapsed now. */
export function strataSectionCollapsed(
  state: StrataSectionCollapse,
  id: string,
  startsCollapsed: boolean,
): boolean {
  return startsCollapsed
    ? !state.expanded.includes(id)
    : state.collapsed.includes(id);
}

/** The lists after the section is set collapsed or expanded. */
export function strataSetSectionCollapsed(
  state: StrataSectionCollapse,
  id: string,
  startsCollapsed: boolean,
  collapsed: boolean,
): StrataSectionCollapse {
  const without = (list: string[]) => list.filter((other) => other !== id);
  // Only what is not how the section starts is kept, so the URL stays short.
  if (startsCollapsed) {
    return {
      collapsed: without(state.collapsed),
      expanded: collapsed
        ? without(state.expanded)
        : [...without(state.expanded), id],
    };
  }
  return {
    collapsed: collapsed
      ? [...without(state.collapsed), id]
      : without(state.collapsed),
    expanded: without(state.expanded),
  };
}

/** The lists after the section is collapsed if it is open, or expanded if not. */
export function strataToggleSectionCollapsed(
  state: StrataSectionCollapse,
  id: string,
  startsCollapsed: boolean,
): StrataSectionCollapse {
  return strataSetSectionCollapsed(
    state,
    id,
    startsCollapsed,
    !strataSectionCollapsed(state, id, startsCollapsed),
  );
}
