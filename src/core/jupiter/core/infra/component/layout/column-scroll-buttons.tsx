import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";
import { ButtonGroup, IconButton } from "@mui/material";
import type { MouseEvent, PropsWithChildren } from "react";

import { strataScrollColumn } from "#/core/infra/component/layout/strata-scroll-column";
import type { StrataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";

/**
 * The two buttons of a column's header that scroll it to its top and to its
 * bottom, as `⇧k` and `⇧j` do. They scroll the column they are in, so every
 * kind of column offers them the same way. Any children are more buttons for the
 * same group.
 */
export function ColumnScrollButtons(props: PropsWithChildren) {
  function handleClick(
    event: MouseEvent<HTMLElement>,
    to: StrataScrollKeyAction,
  ) {
    const column = event.currentTarget.closest("[data-strata-column]");
    if (column !== null) {
      strataScrollColumn(column, to);
    }
  }

  return (
    <ButtonGroup size="small">
      <IconButton
        aria-label="Scroll to the top"
        title="Top (⇧k)"
        data-strata-scroll-button="top"
        onClick={(event) => handleClick(event, "top")}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        aria-label="Scroll to the bottom"
        title="Bottom (⇧j)"
        data-strata-scroll-button="bottom"
        onClick={(event) => handleClick(event, "bottom")}
      >
        <ArrowDownwardIcon />
      </IconButton>
      {props.children}
    </ButtonGroup>
  );
}
