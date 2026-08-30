import type { Location, LocationResolverCandidate } from "@jupiter/webapi-client";
import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import type { ReactNode } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { entityOwnedByCurrentUser } from "#/core/common/sub/access/access-level";
import type { ActionResult, SomeErrorNoData } from "#/core/infra/action-result";
import { isNoErrorSomeData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

type ExistingOption = { kind: "existing"; location: Location };
type CandidateOption = {
  kind: "candidate";
  candidate: LocationResolverCandidate;
};
type LocationOption = ExistingOption | CandidateOption;

interface Props {
  name: string;
  allLocations: Array<Location>;
  /** Location already linked to the entity (may belong to another workspace). */
  linkedLocation?: Location | null;
  defaultValue: string | null;
  inputsEnabled: boolean;
  /** Owner of the entity whose location is edited; blocks edit when shared. */
  entityOwnerRefId?: string;
  /** Wire-form owner link ``{theType}:std:{refId}`` (see ``EntityLink``). */
  owner: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

type LocationSearchInstantData = ActionResult<{
  query?: string;
  result?: {
    locations: Array<Location>;
    candidates: Array<LocationResolverCandidate>;
  };
}>;

function optionKey(option: LocationOption): string {
  if (option.kind === "existing") {
    return `existing:${option.location.ref_id}`;
  }
  return `candidate:${option.candidate.source}:${option.candidate.source_id ?? option.candidate.name}`;
}

function optionLabel(option: LocationOption): string {
  if (option.kind === "existing") {
    return option.location.name;
  }
  return option.candidate.name;
}

export function LocationsEditor({
  name,
  allLocations,
  linkedLocation = null,
  defaultValue,
  inputsEnabled,
  entityOwnerRefId,
  owner,
  label,
  aloneOnLine = false,
}: Props) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const candidateFetcher = useFetcher<ActionResult<{ location: Location }>>();
  const searchFetcher = useFetcher<LocationSearchInstantData>();
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const editable =
    inputsEnabled &&
    entityOwnedByCurrentUser(entityOwnerRefId, topLevelInfo.user.ref_id);

  const knownLocations = useMemo(() => {
    const byRefId = new Map<string, Location>();
    for (const location of allLocations) {
      byRefId.set(location.ref_id, location);
    }
    if (linkedLocation) {
      byRefId.set(linkedLocation.ref_id, linkedLocation);
    }
    return Array.from(byRefId.values());
  }, [allLocations, linkedLocation]);

  const initialDefaultValue = useMemo(() => {
    if (!defaultValue) {
      return null;
    }
    const location =
      knownLocations.find((item) => item.ref_id === defaultValue) ?? null;
    return location ? { kind: "existing" as const, location } : null;
  }, [defaultValue, knownLocations]);

  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(
    initialDefaultValue,
  );
  const [inputValue, setInputValue] = useState(
    initialDefaultValue ? optionLabel(initialDefaultValue) : "",
  );
  const [locationHiddenValue, setLocationHiddenValue] = useState(
    initialDefaultValue?.location.ref_id ?? "",
  );
  const [dataModified, setDataModified] = useState(false);
  const [shouldAct, setShouldAct] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [hasActed, setHasActed] = useState(false);

  useEffect(() => {
    const trimmed = inputValue.trim();
    const timeout = window.setTimeout(() => {
      if (trimmed === "") {
        return;
      }
      searchFetcher.load(
        `/app/workspace/core/locations/search-instant?query=${encodeURIComponent(trimmed)}`,
      );
    }, 300);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher identity is stable
  }, [inputValue]);

  const searchResult =
    inputValue.trim() !== "" &&
    searchFetcher.data &&
    isNoErrorSomeData(searchFetcher.data)
      ? searchFetcher.data.data.result
      : undefined;

  const options = useMemo(() => {
    const existingSource = searchResult?.locations ?? knownLocations;
    const byRefId = new Map<string, Location>();
    for (const location of existingSource) {
      byRefId.set(location.ref_id, location);
    }
    if (selectedOption?.kind === "existing") {
      byRefId.set(selectedOption.location.ref_id, selectedOption.location);
    }
    const existingOptions: LocationOption[] = Array.from(byRefId.values()).map(
      (location) => ({ kind: "existing", location }),
    );
    const candidateOptions: LocationOption[] = (
      searchResult?.candidates ?? []
    ).map((candidate) => ({ kind: "candidate", candidate }));
    return [...existingOptions, ...candidateOptions];
  }, [knownLocations, searchResult, selectedOption]);

  const act = useCallback(() => {
    setIsActing(true);
    cardActionFetcher.submit(
      {
        owner,
        location: locationHiddenValue,
      },
      {
        method: "post",
        action: "/app/workspace/core/locations/upsert-locations",
      },
    );
    setDataModified(false);
  }, [cardActionFetcher, owner, locationHiddenValue]);

  useEffect(() => {
    if (dataModified && editable) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, editable, isActing]);

  useEffect(() => {
    if (
      isActing &&
      cardActionFetcher.state === "idle" &&
      cardActionFetcher.data
    ) {
      setIsActing(false);
      if (shouldAct) {
        act();
        setShouldAct(false);
      } else {
        setHasActed(true);
        setTimeout(() => {
          setHasActed(false);
        }, 1000);
      }
    }
  }, [act, isActing, cardActionFetcher, shouldAct]);

  useEffect(() => {
    if (
      candidateFetcher.state === "idle" &&
      candidateFetcher.data &&
      isNoErrorSomeData(candidateFetcher.data)
    ) {
      const created = candidateFetcher.data.data.location;
      setSelectedOption({ kind: "existing", location: created });
      setLocationHiddenValue(created.ref_id);
      setInputValue(created.name);
    }
  }, [candidateFetcher.state, candidateFetcher.data]);

  const actionResult = cardActionFetcher.data ?? candidateFetcher.data;

  return (
    <Box sx={{ position: "relative" }}>
      <GlobalError actionResult={actionResult} />
      <FieldError actionResult={actionResult} fieldName="/location_ref_id" />
      {isActing && (
        <Box
          sx={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            color: theme.palette.text.disabled,
            zIndex: 1,
          }}
        >
          Saving...
        </Box>
      )}
      {hasActed && (
        <Box
          sx={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            color: theme.palette.text.disabled,
            zIndex: 1,
          }}
        >
          Saved!
        </Box>
      )}
      <Autocomplete
        disablePortal
        options={options}
        groupBy={(option) =>
          option.kind === "existing" ? "Existing" : "Suggested"
        }
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, value) =>
          optionKey(option) === optionKey(value)
        }
        filterOptions={(current) => current}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(_event, newValue) => {
          if (!editable) {
            return;
          }
          setSelectedOption(newValue);
          if (newValue === null) {
            setLocationHiddenValue("");
            setDataModified(true);
            return;
          }
          if (newValue.kind === "existing") {
            setLocationHiddenValue(newValue.location.ref_id);
            setDataModified(true);
            return;
          }
          candidateFetcher.submit(
            {
              owner,
              name: newValue.candidate.name,
              addressLine: newValue.candidate.address_line ?? "",
              country: newValue.candidate.country ?? "",
              latitude:
                newValue.candidate.gps !== undefined &&
                newValue.candidate.gps !== null
                  ? String(newValue.candidate.gps.latitude)
                  : "",
              longitude:
                newValue.candidate.gps !== undefined &&
                newValue.candidate.gps !== null
                  ? String(newValue.candidate.gps.longitude)
                  : "",
            },
            {
              method: "post",
              action: "/app/workspace/core/locations/upsert-from-candidate",
            },
          );
        }}
        readOnly={!editable}
        value={selectedOption}
        renderInput={(params) => (
          <TextField {...params} label={label ?? "Location"} />
        )}
        sx={{
          maxWidth: aloneOnLine ? "100%" : "14rem",
          minWidth: isBigScreen ? "8rem" : "4rem",
        }}
      />
      <input name={name} type="hidden" value={locationHiddenValue} />
    </Box>
  );
}
