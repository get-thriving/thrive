import { Box } from "@mui/material";
import { useState } from "react";

import { useStrataBar } from "#/core/infra/component/layout/strata-bar-context";
import {
  strataHeaderLeadKey,
  strataSetHeaderSlot,
} from "#/core/infra/component/layout/strata-header-slot";
import { useIsomorphicLayoutEffect } from "#/core/infra/component/use-isomorphic-layout-effect";

/**
 * The place in a column's header, among its controls, that the first section
 * of the column draws its own controls into (ADR 0021): the header of the
 * column is the header of its first section. It says where it is, and what the
 * bar it is in tells the controls, to whatever draws into it, by the key of the
 * column. It takes no room of its own: what is drawn into it is laid out as the
 * rest of the header's controls are.
 */
export function StrataHeaderSlotOutlet(props: {
  columnKey: string;
  /**
   * The place before the column's name instead, for what goes ahead of it: the
   * `▾` that collapses the first section (`strataHeaderLeadKey`).
   */
  lead?: boolean;
}) {
  const bar = useStrataBar();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const key =
    props.lead === true
      ? strataHeaderLeadKey(props.columnKey)
      : props.columnKey;

  useIsomorphicLayoutEffect(() => {
    if (element === null) {
      return;
    }
    strataSetHeaderSlot(key, { element, bar });
    return () => strataSetHeaderSlot(key, null);
  }, [key, element, bar]);

  return (
    <Box
      ref={setElement}
      data-strata-header-slot={key}
      sx={{ display: "contents" }}
    />
  );
}
