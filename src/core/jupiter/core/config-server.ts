import {
  Env,
  Instance,
  JupiterAuthProvider,
  JupiterCrmBackend,
  JupiterEmailVerificationStrategy,
  JupiterTelemetry,
  Universe,
} from "@jupiter/webapi-client";
import { config } from "dotenv";

import { newOrGenerateInstance } from "#/core/instance";
import { getHosting, isThriveUniverse } from "#/core/universe";

export interface GlobalPropertiesServer {
  publicName: string;
  description: string;
  universe: Universe;
  env: Env;
  instance: Instance;
  version: string;
  authProvider: JupiterAuthProvider;
  emailVerificationStrategy: JupiterEmailVerificationStrategy;
  telemetry: JupiterTelemetry;
  crmBackend: JupiterCrmBackend;
  hostedGlobalWebUiUrl: string;
  hostedGlobalPublishedUrl: string;
  globalHostedInfraRoot: string;
  communityUrl: string;
  appsStorageUrl: string;
  macStoreUrl: string;
  appStoreUrl: string;
  googlePlayStoreUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

// @secureFn
function loadGlobalPropertiesOnServer(): GlobalPropertiesServer {
  config({ path: `${process.cwd()}/../Config.global` });

  const globalProperties = {
    publicName: process.env.PUBLIC_NAME as string,
    description: process.env.DESCRIPTION as string,
    universe: process.env.UNIVERSE as Universe,
    env: process.env.ENV as Env,
    instance: process.env.RENDER
      ? newOrGenerateInstance(
          process.env.INSTANCE as string,
          process.env.RENDER_GIT_BRANCH as string,
        )
      : (process.env.INSTANCE as Instance),
    version: process.env.VERSION as string,
    authProvider: (process.env.AUTH_PROVIDER ?? "local") as JupiterAuthProvider,
    emailVerificationStrategy: (process.env.EMAIL_VERIFICATION_STRATEGY ??
      "none") as JupiterEmailVerificationStrategy,
    telemetry: (process.env.TELEMETRY ?? "local") as JupiterTelemetry,
    crmBackend: (process.env.CRM ?? "noop") as JupiterCrmBackend,
    hostedGlobalWebUiUrl: process.env.HOSTED_GLOBAL_WEBUI_URL as string,
    hostedGlobalPublishedUrl: process.env.HOSTED_GLOBAL_PUBLISHED_URL as string,
    globalHostedInfraRoot: process.env.GLOBAL_HOSTED_INFRA_ROOT as string,
    communityUrl: process.env.COMMUNITY_URL as string,
    appsStorageUrl: process.env.APPS_STORAGE_URL as string,
    macStoreUrl: process.env.MAC_STORE_URL as string,
    appStoreUrl: process.env.APP_STORE_URL as string,
    googlePlayStoreUrl: process.env.GOOGLE_PLAY_STORE_URL as string,
    termsOfServiceUrl: process.env.TERMS_OF_SERVICE_URL as string,
    privacyPolicyUrl: process.env.PRIVACY_POLICY_URL as string,
  };

  return globalProperties;
}

export function resolveWebUiUrl(
  globalProperties: GlobalPropertiesServer,
): string {
  const webUiUrl = process.env.WEBUI_URL as string;

  if (
    isThriveUniverse(globalProperties.universe) &&
    globalProperties.env === Env.PRODUCTION
  ) {
    return globalProperties.hostedGlobalWebUiUrl;
  }

  return webUiUrl;
}

// The domain to scope the WebUI's session and auth cookies to. We deliberately
// pin this to the exact WebUI host (e.g. `app.get-thriving.com`) so the cookies
// are NEVER shared with the apex domain (`get-thriving.com`) or sibling services
// like the published site. Returning `undefined` yields a host-only cookie,
// which is what we want for local development and raw IP hosts (browsers reject
// or needlessly broaden an explicit Domain there).
export function resolveSessionCookieDomain(
  globalProperties: GlobalPropertiesServer,
): string | undefined {
  let host: string;
  try {
    host = new URL(resolveWebUiUrl(globalProperties)).hostname;
  } catch {
    return undefined;
  }

  const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    isIpv4
  ) {
    return undefined;
  }

  return host;
}

export function resolvePublishedUrl(
  globalProperties: GlobalPropertiesServer,
): string {
  const publishedUrl = process.env.PUBLISHED_URL as string;

  if (
    isThriveUniverse(globalProperties.universe) &&
    globalProperties.env === Env.PRODUCTION
  ) {
    return globalProperties.hostedGlobalPublishedUrl;
  }

  return publishedUrl;
}

export const GLOBAL_PROPERTIES = loadGlobalPropertiesOnServer();

// Each service calls this once from its own config module, mirroring the
// startup banners that the Python services print.
export function logServiceStartupBanner(serviceName: string) {
  console.log("=".repeat(80));
  console.log(`Starting Jupiter ${serviceName}:`);
  console.log(`  Version: ${GLOBAL_PROPERTIES.version}`);
  console.log(`  Universe: ${GLOBAL_PROPERTIES.universe}`);
  console.log(`  Environment: ${GLOBAL_PROPERTIES.env}`);
  console.log(`  Instance: ${GLOBAL_PROPERTIES.instance}`);
  console.log(`  Hosting: ${getHosting(GLOBAL_PROPERTIES.universe)}`);
  console.log("-".repeat(80));
  console.log(`  Auth Provider: ${GLOBAL_PROPERTIES.authProvider}`);
  console.log(
    `  Email Verification Strategy: ${GLOBAL_PROPERTIES.emailVerificationStrategy}`,
  );
  console.log(`  CRM Backend: ${GLOBAL_PROPERTIES.crmBackend}`);
  console.log(`  Telemetry: ${GLOBAL_PROPERTIES.telemetry}`);
  console.log("=".repeat(80));
}
