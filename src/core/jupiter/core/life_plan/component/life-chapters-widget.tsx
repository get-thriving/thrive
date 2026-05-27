import { Box, Chip, Stack, Typography } from "@mui/material";
import { Link } from "@remix-run/react";

import { WidgetProps } from "#/core/home/component/common";

export function LifeChaptersWidget(props: WidgetProps) {
  const { activeChapters, aspectsByRefId } = props;

  const sortedChapters = activeChapters
    ? [...activeChapters].sort((a, b) => {
        const aspectNameA = aspectsByRefId?.[a.aspect_ref_id]?.name ?? "";
        const aspectNameB = aspectsByRefId?.[b.aspect_ref_id]?.name ?? "";
        return aspectNameA.localeCompare(aspectNameB);
      })
    : undefined;

  return (
    <Stack
      direction="column"
      sx={{ width: "100%", height: "100%", gap: 1, overflow: "hidden" }}
    >
      <Typography
        variant="h6"
        sx={{ fontSize: "0.9rem", fontWeight: "bold", flexShrink: 0 }}
      >
        Active Chapters
      </Typography>

      {(!sortedChapters || sortedChapters.length === 0) && (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: "0.75rem" }}
        >
          No active chapters right now.
        </Typography>
      )}

      {sortedChapters && sortedChapters.length > 0 && (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Stack direction="column" gap={0.5}>
            {sortedChapters.map((chapter) => {
              const aspectName = aspectsByRefId?.[chapter.aspect_ref_id]?.name;
              const label = aspectName
                ? `📖 ${aspectName} / ${chapter.name}`
                : `📖 ${chapter.name}`;
              return (
                <Chip
                  key={chapter.ref_id}
                  label={label}
                  size="small"
                  component={Link}
                  to={`/app/workspace/life-plan/chapters/${chapter.ref_id}`}
                  clickable
                  sx={{ justifyContent: "flex-start", fontSize: "0.75rem" }}
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
