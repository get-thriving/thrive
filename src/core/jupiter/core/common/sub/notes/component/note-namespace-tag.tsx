import { NoteNamespace } from "@jupiter/webapi-client";

import { noteNamespaceName } from "#/core/common/sub/notes/namespace";
import { SlimChip } from "#/core/infra/component/chips";

interface NoteNamespaceTagProps {
  namespace: NoteNamespace;
}

export function NoteNamespaceTag(props: NoteNamespaceTagProps) {
  return (
    <SlimChip label={noteNamespaceName(props.namespace)} color="default" />
  );
}
