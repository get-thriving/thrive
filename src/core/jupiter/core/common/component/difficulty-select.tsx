import { Difficulty } from "@jupiter/webapi-client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

import { difficultyName } from "#/core/common/difficulty";

interface DifficultySelectProps {
  name: string;
  defaultValue: Difficulty;
  inputsEnabled: boolean;
  // For whatever else on the form keys off the difficulty, like the default
  // length of a scheduled block.
  onChange?: (difficulty: Difficulty) => void;
}

export function DifficultySelect(props: DifficultySelectProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(props.defaultValue);

  useEffect(() => {
    setDifficulty(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <>
      <ToggleButtonGroup
        value={difficulty}
        exclusive
        fullWidth
        onChange={(_, newDifficulty) => {
          if (newDifficulty === null) {
            return;
          }
          setDifficulty(newDifficulty);
          props.onChange?.(newDifficulty);
        }}
      >
        <ToggleButton
          size="small"
          id="difficulty-easy"
          disabled={!props.inputsEnabled}
          value={Difficulty.EASY}
        >
          {difficultyName(Difficulty.EASY)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="difficulty-medium"
          disabled={!props.inputsEnabled}
          value={Difficulty.MEDIUM}
        >
          {difficultyName(Difficulty.MEDIUM)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="difficulty-hard"
          disabled={!props.inputsEnabled}
          value={Difficulty.HARD}
        >
          {difficultyName(Difficulty.HARD)}
        </ToggleButton>
      </ToggleButtonGroup>
      <input name={props.name} type="hidden" value={difficulty} />
    </>
  );
}
