import type { Location } from "@jupiter/webapi-client";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { SlimChip } from "#/core/infra/component/chips";

interface LocationTagProps {
  location: Location;
}

export function LocationTag(props: LocationTagProps) {
  return (
    <SlimChip
      icon={<LocationOnIcon />}
      label={props.location.name}
      color="primary"
    />
  );
}
