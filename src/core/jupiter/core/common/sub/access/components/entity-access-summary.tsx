import type { UserLight } from "@jupiter/webapi-client";
import { Divider } from "@mui/material";

import { EntityAccessRow } from "#/core/common/sub/access/components/entity-access-row";
import { formatUserLightLabel } from "#/core/users/components/user-light-chip";

interface EntityAccessSummaryProps {
  owner: UserLight;
}

export function EntityAccessSummary(props: EntityAccessSummaryProps) {
  return (
    <>
      <EntityAccessRow
        label="owner"
        userLabel={formatUserLightLabel(props.owner)}
      />
      <Divider />
    </>
  );
}
