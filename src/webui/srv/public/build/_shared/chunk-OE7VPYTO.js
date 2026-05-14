import {
  GoalSelect
} from "/build/_shared/chunk-6SJK4Y2K.js";
import {
  AspectSelect
} from "/build/_shared/chunk-OIJ3E3DH.js";
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
  Box_default,
  Stack_default,
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

// ../core/jupiter/core/life_plan/components/life-plan-associations.tsx
var import_react3 = __toESM(require_react(), 1);

// ../core/jupiter/core/life_plan/sub/chapters/components/select.tsx
var import_react = __toESM(require_react(), 1);
function ChapterSelect(props) {
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
  function selectedChapterToOption() {
    const selectedChapterRefId = props.value || props.defaultValue;
    if (!selectedChapterRefId) {
      return null;
    }
    const chapter = allChaptersByRefId.get(selectedChapterRefId);
    if (!chapter) {
      return null;
    }
    return {
      chapter_ref_id: selectedChapterRefId,
      label: chapter.name,
      bigName: chapter.name
    };
  }
  const [selectedChapter, setSelectedChapter] = (0, import_react.useState)(
    selectedChapterToOption()
  );
  (0, import_react.useEffect)(() => {
    const selectedChapterRefId = props.value || props.defaultValue;
    if (!selectedChapterRefId) {
      setSelectedChapter(null);
      return;
    }
    const chapter = allChaptersByRefId.get(selectedChapterRefId);
    if (!chapter) {
      setSelectedChapter(null);
      return;
    }
    setSelectedChapter({
      chapter_ref_id: selectedChapterRefId,
      label: chapter.name,
      bigName: chapter.name
    });
  }, [props.value, props.defaultValue, props.allChapters, allChaptersByRefId]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        options: allChaptersAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled || allChaptersAsOptions.length === 0,
        sx: autocompleteSingleLineSx,
        value: selectedChapter,
        onChange: (_, v) => {
          setSelectedChapter(v);
          if (props.onChange) {
            props.onChange(v?.chapter_ref_id ?? null);
          }
        },
        isOptionEqualToValue: (o, v) => o.chapter_ref_id === v.chapter_ref_id,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/life_plan/sub/chapters/components/select.tsx",
          lineNumber: 141,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/chapters/components/select.tsx",
        lineNumber: 118,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedChapter?.chapter_ref_id ?? ""
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/chapters/components/select.tsx",
        lineNumber: 144,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/chapters/components/select.tsx",
    lineNumber: 117,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/life_plan/components/life-plan-associations.tsx
function LifePlanAssociations(props) {
  const inputsEnabled = props.inputsEnabled;
  const isBigScreen = useBigScreen();
  const aspectName = props.aspectName ?? "aspect";
  const chapterName = props.chapterName ?? "chapter";
  const goalName = props.goalName ?? "goal";
  const chapterOnlyForSelectedAspect = props.chapterOnlyForSelectedAspect ?? true;
  const rootAspect = props.allAspects.find((p) => !p.parent_aspect_ref_id);
  const allChaptersByRefId = (0, import_react3.useMemo)(
    () => new Map(props.allChapters.map((chapter) => [chapter.ref_id, chapter])),
    [props.allChapters]
  );
  const [selectedAspect, setSelectedAspect] = (0, import_react3.useState)(
    props.aspectValue ?? props.aspectDefaultValue ?? rootAspect?.ref_id ?? ""
  );
  const [selectedChapter, setSelectedChapter] = (0, import_react3.useState)(
    props.chapterValue ?? props.chapterDefaultValue ?? null
  );
  const [selectedGoal, setSelectedGoal] = (0, import_react3.useState)(
    props.goalValue ?? props.goalDefaultValue ?? null
  );
  (0, import_react3.useEffect)(() => {
    setSelectedAspect(
      props.aspectValue ?? props.aspectDefaultValue ?? rootAspect?.ref_id ?? ""
    );
    setSelectedChapter(props.chapterValue ?? props.chapterDefaultValue ?? null);
    setSelectedGoal(props.goalValue ?? props.goalDefaultValue ?? null);
  }, [
    props.aspectValue,
    props.aspectDefaultValue,
    props.chapterValue,
    props.chapterDefaultValue,
    props.goalValue,
    props.goalDefaultValue,
    rootAspect
  ]);
  function onAspectChange(value) {
    setSelectedAspect(value);
    setSelectedChapter(null);
    setSelectedGoal(null);
    props.onAspectChange?.(value);
    props.onChapterChange?.(null);
    props.onGoalChange?.(null);
  }
  function onChapterChange(value) {
    setSelectedChapter(value);
    if (!chapterOnlyForSelectedAspect && value) {
      const chapter = allChaptersByRefId.get(value);
      if (chapter && chapter.aspect_ref_id !== selectedAspect) {
        setSelectedAspect(chapter.aspect_ref_id);
        setSelectedGoal(null);
        props.onAspectChange?.(chapter.aspect_ref_id);
        props.onGoalChange?.(null);
      }
    }
    props.onChapterChange?.(value);
  }
  function onGoalChange(value) {
    setSelectedGoal(value);
    props.onGoalChange?.(value);
  }
  return /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, useFlexGap: true, children: [
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxDEV(
      AspectSelect,
      {
        name: aspectName,
        label: "Aspect",
        inputsEnabled,
        disabled: false,
        allAspects: props.allAspects,
        value: selectedAspect,
        onChange: onAspectChange
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
        lineNumber: 119,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
      lineNumber: 118,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxDEV(
      ChapterSelect,
      {
        name: chapterName,
        label: "Chapter",
        inputsEnabled,
        disabled: false,
        onlyForAspect: chapterOnlyForSelectedAspect ? selectedAspect : void 0,
        allChapters: props.allChapters,
        value: selectedChapter,
        onChange: onChapterChange,
        birthday: props.birthday,
        today: props.today,
        allMilestones: props.allMilestones,
        allAspects: props.allAspects
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
        lineNumber: 131,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
      lineNumber: 130,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Box_default, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxDEV(
      GoalSelect,
      {
        name: goalName,
        label: "Goal",
        inputsEnabled,
        disabled: false,
        onlyForAspect: selectedAspect,
        allGoals: props.allGoals,
        value: selectedGoal,
        onChange: onGoalChange
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
        lineNumber: 150,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
      lineNumber: 149,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/components/life-plan-associations.tsx",
    lineNumber: 117,
    columnNumber: 5
  }, this);
}

export {
  LifePlanAssociations
};
//# sourceMappingURL=/build/_shared/chunk-OE7VPYTO.js.map
