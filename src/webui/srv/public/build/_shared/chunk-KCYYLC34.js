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

// ../core/jupiter/core/metrics/component/direction-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/metrics/direction.ts
var import_webapi_client = __toESM(require_dist(), 1);
function metricDirectionName(direction) {
  switch (direction) {
    case import_webapi_client.MetricDirection.NONE:
      return "None";
    case import_webapi_client.MetricDirection.UP_IS_GOOD:
      return "Up Is Good";
    case import_webapi_client.MetricDirection.DOWN_IS_GOOD:
      return "Down Is Good";
  }
}

// ../core/jupiter/core/metrics/component/direction-select.tsx
function MetricDirectionSelect(props) {
  const [direction, setDirection] = (0, import_react.useState)(
    props.defaultValue
  );
  (0, import_react.useEffect)(() => {
    setDirection(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: direction,
        exclusive: true,
        fullWidth: true,
        onChange: (_, newDirection) => newDirection !== null && setDirection(newDirection),
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "direction-none",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.MetricDirection.NONE,
              children: metricDirectionName(import_webapi_client2.MetricDirection.NONE)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
              lineNumber: 32,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "direction-up-is-good",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.MetricDirection.UP_IS_GOOD,
              children: metricDirectionName(import_webapi_client2.MetricDirection.UP_IS_GOOD)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
              lineNumber: 40,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "direction-down-is-good",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.MetricDirection.DOWN_IS_GOOD,
              children: metricDirectionName(import_webapi_client2.MetricDirection.DOWN_IS_GOOD)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
              lineNumber: 48,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
        lineNumber: 24,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: direction }, void 0, false, {
      fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
      lineNumber: 57,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/metrics/component/direction-select.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}

export {
  MetricDirectionSelect
};
//# sourceMappingURL=/build/_shared/chunk-KCYYLC34.js.map
