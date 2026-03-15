import { MetricDirection } from "@jupiter/webapi-client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

import { metricDirectionName } from "#/core/metrics/direction";

interface MetricDirectionSelectProps {
  name: string;
  defaultValue: MetricDirection;
  inputsEnabled: boolean;
}

export function MetricDirectionSelect(props: MetricDirectionSelectProps) {
  const [direction, setDirection] = useState<MetricDirection>(
    props.defaultValue,
  );

  useEffect(() => {
    setDirection(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <>
      <ToggleButtonGroup
        value={direction}
        exclusive
        fullWidth
        onChange={(_, newDirection) =>
          newDirection !== null && setDirection(newDirection)
        }
      >
        <ToggleButton
          size="small"
          id="direction-none"
          disabled={!props.inputsEnabled}
          value={MetricDirection.NONE}
        >
          {metricDirectionName(MetricDirection.NONE)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="direction-up-is-good"
          disabled={!props.inputsEnabled}
          value={MetricDirection.UP_IS_GOOD}
        >
          {metricDirectionName(MetricDirection.UP_IS_GOOD)}
        </ToggleButton>
        <ToggleButton
          size="small"
          id="direction-down-is-good"
          disabled={!props.inputsEnabled}
          value={MetricDirection.DOWN_IS_GOOD}
        >
          {metricDirectionName(MetricDirection.DOWN_IS_GOOD)}
        </ToggleButton>
      </ToggleButtonGroup>
      <input name={props.name} type="hidden" value={direction} />
    </>
  );
}
