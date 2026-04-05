import {
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { HistoryEntry, User } from "@jupiter/webapi-client";
import { useFetcher } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import type { EntityId, NamedEntityTag } from "@jupiter/webapi-client";

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
      <Typography variant="h6">Entity History</Typography>

      <HistoryPages
        currentPage={currentPage}
        totalCnt={totalCnt}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {entries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No history entries found.
        </Typography>
      )}

      {entries.map((entry, idx) => (
        <HistoryEntryRow
          key={idx}
          entry={entry}
          user={usersById[entry.user_ref_id]}
        />
      ))}

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

function eventKindVerb(kind: string): string {
  switch (kind) {
    case "Created":
      return "created";
    case "Updated":
      return "updated";
    case "Archived":
      return "archived";
    default:
      return kind.toLowerCase();
  }
}

interface HistoryEntryRowProps {
  entry: HistoryEntry;
  user: User | undefined;
}

function stripUseCaseSuffix(name: string): string {
  return name.replace(/UseCase$/, "");
}

function HistoryEntryRow({ entry, user }: HistoryEntryRowProps) {
  const [showData, setShowData] = useState(false);
  const formattedTimestamp = DateTime.fromISO(entry.timestamp).toLocaleString(
    DateTime.DATETIME_MED,
  );
  const mutationName = stripUseCaseSuffix(entry.mutation_name);
  const userName = user?.name ?? "Unknown";

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2">
        <strong>{userName}</strong> {eventKindVerb(entry.event_kind)}{" "}
        <strong>{(entry as HistoryEntry & { entity_name?: string }).entity_name ?? entry.event_name}</strong>
        {" "}in mutation <em>{mutationName}</em>{"::"}
        <em>{entry.event_name}</em>
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {formattedTimestamp} &middot; v{entry.entity_version} &middot;{" "}
          {entry.source}
        </Typography>
        <IconButton size="small" onClick={() => setShowData((s) => !s)}>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transform: showData ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </IconButton>
      </Box>
      <Collapse in={showData}>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
            fontSize: "0.75rem",
            overflow: "auto",
            maxHeight: "300px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {(entry as HistoryEntry & { data?: string }).data}
        </Box>
      </Collapse>
    </Box>
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
