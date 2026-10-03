import type { Location } from "@jupiter/webapi-client";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useRef } from "react";

import { LocationSearchPopper } from "#/core/common/sub/locations/component/location-search-instant";
import {
  type LocationsEditorBaseProps,
  LocationOptionRow,
  LocationsEditorFrame,
  locationsAutocompleteSx,
  optionKey,
  optionLabel,
  useLocationsLinkEditor,
} from "#/core/common/sub/locations/component/locations-editor-common";

export function LocationsEditor({
  name,
  linkedLocation = null,
  inputsEnabled,
  entityOwnerRefId,
  owner,
  label,
  aloneOnLine = false,
  onSelectionChange,
}: Omit<LocationsEditorBaseProps, "linkedLocations" | "defaultValue"> & {
  linkedLocation?: Location | null;
  /**
   * Told which locations are picked, whenever that changes. A creation page
   * has nothing to hang a location off yet, so choosing an address off the
   * map makes the location in the background - and there is nothing to
   * create with until that comes back. Pass this to know when it has.
   */
  onSelectionChange?: (locationRefIds: Array<string>) => void;
}) {
  const linkedLocations = linkedLocation ? [linkedLocation] : [];
  const {
    actionResult,
    applySelection,
    editable,
    handleInputChange,
    hasActed,
    inputValue,
    isActing,
    locationsHiddenValue,
    noOptionsText,
    options,
    searching,
    selectedOptions,
  } = useLocationsLinkEditor({
    owner,
    linkedLocations,
    defaultValue: linkedLocations.map((location) => location.ref_id),
    inputsEnabled,
    entityOwnerRefId,
    allowMultiple: false,
  });

  // Only on a real change, so an inline callback here can't loop.
  const lastReportedSelection = useRef<string | null>(null);
  useEffect(() => {
    if (lastReportedSelection.current === locationsHiddenValue) {
      return;
    }
    lastReportedSelection.current = locationsHiddenValue;
    onSelectionChange?.(
      locationsHiddenValue === "" ? [] : locationsHiddenValue.split(","),
    );
  }, [locationsHiddenValue, onSelectionChange]);

  return (
    <LocationsEditorFrame
      actionResult={actionResult}
      isActing={isActing}
      hasActed={hasActed}
      name={name}
      locationsHiddenValue={locationsHiddenValue}
    >
      <Autocomplete
        slots={{ popper: LocationSearchPopper }}
        options={options}
        groupBy={(option) =>
          option.kind === "existing" ? "Existing" : "Suggested"
        }
        getOptionLabel={optionLabel}
        getOptionKey={optionKey}
        isOptionEqualToValue={(option, value) =>
          optionKey(option) === optionKey(value)
        }
        filterOptions={(current) => current}
        loading={searching}
        noOptionsText={noOptionsText}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={(_event, newValue) => {
          applySelection(newValue === null ? [] : [newValue]);
        }}
        readOnly={!editable}
        value={selectedOptions[0] ?? null}
        renderOption={(liProps, option, { selected }) => {
          const { key, ...optionProps } = liProps;
          return (
            <li key={key} {...optionProps}>
              <LocationOptionRow
                option={option}
                selected={selected}
                showCheckbox={false}
              />
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ?? "Location"}
            slotProps={{
              ...params.slotProps,

              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {searching ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        sx={locationsAutocompleteSx(aloneOnLine)}
      />
    </LocationsEditorFrame>
  );
}
