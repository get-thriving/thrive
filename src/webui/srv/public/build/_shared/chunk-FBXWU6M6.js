import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  InputLabel_default,
  MenuItem_default,
  Select_default,
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

// ../core/jupiter/core/common/component/period-select.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function PeriodSelect(props) {
  const isBigScreen = useBigScreen();
  const [period, setPeriod] = (0, import_react.useState)(
    props.defaultValue || props.value || (props.multiSelect ? [import_webapi_client.RecurringTaskPeriod.DAILY] : import_webapi_client.RecurringTaskPeriod.DAILY)
  );
  (0, import_react.useEffect)(() => {
    if (props.value !== void 0) {
      if (props.multiSelect) {
        setPeriod(props.value);
      } else {
        setPeriod(props.value);
      }
    }
  }, [props.value, props.multiSelect]);
  const allowedValues = Object.values(import_webapi_client.RecurringTaskPeriod).filter(
    (p) => !props.allowedValues || props.allowedValues.includes(p)
  );
  function handleChangePeriod(event, newPeriod) {
    if (newPeriod === null) {
      return;
    }
    setPeriod(newPeriod);
    if (props.onChange) {
      props.onChange(newPeriod);
    }
  }
  function handleChangePeriodCompact(event) {
    const raw = event.target.value;
    const newPeriod = props.multiSelect ? raw : raw;
    setPeriod(newPeriod);
    if (props.onChange) {
      props.onChange(newPeriod);
    }
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    props.compact ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(InputLabel_default, { id: props.labelId, children: props.label }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/period-select.tsx",
        lineNumber: 84,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(
        Select_default,
        {
          labelId: props.labelId,
          label: props.label,
          multiple: Boolean(props.multiSelect),
          value: period,
          onChange: handleChangePeriodCompact,
          disabled: !props.inputsEnabled,
          fullWidth: true,
          size: "small",
          renderValue: (selected) => {
            if (selected === "none") {
              return "None";
            }
            if (Array.isArray(selected)) {
              return selected.map((p) => periodName(p, isBigScreen)).join(", ");
            }
            return periodName(selected, isBigScreen);
          },
          children: [
            props.allowNonePeriod && !props.multiSelect && /* @__PURE__ */ jsxDEV(MenuItem_default, { value: "none", children: "None" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/period-select.tsx",
              lineNumber: 107,
              columnNumber: 15
            }, this),
            allowedValues.map((p) => /* @__PURE__ */ jsxDEV(MenuItem_default, { value: p, children: periodName(p, isBigScreen) }, p, false, {
              fileName: "../core/jupiter/core/common/component/period-select.tsx",
              lineNumber: 110,
              columnNumber: 15
            }, this))
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/period-select.tsx",
          lineNumber: 85,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/period-select.tsx",
      lineNumber: 83,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: period,
        exclusive: !props.multiSelect,
        fullWidth: true,
        onChange: handleChangePeriod,
        size: "small",
        children: [
          props.allowNonePeriod && /* @__PURE__ */ jsxDEV(ToggleButton_default, { value: "none", disabled: !props.inputsEnabled, children: "None" }, void 0, false, {
            fileName: "../core/jupiter/core/common/component/period-select.tsx",
            lineNumber: 125,
            columnNumber: 13
          }, this),
          allowedValues.map((s) => /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: `period-${s}`,
              value: s,
              disabled: !props.inputsEnabled,
              children: periodName(s, isBigScreen)
            },
            s,
            false,
            {
              fileName: "../core/jupiter/core/common/component/period-select.tsx",
              lineNumber: 130,
              columnNumber: 13
            },
            this
          ))
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/common/component/period-select.tsx",
        lineNumber: 117,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: period }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/period-select.tsx",
      lineNumber: 141,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/period-select.tsx",
    lineNumber: 81,
    columnNumber: 5
  }, this);
}

export {
  PeriodSelect
};
//# sourceMappingURL=/build/_shared/chunk-FBXWU6M6.js.map
