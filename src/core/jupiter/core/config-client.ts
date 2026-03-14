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

import type {
  GlobalPropertiesServer,
  ServicePropertiesServer,
} from "#/core/config-server";
import type { FrontDoorInfo } from "#/core/frontdoor";

export interface GlobalPropertiesClient {
  publicName: string;
  description: string;
  universe: Universe;
  env: Env;
  instance: Instance;
  version: string;
  hostedGlobalDomain: string;
  communityUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

export interface ServicePropertiesClient {
  appCore: AppCore;
  frontDoorInfo: FrontDoorInfo;
  webApiProgressReporterUrl: string;
  webApiUrl: string;
  apiUrl: string;
  mcpUrl: string;
  docsUrl: string;
  inboxTasksToAskForGC: number;
  overdueInfoDays: number;
  overdueWarningDays: number;
  overdueDangerDays: number;
}

export const GlobalPropertiesContext = createContext<GlobalPropertiesClient>({
  publicName: "FAKE-FAKE",
  description: "FAKE-FAKE",
  universe: "dev",
  env: Env.LOCAL,
  instance: "Main",
  version: "FAKE-FAKE",
  hostedGlobalDomain: "FAKE-FAKE",
  communityUrl: "FAKE-FAKE",
  termsOfServiceUrl: "FAKE-FAKE",
  privacyPolicyUrl: "FAKE-FAKE",
});

export const ServicePropertiesContext = createContext<ServicePropertiesClient>({
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
  apiUrl: "FAKE-FAKE",
  mcpUrl: "FAKE-FAKE",
  docsUrl: "FAKE-FAKE",
  inboxTasksToAskForGC: 20,
  overdueInfoDays: 1,
  overdueWarningDays: 2,
  overdueDangerDays: 3,
});

export function serverToClientGlobalProperties(
  globalPropertiesServer: GlobalPropertiesServer,
): GlobalPropertiesClient {
  return {
    publicName: globalPropertiesServer.publicName,
    description: globalPropertiesServer.description,
    universe: globalPropertiesServer.universe,
    env: globalPropertiesServer.env,
    instance: globalPropertiesServer.instance,
    version: globalPropertiesServer.version,
    hostedGlobalDomain: globalPropertiesServer.hostedGlobalWebUiUrl,
    communityUrl: globalPropertiesServer.communityUrl,
    termsOfServiceUrl: globalPropertiesServer.termsOfServiceUrl,
    privacyPolicyUrl: globalPropertiesServer.privacyPolicyUrl,
  };
}

export function serverToClientServiceProperties(
  servicePropertiesServer: ServicePropertiesServer,
  frontDoorInfo: FrontDoorInfo,
): ServicePropertiesClient {
  return {
    appCore: AppCore.WEBUI,
    frontDoorInfo: frontDoorInfo,
    webApiProgressReporterUrl:
      servicePropertiesServer.webApiProgressReporterUrl,
    webApiUrl: servicePropertiesServer.webApiUrl,
    apiUrl: servicePropertiesServer.apiUrl,
    mcpUrl: servicePropertiesServer.mcpUrl,
    docsUrl: servicePropertiesServer.docsUrl,
    inboxTasksToAskForGC: servicePropertiesServer.inboxTasksToAskForGC,
    overdueInfoDays: servicePropertiesServer.overdueInfoDays,
    overdueWarningDays: servicePropertiesServer.overdueWarningDays,
    overdueDangerDays: servicePropertiesServer.overdueDangerDays,
  };
}
