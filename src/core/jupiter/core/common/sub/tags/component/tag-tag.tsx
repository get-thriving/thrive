import type { Tag } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface TagTagProps {
  tag: Tag;
}

export function TagTag(props: TagTagProps) {
  return <SlimChip label={`#${props.tag.name}`} color="default" />;
}
