import type { EntityId, Habit } from "@jupiter/webapi-client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { HabitSelectMultiple } from "#/core/apps/habits/component/select-multiple";
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

      {habitRefIds.length === 0 ? (
        <Typography color="text.secondary">
          No habits chosen yet. The widget will stay empty until you add some.
        </Typography>
      ) : (
        <Stack spacing={0.5} component="ol" sx={{ margin: 0, padding: 0 }}>
          {habitRefIds.map((refId, index) => {
            const habit = habitsByRefId.get(refId)!;
            return (
              <Box
                key={refId}
                component="li"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  listStyle: "none",
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ minWidth: "1.5rem", textAlign: "right" }}
                >
                  {index + 1}.
                </Typography>
                <Typography noWrap sx={{ flex: 1, minWidth: 0 }}>
                  {habit.name}
                </Typography>
                <PeriodTag period={habit.gen_params.period} />
                <IconButton
                  size="small"
                  aria-label={`Move ${habit.name} up`}
                  disabled={!props.inputsEnabled || index === 0}
                  onClick={() =>
                    setHabitRefIds(moveItem(habitRefIds, index, -1))
                  }
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`Move ${habit.name} down`}
                  disabled={
                    !props.inputsEnabled || index === habitRefIds.length - 1
                  }
                  onClick={() =>
                    setHabitRefIds(moveItem(habitRefIds, index, 1))
                  }
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label={`Remove ${habit.name}`}
                  disabled={!props.inputsEnabled}
                  onClick={() =>
                    setHabitRefIds(habitRefIds.filter((id) => id !== refId))
                  }
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
