import {
  getPublicName
} from "/build/_shared/chunk-L6BTFETC.js";
import {
  AppBar_default,
  IconButton_default,
  Toolbar_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  GlobalPropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/component/community-link.tsx
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/infra/component/discord-icon.tsx
var SvgComponent = (props) => /* @__PURE__ */ jsxDEV("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 127.14 96.36", ...props, children: /* @__PURE__ */ jsxDEV("g", { "data-name": "\\u56FE\\u5C42 2", children: /* @__PURE__ */ jsxDEV("g", { "data-name": "Discord Logos", children: /* @__PURE__ */ jsxDEV(
  "path",
  {
    d: "M107.7 8.07A105.2 105.2 0 0 0 81.47 0a72 72 0 0 0-3.36 6.83 97.7 97.7 0 0 0-29.11 0A72 72 0 0 0 45.64 0a106 106 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.7 105.7 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.4 68.4 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.7 68.7 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.3 105.3 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15M42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69m42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69",
    "data-name": "Discord Logo - Large - White",
    style: {
      fill: "#fff"
    }
  },
  void 0,
  false,
  {
    fileName: "../core/jupiter/core/infra/component/discord-icon.tsx",
    lineNumber: 7,
    columnNumber: 9
  },
  this
) }, void 0, false, {
  fileName: "../core/jupiter/core/infra/component/discord-icon.tsx",
  lineNumber: 6,
  columnNumber: 7
}, this) }, void 0, false, {
  fileName: "../core/jupiter/core/infra/component/discord-icon.tsx",
  lineNumber: 5,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "../core/jupiter/core/infra/component/discord-icon.tsx",
  lineNumber: 4,
  columnNumber: 3
}, this);
var discord_icon_default = SvgComponent;

// ../core/jupiter/core/infra/component/community-link.tsx
function CommunityLink() {
  const globalProperties = (0, import_react.useContext)(GlobalPropertiesContext);
  return /* @__PURE__ */ jsxDEV(
    IconButton_default,
    {
      component: "a",
      size: "medium",
      disableRipple: true,
      color: "inherit",
      href: globalProperties.communityUrl,
      target: "_blank",
      children: /* @__PURE__ */ jsxDEV(
        discord_icon_default,
        {
          style: { verticalAlign: "middle", width: "1.5rem", height: "1.5rem" }
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/community-link.tsx",
          lineNumber: 19,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/community-link.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/infra/component/smart-appbar.tsx
function SmartAppBar(props) {
  return /* @__PURE__ */ jsxDEV(
    AppBar_default,
    {
      position: "static",
      sx: {
        paddingTop: "env(safe-area-inset-top)",
        zIndex: (theme) => theme.zIndex.drawer + 10
      },
      children: /* @__PURE__ */ jsxDEV(Toolbar_default, { children: props.children }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/smart-appbar.tsx",
        lineNumber: 13,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/smart-appbar.tsx",
      lineNumber: 6,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/infra/component/title.tsx
var import_react2 = __toESM(require_react(), 1);
function Title(props) {
  const globalProperties = (0, import_react2.useContext)(GlobalPropertiesContext);
  const name = getPublicName(globalProperties);
  return /* @__PURE__ */ jsxDEV(
    Typography_default,
    {
      noWrap: true,
      variant: "h6",
      component: "div",
      sx: {
        flexGrow: 1,
        display: {
          xs: props.hideOnSmallScreen ? "none" : "block",
          sm: "block"
        }
      },
      children: name
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/title.tsx",
      lineNumber: 17,
      columnNumber: 5
    },
    this
  );
}

export {
  CommunityLink,
  SmartAppBar,
  Title
};
//# sourceMappingURL=/build/_shared/chunk-UVXGDSKE.js.map
