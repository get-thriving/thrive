import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";

interface TimezoneSelectProps {
  id: string;
  name: string;
  initialValue?: string;
  inputsEnabled: boolean;
}

export function TimezoneSelect(props: TimezoneSelectProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allTimezonesAsOptions = (Intl as any).supportedValuesOf("timeZone");

  const [realValue, setRealValue] = useState(
    props.initialValue || "Europe/London",
  );
  useEffect(() => {
    setRealValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <Autocomplete
      id={props.id}
      options={allTimezonesAsOptions}
      readOnly={!props.inputsEnabled}
      sx={autocompleteSingleLineSx}
      value={realValue}
      onChange={(event, newValue) => setRealValue(newValue)}
      disableClearable={true}
      renderInput={(params) => (
        <TextField
          {...params}
          name={props.name}
          autoComplete="off"
          label="Your Timezone"
        />
      )}
    />
  );
}
