import { createContext } from "react";

import type { ColumnPlacement } from "#/core/infra/component/layout/column-placement";
import type { ColumnSpec } from "#/core/infra/component/layout/column-spec";

/** What the workspace offers the panels that want to be columns. */
export interface StrataColumnsApi {
  register: (id: string, spec: ColumnSpec) => void;
  unregister: (id: string) => void;
  /** Null until the column has registered, e.g. on the server render. */
  placementFor: (id: string) => ColumnPlacement | null;
  /** Bring a folded column back, which may push the row past the window. */
  unfold: (id: string) => void;
  /** Where the columns start, which is the right edge of the rail. */
  offsetLeft: number;
}

/**
 * Present while the Strata column layout is on, so the shared panels know to
 * lay themselves out as columns; absent otherwise, and they stay as they were.
 */
export const StrataColumnsContext = createContext<StrataColumnsApi | null>(
  null,
);
