import type { Project } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  project: Project;
}

export function ProjectTag(props: Props) {
  return <LinkTag label={props.project.name} color="primary" />;
}
