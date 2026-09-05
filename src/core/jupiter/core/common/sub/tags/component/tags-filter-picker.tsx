import type { EntityId, Tag } from "@jupiter/webapi-client";
import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo } from "react";

import {
  entityLinkAutocompleteSx,
  entityLinkSelectRootSx,
  renderLimitedAutocompleteTags,
} from "#/core/common/component/autocomplete";

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
    <Box sx={entityLinkSelectRootSx}>
      <Autocomplete
        disablePortal
        multiple
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
        renderTags={renderLimitedAutocompleteTags<string>()}
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
        sx={entityLinkAutocompleteSx(aloneOnLine)}
      />
    </Box>
  );
}
