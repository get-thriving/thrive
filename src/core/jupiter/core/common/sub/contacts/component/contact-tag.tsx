import type { Contact } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface ContactTagProps {
  contact: Contact;
}

export function ContactTag(props: ContactTagProps) {
  return <SlimChip label={`@${props.contact.name}`} color="primary" />;
}
