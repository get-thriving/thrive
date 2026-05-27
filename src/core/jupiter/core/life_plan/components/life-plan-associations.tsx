import type {
  ChapterSummary,
  EntityId,
  GoalSummary,
  MilestoneSummary,
  AspectSummary,
} from "@jupiter/webapi-client";
import { Box, Stack } from "@mui/material";
import type { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { AspectSelect } from "#/core/life_plan/sub/aspects/component/select";
import { ChapterSelect } from "#/core/life_plan/sub/chapters/components/select";
import { GoalSelect } from "#/core/life_plan/sub/goals/components/select";

export interface LifePlanAssociationsProps {
  inputsEnabled: boolean;

  aspectName?: string;
  chapterName?: string;
  goalName?: string;

  allAspects: AspectSummary[];
  aspectValue?: EntityId;
  aspectDefaultValue?: EntityId;
  onAspectChange?: (value: EntityId) => void;

  allChapters: ChapterSummary[];
  chapterValue?: EntityId | null;
  chapterDefaultValue?: EntityId | null;
  onChapterChange?: (value: EntityId | null) => void;
  chapterOnlyForSelectedAspect?: boolean;

  allGoals: GoalSummary[];
  goalValue?: EntityId | null;
  goalDefaultValue?: EntityId | null;
  onGoalChange?: (value: EntityId | null) => void;

  birthday: DateTime;
  today: DateTime;
  allMilestones: MilestoneSummary[];
}

export function LifePlanAssociations(props: LifePlanAssociationsProps) {
  const inputsEnabled = props.inputsEnabled;
  const isBigScreen = useBigScreen();

  const aspectName = props.aspectName ?? "aspect";
  const chapterName = props.chapterName ?? "chapter";
  const goalName = props.goalName ?? "goal";
  const chapterOnlyForSelectedAspect =
    props.chapterOnlyForSelectedAspect ?? true;

  const rootAspect = props.allAspects.find((p) => !p.parent_aspect_ref_id);
  const allChaptersByRefId = useMemo(
    () =>
      new Map(props.allChapters.map((chapter) => [chapter.ref_id, chapter])),
    [props.allChapters],
  );

  const [selectedAspect, setSelectedAspect] = useState<EntityId>(
    props.aspectValue ?? props.aspectDefaultValue ?? rootAspect?.ref_id ?? "",
  );
  const [selectedChapter, setSelectedChapter] = useState<EntityId | null>(
    props.chapterValue ?? props.chapterDefaultValue ?? null,
  );
  const [selectedGoal, setSelectedGoal] = useState<EntityId | null>(
    props.goalValue ?? props.goalDefaultValue ?? null,
  );

  useEffect(() => {
    setSelectedAspect(
      props.aspectValue ?? props.aspectDefaultValue ?? rootAspect?.ref_id ?? "",
    );
    setSelectedChapter(props.chapterValue ?? props.chapterDefaultValue ?? null);
    setSelectedGoal(props.goalValue ?? props.goalDefaultValue ?? null);
  }, [
    props.aspectValue,
    props.aspectDefaultValue,
    props.chapterValue,
    props.chapterDefaultValue,
    props.goalValue,
    props.goalDefaultValue,
    rootAspect,
  ]);

  function onAspectChange(value: EntityId) {
    setSelectedAspect(value);
    setSelectedChapter(null);
    setSelectedGoal(null);
    props.onAspectChange?.(value);
    props.onChapterChange?.(null);
    props.onGoalChange?.(null);
  }

  function onChapterChange(value: EntityId | null) {
    setSelectedChapter(value);
    if (!chapterOnlyForSelectedAspect && value) {
      const chapter = allChaptersByRefId.get(value);
      if (chapter && chapter.aspect_ref_id !== selectedAspect) {
        setSelectedAspect(chapter.aspect_ref_id);
        setSelectedGoal(null);
        props.onAspectChange?.(chapter.aspect_ref_id);
        props.onGoalChange?.(null);
      }
    }
    props.onChapterChange?.(value);
  }

  function onGoalChange(value: EntityId | null) {
    setSelectedGoal(value);
    props.onGoalChange?.(value);
  }

  return (
    <Stack direction={isBigScreen ? "row" : "column"} spacing={2} useFlexGap>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AspectSelect
          name={aspectName}
          label="Aspect"
          inputsEnabled={inputsEnabled}
          disabled={false}
          allAspects={props.allAspects}
          value={selectedAspect}
          onChange={onAspectChange}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ChapterSelect
          name={chapterName}
          label="Chapter"
          inputsEnabled={inputsEnabled}
          disabled={false}
          onlyForAspect={
            chapterOnlyForSelectedAspect ? selectedAspect : undefined
          }
          allChapters={props.allChapters}
          value={selectedChapter}
          onChange={onChapterChange}
          birthday={props.birthday}
          today={props.today}
          allMilestones={props.allMilestones}
          allAspects={props.allAspects}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <GoalSelect
          name={goalName}
          label="Goal"
          inputsEnabled={inputsEnabled}
          disabled={false}
          onlyForAspect={selectedAspect}
          allGoals={props.allGoals}
          value={selectedGoal}
          onChange={onGoalChange}
        />
      </Box>
    </Stack>
  );
}
