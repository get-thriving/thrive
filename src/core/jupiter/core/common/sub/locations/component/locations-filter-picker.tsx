import type { Location } from "@jupiter/webapi-client";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  entityLinkSelectRootSx,
  renderLimitedAutocompleteTags,
} from "#/core/common/component/autocomplete";
import {
  LocationSearchPopper,
  useLocationSearchInstant,
} from "#/core/common/sub/locations/component/location-search-instant";
import {
  type ExistingOption,
  LocationOptionRow,
  locationsAutocompleteSx,
  optionKey,
} from "#/core/common/sub/locations/component/locations-editor-common";

export interface LocationsFilterPickerProps {
  value: Array<Location>;
  onChange: (next: Array<Location>) => void;
  inputsEnabled: boolean;
  label?: ReactNode;
  aloneOnLine?: boolean;
  size?: "small" | "medium";
}

/** Type-ahead over existing locations for local filter state (no Google, no persistence). */
export function LocationsFilterPicker({
  value,
  onChange,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium",
}: LocationsFilterPickerProps) {
  const [inputValue, setInputValue] = useState("");
  const { searchResult, searching } = useLocationSearchInstant(
    inputValue,
    inputsEnabled,
    { includeCandidates: false },
  );

  const selectedOptions = useMemo<ExistingOption[]>(
    () =>
      value.map((location) => ({
        kind: "existing" as const,
        location,
      })),
    [value],
  );

  const options = useMemo<ExistingOption[]>(() => {
    const byRefId = new Map<string, Location>();
    for (const location of searchResult?.locations ?? []) {
      byRefId.set(location.ref_id, location);
    }
    for (const option of selectedOptions) {
      byRefId.set(option.location.ref_id, option.location);
    }
    return Array.from(byRefId.values()).map((location) => ({
      kind: "existing" as const,
      location,
    }));
  }, [searchResult, selectedOptions]);

  const trimmedInput = inputValue.trim();
  const noOptionsText =
    trimmedInput === ""
      ? "Type to search locations"
      : searching
        ? "Searching..."
        : "No locations found";

  return (
    <Box sx={entityLinkSelectRootSx}>
      <Autocomplete<ExistingOption, true>
        multiple
        filterSelectedOptions
        disableCloseOnSelect
        slots={{ popper: LocationSearchPopper }}
        options={options}
        getOptionLabel={(option) => option.location.name}
        getOptionKey={optionKey}
        isOptionEqualToValue={(option, selected) =>
          optionKey(option) === optionKey(selected)
        }
        filterOptions={(current) => current}
        loading={searching}
        noOptionsText={noOptionsText}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === "reset") {
            return;
          }
          setInputValue(newInputValue);
        }}
        onChange={(_event, newValue) => {
          onChange(newValue.map((option) => option.location));
        }}
        readOnly={!inputsEnabled}
        value={selectedOptions}
        renderTags={renderLimitedAutocompleteTags(
          (option: ExistingOption) => option.location.name,
        )}
        renderOption={(liProps, option, { selected }) => {
          const { key, ...optionProps } = liProps;
          return (
            <li key={key} {...optionProps}>
              <LocationOptionRow
                option={option}
                selected={selected}
                showCheckbox
              />
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ?? "Locations"}
            size={size}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {searching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={locationsAutocompleteSx(aloneOnLine)}
      />
    </Box>
  );
}
