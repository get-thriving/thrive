import {
  ScheduleStreamColorTag
} from "/build/_shared/chunk-3U5H3AD4.js";
import {
  Box_default,
  Chip_default,
  MenuItem_default,
  Select_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/schedule/component/multi-select.tsx
function ScheduleStreamMultiSelect(props) {
  const allScheduleStreamsByRefId = new Map(
    props.allScheduleStreams.map((st) => [st.ref_id, st])
  );
  return /* @__PURE__ */ jsxDEV(
    Select_default,
    {
      labelId: props.labelId,
      label: props.label,
      name: props.name,
      readOnly: props.readOnly,
      disabled: props.readOnly,
      multiple: true,
      defaultValue: props.defaultValue ?? [],
      renderValue: (selected) => /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexWrap: "wrap", gap: 0.5 }, children: selected.map((value) => /* @__PURE__ */ jsxDEV(
        Chip_default,
        {
          label: allScheduleStreamsByRefId.get(value).name
        },
        value,
        false,
        {
          fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
          lineNumber: 33,
          columnNumber: 13
        },
        this
      )) }, void 0, false, {
        fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
        lineNumber: 31,
        columnNumber: 9
      }, this),
      children: props.allScheduleStreams.map((st) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: st.ref_id, children: /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", alignItems: "center", gap: "0.25rem" }, children: [
        st.name,
        /* @__PURE__ */ jsxDEV(ScheduleStreamColorTag, { color: st.color }, void 0, false, {
          fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
          lineNumber: 45,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
        lineNumber: 43,
        columnNumber: 11
      }, this) }, st.ref_id, false, {
        fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/schedule/component/multi-select.tsx",
      lineNumber: 22,
      columnNumber: 5
    },
    this
  );
}

export {
  ScheduleStreamMultiSelect
};
//# sourceMappingURL=/build/_shared/chunk-ETY27RHY.js.map
