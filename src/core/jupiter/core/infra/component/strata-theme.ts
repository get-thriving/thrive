import { createTheme } from "@mui/material";
import type { Theme, ThemeOptions } from "@mui/material";
import type { Shadows } from "@mui/material/styles";

import {
  strataColors,
  strataFonts,
  strataMuiPaletteDark,
  strataRadius,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";

/**
 * The Strata MUI theme: dark, dense, one accent. Dark-only - turning Strata on
 * forces night mode (ADR 0019). Layout is untouched; this only restyles.
 */

/** Page background outside of any surface. Also painted pre-hydration. */
export const STRATA_APP_BACKGROUND = strataColors.ground;

const SANS = `${strataFonts.sans}`;
const MONO = `${strataFonts.mono}`;

function px(n: number) {
  return `${n}px`;
}

function buildStrataComponents(): ThemeOptions["components"] {
  const hairline = `1px solid ${strataColors.line}`;
  const strongLine = `1px solid ${strataColors.lineStrong}`;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          fontSize: px(strataType.body.size),
          lineHeight: px(strataType.body.lineHeight),
        },
        "::selection": { backgroundColor: strataColors.amberTint },
      },
    },

    // Surfaces: flat, hairline borders, no elevation ------------------------
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none", boxShadow: "none" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: hairline,
          boxShadow: "none",
          backgroundImage: "none",
          borderRadius: strataRadius.default,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: px(12), "&:last-child": { paddingBottom: px(12) } },
      },
    },
    MuiCardActions: {
      styleOverrides: { root: { padding: `${px(8)} ${px(12)} ${px(12)}` } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
          borderBottom: hairline,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: strataRadius.default, border: strongLine },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: strataRadius.default, border: strongLine },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { borderRadius: strataRadius.default, border: strongLine },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: strataRadius.default } },
    },

    // Controls ---------------------------------------------------------------
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: strataRadius.default,
          fontWeight: 500,
          letterSpacing: 0,
          paddingInline: px(12),
          "&.MuiButton-outlined": {
            borderColor: strataColors.lineStrong,
          },
          "&.MuiButton-outlined.MuiButton-colorInherit:hover": {
            borderColor: strataColors.textMuted,
          },
        },
        sizeSmall: { paddingInline: px(8) },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: strataRadius.default } },
    },
    // The segmented style: amber when on, outlined when off.
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: MONO,
          fontSize: px(strataType.path.size),
          fontWeight: 400,
          borderRadius: strataRadius.default,
          color: strataColors.textMuted,
          border: strongLine,
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: strataColors.amber,
            color: strataColors.ground,
            borderColor: strataColors.amber,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: strataRadius.default,
          backgroundColor: strataColors.panel,
        },
        notchedOutline: { borderColor: strataColors.lineStrong },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: strataRadius.default,
          backgroundColor: strataColors.panel,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: "auto",
          borderRadius: strataRadius.small,
          fontFamily: MONO,
          fontSize: px(strataType.meta.size),
          fontWeight: 400,
          letterSpacing: 0,
        },
        label: { paddingInline: px(6), paddingBlock: px(1) },
        outlined: { borderColor: strataColors.lineStrong },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: strataRadius.default,
          minHeight: strataSize.row,
          paddingBlock: 0,
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: strataColors.amberTint,
            color: strataColors.textStrong,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: strataRadius.small,
          fontFamily: MONO,
          fontSize: px(strataType.meta.size),
          backgroundColor: strataColors.raised,
          border: strongLine,
          color: strataColors.text,
        },
      },
    },

    // Navigation -------------------------------------------------------------
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: strataSize.columnHeader },
        indicator: { backgroundColor: strataColors.amber },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          minHeight: strataSize.columnHeader,
          letterSpacing: 0,
        },
      },
    },
    MuiLink: { defaultProps: { underline: "hover" } },
    MuiDivider: {
      styleOverrides: { root: { borderColor: strataColors.line } },
    },

    // Data -------------------------------------------------------------------
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderColor: theme.palette.divider,
          padding: `${px(4)} ${px(8)}`,
        }),
        head: {
          fontFamily: MONO,
          fontSize: px(strataType.label.size),
          fontWeight: 400,
          letterSpacing: strataType.label.letterSpacing,
          textTransform: "uppercase",
          // faintest is 3.4-4.0:1 on the surfaces; faint clears 4.5:1 on all
          // but `raised`.
          color: strataColors.textFaint,
        },
      },
    },
  };
}

