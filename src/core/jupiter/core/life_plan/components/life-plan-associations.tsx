import type {
  ChapterSummary,
  EntityId,
  GoalSummary,
  MilestoneSummary,
  ProjectSummary,
} from "@jupiter/webapi-client";
import { Box, Stack } from "@mui/material";
import type { DateTime } from "luxon";
import { useEffect, useState } from "react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { ProjectSelect } from "#/core/life_plan/sub/aspects/component/select";
import { ChapterSelect } from "#/core/life_plan/sub/chapters/components/select";
import { GoalSelect } from "#/core/life_plan/sub/goals/components/select";

export interface LifePlanAssociationsProps {
  inputsEnabled: boolean;

  projectName?: string;
  chapterName?: string;
  goalName?: string;

  allProjects: ProjectSummary[];
  projectValue?: EntityId;
  projectDefaultValue?: EntityId;
  onProjectChange?: (value: EntityId) => void;

  allChapters: ChapterSummary[];
  chapterValue?: EntityId | null;
  chapterDefaultValue?: EntityId | null;
  onChapterChange?: (value: EntityId | null) => void;

  allGoals: GoalSummary[];
  goalValue?: EntityId | null;
  goalDefaultValue?: EntityId | null;
  onGoalChange?: (value: EntityId | null) => void;

  birthday: DateTime;
  today: DateTime;
  milestones: MilestoneSummary[];
}

export function LifePlanAssociations(props: LifePlanAssociationsProps) {
  const inputsEnabled = props.inputsEnabled;
  const isBigScreen = useBigScreen();

  const projectName = props.projectName ?? "project";
  const chapterName = props.chapterName ?? "chapter";
  const goalName = props.goalName ?? "goal";

  const rootProject = props.allProjects.find((p) => !p.parent_project_ref_id);

  const [selectedProject, setSelectedProject] = useState<EntityId>(
    props.projectValue ??
      props.projectDefaultValue ??
      rootProject?.ref_id ??
      "",
  );
  const [selectedChapter, setSelectedChapter] = useState<EntityId | null>(
    props.chapterValue ?? props.chapterDefaultValue ?? null,
  );
  const [selectedGoal, setSelectedGoal] = useState<EntityId | null>(
    props.goalValue ?? props.goalDefaultValue ?? null,
  );

  useEffect(() => {
    setSelectedProject(
      props.projectValue ??
        props.projectDefaultValue ??
        rootProject?.ref_id ??
        "",
    );
    setSelectedChapter(props.chapterValue ?? props.chapterDefaultValue ?? null);
    setSelectedGoal(props.goalValue ?? props.goalDefaultValue ?? null);
  }, [
    props.projectValue,
    props.projectDefaultValue,
    props.chapterValue,
    props.chapterDefaultValue,
    props.goalValue,
    props.goalDefaultValue,
    rootProject,
  ]);

  function onProjectChange(value: EntityId) {
    setSelectedProject(value);
    setSelectedChapter(null);
    setSelectedGoal(null);
    props.onProjectChange?.(value);
    props.onChapterChange?.(null);
    props.onGoalChange?.(null);
  }

  function onChapterChange(value: EntityId | null) {
    setSelectedChapter(value);
    props.onChapterChange?.(value);
  }

  function onGoalChange(value: EntityId | null) {
    setSelectedGoal(value);
    props.onGoalChange?.(value);
  }

  return (
    <Stack direction={isBigScreen ? "row" : "column"} spacing={2} useFlexGap>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ProjectSelect
          name={projectName}
          label="Project"
          inputsEnabled={inputsEnabled}
          disabled={false}
          allProjects={props.allProjects}
          value={selectedProject}
          onChange={onProjectChange}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ChapterSelect
          name={chapterName}
          label="Chapter"
          inputsEnabled={inputsEnabled}
          disabled={false}
          onlyForProject={selectedProject}
          allChapters={props.allChapters}
          value={selectedChapter}
          onChange={onChapterChange}
          birthday={props.birthday}
          today={props.today}
          milestones={props.milestones}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <GoalSelect
          name={goalName}
          label="Goal"
          inputsEnabled={inputsEnabled}
          disabled={false}
          onlyForProject={selectedProject}
          allGoals={props.allGoals}
          value={selectedGoal}
          onChange={onGoalChange}
        />
      </Box>
    </Stack>
  );
}
