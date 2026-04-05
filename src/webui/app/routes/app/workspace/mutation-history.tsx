import {
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Link, Outlet, useSearchParams } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const url = new URL(request.url);
  const retrieveOffset = url.searchParams.get("offset");
  const retrieveLimit = url.searchParams.get("limit");

  const result = await apiClient.infra.getMutationInvocationHistory({
    retrieve_offset: retrieveOffset ? parseInt(retrieveOffset, 10) : undefined,
    retrieve_limit: retrieveLimit ? parseInt(retrieveLimit, 10) : undefined,
  });

  return json({
    entries: result.entries,
    users: result.users,
    totalCnt: result.total_cnt,
    pageSize: result.page_size,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

interface InvocationEntry {
  mutation_id: string;
  mutation_name: string;
  timestamp: string;
  source: string;
  user_ref_id: string;
  result: string;
  args_str: string;
  error_str?: string | null;
}

interface InvocationUser {
  ref_id: string;
  name: string;
}

function stripUseCaseSuffix(name: string): string {
  return name.replace(/UseCase$/, "");
}

function resultColor(result: string): "success" | "error" | "default" {
  switch (result) {
    case "success":
      return "success";
    case "failure":
      return "error";
    default:
      return "default";
  }
}

export default function MutationHistory() {
  const { entries, users, totalCnt, pageSize } =
    useLoaderDataSafeForAnimation<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const usersById = Object.fromEntries(
    (users as InvocationUser[]).map((u) => [u.ref_id, u]),
  );

  const currentPage = Math.floor(
    parseInt(searchParams.get("offset") ?? "0", 10) / pageSize,
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      if (page === 0) {
        newParams.delete("offset");
      } else {
        newParams.set("offset", (page * pageSize).toString());
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, pageSize],
  );

  return (
    <TrunkPanel
      key="mutation-history"
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        <Stack spacing={2}>
          <PaginationControls
            currentPage={currentPage}
            totalCnt={totalCnt}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />

          {(entries as InvocationEntry[]).length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No mutation invocations found.
            </Typography>
          )}

          {(entries as InvocationEntry[]).map((entry, idx) => (
            <InvocationRow
              key={idx}
              entry={entry}
              user={usersById[entry.user_ref_id]}
            />
          ))}

          {(entries as InvocationEntry[]).length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalCnt={totalCnt}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          )}

          <Box sx={{ height: "4rem" }} />
        </Stack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

function InvocationRow({
  entry,
  user,
}: {
  entry: InvocationEntry;
  user: InvocationUser | undefined;
}) {
  const [showArgs, setShowArgs] = useState(false);
  const [showError, setShowError] = useState(false);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2">
          <strong>{userName}</strong>{" "}ran{" "}
          <Link
            to={`/app/workspace/mutation-history/${entry.mutation_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <strong style={{ textDecoration: "underline" }}>{mutationName}</strong>
          </Link>
        </Typography>
        <Chip
          label={entry.result}
          color={resultColor(entry.result)}
          size="small"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {formattedTimestamp} &middot; {entry.source}
        </Typography>
        <IconButton size="small" onClick={() => setShowArgs((s) => !s)}>
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transform: showArgs ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={showArgs}>
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
          {entry.args_str}
        </Box>
      </Collapse>

      {entry.error_str && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <Typography variant="caption" color="error">
              Error
            </Typography>
            <IconButton size="small" onClick={() => setShowError((s) => !s)}>
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: showError ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
          </Box>
          <Collapse in={showError}>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: "error.main",
                color: "error.contrastText",
                fontSize: "0.75rem",
                overflow: "auto",
                maxHeight: "300px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {entry.error_str}
            </Box>
          </Collapse>
        </>
      )}
    </Box>
  );
}

interface PaginationControlsProps {
  currentPage: number;
  totalCnt: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function PaginationControls(props: PaginationControlsProps) {
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

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error loading the mutation history! Please try again!`,
});
