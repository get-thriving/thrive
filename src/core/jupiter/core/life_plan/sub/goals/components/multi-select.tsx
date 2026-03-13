import type { EntityId, GoalSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import { sortGoalsNaturally } from "#/core/life_plan/sub/goals/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface GoalOption {
  goal_ref_id: EntityId;
  label: string;
  bigName: string;
}

interface GoalMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  onlyForAspect?: EntityId;
  allGoals: GoalSummary[];
  defaultValue?: EntityId[];
  value?: EntityId[];
  onChange?: (value: EntityId[]) => void;
  maxSelections?: number;
}

export function GoalMultiSelect(props: GoalMultiSelectProps) {
  const isBigScreen = useBigScreen();
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
            !props.onlyForAspect || goal.aspect_ref_id === props.onlyForAspect,
        )
        .map((goal) => ({
          goal_ref_id: goal.ref_id,
          label: String(goal.name),
          bigName: String(goal.name),
        })),
    [sortedGoals, props.onlyForAspect],
  );

  function selectedGoalsToOptions(): GoalOption[] {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds
      .map((refId) => allGoalsByRefId.get(refId))
      .filter((g): g is GoalSummary => Boolean(g))
      .map((g) => ({
        goal_ref_id: g.ref_id,
        label: String(g.name),
        bigName: String(g.name),
      }));
  }

  const [selectedGoals, setSelectedGoals] = useState<GoalOption[]>(
    selectedGoalsToOptions(),
  );

  useEffect(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedGoals(
      refIds
        .map((refId) => allGoalsByRefId.get(refId))
        .filter((g): g is GoalSummary => Boolean(g))
        .map((g) => ({
          goal_ref_id: g.ref_id,
          label: String(g.name),
          bigName: String(g.name),
        })),
    );
  }, [props.value, props.defaultValue, props.allGoals, allGoalsByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 0 : 1}
        size="small"
        options={allGoalsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allGoalsAsOptions.length === 0}
        multiple
        disableCloseOnSelect
        sx={autocompleteSingleLineSx}
        value={selectedGoals}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedGoals.length;
          const alreadySelected = selectedGoals.some(
            (x) => x.goal_ref_id === o.goal_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedGoals.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedGoals(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.goal_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.goal_ref_id === v.goal_ref_id}
        getOptionLabel={(o) => o.bigName}
        renderOption={(optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            helperText={
              props.maxSelections
                ? `Select up to ${props.maxSelections}.`
                : undefined
            }
          />
        )}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedGoals.map((g) => g.goal_ref_id).join(",")}
      />
    </>
  );
}
