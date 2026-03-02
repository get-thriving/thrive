import { PersonNamespace } from "@jupiter/webapi-client";

import { personNamespaceName } from "#/core/common/sub/persons/namespace";
import { SlimChip } from "#/core/infra/component/chips";

interface PersonNamespaceTagProps {
  namespace: PersonNamespace;
}

export function PersonNamespaceTag(props: PersonNamespaceTagProps) {
  return (
    <SlimChip label={personNamespaceName(props.namespace)} color="default" />
  );
}
