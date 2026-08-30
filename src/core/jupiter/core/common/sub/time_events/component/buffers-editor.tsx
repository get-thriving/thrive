import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

import { TIME_EVENT_BUFFER_PRESETS_MINS } from "#/core/common/sub/time_events/time-event";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";

interface TimeEventBufferFieldProps {
  name: string;
  label: string;
  fieldName: string;
  inputsEnabled: boolean;
  bufferMins: number | null;
  onBufferMinsChange?: (bufferMins: number | null) => void;
  actionResult?: ActionResult<unknown>;
}

// Like the duration field next to it, but a buffer is allowed to be nothing
// at all - which is what an empty box means here.
function TimeEventBufferField(props: TimeEventBufferFieldProps) {
  return (
    <Stack spacing={2} direction="row">
      <ButtonGroup variant="outlined" disabled={!props.inputsEnabled}>
        <Button
          disabled={!props.inputsEnabled}
          variant={props.bufferMins === null ? "contained" : "outlined"}
          onClick={() => props.onBufferMinsChange?.(null)}
        >
          None
        </Button>
        {TIME_EVENT_BUFFER_PRESETS_MINS.map((presetMins) => (
          <Button
            key={presetMins}
            disabled={!props.inputsEnabled}
            variant={props.bufferMins === presetMins ? "contained" : "outlined"}
            onClick={() => props.onBufferMinsChange?.(presetMins)}
          >
            {presetMins}m
          </Button>
        ))}
      </ButtonGroup>

      <FormControl fullWidth>
        <InputLabel id={props.name} shrink margin="dense">
          {props.label}
        </InputLabel>
        <OutlinedInput
          type="number"
          label={props.label}
          name={props.name}
          readOnly={!props.inputsEnabled}
          value={props.bufferMins === null ? "" : props.bufferMins}
          onChange={(e) => {
            if (e.target.value === "") {
              props.onBufferMinsChange?.(null);
              return;
            }

            const bufferMins = parseInt(e.target.value, 10);
            if (Number.isNaN(bufferMins)) {
              props.onBufferMinsChange?.(null);
              e.preventDefault();
              return;
            }

            props.onBufferMinsChange?.(bufferMins);
          }}
        />

        <FieldError
          actionResult={props.actionResult}
          fieldName={props.fieldName}
        />
      </FormControl>
    </Stack>
  );
}

interface TimeEventBuffersEditorProps {
  inputsEnabled: boolean;
  bufferBeforeMins: number | null;
  bufferAfterMins: number | null;
  onBufferBeforeMinsChange?: (bufferMins: number | null) => void;
  onBufferAfterMinsChange?: (bufferMins: number | null) => void;
  actionResult?: ActionResult<unknown>;
}

// The blocks of time around an event that are taken up by its logistics -
// getting there before it, and winding down after it.
export function TimeEventBuffersEditor(props: TimeEventBuffersEditorProps) {
  return (
    <>
      <TimeEventBufferField
        name="bufferBeforeMins"
        label="Buffer Before (Mins)"
        fieldName="/buffer_before_mins"
        inputsEnabled={props.inputsEnabled}
        bufferMins={props.bufferBeforeMins}
        onBufferMinsChange={props.onBufferBeforeMinsChange}
        actionResult={props.actionResult}
      />

      <TimeEventBufferField
        name="bufferAfterMins"
        label="Buffer After (Mins)"
        fieldName="/buffer_after_mins"
        inputsEnabled={props.inputsEnabled}
        bufferMins={props.bufferAfterMins}
        onBufferMinsChange={props.onBufferAfterMinsChange}
        actionResult={props.actionResult}
      />
    </>
  );
}
