import type { Location } from "@jupiter/webapi-client";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { SlimChip } from "#/core/infra/component/chips";

interface LocationTagProps {
  location: Location;
}

export function formatLocationNames(locations: Array<Location>): string {
  return locations.map((location) => location.name).join(" · ");
}

export function LocationTag(props: LocationTagProps) {
  return (
    <SlimChip
      icon={props.location.is_key ? <HomeIcon /> : <LocationOnIcon />}
      label={props.location.name}
      color={props.location.is_key ? "warning" : "primary"}
    />
  );
}
