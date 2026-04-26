import type { EntityId, Tag } from "@jupiter/webapi-client";
import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo } from "react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";

export interface TagsFilterPickerProps {
  allTags: Array<Tag>;
  value: Array<EntityId>;
  onChange: (next: Array<EntityId>) => void;
  inputsEnabled: boolean;
  label?: ReactNode;
  aloneOnLine?: boolean;
  size?: "small" | "medium";
}

/** Multiselect tag names → ref ids for local filter state (no persistence). */
export function TagsFilterPicker({
  allTags,
  value,
  onChange,
  inputsEnabled,
  label,
  aloneOnLine = false,
  size = "medium",
}: TagsFilterPickerProps) {
  const isBigScreen = useBigScreen();

  const allTagsAsOptions = useMemo(
    () => allTags.map((tag) => tag.name),
    [allTags],
  );

  const tagsByRefId = useMemo(() => {
    const result: Record<string, Tag> = {};
    for (const tag of allTags) {
      result[tag.ref_id] = tag;
    }
    return result;
  }, [allTags]);

  const selectedNames = useMemo(
    () =>
      value
        .map((tid) => tagsByRefId[tid]?.name)
        .filter((t): t is string => Boolean(t)),
    [tagsByRefId, value],
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Autocomplete
        disablePortal
        multiple
        limitTags={2}
        filterSelectedOptions
        freeSolo={false}
        options={allTagsAsOptions}
        readOnly={!inputsEnabled}
        disableCloseOnSelect
        value={selectedNames}
        onChange={(_event, newNames: string[]) => {
          const next = newNames
            .map((n) => allTags.find((t) => t.name === n)?.ref_id)
            .filter((id): id is EntityId => Boolean(id));
          onChange(next);
        }}
        renderOption={(liProps, option, { selected }) => (
          <li {...liProps}>
            <Checkbox
              style={{ marginRight: 8, padding: 0 }}
              checked={selected}
              tabIndex={-1}
              disableRipple
            />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={label ?? "Tags"} size={size} />
        )}
        sx={{
          maxWidth: aloneOnLine ? "100%" : "14rem",
          minWidth: isBigScreen ? "8rem" : "4rem",
          "& .MuiAutocomplete-inputRoot": {
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            alignItems: "center",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
          "& .MuiAutocomplete-tag": {
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiAutocomplete-input": {
            minWidth: 60,
            flexGrow: 1,
          },
        }}
      />
    </Box>
  );
}
