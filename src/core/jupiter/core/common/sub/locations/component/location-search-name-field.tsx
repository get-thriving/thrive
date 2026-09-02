import type { LocationResolverCandidate } from "@jupiter/webapi-client";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
  LocationSearchPopper,
  useLocationSearchInstant,
} from "#/core/common/sub/locations/component/location-search-instant";

interface LocationFieldsFromCandidate {
  name: string;
  addressLine: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface Props {
  defaultValue: string;
  inputsEnabled: boolean;
  onCandidateSelected: (fields: LocationFieldsFromCandidate) => void;
}

export function LocationSearchNameField({
  defaultValue,
  inputsEnabled,
  onCandidateSelected,
}: Props) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const { searchResult, searching } = useLocationSearchInstant(
    inputValue,
    inputsEnabled,
  );

  useEffect(() => {
    const form = nameInputRef.current?.form;
    if (!form) {
      return;
    }
    const handleReset = () => setInputValue(defaultValue);
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [defaultValue]);

  const trimmedInput = inputValue.trim();
  const options = searchResult?.candidates ?? [];
  const noOptionsText =
    trimmedInput === ""
      ? "Type to search locations"
      : searching
        ? "Searching..."
        : "No locations found";

  return (
    <Autocomplete
      freeSolo
      fullWidth
      slots={{ popper: LocationSearchPopper }}
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      getOptionKey={(option) =>
        typeof option === "string" ? option : candidateKey(option)
      }
      isOptionEqualToValue={(option, value) =>
        typeof option !== "string" &&
        typeof value !== "string" &&
        candidateKey(option) === candidateKey(value)
      }
      filterOptions={(current) => current}
      loading={searching}
      noOptionsText={noOptionsText}
      value={null}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason === "reset") {
          return;
        }
        setInputValue(newInputValue);
      }}
      onChange={(_event, newValue) => {
        if (
          !inputsEnabled ||
          newValue === null ||
          typeof newValue === "string"
        ) {
          return;
        }
        const fields = locationFieldsFromCandidate(newValue);
        setInputValue(fields.name);
        onCandidateSelected(fields);
      }}
      readOnly={!inputsEnabled}
      renderOption={(liProps, option) => {
        const { key, ...optionProps } = liProps;
        const address = option.address_line;
        return (
          <li key={key} {...optionProps}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                py: address ? 0.25 : 0,
              }}
            >
              <Typography variant="body2" component="span">
                {option.name}
              </Typography>
              {address && (
                <Typography
                  variant="caption"
                  component="span"
                  color="text.secondary"
                  sx={{ lineHeight: 1.3 }}
                >
                  {address}
                </Typography>
              )}
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Name"
          name="name"
          autoComplete="off"
          inputRef={nameInputRef}
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
    />
  );
}

function candidateKey(candidate: LocationResolverCandidate): string {
  return `candidate:${candidate.source}:${candidate.source_id ?? candidate.name}`;
}

function locationFieldsFromCandidate(
  candidate: LocationResolverCandidate,
): LocationFieldsFromCandidate {
  return {
    name: candidate.name,
    addressLine: candidate.address_line ?? "",
    country: candidate.country ?? "",
    latitude:
      candidate.gps?.latitude !== undefined && candidate.gps?.latitude !== null
        ? String(candidate.gps.latitude)
        : "",
    longitude:
      candidate.gps?.longitude !== undefined &&
      candidate.gps?.longitude !== null
        ? String(candidate.gps.longitude)
        : "",
  };
}
