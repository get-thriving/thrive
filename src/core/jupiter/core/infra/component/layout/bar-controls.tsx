import { Box } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";

import { StrataBarContext } from "#/core/infra/component/layout/strata-bar-context";
import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { strataSize } from "#/core/infra/component/strata-tokens";
import { useIsomorphicLayoutEffect } from "#/core/infra/component/use-isomorphic-layout-effect";

/** What counts as a control of the bar: the first one is the one that stays. */
const FIRST_CONTROL =
  ".MuiButton-root, .MuiFormControl-root, .MuiIconButton-root, .MuiToggleButton-root";

/** More folds than any bar has controls: where it stops trying. */
const MAX_FOLDED = 12;

interface BarControlsProps {
  /** The section the bar is the header of; left out for a column's own. */
  title?: string;
}

/**
 * The room a bar leaves for its controls (ADR 0021): the rest of its row, with
 * the controls at the left of it, next to the title, drawn small. They show
 * whole while they fit; once the bar is too narrow for them they are told to
 * fold, the last first, into the `⋯` menu of the column (`folded`), as many as
 * it takes to fit, though never the first one. They unfold again, one at a
 * time, when the bar is wide enough for what they took.
 */
export function BarControls(props: PropsWithChildren<BarControlsProps>) {
  const columnKey = useStrataColumnKey();
  const slot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [folded, setFolded] = useState(0);
  // What the first control needs, which is the least the bar leaves for them: a
  // long title gives way, with its ellipsis, before that control is cut.
  const [first, setFirst] = useState(0);
  // The width the controls took when they did not fit, for each number of
  // them folded, kept while they are folded, since they are then too small to
  // say it.
  const needed = useRef<number[]>([]);

  useIsomorphicLayoutEffect(() => {
    const element = slot.current;
    const content = inner.current;
    // With no column there is no menu to fold them into.
    if (element === null || content === null || columnKey === null) {
      return;
    }
    function check() {
      if (element === null || content === null) {
        return;
      }
      const control = content.querySelector<HTMLElement>(FIRST_CONTROL);
      setFirst(control === null ? 0 : Math.ceil(control.offsetWidth));
      if (element.scrollWidth > element.clientWidth + 1) {
        needed.current[folded] = element.scrollWidth;
        if (folded < MAX_FOLDED) {
          setFolded(folded + 1);
        }
      } else if (folded > 0) {
        const before = needed.current[folded - 1];
        if (before === undefined || element.clientWidth >= before) {
          setFolded(folded - 1);
        }
      }
    }
    check();
    const observer = new ResizeObserver(check);
    // The room changes with the bar, and what they need with their own text.
    observer.observe(element);
    observer.observe(content);
    return () => observer.disconnect();
  }, [folded, columnKey]);

  const bar = useMemo(
    () => ({ folded, title: props.title }),
    [folded, props.title],
  );

  return (
    <Box
      ref={slot}
      data-strata-bar-controls
      sx={{
        flex: "1 1 0",
        // Room for the first control, which stays.
        minWidth: Math.max(32, first),
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* What does not fit overflows to the right, where it can be measured. */}
      <Box
        ref={inner}
        sx={{
          display: "flex",
          alignItems: "center",
          flex: "none",
          gap: 0.5,
          // As tall as the icon buttons of the bar whatever the pointer: the
          // theme gives a touch screen's buttons the room of a finger, which
          // the bar does not have.
          "& .MuiButton-root, & .MuiToggleButton-root": {
            height: strataSize.controlSmall,
            minHeight: 0,
            paddingBlock: 0,
            lineHeight: 1,
          },
        }}
      >
        <StrataBarContext.Provider value={bar}>
          {props.children}
        </StrataBarContext.Provider>
      </Box>
    </Box>
  );
}
