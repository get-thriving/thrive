import { OccasionKind } from "@jupiter/webapi-client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

import { occasionKindName } from "#/core/prm/sub/person/sub/occasion/kind";

interface OccasionKindSelectProps {
  name: string;
  defaultValue: OccasionKind;
  inputsEnabled: boolean;
}

export function OccasionKindSelect(props: OccasionKindSelectProps) {
  const [kind, setKind] = useState<OccasionKind>(props.defaultValue);

  useEffect(() => {
    setKind(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <>
      <ToggleButtonGroup
        value={kind}
        exclusive
        fullWidth
        onChange={(_, newKind) => newKind !== null && setKind(newKind)}
      >
        <ToggleButton
          size="small"
          id="occasion-kind-birthday"
          disabled={!props.inputsEnabled}
          value={OccasionKind.BIRTHDAY}
        >
          {occasionKindName(OccasionKind.BIRTHDAY)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="occasion-kind-anniversary"
          disabled={!props.inputsEnabled}
          value={OccasionKind.ANNIVERSARY}
        >
          {occasionKindName(OccasionKind.ANNIVERSARY)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="occasion-kind-holiday"
          disabled={!props.inputsEnabled}
          value={OccasionKind.HOLIDAY}
        >
          {occasionKindName(OccasionKind.HOLIDAY)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="occasion-kind-other"
          disabled={!props.inputsEnabled}
          value={OccasionKind.OTHER}
        >
          {occasionKindName(OccasionKind.OTHER)}
        </ToggleButton>
      </ToggleButtonGroup>
      <input name={props.name} type="hidden" value={kind} />
    </>
  );
}
