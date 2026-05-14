import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  Autocomplete_default,
  TextField_default,
  jsx
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

// ../core/jupiter/core/life_plan/sub/goals/components/select.tsx
var import_react = __toESM(require_react(), 1);
function GoalSelect(props) {
  const allGoalsByRefId = (0, import_react.useMemo)(
    () => new Map(props.allGoals.map((g) => [g.ref_id, g])),
    [props.allGoals]
  );
  const sortedGoals = (0, import_react.useMemo)(
    () => sortGoalsNaturally(props.allGoals),
    [props.allGoals]
  );
  const allGoalsAsOptions = (0, import_react.useMemo)(
    () => sortedGoals.filter(
      (goal) => !props.onlyForAspect || goal.aspect_ref_id === props.onlyForAspect
    ).map((goal) => ({
      goal_ref_id: goal.ref_id,
      label: String(goal.name),
      bigName: fullGoalName(goal, allGoalsByRefId)
    })),
    [sortedGoals, props.onlyForAspect, allGoalsByRefId]
  );
  function selectedGoalToOption() {
    const selectedGoalRefId = props.value ?? props.defaultValue;
    if (!selectedGoalRefId) {
      return null;
    }
    const goal = allGoalsByRefId.get(selectedGoalRefId);
    if (!goal) {
      return null;
    }
    return {
      goal_ref_id: selectedGoalRefId,
      label: String(goal.name),
      bigName: fullGoalName(goal, allGoalsByRefId)
    };
  }
  const [selectedGoal, setSelectedGoal] = (0, import_react.useState)(
    selectedGoalToOption()
  );
  (0, import_react.useEffect)(() => {
    const selectedGoalRefId = props.value ?? props.defaultValue;
    if (!selectedGoalRefId) {
      setSelectedGoal(null);
      return;
    }
    const goal = allGoalsByRefId.get(selectedGoalRefId);
    if (!goal) {
      setSelectedGoal(null);
      return;
    }
    setSelectedGoal({
      goal_ref_id: selectedGoalRefId,
      label: String(goal.name),
      bigName: fullGoalName(goal, allGoalsByRefId)
    });
  }, [
    props.value,
    props.defaultValue,
    props.allGoals,
    props.onlyForAspect,
    allGoalsByRefId
  ]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        options: allGoalsAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled || allGoalsAsOptions.length === 0,
        sx: autocompleteSingleLineSx,
        value: selectedGoal,
        onChange: (_, v) => {
          setSelectedGoal(v);
          if (props.onChange) {
            props.onChange(v?.goal_ref_id ?? null);
          }
        },
        isOptionEqualToValue: (o, v) => o.goal_ref_id === v.goal_ref_id,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/life_plan/sub/goals/components/select.tsx",
          lineNumber: 126,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/goals/components/select.tsx",
        lineNumber: 103,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedGoal?.goal_ref_id ?? ""
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/goals/components/select.tsx",
        lineNumber: 129,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/goals/components/select.tsx",
    lineNumber: 102,
    columnNumber: 5
  }, this);
}
function fullGoalName(goal, allGoalsByRefId) {
  const indent = computeGoalDistanceFromRoot(goal, allGoalsByRefId);
  return `${"-".repeat(indent)} ${String(goal.name)}`;
}
function computeGoalDistanceFromRoot(goal, allGoalsByRefId) {
  const visited = /* @__PURE__ */ new Set();
  let distance = 0;
  let current = goal;
  while (current) {
    const parentGoalRefId = current.parent_goal_ref_id;
    if (!parentGoalRefId) {
      break;
    }
    if (visited.has(parentGoalRefId)) {
      break;
    }
    visited.add(parentGoalRefId);
    const parent = allGoalsByRefId.get(parentGoalRefId);
    if (!parent) {
      break;
    }
    distance += 1;
    current = parent;
  }
  return distance;
}

export {
  GoalSelect
};
//# sourceMappingURL=/build/_shared/chunk-6SJK4Y2K.js.map
