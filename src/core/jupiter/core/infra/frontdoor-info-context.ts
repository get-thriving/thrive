import { AppDistribution, AppPlatform, AppShell } from "@jupiter/webapi-client";
import { createContext } from "react";

import type { FrontDoorInfo } from "#/core/frontdoor";

export const FrontDoorInfoContext = createContext<FrontDoorInfo>({
  clientVersion: "FAKE-FAKE",
  appShell: AppShell.BROWSER,
  appPlatform: AppPlatform.DESKTOP_MACOS,
  appDistribution: AppDistribution.WEB,
  initialWindowWidth: undefined,
});
