import {
  Key_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/is-key-select.tsx
var import_react = __toESM(require_react(), 1);
function IsKeySelect(props) {
  const [value, setValue] = (0, import_react.useState)(
    props.value ?? props.defaultValue ?? false
  );
  (0, import_react.useEffect)(() => {
    setValue(props.value ?? props.defaultValue ?? false);
  }, [props.value, props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButton_default,
      {
        value: props.name,
        selected: value,
        disabled: !props.inputsEnabled,
        onChange: () => setValue((prevSelected) => !prevSelected),
        sx: { height: "100%", minWidth: "2rem" },
        children: /* @__PURE__ */ jsxDEV(Key_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/common/component/is-key-select.tsx",
          lineNumber: 30,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/is-key-select.tsx",
        lineNumber: 23,
        columnNumber: 7
      },
      this
    ),
    value && /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: "on" }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/is-key-select.tsx",
      lineNumber: 32,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/is-key-select.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, this);
}

export {
  IsKeySelect
};
//# sourceMappingURL=/build/_shared/chunk-SWYHSSUT.js.map
