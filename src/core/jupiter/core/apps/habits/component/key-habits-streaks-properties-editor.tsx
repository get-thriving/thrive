import type { EntityId, Habit } from "@jupiter/webapi-client";
import { Alert, Stack } from "@mui/material";
import { useMemo, useState } from "react";

import { HabitSelectMultiple } from "#/core/apps/habits/component/select-multiple";
import { ChosenEntitiesList } from "#/core/common/component/chosen-entities-list";
import { PeriodTag } from "#/core/common/component/period-tag";
import { moveItem } from "#/core/common/move-item";

interface KeyHabitsStreaksPropertiesEditorProps {
  /** The form field the chosen habits are submitted in, as a comma separated
   * list of ref ids in the chosen order. */
  name: string;
  allHabits: Habit[];
  defaultValue: EntityId[];
  inputsEnabled: boolean;
}

export function KeyHabitsStreaksPropertiesEditor(
  props: KeyHabitsStreaksPropertiesEditorProps,
) {
  const habitsByRefId = useMemo(
    () => new Map(props.allHabits.map((habit) => [habit.ref_id, habit])),
    [props.allHabits],
  );

  // Habits that were archived, or are no longer shared with the user, cannot
  // be shown or reordered. They are left out of the list from the start, so
  // saving drops them for good.
  const [initialHabitRefIds] = useState(() =>
    props.defaultValue.filter((refId) => habitsByRefId.has(refId)),
  );
  const unavailableCount =
    props.defaultValue.length - initialHabitRefIds.length;

  const [habitRefIds, setHabitRefIds] =
    useState<EntityId[]>(initialHabitRefIds);

  return (
    <Stack spacing={2}>
      <HabitSelectMultiple
        name={props.name}
        label="Habits to show"
        allHabits={props.allHabits}
        value={habitRefIds}
        onChange={setHabitRefIds}
        inputsEnabled={props.inputsEnabled}
      />

      {unavailableCount > 0 && (
        <Alert severity="info">
          {unavailableCount === 1
            ? "A habit this widget showed is archived or no longer available to you, so it is not listed."
            : `${unavailableCount} habits this widget showed are archived or no longer available to you, so they are not listed.`}{" "}
          Update the widget to remove them.
        </Alert>
      )}

      <ChosenEntitiesList
        entities={habitRefIds.map((refId) => {
          const habit = habitsByRefId.get(refId)!;
          return {
            refId,
            name: habit.name,
            tag: <PeriodTag period={habit.gen_params.period} />,
          };
        })}
        onMove={(index, delta) =>
          setHabitRefIds(moveItem(habitRefIds, index, delta))
        }
        onRemove={(refId) =>
          setHabitRefIds(habitRefIds.filter((id) => id !== refId))
        }
        inputsEnabled={props.inputsEnabled}
        emptyMessage="No habits chosen yet. The widget will stay empty until you add some."
      />
    </Stack>
  );
}
