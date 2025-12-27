import type { EntityId, GoalSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";

interface GoalSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  onlyForProject?: EntityId;
  allGoals: GoalSummary[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | null) => void;
}

interface GoalOption {
  goal_ref_id: string;
  label: string;
  bigName: string;
}

export function GoalSelect(props: GoalSelectProps) {
  const allGoalsByRefId = useMemo(
    () => new Map(props.allGoals.map((g) => [g.ref_id, g])),
    [props.allGoals],
  );

  const sortedGoals = useMemo(
    () => sortGoalsNaturally(props.allGoals),
    [props.allGoals],
  );

  const allGoalsAsOptions: GoalOption[] = useMemo(
    () =>
      sortedGoals
          .filter(
            (goal) =>
              !props.onlyForProject ||
              goal.project_ref_id === props.onlyForProject,
          )
          .map((goal) => ({
            goal_ref_id: goal.ref_id,
            label: String(goal.name),
            bigName: fullGoalName(goal),
          })),
    [sortedGoals, props.onlyForProject],
  );

  function selectedGoalToOption(): GoalOption | null {
    const selectedGoalRefId = props.value ?? props.defaultValue;

    if (!selectedGoalRefId) {
      return null;
    }

    const goal = allGoalsByRefId.get(selectedGoalRefId);
    if (!goal) {
      return null;
    }

    return {
      goal_ref_id: selectedGoalRefId,
      label: String(goal.name),
      bigName: fullGoalName(goal),
    };
  }

  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(
    selectedGoalToOption(),
  );

  useEffect(() => {
    const selectedGoalRefId = props.value ?? props.defaultValue;
    if (!selectedGoalRefId) {
      setSelectedGoal(null);
      return;
    }

    const goal = allGoalsByRefId.get(selectedGoalRefId);
    if (!goal) {
      setSelectedGoal(null);
      return;
    }

    setSelectedGoal({
      goal_ref_id: selectedGoalRefId,
      label: String(goal.name),
      bigName: fullGoalName(goal),
    });
  }, [
    props.value,
    props.defaultValue,
    props.allGoals,
    props.onlyForProject,
    allGoalsByRefId,
  ]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        options={allGoalsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allGoalsAsOptions.length === 0}
        value={selectedGoal}
        onChange={(_, v) => {
          setSelectedGoal(v);
          if (props.onChange) {
            props.onChange(v?.goal_ref_id ?? null);
          }
        }}
        isOptionEqualToValue={(o, v) => o.goal_ref_id === v.goal_ref_id}
        renderOption={(optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedGoal?.goal_ref_id ?? ""}
      />
    </>
  );
}

function fullGoalName(goal: GoalSummary): string {
  return String(goal.name);
}
