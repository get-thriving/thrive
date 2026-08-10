import type {
  EntityId,
  GetAccessForEntityEntry,
  NamedEntityTag,
  UserLight,
} from "@jupiter/webapi-client";
import {
  AccessLevel,
  AccessStatusReason,
  NamedEntityTag as NamedEntityTagEnum,
} from "@jupiter/webapi-client";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { useEffect, type ReactNode } from "react";

import { accessLevelName } from "#/core/common/sub/access/access-level";
import { AccessLevelSelect } from "#/core/common/sub/access/components/access-level-select";
import { EntityAccessRow } from "#/core/common/sub/access/components/entity-access-row";
import { entityLinkStd, parseEntityLinkStd } from "#/core/common/entity-link";
import { workspacePathForEntityTag } from "#/core/common/workspace-entity-path";
import { SlimChip } from "#/core/infra/component/chips";
import { EntityLink } from "#/core/infra/component/entity-card";
import { entityTagName } from "#/core/named-entity-tag";
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

  const currentEntityLink = entityLinkStd(props.entityType, props.entityRefId);

  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <EntityAccessEntryRow
          key={`${entry.access_status.user_ref_id}-${entry.access_status.access_grant_ref_id}`}
          entry={entry}
          user={usersById[entry.access_status.user_ref_id]}
          currentEntityLink={currentEntityLink}
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
  currentEntityLink: string;
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

function isInheritedAccess(
  entry: GetAccessForEntityEntry,
  currentEntityLink: string,
): boolean {
  if (entry.access_status.reason === AccessStatusReason.INHERITED) {
    return true;
  }
  return entry.access_grant.entity !== currentEntityLink;
}

function EntityAccessEntryRow(props: EntityAccessEntryRowProps) {
  const userLabel =
    props.user !== undefined
      ? formatUserLightLabel(props.user)
      : props.entry.access_status.user_ref_id;

  const accessGrantRefId = props.entry.access_grant.ref_id;
  const currentAccessLevel = props.entry.access_status.access_level;
  const inherited = isInheritedAccess(props.entry, props.currentEntityLink);
  const isRemoving =
    props.removeInFlight === true &&
    props.removingGrantRefId === accessGrantRefId;
  const isUpdating =
    props.updateInFlight === true &&
    props.updatingGrantRefId === accessGrantRefId;
  const mutationInFlight = isRemoving || isUpdating;

  // Inherited rights are managed on the source entity, not here.
  const canUpdate =
    !inherited &&
    props.updateEnabled === true &&
    props.onUpdateGrant !== undefined;
  const canRemove =
    !inherited &&
    props.removeEnabled === true &&
    props.onRemoveGrant !== undefined;

  let sourceNote: ReactNode = null;
  if (inherited) {
    let sourceType: NamedEntityTag = NamedEntityTagEnum.OTHER;
    let sourceRefId: string | null = null;
    try {
      const parsed = parseEntityLinkStd(props.entry.access_grant.entity);
      sourceType = parsed.theType as NamedEntityTag;
      sourceRefId = parsed.refId;
    } catch {
      sourceRefId = null;
    }

    const sourceTypeLabel = entityTagName(sourceType);
    const sourceName = props.entry.source_entity_name;
    const sourcePath =
      sourceRefId !== null
        ? workspacePathForEntityTag(sourceType, sourceRefId)
        : null;
    const sourceText =
      sourceName !== undefined && sourceName !== null && sourceName.length > 0
        ? `${sourceTypeLabel} "${sourceName}"`
        : sourceTypeLabel;

    sourceNote = (
      <>
        <SlimChip label="Inherited" color="info" />
        <Typography variant="body2" color="text.secondary" component="span">
          from{" "}
          {sourcePath !== null ? (
            <EntityLink to={sourcePath} inline>
              {sourceText}
            </EntityLink>
          ) : (
            sourceText
          )}
        </Typography>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        // The row is two lines tall, so keep the remove button next to the
        // user it acts on rather than floating between the lines.
        alignItems: "flex-start",
        gap: 0.5,
        ...(inherited
          ? {
              borderLeft: 3,
              borderColor: "info.main",
              pl: 1,
              py: 0.5,
              bgcolor: "action.hover",
              borderRadius: 1,
            }
          : {}),
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <EntityAccessRow
          label="user"
          userLabel={userLabel}
          accessLevelControl={
            inherited ? (
              <SlimChip
                label={accessLevelName(currentAccessLevel)}
                color="info"
              />
            ) : (
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
            )
          }
          sourceNote={sourceNote}
        />
      </Box>
      {!inherited && (
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
      )}
    </Box>
  );
}
