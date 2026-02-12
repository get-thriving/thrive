import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import {
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

import { periodName } from "#/core/common/recurring-task-period";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface PeriodSelectProps {
  labelId: string;
  label: string;
  name: string;
  compact?: boolean;
  allowNonePeriod?: boolean;
  multiSelect?: boolean;
  inputsEnabled: boolean;
  defaultValue?: RecurringTaskPeriod | RecurringTaskPeriod[] | "none";
  value?: RecurringTaskPeriod | RecurringTaskPeriod[] | "none";
  onChange?: (
    newPeriod: RecurringTaskPeriod | RecurringTaskPeriod[] | "none",
  ) => void;
  allowedValues?: RecurringTaskPeriod[];
}

export function PeriodSelect(props: PeriodSelectProps) {
  const isBigScreen = useBigScreen();
  const [period, setPeriod] = useState(
    props.defaultValue ||
      props.value ||
      (props.multiSelect
        ? [RecurringTaskPeriod.DAILY]
        : RecurringTaskPeriod.DAILY),
  );

  useEffect(() => {
    if (props.value !== undefined) {
      if (props.multiSelect) {
        setPeriod(props.value);
      } else {
        setPeriod(props.value);
      }
    }
  }, [props.value, props.multiSelect]);

  const allowedValues = Object.values(RecurringTaskPeriod).filter(
    (p) => !props.allowedValues || props.allowedValues.includes(p),
  );

  function handleChangePeriod(
    event: React.MouseEvent<HTMLElement>,
    newPeriod: RecurringTaskPeriod | RecurringTaskPeriod[] | null,
  ) {
    if (newPeriod === null) {
      return;
    }
    setPeriod(newPeriod);
    if (props.onChange) {
      props.onChange(newPeriod);
    }
  }

  function handleChangePeriodCompact(event: SelectChangeEvent<unknown>) {
    const raw = event.target.value;
    const newPeriod = props.multiSelect
      ? (raw as RecurringTaskPeriod[])
      : (raw as RecurringTaskPeriod | "none");

    setPeriod(newPeriod);
    if (props.onChange) {
      props.onChange(newPeriod);
    }
  }

  return (
    <>
      {props.compact ? (
        <>
          <InputLabel id={props.labelId}>{props.label}</InputLabel>
          <Select
            labelId={props.labelId}
            label={props.label}
            multiple={Boolean(props.multiSelect)}
            value={period}
            onChange={handleChangePeriodCompact}
            disabled={!props.inputsEnabled}
            fullWidth
            size="small"
            renderValue={(selected) => {
              if (selected === "none") {
                return "None";
              }
              if (Array.isArray(selected)) {
                return selected
                  .map((p) => periodName(p, isBigScreen))
                  .join(", ");
              }
              return periodName(selected as RecurringTaskPeriod, isBigScreen);
            }}
          >
            {props.allowNonePeriod && !props.multiSelect && (
              <MenuItem value="none">None</MenuItem>
            )}
            {allowedValues.map((p) => (
              <MenuItem key={p} value={p}>
                {periodName(p, isBigScreen)}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <ToggleButtonGroup
          value={period}
          exclusive={!props.multiSelect}
          fullWidth
          onChange={handleChangePeriod}
          size="small"
        >
          {props.allowNonePeriod && (
            <ToggleButton value="none" disabled={!props.inputsEnabled}>
              None
            </ToggleButton>
          )}
          {allowedValues.map((s) => (
            <ToggleButton
              key={s}
              id={`period-${s}`}
              value={s}
              disabled={!props.inputsEnabled}
            >
              {periodName(s, isBigScreen)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
      <input type="hidden" name={props.name} value={period} />
    </>
  );
}
