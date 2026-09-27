import type { ShouldRevalidateFunction } from "react-router";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Tools() {
  return (
    <TrunkPanel key={"tools"} returnLocation="/app/workspace">
      <NestedOutlet />
    </TrunkPanel>
  );
}
