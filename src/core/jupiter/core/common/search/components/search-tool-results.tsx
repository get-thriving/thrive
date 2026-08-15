import type { SearchResult } from "@jupiter/webapi-client";
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

import { SearchMatchLink } from "#/core/common/component/search-link";
import { EntityCard } from "#/core/infra/component/entity-card";
import { EntityStack2 } from "#/core/infra/component/entity-stack";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

export interface SearchToolResultsProps {
  topLevelInfo: TopLevelInfo;
  result: SearchResult;
  pageSize: number;
  resultOffset: number;
  onResultOffsetChange: (offset: number) => void;
  /** When set, invoked when the user activates a result link (e.g. to close instant search). */
  onNavigateFromResult?: () => void;
}

export function SearchToolResults(props: SearchToolResultsProps) {
  const { total_match_count: totalMatchCount, matches } = props.result;
  const startIdx = props.resultOffset + 1;
  const endIdx = props.resultOffset + matches.length;
  const summaryLine =
    matches.length === 0
      ? `No matches (${totalMatchCount} total).`
      : totalMatchCount > 0
        ? `Showing ${startIdx}–${endIdx} of ${totalMatchCount} matches`
        : `Showing ${matches.length} matches`;

  return (
    <Box
      sx={{ width: "100%" }}
      onClickCapture={(e) => {
        if (props.onNavigateFromResult === undefined) {
          return;
        }
        const t = e.target as HTMLElement | null;
        if (t?.closest("a[href]")) {
          props.onNavigateFromResult();
        }
      }}
    >
      <EntityStack2>
        <Stack spacing={1}>
          <Typography>{summaryLine}</Typography>
          <SearchResultPages
            totalMatchCount={totalMatchCount}
            pageSize={props.pageSize}
            offset={props.resultOffset}
            onOffsetChange={props.onResultOffsetChange}
          />
        </Stack>
        {matches.map((match) => {
          return (
            <EntityCard
              showAsArchived={match.summary.archived}
              key={`${match.summary.entity_tag}:${match.summary.ref_id}`}
            >
              <SearchMatchLink today={props.topLevelInfo.today} match={match} />
            </EntityCard>
          );
        })}
      </EntityStack2>
    </Box>
  );
}

function SearchResultPages(props: {
  totalMatchCount: number;
  pageSize: number;
  offset: number;
  onOffsetChange: (offset: number) => void;
}) {
  const pageSize = Math.max(1, props.pageSize);
  const pageCount = Math.max(1, Math.ceil(props.totalMatchCount / pageSize));
  if (pageCount <= 1) {
    return null;
  }

  const currentPage = Math.floor(props.offset / pageSize);

  const shouldShowPage = Array<boolean>(pageCount).fill(false);
  shouldShowPage[0] = true;
  shouldShowPage[pageCount - 1] = true;
  if (currentPage - 3 >= 0) shouldShowPage[currentPage - 3] = true;
  if (currentPage - 2 >= 0) shouldShowPage[currentPage - 2] = true;
  if (currentPage - 1 >= 0) shouldShowPage[currentPage - 1] = true;
  shouldShowPage[currentPage] = true;
  if (currentPage + 1 < pageCount) shouldShowPage[currentPage + 1] = true;
  if (currentPage + 2 < pageCount) shouldShowPage[currentPage + 2] = true;
  if (currentPage + 3 < pageCount) shouldShowPage[currentPage + 3] = true;

  const buttons: ReactNode[] = [];
  for (let i = 0; i < pageCount; i++) {
    if (shouldShowPage[i]) {
      buttons.push(
        <ToggleButton key={i + 1} value={i}>
          {i + 1}
        </ToggleButton>,
      );
    } else if (i > 0 && shouldShowPage[i - 1]) {
      buttons.push(
        <ToggleButton key={`ellipsis-${i}`} value={`ellipsis-${i}`} disabled>
          …
        </ToggleButton>,
      );
    }
  }

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={currentPage}
      onChange={(_, v) => {
        if (typeof v === "number") {
          props.onOffsetChange(v * pageSize);
        }
      }}
      sx={{ flexWrap: "wrap", alignSelf: "flex-start" }}
    >
      {buttons}
    </ToggleButtonGroup>
  );
}
