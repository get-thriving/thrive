import { AccessLevel } from "@jupiter/webapi-client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

import {
  accessLevelName,
  ALL_ACCESS_LEVELS,
  SHARING_ACCESS_LEVELS,
} from "#/core/common/sub/access/access-level";

interface AccessLevelSelectProps {
  name?: string;
  defaultValue: AccessLevel;
  inputsEnabled: boolean;
  forSharing?: boolean;
  compact?: boolean;
  onChange?: (accessLevel: AccessLevel) => void;
}

export function AccessLevelSelect(props: AccessLevelSelectProps) {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(
    props.defaultValue,
  );
  const levels = props.forSharing ? SHARING_ACCESS_LEVELS : ALL_ACCESS_LEVELS;

  useEffect(() => {
    setAccessLevel(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <>
      <ToggleButtonGroup
        value={accessLevel}
        exclusive
        fullWidth={!props.compact}
        size="small"
        onChange={(_, newAccessLevel) => {
          if (newAccessLevel === null) {
            return;
          }
          setAccessLevel(newAccessLevel);
          props.onChange?.(newAccessLevel);
        }}
      >
        {levels.map((level) => (
          <ToggleButton
            key={level}
            size="small"
            id={`access-level-${level}`}
            disabled={!props.inputsEnabled}
            value={level}
            sx={
              props.compact
                ? {
                    fontSize: "0.75rem",
                    lineHeight: 1,
                    px: 0.75,
                    py: 0.25,
                  }
                : undefined
            }
          >
            {accessLevelName(level)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {props.name !== undefined && (
        <input name={props.name} type="hidden" value={accessLevel} />
      )}
    </>
  );
}
