import { createTheme } from "@mui/material";
import type { Theme, ThemeOptions } from "@mui/material";
import type { Shadows } from "@mui/material/styles";

import {
  strataColors,
  strataFonts,
  strataMuiPalette,
  strataPalettes,
  strataRadius,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";
import type { StrataColorScheme } from "#/core/infra/component/strata-tokens";

/**
 * The Strata MUI theme: dense, one accent, in a dark or a light scheme (ADR
 * 0019). Layout is untouched; this only restyles.
 */

/** Page background outside of any surface. Also painted pre-hydration, so it is the variable. */
export const STRATA_APP_BACKGROUND = strataColors.ground;

const SANS = `${strataFonts.sans}`;
const MONO = `${strataFonts.mono}`;

function px(n: number) {
  return `${n}px`;
}

/**
 * Sizes that are for a mouse. A finger needs the larger targets MUI has, so on
 * a touch screen the controls keep them; `strataSize` is what the rest get.
 */
function withMouse<T extends object>(styles: T) {
  return { "@media (pointer: fine)": styles };
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
          // MUI fills it with the primary color on a light scheme: it is a
          // surface, as it is on a dark one.
          backgroundColor: strataColors.panel,
          color: strataColors.text,
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
          // Each size has a height: the border is part of it, so an outlined
          // button has a pixel less padding than a plain one.
          ...withMouse({
            lineHeight: px(strataType.body.lineHeight),
            "&.MuiButton-sizeMedium": {
              minHeight: strataSize.control,
              paddingBlock: px(0),
            },
            "&.MuiButton-sizeSmall": {
              minHeight: strataSize.controlSmall,
              paddingBlock: px(0),
              paddingInline: px(8),
            },
            "&.MuiButton-sizeLarge": {
              minHeight: strataSize.controlLarge,
              paddingBlock: px(0),
              paddingInline: px(16),
            },
          }),
        },
        sizeSmall: { paddingInline: px(8) },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: strataRadius.default,
          ...withMouse({
            "&.MuiIconButton-sizeMedium": { padding: px(6) },
            "&.MuiIconButton-sizeSmall": { padding: px(4) },
          }),
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: { root: withMouse({ padding: px(6) }) },
    },
    MuiRadio: {
      styleOverrides: { root: withMouse({ padding: px(6) }) },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: withMouse({
          minHeight: strataSize.row,
          paddingBlock: px(2),
        }),
      },
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
          ...withMouse({
            lineHeight: px(strataType.body.lineHeight),
            paddingBlock: px(0),
            paddingInline: px(10),
            "&.MuiToggleButton-sizeMedium": { minHeight: strataSize.control },
            "&.MuiToggleButton-sizeSmall": {
              minHeight: strataSize.controlSmall,
              paddingInline: px(8),
            },
            "&.MuiToggleButton-sizeLarge": {
              minHeight: strataSize.controlLarge,
            },
          }),
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
          // One height for the medium and the small input alike: the text is
          // in the middle of it, with no padding above and below to add up.
          ...withMouse({
            minHeight: strataSize.control,
            alignItems: "center",
            "&.MuiInputBase-multiline": {
              padding: `${px(6)} ${px(14)}`,
              "&.MuiInputBase-sizeSmall": {
                padding: `${px(6)} ${px(14)}`,
              },
            },
          }),
        },
        input: withMouse({
          "&.MuiOutlinedInput-input": {
            height: "auto",
            paddingBlock: px(0),
          },
        }),
        notchedOutline: { borderColor: strataColors.lineStrong },
      },
    },
    // The label of an outlined input sits in the middle of the shorter one
    // while it is the placeholder, and on its border when it has shrunk.
    MuiInputLabel: {
      styleOverrides: {
        root: withMouse({
          "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
            transform: `translate(${px(14)}, ${px(7)}) scale(1)`,
          },
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: withMouse({
          "&& .MuiOutlinedInput-root": {
            paddingTop: px(3),
            paddingBottom: px(3),
            "& .MuiAutocomplete-input": { paddingBlock: px(3.5) },
          },
        }),
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

export function buildStrataTheme(scheme: StrataColorScheme = "dark") {
  // The palette needs real colors, which MUI works shades and contrasts out
  // of; the components use the variables, which hold the same ones.
  const c = strataPalettes[scheme];
  return createTheme({
    palette: {
      ...strataMuiPalette(scheme),
      // Entity links use `info.dark`; MUI would derive a dim one from `main`.
      info: {
        main: c.textMuted,
        light: c.textStrong,
        dark: c.text,
        contrastText: c.ground,
      },
      // From the lightest to the darkest, as MUI has them.
      grey:
        scheme === "dark"
          ? {
              50: c.text,
              100: c.textSecondary,
              200: c.textMuted,
              300: c.textFaint,
              400: c.textFaintest,
              500: c.disabled,
              600: c.lineStrong,
              700: c.line,
              800: c.raised,
              900: c.panel,
            }
          : {
              50: c.panel,
              100: c.column,
              200: c.ground,
              300: c.raised,
              400: c.lineStrong,
              500: c.disabled,
              600: c.textFaintest,
              700: c.textMuted,
              800: c.textSecondary,
              900: c.text,
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
