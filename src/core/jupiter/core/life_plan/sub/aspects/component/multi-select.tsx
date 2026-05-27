import type { AspectSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import {
  computeAspectDistanceFromRoot,
  sortAspectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface AspectOption {
  aspect_ref_id: string;
  label: string;
  bigName: string;
}

interface AspectMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allAspects: AspectSummary[];
  defaultValue?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  maxSelections?: number;
}

export function AspectMultiSelect(props: AspectMultiSelectProps) {
  const isBigScreen = useBigScreen();
  const allAspectsByRefId = useMemo(
    () => new Map(props.allAspects.map((p) => [p.ref_id, p])),
    [props.allAspects],
  );

  const allAspectsAsOptions: AspectOption[] = useMemo(() => {
    const sortedAspects = sortAspectsByTreeOrder(props.allAspects);
    return sortedAspects.map((aspect) => ({
      aspect_ref_id: aspect.ref_id,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId),
    }));
  }, [props.allAspects, allAspectsByRefId]);

  function selectedAspectRefIds(): string[] {
    return props.value ?? props.defaultValue ?? [];
  }

  function selectedAspectsToOptions(): AspectOption[] {
    const refIds = selectedAspectRefIds();
    return refIds
      .map((refId) => allAspectsByRefId.get(refId))
      .filter((p): p is AspectSummary => Boolean(p))
      .map((p) => ({
        aspect_ref_id: p.ref_id,
        label: p.name,
        bigName: fullAspectName(p, allAspectsByRefId),
      }));
  }

  const [selectedAspects, setSelectedAspects] = useState<AspectOption[]>(
    selectedAspectsToOptions(),
  );

  useEffect(() => {
    setSelectedAspects(selectedAspectsToOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.defaultValue, props.allAspects, allAspectsByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 0 : 1}
        size="small"
        options={allAspectsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        multiple
        disableCloseOnSelect
        sx={autocompleteSingleLineSx}
        value={selectedAspects}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedAspects.length;
          const alreadySelected = selectedAspects.some(
            (x) => x.aspect_ref_id === o.aspect_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(e, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedAspects.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedAspects(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.aspect_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.aspect_ref_id === v.aspect_ref_id}
        getOptionLabel={(o) => o.bigName}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = props;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            helperText={
              props.maxSelections
                ? `Select up to ${props.maxSelections}.`
                : undefined
            }
          />
        )}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedAspects.map((p) => p.aspect_ref_id).join(",")}
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
