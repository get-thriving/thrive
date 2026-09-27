import type {
  Location,
  LocationResolverCandidate,
} from "@jupiter/webapi-client";
import { Box, Checkbox, Typography, useTheme } from "@mui/material";
import { useFetcher } from "react-router";
import type { ReactNode } from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  entityLinkAutocompleteSx,
  entityLinkSelectRootSx,
} from "#/core/common/component/autocomplete";
import { entityOwnedByCurrentUser } from "#/core/common/sub/access/access-level";
import type { ResolvedPlace } from "#/core/common/sub/locations/component/google-maps-loader";
import { useLocationSearchInstant } from "#/core/common/sub/locations/component/location-search-instant";
import type { ActionResult, SomeErrorNoData } from "#/core/infra/action-result";
import { isNoErrorSomeData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

export type ExistingOption = { kind: "existing"; location: Location };
export type CandidateOption = {
  kind: "candidate";
  candidate: LocationResolverCandidate;
};
export type LocationOption = ExistingOption | CandidateOption;

export interface LocationsEditorBaseProps {
  name: string;
  /** Locations already linked to the entity (may belong to another workspace). */
  linkedLocations?: Array<Location>;
  defaultValue: Array<string>;
  inputsEnabled: boolean;
  /** Owner of the entity whose locations are edited; blocks edit when shared. */
  entityOwnerRefId?: string;
  /**
   * Wire-form owner link ``{theType}:std:{refId}`` (see ``EntityLink``).
   * Omit when picking a location before the owning entity exists; selection
   * is written to the hidden field and not upserted as a link.
   */
  owner?: string;
  label?: ReactNode;
  aloneOnLine?: boolean;
}

export function optionKey(option: LocationOption): string {
  if (option.kind === "existing") {
    return `existing:${option.location.ref_id}`;
  }
  return `candidate:${option.candidate.source}:${option.candidate.source_id ?? option.candidate.name}`;
}

export function optionLabel(option: LocationOption): string {
  if (option.kind === "existing") {
    return option.location.name;
  }
  return option.candidate.name;
}

export const locationsAutocompleteSx = entityLinkAutocompleteSx;

export function LocationOptionRow({
  option,
  selected,
  showCheckbox,
}: {
  option: LocationOption;
  selected: boolean;
  showCheckbox: boolean;
}) {
  const address =
    option.kind === "candidate"
      ? option.candidate.address_line
      : option.location.address_line;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        py: address ? 0.25 : 0,
      }}
    >
      {showCheckbox && (
        <Checkbox
          style={{ marginRight: 8, padding: 0, pointerEvents: "none" }}
          checked={selected}
          tabIndex={-1}
          disableRipple
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" component="span">
          {optionLabel(option)}
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
    </Box>
  );
}

