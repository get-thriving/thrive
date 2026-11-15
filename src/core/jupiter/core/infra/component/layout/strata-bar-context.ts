import { createContext, useContext } from "react";

/**
 * What the controls in a bar are told about it: the header of a column and the
 * header of a section are bars (ADR 0021), and what they hold is drawn small.
 */
export interface StrataBar {
  /**
   * How many of the controls, from the last one, do not fit the bar, and are
   * folded into one button that opens them. The bar decides this from its
   * width, and tells them. 0 when they all fit.
   */
  folded: number;
}

/** Null outside a bar, where controls are drawn at their usual size. */
export const StrataBarContext = createContext<StrataBar | null>(null);

export function useStrataBar(): StrataBar | null {
  return useContext(StrataBarContext);
}
