import type { Location } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface LocationTagProps {
  location: Location;
}

export function LocationTag(props: LocationTagProps) {
  return <SlimChip label={props.location.name} color="primary" />;
}
