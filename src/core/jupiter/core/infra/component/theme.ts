import { createTheme } from "@mui/material";
import type { PaletteOptions, Theme, ThemeOptions } from "@mui/material";
import type { Shadows } from "@mui/material/styles";

/**
 * The Thrive design tokens and MUI theme.
 *
 * Everything visual that is shared between the workspace, the published pages,
 * and the desktop/mobile shells is decided here rather than per-instance with
 * `sx`. If you find yourself reaching for `sx` to restyle a whole class of
 * component, add an override in `buildComponents` instead.
 */

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Body copy and UI chrome. The first two entries are the self-hosted Inter;
 * everything after is the fallback chain used before the font loads and in
 * environments where it is unavailable.
 */
export const FONT_FAMILY_SANS = [
  '"Inter Variable"',
  '"Inter"',
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(", ");

/**
 * Headings. A serif here is the point - it is what keeps a planning tool from
 * reading like an admin dashboard. The fallbacks are all system serifs that
 * ship on at least one major platform, so headings stay in character even with
 * no webfont at all.
 */
export const FONT_FAMILY_SERIF = [
  '"Fraunces Variable"',
  '"Fraunces"',
  '"Iowan Old Style"',
  '"Palatino Linotype"',
  "Palatino",
  "Georgia",
  '"Times New Roman"',
  "serif",
].join(", ");

/* -------------------------------------------------------------------------- */
/* Color                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A warm neutral ramp. MUI's own greys are blue-tinted and read clinical next
 * to the rose; these are the same lightness steps rotated warm.
 */
const WARM_GREY = {
  50: "#FAF8F7",
  100: "#F4F1EE",
  200: "#EAE5E1",
  300: "#DCD5CF",
  400: "#BFB6AE",
  500: "#9C918A",
  600: "#776C66",
  700: "#574E4A",
  800: "#38312E",
  900: "#1C1A18",
};

/** Clay rose - a muted descendant of the pink in the app icon. */
const ROSE = {
  main: "#B5455F",
  light: "#D07E90",
  dark: "#8A2E45",
};

/** Sage - the cool counterweight, used for accents and positive state. */
const SAGE = {
  main: "#4F6F5E",
  light: "#7C9A89",
  dark: "#35503F",
};

/**
 * The radius a corner tab needs so it sits flush inside a Card instead of
 * spilling past its rounded corner: the card radius less its 1px border.
 */
export const CARD_INNER_CORNER_RADIUS = "9px";

/** Page background outside of any surface. Also painted pre-hydration. */
export const APP_BACKGROUND_LIGHT = "#FCFAF9";
export const APP_BACKGROUND_DARK = "#171513";

const LIGHT_PALETTE: PaletteOptions = {
  mode: "light",
  primary: { ...ROSE, contrastText: "#FFFFFF" },
  secondary: { ...SAGE, contrastText: "#FFFFFF" },
  error: { main: "#B3382F", light: "#D2695F", dark: "#8A241D" },
  warning: { main: "#B5822E", light: "#D6A759", dark: "#8A6017" },
  info: { main: "#3F6D8C", light: "#6E97B3", dark: "#2A4F68" },
  success: { main: "#4C7A5A", light: "#7AA487", dark: "#335840" },
  grey: WARM_GREY,
  divider: "#E3DCD6",
  background: { default: APP_BACKGROUND_LIGHT, paper: "#FFFFFF" },
  text: {
    primary: "#211E1D",
    secondary: "#6B605A",
    disabled: "#A69B94",
  },
  action: {
    hover: "rgba(181, 69, 95, 0.06)",
    selected: "rgba(181, 69, 95, 0.10)",
    focus: "rgba(181, 69, 95, 0.12)",
  },
};

const DARK_PALETTE: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#E28DA0",
    light: "#F2B6C3",
    dark: "#B5455F",
    contrastText: "#2A1418",
  },
  secondary: {
    main: "#8FB09C",
    light: "#B4CCBD",
    dark: "#4F6F5E",
    contrastText: "#16211B",
  },
  error: { main: "#E38B82", light: "#F0B2AC", dark: "#B3382F" },
  warning: { main: "#DFB26A", light: "#EDCE9B", dark: "#B5822E" },
  info: { main: "#87B0C9", light: "#B0CBDC", dark: "#3F6D8C" },
  success: { main: "#8CB79A", light: "#B2D0BB", dark: "#4C7A5A" },
  grey: WARM_GREY,
  divider: "#332E2B",
  background: { default: APP_BACKGROUND_DARK, paper: "#1F1C1A" },
  text: {
    primary: "#F3EEEB",
    secondary: "#B3A79F",
    disabled: "#7A6E67",
  },
  action: {
    hover: "rgba(226, 141, 160, 0.08)",
    selected: "rgba(226, 141, 160, 0.14)",
    focus: "rgba(226, 141, 160, 0.16)",
  },
};

