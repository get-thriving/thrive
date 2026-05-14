import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/common/component/adate-tag.tsx
function ADateTag(props) {
  return /* @__PURE__ */ jsxDEV(
    SlimChip,
    {
      label: `${props.label} ${aDateToDate(props.date).setLocale("en-gb").toLocaleString()}`,
      color: props.color ?? "info"
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/adate-tag.tsx",
      lineNumber: 21,
      columnNumber: 5
    },
    this
  );
}

export {
  ADateTag
};
//# sourceMappingURL=/build/_shared/chunk-NBD44M5V.js.map
