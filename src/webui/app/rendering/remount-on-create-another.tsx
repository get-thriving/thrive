import { useSearchParams } from "@remix-run/react";
import type { ComponentType } from "react";
import { createAnotherCount } from "@jupiter/core/infra/create-and-another";

/**
 * Wraps a creation page so it's mounted afresh after a "Create & Another".
 *
 * That action redirects back to the creation page, and without a new mount
 * React would keep the page around exactly as it was, with the values of the
 * entity that was just made still filled in. Only the count of entities made
 * in a row is looked at, so the page stays put through the navigations it
 * makes to itself - a failed create among them, which is meant to keep what
 * was filled in.
 */
export function remountOnCreateAnother(
  Component: ComponentType,
): ComponentType {
  function RemountOnCreateAnother() {
    const [searchParams] = useSearchParams();
    return <Component key={createAnotherCount(searchParams)} />;
  }

  RemountOnCreateAnother.displayName = `remountOnCreateAnother(${
    Component.displayName ?? Component.name
  })`;

  return RemountOnCreateAnother;
}