export function useLocationsLinkEditor({
  owner,
  linkedLocations = [],
  defaultValue,
  inputsEnabled,
  entityOwnerRefId,
  allowMultiple,
}: Pick<
  LocationsEditorBaseProps,
  | "owner"
  | "linkedLocations"
  | "defaultValue"
  | "inputsEnabled"
  | "entityOwnerRefId"
> & { allowMultiple: boolean }) {
  const cardActionFetcher = useFetcher<SomeErrorNoData>();
  const candidateFetcher = useFetcher<ActionResult<{ location: Location }>>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const editable =
    inputsEnabled &&
    entityOwnedByCurrentUser(entityOwnerRefId, topLevelInfo.user.ref_id);

  const initialSelected = useMemo(() => {
    const byRefId = new Map<string, Location>();
    for (const location of linkedLocations) {
      byRefId.set(location.ref_id, location);
    }
    const refIds = allowMultiple ? defaultValue : defaultValue.slice(0, 1);
    return refIds
      .map((refId) => byRefId.get(refId))
      .filter((location): location is Location => Boolean(location))
      .map((location) => ({ kind: "existing" as const, location }));
  }, [allowMultiple, defaultValue, linkedLocations]);

  const [selectedOptions, setSelectedOptions] =
    useState<ExistingOption[]>(initialSelected);
  const selectedOptionsRef = useRef(selectedOptions);
  selectedOptionsRef.current = selectedOptions;
  const [inputValue, setInputValue] = useState(() =>
    allowMultiple
      ? ""
      : initialSelected[0]
        ? optionLabel(initialSelected[0])
        : "",
  );
  const [locationsHiddenValue, setLocationsHiddenValue] = useState(
    initialSelected.map((option) => option.location.ref_id).join(","),
  );
  const locationsHiddenValueRef = useRef(locationsHiddenValue);
  locationsHiddenValueRef.current = locationsHiddenValue;
  const submittedLocationsRef = useRef(locationsHiddenValue);
  const [dataModified, setDataModified] = useState(false);
  const [shouldAct, setShouldAct] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [hasActed, setHasActed] = useState(false);

  const selectedLabel =
    !allowMultiple && selectedOptions[0]
      ? optionLabel(selectedOptions[0])
      : null;
  const searchQuery =
    selectedLabel !== null && inputValue === selectedLabel ? "" : inputValue;

  const trimmedInput = searchQuery.trim();
  const { searchResult, searching } = useLocationSearchInstant(
    searchQuery,
    editable,
  );

  const handleInputChange = useCallback(
    (_event: unknown, newInputValue: string, reason: string) => {
      // Multi-select shows chips from `value`; ignore MUI's reset so typing
      // is not wiped when async options arrive. Single-select must accept
      // reset so the selected location label appears in the input.
      if (reason === "reset" && allowMultiple) {
        return;
      }
      setInputValue(newInputValue);
    },
    [allowMultiple],
  );

  const options = useMemo(() => {
    const selectedRefIds = new Set(
      selectedOptions.map((option) => option.location.ref_id),
    );
    const existingFromSearch: LocationOption[] = [];
    const seen = new Set<string>(selectedRefIds);
    for (const location of searchResult?.locations ?? []) {
      if (seen.has(location.ref_id)) {
        continue;
      }
      seen.add(location.ref_id);
      existingFromSearch.push({ kind: "existing", location });
    }
    const candidateOptions: LocationOption[] = (
      searchResult?.candidates ?? []
    ).map((candidate) => ({ kind: "candidate", candidate }));
    // Linked first so opening the multi-select shows checked items to toggle.
    return [...selectedOptions, ...existingFromSearch, ...candidateOptions];
  }, [searchResult, selectedOptions]);

  const submitResolvedPlace = useCallback(
    (place: ResolvedPlace) => {
      const fields = {
        name: place.name,
        addressLine: place.addressLine ?? "",
        country: place.country ?? "",
        latitude: place.latitude !== null ? String(place.latitude) : "",
        longitude: place.longitude !== null ? String(place.longitude) : "",
      };
      candidateFetcher.submit(owner ? { owner, ...fields } : fields, {
        method: "post",
        action: owner
          ? "/app/workspace/core/locations/upsert-from-candidate"
          : "/app/workspace/core/locations/create-from-candidate",
      });
    },
    [candidateFetcher, owner],
  );

  const act = useCallback(() => {
    if (!owner) {
      setDataModified(false);
      return;
    }
    const locations = locationsHiddenValueRef.current;
    submittedLocationsRef.current = locations;
    setIsActing(true);
    setShouldAct(false);
    cardActionFetcher.submit(
      {
        owner,
        locations,
      },
      {
        method: "post",
        action: "/app/workspace/core/locations/upsert-locations",
      },
    );
    setDataModified(false);
  }, [cardActionFetcher, owner]);

  useEffect(() => {
    if (dataModified && editable && owner) {
      if (!isActing) {
        act();
      } else {
        setShouldAct(true);
      }
    }
  }, [act, dataModified, editable, isActing, owner]);

  useEffect(() => {
    if (
      isActing &&
      cardActionFetcher.state === "idle" &&
      cardActionFetcher.data
    ) {
      setIsActing(false);
      // A later selection can land while the previous save is in flight. Keep
      // saving until the request that just finished matches the latest value,
      // otherwise "Saved!" shows for the first location and a reload drops the rest.
      if (
        shouldAct ||
        locationsHiddenValueRef.current !== submittedLocationsRef.current
      ) {
        act();
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
      setSelectedOptions((current) => {
        if (
          current.some((option) => option.location.ref_id === created.ref_id)
        ) {
          return current;
        }
        const next = allowMultiple
          ? [...current, { kind: "existing" as const, location: created }]
          : [{ kind: "existing" as const, location: created }];
        setLocationsHiddenValue(
          next.map((option) => option.location.ref_id).join(","),
        );
        if (!allowMultiple) {
          setInputValue(created.name);
        }
        return next;
      });
      if (owner) {
        setDataModified(true);
      }
    }
  }, [allowMultiple, candidateFetcher.data, candidateFetcher.state, owner]);

  const commitExisting = useCallback(
    (next: ExistingOption[], markModified: boolean) => {
      selectedOptionsRef.current = next;
      setSelectedOptions(next);
      const hidden = next.map((option) => option.location.ref_id).join(",");
      locationsHiddenValueRef.current = hidden;
      setLocationsHiddenValue(hidden);
      if (allowMultiple) {
        // A pick must clear the query. Ignoring MUI's reset keeps an in-progress
        // search from being wiped when results arrive, so the next name would
        // otherwise be appended ("Paris" + "Rome").
        setInputValue("");
      }
      if (markModified) {
        setDataModified(true);
      }
    },
    [allowMultiple],
  );

  const applySelection = useCallback(
    (
      values: LocationOption[],
      reason?: string,
      changedOption?: LocationOption,
    ) => {
      if (!editable) {
        return;
      }
      const incomingExisting: ExistingOption[] = [];
      let candidate: CandidateOption | null = null;
      for (const option of values) {
        if (option.kind === "existing") {
          incomingExisting.push(option);
        } else {
          candidate = option;
        }
      }

      if (!allowMultiple) {
        setSelectedOptions(incomingExisting);
        setLocationsHiddenValue(
          incomingExisting.map((option) => option.location.ref_id).join(","),
        );
        setInputValue(
          incomingExisting[0]
            ? optionLabel(incomingExisting[0])
            : candidate !== null
              ? optionLabel(candidate)
              : "",
        );
        if (candidate !== null) {
          submitResolvedPlace({
            name: candidate.candidate.name,
            addressLine: candidate.candidate.address_line ?? null,
            country: candidate.candidate.country ?? null,
            latitude: candidate.candidate.gps?.latitude ?? null,
            longitude: candidate.candidate.gps?.longitude ?? null,
            sourceId: candidate.candidate.source_id ?? null,
          });
          return;
        }
        setDataModified(true);
        return;
      }

      if (reason === "clear") {
        commitExisting([], true);
        return;
      }
      if (
        reason === "removeOption" &&
        changedOption?.kind === "existing"
      ) {
        commitExisting(
          selectedOptionsRef.current.filter(
            (option) =>
              option.location.ref_id !== changedOption.location.ref_id,
          ),
          true,
        );
        return;
      }

      // A new pick must be added to the cities already chosen. MUI can report
      // only the option that was just clicked, which would drop the earlier ones.
      const byRefId = new Map(
        selectedOptionsRef.current.map((option) => [
          option.location.ref_id,
          option,
        ]),
      );
      for (const option of incomingExisting) {
        byRefId.set(option.location.ref_id, option);
      }
      const next = [...byRefId.values()];
      const changed =
        next.length !== selectedOptionsRef.current.length ||
        next.some(
          (option, index) =>
            option.location.ref_id !==
            selectedOptionsRef.current[index]?.location.ref_id,
        );
      commitExisting(next, changed && candidate === null);
      if (candidate !== null) {
        submitResolvedPlace({
          name: candidate.candidate.name,
          addressLine: candidate.candidate.address_line ?? null,
          country: candidate.candidate.country ?? null,
          latitude: candidate.candidate.gps?.latitude ?? null,
          longitude: candidate.candidate.gps?.longitude ?? null,
          sourceId: candidate.candidate.source_id ?? null,
        });
      }
    },
    [allowMultiple, commitExisting, editable, submitResolvedPlace],
  );

  // Making the location off a map candidate is part of the same piece of work
  // as linking it, so the two read as one "Saving..." rather than a gap and
  // then a label.
  const isActingOrResolvingCandidate =
    isActing || candidateFetcher.state !== "idle";

  const actionResult = cardActionFetcher.data ?? candidateFetcher.data;
  const noOptionsText =
    trimmedInput === ""
      ? "Type to search locations"
      : searching
        ? "Searching..."
        : "No locations found";

  return {
    actionResult,
    applySelection,
    editable,
    hasActed,
    handleInputChange,
    inputValue,
    isActing: isActingOrResolvingCandidate,
    locationsHiddenValue,
    noOptionsText,
    options,
    searching,
    selectedOptions,
  };
}

export function LocationsEditorFrame({
  actionResult,
  isActing,
  hasActed,
  name,
  locationsHiddenValue,
  children,
}: {
  actionResult: ActionResult<unknown> | SomeErrorNoData | undefined;
  isActing: boolean;
  hasActed: boolean;
  name: string;
  locationsHiddenValue: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Box sx={entityLinkSelectRootSx}>
      <GlobalError actionResult={actionResult} />
      <FieldError actionResult={actionResult} fieldName="/locations_ref_ids" />
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
      {children}
      <input name={name} type="hidden" value={locationsHiddenValue} />
    </Box>
  );
}
