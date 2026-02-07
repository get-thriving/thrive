import {
  AppCore,
  AppDistribution,
  AppPlatform,
  AppShell,
  Env,
  Instance,
  Universe,
} from "@jupiter/webapi-client";
import { createContext } from "react";

import type { GlobalPropertiesServer } from "#/core/config-server";
import type { FrontDoorInfo } from "#/core/frontdoor";

export interface GlobalPropertiesClient {
  publicName: string;
  universe: Universe;
  env: Env;
  instance: Instance;
  version: string;
  appCore: AppCore;
  frontDoorInfo: FrontDoorInfo;
  webApiProgressReporterUrl: string;
  webApiUrl: string;
  docsUrl: string;
  hostedGlobalDomain: string;
  communityUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  inboxTasksToAskForGC: number;
  overdueInfoDays: number;
  overdueWarningDays: number;
  overdueDangerDays: number;
}

export const GlobalPropertiesContext = createContext<GlobalPropertiesClient>({
  publicName: "FAKE-FAKE",
  universe: "dev",
  env: Env.LOCAL,
  instance: "Main",
  version: "FAKE-FAKE",
  appCore: AppCore.WEBUI,
  frontDoorInfo: {
    clientVersion: "FAKE-FAKE",
    appShell: AppShell.BROWSER,
    appPlatform: AppPlatform.DESKTOP_MACOS,
    appDistribution: AppDistribution.WEB,
    initialWindowWidth: undefined,
  },
  webApiProgressReporterUrl: "FAKE-FAKE",
  webApiUrl: "FAKE-FAKE",
  docsUrl: "FAKE-FAKE",
  hostedGlobalDomain: "FAKE-FAKE",
  communityUrl: "FAKE-FAKE",
  termsOfServiceUrl: "FAKE-FAKE",
  privacyPolicyUrl: "FAKE-FAKE",
  inboxTasksToAskForGC: 20,
  overdueInfoDays: 1,
  overdueWarningDays: 2,
  overdueDangerDays: 3,
});

export function serverToClientGlobalProperties(
  globalPropertiesServer: GlobalPropertiesServer,
  frontDoorInfo: FrontDoorInfo,
): GlobalPropertiesClient {
  return {
    publicName: globalPropertiesServer.publicName,
    universe: globalPropertiesServer.universe,
    env: globalPropertiesServer.env,
    instance: globalPropertiesServer.instance,
    version: globalPropertiesServer.version,
    appCore: AppCore.WEBUI,
    frontDoorInfo: frontDoorInfo,
    webApiProgressReporterUrl: globalPropertiesServer.webApiProgressReporterUrl,
    webApiUrl: globalPropertiesServer.webApiUrl,
    docsUrl: globalPropertiesServer.docsUrl,
    hostedGlobalDomain: globalPropertiesServer.hostedGlobalWebUiUrl,
    communityUrl: globalPropertiesServer.communityUrl,
    termsOfServiceUrl: globalPropertiesServer.termsOfServiceUrl,
    privacyPolicyUrl: globalPropertiesServer.privacyPolicyUrl,
    inboxTasksToAskForGC: globalPropertiesServer.inboxTasksToAskForGC,
    overdueInfoDays: globalPropertiesServer.overdueInfoDays,
    overdueWarningDays: globalPropertiesServer.overdueWarningDays,
    overdueDangerDays: globalPropertiesServer.overdueDangerDays,
  };
}
