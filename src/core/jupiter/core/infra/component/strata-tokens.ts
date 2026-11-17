/**
 * Strata design tokens — taken from the Strata artboards (see ../design).
 *
 * Strata has a dark palette, which it was designed in, and a light one, which
 * keeps the same roles and the same amber accent. `strataColors` is what
 * components use: the name of a CSS variable, whichever palette is on, set by
 * `StrataColorVariables`. The values themselves are in `strataPalettes`, for
 * what needs a real color (the MUI palette, which works its shades out).
 *
 * `buildStrataTheme` (strata-theme.ts) feeds these into the MUI theme. Components
 * reference them through the theme rather than hard-coding hex.
 */

const strataPaletteDark = {
  // Surfaces, darkest to lightest
  ground: "#0E1012", // app background, leaf / leaflet columns
  column: "#121518", // trunk column, side panels
  panel: "#15191D", // branch column, inputs, command bar
  raised: "#1C2126", // avatars, small raised buttons, skipped cells

  // Lines
  line: "#262B31", // column borders, header/footer borders
  lineStrong: "#2F353C", // chip and kbd outlines, input borders
  rowDivider: "#1E2328", // between list rows
  rowDividerFaint: "#171B1F",

  // Text, strongest to faintest
  textStrong: "#FFFFFF", // selected row text only
  text: "#E7E9EB", // body text
  textSecondary: "#C9CED3", // list items in non-focused columns
  textMuted: "#9BA4AD", // secondary values, path segments
  textFaint: "#7D868F", // mono labels, meta
  textFaintest: "#6B747D", // section labels, inactive path separators
  disabled: "#4A525A", // empty checkbox outline, unscheduled

  // Accent — the only accent. Selection, focus, "now", primary action.
  amber: "#F0B43C",
  amberHover: "#F6CB73",
  amberTint: "rgba(240,180,60,0.13)", // selected row / focused column background
  amberTintStrong: "rgba(240,180,60,0.14)", // active rail item, status chip
  amberLine: "rgba(240,180,60,0.42)", // top line of the columns of the focused subject
  amberTintChanged: "rgba(240,180,60,0.07)", // changed (unsaved) form row

  // Status
  teal: "#4FB3A4", // done, saved, synced, streak hit
  tealText: "#7FCABE", // habit blocks on calendar
  tealTint: "rgba(79,179,164,0.16)",
  coral: "#E5706B", // late, at risk, missed (text)
  missed: "#6B3431", // missed cell in streak grids
  dangerBorder: "#5A2E2D", // archive button outline
} as const;

/** The names of the colors, which both palettes have. */
export type StrataColorName = keyof typeof strataPaletteDark;
type StrataPalette = Record<StrataColorName, string>;

/** The same roles, for a light surface: the amber is deeper to stay readable. */
const strataPaletteLight: StrataPalette = {
  // Surfaces, darkest to lightest
  ground: "#F1EFEB",
  column: "#F6F4F0",
  panel: "#FFFFFF",
  raised: "#E6E2DB",

  // Lines
  line: "#DAD6CE",
  lineStrong: "#C6C1B7",
  rowDivider: "#E5E1DA",
  rowDividerFaint: "#EEEBE5",

  // Text, strongest to faintest
  textStrong: "#0B0D0F",
  text: "#1D2125",
  textSecondary: "#3B4249",
  textMuted: "#5B646D",
  textFaint: "#69727B",
  textFaintest: "#7B848D",
  disabled: "#B4BAC0",

  // Accent
  amber: "#B97A00",
  amberHover: "#9A6500",
  amberTint: "rgba(185,122,0,0.13)",
  amberTintStrong: "rgba(185,122,0,0.15)",
  amberLine: "rgba(185,122,0,0.45)",
  amberTintChanged: "rgba(185,122,0,0.08)",

  // Status
  teal: "#1F8A7A",
  tealText: "#1A7466",
  tealTint: "rgba(31,138,122,0.14)",
  coral: "#C8453F",
  missed: "#E8B3B0",
  dangerBorder: "#E3A9A6",
};

/** The two color schemes Strata has. */
export type StrataColorScheme = "dark" | "light";

/** The real values of each palette. */
export const strataPalettes: Record<StrataColorScheme, StrataPalette> = {
  dark: strataPaletteDark,
  light: strataPaletteLight,
};

