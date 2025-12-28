import type { Project, ProjectSummary } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";

interface Props {
  project: Project | ProjectSummary;
}

export function ProjectTag(props: Props) {
  return <SlimChip label={`⭐ ${props.project.name}`} color="info" />;
}
