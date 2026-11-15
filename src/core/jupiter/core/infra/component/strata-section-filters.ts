import { z } from "zod";

/**
 * The filters of a stack of sections (ADR 0014): which sections are collapsed
 * or expanded (see `strataSectionCollapsed`) and which are split out into
 * columns of their own. Shared by the stack and by what opens a section from
 * outside it.
 */
export const STRATA_SECTION_FILTERS = z.object({
  collapsed: z.array(z.string()).default([]),
  expanded: z.array(z.string()).default([]),
  split: z.array(z.string()).default([]),
});
