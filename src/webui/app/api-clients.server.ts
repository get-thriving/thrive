import { ApiClient } from "@jupiter/webapi-client";
import { redirect } from "@remix-run/node";
import {
  GLOBAL_PROPERTIES,
  SERVICE_PROPERTIES,
} from "@jupiter/core/config-server";
import type { FrontDoorInfo } from "@jupiter/core/frontdoor";
import { loadFrontDoorInfo } from "@jupiter/core/frontdoor.server";
import { AUTH_TOKEN_NAME, FRONTDOOR_HEADER } from "@jupiter/core/infra/names";

import { getSession } from "~/sessions";

const _API_CLIENTS_BY_SESSION = new Map<undefined | string, ApiClient>();

// @secureFn
export async function getGuestApiClient(
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<ApiClient> {
  const session = await getSession(request.headers.get("Cookie"));
  const frontDoor =
    newFrontDoor ||
    (await loadFrontDoorInfo(
      GLOBAL_PROPERTIES.version,
      request.headers.get("Cookie"),
      request.headers.get("User-Agent"),
    ));

  let token = undefined;
  if (session !== undefined && session.has(AUTH_TOKEN_NAME)) {
    token = session.get(AUTH_TOKEN_NAME);
  }

  if (_API_CLIENTS_BY_SESSION.has(token)) {
    return _API_CLIENTS_BY_SESSION.get(token) as ApiClient;
  }

  const base = SERVICE_PROPERTIES.webApiServerUrl;

  const newApiClient = new ApiClient({
    BASE: base,
    TOKEN: token,
    HEADERS: {
      [FRONTDOOR_HEADER]: `${frontDoor.clientVersion}:${frontDoor.appShell}:${frontDoor.appPlatform}:${frontDoor.appDistribution}`,
    },
  });

  _API_CLIENTS_BY_SESSION.set(token, newApiClient);

  return newApiClient;
}

// @secureFn
export async function getLoggedInApiClient(
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<ApiClient> {
  const session = await getSession(request.headers.get("Cookie"));
  const frontDoor =
    newFrontDoor ||
    (await loadFrontDoorInfo(
      GLOBAL_PROPERTIES.version,
      request.headers.get("Cookie"),
      request.headers.get("User-Agent"),
    ));

  if (!session.has(AUTH_TOKEN_NAME)) {
    throw redirect("/app/login");
  }

  const authTokenExtStr = session.get(AUTH_TOKEN_NAME);

  if (_API_CLIENTS_BY_SESSION.has(authTokenExtStr)) {
    return _API_CLIENTS_BY_SESSION.get(authTokenExtStr) as ApiClient;
  }

  const base = SERVICE_PROPERTIES.webApiServerUrl;

  const newApiClient = new ApiClient({
    BASE: base,
    TOKEN: authTokenExtStr,
    HEADERS: {
      [FRONTDOOR_HEADER]: `${frontDoor.clientVersion}:${frontDoor.appShell}:${frontDoor.appPlatform}:${frontDoor.appDistribution}`,
    },
  });

  _API_CLIENTS_BY_SESSION.set(authTokenExtStr, newApiClient);

  return newApiClient;
}