export function buildStrataTheme() {
  return createTheme({
    palette: {
      ...strataMuiPaletteDark,
      // Entity links use `info.dark`; MUI would derive a dim one from `main`.
      info: {
        main: strataColors.textMuted,
        light: strataColors.textStrong,
        dark: strataColors.text,
        contrastText: strataColors.ground,
      },
      grey: {
        50: strataColors.text,
        100: strataColors.textSecondary,
        200: strataColors.textMuted,
        300: strataColors.textFaint,
        400: strataColors.textFaintest,
        500: strataColors.disabled,
        600: strataColors.lineStrong,
        700: strataColors.line,
        800: strataColors.raised,
        900: strataColors.panel,
      },
    },

    shape: { borderRadius: strataRadius.default },

    // No elevation anywhere.
    shadows: Array(25).fill("none") as unknown as Shadows,

    typography: {
      fontFamily: SANS,
      fontSize: strataType.body.size,
      h1: {
        fontSize: px(strataType.pageTitle.size),
        lineHeight: px(strataType.pageTitle.lineHeight),
        fontWeight: strataType.pageTitle.weight,
      },
      h2: {
        fontSize: px(strataType.entityTitle.size),
        lineHeight: px(strataType.entityTitle.lineHeight),
        fontWeight: strataType.entityTitle.weight,
      },
      h3: {
        fontSize: px(strataType.entityTitle.size),
        lineHeight: px(strataType.entityTitle.lineHeight),
        fontWeight: strataType.entityTitle.weight,
      },
      h4: {
        fontSize: px(strataType.columnTitle.size),
        lineHeight: px(strataType.columnTitle.lineHeight),
        fontWeight: strataType.columnTitle.weight,
      },
      h5: {
        fontSize: px(strataType.columnTitle.size),
        lineHeight: px(strataType.columnTitle.lineHeight),
        fontWeight: strataType.columnTitle.weight,
      },
      h6: {
        fontSize: px(strataType.body.size + 2),
        lineHeight: px(strataType.columnTitle.lineHeight),
        fontWeight: strataType.bodyStrong.weight,
      },
      subtitle1: {
        fontSize: px(strataType.body.size),
        lineHeight: px(strataType.body.lineHeight),
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: px(strataType.body.size),
        lineHeight: px(strataType.body.lineHeight),
        fontWeight: strataType.bodyStrong.weight,
      },
      body1: {
        fontSize: px(strataType.body.size),
        lineHeight: px(strataType.body.lineHeight),
      },
      body2: {
        fontSize: px(strataType.body.size),
        lineHeight: px(strataType.body.lineHeight),
      },
      button: {
        fontSize: px(strataType.body.size),
        fontWeight: 500,
        textTransform: "none",
        letterSpacing: 0,
      },
      // Things you scan are mono.
      caption: {
        fontFamily: MONO,
        fontSize: px(strataType.meta.size),
        lineHeight: px(strataType.meta.lineHeight),
      },
      overline: {
        fontFamily: MONO,
        fontSize: px(strataType.label.size),
        lineHeight: px(strataType.label.lineHeight),
        fontWeight: strataType.label.weight,
        letterSpacing: strataType.label.letterSpacing,
        textTransform: "uppercase",
      },
    },

    components: buildStrataComponents(),
  });
}
