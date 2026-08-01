import type {
  EntityId,
  NamedEntityTag,
  UserLight,
  AccessStatus,
} from "@jupiter/webapi-client";
import { AccessLevel } from "@jupiter/webapi-client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AccessLevelSelect } from "#/core/common/sub/access/components/access-level-select";
import { EntityAccessSummary } from "#/core/common/sub/access/components/entity-access-summary";
import { EntityAccessList } from "#/core/common/sub/access/components/entity-access-list";
import { SearchForUserWidget } from "#/core/common/sub/access/components/search-for-user-widget";
import { accessStatusIsOwner } from "#/core/common/sub/access/access-level";
import type { ActionResult } from "#/core/infra/action-result";
import { isNoErrorSomeData } from "#/core/infra/action-result";
import { GlobalError } from "#/core/infra/component/errors";
import { SectionCard } from "#/core/infra/component/section-card";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

const SEARCH_FOR_USER_ROUTE = "/app/workspace/core/access/search-for-user";
const INVITE_USER_ROUTE = "/app/workspace/core/access/invite";
const REMOVE_GRANT_ROUTE = "/app/workspace/core/access/remove-grant";
const UPDATE_GRANT_ROUTE = "/app/workspace/core/access/update-grant";
const SEARCH_FOR_USER_DEFAULT_LIMIT = 20;

type SearchForUserFetcherData = ActionResult<{ users: UserLight[] }>;

interface AccessPanelProps {
  entityType: NamedEntityTag;
  entityRefId: EntityId;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  owner?: UserLight;
  accessStatus?: AccessStatus | null;
}

