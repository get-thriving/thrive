import { Box, CircularProgress, Stack } from "@mui/material";
import type {
  HistoryEntry,
  User,
  EntityId,
  NamedEntityTag,
} from "@jupiter/webapi-client";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { EntityEventList } from "#/core/infra/component/layout/entity-event-list";

interface HistoryFetcherData {
  entries: HistoryEntry[];
  users: User[];
}

interface EntityMutationHistoryPanelProps {
  entityType: NamedEntityTag;
  entityRefId: EntityId;
}

export function EntityMutationHistoryPanel(
  props: EntityMutationHistoryPanelProps,
) {
  const fetcher = useFetcher<HistoryFetcherData>();

  useEffect(() => {
    const params = new URLSearchParams({
      entityType: props.entityType,
      entityRefId: props.entityRefId,
    });
    fetcher.load(
      `/app/workspace/infra/entity-mutation-history?${params.toString()}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.entityType, props.entityRefId]);

  if (fetcher.state === "loading" && !fetcher.data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!fetcher.data) {
    return null;
  }

  const { entries, users } = fetcher.data;

  const usersById = Object.fromEntries(users.map((u) => [u.ref_id, u]));

  return (
    <Stack spacing={2}>
      <EntityEventList
        entries={entries.map((e) => ({
          mutation_id: e.mutation_id,
          entity_name: e.entity_name ?? e.event_name,
          mutation_name: e.mutation_name,
          event_kind: e.event_kind,
          event_name: e.event_name,
          timestamp: e.timestamp,
          source: e.source,
          user_ref_id: e.user_ref_id,
          entity_version: e.entity_version,
          data: e.data ?? "",
        }))}
        usersById={usersById}
        emptyMessage="No history entries found."
      />

      <Box sx={{ height: "4rem" }} />
    </Stack>
  );
}
