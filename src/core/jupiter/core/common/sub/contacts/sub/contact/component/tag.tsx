import type { Contact } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  contact: Contact;
}

export function ContactTag(props: Props) {
  return <LinkTag label={props.contact.name} color="primary" />;
}
