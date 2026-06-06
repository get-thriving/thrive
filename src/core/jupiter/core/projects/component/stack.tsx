import type {
  Project,
  ProjectMilestone,
  ProjectStats,
} from "@jupiter/webapi-client";
import { Stack } from "@mui/material";

import type { ProjectParent } from "#/core/projects/root";
import type { TopLevelInfo } from "#/core/infra/top-level-context";
import type { ProjectShowOptions } from "#/core/projects/component/card";
import { ProjectCard } from "#/core/projects/component/card";
import { StandardDivider } from "#/core/infra/component/standard-divider";

interface ProjectStackProps {
  topLevelInfo: TopLevelInfo;
  label?: string;
  bigPlans: Project[];
  bigPlanMilestonesByRefId?: Map<string, ProjectMilestone[]>;
  bigPlanStatsByRefId?: Map<string, ProjectStats>;
  entriesByRefId?: Map<string, ProjectParent>;
  selectedPredicate?: (it: Project) => boolean;
  compact?: boolean;
  showOptions: ProjectShowOptions;
  allowSelect?: boolean;
  allowSwipe?: boolean;
  onClick?: (it: Project) => void;
  onCardMarkDone?: (it: Project) => void;
  onCardMarkNotDone?: (it: Project) => void;
}

export function ProjectStack(props: ProjectStackProps) {
  return (
    <Stack spacing={0.5}>
      {props.label && <StandardDivider title={props.label} size="large" />}

      {props.bigPlans.map((entry) => {
        return (
          <ProjectCard
            key={`project-${entry.ref_id}`}
            topLevelInfo={props.topLevelInfo}
            allowSwipe={props.allowSwipe}
            compact={props.compact}
            allowSelect={props.allowSelect}
            bigPlan={entry}
            bigPlanMilestones={props.bigPlanMilestonesByRefId?.get(
              entry.ref_id,
            )}
            bigPlanStats={props.bigPlanStatsByRefId?.get(entry.ref_id)}
            selected={props.selectedPredicate?.(entry)}
            showOptions={props.showOptions}
            parent={props.entriesByRefId?.get(entry.ref_id)}
            onClick={
              props.onClick
                ? () => props.onClick && props.onClick(entry)
                : undefined
            }
            onMarkDone={
              props.onCardMarkDone
                ? () => props.onCardMarkDone && props.onCardMarkDone(entry)
                : undefined
            }
            onMarkNotDone={
              props.onCardMarkNotDone
                ? () =>
                    props.onCardMarkNotDone && props.onCardMarkNotDone(entry)
                : undefined
            }
          />
        );
      })}
    </Stack>
  );
}
