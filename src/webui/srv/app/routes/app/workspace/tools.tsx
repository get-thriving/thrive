import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Tools() {
  return (
    <TrunkPanel key={"tools"} returnLocation="/app/workspace">
      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}
