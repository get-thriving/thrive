import { AppCore } from "@jupiter/webapi-client";
import { config } from "dotenv";
import {
  GLOBAL_PROPERTIES,
  logServiceStartupBanner,
  resolvePublishedUrl,
} from "@jupiter/core/config-server";
import type { FrontDoorInfo } from "@jupiter/core/frontdoor";

import type { ServicePropertiesClient } from "~/logic/config";

export interface ServicePropertiesServer {
  webApiServerUrl: string;
  publishedUrl: string;
  docsUrl: string;
}

// @secureFn
function loadServicePropertiesOnServer(): ServicePropertiesServer {
  config({ path: `${process.cwd()}/Config.project` });

  const webApiServerHost = process.env.WEBAPI_SERVER_HOST as string;
  const webApiServerPort = parseInt(
    process.env.WEBAPI_SERVER_PORT as string,
    10,
  );

  const serviceProperties = {
    webApiServerUrl: `http://${webApiServerHost}:${webApiServerPort}`,
    publishedUrl: resolvePublishedUrl(GLOBAL_PROPERTIES),
    docsUrl: process.env.DOCS_URL as string,
  };

  return serviceProperties;
}

export const SERVICE_PROPERTIES = loadServicePropertiesOnServer();

logServiceStartupBanner("published");

export function serverToClientServiceProperties(
  servicePropertiesServer: ServicePropertiesServer,
  frontDoorInfo: FrontDoorInfo,
): ServicePropertiesClient {
  return {
    appCore: AppCore.PUBLISHED,
    frontDoorInfo: frontDoorInfo,
    // The published service is read-only and never triggers mutations, so
    // there is no progress reporter to connect to.
    webApiProgressReporterUrl: "",
    publishedUrl: servicePropertiesServer.publishedUrl,
    docsUrl: servicePropertiesServer.docsUrl,
    // Standard display thresholds - guests can't configure these.
    overdueInfoDays: 1,
    overdueWarningDays: 7,
    overdueDangerDays: 21,
  };
}
