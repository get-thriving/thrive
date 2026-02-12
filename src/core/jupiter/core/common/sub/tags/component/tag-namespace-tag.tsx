import { TagNamespace } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { tagNamespaceName } from "#/core/common/sub/tags/namespace";

interface TagNamespaceTagProps {
  namespace: TagNamespace;
}

export function TagNamespaceTag(props: TagNamespaceTagProps) {
  return <SlimChip label={tagNamespaceName(props.namespace)} color="default" />;
}
