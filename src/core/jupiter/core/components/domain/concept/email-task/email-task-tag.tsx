import type { EmailTask } from "@jupiter/webapi-client";

import { emailTaskNiceName } from "@jupiter/core/push_integrations/sub/email/task";
import { LinkTag } from "@jupiter/core/infra/component/link-tag";

interface Props {
  emailTask: EmailTask;
}

export function EmailTaskTag(props: Props) {
  return <LinkTag label={emailTaskNiceName(props.emailTask)} color="primary" />;
}