export function AccessPanel(props: AccessPanelProps) {
  const sectionId = `${props.entityType}-access`;
  const searchFetcher = useFetcher<SearchForUserFetcherData>();
  const inviteFetcher = useFetcher<ActionResult<unknown>>();
  const removeFetcher = useFetcher<ActionResult<unknown>>();
  const updateFetcher = useFetcher<ActionResult<unknown>>();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteDialogKey, setInviteDialogKey] = useState(0);
  const [accessListReloadKey, setAccessListReloadKey] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<UserLight[]>([]);

  const pendingSearchResolveRef = useRef<((users: UserLight[]) => void) | null>(
    null,
  );

  useEffect(() => {
    if (searchFetcher.state !== "idle" || searchFetcher.data === undefined) {
      return;
    }

    const resolve = pendingSearchResolveRef.current;
    if (resolve === null) {
      return;
    }

    pendingSearchResolveRef.current = null;
    if (isNoErrorSomeData(searchFetcher.data)) {
      resolve(searchFetcher.data.data.users);
    } else {
      resolve([]);
    }
  }, [searchFetcher.state, searchFetcher.data]);

  useEffect(() => {
    if (inviteFetcher.state !== "idle" || inviteFetcher.data === undefined) {
      return;
    }

    if (inviteFetcher.data.theType === "no-error-no-data") {
      setInviteDialogOpen(false);
      setSelectedUsers([]);
      setAccessListReloadKey((key) => key + 1);
    }
  }, [inviteFetcher.state, inviteFetcher.data]);

  useEffect(() => {
    if (removeFetcher.state !== "idle" || removeFetcher.data === undefined) {
      return;
    }

    if (removeFetcher.data.theType === "no-error-no-data") {
      setAccessListReloadKey((key) => key + 1);
    }
  }, [removeFetcher.state, removeFetcher.data]);

  useEffect(() => {
    if (updateFetcher.state !== "idle" || updateFetcher.data === undefined) {
      return;
    }

    setAccessListReloadKey((key) => key + 1);
  }, [updateFetcher.state, updateFetcher.data]);

  const searchUsers = useCallback(
    (query: string) => {
      return new Promise<UserLight[]>((resolve) => {
        if (pendingSearchResolveRef.current !== null) {
          pendingSearchResolveRef.current([]);
        }
        pendingSearchResolveRef.current = resolve;

        const params = new URLSearchParams({
          query,
          limit: String(SEARCH_FOR_USER_DEFAULT_LIMIT),
        });
        searchFetcher.load(`${SEARCH_FOR_USER_ROUTE}?${params.toString()}`);
      });
    },
    [searchFetcher],
  );

  function openInviteDialog() {
    setSelectedUsers([]);
    setInviteDialogKey((key) => key + 1);
    setInviteDialogOpen(true);
  }

  function closeInviteDialog() {
    setInviteDialogOpen(false);
    setSelectedUsers([]);
  }

  function handleInvite() {
    if (selectedUsers.length === 0) {
      return;
    }

    const form = document.getElementById(
      `${sectionId}-invite-form`,
    ) as HTMLFormElement | null;
    if (form === null) {
      return;
    }

    const formData = new FormData(form);
    formData.set("entityType", props.entityType);
    formData.set("entityRefId", props.entityRefId);
    formData.set(
      "userRefIds",
      selectedUsers.map((user) => user.ref_id).join(","),
    );

    inviteFetcher.submit(formData, {
      method: "post",
      action: INVITE_USER_ROUTE,
    });
  }

  function handleRemoveGrant(accessGrantRefId: EntityId) {
    const formData = new FormData();
    formData.set("entityType", props.entityType);
    formData.set("entityRefId", props.entityRefId);
    formData.set("accessGrantRefId", accessGrantRefId);

    removeFetcher.submit(formData, {
      method: "post",
      action: REMOVE_GRANT_ROUTE,
    });
  }

  function handleUpdateGrant(
    accessGrantRefId: EntityId,
    accessLevel: AccessLevel,
  ) {
    const formData = new FormData();
    formData.set("entityType", props.entityType);
    formData.set("entityRefId", props.entityRefId);
    formData.set("accessGrantRefId", accessGrantRefId);
    formData.set("accessLevel", accessLevel);

    updateFetcher.submit(formData, {
      method: "post",
      action: UPDATE_GRANT_ROUTE,
    });
  }

  const inviteInFlight = inviteFetcher.state !== "idle";
  const removeInFlight = removeFetcher.state !== "idle";
  const updateInFlight = updateFetcher.state !== "idle";
  const removingGrantRefId = removeInFlight
    ? (removeFetcher.formData?.get("accessGrantRefId") as EntityId | undefined)
    : undefined;
  const updatingGrantRefId = updateInFlight
    ? (updateFetcher.formData?.get("accessGrantRefId") as EntityId | undefined)
    : undefined;
  const inviteEnabled =
    props.inputsEnabled && accessStatusIsOwner(props.accessStatus);

  return (
    <>
      <SectionCard
        id={sectionId}
        title="Access"
        actions={
          <Button
            id={`${sectionId}-invite`}
            variant="contained"
            onClick={openInviteDialog}
            disabled={!inviteEnabled}
          >
            Invite
          </Button>
        }
      >
        <Stack spacing={2}>
          {props.owner !== undefined && (
            <EntityAccessSummary owner={props.owner} />
          )}
          <EntityAccessList
            entityType={props.entityType}
            entityRefId={props.entityRefId}
            ownerRefId={props.owner?.ref_id}
            reloadKey={accessListReloadKey}
            removeEnabled={inviteEnabled}
            removeInFlight={removeInFlight}
            removingGrantRefId={removingGrantRefId}
            onRemoveGrant={handleRemoveGrant}
            updateEnabled={inviteEnabled}
            updateInFlight={updateInFlight}
            updatingGrantRefId={updatingGrantRefId}
            onUpdateGrant={handleUpdateGrant}
          />
          <GlobalError
            actionResult={
              removeFetcher.data as ActionResult<unknown> | undefined
            }
          />
          <GlobalError
            actionResult={
              updateFetcher.data as ActionResult<unknown> | undefined
            }
          />
        </Stack>
      </SectionCard>

      <Dialog
        open={inviteDialogOpen}
        onClose={closeInviteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Invite Users</DialogTitle>
        <DialogContent>
          <Stack
            id={`${sectionId}-invite-form`}
            component="form"
            spacing={2}
            sx={{ pt: 1 }}
          >
            <GlobalError
              actionResult={
                inviteFetcher.data as ActionResult<unknown> | undefined
              }
            />
            <SearchForUserWidget
              value={selectedUsers}
              onChange={setSelectedUsers}
              searchUsers={searchUsers}
              inputsEnabled={inviteEnabled && !inviteInFlight}
              label="Search by name or email"
              aloneOnLine
            />
            <AccessLevelSelect
              key={inviteDialogKey}
              name="accessLevel"
              defaultValue={AccessLevel.READER}
              inputsEnabled={inviteEnabled && !inviteInFlight}
              forSharing
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInviteDialog} disabled={inviteInFlight}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleInvite}
            disabled={
              !inviteEnabled || selectedUsers.length === 0 || inviteInFlight
            }
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
