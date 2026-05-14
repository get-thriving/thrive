import {
  ToggleButtonGroup_default,
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
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

// ../core/jupiter/core/habits/component/repeat-strategy-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/habits/repeats-strategy.ts
var import_webapi_client = __toESM(require_dist(), 1);
function strategyName(strategy) {
  switch (strategy) {
    case import_webapi_client.HabitRepeatsStrategy.ALL_SAME:
      return "Same Time";
    case import_webapi_client.HabitRepeatsStrategy.SPREAD_OUT_NO_OVERLAP:
      return "Spread Out";
  }
}

// ../core/jupiter/core/habits/component/repeat-strategy-select.tsx
function HabitRepeatStrategySelect(props) {
  const [strategy, setStrategy] = (0, import_react.useState)(
    props.defaultValue || props.value || (props.allowNone ? "none" : import_webapi_client2.HabitRepeatsStrategy.ALL_SAME)
  );
  (0, import_react.useEffect)(() => {
    if (props.value !== void 0) {
      setStrategy(props.value);
    }
  }, [props.value]);
  function handleChangeStrategy(event, newStrategy) {
    if (newStrategy === null) {
      return;
    }
    setStrategy(newStrategy);
    if (props.onChange) {
      props.onChange(newStrategy);
    }
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: strategy || "none",
        exclusive: true,
        fullWidth: true,
        onChange: handleChangeStrategy,
        sx: { height: "100%" },
        children: [
          props.allowNone && /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "none", disabled: !props.inputsEnabled, children: "None" }, void 0, false, {
            fileName: "../core/jupiter/core/habits/component/repeat-strategy-select.tsx",
            lineNumber: 54,
            columnNumber: 11
          }, this),
          Object.values(import_webapi_client2.HabitRepeatsStrategy).map((s) => /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: s, disabled: !props.inputsEnabled, children: strategyName(s) }, s, false, {
            fileName: "../core/jupiter/core/habits/component/repeat-strategy-select.tsx",
            lineNumber: 59,
            columnNumber: 11
          }, this))
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/habits/component/repeat-strategy-select.tsx",
        lineNumber: 46,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: strategy }, void 0, false, {
      fileName: "../core/jupiter/core/habits/component/repeat-strategy-select.tsx",
      lineNumber: 64,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/habits/component/repeat-strategy-select.tsx",
    lineNumber: 45,
    columnNumber: 5
  }, this);
}

export {
  HabitRepeatStrategySelect
};
//# sourceMappingURL=/build/_shared/chunk-FVCYD4VD.js.map
