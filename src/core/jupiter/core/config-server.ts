import { Hosting, Instance, Universe, type Env } from "@jupiter/webapi-client";
import { config } from "dotenv";

export interface GlobalPropertiesServer {
  universe: Universe;
  env: Env;
  instance: Instance;
  hosting: Hosting;
  hostingName: string;
  version: string;
  title: string;
  description: string;
  webApiServerUrl: string;
  webApiProgressReporterUrl: string;
  webApiUrl: string;
  docsUrl: string;
  hostedGlobalWebUiUrl: string;
  pwaStartUrl: string;
  communityUrl: string;
  appsStorageUrl: string;
  macStoreUrl: string;
  appStoreUrl: string;
  googlePlayStoreUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  sessionCookieSecure: boolean;
  sessionCookieSecret: string;
  inboxTasksToAskForGC: number;
  overdueInfoDays: number;
  overdueWarningDays: number;
  overdueDangerDays: number;
}

// @secureFn
function loadGlobalPropertiesOnServer(): GlobalPropertiesServer {
  config({ path: `${process.cwd()}/../Config.global` });
  config({ path: `${process.cwd()}/Config.project` });

  const hosting = process.env.HOSTING as Hosting;
  const webApiServerHost = process.env.WEBAPI_SERVER_HOST as string;
  const webApiServerPort = parseInt(
    process.env.WEBAPI_SERVER_PORT as string,
    10,
  );

  const webApiServerUrl = `http://${webApiServerHost}:${webApiServerPort}`;
  const webApiProgressReporterUrl = process.env
    .WEBAPI_PROGRESS_REPORTER_URL as string;

  const globalProperties = {
    universe: process.env.UNIVERSE as Universe,
    env: process.env.ENV as Env,
    instance: process.env.INSTANCE as Instance,
    hosting: hosting,
    hostingName: process.env.HOSTING_NAME as string,
    version: process.env.VERSION as string,
    title: process.env.TITLE as string,
    description: process.env.DESCRIPTION as string,
    webApiUrl: process.env.WEBAPI_URL as string,
    webApiServerUrl: webApiServerUrl,
    webApiProgressReporterUrl: webApiProgressReporterUrl,
    docsUrl: process.env.DOCS_URL as string,
    hostedGlobalWebUiUrl: process.env.HOSTED_GLOBAL_WEBUI_URL as string,
    pwaStartUrl: process.env.PWA_START_URL as string,
    communityUrl: process.env.COMMUNITY_URL as string,
    appsStorageUrl: process.env.APPS_STORAGE_URL as string,
    macStoreUrl: process.env.MAC_STORE_URL as string,
    appStoreUrl: process.env.APP_STORE_URL as string,
    googlePlayStoreUrl: process.env.GOOGLE_PLAY_STORE_URL as string,
    termsOfServiceUrl: process.env.TERMS_OF_SERVICE_URL as string,
    privacyPolicyUrl: process.env.PRIVACY_POLICY_URL as string,
    sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === "true",
    sessionCookieSecret: process.env.SESSION_COOKIE_SECRET as string,
    inboxTasksToAskForGC: parseInt(
      process.env.INBOX_TASKS_TO_ASK_FOR_GC as string,
      10,
    ),
    overdueInfoDays: parseInt(process.env.OVERDUE_INFO_DAYS as string, 10),
    overdueWarningDays: parseInt(
      process.env.OVERDUE_WARNING_DAYS as string,
      10,
    ),
    overdueDangerDays: parseInt(process.env.OVERDUE_DANGER_DAYS as string, 10),
  };

  return globalProperties;
}

export const GLOBAL_PROPERTIES = loadGlobalPropertiesOnServer();

// A hack!
console.log("=".repeat(80));
console.log(`Starting Jupiter WebUI:`);
console.log(`  Version: ${GLOBAL_PROPERTIES.version}`);
console.log(`  Universe: ${GLOBAL_PROPERTIES.universe}`);
console.log(`  Environment: ${GLOBAL_PROPERTIES.env}`);
console.log(`  Instance: ${GLOBAL_PROPERTIES.instance}`);
console.log(`  Hosting: ${GLOBAL_PROPERTIES.hosting}`);
console.log("=".repeat(80));
