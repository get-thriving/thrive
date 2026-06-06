import { SlimChip } from "#/core/infra/component/chips";
import { appComponentName } from "#/core/app-component";

interface Props {
  source: string;
}

export function AppComponentTag(props: Props) {
  return <SlimChip label={appComponentName(props.source)} color="info" />;
}
