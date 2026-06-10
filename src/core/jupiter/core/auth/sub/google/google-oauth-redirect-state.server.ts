import { GLOBAL_PROPERTIES } from "#/core/config-server";
import { isLocal } from "#/core/env";

export interface GoogleOauthRedirectState {
  callbackSuccessUrl: string;
  callbackFailureUrl: string;
}

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

export function isAllowedGoogleOauthCallbackUrl(
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

export function decodeGoogleOauthRedirectState(
  state: string,
): GoogleOauthRedirectState | null {
  try {
    const padding = "=".repeat((4 - (state.length % 4)) % 4);
    const raw = Buffer.from(`${state}${padding}`, "base64url").toString(
      "utf-8",
    );
    const payload = JSON.parse(raw) as {
      v?: unknown;
      callback_success_url?: unknown;
      callback_failure_url?: unknown;
    };

    if (
      payload.v !== 1 ||
      typeof payload.callback_success_url !== "string" ||
      typeof payload.callback_failure_url !== "string"
    ) {
      return null;
    }

    return {
      callbackSuccessUrl: payload.callback_success_url,
      callbackFailureUrl: payload.callback_failure_url,
    };
  } catch {
    return null;
  }
}
