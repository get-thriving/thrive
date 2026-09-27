import { Outlet, useSearchParams } from "react-router";
import { AnimatePresence } from "framer-motion";

import { createAnotherNonce } from "#/core/infra/create-and-another";

/**
 * The branch or leaf panel nested under this one.
 *
 * Keyed by the "Create & Another" nonce, so that coming back to a creation
 * page from itself builds a brand new one, rather than leaving up the very
 * same form with the entity that was just made still in it.
 */
export function NestedOutlet() {
  const [searchParams] = useSearchParams();

  return (
    <AnimatePresence
      key={createAnotherNonce(searchParams)}
      mode="wait"
      initial={false}
    >
      <Outlet />
    </AnimatePresence>
  );
}
