import {
  ScheduleStreamColorTag
} from "/build/_shared/chunk-3U5H3AD4.js";
import {
  scheduleStreamColorName
} from "/build/_shared/chunk-7YZ2X2X4.js";
import {
  Box_default,
  MenuItem_default,
  Select_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/schedule/component/color-input.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function ScheduleStreamColorInput(props) {
  return /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      labelId: props.labelId,
      label: props.label,
      name: props.name,
      readOnly: props.readOnly,
      disabled: props.readOnly,
      defaultValue: props.value,
      children: Object.values(import_webapi_client.ScheduleStreamColor).map((st) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: st, children: /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
        /* @__PURE__ */ jsxDEV(ScheduleStreamColorTag, { color: st }, void 0, false, {
          fileName: "../core/jupiter/core/schedule/component/color-input.tsx",
          lineNumber: 28,
          columnNumber: 13
        }, this),
        scheduleStreamColorName(st)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/schedule/component/color-input.tsx",
        lineNumber: 27,
        columnNumber: 11
      }, this) }, st, false, {
        fileName: "../core/jupiter/core/schedule/component/color-input.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/schedule/component/color-input.tsx",
      lineNumber: 17,
      columnNumber: 5
    },
    this
  );
}

export {
  ScheduleStreamColorInput
};
//# sourceMappingURL=/build/_shared/chunk-XZIOVQ6W.js.map
