import {
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type {
  HistoryEntry,
  User,
  EntityId,
  NamedEntityTag,
} from "@jupiter/webapi-client";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

import { EntityEventList } from "#/core/infra/component/layout/entity-event-list";

interface HistoryFetcherData {
  entries: HistoryEntry[];
  users: User[];
  totalCnt: number;
  pageSize: number;
}

interface EntityMutationHistoryPanelProps {
  entityType: NamedEntityTag;
  entityRefId: EntityId;
}

export function EntityMutationHistoryPanel(
  props: EntityMutationHistoryPanelProps,
) {
  const fetcher = useFetcher<HistoryFetcherData>();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({
      entityType: props.entityType,
      entityRefId: props.entityRefId,
    });
    if (currentPage > 0) {
      params.set(
        "retrieveOffset",
        (currentPage * (fetcher.data?.pageSize ?? 50)).toString(),
      );
    }
    fetcher.load(
      `/app/workspace/infra/entity-mutation-history?${params.toString()}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.entityType, props.entityRefId, currentPage]);

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

  const { entries, users, totalCnt, pageSize } = fetcher.data;

  const usersById = Object.fromEntries(users.map((u) => [u.ref_id, u]));

  return (
    <Stack spacing={2}>
      <HistoryPages
        currentPage={currentPage}
        totalCnt={totalCnt}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

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

      {entries.length > 0 && (
        <HistoryPages
          currentPage={currentPage}
          totalCnt={totalCnt}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      <Box sx={{ height: "4rem" }} />
    </Stack>
  );
}

interface HistoryPagesProps {
  currentPage: number;
  totalCnt: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function HistoryPages(props: HistoryPagesProps) {
  const pageCount = Math.ceil(props.totalCnt / props.pageSize);

  if (pageCount <= 1) {
    return null;
  }

  const shouldShowPage = Array(pageCount).fill(false);
  shouldShowPage[0] = true;
  shouldShowPage[pageCount - 1] = true;

  for (let delta = -3; delta <= 3; delta++) {
    const idx = props.currentPage + delta;
    if (idx >= 0 && idx < pageCount) {
      shouldShowPage[idx] = true;
    }
  }

  const buttons = [];
  for (let i = 0; i < pageCount; i++) {
    if (shouldShowPage[i]) {
      buttons.push(
        <ToggleButton
          key={i + 1}
          value={i}
          onClick={() => props.onPageChange(i)}
        >
          {i + 1}
        </ToggleButton>,
      );
    } else if (i > 0 && shouldShowPage[i - 1]) {
      buttons.push(
        <ToggleButton key={`ellipsis-${i}`} value="ellipsis" disabled>
          ...
        </ToggleButton>,
      );
    }
  }

  return (
    <ToggleButtonGroup
      size="small"
      value={props.currentPage}
      exclusive
      sx={{ alignSelf: "center" }}
    >
      {buttons}
    </ToggleButtonGroup>
  );
}
