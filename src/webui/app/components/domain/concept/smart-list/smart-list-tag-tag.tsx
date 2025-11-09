import type { SmartListTag } from "@jupiter/webapi-client";
import { SlimChip } from "@jupiter/core/infra/components/chips";

interface Props {
  tag: SmartListTag;
}

export function SmartListTagTag({ tag }: Props) {
  return <SlimChip color="success" label={tag.tag_name} />;
}
