import type {
  EntityId,
  HabitSummary,
  AspectSummary,
} from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import {
  sortHabitSummariesByPeriod,
  sortHabitSummariesByAspectAndPeriod,
} from "#/core/habits/root";
import {
  computeAspectHierarchicalNameFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { PeriodTag } from "#/core/common/component/period-tag";

interface HabitSelectSingleProps {
  name: string;
  label: string;
  allowNone?: boolean;
  allHabits: HabitSummary[];
  groupByAspects?: boolean;
  allAspects?: AspectSummary[];
  defaultValue?: EntityId;
  value?: EntityId;
  onChange?: (value: EntityId | undefined) => void;
}

export function HabitSelectSingle(props: HabitSelectSingleProps) {
  const allHabitsByRefId = useMemo(
    () => new Map(props.allHabits.map((h) => [h.ref_id, h])),
    [props.allHabits],
  );

  const sortedAspects =
    props.groupByAspects && props.allAspects
      ? sortAspectsByTreeOrder(props.allAspects)
      : undefined;
  const allAspectsByRefId =
    props.groupByAspects && props.allAspects
      ? new Map(props.allAspects.map((p) => [p.ref_id, p]))
      : undefined;
  const sortedHabits = props.groupByAspects
    ? sortHabitSummariesByAspectAndPeriod(props.allHabits, sortedAspects!)
    : sortHabitSummariesByPeriod(props.allHabits);

  const allHabitsAsOptions = sortedHabits.map(habitToOption);

  const [selectedHabit, setSelectedHabit] = useState(
    selectedHabitToOption(props.value, props.defaultValue, allHabitsByRefId),
  );
  useEffect(() => {
    setSelectedHabit(
      selectedHabitToOption(props.value, props.defaultValue, allHabitsByRefId),
    );
  }, [
    props.allowNone,
    props.value,
    props.defaultValue,
    props.allHabits,
    allHabitsByRefId,
  ]);

  return (
    <>
      <Autocomplete
        autoHighlight
        disableClearable={!props.allowNone}
        groupBy={
          props.groupByAspects && allAspectsByRefId
            ? (option) =>
                computeAspectHierarchicalNameFromRoot(
                  allAspectsByRefId.get(option.aspect_ref_id)!,
                  allAspectsByRefId,
                )
            : undefined
        }
        id={props.name}
        options={allHabitsAsOptions}
        sx={autocompleteSingleLineSx}
        value={selectedHabit}
        onChange={(e, v) => {
          if (!props.allowNone && !v) {
            return;
          }

          setSelectedHabit(v || undefined);
          if (props.onChange) {
            props.onChange(v?.habit_ref_id);
          }
        }}
        isOptionEqualToValue={(o, v) =>
          (o === undefined && v === undefined) ||
          o?.habit_ref_id === v?.habit_ref_id
        }
        getOptionLabel={(option) => option?.label || ""}
        renderOption={(optionProps, option) => (
          <li
            {...optionProps}
            key={option.habit_ref_id || "none"}
            style={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {option.label} <PeriodTag period={option.period} />
          </li>
        )}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />
      <input
        type="hidden"
        name={props.name}
        value={selectedHabit?.habit_ref_id || ""}
      />
    </>
  );
}

function selectedHabitToOption(
  value: EntityId | undefined,
  defaultValue: EntityId | undefined,
  allHabitsByRefId: Map<EntityId, HabitSummary>,
) {
  const habitRefId = value || defaultValue;
  const habit = habitRefId ? allHabitsByRefId.get(habitRefId) : undefined;

  if (habitRefId === undefined || habit === undefined) {
    return undefined;
  }
  return habitToOption(habit);
}

function habitToOption(habit: HabitSummary) {
  return {
    habit_ref_id: habit.ref_id,
    label: habit.name,
    period: habit.period,
    aspect_ref_id: habit.aspect_ref_id,
  };
}
