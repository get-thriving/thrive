import type { EntityId, Circle } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { sortCirclesNaturally } from "#/core/prm/sub/circle/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface CircleOption {
  circle_ref_id: EntityId;
  label: string;
  bigName: string;
}

interface CircleMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allCircles: Circle[];
  defaultValue?: EntityId[];
  value?: EntityId[];
  onChange?: (value: EntityId[]) => void;
  maxSelections?: number;
}

export function CircleMultiSelect(props: CircleMultiSelectProps) {
  const isBigScreen = useBigScreen();
  const allCirclesByRefId = useMemo(
    () => new Map(props.allCircles.map((c) => [c.ref_id, c])),
    [props.allCircles],
  );

  const sortedCircles = useMemo(
    () => sortCirclesNaturally(props.allCircles),
    [props.allCircles],
  );

  const allCirclesAsOptions: CircleOption[] = useMemo(
    () =>
      sortedCircles.map((circle) => ({
        circle_ref_id: circle.ref_id,
        label: String(circle.name),
        bigName: String(circle.name),
      })),
    [sortedCircles],
  );

  function selectedCirclesToOptions(): CircleOption[] {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds
      .map((refId) => allCirclesByRefId.get(refId))
      .filter((c): c is Circle => Boolean(c))
      .map((c) => ({
        circle_ref_id: c.ref_id,
        label: String(c.name),
        bigName: String(c.name),
      }));
  }

  const [selectedCircles, setSelectedCircles] = useState<CircleOption[]>(
    selectedCirclesToOptions(),
  );

  useEffect(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedCircles(
      refIds
        .map((refId) => allCirclesByRefId.get(refId))
        .filter((c): c is Circle => Boolean(c))
        .map((c) => ({
          circle_ref_id: c.ref_id,
          label: String(c.name),
          bigName: String(c.name),
        })),
    );
  }, [props.value, props.defaultValue, props.allCircles, allCirclesByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 2 : 3}
        size="small"
        options={allCirclesAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allCirclesAsOptions.length === 0}
        multiple
        disableCloseOnSelect
        value={selectedCircles}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedCircles.length;
          const alreadySelected = selectedCircles.some(
            (x) => x.circle_ref_id === o.circle_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedCircles.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedCircles(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.circle_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.circle_ref_id === v.circle_ref_id}
        getOptionLabel={(o) => o.bigName}
        renderOption={(optionProps, option) => {
          const { key, ...restProps } = optionProps;
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
        value={selectedCircles.map((c) => c.circle_ref_id).join(",")}
      />
    </>
  );
}
