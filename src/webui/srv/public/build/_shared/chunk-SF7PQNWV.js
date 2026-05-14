import {
  sortGoalsNaturally
} from "/build/_shared/chunk-OLMKSGLM.js";
import {
  sortChaptersNaturally
} from "/build/_shared/chunk-ZFN6H2GY.js";
import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
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

// ../core/jupiter/core/life_plan/sub/chapters/components/multi-select.tsx
var import_react = __toESM(require_react(), 1);
function ChapterMultiSelect(props) {
  const isBigScreen = useBigScreen();
  const allChaptersByRefId = (0, import_react.useMemo)(
    () => new Map(props.allChapters.map((c) => [c.ref_id, c])),
    [props.allChapters]
  );
  const sortedChapters = (0, import_react.useMemo)(() => {
    return sortChaptersNaturally(
      props.birthday,
      props.today,
      props.allChapters,
      props.allMilestones,
      props.allAspects
    );
  }, [
    props.allChapters,
    props.birthday,
    props.today,
    props.allMilestones,
    props.allAspects
  ]);
  const allChaptersAsOptions = (0, import_react.useMemo)(
    () => sortedChapters.filter(
      (chapter) => !props.onlyForAspect || chapter.aspect_ref_id === props.onlyForAspect
    ).map((chapter) => ({
      chapter_ref_id: chapter.ref_id,
      label: chapter.name,
      bigName: chapter.name
    })),
    [sortedChapters, props.onlyForAspect]
  );
  function selectedChaptersToOptions() {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds.map((refId) => allChaptersByRefId.get(refId)).filter((c) => Boolean(c)).map((c) => ({
      chapter_ref_id: c.ref_id,
      label: c.name,
      bigName: c.name
    }));
  }
  const [selectedChapters, setSelectedChapters] = (0, import_react.useState)(
    selectedChaptersToOptions()
  );
  (0, import_react.useEffect)(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedChapters(
      refIds.map((refId) => allChaptersByRefId.get(refId)).filter((c) => Boolean(c)).map((c) => ({
        chapter_ref_id: c.ref_id,
        label: c.name,
        bigName: c.name
      }))
    );
  }, [props.value, props.defaultValue, props.allChapters, allChaptersByRefId]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        limitTags: isBigScreen ? 0 : 1,
        size: "small",
        options: allChaptersAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled || allChaptersAsOptions.length === 0,
        multiple: true,
        disableCloseOnSelect: true,
        sx: autocompleteSingleLineSx,
        value: selectedChapters,
        getOptionDisabled: (o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedChapters.length;
          const alreadySelected = selectedChapters.some(
            (x) => x.chapter_ref_id === o.chapter_ref_id
          );
          return selectedCount >= maxSelections && !alreadySelected;
        },
        onChange: (_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (maxSelections && v.length > maxSelections && v.length > selectedChapters.length) {
            return;
          }
          setSelectedChapters(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.chapter_ref_id));
          }
        },
        isOptionEqualToValue: (o, v) => o.chapter_ref_id === v.chapter_ref_id,
        getOptionLabel: (o) => o.bigName,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(
          TextField_default,
          {
            ...params,
            label: props.label,
            helperText: props.maxSelections ? `Select up to ${props.maxSelections}.` : void 0
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/life_plan/sub/chapters/components/multi-select.tsx",
            lineNumber: 158,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/chapters/components/multi-select.tsx",
        lineNumber: 109,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedChapters.map((c) => c.chapter_ref_id).join(",")
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/chapters/components/multi-select.tsx",
        lineNumber: 170,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/chapters/components/multi-select.tsx",
    lineNumber: 108,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/life_plan/sub/goals/components/multi-select.tsx
var import_react3 = __toESM(require_react(), 1);
function GoalMultiSelect(props) {
  const isBigScreen = useBigScreen();
  const allGoalsByRefId = (0, import_react3.useMemo)(
    () => new Map(props.allGoals.map((g) => [g.ref_id, g])),
    [props.allGoals]
  );
  const sortedGoals = (0, import_react3.useMemo)(
    () => sortGoalsNaturally(props.allGoals),
    [props.allGoals]
  );
  const allGoalsAsOptions = (0, import_react3.useMemo)(
    () => sortedGoals.filter(
      (goal) => !props.onlyForAspect || goal.aspect_ref_id === props.onlyForAspect
    ).map((goal) => ({
      goal_ref_id: goal.ref_id,
      label: String(goal.name),
      bigName: String(goal.name)
    })),
    [sortedGoals, props.onlyForAspect]
  );
  function selectedGoalsToOptions() {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds.map((refId) => allGoalsByRefId.get(refId)).filter((g) => Boolean(g)).map((g) => ({
      goal_ref_id: g.ref_id,
      label: String(g.name),
      bigName: String(g.name)
    }));
  }
  const [selectedGoals, setSelectedGoals] = (0, import_react3.useState)(
    selectedGoalsToOptions()
  );
  (0, import_react3.useEffect)(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedGoals(
      refIds.map((refId) => allGoalsByRefId.get(refId)).filter((g) => Boolean(g)).map((g) => ({
        goal_ref_id: g.ref_id,
        label: String(g.name),
        bigName: String(g.name)
      }))
    );
  }, [props.value, props.defaultValue, props.allGoals, allGoalsByRefId]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        limitTags: isBigScreen ? 0 : 1,
        size: "small",
        options: allGoalsAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled || allGoalsAsOptions.length === 0,
        multiple: true,
        disableCloseOnSelect: true,
        sx: autocompleteSingleLineSx,
        value: selectedGoals,
        getOptionDisabled: (o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedGoals.length;
          const alreadySelected = selectedGoals.some(
            (x) => x.goal_ref_id === o.goal_ref_id
          );
          return selectedCount >= maxSelections && !alreadySelected;
        },
        onChange: (_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (maxSelections && v.length > maxSelections && v.length > selectedGoals.length) {
            return;
          }
          setSelectedGoals(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.goal_ref_id));
          }
        },
        isOptionEqualToValue: (o, v) => o.goal_ref_id === v.goal_ref_id,
        getOptionLabel: (o) => o.bigName,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(
          TextField_default,
          {
            ...params,
            label: props.label,
            helperText: props.maxSelections ? `Select up to ${props.maxSelections}.` : void 0
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/life_plan/sub/goals/components/multi-select.tsx",
            lineNumber: 136,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/goals/components/multi-select.tsx",
        lineNumber: 87,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedGoals.map((g) => g.goal_ref_id).join(",")
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/goals/components/multi-select.tsx",
        lineNumber: 148,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/goals/components/multi-select.tsx",
    lineNumber: 86,
    columnNumber: 5
  }, this);
}

export {
  ChapterMultiSelect,
  GoalMultiSelect
};
//# sourceMappingURL=/build/_shared/chunk-SF7PQNWV.js.map
