import { AppShell } from "@jupiter/webapi-client";
import { useContext } from "react";

import { FrontDoorInfoContext } from "#/core/infra/frontdoor-info-context";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";

/**
 * Whether the places the keys lead to may be opened in a tab of their own
 * (`⇧` with the last letter of a label): in a browser on a computer, which has
 * tabs. A phone, and the apps that wrap the web app, have none to open.
 */
export function useStrataNewTab(): boolean {
  const frontDoor = useContext(FrontDoorInfoContext);
  const columns = useContext(StrataColumnsContext);
  return frontDoor.appShell === AppShell.BROWSER && columns?.phone !== true;
}
