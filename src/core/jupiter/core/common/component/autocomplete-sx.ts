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
