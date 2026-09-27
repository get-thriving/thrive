/**
 * Reloading the time plan view when coming back to it after a while.
 *
 * Local edits keep the view current as long as it's the only place things
 * change. Coming back to the tab after some time, what changed elsewhere (gen,
 * another device, a collaborator) is picked up with a reload - unless edits are
 * still being saved, which the reload would race.
 */
import { useNavigation, useRevalidator } from "react-router";
import { useEffect, useRef } from "react";

export const REVALIDATE_AFTER_AWAY_MS = 5 * 60 * 1000;

export interface ReturnState {
  awayMs: number;
  pendingMutations: number;
  // Whether a navigation or reload is already under way.
  busy: boolean;
}

export function shouldRevalidateOnReturn(
  state: ReturnState,
  afterAwayMs: number = REVALIDATE_AFTER_AWAY_MS,
): boolean {
  return (
    state.awayMs >= afterAwayMs && state.pendingMutations === 0 && !state.busy
  );
}

export function useRevalidateOnReturn(
  pendingMutations: number,
  afterAwayMs: number = REVALIDATE_AFTER_AWAY_MS,
): void {
  const revalidator = useRevalidator();
  const navigation = useNavigation();

  // The listener is set up once; it reads the latest state from here.
  const latest = useRef({ pendingMutations, revalidator, navigation });
  latest.current = { pendingMutations, revalidator, navigation };

  useEffect(() => {
    let hiddenAt: number | null =
      document.visibilityState === "hidden" ? Date.now() : null;

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      if (hiddenAt === null) {
        return;
      }
      const awayMs = Date.now() - hiddenAt;
      hiddenAt = null;
      const { pendingMutations, revalidator, navigation } = latest.current;
      if (
        shouldRevalidateOnReturn(
          {
            awayMs,
            pendingMutations,
            busy: navigation.state !== "idle" || revalidator.state !== "idle",
          },
          afterAwayMs,
        )
      ) {
        revalidator.revalidate();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [afterAwayMs]);
}
