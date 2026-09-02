import type { AutocompleteRenderGetTagProps } from "@mui/material";
import { Box, Chip } from "@mui/material";

/** Always show this many selected chips, even while the field is focused. */
export const LIMITED_AUTOCOMPLETE_TAG_COUNT = 1;

/**
 * MUI Autocomplete's `limitTags` is ignored while focused, which makes
 * multi-selects grow and overlap siblings. This renderer always keeps one
 * chip and collapses the rest into "+N".
 */
export function renderLimitedAutocompleteTags<T>(
  getLabel?: (option: T) => string,
) {
  const labelOf = getLabel ?? ((option: T) => String(option));
  function LimitedAutocompleteTags(
    value: T[],
    getTagProps: AutocompleteRenderGetTagProps,
  ) {
    if (value.length === 0) {
      return null;
    }

    const extra = value.length - LIMITED_AUTOCOMPLETE_TAG_COUNT;
    const visible = value.slice(0, LIMITED_AUTOCOMPLETE_TAG_COUNT);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: 0,
          maxWidth: "100%",
        }}
      >
        {visible.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              size="small"
              label={labelOf(option)}
              {...tagProps}
              sx={{
                maxWidth: "7rem",
                minWidth: 0,
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          );
        })}
        {extra > 0 && (
          <Box
            component="span"
            sx={{
              typography: "caption",
              color: "text.secondary",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            +{extra}
          </Box>
        )}
      </Box>
    );
  }
  return LimitedAutocompleteTags;
}
