import { useContext } from "react";
import { KeyboardAction } from "@jupiter/webapi-client";

import type { ColumnMenuEntry } from "#/core/infra/component/layout/column-menu-entry";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataKeyBindingLabel } from "#/core/infra/strata/strata-key-binding";

/**
 * The commands that change the size of a column (ADR 0021): wider, narrower and
 * back to the size its route declares, for the `⋯` menu of the header. Empty where the column cannot be resized: on a
 * phone, or when it is the whole screen.
 */
export function useColumnResizeEntries(headerId: string): ColumnMenuEntry[] {
  const columns = useContext(StrataColumnsContext);
  const columnKey = useStrataColumnKey();
  const bindings = useStrataKeyBindings();
  if (
    columns === null ||
    columnKey === null ||
    columns.phone ||
    !(
      columns.canResizeColumn(columnKey, 1) ||
      columns.canResizeColumn(columnKey, -1) ||
      columns.isColumnResized(columnKey)
    )
  ) {
    return [];
  }
  return [
    {
      id: `${headerId}-wider`,
      label: "Wider",
      hint: strataKeyBindingLabel(bindings[KeyboardAction.COLUMN_WIDER]),
      disabled: !columns.canResizeColumn(columnKey, 1),
      onSelect: () => columns.resizeColumn(columnKey, 1),
    },
    {
      id: `${headerId}-narrower`,
      label: "Narrower",
      hint: strataKeyBindingLabel(bindings[KeyboardAction.COLUMN_NARROWER]),
      disabled: !columns.canResizeColumn(columnKey, -1),
      onSelect: () => columns.resizeColumn(columnKey, -1),
    },
    {
      id: `${headerId}-default-size`,
      label: "Default size",
      disabled: !columns.isColumnResized(columnKey),
      onSelect: () => columns.resetColumnSize(columnKey),
    },
  ];
}
