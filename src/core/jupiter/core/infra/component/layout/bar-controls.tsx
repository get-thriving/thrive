import { Box } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";

import { StrataBarContext } from "#/core/infra/component/layout/strata-bar-context";
import { useIsomorphicLayoutEffect } from "#/core/infra/component/use-isomorphic-layout-effect";

/** More folds than any bar has controls: where it stops trying. */
const MAX_FOLDED = 12;

/**
 * The room a bar leaves for its controls (ADR 0021): the rest of its row, with
 * the controls at the left of it, next to the title, drawn small. They show
 * whole while they fit; once the bar is too narrow for them they are told to
 * fold, the last first, into one button (`folded`), as many as it takes to fit.
 * They unfold again, one at a time, when the bar is wide enough for what they
 * took.
 */
export function BarControls(props: PropsWithChildren) {
  const slot = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [folded, setFolded] = useState(0);
  // The width the controls took when they did not fit, for each number of
  // them folded, kept while they are folded, since they are then too small to
  // say it.
  const needed = useRef<number[]>([]);

  useIsomorphicLayoutEffect(() => {
    const element = slot.current;
    const content = inner.current;
    if (element === null || content === null) {
      return;
    }
    function check() {
      if (element === null) {
        return;
      }
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
  }, [folded]);

  const bar = useMemo(() => ({ folded }), [folded]);

  return (
    <Box
      ref={slot}
      data-strata-bar-controls
      sx={{
        flex: "1 1 0",
        // Room for the button the controls fold into.
        minWidth: 32,
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
        }}
      >
        <StrataBarContext.Provider value={bar}>
          {props.children}
        </StrataBarContext.Provider>
      </Box>
    </Box>
  );
}
