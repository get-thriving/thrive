import { Stack } from "@mui/material";
import { useLocation } from "react-router";
import type { PropsWithChildren } from "react";

import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { DisplayType } from "#/core/infra/component/use-nested-entities";

export function ToolPanel(props: PropsWithChildren) {
  const location = useLocation();
  // A tool page stands where a trunk would, as the first column.
  const column = useStrataColumn(DisplayType.TOOL);

  return (
    <StrataColumnFrame
      id="tool-panel"
      key={location.pathname}
      column={column.column}
      label="page"
      onFocus={column.focus}
      fallbackLeft={column.offsetLeft}
      animate={column.animate}
    >
      <div id="tool-panel-content">
        <Stack spacing={2}>{props.children}</Stack>
      </div>
    </StrataColumnFrame>
  );
}
