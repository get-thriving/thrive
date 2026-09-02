import type { GpsCoordinates, Location } from "@jupiter/webapi-client";

import { compareIsKey } from "#/core/common/is-key";

export function sortLocationsNaturally(locations: Location[]): Location[] {
  return [...locations].sort(
    (a, b) => compareIsKey(a.is_key, b.is_key) || a.name.localeCompare(b.name),
  );
}

export function locationGps(location: Location): GpsCoordinates | null {
  if (location.lat == null || location.lng == null) {
    return null;
  }
  return { latitude: location.lat, longitude: location.lng };
}
