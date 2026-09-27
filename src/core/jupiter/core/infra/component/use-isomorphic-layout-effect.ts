import { useEffect, useLayoutEffect } from "react";

// `useLayoutEffect` warns when it runs during server rendering, because its
// effect can't be part of the rendered HTML. Effects that only do something
// after an interaction (measuring an opened menu, say) are inert there anyway,
// so fall back to `useEffect` on the server and keep the pre-paint timing in
// the browser.
export const useIsomorphicLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;
