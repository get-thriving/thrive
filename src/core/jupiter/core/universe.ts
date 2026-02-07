import { Hosting, Universe } from "@jupiter/webapi-client";

const THRIVE_UNIVERSE = "thrive";
const DEV_UNIVERSE = "dev";

export function isThriveUniverse(universe: Universe): boolean {
  return universe === THRIVE_UNIVERSE;
}

export function isDevUniverse(universe: Universe): boolean {
  return universe === DEV_UNIVERSE;
}

export function getHosting(universe: Universe): Hosting {
  if (isThriveUniverse(universe)) {
    return Hosting.HOSTED_GLOBAL;
  }
  if (isDevUniverse(universe)) {
    return Hosting.LOCAL;
  }
  return Hosting.SELF_HOSTED;
}
