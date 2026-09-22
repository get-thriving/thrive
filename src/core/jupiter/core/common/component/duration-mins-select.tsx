import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";

/** The lengths worth one tap; anything else is typed in the box next to them. */
export const DURATION_MINS_PRESETS = [15, 30, 60];

interface DurationMinsSelectProps {
  name: string;
  inputsEnabled: boolean;
  value: number | null;
  onChange: (durationMins: number | null) => void;
  label?: string;
  minMins?: number;
  maxMins?: number;
  actionData?: ActionResult<unknown>;
  fieldName?: string;
}

/**
 * A duration in minutes, as the common lengths plus a free one.
 *
 * The presets are the lengths most things take, and the box takes whatever
 * else. A preset shows as chosen when the duration is exactly it.
 */
export function DurationMinsSelect(props: DurationMinsSelectProps) {
  const label = props.label ?? "Duration (Mins)";

  return (
    <Stack spacing={2} direction="row">
      <ButtonGroup variant="outlined" disabled={!props.inputsEnabled}>
        {DURATION_MINS_PRESETS.map((preset) => (
          <Button
            key={preset}
            disabled={!props.inputsEnabled}
            variant={props.value === preset ? "contained" : "outlined"}
            onClick={() => props.onChange(preset)}
          >
            {preset}m
          </Button>
        ))}
      </ButtonGroup>

      <FormControl fullWidth>
        <InputLabel id={props.name} shrink margin="dense">
          {label}
        </InputLabel>
        <OutlinedInput
          type="number"
          inputProps={{ min: props.minMins, max: props.maxMins }}
          label={label}
          name={props.name}
          readOnly={!props.inputsEnabled}
          value={props.value ?? ""}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            if (Number.isNaN(parsed)) {
              props.onChange(null);
              return;
            }
            props.onChange(parsed);
          }}
        />

        {props.fieldName && (
          <FieldError
            actionResult={props.actionData}
            fieldName={props.fieldName}
          />
        )}
      </FormControl>
    </Stack>
  );
}
