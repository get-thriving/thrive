import type { AspectSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import {
  computeAspectDistanceFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";

interface AspectSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allAspects: AspectSummary[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function AspectSelect(props: AspectSelectProps) {
  const rootAspect = props.allAspects.find((p) => !p.parent_aspect_ref_id)!;
  const allAspectsByRefId = useMemo(
    () => new Map(props.allAspects.map((p) => [p.ref_id, p])),
    [props.allAspects],
  );
  const sortedAspects = sortAspectsByTreeOrder(props.allAspects);
  const allAspectsAsOptions = sortedAspects.map((aspect) => ({
    aspect_ref_id: aspect.ref_id,
    label: aspect.name,
    bigName: fullAspectName(aspect, allAspectsByRefId),
  }));

  function selectedAspectToOption() {
    const aspectRefId = props.value || props.defaultValue || rootAspect?.ref_id;
    const aspect = allAspectsByRefId.get(aspectRefId)!;
    return {
      aspect_ref_id: aspectRefId,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId),
    };
  }

  const [selectedAspect, setSelectedAspect] = useState(
    selectedAspectToOption(),
  );
  useEffect(() => {
    const aspectRefId = props.value || props.defaultValue || rootAspect?.ref_id;
    const aspect = allAspectsByRefId.get(aspectRefId)!;
    setSelectedAspect({
      aspect_ref_id: aspectRefId,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId),
    });
  }, [
    props.value,
    props.defaultValue,
    props.allAspects,
    allAspectsByRefId,
    rootAspect,
  ]);

  return (
    <>
      <Autocomplete
        disableClearable
        autoHighlight
        id={props.name}
        options={allAspectsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        sx={autocompleteSingleLineSx}
        value={selectedAspect}
        onChange={(e, v) => {
          setSelectedAspect(v);
          if (props.onChange) {
            props.onChange(v.aspect_ref_id);
          }
        }}
        isOptionEqualToValue={(o, v) => o.aspect_ref_id === v.aspect_ref_id}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = props;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedAspect.aspect_ref_id}
      />
    </>
  );
}

function fullAspectName(
  aspect: AspectSummary,
  allAspectsByRefId: Map<string, AspectSummary>,
): string {
  const indent = computeAspectDistanceFromRoot(aspect, allAspectsByRefId);
  return `${"-".repeat(indent)} ${aspect.name}`;
}
