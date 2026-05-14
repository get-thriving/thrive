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

// ../core/jupiter/core/infra/component/layout/nesting-aware-block.tsx
function NestingAwareBlock(props) {
  const isBigScreen = useBigScreen();
  if (!isBigScreen && props.shouldHide) {
    return null;
  }
  if (props.branchForceHide) {
    return null;
  }
  return /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: [
    props.children,
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { height: "4rem" } }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/layout/nesting-aware-block.tsx",
      lineNumber: 27,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/layout/nesting-aware-block.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}

export {
  NestingAwareBlock
};
//# sourceMappingURL=/build/_shared/chunk-FROCZWJR.js.map