/* -------------------------------------------------------------------------- */
/* Elevation                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * MUI's default shadow stack is what gives every surface the "card floating in
 * space" look. Cards and app chrome here use a hairline border instead (see
 * `buildComponents`); this softer, warm-tinted ramp is only what remains for
 * the things that genuinely float - menus, dialogs, tooltips.
 */
function buildShadows(useNightMode: boolean): Shadows {
  const tint = useNightMode ? "0, 0, 0" : "40, 30, 26";
  const scale = useNightMode ? 1.6 : 1;

  const shadows = ["none"];
  for (let i = 1; i <= 24; i++) {
    const y = Math.round(i * 0.75 + 1);
    const blur = Math.round(i * 1.6 + 4);
    const alpha = Math.min(0.34, (0.03 + i * 0.008) * scale).toFixed(3);
    const ambientAlpha = Math.min(0.2, (0.02 + i * 0.004) * scale).toFixed(3);
    shadows.push(
      `0px ${y}px ${blur}px rgba(${tint}, ${alpha}), ` +
        `0px 1px 2px rgba(${tint}, ${ambientAlpha})`,
    );
  }
  return shadows as unknown as Shadows;
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function buildComponents(): ThemeOptions["components"] {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        // Long-form prose in notes and docs should not run the full width of a
        // wide screen.
        "::selection": {
          backgroundColor: "rgba(181, 69, 95, 0.18)",
        },
      },
    },

    // Surfaces -------------------------------------------------------------
    MuiPaper: {
      styleOverrides: {
        // MUI paints a lightening gradient over dark-mode Paper by default,
        // which fights the warm neutrals.
        root: { backgroundImage: "none" },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          backgroundImage: "none",
        }),
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "1.25rem",
          "&:last-child": { paddingBottom: "1.25rem" },
        },
      },
    },

    MuiCardActions: {
      styleOverrides: {
        root: { padding: "0.75rem 1.25rem 1.25rem" },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { boxShadow: "none", backgroundImage: "none" },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) => ({
          borderRadius: 14,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) => ({
          borderRadius: 10,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) => ({
          borderRadius: 10,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },

    // Controls -------------------------------------------------------------
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          letterSpacing: "0.01em",
          paddingInline: "1.1rem",
        },
        sizeSmall: { paddingInline: "0.75rem" },
        // Colored outlined buttons keep MUI's tinted border - that border is
        // what makes a destructive action read as destructive.
        outlinedInherit: ({ theme }: { theme: Theme }) => ({
          borderColor: theme.palette.divider,
          "&:hover": { borderColor: theme.palette.text.secondary },
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
        notchedOutline: ({ theme }: { theme: Theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: { borderRadius: "8px 8px 0 0" },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, letterSpacing: "0.005em" },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }: { theme: Theme }) => ({
          borderRadius: 6,
          fontSize: "0.75rem",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[800]
              : theme.palette.grey[700],
        }),
      },
    },

    // Navigation -----------------------------------------------------------
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: "2.75rem" },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: "2.75rem",
          letterSpacing: "0.01em",
        },
      },
    },

    MuiLink: {
      defaultProps: { underline: "hover" },
    },

    // Data -----------------------------------------------------------------
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderColor: theme.palette.divider,
        }),
        head: { fontWeight: 600 },
      },
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

export function buildTheme(useNightMode: boolean) {
  return createTheme({
    palette: useNightMode ? DARK_PALETTE : LIGHT_PALETTE,

    shape: { borderRadius: 10 },

    shadows: buildShadows(useNightMode),

    typography: {
      fontFamily: FONT_FAMILY_SANS,

      // h1-h4 are the display sizes - they carry the serif at full strength.
      h1: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "2.75rem",
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.022em",
      },
      h2: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "2.125rem",
        fontWeight: 700,
        lineHeight: 1.18,
        letterSpacing: "-0.018em",
      },
      h3: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "1.75rem",
        fontWeight: 600,
        lineHeight: 1.24,
        letterSpacing: "-0.014em",
      },
      h4: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "1.4375rem",
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      // h5 and h6 are the workhorses - section and card titles throughout the
      // workspace. Kept close to their previous sizes on purpose so the
      // change is in character, not in layout.
      h5: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "1.375rem",
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: "-0.008em",
      },
      h6: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "-0.004em",
      },
      subtitle1: { fontWeight: 500, lineHeight: 1.5 },
      subtitle2: { fontWeight: 600, lineHeight: 1.5, letterSpacing: "0.005em" },
      // Sizes here are MUI's defaults on purpose - the screens were laid out
      // against them. Density comes from the leading, which is tightened for
      // UI rather than prose: the main view is a long list of cards, not an
      // article.
      body1: { fontSize: "1rem", lineHeight: 1.55 },
      body2: { fontSize: "0.875rem", lineHeight: 1.5 },
      button: {
        fontSize: "0.875rem",
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: "0.01em",
      },
      caption: { fontSize: "0.75rem", lineHeight: 1.45 },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
    },

    components: buildComponents(),
  });
}
