import {
  isCorePropertyEditable
} from "/build/_shared/chunk-LUFLY6NA.js";
import {
  ScheduleStreamColorTag
} from "/build/_shared/chunk-3U5H3AD4.js";
import {
  Box_default,
  MenuItem_default,
  Select_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/schedule/component/select.tsx
function ScheduleStreamSelect(props) {
  return /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      labelId: props.labelId,
      label: props.label,
      name: props.name,
      readOnly: props.readOnly,
      disabled: props.readOnly,
      defaultValue: props.defaultValue.ref_id,
      children: props.allScheduleStreams.map((st) => /* @__PURE__ */ jsxDEV(
        MenuItem_default,
        {
          value: st.ref_id,
          disabled: !isCorePropertyEditable(st),
          children: /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", alignItems: "center", gap: "0.25rem" }, children: [
            st.name,
            /* @__PURE__ */ jsxDEV(ScheduleStreamColorTag, { color: st.color }, void 0, false, {
              fileName: "../core/jupiter/core/schedule/component/select.tsx",
              lineNumber: 34,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "../core/jupiter/core/schedule/component/select.tsx",
            lineNumber: 32,
            columnNumber: 11
          }, this)
        },
        st.ref_id,
        false,
        {
          fileName: "../core/jupiter/core/schedule/component/select.tsx",
          lineNumber: 27,
          columnNumber: 9
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/schedule/component/select.tsx",
      lineNumber: 18,
      columnNumber: 5
    },
    this
  );
}

export {
  ScheduleStreamSelect
};
//# sourceMappingURL=/build/_shared/chunk-F37AJ4V5.js.map
