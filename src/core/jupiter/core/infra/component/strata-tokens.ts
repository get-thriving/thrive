/**
 * Strata design tokens — taken from the Strata artboards (see ../design).
 *
 * Strata is dark-only: turning it on forces night mode. There is no light
 * variant until one is designed.
 *
 * `buildStrataTheme` (strata-theme.ts) feeds these into the MUI theme. Components
 * reference them through the theme rather than hard-coding hex.
 */

export const strataColors = {
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
  amberTintChanged: "rgba(240,180,60,0.07)", // changed (unsaved) form row

  // Status
  teal: "#4FB3A4", // done, saved, synced, streak hit
  tealText: "#7FCABE", // habit blocks on calendar
  tealTint: "rgba(79,179,164,0.16)",
  coral: "#E5706B", // late, at risk, missed (text)
  missed: "#6B3431", // missed cell in streak grids
  dangerBorder: "#5A2E2D", // archive button outline
} as const;

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
  }, // column + section labels
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
  rowDense: 26, // nested items, generated tasks
  row: 28, // default list row
  rowComfortable: 30, // trunk lists
  formRow: 38, // label | control rows in editors
  footer: 28, // key hints
  rail: 52, // icon rail width
  railExpanded: 176, // rail with labels, when the user expands it
  railButton: 36,
  commandBar: { width: 340, height: 30 },
  checkbox: 12,
  touchRowPhone: 48, // phone list rows
} as const;

/**
 * Column widths for the side-by-side layout (replaces the current leaf-panel
 * BIG_SCREEN_WIDTH_SMALL/MEDIUM/LARGE overlay widths when Strata is on).
 */
export const strataColumns = {
  trunk: { min: 210, default: 240, max: 260 },
  branch: { min: 300, default: 340, max: 400 },
  leaf: { min: 360, default: 380, max: 520 },
  leaflet: { min: 280, flex: 1 }, // takes the rest
  spine: 10, // a folded column (phone shows 10px left, 30px right)
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

/** Suggested MUI palette mapping for the dark theme. */
export const strataMuiPaletteDark = {
  mode: "dark",
  background: { default: strataColors.ground, paper: strataColors.panel },
  primary: { main: strataColors.amber, contrastText: strataColors.ground },
  secondary: { main: strataColors.teal, contrastText: strataColors.ground },
  success: { main: strataColors.teal },
  error: { main: strataColors.coral },
  warning: { main: strataColors.amber },
  divider: strataColors.line,
  text: {
    primary: strataColors.text,
    secondary: strataColors.textMuted,
    disabled: strataColors.disabled,
  },
  action: { selected: strataColors.amberTint, hover: "rgba(231,233,235,0.04)" },
} as const;
