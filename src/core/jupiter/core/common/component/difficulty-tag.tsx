import { Difficulty } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { difficultyName } from "#/core/common/difficulty";

interface Props {
  difficulty: Difficulty;
  /** Just the first letter, outlined, with the name as a tooltip, for where room is tight. */
  compact?: boolean;
}

export function DifficultyTag(props: Props) {
  const tagName = difficultyName(props.difficulty);
  const tagClass = difficultyToClass(props.difficulty);
  if (props.compact) {
    return (
      <SlimChip
        label={tagName[0]}
        title={tagName}
        variant="outlined"
        color={tagClass}
      />
    );
  }
  return <SlimChip label={tagName} color={tagClass} />;
}

function difficultyToClass(difficulty: Difficulty) {
  switch (difficulty) {
    case Difficulty.EASY:
      return "default";
    case Difficulty.MEDIUM:
      return "warning";
    case Difficulty.HARD:
      return "error";
  }
}
