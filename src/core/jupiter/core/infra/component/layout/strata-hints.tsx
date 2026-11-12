import { Box, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { strataActivateHintTarget } from "#/core/infra/component/layout/strata-activate-hint-target";
import { strataHintTargets } from "#/core/infra/component/layout/strata-hint-targets";
import { StrataLabelChip } from "#/core/infra/component/layout/strata-label-chip";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import {
  isStrataHintEnterKey,
  strataHintKeyAction,
} from "#/core/infra/strata/strata-hint-key";
import {
  strataHintLabels,
  strataHintProgress,
} from "#/core/infra/strata/strata-hint-labels";

interface HintSession {
  targets: HTMLElement[];
  labels: string[];
  typed: string;
}

/** Where a hint's label goes: the top left of what is seen of its element. */
interface HintPosition {
  x: number;
  y: number;
  shown: boolean;
}

// Less than this of an element in the window and it has no label.
const MIN_VISIBLE_PX = 4;

function measure(targets: readonly HTMLElement[]): HintPosition[] {
  return targets.map((element) => {
    if (!element.isConnected) {
      return { x: 0, y: 0, shown: false };
    }
    const rect = element.getBoundingClientRect();
    const x = Math.max(rect.left, 0);
    const y = Math.max(rect.top, 0);
    const shown =
      Math.min(rect.right, window.innerWidth) - x >= MIN_VISIBLE_PX &&
      Math.min(rect.bottom, window.innerHeight) - y >= MIN_VISIBLE_PX;
    return { x: Math.round(x), y: Math.round(y), shown };
  });
}

function samePositions(
  a: readonly HintPosition[],
  b: readonly HintPosition[],
): boolean {
  return (
    a.length === b.length &&
    a.every(
      (position, index) =>
        position.x === b[index].x &&
        position.y === b[index].y &&
        position.shown === b[index].shown,
    )
  );
}

/**
 * Hint mode, as in Vimium: `s` puts a short label on everything on screen that
 * can be pressed or typed in, and typing a label does it, so the whole app can
 * be driven from the keyboard. A field takes the focus, a button or a link is
 * pressed. `Escape` leaves; so does a click, a move to another page, or a
 * shortcut with a modifier. While it is on, the labels take every key.
 *
 * The labels follow their elements, which move when a column scrolls or slides.
 */
export function StrataHints() {
  const theme = useTheme();
  const location = useLocation();
  const [session, setSession] = useState<HintSession | null>(null);
  const [positions, setPositions] = useState<HintPosition[]>([]);
  // The handler of keys reads the session as it is now, not as it was rendered.
  const current = useRef<HintSession | null>(null);

  const change = useCallback((next: HintSession | null) => {
    current.current = next;
    setSession(next);
    setPositions(next === null ? [] : measure(next.targets));
  }, []);

  const exit = useCallback(() => {
    if (current.current !== null) {
      change(null);
    }
  }, [change]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const now = current.current;
      if (now === null) {
        if (!isStrataHintEnterKey(event, isTypingTarget(event.target))) {
          return;
        }
        const targets = strataHintTargets();
        if (targets.length === 0) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        change({
          targets,
          labels: strataHintLabels(targets.length),
          typed: "",
        });
        return;
      }

      const action = strataHintKeyAction(event);
      if (action.kind === "leave") {
        exit();
        return;
      }
      // Nothing behind the labels gets a key, nor does the page scroll.
      event.preventDefault();
      event.stopPropagation();
      switch (action.kind) {
        case "exit":
          exit();
          return;
        case "back":
          change({ ...now, typed: now.typed.slice(0, -1) });
          return;
        case "letter": {
          const typed = now.typed + action.letter;
          const progress = strataHintProgress(now.labels, typed);
          if (progress.matching.length === 0) {
            return;
          }
          if (progress.chosen === null) {
            change({ ...now, typed });
            return;
          }
          // The mode is over before the element is acted on, so what the
          // action opens finds a page without labels.
          const element = now.targets[progress.chosen];
          exit();
          strataActivateHintTarget(element);
          return;
        }
        case "ignore":
          return;
      }
    }
    // Before the keys of the columns, which listen after it.
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("mousedown", exit, true);
    window.addEventListener("blur", exit);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("mousedown", exit, true);
      window.removeEventListener("blur", exit);
    };
  }, [change, exit]);

  // A move to another page leaves the labels behind.
  useEffect(() => {
    exit();
  }, [location.key, exit]);

  // The elements move: a column scrolls, or slides when the focus changes.
  const active = session !== null;
  useEffect(() => {
    if (!active) {
      return;
    }
    let frame = 0;
    function follow() {
      const targets = current.current?.targets;
      if (targets !== undefined) {
        const next = measure(targets);
        setPositions((before) => (samePositions(before, next) ? before : next));
      }
      frame = requestAnimationFrame(follow);
    }
    frame = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const matching = useMemo(
    () =>
      session === null
        ? new Set<number>()
        : new Set(strataHintProgress(session.labels, session.typed).matching),
    [session],
  );

  if (session === null) {
    return null;
  }

  return createPortal(
    <Box
      data-strata-hints="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: theme.zIndex.tooltip + 1,
        pointerEvents: "none",
      }}
    >
      {session.labels.map((label, index) => {
        const position = positions[index];
        if (position === undefined || !position.shown || !matching.has(index)) {
          return null;
        }
        const typed = session.typed.length;
        return (
          <StrataLabelChip
            key={label}
            label={label}
            typed={typed}
            data-strata-hint={label}
            sx={{
              position: "absolute",
              left: `clamp(0px, ${position.x}px, calc(100vw - ${
                label.length * 9 + 10
              }px))`,
              top: `clamp(0px, ${position.y}px, calc(100vh - 18px))`,
            }}
          />
        );
      })}
      <Box
        role="status"
        data-strata-hints-status="true"
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 16,
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          padding: "4px 10px",
          fontFamily: strataFonts.mono,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: strataColors.textMuted,
          backgroundColor: strataColors.raised,
          border: `1px solid ${strataColors.lineStrong}`,
          borderRadius: `${strataRadius.small}px`,
        }}
      >
        <Box component="span" sx={{ color: strataColors.amber }}>
          Go to
        </Box>
        <Box component="span">
          {session.typed === "" ? "type a label" : session.typed}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
