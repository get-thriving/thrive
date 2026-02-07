import type { Birthday } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { birthdayFromParts, extractBirthday } from "#/core/common/birthday";

type BirthdaySelectValue = "N/A" | string;
const NONE_BIRTHDAY: BirthdaySelectValue = "N/A";

const SAFE_DEFAULT_BIRTHDAY_PARTS = {
  day: 12,
  month: 9,
} as const;

interface BirthdaySelectProps {
  name: string;
  initialValue?: Birthday | null;
  inputsEnabled: boolean;
  allowNoneBirthday?: boolean;
}

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function dayFromInitialValue(
  initialValue: Birthday | null | undefined,
  allowNoneBirthday: boolean,
) {
  if (initialValue === null || initialValue === undefined) {
    return allowNoneBirthday
      ? NONE_BIRTHDAY
      : `${SAFE_DEFAULT_BIRTHDAY_PARTS.day}`;
  }
  const extracted = extractBirthday(initialValue);
  return `${extracted.day}`;
}

function monthFromInitialValue(
  initialValue: Birthday | null | undefined,
  allowNoneBirthday: boolean,
) {
  if (initialValue === null || initialValue === undefined) {
    return allowNoneBirthday
      ? NONE_BIRTHDAY
      : `${SAFE_DEFAULT_BIRTHDAY_PARTS.month}`;
  }
  const extracted = extractBirthday(initialValue);
  return `${extracted.month}`;
}

export function BirthdaySelect(props: BirthdaySelectProps) {
  const allowNoneBirthday = props.allowNoneBirthday ?? true;

  const [birthdayDay, setBirthdayDay] = useState<BirthdaySelectValue>(
    dayFromInitialValue(props.initialValue, allowNoneBirthday),
  );
  const [birthdayMonth, setBirthdayMonth] = useState<BirthdaySelectValue>(
    monthFromInitialValue(props.initialValue, allowNoneBirthday),
  );

  useEffect(() => {
    setBirthdayDay(dayFromInitialValue(props.initialValue, allowNoneBirthday));
  }, [props.initialValue, allowNoneBirthday]);
  useEffect(() => {
    setBirthdayMonth(
      monthFromInitialValue(props.initialValue, allowNoneBirthday),
    );
  }, [props.initialValue, allowNoneBirthday]);

  const dayLabelId = `${props.name}-birthdayDay`;
  const monthLabelId = `${props.name}-birthdayMonth`;

  function handleDayChange(event: SelectChangeEvent) {
    if (!allowNoneBirthday && event.target.value === NONE_BIRTHDAY) {
      return;
    }
    setBirthdayDay(event.target.value);
  }

  function handleMonthChange(event: SelectChangeEvent) {
    if (!allowNoneBirthday && event.target.value === NONE_BIRTHDAY) {
      return;
    }
    setBirthdayMonth(event.target.value);
  }

  const encodedBirthdayValue = useMemo(() => {
    if (birthdayDay === NONE_BIRTHDAY || birthdayMonth === NONE_BIRTHDAY) {
      return "";
    }
    return birthdayFromParts(
      parseInt(birthdayDay, 10),
      parseInt(birthdayMonth, 10),
    );
  }, [birthdayDay, birthdayMonth]);

  return (
    <>
      <Stack spacing={2} useFlexGap direction="row" sx={{ width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel id={dayLabelId} htmlFor={dayLabelId}>
            Birthday Day
          </InputLabel>
          <Select
            labelId={dayLabelId}
            readOnly={!props.inputsEnabled}
            value={birthdayDay}
            label="Birthday Day"
            onChange={handleDayChange}
          >
            {allowNoneBirthday && (
              <MenuItem value={NONE_BIRTHDAY}>N/A</MenuItem>
            )}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <MenuItem key={day} value={`${day}`}>
                {ordinal(day)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id={monthLabelId} htmlFor={monthLabelId}>
            Birthday Month
          </InputLabel>
          <Select
            labelId={monthLabelId}
            readOnly={!props.inputsEnabled}
            value={birthdayMonth}
            label="Birthday Month"
            onChange={handleMonthChange}
          >
            {allowNoneBirthday && (
              <MenuItem value={NONE_BIRTHDAY}>N/A</MenuItem>
            )}
            <MenuItem value={"1"}>January</MenuItem>
            <MenuItem value={"2"}>February</MenuItem>
            <MenuItem value={"3"}>March</MenuItem>
            <MenuItem value={"4"}>April</MenuItem>
            <MenuItem value={"5"}>May</MenuItem>
            <MenuItem value={"6"}>June</MenuItem>
            <MenuItem value={"7"}>July</MenuItem>
            <MenuItem value={"8"}>August</MenuItem>
            <MenuItem value={"9"}>September</MenuItem>
            <MenuItem value={"10"}>October</MenuItem>
            <MenuItem value={"11"}>November</MenuItem>
            <MenuItem value={"12"}>December</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <input name={props.name} type="hidden" value={encodedBirthdayValue} />
    </>
  );
}
