import { parseEntityLinkStd } from "#/core/common/entity-link";
import { publishOwnerEntityTagName } from "#/core/common/sub/publish/publish-owner-type-name";
import { SlimChip } from "#/core/infra/component/chips";

interface PublishOwnerTypeChipProps {
  owner: string;
}

export function PublishOwnerTypeChip(props: PublishOwnerTypeChipProps) {
  const { theType } = parseEntityLinkStd(props.owner);
  return (
    <SlimChip label={publishOwnerEntityTagName(theType)} color="default" />
  );
}
