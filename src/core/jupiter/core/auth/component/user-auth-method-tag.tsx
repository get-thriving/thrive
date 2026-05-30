import { UserAuthMethod } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface UserAuthMethodTagProps {
  authMethod: UserAuthMethod;
}

function authMethodLabel(authMethod: UserAuthMethod): string {
  switch (authMethod) {
    case UserAuthMethod.LOCAL:
      return "Local";
    case UserAuthMethod.GOOGLE:
      return "Google";
    case UserAuthMethod.APPLE:
      return "Apple";
    default:
      return authMethod;
  }
}

export function UserAuthMethodTag(props: UserAuthMethodTagProps) {
  return (
    <SlimChip
      label={authMethodLabel(props.authMethod)}
      color="default"
      size="small"
    />
  );
}
