import {
  difficultyName,
  eisenName
} from "/build/_shared/chunk-NLPUBZ3T.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
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

// ../core/jupiter/core/common/component/difficulty-select.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function DifficultySelect(props) {
  const [difficulty, setDifficulty] = (0, import_react.useState)(props.defaultValue);
  (0, import_react.useEffect)(() => {
    setDifficulty(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: difficulty,
        exclusive: true,
        fullWidth: true,
        onChange: (_, newDifficulty) => newDifficulty !== null && setDifficulty(newDifficulty),
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "difficulty-easy",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.Difficulty.EASY,
              children: difficultyName(import_webapi_client.Difficulty.EASY)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
              lineNumber: 30,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "difficulty-medium",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.Difficulty.MEDIUM,
              children: difficultyName(import_webapi_client.Difficulty.MEDIUM)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
              lineNumber: 38,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "difficulty-hard",
              disabled: !props.inputsEnabled,
              value: import_webapi_client.Difficulty.HARD,
              children: difficultyName(import_webapi_client.Difficulty.HARD)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
              lineNumber: 46,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
        lineNumber: 22,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: difficulty }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/difficulty-select.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/common/component/eisenhower-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react2 = __toESM(require_react(), 1);
function EisenhowerSelect(props) {
  const [eisen, setEisen] = (0, import_react2.useState)(props.defaultValue);
  const isBigScreen = useBigScreen();
  (0, import_react2.useEffect)(() => {
    setEisen(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: eisen,
        exclusive: true,
        fullWidth: true,
        onChange: (_, newEisen) => newEisen !== null && setEisen(newEisen),
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "eisen-regular",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.Eisen.REGULAR,
              children: eisenName(import_webapi_client2.Eisen.REGULAR, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
              lineNumber: 30,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "eisen-important",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.Eisen.IMPORTANT,
              children: eisenName(import_webapi_client2.Eisen.IMPORTANT, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
              lineNumber: 38,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "eisen-urgent",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.Eisen.URGENT,
              children: eisenName(import_webapi_client2.Eisen.URGENT, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
              lineNumber: 46,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "eisen-important-and-urgent",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.Eisen.IMPORTANT_AND_URGENT,
              children: eisenName(import_webapi_client2.Eisen.IMPORTANT_AND_URGENT, !isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
              lineNumber: 54,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
        lineNumber: 24,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: eisen }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/eisenhower-select.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}

export {
  DifficultySelect,
  EisenhowerSelect
};
//# sourceMappingURL=/build/_shared/chunk-T6GSSEVE.js.map
