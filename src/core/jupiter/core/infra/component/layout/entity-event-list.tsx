import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import { DateTime } from "luxon";
import { useState } from "react";

export interface EntityEventEntryData {
  mutation_id?: string;
  entity_name: string;
  mutation_name?: string;
  event_kind: string;
  event_name: string;
  timestamp: string;
  source: string;
  user_ref_id: string;
  entity_version: number;
  data: string;
}

export interface EntityEventUser {
  ref_id: string;
  name: string;
}

function eventKindVerb(kind: string): string {
  switch (kind) {
    case "Created":
      return "created";
    case "Updated":
      return "updated";
    case "Archived":
      return "archived";
    case "Removed":
      return "removed";
    default:
      return kind.toLowerCase();
  }
}

function stripUseCaseSuffix(name: string): string {
  return name.replace(/UseCase$/, "");
}

interface EntityEventRowProps {
  entry: EntityEventEntryData;
  user: EntityEventUser | undefined;
}

export function EntityEventRow({ entry, user }: EntityEventRowProps) {
  const [showData, setShowData] = useState(false);
  const formattedTimestamp = DateTime.fromISO(entry.timestamp).toLocaleString(
    DateTime.DATETIME_MED,
  );
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
        <strong>{entry.entity_name ?? entry.event_name}</strong>
        {entry.mutation_name && (
          <>
            {" "}
            in mutation{" "}
            {entry.mutation_id ? (
              <Link
                to={`/app/workspace/mutation-history/${entry.mutation_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <em style={{ textDecoration: "underline" }}>
                  {stripUseCaseSuffix(entry.mutation_name)}
                </em>
              </Link>
            ) : (
              <em>{stripUseCaseSuffix(entry.mutation_name)}</em>
            )}
          </>
        )}
        {"::"}
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
          {entry.data}
        </Box>
      </Collapse>
    </Box>
  );
}

interface EntityEventListProps {
  entries: EntityEventEntryData[];
  usersById: Record<string, EntityEventUser>;
  emptyMessage?: string;
}

export function EntityEventList({
  entries,
  usersById,
  emptyMessage = "No events found.",
}: EntityEventListProps) {
  return (
    <Stack spacing={2}>
      {entries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      )}

      {entries.map((entry, idx) => (
        <EntityEventRow
          key={idx}
          entry={entry}
          user={usersById[entry.user_ref_id]}
        />
      ))}
    </Stack>
  );
}
