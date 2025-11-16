import type { SlackTask } from "@jupiter/webapi-client";
import { slackTaskNiceName } from "~/push_integrations/sub/slack/task";

import { LinkTag } from "~/infra/component/link-tag";

interface Props {
  slackTask: SlackTask;
}

export function SlackTaskTag(props: Props) {
  return <LinkTag label={slackTaskNiceName(props.slackTask)} color="primary" />;
}
