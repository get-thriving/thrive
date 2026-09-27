import { ApiClient } from "@jupiter/webapi-client";
import { redirect } from "react-router";

import { newTraceId } from "#/core/common/trace-id";
import { GLOBAL_PROPERTIES } from "#/core/config-server";
import type { FrontDoorInfo } from "#/core/frontdoor";
import { loadFrontDoorInfo } from "#/core/frontdoor.server";
import { FRONTDOOR_HEADER, TRACE_ID_HEADER } from "#/core/infra/names";

/**
 * What a service has to tell core before its routes can ask for an API
 * client. The two services differ: the WebUI has sessions and a frontdoor
 * cookie, the Published site has neither.
 */
export interface ApiClientsAdapter {
  /** Where this service reaches the WebApi. */
  webApiServerUrl: string;
  /**
   * Whether to read the frontdoor from the request's cookie. The cookie is
   * never set on the published domain, so that service infers everything from
   * the user agent instead.
   */
  readsFrontDoorCookie: boolean;
  /**
   * The caller's auth token, or undefined when they are a guest. Services
   * without sessions leave this out entirely.
   */
  getAuthToken?: (request: Request) => Promise<string | undefined>;
  /** Where to send a request that needs a login and doesn't have one. */
  loginPath?: string;
}

let registeredAdapter: ApiClientsAdapter | undefined = undefined;

/**
 * Called once, at module load, by each service. Requests are only served after
 * every module has loaded, so by the time a loader asks for a client this has
 * run.
 */
export function registerApiClients(adapter: ApiClientsAdapter): void {
  registeredAdapter = adapter;
}

function getAdapter(): ApiClientsAdapter {
  if (registeredAdapter === undefined) {
    throw new Error(
      "No API clients adapter registered - the service should call registerApiClients at startup",
    );
  }
  return registeredAdapter;
}

// Clients are reused per token, so the guest client (an undefined token) is a
// single shared one.
const apiClientsByToken = new Map<undefined | string, ApiClient>();

async function resolveFrontDoor(
  adapter: ApiClientsAdapter,
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<FrontDoorInfo> {
  if (newFrontDoor) {
    return newFrontDoor;
  }

  return loadFrontDoorInfo(
    GLOBAL_PROPERTIES.version,
    adapter.readsFrontDoorCookie ? request.headers.get("Cookie") : null,
    request.headers.get("User-Agent"),
  );
}

function apiClientFor(
  adapter: ApiClientsAdapter,
  token: string | undefined,
  frontDoor: FrontDoorInfo,
): ApiClient {
  const existing = apiClientsByToken.get(token);
  if (existing !== undefined) {
    return existing;
  }

  const newApiClient = new ApiClient({
    BASE: adapter.webApiServerUrl,
    TOKEN: token,
    HEADERS: {
      [FRONTDOOR_HEADER]: `${frontDoor.clientVersion}:${frontDoor.appShell}:${frontDoor.appPlatform}:${frontDoor.appDistribution}`,
      [TRACE_ID_HEADER]: newTraceId(),
    },
  });

  apiClientsByToken.set(token, newApiClient);

  return newApiClient;
}

// @secureFn
export async function getGuestApiClient(
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<ApiClient> {
  const adapter = getAdapter();
  const frontDoor = await resolveFrontDoor(adapter, request, newFrontDoor);
  const token = adapter.getAuthToken
    ? await adapter.getAuthToken(request)
    : undefined;

  return apiClientFor(adapter, token, frontDoor);
}

// @secureFn
export async function getLoggedInApiClient(
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<ApiClient> {
  const adapter = getAdapter();
  const frontDoor = await resolveFrontDoor(adapter, request, newFrontDoor);
  const token = adapter.getAuthToken
    ? await adapter.getAuthToken(request)
    : undefined;

  if (token === undefined) {
    throw redirect(adapter.loginPath ?? "/");
  }

  return apiClientFor(adapter, token, frontDoor);
}
