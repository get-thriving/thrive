import type { ShouldRevalidateFunction } from "react-router";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";

// Not a panel: a tool page stands where a trunk would (ADR 0020), so this route
// only groups the tools, and gives their crumb its name.
export const handle = {
  label: "Tools",
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Tools() {
  return <NestedOutlet />;
}
