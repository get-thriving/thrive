import {
  AppCore,
  AppDistribution,
  AppPlatform,
  AppShell,
} from "@jupiter/webapi-client";
import { createContext } from "react";
import type { FrontDoorInfo } from "@jupiter/core/frontdoor";

export interface ServicePropertiesClient {
  appCore: AppCore;
  frontDoorInfo: FrontDoorInfo;
  webApiProgressReporterUrl: string;
  publishedUrl: string;
  docsUrl: string;
  overdueInfoDays: number;
  overdueWarningDays: number;
  overdueDangerDays: number;
}

export const ServicePropertiesContext = createContext<ServicePropertiesClient>({
  appCore: AppCore.PUBLISHED,
  frontDoorInfo: {
    clientVersion: "FAKE-FAKE",
    appShell: AppShell.BROWSER,
    appPlatform: AppPlatform.DESKTOP_MACOS,
    appDistribution: AppDistribution.WEB,
    initialWindowWidth: undefined,
  },
  webApiProgressReporterUrl: "FAKE-FAKE",
  publishedUrl: "FAKE-FAKE",
  docsUrl: "FAKE-FAKE",
  overdueInfoDays: 1,
  overdueWarningDays: 2,
  overdueDangerDays: 3,
});
