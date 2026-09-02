import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { renderLimitedAutocompleteTags } from "#/core/common/component/autocomplete";
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

export function LocationsMultiEditor({
  name,
  linkedLocations = [],
  defaultValue,
  inputsEnabled,
  entityOwnerRefId,
  owner,
  label,
  aloneOnLine = false,
}: LocationsEditorBaseProps) {
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
    defaultValue,
    inputsEnabled,
    entityOwnerRefId,
    allowMultiple: true,
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
        multiple
        filterSelectedOptions
        disableCloseOnSelect
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
          applySelection(newValue);
        }}
        readOnly={!editable}
        value={selectedOptions}
        renderTags={renderLimitedAutocompleteTags(optionLabel)}
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
