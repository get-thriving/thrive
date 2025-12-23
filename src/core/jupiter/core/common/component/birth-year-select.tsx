import { BirthYear } from "@jupiter/webapi-client/dist/models/BirthYear";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const MIN_BIRTH_YEAR = 1901;
const MAX_BIRTH_YEAR = 2099;
const DEFAULT_BIRTH_YEAR = 1990;

type BirthYearSelectValue = "N/A" | string;
const NONE_BIRTH_YEAR: BirthYearSelectValue = "N/A";

interface BirthYearOption {
  year: number | null;
  label: string;
}

interface BirthYearSelectProps {
  name: string;
  label: string;
  initialValue?: BirthYear | null;
  inputsEnabled: boolean;
  disabled?: boolean;
  allowNoneBirthYear?: boolean;
}

const NONE_OPTION: BirthYearOption = { year: null, label: "N/A" };

function yearToOption(year: number): BirthYearOption {
  return { year, label: `${year}` };
}

function optionFromInitialValue(
  initialValue: number | null | undefined,
  allowNoneBirthYear: boolean,
) {
  const initial = initialValue;
  if (initial === null || initial === undefined) {
    return allowNoneBirthYear ? NONE_OPTION : yearToOption(DEFAULT_BIRTH_YEAR);
  }
  if (initial < MIN_BIRTH_YEAR || initial > MAX_BIRTH_YEAR) {
    return allowNoneBirthYear ? NONE_OPTION : yearToOption(DEFAULT_BIRTH_YEAR);
  }
  return yearToOption(initial);
}

export function BirthYearSelect(props: BirthYearSelectProps) {
  const allowNoneBirthYear = props.allowNoneBirthYear ?? false;

  const allYearsAsOptions = Array.from(
    { length: MAX_BIRTH_YEAR - MIN_BIRTH_YEAR + 1 },
    (_, i) => MIN_BIRTH_YEAR + i,
  ).map(yearToOption);
  if (allowNoneBirthYear) {
    allYearsAsOptions.unshift(NONE_OPTION);
  }

  const [selectedBirthYear, setSelectedBirthYear] = useState<BirthYearOption>(
    optionFromInitialValue(props.initialValue, allowNoneBirthYear),
  );

  useEffect(() => {
    setSelectedBirthYear(
      optionFromInitialValue(props.initialValue, allowNoneBirthYear),
    );
  }, [props.initialValue, allowNoneBirthYear]);

  const encodedBirthYearValue: BirthYearSelectValue = useMemo(() => {
    if (selectedBirthYear.year === null) {
      return NONE_BIRTH_YEAR;
    }
    return `${selectedBirthYear.year}`;
  }, [selectedBirthYear]);

  return (
    <>
      <Autocomplete
        autoHighlight
        disableClearable={!allowNoneBirthYear}
        id={props.name}
        options={allYearsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        value={selectedBirthYear}
        onChange={(e, v) => {
          if (v === null) {
            if (allowNoneBirthYear) {
              setSelectedBirthYear(NONE_OPTION);
            }
            return;
          }
          setSelectedBirthYear(v);
        }}
        isOptionEqualToValue={(o, v) => o.year === v.year}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = props;
          return (
            <li {...restProps} key={key}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />
      <input name={props.name} type="hidden" value={encodedBirthYearValue} />
    </>
  );
}
