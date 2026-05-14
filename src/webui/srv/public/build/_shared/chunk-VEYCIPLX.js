import {
  AnimatePresence,
  motion
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/infra/component/tab-panel.tsx
var SMALL_SCREEN_INITIAL = { x: "100vw", opacity: 0 };
var BIG_SCREEN_INITIAL = { opacity: 0 };
var SMALL_SCREEN_ANIMATE = { x: 0, opacity: 1 };
var BIG_SCREEN_ANIMATE = { opacity: 1 };
var SMALL_SCREEN_EXIT = { x: "-100vw", opacity: 0 };
var BIG_SCREEN_EXIT = { opacity: 0 };
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      role: "tabpanel",
      hidden: value !== index,
      id: `simple-tabpanel-${index}`,
      sx: { paddingTop: "0.25rem" },
      ...other,
      children: /* @__PURE__ */ jsxDEV(AnimatePresence, { children: value === index && /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: isBigScreen ? BIG_SCREEN_INITIAL : SMALL_SCREEN_INITIAL,
          animate: isBigScreen ? BIG_SCREEN_ANIMATE : SMALL_SCREEN_ANIMATE,
          exit: isBigScreen ? BIG_SCREEN_EXIT : SMALL_SCREEN_EXIT,
          transition: { duration: 0.2 },
          children
        },
        `tab-panel-${index}`,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/tab-panel.tsx",
          lineNumber: 33,
          columnNumber: 11
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/tab-panel.tsx",
        lineNumber: 31,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/tab-panel.tsx",
      lineNumber: 24,
      columnNumber: 5
    },
    this
  );
}

export {
  TabPanel
};
//# sourceMappingURL=/build/_shared/chunk-VEYCIPLX.js.map
