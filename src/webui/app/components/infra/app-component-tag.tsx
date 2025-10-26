import { AppComponent } from "@jupiter/webapi-client";

import { SlimChip } from "~/components/infra/chips";
import { appComponentName } from "~/logic/domain/app-component";

interface Props {
  source: string;
}

export function AppComponentTag(props: Props) {
  // If the source is not valid for AppComponent, return a chip with just the value of source.
  if (!Object.values(AppComponent).includes(props.source as AppComponent)) {
    return <SlimChip label={props.source} color="info" />;
  }
  const tagName = appComponentName(props.source as AppComponent);
  return <SlimChip label={tagName} color="info" />;
}
