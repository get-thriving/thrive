import { Fragment } from "react";
import { Outlet, useSearchParams } from "react-router";

import { StrataSectionsContext } from "#/core/infra/component/strata-sections-context";
import { createAnotherNonce } from "#/core/infra/create-and-another";

/**
 * The branch or leaf panel nested under this one. It is not in the stack of
 * sections of the panel it is drawn from, even where that stack wraps it: its
 * own sections are not that panel's.
 *
 * Keyed by the "Create & Another" nonce, so that coming back to a creation
 * page from itself builds a brand new one, rather than leaving up the very
 * same form with the entity that was just made still in it.
 */
export function NestedOutlet() {
  const [searchParams] = useSearchParams();

  return (
    <Fragment key={createAnotherNonce(searchParams)}>
      <StrataSectionsContext.Provider value={null}>
        <Outlet />
      </StrataSectionsContext.Provider>
    </Fragment>
  );
}
