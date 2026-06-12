import { ApiClient } from "@jupiter/webapi-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import type { FrontDoorInfo } from "@jupiter/core/frontdoor";
import { loadFrontDoorInfo } from "@jupiter/core/frontdoor.server";
import { FRONTDOOR_HEADER, TRACE_ID_HEADER } from "@jupiter/core/infra/names";
import { newTraceId } from "@jupiter/core/common/trace-id";

import { SERVICE_PROPERTIES } from "~/logic/config.server";

let _GUEST_API_CLIENT: ApiClient | undefined = undefined;

// @secureFn
export async function getGuestApiClient(
  request: Request,
  newFrontDoor?: FrontDoorInfo,
): Promise<ApiClient> {
  // The frontdoor cookie is never set on the published domain; infer
  // everything from the user agent.
  const frontDoor =
    newFrontDoor ||
    (await loadFrontDoorInfo(
      GLOBAL_PROPERTIES.version,
      null,
      request.headers.get("User-Agent"),
    ));

  if (_GUEST_API_CLIENT !== undefined) {
    return _GUEST_API_CLIENT;
  }

  const base = SERVICE_PROPERTIES.webApiServerUrl;

  _GUEST_API_CLIENT = new ApiClient({
    BASE: base,
    HEADERS: {
      [FRONTDOOR_HEADER]: `${frontDoor.clientVersion}:${frontDoor.appShell}:${frontDoor.appPlatform}:${frontDoor.appDistribution}`,
      [TRACE_ID_HEADER]: newTraceId(),
    },
  });

  return _GUEST_API_CLIENT;
}
