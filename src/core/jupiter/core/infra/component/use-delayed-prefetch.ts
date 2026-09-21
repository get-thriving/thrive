import type { LinkProps } from "@remix-run/react";
import type {
  FocusEventHandler,
  MouseEventHandler,
  TouchEventHandler,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// How long the pointer has to stay on a link before it's worth loading what
// the link points at. Remix's own "intent" waits 100ms, which a pointer
// crossing a dense list clears without trying; this wants to be far enough
// above that to tell passing over a card from aiming at one, and still short
// enough that the load is under way before the click lands.
export const PREFETCH_DWELL_MS = 300;

interface PrefetchHandlers {
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onTouchStart?: TouchEventHandler;
}

const NO_HANDLERS: PrefetchHandlers = {};

interface DelayedPrefetch {
  prefetch: LinkProps["prefetch"];
  handlers: PrefetchHandlers;
}

// Remix's own "intent" prefetch fires 100ms after the pointer touches a link,
// which is fine for a cheap route and expensive for one whose loader is a real
// piece of work: a list of those loads most every card the pointer crosses,
// and the card that actually gets clicked then queues behind them. Holding out
// for a longer dwell keeps the head start without the pile-up. Anything other
// than "intent" is passed through untouched.
export function useDelayedPrefetch(
  prefetch: LinkProps["prefetch"],
  dwellMs: number = PREFETCH_DWELL_MS,
): DelayedPrefetch {
  const [dwelled, setDwelled] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    clear();
    timeout.current = setTimeout(() => {
      timeout.current = null;
      setDwelled(true);
    }, dwellMs);
  }, [clear, dwellMs]);

  const stop = useCallback(() => {
    clear();
    setDwelled(false);
  }, [clear]);

  // A tap is already a decision, so there's nothing to wait out.
  const now = useCallback(() => {
    clear();
    setDwelled(true);
  }, [clear]);

  if (prefetch !== "intent") {
    return { prefetch, handlers: NO_HANDLERS };
  }

  return {
    // "render" rather than "intent": by the time the pointer has settled,
    // Remix's own hover trigger has been and gone, so the link has to ask for
    // the load itself. Remix prefetches on seeing "render", so flipping to it
    // is what fires the load; flipping back only stops a pending timer, since
    // a load already sent can't be recalled.
    prefetch: dwelled ? "render" : "none",
    handlers: {
      onMouseEnter: start,
      onMouseLeave: stop,
      onFocus: start,
      onBlur: stop,
      onTouchStart: now,
    },
  };
}
