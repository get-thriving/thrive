import type { SlackTask } from "@jupiter/webapi-client";

import { slackTaskNiceName } from "#/core/push_integrations/sub/slack/task";
import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  slackTask: SlackTask;
}

export function SlackTaskTag(props: Props) {
  return <LinkTag label={slackTaskNiceName(props.slackTask)} color="primary" />;
}
