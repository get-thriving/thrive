import {
  Env,
  Instance,
  JupiterAuthProvider,
  JupiterCrmBackend,
  JupiterTelemetry,
  JupiterWebApiLocationResolver,
  Universe,
} from "@jupiter/webapi-client";
import { createContext } from "react";

import type { GlobalPropertiesServer } from "#/core/config-server";

export interface GlobalPropertiesClient {
  publicName: string;
  description: string;
  universe: Universe;
  env: Env;
  instance: Instance;
  version: string;
  authProvider: JupiterAuthProvider;
  telemetry: JupiterTelemetry;
  crmBackend: JupiterCrmBackend;
  locationResolver: JupiterWebApiLocationResolver;
  hostedGlobalDomain: string;
  communityUrl: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

export const GlobalPropertiesContext = createContext<GlobalPropertiesClient>({
  publicName: "FAKE-FAKE",
  description: "FAKE-FAKE",
  universe: "dev",
  env: Env.LOCAL,
  instance: "Main",
  version: "FAKE-FAKE",
  authProvider: JupiterAuthProvider.LOCAL,
  telemetry: JupiterTelemetry.LOCAL,
  crmBackend: JupiterCrmBackend.NOOP,
  locationResolver: JupiterWebApiLocationResolver.NOOP,
  hostedGlobalDomain: "FAKE-FAKE",
  communityUrl: "FAKE-FAKE",
  termsOfServiceUrl: "FAKE-FAKE",
  privacyPolicyUrl: "FAKE-FAKE",
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
    authProvider: globalPropertiesServer.authProvider,
    telemetry: globalPropertiesServer.telemetry,
    crmBackend: globalPropertiesServer.crmBackend,
    locationResolver: globalPropertiesServer.locationResolver,
    hostedGlobalDomain: globalPropertiesServer.hostedGlobalWebUiUrl,
    communityUrl: globalPropertiesServer.communityUrl,
    termsOfServiceUrl: globalPropertiesServer.termsOfServiceUrl,
    privacyPolicyUrl: globalPropertiesServer.privacyPolicyUrl,
  };
}
