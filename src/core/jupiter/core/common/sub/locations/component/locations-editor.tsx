import type { Location } from "@jupiter/webapi-client";
import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import type { ReactNode } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { entityOwnedByCurrentUser } from "#/core/common/sub/access/access-level";
import type { SomeErrorNoData } from "#/core/infra/action-result";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

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

  const locationsByRefId: { [location: string]: Location } = useMemo(() => {
    const result: { [location: string]: Location } = {};
    for (const location of knownLocations) {
      result[location.ref_id] = location;
    }
    return result;
  }, [knownLocations]);

  const initialDefaultValue = useMemo(() => {
    if (!defaultValue) {
      return null;
    }
    return locationsByRefId[defaultValue] ?? null;
  }, [defaultValue, locationsByRefId]);

  const [locationHiddenValue, setLocationHiddenValue] = useState(
    initialDefaultValue?.ref_id ?? "",
  );
  const [dataModified, setDataModified] = useState(false);
  const [shouldAct, setShouldAct] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [hasActed, setHasActed] = useState(false);

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

  return (
    <Box sx={{ position: "relative" }}>
      <GlobalError actionResult={cardActionFetcher.data} />
      <FieldError
        actionResult={cardActionFetcher.data}
        fieldName="/location_ref_id"
      />
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
        options={knownLocations}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.ref_id === value.ref_id}
        onChange={(_event, newValue) => {
          if (!editable) {
            return;
          }
          setLocationHiddenValue(newValue?.ref_id ?? "");
          setDataModified(true);
        }}
        readOnly={!editable}
        defaultValue={initialDefaultValue}
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
