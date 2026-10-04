import { GLOBAL_PROPERTIES } from "#/core/config-server";
import { isLocal } from "#/core/env";

function hostnameForUrl(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function hostnameMatchesInfraRoot(
  hostname: string,
  infraRoot: string,
): boolean {
  const normalizedRoot = infraRoot.toLowerCase();
  return hostname === normalizedRoot || hostname.endsWith(`.${normalizedRoot}`);
}

export function isAllowedOauthCallbackUrl(
  url: string,
  localWebUiUrl: string,
): boolean {
  const hostname = hostnameForUrl(url);
  if (hostname === null) {
    return false;
  }

  const hostedWebUiHostname = hostnameForUrl(
    GLOBAL_PROPERTIES.hostedGlobalWebUiUrl,
  );
  if (hostedWebUiHostname !== null && hostname === hostedWebUiHostname) {
    return true;
  }

  if (
    hostnameMatchesInfraRoot(hostname, GLOBAL_PROPERTIES.globalHostedInfraRoot)
  ) {
    return true;
  }

  if (isLocal(GLOBAL_PROPERTIES.env)) {
    const localWebUiHostname = hostnameForUrl(localWebUiUrl);
    if (localWebUiHostname !== null && hostname === localWebUiHostname) {
      return true;
    }
  }

  return false;
}
