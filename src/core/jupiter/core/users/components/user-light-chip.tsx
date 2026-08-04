import type { EntityId, UserLight } from "@jupiter/webapi-client";

import { CornerChip } from "#/core/infra/component/chips";

interface UserLightChipProps {
  user: UserLight;
  currentUserRefId?: EntityId;
}

export function formatUserLightLabel(user: UserLight): string {
  return `${user.name} (${user.email_address})`;
}

export function UserLightChip(props: UserLightChipProps) {
  if (
    props.currentUserRefId !== undefined &&
    props.user.ref_id === props.currentUserRefId
  ) {
    return null;
  }

  return (
    <CornerChip
      label={`From @${props.user.name}`}
      title={formatUserLightLabel(props.user)}
      color="secondary"
    />
  );
}
