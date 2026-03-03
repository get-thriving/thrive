import type { Contact, Person } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  person: Person;
  contact: Contact;
}

export function PersonTag(props: Props) {
  return <LinkTag label={props.contact.name} color="primary" />;
}
