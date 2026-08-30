import type { Timezone } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

interface AdditionalTimezonesSelectProps {
  id: string;
  name: string;
  label: string;
  initialValues: Array<Timezone>;
  maxTimezones: number;
  inputsEnabled: boolean;
}

export function AdditionalTimezonesSelect(
  props: AdditionalTimezonesSelectProps,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allTimezonesAsOptions = (Intl as any).supportedValuesOf(
    "timeZone",
  ) as Array<string>;

  const [timezones, setTimezones] = useState<Array<string>>(
    props.initialValues,
  );

  return (
    <>
      <Autocomplete
        id={props.id}
        multiple
        options={allTimezonesAsOptions}
        readOnly={!props.inputsEnabled}
        value={timezones}
        onChange={(event, newValues) =>
          setTimezones(newValues.slice(0, props.maxTimezones))
        }
        getOptionDisabled={() => timezones.length >= props.maxTimezones}
        renderInput={(params) => (
          <TextField {...params} autoComplete="off" label={props.label} />
        )}
      />
      <input type="hidden" name={props.name} value={timezones.join(",")} />
    </>
  );
}
