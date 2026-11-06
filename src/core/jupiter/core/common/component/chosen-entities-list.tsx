import type { EntityId } from "@jupiter/webapi-client";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface ChosenEntity {
  refId: EntityId;
  name: string;
  /** Anything to show after the name, such as a tag. */
  tag?: ReactNode;
}

interface ChosenEntitiesListProps {
  entities: ChosenEntity[];
  /**
   * Pass this when the order of the list means something. The entities get
   * numbered, and arrows to move them. Without it the list is just a set, and
   * shows neither.
   */
  onMove?: (index: number, delta: -1 | 1) => void;
  onRemove: (refId: EntityId) => void;
  inputsEnabled: boolean;
  emptyMessage: string;
}

/** The entities picked so far, each with a way to take it out again. */
export function ChosenEntitiesList(props: ChosenEntitiesListProps) {
  if (props.entities.length === 0) {
    return <Typography color="text.secondary">{props.emptyMessage}</Typography>;
  }

  return (
    <Stack spacing={0.5} component="ol" sx={{ margin: 0, padding: 0 }}>
      {props.entities.map((entity, index) => (
        <Box
          key={entity.refId}
          component="li"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            listStyle: "none",
          }}
        >
          {props.onMove && (
            <Typography
              color="text.secondary"
              sx={{ minWidth: "1.5rem", textAlign: "right" }}
            >
              {index + 1}.
            </Typography>
          )}
          <Typography noWrap sx={{ flex: 1, minWidth: 0 }}>
            {entity.name}
          </Typography>
          {entity.tag}
          {props.onMove && (
            <>
              <IconButton
                size="small"
                aria-label={`Move ${entity.name} up`}
                disabled={!props.inputsEnabled || index === 0}
                onClick={() => props.onMove!(index, -1)}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label={`Move ${entity.name} down`}
                disabled={
                  !props.inputsEnabled || index === props.entities.length - 1
                }
                onClick={() => props.onMove!(index, 1)}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
            </>
          )}
          <IconButton
            size="small"
            aria-label={`Remove ${entity.name}`}
            disabled={!props.inputsEnabled}
            onClick={() => props.onRemove(entity.refId)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Stack>
  );
}
