import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/infra/component/layout/lifecycle-panel.tsx
function LifecyclePanel(props) {
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        paddingTop: "4rem",
        width: isBigScreen ? "600px" : "100%",
        height: `calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top) - ${isBigScreen ? "4rem" : "3.5rem"})`,
        overflowY: "scroll",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        alignSelf: "center"
      },
      children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: [
        props.children,
        /* @__PURE__ */ jsxDEV(Box_default, { sx: { height: "4rem" } }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/layout/lifecycle-panel.tsx",
          lineNumber: 24,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/infra/component/layout/lifecycle-panel.tsx",
        lineNumber: 22,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/layout/lifecycle-panel.tsx",
      lineNumber: 9,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/infra/component/layout/standalone-container.tsx
function StandaloneContainer(props) {
  return /* @__PURE__ */ jsxDEV(Stack_default, { children: props.children }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/layout/standalone-container.tsx",
    lineNumber: 5,
    columnNumber: 10
  }, this);
}

// ../core/jupiter/core/infra/component/logo.tsx
function Logo() {
  return /* @__PURE__ */ jsxDEV(
    "img",
    {
      src: "/logo.png",
      alt: "Logo",
      style: {
        alignSelf: "center",
        marginRight: "0.5rem",
        height: "2rem"
      }
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/logo.tsx",
      lineNumber: 3,
      columnNumber: 5
    },
    this
  );
}

export {
  LifecyclePanel,
  StandaloneContainer,
  Logo
};
//# sourceMappingURL=/build/_shared/chunk-ABCRCQCW.js.map
