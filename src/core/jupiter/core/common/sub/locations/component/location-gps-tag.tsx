import type { GpsCoordinates } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface LocationGpsTagProps {
  gps: GpsCoordinates;
}

function clipCoord(value: number): string {
  return (Math.trunc(value * 1000) / 1000).toFixed(3);
}

export function LocationGpsTag({ gps }: LocationGpsTagProps) {
  return (
    <SlimChip
      label={`${clipCoord(gps.latitude)}, ${clipCoord(gps.longitude)}`}
      color="default"
    />
  );
}
