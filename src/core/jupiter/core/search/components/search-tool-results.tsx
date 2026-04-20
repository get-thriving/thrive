import type { SearchResult } from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";

import { SearchMatchLink } from "#/core/common/component/search-link";
import { EntityCard } from "#/core/infra/component/entity-card";
import { EntityStack2 } from "#/core/infra/component/entity-stack";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

export interface SearchToolResultsProps {
  topLevelInfo: TopLevelInfo;
  result: SearchResult;
  limitAsked: number;
  /** When set, invoked when the user activates a result link (e.g. to close instant search). */
  onNavigateFromResult?: () => void;
}

export function SearchToolResults(props: SearchToolResultsProps) {
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
        <Typography>
          Showing {props.result.matches.length} results out of{" "}
          {props.limitAsked} asked
        </Typography>
        {props.result.matches.map((match) => {
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
