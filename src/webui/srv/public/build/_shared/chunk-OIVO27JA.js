import {
  timePlanActivityFeasabilityName,
  timePlanActivityKindName
} from "/build/_shared/chunk-73QIECWH.js";
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

// ../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function TimePlanActivityFeasabilitySelect(props) {
  const [feasability, setFeasability] = (0, import_react.useState)(
    props.defaultValue
  );
  (0, import_react.useEffect)(() => {
    setFeasability(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        size: "small",
        fullWidth: true,
        value: feasability,
        exclusive: true,
        onChange: (_, newFeasability) => newFeasability !== null && setFeasability(newFeasability),
        sx: { height: "100%" },
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: "time-plan-activity-feasability-must-do",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.TimePlanActivityFeasability.MUST_DO,
              children: timePlanActivityFeasabilityName(import_webapi_client.TimePlanActivityFeasability.MUST_DO)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
              lineNumber: 36,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: "time-plan-activity-feasability-nice-to-have",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE,
              children: timePlanActivityFeasabilityName(
                import_webapi_client.TimePlanActivityFeasability.NICE_TO_HAVE
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
              lineNumber: 43,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: "time-plan-activity-feasability-stretch",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.TimePlanActivityFeasability.STRETCH,
              children: timePlanActivityFeasabilityName(import_webapi_client.TimePlanActivityFeasability.STRETCH)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
              lineNumber: 52,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
        lineNumber: 26,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: feasability }, void 0, false, {
      fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/time_plans/sub/activity/component/feasability-select.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react2 = __toESM(require_react(), 1);
function TimePlanActivitKindSelect(props) {
  const [kind, setKind] = (0, import_react2.useState)(props.defaultValue);
  (0, import_react2.useEffect)(() => {
    setKind(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        size: "small",
        fullWidth: true,
        value: kind,
        exclusive: true,
        onChange: (_, newKind) => newKind !== null && setKind(newKind),
        sx: { height: "100%" },
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: "time-plan-activity-kind-finish",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.TimePlanActivityKind.FINISH,
              children: timePlanActivityKindName(import_webapi_client2.TimePlanActivityKind.FINISH)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx",
              lineNumber: 32,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              id: "time-plan-activity-kind-make-progress",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.TimePlanActivityKind.MAKE_PROGRESS,
              children: timePlanActivityKindName(import_webapi_client2.TimePlanActivityKind.MAKE_PROGRESS)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx",
              lineNumber: 39,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx",
        lineNumber: 24,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: kind }, void 0, false, {
      fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/time_plans/sub/activity/component/kind-select.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}

export {
  TimePlanActivityFeasabilitySelect,
  TimePlanActivitKindSelect
};
//# sourceMappingURL=/build/_shared/chunk-OIVO27JA.js.map
