import type { Location } from "@jupiter/webapi-client";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

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
}: Omit<LocationsEditorBaseProps, "linkedLocations" | "defaultValue"> & {
  linkedLocation?: Location | null;
}) {
  const linkedLocations = linkedLocation ? [linkedLocation] : [];
  const {
    actionResult,
    applySelection,
    editable,
    hasActed,
    inputValue,
    isActing,
    locationsHiddenValue,
    noOptionsText,
    options,
    searching,
    selectedOptions,
    setInputValue,
  } = useLocationsLinkEditor({
    owner,
    linkedLocations,
    defaultValue: linkedLocations.map((location) => location.ref_id),
    inputsEnabled,
    entityOwnerRefId,
    allowMultiple: false,
  });

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
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === "reset") {
            return;
          }
          setInputValue(newInputValue);
        }}
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
    </LocationsEditorFrame>
  );
}
