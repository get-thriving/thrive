export const autocompleteSingleLineSx = {
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
} as const;

/** Compact field used for tags/contacts/locations sitting in a row. */
export function entityLinkAutocompleteSx(aloneOnLine: boolean) {
  return {
    width: "100%",
    minWidth: 0,
    maxWidth: aloneOnLine ? "100%" : "14rem",
    "& .MuiAutocomplete-inputRoot": {
      flexWrap: "nowrap" as const,
      overflow: "hidden",
      alignItems: "center",
    },
    "& .MuiAutocomplete-tag": {
      maxWidth: "7rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    "& .MuiAutocomplete-input": {
      minWidth: "2rem",
      flexGrow: 1,
    },
  };
}

/** Lets a tags/contacts/locations field shrink instead of overlapping siblings. */
export const entityLinkSelectRootSx = {
  position: "relative",
  minWidth: 0,
  flex: 1,
  width: "100%",
} as const;
