import { Difficulty } from "@jupiter/webapi-client";

import { SlimChip } from "#/core/infra/component/chips";
import { difficultyName } from "#/core/common/difficulty";

interface Props {
  difficulty: Difficulty;
  /** Outlined, with the colour as the text, for where chips are many. */
  outlined?: boolean;
}

export function DifficultyTag(props: Props) {
  const tagName = difficultyName(props.difficulty);
  const tagClass = difficultyToClass(props.difficulty);
  return (
    <SlimChip
      label={tagName}
      color={tagClass}
      variant={props.outlined ? "outlined" : "filled"}
    />
  );
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
