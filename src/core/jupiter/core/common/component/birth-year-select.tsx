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
  defaultValue?: BirthYear | null;
  value?: BirthYear | null;
  filter?: (year: number) => boolean;
  inputsEnabled: boolean;
  disabled?: boolean;
  allowNoneBirthYear?: boolean;
  onChange?: (year: number) => void;
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
  )
    .filter(props.filter ?? (() => true))
    .map(yearToOption);
  if (allowNoneBirthYear) {
    allYearsAsOptions.unshift(NONE_OPTION);
  }

  const [selectedBirthYear, setSelectedBirthYear] = useState<BirthYearOption>(
    optionFromInitialValue(
      props.defaultValue ?? props.value,
      allowNoneBirthYear,
    ),
  );

  useEffect(() => {
    setSelectedBirthYear(
      optionFromInitialValue(
        props.defaultValue ?? props.value,
        allowNoneBirthYear,
      ),
    );
  }, [props.defaultValue, props.value, allowNoneBirthYear]);

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
          props.onChange?.(v.year ?? DEFAULT_BIRTH_YEAR);
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
      {!props.onChange && (
        <input name={props.name} type="hidden" value={encodedBirthYearValue} />
      )}
    </>
  );
}