function cssVariableName(name: string): string {
  return `--strata-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/**
 * What a component uses for a color: the CSS variable of it, so the colors
 * change with the scheme without the component knowing which is on.
 */
export const strataColors = Object.fromEntries(
  Object.keys(strataPaletteDark).map((name) => [
    name,
    `var(${cssVariableName(name)})`,
  ]),
) as StrataPalette;

/** The CSS that sets the variables for both schemes, on the `<html>` element. */
export function strataColorVariablesCss(): string {
  const rules = (scheme: StrataColorScheme) =>
    Object.entries(strataPalettes[scheme])
      .map(([name, value]) => `${cssVariableName(name)}:${value};`)
      .join("") + `color-scheme:${scheme};`;
  return (
    `:root,:root[data-color-scheme="dark"]{${rules("dark")}}` +
    `:root[data-color-scheme="light"]{${rules("light")}}`
  );
}

export const strataFonts = {
  // Self-host these (fontsource), like Inter/Fraunces today — no Google Fonts,
  // so self-hosted instances keep working offline.
  sans: '"IBM Plex Sans", system-ui, sans-serif', // @fontsource/ibm-plex-sans 400, 500, 600 (+400 italic for the motto)
  mono: '"IBM Plex Mono", ui-monospace, monospace', // @fontsource/ibm-plex-mono 400, 500
  serif: '"IBM Plex Serif", Georgia, serif', // @fontsource/ibm-plex-serif 400, 500 — doc titles/headings only
} as const;

/** Type scale. `size/lineHeight` in px. */
export const strataType = {
  pageTitle: { family: "sans", size: 32, lineHeight: 38, weight: 600 }, // tokens board only
  docTitle: { family: "serif", size: 32, lineHeight: 38, weight: 500 },
  entityTitle: { family: "sans", size: 20, lineHeight: 26, weight: 600 }, // leaf header (e.g. "Write migration guide")
  columnTitle: { family: "sans", size: 18, lineHeight: 24, weight: 600 }, // branch header (e.g. "Ship Thrive 1.0")
  docHeading: { family: "serif", size: 20, lineHeight: 28, weight: 500 },
  docBody: { family: "sans", size: 15, lineHeight: 25, weight: 400 },
  body: { family: "sans", size: 13, lineHeight: 20, weight: 400 }, // default UI text, list rows
  bodyStrong: { family: "sans", size: 13, lineHeight: 20, weight: 600 }, // group rows
  metric: { family: "sans", size: 20, lineHeight: 26, weight: 600 }, // stat tiles
  path: { family: "mono", size: 12, lineHeight: 16, weight: 400 }, // breadcrumb path, values in forms
  meta: { family: "mono", size: 11, lineHeight: 16, weight: 400 }, // dates, counts, ids
  label: {
    family: "mono",
    size: 11,
    lineHeight: 16,
    weight: 400,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  }, // column labels
  sectionLabel: {
    family: "mono",
    size: 13,
    lineHeight: 18,
    weight: 400,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  }, // section labels inside a panel, a step above the column labels
  kbd: { family: "mono", size: 11, lineHeight: 16, weight: 400 },
} as const;

/** 4px grid. */
export const strataSpace = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;

export const strataRadius = {
  default: 4, // inputs, buttons, tiles, column-header buttons
  small: 3, // chips, kbd, checkboxes
  pill: 999, // not used — Strata has no pills
} as const;

/** Fixed heights, in px. Density is the point of Strata — keep these exact. */
export const strataSize = {
  topBar: 44,
  columnHeader: 36,
  filterRow: 36,
  sectionHeader: 30, // a section's title row inside a column
  rowDense: 26, // nested items, generated tasks
  row: 28, // default list row
  rowComfortable: 30, // trunk lists
  formRow: 38, // label | control rows in editors
  control: 32, // inputs, selects, buttons and segmented options
  controlSmall: 26, // small buttons and options
  controlLarge: 38, // large buttons
  footer: 28, // key hints
  rail: 52, // icon rail width
  railExpanded: 176, // rail with labels, when the user expands it
  railButton: 36,
  commandBar: { width: 340, height: 30 },
  checkbox: 12,
  touchRowPhone: 48, // phone list rows
} as const;

/** Patterns that repeat across screens. */
export const strataPatterns = {
  selectedRow: {
    background: strataColors.amberTint,
    color: strataColors.textStrong,
  },
  focusedColumn: { borderColor: strataColors.amber }, // e.g. "MUST DO" tile underline
  chipOutline: {
    border: `1px solid ${strataColors.lineStrong}`,
    radius: 3,
    padding: "1px 6px",
    font: "meta",
  },
  chipStatus: {
    background: strataColors.amberTintStrong,
    color: strataColors.amber,
    radius: 3,
  },
  segmentedOn: {
    background: strataColors.amber,
    color: strataColors.ground,
    border: `1px solid ${strataColors.amber}`,
  },
  segmentedOff: {
    background: "transparent",
    color: strataColors.textMuted,
    border: `1px solid ${strataColors.lineStrong}`,
  },
  addSlot: {
    border: `1px dashed ${strataColors.lineStrong}`,
    color: strataColors.textFaintest,
  }, // "+ tag", "+ create note"
  kbd: {
    border: `1px solid ${strataColors.lineStrong}`,
    radius: 3,
    padding: "0 5px",
    color: strataColors.textSecondary,
  },
  streakCell: {
    done: strataColors.teal,
    missed: strataColors.missed,
    skipped: strataColors.raised,
    today: `1px solid ${strataColors.amber}`,
  },
  checkboxGlyphs: { done: "[x]", open: "[ ]", working: "[~]", missed: "[-]" }, // mono text checkboxes in nested lists
} as const;

/** Suggested MUI palette mapping, for a scheme. It needs the real colors. */
export function strataMuiPalette(scheme: StrataColorScheme) {
  const c = strataPalettes[scheme];
  return {
    mode: scheme,
    background: { default: c.ground, paper: c.panel },
    primary: { main: c.amber, contrastText: c.ground },
    secondary: { main: c.teal, contrastText: c.ground },
    success: { main: c.teal },
    error: { main: c.coral },
    warning: { main: c.amber },
    divider: c.line,
    text: {
      primary: c.text,
      secondary: c.textMuted,
      disabled: c.disabled,
    },
    action: {
      selected: c.amberTint,
      hover:
        scheme === "dark" ? "rgba(231,233,235,0.04)" : "rgba(29,33,37,0.05)",
    },
  } as const;
}
