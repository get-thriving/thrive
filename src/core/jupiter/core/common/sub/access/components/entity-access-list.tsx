import type {
  EntityId,
  GetAccessForEntityEntry,
  NamedEntityTag,
  UserLight,
} from "@jupiter/webapi-client";
import { AccessLevel } from "@jupiter/webapi-client";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { AccessLevelSelect } from "#/core/common/sub/access/components/access-level-select";
import { EntityAccessRow } from "#/core/common/sub/access/components/entity-access-row";
import { formatUserLightLabel } from "#/core/users/components/user-light-chip";

const GET_ACCESS_FOR_ENTITY_ROUTE =
  "/app/workspace/core/access/get-access-for-entity";

interface AccessListFetcherData {
  entries: GetAccessForEntityEntry[];
  users: UserLight[];
}

interface EntityAccessListProps {
  entityType: NamedEntityTag;
  entityRefId: EntityId;
  ownerRefId?: EntityId;
  reloadKey?: number;
  removeEnabled?: boolean;
  removeInFlight?: boolean;
  removingGrantRefId?: EntityId;
  onRemoveGrant?: (accessGrantRefId: EntityId) => void;
  updateEnabled?: boolean;
  updateInFlight?: boolean;
  updatingGrantRefId?: EntityId;
  onUpdateGrant?: (
    accessGrantRefId: EntityId,
    accessLevel: AccessLevel,
  ) => void;
}

export function EntityAccessList(props: EntityAccessListProps) {
  const fetcher = useFetcher<AccessListFetcherData>();

  useEffect(() => {
    const params = new URLSearchParams({
      entityType: props.entityType,
      entityRefId: props.entityRefId,
    });
    fetcher.load(`${GET_ACCESS_FOR_ENTITY_ROUTE}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.entityType, props.entityRefId, props.reloadKey]);

  if (fetcher.state === "loading" && !fetcher.data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!fetcher.data) {
    return null;
  }

  const usersById = Object.fromEntries(
    fetcher.data.users.map((user) => [user.ref_id, user]),
  );

  const entries = fetcher.data.entries.filter(
    (entry) => entry.access_status.user_ref_id !== props.ownerRefId,
  );

  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No other users have access.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <EntityAccessEntryRow
          key={`${entry.access_status.user_ref_id}-${entry.access_status.access_grant_ref_id}`}
          entry={entry}
          user={usersById[entry.access_status.user_ref_id]}
          removeEnabled={props.removeEnabled}
          removeInFlight={props.removeInFlight}
          removingGrantRefId={props.removingGrantRefId}
          onRemoveGrant={props.onRemoveGrant}
          updateEnabled={props.updateEnabled}
          updateInFlight={props.updateInFlight}
          updatingGrantRefId={props.updatingGrantRefId}
          onUpdateGrant={props.onUpdateGrant}
        />
      ))}
    </Stack>
  );
}

interface EntityAccessEntryRowProps {
  entry: GetAccessForEntityEntry;
  user?: UserLight;
  removeEnabled?: boolean;
  removeInFlight?: boolean;
  removingGrantRefId?: EntityId;
  onRemoveGrant?: (accessGrantRefId: EntityId) => void;
  updateEnabled?: boolean;
  updateInFlight?: boolean;
  updatingGrantRefId?: EntityId;
  onUpdateGrant?: (
    accessGrantRefId: EntityId,
    accessLevel: AccessLevel,
  ) => void;
}

function EntityAccessEntryRow(props: EntityAccessEntryRowProps) {
  const userLabel =
    props.user !== undefined
      ? formatUserLightLabel(props.user)
      : props.entry.access_status.user_ref_id;

  const accessGrantRefId = props.entry.access_grant.ref_id;
  const currentAccessLevel = props.entry.access_status.access_level;
  const isRemoving =
    props.removeInFlight === true &&
    props.removingGrantRefId === accessGrantRefId;
  const isUpdating =
    props.updateInFlight === true &&
    props.updatingGrantRefId === accessGrantRefId;
  const mutationInFlight = isRemoving || isUpdating;

  // Someone who cannot share sees the same controls, just not operable.
  const canUpdate =
    props.updateEnabled === true && props.onUpdateGrant !== undefined;
  const canRemove =
    props.removeEnabled === true && props.onRemoveGrant !== undefined;

  return (
    <Box
      sx={{
        display: "flex",
        // The row is two lines tall, so keep the remove button next to the
        // user it acts on rather than floating between the lines.
        alignItems: "flex-start",
        gap: 0.5,
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <EntityAccessRow
          label="user"
          userLabel={userLabel}
          accessLevelControl={
            <AccessLevelSelect
              defaultValue={currentAccessLevel}
              inputsEnabled={canUpdate && !mutationInFlight}
              forSharing
              compact
              onChange={(accessLevel) => {
                if (accessLevel === currentAccessLevel) {
                  return;
                }
                props.onUpdateGrant?.(accessGrantRefId, accessLevel);
              }}
            />
          }
        />
      </Box>
      <IconButton
        size="small"
        color="warning"
        aria-label="Remove access"
        disabled={
          !canRemove ||
          props.removeInFlight === true ||
          props.updateInFlight === true
        }
        onClick={() => props.onRemoveGrant?.(accessGrantRefId)}
      >
        {isRemoving ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <DeleteIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
}
